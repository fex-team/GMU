(function ($, win) {
    gmu.define('suggestion', {
        //必传项:
        //container,source，其container为input或者其他可编辑文本框
        defaultOptions: {
            listCount: 5,
            isCache: true,
            isHistory: true,     //isStorage
            historyShare: true,    //isSharing + shareName
            usePlus: false,
            autoClose: false,
            compatData: false,
            queryKey: 'wd',
            cbKey: 'cb'
        },
        eventHandler: {
            'submit': function () {
                this._options.isHistory && this._localStorage(this.value()).trigger('submit');
            },
            'focus': function () {
                this._showList().trigger('open');
            },
            'input': function () {
                this._showList();
            },
            'touchstart': function (e) {
                e.preventDefault();     //todo 待验证，新闻页面不会有该bug，待排查原因，中文输入不跳转的bug
            },
            'tap': function (e) {
                var me = this,
                    $input = me.getEl(),
                    $elem = $(e.target);

                if ($elem.hasClass('ui-suggestion-plus')) {
                    $input.val($elem.attr('data-item'));
                } else {
                    setTimeout(function () {    //防止使用tap造成穿透
                        $input.val($elem.text());
                        me.trigger('select', [$elem]).hide().$form.submit();
                    }, 400);
                }
            },
            'click': function (e) {
                var me = this,
                    target = $(e.target).closest('span').get(0),
                    cls = target ? target.className : '';

                if (cls === 'ui-suggestion-clear') {    //清除历史记录
                    me.history(null);
                } else if (cls === 'ui-suggestion-close') {      //关闭sug
                    me.hide().blur().trigger('close');
                }
            }
        },
        _create: function () {
            var me = this,
                $input = me.getEl().attr('autocomplete', 'off'),
                $parent = $input.parent();

            $parent.is('.ui-suggestion-mask') ? (me.$mask = $parent) : $input.wrap(me.$mask = $('<div class="ui-suggestion-mask"></div>'));
            me.$mask.append('<div class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">清除历史记录</span>' +
                '<span class="ui-suggestion-close">关闭</span></div></div>');
            me.$wrapper = me.$mask.find('.ui-suggestion').css('top', $input.height());
            me.$content = me.$wrapper.find('.ui-suggestion-content');
            me.$btn = me.$wrapper.find('.ui-suggestion-button');
            me.$clearBtn = me.$btn.find('.ui-suggestion-clear');
            me.$closeBtn = me.$btn.find('.ui-suggestion-close');

            return me;
        },
        _setup: function () {
            return this._create();
        },
        _init: function () {
            var me = this,
                opts = me._options,
                $form = $(opts.form || me.getEl().closest('form')),
                hs = opts.historyShare,
                eventHandler = $.proxy(me._eventHandler, me);

            me.key = hs ? (($.type(hs) === 'boolean' ? '' : hs + '-') + 'SUG-Sharing-History') : me.getEl().attr('data-guid');
            me.splitor = encodeURIComponent(',');     //localStorage中数据分隔符
            opts.isCache && (me.cacheData = {});
            me._create().getEl().on('focus.suggestion input.suggestion', eventHandler);
            $form.size() && (me.$form = $form.on('submit.suggestion', eventHandler));
            me.$content.on('touchstart.suggestion, tap.suggestion', eventHandler).find('li').highlight('ui-suggestion-highlight');      //注册tap事件由于中文输入法时，touch事件不能submit
            me.$btn.on('click.suggestion', eventHandler);
            me.on('destroy', function () {
                $form.size() && $form.off('.suggestion');
                me.$wrapper.children().off('.suggestion').remove();
                me.$wrapper.off('.suggestion').remove();
                me.$mask.off('.suggestion').replaceWith(me.getEl());
            });

            return me;
        },
        _showList: function () {
            var me = this,
                query = me.value(),
                sendRequest = me._options._sendRequest,
                data;

            if (query) {      //当query不为空，即input或focus时,input有值
                (data = me._cacheData(query)) ?
                    me._render(data, query) :
                    $.isFunction(sendRequest) ? sendRequest.call(me, query, me._render) : me.trigger('sendRequst', query);
            } else {      //query为空，即刚开始focus时，读取localstorage中的数据渲染
                (data = me._localStorage()) ? me._render({s: data.split(me.splitor)}) : me.hide();
            }
            return me;
        },
        _render: function (data, query) {
            var me = this,
                renderList = me._options.renderList;
            return $.isFunction(renderList) ? me._fillWrapper(renderList.call(me, data.s, query) || '', query) : me.trigger('renderList', [data.s, query]);
        },
        _fillWrapper: function (listHtml, query) {
            this.$clearBtn[query ? 'hide' : 'show']();      //数据不是来自历史记录时隐藏清除历史记录按钮
            listHtml ? (this.$content.html(listHtml), this.show()) : this.hide();
            return this;
        },
        _eventHandler: function (e) {
            this.eventHandler[e.type.split('.')[0]].call(this, e);
        },
        _localStorage: function (value) {
            var me = this,
                key = me.key,
                splitor = me.splitor,
                localStorage,
                data;

            try {
                //老的history数据兼容处理
                me._options.compatData && me.trigger('compatData');

                localStorage = win.localStorage;
                if (value === undefined) {    //geter
                    return localStorage[key];
                } else if (value === null){   //setter clear
                    localStorage[key] = '';
                } else if (value) {     //setter
                    data = (localStorage[key] || '').split(splitor);
                    if (!~$.inArray(value, data)) {
                        data.unshift(value);
                        localStorage[key] = data.join(splitor);
                    }
                }
            } catch (e) {
                console.log(e.message);
            }
            return me;
        },
        _cacheData: function (key, value) {      //setter, getter
            return value !== undefined ? this.cacheData[key] = value : this.cacheData[key];
        },
        value: function () {
            return this.getEl().val();
        },
        history: function (value) {      //value:null，清除sug历史记录，value非null为存取
            return value === null ? win.confirm('清除全部查询历史记录？') && (this._localStorage(value), this.hide()) : this._localStorage(value);
        },
        show: function () {
            this.$wrapper.show();
            return this;
        },
        hide: function () {
            this.$wrapper.hide();
            return this;
        },
        focus: function () {
            this.getEl().get(0).focus();
            return this;
        },
        blur: function () {
            this.getEl().get(0).blur();
            return this;
        }
    });
})(Zepto, window);
