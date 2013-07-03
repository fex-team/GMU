/**
 * @file 搜索建议 - sendRequest
 * @name Suggestion - sendRequest
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: sendRequest，默认sendRequest为jsonp方式取数据，若用户自己用数据填充sug，即该option为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js
 */

(function( $, win ) {

    /*
    * 默认以jsonp发送请求，当用户在option中配置了sendRequest时
    * 需要调用用e.preventDefault来阻默认请求数据方法
    * sendRequest( e, query, callback, cacheData )
    * @e 事件对象
    * @query 发送请求的query
    * @callback 渲染数据的回调函数
    * @cacheData 缓存query list的回调方法
    * */

    $.extend( gmu.Suggestion.options, {

        // 发送请求返回数据后是否缓存query请求结果
        isCache: true,

        // 发送请求时query的key值
        queryKey: 'wd',

        // 发送请求时callback的name
        cbKey: 'cb',

        // 自定义发送请求函数，可以覆盖默认发送请求的方法
        sendrequest: null
    } );

    gmu.Suggestion.option( 'sendrequest', function() {

        // 当sendRequest不是Function类型时，该option操作生效
        return $.type( this._options.sendrequest ) !== 'function';

    }, function() {
        var me = this,
            opts = me._options,
            queryKey = opts.queryKey,
            cbKey = opts.cbKey,
            param = opts.param,
            isCache = opts.isCache,
            cdata;

        this.on( 'sendrequest', function( e, query, callback, cacheData ) {

            var url = opts.source,

            // 以date作为后缀，应该不会重复，故不作origin
                cb = 'suggestion_' + (+new Date());

            // 若缓存中存数请求的query数据，则不发送请求
            if ( isCache && (cdata = cacheData( query )) ) {
                callback( query, cdata );
                return me;

            }

            // 替换url后第一个参数的连接符?&或&为?
            url = (url + '&' + queryKey + '=' + encodeURIComponent( query ))
                    .replace( /[&?]{1,2}/, '?' );

            !~url.indexOf( '&' + cbKey ) &&  (url += '&' + cbKey + '=' + cb);

            param && (url += '&' + param);

            win[ cb ] = function( data ) {

                /*
                 * 渲染数据并缓存请求数据
                 * 返回的数据格式如下：
                 * {
                 *     q: "a",
                 *     p: false,
                 *     s: ["angelababy", "akb48", "after school",
                 *     "android", "angel beats!", "a pink", "app"]
                 * }
                 */
                callback( query, data.s );

                // 缓存请求的query
                isCache && cacheData( query, data.s );

                delete win[ cb ];
            };

            // 以jsonp形式发送请求
            $.ajax({
                url: url,
                dataType: 'jsonp'
            });

            return me;
        } );

    } );
})( gmu.$, window );