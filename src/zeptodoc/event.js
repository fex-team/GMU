/**
 * @file
 * @module Zepto中文API
 * @class Event
 * @desc
 */

/**
 * @grammar $.Event(type, [properties])  ⇒ event
 * @method $.Event
 * @desc 创建并初始化特定的DOM event，可设定初始的属性值。event默认为冒泡，可通过设定`bubbles`为`false`进行修改。
 * 通过该方法创建的event可以被trigger触发。
 * @example $.Event('mylib:change', { bubbles: false })
 */

/**
 * @grammar $.proxy(fn, context)  ⇒ function  v1.0+
 * @grammar $.proxy(context, property)  ⇒ function   v1.0+
 * @method $.proxy
 * @desc 使函数能在指定的上下文中执行。
 * @example var obj = {name: 'Zepto'},
 * handler = function(){ console.log("hello from + ", this.name) }
 *
 * // 确保句柄在obj上下文中执行
 * $(document).on('click', $.proxy(handler, obj))
 */

/**
 * @grammar bind(type, function(e){ ... })  ⇒ self
 * @grammar bind({ type: handler, type2: handler2, ... })  ⇒ self
 * @method bind
 * @desc 不推荐，建议使用on代替。
 * 给元素绑定事件
 */

/**
 * @grammar delegate(selector, type, function(e){ ... })  ⇒ self
 * @grammar delegate(selector, { type: handler, type2: handler2, ... })  ⇒ self
 * @method delegate
 * @desc 不推荐，建议使用on代替。
 * 绑定事件，当触发元素匹配选择器的时候触发。
 */

/**
 * @grammar die(type, function(e){ ... })  ⇒ self
 * @grammar die({ type: handler, type2: handler2, ... })  ⇒ self
 * @method die
 * @desc 不推荐，建议使用off代替。
 * 取消用live绑定的事件句柄。
 */

/**
 * @grammar live(type, function(e){ ... })  ⇒ self
 * @grammar live({ type: handler, type2: handler2, ... })  ⇒ self
 * @method live
 * @desc 不推荐，建议使用on代替。
 * 同delegate，选择器从当前集合中获取。
 */

/**
 * @grammar off(type, [selector], function(e){ ... })  ⇒ self
 * @grammar off({ type: handler, type2: handler2, ... }, [selector])  ⇒ self
 * @grammar off(type, [selector])  ⇒ self
 * @grammar off()  ⇒ self
 * @method off
 * @desc 取消用on绑定的事件句柄。若取消特定句柄，需要传入相同的句柄。否则会取消该event type下的所有句柄。若没有参数，则取消所有事件句柄。
 */

/**
 * @grammar on(type, [selector], function(e){ ... })  ⇒ self
 * @grammar on({ type: handler, type2: handler2, ... }, [selector])  ⇒ self
 * @method on
 * @desc 添加集合中元素的事件句柄。可用空格分隔事件类型，或者传入包含事件类型和句柄的对象。若使用CSS选择器，句柄在符合选择器的元素触发时执行。
 *
 * 句柄在绑定元素的上下文中执行，或被选择器匹配的元素中。当事件句柄返回`false`，`preventDefault()`,将阻止浏览器默认的行为。
 * @example var elem = $('#content')
 * // 监听#content下所有的click事件
 * elem.on('click', function(e){ ... })
 * // #content元素下所有nav a的click事件
 * elem.on('click', 'nav a', function(e){ ... })
 * // document中所有a的click事件
 * $(document).on('click', 'a', function(e){ ... })
 *
 */

/**
 * @grammar one(type, function(e){ ... })  ⇒ self
 * @grammar one({ type: handler, type2: handler2, ... })  ⇒ self
 * @method one
 * @desc 添加事件句柄，运行一次后就移除，保证句柄只运行一次。
 */

/**
 * @grammar trigger(event, [data])
 * @method trigger
 * @desc 触发集合元素中特定的事件，event可以为字符串，也可以为Event对象。可通过data传递额外参数。
 * @example // 添加自定义事件
 * $(document).on('mylib:change', function(e, from, to){
 *     console.log('change on %o with data %s, %s', e.target, from, to)
 * })
 * // 触发自定义事件
 * $(document.body).trigger('mylib:change', ['one', 'two'])
 */

/**
 * @grammar triggerHandler(event, [data])  ⇒ self
 * @method triggerHandler
 * @desc 同trigger，但该方法只触发当前元素的事件句柄，不冒泡。
 */

/**
 * @grammar unbind(type, function(e){ ... })  ⇒ self
 * @grammar unbind({ type: handler, type2: handler2, ... })  ⇒ self
 * @method unbind
 * @desc 不推荐，建议使用off代替。
 */

/**
 * @grammar undelegate(selector, type, function(e){ ... })  ⇒ self
 * @grammar undelegate(selector, { type: handler, type2: handler2, ... })  ⇒ self
 * @method undelegate
 * @desc 不推荐，建议使用off代替。
 *
 */

