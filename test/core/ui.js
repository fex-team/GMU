$.ui.define('klass', {
    _create: function() {
        ok(1, '_create被执行');
    },
    _setup: function() {
        ok(1, '_setup被执行');
    },
    _init: function() {
        ok(1, '_init被执行');
    }
});

$.ui.klass.register({
    test: function() {
        var tmp = this.data('a');
        equal(tmp, 1);
        return this;
    }
});

test("defined", function() {
    $.ui.klass($('<div></div>')).destroy();
});

test("id", function() {
    var ins = $.ui.klass($('<div></div>'));
    equal(/^klass-[0-9]*$/.test(ins.id()), true, 'id is right');
    ins.destroy();
});

test("setup", function() {
    $('<div id="setup"></div>').appendTo(document.body);
    $('#setup').klass('this').destroy();
});

test('plugin', function() {
    $.ui.klass($('<div></div>'), {a: 1}).test().destroy();
});

test('on trigger', function() {
    expect(3);
    stop();
    var ins = $.ui.klass($('<div id="test"></div>').appendTo(document.body)).on('click', function() {
        ok(1, 'click!');
        start();
    });
    $('#test').trigger('click');
    ins.destroy();
});

test('$.ui.isWidget', function() {
    expect(5);
    stop();

    $.ui.define('klass1', {
        _create: function() {
            this.root($('<div></div>'))
        },
        _init:function(){}
    });

    $.ui.define('klass2', {
        _create: function() {
            this.root($('<div></div>'))
        },
        _init:function(){}
    });

    var obj1 = $.ui.klass1(),
        obj2 = $.ui.klass2();

    ok($.ui.isWidget(obj1), 'obj1 is instanceof widget');
    ok($.ui.isWidget(obj2), 'obj2 is instanceof widget');
    ok($.ui.isWidget(obj1, 'klass1'), 'obj1 is instanceof klass1');
    ok(!$.ui.isWidget(obj2, 'klass1'), 'obj2 is not instanceof klass1');
    ok(!$.ui.isWidget(obj2, 'noExist'), 'obj2 is not instanceof noExist');

    obj1.destroy();
    obj2.destroy();

    start();
});

test('_zeptoLize zepto对象调用getter或setter类型的方法', function() {
    expect(54);
    stop();

    $.ui.define('klass1', {
    	_create: function() {
            ok(1, '_create被执行');
        },
        _init: function() {
            ok(1, '_init被执行');
        },
        single: function(value) {
            var data = this._data, setter = value !== undefined;
            if(setter)
            	data.single = value;
            return setter ? this : data.single;
        }
    });
    
    $('<div id="klass1"></div>').appendTo(document.body);

    //一个参数的方法，返回值为""
    var klass1 = $.ui.klass1("#klass1", {
    	single: ""
    });
    equals(klass1.single(), "", "The result is right");
    equals($("#klass1").klass1("single"), "", "The result is right");
    
   //一个参数的方法，返回值为null
    var klass1 = $.ui.klass1("#klass1", {
    	single: null
    });
    equals(klass1.single(), null, "The result is right");
    equals($("#klass1").klass1("single"), null, "The result is right");
    
    //一个参数的方法，返回值为字符串
    var klass1 = $.ui.klass1("#klass1", {
    	single: "1"
    });
    equals(klass1.single(), "1", "The result is right");
    equals($("#klass1").klass1("single"), "1", "The result is right");
    
    //一个参数的方法，返回值为数字
    var klass1 = $.ui.klass1("#klass1", {
    	single: 0
    });
    equals(klass1.single(), 0, "The result is right");
    equals($("#klass1").klass1("single"), 0, "The result is right");
    
    //一个参数的方法，返回值为Object
    var klass1 = $.ui.klass1("#klass1", {
    	single: {}
    });
    ok($.isObject(klass1.single()), "The result is right");
    ok($.isObject($("#klass1").klass1("single")), "The result is right");
    
    //一个参数的方法，返回值为数组
    var klass1 = $.ui.klass1("#klass1", {
    	single: []
    });
    ok($.isArray(klass1.single()), "The result is right");
    equals(klass1.single().length, 0, "The result is right");
    ok($.isArray($("#klass1").klass1("single")), "The result is right");
    equals($("#klass1").klass1("single").length, 0, "The result is right");
    
    //一个参数的方法，返回值为true
    var klass1 = $.ui.klass1("#klass1", {
    	single: true
    });
    equals(klass1.single(), true, "The result is right");
    equals($("#klass1").klass1("single"), true, "The result is right");
    
    //一个参数的方法，返回值为false
    var klass1 = $.ui.klass1("#klass1", {
    	single: false
    });
    equals(klass1.single(), false, "The result is right");
    equals($("#klass1").klass1("single"), false, "The result is right");
   
    
    //两个参数的方法
    var klass1 = $.ui.klass1("#klass1", {
    });
    //返回值为""
    $("#klass1").klass1("data", "test", "");
    equals(klass1.data("test"), "", "The result is right");
    equals($("#klass1").klass1("data", "test"), "", "The result is right");
    //返回值为null
    $("#klass1").klass1("data", "test", null);
    equals(klass1.data("test"), null, "The result is right");
    equals($("#klass1").klass1("data", "test"), null, "The result is right");
    //返回值为字符串
    $("#klass1").klass1("data", "test", "1");
    equals(klass1.data("test"), "1", "The result is right");
    equals($("#klass1").klass1("data", "test"), "1", "The result is right");
    //返回值为数字
    $("#klass1").klass1("data", "test", 1);
    equals(klass1.data("test"), 1, "The result is right");
    equals($("#klass1").klass1("data", "test"), 1, "The result is right");
    //返回值为Object
    $("#klass1").klass1("data", "test", {});
    ok($.isObject(klass1.data("test")), "The result is right");
    ok($.isObject($("#klass1").klass1("data", "test")), "The result is right");
    //返回值为数组
    $("#klass1").klass1("data", "test", []);
    ok($.isArray(klass1.data("test")), "The result is right");
    equals(klass1.data("test").length, 0, "The result is right");
    ok($.isArray($("#klass1").klass1("data", "test")), "The result is right");
    equals($("#klass1").klass1("data", "test").length, 0, "The result is right");
    //返回值为true
    $("#klass1").klass1("data", "test", true);
    equals(klass1.data("test"), true, "The result is right");
    equals($("#klass1").klass1("data", "test"), true, "The result is right");
    //返回值为false
    $("#klass1").klass1("data", "test", false);
    equals(klass1.data("test"), false, "The result is right");
    equals($("#klass1").klass1("data", "test"), false, "The result is right");
    
    klass1.destroy();
    start();
});

test("destroy",function(){
    ua.destroyTest(function(w,f){

        w.$.ui.define('klass', {
            _create: function() {
            },
            _setup: function() {
            },
            _init: function() {
            }
        });
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var el = w.document.createElement('div');
        el.id = 'dd';
        w.document.body.appendChild(el);
        var obj =  w.$.ui.klass(el, {});
        obj.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(obj);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The obj is destroy");
        this.finish();
    })
}) ;