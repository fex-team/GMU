
/**
 * @file 返回顶部组件
 * @name Gotop
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/gotop/gotop.html</qrcode>
 * 提供一个快速回到页面顶部的按钮
 * @import core/zepto.extend.js, core/zepto.ui.js,core/zepto.fix.js
 */
(function($, undefined) {
    /**
     * @name     $.ui.gotop
     * @grammar  $(el).gotop(options) ⇒ self
     * @grammar  $.ui.gotop([el [,options]]) =>instance
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''container'' {selector}: (可选,默认：body) 组件容器
     * - ''useFix'' {Boolean}: (可选, 默认为true), 是否使用固顶效果
     * - ''useHide'' {Boolean}: (可选, 默认为true), 是否在touchmove的时候隐藏gotop图标
     * - ''useAnimation'' {Boolean}: (可选, 默认为true), 返回顶部时是否使用动画,在使用iScroll时,返回顶部的动作由iScroll实例执行,此参数无效
     * - ''position'' {Object}: (可选, 默认为{bottom:10, right:10}), 使用fix效果时，要用的位置参数
     * - ''afterScroll'' {function}: (可选,默认：null) 返回顶部后执行的回调函数
     * - ''iScrollInstance'' {Object}: (可选) 使用iscroll时需要传入iScroll实例，用来判定显示与隐藏
     * - ''disablePlugin'' {Boolean}: (可选,默认：false) 是否禁用插件，当加载了gotop.iscroll.js插件但又不想用该插件时，可传入这个参数来禁用插件
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/gotop/gotop.html">
     * ../gmu/_examples/widget/gotop/gotop.html
     * ../gmu/_examples/widget/gotop/gotop_demo.css
     * </codepreview>
     */
    $.ui.define('gotop', {
        _data: {
            container:          '',
            useFix:             true,
            useHide:            true,
            useAnimation:       false,
            position:           {bottom: 10, right: 10},
        	afterScroll:        null,
            iScrollInstance:    null,
            disablePlugin:      false
        },

        _create: function() {
            var me = this;
            (me.root() || me.root($('<div></div>'))).addClass('ui-gotop').append('<div></div>').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body));
            return me;
        },

        _setup: function(mode) {
            var me = this;
            me._create();
            return me;
        },

        _init: function() {
            var me = this,
                root = me.root(),
                _eventHandler = $.proxy(me._eventHandler, me);
            me.data('useHide') && $(document).on('touchmove', _eventHandler);
            $(document).on('touchend touchcancel scrollStop', _eventHandler);
            $(window).on('scroll ortchange', _eventHandler);
            root.on('click', _eventHandler);
            me.on('destroy', function() {
                $(document).off('touchmove touchend touchcancel scrollStop', _eventHandler);
                $(window).off('scroll ortchange', _eventHandler);
            });
            me.data('useFix') && root.fix(me.data('position'));
            me.data('root', root[0]);
            return me;
        },

        /**
         * 事件处理中心
         */
        _eventHandler: function(e) {
            var me = this;
            switch (e.type) {
                case 'touchmove':
                    me.hide();
                    break;
                case 'scroll':
                    clearTimeout(me.data('_TID'));
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(me.data('_TID'));
                    me.data('_TID', $.later(function(){
                        me._check.call(me);
                    }, 300));
                    break;
                case 'scrollStop':
                    me._check();
                    break;
                case 'ortchange':
                    me._check.call(me);
                    break;
                case 'click':
                    me._scrollTo();
                    break;
            }
        },

        /**
         * 判断是否显示gotop
         */
        _check: function(position) {
            var me = this;
            (position !== undefined ? position : window.pageYOffset) > document.documentElement.clientHeight ? me.show() : me.hide();
            return  me;
        },

		/**
         * 滚动到顶部或指定节点位置
         */
		_scrollTo: function() {
            var me = this,
                from = window.pageYOffset;
            me.hide();
            clearTimeout(me.data('_TID'));
            if (!me.data('useAnimation')) {
                window.scrollTo(0, 1);
                me.trigger('afterScroll');
            } else {
                me.data('moveToTop', $.later(function() {
                    if (from > 1) {
                        window.scrollBy(0, -Math.min(150,from - 1));
                        from -= 150;
                    } else {
                        clearInterval(me.data('moveToTop'));
                        me.trigger('afterScroll');
                    }
                }, 25, true));
            }
            return me;
		},

        /**
         * @desc 显示gotop
         * @name show
         * @grammar show() => self
         *  @example
         * //setup mode
         * $('#gotop').gotop('show');
         *
         * //render mode
         * var demo = $.ui.gotop();
         * demo.show();
         */

        show: function() {
            this._data.root.style.display = 'block';
            return this;
        },

        /**
         * @desc 隐藏gotop
         * @name hide
         * @grammar hide() => self
         * @example
         * //setup mode
         * $('#gotop').gotop('hide');
         *
         * //render mode
         * var demo = $.ui.gotop();
         * demo.hide();
         */
        hide: function() {
            this._data.root.style.display = 'none';
            return this;
        }
        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | afterScroll | event | 返回顶部后触发的事件 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });

})(Zepto);
