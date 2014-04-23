module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            source: {
                files: ['Gruntfile.js', 'src/**/*.js', 'examples/**/*.js'],
                tasks: ['build']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'examples/**/*.js']
        },
        docco: {
            docs: {
                src: ['src/**/*.js'],
                options: {
                    output: 'examples/api-docs/'
                }
            },
            examples: {
                src: ['examples/js/**/*.js'],
                options: {
                    output: 'examples/example-docs/'
                }
            }
        },
        copy: {
            adapters: {
                files: [
                    {expand: true, cwd: 'src/adapters', src: ['*.js'], dest: 'dist/'}
                ]
            },
            'examples-libs': {
                files: [
                    {expand: true,
                     cwd: 'bower_components',
                     src: ['**'],
                     dest: 'examples/.components'},
                    {expand: true,
                     cwd: 'dist',
                     src: ['**'],
                     dest: 'examples/.angular-anydialog'}
                ]
            }
        },
        concat: {
            core: {
                files: {
                    'dist/angular-anydialog.js': ['src/*.js']
                }
            },
            adapters: {
                files: {
                    'dist/angular-anydialog-adapters.js': ['src/adapters/*.js']
                }
            },
            all: {
                files: {
                    'dist/angular-anydialog-all.js': ['src/*.js', 'src/adapters/*.js']
                }
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/angular-anydialog.min.js': ['dist/angular-anydialog.js'],
                    'dist/angular-anydialog-adapters.min.js': ['dist/angular-anydialog-adapters.js'],
                    'dist/angular-anydialog-all.min.js': ['dist/angular-anydialog-all.js']
                }
            }
        },
        'http-server': {
            dev: {
                root: 'examples/',
                port: 8282,
                host: '127.0.0.1',
                cache: 0,
                showDir: true,
                autoIndex: true,
                defaultExt: 'html',
                runInBackground: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('build', ['jshint',
                                 'docco',
                                 'copy:adapters',
                                 'concat',
                                 'uglify',
                                 'copy:examples-libs']);

    grunt.registerTask('default', ['build',
                                   'http-server:dev',
                                   'watch:source']);
};
