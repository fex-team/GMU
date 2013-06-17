(function() {
    var started;

    function sendMessage() {
        var args = [].slice.call( arguments );
        alert( JSON.stringify( args ) );
    }

    function hook( name, fn ) {
        var target = QUnit,
            old = target[ name ];

        target[ name ] = function() {
            var ret = old.apply( this, arguments );

            fn.apply( null, arguments );
            return ret;
        }
    }

    hook( 'moduleStart', function( name ) {
        sendMessage( 'qunit.moduleStart', name );
    } );

    hook( 'moduleDone', function( name ) {
        sendMessage( 'qunit.moduleDone', name );
    } );

    hook( 'testStart', function( name ) {
        sendMessage( 'qunit.testStart', name );
    } );

    hook( 'testDone', function( testName, bad ) {
        sendMessage( 'qunit.testDone', testName, bad );
    } );

    hook( 'start', function() {
        started = +new Date;
    } );

    hook( 'done', function( failures, total, detail ) {
        var coverage = window.__coverage__;

        if ( coverage ) {
            sendMessage( 'updateCoverage', coverage );
        }

        sendMessage( 'qunit.done', failures, total - failures, total, +new Date - started );
    });

    hook( 'log', function( result, message ) {
        var actual, expected;

        if ( !result && /^(.*?),\s*expected:(.*?)result:(.*?)$/i.test(message) ) {
            expected = RegExp.$2;
            actual = RegExp.$3;
            message = RegExp.$1;
        }

        sendMessage( 'qunit.log', result, actual, expected, message, '' );
    });
})();