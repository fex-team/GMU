
/**
 * GMU组件的基类
 * @class
 * @name gmu.Base
 */
gmu.Base = function(){};
var blankFn = function(){};
gmu.Base.prototype = {

    /**
     *  @override
     *  @name _init
     *  @grammar instance._init() => instance
     *  @desc 组件的初始化方法，子类需要重写该方法
     */
    _init: function(){},

    /**
     *  @override
     *  @name _create
     *  @grammar instance._create() => instance
     *  @desc 组件创建DOM的方法，子类需要重写该方法
     */
    _create: function(){},


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

        // triggerHandler不冒泡
        this.$el.triggerHandler(name, args);

        return this;
    },

    /**
     * @name destroy
     * @grammar instance.destroy()
     * @desc 注销组件
     */
    destroy: function() {
        // 解绑所有自定义事件
        this.off();
        for (var pro in this ) {
            if ( !$.isFunction(this[pro]) ){
                delete this[pro];
            } else {
                this[pro] = blankFn;
            }
        }

        this.trigger('destroy');
        this.disposed = true;
    }
};