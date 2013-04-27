#!/usr/bin/env node
/**
 * @fileOverview Gmu打包工具。通过`node build`来查看如何使用此工具，
 * 运行前请确保node的依赖都已经安装。通过`npm install`来安装依赖。
 *
 * 此程序是所有task的入口，task的细节在build目录下对应的文件实现。
 *
 * 如何添加一个task
 * ===================================
 * 在build目录下添加一个js，并将在`exports.task`标记为true.
 * 程序初始化的时候回自动调用`exports.run( cli );`
 * 关于commander的是用说明请查看[commander.js](https://github.com/visionmedia/commander.js/).
 */
(function () {
    'use strict';

    var cli = require('commander'),
        glob = require('glob'),
        path = require('path'),
        q = require('q');

    cli.option('-s, --silent', '安静模式，不输出任何调试信息');

    //加载所有task
    q.nfcall(glob, 'build/*.js')
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