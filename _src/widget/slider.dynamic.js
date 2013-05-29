/**
 * @file Slider － 内容可动态修改插件
 * @name Slider.dynamic
 * @short Slider.dynamic
 * @desc <qrcode align="right" title="Live Demo">
 * ../gmu/_examples/widget/slider/slider_dynamic.html</qrcode>
 * 此插件扩充slider， 让内容可以动态修改，在这种模式下，dom个数跟items的个数无关，
 * 永远是3个div轮换，对于图片集比较多的图片轮播，采用这种方式。
 * @import widget/slider.js
 */
(function( $ ) {

    /* jsbint strictchain:false */
    $.ui.slider.register(function() {
        return {
            pluginName: 'dynamic',

            _setup: function() {
                throw new Error( 'This plugin does not support setup mode' );
            },

            _init: function() {
                var opts = this._data,
                    group;

                if ( opts.content.length < 4 ) {
                    throw new Error( '以动态模式使用slider，至少需要传入3组数据' );
                }

                opts.autoPlay =    // disable auto play
                opts.loop =    // disable loop
                opts.showDot =    // disable dot display.
                opts.lazyloadImg = false;
                opts.viewNum = 1;    // disable multiview.

                // 避免外部直接修改，影响内部代码
                this._content = opts.content.concat();

                group = $( '<div class="ui-slider-group"></div>' );
                this._renderItems( this._content, opts.index, group, opts );
                group.appendTo( this.root() );
                opts.index = this.index;

                this._initOrg();
                this._adjustPos( true );
            },

            trigger: function( e, data ) {

                // 当触发slide的时候执行
                if ( e === 'slide' || e.type === 'slide' ) {
                    this._active = this._pool[ data[ 0 ] ];
                    this._dir = data[ 0 ] - data[ 1 ] > 0 ? 1 : -1;
                }
                return this.triggerOrg.apply( this, arguments );
            },

            _start: function( e ) {

                // 不处理多指
                if ( e.touches.length > 1 ) {
                    return;
                }

                this._adjustPos();
                this._flag = true;

                return this._startOrg( e );
            },

            slideTo: function( to ) {

                if ( this.index === to || this.index === this._circle( to ) ) {
                    return;
                }

                this._adjustPos();
                this._flag = true;

                return this.slideToOrg.apply( this, arguments );
            },

            _tansitionEnd: function( e ) {
                this._adjustPos();
                return this._tansitionEndOrg( e );
            },

            _adjustPos: function( force ) {
                
                if ( !force && !this._flag ) {
                    return;
                }

                var opts = this._data,
                    $el = this.root(),
                    content = this._content,
                    length = content.length,
                    group = $el.find( opts.containerSelector ),
                    render = opts.itemRender || this._itemRender,
                    index,
                    delta,
                    next,
                    item,
                    elem;

                index = $.inArray( this._active, content );
                delta = this.index - 1;
                next = index + delta;

                if ( delta && next < length && next >= 0 ) {
                    item = content[ next ];
                    elem = $( render( item ) );
                    $.staticCall( this._items[ 1 - delta ], 'remove' );
                    group[ delta < 0 ? 'prepend' : 'append' ]( elem );

                    this._pool.splice( 1 - delta, 1 );
                    this._pool[ delta < 0 ? 'unshift' : 'push' ]( item );

                    this.index -= delta;
                    this._items = group.children().toArray();
                    this._initWidth( $el, 1, this.index, true );
                }

                // 到达边缘
                if ( index === 0 || index === length - 1 ) {
                    this.trigger( 'edge', [ index === 0, this._active ] );
                }

                this._flag = false;
                return this;
            },

            /**
             * @desc 获取当前显示的元素索引
             * @name getIndex
             * @grammar getIndex() => number
             *  @example
             * //setup mode
             * $('#slider').slider('getIndex');
             *
             * //render mode
             * var demo = $.ui.slider();
             * demo.getIndex();
             */
            getIndex: function() {
                return $.inArray( this._active, this._content );
            },

            /**
             * @desc 获取当前显示的元素数据对象
             * @name active
             * @grammar active() => Object
             *  @example
             * //setup mode
             * $('#slider').slider('active');
             *
             * //render mode
             * var demo = $.ui.slider();
             * demo.active();
             */
            active: function() {
                return this._active;
            },

            /**
             * @desc 获取内容或者更新内容，直接换掉content中数据，然后重新渲染新设置的内容。在需要延时扩充图片集的情况下使用。
             * @name content
             * @grammar content( content ) => self
             * @example
             * //setup mode
             * $('#slider').slider('content', [item1, item2, item3]);
             *
             * //render mode
             * var demo = $.ui.slider();
             * demo.content([item1, item2, item3]);
             */
            content: function( content ) {

                // getter
                if ( !$.isArray( content ) ) {
                    return this._content.concat();
                }

                var opts = this._data,
                    active = this._active,
                    index = $.inArray( active, content ),
                    $el = this.root(),
                    group;

                ~index || (index = this._dir > 0 ? 0 : content.length - 1);

                group = $el.find( '.ui-slider-group' ).empty();
                this._content = content = content.concat();
                this._renderItems( content, index, group, opts, true );
                this._items = group.children().toArray();
                this._initWidth( $el, 1, this.index, true );

                this._adjustPos();
                active !== this._active && this.trigger( 'slide', 
                        [ this.index, -1 ] );
            },

            _renderItems: function( content, index, group, center ) {
                var arr, 
                    rest;

                arr = content.slice( index, index + (center ? 2 : 3) );
                this._active = content[ index ];
                rest = 3 - arr.length;
                rest && (arr = content.slice( index - rest, index )
                        .concat( arr ));
                this.index = rest;
                this._createItems( group, this._pool = arr );
            },

            _itemRender: function( item ) {
                return '<div class="ui-slider-item">' +
                    '<a href="' + item.href + '">' +
                    '<img src="' + item.pic + '"/></a>' +
                    (item.title ? '<p>' + item.title + '</p>' : '') +
                    '</div>';
            }
        };
    });
})( Zepto );