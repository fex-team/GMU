/**
 * @file 滑动删除组件
 * @name Dragdelete
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/dragdelete/dragdelete.html</qrcode>
 * 滑动删除组件
 * @import core/widget.js, extend/touch.js
 */
(function( gmu, $ ) {
    
    gmu.define( 'Dragdelete', {

        options: {

            // 容器，默认为document.body，这个时候body还没渲染完，所以在init里面要重新赋值
            container: document.body,

            items: []
        },

        template: {
            wrap: '<ul class="ui-dragdelete">',
            item: '<li data-item="<%=item%>"><p class="ui-dragdelete-itemwrap"><span class="ui-dragdelete-item"><%=item%></span></p></li>',
            clear: '<p class="ui-dragdelete-clear">清空搜索历史</p>'
        },

        _init: function() {
            var me = this,
                opts = me._options;

            me.$el = opts.container = opts.container || document.body;

            me.items = [];

            me.on( 'ready', function() {
                me._bindUI();
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options;


            me.$wrap = $( me.tpl2html( 'wrap' ) ).appendTo( opts.container );

            me.$clear = $( me.tpl2html( 'clear' ) ).appendTo( opts.container );

            me.addItems( opts.items );
        },

        _bindUI: function() {
            var me = this,
                touch,
                $target,
                startTimestamp,
                endTimestamp,
                touchstartx,
                currentX,
                velocity,
                movedPercentage;

            me.$clear.on( 'tap' + me.eventNs, function() {
                //TODO confirm 改成插件
                me.clear();
            } );

            me.$wrap.on( "touchstart", function(ev) {
                touch = ev.touches[0],
                $target = $( touch.target ),
                startTimestamp = ev.timeStamp;
                currentX = touchstartx = parseInt( ev.touches[0].pageX );

                if( !$target.hasClass( 'ui-dragdelete-itemwrap' ) && 
                    !($target = $target.parents( '.ui-dragdelete-itemwrap') ).length ) {
                    $target = null;
                    return;
                }

                $target.css( 'transition-duration', '0' );
                $target.css( 'transition-property', '-webkit-transform' );
                $target.css( 'width',  $target.width() - parseInt( $target.css( 'border-left-width' ) ) - parseInt( $target.css( 'border-right-width' ) ));
            } );

            me.$wrap.on( "touchmove", function(ev) {
                if( !$target ) {
                    return;
                }
                currentX = ev.touches[0].pageX;
                movedPercentage = (currentX - touchstartx)/me.$wrap.width();

                // TODO 有点卡，需要优化
                $target.css( '-webkit-transform', 'translate3d(' + (currentX - touchstartx) + 'px, 0, 0)' );
                $target.css( 'opacity', 1 - movedPercentage );
                
                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( "touchend", function(ev) {
                if( !$target ) {
                    return;
                }

                endTimestamp = ev.timeStamp;

                // 如果移动的距离小于1/3，速度快则删除，速度慢则还原
                if(Math.abs( currentX - touchstartx ) < me.$wrap.width()/3){
                    velocity = (currentX - touchstartx) / (endTimestamp - startTimestamp);
                    if(Math.abs( velocity ) > 0.1){
                        me.removeItem( $target );
                    }else{
                        $target.css( 'width', 'auto' );
                        $target.css( 'transition-duration', '120ms' );
                        $target.css( '-webkit-transform', 'translate3d(0, 0, 0)' );
                        $target.css( 'opacity', 1 );
                    }
                }else{
                    me.removeItem( $target );
                }

                $target = null;
            } );
        },

        show: function() {
            var me = this;

            if( me.sync === false ) {
                me.$wrap.html( '' );
                me.addItems( items );
                me.sync = true;
            }
            me.$el.show();
            me.isShow = true;

            return me;
        },

        hide: function() {
            var me = this;

            me.$el.hide();
            me.isShow = false;

            return me;
        },

        addItem: function( item ) {
            var me = this;

            // 检查me.items中是否已存在该项
            me.items.forEach( function( _item, index ) {
                if ( _item === item ) {
                    me.items.splice( index, 1);
                    $( me.$wrap.children()[index] ).remove();
                }
            } );

            me.$wrap.children().length === 0 ? 
                me.$wrap.append( me.tpl2html( 'item', {'item': item} ) ) : 
                $( me.tpl2html( 'item', {'item': item} ) ).insertBefore( me.$wrap.children()[0] );
            me.items.unshift( item );

            return me;
        },

        addItems: function( items ) {
            var me = this;

            items.forEach( function( item ) {
                me.addItem( item );
            } );

            return me;
        },

        /*
         * 更新数据，重新渲染列表
         */
        update: function( items ) {
            var me = this;

            me.items = items;

            if( me.isShow ) {
                me.$wrap.html( '' );
                me.addItems( items );
                me.sync = true;
            } else {
                me.sync = false;
            }

            return me;
        },

        removeItem: function( $target ) {
            var me = this;

            $target.css( 'transition-duration', '300ms' );
            $target.css( '-webkit-transform', 'translate3d(' + $target.width() + 'px, 0, 0)' );

            // TODO 根据位移计算透明度

            $target.on( 'transitionend', function() {
                $target.parent().remove();
                me.items.forEach( function( _item, index ) {
                    if ( _item === $target.parent().attr( 'data-item' ) ) {
                        me.items.splice( index, 1);
                    }
                } );
                me.trigger( 'itemDelete', {'item': $target} );
            } );

        },

        clear: function() {
            var me = this;

            me.$wrap.html( '' );
            me.items = [];
            me.sync = true;

            me.trigger( 'clear' );

            return me;
        }
    } );
})( gmu, gmu.$ );
