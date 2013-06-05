/**
 * @file 搜索建议 - renderList
 * @name Suggestion - renderList
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: renderList，提供默认列表渲染，若需要自己渲染sug列表，即renderList为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js
 */
(function ($) {
    gmu.suggestion.option('renderList', function () {
        return $.type(this._options.renderList) === 'function';
    }, function () {
        var _xssFilter = function (str) {
                return $('<div></div>').text(str).html();
            };
        this._renderList = function (sugs, query) {
            var me = this,
                opts = me._options,
                listCount = opts.listCount,
                usePlus = opts.usePlus,
                html = [],
                sug,
                len,
                i;

            if (!sugs || !sugs.length) {
                me.hide();
                return html;
            }
            sugs = sugs.slice(0, listCount);
            query = _xssFilter(query || '');     //防止xss注入，通过text()方法转换一下
            //sug列表渲染比较频繁，故不采用模板来解析
            for (i = 0, len = sugs.length; i < len, sug = sugs[i]; i++) {
                query && (sug = $.trim(sug).replace(query, '<span>' + query + '</span>'));    //若是query为空则不需要进行替换
                usePlus && (sug += '<div class="ui-suggestion-plus" data-item="' + sug + '"></div>');     //usePlus为true时
                html.push('<li>' + sug + '</li>');
            }
            return html;
        }
        this.on('renderList', function (e) {
            e.preventDefault();
            var sugs = e.data[0],
                query = e.data[1],
                ret = this._renderList(sugs, query);

            return this._fillWrapper(ret.length ? '<ul>' + this._renderList(sugs, query).join(' ') + '</ul>' : '', query);     //回调渲染suglist
        });
    });

})(Zepto);