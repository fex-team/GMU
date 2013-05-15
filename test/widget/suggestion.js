module('plugin/widget/suggestion', {
    setup: function() { /*创建suggestion的父元素input*/
        input = document.createElement('input');
        document.body.appendChild(input);
        $(input).attr("id", "sugg-input");
        $(input).attr("class", "com-search-input");
        te.dom.push(input);
    }
});

var pad = window.screen.width >= 768 && window.screen.width <= 1024;

test('默认参数 & container & source & events', function() {
    stop();
    expect(37);
    ua.loadcss(["reset.css", "widget/suggestion/suggestion.css", "widget/suggestion/suggestion.default.css", "../test/widget/css/suggestion/suggestion.test.css"], function() {
        var sugg = $.ui.suggestion({
            container: "#sugg-input",
            source: upath + "data/suggestion.php",
            init: function() {
                ok(true, "The init is right");
            },
            submit:function(){}
        });
        equal(sugg._data.container, "#sugg-input", "The container is #sugg-input");
        equal(sugg._data.source, upath + "data/suggestion.php", "The source is right");
        equal(sugg._data.param, undefined, "The default param is ''");
        equal(sugg._data.posAdapt, undefined, "The default posAdapt is false");
        equal(sugg._data.listCount, 50, "The default listCount is 5");
        equal(sugg._data.isCache, true, "The default isCache is true");
        equal(sugg._data.isStorage, true, "The default isStorage is true")
        equal(sugg._data.isSharing, undefined, "The default isSharing is false")
        equal(sugg._data.width, null, "The default width is undefined");
        equal(sugg._data.height, undefined, "The default height is 66");
        equal(sugg._data.sendRequest, undefined, "The default sendRequest is undefiend");
        equal(sugg._data.confirmClearHistory, true, "The default confirmClearHistory is true");
        equal(sugg._data.minChars, 0, "The default minChars is 0");
        equal(sugg._data.maxChars, 1000, "The default maxChars is 1000");
        equal(sugg._data.offset.x, 0, "The default offset x is 0");
        equal(sugg._data.offset.y, 0, "The default offset y is 0");
        equal(sugg._data.offset.w, 0, "The default offset w is 0");
        equal(sugg._el.attr("id"), "sugg-input", "The default input is right");
        equal(sugg._data.maskElem.attr("class"), "ui-input-mask", "The default maskElem is right");

        sugg.on("show", function() {
            setTimeout(function() {
                equal(sugg._data.wrapper.attr("class"), "ui-suggestion", "The class is right");
                equal(sugg._data.wrapper.parent().attr("class"), "ui-input-mask", "The parent is right");
                equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
                equal(sugg._data.wrapper.find("ul li").length, 9, "The items count");
                equal(sugg._data.wrapper.find("ul li")[0].firstChild.innerHTML, "<span>1</span>92.168.1.1", "第1个提示");
                equal(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "第2个提示");
                equal(sugg._data.wrapper.find("ul li")[2].firstChild.innerHTML, "<span>1</span>15网盘", "第3个提示");
                equal(sugg._data.wrapper.find("ul li")[3].firstChild.innerHTML, "<span>1</span>0+10", "第4个提示");
                equal(sugg._data.wrapper.find("ul li")[4].firstChild.innerHTML, "<span>1</span>1对战平台", "第5个提示");
                equal(sugg._data.wrapper.offset().width, $(input).parent().offset().width, "The width is same as input");
                equal(sugg._data.wrapper.offset().left, $(input).parent().offset().left, "The left is same as input");
                equal(sugg._data.wrapper.offset().top, $(input).offset().top + $(input).offset().height, "The top is right");
                approximateEqual(sugg._data.wrapper.offset().height,
		                (pad ? 40 : 33)+66+3, "The height is right");
                equal(sugg._data.wrapper.find(".ui-suggestion-content").height(), 66, "The content height is right");
                equal(sugg._data.wrapper.find(".ui-suggestion-button").height(),
		                (pad ? 40 : 33)+1, "The button height is right");//根据屏幕宽度获取的button高度值(border)
                approximateEqual(sugg._data.wrapper.find(".ui-suggestion-content .ui-suggestion-scroller").height(), 2, $(".ui-suggestion-content ul li").height() * 9, "The scroller height is right");
                ta.tap(sugg._data.wrapper.find("ul li")[1].firstChild);
            }, 100);
        });
        sugg.on("hide", function() {
            setTimeout(function() {
                equal(sugg._data.wrapper.css("display"), "none", "The suggestion hides");
                sugg.destroy();
                start();
            }, 200);
        });
        input.value = "1";
        $(input).focus();
    });
});

test('param', function() {
    stop();
    expect(3);
    var sugg = $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        param: "param=1"
    });
    sugg.on("show", function() {
        setTimeout(function() {
            ok(ua.isShown(sugg._data.wrapper.get(0)),"The suggestion shows");
            equal(sugg._data.wrapper.find("li").length, 1, "The items count");
            ok(sugg._data.wrapper.find("li").eq(0).html().match(/<span>1<\/span>/),"第1个提示");
            sugg.destroy();
            start();
        }, 100);
    });
    input.value = "1";
    $(input).focus();
});

test('useIscroll=true && height', function() {
    stop();
    expect(4);
    var sugg = $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        height: 300
    });
    sugg.on("show", function() {
        setTimeout(function() {
        	equals(sugg._data.wrapper.find(".ui-suggestion-content").css("overflow"), "hidden", "The iscroll is created");
            approximateEqual(sugg._data.wrapper.offset().height, 300+3+(pad ? 40 : 33), "The height is right");
            equal(sugg._data.wrapper.find(".ui-suggestion-content").height(), 300, "The content height is right");
            approximateEqual(sugg._data.wrapper.find(".ui-suggestion-content .ui-suggestion-scroller").height(), $(".ui-suggestion-content ul li").height() * 9, 2, "The scroller height is right");

            sugg.destroy();
            start();
        }, 100);
    });
    input.value = "1";
    $(input).focus();
});

test('useIscroll=false', function() {
    stop();
    expect(3);
    var sugg = $.ui.suggestion({
    	useIscroll: false,
        container: "#sugg-input",
        source: upath + "data/suggestion.php"
    });
    sugg.on("show", function() {
        setTimeout(function() {
        	equals(sugg._data.wrapper.find(".ui-suggestion-content").css("overflow"), "visible", "The iscroll is not created");
            approximateEqual(sugg._data.wrapper.find(".ui-suggestion-content").height(), $(".ui-suggestion-content ul li").height() * 9, 2, "The scroller height is right");
            approximateEqual(sugg._data.wrapper.find(".ui-suggestion-content .ui-suggestion-scroller").height(), $(".ui-suggestion-content ul li").height() * 9, 2, "The scroller height is right");

            sugg.destroy();
            start();
        }, 100);
    });
    input.value = "1";
    $(input).focus();
});

test('width', function() {
    stop();
    expect(5);
    var sugg = $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        width: 300
    });
    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            equal(sugg._data.wrapper.offset().width, 300, "The width is same as input");
            equal(sugg._data.wrapper.offset().left, $(input).offset().left, "The left is right");
            equal(sugg._data.wrapper.offset().top, $(input).offset().top + $(input).offset().height, "The top is same as input");
            approximateEqual(sugg._data.wrapper.offset().height,
		            pad ? 109 : 102, "The height is right");
            sugg.destroy();
            start();
        }, 100);
    });
    input.value = "1";
    $(input).focus();
});

test('offset', function() {
    stop();
    expect(5);
    var sugg = $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        width: 300,
        height: 99,
        offset: {
            x: 10,
            y: 20
        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            equal(sugg._data.wrapper.offset().width, 300, "The width is same as input");
            equal(sugg._data.wrapper.offset().left, $(input).offset().left + 10, "The left is right");
            equal(sugg._data.wrapper.offset().top, $(input).offset().top + $(input).offset().height + 20, "The top is same as input");
            approximateEqual(sugg._data.wrapper.offset().height, 99+3+
		            (pad ? 40 : 33) , "The height is right");
            sugg.destroy();
            start();
        }, 100);
    });
    input.value = "1";
    $(input).focus();
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
});

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


test('renderList & renderEvent', function() {
    expect(6);
    stop();
    var c = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        renderList: function(query, data) {
            var sugs = data.s;
            var list = [];
            $.each(sugs, function(index, item) {
                list.push(item.replace(query, "<span style='color:#ff0000'>" + query + "</span>"));
            });
            return list.join('');
        },
        renderEvent: function() {
            ok(true, "The renderEvent called");
        }
    });

    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            equal(sugg._data.wrapper.find(".ui-suggestion-scroller span").length, 9, "显示 9 个选项");
            equal(sugg._data.wrapper.offset().left, $(input).offset().left, "The left is same as input");
            equal(sugg._data.wrapper.offset().top, $(input).offset().top + $(input).offset().height, "The top is same as input");
            equal(sugg._data.wrapper.offset().width, $(input).parent().offset().width, "The width is same as input");
            sugg.destroy();
            start();
        }, 350);
    });
    input.value = "1";
    $(input).focus();
});


test("sendRequest", function() {
    expect(2);
    stop();
    var data1 = {
        '1': {
            s: ["111", "222", "333", "444", "555"]
        },
        '2': {
            s: ["2111", "2222", "2333", "2444", "2555"]
        }
    };
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion-costom.php",
        sendRequest: function(query, fun) {
            data = data1[query];
            fun(data);
        },
        show: function() {
            equal(sugg._data.wrapper.find("li")[0].firstChild.innerHTML, "<span>1</span>11", "The sendRequest is right");
            equal(sugg._data.wrapper.find("li").length, 5, "The listCount is right");
            setTimeout(function() {
                sugg.destroy();
                start();
            }, 0);
        }
    });
    $(input).attr("value", "1");
    $(input).focus();
});

test('listCount', function() {
    expect(6);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        listCount: 3
    });

    equal(sugg._data.listCount, 3, "The listCount is 3");

    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows"); /*除去3个suggestion，还有一个清除历史记录的选项*/
            equal(sugg._data.wrapper.find("ul li").length, 3, "显示 4 个选项");
            equal(sugg._data.wrapper.find("ul li")[0].firstChild.innerHTML, "<span>1</span>92.168.1.1", "The items are right");
            equal(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "The items are right");
            equal(sugg._data.wrapper.find("ul li")[2].firstChild.innerHTML, "<span>1</span>15网盘", "The items are right");
            sugg.destroy();
            start();
        }, 100);
    });

    input.value = "1";
    $(input).focus();
});

test('介于min/maxChars之间', function() {
    expect(1);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        minChars: 2,
        maxChars: 3,
        width: $(".com-search-input").offset().width
    });

    sugg.on("show", function() {
        setTimeout(function() {
           equal(sugg._data.wrapper.find("ul li").length, 8, "显示 8 个选项");
           sugg.destroy();
           start();
        }, 100);
    });
    input.value = "19";
    $(input).focus();
});


test('小于minChars', function() {
    expect(0);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        minChars: 2,
        maxChars: 3,
        width: $(".com-search-input").offset().width
    });

    input.value = "1";
    $(input).focus();
    setTimeout(function() {
        equal(sugg._data.wrapper.css("display"), "none", "The suggestion hides");
        sugg.destroy();
        start();
    }, 500);
});

test('大于maxChars', function() {
    expect(0);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        minChars: 2,
        maxChars: 3,
        width: $(".com-search-input").offset().width
    });
    input.value = "1925";
    $(input).focus();
    setTimeout(function() {
        equal(sugg._data.wrapper.css("display"), "none", "The suggestion hides");
        sugg.destroy();
        start();
    }, 500);
});

test('多实例', function() {
    stop();
    expect(11);
    var input1 = document.createElement('input');
    document.body.appendChild(input1);
    $(input1).attr("class", "com-sugg-input ");
    $(input1).attr("id", "sugg-input1");

    te.dom.push(input1);
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        listCount: 5,
        offset: {
            x: -1
        }
    });

    sugg.on("show", function() {
        setTimeout(function() {
            equal($(".ui-suggestion ul li")[0].firstChild.innerHTML, "<span>1</span>92.168.1.1", "第1个提示");
            equal($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "第2个提示");
            equal($(".ui-suggestion ul li")[2].firstChild.innerHTML, "<span>1</span>15网盘", "第3个提示");
            equal($(".ui-suggestion ul li")[3].firstChild.innerHTML, "<span>1</span>0+10", "第4个提示");
            equal($(".ui-suggestion ul li")[4].firstChild.innerHTML, "<span>1</span>1对战平台", "第5个提示");
            equal($(".ui-suggestion ul li").length, 5, "显示 5 个选项");
            sugg.destroy();
            var sugg1 = new $.ui.suggestion({
                container: "#sugg-input1",
                listCount: 3,
                source: upath + "data/suggestion-custom.php"
            });
            sugg1.on("show", function() {
                setTimeout(function() {
                    equal(sugg1._data.wrapper.css("display"), "block", "The suggestion shows");
                    equal($(".ui-suggestion ul li").length, 3, "显示 3 个选项");
                    equal($(".ui-suggestion ul li")[0].firstChild.innerHTML, "<span>1</span>0+10", "The items are right");
                    equal($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>1对战平台", "The items are right");
                    equal($(".ui-suggestion ul li")[2].firstChild.innerHTML, "<span>1</span>080p", "The items are right");
                    sugg1.destroy();
                    start();
                }, 100);
            });
            input1.value = "1";
            $(input1).focus();
        }, 100);
    });

    input.value = "1";
    $(input).focus();
});


test("autoClose = true", function() {
    expect(2);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        autoClose: true
    });
    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            ta.tap(document);
        }, 100);
    });

    sugg.on("hide", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "none", "The suggestion hides");
            sugg.destroy();
            start();
        },300);
    });

    input.value = "1";
    $(input).focus();
 });


 test("autoClose = false", function() {
    expect(2);
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php"
    });
    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            ta.tap(document);
            setTimeout(function() {
                equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
                sugg.destroy();
                start();
            }, 250);
        }, 100);
    });
    input.value = "1";
    $(input).focus();
});

test("isCache = true", function() {
    expect(4);
    stop();
    var show = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isCache: true,
        source: upath + "data/suggestion.php"
    });
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "The items are right");
                $(input).blur();
                input.value = "19";
                $(input).focus();
            }
            if(show == 2) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>19</span>12年", "The items are right");
                sugg._data.source = upath + "data/suggestion-other.php";
                $(input).blur();
                input.value = "1";
                $(input).focus();
            }
            if(show == 3) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "The items are right");
                sugg.destroy();
                start();
            }
        }, 100);
    });

    equals(sugg._data.isCache, true, "The isCache is false");

    input.value = "1";
    $(input).focus();
});

test("isCache = false", function() {
    expect(4);
    stop();
    var show = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isCache: false,
        source: upath + "data/suggestion.php"
    });
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "The items are right");
                $(input).blur();
                input.value = "19";
                $(input).focus();
            }
            if(show == 2) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>19</span>12年", "The items are right");
                sugg._data.source = upath + "data/suggestion-other.php",
                $(input).blur();
                input.value = "1";
                $(input).focus();
            }
            if(show == 3) {
                equals($(".ui-suggestion ul li")[1].firstChild.innerHTML, "<span>1</span>1对战平台", "The items are right");
                sugg.destroy();
                start();
            }
        }, 100);
    });
    equals(sugg._data.isCache, false, "The isCache is false");

    input.value = "1";
    $(input).focus();
});

test("isStorage = true, 清除历史记录", function() {
    expect(8);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isStorage: true,
        source: upath + "data/suggestion.php",
        confirmClearHistory: false,
        submit: function() {

        }
    });
    var id = sugg._data.wrapper.attr('id');
    delete window.localStorage[id];
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) ta.tap(sugg._data.wrapper.find("ul li")[1].firstChild);
            if(show == 2) {
                equal(window.localStorage[id], "163邮箱", "存储1个历史记录");
                equals(sugg._data.wrapper.find("ul li").length, 1, "The pick storage shows");
                equals(sugg._data.wrapper.find("ul li")[0].firstChild.innerHTML, "163邮箱", "The pick storage is right");
                equals(sugg._data.wrapper.find(".ui-suggestion-button")[0].children[0].innerHTML, "清除历史记录", "The pick storage is right");
                equals(sugg._data.wrapper.find(".ui-suggestion-button")[0].children[1].innerHTML, "关闭", "The pick storage is right");

                $(input).blur();
                ua.click(sugg._data.wrapper.find(".ui-suggestion-button")[0].children[0]);
            }
        }, 100);
    });

    sugg.on("hide", function() {
        hide++;
        setTimeout(function() {
            if(hide == 1) {
                $(input).blur();
                input.value = "";
                $(input).focus();
            }
            if(hide == 2) {
                equal(window.localStorage[id], "", "历史记录被清除");
                equals(sugg._data.wrapper.css("display"), "none", "The 关闭  is right");
                setTimeout(function() {
                    sugg.destroy();
                    start();
                }, 30);
            }
        }, 200);
    });

    equals(sugg._data.isStorage, true, "The isStorage is true");

    input.value = "1";
    $(input).focus();
});

test("isStorage = false", function() {
    expect(2);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isStorage: false,
        source: upath + "data/suggestion.php",
        submit: function() {

        }
    });
    var id = sugg._data.wrapper.attr('id');
    delete window.localStorage[id];
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) ta.tap(sugg._data.wrapper.find("ul li")[2].firstChild);
            if(show == 2) {
                ok(true); //no localstorage, The assertion shouldn't run
            }
        }, 100);
    })
    sugg.on("hide", function() {
        hide++;
        setTimeout(function() {
            if(hide == 1) {
                $(input).blur();
                $(input).focus();
                input.value = "";
                equals(window.localStorage[id], undefined, "0 localstorage");
                setTimeout(function() {
                    sugg.destroy();
                    start();
                }, 250);
            }
        }, 200);
    });
    equals(sugg._data.isStorage, false, "The isStorage is false");
    input.value = "1";
    $(input).focus();
});

test("isSharing = true", function() {
    expect(5);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isSharing: true,
        source: upath + "data/suggestion.php",
        submit:function(){

        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) ta.tap(sugg._data.wrapper.find("ul li")[0].firstChild);
            if(show == 2) {
                equal(window.localStorage['SUG-Sharing-History'], "192.168.1.1", "存储1个历史记录");
                equals(sugg._data.wrapper.find("ul li").length, 1, "The pick storage shows");
                equals(sugg._data.wrapper.find("ul li")[0].firstChild.innerHTML, "192.168.1.1", "The pick storage is right");
                setTimeout(function() {
                    sugg.destroy();
                    $(input).remove();
                    $("body").append("<input id='sugg-input' class='com-search-input'>");
                    var sugg1 =  new $.ui.suggestion({
                        container: "#sugg-input",
                        isSharing: true,
                        source: upath + "data/suggestion.php",
                        submit:function(){

                        }
                    });
                    $("#sugg-input").focus();
                    setTimeout(function(){
                        equals(sugg1._data.wrapper.find("ul li")[0].firstChild.innerHTML, "192.168.1.1", "The pick storage is right");
                        sugg1.destroy();
                        $("#sugg-input").remove();
                        delete window.localStorage['SUG-Sharing-History'];
                        start();
                    },100);

                }, 30);
            }
        }, 100);
    });
    sugg.on("hide", function() {
        hide++;
        setTimeout(function() {
            if(hide == 1) {
                $(input).blur();
                input.value = "";
                $(input).focus();
            }
        }, 200);
    });
    equals(sugg._data.isSharing, true, "The isSharing is true");
    input.value = "1";
    $(input).focus();
});

test("isSharing = true & shareName", function() {
    expect(5);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isSharing: true,
        shareName: "my",
        source: upath + "data/suggestion.php",
        submit: function() {

        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) ta.tap($(".ui-suggestion ul li")[0].firstChild);
            if(show == 2) {
                equal(window.localStorage['my-SUG-Sharing-History'], "192.168.1.1", "my-SUG-Sharing-History");
                equal(window.localStorage['SUG-Sharing-History'], undefined, "SUG-Sharing-History");
                equals($(".ui-suggestion ul li").length, 1, "The pick storage shows");
                equals($(".ui-suggestion ul li")[0].firstChild.innerHTML, "192.168.1.1", "The pick storage is right");
                setTimeout(function() {
                    delete window.localStorage['my-SUG-Sharing-History'];
                    sugg.destroy();
                    start();
                }, 30);
            }
        }, 100);
    });
    sugg.on("hide", function() {
        hide++;
        setTimeout(function() {
            if(hide == 1) {
                $(input).blur();
                input.value = "";
                $(input).focus();
            }
        }, 200);
    });
    equals(sugg._data.shareName, "my", "The shareName is true");
    input.value = "1";
    $(input).focus();
});

test("status = true", function() {
    expect(1);
    stop();
    var sugg = new $.ui.suggestion({
    	container: "#sugg-input",
        source: upath + "data/suggestion.php",
        submit: function() {
        	
        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
        	ok(true,"The suggestion shows");
        	ua.click(sugg._data.wrapper.find(".ui-suggestion-button")[0].children[1]);
        }, 100);
    });
    sugg.on("close", function() {
    	this.data('status', false);
    	input.value = "1";
        $(input).focus();
        setTimeout(function(){
        	sugg.destroy();
            start();
        }, 410);
    });
    input.value = "1";
    $(input).focus();
});

test("status = false", function() {
    expect(1);
    stop();
    var sugg = new $.ui.suggestion({
    	container: "#sugg-input",
    	status: false,
        source: upath + "data/suggestion.php",
        submit: function() {
        	
        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
        	ok(true,"The suggestion shows");
        }, 100);
    });
    equals(sugg._data.status, false, "The status is true");
    input.value = "1";
    $(input).focus();
    setTimeout(function(){
    	sugg.destroy();
        start();
    }, 200);
});

test("formID", function() {
    expect(2);
    stop();
    var subBtn = $('<input id="input"/>').attr('type', 'submit'),
        form = $('<form id="form"></form>').attr({
        method: 'get',
        action: 'http://www.baidu.com/s'
    }).append(subBtn),
        input = $('#sugg-input');
    var subBtn1 = $('<input id="input1"/>').attr('type', 'submit'),
	    form1 = $('<form id="form1"></form>').attr({
	    method: 'get',
	    action: 'http://www.baidu.com/s'
	}).append(subBtn1).appendTo(document.body);
    input = $('#sugg-input');
    input.attr('name', 'wd').wrapAll(form);
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        formID: "#form1",
        source: upath + "data/suggestion.php"
    });
    form.on('submit', function (e) {
    	equals(window.localStorage[id], undefined, '点击提交按钮不存储历史记录');
        e.preventDefault();
    });
    form1.on('submit', function (e) {
    	equals(window.localStorage[id], 'test', '点击提交按钮存储1个历史记录');
        e.preventDefault();
    });
    var id = sugg._data.wrapper.attr('id');
    delete window.localStorage[id];

    input[0].value = 'test';
    ua.click(subBtn[0]);
    
    ua.click(subBtn1[0]);

    setTimeout(function () {
    	delete window.localStorage[id];
        sugg.destroy();
        form.remove();
        form1.remove();
        start();
    }, 300);
});

test("hide()", function() {
    stop();
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion-custom.php",
        submit: function() {

        }
    });
    input.value = "1";
    $(input).focus();
    sugg.on("show", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "block", "suggestion display is ok");
            sugg.hide();
        }, 100);
    });
    sugg.on("hide", function() {
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "none", "hide()is ok");
            sugg.destroy();
            start();
        }, 200);
    });
});

test("history()", function() {
    expect(4);
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        submit: function() {

        }
    });
    var id = sugg._data.wrapper.attr('id');
    delete window.localStorage[id];
    equal(sugg.history('192.168.1.1'), "192.168.1.1", "存储1个历史记录");
    equal(window.localStorage[id], "192.168.1.1", "存储1个历史记录");
    equals(sugg.history(), "192.168.1.1", "存储1个历史记录");
    sugg.history(null);
    equal(window.localStorage[id], "", "历史记录被删除");
    sugg.destroy();
});

test("focusInput() $ leaveInput()", function() {
    stop();
    expect(2);
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        submit: function() {

        }
    });
    sugg.focusInput();
    equals(document.activeElement.id, "sugg-input", "focusInput() is ok");
    sugg.leaveInput();
    notEqual(document.activeElement.id, "sugg-input", "leaveInput() is ok");
    setTimeout(function() {
        sugg.destroy();
        start();
    }, 250);
});

test("add & delete", function() {
    expect(7);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isStorage: false,
        source: upath + "data/suggestion.php"
    });

    sugg.on("show", function() {
        setTimeout(function() {
            show++;
            if(show == 1) {
                equals(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "The items are right");
                $(input).blur();
                input.value = "19";
                $(input).focus();
            }
            if(show == 2) {
                equals(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>19</span>12年", "The items are right");
                $(input).blur();
                input.value = "199";
                $(input).focus();
            }
            if(show == 3) {
                equals(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>19</span>12年", "The items are right");
                ta.tap(sugg._data.wrapper.find("ul li")[1]);
            }
            if(show == 4) {
                equals(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>19</span>12年", "The items are right");
                $(input).blur();
                input.value = "";
                $(input).focus();
            }
        }, 100);
    });
    sugg.on("hide", function() {
        hide++;
        setTimeout(function() {
            if(hide == 1) {
                equals(sugg._data.wrapper.css("display"), "none", "The suggestion is hide");
                $(input).blur();
                input.value = "19";
                $(input).focus();
            }
            if(hide == 2) {
                equals(sugg._data.wrapper.css("display"), "none", "The suggestion is hide");
                $(input).blur();
                input.value = "19";
                $(input).focus();
            }
            if(hide == 3) {
                equals(sugg._data.wrapper.css("display"), "none", "The suggestion is hide");
                setTimeout(function() {
                    sugg.destroy();
                    start();
                }, 30);
            }
        }, 200);
    });
    
    for(var i in window.localStorage)
    	delete window.localStorage[i];
    input.value = "1";
    $(input).focus();
});

test("关闭", function() {
    expect(1);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        isStorage: false,
        source: upath + "data/suggestion.php"
    });

    sugg.on("show", function() {
        setTimeout(function() {
            ua.click(sugg._data.wrapper.find(".ui-suggestion-button")[0].children[1]);
        }, 100);
    });
    sugg.on("hide", function() {
        setTimeout(function() {
            equals(sugg._data.wrapper.css("display"), "none", "The suggestion is hide");
            sugg.destroy();
            start();
        }, 200);
    });
    input.value = "1";
    $(input).focus();
});

test('setup', function() {
    stop();
    expect(18);
    $("#sugg-input").remove();
    $('<input id="inputId" class="com-search-input" type="text">').appendTo(document.body);
    var sugg = $('#inputId').suggestion({
        source: upath + "data/suggestion.php",
        init: function() {
            ok(true, "The setup is right");
        },
        submit:function(){

        }
    }).suggestion("this");
    sugg.on("show",function(){
        setTimeout(function() {
            equal(sugg._data.wrapper.attr("class"), "ui-suggestion", "The class is right");
            equal(sugg._data.wrapper.parent().attr("class"), "ui-input-mask", "The parent is right");
            equal(sugg._data.wrapper.css("display"), "block", "The suggestion shows");
            equal(sugg._data.wrapper.find("ul li").length, 9, "The items count");
            equal(sugg._data.wrapper.find("ul li")[0].firstChild.innerHTML, "<span>1</span>92.168.1.1", "第1个提示");
            equal(sugg._data.wrapper.find("ul li")[1].firstChild.innerHTML, "<span>1</span>63邮箱", "第2个提示");
            equal(sugg._data.wrapper.find("ul li")[2].firstChild.innerHTML, "<span>1</span>15网盘", "第3个提示");
            equal(sugg._data.wrapper.find("ul li")[3].firstChild.innerHTML, "<span>1</span>0+10", "第4个提示");
            equal(sugg._data.wrapper.find("ul li")[4].firstChild.innerHTML, "<span>1</span>1对战平台", "第5个提示");
            equal(sugg._data.wrapper.offset().width, $("#inputId").parent().offset().width, "The width is same as input");
            equal(sugg._data.wrapper.offset().left, $("#inputId").offset().left, "The left is same as input");
            equal(sugg._data.wrapper.offset().top, $("#inputId").offset().top + $("#inputId").offset().height, "The top is right");
            approximateEqual(sugg._data.wrapper.offset().height,
		            (pad ? 40 : 33)+66+3, "The height is right");
            equal(sugg._data.wrapper.find(".ui-suggestion-content").height(), 66, "The content height is right");
            equal(sugg._data.wrapper.find(".ui-suggestion-button").height(),
		            (pad ? 40 : 33)+1, "The button height is right");
            approximateEqual(sugg._data.wrapper.find(".ui-suggestion-content .ui-suggestion-scroller").height(), $(".ui-suggestion-content ul li").height() * 9, 2, "The scroller height is right");
            ta.tap(sugg._data.wrapper.find("ul li")[1].firstChild);
        }, 200);
    });

    sugg.on("hide",function(){
        var me = this;
        setTimeout(function() {
            equal(sugg._data.wrapper.css("display"), "none", "The suggestion hides");
            me.destroy();
            start();
        }, 200);
    });
    setTimeout(function(){
        $("#inputId").get(0).value = "1";
        $("#inputId").focus();
    },20);
});

test("destroy", function(){
    ua.destroyTest(function(w,f){
    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        w.$("body").append('<input id="sugg-input" class="com-search-input ">');

        var sugg = w.$.ui.suggestion({
            container: "#sugg-input",
            source: upath + "data/suggestion.php"
        });
        sugg.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(sugg);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The gotop is destroy");
        this.finish();
    });
});

test("词条中包含',' & 点击搜索按钮保存历史记录", function() {
    expect(2);
    stop();
    var subBtn = $('<input />').attr('type', 'submit'),
        form = $('<form></form>').attr({
        method: 'get',
        action: 'http://www.baidu.com/s'
    }).append(subBtn),
        input = $('#sugg-input');
    input.attr('name', 'wd').wrapAll(form);
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php"
    });
    var count = 0;
    form.on('submit', function (e) {
    	count ++;
    	if(count == 1)
    		equals(window.localStorage[id], 'test', '点击提交按钮存储1个历史记录');
        if(count == 2)
        	equals(window.localStorage[id].split(encodeURIComponent(','))[0], 'test,test2', 'form提交存储历史记录正确');
        e.preventDefault();
    });
    var id = sugg._data.wrapper.attr('id');
    delete window.localStorage[id];

    input[0].value = 'test';
    ua.click(subBtn[0]);

    setTimeout(function () {
        input.focus();
        input[0].value = 'test,test2';
        ua.click(subBtn[0]);
        setTimeout(function () {
            sugg.destroy();
            form.remove();
            start();
        }, 300)
    }, 300);
});

test("防止脚本注入", function() {
    expect(1);
    stop();
    var show = 0;
    var hide = 0;
    var sugg = new $.ui.suggestion({
        container: "#sugg-input",
        source: upath + "data/suggestion.php",
        submit: function() {

        }
    });
    sugg.on("show", function() {
        setTimeout(function() {
        	ta.tap($(".ui-suggestion ul li")[0].firstChild);
        }, 100);
    });
    sugg.on("hide", function() {
    	setTimeout(function() {
    		ok(true, "脚本没有被执行");
            delete window.localStorage[id];
            sugg.destroy();
            start();
        }, 30);
    });
    
    var id = sugg._data.wrapper.attr('id');
    window.localStorage[id] = "<script>alert();</script>";

    $(input).focus();
});