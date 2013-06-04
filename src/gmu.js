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

var gmu = (function(undefined) {
        // 挂到组件类上的属性、方法
    var staticlist = [ 'options', 'template', 'tpl2html' ],
        isString = function( obj ) {
            return Object.prototype.toString.call( obj ) === '[object String]';
        },
        isNull = function( obj ) {
            return obj === null;
        },
        isUndefined = function( obj ) {
            return obj === undefined;
        },
        blankFn = function(){},
        record = (function() {
            var data = {},
                id = 0,
                iKey = 'GMUWidget' + (+new Date());    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ iKey ] || (obj[ iKey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                !isUndefined( val ) && (store[ key ] = val);
                isNull( val ) && delete store[ key ];

                return store[ key ];
            };
        })(),

        dataAttr = function( el, attr ) {
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
        getDomOptions = function( el, keys ) {
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
                data = dataAttr( el, key );
                data !== null && (_result[ key ] = data);
            }

            return _result;
        },

        getFnName = function( name ) {
            return name.replace(/^([a-zA-Z])(.*)/, function($1, $2, $3){
                return $2.toLowerCase() + $3;
            });
        };

        /**
         * @desc 创建一个类，构造函数默认为init方法, superClass默认为gmu.Base
         * @name createClass
         * @grammar createClass(object[, superClass]) => fn
         */
        createClass = function( object, superClass ) {
            if ( typeof superClass !== 'function' ) {
                superClass = gmu.Base;
            }

            var constructor = object._init || function() {},
                fn = function( el, options ){
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
                    var dom_options = getDomOptions( el, fn.options );

                    var me = this;
                    var options = me._options = $.extend( {}, fn.options, dom_options, options );

                    // 将template和tpl2html挂到实例上
                    if( options.template !== undefined ){
                        me.template = options.template;
                    }
                    if( options.tpl2html !== undefined ){
                        me.tpl2html = options.tpl2html;
                    }

                    //执行父类的构造函数
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
                    
                    constructor.call( me, options );

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
                                        var _origin = me.origin;

                                        me.origin = originFunction;
                                        var result = val.apply( me, arguments );

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

            fn.extend = function( obj ){
                $( staticlist ).each( function( i, item ){
                    if(obj[item] !== undefined){
                        fn[item] = obj[item];
                        delete obj[item];
                    }
                } );

                $.extend( fn.prototype, obj );
            };

            fn.prototype = Object.create( superClass.prototype );
            fn.extend( object );

            // 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
            fn.prototype.$super = function( name ) {
                var fn = superClass.prototype[name];
                return $.isFunction(fn) ? fn.apply(this, Array.prototype.slice.call(arguments, 1)) : fn;
            };

            /**
             * @name register
             * @grammar fn.register({})
             * @desc 注册插件
             */
            fn.register = function( name, obj ){
                obj._init === undefined && ( obj._init = function(){} );
                ( fn.plugins || ( fn.plugins = {} ) )[name] = obj;
                
                return fn;
            };

            /**
             * @name inherits
             * @grammar fn.inherits({})
             * @desc 从该类继承出一个子类，不会被挂到gmu命名空间
             */
            fn.inherits = function( obj ){
                return createClass( obj, fn );
            };

            /**
             * @name option
             * @grammar fn.option(option, value, method)
             * @desc 扩充组件的配置项
             */
            fn._optioned = {};
            // TODO value为Boolean的时候可以兼容插件
            fn.option = function( option, value, method ){
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

            return fn;
        },

        _zeptoLize = function( name ){
            $.fn[getFnName( name )] = function( opts ) {
                var ret,
                    obj,
                    args = Array.prototype.slice.call( arguments, 1 );

                $.each( this, function( i, el ) {

                    obj = record( el, name ) || new gmu[name]( el, $.extend($.isPlainObject(opts) ? opts : {}, {setup: true}) );

                    if ( isString( opts ) ) {
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
        };

    return {
        version: '2.1.0.0',

        /**
         *  @desc 只支持单继承
         */
        define: function( name, object, superClass ){
            if ( /\./.test( name ) ) {
                return;
            }

            var fnName = getFnName( name );

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
})();

// 向下兼容
$.ui = gmu;
