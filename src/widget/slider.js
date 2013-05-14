
/**
 * @file 图片轮播组件
 * @name Slider
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/slider/slider.html</qrcode>
 * 图片轮播组件
 * @import core/touch.js, core/zepto.extend.js, core/zepto.ui.js
 */

(function($, undefined) {
    /**
     * @name       $.ui.slider
     * @grammar    $.ui.slider(el [,options]) => instance
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''container'' {selector|zepto}: (可选)放置的父容器
     * - ''content'' {Array}: (必选)内容,格式为：\[ {href:'图片跳转URL', pic:'图片路径', title:'图片下方文字'}, {...}\]
     * - ''viewNum'' {Number}: (可选, 默认:1) 可以同时看到几张图片
     * - ''imgInit'' {Number}: (可选, 默认:2)初始加载几张图片
     * - ''itemRender'' {Function}: (可选)render模式时，使用的自定义内容构造函数，接受一个从0开始的index参数，返回空值时构造结束
     * - ''imgZoom'' {Boolean}: (可选, 默认:false)是否缩放图片,设为true时可以将超出边界的图片等比缩放
     * - ''loop'' {Boolean}: (可选, 默认:false)设为true时,播放到最后一张时继续正向播放第一张(无缝滑动)，设为false则反向播放倒数第2张
     * - ''stopPropagation'' {Boolean}: (可选, 默认:false)是否在横向滑动的时候阻止冒泡(慎用,会导致上层元素接受不到touchMove事件)
     * - ''springBackDis'' {Number}: (可选, 默认:15)滑动能够回弹的最大距离
     * - ''autoPlay'' {Boolean}: ((可选, 默认:true)是否自动播放
     * - ''autoPlayTime'' {Number}: (可选, 默认:4000ms)自动播放的间隔
     * - ''animationTime'' {Number}: (可选, 默认:400ms)滑动动画时间
     * - ''showArr'' {Boolean}: (可选, 默认:true)是否展示上一个下一个箭头
     * - ''showDot'' {Boolean}: (可选, 默认:true)是否展示页码
     * - ''slide'' {Function}: (可选)开始切换页面时执行的函数,第1个参数为Event对象,第2个参数为滑动后的page页码
     * - ''slideend'' {Function}: (可选)页面切换完成(滑动完成)时执行的函数,第1个参数为Event对象,第2个参数为滑动后的page页码
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/slider/slider.html">
     * ../gmu/_examples/widget/slider/slider.html
     * </codepreview>
     */
    $.ui.define('slider', {
        _data:{
            viewNum:                1,
            imgInit:                2,
            itemRender:             null,
            imgZoom:                false,
            loop:                   false,
            stopPropagation:        false,
            springBackDis:          15,
            autoPlay:               true,
            autoPlayTime:           4000,
            animationTime:          400,
            showArr:                true,
            showDot:                true,
            slide:                  null,
            slideend:               null,
            index:                  0,
            _stepLength:            1,
            _direction:             1
        },

        _create:function() {
            var me = this,
                i = 0, j, k = [],
                content = me.data('content');
            me._initConfig();
            (me.root() || me.root($('<div></div>'))).addClass('ui-slider').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body)).html(
            '<div class="ui-slider-wheel"><div class="ui-slider-group">' +
            (function() {
                if(me.data('itemRender')) {
                    var render = me.data('itemRender');
                    while(j = render.call(me, i++)) k.push('<div class="ui-slider-item">' + j + '</div>');
                } else {
                    while(j = content[i++]) k.push('<div class="ui-slider-item"><a href="' + j.href + '"><img lazyload="' + j.pic + '"/></a>' + (j.title ? '<p>' + j.title + '</p>': '') + '</div>');
                }
                k.push(me.data('loop') ? '</div><div class="ui-slider-group">' + k.join('') + '</div></div>' : '</div></div>');
                return k.join('');
            }()));
            me._addDots();
        },

        _setup: function(mode) {
            var me = this,
                root = me.root().addClass('ui-slider');
            me._initConfig();
            if(!mode) {
                var items = root.children(),
                    group = $('<div class="ui-slider-group"></div>').append(items.addClass('ui-slider-item'));
                root.empty().append($('<div class="ui-slider-wheel"></div>').append(group).append(me.data('loop') ? group.clone() : ''));
                me._addDots();
            } else me.data('loop') && $('.ui-slider-wheel', root).append($('.ui-slider-group', root).clone());
        },

        _init:function() {
            var me = this,
                index = me.data('index'),
                root = me.root(),
                _eventHandler = $.proxy(me._eventHandler, me);
            me._setWidth();
            $(me.data('wheel')).on('touchstart touchmove touchend touchcancel webkitTransitionEnd', _eventHandler);
            $(window).on('ortchange', _eventHandler);
            $('.ui-slider-pre', root).on('tap', function() { me.pre() });
            $('.ui-slider-next', root).on('tap', function() { me.next() });
            me.on('destroy',function() {
                clearTimeout(me.data('play'));
                $(window).off('ortchange', _eventHandler);
            });
            me.data('autoPlay') && me._setTimeout();
        },

        /**
         * 初始化参数配置
         */
        _initConfig: function() {
            var o = this._data;
            if(o.viewNum > 1) {
                o.loop = false;
                o.showDot = false;
                o.imgInit = o.viewNum + 1;
            }
        },

        /**
         * 添加底部圆点及两侧箭头
         */
        _addDots:function() {
            var me = this,
                root = me.root(),
                length = $('.ui-slider-item', root).length / (me.data('loop') ? 2 : 1),
                html = [];
            if(me.data('showDot')) {
                html.push('<p class="ui-slider-dots">');
                while(length--) html.push('<b></b>');
                html.push('</p>');
            }
            me.data('showArr') && (html.push('<span class="ui-slider-pre"><b></b></span><span class="ui-slider-next"><b></b></span>'));
            root.append(html.join(''));
        },
        /**
         * 设置轮播条及元素宽度,设置选中dot,设置索引map,加载图片
         */
        _setWidth:function(){
            var me = this,
                o = me._data,
                root = me.root(),
                width = Math.ceil(root.width() / o.viewNum),
                height = root.height(),
                loop = o.loop,
                items = $('.ui-slider-item', root).toArray(),
                length = items.length,
                wheel = $('.ui-slider-wheel', root).width(width * length)[0],
                dots = $('.ui-slider-dots b', root).toArray(),
                allImgs = $('img', root).toArray(),
                lazyImgs = allImgs.concat(),
                dotIndex = {}, i, j,
                l = o.imgInit || length;
            o.showDot && (dots[0].className = 'ui-slider-dot-select');
            if(o.imgZoom) $(lazyImgs).on('load', function() {
                var h = this.height,
                    w = this.width,
                    min_h = Math.min(h, height),
                    min_w = Math.min(w, width);
                if(h/height > w/width) this.style.cssText += 'height:' + min_h + 'px;' + 'width:' + min_h/h * w + 'px;';
                else this.style.cssText += 'height:' + min_w/w * h + 'px;' + 'width:' + min_w + 'px';
                this.onload = null;
            });
            for(i = 0; i < length; i++) {
                items[i].style.cssText += 'width:'+ width + 'px;position:absolute;-webkit-transform:translate3d(' + i * width + 'px,0,0);z-index:' + (900 - i);
                dotIndex[i] = loop ? (i > length/2 - 1 ? i - length/2 : i) : i;
                if(i < l) {
                    j = lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if(o.loop) {
                        j = allImgs[i + length/2];
                        j && (j.src = j.getAttribute('lazyload'));
                    }
                }
            }
            me.data({
                root:           root[0],
                wheel:          wheel,
                items:          items,
                lazyImgs:       lazyImgs,
                allImgs:        allImgs,
                length:         length,
                width:          width,
                height:         height,
                dots:           dots,
                dotIndex:       dotIndex,
                dot:            dots[0]
            });
            return me;
        },

        /**
         * 事件管理函数
         */
        _eventHandler:function(e) {
            var me = this;
            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'webkitTransitionEnd':
                    me._transitionEnd();
                    break;
                case 'ortchange':
                    me._resize.call(me);
                    break;
            }
        },

        /**
         * touchstart事件
         */
        _touchStart:function(e) {
            var me = this;
            me.data({
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0           //horizontal moved
            });
            me.data('wheel').style.webkitTransitionDuration = '0ms';
        },

        /**
         * touchmove事件
         */
        _touchMove:function(e) {
            var o = this._data,
                X = o.X = e.touches[0].pageX - o.pageX;
            if(!o.T) {
                var index = o.index,
                    length = o.length,
                    S = Math.abs(X) < Math.abs(e.touches[0].pageY - o.pageY);
                o.loop && (o.index = index > 0 && (index < length - 1) ? index : (index === length - 1) && X < 0 ? length/2 - 1 : index === 0 && X > 0 ? length/2 : index);
                S || clearTimeout(o.play);
                o.T = true;
                o.S = S;
            }
            if(!o.S) {
                o.stopPropagation && e.stopPropagation();
                e.preventDefault();
                o.wheel.style.webkitTransform = 'translate3d(' + (X - o.index * o.width) + 'px,0,0)';
            }
        },

        /**
         * touchend事件
         */
        _touchEnd:function() {
            var me = this,
                o = me._data;
            if(!o.S) {
                var distance = o.springBackDis,
                stepLength = o.X <= -distance ? Math.ceil(-o.X / o.width) : (o.X > distance) ? -Math.ceil(o.X / o.width) : 0;
                o._stepLength = Math.abs(stepLength);
                me._slide(o.index + stepLength);
            }
        },

        /**
         * 轮播位置判断
         */
        _slide:function(index, auto) {
            var me = this,
                o = me._data,
                length = o.length,
                end = length - o.viewNum + 1;
            if(-1 < index && index < end) {
                me._move(index);
            } else if(index >= end) {
                if(!o.loop) {
                    me._move(end - (auto ? 2 : 1));
                    o._direction = -1;
                } else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length/2 - 1) * o.width + 'px,0,0);';
                    o._direction =  1;
                    $.later(function() {me._move(length/2)}, 20);
                }
            } else {
                if(!o.loop) me._move(auto ? 1 : 0);
                else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length/2) * o.width + 'px,0,0);';
                    $.later(function() {me._move(length/2 - 1)}, 20);
                }
                o._direction =  1;
            }
            return me;
        },

        /**
         * 轮播方法
         */
        _move:function(index) {
            var o = this._data,
                dotIndex = o.dotIndex[index];
            this.trigger('slide', dotIndex);
            if(o.lazyImgs.length) {
                var j = o.allImgs[index];
                j && j.src || (j.src = j.getAttribute('lazyload'));
            }
            if(o.showDot) {
                o.dot.className = '';
                o.dots[dotIndex].className = 'ui-slider-dot-select';
                o.dot = o.dots[dotIndex];
            }
            o.index = index;
            o.wheel.style.cssText += '-webkit-transition:' + o.animationTime + 'ms;-webkit-transform:translate3d(-' + index * o.width + 'px,0,0);';
        },

        /**
         * 滑动结束
         */
        _transitionEnd:function() {
            var me = this,
                o = me._data;
            me.trigger('slideend', o.dotIndex[o.index]);
            if(o.lazyImgs.length){
                for(var length = o._stepLength, i = 0; i< length; i++) {
                    var j = o.lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if(o.loop) {
                        j = o.allImgs[o.index + o.length / 2];
                        j && !j.src && (j.src = j.getAttribute('lazyload'));
                    }
                }
                o._stepLength = 1;
            }
            me._setTimeout();
        },

        /**
         * 设置自动播放
         */
        _setTimeout:function() {
            var me = this, o = me._data;
            if(!o.autoPlay) return me;
            clearTimeout(o.play);
            o.play = $.later(function() {
                me._slide.call(me, o.index + o._direction, true);
            }, o.autoPlayTime);
            return me;
        },

        /**
         * 重设容器及子元素宽度
         */
        _resize:function() {
            var me = this,
                o = me._data,
                width = o.root.offsetWidth / o.viewNum, //todo 添加获取隐藏元素大小的方法
                length = o.length,
                items = o.items;
            if(!width) return me;
            o.width = width;
            clearTimeout(o.play);
            for(var i = 0; i < length; i++) items[i].style.cssText += 'width:' + width + 'px;-webkit-transform:translate3d(' + i * width + 'px,0,0);';
            o.wheel.style.removeProperty('-webkit-transition');
            o.wheel.style.cssText += 'width:' + width * length + 'px;-webkit-transform:translate3d(-' + o.index * width + 'px,0,0);';
            o._direction = 1;
            me._setTimeout();
            return me;
        },

        /**
         * @desc 滚动到上一张
         * @name pre
         * @grammar pre() => self
         *  @example
         * //setup mode
         * $('#slider').slider('pre');
         *
         * //render mode
         * var demo = $.ui.slider();
         * demo.pre();
         */
        pre:function() {
            var me = this;
            me._slide(me.data('index') - 1);
            return me;
        },

        /**
         * @desc 滚动到下一张
         * @name next
         * @grammar next() => self
         *  @example
         * //setup mode
         * $('#slider').slider('next');
         *
         * //render mode
         * var demo = $.ui.slider();
         * demo.next();
         */
        next:function() {
            var me = this;
            me._slide(me.data('index') + 1);
            return me;
        },

        /**
         * @desc 停止自动播放
         * @name stop
         * @grammar stop() => self
         *  @example
         * //setup mode
         * $('#slider').slider('stop');
         *
         * //render mode
         * var demo = $.ui.slider();
         * demo.stop();
         */
        stop:function() {
            var me = this;
            clearTimeout(me.data('play'));
            me.data('autoPlay', false);
            return me;
        },

        /**
         * @desc 恢复自动播放
         * @name resume
         * @grammar resume() => self
         *  @example
         * //setup mode
         * $('#slider').slider('resume');
         *
         * //render mode
         * var demo = $.ui.slider();
         * demo.resume();
         */
        resume:function() {
            var me = this;
            me.data('_direction',1);
            me.data('autoPlay', true);
            me._setTimeout();
            return me;
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | slide | event | 开始切换页面时执行的函数，参数为滑动后的page页码 |
         * | slideend | event | 页面切换完成(滑动完成)时执行的函数，参数为滑动后的page页码 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);
