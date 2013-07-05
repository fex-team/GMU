/**
 * @file 支持水平排列
 * @import widget/dropmenu/dropmenu.js
 */
(function( gmu ) {

    gmu.Dropmenu.options.horizontal = true;

    gmu.Dropmenu.option( 'horizontal', true, function() {
        var me = this;

        me.on( 'done.dom', function( e, $root ) {
            $root.addClass( 'ui-horizontal' );
        } );
    } );
})( gmu, gmu.$ );