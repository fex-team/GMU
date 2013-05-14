/**
 * @file 加载更多组件
 * @name Refresh
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/refresh/refresh.html</qrcode>
 * 加载更多组件
 * @import core/zepto.ui.js
 * @importCSS loading.css
 */

(function($, undefined) {
    /**
     * @name $.ui.refresh
     * @grammar $.ui.refresh(options) ⇒ self
     * @grammar refresh(options) ⇒ self
     * @desc **Options**
     * - ''ready'' {Function}: (必选) 当点击按钮，或者滑动达到可加载内容条件时，此方法会被调用。需要在此方法里面进行ajax内容请求，并在请求完后，调用afterDataLoading()，通知refresh组件，改变状态。
     * - ''statechange'' {Function}: (可选) 样式改变时触发，该事件可以被阻止，阻止后可以自定义加载样式，回调参数：event(事件对象), elem(refresh按钮元素), state(状态), dir(方向)
     * - ''events'' 所有[Trigger Events](#refresh_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **setup方式html规则**
     * <code type="html">
     * <div>
     *     <!--如果需要在头部放更多按钮-->
     *     <div class="ui-refresh-up"></div>
     *     ......
     *     <!--如果需要在底部放更多按钮-->
     *     <div class="ui-refresh-down"></div>
     * </div>
     * </code>
     * @notice 此组件不支持render模式，只支持setup模式
     * @desc **Demo**
     * <codepreview href="../gmu/_examples/widget/refresh/refresh.html">
     * ../gmu/_examples/widget/refresh/refresh.html
     * </codepreview>
     */
    $.ui.define('refresh', {
        _data: {
            ready: null,
            statechange: null
        },

        _setup: function () {
            var me = this,
                data = me._data,
                $el = me.root();

            data.$upElem = $el.find('.ui-refresh-up');
            data.$downElem = $el.find('.ui-refresh-down');
            $el.addClass('ui-refresh');
            return me;
        },

        _init: function() {
            var me = this,
                data = me._data;
            $.each(['up', 'down'], function (i, dir) {
                var $elem = data['$' + dir + 'Elem'],
                    elem = $elem.get(0);
                if ($elem.length) {
                    me._status(dir, true);    //初始设置加载状态为可用
                    if (!elem.childNodes.length || ($elem.find('.ui-refresh-icon').length && $elem.find('.ui-refresh-label').length)) {    //若内容为空则创建，若不满足icon和label的要求，则不做处理
                        !elem.childNodes.length && me._createBtn(dir);
                        data.refreshInfo || (data.refreshInfo = {});
                        data.refreshInfo[dir] = {
                            $icon: $elem.find('.ui-refresh-icon'),
                            $label: $elem.find('.ui-refresh-label'),
                            text: $elem.find('.ui-refresh-label').html()
                        }
                    }
                    $elem.on('click', function () {
                        if (!me._status(dir) || data._actDir) return;         //检查是否处于可用状态，同一方向上的仍在加载中，或者不同方向的还未加载完成 traceID:FEBASE-569
                        me._setStyle(dir, 'loading');
                        me._loadingAction(dir, 'click');
                    });
                }
            });
            return me;
        },

        _createBtn: function (dir) {
            this._data['$' + dir + 'Elem'].html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">加载更多</span>');
            return this;
        },

        _setStyle: function (dir, state) {
            var me = this,
                stateChange = $.Event('statechange');

            me.trigger(stateChange, [me._data['$' + dir + 'Elem'], state, dir]);
            if (stateChange.defaultPrevented) return me;

            return me._changeStyle(dir, state);
        },

        _changeStyle: function (dir, state) {
            var data = this._data,
                refreshInfo = data.refreshInfo[dir];

            switch (state) {
                case 'loaded':
                    refreshInfo['$label'].html(refreshInfo['text']);
                    refreshInfo['$icon'].removeClass();
                    data._actDir = '';
                    break;
                case 'loading':
                    refreshInfo['$label'].html('加载中...');
                    refreshInfo['$icon'].addClass('ui-loading');
                    data._actDir = dir;
                    break;
                case 'disable':
                    refreshInfo['$label'].html('没有更多内容了');
                    break;
            }
            return this;
        },

        _loadingAction: function (dir, type) {
            var me = this,
                data = me._data,
                readyFn = data.ready;

            $.isFunction(readyFn) && readyFn.call(me, dir, type);
            me._status(dir, false);
            return me;
        },

        /**
         * @name afterDataLoading
         * @grammar afterDataLoading(dir)  ⇒ instance
         * @desc - ''dir'' \'up\' 或者 \'down\'
         *
         * 当组件调用ready，在ready中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
         */
        afterDataLoading: function (dir) {
            var me = this,
                dir = dir || me._data._actDir;
            me._setStyle(dir, 'loaded');
            me._status(dir, true);
            return me;
        },

        /**
         * @name status
         * @grammar status(dir， status)  ⇒ instance
         * @desc 用来设置加载是否可用，分方向的。
         * - ''dir'' \'up\' 或者 \'down\'
         * - ''status'' ''true'' 或者 ''false''。
         *
         * 当组件调用reday，在ready中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
         */
        _status: function(dir, status) {
            var data = this._data;
            return status === undefined ? data['_' + dir + 'Open'] : data['_' + dir + 'Open'] = !!status;
        },

        _setable: function (able, dir, hide) {
            var me = this,
                data = me._data,
                dirArr = dir ? [dir] : ['up', 'down'];
            $.each(dirArr, function (i, dir) {
                var $elem = data['$' + dir + 'Elem'];
                if (!$elem.length) return;
                //若是enable操作，直接显示，disable则根据text是否是true来确定是否隐藏
                able ? $elem.show() : (hide ?  $elem.hide() : me._setStyle(dir, 'disable'));
                me._status(dir, able);
            });
            return me;
        },

        /**
         * @name disable
         * @grammar disable(dir)  ⇒ instance
         * @desc 如果已无类容可加载时，可以调用此方法来，禁用Refresh。
         * - ''dir'' \'up\' 或者 \'down\'
         * - ''hide'' {Boolean} 是否隐藏按钮。如果此属性为false，将只有文字变化。
         */
        disable: function (dir, hide) {
            return this._setable(false, dir, hide);
        },

        /**
         * @name enable
         * @grammar enable(dir)  ⇒ instance
         * @desc 用来启用组件。
         * - ''dir'' \'up\' 或者 \'down\'
         */
        enable: function (dir) {
            return this._setable(true, dir);
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | statechange | event, elem, state, dir | 组件发生状态变化时会触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         *
         * **组件状态说明**
         * - ''loaded'' 默认状态
         * - ''loading'' 加载中状态。
         * - ''disabled'' 禁用状态，表示无内容加载了！
         * - ''beforeload'' 在手没有松开前满足加载的条件状态。 需要引入插件才有此状态，lite，iscroll，或者iOS5。
         *
         * statechnage事件可以用来DIY按钮样式，包括各种状态。组件内部通过了一套，如果statechange事件被阻止了，组件内部的将不会执行。
         * 如:
         * <codepreview href="../gmu/_examples/widget/refresh/refresh_iscroll_custom.html">
         * ../gmu/_examples/widget/refresh/refresh_iscroll_custom.html
         * </codepreview>
         */

    });
})(Zepto);