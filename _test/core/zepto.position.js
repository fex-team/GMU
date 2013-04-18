module("zepto.position",{
    setup:function(){
        $("body").append("<div id='container'></div>");
        //创建dom
        $('<div id="positionOf"></div>')
            .css({
                position: "relative",
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
                background: "blue",
                border: "1px solid black"
            })
            .appendTo('#container');
    },
    teardown: function(){
        $('#container').remove();
    }
});

test("position my", function(){
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

    equals(offset1.top, offset2.top, "my: left top; at: left top; top");
    equals(offset1.left, offset2.left, "my: left top; at: left top; left");


    p.position({
        of: o,
        my: 'center top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top, "my: center top; at: left top; top");
    equals(offset1.left, offset2.left - offset1.width/2, "my: left top; at: left top; left");

    p.position({
        of: o,
        my: 'right top',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top, "my: right top; at: left top; top");
    equals(offset1.left, offset2.left - offset1.width, "my: left top; at: left top; left");


    p.position({
        of: o,
        my: 'left center',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top - offset1.height/2, "my: left center; at: left top; top");
    equals(offset1.left, offset2.left, "my: left top; at: left top; left");


    p.position({
        of: o,
        my: 'left bottom',
        at: 'left top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top - offset1.height, "my: left bottom; at: left top; top");
    equals(offset1.left, offset2.left, "my: left top; at: left top; left");


    start();
});

test("position at", function(){
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

    equals(offset1.top, offset2.top, "my: left top; at: left top; top");
    equals(offset1.left, offset2.left, "my: left top; at: left top; left");


    p.position({
        of: o,
        my: 'left top',
        at: 'center top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top, "my: left top; at: center top; top");
    equals(offset1.left, offset2.left + offset2.width/2, "my: left top; at: center top; left");

    p.position({
        of: o,
        my: 'left top',
        at: 'right top'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top, "my: left top; at: right top; top");
    equals(offset1.left, offset2.left + offset2.width, "my: left top; at: right top; left");

    p.position({
        of: o,
        my: 'left top',
        at: 'left center'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top + offset2.height/2, "my: left top; at: left center; top");
    equals(offset1.left, offset2.left, "my: left top; at: left center; left");


    p.position({
        of: o,
        my: 'left top',
        at: 'left bottom'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    equals(offset1.top, offset2.top + offset2.height, "my: left top; at: left bottom; top");
    equals(offset1.left, offset2.left, "my: left top; at: left bottom; left");


    start();
});

test("position of=window", function(){
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

    equals(offset1.top, offset2.top, "my: left top; at: left top; top");
    equals(offset1.left, offset2.left, "my: left top; at: left top; left");


    p.position({
    	of: window,
        my: 'left top',
        at: 'center top'
    });

    offset1 = p.offset();

    equals(offset1.top, offset2.top, "my: left top; at: center top; top");
    equals(offset1.left, offset2.left + Math.round(offset2.width/2), "my: left top; at: center top; left");

    p.position({
    	of: window,
        my: 'left top',
        at: 'right top'
    });

    offset1 = p.offset();

    equals(offset1.top, offset2.top, "my: left top; at: right top; top");
    equals(offset1.left, offset2.left + offset2.width, "my: left top; at: right top; left");

    p.position({
    	of: window,
        my: 'left top',
        at: 'left center'
    });

    offset1 = p.offset();

    equals(offset1.top, offset2.top + Math.round(offset2.height/2), "my: left top; at: left center; top");
    equals(offset1.left, offset2.left, "my: left top; at: left center; left");


    p.position({
    	of: window,
        my: 'left top',
        at: 'left bottom'
    });

    offset1 = p.offset();

    equals(offset1.top, offset2.top + offset2.height, "my: left top; at: left bottom; top");
    equals(offset1.left, offset2.left, "my: left top; at: left bottom; left");


    start();
});

test("position of=e", function(){
    expect(10);
    stop();
    var p = $('#position'), offset1, offset2;
    offset2 = {
    		left: 100,
    		top: 100
    }

    $("body").on("touchstart", function(e){
    	p.position({
            of: e,
            my: 'left top',
            at: 'left top'
        });

        offset1 = p.offset();

        equals(offset1.top, offset2.top, "my: left top; at: left top; top");
        equals(offset1.left, offset2.left, "my: left top; at: left top; left");


        p.position({
            of: e,
            my: 'left top',
            at: 'center top'
        });

        offset1 = p.offset();

        equals(offset1.top, offset2.top, "my: left top; at: center top; top");
        equals(offset1.left, offset2.left, "my: left top; at: center top; left");

        p.position({
            of: e,
            my: 'left top',
            at: 'right top'
        });

        offset1 = p.offset();

        equals(offset1.top, offset2.top, "my: left top; at: right top; top");
        equals(offset1.left, offset2.left, "my: left top; at: right top; left");

        p.position({
            of: e,
            my: 'left top',
            at: 'left center'
        });

        offset1 = p.offset();

        equals(offset1.top, offset2.top, "my: left top; at: left center; top");
        equals(offset1.left, offset2.left, "my: left top; at: left center; left");


        p.position({
            of: e,
            my: 'left top',
            at: 'left bottom'
        });

        offset1 = p.offset();

        equals(offset1.top, offset2.top, "my: left top; at: left bottom; top");
        equals(offset1.left, offset2.left, "my: left top; at: left bottom; left");

        start();
    });
    
    ta.touchstart(document.body, {
    	touches:[{
    		clientX: 100,
    		clientY:100
    	}]
    });
});

test("position custom collision & within", function(){
    stop();
    expect(3);
    var p = $('#position'), o = $('#positionOf'), offset;

    p.position({
        of: o,
        my: 'center center',
        at: 'left top',
        within: o,
        collision: function(position, opts){
            ok(opts.elem.is('#position'), "elem元素正确");
            position.left = 50;
            position.top = 50;
        }
    });

    offset = p.offset();
    equals(offset.top, 50, "修改后的position top为50 ");
    equals(offset.left, 50, "修改后的position left为50 ");
    start();
});

test("position custom within=window", function(){
    stop();
    expect(1);
    var p = $('#position'), o = $('#positionOf'), offset;

    p.position({
        of: o,
        my: 'center center',
        at: 'left top',
        within: window,
        collision: function(position, opts){
           equals(opts.within.element[0], window, "The within is window");
        }
    });

    offset = p.offset();
    start();
});

test("position custom using", function(){
    expect(2)
    stop();
    var p = $('#position'), o = $('#positionOf'), offset;
    offset = o.offset();

    p.position({
        of: o,
        my: 'left top',
        at: 'left top',
        using: function(position){
        	equals(position.top, offset.top, "my: left top; at: left top; top");
            equals(position.left, offset.left, "my: left top; at: left top; left");
        }
    });

    start();
});

test("position 位置offset参数", function(){
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

    equals(offset1.top, offset2.top + 10, "my: left top; at: left top; top");
    equals(offset1.left, offset2.left + 20, "my: left top; at: left top; left");


    p.position({
        of: o,
        my: 'left top',
        at: 'left+20% top+10%'
    });

    offset1 = p.offset();
    offset2 = o.offset();

    approximateEqual(offset1.top, offset2.top +0.1*offset2.height, 0.5,  "my: left top; at: left top; top");
    approximateEqual(offset1.left, offset2.left + 0.2*offset2.width, 0.5, "my: left top; at: left top; left");
    start();
});