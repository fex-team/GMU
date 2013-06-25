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
    expect(10);
    stop();
    ua.loadcss(["widget/toolbar/toolbar.css","widget/toolbar/toolbar.default.css"], function() {
        var toolbar = gmu.Toolbar();
        equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
        equals(toolbar._options.container, document.body, "toolbar默认配置容器为body");
        ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认配置没有按钮");
        equals(toolbar._options.fix, false, "toolbar默认配置位置不固定");

        equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
        equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
        equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
        equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
        equals(toolbar.$el.find(".ui-toolbar-title").text(), "标题", "toolbar标题为'标题'");
        ok(toolbar.$el.find(".ui-toolbar-left").children().length === 0 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 0 , "Toolbar 没有按钮");

        toolbar.destroy();
        start();
    });
});

test('自定义配置项', function(){
    expect(11);

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
    equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    toolbar.destroy();
});

test('自定义配置项el为selector', function(){
    expect(11);

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
    equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('自定义配置项el为zepto对象', function(){
    expect(11);

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
    equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('setup模式1', function(){
    expect(12);

    $('<div id="J_toolbar">' +
        '<a href="../">返回</a>' +
        '<h3>百度首页</h3>' +
        '<span class="btn_1">百科</span>' +
        '<span class="btn_1">知道</span></div>').appendTo(document.body);
    var toolbar = gmu.Toolbar('#J_toolbar');

    equals(toolbar._options.title, "标题", "toolbar标题默认配置为'标题'");
    ok(toolbar._options.container === document.body, "toolbar默认配置容器为body");
    ok(toolbar._options.leftBtns.length === 0 && toolbar._options.rightBtns.length === 0, "Toolbar 默认按钮个数为0");
    equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('setup模式2', function(){
    expect(12);

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
    equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

    equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
    equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
    equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
    equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
    equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
    equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
    ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
       toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");
    ok(toolbar.$el.find(".ui-toolbar-left").children()[0].innerHTML === '返回', "Toolbar 左侧按钮文案正确");

    toolbar.destroy();
    $('#J_toolbar').remove();
});

test('Button实例作为按钮', function(){
    expect(11);

    stop();
    ua.importsrc('widget/button/button', function(){
        var toolbar = gmu.Toolbar( $('<div id="J_toolbar"></div>'), {
            container: $('#J_container'),
            title: '百度首页',
            leftBtns: ['<span class="btn_1">返回</span>'],
            rightBtns: ['<span class="btn_1">百科</span>', new gmu.Button({
                                                                    label: 'button按钮',
                                                                    container: '#btsn_create'
                                                                })]
        } );

        equals(toolbar._options.title, "百度首页", "toolbar标题自定义为'百度首页'");
        ok(toolbar._options.container[0].id === $('#J_container')[0].id, "toolbar自定义容器为J_container");
        ok(toolbar._options.leftBtns.length === 1 && toolbar._options.rightBtns.length === 2, "Toolbar 自定义按钮个数正确");
        equals(toolbar._options.fix, false, "toolbar自定义位置不固定");

        equals(toolbar.$el.css("display"), "block", "toolbar显示正常");
        equals(toolbar.$el.attr("class"), "ui-toolbar", "class检查正常");
        equals(toolbar.$el.attr("id"), "J_toolbar", "toolbar el检查正常");
        equals(toolbar.$el.offset().width, $("body").offset().width, "toolbar宽度正常");
        equals(toolbar.$el.offset().height, tablet ? 50 : 42, "toolbar高度正常");
        equals(toolbar.$el.find(".ui-toolbar-title").text(), "百度首页", "toolbar标题为'百度首页'");
        ok(toolbar.$el.find(".ui-toolbar-left").children().length === 1 &&
           toolbar.$el.find(".ui-toolbar-right").children().length === 2 , "Toolbar 按钮个数正确");

        toolbar.destroy();
        $('#J_toolbar').remove();
        start();
    }, 'gmu.Button');
});

// 检查toolbar-wrap元素
// 检查zeptolize方式初始化
// 检查按钮为button实例
// 检查fix

