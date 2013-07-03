module('suggestion.option.renderlist', {
    setup: function() {
        $('<input />').attr({
            'id': 'sugg-input',
            'class': 'com-search-input'
        }).appendTo($('<form id="sug-form" action="http://www.baidu.com/s" method="get"></form>').appendTo('body'));
    },

    teardown: function() {
        $('#sug-form').remove();

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
    };

test('加载sug样式', function() {
    stop();
    ua.loadcss(["reset.css", "widget/suggestion/suggestion.css", "widget/suggestion/suggestion.default.css", "../test/widget/css/suggestion/suggestion.test.css"], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('默认options及renderlist功能是否可用', function () {
    stop();

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

    equal(opts.listCount, 5, 'listCount参数正确');
    equal(opts.usePlus, false, 'usePlus参数正确');
    equal(opts.renderList, null, 'renderList参数正确');
    equal(opts.isHistory, true, 'isHistory参数正确');

    $('#sugg-input').val( 'Al' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$content.find('li').length, 2, 'renderlist起作用了');
        equal(sug.$content.find('li').eq(0).html(), '<span>Al</span>abama', 'renderlist中第一项正确');
        equal(sug.$content.find('li').eq(1).html(), '<span>Al</span>aska', 'renderlist中第二项正确');

        sug.destroy();
        start();
    }, 400)
});

test('参数usePlus,listCount,form能正确起作用', function () {
    expect(5);
    stop();

    $('<form id="sug-form2" action="http://www.baidu.com/s?form=2" method="get"></form>').appendTo('body');

    var sug = gmu.Suggestion({
        el: '#sugg-input',
        form: '#sug-form2',
        usePlus: true,
        listCount: 6,
        sendrequest: sendrequest
    });

    sug.on( 'show', function () {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$content.find('li').length, 6, 'listCount起作用了');
        equal(sug.$content.find('li').eq(0).html(), '<span>M</span>aine<div class="ui-suggestion-plus" data-item="Maine"></div>', 'renderlist中第一项正确,usePlus起作用了');
        equal(sug.$content.find('li').eq(5).html(), '<span>M</span>ississippi<div class="ui-suggestion-plus" data-item="Mississippi"></div>', 'renderlist中最后-项正确,,usePlus起作用了');
        equal(sug.$form.attr('id'), 'sug-form2', 'form参数起作用了');

        sug.destroy();
        $('#sug-form2').off().remove();
        start();
    } );

    $('#sugg-input').val( 'M' ).trigger( 'input' );
});

test("isHistory = true", function() {
    expect(6);
    stop();

    var sug = gmu.Suggestion({
        el: "#sugg-input",
        sendrequest: sendrequest
        }).on('submit', function(e) {
            try {
                !count && equal(window.localStorage[key], 'Alabama', '第一次点击后history被正确存储');
                count === 1 && equal(window.localStorage[key], 'Alaska' + sug.separator +'Alabama', '第二次点击后history被正确存储');
                count++;
                e.preventDefault();
            }catch(e){}
        }),
        key = 'SUG-Sharing-History',
        count = 0;

    $('#sugg-input').val( 'Al' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$content.find('li').length, 2, 'renderlist起作用了');
        equal(sug.$content.find('li').eq(0).html(), '<span>Al</span>abama', 'renderlist中第一项正确');
        equal(sug.$content.find('li').eq(1).html(), '<span>Al</span>aska', 'renderlist中第二项正确');

        // 第一次点击
        ta.tap(sug.$content.find('li').get(0));

        setTimeout(function() {
            // 第二次点击
            ta.tap(sug.$content.find('li').get(1));

            setTimeout(function() {
                sug.destroy();
                start();
            }, 400);

        }, 400);

    }, 400)
});

test("isHistory = false", function() {
    expect(6);
    stop();

    var sug = gmu.Suggestion({
            el: "#sugg-input",
            sendrequest: sendrequest,
            isHistory: false
        }).on('submit', function(e) {
            try {
                !count && equal(window.localStorage[key], '', '第一次点击后history没有被存储');
                count === 1 && equal(window.localStorage[key], '', '第二次点击后history没有被存储');
                count++;
                e.preventDefault();
            }catch(e){}
        }),
        key = 'SUG-Sharing-History',
        count = 0;

    $('#sugg-input').val( 'Al' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        equal(sug.$content.find('li').length, 2, 'renderlist起作用了');
        equal(sug.$content.find('li').eq(0).html(), '<span>Al</span>abama', 'renderlist中第一项正确');
        equal(sug.$content.find('li').eq(1).html(), '<span>Al</span>aska', 'renderlist中第二项正确');

        // 第一次点击
        ta.tap(sug.$content.find('li').get(0));

        setTimeout(function() {
            // 第二次点击
            ta.tap(sug.$content.find('li').get(1));

            setTimeout(function() {
                sug.destroy();
                start();
            }, 400);

        }, 400);

    }, 400)
});

test('事件:select,submit', function() {
    expect(8);
    stop();

    var sug = gmu.Suggestion({
            el: "#sugg-input",
            sendrequest: sendrequest
        }),
        count = 0;

    $("#sugg-input").on('select', function(e, $elem) {
        !count && equal($elem.text(), 'Alabama', 'select事件被触发了, elem正确');
        count++ && equal($elem.text(), 'Alaska', 'select事件被触发了, elem正确');
        count++;
    }).on('submit', function(e) {
        ok(true, 'submit触发了');
        e.preventDefault();
     });

    $('#sugg-input').val( 'Al' ).trigger( 'input' );

    setTimeout(function() {
        equal(sug.isShow, true, 'sug正确显示了');
        // 第一次点击
        ta.tap(sug.$content.find('li').get(0));

        setTimeout(function() {
            equal(sug.isShow, false, 'sug正确关闭了');

            $('#sugg-input').val( 'Al' ).trigger( 'input' );
            equal(sug.isShow, true, 'sug正确显示了');

            // 第二次点击
            ta.tap(sug.$content.find('li').get(1));

            setTimeout(function() {
                equal(sug.isShow, false, 'sug正确关闭了');

                sug.destroy();
                start();
            }, 400);

        }, 400);

    }, 400)
});

test("防止xss脚本注入", function() {
    expect(2);
    stop();

    var sug = $('#sugg-input').suggestion({
        sendrequest: sendrequest
    }).suggestion('this'),
        key = 'SUG-Sharing-History';

    sug.on('submit', function(e) {
        e.preventDefault();
    }).on("show", function() {
        ok(true, 'sug正确显示了');
        ta.tap(sug.$content.find('li').get(0));
    }).on("hide", function() {
        ok(true, "sug隐藏了，脚本没有被执行");
    });

    window.localStorage[key] = "<script>alert();</script>";
    $('#sugg-input').focus();

    setTimeout(function() {
        $('#sugg-input').val( '<script>alert(1);</script>');

        sug.$form.submit();

        setTimeout(function() {
            sug.destroy();
            start();
        }, 400);

    }, 400);
});

test("input上框操作", function() {
    stop();

    var sug = $('#sugg-input').suggestion({
            sendrequest: sendrequest,
            listCount: 50
        }).suggestion('this');

    sug.on('submit', function(e) {
        e.preventDefault();
    });

    $('#sugg-input').val('M').trigger('input');
    equal(sug.isShow, true, 'sug正确显示了');
    equal(sug.$content.find('li').length, 8, 'M对应的item返回正确渲染');

    $('#sugg-input').val('Mi').trigger('input');
    equal(sug.isShow, true, 'sug正确显示了');
    equal(sug.$content.find('li').length, 4, 'Mi对应的item返回正确渲染');

    $('#sugg-input').val('Mis').trigger('input');
    equal(sug.isShow, true, 'sug正确显示了');
    equal(sug.$content.find('li').length, 2, 'Mis对应的item返回正确渲染');

    $('#sugg-input').val('Misa').trigger('input');
    equal(sug.isShow, false, 'sug正确隐藏了');
    equal(sug.$content.find('li').length, 2, 'Misa无返回数据项');
    equal(sug.$content.find('li').eq(0).text(), 'Mississippi', 'renderlist中第一项正确');
    equal(sug.$content.find('li').eq(1).text(), 'Missouri', 'renderlist中第二项正确');

    $('#sugg-input').val('Mi').trigger('input');
    equal(sug.isShow, true, 'sug正确显示了');
    equal(sug.$content.find('li').length, 4, 'Mi对应的item返回正确渲染');

    ta.tap(sug.$content.find('li').get(0));

    setTimeout(function() {
        equal(sug.value(), 'Michigan', 'item项正确上框');
        equal(sug.isShow, false, 'sug正确隐藏了');

        sug.destroy();
        start();
    }, 400)

});
test('点击“+”,词条上框', function () {
    stop();
    expect(3);
    var sug = gmu.Suggestion({
            el: "#sugg-input",
            sendrequest: sendrequest,
            usePlus:true
        });

    $('#sugg-input').val( 'Al' ).trigger( 'input' );
    equal(sug.isShow, true, 'sug正确显示了');
    equal(sug.$content.find('div.ui-suggestion-plus').length, 2, 'plus显示');

    ta.tap(sug.$content.find('div.ui-suggestion-plus').get(0));
    setTimeout(function() {

        equal(sug.value(), 'Alabama', '点击加号，item项正确上框');
        start();
    }, 400)
});
