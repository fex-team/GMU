/**
 * @fileoverview slider的手势插件，扩展slider的手指跟随功能
 */
(function( $, undefined ) {
    var $doc = $( document );

    /*jsbint strictchain:false*/
    $.ui.slider.register(function() {

        // 注意，多个实例之间，并不共享这些变量
        var map = {
                touchstart: '_start',
                touchmove: '_move',
                touchend: '_end',
                touchcancel: '_end'
            },
            handler = function( e ) {
                var opts = this._data;

                map[ e.type ] && this[ map[ e.type ] ].call( this, e );

                opts.stopPropagation && e.stopPropagation();
            },
            isScrolling,
            start,
            delta,
            moved;


        return {
            pluginName: 'touch',

            _init: function() {
                this._initOrg();

                handler = $.proxy( handler, this );

                // 绑定手势
                this.root().on( 'touchstart.slider', handler );
                
                // 阻止误点击
                this._container.on( 'click.slider', function( e ) {
                    moved && e.preventDefault();
                } );
            },

            _start: function( e ) {
                
                // 不处理多指
                if ( e.touches.length > 1 ) {
                    return false;
                }

                var touche = e.touches[ 0 ],
                    viewNum = this._data.viewNum;

                start = {
                    x: touche.pageX,
                    y: touche.pageY,
                    time: +new Date()
                };

                delta = {};
                moved = false;
                isScrolling = undefined;

                this._moveTo( this.index - viewNum, -this.width, 0,
                        viewNum * 3, true );

                this.stop();
                $doc.on( 'touchmove.slider touchend.slider touchcancel.slider',
                        handler );
            },

            _move: function( e ) {

                // 多指或缩放不处理
                if ( e.touches.length > 1 || e.scale &&
                        e.scale !== 1 ) {
                    return false;
                }

                var opts = this._data,
                    touche = e.touches[ 0 ],
                    viewNum = opts.viewNum,
                    index = this.index,
                    i = 0,
                    from,
                    pos,
                    slidePos;

                opts.disableScroll && e.preventDefault();

                delta.x = touche.pageX - start.x;
                delta.y = touche.pageY - start.y;

                if ( typeof isScrolling === 'undefined' ) {
                    isScrolling = Math.abs( delta.x ) <
                            Math.abs( delta.y );
                }

                if ( !isScrolling ) {
                    e.preventDefault();

                    if ( !opts.loop ) {

                        // 如果左边已经到头
                        delta.x /= (!index && delta.x > 0 ||

                                // 如果右边到头
                                index === this._items.length - viewNum && 
                                delta.x < 0) ?

                                // 则来一定的减速
                                (Math.abs( delta.x ) / this.width + 1) : 1;
                    }

                    slidePos = this._slidePos;

                    for ( from = index - viewNum; i < 3 * viewNum; i++ ) {

                        pos = opts.loop ? this._circle( from + i ) : from + i;
                        this._translate( pos,
                                delta.x + slidePos[ pos ], 0 );
                    }

                    moved = true;
                }
            },

            _end: function() {
                var opts = this._data,
                    index = this.index,
                    viewNum = opts.viewNum,
                    slidePos = this._slidePos,
                    duration = +new Date() - start.time,
                    absDeltaX = Math.abs( delta.x ),

                    // 是否滑出边界
                    isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                        index === slidePos.length - viewNum && delta.x < 0),

                    // -1 向右 1 向左
                    dir = delta.x > 0 ? 1 : -1,
                    speed,
                    diff,
                    to,
                    i,
                    pos;

                if ( moved ) {

                    if ( duration < 250 ) {

                        // 如果滑动速度比较快，偏移量跟根据速度来算
                        speed = absDeltaX / duration;
                        diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                                viewNum );
                    } else {
                        diff = Math.round( absDeltaX / this.perWidth );
                    }
                    
                    if ( diff && !isPastBounds ) {
                        opts.loop || (diff = Math.min( diff, dir > 0 ?
                                index : slidePos.length - viewNum - index ));

                        to = this._circle( index - dir * diff );
                        
                        this._moveTo( index + (viewNum - diff) * dir,
                                this.width * dir, opts.animationTime );
                        this._moveTo( to, 0, opts.animationTime );

                        this._updateDots( to, index );
                        this.index = to;
                        this.trigger( 'slide', [ to, index ] );
                    } else {
                        
                        // 滑回去
                        for ( i = index - viewNum; i <= index + viewNum; i++ ) {
                            pos = opts.loop ? this._circle( i ) : i;
                            this._translate( pos, slidePos[ pos ], 
                                    opts.animationTime );
                        }
                    }
                } else {
                    this.resume();
                }

                $doc.off( 'touchmove.slider touchend.slider touchcancel.slider',
                        handler );
            },

            destroy: function() {
                this.root().off( 'touchstart.slider', handler );
                this._container.off( 'click.slider' );
                return this.destroyOrg();
            }
        };
    });
})( Zepto );