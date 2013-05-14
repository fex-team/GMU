test("toString", function() {
    expect(2);
    var obj = {};
    equal($.toString(obj), '[object Object]', "toString() is correct");
    obj = 'sf';
    equal($.toString(obj), '[object String]', "toString() is correct");
});

test("slice", function() {
    expect(6);
    (function(a, b) {
        var arg = $.slice(arguments);
        ok($.isArray(arg), "arguments变成了array");
        equals(arg[0], 1, "slice() is correct");
        equals(arg[1], 2, "slice() is correct");
        arg = $.slice(arguments, 1);
        ok($.isArray(arg), "arguments变成了array");
        equals(arg[0], 2, "slice() is correct");
        equal(arg.length, 1);
    })(1, 2)
});

test("later-timeout", function() {
    expect(3);
    stop();
    var t1 = +new Date;
    $.later(function() {
        equal(this.a, 1);
        equal(arguments.length, 2);
        ok(+new Date - t1 >= 200, '200ms后才执行的:' + +new Date - t1);
        start()
    }, 200, false, {
        a: 1
    }, [1, 2]);
});

test("later-interval", function() {
    expect(1);
    stop();
    var t = 0,
        time = Date.now(),
        timeId = $.later(function() {
            t++;
            if(Date.now() - time >= 600) {
                equal(t, 3, '执行了3次');
                clearInterval(timeId);
                start()
            }
        }, 200, true);
});

test("是 String RegExp Number Date Object Null Undefined", function() {
    expect(9);
    var obj = "";
    ok($.isString(obj));
    obj = 1;
    ok($.isNumber(obj));
    obj = /\w/;
    ok($.isRegExp(obj));
    obj = new Date;
    ok($.isDate(obj));
    obj = new Object;
    ok($.isObject(obj));
    obj = null;
    ok($.isNull(obj));
    obj = undefined;
    ok($.isUndefined(obj));
    obj = null;
    ok(!$.isUndefined(obj));
    obj = false;
    ok($.isBoolean(obj))
});

test("throttle", function() {
    expect(1);
    stop();
    var count = 0;
    var test = $.throttle(function() {
        count++;
    });
    var sum = 0,
        timer;
    timer = setInterval(function() {
        if (sum == 6) {
            clearInterval(timer);
            equals(count , 3, "700ms内执行3次");
            start();
        }
        sum++;
        test();
    }, 100)
});

test("throttle(delay)", function() {
    expect(1);
    stop();
    var count = 0;
    var test = $.throttle(300, function() {
        count++;
    });
    var sum = 0,
        timer;
    timer = setInterval(function() {
        if (sum == 7) {
            clearInterval(timer);
            equals(count , 3, "800ms内执行3次");
            start();
        }
        sum++;
        test();
    }, 100)
});

test("throttle(debounce_mode=true)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.throttle(function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 100, 10, "在开始时执行");
    }, true);
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 6) {
            clearInterval(timer);
            equals(count , 1, "700ms内执行1次");
            start();
        }
        sum++;
        test();
    }, 100)
});

test("throttle(debounce_mode=false)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.throttle(100, function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 400, 10, "在结束时执行");
        equals(count , 1, "300ms内执行1次");
        start();
    }, false);
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 2) {
            clearInterval(timer);
        }
        sum++;
        test();
    }, 100)
});

test("debounce(fn)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.debounce(function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 550, 10, "在结束时执行");
        equals(count , 1, "300ms内执行1次");
        start();
    });
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 2) {
            clearInterval(timer);
        }
        sum++;
        test();
    }, 100)
});

test("debounce(delay)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.debounce(100, function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 400, 10, "在结束时执行");
        equals(count , 1, "300ms内执行1次");
        start();
    });
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 2) {
            clearInterval(timer);
        }
        sum++;
        test();
    }, 100)
});

test("debounce(t=true)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.debounce(function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 100, 10, "在开始时执行");
    }, true);
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 6) {
            clearInterval(timer);
            equals(count , 1, "700ms内执行1次");
            start();
        }
        sum++;
        test();
    }, 100)
});

test("debounce(t=false)", function() {
    expect(2);
    stop();
    var count = 0;
    var test = $.debounce(100, function() {
        count++;
        var d2 = new Date();
        approximateEqual(d2 - d1, 400, 10, "在结束时执行");
        equals(count , 1, "300ms内执行1次");
        start();
    }, false);
    var sum = 0,
        timer;
    var d1 = new Date();
    timer = setInterval(function() {
        if (sum == 2) {
            clearInterval(timer);
        }
        sum++;
        test();
    }, 100)
});

test("parseTpl", function() {
    expect(1);
    var obj = {
            name: 'ajean',
            pwd: 1234567
        },
        tpl = '登录名<%=name%>，密码<%=pwd%>';
    equal('登录名ajean，密码1234567', $.parseTpl(tpl, obj));
});

test("$.contains", function() {
    expect(3);
    $('<div id="parent"><div><div id="child"></div></div></div>').appendTo(document.body);
    ok($.contains($('#parent').get(0), $('#child').get(0)), 'parent包含child?');
    ok(!$.contains($('#child').get(0), $('#parent').get(0)), 'child包含parent?');
    ok(!$.contains($('#parent').get(0), $('#parent').get(0)), 'parent包含parent?');
    $('#parent').remove();
});

test("$.contains 文字节点", function() {
    expect(2);
    $('<div id="parent">jfkelfjdkl</div>').appendTo(document.body);
    var parent = $('#parent').get(0), text = parent.childNodes[0];

    ok($.contains(parent, text), 'parent包含child?');
    ok(!$.contains(parent, parent), 'parent包含parent?');

    $('#parent').remove();
});



/**Event.js*/
var $doc = $(document),
    i = 0;
module('plugin/core/event', {
    setup: function() {
        $doc.on('mousedown click', function() {
            i++;
        });
    },
    teardown: function() {
        i = 0;
        $doc.off();
    }
});

test('on', function() {
    $(document).trigger('mousedown');
    equal(i, 1, 'first click');
    $(document).trigger('click');
    equal(i, 2, 'second click');
});

test('off', function() {
    $(document).off();
    $(document).trigger('mousedown');
    equal(i, 0, 'first click');
    $(document).trigger('click');
    equal(i, 0, 'second click');
});

test('trigger', function() {
    $(document).trigger('mousedown');
    equal(i, 1, 'first click');
    $(document).trigger('click');
    equal(i, 2, 'second click');
});

test('ortChange', function() {
    $(window).on('ortChange', function() {
        ok(1, 'ortChange triggerd');
    });
    $(window).trigger('ortChange');
});

test('stopImmediatePropagation', function(){
    expect(1);
    $('<a id="link">link</a>').appendTo('body');
    $('#link').on('click', function(e){
        ok(true, 'First clicked');
        e.stopImmediatePropagation();
    }).on('click', function(e){
            ok(true, 'Second clickedc');
        }).trigger('click');
});