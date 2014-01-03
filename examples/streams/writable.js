var fs = require('fs');
var stream = fs.createWriteStream('out.txt');

var interval = setInterval(function() {
  stream.write((new Date()).toString());
}, 1000);

setTimeout(function() {
  clearInterval(interval);
  stream.end();
}, 5000);