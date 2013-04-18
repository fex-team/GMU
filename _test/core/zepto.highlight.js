test('highlight', function() {
	stop();
	var $elem = $('<div>111111111111111111</div>').appendTo(document.body).highlight('testClass'),
		elem = $elem.get(0);
	//touchstart & touchend
	ta.touchstart(elem);
	setTimeout(function() {
		ok($elem.hasClass('testClass'));
		ta.touchend(elem);
		ok(!$elem.hasClass('testClass'));
		
		//touchstart & touchmove
		ta.touchstart(elem);
		setTimeout(function() {
			ok($elem.hasClass('testClass'));
			ta.touchmove(elem);
			ok(!$elem.hasClass('testClass'));
			$elem.remove();
			start();
		}, 120);
	}, 120);
});