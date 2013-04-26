/**
 * @file 日历组件
 * @name Calendar
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/calendar/calendar.html</qrcode>
 * 日历组件, 可以用来给一容器生成日历。
 * @import core/touch.js, core/zepto.ui.js, core/zepto.highlight.js
 */
(function($, undefined) {
    var monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
        "07月", "08月", "09月", "10月", "11月", "12月"],

        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,

        //获取月份的天数
        getDaysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },

        //获取月份中的第一天是所在星期的第几天
        getFirstDayOfMonth = function(year, month) {
            return new Date(year, month, 1).getDay();
        },

        //格式化数字，不足补零.
        formatNumber = function(val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        },

        getVal = function(elem) {
            return elem.is('select, input') ? elem.val() : elem.attr('data-value');
        },

        prototype;

    /**
     * @name $.ui.calendar
     * @grammar $.ui.calendar(options) ⇒ instance
     * @grammar calendar(options) ⇒ self
     * @desc **Options**
     * - ''date'' {Date|String}: (可选，默认：today) 初始化日期
     * - ''firstDay'' {Number}: (可选，默认：1)  设置新的一周从星期几开始，星期天用0表示, 星期一用1表示, 以此类推.
     * - ''minDate'' {Date|String}: (可选，默认：null)  设置可以选择的最小日期
     * - ''maxDate'' {Date|String}: (可选，默认：null)  设置可以选择的最大日期
     * - ''swipeable'' {Boolean}: (可选，默认：false)  设置是否可以通过左右滑动手势来切换日历
     * - ''monthChangeable'' {Boolean}: (可选，默认：false)  设置是否让月份可选择
     * - ''yearChangeable'' {Boolean}: (可选，默认：false)  设置是否让年份可选择
     * - ''events'' 所有[Trigger Events](#calendar_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/calendar/calendar.html">
     * ../gmu/_examples/widget/calendar/calendar.html
     * </codepreview>
     */
    $.ui.define('calendar', {
        _data: {
            date: null, //默认日期
            firstDay: 1, //星期天用0表示, 星期一用1表示, 以此类推.
            maxDate: null, //可以选择的日期范围
            minDate: null,
            swipeable: false,
            monthChangeable: false,
            yearChangeable: false
        },

        _create: function() {
            var el = this.root();

            //如果没有指定el, 则创建一个空div
            el = el || this.root($('<div></div>'));
            el.appendTo(this.data('container') || (el.parent().length ? '' : document.body));
        },

        _init: function() {
            var data = this._data,
                el = this._container || this.root(),
                eventHandler = $.proxy(this._eventHandler, this);

            this.minDate(data.minDate)
                .maxDate(data.maxDate)
                .date(data.date || new Date())
                .refresh();

            el.addClass('ui-calendar')
                .on('click', eventHandler)
                .highlight();

            data.swipeable && el.on('swipeLeft swipeRight', eventHandler);
        },

        _eventHandler: function(e) {
            var data = this._data,
                root = (this._container || this.root()).get(0),
                match,
                target,
                cell,
                date,
                elems;

            switch (e.type) {
                case 'swipeLeft':
                case 'swipeRight':
                    return this.switchMonthTo((e.type == 'swipeRight' ? '-' : '+') + '1M');

                case 'change':
                    elems = $('.ui-calendar-header .ui-calendar-year, ' +
                        '.ui-calendar-header .ui-calendar-month', this._el);

                    return this.switchMonthTo(getVal(elems.eq(1)), getVal(elems.eq(0)));

                default:
                    //click

                    target = e.target;

                    if ((match = $(target).closest('.ui-calendar-calendar tbody a', root)) && match.length) {

                        e.preventDefault();
                        cell = match.parent();

                        this._option('selectedDate',
                        date = new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));

                        this.trigger('select', [date, $.calendar.formatDate(date), this]);
                        this.refresh();
                    } else if ((match = $(target).closest('.ui-calendar-prev, .ui-calendar-next', root)) && match.length) {

                        e.preventDefault();
                        this.switchMonthTo((match.is('.ui-calendar-prev') ? '-' : '+') + '1M');
                    }
            }
        },

        /**
         * @ignore
         * @name option
         * @grammar option(key[, value]) ⇒ instance
         * @desc 设置或获取Option，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法。
         */
        _option: function(key, val) {
            var data = this._data,
                date, minDate, maxDate;

            //如果是setter
            if (val !== undefined) {

                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        data[key] = val ? $.calendar.parseDate(val) : null;
                        break;

                    case 'selectedDate':
                        minDate = data.minDate;
                        maxDate = data.maxDate;
                        val = $.calendar.parseDate(val);
                        val = minDate && minDate > val ? minDate : maxDate && maxDate < val ? maxDate : val;
                        data._selectedYear = data._drawYear = val.getFullYear();
                        data._selectedMonth = data._drawMonth = val.getMonth();
                        data._selectedDay = val.getDate();
                        break;

                    case 'date':
                        this._option('selectedDate', val);
                        data[key] = this._option('selectedDate');
                        break;

                    default:
                        data[key] = val;
                }

                //标记为true, 则表示下次refresh的时候要重绘所有内容。
                data._invalid = true;

                //如果是setter则要返回instance
                return this;
            }

            return key == 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
        },

        /**
         * 切换到今天所在月份。
         * @name switchToToday
         * @grammar switchToToday() ⇒ instance
         * @returns {*}
         */
        switchToToday: function() {
            var today = new Date();
            return this.switchMonthTo(today.getMonth(), today.getFullYear());
        },

        /**
         * @name switchMonthTo
         * @grammar switchMonthTo(month, year) ⇒ instance
         * @grammar switchMonthTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        switchMonthTo: function(month, year) {
            var data = this._data,
                minDate = this.minDate(),
                maxDate = this.maxDate(),
                offset,
                period,
                tmpDate;

            if ($.isString(month) && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period == 'm' ? offset : 0);
                year = data._drawYear + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }

            //Date有一定的容错能力，如果传入2012年13月，它会变成2013年1月
            tmpDate = new Date(year, month, 1);

            //不能跳到不可选的月份
            tmpDate = minDate && minDate > tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate : tmpDate;

            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();

            if (month != data._drawMonth || year != data._drawYear) {
                this.trigger('monthchange', [
                data._drawMonth = month, data._drawYear = year, this]);

                data._invalid = true;
                this.refresh();
            }

            return this;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 当修改option后需要调用此方法。
         */
        refresh: function() {
            var data = this._data,
                el = this._container || this.root(),
                eventHandler = $.proxy(this._eventHandler, this);

            //如果数据没有变化厕不重绘了
            if (!data._invalid) {
                return;
            }

            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            el.empty().append(this._generateHTML());
            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight('ui-state-hover');
            $('.ui-calendar-header select', el).on('change', eventHandler);
            data._invalid = false;
            return this;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy: function() {
            var el = this._container || this.root(),
                eventHandler = this._eventHandler;

            $('.ui-calendar-calendar td:not(.ui-state-disabled)', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            return this.$super('destroy');
        },

        /**
         * 重绘表格
         */
        _generateHTML: function() {
            var data = this._data,
                drawYear = data._drawYear,
                drawMonth = data._drawMonth,
                tempDate = new Date(),
                today = new Date(tempDate.getFullYear(), tempDate.getMonth(),
                tempDate.getDate()),

                minDate = this.minDate(),
                maxDate = this.maxDate(),
                selectedDate = this.selectedDate(),
                html = '',
                i,
                j,
                firstDay,
                day,
                leadDays,
                daysInMonth,
                rows,
                printDate;

            firstDay = (isNaN(firstDay = parseInt(data.firstDay, 10)) ? 0 : firstDay);

            html += this._renderHead(data, drawYear, drawMonth, minDate, maxDate) +
                '<table  class="ui-calendar-calendar"><thead><tr>';

            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;

                html += '<th' + ((i + firstDay + 6) % 7 >= 5 ?

                //如果是周末则加上ui-calendar-week-end的class给th
                ' class="ui-calendar-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }

            //添加一个间隙，样式需求
            html += '</thead></tr><tbody><tr class="ui-calendar-gap">' +
                '<td colspan="7">&#xa0;</td></tr>';

            daysInMonth = getDaysInMonth(drawYear, drawMonth);
            leadDays = (getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
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

        _renderHead: function(data, drawYear, drawMonth, minDate, maxDate) {
            var html = '<div class="ui-calendar-header">',

                //上一个月的最后一天
                lpd = new Date(drawYear, drawMonth, -1),

                //下一个月的第一天
                fnd = new Date(drawYear, drawMonth + 1, 1),
                i,
                max;

            html += '<a class="ui-calendar-prev' + (minDate && minDate > lpd ?
                ' ui-state-disable' : '') + '" href="#">&lt;&lt;</a><div class="ui-calendar-title">';

            if (data.yearChangeable) {
                html += '<select class="ui-calendar-year">';

                for (i = Math.max(1970, drawYear - 10), max = i + 20; i < max; i++) {
                    html += '<option value="' + i + '" ' + (i == drawYear ?
                        'selected="selected"' : '') + '>' + i + '年</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-year" data-value="' + drawYear + '">' + drawYear + '年' + '</span>';
            }

            if (data.monthChangeable) {
                html += '<select class="ui-calendar-month">';

                for (i = 0; i < 12; i++) {
                    html += '<option value="' + i + '" ' + (i == drawMonth ?
                        'selected="selected"' : '') + '>' + monthNames[i] + '</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-month" data-value="' + drawMonth + '">' + monthNames[drawMonth] + '</span>';
            }

            html += '</div><a class="ui-calendar-next' + (maxDate && maxDate < fnd ?
                ' ui-state-disable' : '') + '" href="#">&gt;&gt;</a></div>';
            return html;
        },

        _renderDay: function(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate) {

            var otherMonth = (printDate.getMonth() !== drawMonth),
                unSelectable;

            unSelectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);

            return "<td class='" + ((j + firstDay + 6) % 7 >= 5 ? "ui-calendar-week-end" : "") + // 标记周末

            (unSelectable ? " ui-calendar-unSelectable ui-state-disabled" : "") + //标记不可点的天

            (otherMonth || unSelectable ? '' : (printDate.getTime() === selectedDate.getTime() ? " ui-calendar-current-day" : "") + //标记当前选择
            (printDate.getTime() === today.getTime() ? " ui-calendar-today" : "") //标记今天
            ) + "'" +

            (unSelectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" +

            (otherMonth ? "&#xa0;" : (unSelectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" :
                "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") +
                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>";
        }
    });

    prototype = $.ui.calendar.prototype;

    //添加更直接的option修改接口
    $.each(['maxDate', 'minDate', 'date', 'selectedDate'], function(i, name) {
        prototype[name] = function(val) {
            return this._option(name, val);
        }
    });

    //补充注释

    /**
     * @name maxDate
     * @grammar maxDate([value]) ⇒ instance
     * @desc 设置或获取maxDate，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法。
     */

    /**
     * @name minDate
     * @grammar minDate([value]) ⇒ instance
     * @desc 设置或获取minDate，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法。
     */

    /**
     * @name date
     * @grammar date([value]) ⇒ instance
     * @desc 设置或获取当前date，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法。
     */

    /**
     * @name date
     * @grammar date([value]) ⇒ instance
     * @desc 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法。
     */


    //@todo 支持各种格式
    //开放接口，如果现有格式不能满足需求，外部可以通过覆写一下两个方法
    $.calendar = {

        /**
         * 解析字符串成日期格式对象。目前支持yyyy-mm-dd格式和yyyy/mm/dd格式。
         * @name $.calendar.parseDate
         * @grammar $.calendar.parseDate( str ) ⇒ Date
         */
        parseDate: function(obj) {
            var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
            return $.isDate(obj) ? obj : dateRE.test(obj) ? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)) : null;
        },

        /**
         * 格式化日期对象为字符串, 输出格式为yyy-mm-dd
         * @name $.calendar.formatDate
         * @grammar $.calendar.formatDate( date ) ⇒ String
         */
        formatDate: function(date) {
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        }
    }

    /**
     * @name Trigger Events
     * @theme event
     * @desc 组件内部触发的事件
     *
     * ^ 名称 ^ 处理函数参数 ^ 描述 ^
     * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
     * | select | event, date, dateStr, ui | 选中日期的时候触发 |
     * | monthchange | event, month, year, ui | 当当前现实月份发生变化时触发 |
     * | destroy | event | 组件在销毁的时候触发 |
     */

})(Zepto);