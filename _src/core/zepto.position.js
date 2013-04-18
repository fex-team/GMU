/**
 *  @file 基于Zepto的位置设置获取组件
 *  @name position
 *  @desc 定位插件
 *  @import core/zepto.extend.js
 */
//offset
(function($, undefined){
    var _offset = $.fn.offset, offset ={};

    /**
     * @name offset
     * @grammar offset()  ⇒ array
     * @grammar offset(coordinates)  ⇒ self
     * @grammar offset(function(index, oldOffset){ ... })  ⇒ self
     * @desc 扩展offset方法，让它支持设置制定坐标。
     * @example $('p').offset({top: 50, left: 50});//将p设置到坐标点（50， 50）位置。
     *
     * $('p').offset(function(index, oldOffset){//将p的位置向做移动50px
     *     oldOffset.left -=50;
     *     return oldOffset;
     * });
     */
    $.fn.offset = function(options){
        //如果传入的不是object，则直接调用老的offset.
        if(!$.isPlainObject(options))return _offset.apply(this, arguments);
        //遍历调用offsets.setOffset。
        return this.each(function(i){
            offset.setOffset( this, options, i );
        });
    }

    //设置offset值
    offset.setOffset = function ( elem, options, i ) {
        var $el = $(elem),
            position = $el.css( "position"),
            curOffset = $el.offset(),
            curCSSTop = $el.css( "top" ),
            curCSSLeft = $el.css( "left" ),
            calculatePosition = ( position === "absolute" || position === "fixed" ) && ~$.inArray("auto", [curCSSTop, curCSSLeft]),
            props = {}, curPosition = {}, curTop, curLeft;

        //如果是static定位，则需要把定位设置成relative，否则top，left值无效。
        position === "static" && $el.css("position", "relative");

        //如果定位是absolute或者fixed，同时top或者left中存在auto定位。
        curPosition = calculatePosition?$el.position():curPosition;
        curTop = curPosition.top || parseFloat( curCSSTop ) || 0;
        curLeft = curPosition.left || parseFloat( curCSSLeft ) || 0;

        //如果options是一个方法，则调用此方法来获取options，同时传入当前offset
        options = $.isFunction( options )?options.call( elem, i, curOffset ):options;

        options.top != null && (props.top = options.top - curOffset.top + curTop);
        options.left != null && (props.left = options.left - curOffset.left + curLeft);

        "using" in options ? options.using.call( elem, props ): $el.css( props );
    }
})(Zepto);

//position
(function ($, undefined) {
    var _position = $.fn.position || function(){
            if (!this.length) return null;
            var offsetParent = this.offsetParent(),
                offset       = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

            parentOffset.top  += parseFloat( offsetParent.css('border-top-width') ) || 0
            parentOffset.left += parseFloat( offsetParent.css('border-left-width') ) || 0

            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            }
        },
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /([\+\-]\d+%?)/,
        rposition = /^\w+/,
        rpercent = /%$/;

    function getOffsets( offsets, width, height ) {
        return [
            parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }

    function parseCss( elem, prop ) {
        return parseInt( elem.css( prop ), 10 ) || 0;
    }

    function getDimensions( elem ) {
        var raw = elem[0];
        return raw.nodeType === 9?{//如果是document
            width: elem.width(),
            height: elem.height(),
            top: 0,
            left: 0
        }: raw == window ? {//如果是window
            width: elem.width(),
            height: elem.height(),
            top: raw.pageYOffset,
            left: raw.pageXOffset
        }: raw.preventDefault && (raw = raw.touches?raw.touches[0]:raw) ? {//如果是event对象
            width: 0,
            height: 0,
            offset: { top: raw.pageY, left: raw.pageX }
        }: elem.offset();
    }

    function getWithinInfo(elem){
        var withinElem = $( elem = (elem || window) ),
            _isWindow = elem == window,
            offset = _isWindow? { left: 0, top: 0 } : withinElem.offset();
        return {
            element: withinElem,
            isWindow: _isWindow,
            offset: offset,
            width: offset.width || withinElem.width(),
            height: offset.height || withinElem.height(),
            scrollLeft: _isWindow?elem.pageXOffset:elem.scrollLeft,
            scrollTop: _isWindow?elem.pageYOffset:elem.scrollTop
        };
    }

    /**
     * @name position
     * @grammar position()  ⇒ array
     * @grammar position(opts)  ⇒ self
     * @desc 获取元素相对于相对父级元素（父级最近为position为relative｜abosolute｜fixed的元素）的坐标位置。
     *
     * 如果传入了opts，则把所选元素设置成制定位置。参数格式如下。
     * - ''my'' //默认为'center'// 设置中心点。可以为'left top', 'center bottom', 'right center'...
     *   同时还可以设置偏移量。如 'left+5 center-20%'。
     * - ''at'' //默认为'center'// 设置定位到目标元素的什么位置。参数格式同my参数一致。
     * - ''of'' //默认为null// 设置目标元素
     * - ''collision'' //默认为null// 碰撞检测回调方法。传入function.
     * - ''within'' //默认为window，碰撞检测对象。
     * - ''using''  传入function，如果没有传入position将通过css方法设置，可以传入一个function在方法中，通过animate方法来设置，这样就有了动画效果，而不是瞬间变化。
     */
    $.fn.position = function (opts) {
        if (!opts || !opts.of) {
            return _position.call(this);
        }
        opts = $.extend({}, opts);//弄个副本

        var atOffset, targetWidth, targetHeight, basePosition, dimensions,
            target = $( opts.of ), tmp, collision,
            within = getWithinInfo( opts.within ),
            offsets = {};

        dimensions = getDimensions( target );
        target[0].preventDefault && (opts.at = "left top");
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        basePosition = {
            left: dimensions.left,
            top: dimensions.top
        };

        $.each( [ "my", "at" ], function() {
            var pos = ( opts[ this ] || "" ).split( " " );

            pos.length ===1 && pos[rhorizontal.test( pos[ 0 ] )?"push":"unshift"]("center");
            pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

            offsets[ this ] = [
                roffset.test(pos[ 0 ]) ? RegExp.$1 : 0,
                roffset.test(pos[ 1 ]) ? RegExp.$1 : 0
            ];
            opts[ this ] = [
                rposition.exec( pos[ 0 ] )[ 0 ],
                rposition.exec( pos[ 1 ] )[ 0 ]
            ];
        });

        basePosition.left += (tmp = opts.at[ 0 ]) === "right"?targetWidth:tmp == "center"?targetWidth / 2:0;
        basePosition.top += (tmp = opts.at[ 1 ]) === "bottom"?targetHeight:tmp == "center"?targetHeight / 2:0;

        atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return this.each(function() {
            var collisionPosition,
                elem = $( this ),
                offset = elem.offset(),
                tmp,
                elemWidth = offset.width,
                elemHeight = offset.height,
                marginLeft = parseCss( elem, "marginLeft" ),
                marginTop = parseCss( elem, "marginTop" ),
                collisionWidth = elemWidth + marginLeft + parseCss( elem, "marginRight" ),
                collisionHeight = elemHeight + marginTop + parseCss( elem, "marginBottom" ),
                position = $.extend( {}, basePosition ),
                myOffset = getOffsets( offsets.my, elemWidth, elemHeight );

            position.left -= (tmp = opts.my[ 0 ]) === "right"?elemWidth:tmp==="center"?elemWidth/2:0;
            position.top -= (tmp = opts.my[ 1 ]) === "bottom"?elemHeight:tmp==="center"?elemHeight/2:0;
            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            position.left = round(position.left);
            position.top = round(position.top);

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.isFunction(collision = opts.collision) && collision.call(this, position, {
                targetWidth: targetWidth,
                targetHeight: targetHeight,
                elemWidth: elemWidth,
                elemHeight: elemHeight,
                collisionPosition: collisionPosition,
                collisionWidth: collisionWidth,
                collisionHeight: collisionHeight,
                offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                my: opts.my,
                at: opts.at,
                within: within,
                elem : elem
            });
            elem.offset( $.extend( position, { using: opts.using } ) );
        });
    }
})(Zepto);