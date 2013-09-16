var UserAction = {

	isf /* is function ? */: function(value) {
		return value && (typeof value == 'function');
	},
	isb /* is boolean? */: function(value) {
		return value && (typeof value == 'boolean');
	},
	iso /* is object? */: function(value) {
		return value && (typeof value == 'object');
	},
	iss /* is string? */: function(value) {
		return value && (typeof value == 'string');
	},
	isn /* is number? */: function(value) {
		return value && (typeof value == 'number');
	},
	// --------------------------------------------------------------------------
	// Generic event methods
	// --------------------------------------------------------------------------

	/**
	 * Simulates a key event using the given event information to populate the
	 * generated event object. This method does browser-equalizing calculations
	 * to account for differences in the DOM and IE event models as well as
	 * different browser quirks. Note: keydown causes Safari 2.x to crash.
	 * 
	 * @method simulateKeyEvent
	 * @private
	 * @static
	 * @param {HTMLElement}
	 *            target The target of the given event.
	 * @param {String}
	 *            type The type of event to fire. This can be any one of the
	 *            following: keyup, keydown, and keypress.
	 * @param {Boolean}
	 *            bubbles (Optional) Indicates if the event can be bubbled up.
	 *            DOM Level 3 specifies that all key events bubble by default.
	 *            The default is true.
	 * @param {Boolean}
	 *            cancelable (Optional) Indicates if the event can be canceled
	 *            using preventDefault(). DOM Level 3 specifies that all key
	 *            events can be cancelled. The default is true.
	 * @param {Window}
	 *            view (Optional) The view containing the target. This is
	 *            typically the window object. The default is window.
	 * @param {Boolean}
	 *            ctrlKey (Optional) Indicates if one of the CTRL keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {Boolean}
	 *            altKey (Optional) Indicates if one of the ALT keys is pressed
	 *            while the event is firing. The default is false.
	 * @param {Boolean}
	 *            shiftKey (Optional) Indicates if one of the SHIFT keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {Boolean}
	 *            metaKey (Optional) Indicates if one of the META keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {int}
	 *            keyCode (Optional) The code for the key that is in use. The
	 *            default is 0.
	 * @param {int}
	 *            charCode (Optional) The Unicode code for the character
	 *            associated with the key being used. The default is 0.
	 */
	simulateKeyEvent : function(target /* :HTMLElement */,
			type /* :String */, bubbles /* :Boolean */,
			cancelable /* :Boolean */, view /* :Window */,
			ctrlKey /* :Boolean */, altKey /* :Boolean */,
			shiftKey /* :Boolean */, metaKey /* :Boolean */,
			keyCode /* :int */, charCode /* :int */) /* :Void */
	{
		// check target
		target = typeof target == 'string' ? document.getElementById(target)
				: target;
		if (!target) {
			throw new Error("simulateKeyEvent(): Invalid target.");
		}

		// check event type
		if (typeof type == 'string') {
			type = type.toLowerCase();
			switch (type) {
			case "keyup":
			case "keydown":
			case "keypress":
				break;
			case "textevent": // DOM Level 3
				type = "keypress";
				break;
			// @TODO was the fallthrough intentional, if so throw error
			default:
				throw new Error("simulateKeyEvent(): Event type '" + type
						+ "' not supported.");
			}
		} else {
			throw new Error("simulateKeyEvent(): Event type must be a string.");
		}

		// setup default values
		if (!this.isb(bubbles)) {
			bubbles = true; // all key events bubble
		}
		if (!this.isb(cancelable)) {
			cancelable = true; // all key events can be cancelled
		}
		if (!this.iso(view)) {
			view = window; // view is typically window
		}
		if (!this.isb(ctrlKey)) {
			ctrlKey = false;
		}
		if (!this.isb(typeof altKey == 'boolean')) {
			altKey = false;
		}
		if (!this.isb(shiftKey)) {
			shiftKey = false;
		}
		if (!this.isb(metaKey)) {
			metaKey = false;
		}
		if (!(typeof keyCode == 'number')) {
			keyCode = 0;
		}
		if (!(typeof charCode == 'number')) {
			charCode = 0;
		}

		// try to create a mouse event
		var customEvent /* :MouseEvent */= null;

		// check for DOM-compliant browsers first
		if (this.isf(document.createEvent)) {

			try {

				// try to create key event
				customEvent = document.createEvent("KeyEvents");

				/*
				 * Interesting problem: Firefox implemented a non-standard
				 * version of initKeyEvent() based on DOM Level 2 specs. Key
				 * event was removed from DOM Level 2 and re-introduced in DOM
				 * Level 3 with a different interface. Firefox is the only
				 * browser with any implementation of Key Events, so for now,
				 * assume it's Firefox if the above line doesn't error.
				 */
				// TODO: Decipher between Firefox's implementation and a correct
				// one.
				customEvent.initKeyEvent(type, bubbles, cancelable, view,
						ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode);

			} catch (ex /* :Error */) {

				/*
				 * If it got here, that means key events aren't officially
				 * supported. Safari/WebKit is a real problem now. WebKit 522
				 * won't let you set keyCode, charCode, or other properties if
				 * you use a UIEvent, so we first must try to create a generic
				 * event. The fun part is that this will throw an error on
				 * Safari 2.x. The end result is that we need another
				 * try...catch statement just to deal with this mess.
				 */
				try {

					// try to create generic event - will fail in Safari 2.x
					customEvent = document.createEvent("Events");

				} catch (uierror /* :Error */) {

					// the above failed, so create a UIEvent for Safari 2.x
					customEvent = document.createEvent("UIEvents");

				} finally {

					customEvent.initEvent(type, bubbles, cancelable);

					// initialize
					customEvent.view = view;
					customEvent.altKey = altKey;
					customEvent.ctrlKey = ctrlKey;
					customEvent.shiftKey = shiftKey;
					customEvent.metaKey = metaKey;
					customEvent.keyCode = keyCode;
					customEvent.charCode = charCode;

				}

			}

			// fire the event
			target.dispatchEvent(customEvent);

		} else if (this.iso(document.createEventObject)) { // IE

			// create an IE event object
			customEvent = document.createEventObject();

			// assign available properties
			customEvent.bubbles = bubbles;
			customEvent.cancelable = cancelable;
			customEvent.view = view;
			customEvent.ctrlKey = ctrlKey;
			customEvent.altKey = altKey;
			customEvent.shiftKey = shiftKey;
			customEvent.metaKey = metaKey;

			/*
			 * IE doesn't support charCode explicitly. CharCode should take
			 * precedence over any keyCode value for accurate representation.
			 */
			customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

			// fire the event
			target.fireEvent("on" + type, customEvent);

		} else {
			throw new Error(
					"simulateKeyEvent(): No event simulation framework present.");
		}
	},

	/**
	 * Simulates a mouse event using the given event information to populate the
	 * generated event object. This method does browser-equalizing calculations
	 * to account for differences in the DOM and IE event models as well as
	 * different browser quirks.
	 * 
	 * @method simulateMouseEvent
	 * @private
	 * @static
	 * @param {HTMLElement}
	 *            target The target of the given event.
	 * @param {String}
	 *            type The type of event to fire. This can be any one of the
	 *            following: click, dblclick, mousedown, mouseup, mouseout,
	 *            mouseover, and mousemove.
	 * @param {Boolean}
	 *            bubbles (Optional) Indicates if the event can be bubbled up.
	 *            DOM Level 2 specifies that all mouse events bubble by default.
	 *            The default is true.
	 * @param {Boolean}
	 *            cancelable (Optional) Indicates if the event can be canceled
	 *            using preventDefault(). DOM Level 2 specifies that all mouse
	 *            events except mousemove can be cancelled. The default is true
	 *            for all events except mousemove, for which the default is
	 *            false.
	 * @param {Window}
	 *            view (Optional) The view containing the target. This is
	 *            typically the window object. The default is window.
	 * @param {int}
	 *            detail (Optional) The number of times the mouse button has
	 *            been used. The default value is 1.
	 * @param {int}
	 *            screenX (Optional) The x-coordinate on the screen at which
	 *            point the event occured. The default is 0.
	 * @param {int}
	 *            screenY (Optional) The y-coordinate on the screen at which
	 *            point the event occured. The default is 0.
	 * @param {int}
	 *            clientX (Optional) The x-coordinate on the client at which
	 *            point the event occured. The default is 0.
	 * @param {int}
	 *            clientY (Optional) The y-coordinate on the client at which
	 *            point the event occured. The default is 0.
	 * @param {Boolean}
	 *            ctrlKey (Optional) Indicates if one of the CTRL keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {Boolean}
	 *            altKey (Optional) Indicates if one of the ALT keys is pressed
	 *            while the event is firing. The default is false.
	 * @param {Boolean}
	 *            shiftKey (Optional) Indicates if one of the SHIFT keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {Boolean}
	 *            metaKey (Optional) Indicates if one of the META keys is
	 *            pressed while the event is firing. The default is false.
	 * @param {int}
	 *            button (Optional) The button being pressed while the event is
	 *            executing. The value should be 0 for the primary mouse button
	 *            (typically the left button), 1 for the terciary mouse button
	 *            (typically the middle button), and 2 for the secondary mouse
	 *            button (typically the right button). The default is 0.
	 * @param {HTMLElement}
	 *            relatedTarget (Optional) For mouseout events, this is the
	 *            element that the mouse has moved to. For mouseover events,
	 *            this is the element that the mouse has moved from. This
	 *            argument is ignored for all other events. The default is null.
	 */
	simulateMouseEvent : function(target /* :HTMLElement */,
			type /* :String */, bubbles /* :Boolean */,
			cancelable /* :Boolean */, view /* :Window */,
			detail /* :int */, screenX /* :int */, screenY /* :int */,
			clientX /* :int */, clientY /* :int */, ctrlKey /* :Boolean */,
			altKey /* :Boolean */, shiftKey /* :Boolean */,
			metaKey /* :Boolean */, button /* :int */, relatedTarget /* :HTMLElement */) /* :Void */
	{

		// check target
		target = typeof target == 'string' ? document.getElementById(target)
				: target;
		if (!target) {
			throw new Error("simulateMouseEvent(): Invalid target.");
		}

		// check event type
		if (this.iss(type)) {
			type = type.toLowerCase();
			switch (type) {
			case "mouseover":
			case "mouseout":
			case "mousedown":
			case "mouseup":
			case "click":
			case "dblclick":
			case "mousemove":
			case "mouseenter":// 非标准支持，仅为测试提供，该项仅IE下work
			case "mouseleave":
				break;
			default:
				throw new Error("simulateMouseEvent(): Event type '" + type
						+ "' not supported.");
			}
		} else {
			throw new Error(
					"simulateMouseEvent(): Event type must be a string.");
		}

		// setup default values
		if (!this.isb(bubbles)) {
			bubbles = true; // all mouse events bubble
		}
		if (!this.isb(cancelable)) {
			cancelable = (type != "mousemove"); // mousemove is the only one
			// that can't be cancelled
		}
		if (!this.iso(view)) {
			view = window; // view is typically window
		}
		if (!this.isn(detail)) {
			detail = 1; // number of mouse clicks must be at least one
		}
		if (!this.isn(screenX)) {
			screenX = 0;
		}
		if (!this.isn(screenY)) {
			screenY = 0;
		}
		if (!this.isn(clientX)) {
			clientX = 0;
		}
		if (!this.isn(clientY)) {
			clientY = 0;
		}
		if (!this.isb(ctrlKey)) {
			ctrlKey = false;
		}
		if (!this.isb(altKey)) {
			altKey = false;
		}
		if (!this.isb(shiftKey)) {
			shiftKey = false;
		}
		if (!this.isb(metaKey)) {
			metaKey = false;
		}
		if (!this.isn(button)) {
			button = 0;
		}

		// try to create a mouse event
		var customEvent /* :MouseEvent */= null;

		// check for DOM-compliant browsers first
		if (this.isf(document.createEvent)) {

			customEvent = document.createEvent("MouseEvents");

			// Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
			if (this.browser.ie !== 9 && customEvent.initMouseEvent) {
				customEvent.initMouseEvent(type, bubbles, cancelable, view,
						detail, screenX, screenY, clientX, clientY, ctrlKey,
						altKey, shiftKey, metaKey, button, relatedTarget);
			} else { // Safari

				// the closest thing available in Safari 2.x is UIEvents
				customEvent = document.createEvent("UIEvents");
				customEvent.initEvent(type, bubbles, cancelable);
				customEvent.view = view;
				customEvent.detail = detail;
				customEvent.screenX = screenX;
				customEvent.screenY = screenY;
				customEvent.clientX = clientX;
				customEvent.clientY = clientY;
				customEvent.ctrlKey = ctrlKey;
				customEvent.altKey = altKey;
				customEvent.metaKey = metaKey;
				customEvent.shiftKey = shiftKey;
				customEvent.button = button;
				customEvent.relatedTarget = relatedTarget;
			}

			/*
			 * Check to see if relatedTarget has been assigned. Firefox versions
			 * less than 2.0 don't allow it to be assigned via initMouseEvent()
			 * and the property is readonly after event creation, so in order to
			 * keep YAHOO.util.getRelatedTarget() working, assign to the IE
			 * proprietary toElement property for mouseout event and fromElement
			 * property for mouseover event.
			 */
			if (relatedTarget && !customEvent.relatedTarget) {
				if (type == "mouseout") {
					customEvent.toElement = relatedTarget;
				} else if (type == "mouseover") {
					customEvent.fromElement = relatedTarget;
				}
			}

			// fire the event
			target.dispatchEvent(customEvent);

		} else if (this.iso(document.createEventObject)) { // IE

			// create an IE event object
			customEvent = document.createEventObject();

			// assign available properties
			customEvent.bubbles = bubbles;
			customEvent.cancelable = cancelable;
			customEvent.view = view;
			customEvent.detail = detail;
			customEvent.screenX = screenX;
			customEvent.screenY = screenY;
			customEvent.clientX = clientX;
			customEvent.clientY = clientY;
			customEvent.ctrlKey = ctrlKey;
			customEvent.altKey = altKey;
			customEvent.metaKey = metaKey;
			customEvent.shiftKey = shiftKey;

			// fix button property for IE's wacky implementation
			switch (button) {
			case 0:
				customEvent.button = 1;
				break;
			case 1:
				customEvent.button = 4;
				break;
			case 2:
				// leave as is
				break;
			default:
				customEvent.button = 0;
			}

			/*
			 * Have to use relatedTarget because IE won't allow assignment to
			 * toElement or fromElement on generic events. This keeps
			 * YAHOO.util.customEvent.getRelatedTarget() functional.
			 */
			customEvent.relatedTarget = relatedTarget;

			// fire the event
			target.fireEvent("on" + type, customEvent);

		} else {
			throw new Error(
					"simulateMouseEvent(): No event simulation framework present.");
		}
	},

	// --------------------------------------------------------------------------
	// Mouse events
	// --------------------------------------------------------------------------

	/**
	 * Simulates a mouse event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to click on.
	 * @param {String}
	 *            type The type of event to fire. This can be any one of the
	 *            following: click, dblclick, mousedown, mouseup, mouseout,
	 *            mouseover, and mousemove.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mouseEvent
	 * @static
	 */
	fireMouseEvent : function(target /* :HTMLElement */, type /* :String */,
			options /* :Object */) /* :Void */
	{
		options = options || {};
		this.simulateMouseEvent(target, type, options.bubbles,
				options.cancelable, options.view, options.detail,
				options.screenX, options.screenY, options.clientX,
				options.clientY, options.ctrlKey, options.altKey,
				options.shiftKey, options.metaKey, options.button,
				options.relatedTarget);
	},

	/**
	 * Simulates a click on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to click on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method click
	 * @static
	 */
	click : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
		this.mouseover(target, options);
		this.mousedown(target, options);
		this.mouseup(target, options);
		this.fireMouseEvent(target, "click", options);
	},

	/**
	 * Simulates a double click on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to double click on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method dblclick
	 * @static
	 */
	dblclick : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
		this.fireMouseEvent(target, "dblclick", options);
	},

	/**
	 * Simulates a mousedown on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mousedown
	 * @static
	 */
	mousedown : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireMouseEvent(target, "mousedown", options);
	},

	/**
	 * Simulates a mousemove on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mousemove
	 * @static
	 */
	mousemove : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireMouseEvent(target, "mousemove", options);
	},

	/**
	 * Simulates a mouseout event on a particular element. Use "relatedTarget"
	 * on the options object to specify where the mouse moved to. Quirks:
	 * Firefox less than 2.0 doesn't set relatedTarget properly, so toElement is
	 * assigned in its place. IE doesn't allow toElement to be be assigned, so
	 * relatedTarget is assigned in its place. Both of these concessions allow
	 * YAHOO.util.Event.getRelatedTarget() to work correctly in both browsers.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mouseout
	 * @static
	 */
	mouseout : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireMouseEvent(target, "mouseout", options);
	},

	/**
	 * Simulates a mouseover event on a particular element. Use "relatedTarget"
	 * on the options object to specify where the mouse moved from. Quirks:
	 * Firefox less than 2.0 doesn't set relatedTarget properly, so fromElement
	 * is assigned in its place. IE doesn't allow fromElement to be be assigned,
	 * so relatedTarget is assigned in its place. Both of these concessions
	 * allow YAHOO.util.Event.getRelatedTarget() to work correctly in both
	 * browsers.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mouseover
	 * @static
	 */
	mouseover : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireMouseEvent(target, "mouseover", options);
	},

	/**
	 * Simulates a mouseup on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method mouseup
	 * @static
	 */
	mouseup : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireMouseEvent(target, "mouseup", options);
	},

	dragto : function(target, options) {
		var me = this;
		me.mousemove(target, {
			clientX : options.startX,
			clientY : options.startY
		});
		setTimeout(function() {
			me.mousedown(target, {
				clientX : options.startX,
				clientY : options.startY
			});
			setTimeout(function() {
				me.mousemove(target, {
					clientX : options.endX,
					clientY : options.endY
				});
				setTimeout(function() {
					me.mouseup(target, {
						clientX : options.endX,
						clientY : options.endY
					});
					if (options.callback)
						options.callback();
				}, options.aftermove || 20);
			}, options.beforemove || 20);
		}, options.beforestart || 50);
	},

	// --------------------------------------------------------------------------
	// Key events
	// --------------------------------------------------------------------------

	/**
	 * Fires an event that normally would be fired by the keyboard (keyup,
	 * keydown, keypress). Make sure to specify either keyCode or charCode as an
	 * option.
	 * 
	 * @private
	 * @param {String}
	 *            type The type of event ("keyup", "keydown" or "keypress").
	 * @param {HTMLElement}
	 *            target The target of the event.
	 * @param {Object}
	 *            options Options for the event. Either keyCode or charCode are
	 *            required.
	 * @method fireKeyEvent
	 * @static
	 */
	fireKeyEvent : function(type /* :String */, target /* :HTMLElement */,
			options /* :Object */) /* :Void */
	{
		options = options || {};
		this.simulateKeyEvent(target, type, options.bubbles,
				options.cancelable, options.view, options.ctrlKey,
				options.altKey, options.shiftKey, options.metaKey,
				options.keyCode, options.charCode);
	},

	/**
	 * Simulates a keydown event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method keydown
	 * @static
	 */
	keydown : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
		this.fireKeyEvent("keydown", target, options);
	},

	/**
	 * Simulates a keypress on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method keypress
	 * @static
	 */
	keypress : function(target /* :HTMLElement */, options /* :Object */) /* :Void */{
		this.fireKeyEvent("keypress", target, options);
	},

	/**
	 * Simulates a keyup event on a particular element.
	 * 
	 * @param {HTMLElement}
	 *            target The element to act on.
	 * @param {Object}
	 *            options Additional event options (use DOM standard names).
	 * @method keyup
	 * @static
	 */
	keyup : function(target /* :HTMLElement */, options /* Object */) /* :Void */{
		this.fireKeyEvent("keyup", target, options);
	},

	/**
	 * 提供iframe扩展支持，用例测试需要独立场景的用例，由于异步支持，通过finish方法触发start
	 * <li>事件绑定在frame上，包括afterfinish和jsloaded
	 * 
	 * @param op.win
	 * @param op.nojs
	 *            不加载额外js
	 * @param op.ontest
	 *            测试步骤
	 * @param op.onbeforestart
	 *            测试启动前处理步骤，默认为QUnit.stop();
	 * @param op.onafterfinish
	 *            测试完毕执行步骤，默认为QUnit.start()
	 * 
	 */
	frameExt : function(op) {
		stop();
		op = typeof op == 'function' ? {
			ontest : op
		} : op;
		var pw = op.win || window, w, f, url = '', id = typeof op.id == 'undefined' ? 'f'
				: op.id, fid = 'iframe#' + id;

		op.finish = function() {
			pw.$(fid).unbind();
			setTimeout(function() {
				pw.$('#divf').remove();
				start();
			}, 20);
		};

		if (pw.$(fid).length == 0) {
			/* 添加frame，部分情况下，iframe没有边框，为了可以看到效果，添加一个带边框的div */
			pw.$(pw.document.body).append('<div id="div' + id + '"></div>');
			pw.$('div#div' + id).append('<iframe id="' + id + '" scrolling="no" style="height:150px;width:300px"></iframe>');
		}
		op.onafterstart && op.onafterstart($('iframe#f')[0]);
		var f = '';
		var e = '';
		pw.$('script').each(function() {
			if (this.src && this.src.indexOf('import.php') >= 0) {
				//import.php?f=xxx&e=xxx&cov=xxx
				//url = this.src.split('import.php')[1];
				/[?&]f=([^&]+)/.test(this.src);
				f+=','+RegExp.$1;
				/[?&]e=([^&]+)/.test(this.src);
				e+=RegExp.$1;
			}
		});
		url='?f='+f.substr(1)+'&e='+e;
		if(pw.location.href.indexOf("release=true") > -1)
			url += '&release=true';
        if(pw.location.href.indexOf("cov=true") > -1) //为支持cov模式而修改 田丽丽
            url += '&cov=true';
		var srcpath = '';
		if(location.href.indexOf("/run.do") > 0) {
			srcpath = location.href.replace("run.do","frame.do");
		} else {
			srcpath = cpath + 'frame.php' + url;
		}
		pw.$(fid).one('load', function(e) {
			var w = e.target.contentWindow;
			var h = setInterval(function() {
				if (w.Zepto) {// 等待加载完成，IE6下这地方总出问题
					clearInterval(h);
					op.ontest(w, w.frameElement);
				}
			}, 20);
			// 找到当前操作的iframe，然后call ontest
		}).attr('src', srcpath);
	},

	/**
	 * 
	 * 判断2个数组是否相等
	 * 
	 * @static
	 */
	isEqualArray : function(array1, array2) {
		if ('[object Array]' != Object.prototype.toString.call(array1)
				|| '[object Array]' != Object.prototype.toString.call(array2))
			return (array1 === array2);
		else if (array1.length != array2.length)
			return false;
		else {
			for ( var i in array1) {
				if (array1[i] != array2[i])
					return false;
			}
			return true;
		}
	},

	/***************************************************************************
	 * 
	 * 通用数据模块
	 * 
	 * @static
	 * 
	 **************************************************************************/
	commonData : {// 针对测试文件的路径而不是UserAction的路径
		"testdir" : '../../',
		datadir : (function() {
			var href = '';
			if(location.href.indexOf("/run.do") > 0) {
				href = location.href.split("/run.do")[0] + "/test/fet/data/";
			} else {
				href = location.href.split("/test/")[0] + "/test/fet/data/";
			}
			return href;
		})(),
		currentPath : function() {
			var params = location.search.substring(1).split('&');
			for ( var i = 0; i < params.length; i++) {
				var p = params[i];
				if (p.split('=')[0] == 'case') {
//					var casepath = p.split('=')[1].split('.').join('/');
					var casepath = p.split('=')[1];  //为了支持xx.xx.js类型的文件名而修改 田丽丽
					var href = '';
					if(location.href.indexOf("/run.do") > 0) {
						href = location.href.split('/run.do')[0] + '/test/'
						+ casepath.substring(0, casepath.lastIndexOf('/'))
						+ '/';
					} else {
						href = location.href.split('/test/')[0] + '/test/'
						+ casepath.substring(0, casepath.lastIndexOf('/'))
						+ '/';
					}
					return href;
				}
			}
			return "";
		}
	},

	importsrc : function(src, callback, matcher, exclude, win) {
		/**
		 * 支持release分之，此处应该直接返回
		 */
		if (location.search.indexOf("release=true") >= 0) {
			if (callback && typeof callback == "function")
				callback();
			return;
		}

		win = win || window;
		var doc = win.document;

		var srcpath = '';
		if(location.href.indexOf("/run.do") > 0) {
			srcpath = location.href.split("/run.do")[0]
			+ "/test/fet/bin/import.php";
		} else {
			srcpath =location.href.split("/test/")[0]
			+ "/test/fet/bin/import.php";
		}
		var param0 = src;
		var ps = {
			f : src
		};
		if (exclude)
			ps.e = exclude;
		var param1 = exclude || "";
		var isCov = location.href.match(/cov=true/i);
        /**
         * IE下重复载入会出现无法执行情况
         */
		var head = doc.getElementsByTagName('head')[0];
		var sc = doc.createElement('script');
		sc.type = 'text/javascript';
		sc.src = srcpath + "?f=" + param0 + "&e=" + param1 + (isCov?'&'+isCov : '');
		head.appendChild(sc);

		matcher = matcher || src;
		var mm = matcher.split(",")[0].split(".");
		var h = setInterval(function() {
			var p = win;
			for ( var i = 0; i < mm.length; i++) {
				if(i == mm.length - 1 && mm[i].indexOf("$") > -1){ //如果要加载的是插件
					if (p._addons.length == 1) {
						// console.log(mm[i]);
						return;
					}
				}
				else{
					if (typeof (p[mm[i]]) == 'undefined') {
						// console.log(mm[i]);
						return;
					}
				}
				p = p[mm[i]];
			}
			clearInterval(h)
			h = null;
			if (callback && 'function' == typeof callback)
				callback();
		}, 20);

		// import不到的时候会一直轮询，所以1s之后清除轮询，让用例继续执行
		setTimeout(function(){
			if(h !== null){
				// 抛出异常
				throw Error('import"' + src + '"失败!');
				clearInterval(h);
			}
		}, 1000);
	},

	/* 用于加载css文件，如果没有加载完毕则不执行回调函数 */
	loadcss : function(urls, callback, w, classname, style, value) {
		var w = w || window;
		var document = w.document;
		var links = document.getElementsByTagName('link');
		if(typeof urls == "string")
			var urls = [urls];
		for(var i=0; i< urls.length; i++){
            urls[i] = cpath+'css.php?path='+encodeURIComponent(urls[i]);
			for ( var link in links) {
				if (link.href == urls[i]) {
					callback();
					return;
				}
			}
			var head = document.getElementsByTagName('head')[0];
			var link = head.appendChild(document.createElement('link'));
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", urls[i]);
		}
		var div = document.body.appendChild(document.createElement("div"));
        $J(document).ready(
				function() {
					div.className = classname || 'cssloaded';
					var h = setInterval(function() {
						if ($J(div).css(style || 'width') == value
								|| $J(div).css(style || 'width') == '20px') {
							clearInterval(h);
							document.body.removeChild(div);
							setTimeout(callback, 500);
						}
					}, 20);
				});
	},

	/**
	 * options supported
	 */
	delayhelper : function(oncheck, onsuccess, onfail, timeout) {
		onsuccess = onsuccess || oncheck.onsuccess;
		onfail = onfail || oncheck.onfail || function() {
			fail('timeout wait for timeout : ' + timeout + 'ms');
			start();
		};
		timeout = timeout || oncheck.timeout || 10000;

		oncheck = (typeof oncheck == 'function') ? oncheck : oncheck.oncheck;
		var h1 = setInterval(function() {
			if (!oncheck())
				return;
			else {
				clearInterval(h1);
				clearTimeout(h2);
				typeof onsuccess == "function" && onsuccess();
			}
		}, 20);
		var h2 = setTimeout(function() {
			clearInterval(h1);
			clearTimeout(h2);
			onfail();
		}, timeout);
	},

	browser : (function() {
		var win = window;

		var numberify = function(s) {
			var c = 0;
			return parseFloat(s.replace(/\./g, function() {
				return (c++ == 1) ? '' : '.';
			}));
		},

		nav = win && win.navigator,

		o = {

			/**
			 * Internet Explorer version number or 0. Example: 6
			 * 
			 * @property ie
			 * @type float
			 * @static
			 */
			ie : 0,

			/**
			 * Opera version number or 0. Example: 9.2
			 * 
			 * @property opera
			 * @type float
			 * @static
			 */
			opera : 0,

			/**
			 * Gecko engine revision number. Will evaluate to 1 if Gecko is
			 * detected but the revision could not be found. Other browsers will
			 * be 0. Example: 1.8
			 * 
			 * <pre>
			 * Firefox 1.0.0.4: 1.7.8   &lt;-- Reports 1.7
			 * Firefox 1.5.0.9: 1.8.0.9 &lt;-- 1.8
			 * Firefox 2.0.0.3: 1.8.1.3 &lt;-- 1.81
			 * Firefox 3.0   &lt;-- 1.9
			 * Firefox 3.5   &lt;-- 1.91
			 * </pre>
			 * 
			 * @property gecko
			 * @type float
			 * @static
			 */
			gecko : 0,

			/**
			 * AppleWebKit version. KHTML browsers that are not WebKit browsers
			 * will evaluate to 1, other browsers 0. Example: 418.9
			 * 
			 * <pre>
			 * Safari 1.3.2 (312.6): 312.8.1 &lt;-- Reports 312.8 -- currently the 
			 *                                   latest available for Mac OSX 10.3.
			 * Safari 2.0.2:         416     &lt;-- hasOwnProperty introduced
			 * Safari 2.0.4:         418     &lt;-- preventDefault fixed
			 * Safari 2.0.4 (419.3): 418.9.1 &lt;-- One version of Safari may run
			 *                                   different versions of webkit
			 * Safari 2.0.4 (419.3): 419     &lt;-- Tiger installations that have been
			 *                                   updated, but not updated
			 *                                   to the latest patch.
			 * Webkit 212 nightly:   522+    &lt;-- Safari 3.0 precursor (with native SVG
			 *                                   and many major issues fixed).
			 * Safari 3.0.4 (523.12) 523.12  &lt;-- First Tiger release - automatic update
			 *                                   from 2.x via the 10.4.11 OS patch
			 * Webkit nightly 1/2008:525+    &lt;-- Supports DOMContentLoaded event.
			 *                                   yahoo.com user agent hack removed.
			 * </pre>
			 * 
			 * http://en.wikipedia.org/wiki/Safari_version_history
			 * 
			 * @property webkit
			 * @type float
			 * @static
			 */
			webkit : 0,

			/**
			 * Chrome will be detected as webkit, but this property will also be
			 * populated with the Chrome version number
			 * 
			 * @property chrome
			 * @type float
			 * @static
			 */
			chrome : 0,

			safari : 0,

			firefox : 0,

			/**
			 * The mobile property will be set to a string containing any
			 * relevant user agent information when a modern mobile browser is
			 * detected. Currently limited to Safari on the iPhone/iPod Touch,
			 * Nokia N-series devices with the WebKit-based browser, and Opera
			 * Mini.
			 * 
			 * @property mobile
			 * @type string
			 * @static
			 */
			mobile : null,

			/**
			 * Adobe AIR version number or 0. Only populated if webkit is
			 * detected. Example: 1.0
			 * 
			 * @property air
			 * @type float
			 */
			air : 0,

			/**
			 * Google Caja version number or 0.
			 * 
			 * @property caja
			 * @type float
			 */
			caja : nav && nav.cajaVersion,

			/**
			 * Set to true if the page appears to be in SSL
			 * 
			 * @property secure
			 * @type boolean
			 * @static
			 */
			secure : false,

			/**
			 * The operating system. Currently only detecting windows or
			 * macintosh
			 * 
			 * @property os
			 * @type string
			 * @static
			 */
			os : null

		},

		ua = nav && nav.userAgent,

		loc = win && win.location,

		href = loc && loc.href,

		m;

		o.secure = href && (href.toLowerCase().indexOf("https") === 0);

		if (ua) {

			if ((/windows|win32/i).test(ua)) {
				o.os = 'windows';
			} else if ((/macintosh/i).test(ua)) {
				o.os = 'macintosh';
			} else if ((/rhino/i).test(ua)) {
				o.os = 'rhino';
			}

			// Modern KHTML browsers should qualify as Safari X-Grade
			if ((/KHTML/).test(ua)) {
				o.webkit = 1;
			}
			// Modern WebKit browsers are at least X-Grade
			m = ua.match(/AppleWebKit\/([^\s]*)/);
			if (m && m[1]) {
				o.webkit = numberify(m[1]);

				// Mobile browser check
				if (/ Mobile\//.test(ua)) {
					o.mobile = "Apple"; // iPhone or iPod Touch
				} else {
					m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
					if (m) {
						o.mobile = m[0]; // Nokia N-series, Android, webOS,
						// ex:
						// NokiaN95
					}
				}

				var m1 = ua.match(/Safari\/([^\s]*)/);
				if (m1 && m1[1]) // Safari
					o.safari = numberify(m1[1]);
				m = ua.match(/Chrome\/([^\s]*)/);
				if (o.safari && m && m[1]) {
					o.chrome = numberify(m[1]); // Chrome
				} else {
					m = ua.match(/AdobeAIR\/([^\s]*)/);
					if (m) {
						o.air = m[0]; // Adobe AIR 1.0 or better
					}
				}
			}

			if (!o.webkit) { // not webkit
				// @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316;
				// fi; U;
				// try get firefox and it's ver
				// ssr)
				m = ua.match(/Opera[\s\/]([^\s]*)/);
				if (m && m[1]) {
					o.opera = numberify(m[1]);
					m = ua.match(/Opera Mini[^;]*/);
					if (m) {
						o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
					}
				} else { // not opera or webkit
					m = ua.match(/MSIE\s([^;]*)/);
					if (m && m[1]) {
						o.ie = numberify(m[1]);
					} else { // not opera, webkit, or ie
						m = ua.match(/Gecko\/([^\s]*)/);
						if (m) {
							o.gecko = 1; // Gecko detected, look for revision
							m = ua.match(/rv:([^\s\)]*)/);
							if (m && m[1]) {
								o.gecko = numberify(m[1]);
							}
						}
					}
				}
			}
		}

		return o;
	})(),

	/**
	 * 提供队列方式执行用例的方案，接口包括start、add、next，方法全部执行完毕时会启动用例继续执行
	 */
	functionListHelper : function() {
		var check = {
			list : [],
			start : function() {
				var self = this;
				$(this).bind('next', function() {
					setTimeout(function() {// 避免太深的堆栈
						if (self.list.length == 0)
							start();
						else
							self.list.shift()();
					}, 0);
				});
				self.next();
			},
			add : function(func) {
				this.list.push(func);
			},
			next : function(delay) {
				var self = this;
				if (delay) {
					setTimeout(function() {
						$(self).trigger('next');
					}, delay);
				} else
					$(this).trigger('next');
			}
		};
		return check;
	},
	/**
	 * 判断元素是否显示
	 */
	isShown : function(o) {
		if (!o || (!o.parentNode && o != document))
			return false;

		if (o instanceof String || 'string' == typeof o)
			o = document.getElementById(o);
		if (o == document.body || o.tagName == 'BODY')// IFrame中的body判断可能出错，by
														// bell, 2011-03-29
			return true;

		if (o.style && "none" == o.style.display)
			return false;
		if (o.style && "hidden" == (window.getComputedStyle ? window.getComputedStyle(o, null).visibility : o.currentStyle["visibility"]))
			return false;
		if (o.style && "0" == o.style.opacity)
			return false;
		if (parseInt(o.style.marginLeft) < -2000 || parseInt(o.style.left) < -2000)
			return false;
		if (parseInt(o.offsetHeight) == 0 || parseInt(o.offsetWidth) == 0)
			return false;
		if (o.parentNode && !ua.isShown(o.parentNode))
			return false;
		return true;
    },

    /**
     * 计算当前窗口挂载的事件个数
     */
    eventLength: function(){
        var k = 0;
        for(var i = 0; i < Object.keys($._testObj).length; i ++)
            for(var j = 0; j < Object.keys($._testObj[Object.keys($._testObj)[i]]).length; j ++)
                k ++;
        return k;
    },
    /**
     * 移除指定name的存储
     * @param {String} query url问号后面的字符串，即get请求查询的内容
     * @param {string} split query参数之间的分隔符，默认是&
     * @return {Array} 返回键值对
     */
    getArgs:function (query,split) {
        if(!split){
            split = "&";
        }
        var args = {};
        // Get query string
        var pairs = query.split(split);
        // Break at ampersand
        for(var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            // Look for "name=value"
            if (pos == -1) continue;
            // If not found, skip
            var argname = pairs[i].substring(0,pos);// Extract the name
            var value = pairs[i].substring(pos+1);// Extract the value
            value = decodeURIComponent(value);// Decode it, if needed
            args[argname] = value;
            // Store as a property
        }
        return args;// Return the object
    },

    destroyTest : function(op) {
        stop();
        op = typeof op == 'function' ? {
            ontest : op
        } : op;

        var pw = op.win || window, w, f, url = '', id = typeof op.id == 'undefined' ? 'f'
            : op.id, fid = 'iframe#' + id;

        op.finish = function() {
            $J(fid).unbind();
            setTimeout(function() {
                $J('#divf').remove();
                start();
            }, 20);
        };

        if ($J(fid).length == 0) {
            $J(pw.document.body).append('<div id="div' + id + '"></div>');
            $J('div#div' + id).append('<iframe id="' + id + '" scrolling="no"></iframe>');
        }

        op.onafterstart && op.onafterstart($('iframe#f')[0]);
        var f = '';
        var e = '';
        $J('script').each(function() {
            if (this.src && this.src.indexOf('import.php') >= 0) {
                //import.php?f=xxx&e=xxx&cov=xxx
                //url = this.src.split('import.php')[1];
                /[?&]f=([^&]+)/.test(this.src);
                f+=','+RegExp.$1;
                /[?&]e=([^&]+)/.test(this.src);
                e+=RegExp.$1;
            }
        });

        var cssObj = [];
        $J("link").each(function(){
            if(this.href && !/qunit\.css/.test(this.href) &&
                !/tangramtest\.css/.test(this.href) ){
                cssObj.push(this.href);
            }
        });

        url='?f='+f.substr(1)+'&e='+e;
        if(pw.location.href.indexOf("release=true") > -1)
            url += '&release=true';
        if(pw.location.href.indexOf("cov=true") > -1) //为支持cov模式而修改 田丽丽
            url += '&cov=true';
        url = url+"&destroy=true";
        var srcpath = '';
        if(location.href.indexOf("/run.do") > 0) {
            srcpath = location.href.replace("run.do","frame.do");
        } else {
            srcpath = cpath + 'frame.php' + url;
        }
        $J(fid).one('load', function(e) {
            var w = e.target.contentWindow;
            var h = setInterval(function() {
                if (w.Zepto) {// 等待加载完成，IE6下这地方总出问题
                    clearInterval(h);
                    if(cssObj.length>0){
                        $J(cssObj).each(function(id,cssLine){
                            $J(w.document.head).append("<link type='text/css' rel='stylesheet' href='"+cssLine+"'>")
                        });
                        $J(w.document.body).append("<div id= 'cssLoadTest'class='cssloaded'></div>");
                        var h1 = setInterval(function() {
                            if ($J(w.document.body).find("#cssLoadTest").css('width') == '20px'){
                                clearInterval(h1);
                                $J(w.document.body).find("#cssLoadTest").remove();
                                setTimeout(op.ontest(w, w.frameElement), 20);
                            }
                        }, 20);
                    }else{
                        setTimeout(op.ontest(w, w.frameElement), 20);
                    }

                }
            }, 20);
        }).attr('src', srcpath);
    }
};
var ua = UserAction;
var upath = ua.commonData.currentPath();
var cpath = ua.commonData.datadir;