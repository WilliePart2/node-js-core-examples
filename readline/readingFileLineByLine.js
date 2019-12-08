const readline = require('readline');
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { EOL } = require('os');

const pipeline = util.promisify(stream.pipeline);

/**
 * A lot of hassle!
 * @param {string} pathToFile
 */
const lineByLineStream = (pathToFile) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(pathToFile),
    crlfDelay: Infinity,
  });

  let allowedSize = 0;
  let internalBuffer = Buffer.from('');
  const read = new stream.Readable();

  const pause = _ => rl.pause();
  const resume = _ => rl.resume();
  const isPaused = _ => rl.input.isPaused();
  const write = bufData => {
    read.push(bufData);
    allowedSize -= bufData.length;
    allowedSize = allowedSize < 0 ? 0 : allowedSize;
  };

  read._read = size => {
    allowedSize += size;
    resume();
  };


  /**
   * Line arrives without EOL delimiter
   *
   * Implementation with back-pressure handling - line events could arrive faster that destination will be able to read them
   */
  rl.on('line', line => {
    const bufferSrt = Buffer.concat(
      [internalBuffer, line, EOL].map(Buffer.from)
    );

    if (isPaused()) {
      if (allowedSize) {
        resume();
        write(bufferSrt);
      } else {
        internalBuffer = bufferSrt;
      }
    } else {
      write(bufferSrt);
    }

    if (allowedSize <= 0 && !isPaused()) {
      pause();
    }
  });

  return read;
};

const main = async () => {
  try {
    await pipeline(
      lineByLineStream(path.resolve(__dirname, './files/source.txt')),
      fs.createWriteStream(path.resolve(__dirname, './files/out.txt')),
    );
  } catch (e) {
    console.error(e);
  }
};

main();
