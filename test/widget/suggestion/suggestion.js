module('suggestion', {
    setup: function() { /*创建suggestion的父元素input*/
        $('<input />').attr({
            'id': 'sugg-input',
            'class': 'com-search-input'
        }).appendTo('body');
    },

    teardown: function() {
        $('#sugg-input').remove();

        try {
            window.localStorage['SUG-Sharing-History'] = '';
        } catch (e) {}
    }
});

var states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada'
    ],
    sendrequest = function (e, query, render, cacheData) {
        var listArr = cacheData(query) || [];

        if (listArr.length) {
            render(query, listArr);
        } else {
            $.each(states, function (i, item) {
                ~item.indexOf(query) && listArr.push(item);
            });
            render(query, listArr);
            cacheData(query, listArr);
        }
    },

    renderlist = function (e, data, query, callback) {
        callback(data.map(function (item) {
            return '<div class="sug-item">' + item + '</div>';
        }).join(' '));
    };


test('加载sug样式', function() {
    stop();
    ua.loadcss(["reset.css", "widget/suggestion/suggestion.css", "widget/suggestion/suggestion.default.css", "../test/widget/css/suggestion/suggestion.test.css"], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('默认option及render方式默认创建', function () {
    var sug = gmu.Suggestion({
        el: '#sugg-input'
    }),
        opts = sug._options;

    equal(opts.historyShare, true, 'historyShare参数正确');
    equal(opts.autoClose, false, 'autoClose参数正确');
    equal(opts.confirmClearHistory, true, 'historyShare参数正确');
    equal(sug.key, 'SUG-Sharing-History', 'history key正确');
    equal(sug.separator, encodeURIComponent( ',' ), 'separator正确');

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'render方式下，mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'render方式下，mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'render方式下，content元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'render方式下，clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'render方式下，close btn正确创建');

    sug.destroy();
});

test('show & hide & setup', function () {
    var sug;

    $('#sugg-input').suggestion({
        sendrequest: sendrequest,
        renderlist: renderlist
    });

    sug = $('#sugg-input').suggestion('this');

    $('#sugg-input').val('a').trigger('input');

    equal(sug.isShow, true, 'sug正确打开了');

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'setup方式下，mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'setup方式下，mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'setup方式下，content元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'setup方式下，clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'setup方式下，close btn正确创建');

    $('#sugg-input').val('').trigger('input');

    equal(sug.isShow, false, 'sug正确关闭了');

    sug.destroy();
});

test('多实例', function () {
    expect(6);

    $('<input />').attr({
        'id': 'sugg-input1',
        'class': 'com-search-input'
    }).appendTo('body');

    var sug = new $.ui.Suggestion({
            el: "#sugg-input"
        }),
        sug1 = $('#sugg-input1').suggestion()
            .on('sendrequest', sendrequest)
            .on('renderlist', renderlist)
            .suggestion('this');

    equal($('.ui-suggestion-mask').length, 2, '两个sug mask正确创建');
    equal($('.ui-suggestion').length, 2, '两个sug wrapper正确创建');

    sug1.on('show', function () {
        equal(sug1.isShow, true, 'sug1正确显示');
        equal($('.sug-item').length, 2, 'sug1的item项正确显示');

        equal(sug.isShow, undefined, 'sug处于隐藏状态');
        equal(sug.$content.children().length, 0, 'sug没有显示item项');

        sug.destroy();

        sug1.destroy();
        $('#sugg-input1').off().remove();

        start();
    });

    $('#sugg-input1').val('Ala').trigger('input');
});
test('在已有的suggestion-mask中，不会新建suggestion-mask', function () {

    var sug = new $.ui.Suggestion({
            el: "#sugg-input"
        }),
        sug1 = new $.ui.Suggestion({
            el: "#sugg-input"
        });

    equal($('.ui-suggestion-mask').length, 1, '1个sug mask正确创建');

});
test("autoClose = true", function () {
    expect(2);

    var sugg = $.ui.Suggestion({
        el: "#sugg-input",
        autoClose: true,
        sendrequest: sendrequest,
        renderlist: renderlist
    });

    sugg.on("show", function () {
        equal(sugg.isShow, true, 'focus后，sug显示出来了');

        sugg.on("hide", function () {
            equal(sugg.isShow, false, "点击document，显示的sug关闭了");

            sugg.destroy();
        });

        ta.tap(document);
    });

    $('#sugg-input').val('a').focus();
});

test("autoClose = false", function () {
    expect(2);

    var sugg = $.ui.Suggestion({
        el: "#sugg-input",
        sendrequest: sendrequest,
        renderlist: renderlist
    });

    sugg.on("show", function () {
        equal(sugg.isShow, true, 'focus后，sug显示出来了');

        ta.tap(document);

        equal(sugg.isShow, true, "点击document，显示的sug仍然显示");

        sugg.destroy();
    });

    $('#sugg-input').val('a').focus();
});
test("history() & historyShare = false", function () {
    expect(5);

    var sugg = new $.ui.Suggestion({
            el: "#sugg-input",
            historyShare: false,
            confirmClearHistory: false
        }),
        seperator = encodeURIComponent(','),
        key = $('#sugg-input').attr('id');

    try {
        if (window.localStorage[key]) {
            window.localStorage[key] = ''
        }

        ok(!window.localStorage[key], '该sug的localstorage已初始化');

        sugg.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，并正确存储test');

        sugg.history('我们,是');
        equal(window.localStorage[key], '我们,是' + seperator + 'test', '带,的数据存储正确');

        equal(sugg.history(), '我们,是' + seperator + 'test', 'history数据正确读取');

        sugg.history(null);
        ok(!window.localStorage[key], '历史数据已正确清除');

        sugg.destroy();

    } catch (e) {
    }

});
test("history() & historyShare = false ，el没有id", function () {
    expect(4);
    $('<input />').attr({
        'class': 'com-search-input1'
    }).appendTo('body');

    var sugg = new $.ui.Suggestion({
            el: ".com-search-input1",
            historyShare: false
        });

    var key = sugg.key;
    ok(/ui-suggestion-/.test(key),'检查key');
    try {
        if (window.localStorage[key]) {
            window.localStorage[key] = ''
        }

        ok(!window.localStorage[key], '该sug的localstorage已初始化');

        sugg.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，并正确存储test');

        sugg.history('');
        equal(window.localStorage[key], 'test', '存储内容空，什么也不做，localStorage不变');

        sugg.destroy();

    } catch (e) {
    }

});
test("history() & historyShare = true", function () {
    expect(6);

    $('<input />').attr({
        'id': 'sugg-input1',
        'class': 'com-search-input'
    }).appendTo('body');

    var sugg1 = new $.ui.Suggestion({
            el: "#sugg-input",
            confirmClearHistory: false
        }),
        sugg2 = $('#sugg-input1').suggestion('this'),
        seperator = encodeURIComponent(','),
        key = 'SUG-Sharing-History';

    try {
        if (window.localStorage[key]) {
            delete window.localStorage[key];
        }

        ok(!window.localStorage[key], 'localstorage已初始化');

        sugg1.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，并value值正确存储到sug1中');

        sugg2.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，sugg2中相同value值未存储到history中');

        sugg2.history('我们,是');
        equal(window.localStorage[key], '我们,是' + seperator + 'test', 'sugg2中不同值 value值已存储到history中');

        equal(sugg1.history(), '我们,是' + seperator + 'test', 'sug1 history数据正确读取正确');

        sugg1.history(null);
        equal(window.localStorage[key], '', '共享的历史数据已正确清除');

        sugg1.destroy();
        sugg2.destroy();
        $('#sugg-input1').off().remove();

    } catch (e) {
    }

});

test("history() & historyShare = 'test'", function () {
    expect(6);

    $('<input />').attr({
        'id': 'sugg-input1',
        'class': 'com-search-input'
    }).appendTo('body');

    var sugg1 = new $.ui.Suggestion({
            el: "#sugg-input",
            confirmClearHistory: false,
            historyShare: 'test'
        }),
        sugg2 = $('#sugg-input1').suggestion({
            confirmClearHistory: false,
            historyShare: 'test'
        }).suggestion('this'),
        seperator = encodeURIComponent(','),
        key = 'test-SUG-Sharing-History';

    try {
        if (window.localStorage[key]) {
            delete window.localStorage[key];
        }

        ok(!window.localStorage[key], 'localstorage已初始化');

        sugg1.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，并value值正确存储到sug1中');

        sugg2.history('test');
        equal(window.localStorage[key], 'test', 'history的key正确，sugg2中相同value值未存储到history中');

        sugg2.history('我们,是');
        equal(window.localStorage[key], '我们,是' + seperator + 'test', 'sugg2中不同值 value值已存储到history中');

        equal(sugg1.history(), '我们,是' + seperator + 'test', 'sug1 history数据正确读取正确');

        sugg1.history(null);
        equal(window.localStorage[key], '', '共享的历史数据已正确清除');

        sugg1.destroy();
        sugg2.destroy();
        $('#sugg-input1').off().remove();

    } catch (e) {
    }

});

test("接口：show & hide & value", function () {
    expect(3);

    var sug = $('#sugg-input').suggestion({
        sendrequest: sendrequest,
        renderlist: renderlist
    }).suggestion( 'this' );

    $('#sugg-input').val( 'Ma').trigger('input');

    equal(sug.isShow, true, 'sug正确显示,show方法生效了');

    $('#sugg-input').suggestion( 'hide' );

    equal(sug.isShow, false, 'sug正确关闭, hide方法生效了');

    equal($('#sugg-input').suggestion( 'value' ), 'Ma', 'value方法正确');

    sug.destroy();
});

test("用户传入的sendRequest和renderList能否使sug正常显示", function() {
    var sug = $('#sugg-input').suggestion({
        sendrequest: sendrequest,
        renderlist: renderlist
    }).suggestion( 'this' );

    sug.history('first');
    sug.history('second');
    $('#sugg-input').focus();

    equal(sug.isShow, true, 'query为空时，正确显示历史记录');
    equal(sug.$wrapper.find('.sug-item').length, 2, '历史记录的条数正确');

    $('#sugg-input').val( 'Ma').trigger('input');

    equal(sug.isShow, true, 'input输入时，sug处于显示状态');
    equal(sug.$wrapper.find('.sug-item').length, 3, 'input中历史记录的条数正确');
    equal(sug.$wrapper.find('.sug-item').eq(0).text(), 'Maine', 'item第一项正确');
    equal(sug.$wrapper.find('.sug-item').eq(1).text(), 'Maryland', 'item第二项正确');
    equal(sug.$wrapper.find('.sug-item').eq(2).text(), 'Massachusetts', 'item第三项正确');

    $('#sugg-input').suggestion( 'hide' );

    equal(sug.isShow, false, 'sug正确关闭, hide方法生效了');

    equal($('#sugg-input').suggestion( 'value' ), 'Ma', 'value方法正确');

    sug.destroy();
});

test("缓存数据方法正确", function() {
    expect(7);

    var sug = $('#sugg-input').suggestion({
        sendrequest: function(e, query, render, cache) {
            var listArr = cache(query) || [];

            if (listArr.length) {
                render(query, listArr);
                ok(true, '从缓存中取数据');
            } else {
                $.each(states, function (i, item) {
                    ~item.indexOf(query) && listArr.push(item);
                });
                render(query, listArr);
                cache(query, listArr);
                ok(true, '发送请求函数执行');
            }

        },
        renderlist: renderlist
    }).suggestion( 'this' );

    $('#sugg-input').val( 'A').trigger('input');

    equal(sug.isShow, true, 'input输入时，sug处于显示状态');
    equal(sug.$wrapper.find('.sug-item').length, 4, 'input时数据的条数正确');

    $('#sugg-input').val( 'Ala').trigger('input');
    equal(sug.$wrapper.find('.sug-item').length, 2, 'input时数据的条数正确');

    $('#sugg-input').val( 'A').trigger('input');
    equal(sug.$wrapper.find('.sug-item').length, 4, 'input时数据的条数正确');

    sug.destroy();
});

test("事件：initdom,open,close,show,hide,sendrequest,renderlist", function() {
    expect(10);

    var sug = $('#sugg-input').on('initdom', function () {
        ok(true, 'initdom触发');
    }).suggestion().on(
        'open close show hide sendrequest renderlist'
    ,function(e) {
            switch (e.type) {
                case 'open':
                    // focus执行
                    ok(true, 'open触发');
                    break;
                case 'close':
                    // closeBtn被trigger click时执行
                    ok(true, 'close触发');
                    break;
                case 'show':
                    //input时执行
                    //focus时执行
                    //共执行两次
                    ok(true, 'show触发');
                    break;
                case 'hide':
                    //调用hide时执行
                    //closeBtn被trigger click时执行
                    //共执行两次
                    ok(true, 'hide触发');
                    break;
                case 'sendrequest':
                    //input时执行
                    ok(true, 'sendrequest触发');
                    sendrequest.apply(sug, arguments);

                    break;
                case 'renderlist':
                    //input时执行
                    ok(true, 'renderlist触发');
                    renderlist.apply(sug, arguments);

                    break;
            }
        }).suggestion('this');

    sug.history('first');
    sug.history('second');
    $('#sugg-input').focus();

    sug.hide();

    $('#sugg-input').val( 'Ma').trigger('input');

    sug.$closeBtn.trigger('click');

    sug.destroy();
});

test("清除历史记录与关闭按钮能正确工作", function() {
    expect(5);

    var sug = $('#sugg-input').suggestion({
        sendrequest: sendrequest,
        renderlist: renderlist,
        confirmClearHistory: false
    }).suggestion( 'this' );

    sug.history('first');
    sug.history('second');
    $('#sugg-input').focus();
    equal(sug.isShow, true, 'input输入时，sug处于显示状态');

    ua.click(sug.$clearBtn.get(0));
    equal(sug.isShow, false, '清除历史记录后，sug关闭');
    equal(sug.history(), '', '清除历史记录后，sug历史记录被清空');

    $('#sugg-input').val( 'A').trigger('input');
    equal(sug.isShow, true, 'input输入时，sug处于显示状态');
    ua.click(sug.$closeBtn.get(0));
    equal(sug.isShow, false, '点击关闭按钮后，sug关闭');

    sug.destroy();
});