module('Event');

test("on and trigger", function() {
    expect(2);
    var obj = {
        counter: 0
    };
    $.extend( obj, gmu.event );
    obj.on('event', function() {
        obj.counter += 1;
    });
    obj.trigger('event');
    equal(obj.counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equal(obj.counter, 5, 'counter should be incremented five times.');
});

test('binding once', function() {

    expect(2);

    var obj = {
        counter: 0
    }

    $.extend( obj, gmu.event );

    obj.one('event', function(){
        obj.counter += 1;
    });

    obj.trigger('event');
    equal(obj.counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equal(obj.counter, 1, 'counter should be still 1.');
});


test('binding multiple events', function() {
    expect(4);
    var obj = {
        counter: 0
    };
    $.extend( obj, gmu.event );


    obj.on('a b c', function() {
        obj.counter += 1;
    });

    obj.trigger('a');
    equal(obj.counter, 1);

    obj.trigger('b');
    equal(obj.counter, 2);

    obj.trigger('c');
    equal(obj.counter, 3);
    obj.off('a c');
    obj.trigger('a');
    obj.trigger('b');
    obj.trigger('c');
    equal(obj.counter, 4);
});

test( 'trigger argmenuts', function(){
    expect(3);

    var obj = {};

    $.extend( obj, gmu.event );

    obj.on('event', function(e, a, b){
        equal(a, 1, 'ok');
        equal(b, 2, 'ok');
        equal(e.type, 'event');
    });

    obj.trigger('event', 1, 2);
} );

test('binding unbinding with context', function(){
    expect(10);

    var obj = {},
        foo = {counter:0};

    $.extend( obj, gmu.event );

    obj.on('event', function(){
        equal( this, obj, 'ok' );
    });
    obj.trigger('event');
    obj.off('event');
    obj.trigger('event');

    var fn1 = function(){
            foo.counter++;
        },
        fn2 = function() {
            foo.counter++;
        };

    obj.on('event', fn1, foo);
    obj.on('event', fn2, foo);
    obj.trigger('event');
    equal( foo.counter, 2, '计数应该增长到2' );
    obj.off('event', null, foo);
    obj.trigger('event');
    equal( foo.counter, 2, '计数应该保持不变' );
    

    obj.on('event', fn1, foo);
    obj.on('event', fn2, foo);
    obj.trigger('event');
    equal( foo.counter, 4, '计数应该增长到4' );
    obj.off('event', fn1, foo);
    obj.trigger('event');
    equal( foo.counter, 5, '计数应该增长到5' );
    obj.off('event', fn2, foo);
    obj.trigger('event');
    equal( foo.counter, 5, '计数应该保持不变' );

    obj.on('event', fn1, foo);
    obj.on('event', fn2, foo);
    obj.trigger('event');
    equal( foo.counter, 7, '计数应该增长到7' );
    obj.off('event');
    obj.trigger('event');
    equal( foo.counter, 7, '计数应该保持不变' );

    obj.on('event', fn1, foo);
    obj.on('event', fn2, foo);
    obj.trigger('event');
    equal( foo.counter, 9, '计数应该增长到9' );
    obj.off(null, null, foo );
    obj.trigger('event');
    equal( foo.counter, 9, '计数应该保持不变' );

});

test( 'binding unbinding with namespace', function(){
    expect(16);

    var obj = {
            counter: 0    
        },
        fn1 = function() {
            obj.counter++;
        },
        fn2 = function() {
            obj.counter++;
        };

    $.extend( obj, gmu.event );

    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event.a.b.c');
    equal(obj.counter, 1, '计数增长至1');

    obj.trigger('event.a');
    equal(obj.counter, 2, '计数应该增长到2');

    obj.trigger('event.b.c');
    equal(obj.counter, 4, '计数应该增长到4');

    obj.trigger('.a');
    equal(obj.counter, 5, '计数应该增长到5');

    obj.trigger('.b.c');
    equal(obj.counter, 7, '计数应该增长到7');
    obj.off('.c');
    obj.trigger('.b.c');
    equal(obj.counter, 7, '计数应该保持不变');


    // 重置
    obj.counter = 0;
    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');
    obj.off('event');
    obj.trigger('event');
    equal(obj.counter, 2, '计数应该保持不变');

    // 重置
    obj.counter = 0;
    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');
    obj.off('event.a');
    obj.trigger('event');
    equal(obj.counter, 3, '计数增长至3');
    obj.off('event');

    // 重置
    obj.counter = 0;
    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');
    obj.off('.a.c');
    obj.trigger('event');
    equal(obj.counter, 3, '计数增长至3');
    obj.off('event');

    // 重置
    obj.counter = 0;
    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');
    obj.off('.c');
    obj.trigger('event');
    equal(obj.counter, 2, '计数应该保持不变');
    obj.off('event');

    // 重置
    obj.counter = 0;
    obj.on('event.a.b.c', fn1);
    obj.on('event.b.c', fn2);
    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');
    obj.off('.b.c');
    obj.trigger('event');
    equal(obj.counter, 2, '计数应该保持不变');
    obj.off('event');
});


test('stopPropagation', function(){
    var obj = {
            counter: 0    
        };

    $.extend( obj, gmu.event );

    obj.on('event', function(e){
        obj.counter++;
        e.stopPropagation();
    });

    obj.on('event', function(){
        obj.counter++;
    });

    obj.trigger('event');
    equal(obj.counter, 1, '计数增长至1');

    var e = gmu.Event('event');
    obj.trigger( e );
    equal(obj.counter, 2, '计数增长至2');

    ok(e.isPropagationStopped(), '事件被停止蔓延');
});


test('preventDefault', function(){
    var obj = {
            counter: 0    
        };

    $.extend( obj, gmu.event );

    obj.on('event', function(e){
        obj.counter++;
        e.preventDefault();
    });

    obj.on('event', function(){
        obj.counter++;
    });

    obj.trigger('event');
    equal(obj.counter, 2, '计数增长至2');

    var e = gmu.Event('event');
    obj.trigger( e );
    equal(obj.counter, 4, '计数增长至4');

    ok(e.isDefaultPrevented(), '事件被阻止');
});


test('return false', function(){
    var obj = {
            counter: 0    
        };

    $.extend( obj, gmu.event );

    obj.on('event', function(e){
        obj.counter++;
        return false;
    });

    obj.on('event', function(){
        obj.counter++;
    });

    obj.trigger('event');
    equal(obj.counter, 1, '计数增长至1');

    var e = gmu.Event('event');
    obj.trigger( e );
    equal(obj.counter, 2, '计数增长至2');

    ok(e.isDefaultPrevented(), '事件被阻止');
    ok(e.isPropagationStopped(), '事件被停止蔓延');
});

test("event functions are chainable", function() {
    var obj = $.extend({}, gmu.event);
    var obj2 = $.extend({}, gmu.event);
    var fn = function() {};
    equal(obj, obj.trigger('noeventssetyet'), 'ok');
    equal(obj, obj.off('noeventssetyet'), 'ok');
    equal(obj, obj.on('a', fn), 'ok');
    equal(obj, obj.one('c', fn), 'ok');
    equal(obj, obj.trigger('a'), 'ok');
    equal(obj, obj.off('a c'), 'ok');
  });

