(function( ns, $ ) {
    $ = $ || ns.$;

    var Event = function( type, props ) {
            if( !ret instanceof Event ) {
                return new Event( type, props );
            }

            props && $.extend( this, props );
            this.type = type;

            return this;
        },

        slice = [].slice,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        },

        api;

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

        on: function( name, callback, context ){
            var events;

            if( !callback ) {
                return this;
            }

            this._events || (this._events = {});
            
            events = this._events[ name ] || (this._events[ name ] = []);

            events.push({
                callback: callback, 
                context: context, 
                ctx: context || this
            });

            return this;
        },

        once: function( name, callback, context ) {
            var me = this,
                once;

            if( !callback ) {
                return this;
            }

            once = function() {
                me.off( name, once );
                callback.apply( context || me, arguments );
            }

            once._callback = callback;

            return this.on( name, once, context );
        },

        off: function( name, callback, context ) {
            var retain, 
                events,
                ev,
                i,
                len;

            if ( !this._events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = {};
                return this;
            }

            if ( events = this._events[ name ] ) {
                this._events[ name ] = retain = [];

                if ( callback || context ) {

                    for ( i = 0, len = events.length; i < len; i++ ) {
                        ev = events[ i ];

                        if ( (callback && callback !== ev.callback &&
                                callback !== ev.callback._callback) ||
                                (context && context !== ev.context) ) {

                            retain.push( ev );
                        }
                    }
                }
                
                if ( !retain.length ) {
                    delete this._events[ name ];
                }
            }

            return this;
        },

        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                i,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler中可以直接通过e.args获取trigger数据
            args.unshift( evt );

            if ( (events = this._events[ evt.type ]) ) {
                len = events.length;

                while ( ++i < len ) {
                    if( evt.isPropagationStopped() ||  false === 
                            (ev = events[ i ]).callback.apply( ev.ctx, args )) {

                        // 如果return false则相当于stopPropagation()和preventDefault();
                        evt.isPropagationStopped() || (evt.stopPropagation(),
                                evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };

    Event.make = function( target, overrides ) {
        var override;

        $.each( api, function( key, fn ){
            override = overrides && overrides[ key ];

            target[ key ] = override ? function() {
                var _origin = this.origin,
                    ret;

                this.origin = fn;
                ret = override.apply( this, arguments );

                typeof _origin === 'undefined' ? (this.origin = _origin) :
                        (delete this.origin);

                return ret;
            } : fn;
        } );
    };

    ns.Event = Event;



    // 以下代码需要移至Base中
    gmu.Event.make( gmu.Base.prototype, {
        trigger: function( evt ) {
            var opEvent,
                args = [].slice.call( arguments, 1 ),
                ev;

            typeof evt === 'string' && (evt = new gmu.Event( evt ));
            evt.args = args;
            args.unshift( evt );

            opEvent = this._options[ evt.type ];

            // 如果option中的event handler return false了
            if( opEvent && opEvent.apply( this, args ) === false ) {
                evt.preventDefault();
                evt.stopPropagation();
            }

            this.origin.apply( this, arguments );

            // 兼容
            ev = $.Event( evt.type );
            this.$el.triggerHandler( ev, args );
            ev.isDefaultPrevented() && evt.preventDefault();

            return this;
        }
    } );
})( gmu );