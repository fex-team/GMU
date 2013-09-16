module('zepto.position',{
    setup:function(){
        $('body').append('<div id="container" style="position:absolute; top: -99999px;"></div>');
        //创建dom
        $('<div id="positionOf"></div>')
            .css({
                position: 'relative',
                width: 320,
                height: 240,
                margin: '50px',
                background: 'red',
                border: '1px solid black'
            })
            .appendTo('#container');

        $('<div id="position"></div>')
            .css({
                width: 64,
                height: 48,
                background: 'blue',
                border: '1px solid black'
            })
            .appendTo('#container');
    },
    teardown: function(){
        $('#container').remove();
    }
});

test('offset setter', function(){
    // stop();
    var p = $('#position'), 
        o = $('#positionOf'),
        offset1 = o.offset(),
        offset2;

    p.offset( offset1 );
    offset2 = p.offset();

    approximateEqual( offset1.top, offset2.top );
    approximateEqual( offset1.left, offset2.left );

    p.offset( function(){
        return offset1;
    } );
    offset2 = p.offset();

    approximateEqual( offset1.top, offset2.top );
    approximateEqual( offset1.left, offset2.left );
});

test('position my', function(){
    expect(10);
    stop();
    var p = $('#position'), o = $('#positionOf'), offset1, offset2;


    p.position({
        of: o,
        my: 'left top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left);


    p.position({
        of: o,
        my: 'center top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left - offset1.width/2);

    p.position({
        of: o,
        my: 'right top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left - offset1.width);

    p.position({
        of: o,
        my: 'left center',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top - offset1.height/2);
    approximateEqual(offset1.left, offset2.left);


    p.position({
        of: o,
        my: 'left bottom',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top - offset1.height);
    approximateEqual(offset1.left, offset2.left);


    start();
});

test('position short', function(){
    var p = $('#position'), o = $('#positionOf'), offset1, offset2;


    p.position({
        of: o
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2 - offset1.height/2);
    approximateEqual(offset1.left, offset2.left + offset2.width/2 - offset1.width/2);

    p.position({
        of: o,
        my: 'left'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2 - offset1.height/2);
    approximateEqual(offset1.left, offset2.left + offset2.width/2);

    p.position({
        of: o,
        my: 'right'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2 - offset1.height/2);
    approximateEqual(offset1.left, offset2.left + offset2.width/2 - offset1.width);

    p.position({
        of: o,
        my: 'top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2);
    approximateEqual(offset1.left, offset2.left + offset2.width/2 - offset1.width/2);

    p.position({
        of: o,
        my: 'bottom'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2 - offset1.height);
    approximateEqual(offset1.left, offset2.left + offset2.width/2 - offset1.width/2);
});

test('position at', function(){
    expect(10);
    stop();
    var p = $('#position'), o = $('#positionOf'), offset1, offset2;

    p.position({
        of: o,
        my: 'left top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left);


    p.position({
        of: o,
        my: 'left top',
        at: 'center top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left + offset2.width/2);

    p.position({
        of: o,
        my: 'left top',
        at: 'right top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left + offset2.width);

    p.position({
        of: o,
        my: 'left top',
        at: 'left center'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height/2);
    approximateEqual(offset1.left, offset2.left);


    p.position({
        of: o,
        my: 'left top',
        at: 'left bottom'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height);
    approximateEqual(offset1.left, offset2.left);


    start();
});

test('position of=window', function(){
    expect(10);
    stop();
    var p = $('#position'), offset1, offset2;

    offset2 = {
    		left: 0,
    		top: 0,
    		width: window.innerWidth,
    		height: window.innerHeight
    }
    
    p.position({
    	of: window,
        my: 'left top',
        at: 'left top'
    });

    offset1 = p.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left);


    p.position({
    	of: window,
        my: 'left top',
        at: 'center top'
    });

    offset1 = p.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left + Math.round(offset2.width/2));

    p.position({
    	of: window,
        my: 'left top',
        at: 'right top'
    });

    offset1 = p.offset();

    approximateEqual(offset1.top, offset2.top);
    approximateEqual(offset1.left, offset2.left + offset2.width);

    p.position({
    	of: window,
        my: 'left top',
        at: 'left center'
    });

    offset1 = p.offset();

    approximateEqual(offset1.top, offset2.top + Math.round(offset2.height/2));
    approximateEqual(offset1.left, offset2.left);


    p.position({
    	of: window,
        my: 'left top',
        at: 'left bottom'
    });

    offset1 = p.offset();

    approximateEqual(offset1.top, offset2.top + offset2.height);
    approximateEqual(offset1.left, offset2.left);


    start();
});

test('position of=e', function(){
    expect(10);
    stop();
    var p = $('#position'), offset1, offset2;
    offset2 = {
    		left: 100,
    		top: 100
    }

    $('body').one('touchstart', function(e){
    	p.position({
            of: e,
            my: 'left top',
            at: 'left top'
        });

        offset1 = p.offset();

        approximateEqual(offset1.top, offset2.top);
        approximateEqual(offset1.left, offset2.left);


        p.position({
            of: e,
            my: 'left top',
            at: 'center top'
        });

        offset1 = p.offset();

        approximateEqual(offset1.top, offset2.top);
        approximateEqual(offset1.left, offset2.left);

        p.position({
            of: e,
            my: 'left top',
            at: 'right top'
        });

        offset1 = p.offset();

        approximateEqual(offset1.top, offset2.top);
        approximateEqual(offset1.left, offset2.left);

        p.position({
            of: e,
            my: 'left top',
            at: 'left center'
        });

        offset1 = p.offset();

        approximateEqual(offset1.top, offset2.top);
        approximateEqual(offset1.left, offset2.left);


        p.position({
            of: e,
            my: 'left top',
            at: 'left bottom'
        });

        offset1 = p.offset();

        approximateEqual(offset1.top, offset2.top);
        approximateEqual(offset1.left, offset2.left);

        start();
    });
    
    ta.touchstart(document.body, {
    	touches:[{
    		pageX: 100,
    		pageY:100
    	}]
    });
});

test('position custom collision & within', function(){
    stop();
    expect(3);
    var p = $('#position'), o = $('#positionOf'), offset;

    p.position({
        of: o,
        my: 'center center',
        at: 'left top',
        within: o,
        collision: function(position, opts){
            ok(opts.$el.is('#position'), 'elem元素正确');
            position.left = 50;
            position.top = 50;
        }
    });
    offset = p.offset();
    approximateEqual(offset.top, 50, '修改后的position top为50 ');
    approximateEqual(offset.left, 50, '修改后的position left为50 ');
    start();
});

test('position custom within=window', function(){
    stop();
    expect(2);
    var p = $('#position'), o = $('#positionOf'), offset;

    p.position({
        of: o,
        my: 'center center',
        at: 'left top',
        within: window,
        collision: function(position, opts){
           equal(opts.within.$el[0], window, 'The within is window');
        }
    });

    p.position({
        of: o,
        my: 'center center',
        at: 'left top',
        collision: function(position, opts){
            ok(opts.within.$el[0] === window, '默认within 是window');
        }
    });
    start();
});

test('position 位置offset参数', function(){
    expect(4)
    stop();
    var p = $('#position'), o = $('#positionOf'), offset1, offset2;

    p.position({
        of: o,
        my: 'left+20 top+10',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top + 10);
    approximateEqual(offset1.left, offset2.left + 20);


    p.position({
        of: o,
        my: 'left top',
        at: 'left+20% top+10%'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top +0.1*offset2.height);
    approximateEqual(offset1.left, offset2.left + 0.2*offset2.width);
    start();
});