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
        initNativeTouches = function(touches, target){
            var touchlists = [];
            var i = 0;
            do{
                var identifier = touches[i] && touches[i].identifier || 0;
                var touchesPageX = touches[i] && (touches[i].pageX || touches[i].clientX) || 0;
                var touchesPageY = touches[i] && (touches[i].pageY || touches[i].clientY) || 0;
                var touchesScreenX = touches[i] && touches[i].screenX || 0;
                var touchesScreenY = touches[i] && touches[i].screenY || 0;
                touchlists[i] = document.createTouch(null, target, identifier, touchesPageX, touchesPageY, touchesScreenX, touchesScreenY);
                i ++;
            } while(i < touches.length);
            return touchlists;
        },
        initGenericTouches = function(touchlist, touches, target){
            var i = 0;
            function Touch(target, identifier, touchesPageX, touchesPageY, touchesScreenX, touchesScreenY){
                this.target = target;
                this.identifier = identifier;
                this.pageX = this.clientX = touchesPageX;
                this.pageY = this.clientY= touchesPageY;
                this.screenX = touchesScreenX;
                this.screenY = touchesScreenY;
            }
            do{
                var identifier = touches[i] && touches[i].identifier || 0;
                var touchesPageX = touches[i] && (touches[i].pageX || touches[i].clientX) || 0;
                var touchesPageY = touches[i] && (touches[i].pageY || touches[i].clientY) || 0;
                var touchesScreenX = touches[i] && touches[i].screenX || 0;
                var touchesScreenY = touches[i] && touches[i].screenY || 0;
                touchlist[i] = new Touch(target, identifier, touchesPageX, touchesPageY, touchesScreenX, touchesScreenY);
                i ++;
            } while(i < touches.length);
            touchlist.length = i;
        },
        createNativeTouchList = function(touches, target){       
            if(touches){
                var touchlist, touchlists = this.initNativeTouches(touches, target);
                if(touchlists.length == 1)
                    touchlist = document.createTouchList(touchlists[0]);
                if(touchlists.length == 2)
                    touchlist = document.createTouchList(touchlists[0], touchlists[1]);
            }
            else
                var touchlist = document.createTouchList();
            return touchlist;
        },
        createGenericTouchList = function(touches, target){
            function TouchList(){
                this.length = 0;
                this.item = function(i) {
                      return this[i];
                }
            }
            var touchlist = new TouchList();
            if(touches)
                initGenericTouches(touchlist, touches, target);
            return touchlist;
        },
        createTouchList = function(touches, target) {
            return document.createTouchList ?
                    createNativeTouchList(touches, target):
                    createGenericTouchList(touches, target) ;
        };

    $.extend($.fn, {
        on: function(event, selector, callback) {

            var targetActived = false;
            var transedEvent = transFn(event);

            var callback = function(e){
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

                // 如果touchstart没触发，touchmove(mousemove)应该不响应
                switch( e.type ){
                    case 'mousedown':
                        targetActived = true;
                        selector.call(null, _event);
                        break;
                    case 'mousemove':
                        if( !targetActived ) {
                            return;
                        } else {
                            selector.call(null, _event);
                            break;
                        }
                    case 'mouseup':
                        targetActived = false;
                        selector.call(null, _event);
                        break;
                }

                
            };

            if ( Object.prototype.toString.call(selector) === '[object String]' ) {
                return $onFn.call(this, transedEvent, selector, callback);
            } else {
                return $onFn.call(this, transedEvent, callback);
            }
        },
        off: function(event, selector, callback) {
            return $offFn.call(this, transFn(event), selector, callback);
        }
    });
})();