/**
 * @file 位置自适应插件
 * @import widget/suggestion/suggestion.js, extend/event.ortchange.js
 */
(function( $, win ) {
    var reverse = Array.prototype.reverse;

    // 指明sug list的item项selector，用于item项的反转
    // 基于list最外层的$content元素进行查找的
    gmu.Suggestion.options.listSelector = 'li';

    /**
     * 位置自适应插件，主要需求用于当sug放在页面底部时，需将sug翻转到上面来显示
     * @class posadapt
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.register( 'posadapt', {

        _init: function() {
            var me = this,
                $list;

            me.on( 'show ortchange', function() {

                if ( me._checkPos() ) {

                    me.$wrapper.css( 'top', - me.$wrapper.height()- me.wrapperTop );

                    // sug list反转
                    reverse.call( $list =
                        me.$content.find( me._options.listSelector ) );
                    $list.appendTo( $list.parent() );

                    // 调整按钮位置
                    me.$btn.prependTo( me.$wrapper );
                }

            } );
        },

        _checkPos: function() {
            var sugH = this._options.height || 66,
                upDis = this.getEl().offset().top - win.pageYOffset;

            // 当下边的高度小于sug的高度并且上边的高度大于sug的高度
            return $( win ).height() - upDis < sugH && upDis >= sugH;
        }

    } );
})( gmu.$, window );