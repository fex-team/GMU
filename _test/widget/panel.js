module('plugin/widget/panel', {
    setup: function() {
        $("<div id='page' ></div>").appendTo('body');
        $('<div id="panel"></div>').append(
            '<ul>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '<li>目录目录目录</li>' +
                '</ul>'
        ).appendTo('#page');
        $('<div id="contWrap" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page');
        $('body').css('overflow-x', 'hidden');
    },
    teardown : function() {
        $('#page').remove();
    }
});

test("默认options", function(){
	 stop();
	 ua.loadcss(["widget/panel/panel.css","widget/panel/panel.default.css"], function(){
		var panel = $('#panel').panel('this');

	     equals(panel.$contentWrap.attr('id'), "contWrap", "option contentWrap 正确");
         equals(panel._data.scrollMode, "follow", "option scrollMode 正确");
         equals(panel._data.animate, true, "option animate 正确");
         equals(panel._data.display, "push", "option display 正确");
         equals(panel._data.position, "right", "option position 正确");
         equals(panel._data.dismissible, true, "option dismissible 正确");
         equals(panel._data.swipeClose, true, "option swipeClose 正确");
         panel.destroy();
	     start();
	});
});

test("多实例", function(){
    stop();
    $("<div id='page2' ></div>").appendTo('body');
    $('<div id="contWrap2" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page2');
    $('<div id="panel2"></div>').append(
        '<ul>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '</ul>'
    ).appendTo('#page2');

    $('#panel').panel({
        contentWrap: '#contWrap'
    });
    var panel2 = $('#panel2').panel({
        contentWrap: '#contWrap2',
        position: 'left',
        display: 'overlay',
        dismissible: false,
        swipeClose: false,
        animate: false
    }).panel('this');

    equal($('.ui-panel').length, 2, "两个panel创建了");
    equal($('.ui-panel-right').length, 1, "默认右边打开的panel创建成功");
    equal($('.ui-panel-left').length, 1, "position:left的panel创建成功")
    equal(panel2._data.dismissible, false, 'panel2 dismissible正确');
    equal(panel2._data.swipeClose, false, 'panel2 swipeClose正确');
    equal(panel2._data.animate, false, 'panel2 animate正确');
    panel2.open('overlay', 'left');
    setTimeout(function () {
        equal(panel2._data.display, 'overlay', 'panel2 display正确');
        equal(panel2._data.position, 'left', 'panel2 position正确');
        $('#panel').panel('destroy');
        $('#panel2').panel('destroy');
        $('#page2').remove();
        start();
    }, 100);
});

test("接口: open, close, toggle, state", function(){
    stop();
    $('#panel').panel({
        contentWrap: '#contWrap'
    });
    var width1 = $('#panel').width();

    //多次调用open close，有transform动画，故延迟
    setTimeout(function () {
        equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "初始化：transform值正确");
        equal($('#panel').hasClass('ui-panel-right'), true, "初始化：ui-panel-right值正确");

        $('#panel').panel('open');
        setTimeout(function () {
            equal($('#panel').hasClass('ui-panel-push'), true, "open后：ui-panel-push值正确");
            equal($('#panel').hasClass('ui-panel-animate'), true, "open后：ui-panel-animate值正确");
            equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "open后：transform值正确");
            equal($('#panel').panel('state'), true, "open后：state方法正确");

            $('#panel').panel('close');
            setTimeout(function () {
                equal($('#panel').hasClass('ui-panel-push'), true, "close后：ui-panel-push值正确");
                equal($('#panel').hasClass('ui-panel-animate'), true, "close后：ui-panel-animate值正确");
                equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "close后：transform值正确");
                equal($('#panel').panel('state'), false, "open后：state方法正确");

                $('#panel').panel('toggle','overlay', 'left');
                setTimeout(function () {
                    equal($('#panel').hasClass('ui-panel-left'), true, "(overlay,left)toggle后：ui-panel-left值正确");
                    equal($('#panel').hasClass('ui-panel-overlay'), true, "(overlay,left)toggle后：ui-panel-overlay值正确");
                    equal($('#panel').hasClass('ui-panel-animate'), true, "(overlay,left)toggle后：ui-panel-animate值正确");
                    equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "(overlay,left)toggle后：transform值正确");
                    equal($('#panel').panel('state'), true, "open后：state方法正确");

                    $('#panel').panel('toggle');
                    setTimeout(function () {
                        equal($('#panel').hasClass('ui-panel-left'), true, "(overlay,left)toggle后：ui-panel-left值正确");
                        equal($('#panel').hasClass('ui-panel-overlay'), true, "(overlay,left)toggle后：ui-panel-overlay值正确");
                        equal($('#panel').hasClass('ui-panel-animate'), true, "(overlay,left)toggle后：ui-panel-animate值正确");
                        equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + -width1 + 'px, 0px, 0px)', "(overlay,left)toggle后：transform值正确");
                        equal($('#panel').panel('state'), false, "open后：state方法正确");

                        $('#panel').panel('destroy');
                        start();
                    }, 400);
                }, 400);
            }, 400);
        }, 400);
    }, 400);
});

test("事件: beforeopen, open, beforeclose, close", function(){
    stop();
    var count = 0;

    $('#panel').on('beforeopen open beforeclose close', function (e) {
        count++;
        switch(e.type) {
            case 'beforeopen':
                ok(true, 'beforeopen trigger');
                break;
            case 'open':
                ok(true, 'open trigger');
                break;
            case 'beforeclose':
                ok(true, 'beforeclose trigger');
                break;
            case 'close':
                ok(true, 'close trigger');
                break;
        }
    }).panel({
        contentWrap: '#contWrap'
    });;

    setTimeout(function () {
        $('#panel').panel('open', 'reveal', 'left');

        setTimeout(function () {
            $('#panel').panel('close');

            setTimeout(function () {
                $('#panel').panel('open', 'overlay', 'right');

                setTimeout(function () {
                    $('#panel').panel('destroy');
                    start();
                }, 600);

            }, 400);
        }, 400);
    }, 600);
});

test("基本操作：点击页面非panel位置，panel关闭（dismissible）", function(){
    stop();
    $('#panel').panel({
        contentWrap: '#contWrap'
    });
    var width1 = $('#panel').width(),
        $btn = $('<button id="btn"></button> ').appendTo('#contWrap').on('click', function () {
            $('#panel').panel('toggle');
        });

    equal($('.ui-panel-dismiss').length, 1, "dismiss mask存在");
    ua.click($btn[0]);

    setTimeout(function () {
        equal($('#panel').panel('state'), true, '点击不在panel中的按钮后，panel打开');
        equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(0px, 0px, 0px)', "点击不在panel中的按钮后，panel移动距离正确");

        ua.click($btn[0]);
        setTimeout(function () {
            equal($('#panel').panel('state'), false, '点击不在panel中的按钮后，panel正常关闭');
            equal($('#panel').css($.fx.cssPrefix + 'transform'), 'translate3d(' + width1 + 'px, 0px, 0px)', "点击不在panel中的按钮后，panel关闭后移动距离正确");

            ua.click($btn[0]);
            setTimeout(function () {
                equal($('#panel').panel('state'), true, '点击不在panel中的按钮后，panel打开');

                ua.click($('.ui-panel-dismiss')[0]);
                setTimeout(function () {
                    equal($('#panel').panel('state'), false, '点击dismiss mask后，panel正常关闭');
                    $('#panel').panel('destroy');
                    start();
                }, 400);
            }, 400);
        }, 400);
    }, 400);
});

test("基本操作：panel上面左/右滑动可正常关闭panel（swipeClose）", function(){
    stop();
    $('#panel').panel({
        contentWrap: '#contWrap'
    });

    $('#panel').panel('open', 'overlay', 'left');
    setTimeout(function () {
        equal($('#panel').panel('state'), true, 'panel已经打开');
        ta.touchstart($('#panel')[0], {
            touches:[{
                pageX: 100,
                pageY: 0
            }]
        });
        ta.touchmove($('#panel')[0], {
            touches:[{
                pageX: 50,
                pageY: 0
            }]
        });
        ta.touchend($('#panel')[0]);

        setTimeout(function () {
            equal($('#panel').panel('state'), false, '向左滑动后panel关闭');
            $('#panel').panel('destroy');
            start();
        }, 400);
    }, 400);
});

test("基本操作：页面滚动过程的，panel的三种模式正常（scrollMode）", function(){
    stop();
    $("<div id='page2' ></div>").appendTo('body');
    $('<div id="contWrap2" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page2');
    $('<div id="panel2"></div>').append(
        '<ul>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '</ul>'
    ).appendTo('#page2');

    $("<div id='page3' ></div>").appendTo('body');
    $('<div id="contWrap3" style="height:1000px; width: 100%;">这是panel相对的内容</div>').appendTo('#page3');
    $('<div id="panel3"></div>').append(
        '<ul>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '<li>目录目录目录</li>' +
            '</ul>'
    ).appendTo('#page3');

    $('#panel').panel({
        contentWrap: '#contWrap',
        animate: false
    }).panel('open');

    setTimeout(function () {
        window.scrollTo(0, 100);

        setTimeout(function () {
            equal($('#panel').panel('state'), true, 'follow模式：滚动过程中panel未消失');
            $('#panel').panel('destroy');
            $('#page').remove();

            $('#panel2').panel({
                contentWrap: '#contWrap2',
                scrollMode: 'hide'
            }).panel('open', 'reveal', 'left');

            setTimeout(function () {
                window.scrollTo(0, 200);

                setTimeout(function () {
                    equal($('#panel2').panel('state'), false, 'hide模式：滚动过程中panel隐藏');
                    $('#panel2').panel('destroy');
                    $('#page2').remove();

                    $('#panel3').panel({
                        contentWrap: '#contWrap3',
                        scrollMode: 'fix'
                    }).panel('open', 'overlay', 'right');

                    setTimeout(function () {
                        window.scrollTo(0, 300);

                        setTimeout(function () {
                            equal($('#panel3').panel('state'), true, 'fix模式：滚动过程中panel未隐藏');
                            equal($('#panel3').css('position'), 'fixed', 'fix模式：滚动过程中panel是fix的');
                            $('#panel3').panel('destroy');
                            window.scrollTo(0, 0);
                            $('#page3').remove();
                            start();
                        }, 100);
                    }, 400);
                }, 100);
            }, 400);
        }, 100);
    }, 400);
});