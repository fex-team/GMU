/**
 * @file iScroll插件，sug列表使用iScroll展示
 * @import widget/suggestion/suggestion.js, extend/iscroll.js
 */
(function( gmu, $ ) {

    /**
     * iScroll插件，sug列表使用iScroll展示
     * @class iscroll
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
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
        _fillWrapper: function( listHtml ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();

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