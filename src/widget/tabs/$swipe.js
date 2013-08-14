/**
 * @file 左右滑动手势插件
 * @import widget/tabs/tabs.js
 */

(function ($, undefined) {
    var durationThreshold = 1000, // 时间大于1s就不算。
        horizontalDistanceThreshold = 30, // x方向必须大于30
        verticalDistanceThreshold = 70, // y方向上只要大于70就不算
        scrollSupressionThreshold = 30, //如果x方向移动大于这个直就禁掉滚动
        tabs = [],
        eventBinded = false,
        isFromTabs = function (target) {
            for (var i = tabs.length; i--;) {
                if ($.contains(tabs[i], target)) return true;
            }
            return false;
        }

    function tabsSwipeEvents() {
        $(document).on('touchstart.tabs', function (e) {
            var point = e.touches ? e.touches[0] : e, start, stop;

            start = {
                x:point.clientX,
                y:point.clientY,
                time:Date.now(),
                el:$(e.target)
            }

            $(document).on('touchmove.tabs',function (e) {
                var point = e.touches ? e.touches[0] : e, xDelta;
                if (!start)return;
                stop = {
                    x:point.clientX,
                    y:point.clientY,
                    time:Date.now()
                }
                if ((xDelta = Math.abs(start.x - stop.x)) > scrollSupressionThreshold ||
                    xDelta > Math.abs(start.y - stop.y)) {
                    isFromTabs(e.target) && e.preventDefault();
                } else {//如果系统滚动开始了，就不触发swipe事件
                    $(document).off('touchmove.tabs touchend.tabs');
                }
            }).one('touchend.tabs', function () {
                    $(document).off('touchmove.tabs');
                    if (start && stop) {
                        if (stop.time - start.time < durationThreshold &&
                            Math.abs(start.x - stop.x) > horizontalDistanceThreshold &&
                            Math.abs(start.y - stop.y) < verticalDistanceThreshold) {
                            start.el.trigger(start.x > stop.x ? "tabsSwipeLeft" : "tabsSwipeRight");
                        }
                    }
                    start = stop = undefined;
                });
        });
    }
    
    /**
     * 添加 swipe功能，zepto的swipeLeft, swipeRight不太准，所以在这另外实现了一套。
     * @class swipe
     * @namespace Tabs
     * @pluginfor Tabs
     */
    gmu.Tabs.register( 'swipe', {
        _init:function () {
            var _opts = this._options;

            this.on( 'ready', function(){
                tabs.push(_opts._content.get(0));
                eventBinded =  eventBinded || (tabsSwipeEvents(), true);
                this.$el.on('tabsSwipeLeft tabsSwipeRight', $.proxy(this._eventHandler, this));
            } );
        },
        _eventHandler:function (e) {
            var _opts = this._options, items, index;
            switch (e.type) {
                case 'tabsSwipeLeft':
                case 'tabsSwipeRight':
                    items = _opts.items;
                    if (e.type == 'tabsSwipeLeft' && _opts.active < items.length - 1) {
                        index = _opts.active + 1;
                    } else if (e.type == 'tabsSwipeRight' && _opts.active > 0) {
                        index = _opts.active - 1;
                    }
                    index !== undefined && (e.stopPropagation(), this.switchTo(index));
                    break;
                default://tap
                    return this.origin(e);
            }
        },
        destroy: function(){
            var _opts = this._options, idx;
            ~(idx = $.inArray(_opts._content.get(0), tabs)) && tabs.splice(idx, 1);
            this.$el.off('tabsSwipeLeft tabsSwipeRight', this._eventHandler);
            tabs.length || ($(document).off('touchstart.tabs'), eventBinded = false);
            return this.origin();
        }
    } );
})(Zepto);