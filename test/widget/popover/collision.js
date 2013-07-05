(function () {
    var fixture;

    module('Popover collision', {
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
            'widget/popover/popover.css',
            'widget/popover/popover.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });

    test( 'collision参数应该自动开启', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( ins._options.collision, true, 'ok' );

        dom.popover('destroy').remove();
    });

    test( '加载placement.js', function(){
        stop();

        ua.importsrc('widget/popover/placement', function(){
            ok( true, '加载成功' );
            start();
        }, 'gmu.Popover.options.placement', 'widget/popover/popover');
    } );

    test( 'widthin: window', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(document.body),
            ins,
            container;

        dom.css({
            position: 'absolute',
            top: 'auto',
            bottom: 20,
            left: 70
        });

        ins = dom.popover({
            placement: 'bottom'
        }).popover('this');
        container = ins.$root;

        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'left';
        dom.css({
            top: 70,
            left: 30,
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'right' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'right';
        dom.css({
            top: 70,
            left: 'auto',
            right: 30,
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'left' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'top';
        dom.css({
            top: 20,
            left: 70,
            right: 'auto',
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
        })
        ins.show();

        dom.popover('destroy').remove();
    });
    

    test( 'widthin: element', function(){
        var within = $('<div>').css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }).appendTo(fixture),
            dom = $('<a data-content="Hello World">Button</a>').appendTo(within),
            ins,
            container;

        dom.css({
            position: 'absolute',
            top: 'auto',
            bottom: 20,
            left: 70
        });

        ins = dom.popover({
            placement: 'bottom',
            within: within
        }).popover('this');
        container = ins.$root;

        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'top' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'left';
        dom.css({
            top: 70,
            left: 30,
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'right' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'right';
        dom.css({
            top: 70,
            left: 'auto',
            right: 30,
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'left' );
        })
        ins.show();

        ins.hide();
        ins._options.placement = 'top';
        dom.css({
            top: 20,
            left: 70,
            right: 'auto',
            bottom: 'auto'
        });
        ins.one('after.placement', function(e, coord, info ){
            equal( info.placement, 'bottom' );
        })
        ins.show();

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