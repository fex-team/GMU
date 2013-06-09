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
            arrow: true,    // 是否显示点

            select: {
                prev: '.ui-slider-pre',    // 上一张按钮选择器
                next: '.ui-slider-next'    // 下一张按钮选择器
            }
        }
    } );

    gmu.Slider.option( 'arrow', true, function() {
        var arr = [ 'prev', 'next' ];
        
        this.on( 'done.dom', function( e, $el, opts ) {
            var selector = opts.selector,
                me = this;

            arr.forEach(function( name ) {
                var item = $el.find(selector[ name ]);
                item.length || $el.append( item = $( me.tpl2html( name ) ) );
                me[ '_' + name ] = item;
            });
        } );

        this.on( 'ready', function() {
            var me = this;

            arr.forEach(function( name ) {
                me[ '_' + name ].on( 'tap.arrow.slider', function() {
                    me[ name ].call( me );
                } );
            });
        } );
    } );
})( gmu, gmu.$ );