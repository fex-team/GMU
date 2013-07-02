/**
 * @file 弹出框组件
 * @name Dialog
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/dialog/dialog.html</qrcode>
 * 弹出框组件
 * @import core/widget.js, extend/highlight.js, extend/parseTpl.js
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
     * @name gmu.Dialog
     * @grammar gmu.Dialog(options) => instance
     * @grammar dialog(options) => self
     * @desc **Options**
     * - ''autoOpen'' {Boolean}: (可选，默认：true)初始化后是否自动弹出
     * - ''closeBtn'' {Boolean}: (可选，默认：true)是否显示关闭按钮
     * - ''mask'' {Boolean}: (可选，默认：true)是否有遮罩层
     * - ''scrollMove'' {Boolean}: (可选，默认：true)是否禁用掉scroll，在弹出的时候
     * - ''title'' {String}: (可选)弹出框标题
     * - ''content'' {String|Selector}: (render模式下必填)弹出框内容
     * - ''width'' {String|Number}: (可选，默认: 300)弹出框宽度
     * - ''height'' {String|Number}: (可选，默认: \'auto\')弹出框高度
     * - ''buttons'' {Object}: (可选) 用来设置弹出框底部按钮，传入的格式为{key1: fn1, key2, fn2}，key将作为按钮的文字，fn将作为按钮点击后的Handler
     * - ''events'' 所有[Trigger Events](#dialog_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **如果是setup模式，部分参数是直接从DOM上读取**
     * - ''title'' 从element的title属性中读取
     * - ''content'' 直接为element。
     *
     * **比如**
     * <code>//<div id="dialog" title="弹出框标题"></div>
     * console.log($('#dialog').dialog('data', 'title')); // => 弹出框标题
     * console.log($('#dialog').dialog('data', 'content')); // => #dialog(Zepto对象)
     * </code>
     *
     * **Demo**
     * <codepreview href="../examples/widget/dialog/dialog.html">
     * ../gmu/examples/widget/dialog/dialog.html
     * </codepreview>
     */
    gmu.define( 'Dialog', {
        options: {
            autoOpen: true,
            buttons: null,
            closeBtn: true,
            mask: true,
            width: 300,
            height: 'auto',
            title: null,
            content: null,
            scrollMove: true,//是否禁用掉scroll，在弹出的时候
            container: null,
            maskClick: null,
            position: null //需要dialog.position插件才能用
        },

        /**
         * @name getWrap
         * @grammar getWrap() ⇒ Zepto instance
         * @desc 获取最外层的节点。
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
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
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
                    $.later(action, 200);//do it later in 200ms.

                } else {
                    action();//do it now
                }
            }
            return me;
        },

        /**
         * @name open
         * @grammar open() ⇒ instance
         * @grammar open(x, y) ⇒ instance
         * @desc 弹出弹出框，如果设置了位置，内部会数值转给[position](widget/dialog.js#position)来处理。
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
         * @name close
         * @grammar close() ⇒ instance
         * @desc 关闭弹出框
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
         * @name title
         * @grammar title([value]) ⇒ value
         * @desc 设置或者获取弹出框标题。value接受带html标签字符串
         * @example $('#dialog').dialog('title', '标题<span>xxx</span>');
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
         * @name content
         * @grammar content([value]) ⇒ value
         * @desc 设置或者获取弹出框内容。value接受带html标签字符串和zepto对象。
         * @example
         * $('#dialog').dialog('content', '内容');
         * $('#dialog').dialog('content', '<div>内容</div>');
         * $('#dialog').dialog('content', $('#content'));
         */
        content: function(val) {
            var opts = this._options, setter = val!==undefined;
            setter && opts._content.empty().append(opts.content = val);
            return setter ? this: opts.content;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
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
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | ready | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | open | event | 当弹出框弹出后触发 |
         * | beforeClose | event | 在弹出框关闭之前触发，可以通过e.preventDefault()来阻止 |
         * | close | event | 在弹出框关闭之后触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})( gmu, gmu.$ );
