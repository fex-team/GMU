/**
 * @file Dropmenu 简单版定位
 * @module GMU
 * @import widget/dropmenu/dropmenu.js, extend/offset.js
 */
(function( gmu, $ ) {

    // 设置默认Options
    $.extend( gmu.Dropmenu.options, {
        /**
         * @property {String} [placement='bottom'] 默认让其在下方显示
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        placement: 'bottom',

        /**
         * @property {String} [align='center'] 默认居中对齐
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        align: 'center',

        /**
         * @property {Object} [offset=null] 偏移量
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        offset: null
    } );

    /**
     * Dropmenu 简单版定位
     *
     * @class placement
     * @namespace Dropmenu
     * @pluginfor Dropmenu
     */
    gmu.Dropmenu.option( 'placement', function( val ) {
        return ~[ 'top', 'bottom' ].indexOf( val );
    }, function() {
        var config = {
                'top_center': 'center top center bottom',
                'top_left': 'left top left bottom',
                'top_right': 'right top right bottom',
                'bottom_center': 'center bottom center top',
                'bottom_right': 'right bottom right top',
                'bottom_left': 'left bottom left top'
            },
            presets = {},    // 支持的定位方式。

            info;

        $.each( config, function( preset, args ) {
            args = args.split( /\s/g );
            args.unshift( preset );
            presets[ preset ] = function() {
                return placement.apply( null, args );
            };
        } );

        function getPos( pos, len ) {
            return pos === 'right' || pos === 'bottom' ? len :
                        pos === 'center' ? len / 2 : 0;
        }

        // 暂时用简单的方式实现，以后考虑采用position.js
        function placement( preset, atH, atV, myH, myV ) {
            var of = info.of,
                coord = info.coord,
                offset = info.offset,
                top = of.top,
                left = of.left;

            left += getPos( atH, of.width ) - getPos( myH, coord.width );
            top += getPos( atV, of.height ) - getPos( myV, coord.height );

            // offset可以是fn
            offset = typeof offset === 'function' ? offset.call( null, {
                left: left,
                top: top
            }, preset ) : offset || {};

            return {
                left: left + (offset.left || 0),
                top: top + (offset.top || 0)
            };
        }

        this.on( 'placement', function( e, $el, $of ) {
            var me = this,
                opts = me._options,
                placement = opts.placement,
                align = opts.align,
                coord;

            info = {
                coord: $el.offset(),
                of: $of.offset(),
                placement: placement,
                align: align,
                $el: $el,
                $of: $of,
                offset: opts.offset
            };

            // 设置初始值
            coord = presets[ placement + '_' + align ]();

            // 提供机会在设置之前修改位置
            me.trigger( 'before.placement', coord, info, presets );
            
            if ( /^(\w+)_(\w+)$/.test( info.preset ) ) {
                info.placement = RegExp.$1;
                info.align = RegExp.$2;
            }

            $el.offset( coord );

            // 提供给arrow位置定位用
            me.trigger( 'after.placement', coord, info );
        } );
    } );
})( gmu, gmu.$ );