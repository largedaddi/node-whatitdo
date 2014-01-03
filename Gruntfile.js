module.exports = function (grunt) {

	grunt.initConfig({
		ejs: {
			master: {
				options: {
					initScript: 'master.js'
				},
				src: ['views/common.ejs'],
	      dest: 'site/master.html',
	      expand: false,
			},
			thrall: {
				options: {
					initScript: 'thrall.js'
				},
				src: ['views/common.ejs'],
				dest: 'site/thrall.html',
				expand: false,
			}
		},
		watch: {
			files: ['browser/*.js'],
			tasks: ['ejs']
		}
	});

	// Load Tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ejs');

	// Register Tasks
	grunt.registerTask('default', ['ejs']);
};