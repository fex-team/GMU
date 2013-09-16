module('suggestion.option.compatdata', {
    setup: function() {
        $('<input />').attr({
            'id': 'sugg-input',
            'class': 'com-search-input'
        }).appendTo($('<form id="sug-form" action="http://www.baidu.com/s" method="get"></form>').appendTo('body'));
    },

    teardown: function() {
        $('#sug-form').remove();

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
    ua.loadcss(["reset.css", "widget/suggestion/suggestion.css", "widget/suggestion/suggestion.default.css", "../test/widget/css/suggestion/suggestion.test.css"], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('默认options及sug能正常创建', function () {
    var sug = gmu.Suggestion({
            el: "#sugg-input",
            sendrequest: sendrequest
        }),
        opts = sug._options;

    equal(sug.$mask.hasClass('ui-suggestion-mask'), true, 'mask元素正确创建');
    equal(sug.$wrapper.hasClass('ui-suggestion'), true, 'mask元素正确创建');
    equal(sug.$content.hasClass('ui-suggestion-content'), true, 'content元素正确创建');
    equal(sug.$clearBtn.hasClass('ui-suggestion-clear'), true, 'clear btn正确创建');
    equal(sug.$closeBtn.hasClass('ui-suggestion-close'), true, 'close btn正确创建');

    equal(opts.compatdata, true, 'compatData参数正确');

    sug.destroy();
});

test('以","分隔的历史数据能正常被读存', function () {
    var key = 'SUG-Sharing-History',
        history = 'a,b,test,中国,gmu',
        sug;

    try {
        window.localStorage.clear();

        window.localStorage[key] = history;

        sug = gmu.Suggestion({
            el: '#sugg-input'
        });

        equal(sug.history(), history.split(',').join( sug.separator ), '历史数据能正常读取');

        sug.history('newquery');

        equal(sug.history(), ('newquery,' + history).split(',').join(sug.separator), '历史数据转换后能正常存入');

    } catch(e){}

    sug.destroy();
});

test('历史数据被处理后，能正常渲染', function () {
    var key = 'SUG-Sharing-History',
        history = 'a,b,test,中国,gmu',
        sug;

    try {
        window.localStorage.clear();

        window.localStorage[key] = history;

        sug = gmu.Suggestion({
            el: '#sugg-input',
            sendrequest: sendrequest,
            renderlist: renderlist
        });

        $('#sugg-input').focus();

        equal(sug.isShow, true, 'focus后sug正常显示');
        equal(sug.$content.find('.sug-item').length, 5, '老的历史记录正常显示');
        equal(sug.$content.find('.sug-item').eq(0).text(), 'a', '老的历史记录第一项正常');
        equal(sug.$content.find('.sug-item').eq(1).text(), 'b', '老的历史记录第二项正常');
        equal(sug.$content.find('.sug-item').eq(2).text(), 'test', '老的历史记录第三项正常');
        equal(sug.$content.find('.sug-item').eq(3).text(), '中国', '老的历史记录第四项正常');
        equal(sug.$content.find('.sug-item').eq(4).text(), 'gmu', '老的历史记录第五项正常');

    } catch(e){}

    sug.destroy();
});

