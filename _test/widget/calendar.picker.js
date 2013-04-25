module("widget - calendar.picker");

test("load assets", function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css", "widget/calendar/calendar.css", "widget/calendar/calendar.default.css"], function(){
        ok(true, "ok");
        start();
    });
});

test("render & el", function(){
    expect(4);
    stop();
    var input = $('<input type="text">');

    var ca = $.ui.calendar(input[0],{
    	date: '2013-04-24'
    });

    ok(!input.hasClass('ui-calendar'), '当加入picker插件, selector是赋值对象，不会作为容器处理');
    equals(ca.root()[0], input[0], 'The el is right');

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
    expect(4);
    stop();
    var input = $('<input type="text">');

    input.calendar({date: '2013-04-24'});

    ok(!input.hasClass('ui-calendar'), '当加入picker插件, selector是赋值对象，不会作为容器处理');
    equals(input.calendar('root')[0], input[0], 'The el is right');

    input.calendar('show');

    setTimeout(function(){
    	ok(ua.isShown(input.calendar('this')._container[0]), 'The calendar shows');
    	
    	ua.click($('.ui-slideup .ok-btn')[0]);

        equal(input.val(), '2013-04-24', '赋值成功');

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
            setTimeout(start, 300);
        }, 300);
    }, 200);
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
        ua.click($('.ui-slideup .ok-btn')[0]);

        setTimeout(function(){
            input.calendar('destroy');
            setTimeout(start, 300);
        }, 300);
    }, 200);
});

test("option: disablePlugin", function(){
    expect(1);
    var input = $('<input type="text">').appendTo(document.body);

    input.calendar({
        disablePlugin: true
    });
    
    input.calendar('this').show;
    
    equals(input.calendar('this').show, undefined, 'no plugin');
    
    input.calendar('destroy');
});

test("window resize", function(){
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
	        	equals(w.$('.ui-slideup').offset().height + w.$('.ui-slideup').offset().top, w.innerHeight, 'position is right');
	
	        	$(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 800).css("width", 600);
	            $.support.orientation ? ta.orientationchange(w) : ta.resize(w);
	             
	            setTimeout(function(){
	            	equals(w.$('.ui-slideup').offset().height + w.$('.ui-slideup').offset().top, w.innerHeight, 'position is right');
	            	
	                input.calendar('destroy');
	                setTimeout(me.finish, 300);
	            }, 300);
	        }, 800);
    	}, w);
    })
});
test("method: destroy",function(){
    ua.destroyTest(function(w,f){
    	w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var input = w.$('<input type="text">');
    	
        var instance = input.calendar('this');
        
        instance.destroy();
        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(instance);
        var dl2 =w.dt.domLength(w);
        equal(dl1,dl2,"The dom is ok");   
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The widget is destroy");
        this.finish();
    })
}) ;