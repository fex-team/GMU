/**
 * 修复Zepto中offset setter bug。
 * 比如 被定位元素满足以下条件时，会定位不正确
 * 1. 被定位元素不是第一个节点，且prev兄弟节点中有非absolute或者fixed定位的元素
 * 2. 被定位元素为非absolute或者fixed定位。
 * issue: https://github.com/gmuteam/GMU/issues/101
 * @import zepto.js
 */
(function( $ ) {
    var _offset = $.fn.offset;

    $.fn.offset = function( coord ) {
        var hook;

        hook = coord && function() {
            var $el = $( this ),
                position = $el.css( 'position' ),
                pos = position === 'absolute' || position === 'fixed' ||
                    $el.position();

            coord = typeof coord === 'function' ? 
                    coord.apply( this, arguments ) : coord;

            if ( position === 'relative' ) {
                pos.top -= parseFloat( $el.css( 'top' ) ) || 
                        parseFloat( $el.css( 'bottom' ) ) * -1 || 0;
                pos.left -= parseFloat( $el.css( 'left' ) ) ||
                        parseFloat( $el.css( 'right' ) ) * -1 || 0;
            }

            coord = {
                top: coord.top - (pos.top || 0),
                left: coord.left - (pos.left || 0)
            };

            return coord;
        };

        return _offset.call( this, hook );
    };

})( Zepto );