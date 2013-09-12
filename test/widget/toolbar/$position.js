module('Toolbar/$position', {
	setup: function() {
		$container = $('<div id="J_container"></div>').appendTo(document.body);
	},
	teardown: function() {
		$container.remove();
	}
});

var tablet = window.screen.width >= 768 && window.screen.width <= 1024;

test('position方法', function(){
    expect(1);
    stop();
    ua.loadcss(["widget/toolbar/toolbar.css","widget/toolbar/toolbar.default.css"], function() {
        setTimeout(function(){
	        var tmp = $('<div style="height:5000px;"></div>').appendTo(document.body);
	        var toolbar = gmu.Toolbar();
	        toolbar.position({top: 20});
	        window.scrollTo(0, 200);
	        setTimeout(function(){
	            // scrollTo不同的数值后，window.pageYOffset会有1~2px的误差，上面有个地方也是这个情况，所以这里用约等于判断
	            approximateEqual( toolbar.$el.offset().top, 220, '页面滚动后，toolbar位置正常(不稳定，可忽略)');
	            toolbar.destroy();
	            tmp.remove();
	            start();
	        }, 1000);
	    }, 100);
    });
});