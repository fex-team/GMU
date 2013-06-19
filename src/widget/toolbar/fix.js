/**
 * @file Toolbar定位配置
 * @import widget/toolbar/toolbar.js
 */
(function( gmu, $ ) {
    $.extend( true, gmu.Toolbar, {

        // 扩展配置项
        options: {
            fix: true,      // 是否固定位置

            position: 'top' // 默认固顶
        }
    } );

    gmu.Toolbar.option( 'fix', true, function() {
        
        this.on( 'create', function() {
            
        } );
    } );
})( gmu, gmu.$ );