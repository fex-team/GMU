/**
 * @file 图片轮播剪头按钮
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( true, gmu.Slider, {

        template: {
            prev: '<span class="ui-slider-pre"></span>',
            next: '<span class="ui-slider-next"></span>'
        },

        options: {
            /**
             * @property {Boolean} [arrow=true] 是否显示点
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            arrow: true,

            /**
             * @property {Object} [select={prev:'.ui-slider-pre',next:'.ui-slider-next'}] 上一张和下一张按钮的选择器
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            select: {
                prev: '.ui-slider-pre',    // 上一张按钮选择器
                next: '.ui-slider-next'    // 下一张按钮选择器
            }
        }
    } );

    /**
     * 图片轮播剪头按钮
     * @class arrow
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'arrow', true, function() {
        var me = this,
            arr = [ 'prev', 'next' ];

        this.on( 'done.dom', function( e, $el, opts ) {
            var selector = opts.selector;

            arr.forEach(function( name ) {
                var item = $el.find( selector[ name ] );
                item.length || $el.append( item = $( me.tpl2html( name ) ) );
                me[ '_' + name ] = item;
            });
        } );

        this.on( 'ready', function() {
            arr.forEach(function( name ) {
                me[ '_' + name ].on( 'tap' + me.eventNs, function() {
                    me[ name ].call( me );
                } );
            });
        } );

        this.on( 'destroy', function() {
            me._prev.off( me.eventNs );
            me._next.off( me.eventNs );
        } );
    } );
})( gmu, gmu.$ );