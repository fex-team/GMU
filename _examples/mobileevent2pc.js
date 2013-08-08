//事件兼容pc，做测试用的
(function () {
    var $onFn = $.fn.on,
        $offFn = $.fn.off,
        transEvent = {
            touchstart: 'mousedown',
            touchend: 'mouseup',
            touchmove: 'mousemove',
            tap: 'click'
        },
        reversalEvent= {
            mousedown: 'touchstart',
            mouseup: 'touchend',
            mousemove: 'touchmove',
            click: 'tap'
        },
        transFn = function(e) {
            var events, org, event;
            if($.isObject(e)){
                org = e;
                $.each(e, function(key){
                    event = parse(key);
                    !$.support.touch && transEvent[event.e] && (org[transEvent[event.e]+event.ns] = this);
                });
                return org;
            }else {
                events = [];
                $.each((e || '').split(' '), function(i, type) {
                    event = parse(type);
                    events.push(!$.support.touch && transEvent[event.e] ? transEvent[event.e]+event.ns : type);
                });
                return events.join(' ');
            }
        },
        parse = function(event) {
            var idx = event.indexOf('.'), e, ns;
            if(idx>-1) {
                e = event.substr(0, idx);
                ns = event.substr(idx);
            } else {
                e = event;
                ns = '';
            }
            return {e:e, ns:ns};
        },
        callbackStack = [];

    $.extend($.fn, {
        on: function(event, selector, callback) {

            if( Object.prototype.toString.call(selector) === '[object Function]' ) {
                callback = selector;
                selector = null;
            }

            $.proxy(callback);

            var targetActived = false;
            var transedEvent = transFn(event);

            var _callback = function(e){
                var options = e || {};
                options.changedTouches = options.changedTouches || [];
                var bubbles = typeof options.bubbles != 'undefined' ? options.bubbles : true ;
                var cancelable = typeof options.cancelable != 'undefined' ? options.cancelable : (event != "touchcancel");
                var view = typeof options.view != 'undefined' ? options.view : window;
                var detail = typeof options.detail != 'undefined' ? options.detail : 0;
                var clientX = typeof options.pageX != 'undefined' ? options.pageX : 0;
                var clientY = typeof options.pageY != 'undefined' ? options.pageY : 0;
                var ctrlKey = typeof options.ctrlKey != 'undefined' ? options.ctrlKey : false;
                var altKey = typeof options.altKey != 'undefined' ? options.altKey : false;
                var shiftKey = typeof options.shiftKey != 'undefined' ? options.shiftKey : false;
                var metaKey = typeof options.metaKey != 'undefined' ? options.metaKey : false;
                var scale = typeof options.scale != 'undefined' ? options.scale : 1.0;
                var rotation = typeof options.rotation != 'undefined' ? options.rotation : 0.0;
                var relatedTarget = typeof options.relatedTarget != 'undefined' ? options.relatedTarget : null;
                var touches = [];
                var targetTouches = [];
                var changedTouches = [];

                var _event = document.createEvent('MouseEvents');
                _event.initMouseEvent(reversalEvent[e.type] || e.type, bubbles, cancelable, view, 1,
                    0, 0, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey,
                    touches, targetTouches, changedTouches, scale, rotation, relatedTarget);
                _event.touches = [e];

                switch( e.type ){
                    case 'mousedown':
                        targetActived = true;
                        arguments[ 0 ] = _event;
                        callback.apply( this, arguments );
                        e.preventDefault();
                        break;
                    case 'mousemove':
                        if( !targetActived ) {  // 如果touchstart没触发，touchmove(mousemove)应该不响应
                            return;
                        } else {
                            arguments[ 0 ] = _event;
                            callback.apply( this, arguments );
                            e.preventDefault();
                            break;
                        }
                    case 'mouseup':
                        targetActived = false;
                        arguments[ 0 ] = _event;
                        callback.apply( this, arguments );
                        e.preventDefault();
                        break;

                    default:
                        callback.apply( this, arguments );
                        break;
                }
            };

            callbackStack.push({
                'target': this,
                'event': transedEvent,
                'selector': selector,
                'callback': callback,
                '_callback': _callback
            });

            _callback._zid = callback._zid;
            return $onFn.call(this, transedEvent, selector, _callback);
        },
        off: function(event, selector, callback) {

            return $offFn.call(this, transFn(event), selector, callback);
            // var me = this;

            // if( Object.prototype.toString.call(selector) === '[object Function]' ) {
            //     callback = selector;
            //     selector = null;
            // }

            // callbackStack.forEach(function( item, index ){
            //     if(item.target == me && item.event == transFn(event) && item.selector == selector && item.callback == callback) {
            //         return $offFn.call(me, transFn(event), selector, item._callback);
            //     }
            // });
        }
    });
})();