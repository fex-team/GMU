/**
 * @file 图片轮播组件
 * @name Slider
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/slider/slider.html</qrcode>
 * 图片轮播组件
 * @import extend/touch.js, extend/event.ortchange.js, core/widget.js
 */
(function( gmu, $, undefined ) {
    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

        // todo 检测3d是否支持。
        translateZ = ' translateZ(0)',
        uid = 1;
    
    gmu.define( 'Slider', {

        // default options
        options: {

            // 是否连续滑动
            loop: false,
            
            // 动画执行速度
            speed: 400,

            // 初始位置
            index: 0,

            // 内部结果选择器定义
            selector: {
                container: '.ui-slider-group'    // 容器的选择器
            }
        },

        template: {
            item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                    '<img src="<%= pic %>" alt="" /></a>' +
                    '<% if( title ) { %><p><%= title %></p><% } %>' +
                    '</div>'
        },

        _create: function() {
            var me = this,
                $el = me.getEl(),
                opts = me._options;

            me.index = opts.index;

            // 初始dom结构
            me._initDom( $el, opts );

            // 更新width
            me._initWidth( $el, me.index );
            me._container.on( transitionEnd + me.eventNs,
                    $.proxy( me._tansitionEnd, me ) );

            // 转屏事件检测
            $( window ).on( 'ortchange' + me.eventNs, function() {
                me._initWidth( $el, me.index );
            } );
        },

        _initDom: function( $el, opts ) {
            var selector = opts.selector,
                viewNum = opts.viewNum || 1,
                items,
                container;

            // 检测容器节点是否指定
            container = $el.find( selector.container );

            // 没有指定容器则创建容器
            if ( !container.length ) {
                container = $( '<div></div>' );

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if ( !opts.content ) {

                    // 特殊处理直接用ul初始化slider的case
                    if ( $el.is( 'ul' ) ) {
                        this.$el = container.insertAfter( $el );
                        container = $el;
                        $el = this.$el;
                    } else {
                        container.append( $el.children() );
                    }
                } else {
                    this._createItems( container, opts.content );
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

            this.length = container.children().length;

            this._items = (this._container = container)
                    .addClass( 'ui-slider-group' )
                    .children()
                    .addClass( 'ui-slider-item' )
                    .toArray();

            this.trigger( 'done.dom', $el.addClass( 'ui-slider' ), opts );
        },

        // 根据items里面的数据挨个render插入到container中
        _createItems: function( container, items ) {
            var i = 0,
                len = items.length;

            for ( ; i < len; i++ ) {
                container.append( this.tpl2html( 'item', items[ i ] ) );
            }
        },

        _initWidth: function( $el, index, force ) {
            var me = this,
                width;

            // width没有变化不需要重排
            if ( !force && (width = $el.width()) === me.width ) {
                return;
            }

            me.width = width;
            me._arrange( width, index );
            me.height = $el.height();
            me.trigger( 'width.change' );
        },

        // 重排items
        _arrange: function( width, index ) {
            var items = this._items,
                i = 0,
                item,
                len;

            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];
                
                item.style.cssText += 'width:' + width + 'px;' +
                        'left:' + (i * -width) + 'px;';
                item.setAttribute( 'data-index', i );

                this._move( i, i < index ? -width : i > index ? width : 0, 0 );
            }

            this._container.css( 'width', width * len );
        },

        _move: function( index, dist, speed, immediate ) {
            var slidePos = this._slidePos,
                items = this._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            this._translate( index, dist, speed );
            slidePos[ index ] = dist;    // 记录目标位置

            // 强制一个reflow
            immediate && items[ index ].clientLeft;
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
            var len;

            arr = arr || this._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        },

        _tansitionEnd: function( e ) {

            // ~~用来类型转换，等价于parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !== this.index ) {
                return;
            }
            
            this.trigger( 'slideend', this.index );
        },

        _slide: function( from, diff, dir, width, speed, opts ) {
            var me = this,
                to;

            to = me._circle( from - dir * diff );

            // 如果不是loop模式，以实际位置的方向为准
            if ( !opts.loop ) {
                dir = Math.abs( from - to ) / (from - to);
            }
            
            // 调整初始位置，如果已经在位置上不会重复处理
            this._move( to, -dir * width, 0, true );

            this._move( from, width * dir, speed );
            this._move( to, 0, speed );

            this.index = to;
            return this.trigger( 'slide', to, from );
        },

        slideTo: function( to, speed ) {
            if ( this.index === to || this.index === this._circle( to ) ) {
                return this;
            }

            var opts = this._options,
                index = this.index,
                diff = Math.abs( index - to ),
                
                // 1向左，-1向右
                dir = diff / (index - to),
                width = this.width;

            speed = speed || opts.speed;

            return this._slide( index, diff, dir, width, speed, opts );
        },

        prev: function() {
            
            if ( this._options.loop || this.index > 0 ) {
                this.slideTo( this.index - 1 );
            }

            return this;
        },

        next: function() {
            
            if ( this._options.loop || this.index + 1 < this.length ) {
                this.slideTo( this.index + 1 );
            }

            return this;
        },

        getIndex: function() {
            return this.index;
        },

        destroy: function() {
            this._container.off( this.eventNs );
            $( window ).off( 'ortchange' + this.eventNs );
            return this.$super( 'destroy' );
        }
    } );

})( gmu, gmu.$ );