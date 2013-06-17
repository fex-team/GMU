/**
 * @file 搜索建议 - sendRequest
 * @name Suggestion - sendRequest
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: sendRequest，默认sendRequest为jsonp方式取数据，若用户自己用数据填充sug，即该option为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js
 */

(function( $ ) {

    /*
    * 默认以jsonp发送请求，当用户在option中配置了sendRequest时
    * 需要调用用e.preventDefault来阻默认请求数据方法
    * sendRequest( e, query, callback, cacheData )
    * @e 事件对象
    * @query 发送请求的query
    * @callback 渲染数据的回调函数
    * @cacheData 缓存query list的回调方法
    * */
    gmu.suggestion.option( 'sendRequest', function() {

        // 当sendRequest不是Function类型时，该option操作生效
        return $.type( this._options.sendRequest ) !== 'function';

    }, function() {

        this.on( 'sendRequst', function( e, query, callback, cacheData ) {
            var me = this,
                opts = me._options,
                url = opts.source,
                param = opts.param,

                // 以date作为后缀，应该不会重复，故不作origin
                cb = 'suggestion_' + (+new Date());

            if ( query ) {
                url = (url + '&' + opts.queryKey + '=' +
                        encodeURIComponent( query ))
                        .replace( /[&?]{1,2}/, '?' );

                !~url.indexOf( '&' + opts.cbKey ) &&
                        (url += '&' + opts.cbKey + '=' + cb);

                param && (url += '&' + param);

                window[ cb ] = function( data ) {

                    // 渲染数据并缓存请求数据
                    callback.call( me, data, query );
                    cacheData.call( me, query, data );
                    delete window[ cb ];
                };
                $.ajax({
                    url: url,
                    dataType: 'jsonp'
                });
            }
            return me;
        } );

    } );
})( gmu.$ );