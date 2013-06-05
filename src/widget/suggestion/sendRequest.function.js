/**
 * @file 搜索建议 - sendRequest
 * @name Suggestion - sendRequest
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: sendRequest，默认sendRequest为jsonp方式取数据，若用户自己用数据填充sug，即该option为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js
 */
(function ($) {
    gmu.suggestion.option('sendRequest', function () {
        return $.type(this._options.sendRequest) !== 'function';
    }, function () {
        this.on('sendRequst', function (e) {
            var me = this,
                query = e.data,
                opts = me._options,
                url = opts.source,
                param = opts.param,
                cb = 'suggestion_' + (+new Date());      //以date作为后缀，应该不会重复，故不作origin

            if (query) {
                url += (!~url.indexOf("?") ? '?' : '') + '&' + opts.queryKey + '=' + encodeURIComponent(query);
                !~url.indexOf('&' + opts.cbKey) && (url += '&' + opts.cbKey + '=' + cb);
                param && (url += '&' + param);
                window[cb] = function(data) {
                    me._render(data, query)._cacheData(query, data);    //渲染数据并缓存请求数据
                    delete window[cb];
                };
                $.ajax({
                    url: url,
                    dataType: 'jsonp'
                });
            }
            return me;
        });

    });
})(Zepto);