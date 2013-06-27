/**
 * @file 加载更多组件
 * @name Refresh
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/refresh/refresh.html</qrcode>
 * 加载更多组件
 * @import core/widget.js
 * @importCSS loading.css
 */

(function( gmu, $, undefined ) {
    /**
     * @name gmu.Refresh
     * @grammar gmu.Refresh(options) => self
     * @grammar $(el).refresh(options) => self
     * @desc **Options**
     * - ''load'' {Function}: (必选) 当点击按钮，或者滑动达到可加载内容条件时，此方法会被调用。需要在此方法里面进行ajax内容请求，并在请求完后，调用afterDataLoading()，通知refresh组件，改变状态。
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
     * <codepreview href="../examples/widget/refresh/refresh.html">
     * ../gmu/examples/widget/refresh/refresh.html
     * </codepreview>
     */
    gmu.define( 'Refresh', {
        options: {
            load: null,
            statechange: null
        },

        _init: function() {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                $.each(['up', 'down'], function (i, dir) {
                    var $elem = opts['$' + dir + 'Elem'],
                        elem = $elem.get(0);

                    if ($elem.length) {
                        me._status(dir, true);    //初始设置加载状态为可用
                        if (!elem.childNodes.length || ($elem.find('.ui-refresh-icon').length && $elem.find('.ui-refresh-label').length)) {    //若内容为空则创建，若不满足icon和label的要求，则不做处理
                            !elem.childNodes.length && me._createBtn(dir);
                            opts.refreshInfo || (opts.refreshInfo = {});
                            opts.refreshInfo[dir] = {
                                $icon: $elem.find('.ui-refresh-icon'),
                                $label: $elem.find('.ui-refresh-label'),
                                text: $elem.find('.ui-refresh-label').html()
                            }
                        }
                        $elem.on('click', function () {
                            if (!me._status(dir) || opts._actDir) return;         //检查是否处于可用状态，同一方向上的仍在加载中，或者不同方向的还未加载完成 traceID:FEBASE-569
                            me._setStyle(dir, 'loading');
                            me._loadingAction(dir, 'click');
                        });
                    }
                });
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function(){
            var me = this,
                opts = me._options,
                $el = me.$el;

            if( me._options.setup ) {

                opts.$upElem = $el.find('.ui-refresh-up');
                opts.$downElem = $el.find('.ui-refresh-down');
                $el.addClass('ui-refresh');
            }
        },

        _createBtn: function (dir) {
            this._options['$' + dir + 'Elem'].html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">加载更多</span>');

            return this;
        },

        _setStyle: function (dir, state) {
            var me = this,
                stateChange = $.Event('statechange');

            me.trigger(stateChange, [me._options['$' + dir + 'Elem'], state, dir]);
            if ( stateChange.defaultPrevented ) {
                return me;
            }

            return me._changeStyle(dir, state);
        },

        _changeStyle: function (dir, state) {
            var opts = this._options,
                refreshInfo = opts.refreshInfo[dir];

            switch (state) {
                case 'loaded':
                    refreshInfo['$label'].html(refreshInfo['text']);
                    refreshInfo['$icon'].removeClass();
                    opts._actDir = '';
                    break;
                case 'loading':
                    refreshInfo['$label'].html('加载中...');
                    refreshInfo['$icon'].addClass('ui-loading');
                    opts._actDir = dir;
                    break;
                case 'disable':
                    refreshInfo['$label'].html('没有更多内容了');
                    break;
            }

            return this;
        },

        _loadingAction: function (dir, type) {
            var me = this,
                opts = me._options,
                loadFn = opts.load;

            $.isFunction(loadFn) && loadFn.call(me, dir, type);
            me._status(dir, false);

            return me;
        },

        /**
         * @name afterDataLoading
         * @grammar afterDataLoading(dir)  ⇒ instance
         * @desc - ''dir'' \'up\' 或者 \'down\'
         *
         * 当组件调用load，在load中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
         */
        afterDataLoading: function (dir) {
            var me = this,
                dir = dir || me._options._actDir;

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
         * 当组件调用load，在load中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
         */
        _status: function(dir, status) {
            var opts = this._options;

            return status === undefined ? opts['_' + dir + 'Open'] : opts['_' + dir + 'Open'] = !!status;
        },

        _setable: function (able, dir, hide) {
            var me = this,
                opts = me._options,
                dirArr = dir ? [dir] : ['up', 'down'];

            $.each(dirArr, function (i, dir) {
                var $elem = opts['$' + dir + 'Elem'];
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
         * <codepreview href="../examples/widget/refresh/refresh_iscroll_custom.html">
         * ../gmu/examples/widget/refresh/refresh_iscroll_custom.html
         * </codepreview>
         */

    } );
})( gmu, gmu.$ );
