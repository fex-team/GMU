/**
 * @name $.support
 * @desc 检测设备对某些属性或方法的支持情况
 *
 * **可用属性**
 * - ***orientation*** 检测是否支持转屏事件，UC中存在orientaion，但转屏不会触发该事件，故UC属于不支持转屏事件(iOS 4上qq, chrome都有这个现象)
 * - ***touch*** 检测是否支持touch相关事件
 * - ***cssTransitions*** 检测是否支持css3的transition
 * - ***has3d*** 检测是否支持translate3d的硬件加速
 *
 * @example
 * if ($.support.has3d) {      //在支持3d的设备上使用
 *     console.log('you can use transtion3d');
 * }
 */

(function($, undefined) {
    //检测是否支持position: fixed
    function detectPosFixed () {

    }

    $.support = $.extend($.support || {}, {
        orientation: !(br.uc || (parseFloat($.os.version)<5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        fix: detectPosFixed,
        pushState: "pushState" in history && "replaceState" in history,
        scrolling: '',
        requestAnimationFrame: 'webkitRequestAnimationFrame' in window
    });

})(Zepto);