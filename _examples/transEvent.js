/**
 * 事件转换，兼容PC，供demo及测试使用
 * @import zepto.js
 * */

(function ($) {
    var isTouch = 'ontouchend' in document,
        $onFn = $.fn.on,
        $offFn = $.fn.off,
        transEvent = {
            touchstart: 'mousedown',
            touchend: 'mouseup',
            touchmove: 'mousemove',
            tap: 'click'
        },
        transFn = function(e) {
            var events, org, event;

            if (isTouch) {
                return e;
            }
            if($.isObject(e)){
                org = e;
                $.each(e, function(key){
                    event = parse(key);
                    transEvent[event.e] && (org[transEvent[event.e]+event.ns] = this);
                });
                return org;
            }else {
                events = [];
                $.each((e || '').split(' '), function(i, type) {
                    event = parse(type);
                    events.push(transEvent[event.e] ? transEvent[event.e]+event.ns : type);
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
        };

    $.extend($.fn, {    //封装$.fn.on及$.fn.off
        on: function(event, selector, callback) {
            return $onFn.call(this, transFn(event), selector, callback);
        },
        off: function(event, selector, callback) {
            return $offFn.call(this, transFn(event), selector, callback);
        }
    });
})(Zepto);