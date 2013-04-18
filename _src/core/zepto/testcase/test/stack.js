
test("prepare", function(){
    var html = '<div id="fixtures"><div id="end_test"><div class="end_one"><b><span></span></b></div><div class="end_two"><b><span>1</span><span>2</span></b></div></div><div id="andself_test"><div class="one"></div><div class="two"></div><div class="three"></div><div class="four"></div></div></div>'
    $("body").append(html);
    ok($("#fixtures"));
});

// test to see if we augment Array.prototype.reduceif not supported natively
test("testEnd", function (t) {
    ok($().end().length == 0)

    var $endTest = $('#end_test')
    var $endTest2 = $('#end_test').find('div').find('span').end().end()
    assertEqual($endTest.length, $endTest2.length)
    assertEqual($endTest.get(0), $endTest2.get(0))
})

test("testAndSelf", function (t) {
    var testDiv  = $('#andself_test'),
        secondEl = $('.two', testDiv),
        thirdEl  = $('.three', testDiv),
        nextAndSelf = secondEl.next().andSelf()

    ok(secondEl.get(0), nextAndSelf.get(0))
    ok(thirdEl.get(0),  nextAndSelf.get(1))
})