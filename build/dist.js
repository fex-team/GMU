/**
 * @fileOverview 负责打包Zepto和GMU代码，包括合并成一个JS和采用uglify压缩js。
 *
 * 调用方式如下`node build dist`.
 *
 * 定制打包
 * ====================================================================
 * 默认会把所有的组件打包，如果指向打包部分组件可以采用如下命令
 *
 * * `node build dist widget/refresh.js` 这样只会打包refresh组件（包括它的依赖）。
 * * `node build dist widget/refresh.iOS5.js` 这样只会打包refresh.iOS5组件（包括它的依赖）。
 * * `node build dist widget/**.js` 这样用来打包所有组件
 *
 * 另外还可以过滤掉部分组件如.
 *
 * `node build dist --exclude "widget/refresh*.js"` 此条命令将会打包所有的，除了refresh。
 *
 * 主题指定
 * =====================================================================
 * 如果默认不指定，将会打包default主题， 通过一下方式可以指定主题
 *
 * `node build dist --theme default` 或者 `node build dist -t default`。
 *
 * 如果只需打包骨架样式，通过一下方式来打包
 * `node build dist -t ""` 即将theme指定为空
 */
(function () {
    'use strict';

    require('shelljs/global');

    var
        // q 是一个实现了promise/A+规范的js库
        // 主要用来优化异步操作代码
        q = require('q'),

        // 用来根据规则查找文件的工具
        glob = require('glob'),
        path = require('path'),

        // 用来判断某字符串是否满足某规则
        minimatch = require('minimatch'),
        file = require('./util/file'),
        helper = require('./util/helper'),
        config =  file.loadConfig('build/config.json').dist,
        run;

    // 初始化子仓库
    function initSubmodules(){
        cd(path.dirname(__dirname));
        exec("git submodule init");
        exec("git submodule update");
    }

    function describe_version( root ) {
        var desc;

        desc = exec("git --git-dir='" + (root + '/.git') + "' describe --tags HEAD", {
            silent: true
        });

        if (desc.code === 0) {
            return desc.output.replace(/\s+$/, '');
        } else {
            return 'unkown';
        }
    };


    // 合并zepto文件
    function concatZepto() {
        var opt = config.zepto,
            dest = opt.dest,
            files = opt.files;

        files = files.split(/\s+/g)
            .map(function (file) {
                return opt.path + '/src/' + file + '.js';
            });

        file.concat(files, dest, opt.banner
                .replace(/@version/g, describe_version( opt.path ))
                .replace(/@files/g, opt.files)
                );

        console.log('✓ 生成 %s - %s ', dest, file.caculateSize(dest));
    }

    // 用uglify压缩zepto文件
    function minifyZepto() {
        var opt = config.zepto,
            minDest = opt.dest
                .replace(/\.js$/, '.min.js');

        file.write(minDest, opt.banner
                .replace(/@version/g, describe_version( opt.path ))
                .replace(/@files/g, opt.files) + '\n' + file.minify(opt.dest));
        console.log('✓ 生成 %s - %s ', minDest, file.caculateSize(minDest));
    }

    // 收集需要处理的js文件
    function collectComponents( exclude, files ) {
        var opt = config.gmu,
            dir = path.resolve( opt.path ),

            // 判断文件名是否满足exclude中设置的规则
            matchExclude = function (item) {
                var i = 0,
                    len = exclude.length;

                for ( ; i < len; i++ ) {

                    if (minimatch(item, exclude[i])) {
                        return true;
                    }
                }

                return false;
            };

        exclude = (opt.exclude || [])
            .concat(exclude ? exclude.split(/\s+/) : [])
            .map(function( item ){

                //转义.和$, 正确的匹配应该\.和\$
                return item.replace(/(\.|\$\-)/, '\\$1');
            });

        files = files || opt.all;

        // 确保files是个数组
        if (!Array.isArray(files)) {
            files = [files];
        }

        return q.all(files.map(function (file) {
                return q.nfcall(glob, file, { cwd: dir});
            }))
            .then(function (files) {

                return files

                    // 摊平数组
                    .reduce(function (prefix, now) {
                        return prefix.concat(now);
                    })

                    // 去重 同时把exclude过滤掉
                    .filter(function (item, i, me) {
                        return me.lastIndexOf(item) === i && 
                                !matchExclude(item);
                    });
            });
    }

    function buildComponents(files) {
        var opt = config.gmu,
            prefix = path.resolve(opt.path) + path.sep,
            cssPrefix = path.resolve(opt.cssPath) + path.sep,
            ret = [],
            hash = {},
            parse = function (path) {
                var css = {},
                    content,
                    cssPath,
                    exists,
                    depends,    // dependencies
                    item,
                    matches;

                // 如果文件不存在，则直接跳过, 同时从数组中过滤掉
                // 或者已经处理过也跳过
                if (!(exists = file.exists((prefix + path))) ||
                        hash.hasOwnProperty(path)) {

                    return exists;
                }

                content = file.read(prefix + path);

                // 读取文件内容中对js的依赖 格式为：@import core/zepto.js
                matches = content.match(/@import\s(.*?)\n/i);
                if (matches) {
                    depends = matches[1]

                        // 多个依赖用道号隔开
                        .split(/\s*,\s*/g)
                        .filter(parse);
                }

                // 查找css文件，对应的目录在assets目录下面的widgetName/widget.css
                // 或者widgetName/widget.plugin.css
                cssPath = path.replace(/\/(.+)\.js$/, function (m0, m1) {
                    var
                        //插件的css并不在插件名所在目录，而是对应的组件名所在目录
                        name = m1.replace(/\..+$/, '');

                    return '/' + name + '/' + m1 + '.css';
                });

                // 检查骨架css是否存在
                if (file.exists(cssPrefix + cssPath)) {
                    css.structor = cssPath;
                }

                // 查找themes
                glob.sync(cssPath.replace(/\.css$/, '\\.*\\.css'),
                        {cwd: cssPrefix})
                    .forEach(function (item) {
                        var m = item.match(/\.([^\.]*)\.css$/i);
                        m && (css[m[1]] = item );
                    });

                // 读取文件内容中对css的依赖 格式为：@importCSS loading.css
                matches = content.match(/@importCSS\s(.*?)\n/i);
                if (matches) {
                    css.dependencies = matches[1]

                        // 多个依赖用道号隔开
                        .split(/\s*,\s*/g)
                        .map(function (item) {
                            var ret = {};

                            // 可能只有骨架css存在，也可能只有主题css存在
                            file.exists(cssPrefix + item) && 
                                    (ret.structor = item);

                            glob.sync(item.replace(/\.css$/, '\\.*\\.css'),
                                    {cwd: cssPrefix})

                                .forEach(function (item) {
                                    var m = item.match(/\.([^\.]*)\.css$/i);
                                    m && ~opt.aviableThemes.indexOf(m[1]) && (ret[m[1]] = item );
                                });
                            return ret;
                        });
                }

                item = {
                    path: path,
                    dependencies: depends,
                    css: css
                };

                // 将path作为key保存在hash表中，以避免重复解析
                hash[path] = item;
                ret.push(item);

                return true;
            };

        files.filter(parse);

        return ret;
    }

    function concatComponents(theme, models) {

        if (typeof theme !== 'string') {
            models = theme;
            theme = 'default';
        }

        var js = '',
            css = '',
            // 存贮合并了哪些js文件
            jsFiles = [],

            // 存贮合并了哪些css文件
            cssFiles = [],
            pkg = require('../package.json'),

            // 存取css文件中的图片信息 key为url()括号中的值，value为原始图片路径
            images = {},
            opt = config.gmu,
            prefix = path.resolve(opt.path) + path.sep,
            cssPrefix = path.resolve(opt.cssPath) + path.sep,

            //hash表，key为js的路径，value为对应obj
            hash = {},
            rendered = {

                // 不再输出core/zepto.js, 这个文件会单独打包
                'core/zepto.js': true
            },
            jsRender = function (item) {

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

                js += '/*!' + item.path + '*/\n' +
                        file.read(prefix + item.path) + '\n';

                // 标明已经输出过
                rendered[item.path] = true;
            },

            readCss = function (obj) {
                var ret = '',
                    i = 0,
                    matches,
                    len,
                    url;

                obj.structor && 
                        (ret += '/*!' + obj.structor + '*/\n' +
                                file.read(cssPrefix + obj.structor) + '\n') &&
                        cssFiles.push(obj.structor);

                theme && obj[theme] && 
                        (ret += '/*!' + obj.theme + '*/\n' +
                                file.read(cssPrefix + obj[theme]) + '\n') &&
                        cssFiles.push(obj[theme]);

                // 收集images
                matches = ret.match(/url\(((['"]?)(?!data)([^'"\n]+?)\2)\)/ig);

                if (matches) {

                    for (len = matches.length; i < len; i++) {

                        // 苦恼，为何matches结果里面不带分组结果呢？
                        url = matches[i].match(
                                /url\(((['"]?)(?!data)([^'"\n]+?)\2)\)/i)[3];

                        images[url] = path.resolve(cssPrefix + 
                                path.dirname(obj.structor || obj[theme]) + 
                                path.sep + url);
                    }
                }

                css += ret;
            },

            cssRender = function (item) {
                var css;

                // 先输出js依赖对应的css
                if (item.dependencies) {
                    item.dependencies.forEach(function (item) {
                        hash[item.path] && cssRender(hash[item.path]);
                    });
                }

                css = item.css;

                if (css.dependencies) {
                    css.dependencies.forEach(readCss);
                }

                readCss(css);
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

        banner = opt.banner
            .replace(/@version/ig, pkg.version);

        dest = opt.dest;
        file.write(dest, 
                banner.replace(/@files/ig, jsFiles.join(', ')) + '\n' + js);

        console.log('✓ 生成 %s - %s ', dest, file.caculateSize(dest));

        minDest = dest.replace(/\.js$/, '.min.js');
        file.write(minDest, 
                banner.replace(/@files/g, jsFiles.join(', ')) + 
                    '\n' + file.minify(dest));
        console.log('✓ 生成 %s - %s ', minDest, file.caculateSize(minDest));

        // 复制图片
        destDir = path.dirname(dest) + path.sep;

        //如果images目录已经存在，则删除，否则images目录下会自动生成很多新文件。
        file.rmdir(destDir + 'images');

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
                        file.read(images[image]));

                css = helper.strReplace('\\((\'|")?' + 
                        image.replace(/\./g, '\\.') + '\\1\\)', 
                            '(./images/' + newName + ')', css);
            }
        }

        dest = dest.replace(/\.js$/, '.css');
        file.write(dest, 
                banner.replace(/@files/g, cssFiles.join(', ')) + '\n' + css);
        console.log('✓ 生成 %s - %s ', dest, file.caculateSize(dest));
    }

    // 提供直接调用
    exports.run = run = function () {
        var exclude = this.exclude,
            theme = this.theme,
            files = [],
            len = this.args.length,
            i = 0;

        theme = typeof theme === 'undefined' ? 'default' : theme;

        //如果node build dist后面还带其他参数，则只收集指定的文件。
        for( ; i < len-1; i++ ) {
            files.push(this.args[i].replace(/(\.|\$\-)/, '\\$1'));
        }

        return q
            .fcall(initSubmodules)
            .then(concatZepto)
            .then(minifyZepto)
            .then(helper.curry(collectComponents, exclude, 
                files.length ? files : null))
            .then(buildComponents)
            .then(helper.curry(concatComponents, theme));
    };

    //标记是一个task
    exports.task = true;

    exports.init = function ( cli ) {
        cli.option('-X, --exclude <files...>', '在打包GMU的时候，' + 
                '用来过滤部分文件。');

        cli.option('-t, --theme <name>', '在打包GMU的时候，' +
                '用来指定打包什么主题。');

        cli.command('dist')
            .description('合并代码并采用uglify压缩代码')
            .action(run.bind(cli));
    };

    //暴露给fis.js用
    exports.getComponents = function( exclude ){
        return collectComponents(exclude)
            .then(buildComponents);
    };

})();