/**
 * @file panel组件
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/panel/panel_position.html</qrcode>
 * 面板组件
 * @name Panel
 * @import extend/touch.js, core/widget.js, extend/throttle.js
 */
(function( gmu, $, undefined ) {


    /**
        * @name Trigger Events
        * @theme event
        * @desc 扩展的事件
        * - ***scrollStop*** : scroll停下来时触发, 考虑前进或者后退后scroll事件不触发情况。
        * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备，利用css media query实现，解决了转屏延时及orientation事件的兼容性问题
        * @example $(document).on('scrollStop', function () {        //scroll停下来时显示scrollStop
        *     console.log('scrollStop');
        * });
        *
        * $(window).on('ortchange', function () {        //当转屏的时候触发
        *     console.log('ortchange');
        * });
    */
    /** dispatch scrollStop */
    function _registerScrollStop(){
        $(window).on('scroll', $.debounce(80, function() {
            $(document).trigger('scrollStop');
        }, false));
    }
    //在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
    function _touchstartHander() {
        $(window).off('scroll');
        _registerScrollStop();
    }
    _registerScrollStop();
    $(window).on('pageshow', function(e){
        if(e.persisted) {//如果是从bfcache中加载页面
            $(document).off('touchstart', _touchstartHander).one('touchstart', _touchstartHander);
        }
    });


    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd;
    /**
     * @name panel
     * @grammar $('.panel').panel() ⇒ self
     * --该组件不支持create模式，只有setup模式--
     * @desc **Options**
     * - ''contentWrap'' {Dom/Zepto/selector}: (可选，默认：true)主体内容dom
     * - ''scrollMode'' {String}: (可选，默认：follow)'follow |'hide' | 'fix'   Panel滑动方式，follow表示跟随页面滑动，hide表示页面滑动时panel消失, fix表示panel固定在页面中
     * - ''display'' {String}: (可选，默认：push)'overlay' | 'reveal' | 'push' Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
     * - ''position'' {String}: (可选)left' | 'right' 在右边或左边
     * - ''dismissible'' {Boolean}: (render模式下必填)是否在内容区域点击后，panel消失
     * - ''swipeClose'' {Boolean}: (可选，默认: 300)在panel上滑动，panel是否关闭
     * - ''beforeopen'' {Function}: (可选，默认: \'auto\')panel打开前事件，该事件可以被阻止
     * - ''open'' {Function}: (可选，默认: \'auto\')panel打开后前事件
     * - ''beforeclose'' {Function}: (可选，默认: \'auto\')panel关闭前事件，该事件可以被阻止
     * - ''close'' {Function}: (可选，默认: \'auto\')panel关闭后事件
     * **example**
     * <code>//<div id="panel">这是panel</div><div id="content">这是panel</div>
     * $('#panel').panel({contentWrap: '#content'});
     * </code>
     *
     * **Demo**
     * <codepreview href="../examples/widget/panel/panel.html">
     * ../gmu/examples/widget/panel/panel.html
     * </codepreview>
     */

    gmu.define( 'Panel', {
        options: {
            contentWrap: '',       //若不传，则默认为panel的next节点
            scrollMode: 'follow',   //'follow |'hide' | 'fix'   Panel滑动方式，follow表示跟随页面滑动，hide表示页面滑动时panel消失, fix表示panel固定在页面中
            display: 'push',     //'overlay' | 'reveal' | 'push' Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
            position: 'right',    //'left' | 'right' 在右边或左边
            dismissible: true,
            swipeClose: true,
            beforeopen: null,
            open: null,
            beforeclose: null,
            close: null
        },

        _init: function () {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                me.displayFn = me._setDisplay();
                me.$contentWrap.addClass('ui-panel-animate');
                me.$el.on(transitionEnd, $.proxy(me._eventHandler, me)).hide();  //初始状态隐藏panel
                opts.dismissible && me.$panelMask.hide().on('click', $.proxy(me._eventHandler, me));    //绑定mask上的关闭事件
                opts.scrollMode !== 'follow' && $(document).on('scrollStop', $.proxy(me._eventHandler, me));
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
            if (beforeEvent.defaultPrevented) return me;
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
         * @name open
         * @grammar open([display, [position]]) ⇒ self
         * @desc 打开panel, displan,position不传则为初始化时的方式
         * @example
         * $('#panel').panel('open', 'push', 'right');
         */
        open: function (display, position) {
            return this._setShow(true, display, position);
        },
        /**
         * @name close
         * @grammar close() ⇒ self
         * @desc 关闭panel, 只能按上次打开的模式及方向关闭panel
         * @example
         * $('#panel').panel('close');
         */
        close: function () {
            return this._setShow(false);
        },
        /**
         * @name toggle
         * @grammar toggle([display, [position]]) ⇒ self
         * @desc 关闭或打开panel
         * @example
         * $('#panel').panel('toggle','overlay', 'left');
         */
        toggle: function (display, position) {
            return this[this.isOpen ? 'close' : 'open'](display, position);
        },
        /**
         * @name state
         * @grammar state() ⇒ Boolean
         * @desc 获取当前panel状态，打开为true,关闭为false
         * @example
         * $('#panel').panel('state');
         */
        state: function () {
            return !!this.isOpen;
        },
        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            this.$panelMask && this.$panelMask.off().remove();
            this.maskTimer && clearTimeout(this.maskTimer);
            this.$contentWrap.removeClass('ui-panel-animate');
            $(document).off('scrollStop', this._eventHandler);
            $(window).off('ortchange', this._eventHandler);
            return this.$super('destroy');
        }
        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发 |
         * | beforeopen | event | panel打开前触发 |
         * | open | event | panel打开后触发 |
         * | beforeClose | event | panel关闭前触发，可以通过e.preventDefault()来阻止 |
         * | close | event | panel关闭后触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });

})( gmu, gmu.$ );
