/**
 * @file 工具栏组件
 * @name Toolbar
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/toolbar/toolbar.html</qrcode>
 * 工具栏组件
 * @import core/widget.js, core/fix.js, core/highlight.js
 */
(function( gmu, $ ) {
    
    gmu.define( 'Toolbar', {

        options: {

            // 容器，默认为document.body
            container: document.body,

            // 标题
            title: '标题',

            // 标题左侧的按钮组
            leftBtns: [],

            // 标题右侧的按钮组
            rightBtns: []
        },

        template: '',

        tpl2html: function() {

        },

        _init: function() {
            var me = this;

            me.on( 'destroy', function() {
                // 解绑事件
                
                
                // 如果是通过setup模式创建，保留节点
                if( me._bySetup ) {

                } else {    // 如果是通过render模式创建，移除节点
                    me.$el.remove();
                }
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                container = $(opts.container);

            // 页面中不存在符合用户传入的选择器的节点
            if( !$el ) {
                me._bySetup = false;
                $el.appendTo( container );
            }

            me.addBtns( 'left', opts.leftBtns);
            me.addBtns( 'right', opts.rightBtns);


            me.trigger( 'create' );
        },

        _addBtn: function( contianer, btn ) {
            var me = this;

            contianer.append( btn );
        },

        addBtns: function( position, btns ) {
            var me = this,
                btnContainer = me.btnContainer[position];

            // 向下兼容：如果没有传position，认为在右侧添加按钮
            btns.forEach( function( index, btn ) {
                me._addBtn( btnContainer, btn );
            });
        },

        show: function() {
            this.$el.show();
            this.trigger( 'show' );
            this.isShowing = true;
        },

        hide: function() {
            this.$el.hide();
            this.trigger( 'hide' );
            this.isShowing = false;
        },

        toggle: function() {
            this.isShowing === true ? 
                this.hide() : this.show();
        }
    } );
})( gmu, gmu.$ );
