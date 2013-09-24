/**
 * @file 工具栏组件
 * @import core/widget.js
 * @module GMU
 */
(function( gmu, $ ) {
    /**
     * 工具栏组件
     *
     * @class Toolbar
     * @constructor Html部分
     * ```html
     * <div id="J_toolbar">
     *      <a href="../">返回</a>
     *      <h2>工具栏</h2>
     *     <span class="btn_1"><span>百科</span></span>
     *     <span class="btn_1">知道</span>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#J_toolbar').toolbar({});
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化工具栏的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Toolbar:options)
     * @grammar $( el ).toolbar( options ) => zepto
     * @grammar new gmu.Toolbar( el, options ) => instance
     */
    gmu.define( 'Toolbar', {

        options: {

            /**
             * @property {Zepto | Selector | Element} [container=document.body] toolbar的最外层元素
             * @namespace options
             */
            container: document.body,

            /**
             * @property {String} [title='标题'] toolbar的标题
             * @namespace options
             */
            title: '标题',

            /**
             * @property {Array} [leftBtns] 标题左侧的按钮组，支持html、gmu button实例
             * @namespace options
             */
            leftBtns: [],

            /**
             * @property {Array} [rightBtns] 标题右侧的按钮组，支持html、gmu button实例
             * @namespace options
             */
            rightBtns: [],

            /**
             * @property {Boolean} [fixed=false] toolbar是否固定位置
             * @namespace options
             */
            fixed: false
        },

        _init: function() {
            var me = this,
                opts = me._options,
                $el;

            // 设置container的默认值
            if( !opts.container ) {
                opts.container = document.body;
            }

            me.on( 'ready', function() {
                $el = me.$el;

                if( opts.fixed ) {
                    // TODO 元素id的处理
                    var placeholder = $( '<div class="ui-toolbar-placeholder"></div>' ).height( $el.offset().height ).
                        insertBefore( $el ).append( $el ).append( $el.clone().css({'z-index': 1, position: 'absolute',top: 0}) ),
                        top = $el.offset().top,
                        check = function() {
                            document.body.scrollTop > top ? $el.css({position:'fixed', top: 0}) : $el.css('position', 'absolute');
                        },
                        offHandle;

                    $(window).on( 'touchmove touchend touchcancel scroll scrollStop', check );
                    $(document).on( 'touchend touchcancel', offHandle = function() {
                        setTimeout( function() {
                            check();
                        }, 200 );
                    } );
                    me.on( 'destroy', function() {
                        $(window).off('touchmove touchend touchcancel scroll scrollStop', check);
                        $(document).off('touchend touchcancel', offHandle);
                        
                        // 删除placeholder，保留原来的Toolbar节点
                        $el.insertBefore(placeholder);
                        placeholder.remove();
                        me._removeDom();
                    } );

                    check();
                }
            } );

            me.on( 'destroy', function() {
                me._removeDom();
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                container = $( opts.container ),
                children = [],
                btnGroups = me.btnGroups = {
                    left: [],
                    right: []
                },
                currentGroup = btnGroups['left'];

            // render方式，需要先创建Toolbar节点
            if( !opts.setup ) {
                ($el && $el.length > 0) ?
                    $el.appendTo(container) :   // 如果el是一个HTML片段，将其插入container中
                    ($el = me.$el = $('<div>').appendTo( container ));  // 否则，创建一个空div，将其插入container中
            }

            // 从DOM中取出按钮组
            children = $el.children();
            $toolbarWrap = $el.find('.ui-toolbar-wrap');
            if( $toolbarWrap.length === 0 ){
                $toolbarWrap = $('<div class="ui-toolbar-wrap"></div>').appendTo($el);
            }else{
                children = $toolbarWrap.children();
            }

            children.forEach( function( child ) {
                $toolbarWrap.append(child);

                /^[hH]/.test( child.tagName ) ? 
                    (currentGroup = btnGroups['right'], me.title = child) :
                    currentGroup.push( child );
            } );

            // 创建左侧按钮组的容器
            var leftBtnContainer = $toolbarWrap.find('.ui-toolbar-left');
            var rightBtnContainer = $toolbarWrap.find('.ui-toolbar-right');
            if( leftBtnContainer.length === 0 ) {
                leftBtnContainer = children.length ? $('<div class="ui-toolbar-left">').insertBefore(children[0]) : $('<div class="ui-toolbar-left">').appendTo($toolbarWrap);
                btnGroups['left'].forEach( function( btn ) {
                    $(btn).addClass('ui-toolbar-button');
                    leftBtnContainer.append( btn );
                } );
                
                // 没有左侧容器，则认为也没有右侧容器，不需要再判断是否存在右侧容器
                rightBtnContainer = $('<div class="ui-toolbar-right">').appendTo($toolbarWrap);
                btnGroups['right'].forEach( function( btn ) {
                    $(btn).addClass('ui-toolbar-button');
                    rightBtnContainer.append( btn );
                } );
            }

            $el.addClass( 'ui-toolbar' );
            $(me.title).length ? $(me.title).addClass( 'ui-toolbar-title' ) : $('<h1 class="ui-toolbar-title">' + opts.title + '</h1>').insertAfter(leftBtnContainer);;

            me.btnContainer = {
                'left': leftBtnContainer,
                'right': rightBtnContainer
            };

            me.addBtns( 'left', opts.leftBtns );
            me.addBtns( 'right', opts.rightBtns );
        },

        _addBtn: function( container, btn ) {
            var me = this;

            $( btn ).appendTo( container ).addClass('ui-toolbar-button');
        },

        /**
         * 添加按钮组
         * @method addBtns
         * @param {String} [position=right] 按钮添加的位置，left或者right
         * @param {Array} btns 要添加的按钮组，每个按钮可以是一个gmu Button实例，或者元素，或者HTML片段
         * @return {self} 返回本身
         */
        addBtns: function( position, btns ) {
            var me = this,
                btnContainer = me.btnContainer[position],
                toString = Object.prototype.toString;

            // 向下兼容：如果没有传position，认为在右侧添加按钮
            if( toString.call(position) != '[object String]' ) {
                btns = position;
                btnContainer = me.btnContainer['right'];
            }

            btns.forEach( function( btn, index ) {
                // 如果是gmu组件实例，取实例的$el
                if( btn instanceof gmu.Base ) {
                    btn = btn.getEl();
                }
                me._addBtn( btnContainer, btn );
            });

            return me;
        },

        /**
         * 显示Toolbar
         * @method show
         * @return {self} 返回本身。
         */
        
        /**
         * @event show
         * @param {Event} e gmu.Event对象
         * @description Toolbar显示时触发
         */
        show: function() {
            var me = this;

            me.$el.show();
            me.trigger( 'show' );
            me.isShowing = true;

            return me;
        },

        /**
         * 隐藏Toolbar
         * @method hide
         * @return {self} 返回本身。
         */
        
        /**
         * @event hide
         * @param {Event} e gmu.Event对象
         * @description Toolbar隐藏时触发
         */
        hide: function() {
            var me = this;

            me.$el.hide();
            me.trigger( 'hide' );
            me.isShowing = false;

            return me;
        },

        /**
         * 交换Toolbar（显示/隐藏）状态
         * @method toggle
         * @return {self} 返回本身。
         */
        toggle: function() {
            var me = this;

            me.isShowing === false ? 
                me.show() : me.hide();

            return me;
        },

        _removeDom: function(){
            var me = this,
                $el = me.$el;

            if( me._options.setup === false ) {   // 如果是通过render模式创建，移除节点
                $el.remove();
            } else {    // 如果是通过setup模式创建，保留节点
                $el.css('position', 'static').css('top', 'auto');
            }
        }


        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu, gmu.$ );
