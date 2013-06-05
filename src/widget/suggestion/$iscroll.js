/**
 * @file 搜索建议 - iscroll
 * @name Suggestion - iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议 - iscroll插件，当sug列表需要人滚时需要加载该插件
 * @import widget/suggestion/suggestion.js
 */
(function ($) {
    gmu.suggestion.register('iscroll', {
        _init: function () {
            var me = this,
                opts = me._options;

            me.$content
                .wrapInner(me.$scroller = $('<div class="ui-suggestion-scroller"></div>'))
                .height(opts.height || 66)
                .iScroll({
                    hScroll: false,
                    onRefresh: function () {
                        this.y && this.scrollTo(0, 0);    //更新iScroll时滚回顶部
                    }
                });

            return me;
        },
        _fillWrapper: function (listHtml, query) {
            var me = this;

            me.$clearBtn[query ? 'hide' : 'show']();      //数据不是来自历史记录时隐藏清除历史记录按钮
            if (listHtml) {
                me.show().$scroller.html(listHtml);
                me.$content.iScroll('refresh');
            } else {
                me.hide();
            }
            return me;
        }
    });
})(Zepto);