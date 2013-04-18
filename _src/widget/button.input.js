/**
 * @file Button － 表单插件
 * @name Button － 表单插件
 * @short Button.input
 * @desc button组件下的表单插件，用来扩展按钮类型，在没有插件的情况，只支持button，加此插件后，可以支持以下类型
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
 *
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
 * <codepreview href="../gmu/_examples/widget/button/button_input.html">
 * ../gmu/_examples/widget/button/button_input.html
 * ../gmu/_examples/widget/button/button_demo.css
 * </codepreview>
 *
 *
 * @import widget/button.js
 */
(function($, undefined){
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

    $.ui.button.register(function(){
        return {
            pluginName: 'input',
            _init: function(){
                var data = this._data;
                this._initOrg();
                (data.type == 'checkbox' || data.type =='radio') && this.root().prop('checked', !!data.selected);
            },

            _createDefEL: function(){
                return $(defaultElement[this._data.type]) || this._createDefELOrg();
            },

            _detectType: function(){
                var $el = this.root();
                return $el.is('[type=checkbox]')?'checkbox': $el.is('[type=radio]') ? 'radio' : $el.is("input")? 'input': this._detectTypeOrg();
            },

            _prepareBtnEL: function(mode){
                var data = this._data, _id, btnEl, $el, labelSelector;
                if(data.type == 'checkbox' || data.type == 'radio') {
                    $el = this.root();
                    $el.addClass('ui-helper-hidden');
                    if(mode == 'create') {
                        if(!(_id = data.attributes && data.attributes.id)){
                            _id = 'input_'+uid();
                            $.extend(data.attributes || (data.attributes = {}), {id: _id});
                        }
                        btnEl =  $('<label for="'+_id+'"></label>');
                    } else {
                        labelSelector = "label[for='" + $el.attr("id") + "']";
                        btnEl = $el.siblings(labelSelector);//todo 如果没有label，是不是应该创建一个label?
                        if(!btnEl.length){
                            btnEl = $el.parent().find(labelSelector);
                        }
                        data.selected = data.selected || $el.prop('checked');
                    }
                }
                return btnEl?btnEl:this._prepareBtnELOrg(mode);
            },
            _prepareDom: function(mode){
                var data = this._data, $el;
                if(data.type == 'input'){
                    $el = this.root();
                    data.label && $el.val(data.label);
                    if(mode != 'create'){
                        data.label = $el.val();
                    }
                } else return this._prepareDomOrg(mode);
            },

            _setSelected: function(val){
                var data = this._data, type = data.type;
                data.selected != val && (type == 'checkbox' || type == 'radio') && this._el.prop('checked', val);
                return this._setSelectedOrg(val);
            },

            _eventHandler: function(e){
                var data = this._data, radio;
                if(!data.disabled) {
                    if(data.type == 'checkbox'){
                        data._buttonElement.toggleClass( "ui-state-active" );
                        data.selected = !data.selected;
                    } else if(data.type == 'radio'){
                        data._buttonElement.addClass( "ui-state-active" );
                        data.selected = true;
                        radio = this._el[0];
                        $.each(radioGroup( radio )
                            .not( radio )
                            .map(function() {
                                return $( this ).button( "this" );
                            }), function(){
                            if(!this instanceof $.ui.button)return ;
                            this.unselect();
                        });
                    }
                }
                return this._eventHandlerOrg(e);
            },
            /**
             * @name setIcon
             * @grammar setIcon(icon) ⇒ instance
             * @desc 设置按钮图标
             * @example $('a').button('setIcon', 'home'); // 将所有a实例化成button，然后设置icon为home
             */
            setIcon: function(icon) {
                var data = this._data, text = data.label;
                if(data.icon != icon && data.type!= 'input'){
                    if(data.icon){
                        if(!icon){
                            data._iconSpan.remove();
                            data._iconSpan = null;
                            data._buttonElement.removeClass(text?'ui-button-text-icon':'ui-button-icon-only').addClass('ui-button-text-only');
                        } else {
                            data._iconSpan.removeClass('ui-icon-'+data.icon).addClass('ui-icon-'+icon);
                        }
                    }else {
                        data._iconSpan = $('<span class="ui-icon ui-icon-'+icon+'"></span>').appendTo(this._buttonElement);
                        data._buttonElement.removeClass('ui-button-text-only').addClass(text?'ui-button-text-icon':'ui-button-icon-only');
                    }
                    data.icon = icon;
                }
                return this;
            }
        };
    });
})(Zepto);
