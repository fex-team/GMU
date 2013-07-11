module('plugin/widget/panel', {
    setup: function() {
        $("<div id='page' ></div>").appendTo('body');
        $('<div id="panel"></div>').append(
            '<ul>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '</ul>'
        ).appendTo('#page');
        $('<div id="contWrap" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page');
        $('body').css('overflow-x', 'hidden');
    },
    teardown : function() {
        $('#page').remove();
    }
});

test("多实例 & 默认options & 自定义options", function(){
	 stop();
	 ua.loadcss(["widget/panel/panel.css","widget/panel/panel.default.css"], function(){
		 $("<div id='page2' ></div>").appendTo('body');
		    $('<div id="contWrap2" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page2');
		    $('<div id="panel2"></div>').append(
		        '<ul>' +
		            '<li>目录目录目录</li>' +
		            '<li>目录目录目录</li>' +
		            '<li>目录目录目录</li>' +
		            '<li>目录目录目录</li>' +
		            '<li>目录目录目录</li>' +
		            '<li>目录目录目录</li>' +
		            '</ul>'
		    ).appendTo('#page2');

		    var panel1 = $('#panel').panel('this');
		    var panel2 = $('#panel2').panel({
		        contentWrap: '#contWrap2',
		        position: 'left',
		        display: 'overlay',
		        scrollMode: 'hide',
		        dismissible: false,
		        swipeClose: false
		    }).panel('this');

		    equal($('.ui-panel').length, 2, "两个panel创建了");
		    equal($('.ui-panel-right').length, 1, "默认右边打开的panel创建成功");
		    equal($('.ui-panel-left').length, 1, "position:left的panel创建成功")
		    
		    equals(panel1.$contentWrap.attr('id'), "contWrap", "option contentWrap 正确");
			equals(panel1.$contentWrap.parent().attr("id"), "page", "option contentWrap 正确");
			equals(panel1._options.scrollMode, "follow", "option scrollMode 正确");
			equals(panel1._options.display, "push", "option display 正确");
			equals(panel1._options.position, "right", "option position 正确");
			equals(panel1._options.dismissible, true, "option dismissible 正确");
			equals(panel1._options.swipeClose, true, "option swipeClose 正确");     
		         
			equal(panel2.$contentWrap.attr('id'), "contWrap2", "panel2 contentWrap 正确");
			equal(panel2.$contentWrap.parent().attr("id"), "page2", "panel2 contentWrap 正确");
		    equal(panel2._options.dismissible, false, 'panel2 dismissible正确');
		    equal(panel2._options.swipeClose, false, 'panel2 swipeClose正确');
		    equal(panel2._options.scrollMode, "hide", "panel2 scrollMode 正确");
		    equal(panel2._options.display, 'overlay', 'panel2 display正确');
		    equal(panel2._options.position, 'left', 'panel2 position正确');
		    $('#panel').panel('destroy');
		    $('#panel2').panel('destroy');
		    $('#page2').remove();
		    start();
	});
});

test("参数: contentWrap(zepto)", function(){
	$('<div id="contWrap1" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo("body");
    var panel = $('#panel').panel({
    	contentWrap: $("#contWrap1")
    }).panel('this');
 
    equals(panel.$contentWrap.attr('id'), "contWrap1", "option contentWrap 正确");
	equals(panel.$contentWrap.parent()[0], document.body, "option contentWrap 正确");
    $('#panel').panel('destroy');
    $("#contWrap1").remove();
});

test("参数: display(默认) & position(默认)", function(){
    var panel = $('#panel').panel({
    }).panel('this');

    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-right'), true, "open后：ui-panel-right值正确");
    equal($('#panel').hasClass('ui-panel-push'), true, "open后：ui-panel-push值正确");
    equal($('#panel').hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("参数: display(默认) & position(left)", function(){
    var panel = $('#panel').panel({
    	animate: false,
    	position: 'left'
    }).panel('this');

    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-left'), true, "open后：ui-panel-left值正确");
    equal($('#panel').hasClass('ui-panel-push'), true, "open后：ui-panel-push值正确");
    equal($('#panel').hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("参数: display(overlay) & position(默认)", function(){
    var panel = $('#panel').panel({
    	display: 'overlay'
    }).panel('this');
    
    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-right'), true, "open后：ui-panel-right值正确");
    equal($('#panel').hasClass('ui-panel-overlay'), true, "open后：ui-panel-overlay值正确");
    equal($('#panel').hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确"); 
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("参数: display(overlay) & position(left)", function(){
    var panel = $('#panel').panel({
    	display: 'overlay',
    	position: 'left'
    }).panel('this');
    
    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-left'), true, "open后：ui-panel-left值正确");
    equal($('#panel').hasClass('ui-panel-overlay'), true, "open后：ui-panel-overlay值正确");
    equal($('#panel').hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确"); 
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("参数: display(reveal) & position(默认)", function(){
    var panel = $('#panel').panel({
    	display: 'reveal'
    }).panel('this');
    
    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-right'), true, "open后：ui-panel-right值正确");
    equal($('#panel').hasClass('ui-panel-reveal'), true, "open后：ui-panel-reveal值正确");
    equal($('#panel').hasClass('ui-panel-animate'), false, "open后：ui-panel-animate值正确"); //reveal模式不需要给panel加animate
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("参数: display(reveal) & position(left)", function(){
    var panel = $('#panel').panel({
    	display: 'reveal',
    	position: 'left'
    }).panel('this');

    $('#panel').panel('open');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-left'), true, "open后：ui-panel-left值正确");
    equal($('#panel').hasClass('ui-panel-reveal'), true, "open后：ui-panel-reveal值正确");
    equal($('#panel').hasClass('ui-panel-animate'), false, "open后：ui-panel-animate值正确");//reveal模式不需要给panel加animate
    equal(panel.$contentWrap.hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "open后：transform值正确");
    
    $('#panel').panel('close');
    
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "transform值正确");
    
    $('#panel').panel('destroy');
});

test("接口: open, close, toggle, state", function(){
    var panel = $('#panel').panel({
    }).panel('this');

    $('#panel').panel('open', 'reveal');
    var width1 = $('#panel').width();
    
    equal($('#panel').hasClass('ui-panel-right'), true, "open后：ui-panel-right值正确");
    equal($('#panel').hasClass('ui-panel-reveal'), true, "open后：ui-panel-push值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "open后：transform值正确");
    equal($('#panel').panel('state'), true, "open后：state方法正确");

    $('#panel').panel('close');
    equal($('#panel').hasClass('ui-panel-right'), true, "close后：ui-panel-right值正确");
    equal($('#panel').hasClass('ui-panel-reveal'), true, "close后：ui-panel-push值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "close后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "close后：transform值正确");
    equal($('#panel').panel('state'), false, "open后：state方法正确");

    $('#panel').panel('toggle','overlay', 'left');
    equal($('#panel').hasClass('ui-panel-left'), true, "(overlay,left)toggle后：ui-panel-left值正确");
    equal($('#panel').hasClass('ui-panel-overlay'), true, "(overlay,left)toggle后：ui-panel-overlay值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "(overlay,left)toggle后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "(overlay,left)toggle后：transform值正确");
    equal($('#panel').panel('state'), true, "open后：state方法正确");

    $('#panel').panel('toggle');
    equal($('#panel').hasClass('ui-panel-left'), true, "toggle后：ui-panel-left值正确");
    equal($('#panel').hasClass('ui-panel-overlay'), true, "toggle后：ui-panel-overlay值正确");
    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "toggle后：transform值正确");
    equal(panel.$contentWrap.css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "toggle后：transform值正确");
    equal($('#panel').panel('state'), false, "open后：state方法正确");

    $('#panel').panel('destroy');
});

test("事件: beforeopen, open, beforeclose, close", function(){
    expect(6);
    stop();

    $('#panel').on('beforeopen open beforeclose close', function (e) {
        switch(e.type) {
            case 'beforeopen':
                ok(true, 'beforeopen trigger');
                break;
            case 'open':
                ok(true, 'open trigger');
                break;
            case 'beforeclose':
                ok(true, 'beforeclose trigger');
                break;
            case 'close':
                ok(true, 'close trigger');
                break;
        }
    }).panel();;

    $('#panel').panel('open', 'reveal', 'left');
    setTimeout(function(){
    	$('#panel').panel('close');
        setTimeout(function(){
        	$('#panel').panel('open', 'overlay', 'right');
            setTimeout(function(){
            	$('#panel').panel('destroy');  
            	start();
            }, 600);  
        }, 600);
    }, 800);
});

test("基本操作：点击页面非panel位置，panel关闭（dismissible）", function(){
    stop();
    $('#panel').panel({
        contentWrap: '#contWrap'
    });
    var $btn = $('<button id="btn"></button> ').appendTo('#contWrap').on('click', function () {
            $('#panel').panel('toggle');
        });

    equal($('.ui-panel-dismiss').length, 1, "dismiss mask存在");
    ua.click($btn[0]);
    var width1 = $('#panel').width();

    setTimeout(function () {
        equal($('#panel').panel('state'), true, '点击不在panel中的按钮后，panel打开');
        equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "点击不在panel中的按钮后，panel移动距离正确");

        ua.click($('.ui-panel-dismiss')[0]);
        setTimeout(function () {
            equal($('#panel').panel('state'), false, '点击dismiss mask后，panel正常关闭');
            equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "点击dismiss mask后，panel关闭后移动距离正确");
            $('#panel').panel('destroy');
            start();
        }, 400);
    }, 400);
});

test("基本操作：panel上面左/右滑动可正常关闭panel（swipeClose）", function(){
    stop();
    $('#panel').panel({
        contentWrap: '#contWrap'
    });
    
    $('#panel').panel('open', 'overlay', 'left');
    var width1 = $('#panel').width();
    
    setTimeout(function () {
        equal($('#panel').panel('state'), true, 'panel已经打开');
        equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "panel已经打开");

        ta.swipeLeft($('#panel')[0]);

        setTimeout(function () {
            equal($('#panel').panel('state'), false, '向左滑动后panel关闭');
            equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "向左滑动后panel关闭");
            $('#panel').panel('destroy');
            start();
        }, 400);
    }, 400);
});

test("基本操作：页面滚动过程的，panel的三种模式正常（scrollMode）", function(){
    stop();
    $("<div id='page2' ></div>").appendTo('body');
    $('<div id="contWrap2" style="height:1500px; width: 100%;">这是panel相对的内容</div>').appendTo('#page2');
    $('<div id="panel2"></div>').append(
        '<ul>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '</ul>'
    ).appendTo('#page2');

    $("<div id='page3' ></div>").appendTo('body');
    if(window.parent === window){
        $('<div id="contWrap3" style="height:1500px; width: 100%;">这是panel相对的内容</div>').appendTo('#page3');
    }else{
        $('<div id="contWrap3" style="height:15000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page3');
    }
    $('<div id="panel3"></div>').append(
        '<ul>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '</ul>'
    ).appendTo('#page3');

    $('#panel').panel({
        contentWrap: '#contWrap',
        animate: false
    }).panel('open');

    setTimeout(function () {
        window.scrollTo(0, 100);

        setTimeout(function () {
            equal($('#panel').panel('state'), true, 'follow模式：滚动过程中panel未消失');
            equal($('#panel').offset().top, 0, 'follow模式，panel跟随滚动');
            $('#panel').panel('destroy');
            $('#page').remove();

            $('#panel2').panel({
                contentWrap: '#contWrap2',
                scrollMode: 'hide'
            }).panel('open', 'reveal', 'left');

            setTimeout(function () {
                window.scrollTo(0, 200);

                setTimeout(function () {
                    equal($('#panel2').panel('state'), false, 'hide模式：滚动过程中panel隐藏');
                    equal($("#contWrap2").css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "hide模式：滚动过程中panel隐藏");
                    $('#panel2').panel('destroy');
                    $('#page2').remove();

                    $('#panel3').panel({
                        contentWrap: '#contWrap3',
                        scrollMode: 'fix'
                    }).panel('open', 'overlay', 'right');

                    setTimeout(function () {
                        window.scrollTo(0, 300);
                        ta.scrollStop(document);

                        setTimeout(function () {
                            equal($('#panel3').panel('state'), true, 'fix模式：滚动过程中panel未隐藏');
                            equal($('#panel3').css('position'), 'absolute', 'fix模式：滚动过程中panel是fix的');
                            // approximateEqual($('#panel3').offset().top, 300, 'fix模式，panel不跟随滚动');
                            // iOS 6横屏时，window.scrollTo(0, 300)实际上没滚动到300像素，改用document.body.scrollTop判断
                            equal($('#panel3').offset().top, document.body.scrollTop, 'fix模式，panel不跟随滚动');
                            $('#panel3').panel('destroy');
                            window.scrollTo(0, 0);
                            $('#page3').remove();
                            start();
                        }, 1000);
                    }, 400);
                }, 200);
            }, 400);
        }, 200);
    }, 400);
});

test("window resize", function(){
    expect(6);
    stop();
    $("#page").remove();
    ua.frameExt(function(w, f){
    	var me = this;
    	ua.loadcss(["reset.css", "widget/panel/panel.css", "widget/panel/panel.default.css"], function(){
    		$(f).css("background-color","red")
			w.$('body').append("<div id='page' ></div>");
			w.$('#page').append('<div id="panel""></div>');
			w.$('#panel').append(
			'<ul>' +
			    '<li>目录目录目录</li>' +
			    '<li>目录目录目录</li>' +
			    '<li>目录目录目录</li>' +
			    '<li>目录目录目录</li>' +
			    '<li>目录目录目录</li>' +
			    '<li>目录目录目录</li>' +
			    '</ul>'
			);
			w.$('#page').append('<div id="contWrap" style="height:1000px; width: 100%;">这是panel相对的内容</div>');
			w.$('body').css('overflow-x', 'hidden');
	
			w.$('#panel').panel().panel('open');
			w.$('#panel').panel('this')._options['scrollMode'] = 'fix';
			
	        setTimeout(function(){
	        	var width1 = w.$('#panel').width();
				equals(w.$(".ui-panel-dismiss").width(), 300 - width1, "The mask width is right");
				equals(w.$(".ui-panel-dismiss").height(), 150, "The mask height is right");
				equals(w.$('#panel').offset().top, 0, "The panel top is right");
	
				w.scrollTo(0, 100);
	        	$(f).css("height", 300).css("width", 600);
	        	w.$("body").css("height", 300).css("width", 600);
	             
	            setTimeout(function(){
                    // 实际情况是mask尺寸不会变，原来的用例有问题
                    equals(w.$(".ui-panel-dismiss").width(), 300 - width1, "The mask width is right");
                    // equals(w.$(".ui-panel-dismiss").width(), 600 - width1, "The mask width is right");
                    equals(w.$(".ui-panel-dismiss").height(), 300, "The mask height is right");
                    approximateEqual(w.$('#panel').offset().top, 100, "The panel top is right");

	            	
	                w.$("#panel").panel('destroy');
	                setTimeout(me.finish, 300);
	            }, 800);
	        }, 500);
    	}, w);
    })
});

test("destroy", function(){
    ua.destroyTest(function(w,f){
    	w.$("body").append("<div id='page' ></div>");
    	w.$('#page').append('<div id="panel"></div>');
        w.$("#panel").append(
            '<ul>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '</ul>'
        );
        w.$('#page').append('<div id="contWrap" style="height:1000px; width: 100%;">这是panel相对的内容</div>');
        w.$('body').css('overflow-x', 'hidden');
        
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var panel = w.$('#panel').panel().panel("this");
        
        panel.open();
        
        panel.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(w.$(".panel").length, 0, "The dom is ok");
        equal(el1,el2,"The event is ok");
        this.finish();
    });
});