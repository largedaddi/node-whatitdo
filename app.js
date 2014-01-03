var http =  require('http');
var express = require('express');
var io = require('socket.io');

var app = express();
var server = http.createServer(app);
var ioServer = io.listen(server);

var username = "slord";
var password = "slordrulez!";

app.use('/static', express.static(__dirname + '/static'));

var authenticationMiddleware = express.basicAuth(username, password);
app.get('/master', authenticationMiddleware, function (req, res) {
	res.sendfile(__dirname + '/site/master.html');
});

app.get('/thrall', function (req, res) {
	res.sendfile(__dirname + '/site/thrall.html');
});

var characters = [];
var masterSocket;

ioServer.sockets.on('connection', function onConnection (socket) {
	socket.on('master', function onMaster () {
		console.log('MASTER SOCKET!');
		masterSocket = socket;
	});

	// 
	// Characters

	socket.emit('load', characters);

	socket.on('new character', function onEnter (data) {
		characters.push(data);

		socket.set('character', data, function onSetReady () {
			socket.broadcast.emit('enter', data);
		});
	});

	socket.on('disconnect', function onDisconnect () {
		if (socket === masterSocket) {
			return;
		}

		socket.get('character', function onGetReady (err, character) {
			var index = characters.indexOf(character);
			characters.splice(index, 1);

			socket.broadcast.emit('exit', character.id);
		});
	});

	socket.on('move', function onMove (data) {
		socket.broadcast.emit('move', data);
		socket.get('character', function onGet (err, character) {
			var index = characters.indexOf(character);
			characters[index].position = data.destination;
		});
	});

	socket.on('speak', function onSpeak (data) {
		socket.broadcast.emit('speak', data);
	});

	socket.on('speakBackspace', function onSpeakBackspace (characterId) {
		socket.broadcast.emit('speakBackspace', characterId);
	});

	// 
	// Slides

	socket.on("slidechanged", function (data) {
      socket.broadcast.emit("slidechanged", data);
  });

});

// 
// kick it off

server.listen(9001);
