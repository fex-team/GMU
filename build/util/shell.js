/**
 * @fileOverview 运行shell命令。
 */
(function () {
    "use strict";

    var spawn = require('child_process').spawn,
        Q = require('q');

    module.exports = function (cmd) {
        var deferred = Q.defer(),
            parts = cmd.split(/\s+/g),
            p = spawn(parts.shift(), parts),
            stdout = new Buffer(''),
            stderr = new Buffer('');

        p.stdout.on('data', function (buf) {
            stdout = Buffer.concat([stdout, new Buffer(buf)]);
        });

        p.stderr.on('data', function (data) {
            stderr = Buffer.concat([stderr, new Buffer(buf)]);
        });

        p.on('close', function(code) {
            stderr = stderr.toString();
            if( stderr ) {
                deferred.reject( stderr );
            } else {
                deferred.resolve(stdout.toString().trim());
            }
        });

        return deferred.promise;
    }
})();