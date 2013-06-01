module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            zepto: {
                options: {
                    banner: '/* Zepto v1.0 - polyfill zepto detect event ajax form fx - zeptojs.com/license */\n',
                    dir: 'src/zepto/src/'
                },

                // polyfill zepto detect event ajax form fx
                src: [
                    '<%= concat.zepto.options.dir %>polyfill.js', 
                    '<%= concat.zepto.options.dir %>zepto.js', 
                    '<%= concat.zepto.options.dir %>detect.js', 
                    '<%= concat.zepto.options.dir %>event.js', 
                    '<%= concat.zepto.options.dir %>ajax.js', 
                    '<%= concat.zepto.options.dir %>form.js', 
                    '<%= concat.zepto.options.dir %>fx.js'
                ],

                dest: 'dist/zepto.js'
            }
        },

        concat_gmu: {

            options: {
                srcPath: 'src/',
                cssPath: 'assets/',
                aviableThemes: [ 'default', 'blue' ],
                banner: '/* Gmu v<%= pkg.version %> - @files */'
            },

            all: {
                cwd: '<%= concat_gmu.options.srcPath %>',

                src: [ 'widget/*.js' ],
                dest: 'dist/gmu.js'
            }
        },

        uglify: {
            options: {
                mangle: true
            },
            zepto: {
                options: {
                    banner: '<%= concat.zepto.options.banner%>'
                },

                src: 'dist/zepto.js',
                dest: 'dist/zepto.min.js'
            },
            gmu: {
                options: {
                    banner: '/* Gmu v<%= pkg.version %> */\n'
                },
                src: 'dist/gmu.js',
                dest: 'dist/gmu.min.js'
            }
        },

        jsbint: {
            all: ['src/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
    });

    // 加载build目录下的所有task
    grunt.loadTasks('tasks');

    // 负责初始化和更新submodule
    grunt.loadNpmTasks('grunt-update-submodules');

    // 负责合并zepto.js
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.loadNpmTasks('grunt-jsbint');

    // Default task(s).
    grunt.registerTask('default', ['update_submodules', 'concat', 'concat_gmu', 'uglify']);

    grunt.registerTask('debug', ['jsbint']);

};