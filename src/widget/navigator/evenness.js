/**
 * @file 平均分配按钮，根据传入的visibleCount, 来平均分配宽度, 此插件主要用来加强
 * scrollable, 如果内容不可滚，用纯样式就能实现这块。
 * @import widget/navigator/navigator.js, widget/navigator/$scrollable.js
 */
(function( gmu, $, undefined ) {
    gmu.Navigator.options.visibleCount = 4;

    /**
     * 平均分配按钮，根据传入的visibleCount, 来平均分配宽度, 此插件主要用来加强
     * scrollable, 如果内容不可滚，用纯样式就能实现这块。
     * @class visibleCount
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.option( 'visibleCount', '*', function() {
        var me = this,
            opts = me._options,
            counts = $.type( opts.visibleCount ) === 'number' ? {
                portrait: opts.visibleCount,
                landscape: Math.floor( opts.visibleCount * 3 / 2 )
            } : opts.visibleCount;

        me.on( 'init.iScroll refresh.iScroll', arrage );

        function arrage( e ) {
            
            // todo 采用一种更精准的方法来获取横竖屏
            var ort = window.innerWidth > window.innerHeight ?
                    'landscape' : 'portrait',
                count = counts[ ort ],
                $el = me.$el;
            
            //TODO 横竖屏切换时，不能自动调整宽度
            me.$list.children().width( $el.width() / count );
            me.$list.width($el.width() / count * me.$list.children().length);
        }
    } );
})( gmu, gmu.$ );