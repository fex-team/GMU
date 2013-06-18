/**
 * @file 加载更多组件 － iScroll版
 * @name Refresh.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/refresh/refresh_iscroll.html</qrcode>
 * 拉动加载更多iscroll插件
 * @short Refresh.iscroll
 * @import core/zepto.iscroll.js, widget/refresh.js
 */

(function($, undefined) {
    /**
     * @name refresh.iscroll
     * @desc Refresh iscroll插件，支持拉动加载，内滚采用iscroll方式，体验更加贴近native。
     * @desc **Options** 在refresh的基础上增加参数
     * - ''threshold''   {Number}: (可选) 加载的阀值，默认向上或向下拉动距离超过5px，即可触发拉动操作，该值只能为正值，若该值是10，则需要拉动距离大于15px才可触发加载操作
     * - ''iScrollOpts'' {Object}: (可选) iScroll的配置项
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/refresh/refresh_iscroll.html">
     * ../gmu/_examples/widget/refresh/refresh_iscroll.html
     * </codepreview>
     */
    $.ui.refresh.register(function () {
        return {
            pluginName: 'iscroll',
            _init: function () {
                var me = this,
                    data = me._data,
                    $el = me.root(),
                    wrapperH = $el.height();

                me._initOrg();
                $.extend(data, {
                    useTransition: true,
                    speedScale: 1,
                    topOffset: data['$upElem'] ? data['$upElem'].height() : 0
                });
                data.threshold = data.threshold || 5;

                $el.wrapAll($('<div class="ui-refresh-wrapper"></div>').height(wrapperH)).css('height', 'auto');
                me._loadIscroll();
            },
            _changeStyle: function (dir, state) {
                var me = this,
                    data = me._data,
                    refreshInfo = data.refreshInfo[dir];

                me._changeStyleOrg(dir, state);
                switch (state) {
                    case 'loaded':
                        refreshInfo['$icon'].addClass('ui-refresh-icon');
                        break;
                    case 'beforeload':
                        refreshInfo['$label'].html('松开立即加载');
                        refreshInfo['$icon'].addClass('ui-refresh-flip');
                        break;
                    case 'loading':
                        refreshInfo['$icon'].removeClass().addClass('ui-loading');
                        break;
                }
                return me;
            },
            _loadIscroll: function () {
                var me = this,
                    data = me._data,
                    threshold = data.threshold;

                data.iScroll = new iScroll(me.root().parent().get(0), data.iScrollOpts = $.extend({
                    useTransition: data.useTransition,
                    speedScale: data.speedScale,
                    topOffset: data.topOffset
                }, data.iScrollOpts, {
                    onScrollStart: function (e) {
                        me.trigger('scrollstart', e);
                    },
                    onScrollMove: (function () {
                        var up = data.$upElem && data.$upElem.length ,
                            down = data.$downElem && data.$downElem.length;

                        return function (e) {
                            var upRefreshed = data['_upRefreshed'],
                                downRefreshed = data['_downRefreshed'],
                                upStatus = me._status('up'),
                                downStatus = me._status('down');
                                upEnable = data['_upEnable'],
                                downEnable = data['_downEnable'];

                            if (up && !upStatus && !!upEnable || down && !downStatus && !!downEnable || this.maxScrollY >= 0) return;    //上下不能同时加载 trace:FEBASE-775，当wrapper > scroller时，不进行加载 trace:FEBASE-774
                            if (downStatus && down && !downRefreshed && this.y < (this.maxScrollY - threshold)) {    //下边按钮，上拉加载
                                me._setMoveState('down', 'beforeload', 'pull');
                            } else if (upStatus && up && !upRefreshed && this.y > threshold) {     //上边按钮，下拉加载
                                me._setMoveState('up', 'beforeload', 'pull');
                                this.minScrollY = 0;
                            } else if (downStatus && downRefreshed && this.y > (this.maxScrollY + threshold)) {      //下边按钮，上拉恢复
                                me._setMoveState('down', 'loaded', 'restore');
                            } else if (upStatus && upRefreshed && this.y < threshold) {      //上边按钮，下拉恢复
                                me._setMoveState('up', 'loaded', 'restore');
                                this.minScrollY = -data.topOffset;
                            }
                            me.trigger('scrollmove', e);
                        };
                    })(),
                    onScrollEnd: function (e) {
                        var actDir = data._actDir;
                        if (actDir && me._status(actDir)) {   //trace FEBASE-716
                            me._setStyle(actDir, 'loading');
                            me._loadingAction(actDir, 'pull');
                        }
                        me.trigger('scrollend', e);
                    }
                }));
            },
            _setMoveState: function (dir, state, actType) {
                var me = this,
                    data = me._data;

                me._setStyle(dir, state);
                data['_' + dir + 'Refreshed'] = actType == 'pull';
                data['_actDir'] = actType == 'pull' ? dir : '';

                return me;
            },
            afterDataLoading: function (dir) {
                var me = this,
                    data = me._data,
                    dir = dir || data._actDir;

                data.iScroll.refresh();
                data['_' + dir + 'Refreshed'] = false;
                return me.afterDataLoadingOrg(dir);
            }
        }
    });
})(Zepto);