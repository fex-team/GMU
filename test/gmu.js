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
            init: function(){
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
    expect(3);

    gmu.Panel.register('follow', {
        init: function(){
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
        display: 'push',
        follow: true
    });

    panel.follow();
    panel.hide();

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
        }
    });

    ok(panel._options.name === 'custom gmu', '实例参数检查：Passed!');
    ok(panel.template === '<div>Hello {{name}}</div>', '实例类模板检查：Passed!');
    ok(panel.tpl2html('gmu') === '<div>Hello GMU</div>', '实例类模板解析函数检查：Passed!');
    ok(panel.show !== undefined, '实例方法检查：Passed!');

    $('#panel').remove();
});

test("DOM options", function() {
    expect(1);
    
    $(document.body).append('<div id="panel" data-name="custom gmu"></div>');
    var panel = new gmu.Panel('#panel');

    ok(panel._options.name === 'custom gmu', 'DOM options检查：Passed!');
    // ok(panel.template === '<div>Hello {{name}}</div>', '实例类模板检查：Passed!');
    // ok(panel.tpl2html('gmu') === '<div>Hello GMU</div>', '实例类模板解析函数检查：Passed!');
    // ok(panel.show !== undefined, '实例方法检查：Passed!');

    $('#panel').remove();
});

test("类继承 - define方式", function(){
    expect(5);

    gmu.define('Dialog', {
        defaultOptions: {
            title: '标题'
        },
        init: function(){
            
        }
    }, gmu.Panel);

    $(document.body).append('<div id="dialog"></div>');
    var dialog = new gmu.Dialog('#dialog', {
        name: '对话框'
    });

    ok(dialog._options.name === '对话框', '实例参数检查：Passed!');
    ok(dialog._options.title === '标题', '实例参数检查：Passed!');
    ok(dialog.template === '<div>{{name}}</div>', '实例模板检查：Passed!');
    ok(dialog.tpl2html('gmu') === '<div>gmu</div>', '实例模板解析函数检查：Passed!');
    ok(dialog.show !== undefined, '实例方法检查：Passed!');


});

test("类继承 - inherits方式", function(){

});

test("zeptoLize", function(){

});