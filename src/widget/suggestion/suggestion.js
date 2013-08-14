/**
 * @file 搜索建议组件
 * @import core/widget.js, extend/touch.js, extend/highlight.js
 */
(function( $, win ) {

     /**
     * 搜索建议组件
     *
     * @class Suggestion
     * @constructor Html部分
     * ```html
     * <form action="http://www.baidu.com/s" method="get">
     *     <div class="search">
     *         <div class="search-input"><input type="text" id="input" name="wd"></div>
     *         <div class="search-button"><input type="submit" value="百度一下"></div>
     *     </div>
     * </form>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#input').suggestion({
     *      source: "../../data/suggestion.php"
     *  });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Suggestion的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Suggestion:options)
     * @grammar $( el ).suggestion( options ) => zepto
     * @grammar new gmu.Suggestion( el, options ) => instance
     */
    
    var guid = 0;

    gmu.define( 'Suggestion', {

        // 默认options
        options: {

            /**
             * @property {Element | Zepto | Selector} container 父元素，若为render模式，则为必选
             * @namespace options
             */
            
            /**
             * @property {String} source 请求数据的url，若不自定义sendRequest，则为必选
             * @namespace options
             */
            
            /**
             * @property {String} [param=''] url附加参数
             * @namespace options
             */
            
            /**
             * @property {String | Element} [form] 提交搜索的表单，默认为包含input框的第一个父级form
             * @namespace options
             */
            
            /**
             * @property {Boolean | String} [historyShare=true] 多个sug之间是否共享历史记录，可传入指定的key值。若传默认传true，则使用默认key：'SUG-Sharing-History'，若传false，即表示不共享history；若传string，则为该值+'-SUG-Sharing-History'作为key值
             * @namespace options
             */
            historyShare: true,

            /**
             * @property {Boolean} [confirmClearHistory=true] 删除历史记录时是否确认
             * @namespace options
             */
            confirmClearHistory: true,

            /**
             * @property {Boolean} [autoClose=true] 点击input之外自动关闭
             * @namespace options
             */
            autoClose: false
        },

        template: {

            // ui-suggestion的class必须有
            // ontent, button, clear, close这几个div必须有，其他的可以更改
            wrapper: '<div class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">清除历史记录</span>' +
                '<span class="ui-suggestion-close">关闭</span>' +
                '</div></div>'
        },

        _initDom: function() {
            var me = this,
                $input = me.getEl().attr( 'autocomplete', 'off'),
                $parent = $input.parent('.ui-suggestion-mask');

            $parent.length ? me.$mask = $parent :
                    $input.wrap( me.$mask =
                    $( '<div class="ui-suggestion-mask"></div>' ) );

            // 考采用template的wrapper项渲染列表
            me.$mask.append( me.tpl2html( 'wrapper' ) );

            me.$wrapper = me.$mask.find( '.ui-suggestion' )
                    .prop('id', 'ui-suggestion-' + (guid++));
            me.$content = me.$wrapper
                    .css( 'top', $input.height() + (me.wrapperTop =
                    parseInt( me.$wrapper.css( 'top' ), 10 ) || 0) )
                    .find( '.ui-suggestion-content' );

            me.$btn = me.$wrapper.find( '.ui-suggestion-button' );
            me.$clearBtn = me.$btn.find( '.ui-suggestion-clear' );
            me.$closeBtn = me.$btn.find( '.ui-suggestion-close' );

            return me.trigger('initdom');
        },

        _bindEvent: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.eventNs;

            me._options.autoClose && $( document ).on( 'tap' + ns, function( e ) {

                // 若点击是的sug外边则关闭sug
                !$.contains( me.$mask.get( 0 ), e.target ) && me.hide();
            } );

            $el.on( 'focus' + ns, function() {

                // 当sug已经处于显示状态时，不需要次showlist
                !me.isShow && me._showList().trigger( 'open' );
            } );

            $el.on( 'input' + ns, function() {

                // 考虑到在手机上输入比较慢，故未进行稀释处理
                me._showList();
            } );

            me.$clearBtn.on( 'click' + ns, function() {

                //清除历史记录
                me.history( null );
            } ).highlight( 'ui-suggestion-highlight' );

            me.$closeBtn.on( 'click' + ns, function() {

                // 隐藏sug
                me.getEl().blur();
                me.hide().trigger( 'close' );
            } ).highlight( 'ui-suggestion-highlight' );

            return me;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                hs = opts.historyShare;

            opts.container && (me.$el = $(opts.container));

            // 若传默认传true，则使用默认key：'SUG-Sharing-History'
            // 若传false，即表示不共享history，以该sug的id作为key值
            // 若传string，则在此基础上加上'SUG-Sharing-History'
            me.key = hs ?
                    (($.type( hs ) === 'boolean' ? '' : hs + '-') +
                    'SUG-Sharing-History') :
                    me.getEl().attr( 'id' ) || ('ui-suggestion-' + (guid++));

            // localStorage中数据分隔符
            me.separator = encodeURIComponent( ',' );

            // 创建dom，绑定事件
            me._initDom()._bindEvent();

            return me;
        },

        /**
         * 展示suglist，分为query存在和不存在
         * @private
         */
        _showList: function() {
            var me = this,
                query = me.value(),
                data;

            if ( query ) {

                // 当query不为空，即input或focus时,input有值
                // 用户自己发送请求或直接本地数据处理，可以在sendrequest中处理
                me.trigger( 'sendrequest', query, $.proxy( me._render, me ),
                        $.proxy( me._cacheData, me ));

            } else {

                // query为空，即刚开始focus时，读取localstorage中的数据渲染
                (data = me._localStorage()) ?
                        me._render( query, data.split( me.separator ) ) :
                        me.hide();
            }

            return me;
        },

        _render: function( query, data ) {

            this.trigger( 'renderlist', data, query, $.proxy( this._fillWrapper, this ) );
        },

        /**
         * 根据数据填充sug wrapper
         * @listHtml 填充的sug片段，默认为'<ul><li>...</li>...</ul>'
         * @private
         */
        _fillWrapper: function( listHtml ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();
            listHtml ? (this.$content.html( listHtml ), this.show()) :
                    this.hide();

            return this;
        },

        _localStorage: function( value ) {
            var me = this,
                key = me.key,
                separator = me.separator,
                localStorage,
                data;

            try {

                localStorage = win.localStorage;

                if ( value === undefined ) {    // geter
                    return localStorage[ key ];

                } else if ( value === null ) {    // setter clear
                    localStorage[ key ] = '';

                } else if ( value ) {    // setter
                    data = localStorage[ key ] ?
                            localStorage[ key ].split( separator ) : [];

                    // 数据去重处理
                    // todo 对于兼容老格式的数据中有一项会带有\u001e，暂未做判断
                    if ( !~$.inArray( value, data ) ) {
                        data.unshift( value );
                        localStorage[ key ] = data.join( separator );
                    }
                }

            } catch ( ex ) {
                console.log( ex.message );
            }

            return me;
        },

        _cacheData: function( key, value ) {
            this.cacheData || (this.cacheData = {});

            return value !== undefined ?
                this.cacheData[ key ] = value : this.cacheData[ key ];
        },

        /**
         * 获取input值
         * @method value
         * @return {String} input中的值
         */
        value: function() {
            return this.getEl().val();
        },

        /**
         * 设置|获取|清空历史记录
         * @method history
         * @param {String} [value] 不传value表示清除sug历史记录，传value表示存值
         */
        history: function( value ) {
            var me = this,
                clearHistory = value !== null || function() {
                    return me._localStorage( null).hide();
                };

            return value === null ? (me._options.confirmClearHistory ?
                win.confirm( '清除全部查询历史记录？' ) && clearHistory() :
                clearHistory()) : me._localStorage( value )
        },

        /**
         * 显示sug
         * @method show
         */
        show: function() {

            if ( !this.isShow ) {
                this.$wrapper.show();
                this.isShow = true;
                return this.trigger( 'show' );
            }else{
                return this;
            }

        },

        /**
         * 隐藏sug
         * @method hide
         */
        hide: function() {

            if ( this.isShow ) {
                this.$wrapper.hide();
                this.isShow = false;
                return this.trigger( 'hide' );
            }else{
                return this;
            }

        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.ns;

            // 先执行父级destroy，保证插件或option中的destroy先执行
            me.trigger( 'destroy' );

            $el.off( ns );
            me.$mask.replaceWith( $el );
            me.$clearBtn.off( ns );
            me.$closeBtn.off( ns );
            me.$wrapper.children().off().remove();
            me.$wrapper.remove();
            me._options.autoClose && $( document ).off( ns );

            this.destroyed = true;

            return me;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event initdom
         * @param {Event} e gmu.Event对象
         * @param {Zepto} $el slider元素
         * @description DOM创建完成后触发
         */
        
        /**
         * @event show
         * @param {Event} e gmu.Event对象
         * @description 显示sug时触发
         */
        
        /**
         * @event hide
         * @param {Event} e gmu.Event对象
         * @param {Number} index 当前slide的序号
         * @description 隐藏sug时触发
         */
        
        /**
         * @event sendrequest
         * @param {Event} e gmu.Event对象
         * @param {String} query 用户输入查询串
         * @param {Function} render 数据请求完成后的渲染回调函数，其参数为query,data
         * @param {Function} cacheData 缓存query的回调函数，其参数为query, data
         * @description 发送请求时触发
         */
        
        /**
         * @event renderlist
         * @param {Event} e gmu.Event对象
         * @param {Array} data 渲染的数据
         * @param {String} query 用户输入的查询串
         * @param {Function} fillWrapper 列表渲染完成后的回调函数，参数为listHtml片段
         * @description 渲染sug list时触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu.$, window );
