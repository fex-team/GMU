/**
 * @file Button input插件
 * @module GMU
 * @import widget/button/button.js
 */
(function( gmu, $ ) {
    var uid = 0;

    /**
     * Button input插件，让button支持checkbox和radio来实例化。
     *
     * 如:
     * ```html
     * <input type="checkbox" data-label="按钮" />
     * <input type="radio" data-label="按钮" />
     * ```
     *
     * 且此类按钮，点击的时候回自动切换active状态，对应的input的checked值也会变化。
     *
     * @class input
     * @namespace Button
     * @pluginfor Button
     */
    gmu.Button.register( 'input', {
        _getWrap: function( $el ) {
            var id, el, $wrap;

            // 如果是表单元素。
            if ( $el.is( 'input[type="checkbox"], input[type="radio"]' ) ) {
                el = $el.addClass( 'ui-hidden' )[ 0 ];
                (id = el.id) || (el.id = id = 'input_btn_' + uid++);
                $wrap = $( 'label[for=' + id + ']', el.form || el.ownerDocument || undefined );
                $wrap.length || ($wrap = $( '<label for="' + id + '"></label>' ).insertBefore( $el ));

                $el.prop( 'checked' ) && (this._options.state = 'active');
                return $wrap;
            }

            return $el;
        },

        toggle: function() {
            var $el = this.$el;

            if ( $el.is( 'input[type="radio"]' ) ) {
                $radios = $( "[name='" + $el.attr('name') + "']", $el[ 0 ].form
                        || $el[ 0 ].ownerDocument || undefined );

                $radios.button( 'state', 'reset' );
            }
            return this.origin.apply( this, arguments );
        },

        state: function( state ) {
            var $el = this.$el;

            // 设置disabled状态
            if ( $el.is( 'input[type="checkbox"], input[type="radio"]' ) ) {
                $el.prop( 'disabled', state === 'disabled' );
            }

            return this.origin.apply( this, arguments );
        }
    } );


    // dom ready
    $(function() {
        $( document.body ).on( 'click.button',
                'label.ui-btn:not(.ui-state-disabled)', function() {

            $( '#' + this.getAttribute( 'for' ) ).button( 'toggle' );
        });
    });
})( gmu, gmu.$ );