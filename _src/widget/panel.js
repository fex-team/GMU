/**
 * @file panel组件
 * @ignore
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/panel/panel.html</qrcode>
 * @desc 面板组件
 * @name Panel
 * @import core/touch.js, core/zepto.ui.js
 */
(function ($, undefined) {
    var cssPrefix = $.fx.cssPrefix;
    /**
     * @name $.ui.panel
     * @grammar $('.panel').panel() ⇒ self
     * --该组件不支持create模式，只有setup模式--
     * @desc **Options**
     * - ''contentWrap'' {Dom/Zepto/selector}: (可选，默认：true)主体内容dom
     * - ''scrollMode'' {String}: (可选，默认：true)'follow |'disappear' | 'fixed'   Panel滑动方式，follow表示跟随页面滑动，disappear表示页面滑动时panel消失
     * - ''animate'' {Boolean}: (可选，默认：true)Panel出现时是否有动画
     * - ''display'' {String}: (可选，默认：true)'overlay' | 'reveal' | 'push' Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
     * - ''position'' {String}: (可选)left' | 'right' 在右边或左边
     * - ''dismissible'' {Boolean}: (render模式下必填)是否在内容区域点击后，panel消失
     * - ''swipeClose'' {Boolean}: (可选，默认: 300)在panel上滑动，panel是否关闭
     * - ''offset'' {Object}: (可选，默认: \'auto\')相对于contentWrap的offset
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
     * <codepreview href="../gmu/_examples/widget/panel/panel.html">
     * ../gmu/_examples/widget/panel/panel.html
     * </codepreview>
     */

    $.ui.define('panel', {
        _data: {
            contentWrap: '',       //若不传，则默认为panel的next节点
            scrollMode: 'follow',   //'follow |'disappear' | 'fixed'   Panel滑动方式，follow表示跟随页面滑动，disappear表示页面滑动时panel消失
            animate: true,
            display: 'push',     //'overlay' | 'reveal' | 'push' Panel出现模式，overlay表示浮层reveal表示在content下边展示，push表示panel将content推出
            position: 'right',    //'left' | 'right' 在右边或左边
            dismissible: true,
            swipeClose: true,
            offset: {x:0, y:0},     //相对于contentWrap的offset
            beforeopen: null,
            open: null,
            beforeclose: null,
            close: null
        },
        isOpen: false,    //是否打开标志
        _create: function () {
            throw new Exception('panel组件不支持create模式，请使用setup模式');
        },
        _setup: function () {
            var me = this,
                data = me._data,
                $el = me.root().addClass('ui-panel ui-panel-'+ data.position).css('top', data.offset.y);

            me.panelWidth = $el.width() || 0;
            me.$contentWrap = $(data.contentWrap || $el.next());
        },
        _init: function () {
            var me = this,
                data = me._data,
                scrollMode = data.scrollMode;

            me.displayFn = me._setDisplay();
            me.isOpen = true, me.close();   //panel状态初始化
            data.animate && me.$contentWrap.addClass('ui-panel-animate');
            if (scrollMode === 'disappear') {
                $(document).on('scrollStop', $.proxy(me._eventHandler, me));
            } else if (scrollMode === 'fixed'){
                me.root().css({
                    position: 'fixed',
                    top: data.offset.y
                });
            }
        },
        /**
         * 生成display模式函数
         * */
        _setDisplay: function () {
            var me = this,
                $panel = me.root(),
                $contentWrap = me.$contentWrap,
                transform = cssPrefix + 'transform',
                posData = me._transDisplayToPos(),
                obj = {}, panelPos, contPos;

            $.each(['push', 'overlay', 'reveal'], function (i,display) {
                obj[display] = function (isOpen, pos, isClear) {   //isOpen:是打开还是关闭操作，pos:从右或从左打开关闭，isClear:是否是初始化操作
                    panelPos = posData[display].panel, contPos = posData[display].cont;
                    panelPos && $panel.css(transform, 'translate3d(' + me._transDirectionToPos(pos, panelPos[isOpen & 1]) + 'px,0,0)');
                    !isClear && contPos && $contentWrap.css(transform, 'translate3d(' + me._transDirectionToPos(pos, contPos[isOpen & 1]) + 'px,0,0)');
                    return me;
                }
            });
            return obj;
        },
        /**
         * 初始化panel位置，每次打开之前由于位置可能不同，所以均需重置
         * */
        _initPanelPos: function (dis, pos) {
            return this.displayFn[dis](0, pos, true);
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
                panelWidth = me.panelWidth,
                offset = me._data.offset;
            return {
                push: {
                    panel: [-panelWidth-offset.x, 0],    //[from, to] for panel
                    cont: [0, panelWidth]       //[from, to] for contentWrap
                },
                overlay: {
                    panel: [-panelWidth-offset.x, 0],
                    cont: false
                },
                reveal: {
                    panel: [0, 0],
                    cont: [0, panelWidth+offset.x]
                }
            }
        },
        /**
         * 封装zepto的$.contains，zepto中contains当相等是为false
         * */
        _contains: function (parent, target) {
            return parent === target || $.contains(parent, target)
        },
        /**
         * 设置显示或关闭，关闭时的操作，包括模式、方向与需与打开时相同
         * */
        _setShow: function (isOpen, dis, pos) {
            var me = this,
                data = me._data,
                eventName = isOpen ? 'open' : 'close',
                beforeEvent = $.Event('before' + eventName),
                _isOpen = isOpen ? !me.state() : me.state(),
                _eventBinder = isOpen ? 'on' : 'off',
                _eventHandler = isOpen ? $.proxy(me._eventHandler, me) : me._eventHandler,
                _dis = dis || data.display,
                _pos = pos || data.position;

            me.trigger(beforeEvent);
            if (beforeEvent.defaultPrevented) return me;
            if (_isOpen) {
                me._dealState(isOpen, _dis, _pos);    //关闭或显示时，重置状态
                me.displayFn[_dis](me.isOpen = isOpen ? 1 : 0, _pos);   //根据模式和打开方向，操作panel
                data.dismissible && $(document)[_eventBinder]('tap', _eventHandler);    //点击页面panel关闭
                data.swipeClose && me.root()[_eventBinder]($.camelCase('swipe-' + _pos), _eventHandler);     //滑动panel养老
                data.display = _dis, data.position = _pos;
                me.trigger(eventName);
            }
            return me;
        },
        /**
         * 打开或关闭前的状态重置操作，包括样式，位置等
         * */
        _dealState: function (isOpen, dis, pos) {
            var me = this,
                data = me._data,
                $panel = me.root(),
                $contentWrap = me.$contentWrap,
                addCls = 'ui-panel-' + dis + ' ui-panel-' + pos,
                removeCls = 'ui-panel-' + data.display + ' ui-panel-' + data.position + (data.animate ? ' ui-panel-animate' : '');

            if (isOpen) {
                $panel.removeClass(removeCls).addClass(addCls);
                me._initPanelPos(dis, pos), $panel.get(0).clientLeft;   //触发页面reflow，使得ui-panel-animate样式不生效
                if (dis === 'reveal') {
                    me.contPosition = $contentWrap.css('position');
                    $contentWrap.css('position',  'relative');
                } else {
                    data.animate && $panel.addClass('ui-panel-animate');
                }
            } else {
                dis === 'reveal' && $contentWrap.css('position', me.contPosition);   //打开状态时加上position relative，关闭状态时还原position
            }
            return me;
        },
        _eventHandler: function (e) {
            var me = this;
            switch (e.type) {
                case 'tap':
                    !me._contains(me.root().get(0), e.target) && me.close();
                    break;
                case 'swipeLeft':
                case 'swipeRight':
                case 'scrollStop':
                    me.close();
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

})(Zepto);