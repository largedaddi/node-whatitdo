var YouTubeDownloader = require('./youTubeDownloader');

var downloader = new YouTubeDownloader();

downloader.on('begin', function onDownloadBegin (videoId) {
	console.log('Started downloading %s', videoId);
});

downloader.on('done', function onDownloadDone (videoId) {
	console.log('Done downloading %s', videoId);
});

downloader.download('id983928');