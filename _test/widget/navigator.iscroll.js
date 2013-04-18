module('widget/navigator.iscroll', {
    setup:function () {
    	l = window.location.href.split("#")[0];
    	content = [
    	        {text:"fix left", url:"#test1", pos: 'left'},
    	        {text:"首页", url:"#test2"},
	            {text:"电影", url:"#test3"},
	            {text:"电视剧", url:"http://www.baidu.com"},
	            {text:"动漫", url:"#test4"},
	            {text:"综艺", url:"http://www.baidu.com"},
                {text:"fix right", url:"javascript:;", pos: 'right'}
	        ];

        fullSetup = function(w){
            var html = '<div id="nav-fullsetup" class="ui-navigator" data-mode="true">'
                + '<div class="ui-navigator-wrapper">'
                + '<ul class="ui-navigator-list" style="padding-left:5px">'
                + '<li><a href="#test1">首页</a></li>'
                + '<li><a href="#test2">电影</a></li>'
                + '<li><a href="http://www.baidu.com">电视剧</a></li>'
                + '<li><a class="cur" href="#test3">动漫</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '</ul>'
                + '</div>'
            var w = w || window;
            w.$("body").append(html);
        };

        smartSetup = function (w) {
            var html = '<div id="nav-smartsetup">'
                + '<a class="ui-navigator-fixleft" href="#test1">fix left1</a>'
                + '<a class="ui-navigator-fixleft" href="#test1">fix left2</a>'
                + '<ul>'
                + '<li><a href="#test1">首页</a></li>'
                + '<li><a href="#test2">电影</a></li>'
                + '<li><a href="http://www.baidu.com">电视剧</a></li>'
                + '<li><a class="cur" href="#test3">动漫</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '<li><a href="javascript:;">综艺</a></li>'
                + '</ul>'
            var w = w || window;
            w.$("body").append(html);
        };

        shadowTest = function (id) {
            var html = '<div id="nav-shadowTest' + (id || '') + '">'
                + '<a class="ui-navigator-fixleft" href="javascript:;">fix left1</a>'
                + '<a class="ui-navigator-fixleft" href="javascript:;">fix left2</a>'
                + '<ul>'
                + '<li><a href="javascript:;">首页</a></li>'
                + '<li><a href="javascript:;">首页1</a></li>'
                + '<li><a href="#test1">首页111</a></li>'
                + '<li><a href="#test1">首页首页</a></li>'
                + '<li><a href="#test2">电影2</a></li>'
                + '<li><a href="#test2">电影首</a></li>'
                + '<li><a href="#test2">电影测</a></li>'
                + '<li><a href="#test2">电影测1</a></li>'
                + '<li><a href="#test2">电影测2</a></li>'
                + '<li><a href="#test2">电影测111</a></li>'
                + '<li><a href="#test2">电影测222</a></li>'
                + '<li><a href="#test2">电影测11111</a></li>'
                + '<li><a href="#test2">电影测测</a></li>'
                + '<li><a href="#test2">电影测</a></li>'
                + '<li><a href="#test2">电影</a></li>'
                + '<li><a href="#test2">电影</a></li>'
                + '<li><a href="http://www.baidu.com">电视剧</a></li>'
                + '<li><a href="#test3">动漫</a></li>'
                + '<li><a href="javascript:;">综艺测试测试</a></li>'
                + '<li><a href="javascript:;">综艺1</a></li>'
                + '<li><a href="javascript:;">综艺测试</a></li>'
                + '<li><a href="javascript:;">综艺测</a></li>'
                + '<li><a href="javascript:;">综艺测试</a></li>'
                + '</ul>'
                + '<a class="ui-navigator-fixright" href="#test1">fix right1</a>'
            var w = w || window;
            w.$("body").append(html);
        };
    }
});

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

test("只为加载css用",function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css", "widget/navigator/navigator.css", "widget/navigator/navigator.default.css", "widget/navigator/navigator.iscroll.css", "widget/navigator/navigator.iscroll.default.css"], function(){
        ok(true, '样式加载进来了！');
        start();
    });
});

test("create html: create or setup fix and scroll navigator", function(){
    stop();
    var nav = $.ui.navigator({
        content: content
    });
    var list = nav._el.find(".ui-navigator-list");
    var li = nav._el.find("li");
    equals(nav._data.container, "", "The container is right");
    equals(nav._data.defTab, 0, "The defTab is right");
    equals(nav._data._$tabList.length, 7, "The _$tabList is right");
    equals(nav._data._lastIndex, 0, "The _lastIndex is right");
    equals(nav._data._$navScroller.attr("class"), "ui-navigator-list", "The _data is right");
    equals(nav._data._$navWrapper.hasClass("ui-navigator-wrapper"), true, "The _data is right");
    equals(nav._data._$navWrapper.hasClass("ui-navigator-shadowr"), list.offset().right > $(window).width ? true : false, "The _data is right");
    equals(nav._data._$navList.length, 5, "The _data is right");
    equals(nav._data._scrollerNum, 5, "The _data is right");
    equals(nav._data._scrollerSumWidth[0], tablet?68:62, "The _data is right");

    ok(ua.isShown(nav._el[0]), "The navigator shows");
    equals(nav._el.attr("class"), "ui-navigator", "The class is right");
    equals($('.ui-navigator-list').parent().hasClass('ui-navigator-wrapper'), true, 'The wrapper is exsited');
    equals($('.ui-navigator-wrapper').css('overflow'), 'hidden', 'The wrapper style is right');
    equals($('.ui-navigator-wrapper').prev().hasClass('ui-navigator-fix'), true, 'The fix left is right');
    equals($('.ui-navigator-wrapper').next().hasClass('ui-navigator-fix'), true, 'The fix right is right');
    equals($('.ui-navigator-list').find('a').length, 5, 'The scroller number is right');
    equals($('.ui-navigator-list').css('-webkit-transition'), '-webkit-transform 0ms', 'The scroller style is right');
    equals(li.width(), tablet ? 68 : 62, "The li widht is right");
    equals(list.width(), tablet ? 359 : 326, "The list widht is right");
    nav.destroy();

    smartSetup();
    var nav2 = $('#nav-smartsetup').navigator({
        defTab: 3
    }).navigator('this');

    var list = nav2._el.find(".ui-navigator-list");
    var li = nav2._el.find("li");
    equals(nav2._data.container, "", "The container is right");
    equals(nav2._data.defTab, 3, "The defTab is right");
    equals(nav2._data._$tabList.length, 11, "The _$tabList is right");
    equals(nav2._data._lastIndex, 3, "The _lastIndex is right");
    equals(nav2._data._$navScroller.attr("class"), "ui-navigator-list", "The _data is right");
    equals(nav2._data._$navWrapper.hasClass("ui-navigator-wrapper"), true, "The _data is right");
    equals(nav2._data._$navList.length, 9, "The _data is right");
    equals(nav2._data._scrollerNum, 9, "The _data is right");
    equals(nav2._data._scrollerSumWidth[0], tablet ? 68 : 62, "The _data is right");

    ok(ua.isShown(nav2._el[0]), "The navigator shows");
    equals(nav2._el.attr("class"), "ui-navigator", "The class is right");
    equals($('.ui-navigator-list').parent().hasClass('ui-navigator-wrapper'), true, 'The wrapper is exsited');
    equals($('.ui-navigator-wrapper').css('overflow'), 'hidden', 'The wrapper style is right');
    equals($('.ui-navigator-wrapper').prev().hasClass('ui-navigator-fix'), true, 'The fix left is right');
    equals($('.ui-navigator-wrapper').prev().prev().hasClass('ui-navigator-fix'), true, 'The fix left2 is right');
    equals($('.ui-navigator-list').find('a').length, nav2._data._scrollerNum, 'The scroller number is right');
    equals($('.ui-navigator-list').css('-webkit-transition'), '-webkit-transform 0ms', 'The scroller number is right');
    equals(li.width(), tablet ? 68 : 62, "The li widht is right");
    equals(list.width(), tablet ? 631 : 574, "The list widht is right");
    nav2.destroy();

    start();
});

test("Event: tabselect & scrollstart & scrollmove & scrollend", function(){
    stop();
    expect(5)
    fullSetup();
    var count = 0, time = 0.
        nav = $('#nav-fullsetup').navigator({
            defTab: 0,
            tabselect: function (index) {
                ok(true, "The tabselect trigger");
            },
            scrollstart: function () {
                ok(true, 'The scrollstart trigger');
            },
            scrollmove: function () {
                !count && ok(true, 'The scrollmove trigger');
                count++;
            },
            scrollend: function () {     //deftab not trigger scrollend
                ok(true, 'The scrollend trigger');
                setTimeout(function () {
                	time ++;
                    if(time == 2){    //init时触发一次scrollEnd
                    	nav.destroy();
                        $('#nav-fullsetup').remove();
                        start();
                    }
                }, 300);
            }
        }).navigator('this'),
        scroller = $(".ui-navigator-list")[0];

    ta.touchstart(scroller,{
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(scroller,{
        touches:[{
            pageX: 20,
            pageY: 0
        }]
    });
    ta.touchend(scroller);

    //PC上
    ua.mousedown(scroller, {
        clientX: 0,
        clientY: 0
    });
    ua.mousemove(scroller, {
        clientX: 20,
        clientY: 0
    });
    ua.mouseup(scroller);
});

test("setShadow: shadowleft & shadowright & shadowall", function(){
    expect(4);
    stop();
    shadowTest();
    var width = $("body").css("width");
    $("body").css("width", 640);
    var nav = $('#nav-shadowTest').navigator({
            defTab: 0
        }).navigator('this'),
        scroller = $(".ui-navigator-list")[0],
        $wrapper = $('.ui-navigator-wrapper');
    setTimeout(function () {
        equals(nav._data.defTab, 0, 'The defTab is right');
        equals($wrapper.hasClass('ui-navigator-shadowr'), true, 'The shadow right shows');
        ua.click($(scroller).find('a')[3]);
        setTimeout(function () {
            equals($wrapper.hasClass('ui-navigator-shadowall'), true, 'The shadow all shows');
            ua.click($(scroller).find('a')[22]);
            setTimeout(function () {
                equals($wrapper.hasClass('ui-navigator-shadowl'), true, 'The shadow left shows');
                $('#nav-shadowTest').navigator('destroy');
                $('#nav-shadowTest').remove();
                $("body").css("width", width);
                start();
            }, 600);
        }, 600);
    }, 100)
});

test('defTab: in the viewport & not in the viewport', function () {
    stop();
    var count = 1;
    var width = $("body").css("width");
    $("body").css("width", 600);
    shadowTest(count);
    var nav = $('#nav-shadowTest' + count).navigator('this');

    equals(nav._data.defTab, 0, 'The defTab index is right');
    equals(nav._data.iScroll.x, 0, 'The defTab is not moved');
    equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowr'), false, 'The fix elem has not shadow');
    nav.destroy();
    $('#nav-shadowTest' + count).remove();
    count++;

    shadowTest(count);
    var nav = $('#nav-shadowTest' + count).navigator({
            defTab: 1
        }).navigator('this');

    equals(nav._data.defTab, 1, 'The second fix defTab index is right');
    equals(nav._data.iScroll.x, 0, 'The second fix defTab is not moved');
    equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowr'), false, 'The fix elem has not shadow');
    nav.destroy();
    $('#nav-shadowTest' + count).remove();
    count++;

    shadowTest(count);
    var nav = $('#nav-shadowTest' + count).navigator({
            defTab: 2
        }).navigator('this');

    equals(nav._data.defTab, 2, 'The scroll defTab index is right');
    equals(nav._getPos(0), 'first', 'The scroll defTab is not moved');
    equals(nav._data.iScroll.x, 0, 'The scroll defTab is not moved');
    equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowr'), true, 'The right shadow appears');
    nav.destroy();
    $('#nav-shadowTest' + count).remove();
    count++;

    shadowTest(count);
    var nav = $('#nav-shadowTest' + count).navigator({
            defTab: 3
        }).navigator('this');

    equals(nav._data.defTab, 3, 'The scroll defTab index is right');
    equals(nav._getPos(1), 'middle', 'The scroll defTab is not moved');
    equals(nav._data.iScroll.x, 0, 'The scroll defTab is not moved');
    equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowr'), true, 'The right shadow appears');
    nav.destroy();
    $('#nav-shadowTest' + count).remove();
    count++;

    shadowTest(count);
    nav = $('#nav-shadowTest' + count).navigator({
        defTab: 5
    }).navigator('this');
    equals(nav._data.defTab, 5, 'The scroll defTab index is right');
    equals(nav._getPos(3), 'last', 'The scroll defTab pos is right');

    setTimeout(function () {
        equals(nav._data.iScroll.x, nav._data.iScroll.wrapperW - nav._data._scrollerSumWidth[4], 'The scroll defTab is right dis');
        equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowall'), true, 'The all shadow appears');
        nav.destroy();
        $('#nav-shadowTest' + count).remove();
        count++;

        shadowTest(count);
        nav = $('#nav-shadowTest' + count).navigator({
            defTab: 24
        }).navigator('this');
        equals(nav._data.defTab, 24, 'The scroll defTab index is right');
        equals(nav._getPos(22), 'last', 'The scroll defTab pos is right');

        setTimeout(function () {
            equals(nav._data.iScroll.x, nav._data.iScroll.maxScrollX, 'The scroll defTab is right dis');
            equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowl'), true, 'The left shadow appears');
            nav.destroy();
            $('#nav-shadowTest' + count).remove();
            count++;

            shadowTest(count);
            nav = $('#nav-shadowTest' + count).navigator({
                defTab: 25
            }).navigator('this');
            equals(nav._data.defTab, 25, 'The right fix defTab index is right');

            setTimeout(function () {
                equals(nav._data.iScroll.x, 0, 'The right fix defTab is right dis');
                equals(nav._data._$navWrapper.hasClass('ui-navigator-shadowl'), false, 'The fix elem has not shadow');
                nav.destroy();
                $('#nav-shadowTest' + count).remove();
                count++;
                $("body").css("width", width);
                start();
            }, 600)
        }, 600)
    }, 600);
});

test("iScrollOpts", function(){
    expect(1);
    fullSetup();
    var count = 0, time = 0.
        nav = $('#nav-fullsetup').navigator({
        	iScrollOpts: {
        		hScroll: false
        	}
        }).navigator('this');
    equals(nav._data.iScroll.options.hScroll, false, "The iScrollOpts is right");
    nav.destroy();
});

test("isShowShadow: false", function(){
    expect(3);
    stop();
    shadowTest();
    var width = $("body").css("width");
    $("body").css("width", 640);
    var nav = $('#nav-shadowTest').navigator({
            defTab: 3,
            isShowShadow: false
        }).navigator('this'),
        scroller = $(".ui-navigator-list")[0],
        $wrapper = $('.ui-navigator-wrapper');
    setTimeout(function () {
        equals($wrapper.attr("class"), "ui-navigator-wrapper", 'No shadow');
        ua.click($(scroller).find('a')[3]);
        setTimeout(function () {
        	equals($wrapper.attr("class"), "ui-navigator-wrapper", 'No shadow');
            ua.click($(scroller).find('a')[22]);
            setTimeout(function () {
            	equals($wrapper.attr("class"), "ui-navigator-wrapper", 'No shadow');
                $('#nav-shadowTest').navigator('destroy');
                $('#nav-shadowTest').remove();
                $("body").css("width", width);
                start();
            }, 600);
        }, 600);
    }, 100)
});

test("isScrollToNext: false", function(){
    stop();
    shadowTest();
    var width = $("body").css("width");
    $("body").css("width", 600);
    var nav = $('#nav-shadowTest').navigator({
    	defTab: 5,
    	isScrollToNext: false
    }).navigator('this'),
        $scroller = $('.ui-navigator-list'),
        $navList = $scroller.find('a'),
        length = $navList.length;

        ua.click($navList[2]); 
        setTimeout(function () {
            equals(nav._data.iScroll.x, 0, 'Dosen\'t move when clicking the last elem');

            ua.click($navList[0]); 
            setTimeout(function () {
            	equals(nav._data.iScroll.x, 0, 'Dosen\'t move when clicking the first elem');
                nav.destroy();
                $('#nav-shadowTest').remove();
                $("body").css("width", width);
                start();
            }, 600)
        }, 600)
});

test("_scrollToNext: last & first & mid & scroll the distance", function(){
    stop();
    shadowTest();
    var width = $("body").css("width");
    $("body").css("width", 600);
    var nav = $('#nav-shadowTest').navigator('this'),
        $scroller = $('.ui-navigator-list'),
        $navList = $scroller.find('a'),
        length = $navList.length;

    equals(nav._data.defTab, 0, 'The defTab is right');

    ua.click($navList[0]);
    equals(nav._getPos(0), 'first', 'The first elem return the right pos');
    equals(nav._data.iScroll.x, 0, 'The first elem moves the right dis');

    lastMovedX = nav._data.iScroll.x;
    ua.click($navList[1]);     //mid elem
    equals(nav._getPos(1), 'middle', 'The mid elem returns the right pos');

    setTimeout(function () {
        equals(nav._data.iScroll.x, lastMovedX, 'The mid elem not moved');

        movedX = nav._data.iScroll.x;    //last elem
        ua.click($navList[2]);
        equals(nav._getPos(2), 'last', 'The right last elem returns the right pos');

        setTimeout(function () {
            equals(nav._data.iScroll.x, nav._data.iScroll.wrapperW - nav._data._scrollerSumWidth[3], 'The right last elem moved the right dis');

            ua.click($navList[length - 1]);      //the last elem
            equals(nav._getPos(length - 1), 'last', 'The last elem return the right pos');

            setTimeout(function () {
                equals(nav._data.iScroll.x, nav._data.iScroll.maxScrollX, 'The first elem moves the right dis');

                movedX = nav._data.iScroll.x;
                ua.click($navList[length - 3]);       //first elem
                equals(nav._getPos(length - 3), 'first', 'The left first elem return the right pos');

                setTimeout(function () {
                    equals(nav._data.iScroll.x, -nav._data._scrollerSumWidth[length - 5], 'The left first elem moves the right dis');
                    nav.destroy();
                    $('#nav-shadowTest').remove();
                    $("body").css("width", width);
                    start();
                }, 600)
            }, 600)
        }, 600)
    }, 600);
});

test('ortchange: bigger & smaller than tab width', function () {
    expect(6);
    stop();
    var delayTime = $.os.ios ? 500 : 1500;
    var width = $("body").css("width");
    $("body").css("width", 320);
    var nav = $.ui.navigator({
        content:[
            {text:"首页", url: "http://www.baidu.com"},
            {text:"电影", url: "#a"},
            {text:"电视剧", url: "javascript:;"},
            {text:"测试测试", url: "javascript:;"},
            {text:"动漫", url: "javascript:;"},
            {text:"综艺", url: "javascript:;"}
        ]
    }),iScroll = nav._data.iScroll;

    var wrapperW = iScroll.wrapperW;

    $("body").css("width", 600);
    ta.trigger("ortchange");

    setTimeout(function(){
        notEqual(iScroll.wrapperW, wrapperW, "The window resizes bigger, the scroll wrapper resize right");
        ua.click(nav._data._$tabList[1]);
        equals(nav._data._$tabList.eq(1).hasClass('cur'), true, 'The tab can be selected after select');
        iScroll.scrollTo(iScroll.maxScrollX, 0, 0);

        setTimeout(function () {
            equals(iScroll.x, 0, 'The tab can scroll to the last after resize');     //width is not fit, can not scroll

            var wrapper2 = iScroll.wrapperW;
            $("body").css("width", 200);
            ta.trigger('ortchange');
            $(window).trigger('ortchange');
            setTimeout(function () {

                notEqual(iScroll.wrapperW, wrapper2, "The window resizes smaller, the scroll wrapper resize right");
                ua.click(nav._data._$tabList[3]);
                equals(nav._data._$tabList.eq(3).hasClass('cur'), true, 'The tab can be selected after select');
                iScroll.scrollTo(iScroll.maxScrollX + 50, 0, 0);
                setTimeout(function () {
                    equals(iScroll.x, iScroll.maxScrollX + 50, 'The tab can scroll to the right pos after resize');
                    $("body").css("width", width);
                    nav.destroy();
                    start();
                }, 600)
            }, delayTime);
        }, 600);
    }, delayTime);
});

test("create html: create or setup fix and scroll navigator", function(){
    stop();
    expect(4);
    var nav = $.ui.navigator({
    	disablePlugin: true,
        content: content,
        tabselect: function(){
        	ok(true);
        }
    });
    
    equals(nav._data.iScroll, undefined, "disable plugin");
    equals($(".ui-navigator-wrapper").length, 0, "disable plugin");
    nav.switchTo(2);
    nav.destroy();
    start();
});

test("destroy",function(){
    ua.destroyTest(function(w,f){
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var nav = w.$.ui.navigator({
            content:content
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