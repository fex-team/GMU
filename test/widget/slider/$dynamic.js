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

    test( 'getIndex && active', function() {
        expect( 15 );

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
        //index === to   不做操作
        dom.slider('slideTo',1);
        equal( dom.slider('getIndex'), 1, 'ok');
        //index === this._circle( to )  不做操作
        dom.slider('slideTo',4);
        equal( dom.slider('getIndex'), 1, 'ok');

        dom.slider('next');
        equal( dom.slider('getIndex'), 2, 'ok');
        //测试active
        equal(dom.slider('active').key, 3, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 3');

        dom.slider('next');
        equal( dom.slider('getIndex'), 3, 'ok');
        equal(instance._active.key, 4, 'ok');
        equal( $(instance._items[instance.index]).text(), 'I am item 4');

        equal( instance.active().key, 4, 'ok');

        instance.slideTo(1);
        equal( instance.active().key, 4, '不允许跨1张');
        instance.slideTo(2);
        equal( instance.active().key, 3, 'ok');
        instance.slideTo(1);
        equal( instance.active().key, 2, 'ok');
        instance.slideTo(0);
        equal( instance.active().key, 1, 'ok');

        instance.destroy();
        dom.remove();
    } );

    test( 'position', function() {
        expect( 3 );

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
            index: 3
        });

        instance = dom.slider('this');

        equal( $(instance._items[instance.index]).text(), 'I am item 4');
        equal( instance.index, 2, 'ok');
        equal( instance._pool[2].key, 4, 'ok');
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


    test( 'content 2', function(){
        var dom = $('<div></div>').appendTo( fixture ),
            instance,
            arr;

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
            index: 3
        });

        instance = dom.slider('this');

        arr = instance.content();
        arr.pop();
        arr.push({key:5});
        arr.push({key:6});

        instance.content(arr);
        equal( instance.active().key, 1, 'ok');

        arr.shift();
        arr.unshift({key: -1});

        instance.content(arr);
        equal( instance.active().key, -1, 'ok');

        arr.unshift({key: -2});

        instance.content(arr);
        equal( instance.active().key, -1, 'ok');

        instance.destroy();
        dom.remove();
    });

    test( 'on touchstart的时候会立即进行调整', function(){
        var dom = $('<div></div>').appendTo( fixture ),
            instance,
            arr;

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

        instance.next();
        equal( instance._pool[1].key, 2, 'ok');
        ta.touchstart(dom[0], {
            touches:[{
                pageX: 100,
                pageY:100
            }]
        });
        equal( instance._pool[1].key, 3, 'ok');

        instance.destroy();
        dom.remove();
    });

    test("destroy",function(){
        ua.destroyTest(function(w,f){

            var container = w.$('<div id="container"></div>');

            w.$("body").append(container);

            var el1= w.dt.eventLength();

            var content = new w.Object();

            content = $.extend( content, {
                content: [{
                        key: 1
                    }, {
                        key: 2
                    }, {
                        key: 3
                    }, {
                        key: 4
                    }
                ],
                template: {
                    item: '<div class="ui-slider-item">I am item <%= key %></div>',
                },
                index: 1
            });

            var obj = container.slider(content).slider('this');
            obj.destroy();

            var el2= w.dt.eventLength();

            equal(el1,el2, "The event is ok");
            equals(w.$("#container").length, 1, "组件之外的dom没有被移除");

            this.finish();
        });
    });

    
})();