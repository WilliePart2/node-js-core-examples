const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(
  path.resolve(__dirname, './files/readStreamData.txt')
);

readStream.on('data', buffer => {
  console.log(buffer.toString());
});

readStream.on('end', _ => {
  console.log('File reading is finished');
});

readStream.on('close', _ => {
  console.log('stream was closed');
});

readStream.on('error', err => {
  console.log('some error is happened');
  console.error(err);
});
