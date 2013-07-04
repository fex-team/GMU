(function () {
    var fixture;

    module('Popover dismissible', {
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
            'widget/popover/popover.css',
            'widget/popover/popover.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });

    test( 'dimissible参数应该自动开启', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( ins._options.dismissible, true, 'ok' );

        dom.popover('destroy').remove();
    });

    test( '功能检测', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
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

        dom.popover('destroy').remove();
    });

    test("destroy event", function () {
        ua.destroyTest(function (w, f) {

            var elem = w.$('<a id="popover" data-content="Hello World">Button</a>');

            w.$("body").append(elem);

            var el1 = w.dt.eventLength();

            var obj = elem.popover('this');
            obj.destroy();


            var el2 = w.dt.eventLength();

            equal(el1, el2, "The event is ok");
            equals(w.$("#popover").length, 1, "dom没有被移出");
            this.finish();
        });
    });

})();