module('suggestion.plugin.$quickdelete', {
    setup: function() {
        $('<input />').attr({
            'id': 'sugg-input',
            'class': 'com-search-input'
        }).appendTo('body');
    },

    teardown: function() {
        $('#sugg-input').remove();

        try {
            delete window.localStorage['SUG-Sharing-History'];
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
    ua.loadcss(["reset.css", "widget/suggestion/suggestion.css",
        "widget/suggestion/suggestion.default.css",
        "../test/widget/css/suggestion/suggestion.test.css",
        "widget/suggestion/suggestion.quickdelete.css"
    ], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('sug及quickdelete是否正确创建', function () {
    var sug = gmu.Suggestion({
            el: "#sugg-input",
            sendrequest: sendrequest,
            renderlist: renderlist
        });

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'content元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'close btn正确创建');

    equal(sug.$mask.find('.ui-suggestion-quickdel').length, 1, 'quickdelete元素正确创建');
    equal(sug.$mask.find('.ui-suggestion-quickdel').css('visibility'), 'hidden', 'quickdelete元素开始时隐藏');

    sug.destroy();
});

test('quickdelete功能是否正常', function () {
    expect(10);
    stop();

    var sug = gmu.Suggestion({
        el: "#sugg-input",
        sendrequest: sendrequest,
        renderlist: renderlist
    }),
        $input = sug.getEl();


    $input.val('a').focus();
    equal(sug.quickDelShow, true, 'quickdel在focus有字符时直接显示');

    $input.val('ab').trigger('input');
    equal(sug.quickDelShow, true, 'quickdel在input时显示');

    try {
        window.localStorage['SUG-Sharing-History'] = 'Alabama';

        ta.touchstart(sug.$quickDel.get(0),{
            touches:[{
                pageX: 0,
                pageY: 0
            }]
        });

        setTimeout(function() {
            equal(sug.quickDelShow, false, '点击quickdelete后，quickdelete消失');
            equal($input.val(), '', '点击quickdelete后，input值被清除');
            equal(sug.isShow, true, 'input无字符时，history显示');
            equal(sug.$content.find('.sug-item').text(), 'Alabama', '显示的历史记录正确');

            sug.hide();
            $input.val('我们').trigger('input');
            equal(sug.quickDelShow, true, 'quickdel在input时显示');
            $input.val('').trigger('input');
            equal(sug.quickDelShow, false, 'quickdel在input字符删除时消失');
            equal(sug.isShow, true, 'input无字符时，history显示');
            equal(sug.$content.find('.sug-item').length, 1, '显示的历史记录正确');

            sug.destroy();
            start();

        }, 100)

    }catch(e){}
});

