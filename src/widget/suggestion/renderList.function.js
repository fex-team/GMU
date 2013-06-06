(function ($) {
    gmu.suggestion.option('renderList', '*', function () {
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
            query = _xssFilter(query || '');
            for (i = 0, len = sugs.length; i < len, sug = sugs[i]; i++) {
                query && (sug = $.trim(sug).replace(query, '<span>' + query + '</span>'));    //若是query为空则不需要进行替换
                usePlus && (sug += '<div class="ui-suggestion-plus" data-item="' + sug + '"></div>');
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