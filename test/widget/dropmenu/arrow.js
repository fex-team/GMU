(function () {
    var fixture;

    module('Dropmenu arrow', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    width: 300,
                    height: 300,
                    background: '#fff',
                    top: -99999
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

        ua.importsrc('widget/popover/arrow', function(){
            ok( true, 'popover加载进来了');
            start();
        }, 'gmu.Popover.options.arrow');
    });

    test('加载js', function(){
        expect(1);
        stop();

        ua.importsrc('widget/dropmenu/dropmenu', function(){
            ok( true, 'dropmenu加载进来了');
            start();
        }, 'gmu.Dropmenu', 'widget/popover/popover');
    });

    test( 'arrow参数应该自动开启', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        equal( ins._options.arrow, true, 'ok' );
        equal( container.find('.ui-arrow').length, 1, 'ok');

        dom.dropmenu('destroy').remove();
    });

    test( '加载placement.js', function(){
        stop();

        ua.importsrc('widget/dropmenu/placement', function(){
            ok( true, '加载成功' );
            start();
        }, 'gmu.Dropmenu.options.placement', 'widget/dropmenu/dropmenu');
    } );

    test( 'placement: bottom left', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'bottom',
            align: 'left'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top + offset1.height + 15, offset2.top );
        approximateEqual( offset1.left, offset2.left );

        ok( container.hasClass('ui-pos-bottom-left'), 'ok');

        dom.dropmenu('destroy').remove();
    });

    test( 'placement: bottom center', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'bottom',
            align: 'center'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top + offset1.height + 15, offset2.top );
        approximateEqual( offset1.left + offset1.width/2 - offset2.width/2, offset2.left );

        ok( container.hasClass('ui-pos-bottom-center'), 'ok');

        dom.dropmenu('destroy').remove();
    });

    test( 'placement: bottom right', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'bottom',
            align: 'right'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top + offset1.height + 15, offset2.top );
        approximateEqual( offset1.left + offset1.width - offset2.width, offset2.left );

        ok( container.hasClass('ui-pos-bottom-right'), 'ok');

        dom.dropmenu('destroy').remove();
    });


    test( 'placement: top left', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'top',
            align: 'left'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top - offset2.height - 15, offset2.top );
        approximateEqual( offset1.left, offset2.left );

        ok( container.hasClass('ui-pos-top-left'), 'ok');

        dom.dropmenu('destroy').remove();
    });

    test( 'placement: top center', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'top',
            align: 'center'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top - offset2.height - 15, offset2.top );
        approximateEqual( offset1.left + offset1.width/2 - offset2.width/2, offset2.left );

        ok( container.hasClass('ui-pos-top-center'), 'ok');

        dom.dropmenu('destroy').remove();
    });

    test( 'placement: top right', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu({
            placement: 'top',
            align: 'right'
        }).dropmenu('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top - offset2.height - 15, offset2.top );
        approximateEqual( offset1.left + offset1.width - offset2.width, offset2.left );

        ok( container.hasClass('ui-pos-top-right'), 'ok');

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