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
            return f.apply(this, (helper.push(args, arguments), args));
        }
    }

    function strReplace( search, replace, subject) {
        var r = new RegExp(''+search, 'ig');
        return subject.replace( r, replace);
    }

    helper.unCurryThis = unCurryThis;
    helper.curry = curry;
    helper.str_replace = str_replace;

    ["push", "pop", "shift", "unshift", "slice",
        "splice", "map", "filter", "forEach",
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