/**
 * @file 是否现实剪头
 * @import widget/popover/popover.js
 */
(function( gmu ) {
    var Popover = gmu.Popover;

    Popover.template.arrow = '<span class="arrow"></span>';
    Popover.options.arrow = true;    // 默认开启arrow

    Popover.option( 'arrow', true, function() {
        var me = this,
            opts = me._options;

        // 在没有传入offset的时候，默认有arrow就会多10px偏移
        opts.offset = opts.offset || function( coord, preset ) {
            return {
                left: (preset === 'left' ? -1 :
                        preset === 'right' ? 1 : 0) * 15,
                top: (preset === 'top' ? -1 :
                        preset === 'bottom' ? 1 : 0) * 15
            };
        };

        me.on( 'done.dom', function( e, $root ) {
            $root.append( me.tpl2html( 'arrow' ) );
        } );

        me.on( 'after.placement', function( e, coord, info ) {
            var root = this.$root[ 0 ],
                cls = root.className,
                preset = info.placement;

            root.className = cls.replace( /(?:\s|^)ui-pos-[^\s$]+/g, '' ) +
                ' ui-pos-' + preset;
        } );
    } );
})( gmu );