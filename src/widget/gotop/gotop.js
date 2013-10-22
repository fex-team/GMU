/**
 * @file 返回顶部组件
 * @import core/widget.js, extend/fix.js, extend/throttle.js, extend/event.scrollStop.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    /**
     * 返回顶部组件
     *
     * @class Gotop
     * @constructor Html部分
     * ```html
     * <div id="gotop"></div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#gotop').gotop();
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Gotop:options)
     * @grammar $( el ).gotop( options ) => zepto
     * @grammar new gmu.Gotop( el, options ) => instance
     */
    gmu.define( 'Gotop', {
        options: {
            /**
             * @property {selector} [container=document.body] 组件容器
             * @namespace options
             */
            container:          '',
            /**
             * @property {Boolean} [useFix=true] 是否使用固顶效果
             * @namespace options
             */
            useFix:             true,
            /**
             * @property {Boolean} [useHide=true] 是否在touchmove的时候隐藏gotop图标
             * @namespace options
             */
            useHide:            true,
            /**
             * @property {Boolean} [useAnimation=false] 返回顶部时是否使用动画,在使用iScroll时,返回顶部的动作由iScroll实例执行,此参数无效
             * @namespace options
             */
            useAnimation:       false,
            /**
             * @property {Object} [position={bottom:10,right:10}] 使用fix效果时，要用的位置参数
             * @namespace options
             */
            position:           {bottom: 10, right: 10},
            /**
             * @property {Function} [afterScroll=null] 返回顶部后执行的回调函数
             * @namespace options
             */
        	afterScroll:        null
        },

        _init: function() {
            var me = this,
                $el,
                _opts = me._options,
                _eventHandler;

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                _opts.position.bottom = 40;
            }

            me.on( 'ready', function(){
                $el = me.$el;
                _eventHandler = $.proxy(me._eventHandler, me);

                _opts['useHide'] && $(document).on('touchmove', _eventHandler);
                $(window).on('touchend touchcancel scrollStop', _eventHandler);
                $(window).on('scroll ortchange', _eventHandler);
                $el.on('click', _eventHandler);
                me.on('destroy', function() {
                    $(window).off('touchend touchcancel scrollStop', _eventHandler);
                    $(document).off('touchmove', _eventHandler);
                    $(window).off('scroll ortchange', _eventHandler);
                });
                _opts['useFix'] && $el.fix(_opts['position']);
                _opts['root'] = $el[0];
            } );

            // 不管是哪种模式创建的，destroy时都将元素移除
            me.on( 'destroy', function() {
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this;

            if( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me.$el.addClass('ui-gotop').append('<div></div>').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body));

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
                    clearTimeout(me._options['_TID']);
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(me._options['_TID']);
                    me._options['_TID'] = setTimeout(function(){
                        me._check.call(me);
                    }, 300);
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
            clearTimeout(me._options['_TID']);
            if (!me._options['useAnimation']) {
                window.scrollTo(0, 1);
                me.trigger('afterScroll');
            } else {
                me._options['moveToTop'] = setInterval(function() {
                    if (from > 1) {
                        window.scrollBy(0, -Math.min(150,from - 1));
                        from -= 150;
                    } else {
                        clearInterval(me._options['moveToTop']);
                        me.trigger('afterScroll');
                    }
                }, 25, true);
            }
            return me;
		},

        /**
         * 显示gotop
         * @method show
         * @return {self} 返回本身
         */
        show: function() {
            this._options.root.style.display = 'block';

            return this;
        },

        /**
         * 隐藏gotop
         * @method hide
         * @chainable
         * @return {self} 返回本身
         */
        hide: function() {
            this._options.root.style.display = 'none';
            
            return this;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发
         */

        /**
         * @event afterScroll
         * @param {Event} e gmu.Event对象
         * @description 返回顶部后触发的事件
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });
})( gmu, gmu.$ );
