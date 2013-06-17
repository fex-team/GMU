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
            opts = this._options,
            tpl2html = this.tpl2html,
            selector = typeof opts.imgZoom === 'string' ? opts.imgZoom : 'img',
            watches;

        this.tpl2html = function( subpart ) {
            subpart === 'item' && watch();
            return tpl2html.apply( this, arguments );
        };

        this.on( 'ready', watch );

        function watch() {
            if ( watches ) {
                watches.off( 'load.slider' );
                watches = null;
                return setTimeout( watch, 0 );
            }

            watches = me._container
                    .find( selector )
                    .on( 'load.slider', _imgZoom );
        }

        function _imgZoom( e ) {
            var img = e.target,
                scale;

            scale = Math.min( me.width / me.width, 
                    me.height / img.height );

            // 只缩放，不拉伸
            if ( scale < 1 ) {
                img.style.width = scale * img.width + 'px';
            }
        }
    } );
})( gmu );