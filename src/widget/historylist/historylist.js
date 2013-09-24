/**
 * @file 历史记录组件
 * @import core/widget.js, extend/touch.js, widget/dialog.js
 * @module GMU
 */

 // TODO 列表区域支持iScroll
(function( gmu, $ ) {
    
    /**
     * 历史记录组件
     *
     * @class Historylist
     * @constructor Html部分
     * ```html
     * <div>
     *     <p><input type="text" class="input-text" id="J_input" /><input type="button" value="取消" class="input-button" /></p>
     *     <div id="J_historyWrap"></div>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * var instance = new gmu.Historylist({
     *     container: $('#J_historyWrap'), // 页面上需要有一个已经存在的容器来存放组件
     *     items: [
     *             {'value': 'global', 'context': '<b>global</b> adj. 全球的；综合的'},
     *             'google',
     *             {'value': 'visual', 'context': '<b>visual</b> adj. 视觉的'},
     *             'alibaba',
     *             'taobao'
     *            ],   // 历史记录的列表
     *     itemTouch: function(e, data) {  // 某条记录被点击后的响应事件
     *         console.log( 'item touched: ' + data.item );   // data.item是某条记录的内容
     *         $('#J_input').val(data.item);
     *     },
     *     itemDelete: function(e, data) { // 某条记录被删除后的响应事件
     *         console.log( 'item delete:' + data.item );   // data.item是某条记录的内容
     *     },
     *     clear: function() {  // 用户确认清空搜索历史后的响应事件
     *         // 在这里删除localstorage里面存的历史数据
     *         console.log( 'clear triggered' );
     *     }
     * });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Historylist:options)
     * @grammar $( el ).historylist( options ) => zepto
     * @grammar new gmu.Historylist( el, options ) => instance
     */
    gmu.define( 'Historylist', {

        options: {

            /**
             * @property {Zepto | Selector | Element} [container=document.body] 容器，默认为 document.body 
             * @namespace options
             */
            container: document.body,

            /**
             * @property {Boolean} [deleteSupport=true] 是否支持滑动删除记录，默认支持
             * @namespace options
             */
            deleteSupport: true,

            /**
             * @property {Array} [items=Array()] 历史记录的数据
             * @namespace options
             */
            items: []
        },

        template: {
            wrap: '<ul class="ui-historylist">',
            item: '<li data-id="<%=id%>"><p class="ui-historylist-itemwrap"><span class="ui-historylist-item"><%=context%></span></p></li>',
            clear: '<p class="ui-historylist-clear">清空搜索历史</p>'
        },

        _init: function() {
            var me = this,
                opts = me._options;

            // js不一定放在页面尾部，所以在init中要重新赋值
            me.$el = opts.container = opts.container || document.body;

            me.items = [];

            me.on( 'ready', function() {
                me._bindUI();
            } );

            me.on( 'itemDelete', function() {
                // 历史记录为空时，隐藏
                if( me.items.length === 0 ) {
                    me.hide();
                }
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options;

            me.$el.hide();
            me.$wrap = $( me.tpl2html( 'wrap' ) ).appendTo( opts.container );

            me.$clear = $( me.tpl2html( 'clear' ) ).appendTo( opts.container );
            !me._options.deleteSupport && me.$clear.hide();

            me.addItems( opts.items );

            me.show();
        },

        _filterItemsById: function( id, callback ) {
            var me = this;

            me.items.forEach( function( _item, index ) {
                if ( _item.id === id ) {
                    callback.call( me, _item, index );

                    return;
                }
            } );
        },

        _bindUI: function() {
            var me = this,
                touch,
                $target,
                itemId,
                startTimestamp,
                endTimestamp,
                wantDelete = false,
                timeout,
                touchstartX,
                currentX,
                touchstartY,
                currentY,
                velocity,
                movedPercentage,
                moved,
                movedDistance;

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
                            this._options._wrap.addClass( 'ui-historylist-dialog' );
                        }
                    });
                }, 10 );

                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( 'tap' + me.eventNs, function(ev) {
                if( me._options.deleteSupport ) {
                    return;
                }

                $target = $( ev.target );

                if( !$target.hasClass( 'ui-historylist-itemwrap' ) && 
                    !($target = $target.parents( '.ui-historylist-itemwrap' )).length ) {
                    $target = null;
                    return;
                }

                itemId = $target.parent().attr( 'data-id' );
                me._filterItemsById( itemId, function( _item ) {
                    me.trigger( 'itemTouch', {'item': _item.value} );
                });

            } );

            me.$wrap.on( 'touchstart' + me.eventNs, function(ev) {

                if( !me._options.deleteSupport ) {
                    return;
                }
                touch = ev.touches[0];
                $target = $( touch.target );
                startTimestamp = ev.timeStamp;
                currentX = touchstartX = parseInt( touch.pageX );
                currentY = touchstartY = parseInt( touch.pageY );
                moved = false;
                wantDelete = false;

                if( !$target.hasClass( 'ui-historylist-itemwrap' ) && 
                    !($target = $target.parents( '.ui-historylist-itemwrap' )).length ) {
                    $target = null;
                    return;
                }

                $target.addClass( 'ui-historylist-ontap' );

                // TODO 用了-webkit-box，就不需要去动态设置width了
                $target.css( 'width',  $target.width() - parseInt( $target.css( 'border-left-width' ) ) - parseInt( $target.css( 'border-right-width' ) ));
            } );

            me.$wrap.on( 'touchmove' + me.eventNs, function(ev) {
                if( !$target ) {
                    return;
                }

                currentX = ev.touches[0].pageX;
                currentY = ev.touches[0].pageY;
                timeout === undefined && (timeout = setTimeout( function() {
                    // 竖向移动的距离大于横向移动距离的一半时，认为用户是企图滚动，而不是删除
                    if( Math.abs( currentY - touchstartY ) > Math.abs (currentX - touchstartX )/2 ){
                        wantDelete = false;
                    }else{
                        wantDelete = true;
                    }

                }, 10 ));
                
                moved = moved || ((currentX - touchstartX >= 3 || currentY - touchstartY >= 3) ? true : false);
                if( !wantDelete ) {
                    setTimeout( function() {
                        $target && $target.removeClass( 'ui-historylist-ontap' );
                    }, 150 );   // 延时长一点，这样不会因为class改变太快，导致闪
                    return;
                }

                movedPercentage = (currentX - touchstartX)/me.$wrap.width();

                // TODO 有些设备上有点卡，需要优化
                $target.addClass( 'ui-historylist-itemmoving' );
                $target.removeClass( 'ui-historylist-ontap' );
                $target.css( '-webkit-transform', 'translate3d(' + (currentX - touchstartX) + 'px, 0, 0)' );
                $target.css( 'opacity', 1 - movedPercentage );
                
                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( 'touchend' + me.eventNs + ' touchcancel' + me.eventNs, function(ev) {
                if( !$target) {
                    return;
                }

                clearTimeout(timeout);
                timeout = undefined;

                itemId = $target.parent().attr( 'data-id' );
                endTimestamp = ev.timeStamp;
                velocity = (currentX - touchstartX) / (endTimestamp - startTimestamp);
                movedDistance = Math.abs( currentX - touchstartX );

                $target.removeClass( 'ui-historylist-ontap' );
                $target.removeClass( 'ui-historylist-itemmoving' );

                // 当移动的距离小于 1/3 时，速度快则删除，速度慢则还原
                if( ((movedDistance < me.$wrap.width()/3 && Math.abs( velocity ) > 0.1) && wantDelete) ||
                     (movedDistance >= me.$wrap.width()/3 && wantDelete) ) {
                        me.removeItem( itemId, $target );
                } else {
                    $target.css( 'width', 'auto' );
                    $target.css( '-webkit-transform', 'translate3d(0, 0, 0)' );
                    $target.css( 'opacity', 1 );

                    // 移动小于3个像素时，则认为是点击，派发 itemTouch 事件
                    // 如果移出3像素外，再移到3像素内，认为不是点击
                    !moved && movedDistance < 3 && me._filterItemsById( itemId, function( _item ) {
                        me.trigger( 'itemTouch', {'item': _item.value} );
                    });
                }

                $target = null;
            } );
        },

        /**
         * 显示Historylist
         * @method show
         * @return {self} 返回本身。
         */
        show: function() {
            var me = this;

            // 没有历史记录时，不显示
            if( me.items.length === 0 ) {
                return;
            }

            if( me.sync === false ) {
                me.$wrap.html( '' );
                me.addItems( me.syncitems );
                me.sync = true;
            }
            me.$el.show();
            me.isShow = true;

            return me;
        },

        /**
         * 隐藏Historylist
         * @method hide
         * @return {self} 返回本身。
         */
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

        /**
         * 添加一条历史记录
         * @method addBtns
         * @param {String|Object} item 历史记录，可以是字符串，也可以是标准格式的对象（包含context和value）
         * @return {self} 返回本身
         */
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

        /**
         * 添加多条历史记录
         * @method addBtns
         * @param {Array} item 历史记录
         * @return {self} 返回本身
         */
        addItems: function( items ) {
            var me = this;

            items.forEach( function( item ) {
                me.addItem( item );
            } );

            return me;
        },

        /**
         * 更新数据，重新渲染列表
         * @method update
         * @param {Array} item 新的历史记录
         * @return {self} 返回本身
         */
        update: function( items ) {
            var me = this;


            if( me.isShow ) {
                me.$wrap.html( '' );
                me.addItems( items );
                me.sync = true;
            } else {
                me.syncitems = items;
                me.sync = false;
            }

            return me;
        },

        removeItem: function( itemId, $itemTarget ) {
            var me = this,
                distance,
                transform,
                x;

            // 根据当前位移的正负，判断是从右滑出还是从左滑出
            transform = $itemTarget.css( '-webkit-transform');
            x = /translate3d\((.*?),.*/.test(transform) ? RegExp.$1: 0;
            distance = parseInt( x, 10) >= 0 ? $itemTarget.width() : -$itemTarget.width();
            $itemTarget.css( '-webkit-transform', 'translate3d(' + distance + 'px, 0, 0)' );

            // TODO 根据位移改变透明度，感觉不出来，没必要加

            $itemTarget.on( 'transitionEnd' + me.eventNs +  ' webkitTransitionEnd' + me.eventNs, function() {
                $itemTarget.parent().remove();

                me._filterItemsById( itemId, function( _item, index ) {
                    me.items.splice( index, 1);
                    me.trigger( 'itemDelete', {'item': _item.value} );
                });
            } );

        },

        /**
         * 清空历史记录
         * @method clear
         * @return {self} 返回本身
         */
        clear: function() {
            var me = this;

            me.$wrap.html( '' );
            me.items = [];
            me.sync = true;
            me.hide();
            me.trigger( 'clear' );

            return me;
        },

        /**
         * 禁用删除功能
         * @method disableDelete
         * @return {self} 返回本身
         */
        disableDelete: function() {
            var me = this;

            me._options.deleteSupport = false;
            me.$clear.hide();

            return me;
        },

        /**
         * 启用删除功能
         * @method enableDelete
         * @return {self} 返回本身
         */
        enableDelete: function() {
            var me = this;

            me._options.deleteSupport = true;
            me.$clear.show();

            return me;
        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            var me = this;

            me.$wrap.off( me.eventNs );
            me.$clear.off( me.eventNs );

            me.$wrap.remove();
            me.$clear.remove();

            return me.$super( 'destroy' );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event itemTouch
         * @param {Event} e gmu.Event对象
         * @param {String} item 被点击的记录的value
         * @description 点击某条历史记录时触发
         */

        /**
         * @event itemDelete
         * @param {Event} e gmu.Event对象
         * @param {String} item 被删除的记录的value
         * @description 删除某条历史记录时触发
         */

        /**
         * @event clear
         * @param {Event} e gmu.Event对象
         * @description 清除历史记录时触发
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu, gmu.$ );

