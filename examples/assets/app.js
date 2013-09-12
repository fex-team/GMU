$(function(){
	var html = '<ul id="J_widgetList">';

	for(var i in widgets){
		html += '<li><a href="' + i +'"><img src="./assets/img/' + widgets[i]['icon'] + '" alt="' + widgets[i]['name'] + '">' + 
				'<span class="title">' + widgets[i]['name'] + '</span><span class="desc">' + widgets[i]['description'] + '</span></a></li>';
	}
	html += '</ul>';

	$('#scroller1 ul').remove();
	$('#scroller1').append(html);
	// $('.pages').height($('#J_widgetList').height());

	setTimeout(function(){
		new iScroll('S_widgets');
		$(window).trigger('resize');
	}, 200);
});

$(function(){
	demos.imglazyload = [
							{
								file: '../extend/imglazyload/imglazyload.html',
								title: '图片延迟加载'
							},{
								file: '../extend/imglazyload/imglazyload_addimg.html',
								title: '点击加载图片'
							}
							,{
								file: '../extend/imglazyload/imglazyload_error.html',
								title: '图片加载错误处理'
							},{
								file: '../extend/imglazyload/imglazyload_iscroll.html',
								title: 'iScroll中使用图片延迟加载'
							}
						];
});

$(function(){
	var widgetSection = $('#S_widgets').show(),
		demoSection = $('#S_demos');

	// $('.pages').css('overflow', 'hidden');

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
			html = '<ul id="J_demoList">';

		demolist.forEach(function(item, index){
			html += '<li><a href="./widget/' + item.file + '">' + item.title + '</a></li>';
		});

		html += '</ul>';

		$('#scroller2 ul').remove();
		$('#scroller2').append(html);
		$('#scroller2 h3 span').html(widget + ' Demos');

		new iScroll('S_demos');
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
			window.scrollTo(0, 0);
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