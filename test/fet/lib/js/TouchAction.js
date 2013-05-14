var TouchAction = {	
	
	/**
	 * Detects the os and browser version of device.
	 * 
	 * @method plat
	 * @static
	 */
	plat: (function(){
		var ua = navigator.userAgent,
		    webkit = ua.match(/WebKit\/([\d.]+)/),
		    android = ua.match(/(Android)\s+([\d.]+)/),
		    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
		    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
		    webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
		    touchpad = webos && ua.match(/TouchPad/),
		    kindle = ua.match(/Kindle\/([\d.]+)/),
		    silk = ua.match(/Silk\/([\d._]+)/),
		    blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
			o = {
					os: {},
					browser: {}
			};
	
	    // todo clean this up with a better OS/browser
	    // separation. we need to discern between multiple
	    // browsers on android, and decide if kindle fire in
	    // silk mode is android or not
	
	    if(o.browser.webkit = !!webkit) {
	    	o.browser.version = webkit[1];
	    }
	    if(android){
	    	o.os.android = true;
	    	o.os.version = android[2];
	    }
	    if(iphone){
	    	o.os.ios = o.os.iphone = true;
	    	o.os.version = iphone[2].replace(/_/g, '.');
	    }
	    if(ipad){
	    	o.os.ios = o.os.ipad = true;
	    	o.os.version = ipad[2].replace(/_/g, '.');
	    }
	    if(webos){
	    	o.os.webos = true;
	    	o.os.version = webos[2];
	    }
	    if(touchpad){
	    	o.os.touchpad = true;
	    }
	    if(blackberry){
	    	o.os.blackberry = true;
	    	o.os.version = blackberry[2];
	    }
	    if(kindle){
	    	o.os.kindle = true;
	    	o.os.version = kindle[1];
	    }
	    if(silk){
	    	o.browser.silk = true;
	    	o.browser.version = silk[1];
	    }
	    if (!silk && o.os.android && ua.match(/Kindle Fire/)){
	    	o.browser.silk = true;
	    }
	    return o;
	})(),
	
	/**
	 * Emulates the 'defaultPrevented' property for browsers that have none.
	 * 
	 * @param {Event}
	 *            event The Event.
	 * @method fix
	 * @static
	 */
	fix : function(event) {
	    if (!('defaultPrevented' in event)) {
	        event.defaultPrevented = false;
	        var prevent = event.preventDefault;
	        event.preventDefault = function() {
	            this.defaultPrevented = true;
	            prevent.call(this);
	        } 
	    }
	},
	
	/**
	 * Creates a Touch, using native touch Api, for initialing the touchlist.
	 * 
	 * @param {TouchList}
	 *            touchlist The touchlist.
	 * @param {Array}
	 *            touches Additional touches options.
	 * @param {HTMLElement}
	 *            target The element to act on.            
	 * @method initNativeTouches
	 * @static
	 */
	initNativeTouches: function(touches, target){
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
	
	/**
	 * Creates a Touch, using simulated touch Api, for initialing the touchlist.
	 * 
	 * @param {TouchList}
	 *            touchlist The touchlist.
	 * @param {Array}
	 *            touches Additional touches options.
	 * @param {HTMLElement}
	 *            target The element to act on.            
	 * @method initGenericTouches
	 * @static
	 */
	initGenericTouches: function(touchlist, touches, target){
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
	
	/**
	 * Creates a TouchList, using native touch Api, for touch events.
	 * 
	 * @param {Object}
	 *            touches The touchlist options.
	 * @param {HTMLElement}
	 *            target The element to act on.              
	 * @method createNativeTouchList
	 * @static
	 */
	createNativeTouchList: function(touches, target){		
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
	
	/**
	 * Creates a TouchList, using simulated touch Api, for touch events.
	 * 
	 * @param {Object}
	 *            touches The touches options.
	 * @param {HTMLElement}
	 *            target The element to act on.            
	 * @method createGenericTouchList
	 * @static
	 */
	createGenericTouchList: function(touches, target){
		function TouchList(){
			this.length = 0;
			this.item = function(i) {
			      return this[i];
		    }
		}
		var touchlist = new TouchList();
		if(touches)
			this.initGenericTouches(touchlist, touches, target);
		return touchlist;
	},
	
	/**
	 * Creates a TouchList for touch events.
	 * 
	 * @param {Object}
	 *            touches The touches options.
	 * @param {HTMLElement}
	 *            target The element to act on.            
	 * @method createTouchList
	 * @static
	 */
	createTouchList: function(touches, target) {
	    return document.createTouchList ?
	    		this.createNativeTouchList(touches, target):
	        	this.createGenericTouchList(touches, target) ;
	},
	
	/**
	 * Simulates an event that normally would be fired by the touch action.
	 * option.
	 * 
	 * @private
	 * @param {String}
	 *            type The type of event ("touchstart", "touchmove", "touchend" or "touchcancel").
	 * @param {HTMLElement}
	 *             target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @config {Boolean}     options.bubbles (Optional)
	 * @config {Boolean}     options.cancelable (Optional)
	 * @config {Window}      options.view (Optional)
	 * @config {int}         options.detail (Optional)
	 * @config {int}         options.pageX (Optional)
	 * @config {int}         options.pageY (Optional)
	 * @config {int}         options.ctrlKey (Optional)
	 * @config {int}         options.altKey (Optional)
	 * @config {int}         options.shiftKey (Optional)
	 * @config {int}         options.metaKey (Optional)
	 * @config {float}       options.scale (Optional)
	 * @config {float}       options.rotation (Optional)
	 * @config {HTMLElement} options.relatedTarget (Optional)
	 * @config {Array}       options.touches (Optional)
	 * @config {int}         options.touches[i].identifier (Optional) 
	 * @config {int}         options.touches[i].pageX (Optional)        
	 * @config {int}         options.touches[i].pageY (Optional)
	 * @config {int}         options.touches[i].screenX (Optional)        
	 * @config {int}         options.touches[i].screenY (Optional)
	 * @config {Array}       options.targetTouches (Optional)
	 * @config {Array}       options.changedTouches (Optional)
	 * @method simulateTouchEvent
	 * @static
	 */
	simulateTouchEvent: function(type, target, options){
		options = options || {};
		if(type != "touchend" && type !="touchcancel"){
			options.touches = options.touches || [];
			options.targetTouches = options.targetTouches || [];
		}
		options.changedTouches = options.changedTouches || [];
		var bubbles = typeof options.bubbles != 'undefined' ? options.bubbles : true ;
		var cancelable = typeof options.cancelable != 'undefined' ? options.cancelable : (type != "touchcancel");
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
		var touches = this.createTouchList(options.touches, target);
		var targetTouches = this.createTouchList(options.targetTouches, target);
		var changedTouches = this.createTouchList(options.changedTouches, target);
		if(this.plat.os.ios && document.createTouchList){
			var event = document.createEvent('TouchEvent');
			event.initTouchEvent(type, bubbles, cancelable, view, /*detail*/ 1, 
					/*screenX*/ 0, /*screenY*/ 0, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, 
					touches, targetTouches, changedTouches, scale, rotation, relatedTarget);
		}
		else if(this.plat.os.android && (this.plat.os.version).substr(0, 3) >= 4.0  && document.createTouchList){
			var event = document.createEvent("TouchEvent");
			event.initTouchEvent(touches, targetTouches, changedTouches,
			          type, view, /*screenX*/ 0, /*screenY*/ 0, clientX,
			          clientY, ctrlKey, altKey, shiftKey, metaKey);
		}
		else{
			event = document.createEvent('MouseEvents');
		    event.initMouseEvent(type, bubbles, cancelable, view,
		        /*detail*/ 1, /*screenX*/ 0, /*screenY*/ 0, clientX, clientY,
		        ctrlKey, altKey, shiftKey, metaKey, /*button*/ 0);
		    event.touches = touches;
		    event.targetTouches = targetTouches;
		    event.changedTouches = changedTouches;
		    event.scale = scale;
		    event.rotation = rotation;
		}
		
		this.fix(event);
		if('dispatchEvent' in target) 
			target.dispatchEvent(event);
	},
	
	/**
	 * Simulates an event that normally would be fired by the gesture action.
	 * option.
	 * 
	 * @private
	 * @param {String}
	 *            type The type of event ("gesturestart", "gesturemove" or "gestureend").
	 * @param {HTMLElement}
	 *             target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @config {Boolean}     options.bubbles (Optional)
	 * @config {Boolean}     options.cancelable (Optional)
	 * @config {Window}      options.view (Optional)
	 * @config {int}         options.detail (Optional)
	 * @config {int}         options.pageX (Optional)
	 * @config {int}         options.pageY (Optional)
	 * @config {int}         options.ctrlKey (Optional)
	 * @config {int}         options.altKey (Optional)
	 * @config {int}         options.shiftKey (Optional)
	 * @config {int}         options.metaKey (Optional)
	 * @config {float}       options.scale (Optional)
	 * @config {float}       options.rotation (Optional)
	 * @method simulateGestureEvent
	 * @static
	 */
	simulateGestureEvent: function(type, target, options){
		options = options || {};
		var bubbles = typeof options.bubbles != 'undefined' ? options.bubbles : true ;
		var cancelable = typeof options.cancelable != 'undefined' ? options.cancelable : (type != "touchcancel");
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
		if(this.plat.os.ios && document.createTouchList){
			var event = document.createEvent('GestureEvent');
			event.initGestureEvent(type, bubbles, cancelable, view, /*detail*/ 1, 
					/*screenX*/ 0, /*screenY*/ 0, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, 
					target, scale, rotation);
		}
		else{
			event = document.createEvent('MouseEvents');
		    event.initMouseEvent(type, bubbles, cancelable, view,
		        /*detail*/ 1, /*screenX*/ 0, /*screenY*/ 0, clientX, clientY,
		        ctrlKey, altKey, shiftKey, metaKey, /*button*/ 0);
		    event.target = target;
		    event.scale = scale;
		    event.rotation = rotation;
		}
		
		this.fix(event);
		if('dispatchEvent' in target) 
			target.dispatchEvent(event);
	},
	
	/**
	 * Simulates an event of the type specified. 
	 * option.
	 * 
	 * @private
	 * @param {String}
	 *            type The type of event.
	 * @param {HTMLElement}
	 *             target The element to act on.
	 * @param {Object}
	 *            options Additional event options("bubbles", "cancelable", etc).
	 * @config {Boolean}     options.bubbles (Optional)
	 * @config {Boolean}     options.cancelable (Optional)
	 * @method simulateEvent
	 * @static
	 */
	simulateEvent: function(type, target, options){
		options = options || {};
		var bubbles = typeof options.bubbles != 'undefined' ? options.bubbles : true;
		var cancelable = typeof options.cancelable != 'undefined' ? options.cancelable : true;
		
		var event = document.createEvent('Events');
		
    	for (var name in options) 
    		if(name != "bubbles" && name != "cancelable")
    			event[name] = options[name];
	    		
		event.initEvent(type, bubbles, cancelable, null, null, null, null, null, null, null, null, null, null, null, null);

		this.fix(event);
		if('dispatchEvent' in target) 
			target.dispatchEvent(event);
	},
	
	/**
	 * Simulates a touchstart event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method touchstart
	 * @static
	 */
	touchstart : function(target, options){
		this.simulateTouchEvent("touchstart", target, options);
	},
	
	/**
	 * Simulates a touchmove event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method touchmove
	 * @static
	 */
	touchmove : function(target, options){
		this.simulateTouchEvent("touchmove", target, options);
	},
	
	/**
	 * Simulates a touchend event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method touchend
	 * @static
	 */
	touchend : function(target, options){
		this.simulateTouchEvent("touchend", target, options);
	},
	
	/**
	 * Simulates a touchcancel event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method touchcancel
	 * @static
	 */
	touchcancel : function(target, options){
		this.simulateTouchEvent("touchcancel", target, options);
	},
	
	/**
	 * Simulates a gesturestart event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method gesturestart
	 * @static
	 */
	gesturestart : function(target, options){
		this.simulateGestureEvent("gesturestart", target, options);
	},
	
	/**
	 * Simulates a gesturechange event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method gesturechange
	 * @static
	 */
	gesturechange : function(target, options){
		this.simulateGestureEvent("gesturechange", target, options);
	},
	
	/**
	 * Simulates a gestureend event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method gestureend
	 * @static
	 */
	gestureend : function(target, options){
		this.simulateGestureEvent("gestureend", target, options);
	},
	
	/**
	 * Simulates a tap event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method tap
	 * @static
	 */
	tap : function(target, options){
		this.simulateEvent("tap", target, options);
	},
	
	/**
	 * Simulates a doubleTap event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method doubleTap
	 * @static
	 */
	doubleTap : function(target, options){
		this.simulateEvent("doubleTap", target, options);
	},
	
	/**
	 * Simulates a singleTap event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method singleTap
	 * @static
	 */
	singleTap : function(target, options){
		this.simulateEvent("singleTap", target, options);
	},
	
	/**
	 * Simulates a longTap event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method longTap
	 * @static
	 */
	longTap : function(target, options){
		this.simulateEvent("longTap", target, options);
	},
	
	/**
	 * Simulates an swipe event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method swipe
	 * @static
	 */
	swipe : function(target, options){
		this.simulateEvent("swipe", target, options);
	},
	
	/**
	 * Simulates an swipe event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method swipe
	 * @static
	 */
	swipeLeft : function(target, options){
		this.simulateEvent("swipeLeft", target, options);
	},
	
	/**
	 * Simulates an swipeRight event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options.
	 * @method swipeRight
	 * @static
	 */
	swipeRight : function(target, options){
		this.simulateEvent("swipeRight", target, options);
	},
	
	/**
	 * Simulates an swipeUp event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method swipeUp
	 * @static
	 */
	swipeUp : function(target, options){
		this.simulateEvent("swipeUp", target, options);
	},
	
	/**
	 * Simulates an swipeDown event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method swipeDown
	 * @static
	 */
	swipeDown : function(target, options){
		this.simulateEvent("swipeDown", target, options);
	},
	
	/**
	 * Simulates an orientationchange event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method orientationchange
	 * @static
	 */
	orientationchange : function(target, options){
		target = target || window;
		if(target.toString() == "[object Object]" && typeof options == "undefined"){
			options = target;
			target = window;
		}
		this.simulateEvent("orientationchange", target, options);
	},
	
	/**
	 * Simulates an scroll event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method scroll
	 * @static
	 */
	scroll : function(target, options){
		target = target || window;
		if(target.toString() == "[object Object]" && typeof options == "undefined"){
			options = target;
			target = window;
		}
		this.simulateEvent("scroll", target, options);
	},
	
	/**
		 * Simulates an scrollStop event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method scroll
	 * @static
	 */
	scrollStop : function(target, options){
		target = target || window;
		if(target.toString() == "[object Object]" && typeof options == "undefined"){
			options = target;
			target = window;
		}
		this.simulateEvent("scrollStop", target, options);
	},
	
	/**
	 * Simulates an resize event on window.
	 * 
	 * @param {Window}
	 *            target The element to act on(default: window).
	 * @param {Object}
	 *            options Additional event options.
	 * @method resize
	 * @static
	 */
	resize : function(target, options){
		target = target || window;
		if(target.toString() == "[object Object]" && typeof options == "undefined"){
			options = target;
			target = window;
		}
		this.simulateEvent("resize", target, options);
	},
    /**
     * Simulates an event on window.
     *
     * @param {Window}
        *            target The element to act on(default: window).
     * @param {Object}
        *            options Additional event options.
     * @method resize
     * @static
     */
    trigger : function(type, target, options){
        target = target || window;
        if(target.toString() == "[object Object]" && typeof options == "undefined"){
            options = target;
            target = window;
        }
        this.simulateEvent(type, target, options);
    }
};

var ta = TouchAction;