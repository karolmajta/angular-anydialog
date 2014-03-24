module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            source: {
                files: ['Gruntfile.js', 'src/**/*.js', 'examples/**/*.js'],
                tasks: ['build'],
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'examples/**/*.js']
        },
        copy: {
            adapters: {
                files: [
                    {expand: true, cwd: 'src/adapters', src: ['*.js'], dest: 'dist/'}
                ]
            }
        },
        concat: {
            core: {
                files: {
                    'dist/angular-anymodal.js': ['src/*.js']
                }
            },
            adapters: {
                files: {
                    'dist/angular-anymodal-adapters.js': ['src/adapters/*.js']
                }
            },
            all: {
                files: {
                    'dist/angular-anymodal-all.js': ['src/*.js', 'src/adapters/*.js']
                }
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/angular-anymodal.min.js': ['dist/angular-anymodal.js'],
                    'dist/angular-anymodal-adapters.min.js': ['dist/angular-anymodal-adapters.js'],
                    'dist/angular-anymodal-all.min.js': ['dist/angular-anymodal-all.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['jshint', 'copy:adapters', 'concat', 'uglify']);
    grunt.registerTask('default', ['build', 'watch:source']);

};
