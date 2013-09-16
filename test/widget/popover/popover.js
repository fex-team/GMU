(function () {
    var fixture;

    module('Popover', {
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

    test('内容自动创建', function () {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            container;

        dom.popover();

        container = dom.next();

        ok( container.hasClass('ui-popover'), '添加了正确的className' );
        equal( container.text(), 'Hello World', '内容正确');

        dom.popover('destroy');

        dom.popover({
            content: 'abc'
        });

        container = dom.next();

        ok( container.hasClass('ui-popover'), '添加了正确的className' );
        equal( container.text(), 'abc', '内容正确');

        dom.popover('destroy').remove();
    });

    test('指定内容节点', function () {
        var container = $('<div class="abcd">').appendTo( fixture ),
            dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture);

        dom.popover({
            container: container
        });

        ok( container.hasClass('ui-popover'), '添加了正确的className' );
        equal( container.text(), 'Hello World', '内容正确');

        // 内容节点应该在前面才对
        equal( dom.next().length, 0, '没有在下个节点处创建内容节点');

        dom.popover('destroy').remove();
    });

    test('当传入内容节点是个选择器，并且没有找到，也会自动创建', function () {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture);

        dom.popover({
            container: '#bucunzaideyuansuid'    // 不存在的元素id
        });

        container = dom.next();

        ok( container.hasClass('ui-popover'), '添加了正确的className' );
        
        dom.popover('destroy').remove();
    });

    test('Method: show & hide & toggle', function () {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( container.hasClass('ui-in'), false );

        ins.show();
        equal( container.hasClass('ui-in'), true );

        ins.toggle();
        equal( container.hasClass('ui-in'), false );

        ins.toggle();
        equal( container.hasClass('ui-in'), true );

        // 交互
        ua.click( dom[ 0 ] );
        equal( container.hasClass('ui-in'), false );

        ua.click( dom[ 0 ] );
        equal( container.hasClass('ui-in'), true );

        dom.popover('destroy').remove();
    });


    test('Method: target', function () {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            dom2 = $('<a>Button 2</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( ins.target().get(0), dom.get(0), '获取没问题' );

        ins.target( dom2 );

        equal( container.hasClass('ui-in'), false, '初始状态不可见' );

        ua.click( dom[ 0 ] );
        equal( container.hasClass('ui-in'), false, '对dom的交互已经无效' );

        ua.click( dom2[ 0 ] );
        equal( container.hasClass('ui-in'), true, '新的dom交互正确' );

        dom.popover('destroy');

        ins = dom.popover({
            target: dom2
        }).popover('this');
        container = ins.$root;
        equal( container.hasClass('ui-in'), false, '初始状态不可见' );

        ua.click( dom[ 0 ] );
        equal( container.hasClass('ui-in'), false, '对dom的交互已经无效' );

        ua.click( dom2[ 0 ] );
        equal( container.hasClass('ui-in'), true, '新的dom交互正确' );

        dom.popover('destroy').remove();
    });

    test('Method: setContent', function () {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        equal( container.text(), 'Hello World', 'ok');
        ins.setContent('abc');
        equal( container.text(), 'abc', 'ok');

        dom.popover('destroy').remove();
    });

    test('Event: show, hide, beforehide', function() {
        var dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture),
            counter = 0,
            ins,
            container;

        ins = dom.popover('this');
        container = ins.$root;

        dom.on( 'show', function(){
            counter++;
        } );

        dom.on( 'hide', function(){
            counter++;
        } );

        ins.show();
        ins.hide();

        dom.one( 'beforehide', function(e){
            e.preventDefault();
        });
        dom.one( 'beforeshow', function(e){
            e.preventDefault();
        });

        ins.show();
        ins.show();

        ins.hide();

        equal( container.hasClass('ui-in'), true, 'ok' );
        equal( counter, 3, 'ok' );

        dom.popover('destroy').remove();

    });

    test('destroy 不清除非组件自动穿件的dom', function () {
        var container = $('<div class="abcd">').appendTo( fixture ),
            dom = $('<a data-content="Hello World">Button</a>').appendTo(fixture);

        dom.popover({
            container: container
        });

        dom.popover('destroy').remove();

        equal( fixture.find('.abcd').length, 1, 'ok' );
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