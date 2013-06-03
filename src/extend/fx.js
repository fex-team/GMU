/**
 * @file
 * @ignore
 * @name Fx
 * @desc 扩展animate，使其具有队列功能
 * @import zepto.js
 */
(function ($, undefined) {
    var speeds = {_default: 400, fast: 200, slow: 600},
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transformr = /transform$/i,
        prefix = $.fx.cssPrefix,
        clearProperties = {};

    clearProperties[prefix + 'transition-property'] =
        clearProperties[prefix + 'transition-duration'] =
            clearProperties[prefix + 'transition-timing-function'] =
                clearProperties[prefix + 'animation-name'] =
                    clearProperties[prefix + 'animation-duration'] = '';

    /**
     * 队列类定义
     */
    function Queue() {
        this.length = 0;
        this._act = null;
    }

    /**
     * 给类扩展push, shift, unshift, clear方法
     */
    $.extend(Queue.prototype, {
        push:Array.prototype.push,
        shift:Array.prototype.shift,
        unshift:Array.prototype.unshift,
        clear:function () {
            Array.prototype.splice.apply(this, [0, this.length]);
        }
    });

    /**
     * 通过dom对象获取Queue对象, 一个dom对象对应一个Queue对象，一个dom对象只实例化一个Queue对象
     */
    function _getQueueInstance(elem) {
        var _instance;
        (_instance = elem.data('_fx_queue')) || elem.data('_fx_queue', (_instance = new Queue()));
        return  _instance instanceof Queue ? _instance : null;
    }

    /**
     * 添加方法到Queue对象
     */
    function _add_queue(_instance, fn, elem) {
        // wrap传入的fn, 主要是为了在调用的时候，加入next方法作为第一个形参传入到fn里面。
        var wrap = function () {
            _instance.unshift('inprogress');
            $.isFunction(wrap.start) && wrap.start.call(wrap.elem);
            fn.apply(wrap.elem, [function () {//next 方法
                if (wrap === _instance._act) {
                    _instance._act = null;
                    if (_instance[0] === 'inprogress') {
                        _instance.shift();
                    }
                    $.later(function () {
                        _continue(_instance);
                    }, 0);
                }
            }]);
        };

        /**
         * start 在此成员执行之前执行
         * stop 当$.stop执行的时候，会调用这个stop方法
         * abort 当调用$.dequeue的时候会调用这个方法, 目前还没想好是否有用
         * elem 保存elem对象，将会作为start, stop, abort的执行者。
         */
        $.each(['start', 'stop', 'abort'], function (index, key) {
            wrap[key] = fn[key];
            delete fn[key];
        });
        wrap.elem = elem;
        _instance.push(wrap);
    }

    /**
     * 继续下一个方法
     */
    function _continue(_instance) {
        if (_instance[0] === 'inprogress') return;
        var act = _instance._act = _instance.shift();
        $.isFunction(act) && act();
    }

    /**
     * @desc 往队列中添加成员，或读取队列，或替换队列. 见{@link queue}.
     * @name $.queue
     * @grammar  $.queue($el)   ⇒ array
     * @grammar  $.queue($el, fn)   ⇒ $el
     * @grammar  $.queue($el, data)   ⇒ $el
     * @param   {Element}           elem zepto对象
     * @param   {Function|Array}    data 可以是一个fn, 也可以是一个数组，如果是数组就会替换队列
     * @return  {Element|Array}    返回Zepto对象,或者队列数组，如果data传入的是fn，则放回Zepto对象，否则返回当前队列数组
     * @example var div = $('div');
     * div.animate({left:200});
     * console.log($.queue(div));// => [fn] 返回指定元素中的队列集合
     *
     * $.queue(div, function(next){ // 往队列中插入一个动作
     *     next();
     * });
     *
     * $.queue(div, [function(next){
     *      //队列中的第一个成员
     * }, function(){
     *      //队列中的第二个成员
     * }, function(){
     *      //队列中的第三个成员
     * }]);//替换这个队列
     */
    $.queue = function (elem, data) {
        var _instance = _getQueueInstance(elem);

        if (!_instance) {
            return elem;
        }
        if ($.isFunction(data)) {

            _add_queue(_instance, data, elem);

        } else if ($.isArray(data)) {

            _instance.clear();

            $.each(data, function (key, val) {
                _add_queue(_instance, val, elem);
            });

        }
        setTimeout(function () {
            _continue(_instance);
        }, 0);

        return data === undefined ? _instance : elem;
    };

    /**
     * @desc 继续队列，如果队列当前成员没有执行完毕，则直接跳过. 见{@link dequeue}.
     * @name $.dequeue
     * @grammar $.dequeue($el)   ⇒ $el
     * @param  {Element} elem Zepto对象
     * @return {Element} 返回Zepto对象
     * @example var div = $('div');
     * div.animate({left: 200});
     *
     * div.queue(function(next){
     *  //do something
     *  $.dequeue(div);//停止队列中的当前成员，继续队列的下一个
     * });
     */
    $.dequeue = function (elem) {
        var _instance = _getQueueInstance(elem), inprogress, act;

        if (!_instance) return elem;

        while (_instance[0] === 'inprogress') {
            inprogress = true;
            _instance.shift();
        }
        inprogress && (act = _instance._act) && act.abort && act.abort.call(act.elem);

        _continue(_instance);
        return elem;
    };

    /**
     * @desc 清楚队列. 见{@link clearQueue}.
     * @name $.clearQueue
     * @grammar  $.clearQueue($el)   ⇒ $el
     * @param  {Element} elem Zepto对象
     * @return {Element} 返回Zepto对象
     * @example var div = $('div');
     * div.animate({left:200});
     * div.animate({top:200});
     *
     * $('a').on('click', function(e){
     *     $.clearQueue(div);//队列中的当前成员，执行完后，就停止。
     * });
     */
    $.clearQueue = function (elem) {
        var _instance = _getQueueInstance(elem);

        if (_instance) {
            _instance.clear();
        }

        return elem
    };

    // 将fast, slow转化成对应的时间
    function _translateSpeed(speed, second) {
        var val = typeof speed == 'number' ? speed : (speeds[speed] || speeds._default);
        return second ? val / 1000 : val;
    }

    $.extend($.fn, {
        /**
         * @desc 覆写Zepto中的{@link[http://zeptojs.com/#animate] animate}，让其默认以队列方式运行, 同时可以设置queue为false来关闭此功能。
         * @name animate
         * @grammar animate(properties, [duration, [easing, [function(){ ... }]]])  ⇒ self
         * @grammar animate(properties, { duration: msec, easing: type, complete: fn })  ⇒ self
         * @grammar animate(animationName, { ... })  ⇒ self
         * @example var div = $('div');
         * div.animate({left: 200});
         * div.animate({top: 200}); //动画2会在动画1执行完后才执行
         *
         * div.animate({top:500}, {queue: false})//由于设置了queue为false，所以此动画马上就会开始执行
         */
        animate:function (properties, duration, ease, callback) {
            var me = this, timer, wrapCallback, start, queue, endEvent;

            if ($.isObject(duration)) {
                ease = duration.easing;
                callback = duration.complete;
                start = duration.start;
                queue = duration.queue;
                duration = duration.duration;
            }

            duration = _translateSpeed(duration, false);
            if (duration) duration = duration / 1000;

            if (queue === false) {
                return me.anim(properties, duration, ease, callback);
            }

            endEvent = $.fx.transitionEnd;
            if (typeof properties == 'string') {
                endEvent = $.fx.animationEnd;
            }

            wrapCallback = function (next) {
                var _executed = false,
                    _fn = function () {
                        if (_executed) return;//保证fn只执行一次
                        _executed = true;
                        timer && clearTimeout(timer);

                        callback && callback.apply(me, arguments);
                        next();
                    };
                me.anim(properties, duration, ease, _fn);
                //如果当前样式值与目标样式值一致，transitionEnd事件不会派送, 所以这里做个timeout，确保next方法会执行。
                //todo 找个更好的方法解决这个问题
                duration && (timer = setTimeout(_fn, duration * 1000 + 500)); //这里有500ms差时
            };

            wrapCallback.start = start;

            //主要用来停下动画的，css transition队列，停止的方法是把样式值设成当前值，然后吧transition给清除了
            wrapCallback.stop = function (jumpToEnd) {
                var props = {},
                    hasTransfrom = false,
                    cur;

                timer && clearTimeout(timer);

                if (!jumpToEnd) {
                    cur = getComputedStyle(this[0], '');
                    $.each(properties, function (key) {
                        if (supportedTransforms.test(key) || transformr.test(key)) {
                            hasTransfrom = true;
                        } else {
                            props[key] = cur[key] || '';
                        }
                    });
                    //todo 支持其他非webkit浏览器
                    hasTransfrom && (props[prefix + 'transform'] = cur['WebkitTransform']);
                }
                //todo 只解除zepto中anim里面的wrappedCallback
                me.unbind(endEvent);

                me.css($.extend(props, clearProperties));
                jumpToEnd && callback && callback();
            };
            return $.queue(me, wrapCallback)
        },

        /**
         * @desc 往队列中添加一个指定时间的延时
         * @name     delay
         * @grammar  delay(duration)  ⇒ self
         * @param    {Number}    duration 指定延时时间
         * @return   {Element}   返回Zepto对象
         * @example var div = $(div);
         * div.animate({top:100}).delay(1000).animate({left:100});
         * //动画3，在动画1执行完了后，1秒钟才执行
         */
        delay:function (duration) {
            var timer, _fn = function(next){
                timer = setTimeout(next, duration);
            };
            _fn.stop = function(){
                timer && clearTimeout(timer);
            };
            return $.queue(this, _fn);
        },

        /**
         * @desc 停止当前动画
         *
         * **参数**
         * - ***clearQueue***  *可选(默认 true)* 标记是否清除队列
         * - ***jumpToEnd***  *可选(默认 false)* 停止当前动画时，是否将动画直接执行完毕，而不是在当前位置停止
         *
         * @name stop
         * @grammar  stop([clearQueue[, jumpToEnd]])  ⇒ self
         * @example var div = $('div');
         * div.animate({left:200})
         *    .animate({left: 400});
         *
         * $('a').on('click', function(){
         *      div.stop();//停止动画
         * });
         */
        stop:function (clearQueue, jumpToEnd) {
            var _instance = _getQueueInstance(this), act;
            if (_instance) {
                clearQueue === undefined && (clearQueue = true );
                clearQueue && this.clearQueue();
                act = _instance._act;
                if (act) {
                    _instance._act = null;
                    $.isFunction(act.stop) && act.stop.call(act.elem, jumpToEnd);
                }
                if (!clearQueue) {
                    this.dequeue();
                }
            }
            return this;
        },

        /**
         * @desc 往队列中添加成员
         * @function
         * @name queue
         * @grammar  queue()   ⇒ array
         * @grammar  queue(fn)   ⇒ self
         * @grammar  queue(data)   ⇒ self
         * @example var div = $('div');
         * div.animate({left:200});
         * console.log(div.queue());// => [fn] 返回指定元素中的队列集合
         *
         * div.queue(function(next){ // 往队列中插入一个动作
         *     next();
         * });
         *
         * div.queue([function(next){
         *      //队列中的第一个成员
         * }, function(){
         *      //队列中的第二个成员
         * }, function(){
         *      //队列中的第三个成员
         * }]);//替换这个队列
         */
        queue:function (data) {
            return $.queue(this, data);
        },

        /**
         * @desc 继续队列，如果队列当前成员没有执行完毕，则直接跳过
         * @name dequeue
         * @grammar dequeue   ⇒ self
         * @example var div = $('div');
         * div.animate({left: 200});
         *
         * div.queue(function(next){
         *  //do something
         *  div.dequeue();//停止队列中的当前成员，继续队列的下一个
         * });
         */
        dequeue:function () {
            return $.dequeue(this);
        },

        /**
         * @desc 清空队列
         * @name        clearQueue
         * @grammar  queue(fn)   ⇒ self
         * @example var div = $('div');
         * div.animate({left:200});
         * div.animate({top:200});
         *
         * $('a').on('click', function(e){
         *     $.clearQueue(div);//队列中的当前成员，执行完后，就停止。
         * });
         */
        clearQueue:function () {
            return $.clearQueue(this);
        }

    }, false);

    $.extend($.fx, {
        speeds:speeds
    });
})(Zepto);