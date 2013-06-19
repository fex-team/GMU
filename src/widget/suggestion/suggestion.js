/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import extend/touch.js, extend/parseTpl.js
 */
(function( $, win ) {

    /**
     * @name suggestion
     * @desc   搜索建议组件
     * @grammar     suggestion() => self
     * @grammar     gmu.suggestion([el [,options]]) => self
     * @desc
     * **Options**
     * - ''container'' {Selector}:  (必选)父元素，若为render模式，则为必选，或以(el,options)方式传入
     * - ''source''    {String}:    (必选)请求数据的url，若不自定义sendRequest，则为必选
     * - ''param''     {String}:    (可选)url附加参数
     * - --''formID''--  该参数改名为以下的form参数
     * - ''form''      {String|Dom}:(可选)提交搜索的表单，默认为包含input框的第一个父级form
     * - --''posAdapt''--  位置自适应，该参数已去掉，若需要位置自适应，需加载插件$posAdapt
     * - ''listCount'' {Number}:    (可选)展现sug的条数, 默认: 5
     * - ''isCache''   {Boolean}:        (可选)是否缓存query, 默认: true
     * - --''isStorage''--  该参数改名为以下的isHistory参数
     * - ''isHistory''  {Boolean}:  (可选)是否本地存储pick项: true
     * - --''isSharing''--
     * - --''shareName''--  isSharing+shareName改为以下的historyShare参数
     * - ''historyShare'' {Boolean}: (可选)多个sug之间是否共享历史记录，可传入指定的key值，默认： true
     * - ''autoClose''      {Boolean}: (可选)点击input之外自动关闭，默认：true
     * - ''usePlus''        {Boolean}: (可选)是否启用+号，默认：true
     * - --''status''--   该参数已经去掉，若需要点击关闭后不再出现sug，可在外部close事件中调用destroy
     * - --''useIscroll''--  该参数已经去掉，若需sug内滚，加载$iscroll插件即可
     * - --''height''--  该参数已经去掉，通过listCount确定高度
     * - --''width''--  宽度参数已去掉，在样式中设定
     * - --''minChars''--   该参数已经去掉
     * - --''maxChars''--   该参数已经去掉
     * - --''offset''--     该参数已经去掉，可以在样式中设定
     * - ''**queryKey**''   {String}: (可选)新增参数，发送请求时query的key值，默认：wd
     * - ''**cbKey**''      {String}: (可选)新增参数，发送请求时callback的name，默认：cb
     * - ''**compatData**'' {Boolean}: (可选)新增参数，是否兼容1.x版本中的历史数据，默认为false
     *                                 该参数已作为option拆分出来了
     * - ''renderList''  {Function}:  (可选)自定义渲染下拉列表，//该参数已作为option拆出//
     * - --''renderEvent''-- 该参数已经去掉，现在sug list上的事件通过代理完成，若需要自定义事件，
     *                       可在renderList中处理
     * - ''sendRequest'' {Function}: (可选)用户自定义请求方式  //该参数已作为option拆出//
     * - ''select''  {Function}:  (可选)选中一条sug触发，推荐使用事件方式注册
     * - ''submit''  {Function}:  (可选)提交时触发，推荐使用事件方式注册
     * - ''open''    {Function}:  (可选)sug框展开时触发，推荐使用事件方式注册
     * - ''close''   {Function}:  (可选)sug框关闭时触发，推荐使用事件方式注册
     * **setup方式html规则**
     * <code type="html">
     * <input type="text" id="input">
     * </code>
     * **Demo**
     * <codepreview href="../examples/widget/suggestion/suggestion.html">
     * ../gmu/examples/widget/suggestion/suggestion.html
     * </codepreview>
     */

    var guid = 0;

    gmu.define( 'Suggestion', {

        // 默认options
        options: {

            // 是否在localstorage中存储用户查询记录，相当于2.0.5以前版本中的isStorage
            isHistory: true,

            // 多个sug之间是否共享历史记录，可传入指定的key值，相当于2.0.5以前版本中的isSharing + shareName
            // 若传默认传true，则使用默认key：'SUG-Sharing-History'，若传false，即表示不共享history
            // 若传string，则为该值+'-SUG-Sharing-History'作为key值
            historyShare: true,

            // 点击外边空白区域是否关闭sug
            autoClose: false
        },

        template: {

            // wrapper中content, button, clear, close这几个div必须有，其他的可以更改
            wrapper: '<div id="ui-suggestion-' + (guid++) +
                '" class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">清除历史记录</span>' +
                '<span class="ui-suggestion-close">关闭</span>' +
                '</div></div>'
        },

        eventMap: {

            focus: function() {

                // 当sug已经处于显示状态时，不需要次showlist
                !this.isShow && this._showList().trigger( 'open' );
            },

            input: function() {

                // 考虑到在手机上输入比较慢，故未进行稀释处理
                this._showList();
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
                $input = me.getEl().attr( 'autocomplete', 'off'),
                $parent = $input.parent('ui-suggestion-mask');

            $input.wrap( me.$mask = $parent.length ?
                    $parent : $( '<div class="ui-suggestion-mask"></div>' ) );

            // 考采用template的wrapper项渲染列表
            me.$mask.append( me.tpl2html( 'wrapper' ) );

            me.$wrapper = me.$mask.find( '.ui-suggestion' );
            me.$content = me.$wrapper
                    .css( 'top', $input.height() +
                    parseInt( me.$wrapper.css( 'top' ), 10 ) )
                    .find( '.ui-suggestion-content' );

            me.$btn = me.$wrapper.find( '.ui-suggestion-button' );
            me.$clearBtn = me.$btn.find( '.ui-suggestion-clear' );
            me.$closeBtn = me.$btn.find( '.ui-suggestion-close' );

            return me.trigger('initdom');
        },

        _create: function() {
            var me = this,
                opts = me._options,
                hs = opts.historyShare,
                ns = me.ns = '.suggestion',
                eventHandler = $.proxy( me._eventHandler, me );

            // 若传默认传true，则使用默认key：'SUG-Sharing-History'
            // 若传false，即表示不共享history，以该sug的id作为key值
            // 若传string，则在此基础上加上'SUG-Sharing-History'
            me.key = hs ?
                    (($.type( hs ) === 'boolean' ? '' : hs + '-') +
                    'SUG-Sharing-History') :
                    me.getEl().attr( 'id' ) || ('ui-suggestion-' + (guid++));

            me.separator = encodeURIComponent( ',' );    // localStorage中数据分隔符
            opts.isCache && (me.cacheData = {});

            opts.autoClose && $( document ).on( 'tap' + ns, function( e ) {

                // 若点击是的sug外边则关闭sug
                !$.contains( me.$mask.get( 0 ), e.target ) && me.hide();
            } );

            me._initDom()
                    .getEl().on( 'focus' + ns + ' input' + ns, eventHandler );

            me.$btn.on( 'click' + ns, eventHandler );

            me.on( 'destroy', function() {
                me.getEl().off( ns );
                me.$wrapper.children().off( ns ).remove();
                me.$wrapper.off( ns ).remove();
                me.$mask.off( ns ).replaceWith( me.getEl() );
                opts.autoClose && $( document ).off( ns );
            }).trigger( 'compatdata' );    // 兼容老的历史数据

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

                // 当query不为空，即input或focus时,input有值
                // 用户自己发送请求或直接本地数据处理，可以在sendrequest中处理
                // sendrequest中形参：
                // @query 用户输入查询串
                // @render 数据请求完成后的渲染回调函数，其参数为query,data
                // @cacheData 缓存query的回调函数，其参数为query, data
                me.trigger( 'sendrequest', query, $.proxy( me._render, me ),
                        $.proxy( me._cacheData, me ));

            } else {

                // query为空，即刚开始focus时，读取localstorage中的数据渲染
                (data = me._localStorage()) ?
                        me._render( query, data.split( me.separator ) ) :
                        me.hide();
            }

            return me;
        },

        _render: function( query, data ) {

            // renderList渲染sug list事件，其参数如下
            // @data 渲染的数据，为Array
            // @query 用户输入的查询串
            // @fillWrapper 列表渲染完成后的回调函数，参数为listHtml片段
            this.trigger( 'renderlist', data, query, $.proxy( this._fillWrapper, this ) );
        },

        /**
         * 根据数据填充sug wrapper
         * @listHtml 填充的sug片段，默认为'<ul><li>...</li>...</ul>'
         * @private
         */
        _fillWrapper: function( listHtml ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();
            listHtml ? (this.$content.html( listHtml ), this.show()) :
                    this.hide();

            return this;
        },

        _eventHandler: function( e ) {
            this.eventMap[ e.type ].call( this, e );
        },

        _localStorage: function( value ) {
            var me = this,
                key = me.key,
                separator = me.separator,
                localStorage,
                data;

            try {

                localStorage = win.localStorage;

                if ( value === undefined ) {    // geter
                    return localStorage[ key ];

                } else if ( value === null ) {    // setter clear
                    localStorage[ key ] = '';

                } else if ( value ) {    // setter
                    data = localStorage[ key ] ?
                            localStorage[ key ].split( separator ) : [];

                    // 数据去重处理
                    // todo 对于兼容老格式的数据中有一项会带有\u001e，暂未做判断
                    if ( !~$.inArray( value, data ) ) {
                        data.unshift( value );
                        localStorage[ key ] = data.join( separator );
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

            if ( !this.isShow ) {
                this.$wrapper.show();
                this.isShow = true;
            }

            return this;
        },

        /**
         * @desc 隐藏sug
         * @name hide
         * @grammer hide() => self
         * */
        hide: function() {

            if ( this.isShow ) {
                this.$wrapper.hide();
                this.isShow = false;
            }

            return this;
        }
    } );
})( gmu.$, window );
