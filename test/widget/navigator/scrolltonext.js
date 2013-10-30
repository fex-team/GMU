(function () {
    var fixture;

    module('Evenness', {
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

        var ins = dom.navigator('this');

        var within = dom.offset(),
            el = dom.find('ul li').eq(4).offset();

        ok( el.left + el.width > within.left + within.width, 'item4不可见');
        ins.switchTo(3);

        ins.$el.iScroll('this').options.onScrollEnd = function() {
            el = dom.find('ul li').eq(4).offset();
            
            ok( el.left + el.width <= within.left + within.width, 'item4可见');

            dom.navigator('destroy').remove();
            start();
        }
    });

    test('功能检测', function(){
        stop();

        var dom = $('<div><ul>' +
                '<li><a>item1</a></li>' +
                '<li><a>item2</a></li>' +
                '<li><a>item3</a></li>' +
                '<li class="ui-state-active"><a>item4</a></li>' +
                '<li><a>item5</a></li>' +
                '<li><a>item6</a></li>' +
                '</ul></div>').appendTo(fixture);

        var ins = dom.navigator('this');

        var within = dom.offset(),
            el = dom.find('ul li').eq(4).offset();

        ins.$el.iScroll('this').options.onScrollEnd = function() {
            el = dom.find('ul li').eq(4).offset();
            
            ok( el.left + el.width <= within.left + within.width, 'item4可见');

            
            el = dom.find('ul li').eq(0).offset();
            ok( el.left < within.left, 'item1不可见');
            ins.switchTo(1);

            ins.$el.iScroll('this').options.onScrollEnd = function() {
                el = dom.find('ul li').eq(0).offset();
                
                ok( el.left >= within.left, 'item1可见');

                dom.navigator('destroy').remove();
                start();
            }
        }
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