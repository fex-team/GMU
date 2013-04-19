/**
 * @file Dropmenu － 内滚插件
 * @name Dropmenu － 内滚插件
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/dropmenu/dropmenu_iscroll.html</qrcode>
 * @short Dropmenu.iscroll
 * @import widget/dropmenu.js, core/zepto.iscroll.js
 */
(function($, undefined){
    $.ui.dropmenu.register(function(){
        return {
            pluginName: 'iscroll',
            show: function(){
                var data = this._data;
                data.iScroll && window.iScroll && this._initiScroll();
                this.show = this.showOrg;
                return this.show.apply(this, arguments);
            },
            _initiScroll:function () {
                var data = this._data;
                data._items.wrap('<div class="iscroll-wrap"></div>');
                data._iWrap = $('.iscroll-wrap', this._el);
                data._iScroll = new iScroll(data._iWrap.get(0), $.extend({
                    hScroll: data.direction == 'horizontal',
                    vScroll: data.direction != 'horizontal'
                }, $.isObject(data.iScroll)?data.iScroll:{}));
                this._el.addClass('has-iScroll');
            }
        }
    });
    /**
     * @name dropmenu.iscroll
     * @desc 此插件使dropmenu带有内滚功能。
     *
     * 在初始化时需要传入iScroll参数才能启用此功能，如传入true，也可以传入对象，此对象在初始化 iScroll的时候可以将传入
     *
     * <code>
     * $('#dromenu').dropmenu({
     *     iScroll: {
     *         useTransform: false,
     *         //... 所有有效的iscroll选项都可以
     *     }
     * });
     * </code>
     *
     * @notice 需要带内滚功能时，需要同时设置width或者height，否则width和height将自适应与内容宽高，这样的话不具备滚动条件。
     *
     * @desc
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/dropmenu/dropmenu_iscroll.html">
     * ../gmu/_examples/widget/dropmenu/dropmenu_iscroll.html
     * </codepreview>
     */
})(Zepto);