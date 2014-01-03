var events = require('events');
var Util = require('util');
var EventEmitter = events.EventEmitter;

module.exports = YouTubeDownloader;

Util.inherits(YouTubeDownloader, EventEmitter);

function YouTubeDownloader () {
	EventEmitter.call(this);
}

YouTubeDownloader.prototype.download = function (videoId) {
    this.emit('begin', videoId);    
    
    var self = this;
    setTimeout(function() {
        self.emit('done', videoId);
    }, 3000);    
};