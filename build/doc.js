/**
 * @fileOverview 生成doc工具，此程序会在生成一个doc目录。
 * 程序依赖linux/unix系统，需要php已经安装，并暴露php命令。
 */
(function(){
    'use strict';

    var path = require('path'),
        run;

    require('shelljs/global');

    //提供直接调用
    run = exports.run = function() {
        var phpPath = which('php');
        if(!phpPath) {
            throw new Error('✗ PHP没有安装，或不在$PATH中，不能生成doc');
        }

        exec(phpPath + " " + path.resolve('build/doc/index.php') );
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('doc')
                .description('生成静态文本')
                .action(run.bind(cli));
    };
})();