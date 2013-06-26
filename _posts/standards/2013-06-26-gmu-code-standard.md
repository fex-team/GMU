---
layout: post
title: GMU开发规范
category: standards
tagline: GMU
group: standards
---
{% include JB/setup %}

# GMU开发规范

## 概述
本文列出了GMU开发过程中应该遵循的规范，并做出相应的描述；开发过程中应该原则上遵循本文列出的规范。
本规范主要包括如下部分：
* 文件组织
* 样式
* 定义新组件
* 默认参数
* 组件模板
* 必选参数多选值的拆分
* 组件插件
* 组件初始化
* 对事件的处理
* destroy的处理
* 其他说明

## 文件组织
每个组件放在以组件名命名的文件夹内：
* 组件核心功能以组件名命名比如Panel.js
* 组件必选参数多选值拆分文件以“参数名.值”命名，比如display.push.js
* 插件已“$插件名”命名，比如$drag.js

比如:

    .
    ├── widget
        └── Panel Panel组件文件夹
            ├── Panel.js Panel核心功能文件
            ├── display.push.js display参数push选项实现文件
            ├── display.overlay.js display参数overlay选项实现文件
            ├── $drag.js drag插件
        └── Suggestion Suggestion组件文件夹
            ├── Suggestion.js Suggestion核心功能文件
            ├── $iscroll.js iscroll插件



## 样式
gmu组件的classname使用gmu作为命名空间，组件根元素使用“gmu-组件名”命名，比如Dialog最外层容器的classname为‘gmu-dialog'，DOM片段的classname使用“gmu-组件名-片段名”的方式命名，比如Dialog的title命名应该为'gmu-dialog-title'

## 定义一个新组件
```javascript
gmu.define('Panel', {
    // 默认参数
    defaultOptions: {
        key: value,
        key: value,
        key: value,
        ...
    },

    // 组件模板
    template: '<div><ul>{{#list}}<li>{{item}}</li>{{/list}}</ul></div>',

    // 模板转换成html片段的方法
    tpl2html: function(data){
        // do compile...
        return html;
    },

    // 默认构造函数   
    _init: function(){}
}, gmu.Layer);
```

定义一个新组件使用gmu.define方法:
* 第一个参数为组件名，首字母大写；
* 第二个参数为一个对象字面量，其中包含defaultOptions(组件默认参数)、template(组件模板)、tpl2html(模板转换成html片段的方法)、_init(默认构造函数)以及组件的其他方法或者属性；
* 第三个参数为可选参数，表示组件从哪个组件继承。

## 组件模板
组件模板可以使用字符串，也可以是一个对象:
```javascript
template: '<div><ul>{{#list}}<li>{{item}}</li>{{/list}}</ul></div>'
```
或者
```javascript
template: {
    title: '<div class="gmu-dialog-title">{{title}}</div>',
    body: '<div class="gmu-dialog-foot">{{body}}</div>',
    foot: '<div class="gmu-dialog-foot">{{title}}</div>'
},
```

## 模板转换成html片段
当组件模板只有一个时，tpl2html为一个方法，接收一个data参数。
```javascript
tpl2html: function(data){
    // do compile...
    return html;
}
```
当组件模板是一个map时，tpl2html可以是一个map也可以是一个方法。
```javascript
// tpl2html用map实现
tpl2html:{
    title: function(data){
        // do compile...
        return titlehtml;
    },
    body: function(data){
        // do compile...
        return bodyhtml;
    }
}
```
或者
```javascript
// tpl2html用函数实现
tpl2html: function(name, data){
    if(name === 'title')
        // do titlecompile...
    else if(name === 'body')
        // do bodycompile
    return html;
}
```

## 必选参数多选值的拆分
对于组件的必选参数，如果多个可选值是相互独立的，建议采用option的方式拆分。
比如panel里面的display参数，有三个可选值：push、overlay、reveal。
使用option的方式拆分如下：
```javascript
// display.push.js
gmu.Panel.option(display, 'push', function(){
        var me = this;
        me.on('setDisplay:panel', function(e){
            // do display...
        });
    }
);

// display.overlay.js
gmu.Panel.option(display, 'overlay', function(){
        var me = this;
        me.on('setDisplay:panel', function(e){
            // do display...
        });
    }
);

// display.reveal.js
gmu.Panel.option(display, 'reveal', function(){
        var me = this;
        me.on('setDisplay:panel', function(e){
            // do display...
        });
    }
);
```

## 组件的插件
每个组件类都有一个register方法，通过register方法可以扩展出一个插件。
register方法的第一个参数为插件名，第二个参数为一个对象字面量，其中至少包含一个init方法，作为插件的初始化函数，该函数会在组件的构造函数执行完后执行。
插件的文件名使用$+插件名的方式命名，比如Panel的drag插件，文件名为$drag.js
```javascript
// $drag.js
gmu.Panel.register('drag', {
    init: function(){
        // do something...
    },

    drag: function(){}
});
```

## 组件初始化
组件有两种初始化方式：
一种是形如$('#dialog').dialog()的方式；
一种是形如gmu.Dialog('#dialog')的方式。
每个组件需要对这两种初始化方式做抹平处理。
用户使用$('#dialog').dialog()方式调用时，底层会给组件传入setup:true的标识作为参考。
组件内部对初始化方式的判断不应该仅仅依赖setup标识，应该综合用户传入的参数以及DOM节点来判断。


## 对事件的处理
出于向下兼容的考虑，目前事件（包括浏览器原生事件和自定义事件）全部采用直接在DOM元素上挂载监听的方式。
使用option方式拆分必选参数可选项时，自定义事件采用新的观察者事件机制。

## destroy的处理
组件destroy的时候应该移除所有的事件，并且对DOM结构进行还原。
原则上讲，destroy后DOM应该还原到组件初始化之前的状态。


## 其他说明
* 组件代码都放在闭包中，undefined从函数的形参中取
* _init为组件的初始化方法，原则上不建议在_init中进行构造DOM结构的操作
* 各个组件的zIndex取值，暂时不做统一处理
* 针对特定浏览器的hack，需要添加注释
* 浏览器原生事件需要加'.组件名'作为命名空间，自定义事件不需要命名空间
