(function () {
    var fixture;

    module('Scrollable', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    width: 300,
                    height: 300,
                    background: '#fff'
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

    test('功能检测', function(){
        stop();

        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '<li><a>item4</a></li>' +
                '<li><a>item5</a></li>' +
                '<li><a>item6</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this'),
            el = dom.find('ul')[0],
            scrollWidth = el.offsetWidth - dom.width();

        equal( dom.children().attr('class'), 'ui-scroller');

        ta.touchstart(el, {
            touches:[{
                pageX: scrollWidth + 100,
                pageY:0
            }]
        });
        ua.mousedown(el, {
                clientX: scrollWidth + 100,
                clientY:0
        });

        setTimeout(function(){
            ta.touchmove(el, {
                touches:[{
                    pageX: 0,
                    pageY:0
                }]
            });
            ua.mousemove(el, {
                    clientX: 0,
                    clientY:0
            });

            setTimeout(function(){
                ta.touchend(el);
                ua.mouseup(el);

                ins.$el.iScroll('this').options.onScrollEnd = function() {
                    // 表明可滚动了，且正好滚到底了。
                    ok( -3 < Math.abs(dom.find('ul li').first().offset().left) - Math.abs(dom.offset().left - scrollWidth) < 3, '移动距离正常');

                    dom.navigator('destroy').remove();
                    start();
                }

            }, 50);

        }, 50);
    });

    test('检测Refresh是否在ortchange的时候执行了', function(){
        stop();
        expect(2);
        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '<li><a>item4</a></li>' +
                '<li><a>item5</a></li>' +
                '<li><a>item6</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this'),
            el = dom.find('ul')[0];

        ins.on('refresh.iScroll', function() {
            ok( true, 'Refresh执行了');
        });

        fixture.css({
            width: 200
        });
        $(window).trigger('ortchange');

        var scrollWidth = el.offsetWidth - dom.width();

        ta.touchstart(el, {
            touches:[{
                pageX: scrollWidth + 100,
                pageY:0
            }]
        });

        ua.mousedown(el, {
                clientX: scrollWidth + 100,
                clientY:0
        });

        setTimeout(function(){
            ta.touchmove(el, {
                touches:[{
                    pageX: 0,
                    pageY:0
                }]
            });
            ua.mousemove(el, {
                    clientX: 0,
                    clientY:0
            });

            setTimeout(function(){
                ta.touchend(el);
                ua.mouseup(el);



                ins.$el.iScroll('this').options.onScrollEnd = function() {
                    // 表明可滚动了，且正好滚到底了。
                    approximateEqual( dom.find('ul li').first().offset().left, dom.offset().left - scrollWidth);

                    dom.navigator('destroy').remove();
                    start();
                }
            }, 50);

        }, 50);
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