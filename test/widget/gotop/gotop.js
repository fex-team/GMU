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

(function(){
	enSetup = function(){
		var html = '<ul id="thelist"><div id="scroller" /></ul>';
		$(document.body).append(html);
		var count=0;
	    var $el, i;
	    $el = $('#scroller');
	    for (i = 0; i < 200; i++) {
	        $('<li>').html('第' + count + '行(up)').attr('id','li_'+count).css('color','blue').appendTo($el);
	        count++;
	    }
	};
})();

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

test("no el", function(){
	expect(2);
	stop();
	ua.loadcss(["widget/gotop/gotop.css"], function(){
		var gotop = gmu.Gotop({});
		setTimeout(function(){
			equals(gotop.$el.attr("class"), "ui-gotop", "The el is right");
			equals(gotop.$el.parent()[0].tagName.toLowerCase(), "body", "The container is right");
			gotop.destroy();
			start();
		},200);
	});
});

test("el(zepto) & container", function(){
	expect(2);
	var html = '<div id="container"></div>';
	$(document.body).append(html);
	var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
		container: "#container"
	});
	equals(gotop.$el.attr("class"), "ui-gotop", "The el is right");
	equals(gotop.$el.parent().attr("id"), "container", "The container is right");
	gotop.destroy();
	$("#container").remove();
});

test("el(selector)", function(){
	expect(2);
	var div = document.createElement("div");
	$(div).attr("id", "test");
	document.body.appendChild(div);
	div = document.createElement("div");
	$(div).attr("class", "ui-gotop");
	$("#test").append(div);

	var gotop = gmu.Gotop(".ui-gotop", {});
	equals(gotop.$el.attr("class"), "ui-gotop", "The el is right");
	equals(gotop.$el.parent().attr("id"), "test", "The container is right");
	gotop.destroy();
	$("#test").remove();
});

test("useAnimation = false", function(){
    expect(6);
    stop();
    enSetup();
    var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
        useAnimation: false
    });
    setTimeout(function(){
        window.scrollTo(0, 1500);
        ta.scrollStop(document);
        setTimeout(function(){
            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
            ok(Math.abs(window.pageYOffset - 1500) <= 1, "The pageYOffset is right");
            equals(gotop.$el.offset().left, $("html").offset().width  - (tablet?60:50) - 10, "The gotop left is right");
            equals(gotop.$el.offset().top, window.pageYOffset + $(window).height() -(tablet ? 60 : 50) - 10, "The gotop top is right");
            ua.click(gotop.$el[0]);
            setTimeout(function(){
            	ok(window.pageYOffset <= 1, "scroll to top");
	            ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
	            window.scrollTo(0, 0);
	            gotop.destroy();
	            start();
            }, 100);
        },400);
    }, 300);
});

test("afterScroll & useAnimation = true", function(){
	expect(4);
	stop();
	enSetup();
	var a, b;
	var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
		useAnimation:true,
		afterScroll: function(){
		    b = new Date();
			setTimeout(function(){
				ok(b - a > 160, "useAnimation=true");
				ok(window.pageYOffset <= 1, "scroll to top");
				ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
				gotop.destroy();
				start();
			}, 100);
		},
        position: {right: 8, bottom: 8}
	});
	setTimeout(function(){
		window.scrollTo(0, 1500);
		ta.scrollStop(document);
		setTimeout(function(){
			ok(ua.isShown(gotop.$el[0]), "The gotop shows");
			a = new Date();
			ua.click(gotop.$el[0]);
		}, 300);
	},100);
});

test("position", function(){
    stop();
	expect(5);
    setTimeout(function(){
        var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
            position: {bottom: 20, right: 30}
        });
        gotop.show();
        setTimeout(function(){
            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
            equals(gotop.$el.offset().height, tablet ? 60 : 50, "The gotop height is right");
            equals(gotop.$el.offset().width, tablet ? 60 : 50, "The gotop width is right");
            approximateEqual(gotop.$el.offset().left, $("html").offset().width - (tablet ? 60 : 50) - 30, "The gotop left is right");
            approximateEqual(gotop.$el.offset().top, document.documentElement.clientHeight - (tablet ? 60 : 50) - 20, "The gotop top is right");
            gotop.destroy();
            start();
        }, 1000);
    }, 500);
});

test("useFix = false", function(){
	stop();
	ua.importsrc("extend/zepto.fix", function(){
		expect(3);
		enSetup();
		var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
			useFix: false
		});
        gotop.$el.fix({bottom: 20, right: 30});
		setTimeout(function(){
			window.scrollTo(0, 1500);
			ta.scrollStop(document);
			setTimeout(function(){
				ok(ua.isShown(gotop.$el[0]), "The gotop shows");
				equals(gotop.$el.offset().left, $("html").offset().width  -	(tablet ? 60 :	50) - 30, "The gotop left is right");
	            equals(gotop.$el.offset().top, window.pageYOffset + $(window).height() - (tablet ? 60 :50) - 20, "The gotop top is right");
				window.scrollTo(0, 0);
				ta.scrollStop(document);
				gotop.destroy();
			    start();
			}, 300);
		},400);
	}, "Zepto", "widget/gotop");
});

test("useHide = false", function(){
	expect(10);
	stop();
	enSetup();
	var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
		position:{right: 8, bottom: 8},
		useHide: false
	});
	setTimeout(function(){
		ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
		
		ta.touchmove(document);
		window.scrollTo(0, 1500);
		ta.scrollStop(document);
		setTimeout(function(){
			ok(ua.isShown(gotop.$el[0]), "The gotop shows");
			ok(Math.abs(window.pageYOffset - 1500) <= 1, "The pageYOffset is right");
			equals(gotop.$el.offset().left, $("html").offset().width -(tablet ? 60 :50) - 8, "The gotop left is right");
			equals(gotop.$el.offset().top, window.pageYOffset + window.innerHeight -
					(tablet ? 60 : 50) - 8, "The gotop top is right"); //window.innerHeight表示的是加上控制台的页面高度
			
			ta.touchmove(document);
			ok(ua.isShown(gotop.$el[0]), "The gotop shows");
			window.scrollTo(0, 1600); 
			ta.scrollStop(document);
			setTimeout(function(){
				ok(ua.isShown(gotop.$el[0]), "The gotop shows");
				ok(Math.abs(window.pageYOffset - 1600) <= 1, "The pageYOffset is right");
				equals(gotop.$el.offset().left, $("html").offset().width -(tablet ? 60 :50) - 8, "The gotop left is right");
				equals(gotop.$el.offset().top, window.pageYOffset + window.innerHeight -
						(tablet ? 60 : 50) - 8, "The gotop top is right"); //window.innerHeight表示的是加上控制台的页面高度
                
				window.scrollTo(0, 0);
                ta.scrollStop(document);
                gotop.destroy();
                start();
			}, 600);
		}, 400);
	}, 400);
});

test("show() & hide()", function(){
    stop();
	expect(8);

    setTimeout(function(){
        $(document.body).append('<div style="height:300px;width:100px;"></div>');
        var gotop = gmu.Gotop($('<div class="ui-gotop">'), {});
        gotop.show();
        setTimeout(function(){
            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
            equals(gotop.$el.offset().height, (tablet ? 60 :50), "The gotop height is right");
            equals(gotop.$el.offset().width, (tablet ? 60 :50), "The gotop width is right");
            approximateEqual(gotop.$el.offset().left, $("html").offset().width - (tablet ? 60 :50) - 10, "The gotop left is right");
            // equals(gotop.$el.offset().top, document.documentElement.clientHeight -   (tablet ? 60 :50) - 10, "The gotop top is right");
            equals(gotop.$el.offset().top, window.innerHeight - (tablet ? 60 :50) - 10, "The gotop top is right");
            equals(gotop.$el.find('div').css("background-position"), "50% 50%", "The position is right");
            equals(gotop.$el.find('div').css("-webkit-background-size"), tablet?"22px 18px":"18px 15px", "The position is right");
            gotop.hide();
            ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
            gotop.destroy();
            start();
        }, 1000);
    }, 500);
});

test("basic operations", function(){
	expect(17);
	stop();
	enSetup();
	var gotop = gmu.Gotop($('<div class="ui-gotop">'), {
		position:{right: 8, bottom: 8}
	});
	setTimeout(function(){
		
		ta.touchmove(document); //scroll less than a screen
		window.scrollTo(0, 100);
		ta.scrollStop(document);
		setTimeout(function(){
			ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
			
			ta.touchmove(document);
			window.scrollTo(0, 1500); //scroll more than a screen
			ta.scrollStop(document);
			setTimeout(function(){
				ok(ua.isShown(gotop.$el[0]), "The gotop shows");
				ok(Math.abs(window.pageYOffset - 1500) <= 1, "The pageYOffset is right");
				equals(gotop.$el.offset().left, $("html").offset().width -(tablet ? 60 :50) - 8, "The gotop left is right");
				equals(gotop.$el.offset().top, window.pageYOffset + window.innerHeight -
						(tablet ? 60 : 50) - 8, "The gotop top is right"); //window.innerHeight表示的是加上控制台的页面高度
				
				ta.touchmove(document); //touchmove and then scroll
                ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                window.scrollTo(0, 1500);
                ta.scrollStop(document);
                setTimeout(function(){
                    ok(ua.isShown(gotop.$el[0]), "The gotop shows");
                    ok(Math.abs(window.pageYOffset - 1500) <= 1, "The pageYOffset is right");
                    equals(gotop.$el.offset().left, $("html").offset().width -
		                    (tablet ? 60 : 50) - 8, "The gotop left is right");
                    equals(gotop.$el.offset().top, window.pageYOffset + window.innerHeight -
		                    (tablet ? 60 : 50) - 8, "The gotop top is right");
                    
                    ua.click(gotop.$el[0]); //click gotop
                    setTimeout(function(){
                    	ok(window.pageYOffset <= 1, "scroll to top");
                        ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                        
                        window.scrollTo(0, 1500);
                        ta.scrollStop(document);
                        setTimeout(function(){
                            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
                            
                            ta.touchmove(document);
                            ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                            ta.touchend(document);
                            setTimeout(function(){
                                ok(ua.isShown(gotop.$el[0]), "The gotop shows");
                                
                                ta.touchmove(document);
                                ok(!ua.isShown(gotop.$el[0]), "The gotop hides");
                                ta.touchcancel(document);
                                setTimeout(function(){
                                    ok(ua.isShown(gotop.$el[0]), "The gotop shows");
	                                
                                    window.scrollTo(0, 0);
	                                ta.scrollStop(document);
	                                gotop.destroy();
                                    start()
                                }, 800);
                            }, 800);
                        }, 600);
                    }, 800);
                }, 600);
			}, 600);
		}, 400);
	}, 400);
});

test("setup 模式", function(){
    expect(2);
    stop();
    enSetup();
    $('<div id="gotop"></div>').appendTo('body');
    var gotop = $('#gotop').gotop().gotop('this');
    setTimeout(function(){
    	window.scrollTo(0, 1500);
        ta.scrollStop(document);
        setTimeout(function(){
            equals(gotop.$el.attr("class"), "ui-gotop", "The el is right");
            ok(ua.isShown(gotop.$el[0]), "The gotop shows");
	        window.scrollTo(0, 0);
	        ta.scrollStop(document);
	        gotop.destroy();
            start();
        }, 500);
    },100);
});

test("destroy", function(){
    ua.destroyTest(function(w,f){
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var config = new w.Object({
            useFix: false  //fix()中dom和event都没有清干净，设置false排除fix带来的影响
        });
        config.__proto__ = w.Object.prototype;

        var gotop = w.gmu.Gotop(config);
        gotop.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(dl2, dl1, "The dom is ok");
        equal(w.$(".ui-gotop").length, 0, "The dom is ok");
        equal(el2, el1,"The event is ok");
        this.finish();
    });
});