/**
 * @file 搜索建议 - quickdelete
 * @name Suggestion - iscroll
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议 - iscroll插件，当sug列表需要人滚时需要加载该插件
 * @import widget/suggestion/suggestion.js
 */
(function( gmu, $ ) {

    gmu.suggestion.register( 'quickdelete', {

        _init: function() {
            var me = this,
                $input = me.getEl(),
                ns;

            me.on( 'ready', function() {
                ns = me.ns;

                me.$mask.append( me.$quickDel =
                    $( '<div class="ui-suggestion-quickdel"></div>' ) );

                $input.on('focus' + ns + ' input' + ns, function() {
                    me[ '_quickDel' +
                        ($.trim( $input.val() ) ? 'Show' : 'Hide') ]();
                });

                $input.on( 'blur' + ns, function() {
                    me._quickDelHide();
                });

                me.$quickDel.on( 'touchstart' + ns, function( e ) {
                    e.preventDefault();
                    e.formDelete = true;    // suggestion解决删除问题
                    $input.val('');
                    me.trigger('delete')._quickDelHide();

                    // 中文输入时，focus失效 trace:FEBASE-779
                    $input.blur().focus();
                } );
            } );
        },

        _quickDelShow: function() {

            if ( !this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                        'css', 'visibility', 'visible' );

                this.quickDelShow = true
            }
        },

        _quickDelHide: function() {

            if ( this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                    'css', 'visibility', 'hidden' );

                this.quickDelShow = false
            }
        }
    } );

})( gmu, gmu.$ );