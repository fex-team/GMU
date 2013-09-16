/**
 * @file 是否点击其他区域，关闭自己
 * @import widget/popover/popover.js
 */
(function( gmu, $ ) {
    var Popover = gmu.Popover;

    /**
     * @property {Boolean} [dismissible=true] 是否点击其他区域，关闭自己.
     * @namespace options
     * @uses Popover.dismissible
     * @for Popover
     */
    Popover.options.dismissible = true;

    /**
     * 用来实现自动关闭功能，在弹出层打开的条件下，点击其他位置，将自动关闭此弹出层。
     * 此功能包括多个实例间的互斥功能。
     * @class dismissible
     * @namespace Popover
     * @pluginfor Popover
     */
    Popover.option( 'dismissible', true, function() {
        var me = this,
            $doc = $( document ),
            click = 'click' + me.eventNs;

        function isFromSelf( target ) {
            var doms = me.$target.add( me.$root ).get(),
                i = doms.length;

            while ( i-- ) {
                if ( doms[ i ] === target ||
                        $.contains( doms[ i ], target ) ) {
                    return true;
                }
            }
            return false;
        }

        me.on( 'show', function() {
            $doc.off( click ).on( click, function( e ) {
                isFromSelf( e.target ) || me.hide();
            } );
        } );

        me.on( 'hide', function() {
            $doc.off( click );
        } );
    } );
})( gmu, gmu.$ );