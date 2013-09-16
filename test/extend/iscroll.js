/**
 * Created with JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-7-23
 * Time: 下午4:24
 * To change this template use File | Settings | File Templates.
 */
function createContainer(w) {
    var i = 0, html = [];
    w.$("body").append("<div id='container' style='height:10000px;'></div>");
    //创建dom
    while (i++ < 5) {
        html.push('<p>' + i
            + '爱因斯坦（1879－1955），美籍德国犹太人。他创立了代表现代科学的相对论，并为核能开发奠定了理论基础，在现代科学技术和他的深刻影响及广泛应用方面开创了现代科学新纪元，被公认为自伽利略、牛顿以来最伟大的'
            + '科学家、思想家。1921年诺贝尔物理学奖获得者。现代物理学的开创者和奠基人，相对论——“质能关系”的提出者，“决定论量子力学诠释”的捍卫者（振动的粒子）——不掷骰子的上帝。1999年12月26日，爱因斯坦被美国《时代周刊》评选为“世纪伟人”。'
            + '<br/><br/><br/><br/><br/><br/><br/><br/><br/></p>'
        );
    }
    w.$('#container').append(html.join(' '));
}

test("desable", function () {
    expect(1);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var scroll_ = $wrapper.iScroll();
    var offsetBefore = $('#content').offset()['top'];
    scroll_.iScroll('disable');
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });

        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
            setTimeout(function () {
                equal($('#content').offset()['top'], offsetBefore, '设disable,不滚动');
                $wrapper.remove();
                window.$('#container').remove();
                scroll_.iScroll('destroy');
                start();
            }, 200);
        }, 300);
    }, 200);
});
test("isReady&&topOffset&&start和move之间加入时间差", function () {
    expect(3);
    stop();
    $('<div id="container" style="height:10000px;"></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(500));
    var scroll_ = $wrapper.iScroll({
        topOffset: 10,
        onScrollEnd: function () {
            equal(offsetBefore - $('#container').offset()['top'], 10, ' 正常滚动');
            equal(scroll_.iScroll('isReady'), true, '');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });

    var offsetBefore = $('#container').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        setTimeout(function () {
            ta.touchmove($scroller[0], {
                touches: [
                    {
                        pageX: 0,
                        pageY: 400
                    }
                ]
            });
            ua.mousemove($scroller[0], {
                clientX: 0,
                clientY: 400//todo 这里改成-200,结果也是10??
            });
            setTimeout(function () {
                equal(scroll_.iScroll('isReady'), false, '');
                ta.touchend($scroller[0]);
                ua.mouseup($scroller[0]);
            }, 300);
        }, 400);
    }, 200);
});
test("iscroll --hScroll&&outside of the boundaries", function () {
    expect(1);
    stop();
    $('<div id="container" style="width:400px;"></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').width(300));
    var scroll_ = $wrapper.iScroll({
        onScrollEnd: function () {
            equal(offsetBefore - $('#container').offset()['left'], 200 / 2, '横向滚动&&超出边界,且正好滑动停止到边界处,滑动距离:200/2');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });
    var offsetBefore = $('#container').offset()['left'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 200,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });

        ua.mousedown($scroller[0], {
            clientX: 200,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
        }, 300);
    }, 200);
});
test("iscroll -- that.moved==false&&end", function () {
    //移动的时候停止
    //todo 待确认
    expect(1);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var scroll_ = $wrapper.iScroll({
        useTransition: false,
        onScrollEnd: function () {
            ok(1, '不应该触发这条断言');
        }
    });
    var offsetBefore = $('#content').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        scroll_.iScroll('stop');
        ta.touchend($scroller[0]);
        ua.mouseup($scroller[0]);
        setTimeout(function () {
            ok($('#content').offset()['top'] < offsetBefore, '有滑动');
            $wrapper.remove();
            window.$('#container').remove();
            scroll_.iScroll('destroy');
            start();
        }, 200);
    }, 200);
});
test("enable", function () {
    expect(1);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var scroll_ = $wrapper.iScroll({
        onScrollEnd: function () {
            equal(offsetBefore - $('#content').offset()['top'], 400, 'enable 正常滚动');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });
    scroll_.iScroll('disable');
    scroll_.iScroll('enable');
    var offsetBefore = $('#content').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
        }, 300);
    }, 200);
});
test("iscroll -- useTransform:false", function () {
    expect(1);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var scroll_ = $wrapper.iScroll({useTransform: false,
        onScrollEnd: function () {
            equal(offsetBefore - $('#content').offset()['top'], 400, ' 正常滚动');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }});
    var offsetBefore = $('#content').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
        }, 300);
    }, 200);
});
test("iscroll --- checkDOMChanges: true", function () {
    //todo 不知道这里理解的对不对
    expect(2);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var reposFlag = 0;
    var scroll_ = $wrapper.iScroll({
        checkDOMChanges: true,
        onScrollEnd: function () {
            if (reposFlag == 0) {
                equal(offsetBefore - $('#content').offset()['top'], 400, ' 正常滚动');
                window.$('#container').html('<div id="content"><p><br/></p></div>');//改变内容
                reposFlag = 1;
            }
            else {
                equal(offsetBefore - $('#content').offset()['top'], 0, '内容空了,offset 变成原始值');
                $wrapper.remove();
                window.$('#container').remove();
                this.destroy();
                start();
            }
        }
    });
    var offsetBefore = $('#content').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
        }, 300);
    }, 200);
});
test("scrollToElement", function () {
    expect(1);
    stop();
    $('<div id="container" style="height:10000px;"><div id="content1"  style="height:500px"></div><br/><div id="content2"  style="height:10px"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var scroll_ = $wrapper.iScroll({
        onScrollEnd: function () {
            equal($('#content2').offset()['top'], $('#wrapper').offset()['top'], '滚动到指定元素');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });
    scroll_.iScroll('scrollToElement', '#content2', 100);
});
test("scrollToPage", function () {
    expect(2);
    stop();
    $('<div id="container" style="height:10000px;width:10000px;"><div id="content"  "></div></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200).width(200));
    var scroll_ = $wrapper.iScroll({
        onScrollEnd: function () {
            equal(offsetTopBefore - $('#container').offset()['top'], 200 * 0.1, '滚动到指定元素');
            equal(offsetLeftBefore - $('#container').offset()['left'], 200 * 0.1, '滚动到指定元素');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });
    var offsetTopBefore = $('#container').offset()['top'];
    var offsetLeftBefore = $('#container').offset()['left'];
    scroll_.iScroll('scrollToPage', 0.1, 0.1);
});
test("scrollToPage--超出范围", function () {
    expect(2);
    stop();
    $('<div id="container" style="height:300px;width:300px;"><div id="content"  "></div></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200).width(200));
    var scroll_ = $wrapper.iScroll({
        onScrollEnd: function () {
            equal(offsetTopBefore - $('#container').offset()['top'], 300 - 200, '超出范围最多滚到边界');
            equal(offsetLeftBefore - $('#container').offset()['left'], 300 - 200, '超出范围最多滚到边界');
            $wrapper.remove();
            window.$('#container').remove();
            this.destroy();
            start();
        }
    });
    var offsetTopBefore = $('#container').offset()['top'];
    var offsetLeftBefore = $('#container').offset()['left'];
    scroll_.iScroll('scrollToPage', 0.9, 0.9);
});
test("事件触发顺序", function () {
    expect(7);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var num = 0;
    var scroll_ = $wrapper.iScroll({

        onBeforeScrollStart: function (e) {
            e.preventDefault();
            equal(num, 0, 'onBeforeScrollStart');
            num++
        },
        onScrollStart: function () {
            equal(num, 1, 'onScrollStart');
            num++
        },
        //todo 这两个触发了很多次
//        onBeforeScrollMove: function () {
//            equal(num, 0, 'onBeforeScrollMove');
//            num++
//        },
//        onScrollMove: function () {
//            equal(num, 0, 'onScrollMove');
//            num++
//        },
        onBeforeScrollEnd: function () {
            equal(num, 2, 'onBeforeScrollEnd');
            num++
        },
        onScrollEnd: function () {
            if (num == 3) {
                equal(offsetBefore - $('#content').offset()['top'], 400, 'enable 正常滚动');
                equal(num, 3, 'onScrollEnd');
                num++;
            }
            else {
                equal(num, 4, 'onScrollEnd');
                num++;
                $wrapper.remove();
                window.$('#container').remove();
                this.destroy();
            }
        },
        onTouchEnd: function () {
            if (num == 3) {
                equal(offsetBefore - $('#content').offset()['top'], 400, 'enable 正常滚动');
                equal(num, 3, 'onScrollEnd');
                num++;
            }
            else {
                equal(num, 4, 'onTouchEnd');
                num++;
                $wrapper.remove();
                window.$('#container').remove();
                this.destroy();
            }
        },
        onDestroy: function () {
            equal(num, 5, 'onDestroy');
            start();
        }
    });

    var offsetBefore = $('#content').offset()['top'];
    setTimeout(function () {
        ta.touchstart($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: 200
                }
            ]
        });
        ta.touchmove($scroller[0], {
            touches: [
                {
                    pageX: 0,
                    pageY: -200
                }
            ]
        });
        ua.mousedown($scroller[0], {
            clientX: 0,
            clientY: 200
        });
        ua.mousemove($scroller[0], {
            clientX: 0,
            clientY: -200
        });
        setTimeout(function () {
            ta.touchend($scroller[0]);
            ua.mouseup($scroller[0]);
        }, 300);
    }, 200);
});
test("事件的清除", function () {
    expect(1);
    stop();
    $('<div id="container" ><div id="content"  style="height:10000px;"></div></div>').appendTo(document.body);
    var $scroller = window.$('#container'), $wrapper;
    $scroller.wrap($wrapper = window.$('<div id="wrapper"></div>').height(200));
    var num = 0;
    var scroll_ = $wrapper.iScroll();
    window.$('#container')[0].addEventListener('testEv', function () {
        ok(1, '事件只被触发一次');
    });
    scroll_.iScroll('_bind', 'testEv', window.$('#container')[0]);
    window.$('#container').trigger('testEv');
    setTimeout(function () {
        scroll_.iScroll('destroy');
        setTimeout(function () {
            scroll_.trigger('testEv');//todo _bindArr一直是空的
            setTimeout(function () {
                start();
            }, 20);
        }, 20);
    }, 20);
});