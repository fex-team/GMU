/**
 * @file 加载更多组件 － lite版本
 * @name Refresh.lite
 * @short Refresh.lite
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/refresh/refresh_lite.html</qrcode>
 * 上拉加载更多，利用原生滚动，不使用iscroll
 * @import widget/refresh.js
 */

(function($, undefined) {
    /**
     * @name refresh.lite
     * @desc Refresh lite插件，支持拉动加载。
     * @desc **Options** 在refresh的基础上增加参数
     * - ''threshold'' {Number}: (可选) 加载的阀值，默认手指在屏幕的一半，并且拉动距离超过10px即可触发加载操作，配置该值后，可以将手指在屏幕位置进行修重情重改，若需要实现连续加载效果，可将该值配置很大，如1000等
     * - ''seamless''  {Boolean}: (可选) 是否连续加载，解决设置threshold在部分手机上惯性滚动，或滚动较快时不触发touchmove的问题
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/refresh/refresh_lite.html">
     * ../gmu/_examples/widget/refresh/refresh_lite.html
     * </codepreview>
     */
    $.ui.refresh.register(function () {
        return {
            pluginName: 'lite',
            _init: function () {
                var me = this,
                    data = me._data,
                    $el = me.root();

                me._initOrg();
                data.seamless && $(document).on('scrollStop', $.proxy(me._eventHandler, me));
                $el.on('touchstart touchmove touchend touchcancel', $.proxy(me._eventHandler, me));
                data.wrapperH = me.root().height();
                data.wrapperTop = me.root().offset().top;
                data._win = window;
                data._body = document.body;
                return me;
            },
            _changeStyle: function (dir, state) {
                var me = this,
                    refreshInfo = me._data.refreshInfo[dir];

                if (state == 'beforeload') {
                    refreshInfo['$icon'].removeClass('ui-loading');
                    refreshInfo['$label'].html('松开立即加载');
                }
                return me._changeStyleOrg(dir, state);
            },
            _startHandler: function (e) {
                this._data._startY = e.touches[0].pageY;
            },
            _moveHandler: function (e) {
                var me = this,
                    data = me._data,
                    startY = data._startY,
                    movedY = startY - e.touches[0].pageY,
                    winHeight = data._win.innerHeight,
                    threshold = data.threshold || (data.wrapperH < winHeight ? (data.wrapperH / 2 + data.wrapperTop || 0) : winHeight / 2);     //默认值为可视区域高度的一半，若wrapper高度不足屏幕一半时，则为list的一半

                if (!me._status('down') || movedY < 0) return;
                if (!data['_refreshing'] && (startY >= data._body.scrollHeight - winHeight + threshold) && movedY > 10) {    //下边按钮，上拉加载
                    me._setStyle('down', 'beforeload');
                    data['_refreshing'] = true;
                }
                return me;
            },

            _endHandler: function () {
                var me = this,
                    data = me._data;
                me._setStyle('down', 'loading');
                me._loadingAction('down', 'pull');
                data['_refreshing'] = false;
                return me;
            },

            _eventHandler: function (e) {
                var me = this,
                    data = me._data;

                switch (e.type) {
                    case 'touchstart':
                        me._startHandler(e);
                        break;
                    case 'touchmove':
                        clearTimeout(data._endTimer);        //解决部分android上，touchmove未禁用时，touchend不触发问题
                        data._endTimer = $.later(function () {
                            me._endHandler();
                        }, 300);
                        me._moveHandler(e);
                        break;
                    case 'touchend':
                    case 'touchcancel':
                        clearTimeout(data._endTimer);
                        data._refreshing && me._endHandler();
                        break;
                    case 'scrollStop':
                        (!data._refreshing && data._win.pageYOffset >= data._body.scrollHeight - data._win.innerHeight + (data.threshold || -1)) && me._endHandler();
                        break;
                }
                return me;
            }
        }
    });
})(Zepto);