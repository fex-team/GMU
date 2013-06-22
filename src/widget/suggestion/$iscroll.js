/**
 * @file 搜索建议 - iscroll
 * @name Suggestion - iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议 - iscroll插件，当sug列表需要人滚时需要加载该插件
 * @import widget/suggestion/suggestion.js, extend/iscroll.js
 */
(function( gmu, $ ) {

    gmu.Suggestion.register( 'iscroll', {

        _init: function() {
            var me = this;

            me.on( 'ready', function() {

                // 增加一层scroller结构
                me.$scroller =
                        $( '<div class="ui-suggestion-scroller"></div>' );

                // 初始化iScroll，若需要设置wrapper高度，可在样式中设max-height
                me.$content
                        .wrapInner( me.$scroller )
                        .iScroll({

                            hScroll: false,

                            onRefresh: function() {

                                // 更新iScroll时滚回顶部
                                this.y && this.scrollTo( 0, 0 );
                            }
                        });

                // 调用iscroll的destroy
                me.on( 'destroy', function() {
                    me.$content.iScroll('destroy');
                } );
            } );

            return me;
        },

        /**
         * 复写_fillWrapper方法，数据及按钮调整顺序
         * */
        _fillWrapper: function( listHtml, query ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ query ? 'hide' : 'show' ]();

            if ( listHtml ) {
                this.show().$scroller.html( listHtml );
                this.$content.iScroll( 'refresh' );

            } else {
                this.hide();
            }

            return this;
        }
    } );

})( gmu, gmu.$ );