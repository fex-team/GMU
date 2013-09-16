module('suggestion.option.sendrequest', {
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

var renderlist = function (e, data, query, callback) {
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

test('默认options及sendrequest功能是否可用', function () {
    stop();

    var sug = gmu.Suggestion({
            el: "#sugg-input",
            source: upath + "../data/suggestion.php",
            renderlist: renderlist
        }),
        opts = sug._options;

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'content元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'close btn正确创建');
    equal(opts.isCache, true, 'historyShare参数正确');
    equal(opts.queryKey, 'wd', 'autoClose参数正确');
    equal(opts.cbKey, 'cb', 'historyShare参数正确');
    equal(opts.sendrequest, null, 'sendrequest参数正确');

    $('#sugg-input').val( '19' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$wrapper.find('.sug-item').length, 8, 'sendrequest请求的数据正确');
        equal(sug.$wrapper.find('.sug-item').eq(0).text(), '192.168.1.1', 'sendrequest请求的数据中第一项正确');
        equal(sug.$wrapper.find('.sug-item').eq(2).text(), '19岁的纯情', 'sendrequest请求的数据中第三项正确');
        equal(sug.$wrapper.find('.sug-item').eq(7).text(), '1988年', 'sendrequest请求的数据中最后一项正确');

        sug.destroy();
        start();
    }, 400)

});

test('参数param,queryKey,cbKey是否起作用', function () {
    expect(3);
    stop();

    var sug = $('#sugg-input').suggestion({
        source: upath + "../data/suggestion-other.php?",
        param: 'param=1',
        queryKey: 'word',
        cbKey: 'cbtest',
        renderlist: renderlist
    }).suggestion( 'this' );

    sug.on( 'show', function () {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$wrapper.find('.sug-item').length, 1, 'sendrequest请求的数据量正确');
        equal(sug.$wrapper.find('.sug-item').eq(0).text(), 'param1', '参数param,queryKey,cbKey起作用了');

        sug.destroy();
        start();
    } );

    $('#sugg-input').val( '1' ).trigger( 'input' );
});

test("isCache = true", function() {
    expect(11);
    stop();

    var sug = new $.ui.Suggestion({
        el: "#sugg-input",
        source: upath + "../data/suggestion.php",
        renderlist: renderlist
    });

    $('#sugg-input').val( '1' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$wrapper.find('.sug-item').length, 9, 'query为1的数据请求正确');
        equal(sug.$wrapper.find('.sug-item').eq(1).text(), '163邮箱', 'query为1的数据中第二项正确');
        equal(sug.cacheData['1'].length, 9, 'query为1请求的数据正确被cache');

        $('#sugg-input').val( '19' ).trigger( 'input' );

        setTimeout(function() {
            equal(sug.$wrapper.find('.sug-item').length, 8, 'query为19的数据请求正确');
            equal(sug.$wrapper.find('.sug-item').eq(1).text(), '1912年', 'query为19的数据中第二项正确');
            equal(sug.cacheData['19'].length, 8, 'query为19请求的数据正确被cache');

            $('#sugg-input').val( '1' ).trigger( 'input' );

            setTimeout(function() {
                equal(sug.cacheData['19'].length, 8, 'query为19请求的数据cache正确');
                equal(sug.cacheData['1'].length, 9, 'query为1请求的数据cache正确');
                equal(sug.$wrapper.find('.sug-item').length, 9, 'cacheData对象的数据正确');
                equal(sug.$wrapper.find('.sug-item').eq(1).text(), '163邮箱', 'cacheData被正确渲染');

                sug.destroy();
                start();

            }, 400)

        }, 400)

    }, 400);
});
test("isCache = false", function() {
    expect(7);
    stop();

    var sug = new $.ui.Suggestion({
        el: "#sugg-input",
        source: upath + "../data/suggestion.php",
        renderlist: renderlist,
        isCache: false
    });

    $('#sugg-input').val( '1' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$wrapper.find('.sug-item').length, 9, 'query为1的数据请求正确');
        equal(sug.$wrapper.find('.sug-item').eq(1).text(), '163邮箱', 'query为1的数据中第二项正确');
        equal(sug.cacheData, undefined, '数据未被缓存');

        $('#sugg-input').val( '19' ).trigger( 'input' );

        setTimeout(function() {
            equal(sug.$wrapper.find('.sug-item').length, 8, 'query为19的数据请求正确');
            equal(sug.$wrapper.find('.sug-item').eq(1).text(), '1912年', 'query为19的数据中第二项正确');
            equal(sug.cacheData, undefined, '数据未被缓存');

            sug.destroy();
            start();

        }, 400)

    }, 400);
});
