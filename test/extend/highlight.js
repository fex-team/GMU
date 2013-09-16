module('highlight');


test('basic', function() {
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

test('scroll', function() {
	stop();
	var $elem = $('<div>111111111111111111</div>').appendTo(document.body).highlight('testClass'),
		elem = $elem.get(0);
	//touchstart & touchend
	ta.touchstart(elem);

	equal( $elem.attr('hl-cls'), 'testClass' );

	setTimeout( function() {
		ta.touchmove( elem );
	}, 40);
	setTimeout(function() {
		ok(!$elem.hasClass('testClass'));

		ok( !$elem.attr('hl-cls'));

		$elem.remove();
		start();
	}, 120);
});

test( '事件代理模式', function(){
	stop();

	var container = $('<div></div>').appendTo(document.body);

	container.highlight('testClass', 'a.highlight');

	container.append('<a class="highlight">jfkdal</a>');

	var $elem = container.find('a.highlight'),
		elem = $elem[0];

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
			container.remove();
			start();
		}, 120);
	}, 120);
} );

test( '事件代理模式 2', function(){
	stop();

	var container = $('<div></div>').appendTo(document.body);

	container.highlight('testClass', 'a.highlight');

	container.append('<a>jfkdal</a>');

	var $elem = container.find('a'),
		elem = $elem[0];

	ta.touchstart(elem);
	setTimeout(function() {
		ok(!$elem.hasClass('testClass'));
		ta.touchend(elem);
		ok(!$elem.hasClass('testClass'));

		$elem.remove();
		container.remove();
		start();
	}, 120);
} );