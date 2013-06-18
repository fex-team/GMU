(function() {
    var fixture;

    module( 'Lazy load image', {
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


    test( '位置检测', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            items;

        dom.slider();

        items = dom.find('.ui-slider-item');
        equal( items.eq(0).offset().left, pos.left, 'ok' );
        equal( items.eq(1).offset().left, pos.left + pos.width/2, 'ok');
        equal( items.eq(2).offset().left, pos.left + pos.width, 'ok' );
        
        dom.slider('next')
            .slider('one', 'slideend', function(){
                equal( items.eq(2).offset().left, pos.left, 'ok' );
                equal( items.eq(3).offset().left, pos.left + pos.width/2, 'ok');
                equal( items.eq(1).offset().left, pos.left - pos.width/2, 'ok' );

                start();
            });
    } );

    test( 'travelSize', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            items;

        dom.slider({travelSize: 1});

        items = dom.find('.ui-slider-item');
        equal( items.eq(0).offset().left, pos.left, 'ok' );
        equal( items.eq(1).offset().left, pos.left + pos.width/2, 'ok');
        equal( items.eq(2).offset().left, pos.left + pos.width, 'ok' );
        
        dom.slider('next')
            .slider('one', 'slideend', function(){
                equal( items.eq(1).offset().left, pos.left, 'ok' );
                equal( items.eq(2).offset().left, pos.left + pos.width/2, 'ok');
                equal( items.eq(0).offset().left, pos.left - pos.width/2, 'ok' );

                start();
            });
    } );


    test( '移动位置测试', function() {
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

        equal( ins._slidePos[0], 0);
        equal( ins._slidePos[1], 100);
        ins.slideTo( 1 );
        equal( ins._slidePos[0], -100);
        equal( ins._slidePos[1], 0);
        equal( ins._slidePos[2], 100);
        equal( ins._slidePos[3], 300);
        start();
    } );

    test( '移动位置测试 & loop', function() {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo( fixture ),
            pos = dom.offset(),
            ins;

        ins = dom.slider({loop:true}).slider('this');

        equal( ins._slidePos.length, 8);
        equal( ins._slidePos[0], 0);
        equal( ins._slidePos[1], 100);
        equal( ins._slidePos[2], 200);
        equal( ins._slidePos[3], 300);
        ins.slideTo( 1 );
        equal( ins._slidePos[0], -100);
        equal( ins._slidePos[1], 0);
        equal( ins._slidePos[2], 100);
        equal( ins._slidePos[7], -200);
        
        ins.one('slideend', function(){
            ins.slideTo( 3 );
            equal( ins._slidePos[1], -200);
            equal( ins._slidePos[2], -100);
            equal( ins._slidePos[3], 0);
            equal( ins._slidePos[4], 100);
            start();
        });
    } );

    // todo 实际位置检测
    
    
})();