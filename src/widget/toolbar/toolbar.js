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

            // 标题左侧的按钮组，支持html、gmu button实例
            leftBtns: [],

            // 标题右侧的按钮组
            rightBtns: [],

            // 是否固定位置
            fix: false
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
                container = $( opts.container ),
                children = [],
                btnContainer = me.btnContainer = {
                    left: [],
                    right: []
                },
                currentConteiner = btnContainer['left'];

            if( $el ) {  // setup方式创建，从DOM中取出按钮组
                children  = $el.children();

                children.forEach( function( child ) {
                    /^[hH]/.test( child.tagName ) && (currentConteiner = btnContainer['right'], me.title = child);

                    !/^[hH]/.test( child.tagName ) && currentConteiner.push( child );
                } );
            } else {    // render方式，需要先创建Toolbar节点
                me._bySetup = false;
                $el = me.$el = $('<div>').appendTo( container );  // TODO 先放在documentFragment中，最后在插到container里
            }

            me.$el.addClass( 'ui-toolbar' );
            $(me.title).addClass( 'ui-toolbar-title' );
            
            // 创建左侧按钮组的容器
            var leftBtnCOntainer = $el.find('.ui-toolbar-left');
            if( leftBtnCOntainer.length === 0 ) {
                leftBtnCOntainer = children.length ? $('<div class="ui-toolbar-left">').insertBefore(children[0]) : $('<div class="ui-toolbar-left">').appendTo($el);
                btnContainer['left'].forEach( function( btn ) {
                    leftBtnCOntainer.append( btn );
                } );
            }
            var rightBtnCOntainer = $el.find('.ui-toolbar-right');
            if( rightBtnCOntainer.length === 0 ) {
                rightBtnCOntainer = $('<div class="ui-toolbar-right">').appendTo($el);
                btnContainer['right'].forEach( function( btn ) {
                    rightBtnCOntainer.append( btn );
                } );
            }

            btnContainer['left'] = leftBtnCOntainer;
            btnContainer['right'] = rightBtnCOntainer;

            me.addBtns( 'left', opts.leftBtns );
            me.addBtns( 'right', opts.rightBtns );


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
            btns.forEach( function( btn, index ) {
                if( Object.prototype.toString.call(btn) != '[object String]' ) {
                    btn = btn._el;
                }
                me._addBtn( btnContainer, btn );
            });
        },

        show: function() {
            var me = this;

            me.$el.show();
            me.trigger( 'show' );
            me.isShowing = true;
        },

        hide: function() {
            var me = this;

            me.$el.hide();
            me.trigger( 'hide' );
            me.isShowing = false;
        },

        toggle: function() {
            var me = this;

            me.isShowing === true ? 
                me.hide() : me.show();
        }
    } );
})( gmu, gmu.$ );
