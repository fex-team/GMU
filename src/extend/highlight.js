/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import zepto.js
 */
(function( $ ) {
    var inited = false,

        removeClass = function() {
            var cls;

            clearTimeout( timer );

            if ( actElem && (cls = actElem.attr( 'highlight-cls' )) ) {
                actElem.removeClass( cls ).removeAttr( 'highlight-cls' );
                actElem = null;
            }
        },

        en = '.highlight',

        actElem, 
        timer;

    $.extend( $.fn, {
        
        /**
         * @name highlight
         * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class
         * @grammar  highlight(className)   ⇒ self
         * @example var div = $('div');
         * div.highlight('div-hover');
         *
         * $('a').highlight();// 把所有a的自带的高亮效果去掉。
         */
        highlight: function( className ) {
            inited = inited || !!$( document )
                    .on( 'touchend' + en + ' touchmove' + en + ' touchcancel' +
                    en, removeClass );

            removeClass();
            return this.each(function() {
                var $el = $( this );

                $el.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                        .off( 'touchstart' + en );

                className && $el.on( 'touchstart' + en, function() {
                    timer = setTimeout( function() {
                        actElem = $el.attr( 'highlight-cls', className )
                                .addClass( className );
                    }, 100 );
                } );
            });
        }
    } );
})( Zepto );
