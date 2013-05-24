(function($) {

    var
        // 调用此方法，可以减小重复实例化Zepto的开销。
        staticCall = (function() {
            var proto = $.fn,

                // 公用此zepto实例
                instance = $();

            instance.length = 1;

            return function(item, fn) {
                instance[0] = item;
                return proto[fn].apply(instance, $.slice(arguments, 2));
            }
        })(),

        cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

        // todo 检测3d是否支持。
        translateZ = ' translateZ(0)';

    $.ui.define('slider', {
        _data: {
            viewNum: 1,
            itemRender: null,
            imgZoom: false,
            loop: false,
            stopPropagation: false,
            autoPlay: true,
            autoPlayTime: 4000, // intervel
            animationTime: 400, // speed
            showArr: true, // arrow available
            showDot: true, // dot available
            slide: null,
            slideend: null,
            index: 0,
            containerSelector: '.ui-slider-group', // 容器的选择器
            dotSelector: '.ui-slider-dots', // 所有点父级的选择器
            prevSelector: '.ui-slider-pre', // 上一张按钮选择器
            nextSelector: '.ui-slider-next' // 下一张按钮选择器
        },

        // 确保有个div
        _create: function() {
            this.root() || this.root('<div></div>');
        },

        // 根据opts.content里面的数据挨个render插入到container中
        _createItems: function(container) {
            var opts = this._data,
                items = opts.content,
                i = 0,
                len = items.length,
                render = opts.itemRender || this._itemRender;

            for (; i < len; i++) {
                container.append(render.call(this, items[i]));
            }
        },

        // 初始化dom节点相关。
        _initDom: function() {
            var $el = this.root(),
                opts = this._data,
                viewNum = opts.viewNum,
                render,
                container,
                dot,
                prev,
                next,
                items;

            // 检测容器节点是否指定
            container = $el.find(opts.containerSelector);

            // 没有指定容器则创建容器
            if (!container.length) {
                container = $('<div></div>');

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if (!opts.content) {
                    container.append($el.children());
                } else {
                    this._createItems(container.empty());
                }

                container.appendTo($el);
            }

            // 检测是否构成循环条件
            if ((items = container.children()).length < viewNum + 1) {
                opts.loop = false;
            }

            // 如果节点少了，需要复制几份
            while (opts.loop && container.children().length < 3 * viewNum) {
                container.append(items.clone());
            }

            this.length = items.length;

            this._items = (this._container = container)
                .addClass('ui-slider-group')
                .children()
                .addClass('ui-slider-item')
                .toArray();

            // 处理dot节点
            if (opts.showDot) {
                dot = $el.find(opts.dotSelector);

                if (!dot.length) {
                    dot = $('<p>' +
                        (new Array(this.length + 1))
                        .join('<b></b>') + '</p>')
                        .appendTo($el);
                }

                this._dots = dot
                    .addClass('ui-slider-dots')
                    .children()
                    .toArray();
            }

            // 处理prev next
            if (opts.showArr) {
                prev = $el.find(opts.prevSelector);
                prev.length || (prev = $('<span class="ui-slider-pre"><b></b></span>').appendTo($el));
                this._prev = prev;

                next = $el.find(opts.nextSelector);
                next.length || (next = $('<span class="ui-slider-next"><b></b></span>').appendTo($el));
                this._next = next;
            }

            $el.addClass('ui-slider');
        },

        _init: function() {
            var me = this,
                $el = this.root(),
                opts = this._data,
                viewNum = opts.viewNum,
                index = this.index = opts.index,
                i = 0,
                factor,
                width,
                perWidth,
                items;

            this._initDom();

            this.width = width = $el.width();
            this.perWidth = perWidth = width / viewNum;

            items = this._items;
            this._slidePos = new Array(items.length);

            factor = index % viewNum;
            for (len = items.length; i < len; i++) {
                staticCall(items[i], 'css', {
                    width: perWidth + 'px',
                    left: (i * -perWidth) + 'px'
                })
                    .attr('data-index', i);

                i % viewNum === factor && this._move(i, i < index ? -width : i > index ? width : 0, 0, Math.min(viewNum, len -i ));
            }
            this._container.css('width', perWidth * len);

            this._updateDots(index);

            // 绑定各种事件
            this._prev && this._prev.on('click.slider', function(){
                me.prev( opts.fullpage );
            });

            this._next && this._next.on('click.slider', function(){
                me.next( opts.fullpage );
            });

            this._container.on(transitionEnd+'.slider', $.proxy(this._tansitionEnd, this));
        },

        _move: function(index, dist, speed, count, immediate) {
            var opts = this._data,
                perWidth = this.perWidth,
                i = 0,
                slidePos = this._slidePos,
                _index,
                _dist;

            count = count || opts.viewNum;

            for (; i < count; i++) {
                _dist = dist + i * perWidth;
                _index = this._circle( index + i );

                if (slidePos[_index] === _dist) {
                    continue;
                }

                this._translate(_index, _dist, speed);
                slidePos[_index] = _dist;    // 记录目标位置

                // 强制一个reflow
                immediate && this._items[ _index ].clientLeft;
            }
        },

        _translate: function(index, dist, speed) {
            var opts = this._data,
                slide = this._items[index],
                props = {};

            props[cssPrefix + 'transition-duration'] = speed + 'ms';
            props[cssPrefix + 'transform'] = 'translateX(' + dist + 'px)' + translateZ;

            staticCall(slide, 'css', props);
        },

        _circle: function(index) {
            var items = this._items;
            return ((items.length << 4) + index) % items.length;
        },

        _itemRender: function(item) {
            return '<div class="ui-slider-item">' +
                '<a href="' + item.href + '">' +
                '<img src="' + item.pic + '"/></a>' +
                (item.title ? '<p>' + item.title + '</p>' : '') +
                '</div>';
        },

        prev: function( fullpage ) {
            var opts = this._data,
                viewNum = opts.viewNum;

            if (opts.loop || this.index > 0) {
                this.slideTo(this.index - (fullpage ? viewNum : 1));
            }
        },

        next: function( fullpage ) {
            var opts = this._data,
                viewNum = opts.viewNum;

            if (opts.loop || this.index + viewNum - 1 < this.length - 1) {
                this.slideTo(this.index + (fullpage ? viewNum : 1) );
            }
        },

        slideTo: function(to, speed) {
            if (this.index === to || this.index === this._circle(to) ) {
                return;
            }

            var opts = this._data,
                viewNum = opts.viewNum,
                index = this.index,
                len = this._items.length,
                diff = Math.abs(index - to),

                // 1向左，-1向右
                dir = diff / (index - to),
                width = this.width;

            to = this._circle(to);

            // 如果不是loop模式，以实际位置的方向为准
            if( !opts.loop ) {
                dir = Math.abs(index - to) / (index - to); 
            }

            diff %= len;

            // 相反的距离比viewNum小，不能完成流畅的滚动。
            if( len - diff < viewNum ) {
                diff = len - diff;
                dir = -1 * dir;
            }

            // 准备to的位置
            if( diff < viewNum ) {
                this._move( to, -dir * this.perWidth * diff, 0, viewNum, true );
            } else {
                this._move( to, -width * dir, 0, viewNum, true );
            }

            this._move( index, Math.min(diff, viewNum) * this.perWidth * dir, speed || opts.animationTime);
            this._move( to, 0, speed || opts.animationTime );

            this._updateDots(to, index);
            this.index = to;
            this.trigger('slide', [to, index]);
        },

        _updateDots: function(to, from) {
            var dots = this._dots;

            if( !dots ) {
                return this;
            }

            typeof from === 'undefined' || staticCall(dots[from%this.length], 'removeClass', 'ui-slider-dot-select');
            staticCall(dots[to%this.length], 'addClass', 'ui-slider-dot-select');
        },

        _tansitionEnd: function( e ){
            if( ~~staticCall(e.target, 'attr', 'data-index') !== this.index ) {
                return false;
            }
            this.trigger('slideend', this.index);
        }

    });

})(Zepto);