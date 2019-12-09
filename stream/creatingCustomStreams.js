const { Readable, Writable, pipeline } = require('stream');

/**
 * Creating streams via their constructors
 * The simple enough solution
 */
const getTick = _ => {
  const ticker = new Readable({
    objectMode: true,
    read(size) {}
  });

  setInterval(_=> {
    ticker.push({ time: new Date() });
  }, 1000);

  return ticker;
};

const renderTicks = _ => new Writable({
  objectMode: true,
  write(chunk, encoding, callback) {
    console.log(`> ${chunk.time}`);
    callback();
  }
});

pipeline(
  getTick(),
  renderTicks(),
  err => err && console.error(err),
);
