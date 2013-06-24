(function() {
    var fixture;

    module( 'Arrow', {
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


    test( 'prev & next', function() {
        stop();

        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture );

        dom.slider();

        ok(dom.find('.ui-slider-pre').length, 'ok');
        ok(dom.find('.ui-slider-next').length, 'ok');

        equal( dom.slider('getIndex'), 0 );

        dom.find('.ui-slider-next').trigger('tap');

        equal( dom.slider('getIndex'), 1 );

        dom.find('.ui-slider-pre').trigger('tap');

        equal( dom.slider('getIndex'), 0 );

        dom.slider('destroy').remove();

        start();

    });
    

    test( 'custom prev next element', function() {
        stop();

        var dom = $('<div>' +
                '<div class="ui-slider-group"><div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div></div>' +
                '<a class="prev">prev</a><a class="next">next</a>'+
                '</div>').appendTo( fixture );

        dom.slider({selector:{prev:'a.prev', next: 'a.next'}});

        equal( dom.slider('getIndex'), 0 );

        dom.find('a.next').trigger('tap');

        equal( dom.slider('getIndex'), 1 );

        dom.find('a.prev').trigger('tap');

        equal( dom.slider('getIndex'), 0 );

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