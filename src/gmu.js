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

(function(window, undefined) {

    // 工具集
    var util = {
            isString: function( obj ) {
                return Object.prototype.toString.call( obj ) === '[object String]';
            },
            isNull: function( obj ) {
                return obj === null;
            },
            isUndefined: function( obj ) {
                return obj === undefined;
            },
            blankFn: function(){},
            dataAttr: function( el, attr ) {
                var attrName = 'data-' + attr,
                    data = el.getAttribute( attrName );

                if ( typeof data === 'string' ) {
                    try {
                        data = data === 'true' ? true :
                            data === 'false' ? false :
                            data === 'null' ? null :
                            +data + '' === data ? +data :
                            /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ? JSON.parse( data ):
                            data;
                    } catch ( ex ) {
                        data = null;
                    }
                }

                return data;
            },
            // 从DOM节点上获取配置项
            getDomOptions: function( el, keys ) {
                var _result = {},
                    data;

                if ( !el ) {
                    return _result;
                }

                el = $(el)[0];

                for ( var key in keys ) {
                    if( !keys.hasOwnProperty(key) ) {
                        return;
                    }
                    data = util.dataAttr( el, key );
                    data !== null && (_result[ key ] = data);
                }

                return _result;
            },
            // 返回字符串的首字母小写形式
            getFnName: function( name ) {
                return name.replace(/^([a-zA-Z])(.*)/, function($1, $2, $3){
                    return $2.toLowerCase() + $3;
                });
            }
        },
        _zeptoLize = function( name ){
            $.fn[util.getFnName( name )] = function( opts ) {
                var ret,
                    obj,
                    args = Array.prototype.slice.call( arguments, 1 );

                $.each( this, function( i, el ) {

                    obj = record( el, name ) || new gmu[name]( el, $.extend($.isPlainObject(opts) ? opts : {}, {setup: true}) );

                    if ( util.isString( opts ) ) {
                        if ( !$.isFunction( obj[ opts ] ) && opts !== 'this' ) {
                            throw new Error('组件没有此方法：' + opts);    //当不是取方法时，抛出错误信息
                        }
                        ret = $.isFunction( obj[ opts ] ) ? obj[opts].apply(obj, args) : undefined;
                    }
                    if ( ret !== undefined && ret !== obj || opts === "this" && ( ret = obj ) ) {
                        return false;
                    }
                    ret = undefined;
                });

                return ret !== undefined ? ret : this;
            };
        },
        // 挂到组件类上的属性、方法
        staticlist = [ 'options', 'template', 'tpl2html' ],
        record = (function() {
            var data = {},
                id = 0,
                iKey = 'GMUWidget' + (+new Date());    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ iKey ] || (obj[ iKey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                !util.isUndefined( val ) && (store[ key ] = val);
                util.isNull( val ) && delete store[ key ];

                return store[ key ];
            };
        })(),
        /**
         * @desc 创建一个类，构造函数默认为init方法, superClass默认为gmu.Base
         * @name createClass
         * @grammar createClass(object[, superClass]) => fn
         */
        createClass = function( object, superClass ) {
            if ( typeof superClass !== 'function' ) {
                superClass = gmu.Base;
            }

            var widgetInit = object._init || util.blankFn,
                fn = function( el, options ){
                    var me = this;

                    if ( $.isPlainObject( el ) ) {
                        options = el;
                        el = undefined;
                    }
                    el && ( this.$el = $( el ) );
                    // options中存在container时，覆盖el
                    options && options.container && (el = this.$el = $( options.container ));

                    if(typeof fn.options === 'undefined'){
                        fn.options = {};
                    }

                    fn.options.template = fn.template;
                    fn.options.tpl2html = fn.tpl2html;

                    // 从el上获取option
                    var dom_options = util.getDomOptions( el, fn.options );
                    var options = me._options = $.extend( {}, fn.options, dom_options, options );

                    // 将template和tpl2html挂到实例上
                    if( options.template !== undefined ){
                        me.template = options.template;
                    }
                    if( options.tpl2html !== undefined ){
                        me.tpl2html = options.tpl2html;
                    }

                    // 执行父类的构造函数
                    superClass.apply( me, [ el, options ] );
                    this.superClass = fn.superClass = superClass;

                    // 初始化配置项监听
                    if( fn._optioned ){
                        for( var opt in fn._optioned ){
                            if( !fn._optioned.hasOwnProperty(opt) ) {
                                return;
                            }
                            if( options[ opt ] ){
                                $( fn._optioned[ opt ] ).each( function( i, item ){
                                    if ( ($.isFunction( item[0] ) &&  item[0].call(me)) || item[0] === options[ opt ] || item[0] === '*' ) {
                                        item[ 1 ].call( me );
                                    }
                                });
                            }
                        }
                    }
                    
                    widgetInit.call( me, options );

                    // 组件初始化时才挂载插件，这样可以保证不同实例之间相互独立地使用插件，默认开启
                    for ( var i in fn.plugins ) {
                        if( !fn.plugins.hasOwnProperty(i) ) {
                            return;
                        }
                        var plugin = fn.plugins[ i ];

                        if ( options[i] !== false ){
                            fn.plugins[i]._init.call( me );
                            $.each( plugin, function( key, val ) {
                                var originFunction;

                                if ( ( originFunction = me[key] ) && $.isFunction( val ) ) {
                                    me[key] = function() {
                                        var _origin = me.origin,
                                            result;

                                        me.origin = originFunction;
                                        result = val.apply( me, arguments );

                                        if( _origin !== undefined ) {
                                            me.origin = _origin;
                                        } else {
                                            delete me.origin;
                                        }
                                        return result;
                                    };
                                }else{
                                    me[key] = val;
                                }
                            });
                        }
                    }

                    // 进行创建DOM等操作
                    me._create();

                    record( this.$el[0], fn._fullname_, me );

                    me.on( 'destroy', function() {
                        record(this.$el[0], fn._fullname_, null);
                    } );
                    
                    return me;
                };

            $.extend( fn, {
                extend: function( obj ){
                    $( staticlist ).each( function( i, item ){
                        if(obj[item] !== undefined){
                            fn[item] = obj[item];
                            delete obj[item];
                        }
                    } );

                    $.extend( fn.prototype, obj );
                },

                /**
                 * @name register
                 * @grammar fn.register({})
                 * @desc 注册插件
                 */
                register: function( name, obj ){
                    obj._init === undefined && ( obj._init = function(){} );
                    ( fn.plugins || ( fn.plugins = {} ) )[name] = obj;
                    
                    return fn;
                },

                /**
                 * @name inherits
                 * @grammar fn.inherits({})
                 * @desc 从该类继承出一个子类，不会被挂到gmu命名空间
                 */
                inherits: function( obj ){
                    return createClass( obj, fn );
                },

                /**
                 * @name option
                 * @grammar fn.option(option, value, method)
                 * @desc 扩充组件的配置项
                 */
                _optioned: {},
                option: function( option, value, method ){
                    var covered = false;

                    fn.options[option] = value;

                    if ( !fn._optioned[option] ) {
                        fn._optioned[option] = [];
                    }

                    $( fn._optioned[option] ).each( function( i, item ){
                        if ( item[0] === value ) {
                            fn._optioned[option][i][1] = method;
                            covered = true;
                        }
                    } );

                    !covered && fn._optioned[option].push( [value, method] );

                    return fn;
                }
            } );
            
            fn.prototype = Object.create( superClass.prototype );
            fn.extend( object );

            // 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
            fn.prototype.$super = function( name ) {
                var fn = superClass.prototype[name];
                return $.isFunction(fn) ? fn.apply(this, Array.prototype.slice.call(arguments, 1)) : fn;
            };

            return fn;
        };

    window.gmu = {
        version: '2.1.0.0',

        /**
         *  @desc 定义一个gmu组件，只支持单继承
         */
        define: function( name, object, superClass ) {
            if ( /\./.test( name ) ) {
                return;
            }

            var fnName = util.getFnName( name );

            gmu[name] = createClass( object, superClass );
            gmu[name]._fullname_ = name;

            var old = $.fn[fnName];
            _zeptoLize( name );

            /* NO CONFLICT 
             * var gmuPanel = $.fn.panel.noConflict();
             * gmuPanel.call(test, 'fnname');
             */
            $.fn[fnName].noConflict = function () {
                $.fn[fnName] = old;
                return this;
            }
        }
    };
})(window);

// 向下兼容
$.ui = gmu;

(function(gmu) {
    var blankFn = function(){},
        Event = function( name ) {
            return {
                type: name,
                returnValue: true
            };
        };
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
        on: function( name, callback, context ) {
            if ( !name ) {
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
        off: function( name, callback, context ) {
            var retain, ev, events, names, i, l, j, k;
            if ( !name ) {
                this._events = {};
                return this;
            }

            if ( events = this._events[name] ) {
                this._events[name] = retain = [];
                if ( callback || context ) {
                    for ( j = 0, k = events.length; j < k; j++ ) {
                        ev = events[j];
                        if ( (callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                            (context && context !== ev.context) ) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) {
                    delete this._events[name];
                }
            }

            return this;
        },

        /**
         * @name publish
         * @grammar instance.publish(name) => {Boolean}
         * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
         * options上回调函数可以通过设置event.defaultPrevented = false来阻止事件继续派发。
         */
        trigger: function( name ) {
            if ( !this._events || !name ) {
                return this;
            }

            var event = Event(name),
                args = [event].concat( Array.prototype.slice.call( arguments, 1 ) ),
                events = this._events[name],
                opEvent = this._options[name],
                result;

            if ( opEvent && $.isFunction( opEvent ) ) {
                opEvent.apply( this, args );
                if(event.defaultPrevented === true){
                    return false;
                }
            }

            if ( events ) {
                var ev, i = -1, l = events.length;
                while (++i < l)
                    (ev = events[i]).callback.apply( ev.ctx, args );
            };

            // triggerHandler不冒泡
            this.$el.triggerHandler( name, args );

            return event.returnValue;
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
                if ( !$.isFunction( this[pro] ) ) {
                    delete this[pro];
                } else {
                    this[pro] = blankFn;
                }
            }

            this.trigger( 'destroy' );
            this.disposed = true;
        }
    };
})(window.gmu);