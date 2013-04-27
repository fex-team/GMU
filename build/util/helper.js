/**
 * @fileOverview 数组帮助类方法。包括curry, 和unCurryThis.
 */
(function () {
    "use strict";

    var emptyArray = [],
        helper = exports;

    function unCurryThis(f) {
        var call = Function.call;
        return function () {
            return call.apply(f, arguments);
        }
    }

    function curry(f) {
        var args = helper.slice(arguments, 1);
        return function () {
            return f.apply(this, helper.concat(args, helper.slice(arguments, 0)));
        }
    }

    function strReplace( search, replace, subject) {
        var r = new RegExp(''+search, 'ig');
        return subject.replace( r, replace);
    }

    helper.unCurryThis = unCurryThis;
    helper.curry = curry;
    helper.strReplace = strReplace;

    ["push", "pop", "shift", "unshift", "slice",
        "splice", "map", "filter", "forEach", "concat",
        "reduce"].forEach(function (name) {
            helper[name] = unCurryThis(emptyArray[name]);
        });

    helper.debug = function( exit ){
        var args = helper.slice(arguments, 0);

        exit = args.pop();
        if(typeof exit !== 'boolean') {
            args.push(exit);
            exit = false;
        }

        console.log.apply(console, args);
        exit && process.exit(1);
    }

    emptyArray = null;
})();