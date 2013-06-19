/**
 * @file 搜索建议 - posAdapt
 * @name Suggestion - posAdapt
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议 - 位置自适应插件，主要需求用于当sug放在页面底部时，需将sug翻转到上面来显示
 * @import widget/suggestion/suggestion.js
 */
(function( $, win ) {
    var reverse = Array.prototype.reverse;

    gmu.suggestion.register( 'posAdapt', {

        _checkPos: function() {
            var sugH = this._options.height || 66,
                upDis = this.getEl().offset().top - win.pageYOffset;

            // 当下边的高度小于sug的高度并且上边的高度大于sug的高度
            return $( win ).height() - upDis < sugH && upDis >= sugH;
        },

        _fillWrapper: function( listHtml ) {
            var me = this,
                $list;

            me.origin( listHtml );

            if ( me.isShow && me._checkPos() ) {
                $list = ($list = me.$content.children()).length === 1 ?
                        $list.children() : $list;

                reverse.call( $list );    // sug list反转
                me.$btn.prependTo( me.$wrapper );    // 调整按钮位置
            }

            return this;
        },

        show: function() {
            var me = this,
                $wrapper = me.$wrapper;

            me.origin();
            me._checkPos() && $wrapper.css( 'top', -$wrapper.height() );

            return me;
        }
    } );
})( gmu.$, window );