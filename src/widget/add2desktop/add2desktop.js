
/**
 * @file 生成桌面图标组件
 * @name Add2desktop
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/add2desktop/add2desktop.html</qrcode>
 * 在iOS中将页面添加为桌面图标(不支持Android系统)
 * @import core/widget.js, extend/fix.js
 */
(function( gmu, $, undefined ) {
    /**
     * @name     gmu.Add2desktop
     * @grammar  gmu.Add2desktop([el [,options]]) =>instance
     * @grammar  $(el).add2desktop(options) => self
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''icon'' {String}: (必选) 产品线ICON'S URL
     * - ''container'' {selector}: (可选，默认：body) 组件容器
     * - ''key'' {String}: (可选，默认：_gmu_adddesktop_key) LocalStorage的key值
     * - ''useFix'' {Boolean}: (可选，默认：true) 是否使用fix固顶效果
     * - ''position'' {Object}: (可选，默认：{bottom:12, left: 50%}) 固顶时使用的位置参数
     * - ''beforeshow'' {Function}: (可选) 显示前触发的事件，调用e.preventDefault()可以阻止显示
     * - ''afterhide'' {Function}: (可选) 隐藏后触发的事件，可以在这里写LocalStorage的值
     * **Demo**
     * <codepreview href="../examples/widget/add2desktop/add2desktop.html">
     * ../gmu/examples/widget/add2desktop/add2desktop.html
     * </codepreview>
     */
    gmu.define('Add2desktop', {
        options: {
            icon: '',
            container:  '',
            key:'_gmu_adddesktop_key',
            useFix: true,
            position: {
                bottom: 12,
                left: '50%'
            },
            beforeshow : function(e){
                this.key() && e.preventDefault()
            },
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

            if( me._options.setup ) {
                var src = me.$el.children('img').attr('src');
                src && (me._options['icon'] = src);
            }
            $el = me.$el || (me.$el = $('<div></div>'));
            $el.addClass('ui-add2desktop').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)),

            $el.html('<img src="' + me._options['icon'] + '"/><p>先点击<span class="ui-add2desktop-icon-' + version +'"></span>，<br />再"添加至主屏幕"</p><span class="ui-add2desktop-close"><b></b></span><div class="ui-add2desktop-arrow"><b></b></div>');
        },

        /**
         * @desc 存储/获取LocalStorage的键值
         * @name key
         * @grammar key()  => value
         * @example
         * //setup mode
         * $('#add2desktop').add2desktop('key','1'); //设置键值为1
         *
         * //render mode
         * var demo = gmu.Add2desktop();
         * demo.key();  //获取键值
         */
        key : function(value){
            var ls = window.localStorage;
            return value !== undefined ? ls.setItem(this._options['key'], value) : ls.getItem(this._options['key']);
        },

        /**
         * @desc 显示add2desktop
         * @name show
         * @grammar show()  => self
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
         * @desc 隐藏add2desktop
         * @name hide
         * @grammar hide()  => self
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
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | ready | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | beforeshow | event | 显示前触发的事件 |
         * | afterhide | event | 隐藏后触发的事件 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });

})( gmu, gmu.$ );
