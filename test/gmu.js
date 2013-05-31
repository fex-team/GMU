module('GMU底层');

test("创建类", function() {
    expect(4);
    stop();
    ua.importsrc('gmu/Base', function() {
        gmu.define('Panel', {
            defaultOptions: {
                name: 'new Class'
            },
            template: '<div>{{name}}</div>',
            tpl2html: function(name){
                return gmu.Panel.template.replace('{{name}}', name);
            },
            _init: function(){
                this.trigger('init');
            },
            show: function(){
                this.publish('show:panel', {name: 'default'});
            },
            hide: function(){
                ok(true, '插件方法调用组件同名方法检查：Passed!');
            }
        });

        ok(gmu.Panel !== undefined, '命名空间检查：Passed!');

        ok(gmu.Panel.defaultOptions.name === 'new Class', '默认参数检查：Passed!');
        ok(gmu.Panel.template === '<div>{{name}}</div>', '默认类模板检查：Passed!');
        ok(gmu.Panel.tpl2html('gmu') === '<div>gmu</div>', '默认类模板解析函数检查：Passed!');

        start();
    }, 'gmu.Base');
});

test("option拆分", function() {
    expect(2);

    gmu.Panel.option('display', 'push', function(){
        var me = this;

        me.subscribe('show:panel', function(e){
            ok(e.name === 'default', 'option拆分，参数检查：Passed!');
        });
    });

    gmu.Panel.option('display', 'overlay', function(){
        var me = this;

        me.subscribe('show:panel', function(e){
            ok(e.name === 'default', 'option拆分检查：Passed!');
            ok(e.name === 'default', 'option拆分，参数检查：Passed!');
        });
    });

    $(document.body).append('<div id="panel"></div>');
    var panel = new gmu.Panel('#panel', {
        name: 'custom gmu',
        display: 'overlay'
    });

    panel.show();

    $('#panel').remove();
});

test("插件", function() {
    expect(4);

    gmu.Panel.register('follow', {
        _init: function(){
            var me = this;

            ok(true, "插件初始化检查：Passed!");
        },

        follow: function(){
            ok(true, "插件添加的实例方法检查：Passed!");
        },

        hide: function(){
            this.origin();
        }
    });

    $(document.body).append('<div id="panel"></div>');
    var panel = new gmu.Panel('#panel', {
        name: 'custom gmu',
        display: 'push'
    });

    panel.follow();
    panel.hide();
    panel.show();

    $('#panel').remove();
});


test("实例化类", function() {
    expect(4);

    $(document.body).append('<div id="panel"></div>');
    var panel = new gmu.Panel('#panel', {
        name: 'custom gmu',
        template: '<div>Hello {{name}}</div>',
        tpl2html: function(name){
            return this.template.replace('{{name}}', name.toUpperCase());
        },
        follow: false
    });

    ok(panel._options.name === 'custom gmu', '实例参数检查：Passed!');
    ok(panel.template === '<div>Hello {{name}}</div>', '实例模板检查：Passed!');
    ok(panel.tpl2html('gmu') === '<div>Hello GMU</div>', '实例模板解析函数检查：Passed!');
    ok($jQuery.isFunction(panel.show), '实例方法检查：Passed!');

    $('#panel').remove();
});

test("DOM options", function() {
    expect(1);
    
    $(document.body).append('<div id="panel" data-name="custom gmu"></div>');
    var panel = new gmu.Panel('#panel', {
        follow: false
    });

    ok(panel._options.name === 'custom gmu', 'DOM options检查：Passed!');
    // ok(panel.template === '<div>Hello {{name}}</div>', '实例类模板检查：Passed!');
    // ok(panel.tpl2html('gmu') === '<div>Hello GMU</div>', '实例类模板解析函数检查：Passed!');
    // ok($jQuery.isFunction(panel.show), '实例方法检查：Passed!');

    $('#panel').remove();
});

test("类继承 - define方式", function(){
    expect(9);

    gmu.define('Dialog', {
        defaultOptions: {
            title: '标题'
        },
        _init: function(){
            
        },
        title: function(title){}
    }, gmu.Panel);

    $(document.body).append('<div id="dialog"></div>');
    var dialog = new gmu.Dialog('#dialog', {
        name: '对话框',
        follow: false
    });

    ok(dialog._options.name === '对话框', '实例参数检查：Passed!');
    ok(dialog._options.title === '标题', '继承自父类的参数检查：Passed!');
    ok(dialog.template === '<div>{{name}}</div>', '继承自父类的模板检查：Passed!');
    ok(dialog.tpl2html('gmu') === '<div>gmu</div>', '继承自父类的模板解析函数检查：Passed!');
    ok($jQuery.isFunction(dialog.show), '继承自父类的方法检查：Passed!');
    $('#dialog').remove();

    $(document.body).append('<div id="dialog"></div>');
    var dialog = new gmu.Dialog('#dialog', {
        name: '对话框',
        template: '<div>Hello {{name}}</div>',
        tpl2html: function(name){
            return this.template.replace('{{name}}', name.toUpperCase());
        },
        follow: false
    });
    ok(dialog.template === '<div>Hello {{name}}</div>', '实例模板检查：Passed!');
    ok(dialog.tpl2html('gmu') === '<div>Hello GMU</div>', '实例模板解析函数检查：Passed!');
    ok($jQuery.isFunction(dialog.show), '实例方法检查：Passed!');
    ok($jQuery.isFunction(dialog.title), '实例方法检查：Passed!');

    $('#dialog').remove();
});

test("类继承 - inherits方式", function(){
    expect(9);

    gmu.Dialog.inherits('Alert', {
        defaultOptions: {
            title: 'Alert'
        },
        title: function(title){},
        content: function(content){}
    });

    $(document.body).append('<div id="alert"></div>');
    var alert = new gmu.Alert('#alert', {
        name: '警告框',
        follow: false
    });

    ok(alert._options.name === '警告框', '实例参数检查：Passed!');
    ok(alert._options.title === 'Alert', '继承自父类的参数检查：Passed!');
    ok(alert.template === '<div>{{name}}</div>', '继承自父类的模板检查：Passed!');
    ok(alert.tpl2html('gmu') === '<div>gmu</div>', '继承自父类的模板解析函数检查：Passed!');
    ok($jQuery.isFunction(alert.show), '继承自父类的方法检查：Passed!');
    $('#alert').remove();

    $(document.body).append('<div id="alert"></div>');
    var alert = new gmu.Alert('#alert', {
        name: '对话框',
        template: '<div>Hello {{name}}</div>',
        tpl2html: function(name){
            return this.template.replace('{{name}}', name.toUpperCase());
        },
        follow: false
    });

    ok(alert.template === '<div>Hello {{name}}</div>', '实例模板检查：Passed!');
    ok(alert.tpl2html('gmu') === '<div>Hello GMU</div>', '实例模板解析函数检查：Passed!');
    ok($jQuery.isFunction(alert.show), '实例方法检查：Passed!');
    ok($jQuery.isFunction(alert.content), '实例方法检查：Passed!');

    $('#alert').remove();
});

test("zeptoLize", function(){
    expect(2);

    gmu.define('test', {
        defaultOptions: {
            test_option: 'test'
        },
        _init: function(){
        },
        testfn: function(){
            ok(true, '调用实例方法检查：Passed!');
        },
        testreturn: function(){
            return 'value';
        }
    });

    $(document.body).append('<div id="test"></div>');
    $('#test').test().test('testfn');
    ok($('#test').test('testreturn') === 'value', '调用有返回值的实例方法检查：Passed!');
    $('#test').remove();
});


test("destroy", function(){
    expect(0);

    $(document.body).append('<div id="test"></div>');
    var test = new gmu.test('#test');

    test.destroy();

    $('#test').remove();

    //TODO 检查事件方法属性等是否销毁
});

test("on off trigger", function(){
    expect(3);

    var flag = 0;
    $(document.body).append('<div id="test"></div>');
    var test = new gmu.test('#test', {
        'plus1:test': function(){
            flag = flag + 1;
        }
    });

    test.on('plus1:test', function(){
        flag = flag + 1;
    });
    test.on('plus2:test', function(){
        flag = flag + 2;
    });

    test.trigger('plus1:test').trigger('plus2:test');
    ok(flag === 4, "on trigger检查：Passed!");

    flag = 0;
    test.off('plus2:test');
    test.trigger('plus1:test').trigger('plus2:test');
    ok(flag === 2, "off trigger检查：Passed!");

    flag = 0;
    test.off();
    test.trigger('plus1:test').trigger('plus2:test');
    ok(flag === 0, "off trigger检查：Passed!");

    $('#test').remove();
});

test("subscribe unsubscribe publish", function(){
    expect(3);

    var flag = 0;
    $(document.body).append('<div id="test"></div>');
    var test = new gmu.test('#test');

    test.subscribe('plus1:test', function(){
        flag = flag + 1;
    });
    test.subscribe('plus2:test', function(){
        flag = flag + 2;
    });

    test.publish('plus1:test').publish('plus2:test');
    ok(flag === 3, "subscribe publish检查：Passed!");

    flag = 0;
    test.unsubscribe('plus2:test');
    test.publish('plus1:test').publish('plus2:test');
    ok(flag === 1, "unsubscribe publish检查：Passed!");

    flag = 0;
    test.unsubscribe();
    test.publish('plus1:test').publish('plus2:test');
    ok(flag === 0, "unsubscribe publish检查：Passed!");

    $('#test').remove();
});