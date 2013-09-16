module("widget - calendar.picker");

test("load assets", function(){
    expect(1);
    stop();
    ua.loadcss(["widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
        ok(true, "ok");
        start();
    });
});

test("render & el", function(){
    expect(4);
    stop();
    var input = $('<input type="text">');

    var ca = $.ui.Calendar(input[0],{
    	date: '2013-04-24'
    });

    ok(!input.hasClass('ui-calendar'), '当加入picker插件, selector是赋值对象，不会作为容器处理');
    equals(ca.$el[0], input[0], 'The el is right');

    ca.show();

    setTimeout(function(){
    	ok(ua.isShown(ca._container[0]), 'The calendar shows');
    	
    	a = ca._container.find('td a').filter(function(){
            return $(this).text() === '3';
        });
        ua.click(a[0]);
        
    	ua.click($('.ui-slideup .ok-btn')[0]);

        equal(input.val(), '2013-04-03', '赋值成功');

        ca.destroy();
        setTimeout(start, 500);
    }, 200);

});

test("init: selector", function(){
    expect(3);
    stop();
    var input = $('<input type="text">');

    input.calendar({date: '2013-04-24'});

    ok(!input.hasClass('ui-calendar'), '当加入picker插件, selector是赋值对象，不会作为容器处理');
    equals(input.calendar('this').$el[0], input[0], 'The el is right');

    input.calendar('show');

    setTimeout(function(){
    	ok(ua.isShown(input.calendar('this')._container[0]), 'The calendar shows');

        input.calendar('destroy');
        setTimeout(start, 500);
    }, 200);

});


test("method: show/hide", function(){
    expect(6);
    stop();
    var input = $('<input type="text">');

    input.calendar({date: '2013-04-24'});

    ok($('.ui-slideup').length==0, 'ok');
    ok(!ua.isShown(input.calendar('this')._container[0]), 'The calendar hides');

    input.calendar('show');

    setTimeout(function(){
        ok($('.ui-slideup').length, 'ok');
        ok(ua.isShown(input.calendar('this')._container[0]), 'The calendar shows');

        input.calendar('hide');

        setTimeout(function(){
            ok($('.ui-slideup').length==0, 'ok');
            ok(!ua.isShown(input.calendar('this')._container[0]), 'The calendar hides');

            input.calendar('destroy');
            setTimeout(start, 300);
        }, 300);
    }, 200);

});


test("event: show/hide/beforehide", function(){
    expect(8);
    stop();
    var input = $('<input type="text">'),
        flag;

    input.calendar({
        date: '2013-04-24',
        show: function(){
            ok(true, 'show fired');
        },
        hide: function(){
            ok(true, 'hide fired');
        },
        beforehide: function(e){
            ok(true, 'beforehide fired');
            if(!flag) {
                e.preventDefault();
                flag = true;
            }
        }
    });

    input.calendar('on', 'show', function(){
        ok(true, 'show fired');
    });

    input.calendar('on', 'hide', function(){
        ok(true, 'hide fired');
    });

    input.calendar('on', 'beforehide', function(){
        ok(true, 'beforehide fired');
    });

    input.calendar('show');

    setTimeout(function(){
        input.calendar('hide');

        input.calendar('hide');

        setTimeout(function(){
            input.calendar('destroy');
            setTimeout(start, 300);
        }, 300);
    }, 200);
});

test("user interface: submit & event: commit", function(){
    expect(4);
    stop();
    var input = $('<input type="text">').appendTo(document.body);

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
    	a = input.calendar('this')._container.find('td a').filter(function(){
            return $(this).text() === '25';
        });
    	
        ua.click(a[0]);
        
        ua.click($('.ui-slideup .ok-btn')[0]);

        setTimeout(function(){
        	ok(!ua.isShown(input.calendar('this')._container[0]), 'The calendar hides');
        	equals(input.val(), '2013-04-25', "The input value is right");
        	
            input.calendar('destroy');
            input.remove();
            setTimeout(start, 300);
        }, 300);
    }, 200);
});

test("user interface: cancel", function(){
    expect(2);
    stop();
    var input = $('<input type="text">').appendTo(document.body);

    input.calendar({
        date: '2013-04-24'
    });

    input.calendar('show');

    setTimeout(function(){
    	a = input.calendar('this')._container.find('td a').filter(function(){
            return $(this).text() === '25';
        });
    	
        ua.click(a[0]);
        
        ua.click($('.ui-slideup .no-btn')[0]);

        setTimeout(function(){
        	ok(!ua.isShown(input.calendar('this')._container[0]), 'The calendar hides');
        	equals(input.val(), '', "The input value is right");
        	
            input.calendar('destroy');
            input.remove();
            setTimeout(start, 300);
        }, 300);
    }, 200);
});

test("user interface: select the input value", function(){
    expect(1);
    stop();
    var input = $('<input type="text">').appendTo(document.body);
    input.val("2013-04-24")

    input.calendar();

    input.calendar('show');

    setTimeout(function(){
        equal(input.calendar('this')._container.find('.ui-calendar-current-day').text(), 24);
        
	    input.calendar('this').destroy();
        input.remove();
	    setTimeout(start, 300);
	}, 200);
});

test("window orientation change", function(){
    expect(2);
    stop();
    ua.frameExt(function(w, f){
    	var me = this;
    	ua.loadcss(["reset.css", "widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
    		$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 600).css("width", 800);
	    	var input = w.$('<input type="text">');
	
	        input.calendar();
	
	        input.calendar('show');
	
	        setTimeout(function(){
	        	approximateEqual(w.$('.ui-slideup').offset().height + w.$('.ui-slideup').offset().top, w.innerHeight, 'position is right');
	
	        	$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 800).css("width", 600);
                $(w).trigger('ortchange');
	             
	            setTimeout(function(){
	            	approximateEqual(w.$('.ui-slideup').offset().height + w.$('.ui-slideup').offset().top, w.innerHeight, 'position is right');
	            	
	                input.calendar('destroy');
	                setTimeout(me.finish, 300);
	            }, 300);
	        }, 800);
    	}, w);
    })
});

test("method: destroy",function(){
    ua.destroyTest(function(w,f){
    	var me = this;
    	w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var input = w.$('<input type="text">');
    	
        var instance = input.calendar('this');
        instance.show();
        
        instance.destroy();
        setTimeout(function(){
        	var el2= w.dt.eventLength();
            var dl2 =w.dt.domLength(w);
            equal(dl1,dl2,"The dom is ok");   
            equal(el1,el2,"The event is ok");
            me.finish();
        }, 800);
    })
}) ;