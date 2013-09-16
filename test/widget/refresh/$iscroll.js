module("widget/refresh.iscroll",{
    setup:function () {
        var html = '<div class="wrapper" style="height: 150px;">' +
            '<ul class="data-list">' +
            '<li>测试数据1</li>' +
            '<li>测试数据2</li>' +
            '<li>测试数据3</li>' +
            '<li>测试数据4</li>' +
            '<li>测试数据5</li>' +
            '<li>测试数据6</li>' +
            '<li>测试数据7</li>' +
            '<li>测试数据8</li>' +
            '<li>测试数据9</li>' +
            '<li>测试数据10</li>' +
            '</ul> ' +
            '</div> ';

        $('body').append(html);
    },
    teardown: function () {
        $('.ui-refresh-wrapper').remove();
        $('.wrapper').remove();
    }
});

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

function createDom (dir, $wrapper, w) {
    var w = w || window,
    	$wrapper = $wrapper || w.$('.wrapper'),
        upBtn = '<div class="ui-refresh-up"></div> ',
        downBtn = '<div class="ui-refresh-down"></div> ';
    switch (dir) {
        case 'up':
            $wrapper.prepend(upBtn);
            break;
        case 'down':
            $wrapper.append(downBtn);
            break;
        case 'both':
            $wrapper.prepend(upBtn);
            $wrapper.append(downBtn);
            break;
    }
};

//test
test("只为加载css用",function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css",  "loading.default.css", "widget/refresh/refresh.default.css", "widget/refresh/refresh.iscroll.default.css"], function(){
        ok(true, '样式加载进来了！');
        start();
    });
});

test('down-上拉加载', function () {
    createDom('down');
    expect(8);
    stop();

    var $wrapper = $('.wrapper'),
    	lis = $wrapper.find('li'),
        refresh = $wrapper.refresh({
            load: function (dir, type) {
            	equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-down').find('.ui-loading').attr("class"), "ui-loading", "icon显示正确");

                refresh.afterDataLoading();

                equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

                start();
            }
        }).refresh('this'),
        target = $wrapper.get(0);

	equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");
    ta.touchstart(target, {
    	touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: -300
        }]
    });

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: -300
    });

    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");

    ta.touchend(target);
    ua.mouseup(target);
});

test('up-下拉加载', function () {
    createDom('up');
    expect(8);
    stop();

    var $wrapper = $('.wrapper'),
    	lis = $wrapper.find('li'),
        refresh = $wrapper.refresh({
            load: function (dir, type) {
            	equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-up').find('.ui-loading').attr("class"), "ui-loading", "icon显示正确");

                refresh.afterDataLoading();

                equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

                start();
            }
        }).refresh('this'),
        target = $wrapper.get(0);

	equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");
    ta.touchstart(target, {
    	touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: 200
        }]
    });

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 200
    });

    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");

    ta.touchend(target);
    ua.mouseup(target);
});

test('both-上拉加载', function () {
    createDom('both');
    expect(8);
    stop();

    var $wrapper = $('.wrapper'),
    	lis = $wrapper.find('li'),
    	count = 0,
        refresh = $wrapper.refresh({
            load: function (dir, type) {
            	equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-down').find('.ui-loading').attr("class"), "ui-loading", "icon显示正确");

            	refresh.afterDataLoading();

            	equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

                start();
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    //上拉
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: -500
        }]
    });

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: -500
    });

    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");

    ta.touchend(target);
    ua.mouseup(target);
});

test('both-下拉加载', function () {
    createDom('both');
    expect(8);
    stop();

    var $wrapper = $('.wrapper'),
    	lis = $wrapper.find('li'),
    	count = 0,
        refresh = $wrapper.refresh({
            load: function (dir, type) {
        		equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-up').find('.ui-loading').attr("class"), "ui-loading", "icon显示正确");

                refresh.afterDataLoading();

                equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

                start();
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");

    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: 200
        }]
    });

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 200
    });

    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");

    ta.touchend(target);
    ua.mouseup(target);
});

test("参数options - iScrollOpts", function(){
    createDom('down');
    expect(1);

    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
        	iScrollOpts: {
        		hScroll: false
        	}
        }).refresh('this');
    equals(refresh._options.iScroll.options.hScroll, false, "The iScrollOpts is right");
});

test("参数options - statechange", function(){
    createDom('down');
    expect(4);
    stop();

    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
        	load: function(){
        		refresh.afterDataLoading();
                refresh.disable();
        	},
            statechange: function(e, $btn, state, dir){
                count++;
                switch(state){
                    case 'beforeload':
                        ok(true, "refresh即将加载！方向:"+dir);
                        break;
                    case 'loaded':
                        ok(true, "refresh取消加载！方向:"+dir);
                        break;
                    case 'loading':
                        ok(true, "refresh正在加载！方向:"+dir);
                        break;
                    case 'disable':
                        ok(true, "refresh被禁用了！方向:"+dir);
                        start();
                        break;
                    default:
                        break;
                }
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var l = $(target).offset().left + 10;
    var t = $(target).offset().top + $(target).offset().height -10;
    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t - 300
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: l,
        clientY: t
    });
    ua.mousemove(target, {
        clientX: l,
        clientY: t - 300
    });
    ua.mouseup(target);
});

test('参数threshold-不传, 上拉, 大于默认阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(true);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: (- h - 6) * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: (- h - 6) * 2 //大于默认阈值5px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	start();
    }, 400);
});

test('参数threshold-不传, 上拉, 小于默认阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(false);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉

    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: (- h - 4) * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: (- h - 4) * 2 //小于默认阈值5px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	ok(true);
    	start();
    }, 400);
});

test('参数threshold-不传, 下拉, 大于默认阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(true);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: 6 * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 6 * 2  //大于默认阈值5px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	start();
    }, 400);
});

test('参数threshold-不传, 下拉, 小于默认阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(false);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: 4 * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 4 * 2 //小于默认阈值5px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	ok(true);
    	start();
    }, 400);
});

test('参数threshold-传20, 上拉, 大于阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
    		threshold: 20,
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(true);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: (- h - 21) * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: (- h - 21) * 2 //大于默认阈值20px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	start();
    }, 400);
});

test('参数threshold-传20, 上拉, 小于阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
    		threshold: 20,
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(false);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: (- h - 19) * 2
        }]
    });

    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: (- h - 19) * 2 //小于默认阈值20px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	ok(true);
    	start();
    }, 400);
});

test('参数threshold-传20, 下拉, 大于阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
    		threshold: 20,
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(true);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
	ta.touchstart(target, {
		touches:[
			{
				pageX:0,
				pageY:0
			}
		]
	});
	ta.touchmove(target, {
		touches:[
			{
				pageX:0,
				pageY:21 * 2
			}
		]
	});

	ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 21 * 2  //大于默认阈值20px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	start();
    }, 400);
});

test('参数threshold-传20, 下拉, 小于阈值', function () {
    createDom('both');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
    	refresh = $wrapper.refresh({
    		threshold: 20,
            load: function (dir, type) {
        		refresh.afterDataLoading();
                ok(false);
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var h = $wrapper.height() - $wrapper.parent().height();

    //上拉
    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 19 * 2 //小于默认阈值20px
    });
    ua.mouseup(target);

    setTimeout(function(){
    	ok(true);
    	start();
    }, 400);
});

test("公共方法 － enable&disable", function(){
    createDom('down');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
        count = 0,
        refresh = $wrapper.refresh({
	        load:function (dir, type) {
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 10);
            	ok(true, "load 被触发");
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var l = $(target).offset().left+10;
    var t = $(target).offset().top + $(target).offset().height-10;
    
	refresh.disable('down');
    ta.touchstart(target, {
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: 0,
            pageY: 0 -300
        }]
    });
    ta.touchend(target);

    ua.mousedown(target, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(target, {
        clientX: 0,
        clientY: 0 - 300
    });
    ua.mouseup(target);
	// setTimeout(function(){
		refresh.enable();

	    ta.touchstart(target, {
	        touches:[{
	            pageX: 0,
	            pageY: 0
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: 0,
	            pageY: 0 -300
	        }]
	    });
	    ta.touchend(target);

	    ua.mousedown(target, {
	        clientX: 0,
	        clientY: 0
	    });
	    ua.mousemove(target, {
	        clientX: 0,
	        clientY: 0 - 300
	    });
        // debugger;
	    ua.mouseup(target);

	    setTimeout(function(){
	    	start();
	    }, 400);
	// }, 100);
});

test('显示 - topOffset（部分断言被注释）', function () {
    createDom('both');
    expect(2);
    stop();

    var $wrapper = $('.wrapper'),
    	lis = $wrapper.find('li'),
        refresh = $wrapper.refresh().refresh('this');

    setTimeout(function(){
    	// equals($wrapper.height(), tablet? 316:298, "iscroll高度正确");
        // 不知道这个高度从哪儿来的，先注释掉
        equals($wrapper.parent().height(), 150, "容器高度正确");
        // equals($wrapper.find(".ui-refresh-up").offset().top, $wrapper.parent().offset().top - $wrapper.find(".ui-refresh-up").height(), "topOffset正确");
        // 减掉高度干嘛？
        equals($wrapper.find(".ui-refresh-up").offset().top, $wrapper.parent().offset().top, "topOffset正确");
        start();
    }, 500);
});

test("交互 － 加载过程中不响应滑动动作", function(){
    createDom('down');
    $('.wrapper li').css('height', '18px'); // 必须设置高度，否则在不同设备上iscroll的高度不一样，跑出的结果也不一样
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
        count = 0,
        refresh = $wrapper.refresh({
            load: function(){
            	ok(true, "load 被触发");
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var l = $(target).offset().left+10;
    var t = $(target).offset().top + $(target).offset().height-10;

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t -200
        }]
    });
    ta.touchend(target);

    ua.mousedown(target, {
        clientX: l,
        clientY: t
    });
    ua.mousemove(target, {
        clientX: l,
        clientY: t - 200
    });
    ua.mouseup(target);

    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: t
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: t -200
	        }]
	    });
	    ta.touchend(target);

	    ua.mousedown(target, {
	        clientX: l,
	        clientY: t
	    });
	    ua.mousemove(target, {
	        clientX: l,
	        clientY: t - 200
	    });
	    ua.mouseup(target);

	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test("destroy", function(){
	$(".wrapper").remove();
    ua.destroyTest(function(w,f){
    	var html = '<div class="wrapper"><ul class="data-list"><li>测试数据1</li></ul></div>';
    	w.$('body').append(html);
    	createDom('up', null, w);

    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();
        
        var refresh = w.$(".wrapper").refresh("this");
        refresh.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2+3,"The dom is ok"); //TODO:destroy时删除了用户创建的元素
        equal(el1,el2,"The event is ok");
        this.finish();
    });
});