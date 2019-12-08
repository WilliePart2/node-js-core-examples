const fs = require('fs');
const path = require('path');

/**
 * Implementation one
 * While the loop will perform its work main thread will be blocked
 */
const writeTimes = (destination, data, encoding, times, callback) => {
  let ok = true;
  const write = () => {
    do {
      times--;
      times === 0
        ? destination.write(data, encoding, callback)
        : (ok = destination.write(data, encoding))
    } while(times > 0 && ok);
    if (times > 0) {
      destination.on('drain', write);
    }
  };
  write();
};

/**
 * Implementation two
 * Intended to be used with task splitting approach, when we divide big task into small pieces
 */

const write = (destination, data, encoding, callback) => {
  if (destination.write(data, encoding)) {
    /**
     * also could be used queueMicrotask to prevent starving of other code
     * event more I would recommend to use queueMicrotask
     * because with large amount of data to write such an implementation will effectively bock execution of other code
     */
    process.nextTick(callback);
    // setImmediate(callback); // also could be as a solution
  } else {
    destination.once('drain', callback);
  }
};

const writeTimesAsync = (destination, data, encoding, times, done) => {
  const localCallback = _ => {
    if (times-- === 0) {
      destination.end();
      done && done();
    } else {
      write(destination, data, encoding, localCallback);
    }
  };

  write(destination, data, encoding, localCallback);
};

// writeTimes(
//   fs.createWriteStream(path.resolve(__dirname, './files/writeData.txt')),
//   'hello',
//   'utf8',
//   1000
// );

writeTimesAsync(
  fs.createWriteStream(path.resolve(__dirname, './files/writeDataAsync.txt')),
  'hello',
  'utf8',
  1000
);
