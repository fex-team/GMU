---
layout: post
title: media query介绍
category: solutions
tagline: media query
group: solutions
---
{% include JB/setup %}

最近为了解决GMU部分组件转屏延迟及转屏兼容性问题，对css3 Media Query及js的window.matchMedia进行了研究。最终在zepto基础上封装了$.matchMedia方法，可完美解决转屏相关问题。本篇先介绍对css3 Media Query及javascript window.matchMedia方法进行整体介绍，下篇阐述GMU采用的转屏解决方案。
## 1. Media Type
先让我们一起来了解一下media type，在css2中就支持media type。平时我们在写代码时，可能不太在意，但你应该见到过如下写法：

```javascript
<link rel="stylesheet" type="text/css" href="reset.css" media="screen" />
```
### Media Type 类型
实际上screen就是一种media type，目前media type有以下类型（摘自网上）:

设备名称 | 指代 
------------ | ------------- 
all | 匹配所有设备
braille | 匹配触觉反馈设备
embossed | 凸点字符印刷设备
handheld | 手持设备（尤其是小屏幕，有限带宽，不过注意：现在的Android，iPhone都不是Handheld设备，他们都是screen设备。所以，不要试图用handheld来识别iphone或者ipad,android等设备）PSP,NDS这种规格一般可以叫作Handheld，不过没有测试过，如有疏漏还请指正）
print | 打印机设备 
projection | 投影仪设备
screen | 彩色计算机显示器设备
speech | 语音合成器设备
tty | 栅格设备（终端，或者电传打字机）
tv | 电视设备

### Media Type 常用用法
media type常用用法，除了放在link标签中，还可以有如下几种用法:
#### （1）放在link标签中
```javascript
<link rel="stylesheet" type="text/css" href="reset.css" media="screen" />
```
#### （2）放在style标签中
```javascript
<style media="screen">
    .cont{
        background: red;
    }
</style>
```
#### （3）写在style样式中
```javascript
<style>
@media screen{
    .cont{
        background: red;
    }
}
</style>
```
#### （4）写在import中
```javascript
@import url("style.css") screen;
```
## 2. Media Query
media query是CSS 3对media type的增强，可将media query理解决为query条件的增强，可以对设备特性进行检验，那media query可以看作是 设备+特性+逻辑式 的结合。
### Media Query设备特性
media type的设备类型media query均支持，同时它又增加了一些设备特性，如下表（摘自网上）：

媒体特性 | 说明/值 | 可用媒体类型 | 接受min/max
------- | ------ | ----------  | ----------
width | 长度正数值(单位一般为px下同) |	视觉屏幕/触摸设备 | 是
heigth | 长度正数值 | 视觉屏幕/触摸设备	 | 是
device-width | 长度正数值	视觉屏幕/触摸设备	| 是
device-heigth | 长度正数值 | 视觉屏幕/触摸设备 | 是
orientation | 设备手持方向(portait横向/landscape竖向) | 位图介质类型 | 否
aspect-ratio | 浏览器、纸张长宽比 | 位图介质类型 | 是
device-aspect-ratio | 设备屏幕长宽比 | 位图介质类型	 | 是
color | 颜色模式（例如旧的显示器为256色） | 整数	 | 视觉媒体 | 是
color-index | 颜色模式列表整数	 | 视觉媒体 | 是
monochrome | 整数 | 视觉媒体 | 是
resolution | 解析度 | 位图介质类型 | 是
scan | progressive逐行扫描/interlace隔行扫描 | 电视类 | 否
grid | 整数，返回0或1	 | 栅格设备 | 否

### Media Query逻辑关键字
media query支持的逻辑关键字主要有:“only”“and”“not”和“，”。
+ only:限定某种设备类型。
+ and：逻辑与，连接设备名与选择条件、选择条件1与选择条件2.
+ not：排除某种设备。
+ 逗号，设备列表。

### Media Query常见形式
那结合设备，设备特性及逻辑关键字，media query主要有以下几种形式
```javascript
@media 设备类型 {   //设备
}
```
```javascript
@media (only|not) 设备类型 {    //设备与逻辑关键字结合
}
```
```javascript
@media  (only|not) 设备类型 and (设备特征表达式) {   //设备、设备特征与逻辑关键字结合
}
```
```javascript
@media (设备特征表达式) | (设备特征表达式) |.... {  //设备特征与逻辑关键字结合
}
```
```javascript
@media (only|not) 设备类型 and (设备特征表达式), (only|not) 设备类型 and (设备特征表达式) { 
 //设备特征与逻辑关键字结合
}
```

## 3. 常见的Media Query表达式
用css3 media query可以很好的实现响应式设计，以下列出几种常见的表达式

#### (1)Smartphones (portrait and landscape)
```javascript
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
	/* CSS Styles */
}
```
#### (2)Smartphones (landscape)
```javascript
@media only screen and (min-width : 321px) {
	/* Styles */
}
```
#### (3)Smartphones (portrait)
```javascript
@media only screen and (max-width : 320px) {
	/* Styles */
}
```
#### (4)iPads (portrait and landscape)
```javascript
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) {
	/* Styles */
}
```
#### (5)iPads (landscape)
```javascript
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape) {
	/* Styles */
}
```
#### (6)iPads (portrait)
```javascript
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait) {
	/* Styles */
}
```
#### (7)iPhone 4
```javascript
@media only screen and (-webkit-min-device-pixel-ratio : 1.5),only screen and (min-device-pixel-ratio : 1.5) {
	/* Styles */
}
```
#### (8)Desktops and laptops
```javascript
@media only screen and (min-width : 1224px) {
	/* Styles */
}
```

## 4. Javascript window.matchMedia方法
css3为我们提供了很强大的media query，而我们时常需要在js中动态的知道什么时候某个状态满足了。[CSS Object Model（CSSOM）Views](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)规范增加了对JavaScript操作CSS media query的原生支持，它在window对象下增加了matchMedia()方法。
### MediaQueryList对象
你可以传入一个CSS media query然后返回一个MediaQueryList对象。这个对象包括两个属性：matches，布尔值数据，表示CSS media query是否与当前的显示状态匹配；media对应传入的参数字符串。如下：
```javascript
var mediaQueryList = window.matchMedia("screen and (max-width:480px)");
console.log(match.media); //"screen and (max-width:480px)"
console.log(match.matches); //true or false
```

### MediaQueryList对象监听器
当然为了有效监听这个变化，MediaQueryList对象还为我们提供了addListener和removeListener
```javascript
var match = window.matchMedia("(orientation:portrait)");
match.addListener(function(mql){
	if (match.matches) {
	
	}else {
}
});
```
当视图状态发生改变时，监听器对应的函数就会执行，而对应的MediaQueryList对象也会传入。用这个方式吗，你可以让你的JavaScript可以很快地响应布局变化，并且不需要用轮询的方式。另外关于media query的实现原理一直不太清楚，什么时候media query就生效的，比如说转屏，是否是只要当前屏幕width或height发生改变时就去查询media query估计就待看看webkit源码才能清楚了。

这篇文章很多材料都是借鉴于网上，主要是让大家对css3 media query及window.matchMedia有一个基本了解，下一篇将在此基础上实现转屏兼容解决方案。
