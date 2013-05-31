/**
 * @fileOverview 生成文件大小报表
 */
(function(){
    'use strict';

    var path = require('path'),
        q = require('q'),
        fs = require('fs'),
        glob = require('glob'),
        file = require('./util/file'),
        sprintf = require('./util/sprintf'),
        config = file.loadConfig('build/config.json'),
        run;

    function gzfile( src, dest ) {
        var deferred = q.defer(),
            zlib = require('zlib'),
            gzip = zlib.createGzip(),
            inp = fs.createReadStream(src),
            out = fs.createWriteStream(dest);

        out.on('close', function() {
            deferred.resolve(true);
        });
        inp.pipe(gzip).pipe(out);

        return deferred.promise;
    }

    function reporter( files ) {
        var tmpFile = '.tmp',
            tmpFile2 = '.tmp2',
            row;

        if( !files.length ) {
            return ;
        }

        files
                .reduce(function( sofar, filename ) {
                    return sofar.then(function(){
                        row = [ '| %-40s | %-10s | %-15s | %-10s | %-15s |', filename ];
                        row.push( file.caculateSize( filename ) );

                        file.write(tmpFile, file.removeComments(file.read(filename)));
                        row.push( file.caculateSize( tmpFile ) );

                        file.write(tmpFile, file.minify(filename));
                        row.push( file.caculateSize( tmpFile ) );

                        return gzfile(tmpFile, tmpFile2)
                                .then(function(){
                                    row.push( file.caculateSize( tmpFile2 ) );
                                    console.log(sprintf.apply(null, row));
                                });
                    });
                }, q.resolve( true ).then(function(){
                    console.log(sprintf('^ %-40s ^ %-10s ^ %-15s ^ %-10s ^ %-15s ^', "File Name", "Original", "Remove Comments", "Uglify", "Uglify & GZ"));
                }))
                .then(function(){

                    // 删除临时文件
                    file.rmdir(tmpFile);
                    file.rmdir(tmpFile2);
                });
    }

    //提供直接调用
    run = exports.run = function() {
        var presets = config.size,
            targets = {},
            dynamic = 0,
            i = 0,
            len = this.args.length-1,
            arg;

        for( ; i < len; i++ ) {
            arg = this.args[i];

            if( presets[ arg ] ) {
                targets[ arg ] = presets[ arg ];
            } else {
                targets['$dynamic_'+dynamic++] = {
                    src: [arg]
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
                    .then(function( files ){
                        return files

                        // 摊平数组
                        .reduce(function(prefix, now) {
                            return prefix.concat(now);
                        });
                    });
            }))
            .then(function( files ) {

                // 合并，并去重
                return files

                    // 摊平数组
                    .reduce(function(prefix, now) {
                        return prefix.concat(now);
                    })

                    // 去重
                    .filter(function(item, i, me) {
                        return me.indexOf(item) === i;
                    });
            })
            .then(reporter);
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('size')
                .description('生成文件大小报表')
                .action(run.bind(cli));
    };
})();