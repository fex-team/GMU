(function() {
    function sendMessage() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    }

    function override( name, fn ) {
        var target = QUnit,
            old = target[ name ];

        target[ name ] = function() {
            var ret = old.apply( this, arguments );

            fn.apply( {ret: ret}, arguments );

            return ret;
        }
    }

    var started;

    // init,module,asyncTest,test,expect,ok,equal,notEqual,deepEqual,notDeepEqual,strictEqual,notStrictEqual,start,stop,reset,triggerEvent,is,done,log,testStart,testDone,moduleStart,moduleDone,equals,same,isLocal,equiv,jsDump


    override( 'moduleStart', function( name ) {
        sendMessage( "qunit.moduleStart", name );
    });

    override( 'moduleDone', function( name ) {
        sendMessage( "qunit.moduleDone", name );
    });

    override( 'testStart', function( name ) {
        sendMessage( "qunit.testStart", name );
    });

    override( 'testDone', function( testName, bad ) {
        sendMessage( "qunit.testDone", testName, bad );
    });

    override( 'start', function() {
        started = +new Date;
    });

    override( 'done', function( failures, total, detail ) {
        sendMessage( "qunit.done", failures, total - failures, total, +new Date - started );
    });

    override( 'log', function( result, message ) {
        var actual, expected;

        if ( !result ) {
            actual = message.match(/result:(.*)$/)[1];
            expected = message.match(/expected:(.*)result/)[1];
            message = message.replace(/expected:.*$/, '');
        }

        // to do
        sendMessage( "qunit.log", result, actual, expected, message, '' );
    });

})();