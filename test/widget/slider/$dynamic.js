(function() {
    var fixture;

    module( 'Dynamic', {
        setup: function() {
            fixture = $( '<div id="fixture"></div>' )
                    .css({
                        position: 'absolute',
                        top: -99999
                    })
                    .appendTo( document.body );
        },

        teardown: function() {
            fixture.remove();
        }
    } );

    test('加载样式', function(){
        expect(1);
        stop();
        ua.loadcss( [ 
                    'reset.css', 
                    'widget/slider/slider.css', 
                    'widget/slider/slider.default.css'
                ], function() {
                    ok(true, '样式加载成功');
                    start();
                });
    });


    test( '不正确的初始化检测', function() {
        expect( 2 );

        var dom = $('<div></div>').appendTo( fixture ),
            items;

        try {
            dom.slider();
        } catch ( ex ) {
            equal( ex.message, '以动态模式使用slider，至少需要传入3组数据', 'ok' );
        }

        try {
            dom.slider({
                content: [
                    { key: 1},
                    { key: 2}
                ],
                template: {
                    item: '<div class="ui-slider-item">I am item <%= key %></div>',
                }
            });
        } catch ( ex ) {
            equal( ex.message, '以动态模式使用slider，至少需要传入3组数据', 'ok' );
        }
    } );

    test( '节点个数检测', function() {
        expect( 1 );

        var dom = $('<div></div>').appendTo( fixture ),
            items;

        dom.slider({
            content: [
                { key: 1},
                { key: 2},
                { key: 3},
                { key: 4}
            ],
            template: {
                item: '<div class="ui-slider-item">I am item <%= key %></div>',
            }
        });

        items = dom.find('.ui-slider-item');
        equal( items.length, 3, 'ok' );
    } );

    test( 'getIndex', function() {
        expect( 8 );

        var dom = $('<div></div>').appendTo( fixture ),
            instance;

        dom.slider({
            content: [
                { key: 1},
                { key: 2},
                { key: 3},
                { key: 4}
            ],
            template: {
                item: '<div class="ui-slider-item">I am item <%= key %></div>',
            },
            index: 1
        });

        instance = dom.slider('this');

        equal(instance._active.key, 2, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 2');

        dom.slider('next');
        equal( dom.slider('getIndex'), 2, 'ok');
        equal(instance._active.key, 3, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 3');

        dom.slider('next');
        equal( dom.slider('getIndex'), 3, 'ok');
        equal(instance._active.key, 4, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 4');
    } );

    test( 'content', function(){
        var dom = $('<div></div>').appendTo( fixture ),
            instance;

        dom.slider({
            content: [
                { key: 1},
                { key: 2},
                { key: 3},
                { key: 4}
            ],
            template: {
                item: '<div class="ui-slider-item">I am item <%= key %></div>',
            },
            index: 1
        });

        instance = dom.slider('this');

        equal( instance.content().length, 4, 'ok');
        instance.content(instance.content().concat({key:5}));
        equal( instance.content().length, 5, 'ok');

        equal(instance._active.key, 2, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 2');

        dom.slider('next');
        equal( dom.slider('getIndex'), 2, 'ok');
        equal(instance._active.key, 3, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 3');

        dom.slider('next');
        equal( dom.slider('getIndex'), 3, 'ok');
        equal(instance._active.key, 4, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 4');

        dom.slider('next');
        equal( dom.slider('getIndex'), 4, 'ok');
        equal(instance._active.key, 5, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 5');

        dom.slider('prev');
        equal( dom.slider('getIndex'), 3, 'ok');
        equal(instance._active.key, 4, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 4');
    });

    
})();