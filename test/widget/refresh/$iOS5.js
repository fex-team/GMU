module("widget/refresh.iOS5",{
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
        $('.wrapper').remove();
    }
});

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

//只有PC和ios5以上支持
if((!$.os.phone && !$.os.tablet)||($.os.ios && parseFloat($.os.version) > 5)){
	test("只为加载css用",function(){
	    expect(1);
	    stop();
	    ua.loadcss(["reset.css",  "loading.default.css", "widget/refresh/refresh.default.css", "widget/refresh/refresh.iOS5.default.css"], function(){
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

	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;
	    
		equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");
	   
	    ta.touchstart(target);
	    
	    target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");
	    
	    ta.touchend(target);
	});

	test('up-下拉加载 & threshold', function () {
	    createDom('up');
	    expect(8);
	    stop();

	    var $wrapper = $('.wrapper'),
	    	lis = $wrapper.find('li'),
	        refresh = $wrapper.refresh({
	        	threshold: -5,
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
	    
	    ta.touchstart(target);
	    
	    target.scrollTop = 0;  //scrollTop不能设置赋值，只有通过给threshold传负值触发其加载
	    ta.touchmove(target);
	    
	    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");
	   
	    ta.touchend(target);
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
	    
	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon", "icon显示正确");
	    
	    ta.touchstart(target);
	   
	    target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");
	    
	    ta.touchend(target);
	});

	test('both-下拉加载', function () {
	    createDom('both');
	    expect(8);
	    stop();

	    var $wrapper = $('.wrapper'),
	    	lis = $wrapper.find('li'),
	    	count = 0,
	        refresh = $wrapper.refresh({
	        	threshold: -5,
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
	    
	    ta.touchstart(target);
	    
	    target.scrollTop = 0;  //scrollTop不能设置赋值，只有通过给threshold传负值触发其加载
	    ta.touchmove(target);
	    
	    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
	    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').attr("class"), "ui-refresh-icon ui-refresh-flip", "icon显示正确");
	    
	    ta.touchend(target);
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

	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    ta.touchstart(target);
	    target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	});

	test('参数threshold-不传, 上拉, 小于阈值', function () {
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

	     var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    ta.touchstart(target);
	    target.scrollTop = h + 4; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	ok(true);
	    	start();
	    }, 400);
	});

	test('参数threshold-传10, 上拉, 小于阈值', function () {
	    createDom('both');
	    expect(1);
	    stop();

	    var $wrapper = $('.wrapper'),
	    	refresh = $wrapper.refresh({
	    		threshold: 10,
	            load: function (dir, type) {
	        		refresh.afterDataLoading();
	                ok(false);
	            }
	        }).refresh('this'),
	        target = $wrapper.get(0);

	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    ta.touchstart(target);
	    target.scrollTop = h + 9; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	ok(true);
	    	start();
	    }, 400);
	});

	test('参数threshold-传10, 上拉, 大于阈值', function () {
	    createDom('both');
	    expect(1);
	    stop();

	    var $wrapper = $('.wrapper'),
	    	refresh = $wrapper.refresh({
	    		threshold: 10,
	            load: function (dir, type) {
	        		refresh.afterDataLoading();
	                ok(true);
	            }
	        }).refresh('this'),
	        target = $wrapper.get(0);

	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    ta.touchstart(target);
	    target.scrollTop = h + 11; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 400);
	});

	test("公共方法 － enable&disable", function(){
	    createDom('down');
	    expect(2);
	    stop();
	    
	    var $wrapper = $('.wrapper'),
	        count = 0,
	        refresh = $wrapper.refresh({
	            load: function(){
	            	setTimeout(function(){
	            		refresh.afterDataLoading();
	            	}, 0);
	            	ok(true, "load 被触发");      
	            }
	        }).refresh('this'),
	        target = $wrapper.get(0);
	    
	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;

	    //上拉
	    ta.touchstart(target);
	    target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	   
	    setTimeout(function(){
	    	refresh.disable('down');
	        
	    	ta.touchstart(target);
	    	target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	        ta.touchmove(target);
	        ta.touchend(target);
	        
	    	setTimeout(function(){
	    		refresh.enable();

	    		ta.touchstart(target);
	    		target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    	    ta.touchmove(target);
	            ta.touchend(target);
	    	    
	    	    setTimeout(function(){
	    	    	start();
	    	    }, 10);
	    	}, 10);
	    },10);
	});

	test('显示 - topOffset', function () {
	    createDom('both');
	    expect(2);
	    stop();

	    var $wrapper = $('.wrapper'),
	    	lis = $wrapper.find('li'),
	        refresh = $wrapper.refresh().refresh('this');
	    
	    setTimeout(function(){
	        equals($wrapper.height(), 150, "容器高度正确");
	        // equals($wrapper.find(".ui-refresh-up").offset().top, $wrapper.offset().top - $wrapper.find(".ui-refresh-up").height(), "topOffset正确");
	        equals($wrapper.find(".ui-refresh-up").offset().top, $wrapper.offset().top, "topOffset正确");
	        start();
	    }, 500);
	});

	test("交互 － 加载过程中不响应滑动动作", function(){
	    createDom('down');
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
	    
	    var h = $wrapper[0].scrollHeight - $wrapper[0].offsetHeight;
	    
	    ta.touchstart(target);
		target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
	    ta.touchmove(target);
	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	ta.touchstart(target);
			target.scrollTop = h + 6; //touchmove的坐标不起作用，以wrapper的scrollTop限制加载
		    ta.touchmove(target);
	        ta.touchend(target);
		    
		    setTimeout(function(){
		    	start();
		    }, 10);
	    }, 10);
	});

	// test('参数disablePlugin:true', function () {
	//     createDom('both');
	//     expect(1);
	//     stop();

	//     var $wrapper = $('.wrapper'),
	//         lis = $wrapper.find('li'),
	//         refresh = $wrapper.refresh({
	//         	disablePlugin: true,
	//             load: function (dir, type) {
	//                 ok(true, 'load is triggered');
	//             }
	//         }).refresh('this'),
	//         target = $wrapper.get(0);

	//     refresh.data('threshold',-5);      //反冲距离
	//     setTimeout(function(){
	//         var l = $(target).offset().left+10;
	//         var t = $(target).offset().top-10;

	//         target.scrollTop = 0;//关键，要不然ios上不动。
	//         ta.touchstart(target, {
	//             targetTouches:[{
	//                 clientX: l,
	//                 clientY: t
	//             }]
	//         });
	//         ta.touchmove(target, {
	//             targetTouches:[{
	//                 clientX: l,
	//                 clientY: t-100
	//             }]
	//         });
	//         ta.touchend(target);
	//         setTimeout(function(){
	//         	equals(refresh._data.iScroll, undefined, "disbale plugin");
	//             start();
	//         }, 300);
	//     }, 500);
	// });

	test("destroy", function(){
		$(".wrapper").remove();
	    ua.destroyTest(function(w,f){
	    	var dl1 = w.dt.domLength(w);
	        var el1= w.dt.eventLength();

	    	var html = '<div class="wrapper"><ul class="data-list"><li>测试数据1</li></ul></div>';
	    	w.$('body').append(html);
	    	createDom('up', null, w);
	    	
	        var refresh = w.$(".wrapper").refresh("this");
	        refresh.destroy();

	        var el2= w.dt.eventLength();
	        var dl2 =w.dt.domLength(w);

	        equal(dl1,dl2,"The dom is ok");
	        equal(el1,el2,"The event is ok");
	        this.finish();
	    });
	});
}
else{
	test("test", function(){
		expect(1);
		ok(true, "Doesn't support");
	});
}
