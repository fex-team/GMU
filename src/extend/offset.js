/**
 * @file 修复Zepto中offset setter bug
 * 比如 被定位元素满足以下条件时，会定位不正确
 * 1. 被定位元素不是第一个节点，且prev兄弟节点中有非absolute或者fixed定位的元素
 * 2. 被定位元素为非absolute或者fixed定位。
 * issue: https://github.com/gmuteam/GMU/issues/101
 * @import zepto.js
 * @module GMU
 */

(function( $ ) {
    var _offset = $.fn.offset,
        round = Math.round;

    // zepto的offset bug的主要问题是当position:relative的时候，没有考虑元素的初始值。
    // 初始值，是指positon:relative; top: 0; left: 0; bottom:0; right:0; 的时候
    // 该元素的位置，zepto中的offset是假定了这个值就是{left:0, top: 0}; 实际上前面有兄弟
    // 节点且不为postion: absolute|fixed 定位时时，该元素的初始位置并不是{left:0, top: 0}
    // 会根据前面兄弟节点的内容大小而不一样。
    function setter( coord ) {
        return this.each(function( idx ) {
            var $el = $( this ),
                coords = $.isFunction( coord ) ? coord.call( this, idx,
                    $el.offset() ) : coord,

                position = $el.css( 'position' ),

                // position为absolute或者fixed定位的元素，跟元素的初始位置没有关系
                // 所以不需要取初始位置
                pos = position === 'absolute' || position === 'fixed' ||
                    $el.position();

            // 如果是position为relative, 且存在 top, right, bottom, left值
            // position值还不能代表初始值，需要还原一下
            // 比如 top: 1px, 那要让position取得的值减去1px才是该元素的初始位置
            // 但是如果是top:auto, bottom: 1px; 则是要加1px, 所以下面的代码要乘以个-1
            if ( position === 'relative' ) {
                pos.top -= parseFloat( $el.css( 'top' ) ) ||
                        parseFloat( $el.css( 'bottom' ) ) * -1 || 0;
                pos.left -= parseFloat( $el.css( 'left' ) ) ||
                        parseFloat( $el.css( 'right' ) ) * -1 || 0;
            }

            parentOffset = $el.offsetParent().offset(),

            // 迫于无赖，chrome下如果offset设置的top,left不是整型，会导致popOver中arrow样式有问题。
            props = {
              top:  round( coords.top - (pos.top || 0)  - parentOffset.top ),
              left: round( coords.left - (pos.left || 0) - parentOffset.left )
            }

            if ( position == 'static' ){
                props['position'] = 'relative';
            }

            // 可以考虑改用animate方法。
            if ( coords.using ) {
                coords.using.call( this, props, idx );
            } else {
                $el.css( props );
            }
        });
    }

    $.fn.offset = function( corrd ) {
        return corrd ? setter.call( this, corrd ): _offset.call( this );
    }
})( Zepto );