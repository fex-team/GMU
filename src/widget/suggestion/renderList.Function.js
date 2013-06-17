/**
 * @file 搜索建议 - renderList
 * @name Suggestion - renderList
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: renderList，提供默认列表渲染，若需要自己渲染sug列表，即renderList为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js
 */
(function( $ ) {

    /*
     * 默认以jsonp发送请求，当用户在option中配置了renderList时
     * 需要调用用e.preventDefault来阻默认请求数据方法
     * sendRequest( e, sugs, query , callback )
     * @e 事件对象
     * @sugs sug list数据item
     * @query 发送请求的query
     * @callback 列表渲染完成后的回调函数
     * */
    gmu.suggestion.option( 'renderList', function() {

        // 当renderList不是Function类型时，该option操作生效
        return $.type( this._options.renderList ) !== 'function';

    }, function() {
        var _xssFilter = function( str ) {
                return $( '<div></div>' ).text( str ).html();
            };
        this._renderList = function( query, sugs ) {
            var me = this,
                opts = me._options,
                listCount = opts.listCount,
                usePlus = opts.usePlus,
                html = [],
                sug,
                len,
                i;

            if ( !sugs || !sugs.length ) {
                me.hide();
                return html;
            }

            sugs = sugs.slice( 0, listCount );

            // 防止xss注入，通过text()方法转换一下
            query = _xssFilter( query || '' );

            // sug列表渲染比较频繁，故不采用模板来解析
            for ( i = 0, len = sugs.length; i < len; i++ ) {
                sug = sugs[ i ];

                // 若是query为空则不需要进行替换
                query && (sug = $.trim( sug )
                        .replace( query, '<span>' + query + '</span>' ));

                usePlus &&
                        (sug += '<div class="ui-suggestion-plus" data-item="' +
                        sug + '"></div>');
                html.push( '<li>' + sug + '</li>' );
            }

            return html;
        };

        this.on( 'renderList', function( e, data, query, callback ) {
            var ret = this._renderList( query, data );

            // 回调渲染suglist
            return callback.call( this, ret.length ?
                        '<ul>' + ret.join( ' ' ) + '</ul>' : '' );
        } );
    } );

})( gmu.$ );