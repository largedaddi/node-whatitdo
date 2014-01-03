var presentation = new World($('.container'), function () {
	this.socket.emit('master'); 
}, true);
