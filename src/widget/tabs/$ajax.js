/**
 * @file ajax插件
 * @import widget/tabs/tabs.js
 */
(function ($, undefined) {
    var idRE = /^#.+$/,
        loaded = {},
        tpl = {
            loading: '<div class="ui-loading">Loading</div>',
            error: '<p class="ui-load-error">内容加载失败!</p>'
        };

    /**
     * 在a上面href设置的是地址，而不是id，则组件认为这个为ajax类型的。在options上传入ajax对象可以配置[ajax选项](#$.ajax)
     * @class ajax
     * @namespace Tabs
     * @pluginfor Tabs
     */
    gmu.Tabs.register( 'ajax', {
        _init:function () {
            var _opts = this._options, items, i, length;

            this.on( 'ready', function(){
                items = _opts.items;
                for (i = 0, length = items.length; i < length; i++) {
                    items[i].href && !idRE.test(items[i].href) && (items[i].isAjax = true);
                }
                this.on('activate', this._onActivate);
                items[_opts.active].isAjax && this.load(_opts.active);//如果当前是ajax
            } );
        },

        destroy:function () {
            this.off('activate', this._onActivate);
            this.xhr && this.xhr.abort();
            return this.origin();
        },

        _fitToContent: function(div) {
            var _opts = this._options;

            if(!_opts._fitLock)return this.origin(div);
        },

        _onActivate:function (e, to) {
            to.isAjax && this.load(to.index);
        },

        /**
         * 加载内容，指定的tab必须是ajax类型。加载的内容会缓存起来，如果要强行再次加载，第二个参数传入true
         * @method load
         * @param {Number} index Tab编号
         * @param {Boolean} [force=false] 是否强制重新加载
         * @for Tabs
         * @uses Tabs.ajax
         * @return {self} 返回本身。
         */
        load:function (index, force) {
            var me = this, _opts = me._options, items = _opts.items, item, $panel, prevXHR;

            if (index < 0 ||
                index > items.length - 1 ||
                !(item = items[index]) || //如果范围错误
                !item.isAjax || //如果不是ajax类型的
                ( ( $panel = me._getPanel(index)).text() && !force && loaded[index] ) //如果没有加载过，并且tab内容为空
                )return this;

            (prevXHR = me.xhr) && setTimeout(function(){//把切出去没有加载玩的xhr abort了
                prevXHR.abort();
            }, 400);

            _opts._loadingTimer = setTimeout(function () {//如果加载在50ms内完成了，就没必要再去显示 loading了
                $panel.html(tpl.loading);
            }, 50);

            _opts._fitLock = true;

            me.xhr = $.ajax($.extend(_opts.ajax || {}, {
                url:item.href,
                context:me.$el.get(0),
                beforeSend:function (xhr, settings) {
                    var eventData = gmu.Event('beforeLoad');
                    me.trigger(eventData, xhr, settings);
                    if (eventData.isDefaultPrevented())return false;
                },
                success:function (response, xhr) {
                    var eventData = gmu.Event('beforeRender');
                    clearTimeout(_opts._loadingTimer);//清除显示loading的计时器
                    me.trigger(eventData, response, $panel, index, xhr)//外部可以修改data，或者直接把pannel修改了
                    if (!eventData.isDefaultPrevented()) {
                        $panel.html(response);
                    }
                    _opts._fitLock = false;
                    loaded[index] = true;
                    me.trigger('load', $panel);
                    delete me.xhr;
                    me._fitToContent($panel);
                },
                error:function () {
                    var eventData = gmu.Event('loadError');
                    clearTimeout(_opts._loadingTimer);//清除显示loading的计时器
                    loaded[index] = false;
                    me.trigger(eventData, $panel);
                    if(!eventData.isDefaultPrevented()){
                        $panel.html(tpl.error);
                    }
                    delete me.xhr;
                }
            }));
        }
        
        /**
         * @event beforeLoad
         * @param {Event} e gmu.Event对象
         * @param {Object} xhr xhr对象
         * @param {Object} settings ajax请求的参数
         * @description 在请求前触发，可以通过e.preventDefault()来取消此次ajax请求
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event beforeRender
         * @param {Event} e gmu.Event对象
         * @param {Object} response 返回值
         * @param {Object} panel 对应的Tab内容的容器
         * @param {Number} index Tab的序号
         * @param {Object} xhr xhr对象
         * @description ajax请求进来数据，在render到div上之前触发，对于json数据，可以通过此方来自行写render，然后通过e.preventDefault()来阻止，将response输出在div上
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event load
         * @param {Event} e gmu.Event对象
         * @param {Zepto} panel 对应的Tab内容的容器
         * @description 当ajax请求到的内容过来后，平已经Render到div上了后触发
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event loadError
         * @param {Event} e gmu.Event对象
         * @param {Zepto} panel 对应的Tab内容的容器
         * @description 当ajax请求内容失败时触发，如果此事件被preventDefault了，则不会把自带的错误信息Render到div上
         * @for Tabs
         * @uses Tabs.ajax
         */
    } );
})(Zepto);
