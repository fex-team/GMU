/**
 * @file 快速删除组件
 * @name Quickdelete
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 快速删除组件
 * @import core/zepto.ui.js
 */
(function($) {
    /**
     * @name   quickdelete
     * @grammar  quickdelete    =>self
     * @grammar  $.ui.quickdelete([options])    =>self
     * @desc   快速删除组件
     * **Options**
     * - ''container''     {Selector}: (必选)父元素
     * - ''delete''        {Function}: (可选)点击close按钮时触发
     * - ''size''          {Number}: (可选，默认: 20)close按钮的大小
     * - ''offset''        {Object}: (可选，默认: {x:0, y:0})close按钮偏移量
     *
     * **setup方式html规则**
     * <code type="html">
     * <input type="text" id="input">
     * </code>
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/suggestion/suggestion_setup.html">
     * ../gmu/_examples/widget/suggestion/suggestion_setup.html
     * </codepreview>
     */
    $.ui.define('quickdelete', {
        _data: {
            size: 20,
            offset: {x: 0, y: 0}
        },

        _create: function() {
            var me = this,
                $input = me.data('input', $(me.data('container'))),
                expando = +new Date(),
                maskID = 'ui-input-mask-' + expando,
                elemID = "ui-quickdelete-delete-" + expando,
                $maskElem = $input.parent(),
                $deleteElem = $('<div id="' + elemID + '" class="ui-quickdelete-button"></div>').css({
                    height: me.data('size'),
                    width: me.data('size')
                });

            //在android2.1下-webkit-background-size不支持contain属性，
            $.os.android && $.os.android && parseFloat($.os.version).toFixed(1) == 2.1 && $deleteElem.css('-webkit-background-size', '20px 20px');
            if ($maskElem.attr('class') != 'ui-input-mask') {
                // avoid input blur
                $maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>').appendTo($input.parent()).append($input);      
            }

            me.root($maskElem.append(me.data('deleteElem', $deleteElem)).css('height', $input.height()));
            me._initButtonOffset();
        },

        _setup: function(){
            var me = this;
            me.data('container', me.root());
            this._create();
        },

        _init: function() {
            var me = this,
                $input = me.data('input'),
                eventHandler = $.proxy(me._eventHandler, me);

            $input.on('focus input blur', eventHandler);
            me.data('deleteElem').on('touchstart', eventHandler);
            me.on('destroy', function(){
                $input.off('focus input blur', eventHandler);
                me.data('deleteElem').off('touchstart', eventHandler);
                eventHandler = $.fn.emptyFn;
            });
            me.trigger('init');
        },

        _show: function() {
            this.data('deleteElem').css('visibility', 'visible');
            return this;
        },

        _hide: function() {
            this.data('deleteElem').css('visibility', 'hidden');
            return this;
        },

        _eventHandler: function(e){
            var me = this,
                type = e.type,
                target = e.target,
                $input = me.data('input');

            switch (type) {
                case 'focus':
                case 'input':
                    $.trim($input.val()) ? me._show() : me._hide();
                    break;
                case 'mousedown':
                case 'touchstart':
                    if (target == me.data('deleteElem').get(0)) {
                        e.preventDefault();
                        e.formDelete = true; // suggestion解决删除问题
                        $input.val('');
                        me._hide().trigger('delete');
                        $input.blur().focus();      //中文输入时，focus失效 trace:FEBASE-779
                    }
                    break;
                case 'blur':
                    me._hide();
                    break;
            }
        },

        _initButtonOffset: function() {
            var me = this,
                $input = me.data('input'),
                size = me.data('size'),
                targetOffset = me.root().offset(),
                customOffset = me.data('offset'),
                offsetX = customOffset.x || 0,
                offsetY = customOffset.y || 0,
                paddingOffsetY = Math.round((targetOffset.height - 2*offsetY - size) / 2); // padding值根据外层容器的宽度-Y的偏移量-小叉的大小

            me.data('deleteElem').css({
                padding: paddingOffsetY < 0 ? 0 : paddingOffsetY,
                top: offsetY,
                right: offsetX
            });

            $input.css({ // 处理输入长字符串，input挡住删除按钮问题
                position: 'absolute',
                top: 0,
                left: 0,
                width: 'auto',
                right: size + 20
            });
            return me;
        }
    });

})(Zepto);