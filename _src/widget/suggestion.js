/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import core/touch.js, core/zepto.ui.js, core/zepto.highlight.js
 */
(function($, undefined){
    /**
     * @name suggestion
     * @desc   搜索建议组件
     * @grammar     suggestion() => self
     * @grammar     $.ui.suggestion([el [,options]]) => self
     * @desc
     * **Options**
     * - ''container''        {Selector}:                  (必选)父元素
     * - ''source''           {String}:                    (必选)请求数据的url
     * - ''param''            {String}:                    (可选)url附加参数
     * - ''formID''           {String}:                    (可选)提交搜索的表单，默认为包含input框的第一个父级form
     * - ''posAdapt''         {Boolean,默认:false}:         (可选)是否自动调整位置
     * - ''listCount''        {Number, 默认: 5}:            (可选)展现sug的条数: 5
     * - ''isCache''          {Boolean, 默认: true}:        (可选)是否缓存query: true
     * - ''isStorage''        {Boolean, 默认: true}:        (可选)是否本地存储pick项: true
     * - ''isSharing''        {Boolean, 默认: true}:        (可选)是否共享历史记录: true
     * - ''shareName''        {String}:                    (可选)共享缓存key
     * - ''autoClose''        {Boolean}:                   (可选)点击input之外自动关闭
     * - ''usePlus''          {Boolean}:                   (可选)是否启用+号
     * - ''status''           {Boolean}:                   (可选)是否开启事件，可在close时设为false，则下次sug不再弹出
     * - ''useIscroll''       {Boolean}:                   (可选)是否启用iscroll，启用则sug可内滚
     * - ''height''           {Number}:                    (可选)设置高度
     * - ''width''            {Number}:                    (可选)设置宽度
     * - ''minChars''         {Number}:                    (可选, 默认: 0)最小输入字符: 0
     * - ''maxChars''         {Number}:                    (可选, 默认: 1000)最大输入字符: 1000
     * - ''offset''           {Object}:                    (可选, 默认: {x:0, y:0})偏移量{x:0, y:0}
     * - ''renderList''       {Function}:                  (可选)自定义渲染下拉列表
     * - ''renderEvent''      {Function}:                  (可选)绑定用户事件
     * - ''sendRequest''      {Function}:                  (可选)用户自定义请求方式
     * - ''select''         {Function}:                    (可选)选中一条sug触发
     * - ''submit''         {Function}:                    (可选)提交时触发
     * - ''open''          {Function}:                    (可选)sug框展开时触发
     * - ''close''         {Function}:                     (可选)sug框关闭时触发
     * **setup方式html规则**
     * <code type="html">
     * <input type="text" id="input">
     * </code>
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/suggestion/suggestion_setup.html">
     * ../gmu/_examples/widget/suggestion/suggestion_setup.html
     * </codepreview>
     */
    $.ui.define('suggestion', {
        _data: {
            listCount: 50,
            isCache: true,
            isStorage: true,
            offset: {x: 0, y: 0, w: 0},
            confirmClearHistory: true
        },

        _create: function() {
            var me = this,
                expando = +new Date(),
                maskID = 'ui-input-mask-' + expando,
                sugID = "ui-suggestion-" + $.ui.guid(),
                $input = me.root($(me.data('container'))).attr("autocomplete", "off"),
                formID = me.data('formID'),
                shareName = me.data('shareName'),
                $maskElem, $wrapper;

            me.data({
                inputWidth: $input.get(0).offsetWidth,
                cacheData: {},
                form: formID ? $(formID) : $input.closest('form'),
                key: me.data('isSharing') ? (shareName ? (shareName + '-') : '' + 'SUG-Sharing-History') : sugID,
                splitor: encodeURIComponent(',')
            });
            $input.wrap($maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>'));
            $maskElem.append($wrapper = $('<div id="' + sugID + '" class="ui-suggestion"><div class="ui-suggestion-content"><div class="ui-suggestion-scroller"></div></div><div class="ui-suggestion-button"></div></div>'));
            me.data({
                maskElem: $maskElem,
                wrapper: $wrapper,
                content: $wrapper.find('.ui-suggestion-content'),
                scroller: $wrapper.find('.ui-suggestion-scroller'),
                button: $wrapper.find('.ui-suggestion-button').append('<span>清除历史记录</span><span>关闭</span>'),
                clearBtn: $wrapper.find('span:first-child'),
                closeBtn: $wrapper.find('span:last-child')
            });
        },

        _init: function() {
            var me = this,
                $input = me.root(),
                form = me.data('form'),
                $wrapper = me.data('wrapper'),
                eventHandler = $.proxy(me._eventHandler, me);

            $wrapper.css('top', $input.height() + parseInt($wrapper.css('top'))).on('touchstart', eventHandler);
            form.length && form.on('submit', eventHandler);
            me._bindSuggestionListEvent()._bindCloseEvent();    //事件改为代理，不用每次渲染list都去重新绑定事件
            $input.on('focus input', eventHandler);
            $(window).on('ortchange', eventHandler);
            me.data('autoClose') && $(document).on('tap', eventHandler);
            me.on('destroy', function() {
                var me = this,
                    $maskElem = me.data('maskElem');
                $(document).off('tap', eventHandler);
                $(window).off('ortchange', eventHandler);
                clearTimeout(me.data('timeId'));
                clearTimeout(me.data('hideTimer'));
                $maskElem.find('*').off();
                $maskElem.off().remove();
            });
        },

        _setup: function(){
            var me = this;
            me.data('container', me.root()); // add container
            me._create();
        },
    
        /** 
         * input输入处理
         * @private
         */
        _change: function(query) {
            var me = this,
                data = me._cacheData(query),
                isCache = me.data('isCache'),
                source = me.data('source');
            return data && isCache ? me._render(query, data) : me._sendRequest(query);
        },

        /** 
         * 事件管理器
         * @private
         */
        _eventHandler: function(e) {
            var me = this,
                type = e.type,
                target = e.target,
                maskElem = me.data('maskElem').get(0);

            if (!me.data('status')) return;
            switch (type) {
                case 'focus':
                    me._showList().trigger('open');
                    break;
                case 'input':
                    me._showList();
                    break;
                case 'submit':       //form提交时能存储历史记录
                    me.data('isStorage') && me._localStorage(me.getValue());
                case 'click':
                case 'tap':
                    if (!(maskElem.compareDocumentPosition(target) & 16)) me.hide();
                    break;
            }
        },

        /** 
         * 显示下拉浮层
         * @private
         */
        _showList: function() {
            var me = this,
                query = me.getValue(),
                data = me._localStorage();

            return query ? me._change(query) : data ? me._render(null, {s: data.split(me.data('splitor'))}) : me.hide();
        },
        
        /** 
         * 绑定下拉浮层中的事件
         * @private
         */
        _bindSuggestionListEvent: function() {
            var me = this,
                $content = me.data('content'),
                $input =  me.root();
            $content.on('tap', function(e) {
                var elem = e.target;
                setTimeout(function(){
                    if (elem && elem.className == 'ui-suggestion-plus') {
                        $input.val(elem.getAttribute('data-item')).trigger('input');
                    } else if ($.contains($content.get(0), elem)){
                        me._select(elem);
                    }
                }, 400);
            });
            return me;
        },

        /** 
         * 绑定关闭按钮事件
         * @private
         */
        _bindCloseEvent: function() {
            var me = this;

            me.data('clearBtn').on('click', function() {
                $.later(function(){
                    me.clearHistory();
                }, $.os.android?200:0);
            });

            me.data('closeBtn').on('click', function() {
                me.hide().leaveInput().trigger('close');
            });
            return me;
        },  

        /** 
         * 发送异步请求
         * @private
         */
        _sendRequest: function(query) {
            var me = this,
                url = me.data('source'),
                param = me.data('param'),
                cb = "suggestion_" + (+new Date()),
                sendRequest = me.data('sendRequest');

            if ($.isFunction(sendRequest)) {
                sendRequest(query, function(data) {
                    me._render(query, data)._cacheData(query, data);
                });
            } else if (query) {
                url += (url.indexOf("?") === -1 ? "?" : "") + "&wd=" + encodeURIComponent(query);
                url.indexOf("&cb=") === -1 && (url += "&cb=" + cb);
                param && (url += '&' + param);
                window[cb] = function(data) {
                    me._render(query, data)._cacheData(query, data);
                    $('[src="' + url + '"]').remove();
                    delete window[cb];
                };
                $.ajax({
                    url: url,
                    dataType: 'jsonp'
                });
            }
            return me;
        },

        /**
         * @desc 获取input值
         * @name getValue
         * @grammar getValue() => string
         * @example $('#input').suggestion('getValue');
         */
        getValue: function() {
            return $.trim(this.root().val());
        },

        /** 
         * 渲染下拉浮层
         * @private
         */
        _render: function(query, data) {
            var me = this, html,
                $content = me.data('content'),
                $scroller = me.data('scroller'),
                $clearBtn = me.data('clearBtn'),
                renderList = me.data('renderList');

            $clearBtn[query === null ? 'show' : 'hide']();
            html = renderList ? renderList.apply(me, [query, data]) : me._renderList(query, data);

            if (html) {
                $scroller.html(html);
                $content
                    .on('touchstart', function(e){e.preventDefault()})
                    .find('.ui-suggestion-result')
                    .highlight('ui-suggestion-result-highlight');
                me._show();
            } else me.hide();
            
            return me;
        },      

        /** 
         * 渲染list HTML片段
         * @private
         */
        _renderList: function(query, data) {
            var me = this,
                listCount = me.data('listCount'),
                usePlus = me.data('usePlus'),
                html = "<ul>",
                sugs = data.s;

            if (!data || !sugs || !sugs.length) {
                this.hide();
                return;
            }
            sugs = sugs.slice(0, listCount);
            query = this._htmlEncode(query) || null;    //FEBASE-736 修改query为空时,replace替换错误的bug
            $.each(sugs, function(index, item) {
                item = me._htmlEncode(item);
                var str = $.trim(item).replace(query, '<span>' + query + '</span>');
                if (usePlus) str += '<div class="ui-suggestion-plus" data-item="' + item + '"></div>';
                html += '<li><div class="ui-suggestion-result">' + str + '</div></li>';
            });
            return html + '</ul>';
        },

        _htmlEncode: function(str){
            return $('<div></div>').text(str).html();
        },

        /** 
         * 选择搜索提示
         * @private
         */
        _select: function(elem) {
            var me = this,
                $form = me.data('form');

            me.root().val($(elem).text());
            $form.length && $form.submit().trigger('submit');
            return me.trigger("select", elem).hide();
        },      

        /** 
         * 缓存搜索提示
         * @private
         */
        _cacheData: function(key, value) {
            var me = this;
            if (me.data('isCache')) {
                return value !== undefined ? me.data('cacheData')[key] = value : me.data('cacheData')[key];
            }
        },  

        /** 
         * 操作历史记录
         * @private
         */
        _localStorage: function(value) {
            var me = this,
                splitor = me.data('splitor'),
                id = me.data('key'),
                ret,
                localdata,
                data;

            try{
                if (value === null) window.localStorage[id] = "";
                else if (value !== undefined && value !== '') {
                    localdata = window.localStorage[id];
                    data = localdata ? localdata.split(splitor) : [];

                    if (!~$.inArray(value, data) ) {
                        data.unshift(value);
                        window.localStorage[id] = data.join(splitor);
                    }
                }
                ret = window.localStorage[id];
            } catch(e){}
            return ret;
        },

        /** 
         * 显示suggestion
         * @private
         */
        _show: function() {
            var me = this;
            // hide后200ms内再次show，清除timer
            if(me.data('hideTimer')) {
                clearTimeout(me.data('hideTimer'));
                me.data('hideTimer', null);
            }
            me.data('wrapper').css("display", "block");
            return me.trigger('show');
        },  

        /**
         * @desc 隐藏suggestion
         * @name hide
         * @grammar hide() => self
         */
        hide: function() {
            var me = this;
            me.data('hideTimer', $.later(function() {
                me.data('wrapper').css("display", "none");
                me.data('hideTimer', null);
            }, 200));
            return me.trigger('hide');
        },

        /**
         * @desc 清除历史记录
         * @name clearHistory
         * @grammar clearHistory() => undefined
         */
        clearHistory: function() {
            var me = this, _clear = function(){
                me._localStorage(null);
                me.hide();
            };
            me.data('confirmClearHistory') ? window.confirm('清除全部查询历史记录？') && _clear() : _clear();
        },

        /**
         * @desc 设置|获取历史记录
         * @name history
         * @grammar history() => string
         * @param {String} query 搜索条件
         */
        history: function(query) {
            return this._localStorage(query);
        },

        /**
         * @desc input获得焦点
         * @name focusInput
         * @grammar focusInput() => self
         */
        focusInput: function() {
            this.root().get(0).focus();
            return this;
        },

        /**
         * @desc input失去焦点
         * @name leaveInput
         * @grammar leaveInput() => self
         */
        leaveInput: function() {
            this.root().get(0).blur();
            return this;
        }
    });
})(Zepto);

