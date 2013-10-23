/**
 * @file 在iOS中将页面添加为桌面图标(不支持Android系统)
 * @import core/widget.js, extend/fix.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    /**
     * 在iOS中将页面添加为桌面图标(不支持Android系统)
     * @class Add2desktop
     * @constructor Html部分
     *
     * javascript部分
     * ```javascript
     * gmu.Add2desktop({icon:'../../../examples/assets/icon.png'});
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化工具栏的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Toolbar:options)
     * @grammar  gmu.Add2desktop([el [,options]]) =>instance
     * @grammar  $(el).add2desktop(options) => zepto
     */
    gmu.define('Add2desktop', {
        options: {
            /**
             * @property {String} icon 产品线ICON的URL
             * @namespace options
             */
            icon: '',
            /**
             * @property {selector} [container=document.body] 组件容器
             * @namespace options
             */
            container:  '',
            /**
             * @property {String} [key='_gmu_adddesktop_key'] LocalStorage的key值
             * @namespace options
             */
            key:'_gmu_adddesktop_key',
            /**
             * @property {Boolean} [useFix=true] 是否使用fix固顶效果
             * @namespace options
             */
            useFix: true,
            /**
             * @property {Object} [position={bottom:12,left:50%}] 固顶时使用的位置参数
             * @namespace options
             */
            position: {
                bottom: 12,
                left: '50%'
            },
            /**
             * @property {Function} [beforeshow=fn}] 显示前触发的事件，调用e.preventDefault()可以阻止显示
             * @namespace options
             */
            beforeshow : function(e){
                this.key() && e.preventDefault()
            },
            /**
             * @property {Function} [afterhide=fn}] 隐藏后触发的事件，可以在这里写LocalStorage的值
             * @namespace options
             */
            afterhide : function(){
                this.key(1)
            },
            _isShow:false
        },

        _init: function() {
            var me = this;

            me.on( 'ready', function(){
                me.$el.find('.ui-add2desktop-close').on('click',function () {
                    me.hide();
                });
                me._options['useFix'] && me.$el.fix(me._options['position']);

                me.show();
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this,
                $el,
                version = ($.os.version && $.os.version.substr(0, 3) > 4.1 ? 'new' :'old');

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                version = 'iOS7';
            }

            if( me._options.setup ) {
                var src = me.$el.children('img').attr('src');
                src && (me._options['icon'] = src);
            }
            $el = me.$el || (me.$el = $('<div></div>'));
            $el.addClass('ui-add2desktop').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)),

            $el.html('<img src="' + me._options['icon'] + '"/><p>先点击<span class="ui-add2desktop-icon-' + version +'"></span>，<br />再"添加到主屏幕"</p><span class="ui-add2desktop-close"><b></b></span><div class="ui-add2desktop-arrow"><b></b></div>');
        },

        /**
         * 存储/获取LocalStorage的键值
         * @method key
         * @param {String} [value] LocalStorage的键值，不传表示取值
         * @return {self} LocalStorage的值
         */
        key : function(value){
            var ls = window.localStorage;
            return value !== undefined ? ls.setItem(this._options['key'], value) : ls.getItem(this._options['key']);
        },

        /**
         * 显示add2desktop
         * @method show
         * @return {self} 返回本身。
         */

        /**
         * @event beforeshow
         * @param {Event} e gmu.Event对象
         * @description add2desktop显示前触发
         */
        show: function() {
            var me = this;

            if( !me._options['_isShow'] ) {
                if(!$.os.ios || $.browser.uc || $.browser.qq || $.browser.chrome) return me; //todo 添加iOS原生浏览器的判断
                var event = new gmu.Event('beforeshow');
                me.trigger(event);
                if(event.isDefaultPrevented()) return me;
                me.$el.css('display', 'block');
                me._options['_isShow'] = true;
            }

            return me;
        },

        /**
         * 隐藏add2desktop
         * @method hide
         * @return {self} 返回本身。
         */

        /**
         * @event afterhide
         * @param {Event} e gmu.Event对象
         * @description add2desktop显示后触发
         */
        hide: function() {
            var me = this;

            if(me._options['_isShow']) {
                me.$el.css('display', 'none');
                me._options['_isShow'] = false;
                me.trigger('afterhide');
            }

            return me;
        }
        
        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });

})( gmu, gmu.$ );
