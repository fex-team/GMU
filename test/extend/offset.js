module('zepto.offset');

test( 'position: static', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: relative', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'relative',
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });
        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: relative 2', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'relative',
            left: 30,
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: relative 3', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'relative',
            top: 30,
            background: 'blue',
            width: 20,
            height: 20
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: relative 4', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'relative',
            right: 30,
            background: 'blue',
            width: 20,
            height: 20
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: relative 5', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'relative',
            bottom:  30,
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: absolute', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'absolute',
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: absolute 2', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'absolute',
            left: '20px',
            width: 20,
            height: 20,
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'position: fixed', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            position: 'fixed',
            left: '20px',
            top: 30,
            background: 'blue',
            width: 20,
            height: 20
        }).appendTo( $root ),
        offset;


        $el.offset({
            left: 100,
            top: 100
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

test( 'offset: function', function() {

    var $root = $('<div>').css({
            position: 'relative',
            width: 200,
            height: 200,
            top: 10,
            left: 20,
            background: 'red'
        }).appendTo( document.body ).append('<p>bla bla bla</p>'),

        $el = $('<div>').css({
            width: 20,
            height: 20,
            position: 'absolute',
            background: 'blue'
        }).appendTo( $root ),
        offset;

        $el.offset(function( idx, old ){
            equal( old.left, $(this).offset().left);
            equal( old.top, $(this).offset().top);
            return {
                left: 100,
                top: 100
            }
        });

        offset = $el.offset();

        approximateEqual( offset.left, 100 );
        approximateEqual( offset.top, 100 );

        $root.remove();
} );

