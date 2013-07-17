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
            var me = this;

            me.$clear.on( 'tap' + me.eventNs, function() {
                //TODO confirm 改成插件
                me.$wrap.html('');

                me.trigger( 'clear' );
            } );

            me.$wrap.on("touchstart", function(ev){
                startTimestamp = ev.timeStamp;
                x = parseInt(ev.touches[0].pageX);
                console.log(x);
            });

            me.$wrap.on("touchmove", function(ev) {
                currentX = ev.touches[0].pageX;
                me.$wrap.css('marginLeft', currentX - x);
                ev.preventDefault();
                ev.stopPropagation();
            });

            me.$wrap.on("touchend", function(ev){
                currentTarget = null;
                
                endTimestamp = ev.timeStamp;

                // 如果移动的距离小于1/3，不删除，速度超过**时删除
                if(Math.abs(currentX - x) < window.innerWidth/3){
                    var velocity = (currentX - x) / (endTimestamp - startTimestamp);
                    if(Math.abs(velocity) > 0.1){
                        me.removeItem();
                    }else{
                        // 还原
                    }
                }else{
                    me.removeItem();
                }

            });
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

        removeItem: function() {

        }
    } );
})( gmu, gmu.$ );
