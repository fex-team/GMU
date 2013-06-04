module('throttle');

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