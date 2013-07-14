(function () {
    var fixture;

    module('Navigator', {
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
            'widget/navigator/navigator.css',
            'widget/navigator/navigator.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });

    test('dom 初始化 render', function(){
        var dom = $('<div></div>').appendTo(fixture);

        dom.navigator({
            content: [
                'item1',
                {
                    text: 'item2',
                    href: '#item2'
                },

                'item3'
            ]
        });


        var items = dom.find('ul>li>a');

        equal( items.eq(0).text(), 'item1' );
        equal( items.eq(1).text(), 'item2' );
        equal( items.eq(2).text(), 'item3' );
        equal( items.eq(1).attr('href'), '#item2' );

        dom.navigator('destroy').remove();
    });

    test('dom 初始化 setup', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        dom.navigator();


        ok( dom.find('ul').hasClass('ui-navigator-list'), 'ok');

        equal( dom.navigator('getIndex'), 1 );

        dom.navigator('destroy').remove();
    });

    test('dom 初始化 setup 2', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        dom.navigator();


        ok( dom.find('ul').hasClass('ui-navigator-list'), 'ok');

        equal( dom.navigator('getIndex'), 0 );

        dom.navigator('destroy').remove();
    });

    test('dom 初始化 setup 3', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        dom.navigator({index: 2});


        ok( dom.find('ul').hasClass('ui-navigator-list'), 'ok');

        equal( dom.navigator('getIndex'), 2 );

        dom.navigator('destroy').remove();
    });

    test('dom 初始化 setup 4', function(){
        var dom = $('<ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '</ul>').appendTo(fixture);

        dom.navigator();


        ok( dom.hasClass('ui-navigator-list'), 'ok');

        ok( dom.parent().is('div.ui-navigator'), 'ok' );

        dom.navigator('destroy').remove();
    });

    test('交互', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li class="ui-state-disable"><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this');

        equal( ins.getIndex(), 1 );
        ua.click( dom.find('ul li a').get(0));
        equal( ins.getIndex(), 0 );

        ua.click( dom.find('ul li a').get(2));
        equal( ins.getIndex(), 0 );

        dom.find('ul li').eq(2).removeClass('ui-state-disable');
        ua.click( dom.find('ul li a').get(2));
        equal( ins.getIndex(), 2 );

        dom.navigator('destroy').remove();
    });

    test('方法switchTo', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li class="ui-state-disable"><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this'),
            counter = 0;

        ins.on('select', function(){counter++;});
        ins.switchTo( 0 );
        ins.switchTo( 0 ); // 只有一次有效，所以counter只是1
        equal( ins.getIndex(), 0 );

        equal( counter, 1 );


        dom.navigator('destroy').remove();
    });

    test('方法unselect', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li class="ui-state-disable"><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this');

        ins.unselect();
        equal( ins.getIndex(), -1 );
        equal( dom.find('li.ui-state-active').length, 0 );


        dom.navigator('destroy').remove();
    });

    test('事件', function(){
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li class="ui-state-disable"><a>item3</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this'),
            counter = 0;

        ins.on('select', function(){
            counter++;
        });

        ins.switchTo(0);

        ins.one('beforeselect', function(e){
            e.preventDefault();
        });

        ins.switchTo(1);
        ins.switchTo(2);

        equal( counter, 2 );
        dom.navigator('destroy').remove();
    });

    test("destroy event", function () {
        ua.destroyTest(function (w, f) {

            var elem = w.$('<div id="navigator"><ul>' +
                '<li><a>item1</a></li>' +
                '<li class="ui-state-active"><a>item2</a></li>' +
                '<li class="ui-state-disable"><a>item3</a></li>' +
                '</ul></div>');

            w.$("body").append(elem);

            var el1 = w.dt.eventLength();

            var obj = elem.navigator('this');
            obj.destroy();


            var el2 = w.dt.eventLength();

            equal(el1, el2, "The event is ok");
            equals(w.$("#navigator").length, 1, "dom没有被移出");
            this.finish();
        });
    });

})();