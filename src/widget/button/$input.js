/**
 * @file Button － 表单插件
 * @name Button － 表单插件
 * @short Button.input
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/button/button_input.html</qrcode>
 * button组件下的表单插件，用来扩展按钮类型，在没有插件的情况，只支持button，加此插件后，可以支持以下类型
 * - ''checkbox'' 复选按钮
 * - ''radio'' 单选按钮
 * - ''input'' input按钮（包括type为input, button, submit, reset的input）
 *
 * **使用方法**
 * <code type="javascript">
 * $.ui.button({
 *   type: 'radio'
 * });
 * </code>
 *
 * **如果使用setup模式，类型将自动识别, 规则为: **
 * <tabs>
 * | button | checkbox | radio | input |
 * <code type="html">
 *     <a class="button">按钮</a>
 *     <button class="button">按钮</button>
 * </code>
 * -----
 * <code type="html">
 *     <input class="button" type="checkbox" id="input1" />
 *     <label for="input1">复选按钮</label>
 * </code>
 * -----
 * <code type="html">
 *     <input class="button" type="radio" id="input1" />
 *     <label for="input1">单选按钮</label>
 * </code>
 * -----
 * <code type="html">
 *     <input class="button" type="button" />
 *     <input class="button" type="submit" />
 *     <input class="button" type="reset" />
 * </code>
 * </tabs>
 *
 * **如果是setup模式，且类型为radio或者checkbox某些参数的读取如下**
 * - ''selected'' 读取input的checked属性
 * - ''disabled'' 读取input的selected属性
 * - ''label'' 读取input对应的label的文本内容。
 * **比如**
 * <code>//<input id="btn" name="input1" checked="checked" type="checkbox" /><label for="btn" >复选按钮</label>
 * console.log($('#btn').button('data', 'label')); // => 复选按钮
 * console.log($('#btn').button('data', 'selected')); // => true
 * </code>
 *
 * **Demo**
 * <codepreview href="../examples/widget/button/button_input.html">
 * ../gmu/examples/widget/button/button_input.html
 * ../gmu/examples/widget/button/button_demo.css
 * </codepreview>
 *
 *
 * @import widget/button/button.js
 */
(function( gmu, $, undefined ) {
    var _uid = 1,
        uid = function(){
            return _uid++;
        },
        defaultElement = {
            button: '<button>',
            checkbox: '<input type="checkbox" />',
            radio: '<input type="radio" />',
            input: '<input type="button" />'
        },
        radioGroup = function( radio ) {
            var name = radio.name,
                form = radio.form,
                radios = $( [] );
            if ( name ) {
                if ( form ) {
                    radios = $( form ).find( "[name='" + name + "']" );
                } else {
                    radios = $( "[name='" + name + "']", radio.ownerDocument );
                }
            }
            return radios;
        };

    gmu.Button.register( 'input', {
        _init: function(){
            var opts = this._options;

            this.on( 'ready', function(){
                (opts.type == 'checkbox' || opts.type =='radio') && this.$el.prop('checked', !!opts.selected);
            } );
        },

        _createDefEL: function(){
            return $(defaultElement[this._options.type]) || this.origin();
        },

        _detectType: function(){
            var $el = this.$el;
            return $el.is('[type=checkbox]')?'checkbox': $el.is('[type=radio]') ? 'radio' : $el.is("input")? 'input': this.origin();
        },

        _prepareBtnEL: function(mode){
            var opts = this._options, _id, btnEl, $el, labelSelector;
            if(opts.type == 'checkbox' || opts.type == 'radio') {
                $el = this.$el;
                $el.addClass('ui-helper-hidden');
                if(mode == 'create') {
                    if(!(_id = opts.attributes && opts.attributes.id)){
                        _id = 'input_'+uid();
                        $.extend(opts.attributes || (opts.attributes = {}), {id: _id});
                    }
                    btnEl =  $('<label for="'+_id+'"></label>');
                } else {
                    labelSelector = "label[for='" + $el.attr("id") + "']";
                    btnEl = $el.siblings(labelSelector);//todo 如果没有label，是不是应该创建一个label?
                    if(!btnEl.length){
                        btnEl = $el.parent().find(labelSelector);
                    }
                    opts.selected = opts.selected || $el.prop('checked');
                }
            }
            return btnEl?btnEl:this.origin(mode);
        },
        _prepareDom: function(mode){
            var opts = this._options, $el;
            if(opts.type == 'input'){
                $el = this.$el;
                opts.label && $el.val(opts.label);
                if(mode != 'create'){
                    opts.label = $el.val();
                }
            } else return this.origin(mode);
        },

        _setSelected: function(val){
            var opts = this._options, type = opts.type;
            opts.selected != val && (type == 'checkbox' || type == 'radio') && this.$el.prop('checked', val);
            return this.origin(val);
        },

        _eventHandler: function(e){
            var opts = this._options, radio;
            if(!opts.disabled) {
                if(opts.type == 'checkbox'){
                    opts._buttonElement.toggleClass( "ui-state-active" );
                    opts.selected = !opts.selected;
                } else if(opts.type == 'radio'){
                    opts._buttonElement.addClass( "ui-state-active" );
                    opts.selected = true;
                    radio = this.$el[0];
                    $.each(radioGroup( radio )
                        .not( radio )
                        .map(function() {
                            return $( this ).button( "this" );
                        }), function(){
                        if(!this instanceof gmu.Button)return ;
                        this.unselect();
                    });
                }
            }
            return this.origin(e);
        },
        /**
         * @name setIcon
         * @grammar setIcon(icon) ⇒ instance
         * @desc 设置按钮图标
         * @example $('a').button('setIcon', 'home'); // 将所有a实例化成button，然后设置icon为home
         */
        setIcon: function(icon) {
            var opts = this._options, text = opts.label;
            if(opts.icon != icon && opts.type!= 'input'){
                if(opts.icon){
                    if(!icon){
                        opts._iconSpan.remove();
                        opts._iconSpan = null;
                        opts._buttonElement.removeClass(text?'ui-button-text-icon':'ui-button-icon-only').addClass('ui-button-text-only');
                    } else {
                        opts._iconSpan.removeClass('ui-icon-'+opts.icon).addClass('ui-icon-'+icon);
                    }
                }else {
                    opts._iconSpan = $('<span class="ui-icon ui-icon-'+icon+'"></span>').appendTo(this._buttonElement);
                    opts._buttonElement.removeClass('ui-button-text-only').addClass(text?'ui-button-text-icon':'ui-button-icon-only');
                }
                opts.icon = icon;
            }
            return this;
        }
        } );
})( gmu, gmu.$);
