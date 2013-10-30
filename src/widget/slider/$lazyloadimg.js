/**
 * @file 图片懒加载插件
 * @import widget/slider/slider.js
 */
(function( gmu ) {

    gmu.Slider.template.item = '<div class="ui-slider-item">' +
            '<a href="<%= href %>">' +
            '<img lazyload="<%= pic %>" alt="" /></a>' +
            '<% if( title ) { %><p><%= title %></p><% } %>' +
            '</div>';

    /**
     * 图片懒加载插件
     * @class lazyloadimg
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'lazyloadimg', {
        _init: function() {
            this.on( 'ready slide', this._loadItems );
        },

        _loadItems: function() {
            var opts = this._options,
                loop = opts.loop,
                viewNum = opts.viewNum || 1,
                index = this.index,
                i,
                len;

            for ( i = index - viewNum, len = index + 2 * viewNum; i < len;
                    i++ ) {

                this.loadImage( loop ? this._circle( i ) : i );
            }
        },

        /**
         * 加载指定item中的图片
         * @method loadImage
         * @param {Number} index 要加载的图片的序号
         * @for Slider
         * @uses Slider.lazyloadimg
         */
        loadImage: function( index ) {
            var item = this._items[ index ],
                images;

            if ( !item || !(images = gmu.staticCall( item, 'find',
                    'img[lazyload]' ), images.length) ) {

                return this;
            }

            images.each(function() {
                this.src = this.getAttribute( 'lazyload' );
                this.removeAttribute( 'lazyload' );
            });
        }
    } );
})( gmu );