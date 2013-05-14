
/**
 * auth: jiangshuguang
 */
module("widget/slider",{

    setup:function(){
        content=[
            {
                href: "#",
                pic: "../../widget/css/slider/image1.png",
                title: "让Coron的太阳把自己晒黑—小天..."
            },

            {
                href: "#",
                pic: "../../widget/css/slider/image2.png",
                title: "让Coron的太阳把自己晒黑—小天..."
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image3.png",
                title: "让Coron的太阳把自己晒黑—小天..."
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image4.png",
                title: "让Coron的太阳把自己晒黑—小天..."
            }
        ];

        content3=[
            {
                href: "#",
                pic: "../../widget/css/slider/image1.png",
                title: "图片1"
            },

            {
                href: "http://www.baidu.com",
                pic: "../../widget/css/slider/image2.png",
                title: "图片2"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image3.png",
                title: "图片3"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image4.png",
                title: "图片4"
            }
        ];

        content2=[
            {
                href: "http://www.baidu.com",
                pic: "../../widget/css/slider/image1.png",
                title: "图片1"
            },

            {
                href: "#",
                pic: "../../widget/css/slider/image2.png",
                title: "图片2"
            }
        ];
        content1=[
            {
                href: "http://www.baidu.com",
                pic: "../../widget/css/slider/image1.png",
                title: "让Coron的太阳把自己晒黑—小天..."
            }
        ];
        content4=[
            {
                href: "http://www.baidu.com",
                pic: "../../widget/css/slider/image1.png",
                title: "图片1"
            },

            {
                pic: "../../widget/css/slider/image2.png"
            }
        ];
        content5=[
            {
                href: "#",
                pic: "../../widget/css/slider/image1.png",
                title: "图片1"
            },

            {
                href: "http://www.baidu.com",
                pic: "../../widget/css/slider/image2.png",
                title: "图片2"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image3.png",
                title: "图片3"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image4.png",
                title: "图片4"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image4.png",
                title: "图片4"
            },
            {
                href: "#",
                pic: "../../widget/css/slider/image4.png",
                title: "图片4"
            }
        ];

        $("body").append("<div id='ui-slider-test'></div>");
        $("#ui-slider-test").css("height","148px").css("overflow","hidden");
    }
});

(function(){
    isAndroid4= !!/Android 4/.test(navigator.userAgent);
    slider_time = isAndroid4?300:100;
    isIos5 =($.os.ios && ($.os.version.match(/^\d+/))[0]==5)?true:false;
})();

function setMod(){
    $("body").append(
        '<div id="slider-container-2" >'+
            '<div><a href="#"><img lazyload="../../widget/css/slider/image1.png"></a><p>图片1</p></div>'+
            '<div><a href="#"><img lazyload="../../widget/css/slider/image2.png"></a><p>图片2</p></div>'+
            '<div><a href="#"><img lazyload="../../widget/css/slider/image3.png"></a><p>图片3</p></div>'+
            '<div><a href="#"><img lazyload="../../widget/css/slider/image4.png"></a><p>图片4</p></div>'+
        '</div>'
    );
}

test("el(selector)&默认参数",function(){
    expect(16);
    stop();
    ua.loadcss(["reset.css", "widget/slider/slider.css","widget/slider/slider.default.css"], function(){
        var slider = $.ui.slider("#ui-slider-test", {
            content: content3
        });
        equals(slider._data.index,0,"The default index is right");
        equals(slider._data.imgInit,2,"The default imgInit is right");
        equals(slider._data.imgZoom,false,"The default imgZoom is right");
        equals(slider._data.loop,false,"The default loop is right");
        equals(slider._data.springBackDis,15,"The default springBackDis is right");
        equals(slider._data.autoPlay,true,"The default autoPlay is right");
        equals(slider._data.animationTime,400,"The default animationTime is right");
        equals(slider._data.showArr,true,"The default showArr is right");
        equals(slider._data.showDot,true,"The default showDot is right");
        equals(slider._data.viewNum,1,"The default viewNum is right");

        equals(slider._el.attr("class"),"ui-slider","The root class is right");
        setTimeout(function(){
            ok(ua.isShown($(".ui-slider-wheel")[0]), "The slider shows");
            equals($(slider._el).children().attr("class"),"ui-slider-wheel","The child class is right");
            equals($($(".ui-slider-item")[0]).offset().left,$('.ui-slider').offset().left,"The left right");
            equals($($(".ui-slider-item")[0]).offset().top,$(".ui-slider").offset().top,"The top right");
            equals($('.ui-slider-group').offset().height,148,"The height is right");
            slider.destroy();
            start();
        },50);
    });
});


test("container", function() {
    expect(7);
    $("#ui-slider-test")&&$("#ui-slider-test").remove();
    $("body").append("<div id='slider-container'></div>");
    $("#slider-container").css("height","148px").css("overflow","hidden");

    var slider = $.ui.slider({
        container: "#slider-container",
        content: content3
    });
    equals(slider._data.container, "#slider-container", "The _data is right");
    ok(ua.isShown(slider._el[0]), "The slider shows");
    equals(slider._el.offset().left, $("#slider-container").offset().left, "The left is right");
    equals(slider._el.offset().top, $("#slider-container").offset().top, "The top is right");
    equals(slider._el.offset().width, $("#slider-container").offset().width, "The width is right");
    equals(slider._el.offset().height, 148, "The height is right");
    equals(slider._el.attr("class"), "ui-slider", "The el is right");
    slider.destroy();
    $("#slider-container").remove();
});

test("el(zepto) & 宽度和高度",function(){
    expect(2);
    $("#ui-slider-test")&&$("#ui-slider-test").remove();
    stop();
    var i=0;
    var slider = $.ui.slider("<div id='slider_1'></div>", {
        content: content3,
        animationTime:1
    });
    var width = $('#slider_1').width();
    var height = $('#slider_1').height();
    setTimeout(function(){
        equals($('.ui-slider-item')[1].offsetWidth,width,"The width is right");
        equals($('.ui-slider-item')[1].offsetHeight,height,"The height is right");
        slider.next();
        setTimeout(function(){
            slider.destroy();
            start();
        },slider_time);
    },slider_time);

});

test("content", function() {
    stop();
    expect(6);
    var slider = $.ui.slider("#ui-slider-test", {
        content: content4,
        autoPlay: false
    });
    var bottom = $("#ui-slider-test .ui-slider-wheel .ui-slider-group .ui-slider-item");
    equals(bottom[0].childNodes[0].tagName.toLowerCase(), "a", "The link is right");
    equals(bottom[0].childNodes[0].href, "http://www.baidu.com/", "The link is right");
    equals(bottom[0].childNodes[0].childNodes[0].tagName.toLowerCase(), "img", "The pic is right");
    equals(bottom[0].childNodes[0].childNodes[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The pic is right");
    equals(bottom[0].childNodes[1].tagName.toLowerCase(), "p", "The title is right");
    equals(bottom[1].childNodes[0].href.substr(-9), 'undefined', "No href");
    slider.destroy();
    start();
});

test("itemRender", function() {
    stop();
    expect(6);
    var slider = $.ui.slider("#ui-slider-test", {
        itemRender: function(index){
        	if(index == 0)
        		return '<a href="http://www.baidu.com"><img lazyload="../../widget/css/slider/image1.png" src="../../widget/css/slider/image1.png"></a><p>图片1</p>';
        	if(index == 1)
        		return '<a href="undefined"><img lazyload="../../widget/css/slider/image2.png" src="../../widget/css/slider/image2.png"></a>';
        },
        autoPlay: false
    });
    var bottom = $("#ui-slider-test .ui-slider-wheel .ui-slider-group .ui-slider-item");
    equals(bottom[0].childNodes[0].tagName.toLowerCase(), "a", "The link is right");
    equals(bottom[0].childNodes[0].href, "http://www.baidu.com/", "The link is right");
    equals(bottom[0].childNodes[0].childNodes[0].tagName.toLowerCase(), "img", "The pic is right");
    equals(bottom[0].childNodes[0].childNodes[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The pic is right");
    equals(bottom[0].childNodes[1].tagName.toLowerCase(), "p", "The title is right");
    equals(bottom[1].childNodes[0].href.substr(-9), 'undefined', "No href");
    slider.destroy();
    start();
});


test("viewNum = 3", function() {
    stop();
    expect(5);
    var i= 0,
        viewNum = 3;
    var slider = $.ui.slider("#ui-slider-test", {
        viewNum: viewNum,
        content: content5,
        autoPlay:false,
        slideend:function(){
        	setTimeout(function(){
        		 i++;
                 if(i==1){
                     approximateEqual($('.ui-slider-wheel').offset().left, ($('#ui-slider-test').offset().width + 2) /viewNum * -1,"显示第二张图片");
                     slider.next();
                 }else if(i==2){
                     approximateEqual($('.ui-slider-wheel').offset().left, ($('#ui-slider-test').offset().width + 2) /viewNum * -2,"显示第三张图片");
                     slider.next();
                 }else if(i==3){
                     approximateEqual($('.ui-slider-wheel').offset().left, ($('#ui-slider-test').offset().width + 2) /viewNum * -3,"显示第四张图片");
                     setTimeout(function(){
                         slider.destroy();
                         start();
                     },10);
                 }
            }, 100)
        }
    });
    equals($('.ui-slider-wheel').offset().left,0,"初始显示第一张图片");
    approximateEqual($('#ui-slider-test').offset().width, $('.ui-slider-item').offset().width * viewNum, 2, "The viewNum is right");
    slider.next();
});

test("imgInit=0 (加载全部的图片) & 检查是否影响播放", function() {
    stop();
    expect(10);
    var i=0;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        imgInit:0,
        animationTime:50,
        autoPlayTime:800,
        autoPlay:false,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left,$('#ui-slider-test').offset().width * -1,"显示第二张图片");
                slider.next();
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left,$('#ui-slider-test').offset().width * -2,"显示第三张图片");
                slider.next();
            }else if(i==3){
                equals($('.ui-slider-wheel').offset().left,$('#ui-slider-test').offset().width * -3,"显示第四张图片");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },10);
            }
        }
    });
    equals($('.ui-slider-wheel').offset().left,0,"初始显示第一张图片");
    equals($($("img")[0]).attr("lazyload"), "../../widget/css/slider/image1.png", "The lazyload is right");
    equals($($("img")[0]).attr("src"), "../../widget/css/slider/image1.png", "The src is right");
    equals($($("img")[1]).attr("lazyload"), "../../widget/css/slider/image2.png", "The lazyload is right");
    equals($($("img")[1]).attr("src"), "../../widget/css/slider/image2.png", "The src is right");
    equals($($("img")[2]).attr("lazyload"), "../../widget/css/slider/image3.png", "The lazyload is right");
    equals($($("img")[2]).attr("src"), "../../widget/css/slider/image3.png", "The src is right");
    slider.next();
});


test("imgInit=1 (加载一张图片)", function() {
    stop();
    expect(28);
    var i=0;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        imgInit:1,
        animationTime:1,
        autoPlay:false,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
                equals($($("img")[0]).attr("lazyload"), "../../widget/css/slider/image1.png", "The lazyload is right");
                equals($("img")[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The src is right");
                equals($($("img")[1]).attr("lazyload"), "../../widget/css/slider/image2.png", "The lazyload is right");
                equals($("img")[1].getAttribute("src"), "../../widget/css/slider/image2.png", "The src is right");
                equals($($("img")[2]).attr("lazyload"), "../../widget/css/slider/image3.png", "The lazyload is right");
                equals($("img")[2].getAttribute("src"), null, "The src is right");
                slider.next();
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                equals($($("img")[0]).attr("lazyload"), "../../widget/css/slider/image1.png", "The lazyload is right");
                equals($("img")[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The src is right");
                equals($($("img")[1]).attr("lazyload"), "../../widget/css/slider/image2.png", "The lazyload is right");
                equals($("img")[1].getAttribute("src"), "../../widget/css/slider/image2.png", "The src is right");
                equals($($("img")[2]).attr("lazyload"), "../../widget/css/slider/image3.png", "The lazyload is right");
                setTimeout(function(){
                    equals($("img")[2].getAttribute("src"), "../../widget/css/slider/image3.png", "The src is right");
                    slider.next();
                },10);
            }else{
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -3,"显示第四张图片");
                equals($($("img")[0]).attr("lazyload"), "../../widget/css/slider/image1.png", "The lazyload is right");
                equals($("img")[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The src is right");
                equals($($("img")[1]).attr("lazyload"), "../../widget/css/slider/image2.png", "The lazyload is right");
                equals($("img")[1].getAttribute("src"), "../../widget/css/slider/image2.png", "The src is right");
                equals($($("img")[2]).attr("lazyload"), "../../widget/css/slider/image3.png", "The lazyload is right");
                equals($("img")[2].getAttribute("src"), "../../widget/css/slider/image3.png", "The src is right");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },10);
            }
        }
    });
    equals($('.ui-slider-wheel').offset().left,0,"初始显示第一张图片");
    equals($($("img")[0]).attr("lazyload"), "../../widget/css/slider/image1.png", "The lazyload is right");
    equals($("img")[0].getAttribute("src"), "../../widget/css/slider/image1.png", "The src is right");
    equals($($("img")[1]).attr("lazyload"), "../../widget/css/slider/image2.png", "The lazyload is right");
    equals($("img")[1].getAttribute("src"), null, "The src is right");
    equals($($("img")[2]).attr("lazyload"), "../../widget/css/slider/image3.png", "The lazyload is right");
    equals($("img")[2].getAttribute("src"), null, "The src is right");
    slider.next();
});

test("imgZoom=false",function(){
    expect(10);
    stop();
    var i = 0;
    var time=(isAndroid4?250:50);
    $("#ui-slider-test").css("height",100).css("width",100);
    var slider = $.ui.slider("#ui-slider-test", {
        content: content,
        imgZoom:false,
        animationTime:1,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
                equals($("img")[1].offsetWidth,479,"The width is right");
                equals($("img")[1].offsetHeight,268,"The height is right");
                slider.next();
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                equals($("img")[2].offsetWidth,320,"The width is right");
                equals($("img")[2].offsetHeight,148,"The height is right");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },20);
            }
        }
    });
    equals(slider._data.imgZoom,false,"The imgClip is right");
    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left,0,"显示第一张图片");
        equals($("img")[0].offsetWidth,320,"The width is right");
        equals($("img")[0].offsetHeight,148,"The height is right");
        slider.next();
    },500);
});

test("imgZoom=true 等比例缩放(高度随宽度的比例缩放)",function(){
    expect(10);
    stop();
    var i = 0;
    $("#ui-slider-test").css("height",100).css("width",100);
    var slider = $.ui.slider("#ui-slider-test", {
        content: content,
        imgZoom:true,
        animationTime:1,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
                equals($("img")[1].offsetWidth,100,"The width is right");
                approximateEqual($("img")[1].offsetHeight,parseInt((100/479)*268),"The height is right");
                slider.next();
            }else{
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                equals($("img")[2].offsetWidth,100,"The width is right");
                equals($("img")[2].offsetHeight,parseInt((100/320)*148),"The height is right");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },20);
            }
        }
    }) ;
    equals(slider._data.imgZoom,true,"The imgClip is right");
    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left,0,"显示第一张图片");
        equals($("img")[0].offsetWidth,100,"The width is right");
        equals($("img")[0].offsetHeight,parseInt((100/320)*148),"The height is right");
        slider.next();
    },600);
});


test("imgZoom=true 等比例缩放(宽度随高度的比例缩放)",function(){
    expect(10);
    stop();
    var i=0;
    $("#ui-slider-test").css("height",100).css("width",300);
    var slider = $.ui.slider("#ui-slider-test", {
        content: content,
        imgZoom:true,
        animationTime:1,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
                approximateEqual($("img")[1].offsetWidth,parseInt((100/268)*479),"The width is right");
                equals($("img")[1].offsetHeight,100,"The height is right");
                slider.next();
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                equals($("img")[0].offsetWidth,parseInt((100/148)*320),"The width is right");
                equals($("img")[0].offsetHeight,100,"The height is right");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },20);
            }
        }
    }) ;
    equals(slider._data.imgZoom,true,"The imgClip is right");
    setTimeout(function(){
        equals($($('.ui-slider-item')[0]).offset().left,0,"显示第一张图片");
        equals($("img")[0].offsetWidth,parseInt((100/148)*320),"The width is right");
        equals($("img")[0].offsetHeight,100,"The height is right");
        slider.next();
    },600);
});

test("loop=false & autoPlay=true",function(){
    expect(7);
    stop();
    var i = 0;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        loop:false,
        animationTime:1,
        autoPlay:true,
        autoPlayTime:50,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
            }else if(i==3){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -3,"显示第四张图片");
                setTimeout(function(){
                    equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                    slider.destroy();
                    start();
                },90);
            }
        }
    }) ;
    equals(slider._data.loop,false,"The loop is right");
    equals(slider._data.autoPlay,true,"The autoPlay is right");
    equals($('.ui-slider-wheel').offset().left, 0,"显示第一张图片");
});


test("springBackDis & autoPlay=true(判断自动播放是否影响滑动)", function() {
    stop();
    expect(6);
    var time = isAndroid4?300:150;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content,
        autoPlayTime:isAndroid4?400:200,
        autoPlay:true,
        animationTime: 1,
        springBackDis:11
    });

    equals(slider._data.springBackDis,11,"The springBackDis is right");
    equals(slider._data.autoPlay,true,"The autoPlay is right");
    equals($('.ui-slider-wheel').offset().left, 0,"The left is right");

    ta.touchstart($(".ui-slider-wheel")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-slider-wheel")[0], {
        touches:[{
            clientX: -12,      //   滑动的距离大于springBackDis
            clientY: 0
        }]
    });
    ta.touchend($(".ui-slider-wheel")[0]);

    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture slide");

        ta.touchstart($(".ui-slider-wheel")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($(".ui-slider-wheel")[0], {
            touches:[{
                clientX: 10,          //   滑动的距离小于springBackDis
                clientY: 0
            }]
        });
        ta.touchend($(".ui-slider-wheel")[0]);

        setTimeout(function(){
            equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture not slide");
            ta.touchstart($(".ui-slider-wheel")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($(".ui-slider-wheel")[0], {
                touches:[{
                    clientX: 12,          //   滑动的距离大于springBackDis
                    clientY: 0
                }]
            });
            ta.touchend($(".ui-slider-wheel")[0]);
            setTimeout(function(){
                equals($('.ui-slider-wheel').offset().left, 0,"The picture not slide");
                slider.destroy();
                start();
            }, time);
        }, time);
    }, time);
});


test("springBackDis = 0", function() {
    stop();
    expect(6);
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlay:true,
        animationTime: 1,
        springBackDis:0
    });

    equals(slider._data.springBackDis,0,"The springBackDis is right");
    equals(slider._data.autoPlay,true,"The autoPlay is right");
    equals($('.ui-slider-wheel').offset().left, 0,"The left is right");

    ta.touchstart($(".ui-slider-wheel")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-slider-wheel")[0], {
        touches:[{
            clientX: -10,
            clientY: 0
        }]
    });
    ta.touchend($(".ui-slider-wheel")[0]);

    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture slide");
        ta.touchstart($(".ui-slider-wheel")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($(".ui-slider-wheel")[0], {
            touches:[{
                clientX: -10,
                clientY: 0
            }]
        });
        ta.touchend($(".ui-slider-wheel")[0]);

        setTimeout(function(){
            equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"The picture slide");
            ta.touchstart($(".ui-slider-wheel")[0], {
                touches: [{
                    clientX: 0,
                    clientY: 0
                }]
            });
            ta.touchmove($(".ui-slider-wheel")[0], {
                touches:[{
                    clientX: 10,
                    clientY: 0
                }]
            });
            ta.touchend($(".ui-slider-wheel")[0]);
            setTimeout(function(){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture slide");
                slider.destroy();
                start();
            }, slider_time);
        }, slider_time);
    }, slider_time);
});

test("showArr=false&showDot=false",function(){
    expect(5);
    stop();
    var slider = $.ui.slider("#ui-slider-test", {
        content: content,
        showArr:false,
        showDot:false
    });
    equals(slider._data.showArr,false,"The showArr is true");
    equals(slider._data.showDot,false,"The showDot is true");

    setTimeout(function(){
        equals($(".ui-slider.pre").length,0,"The pre Arrow is not show");
        equals($(".ui-slider-next").length,0,"The next Arrow is not show");
        equals($(".ui-slider-dots").length,0,"The dots is not show");
        slider.destroy();
        start();
    },50);
});

test("showArr=true & showDot=true & pre() & next()",function(){
    expect(33);
    stop();
    var i=0;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        showArr:true,
        showDot:true,
        animationTime:1,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The left is right");
                equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
                equals($(".ui-slider-next").length,1,"The next Arrow is show");
                equals($('.ui-slider-dots').length,1,"The dots is show");
                equals($('.ui-slider-dots').children()[1].className,"ui-slider-dot-select","The dots is right");
                ta.tap($(".ui-slider-pre")[0]);
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left,0,"The left is right");
                equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
                equals($(".ui-slider-next").length,1,"The next Arrow is show");
                equals($('.ui-slider-dots').length,1,"The dots is show");
                equals($('.ui-slider-dots').children()[0].className,"ui-slider-dot-select","The dots is right");
                slider.next();
            }else if(i==3){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The left is right");
                equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
                equals($(".ui-slider-next").length,1,"The next Arrow is show");
                equals($('.ui-slider-dots').length,1,"The dots is show");
                equals($('.ui-slider-dots').children()[1].className,"ui-slider-dot-select","The dots is right");
                slider.pre();
            }else if(i==4){
                equals($('.ui-slider-wheel').offset().left, 0,"The left is right");
                equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
                equals($(".ui-slider-next").length,1,"The next Arrow is show");
                equals($('.ui-slider-dots').length,1,"The dots is show");
                equals($('.ui-slider-dots').children()[0].className,"ui-slider-dot-select","The dots is right");
                slider.next();
            }else{
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The left is right");
                equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
                equals($(".ui-slider-next").length,1,"The next Arrow is show");
                equals($('.ui-slider-dots').length,1,"The dots is show");
                equals($('.ui-slider-dots').children()[1].className,"ui-slider-dot-select","The dots is right");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },20);
            }
        }
    });

    equals(slider._data.showArr,true,"The showArr is true");
    equals(slider._data.showDot,true,"The showDot is true");
    equals($(".ui-slider-pre").length,1,"The pre Arrow is show");
    equals($(".ui-slider-next").length,1,"The next Arrow is show");
    equals($('.ui-slider-dots').length,1,"The dots is show");
    equals($(slider._el.children()[2]).attr("class"),"ui-slider-pre","The class is right");
    equals($(slider._el.children()[3]).attr("class"),"ui-slider-next","The class is right");
    equals($('.ui-slider-dots').children()[0].className,"ui-slider-dot-select","The dots is right");
    setTimeout(function(){
        ta.tap($(".ui-slider-next")[0]);
    },20);
});

test("autoPlay=true & autoPlayTime & animationTime ", function() {
    stop();
    expect(6);
    var autoPlayTime = isAndroid4?500:300;
    var time =  isAndroid4?550:300;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlayTime:autoPlayTime,
        autoPlay:true,
        animationTime:100
    });
    equals(slider._data.autoPlayTime,autoPlayTime,"The autoPlayTime is true");
    equals(slider._data.animationTime,100,"The animationTime is true");
    equals(slider._data.autoPlay,true,"The autoPlay is true");

    equals($('.ui-slider-wheel').offset().left, 0,"显示第一张图片");
    setTimeout(function(){
        setTimeout(function(){
            equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
            setTimeout(function(){
                setTimeout(function(){
                    equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                    slider.destroy();
                    start();
                },120);
            },time);
        }, 120);
    }, time);
});


test("autoPlay=false&autoPlayTime设任意值",function(){
    stop();
    var autoPlayTime = isAndroid4?300:100;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlay:false,
        autoPlayTime:autoPlayTime,
        animationTime: 1
    });
    equals($('.ui-slider-wheel').offset().left, 0,"显示第一张图片");
    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left, 0,"依然显示第一张图片");
        setTimeout(function(){
            equals($('.ui-slider-wheel').offset().left, 0,"依然显示第一张图片");
            slider.destroy();
            start();
        },autoPlayTime)
    },autoPlayTime)
});


test("stop() & resume()",function(){
    stop();
    expect(4);
    var autoPlayTime = isAndroid4?400:200;
    var time =  isAndroid4?500:240;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlayTime:autoPlayTime,
        animationTime:1
    });
    equals($('.ui-slider-wheel').offset().left, 0,"显示第一张图片");
    setTimeout(function(){
        equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"显示第二张图片");
        slider.stop();
        setTimeout(function(){
            equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"还是显示第二张图片");
            slider.resume();
            setTimeout(function(){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"显示第三张图片");
                slider.destroy();
                start();
            },time)
        },time) ;
    },time);
});


test("多实例",function(){
    stop();
	$("body").css("width",$("body").css("width"));//创建slider后，再向body添加元素，会造成iframe被充宽
	var slider_time = isAndroid4 ? 500 : 180;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content2,
	    autoPlay:false,
        animationTime:1,
        click:function(){
            equal($(this).attr("id"),"ui-slider-test","The class is right");
        }
    });

    $("body").append("<div id='ui-slider-test1'></div>");
//    $(".ui-slider-test1").css("width","400px").css("height","148px").css("background","#E3E3E3").css("position","relative").css("overflow","hidden");
    $("#ui-slider-test1").css("height","148px").css("overflow","hidden").css("width","400px");
    var slider1 = $.ui.slider("#ui-slider-test1", {
        content: content2,
        animationTime:1,
	    autoPlay:false,
        click:function(){
            equal($(this).attr("id"),"ui-slider-test1","The class is right");
        }
    });

    equals(slider._el.attr("id"),"ui-slider-test","The slider class is right");
    equals(slider1._el.attr("id"),"ui-slider-test1","The slider1 class is right");
    ta.tap(slider._el[0]);
    ta.tap(slider1._el[0]);
    ta.tap($("#ui-slider-test").find(".ui-slider-next")[0]);
    setTimeout(function(){
        equals($("#ui-slider-test").find('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"slider显示第二张图片");
        equals($("#ui-slider-test1").find('.ui-slider-wheel').offset().left, 0,"slider1 显示第一张图片");
        ta.tap($("#ui-slider-test1").find(".ui-slider-next")[0]);
        setTimeout(function(){
            equals($("#ui-slider-test").find('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"slider显示第二张图片");
            equals($("#ui-slider-test1").find('.ui-slider-wheel').offset().left, $('#ui-slider-test1').offset().width * -1,"slider1 显示第二片");
            slider.destroy();
            slider1.destroy();
            start();
        },slider_time);
    },slider_time);
});


test("事件 & 点击图片(点击链接和触发事件) ",function(){
    expect(6);
    var k=0;
    var time = new Date();
    stop();
    var slider_time = isAndroid4?500:180;
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlayTime:isAndroid4?300:100,
        animationTime:50,
        slide:function(e, index){
            equals(index,1,"The index is right");
        },
        slideend:function(e, index){
            ok(new Date()-time>(isAndroid4?350:150),"slideend is right");
            equals(index,1,"The index is right");
        }
    });
    slider.root().click(function(){
            k==0 && ok(true,"点击包括图片的所有slider区域，触发onclick事件");
            k==1 && ok(true,"点击包括图片触发onclick事件");
            k==2 && ok(false,"错误的click事件");
            k++;
    });
    ua.click($('#ui-slider-test')[0]);
    ua.click($('img')[0]);
    equals($("img").parents().attr("href"),"#","链接有效");
    setTimeout(function(){
        slider.destroy();
        start();
    },slider_time);
});

test("基本操作( 滑动图片，点击前进后退按钮, 文字/小图片/页码相应翻页 )", function() {
    stop();
    expect(12);
    var i =0;
//    var dic = /Windows/.test(navigator.userAgent)?1:(/Android.*2\.3.*UC/.test(navigator.userAgent)?-1:0);
    var dic = /Windows/.test(navigator.userAgent)?1:(isAndroid4?1:(isIos5? 1:0));
    var slider1 = $.ui.slider("#ui-slider-test", {
        content: content3,
        animationTime: 1 ,
        autoPlayTime:2000,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The left is right");
                equals($($(".ui-slider-item")[1]).find("p").html(),"图片2","The title is right" );
                setTimeout(function(){
                    ta.tap($(".ui-slider-next")[0]);
                },10);
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -2,"The picture slide");
                equals($($(".ui-slider-item")[2]).find("p").html(),"图片3","The title is right" );
                setTimeout(function(){
                    ta.tap($(".ui-slider-pre")[0]);
                },10);

            }else if(i==3){
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture slide");
                equals($($(".ui-slider-item")[1]).find("p").html(),"图片2","The title is right" );
                setTimeout(function(){
                    ta.touchstart($(".ui-slider-wheel")[0], {
                        touches: [{
                            clientX: 0,
                            clientY: 0
                        }]
                    });
                    ta.touchmove($(".ui-slider-wheel")[0], {
                        touches:[{
                            clientX: 20,
                            clientY: 0
                        }]
                    });
                    ta.touchend($(".ui-slider-wheel")[0]);
                },10);
            }else if(i==4){
                equals($('.ui-slider-wheel').offset().left, 0,"The left is right");
                equals($($(".ui-slider-item")[0]).find("p").html(),"图片1","The title is right" );
                setTimeout(function(){
                    ta.tap($(".ui-slider-next")[0]);
                },10);
            }else{
                equals($('.ui-slider-wheel').offset().left, $('#ui-slider-test').offset().width * -1,"The picture slide");
                equals($($(".ui-slider-item")[0]).find("p").html(),"图片1","The title is right" );
                setTimeout(function(){
                    slider1.destroy();
                    start();
                },10);
            }

        }
    });
    equals($('.ui-slider-wheel').offset().left, 0,"The left is right");
    equals($($(".ui-slider-item")[0]).find("p").html(),"图片1","The title is right" );
    setTimeout(function(){
        ta.touchstart($(".ui-slider-wheel")[0], {
            touches: [{
                clientX: 0,
                clientY: 0
            }]
        });
        ta.touchmove($(".ui-slider-wheel")[0], {
            touches:[{
                clientX: -20,
                clientY: 0
            }]
        });
        ta.touchend($(".ui-slider-wheel")[0]);
    },10);
});

test("window resize", function() {
    expect(12);
    stop();
    var width = $("body").css("width");
    $("body").css("width", "500px");
    var slider = $.ui.slider("#ui-slider-test", {
        content: content3,
        autoPlay: false
    });
    setTimeout(function(){
        equals($(".ui-slider-item").css("width"), "500px", "The item width is right");
        equals($(".ui-slider-item")[0].style["-webkit-transform"], "translate3d(0px, 0px, 0px)", "The item -webkit-transform is right");
        equals($(".ui-slider-item")[1].style["-webkit-transform"], "translate3d(500px, 0px, 0px)", "The item -webkit-transform is right");
        equals($(".ui-slider-item")[2].style["-webkit-transform"], "translate3d(1000px, 0px, 0px)", "The item -webkit-transform is right");
        equals($(".ui-slider-item")[3].style["-webkit-transform"], "translate3d(1500px, 0px, 0px)", "The item -webkit-transform is right");
        equals($(".ui-slider-wheel").css("width"), "2000px", "The wheel width is right");

        $("body").css("width", "400px");
        $(window).trigger("ortchange"); //iframe里的silder在android2.3上有问题（不随iframe大小变化而伸缩），故直接调用ortchange

        setTimeout(function(){
            equals($(".ui-slider-item").css("width"), "400px", "The item width is right");
            equals($(".ui-slider-item")[0].style["-webkit-transform"], "translate3d(0px, 0px, 0px)", "The item -webkit-transform is right");
            equals($(".ui-slider-item")[1].style["-webkit-transform"], "translate3d(400px, 0px, 0px)", "The item -webkit-transform is right");
            equals($(".ui-slider-item")[2].style["-webkit-transform"], "translate3d(800px, 0px, 0px)", "The item -webkit-transform is right");
            equals($(".ui-slider-item")[3].style["-webkit-transform"], "translate3d(1200px, 0px, 0px)", "The item -webkit-transform is right");
            equals($(".ui-slider-wheel").css("width"), "1600px", "The wheel width is right");
            $("body").css("width", width);
            slider.destroy();
            start();
        }, 500);
    }, 50);
});

test("_setup", function() {
    $("#ui-slider-test").remove();
    setMod();
    stop();
    expect(24);
    var i=0;
    var slider = $('#slider-container-2').slider({
        animationTime:1,
        slideend:function(){
            i++;
            if(i==1){
                equals($('.ui-slider-wheel').offset().left, $('#slider-container-2').offset().width * -1,"第二张图片显示");
                setTimeout(function(){
                    ta.tap($(".ui-slider-next")[0]);
                },10);
            }else if(i==2){
                equals($('.ui-slider-wheel').offset().left, $('#slider-container-2').offset().width * -2,"第三张图片显示");
                ta.touchstart($(".ui-slider-wheel")[0], {
                    touches: [{
                        clientX: 0,
                        clientY: 0
                    }]
                });
                ta.touchmove($(".ui-slider-wheel")[0], {
                    touches:[{
                        clientX: -15,
                        clientY: 0
                    }]
                });
                ta.touchend($(".ui-slider-wheel")[0]);
            }else{
                equals($('.ui-slider-wheel').offset().left, $('#slider-container-2').offset().width * -3,"第四张图片显示");
                setTimeout(function(){
                    slider.destroy();
                    start();
                },10);
            }
        }
    }).slider('this');
    equals(slider._data.index,0,"The default index is right");
    equals(slider._data.imgInit,2,"The default imgInit is right");
    equals(slider._data.imgZoom,false,"The default imgZoom is right");
    equals(slider._data.loop,false,"The default loop is right");
    equals(slider._data.springBackDis,15,"The default springBackDis is right");
    equals(slider._data.autoPlay,true,"The default autoPlay is right");
    equals(slider._data.animationTime,1,"The default animationTime is right");
    equals(slider._data.showArr,true,"The default showArr is right");
    equals(slider._data.showDot,true,"The default showDot is right");

    //检测加载图片
    equals($($("img")[0]).attr("src"),"../../widget/css/slider/image1.png","第一张图片已加载");
    equals($($("img")[1]).attr("src"),"../../widget/css/slider/image2.png","第二张图片已加载");
    equals($($("img")[2]).attr("src"),"","第三张图片未加载");

    ok(ua.isShown(slider._el[0]), "The slider show");
    equals(slider._el.attr("id"),"slider-container-2","The class is right");
    equals(slider._el.offset().left,$("#slider-container-2").offset().left, "The left is right");
    equals(slider._el.offset().top,$("#slider-container-2").offset().top, "The top is right");
    equals(slider._el.offset().width,$("body").width(), "The width is right");
    equals($(".ui-slider-pre").length, 1, "pre Arr shows");
    equals($(".ui-slider-next").length, 1, "next Arr shows");
    equals($(".ui-slider-dots b").length, 4, "Dots show");
    equals($('.ui-slider-wheel').offset().left, 0,"第一张图片显示");

    ta.touchstart($(".ui-slider-wheel")[0], {
        touches: [{
            clientX: 0,
            clientY: 0
        }]
    });
    ta.touchmove($(".ui-slider-wheel")[0], {
        touches:[{
            clientX: -15,
            clientY: 0
        }]
    });
    ta.touchend($(".ui-slider-wheel")[0]);
});

test("destroy()", function() {
    ua.destroyTest(function(w,f){
        var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        var slider = w.$.ui.slider({
            content: content3
        });
        slider.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(slider);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2,"The dom is ok");   //测试结果不是100%可靠，可忽略
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The slider is destroy");
        this.finish();
    });
});
