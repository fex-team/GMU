/**
 * @file 导航栏组件 － iScroll插件
 * @name Navigator.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/webapp/naivgator/navigator.html</qrcode>
 * navigator iscroll插件，可滚动导航栏
 * @import core/zepto.iscroll.js, widget/navigator.js
 */

(function ($, undefined) {
    $.ui.navigator.register(function () {
        return {
            pluginName: 'snap',
            _init: function () {
                return this._adjustHtml()._reBindEvent()._initOrg();
            },
            _reBindEvent: function () {
                var me = this,
                    data = me._data;

                me._loadIscroll();
                $(window).on('ortchange', $.proxy(me._ortChangeHandler, me));
                me.on('destroy', function () {
                    $(window).off('ortchange', me._ortChangeHandler);
                    data.iScroll.destroy();
                });
                return me;
            },
            _adjustHtml: function () {
                var me = this,
                    data = me._data,
                    $el = me.root().addClass('ui-navigator'),
                    $navScroller = $el.find('ul'),
                    $navWrapper = $el.find('.ui-navigator-wrapper'),
                    $navList = $navScroller.find('li'),
                    itemWidth;

                !$navWrapper.length && $navScroller.wrap($navWrapper = $('<div class="ui-navigator-wrapper"></div>'));    //smart模式
                $navList.width(itemWidth = $navWrapper.width() / (data.viewportCount || 4));
                $.extend(data, {
                    _$navWrapper: $el.find('.ui-navigator-wrapper'),
                    _$navScroller: $navScroller.width(itemWidth * $navList.size()),
                    _$navList: $navList,
                    _itemWidth: itemWidth,
                    _$fixElemLeft: $el.find('.ui-navigator-fixleft'),
                    _$fixElemRight: $el.find('.ui-navigator-fixright')
                });

                return me;
            },
            _loadIscroll:function () {
                var me = this,
                    data = me._data;

                data.iScroll = iScroll(data._$navWrapper.get(0), data.iScrollOpts = $.extend({
                    hScroll:true,
                    vScroll:false
                }, data.iScrollOpts, {
                    onScrollStart:function (e) {
                        me.trigger('scrollstart', e);
                    },
                    onScrollMove:function (e) {
                        me.trigger('scrollmove', e);
                    },
                    onScrollEnd:function (e) {
                        me.trigger('scrollend', e);
                    }
                }));
                return me;
            },
            _ortChangeHandler:function () {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll;

                iScroll.refresh();
                data._$navWrapper.width(iScroll.wrapperW - iScroll.wrapperOffsetLeft);
            },
            _switchTabHandler: function (e) {
                var me = this,
                    target = e.target,
                    snapEvent = $.Event('snaptonav');

                if ($(target).closest('li').get(0)) {
                    me.switchTo(target.index, false, e);
                } else {
                    if (snapEvent.preventDefault()) {
                        return me;
                    }
                    me.trigger(snapEvent);
                }
                return me;
            },
            scrollToNav: function (num, time) {
                var me = this,
                    data = me._data,
                    scrollCount = num - data.viewportCount;

                scrollCount > 0 && data.iScroll.scrollTo(-scrollCount * data._itemWidth, 0, time || 400);
                return me;
            },
            scrollToPage: function (pageX, pageY, time) {
                this._data.iScroll.scrollToPage(pageX, pageY, time);
                return this;
            },
            getNav: function () {
                return this._data._$navList;
            }
        }
    });
})(Zepto);
