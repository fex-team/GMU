(function () {
    var fixture;

    module('Basic slider', {
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

    test('通过类初始化', function () {
        var dom = $('<div><div class="ui-slider-group">' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div></div>').appendTo(fixture),
            instance;

        instance = new gmu.Slider(dom);
        ok(dom.hasClass('ui-slider'), '外层dom class name正确');
        ok(dom.find('.ui-slider-group').children().hasClass('ui-slider-item'),
            'item class name正确');

        instance.destroy();
        dom.remove();
    });

    test('通过zepto实例初始化', function () {
        var dom = $('<div><div class="ui-slider-group">' +
            '<div> item 1</div>' +
            '<div> item 2</div>' +
            '<div> item 3</div>' +
            '<div> item 4</div>' +
            '</div></div>').appendTo(fixture);

        // general mode
        dom.slider();

        ok(dom.hasClass('ui-slider'), '外层dom class name正确');
        ok(dom.find('.ui-slider-group').children().hasClass('ui-slider-item'),
            'item class name正确');

        dom.slider('destroy');
        dom.remove();
    });

    test('dom初始化检测', function () {
        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            child1 = dom.children().get(0),
            child2 = dom.children().get(1),
            container;

        dom.slider();

        container = dom.find('.ui-slider-group');

        equal(container.children().get(0), child1, '如果没有指定容器，跟元素下的孩子节点将作为可滚动item');
        equal(container.children().get(1), child2, '如果没有指定容器，跟元素下的孩子节点将作为可滚动item');

        dom.slider('destroy').remove();
    });

    test('通过ul实例化', function () {
        expect(2);

        var dom = $('<ul>' +
                '<li> item 1</li>' +
                '<li> item 2</li>' +
                '<li> item 3</li>' +
                '<li> item 4</li>' +
                '</ul>').appendTo(fixture),
            items;

        dom.slider();

        ok(dom.hasClass('ui-slider-group'), 'ok');
        ok(dom.parent().hasClass('ui-slider'), 'ok');
    });

    test('其他dom结构初始化检测', function () {
        var dom = $('<div><ul><li>item1</li><li>item2</li><li>item3</li>' +
                '</ul></div>').appendTo(fixture),
            container = dom.find('ul').get(0),
            child1 = container.childNodes[0];


        dom.slider({ selector:{ container:'ul'}});

        equal(dom.find('.ui-slider-group').get(0), container, 'contianer被指定为ul');
        equal(dom.find('.ui-slider-item').get(0), child1, 'container下的节点, 被当做可滑动item');
        dom.slider('destroy').remove();
    });

    test('Render 内容 & template', function () {
        expect(3);

        var dom = $('<div></div>').appendTo(fixture),
            items;

        dom.slider({
            content:[
                { key:1},
                { key:2},
                { key:3}
            ],
            template:{
                item:'<div class="ui-slider-item">I am item <%= key %></div>',
            }
        });

        items = dom.find('.ui-slider-item');

        equal(items.eq(0).text(), 'I am item 1', 'ok');
        equal(items.eq(1).text(), 'I am item 2', 'ok');
        equal(items.eq(2).text(), 'I am item 3', 'ok');
        dom.slider('destroy').remove();
    });

    test('loop条件检测', function () {
        var dom = $('<div>' +
                '<div> item 1</div>' +
                '</div>'),
            instance;

        instance = dom.slider({loop:true}).slider('this');
        ok(!instance._options.loop, '当节点只有一个时不具备loop条件');
        instance.destroy();

        dom = $('<div>' +
            '<div> item 1</div>' +
            '<div> item 2</div>' +
            '</div>');

        dom.slider({loop:true});
        equal(dom.find('.ui-slider-item').length, 4, '当节点为2，且loop为true是，' +
            '由于不具备loop条件，会自动复制一份来达到loop条件');

        dom.slider('destroy').remove();
    });

    test('width slider width跟根节点宽度保持一致，跟屏幕大小无关', function () {
        var dom = $('<div>' +
            '<div> item 1</div>' +
            '</div>').appendTo(fixture);

        dom.css('width', 200);
        dom.slider();
        equal(dom.find('.ui-slider-item').width(), 200, '可滑item,与根节点宽度保持一致');

        dom.find('.ui-slider-item').css('padding', 20);
        equal(dom.find('.ui-slider-item').width(), 200, 'item可设置padding, 但不影响宽度');

        dom.slider('destroy').remove();
    });

    test('width 在ortchange的时候应该自动更新', function () {
        expect(3);
        var dom = $('<div>' +
                '<div> item 1</div>' +
                '</div>').appendTo(fixture),
            instance,
            _arrange;

        dom.css('width', 200);
        dom.slider();
        equal(dom.find('.ui-slider-item').width(), 200, '可滑item,与根节点宽度保持一致');

        instance = dom.slider('this');
        _arrange = instance._arrange;
        instance._arrange = function () {
            ok(true, 'ok');
            return _arrange.apply(this, arguments);
        };

        dom.css('width', 300);
        $(window).trigger('ortchange');
        equal(dom.find('.ui-slider-item').width(), 300, 'ortchange后，宽度更新');

        $(window).trigger('ortchange');

        dom.slider('destroy').remove();
    });

    test('index初始指定其他值', function () {
        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '</div>').appendTo(fixture),
            start = dom.offset().left;

        dom.slider({index:1});
        ok(dom.find('.ui-slider-item').eq(0).offset().left < start, '当前第一个item不在可视区');
        equal(dom.find('.ui-slider-item').eq(1).offset().left, start, '当前第二个item在可视区');
        dom.slider('destroy').remove();
    });

    test('slideTo', function () {
        expect(4);
        stop();

        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset().left,
            ins,
            items;

        ins = dom.slider('this');

        items = dom.find('.ui-slider-item');
        equal(items.eq(0).offset().left, pos, '当前第一个可见');
        ok(items.eq(1).offset().left > pos, '当前第二在右边');

        dom.slider('slideTo', 1);
        dom.slider('one', 'slideend', function () {
            setTimeout(function () {

                ok(items.eq(0).offset().left < pos, '当前第一个滑到左边');
                equal(items.eq(1).offset().left, pos, '第二个可见');

                ins.on('slide', function () {
                    ok(false, '不应该执行');
                });
                ins.slideTo(1);

                dom.slider('destroy').remove();
                start();
            }, 500);
        });
    });

    test('slideTo 方向', function () {
        stop();

        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            instance,
            pos;

        instance = dom.slider({index:2}).slider('this');

        pos = instance._slidePos[2];

        instance.slideTo(4);
        ok(instance._slidePos[2] > pos, '方向正确');

        dom.slider('destroy').remove();
        start();
    });

    test('prev', function () {
        stop();

        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset().left,
            items;

        dom.slider({index:1});

        items = dom.find('.ui-slider-item');
        approximateEqual(items.eq(1).offset().left, pos, '当前第二个可见');
        ok(items.eq(0).offset().left < pos, '当前第一在左边');

        dom.slider('prev');
        dom.slider('one', 'slideend', function () {
            setTimeout(function () {

                ok(items.eq(1).offset().left > pos, '当前第二个滑到右边');
                approximateEqual(items.eq(0).offset().left, pos, '第一个可见');

                dom.slider('prev');
                equal(dom.slider('getIndex'), 0, 'still 0');


                dom.slider('destroy').remove();
                start();
            }, 500);

        });
    });

    test('next', function () {
        stop();

        var dom = $('<div>' +
                '<div> item 1</div>' +
                '<div> item 2</div>' +
                '<div> item 3</div>' +
                '<div> item 4</div>' +
                '</div>').appendTo(fixture),
            pos = dom.offset().left,
            items;

        dom.slider({index:2});

        items = dom.find('.ui-slider-item');
        approximateEqual(items.eq(2).offset().left, pos, '当前第三个可见');
        ok(items.eq(3).offset().left > pos, '当前第四在右边');

        dom.slider('next');
        dom.slider('one', 'slideend', function () {
            setTimeout(function () {

                ok(items.eq(2).offset().left < pos, '当前第三个滑到左边');
                approximateEqual(items.eq(3).offset().left, pos, '第四个可见');

                dom.slider('next');
                equal(dom.slider('getIndex'), 3, 'still 3');

                dom.slider('destroy').remove();
                start();
            }, 500);
        });
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