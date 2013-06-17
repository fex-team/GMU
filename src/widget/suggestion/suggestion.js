/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import core/touch.js
 */
(function( $, win ) {
    var guid = 0;

    gmu.define( 'suggestion', {

        // 默认options
        options: {

            // sug列表条数
            listCount: 50,

            // 发送请求返回数据后是否缓存query
            isCache: true,

            // 是否在localstorage中存储用户查询记录，相当于2.0.5以前版本中的isStorage
            isHistory: true,

            // 多个sug之间是否共享历史记录，可传入指定的key值，相当于2.0.5以前版本中的sSharing + shareName
            historyShare: true,

            // 是否使用+来使sug item进入input框
            usePlus: false,

            // 点击外边是否关闭sug
            autoClose: false,

            // 是否兼容1.x版本中的历史数据
            compatData: false,

            // 发送请求时query的key值
            queryKey: 'wd',

            // 发送请求时callback的name
            cbKey: 'cb',

            // 自定义发送请求函数，可以覆盖默认发送请求的方法
            sendRequest: null,

            // 自定义渲染列表函数，可以覆盖默认渲染列表的方法
            renderList: null
        },

        eventMap: {
            submit: function() {
                this._options.isHistory &&
                        this._localStorage( this.value() ).trigger( 'submit' );
            },

            focus: function() {
                this._showList().trigger( 'open' );
            },

            input: function() {

                // 考虑到在手机上输入比较慢，故进行稀释处理
                this._showList();
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

                } else if ( $.contains( me.$wrapper.get( 0 ),
                        $elem.get( 0 ) ) ) {

                    // 点击sug item
                    setTimeout( function() {    // 防止使用tap造成穿透
                        $input.val( $elem.text() );
                        me.trigger( 'select', [ $elem ] ).hide().$form.submit();
                    }, 400 );
                } else {    // 点击sug外围，sug关闭
                    me.hide();
                }
            },

            click: function( e ) {
                var me = this,
                    target = $( e.target ).closest( 'span' ).get( 0 ),
                    cls = target ? target.className : '';

                if ( cls === 'ui-suggestion-clear' ) {    // 清除历史记录
                    me.history( null );
                } else if ( cls === 'ui-suggestion-close' ) {    // 关闭sug
                    me.getEl().blur();
                    me.hide().trigger( 'close' );
                }

            }
        },

        _initDom: function() {
            var me = this,
                $input = me.getEl().attr( 'autocomplete', 'off' );

            $input.wrap(
                    me.$mask = $( '<div class="ui-suggestion-mask"></div>' ) );

            // 考虑到不涉及到动态渲染数据，故没有采用template
            me.$mask.append(
                    '<div id="ui-suggestion-' + (guid++) +
                    '" class="ui-suggestion">' +
                    '<div class="ui-suggestion-content"></div>' +
                    '<div class="ui-suggestion-button">' +
                    '<span class="ui-suggestion-clear">清除历史记录</span>' +
                    '<span class="ui-suggestion-close">关闭</span></div></div>' );

            me.$wrapper = me.$mask.find( '.ui-suggestion' );
            me.$content = me.$wrapper.css( 'top',
                    $input.height() + parseInt( me.$wrapper.css( 'top' ), 10 ) )
                    .find( '.ui-suggestion-content' );

            me.$btn = me.$wrapper.find( '.ui-suggestion-button' );
            me.$clearBtn = me.$btn.find( '.ui-suggestion-clear' );
            me.$closeBtn = me.$btn.find( '.ui-suggestion-close' );

            return me;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $form = $( opts.form || me.getEl().closest( 'form' ) ),
                hs = opts.historyShare,
                ns = me.ns = '.suggestion',
                eventHandler = $.proxy( me._eventHandler, me );

            me.key = hs ?
                    (($.type( hs ) === 'boolean' ? '' : hs + '-') +
                    'SUG-Sharing-History') : me.getEl().attr( 'id' );

            me.splitor = encodeURIComponent( ',' );    // localStorage中数据分隔符
            opts.isCache && (me.cacheData = {});

            $form.size() && (me.$form = $form
                    .on( 'submit.suggestion', eventHandler ));

            opts.autoClose && $( document ).on( 'tap' + ns, eventHandler );

            me._initDom()
                    .getEl().on( 'focus' + ns + ' input' + ns, eventHandler );

            // 注册tap事件由于中文输入法时，touch事件不能submit
            me.$content.on( 'touchstart' + ns + ' tap' + ns, eventHandler )
                    .find( 'li' ).highlight( 'ui-suggestion-highlight' );

            me.$btn.on( 'click' + ns, eventHandler );

            me.on( 'destroy', function() {
                $form.size() && $form.off( '.suggestion' );
                me.getEl.off('.suggestion');
                me.$wrapper.children().off( '.suggestion' ).remove();
                me.$wrapper.off( '.suggestion' ).remove();
                me.$mask.off( '.suggestion' ).replaceWith( me.getEl() );
            } );

            return me;
        },

        /**
         * 展示suglist，分为query存在和不存在
         * @private
         */
        _showList: function() {
            var me = this,
                query = me.value(),
                data;

            if ( query ) {

                /*
                 * 当query不为空，即input或focus时,input有值
                 * 用户自己发送请求或直接本地数据处理，可以在sendRequest中处理
                 * 故暂不实现source为数据对象时，对数据筛选的逻辑
                 */
                (data = me._cacheData( query )) ? me._render( data, query ) :
                        me.trigger( 'sendRequst',
                        query, me._render, me._cacheData );
            } else {

                // query为空，即刚开始focus时，读取localstorage中的数据渲染
                (data = me._localStorage()) ?
                        me._render({s: data.split( me.splitor )}) : me.hide();
            }

            return me;
        },

        _render: function( data, query ) {
            this.trigger( 'renderList', data.s, query, this._fillWrapper );
        },

        /**
         * 根据数据填充sug wrapper
         * @listHtml 填充的sug片段，默认为'<ul><li>...</li>...</ul>'
         * @query query数据
         * @private
         */
        _fillWrapper: function( listHtml, query ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ query ? 'hide' : 'show' ]();
            listHtml ? (this.$content.html( listHtml ), this.show()) :
                    this.hide();
            return this;
        },

        _eventHandler: function( e ) {
            this.eventMap[ e.type.split( '.' )[ 0 ] ].call( this, e );
        },

        _localStorage: function( value ) {
            var me = this,
                key = me.key,
                splitor = me.splitor,
                localStorage,
                data;

            try {

                // 老的history数据兼容处理
                me._options.compatData && me.trigger( 'compatData' );

                localStorage = win.localStorage;

                if ( value === undefined ) {    // geter
                    return localStorage[ key ];
                } else if ( value === null ) {    // setter clear
                    localStorage[ key ] = '';
                } else if ( value ) {    // setter
                    data = localStorage[ key ] ?
                            localStorage[ key ].split( splitor ) : [];

                    if ( !~$.inArray( value, data ) ) {    // 数据去重处理
                        data.unshift( value );
                        localStorage[ key ] = data.join( splitor );
                    }
                }
            } catch ( ex ) {
                console.log( ex.message );
            }
            return me;
        },

        _cacheData: function( key, value ) {
            return value !== undefined ?
                    this.cacheData[ key ] = value : this.cacheData[ key ];
        },

        /**
         * @desc 获取input值
         * @name value
         * @grammar value() => string
         * @example $('#input').suggestion('value');
         */
        value: function() {
            return this.getEl().val();
        },

        /**
         * @desc 设置|获取|清空历史记录, value:null，清除sug历史记录，value非null为存取
         * @name history
         * @grammer history => self|string
         * @example
         * $('#input').suggestion('history')   //返回当前localstorage中history值
         * $('#input').suggestion('history', 'aa')   //为history增加'aa'值
         * instance.history(null)     //清空当前sug的history
         * */
        history: function( value ) {
            return value === null ?
                    win.confirm( '清除全部查询历史记录？' ) &&
                    (this._localStorage( value ), this.hide()) :
                    this._localStorage( value );
        },

        /**
         * @desc 显示sug
         * @name show
         * @grammer show() => self
         * */
        show: function() {
            this.$wrapper.show();
            return this;
        },

        /**
         * @desc 隐藏sug
         * @name hide
         * @grammer hide() => self
         * */
        hide: function() {
            this.$wrapper.hide();
            return this;
        }
    } );
})( gmu.$, window );
