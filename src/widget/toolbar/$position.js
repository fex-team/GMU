/**
 * @file Toolbar fix插件
 * @module GMU
 * @import widget/toolbar/toolbar.js, extend/fix.js
 */
(function( gmu, $ ) {
    /**
     * Toolbar position插件，调用position方法可以将Toolbar固定在某个位置。
     *
     * @class position
     * @namespace Toolbar
     * @pluginfor Toolbar
     */
    gmu.Toolbar.register( 'position', {
        /**
         * 定位Toolbar
         * @method position
         * @param {Object} opts 定位参数，格式与$.fn.fix参数格式相同
         * @for Toolbar
         * @uses Toolbar.position
         * @return {self} 返回本身。
         */
        position: function( opts ) {
            this.$el.fix( opts );

            return this;
        }
    } );
})( gmu, gmu.$ );