/**
 * @file
 * @module Zepto中文API
 * @class Ajax
 * @desc
 */

/**
 * @grammar $.ajax(options)  ⇒ XMLHttpRequest
 * @method $.ajax
 * @desc 发起一个Ajax请求，可以是本地请求，也可以是通过HTTP准入的跨域请求，或者是JSONP。
 *
 * **可用属性**
 * - `type`         (默认值："GET") HTTP的请求方法(“GET”, “POST”, or other)。
 * - `url`          (默认值：当前url) 请求的url地址。
 * - `data`         (默认值：none) 请求中包含的数据，对于GET请求来说，这是包含查询字符串的url地址，如果是包含的是object的话，$.param会将其转化成string。
 * - `processData`  (默认值：true) 是否自动将`data`转化成string。
 * - `contentType`  (默认值："application/x-www-form-urlencoded") 传送到服务端数据的内容格式（也可以通过`headers`进行设置）， 设置为`false`可跳过设定，使用默认值。
 * - `dataType`     (默认值：none) 期望从服务端返回的格式 (“json”, “jsonp”, “xml”, “html”, or “text”)。
 * - `timeout`      (默认值：0) 请求超时，0为永不超时。
 * - `headers`      ajax请求的HTTP首部内容。
 * - `async`        (默认值：true) 设置为`false`可发起同步请求。
 * - `global`       (默认值：true) 在请求过程中触发Ajax全局事件。
 * - `context`      (默认值：window) 当前运行环境的上下文。
 * - `traditional`  (默认值：false) 激活$.param 使用传统（浅）方法对`data`进行字符串化。
 * 如果url地址中包含`=?`或者`dataType`的值是"jsonp", 请求自动转为$.ajaxJSONP。
 *
 * **Ajax 回调函数**
 * 可以具体指定的回调函数。
 * - `beforeSend(xhr, settings)` 在请求发送之前触发，提供xhr对象接口，返回`false`可取消此次请求。
 * - `success(data, status, xhr)` 请求成功后触发。
 * - `error(xhr, errorType, error)` 请求错误时触发（超时，解析错误， 状态码不为HTTP 2**）。
 * - `complete(xhr, status)` 请求完成时触发，不论成功与否。
 *
 * **Ajax 事件**
 * 若属性`global:true`， 以下事件会在Ajax请求的整个生命周期中触发：
 * - `ajaxStart` (global): 没有其他Ajax请求进行时出发。
 * - `ajaxBeforeSend` (data: xhr, options): 在请求前触发，返回值为false可以取消此次ajax请求。
 * - `ajaxSend` (data: xhr, options): 同ajaxBeforeSend, 不论返回值为何值都无法取消此次ajax请求。
 * - `ajaxSuccess` (data: xhr, options, data): 请求成功时触发。
 * - `ajaxError` (data: xhr, options, error): 请求失败时出发。
 * - `ajaxComplete` (data: xhr, options): 请求完成时触发，不论请求成功与否。
 * - `ajaxStop` (global): 当没有其他激活状态的Ajax请求时触发。
 *
 * 默认Ajax事件是在document对象上触发的。但如果某个请求的上下文是DOM节点，事件将在这个节点上触发并向上冒泡。只有`ajaxStart`&`ajaxStop`例外。
 * @example $(document).on('ajaxBeforeSend', function(e, xhr, options){
 *  // 此页面的每个Ajax请求发起时会触发该函数。
 *  // xhr对象和$.ajax()选项可被修改。
 *  // 返回false可取消此次请求。
 * })
 *
 * $.ajax({
 *  type: 'POST',
 *  url: '/projects',
 *  data: { name: 'Zepto.js' },
 *  dataType: 'json',
 *  timeout: 300,
 *  context: $('body'),
 *  success: function(data){
 *  //  假设接受JSON数据
 *  //   {"project": {"id": 42, "html": "<div>..." }}
 *  // 将html语句赋值在当前上下文对象中
 *      this.append(data.project.html)
 *  },
 *  error: function(xhr, type){
 *      alert('Ajax error!')
 *  }
 * })
 */

/**
 * @grammar $.ajaxJSONP(options)  ⇒ mock XMLHttpRequest
 * @method $.ajaxJSONP
 * @desc 发起跨域的JSONP请求。JSONP请求不是通过XMLHttpRequest发起的，而是在document注入script标签。支持大多数$.ajax的属性，以下是几个注意点：
 * - `type` 必须是“GET”。
 * - `url`  需要包含“=?”。
 * - `contentType`, `dataType`, `headers`, and `async` 不支持。
 * URL中的占位符`?`会被请求中动态生成的回调函数名替换。一般来说，URL会包含`callback=?`这样的字符串，大多数服务端都期望参数是这么写的。
 *
 * 返回值是模拟的XMLHttpRequest对象，只支持abort方法。
 * @example $.ajaxJSONP({
 *     url: 'http://example.com/projects?callback=?',
 *     success: function(data){
 *     // 数据是js对象，比如Object或者Array
 *   }
 * })
 */

/**
 * @method $.ajaxSettings
 * @desc 包含Ajax请求的默认参数，大多数参数在$.ajax中均有描述。以下是经常在全局中设定的参数：
 * - `timeout` (default: 0): 设置一个非0的值可设定Ajax请求的超时时间。
 * - `global` (default: true): 设为false可阻止触发Ajax事件。
 * - `xhr` (default: XMLHttpRequest): 设置函数返回值为XMLHttpRequest的实例（或者一个兼容对象）。
 * - `accepts`: 从服务端获取的具体MIME类型：
 *      - script: “text/javascript, application/javascript”
 *      - json: “application/json”
 *      - xml: “application/xml, text/xml”
 *      - html: “text/html”
 *      - text: “text/plain”
 */

/**
 * @grammar $.get(url, function(data, status, xhr){ ... })  ⇒ XMLHttpRequest
 * @method $.get
 * @desc 发起Ajax GET请求。
 * @example $.get('/whatevs.html', function(response){
 *  // 在控制台输出返回内容
 *  console.log(response)
 *  })
 */

/**
 * @grammar $.getJSON(url, function(data, status, xhr){ ... })  ⇒ XMLHttpRequest
 * @method $.getJSON
 * @desc 发起Ajax GET请求，并将返回的数据转成JSON对象。
 * @example $.getJSON('/awesome.json', function(data){
 *     console.log(data)
 * })
 */

/**
 * @grammar $.param(object, [shallow])  ⇒ string
 * @grammar $.param(array)  ⇒ string
 * @method $.param
 * @desc 将对象转化成URL-encoded字符串，用于Ajax请求的查询字符串或者传输的数据。若设置了shallow，嵌套的对象和数组将不会被转化。
 *
 * @example $.param({ foo: { one: 1, two: 2 }})
 * //=> "foo[one]=1&foo[two]=2)"
 *
 * $.param({ ids: [1,2,3] })
 * //=> "ids[]=1&ids[]=2&ids[]=3"
 *
 * $.param({ ids: [1,2,3] }, true)
 * //=> "ids=1&ids=2&ids=3"
 *
 * $.param({ foo: 'bar', nested: { will: 'not be ignored' }})
 * //=> "foo=bar&nested[will]=not+be+ignored"
 *
 * $.param({ foo: 'bar', nested: { will: 'be ignored' }}, true)
 * //=> "foo=bar&nested=[object+Object]"
 */

/**
 * @grammar $.post(url, [data], function(data, status, xhr){ ... }, [dataType])  ⇒ XMLHttpRequest
 * @method $.post
 * @desc 发起Ajax POST请求。
 *
 * 使用data参数来传递数据
 * @example $.post('/form', { foo: 'bar' }, function(response){
 *      console.log(response)
 *  })
 * @desc `data` 可以为字符串。
 * @example $.post('/form', $('#some_form').serialize(), function(response){
 *      console.log(response)
 *  })
 */

/**
 * @grammar load(url, function(data, status, xhr){ ... })  ⇒ self
 * @method load
 * @desc 发起Ajax GET请求，获取html文件，若设置了选择器，则返回符合选择器的内容。
 * @example $('#some_element').load('/foo.html #bar')
 * @desc 如果没有给出CSS选择器， 会返回完整的response的text值。
 */

