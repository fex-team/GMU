module.exports = function( grunt ) {
    var path = require( 'path' ),
        file = grunt.file;

    function concatComponents( opts, f, theme, models ) {

        if (typeof theme !== 'string') {
            models = theme;
            theme = 'default';
        }

        var js = [],
            css = [],
            // 存贮合并了哪些js文件
            jsFiles = [],

            // 存贮合并了哪些css文件
            cssFiles = [],

            // 存取css文件中的图片信息 key为url()括号中的值，value为原始图片路径
            images = {},
            prefix = path.resolve(opts.srcPath) + path.sep,
            cssPrefix = path.resolve(opts.cssPath) + path.sep,

            //hash表，key为js的路径，value为对应obj
            hash = {},
            rendered = {},

            readText = function(filepath){
                var content = file.read(filepath);

                if (typeof opts.process === 'function') {
                    content = opts.process(content, filepath);
                } else if (opts.process) {
                    content = grunt.template.process(content, opts.process);
                }

                if (opts.stripBanners) {
                    content = stripBanner(content, opts.stripBanners);
                }

                return content;
            },

            jsRender = function ( item ) {

                // 如果存在js依赖，先输出依赖
                if (item.dependencies) {
                    item.dependencies.forEach(function (item) {
                        hash[item.path] && jsRender(hash[item.path]);
                    });
                }

                // 如果已经输出过，不在重复输出
                if (rendered[item.path]) {
                    return;
                }

                jsFiles.push( item.path );

                js.push(readText(prefix + item.path));

                // 标明已经输出过
                rendered[item.path] = true;
            },

            readCss = function (obj) {
                var arr = [],
                    i = 0,
                    matches,
                    len,
                    url;

                obj.structor && arr.push(readText(cssPrefix + obj.structor)) &&
                        cssFiles.push(obj.structor);

                theme && obj[theme] &&
                        arr.push(readText(cssPrefix + obj[theme])) &&
                        cssFiles.push(obj[theme]);

                // 收集images
                matches = arr.join('\n').match(/url\(((['"]?)(?!data)([^'"\n\r]+?)\2)\)/ig);

                if (matches) {

                    for (len = matches.length; i < len; i++) {

                        // 苦恼，为何matches结果里面不带分组结果呢？
                        url = matches[i].match(
                                /url\(((['"]?)(?!data)([^'"\n\r]+?)\2)\)/i)[3];

                        images[url] = path.resolve(cssPrefix +
                                path.dirname(obj.structor || obj[theme]) +
                                path.sep + url);
                    }
                }

                css = css.concat( arr );
            },

            cssRender = function (item) {
                var obj;

                // 先输出js依赖对应的css
                if (item.dependencies) {
                    item.dependencies.forEach(function (item) {
                        hash[item.path] && cssRender(hash[item.path]);
                    });
                }

                obj = item.css;

                if (obj.dependencies) {
                    obj.dependencies.forEach(readCss);
                }

                readCss(obj);
            },

            replaceFn = function (m0, m1, m2) {
                return '-' + (~~m1 + 1) + '.' + m2;
            },

            dest,
            minDest,
            destDir,
            image,
            newName,
            renderedImages,
            banner;

        //生成hash表
        models.forEach(function (item) {
            hash[item.path] = item;
        });


        models.forEach(jsRender);
        models.forEach(cssRender);

        banner = opts.banner;
        dest = f.dest;

        file.write(dest,
                banner.replace(/@files/ig, jsFiles.join(', ')) + '\n' + js.join(opts.separator));

        grunt.log.writeln('✓ 生成 %s - %s ', dest, String(caculateSize(dest)).green );

        // 复制图片
        destDir = path.dirname(dest) + path.sep;

        //如果images目录已经存在，则删除，否则images目录下会自动生成很多新文件。
        file.isDir(destDir + 'images') && file.delete(destDir + 'images');

        css = css.join(opts.separator);

        renderedImages = {};
        for (image in images) {

            if( images.hasOwnProperty( image ) ) {
                newName = path.basename(image);

                // 如果文件名已经占用，则换个名字
                while (file.exists(destDir + 'images/' + newName)) {
                    if( renderedImages[newName] === images[image] ) {
                        break;
                    }
                    newName = newName
                            .replace(/(?:-(\d+))?\.(png|jpg|jpeg|gif)$/i,
                                    replaceFn);
                }

                renderedImages[newName] = images[image];
                file.write(destDir + 'images/' + newName,
                        file.read(images[image], {
                encoding: null
            }));

                css = strReplace('\\((\'|")?' +
                        image.replace(/\./g, '\\.') + '\\1\\)',
                            '(./images/' + newName + ')', css);
            }
        }

        dest = dest.replace(/\.js$/, '.css');
        file.write(dest,
                banner.replace(/@files/g, cssFiles.join(', ')) + '\n' + css );
        grunt.log.writeln('✓ 生成 %s - %s ', dest, String(caculateSize(dest)).green);
    }

    function strReplace( search, replace, subject) {
        var r = new RegExp(''+search, 'ig');
        return subject.replace( r, replace);
    }

    function caculateSize( file ) {
        var fs = require('fs'),
            size = fs.statSync(file).size,
            units = ['B', 'KB', 'MB', 'TB'],
            unit = units.shift();

        while (size > 1024 && units.length) {
            unit = units.shift();
            size = size / 1024;
        }

        return size.toFixed(2) + ' ' + unit;
    }

    function stripBanner(src, options) {
        if ( !options ) {
            options = {};
        }
        var m = [];
        if (options.line) {
            // Strip // ... leading banners.
            m.push('(?:.*\\/\\/.*\\r?\\n)*\\s*');
        }
        if (options.block) {
            // Strips all /* ... */ block comment banners.
            m.push('\\/\\*[\\s\\S]*?\\*\\/');
        } else {
            // Strips only /* ... */ block comment banners, excluding /*! ... */.
            m.push('\\/\\*[^!][\\s\\S]*?\\*\\/');
        }
        var re = new RegExp('^\\s*(?:' + m.join('|') + ')\\s*', '');
        return src.replace(re, '');
    }

    grunt.registerMultiTask('concat_gmu', '合并Gmu代码', function() {
        var opts = this.options({
                srcPath: '',
                cssPath: '',
                availableThemes: [ 'default', 'blue' ],
                banner: '',
                process: false,
                stripBanner: false,
                separator: grunt.util.linefeed
            }),
            build = require('./lib/parse'),
            files,
            components;

        this.files.forEach(function( f ) {
            var cwd = f.cwd;
            files = f.src.filter(function( filepath ){

                // Warn on and remove invalid source files (if nonull was set).
                if ( !grunt.file.exists( path.join( cwd, filepath ) ) ) {
                    grunt.log.warn( 'Source file "' + filepath + '" not found.' );
                    return false;
                } else {
                    return true;
                }
            });

            components = build( opts, files );

            concatComponents( opts, f, components );
        });
    });
};