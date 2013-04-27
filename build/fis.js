(function(){
    'use strict';

    var dist = require('./dist'),
        file = require('./util/file'),
        helper = require('./util/helper'),
        Q = require('q'),
        path = require('path'),
        pkg = require("../package");

    function buildForFis( files ){
        var config = require("./config"),
            opt = config.fis,
            gmu = config.dist.gmu,
            prefix = path.resolve(gmu.path) + path.sep,
            cssPrefix = path.resolve(gmu.cssPath) + path.sep,
            dest = opt.dest,
            restCss = {},
            render = function(item) {
                var folder = '',
                    matches,
                    module;

                matches = item.path
                    .match(/([^\/]+)\/([^\/]+)\.js$/i);

                if(matches) {

                    switch(matches[1]) {
                        case 'core':
                            folder = 'base' + path.sep;
                            break;

                        default:
                            break;
                    }

                }
            }

        dest = dest.replace(/@version/ig, pkg.version);

        //如果已经存在则删除
        file.rmdir(dest);

        file.mkdir(dest);
        files
            .filter(function( item ){
                return item.path !== 'core/zepto.js';
            })
            .forEach(render);


    }


    //提供直接调用
    var run = exports.run = function() {
        return Q
            .try(dist.getComponents)
            .then(buildForFis)
            .fail(function(reason){
                console.log(reason);
            });
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('fis')
            .description('生成fis包')
            .action(run.bind(cli));
    };
})();