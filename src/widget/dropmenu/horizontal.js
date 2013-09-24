/**
 * @file Dropmenu 支持水平排列插件
 * @module GMU
 * @import widget/dropmenu/dropmenu.js
 */
(function( gmu ) {

    gmu.Dropmenu.options.horizontal = true;

    /**
     * Dropmenu 支持水平排列插件
     *
     * @class horizontal
     * @namespace Dropmenu
     * @pluginfor Dropmenu
     */
    gmu.Dropmenu.option( 'horizontal', true, function() {
        var me = this;

        me.on( 'done.dom', function( e, $root ) {
            $root.addClass( 'ui-horizontal' );
        } );
    } );
})( gmu, gmu.$ );