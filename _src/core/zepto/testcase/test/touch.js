;(function(){
    var transEvent = {
        touchstart: 'MSPointerDown',
        touchend: 'MSPointerUp',
        touchmove: 'MSPointerMove'
    }

    function compatEvent(evt) {
        return window.navigator.msPointerEnabled ? transEvent[evt] : evt;
        //return 'ontouchstart' in window ? evt : transEvent[evt]
    }

    fire = function (type, element, x, y) {
        var event = document.createEvent('Event'),
            touch = { pageX: x, pageY: y, target: element, clientX: x, clientY:y }

        event.initEvent(compatEvent('touch'+type), true, true)
        event.touches = [touch]
        element.dispatchEvent(event)
    }

    down = function (element, x, y) {
        fire('start', element, x, y)
    }
    move = function (element, x,y) {
        fire('move', element, x, y)
    }
    up = function (element) {
        fire('end', element)
    }
})();
;(function(){
    /**
     *  marked by chenluyang
     *  现有测试框架中，js文件都是加载在头部，但touch.js中需要给document.body绑定事件，在ie10下无法获取body
     *  所以请参考zepto本身的测试用例, html/touch.html
     */
    test("prepare", function(){
        stop()
        ua.loadcss([upath + "test.css", upath + "css/zepto.css"], function(){
            $('<div id="test"></div>').appendTo('body')
            ok($("#test"));
            start()
        })
    })

    test("testTap", function(t){
        stop()
        var count = 0, element = $('#test').get(0);

        $('#test').on('tap', function(){
            count++
        })

        down(element, 10, 10)
        up(element)

        setTimeout(function(){
            equal(1, count)
            start()

        }, 50)
    });

    test("testSingleTapDoesNotInterfereWithTappingTwice", function(t){
        /**
         * marked by chenluyang
         * 可见 case/testSingleTapDoesNotInterfereWithTappingTwice.html, 单独测试时没有问题
         */
        stop()
        $('#test').off()
        var count = 0, element = $('#test').get(0)

        $('#test').on('tap', function(){
            count++
        })

        down(element, 10, 10)
        up(element)

        setTimeout(function(){
            down(element, 10, 10)
            up(element)
            setTimeout(function(){
                equal(2, count)
                start()
            }, 500)
        }, 50)
    });

    // should be fired if there is one tap within 250ms
    test("testSingleTap", function(t){
        stop()
        $('#test').off()
        var singleCount = 0, doubleCount = 0, element = $('#test').get(0)

        $('#test').on('singleTap', function(){
            singleCount++
        }).on('doubleTap', function(){
            doubleCount++
        })

        down(element, 10, 10)
        up(element)
        setTimeout(function(){
            equal(1, singleCount)
            equal(0, doubleCount)
            start()
        }, 300)
    });

    // should be fired if there are two taps within 250ms
    /**
     * marked by chenluyang
     * ie10下面，setTimeout不稳定(也可能是虚拟机的关系)
     */
    test("testDoubleTap", function(t){
        stop()
        $('#test').off()
        var singleCount = 0, doubleCount = 0, element = $('#test').get(0)

        $('#test').on('singleTap', function(){
            singleCount++
        }).on('doubleTap', function(){
                doubleCount++
        })

        down(element, 10, 10)
        up(element)

        setTimeout(function(){
            down(element, 12, 12)
            up(element)
            setTimeout(function(){
                equal(0, singleCount)
                equal(1, doubleCount)
                start()
            }, 100)
        }, 100)
    });

    // should be fired if the finger is down in the same location for >750ms
    test("testLongTap", function(t){
        stop()
        $('#test').off()
        var count = 0, element = $('#test').get(0)

        $('#test').on('longTap', function(){
            count++
        })

        down(element, 10, 10)


        setTimeout(function(){
            up(element)
            equal(1, count)
            start()
        }, 900)
    });

    test("testLongTapDoesNotFireIfFingerIsMoved", function(t){
        stop()
        $('#test').off()
        var count = 0, element = $('#test').get(0)

        $('#test').on('longTap', function(){
            count++
        })

        down(element, 10, 10)

        setTimeout(function(){
            move(element, 50, 10)
            setTimeout(function(){
                up(element)
                equal(0, count)
                start()
            }, 450)
        }, 450)
    });

    test("testSwipe", function(t){
        stop()
        $('#test').off()
        var swipeCount = 0, element = $('#test').get(0)

        $('#test').on('swipe', function(){
            swipeCount++
        })

        down(element, 10, 10)

        setTimeout(function(){
            move(element, 70, 10)
            up(element)
            setTimeout(function(){
                equal(1, swipeCount)
                start()
            }, 50)
        }, 50)
    });

})();