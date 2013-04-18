module("webapp - button - plugin",{
    setup:function(){
        $("body").append("<div id='btsn_create'></div>");
    },
    teardown: function(){
        $('#btsn_create').remove();
    }
});

test("默认配置项，在什么都不传的情况下是否正确",function(){
    expect(9);
    stop();
    ua.loadcss(["reset.css", "widget/button/button.css"], function(){
        var btn = $.ui.button();

        strictEqual(btn.data('disabled'), false, '默认配置中disalbe为false');
        strictEqual(btn.data('selected'), false, '默认配置中selected为false');
        strictEqual(btn.data('label'), "按钮", '默认配置中label为\'按钮\'');
        strictEqual(btn.data('alttext'), '', '默认配置中alttext为\'\'');
        strictEqual(btn.data('type'), 'button', '默认配置中type为\'button\'');
        strictEqual(btn.data('icon'), '', '默认配置中icon为\'\'');
        strictEqual(btn.data('iconpos'), '', '默认配置中iconpos为\'\'');
        strictEqual(btn.data('attributes'), null, '默认配置中attributes为null');
        ok(btn.data('_container').is('body'), '默认配置中container为body');

        btn.destroy();
        start();
    });
});

test("配置项设置结果测试",function(){
    expect(19);
    var btn, opt = {
        container: '#btsn_create'
    }

    //el
    btn = $.ui.button('<a>', opt);
    ok(btn.root().is('a'), "el参数有效");
    btn.destroy();

    //el type为checkbox
    btn = $.ui.button($.extend({}, opt, {
        type:'checkbox'
    }));
    ok(btn.root().is('input[type=checkbox]'), "当el没传， type为checkbox el自动创建为input type=checkbox");
    btn.destroy();

    //el type为radio
    btn = $.ui.button($.extend({}, opt, {
        type:'radio'
    }));
    ok(btn.root().is('input[type=radio]'), "当el没传，type为radio el自动创建为input type=radio");
    btn.destroy();

    //el type为input
    btn = $.ui.button($.extend({}, opt, {
        type:'input'
    }));
    ok(btn.root().is('input[type=button]'), "当el没传，type为input el自动创建为input type=button");
    btn.destroy();

    //el type为button
    btn = $.ui.button($.extend({}, opt, {
        type:'button'
    }));
    ok(btn.root().is('button'), "当el没传，type为button el自动创建为button");
    btn.destroy();

    //disabled
    btn = $.ui.button($.extend({}, opt, {
        disabled:false
    }));
    strictEqual(btn.data('disabled'), false, "当设置disabled为false, 结果应该为false");
    btn.destroy();

    //disabled
    btn = $.ui.button($.extend({}, opt, {
        disabled:true
    }));
    strictEqual(btn.data('disabled'), true, "当设置disabled为true, 结果应该为true");
    btn.destroy();

    //selected
    btn = $.ui.button($.extend({}, opt, {
        selected:false
    }));
    strictEqual(btn.data('selected'), false, "当设置selected为false, 结果应该为false");
    btn.destroy();

    //selected
    btn = $.ui.button($.extend({}, opt, {
        selected:true
    }));
    strictEqual(btn.data('selected'), true, "当设置selected为true, 结果应该为true");
    btn.destroy();

    //label
    btn = $.ui.button($.extend({}, opt, {
        label:'测试'
    }));
    strictEqual(btn.data('label'), '测试', "当设置label为'测试', 结果应该为'测试'");
    strictEqual(btn.data('_textSpan').text(), '测试', "当设置label为'测试', 按钮里面的文字结果应该为'测试'");
    btn.destroy();

    //alttext
    btn = $.ui.button($.extend({}, opt, {
        icon: 'home',
        alttext:'测试'
    }));
    strictEqual(btn.data('alttext'), '测试', "当设置alttext为'测试', 结果应该为'测试'");
    strictEqual(btn.data('_textSpan').text(), '测试', "当设置alttext为'测试', 同是icon设置，label没有设置, 按钮里面的文字结果应该为'测试'");
    btn.destroy();

    //alttext
    btn = $.ui.button($.extend({}, opt, {
        icon: 'home',
        label: 'test',
        alttext:'测试'
    }));
    notEqual(btn.data('_textSpan').text(), '测试', "当设置alttext为'测试', 同是icon设置，label也设置, 按钮里面的文字结果不应该为'测试'");
    btn.destroy();

    //icon
    btn = $.ui.button($.extend({}, opt, {
        icon: 'home'
    }));
    strictEqual(btn.data('icon'), 'home', "当设置icon为'home', 结果应该为'home'");
    btn.destroy();

    //iconpos
    btn = $.ui.button($.extend({}, opt, {
        iconpos: 'right'
    }));
    strictEqual(btn.data('iconpos'), 'right', "当设置iconpos为'right', 结果应该为'right'");
    btn.destroy();

    //className
    btn = $.ui.button($.extend({}, opt, {
        className: 'right'
    }));
    strictEqual(btn.data('className'), 'right', "当设置className为'right', 结果应该为'right'");
    btn.destroy();

    //attributes & container
    var obj = {
        name:'test'
    };
    btn = $.ui.button($.extend({}, opt, {
        attributes:obj
    }));
    deepEqual(btn.data('attributes'), obj, "当设置attributes为'{name:'test'}', 结果应该为'{name:'test'}'");
    ok(btn.data('_container').is('#btsn_create'), '当设置container为#btsn_create, 结果应该为#btsn_create')
    btn.destroy();
});

test("事件测试",function(){
    expect(14);
    var btn, opt = {
        container: '#btsn_create'
    }

    //init
    btn = $.ui.button($.extend({}, opt, {
        init: function(){
            ok(true, 'init事件触发了');
        }
    }));
    btn.destroy();

    btn = $('<a>按钮</a>').on('init', function(e){
        ok(true, 'el上通过on绑定的init也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    btn.button('destory');
    btn.remove();

    //click
    btn = $.ui.button($.extend({}, opt, {
        click: function(){
            ok(true, 'click事件触发了');
        }
    }));
    ua.click(btn.root()[0]);
    btn.destroy();

    btn = $('<a>按钮</a>').on('click', function(e){
        ok(true, 'el上通过on绑定的click也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    ua.click(btn[0]);
    btn.button('destory');
    btn.remove();

    //statechange
    btn = $.ui.button($.extend({}, opt, {
        statechange: function(){
            ok(true, 'statechange事件触发了');
        }
    }));
    btn.disable();
    btn.destroy();

    btn = $('<a>按钮</a>').on('statechange', function(e){
        ok(true, 'el上通过on绑定的statechange也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    btn.button('disable');
    btn.button('destory');
    btn.remove();

    //change
    btn = $.ui.button($.extend({}, opt, {
        change: function(){
            ok(true, 'change事件触发了');
        }
    }));
    btn.select();
    btn.destroy();

    btn = $('<a>按钮</a>').on('change', function(e){
        ok(true, 'el上通过on绑定的change也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    btn.button('select');
    btn.button('destory');
    btn.remove();


    //change type checkbox
    btn = $.ui.button($.extend({}, opt, {
        type: 'checkbox',
        change: function(){
            ok(true, 'change事件触发了 checkbox');
        }
    }));
    ua.click(btn.data('_buttonElement')[0]);
    btn.destroy();

    btn = $('<input type="checkbox" id="test" />').on('change', function(e){
        ok(true, 'el上通过on绑定的change也触发了, checkbox');
    }).appendTo($('#btsn_create'));
    $('<label id="label_test" for="test">按钮</label>').appendTo($('#btsn_create'));
    btn.button();
    ua.click($('#label_test')[0]);
    btn.button('destory');
    btn.remove();
    $('#label_test').remove();


    //change type radio
    btn = $.ui.button($.extend({}, opt, {
        type: 'radio',
        change: function(){
            ok(true, 'change事件触发了 radio');
        },
        attributes: {
            name : 'test'
        }
    }));
    var btn2 = $.ui.button($.extend({}, opt, {
        type: 'radio',
        selected: true,
        change: function(){
            ok(true, 'change事件触发了 radio, 默认选中态，变成了非选中态');
        },
        attributes: {
            name : 'test'
        }
    }));
    ua.click(btn.data('_buttonElement')[0]);
    btn.destroy();
    btn2.destroy();



    btn = $('<input type="radio" id="test" name="test" />').on('change', function(e){
        ok(true, 'el上通过on绑定的change也触发了, checkbox');
    }).appendTo($('#btsn_create'));
    $('<label id="label_test" for="test">按钮</label>').appendTo($('#btsn_create'));
    btn.button();

    btn2 =  $('<input type="radio" id="test2" name="test" checked="checked" />').on('change', function(e){
        ok(true, 'el上通过on绑定的change也触发了, radio 默认选中态，变成了非选中态');
    }).appendTo($('#btsn_create'));
    $('<label id="label_test2" for="test2">按钮</label>').appendTo($('#btsn_create'));
    btn2.button();

    ua.click($('#label_test')[0]);
    btn.button('destory');
    btn.remove();
    btn2.button('destory');
    btn2.remove();
    $('#label_test, #label_test2').remove();

    //click
    btn = $.ui.button($.extend({}, opt, {
        disabled: true,
        click: function(){
            ok(true, 'click事件触发了');
        }
    }));
    ua.click(btn.root()[0]);
    btn.destroy();

    btn = $('<a>按钮</a>').appendTo($('#btsn_create'));
    btn.button({
        disabled: true
    });
    btn.on('click', function(e){
        ok(true, 'el上通过on绑定的click也触发了');
    });
    ua.click(btn[0]);
    btn.button('destory');
    btn.remove();
});

test("点击效果",function(){
    expect(6);
    stop();
    var btn = $.ui.button({
        type:'input'
    });

    ok(btn._el.hasClass('ui-button'), 'The class is right');
    ta.touchstart(btn._el[0]);
    ua.mousedown(btn._el[0]);


    setTimeout(function(){
        ok(btn._el.hasClass('ui-state-hover') && btn._el.hasClass('ui-button'), 'The click status is right');
        ta.touchend(btn._el[0]);
        ua.mouseup(btn._el[0]);
        ok(btn._el.hasClass('ui-button'), 'The status is right');

        btn.destroy();

        btn = $.ui.button({
            type:'input',
            disabled: true
        });

        ok(btn._el.hasClass('ui-button'), 'The class is right');
        ta.touchstart(btn._el[0]);
        ua.mousedown(btn._el[0]);



        setTimeout(function(){
            ok(!btn._el.hasClass('ui-state-hover') && btn._el.hasClass('ui-button'), 'The click status is right');
            ta.touchend(btn._el[0]);
            ua.mouseup(btn._el[0]);
            ok(btn._el.hasClass('ui-button'), 'The status is right');

            btn.destroy();

            start();
        }, 120);
    }, 120);
});

test("方法",function(){
    expect(15);
    var btn;

    btn = $.ui.button({
        type:'button',
        click: function(){
            ok(true, 'click触发了');
        }
    });

    ua.click(btn.root()[0]);
    ok(!btn.root().hasClass('ui-state-disable') && !btn.data('disabled'), '非disable态');

    btn.disable();
    ua.click(btn.root()[0]);
    ok(btn.root().hasClass('ui-state-disable') && btn.data('disabled'), 'disable态');

    btn.toggleEnable();
    ua.click(btn.root()[0]);
    ok(!btn.root().hasClass('ui-state-disable') && !btn.data('disabled'), '非disable态');

    ok(!btn.root().hasClass('ui-state-active') && !btn.data('selected'), '非select态');
    btn.select();
    ok(btn.root().hasClass('ui-state-active') && btn.data('selected'), 'select态');
    btn.unselect();
    ok(!btn.root().hasClass('ui-state-active') && !btn.data('selected'), '非select态');

    strictEqual(btn.data('icon'), '', 'icon目前为空');
    ok(!btn.root().hasClass('ui-button-text-icon') && btn.root().hasClass('ui-button-text-only'), 'class正确');
    btn.setIcon && btn.setIcon('home');
    strictEqual(btn.data('icon'), 'home', 'icon目前为home');
    ok(btn.root().hasClass('ui-button-text-icon') && !btn.root().hasClass('ui-button-text-only'), 'class正确');
    ok(btn.data('_iconSpan') && btn.data('_iconSpan').hasClass('ui-icon-home'), 'class正确');
    btn.setIcon && btn.setIcon('');
    strictEqual(btn.data('icon'), '', 'icon目前为空');
    ok(!btn.root().hasClass('ui-button-text-icon') && btn.root().hasClass('ui-button-text-only'), 'class正确');
    btn.destroy();
});

test("el selector $ 多实例 $ 显示" ,function() {

    expect(12);

    var link1=document.createElement('a');
    $(link1).attr('class','button1');
    $(link1).html('button1');
    document.body.appendChild(link1);
    var button1=$.ui.button('.button1',{
        click:function(){
            equal(this._el.attr('class'),'button1 ui-button ui-button-text-only','The click is right');
        }
    });

    var link2=document.createElement('a');
    $(link2).attr('class','button2');
    $(link2).html('button2');
    document.body.appendChild(link2);
    var button2=$.ui.button('.button2',{
        click:function(){
            equal(this._el.attr('class'),'button2 ui-button ui-button-text-only','The click is right');
        }
    });

    equals(button1._el.attr('class'),'button1 ui-button ui-button-text-only','The class is right');
    equals(button2._el.attr('class'),'button2 ui-button ui-button-text-only','The class is right');
    equals(button1._el.offset().left,$('.button1').offset().left,'The left is right');
    equals(button1._el.offset().top,$('.button1').offset().top,'The top is right');
    equals(button1._el.offset().width,$('.button1').offset().width,'The width is right');
    equals(button1._el.offset().height,$('.button1').offset().height,'The height is right');
    equals(button2._el.offset().left,$('.button2').offset().left,'The left is right');
    equals(button2._el.offset().top,$('.button2').offset().top,'The top is right');
    equals(button2._el.offset().width,$('.button2').offset().width,'The width is right');
    equals(button2._el.offset().height,$('.button2').offset().height,'The height is right');
    ua.click($('.button1')[0]);
    ua.click($('.button2')[0]);
    button1.destroy();
    button2.destroy();
    $("#button").remove();
});

test("setup类型检测", function() {
    expect(7);
    var btn = $('<input id="btn" type="button" />').appendTo($('#btsn_create')).button('this');
    equals(btn.data('type'), 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').remove();

    $('<input id="btn" type="checkbox" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'checkbox', '类型正确应该为checkbox');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="radio" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'radio', '类型正确应该为radio');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="submit" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="reset" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();


    $('<a id="btn">anniu</a>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'button', '类型正确应该为button');
    btn.destroy();
    $('#btn').remove();

    $('<button id="btn">anniu</button>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn.data('type'), 'button', '类型正确应该为button');
    btn.destroy();
    $('#btn').remove();
});

test("多种实例化方式", function() {
    expect(27);
    //crate模式
    var btn1 = $.ui.button({
        icon: 'home',
        type: 'checkbox',
        label: 'button',
        container: '#btsn_create'
    });

    ok(btn1.root().closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof $.ui.button, '按钮为button实例');
    ok(btn1.data('_buttonElement').is('label'), 'buttonElement是label');
    ok(btn1.data('_textSpan'), '按钮有文字节点');
    ok(btn1.data('_iconSpan'), '按钮有图标节点');
    btn1.destroy();

    //setup模式
    $('<input id="btn1" type="checkbox" data-icon="home" /><label for="btn1">button</label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.root().closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof $.ui.button, '按钮为button实例');
    ok(btn1.data('_buttonElement').is('label'), 'buttonElement是label');
    ok(btn1.data('_textSpan'), '按钮有文字节点');
    ok(btn1.data('_iconSpan'), '按钮有图标节点');
    btn1.destroy();

    $('<input id="btn1" type="checkbox" data-mode="true" /><label for="btn1" class="ui-button ui-button-text-icon ui-button-icon-pos-right"><span class="ui-button-text">button</span><span class="ui-icon ui-icon-home"></span></label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.root().closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof $.ui.button, '按钮为button实例');
    ok(btn1.data('_buttonElement').is('label'), 'buttonElement是label');
    ok(btn1.data('_textSpan'), '按钮有文字节点');
    ok(btn1.data('_iconSpan'), '按钮有图标节点');
    equals(btn1.data('label'), 'button', 'label为button');
    equals(btn1.data('alttext'), '', 'alttext为空');
    equals(btn1.data('icon'), 'home', 'icon为home');
    equals(btn1.data('iconpos'), 'right', 'iconpos为right');
    btn1.destroy();

    $('<input id="btn1" type="checkbox" data-mode="true" /><label for="btn1" class="ui-button ui-button-icon-only"><span class="ui-button-text">button</span><span class="ui-icon ui-icon-home"></span></label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.root().closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof $.ui.button, '按钮为button实例');
    ok(btn1.data('_buttonElement').is('label'), 'buttonElement是label');
    ok(btn1.data('_textSpan'), '按钮有文字节点');
    ok(btn1.data('_iconSpan'), '按钮有图标节点');
    equals(btn1.data('label'), '', 'label为空');
    equals(btn1.data('alttext'), 'button', 'alttext为button');
    equals(btn1.data('icon'), 'home', 'icon为home');
    btn1.destroy();

});

test("disablePlugin = true",function(){
    expect(2);
    var btn = $.ui.button({
    	disablePlugin: true,
        type:'input'
    });
    
    equals(btn.root().attr("tagName").toLowerCase(), 'button', "disable plugin");
    equals(btn.setIcon, undefined, "disable plugin");
    btn.destroy();
});

test('destroy()', function(){
    ua.destroyTest(function(w,f){
    	w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var btn = w.$.ui.button({type: 'radio'});
        btn.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(btn);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The toolbar is destroy");
        this.finish();
    })
});

