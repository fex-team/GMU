/**
 * @file 下拉菜单组件
 * @name Dropmenu
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/dropmenu/dropmenu.html</qrcode>
 * 下拉菜单组件
 * @import core/zepto.ui.js, core/zepto.highlight.js
 * @importCSS icons.css
 */
(function ($, undefined) {
    var tpl = {
            arrow:'<span class="ui-dropmenu-arrow"></span>',
            items:'<ul class="ui-dropmenu-items">' +
                '<% for(var i=0, length = items.length; i<length; i++){ var item = items[i]; %>' +
                '<li class="<%=item.icon&&item.text?\'ui-icontext\':item.icon?\'ui-icononly\':\'ui-textonly\'%>"><a<% if(item.href){ %> href="<%=item.href%>"<% } %>>' +
                '<% if(item.icon){ %><span class="ui-icon ui-icon-<%=item.icon%>"></span><% } %>' +
                '<%=item.text%></a></li>' +
                '<% } %>' +
                '</ul>'
        },
        iconRE = /\bui\-icon\-(\w+)\b/ig,
        rootNodeRE = /^(?:body|html)$/i,
        zIndex = 100,
        defaultOffset = {
            up: {
                x:0,
                y:1
            },
            down: {
                x:0,
                y:-1
            }
        },
        defaultArrowPos = {
            left: {left:'25%', right:'auto'},
            center: {left:'50%', right:'auto'},
            right: {left:'75%', right:'auto'}
        };

    /**
     * @name $.ui.dropmenu
     * @grammar $.ui.dropmenu(options) ⇒ instance
     * @grammar dropmenu(options) ⇒ self
     * @desc **Options**
     * - ''btn'' {Zepto|Selector}: (可选) 设置dropmenu对应的按钮，当此按钮点击时会自动把此dropmenu显示。
     * - ''align'' {'left'|'center'|'right'|'center'}: (可选，默认：'auto')设置dropmenu是左对齐与按钮元素，还是居中对齐，右对齐，或自动对齐。
     *   自动对齐是自动选择一种最合适的对齐方式。算法是，先尝试居中对齐，如果下拉菜单出了可是区域，则尝试左对齐，再尝试右对齐。
     * - ''width'' {Number}: (可选)如果不传，宽度自适应与内容
     * - ''height'' {Number}: (可选)如果不传，高度自适应与内容
     * - ''offset'' {Object}: (可选)设置下拉菜单位置的偏移量，相对与自动算出来位置。格式：{x: -1, y: 5}
     * - ''pos'' {'up'|'down'|'auto'}: (可选，默认'down')设置下拉菜单是在按钮的下面显示还是上面显示。如果设置为'auto', 将自动设置，目的是尽量让下拉菜单不超出可视区域。
     * - ''direction'' {'vertical'|'horizontal'}: (可选, 默认'vertical')设置下拉菜单是垂直排列还是左右排列。
     * - ''arrow'' {Boolean}: (可选, 默认true) 是否显示箭头
     * - ''arrowPos'' {Object}: (可选) 控制箭头位置, Object中有两个参数，如下。
     *   - ''left''
     *   - ''right''
     *   默认如果align为center，{left:50%, right:auto}, 如果align为left,{left:25%, right:auto}, 如果align为right，{left:75%, right:auto}
     *   数值可以为数字，百分比，或者带单位的数字字符串。
     * - ''autoClose'' {Boolean}: (可选, 默认true) 当下拉菜单显示的时候，点击其他区域是否关闭菜单。
     * - ''items'' {Array}: (可选) 当为render模式时必填 设置下拉菜单的列表内容，格式为: \[{text:\'\', icon: \'\', click: fn, href:\'\'}, ...\]
     * - ''events'' 所有[Trigger Events](#dropmenu_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/dropmenu/dropmenu.html">
     * ../gmu/_examples/widget/dropmenu/dropmenu.html
     * </codepreview>
     */
    $.ui.define('dropmenu', {
        _data:{
            btn: null,//按钮
            align:'center',//left, center, right, auto
            width:null,
            height:null,
            offset:null,
            pos: 'down',//up, down, auto.
            direction:'vertical', //vertical, horizontal
            arrow:true, //是否显示剪头
            arrowPos: null,
            autoClose:true, //点击其他地方自动关闭
            items:null, // 数组: {text:'', icon: '', click: '', href:''}
            itemClick: null,//event
            cacheParentOffset: true//是否把父级的位置缓存起来
        },

        _prepareDom:function (mode, data) {
            var me = this, content, $el = me._el, items;
            switch (mode) {
                case 'fullsetup':
                case 'setup':
                    data._arrow = me._findElement('.ui-dropmenu-arrow');
                    data._arrow || data.arrow && (data._arrow = $(tpl.arrow).prependTo($el));
                    data._items = me._el.find('ul').first();
                    if (data._items) {
                        items = [];
                        data._items.addClass('ui-dropmenu-items').children().each(function () {
                            var $li = $(this), a = $('a', this).first(), iconSpan = $('.ui-icon', this), item;
                            items.push(item = {
                                text:a.text(),
                                icon:iconSpan.length && iconSpan.attr('class').match(iconRE) && RegExp.$1
                            });
                            $li.addClass(item.icon && item.text ? 'ui-icontext' : item.icon ? 'ui-icononly' : 'ui-textonly');
                        });
                        data.items = items;
                    } else data._items = $($.parseTpl(tpl.items, {
                        items:data.items || []
                    })).appendTo($el);
                    break;
                default:
                    content = data.arrow ? tpl.arrow : '';
                    content += $.parseTpl(tpl.items, {
                        items:data.items || []
                    });
                    $el.append(content);
                    data._arrow = me._findElement('.ui-dropmenu-arrow');
                    data._items = me._findElement('.ui-dropmenu-items');
                    data.container = data.container || 'body';
            }
            data.container && $el.appendTo(data.container);
        },

        _findElement:function (selector) {
            var ret = this._el.find(selector);
            return ret.length ? ret : null;
        },

        _create:function () {
            var me = this, data = me._data;
            me._el = me._el || $('<div></div>');
            me._prepareDom('create', data);
        },

        _setup:function (mode) {
            var me = this, data = me._data;
            me._prepareDom(mode ? 'fullsetup' : 'setup', data);
        },

        _init:function () {
            var me = this, data = me._data, $el = me.root(), eventHandler = $.proxy(me._eventHandler, me);
            $el.addClass(me._prepareClassName()).css({
                width:data.width || '',
                height:data.height || ''
            });
            $('.ui-dropmenu-items li a', $el).highlight('ui-state-hover');
            $el.on('click', eventHandler).highlight();
            $(window).on('ortchange', eventHandler);
            data.btn && me.bindButton($.ui.isWidget(data.btn) ? data.btn.root(): data.btn);
        },

        _prepareClassName:function () {
            var data = this._data, className = 'ui-dropmenu';
            data.direction == 'horizontal' && (className += ' ui-horizontal');
            return className;
        },

        /**
         * @name bindButton
         * @grammar bindButton(el) ⇒ instance
         * @desc 用来绑定按钮
         * @notice 下拉菜单在显示前，需要绑定对应的按钮，否则下拉菜单不知道该显示在什么位置。
         * @desc 这不是唯一的绑定途径，在实例化时可以给btn option，设置值，或者在show方法中传入值。
         */
        bindButton:function (btn) {
            var me = this, data = me._data;
            data._btn && data._btn.off('click.dropmenu');
            data._btn = $(btn).on('click', $.proxy(me._eventHandler, me));
            return me;
        },

        _getParentOffset:function () {
            var elem = this._el,
                offsetParent = elem.offsetParent(),
                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top:0, left:0 } : offsetParent.offset();
            // 添加边框
            parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
            parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;
            return parentOffset;
        },

        _isInRange: function(s1, l1, s2, l2){
            return !(s1 < s2 || s1+l1>s2+l2)
        },

        __caculate: function(type, position, boxWidth, boxHeight){
            switch(type){
                case 'up':
                    return position.top - boxHeight;
                case 'down':
                    return position.top + position.height;
                case 'left':
                    return position.left;
                case 'center':
                    return position.left + position.width / 2 - boxWidth / 2;
                default: //right
                    return position.left + position.width - boxWidth;
            }
        },

        _caculate:function (target) {
            var top, left, data = this._data, offset, pos, align, $el, position, boxWidth, boxHeight,
                winStart, winLength,
                parentOffset = data._parentOffset;

            !data._btn ? (data._btn = $(target)) : data._btn.add(target);
            if (!data._btn.length) {
                throw new Error('调用dropmenu->show错误，需要指定一个Element与之关联!');
            }

            position = data._btn.offset();
            boxWidth = ($el = this._el).width();
            boxHeight = $el.height();
            pos = data.pos;
            align = data.align;

            if(pos == 'auto') {
                winStart = window.pageYOffset;
                winLength = window.innerHeight;
                top = this.__caculate(pos = 'down', position, boxWidth, boxHeight);
                if(!this._isInRange(top, boxHeight, winStart, winLength)){
                    top = this.__caculate(pos = 'up', position, boxWidth, boxHeight);
                    this._isInRange(top, boxHeight, winStart, winLength) || (top = this.__caculate(pos = 'down', position, boxWidth, boxHeight));
                }
            } else top = this.__caculate(data.pos, position, boxWidth, boxHeight);

            if(align == 'auto'){
                winStart = 0;//window.pageXOffset;
                winLength = window.innerWidth;
                left = this.__caculate(align = 'center', position, boxWidth, boxHeight);
                if(!this._isInRange(left, boxWidth, winStart, winLength)){
                    left = this.__caculate(align = 'left', position, boxWidth, boxHeight);
                    this._isInRange(left, boxWidth, winStart, winLength) || (left = this.__caculate(align = 'right', position, boxWidth, boxHeight));
                }
            } else left = this.__caculate(data.align, position, boxWidth, boxHeight);

            $el[pos=='up'?'addClass':'removeClass']('ui-dropmenu-pos-up')
                .removeClass('ui-alignleft ui-aligncenter ui-alignright')
                .addClass(align == 'left' ? 'ui-alignleft' : align == 'right' ? 'ui-alignright' : 'ui-aligncenter');

            offset = data.offset || defaultOffset[pos=='up'?'up':'down'];

            data._arrow && data._arrow.css(data.arrowPos || defaultArrowPos[align]);

            return {
                top:top + offset.y - parentOffset.top,
                left:left + offset.x - parentOffset.left
            };
        },

        /**
         * @name show
         * @grammar show() ⇒ instance
         * @grammar show(el) ⇒ instance
         * @desc 显示下拉菜单, 如果在调用此方法之前没有绑定按钮，在此需要作为第一个参数传入，否则组件将抛出异常。
         *
         * 一个下拉菜单可以绑定多个按钮显示，如果绑定的按钮时一个集合，在这需要指定显示在哪个按钮下面，否则将显示在集合的第一个按钮下面。
         * @example
         * //<a class="button">按钮1</a>
         * //<a class="button">按钮2</a>
         * //<div class="dropemenu"><ul><li>xxx</li>...</ul></div>
         * $('a.buttton').click(function(){
         *     $('.dropmenu').dropmenu('show', this);
         * });
         */
        show:function (target) {
            var me = this, data = this._data;
            data._parentOffset = data.cacheParentOffset ? data._parentOffset || this._getParentOffset() : this._getParentOffset();//获得父级的position:relative元素的offset
            data.autoClose && $(document).on('click.'+this.id(), function(e){
                me._isFromSelf(e.target) || me.hide();
            });
            this._el.css(this._caculate(data._actBtn = target || data._actBtn)).css('zIndex', zIndex++);//bugfix: FEBASE-542
            data._isShow = true;
            return this;
        },

        _eventHandler:function (e) {
            var me = this, match, data = this._data, el, itemData, eventData, _prevented, li;
            switch (e.type) {
                case 'ortchange':
                    data._parentOffset = this._getParentOffset();//TRACE FEBASE-658 转屏后，parentOffset不对了，要重新计算一次。
                    data._isShow && me._el.css(me._caculate(data._actBtn));
                    break;
                default:
                    el = me._el.get(0);
                    if((match = $(e.target).closest('.ui-dropmenu-items li', el)) && match.length){
                        eventData = $.Event('itemClick');
                        itemData = data.items[match.index()];//获取data.items中对应的item.
                        _prevented = itemData && itemData.click && itemData.click.apply(me, [eventData, itemData, match[0]]) === false;//如果item中有click则先调用item.click
                        (_prevented = _prevented || eventData.defaultPrevented ) || me.trigger(eventData, [itemData, match[0]]);//如果item.click返回的是false,或者在里面调用了e.preventDefault(). itemClick事件就不派送了。
                        (_prevented || eventData.defaultPrevented ) && e.preventDefault();//如果itemClick中的事件有被阻止就把本来的click给阻止掉，这样a连接就不会跳转了。
                    } else me.toggle();
            }
        },

        _isFromSelf:function (target) {
            var ret = false, data = this._data;
            $.each(this._el.add(data._btn), function () {
                if (this == target || $.contains(this, target)) {
                    ret = true;
                    return false;
                }
            });
            return ret;
        },

        /**
         * @name hide
         * @grammar hide() ⇒ instance
         * @desc 隐藏下拉菜单
         */
        hide:function () {
            var data = this._data;
            data._isShow && this.root().css('top', '-99999px');
            data.autoClose && $(document).off('click.'+this.id());
            data._isShow = false;
            return this;
        },

        /**
         * @name toggle
         * @grammar toggle() ⇒ instance
         * @desc 切换显示与隐藏
         */
        toggle: function(){
            return this[this._data._isShow?'hide':'show'].apply(this, arguments);
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, eventHandler = this._eventHandler;
            data._btn && data._btn.off('click', eventHandler);
            $('.ui-dropmenu-items li a', this._el).highlight();
            data.autoClose && $(document).off('click.'+this.id());
            $(window).off('ortchange', eventHandler);
            return this.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | itemClick | event, item(object包含icon, text, href信息) | 当某个菜单项被点击时触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });

})(Zepto);