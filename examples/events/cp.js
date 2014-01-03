var spawn = require('child_process').spawn
var ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

ls.stderr.on('data', function (data) {
  console.error('stderr: ' + data);
});

ls.on('close', function (code) {
  console.log('child process exited with code ' + code);
});