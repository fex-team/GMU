
/**
 * @file 进度条组件
 * @name Progressbar
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/progresssbar/progresssbar.html</qrcode>
 * 提供一个可调整百分比的进度条
 * @import extend/touch.js, core/widget.js
 */
(function( gmu, $, undefined ) {
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
     * <codepreview href="../examples/widget/progressbar/progressbar.html">
     * ../gmu/examples/widget/progressbar/progressbar.html
     * ../gmu/examples/widget/progressbar/progressbar_demopts.css
     * </codepreview>
     */
    gmu.define('Progressbar', {
        options: {
            initValue:          0,
            horizontal:         true,
            transitionDuration: 300,
            _isShow:            true,
            _current:           0,
            _percent:           0
        },

        _init: function() {
            var me = this,
                $el,
                _eventHandler,
                _button,
                _background,
                _offset;

            me.on( 'ready', function(){
                $el = me.$el,
                _eventHandler = $.proxy(me._eventHandler, me),
                _button = $el.find('.ui-progressbar-button'),
                _background = $el.find('.ui-progressbar-bg'),
                _offset = $el.offset();

                _button.on('touchstart touchmove touchend touchcancel', _eventHandler);
                _background.on('touchstart', _eventHandler);
                $.extend( me._options, {
                    _button:        _button[0],
                    $_background:    _background,
                    _filled:        $el.find('.ui-progressbar-filled')[0],
                    _width:         _offset.width,
                    _height:        _offset.height
                });
                me._options['horizontal'] && _offset.width && $el.width(_offset.width);
                me._options['initValue'] > 0 && me.value( me._options['initValue']);
            } );

            me.on( 'destroy', function() {
                if ( !me._options.setup ) {
                    me.$el.remove();
                }
            } );
        },

        _create: function() {
            var me = this,
                direction = me._options['horizontal'] ? 'h' : 'v';

            if( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me.$el.addClass('ui-progressbar-' + direction).appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)).html(
                ('<div class="ui-progressbar-bg"><div class="ui-progressbar-filled"></div><div class="ui-progressbar-button"><div><b></b></div></div></div>'));
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
                opts = me._options;

            $.extend( me._options, {
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0,          //horizontal moved
                Y:          0           //vertical moved
            });

            opts._button.style.webkitTransitionDuration = '0ms';
            opts._filled.style.webkitTransitionDuration = '0ms';
            $(opts._button).addClass('ui-progressbar-button-pressed');
            me.trigger('dragStart');
        },

        _touchMove: function(e) {
            var me = this,
                opts = me._options,
                touch = e.touches[0],
                X = touch.pageX - opts.pageX,
                Y = touch.pageY - opts.pageY,
                _percent;

            if(!opts.T) {
                var S = Math.abs(X) < Math.abs(touch.pageY - opts.pageY);
                opts.T = true;
                opts.S = S;
            }
            if(opts.horizontal) {
                if(!opts.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent =  (X + opts._current) / opts._width * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        opts._percent = _percent;
                        opts.X = X;
                        opts._button.style.webkitTransform = 'translate3d(' + (opts.X + opts._current) + 'px,0,0)';
                        opts._filled.style.width = _percent + '%';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            } else {
                if(opts.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent = -(opts._current + Y) / opts._height * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        opts._percent = _percent;
                        opts.Y = Y;
                        opts._button.style.webkitTransform = 'translate3d(0,' + (Y + opts._current) + 'px,0)';
                        opts._filled.style.cssText += 'height:' + _percent + '%;top:' + (opts._height + Y + opts._current) + 'px';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            }
        },

        _touchEnd: function() {
            var me = this,
                opts = me._options;

            opts._current += opts.horizontal ? opts.X : opts.Y;
            $(opts._button).removeClass('ui-progressbar-button-pressed');
            me.trigger('dragEnd');
        },

        _click: function(e) {
            var me = this,
                opts = me._options,
                rect = opts.$_background.offset(),
                touch = e.touches[0];

            opts.horizontal ?
                me.value((touch.pageX - rect.left) / opts._width * 100) :
                me.value((opts._height - touch.pageY + rect.top) / opts._height * 100);
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
         * demopts.value();
         * demopts.value(30);
         */
        value: function(value) {
            var me = this,
                opts = me._options,
                _current, duration;

            if(value === undefined) {
                return opts._percent;
            } else {
                value = parseFloat(value);
                if(isNaN(value)) return me;
                value = value > 100 ? 100 : value < 0 ? 0 : value;
                opts._percent = value;
                duration = ';-webkit-transition-duration:' + opts.transitionDuration + 'ms';
                if(opts.horizontal) {
                    _current = opts._current = opts._width * value / 100;
                    opts._button.style.cssText += '-webkit-transform:translate3d(' + _current + 'px,0,0)' + duration;
                    opts._filled.style.cssText += 'width:'+ value + '%' + duration;
                } else {
                    _current = opts._current = opts._height * value / -100;
                    opts._button.style.cssText += '-webkit-transform:translate3d(0,' + _current + 'px,0)' + duration;
                    opts._filled.style.cssText += 'height:' + value + '%;top:' + (opts._height + _current) + 'px' + duration;
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

            if(!me._options['_isShow']){
                me.$el.css('display', 'block');
                me._options['_isShow'] = true;
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

            if(me._options['_isShow']) {
                me.$el.css('display', 'none');
                me._options['_isShow'] = false;
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
})( gmu, gmu.$ );
