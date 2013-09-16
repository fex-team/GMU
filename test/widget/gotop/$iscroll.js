module("widget/gotop", {
    setup: function(){
        h = top.$J(".runningarea").css("height");
        top.$J(".runningarea").css("height", "600"); //不能让document.documentElement.clientHeight大于window.pageYOffset
    },
    teardown: function(){
        $(".ui-gotop").remove();
        $("#thelist").remove();
        top.$J(".runningarea").css("height", h);
    }
});

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

(function(){
    enSetup = function(w){
    	var w = w || window;
        var html = '<ul id="thelist"><div id="scroller" /></ul>';
        $(w.document.body).append(html);
        var count=0;
        var $el, i;
        $el = w.$('#scroller');
        for (i = 0; i < 200; i++) {
            w.$('<li>').html('第' + count + '行(up)').attr('id','li_'+count).css('color','blue').appendTo($el);
            count++;
        }
    };
})();

test("iScrollInstance", function(){
    stop();
    expect(11);
    enSetup();
    ua.loadcss(["widget/gotop/gotop.css"], function(){
        $("#thelist").css("height", window.innerHeight);
        var s = new iScroll("thelist");
        var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
            iScrollInstance: s,
            position: {bottom: 20, right: 30},
            afterScroll: function(){
                equal($("#scroller").offset().top, $("#thelist").offset().top, "The page scrolled");
                ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                // setTimeout(function(){
    				gotop.destroy();
    				start();
    			// }, 0);
            }
        });
        setTimeout(function(){
        	//滑动页面
            ta.touchstart($("#scroller")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($("#scroller")[0], {
                touches: [{
                    clientX: 0,
                    clientY: -2000
                }]
            });
            //PC
            ua.mousedown($("#scroller")[0], {
                clientX: 0,
                clientY: 0
            });
            ua.mousemove($("#scroller")[0], {
            	clientX: 0,
                clientY: -2000
            });
            setTimeout(function(){
                //PC
                ua.mouseup($("#scroller")[0]);
                ta.touchend($("#scroller")[0]);

                setTimeout(function(){
                    approximateEqual(s.y, -2000, "The page scrolled");
                    ok(ua.isShown(gotop.$el[0]), "The gotop shows");
                    equals(gotop.$el.offset().left, $("html").offset().width -
		                    (tablet ? 60 : 50) - 30, "The gotop left is right");
                    approximateEqual(gotop.$el.offset().top, window.innerHeight -
		                    (tablet ? 60 : 50) - 20, "The gotop top is right"); //位置相对于整个页面没有变
                    
                    //滑动页面，手指离开之前，gotop隐藏
                    ta.touchstart($("#scroller")[0], {
                        touches: [{
                            clientX: 0,
                            clientY: 0
                        }]
                    });
                    ta.touchmove($("#scroller")[0], {
                        touches: [{
                            clientX: 0,
                            clientY: -100
                        }]
                    });
                    //PC
                    ua.mousedown($("#scroller")[0], {
                        clientX: 0,
                        clientY: 0
                    });
                    ua.mousemove($("#scroller")[0], {
                    	clientX: 0,
                        clientY: -100
                    });
                    ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                    
                    setTimeout(function(){
                        //PC
                        ua.mouseup($("#scroller")[0]);
                        ta.touchend($("#scroller")[0]);

                        setTimeout(function(){
                            approximateEqual(s.y, -2100, "The page scrolled");
                            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
                            equals(gotop.$el.offset().left, $("html").offset().width -
		                            (tablet ? 60 : 50) - 30, "The gotop left is right");
	                        approximateEqual(gotop.$el.offset().top, window.innerHeight -
		                            (tablet ? 60 : 50) - 20, "The gotop top is right"); //位置相对于整个页面没有变
                            ua.click(gotop.$el[0]);
                        }, 400);
                    }, 300);
                }, 300);
            }, 400);
        }, 100);
    });
});

test("disablePlugin", function(){
    stop();
    expect(4);
    enSetup();
    var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
    	iscroll: false
    });
    setTimeout(function(){
        window.scrollTo(0, 2000);
        ta.scrollStop(document);
        setTimeout(function(){
            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
            ok(Math.abs(window.pageYOffset - 2000) <= 1, "The pageYOffset is right");
            equals(gotop.$el.offset().left, $("html").offset().width  -
		            (tablet ? 60 : 50) - 10, "The gotop left is right");
            equals(gotop.$el.offset().top, window.pageYOffset + $(window).height() -
		            (tablet ? 60 : 50) - 10, "The gotop top is right");
            gotop.destroy();
            start();
        }, 600);
    }, 300);
});

test("destroy", function(){
    ua.destroyTest(function(w,f){
        enSetup(w);
        var s = new w.iScroll("thelist");
        
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var config = new w.Object({
            iScrollInstance: s,
            useFix: false //fix()中dom和event都没有清干净，设置false排除fix带来的影响
        });
        config.__proto__ = w.Object.prototype;

        var gotop = w.gmu.Gotop(config);
        gotop.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");
        equal(w.$(".ui-gotop").length, 0, "The dom is ok");
        equal(el1,el2,"The event is ok");
        this.finish();
    });
});
test("iScroll没有覆盖原有的onScrollMove, onScrollEnd", function(){
    stop();
    expect(2);
    enSetup();
    ua.loadcss(["widget/gotop/gotop.css"], function () {
        $("#thelist").css("height", window.innerHeight);
        var num = 0;
        var s = new iScroll("thelist",{
            onScrollMove: function () {
                num++;
            }, onScrollEnd: function () {
                approximateEqual(s.y, -2000, "The page scrolled");
                ok(num>0, 'onScrollMove, onScrollEnd');
                gotop.destroy();
                start();
            }
        });

        var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
            iScrollInstance: s,
            position: {bottom: 20, right: 30}
        });
        setTimeout(function () {
            //滑动页面
            ta.touchstart($("#scroller")[0], {
                touches: [
                    {
                        clientX: 0,
                        clientY: 0
                    }
                ]
            });
            ta.touchmove($("#scroller")[0], {
                touches: [
                    {
                        clientX: 0,
                        clientY: -2000
                    }
                ]
            });
            //PC
            ua.mousedown($("#scroller")[0], {
                clientX: 0,
                clientY: 0
            });
            ua.mousemove($("#scroller")[0], {
                clientX: 0,
                clientY: -2000
            });
            setTimeout(function () {
                //PC
                ua.mouseup($("#scroller")[0]);
                ta.touchend($("#scroller")[0]);
//                s._scrollTo();        //todo 待确定 这个没影响
            }, 400);
        }, 100);
    });
});