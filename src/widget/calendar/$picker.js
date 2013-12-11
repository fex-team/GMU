/**
 * @file Calendar Picker插件
 * @desc 默认的Calendar组件，只是在指定容器上生成日历功能，与表单元素的交互功能在此插件中体现.
 * selector将会被认为是可赋值对象，当确认按钮点击后，所选的日期会赋值给selector。
 * @module GMU
 * @import widget/calendar/calendar.js, extend/event.ortchange.js
 */
(function( gmu, $ ) {
    function SlideUp(div, cb) {
        var
            //用来记录div的原始位置的
            holder = $('<span class="ui-holder"></span>'),

            //dom
            root = $('<div class="ui-slideup-wrap">' +
                '   <div class="ui-slideup">' +
                '       <div class="header">' +
                '           <span class="ok-btn">确认</span>' +
                '           <span class="no-btn">取消</span>' +
                '       </div>' +
                '       <div class="frame"></div>' +
                '   </div>' +
                '</div>'),
            sDiv = $('.ui-slideup', root),
            frame = $('.frame', sDiv),

            //对外只公开refresh和close方法
            obj = {

                /**
                 * 刷新日历显示，当屏幕旋转的时候时候需要外部调用
                 */
                refresh: function( callback ){
                    root.css({
                        top: window.pageYOffset + 'px',
                        height: window.innerHeight + 'px'
                    });

                    sDiv.animate({
                        translateY: '-' + sDiv.height() + 'px',
                        translateZ: '0'
                    }, 400, 'ease-out', function () {
                        callback && callback.call(obj);
                    });

                },

                /**
                 * 关闭日历
                 */
                close: function( callback ){
                    var count = SlideUp.count = SlideUp.count - 1;

                    root.off('click.slideup' + id);

                    sDiv
                        .animate({
                            translateY: '0',
                            translateZ: '0'
                        }, 200, 'ease-out', function () {
                            callback && callback();

                            //还原div的位置
                            holder.replaceWith(div);

                            //销毁
                            root.remove();
                            count === 0 && $(document).off('touchmove.slideup');
                        })
                        .find('.ok-btn, .no-btn')
                        .highlight();

                    return obj;
                }
            },

            //为了解绑事件用的
            id = SlideUp.id = ( SlideUp.id >>> 0 ) + 1,

            //记录当前弹出了多少次
            count;

        frame.append( div.replaceWith( holder ) );

        count = SlideUp.count = ( SlideUp.count >>> 0 ) + 1;

        //弹出多个时，只会注册一次
        count === 1 && $(document).on('touchmove.slideup', function (e) {

            //禁用系统滚动
            e.preventDefault();
        });

        root
            .on('click.slideup' + id, '.ok-btn, .no-btn', function () {
                cb.call(obj, $(this).is('.ok-btn')) !== false && obj.close();
            })
            .appendTo(document.body)
            .find('.ok-btn, .no-btn')
            .highlight('ui-state-hover');

        obj.refresh();

        return obj;
    }

    /**
     * Calendar Picker插件
     *
     * 默认的Calendar组件，只是在指定容器上生成日历功能，与表单元素的交互功能在此插件中体现.
     * selector将会被认为是可赋值对象，当确认按钮点击后，所选的日期会赋值给selector。
     *
     * @class picker
     * @namespace Calendar
     * @pluginfor Calendar
     */
    gmu.Calendar.register( 'picker', {

        _create: function () {
            var el = this.$el;

            if( !el ) {
                throw new Error("请指定日期选择器的赋值对象");
            }
        },

        _init: function(){
            var el = this.$el,
                opts = this._options;

            this._container = $('<div></div>');

            //如果有初始值，则把此值赋值给calendar
            opts.date || (opts.date = el[el.is('select, input')?'val':'text']());

            $(window).on('ortchange', $.proxy(this._eventHandler, this));
            this.on('commit', function(e, date){
                var str = $.calendar.formatDate(date);

                el[el.is('select, input')?'val':'text'](str);
            });

            this.on('destroy', function(){
                //解绑ortchange事件
                $(window).off('ortchange', this._eventHandler);
                this._frame && this._frame.close();
            });
        },

        _eventHandler: function(e){
            if(e.type === 'ortchange') {
                this._frame && this._frame.refresh();
            }else {
                this.origin( e );
            }
        },

        /**
         * 显示组件
         * @method show
         * @grammar show() ⇒ instance
         * @param {Function} [callback] 刷新之后的回调函数
         * @for Calendar
         * @uses Calendar.picker
         */
        show: function(){
            var me = this,
                el;

            if( this._visible ) {
                return this;
            }

            el = this._container;

            this._visible = true;
            this.refresh();
            this._frame = SlideUp(el, function( confirm ){
                var date;
                if( confirm) {
                    date = me._option('selectedDate');
                    me.trigger('commit', date, $.calendar.formatDate(date), me);
                    me._option('date', date);
                } else {
                    me._option('selectedDate', me._option('date'));
                }
                me.hide();
                return false;
            });
            return this.trigger('show', this);
        },

        /**
         * 隐藏组件
         * @method hide
         * @grammar hide() ⇒ instance
         * @param {Function} [callback] 刷新之后的回调函数
         * @for Calendar
         * @uses Calendar.picker
         */
        hide: function(){
            var me = this,
                event;

            if (!this._visible) {
                return this;
            }

            event = new gmu.Event('beforehide');
            this.trigger(event, this);

            //如果外部阻止了此事件，则停止往下执行
            if(event.isDefaultPrevented()){
                return this;
            }

            this._visible = false;

            this._frame.close(function(){
                me.trigger && me.trigger('hide');
            });

            this._frame = null;

            return this;
        }

        /**
         * @event show
         * @param {Event} e gmu.Event对象
         * @param {Calendar} ui widget实例
         * @description 当组件显示后触发
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event hide
         * @param {Event} e gmu.Event对象
         * @param {Calendar} ui widget实例
         * @description 当组件隐藏后触发
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event beforehide
         * @param {Event} e gmu.Event对象
         * @param {Calendar} ui widget实例
         * @description 组件隐藏之前触发，可以通过e.preventDefault()来阻止
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event commit
         * @param {Event} e gmu.Event对象
         * @param {Date} date 选中的日期
         * @param {String} dateStr 选中的日期字符格式
         * @param {Calendar} ui widget实例
         * @description 但确认选择某个日期的时候触发
         * @for Calendar
         * @uses Calendar.picker
         */
    } );

})( gmu, gmu.$ );
