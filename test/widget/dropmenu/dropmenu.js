(function () {
    var fixture;

    module('Dropmenu', {
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

    test('内容自动创建', function () {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            container;

        dom.dropmenu();

        container = dom.next();

        ok( container.hasClass('ui-dropmenu'), '添加了正确的className' );
        equal( container.find('ul li').length, 4 );
        equal( container.find('ul li:first-child').text(), 'item1' );
        equal( container.find('ul li:last-child').text(), 'item3' );

        dom.dropmenu('destroy');
        dom.remove();

        dom = $('<a>Button</a>').appendTo(fixture);
        dom.dropmenu({
            content: [ 'a', 'b', 'c' ]
        });

        container = dom.next();

        ok( container.hasClass('ui-dropmenu'), '添加了正确的className' );
        equal( container.find('ul li').length, 3 );
        equal( container.find('ul li:first-child').text(), 'a' );
        equal( container.find('ul li:last-child').text(), 'c' );

        dom.dropmenu('destroy').remove();
    });

    test( 'content类型检测', function(){
        var dom = $('<a>Button</a>').appendTo(fixture),
            container,
            li;

        dom.dropmenu({
            content: [
                'item1',

                {
                    text: 'item2'
                },

                'divider',

                'item3',

                {
                    text: 'divider'
                }
            ]
        });

        container = dom.next();
        li = container.find('ul li');

        equal( li.eq(0).text(), 'item1' );
        equal( li.eq(1).text(), 'item2' );
        ok( li.eq(2).hasClass('divider') );
        equal( li.eq(3).text(), 'item3' );
        ok( li.eq(4).hasClass('divider') );

        dom.dropmenu('destroy').remove();
    });

    test('指定内容节点', function () {
        var container = $('<div class="abcd"></div>').appendTo( fixture ),
            dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture);

        dom.dropmenu({
            container: container
        });

        ok( container.hasClass('ui-dropmenu'), '添加了正确的className' );
        equal( container.find('ul li').length, 4 );
        equal( container.find('ul li:first-child').text(), 'item1' );
        equal( container.find('ul li:last-child').text(), 'item3' );

        // 内容节点应该在前面才对
        equal( dom.next().length, 0, '没有在下个节点处创建内容节点');

        dom.dropmenu('destroy').remove();
    });

    test('当传入内容节点是个选择器，并且没有找到，也会自动创建', function () {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture);

        dom.dropmenu({
            container: '#bucunzaideyuansuid'    // 不存在的元素id
        });

        container = dom.next();

        ok( container.hasClass('ui-dropmenu'), '添加了正确的className' );
        
        dom.dropmenu('destroy').remove();
    });

    test('当没有指定content, dom中有现成的', function () {
        var container = $('<div class="abcd"><ul><li><a>a</a></li><li><a>b</a></li></ul></div>').appendTo(fixture),
            dom = $('<a>Button</a>').appendTo(fixture);


        dom.dropmenu({
            container: container
        });

        ok( container.hasClass('ui-dropmenu'), '添加了正确的className' );
        ok( container.find('ul').hasClass('ui-dropmenu-items'), '添加了正确的className');
        
        dom.dropmenu('destroy').remove();
    });

    test('Method: show & hide & toggle', function () {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
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

        dom.dropmenu('destroy').remove();
    });


    test('Method: target', function () {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            dom2 = $('<a>Button 2</a>').appendTo(fixture),
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        equal( ins.target().get(0), dom.get(0), '获取没问题' );

        ins.target( dom2 );

        equal( container.hasClass('ui-in'), false, '初始状态不可见' );

        ua.click( dom[ 0 ] );
        equal( container.hasClass('ui-in'), false, '对dom的交互已经无效' );

        ua.click( dom2[ 0 ] );
        equal( container.hasClass('ui-in'), true, '新的dom交互正确' );

        dom.dropmenu('destroy').remove();
    });

    test('Event: show, hide, beforehide', function() {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            counter = 0,
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        dom.on( 'show', function(){
            counter++;
        } );

        dom.on( 'hide', function(){
            counter++;
        } );

        ins.show();
        ins.hide();

        dom.one( 'beforeshow', function(e){
            e.preventDefault();
        });

        dom.one( 'beforehide', function(e){
            e.preventDefault();
        });

        ins.show();
        ins.show();

        ins.hide();

        equal( container.hasClass('ui-in'), true, 'ok' );
        equal( counter, 3, 'ok' );

        dom.dropmenu('destroy').remove();

    });

    test('Event: itemclick', function() {
        var dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture),
            counter = 0,
            ins,
            container;

        ins = dom.dropmenu('this');
        container = ins.$root;

        ins.show();

        dom.one('itemclick', function( e, li ) {
            counter++;
            equal($(li).text(), 'item1');
        });
        ua.click(container.find('ul li').get(0));

        ok( !container.hasClass('ui-in'));
        ins.show();

        dom.one('itemclick', function( e, li ) {
            counter++;
            equal($(li).text(), 'item2');
            e.preventDefault();
        });
        ua.click(container.find('ul li').get(1));

        ok( container.hasClass('ui-in'));

        dom.one('itemclick', function( e, li ) {
            counter++;
            equal($(li).text(), 'item3');
            e.preventDefault();
        });
        // 是分割线不会触发itemclick
        ua.click(container.find('ul li').get(2));
        ua.click(container.find('ul li').get(3));

        equal( counter, 3 );

        dom.dropmenu('destroy').remove();

    });

    test('destroy 不清除非组件自动穿件的dom', function () {
        var container = $('<div class="abcd">').appendTo( fixture ),
            dom = $('<a data-content=\'["item1", "item2", "divider", "item3"]\'>Button</a>').appendTo(fixture);
            

        dom.dropmenu({
            container: container
        });

        dom.dropmenu('destroy').remove();

        equal( fixture.find('.abcd').length, 1, 'ok' );
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