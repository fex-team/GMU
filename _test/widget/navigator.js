module('plugin/widget/navigator', {
    setup:function () {
    	l = window.location.href.split("#")[0];
    	content1 = [
    	        {text:"首页fix", url:"http://www.baidu.com", pos: 'left'},
    	        {text:"首页", url:"#test1"},
	            {text:"电影", url:"#test2"},
	            {text:"电视剧", url:"http://www.baidu.com"},
	            {text:"动漫", url:"#test3"},
	            {text:"综艺", url:"javascript:;"}
	            ];
    	content2 = [
		            {text:"首页", url:"#test1"},
		            {text:"电影", url:"#test2"},
		            {text:"电视剧", url:"http://www.baidu.com"},
		            {text:"动漫", url:"#test3"},
		            {text:"综艺", url:"javascript:;"},
		            {text:"综艺", url:"javascript:;"},
		            {text:"综艺", url:"javascript:;"}
		        ];
    }
});

(function(){
	fullSetup = function(w){
		var html = '<div id="nav-fullsetup" class="ui-navigator" data-mode="true">'
			+ '<a class="ui-navigator-fix" href="http://www.baidu.com">首页fix</a>'
	        + '<ul class="ui-navigator-list" style="padding-left:5px">'
	        + '<li><a href="#test1">首页</a></li>'
 	        + '<li><a href="#test2">电影</a></li>'
            + '<li><a href="http://www.baidu.com">电视剧</a></li>'
	        + '<li><a class="cur" href="#test3">动漫</a></li>'
	        + '<li><a href="javascript:;">综艺</a></li>'
	        + '</ul>'
		var w = w || window;
		w.$("body").append(html);
	}
    smartSetup = function (w) {
        var html = '<div id="nav-smartsetup">'
            + '<a href="#test1">首页fix</a>'
            + '<ul>'
            + '<li><a href="#test1">首页</a></li>'
            + '<li><a href="#test2">电影</a></li>'
            + '<li><a class="cur"  href="http://www.baidu.com">电视剧</a></li>'
            + '<li><a href="#test3?a">动漫</a></li>'
            + '<li><a href="javascript:;">综艺</a></li>'
            + '</ul>'
        var w = w || window;
        w.$("body").append(html);
    }
})();

test("no el & create mode", function(){
    stop();
	ua.loadcss(["reset.css", "widget/navigator/navigator.css","widget/navigator/navigator.default.css"], function(){
		var nav = $.ui.navigator({
	        content: content1
	    }),_data = nav._data;
        equals(window.location.href, l, "Doesn't jump to the default tab url");

        equals(_data.container, "", "The _data is right");
        equals(_data.content, content1, "The _data is right");
        equals(_data.defTab, 0, "The _data is right");
        equals(_data._$tabList.length, 6, "The _data is right");
        equals(_data._lastIndex, 0, "The _data is right");

        ok(ua.isShown(nav._el[0]), "The navigator shows");
        equals(nav._el.attr("class"), "ui-navigator", "The class is right");
        equals(nav._el.parent().attr("tagName").toLowerCase(), "body", "The container is right");
        equals(nav._el.width(), $("body").width(), "The width is right");
        equals(nav._el.children()[0].tagName.toLowerCase(), "a", "The fix tab is right");
        equals(nav._el.children()[0].href, 'http://www.baidu.com/', "The fix tab is right");
        equals(nav._el.children()[0].className, "ui-navigator-fix ui-navigator-fixleft cur", "The fix tab is right");
        equals(nav._el.children()[0].textContent, "首页fix", "The fix tab is right");
        equals(nav._el.find('ul li a').length, 5, "The li number is right");
        equals(nav._el.find('ul li a').get(0).textContent, "首页", "The a is right");
        equals(nav._el.find('ul li a').get(0).href.split('#')[1], 'test1', "The a is right");
        nav.destroy();
        start();
	});
});

test("el zepto & container & create mode", function(){
	var container = document.createElement("div");
	$(container).attr("id", "container");
	document.body.appendChild(container);

	var nav = $.ui.navigator($("<div class = 'ui-navigator my'></div>"), {
		container: "#container",
        content: content1
    });
	equals(window.location.href, l, "Doesn't jump to the default tab url");  //defTab上带锚点，默认选中时不跳转

	ok(ua.isShown(nav._el[0]), "The navigator shows");
	equals(nav._el.attr("class"), "ui-navigator my", "The class is right");
	equals(nav._el.parent().attr("id"), "container", "The container is right");

	equals(nav._el.width(), $("body").width(), "The width is right");
	
	nav.destroy();
	$("#container").remove();
});

test("el selector & no container & className & create mode", function(){
	var test1 = document.createElement("div");
	$(test1).attr("id", "test1");
	document.body.appendChild(test1);
	var test2 = document.createElement("div");
	$(test2).attr("class", "ui-navigator");
	test1.appendChild(test2);

	var nav = $.ui.navigator(".ui-navigator", {
        content: content1
    });

	ok(ua.isShown(nav._el[0]), "The navigator shows");
	equals(nav._el.attr("class"), "ui-navigator", "The class is right");
	equals(nav._el.parent().attr("id"), "test1", "The container is right");

	equals(nav._el.width(), $("body").width(), "The width is right");
	
	nav.destroy();
	$("#test1").remove();
});

test("full setup", function(){
    fullSetup();
    var nav = $("#nav-fullsetup").navigator('this'),
        _data = nav._data,
        _el = nav._el;

    equals(_data.container, "", "The _data is right");       //保存的数据正确
    equals(_data.defTab, 4, "The _data is right");
    equals(_data._$tabList.length, 6, "The _data is right");
    equals(_data._lastIndex, 4, "The _data is right");
    equals(_data.setup, true, "The _data is right");

    ok(ua.isShown(nav._el[0]), "The navigator shows");        //显示正确
    equals(_el.attr("class"), "ui-navigator", "The class is right");
    equals(_el.parent().attr("tagName").toLowerCase(), "body", "The container is right");
    equals(_el.width(), $("body").width(), "The width is right");
    equals(_el.children()[0].tagName.toLowerCase(), "a", "The fix tab is right");
    equals(_el.children()[0].href, 'http://www.baidu.com/', "The fix tab is right");
    equals(_el.children()[0].className, "ui-navigator-fix", "The fix tab is right");
    equals(_el.children()[0].textContent, "首页fix", "The fix tab is right");
    equals(_el.find('ul li a').length, 5, "The li number is right");
    equals(_el.find('ul li a').get(0).textContent, "首页", "The a is right");
    equals(_el.find('ul li a').get(0).href, l + '#test1', "The a is right");
    
    equals(_el.find('ul li a').get(3).className, "cur", "The defTab is right");
    nav.destroy();
    $("#nav-fullsetup").remove();
});

test("smart setup", function(){
    smartSetup();
    var nav = $("#nav-smartsetup").navigator({
        tabselect: function (e) {
            ok(true, "The tabselect shows");
        }
    }).navigator('this');
    var _data = nav._data;

    equals(_data.container, "", "The _data is right");       //保存的数据正确
    equals(_data.defTab, 3, "The _data is right");
    equals(_data._$tabList.length, 6, "The _data is right");
    equals(_data._lastIndex, 3, "The _data is right");
    equals(_data.setup, true, "The _data is right");

    ok(ua.isShown(nav._el[0]), "The navigator shows");
    equals(nav._el.attr("class"), "ui-navigator", "The class is right");
    equals(nav._el.parent().attr("tagName").toLowerCase(), "body", "The container is right");
    equals(nav._el.width(), $("body").width(), "The width is right");
    equals(nav._el.children()[0].tagName.toLowerCase(), "a", "The fix tab is right");
    equals(nav._el.children()[0].href, l + '#test1', "The fix tab is right");
    equals(nav._el.children()[0].className, "ui-navigator-fix", "The fix tab is right");
    equals(nav._el.children()[0].textContent, "首页fix", "The fix tab is right");
    equals(nav._el.find('ul li a').length, 5, "The tab elem number is right");
    equals(nav._el.find('ul li a').eq(2).hasClass('cur'), true, "The defTab is right");
    nav.destroy();
    $("#nav-fullsetup").remove();
});

test("defTab in three mode & 多实例", function(){
	var nav = $.ui.navigator({
        content: content1,
        defTab: 2
    });
	equals(window.location.href, l, "Create mode doesn't jump to the default tab url"); //defTab上带链接，默认选中时不跳转

	equals(nav._data.defTab, 2, "Create mode the _data is right");
	equals(nav._data._lastIndex, 2, "Create mode  the _data is right");

	ok(ua.isShown(nav._el[0]), "Create mode the navigator shows");
	equals(nav._el.attr("class"), "ui-navigator", "Create mode  the class is right");
	equals(nav._el.parent().attr("tagName").toLowerCase(), "body", "Create mode the container is right");
	equals(nav._data._$tabList.get(2).className, "cur", "Create mode the selection of defTab is right");
	nav.destroy();

    fullSetup();
    var nav = $("#nav-fullsetup").navigator({
        defTab: 2
    }).navigator("this");

    equals(nav._data.defTab, 2, "Fullsetup mode, the _data is right");
    equals(nav._data._lastIndex, 2, "Fullsetup mode, the _data is right");

    ok(ua.isShown(nav._el[0]), "Fullsetup mode, the navigator shows");
    equals(nav._el.attr("class"), "ui-navigator", "Fullsetup mode the class is right");
    equals(nav._el.parent().attr("tagName").toLowerCase(), "body", "Fullsetup mode, the container is right");
    equals(nav._data._$tabList.get(2).className, "cur", "Fullsetup mode, the selection of defTab is right");
    equals(nav._data._$tabList.get(4).className, "", "Create mode the selection of defTab is right");
    equals(nav._el.find('ul li a').length, 5, "Fullsetup mode, the tab number is right");
    nav.destroy();
    $('#nav-fullsetup').remove();

    smartSetup();
    var nav = $("#nav-smartsetup").navigator({
        defTab: 0
    }).navigator("this");

    equals(nav._data.defTab, 3, "Smartsetup mode, the _data is right");
    equals(nav._data._lastIndex, 3, "Smartsetup mode, the _data is right");

    ok(ua.isShown(nav._el[0]), "Smartsetup mode, the navigator shows");
    equals(nav._el.attr("class"), "ui-navigator", "Smartsetup mode the class is right");
    equals(nav._el.parent().attr("tagName").toLowerCase(), "body", "Smartsetup mode, the container is right");
    equals(nav._data._$tabList.eq(3).hasClass('cur'), true, "Smartsetup mode, the selection of defTab is right");
    equals(nav._el.find('ul li a').length, 5, "Smartsetup mode, the tab number is right");
    nav.destroy();
    $('#nav-smartsetup').remove();
});

test("select tab & switchTo() & ontabselect & getCurTab()", function(){ //switchTo() 在select tab过程中被调用
	expect(31);
    stop();
	var nav = $.ui.navigator({
        content: content2,
        tabselect: function(e,$elem, index){
        	ok(true, "The tabselect is triggered");   //应该触发6次，点击当前tab，也会触发tabselect
        }
    });
	var a = nav._el.find('ul li a');

	ua.click(a[0]);
    equals(nav._data._lastIndex, 0, "The lastIndex is right");
    equals(a[0].className, "cur", "The defTab is right");
    equals(window.location.href, l, "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 0, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "首页", "The getCurTab() is right");

	ua.click(a[1]);
	equals(nav._data._lastIndex, 1, "The lastIndex is right");
	equals(a[1].className, "cur", "The tab select is right");
	equals(window.location.href, l + "#test2", "Doesn't jump to the cur tab url");
	equals(nav.getCurTab().index, 1, "The getCurTab() is right");
	equals(nav.getCurTab().info.text, "电影", "The getCurTab() is right");

    ua.click(a[1]);      //点击同一个tab
    equals(nav._data._lastIndex, 1, "The lastIndex is right");
    equals(a[1].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test2", "Doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 1, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "电影", "The getCurTab() is right");

    ua.click(a[3]);
    equals(nav._data._lastIndex, 3, "The lastIndex is right");
    equals(a[1].className, "", "The tab select is right");
    equals(a[3].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test3", "Doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 3, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "动漫", "The getCurTab() is right");

    ua.click(a[6]);      //点击最后一个
    equals(nav._data._lastIndex, 6, "The lastIndex is right");
    equals(a[3].className, "", "The tab select is right");
    equals(a[6].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test3", "Doesn't jump to the cur tab url");   //javacript:;空链接
    equals(nav.getCurTab().index, 6, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "综艺", "The getCurTab() is right");

    start();
	nav.destroy();
});

test("select tab & switchTo() & getCurTab() & setup mode & fixTab", function(){ //switchTo() 在select tab过程中被调用
    expect(30);
    smartSetup();
    var nav = $('#nav-smartsetup').navigator({
        defTab: 1
    }).navigator('this');

    var a = nav._el.find('ul li a');
    var b = nav._el.find('.ui-navigator-fix');

    equals(window.location.href, l + "#test3", "DefTab doesn't jump to the cur tab url");

    ua.click(a[0]);      //点击同一个tab
    equals(nav._data._lastIndex, 1, "The lastIndex is right");
    equals(a[0].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test3", "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 1, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "首页", "The getCurTab() is right");

    ua.click(a[3]);
    equals(nav._data._lastIndex, 4, "The lastIndex is right");
    equals(a[1].className, "", "The tab select is right");
    equals(a[3].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test3?a", "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 4, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "动漫", "The getCurTab() is right");

    ua.click(a[4]);      //点击最后一个
    equals(nav._data._lastIndex, 5, "The lastIndex is right");
    equals(a[2].className, "", "The tab select is right");
    equals(a[4].className, "cur", "The tab select is right");
    equals(window.location.href, l + "#test3?a", "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 5 , "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "综艺", "The getCurTab() is right");

    ua.click(b[0]);      //点击fix tab
    equals(nav._data._lastIndex, 0, "The lastIndex is right");
    equals(a[4].className, "", "The defTab is right");
    equals(b.eq(0).hasClass('cur'), true, "The tab select is right");
    equals(window.location.href, l + "#test1", "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 0, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "首页fix", "The getCurTab() is right");

    ua.click(b[0]);      //点击同一个fix tab
    equals(nav._data._lastIndex, 0, "The lastIndex is right");
    equals(a[4].className, "", "The defTab is right");
    equals(b.eq(0).hasClass('cur'), true, "The tab select is right");
    equals(window.location.href, l + "#test1", "DefTab doesn't jump to the cur tab url");
    equals(nav.getCurTab().index, 0, "The getCurTab() is right");
    equals(nav.getCurTab().info.text, "首页fix", "The getCurTab() is right");

    nav.destroy();
    $('#nav-smartsetup').remove();
});

test("destroy",function(){
    ua.destroyTest(function(w,f){
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var nav = w.$.ui.navigator({
            content:content1
        });
        nav.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(nav);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The dialog is destroy");
        this.finish();
    })
});