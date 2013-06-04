test('fix', function() {
	stop();
	expect(3);
	var $el = $('<div style="width:10px;height:10px;background-color:red"></div>').appendTo(document.body).fix({
		left: 10,
		top: 10
	});
	$('<div style="height:2000px;"></div>').appendTo(document.body);
	setTimeout(function(){
		window.scrollTo(0, 1000);
		ta.scrollStop(document);
		approximateEqual(window.pageYOffset, 1000, "The pageYOffset is " + window.pageYOffset);
		equal($el.offset().top, 10 + window.pageYOffset, 'top is right');
		equal($el.offset().left, 10, 'left is right');
		window.scrollTo(0, 0);
		$el.remove();
		start();
	}, 10);
});