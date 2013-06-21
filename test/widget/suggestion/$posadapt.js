module('suggestion.plugin.$posadapt', {
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
        "../test/widget/css/suggestion/suggestion.test.css"
    ], function() {
        ok( 1, 'suggestion css 正确加载' );
        start();
    });
});

test('增加posadapt插件后，sug是否正确创建', function () {
    var sug = gmu.Suggestion({
        container: "#sugg-input",
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

test('下边位置足够时，sug在下边显示', function () {
    expect(10);
    stop();

    var sug = gmu.Suggestion({
            container: "#sugg-input",
            sendrequest: sendrequest,
            renderlist: renderlist
        }),
        $input = sug.getEl(),
        sugHeight,
        bottom;

    $input.val('a').focus();
    equal(sug.isShow, true, 'sug正常显示');

    sugHeight = sug.$wrapper.height();
    bottom;
});



/*
module('plugin/widget/suggestion', {
    setup: function() { */
/*创建suggestion的父元素input*//*

        input = document.createElement('input');
        document.body.appendChild(input);
        $(input).attr("id", "sugg-input");
        $(input).attr("class", "com-search-input");
        te.dom.push(input);
    }
});

test('posAdapt=false(window resize)', function() {
    expect(2);
    stop();
    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css", "widget/suggestion/suggestion.css"], function() {
            $(f).css("position", "fixed").css("left", 0).css("top", 0).css("height", 700).css("width", 600);
            div1 = w.document.createElement('div');
            w.document.body.appendChild(div1);
            w.$(div1).css("position", "absolute").css('left', 0).css('top', 300);
            input1 = w.document.createElement('input');
            w.$(input1).attr("id", "sugg-input1");
            div1.appendChild(input1);
            var sugg = w.$.ui.suggestion({
                container: "#sugg-input1",
                source: upath + "data/suggestion-custom.php",
                posAdapt: false,
                listCount: 5,
                offset: {
                    x: 10,
                    y: 10
                }
            });

            sugg.on("show", function() {
                setTimeout(function() {
                    equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top + w.$(input1).offset().height + 10, "在input之下显示正确");
                    $(f).css("height", 400);
                    setTimeout(function() {
                        equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top + w.$(input1).offset().height + 10, "在input之下显示正确");
                        sugg.destroy();
                        w.$("#sugg-input").remove();
                        me.finish();
                    }, 350);
                }, 350);
            });
            input1.value = "1";
            w.$(input1).focus();
        }, w);
    });
})

test('posAdapt=false(window resize)', function() {
    expect(2);
    stop();
    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css", "widget/suggestion/suggestion.css"], function() {
            $(f).css("position", "fixed").css("left", 0).css("top", 0).css("height", 700).css("width", 600);
            div1 = w.document.createElement('div');
            w.document.body.appendChild(div1);
            w.$(div1).css("position", "absolute").css('left', 0).css('top', 300);
            input1 = w.document.createElement('input');
            w.$(input1).attr("id", "sugg-input1");
            div1.appendChild(input1);
            var sugg = w.$.ui.suggestion({
                container: "#sugg-input1",
                source: upath + "data/suggestion-custom.php",
                posAdapt: false,
                listCount: 5,
                offset: {
                    x: 10,
                    y: 10
                }
            });

            sugg.on("show", function() {
                setTimeout(function() {
                    equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top + w.$(input1).offset().height + 10, "在input之下显示正确");
                    $(f).css("height", 400);
                    setTimeout(function() {
                        equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top + w.$(input1).offset().height + 10, "在input之下显示正确");
                        sugg.destroy();
                        w.$("#sugg-input").remove();
                        me.finish();
                    }, 350);
                }, 350);
            });
            input1.value = "1";
            w.$(input1).focus();
        }, w);
    });
})

test('posAdapt=true(window resize)', function() {
    expect(2);
    stop();
    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css", "widget/suggestion/suggestion.css"], function() {
            $(f).css("position", "fixed").css("left", 0).css("top", 0).css("height", 700).css("width", 600);
            div1 = w.document.createElement('div');
            w.document.body.appendChild(div1);
            w.$(div1).css("position", "absolute").css('left', 0).css('top', 300);
            input1 = w.document.createElement('input');
            w.$(input1).attr("id", "sugg-input1");
            div1.appendChild(input1);
            var sugg = w.$.ui.suggestion({
                container: "#sugg-input1",
                source: upath + "data/suggestion-custom.php",
                posAdapt: true,
                listCount: 5,
                offset: {
                    x: 10,
                    y: 10
                }
            });
            sugg.on("show", function() {
                setTimeout(function() {
                    equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top + w.$(input1).offset().height + 10, "在input之下显示正确");
                    $(f).css("height", 400);
                    setTimeout(function() {
                        equals(sugg._data.wrapper.offset().top, w.$(input1).offset().top - sugg._data.wrapper.offset().height - 10, "在input之上显示正确");
                        sugg.destroy();
                        w.$("#sugg-input").remove();
                        me.finish();
                    }, 350);
                }, 350);
            });
            input1.value = "1";
            w.$(input1).focus();
        }, w);
    });
})

test('posAdapt=false(create)', function() {
    expect(2);
    stop();
    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss(["reset.css", "widget/suggestion/suggestion.css"], function() {
            $(f).css("position", "fixed").css("left", 0).css("top", 0).css("height", 400).css("width", 600);
            inputq = w.document.createElement('input');
            w.$(inputq).attr("id", "sugg-input1");
            w.document.body.appendChild(inputq);

            var sugg = w.$.ui.suggestion({
                container: "#sugg-input1",
                source: upath + "data/suggestion-custom.php",
                posAdapt: false,
                listCount: 5,
                offset: {
                    x: 10,
                    y: 10
                }
            });
            sugg.on("show", function() {
                setTimeout(function() {
                    equals(sugg._data.wrapper.offset().top, w.$(inputq).offset().top + w.$(inputq).offset().height + 10, "在input之下显示正确");
                    sugg.destroy();

                    divp = w.document.createElement('div');
                    w.$(divp).css("position", "absolute").css('left', 0).css('top', 300);
                    inputp = w.document.createElement('input');
                    w.$(inputp).attr("id", "sugg-input2");
                    divp.appendChild(inputp);
                    w.document.body.appendChild(divp);
                    var sugg1 = w.$.ui.suggestion({
                        container: "#sugg-input2",
                        source: upath + "data/suggestion-custom.php",
                        posAdapt: false,
                        listCount: 5,
                        offset: {
                            x: 10,
                            y: 10
                        }
                    });
                    sugg1.on("show", function() {
                        setTimeout(function() {
                            equals(sugg1._data.wrapper.offset().top, w.$(inputp).offset().top + w.$(inputp).offset().height + 10, "在input之上显示正确");
                            sugg1.destroy();
                            w.$("#sugg-input").remove();
                            me.finish();
                        }, 350);
                    });
                    inputp.value = "1";
                    w.$(inputp).focus();
                }, 350);
            });
            inputq.value = "1";
            w.$(inputq).focus();
        }, w);
    });
});

test('posAdapt=true(create)', function() {
    $(input).remove();
    expect(3);
    stop();
    ua.frameExt(function(w, f) {
        var me = this;
        ua.loadcss([ "reset.css", "widget/suggestion/suggestion.css"], function() {
            $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height", 400).css("width", 400);
            inputq = w.document.createElement('input');
            w.$(inputq).attr("id", "sugg-input1");
            w.document.body.appendChild(inputq);
            var sugg = w.$.ui.suggestion({
                container: "#sugg-input1",
                source: upath + "data/suggestion-custom.php",
                posAdapt: true,
                listCount: 5,
                offset: {
                    x: 10,
                    y: 10
                }
            });
            sugg.on("show", function() {
                setTimeout(function() {
                    ok(ua.isShown(sugg._data.wrapper.get(0)),"The suggestion show") ;
                    equals(sugg._data.wrapper.offset().top, w.$(inputq).offset().top + w.$(inputq).offset().height + 10, "在input之下显示正确");
                    sugg.destroy();
                    divp = w.document.createElement('div');
                    w.$(divp).css("position", "absolute").css('left', 0).css('top', 350);
                    inputp = w.document.createElement('input');
                    w.$(inputp).attr("id", "sugg-input2");
                    divp.appendChild(inputp);
                    w.document.body.appendChild(divp);
                    var sugg1 = w.$.ui.suggestion({
                        container: "#sugg-input2",
                        source: upath + "data/suggestion-custom.php",
                        posAdapt: true,
                        listCount: 5,
                        offset: {
                            x: 10,
                            y: 10
                        }
                    });
                    sugg1.on("show", function() {
                        setTimeout(function() {
                            equals(sugg1._data.wrapper.offset().top, w.$("#sugg-input2").offset().top - sugg1._data.wrapper.offset().height - 10, "在input之上显示正确");
                            sugg1.destroy();
                            w.$("#sugg-input").remove();
                            me.finish();
                        }, 350);
                    });
                    inputp.value = "1";
                    w.$(inputp).focus();
                }, 350);
            });
            inputq.value = "1";
            w.$(inputq).focus();
        }, w);
    });
});*/
