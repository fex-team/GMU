module("widget/dropmenu",{
    setup:function(){
        var container = $("<div id='container'></div>");
        $("body").append(container.css({
            padding: '2em',
            position: 'relative'
        }));
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

test("参数 － btn", function(){
    expect(10);
    stop();
    ua.importsrc('widget/button', function(){
        var container = $('#container');
        var btn = $('<a class="btn">Click Me</a>').appendTo(container);
        var dropmenu = $.ui.dropmenu({
            btn: '.btn'
        });
        ok(dropmenu.data('_btn').is('.btn'), 'btn设置正确');
        equals(container.next()[0], dropmenu._el[0], "btn和dropmenu位置正确");
        ua.click(btn[0]);
        ok(ua.isShown(dropmenu._el[0]), "点击btn，dropmenu显示");
        dropmenu.destroy();
        btn.remove();

        btn = $('<a class="btn">Click Me</a>').appendTo(container);
        dropmenu = $.ui.dropmenu({
            btn: btn
        });
        ok(dropmenu.data('_btn').is('.btn'), 'btn设置正确');
        equals(container.next()[0], dropmenu._el[0], "btn和dropmenu位置正确");
        ua.click(btn[0]);
        ok(ua.isShown(dropmenu._el[0]), "点击btn，dropmenu显示");
        dropmenu.destroy();
        btn.remove();

        btn = $.ui.button({
            container: '#container'
        });
        dropmenu = $.ui.dropmenu({
            btn: btn
        });
        ok(dropmenu.data('_btn').is('.ui-button'), 'btn设置正确');
        equals(container.next()[0], dropmenu._el[0], "btn和dropmenu位置正确");
        ua.click(btn._el[0]);
        ok(ua.isShown(dropmenu._el[0]), "点击btn，dropmenu显示");
        dropmenu.destroy();
        btn.destroy();

        dropmenu = $.ui.dropmenu({
        });
        equals(dropmenu._el.parent()[0], document.body, "btn不设置");
        dropmenu.destroy();
        start();
    }, '$.ui.button', 'widget/dropmenu');
});

test("参数 － align=left/right/center & arrowPos不传", function(){
    expect(9);
    stop();
    var dpos, bpos, apos;
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-aligncenter'), 'dropmenu默认为align center');
	approximateEqual(dpos.left + dpos.width / 2, bpos.left + bpos.width / 2, 1,"dropmenu位置居中");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width / 2, 1, "arrow位置居中");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'left'
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignleft'), 'dropmenu默认为align left');
	approximateEqual(dpos.left, bpos.left, 1,"dropmenu位置居左");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width * 0.25, 1, "arrow位置居左");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'right'
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignright'), 'dropmenu默认为align right');
	approximateEqual(dpos.left + dpos.width, bpos.left + bpos.width, 1,"dropmenu位置居右");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width * 0.75, 1, "arrow位置居右");

    obj.destroy();
    start();
});

test("参数 － align=left/right/center & arrowPos传值", function(){
    expect(9);
    stop();
    var dpos, bpos, apos;
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        arrowPos:{
        	left: '10%',
        	right: 'auto'
        }
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-aligncenter'), 'dropmenu默认为align center');
	approximateEqual(dpos.left + dpos.width / 2, bpos.left + bpos.width / 2, 1,"dropmenu位置居中");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width * 0.1, 1, "arrow位置正确");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'left',
        arrowPos:{
        	left: 10,
        	right: 'auto'
        }
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignleft'), 'dropmenu默认为align left');
	approximateEqual(dpos.left, bpos.left, 1,"dropmenu位置居左");
    approximateEqual(apos.left + apos.width / 2, dpos.left + 10, 1, "arrow位置正确");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'right',
        arrowPos:{
        	left: 'auto',
        	right: '10px'
        }
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignright'), 'dropmenu默认为align right');
	approximateEqual(dpos.left + dpos.width, bpos.left + bpos.width, 1,"dropmenu位置居右");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width - 10, 1, "arrow位置正确");

    obj.destroy();
    start();
});

test("参数 － align=auto & arrowPos不传", function(){
    expect(9);
    stop();
    var dpos, bpos, apos;
    $('<a id="btn">btn</a>').appendTo('#container');
    
    $('#container').css({
        position:'relative'
    });
    $('#btn').css({
        position: 'absolute',
        left: '50%'
    });
    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'auto'
    }).show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-aligncenter'), 'dropmenu被当前为居中对齐');
    equals(obj._el.offset().left + obj._el.width() / 2, $(btn).offset().left + $(btn).width() / 2, "dropmenu位置居中");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width / 2, 1, "arrow位置正确");
    
    $('#btn').css({
        left: 0
    });
    obj.hide().show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignleft'), 'dropmenu被当前为居左对齐');
    equals(obj._el.offset().left, $(btn).offset().left, "dropmenu位置居左");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width * 0.25, 1, "arrow位置正确");

    $('#btn').css({
        left: 'auto',
        right: 0
    });
    obj.hide().show();
    dpos = obj.root().offset(),
    apos = obj.root().find('.ui-dropmenu-arrow').offset();
    bpos = $(btn).offset(),
    ok(obj.root().hasClass('ui-alignright'), 'dropmenu被当前为居右对齐');
    equals(obj._el.offset().right, $(btn).offset().right, "dropmenu位置居右");
    approximateEqual(apos.left + apos.width / 2, dpos.left + dpos.width * 0.75, 1, "arrow位置正确");

    obj.destroy();
    start();
});

test("参数 － width & height", function(){
    expect(2);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        width: 250,
        height: 399
    }).show();
    equals(obj.root().width(), 250, 'dropmenud的宽度是250');
    equals(obj.root().height(), 399, 'dropmenu的高度为399');
    start();
});

test("参数 － offset", function(){
    expect(8);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        offset: {
            x: -10,
            y: 20
        },
        btn: '#btn'
    }).show();

	approximateEqual(obj._el.offset().left + obj._el.width() / 2, $(btn).offset().left + $(btn).width() / 2 - 10, 1,"dropmenu位置居中偏左10px");//居中偏左
    equals(obj._el.offset().top, $(btn).offset().top + $(btn).height() + 20, "dropmenu的位置偏下20px");

    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'left'
    }).show();

    equals(obj._el.offset().left, $(btn).offset().left, "dropmenu位置居左");
    equals(obj._el.offset().top, $(btn).offset().top + $(btn).height() - 1, "dropmenu的位置偏上1px");

    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'left',
        pos: 'up',
    }).show();

    equals(obj._el.offset().left, $(btn).offset().left, "dropmenu位置居左");
    equals(obj._el.offset().top, $(btn).offset().top - obj._el.height() + 1, "dropmenu的位置偏下1px");

    obj.destroy();

    $('#btn').css({
        position: 'absolute',
        left: 0
    });
    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        align: 'auto',
        offset: {
            x: 3,
            y: 5
        }
    }).show();

    equals(obj._el.offset().left, 3, "dropmenu位置居左偏右3px");
    equals(obj._el.offset().top, $(btn).offset().top + $(btn).height() + 5, "dropmenu的位置偏下5px");

    obj.destroy();

    start();
});

test("参数 － pos", function(){
    expect(8);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();
    ok($('#btn').offset().top < obj.root().offset().top, "dropmenu的位置默认在button位置下方.");

    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        pos: 'down'
    }).show();
    ok($('#btn').offset().top < obj.root().offset().top, "dropmenu的位置被设置在button位置下方.");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        pos: 'up',
        offset: {
            x: 10,
            y: -20
        },
    }).show();
    ok($('#btn').offset().top > obj.root().offset().top, "dropmenu的位置被设置在button位置上方.");
    equals(obj._el.offset().left + obj._el.width() / 2, $(btn).offset().left + $(btn).width() / 2 + 10, "dropmenu位置居中偏左10px");
    equals(obj._el.offset().top, $(btn).offset().top - obj._el.height() - 20, "dropmenu的位置偏上20px");
    obj.destroy();

    $('#container').css({
        position:'absolute',
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        padding: '0'
    });
    $('#btn').css({
        position: 'absolute',
        top: 0,
        left: 100
    });
    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        pos: 'auto'
    }).show();
    ok($('#btn').offset().top < obj.root().offset().top, "dropmenu的位置当前在button位置下方.");
    $('#btn').css({
        top: 'auto',
        bottom: 0
    });
    obj.hide().show();
    ok($('#btn').offset().top > obj.root().offset().top, "dropmenu的位置当前在button位置上方.");

    $('#btn').css({
        top: '50%',
        bottom: 'auto'
    });
    obj.hide().show();
    ok($('#btn').offset().top < obj.root().offset().top, "dropmenu的位置当前在button位置下方.");

    obj.destroy();
    start();
});

test("参数 － direction", function(){
    expect(2);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            },
            {
                text: 'test2'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();

    var items = $('ul.ui-dropmenu-items li', obj.root()),
        pos1 = items.first().offset(),
        pos2 = items.eq(1).offset();

    ok(pos1.left == pos2.left && pos1.top != pos2.top, "item1, item2默认是垂直排列的");

    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            },
            {
                text: 'test2'
            }
        ],
        container: '#container',
        btn: '#btn',
        direction: 'horizontal'
    }).show();

    items = $('ul.ui-dropmenu-items li', obj.root());
    pos1 = items.first().offset();
    pos2 = items.eq(1).offset();

    //lili 此处样式不对
    ok(pos1.left != pos2.left && pos1.top == pos2.top, "item1, item2被设置成是水平排列的");
    obj.destroy();

    start();
});

test("参数 － arrow", function(){
    expect(2);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();

    equals(obj.root().find('.ui-dropmenu-arrow').length, 1, "此dropmenu默认有arrow");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        arrow: false
    }).show();

    equals(obj.root().find('.ui-dropmenu-arrow').length, 0, "此dropmenu被设置成没有arrow");
    obj.destroy();
    start();
});

test("参数 － autoClose", function(){
    expect(6);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();

    ok(obj.data('_isShow'), '当前是显示的');

    ua.click(obj.root().find('ul.ui-dropmenu-items li').get(0));
    ok(obj.data('_isShow'), '点击本身，还应该是显示的');

    ua.click(document.body);
    ok(!obj.data('_isShow'), '点击其他地方，现在是关闭的');

    //lili 为什么用设置负top的方式使之隐藏
    obj.destroy();

    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#container',
        btn: '#btn',
        autoClose: false
    }).show();

    ok(obj.data('_isShow'), '当前是显示的');

    ua.click(obj.root().find('ul.ui-dropmenu-items li').get(0));
    ok(obj.data('_isShow'), '点击本身，还应该是显示的');

    ua.click(document.body);
    ok(obj.data('_isShow'), '点击其他地方，还应该是显示的');

    obj.destroy();
    start();
});

test("参数 － items", function(){
    expect(8);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test1',
                click: function(e){
                    ok(true, 'item1的click触发了')
                }
            },
            {
                icon: 'home'
            },
            {
                text: 'test3',
                icon: 'delete'
            },
            {
                text: 'test4',
                href: 'http://www.baidu.com'
            }
        ],
        container: '#container',
        btn: '#btn'
    }).show();

    var items = obj.root().find('ul.ui-dropmenu-items li');
    equals(items.length, 4, '当前是4个items');
    equals(items.eq(0).find('a').text(), 'test1', 'item1: 文字正确');
    equals(items.eq(1).find('.ui-icon-home').length, 1, 'item2: 有icon');
    equals(items.eq(2).find('.ui-icon-delete').length, 1, 'item3: 有icon');
    equals(items.eq(2).find('a').text(), "test3", 'item3: 且文字正确');
    equals(items.eq(3).find('a').text(), 'test4', 'item4: 文字正确');

    ua.click(items.eq(0).find('a').get(0));

    $('#container').delegate('a', 'click', function(e){
        equals(this.href, "http://www.baidu.com/", "href设置正确");
        e.preventDefault();
    });

    ua.click(items.eq(3).find('a').get(0));

    obj.destroy();
    start();
});

test("参数 － cacheParentOffset", function(){
	//lili 什么场景下会使用此参数
    expect(2);
    stop();
    $('<div id="dropmenuWrap" style="position:relative;"></div>').appendTo('#container');
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#dropmenuWrap',
        btn: '#btn',
        autoClose: true
    }).show();

    var pos1 = obj.root().offset();

    obj.hide();

    $('#dropmenuWrap').css({
        top: 100
    });

    var pos2 = obj.show().root().offset();

    ok(pos1.top != pos2.top, "父级的位置被缓存了, 所以位置不对");

    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        container: '#dropmenuWrap',
        btn: '#btn',
        cacheParentOffset: false
    }).show();

    pos1 = obj.root().offset();

    obj.hide();

    $('#dropmenuWrap').css({
        top: 0
    });

    pos2 = obj.show().root().offset();

    ok(pos1.top == pos2.top, "父级的位置没有被缓存了，位置应该是一致的");

    obj.destroy();

    start();
});

test("参数 － el & container", function(){
    expect(7);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn',
        autoClose: true
    }).show();

    ok(obj.root().is('.ui-dropmenu'), 'el正确');
    ok(obj.root().parent().is('body'), '如果不设置container父级为body');
    obj.destroy();

    $("<div id='test1'></div>").appendTo(document.body);

    obj = $.ui.dropmenu("#test1", {
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn',
        autoClose: true
    }).show();

    ok(obj.root().is('.ui-dropmenu'), 'el正确');
    ok(obj.root().is('#test1'), 'el正确');
    ok(obj.root().parent().is('body'), 'container设置正确');
    obj.destroy();
    start();

    obj = $.ui.dropmenu($("<div class='ui-dropmenu'>"), {
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn',
        autoClose: true,
        container: '#container'
    }).show();

    ok(obj.root().is('.ui-dropmenu'), 'el正确');
    ok(obj.root().parent().is('#container'), 'container设置正确');
    obj.destroy();
    start();
});

test("多实例", function(){
    expect(5);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    $('<a id="btn2">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn',
        autoClose: false,
        container: '#container'
    }), obj2 = $.ui.dropmenu($("<div class='custom'></div>"), {
        items: [
            {
                text: 'test2'
            }
        ],
        btn: '#btn2',
        autoClose: false,
        container: '#container'
    });

    equals(obj.root().attr("class"), 'ui-dropmenu', '样式相互区分');
    equals(obj2.root().attr("class"), 'custom ui-dropmenu', '样式相互区分');

    $('#btn').trigger('click');
    ok(obj.data('_isShow') && !obj2.data('_isShow'), '点击btn，把第一个dropmenu显示出来了');

    $('#btn2').trigger('click');
    ok(obj.data('_isShow') && obj2.data('_isShow'), '点击btn2，把第二个dropmenu也显示出来了');
    //lili 多个dropmenu之间不互斥了么

    $('#btn').trigger('click');
    ok(!obj.data('_isShow') && obj2.data('_isShow'), '点击btn，把第一个dropmenu隐藏了，但第二个dropmenu还是显示的');

    obj.destroy();
    obj2.destroy();

    start();
});

test("显示", function(){
	//lili 脑图中显示部分的功能还在么
 ok(true, "已在 参数 － pos 涉及了！");
});

test("基本操作", function(){
    expect(3);
    stop();
    $('<div id="dropmenuWrap" style="position:relative;"></div>').appendTo('#container');
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn'
    });

    ok(obj.root().offset().top<0, "dropmenu默认不可见");
    $('#btn').trigger('click');
    ok(obj.root().offset().top>0, "点击按钮变成可见");
    $('#btn').trigger('click');
    ok(obj.root().offset().top<0, "再次点击按钮变成不可见");

    obj.destroy();
    start();
});

test("方法 － show&hide&toggle", function(){
    expect(7);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        btn: '#btn',
        autoClose: true,
        container: '#container'
    });

    ok(obj.root().offset().top<0, "dropmenu不可见");
    obj.show();
    ok(obj.root().offset().top>0, "dropmenu可见");
    obj.hide();
    ok(obj.root().offset().top<0, "dropmenu再次不可见");
    obj.toggle();
    ok(obj.root().offset().top>0, "dropmenu再次可见");
    obj.destroy();

    obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        autoClose: true,
        container: '#container'
    });
    ok(obj.root().offset().top<0, "dropmenu不可见");
    obj.show($('#btn'));
    ok(obj.root().offset().top>0, "dropmenu可见");
    ok(obj.data('_btn').filter('#btn').length, '在show的时候传入的btn，被添加到关联里面去了');

    obj.destroy();

    start();
});

test("方法 － bindButton", function(){
    expect(4);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test'
            }
        ],
        autoClose: true,
        container: '#container'
    });

    obj.bindButton($('#btn'));
    ok(obj.data('_btn').filter('#btn').length, "#btn存在于关联中");


    ok(obj.root().offset().top<0, "dropmenu不可见");
    ua.click($('#btn').get(0));
    ok(obj.root().offset().top>0, "dropmenu可见");
    ua.click($('#btn').get(0));
    ok(obj.root().offset().top<0, "dropmenu再次不可见");

    obj.destroy();
    start();
});

test("方法 － destroy",function(){
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
            ]
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

test("事件", function(){
    expect(6);
    stop();
    $('<a id="btn">btn</a>').appendTo('#container');
    var obj = $.ui.dropmenu({
        items: [
            {
                text: 'test1',
                click: function(e){
                    ok(true, 'item1的click触发了');
                }
            },
            {
                text: 'test2',
                click: function(e){
                    ok(true, 'item2的click触发了');
                    e.preventDefault();
                }
            }
        ],
        itemClick: function(e, data, match){
            switch(data.text){
                case 'test1':
                    ok(true, 'item1的itemClick触发了');
                    equals(match.textContent, "test1", "The match is right");
                    break;
                case 'test2':
                    ok(false, 'item2的itemClick不应该被触发，因为在item的click里面已经e.preventDefault了');
                    break;
            }
        },
        init: function(){
            ok(true, 'init触发了');
        },
        destroy: function(){
            ok(true, 'destroy触发了');
        },
        btn: '#btn',
        container: '#container'
    });

    var items = obj.root().find('ul.ui-dropmenu-items li');

    ua.click(items.eq(0).find('a').get(0));
    ua.click(items.eq(1).find('a').get(0));

    obj.destroy();
    start();
});

//lili 还有isScroll这个参数么
//lili 创建模式没有测试