/**
 * @file
 * @module Zepto中文API
 * @class Form
 * @desc
 */

/**
 * @grammar serialize() ⇒ string
 * @method serialize
 * @desc 将表单值序列化为URL编码的字符串以供Ajax post请求使用。
 */

/**
 * @grammar serializeArray() ⇒ array
 * @method serializeArray
 * @desc 将表单值序列化为包含由`name`和`value`构成的对象的数组。表单中禁用的按钮，未选中的单选/复选按钮会被跳过。结果不包含文件域中的数据。
 * @example $('form').serializeArray()
 *  //=> [{ name: 'size', value: 'micro' },
 *  //    { name: 'name', value: 'Zepto' }]
 */

/**
 * @grammar submit() ⇒ self
 * @grammar submit(function(e){ ... })  ⇒ self
 * @method submit
 * @desc 当未传入函数作为参数时，触发当前表单的“submit”事件，如果该事件的`preventDefault()`方法未被调用的话，产生提交动作。
 * @desc 当传入函数作为参数时，则只是在当前元素上添加一个“submit”事件的监听函数。
 */