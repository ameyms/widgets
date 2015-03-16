'use strict';
/* jshint camelcase: false */

module.exports = function ( grunt ) {

    require( 'load-grunt-tasks' )( grunt );
    require( 'time-grunt' )( grunt );

    // Define the configuration for all the tasks
    grunt.initConfig( {

        pkg: grunt.file.readJSON( 'package.json' ),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require( 'jshint-stylish' )
            },
            all: [
                'Gruntfile.js',
                'src/js/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: [ 'test/spec/{,*/}*.js' ]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [ {
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                } ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: [ 'last 2 version' ]
            },
            dist: {
                files: [ {
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                } ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: { },
            dist: {
                files: {
                    '.tmp/css/zeus-widgets.css': 'src/sass/index.scss'
                }
            }
        },


        concat: {
          dist: {
              src: [ 'src/js/*.js' ],
              dest: '.tmp/js/zeus-widgets.js'
          }
        },

        jscs: {
        src: [
                'app/js/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },


        uglify: {
            options: {
                banner: '/*! Copyright (C) <%= grunt.template.today("yyyy") %>. ' +
            'ZeusJS \n' +
            '<%= pkg.name %> - v<%= pkg.version %>.' +
            '<%= process.env.BUILD_NUMBER %> */\n',
                compress: {
                    drop_console: true
                },
                preserveComments: false
            },

            dist: {
              files: {
                'dist/js/zeus-widgets.min.js': [
                    'dist/js/zeus-widgets.js'
                ]
              }
            }

        },

            // The following *-min tasks produce minified files in the dist folder
            cssmin: {
                options: {
                    root: '.',
                    keepSpecialComments: 0,
                    banner: '/*! Copyright (C) <%= grunt.template.today("yyyy") %>. ' +
                        'ZeusJS \n' +
                        '<%= pkg.name %> - v<%= pkg.version %>.' +
                        '<%= process.env.BUILD_NUMBER %> */\n'
                },

                target: {
                    files: {
                        'dist/css/zeus-widgets.min.css': [ '.tmp/css/*.css' ]
                    }
                }
            },

            // ng-annotate tries to make the code safe for minification automatically
            // by using the Angular long form for dependency injection.
            ngAnnotate: {
                dist: {
                    files: [ {
                        expand: true,
                        cwd: '.tmp/js',
                        src: 'zeus-widgets.js',
                        dest: 'dist/js'
                    } ]
                }
            },

            ngdocs: {
                options: {
                    dest: 'docs',
                    html5Mode: false,
                    title: 'Zeus Widgets',
                    startPage: '/api',
                    editExample: false,
                    styles: [
                        'docs/css/zeus.css'
                    ],
                    scripts: [
                        'docs/js/vendor.js',
                        'docs/js/angular-animate.min.js',
                        'docs/js/zeus-ui.js'
                    ]
                },
                api: [
                  'src/js/*.js'
                ]
            },

            sloc: {
                'source-code': {
                    files: {
                        code: [
                            'src/js/*.js',
                            'src/sass/*.scss'
                        ]
                    }
                },
                tests: {
                    files: {
                        test: [
                            'spec/**/*.js',
                            'mock_views/*.html'
                        ]
                    }
                }
            },

            // Copies remaining files to places other tasks can use
            copy: {


                docs: {
                    files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.tmp/concat/scripts',
                        dest: 'docs/js',
                        src: [ '*.js' ]
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'dist/css',
                        dest: 'docs/css',
                        src: [ '*.css' ]
                    } ]
                },

                build: {
                    files: [
                        {
                            expand: true,
                            flatten: true,
                            cwd: 'src/sass',
                            dest: 'dist/sass',
                            src: [ '*.scss' ]
                        },
                        {
                            expand: true,
                            flatten: true,
                            cwd: 'src/html',
                            dest: 'dist/html',
                            src: [ '*.html' ]
                        }
                    ]
                }

            },


            // Test settings
            karma: {
                unit: {
                    configFile: 'karma.conf.js',
                    singleRun: true
                }
            },


            connect: {
                options: {
                    port: 9000,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: true,
                        base: [
                            '.tmp',
                            'src'
                        ]
                    }
                },
                test: {
                    options: {
                        port: 9001,
                        base: [
                            '.tmp',
                            'test',
                            'dist'
                        ]
                    }
                },
                dist: {
                    options: {
                        base: 'dist'
                    }
                }
            }
        } );


        grunt.registerTask( 'lint', [
            'jscs',
            'jshint:all'
        ] );

        grunt.registerTask( 'test', [
            'lint',
            'jshint:test',
            'karma'
        ] );

        grunt.registerTask( 'docs', [
            'copy:docs',
            'ngdocs'
        ] );

        grunt.registerTask( 'build', [
            'test',
            'clean:dist',
            'sass',
            'autoprefixer',
            'concat',
            'ngAnnotate',
            'copy:build',
            // 'docs',
            'cssmin',
            'uglify',
            'sloc'
        ] );
    };
