module('webapp.pageswipe', {
    setup: function() {
        $('body').append('<div id="toolbar"><div><span class="switch">切换</span></div></div><div id="pageswipe"><div><p style="height: 400px;">内容部分</p></div><div style="height: 400px;">索引</div></div> ')
        //切换按钮事件
        $('.switch').click(function() {
            $('#pageswipe').pageswipe('toggle');
        });
    },
    teardown: function() {
        $('#toolbar').remove();
    }
});

test("setup, 默认参数", function() {
    expect(8);
    stop();
    ua.loadcss(["reset.css", "widget/pageswipe/pageswipe.css","../_test/widget/css/pageswipe/pageswipe_demo.css"], function() {
        var pageswipe = $('#pageswipe').pageswipe().pageswipe('this');
        
        equals(pageswipe._data.iconWidth, 55, "The data is right");
        ok(ua.isShown(pageswipe._el[0]), "The pageswipe shows");
        equals(pageswipe._el.find(".ui-pageswipe-wheel .ui-pageswipe-content").length, 1 , "The content is right");
        equals(pageswipe._el.find(".ui-pageswipe-wheel .ui-pageswipe-index").length, 1 , "The index is right");
        equals(pageswipe._el.find(".ui-pageswipe-content").width(), window.innerWidth, "The content is right");
        equals(pageswipe._el.find(".ui-pageswipe-content").height(), 400, "The content is right");
        equals(pageswipe._el.find(".ui-pageswipe-index").width(), window.innerWidth - 55, "The content is right");
        equals(pageswipe._el.find(".ui-pageswipe-index").height(), 400, "The content is right");
        pageswipe.destroy();
        start();
    });
});

test("setup, 自定义参数", function() {
    expect(8);
    var pageswipe = $('#pageswipe').pageswipe({
    	toolbar: "#toolbar",
    	iconWidth: 40
    }).pageswipe('this');
    
    equals(pageswipe._data.iconWidth, 40, "The data is right");
    ok(ua.isShown(pageswipe._el[0]), "The pageswipe shows");
    equals(pageswipe._el.find(".ui-pageswipe-wheel .ui-pageswipe-content").length, 1 , "The content is right");
    equals(pageswipe._el.find(".ui-pageswipe-wheel .ui-pageswipe-index").length, 1 , "The index is right");
    equals(pageswipe._el.find(".ui-pageswipe-content").width(), window.innerWidth, "The content is right");
    equals(pageswipe._el.find(".ui-pageswipe-content").height(), 400, "The content is right");
    equals(pageswipe._el.find(".ui-pageswipe-index").width(), window.innerWidth - 40, "The content is right");
    equals(pageswipe._el.find(".ui-pageswipe-index").height(), 400, "The content is right");
    pageswipe.destroy();
});


test("点击切换按钮", function() {
    stop();
    expect(8);
    var pageswipe = $('#pageswipe').pageswipe({
        toolbar:'#toolbar'
    }).pageswipe('this');
    ua.click($('.switch')[0]);
    setTimeout(function(){
        equals($('.ui-pageswipe-content').offset().left, -(window.innerWidth - 55),"The picture slide");
        equals($('.ui-pageswipe-index').offset().left, 55,"The picture slide");
        ua.click($('.switch')[0]);
        setTimeout(function(){
            equals($('.ui-pageswipe-content').offset().left, 0,"The picture slide");
            equals($('.ui-pageswipe-index').offset().left, window.innerWidth,"The picture slide");
            ua.click($('.switch')[0]);
            setTimeout(function(){
                equals($('.ui-pageswipe-content').offset().left, -(window.innerWidth - 55),"The picture slide");
                equals($('.ui-pageswipe-index').offset().left, 55,"The picture slide");
                ta.touchstart($('.ui-pageswipe-content')[0]);
                setTimeout(function(){
                    equals($('.ui-pageswipe-content').offset().left, 0,"The picture slide");
                    equals($('.ui-pageswipe-index').offset().left, window.innerWidth,"The picture slide");
                    pageswipe.destroy();
                    start();
                }, 550);
            }, 550);
        }, 550);
    }, 550);
});

test("full setup", function() {
    stop();
    expect(2);
    $("#pageswipe").remove();
    $("#toolbar").remove();
    $('body').append('<div id="toolbar" style="top: 0px; position: fixed;" isfixed="true"><div><span class="switch">切换</span></div></div>');
    $('body').append('<div id="pageswipe" class="ui-pageswipe" data-mode="true"><div class="ui-pageswipe-wheel"><div class="ui-pageswipe-content"><p style="height: 400px;">内容部分</p></div><div style="height: 400px; width: 1311px;" class="ui-pageswipe-index">索引</div></div></div>')
    $('.switch').click(function() {
            $('#pageswipe').pageswipe('toggle');
        });
    
    var pageswipe = $('#pageswipe').pageswipe({
        toolbar:'#toolbar'
    }).pageswipe('this');
    ua.click($('.switch')[0]);
    setTimeout(function(){
        equals($('.ui-pageswipe-content').offset().left, -(window.innerWidth - 55),"The picture slide");
        equals($('.ui-pageswipe-index').offset().left, 55,"The picture slide");
        pageswipe.destroy();
        start();
    }, 550);
});

test("show(), hide(), toggle()", function() {
    stop();
    expect(8);
    var pageswipe = $('#pageswipe').pageswipe({
        toolbar:'#toolbar',
        iconWidth: 40
    }).pageswipe('this');
    pageswipe.show();
    setTimeout(function () {
    	approximateEqual($('.ui-pageswipe-content').offset().left, -(window.innerWidth - 40),1,"The picture slide");
	    approximateEqual($('.ui-pageswipe-index').offset().left, 40,1,"The picture slide");
        pageswipe.toggle();
        setTimeout(function () {
        	equals($('.ui-pageswipe-content').offset().left, 0,"The picture slide");
            equals($('.ui-pageswipe-index').offset().left, window.innerWidth,"The picture slide");
            pageswipe.toggle();
            setTimeout(function () {
            	equals($('.ui-pageswipe-content').offset().left, -(window.innerWidth - 40),"The picture slide");
                equals($('.ui-pageswipe-index').offset().left, 40,"The picture slide");
                pageswipe.hide();
                setTimeout(function () {
                	equals($('.ui-pageswipe-content').offset().left, 0,"The picture slide");
                    equals($('.ui-pageswipe-index').offset().left, window.innerWidth,"The picture slide");
                    pageswipe.destroy();
                    start();
	            }, 500);
	        }, 500);
	    }, 500);
    }, 500);
});

test("屏幕旋转", function() {
    expect(4);
    stop();
    ua.frameExt(function(w, f){
		var me = this;
    	ua.loadcss(["reset.css", "widget/pageswipe/pageswipe.css","../_test/widget/css/pageswipe/pageswipe_demo.css"], function() {
	    	$("#toolbar, #pageswipe").remove();
	    	w.$('body').append('<div id="toolbar"><div><span class="switch">切换</span></div></div><div id="pageswipe"><div><p>内容部分</p></div><div>索引</div></div> ');
	    	
	    	var pageswipe = w.$('#pageswipe').pageswipe().pageswipe('this');
			
	    	pageswipe.show();
	        setTimeout(function () {
		        approximateEqual(w.$('.ui-pageswipe-content').offset().left, -(w.innerWidth - 55),1,"The picture slide");
		        approximateEqual(w.$('.ui-pageswipe-index').offset().left, 55,1,"The picture slide");
	
	            $(f).css("width", 150).css("height", 300);
				var e = $.support.orientation ? 'orientationchange' : 'resize';
				ta.trigger(e, w);
				
				setTimeout(function () {
					pageswipe.show();
		            setTimeout(function () {
		            	equals(w.$('.ui-pageswipe-content').offset().left, -(w.innerWidth - 55),"The picture slide");
		                equals(w.$('.ui-pageswipe-index').offset().left, 55,"The picture slide");
		                pageswipe.destroy();
		                me.finish();
		    	    }, 500);
				}, 500);
	        }, 500);
    	}, w);
    });
});

test("destroy()", function() {

    ua.destroyTest(function(w,f){
       var el1= w.dt.eventLength();
        
        $('#pageswipe').remove();
        w.$('body').append('<div id="toolbar"><div><span class="switch">切换</span></div></div><div id="pageswipe"><div><p style="height: 400px;">内容部分</p></div><div style="height: 400px;">索引</div></div> ')
        
        var pageswipe = w.$('#pageswipe').pageswipe().pageswipe('this');
        pageswipe.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(pageswipe);
       
        equal(el1,el2 - 1,"The event is ok"); //TODO:fix影响
        equals(w.$("#toolbar").length, 1, "The toolbar exists");
        equals(w.$('#pageswipe').length, 0, "The dom is ok");
        ok(ol==0,"The dialog is destroy");
        this.finish();
    })
});