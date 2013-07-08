(function () {
    var fixture;

    module('Dropmenu dismissible', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    width: 300,
                    height: 300,
                    background: '#fff',
                    top: 0//-99999
                })
                .appendTo(document.body);
        },

        teardown:function () {
            fixture.remove();
        }
    });


    test('加载样式', function () {
        expect(1);
        stop();
        ua.loadcss([
            'reset.css',
            'icons.default.css',
            'widget/dropmenu/dropmenu.css',
            'widget/dropmenu/dropmenu.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });

    test('加载js', function(){
        expect(1);
        stop();

        ua.importsrc('widget/popover/dismissible', function(){
            ok( true, 'popover加载进来了');
            start();
        }, 'gmu.Popover.options.dismissible');
    });

    test('加载js', function(){
        expect(1);
        stop();

        ua.importsrc('widget/dropmenu/dropmenu', function(){
            ok( true, 'dropmenu加载进来了');
            start();
        }, 'gmu.Dropmenu', 'widget/popover/popover');
    });

    test( 'dimissible参数应该自动开启', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        equal( ins._options.dismissible, true, 'ok' );

        dom.dropmenu('destroy').remove();
    });

    test( '功能检测', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        // 初始不显示
        ok( !container.hasClass('ui-in'), 'ok');

        // 点击其他区域，不会显示
        ua.click( document.body );
        ok( !container.hasClass('ui-in'), 'ok');

        // 点击target显示
        ua.click( dom[0] );
        ok( container.hasClass('ui-in'), 'ok');

        // 点击container啥也不做
        ua.click( container[0] );
        ok( container.hasClass('ui-in'), 'ok');

        // 点击target，不显示
        ua.click( dom[0] );
        ok( !container.hasClass('ui-in'), 'ok');

        // 点击target显示
        ua.click( dom[0] );
        ok( container.hasClass('ui-in'), 'ok');

        // 点击其他区域，隐藏
        ua.click( document.body );
        ok( !container.hasClass('ui-in'), 'ok');

        dom.dropmenu('destroy').remove();
    });

    test("destroy event", function () {
        ua.destroyTest(function (w, f) {

            var elem = w.$('<a id="dropmenu" data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>');

            w.$("body").append(elem);

            var el1 = w.dt.eventLength();

            var obj = elem.dropmenu('this');
            obj.destroy();


            var el2 = w.dt.eventLength();

            equal(el1, el2, "The event is ok");
            equals(w.$("#dropmenu").length, 1, "dom没有被移出");
            this.finish();
        });
    });

})();