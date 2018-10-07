module.exports = function(grunt) {
	// Project configuration.
	//   grunt.initConfig({
	//     pkg: grunt.file.readJSON('package.json'),
	//     uglify: {
	//       options: {
	//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
	//       },
	//       build: {
	//         src: 'source/<%= pkg.name %>.js',
	//         dest: 'build/<%= pkg.name %>.min.js'
	//       }
	//     }
	//   });

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			build: {
				src: 'source/banner.js',
				dest: 'build/bundle.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! Grunt <%= grunt.template.today("yyyy-mm-dd") %> */ '
			},
			build: {
				src: 'build/bundle.js',
				dest: 'public/script/bundle.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');

	// Default task(s).
	grunt.registerTask('default', [
		'browserify',
		'uglify'
		]);
};