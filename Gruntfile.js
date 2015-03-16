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
                        'docs',
                        'publish_docs',
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


        html2js: {
            dist: {
                options: {
                    module: 'zeus.widgets.templates',
                    base: 'src',
                    useStrict: true,
                    singleModule: true,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                files: [ {
                    expand: true,
                    src: [ 'src/**/*.html' ],
                    dest: '.tmp/js',
                    ext: '.html.js'

                } ]
            }
        },

        concat: {
            dist_js: {
                src: [ 'src/js/index.js', 'src/js/*.js' ],
                dest: '.tmp/js/zeus-widgets.js'
            },
            dist_tmpl: {
                src: [ '.tmp/js/src/html/*.html.js' ],
                dest: '.tmp/js/zeus-widgets.templates.js'
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
            'Symantec Corporation \n' +
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
                    '.tmp/js/zeus-widgets.js'
                ],
                'dist/js/zeus-widgets.templates.min.js': [
                    '.tmp/js/zeus-widgets.templates.js'
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
                        'Symantec Corporation \n' +
                        '<%= pkg.name %> - v<%= pkg.version %>.' +
                        '<%= process.env.BUILD_NUMBER %> */\n'
                },

                target: {
                    files: {
                        'dist/css/zeus-widgets.min.css': [ 'dist/css/*.css' ]
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
                        src: '*.js',
                        dest: '.tmp/js'
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
                        'dist/css/zeus-widgets.css'
                    ],
                    scripts: [
                        'externs/libs/jquery.js',
                        'externs/libs/angular.js',
                        'externs/libs/angular-animate.js',
                        'dist/js/zeus-widgets.templates.js',
                        'dist/js/zeus-widgets.js'
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

                //
                // docs: {
                //     files: [
                //     {
                //         expand: true,
                //         flatten: true,
                //         cwd: '.tmp/concat/scripts',
                //         dest: 'docs/js',
                //         src: [ '*.js' ]
                //     },
                //     {
                //         expand: true,
                //         flatten: true,
                //         cwd: 'dist/css',
                //         dest: 'docs/css',
                //         src: [ '*.css' ]
                //     } ]
                // },

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
                            cwd: '.tmp/css',
                            dest: 'dist/css',
                            src: [ '*.css' ]
                        },
                        {
                            expand: true,
                            flatten: true,
                            cwd: 'src/html',
                            dest: 'dist/html',
                            src: [ '*.html' ]
                        },
                        {
                            expand: true,
                            flatten: true,
                            cwd: '.tmp/js',
                            dest: 'dist/js',
                            src: [ '*.js' ]
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
            'jscs',
            'jshint:test',
            'karma'
        ] );

        grunt.registerTask( 'docs', [
            'ngdocs'
        ] );

        grunt.registerTask( 'build', [
            'lint',
            'karma',
            'clean',
            'sass',
            'autoprefixer',
            'html2js',
            'concat',
            'ngAnnotate',
            'copy:build',
            'cssmin',
            'uglify',
            'docs',
            'sloc'
        ] );
    };
