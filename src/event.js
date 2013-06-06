/**
 * @fileoverview Event相关
 * @import zepto.js
 */
// 测试用的,测试完删除
var gmu = window.gmu || {};
gmu.$ = Zepto;

/* global gmu*/
(function( ns, $ ) {
    $ = $ || ns.$;

    var slice = [].slice,
        separator = /\s+/,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        },

        api;

    function eachEvent( events, callback, iterator ) {

        // 不支持对象，只支持多个event用空格隔开
        events.split( separator ).forEach(function( type ) {
            iterator( type, callback );
        });
    }

    // 生成匹配namespace正则
    function matcherFor( ns ) {
        return new RegExp( '(?:^| )' + ns.replace( ' ', ' .* ?' ) + '(?: |$)' );
    }

    // 分离event name和event namespace
    function parse( name ) {
        var parts = ('' + name).split( '.' );

        return {
            e: parts[ 0 ],
            ns: parts.slice( 1 ).sort().join( ' ' )
        };
    }

    function findHandlers( arr, name, ns, callback, context ) {
        var matcher;

        ns && (matcher = matcherFor( ns ));
        return arr.filter(function( handler ) {
            return handler && 
                    (!name || handler.e === name) &&
                    (!ns || matcher.test( handler.ns )) &&
                    (!callback || handler.cb === callback ||
                    handler.cb._cb === callback) &&
                    (!context || handler.ctx === context);
        });
    }

    function Event( type, props ) {
        if ( !this instanceof Event ) {
            return new Event( type, props );
        }

        props && $.extend( this, props );
        this.type = type;

        return this;
    }

    Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,

        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },

        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    api = {

        on: function( name, callback, context ) {
            var me = this,
                set;

            if ( !callback ) {
                return this;
            }

            set = this._events || (this._events = []);
            
            eachEvent( name, callback, function( name, callback ) {
                var handler = parse( name );

                name = handler.e;

                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;
                set.push( handler );
            } );

            return this;
        },

        one: function( name, callback, context ) {
            var me = this;

            if ( !callback ) {
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var once = function() {
                        me.off( name, once );
                        callback.apply( context || me, arguments );
                    };
                
                once._cb = callback;
                me.on( name, once, context );
            } );

            return this;
        },

        off: function( name, callback, context ) {
            var events = this._events;

            if ( !events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = [];
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var obj = parse( name );

                findHandlers( events, obj.e, obj.ns, callback, context )
                        .forEach(function( handler ) {
                            delete events[ handler.id ];
                        });
                
            } );

            return this;
        },

        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                stoped,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler中可以直接通过e.args获取trigger数据
            args.unshift( evt );

            events = findHandlers( this._events, evt.type, '' );

            if ( events ) {
                len = events.length;

                while ( ++i < len ) {
                    if ( (stoped = evt.isPropagationStopped()) ||  false === 
                            (ev = events[ i ]).cb.apply( ev.ctx2, args )
                            ) {

                        // 如果return false则相当于stopPropagation()和preventDefault();
                        stoped || (evt.stopPropagation(), evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };

    // expose
    ns.Event = Event;
    ns.event = api;
})( gmu );