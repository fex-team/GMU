/**
 * @file 滑动删除组件
 * @name Dragdelete
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/dragdelete/dragdelete.html</qrcode>
 * 滑动删除组件
 * @import core/widget.js, extend/touch.js, widget/dialog.js
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
            item: '<li data-id="<%=id%>"><p class="ui-dragdelete-itemwrap"><span class="ui-dragdelete-item"><%=context%></span></p></li>',
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
                targetId,
                startTimestamp,
                endTimestamp,
                touchstartx,
                currentX,
                velocity,
                movedPercentage;

            me.$wrap.on( 'tap' + me.eventNs, function(ev) {
                $target = $( ev.target );

                if( !$target.hasClass( 'ui-dragdelete-itemwrap' ) && 
                    !($target = $target.parents( '.ui-dragdelete-itemwrap') ).length ) {
                    $target = null;
                    return;
                }

                targetId = $target.parent().attr( 'data-id' );

                me.items.forEach( function( _item, index ) {
                    if ( _item.id === targetId ) {
                         me.trigger( 'itemTouch', {'item': _item.value} );
                    }
                } );
               
            } );

            me.$clear.on( 'tap' + me.eventNs, function( ev ) {
                // 防止穿透
                setTimeout( function() {
                    gmu.Dialog({
                        closeBtn: false,
                        buttons: {
                            '清空': function(){
                                me.clear();
                                this.destroy();
                            },
                            '取消': function(){
                                this.destroy();
                            }
                        },
                        title: '清空历史',
                        content: '<p>是否清空搜索历史？</p>',
                        open: function(){
                            this._options._wrap.addClass( 'ui-dragdelete-dialog' );
                        }
                    });
                    
                }, 10 );

                    ev.preventDefault();
                    ev.stopPropagation();
            } );

            me.$wrap.on( 'touchstart' + me.eventNs, function(ev) {
                touch = ev.touches[0],
                $target = $( touch.target ),
                startTimestamp = ev.timeStamp;
                currentX = touchstartx = parseInt( ev.touches[0].pageX );

                if( !$target.hasClass( 'ui-dragdelete-itemwrap' ) && 
                    !($target = $target.parents( '.ui-dragdelete-itemwrap') ).length ) {
                    $target = null;
                    return;
                }

                $target.css( 'width',  $target.width() - parseInt( $target.css( 'border-left-width' ) ) - parseInt( $target.css( 'border-right-width' ) ));

            } );

            me.$wrap.on( 'touchmove' + me.eventNs, function(ev) {
                if( !$target ) {
                    return;
                }
                currentX = ev.touches[0].pageX;
                movedPercentage = (currentX - touchstartx)/me.$wrap.width();

                // TODO 有点卡，需要优化
                $target.addClass('ui-dragdelete-itemmoving');
                $target.css( '-webkit-transform', 'translate3d(' + (currentX - touchstartx) + 'px, 0, 0)' );
                $target.css( 'opacity', 1 - movedPercentage );
                
                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( 'touchend' + me.eventNs, function(ev) {
                if( !$target ) {
                    return;
                }

                endTimestamp = ev.timeStamp;
                $target.removeClass('ui-dragdelete-itemmoving');

                // 如果移动的距离小于1/3，速度快则删除，速度慢则还原
                if(Math.abs( currentX - touchstartx ) < me.$wrap.width()/3){
                    velocity = (currentX - touchstartx) / (endTimestamp - startTimestamp);
                    if(Math.abs( velocity ) > 0.1){
                        me.removeItem( $target );
                    }else{
                        $target.css( 'width', 'auto' );
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

        _getItemId: function() {
            var me = this;

            me._itemId === undefined ? (me._itemId = 1) : ++me._itemId;

            return '__dd__' + me._itemId;
        },

        _getFormatItem: function( item ) {
            var me = this;

            if( Object.prototype.toString.call( item ) === '[object String]' ) {
                return {
                    'context': item,
                    'value': item,
                    'id': me._getItemId()
                }
            } else {
                return {
                    'context': item.context || item.value,
                    'value': item.value || item.context,
                    'id': me._getItemId()
                }
            }
        },

        addItem: function( item ) {
            var me = this,
                item = me._getFormatItem( item );

            // 检查me.items中是否已存在该项
            me.items.forEach( function( _item, index ) {
                if ( _item.value === item.value ) {
                    me.items.splice( index, 1);
                    $( me.$wrap.children()[index] ).remove();

                    return;
                }
            } );

            me.$wrap.children().length === 0 ? 
                me.$wrap.append( me.tpl2html( 'item', item ) ) : 
                $( me.tpl2html( 'item', item ) ).insertBefore( me.$wrap.children()[0] );
            
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

            $target.css( '-webkit-transform', 'translate3d(' + $target.width() + 'px, 0, 0)' );

            // TODO 根据位移计算透明度

            $target.on( 'transitionEnd' + me.eventNs +  ' webkitTransitionEnd' + me.eventNs, function() {
                $target.parent().remove();
                me.items.forEach( function( _item, index ) {
                    if ( _item.id === $target.parent().attr( 'data-id' ) ) {
                        me.items.splice( index, 1);
                        me.trigger( 'itemDelete', {'item': _item.value} );

                        return;
                    }
                } );
            } );

        },

        clear: function() {
            var me = this;

            me.$wrap.html( '' );
            me.items = [];
            me.sync = true;

            me.trigger( 'clear' );

            return me;
        },

        destroy: function() {
            var me = this;

            me.$wrap.off( me.eventNs );
            me.$clear.off( me.eventNs );

            me.$wrap.remove();

            return me.$super( 'destroy' );
        }
    } );
})( gmu, gmu.$ );
