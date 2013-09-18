module('plugin/widget/tabs', {
    setup: function() {
        $("body").append("<div id='container' ></div>");
        
        items1 = [
      	            {title:'tab1', content:'content1', href:'http://www.baidu.com'},
    	            {title:'tab2', content:'content2'},
    	            {title:'tab3', content:'content3'},
    	            {title:'tab4', content:'content4'}
    	        ]
        items2 = [
                      {title:'tab1', content:'content1', href:'http://www.baidu.com'},
                      {title:'tab2', content:'content2'},
                      {title:'tab3', content:'content3', href:'http://gmu.baidu.com'},
                      {title:'tab4', content:'content3', href:'http://gmu.baidu.com'}
                     ]
    },
    teardown : function() {
        $('#container').remove();
    }
});

function setup() {
    $("body").append('<div id="setup"><ul>' +
        '<li><a href="#conten1">Tab1</a></li>' +
        '<li><a href="#conten2">Tab2</a></li>' +
        '<li><a href="#conten3">Tab3</a></li>' +
        '</ul>' +
        '<div id="conten1">content1</div>' +
        '<div id="conten2"><input type="checkbox" id="input1" /><label for="input1">选中我后tabs不可切换</label></div>' +
        '<div id="conten3">content3</div>' +
        '</div>');
};

function setup1() {
    $("body").append('<div id="setup"><ul>' +
        '<li><a href="#conten1">Tab1</a></li>' +
        '<li class="ui-state-active"><a href="#conten2">Tab2</a></li>' +
        '<li><a href="#conten3">Tab3</a></li>' +
        '</ul>' +
        '<div id="conten1">content1</div>' +
        '<div id="conten2" class="ui-state-active"><input type="checkbox" id="input1" /><label for="input1">选中我后tabs不可切换</label></div>' +
        '<div id="conten3">content3</div>' +
        '</div>');
};

test("el不传", function(){
	 stop();
	 ua.loadcss(["transitions.css", "widget/tabs/tabs.css","widget/tabs/tabs.default.css"], function(){
		var tabs = gmu.Tabs({
	        items: items1
	    })
	    equals(tabs.$el.attr("class"), "ui-tabs", "The el is right");
		equals(tabs.$el.parent()[0], document.body, "The container is right");
	    tabs.destroy();
	    start();
	});
});

test("el(selector)", function(){
	$("body").append("<div id='test' ><div class='custom' ></div></div>");
	 var tabs = gmu.Tabs(".custom", {
        items: items1
    })
    equals(tabs.$el.attr("class"), "custom ui-tabs", "The el is right");
	equals(tabs.$el.parent().attr("id"), "test", "The container is right");
    tabs.destroy();
    $("#test").remove();
});

test("el(zepto) & container & 默认配置项", function(){
	 var tabs = gmu.Tabs({
        container: '#container',
        items: items1
    });

    // equals(tabs._options.items,items1,"The default items is right");
    equals(tabs._options.active,0,"The default active is right");
    equals(tabs._options.transition, 'slide', "The default transition is right");
    equals(tabs._options.activate, null,"The default activate is right");
    equals(tabs._options.beforeActivate, null,"The default beforeActivate is right");
    equals(tabs._options.animateComplete, null,"The default animateComplete is right");
	    
    equals(tabs.$el.attr("class"), "ui-tabs", "The el is right");
	equals(tabs.$el.parent().attr("id"), "container", "The container is right");
	ok(ua.isShown($('.ui-tabs-nav', tabs.$el)[0]), 'The tabs nav shows');
	ok(ua.isShown($('.ui-tabs-content', tabs.$el)[0]), 'The tabs content shows');
    equals($('.ui-tabs-nav li', tabs.$el).length, 4, 'The tabs nav number is right');
    equals($('.ui-tabs-content .ui-tabs-panel', tabs.$el).length, 4, 'The tabs pannel number is right');
    equals($('.ui-tabs-nav li', tabs.$el)[0].className,"ui-state-active","The active tab has ui-state-active");
    equals($('.ui-tabs-content .ui-tabs-panel', tabs.$el)[0].className, "ui-tabs-panel slide ui-state-active","The active tab has ui-state-active");
    tabs.destroy();
});

test("active", function(){
	 var tabs = gmu.Tabs({
       items: items1,
       active: 2
   })
   equals(tabs._options.active,2,"The default active is right");
   
   ok($('.ui-tabs-nav li', tabs.$el).eq(2).hasClass("ui-state-active"),"The active tab has ui-state-active");
   ok($('.ui-tabs-content .ui-tabs-panel', tabs.$el).eq(2).hasClass("ui-state-active"),"The active tab has ui-state-active");
   tabs.destroy();

   $('#setup').remove();
});

test("transition", function(){
	 var tabs = gmu.Tabs({
      items: items1,
      transition: ''
  })
  equals(tabs._options.transition,'',"The default active is right");
  
  ok(!$('.ui-tabs-content .ui-tabs-panel', tabs.$el).hasClass("slide"),"The active tab has slide");
  tabs.destroy();
});

test("setup & 默认配置项", function(){
	setup1();
    var tabs = $('#setup').tabs().tabs('this');
    equals(tabs._options.items.length,3,"The default items is right");
    equals(tabs._options.active,1,"The default active is right");
    equals(tabs._options.transition, 'slide', "The default transition is right");
    equals(tabs._options.activate, null,"The default activate is right");
    equals(tabs._options.beforeActivate, null,"The default beforeActivate is right");
    equals(tabs._options.animateComplete, null,"The default animateComplete is right");
	    
    equals(tabs.$el.attr("id"), "setup", "The el is right");
    equals(tabs.$el.attr("class"), "ui-tabs", "The el is right");
	equals(tabs.$el.parent()[0], document.body, "The container is right");
	ok(ua.isShown($('.ui-tabs-nav', tabs.$el)[0]), 'The tabs nav shows');
	ok(ua.isShown($('.ui-tabs-content', tabs.$el)[0]), 'The tabs content shows');
    equals($('.ui-tabs-nav li', tabs.$el).length, 3, 'The tabs nav number is right');
    equals($('.ui-tabs-content .ui-tabs-panel', tabs.$el).length, 3, 'The tabs pannel number is right');
    equals($('.ui-tabs-nav li', tabs.$el)[1].className,"ui-state-active","The active tab has ui-state-active");
    equals($('.ui-tabs-content .ui-tabs-panel', tabs.$el)[1].className, "ui-state-active ui-tabs-panel slide","The active tab has ui-state-active");
    tabs.destroy();
    $('#setup').remove();
});

test("setup & 参数active", function(){
	setup1();
    var tabs = $('#setup').tabs({
    	active:2
    }).tabs('this');
    equals(tabs._options.active,2,"The default active is right");
    
    ok($('.ui-tabs-nav li', tabs.$el).eq(2).hasClass("ui-state-active"),"The active tab has ui-state-active");
    ok($('.ui-tabs-content .ui-tabs-panel', tabs.$el).eq(2).hasClass("ui-state-active"),"The active tab has ui-state-active");
    tabs.destroy();
    $('#setup').remove();
});

test("事件测试(beforeActivate,activate,animateComplete)&交互测试&接口测试(switchTo)",function(){
    expect(28);
    stop();
    setup();
    var tabs = $('#setup').tabs({
        activate : function(e, to, from){
            ok(true, 'activate has triggered');
            equals(to.index, 1, 'to参数正确');
            equals(from.index, 0, 'from参数正确');
        },
        beforeActivate : function(e, to, from){
            ok(true, 'beforeActivate has triggered');
            equals(to.index, 1, 'to参数正确');
            equals(from.index, 0, 'from参数正确');
        },
        animateComplete : function(e, to, from){
            ok(true, 'animateComplete has triggered');
            equals(to.index, 1, 'to参数正确');
            equals(from.index, 0, 'from参数正确');
            strictEqual(tabs.$el.find('.ui-tabs-nav li').eq(0).hasClass('ui-state-active'), false, '切换后active tab index不是0');
            strictEqual(tabs.$el.find('.ui-tabs-nav li').eq(1).hasClass('ui-state-active'), true, '切换后active tab index是1');
            strictEqual(tabs.$el.find('.ui-tabs-content .ui-tabs-panel').eq(0).hasClass('ui-state-active'), false, '切换后active tab content index不是0');
            strictEqual(tabs.$el.find('.ui-tabs-content .ui-tabs-panel').eq(1).hasClass('ui-state-active'), true, '切换后active tab content index是1');
            ok(!ua.isShown(tabs.$el.find('.ui-tabs-content .ui-tabs-panel')[0]), '非active的tab隐藏');
            ok(!ua.isShown(tabs.$el.find('.ui-tabs-content .ui-tabs-panel')[2]), '非active的tab隐藏');
            ta.tap(tabs2.$el.find('.ui-tabs-nav li').get(2));
        }
    }).tabs('this');

    tabs.on( 'destroy', function(){
        tabs.$el.remove();
    } );

    var count = 0,
        tabs2 = gmu.Tabs({
        items: items2,
        active: 1,
        transition: false,
        activate : function(){
            ok(true, 'activate has triggered');
            strictEqual(tabs2.$el.find('.ui-tabs-nav li').eq(1).hasClass('ui-state-active'), false, '切换后active tab不是1');
            strictEqual(tabs2.$el.find('.ui-tabs-nav li').eq(2).hasClass('ui-state-active'), true, '切换后active tab是2');
            strictEqual(tabs2.$el.find('.ui-tabs-content .ui-tabs-panel').eq(1).hasClass('ui-state-active'), false, '切换后active tab content 不是1');
            strictEqual(tabs2.$el.find('.ui-tabs-content .ui-tabs-panel').eq(2).hasClass('ui-state-active'), true, '切换后active tab content 是2');
            ok(!ua.isShown(tabs2.$el.find('.ui-tabs-content .ui-tabs-panel')[0]), '非active的tab隐藏');
            ok(!ua.isShown(tabs2.$el.find('.ui-tabs-content .ui-tabs-panel')[1]), '非active的tab隐藏');
            ta.tap(tabs2.$el.find('.ui-tabs-nav li').get(1));
            setTimeout(function () {
                tabs.destroy();
                tabs2.destroy();
                start();
            }, 300)
        },
        beforeActivate : function(e,to,from){
            ok(true, 'beforeActivate has triggered');
            count > 0 && e.preventDefault();
            count++
        },
        animateComplete : function(){
            ok(true, 'animateComplete has not triggered');
        }
    });

    equals(tabs.$el.find('.ui-tabs-nav li').eq(0).hasClass('ui-state-active'), true, '未切换前active tab index是0');
    equals(tabs.$el.find('.ui-tabs-content .ui-tabs-panel').eq(0).hasClass('ui-state-active'), true, '未切换前active tab content index是0');
    ok(!ua.isShown(tabs.$el.find('.ui-tabs-content .ui-tabs-panel')[1]), '非active的tab隐藏');
    ok(!ua.isShown(tabs.$el.find('.ui-tabs-content .ui-tabs-panel')[2]), '非active的tab隐藏');
    tabs.switchTo(1);
});

test("屏幕旋转  & 接口(refresh)", function(){
	stop();
	ua.frameExt(function(w, f){
		var me = this;
		ua.loadcss(["transitions.css", "widget/tabs/tabs.css","widget/tabs/tabs.default.css"], function(){
			var tabs = w.gmu.Tabs({
		        items: [
		  	            {title:'tab1', content:'<p>content1 content1 content1 content1 content1 content1 content1 content1 content1 content1</p>'},
			            {title:'tab2', content:'content2'},
			            {title:'tab3', content:'content3'},
			            {title:'tab4', content:'content4'}
			        ]
		    });
			setTimeout(function(){
				equals(w.$(".ui-tabs-content", tabs.$el).height(), w.$(".ui-tabs-panel", tabs.$el).height() + 1, "The height is right");
				
				$(f).css("width", 150).css("height", 300);
                $(w).trigger('ortchange');
				setTimeout(function(){
					equals(w.$(".ui-tabs-content", tabs.$el).height(), w.$(".ui-tabs-panel", tabs.$el).height() + 1, "The height is right");
					
					me.finish();
				}, 600);
			}, 300);
		}, w);
	});
});

test("destroy",function(){
    ua.destroyTest(function(w,f){
        w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var tabs =  w.gmu.Tabs({
            items: items2
        });
        tabs.destroy();
        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(tabs);
        var dl2 =w.dt.domLength(w);
        equal(dl1,dl2,"The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el1,el2,"The event is ok");
        // ok(ol==0,"The tabs is destroy");
        this.finish();
    })
});
