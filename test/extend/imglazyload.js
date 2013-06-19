var htmlArr = [];
module("zepto.imglazyload",{
    setup:function(){
        var i = 0, html = [];
        $("body").append("<div id='container'></div>");
        //创建dom
        while (i++ < 12) {
            html.push('<p>'
            + '爱因斯坦（1879－1955），美籍德国犹太人。他创立了代表现代科学的相对论，并为核能开发奠定了理论基础，在现代科学技术和他的深刻影响及广泛应用方面开创了现代科学新纪元，被公认为自伽利略、牛顿以来最伟大的'
            + '科学家、思想家。1921年诺贝尔物理学奖获得者。现代物理学的开创者和奠基人，相对论——“质能关系”的提出者，“决定论量子力学诠释”的捍卫者（振动的粒子）——不掷骰子的上帝。1999年12月26日，爱因斯坦被美国《时代周刊》评选为“世纪伟人”。'
            +  '</p>'
            + '<div class="ui-imglazyload" data-url="../../core/imglazyload/' + i + '.jpg"></div>');
        }
        $('#container').append(html.join(' '));
        $('.ui-imglazyload').css({
            height: 220,
            width: 176
        });
        htmlArr = html;
    },
    teardown: function(){
        $('#container').remove();
    }
});

function getImgsInView ($images, scrollTop, placeHolder) {
    var imgs = [],
        winH,
        offset,
        placeHolder = placeHolder || 0,
        scrollTop = scrollTop || 0;
    $images.each(function () {
        winH = window.innerHeight;
        offset = $(this).offset();
        if (offset.top + placeHolder <= winH + scrollTop  && offset.top + $(this).height() >= scrollTop) {
            imgs.push(this);
        }
    });
    return imgs;
}

function getImgsInWrapper ($images, $wrapper, placeHolder) {
    var imgs = [],
        offset,wOffset,
        placeHolder = placeHolder || 0;
    $images.each(function () {
        offset = $(this).offset();
        wOffset = $wrapper.offset();
        if (offset.top + placeHolder <= wOffset.height + wOffset.top  && offset.top + $(this).height() >= wOffset.top) {
            imgs.push(this);
        }
    });
    return imgs;
}

test("初始状态:图片进入可视区能正确加载 & threshold", function(){
    var $images = $('.ui-imglazyload'),   //获取初始状态下在可视区内的图片
        viewImages = getImgsInView($images),
        sucImages = [];
    expect(viewImages.length+1);
    stop();

    $('.ui-imglazyload').imglazyload({
        threshold: 200
    }).on('loadcomplete', function () {
        sucImages.push(this);
        sucImages.length > viewImages.length ? ok(true, 'threshold起作用了'): ok(~$.inArray(this, viewImages), '图片成功加载');
    });
    setTimeout(function () {    //待图片加载完成
        window.scrollTo(0,0);
        $(window).off('scrollStop');
        start();
    }, 300);
});

test("scrollStop:图片进入可视区能正确加载 & loadcomplete", function(){
    var viewImages = getImgsInView($('.ui-imglazyload')),
        container = $('#container').get(0),
        itemH = $('p').height() + $('.ui-imglazyload').height(),
        n = 2,sucImages = [],
        loaded = false;    //滚动加载的张数
    expect(viewImages.length + n + 1);
    stop();

    $('.ui-imglazyload').imglazyload().on('loadcomplete', function () {
        sucImages.push(this);
        ok(~$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
        if (!loaded) {
            ok(loaded = true, 'loadcomplete起作用了')
        }
    });

    $(window).on('scrollStop', function () {
        viewImages = getImgsInView($('.ui-imglazyload'), n*itemH, 0);
    });
    
    setTimeout(function(){
    	window.scrollTo(0, n*itemH);
    	ta.scrollStop();
        setTimeout(function () {
            window.scrollTo(0,0);
            $(window).off('scrollStop');
            start();
        }, 200);
    }, 200);
});

test("scroll:图片进入可视区能正确加载 & startLoad", function(){
    stop();
    var viewImages = getImgsInView($('.ui-imglazyload')),
        container = $('#container').get(0),
        itemH = $('p').height() + $('.ui-imglazyload').height(),
        n = 6,
        sucImages = [],
        startload = false,
        dis;    //滚动加载的张数

    $('.ui-imglazyload').imglazyload({
        startload: function () {
            !startload && ok(startload = true, 'startload triggered');
        },
        eventName: 'scroll'
    }).on('loadcomplete', function () {
        sucImages.push(this);
        ok(~$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
    });

    $(window).on('scroll', function () {
        viewImages = getImgsInView($('.ui-imglazyload'), dis);
    });

    setTimeout(function(){
    	dis = n*itemH;
        window.scrollTo(0, dis);
        ta.scroll();
        
        setTimeout(function(){
        	dis = (n - 3)*itemH;
            window.scrollTo(0, dis);    //两次滑动，触发scroll效果
            ta.scroll();

            setTimeout(function () {
                window.scrollTo(0,0);
                $(window).off('scrollStop');
                $(window).off('scroll');
                start();
            }, 200);
        }, 200);
    }, 200);
});

test("iscroll:初始状态图片在iscroll wrapper区域内能正确加载", function(){
    stop();
    ua.importsrc('extend/iscroll', function(){
        var viewImages = [],
            $scroller = $('#container'),
            itemH = $('p').height() + $('.ui-imglazyload').height(),
            n = 3,$wrapper;    //滚动加载的张数
        expect(n);

        $scroller.wrap($wrapper = $('<div id="wrapper"></div>').height(n*itemH));
        viewImages = getImgsInWrapper($('.ui-imglazyload'),$wrapper, 0)
        $wrapper.iScroll({
            hScroll: false,
            onScrollEnd: function () {
                $.fn.imglazyload.detect();
            }
        });
        $('.ui-imglazyload').imglazyload({
            innerScroll:true,
            container: $wrapper
        }).on('loadcomplete', function () {
                ok(~$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });

        setTimeout(function () {
            $wrapper.remove();
            start();
        }, 200);
    }, 'window.iScroll', 'core/imglazyload');
});

test("iscroll:滚动过程中在iscroll wrapper区域内能正确加载", function(){
    stop();
    ua.importsrc('extend/iscroll', function(){
        var viewImages = [],
            $scroller = $('#container'),
            itemH = $('p').height() + $('.ui-imglazyload').height(),
            n = 3,$wrapper;    //滚动加载的张数
        expect(n * 2);

        $scroller.wrap($wrapper = $('<div id="wrapper"></div>').height(n*itemH + 20));
        viewImages = getImgsInWrapper($('.ui-imglazyload'),$wrapper, 0);
        $wrapper.iScroll({
            hScroll: false,
            onScrollEnd: function () {
                viewImages = getImgsInWrapper($('.ui-imglazyload'),$wrapper, 0);
                $.fn.imglazyload.detect();
            }
        });
        $('.ui-imglazyload').imglazyload({
            container: $wrapper
        }).on('loadcomplete', function () {
            ok(~$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
        });

        setTimeout(function () {
            ta.touchstart($scroller[0], {
                touches:[{
                    pageX: 0,
                    pageY: 200
                }]
            });
            ta.touchmove($scroller[0], {
                touches:[{
                    pageX: 0,
                    pageY: -400
                }]
            });

            ua.mousedown($scroller[0], {
                clientX: 0,
                clientY: 200
            });
            ua.mousemove($scroller[0], {
                clientX: 0,
                clientY: -400
            });
            
            setTimeout(function(){
            	ta.touchend($scroller[0]);
                ua.mouseup($scroller[0]);
                
                setTimeout(function () {
                    $wrapper.remove();
                    start();
                }, 500);
            }, 300);   
        }, 200);
    }, 'window.iScroll', 'core/imglazyload');
});

test("refresh:增加图片后能正确加载 & error", function(){
    stop();
    var viewImages = getImgsInView($('.ui-imglazyload')),
        container = $('#container').get(0),
        itemH = $('p').height() + $('.ui-imglazyload').height(),
        n = 6,
        sucImages = [],
        startload = false,
        dis, $btn;    //滚动加载的张数
    stop();

    $(container).prepend('<div class="ui-imglazyload" data-url="../../core/imglazyload/aa.jpg"></div>');

    $btn = $('<div id="btn">点击我加载新图片</div>').on('click', function () {
        $(container).append(htmlArr.join(' '));
        $('.ui-imglazyload').imglazyload({
            refresh: true
        }).
            css({
                height: 220,
                width: 176
            });

    }).prependTo('body');

    $('.ui-imglazyload').imglazyload({
        startload: function () {
            !startload && ok(startload = true, 'startload triggered');
        },
        eventName: 'scroll'
    }).on('error', function () {
            ok(true, 'error triggered');
        }).on('loadcomplete', function () {
        	sucImages.push(this);
            ok(~$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
        });

    $(window).on('scroll', function () {
        viewImages = getImgsInView($('.ui-imglazyload'), dis);
    });

    setTimeout(function(){
    	dis = n*itemH;
        window.scrollTo(0, dis);
        ta.scroll();

        setTimeout(function () {
            $btn.trigger('click');
            equal($('.ui-imglazyload').length + sucImages.length, 25, '点击按钮后，图片添加进来了');

            setTimeout(function(){
            	dis = 2*n*itemH;
                window.scrollTo(0, dis);
                ta.scroll();
                setTimeout(function () {
                    window.scrollTo(0,0);
                    $(window).off('scrollStop');
                    $(window).off('scroll');
                    start();
                }, 200);
            }, 200);
        }, 200);
    }, 200);
});
