/**
 * @fileoverview slider左右切换组件
 * @import core/touch.js, core/zepto.ui.js
 */
(function( $ ) {

    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

        // todo 检测3d是否支持。
        translateZ = ' translateZ(0)';

    // 调用此方法，可以减小重复实例化Zepto的开销。
    $.staticCall = $.staticCall || (function() {
        var proto = $.fn,

            // 公用此zepto实例
            instance = $();

        instance.length = 1;

        return function( item, fn ) {
            instance[ 0 ] = item;
            return proto[ fn ].apply( instance, $.slice( arguments, 2 ) );
        };
    })();

    /* jsbint strictchain:false */
    $.ui.define( 'slider', {
        _data: {
            viewNum: 1,
            itemRender: null,
            imgZoom: false,
            loop: false,
            stopPropagation: false,
            autoPlay: true,
            autoPlayTime: 4000,    // intervel
            animationTime: 400,    // speed
            showArr: true,    // arrow available
            showDot: true,    // dot available
            slide: null,
            slideend: null,
            index: 0,
            lazyloadImg: true,
            containerSelector: '.ui-slider-group',    // 容器的选择器
            dotSelector: '.ui-slider-dots',    // 所有点父级的选择器
            prevSelector: '.ui-slider-pre',    // 上一张按钮选择器
            nextSelector: '.ui-slider-next'    // 下一张按钮选择器
        },

        // 确保有个div
        _create: function() {
            this.root() || this.root( '<div></div>' );
        },

        // 根据opts.content里面的数据挨个render插入到container中
        _createItems: function( container, arr ) {
            var opts = this._data,
                items = arr || opts.content,
                i = 0,
                len = items.length,
                render = opts.itemRender || this._itemRender;

            for ( ; i < len; i++ ) {
                container.append( render.call( this, items[ i ] ) );
            }
        },

        // 初始化dom节点相关。
        _initDom: function( $el, opts, viewNum ) {
            var container,
                dot,
                prev,
                next,
                items;

            // 检测容器节点是否指定
            container = $el.find( opts.containerSelector );

            // 没有指定容器则创建容器
            if ( !container.length ) {
                container = $( '<div></div>' );

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if ( !opts.content ) {
                    container.append( $el.children() );
                } else {
                    this._createItems( container );
                }

                container.appendTo( $el );
            }

            // 检测是否构成循环条件
            if ( (items = container.children()).length < viewNum + 1 ) {
                opts.loop = false;
            }

            // 如果节点少了，需要复制几份
            while ( opts.loop && container.children().length < 3 * viewNum ) {
                container.append( items.clone() );
            }

            this.length = items.length;

            this._items = (this._container = container)
                    .addClass( 'ui-slider-group' )
                    .children()
                    .addClass( 'ui-slider-item' )
                    .toArray();

            // 处理dot节点
            if ( opts.showDot ) {
                dot = $el.find( opts.dotSelector );

                if ( !dot.length ) {
                    dot = $( '<p>' +
                            (new Array( this.length + 1 ))
                            .join( '<b></b>' ) + '</p>' )
                            .appendTo( $el );
                }

                this._dots = dot
                        .addClass( 'ui-slider-dots' )
                        .children()
                        .toArray();
            }

            // 处理prev next
            if ( opts.showArr ) {
                prev = $el.find( opts.prevSelector );
                prev.length || (prev = $( '<span class="ui-slider-pre">' +
                        '</span>' ).appendTo( $el ));
                this._prev = prev;

                next = $el.find( opts.nextSelector );
                next.length || (next = $( '<span class="ui-slider-next">' +
                        '</span>' ).appendTo( $el ));
                this._next = next;
            }

            $el.addClass( 'ui-slider' );
            return this;
        },

        _initWidth: function( $el, viewNum, index, ignoreWidth ) {
            var factor = index % viewNum,
                i = 0,
                width = this.width,
                perWidth = this.perWidth,
                len,
                items,
                item;

            if ( !ignoreWidth || !width ) {
                this.width = width = $el.width();

                // 在隐藏模式下，直接不执行。
                if ( !width ) {
                    return ;
                }
                this.height = $el.height();
                this.perWidth = perWidth = Math.ceil( width / viewNum );
            }

            items = this._items;
            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];
                
                item.style.cssText += 'width:' + perWidth + 'px;' +
                        'left:' + (i * -perWidth) + 'px;';
                item.setAttribute( 'data-index', i );

                i % viewNum === factor && this._moveTo( i, 
                        i < index ? -width : i > index ? width : 0,
                        0, Math.min( viewNum, len - i ) );
            }

            this._container.css( 'width', perWidth * len );
            return this;
        },

        _init: function() {
            var me = this,
                $el = this.root(),
                opts = this._data,
                viewNum = opts.viewNum,
                index = this.index = opts.index;

            this._initDom( $el, opts, viewNum )
                    ._initWidth( $el, viewNum, index )
                    ._loadImages( this._items, viewNum, index, opts )
                    ._updateDots( index );

            // 开始自动播放
            this.resume();

            // 绑定各种事件
            this._prev && this._prev.on( 'tap.slider', function() {
                me.prev();
            } );

            this._next && this._next.on( 'tap.slider', function() {
                me.next();
            } );

            this._container.on( transitionEnd + '.slider',
                    $.proxy( this._tansitionEnd, this ) );

            $( window ).on( 'ortchange.slider', $.proxy( this.update, this ) );

            this.on( 'slide.slider', function() {
                this._loadImages( this._items, viewNum, this.index, opts );
            } );
        },

        _moveTo: function( index, dist, speed, count, immediate ) {
            var opts = this._data,
                perWidth = this.perWidth,
                slidePos = this._slidePos,
                items = this._items,
                loop = opts.loop,
                i = 0,
                _index,
                _dist;

            count = count || opts.viewNum;

            for ( ; i < count; i++ ) {
                _dist = dist + i * perWidth;
                _index = loop ? this._circle( index + i ) : index + i;

                if ( !loop && !items.hasOwnProperty( _index ) ||
                        slidePos[ _index ] === _dist ) {
                    continue;
                }

                this._translate( _index, _dist, speed );
                slidePos[ _index ] = _dist;    // 记录目标位置

                // 强制一个reflow
                immediate && items[ _index ].clientLeft;
            }
        },

        _translate: function( index, dist, speed ) {
            var slide = this._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    dist + 'px, 0)' + translateZ + ';';
        },

        _circle: function( index, arr ) {
            arr = arr || this._items;

            // <<4 用来实现 x 16 的效果，减少返回值是负值的可能
            return ((arr.length << 4) + index) % arr.length;
        },

        _itemRender: function( item ) {
            return '<div class="ui-slider-item">' +
                '<a href="' + item.href + '">' +
                '<img lazyload="' + item.pic + '"/></a>' +
                (item.title ? '<p>' + item.title + '</p>' : '') +
                '</div>';
        },

        _loadImages: function( items, viewNum, index, opts ) {

            if ( !opts.lazyloadImg ) {
                return this;
            }

            var me = this,
                i = 0,
                start = index - viewNum,
                loop = this._data.loop,
                load = function() {
                    opts.imgZoom && $.staticCall( this, 'one', 'load', 
                            $.proxy( me._imgZoom, me ) );
                    this.src = this.getAttribute( 'lazyload' );
                    this.removeAttribute( 'lazyload' );
                },
                item,
                images,
                len;

            for ( len = viewNum * 3; i < len; i++ ) {
                item = items[ loop ? this._circle( start + i ) : start + i ];
                
                if ( item && (images = $.staticCall( item, 
                        'find', 'img[lazyload]' )) ) {

                    images.each( load );
                }
            }
            return this;
        },

        _imgZoom: function( e ) {
            var img = e.target,
                scale;

            scale = Math.min( this.width / img.width, 
                    this.height / img.height );
            
            // 只缩放，不拉伸
            if ( scale < 1 ) {
                img.style.width = scale * img.width + 'px';
            }
        },

        prev: function( onepage ) {
            var opts = this._data,
                viewNum = opts.viewNum;

            if ( opts.loop || this.index > 0 ) {
                this.slideTo( this.index - (onepage ? viewNum : 1) );
            }

            return this;
        },

        next: function( onepage ) {
            var opts = this._data,
                viewNum = opts.viewNum;

            if ( opts.loop || this.index + viewNum - 1 < this.length - 1 ) {
                this.slideTo( this.index + (onepage ? viewNum : 1) );
            }

            return this;
        },

        slideTo: function( to, speed ) {
            
            if ( this.index === to || this.index === this._circle( to ) ) {
                return;
            }

            var opts = this._data,
                viewNum = opts.viewNum,
                index = this.index,
                len = this._items.length,
                diff = Math.abs( index - to ),

                // 1向左，-1向右
                dir = diff / (index - to),
                width = this.width,
                offset;

            to = this._circle( to );

            // 如果不是loop模式，以实际位置的方向为准
            if ( !opts.loop ) {
                dir = Math.abs( index - to ) / (index - to); 
            }

            diff %= len;

            // 相反的距离比viewNum小，不能完成流畅的滚动。
            if ( len - diff < viewNum ) {
                diff = len - diff;
                dir = -1 * dir;
            }

            offset = Math.max( 0, viewNum - diff );

            // 调整初始位置，如果已经在位置上不会重复处理
            this._moveTo( to, -dir * this.perWidth * Math.min( diff, viewNum ),
                    0, viewNum, true );
            this._moveTo( index + offset * dir, offset * dir * this.perWidth, 
                    0, viewNum, true );

            this._moveTo( index + offset * dir, width * dir, 
                    speed || opts.animationTime );
            this._moveTo( to, 0, speed || opts.animationTime );

            this._updateDots( to, index );
            this.index = to;
            this.trigger( 'slide', [ to, index ] );
            return this;
        },

        update: function() {
            var me = this;
            me._initWidth( me.root(), me._data.viewNum, me.index );
        },

        _updateDots: function( to, from ) {
            var dots = this._dots;

            if ( !dots ) {
                return this;
            }

            typeof from === 'undefined' || $.staticCall( dots[ 
                from % this.length ], 'removeClass', 'ui-slider-dot-select' );
            $.staticCall( dots[ to % this.length ], 'addClass',
                    'ui-slider-dot-select' );
        },

        _tansitionEnd: function( e ) {

            // ~~用来类型转换，等价于parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !==
                    this.index ) {
                return false;
            }
            
            this.resume();
            this.trigger( 'slideend', this.index );
        },

        resume: function() {
            var opts = this._data,
                me = this;

            if ( opts.autoPlay && !this._timer ) {
                this._timer = setTimeout( function() {
                    me.slideTo( me.index + 1 );
                    me._timer = null;
                }, opts.autoPlayTime );
            }
            return this;
        },

        stop: function() {
            
            if ( this._timer ) {
                clearTimeout( this._timer );
                this._timer = null;
            }
            return this;
        },

        destroy: function() {
            this._prev && this._prev.off( 'tap.slider' );
            this._next && this._next.on( 'tap.slider' );
            this._container.off( transitionEnd + '.slider', 
                    this._tansitionEnd );
            $( window ).off( 'ortchange.slider' );
            return this.$super( 'destroy' );
        }
    } );
})( Zepto );