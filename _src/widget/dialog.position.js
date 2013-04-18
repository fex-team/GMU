/**
 * @file Dialog － 父容器插件
 * @name Dialog － 父容器插件
 * @short Dialog.container
 * @import widget/dialog.js, core/zepto.position.js
 */
(function ($, undefined) {
    /**
     * @name Position插件
     * @desc 用
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/dialog/dialog_container.html">
     * ../gmu/_examples/widget/dialog/dialog_container.html
     * </codepreview>
     */
    $.ui.dialog.register(function () {
        return {
            pluginName: 'position',

            _init: function(){
                var data = this._data;
                this._initOrg();
                data.position = data.position || {of: data.container || window, at: 'center', my: 'center'};
            },

            /**
             * @name position
             * @grammar position(x, y) ⇒ instance
             * @desc 用来设置弹出框的位置，如果不另外设置，组件默认为上下左右居中对齐。位置参数接受，数值，百分比，带单位的数值，或者'center'。
             * 如: 100， 100px, 100em, 10%, center;
             * @notice 暂时不支持 left, right, top, bottom.
             */
            position: function(x, y){
                var data = this._data;
                if(!$.isPlainObject(x)){//兼容老格式！
                    data.position.at = 'left'+(x>0?'+'+x: x)+' top'+(y>0?'+'+y: y);
                } else $.extend(data.position, x);
                return this.refresh();
            },
            
            _calculate:function () {
                var me = this, data = me._data, position = data.position,
                    ret = this._calculateOrg();

                data._wrap.position($.extend(position, {
                    using: function(position){
                        ret.wrap = position;
                    }
                }));
                return ret;
            }
        }
    });
})(Zepto);
