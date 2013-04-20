
/**
 * @file 加载更多组件 － iOS5版，采用overflow:''scroll''实现
 * @name Refresh.iOS5
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/refresh/refresh_iOS5.html</qrcode>
 * 拉动加载更多iOS5插件，适用于iOS5及以上
 * @short Refresh.iOS5
 * @import widget/refresh.js
 */

(function($, undefined) {
    /**
     * @name refresh.iOS5
     * @desc Refresh iOS5插件，支持iOS5和以上设备，使用系统自带的内滚功能。
     * @desc **Options** 在refresh的基础上增加参数
     * - ''threshold'' {Number}: (可选) 加载的阀值，默认向上或向下拉动距离超过5px，即可触发拉动操作，该值只能为正值，若该值是10，则需要拉动距离大于15px才可触发加载操作
     * - ''topOffset'' {Number}: (可选) 上边缩进的距离，默认为refresh按钮的高度，建议不要修改
     */
    $.ui.refresh.register(function () {
        return {
            pluginName: 'iOS5',
            _init: function () {
                var me = this,
                    data = me._data,
                    $el = me.root();

                me._initOrg();
                $el.css({
                    'overflow': 'scroll',
                    '-webkit-overflow-scrolling': 'touch'
                });
                data.topOffset = data['$upElem'] ? data['$upElem'].height() : 0;
                data.iScroll = me._getiScroll();
                $el.get(0).scrollTop = data.topOffset;
                $el.on('touchstart touchmove touchend', $.proxy(me._eventHandler, me));
            },
            _changeStyle: function (dir, state) {
                var me = this,
                    data = me._data,
                    refreshInfo = data.refreshInfo[dir];

                me._changeStyleOrg(dir, state);
                switch (state) {
                    case 'loaded':
                        refreshInfo['$icon'].addClass('ui-refresh-icon');
                        data._actDir = '';
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

            _scrollStart: function (e) {
                var me = this,
                    data = me._data,
                    topOffset = data.topOffset,
                    $upElem = data.$upElem,
                    wrapper = me.root().get(0),
                    _scrollFn = function () {
                        clearTimeout(me.data('topOffsetTimer'));
                        if ($upElem && $upElem.length && wrapper.scrollTop <= topOffset && !data['_upRefreshed']) {

                            wrapper.scrollTop = topOffset;
                        }
                    };

                me.trigger('scrollstart', e);
                me._enableScroll()._bindScrollStop(wrapper, _scrollFn);      //保证wrapper不会滑到最底部或最顶部，使其处于可滑动状态
                data.maxScrollY = wrapper.offsetHeight - wrapper.scrollHeight;
                data._scrollFn = _scrollFn;

                return me;
            },

            _scrollMove: function () {
                var me = this,
                    data = me._data,
                    up = data.$upElem && data.$upElem.length ,
                    down = data.$downElem && data.$downElem.length,
                    wrapper = me.root().get(0),
                    threshold = data.threshold || 5;

                me._scrollMove = function (e) {
                    var maxScrollY = data.maxScrollY,
                        scrollY = wrapper.scrollTop,
                        lastMoveY = data.lastMoveY || scrollY,
                        upRefreshed = data['_upRefreshed'],
                        downRefreshed = data['_downRefreshed'],
                        upStatus = me._status('up'),
                        downStatus = me._status('down');

                    if (up && !upStatus || down && !downStatus) return;    //处于数据正在加载中，即上次加载还未完成，直接返回, 增加上下按钮的同时加载处理 traceID:FEBASE-569, trace:FEBASE-775
                    data.iScroll.deltaY = scrollY - lastMoveY;    //每次在touchmove时更新偏移量的值
                    if (downStatus && down && !downRefreshed && -scrollY < (maxScrollY - threshold)) {      //下边按钮，上拉加载
                        me._setMoveState('down', 'beforeload', 'pull');
                    } else if (downStatus && down && downRefreshed && -scrollY > (maxScrollY - threshold) && -scrollY !== maxScrollY) {   //下边按钮，上拉恢复  -scrollY !== maxScrollY for trace784
                        me._setMoveState('down', 'loaded', 'restore');
                    } else if (upStatus && up && !upRefreshed && -scrollY > threshold ) {      //上边按钮，下拉加载
                        me._setMoveState('up', 'beforeload', 'pull');
                    } else if (upStatus && up && upRefreshed && -scrollY < threshold && scrollY) {       //上边按钮，下拉恢复，scrollY !== 0  for trace784
                        me._setMoveState('up', 'loaded', 'restore');
                    }

                    data.lastMoveY = scrollY;
                    data._moved = true;
                    return me.trigger('scrollmove', e, scrollY, scrollY - lastMoveY);
                };
                me._scrollMove.apply(me, arguments);
            },

            _scrollEnd: function (e) {
                var me = this,
                    data = me._data,
                    wrapper = me.root().get(0),
                    topOffset = data.topOffset,
                    actDir = data._actDir,
                    restoreDir = data._restoreDir;

                /*上边的铵钮隐藏，隐藏条件分以下几种
                 1.上边按钮复原操作: restoreDir == 'up'，延迟200ms
                 2.上边按钮向下拉，小距离，未触发加载: scrollTop <= topOffset，延迟800ms
                 3.上边按钮向下拉，小距离，未触发加载，惯性回弹：scrollTop <= topOffset，延迟800ms
                 4.上边按钮向下拉，大距离，再回向上拉，惯性回弹scrollTop <= topOffset不触发，走touchstart时的绑定的scroll事件
                 5.上边按钮向下拉，触发加载，走action中的回弹
                 */
                if ((restoreDir == 'up' || wrapper.scrollTop <= topOffset) && !actDir && data._moved) {
                    me.data('topOffsetTimer', $.later(function () {
                        $(wrapper).off('scroll', data._scrollFn);     //scroll事件不需要再触发
                        wrapper.scrollTop = topOffset;
                    }, 800));
                }

                if (actDir && me._status(actDir)) {
                    me._setStyle(actDir, 'loading');
                    me._loadingAction(actDir, 'pull');
                }

                data._moved = false;
                return me.trigger('scrollend', e);
            },

            _enableScroll: function () {
                var me = this,
                    wrapper = me.root().get(0),
                    scrollY = wrapper.scrollTop;

                scrollY <= 0 && (wrapper.scrollTop = 1);       //滑动到最上方
                if (scrollY + wrapper.offsetHeight >= wrapper.scrollHeight) {    //滑动到最下方
                    wrapper.scrollTop = wrapper.scrollHeight - wrapper.offsetHeight - 1;
                }

                return me;
            },

            _bindScrollStop: function (elem, fn) {
                var me = this,
                    $elem = $(elem);

                $elem.off('scroll', me._data._scrollFn).on('scroll', $.debounce(100, function(){
                    $elem.off('scroll', arguments.callee).one('scroll', fn);
                }, false));

                return me;
            },

            _getiScroll: function () {
                var me = this,
                    $wrapper = me.root(),
                    wrapper = $wrapper[0];
                return {
                    el: wrapper,
                    deltaY: 0,
                    scrollTo: function (y, time, relative) {
                        if (relative) {
                            y = wrapper.scrollTop + y;
                        }
                        $wrapper.css({
                            '-webkit-transition-property':'scrollTop',
                            '-webkit-transition-duration':y + 'ms'
                        });
                        wrapper.scrollTop = y;
                    },

                    disable: function (destroy) {
                        destroy && me.destroy();
                        $wrapper.css('overflow', 'hidden');
                    },

                    enable:function () {
                        $wrapper.css('overflow', 'scroll');
                    }
                }
            },

            _setMoveState: function (dir, state, actType) {
                var me = this,
                    data = me._data;

                me._setStyle(dir, state);
                data['_' + dir + 'Refreshed'] = actType == 'pull';
                data['_actDir'] = actType == 'pull' ? dir : '';
                data['_restoreDir'] = dir == 'up' && actType == 'restore' ? dir : ''
                return me;
            },

            _eventHandler: function (e) {
                var me = this;
                switch(e.type) {
                    case 'touchstart':
                        me._scrollStart(e);
                        break;
                    case 'touchmove':
                        me._scrollMove(e);
                        break;
                    case 'touchend':
                        me._scrollEnd(e);
                        break;
                }
            },
            afterDataLoading: function (dir) {
                var me = this,
                    data = me._data,
                    dir = dir || data._actDir;

                data['_' + dir + 'Refreshed'] = false;
                dir == 'up' && (me.root().get(0).scrollTop = data.topOffset);
                return me.afterDataLoadingOrg(dir);
            }
        }
    });
})(Zepto);