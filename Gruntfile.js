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
                banner: '/* Gmu v<%= pkg.version %> - @files */'
            },

            all: {
                cwd: '<%= concat_gmu.options.srcPath %>',

                src: [ 'widget/*.js' ],
                dest: 'dist/gmu.js'
            }
        },

        fis: {

            options: {
                srcPath: '<%= concat_gmu.options.srcPath %>',
                cssPath: '<%= concat_gmu.options.cssPath %>'
            },

            all: {
                cwd: '<%= fis.options.srcPath %>',

                src: [ 'widget/*.js' ],
                dest: 'dist/fis/<%= pkg.version %>/widget'
            }
        },

        uglify: {
            options: {
                report: 'min',
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
            },
        },

        size: {
            widget: {
                cwd: 'src/widget/',
                src: ['**/*.js']
            },

            dist: {
                cwd: 'dist/',
                src: ['gmu.js', 'zepto.js']
            }
        },

        qunit: {
            options: {
                url: 'http://localhost/gmu/test/fet/bin/run.php?case='
            },
            
            modules: {
                cwd: 'test/',
                src: [ '**/*.js', '!fet/**/*.js', '!mindmap/**/*.js' ]
            },

            slider: {
                cwd: 'test/',
                src: 'widget/slider/*.js'
            }
        }
        
    });

    // 加载build目录下的所有task
    grunt.loadTasks( 'tasks' );

    // 负责初始化和更新submodule
    grunt.loadNpmTasks('grunt-update-submodules');

    // 负责合并zepto.js
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    // 负责压缩js
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    // 负责报告文件大小
    grunt.loadNpmTasks( 'grunt-size' );

    // 负责代码规范检测
    grunt.loadNpmTasks( 'grunt-jsbint' );

    // Default task(s).
    grunt.registerTask( 'default', ['update_submodules', 'concat', 'concat_gmu', 'uglify'] );

    grunt.registerTask( 'test', ['qunit']);

};