/**
 * @file 导航栏组件 － snap滚动插件
 * @name Navigator.snap
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/webapp/naivgator/navigator_snap.html</qrcode>
 * navigator snap插件，点击跳动tab
 * @import core/zepto.iscroll.js, widget/navigator.js
 */

(function ($, win) {
    /**
     * @name navigator
     * @grammar navigator(options)  ⇒ self
     * @grammar $.ui.navigator([el [,options]])  ⇒ instance
     * @desc
     * **Options**
     * navigator snap插件在原来options基础上增加以下参数
     * - ''viewportCount''   {Number|Object}:           (必选, 默认true)可视区显示的tab个数，若为Number类型，即默认为竖屏显示个数，则横屏按照viewportCount+viewportCount/2的原则显示，若为object类型，需分别指定横竖屏显示个数
     * - ''iScrollOpts''      {Object}:            (可选)配置iScroll中的参数，其中scrollstart,scrollmove,scrollend做为单独事件在组件中派生，可直接绑相应事件
     * - ''scrollstart''      {Function}:          (可选)滑动前触发的事件，对应iScroll中的onScrollStart
     * - ''scrollmove''       {Function}:          (可选)滑动中触发的事件，对应iScroll中的onScrollMove
     * - ''scrollend''        {Function}:          (可选)滑动后触发的事件，对应iScroll中的onScrollEnd
     *
     * **setup方式html规则**
     * <code type="html">
     * <div id="nav-smartSetup">
     *     <ul>                                              <!--中间非固定tab-->
     *         <li><a href="#test1">首页</a></li>
     *         <li><a href="javascript:;">电影</a></li>
     *         <li><a class="cur" href="javascript:;">电视剧</a></li>
     *     </ul>
     *     <a class="ui-navigator-fixleft" href="#test1">fixleft</a>    <!--当作指示箭头-->
     * </div>
     * </code>
     * <code type="javascript">
     * <script>
     *     $('#nav-smartSetup').navigator({
     *         viewportCount: 4
     *     });
     * </script>
     * </code>
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/navigator/navigator_snap.html">
     * ../gmu/_examples/widget/navigator/navigator_snap.html
     * </codepreview>
     */
    $.ui.navigator.register(function () {
        return {
            pluginName: 'snap',
            _init: function () {
                return this._adjustHtml()._rebindEvent()._initOrg();
            },
            _rebindEvent: function () {
                var me = this,
                    data = me._data;

                me._loadIscroll();    //初始化iscroll
                $(win).on('ortchange', $.proxy(me._ortChangeHandler, me));
                me.on('destroy', function () {
                    $(win).off('ortchange', me._ortChangeHandler);
                    data.iScroll.destroy();
                });
                return me;
            },
            _adjustHtml: function () {
                var me = this,
                    data = me._data,
                    $el = me.root().addClass('ui-navigator'),
                    $navWrapper = $el.find('.ui-navigator-wrapper'),
                    $navScroller = $el.find('.ui-navigator-scroller'),
                    orient = win.innerWidth > win.innerHeight ? 'landscape' : 'portrait',
                    viewCount = data.viewportCount;

                //处理横竖屏显示tab个数，当viewportCount为Number时，则默认为竖屏显示个数，横屏为viewportCount + Math.floor(viewportCount/2)个
                // 若viewportCount为object，则根据其值来确定
                data._vpCount = {};
                $.isPlainObject(viewCount) ? (data._vpCount = viewCount) : (data._vpCount[orient] = viewCount + (orient === 'landscape' ? Math.floor(viewCount / 2) : 0));

                //todo 重构时可以使用tmpl去优化dom的创建及修改
                !$navScroller.length && $el.find('ul').wrap($navScroller = $('<div class="ui-navigator-scroller"></div>'));
                !$navWrapper.length && $navScroller.wrap($navWrapper = $('<div class="ui-navigator-wrapper"></div>'));
                $navScroller.append(data._$curbar = $('<div class="ui-navigator-curbar"></div>'));
                me.data({
                    _lastOrient: orient,
                    _$navWrapper: $navWrapper,
                    _$navScroller: $navScroller,
                    _navNum: $navScroller.find('li').length
                });
                //tab平分处理及curbar宽度处理
                me._refresh(data._vpCount[orient], data.defTab);

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
                    orient = (data._lastOrient = data._lastOrient === 'portrait' ? 'landscape' : 'portrait'),   //记录上次orient，与上一次方向相反
                    iScroll = data.iScroll;

                !data._vpCount[orient] && (data._vpCount[orient] = data.viewportCount + (orient === 'landscape' ? Math.floor(data.viewportCount / 2) : 0));
                data._$navWrapper.width(iScroll.wrapperW - iScroll.wrapperOffsetLeft);    //wrapper存在padding值时，需特殊处理
                me._refresh(data._vpCount[orient], data._lastIndex);   //转屏时更新tab宽度及curbar宽度
            },

            update: function() {
                var me = this,
                    data = me._data,
                    orient = data._lastOrient || (win.innerWidth > win.innerHeight ? 'landscape' : 'portrait'),
                    iScroll = data.iScroll;

                !data._vpCount[orient] && (data._vpCount[orient] = data.viewportCount + (orient === 'landscape' ? Math.floor(data.viewportCount / 2) : 0));
                data._$navWrapper.width(iScroll.wrapperW - iScroll.wrapperOffsetLeft);    //wrapper存在padding值时，需特殊处理
                me._refresh(data._vpCount[orient], data._lastIndex);   //转屏时更新tab宽度及curbar宽度
                iScroll.refresh();
            },
            /**
             * 由于将fix元素当成箭头元素使用，与原来派生事件逻辑不一样，故覆盖原来的方法
             * */
            _switchTabHandler: function (e) {
                var me = this,
                    data = me._data,
                    target = e.target,
                    snapEvent = $.Event('snaptonav');

                if ($(target).closest('li').get(0)) {
                    me.switchTo(target.index, false, e);
                    data._$curbar.css('-webkit-transform', 'translate3d(' + target.index * data._itemWidth + 'px, 0, 0)');
                } else {
                    if (snapEvent.preventDefault()) {
                        return me;
                    }
                    me.trigger(snapEvent);
                }
            },
            /**
             * 更新scroller宽度及curbar宽度
             * */
            _refresh: function (vpcount, index) {
                var me = this,
                    data = me._data;

                data._$navScroller.width((data._itemWidth = data._$navWrapper.width() / vpcount) * data._navNum);
                data._$curbar.css({
                    'width': data._itemWidth,
                    '-webkit-transform': 'translate3d(' + index * data._itemWidth + 'px, 0, 0)'
                });
                return me;
            },
            /**
             * @name scrollToNav
             * @grammar scrollToNav(num, isPage, time)  ⇒ self
             * @desc 滚动到某个tab, isPage参数若为boolean类型，则表示滚动number屏
             * @example
             * $('#nav').navigator('switchTo', 1);      //setup模式
             * var nav = $.ui.navigator(opts);      //render模式
             * nav.switchTo(1);
             */
            scrollToNav: function (num, isPage, time) {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll,
                    num = num || 1,
                    M = Math;

                typeof isPage === 'boolean' && isPage ?
                    iScroll.scrollToPage(M.min(data._navNum / data._vpCount.portrait, M.max(0, num)), 0, time ) :
                    (iScroll.x > iScroll.maxScrollX && iScroll.scrollTo(iScroll.x + (-M.min(data._navNum, M.max(0, num)) * data._itemWidth), 0, time || 400));
                return me;
            }
        }
    });
})(Zepto, window);
