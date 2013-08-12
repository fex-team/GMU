(function() {
    'use strict';

    var path = require( 'path' ),
        glob = require( 'glob' ),
        file = require( 'grunt/lib/grunt/file' );

    function buildComponents( opts, files ) {
        var prefix = path.resolve( opts.srcPath ),
            cssPrefix = path.resolve(opts.cssPath),
            ret = [],
            hash = {},
            parse = function ( filepath ) {
                var css = {},
                    content,
                    cssPath,
                    exists,
                    depends,    // dependencies
                    item,
                    matches;

                // 如果文件不存在，则直接跳过, 同时从数组中过滤掉
                // 或者已经处理过也跳过
                if (!(exists = file.exists(path.join(prefix, filepath))) ||
                        hash.hasOwnProperty(filepath)) {

                    return exists;
                }

                content = file.read(path.join(prefix, filepath));

                // 读取文件内容中对js的依赖 格式为：@import core/zepto.js
                matches = content.match(/@import\s(.*?)$/im);
                if (matches) {
                    depends = matches[1]

                        // 多个依赖用道号隔开
                        .split(/\s*,\s*/g);

                    depends.forEach(parse);
                }

                // 查找css文件，对应的目录在assets目录下面的widgetName/widget.css
                cssPath = filepath.replace(/\.js$/, '.css');

                // 检查骨架css是否存在
                if (file.exists(path.join(cssPrefix, cssPath))) {
                    css.structor = cssPath;
                }

                // 查找themes
                glob.sync(cssPath.replace(/\.css$/, '.*.css'),
                        {cwd: cssPrefix})
                    .forEach(function (item) {
                        var m = item.match(/\.([^\.]*)\.css$/i);
                        m && ~opts.availableThemes.indexOf(m[1]) && (css[m[1]] = item );
                    });

                // 读取文件内容中对css的依赖 格式为：@importCSS loading.css
                matches = content.match(/@importCSS\s(.*?)$/im);
                if (matches) {
                    css.dependencies = matches[1]

                        // 多个依赖用道号隔开
                        .split(/\s*,\s*/g)
                        .map(function (item) {
                            var ret = {};

                            // 可能只有骨架css存在，也可能只有主题css存在
                            file.exists(path.join(cssPrefix, item)) && 
                                    (ret.structor = item);

                            glob.sync(item.replace(/\.css$/, '.*.css'),
                                    {cwd: cssPrefix})

                                .forEach(function (item) {
                                    var m = item.match(/\.([^\.]*)\.css$/i);
                                    m && ~opts.availableThemes.indexOf(m[1]) && (ret[m[1]] = item );
                                });
                            return ret;
                        });
                }

                item = {
                    path: filepath,
                    dependencies: depends,
                    css: css
                };

                // 将path作为key保存在hash表中，以避免重复解析
                hash[filepath] = item;
                ret.push(item);

                return true;
            };

        files.filter(parse);

        return ret;
    }

    module.exports = buildComponents;
})();