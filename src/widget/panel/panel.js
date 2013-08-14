/**
 * @file panel组件
 * @import extend/touch.js, core/widget.js, extend/throttle.js, extend/event.scrollStop.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd;
    /**
     * panel组件
     *
     * @class Panel
     * @constructor Html部分
     * ```html
     * <div id="page">
     *     <div class="cont">panel内容</div>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('.panel').panel({
     *     contentWrap: $('.cont')
     * });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Panel的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Panel:options)
     * @grammar $( el ).panel( options ) => zepto
     * @grammar new gmu.Panel( el, options ) => instance
     */
    
    gmu.define( 'Panel', {
        options: {

            /**
             * @property {Dom | Zepto | selector} [contentWrap=''] 主体内容dom，若不传，则默认为panel的next节点
             * @namespace options
             */
            contentWrap: '',

            /**
             * @property {String} [scrollMode='follow'] Panel滑动方式，follow表示跟随页面滑动，hide表示页面滑动时panel消失, fix表示panel固定在页面中
             * @namespace options
             */
            scrollMode: 'follow',

            /**
             * @property {String} [display='push'] 可选值：('overlay' | 'reveal' | 'push') Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
             * @namespace options
             */
            display: 'push',

            /**
             * @property {String} [position='right'] 可选值：('left' | 'right'） 在右边或左边
             * @namespace options
             */
            position: 'right',

            /**
             * @property {Boolean} [dismissible=true] (render模式下必填)是否在内容区域点击后，panel消失
             * @namespace options
             */
            dismissible: true,

            /**
             * @property {Boolean} [swipeClose=true] 在panel上滑动，panel是否关闭
             * @namespace options
             */
            swipeClose: true
        },

        _init: function () {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                me.displayFn = me._setDisplay();
                me.$contentWrap.addClass('ui-panel-animate');
                me.$el.on(transitionEnd, $.proxy(me._eventHandler, me)).hide();  //初始状态隐藏panel
                opts.dismissible && me.$panelMask.hide().on('click', $.proxy(me._eventHandler, me));    //绑定mask上的关闭事件
                opts.scrollMode !== 'follow' && $(window).on('scrollStop', $.proxy(me._eventHandler, me));
                $(window).on('ortchange', $.proxy(me._eventHandler, me));
            } );
        },

        _create: function () {
            if(this._options.setup){
                var me = this,
                    opts = me._options,
                    $el = me.$el.addClass('ui-panel ui-panel-'+ opts.position);

                me.panelWidth = $el.width() || 0;
                me.$contentWrap = $(opts.contentWrap || $el.next());
                opts.dismissible && ( me.$panelMask = $('<div class="ui-panel-dismiss"></div>').width(document.body.clientWidth - $el.width()).appendTo('body') || null);
            }else{
                throw new Error('panel组件不支持create模式，请使用setup模式');
            }
        },
        
        /**
         * 生成display模式函数
         * */
        _setDisplay: function () {
            var me = this,
                $panel = me.$el,
                $contentWrap = me.$contentWrap,
                transform = cssPrefix + 'transform',
                posData = me._transDisplayToPos(),
                obj = {}, panelPos, contPos;

            $.each(['push', 'overlay', 'reveal'], function (i,display) {
                obj[display] = function (isOpen, pos, isClear) {   //isOpen:是打开还是关闭操作，pos:从右或从左打开关闭，isClear:是否是初始化操作
                    panelPos = posData[display].panel, contPos = posData[display].cont;
                    $panel.css(transform, 'translate3d(' + me._transDirectionToPos(pos, panelPos[isOpen]) + 'px,0,0)');
                    if (!isClear) {
                        $contentWrap.css(transform, 'translate3d(' + me._transDirectionToPos(pos, contPos[isOpen]) + 'px,0,0)');
                        me.maskTimer = setTimeout(function () {      //防止外界注册tap穿透，故做了延迟
                            me.$panelMask && me.$panelMask.css(pos, $panel.width()).toggle(isOpen);
                        }, 400);    //改变mask left/right值
                    }
                    return me;
                }
            });
            return obj;
        },
        /**
         * 初始化panel位置，每次打开之前由于位置可能不同，所以均需重置
         * */
        _initPanelPos: function (dis, pos) {
            this.displayFn[dis](0, pos, true);
            this.$el.get(0).clientLeft;    //触发页面reflow，使得ui-panel-animate样式不生效
            return this;
        },
        /**
         * 将位置（左或右）转化为数值
         * */
        _transDirectionToPos: function (pos, val) {
            return pos === 'left' ? val : -val;
        },
        /**
         * 将打开模式（push,overlay,reveal）转化为数值
         * */
        _transDisplayToPos: function () {
            var me = this,
                panelWidth = me.panelWidth;
            return {
                push: {
                    panel: [-panelWidth, 0],    //[from, to] for panel
                    cont: [0, panelWidth]       //[from, to] for contentWrap
                },
                overlay: {
                    panel: [-panelWidth, 0],
                    cont: [0, 0]
                },
                reveal: {
                    panel: [0, 0],
                    cont: [0, panelWidth]
                }
            }
        },
        /**
         * 设置显示或关闭，关闭时的操作，包括模式、方向与需与打开时相同
         * */
        _setShow: function (isOpen, dis, pos) {
            var me = this,
                opts = me._options,
                eventName = isOpen ? 'open' : 'close',
                beforeEvent = $.Event('before' + eventName),
                changed = isOpen !== me.state(),
                _eventBinder = isOpen ? 'on' : 'off',
                _eventHandler = isOpen ? $.proxy(me._eventHandler, me) : me._eventHandler,
                _dis = dis || opts.display,
                _pos = pos || opts.position;

            me.trigger(beforeEvent, [dis, pos]);
            if (beforeEvent.isDefaultPrevented()) return me;
            if (changed) {
                me._dealState(isOpen, _dis, _pos);    //关闭或显示时，重置状态
                me.displayFn[_dis](me.isOpen = Number(isOpen), _pos);   //根据模式和打开方向，操作panel
                opts.swipeClose && me.$el[_eventBinder]($.camelCase('swipe-' + _pos), _eventHandler);     //滑动panel关闭
                opts.display = _dis, opts.position = _pos;
            }
            return me;
        },
        /**
         * 打开或关闭前的状态重置操作，包括样式，位置等
         * */
        _dealState: function (isOpen, dis, pos) {
            var me = this,
                opts = me._options,
                $panel = me.$el,
                $contentWrap = me.$contentWrap,
                addCls = 'ui-panel-' + dis + ' ui-panel-' + pos,
                removeCls = 'ui-panel-' + opts.display + ' ui-panel-' + opts.position + ' ui-panel-animate';

            if (isOpen) {
                $panel.removeClass(removeCls).addClass(addCls).show();
                opts.scrollMode === 'fix' && $panel.css('top', $(window).scrollTop());    //fix模式下
                me._initPanelPos(dis, pos);      //panel及contentWrap位置初始化
                if (dis === 'reveal') {
                    $contentWrap.addClass('ui-panel-contentWrap').on(transitionEnd, $.proxy(me._eventHandler, me));    //reveal模式下panel不触发transitionEnd;
                } else {
                    $contentWrap.removeClass('ui-panel-contentWrap').off(transitionEnd, $.proxy(me._eventHandler, me));
                    $panel.addClass('ui-panel-animate');
                }
                me.$panelMask && me.$panelMask.css({     //panel mask状态初始化
                    'left': 'auto',
                    'right': 'auto',
                    'height': document.body.clientHeight
                });
            }
            return me;
        },

        _eventHandler: function (e) {
            var me = this,
                opts = me._options,
                scrollMode = opts.scrollMode,
                eventName = me.state() ? 'open' : 'close';

            switch (e.type) {
                case 'click':
                case 'swipeLeft':
                case 'swipeRight':
                    me.close();
                    break;
                case 'scrollStop':
                    scrollMode === 'fix' ? me.$el.css('top', $(window).scrollTop()) : me.close();
                    break;
                case transitionEnd:
                    me.trigger(eventName, [opts.display, opts.position]);
                    break;
                case 'ortchange':   //增加转屏时对mask的处理
                    me.$panelMask && me.$panelMask.css('height', document.body.clientHeight);
                    scrollMode === 'fix' && me.$el.css('top', $(window).scrollTop());     //转并重设top值
                    break;
            }
        },
        
        /**
         * 打开panel
         * @method open
         * @param {String} [display] 可选值：('overlay' | 'reveal' | 'push')，默认为初始化时设置的值，Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
         * @param {String} position 可选值：('left' | 'right'），默认为初始化时设置的值，在右边或左边
         * @chainable
         * @return {self} 返回本身。
         */
        open: function (display, position) {
            return this._setShow(true, display, position);
        },
        
        /**
         * 关闭panel
         * @method close
         * @chainable
         * @return {self} 返回本身。
         */
        close: function () {
            return this._setShow(false);
        },
        
        /**
         * 切换panel的打开或关闭状态
         * @method toggle
         * @param {String} [display] 可选值：('overlay' | 'reveal' | 'push')，默认为初始化时设置的值，Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
         * @param {String} position 可选值：('left' | 'right'），默认为初始化时设置的值，在右边或左边
         * @chainable
         * @return {self} 返回本身。
         */
        toggle: function (display, position) {
            return this[this.isOpen ? 'close' : 'open'](display, position);
        },
        
        /**
         * 获取当前panel状态，打开为true,关闭为false
         * @method state
         * @chainable
         * @return {self} 返回本身。
         */
        state: function () {
            return !!this.isOpen;
        },
        
        /**
         * 销毁组件
         * @method destroy
         */
        destroy:function () {
            this.$panelMask && this.$panelMask.off().remove();
            this.maskTimer && clearTimeout(this.maskTimer);
            this.$contentWrap.removeClass('ui-panel-animate');
            $(window).off('scrollStop', this._eventHandler);
            $(window).off('ortchange', this._eventHandler);
            return this.$super('destroy');
        }
        
        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */
        
        /**
         * @event beforeopen
         * @param {Event} e gmu.Event对象
         * @description panel打开前触发，可以通过e.preventDefault()来阻止
         */
        
        /**
         * @event open
         * @param {Event} e gmu.Event对象
         * @description panel打开后触发
         */
        
        /**
         * @event beforeclose
         * @param {Event} e gmu.Event对象
         * @description panel关闭前触发，可以通过e.preventDefault()来阻止
         */
        
        /**
         * @event close
         * @param {Event} e gmu.Event对象
         * @description panel关闭后触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });

})( gmu, gmu.$ );
