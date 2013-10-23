module('GMU Toolbar', {
	setup: function() {
		$container = $('<div id="J_container"></div>').appendTo(document.body);
	},
	teardown: function() {
		$container.remove();
	}
});

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

test('默认配置项', function(){
    expect(15);
    stop();
    ua.loadcss(["widget/toolbar/toolbar.css","widget/toolbar/toolbar.default.css"], function() {
        var toolbar = gmu.Toolbar();
        equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
        equals(toolbar._options.container, document.body, "toolbar默认配置容器为body");
        ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认配置没有按钮");
        equals(toolbar._options.fixed, false, "toolbar默认配置位置不固定");

        equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
        equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
        equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
        equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
        equals(toolbar.$el.find(".ui-toolbar-title").text(), "标题", "toolbar标题为'标题'");
        ok(toolbar.$el.find(".ui-toolbar-left").children().length === 0 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 0 , "Toolbar 没有按钮");

        // 检查DOM结构
        var toolbarWrap = $(toolbar.$el.children()[0]);
        ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
        ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
        ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
        ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
        ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

        toolbar.destroy();
        start();
    });
});

test('自定义配置项', function(){
    expect(16);

    var toolbar = gmu.Toolbar({
        container: $('#J_container'),
        title: '百度首页',
        leftBtns: ['<span class="btn_1">返回</span>'],
        rightBtns: ['<span class="btn_1">百科</span>', '<span class="btn_1">知道</span>'],
        fix: false
    });
    equals(toolbar._options.title, "百度首页", "toolbar标题自定义为'百度首页'");
    ok(toolbar._options.container[0].id === $('#J_container')[0].id, "toolbar自定义容器为J_container");
    ok(toolbar._options.leftBtns.length === 1 && toolbar._options.rightBtns.length === 2, "Toolbar 自定义按钮个数正确");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
});

test('自定义配置项el为selector', function(){
    expect(16);

    $('<div id="J_toolbar"></div>').appendTo(document.body);

    var toolbar = gmu.Toolbar( '#J_toolbar', {
        container: $('#J_container'),
        title: '百度首页',
        leftBtns: ['<span class="btn_1">返回</span>'],
        rightBtns: ['<span class="btn_1">百科</span>', '<span class="btn_1">知道</span>'],
        fix: false
    } );

    equals(toolbar._options.title, "百度首页", "toolbar标题自定义为'百度首页'");
    ok(toolbar._options.container[0].id === $('#J_container')[0].id, "toolbar自定义容器为J_container");
    ok(toolbar._options.leftBtns.length === 1 && toolbar._options.rightBtns.length === 2, "Toolbar 自定义按钮个数正确");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('自定义配置项el为zepto对象', function(){
    expect(16);

    var toolbar = gmu.Toolbar( $('<div id="J_toolbar"></div>'), {
        container: $('#J_container'),
        title: '百度首页',
        leftBtns: ['<span class="btn_1">返回</span>'],
        rightBtns: ['<span class="btn_1">百科</span>', '<span class="btn_1">知道</span>'],
        fix: false
    } );

    equals(toolbar._options.title, "百度首页", "toolbar标题自定义为'百度首页'");
    ok(toolbar._options.container[0].id === $('#J_container')[0].id, "toolbar自定义容器为J_container");
    ok(toolbar._options.leftBtns.length === 1 && toolbar._options.rightBtns.length === 2, "Toolbar 自定义按钮个数正确");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
    $('#J_toolbar').remove();
});


//只有PC和ios5以上支持fix，某些版本的UC上UA中的Android后面不带版本号，导致zepto的$.os.phone判断出错
if((!$.os.phone && !$.os.tablet)||($.os.ios && parseFloat($.os.version) > 5)){
    test('fix参数', function(){
        stop();

        $('<div id="J_container"><p>占位</p></div>').insertBefore($($(document.body).children()[0]));
        toolbar = gmu.Toolbar({
            container: '#J_container',
            fixed: true});
        var tmp = $('<div style="height:5000px;"></div>').appendTo(document.body);

        var currentOffsetTop = ~~toolbar.$el.offset().top;
        window.scrollTo(0, currentOffsetTop + 21);
        setTimeout(function(){
            approximateEqual(toolbar.$el.offset().top, currentOffsetTop + 21, '页面滚动后，toolbar位置正常');

            toolbar.destroy();
            tmp.remove();
            $('#J_container').remove();
            start();
        }, 10);
    });
}

test('setup模式1', function(){
    expect(17);

    $('<div id="J_toolbar">' +
        '<a href="../">返回</a>' +
        '<h3>百度首页</h3>' +
        '<span class="btn_1">百科</span>' +
        '<span class="btn_1">知道</span></div>').appendTo(document.body);
    var toolbar = gmu.Toolbar('#J_toolbar');

    equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
    ok(toolbar._options.container === document.body, "toolbar默认配置容器为body");
    ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认按钮个数为0");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('zeptolize方式初始化1', function(){
    expect(17);

    $('<div id="J_toolbar">' +
        '<a href="../">返回</a>' +
        '<h3>百度首页</h3>' +
        '<span class="btn_1">百科</span>' +
        '<span class="btn_1">知道</span></div>').appendTo(document.body);

    $('#J_toolbar').toolbar();
    var toolbar = $('#J_toolbar').toolbar('this');

    equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
    ok(toolbar._options.container === document.body, "toolbar默认配置容器为body");
    ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认按钮个数为0");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('setup模式2', function(){
    expect(17);

    $('<div id="J_toolbar"><div class="ui-toolbar-wrap"><div class="ui-toolbar-left">' +
            '<a href="../">返回</a>' +
        '</div>' +
        '<h3 class="ui-toolbar-title">百度首页</h3>' +
        '<div class="ui-toolbar-right">' +
            '<span class="btn_1">百科</span>' +
            '<span class="btn_1">知道</span></div></div></div>').appendTo(document.body);
    var toolbar = gmu.Toolbar('#J_toolbar');

    equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
    ok(toolbar._options.container === document.body, "toolbar默认配置容器为body");
    ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认按钮个数为0");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('zeptolize方式初始化2', function(){
    expect(17);

    $('<div id="J_toolbar"><div class="ui-toolbar-wrap"><div class="ui-toolbar-left">' +
            '<a href="../">返回</a>' +
        '</div>' +
        '<h3 class="ui-toolbar-title">百度首页</h3>' +
        '<div class="ui-toolbar-right">' +
            '<span class="btn_1">百科</span>' +
            '<span class="btn_1">知道</span></div></div></div>').appendTo(document.body);

    $('#J_toolbar').toolbar();
    var toolbar = $('#J_toolbar').toolbar('this');
    
    equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
    ok(toolbar._options.container === document.body, "toolbar默认配置容器为body");
    ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认按钮个数为0");
    equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    // 检查DOM结构
    var toolbarWrap = $(toolbar.$el.children()[0]);
    ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
    ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
    ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
    ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
    ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

    $('#J_toolbar').toolbar('destroy');
    $('#J_toolbar').remove();
});

test('Button实例作为按钮', function(){
    expect(17);

    stop();
    ua.importsrc('widget/button/button', function(){
        var toolbar = gmu.Toolbar( $('<div id="J_toolbar"></div>'), {
            title: '百度首页',
            leftBtns: ['<span class="btn_1">返回</span>'],
            rightBtns: ['<span class="btn_1">百科</span>', new gmu.Button({
                                                                    label: 'button按钮'
                                                                })]
        } );

        equals(toolbar._options.title, "百度首页", "toolbar标题自定义为'百度首页'");
        ok(toolbar._options.container === document.body, "toolbar自定义容器为J_container");
        ok(toolbar._options.leftBtns.length === 1 && toolbar._options.rightBtns.length === 2, "Toolbar 自定义按钮个数正确");
        equals(toolbar._options.fixed, false, "toolbar自定义位置不固定");

        equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
        equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
        equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
        equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
        equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
        equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
        ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
        ok(toolbar.$el.find(".ui-toolbar-right").children().length === 2 &&
           toolbar.$el.find(".ui-toolbar-right").children()[1].tagName === 'SPAN' , "Button实例作为toolbar按钮正确");

        // 检查DOM结构
        var toolbarWrap = $(toolbar.$el.children()[0]);
        ok( toolbarWrap.hasClass('ui-toolbar-wrap'), 'toolbar-wrap检查正确' );
        ok( toolbarWrap.children().length === 3, 'toolbarWrap子节点个数检查正确' );
        ok( $(toolbarWrap.children()[0]).hasClass('ui-toolbar-left'), 'toolbar左侧按钮容器检查正确' );
        ok( $(toolbarWrap.children()[1]).hasClass('ui-toolbar-title'), 'toolbar标题检查正确' );
        ok( $(toolbarWrap.children()[2]).hasClass('ui-toolbar-right'), 'toolbar右侧按钮容器检查正确' );

        toolbar.destroy();
        start();
    }, 'gmu.Button');
});

test('show hide toggle方法', function(){
    expect(5);

    var toolbar = gmu.Toolbar();
    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    toolbar.hide();
    equals(toolbar.$el.css("display"), "none", "hide方法调用正常");
    toolbar.show();
    equals(toolbar.$el.css("display"), "block", "show方法调用正常");
    toolbar.toggle();
    equals(toolbar.$el.css("display"), "none", "toggle方法调用正常");
    toolbar.toggle();
    equals(toolbar.$el.css("display"), "block", "toggle方法调用正常");

    toolbar.destroy();
});

test('addBtns方法', function(){
    expect(5);

    var toolbar = gmu.Toolbar();
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 0 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 0 , "Toolbar 按钮个数正确，当前为0");

    toolbar.addBtns('left', ['<span class="btn_1">新闻</span>']);
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 0 , "Toolbar 左侧添加一个按钮，按钮个数正确，当前为1");

    toolbar.addBtns('left', ['<span class="btn_1">地图</span>']);
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 2 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 0 , "Toolbar 左侧添加一个按钮，按钮个数正确，当前为2");

    toolbar.addBtns('right', ['<span class="btn_1">百科</span>']);
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 2 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 1 , "Toolbar 右侧添加一个按钮，按钮个数正确，当前为3");

    // 不传position，认为在右侧添加按钮
    toolbar.addBtns([new gmu.Button({
                                                label: 'button按钮',
                                                container: '#btsn_create'
                                            })]);
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 2 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 右侧添加一个按钮，按钮个数正确，当前为4");

    toolbar.destroy();
});

test('show hide自定义事件', function(){
    expect(5);

    var toolbar = gmu.Toolbar();
    toolbar.on('show', function(){
        equals(toolbar.$el.css("display"), "block", "show事件正常触发");
    });
    toolbar.on('hide', function(){
        equals(toolbar.$el.css("display"), "none", "hide事件正常触发");
    });

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    toolbar.hide();
    toolbar.show();    
    toolbar.toggle();
    toolbar.toggle();

    toolbar.destroy();
});

test('destroy', function(){
    expect(8);

    // render模式的destroy
    var toolbar = gmu.Toolbar();

    ok($('.ui-toolbar').length === 1, 'render模式创建Toolbar后，toolbar已存在在DOM中');
    toolbar.destroy();
    ok($('.ui-toolbar').length === 0, 'render模式创建Toolbar，destroy后，toolbar已移除');

    // setup模式的destroy
    $('<div id="J_toolbar">' +
        '<a href="../">返回</a>' +
        '<h3>百度首页</h3>' +
        '<span class="btn_1">百科</span>' +
        '<span class="btn_1">知道</span></div>').appendTo(document.body);

    $('#J_toolbar').toolbar();
    var toolbar = $('#J_toolbar').toolbar('this');

    ok($('#J_toolbar').length === 1, 'setup模式创建Toolbar后，toolbar已存在在DOM中');
    toolbar.destroy();
    ok($('.ui-toolbar').length === 1, 'setup模式创建Toolbar，destroy后，toolbar元素仍存在在DOM中');
    $('#J_toolbar').remove();

    // fix状态的destroy
    $('<div id="J_toolbar">' +
        '<a href="../">返回</a>' +
        '<h3>百度首页</h3>' +
        '<span class="btn_1">百科</span>' +
        '<span class="btn_1">知道</span></div>').appendTo(document.body);

    $('#J_toolbar').toolbar({fixed: true});
    var toolbar = $('#J_toolbar').toolbar('this');
    ok($('.ui-toolbar').length === 2, 'fix状态，toolbar被复制出一份');
    toolbar.destroy();
    ok($('.ui-toolbar').length === 1, 'destroy后，复制出的toolbar被清除，原有的保留');
    equals($('.ui-toolbar').css('position'), 'static', 'destroy后，toolbar定位方式改成static');
    equals($('.ui-toolbar').css('top'), 'auto', 'destroy后，toolbar top改成auto');

    $('#J_toolbar').remove();
});
