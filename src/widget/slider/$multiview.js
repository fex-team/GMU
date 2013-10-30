/**
 * @file 图片轮播显示点功能
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( gmu.Slider.options, {
        /**
         * @property {Number} [viewNum=2] 当slider为multiview模式时，用来指定一页显示多少个图片。
         * @namespace options
         * @for Slider
         * @uses Slider.multiview
         */
        viewNum: 2,
        /**
         * @property {Number} [travelSize=2] 用来指定当操作上下导航时，一次滑动多少个张图片，如果这个值与viewNum值一致，就是一次滑动一屏的效果。
         * @namespace options
         * @for Slider
         * @uses Slider.multiview
         */
        travelSize: 2
    } );

    /**
     * 图片轮播显示点功能
     * @class multiview
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'multiview', {
        _arrange: function( width, index ) {
            var items = this._items,
                viewNum = this._options.viewNum,
                factor = index % viewNum,
                i = 0,
                perWidth = this.perWidth = Math.ceil( width / viewNum ),
                item,
                len;

            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];

                item.style.cssText += 'width:' + perWidth + 'px;' +
                        'left:' + (i * -perWidth) + 'px;';
                item.setAttribute( 'data-index', i );

                i % viewNum === factor && this._move( i,
                        i < index ? -width : i > index ? width : 0,
                        0, Math.min( viewNum, len - i ) );
            }

            this._container.css( 'width', perWidth * len );
        },

        _move: function( index, dist, speed, immediate, count ) {
            var perWidth = this.perWidth,
                opts = this._options,
                i = 0;

            count = count || opts.viewNum;

            for ( ; i < count; i++ ) {
                this.origin( opts.loop ? this._circle( index + i ) :
                        index + i, dist + i * perWidth, speed, immediate );
            }
        },

        _slide: function( from, diff, dir, width, speed, opts, mode ) {
            var me = this,
                viewNum = opts.viewNum,
                len = this._items.length,
                offset,
                to;

            // 当不是loop时，diff不能大于实际能移动的范围
            opts.loop || (diff = Math.min( diff, dir > 0 ?
                            from : len - viewNum - from ));

            to = me._circle( from - dir * diff );

            // 如果不是loop模式，以实际位置的方向为准
            opts.loop || (dir = Math.abs( from - to ) / (from - to));

            diff %= len;    // 处理diff大于len的情况

            // 相反的距离比viewNum小，不能完成流畅的滚动。
            if ( len - diff < viewNum ) {
                diff = len - diff;
                dir = -1 * dir;
            }

            offset = Math.max( 0, viewNum - diff );

            // 调整初始位置，如果已经在位置上不会重复处理
            // touchend中执行过来的，不会执行以下代码
            if ( !mode ) {
                this._move( to, -dir * this.perWidth *
                        Math.min( diff, viewNum ), 0, true );
                this._move( from + offset * dir, offset * dir *
                        this.perWidth, 0, true );
            }

            this._move( from + offset * dir, width * dir, speed );
            this._move( to, 0, speed );

            this.index = to;
            return this.trigger( 'slide', to, from );
        },

        prev: function() {
            var opts = this._options,
                travelSize = opts.travelSize;

            if ( opts.loop || (this.index > 0, travelSize =
                    Math.min( this.index, travelSize )) ) {

                this.slideTo( this.index - travelSize );
            }

            return this;
        },

        next: function() {
            var opts = this._options,
                travelSize = opts.travelSize,
                viewNum = opts.viewNum;

            if ( opts.loop || (this.index + viewNum < this.length &&
                    (travelSize = Math.min( this.length - 1 - this.index,
                    travelSize ))) ) {

                this.slideTo( this.index + travelSize );
            }

            return this;
        }
    } );
})( gmu, gmu.$ );