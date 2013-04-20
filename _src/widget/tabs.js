/**
 * @file 选项卡组件
 * @desc 选项卡组件
 * @name Tabs
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/tabs/tabs.html</qrcode>
 * @import core/touch.js, core/zepto.ui.js,core/zepto.highlight.js
 * @importCSS transitions.css, loading.css
 */
(function ($, undefined) {
    var _uid = 1,
        uid = function(){
            return _uid++;
        },
        tpl = {
            nav:'<ul class="ui-tabs-nav">'+
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                    '<li<% if(i==active){ %> class="ui-state-active"<% } %>><a href="javascript:;"><%=item.title%></a></li>'+
                '<% } %></ul>',
            content:'<div class="ui-viewport ui-tabs-content">' +
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                    '<div<% if(item.id){ %> id="<%=item.id%>"<% } %> class="ui-panel ui-tabs-panel <%=transition%><% if(i==active){ %> ui-state-active<% } %>"><%=item.content%></div>'+
                '<% } %></div>'
        },
        idRE = /^#(.+)$/;

    /**
     * @name $.ui.tabs
     * @grammar $.ui.tabs(options) ⇒ instance
     * @grammar tabs(options) ⇒ self
     * @desc **Options**
     * - ''active'' {Number}: (可选，默认：0) 初始时哪个为选中状态，如果时setup模式，如果第2个li上加了ui-state-active样式时，active值为1
     * - ''items'' {Array}: 在render模式下需要必须设置 格式为\[{title:\'\', content:\'\', href:\'\'}\], href可以不设，可以用来设置ajax内容。
     * - ''transition'' {\'\'|\'slide\'}: 设置切换动画
     * - ''events'' 所有[Trigger Events](#tabs_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/tabs/tabs.html">
     * ../gmu/_examples/widget/tabs/tabs.html
     * </codepreview>
     */
    $.ui.define('tabs', {
        _data:{
            active: 0,
            items:null,//[{title:'', content:'', href: ''}] href可以用来设置连接，表示为ajax内容, 需要引入tabs.ajax插件
            transition: 'slide',//目前只支持slide动画，或无动画
            activate: null,// events
            beforeActivate: null, //event
            animateComplete: null//如果用了transtion，这个事件将在动画执行完成后触发.
        },

        _prepareDom:function (mode, data) {
            var me = this, content, $el = me._el, items, nav, contents, id;
            switch (mode) {
                case 'fullsetup':
                case 'setup':
                    data._nav =  me._findElement('ul').first();
                    if(data._nav) {
                        data._content = me._findElement('div.ui-tabs-content');
                        data._content = ((data._content && data._content.first()) || $('<div></div>').appendTo($el)).addClass('ui-viewport ui-tabs-content');
                        items = [];
                        data._nav.addClass('ui-tabs-nav').children().each(function(){
                            var $a = me._findElement('a', this), href = $a?$a.attr('href'):$(this).attr('data-url'), id, $content;
                            id = idRE.test(href)? RegExp.$1: 'tabs_'+uid();
                            ($content = me._findElement('#'+id) || $('<div id="'+id+'"></div>'))
                                .addClass('ui-panel ui-tabs-panel'+(data.transition?' '+data.transition:''))
                                .appendTo(data._content);
                            items.push({
                                id: id,
                                href: href,
                                title: $a?$a.attr('href', 'javascript:;').text():$(this).text(),//如果href不删除的话，地址栏会出现，然后一会又消失。
                                content: $content
                            });
                        });
                        data.items = items;
                        data.active = Math.max(0, Math.min(items.length-1, data.active || $('.ui-state-active', data._nav).index()||0));
                        me._getPanel().add(data._nav.children().eq(data.active)).addClass('ui-state-active');
                        break;
                    } //if cannot find the ul, switch this to create mode. Doing this by remove the break centence.
                default:
                    items = data.items = data.items || [];
                    nav = [];
                    contents = [];
                    data.active = Math.max(0, Math.min(items.length-1, data.active));
                    $.each(items, function(key, val){
                        id = 'tabs_'+uid();
                        nav.push({
                            href: val.href || '#'+id,
                            title: val.title
                        });
                        contents.push({
                            content: val.content || '',
                            id: id
                        });
                        items[key].id = id;
                    });
                    data._nav = $($.parseTpl(tpl.nav, {items: nav, active: data.active})).prependTo($el);
                    data._content = $($.parseTpl(tpl.content, {items: contents, active: data.active, transition: data.transition})).appendTo($el);
                    data.container = data.container || ($el.parent().length ? null : 'body');
            }
            data.container && $el.appendTo(data.container);
            me._fitToContent(me._getPanel());
        },

        _getPanel: function(index){
            var data = this._data;
            return $('#'+data.items[index===undefined?data.active:index].id);
        },

        _findElement:function (selector, el) {
            var ret = $(el || this._el).find(selector);
            return ret.length ? ret : null;
        },

        _create:function () {
            var me = this, data = me._data;
            me._el = me._el || $('<div></div>');
            me._prepareDom('create', data);
        },

        _setup:function (mode) {
            var me = this, data = me._data;
            me._prepareDom(mode ? 'fullsetup' : 'setup', data);
        },

        _init:function () {
            var me = this, data = me._data, $el = me.root(), eventHandler = $.proxy(me._eventHandler, me);
            $el.addClass('ui-tabs');
            data._nav.on('tap', eventHandler).children().highlight('ui-state-hover');
            $(window).on('ortchange', eventHandler);
        },

        _eventHandler:function (e) {
            var match, data = this._data;
            switch(e.type) {
                case 'ortchange':
                    this.refresh();
                    break;
                default:
                    if((match = $(e.target).closest('li', data._nav.get(0))) && match.length) {
                        e.preventDefault();
                        this.switchTo(match.index());
                    }
            }
        },

        _fitToContent: function(div) {
            var data = this._data, $content = data._content;
            data._plus === undefined && (data._plus = parseFloat($content.css('border-top-width'))+parseFloat($content.css('border-bottom-width')))
            $content.height( div.height() + data._plus);
            return this;
        },

        /**
         * @name switchTo
         * @grammar switchTo(index)  ⇒ instance
         * @desc 切换到tab。
         */
        switchTo: function(index) {
            var me = this, data = me._data, items = data.items, eventData, to, from, reverse, endEvent;
            if(!data._buzy && data.active != (index = Math.max(0, Math.min(items.length-1, index)))) {
                to = $.extend({}, items[index]);//copy it.
                to.div = me._getPanel(index);
                to.index = index;

                from = $.extend({}, items[data.active]);//copy it.
                from.div = me._getPanel();
                from.index = data.active;

                eventData = $.Event('beforeActivate');
                me.trigger(eventData, [to, from]);
                if(eventData.defaultPrevented) return me;

                data._content.children().removeClass('ui-state-active');
                to.div.addClass('ui-state-active');
                data._nav.children().removeClass('ui-state-active').eq(to.index).addClass('ui-state-active');
                if(data.transition) { //use transition
                    data._buzy = true;
                    endEvent = $.fx.animationEnd + '.tabs';
                    reverse = index>data.active?'':' reverse';
                    data._content.addClass('ui-viewport-transitioning');
                    from.div.addClass('out'+reverse);
                    to.div.addClass('in'+reverse).on(endEvent, function(e){
                        if (e.target != e.currentTarget) return //如果是冒泡上来的，则不操作
                        to.div.off(endEvent, arguments.callee);//解除绑定
                        data._buzy = false;
                        from.div.removeClass('out reverse');
                        to.div.removeClass('in reverse');
                        data._content.removeClass('ui-viewport-transitioning');
                        me.trigger('animateComplete', [to, from]);
                        me._fitToContent(to.div);
                    });
                }
                data.active = index;
                me.trigger('activate', [to, from]);
                data.transition ||  me._fitToContent(to.div);
            }
            return me;
        },

        /**
         * @name refresh
         * @grammar refresh() => instance
         * @desc 当外部修改tabs内容好，需要调用refresh让tabs自动更新高度。
         * @return instance
         */
        refresh: function(){
            return this._fitToContent(this._getPanel());
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, eventHandler = this._eventHandler;
            data._nav.off('tap', eventHandler).children().highlight();
            data.swipe && data._content.off('swipeLeft swipeRight', eventHandler);
            return this.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | activate | event, to, from | 内容切换后触发, to和from为Object, 成员有: div(内容div), index(位置), title(标题), content(内容),href(链接) |
         * | beforeActivate | event, to, from | 内容切换之前触发，可以通过e.preventDefault()来阻止 |
         * | animateComplete | event, to, from | 动画完成后执行，如果没有设置动画，此时间不会触发 |
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);