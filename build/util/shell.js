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
            p = spawn(parts.shift(), parts);

        //todo handle this after thread to be closes.

        p.stdout.on('data', function (data) {
            deferred.resolve(data.toString().trim());
        });

        p.stderr.on('data', function (data) {
            deferred.reject(data.toString().trim());
        });

        return deferred.promise;
    }
})();