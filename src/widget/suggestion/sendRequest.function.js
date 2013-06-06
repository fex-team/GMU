(function ($) {
    gmu.suggestion.option('sendRequest', '*', function () {

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
                    me._render(data, query)._cacheData(query, data);
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