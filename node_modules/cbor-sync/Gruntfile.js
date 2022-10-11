var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mochaTest: {
			test: {
				src: ['test/**/*.js']
			}
		}
	});

	// Default task(s).
	grunt.registerTask('default', 'mochaTest');
};