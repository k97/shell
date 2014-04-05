"use strict";
var LIVERELOAD_PORT = 35729; //def. PORT number 35729
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function (grunt) {
    //---------To inject Bower Dependency directly into project files---------
    // ** Need to work on issues while implementation **
    //grunt.loadNpmTasks('grunt-bower-install');


    //---------------------------load all grunt tasks---------------------------
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

//---------Port and Localhost---------
        connect: {
            options: {
                port: 8080,
                // change this to '0.0.0.0' to access the server from outside
                // Setting hostname: 'localhost' limits files to specific system
                //where as hostname: '*' opens up the app to the network
                hostname: '*'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },

//---------Open Port---------
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },

//---------Watch files for Changes---------
        watch: {
            options: {
                nospawn: true
            },
            less: {
                files: ['app/less/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/css/{,*/}*.css',
                    'app/less/{,*/}*.less',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

//---------JSHint for JS files---------
        jshint: {
                all: ['app/scripts/*.js']                           //'Gruntfile.js', 'app/scripts/*.js'
        },


//---------CONCAT JS files **config to requirement---------
        concat: {
            task: {
                files: [
                    {src: ['app/scripts/*.js','app/scripts/vendor/*.js'], dest: 'dest/core.js'}
                ],
                },
        },

//---------Obfuscate 'dest' JS files after CONACT---------
        uglify: {
              options: {
                mangle: {toplevel: true},
                squeeze: {dead_code: false},
                codegen: {quote_keys: true}
              },
              task: {
                src: 'dest/core.js',
                dest: 'build/core.min.js'
              }
            },


//---------LESS Configs---------
        less: {
            server: {
                options: {
                    paths: ['app/less/*.less', 'app/less']
                },
                files: {
                    'app/css/core.css': 'app/less/core.less'
                }
            }
        },

//---------CSS Minification---------
        cssmin: {
            'myCSSTask': {
                files: {
                    'build/core.min.css': [ 'app/css/core.css']
                }
            }
        }

    });//initConfig



     //---------By default, run server and with the port---------
    grunt.registerTask('default', ['server', 'open']);

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'less:server',
            'jshint',
            'uglify',
            'concat',
            'connect:livereload',
            'open',
            'watch',
            'cssmin'
        ]);//grunt.task.run
    });//registerTask

};