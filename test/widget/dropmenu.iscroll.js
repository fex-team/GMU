module("widget/dropmenu",{
    setup:function(){
        var container = $("<div id='container'></div>");
        $("body").append(container.css({
            padding: '2em',
            position: 'relative'
        }));
        $('#container').html('<a id="btn1" data-icon="arrow-d" data-iconpos="right">下拉菜单</a><div id="dropmenu1"><ul>' +
                '<li><a>item1</a></li><li><a><span class="ui-icon ui-icon-home"></span>主页</a></li>' +
                '<li><a><span class="ui-icon ui-icon-grid"></span>设置</a></li>' +
                '<li><a><span class="ui-icon ui-icon-delete"></span>删除</a></li>' +
                '<li><a><span class="ui-icon ui-icon-check"></span>检查</a></li>' +
                '<li><a><span class="ui-icon ui-icon-refresh"></span>刷新</a></li>' +
                '<li><a><span class="ui-icon ui-icon-forward"></span>前进</a></li>' +
                '<li><a><span class="ui-icon ui-icon-back"></span>后退</a></li>' +
                '<li><a><span class="ui-icon ui-icon-info"></span>信息</a></li>' +
                '</ul></div>');
    },
    teardown: function(){
        $('#container').remove();
    }
});

//test
test("只为加载css用",function(){
    expect(1);
    stop();
    //lili button.css和button.default.css各自的作用
    ua.loadcss(["reset.css", "icons.default.css", "widget/button/button.css","widget/button/button.default.css", "widget/dropmenu/dropmenu.css", "widget/dropmenu/dropmenu.default.css"], function(){
        ok(true, '样式加载进来了！');
        start();
    });
});

test("竖向", function(){
    expect(7);
    stop();
    ua.importsrc('widget/button', function(){
        var btn = $('#btn1').button();
        var dropmenu = $('#dropmenu1').dropmenu({
            align:'left',
            btn:  $('#btn1'),
            width: $('#btn1').width(),
            height: 137,
            iScroll: true
        }).dropmenu('this');
        ok(dropmenu.data('_btn').is('#btn1'), 'btn设置正确');
        ua.click(btn[0]);
        ok(ua.isShown(dropmenu._el[0]), "点击btn，dropmenu显示");
        equals($(".iscroll-wrap .ui-dropmenu-items li", dropmenu._el).length, 9, "iscroll容器正确");
        ok($(".ui-dropmenu-items", dropmenu._el).height() > $(".iscroll-wrap", dropmenu._el).height(), "iscroll高度正确");
        var t = $(".ui-dropmenu-items", dropmenu._el).offset().top;
        
        var s = dropmenu.data('_iScroll');
        setTimeout(function(){
            ta.touchstart($("#dropmenu1 ul")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($("#dropmenu1 ul")[0], {
                touches: [{
                    clientX: 0,
                    clientY: -100
                }]
            });
            //PC
            ua.mousedown($("#dropmenu1 ul")[0], {
                clientX: 0,
                clientY: 0
            });
            ua.mousemove($("#dropmenu1 ul")[0], {
                clientX: 0,
                clientY: -100
            });
            setTimeout(function(){
                ta.touchend($("#dropmenu1 ul")[0]);
                //PC
                ua.mouseup($("#dropmenu1 ul")[0]);
                setTimeout(function(){
                    approximateEqual(s.y, -100, "The dropmenu scrolled");
                    equals($(".ui-dropmenu-items", dropmenu._el).offset().top, t - 100, "The dropmenu scrolled");
                    ua.click(btn[0]);
                    ok(ua.isShown(dropmenu._el[0]), "再次点击btn，dropmenu隐藏");
                    dropmenu.destroy();
                    start();
                }, 400);
            }, 400);
        }, 100);
    }, '$.ui.button', 'widget/dropmenu');
});

test("横向", function(){
    expect(7);
    stop();
    var btn = $('#btn1').button();
    var dropmenu = $('#dropmenu1').dropmenu({
        direction:'horizontal',
        btn: $('#btn1'),
        width: 144,
        iScroll: true
    }).dropmenu('this');
    ok(dropmenu.data('_btn').is('#btn1'), 'btn设置正确');
    ua.click(btn[0]);
    ok(ua.isShown(dropmenu._el[0]), "点击btn，dropmenu显示");
    equals($(".iscroll-wrap .ui-dropmenu-items li", dropmenu._el).length, 9, "iscroll容器正确");
    ok($(".ui-dropmenu-items", dropmenu._el).width() > $(".iscroll-wrap", dropmenu._el).width(), "iscroll高度正确");
    var l = $(".ui-dropmenu-items", dropmenu._el).offset().left;
    
    var s = dropmenu.data('_iScroll');
    setTimeout(function(){
        ta.touchstart($("#dropmenu1 ul")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($("#dropmenu1 ul")[0], {
            touches: [{
                clientX: -100,
                clientY: 0
            }]
        });
        //PC
        ua.mousedown($("#dropmenu1 ul")[0], {
	        clientX: 0,
	        clientY: 0
        });
        ua.mousemove($("#dropmenu1 ul")[0], {
            clientX: -100,
            clientY: 0
        });
        setTimeout(function(){
            ta.touchend($("#dropmenu1 ul")[0]);
            //PC
            ua.mouseup($("#dropmenu1 ul")[0]);
            setTimeout(function(){
                approximateEqual(s.x, -100, "The dropmenu scrolled");
                equals($(".ui-dropmenu-items", dropmenu._el).offset().left, l - 100, "The dropmenu scrolled");
                ua.click(btn[0]);
                ok(ua.isShown(dropmenu._el[0]), "再次点击btn，dropmenu隐藏");
                dropmenu.destroy();
                start();
            }, 400);
        }, 400);
    }, 100);
});

test("iScroll参数", function(){
    expect(1);
    stop();
    var btn = $('#btn1').button();
    var dropmenu = $('#dropmenu1').dropmenu({
        direction:'horizontal',
        btn: $('#btn1'),
        width: 144,
        iScroll: {
        	useTransition: true
        }
    }).dropmenu('this');
    
    ua.click(btn[0]);
    var s = dropmenu.data('_iScroll');
    ok(s.options.useTransition, "The options are right");
    
    dropmenu.destroy();
    start();
            
});


test("disablePlugin=true", function(){
    expect(2);
    var btn = $('#btn1').button();
    var dropmenu = $('#dropmenu1').dropmenu({
    	disablePlugin: true,
        btn:  $('#btn1'),
        height: 137,
        iScroll: true
    }).dropmenu('this');
    ua.click(btn[0]);
    equals($(".ui-dropmenu .iscroll-wrap").length, 0, "disable plugin");
    ok($(".ui-dropmenu-items").height() > 137,  "disable plugin");
});


test("destroy",function(){
    ua.destroyTest(function(w,f){
        w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var container = w.$("<div id='container'></div>");
        w.$("body").append(container.css({
            padding: '2em',
            position: 'relative'
        }));
        w.$('<a id="btn">btn</a>').appendTo('#container');
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var obj =  w.$.ui.dropmenu({
        	btn: '#btn',
            items: [
                {
                    text: 'test'
                }
            ],
            height: 137,
            iScroll: true
        });
        obj.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(obj);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The instance is destroy");
        equals(w.$("#container").length, 1, "组件之外的dom没有被移除");
        this.finish();
    })
}) ;