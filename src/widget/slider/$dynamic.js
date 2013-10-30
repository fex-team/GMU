/**
 * @file 内容可动态修改插件
 * 此插件扩充slider， 让内容可以动态修改，在这种模式下，dom个数跟items的个数无关，
 * 永远是3个div轮换，对于图片集比较多的图片轮播，采用这种方式。
 * @import widget/slider/slider.js
 */
(function( gmu, $ ) {
    /**
     * @property {Number} [edgeThrottle=0] 默认当slider滚动到第一张或者到最后一张时，会触发edge事件。但如果这个值为1时，当slider滚动倒数第二张时就会触发edge事件。以此类推。
     * @namespace options
     * @for Slider
     * @uses Slider.dynamic
     */
    gmu.Slider.options.edgeThrottle = 0;

    /**
     * 内容可动态修改插件，此插件扩充slider， 让内容可以动态修改，在这种模式下，dom个数跟items的个数无关，永远是3个div轮换，对于图片集比较多的图片轮播，采用这种方式。
     * @class dynamic
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'dynamic', {
        _init: function() {
            var me = this;

            // 当滑动结束后调整
            me.on( 'slideend', me._adjustPos );
            me.getEl().on( 'touchstart' + me.eventNs, function() {
                me._adjustPos();
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                group;

            if ( !opts.content || opts.content.length < 3 ) {
                throw new Error( '以动态模式使用slider，至少需要传入3组数据' );
            }

            opts.viewNum = 1;    // 只能处理viewNum为1的情况
            opts.loop = false;    // 不支持loop

            this._group = group = $( '<div class="ui-slider-group"></div>' );
            me._renderItems( opts.content, opts.index, group );
            group.appendTo( me.getEl() );
            opts.index = me.index;

            me.origin();
            me._adjustPos( true );
        },

        trigger: function( e, to ) {

            if ( e === 'slide' || e.type === 'slide' ) {
                this._active = this._pool[ to ];
                this._flag = true;    // 标记需要调整
            }
            return this.origin.apply( this, arguments );
        },

        slideTo: function( to, speed ) {
            var index = this.getIndex();

            // 一次只允许移动一张
            if ( Math.abs( to - index ) !== 1 ) {
                return;
            }

            this._adjustPos();

            return this.origin( to + this.index - index, speed );
        },

        prev: function() {
            var index = this.getIndex();

            index > 0 && this.slideTo( index - 1 );

            return this;
        },

        next: function() {
            var index = this.getIndex();

            index < this._content.length - 1 && this.slideTo( index + 1 );

            return this;
        },

        // 调整位置，如果能移动的话，将当前的总是移动到中间。
        _adjustPos: function( force, ignoreEdge ) {

            if ( !force && !this._flag ) {
                return;
            }

            var me = this,
                opts = me._options,
                content = me._content,
                group = me._group,
                index = $.inArray( me._active, content ),
                delta = me.index - 1,
                next = index + delta,
                item,
                elem;

            if ( delta && next < content.length && next >= 0 ) {
                item = content[ next ];
                elem = $( me.tpl2html( 'item', item ) );
                gmu.staticCall( me._items[ 1 - delta ], 'remove' );
                group[ delta < 0 ? 'prepend' : 'append' ]( elem );
                me.trigger( 'dom.change' );

                me._pool.splice( 1 - delta, 1 );
                me._pool[ delta < 0 ? 'unshift' : 'push' ]( item );

                me.index -= delta;
                me._items = group.children().toArray();
                me._arrange( me.width, me.index );
            }

            // 到达边缘
            if ( !ignoreEdge && (index === opts.edgeThrottle || index ===
                    content.length - opts.edgeThrottle - 1) ) {
                me.trigger( 'edge', index === opts.edgeThrottle, me._active );
            }

            me._flag = false;
            return me;
        },

        _renderItems: function( content, index, group ) {
            var arr = content.slice( index, index + (index > 0 ? 2 : 3) ),
                rest = 3 - arr.length;

            // 避免外部直接修改，影响内部代码
            this._content = content.concat();
            this._active = content[ index ];
            rest && (arr = content.slice( index - rest, index )
                    .concat( arr ));
            this.index = rest;
            this._createItems( group, this._pool = arr );
        },

        /**
         * 获取当前显示的元素索引
         * @method getIndex
         * @chainable
         * @return {Number} 当前显示的元素索引
         * @for Slider
         * @uses Slider.autoplay
         */
        getIndex: function() {
            return $.inArray( this._active, this._content );
        },

        /**
         * 获取当前显示的元素数据对象
         * @method active
         * @chainable
         * @return {Number} 当前显示的元素索引
         * @for Slider
         * @uses Slider.autoplay
         */
        active: function() {
            return this._active;
        },

         /**
         * 获取内容或者更新内容，直接换掉content中数据，然后重新渲染新设置的内容。在需要延时扩充图片集的情况下使用。
         * @method content
         * @chainable
         * @return {Number} 当前显示的元素索引
         * @for Slider
         * @uses Slider.autoplay
         */
        content: function( content ) {

            // getter
            if ( !$.isArray( content ) ) {
                return this._content.concat();
            }

            var me = this,
                active = me._active,
                index = $.inArray( active, content ),
                group = this._group.empty();

            ~index || (index = 0);
            me._renderItems( content, index, group );
            me._items = group.children().toArray();
            me._arrange( me.width, me.index );

            me._adjustPos( false, true );
            me.trigger( 'dom.change' );
        }
    } );
})( gmu, gmu.$ );