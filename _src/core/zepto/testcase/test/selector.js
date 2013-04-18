test("prepare", function(){
        var html = '<p id="results">Running… see browser console for results</p><div id="fixtures"><ul id=list><li>one</li><li>two</li></ul><div class=visibility id=vis>look at me!</div><div class=visibility id=invis style="display:none">cant see me</div><ol id=child class=test><li><span>child1</span></li><li><span>child2</span><ul><li><span>child3</span></li><li><span>child4</span></li></ul></li></ol></div>'
        $("body").append(html);
        ok($("#fixtures"));
    });

    // test to see if we augment Array.prototype.reduceif not supported natively
    test("testFirst", function(t) {
        var li = $('#list li:first')
        assertEqual(1, li.size())
        assertEqual('one', li.text())
        assertEqual('two', $('#list li:eq(1)').text())
    })
    test("testLast", function(t) {
        var li = $('#list li:last')
        assertEqual(1, li.size())
        assertEqual('two', li.text())
    })
    test("testParent", function(t) {
        var list = $('#list li:parent')
        assertEqual(1, list.size())
        assertEqual('list', list.attr('id'))
    })
    test("testContains", function(t) {
        assertEqual('two', $('#list li:contains("two")').text())
    })
    test("testVisibility", function(t) {
        assertEqual('vis', $('.visibility:visible').attr('id'))
        assertEqual('invis', $('.visibility:hidden').attr('id'))
    })
    test("testIs", function(t) {
        ok($('#list').is('ul'))
        ok($('#vis').is(':visible'))
        refuteEqual($('#invis').is(':visible'))
    })
    /*
    test("testChild", function(t) {
        var items = $('#child').find('> li'),
            results = items.map(function(){
                return $(this).find('> span').text()
            }).get()

        assertEqual('child1 child2', results.join(' '))
        assertEqual('test', $('#child').prop('className'))
    })
    test("testChildHas", function(t) {
        var items = $('#child').find('> li:has(ul)'),
            results = items.map(function(){
                return $(this).find('> span').text()
            }).get()

        assertEqual('child2', results.join(' '))
    })

    test("testEmptyHref", function(t) {
        var result, el = $('<div><a href="#">one</a><a href="#">two</a></div>')
        result = el.find('a[href=#]')
        assertEqual('one two', result.map(function(){ return $(this).text() }).get().join(' '))
    })
*/