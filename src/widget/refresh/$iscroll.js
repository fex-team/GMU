/**
 * @file iScroll插件
 * @import extend/iscroll.js, widget/refresh/refresh.js
 */
(function( gmu, $, undefined ) {
    
    /**
     * iscroll插件，支持拉动加载，内滚采用iscroll方式，体验更加贴近native。
     * @class iscroll
     * @namespace Refresh
     * @pluginfor Refresh
     */
    /**
     * @property {Number} [threshold=5] 加载的阀值，默认向上或向下拉动距离超过5px，即可触发拉动操作，该值只能为正值，若该值是10，则需要拉动距离大于15px才可触发加载操作
     * @namespace options
     * @for Refresh
     * @uses Refresh.iscroll
     */
    /**
     * @property {Object} [iScrollOpts={}] iScroll的配置项
     * @namespace options
     * @for Refresh
     * @uses Refresh.iscroll
     */
    gmu.Refresh.register( 'iscroll', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el = me.$el,
                wrapperH = $el.height();

            $.extend(opts, {
                useTransition: true,
                speedScale: 1,
                topOffset: opts['$upElem'] ? opts['$upElem'].height() : 0
            });
            opts.threshold = opts.threshold || 5;

            $el.wrapAll($('<div class="ui-refresh-wrapper"></div>').height(wrapperH)).css('height', 'auto');

            me.on( 'ready', function(){
                me._loadIscroll();
            } );
        },
        _changeStyle: function (dir, state) {
            var me = this,
                opts = me._options,
                refreshInfo = opts.refreshInfo[dir];

            me.origin(dir, state);
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
                opts = me._options,
                threshold = opts.threshold;

            opts.iScroll = new iScroll(me.$el.parent().get(0), opts.iScrollOpts = $.extend({
                useTransition: opts.useTransition,
                speedScale: opts.speedScale,
                topOffset: opts.topOffset
            }, opts.iScrollOpts, {
                onScrollStart: function (e) {
                    me.trigger('scrollstart', e);
                },
                onScrollMove: (function () {
                    var up = opts.$upElem && opts.$upElem.length,
                        down = opts.$downElem && opts.$downElem.length;

                    return function (e) {
                        var upRefreshed = opts['_upRefreshed'],
                            downRefreshed = opts['_downRefreshed'],
                            upStatus = me._status('up'),
                            downStatus = me._status('down');

                        if (up && !upStatus || down && !downStatus || this.maxScrollY >= 0) return;    //上下不能同时加载 trace:FEBASE-775，当wrapper > scroller时，不进行加载 trace:FEBASE-774
                        if (downStatus && down && !downRefreshed && this.y < (this.maxScrollY - threshold)) {    //下边按钮，上拉加载
                            me._setMoveState('down', 'beforeload', 'pull');
                        } else if (upStatus && up && !upRefreshed && this.y > threshold) {     //上边按钮，下拉加载
                            me._setMoveState('up', 'beforeload', 'pull');
                            this.minScrollY = 0;
                        } else if (downStatus && downRefreshed && this.y > (this.maxScrollY + threshold)) {      //下边按钮，上拉恢复
                            me._setMoveState('down', 'loaded', 'restore');
                        } else if (upStatus && upRefreshed && this.y < threshold) {      //上边按钮，下拉恢复
                            me._setMoveState('up', 'loaded', 'restore');
                            this.minScrollY = -opts.topOffset;
                        }
                        me.trigger('scrollmove', e);
                    };
                })(),
                onScrollEnd: function (e) {
                    var actDir = opts._actDir;
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
                opts = me._options;

            me._setStyle(dir, state);
            opts['_' + dir + 'Refreshed'] = actType == 'pull';
            opts['_actDir'] = actType == 'pull' ? dir : '';

            return me;
        },
        afterDataLoading: function (dir) {
            var me = this,
                opts = me._options,
                dir = dir || opts._actDir;

            opts.iScroll.refresh();
            opts['_' + dir + 'Refreshed'] = false;
            return me.origin(dir);
        }
    } );
})( gmu, gmu.$ );