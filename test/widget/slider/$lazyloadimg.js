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


    test( '检测图片是否按需加载', function() {
        expect( 3 );

        var dom = $('<div></div>').appendTo( fixture ),
            items;

        dom.slider({
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

        items = dom.find('img[lazyload]');
        equal( items.length, 2, 'ok');

        dom.slider('next');
        items = dom.find('img[lazyload]');
        equal( items.length, 1, 'ok');

        dom.slider('next');
        items = dom.find('img[lazyload]');
        equal( items.length, 0, 'ok');
    } );
    test( 'loop==true,检查加载是否正确', function() {
        expect( 4 );

        var dom = $('<div></div>').appendTo( fixture ),
            items;

        dom.slider({loop: true,
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
        items = dom.find('img[lazyload]');
        equal( items.length, 1, 'ok');
        equal(dom[0].getElementsByTagName('img')[2].src,'','image3图片没有加载');
        dom.slider('prev');
        items = dom.find('img[lazyload]');
        equal( items.length, 0, 'ok');
        ok(/image3/.test(dom[0].getElementsByTagName('img')[2].src),'image3图片加载了');

    } );
    test( '当img没有lazyload属性时，不对它进行lazyload处理', function() {
        expect( 1 );

        var dom = $('<div></div>').appendTo( fixture ),
            items;

        dom.slider({
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
            ],
            template: {
                item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                    '<img src="<%= pic %>" alt="" /></a>' +
                    '<% if( title ) { %><p><%= title %></p><% } %>' +
                    '</div>'
            }
        });

        items = dom.find('img');
        ok( items.attr('src'), 'ok');
    } );
    
})();