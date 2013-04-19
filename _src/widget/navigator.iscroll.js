/**
 * @file 导航栏组件 － iScroll插件
 * @name Navigator.iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/webapp/naivgator/navigator.html</qrcode>
 * navigator iscroll插件，可滚动导航栏
 * @import core/zepto.iscroll.js, widget/navigator.js
 */

(function ($, undefined) {
    /**
     * @name navigator
     * @grammar navigator(options)  ⇒ self
     * @grammar $.ui.navigator([el [,options]])  ⇒ instance
     * @desc
     * **Options**
     * navigator iscroll插件在原来options基础上增加以下参数
     * - ''disablePlugin''    {Boolean|String}:    (可选, 默认false)是否禁用插件，加载了该插件，若需要禁用，可直接设为true
     * - ''isScrollToNext''   {Boolean}:           (必选, 默认true)是否启用点击可视范围内第一个或最后一个跳动
     * - ''isShowShadow''     {Boolean}:           (可选, 默认true)是否启用阴影
     * - ''iScrollOpts''      {Object}:            (可选)配置iScroll中的参数，其中scrollstart,scrollmove,scrollend做为单独事件在组件中派生，可直接绑相应事件
     * - ''scrollstart''      {Function}:          (可选)滑动前触发的事件，对应iScroll中的onScrollStart
     * - ''scrollmove''       {Function}:          (可选)滑动中触发的事件，对应iScroll中的onScrollMove
     * - ''scrollend''        {Function}:          (可选)滑动后触发的事件，对应iScroll中的onScrollEnd
     *
     * **setup方式html规则**
     * <code type="html">
     * <div id="nav-smartSetup">
     *     <a class="ui-navigator-fixleft" href="#test1">fixleft</a>       <!--固定元素，若没有，则不写，可写多个，左边加class="ui-navigator-fixleft"-->
     *     <ul>                                              <!--中间非固定tab-->
     *         <li><a href="#test1">首页</a></li>
     *         <li><a href="javascript:;">电影</a></li>
     *         <li><a class="cur" href="javascript:;">电视剧</a></li>
     *     </ul>
     *     <a class="ui-navigator-fixleft" href="#test1">fixleft</a>    <!--固定元素，若没有，则不写，可写多个，右边加class="ui-navigator-fixright"-->
     * </div>
     * </code>
     * **full setup方式html规则**
     * <code type="html">        <!--需将所有的class都写全-->
     * <div id="nav-smartSetup">
     *     <a class="ui-navigator-fixleft ui-navigator-fix" href="#test1">fixleft</a>       <!--固定元素，若没有，则不写，可写多个，左边加class="ui-navigator-fixleft"-->
     *     <div class="ui-navigator-wrapper" style="overflow:hidden;">
     *         <ul class="ui-navigator-list">                                             <!--中间非固定tab-->
     *             <li><a href="#test1">首页</a></li>
     *             <li><a href="javascript:;">电影</a></li>
     *             <li><a class="cur" href="javascript:;">电视剧</a></li>
     *         </ul>
     *     </div>
     *     <a class="ui-navigator-fixleft ui-navigator-fix" href="#test1">fixleft</a>    <!--固定元素，若没有，则不写，可写多个，右边加class="ui-navigator-fixright"-->
     * </div>
     * </code>
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/navigator/navigator.html">
     * ../gmu/_examples/widget/navigator/navigator.html
     * ../gmu/_examples/widget/navigator/navigator_fix.html
     * </codepreview>
     */

    $.ui.navigator.register(function () {
        return {
            pluginName: 'iscroll',
            _init: function () {
                return this._adjustHtml()._reBindEvent()._initOrg();
            },
            _reBindEvent: function () {
                var me = this,
                    data = me._data;

                data.isScrollToNext = data.isScrollToNext === undefined ? true : data.isScrollToNext ;
                data.isShowShadow = data.isShowShadow === undefined ? true : data.isShowShadow;
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
                    scrollerSumWidth = [0];

                !$navWrapper.length && $navScroller.wrap('<div class="ui-navigator-wrapper"></div>');    //smart模式
                $navScroller.find('li').each(function (index) {     //记录每个tab长度的累加和，为半个tab滑动用
                    scrollerSumWidth[index] = index ? (scrollerSumWidth[index -1] + this.offsetWidth) :
                        (scrollerSumWidth[index] + this.offsetLeft - $navScroller[0].offsetLeft + this.offsetWidth);
                });
                $.extend(data, {
                    _$navWrapper: $el.find('.ui-navigator-wrapper'),
                    _$navScroller: $navScroller.width(scrollerSumWidth[$navList.length - 1]),
                    _$navList: $navList,
                    _scrollerNum: $navList.length,
                    _scrollerSumWidth: scrollerSumWidth,
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
                    vScroll:false,
                    hScrollbar:false,
                    vScrollbar:false
                }, data.iScrollOpts, {
                    onScrollStart:function (e) {
                        me.trigger('scrollstart', e);
                    },
                    onScrollMove:function (e) {
                        me.trigger('scrollmove', e);
                    },
                    onScrollEnd:function (e) {
                        data.isShowShadow && me._setShadow();
                        me.trigger('scrollend', e);
                    }
                }));
                return me;
            },
            _setShadow:function () {
                var me = this,
                    data = me._data,
                    $navWrapper = data._$navWrapper,
                    shadowClass = {
                        left: 'ui-navigator-shadowl',
                        right: 'ui-navigator-shadowr',
                        all: 'ui-navigator-shadowall'
                    },
                    iScroll = data.iScroll,
                    movedX = iScroll.x;

                if (movedX < 0) {
                    $navWrapper.removeClass(shadowClass['left'] + ' ' + shadowClass['right']).addClass(shadowClass['all']);     //开始滑动时
                    if (movedX <= iScroll.maxScrollX) {       //向右滑动到最大
                        $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['right']).addClass(shadowClass['left']);
                    }
                } else {      //向左滑动到最大
                    $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['left']);
                    //转屏后是否可滑动
                    iScroll.hScroll ? $navWrapper.addClass(shadowClass['right']) : $navWrapper.removeClass(shadowClass['all'] + ' ' + shadowClass['left'] + ' ' +shadowClass['right']);
                }

                return me;
            },
            _scrollToNext: function (index, pos) {
                var me = this,
                    data = me._data,
                    scrollerSumWidth = data._scrollerSumWidth,
                    iScroll = data.iScroll;      //iscroll滚动的时间

                iScroll.scrollTo(pos == 'last' ? iScroll.wrapperW - (scrollerSumWidth[index + 1] || scrollerSumWidth[scrollerSumWidth.length - 1]) : pos == 'first' ? (-scrollerSumWidth[index - 2] || 0) : iScroll.x, 0, 400);
                return me;
            },
            _getPos:function (index) {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll,
                    movedXDis = Math.abs(iScroll.x) || 0,
                    scrollerSumWidth = data._scrollerSumWidth,
                    $navList = data._$navList,
                    thisOffsetDis = scrollerSumWidth[index] - movedXDis,
                    preOffsetDis = scrollerSumWidth[(index - 1) || 0]  - movedXDis,
                    nextOffsetDis = (scrollerSumWidth[index + 1] || scrollerSumWidth[scrollerSumWidth.length - 1]) - movedXDis,
                    wrapperWidth = iScroll.wrapperW;

                return (thisOffsetDis >= wrapperWidth || nextOffsetDis > wrapperWidth) ?   //当前tab为半个tab或者其下一个tab为半个，则视为可显示区的最后一个
                    'last' : (thisOffsetDis <= $navList[index].offsetWidth || preOffsetDis < $navList[index - 1].offsetWidth) ?  //当前tab为半个或者其前面的tab是半个，则视为可显示区的第一个
                    'first' : 'middle';
            },
            _ortChangeHandler:function () {
                var me = this,
                    data = me._data,
                    iScroll = data.iScroll;

                iScroll.refresh();
                me._setShadow();    //增加阴影的转屏处理 traceid:FEBASE-663
                data._$navWrapper.width(iScroll.wrapperW - iScroll.wrapperOffsetLeft);
            },
            switchTo: function (index, isDef, e) {
                var me = this,
                    data = me._data;

                me.switchToOrg(index, isDef, e);
                if (!data._$tabList.eq(index).hasClass('ui-navigator-fix')) {
                    var $fixElemLeft = data._$fixElemLeft,
                        index = index - ($fixElemLeft.length ? $fixElemLeft.length : 0),    //若存在左fix的元素，则滑动的tab的index需相应减去fix tab数量
                        pos = me._getPos(index);

                    isDef && data.isShowShadow && me._setShadow();      //默认defTab设置阴影
                    data.isScrollToNext && me._scrollToNext(index, pos);
                }
                return me;
            }
        }
    });
})(Zepto);
