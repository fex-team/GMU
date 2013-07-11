module("widget - calendar");

function setup1() {
    $('<div id="calendar"></div>').appendTo(document.body);
}

test("load assets", function(){
    expect(1);
    stop();
    ua.loadcss(["widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
        ok(true, "ok");
        start();
    });
});

test("option: el(default) & container(default)", function(){
    expect(5);

    calendar = $.ui.Calendar();

    equals(calendar.$el.attr("class"), "ui-calendar", "The el is right");
    equals(calendar.$el.parent()[0], document.body, "The container is right");
    ok(ua.isShown(calendar.$el[0]), "The container shows");
    equals(calendar._options['container'], undefined, "The option is right");
    
    equals(calendar.$el.find('.ui-calendar-today').text(), (new Date()).getDate(), "today is right");
    calendar.destroy();
});

test("option: el(selector) & container(default)", function(){
    expect(4);

    $("<div id='test'><div class='ui-calendar-my'></div></div>").appendTo(document.body);
    calendar = $.ui.Calendar('.ui-calendar-my');

    equals(calendar.$el.attr("class"), "ui-calendar-my ui-calendar", "The el is right");
    equals(calendar.$el.parent().attr("id"), "test", "The container is right");
    ok(ua.isShown(calendar.$el[0]), "The container shows");
    equals(calendar._options['container'], undefined, "The option is right");
    calendar.destroy();
    $("#test").remove();
});

test("option: el(zepto) & container", function(){
    expect(4);

    $("<div id='container'></div>").appendTo(document.body);
    calendar = $.ui.Calendar($('<div id="calendar"></div>'), {
    	container: "#container"
    });

    equals(calendar.$el.attr("class"), "ui-calendar", "The el is right");
    equals(calendar.$el.parent().attr("id"), "container", "The container is right");
    ok(ua.isShown(calendar.$el[0]), "The container shows");
    equals(calendar._options['container'], "#container", "The option is right");
    calendar.destroy();
    $("#container").remove();
});

test("option: date & method: date", function(){
    expect(16);

    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
    	date: new Date(2012,1,9)
    });

    //测试getter方法（日期对象）
    date = div.calendar('date');
    equal(date.getFullYear(), 2012, 'ok');
    equal(date.getMonth(), 1, 'ok');
    equal(date.getDate(), 9, 'ok');
    
    //测试样式
    equal(div.find('.ui-calendar-current-day').attr('data-year'), 2012, 'ok');
    equal(div.find('.ui-calendar-current-day').attr('data-month'), 1, 'ok');
    equal(div.find('.ui-calendar-current-day').text(), 9, 'ok');

    //测试setter方法（日期字符串）
    var s = div.calendar('date', '2013-03-10');
    date = div.calendar('date');
    equal(date.getFullYear(), 2013, 'ok');
    equal(date.getMonth(), 2, 'ok');
    equal(date.getDate(), 10, 'ok');
    
    //测试样式
    div.calendar('refresh');
    equal(div.find('.ui-calendar-current-day').attr('data-year'), 2013, 'ok');
    equal(div.find('.ui-calendar-current-day').attr('data-month'), 2, 'ok');
    equal(div.find('.ui-calendar-current-day').text(), 10, 'ok');
    
    //测试方法setter是否返回对象集合
    equal(s, div, 'ok');

    div.calendar('destroy');

    //默认值
    div = $('<div></div>').appendTo(document.body);
    div.calendar();
    
    date = div.calendar('date');
    today = new Date();
    equal(date.getFullYear(), today.getFullYear(), 'ok');
    equal(date.getMonth(), today.getMonth(), 'ok');
    equal(date.getDate(), today.getDate(), 'ok');
    
    div.calendar('destroy');
});

test("option: minDate & method: minDate", function(){
    expect(13);

    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
    	minDate: new Date(2013,3,2),
	    select: function(){
	        ok(false, 'select事件不应该触发了');
	    }
    });

    //测试getter方法（日期对象）
    date = div.calendar('minDate');
    equal(date.getFullYear(), 2013, 'ok');
    equal(date.getMonth(), 3, 'ok');
    equal(date.getDate(), 2, 'ok');
    
    //测试样式和作用
    div.calendar('switchMonthTo', 2, 2012);
    equal(div.calendar('this')._options._drawMonth, 3, '尝试切换到3月，结果将是4月');
    equal(div.calendar('this')._options._drawYear, 2013, '尝试切换到2012，结果将是2013');
    var td = div.find('td').filter(function(){
        return $(this).text()==='1';
    });
    ok(td.hasClass('ui-calendar-unSelectable'), '小于最小日期的天不可点');
    ua.click(td.get(0));

    //测试setter方法（日期字符串）
    var s = div.calendar('minDate', '2013-03-10');
    date = div.calendar('minDate');
    equal(date.getFullYear(), 2013, 'ok');
    equal(date.getMonth(), 2, 'ok');
    equal(date.getDate(), 10, 'ok');
    
    //测试样式和作用
    div.calendar('refresh');
    div.calendar('switchMonthTo', 1, 2013);
    equal(div.calendar('this')._options._drawMonth, 2, '尝试切换到2月，结果将是3月');
    equal(div.calendar('this')._options._drawYear, 2013, '尝试切换到2013，结果将是2013');
    var td = div.find('td').filter(function(){
        return $(this).text()==='9';
    });
    ok(td.hasClass('ui-calendar-unSelectable'), '小于最小日期的天不可点');
    ua.click(td.get(0));
    
    div.calendar('destroy');

    //默认值
    div = $('<div></div>').appendTo(document.body);
    div.calendar();
    
    date = div.calendar('minDate');
    today = new Date();
    equal(date, null, 'ok');

    div.calendar('destroy');
});

test("option: maxDate & method: maxDate", function(){
    expect(13);

    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
    	maxDate: new Date(2013,3,2),
    	select: function(){
    	    ok(false, 'select事件不应该触发了');
    	}
    });

    //测试getter方法（日期对象）
    date = div.calendar('maxDate');
    equal(date.getFullYear(), 2013, 'ok');
    equal(date.getMonth(), 3, 'ok');
    equal(date.getDate(), 2, 'ok');
    
    //测试样式和作用
    div.calendar('switchMonthTo', 4, 2014);
    equal(div.calendar('this')._options._drawMonth, 3, '尝试切换到5月，结果将是4月');
    equal(div.calendar('this')._options._drawYear, 2013, '尝试切换到2014，结果将是2013');
    var td = div.find('td').filter(function(){
        return $(this).text()==='3';
    });
    ok(td.hasClass('ui-calendar-unSelectable'), '小于最小日期的天不可点');
    ua.click(td.get(0));

    //测试setter方法（日期字符串）
    var s = div.calendar('maxDate', '2013-03-10');
    date = div.calendar('maxDate');
    equal(date.getFullYear(), 2013, 'ok');
    equal(date.getMonth(), 2, 'ok');
    equal(date.getDate(), 10, 'ok');
    
    //测试样式和作用
    div.calendar('refresh');
    div.calendar('switchMonthTo', 3, 2013);
    equal(div.calendar('this')._options._drawMonth, 2, '尝试切换到4月，结果将是3月');
    equal(div.calendar('this')._options._drawYear, 2013, '尝试切换到2013，结果将是2013');
    var td = div.find('td').filter(function(){
        return $(this).text()==='11';
    });
    ok(td.hasClass('ui-calendar-unSelectable'), '小于最小日期的天不可点');
    ua.click(td.get(0));
    
    div.calendar('destroy');

    //默认值
    div = $('<div></div>').appendTo(document.body);
    div.calendar();
    
    date = div.calendar('maxDate');
    today = new Date();
    equal(date, null, 'ok');

    div.calendar('destroy');
});

test("option: swipeable", function(){

    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
        date: '2013-01-24'
    });

    equal( div.calendar('this')._options['swipeable'], false, '默认为false');
    
    div.trigger('swipeLeft');

    equal(div.calendar('this')._options._drawMonth, 0, '向左滑动，不切换');

    div.trigger('swipeRight');

    equal(div.calendar('this')._options._drawMonth, 0, '向右滑动，不切换');
    
    div.calendar('destroy');

    div = $('<div></div>').appendTo(document.body);
    
    div.calendar({
        date: '2013-01-24',
        swipeable: true
    });

    equal( div.calendar('this')._options['swipeable'], true, '传入true, 应该为true');

    div.trigger('swipeRight');

    equal(div.calendar('this')._options._drawMonth, 11, '向右滑动，应该切换到12月');
    equal(div.calendar('this')._options._drawYear, 2012, '向右滑动，应该切换到2012年');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 12, '向右滑动，应该切换到12月');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2012, '向右滑动，应该切换到2012年');
    

    div.trigger('swipeLeft');
    div.trigger('swipeLeft');

    equal(div.calendar('this')._options._drawMonth, 1, '向左滑动两次，应该切换到2月');
    equal(div.calendar('this')._options._drawYear, 2013, '向左滑动两次，应该切换到2013年');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 2, '向左滑动两次，应该切换到2月');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2013, '向左滑动两次，应该切换到2013年');

    //todo 测试手势

    div.calendar('destroy');

});

test("option: monthChangeable & yearChangeable", function(){
    var fcfirst = function(str){
        return str.substr(0, 1).toUpperCase()+str.substr(1);
    }
    $.each(['month', 'year'], function(i, name){

        var div = $('<div></div>').appendTo(document.body);

        div.calendar({
            date: '2013-01-24'
        });

        equal( div.calendar('this')._options[name+'Changeable'], false, '默认为false');

        ok(!div.find('.ui-calendar-'+name).is('select'), '不可选的时候不是select标签');

        div.calendar('destroy');

        var opt = {
            date: '2013-01-24',
            swipeable: true
        };
        opt[name+'Changeable'] = true;

        div = $('<div></div>').appendTo(document.body);
        
        div.calendar(opt);

        ok(div.find('.ui-calendar-'+name).is('select'), '可选的时候是select标签');
        
        div.trigger('swipeRight');

        if(name == 'month'){
        	equal(div.find('.ui-calendar-month').find("option[selected]").text().replace(/[^\d]/g, ''), 12, '右滑修改month');
            equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2012, '右滑修改year');
        }
        if(name == 'year'){
        	equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 12, '右滑修改month');
            equal(div.find('.ui-calendar-year').find("option[selected]").text().replace(/[^\d]/g, ''), 2012, '右滑修改year');
        }

        var newValue = div.find('.ui-calendar-'+name).children().val();

        div.find('.ui-calendar-'+name).val(newValue).trigger('change');

        equal(div.calendar('this')._options['_draw'+fcfirst(name)], newValue, '修改select，并触发select事件应该让试图修改');
        equal(div.find('.ui-calendar-'+name).val(), newValue, '修改select，并触发select事件应该让试图修改');

        
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
    ua.click(a[0]);
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
    var div = $('<div></div>').appendTo(document.body);

    div.calendar({date: '2013-04-24'});
    equal(div.calendar('this')._options._drawYear, 2013, 'ok');
    equal(div.calendar('this')._options._drawMonth, 3, 'ok');
    
    div.calendar('switchMonthTo', '+2M');

    equal(div.calendar('this')._options._drawYear, 2013, 'ok');
    equal(div.calendar('this')._options._drawMonth, 5, 'ok');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2013, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 6, 'ok');
    
    div.calendar('switchMonthTo', '-10Y');

    equal(div.calendar('this')._options._drawYear, 2003, 'ok');
    equal(div.calendar('this')._options._drawMonth, 5, 'ok');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2003, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 6, 'ok');

    div.calendar('switchMonthTo', 1, 2012);

    equal(div.calendar('this')._options._drawYear, 2012, 'ok');
    equal(div.calendar('this')._options._drawMonth, 1, 'ok');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), 2012, 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), 2, 'ok');

    div.calendar('destroy');
});

test("method: switchToToday", function(){
    var div = $('<div></div>').appendTo(document.body),
        today = new Date();

    div.calendar({date: '2012-04-24'});
    equal(div.calendar('this')._options._drawYear, 2012, 'ok');
    equal(div.calendar('this')._options._drawMonth, 3, 'ok');

    div.calendar('switchToToday');
    equal(div.calendar('this')._options._drawYear, today.getFullYear(), 'ok');
    equal(div.calendar('this')._options._drawMonth, today.getMonth(), 'ok');
    equal(div.find('.ui-calendar-year').text().replace(/[^\d]/g, ''), today.getFullYear(), 'ok');
    equal(div.find('.ui-calendar-month').text().replace(/[^\d]/g, ''), today.getMonth() + 1, 'ok');

    div.calendar('destroy');
});

test("method: refresh", function(){
    var div = $('<div></div>').appendTo(document.body);

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
    var div = $('<div></div>').appendTo(document.body),
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

        var instance =  w.$.ui.Calendar();
        instance.destroy();
        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);
        equal(dl1,dl2,"The dom is ok");   
        equal(el1,el2,"The event is ok");
        this.finish();
    })
}) ;

test("user interface: next-prev month & click day", function(){
    var div = $('<div></div>').appendTo(document.body);

    div.calendar({
        date:'2013-12-24'
    });

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201312');

    div.find('.ui-calendar-next').trigger('click');

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201401');

    div.find('.ui-calendar-prev').trigger('click');

    equal(div.find('.ui-calendar-title').text().replace(/[^\d]+/g, ''), '201312');
    
    a = div.find('td a').filter(function(){
        return $(this).text() === '3';
    });
    ua.click(a[0]);
    
    equal(div.find('.ui-calendar-current-day').text(), 3);

    div.calendar('destroy');
});