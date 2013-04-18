module("zepto", {
	teardown: function(){
		$('#some_element').unbind();
		$(document.body).unbind();
	}
});

(function(){


    click = function (el){
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
        el.dispatchEvent(event)
    }

    mousedown = function (el){
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('mousedown', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
        el.dispatchEvent(event)
    }

    outerHTML = function (node) {
        return node.outerHTML || (function(n) {
            var div = document.createElement('div')
            div.appendChild(n.cloneNode(true))
            var html = div.innerHTML
            div = null
            return html
        })(node)
    }

    globalVarSetFromReady = ""
    $(document).ready(function(){ globalVarSetFromReady = 'hi!' })

    globalVarSetFromReady2 = ""
    $(function(){ globalVarSetFromReady2 = 'hi!' })

})();
test("prepare", function(){
	stop();
	ua.loadcss([upath + "css/test.css", upath + "css/zepto.css"], function(){
        ua.importsrc("event.js",function(){
            //var html = '<h1>Zepto DOM unit tests</h1><p id="results">Running… see browser  for results</p><div id="fixtures"><div id="some_element"></div><p><span class="yay">yay</span><span></span><span class="nay" id="nay">nay</span></p><div id="toggle_element"></div><div id="get_style_wrapper" style="font-size: 16px;"><div id="get_style_element">Derp</div></div><div class="replacewith"><div class="inner first">Hello</div><div class="inner second">And</div><div class="inner third">Goodbye</div></div><div id="attr_1" data-id="someId1" data-name="someName1"></div><div id="attr_2" data-id="someId2" data-name="someName2"></div><div id="attr_remove" data-name="boom"></div><form><input id="attr_val" value="Hello World"></form><div id="data_attr" data-foo="bar" data-foo-bar="baz" data-empty></div><form id="attr_with_text_input"><input value="Default input"><input type="text" value="Text input"><input type="email" value="Email input"><input type="search" value="Search input"></form><div class="htmltest" id="htmltest1"></div><div class="htmltest" id="htmltest2"></div><div id="htmltest3"></div><table id="htmltest4"></table><div id="texttest1" class="texttest"><span>Here <strong>is</strong> some text</span></div><div id="texttest2" class="texttest">And <em>some more</em></div><div id="beforeafter_container"><div id="beforeafter"></div></div><div id="appendtoprependto_container"><div id="appendtoprependto"></div></div><div id="insertbeforeinsertafter_container"><div id="insertbeforeinsertafter"></div></div><div id="empty_test"><div id="empty_1"></div><div id="empty_2"></div><div id="empty_3"></div><span id="empty_4">test</span></div><p id="find1"><span class="findme">1</span><span class="findme">2</span><b>3<span class="findme">4</span></b><span class="findme">5<span>6</span></span></p><p id="find2"><span>1</span><span>2</span><span>3<span>4</span></span><span>5<span>6</span></span></p><div id="eachtest"><span></span><b></b><br></div><div style="position:absolute;width:100px;height:50px" id="offset">test</div><ul id="parents"><li id="li1"><ul id="nested"><li id="li2">one</li><li>two</li><li>three</li></ul><ul><li></li></ul></li></ul><ul id="childrenTest"><li class="child one"><a class="childOfOne" href="#">gchild1</a></li><li class="child two"><a class="childOfTwo" href="#">gchild2</a></li><li class="child three"><a class="childOfThree" href="#">gchild3</a></li><li class="child four"><a class="childOfFour" href="#">gchild4</a></li></ul><ul id="siblingsTest"><li class="child one"><span class="b"></span><em></em><b></b></li><li class="child two"><span class="c"></span><em></em><b></b></li><li class="child three"><span class="d"></span><em></em><b></b></li><li class="child four"><span class="e"></span></li></ul><ul id="notTest"><li class="child one"><span class="b"></span></li><li class="child two"><span class="c"></span></li><li class="child three"><span class="d" id="notTestExclude"></span></li><li class="child four"><span class="e"></span></li></ul><div id="addTest"><span class="add_span"></span><span class="add_span"></span><span class="add_span"></span><span class="add_span_exclude"></span><div id="addTestDiv"></div></div><div id="show_hide_div1" style="display:none"></div><div id="show_hide_div2" class="hidden"></div><div id="show_hide_div3"></div><span id="show_hide_span1" style="display:none"></span><span id="show_hide_span2" class="hidden"></span><span id="show_hide_span3"></span><div class="filtertest" id="filtertest1"></div><div class="filtertest" id="filtertest2"></div><div id="delegate_test"><span class="first-level"><span class="second-level">hi</span></span></div><div id="undelegate_test"><span class="first-level"><span class="second-level">hi</span></span></div><div id="delegate_blur_test"><input type="text"></div><div id="delegate_focus_test"><input type="text"></div><div id="another_element"></div><div id="namespace_test"></div><input type="text" id="BooleanInput" required /><form id="some_form"></form><div class="replace_test_div">test</div><div id="wrap_test_div"><span>hi</span><span>hi</span></div><div id="unwrap_test"><div class="unwrap_one"><b><span></span></b></div><div class="unwrap_two"><b><span>1</span><span>2</span></b></div></div><div id="slice_test"><div class="slice1"></div><div class="slice2"></div><div class="slice3"></div></div><div id="eq_test"><div class="eq0"></div><div class="eq1"></div><div class="eq2"></div></div><div id="end_test"><div class="end_one"><b><span></span></b></div><div class="end_two"><b><span>1</span><span>2</span></b></div></div><div id="andself_test"><div class="one"></div><div class="two"></div><div class="three"></div><div class="four"></div></div><div id="index_test"><div class="index0"></div><div class="index1"></div></div><div id="trigger_handler"><form method="get"></form></div></div> '
            var html = '<h1>Zepto DOM unit tests</h1> <p id="results"> Running… see browser console for results </p> <div id="fixtures"> <div id="some_element"></div> <p> <span class="yay">yay</span> <span></span> <span class="nay" id="nay">nay</span> </p> <div id="toggle_element"></div>  <div id="get_style_wrapper" style="font-size: 16px;"> <div id="get_style_element">Derp</div> </div>  <div class="replacewith"> <div class="inner first">Hello</div> <div class="inner second">And</div> <div class="inner third">Goodbye</div> </div>  <div id="attr_1" data-id="someId1" data-name="someName1"></div> <div id="attr_2" data-id="someId2" data-name="someName2"></div> <div id="attr_remove" data-name="boom"></div> <form><input id="attr_val" value="Hello World"></form>  <div id="data_attr" data-foo="bar" data-foo-bar="baz" data-empty></div>  <form id="attr_with_text_input"> <input value="Default input"> <input type="text" value="Text input"> <input type="email" value="Email input"> <input type="search" value="Search input"> </form>  <div class="htmltest" id="htmltest1"></div> <div class="htmltest" id="htmltest2"></div> <div id="htmltest3"></div> <table id="htmltest4"></table>  <div id="texttest1" class="texttest"><span>Here <strong>is</strong> some text</span></div> <div id="texttest2" class="texttest">And <em>some more</em></div>  <div id="beforeafter_container"><div id="beforeafter"></div></div> <div id="appendtoprependto_container"><div id="appendtoprependto"></div></div> <div id="insertbeforeinsertafter_container"><div id="insertbeforeinsertafter"></div></div>  <div id="empty_test"> <div id="empty_1"></div> <div id="empty_2"></div> <div id="empty_3"></div> <span id="empty_4">test</span> </div>  <p id="find1"> <span class="findme">1</span> <span class="findme">2</span> <b>3<span class="findme">4</span></b> <span class="findme">5<span>6</span></span> </p>  <p id="find2"> <span>1</span> <span>2</span> <span>3<span>4</span></span> <span>5<span>6</span></span> </p>  <div id="eachtest"> <span></span><b></b><br> </div>  <div style="position:absolute;width:100px;height:50px" id="offset">test</div>  <ul id="parents"> <li id="li1"> <ul id="nested"> <li id="li2">one</li> <li>two</li> <li>three</li> </ul> <ul> <li></li> </ul> </li> </ul>  <ul id="childrenTest"> <li class="child one"><a class="childOfOne" href="#">gchild1</a></li> <li class="child two"><a class="childOfTwo" href="#">gchild2</a></li> <li class="child three"><a class="childOfThree" href="#">gchild3</a></li> <li class="child four"><a class="childOfFour" href="#">gchild4</a></li> </ul>  <ul id="siblingsTest"> <li class="child one"><span class="b"></span><em></em><b></b></li> <li class="child two"><span class="c"></span><em></em><b></b></li> <li class="child three"><span class="d"></span><em></em><b></b></li> <li class="child four"><span class="e"></span></li> </ul>  <ul id="notTest"> <li class="child one"><span class="b"></span></li> <li class="child two"><span class="c"></span></li> <li class="child three"><span class="d" id="notTestExclude"></span></li> <li class="child four"><span class="e"></span></li> </ul>  <div id="addTest"> <span class="add_span"></span> <span class="add_span"></span> <span class="add_span"></span> <span class="add_span_exclude"></span> <div id="addTestDiv"></div> </div>  <style> .hidden { display: none; } #show_hide_span1, #show_hide_span2 { display:block } #show_hide_div1 { display:inline-block } </style>  <div id="show_hide_div1" style="display:none"></div> <div id="show_hide_div2" class="hidden"></div> <div id="show_hide_div3"></div>  <span id="show_hide_span1" style="display:none"></span> <span id="show_hide_span2" class="hidden"></span> <span id="show_hide_span3"></span>  <div class="filtertest" id="filtertest1"></div> <div class="filtertest" id="filtertest2"></div>  <div id="delegate_test"><span class="first-level"><span class="second-level">hi</span></span></div> <div id="undelegate_test"><span class="first-level"><span class="second-level">hi</span></span></div>  <div id="delegate_blur_test"><input type="text"></div> <div id="delegate_focus_test"><input type="text"></div>  <div id="another_element"></div>  <div id="namespace_test"></div>  <input type="text" id="BooleanInput" required />  <form id="some_form"></form>  <div class="replace_test_div">test</div>  <div id="wrap_test_div"><span>hi</span><span>hi</span></div>  <div id="unwrap_test"> <div class="unwrap_one"><b><span></span></b></div> <div class="unwrap_two"><b><span>1</span><span>2</span></b></div> </div>  <div id="slice_test"> <div class="slice1"></div> <div class="slice2"></div> <div class="slice3"></div> </div>  <div id="eq_test"> <div class="eq0"></div> <div class="eq1"></div> <div class="eq2"></div> </div>  <div id="end_test"> <div class="end_one"><b><span></span></b></div> <div class="end_two"><b><span>1</span><span>2</span></b></div> </div>  <div id="andself_test"> <div class="one"></div> <div class="two"></div> <div class="three"></div> <div class="four"></div> </div>  <div id="index_test"> <div class="index0"></div> <div class="index1"></div> </div>  <div id="trigger_handler"> <form method="get"> </form> </div>  </div>'
            $("body").append(html);
            ok($("#fixtures"));
            start();
        })
	});

});

test("testIsFunction", function() {
    assertTrue($.isFunction(function(){}))
    assertTrue($.isFunction(new Function()))

    var f1 = function(){}
    function f2(){}

    assertTrue($.isFunction(f1))
    assertTrue($.isFunction(f2))

    assertFalse($.isFunction())
    assertFalse($.isFunction(undefined))
    assertFalse($.isFunction({}))
    assertFalse($.isFunction(new Object()))
    assertFalse($.isFunction(null))
    assertFalse($.isFunction([]))
    assertFalse($.isFunction(1))
    assertFalse($.isFunction('a'))
    assertFalse($.isFunction(new Date()))
    assertFalse($.isFunction(window))
    assertFalse($.isFunction($('body')))
  });

  test("testIsPlainObject", function() {
    assertTrue($.isPlainObject(new Object()), 'Object is plain object')
    assertTrue($.isPlainObject({}), '{} is plain object')
    assertTrue($.isPlainObject({one : 1}), '{one : 1} is plain object')
    assertTrue($.isPlainObject({one : 1, two: [1,2]}), '{one : 1, two: [1,2]} is plain object')

    assertFalse($.isPlainObject(new Array()), 'Array object is not plain object')
    assertFalse($.isPlainObject([]), '[] is not plain object')
    assertFalse($.isPlainObject(null), 'null is not plain object')
    assertFalse($.isPlainObject(), 'undefined is not plain object')
    assertFalse($.isPlainObject(new String()), 'empty String object is not plain object')
    assertFalse($.isPlainObject(new String('moe')), 'String object is not plain object')
    assertFalse($.isPlainObject(''), 'the empty string is not plain object')
    assertFalse($.isPlainObject('moe'), 'a string is not plain object')
    assertFalse($.isPlainObject(new RegExp('test')), 'RegExp object is not plain object')
    assertFalse($.isPlainObject(/test/), 'regex is not plain object')
    assertFalse($.isPlainObject(new Boolean(true)), 'Boolean object is not plain object')
    assertFalse($.isPlainObject(true), 'a boolean is not plain object')
    assertFalse($.isPlainObject(new Number(2)), 'Number object is not plain object')
    assertFalse($.isPlainObject(2), 'a number is not plain object')
    assertFalse($.isPlainObject(new Function()), 'Function object is not plain object')
    assertFalse($.isPlainObject(function() {}), 'a function is not plain object')
    assertFalse($.isPlainObject(new Date()), 'Date object is not plain object')

    assertFalse($.isPlainObject(window), 'window is not a plain object')
    assertFalse($.isPlainObject($("html")[0]), 'html node is not a plain object')

    var F = function(){}, obj
    F.prototype = {'a':1}
    obj = new F()
    assertFalse($.isPlainObject(obj), 'function with prototype is not a plain object')
  });

  // test to see if we augment iOS 3.2 with String#trim()
  test("testTrim", function() {
    assertEqual("blah", " blah ".trim())
  });
  /*
   * marked by chenluyang
   * 新版增加
  test("testCamelCase", function() {
	assertEqual("hello", $.camelCase("hello"))
    assertEqual("HELLO", $.camelCase("HELLO"))
    assertEqual("helloNiceWorld", $.camelCase("hello-nice-world"))
    assertEqual("helloWorld", $.camelCase("helloWorld"))
  });
   */
  test("testExtend", function() {
    same({}, $.extend({}))
    same(
      {a: "b", c: "d", e: "f"},
      $.extend({a: "1", e: "f"}, {a: "b", c: "d"})
    )
    var obj = {}
    assertIdentical(obj, $.extend(obj, {a: 1}))
    assertEqual(1, obj.a)

    obj = {}
    assertIdentical(obj, $.extend(obj, {a: 1}, {b: 2}))
    assertEqual(2, obj.b)

    // undefined values are not copied over
    same({a:1}, $.extend({a:1}, {b:undefined}))

    // shallow by default
    obj = $.extend({ a:{b:"c"} }, { a:{d:"e"} })
    same({d:"e"}, obj.a)
  });
  /*
   * marked by chenluyang
   * 新版增加
  test("testExtendDeep", function() {
    var obj = { a:{b:"c", x:{y:"z"}} }
    $.extend(true, obj, { a:{d:"e"} }, { a:{b:"B", f:"g", x:{q:"x"}} })

    assertEqual('a', Object.keys(obj).join(','))
    assertEqual('b,d,f,x', Object.keys(obj.a).sort().join(','))
    assertEqual('B', obj.a.b)
    assertEqual('e', obj.a.d)
    assertEqual('g', obj.a.f)
    assertEqual('z', obj.a.x.y)
    assertEqual('x', obj.a.x.q)

    // creates non-existing keys on target object
    obj = {}
    $.extend(true, obj, { a:{b:"c"} })
    assertEqual('a', Object.keys(obj).join(','))
    assertEqual('c', obj.a.b)

    // skips iterating over DOM elements
    obj = {}
    var dom = $('#some_element').get(0)
    $.extend(true, obj, { element: dom })
    assertIdentical(dom, obj.element)

    // can override DOM element
    $.extend(true, obj, { element:{a:'b'} })
    assertEqual('b', obj.element.a)
  });
  */
  test("testExtensionAPI", function() {
    ok('init' in $.zepto)
    ok('fragment' in $.zepto)
    ok('Z' in $.zepto)
    ok('isZ' in $.zepto)

    // redefine Z and log some debug information
    var oldZ = $.zepto.Z, calls = []
    $.zepto.Z = function Z(dom, selector) {
      var value = oldZ(dom, selector)
      calls.push(dom)
      return value
    }

    // now select some stuff
    var Z1 = $(''), Z2 = $('#find1 .findme')

    // check if $.fn methods are still there
    ok('pluck' in Z1)
    ok('width' in Z2)

    // two calls should be logged
    assertLength(2, calls)

    // restore old Z
    $.zepto.Z = oldZ
    var Z3 = $('')
    assertLength(2, calls)
  });

  test("testDollar", function() {
    var expectedElement = document.getElementById('some_element')

    assertLength(1, $('#some_element'))
    assertEqual(expectedElement, $('#some_element').get(0))
    assertEqual(expectedElement, $(expectedElement).get(0))

    assertLength(4, $('p'))
    assertLength(1, $('p > span.yay'))
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testDollarUnique", function() {
    refuteIdentical($('#some_element'), $('#some_element'))
    refuteIdentical($('#nonexistent'), $('#nonexistent'))
  });
*/
  test("testDollarWithNil", function() {
    assertLength(0, $(null))
    assertLength(0, $(undefined))
    assertLength(0, $(false))
    assertLength(0, $(''))
    //assertLength(0, $('#'))

    var Z1 = $(null), Z2 = $(null)
    ok(Z1 !== Z2)
  });

  test("testDollarWithNonDOM", function() {
    var zepto = $(['a', 'b', 'c'])
    assertLength(3, zepto)
    assertEqualCollection(['a', 'b', 'c'], zepto)

    ok($({}))
    assertTrue($({ a:true })[0].a)
  });

  test("testGetWithoutIndex", function() {
    var zepto = $('#find1 .findme')
    var array = zepto.get()
    assertFalse(zepto === array)
    assertTrue($.isArray(array))
    assertTrue(array.pop === ([]).pop)
  });

  test("testGetWithIndex", function() {
    var zepto = $('#find1 .findme')
    var outofbounds = zepto.get(zepto.size())
    assertEqual(zepto.get(0), zepto[0])
    assertUndefined(outofbounds)
  });

  test("testSize", function() {
    assertEqual(4, $('#find1 .findme').size())
  });

  test("testDollarWithMultipleInstances", function() {
    var instance1 = $('#some_element'),
        instance2 = $('p')

    assertLength(1, instance1)
    assertLength(4, instance2)
    refuteIdentical(instance1.get(0), instance2.get(0))
  });

  test("testDollarWithArrays", function() {
    var element = document.getElementById('some_element')

    var z1 = $([element])
    assertLength(1, z1)
    assertEqual(element, z1.get(0))

    var z2 = $([element, null, undefined])
    assertLength(1, z2)
    assertEqual(element, z2.get(0))

    var z3 = $([null, element, null])
    assertLength(1, z3)
    assertEqual(element, z3.get(0))
  });

  test("testDollarWithContext", function() {
    // Zepto object
    var zepto = $('p#find1, #find2')
    assertLength(11, $('span', zepto))

    // DOM Element
    var domElement = document.getElementById('find1')
    assertLength(4, $('span.findme', domElement))

    // Selector with DOM Element Context
    var domElement = document.getElementById('find1');
    assertLength(4, $('span.findme', domElement));

    // DOM Element with DOM Element Context
    assertLength(1, $(domElement, domElement));
  });

  test("testDollarWithDocument", function() {
    var z = $(document)
    assertLength(1, z)
    assertEqual('', z.selector)
  });
  /*
   * marked by chenluyang
   * 新版增加
  test("testDollarWithAppcache", function() {
    if ('applicationCache' in window) {
      var z = $(window.applicationCache)
      assertLength(1, z)
      assertIdentical(window.applicationCache, z.get(0))
      assertEqual('', z.selector)
    }
  });
  */
  test("testDollarWithDocumentFragment", function() {
    var documentFragment = $(document.createDocumentFragment())
    assertLength(1, documentFragment)
    assertEqual(Node.DOCUMENT_FRAGMENT_NODE, documentFragment.get(0).nodeType)
  });

  test("testDollarWithFragment", function() {
    var fragment = $("<div>")
    assertLength(1, fragment)
      /*
       * marked by chenluyang
       * ie10暂时下不支持简写
       */
    assertEqual("<div></div>", outerHTML(fragment.get(0)))
    assertEqual('', fragment.selector)
    assertNull(fragment.get(0).parentNode)

    fragment = $("<div>hello world</div>")
    assertLength(1, fragment)
    assertEqual("<div>hello world</div>", outerHTML(fragment.get(0)))
    assertEqual('', fragment.selector)

    fragment = $("<div>hello</div> <span>world</span>")
    assertLength(3, fragment)
    assertEqual("<div>hello</div>", outerHTML(fragment.get(0)))
    assertEqual(Node.TEXT_NODE, fragment.get(1).nodeType)
    assertEqual("<span>world</span>", outerHTML(fragment.get(2)))
    assertEqual('', fragment.selector)

    fragment = $("<div>\nhello</div> \n<span>world</span>")
    assertLength(3, fragment)
    assertEqual("<div>\nhello</div>", outerHTML(fragment.get(0)))
    assertEqual(Node.TEXT_NODE, fragment.get(1).nodeType)
    assertEqual("<span>world</span>", outerHTML(fragment.get(2)))
    assertEqual('', fragment.selector)

   /*
    * marked by chenluyang
    * 新版增加
      fragment = $("<div><div></div>")
      assertLength(2, fragment)
    */

    fragment = $("<div>hello</div> ")
    assertLength(1, fragment)
  });
  /*
   * marked by chenluyang
   * 新版增加
  test("testDollarFragmentAndProperties", function() {
    var el = $('<p id=hi />', {
      id: 'hello', 'class': 'one two',
      text: 'world', css: {color: 'red'}
    })

    assertEqual('hello', el.attr('id'))
    ok(el.hasClass('one'))
    ok(el.hasClass('two'))
    assertEqual('world', el.text())
    assertEqual('red', el.css('color'))
  });
   */
  test("testDollarWithTextNode", function() {
    var textNode = $(document.createTextNode('hi there'))
    assertLength(1, textNode)
    assertEqual(Node.TEXT_NODE, textNode.get(0).nodeType)
  });

  test("testDollarWithCommentInFragment", function() {
    var comment = $('<!-- -->')
    assertLength(1, comment)
    assertEqual(Node.COMMENT_NODE, comment.get(0).nodeType)
  });

  test("testDollarWithDoctypeInFragment", function() {
    assertLength(0, $('<!DOCTYPE html>'))
  });

  test("testNodeCreationViaDollar", function() {
      /**
       * marked by chenluyang
       * ie10下outerHTML不会自动将<div>, <div/> 自动补全成<div></div>
       */
      assertEqual('<div></div>', outerHTML($('<div></div>').get(0)))
      assertEqual('<div></div>', outerHTML($('<div/>').get(0)))
      assertEqual('<div><div></div></div>', outerHTML($('<div><div></div></div>').get(0)))
      assertEqual('<div><div></div></div>', outerHTML($('<div><div/></div>').get(0)))
      assertEqual('<div><div></div><div></div></div>', outerHTML($('<div><div></div><div></div></div>').get(0)))
  });

  test("testCreateTableCell", function() {
    assertEqual('TD', $('<td></td>').pluck('nodeName').join(','))
  });

  test("testCreateTableHeaderCell", function() {
    assertEqual('TH', $('<th></th>').pluck('nodeName').join(','))
  });

  test("testCreateTableRow", function() {
    assertEqual('TR', $('<tr></tr>').pluck('nodeName').join(','))
  });

  test("testCreateTableHeader", function() {
    assertEqual('THEAD', $('<thead></thead>').pluck('nodeName').join(','))
  });

  test("testCreateTableBody", function() {
    assertEqual('TBODY', $('<tbody></tbody>').pluck('nodeName').join(','))
  });

  test("testCreateTableFooter", function() {
    assertEqual('TFOOT', $('<tfoot></tfoot>').pluck('nodeName').join(','))
  });

  test("testCreateSelectOptgroup", function() {
    assertEqual('OPTGROUP', $('<optgroup></optgroup>').pluck('nodeName').join(','))
  });

  test("testCreateSelectOption", function() {
    assertEqual('OPTION', $('<option></option>').pluck('nodeName').join(','))
  });

  test("testReady", function() {
    assertEqual('hi!', globalVarSetFromReady)
    assertEqual('hi!', globalVarSetFromReady2)
  });

  test("testNext", function() {
     /*
      * marked by chenluyang
      * 新版增加
    assertEqual('P', $('#some_element').next().get(0).tagName)
    assertEqual('DIV', $('p').next().get(0).tagName)

    assertEqual(0, $('span.yay').next('.nay').size())
    assertEqual(1, $('span.yay').next().size())
    assertEqual(1, $('span.yay').next().next('.nay').size())
    */
    assertEqual('P', $('#some_element').next().get(0).tagName)
    assertEqual('DIV', $('p').next().get(0).tagName)
  });

  test("testPrev", function() {
      /*
       * marked by chenluyang
       * 新版增加
    assertEqual('SCRIPT', $('p').prev().get(0).tagName)
    assertEqual('DIV', $('ul').prev().get(0).tagName)

    assertEqual(0, $('span.nay').prev('.yay').size())
    assertEqual(1, $('span.nay').prev().size())
    assertEqual(1, $('span.nay').prev().prev('.yay').size())
    */
    assertEqual('H1', $('p').prev().get(0).tagName)
    assertEqual('DIV', $('ul').prev().get(0).tagName)
  });

  test("testEach", function() {
    var index, tagnames = []
    $('#eachtest > *').each(function(idx, el){
      index = idx
      assertIdentical(el, this)
      tagnames.push(el.tagName.toUpperCase())
    })
    assertEqual('SPAN, B, BR', tagnames.join(', '))
    assertEqual(2, index)
  });

  test("testMap", function() {
      var results = $('#eachtest > *').map(function(idx, el) {
          assertIdentical(el, this)
          return idx + ':' + this.nodeName.toUpperCase()
      })
     /*
      * marked by chenluyang
      * 新版增加
       assertEqual(3, results.size())
      */
      assertEqual('0:SPAN, 1:B, 2:BR', results.join(', '))
  });

  test("testDollarMap", function() {
    var fruits = ['apples', 'oranges', 'pineapple', 'peach', ['grape', 'melon']]
    var results = $.map(fruits, function(item, i) {
      if (item instanceof Array) return item
      else if (!/apple/.test(item)) return i + ':' + item
    })
    assertEqual('1:oranges,3:peach,grape,melon', results.join(','))
  });

  test("testDollarMapObject", function() {
    var fruit = { name: 'banana', taste: 'sweet' }
    var results = $.map(fruit, function(value, key) {
      return key + '=' + value
    })
    assertEqual('name=banana,taste=sweet', results.sort().join(','))
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testDollarGrep", function() {
    var fruits = ['apples', 'oranges', 'pineapple', 'peach']
    var result = $.grep(fruits, function(name){ return /apple/.test(name) })
    assertEqualCollection(['apples', 'pineapple'], result)
  });
*/
  test("testDollarEach", function() {
    var array = ['a','b','c'], object = { a: 1, b: 2, c: 3 }, result

    result = []
    $.each(array, function(idx, val){
      result.push(idx)
      result.push(val)
    })
    assertEqual('0a1b2c', result.join(''))

    result = []
    $.each(object, function(key, val){
      result.push(key)
      result.push(val)
    })
    assertEqual('a1b2c3', result.join(''))

    result = []
    $.each(array, function(idx, val){
      result.push(idx)
      result.push(val)
      return idx<1
    })
    assertEqual('0a1b', result.join(''))

    assertEqual('abc', $.each(array, function(){}).join(''))
  });

  test("testDollarEachContext", function() {
    $.each(['a'], function(key, val) {
      assertEqual(this, val)
    })
    $.each({a:'b'}, function(key, val) {
      assertEqual(this, val)
    })
  });

  test("testDollarInArray", function() {
    assertIdentical( 0,  $.inArray(1, [1,2,3]) )
    assertIdentical( 1,  $.inArray(2, [1,2,3]) )
    assertIdentical( -1, $.inArray(4, [1,2,3]) )
    assertIdentical( 3,  $.inArray(1, [1,2,3,1], 1) )
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testDollarParseJSON", function() {
    same({a:'b'}, $.parseJSON('{"a":"b"}'))
  });
*/
  test("testEq", function() {
    var $els = $('#eq_test div')
    assertLength(1, $els.eq(0))
    assertLength(1, $els.eq(-1))
    assertEqual($els.eq(-1)[0].className, 'eq2')
    assertUndefined($els.eq(-1).tagName)

    assertLength(0, $('nonexistent').eq(0))
  });

  test("testFirst", function() {
    var zepto = $('h1,p')
      /*
       * modified by chenluyang
       * 原本测试用例应该是5，但现在的框架中多了一个<h1 id="qunit-header">,所以修改成6
       */
    assertLength(6, zepto)

    var zepto2 = zepto.first()
    refuteIdentical(zepto, zepto2)
      /*
       * modified by chenluyang
       * 原本测试用例应该是5，但现在的框架中多了一个<h1 id="qunit-header">,所以修改成6
       */
    assertLength(6, zepto)

    assertLength(1, zepto2)
    assertEqual('H1', zepto2.get(0).tagName)

    assertLength(0, $('nonexistent').first())
  });

  test("testFirstNonDOM", function() {
    assertEqual('a', $(['a', 'b', 'c']).first())
  });

  test("testLast", function() {
    var zepto = $('h1,p')
      /*
       * modified by chenluyang
       * 原本测试用例应该是5，但现在的框架中多了一个<h1 id="qunit-header">,所以修改成6
       */
    assertLength(6, zepto)

    var zepto2 = zepto.last()
    refuteIdentical(zepto, zepto2)
      /*
       * modified by chenluyang
       * 原本测试用例应该是5，但现在的框架中多了一个<h1 id="qunit-header">,所以修改成6
       */
    assertLength(6, zepto)

    assertLength(1, zepto2)
    assertEqual('P', zepto2.get(0).tagName)

    assertLength(0, $('nonexistent').last())
  });

  test("testLastNonDOM", function() {
    assertEqual('c', $(['a', 'b', 'c']).last())
  });

  test("testPluck", function() {
    assertEqual('H1H1DIVDIV', $('h1,div.htmltest').pluck('tagName').join(''))
  });

  // for now, we brute-force "display:block" for show/hide
  // need to change that to work better with inline elements in the future

  test("testShow", function() {
    $('#show_hide_div1').show()
    assertEqual('inline-block', getComputedStyle($('#show_hide_div1').get(0)).display)

    $('#show_hide_div2').show()
    assertEqual('block', getComputedStyle($('#show_hide_div2').get(0)).display)

    $('#show_hide_div3').show()
    assertEqual('block', getComputedStyle($('#show_hide_div3').get(0)).display)

    $('#show_hide_span1').show()
    assertEqual('block', getComputedStyle($('#show_hide_span1').get(0)).display)

    $('#show_hide_span2').show()
    assertEqual('block', getComputedStyle($('#show_hide_span2').get(0)).display)

    $('#show_hide_span3').show()
    assertEqual('inline', getComputedStyle($('#show_hide_span3').get(0)).display)
  });

  test("testHide", function() {
    $('#show_hide_div1').hide()
    assertEqual('none', $('#show_hide_div1').get(0).style.display)

    $('#show_hide_div2').hide()
    assertEqual('none', $('#show_hide_div2').get(0).style.display)

    $('#show_hide_div3').hide()
    assertEqual('none', $('#show_hide_div3').get(0).style.display)

    $('#show_hide_span1').hide()
    assertEqual('none', $('#show_hide_span1').get(0).style.display)

    $('#show_hide_span2').hide()
    assertEqual('none', $('#show_hide_span2').get(0).style.display)

    $('#show_hide_span3').hide()
    assertEqual('none', $('#show_hide_span3').get(0).style.display)
  });

  test("testToggle", function() {
    var el = $('#show_hide_div1').hide(),
        domStyle = el.get(0).style

    assertEqual('none', domStyle.display)

    var result = el.toggle()
    assertIdentical(el, result, 'expected toggle() to return self')
    assertIdentical('', domStyle.display)

    el.toggle()
    assertEqual('none', domStyle.display)

    el.toggle(true)
    assertIdentical('', domStyle.display)

    el.toggle(true)
    assertIdentical('', domStyle.display)

    el.toggle(false)
    assertEqual('none', domStyle.display)

    el.toggle(false)
    assertEqual('none', domStyle.display)
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testToggleMultiple", function() {
    var el1  = $('#show_hide_div1').hide(),
        el2  = $('#show_hide_div2').show(),
        both = $('#show_hide_div1, #show_hide_div2')

    both.toggle()
    assertIdentical('', el1.get(0).style.display)
    assertEqual('none', el2.get(0).style.display)

    both.toggle()
    assertEqual('none', el1.get(0).style.display)
    assertEqual('block', el2.get(0).style.display)
  });
*/
  test("testOffset", function() {
    assertNull($('#doesnotexist').offset())
  });

  test("testWidth", function() {
    assertNull($('#doesnotexist').width())
    // can't check values here, but make sure it doesn't error out
    var viewportWidth = $(window).width()
    ok(viewportWidth > 0 || viewportWidth === 0)
    ok($(document).width())

    assertIdentical(100, $('#offset').width())
    $('#offset').width('90px')
    assertIdentical(90, $('#offset').width())
    $('#offset').width(110)
    assertIdentical(110, $('#offset').width())
    $('#offset').width(function(i, oldWidth) { return oldWidth + 5 })
    assertIdentical(115, $('#offset').width())
  });

  test("testHeight", function() {
    assertNull($('#doesnotexist').height())
    // can't check values here, but make sure it doesn't error out
    var viewportHeight = $(window).height()
    ok(viewportHeight > 0 || viewportHeight === 0)
    ok($(document).height())

    assertIdentical(50, $('#offset').height())
    $('#offset').height('60px')
    assertIdentical(60, $('#offset').height())
    $('#offset').height(70)
    assertIdentical(70, $('#offset').height())
    $('#offset').height(function(i, oldHeight) { return oldHeight + 5 })
    assertIdentical(75, $('#offset').height())
  });

  test("testClosest", function() {
    var el = $('#li2')
    assertEqualCollection(el, el.closest('li'))
    assertEqualCollection($('#nested'), el.closest('ul'))
    // with context
    assertEqualCollection($('#nested'), el.closest('ul', $('#li1').get(0)))
    assertLength(0, el.closest('#parents', $('#li1').get(0)))
    // no ancestor matched
    assertLength(0, el.closest('form'))
  });

  test("testClosestOnDetached", function() {
    var el = $('<div><p><a></a></p></div>'),
        para = el.children(),
        link = para.children()

    assertEqualCollection(para, link.closest('p'))
    assertEqualCollection(el, link.closest('div'))
    assertEqualCollection(el, el.closest('div'))
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testContains", function() {
    var el1 = $('#li1'), el2 = $('#li2')

    assertTrue($.contains(el1.get(0), el2.get(0)))
    assertFalse($.contains(el1.get(0), $('#parents').get(0)))
  });

  test("testContainsOnDetached", function() {
    var el = $('<div><p><a></a></p></div>'),
        para = el.children(),
        link = para.children()

    assertTrue($.contains(para.get(0), link.get(0)))
    assertFalse($.contains(document.body, el.get(0)))
  });
*/
  test("testParents", function() {
    var body = document.body, html = body.parentNode, container = $('#parents'),
      wrapper = $('#fixtures').get(0)
    assertEqualCollection($([wrapper, body, html]), container.parents())

    var expected = $('#li1 > ul').get()
    expected.push($('#li1').get(0))
    expected.push(container.get(0))
    expected = expected.concat([wrapper, body, html])
    assertEqualCollection($(expected), $('#li1').find('li').parents())

    expected = [$('#nested').get(0), $('#parents').get(0)]
    assertEqualCollection($(expected), $('#li2').parents('ul'))
  });

  test("testParent", function() {
    var el = $('#li1')
    assertEqualCollection($('#parents'), el.parent())
    assertEqualCollection($('#li1 > ul'), el.find('li').parent())
    assertLength(0, $(document.createElement('div')).parent())
  });

  test("testParentOnDetached", function() {
    assertLength(0, $('<ul />').parent())
  });

  test("testChildren", function() {
    var el=$("#childrenTest"), lis=$("li.child",el)

    //basic form
    assertEqualCollection(lis, el.children())
    //filtered by selector
    assertEqualCollection(lis.filter(".two"), el.children(".two"))
    //across multiple parents
    assertEqualCollection(el.find("li a"), lis.children("a"))
    //chainabilty
    assertEqual(el.find("li a.childOfTwo").text(), lis.children(".childOfTwo").text())
    //non-existent children
    assertLength(0,lis.children(".childOfTwo").children())
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testContents", function() {
    var $contents = $("#contentsTest").contents()
    assertLength(3, $contents)
    assertLength(2, $contents.filter('span'))
    assertLength(0, $("#contentsEmptyTest").contents())
  });
*/
  test("testSiblings", function() {
    var el=$("#siblingsTest")

    //basic form
    assertEqualCollection($("li.one,li.three,li.four",el), $("li.two",el).siblings())
    //filtered by selector
    assertEqualCollection($("li.three",el), $("li.two",el).siblings(".three"))
    //across multiple parents
    assertEqualCollection(el.find("li b"), $("li em",el).siblings("b"))
    assertLength(6,$("li span",el).siblings())
    //non-existent siblings
    assertLength(0,$("li span.e",el).siblings())
  });

  test("testNot", function() {
    var el=$("#notTest")

    //selector form
    assertEqualCollection($("li.one,li.three,li.four",el), $("li",el).not(".two"))
    //element or NodeList form
    assertEqualCollection($("span.b,span.c,span.e",el), $("span",el).not(document.getElementById("notTestExclude")))
    assertEqualCollection($("li",el), $("li, span",el).not(document.getElementsByTagName("span")))
    //function form

    assertEqualCollection($("span.b,span.c",el),$("span",el).not(function(i){
      var $this=$(this)
      $this.html(i)
      return ($this.hasClass("d") || $this.hasClass("e")) ? true : false
    }))

    //test the index was passed in properly in previous test
    assertEqual("0",$("span.b",el).text())
    assertEqual("1",$("span.c",el).text())
  });

  test("testReplaceWith", function() {
    $('div.first').replaceWith('<h2 id="replace_test">New heading</h2>')
    assertUndefined($('div.first').get(0))
    ok(document.getElementById("replace_test").nodeType)
    assertEqual($('.replacewith h2#replace_test').get(0), document.getElementById("replace_test"))

    $('#replace_test').replaceWith($('.replace_test_div'))
    assertUndefined($('#replace_test').get(0))
    ok(document.getElementsByClassName("replace_test_div")[0].nodeType)
    assertEqual($('.replacewith h2#replace_test').get(0), document.getElementsByClassName("replace_test")[0])

    //Multiple elements
    $('.replacewith .replace_test_div').replaceWith('<div class="inner first">hi</div><div class="inner fourth">hello</div>')
    assertLength(4,$('.replacewith div'))
    assertEqual("inner first", $('.replacewith div')[0].className)
    assertEqual("inner fourth", $('.replacewith div')[1].className)
  });

  test("testReplaceWithFragment", function() {
    var orphanDiv = $("<div />")
    orphanDiv.replaceWith($("<div class='different' />"))
    ok(!orphanDiv.hasClass('different'))
  });

  test("testWrap", function() {
   /*
    * marked by chenluyang
    * 新版修改
    var el = $('#wrap_test')
    el.find('span').wrap('<p><i/></p>')
    assertEqual(
      '<p><i><span>hi</span></i></p><a></a><p><i><span>hello</span></i></p>',
      el.html()
    )

    // avoids unnecessary cloning of dom structure for wrapping
    el = $('<div><a/></div>')
    var structure = $('<span/>')
    el.find('a').wrap(structure)
    assertIdentical(structure.get(0), el.find('span').get(0))

    ok(el.find('a').parent().is('span'))
    */
      ok(document.getElementById("wrap_test_div").nodeType)

      $('#wrap_test_div span').wrapAll('<div id="wrap_test" />')
      ok(document.getElementById("wrap_test").nodeType)
      assertEqual($("#wrap_test").children().length, 2)

      $('#wrap_test_div span').wrap('<div class="wrap_test" />')
      ok(document.getElementsByClassName("wrap_test")[0].nodeType)
      assertEqual($('#wrap_test_div span').length, $('.wrap_test').length)
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testWrapFunction", function() {
    var el = $('<div><b>A</b><b>B</b></div>')
    el.find('b').wrap(function(index){
      return '<a class=link' + index + $(this).text() + ' />'
    })
    assertEqual(
      '<a class="link0A"><b>A</b></a><a class="link1B"><b>B</b></a>',
      el.html()
    )
  });

  test("testWrapAll", function() {
    var el = $('#wrapall_test')
    el.find('span').wrapAll('<p><a/></p>')
    assertEqual(
      '<b></b><p><a><span>hi</span><span>hello</span></a></p><i></i>',
      el.html()
    )
  });
*/
  test("testWrapFragment", function() {
    var fragment = $('<div id="fragment" />')
    fragment.wrapAll('<div id="wrap_test" />')
    assertEqual('wrap_test', fragment.parent().attr('id'))
    assertEqual(0, fragment.children().length)

    fragment = $('<div id="fragment" />')
    fragment.wrap('<div id="wrap_test" />')
    assertEqual('wrap_test', fragment.parent().attr('id'))
    assertEqual(0, fragment.children().length)
  });
/*
 * marked by chenluyang
 * 新版增加
  test("testWrapInner", function() {
    var $el = $('#wrapinner_test')
    $el.wrapInner('<div>')
    assertLength(1, $el.children())
    assertLength(1, $el.children('div'))
    assertLength(3, $el.find('div').contents())

    $el = $('#wrapinner_empty_test')
    $el.wrapInner('<div>')
    assertLength(1, $el.children())
    assertLength(1, $el.children('div'))
    assertLength(0, $el.find('div').contents())
  });

  test("testWrapInnerFunction", function() {
    var el = $('<div><b>A</b><b>B</b></div>')
    el.find('b').wrapInner(function(index){
      return '<a class=link' + index + $(this).text() + ' />'
    })
    assertEqual(
      '<b><a class="link0A">A</a></b><b><a class="link1B">B</a></b>',
      el.html()
    )
  });
*/
  test("testUnwrap", function() {
    var context=$("#unwrap_test")

    //Element With no siblings
    $(".unwrap_one span",context).unwrap()
    assertLength(1,$("b",context))

    //Element with siblings
    $(".unwrap_two span",context).unwrap()
    assertLength(0,$("b",context))
    //make sure siblings are unaffected
    assertLength(3,$("span",context))
    //make sure parents are what they should be
    assertEqual($("span",context).parent().get(0), document.getElementsByClassName("unwrap_one")[0])
  });

  test("testUnwrapFragment", function() {
    var fragment = $('<div id=outer><div id=inner></div><div id=uninvolved></div></div>'),
        innerFragment = fragment.find("#inner"),
        uninvolved = fragment.find("#uninvolved")
    innerFragment.unwrap()
    assertLength(0, innerFragment.parent(), '#inner should be orphan')
    assertLength(0, uninvolved.parent(),    '#uninvolved should be orphan')
    assertLength(0, fragment.children(),    'fragment should be empty')
  });

  test("testClone", function() {
    var el = $('<div class=sheep><span></span></div>'),
        el2 = el.clone()

    ok(el2.hasClass('sheep'))
    el2.addClass('black')
    assertNot(el.hasClass('black'))

    el2.find('span').text('baa')
    assertIdentical('', el.find('span').text())
  });

  test("testFind", function() {
    var found = $('p#find1').find('span.findme')
    assertLength(4, found)
    assertEqual('1', found.get(0).innerHTML)
    assertEqual('2', found.get(1).innerHTML)
    assertEqual('4', found.get(2).innerHTML)
    assertEqual('5<span>6</span>', found.get(3).innerHTML)

    var found = $('p#find1, #find2').find('span')
    assertLength(11, found)
  });

  test("testFindWithInvalidNode", function() {
    var found = $('<div><a>1</a></div>\n<div></div>').find('a')
    assertLength(1, found)
    assertEqual('1', found.get(0).innerHTML)
  });

  test("testFilter", function() {
   /*
    * marked by chenluyang
    * 新版修改
    var found = $('div')
    assertLength(2, found.filter('.filtertest'))
    assertLength(0, found.filter('.doesnotexist'))
    assertLength(1, found.filter('.filtertest').filter(':nth-child(2n)'))

    var nodes = $('<select><option value=1>test1</option><option value=2>test2</option><option value=1>test1</option></select>')
    assertLength(2, nodes.find('option').filter(function(){ return this.value == '1' }))

    var indexes = []
    nodes.find('option').filter(function(index){ if (this.value=='1') indexes.push(index) })
    assertEqualCollection([0,2], indexes)
    */
      var found = $('div')
      assertLength(2, found.filter('.filtertest'))
      assertLength(0, found.filter('.doesnotexist'))
      assertLength(1, found.filter('.filtertest').filter(':nth-child(2n)'))
  });
  /*
   * marked by chenluyang
   * 新版增加
  test("testFilterWithNonNativeArrayFilter", function() {
    var nativeFilter = Array.prototype.filter
    try {
      // apply broken filter
      Array.prototype.filter = function(){ return [] }
      assertLength(2, $('div').filter('.filtertest'))
    } finally {
      Array.prototype.filter = nativeFilter
    }
  });

  test("testHas", function() {
    var result, el = $('<b id=one><a></a></b><b id=two><i></i></b><b id=three><i></i></b>')
    result = el.has('a')
    assertEqual('one', result.pluck('id').join(' '))
    result = el.has('i')
    assertEqual('two three', result.pluck('id').join(' '))
    result = el.has(el.find('i').get(0))
    assertEqual('two', result.pluck('id').join(' '))
  });
 */
  test("testAdd", function() {
    var lis=$("li"),spans=$("span"),
    together=lis.add("span"),
    duplicates=spans.add("span"),
    disconnected=$("<div></div>").add("<span></span>"),
    mainContext=$("#addTest")

    //uniquness of collection
    assertLength(spans.length, duplicates)

    //selector only
    assertLength((lis.length + spans.length), together)

    //selector with context
    assertEqualCollection($("span",mainContext), $(".add_span").add(".add_span_exclude",mainContext))

    //DOM Element + Chaining test
    assertEqualCollection(mainContext.children(), $(".add_span").add(".add_span_exclude").add(document.getElementById("addTestDiv")))

    //Disconnected
    ok(!disconnected.get(0).parentNode)

    $("#addTestDiv").append(disconnected)
    assertEqual('<div></div><span></span>', document.getElementById("addTestDiv").innerHTML)
  });

  test("testIs", function() {
    ok($('#find1').is('p'))
    ok($('#li2').is(':first-child'))
    ok(!$('#find1').is('doesnotexist'))
    ok(!$('#find1').is())

    ok($('#fixtures div').is('#some_element'))
    ok(!$('#doesnotexist').is('p'))

    ok(!$(window).is('p'))
  });

  test("testIsWithoutParent", function() {
    var elem = $('<div id=outOfDOM />')
    ok(elem.is('div'))
    ok(elem.is('#outOfDOM'))
    ok(!elem.is('p'))
    ok(!elem.is())
  });

  test("testCSS", function() {
      /*
       * marked by chenluyang
       * 新版修改
    var el = $('#some_element').get(0)

    $('#some_element').css('color', '#f00')
    $('#some_element').css('margin-top', '10px')
    $('#some_element').css('marginBottom', '5px')
    $('#some_element').css('left', 42)
    $('#some_element').css('z-index', 10)
    $('#some_element').css('fontWeight', 300)
    $('#some_element').css('border', '1px solid rgba(255,0,0,1)')
    assertEqual('rgb(255, 0, 0)', el.style.color)
    assertEqual('rgb(255, 0, 0)', el.style.borderLeftColor)
    assertEqual('1px', el.style.borderLeftWidth)
    assertEqual('10px', el.style.marginTop)
    assertEqual('5px', el.style.marginBottom)
    assertEqual('42px', el.style.left)
    assertEqual(300, el.style.fontWeight)
    assertEqual(10, el.style.zIndex)

    var style1 = $('#some_element').css('color')
    var style2 = $('#some_element').css('border')
    assertEqual('rgb(255, 0, 0)', style1)
    assertEqual('1px solid rgb(255, 0, 0)', style2)

    $('#some_element').css({
      'border': '2px solid #000',
      'color': 'rgb(0,255,0)',
      'padding-left': '2px'
    })

    assertEqual('2px', $('#some_element').css('borderLeftWidth'))
    assertEqual('solid', $('#some_element').css('borderLeftStyle'))
    assertEqual('rgb(0, 0, 0)', $('#some_element').css('borderLeftColor'))
    assertEqual('rgb(0, 255, 0)', $('#some_element').css('color'))
    assertEqual('2px', $('#some_element').css('paddingLeft'))

    assertEqual('2px', $('#some_element').css('border-left-width'))
    assertEqual('solid', $('#some_element').css('border-left-style'))
    assertEqual('rgb(0, 0, 0)', $('#some_element').css('border-left-color'))
    assertEqual('rgb(0, 255, 0)', $('#some_element').css('color'))
    assertEqual('2px', $('#some_element').css('padding-left'))

    var div = $('#get_style_element')
    assertEqual('48px', div.css('font-size'))
    assertEqual('rgb(0, 0, 0)', div.css('color'))
    */
      var el = $('#some_element').get(0)

      $('#some_element').css('color', '#f00')
      $('#some_element').css('margin-top', '10px')
      $('#some_element').css('marginBottom', '5px')
      $('#some_element').css('left', 42)
      $('#some_element').css('z-index', 10)
      $('#some_element').css('fontWeight', 300)
      $('#some_element').css('border', '1px solid rgba(255,0,0,1)')   //chenluyang,
      assertEqual('rgb(255, 0, 0)', el.style.color)
      /**
       * marked by chenluyang
       * ie下不会将rgba(*, *, *, 1)自动转成rgb(*, *, *)
       */
      assertEqual('rgb(255, 0, 0)', el.style.borderLeftColor)
      assertEqual('1px', el.style.borderLeftWidth)
      assertEqual('10px', el.style.marginTop)
      assertEqual('5px', el.style.marginBottom)
      assertEqual('42px', el.style.left)
      assertEqual(300, el.style.fontWeight)
      assertEqual(10, el.style.zIndex)

      var style1 = $('#some_element').css('color')
      var style2 = $('#some_element').css('border')
      assertEqual('rgb(255, 0, 0)', style1)
      /**
       * marked by chenluyang
       * ie下不会将rgba(*, *, *, 1)自动转成rgb(*, *, *)
       */
      assertEqual('1px solid rgb(255, 0, 0)', style2)

      $('#some_element').css({
          'border': '2px solid #000',
          'color': 'rgb(0,255,0)',
          'padding-left': '2px'
      })

      assertEqual('2px', $('#some_element').css('borderLeftWidth'))
      assertEqual('solid', $('#some_element').css('borderLeftStyle'))
      assertEqual('rgb(0, 0, 0)', $('#some_element').css('borderLeftColor'))
      assertEqual('rgb(0, 255, 0)', $('#some_element').css('color'))
      assertEqual('2px', $('#some_element').css('paddingLeft'))

      assertEqual('2px', $('#some_element').css('border-left-width'))
      assertEqual('solid', $('#some_element').css('border-left-style'))
      assertEqual('rgb(0, 0, 0)', $('#some_element').css('border-left-color'))
      assertEqual('rgb(0, 255, 0)', $('#some_element').css('color'))
      assertEqual('2px', $('#some_element').css('padding-left'))

      var div = $('#get_style_element')
      assertEqual('48px', div.css('font-size'))
      assertEqual('rgb(0, 0, 0)', div.css('color'))

      $('#some_element').css('color', '')
      assertEqual('', el.style.color)

      $('#some_element').css({'margin-top': '', 'marginBottom': ''})
      assertEqual('', el.style.marginTop)
      assertEqual('', el.style.marginBottom)
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testCSSUnset", function() {
    var el = $('#some_element').css({ 'margin-top': '1px', 'margin-bottom': '1px' }),
        dom = el.get(0)

    el.css('color', '#000')
    el.css('color', '')
    assertIdentical('', dom.style.color)

    el.css('color', '#000')
    el.css('color', undefined)
    assertIdentical('', dom.style.color)

    el.css('color', '#000')
    el.css('color', null)
    assertIdentical('', dom.style.color)

    el.css('color', '#000')
    el.css({ color: '', 'margin-top': undefined, 'marginBottom': null })
    assertIdentical('', dom.style.color)
    assertIdentical('', dom.style.marginTop)
    assertIdentical('', dom.style.marginBottom)
  });

  test("testCSSZeroValue", function() {
    var el = $('#some_element'), dom = el.get(0)
    el.css('opacity', 0)
    assertIdentical('0', dom.style.opacity)

    el.css('opacity', 1)
    el.css({ opacity: 0 })
    assertIdentical('0', dom.style.opacity)
  });
*/
  test("testCSSOnNonExistElm", function() {
    var errorWasRaised = false
    try {
      var color = $('.some-non-exist-elm').css('color')
    } catch (e) {
      errorWasRaised = true
    }
    ok(!errorWasRaised)
  });

  test("testHtml", function() {
    var div = $('div.htmltest')
    div.html('yowza')

    assertEqual('yowza', document.getElementById('htmltest1').innerHTML)
    assertEqual('yowza', document.getElementById('htmltest2').innerHTML)

    assertEqual('yowza', $('div.htmltest').html())

    div.html('')
    assertEqual('', document.getElementById('htmltest2').innerHTML)

    assertEqual("", $('#htmltest3').html())

    assertNull($('doesnotexist').html())

    div.html('yowza')
    div.html(function(idx, html){
      return html.toUpperCase()
    })
    assertEqual('YOWZA', div.html())

    div.html('<u>a</u><u>b</u><u>c</u>')

    $('u').html(function(idx,html){
      return idx+html
    })
    assertEqual('<u>0a</u><u>1b</u><u>2c</u>', div.html())

    var table = $('#htmltest4'),
      html = '<tbody><tr><td>ok</td></tr></tbody>'
    table.html('<tbody><tr><td>ok</td></tr></tbody>')
    assertEqual(html, table.html())
  });

  test("testText", function() {
    assertEqual('Here is some text', $('div.texttest').text())
    assertEqual('And some more', $('#texttest2').text())

    $('div.texttest').text("Let's set it")
    assertEqual("Let's set it", $('#texttest1').text())
    assertEqual("Let's set it", $('#texttest2').text())

    $('#texttest2').text('')
    assertEqual("Let's set it", $('div.texttest').text())
    assertEqual('', $('#texttest2').text())
  });

  test("testEmpty", function() {
    $('#empty_test').empty()

    assertEqual(document.getElementById('empty_1'), null)
    assertEqual(document.getElementById('empty_2'), null)
    assertEqual(document.getElementById('empty_3'), null)
    assertEqual(document.getElementById('empty_4'), null)
  });

  test("testAttr", function() {
    var els = $('#attr_1, #attr_2')

    assertEqual('someId1', els.attr("data-id"))
    assertEqual('someName1', els.attr("data-name"))

    els.attr("data-id","someOtherId")
    els.attr("data-name","someOtherName")

    assertEqual('someOtherId', els.attr("data-id"))
    assertEqual('someOtherName', els.attr("data-name"))
    assertEqual('someOtherId', $('#attr_2').attr('data-id'))

    assertNull(els.attr("nonExistentAttribute"))

    els.attr("data-id", false)
    assertEqual("false", els.attr("data-id"))

    els.attr("data-id", 0)
    assertEqual("0", els.attr("data-id"))

    els.attr({ 'data-id': 'id', 'data-name': 'name' })
    assertEqual('id', els.attr("data-id"))
    assertEqual('name', els.attr("data-name"))
    assertEqual('id', $('#attr_2').attr('data-id'))

    els.attr('data-id', function(idx,oldvalue){
      return idx+oldvalue
    })
    assertEqual('0id', els.attr('data-id'))
    assertEqual('1id', $('#attr_2').attr('data-id'))
  });

  test("testAttrNoElement", function() {
    assertUndefined($().attr('yo'))
    assertUndefined($(document.createTextNode('')).attr('yo'))
    assertUndefined($(document.createComment('')).attr('yo'))

    var els = $('<b></b> <i></i>').attr('id', function(i){ return this.nodeName + i })
    assertEqual('B0', els.eq(0).attr('id'))
    assertEqual('I2', els.eq(2).attr('id'))
    assertUndefined(els.eq(1).attr('id'))
  });

  test("testAttrEmpty", function() {
    var el = $('#data_attr')
    assertIdentical('', el.attr('data-empty'))
  });

  test("testAttrOnTextInputField", function() {
    var inputs = $('#attr_with_text_input input'), values

    values = $.map(inputs, function(i){ return $(i).attr('value') })
    assertEqual('Default input, Text input, Email input, Search input', values.join(', '))

    inputs.val(function(i, value){ return value.replace('input', 'changed') })

    values = $.map(inputs, function(i){ return $(i).attr('value') })
    assertEqual('Default changed, Text changed, Email changed, Search changed', values.join(', '))
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testAttrNullUnset", function() {
    var el = $('<div id=hi>')
    el.attr('id', null)
    assertIdentical('', el.attr('id'))

    el.attr('id', 'hello')
    el.attr({ id:null })
    assertIdentical('', el.attr('id'))
  });
*/
  test("testRemoveAttr", function() {
    var el = $('#attr_remove')
    assertEqual('boom', el.attr('data-name'))
    el.removeAttr('data-name')
    assertNull(el.attr('data-name'))
  });

  test("testRemoveAttrNoElement", function() {
    ok($().removeAttr('rel'))
    ok($(document.createTextNode('')).removeAttr('rel'))

    var els = $('<b rel=up></b> <i rel=next></i>')
    assertIdentical(els, els.removeAttr('rel'))
    assertNull(els.eq(0).attr('rel'))
    assertUndefined(els.eq(1).attr('rel'))
    assertNull(els.eq(2).attr('rel'))
  });

  test("testData", function() {
    var el = $('#data_attr')
    // existing attribute
    assertEqual('bar', el.data('foo'))
    assertEqual('baz', el.data('foo-bar'))
    assertEqual('baz', el.data('fooBar'))

    // camelCase
    el.data('fooBar', 'bam')
    assertEqual('bam', el.data('fooBar'))
    assertEqual('bam', el.data('foo-bar'))

    // new attribute
    el.data('fun', 'hello')
      /**
       * marked by chenluyang,
       * 与data.js中的方法冲突
       */
    assertEqual('hello', el.attr('data-fun'))
    assertEqual('hello', el.data('fun'))

    // blank values
    assertIdentical('', el.data('empty'))
    assertUndefined(el.data('does-not-exist'))
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testDataNumberType", function() {
    var el = $('<div data-num=42 />')
    assertIdentical(42, el.data('num'))
  });

  test("testDataBooleanType", function() {
    var el = $('<div data-true=true data-false=false />')
    assertTrue(el.data('true'))
    assertFalse(el.data('false'))
  });

  test("testDataNullType", function() {
    var el = $('<div data-nil=null />')
    assertNull(el.data('nil'))
  });

  test("testDataJsonType", function() {
    var el = $('<div data-json=\'["one", "two"]\' data-invalid=\'[boom]\' />')
    var json = el.data('json')
    assertEqual(2, json.length)
    assertEqual("one", json[0])
    assertEqual("two", json[1])
    assertEqual('[boom]', el.data('invalid'))
  });
*/
  test("testVal", function() {
      var input = $('#attr_val')

      assertEqual('Hello World', input.val())

      input.val('')
      assertEqual('', input.val())

      input.get(0).value = 'Hello again'
      assertEqual('Hello again', input.val())

      input.val(function(i, val){ return val.replace('Hello', 'Bye') })
      assertEqual('Bye again', input.val())

      assertUndefined($('non-existent').val())
      /**
       * marked by chenluyang
       * 新版添加
       *
       * var multiple = $('<select multiple><option selected>1</option><option value=2 selected="selected">a</option><option>3</option></select>')
           assertEqualCollection(['1','2'], multiple.val())

           multiple.find('option')[0].selected = false
           assertEqualCollection(['2'], multiple.val())
       */
  });

  test("testChaining", function() {
    ok(document.getElementById('nay').innerHTML == "nay")
    $('span.nay').css('color', 'red').html('test')
    ok(document.getElementById('nay').innerHTML == "test")
  });

  test("testCachingForLater", function() {
    var one = $('div')
    var two = $('span')

    ok(one.get(0) !== two.get(0))
  });

  test("testPlugins", function() {
    var el = $('#some_element').get(0)

    $.fn.plugin = function(){
      return this.each(function(){ this.innerHTML = 'plugin!' })
    }
    $('#some_element').plugin()
    assertEqual('plugin!', el.innerHTML)

    // test if existing Zepto objects receive new plugins
    $.fn.anotherplugin = function(){
      return this.each(function(){ this.innerHTML = 'anotherplugin!' })
    }
    ok(typeof $('#some_element').anotherplugin == 'function')
    $('#some_element').anotherplugin()
    assertEqual('anotherplugin!', el.innerHTML)
  });

  test("testAppendPrependBeforeAfter", function() {
    $('#beforeafter').append('append')
    $('#beforeafter').prepend('prepend')
    $('#beforeafter').before('before')
    $('#beforeafter').after('after')

    assertEqual('before<div id="beforeafter">prependappend</div>after', $('#beforeafter_container').html())

    //testing with TextNode as parameter
    $('#beforeafter_container').html('<div id="beforeafter"></div>')

    function text(contents){
      return document.createTextNode(contents)
    }

    $('#beforeafter').append(text('append'))
    $('#beforeafter').prepend(text('prepend'))
    $('#beforeafter').before(text('before'))
    $('#beforeafter').after(text('after'))

    assertEqual('before<div id="beforeafter">prependappend</div>after', $('#beforeafter_container').html())

    $('#beforeafter_container').html('<div id="beforeafter"></div>')

    function div(contents){
      var el = document.createElement('div')
      el.innerHTML = contents
      return el
    }

    $('#beforeafter').append(div('append'))
    $('#beforeafter').prepend(div('prepend'))
    $('#beforeafter').before(div('before'))
    $('#beforeafter').after(div('after'))

    assertEqual(
      '<div>before</div><div id="beforeafter"><div>prepend</div>'+
      '<div>append</div></div><div>after</div>',
      $('#beforeafter_container').html()
    )

    //testing with Zepto object as parameter
    $('#beforeafter_container').html('<div id="beforeafter"></div>')

    $('#beforeafter').append($(div('append')))
    $('#beforeafter').prepend($(div('prepend')))
    $('#beforeafter').before($(div('before')))
    $('#beforeafter').after($(div('after')))

    assertEqual(
      '<div>before</div><div id="beforeafter"><div>prepend</div>'+
      '<div>append</div></div><div>after</div>',
      $('#beforeafter_container').html()
    )

    //testing with a zepto object of more than one element as parameter
    $(document.body).append('<div class="append">append1</div><div class="append">append2</div>')
    $(document.body).append('<div class="prepend">prepend1</div><div class="prepend">prepend2</div>')
    $(document.body).append('<div class="before">before1</div><div class="before">before2</div>')
    $(document.body).append('<div class="after">after1</div><div class="after">after2</div>')

    $('#beforeafter_container').html('<div id="beforeafter"></div>')

    $('#beforeafter').append($('.append'))
    $('#beforeafter').prepend($('.prepend'))
    $('#beforeafter').before($('.before'))
    $('#beforeafter').after($('.after'))

    assertEqual(
      '<div class="before">before1</div><div class="before">before2</div><div id="beforeafter"><div class="prepend">prepend1</div><div class="prepend">prepend2</div>'+
      '<div class="append">append1</div><div class="append">append2</div></div><div class="after">after1</div><div class="after">after2</div>',
      $('#beforeafter_container').html()
    )

    //

    var helloWorlds = [], appendContainer1 = $('<div> <div>Hello</div> <div>Hello</div> </div>'),
        helloDivs = appendContainer1.find('div')

    helloDivs.append(' world!')
    helloDivs.each(function() { helloWorlds.push($(this).text()) })
    assertEqual('Hello world!,Hello world!', helloWorlds.join(','))

    //

    var spans = [], appendContainer2 = $('<div> <div></div> <div></div> </div>'),
        appendDivs = appendContainer2.find('div')

    appendDivs.append($('<span>Test</span>'))
    appendDivs.each(function() { spans.push($(this).html()) })
    assertEqual('<span>Test</span>,<span>Test</span>', spans.join(','))
  });

  test("testBeforeAfterFragment", function() {
    var fragment = $('<div class=fragment />')
    fragment.before('before').after('after')
    assertLength(1, fragment)
    ok(fragment.hasClass('fragment'))
  });

  test("testAppendMultipleArguments", function() {
    var el = $('<div><span>original</span></div>')
    el.append(
      $('<b>one</b>').get(0),
      $('<b>two</b><b>three</b>').get(),
      $('<b>four</b><b>five</b>'),
      '<b>six</b>'
    )
    assertEqual('original one two three four five six',
      $.map(el.children(), function(c){ return $(c).text() }).join(' '))
  });

  test("testAppendToPrependTo", function() {
    //testing with Zepto object
    function div(contents){
      var el = document.createElement('div')
      el.innerHTML = contents
      return el
    }

    var ap = $(div('appendto'))

    var pr = $(div('prependto'))

    var ap2 = ap.appendTo($('#appendtoprependto'))
    var pr2 = pr.prependTo($('#appendtoprependto'))

    // Test the object returned is correct for method chaining
    same(ap, ap2)
    same(pr, pr2)

    assertEqual(
      '<div id="appendtoprependto"><div>prependto</div>'+
      '<div>appendto</div></div>',
      $('#appendtoprependto_container').html()
    )

    //testing with a zepto object of more than one element as parameter
    $(document.body).append('<div class="appendto">appendto1</div><div class="appendto">appendto2</div>')
    $(document.body).append('<div class="prependto">prependto1</div><div class="prependto">prependto2</div>')

    $('#appendtoprependto_container').html('<div id="appendtoprependto"></div>')    //TODO 影响了ap和pr的html（）

    $('.appendto').appendTo($('#appendtoprependto'))
    $('.prependto').prependTo($('#appendtoprependto'))

    assertEqual(
      '<div id="appendtoprependto"><div class="prependto">prependto1</div><div class="prependto">prependto2</div><div class="appendto">appendto1</div><div class="appendto">appendto2</div></div>',
      $('#appendtoprependto_container').html()
    )

    //testing with a selector as parameter
     ap = $(div('appendto'))
     pr = $(div('prependto'))
    $('#appendtoprependto_container').html('<div id="appendtoprependto"></div>')

    ap.appendTo('#appendtoprependto')
    pr.prependTo('#appendtoprependto')

    assertEqual(
      '<div id="appendtoprependto"><div>prependto</div>'+
      '<div>appendto</div></div>',
      $('#appendtoprependto_container').html()
    )
  });

  test("testInsertBeforeInsertAfter", function() {
    //testing with Zepto object
    function div(contents){
      var el = document.createElement('div')
      el.innerHTML = contents
      return el
    }

    var ib = $(div('insertbefore'))
    var ia = $(div('insertafter'))

    var ibia = $('#insertbeforeinsertafter')
    var ib2 = ib.insertBefore(ibia)
    var ia2 = ia.insertAfter(ibia)

    // Test the object returned is correct for method chaining
    assertEqual(
      '<div>insertbefore</div><div id="insertbeforeinsertafter">'+
      '</div><div>insertafter</div>',
      $('#insertbeforeinsertafter_container').html()
    )

    //testing with a zepto object of more than one element as parameter
    $(document.body).append('<div class="insertbefore">insertbefore1</div><div class="insertbefore">insertbefore2</div>')
    $(document.body).append('<div class="insertafter">insertafter1</div><div class="insertafter">insertafter2</div>')

    $('#insertbeforeinsertafter_container').html('<div id="insertbeforeinsertafter"></div>')

    $('.insertbefore').insertBefore($('#insertbeforeinsertafter'))
    $('.insertafter').insertAfter($('#insertbeforeinsertafter'))

    assertEqual(
      '<div class="insertbefore">insertbefore1</div><div class="insertbefore">insertbefore2</div>'+
      '<div id="insertbeforeinsertafter"></div><div class="insertafter">insertafter1</div>'+
      '<div class="insertafter">insertafter2</div>',
      $('#insertbeforeinsertafter_container').html()
    )

    //testing with a selector as parameter
    ib = $(div('insertbefore'))
    ia = $(div('insertafter'))
    $('#insertbeforeinsertafter_container').html('<div id="insertbeforeinsertafter"></div>')

    ib.insertBefore('#insertbeforeinsertafter')
    ia.insertAfter('#insertbeforeinsertafter')

    assertEqual(
      '<div>insertbefore</div><div id="insertbeforeinsertafter">'+
      '</div><div>insertafter</div>',
      $('#insertbeforeinsertafter_container').html()
    )
  });

  test("testAppendEval", function() {
   /*
    * marked by chenluyang
    * 新版修改
    window.someGlobalVariable = 0
    try {
      $('#fixtures').append(
        '<div><b id="newByAppend">Hi</b>' +
        '<\script>this.someGlobalVariable += $("#newByAppend").size()<\/script></div>'
      )
      assertIdentical(1, window.someGlobalVariable)
    } finally {
      delete window.someGlobalVariable
    }
    */
      try {
          window.someGlobalVariable = false
          $('<' + 'script>window.someGlobalVariable = true</script' + '>').appendTo('body')
          ok(window.someGlobalVariable)

          window.someGlobalVariable = false
          $('<' + 'script>this.someGlobalVariable = true</script' + '>').appendTo('body')
          ok(window.someGlobalVariable)
      } finally {
          delete window.someGlobalVariable
      }
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testNoEvalWithSrc", function() {
    try {
      window.someGlobalVariable = false
      $('<\script src="remote.js">window.someGlobalVariable = true<\/script>').appendTo('body')
      ok(!window.someGlobalVariable, 'expected SCRIPT with src not to be evaled')
    } finally {
      delete window.someGlobalVariable
    }
  });
*/
  test("testHtmlEval", function() {
   /*
    * marked by chenluyang
    * 新版修改
    window.someGlobalVariable = 0
    try {
      $('<div>').appendTo('#fixtures').html(
        '<div><b id="newByHtml">Hi</b>' +
        '<\script>this.someGlobalVariable += $("#newByHtml").size()<\/script></div>'
      )
      assertIdentical(1, window.someGlobalVariable)
    } finally {
      delete window.someGlobalVariable
    }
    */
      try {
          window.someGlobalVariable = false
          $('<div></div>').appendTo('body')
              .html('<' + 'script>window.someGlobalVariable = true</script' + '>')
          ok(window.someGlobalVariable)
      } finally {
          delete window.someGlobalVariable
      }
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testPrependEval", function() {
    window.someGlobalVariable = 0
    try {
      $('<div>').appendTo('#fixtures').prepend(
        '<b id="newByPrepend">Hi</b>' +
        '<\script>this.someGlobalVariable += $("#newByPrepend").size()<\/script>'
      )
      assertIdentical(1, window.someGlobalVariable)
    } finally {
      delete window.someGlobalVariable
    }
  });
*/
  test("testAppendTemplateNonEval", function() {
    try {
      window.someGlobalVariable = true
      $('<' + 'script type="text/template">window.someGlobalVariable = false</script' + '>').appendTo('body')
      ok(window.someGlobalVariable)

      window.someGlobalVariable = true
      $('<' + 'script type="text/template">this.someGlobalVariable = false</script' + '>').appendTo('body')
      ok(window.someGlobalVariable)
    } finally {
      delete window.someGlobalVariable
    }
  });

  test("testHtmlTemplateNonEval", function() {
    try {
      window.someGlobalVariable = true
      $('<div></div>').appendTo('body')
        .html('<' + 'script type="text/template">window.someGlobalVariable = false</script' + '>')
      ok(window.someGlobalVariable)
    } finally {
      delete window.someGlobalVariable
    }
  });

  test("testRemove", function() {
    var newElement1 = $('<div id="some_new_element_1" />')

    newElement1
      .appendTo('body')
      .remove()

    assertEqual( $('#some_new_element_1').length, 0 )

    //

    var newElement2 = $('<div id="some_new_element_2" />'),
        errorRaised = false

    newElement2.appendTo('body')

    $('#some_new_element_2').remove()

    try {
      newElement2.remove()
    } catch (e) {
      errorRaised = true
    }

    ok(!errorRaised)
  });

  test("testAddRemoveClass", function() {
    var el = $('#some_element').get(0)

    $('#some_element').addClass('green')
    assertEqual('green', el.className)
    $('#some_element').addClass('green')
    assertEqual('green', el.className)
    $('#some_element').addClass('red')
    assertEqual('green red', el.className)
    $('#some_element').addClass('blue red')
    assertEqual('green red blue', el.className)
    $('#some_element').removeClass('green blue')
    assertEqual('red', el.className)

    $('#some_element').attr('class', ' red green blue ')
    assertEqual(' red green blue ', el.className) // sanity check that WebKit doesn't change original input
    $('#some_element').removeClass('green')
    assertEqual('red blue', el.className)

    //addClass with function argument
    $('#some_element').addClass(function(idx,classes){
      //test the value of "this"
      assertEqualCollection($('#some_element'), $(this))
      //test original classes are being passed
      assertEqual('red blue', this.className)
      return "green"
    })
    assertEqual('red blue green', el.className)

    //removeClass with function argument
    $('#some_element').removeClass(function(idx,classes){
      //test the value of "this"
      assertEqualCollection($('#some_element'), $(this))
      //test original classes are being passed
      assertEqual('red blue green', this.className)
      return "blue"
    })
    assertEqual('red green', el.className)

    $('#some_element').removeClass()
    assertEqual('', el.className)
  });

  test("testHasClass", function() {
    var el = $('#some_element').get(0)
    $('#some_element').addClass('green')

    ok($('#some_element').hasClass('green'))
    ok(!$('#some_element').hasClass('orange'))

    $('#some_element').addClass('orange')
    ok($('#some_element').hasClass('green'))
    ok($('#some_element').hasClass('orange'))
  });

  test("testHasClassEmpty", function() {
    var z = $('#doesnotexist')
    assertEqual(0, z.size())
    assertFalse(z.hasClass('a'))
  });

  test("testToggleClass", function() {
    var el = $('#toggle_element').get(0)
    $('#toggle_element').toggleClass('green')

    ok($('#toggle_element').hasClass('green'))
    ok(!$('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange')
    ok($('#toggle_element').hasClass('green'))
    ok($('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('green')

    ok(!$('#toggle_element').hasClass('green'))
    ok($('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange')
    ok(!$('#toggle_element').hasClass('green'))
    ok(!$('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange', false)
    ok(!$('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange', false)
    ok(!$('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange', true)
    ok($('#toggle_element').hasClass('orange'))

    $('#toggle_element').toggleClass('orange', true)
    ok($('#toggle_element').hasClass('orange'))

    //function argument
    $('#toggle_element').toggleClass(function(idx,classes){
      //test the value of "this"
      assertEqualCollection($('#toggle_element'), $(this))
      //test original classes are being passed
      assertEqual('orange', this.className)
      return "brown"
    })
    ok($('#toggle_element').hasClass('brown'))

    $('#toggle_element').toggleClass(function(idx,classes){
      return "yellow"
    },false)
    ok(!$('#toggle_element').hasClass('yellow'))

    $('#toggle_element').toggleClass(function(idx,classes){
      return "yellow"
    },true)
    ok($('#toggle_element').hasClass('yellow'))
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testClassSVG", function() {
    var svg = $('svg')
    ok(!svg.hasClass('foo'))
    svg.addClass('foo bar')
    ok(svg.hasClass('foo'))
    ok(svg.hasClass('bar'))
    svg.removeClass('foo')
    ok(!svg.hasClass('foo'))
    ok(svg.hasClass('bar'))
    svg.toggleClass('bar')
    ok(!svg.hasClass('foo'))
    ok(!svg.hasClass('bar'))
  });
*/
  test("testIndex", function() {
    assertEqual($("p > span").index("#nay"), 2)
    assertEqual($("p > span").index(".yay"), 0)
    assertEqual($("span").index("span"), 0)
    assertEqual($("span").index("boo"), -1)

    assertEqual($('#index_test > *').eq(-1).index(), 1)
  });

  test("testBoolAttr", function() {
    assertEqual($('#BooleanInput').attr('required'), true)
    assertEqual($('#BooleanInput').attr('non_existant_attr'), undefined)
  });

  test("testDocumentReady", function() {
    // Check that if document is already loaded, ready() immediately executes callback
    var arg1, arg2, fired = false
    $(function (Z1) {
      arg1 = Z1
      $(document).ready(function (Z2) {
        arg2 = Z2
        fired = true
      })
    })
    assertTrue(fired)
    assertIdentical(Zepto, arg1)
    assertIdentical(Zepto, arg2)
  });

  test("testSlice", function() {
    var $els = $("#slice_test div")
    assertEqual($els.slice().length, 3)
    assertEqual(typeof $els.slice().ready, 'function')
    assertEqual($els.slice(-1)[0].className, 'slice3')
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testScrollTop", function() {
    ok($(window).scrollTop() >= 0)
    ok($(document.body).scrollTop() >= 0)
  });

  test("testSort", function() {
    var els = $(['eight', 'nine', 'ten', 'eleven'])
    var result = els.sort(function(a,b){ return b.length > a.length ? -1 : 1 })
    assertIdentical(els, result)
    assertEqual(4, result.size())
    assertEqualCollection(['ten', 'nine', 'eight', 'eleven'], result)
  });
*/
  test("testBind", function() {
    var counter = 0
    $(document.body).bind('click', function(){ counter++ })
    click($('#some_element').get(0))
    assertEqual(1, counter)

    counter = 0
    $('#some_element').bind('click mousedown', function(){ counter++ })
    click($('#some_element').get(0))
    mousedown($('#some_element').get(0))
    assertEqual(3, counter) // 1 = body click, 2 = element click, 3 = element mousedown
  });

  test("testBindWithObject", function() {
    var counter = 0, keyCounter = 0, el = $('#some_element'),
      eventData = {
        click: function(){ counter++ },
        keypress: function(){ keyCounter++ }
      }

    $(document.body).bind(eventData)

    el.trigger('click')
    el.trigger('click')
    assertEqual(2, counter)
    el.trigger('keypress')
    assertEqual(1, keyCounter)

    $(document.body).unbind({ keypress: eventData.keypress })

    el.trigger('click')
    assertEqual(3, counter)
    el.trigger('keypress')
    assertEqual(1, keyCounter)
  });

  test("testBindContext", function() {
    var context, handler = function(){
      context = $(this)
    }
    $('#empty_test').bind("click",handler)
    $('#empty_test').bind("mousedown",handler)
    click($('#empty_test').get(0))
    assertEqualCollection($('#empty_test'), context)
    context = null
    mousedown($('#empty_test').get(0))
    assertEqualCollection($('#empty_test'), context)
  });

  test("testBindWithCustomData", function() {
    var counter = 0
    var handler = function(ev,customData) { 
    	counter = customData.counter 
    	}

    $('#some_element').bind('custom', handler)
    $('#some_element').trigger('custom', { counter: 10 })
    assertEqual(10, counter)
  });

  test("testBindPreventDefault", function() {
    var link = $('<a href="#"></a>'),
        prevented = false

    link
      .appendTo('body')
      .bind('click', function () {
        return false
      })
      .bind('click', function (e) {
        prevented = e.defaultPrevented
      })
      .trigger('click')

    ok(prevented)
  });

  test("testCreateEventObject", function() {
      var e = $.Event('custom')
      assertEqual('custom', e.type)

      var e2 = new $.Event('custom')
      assertEqual('custom', e2.type)

      var e3 = $.Event('custom', {customKey: 'customValue'})
      assertEqual('custom', e3.type)
      assertEqual('customValue', e3.customKey)

      var e4 = $.Event('custom', {bubbles: false})
      assertFalse(e4.bubbles)
      /**
       * marked by chenluyang
       * 新版添加
       * var e5 = $.Event({ type: 'keyup', keyCode: 40 })
         assertEqual('keyup', e5.type)
         assertEqual(40, e5.keyCode)
       */
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testTriggerObject", function() {
    var el = $('#some_element'),
        eventType, eventCode

    el.on('keyup', function(e){
      eventType = e.type
      eventCode = e.keyCode
    })
    el.trigger({ type: 'keyup', keyCode: 40 })

    assertEqual('keyup', eventType)
    assertEqual(40, eventCode)
  });
*/
  test("testTriggerEventObject", function() {
    var counter = 0,
        customEventKey = 0

    var handler = function(ev,customData) {
      counter = customData.counter
      customEventKey = ev.customKey
    }

    var customEventObject = $.Event('custom', { customKey: 20 })

    $('#some_element').bind('custom', handler)
    $('#some_element').trigger(customEventObject, { counter: 10 })

    assertEqual(10, counter)
    assertEqual(20, customEventKey)
    $('#some_element').unbind('custom', handler)
  });

  test("testTriggerEventCancelled", function() {
   /*
    * marked by chenluyang
    * 新版修改
    $('#some_element').bind('custom', function(e){
      e.preventDefault()
    })
    var event = $.Event('custom')
    assertNot(event.defaultPrevented)
    assertNot(event.isDefaultPrevented())

    $('#some_element').trigger(event)
    ok(event.defaultPrevented)
    ok(event.isDefaultPrevented())
    */
      $('#some_element').bind('custom', function(e){
          e.preventDefault()
      })
      var event = $.Event('custom')
      ok(!event.defaultPrevented)
      $('#some_element').trigger(event)
      /**
       * modified by chenluyang
       *  在ie10下，能够触发custom事件，但event.defaultPrevented值不改变, 在event.js做了修改
       *  添加了ieDefaultPrevented实现阻止默认事件
       *  @original
       *  ok(event.defaultPrevented)
       *
       */
	   //alert(event.defaultPrevented)
      ok(event.defaultPrevented)
  });

  test("testTriggerHandler", function() {
    assertUndefined($('doesnotexist').triggerHandler('submit'))

    var form = $('#trigger_handler form').get(0)
    $('#trigger_handler').bind('submit', function(e) {
      t.fail("triggerHandler shouldn't bubble")
    })

    var executed = []
    $(form).bind('submit', function(e) {
      executed.push("1")
      assertEqual(form, e.target)
      return 1
    })
    $(form).bind('submit', function(e) {
      executed.push("2")
      assertEqual(form, e.target)
      e.stopImmediatePropagation()
      return 2
    })
    $(form).bind('submit', function(e) {
      t.fail("triggerHandler shouldn't continue after stopImmediatePropagation")
    })
    assertIdentical(2, $(form).triggerHandler('submit'))
    assertEqual('1 2', executed.join(' '))
  });

  test("testUnbind", function() {
    var counter = 0, el = $('#another_element').get(0)
    var handler = function(){ counter++ }
    $('#another_element').bind('click mousedown', handler)
    click(el)
    mousedown(el)
    assertEqual(2, counter)

    $('#another_element').unbind('click', handler)
    click(el)
    assertEqual(2, counter)
    mousedown(el)
    assertEqual(3, counter)

    $('#another_element').unbind('mousedown')
    mousedown(el)
    assertEqual(3, counter)

    $('#another_element').bind('click mousedown', handler)
    click(el)
    mousedown(el)
    assertEqual(5, counter)

    $('#another_element').unbind()
    click(el)
    mousedown(el)
    assertEqual(5, counter)
  });

  test("testUnbindWithNamespace", function() {
    var count = 0
    $("#namespace_test").bind("click.bar", function() { count++ })
    $("#namespace_test").bind("click.foo", function() { count++ })
    $("#namespace_test").bind("mousedown.foo.bar", function() { count++ })

    $("#namespace_test").trigger("click")
    assertEqual(2, count)

    $("#namespace_test").unbind("click.baz")
    $("#namespace_test").trigger("click")
    assertEqual(4, count)

    $("#namespace_test").unbind("click.foo")
    $("#namespace_test").trigger("click")
    assertEqual(5, count)

    $("#namespace_test").trigger("mousedown")
    assertEqual(6, count)

    $("#namespace_test").unbind(".bar")
    $("#namespace_test").trigger("click").trigger("mousedown")
    assertEqual(6, count)
  });

  test("testDelegate", function() {
    var counter = 0, pcounter = 0
    $(document.body).delegate('#some_element', 'click', function(){ counter++ })
    $('p').delegate('span.yay', 'click', function(){ counter++ })
    $(document.body).delegate('p', 'click', function(){ pcounter++ })

    click($('#some_element').get(0))
    assertEqual(1, counter)

    click($('span.yay').get(0))
    assertEqual(2, counter)

    click($('span.nay').get(0))
    assertEqual(2, counter)

    click($('p').get(0))
    assertEqual(3, pcounter)
  });

  test("testDelegateBlurFocus", function() {
      /**
       * marked by chenluyang
       * 单独测试时没有问题，见case/testDelegateBlurFocus.html
       */
    var counter = 0
    $('#delegate_blur_test').delegate('input', 'blur', function(){ counter++ })

    $('#delegate_blur_test').find('input').focus()
    $('#delegate_blur_test').find('input').blur()
    assertEqual(1, counter)

    $('#delegate_blur_test').find('input').focus()
    $('#delegate_blur_test').find('input').blur()
    assertEqual(2, counter)

    $('#delegate_focus_test').delegate('input', 'focus', function(){ counter++ })

    $('#delegate_focus_test').find('input').focus()
    $('#delegate_focus_test').find('input').blur()
    assertEqual(3, counter)

    $('#delegate_focus_test').find('input').focus()
    $('#delegate_focus_test').find('input').blur()
    assertEqual(4, counter)
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testDelegateNamespacedBlurFocus", function() {
    var counter = 0
    $('#delegate_blur_test').delegate('input', 'blur.namespace_test', function(){ counter++ })

    $('#delegate_blur_test').find('input').focus()
    $('#delegate_blur_test').find('input').blur()
    assertEqual(1, counter)

    $('#delegate_blur_test').find('input').focus()
    $('#delegate_blur_test').find('input').blur()
    assertEqual(2, counter)

    $('#delegate_focus_test').delegate('input', 'focus.namespace_test', function(){ counter++ })

    $('#delegate_focus_test').find('input').focus()
    $('#delegate_focus_test').find('input').blur()
    assertEqual(3, counter)

    $('#delegate_focus_test').find('input').focus()
    $('#delegate_focus_test').find('input').blur()
    assertEqual(4, counter)
  });

  test("testUndelegateNamespacedBlurFocus", function() {
    var el, counter = 0

    el = $('#delegate_blur_test')

    el.delegate('input', 'blur.test', function(){ counter++ })
    el.find('input').focus().blur()
    assertEqual(1, counter, 'expected handler to be triggered')

    el.undelegate('input', '.test')
    el.find('input').focus().blur()
    assertEqual(1, counter, 'expected handler to unbind')

    el = $('#delegate_focus_test')

    el.delegate('input', 'focus.test', function(){ counter++ })
    el.find('input').focus().blur()
    assertEqual(2, counter, 'expected handler to be triggered')

    el.undelegate('input', '.test')
    el.find('input').focus().blur()
    assertEqual(2, counter, 'expected handler to unbind')
  });
*/
  test("testDelegateReturnFalse", function() {
    $(document.body).delegate('#some_element', 'click', function(){ return false })

    var event = $.Event('click')
    $('#some_element').trigger(event)
      /**
       * modified by chenluyang
       *  在ie10下，能够触发custom事件，但event.defaultPrevented值不改变, 在event.js做了修改
       *  添加了ieDefaultPrevented实现阻止默认事件
       *  @original
       *  ok(event.defaultPrevented)
       *
       */
    assertTrue(event.ieDefaultPrevented !== undefined ? event.ieDefaultPrevented : event.defaultPrevented)
  });

  test("testDelegateWithObject", function() {
    var counter = 0, received, el = $('p').first(),
      eventData = {
        click: function(){ counter++ },
        custom: function(e, data){ received = data }
      }

    $(document.body).delegate('p', eventData)

    el.trigger('click')
    assertEqual(1, counter)
    el.trigger('click')
    assertEqual(2, counter)
    el.trigger('custom', 'boo')
    assertEqual('boo', received)

    $(document.body).undelegate('p', {custom: eventData.custom})

    el.trigger('click')
    assertEqual(3, counter)
    el.trigger('custom', 'bam')
    assertEqual('boo', received)
  });

  test("testDelegateWithCustomData", function() {
    var received
    $(document).delegate('#some_element', 'custom', function(e, data, more){ received = data + more })
    $('p').delegate('span.yay', 'custom', function(e, data){ received = data })
    $(document).delegate('p', 'custom', function(e, data){ received = data })

    $('#some_element').trigger('custom', 'one')
    assertEqual('oneundefined', received)
    $('#some_element').trigger('custom', ['one', 'two'])
    assertEqual('onetwo', received)

    $('span.yay').trigger('custom', 'boom')
    assertEqual('boom', received)
    $('span.yay').trigger('custom', ['bam', 'boom'])
    assertEqual('bam', received)

    $('span.nay').trigger('custom', 'noes')
    assertEqual('noes', received)

    $('p').first().trigger('custom', 'para')
    assertEqual('para', received)
  });

  test("testDelegateEventProxy", function() {
    var content
    $('div#delegate_test').delegate('span.second-level', 'click', function(e){
      assertEqual($('span.second-level').get(0), this)
      assertEqual($('span.second-level').get(0), e.currentTarget)
      refuteEqual($('span.second-level').get(0), e.originalEvent.currentTarget)
      assertEqual($('div#delegate_test').get(0), e.liveFired)
      content = $(this).html()
    })
    click($('span.second-level').get(0))
    assertEqual('hi', content)

    var fired = false
    if (window.location.hash.length) window.location.hash = ''
    $('div#delegate_test').html('<a href="#foo"></a>')
    $('div#delegate_test').delegate('a', 'click', function(e){
      e.preventDefault()
      fired = true
    })
    click($('div#delegate_test a').get(0))
    ok(fired)
    refuteEqual('#foo', window.location.hash)

    fired = false
    if (window.location.hash.length) window.location.hash = ''
    $('div#delegate_test').html('<a href="#bar"></a>')
    $('div#delegate_test a').trigger('click')
    ok(fired)
    refuteEqual('#bar', window.location.hash)
  });

  test("testUndelegate", function() {
    var count = 0, handler = function() { count++ }
    $("#undelegate_test").bind("click mousedown", handler)
    $("#undelegate_test").delegate("span.first-level", "click mousedown", handler)
    $("#undelegate_test").delegate("span.second-level", "click mousedown", handler)
    $("#undelegate_test span.second-level").trigger("click")
    assertEqual(3, count)

    $("#undelegate_test").undelegate("span.second-level", "click", handler)
    $("#undelegate_test span.second-level").trigger("click")
    assertEqual(5, count)

    $("#undelegate_test").undelegate("span.first-level")
    $("#undelegate_test span.second-level").trigger("click")
    assertEqual(6, count)

    $("#undelegate_test").unbind("click")
    $("#undelegate_test span.second-level").trigger("click")
    assertEqual(6, count)

    $("#undelegate_test span.second-level").trigger("mousedown")
    assertEqual(8, count)

    $("#undelegate_test").undelegate()
    $("#undelegate_test span.second-level").trigger("mousedown")
    assertEqual(8, count)
  });

  test("testLive", function() {
    var counter = 0
    $('p.live').live('click', function(){ counter++ })

    $(document.body).append('<p class="live" id="live_1"></p>')
    $(document.body).append('<p class="live" id="live_2"></p>')

    click($('#live_1').get(0))
    click($('#live_2').get(0))

    $('p.live').remove()
    $(document.body).append('<p class="live" id="live_this_test"></p>')

    $('p.live').live('click', function(){
      assertEqual(document.getElementById('live_this_test'), this)
    })
    click($('#live_this_test').get(0))

    assertEqual(3, counter)
  });

  test("testDie", function() {
    var count = 0, handler = function() { count++ }
    $("#another_element").live("click mousedown", handler)
    $("#another_element").trigger("click")
    assertEqual(1, count)

    $("#another_element").die("click", handler)
    $("#another_element").trigger("click")
    assertEqual(1, count)

    $("#another_element").trigger("mousedown")
    assertEqual(2, count)

    $("#another_element").die()
    $("#another_element").trigger("mousedown")
    assertEqual(2, count)
  });

  test("testOn", function() {
    var el = $('#some_element'), node = el.get(0), ret,
      bindTriggered = 0, delegateTriggered = 0

    ret = el.on('click', function(e){
      bindTriggered++
      assertIdentical(node, this)
    })
      .on({ click: function(){bindTriggered++} })
    assertIdentical(el, ret)

    ret = $(document.body).on('click', 'div', function(e){
      delegateTriggered++
      assertIdentical(node, this)
    })
      .on({ click: function(){delegateTriggered++} }, '*[id^=some]')
    assertIdentical(document.body, ret.get(0))

    click(node)
    assertEqual(2, bindTriggered, "bind handlers")
    assertEqual(2, delegateTriggered, "delegate handlers")
  });
/*
 * marked by chenluyang
 * 新版添加
  test("testOnReturnFalse", function() {
    var el = $('#some_element')

    el.on('click', function(){
      setTimeout(function(){
        start();
      }, 10)
      ok(true, "should have been called")
      return false
    })
    $(document.body).on('click', function(){
      assertNot(true, "the event should have been stopped")
    })

    stop();
    click(el.get(0))
  });
*/
  test("testOff", function() {
    var el = $('#some_element'), bindTriggered = 0, delegateTriggered = 0,
      handler = function(){ bindTriggered++ }

    el.bind('click', handler).bind('click', function(){ bindTriggered++ })
    el.live('click', function(){ 
    	delegateTriggered++ })

    click(el.get(0))
    assertEqual(2, bindTriggered, "bind handlers before unbind")
    assertEqual(1, delegateTriggered, "delegate handlers before unbind")

    el.off('click', handler)
    $(document.body).off('click', '#some_element')

    click(el.get(0))
    assertEqual(3, bindTriggered, "bind handlers")
    assertEqual(1, delegateTriggered, "delegate handlers")
  });

  test("testOne", function() {
    var counter = 0, context, received, el = $('#some_element')
    $(document.body).one('click', function(e, data, more){
      context = this
      counter++
      received = data + more
      assertIn('preventDefault', e)
      return false
    })

    var evt = $.Event('click')
    el.trigger(evt, ['one', 'two'])
    assertEqual(1, counter)
    assertEqual('onetwo', received)
    assertIdentical(document.body, context)
      /**
       * modified by chenluyang
       *  在ie10下，能够触发custom事件，但event.defaultPrevented值不改变, 在event.js做了修改
       *  添加了ieDefaultPrevented实现阻止默认事件
       *  @original
       *  ok(event.defaultPrevented)
       *
       */
    assertTrue(evt.ieDefaultPrevented !== undefined ? evt.ieDefaultPrevented : evt.defaultPrevented)

    el.trigger('click')
    assertEqual(1, counter, "the event handler didn't unbind itself")
  });

  test("testOneWithObject", function() {
    var counter = 0, el = $('#some_element')
    $(document.body).one({
      click: function() { counter++ },
      custom: function() { counter-- }
    })

    el.trigger('click')
    assertEqual(1, counter)
    el.trigger('click')
    assertEqual(1, counter)

    el.trigger('custom')
    assertEqual(0, counter)
    el.trigger('custom')
    assertEqual(0, counter)
  });

  test("testDOMEventWrappers", function() {
    var events = ('blur focus focusin focusout load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout '+
      'change select keydown keypress keyup error').split(' ')

    var el = $('#another_element'), count = 0

    events.forEach(function(event){
      assertTrue($.isFunction(el[event]), 'event type: ' + event)
    })

    el.click(function(){ count++ })
    click(el.get(0))

    assertEqual(1, count)
  });

  test("testCustomEvents", function() {
    var el = $(document.body)

    el.bind('custom', function(evt, a, b) {
      assertEqual(a, 1)
      assertEqual(b, 2)
      el.unbind()
    })
    el.trigger('custom', [1, 2])

    el.bind('custom', function(evt, a) {
      assertEqual(a, 1)
      el.unbind()
    })
    el.trigger('custom', 1)

    var eventData = {z: 1}
    el.bind('custom', function(evt, a) {
      assertEqual(a, eventData)
      el.unbind()
    })
    el.trigger('custom', eventData)
  });

  test("testSpecialEvent", function() {
    var clickEvent     = $.Event('click'),
        mouseDownEvent = $.Event('mousedown'),
        mouseUpEvent   = $.Event('mouseup'),
        mouseMoveEvent = $.Event('mousemove'),
        submitEvent    = $.Event('submit')

    assertEqual(MouseEvent, clickEvent.constructor)
    assertEqual(MouseEvent, mouseDownEvent.constructor)
    assertEqual(MouseEvent, mouseUpEvent.constructor)
    assertEqual(MouseEvent, mouseMoveEvent.constructor)
    assertEqual(Event,      submitEvent.constructor)
  });