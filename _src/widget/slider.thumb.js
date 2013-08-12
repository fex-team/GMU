/**
 * @file Slider － 显示缩略图
 * @name Slider.thumb
 * @short Slider.thumb
 * @desc 此插件主要是用来显示缩略图。
 * @import widget/slider.js, widget/slider.dynamic.js, core/iscroll.js
 */
(function( $ ){
    $.ui.slider.register(function () {
        return {
            pluginName: 'thumb',

            _create: function() {
                var content = this._data.content,
                    thumb = $('<div class="ui-slider-thumb"></div>'),
                    html = '<ul>';

                this._createOrg();

                content.forEach(function( item ){
                    html += '<li><img lazyload="' + item.thumb + '" /></li>';
                });

                html += '</ul>';
                thumb.append( html );
                thumb.insertAfter( this.root() );
                this.$thumb = thumb;
            },

            _init: function() {
                var me = this,
                    lis = me.$thumb.children().children();

                me.$thumb.iScroll({
                    hScroll: true,
                    vScroll: false,
                    onScrollEnd: function() {
                        me._check.call( me, this );
                    }
                });

                me.on( 'slide', function(e, index) {
                    var active = lis.removeClass('ui-state-active').eq(index).addClass('ui-state-active'),
                        iscroll = me.$thumb.iScroll( 'this' );

                    // 调整位置
                    iscroll.scrollTo( Math.max( Math.min( me._data.width/2 - active.width()/2 - active.position().left, 0 ),
                            iscroll.maxScrollX ), 0, 0 );
                });

                me.$thumb.on( 'click', 'li', function() {
                    me.switchTo( $(this).index() );
                });

                me._initOrg();

                me._check();
            },

            _check: function() {
                var imgs = this.$thumb.find( 'img[lazyload]' ),
                    i = 0,
                    len = imgs.length,
                    flag = false,
                    width = this.data( 'width' ),
                    info;

                for( ; i < len; i++ ) {
                    info = imgs[ i ].getBoundingClientRect();

                    if ( info.left + info.width >=0 && info.left <= width ) {
                        imgs[ i ].src = imgs[ i ].getAttribute( 'lazyload' );
                        imgs[ i ].removeAttribute( 'lazyload' );
                    } else if ( flag ) {
                        break;
                    }
                }
            },

            switchTo: function( index ) {
                var content = this._data.content;

                if ( content[ index ] ) {
                    console.log( index );
                    this._active = content[ index ];
                    this.update( content );
                    this.trigger('slide', [index, this._active]);
                }
            }
        }
    });
})( Zepto );