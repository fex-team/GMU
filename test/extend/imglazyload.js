var htmlArr = [];
module("zepto.imglazyload");

function createContainer(w){
    var i = 0, html = [];
    w.$("body").append("<div id='container'></div>");
    //创建dom
    while (i++ < 12) {
        html.push('<p>' + i
        + '爱因斯坦（1879－1955），美籍德国犹太人。他创立了代表现代科学的相对论，并为核能开发奠定了理论基础，在现代科学技术和他的深刻影响及广泛应用方面开创了现代科学新纪元，被公认为自伽利略、牛顿以来最伟大的'
        + '科学家、思想家。1921年诺贝尔物理学奖获得者。现代物理学的开创者和奠基人，相对论——“质能关系”的提出者，“决定论量子力学诠释”的捍卫者（振动的粒子）——不掷骰子的上帝。1999年12月26日，爱因斯坦被美国《时代周刊》评选为“世纪伟人”。'
        +  '</p>'
        + '<div class="ui-imglazyload" data-url="../../extend/imglazyload/' + i + '.jpg"></div>');
    }
    w.$('#container').append(html.join(' '));
    w.$('.ui-imglazyload').css({
        height: 220,
        width: 176
    });
    htmlArr = html;
}
function createContainer_img(w){
    var i = 0, html = [];
    w.$("body").append("<div id='container'></div>");
    //创建dom
    while (i++ < 12) {
        html.push('<p>' + i
            + '爱因斯坦（1879－1955），美籍德国犹太人。他创立了代表现代科学的相对论，并为核能开发奠定了理论基础，在现代科学技术和他的深刻影响及广泛应用方面开创了现代科学新纪元，被公认为自伽利略、牛顿以来最伟大的'
            + '科学家、思想家。1921年诺贝尔物理学奖获得者。现代物理学的开创者和奠基人，相对论——“质能关系”的提出者，“决定论量子力学诠释”的捍卫者（振动的粒子）——不掷骰子的上帝。1999年12月26日，爱因斯坦被美国《时代周刊》评选为“世纪伟人”。'
            +  '</p>'
            + '<img class="ui-imglazyload" data-url="../../extend/imglazyload/' + i + '.jpg"/>');
    }
    w.$('#container').append(html.join(' '));
    w.$('.ui-imglazyload').css({
        height: 220,
        width: 176
    });
    htmlArr = html;
}
function createContainer_h(w){
    var i = 0, html = [];
    w.$("body").append("<div id='container' style='width:10000px'></div>");
    //创建dom
    while (i++ < 12) {
        html.push('<div style="display: inline-block;" class="ui-imglazyload" data-url="../../extend/imglazyload/' + i + '.jpg"></div>');
    }
    w.$('#container').append(html.join(' '));
    w.$('.ui-imglazyload').css({
        height: 220,
        width: 176
    });
    htmlArr = html;
}
function getImgsInView (w, $images, scrollTop, placeHolder) {
    var imgs = [],
        winH,
        offset,
        placeHolder = placeHolder || 0,
        scrollTop = scrollTop || 0;
    $images.each(function () {
        winH = w.innerHeight;
        offset = w.$(this).offset();
        if (offset.top + placeHolder <= winH + scrollTop  && offset.top + w.$(this).height() >= scrollTop) {
            imgs.push(this);
        }
    });
    return imgs;
}
function getImgsInView_h (w, $images, scrollLeft, placeHolder) {
    var imgs = [],
        winW,
        offset,
        placeHolder = placeHolder || 0,
        scrollLeft = scrollLeft || 0;
    $images.each(function () {
        winW = w.innerWidth;
        offset = w.$(this).offset();
        if (offset.left + placeHolder <= winW + scrollLeft  && offset.left + w.$(this).width() >= scrollLeft) {
            imgs.push(this);
        }
    });
    return imgs;
}
function getImgsInWrapper (w, $images, $wrapper, placeHolder) {
    var imgs = [],
        offset,wOffset,
        placeHolder = placeHolder || 0;
    $images.each(function () {
        offset = w.$(this).offset();
        wOffset = $wrapper.offset();
        if (offset.top + placeHolder <= wOffset.height + wOffset.top  && offset.top + w.$(this).height() >= wOffset.top) {
            imgs.push(this);
        }
    });
    return imgs;
}
test("图片加载前有占位符", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        setTimeout(function () {
            var $images = w.$('.ui-imglazyload'),   //获取初始状态下在可视区内的图片
                viewImages = getImgsInView(w, $images),
                sucImages = [];
            var placeHolderDiv = document.createElement('div');//background-color: rgb(255, 0, 0)
            $(placeHolderDiv).css('width','400px').css('height','400px').css('background-color', 'rgb(255, 0, 0)');
            $(placeHolderDiv).attr( 'class','holder');

            w.$('.ui-imglazyload').imglazyload({placeHolder:placeHolderDiv}).on('loadcomplete', function () {
                sucImages.push(this);
                ok(~w.$.inArray(this, viewImages), '图片成功加载');
            });
            equal(w.document.getElementsByClassName('holder').length,$images.length,'');
            setTimeout(function () {    //待图片加载完成
                w.scrollTo(0,0);
                w.$('.ui-imglazyload').off();
                w.$('#container').remove();
                me.finish();
            }, 300);
        }, 100);
    });
});
test("初始状态:图片进入可视区能正确加载 (container==img)", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer_img(w);
        setTimeout(function () {
            var $images = w.$('.ui-imglazyload'),   //获取初始状态下在可视区内的图片
                viewImages = getImgsInView(w, $images),
                sucImages = [];
            expect(viewImages.length);

            w.$('.ui-imglazyload').imglazyload().on('loadcomplete', function () {
                    sucImages.push(this);
                    ok(~w.$.inArray(this, viewImages), '图片成功加载');
                });
            setTimeout(function () {    //待图片加载完成
                w.scrollTo(0,0);
                w.$('.ui-imglazyload').off();
                w.$('#container').remove();
                me.finish();
            }, 300);
        }, 100);
    });
});
test("初始状态:图片进入可视区能正确加载 isVertical: false", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer_h(w);
        setTimeout(function () {
            var viewImages = getImgsInView_h(w, w.$('.ui-imglazyload')),
            container = w.$('#container').get(0),
                sucImages = [];
            expect(viewImages.length);

            w.$('.ui-imglazyload').imglazyload({isVertical: false}).on('loadcomplete', function () {
                sucImages.push(this);
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });
            setTimeout(function () {    //待图片加载完成
                w.scrollTo(0,0);
                w.$('.ui-imglazyload').off();
                w.$('#container').remove();
                me.finish();
            }, 300);
        }, 100);
    });
});
test("初始状态:图片进入可视区能正确加载 & threshold", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        setTimeout(function () {
                var $images = w.$('.ui-imglazyload'),   //获取初始状态下在可视区内的图片
                viewImages = getImgsInView(w, $images),
                sucImages = [];
            expect(viewImages.length+1);

            w.$('.ui-imglazyload').imglazyload({
                threshold: 400  // 使用这种方式测试不考虑， 需要根据iframe的尺寸调整threshold的值，来保证用例能够跑通
            }).on('loadcomplete', function () {
                sucImages.push(this);
                sucImages.length > viewImages.length ? ok(true, 'threshold起作用了'): ok(~w.$.inArray(this, viewImages), '图片成功加载');
            });
            setTimeout(function () {    //待图片加载完成
                w.scrollTo(0,0);
                w.$('.ui-imglazyload').off();
                w.$('#container').remove();
                me.finish();
            }, 300);
        }, 100);
    });
});

test("scrollStop:图片进入可视区能正确加载 & loadcomplete", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        setTimeout(function () {
            var viewImages = getImgsInView(w, w.$('.ui-imglazyload')),
                container = w.$('#container').get(0),
                itemH = w.$('p').height() + w.$('.ui-imglazyload').height(),
                n = 2,sucImages = [];
            expect(viewImages.length + n);

            w.$('.ui-imglazyload').imglazyload().on('loadcomplete', function () {
                sucImages.push(this);
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });

            w.$(w).on('scrollStop', function () {
                viewImages = getImgsInView(w, w.$('.ui-imglazyload'), n*itemH, 0);
            });

            setTimeout(function(){
                w.scrollTo(0, n*itemH);
                w.$(w).trigger('scrollStop');
                setTimeout(function () {
                    w.scrollTo(0,0);
                    w.$('.ui-imglazyload').off();
                    w.$('#container').remove();
                    me.finish();
                }, 200);
            }, 200);
        }, 100);
    });
});

test("scroll:图片进入可视区能正确加载 & startLoad", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        setTimeout(function () {
            var viewImages = getImgsInView(w, w.$('.ui-imglazyload')),
                container = w.$('#container').get(0),
                itemH = w.$('p').height() + w.$('.ui-imglazyload').height(),
                n = 6,
                sucImages = [],
                startload = false,
                dis;    //滚动加载的张数

            w.$('.ui-imglazyload').imglazyload({
                startload: function () {
                    !startload && ok(startload = true, 'startload triggered');
                },
                eventName: 'scroll'
            }).on('loadcomplete', function () {
                sucImages.push(this);
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });

            w.$(window).on('scroll', function () {
                viewImages = getImgsInView(w, w.$('.ui-imglazyload'), dis);
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
                        w.$('.ui-imglazyload').off();
                        w.$('#container').remove();
                        me.finish();
                    }, 200);
                }, 200);
            }, 200);
        }, 100);
    });
});

test("refresh:增加图片后能正确加载 & error", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        setTimeout(function () {
        var viewImages = getImgsInView(w, w.$('.ui-imglazyload')),
            container = w.$('#container').get(0),
            itemH = w.$('p').height() + w.$('.ui-imglazyload').height(),
            n = 6,
            sucImages = [],
            startload = false,
            dis, $btn;    //滚动加载的张数

        w.$(container).prepend('<div class="ui-imglazyload" data-url="../../core/imglazyload/aa.jpg"></div>');

        $btn = w.$('<div id="btn">点击我加载新图片</div>').on('click', function () {
            w.$(container).append(htmlArr.join(' '));
            w.$('.ui-imglazyload').imglazyload({
                refresh: true
            }).
                css({
                    height: 220,
                    width: 176
                });

        }).prependTo('body');

        w.$('.ui-imglazyload').imglazyload({
            startload: function () {
                !startload && ok(startload = true, 'startload triggered');
            },
            eventName: 'scroll'
        }).on('error', function () {
                ok(true, 'error triggered');
            }).on('loadcomplete', function () {
                sucImages.push(this);
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });

        w.$(window).on('scroll', function () {
            viewImages = getImgsInView(w, w.$('.ui-imglazyload'), dis);
        });

        setTimeout(function(){
            dis = n*itemH;
            window.scrollTo(0, dis);
            ta.scroll();

            setTimeout(function () {
                $btn.trigger('click');
                equal(w.$('.ui-imglazyload').length + sucImages.length, 25, '点击按钮后，图片添加进来了');

                setTimeout(function(){
                    dis = 2*n*itemH;
                    window.scrollTo(0, dis);
                    ta.scroll();
                    setTimeout(function () {
                        window.scrollTo(0,0);
                        w.$('.ui-imglazyload').off();
                        w.$('#container').remove();
                        me.finish();
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
        }, 50);
    });
});

test("iscroll:初始状态图片在iscroll wrapper区域内能正确加载", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        var script1 = w.document.createElement('script');
        script1.type = 'text/javascript';
        script1.src = '../lib/js/UserAction.js';
        w.document.head.appendChild(script1);
        var script2 = w.document.createElement('script');
        script1.type = 'text/javascript';
        script2.src = '../lib/js/TouchAction.js';
        w.document.head.appendChild(script2);

        ua.importsrc('extend/iscroll', function(){
            var viewImages = [],
                $scroller = w.$('#container'),
                itemH = w.$('p').height() + w.$('.ui-imglazyload').height(),
                n = 3,$wrapper;    //滚动加载的张数
            expect(n);
            $scroller.wrap($wrapper = w.$('<div id="wrapper"></div>'));
            itemH = w.$('p').height() + w.$('.ui-imglazyload').height();
            $wrapper.height(n*itemH);
            viewImages = getImgsInWrapper(w, w.$('.ui-imglazyload'),$wrapper, 0)
            $wrapper.iScroll({
                hScroll: false,
                onScrollEnd: function () {
                    w.$.fn.imglazyload.detect();
                }
            });
            w.$('.ui-imglazyload').imglazyload({
                innerScroll:true,
                container: $wrapper
            }).on('loadcomplete', function () {
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
            });

            setTimeout(function () {
                $wrapper.remove();
                w.$('.ui-imglazyload').off();
                w.$('#container').remove();
                me.finish();
            }, 200);
        }, 'window.iScroll', 'extend/imglazyload', w);
    });
});

test("iscroll:滚动过程中在iscroll wrapper区域内能正确加载", function(){
    stop();
    ua.frameExt(function(w, f){
        var me = this;
        f.style.height = '500px';
        f.style.width = '500px';
        createContainer(w);
        var script1 = w.document.createElement('script');
        script1.type = 'text/javascript';
        script1.src = '../lib/js/UserAction.js';
        w.document.head.appendChild(script1);
        var script2 = w.document.createElement('script');
        script1.type = 'text/javascript';
        script2.src = '../lib/js/TouchAction.js';
        w.document.head.appendChild(script2);

        ua.importsrc('extend/iscroll', function(){
            var viewImages = [],
                $scroller = w.$('#container'),
                itemH = w.$('p').height() + w.$('.ui-imglazyload').height(),
                n = 3,$wrapper;    //滚动加载的张数
            expect(n * 2);

            $scroller.wrap($wrapper = w.$('<div id="wrapper"></div>'));
            itemH = w.$('p').height() + w.$('.ui-imglazyload').height();
            $wrapper.height(n*itemH);
            viewImages = getImgsInWrapper(w, w.$('.ui-imglazyload'),$wrapper, 0);
            var config = new w.Object({
                hScroll: false,
                onScrollEnd: function () {
                    viewImages = getImgsInWrapper(w, w.$('.ui-imglazyload'),$wrapper, 0);
                    w.$.fn.imglazyload.detect();
                }
            });
            config.__proto__ = w.Object.prototype;
            $wrapper.iScroll(config);
            w.$('.ui-imglazyload').imglazyload({
                container: $wrapper
            }).on('loadcomplete', function () {
                ok(~w.$.inArray(this, viewImages), '图片成功加载' + this.getAttribute("data-url"));
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
                        pageY: -1*n*itemH+200
                    }]
                });

                ua.mousedown($scroller[0], {
                    clientX: 0,
                    clientY: 200
                });
                ua.mousemove($scroller[0], {
                    clientX: 0,
                    clientY: -1*n*itemH+200
                });

                setTimeout(function(){
                    ta.touchend($scroller[0]);
                    ua.mouseup($scroller[0]);

                    setTimeout(function () {
                        $wrapper.remove();
                        w.$('.ui-imglazyload').off();
                        w.$('#container').remove();
                        me.finish();
                    }, 500);
                }, 300);
            }, 200);
        }, 'window.iScroll', 'extend/imglazyload', w);
    });
});
