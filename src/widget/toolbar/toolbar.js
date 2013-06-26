/**
 * @file 工具栏组件
 * @name Toolbar
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/toolbar/toolbar.html</qrcode>
 * 工具栏组件
 * @import core/widget.js, extend/fix.js, extend/highlight.js
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

        _init: function() {
            var me = this,
                $el;

            if( !me._options.container ) {
                me._options.container = document.body;
            }

            me.on( 'ready', function() {
                $el = me.$el;

                if( me._options.fix ) {
                    // TODO 元素id的处理
                    var placeholder = $('<div class="ui-toolbar-placeholder"></div>').height($el.offset().height).
                        insertBefore($el).append($el).append($el.clone().css({'z-index': 1, position: 'absolute',top: 0})),
                        top = $el.offset().top,
                        check = function() {
                            document.body.scrollTop > top ? $el.css({position:'fixed', top: 0}) : $el.css('position', 'absolute');
                        },
                        offHandle;

                    $(window).on('touchmove touchend touchcancel scroll scrollStop', check);
                    $(document).on('touchend touchcancel', offHandle = function() {
                        setTimeout( function() {
                            check();
                        }, 200 );
                    });
                    me.on('destroy', function() {
                        $(window).off('touchmove touchend touchcancel scroll scrollStop', check);
                        $(document).off('touchend touchcancel', offHandle);
                        
                        // 删除placeholder，保留原来的Toolbar节点
                        $el.insertBefore(placeholder);
                        placeholder.remove();
                        if( me._bySetup === false ) {
                            me.$el.remove();
                        }

                    }).on('init', check);
                }
            } );

            me.on( 'destroy', function() {
                // 解绑事件
                
                
                // 如果是通过render模式创建，移除节点
                if( me._bySetup === false ) {
                    me.$el.remove();
                } else {    // 如果是通过setup模式创建，保留节点
                    me.$el.css('position', 'static').css('top', 'auto');
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
                $el[0].parentNode || (me._bySetup = false, $el.appendTo(container));   // 如果是动态创建的元素，将其插入DOM中

                children = $el.children();
                $toolbarWrap = $el.find('.ui-toolbar-wrap');
                if( $toolbarWrap.length === 0 ){
                    $toolbarWrap = $('<div class="ui-toolbar-wrap"></div>').appendTo($el);
                }else{
                    children = $toolbarWrap.children();
                }

                children.forEach( function( child ) {
                    $toolbarWrap.append(child);

                    /^[hH]/.test( child.tagName ) && (currentConteiner = btnContainer['right'], me.title = child);

                    !/^[hH]/.test( child.tagName ) && currentConteiner.push( child );
                } );
            } else {    // render方式，需要先创建Toolbar节点
                me._bySetup = false;
                $el = me.$el = $('<div><div class="ui-toolbar-wrap"></div></div>').appendTo( container );  // TODO 先放在documentFragment中，最后在插到container里
                $toolbarWrap = $el.find('.ui-toolbar-wrap');
            }

            // 创建左侧按钮组的容器
            var leftBtnCOntainer = $toolbarWrap.find('.ui-toolbar-left');
            if( leftBtnCOntainer.length === 0 ) {
                leftBtnCOntainer = children.length ? $('<div class="ui-toolbar-left">').insertBefore(children[0]) : $('<div class="ui-toolbar-left">').appendTo($toolbarWrap);
                btnContainer['left'].forEach( function( btn ) {
                    leftBtnCOntainer.append( btn );
                } );
            }
            var rightBtnCOntainer = $toolbarWrap.find('.ui-toolbar-right');
            if( rightBtnCOntainer.length === 0 ) {
                rightBtnCOntainer = $('<div class="ui-toolbar-right">').appendTo($toolbarWrap);
                btnContainer['right'].forEach( function( btn ) {
                    rightBtnCOntainer.append( btn );
                } );
            }

            me.$el.addClass( 'ui-toolbar' );
            $(me.title).length ? $(me.title).addClass( 'ui-toolbar-title' ) : $('<h1 class="ui-toolbar-title">' + opts.title + '</h1>').insertAfter(leftBtnCOntainer);;

            btnContainer['left'] = leftBtnCOntainer;
            btnContainer['right'] = rightBtnCOntainer;

            me.addBtns( 'left', opts.leftBtns );
            me.addBtns( 'right', opts.rightBtns );
        },

        _addBtn: function( contianer, btn ) {
            var me = this;

            contianer.append( btn );
        },

        addBtns: function( position, btns ) {
            var me = this,
                btnContainer = me.btnContainer[position];

            // 向下兼容：如果没有传position，认为在右侧添加按钮
            Object.prototype.toString.call(position) != '[object String]' && (btns = position);

            btns.forEach( function( btn, index ) {
                if( Object.prototype.toString.call(btn) != '[object String]' ) {
                    btn = btn.getEl();
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

            me.isShowing === false ? 
                me.show() : me.hide();
        },

        fix: function( opts ) {
            this.$el.fix( opts );
        }
    } );
})( gmu, gmu.$ );
