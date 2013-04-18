test("prepare", function(){
    var html = '<p id="results">Running… see browser console for results</p><div id="fixtures"><div id="data_attr" data-one="uno" data-two="due" data-foo-bar="baz"></div><div id="data_full" data-mode="awesome"></div><div id="data_obj" data-mode="awesome"></div><ol id="data_list"><li data-category="arts"></li><li data-category="science"></li></ol><ol id="data_list2"><li></li><li></li></ol></div>'
    $("body").append(html);
    ok($("#fixtures"));
})

test("testEmptyCollection", function(t){
    var el = $('#does_not_exist')
    assertUndefined(el.data('one'))
})

test("testAttributeDoesNotExist", function(t){
    var el = $('#data_attr')
    assertUndefined(el.data('missing'))
})

test("testReadingAttribute", function(t){
    var el = $('#data_attr')
    assertEqual('uno', el.data('one'))
})

test("testCamelized", function(t){
    var el = $('#data_attr')
    assertEqual('baz', el.data('foo-bar'))
    assertEqual('baz', el.data('fooBar'))

    el.data('fooBar', 'bam')
    assertEqual('bam', el.data('foo-bar'))
    assertEqual('bam', el.data('fooBar'))

    el.data('a-b', 'c')
    assertEqual('c', el.data().aB)
    assertUndefined(el.data()['a-b'])
})

test("testNotChangingAttribute", function(t){
    var el = $('#data_attr')
    assertEqual('due', el.data('two'))
    el.data('two', 'changed')
    assertEqual('due', el.attr('data-two'))
})

test("testExtendedData", function(t){
    var els = $('#data_attr'),
        els2 = $('#data_attr'),
        obj  = { a: 'A', b: 'B' }

    els.data('obj', obj)
    assertIdentical(obj, els.data('obj'))
    assertIdentical(obj, els2.data('obj'))

    els2.data('els', els)
    assertIdentical(els, els.data('els'))
})

test("testMultipleElements", function(t){
    var items = $('#data_list li')

    items.data('each', 'mark')

    var values = items.map(function(){ return $(this).data('each') })
    assertEqual('mark, mark', values.join(', '))
})

test("testFunctionArg", function(t){
    var els = $('#data_attr')

    var data = "hello"

    els.data("addio", function () {
        data = "goodbye"
    })

    assertEqual('hello', data)

    els.data("addio")()

    assertEqual('goodbye', data)
})

test("testAllData", function(t){
    var el = $('#data_full')

    el.data().samurai = 7
    el.data('one', 'ichi').data('two', 'ni')
    el.data('person', {name: 'Kurosawa'})

    var all = el.data()
    assertEqual(7, all.samurai)
    assertEqual('ichi', all.one)
    assertEqual('ni', all.two)
    assertEqual('Kurosawa', all.person.name)
})

test("testInitialDataFromAttributes", function(t){
    /*
    var el = $('<div data-foo=bar data-foo-bar=baz data-empty data-num=42 />'),
        store = el.data()

    assertEqual('bar', store.foo)
    assertEqual('baz', store.fooBar)
    assertUndefined(store['foo-bar'])
    assertIdentical('', store.empty)
    assertIdentical(42, store.num)
     */
    var el = $('<div data-foo=bar data-foo-bar=baz />'),
        store = el.data()

    assertEqual('bar', store.foo)
    assertEqual('baz', store.fooBar)
    assertUndefined(store['foo-bar'])
})

test("testGettingBlanks", function(t){
    var el = $('#data_attr'),
        store = el.data()

    store.nil = null
    store.undef = undefined
    store.blank = ''
    store.bool = false

    assertNull(el.data('nil'))
    assertUndefined(el.data('undef'))
    assertIdentical('', el.data('blank'))
    assertFalse(el.data('bool'))
})

test("testRemoveData", function(t){
    var el = $('<div data-foo=bar />')

    el.data('foo', 'bam').data('bar', 'baz')
    el.removeData('foo').removeData('bar')
    assertEqual('bar', el.data('foo'))
    assertUndefined(el.data('bar'))

    el.data('uno', 'one').data('due', 'two')
    el.removeData('uno due')
    assertUndefined(el.data('uno'))
    assertUndefined(el.data('due'))

    el.data('one', 1).data('twoThree', 23)
    el.removeData(['one', 'two-three'])
    assertUndefined(el.data('one'))
    assertUndefined(el.data('twoThree'))
})

test("testRemoveDataNoop", function(t){
    var empty = $(),
        vanilla = $('<div />')

    assertIdentical(empty, empty.removeData('foo'))
    assertIdentical(vanilla, vanilla.removeData('foo'))
})

test("testSettingDataWithObj", function(t){
    var el = $('#data_obj')

    el.data({
        'foo': 'bar',
        'answer': 42,
        'color': 'blue'
    })

    var all = el.data()

    assertEqual(all.answer, 42)
    assertEqual(all.color, 'blue')
    assertEqual(all.foo, 'bar')

    el.data('foo', 'baz')

    assertEqual(all.foo, 'baz')
    assertEqual(all.answer, 42)
})

test("testSettingDataWithObjOnManyElements", function(t){
    var items = $('#data_list2 li')

    items.data({
        'foo': 'bar',
        'answer': 42,
        'color': 'purple'
    })

    var values = items.map(function(){ return $(this).data('foo') })
    assertEqual('bar, bar', values.join(', '))

    var values2 = items.map(function(){ return $(this).data('answer') })
    assertEqual('42, 42', values2.join(', '))
})