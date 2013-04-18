#!/usr/bin/env node

// node.js based build script
// run `node build -h` for usage information
(function () {
    "use strict";

    var cli = require('commander'),
        glob = require('glob'),
        path = require('path'),
        Q = require('q');

    cli.option('-s, --silent', '安静模式，不输出任何调试信息');

    //加载所有task
    Q.nfcall(glob, "build/*.js")
        .then(function (files) {

            files.map(function (file) {
                return path.basename(file, '.js');
            }).forEach(function (task) {
                    task = require('./build/' + task);

                    //初始化其他task
                    task.task && task.init(cli);
                });
        }).then(function () {
            cli.parse(process.argv);

            // 如果什么都没有输入就显示帮助
            if (!cli.args.length) {
                cli.outputHelp();
                process.exit(0);
            }
        }).fail(function (reason) {
            console.error(reason);
        });

})();