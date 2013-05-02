/**
 * @fileOverview 规范检测工具
 */
(function(){
    "use strict";

    var jshint = require('jshint').JSHINT,
        run;


    //提供直接调用
    run = exports.run = function() {
        
        
    };

    //标记是一个task
    exports.task = true;


    exports.init = function(cli) {
        cli.command('jshint')
            .description('规范检测工具')
            .action(run.bind(cli));
    };
})();