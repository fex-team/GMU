/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import core/touch.js
 */
(function ($, win) {
    var guid = 0;

    gmu.define('suggestion', {
        //必传项:
        //container,source，其container为input或者其他可编辑文本框
        options: {
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
            'input': function () {    //考虑到在手机上输入比较慢，故进行稀释处理
                this._showList();
            },
            'touchstart': function (e) {
                e.preventDefault();     //todo 待验证，新闻页面不会有该bug，待排查原因，中文输入不跳转的bug
            },
            'tap': function (e) {
                var me = this,
                    $input = me.getEl(),
                    $elem = $(e.target);

                if ($elem.hasClass('ui-suggestion-plus')) {     //点击加号，input值上框
                    $input.val($elem.attr('data-item'));
                } else if ($.contains(me.$wrapper, $elem.get(0))){    //点击sug item
                    setTimeout(function () {    //防止使用tap造成穿透
                        $input.val($elem.text());
                        me.trigger('select', [$elem]).hide().$form.submit();
                    }, 400);
                } else {       //点击sug外围，sug关闭
                    me.hide();
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
        _initDom: function () {    //无setup模式
            var me = this,
                $input = me.getEl().attr('autocomplete', 'off');

            $input.wrap(me.$mask = $('<div class="ui-suggestion-mask"></div>'));
            //考虑到不涉及到动态渲染数据，故没有采用template
            me.$mask.append('<div id="ui-suggestion-"' + (guid++) + 'class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">清除历史记录</span>' +
                '<span class="ui-suggestion-close">关闭</span></div></div>');
            me.$wrapper = me.$mask.find('.ui-suggestion').css('top', $input.height() + parseInt($input.css('top')));
            me.$content = me.$wrapper.find('.ui-suggestion-content');
            me.$btn = me.$wrapper.find('.ui-suggestion-button');
            me.$clearBtn = me.$btn.find('.ui-suggestion-clear');
            me.$closeBtn = me.$btn.find('.ui-suggestion-close');

            return me;
        },
        _create: function () {
            var me = this,
                opts = me._options,
                $form = $(opts.form || me.getEl().closest('form')),
                hs = opts.historyShare,
                ns = '.suggestion',
                eventHandler = $.proxy(me._eventHandler, me);

            me.key = hs ? (($.type(hs) === 'boolean' ? '' : hs + '-') + 'SUG-Sharing-History') : me.getEl().attr('id');
            me.splitor = encodeURIComponent(',');     //localStorage中数据分隔符
            opts.isCache && (me.cacheData = {});
            $form.size() && (me.$form = $form.on('submit.suggestion', eventHandler));
            opts.autoClose && $(document).on('tap' + ns, eventHandler);
            me._initDom().getEl().on('focus' + ns + ' input' + ns, eventHandler);
            me.$content.on('touchstart' + ns + ' tap' + ns, eventHandler).find('li').highlight('ui-suggestion-highlight');      //注册tap事件由于中文输入法时，touch事件不能submit
            me.$btn.on('click' + ns, eventHandler);
            me.on('destroy', function () {
                $form.size() && $form.off('.suggestion');
                me.$wrapper.children().off('.suggestion').remove();
                me.$wrapper.off('.suggestion').remove();
                me.$mask.off('.suggestion').replaceWith(me.getEl());
            });

            return me;
        },
        /**
         * 展示suglist，分为query存在和不存在
         * @private
         */
        _showList: function () {
            var me = this,
                query = me.value(),
                sendRequest = me._options._sendRequest,
                data;

            if (query) {      //当query不为空，即input或focus时,input有值
                (data = me._cacheData(query)) ?
                    me._render(data, query) :
                    //用户自己发送请求或直接本地数据处理，可以在sendRequest中处理，因需求不大，故暂不实现source为数据对象时，对数据筛选的逻辑
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
        /**
         * 根据数据填充sug wrapper
         * @listHtml 填充的sug片段，默认为'<ul><li>...</li>...</ul>'
         * @query query数据
         * @private
         */
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
        /**
         * @desc 获取input值
         * @name value
         * @grammar value() => string
         * @example $('#input').suggestion('value');
         */
        value: function () {
            return this.getEl().val();
        },

        /**
         * @desc 设置|获取|清空历史记录
         * @name history
         * @grammer history => self|string
         * @example
         * $('#input').suggestion('history')   //返回当前localstorage中history值
         * $('#input').suggestion('history', 'aa')   //为history增加'aa'值
         * instance.history(null)     //清空当前sug的history
         * */
        history: function (value) {      //value:null，清除sug历史记录，value非null为存取
            return value === null ? win.confirm('清除全部查询历史记录？') && (this._localStorage(value), this.hide()) : this._localStorage(value);
        },

        /**
         * @desc 显示sug
         * @name show
         * @grammer show() => self
         * */
        show: function () {
            this.$wrapper.show();
            return this;
        },

        /**
         * @desc 隐藏sug
         * @name hide
         * @grammer hide() => self
         * */
        hide: function () {
            this.$wrapper.hide();
            return this;
        }
    });
})(Zepto, window);
