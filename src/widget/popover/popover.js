/**
 * @file 附近弹出组件
 * @import core/widget.js
 */
(function( gmu, $, undefined ) {
    
    gmu.define( 'Popover', {
        options: {

            // 容器选择器，不传将自我创建
            popover: null,

            // popover 内容
            content: null
        },

        template: {
            frame: '<div>'
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = opts.target && $( opts.target ) || me.getEl(),
                $root = opts.popover && $( opts.popover );

            // 没传 或者 就算传入了选择器，但是没有找到节点，还是得创建一个。
            $root && $root.length || ($root = $( me.tpl2html( 'frame' ) )
                    .addClass( 'ui-mark-temp' ));
            me.$root = $root;

            // 如果传入了content, 则作为内容插入到container中
            opts.content && me.setContent( opts.content );
            me.trigger( 'done.dom', $root.addClass( 'ui-popover' ), opts );

            // 如果节点是动态创建的，则不在文档树中，就把节点插入到$el后面。
            $root.parent().length || $el.after( $root );

            me.target( $el );
        },

        // 删除标记为组件临时的dom
        _checkTemp: function( $el ) {
            $el.is( '.ui-mark-temp' ) && $el.remove();
        },

        // 可以重复调用。
        show: function() {
            var me = this;
            
            me.trigger( 'placement', me.$root.addClass( 'in' ), me.$target );
            me._visible = true;
            me.trigger( 'show' );
        },

        hide: function() {
            var me = this,
                evt = new gmu.Event( 'beforehide' );

            me.trigger( evt );

            // 如果外部阻止了关闭，则什么也不做。
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            me.$root.removeClass( 'in' );
            me._visible = false;
            me.trigger( 'hide' );
        },

        toggle: function() {
            var me = this;
            return me[ me._visible ? 'hide' : 'show' ].apply( me, arguments );
        },

        // 设置target
        target: function( el ) {
            
            // getter
            if ( el === undefined ) {
                return this.$target;
            }

            // setter
            var me = this,
                $el = $( el ),
                orig = me.$target,
                click = 'click' + me.eventNs;

            orig && orig.off( click );

            // 绑定事件
            me.$target = $el.on( click, function( e ) {
                e.preventDefault();
                me.toggle();
            } );

            return me;
        },

        // 设置内容
        setContent: function( val ) {
            var container = this.$root;
            container.empty().append( val );
            return this;
        },

        destroy: function() {
            var me = this;
            
            me.$target.off( 'click' + me.eventNs );
            me._checkTemp( me.$root );
            return me.$super( 'destroy' );
        }
    } );
})( gmu, gmu.$ );