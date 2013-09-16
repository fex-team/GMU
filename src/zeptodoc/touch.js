/**
 * @file
 * @module Zepto中文API
 * @class Touch
 * @desc
 */

/**
 * @method Touch events
 * @desc “touch”模块增加了以下的事件，可以用on和off函数进行绑定和取消。
 *
 * - `tap` — 当元素被单击时出发
 * - `singleTap` and `doubleTap` — 单击和双击
 * - `longTap` — 当元素被按住并且超过750ms以上时触发
 * - `swipe`, `swipeLeft`, `swipeRight`, `swipeUp`, `swipeDown` — 元素被滑动时触发
 * 所有事件在Zepto集合中都有快捷方式
 *
 * ```html
 * <style>.delete { display: none; }</style>
 *
 * <ul id=items>
 *    <li>List item 1 <span class=delete>DELETE</span></li>
 *    <li>List item 2 <span class=delete>DELETE</span></li>
 * </ul>
 *```
 *```javascript
 * // 通过滑动显示delete按钮
 * $('#items li').swipe(function(){
 *     $('.delete').hide()
 *     $('.delete', this).show()
 * })
 *
 * // 单击delete按钮删除一行
 * $('.delete').tap(function(){
 *     $(this).parent('li').remove()
 * })
 * ```
 */


