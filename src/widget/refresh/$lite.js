/**
 * @file lite插件，上拉加载更多，利用原生滚动，不使用iscroll
 * @import widget/refresh/refresh.js
 */

(function( gmu, $, undefined ) {
    
    /**
     * lite插件，上拉加载更多，利用原生滚动，不使用iscroll
     * @class lite
     * @namespace Refresh
     * @pluginfor Refresh
     */
    /**
     * @property {Number} [threshold=5] 加载的阀值，默认手指在屏幕的一半，并且拉动距离超过10px即可触发加载操作，配置该值后，可以将手指在屏幕位置进行修重情重改，若需要实现连续加载效果，可将该值配置很大，如1000等
     * @namespace options
     * @for Refresh
     * @uses Refresh.lite
     */
    /**
     * @property {Boolean} [seamless=false] 是否连续加载，解决设置threshold在部分手机上惯性滚动，或滚动较快时不触发touchmove的问题
     * @namespace options
     * @for Refresh
     * @uses Refresh.lite
     */
    gmu.Refresh.register( 'lite', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el = me.$el;

            opts.seamless && $(document).on('scrollStop', $.proxy(me._eventHandler, me));
            $el.on('touchstart touchmove touchend touchcancel', $.proxy(me._eventHandler, me));
            opts.wrapperH = $el.height();
            opts.wrapperTop = $el.offset().top;
            opts._win = window;
            opts._body = document.body;
            return me;
        },
        _changeStyle: function (dir, state) {
            var me = this,
                refreshInfo = me._options.refreshInfo[dir];

            if (state == 'beforeload') {
                refreshInfo['$icon'].removeClass('ui-loading');
                refreshInfo['$label'].html('松开立即加载');
            }
            return me.origin(dir, state);
        },
        _startHandler: function (e) {
            this._options._startY = e.touches[0].pageY;
        },
        _moveHandler: function (e) {
            var me = this,
                opts = me._options,
                startY = opts._startY,
                movedY = startY - e.touches[0].pageY,
                winHeight = opts._win.innerHeight,
                threshold = opts.threshold || (opts.wrapperH < winHeight ? (opts.wrapperH / 2 + opts.wrapperTop || 0) : winHeight / 2);     //默认值为可视区域高度的一半，若wrapper高度不足屏幕一半时，则为list的一半

            if (!me._status('down') || movedY < 0) return;
            if (!opts['_refreshing'] && (startY >= opts._body.scrollHeight - winHeight + threshold) && movedY > 10) {    //下边按钮，上拉加载
                me._setStyle('down', 'beforeload');
                opts['_refreshing'] = true;
            }
            return me;
        },

        _endHandler: function () {
            var me = this,
                opts = me._options;
            me._setStyle('down', 'loading');
            me._loadingAction('down', 'pull');
            opts['_refreshing'] = false;
            return me;
        },

        _eventHandler: function (e) {
            var me = this,
                opts = me._options;

            switch (e.type) {
                case 'touchstart':
                    me._startHandler(e);
                    break;
                case 'touchmove':
                    clearTimeout(opts._endTimer);        //解决部分android上，touchmove未禁用时，touchend不触发问题
                    opts._endTimer = setTimeout( function () {
                        me._endHandler();
                    }, 300);
                    me._moveHandler(e);
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(opts._endTimer);
                    opts._refreshing && me._endHandler();
                    break;
                case 'scrollStop':
                    (!opts._refreshing && opts._win.pageYOffset >= opts._body.scrollHeight - opts._win.innerHeight + (opts.threshold || -1)) && me._endHandler();
                    break;
            }
            return me;
        }
    } );
})( gmu, gmu.$ );