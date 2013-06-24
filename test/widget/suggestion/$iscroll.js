module('suggestion.plugin.$iscroll', {
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
        "widget/suggestion/$iscroll.css"
    ], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('sug及iscroll是否正确创建', function () {

    var sug = gmu.Suggestion({
        container: "#sugg-input",
        sendrequest: sendrequest,
        renderlist: renderlist
    });

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'content元素正确创建');
    equal(sug.$scroller.hasClass('ui-suggestion-scroller'), true, 'scroller元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'close btn正确创建');

    ok(sug.$content.attr('data--iscroll-'), 'iscroll实例正确创建');

    sug.destroy();
});

test('sug中iscroll能正确内滚', function () {
    expect(3);
    stop();

    var sug = gmu.Suggestion({
            container: "#sugg-input",
            sendrequest: sendrequest,
            renderlist: renderlist
        }),
        $input = sug.getEl(),
        top;


    $input.val('a').trigger('input');
    equal(sug.isShow, true, 'sug正确显示');

    top = sug.$content.find('.sug-item').eq(0).offset().top;

    ta.touchstart(sug.$scroller.get(0),{
        touches:[{
            pageX: 0,
            pageY: 0
        }]
    });
    ta.touchmove(sug.$scroller.get(0),{
        touches:[{
            pageX: 0,
            pageY: -10
        }]
    });
    ta.touchend(sug.$scroller.get(0))

    setTimeout(function() {
        equal(sug.$content.find('.sug-item').eq(0).offset().top < top, true, 'sug中iscroll能正常滑动' );

        sug.hide();
        equal(sug.isShow, false, 'sug能正常关闭');

        sug.destroy();
        start();

    }, 600)
});

test('input时，iscroll能滚到最顶部', function () {
    expect(5);
    stop();

    var sug = gmu.Suggestion({
            container: "#sugg-input",
            sendrequest: sendrequest,
            renderlist: renderlist
        }),
        $input = sug.getEl(),
        top;


    $input.val('a').trigger('input');
    equal(sug.isShow, true, 'sug正确显示');

    setTimeout(function() {
        top = sug.$content.find('.sug-item').eq(0).offset().top;
        equal(sug.$content.find('.sug-item').eq(0).text(), 'Alabama', 'sug第一项正确显示');
        equal(sug.$content.find('.sug-item').eq(3).text(), 'Arkansas', 'sug第四项正确显示');

        $input.val('an').trigger('input');

        setTimeout(function() {
            equal(sug.$content.find('.sug-item').eq(0).text(), 'Arkansas', 'sug第一项内容改变');
            equal(sug.$content.find('.sug-item').eq(0).offset().top, top, 'input输入后，sug滚到最顶部');

            sug.destroy();
            start();
        }, 400);

    }, 400)

});