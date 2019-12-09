const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Readable, pipeline } = require('stream');
const { EOL } = require('os');

async function* iterateLineByLine(readable) {
  const rlIterable = readline.createInterface({
    input: readable,
    crlfDelay: Infinity,
  });

  /**
   * Line arrives without EOL character so to preserve rows structure
   * it is necessary no add one.
   */
  for await (const line of rlIterable) {
    yield Buffer.from(line + EOL);
  }
}

/**
 * Create readable stream from async generator
 * Could be created from either async or sync generator
 */
const lineByLineReadable = Readable.from(
  iterateLineByLine(
    fs.createReadStream(path.resolve(__dirname, './files/source.txt'))
  )
);

(async () => {
  try {
    await pipeline(
      lineByLineReadable,
      fs.createWriteStream(
        path.resolve(__dirname, './files/asyncIteratorOut.txt'),
      ),
    );
  } catch (e) {
    console.error(`Error happened while file reading: ${e.message()}`);
  }
})();
