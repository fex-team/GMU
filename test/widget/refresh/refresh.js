module("widget/refresh",{
    setup:function () {
        var html = '<div class="wrapper">' +
            '<ul class="data-list">' +
            '<li>测试数据1</li>' +
            '<li>测试数据2</li>' +
            '<li>测试数据3</li>' +
            '<li>测试数据4</li>' +
            '<li>测试数据5</li>' +
            '<li>测试数据6</li>' +
            '<li>测试数据7</li>' +
            '<li>测试数据8</li>' +
            '<li>测试数据9</li>' +
            '<li>测试数据10</li>' +
            '</ul> ' +
            '</div> '

        $('body').append(html);
    }
});


function createDom (dir, $wrapper, w) {
    var w = w || window,
    	$wrapper = $wrapper || w.$('.wrapper'),
        upBtn = '<div class="ui-refresh-up"></div> ',
        downBtn = '<div class="ui-refresh-down"></div> ';
    switch (dir) {
        case 'up':
            $wrapper.prepend(upBtn);
            break;
        case 'down':
            $wrapper.append(downBtn);
            break;
        case 'both':
            $wrapper.prepend(upBtn);
            $wrapper.append(downBtn);
            break;
    }
};

function render(data, dir, type, $elem) {
    var $list = $elem || $('.data-list'),
        html = (function (data) {      //数据渲染
            var liArr = [];
            $.each(data, function () {
                liArr.push(this.html);
            });
            return liArr.join('');
        })(data);

    $list[dir == 'up' ? 'prepend' : 'append'](html);
}

test('默认配置项是否正确(只有setup模式)', function () {
    createDom('down');
    stop();
    ua.loadcss(["widget/refresh/refresh.default.css"], function () {
        var $wrapper = $('.wrapper'),
            refresh = $wrapper.refresh().refresh('this');
        
        equals(refresh._options.load, null, "默认参数");
        equals(refresh._options.statechange, null, "默认参数");
        equals(refresh.$el.hasClass('wrapper'), true, 'refresh[down]实例成功创建');
        equals(refresh.$el.hasClass('ui-refresh'), true, 'refresh[down] wrapper元素加上了ui-refresh的class');
        strictEqual($wrapper.find('.ui-refresh-down').length, 1, 'refresh[down]');
        strictEqual($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').length, 1, 'refresh[down] icon元素存在');
        strictEqual($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').length, 1, 'refresh[down] label元素存在');
        equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
        ok(ua.isShown(refresh.$el.find(".ui-refresh-down")[0]), "refresh[down]显示");
        refresh.destroy();
        start();
    })
});

test('参数options:load & 方法:afterDataLoading', function () {
    createDom('up');
    expect(10);
    stop();

    var $wrapper = $('.wrapper'),
        liNum = $wrapper.find('li').length,
        refresh = $wrapper.refresh({
            load: function (dir, type) {
            	equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");

                var me = this;
                $.getJSON('../../widget/data/refresh.php', function (data) {
                    render(data, dir, type);
                    me.afterDataLoading('up');    //数据加载完成后改变状态
                    
                    equals(dir, 'up', 'load参数dir正确');
                    equals(type, 'click', 'load参数click正确');
                    equals($('.data-list').find('li').length, 20, 'refresh加载完成后列表数量正确');
                    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                    refresh.destroy();
                    start();
                });
            }
        }).refresh('this');
    
    strictEqual($wrapper.find('.ui-refresh-up').length, 1, 'refresh[up]');
    strictEqual($wrapper.find('.ui-refresh-up').find('.ui-refresh-icon').length, 1, 'refresh[up] icon元素存在');
    strictEqual($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').length, 1, 'refresh[up] label元素存在');    
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals(liNum, 10, '开始的数据列表数量正确');
    
    ua.click($('.ui-refresh-up')[0]);
});

test('参数options:statechange', function () {
    createDom('both');
    expect(29);
    stop();

    var count = 0,
        refreshCount = 0,
        refreshDir = 'up',
        $wrapper = $('.wrapper'),
        liNum = $wrapper.find('li').length,
        refresh = $wrapper.refresh({
            statechange: function (e, elem, state, dir) {
                if (count > 1) {
                    e.preventDefault();   //自定义下载
                    switch (state) {
                        case 'loaded':
                            $(elem).html('加载完成测试');
                            break;
                        case 'loading':
                            $(elem).html('加载中测试');
                            break;
                    }
                }
                if (count === 0 || count === 2) {
                    equals($(elem).hasClass('ui-refresh-' + dir), true, 'statechange参数中elem正确');
                    equals(state, 'loading', 'statechange参数中state正确');
                    equals(dir, refreshDir, 'statechange参数中dir正确');
                    count === 2 && equals($(elem).html(), '加载中测试', '自定义loading样式生效');
                } else if (count === 1 || count === 3) {
                    equals($(elem).hasClass('ui-refresh-' + dir), true, 'statechange参数中elem正确');
                    equals(state, 'loaded', 'statechange参数中state正确');
                    equals(dir, refreshDir, 'statechange参数中dir正确');
                    count === 3 && equals($(elem).html(), '加载完成测试', '自定义loaded样式生效');
                }
                count++;
            },
            load: function (dir, type) {
                var me = this;
                $.getJSON('../../widget/data/refresh.php', function (data) {
                    equals(dir, refreshDir, 'load参数dir正确');
                    equals(type, 'click', 'load参数click正确');
                    
                    refreshCount ==0 && equals($wrapper.find('.ui-refresh-' + dir).find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
                    refreshCount ==1 && equals($wrapper.find('.ui-refresh-' + dir).html(), "加载中测试", "label元素的文字内容正确");
                    
                    render(data, dir, type);
                    me.afterDataLoading(dir);    //数据加载完成后改变状态
                    
                    refreshCount ==0 && equals($wrapper.find('.ui-refresh-' + dir).find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                    refreshCount ==1 && equals($wrapper.find('.ui-refresh-' + dir).html(), "加载完成测试", "label元素的文字内容正确");
                    
                    refreshCount++;

                    if (refreshCount > 1) {
                        refresh.destroy();
                        start();
                    }
                });
            }
        }).refresh('this');
    
    strictEqual($wrapper.find('.ui-refresh-up').length, 1, 'refresh[both] refresh up按钮存在');
    strictEqual($wrapper.find('.ui-refresh-down').length, 1, 'refresh[both] refresh down按钮存在');
    strictEqual($wrapper.find('.ui-refresh-icon').length, 2, 'refresh[both] icon元素存在');
    strictEqual($wrapper.find('.ui-refresh-label').length, 2, 'refresh[both] label元素存在');
    equals($wrapper.find('.ui-refresh-up').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    equals(liNum, 10, '开始的数据列表数量正确');
   
    ua.click($('.ui-refresh-' + refreshDir)[0]);
    setTimeout(function () {
        refreshDir = 'down';
        ua.click($('.ui-refresh-' + refreshDir)[0]);
    }, 500);
});

test('多实例', function () {
    expect(12);
    stop();
    createDom('up');
    var html2 = '<div class="wrapper2">' +
        '<ul class="data-list2">' +
        '<li>测试数据21</li>' +
        '<li>测试数据22</li>' +
        '<li>测试数据23</li>' +
        '<li>测试数据14</li>' +
        '<li>测试数据15</li>' +
        '<li>测试数据16</li>' +
        '<li>测试数据17</li>' +
        '<li>测试数据18</li>' +
        '<li>测试数据19</li>' +
        '<li>测试数据110</li>' +
        '</ul> ' +
        '</div> '
    $('body').append(html2);
    createDom('down', $('.wrapper2'));

    var html3 = '<div class="wrapper3">' +
        '<ul class="data-list3">' +
        '<li>测试数据31</li>' +
        '<li>测试数据32</li>' +
        '<li>测试数据33</li>' +
        '<li>测试数据34</li>' +
        '<li>测试数据35</li>' +
        '<li>测试数据36</li>' +
        '<li>测试数据37</li>' +
        '<li>测试数据38</li>' +
        '<li>测试数据39</li>' +
        '<li>测试数据310</li>' +
        '</ul> ' +
        '</div> '
    $('body').append(html3);
    createDom('both', $('.wrapper3'));

    var refresh1 = $('.wrapper').refresh({
        load: function (dir, type) {
            ok(true, 'up实例load is triggered');

            var me = this;
            $.getJSON('../../widget/data/refresh.php', function (data) {
                render(data, dir, type);
                me.afterDataLoading();    //数据加载完成后改变状态

                equals($('.data-list').find('li').length, 20, 'up实例加载完成后列表数量正确');
                ua.click($('.wrapper2').find('.ui-refresh-down')[0]);
            });
        }
    }).refresh('this');
    var refresh2 = $('.wrapper2').refresh({
        load: function (dir, type) {
            ok(true, 'down实例load is triggered');

            var me = this;
            $.getJSON('../../widget/data/refresh.php', function (data) {
                render(data, dir, type, $('.data-list2'));
                me.afterDataLoading();    //数据加载完成后改变状态

                equals($('.data-list2').find('li').length, 20, 'down实例加载完成后列表数量正确');
                ua.click($('.wrapper3').find('.ui-refresh-down')[0]);
            });
        }
    }).refresh('this');
    var refresh3 = $('.wrapper3').refresh({
        load: function (dir, type) {
            ok(true, 'both实例load is triggered');

            var me = this;
            $.getJSON('../../widget/data/refresh.php', function (data) {
                render(data, dir, type, $('.data-list3'));
                me.afterDataLoading();    //数据加载完成后改变状态

                equals($('.data-list3').find('li').length, 20, 'both实例加载完成后列表数量正确');
                refresh1.destroy();
                refresh2.destroy();
                refresh3.destroy();
                start();
            });
        }
    }).refresh('this');

    equals($('.ui-refresh-icon').length, 4, '多实例下icon创建正确');
    equals($('.ui-refresh-label').length, 4, '多实例下label创建正确');
    equals(refresh1.$el.hasClass('wrapper'), true, 'up实例成功创建');
    equals(refresh2.$el.hasClass('wrapper2'), true, 'down实例成功创建');
    equals(refresh3.$el.hasClass('wrapper3'), true, 'both实例成功创建');
    equals($('.ui-refresh li').length, 30, '开始的数据列表数量正确');
    ua.click($('.wrapper').find('.ui-refresh-up')[0]);
});

test('方法：enable,disable测试', function () {
    createDom('both');
    expect(28)
    stop();
    var count = 0,
        $wrapper = $('.wrapper'),
        refresh = $wrapper.refresh({
            statechange: function (e, elem, state, dir) {
                ok(true, state + ' is triggered');
            },
            load: function (dir, type) {
                ok(true, 'load is triggered');

                var me = this;
                $.getJSON('../../widget/data/refresh.php', function (data) {
                    render(data, dir, type);
                    me.afterDataLoading();    //数据加载完成后改变状态

                    count++;
                    if (count == 1) {
                    	equals($('.data-list').find('li').length, 20, '第一次refresh正确加载');
                        refresh.disable(dir);
                        equals(dir, 'up', 'disable方向正确');
                        equals($('.ui-refresh-up .ui-refresh-label').html(), '没有更多内容了', 'disable后的文案正确');
                        ua.click($('.ui-refresh-up')[0]);
                        equals($('.data-list').find('li').length, 20, 'disable后refresh没有加载');
                        refresh.enable();
                        ua.click($('.ui-refresh-up')[0]);
                    } else if (count == 2) {
                        equals($('.data-list').find('li').length, 30, 'enable后refresh正确加载');
                        ua.click($('.ui-refresh-down')[0]);
                    } else if (count == 3) {
                        equals($('.data-list').find('li').length, 40, 'refresh正确加载');
                        refresh.disable(dir, true);
                        equals($('.ui-refresh-down').css('display'), 'none', 'disable选择hide能正确隐藏');
                        ua.click($('.ui-refresh-down')[0]);
                        equals($('.data-list').find('li').length, 40, 'disable后refresh没有加载');
                        refresh.enable('down');
                        ua.click($('.ui-refresh-down')[0]);
                    } else if (count == 4){
                    	equals($('.data-list').find('li').length, 50, 'refresh正确加载');
                    	equals($('.ui-refresh-down').css('display'), 'block', 'enable后使refresh显示');
                    	refresh.disable();
                    	equals($('.ui-refresh-down .ui-refresh-label').html(), '没有更多内容了', 'disable后的文案正确');
                    	equals($('.ui-refresh-down').css('display'), 'block', 'disable不选择hide不隐藏');
                        ua.click($('.ui-refresh-down')[0]);
                        equals($('.data-list').find('li').length, 50, 'disable后refresh没有加载');
                    	refresh.destroy();
                        start();
                    }
                });
            }
        }).refresh('this');
    ua.click($('.ui-refresh-up')[0]);
});

test("交互 － 加载过程中不响应点击", function(){
    createDom('down');
    expect(1);
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
            load: function(){
            	count ++
            	ok(true, "load 被触发");    
            	if(count == 1){
            		ua.click($('.ui-refresh-down')[0]);
            	}
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;
    
    ua.click($('.ui-refresh-down')[0]);
});

test("destroy", function(){
	$('.wrapper').remove();
    ua.destroyTest(function(w,f){
    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

    	var html = '<div class="wrapper"><ul class="data-list"><li>测试数据1</li></ul></div>';
    	w.$('body').append(html);
    	createDom('up', null, w);
    	
        var refresh = w.$(".wrapper").refresh("this");
        refresh.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(refresh);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");
        equal(el1,el2,"The event is ok");

        // destroy是不再删除实例的属性和方法
        // ok(ol==0,"The refresh is destroy");
        this.finish();
    });
});