;(function(){
    click = function (el){
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, true, document.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
        $(el).get(0).dispatchEvent(event)
    }
})();
;(function(){
    test("prepare", function(){
        var html = '<p id="results">Running… see browser console for results</p><div id="fixtures"></div>';
        $("body").append(html);
        ok($("#fixtures"));
    });

    test("testProxyFnContext", function(){
        var a = {name: 'A', fn: function(n, o){ return this.name + n + o }},
            b = {name: 'B'}

        assertEqual('A13', a.fn(1, 3))
        assertEqual('B52', $.proxy(a.fn, b)(5, 2))
    });

    test("testProxyInvalidFn", function(){
        try {
            $.proxy(null)
            t.fail("shouldn't be here")
        } catch(e) {
            assertEqual('TypeError', e.name)
            assertEqual("expected function", e.message)
        }
    });

    test("testProxyContextName", function(){
        var b = {name: 'B', fn: function(n, o){ return this.name + n + o }},
            oldFn = b.fn

        assertEqual('B52', $.proxy(b, 'fn')(5, 2))
        assertIdentical(oldFn, b.fn)
    });

    test("testProxyUndefinedProperty", function(){
        try {
            $.proxy({}, 'nonexistent')
            t.fail("shouldn't be here")
        } catch(e) {
            assertEqual('TypeError', e.name)
            assertEqual("expected function", e.message)
        }
    });

    test("testProxyInvalidProperty", function(){
        try {
            $.proxy({num:3}, 'num')
            t.fail("shouldn't be here")
        } catch(e) {
            assertEqual('TypeError', e.name)
            assertEqual("expected function", e.message)
        }
    });
    //
    var global = {};
    global.el = $('<div />').appendTo('#fixtures')
    //global.el.off().remove()
    //$([document, document.body]).off()

    test("testProxiedHandlerCanBeUnbindedWithOriginal", function(t){
        var obj = {times:0, fn: function(){ this.times++ }}

        global.el.on('click', $.proxy(obj, 'fn'))
        click(global.el)
        assertEqual(1, obj.times)

        global.el.off('click', obj.fn)
        click(global.el)
        assertEqual(1, obj.times)
    });

    test("testOnWithObject", function(t){
        var log = []
        global.el.on({ click: function(){ log.push('a') } }).
            on({ click: function(){ log.push('b') } }, null)

        click(global.el)
        assertEqual('a b', log.sort().join(' '))
    });

    test("testOnWithNullSelector", function(t){
        /*
        var log = []
        global.el.on('click', null, function(){ log.push('a') }).
            on('click', undefined, function(){ log.push('b') }).
            on('click', false, function(){ log.push('c') }).
            on('click', '', function(){ log.push('d') })

        click(global.el)
        assertEqual('a b c d', log.sort().join(' '))
        */
        var log = []
        global.el.on('click', null, function(){ log.push('a') }).
            on('click', undefined, function(){ log.push('b') })

        click(global.el)
        assertEqual('a b', log.sort().join(' '))
    });

    test("testOffWithObject", function(t){
        var log = [],
            fn = function(){ log.push('a') },
            fn2 = function(){ log.push('b') },
            fn3 = function(){ log.push('c') }

        global.el.on('click', fn).on('click', fn2).on('click', fn3)
        click(global.el)
        assertEqual('a b c', log.sort().join(' '))

        global.el.off({ click: fn }).off({ click: fn2 }, null)
        click(global.el)
        assertEqual('a b c c', log.sort().join(' '))
    });
    /*
    test("testDelegateEventProperties", function(t){
        var type, target, currentTarget
        $(document).on('click', 'div', function(e){
            //没有触发
            alert()
            type = e.type
            target = e.target
            currentTarget = e.currentTarget
        })
        click($('<span>').appendTo(global.el))
        assertEqual('click', type)//TODO ERROR both
        assertIdentical(global.el.find('span').get(0), target) //TODO ERROR both
        assertIdentical(global.el.get(0), currentTarget) //TODO ERROR both
    });
    */
})();