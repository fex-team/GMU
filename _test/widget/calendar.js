module("widget - calendar");

function setup1() {
    $('<div id="calendar"></div>').appendTo(document.body);
}

test("load assets", function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css", "widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
        ok(true, "ok");
        start();
    });
});

test("option: el & container", function(){
    expect(4);
    stop();

    setup1();

    var calendar = $('#calendar')[0];

    equal($('#calendar').calendar('root')[0], calendar, 'ok');
    $('#calendar').calendar('destroy');

    calendar = $.ui.calendar();
    ok(calendar.root().is('div'), 'ok');
    ok(calendar.root().parent().is('body'), 'ok');
    calendar.destroy();

    var div = $('<div></div>');

    calendar = $.ui.calendar({
        container: div
    });

    equal(calendar.root().parent().get(0), div.get(0), 'ok');
    start();

});

test("date option & date function & date logic", function(){
    expect(27);
    stop();
    setup1();

    var div,
        opt,
        date;

    $.each(['date', 'minDate', 'maxDate'], function(i, name){
        div = $('<div></div>');

        opt = {};

        opt[name] = '2012-02-09';

        div.calendar(opt);

        date = div.calendar(name);
        equal(date.getFullYear(), 2012, 'ok');
        equal(date.getMonth(), 1, 'ok');
        equal(date.getDate(), 9, 'ok');

        //测试方法
        div.calendar(name, '2013-03-09');
        date = div.calendar(name);

        equal(date.getFullYear(), 2013, 'ok');
        equal(date.getMonth(), 2, 'ok');
        equal(date.getDate(), 9, 'ok');

        //测试方法setter是否返回对象集合
        equal(div.calendar(name, '2013-03-09'), div, 'ok');

        div.calendar('destroy');
    });

    //测试minDate作用
    div = $('<div></div>');
    div.calendar({minDate: '2013-04-02', select: function(){
        ok(false, 'select事件不应该触发了');
    }});
    div.calendar('switchMonthTo', 2, 2012);
    equal(div.calendar('data', '_drawMonth'), 3, '尝试切换到3月，结果将是4月');
    equal(div.calendar('data', '_drawYear'), 2013, '尝试切换到2012，结果将是2013');

    var td = div.find('td').filter(function(){
        return $(this).text()==='1';
    });

    ok(td.hasClass('ui-calendar-unSelectable'), '小于最小日期的天不可点');

    ua.click(td.get(0));

    div.calendar('destroy');

    //测试maxDate作用
    div = $('<div></div>');
    div.calendar({maxDate: '2013-04-02', select: function(){
        ok(false, 'select事件不应该触发了');
    }});
    div.calendar('switchMonthTo', 4, 2014);
    equal(div.calendar('data', '_drawMonth'), 3, '尝试切换到5月，结果将是4月');
    equal(div.calendar('data', '_drawYear'), 2013, '尝试切换到2014，结果将是2013');

    var td = div.find('td').filter(function(){
        return $(this).text()==='3';
    });

    ok(td.hasClass('ui-calendar-unSelectable'), '大于最大日期的天不可点');

    ua.click(td.get(0));
    div.calendar('destroy');

    start();
});


test("option: swipeable", function(){

    var div = $('<div></div>');

    div.calendar({
        date: '2013-04-24'
    });

    equal( div.calendar('data', 'swipeable'), false, '默认为false');
    div.calendar('destroy');

    div.calendar({
        date: '2013-04-24',
        swipeable: true
    });

    equal( div.calendar('data', 'swipeable'), true, '传入true, 应该为true');

    div.trigger('swipeLeft');

    equal(div.calendar('data', '_drawMonth'), 4, '向左滑动，应该切换到5月');

    div.trigger('swipeRight');
    div.trigger('swipeRight');

    equal(div.calendar('data', '_drawMonth'), 2, '向右滑动两次，应该切换到3月');

    //todo 测试手势

    div.calendar('destroy');

});

test("option: monthChangeable & yearChangeable", function(){
    var fcfirst = function(str){
        return str.substr(0, 1).toUpperCase()+str.substr(1);
    }
    $.each(['month', 'year'], function(i, name){

        var div = $('<div></div>');

        div.calendar({
            date: '2013-04-24'
        });

        equal( div.calendar('data', name+'Changeable'), false, '默认为false');

        ok(!div.find('.ui-calendar-'+name).is('select'), '不可选的时候不是select标签');

        div.calendar('destroy');

        var opt = {
            date: '2013-04-24'
        };
        opt[name+'Changeable'] = true;

        div.calendar(opt);

        ok(div.find('.ui-calendar-'+name).is('select'), '可选的时候是select标签');

        var newValue = div.find('.ui-calendar-'+name).children().val();

        div.find('.ui-calendar-'+name).val(newValue).trigger('change');

        equal(div.calendar('data', '_draw'+fcfirst(name)), newValue, '修改select，并触发select事件应该让试图修改');

        div.calendar('destroy');
    });
});

test("event: select", function(){
    stop();
    expect(14);

    var div = $("<div><a>fjdkalfd</a></div>").appendTo(document.body),
        instance,
        a;

    div.calendar({
        date: '2013-04-02',
        select: function(e, date, datestr, ui){
            equal(date.getFullYear(), 2013, 'ok');
            equal(date.getMonth(), 3, 'ok');
            equal(date.getDate(), 3, 'ok');
            equal(datestr, '2013-04-03', 'ok');
            equal(ui, instance, 'ok');
            equal(this, instance, 'ok');
        }
    });

    div.on('select', function(){
        ok(true, '通过div绑定的事件也触发了');
        equal(this, div[0], 'ok');
    });

    div.calendar('on', 'select', function(e, date, datestr, ui){
        equal(date.getFullYear(), 2013, 'ok');
        equal(date.getMonth(), 3, 'ok');
        equal(date.getDate(), 3, 'ok');
        equal(datestr, '2013-04-03', 'ok');
        equal(ui, instance, 'ok');
        equal(this, instance, 'ok');
    });

    instance = div.calendar('this');

    a = div.find('td a').filter(function(){
        return $(this).text() === '3';
    });
    a.trigger('click');
    instance.destroy();
    start();
});

test("event: monthchange", function(){
    stop();
    expect(9);

    var div = $('<div></div>').calendar({
            date: '2013-04-24',
            monthchange: function(e, month, year, ui){
                equal(month, 2, 'ok');
                equal(year, 2012, 'ok');
                equal(ui, instance, 'ok');
                equal(this, instance, 'ok');
            }
        }),
        instance = div.calendar('this');

    div.on('monthchange', function(){
        ok(true, '')
    });

    div.calendar('on', 'monthchange', function(e, month, year, ui){
        equal(month, 2, 'ok');
        equal(year, 2012, 'ok');
        equal(ui, instance, 'ok');
        equal(this, instance, 'ok');
    });

    div.calendar('switchMonthTo', 2, 2012);

    div.calendar('destroy');
    start();
});

test("method: switchMonthTo", function(){
    var div = $('<div></div>');

    div.calendar({date: '2013-04-24'});
    equal(div.calendar('data', '_drawYear'), 2013, 'ok');
    equal(div.calendar('data', '_drawMonth'), 3, 'ok');

    div.calendar('switchMonthTo', 1, 2012);

    equal(div.calendar('data', '_drawYear'), 2012, 'ok');
    equal(div.calendar('data', '_drawMonth'), 1, 'ok');

    div.calendar('destroy');
});

test("method: switchToToday", function(){
    var div = $('<div></div>'),
        today = new Date();

    div.calendar({date: '2012-04-24'});
    equal(div.calendar('data', '_drawYear'), 2012, 'ok');
    equal(div.calendar('data', '_drawMonth'), 3, 'ok');

    div.calendar('switchToToday');
    equal(div.calendar('data', '_drawYear'), today.getFullYear(), 'ok');
    equal(div.calendar('data', '_drawMonth'), today.getMonth(), 'ok');

    div.calendar('destroy');
});

test("method: refresh", function(){
    var div = $('<div></div>');

    div.calendar({date: '2012-04-24'});
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2012, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 4, 'ok');

    div.calendar('date', '2013-05-24');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2012, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 4, 'ok');

    div.calendar('refresh');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2013, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 5, 'ok');

    div.calendar('destroy');
});

test("method: selectedDate", function(){
    var div = $('<div></div>'),
        date;

    div.calendar({date: '2013-04-24'});
    date = div.calendar('selectedDate');

    equal( date.getFullYear(), 2013, 'ok' );
    equal( date.getMonth(), 3, 'ok' );
    equal( date.getDate(), 24, 'ok' );

    equal(div.find('.ui-calendar-current-day').text(), 24);

    div.calendar('selectedDate', '2013-04-25');
    div.calendar('refresh');

    date = div.calendar('selectedDate');

    equal( date.getFullYear(), 2013, 'ok' );
    equal( date.getMonth(), 3, 'ok' );
    equal( date.getDate(), 25, 'ok' );

    equal(div.find('.ui-calendar-current-day').text(), 25);

    div.calendar('destroy');
});


test("method: destroy",function(){
    ua.destroyTest(function(w,f){
        w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var instance =  w.$.ui.calendar();
        instance.destroy();
        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(instance);
        var dl2 =w.dt.domLength(w);
        equal(dl1,dl2,"The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The widget is destroy");
        this.finish();
    })
}) ;

test("user interface: next-prev month", function(){
    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
        date:'2013-04-24'
    });

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201304');

    div.find('.ui-calendar-next').trigger('click');

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201305');

    div.find('.ui-calendar-prev').trigger('click');

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201304');

    div.calendar('destroy');
});