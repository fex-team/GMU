
/**
 * GMU组件的基类
 * @class
 * @name gmu.Base
 */
gmu.Base = function(){
    // gmu Base constructor
};

gmu.Base.prototype = {

    /**
     *  @override
     *  @name init
     *  @grammar instance.init() => instance
     *  @desc 组件的初始化方法，子类需要重写该方法
     */
    init: function(){},

    /**
     * @name trigger
     * @grammar instance.trigger(type[, data]) => instance
     * @desc 触发事件, 此trigger会优先把options上的事件回调函数先执行，然后给根DOM派送事件。
     * options上回调函数可以通过e.preventDefaualt()来组织事件派发。
     */
    trigger: function(event, data) {
        // TODO 换成$.isString
        event = Object.prototype.toString.call(event) === '[object String]' ? $.Event(event) : event;
        var onEvent = this._options[event.type],result;
        if(onEvent && $.isFunction(onEvent)){
            event.data = data;
            result = onEvent.apply(this, [event].concat(data));
            if(result === false || event.defaultPrevented){
                return this;
            }
        }
        this.$el.trigger(event, data);
        return this;
    },

    /**
     * @name on
     * @grammar instance.on(type, handler) => instance
     * @desc 绑定事件
     */
    on: function(ev, callback) {
        this.$el.on(ev, $.proxy(callback, this));
        return this;
    },

    /**
     * @name bind
     * @grammar instance.bind(type, handler) => instance
     * @desc 给某个元素绑定事件，destroy时会自动解绑
     */
    bind: function(el, event, fn){
        $(el).on(event, fn);
        
        !this.disposeProcess && this.disposeProcess = [];
        this.disposeProcess.unshift(function(){
            $(el).off(event, fn);
        });
        
        return this;
    },

    /**
     * @name off
     * @grammar instance.off(type) => instance
     * @grammar instance.off(type, handler) => instance
     * @desc 解绑事件
     */
    off: function(ev, callback) {
        this.$el.off(ev, callback);
        return this;
    },

    /**
     * @name subscribe
     * @grammar instance.subscribe(name, callback, context) => instance
     * @desc 订阅事件
     */
    subscribe: function(name, callback, context) {
        if(!name){
            return false;
        }
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});
        return this;
    },

    /**
     * @name unsubscribe
     * @grammar instance.unsubscribe(name, callback, context) => instance
     * @desc 解除订阅事件
     */
    unsubscribe: function(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!name){
            return false;
        }
        if (!name && !callback && !context) {
            this._events = {};
            return this;
        }

        if (events = this._events[name]) {
            this._events[name] = retain = [];
            if (callback || context) {
                for (j = 0, k = events.length; j < k; j++) {
                    ev = events[j];
                    if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                        (context && context !== ev.context)) {
                        retain.push(ev);
                    }
                }
            }
            if (!retain.length) delete this._events[name];
        }

        return this;
    },

    /**
     * @name publish
     * @grammar instance.publish(name) => instance
     * @desc 解除订阅事件
     */
    publish: function(name) {
        if(!this._events || !name){
            return this;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this._events[name];
        if (events){
            var ev, i = -1, l = events.length;
            while (++i < l)
                (ev = events[i]).callback.apply(ev.ctx, args);
        };
        return this;
    },

    /**
     * @name destroy
     * @grammar instance.destroy()
     * @desc 注销组件
     */
    destroy: function() {
        // TODO setup模式不移除DOM，render模式移除DOM

        var me = this;
        
        for(var i = 0, l = this.disposeProcess.length; i < l; i ++)
            this.disposeProcess[i].call(this);
        
        this.trigger('destroy');
    }
};