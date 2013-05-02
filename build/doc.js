/**
 * @fileOverview 生成doc工具，此程序会在生成一个doc目录。
 * 程序依赖linux/unix系统，需要php已经安装，并暴露php命令。
 */
(function(){
    "use strict";

    var shell = require('./util/shell'),
        path = require('path');


    //提供直接调用
    var run = exports.run = function() {

        //todo 改成node全权负责生成
        return shell('which php')
            .then(function(value){
                var phpFile = path.resolve('build/doc/index.php');
                return shell(value + ' '+phpFile);
            }).then(function( result ){
                console.log(result);
            });
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('doc')
            .description('生成静态文本')
            .action(run.bind(cli));
    };
})();