module('GMU底层');

test("创建类", function() {
    // expect(2);
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
            _init: function(){},
            show: function(){
                this.publish('show:panel', {name: 'default'});
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
    // expect(2);

    gmu.Panel.option('display', 'push', function(){
        var me = this;

        me.subscribe('show:panel', function(e){
            ok(e.name === 'default', 'option拆分检查：Passed!');
        });
    });

    $(document.body).append('<div id="#panel"></div>');
    var panel = new gmu.Panel('#panel', {
        name: 'custom gmu',
        display: 'push'
    });

    panel.show();

    $('#panel').remove();
});


test("实例化类", function() {
    // expect(2);
    $(document.body).append('<div id="#panel"></div>');
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