(function() {
    var fixture;

    module( 'Touch', {
        setup: function() {
            fixture = $( '<div id="fixture"></div>' )
                    .css({
                        position: 'absolute',
                        top: -99999
                    })
                    .appendTo( document.body );
        },

        teardown: function() {
            fixture.off().remove();
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


    test( 'speed swipe', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider('this');

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 100,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 50,
                pageY:50
            }]
        });

        ta.touchend(dom[0]);

        equal( ins.getIndex(), 1);

        setTimeout(function(){
            ta.touchstart(dom[0], {
                touches:[{
                    pageX: 50,
                    pageY:50
                }]
            });

            ta.touchmove(dom[0], {
                touches:[{
                    pageX: 100,
                    pageY:50
                }]
            });

            ta.touchend(dom[0]);
            equal( ins.getIndex(), 0);

            dom.slider('destroy').remove();
            start();
        }, 0)
    } );

    test( 'slow left swipe - less', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider('this');

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 150,
                pageY:50
            }]
        });

        setTimeout(function(){
            ta.touchend(dom[0]);

            // 没有过半，不能滑动
            equal( ins.getIndex(), 0);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( 'slow left swipe', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider('this');

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 99,
                pageY:50
            }]
        });

        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( 'slow right swipe - less', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider({index:1}).slider('this');

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 90,
                pageY:50
            }]
        });

        setTimeout(function(){
            ta.touchend(dom[0]);

            // 没有过半，不能滑动
            equal( ins.getIndex(), 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( 'slow right swipe', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider({index:1}).slider('this');

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 100,
                pageY:50
            }]
        });

        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 0);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( '手指跟随', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({index:1}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY:50
            }]
        });

        approximateEqual( $(items[0]).offset().left-pos, -130);
        approximateEqual( $(items[1]).offset().left-pos, 70);
        approximateEqual( $(items[2]).offset().left-pos, 270);

        ta.touchmove(dom[0], {
            touches:[{
                pageX: -50,
                pageY:50
            }]
        });

        approximateEqual( $(items[0]).offset().left-pos, -250);
        approximateEqual( $(items[1]).offset().left-pos, -50);
        approximateEqual( $(items[2]).offset().left-pos, 150);

        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( '左边缘降速', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY:50
            }]
        });

        ok( $(items[0]).offset().left-pos < 70, '被降速');


        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 0);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( '右边缘降速', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({index:3}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 130,
                pageY:50
            }]
        });

        ok( $(items[3]).offset().left-pos > -70, '被降速');


        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 3);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( 'loop左边缘不降速', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({loop:true}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY:50
            }]
        });

        equal( $(items[0]).offset().left-pos, 70);


        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 0);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( 'loop右边缘不降速', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({index:3, loop:true}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 130,
                pageY:50
            }]
        });

        equal( $(items[3]).offset().left-pos, -70);


        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 3);
            dom.slider('destroy').remove();
            start();
        }, 250);
    } );

    test( '误点击', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            counter = 0,
            items,
            ins,
            target;

        ins = dom.slider({index:3, loop:true}).slider('this');

        target = dom.find('.ui-slider-item:first-child');


        // 模拟浏览器系统行为
        (function( $el ){
            var moved,
                target;
            $el.on('touchstart', function(e){
                moved = false;
                target = e.target;
            }).on('touchmove', function(e){
                e.defaultPrevented || (moved = true);
            }).on('touchend', function(){
                moved || $(target).trigger('click');
            });
        })( fixture );


        dom.on('click', function(e){
            counter++;
        });

        ta.touchstart(target[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(target[0], {
            touches:[{
                pageX: 130,
                pageY:50
            }]
        });

        setTimeout(function(){
            ta.touchend(target[0]);

            
            setTimeout(function(){
                ta.touchstart(target[0], {
                    touches:[{
                        pageX: 200,
                        pageY:50
                    }]
                });
                ta.touchend(target[0]);

                equal( counter, 1);

                dom.slider('destroy').remove();
                start();
            }, 0)
        }, 250);
    } );

    test('stopPropagation', function(){
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            target,
            ins,
            counter=0;

        ins = dom.slider({index:1, stopPropagation:true}).slider('this');
        target = dom.find('.ui-slider-item:first-child');

        fixture.on('touchstart touchmove touchend', function(e){
            counter++;
        });

        ta.touchstart(target[0], {
            touches:[{
                pageX: 200,
                pageY:50
            }]
        });

        ta.touchmove(target[0], {
            touches:[{
                pageX: 130,
                pageY:50
            }]
        });

        ta.touchend(target[0]);

        equal( counter, 0 );

        setTimeout(function(){
            ins._options.stopPropagation = false;

            ta.touchstart(target[0], {
                touches:[{
                    pageX: 200,
                    pageY:50
                }]
            });

            ta.touchmove(target[0], {
                touches:[{
                    pageX: 130,
                    pageY:50
                }]
            });

            ta.touchend(target[0]);

            equal( counter, 3);

            dom.slider('destroy').remove();
            start();
        }, 300);
    });
    

    test('multi touch', function(){
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({index:1}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:50
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY:50
            }]
        });

        equal( $(items[0]).offset().left-pos, -130);
        equal( $(items[1]).offset().left-pos, 70);
        equal( $(items[2]).offset().left-pos, 270);

        ta.touchmove(dom[0], {
            touches:[{
                pageX: -50,
                pageY:50
            }, {}]
        });

        // 由于是多指，所以没有变化
        equal( $(items[0]).offset().left-pos, -130);
        equal( $(items[1]).offset().left-pos, 70);
        equal( $(items[2]).offset().left-pos, 270);

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 50,
                pageY:50
            }, {}]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY:50
            }]
        });

        // 多指的touchstart没有重新定位，所以滑动区间保持不变
        equal( $(items[0]).offset().left-pos, -130);
        equal( $(items[1]).offset().left-pos, 70);
        equal( $(items[2]).offset().left-pos, 270);

        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    });

    test('当是滚动操作时，不会出现手指跟随', function(){
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins;

        ins = dom.slider({index:1}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:0
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY: 80
            }]
        });

        // 由于是滚动操作，所以不会出现手指跟随
        notEqual( $(items[0]).offset().left-pos, -130);
        notEqual( $(items[1]).offset().left-pos, 70);
        notEqual( $(items[2]).offset().left-pos, 270);

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY: 0
            }]
        });

        // 就算后来 y方向的移动少于x方向的移动也是不会手指跟随的
        notEqual( $(items[0]).offset().left-pos, -130);
        notEqual( $(items[1]).offset().left-pos, 70);
        notEqual( $(items[2]).offset().left-pos, 270);
        

        setTimeout(function(){
            ta.touchend(dom[0]);

            equal( ins.getIndex(), 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    });

    test('disableScroll', function(){
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset().left,
            items,
            ins,
            counter = 0;

        fixture.on('touchmove', function( e ){
            e.defaultPrevented || counter++;
        });

        ins = dom.slider({index:1, disableScroll: true}).slider('this');

        items = ins._items;

        ta.touchstart(dom[0], {
            touches:[{
                pageX: 0,
                pageY:0
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 0,
                pageY: 80
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY: 0
            }]
        });

        ins._options.disableScroll = false;

        // 就此次touchmove有效
        ta.touchmove(dom[0], {
            touches:[{
                pageX: 70,
                pageY: 0
            }]
        });
        

        setTimeout(function(){
            ta.touchend(dom[0]);


            equal( counter, 1);
            dom.slider('destroy').remove();
            start();
        }, 250);
    });

    test('multiview', function(){
        stop();

        ua.importsrc('widget/slider/$multiview', function(){

            var dom = $('<div style="width: 200px;">' +
                    '<div> item 1</div>' +
                    '<div> item 2</div>' +
                    '<div> item 3</div>' +
                    '<div> item 4</div>' +
                    '</div>').appendTo( fixture ),
                pos = dom.offset(),
                ins;

            ins = dom.slider({loop:true, index:2}).slider('this');

            equal( ins._slidePos[0], -200);
            equal( ins._slidePos[1], -100);
            equal( ins._slidePos[2], 0);
            equal( ins._slidePos[3], 100);


            ta.touchstart(dom[0], {
                touches:[{
                    pageX: 200,
                    pageY:0
                }]
            });

            ta.touchmove(dom[0], {
                touches:[{
                    pageX: 60,
                    pageY: 0
                }]
            });

            setTimeout(function(){

                ta.touchend(dom[0]);

                equal( ins.getIndex(), 3 );

                
                equal( ins._slidePos[1], -200);
                equal( ins._slidePos[2], -100);
                equal( ins._slidePos[3], 0);
                equal( ins._slidePos[4], 100);
                equal( ins._slidePos[5], 200);

                dom.slider('destroy').remove();
                start();
            }, 250);

        }, 'gmu.Slider.options.viewNum', 'widget/slider/slider');
    });

    test('multiview 2', function(){
            stop();

            var dom = $('<div style="width: 200px;">' +
                    '<div> item 1</div>' +
                    '<div> item 2</div>' +
                    '<div> item 3</div>' +
                    '<div> item 4</div>' +
                    '</div>').appendTo( fixture ),
                pos = dom.offset(),
                ins;

            ins = dom.slider({loop:true, index:2}).slider('this');

            equal( ins._slidePos[0], -200);
            equal( ins._slidePos[1], -100);
            equal( ins._slidePos[2], 0);
            equal( ins._slidePos[3], 100);


            ta.touchstart(dom[0], {
                touches:[{
                    pageX: 0,
                    pageY:0
                }]
            });

            ta.touchmove(dom[0], {
                touches:[{
                    pageX: 140,
                    pageY: 0
                }]
            });

            setTimeout(function(){

                ta.touchend(dom[0]);

                equal( ins.getIndex(), 1 );

                
                equal( ins._slidePos[0], -100);
                equal( ins._slidePos[1], 0);
                equal( ins._slidePos[2], 100);
                equal( ins._slidePos[3], 200);

                dom.slider('destroy').remove();
                start();
            }, 250);
        });

    test('multiview 3', function(){
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider({loop:true, index:2}).slider('this');

        equal( ins._slidePos[0], -200);
        equal( ins._slidePos[1], -100);
        equal( ins._slidePos[2], 0);
        equal( ins._slidePos[3], 100);


        ta.touchstart(dom[0], {
            touches:[{
                pageX: 200,
                pageY:0
            }]
        });

        ta.touchmove(dom[0], {
            touches:[{
                pageX: 40,
                pageY: 0
            }]
        });

        setTimeout(function(){

            ta.touchend(dom[0]);

            equal( ins.getIndex(), 4 );

            
            equal( ins._slidePos[2], -200);
            equal( ins._slidePos[3], -100);
            equal( ins._slidePos[4], 0);
            equal( ins._slidePos[5], 100);
            equal( ins._slidePos[6], 200);

            dom.slider('destroy').remove();
            start();
        }, 250);
    });

    test("destroy",function(){
        ua.destroyTest(function(w,f){

            var container = w.$('<div id="container">' +
                    '<div> item 1</div>' +
                    '<div> item 2</div>' +
                    '<div> item 3</div>' +
                    '<div> item 4</div>' +
                    '</div>');

            w.$("body").append(container);

            var el1= w.dt.eventLength();

            var obj =  container.slider('this');
            obj.destroy();


            var el2= w.dt.eventLength();

            equal(el1,el2, "The event is ok");
            equals(w.$("#container").length, 1, "组件之外的dom没有被移除");
            this.finish();
        });
    });
})();