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
        var btn = gmu.Button();

        strictEqual(btn._options['disabled'], false, '默认配置中disalbe为false');
        strictEqual(btn._options['selected'], false, '默认配置中selected为false');
        strictEqual(btn._options['label'], "按钮", '默认配置中label为\'按钮\'');
        strictEqual(btn._options['alttext'], '', '默认配置中alttext为\'\'');
        strictEqual(btn._options['type'], 'button', '默认配置中type为\'button\'');
        strictEqual(btn._options['icon'], '', '默认配置中icon为\'\'');
        strictEqual(btn._options['iconpos'], '', '默认配置中iconpos为\'\'');
        strictEqual(btn._options['attributes'], null, '默认配置中attributes为null');
        ok(btn._options['_container'].is('body'), '默认配置中container为body');

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
    btn = gmu.Button('<a>', opt);
    ok(btn.$el.is('a'), "el参数有效");
    btn.destroy();

    //el type为checkbox
    btn = gmu.Button($.extend({}, opt, {
        type:'checkbox'
    }));
    ok(btn.$el.is('input[type=checkbox]'), "当el没传， type为checkbox el自动创建为input type=checkbox");
    btn.destroy();

    //el type为radio
    btn = gmu.Button($.extend({}, opt, {
        type:'radio'
    }));
    ok(btn.$el.is('input[type=radio]'), "当el没传，type为radio el自动创建为input type=radio");
    btn.destroy();

    //el type为input
    btn = gmu.Button($.extend({}, opt, {
        type:'input'
    }));
    ok(btn.$el.is('input[type=button]'), "当el没传，type为input el自动创建为input type=button");
    btn.destroy();

    //el type为button
    btn = gmu.Button($.extend({}, opt, {
        type:'button'
    }));
    ok(btn.$el.is('button'), "当el没传，type为button el自动创建为button");
    btn.destroy();

    //disabled
    btn = gmu.Button($.extend({}, opt, {
        disabled:false
    }));
    strictEqual(btn._options['disabled'], false, "当设置disabled为false, 结果应该为false");
    btn.destroy();

    //disabled
    btn = gmu.Button($.extend({}, opt, {
        disabled:true
    }));
    strictEqual(btn._options['disabled'], true, "当设置disabled为true, 结果应该为true");
    btn.destroy();

    //selected
    btn = gmu.Button($.extend({}, opt, {
        selected:false
    }));
    strictEqual(btn._options['selected'], false, "当设置selected为false, 结果应该为false");
    btn.destroy();

    //selected
    btn = gmu.Button($.extend({}, opt, {
        selected:true
    }));
    strictEqual(btn._options['selected'], true, "当设置selected为true, 结果应该为true");
    btn.destroy();

    //label
    btn = gmu.Button($.extend({}, opt, {
        label:'测试'
    }));
    strictEqual(btn._options['label'], '测试', "当设置label为'测试', 结果应该为'测试'");
    strictEqual(btn._options['_textSpan'].text(), '测试', "当设置label为'测试', 按钮里面的文字结果应该为'测试'");
    btn.destroy();

    //alttext
    btn = gmu.Button($.extend({}, opt, {
        icon: 'home',
        alttext:'测试'
    }));
    strictEqual(btn._options['alttext'], '测试', "当设置alttext为'测试', 结果应该为'测试'");
    strictEqual(btn._options['_textSpan'].text(), '测试', "当设置alttext为'测试', 同是icon设置，label没有设置, 按钮里面的文字结果应该为'测试'");
    btn.destroy();

    //alttext
    btn = gmu.Button($.extend({}, opt, {
        icon: 'home',
        label: 'test',
        alttext:'测试'
    }));
    notEqual(btn._options['_textSpan'].text(), '测试', "当设置alttext为'测试', 同是icon设置，label也设置, 按钮里面的文字结果不应该为'测试'");
    btn.destroy();

    //icon
    btn = gmu.Button($.extend({}, opt, {
        icon: 'home'
    }));
    strictEqual(btn._options['icon'], 'home', "当设置icon为'home', 结果应该为'home'");
    btn.destroy();

    //iconpos
    btn = gmu.Button($.extend({}, opt, {
        iconpos: 'right'
    }));
    strictEqual(btn._options['iconpos'], 'right', "当设置iconpos为'right', 结果应该为'right'");
    btn.destroy();

    //className
    btn = gmu.Button($.extend({}, opt, {
        className: 'right'
    }));
    strictEqual(btn._options['className'], 'right', "当设置className为'right', 结果应该为'right'");
    btn.destroy();

    //attributes & container
    var obj = {
        name:'test'
    };
    btn = gmu.Button($.extend({}, opt, {
        attributes:obj
    }));
    deepEqual(btn._options['attributes'], obj, "当设置attributes为'{name:'test'}', 结果应该为'{name:'test'}'");
    ok(btn._options['_container'].is('#btsn_create'), '当设置container为#btsn_create, 结果应该为#btsn_create')
    btn.destroy();
});

test("事件测试",function(){
    expect(11);
    var btn, opt = {
        container: '#btsn_create'
    }

    //ready
    btn = gmu.Button($.extend({}, opt, {
        ready: function(){
            ok(true, 'ready事件触发了');
        }
    }));
    btn.destroy();

    btn = $('<a>按钮</a>').on('ready', function(e){
        ok(true, 'el上通过on绑定的ready也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    btn.button('destroy');
    btn.remove();

    //click

    btn = $('<a>按钮</a>').on('click', function(e){
        ok(true, 'el上通过on绑定的click也触发了');
    }).appendTo($('#btsn_create'));
    btn.button();
    ua.click(btn[0]);
    btn.button('destroy');
    btn.remove();

    //statechange
    btn = gmu.Button($.extend({}, opt, {
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
    btn.button('destroy');
    btn.remove();

    //change
    btn = gmu.Button($.extend({}, opt, {
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
    btn.button('destroy');
    btn.remove();


    //change type checkbox
    btn = gmu.Button($.extend({}, opt, {
        type: 'checkbox'
    }));
    ua.click(btn._options['_buttonElement'][0]);
    btn.destroy();

    btn = $('<input type="checkbox" id="test" />').on('change', function(e){
        ok(true, 'el上通过on绑定的change也触发了, checkbox');
    }).appendTo($('#btsn_create'));
    $('<label id="label_test" for="test">按钮</label>').appendTo($('#btsn_create'));
    btn.button();
    ua.click($('#label_test')[0]);
    btn.button('destroy');
    btn.remove();
    $('#label_test').remove();


    //change type radio
    btn = gmu.Button($.extend({}, opt, {
        type: 'radio',
        // change: function(){
        //     ok(true, 'change事件触发了 radio');
        // },
        attributes: {
            name : 'test'
        }
    }));
    var btn2 = gmu.Button($.extend({}, opt, {
        type: 'radio',
        selected: true,
        // change: function(){
        //     ok(true, 'change事件触发了 radio, 默认选中态，变成了非选中态');
        // },
        attributes: {
            name : 'test'
        }
    }));
    ua.click(btn._options['_buttonElement'][0]);
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
    btn.button('destroy');
    btn.remove();
    btn2.button('destroy');
    btn2.remove();
    $('#label_test, #label_test2').remove();

    //click
    btn = $('<a>按钮</a>').appendTo($('#btsn_create'));
    btn.button({
        disabled: true
    });
    btn.on('click', function(e){
        ok(true, 'el上通过on绑定的click也触发了');
    });
    ua.click(btn[0]);
    btn.button('destroy');
    btn.remove();
});

test("点击效果",function(){
    expect(6);
    stop();
    var btn = gmu.Button({
        type:'input'
    });

    ok(btn.$el.hasClass('ui-button'), 'The class is right');
    ta.touchstart(btn.$el[0]);
    ua.mousedown(btn.$el[0]);


    setTimeout(function(){
        ok(btn.$el.hasClass('ui-state-hover') && btn.$el.hasClass('ui-button'), 'The click status is right');
        ta.touchend(btn.$el[0]);
        ua.mouseup(btn.$el[0]);
        ok(btn.$el.hasClass('ui-button'), 'The status is right');

        btn.destroy();

        btn = gmu.Button({
            type:'input',
            disabled: true
        });

        ok(btn.$el.hasClass('ui-button'), 'The class is right');
        ta.touchstart(btn.$el[0]);
        ua.mousedown(btn.$el[0]);



        setTimeout(function(){
            ok(!btn.$el.hasClass('ui-state-hover') && btn.$el.hasClass('ui-button'), 'The click status is right');
            ta.touchend(btn.$el[0]);
            ua.mouseup(btn.$el[0]);
            ok(btn.$el.hasClass('ui-button'), 'The status is right');

            btn.destroy();

            start();
        }, 120);
    }, 120);
});

test("方法",function(){
    expect(13);
    var btn;

    btn = gmu.Button({
        type:'button'
        // click: function(){
        //     ok(true, 'click触发了');
        // }
    });

    ua.click(btn.$el[0]);
    ok(!btn.$el.hasClass('ui-state-disable') && !btn._options['disabled'], '非disable态');

    btn.disable();
    ua.click(btn.$el[0]);
    ok(btn.$el.hasClass('ui-state-disable') && btn._options['disabled'], 'disable态');

    btn.toggleEnable();
    ua.click(btn.$el[0]);
    ok(!btn.$el.hasClass('ui-state-disable') && !btn._options['disabled'], '非disable态');

    ok(!btn.$el.hasClass('ui-state-active') && !btn._options['selected'], '非select态');
    btn.select();
    ok(btn.$el.hasClass('ui-state-active') && btn._options['selected'], 'select态');
    btn.unselect();
    ok(!btn.$el.hasClass('ui-state-active') && !btn._options['selected'], '非select态');

    strictEqual(btn._options['icon'], '', 'icon目前为空');
    ok(!btn.$el.hasClass('ui-button-text-icon') && btn.$el.hasClass('ui-button-text-only'), 'class正确');
    btn.setIcon && btn.setIcon('home');
    strictEqual(btn._options['icon'], 'home', 'icon目前为home');
    ok(btn.$el.hasClass('ui-button-text-icon') && !btn.$el.hasClass('ui-button-text-only'), 'class正确');
    ok(btn._options['_iconSpan'] && btn._options['_iconSpan'].hasClass('ui-icon-home'), 'class正确');
    btn.setIcon && btn.setIcon('');
    strictEqual(btn._options['icon'], '', 'icon目前为空');
    ok(!btn.$el.hasClass('ui-button-text-icon') && btn.$el.hasClass('ui-button-text-only'), 'class正确');
    btn.destroy();
});

test("el selector $ 多实例 $ 显示" ,function() {

    expect(10);

    var link1=document.createElement('a');
    $(link1).attr('class','button1');
    $(link1).html('button1');
    document.body.appendChild(link1);
    var button1=gmu.Button('.button1',{
        // click:function(){
        //     equal(this.$el.attr('class'),'button1 ui-button ui-button-text-only','The click is right');
        // }
    });

    var link2=document.createElement('a');
    $(link2).attr('class','button2');
    $(link2).html('button2');
    document.body.appendChild(link2);
    var button2=gmu.Button('.button2',{
        // click:function(){
        //     equal(this.$el.attr('class'),'button2 ui-button ui-button-text-only','The click is right');
        // }
    });

    equals(button1.$el.attr('class'),'button1 ui-button ui-button-text-only','The class is right');
    equals(button2.$el.attr('class'),'button2 ui-button ui-button-text-only','The class is right');
    equals(button1.$el.offset().left,$('.button1').offset().left,'The left is right');
    equals(button1.$el.offset().top,$('.button1').offset().top,'The top is right');
    equals(button1.$el.offset().width,$('.button1').offset().width,'The width is right');
    equals(button1.$el.offset().height,$('.button1').offset().height,'The height is right');
    equals(button2.$el.offset().left,$('.button2').offset().left,'The left is right');
    equals(button2.$el.offset().top,$('.button2').offset().top,'The top is right');
    equals(button2.$el.offset().width,$('.button2').offset().width,'The width is right');
    equals(button2.$el.offset().height,$('.button2').offset().height,'The height is right');
    ua.click($('.button1')[0]);
    ua.click($('.button2')[0]);
    button1.destroy();
    button2.destroy();
    link1.remove();
    link2.remove();
    $("#button").remove();
});

test("setup类型检测", function() {
    expect(7);
    var btn = $('<input id="btn" type="button" />').appendTo($('#btsn_create')).button('this');
    equals(btn._options['type'], 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').remove();

    $('<input id="btn" type="checkbox" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'checkbox', '类型正确应该为checkbox');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="radio" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'radio', '类型正确应该为radio');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="submit" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();

    $('<input id="btn" type="reset" name="input1" /><label for="input1">test</label>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'input', '类型正确应该为input');
    btn.destroy();
    $('#btn').add($('lable[for="input1"]')).remove();


    $('<a id="btn">anniu</a>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'button', '类型正确应该为button');
    btn.destroy();
    $('#btn').remove();

    $('<button id="btn">anniu</button>').appendTo($('#btsn_create'));
    btn = $('#btn').button('this');
    equals(btn._options['type'], 'button', '类型正确应该为button');
    btn.destroy();
    $('#btn').remove();
});

test("多种实例化方式", function() {
    expect(27);
    //crate模式
    var btn1 = gmu.Button({
        icon: 'home',
        type: 'checkbox',
        label: 'button',
        container: '#btsn_create'
    });

    ok(btn1.$el.closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof gmu.Button, '按钮为button实例');
    ok(btn1._options['_buttonElement'].is('label'), 'buttonElement是label');
    ok(btn1._options['_textSpan'], '按钮有文字节点');
    ok(btn1._options['_iconSpan'], '按钮有图标节点');
    btn1.destroy();

    //setup模式
    $('<input id="btn1" type="checkbox" data-icon="home" /><label for="btn1">button</label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.$el.closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof gmu.Button, '按钮为button实例');
    ok(btn1._options['_buttonElement'].is('label'), 'buttonElement是label');
    ok(btn1._options['_textSpan'], '按钮有文字节点');
    ok(btn1._options['_iconSpan'], '按钮有图标节点');
    btn1.destroy();
    $('#btsn_create').html('');

    $('<input id="btn1" type="checkbox" data-mode="true" /><label for="btn1" class="ui-button ui-button-text-icon ui-button-icon-pos-right"><span class="ui-button-text">button</span><span class="ui-icon ui-icon-home"></span></label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.$el.closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof gmu.Button, '按钮为button实例');
    ok(btn1._options['_buttonElement'].is('label'), 'buttonElement是label');
    ok(btn1._options['_textSpan'], '按钮有文字节点');
    ok(btn1._options['_iconSpan'], '按钮有图标节点');
    equals(btn1._options['label'], 'button', 'label为button');
    equals(btn1._options['alttext'], '', 'alttext为空');
    equals(btn1._options['icon'], 'home', 'icon为home');
    equals(btn1._options['iconpos'], 'right', 'iconpos为right');
    btn1.destroy();
    $('#btsn_create').html('')

    $('<input id="btn1" type="checkbox" data-mode="true" /><label for="btn1" class="ui-button ui-button-icon-only"><span class="ui-button-text">button</span><span class="ui-icon ui-icon-home"></span></label>').appendTo('#btsn_create');
    btn1 = $('#btn1').button('this');
    ok(btn1.$el.closest('#btsn_create').length, '按钮存在与#btsn_create下面');
    ok(btn1 instanceof gmu.Button, '按钮为button实例');
    ok(btn1._options['_buttonElement'].is('label'), 'buttonElement是label');
    ok(btn1._options['_textSpan'], '按钮有文字节点');
    ok(btn1._options['_iconSpan'], '按钮有图标节点');
    equals(btn1._options['label'], '', 'label为空');
    equals(btn1._options['alttext'], 'button', 'alttext为button');
    equals(btn1._options['icon'], 'home', 'icon为home');
    btn1.destroy();
    $('#btsn_create').html('')

});

test("disablePlugin = true",function(){
    expect(2);
    var btn = gmu.Button({
    	input: false,
        type:'input'
    });
    
    equals(btn.$el.attr("tagName").toLowerCase(), 'button', "disable plugin");
    equals(btn.setIcon, undefined, "disable plugin");
    btn.destroy();
});

test('destroy()', function(){
    ua.destroyTest(function(w,f){
    	w.$('body').highlight();//由于highlight在调用的时候会注册全局事件，以便多次其他实例使用，所以这里先让hightlight把全局事件注册以后再来对比。
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var btn = w.gmu.Button({type: 'radio'});
        btn.destroy();

        var el2= w.dt.eventLength();
        var dl2 =w.dt.domLength(w);

        equal(dl2,dl1,"The dom is ok");
        equal(el1,el2,"The event is ok");
        this.finish();
    })
});

