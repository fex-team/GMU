/*
 * 测试GMU官网自定义下载
 */

'use strict';

module.exports = function(grunt) {

    // Nodejs libs.
    var path = require('path');

    // External lib.
    var phantomjs = require('grunt-lib-phantomjs').init(grunt);

    // Get an asset file, local to the root of the project.
    var asset = path.join.bind(null, __dirname, '..');

    phantomjs.on('download.getdownloadurl', function(url) {
        grunt.log.ok('Download url "' + url);
        phantomjs.halt();
    });

    grunt.registerMultiTask("testDownload", "Testing download...", function() {

        var done = this.async(),
            options = this.options({

                // Default PhantomJS timeout.
                timeout: 5000,

                inject: asset('tasks/download/bridge.js'),

                // download url.
                url: 'http://gmu.baidu.com/download.html'
            }),
            url = options.url;

        phantomjs.spawn(url, {
            // Additional PhantomJS options.
            options: options,
            // Do stuff when done.
            done: function(err) {
                if (err) {
                    grunt.warn('Get download url failure');
                } else {
                    // Otherwise, get download url sucess.
                    grunt.log.ok('Get download url sucess.');
                }

                done();
            },
        });
    });
};