/**
 * @file 按钮组件
 * @name Button
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/button/button.html</qrcode>
 * 按钮组件
 * @import core/zepto.extend.js, core/zepto.ui.js, core/zepto.highlight.js
 * @importCSS icons.css
 */
(function ($, undefined) {
    var iconRE = /\bui\-icon\-(\w+)\b/ig,
        iconposRE = /\bui\-button\-icon\-pos\-(\w+)\b/ig;

    /**
     * @name $.ui.button
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
     * <codepreview href="../gmu/_examples/widget/button/button.html">
     * ../gmu/_examples/widget/button/button.html
     * ../gmu/_examples/widget/button/button_demo.css
     * </codepreview>
     */
    $.ui.define('button', {
        _data:{
            disabled: false, // true | false
            selected: false, //true | false
            label: '',
            alttext: '', //当只设置icon,没有设置label的时候，组件会认为这是个只有icon的按钮，里面不会放任何文字，如果这个值设定，icon按钮也会有文字内容，但不可见。
            type: 'button', // button | checkbox | radio | input 在无插件的情况下只有button才能用。
            icon: '',//home | delete | plus | arrow-u | arrow-d | check | gear | grid | star | arrow-r | arrow-l | minus | refresh | forward | back | alert | info | search | custom
            iconpos: '',//left, top, right, bottom 只有在文字和图片都有的情况下才有用
            attributes: null,
            container: null
        },

        _createDefEL: function(){
            return $('<button>');
        },

        _prepareBtnEL: function(mode){
            return this.root();
        },

        _prepareDom : function(mode){
            var data = this._data, $el = this.root(), key;
            if(mode=='create'){
                (data.label || data.alttext) && (data._textSpan = $('<span class="ui-button-text">'+(data.label || data.alttext)+'</span>').appendTo(data._buttonElement));
                data.icon && (data._iconSpan = $('<span class="ui-icon ui-icon-'+data.icon+'"></span>').appendTo(data._buttonElement));
            } else if(mode == 'fullsetup') {
                data._textSpan = $('.ui-button-text', data._buttonElement);
                key = data._buttonElement.hasClass('ui-button-icon-only')?'alttext':'label';
                data[key] = data[key] || data._textSpan.text();
                data._iconSpan = $('.ui-icon', data._buttonElement);
                data.icon = data.icon || data._iconSpan.attr('class').match(iconRE) && RegExp.$1;
                data.iconpos = data.iconpos || data._buttonElement.attr('class').match(iconposRE) && RegExp.$1;
            } else {
                data.label = data.label || data._buttonElement.text() || $el.val();
                data.alttext = data.alttext || $el.attr('data-alttext');
                data.icon = data.icon || $el.attr('data-icon');
                data.iconpos = data.iconpos || $el.attr('data-iconpos');

                data._buttonElement.empty();
                data.icon && (data._iconSpan = $('<span class="ui-icon ui-icon-'+data.icon+'"></span>').appendTo(data._buttonElement));
                (data.label || data.alttext) && (data._textSpan = $('<span class="ui-button-text">'+(data.label || data.alttext)+'</span>').appendTo(data._buttonElement));
            }
        },

        _create: function () {
            var me = this, $el, data = me._data;

            !data.icon && !data.label && (data.label = '按钮');//如果既没有设置icon, 又没有设置label，则设置label为'按钮'

            $el = me._el || (me.root(me._createDefEL()));
            data._buttonElement = me._prepareBtnEL('create');
            me._prepareDom('create');
            $el.appendTo(data._container = $(data.container||'body'));
            data._buttonElement !== $el && data._buttonElement.insertAfter($el);
        },

        _detectType: function(){
            return 'button';
        },

        _setup: function( mode ){
            var me = this, data = me._data;
            mode = mode?'fullsetup':'setup';
            data.type = me._detectType();
            data._buttonElement = me._prepareBtnEL(mode);
            me._prepareDom( mode );
        },

        _prepareClassName: function(){
            var me = this,
                data = me._data,
                className = 'ui-button';

            className += data.label && data.icon ? ' ui-button-text-icon ui-button-icon-pos-'+(data.iconpos||'left') :
                data.label ? ' ui-button-text-only' : ' ui-button-icon-only';
            className += data.disabled?' ui-state-disable':'';
            className += data.selected?' ui-state-active':'';
            return className;
        },

        _init: function(){
            var me = this,
                $el = me.root(),
                data = me._data,
                className = me._prepareClassName();

            data.attributes && $el.attr(data.attributes);
            $el.prop('disabled', !!data.disabled);
            data._buttonElement.addClass(className).highlight(data.disabled?'':'ui-state-hover');

            //绑定事件
            data._buttonElement.on('click', $.proxy(me._eventHandler, me));
            $.each(['click', 'change'], function(){ //绑定在data中的事件， 这里只需要绑定系统事件
                data[this] && me.on(this, data[this]);
                delete data[this];
            });
        },

        /**
         * 事件管理器
         * @private
         */
        _eventHandler:function (event) {
            var data = this._data;
            if(data.disabled) {
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
            var data = this._data, change = data.disabled != !enable;
            if(change){
                data.disabled = !enable;
                data._buttonElement[enable?'removeClass':'addClass']('ui-state-disable').highlight(enable?'ui-state-hover':'');;
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
            var data = this._data;
            return this._setState(data.disabled);
        },

        _setSelected: function(val){
            var data = this._data;
            if(data.selected != val){
                data._buttonElement[ (data.selected = val) ? 'addClass':'removeClass' ]('ui-state-active');
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
            return this._setSelected(!this._data.selected);
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
            var me = this, data = this._data;
            data._buttonElement.off('click', me._eventHandler).highlight();
            data._buttonElement.remove();
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
})(Zepto);