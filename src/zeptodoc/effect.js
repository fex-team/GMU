/**
 * @file
 * @module Zepto中文API
 * @class Effects
 * @desc
 */

/**
 * @method $.fx
 * @desc 动画全局设定
 * - `$.fx.off` (在支持CSStransition的浏览器中默认为false): 设置为true将停止所有的animate()动画。
 * - `$.fx.speeds`: 动画用时设定：
 *      - `_default` (400 ms)
 *      - `fast` (200 ms)
 *      - `slow` (600 ms)
 *
 */

/**
 * @grammar animate(properties, [duration, [easing, [function(){ ... }]]])  ⇒ self
 * @grammar animate(properties, { duration: msec, easing: type, complete: fn })  ⇒ self
 * @grammar animate(animationName, { ... })  ⇒ self
 * @method animate
 * @desc 平滑过渡当前集合中元素的css属性。
 * - `properties`: 包含css属性的对象，或者是css关键帧动画的名字。
 * - `duration` (default 400): ms为单位，或者为字符串
 *      -`fast` (200 ms)
 *      -`slow` (600 ms)
 *      - 任何$.fx.speeds中自定义的属性
 * - `easing` (default `linear`): 动画变化过程的类型:
 *      - `ease`
 *      - `linear`
 *      - `ease-in` / `ease-out`
 *      - `ease-in-out`
 *      - `cubic-bezier(...)`
 * - `complete`: 动画结束后的回调函数
 * 支持以下CSS变化的属性
 * - `translate(X|Y|Z|3d)`
 * - `rotate(X|Y|Z|3d)`
 * - `scale(X|Y|Z)`
 * - `matrix(3d)`
 * - `perspective`
 * - `skew(X|Y)`
 *
 * 如果时间间隔为`0` 或者 `$.fx.off` 为真 (浏览器不支持CSS动画), 将不会运行动画。目标值将立即生效。
 *
 * 如果第一个参数是字符串，则将它当做CSS关键帧来处理。
 *
 * @example $("#some_element").animate({
 *      opacity: 0.25, left: '50px',
 *      color: '#abcdef',
 *      rotateZ: '45deg', translate3d: '0,10px,0'
 * }, 500, 'ease-out')
 */


