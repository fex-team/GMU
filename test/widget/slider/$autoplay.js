(function() {
    var fixture;

    module( 'Autoplay', {
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

    test( 'autoplay 0-1-2-0', function(){
        expect(4);
        stop();
        var dom = $('<div><div class="ui-slider-group">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '</div></div>').appendTo( fixture ),
            instance;

        instance = new gmu.Slider( dom, {interval: 200} );
        
        equal( instance.getIndex(), 0, 'ok');
        setTimeout(function(){
            equal( instance.getIndex(), 1, 'ok');

            instance.one('slideend', function(){
                setTimeout(function(){
                    equal( instance.getIndex(), 2, 'ok');
                    
                    instance.one('slideend', function(){
                        setTimeout(function(){
                            equal( instance.getIndex(), 0, 'ok' );

                            instance.destroy();
                            dom.remove();
                            start();
                        }, 200);
                    });
                }, 200);
            });
        }, 200);
    } );

    test( 'touch暂停计时器', function(){
        expect(3);
        stop();
        var dom = $('<div><div class="ui-slider-group">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '</div></div>').appendTo( fixture ),
            instance;

        instance = new gmu.Slider( dom, {interval: 200} );
        setTimeout(function(){
            equal( instance.getIndex(), 1, 'ok');

            instance.one('slideend', function(){
                instance.getEl().trigger({type: 'touchstart', touches: [{target: instance.getEl()[0]}]});
                setTimeout(function(){
                    equal( instance.getIndex(), 1, 'still 1');
                    
                    instance.getEl().trigger('touchend');
                    setTimeout(function(){
                        equal( instance.getIndex(), 2, 'ok' );

                        instance.destroy();
                        dom.remove();
                        start();
                    }, 200);
                }, 200);
            });
        }, 200);
    });

    test( 'resume & stop', function(){
        expect(3);
        stop();
        var dom = $('<div><div class="ui-slider-group">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '</div></div>').appendTo( fixture ),
            instance;

        instance = new gmu.Slider( dom, {interval: 200} );
        setTimeout(function(){
            equal( instance.getIndex(), 1, 'ok');

            instance.one('slideend', function(){
                instance.stop();
                instance.stop();
                setTimeout(function(){
                    equal( instance.getIndex(), 1, 'still 1');
                    
                    instance.resume();
                    instance.resume();
                    setTimeout(function(){
                        equal( instance.getIndex(), 2, 'ok' );

                        instance.destroy();
                        dom.remove();
                        start();
                    }, 200);
                }, 200);
            });
        }, 200);
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