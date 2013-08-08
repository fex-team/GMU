test('fix', function() {
	stop();
	expect(3);
	var $el = $('<div style="width:10px;height:10px;background-color:red"></div>').appendTo(document.body).fix({
		left: 10,
		top: 10
	});
	if(window.top !== window){	// 在ifream中跑用例时，因为iframe的高度设置成了2000px，这个地方得插入一个很高的div才能起作用
		var help = $('<div style="height:10000px;"></div>').appendTo(document.body);
	}else{
		var help = $('<div style="height:2000px;"></div>').appendTo(document.body);
	}
	setTimeout(function(){
		window.scrollTo(0, 1000);
        setTimeout(function(){
            // ta.scrollStop(document);
            approximateEqual(window.pageYOffset, 1000, "The pageYOffset is " + window.pageYOffset);
            equal($el.offset().top, 10 + window.pageYOffset, 'top is right');
            equal($el.offset().left, 10, 'left is right');
            window.scrollTo(0, 0);
            $el.remove();
            help.remove();
            start();
        }, 100);
	}, 100);
});
test('有滚动事件, 但页面没有向下移动,位置不变', function() {
    stop();
    expect(3);
    var $el = $('<div style="width:10px;height:10px;background-color:red" ></div>').appendTo(document.body).fix({
        left: 10,
        top: 10
    });
    var topBefore = $el.offset().top;
    var leftBefore = $el.offset().left;

    if(window.top !== window){	// 在ifream中跑用例时，因为iframe的高度设置成了2000px，这个地方得插入一个很高的div才能起作用
        var help = $('<div style="height:10000px;"></div>').appendTo(document.body);
    }else{
        var help = $('<div style="height:2000px;"></div>').appendTo(document.body);
    }
    
    setTimeout(function(){
        window.scrollTo(0, -100);
        // ta.scrollStop(document);
        setTimeout(function(){
            approximateEqual(window.pageYOffset, 0, "The pageYOffset is " + window.pageYOffset);
            equal($el.offset().top, topBefore, 'top is right' + topBefore);
            equal($el.offset().left, leftBefore, 'left is right');
            window.scrollTo(0, 0);
            $el.remove();
            help.remove();
            start();
        }, 100);
    }, 10);
});
test('制造场景，使fix使用absolute定位(top定位)', function() {
    stop();
    expect(2);
    var $el = $('<div style="width:10px;height:10px;background-color:red" ></div>').appendTo(document.body).fix({
        top: 10
    });

    if(window.top !== window){	// 在ifream中跑用例时，因为iframe的高度设置成了2000px，这个地方得插入一个很高的div才能起作用
        var help = $('<div style="height:10000px;"></div>').appendTo(document.body);
    }else{
        var help = $('<div style="height:2000px;"></div>').appendTo(document.body);
    }

    setTimeout(function(){
        window.scrollTo(0, 1000);
        //在这儿人为把buff[0].getBoundingClientRect().top改了
        $el.next()[0].style['top'] = '0px';
        // ta.scrollStop(document);
        setTimeout(function(){
            equal(window.pageYOffset, 1000, "The pageYOffset is " + window.pageYOffset);
            equal($el.offset().top, 10 + window.pageYOffset, 'top is right');
            window.scrollTo(0, 0);
            $el.remove();
            help.remove();
            start();
        }, 100);
    }, 10);
});
test('制造场景，使fix使用absolute定位(只设left)', function() {
    stop();
    expect(3);

    setTimeout(function(){
        var $el = $('<div style="width:10px;height:10px;background-color:red" ></div>').appendTo(document.body).fix({left:10});
    
        if(window.top !== window){  // 在ifream中跑用例时，因为iframe的高度设置成了2000px，这个地方得插入一个很高的div才能起作用
            var help = $('<div style="height:10000px;"></div>').appendTo(document.body);
        }else{
            var help = $('<div style="height:2000px;"></div>').appendTo(document.body);
        }
        setTimeout(function(){
            window.scrollTo(0, 1000);
            //在这儿人为把buff[0].getBoundingClientRect().top改了
            $el.next()[0].style['top'] = '0px';
            // ta.scrollStop(document);
            setTimeout(function(){
                approximateEqual(window.pageYOffset, 1000, "The pageYOffset is " + window.pageYOffset);
                equal($el.offset().top, window.pageYOffset, 'top is right');
                equal($el.offset().left, 10, 'left is right');
                window.scrollTo(0, 0);
                $el.remove();
                help.remove();
                start();
            }, 100);
        }, 10);
    }, 100);
    
});
test('制造场景，使fix使用absolute定位(bottom定位)', function() {
    stop();
    expect(4);
    var $el = $('<div style="height:10px;background-color:red" ></div>').appendTo(document.body).fix({
        right: 80,
        bottom: 700,
        width:'100%'
    });

    if(window.top !== window){	// 在ifream中跑用例时，因为iframe的高度设置成了2000px，这个地方得插入一个很高的div才能起作用
        var help = $('<div style="height:10000px;"></div>').appendTo(document.body);
    }else{
        var help = $('<div style="height:2000px;"></div>').appendTo(document.body);
    }

    setTimeout(function(){
        window.scrollTo(0, 1000);
        //在这儿人为把buff[0].getBoundingClientRect().top改了
        $el.next()[0].style['top'] = '0px';
        // ta.scrollStop(document);
        setTimeout(function(){
            approximateEqual(window.pageYOffset, 1000, "The pageYOffset is " + window.pageYOffset);
            equal($el.offset().top,window.pageYOffset + window.innerHeight - $el.height()-700 , 'top is right');
            equal($el.offset().left, -80, 'left is right');
            equal($el.offset().width, document.body.offsetWidth, 'left is right');
            window.scrollTo(0, 0);
            $el.remove();
            help.remove();
            start();
        }, 100);
        
    }, 10);
});