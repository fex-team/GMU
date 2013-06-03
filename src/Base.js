
/**
 * GMU组件的基类
 * @class
 * @name gmu.Base
 */
gmu.Base = function(){};

gmu.Base.prototype = {

    /**
     *  @override
     *  @name _init
     *  @grammar instance._init() => instance
     *  @desc 组件的初始化方法，子类需要重写该方法
     */
    _init: function(){},

    /**
     *  @name getEl
     *  @grammar instance.getEl() => $el
     *  @desc 返回组件的$el
     */
    getEl: function(){
        return this.$el;
    },

    /**
     * @name on
     * @grammar instance.on(name, callback, context) => instance
     * @desc 订阅事件
     */
    on: function(name, callback, context) {
        if(!name){
            return false;
        }
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({callback: callback, context: context, ctx: context || this});

        return this;
    },

    /**
     * @name off
     * @grammar instance.off(name, callback, context) => instance
     * @desc 解除订阅事件
     */
    off: function(name, callback, context) {
        var retain, ev, events, names, i, l, j, k;
        if (!name) {
            this._events = {};
            return this;
        }

        // TODO 如果没有传name，需要将_options中的所有自定义事件监听函数全部删除
        for(var i in this._options){
            if(i === ev || (!ev && /.*:.*/.test(i)))
                delete this._options[i];
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
     * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
     * options上回调函数可以通过e.preventDefaualt()来阻止事件派发。
     */
     // TODO 如果其中某个事件处理返回false，不继续执行
    trigger: function(name) {
        if(!this._events || !name){
            return this;
        }

        var args = Array.prototype.slice.call(arguments, 1),
            events = this._events[name],
            opEvent = this._options[name],
            result;

        if(opEvent && $.isFunction(opEvent)){
            result = opEvent.apply(this, args);
            if(result === false){
                return this;
            }
        }

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
        var me = this;
        
        this.trigger('destroy');
    }
};