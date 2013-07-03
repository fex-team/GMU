module('suggestion.plugin.$posadapt', {
    setup: function() {
        $('<input />').attr({
            'id': 'sugg-input',
            'class': 'com-search-input'
        }).appendTo('body');
    },

    teardown: function() {
        $('#sugg-input').remove();
        $('#pos-wrapper').remove();

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
        "../test/widget/css/suggestion/suggestion.test.css"
    ], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('增加posadapt插件后，sug是否正确创建', function () {
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

    sug.destroy();
});

test('posAdapt=true, 创建时sug位置显示正确', function() {
    expect(8);
    stop();

    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css",
            "widget/suggestion/suggestion.css",
            "widget/suggestion/suggestion.default.css"
        ], function() {
            w.$(f).css({
                position: 'absolute',
                left: 0,
                top: 0,
                height: 400,
                width: 400
            });
            w.$('<input />').attr({
                'id': 'sugg-iframe',
                'class': 'com-search-input'
            }).appendTo(w.$('<div id="pos-wrapper"></div>').css({
               position: 'relative',
               top: 350
            }).appendTo(w.document.body));

            var opts = new w.Object();

            $.extend( opts, {
                el: "#sugg-iframe",
                sendrequest: sendrequest,
                renderlist: renderlist,
                listSelector: '.sug-item'
            });

            var sug = w.gmu.Suggestion(opts);

            sug.on('show', function () {
                equal(sug.isShow, true, 'sug正确显示了');
                equal(sug.$wrapper.css('top'), (-sug.$wrapper.height()-sug.wrapperTop) + 'px', 'wrapper位置正确适应了');
                equal(sug.$wrapper.children().eq(0).hasClass('ui-suggestion-button'), true, 'sug的btn操作按钮已正确调整位置');
                equal(sug.$content.find('.sug-item').length, 4, 'sug的item项正确');

                equal(sug.$content.find('.sug-item').eq(0).text(), 'Arkansas', 'sug的item中第一项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(1).text(), 'Arizona', 'sug的item中第二项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(2).text(), 'Alaska', 'sug的item中第三项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(3).text(), 'Alabama', 'sug的item中第四项位置正调确调整');

                sug.destroy();
                w.$("#sugg-iframe").remove();

                me.finish();
            });

            w.$("#sugg-iframe").val('A').trigger('input');
        });
    });

});

test('posAdapt=true, 创建时sug位置显示正确', function() {
    expect(8);
    stop();

    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css",
            "widget/suggestion/suggestion.css",
            "widget/suggestion/suggestion.default.css"
        ], function() {
            w.$(f).css({
                position: 'absolute',
                left: 0,
                top: 0,
                height: 400,
                width: 400
            });
            w.$('<input />').attr({
                'id': 'sugg-iframe',
                'class': 'com-search-input'
            }).appendTo(w.$('<div id="pos-wrapper"></div>').css({
                    position: 'relative',
                    top: 350
                }).appendTo(w.document.body));

            var opts = new w.Object();

            $.extend( opts, {
                el: "#sugg-iframe",
                sendrequest: sendrequest,
                renderlist: renderlist,
                listSelector: '.sug-item',
                posadapt: false
            });

            var sug = w.gmu.Suggestion(opts);

            sug.on('show', function () {
                equal(sug.isShow, true, 'sug正确显示了');
                equal(sug.$wrapper.css('top'), (w.$('#sugg-iframe').height()+sug.wrapperTop) + 'px', 'wrapper位置正确适应了');
                equal(sug.$wrapper.children().eq(0).hasClass('ui-suggestion-button'), false, 'sug的btn操作按钮未调整位置');
                equal(sug.$content.find('.sug-item').length, 4, 'sug的item项正确');

                equal(sug.$content.find('.sug-item').eq(0).text(), 'Alabama', 'sug的item中第一项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(1).text(), 'Alaska', 'sug的item中第二项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(2).text(), 'Arizona', 'sug的item中第三项位置正调确调整');
                equal(sug.$content.find('.sug-item').eq(3).text(), 'Arkansas', 'sug的item中第四项位置正调确调整');

                sug.destroy();
                w.$("#sugg-iframe").remove();

                me.finish();
            });

            w.$("#sugg-iframe").val('A').trigger('input');
        });
    });
});
