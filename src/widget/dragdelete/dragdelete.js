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
            item: '<li><p class="ui-dragdelete-itemwrap"><span class="ui-dragdelete-item"><%=item%></span></p></li>',
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


            me.$wrap = $( me.tpl2html( 'wrap' ) ).appendTo(opts.container);

            me.$clear = $( me.tpl2html( 'clear' ) ).appendTo(opts.container);

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
                velocity;

            me.$clear.on( 'tap' + me.eventNs, function() {
                //TODO confirm 改成插件
                me.$wrap.html('');

                me.trigger( 'clear' );
            } );

            me.$wrap.on( "touchstart", function(ev) {
                touch = ev.touches[0],
                $target = $(touch.target),
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
                $target.css('-webkit-transform', 'translate3d(' + (currentX - touchstartx) + 'px, 0, 0)');
                // TODO 透明度变化

                
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
                    }
                }else{
                    me.removeItem( $target );
                }

                $target = null;
            } );
        },

        show: function() {
            this.$el.show();

            return me;
        },

        hide: function() {
            this.$el.hide();

            return me;
        },

        addItem: function( item ) {
            var me = this;

            me.$wrap.append( me.tpl2html( 'item', {'item': item} ) );
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

        removeItem: function( item ) {
            var me = this;

            item.css( 'transition-duration', '500ms' );
            item.css( '-webkit-transform', 'translate3d(' + item.width() + 'px, 0, 0)' );

            item.on( 'transitionend', function(){
                item.parent().remove();
                me.trigger( 'itemDelete', {item: item});
            } );

        }
    } );
})( gmu, gmu.$ );
