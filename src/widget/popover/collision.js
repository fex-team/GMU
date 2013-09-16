/**
 * @file 碰撞检测，根据指定的容器，做最优位置显示
 * @import widget/popover/popover.js
 */
(function( gmu, $ ) {

    /**
     * @property {Boolean} [collision=true] 开启碰撞检测。
     * @namespace options
     * @uses Popover.collision
     * @for Popover
     */
    gmu.Popover.options.collision = true;

    /**
     * 碰撞检测，依赖于placement插件，根据是否能完全显示内容的策略，挑选最合适的placement.
     * @class collision
     * @namespace Popover
     * @pluginfor Popover
     */
    gmu.Popover.option( 'collision', true, function() {
        var me = this,
            opts = me._options;

        // 获取within坐标信息
        // 可以是window, document或者element.
        // within为碰撞检测的容器。
        function getWithinInfo( raw ) {
            var $el = $( raw );

            raw = $el[ 0 ];

            if ( raw !== window && raw.nodeType !== 9 ) {
                return $el.offset();
            }

            return {
                width: $el.width(),
                height: $el.height(),
                top: raw.pageYOffset || raw.scrollTop || 0,
                left: raw.pageXOffset || raw.scrollLeft || 0
            };
        }

        // 判断是否没被挡住
        function isInside( coord, width, height, within ) {
            return coord.left >= within.left &&
                    coord.left + width <= within.left + within.width &&
                    coord.top >= within.top &&
                    coord.top + height <= within.top + within.height;
        }

        // 此事件来源于placement.js, 主要用来修改定位最终值。
        me.on( 'before.placement', function( e, coord, info, presets ) {
            var within = getWithinInfo( opts.within || window ),
                now = info.placement,
                orig = info.coord,
                aviable = Object.keys( presets ),
                idx = aviable.indexOf( now ) + 1,
                swap = aviable.splice( idx, aviable.length - idx );

            // 从当前placement的下一个开始，最多尝试一圈。
            // 如果有完全没有被挡住的位置，则跳出循环
            // 如果尝试一圈都没有合适的位置，还是用原来的初始位置定位
            aviable = swap.concat( aviable );

            while ( aviable.length && !isInside( coord, orig.width,
                    orig.height, within ) ) {
                now = aviable.shift();
                $.extend( coord, presets[ now ]() );
            }
            info.preset = now;
        } );
    } );
})( gmu, gmu.$ );