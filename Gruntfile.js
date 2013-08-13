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

        doc: {
            options: {
                cwd: './src/',
                files: [ 'core/*.js', 'widget/popover/*.js', 'zeptodoc/core.js', 'zeptodoc/ajax.js', 'zeptodoc/*.js'],
                theme: 'gmu',
                outputDir: './doc'
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
            options: {
                jshintrc: '.jshintrc'
            },

            all: ['src/**/*.js'],

            slider: ['src/widget/slider/*.js'],

            temp: [
                'src/core/*.js',
                'src/widget/dropmenu/*.js',
                'src/widget/slider/*.js',
                'src/widget/popover/*.js'
            ]
        },

        size: {
            widget: {
                cwd: 'src/widget/',
                src: ['**/*.js']
            },

            dist: {
                cwd: 'dist/',
                src: ['gmu.js', 'zepto.js']
            },

            iscroll: {
                cwd: 'src/extend/',
                src: ['iscroll.js','iscroll_raw.js']
            },

            temp: {
                cwd: 'src/',
                src: [
                    'core/*.js',
                    'extend/*.js',
                    'widget/dropmenu/*.js',
                    'widget/slider/*.js',
                    'widget/popover/*.js'
                ]
            }
        },

        smart_cov: {
            options: {
                src: 'src',
                dest: 'src_cov'
            }
        },

        fet: {
            options: {
                url: 'http://localhost/GMU/test/fet/bin/run.php?case=',
                cov: true
            },

            all: {
                cwd: 'test/',
                src: [ '**/*.js', '!fet/**/*.js', '!mindmap/**/*.js' ]
            },

            temp: {
                cwd: 'test/',
                src: ['core/*.js'
                    , 'extend/fix.js'
                    , 'extend/highlight.js'
                    // , 'extend/imglazyload.js'
                    , 'extend/offset.js'
                    , 'extend/parseTpl.js'
                    , 'extend/position.js'
                    , 'extend/throttle.js'
                    , 'widget/add2desktop/*.js' // 在phantom中无法模拟IOS，所以跑不出结果
                    , 'widget/button/*.js'
                    , 'widget/calendar/*.js'
                    , 'widget/dialog/*.js'
                    , 'widget/dropmenu/*.js'
                    , 'widget/gotop/*.js'
                    , 'widget/panel/*.js'
                    , 'widget/popover/*.js'
                    , 'widget/progressbar/*.js'
                    // , 'widget/refresh/*.js'
                    , 'widget/slider/*.js'
                    , 'widget/suggestion/*.js'
                    , 'widget/navigator/*.js'
                    , 'widget/toolbar/*.js'
                    ]
            }
        },

        demo: {
            options: {
                cwd: './examples/widget/',
                files: '**/*.html',
                output: './examples/demos.js'
            }
        },

        testDownload: {
            options: {
                url: 'http://localhost/GMU/test.html'
            },
            GMU: {

            }
        }

    });

    // 加载build目录下的所有task
    grunt.loadTasks( 'tasks' );

    // 负责初始化和更新submodule
    grunt.loadNpmTasks( 'grunt-update-submodules' );

    // 负责合并zepto.js
    grunt.loadNpmTasks( 'grunt-contrib-concat' );

    // 负责压缩js
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    // 负责报告文件大小
    grunt.loadNpmTasks( 'grunt-size' );

    // 负责代码规范检测
    grunt.loadNpmTasks( 'grunt-jsbint' );

    // Default task(s).
    grunt.registerTask( 'default', [ 'jsbint:all', 'update_submodules', 'concat',
            'concat_gmu', 'uglify', 'smart_cov', 'fet:all'] );

    grunt.registerTask( 'test', [ 'update_submodules', 'concat', 'concat_gmu',
            'smart_cov', 'fet:temp' ]);

    grunt.registerTask( 'download', ['testDownload'] );

};