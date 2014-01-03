var fs = require('fs');
var stream = fs.createReadStream(__filename, {encoding: 'utf8'});

function read() {
  var buf;
  while (buf = stream.read()) {
    console.log('Read from the file:', buf);
  }
}

stream.on('readable', read);

stream.once('end', function() {
  console.log('stream ended');
});