/**
 * @file 图片自动适应功能
 * @import widget/slider/slider.js
 */
(function( gmu ) {

    gmu.Slider.options.imgZoom = true;

    gmu.Slider.option( 'imgZoom', function() {
        return !!this._options.imgZoom;
    }, function() {
        var me = this,
            selector = me._options.imgZoom,
            watches;

        selector = typeof selector === 'string' ? selector : 'img';

        function unWatch() {
            watches && watches.off( 'load.slider', imgZoom );
        }

        function watch() {
            unWatch();
            watches = me._container.find( selector )
                    .on( 'load.slider', imgZoom );
        }

        function imgZoom( e ) {
            var img = e.target || this,

                // 只缩放，不拉伸
                scale = Math.min( 1, me.width / img.naturalWidth,
                    me.height / img.naturalHeight );
            
            img.style.width = scale * img.naturalWidth + 'px';
        }

        me.on( 'ready dom.change', watch );
        me.on( 'width.change', function() {
            watches && watches.each( imgZoom );
        } );
        me.on( 'destroy', unWatch );
    } );
})( gmu );