/**
 * @file gmu底层，定义了创建gmu组件的方法
 * @import core/gmu.js, core/event.js, extend/parseTpl.js
 */

(function( gmu, $, undefined ) {
    var slice = [].slice,
        blankFn = function() {},

        // 挂到组件类上的属性、方法
        staticlist = [ 'options', 'template', 'tpl2html' ],

        // 存储和读取数据到指定对象，任何对象包括dom对象
        // 注意：数据不直接存储在object上，而是存在内部闭包中，通过_gid关联
        // record( object, key ) 获取object对应的key值
        // record( object, key, value ) 设置object对应的key值
        // record( object, key, null ) 删除数据
        record = (function() {
            var data = {},
                id = 0,
                ikey = '_gid';    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ ikey ] || (obj[ ikey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                val !== undefined && (store[ key ] = val);
                val === null && delete store[ key ];

                return store[ key ];
            };
        })(),

        event = gmu.event;

    // 遍历对象，接口与$.each统一，但是不能断开循环。
    function eachObject( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            var val = obj[ key ];
            iterator.call( val, key, val );
        });
    }

    // 从某个元素上读取某个属性。
    function dataAttr( el, attr ) {
        var data = el.getAttribute( 'data-' + attr );

        try {    // JSON.parse可能报错

            // 当data===null表示，没有此属性
            data = data === null ? undefined : data === 'true' ? true :
                    data === 'false' ? false : data === 'null' ? null :

                    // 如果是数字类型，则将字符串类型转成数字类型
                    +data + '' === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
                    JSON.parse( data ) : data;
        } catch ( ex ) {
            data = undefined;
        }

        return data;
    }

    // 从DOM节点上获取配置项
    function getDomOptions( el, keys ) {
        var ret = {},
            data;

        el && eachObject( keys, function( key ) {
            data = dataAttr( el, key );
            data === undefined || (ret[ key ] = data);
        } );

        return ret;
    }

    // 在$.fn上挂对应的组件方法呢
    // $('#btn').button( options );实例化组件
    // $('#btn').button( 'select' ); 调用实例方法
    // $('#btn').button( 'this' ); 取组件实例
    // 此方法遵循get first set all原则
    function zeptolize( name ) {
        var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
            old = $.fn[ key ];

        $.fn[ key ] = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // 从缓存中取，没有则创建一个
                obj = record( el, name ) || new gmu[ name ]( el,
                        $.isPlainObject( opts ) ? opts : undefined );

                // 取实例
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // 断开each循环
                } else if ( method ) {

                    // 当取的方法不存在时，抛出错误信息
                    if ( !$.isFunction(obj[ method ]) ) {
                        throw new Error( '组件没有此方法：' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // ret为obj时为无效值，为了不影响后面的返回
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

        /* 
         * NO CONFLICT 
         * var gmuPanel = $.fn.panel.noConflict();
         * gmuPanel.call(test, 'fnname');
         */
        $.fn[ key ].noConflict = function() {
            $.fn[ key ] = old;
            return this;
        };
    }

    // 加载注册的option
    function loadOption( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadOption.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'options' ), function( key, option ) {
            option.forEach(function( item ) {
                var condition = item[ 0 ],
                    fn = item[ 1 ];

                if ( condition === '*' ||
                        ($.isFunction( condition ) &&
                        condition.call( me, opts[ key ] )) ||
                        condition === opts[ key ] ) {

                    fn.call( me );
                }
            });
        } );
    }

    // 加载注册的插件
    function loadPlugins( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadPlugins.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'plugins' ), function( opt, plugin ) {

            // 如果配置项关闭了，则不启用此插件
            if ( opts[ opt ] === false ) {
                return;
            }

            eachObject( plugin, function( key, val ) {
                var oringFn;

                if ( $.isFunction( val ) && (oringFn = me[ key ]) ) {
                    me[ key ] = function() {
                        var origin = me.origin,
                            ret;

                        me.origin = oringFn;
                        ret = val.apply( me, arguments );
                        origin === undefined ? delete me.origin :
                                (me.origin = origin);
                    };
                } else {
                    me[ key ] = val;
                }
            } );

            plugin._init.call( me );
        } );
    }

    // 合并对象
    function mergeObj() {
        var args = slice.call( arguments ),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            $.isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
                $.extend.apply( null, [ true, {} ].concat( args ) ) : last;
    }

    /**
     * @desc 创建一个类，构造函数默认为init方法, superClass默认为Base
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    function createClass( name, object, superClass ) {
        if ( typeof superClass !== 'function' ) {
            superClass = Base;
        }

        var uuid = 0,
            suid = 0,

            fn = function( el, options ) {

                if ( !(this instanceof fn) ) {
                    return new fn( el, options );
                }

                var me = this,
                    opts;

                if ( $.isPlainObject( el ) ) {
                    options = el;
                    el = undefined;
                }

                // options中存在el时，覆盖el
                options && options.el && (el = $( options.el ));
                el && (me.$el = $( el ), el = me.$el[ 0 ]);

                opts = me._options = mergeObj( fn.options,
                        getDomOptions( el, fn.options ), options );

                me.template = mergeObj( fn.template, opts.template );

                me.tpl2html = mergeObj( me.tpl2html, fn.tpl2html,
                        opts.tpl2html );

                // 生成eventNs widgetName
                me.eventNs = '.' + name + uuid++;
                me.widgetName = name.toLowerCase();

                me._init( opts );
                loadOption.call( me, fn, opts );
                loadPlugins.call( me, fn, opts );

                // 进行创建DOM等操作
                me._create();
                me.trigger( 'ready' );

                el && record( el, name, me ) && me.on( 'destroy', function() {
                    record( el, name, null );
                } );
                
                return me;
            };

        $.extend( fn, {
            
            /**
             * @name register
             * @grammar fn.register({})
             * @desc 注册插件
             */
            register: function( name, obj ) {
                var plugins = record( fn, 'plugins' ) ||
                        record( fn, 'plugins', {} );

                obj._init === undefined && (obj._init = blankFn);

                plugins[ name ] = obj;
                return fn;
            },

            /**
             * @name option
             * @grammar fn.option(option, value, method)
             * @desc 扩充组件的配置项
             */
            option: function( option, value, method ) {
                var options = record( fn, 'options' ) ||
                        record( fn, 'options', {} );

                options[ option ] || (options[ option ] = []);
                options[ option ].push([ value, method ]);

                return fn;
            },

            /**
             * @name inherits
             * @grammar fn.inherits({})
             * @desc 从该类继承出一个子类，不会被挂到gmu命名空间
             */
            inherits: function( obj ) {

                // 生成 Sub class
                return createClass( name + 'Sub' + ++suid, obj, fn );
            },

            extend: function( obj ) {
                staticlist.forEach(function( item ) {
                    obj[ item ] = mergeObj( superClass[ item ], obj[ item ] );
                    obj[ item ] && (fn[ item ] = obj[ item ]);
                    delete obj[ item ]
                });
                $.extend( fn.prototype, obj );
            }
        } );

        fn.superClass = superClass;
        fn.prototype = Object.create( superClass.prototype );
        fn.extend( object );
        
        // 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
        fn.prototype.$super = function( name ) {
            var fn = superClass.prototype[ name ];
            return $.isFunction( fn ) && fn.apply( this,
                    slice.call( arguments, 1 ) );
        };

        return fn;
    }

    // 基类定义
    function Base() {}
    
    Base.prototype = {

        /**
         *  @override
         *  @name _init
         *  @grammar instance._init() => instance
         *  @desc 组件的初始化方法，子类需要重写该方法
         */
        _init: blankFn,

        /**
         *  @override
         *  @name _create
         *  @grammar instance._create() => instance
         *  @desc 组件创建DOM的方法，子类需要重写该方法
         */
        _create: blankFn,


        /**
         *  @name getEl
         *  @grammar instance.getEl() => $el
         *  @desc 返回组件的$el
         */
        getEl: function() {
            return this.$el;
        },

        /**
         * @name on
         * @grammar instance.on(name, callback, context) => self
         * @desc 订阅事件
         */
        on: event.on,

        /**
         * @name one
         * @grammar instance.one(name, callback, context) => self
         * @desc 订阅事件（只执行一次）
         */
        one: event.one,

        /**
         * @name off
         * @grammar instance.off(name, callback, context) => self
         * @desc 解除订阅事件
         */
        off: event.off,

        /**
         * @name trigger
         * @grammar instance.trigger( name ) => self
         * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
         * options上回调函数可以通过调用event.stopPropagation()来阻止事件系统继续派发,
         * 或者调用event.preventDefault()阻止后续事件执行
         */
        trigger: function( name ) {
            var evt = typeof name === 'string' ? new gmu.Event( name ) : name,
                args = [ evt ].concat( slice.call( arguments, 1 ) ),
                opEvent = this._options[ evt.type ],

                // 先存起来，否则在下面使用的时候，可能已经被destory给删除了。
                $el = this.getEl();

            if ( opEvent && $.isFunction( opEvent ) ) {
                
                // 如果返回值是false,相当于执行stopPropagation()和preventDefault();
                false === opEvent.apply( this, args ) &&
                        (evt.stopPropagation(), evt.preventDefault());
            }

            event.trigger.apply( this, args );

            // triggerHandler不冒泡
            $el && $el.triggerHandler( evt, (args.shift(), args) );

            return this;
        },

        /**
         * @name tpl2html
         * @grammar instance.tpl2html() => String
         * @grammar instance.tpl2html( data ) => String
         * @grammar instance.tpl2html( subpart, data ) => String
         * @desc 将template输出成html字符串，当传入 data 时，html将通过$.parseTpl渲染。
         * template支持指定subpart, 当无subpart时，template本身将为模板，当有subpart时，
         * template[subpart]将作为模板输出。
         */
        tpl2html: function( subpart, data ) {
            var tpl = this.template;

            tpl =  typeof subpart === 'string' ? tpl[ subpart ] :
                    ((data = subpart), tpl);
            
            return data ? $.parseTpl( tpl, data ) : tpl;
        },

        /**
         * @name destroy
         * @grammar instance.destroy()
         * @desc 注销组件
         */
        destroy: function() {

            // 让外部先destroy
            this.trigger( 'destroy' );

            // 解绑element上的事件
            this.$el && this.$el.off( this.eventNs );
            
            // 解绑所有自定义事件
            this.off();

            this.destroyed = true;
        }
    };

    /**
     * @desc 定义一个gmu组件
     */
    gmu.define = function( name, object, superClass ) {
        gmu[ name ] = createClass( name, object, superClass );
        zeptolize( name );
    };

    /**
     * @desc 判断object是不是 widget实例, klass不传时，默认为Base基类
     */
    gmu.isWidget = function( obj, klass ) {
        
        // 处理字符串的case
        klass = typeof klass === 'string' ? gmu[ klass ] || blankFn : klass;
        klass = klass || Base;
        return obj instanceof klass;
    };

    // 向下兼容
    $.ui = gmu;
})( gmu, gmu.$ );