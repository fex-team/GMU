module("widget - calendar.picker");

test("load assets", function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css", "widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
        ok(true, "ok");
        start();
    });
});

test("init: selector", function(){
    expect(2);
    stop();
    var input = $('<input type="text">');

    input.calendar({date: '2013-04-24'});

    ok(!input.hasClass('ui-calendar'), '当加入picker插件, selector是赋值对象，不会作为容器处理');

    input.calendar('show');

    setTimeout(function(){
        $('.ui-slideup .ok-btn').trigger('click');

        equal(input.val(), '2013-04-24', '赋值成功');


        input.calendar('destroy');
        setTimeout(start, 500);
    }, 1000);

});


test("method: show/hide", function(){
    expect(3);
    stop();
    var input = $('<input type="text">');

    input.calendar({date: '2013-04-24'});

    ok($('.ui-slideup').length==0, 'ok');

    input.calendar('show');

    setTimeout(function(){
        ok($('.ui-slideup').length, 'ok');

        input.calendar('hide');

        setTimeout(function(){
            ok($('.ui-slideup').length==0, 'ok');

            input.calendar('destroy');
            setTimeout(start, 500);
        }, 1000);
    }, 1000);

});


test("event: show/hide/beforehide", function(){
    expect(7);
    stop();
    var input = $('<input type="text">'),
        flag;

    input.calendar({
        date: '2013-04-24',
        show: function(){
            ok(true, 'ok');
        },
        hide: function(){
            ok(true, 'ok');
        },
        beforehide: function(e){
            ok(true, 'ok');
            if(!flag) {
                e.preventDefault();
                flag = true;
            }
        }
    });

    input.calendar('on', 'show', function(){
        ok(true, 'ok');
    });

    input.calendar('on', 'hide', function(){
        ok(true, 'ok');
    });

    input.calendar('on', 'beforehide', function(){
        ok(true, 'ok');
    });

    input.calendar('show');

    setTimeout(function(){
        input.calendar('hide');

        input.calendar('hide');

        setTimeout(function(){
            input.calendar('destroy');
            setTimeout(start, 500);
        }, 1000);
    }, 1000);
});

test("event: commit", function(){
    expect(2);
    stop();
    var input = $('<input type="text">');

    input.calendar({
        date: '2013-04-24',
        commit: function(){
            ok(true, 'ok');
        }
    });

    input.calendar('on', 'commit', function(){
        ok(true, 'ok');
    });

    input.calendar('show');

    setTimeout(function(){
        $('.ui-slideup .ok-btn').trigger('click');

        setTimeout(function(){
            input.calendar('destroy');
            setTimeout(start, 500);
        }, 1000);
    }, 1000);
});