/**
 * @file 自动播放功能
 * @import widget/slider/slider.js
 */
(function( gmu, $ ) {
    $.extend( true, gmu.Slider, {
        options: {
            autoPlay: true,    // 是否开启自动播放
            interval: 4000
        }
    } );

    gmu.Slider.register( 'autoplay', {
        _init: function() {
            var me = this;
            me.on( 'slideend ready', me.resume );

            // 避免滑动时，自动切换
            this.getEl()
                    .on( 'touchstart', $.proxy( me.stop, me ) )
                    .on( 'touchend', $.proxy( me.resume, me ) );
        },

        resume: function() {
            var me = this,
                opts = me._options;

            if ( opts.autoPlay && !me._timer ) {
                me._timer = setTimeout( function() {
                    me.slideTo( me.index + 1 );
                    me._timer = null;
                }, opts.interval );
            }
            return me;
        },

        stop: function() {
            var me = this;

            if ( me._timer ) {
                clearTimeout( me._timer );
                me._timer = null;
            }
            return me;
        }
    } );
})( gmu, gmu.$ );