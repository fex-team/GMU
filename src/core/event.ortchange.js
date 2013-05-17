/**
 * @name Trigger Events
 * @import zepto.js, matchMedia.js
 *
 * @desc 扩展的事件
 * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备，利用css media query实现，解决了转屏延时及orientation事件的兼容性问题
 * $(window).on('ortchange', function () {        //当转屏的时候触发
 *     console.log('ortchange');
 * });
 */

$(function () {
    //扩展常用media query
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    //通过matchMedia派生转屏事件
    $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
    });
});