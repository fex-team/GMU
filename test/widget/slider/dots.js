(function() {
    var fixture;

    module( 'Dots', {
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


    test( 'basic', function() {
        stop();

        var dom = $('<div>' +
                '<div class="ui-slider-group"><div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div></div>' +
                '</div>').appendTo( fixture );

        dom.slider();

        ok( dom.find('.ui-slider-dots').length );
        equal( dom.find('.ui-slider-dots .ui-state-active').index(), 0 );

        dom.slider('next');

        equal( dom.find('.ui-slider-dots .ui-state-active').index(), 1 );

        dom.slider('next');

        equal( dom.find('.ui-slider-dots .ui-state-active').index(), 2 );

        dom.slider('destroy').remove();
        start();
    });

    test( 'custom nav elements', function() {
        stop();

        var dom = $('<div>' +
                '<div class="ui-slider-group"><div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div></div>' +
                '<ul class="nav"><li>1</li><li>2</li><li>3</li><li>4</li></ul>'+
                '</div>').appendTo( fixture );

        dom.slider({ selector:{dots:'ul.nav'}});

        equal( dom.find('ul.nav .ui-state-active').index(), 0 );

        dom.slider('next');

        equal( dom.find('ul.nav .ui-state-active').index(), 1 );

        dom.slider('next');

        equal( dom.find('ul.nav .ui-state-active').index(), 2 );

        dom.slider('destroy').remove();
        start();
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