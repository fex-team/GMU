/**
 * @import zepto.js
 */
(function( $ ) {    // 修复zepto的offset setter的一个bug

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