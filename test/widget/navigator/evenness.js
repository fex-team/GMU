(function () {
    var fixture;

    module('Evenness', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    width: 300,
                    height: 300,
                    background: '#fff',
                    top: -99999
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

    test('window visibleCount', function(){
        // 默认竖屏显示4个，横屏显示6个

        expect(2);
        stop();
        ua.frameExt(function(w, f){
            var me = this;
            ua.loadcss(["reset.css", "widget/navigator/navigator.css", "widget/navigator/navigator.default.css"], function(){
                w.$("html").css("overflow", "hidden");
                w.$("body").css("height", 150).css("width", 300);//在Andriod UC下默认不是300,要设置一下
                // iframe 默认是300x150的

                var dom = w.$('<div><ul>' +
                '<li><a>i1</a></li>' +
                '<li><a>i2</a></li>' +
                '<li><a>i3</a></li>' +
                '<li><a>i4</a></li>' +
                '<li><a>i5</a></li>' +
                '<li><a>i6</a></li>' +
                '</ul></div>').appendTo('body');


                var ins = dom.navigator('this');

                // 把a的内边距去掉，否则width不能设置成功
                w.$('.ui-navigator-list li a').css('padding', '0');


                approximateEqual( dom.find('li').width(), 300/6 );


                setTimeout(function(){
                    $(f).css("height", 300).css("width", 150);
                    w.$("body").css("height", 300).css("width", 150);
                    setTimeout(function(){
                        approximateEqual( dom.find('li').width(), 150/4 );
                        me.finish();
                    }, 300);
                }, 200);
            }, w);
        });
    });

    test('window visibleCount 2', function(){
        // 初始化的时候配置成了横屏7个竖屏5个

        expect(2);
        stop();
        ua.frameExt(function(w, f){
            var me = this;
            ua.loadcss(["reset.css", "widget/navigator/navigator.css", "widget/navigator/navigator.default.css"], function(){
                w.$("html").css("overflow", "hidden");
                w.$("body").css("height", 150).css("width", 300);
                // iframe 默认是300x150的

                var dom = w.$('<div><ul>' +
                '<li><a>i1</a></li>' +
                '<li><a>i2</a></li>' +
                '<li><a>i3</a></li>' +
                '<li><a>i4</a></li>' +
                '<li><a>i5</a></li>' +
                '<li><a>i6</a></li>' +
                '</ul></div>').appendTo('body');

                var ins = dom.navigator({
                    visibleCount: {
                        portrait: 5,
                        landscape: 7
                    }
                }).navigator('this');

                w.$('.ui-navigator-list li a').css('padding', '0');


                approximateEqual( dom.find('li').width(), 300/7 );


                setTimeout(function(){
                    $(f).css("height", 300).css("width", 150);
                    w.$("body").css("height", 300).css("width", 150);
                    setTimeout(function(){
                        approximateEqual( dom.find('li').width(), 150/5 );
                        me.finish();
                    }, 300);
                }, 200);
            }, w);
        });
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