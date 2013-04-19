/**
 * @file 日历组件
 * @name Datepicker
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/datepicker/datepicker.html</qrcode>
 * 日历组件, 可以用来作为日期选择器。
 * @import core/touch.js, core/zepto.extend.js, core/zepto.ui.js, core/zepto.highlight.js
 */
(function ($, undefined) {
    var monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
            "07月", "08月", "09月", "10月", "11月", "12月"],
        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,
        //获取月份的天数
        _getDaysInMonth = function (year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },
        //获取月份中的第一天是所在星期的第几天
        _getFirstDayOfMonth = function (year, month) {
            return new Date(year, month, 1).getDay();
        };

    //@todo 支持各种格式
    $.datepicker = {
        parseDate:function (obj) {
            var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
            return $.isDate(obj)?obj: dateRE.test(obj)? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10)-1, parseInt(RegExp.$3, 10)):null;
        },
        formatDate:function (date) {
            var formatNumber = $.datepicker.formatNumber;
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        },
        formatNumber:function (val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        }
    }

    function slideUpFrame(div, cb){
        this.id = slideUpFrame.id = (slideUpFrame.id || 0) + 1;
        this.div = div;
        this.cb = cb;
        this._init();
    }
    $.extend(slideUpFrame.prototype, {
        _init : function(){
            this.holder = $('<span class="ui-holder"></span>');
            this.root = $('<div class="ui-slidup-wrap">' +
                    '<div class="ui-slideup">' +
                        '<div class="header">' +
                            '<span class="ok-btn" href="">确认</span>' +
                            '<span class="no-btn" href="">取消</span>' +
                        '</div>' +
                        '<div class="frame"></div>' +
                    '</div>' +
                '</div>');
            this.frame = $('.frame', this.sDiv = $('.ui-slideup', this.root) )
                .append(this.div.replaceWith(this.holder));
            this.open();
        },
        refresh: function(cb){
            var me = this;
            this.root.css({
                top: ( window.pageYOffset) + 'px',
                height: window.innerHeight+'px'
            });
            this.sDiv.animate({
                translateY: '-'+this.sDiv.height()+'px',
                translateZ: '0'
            }, 400, 'ease-out', function(){
                cb && cb.call(me);
            });
        },
        open: function(){
            var me = this, count = slideUpFrame.count = ( slideUpFrame.count || 0) +1;
            count==1 && $(document).on('touchmove.slideup', function(e){
                e.preventDefault()
            });
            me.root.on('click.slideup'+me.id, '.ok-btn, .no-btn', function(){
                me.cb.call(me, $(this).is('.ok-btn')) !== false && me.close();
            }).appendTo(document.body)
                .find('.ok-btn, .no-btn')
                .highlight('ui-state-hover');
            me.refresh();
        },
        close: function(cb){
            var me =this, count = slideUpFrame.count = slideUpFrame.count - 1;
            this.root.off('click.slideup'+this.id);
            this.sDiv.animate({
                translateY: '0',
                translateZ: '0'
            }, 200, 'ease-out', function(){
                cb && cb();
                me.holder.replaceWith(me.div);
                me.root.remove();
                count==0 && $(document).off('touchmove.slideup');
            }).find('.ok-btn, .no-btn').highlight();
        }
    });


    /**
     * @name $.ui.datepicker
     * @grammar $.ui.datepicker(options) ⇒ instance
     * @grammar datepicker(options) ⇒ self
     * @desc **Options**
     * - ''date'' {Date|String}: (可选，默认：today) 初始化日期
     * - ''firstDay'' {Number}: (可选，默认：1)  设置新的一周从星期几开始，星期天用0表示, 星期一用1表示, 以此类推.
     * - ''minDate'' {Date|String}: (可选，默认：null)  设置可以选择的最小日期
     * - ''maxDate'' {Date|String}: (可选，默认：null)  设置可以选择的最大日期
     * - ''container'' {selector}: (可选，默认：null)  当selector为input时，默认在input后面创建一个div存放datepicker，可以手动指定.
     * - ''events'' 所有[Trigger Events](#datepicker_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/datepicker/datepicker.html">
     * ../gmu/_examples/widget/datepicker/datepicker.html
     * </codepreview>
     */
    $.ui.define('datepicker', {
        _data:{
            date:null, //默认日期
            firstDay:1, //星期天用0表示, 星期一用1表示, 以此类推.
            maxDate:null, //可以选择的日期范围
            minDate:null,
            inline: false,
            swipe: false,
            changeYearMonth: false
        },

        _setup:function () {
            var el = this.root(), data = this._data;
            data.container && el.appendTo(data.container);
        },

        _create:function () {
            var data = this._data;
            this.root($('<div></div>').appendTo(data.container || document.body));
        },

        _init:function () {
            var data = this._data, div = this.root(), eventHandler = $.proxy(this._eventHandler, this);

            this.minDate(data.minDate)
                .maxDate(data.maxDate)
                .date(data.date || new Date())
                .refresh();

            div.addClass('ui-datepicker').on('click', eventHandler).highlight();
            data.swipe && div.on('swipeLeft swipeRight', eventHandler);
            if (!data.inline) {
                div.hide();
                $(window).on('ortchange', eventHandler);
            } else data._isShow = true;
            data._inited = true;
        },

        _eventHandler:function (e) {
            var match, me = this, data = me._data, root = me.root()[0], target,
                cell, date, select;
            switch(e.type){
                case 'swipeLeft':
                case 'swipeRight':
                    return me.goTo((e.type == 'swipeRight' ? '-' : '+') + '1M');
                case 'ortchange':
                    return data._frame && data._frame.refresh();
                case 'change':
                    select = $('.ui-datepicker-header select', this._el);
                    return me.goTo(select.eq(1).val(), select.eq(0).val());
                default://click
                    target = e.target;
                    if ((match = $(target).closest('.ui-datepicker-calendar tbody a', root)) && match.length) {
                        e.preventDefault();
                        cell = match.parent();
                        me.trigger('dayclick', date = new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));
                        me.selectedDate(date);
                        data.inline && me._commit();
                        me.refresh();
                    } else if ((match = $(target).closest('.ui-datepicker-prev, .ui-datepicker-next', root)) && match.length) {
                        e.preventDefault();
                        $.later(function(){
                            me.goTo((match.is('.ui-datepicker-prev') ? '-' : '+') + '1M');
                        });
                    }
            }
        },

        _generateHTML:function () {
            var data = this._data, html = '', i, j, firstDay, day, leadDays, daysInMonth, rows,
                printDate, drawYear = data._drawYear, drawMonth = data._drawMonth,
                tempDate = new Date(), today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()),
                minDate = this.minDate(), maxDate = this.maxDate(), selectedDate = this.selectedDate();

            firstDay = (isNaN(firstDay = parseInt(data.firstDay, 10)) ? 0 : firstDay);
            html += this._renderHead(data, drawYear, drawMonth, minDate, maxDate) + '<table  class="ui-datepicker-calendar"><thead><tr>';
            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;
                html += '<th' + ((i + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }
            html += '</thead></tr><tbody><tr class="ui-datepicker-gap"><td colspan="7">&#xa0;</td></tr>';
            daysInMonth = _getDaysInMonth(drawYear, drawMonth);
            leadDays = (_getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);
            for (i = 0; i < rows; i++) {
                html += '<tr>';
                for (j = 0; j < 7; j++) {
                    html += this._renderDay(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate);
                    printDate.setDate(printDate.getDate() + 1);
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        },

        _renderHead: function(data, drawYear, drawMonth, minDate, maxDate){
            var html = '<div class="ui-datepicker-header">', i, max,
                lpd = new Date(drawYear, drawMonth, -1),
                fnd = new Date(drawYear, drawMonth+1, 1);

            html += '<a class="ui-datepicker-prev'+(minDate && minDate>lpd?' ui-state-disable':'')+'" href="#">&lt;&lt;</a>';
            if(data.changeYearMonth){
                html += '<select class="ui-datepicker-year">';
                for(i = Math.max(1970, drawYear-10), max = i+20; i<max; i++){
                    html += '<option value="'+i+'" '+(i==drawYear?'selected="selected"':'')+'>'+i+'年</option>';
                }
                html += '</select><select class="ui-datepicker-month">';
                for(i = 0; i< 12; i++){
                    html += '<option value="'+i+'" '+(i==drawMonth?'selected="selected"':'')+'>'+monthNames[i]+'</option>';
                }
                html += '</select>';
            }else {
                html += '<div class="ui-datepicker-title">'+drawYear+'年'+monthNames[drawMonth]+'</div>';
            }
            html += '<a class="ui-datepicker-next'+(maxDate && maxDate<fnd?' ui-state-disable':'')+'" href="#">&gt;&gt;</a></div>';
            return html;
        },

        _renderDay: function(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate){
            var otherMonth, unselectable;
            otherMonth = (printDate.getMonth() !== drawMonth);
            unselectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
            return "<td class='" +
                ((j + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                (unselectable ? " ui-datepicker-unselectable ui-state-disabled" : "") + // highlight unselectable days
                (otherMonth || unselectable ? '' :
                    (printDate.getTime() === selectedDate.getTime() ? " ui-datepicker-current-day" : "") + // highlight selected day
                        (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")
                    ) + "'" + // highlight today (if different)
                (unselectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                (otherMonth ? "&#xa0;" : // display for other months
                    (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                        (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                        (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                        "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
        },

        _commit: function(){
            var data = this._data, date, dateStr = $.datepicker.formatDate(date = this.selectedDate());
            data.date = date;
            data._inited && this.trigger('valuecommit', [date, dateStr, this]);
            return this;
        },

        /**
         * @name open
         * @grammar open() ⇒ instance
         * @desc 显示组件
         */
        open:function () {
            var me = this, el = me.root(), data = me._data, date = me.date();
            if (data.inline || data._isShow)return me;
            data._isShow = true;
            date && me.selectedDate(date);
            me.refresh();
            data._frame = new slideUpFrame(el.show(), function(confirm){
                me.close();
                confirm && me._commit();
                return false;
            });
            return me.trigger('open', me);
        },

        /**
         * @name close
         * @grammar close() ⇒ instance
         * @desc 隐藏组件
         */
        close:function () {
            var me = this, el = me.root(), data = me._data, eventData;
            if (data.inline || !data._isShow)return me;
            me.trigger(eventData = $.Event('beforeclose'), me);
            if(eventData.defaultPrevented)return me;
            data._isShow = false;
            data._frame.close(function(){
                el.hide();
                me.trigger('close');
            });
            data._frame = null;
            return me;
        },

        /**
         * @name toggle
         * @grammar toggle() ⇒ instance
         * @desc 切换组件的显示与隐藏
         */
        toggle:function () {
            var data = this._data;
            return this[data._isShow?'close':'open']();
        },

        /**
         * @ignore
         * @name option
         * @grammar option(key[, value]) ⇒ instance
         * @desc 设置或获取Option，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        _option:function (key, val) {
            var data = this._data, date, minDate, maxDate;
            if (val !== undefined) {
                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        data[key] = val ? $.datepicker.parseDate(val) : null;
                        break;
                    case 'selectedDate':
                        minDate = data.minDate;
                        maxDate = data.maxDate;
                        val = $.datepicker.parseDate(val);
                        val = minDate && minDate>val ? minDate : maxDate && maxDate < val ? maxDate: val;
                        data._selectedYear = data._drawYear = val.getFullYear();
                        data._selectedMonth = data._drawMonth = val.getMonth();
                        data._selectedDay = val.getDate();
                        data._inited && this.trigger('select', [this.selectedDate(), this]);
                        break;
                    case 'date':
                        this._option('selectedDate', val);
                        this._commit();
                }
                data._invalid = true;
                return this;
            }
            return key == 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
        },

        /**
         * @name maxDate
         * @grammar maxDate([value]) ⇒ instance
         * @desc 设置或获取maxDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        maxDate:function (val) {
            return this._option('maxDate', val);
        },

        /**
         * @name minDate
         * @grammar minDate([value]) ⇒ instance
         * @desc 设置或获取minDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        minDate:function (val) {
            return this._option('minDate', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前date，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        date:function (val) {
            return this._option('date', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        selectedDate:function (val) {
            return this._option('selectedDate', val);
        },

        /**
         * @name goTo
         * @grammar goTo(month, year) ⇒ instance
         * @grammar goTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        goTo:function (month, year) {
            var data = this._data, offset, period, tmpDate, minDate = this.minDate(), maxDate = this.maxDate();
            if ($.isString(month) && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period == 'm' ? offset : 0);
                year = data._drawYear + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }
            tmpDate = new Date(year, month, 1);
            tmpDate = minDate && minDate>tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate: tmpDate;//不能跳到不可选的月份
            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();
            if(month!=data._drawMonth || year!=data._drawYear){
                this.trigger('changemonthyear', [data._drawMonth = month, data._drawYear = year]);
                data._invalid = true;
                data._isShow && this.refresh();
            }
            return this;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 当修改option后需要调用此方法。
         */
        refresh:function () {
            var data = this._data, el = this.root(), eventHandler = $.proxy(this._eventHandler, this);
            if (!data._invalid) {
                return;
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', el).highlight();
            $('.ui-datepicker-header select', el).off('change', eventHandler);
            el.empty().append(this._generateHTML());
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', el).highlight('ui-state-hover');
            $('.ui-datepicker-header select', el).on('change', eventHandler);
            data._frame && data._frame.refresh();
            data._invalid = false;
            return this;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, el = this.root(), eventHandler = this._eventHandler;
            if (!data.inline) {
                this.root().off('click', eventHandler);
                $(document).off('click.'+this.id());
                $(window).off('ortchange', eventHandler);
                el.on('swipeLeft swipeRight', eventHandler);
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled)', el).highlight();
            $('.ui-datepicker-header select', el).off('change', eventHandler);
            data._div.remove();
            return this.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | open | event, ui | 当组件显示后触发 |
         * | close | event, ui | 当组件隐藏后触发 |
         * | beforeclose | event, ui | 组件隐藏之前触发，可以通过e.preventDefault()来阻止 |
         * | select | event, date, ui | 选中日期的时候触发 |
         * | valuecommit | event, date, dateStr, ui | 当被设置日期后触发date为ate对象, dateStr为日期字符串|
         * | destroy | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);