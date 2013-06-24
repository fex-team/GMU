/**
 * @file 按钮组件
 * @name Button
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/button/button.html</qrcode>
 * 按钮组件
 * @import core/widget.js, extend/highlight.js
 * @importCSS icons.css
 */
(function ( gmu, $, undefined ) {
    var iconRE = /\bui\-icon\-(\w+)\b/ig,
        iconposRE = /\bui\-button\-icon\-pos\-(\w+)\b/ig;

    /**
     * @name gmu.Button
     * @grammar $.ui.button(el, options) ⇒ instance
     * @grammar $.ui.button(options) ⇒ instance
     * @grammar button(options) ⇒ self
     * @desc **el**
     *
     * css选择器, 或者zepto对象
     *
     * **Options**
     * - ''disabled'' {Boolean}: (可选，默认：false)禁用与否
     * - ''selected'' {Boolean}: (可选，默认：false)选中与否
     * - ''label'' {String}: (可选)按钮文字
     * - ''icon'' {String}: (可选) 设置图标，可以是：
     *   home | delete | plus | arrow-u | arrow-d | check | gear | grid | star | arrow-r | arrow-l | minus | refresh | forward | back | alert | info | search | custom
     * - ''alttext'' {String}: (可选)当只设置icon,没有设置label的时候，组件会认为这是个只有icon的按钮，里面不会放任何文字，如果这个值设定了，icon按钮也会有文字内容，但不可见。
     * - ''iconpos'' {String}: (可选，默认：left) 设置图标位置，可以设置4种：left, top, right, bottom
     * - ''attributes'' {Object}: (可选) 在render模式下可以用来设置href， title， 等等
     * - ''container'' {Zepto}: (可选)设置父节点。
     * - ''events'' 所有[Trigger Events](#button_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **如果是setup模式，部分参数是直接从DOM上读取**
     * - ''label'' 读取element中文本类容
     * - ''icon'' 读取elment的data-icon属性
     * - ''iconpos'' 读取elment的data-iconpos属性
     * **比如**
     * <code>//<a id="btn" data-icon="home">按钮文字</a>
     * console.log($('#btn').button('data', 'label')); // => 按钮文字
     * console.log($('#btn').button('data', 'icon')); // => home
     * </code>
     *
     * **Demo**
     * <codepreview href="../examples/widget/button/button.html">
     * ../gmu/examples/widget/button/button.html
     * ../gmu/examples/widget/button/button_demo.css
     * </codepreview>
     */
    gmu.define( 'Button', {
        
        options: {

            // true | false
            disabled: false,

            //true | false
            selected: false,

            label: '',

            //当只设置icon,没有设置label的时候，组件会认为这是个只有icon的按钮，里面不会放任何文字，如果这个值设定，icon按钮也会有文字内容，但不可见。
            alttext: '',

            // button | checkbox | radio | input 在无插件的情况下只有button才能用。
            type: 'button',

            //home | delete | plus | arrow-u | arrow-d | check | gear | grid | star | arrow-r | arrow-l | minus | refresh | forward | back | alert | info | search | custom
            icon: '',

            //left, top, right, bottom 只有在文字和图片都有的情况下才有用
            iconpos: '',

            attributes: null,

            container: null
        },

        _createDefEL: function(){
            return $('<button>');
        },

        _prepareBtnEL: function(){
            return this.$el;
        },

        _prepareDom : function(mode){
            var opts = this._options,
                $el = this.$el,
                key;

            if(mode=='create'){
                (opts.label || opts.alttext) && (opts._textSpan = $('<span class="ui-button-text">'+(opts.label || opts.alttext)+'</span>').appendTo(opts._buttonElement));
                opts.icon && (opts._iconSpan = $('<span class="ui-icon ui-icon-'+opts.icon+'"></span>').appendTo(opts._buttonElement));
            } else if(mode == 'fullsetup') {
                opts._textSpan = $('.ui-button-text', opts._buttonElement);
                key = opts._buttonElement.hasClass('ui-button-icon-only')?'alttext':'label';
                data[key] = data[key] || opts._textSpan.text();
                opts._iconSpan = $('.ui-icon', opts._buttonElement);
                opts.icon = opts.icon || opts._iconSpan.attr('class').match(iconRE) && RegExp.$1;
                opts.iconpos = opts.iconpos || opts._buttonElement.attr('class').match(iconposRE) && RegExp.$1;
            } else {
                opts.label = opts.label || opts._buttonElement.text() || $el.val();
                opts.alttext = opts.alttext || $el.attr('data-alttext');
                opts.icon = opts.icon || $el.attr('data-icon');
                opts.iconpos = opts.iconpos || $el.attr('data-iconpos');

                opts._buttonElement.empty();
                opts.icon && (opts._iconSpan = $('<span class="ui-icon ui-icon-'+opts.icon+'"></span>').appendTo(opts._buttonElement));
                (opts.label || opts.alttext) && (opts._textSpan = $('<span class="ui-button-text">'+(opts.label || opts.alttext)+'</span>').appendTo(opts._buttonElement));
            }
        },

        _create: function () {
            var me = this,
                $el,
                opts = me._options,
                className = me._prepareClassName();

            !opts.icon && !opts.label && (opts.label = '按钮');//如果既没有设置icon, 又没有设置label，则设置label为'按钮'

            $el = me.$el || (me.$el = me._createDefEL());
            opts._buttonElement = me._prepareBtnEL('create');
            me._prepareDom('create');
            $el.appendTo(opts._container = $(opts.container||'body'));
            opts._buttonElement !== $el && opts._buttonElement.insertAfter($el);


            opts.attributes && $el.attr(opts.attributes);
            $el.prop('disabled', !!opts.disabled);
            opts._buttonElement.addClass(className).highlight(opts.disabled?'':'ui-state-hover');

            //绑定事件
            opts._buttonElement.on('click', $.proxy(me._eventHandler, me));
            $.each(['click', 'change'], function(){ //绑定在data中的事件， 这里只需要绑定系统事件
                opts[this] && me.on(this, opts[this]);
                delete opts[this];
            });
        },

        _detectType: function(){
            return 'button';
        },

        _setup: function( mode ){
            var me = this,
                opts = me._options;

            mode = mode ? 'fullsetup' : 'setup';
            opts.type = me._detectType();
            opts._buttonElement = me._prepareBtnEL(mode);
            me._prepareDom( mode );
        },

        _prepareClassName: function(){
            var me = this,
                opts = me._options,
                className = 'ui-button';

            className += opts.label && opts.icon ? ' ui-button-text-icon ui-button-icon-pos-'+(opts.iconpos||'left') :
                opts.label ? ' ui-button-text-only' : ' ui-button-icon-only';
            className += opts.disabled?' ui-state-disable':'';
            className += opts.selected?' ui-state-active':'';
            return className;
        },

        _init: function(){
            
        },

        /**
         * 事件管理器
         * @private
         */
        _eventHandler:function (event) {
            var opts = this._options;

            if(opts.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },

        /**
         * 设置按钮状态，传入true，设置成可用，传入false设置成不可用
         * @param enable
         * @private
         */
        _setState:function (enable) {
            var opts = this._options,
                change = opts.disabled != !enable;

            if(change){
                opts.disabled = !enable;
                opts._buttonElement[enable?'removeClass':'addClass']('ui-state-disable').highlight(enable?'ui-state-hover':'');;
                this.trigger('statechange', enable);
            }

            return this;
        },

        /**
         * @desc 设置成可用状态。
         * @name enable
         * @grammar enable()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('enable');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.enable();
         */
        enable:function () {
            return this._setState(true);
        },

        /**
         * @desc 设置成不可用状态。
         * @name disable
         * @grammar disable()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('disable');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.disable();
         */
        disable:function () {
            return this._setState(false);
        },

        /**
         * @desc 切换可用和不可用状态。
         * @name toggleEnable
         * @grammar toggleEnable()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('toggleEnable');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.toggleEnable();
         */
        toggleEnable:function () {
            var opts = this._options;

            return this._setState(opts.disabled);
        },

        _setSelected: function(val){
            var opts = this._options;

            if(opts.selected != val){
                opts._buttonElement[ (opts.selected = val) ? 'addClass':'removeClass' ]('ui-state-active');
                this.trigger('change');
            }
            return this;
        },

        /**
         * @desc 设置成选中状态
         * @name select
         * @grammar select()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('select');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.select();
         */
        select: function(){
            return this._setSelected(true);
        },

        /**
         * @desc 设置成非选中状态
         * @name unselect
         * @grammar unselect()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('unselect');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.unselect();
         */
        unselect: function(){
            return this._setSelected(false);
        },

        /**
         * @desc 切换选中于非选中状态。
         * @name toggleSelect
         * @grammar toggleSelect()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('toggleSelect');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.toggleSelect();
         */
        toggleSelect: function(){
            return this._setSelected(!this._opts.selected);
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         * @example
         * //setup mode
         * $('#btn').button('destroy');
         *
         * //render mode
         * var btn = $.ui.button();
         * btn.destroy();
         */
        destroy: function(){
            var me = this,
                opts = this._options;

            opts._buttonElement.off('click', me._eventHandler).highlight();
            opts._buttonElement.remove();
            me.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | click | event | 当按钮点击时触发，当按钮为disabled状态时，不会触发 |
         * | statechange | event, state(disabled的值) | 当按钮disabled状态发生变化时触发 |
         * | change | event | 当按钮类型为''checkbox''或者''radio''时，选中状态发生变化时触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})( gmu, gmu.$ );