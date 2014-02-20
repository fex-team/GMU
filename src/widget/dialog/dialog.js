/**
 * @file 弹出框组件
 * @import core/widget.js, extend/highlight.js, extend/parseTpl.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    var tpl = {
        close: '<a class="ui-dialog-close" title="关闭"><span class="ui-icon ui-icon-delete"></span></a>',
        mask: '<div class="ui-mask"></div>',
        title: '<div class="ui-dialog-title">'+
                    '<h3><%=title%></h3>'+
                '</div>',
        wrap: '<div class="ui-dialog">'+
            '<div class="ui-dialog-content"></div>'+
            '<% if(btns){ %>'+
            '<div class="ui-dialog-btns">'+
            '<% for(var i=0, length=btns.length; i<length; i++){var item = btns[i]; %>'+
            '<a class="ui-btn ui-btn-<%=item.index%>" data-key="<%=item.key%>"><%=item.text%></a>'+
            '<% } %>'+
            '</div>'+
            '<% } %>' +
            '</div> '
    };

    /**
     * 弹出框组件
     *
     * @class Dialog
     * @constructor Html部分
     * ```html
     * <div id="dialog1" title="登陆提示">
     *     <p>请使用百度账号登录后, 获得更多个性化特色功能</p>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     *  $('#dialog1').dialog({
     *      autoOpen: false,
     *      closeBtn: false,
     *      buttons: {
     *          '取消': function(){
     *              this.close();
     *          },
     *          '确定': function(){
     *              this.close();
     *              $('#dialog2').dialog('open');
     *          }
     *      }
     *  });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化对话框的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Dialog:options)
     * @grammar $( el ).dialog( options ) => zepto
     * @grammar new gmu.Dialog( el, options ) => instance
     */
    gmu.define( 'Dialog', {
        options: {
            /**
             * @property {Boolean} [autoOpen=true] 初始化后是否自动弹出
             * @namespace options
             */
            autoOpen: true,
            /**
             * @property {Array} [buttons=null] 弹出框上的按钮
             * @namespace options
             */
            buttons: null,
            /**
             * @property {Boolean} [closeBtn=true] 是否显示关闭按钮
             * @namespace options
             */
            closeBtn: true,
            /**
             * @property {Boolean} [mask=true] 是否有遮罩层
             * @namespace options
             */
            mask: true,
            /**
             * @property {Number} [width=300] 弹出框宽度
             * @namespace options
             */
            width: 300,
            /**
             * @property {Number|String} [height='auto'] 弹出框高度
             * @namespace options
             */
            height: 'auto',
            /**
             * @property {String} [title=null] 弹出框标题
             * @namespace options
             */
            title: null,
            /**
             * @property {String} [content=null] 弹出框内容
             * @namespace options
             */
            content: null,
            /**
             * @property {Boolean} [scrollMove=true] 是否禁用掉scroll，在弹出的时候
             * @namespace options
             */
            scrollMove: true,
            /**
             * @property {Element} [container=null] 弹出框容器
             * @namespace options
             */
            container: null,
            /**
             * @property {Function} [maskClick=null] 在遮罩上点击时触发的事件
             * @namespace options
             */
            maskClick: null,
            position: null //需要dialog.position插件才能用
        },

        /**
         * 获取最外层的节点
         * @method getWrap
         * @return {Element} 最外层的节点
         */
        getWrap: function(){
            return this._options._wrap;
        },

        _init: function(){
            var me = this, opts = me._options, btns,
                i= 0, eventHanlder = $.proxy(me._eventHandler, me), vars = {};

            me.on( 'ready', function() {
                opts._container = $(opts.container || document.body);
                (opts._cIsBody = opts._container.is('body')) || opts._container.addClass('ui-dialog-container');
                vars.btns = btns= [];
                opts.buttons && $.each(opts.buttons, function(key){
                    btns.push({
                        index: ++i,
                        text: key,
                        key: key
                    });
                });
                opts._mask = opts.mask ? $(tpl.mask).appendTo(opts._container) : null;
                opts._wrap = $($.parseTpl(tpl.wrap, vars)).appendTo(opts._container);
                opts._content = $('.ui-dialog-content', opts._wrap);

                opts._title = $(tpl.title);
                opts._close = opts.closeBtn && $(tpl.close).highlight('ui-dialog-close-hover');
                me.$el = me.$el || opts._content;//如果不需要支持render模式，此句要删除

                me.title(opts.title);
                me.content(opts.content);

                btns.length && $('.ui-dialog-btns .ui-btn', opts._wrap).highlight('ui-state-hover');
                opts._wrap.css({
                    width: opts.width,
                    height: opts.height
                });

                //bind events绑定事件
                $(window).on('ortchange', eventHanlder);
                opts._wrap.on('click', eventHanlder);
                opts._mask && opts._mask.on('click', eventHanlder);
                opts.autoOpen && me.open();
            } );
        },

        _create: function(){
            var opts = this._options;

            if( this._options.setup ){
                opts.content = opts.content || this.$el.show();
                opts.title = opts.title || this.$el.attr('title');
            }
        },

        _eventHandler: function(e){
            var me = this, match, wrap, opts = me._options, fn;
            switch(e.type){
                case 'ortchange':
                    this.refresh();
                    break;
                case 'touchmove':
                    opts.scrollMove && e.preventDefault();
                    break;
                case 'click':
                    if(opts._mask && ($.contains(opts._mask[0], e.target) || opts._mask[0] === e.target )){
                        return me.trigger('maskClick');
                    }
                    wrap = opts._wrap.get(0);
                    if( (match = $(e.target).closest('.ui-dialog-close', wrap)) && match.length ){
                        me.close();
                    } else if( (match = $(e.target).closest('.ui-dialog-btns .ui-btn', wrap)) && match.length ) {
                        fn = opts.buttons[match.attr('data-key')];
                        fn && fn.apply(me, arguments);
                    }
            }
        },

        _calculate: function(){
            var me = this, opts = me._options, size, $win, root = document.body,
                ret = {}, isBody = opts._cIsBody, round = Math.round;

            opts.mask && (ret.mask = isBody ? {
                width:  '100%',
                height: Math.max(root.scrollHeight, root.clientHeight)-1//不减1的话uc浏览器再旋转的时候不触发resize.奇葩！
            }:{
                width: '100%',
                height: '100%'
            });

            size = opts._wrap.offset();
            $win = $(window);
            ret.wrap = {
                left: '50%',
                marginLeft: -round(size.width/2) +'px',
                top: isBody?round($win.height() / 2) + window.pageYOffset:'50%',
                marginTop: -round(size.height/2) +'px'
            }
            return ret;
        },

        /**
         * 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
         * @method refresh
         * @return {self} 返回本身
         */
        refresh: function(){
            var me = this, opts = me._options, ret, action;
            if(opts._isOpen) {

                action = function(){
                    ret = me._calculate();
                    ret.mask && opts._mask.css(ret.mask);
                    opts._wrap.css(ret.wrap);
                }

                //如果有键盘在，需要多加延时
                if( $.os.ios &&
                    document.activeElement &&
                    /input|textarea|select/i.test(document.activeElement.tagName)){

                    document.body.scrollLeft = 0;
                    setTimeout(action, 200);//do it later in 200ms.

                } else {
                    action();//do it now
                }
            }
            return me;
        },

        /**
         * 弹出弹出框，如果设置了位置，内部会数值转给[position](widget/dialog.js#position)来处理。
         * @method open
         * @param {String|Number} [x] X轴位置
         * @param {String|Number} [y] Y轴位置
         * @return {self} 返回本身
         */
        open: function(x, y){
            var opts = this._options;
            opts._isOpen = true;

            opts._wrap.css('display', 'block');
            opts._mask && opts._mask.css('display', 'block');

            x !== undefined && this.position ? this.position(x, y) : this.refresh();

            $(document).on('touchmove', $.proxy(this._eventHandler, this));
            return this.trigger('open');
        },

        /**
         * 关闭弹出框
         * @method close
         * @return {self} 返回本身
         */
        close: function(){
            var eventData, opts = this._options;

            eventData = $.Event('beforeClose');
            this.trigger(eventData);
            if(eventData.defaultPrevented)return this;

            opts._isOpen = false;
            opts._wrap.css('display', 'none');
            opts._mask && opts._mask.css('display', 'none');

            $(document).off('touchmove', this._eventHandler);
            return this.trigger('close');
        },

        /**
         * 设置或者获取弹出框标题。value接受带html标签字符串
         * @method title
         * @param {String} [value] 弹出框标题
         * @return {self} 返回本身
         */
        title: function(value) {
            var opts = this._options, setter = value !== undefined;
            if(setter){
                value = (opts.title = value) ? '<h3>'+value+'</h3>' : value;
                opts._title.html(value)[value?'prependTo':'remove'](opts._wrap);
                opts._close && opts._close.prependTo(opts.title? opts._title : opts._wrap);
            }
            return setter ? this : opts.title;
        },

        /**
         * 设置或者获取弹出框内容。value接受带html标签字符串和zepto对象。
         * @method content
         * @param {String|Element} [val] 弹出框内容
         * @return {self} 返回本身
         */
        content: function(val) {
            var opts = this._options, setter = val!==undefined;
            setter && opts._content.empty().append(opts.content = val);
            return setter ? this: opts.content;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         */
        destroy: function(){
            var opts = this._options, _eventHander = this._eventHandler;
            $(window).off('ortchange', _eventHander);
            $(document).off('touchmove', _eventHander);
            opts._wrap.off('click', _eventHander).remove();
            opts._mask && opts._mask.off('click', _eventHander).remove();
            opts._close && opts._close.highlight();
            return this.$super('destroy');
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event open
         * @param {Event} e gmu.Event对象
         * @description 当弹出框弹出后触发
         */

        /**
         * @event beforeClose
         * @param {Event} e gmu.Event对象
         * @description 在弹出框关闭之前触发，可以通过e.preventDefault()来阻止
         */

        /**
         * @event close
         * @param {Event} e gmu.Event对象
         * @description 在弹出框关闭之后触发
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    });
})( gmu, gmu.$ );
