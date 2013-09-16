/**
 * @file renderList
 * @import widget/suggestion/suggestion.js, extend/highlight.js
 */
(function( $ ) {

    $.extend( gmu.Suggestion.options, {

        /**
         * @property {Boolean} [isHistory=true] 是否在localstorage中存储用户查询记录，相当于2.0.5以前版本中的isStorage
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        isHistory: true,

        /**
         * @property {Boolean} [usePlus=false] 是否使用+来使sug item进入input框
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        usePlus: false,

        /**
         * @property {Number} [listCount=5] sug列表条数
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        listCount: 5,

        /**
         * @property {Function} [renderlist=null] 自定义渲染列表函数，可以覆盖默认渲染列表的方法
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        renderlist: null
    } );

    /**
     * renderList，提供默认列表渲染，若需要自己渲染sug列表，即renderList为Function类型，则不需要使用此插件<br />
     * 默认以jsonp发送请求，当用户在option中配置了renderList时，需要调用用e.preventDefault来阻默认请求数据方法
     * @class renderlist
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
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
            };

        me.on( 'ready', function() {
            var me = this,
                ns = me.eventNs,
                $form = $( me._options.form || me.getEl().closest( 'form' ));

            // 绑定form的submit事件
            $form.size() && (me.$form = $form .on( 'submit' + ns,
                    function( e ) {
                        var submitEvent = gmu.Event('submit');

                        me._options.isHistory &&
                        me._localStorage( me.value() );

                        me.trigger( submitEvent );

                        // 阻止表单默认提交事件
                        submitEvent.isDefaultPrevented() && e.preventDefault();
                    }));

            // todo 待验证，新闻页面不会有该bug，待排查原因，中文输入不跳转的bug
            me.$content.on( 'touchstart' + ns, function(e) {
                e.preventDefault();
            });

            // 注册tap事件由于中文输入法时，touch事件不能submit
            me.$content.on( 'tap' + ns, function(e) {
                var $input = me.getEl(),
                    $elem = $( e.target );

                // 点击加号，input值上框
                if ( $elem.hasClass( 'ui-suggestion-plus' ) ) {
                    $input.val( $elem.attr( 'data-item' ) );
                } else if ( $.contains( me.$content.get( 0 ),
                    $elem.get( 0 ) ) ) {

                    // 点击sug item, 防止使用tap造成穿透
                    setTimeout( function() {
                        $input.val( $elem.text() );
                        me.trigger( 'select', $elem )
                            .hide().$form.submit();
                    }, 400 );
                }
            }).highlight( 'ui-suggestion-highlight' );

            me.on( 'destroy', function() {
                $form.size() && $form.off( ns );
                me.$content.off();
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