/**
 * @file 导航栏组件
 * @import core/widget.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    
    /**
     * 导航栏组件
     *
     * @class Navigator
     * @constructor Html部分
     * ```html
     * 
     * ```
     *
     * javascript部分
     * ```javascript
     * 
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化导航栏的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Navigator:options)
     * @grammar $( el ).navigator( options ) => zepto
     * @grammar new gmu.Navigator( el, options ) => instance
     */
    gmu.define( 'Navigator', {
        options: {

            /**
             * @property {Array} [content=null] 菜单数组
             * @namespace options
             */
            content: null,

            /**
             * @property {String} [event='click'] 交互事件名
             * @namespace options
             */
            event: 'click'
        },

        template: {
            list: '<ul>',
            item: '<li><a<% if( href ) { %> href="<%= href %>"<% } %>>' +
                    '<%= text %></a></li>'
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                $list = $el.find( 'ul' ).first(),
                name = 'ui-' + me.widgetName,
                renderer,
                html;

            // 如果没有包含ul节点，则说明通过指定content来create
            // 建议把create模式给拆出去。很多时候都是先写好在dom中了。
            if ( !$list.length && opts.content ) {
                $list = $( me.tpl2html( 'list' ) );
                renderer = me.tpl2html( 'item' );

                html = '';
                opts.content.forEach(function( item ) {

                    // 如果不提供默认值，然后同时某些key没有传值，parseTpl会报错
                    item = $.extend( {
                        href: '',
                        text: ''
                    }, typeof item === 'string' ? {
                        text: item
                    } : item );

                    html += renderer( item );
                });

                $list.append( html ).appendTo( $el );
            } else {
                
                // 处理直接通过ul初始化的情况
                if ( $el.is( 'ul, ol' ) ) {
                    $list = $el.wrap( '<div>' );
                    $el = $el.parent();
                }

                if ( opts.index === undefined ) {

                    // 如果opts中没有指定index, 则尝试从dom中查看是否有比较为ui-state-active的
                    opts.index = $list.find( '.ui-state-active' ).index();
                    
                    // 没找到还是赋值为0
                    ~opts.index || (opts.index = 0);
                }
            }

            me.$list = $list.addClass( name + '-list' );
            me.trigger( 'done.dom', $el.addClass( name ), opts );

            // bind Events
            $list.highlight( 'ui-state-hover', 'li' );
            $list.on( opts.event + me.eventNs,
                    'li:not(.ui-state-disable)>a', function( e ) {
                me._switchTo( $( this ).parent().index(), e );
            } );

            me.index = -1;
            me.switchTo( opts.index );
        },

        _switchTo: function( to, e ) {
            if ( to === this.index ) {
                return;
            }

            var me = this,
                list = me.$list.children(),
                evt = gmu.Event( 'beforeselect', e ),
                cur;
                
            me.trigger( evt, list.get( to ) );
            
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            cur = list.removeClass( 'ui-state-active' )
                    .eq( to )
                    .addClass( 'ui-state-active' );

            me.index = to;
            return me.trigger( 'select', to, cur[ 0 ] );
        },

        /**
         * 切换到导航栏的某一项
         * @param {Number} to 序号
         * @method switchTo
         */
        switchTo: function( to ) {
            return this._switchTo( ~~to );
        },

        /**
         * 取消选择
         * @method unselect
         */
        unselect: function() {
            this.index = -1;
            this.$list.children().removeClass( 'ui-state-active' );
        },

        /**
         * 获取当前选中的序号
         * @method getIndex
         */
        getIndex: function() {
            return this.index;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event beforeselect
         * @param {Event} e gmu.Event对象
         * @param {Element} 目标元素
         * @description 当选择的序号发生切换前触发
         */
        
        /**
         * @event select
         * @param {Event} e gmu.Event对象
         * @param {Event} 当前选择的序号
         * @param {Element} 上一次选择的元素
         * @description 当选择的序号发生切换后触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu, gmu.$ );