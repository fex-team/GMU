---
layout: post
title: ortchange兼容方案
category: solutions
tagline: ortchange
group: solutions
---
{% include JB/setup %}

我们知道mobile设备上监测转屏的事件是orientationchange，但这个事件支持得不太好，有很多问题，在开发GMU过程中遇到的关于转屏的问题主要有以下几点：
## 1. 原生orientationchange事件问题
#### （1）orientationchange事件支持得不好
有些android就不支持orientation，我们只能借助resize事件，在GMU_2.0.4以前的版本，在$.support中扩展了一个orientation检测，如下（其中有些看着比较奇葩的条件是在某些机型上检测出来的~）:
```javascript
$.support.orientation = !(br.uc || (parseFloat($.os.version)<5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window
```
#### （2）resize会多次触发
对于不支持orientationchange的机型和系统，我们就只能借助于resize来触发，大家知道resize在很多情况下都会触发，而不光只有转屏，因此并不是很准。
#### （3）转屏延迟
通常在转屏后，我们需要重新渲染UI，比如说调整大小，计算位置等，但转屏事件触发后，并不是页面马上就开始渲染，不同的系统，不同的浏览器，不同的机型，甚至软键盘出来与否，都会有不同，那这时我们再去根据当前页面的一些信息去做调整就是旋转前的。原来GMU是进行了延迟处理，但这对于基本无延迟的手机（如ios5+），体验是不好的。
针对延迟问题，GMU原来的解决方案如下：
```javascript
$(document).ready(function () {
    var getOrt = function(){
            var elem = document.documentElement;
            return elem.clientWidth / Math.max(elem.clientHeight, 320) < 1.1 ? "portrait" : "landscape";
        },
        lastOrt = getOrt(),
        handler = function(e) {
            maxTry = 20;
            clearInterval(timer);
            timer = $.later(function() {
                var curOrt = getOrt();
                if (lastOrt !== curOrt) {
                    lastOrt = curOrt;
                    clearInterval(timer);
                    $(window).trigger('ortchange');
                } else if(--maxTry){//最多尝试20次
                    clearInterval(timer);
                }
            }, 50, true);
        },
        timer, maxTry;
    $(window).bind($.support.orientation ? 'orientationchange' : 'resize', $.debounce(handler));
});
```
通过检测横竖屏document.documentElement的clientWidth值是否调整过来，来确定当前是否已经转屏渲染完成。

## 2. window.matchMedia问题
通过上一篇（[Media Query和matchMedia介绍](https://github.com/gmuteam/GMU/wiki/Media-Query%E5%92%8CmatchMedia%E4%BB%8B%E7%BB%8D)）的介绍，我们知道有强大的window.matchMedia可以帮我们监测设备状态的改变，但matchMedia也有些问题。
#### （1）支持程度不好
下表是matchMedia的支持程度（摘自[can I use](http://caniuse.com/#feat=matchmedia)）：
![matchMedia的支持程度](https://raw.github.com/wiki/gmuteam/GMU/images/matchMedia.png)
#### （2）MediaQueryList对象创建后不更新
即使matches属性的初始值是正确的，默认情况下还是不会更新matches的值，除非页面含有一个对应相同的query和至少一个规则定义的media块。比如说，为了让一个表现形式为”“screen and (max-width:480px)““的MediaQueryList对象正确显示出来（包括能正确触发事件），你必须在你的CSS中包含一些内容：
```js
@media screen and (max-width:480px) {

}
```
这里边的样式是空的都可以，只要有相关的@media，因此，使用监听器时需要在页面创建query对应的media
####

## 3. $.matchMedia的实现
鉴于原生的$.matchMedia的那些问题，GMU在遵照[CSS Object Model（CSSOM）Views](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)规范，在zepto基础上扩展实现了$.matchMedia方法，该方法返回一个对象，该对象包含matches（是否match query），当前查询query, addListener和removeListener，调用方式与原生window.matchMedia一致。$.matchMedia其实实现起来并不复杂，主要思路如下：
#### （1）为页面添加检测元素
css media query主要还是在style上起作用，故在页面创建一个div，作为media query作用的对象。
```js
$mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>').appendTo('body')
```
#### （2）为检测元素添加transition样式及media query样式
当query条件满足时，去动态修改transition作用的属性，如(width)，则可触发transitionEnd事件，这样则相当于可以监测到media query。
```js
$style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; top: -10000px;}\n').appendTo('head');  

$style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n')
```
#### （3）注册transitionEnd事件
在检测元素上注册transitionEnd事件
```js
$mediaElem.on(transitionEnd, function() {
    ret.matches = $mediaElem.width() === 1;
    $.each(listeners, function (i,fn) {
        $.isFunction(fn) && fn.call(ret, ret);
    });
});
```
#### （4）封装addListener及removeListener接口
主要记录在闭包中的listeners数组件，添加和删除回调函数即可
```js
ret = {
    matches: $mediaElem.width() === 1 ,
    media: query,
    addListener: function (callback) {
        listeners.push(callback);
        return this;
    },
    removeListener: function (callback) {
        var index = listeners.indexOf(callback);
        ~index && listeners.splice(index, 1);
        return this;
    }
};
```
#### （5）完整代码
完整代码见GMU中[zepto.extend]()中$.matchMedia方法
当然对于已经支持的系统和浏览器，会直接返回原生的window.matchMedia方法

## 4. 用$.mediaQuery实现转屏ortchange事件
实现转屏，只需将query传入检测转屏的query即可。这里在实现时，最开始遇了一点问题。最开始query值为"screen and (orientation: portrait)"，可在某个三星的机器上测试，居然键盘出来会改变视口大小，即认为是orientation改变了。后来经测试后query换成了"screen and (width: " + window.innerWidth + "px)"，即检测设备第一次打开时的width，若转屏后width必然不满足，使得页面上的检测元素width未受media query的css影响而改变而触发transitionEnd。具体代码如下：
```js
$(function () {
    var handleOrtchange = function (mql) {
        $(document.body).prepend(mql.matches);
            $(window).trigger('ortchange');
        };
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    $.matchMedia($.mediaQuery.ortchange).addListener(handleOrtchange);
});
```

## 5. 还存在的一些问题
在ios4,ios5,ios6及android 2.2+上的不同机型和浏览器上测试过，转屏事件都能正确触发，但是还是存在如下一些问题，其中部分可考虑后续优化。
#### （1）transition支持
$.matchMedia方法的实现依赖于transition的支持，从[can I use](http://caniuse.com/#feat=css-transitions)
来看transition目前在大部移动浏览器上的支持程度还不错，故这种解决方案对于移动端来说还是较为通用的。
![transition支持程度](https://raw.github.com/wiki/gmuteam/GMU/images/transition.png)
#### （2）MediaQueryList对象的调用时机
如果直接通过$.matchMeida方法获取对象，matches的值是待transitionEnd后才更新的，这里设置的transition时间是0.001ms，但若用户想在使用时matches的值即为最新，需要有一些延迟
#### （3）页面检测元素被无意修改
现在是通过在页面上创建一个元素来响应media的，若该元元素transition作用的属性值被无意间修改了，也可能导致不准确，当然这种修改的可能性还是比较小。
#### （4）页面检测元素及样式的回收
目前在页上创建的检测元素及相关的样式并未做回收处理，这个若是有需求，后续可再提供相关接口进行清理工作。

## 6. 参考资料
1. [cssom view](http://www.w3.org/TR/cssom-view/)
2. [CSS media queries在JavaScript中的应用](http://www.w3ctech.com/p/982)
3. [matchMedia polyfill](https://github.com/paulirish/matchMedia.js)
4. [matchMedia.js](https://github.com/fofr/matchMedia.js/blob/master/matchMedia.js)
5. [gallery-media](https://github.com/nzakas/yui3-gallery/blob/master/src/gallery-media/js/media.js)
