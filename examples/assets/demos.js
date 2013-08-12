$(function(){
	var sections = $('section'),
		currentSection = $(sections[0]).addClass('__current__page').show(),
		nextSection = $(sections[1]).addClass('__next__page');

	nextSection.css('-webkit-transform', 'translateX(100%)');
	$('.__page__').css('-webkit-transition', 'all .3s ease-in-out');

	$('#S_widgets a').click(function(e){
		var widgetName = $(this).attr('href');

		console.log(widgetName);

		currentSection.css('-webkit-transform', 'translateX(-100%)');
		nextSection.show();
		setTimeout(function(){
			nextSection.css('-webkit-transform', 'translateX(0)');
		}, 0);
		e.preventDefault();
	});

	$('.btn_back').click(function(){
		currentSection.css('-webkit-transform', 'translateX(-100%)');
	});
});