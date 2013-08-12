/**
 * @file 简单版定位
 * @import widget/popover/popover.js, extend/offset.js
 */
(function( gmu, $ ) {

    /**
     * @property {String} [placement="bottom"] 设置定位位置。
     * @namespace options
     * @uses Popover.placement
     * @for Popover
     */

    /**
     * @property {Object|Function} [offset=null] 设置偏移量。
     * @namespace options
     * @for Popover
     * @uses Popover.placement
     */
    $.extend( gmu.Popover.options, {
        placement: 'bottom',    // 默认让其在下方显示
        offset: null
    } );

    /**
     * 支持弹出层相对于按钮上下左右定位。
     * @class placement
     * @namespace Popover
     * @pluginfor Popover
     */
    gmu.Popover.option( 'placement', function( val ) {
        return ~[ 'top', 'bottom', 'left', 'right' ].indexOf( val );
    }, function() {

        var me = this,

            // 第一个值：相对于目标位置的水平位置
            // 第二个值：相对于目标位置的垂直位置
            // 第三个值：中心点的水平位置
            // 第四个值：中心点的垂直位置
            config = {
                'top': 'center top center bottom',
                'right': 'right center left center',
                'bottom': 'center bottom center top',
                'left': 'left center right center'
            },
            presets = {},    // 支持的定位方式。

            info;

        // 根据配置项生成方法。
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

        // 此事件在
        this.on( 'placement', function( e, $el, $of ) {
            var me = this,
                opts = me._options,
                placement = opts.placement,
                coord;

            info = {
                coord: $el.offset(),
                of: $of.offset(),
                placement: placement,
                $el: $el,
                $of: $of,
                offset: opts.offset
            };

            // 设置初始值
            coord = presets[ placement ]();

            // 提供机会在设置之前修改位置
            me.trigger( 'before.placement', coord, info, presets );
            info.preset && (info.placement = info.preset);
            $el.offset( coord );

            // 提供给arrow位置定位用
            me.trigger( 'after.placement', coord, info );
        } );

        // 当屏幕旋转的时候需要需要重新计算。
        $( window ).on( 'ortchange', function() {
            me._visible && me.trigger( 'placement', me.$target, me.$root );
        } );
    } );
})( gmu, gmu.$ );