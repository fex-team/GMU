// Copyright (c) 2009-2013, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://gmu.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @import zepto.js
 */

var gmu = (function(){

    var staticlist = ['defaultOptions', 'template', 'tpl2html'];    //挂到组件类上的属性、方法
    var isString = function(obj){
        return Object.prototype.toString.call(obj) === '[object String]';
    };
    var isNull = function (obj){
        return obj === null;
    };
    var isUndefined = function (obj){
        return obj === undefined;
    };

    var record = (function(){
        var data = {},
            id = 0,
            iKey = "GMUWidget" + (+new Date()); //internal key.

        return function(obj, key, val){
            var dkey = obj[iKey] || (obj[iKey] = ++id),
                store = data[dkey] || (data[dkey] = {});

            !isUndefined(val) && (store[key] = val);
            isNull(val) && delete store[key];

            return store[key];
        }
    })();

    var dataAttr = function(el, attr){
        var attr_name = "data-" + attr;

        data = $(el).attr(attr_name);

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :
                    +data + "" === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test(data) ? JSON.parse(data):
                    data;
            } catch(e) {
                data = null;
            }
        }

        return data;
    };

    // 从DOM节点上获取配置项
    var getDomOptions = function(el, keys){
        var _result = {}, data;

        if(!el){
            return _result;
        }

        for(key in keys){
            data = dataAttr(el, key);
            data !== null && (_result[key] = data);
        }

        return _result;
    };

    /**
     * @desc 创建一个类，构造函数默认为init方法, superClass默认为gmu.Base
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    var createClass = function(object, superClass){
        if (typeof superClass != "function"){
            superClass = gmu.Base;
        }

        var fn = function(el, options){
            if ($.isPlainObject(el)) {
                options = el;
                el = undefined;
            }

            el && (this.$el = $(el));
            // options中存在container时，覆盖el
            options && options.container && (el = this.$el = $(options.container));

            if(typeof fn.defaultOptions === 'undefined'){
                fn.defaultOptions = {};
            }

            fn.defaultOptions.template = fn.template;
            fn.defaultOptions.tpl2html = fn.tpl2html;

            // 从el上获取option
            var dom_options = getDomOptions(el, fn.defaultOptions);

            var me = this;
            var options = me._options = $.extend({}, fn.defaultOptions, dom_options, options);

            // 将template和tpl2html挂到实例上
            if(options.template !== undefined){
                me.template = options.template;
            }
            if(options.tpl2html !== undefined){
                me.tpl2html = options.tpl2html;
            }

            //执行父类的构造函数
            superClass.apply(me, [el, options]);

            this.superClass = fn.superClass = superClass;

            // 初始化配置项监听
            if(fn.optioned){
                for(opt in fn.optioned){
                    if(options[opt]){
                        $(fn.optioned[opt]).each(function(i, item){
                            if(JSON.stringify(item[0]) === JSON.stringify(options[opt]) || item[0] === '*'){
                                item[1].call(me);
                            }
                        });
                    }
                }
            }
            
            // init方法是类的默认构造函数
            me._init.apply(me, options);

            // 组件初始化时才挂载插件，这样可以保证不同实例之间相互独立地使用插件
            for (i in fn.plugins) {
                var plugin = fn.plugins[i];
                // 插件的配置可能是button: true|false或者button: {enable: true|false, text: '确定'}或者button: {text: '确定'}
                // 插件默认开启
                var pluginOptions = (options[i] === undefined ? {enable: true} : options[i]);

                if(Object.prototype.toString.call(pluginOptions) === '[object Boolean]'){
                    pluginOptions = {enable: pluginOptions};
                }else if($.isPlainObject(pluginOptions)){
                    pluginOptions.enable = (pluginOptions.enable === false ? false : true)
                }

                if(pluginOptions.enable){
                    fn.plugins[i]._init.apply(me, pluginOptions);
                    $.each(plugin, function(key, val){
                        var originFunction;

                        if((originFunction = me[key]) && $.isFunction(val)){
                            me[key] = function(){
                                var _origin = me.origin;

                                me.origin = function(){
                                    originFunction.apply(me, arguments);
                                };
                                var result = val.apply(me,arguments);

                                _origin !== undefined && (me.origin = _origin);
                                return result;
                            };
                        }else{
                            me[key] = val;
                        }
                    });
                }
            }

            record(this.$el[0], fn._fullname_, me);

            me.on('destroy', function(){
                record(this.$el[0], fn._fullname_, null);
            });
            
            return me;
        };

        fn.extend = function(obj){
            $(staticlist).each(function(i, item){
                if(obj[item] !== undefined){
                    fn[item] = obj[item];
                    delete obj[item];
                }
            });

            $.extend(fn.prototype, obj);
        };

        fn.extend(superClass.prototype);

        fn.extend(object);

        /**
         * @name register
         * @grammar fn.register({})
         * @desc 注册插件
         */
        fn.register = function(name, obj){
            obj._init === undefined && (obj._init = function(){});
            (fn.plugins || (fn.plugins = {}))[name] = obj;
            
            return fn;
        };

        /**
         * @name inherits
         * @grammar fn.inherits({})
         * @desc 从该类继承出一个子类
         */
        fn.inherits = function(name, obj){
            // 子类必须有自己的init(构造函数)，否则会把从父类继承过来的init方法当成自己的构造函数
            obj._init === undefined && (obj._init = function(){});

            if(isString(name)){
                if(gmu[name]){
                    throw new Error('GMU中已存在该组件！'); 
                }else{
                    return (gmu[name] = createClass(obj, fn));
                }
            }else{  // 如果没有提供name，表示不挂到gmu下
                return createClass(obj, fn);
            }
        };

        /**
         * @name option
         * @grammar fn.option(option, value, method)
         * @desc 扩充组件的配置项
         */
        fn.optioned = {};
        // TODO value为Boolean的时候可以兼容插件
        fn.option = function(option, value, method){
            // TODO value支持function
            var covered = false;

            fn.defaultOptions[option] = value;

            if(!fn.optioned[option]){
                fn.optioned[option] = [];
            }

            // 如果已存在通配的选项(*)，不能继续添加其他选项，只能覆盖
            if(fn.optioned[option].length > 0 && fn.optioned[option][0][0] === '*' && value != '*'){
                return;
            }

            $(fn.optioned[option]).each(function(i, item){
                if(JSON.stringify(item[0]) === JSON.stringify(value)){
                    fn.optioned[option][i][1] = method;
                    covered = true;
                }
            });

            !covered && fn.optioned[option].push([value, method]);

            return fn;
        }

        return fn;
    };


    var _zeptoLize = function(name){
        $.fn[name.toLowerCase()] = function(opts) {
            var ret,
                obj,
                args = Array.prototype.slice.call(arguments, 1);

            $.each(this, function(i, el){

                obj = record(el, name) || new gmu[name]( el, $.extend($.isPlainObject(opts) ? opts : {}, {setup: true}));

                if (isString(opts)) {
                    if (!$.isFunction( obj[ opts ] ) && opts !== 'this') {
                        throw new Error('组件没有此方法：' + opts);    //当不是取方法时，抛出错误信息
                    }
                    ret = $.isFunction( obj[ opts ] ) ? obj[opts].apply(obj, args) : undefined;
                }
                if( ret !== undefined && ret !== obj || opts === "this" && ( ret = obj ) ) {
                    return false;
                }
                ret = undefined;
            });

            return ret !== undefined ? ret : this;
        };
    };

    return {
        version: '2.1.0.0',

        /**
         *  @desc 只支持单继承
         */
        define: function(name, object, superClass){
            if(/\./.test(name)){
                return;
            }
            gmu[name] = createClass(object, superClass);
            gmu[name]._fullname_ = name;

            var old = $.fn[name.toLowerCase()];
            _zeptoLize(name);

            /* NO CONFLICT 
             * var gmuPanel = $.fn.panel.noConflict();
             * gmuPanel.call(test, 'fnname');
             */
            $.fn[name.toLowerCase()].noConflict = function () {
                $.fn[name.toLowerCase()] = old;
                return this;
            }
        }
    };
})();

// 向下兼容
$.ui = gmu;
