;(function(){
    colorToHex = function (color) {
        if (color.substr(0, 1) === '#') {
            return color
        }

        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec( color.toLowerCase() ),
            red    = parseInt(digits[2]),
            green  = parseInt(digits[3]),
            blue   = parseInt(digits[4]),
            rgb = blue | (green << 8) | (red << 16)

        return digits[1] + '#' + rgb.toString(16)
    }

    defer = function (fn, delay) {
        setTimeout(fn, delay || 0)
    }

    camelize = function (str) {
        return str.replace(/-+(.)?/g, function(_, chr){ return chr ? chr.toUpperCase() : '' })
    }
    /*
    $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            stylePrefix = '-' + vendor.toLowerCase() + '-'
            return false
        }
    })
    */
    stylePrefix = $.fx.cssPrefix

    assertStyle = function(expected, object, property, message) {
        if (/^(transform|transition|animation)/.test(property)) property = stylePrefix + property
        if (!('nodeName' in object)) object = object.get(0)
        var actual = object.style[camelize(property).replace(/^Ms/, 'ms')],
            expression = expected instanceof RegExp ? expected.test(actual) : expected === actual
        expression ? assertEqual(expected, actual) : ok(false);
    }
})();
asyncTest("prepare", function(){
    stop()
    ua.loadcss([upath + "test.css", upath + "css/zepto.css"], function(){
        var html = '<h1>Zepto effects tests</h1><p id="results">Running… see browser console for results</p><div id="animtest_1" style="width:40px;height:40px;background:red"></div><div id="animtest_2" style="width:40px;height:40px;background:red"></div><div id="durationtest_1" style="width:40px;height:40px;background:red"></div><div id="durationtest_2" style="width:40px;height:40px;background:red"></div><div id="callbacktest" style="width:40px;height:40px;background:red"><div style="width:40px;height:40px;background:blue"></div></div><div id="keyframetest" style="width:40px;height:40px;background:red;opacity: 0;"></div><div id="anim_zero_duration_callback_test"></div>'
        $("body").append(html)
        ok($("#fixtures"))
        start()
    })
})

asyncTest("testAnimate", function(t){
    /*
    var el = $('#animtest_1'), el2 = $('#animtest_2')

    el.animate({
        translate3d: '80px, 20px, 100px',
        rotateZ: '90deg',
        scale: '0.8',
        opacity: 0.5,
        backgroundColor: '#BADA55'
    }, 200, 'ease-out')

    el2.animate({
        translate3d: '80px, 20px, 100px',
        rotateZ: '-90deg',
        backgroundColor: '#BADA55'
    }, {
        duration: 180,
        easing: 'ease-out'
    })

    assertStyle('ease-out', el, 'transition-timing-function') //TODO ERROR ie
    assertStyle('0.2s', el, 'transition-duration') //TODO ERROR ie
    assertStyle(/\bbackground-color\b/, el, 'transition-property') //TODO ERROR both
    assertStyle(/\btransform\b/, el, 'transition-property') //TODO ERROR both
    assertStyle('0.18s', el2, 'transition-duration') //TODO ERROR ie

    stop()
    defer(250, function(){
        assertStyle('translate3d(80px, 20px, 100px) rotateZ(90deg) scale(0.8)', el, 'transform')
        assertStyle('0.5', el, 'opacity')
        assertEqual('#BADA55', colorToHex(el.get(0).style.backgroundColor).toUpperCase())
        start()
    })
    */
    var el = $('#animtest_1'), el2 = $('#animtest_2')
    el.animate({
        translate3d: '100px, 100px, 100px',
        rotateZ: '90deg',
        scale: '0.8',
        opacity: 0.5,
        'background-color': '#BADA55'
    }, 200, 'ease-out')

    el2.animate({
        translate3d: '100px, 100px, 100px',
        rotateZ: '-90deg',
        'background-color': '#BADA55'
    }, {
        duration: 180,
        easing: 'ease-out'
    })
    
    stop()

    defer(function(){
    	assertStyle('ease-out', el, 'transition-timing-function')
        assertStyle('0.2s', el, 'transition-duration')
        assertStyle('0.18s', el2, 'transition-duration')

        defer(function(){
            assertStyle('translate3d(100px, 100px, 100px) rotateZ(90deg) scale(0.8)', el, 'transform')
            assertStyle('0.5', el, 'opacity')
            assertEqual('#BADA55', colorToHex(el.get(0).style.backgroundColor).toUpperCase())
            start()
        }, 250)

    }, 1)
})

test("testDuration", function(t){
    var el1 = $('#durationtest_1').anim({
        translate3d: '80px, 20px, 100px',
        rotateZ: '90deg',
        opacity: 0.5
    })

    var el2 = $('#durationtest_2').anim({
        translate3d: '80px, 20px, 100px',
        rotateZ: '90deg',
        opacity: 0.5
    }, 0)

    stop()
    defer(function(){
        assertStyle('0.4s', el1, 'transition-duration')
        assertStyle('0s', el2, 'transition-duration')
        start()
    }, 1)
    //assertStyle('0.4s', el1, 'transition-duration', 'expected default duration') //TODO ERROR ie
    //assertStyle('', el2, 'transition-duration', 'expected no animation') //TODO ERROR ie
})


/*
test("testDurationString", function(t){
    var el = $('#durationtest_3').animate({
        translate3d: '80px, 20px, 100px',
        rotateZ: '90deg',
        opacity: 0.5
    }, 'fast')

    assertStyle('0.2s', el, 'transition-duration', 'expected fast duration') //TODO ERROR ie
})
 */
//TODO need to fix
test("testCallback", function(t){
    var duration = 250, startTime = new Date().getTime()
    stop()
    $('#callbacktest').anim({
            translate3d: '80px, 20px, 100px',
            rotateZ: '90deg',
            opacity: 0.5
        }, duration / 1000, 'linear',
        function(){
            var context = this
            ok($(context).is('#callbacktest'), "context for callback is wrong")
            ok((new Date().getTime() - startTime) >= duration, 'Fired too early') //TODO ERROR ie
            assertStyle('', context, 'transition')
            assertStyle('', context, 'transition-property')
            assertStyle('', context, 'transition-timing-function')
            assertStyle('', context, 'transition-duration')
            assertStyle('', context, 'animation-name')
            assertStyle('', context, 'animation-duration')
            start()
        })
})

test("testBubbling", function(t){
    $('#callbacktest div').anim({ opacity: 0.0 }, 0.1, 'linear')

    var el = $('#anim_zero_duration_callback_test'),
        callbackCalled = false

    el.anim({ opacity: 0.5 }, 0, 'linear', function () {
        ok($(this).is('#anim_zero_duration_callback_test'), "context for callback is wrong")
        assertStyle('0.5', this, 'opacity')
        callbackCalled = true
    })

    stop()
    defer(function(){
        ok(callbackCalled)
        start()
    }, 30)
})

test("testKeyFrameAnimation", function(t){

    //var el = $('#keyframetest').animate('animName', 200)

    //assertStyle('animName', el, 'animation-name') //TODO ERROR ie
    //assertStyle('0.2s',     el, 'animation-duration') //TODO ERROR ie
    //assertStyle('linear',   el, 'animation-timing-function') //TODO ERROR ie

    stop()
    var el = $('#keyframetest').anim('animName', 2)
    defer(function(){
        assertStyle('animName', el, 'animation-name')
        start()
    })
})

test("testEmptyCollection", function(t){
    ok($(null).animate({opacity:0}))
})
