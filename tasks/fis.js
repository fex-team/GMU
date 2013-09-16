module.exports = function( grunt ) {
    var file = grunt.file,
        path = require('path'),
        prefix,
        cssPrefix,
        fisBase,
        plugins;

    function isEmptyObject ( obj ) {
        for ( var key in obj ) {
            return false;
        }
        return true;
    }
    function buildForFis( files ){
        plugins = getPlugins(files);

        //如果已经存在则删除
        file.delete(fisBase);
        file.mkdir(fisBase);
console.log(files);
        files
            /*.filter(function( item ){
             return item.path !== 'core/zepto.js';
             })*/
            .forEach(createFiles);
    }

    function createFiles (item) {
        var fd = parseItem(item),
            skinfd = parseItemSkin(item),
            buffer, read, skin;

        if (fd) {
            //创建base及骨架组件文件
            ['js', 'css'].forEach(function (type) {
                read = fd.read;
                if (read && read[type]) {
                    buffer = (read[type + 'desp'] ? read[type + 'desp'].join('\n') : '') + file.read(read[type]) + '\n' + (read[type + 'exports'] ? read[type + 'exports'] : '');
                    //收集图片写入fis中
                    type === 'css' && (buffer = renderImages(buffer, path.dirname(read[type]), path.dirname(fisBase + fd.write[type])));
                    file.write(fisBase + fd.write[type], buffer);
                }

            });

            //创建commoncss文件
            if (fd.read.comcss) {
                fd.read.comcss.forEach(function (item, i) {
                    buffer = renderImages(file.read(item), path.dirname(item), path.dirname(fisBase + fd.write.comcss[i]));
                    file.write(fisBase + fd.write.comcss[i], buffer);
                })
            }
        }

        if (skinfd) {
            //创建组件皮肤文件
            for (skin in skinfd.read) {
                if (skinfd.read.hasOwnProperty(skin)) {
                    skinfd.read[skin].buffer && file.write(fisBase + skinfd.write[skin].js, skinfd.read[skin].buffer);    //写入js
                    if (skinfd.read[skin].css) {
                        buffer = renderImages(file.read(skinfd.read[skin].css), path.dirname(skinfd.read[skin].css), path.dirname(fisBase + skinfd.write[skin].css));
                        file.write(fisBase + skinfd.write[skin].css, buffer);    //写入css
                    }
                    skinfd.read[skin].plugin && skinfd.read[skin].plugin.forEach(function (buffer, i) {
                        file.write(fisBase + skinfd.write[skin].plugin[i], buffer);    //写入js
                    })
                }
            }
        }
    }

    function parseItem( item ) {
        var fis = parsePath(item.path),
            read = {},
            write = {};

        if(fis.base) {
            read.js = /^zepto.js$/i.test(item.path) ? path.resolve(config.dist.zepto.dest) : (prefix + item.path);
            read.jsdesp = [];
            read.jsexports = fis.exports;
            item.dependencies && item.dependencies.forEach(function (desp) {
                var desPath = parsePath(desp).require;
                if (desPath) {
                    read.jsdesp.push("require('gmu:" + desPath + "');");
                }
            });
            write.js = fis.base + '.js';

            if (item.css.structor) {    //解析骨架css
                read.css = cssPrefix + item.css.structor;
                write.css = fis.base + '.css';
            }

            if (item.css.dependencies) {    //生成commoncss
                read.comcss = [];
                write.comcss = [];
                read.cssdesp = [];
                item.css.dependencies.forEach(function (desp) {
                    for (var theme in desp) {
                        if (desp.hasOwnProperty(theme)) {
                            read.comcss.push(cssPrefix + desp[theme]);
                            read.cssdesp.push("@import url('/static/common/lib/gmu/commoncss/" + desp[theme] + "');");
                            write.comcss.push('commoncss' + path.sep + path.basename(desp[theme]));
                        }
                    }
                });

            }
        }

        return isEmptyObject(read) ? null: {
            read: read,
            write: write
        }
    }

    function parseItemSkin (item) {
        var read = {},
            write = {},
            fis, skin;

        for (skin in item.css) {
            if (skin !== 'structor' && skin !== 'dependencies' && item.css.hasOwnProperty(skin)) {
                fis = parsePath(item.path, skin);
                read[skin] = {};
                write[skin] = {};
                if (!fis.plugin) {
                    read[skin].buffer = "exports = require('gmu:" + fis.require + "');";
                    write[skin].js = fis.base + path.sep + fis.name + '.' + skin + '.js';
                    read[skin].css = cssPrefix + item.css[skin];
                    write[skin].css = fis.base + path.sep + fis.name + '.' + skin + '.css';
                    if (fis.name === 'refresh') {debugger;}
                    plugins[fis.name] && plugins[fis.name].forEach(function (plugin) {
                        read[skin].plugin || (read[skin].plugin= []);
                        write[skin].plugin || (write[skin].plugin= []);
                        read[skin].plugin.push("require('gmu:" + fis.name + "." + skin + "');\nexports = require('gmu:" + fis.name + path.sep + plugin + "');");
                        write[skin].plugin.push(fis.base + path.sep + plugin + path.sep + fis.name + '.' + skin + '.js');
                    });
                } else {
                    read[skin].css = cssPrefix + item.css[skin];
                    write[skin].css = fis.base + path.sep + fis.plugin + path.sep + fis.name + '.' + skin + '.css';
                }
            }
        }
        return isEmptyObject(read) ? null: {
            read: read,
            write: write
        }
    }

    function parsePath (spath, skin) {
        var matches = spath.match(/(?:([^\/]+)\/)?([^\/]+)\.js$/i),
            fis = {},
            fnArr;

        if (matches) {
            fnArr = matches[2].split('.');
            if (matches[1] === 'widget') {
                fis.base = fnArr[0] + path.sep + (fnArr.length > 1 ? ( fnArr[1] + path.sep + fnArr[1] ) : fnArr[0]);
                fis.require = fnArr[0] + (fnArr.length > 1 ? path.sep + fnArr[1] : '');
                fis.exports = 'exports=' + ('Zepto.ui.' + fnArr[0]) + ';';
                fis.plugin = fnArr.length > 1 ? fnArr[1] : '';
                skin && (fis.base =  fnArr[0] + ('.' + skin));
            } else if (matches[1] === 'core') {
                fis.require = 'base' + path.sep + (fnArr.length > 1 ?  fnArr[1] : fnArr[0]);
                fis.base = 'base' + path.sep + (fnArr.length > 1 ? (fnArr[1] + path.sep + fnArr[1]) : (fnArr[0] + path.sep + fnArr[0]));
                fis.exports = 'exports=Zepto;';
            } else if (!matches[1] && matches[2] === 'zepto'){
                fis.require = 'zepto';
                fis.base = 'zepto' + path.sep + 'zepto';
                fis.exports = 'exports=Zepto;';
            }
            fis.name = fnArr[0];
        }

        return fis;
    }

    function getPlugins (data) {
        var plugins = {}, matches, fnArr;
        data.forEach(function (item) {
            matches = item.path.match(/([^\/]+)\/([^\/]+)\.js$/i);
            if (matches) {
                fnArr = matches[2].split('.');
                if (matches[1] === 'widget' && fnArr.length > 1) {
                    plugins[fnArr[0]] || (plugins[fnArr[0]] = []);
                    plugins[fnArr[0]].push(fnArr[1]);
                }
            }
        });
        return plugins;
    }

    function renderImages (content, rpath, wpath) {
        var url, replace;

        return content.replace(/url\(((['"]?)(?!data)([^'"\n]+?)\2)\)/ig, function () {
            url = arguments[3];
            if (/\.[png|jpg|jpeg|gif]/i.test(url)) {
                file.write(path.resolve(wpath + path.sep + path.basename(url)), file.read(path.resolve(rpath + path.sep + url)));
                replace = 'url(' + path.basename(url) + ')';
            } else {
                replace = arguments[0];
            }

            return replace;
        });
    }

    grunt.registerMultiTask( "fis", function() {
        var opts = this.options({
                srcPath: '',
                cssPath: '',
                availableThemes: [ 'default', 'blue' ],
                process: false
            }),
            build = require('./lib/parse'),
            files,
            components;

        this.files.forEach(function( f ) {
            var cwd = f.cwd;
            files = f.src.filter(function( filepath ){

                // Warn on and remove invalid source files (if nonull was set).
                if ( !grunt.file.exists( cwd + filepath ) ) {
                    grunt.log.warn( 'Source file "' + filepath + '" not found.' );
                    return false;
                } else {
                    return true;
                }
            });

            fisBase = path.resolve( f.dest ) + path.sep;
            prefix = opts.srcPath;
            cssPrefix = opts.cssPath;

            components = build( opts, files );
            buildForFis( components );

            grunt.log.writeln('✓ fis包生成成功 目录: %s', String(f.dest).green);         
        });
    });
};