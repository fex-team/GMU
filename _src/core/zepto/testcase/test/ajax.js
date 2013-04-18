;(function(){

    function deferredResume(fn) {
        setTimeout(function() {
            fn && fn()
            start()
        }, 5)
    }

    test("prepare", function(){
        var html = '<p id="results">Running… see browser console for results</p><div id="fixtures"><div id="ajax_load"></div></div>';
        $("body").append(html);
        ok($("#fixtures"));
    })

    asyncTest("testAjaxBase", function(){
        stop()
        var xhr = $.ajax({
            url: upath + 'html/fixtures/ajax_load_simple.html',
            complete: function() { deferredResume() }
        })
        assertEqual('function', typeof xhr['getResponseHeader'])
    })

    asyncTest("testAjaxGet", function(t){
        stop()
        var xhr = $.get(upath + 'html/fixtures/ajax_load_simple.html', function(response){
            var that = this
            deferredResume(function(){
                ok(response)
                assertIdentical(window, that)
            })
        })
        assertIn('abort', xhr)
    })

    asyncTest("testAjaxPost", function(t){
        stop()
        var xhr = $.post(upath + 'html/fixtures/ajax_load_simple.html', function(response){
            deferredResume(function(){
                ok(response)
            })
        })
        assertIn('abort', xhr)
    })

    asyncTest("testNumberOfActiveRequests", function(t) {
        var maxActive = 0, ajaxStarted = 0, ajaxEnded = 0, requestsCompleted = 0
        assertIdentical(0, $.active, 'initial count mismatch')
        $(document)
            .on('ajaxStart', function() { ajaxStarted++ })
            .on('ajaxEnd', function() { ajaxEnded++ })
            .on('ajaxSend', function() {
                if ($.active > maxActive) maxActive = $.active
            })
            .on('ajaxComplete', function() {
                if (++requestsCompleted == 3)
                    deferredResume(function() {
                        assertEqual(3, maxActive)
                        assertIdentical(0, $.active)
                    })
            })

        stop()
        $.ajax({url: upath + 'html/fixtures/ajax_load_simple.html'})
        $.ajax({url: upath + 'html/fixtures/ajax_load_simple.html'})
        $.ajax({url: upath + 'html/fixtures/ajax_load_simple.html'})
    })

    asyncTest("testAjaxPostWithAcceptType", function(t) {
        stop()
        $.post(upath + 'html/fixtures/ajax_load_simple.html', { sample: 'data' }, function(response) {
            deferredResume(function() {
                ok(response)
            })
        }, 'text/plain')
    })

    asyncTest("testAjaxGetJSON", function(t){
        stop()
        var xhr = $.getJSON(upath + 'html/fixtures/zepto.json', function(data){
            deferredResume(function(){
                assertEqual('awesomeness', data.zepto)
            })
        })
        assertIn('abort', xhr)
    })

    asyncTest("testAjaxGetJSONP", function(t){

    	stop();
        var xhr = $.getJSON(upath + 'html/fixtures/jsonp.js?callback=?&timestamp='+(+new Date), function(data){
            deferredResume(function(){
                assertEqual('world', data.hello)
                assertEqual(0, $('script[src*=fixtures]').size())
            })
        })
        //console.log($('script'));
        assertEqual(1, $('script[src*=fixtures]').size())   //TODO ERROR IE&CHROME
        assertIn('abort', xhr)
    })
    /*
     * marked by chenluyang
     * 新版添加
    asyncTest("testAjaxJSONP", function(t){
        stop()
        var xhr = $.ajaxJSONP({
            url: upath + 'html/fixtures/jsonp.js?callback=?&timestamp='+(+new Date),
            complete: function(data){
                ok(true)
                deferredResume()
            }
        })
    })
    */
    asyncTest("testAjaxGetJSONPErrorCallback", function(t){
        stop()
        $.ajax({
            type: 'GET',
            url: upath + 'html/fixtures/404.js?timestamp='+(+new Date),
            dataType: 'jsonp',
            success: function() { refute(true) },
            error: function() { ok(true) },
            complete: function() { deferredResume() }
        })
    })

    asyncTest("testJSONPdataType", function(t){
        stop()
        $.ajax({
            dataType: 'jsonp',
            url: upath + 'html/fixtures/jsonp.js?timestamp='+(+new Date),
            success: function(data){
                deferredResume(function(){
                    assertEqual('world', data.hello)
                })
            }
        })
    })

    test("testAjaxJSONPWithDataSupport", function(t) {
        var xhr = $.ajax({
            url: upath + 'html/fixtures/jsonp.js?callback=?&timestamp='+(+new Date),
            data: {
                param1: 'val1',
                param2: 'val2'
            }
        })
        ok($('script[src^="'+ upath +'"]').attr('src').match('param1=val1&param2=val2'))
        xhr.abort()
    })

    asyncTest("testAjaxLoad", function(t) {
        var testEl = $('#ajax_load')
        stop()
        var el = testEl.load(upath + 'html/fixtures/ajax_load_simple.html', function(response, status, xhr){
            var that = this
            deferredResume(function(){
                assertIdentical(testEl, that)
                assertEqual('simple ajax load', testEl.html().trim())
            })
        })
        assertIdentical(testEl, el)
    })

    asyncTest("testAjaxLoadWithSelector", function(t) {
        var testEl = $('#ajax_load')
        stop()
        testEl.load(upath + 'html/fixtures/ajax_load_selector.html #ajax_load_test_div', function(){
            deferredResume(function() {
                assertEqual('ajax load with selector', testEl.html().trim())
            })
        })
    })

    asyncTest("testAjaxLoadWithJavaScript", function (t) {
        var testEl = $('#ajax_load')
        stop()
        window.testValue = 0
        testEl.load(upath + 'html/fixtures/ajax_load_selector_javascript.html', function(){
            deferredResume(function(){
                assertEqual(window.testValue, 1)
                delete window.testValue
            })
        })
    })

    asyncTest("testAjaxLoadWithSelectorAndJavaScript", function (t) {
        var testEl = $('#ajax_load')
        stop()
        window.testValue = 0
        testEl.load(upath + 'html/fixtures/ajax_load_selector_javascript.html #ajax_load_test_div', function() {
            deferredResume(function(){
                assertEqual(window.testValue, 0)
                delete window.testValue
            })
        })
    })

    asyncTest("testAjaxWithContext", function(t) {
        stop()
        var body = $('body')
        $.ajax({
            url: upath + 'html/fixtures/ajax_load_simple.html',
            context: body,
            complete: function(){
                var that = this
                deferredResume(function(){
                    assertIdentical(body, that)
                })
            }
        })
    })

    asyncTest("testAjaxWithObjectContext", function(t) {
        stop()
        var context = {}
        $.ajax({
            url: upath + 'html/fixtures/ajax_load_simple.html',
            context: context,
            complete: function(){
                deferredResume()
            }
        })
    })
    test('prepareAgain', function(){
        OriginalXHR = $.ajaxSettings.xhr
        MockXHR = function() {
            this.headers = []
            this.responseHeaders = {}
            MockXHR.last = this
        }
        MockXHR.prototype = {
            open: function(method, url, async) {
                this.method = method
                this.url = url
                this.async = async
            },
            setRequestHeader: function(name, value) {
                this.headers.push({ name: name, value: value })
            },
            getResponseHeader: function(name) {
                return this.responseHeaders[name]
            },
            overrideMimeType: function(type) {
                this.responseHeaders['content-type'] = type
            },
            send: function(data) {
                this.data = data
            },
            abort: function() {
                this.aborted = true
            },
            ready: function(readyState, status, responseText, headers) {
                this.readyState = readyState
                this.status = status
                this.responseText = responseText
                $.extend(this.responseHeaders, headers)
                this.onreadystatechange()
            },
            onreadystatechange: function() {}
        }
        matchHeader = function(name, value) {
            return function(header) {
                return header.name == name && (!value || header.value == value)
            }
        }
        $.ajaxSettings.xhr = function(){ return new MockXHR }
    })



    //$.ajaxSettings.xhr = OriginalXHR
    //$(document).off()
    //$.active = 0

    test("testTypeDefaultsToGET", function() {
        $.ajax({
            url: '/foo',
            beforeSend: function(xhr, settings) {
                assertFalse(settings.crossDomain)
            }
        })
        assertEqual('GET', MockXHR.last.method)
    })

    test("testURLDefaultsToWindowLocation", function() {
        $.ajax()
        assertEqual(window.location, MockXHR.last.url)
    })

    test("testCrossDomain", function(t) {
        $.ajax({
            url: 'http://example.com/foo',
            beforeSend: function(xhr, settings) {
                assertTrue(settings.crossDomain)
            }
        })
    })

    test("testDataTypeOptionSetsAcceptHeader", function() {
        $.ajax()
        ok(!MockXHR.last.headers.some(matchHeader('Accept')))

        $.ajax({ dataType: 'json' })
        ok(MockXHR.last.headers.some(matchHeader('Accept', 'application/json')))
        // verifies overrideMimeType:
        assertEqual('application/json', MockXHR.last.getResponseHeader('content-type'))
    })

    test("testContentTypeOptionSetsContentTypeHeader", function() {
        $.ajax()
        ok(!MockXHR.last.headers.some(matchHeader('Content-Type')))

        $.ajax({ contentType: 'text/html' })
        ok(MockXHR.last.headers.some(matchHeader('Content-Type', 'text/html')))

        $.ajax({ type: 'POST', data: [], contentType: 'application/x-foo' })
        ok(MockXHR.last.headers.some(matchHeader('Content-Type', 'application/x-foo')))
    })

    test("testHeadersOptionCanSetContentType", function(t) {
        $.ajax({ type: 'POST', data: [], headers: { 'Content-Type': 'application/hal+json' }})
        ok(MockXHR.last.headers.some(matchHeader('Content-Type', 'application/hal+json')))
    })

    test("testContentTypeDefaultsToUrlEncoded", function(t) {
        $.ajax({ type: 'GET', data: 'x' })
        refuteEqual(MockXHR.last.headers.some(matchHeader('Content-Type', 'application/x-www-form-urlencoded')))
        $.ajax({ type: 'POST', data: 'x' })
        ok(MockXHR.last.headers.some(matchHeader('Content-Type', 'application/x-www-form-urlencoded')))
    })

    test("testDefaultContentTypeDisabled", function() {
        $.ajax({ type: 'POST', data: {a:1}, contentType: false })
        refuteEqual(MockXHR.last.headers.some(matchHeader('Content-Type')))
    })

    test("testCustomHeader", function() {
        $.ajax({ headers: {'X-Awesome': 'true'} })
        ok(MockXHR.last.headers.some(matchHeader('X-Requested-With', 'XMLHttpRequest')))
        ok(MockXHR.last.headers.some(matchHeader('X-Awesome', 'true')))
    })

    test("testJSONdataType", function() {
        var result = {}
        $.ajax({ dataType: 'json', success: function(json) {result = json } })
        MockXHR.last.ready(4, 200, '{"hello":"world"}')
        assertEqual("world", result.hello)
    })

    test("testJSONcontentType", function(t) {
        var result = {}
        $.ajax({ success: function(json) {result = json } })
        MockXHR.last.ready(4, 200, '{"hello":"world"}', {'content-type': 'application/json'})
        assertEqual("world", result.hello)
    })

    test("testJSONResponseBodiesAreNotParsedWhenDataTypeOptionIsJSONButResponseIsEmptyString", function(t) {
        var result, success = false
        $.ajax({ dataType: 'json', success: function(json) {result = json; success = true } })
        MockXHR.last.ready(4, 200, '')
        ok(success)
        assertNull(result)
    })

    test("testJSONResponseBodiesAreNotParsedWhenDataTypeOptionIsJSONButResponseIsSingleSpace", function(t) {
        var result, success = false
        $.ajax({ dataType: 'json', success: function(json) {result = json; success = true } })
        MockXHR.last.ready(4, 200, ' ')
        ok(success)
        assertNull(result)
    })

    test("testDataOptionIsConvertedToSerializedForm", function(t) {
        $.ajax({ data: {hello: 'world', array: [1,2,3], object: { prop1: 'val', prop2: 2 } } })
        MockXHR.last.data = decodeURIComponent(MockXHR.last.data)
        assertEqual('hello=world&array[]=1&array[]=2&array[]=3&object[prop1]=val&object[prop2]=2', MockXHR.last.data)
    })
    /*
     * marked by chenluyang
     * 新版添加
    test("testDataOptionIsConvertedToSerializedTraditionalForm", function(t) {
        $.ajax({ data: {hello: 'world', array: [1,2,3], object: { prop1: 'val', prop2: 2 } }, traditional: true })
        MockXHR.last.data = decodeURIComponent(MockXHR.last.data)
        assertEqual('hello=world&array=1&array=2&array=3&object=[object+Object]', MockXHR.last.data)
    })

    test("testProcessDataDisabled", function(t) {
        var data = { country: 'Ecuador' }
        $.ajax({
            data: data,
            processData: false,
            type: "POST"
        })
        assertIdentical(data, MockXHR.last.data)
    })
     */
    test("testDataIsAppendedToGETURL", function(t) {
        $.ajax({ url:'test.html', data:'foo=bar' })
        assertEqual('test.html?foo=bar', MockXHR.last.url)

        $.ajax({ url:'test.html', data:'?foo=bar' })
        assertEqual('test.html?foo=bar', MockXHR.last.url)

        $.ajax({ url:'test.html?', data:'foo=bar' })
        assertEqual('test.html?foo=bar', MockXHR.last.url)

        $.ajax({ url:'test.html?baz', data:'foo=bar' })
        assertEqual('test.html?baz&foo=bar', MockXHR.last.url)

        $.ajax({ url:'test.html?bar=baz', data:'foo=bar' })
        assertEqual('test.html?bar=baz&foo=bar', MockXHR.last.url)

        $.ajax({ url:'test.html', data:{foo:'bar'} })
        assertEqual('test.html?foo=bar', MockXHR.last.url)
    })

    test("testScriptResponseIsEvald", function(t) {
        var result
        $.ajax({ success: function(text){ result = text } })
        MockXHR.last.ready(4, 200, 'this.testValue = 42', {'content-type': 'application/javascript'})
        assertEqual('this.testValue = 42', result)
        assertIdentical(42, window.testValue)
        delete window.testValue
    })

    test("testErrorCallback", function(t) {
        var successFired = false, xhr, status
        $.ajax({
            success: function() { successFired = true },
            error: function(x, s) { xhr = x, status = s }
        })

        MockXHR.last.ready(4, 500, '500 Internal Server Error')
        ok(!successFired)
        assertEqual(MockXHR.last, xhr)
        assertEqual('error', status)
    })

    test("testErrorCallbackWithInvalidJSON", function(t) {
        var successFired = false, xhr, status, exception
        $.ajax({
            dataType: 'json',
            succes: function() { successFired = true },
            error: function(x, s, e) { xhr = x, status = s, exception = e }
        })

        MockXHR.last.ready(4, 200, '{invalid')
        ok(!successFired)
        assertEqual(MockXHR.last, xhr)
        assertEqual('parsererror', status)
        ok(exception.toString().match(/SyntaxError/))
    })

    test("test201ResponseIsSuccess", function(t) {
        var successFired, errorFired
        $.ajax({
            success: function() { successFired = true },
            error: function() { errorFired = true }
        })

        MockXHR.last.ready(4, 201, 'Created')
        ok(successFired)
        refute(errorFired)
    })

    test("test304ResponseIsSuccess", function(t) {
        var successFired, errorFired
        $.ajax({
            success: function() { successFired = true },
            error: function() { errorFired = true }
        })

        MockXHR.last.ready(4, 304, 'Not Modified')
        ok(successFired)
        refute(errorFired)
    })
    test("testXHRParameterInSuccessCallback", function(t) {
        var body, status, xhr
        $.ajax({
            success: function(b, s, x) { body = b, status = s, xhr = x }
        })

        MockXHR.last.ready(4, 200, 'Hello')
        assertEqual('Hello', body)
        assertEqual('success', status)
        assertEqual(MockXHR.last, xhr)

        body = status = xhr = null
        $.ajax({
            dataType: 'json',
            success: function(b, s, x) { body = b, status = s, xhr = x }
        })

        MockXHR.last.ready(4, 200, '{"message":"Hello"}')
        assertEqual('Hello', body.message)
        assertEqual('success', status)
        assertEqual(MockXHR.last, xhr)
    })

    test("testBeforeSendAbortCallback", function(t) {
        var xhr, beforeFired = false, settings = {}
        $.ajax({
            data: "1=2",
            beforeSend: function(x, s) {
                beforeFired = true, settings = s, xhr = x
            }
        })

        ok(beforeFired)
        assertEqual(MockXHR.last, xhr)
        assertEqual("1=2", settings.data)
    })

    test("testBeforeSendAbort", function(t) {
        var xhr
        $.ajax({ beforeSend: function(x) { xhr = x; return false } })
        ok(xhr.aborted)
    })

    test("testGlobalBeforeSendAbort", function(t) {
        var xhr
        $(document).on('ajaxBeforeSend', function(e, x) { xhr = x; return false })
        assertFalse($.ajax())
        ok(xhr.aborted)
    })
    /**
     * marked by chenluyang
     * 见case/testGlobalAjaxSendCantAbort.html, 单独测试中没有问题
     */
    test("testGlobalAjaxSendCantAbort", function(t) {
        var xhr
        $(document).on('ajaxSend', function(e, x) { xhr = x; return false })
        debugger
        ok($.ajax())
        ok(!xhr.aborted)
    })

    test("testCompleteCallback", function(t) {
        var status, xhr
        $.ajax({ complete: function(x, s) { status = s, xhr = x } })

        MockXHR.last.ready(4, 200, 'OK')
        assertEqual(MockXHR.last, xhr)
        assertEqual('success', status)
    })

    test("testCallbackOrder", function(t) {
        var order = []
        $.ajax({
            beforeSend: function() { order.push('beforeSend') },
            success: function() { order.push('success') },
            complete: function() { order.push('complete') }
        })

        MockXHR.last.ready(4, 200, 'OK')
        assertEqual('beforeSend,success,complete', order.join(','))
    })
    /**
     * marked by chenluyang
     * 见case/testGlobalCallbacks.html, 单独测试中没有问题
     */
    test("testGlobalCallbacks", function(t) {
        $.active = 0
        var fired = []
        $(document).on('ajaxStart ajaxBeforeSend ajaxSend ajaxSuccess ajaxError ajaxComplete ajaxStop', function(e) {
            fired.push(e.type)
        })

        $.ajax({
            beforeSend: function() { fired.push('beforeSend') },
            success:    function() { fired.push('success') },
            error:      function() { fired.push('error') },
            complete:   function() { fired.push('complete') }
        })

        assertEqual('ajaxStart beforeSend ajaxBeforeSend ajaxSend', fired.join(' '))

        fired = []
        MockXHR.last.ready(4, 200, 'OK')
        assertEqual('success ajaxSuccess complete ajaxComplete ajaxStop', fired.join(' '))
    })

    test("testGlobalCallbacksOff", function(t) {
        var fired = []
        $(document).on('ajaxStart ajaxBeforeSend ajaxSend ajaxSuccess ajaxError ajaxComplete ajaxStop', function(e) {
            fired.push(e.type)
        })

        $.ajax({
            global:     false,
            beforeSend: function() { fired.push('beforeSend') },
            success:    function() { fired.push('success') },
            error:      function() { fired.push('error') },
            complete:   function() { fired.push('complete') }
        })
        assertEqual('beforeSend', fired.join(' '))

        fired = []
        MockXHR.last.ready(4, 200, 'OK')
        assertEqual('success complete', fired.join(' '))
    })

    test("testTimeout", function(t) {
        /**
         * marked by chenluyang
         * 见case/testTimeout.html, 单独测试中没有问题
         */
        var successFired = false, xhr, status
        stop()
        $.ajax({
            url: '/cly/zepto/test/fixtures/ajax_load_big.html?v=' + new Date(),
            timeout: 5,
            success: function() { successFired = true; },
            error: function(x, s) { xhr = x, status = s;}
        })

        setTimeout(function(){
            assertFalse(successFired)
            assertUndefined(status)
        }, 0)

        setTimeout(function(){
            assertFalse(successFired)
            //assertTrue(xhr.aborted)
            assertEqual('timeout', status)
            start()
        }, 40)
    })

    test("testAsyncDefaultsToTrue", function(t) {
        $.ajax({ url: '/foo' })
        assertTrue(MockXHR.last.async)
    })

    test("testAsyncFalse", function(t) {
        $.ajax({ url: '/foo', async: false })
        assertFalse(MockXHR.last.async)
    })


    test("testParamMethod", function(t) {
        var result = $.param({ libs: ['jQuery', 'script.aculo.us', 'Prototype', 'Dojo'] })
        result = decodeURIComponent(result)
        assertEqual(result, "libs[]=jQuery&libs[]=script.aculo.us&libs[]=Prototype&libs[]=Dojo")

        result = $.param({ jquery: 'Javascript', rails: 'Ruby', django: 'Python' })
        result = decodeURIComponent(result)
        assertEqual(result, "jquery=Javascript&rails=Ruby&django=Python")

        result = $.param({
            title: "Some Countries",
            list: ['Ecuador', 'Austria', 'England'],
            capitals: { ecuador: 'Quito', austria: 'Vienna', GB: { england: 'London', scotland: 'Edinburgh'} }
        })
        result = decodeURIComponent(result)
        assertEqual(result, "title=Some+Countries&list[]=Ecuador&list[]=Austria&list[]=England&capitals[ecuador]=Quito&capitals[austria]=Vienna&capitals[GB][england]=London&capitals[GB][scotland]=Edinburgh")
    })

    test("testParamEscaping", function(t) {
        var result = $.param({ 'equation[1]': 'bananas+peaches=smoothie' })
        assertEqual("equation%5B1%5D=bananas%2Bpeaches%3Dsmoothie", result)
    })
    /*
     * marked by chenluyang
     * 新版添加
    test("testParamSpaces", function(t) {
        var result = $.param({ "foo bar": "baz kuux" })
        assertEqual("foo+bar=baz+kuux", result)
    })
    */
    test("testParamComplex", function(t) {
        var data = {
            a: ['b', 'c', { d:'e', f:['g','h'] }]
        }
        var result = $.param(data)
        result = decodeURIComponent(result)
        assertEqual("a[]=b&a[]=c&a[][d]=e&a[][f][]=g&a[][f][]=h", result)
    })

    test("testParamShallow", function(t) {
        var data = {
            libs: ['jQuery', 'Prototype', 'Dojo'],
            nested: { will: 'be ignored' }
        }
        var result = $.param(data, true)
        result = decodeURIComponent(result)
        assertEqual("libs=jQuery&libs=Prototype&libs=Dojo&nested=[object+Object]", result)
    })

    test("testParamArray", function(t) {
        var data = [
            {name:'country', value:'Ecuador'},
            {name:'capital', value:'Quito'}
        ]
        var result = $.param(data)
        assertEqual(result, "country=Ecuador&capital=Quito")
    })

})();