/**
 * @file compatData
 * @import widget/suggestion/suggestion.js
 */
(function( $, win ) {

    // 是否兼容1.x版本中的历史数据
    gmu.Suggestion.options.compatdata = true;


    /**
     * compatdata插件，兼容用户历史localstorge，gmu 1.x版本用户搜索历史通过','分隔数据，为了解决','不能被存入的问题，现在采用encodeURIComponent(',')来存入数据，故需要兼容老的历史数据。该配置项为true，则开启数据兼容处理
     * @class compatdata
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'compatdata', true, function() {

        this.on( 'ready', function() {
            var key = this.key,
                flagKey = 'SUG-History-DATATRANS',
                localdata,
                dataArr;

            try {
                localdata = win.localStorage[ key ];

                // 兼容老数据，以前以“,”分隔localstorage中的数据，现在改为encodeURIComponent(',')分隔
                if ( localdata && !win.localStorage[ flagKey ] ) {

                    // 存储是否转换过历史数据的标记
                    win.localStorage[ flagKey ] = '\u001e';

                    dataArr = localdata.split( ',' );
                    win.localStorage[ key ] = dataArr.join( this.separator );
                }

            }catch ( e ) {
                console.log( e.message );
            }
        } )
    } );
})( gmu.$, window );