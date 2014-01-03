var fs = require('fs');
var source = fs.createReadStream(__filename);
var target = fs.createWriteStream('copy.js');
source.pipe(target);