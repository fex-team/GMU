(function() {
    var fixture;

    module( 'imgzoom', {
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


    test( '检测图片是否正常缩放', function() {
        stop();
        expect( 12 );

        var dom = $('<div style="width:200px;">' +
                '<div><img src="../../widget/css/slider/image1.png" /></div>' +
                '<div><img src="../../widget/css/slider/image2.png" /></div>' +
                '<div><img src="../../widget/css/slider/image3.png" /></div>' +
            '</div>').appendTo( fixture ),
            items,
            count = 3;
        dom.slider();
        dom.find('img').on('load', function(e){
            count--;
            approximateEqual(e.target.width, 200);
            count || (function(){
                dom.css({width: 100, height:1000});
                $(window).trigger('ortchange');

                dom.find('img').each(function(){
                    approximateEqual(this.width, 100);
                });

                dom.css({width: 200, height:1000});
                $(window).trigger('ortchange');

                dom.find('img').each(function(){
                    approximateEqual(this.width, 200);
                });

                dom.css({width: 1000, height:1000});
                $(window).trigger('ortchange');

                dom.find('img').each(function(){
                    approximateEqual(this.width, this.naturalWidth);
                });

                start();
            })();
        });
        
    } );

    test( '只缩放指定类型图片', function() {
        stop();
        expect( 4 );

        var dom = $('<div style="width:200px;">' +
                '<div><img class="zoomme" src="../../widget/css/slider/image1.png" /></div>' +
                '<div><img class="ignoreme" src="../../widget/css/slider/image2.png" /></div>' +
            '</div>').appendTo( fixture ),
            items,
            count = 2;
        dom.slider({imgZoom: 'img.zoomme'});
        dom.find('img').on('load', function(e){
            count--;
            $(e.target).is('.zoomme') ? approximateEqual(e.target.width, 200) : approximateEqual( e.target.width, e.target.naturalWidth );
            count || (function(){
                dom.css({width: 100, height:1000});
                $(window).trigger('ortchange');

                dom.find('img').each(function(){
                    $(this).is('.zoomme') ? approximateEqual(this.width, 100) : approximateEqual( this.width, this.naturalWidth );
                });

                dom.slider('destroy').remove();
                start();
            })();
        });
        
    } );

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


    test('work with dynamic', function(){
        expect(1);
        stop();

        ua.importsrc('widget/slider/$dynamic', function(){
            var dom = $('<div style="width:200px;"></div>').appendTo( fixture ),
                items;

            dom.slider({
                index: 1,
                content: [
                    {
                        href: "#",
                        pic: "../../widget/css/slider/image1.png",
                        title: "让Coron的太阳把自己晒黑—小天..."
                    },

                    {
                        href: "#",
                        pic: "../../widget/css/slider/image2.png",
                        title: "让Coron的太阳把自己晒黑—小天..."
                    },
                    {
                        href: "#",
                        pic: "../../widget/css/slider/image3.png",
                        title: "让Coron的太阳把自己晒黑—小天..."
                    },
                    {
                        href: "#",
                        pic: "../../widget/css/slider/image4.png",
                        title: "让Coron的太阳把自己晒黑—小天..."
                    }
                ]
            });
            
            dom.slider( 'one', 'slideend', function(){

                
            });

            dom.slider('next');
            setTimeout(function(){
                dom.find('img[src$="image4.png"]').each(function(){
                    var el = this;
                    if(!this.naturalWidth) {
                        setTimeout( 100, arguments.callee );
                        return ;
                    }
                    approximateEqual(el.width, 200);
                    
                    dom.slider('destroy').remove();
                    start();
                });
            }, 500);
        }, 'gmu.Slider', 'widget/slider/slider');
    });

    
    
    
})();