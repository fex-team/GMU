module('webapp.progressbar', {
    setup: function() {
        $('body').append('<div id="progressbar"></div>')
    },
    teardown: function() {
        $('#progressbar').remove();
    }
});


test("smart setup", function() {
    expect(8);
    stop();
    ua.loadcss(["widget/progressbar/progressbar.css", "widget/progressbar/progressbar.default.css"], function() {
        var progressbar = $('#progressbar').progressbar('this');

        equals(progressbar._options.initValue, 0, "The _data is right");
        equals(progressbar._options.horizontal, true, "The _data is right");
        equals(progressbar._options.transitionDuration, 300, "The _data is right");

        ok(ua.isShown(progressbar.$el[0]), "The bar shows");
        ok(progressbar.$el.is(".ui-progressbar-h"), "The bar is right");
        equals(progressbar.$el.find(".ui-progressbar-bg").length, 1 , "The background is right");
        equals(progressbar.$el.find(".ui-progressbar-button").length, 1 , "The button is right");
        equals(progressbar.$el.find(".ui-progressbar-button").offset().left, -14, "The button is right");

        progressbar.destroy();
        start();
    });
});

test("full setup", function() {
    expect(4);
    $('#progressbar').remove();
    $('body').append('<div id="progressbar" class="ui-progressbar-h" style="width: 1366px;"><div class="ui-progressbar-bg"><div class="ui-progressbar-filled"></div><div class="ui-progressbar-button"><div><b></b></div></div></div></div>');
    var progressbar = $('#progressbar').progressbar('this');
    ok(ua.isShown(progressbar.$el[0]), "The bar shows");
    ok(progressbar.$el.is(".ui-progressbar-h"), "The bar is right");
    equals(progressbar.$el.find(".ui-progressbar-bg").length, 1 , "The background is right");
    equals(progressbar.$el.find(".ui-progressbar-button").length, 1 , "The button is right");
    progressbar.destroy();
});

test("render, no el", function() {
    expect(9);
    stop();
    var progressbar = gmu.Progressbar();

    equals(progressbar._options.initValue, 0, "The _data is right");
    equals(progressbar._options.horizontal, true, "The _data is right");
    equals(progressbar._options.transitionDuration, 300, "The _data is right");

    ok(ua.isShown(progressbar.$el[0]), "The bar shows");
    ok(progressbar.$el.is(".ui-progressbar-h"), "The bar is right");
    equals(progressbar.$el.parent()[0], document.body, "The container is right");
    equals(progressbar.$el.find(".ui-progressbar-bg").length, 1 , "The background is right");
    equals(progressbar.$el.find(".ui-progressbar-button").length, 1 , "The button is right");
    equals(progressbar.$el.find(".ui-progressbar-button").offset().left, -14, "The button is right");
    progressbar.destroy();
    start();
});

test("render, el(selector)", function() {
    expect(4);
    stop();
    $('#progressbar').remove();
    $('body').append('<div id="test"><div id="progressbar"></div></div>');

    var progressbar = gmu.Progressbar("#progressbar");

    ok(ua.isShown(progressbar.$el[0]), "The bar shows");
    ok(progressbar.$el.is(".ui-progressbar-h"), "The bar is right");
    ok(progressbar.$el.is("#progressbar"), "The bar is right");
    equals(progressbar.$el.parent().attr("id"), "test", "The container is right");
    $("#test").remove();
    progressbar.destroy();
    start();
});

test("render, el(zepto)", function() {
    expect(4);
    stop();
    $('#progressbar').remove();
    $('body').append('<div id="container"></div>');

    var progressbar = gmu.Progressbar($('<div id="progressbar"></div>'),{
    	container: "#container"
    });

    ok(ua.isShown(progressbar.$el[0]), "The bar shows");
    ok(progressbar.$el.is(".ui-progressbar-h"), "The bar is right");
    ok(progressbar.$el.is("#progressbar"), "The bar is right");
    equals(progressbar.$el.parent().attr("id"), "container", "The container is right");
    progressbar.destroy();
    $("#container").remove();
    start();
});

test("transitionDuration & horizontal", function() {
    stop();
    expect(4);
    var progressbar = $('#progressbar').height(400).progressbar({
    	initValue:40,
    	transitionDuration: 200,
    	horizontal: false
    }).progressbar('this');
    setTimeout(function(){
    	approximateEqual(progressbar.$el.find(".ui-progressbar-button").offset().top, progressbar.$el.offset().top + 400 * (1 - 0.4) - 14, "The initValue is right");
    	ok(progressbar.$el.is(".ui-progressbar-v"), "The horizontal is right");
    	equals(progressbar.$el.find(".ui-progressbar-bg").width(), 7, "The horizontal is right");
    	equals(progressbar.$el.height(), 400, "The horizontal is right");
        progressbar.destroy();
        start();
    }, 1000);
});

test("initValue, transitionDuration, value()", function() {
    stop();
    expect(7);
    var progressbar = $('#progressbar').progressbar({initValue:40}).progressbar('this');
    setTimeout(function(){
    	approximateEqual(progressbar.$el.find(".ui-progressbar-button").offset().left, progressbar.$el.width() * 0.4 - 14, "The initValue is right");
        equal(progressbar.value(), 40, 'the value is right');
        progressbar.value(65);
        equal(progressbar.value(), 65, 'the value is right');
        progressbar.value('some value');
        equal(progressbar.value(), 65, 'the value is right');
        progressbar.value(0);
        equal(progressbar.value(), 0, 'the value is right');
        progressbar.value(250);
        equal(progressbar.value(), 100, 'the value is right');
        progressbar.value(-30);
        equal(progressbar.value(), 0, 'the value is right');
        progressbar.destroy();
        start();
    }, 1000);
});

test("show(), hide()", function() {
    stop();
    expect(3);
    var progressbar = $('#progressbar').progressbar('this');
    ok(ua.isShown(progressbar.$el[0]), "The progressbar shows");
    progressbar.hide();
    setTimeout(function () {
        ok(!ua.isShown(progressbar.$el[0]), "The progressbar hides");
        progressbar.show();
        ok(ua.isShown(progressbar.$el[0]), "The progressbar shows");
        progressbar.destroy();
        start();
    }, 100);
});

test("左右滑动 - 横向", function() {
    expect(2);
    stop();
    var progressbar = $('#progressbar').progressbar('this');

    ta.touchstart($(".ui-progressbar-button")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-progressbar-button")[0], {
        touches:[{
            clientX: 200,
            clientY: 0
        }]
    });
    ta.touchend($(".ui-progressbar-button")[0]);

    setTimeout(function(){
        equals(progressbar.value(), 200 / progressbar.$el.offset().width * 100,"The value is right");
        ta.touchstart($(".ui-progressbar-button")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($(".ui-progressbar-button")[0], {
            touches:[{
                clientX: -50,
                clientY: 0
            }]
        });
        ta.touchend($(".ui-progressbar-button")[0]);
        setTimeout(function(){
            equals(progressbar.value(), 150 / progressbar.$el.offset().width * 100,"The value is right");
            progressbar.destroy();
            start();
        }, 550);
    }, 550);
});

test("点击进度条 - 横向", function() {
    stop();
    expect(2);
    var progressbar = $('#progressbar').progressbar('this');
    ta.touchstart($(".ui-progressbar-bg")[0], {
        touches: [{
            clientX: 300,
            clientY: 0
        }]
    });
    ta.touchend($(".ui-progressbar-bg")[0]);
    setTimeout(function(){
        equals(progressbar.value(), 300 / progressbar.$el.offset().width * 100,"The value is right");
        ta.touchstart($(".ui-progressbar-bg")[0], {
            touches: [{
                clientX: -100,
                clientY: 0
            }]
        });
        ta.touchend($(".ui-progressbar-bg")[0]);
        setTimeout(function(){
            equals(progressbar.value(), 0,"The value is right");
            progressbar.destroy();
            start();
        }, 550);
    }, 550);
});

test("上下滑动 - 竖向", function() {
    expect(2);
    stop();
    var progressbar = $('#progressbar').height(400).progressbar({horizontal:false}).progressbar('this');
    ta.touchstart($(".ui-progressbar-button")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-progressbar-button")[0], {
        touches:[{
            clientX: 0,
            clientY: -200
        }]
    });
    ta.touchend($(".ui-progressbar-button")[0]);

    setTimeout(function(){
        equals(progressbar.value(), 200 / progressbar.$el.offset().height * 100,"The value is right");
        ta.touchstart($(".ui-progressbar-button")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($(".ui-progressbar-button")[0], {
            touches:[{
                clientX: 0,
                clientY: 50
            }]
        });
        ta.touchend($(".ui-progressbar-button")[0]);
        setTimeout(function(){
            equals(progressbar.value(), 150 / progressbar.$el.offset().height * 100,"The value is right");
            progressbar.destroy();
            start();
        }, 550);
    }, 550);
});

test("点击进度条 - 竖向", function() {
    stop();
    expect(2);
    var progressbar = $('#progressbar').height(400).progressbar({horizontal:false}).progressbar('this');
    ta.touchstart($(".ui-progressbar-bg")[0], {
        touches: [{
            clientX: 0,
            clientY: progressbar.$el.offset().top + 300
        }]
    });
    ta.touchend($(".ui-progressbar-bg")[0]);
    setTimeout(function(){
        approximateEqual(progressbar.value(), (progressbar.$el.offset().height - 300) / progressbar.$el.offset().height * 100,"The value is right");
        ta.touchstart($(".ui-progressbar-bg")[0], {
            touches: [{
                clientX: 0,
                clientY: progressbar.$el.offset().top - 100
            }]
        });
        ta.touchend($(".ui-progressbar-bg")[0]);
        setTimeout(function(){
            equals(progressbar.value(), 100,"The value is right");
            progressbar.destroy();
            start();
        }, 550);
    }, 550);
});

test("destroy()", function() {

    ua.destroyTest(function(w,f){
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var progressbar = w.$('<div></div>').progressbar('this');
        progressbar.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(dl2, dl1, "The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el2, el1, "The event is ok");
        this.finish();
    })
});
test("y的差大于x向的差,不能横向滚动 && x的差大于y向的差,不能竖向滚动", function() {
    expect(4);
    stop();
    var progressbar = $('#progressbar').progressbar('this');
    progressbar.show();//多次显示不出错
// todo 源码里这一句怎么else :if(!opts.T) {..
    ta.touchstart($(".ui-progressbar-button")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-progressbar-button")[0], {
        touches:[{
            clientX: 200,
            clientY: 300
        }]
    });
    ta.touchend($(".ui-progressbar-button")[0]);
    setTimeout(function(){
        ok(ua.isShown(progressbar.$el[0]), "The bar shows");
        equals(progressbar.value(), 0,"y的差大于x向的差,不能横向滚动");
        progressbar.destroy();
        $('#progressbar').remove();
        setTimeout(function(){
            $('body').append('<div id="progressbar"></div>');
            progressbar = $('#progressbar').progressbar({horizontal:false}).progressbar('this');
            ta.touchstart($(".ui-progressbar-button")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($(".ui-progressbar-button")[0], {
                touches:[{
                    clientX: 100,
                    clientY: 50
                }]
            });
            ta.touchend($(".ui-progressbar-button")[0]);
            setTimeout(function(){
                equals(progressbar.value(), 0,"x的差大于y向的差,不能竖向滚动");
                progressbar.hide();
                progressbar.hide();
                setTimeout(function(){
                    ok(!ua.isShown(progressbar.$el[0]), "The progressbar hides");
                    progressbar.destroy();
                    start();
                }, 50);
            }, 550);
        }, 50);
    }, 550);
});
test("百分比超出的", function() {
    expect(2);
    stop();
    var progressbar = $('#progressbar').progressbar('this');
    ta.touchstart($(".ui-progressbar-button")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-progressbar-button")[0], {
        touches:[{
            clientX: progressbar.$el.offset().width+100,
            clientY: 0
        }]
    });
    ta.touchend($(".ui-progressbar-button")[0]);
    setTimeout(function(){
        equals(progressbar.value(), 0,"x百分比超出的,不能横向滚动");
        progressbar.destroy();
        $('#progressbar').remove();
        setTimeout(function(){
            $('body').append('<div id="progressbar"></div>');
            progressbar = $('#progressbar').progressbar({horizontal:false}).progressbar('this');
            ta.touchstart($(".ui-progressbar-button")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($(".ui-progressbar-button")[0], {
                touches:[{
                    clientX: 0,
                    clientY: progressbar.$el.offset().height+100
                }]
            });
            ta.touchend($(".ui-progressbar-button")[0]);
            setTimeout(function(){
                equals(progressbar.value(), 0,"y百分比超出的,不能竖向滚动");
                setTimeout(function(){
                    progressbar.destroy();
                    start();
                }, 50);
            }, 550);
        }, 50);
    }, 550);
});
