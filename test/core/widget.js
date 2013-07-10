module('GMU底层');

test("创建类", function() {
    expect(4);
    gmu.define('Panel', {
        options: {
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
            this.trigger('show', {name: 'default'});
        },
        hide: function(){
            ok(true, '插件方法调用组件同名方法检查：Passed!');
        }
    });

    ok(gmu.Panel !== undefined, '命名空间检查：Passed!');

    ok(gmu.Panel.options.name === 'new Class', '默认参数检查：Passed!');
    ok(gmu.Panel.template === '<div>{{name}}</div>', '默认类模板检查：Passed!');
    ok(gmu.Panel.tpl2html('gmu') === '<div>gmu</div>', '默认类模板解析函数检查：Passed!');
});

test("option拆分", function() {
    expect(3);
    stop();

    gmu.Panel.option('display', 'push', function(){
        var me = this;

        me.on('show', function(e, data){
            ok(data.name === 'default', 'option拆分检查：Passed!' + 'push');
        });
    });

    gmu.Panel.option('display', 'overlay', function(){
        var me = this;

        me.on('show', function(e, data){
            ok(data.name === 'default', 'option拆分检查：Passed!' + 'overlay');
        });
    });

    gmu.Panel.option('display', '*', function(){
        var me = this;

        me.on('show', function(e, data){
            ok(data.name === 'default', 'option拆分检查：Passed!' + '*');
        });
    });

    gmu.Panel.option('display', function(){
        if(this._options.display === 'overlay'){
            return true;
        }
    }, function(){
        var me = this;

        me.on('show', function(e, data){
            ok(data.name === 'default', 'option拆分检查：Passed!' + 'function');
        });
    });

    $(document.body).append('<div id="panel"></div>');
    var panel = new gmu.Panel('#panel', {
        name: 'custom gmu',
        display: 'overlay'
    });

    panel.show();

    $('#panel').remove();
    start();
});

test("插件", function() {
    expect(8);
    stop();

    gmu.define('testPlugin', {
        _init: function() {
            ok(true, '组件初始化执行');
        },

        origin: function() {
            ok( true, 'origin方法执行了');
        },

        follow: function() {
            ok( true, 'follow执行了');
        }
    });

    gmu.testPlugin.register('follow', {
        _init: function(){
            var me = this;
            ok(true, "插件初始化检查：Passed!");
        },

        follow: function(){
            ok(true, "插件添加的实例方法检查：Passed!");
            this.origin();
        }
    });

    $(document.body).append('<div id="panel"></div>');
    var panel = new gmu.testPlugin('#panel', {
        name: 'custom gmu',
        display: 'push'
    });

    panel.follow();
    panel.origin();

    panel.destroy();

    $('#panel').remove();

    panel = new gmu.testPlugin('#panel', {
        follow: false
    });
    panel.follow();
    panel.origin();

    panel.destroy();

    $('#panel').remove();

    start();
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
    expect(10);

    gmu.define('Dialog', {
        options: {
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
    ok(dialog instanceof gmu.Dialog && dialog instanceof gmu.Panel, '继承关系检查：Passed!');

    $('#dialog').remove();

});

test("类继承 - inherits方式", function(){
    expect(10);

    var Alert = gmu.Dialog.inherits({
        options: {
            title: 'Alert'
        },
        title: function(title){},
        content: function(content){}
    });

    $(document.body).append('<div id="alert"></div>');
    var alert = new Alert('#alert', {
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
    var alert = new Alert('#alert', {
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
    ok(alert instanceof gmu.Dialog && alert instanceof gmu.Panel, '继承关系检查：Passed!');

    $('#alert').remove();
});

test("zeptoLize", function(){
    expect(2);

    gmu.define('test', {
        options: {
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
    expect(1);

    $(document.body).append('<div id="test"></div>');
    var test = new gmu.test('#test');

    test.on('init', function(){});
    test.on('create', function(){});

    // this._events已被删除，没办法检查自定义事件是否都被解绑，通过off间接检查
    test.off();
    ok(test._events.length === 0, 'destroy后自定义事件检查：Passed！');

    test.destroy();

    $('#test').remove();

});

test("on off trigger", function(){
    expect(3);

    var flag = 0;
    $(document.body).append('<div id="test"></div>');
    var test = new gmu.test('#test', {
        'plus1': function(){
            flag = flag + 1;
        }
    });

    test.on('plus1', function(){
        flag = flag + 1;
    });
    test.on('plus2', function(){
        flag = flag + 2;
    });

    test.trigger('plus1');
    test.trigger('plus2');
    ok(flag === 4, "on trigger检查：Passed!");

    flag = 0;
    test.off('plus2');
    test.trigger('plus1');
    test.trigger('plus2');
    ok(flag === 2, "off trigger检查：Passed!");

    flag = 0;
    test.off();
    test.trigger('plus1');
    test.trigger('plus2');
    ok(flag === 1, "off trigger检查：Passed!");

    $('#test').remove();
});

test("继承后的方法调用", function(){
    expect(7);

    gmu.define('Layer', {
        options: { 
            disposeOnHide: true
        },
        _init: function(){
            ok(true, '父类的构造函数调用：Passed!');
        },
        show: function(name){
            ok(true, '父类的方法调用：Passed!');
        }
    });

    gmu.Layer.register('follow', {
        _init: function(){
            ok(true, '父类的插件构造函数调用：Passed!');
        },
        show: function(name){
            this.origin(name);
            ok(true, '父类的插件方法调用：Passed!');
        },
        hide: function(){
            ok(true, '父类的插件方法调用：Passed!');
        }
    });

    gmu.define('Panel', {
        options: {
            height: 300,
            width: 200
        },
        _init: function(){
            ok(true, '子类构造函数调用：Passed!');
            this.$super('_init');
        },
        show: function(name){
            this.$super('show', name);
            ok(true, '子类方法调用：Passed!');
        }
    }, gmu.Layer);

    var panel = new gmu.Panel(document.body);
    panel.show('name', 3);
    panel.hide();

    panel.destroy();

    // 同名方法的调用顺序：父类方法 => 子类方法 => 父类的插件方法
});

test('tpl2html', function(){
    expect(4);
    
    var instance;

    gmu.define( 'TestWidget', {
        template: 'a is <%= a %>'
    } );

    instance = new gmu.TestWidget(document.body);

    equal( typeof instance.tpl2html(), 'function', '当tpl里面用到了模板，没有传入data时返回，编译结果' );
    equal( instance.tpl2html({a: 3}), 'a is 3', 'ok');
    instance.destroy();

    instance = new gmu.TestWidget(document.body, {
        template: {
            c: 'c is <%= c %>'
        }
    });
    equal( instance.tpl2html('c', {c: 4}), 'c is 4', 'ok' );
    instance.destroy();

    instance = new gmu.TestWidget(document.body, {
        template: {
            d: 'd is simple string.'
        }
    });
    equal( instance.tpl2html('d'), 'd is simple string.', '当不传入data, 或者tpl中不带模板变量时，返回原始字符串' );
    instance.destroy();
});

test('从dom中读取属性', function(){
    var undefined;

    gmu.define('testDomOption', {
        options: {
            key1: null,
            key2: null,
            key3: null,
            key4: null,
            key5: null,
            key6: null,
            key7: null
        }
    });

    var dom = $('<div data-key1="true" data-key2="false" data-key3="null"' +
                ' data-key6=\'{a: 1}\'' +
                ' data-key4=\'{"a":1}\' data-key5="2" data-key7="3"></div>'),
        instance;

    instance = dom.testDomOption({
        key7: 4
    }).testDomOption( 'this' );

    strictEqual( instance._options.key1, true, 'ok' );
    strictEqual( instance._options.key2, false, 'ok' );
    strictEqual( instance._options.key3, null, 'ok' );
    strictEqual( instance._options.key4 && instance._options.key4.a, 1, 'ok' );
    strictEqual( instance._options.key5, 2, '数字类型转换' );
    strictEqual( instance._options.key6, null, '正则格式不正确' );
    strictEqual( instance._options.key7, 4, '初始化时传入的优先' );

    dom.testDomOption('destroy').remove();
    gmu.testDomOption = undefined;
});

test('Options继承检测', function(){
    gmu.define('testOption', {
        options: {
            key1: 1,
            key2: 2,
            key4: {
                key1: 1
            }
        }
    });

    gmu.define( 'testOptionChild', {
        options: {
            key2: 3,
            key3: 4,
            key4: {
                key2: 2
            }
        }
    }, gmu.testOption );

    var ins = gmu.testOption(),
        insChild = gmu.testOptionChild();

    
    equal( ins._options.key1, 1 );
    equal( ins._options.key2, 2 );
    equal( ins._options.key4.key1, 1 );
    equal( insChild._options.key1, 1 );
    equal( insChild._options.key2, 3 );
    equal( insChild._options.key3, 4 );
    equal( insChild._options.key4.key1, 1 );
    equal( insChild._options.key4.key2, 2 );

    ins.destroy();
    insChild.destroy();

    delete gmu.testOption;
    delete gmu.testOptionChild;
});

test('template继承检测', function(){
    gmu.define('testTpl', {
        template: {
            frame: '123'
        }
    });

    gmu.define( 'testTplChild', {
        template: {
            item: '<span>'
        }
    }, gmu.testTpl );

    var ins = gmu.testTpl(document.body),
        insChild = gmu.testTplChild(document.body),
        ins2 = gmu.testTpl( document.body, {
            template: {
                frame: '345',
                abc: '123'
            }
        }),
        insChild2 = gmu.testTplChild(document.body, {
            template: {
                frame: '345',
                abc: '123'
            }
        });

    
    equal( ins.template.frame, '123' );
    equal( ins2.template.frame, '345' );
    equal( ins2.template.abc, '123' );
    equal( gmu.testTpl.template.frame, '123' );


    equal( insChild.template.frame, '123' );
    equal( insChild2.template.frame, '345' );
    equal( insChild2.template.abc, '123' );
    equal( insChild2.template.item, '<span>' );
    equal( gmu.testTplChild.template.frame, '123' );
    equal( insChild.template.item, '<span>' );
    equal( gmu.testTplChild.template.item, '<span>' );
});

test(' Zeptolize', function() {
    expect( 7 );
    gmu.define( 'testZeptolize', {
        
        // getter
        funA: function() {
            return 3;
        },

        // setter
        funB: function() {
            this.$el.addClass('funb');
        },

        funC: function() {
            this.$el.addClass('func');
            return this;
        }
    });

    try {
        var dom1 = $('<div>'),
            dom2 = $('<div>'),
            collection = dom1.add(dom2);

        collection.testZeptolize();

        equal( collection.testZeptolize('this'), dom1.testZeptolize('this'), 'ok');

        equal( collection.testZeptolize('funA'), 3);

        collection.testZeptolize('funB');
        ok( dom1.hasClass('funb') );
        ok( dom2.hasClass('funb') );

        collection.testZeptolize( 'funC' );
        ok( dom1.hasClass('func') );
        ok( dom2.hasClass('func') );

        collection.testZeptolize('noexist');

    } catch( ex ) {
        equal( ex.message, '组件没有此方法：noexist' );
    }
    delete gmu.testZeptolize;
});

test( 'test el', function() {
    gmu.define( 'testEl', {

    } );

    var dom = $('<div>');

    var ins = gmu.testEl( dom );
    equal( ins.getEl().get(0), dom.get(0) );
    ins.destroy();

    var dom2 = $('<div>');
    ins = gmu.testEl( dom, { el: dom2 } );
    equal( ins.getEl().get(0), dom2.get(0) );
    ins.destroy();

    ins = gmu.testEl({el: dom});
    equal( ins.getEl().get(0), dom.get(0) );
    ins.destroy();

    delete gmu.testEl;

});

test( 'event', function() {
    var flag = false;
    gmu.define( 'testEvent', {
        options: {
            type2: function() {
                return false;
            },

            type3: function() {
                flag = true;
            }
        },
        _init: function() {
            this.on( 'type1', function( e ) {
                e.preventDefault();
            });

            this.on( 'type2', function() {
                ok( false, '不会执行到这');
            });

            this.on( 'type3', function() {
                equal( flag, true );
            });
        }
    } );

    gmu.testEvent.register( 'test', {
        doA: function() {
            var evt = gmu.Event('type1');

            this.trigger( evt );

            ok( evt.isDefaultPrevented(), 'ok' ); 
        },

        doB: function() {
            var evt = gmu.Event( 'type2' );

            this.trigger( evt );

            ok( evt.isDefaultPrevented(), 'ok');
            ok( evt.isPropagationStopped(), 'ok');
        },

        doC:function() {
            this.trigger('type3');
        }
    } );

    var ins = gmu.testEvent();
    ins.doA();
    ins.doB();
    ins.doC();
    ins.destroy();

    delete gmu.testEvent;
});

test( 'isWidget', function() {
    gmu.define('widgetA', {});
    gmu.define('widgetB', {});

    var ins = gmu.widgetA();

    ok( gmu.isWidget( ins ) );
    ok( gmu.isWidget( ins, 'widgetA' ) );
    ok( !gmu.isWidget( ins, 'widgetB' ) );
    ok( !gmu.isWidget( ins, 'widgetC' ) );

    delete gmu.widgetA;
    delete gmu.widgetB;
});

test( 'noConflict', function() {
    $.fn.widgetA = 3;
    gmu.define('widgetA', {});
    
    notEqual( $.fn.widgetA, 3 );
    $.fn.widgetA.noConflict();
    equal( $.fn.widgetA, 3 );

    delete $.fn.widgetA;
    delete gmu.widgetA;
});

test( '尝试实例化Base', function() {
    expect(1);
    try {
        gmu.Base();
    } catch( ex ) {
        equal( ex.message, 'Base类不能直接实例化' );
    }
});