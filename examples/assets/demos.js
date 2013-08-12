$(function(){
	var widgetSection = $('#S_widgets').show(),
		demoSection = $('#S_demos');

	$('.pages').css('overflow', 'hidden');

	demoSection.css('-webkit-transform', 'translateX(100%)');
	$('.__page__').css('-webkit-transition', 'all .3s ease-in-out');

	$('#S_widgets a').click(function(e){
		var widgetName = $(this).attr('href');

		location.hash = widgetName;
		e.preventDefault();
	});

	$('.btn_back').click(function(){
		widgetSection.css('-webkit-transform', 'translateX(0)');
		demoSection.css('-webkit-transform', 'translateX(100%)');
		location.hash = '';
	});

	var updateDemoSection = function(widget){
		var demolist = demos[widget],
			html = '<ul>';

		demolist.forEach(function(item, index){
			html += '<li><a href="./widget/' + item.file + '">' + item.title + '</a></li>';
		});

		html += '</ul>';

		$('#S_demos ul').remove();
		$('#S_demos').append(html);
		$('#S_demos h3 span').html(widget + ' Demos');
	}

	var updatePage = function(){
		var widgetName = location.hash.replace('#', '');

		if(widgetName === '' || !demos[widgetName]){
			widgetSection.css('-webkit-transform', 'translateX(0)');
			demoSection.css('-webkit-transform', 'translateX(100%)');
		}else{
			updateDemoSection(widgetName);
			widgetSection.css('-webkit-transform', 'translateX(-100%)');
			demoSection.show();
			setTimeout(function(){
				demoSection.css('-webkit-transform', 'translateX(0)');
			}, 0);
		}
	}

	window.onhashchange = function(e){
		updatePage();
	}

	updatePage();
});