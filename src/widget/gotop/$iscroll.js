
/**
 * @file Gotop - 内滚插件
 * @name Gotop － iscroll插件
 * @short Gotop.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/gotop/gotop_iscroll.html</qrcode>
 * @import extend/iscroll.js, widget/gotop/gotop.js
 */
(function( gmu, $, undefined) {
    /**
     * @name gotop.iscroll
     * @desc 在使用iScroll的页面上使用gotop组件时，需要加入该插件
     * @desc 使用iscroll后useAnimation参数不起作用
     * **Options**
     * - ''iScrollInstance'' {Object}: (必选)创建好的iScroll实例,使用iscroll时需要传入iScroll实例,用来判定显示与隐藏【useAnimation参数会失效】
     *
     * <code>
     * $('#gotop').gotop({
     *     iScrollInstance: iscroll //创建好的iScroll实例
     * });
     * </code>
     * @desc
     * **Demo**
     * <codepreview href="../examples/widget/gotop/gotop_iscroll.html">
     * ../gmu/examples/widget/gotop/gotop_iscroll.html
     * ../gmu/examples/widget/gotop/gotop_demopts.css
     * </codepreview>
     */
    gmu.Gotop.register( 'iscroll', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el,
                iscroll = opts.iScrollInstance,
                _move = iscroll.options.onScrollMove,       //防止覆写
                _end = iscroll.options.onScrollEnd;

            iscroll.options.onScrollMove = function() {
                _move && _move.call(iscroll, arguments);
                opts.useHide && me.hide();
            };
            iscroll.options.onScrollEnd = function() {
                _end && _end.call(iscroll, arguments);
                me._check(Math.abs(iscroll.y));
                if(opts._scrollClick) {    //只在click之后的scrollEnd触发afterScroll事件
                    me.trigger('afterScroll');
                    opts._scrollClick = false;
                }
            };

            me.on( 'ready', function() {
                $el = me.$el;

                $el.on('click', function() {
                    opts._scrollClick = true;
                    iscroll.scrollTo(0, 0);
                });
                
                opts.useFix && $el.fix(opts.position);
                opts.root = $el[0];
            } );

            me.on('destroy', function() {
                iscroll.options.onScrollMove = _move;       //恢复引用
                iscroll.options.onScrollEnd = _end;
            });
        },

        _eventHandler: function(e) {},

        _scrollTo: function(){}
    } );
})( gmu, gmu.$ );