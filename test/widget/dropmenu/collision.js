(function () {
    var fixture;

    module('Dropmenu collision', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    width: 320,
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

        ua.importsrc('widget/popover/collision', function(){
            ok( true, 'popover加载进来了');
            start();
        }, 'gmu.Popover.options.collision');
    });

    test('加载js', function(){
        expect(1);
        stop();

        ua.importsrc('widget/dropmenu/dropmenu', function(){
            ok( true, 'dropmenu加载进来了');
            start();
        }, 'gmu.Dropmenu', 'widget/popover/popover');
    });

    test( 'collision参数应该自动开启', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        equal( ins._options.collision, true, 'ok' );

        dom.dropmenu('destroy').remove();
    });

    test( '加载placement.js', function(){
        stop();

        ua.importsrc('widget/dropmenu/placement', function(){
            ok( true, '加载成功' );
            start();
        }, 'gmu.Dropmenu.options.placement', 'widget/dropmenu/dropmenu');
    } );

    test( 'widthin: window', function(){
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(document.body),
            ins,
            container;

        dom.css({
            position: 'absolute',
            top: 'auto',
            bottom: 20,
            left: 0
        });

        ins = dom.dropmenu({
            placement: 'bottom'
        }).dropmenu('this');
        container = ins.$root;

        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'left' );
        })
        ins.show();

        ins.hide();
        dom.css({
            left: 70
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'center' );
        })
        ins.show();

        ins.hide();
        dom.css({
            left: 'auto',
            right: 10
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'right' );
        })
        ins.show();

        ins._options.placement = 'top';

        ins.hide();
        dom.css({
            top: 20,
            bottom: 'auto',
            left: 'auto',
            right: 10
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'right' );
        })
        ins.show();

        ins.hide();
        dom.css({
            top: 20,
            left: 70,
            right: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'center' );
        })
        ins.show();

        ins.hide();
        dom.css({
            top: 20,
            left: 0
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'left' );
        })
        ins.show();

        dom.dropmenu('destroy').remove();
    });
    

    test( 'widthin: element', function(){
        var within = $('<div>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }).appendTo(fixture),
            dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(within),
            ins,
            container;

        dom.css({
            position: 'absolute',
            top: 'auto',
            bottom: 20,
            left: 0
        });

        ins = dom.dropmenu({
            placement: 'bottom',
            within: within
        }).dropmenu('this');
        container = ins.$root;

        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'left' );
        })
        ins.show();

        ins.hide();
        dom.css({
            left: 70
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'center' );
        })
        ins.show();

        ins.hide();
        dom.css({
            left: 'auto',
            right: 10
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
            equal( info.align, 'right' );
        })
        ins.show();

        ins._options.placement = 'top';

        ins.hide();
        dom.css({
            top: 20,
            bottom: 'auto',
            left: 'auto',
            right: 10
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'right' );
        })
        ins.show();

        ins.hide();
        dom.css({
            top: 20,
            left: 70,
            right: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'center' );
        })
        ins.show();

        ins.hide();
        dom.css({
            top: 20,
            left: 0
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
            equal( info.align, 'left' );
        })
        ins.show();

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