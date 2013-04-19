/**
 * @file Tabs - ajax插件
 * @name Tabs - ajax插件
 * @short Tabs.ajax
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/tabs/tabs_ajax.html</qrcode>
 * tabs插件, 有了此插件,tabs支持ajax功能
 *
 * 在a上面href设置的是地址，而不是id，则组件认为这个为ajax类型的。
 * 在options上传入ajax对象可以配置[ajax选项](#$.ajax)。如
 * <code>
 * $('#tabs').tabs({ajax: {
 *     dataType: 'json'
 *     //....
 * }});
 * </code>
 *
 * **Demo**
 * <codepreview href="../gmu/_examples/widget/tabs/tabs_ajax.html">
 * ../gmu/_examples/widget/tabs/tabs_ajax.html
 * ../gmu/_examples/widget/tabs/tabs_json.html
 * </codepreview>
 *
 * @import widget/tabs.js
 */
(function ($, undefined) {
    var idRE = /^#.+$/,
        loaded = {},
        tpl = {
            loading: '<div class="ui-loading">Loading</div>',
            error: '<p class="ui-load-error">内容加载失败!</p>'
        };

    $.ui.tabs.register(function () {
        return {
            _init:function () {
                var data = this._data, items = data.items, i, length;
                this._initOrg();
                for (i = 0, length = items.length; i < length; i++) {
                    items[i].href && !idRE.test(items[i].href) && (items[i].isAjax = true);
                }
                this.on('activate', this._onActivate);
                items[data.active].isAjax && this.load(data.active);//如果当前是ajax
            },

            destroy:function () {
                this.off('activate', this._onActivate);
                this.xhr && this.xhr.abort();
                return this.destroyOrg();
            },

            _fitToContent: function(div) {
                var data = this._data;
                if(!data._fitLock)return this._fitToContentOrg(div);
            },

            _onActivate:function (e, to) {
                to.isAjax && this.load(to.index);
            },


            /**
             * @name load
             * @grammar load(index[, force])  ⇒ instance
             * @desc 加载内容，指定的tab必须是ajax类型。加载的内容会缓存起来，如果要强行再次加载，第二个参数传入true
             */
            load:function (index, force) {
                var me = this, data = me._data, items = data.items, item, $panel, prevXHR;
                if (index < 0 ||
                    index > items.length - 1 ||
                    !(item = items[index]) || //如果范围错误
                    !item.isAjax || //如果不是ajax类型的
                    ( ( $panel = me._getPanel(index)).text() && !force && loaded[index] ) //如果没有加载过，并且tab内容为空
                    )return this;

                (prevXHR = me.xhr) && $.later(function(){//把切出去没有加载玩的xhr abort了
                    prevXHR.abort();
                }, 400);

                data._loadingTimer = $.later(function () {//如果加载在50ms内完成了，就没必要再去显示 loading了
                    $panel.html(tpl.loading);
                }, 50);

                data._fitLock = true;

                me.xhr = $.ajax($.extend(data.ajax || {}, {
                    url:item.href,
                    context:me._el.get(0),
                    beforeSend:function (xhr, settings) {
                        var eventData = $.Event('beforeLoad');
                        me.trigger(eventData, [xhr, settings]);
                        if (eventData.defaultPrevented)return false;
                    },
                    success:function (response, xhr) {
                        var eventData = $.Event('beforeRender');
                        clearTimeout(data._loadingTimer);//清除显示loading的计时器
                        me.trigger(eventData, [response, $panel, index, xhr])//外部可以修改data，或者直接把pannel修改了
                        if (!eventData.defaultPrevented) {
                            $panel.html(response);
                        }
                        data._fitLock = false;
                        loaded[index] = true;
                        me.trigger('load', $panel);
                        delete me.xhr;
                        me._fitToContent($panel);
                    },
                    error:function () {
                        var eventData = $.Event('loadError');
                        clearTimeout(data._loadingTimer);//清除显示loading的计时器
                        loaded[index] = false;
                        me.trigger(eventData, $panel);
                        if(!eventData.defaultPrevented){
                            $panel.html(tpl.error);
                        }
                        delete me.xhr;
                    }
                }));
            }
            /**
             * @name Trigger Events
             * @theme event
             * @desc 组件内部触发的事件
             *
             * ^ 名称 ^ 处理函数参数 ^ 描述 ^
             * | beforeLoad | event, xhr, settings | 在请求前触发，可以通过e.preventDefault()来取消此次ajax请求。 |
             * | beforeRender | event, response, panel, index, xhr | ajax请求进来数据，在render到div上之前触发，对于json数据，可以通过此方来自行写render，然后通过e.preventDefault()来阻止，将response输出在div上。 |
             * | load | event, panel | 当ajax请求到的内容过来后，平已经Render到div上了后触发 |
             * | loadError | event, panel | 当ajax请求内容失败时触发，如果此事件被preventDefault了，则不会把自带的错误信息Render到div上 |
             */
        }
    });
})(Zepto);
