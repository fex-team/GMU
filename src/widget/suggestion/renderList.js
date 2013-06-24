/**
 * @file 搜索建议 - renderList
 * @name Suggestion - renderList
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: renderList，提供默认列表渲染，若需要自己渲染sug列表，即renderList为Function类型，则该文件可以不用引
 * @import widget/suggestion/suggestion.js, extend/highlight.js
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

    $.extend( gmu.Suggestion.options, {

        // 是否在localstorage中存储用户查询记录，相当于2.0.5以前版本中的isStorage
        isHistory: true,

        // 是否使用+来使sug item进入input框
        usePlus: false,

        // sug列表条数
        listCount: 5,

        // 自定义渲染列表函数，可以覆盖默认渲染列表的方法
        renderlist: null
    } );

    gmu.Suggestion.option( 'renderlist', function() {

        // 当renderList不是Function类型时，该option操作生效
        return $.type( this._options.renderlist ) !== 'function';

    }, function() {

        var me = this,
            $xssElem = $( '<div></div>'),
            _xssFilter = function( str ) {
                return $xssElem.text( str ).html();
            },

            // 渲染sug list列表，返回list array
            _createList = function( query, sugs ) {
                var opts = me._options,
                    html = [],
                    str = '',
                    sug,
                    len,
                    i;

                if ( !sugs || !sugs.length ) {
                    me.hide();
                    return html;
                }

                sugs = sugs.slice( 0, opts.listCount );

                // 防止xss注入，通过text()方法转换一下
                query = _xssFilter( query || '' );

                // sug列表渲染比较频繁，故不采用模板来解析
                for ( i = 0, len = sugs.length; i < len; i++ ) {
                    str = _xssFilter( sug = sugs[ i ] );

                    // 若是query为空则不需要进行替换
                    query && (str = $.trim( sug )
                        .replace( query, '<span>' + query + '</span>' ));

                    opts.usePlus &&
                            (str += '<div class="ui-suggestion-plus" ' +
                                'data-item="' + sug + '"></div>');

                    html.push( '<li>' + str + '</li>' );
                }

                return html;
            },
            eventHandler,
            $form,
            ns;

        me.on( 'ready', function() {
            ns = me.ns;
            $form = $( me._options.form || me.getEl().closest( 'form' ) );
            eventHandler = $.proxy( me._eventHandler, me );

            // 扩展sug事件
            $.extend( me.eventMap, {

                submit: function(e) {
                    var submitEvent = gmu.Event('submit');

                    this._options.isHistory &&
                            this._localStorage( this.value() );

                    this.trigger( submitEvent );
                    // 阻止表单默认提交事件
                    submitEvent.isDefaultPrevented() && e.preventDefault();
                },

                touchstart: function( e ) {

                    // todo 待验证，新闻页面不会有该bug，待排查原因，中文输入不跳转的bug
                    e.preventDefault();
                },

                tap: function( e ) {
                    var me = this,
                        $input = me.getEl(),
                        $elem = $( e.target );

                    // 点击加号，input值上框
                    if ( $elem.hasClass( 'ui-suggestion-plus' ) ) {
                        $input.val( $elem.attr( 'data-item' ) );

                    } else if ( $.contains( me.$content.get( 0 ),
                        $elem.get( 0 ) ) ) {

                        // 点击sug item
                        setTimeout( function() {    // 防止使用tap造成穿透
                            $input.val( $elem.text() );
                            me.trigger( 'select', $elem )
                                    .hide().$form.submit();
                        }, 400 );
                    }
                }
            } );

            // 绑定form的submit事件
            $form.size() && (me.$form = $form
                .on( 'submit' + ns, eventHandler ));

            // 注册tap事件由于中文输入法时，touch事件不能submit
            this.$content.on( 'touchstart' + ns + ' tap' + ns, eventHandler)
                    .highlight( 'ui-suggestion-highlight' );

            me.on( 'destroy', function() {
                $form.size() && $form.off( ns );
            } );
        } );

        me.on( 'renderlist', function( e, data, query, callback ) {
            var ret = _createList( query, data );

            // 回调渲染suglist
            return callback( ret.length ?
                        '<ul>' + ret.join( ' ' ) + '</ul>' : '' );
        } );
    } );

})( gmu.$ );