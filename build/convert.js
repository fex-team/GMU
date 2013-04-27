/**
 * @fileOverview 简单的markdown，代码格式转换工具
 * 使用方法 `node convert.js ../_standard/README.md`
 *
 */
(function(){
    'use strict';

    var files = [],
        path = require('path'),
        fs = require('fs'),
        argv = process.argv,
        len = argv.length,
        i = 2;

    for( ; i < len ; i++ ) {
        files.push( argv[ i ] );
    }

    if( files.length ) {

        files.forEach(function( file ) {
            var content = fs.readFileSync( file, 'utf-8'),
                

            content = content.replace(/^```.*\n([\s\S]+?)^```/mg, function(m0, m1){
                return ('\n' + m1).replace(/^/mg, '    ');
            });

            fs.writeFileSync( file, content, 'utf-8');
        });
    } else {
        console.log('请指定文件');
    }

})();