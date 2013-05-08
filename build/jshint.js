/**
 * @fileOverview 规范检测工具
 * @desc 
 * jshint工具说明
 * ================================
 * `node build jshint`将检测所有config.json中的所有presets
 * `node build jshint presetName...` 只检测config.json中对应的preset
 * `node build jshint filePath...` 只检测指定的文件
 */
(function() {
    "use strict";

    var jshint = require('jsbint').JSBINT,
        helper = require('./util/helper'),
        file = require('./util/file'),
        q = require('q'),
        glob = require('glob'),
        config = file.loadConfig('build/config.json'),
        sprintf = require('./util/sprintf'),
        path = require('path'),
        run;

    function report(results) {
        var keys = Object.keys(results), 
            str = '',
            errors,
            len;

        keys.forEach( function(filename) {
            str += str?'\n':'';

            errors = results[filename];
            len = errors.length;

            str += sprintf('\n[ ✗: %s, errors: %d ]\n', filename, len);

            str += errors.map(function( error ) {
                return sprintf('%5d,%3d: %s', error.line, error.character, error.reason);
            }).join('\n') + '\n';
        });

        if( str ) {
            console.log( str );
        } else {
            console.log( '✓ jshint检测通过, 没有错误。' );
        }
    }

    function lint( opts, files ) {
        var globals,
            results = {};

        if( opts.globals ) {
            globals = opts.globals;
            delete opts.globals;
        }

        if( !Array.isArray( files ) ) {
            files = [ files ];
        }

        files.forEach(function( filename ) {
            var content = file.read( filename );

            // Remove potential Unicode BOM.
            content = content.replace(/^\uFEFF/, "");

            if ( !jshint(content, opts, globals) ) {

                jshint.errors.forEach(function (err) {
                    if (err) {
                        results[ filename ] = results[ filename ] || [];
                        results[ filename ].push( err );
                    }
                });
            }
        });

        return results;
    }

    function findJshintRC( filename ) {
        var folder,
            result;

        filename = filename.replace(/[^\/]*$/, 'a.js');
        folder = path.dirname(filename || './a.js');
        folder = path.resolve(folder);

        while(folder!= path.dirname(folder)) {
            if( file.exists(folder + path.sep + '.jshintrc') ) {
                result = folder + path.sep + '.jshintrc';
                break;
            }
            folder = path.dirname(folder);
        }

        return result;
    }

    //提供直接调用
    run = exports.run = function() {
        var presets = config.jshint,
            targets = {},
            dynamic = 0,
            i = 0,
            len = this.args.length-1,
            arg;

        for( ; i < len; i++ ) {
            arg = this.args[i];

            if( presets[arg] ) {
                targets[arg] = presets[arg];
            } else {
                targets['$dynamic_'+dynamic++] = {
                    src: [arg],
                    config: findJshintRC(arg)
                }
            }
        }

        if( !i ) {
            Object.keys(presets).forEach(function( key ){
                targets[key] = presets[key];
            });
        }

        return q

            // 收集所有的js
            .all(Object.keys(targets).map(function(key) {
                var preset = targets[key],
                    opts;

                return q
                    .all(preset.src.map(function(file) {
                        return q.nfcall(glob, file);
                    }))

                    // 合并，并去重
                    .then(function(results) {

                        //合并文件
                        return results

                            // 摊平数组
                            .reduce(function(prefix, now) {
                                return prefix.concat(now);
                            })

                            // 去重
                            .filter(function(item, i, me) {
                                return me.indexOf(item) === i;
                            });
                    })

                    // 解析jshint配置项
                    .then( helper.curry( lint, file.loadConfig( preset.config ) ) );
            }))
            .then(function(results) {
                results.forEach(report);
            });
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('jshint')
            .description('规范检测工具')
            .action(run.bind(cli));
    };
})();