
/**
 * @file 进度条组件
 * @name Progressbar
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/progresssbar/progresssbar.html</qrcode>
 * 提供一个可调整百分比的进度条
 * @import core/touch.js, core/zepto.extend.js, core/zepto.ui.js
 */

(function($, undefined) {
    /**
     * @name     $.ui.progressbar
     * @grammar  $(el).progressbar(options) ⇒ self
     * @grammar  $.ui.progressbar([el [,options]]) =>instance
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''container'' {selector}: (可选，默认：body) 组件容器
     * - ''initValue'' {Number}: (可选，默认：0) 初始值（百分比）
     * - ''horizontal'' {Boolean}: (可选，默认：true) 组件是否为横向(若设为false,则为竖向)
     * - ''transitionDuration'' {Number}: (可选，默认：300) 按钮滑动时动画效果持续的时间,单位为ms,设为0则无动画
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/progressbar/progressbar.html">
     * ../gmu/_examples/widget/progressbar/progressbar.html
     * ../gmu/_examples/widget/progressbar/progressbar_demo.css
     * </codepreview>
     */
    $.ui.define('progressbar', {
        _data: {
            initValue:          0,
            horizontal:         true,
            transitionDuration: 300,
            _isShow:            true,
            _current:           0,
            _percent:           0
        },

        _create: function() {
            var me = this,
                direction = me.data('horizontal') ? 'h' : 'v';
            (me.root() || me.root($('<div></div>'))).addClass('ui-progressbar-' + direction).appendTo(me.data('container') || (me.root().parent().length ? '' : document.body)).html(
            ('<div class="ui-progressbar-bg"><div class="ui-progressbar-filled"></div><div class="ui-progressbar-button"><div><b></b></div></div></div>'));
        },

        _setup: function(mode) {
            mode || this._create();
        },

        _init: function() {
            var me = this,
                root = me.root(),
                _eventHandler = $.proxy(me._eventHandler, me),
                _button = root.find('.ui-progressbar-button'),
                _background = root.find('.ui-progressbar-bg'),
                _offset = root.offset();
            _button.on('touchstart touchmove touchend touchcancel', _eventHandler);
            _background.on('touchstart', _eventHandler);
            me.data({
                _button:        _button[0],
                $_background:    _background,
                _filled:        root.find('.ui-progressbar-filled')[0],
                _width:         _offset.width,
                _height:        _offset.height
            });
            me.data('horizontal') && _offset.width && root.width(_offset.width);
            me.data('initValue') > 0 && me.value( me.data('initValue'));
        },

        _eventHandler: function(e) {
            var me = this;
            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    $(e.target).hasClass('ui-progressbar-bg') ? me._click(e) : me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'tap':
                    me._click(e);
                    break;
            }
        },

        _touchStart: function(e) {
            var me = this,
                o = me._data;
            me.data({
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0,          //horizontal moved
                Y:          0           //vertical moved
            });
            o._button.style.webkitTransitionDuration = '0ms';
            o._filled.style.webkitTransitionDuration = '0ms';
            $(o._button).addClass('ui-progressbar-button-pressed');
            me.trigger('dragStart');
        },

        _touchMove: function(e) {
            var me = this,
                o = me._data,
                touch = e.touches[0],
                X = touch.pageX - o.pageX,
                Y = touch.pageY - o.pageY,
                _percent;
            if(!o.T) {
                var S = Math.abs(X) < Math.abs(touch.pageY - o.pageY);
                o.T = true;
                o.S = S;
            }
            if(o.horizontal) {
                if(!o.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent =  (X + o._current) / o._width * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        o._percent = _percent;
                        o.X = X;
                        o._button.style.webkitTransform = 'translate3d(' + (o.X + o._current) + 'px,0,0)';
                        o._filled.style.width = _percent + '%';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            } else {
                if(o.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent = -(o._current + Y) / o._height * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        o._percent = _percent;
                        o.Y = Y;
                        o._button.style.webkitTransform = 'translate3d(0,' + (Y + o._current) + 'px,0)';
                        o._filled.style.cssText += 'height:' + _percent + '%;top:' + (o._height + Y + o._current) + 'px';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            }
        },

        _touchEnd: function() {
            var me = this,
                o = me._data;
                o._current += o.horizontal ? o.X : o.Y;
            $(o._button).removeClass('ui-progressbar-button-pressed');
            me.trigger('dragEnd');
        },

        _click: function(e) {
            var me = this,
                o = me._data,
                rect = o.$_background.offset(),
                touch = e.touches[0];
            o.horizontal ?
                me.value((touch.pageX - rect.left) / o._width * 100) :
                me.value((o._height - touch.pageY + rect.top) / o._height * 100);
        },

        /**
         * @desc 获取/设置progressbar的值
         * @name value
         * @grammar value() => value   /  value(value) => self
         * @example
         * //setup mode
         * $('#progressbar').progressbar('value');
         * $('#progressbar').progressbar('value', 30);
         *
         * //render mode
         * var demo = $.ui.progressbar();
         * demo.value();
         * demo.value(30);
         */
        value: function(value) {
            var me = this,
                o = me._data,
                _current, duration;
            if(value === undefined) {
                return o._percent;
            } else {
                value = parseFloat(value);
                if(isNaN(value)) return me;
                value = value > 100 ? 100 : value < 0 ? 0 : value;
                o._percent = value;
                duration = ';-webkit-transition-duration:' + o.transitionDuration + 'ms';
                if(o.horizontal) {
                    _current = o._current = o._width * value / 100;
                    o._button.style.cssText += '-webkit-transform:translate3d(' + _current + 'px,0,0)' + duration;
                    o._filled.style.cssText += 'width:'+ value + '%' + duration;
                } else {
                    _current = o._current = o._height * value / -100;
                    o._button.style.cssText += '-webkit-transform:translate3d(0,' + _current + 'px,0)' + duration;
                    o._filled.style.cssText += 'height:' + value + '%;top:' + (o._height + _current) + 'px' + duration;
                }
                me.trigger('valueChange');
                return me;
            }
        },
        /**
         * @desc 显示progressbar
         * @name show
         * @grammar show()  ⇒ self
         */
        show: function() {
            var me = this;
            if(!me.data('_isShow')){
                me.root().css('display', 'block');
                me.data('_isShow', true);
            }
            return me;
        },

        /**
         * @desc 隐藏progressbar
         * @name hide
         * @grammar hide()  ⇒ self
         */
        hide: function() {
            var me = this;
            if(me.data('_isShow')) {
                me.root().css('display', 'none');
                me.data('_isShow', false);
            }
            return me;
        }
        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | dragStart | event | 拖动进度条开始时触发的事件 |
         * | dragMove | event | 拖动进度条过程中触发的事件 |
         * | dragEnd | event | 拖动进度条结束时触发的事件 |
         * | valueChange | event | 隐藏后触发的事件 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });

})(Zepto);
