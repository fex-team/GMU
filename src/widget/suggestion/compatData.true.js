/**
 * @file 搜索建议 - compatData
 * @name Suggestion - compatData
 * @desc <qrcode align="right" title="Live Demo">../gmu/examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议option: compatData，兼容用户历史localstorge，gmu 1.x版本用户搜索历史通过','分隔数据，为了解决','不能被存入的问题，现在采用encodeURIComponent(',')
 * 来存入数据，故需要兼容老的历史数据。该配置项为true，则开启数据兼容处理
 * @import widget/suggestion/suggestion.js
 */
(function( $, win ) {

    gmu.suggestion.option( 'compatData', true, function() {

        this.on( 'compatData.suggestion', function() {
            var me = this,
                key = me.key,
                localdata = win.localStorage[ key ],
                dataArr;

            // 兼容老数据，以前以“,”分隔localstorage中的数据，现在改为encodeURIComponent(',')分隔
            if ( localdata && !~localdata.indexOf( '\u001e' ) ) {
                localdata = localdata + '\u001e';
                dataArr = localdata.split( ',' );
                win.localStorage[ key ] = dataArr.join( key );
            }
        } );

    } );
})( gmu.$, window );