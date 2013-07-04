(function () {
    var fixture;

    module('Popover arrow', {
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
            'widget/popover/popover.css',
            'widget/popover/popover.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });

    test( 'arrow参数应该自动开启', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( ins._options.arrow, true, 'ok' );
        equal( container.find('.ui-arrow').length, 1, 'ok');

        dom.popover('destroy').remove();
    });

    test( '加载placement.js', function(){
        stop();

        ua.importsrc('widget/popover/placement', function(){
            ok( true, '加载成功' );
            start();
        }, 'gmu.Popover.options.placement', 'widget/popover/popover');
    } );

    test( 'placement: bottom', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover({
            placement: 'bottom'
        }).popover('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();


        approximateEqual( offset1.top + offset1.height + 15, offset2.top, 'ok' );
        approximateEqual( offset1.left + offset1.width/2 - offset2.width/2, offset2.left, 'ok' );

        ok( container.hasClass('ui-pos-bottom'), 'ok');

        dom.popover('destroy').remove();
    });

    test( 'placement: right', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover({
            placement: 'right'
        }).popover('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();

        approximateEqual( offset1.top + offset1.height/2 - offset2.height/2, offset2.top, 'ok' );
        approximateEqual( offset1.left + offset1.width + 15, offset2.left, 'ok' );

        ok( container.hasClass('ui-pos-right'), 'ok');

        dom.popover('destroy').remove();
    });

    test( 'placement: top', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover({
            placement: 'top'
        }).popover('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();

        approximateEqual( offset1.top - offset2.height - 15, offset2.top, 'ok' );
        approximateEqual( offset1.left + offset1.width/2 - offset2.width/2, offset2.left, 'ok' );

        ok( container.hasClass('ui-pos-top'), 'ok');

        dom.popover('destroy').remove();
    });

    test( 'placement: left', function(){
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover({
            placement: 'left'
        }).popover('this');

        container = ins.$root;

        ins.show();

        var offset1 = dom.offset(),
            offset2 = container.offset();

        approximateEqual( offset1.top + offset1.height/2 - offset2.height/2, offset2.top, 'ok' );
        approximateEqual( offset1.left - offset2.width - 15, offset2.left, 'ok' );

        ok( container.hasClass('ui-pos-left'), 'ok');

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