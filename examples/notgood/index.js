
var http = require('http');

http.createServer(function (req, res) {

	while(true);

	res.end('HEYYYYY');

}).listen(9002);

console.log('listening on port 9002');


function HEYYYYY (argument) {
	// body...
}

module.exports = HEYYYYY;


var HEYYYYY = require('./HEYYYYY');