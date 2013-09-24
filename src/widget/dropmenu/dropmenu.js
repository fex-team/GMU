/**
 * @file 附近弹出组件
 * @import core/widget.js, widget/popover/popover.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $ ) {

    /**
     * 附近弹出组件
     *
     * @class Dropmenu
     * @constructor Html部分
     * ```html
     * <a id="btn1" class="btn">Dropmenu</a>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#btn1').dropmenu({
     *  content: [
     *      
     *      'Action',
     *  
     *      'Another Action',
     *  
     *      'Someone else here',
     *  
     *      'divider',
     *  
     *      {
     *          text: 'Open Baidu',
     *          icon: 'grid',
     *          href: 'http://www.baidu.com'
     *      },
     *  ]
     * })
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Dropmenu:options)
     * @grammar $( el ).dropmenu( options ) => zepto
     * @grammar new gmu.Dropmenu( el, options ) => instance
     */
    gmu.define( 'Dropmenu', {
        options: {

            // 注意: 以前是叫items, 为了与其他组件统一，所以改名叫content
            /**
             * @property {Array} [content=null] 弹出的内容，每条记录为一个Object，属性有 {text:'', icon: '', href:'' }
             * @namespace options
             */
            content: null
        },

        template: {

            item: '<li><a <% if ( href ) { %>href="<%= href %>"<% } %>>' +
                    '<% if ( icon ) { %><span class="ui-icon ui-icon-' +
                    '<%= icon %>"></span><% } %><%= text %></a></li>',

            divider: '<li class="divider"></li>',

            wrap: '<ul>'
        },

        _init: function() {
            var me = this;

            // 存储ul
            me.on( 'done.dom', function( e, $root ) {
                me.$list = $root.find( 'ul' ).first()
                        .addClass( 'ui-dropmenu-items' )
                        .highlight( 'ui-state-hover',
                                '.ui-dropmenu-items>li:not(.divider)' );
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                content = '';

            // 根据opts.content创建ul>li
            if ( $.type( opts.content ) === 'array' ) {
                
                opts.content.forEach(function( item ) {
                    
                    item = $.extend( {
                        href: '',
                        icon: '',
                        text: ''
                    }, typeof item === 'string' ? {
                        text: item
                    } : item );

                    content += me.tpl2html( item.text === 'divider' ?
                            'divider' : 'item', item );
                });
                opts.content = $( me.tpl2html( 'wrap' ) ).append( content );
            }

            me.$super( '_create' );
            me.$list.on( 'click' + me.eventNs, '.ui-dropmenu-items>li:not(' +
                    '.ui-state-disable):not(.divider)', function( e ) {

                var evt = gmu.Event( 'itemclick', e );
                me.trigger( evt, this );

                if ( evt.isDefaultPrevented() ) {
                    return;
                }
                
                me.hide();
            } );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event itemclick
         * @param {Event} e gmu.Event对象
         * @param {Element} item 当前点击的条目
         * @description 某个条目被点击时触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    }, gmu.Popover );

})( gmu, gmu.$ );