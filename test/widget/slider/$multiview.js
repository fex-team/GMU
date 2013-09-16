(function () {
    var fixture;

    module('Lazy load image', {
        setup:function () {
            fixture = $('<div id="fixture"></div>')
                .css({
                    position:'absolute',
                    top:-99999
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
            'widget/slider/slider.css',
            'widget/slider/slider.default.css'
        ], function () {
            ok(true, '样式加载成功');
            start();
        });
    });


    test('位置检测', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            items;

        dom.slider();

        items = dom.find('.ui-slider-item');

        approximateEqual(items.eq(0).offset().left, pos.left, 'ok');
        approximateEqual(items.eq(1).offset().left, pos.left + pos.width / 2, 'ok');
        approximateEqual(items.eq(2).offset().left, pos.left + pos.width, 'ok');

        dom.slider('one', 'slideend',function () {

            // 强制reflow
            dom[0].clientLeft;
            setTimeout(function () {

                approximateEqual(items.eq(2).offset().left, pos.left, 'ok');
                approximateEqual(items.eq(3).offset().left, pos.left + pos.width / 2, 'ok');
                approximateEqual(items.eq(1).offset().left, pos.left - pos.width / 2, 'ok');


                dom.slider('one', 'slideend',function () {

                    // 强制reflow
                    dom[0].clientLeft;

                    setTimeout(function () {
                        approximateEqual(items.eq(0).offset().left, pos.left, 'ok');
                        approximateEqual(items.eq(1).offset().left, pos.left + pos.width / 2, 'ok');
                        approximateEqual(items.eq(2).offset().left, pos.left + pos.width, 'ok');

                        dom.slider('destroy').remove();
                        start();
                    }, 500);
                }).slider('prev');
            }, 500);
        }).slider('next');
    });

    test('travelSize', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            items;

        dom.slider({travelSize:1});

        items = dom.find('.ui-slider-item');
        approximateEqual(items.eq(0).offset().left, pos.left, 'ok');
        approximateEqual(items.eq(1).offset().left, pos.left + pos.width / 2, 'ok');
        approximateEqual(items.eq(2).offset().left, pos.left + pos.width, 'ok');

        dom.slider('next')
            .slider('one', 'slideend', function () {
                setTimeout(function () {
                    approximateEqual(items.eq(1).offset().left, pos.left, 'ok');
                    approximateEqual(items.eq(2).offset().left, pos.left + pos.width / 2, 'ok');
                    approximateEqual(items.eq(0).offset().left, pos.left - pos.width / 2, 'ok');

                    dom.slider('destroy').remove();
                    start();
                }, 500);
            });
    });

    test('travelSize 2', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            items;

        dom.slider({travelSize:2});

        items = dom.find('.ui-slider-item');
        approximateEqual(items.eq(0).offset().left, pos.left, 'ok');
        approximateEqual(items.eq(1).offset().left, pos.left + pos.width / 2, 'ok');
        approximateEqual(items.eq(2).offset().left, pos.left + pos.width, 'ok');

        dom.slider('slideTo', 1)
            .slider('one', 'slideend', function () {
                setTimeout(function () {
                    approximateEqual(items.eq(1).offset().left, pos.left, 'ok');
                    approximateEqual(items.eq(2).offset().left, pos.left + pos.width / 2, 'ok');
                    approximateEqual(items.eq(0).offset().left, pos.left - pos.width / 2, 'ok');

                    dom.slider('next');

                    // 不能是3
                    equal(dom.slider('getIndex'), 2, 'ok');

                    dom.slider('next');
                    equal(dom.slider('getIndex'), 2, 'ok');// 到达边缘不能再移动


                    dom.slider('slideTo', 0);
                    dom.slider('prev');
                    equal(dom.slider('getIndex'), 0, 'ok');// 到达边缘不能再移动

                    dom.slider('destroy').remove();
                    start();
                }, 500);
            });
    });

    test('travelSize 3', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            items;

        dom.slider({travelSize:2, loop:true});

        items = dom.find('.ui-slider-item');
        approximateEqual(items.eq(0).offset().left, pos.left, 'ok');
        approximateEqual(items.eq(1).offset().left, pos.left + pos.width / 2, 'ok');
        approximateEqual(items.eq(2).offset().left, pos.left + pos.width, 'ok');

        dom.slider('slideTo', 7)
            .slider('one', 'slideend', function () {
                setTimeout(function () {
                    approximateEqual(items.eq(7).offset().left, pos.left, 'ok');
                    approximateEqual(items.eq(0).offset().left, pos.left + pos.width / 2, 'ok');

                    dom.slider('next');

                    equal(dom.slider('getIndex'), 1, 'ok');

                    dom.slider('next');
                    equal(dom.slider('getIndex'), 3, 'ok');


                    dom.slider('slideTo', 0);
                    dom.slider('prev');
                    equal(dom.slider('getIndex'), 6, 'ok');

                    dom.slider('destroy').remove();
                    start();
                }, 500);
            });
    });


    test('移动位置测试', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            ins;

        ins = dom.slider('this');

        equal(ins._slidePos[0], 0);
        equal(ins._slidePos[1], 100);
        ins.slideTo(1);
        equal(ins._slidePos[0], -100);
        equal(ins._slidePos[1], 0);
        equal(ins._slidePos[2], 100);
        equal(ins._slidePos[3], 300);

        // 测试next到头的情况
        ins.slideTo(2);
        equal(ins.getIndex(), 2);
        ins.next();
        equal(ins.getIndex(), 2);
        ins.next();

        dom.slider('destroy').remove();
        start();
    });

    test('移动位置测试 & loop', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            ins;

        ins = dom.slider({loop:true}).slider('this');

        equal(ins._slidePos.length, 8);
        equal(ins._slidePos[0], 0);
        equal(ins._slidePos[1], 100);
        equal(ins._slidePos[2], 200);
        equal(ins._slidePos[3], 300);
        ins.slideTo(1);
        equal(ins._slidePos[0], -100);
        equal(ins._slidePos[1], 0);
        equal(ins._slidePos[2], 100);
        equal(ins._slidePos[7], -200);

        ins.one('slideend', function () {
            ins.slideTo(3);
            equal(ins._slidePos[1], -200);
            equal(ins._slidePos[2], -100);
            equal(ins._slidePos[3], 0);
            equal(ins._slidePos[4], 100);

            dom.slider('destroy').remove();
            start();
        });
    });

    test('移动位置测试 & loop - 特需', function () {
        stop();

        var dom = $('<div style="width: 200px;">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset(),
            ins;

        ins = dom.slider({loop:true, index:2}).slider('this');

        equal(ins._slidePos[2], 0);
        equal(ins._slidePos[3], 100);
        ins.slideTo(9);
        equal(ins._slidePos[1], 0);
        equal(ins._slidePos[2], 100);
        equal(ins._slidePos[3], 200);

        dom.slider('destroy').remove();
        start();

    });

    test("destroy", function () {
        ua.destroyTest(function (w, f) {

            var container = w.$('<div id="container">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>');

            w.$("body").append(container);

            var el1 = w.dt.eventLength();

            var obj = container.slider('this');
            obj.destroy();


            var el2 = w.dt.eventLength();

            equal(el1, el2, "The event is ok");
            equals(w.$("#container").length, 1, "组件之外的dom没有被移除");
            this.finish();
        });
    });


})();