module.exports = function( grunt ) {

    var file = grunt.file,

        sprintf = require('./lib/sprintf'),

        fs = require('fs'),

        path = require('path'),

        uglify = require('uglify-js'),

        zlib = require('zlib-browserify'),


        handler = {
            filepath: function( filepath, dir ) {
                return filepath;
            },

            origin: function( filepath, dir ) {
                return beatifySize( fs.statSync( dir + filepath ).size );
            },

            uglify_gzip: function( filepath, dir ){
                var content = uglify.minify( dir + filepath ).code;
                return beatifySize( zlib.gzipSync(content).length );
            },

            removecomments: function( filepath, dir ) {
                var content = file.read( dir + filepath ),
                    size;

                file.write( dir + '.tmpSize', removeComments( content ) );

                size = fs.statSync( dir + '.tmpSize' ).size;

                file.delete(dir + '.tmpSize');

                return beatifySize( size );
            },

            uglify: function( filepath, dir ) {
                var content = uglify.minify( dir + filepath ).code,
                    size;

                file.write( dir + '.tmpSize', content);
                size = fs.statSync( dir + '.tmpSize' ).size;
                file.delete(dir + '.tmpSize');

                return beatifySize( size );
            },

            gzip: function( filepath, dir ){
                var content = file.read( dir + filepath );
                return beatifySize( zlib.gzipSync(content).length );
            }
        },

        header = {
            'filepath': 'File Path',
            'origin': 'Original',
            'removecomments': 'Remove Comments',
            'uglify': 'Uglify',
            'gzip': 'Gzip',
            'uglify_gzip': 'Uglify & Gzip'
        };


    function beatifySize( size ) {
        var units = ['B', 'KB', 'MB', 'TB'],
            unit = units.shift();

        while (size > 1024 && units.length) {
            unit = units.shift();
            size = size / 1024;
        }

        return (unit === 'B' ? size : size.toFixed(2) ) + ' ' + unit;
    }

    function removeComments( content ) {
        var id = 0,
            protect = {};

        //js不支持平衡组，所以只能先把引号里面的内容先保护好
        content = content
            .replace(/("|').*?\1/g, function(m0){
                protect[id] = m0;
                return '\u0019'+(id++)+'\u0019';
            });

        //去掉注释
        content = content
            .replace(/\s*\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')

            // 删除空行中的空白字符
            .replace(/^ +$/gm, '')

            // 删除首尾的空行
            .replace(/^\n+/, '')
            .replace(/^\n+/, '')

            // 删除多余的空行
            .replace(/\n{2,}/g, '\n');

        //还原受保护的内容
        content = content
            .replace(/\u0019(\d+)\u0019/g, function( m0, m1 ) {
                return protect[m1];
            });

        return content;
    }

    function outputRows( rows ) {
        var maxLen = [],
            strs = [],
            str,
            sep;

        rows[0].forEach(function( cell, i){
            maxLen[i] = cell.length;
        });

        rows.forEach(function(row){
            row.forEach(function(cell, i){
                if( cell.length > maxLen[i]) {
                    maxLen[i] = cell.length;
                }
            });
        });

        rows.forEach(function(row, i){
            sep = i === 0 ? '^' : '|';
            str = sep + ' ';
            row.forEach(function( cell, j ) {
                str += sprintf('%-' + maxLen[j] + 's', cell) + ' ' + sep + ' ';
            });

            strs.push(str);
        });

        grunt.log.writeln( strs.join('\n') );     
    }

    grunt.registerMultiTask('size', 'Report file size.', function() {
        var opts = this.options({
                cols: [ 'filepath', 'origin', 'removecomments', 'uglify', 'uglify_gzip' ]
            });

        this.files.forEach(function( f ) {
            var cwd = f.cwd || '',
                files,
                rows,
                row,
                cols;

            files = f.src.filter(function( filepath ){

                // Warn on and remove invalid source files (if nonull was set).
                if ( !grunt.file.exists( cwd + filepath ) ) {
                    grunt.log.warn( 'Source file "' + filepath + '" not found.' );
                    return false;
                } else {
                    return true;
                }
            });

            if ( files.length ) {
                rows = [];
                cols = opts.cols;

                // 加入Header
                row = [];
                cols.forEach(function(info){
                    row.push( header[info] );
                });
                rows.push( row );

                files.forEach(function(filepath){
                    row = [];

                    cols.forEach(function(info){
                        row.push( handler[info] ? handler[info].call(header, filepath, cwd) : '' );
                    });
                    rows.push( row );
                });

                outputRows( rows );
            }       
        });
    });
};