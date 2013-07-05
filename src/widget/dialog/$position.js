/**
 * @file Dialog － 父容器插件
 * @name Dialog.position
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/dialog/dialog_position.html</qrcode>
 * @short Dialog.position
 * @import widget/dialog/dialog.js, extend/position.js
 */
(function( gmu, $, undefined ) {
    /**
     * @name dialog.position
     * @desc 用zepto.position来定位dialog
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * **Demo**
     * <codepreview href="../examples/widget/dialog/dialog_position.html">
     * ../gmu/examples/widget/dialog/dialog_position.html
     * </codepreview>
     */
    gmu.Dialog.register( 'position', {

        _init: function(){
            var opts = this._options;

            opts.position = opts.position || {of: opts.container || window, at: 'center', my: 'center'};
        },

        /**
         * @name position
         * @grammar position(x, y) ⇒ instance
         * @desc 用来设置弹出框的位置，如果不另外设置，组件默认为上下左右居中对齐。位置参数接受，数值，百分比，带单位的数值，或者'center'。
         * 如: 100， 100px, 100em, 10%, center;
         * @notice 暂时不支持 left, right, top, bottom.
         */
        position: function(x, y){
            var opts = this._options;
            if(!$.isPlainObject(x)){//兼容老格式！
                opts.position.at = 'left'+(x>0?'+'+x: x)+' top'+(y>0?'+'+y: y);
            } else $.extend(opts.position, x);
            return this.refresh();
        },
        
        _calculate:function () {
            var me = this, opts = me._options, position = opts.position,
                ret = this.origin();

            opts._wrap.position($.extend(position, {
                using: function(position){
                    ret.wrap = position;
                }
            }));

            return ret;
        }
    } );
})( gmu, gmu.$);
