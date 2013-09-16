/*用例运行的结果*/
window.tr = {};
/*覆盖率信息*/
window.covinfo = {};
///*用例运行结果*/
//tr.caseResult = {};

function run( currCase, runnext ) {
        /*是否所有用例都运行完毕*/
     window._isJSFinished = false;
    window.document.title = currCase;
    var wb = window.brtest = window.brtest || {};
    wb.timeout = wb.timeout || 50000;
    wb.breakOnError = /breakonerror=true/gi.test( location.search )
        || $J( 'input#id_control_breakonerror' ).attr( 'checked' );
    wb.runnext = /batchrun=true/gi.test( location.search ) || runnext
        || $J( 'input#id_control_runnext' ).attr( 'checked' );
    wb.kiss = currCase;
    var cid = 'id_case_' + currCase.split( '.' ).join( '__' );
    /* 只有参数有showsrconly的时候才显示div */
    if ( /showsrconly=true/gi.test( location.search ) ) {
        var div = document.getElementById( 'id_showSrcOnly' );
        div.style.display = 'block';
    }
    /* id中由于嵌入用例名称，可能存在导致通过id直接$无法正确获取元素的情况 */
    wb.kissnode = $J( document.getElementById( cid ) );
    wb.kisses = wb.kisses || {};
    // 把没有用例的情况加入到报告中
    if ( !wb.kisslost ) {
        $J( 'div#id_showSrcOnly a' ).each( function () {
            wb.kisses[this.title] = '0,0,_,0,0';
        } );
        wb.kisslost = true;
    }
    wb.kisscov = wb.kisscov || {};

//    var wbkiss = wb.kisses[wb.kiss] = wb.kisses[wb.kiss] || '';
    /**
     * 超时处理
     */
    var toh = setTimeout( function () {
        if ( !window.brtest.breakOnError )
            $J( wb ).trigger( 'done', [ new Date().getTime(), {
                failed:1,
                passed:1
            }, frames[0].$_jscoverage, 'timeout' ] );
    }, wb.timeout );

    /**
     * 为当前用例绑定一个一次性事件
     */
    $J( wb ).one( 'done', function ( event, time, result, covinfo ) {
        clearTimeout( toh );
        var wb = window.brtest, errornum = result.failed;
        wb.kissend = new Date().getTime();
        wb.kissnode.removeClass( 'running_case' );
        /*
         * ext_qunit.js的_d方法会触发done事件
         * top.$J(wbkiss).trigger('done', [ new Date().getTime(), args ]); new Date().getTime()指向a参数，args指向b参数
         */
        if ( errornum > 0 ) {
            wb.kissnode.addClass( 'fail_case' );
            // wb.kisses[kiss + '_error'] =
            // window.frames[0].innerHTML;
        } else
            wb.kissnode.addClass( 'pass_case' );
        if ( wb.runnext && (!wb.breakOnError || parseInt( wb.kisses[wb.kiss].split( ',' )[0] ) == 0) ) {
            var nextA = wb.kissnode.next()[0];
            if ( nextA.tagName == 'A' ) {
                if ( wb.kisses[nextA.title] === undefined ) {
                    run( nextA.title, wb.runnext );
                    if(/platform=mtc/.test(location.href)){
                        var args = ua.getArgs(location.search,'--__--');
                        var url = args['host']+":"+args['port'];
                        //通知mtc平台任务结束
                        $J.getJSON(url);
                    }
                }
            } else {
                /* 隐藏执行区 */
//                $J('div#id_runningarea').toggle();
                if(/platform=mtn/.test(location.href)){
                    te.exit(function(){
                        te.killbrow();
                    });
                }else{
                    var args = ua.getArgs(location.search.substring( 1 ),'--__--');
                    var url = args['host']+":"+args['port']+'/EXIT';
                    setTimeout(function(){
                        //通知mtc平台任务结束
                        $J.getJSON(url);
                    },50);

                }
            }
        }
    } );

    /**
     * 初始化执行区并通过嵌入iframe启动用例执行
     */
    var url = 'run.php?case=' + currCase + '&time=' + new Date().getTime() + "&"
        + location.search.substring( 1 );

    var fid = 'id_frame_' + currCase.split( '.' ).join( '_' );
    wb.kissnode.addClass( 'running_case' );
    if ( $J( 'input#id_control_hidelist' ).attr( 'checked' ) )
        $J( 'div#id_testlist' ).css( 'display', 'none' );
    /* 隐藏报告区 */
    $J( 'div#id_reportarea' ).empty().hide();
    /* 展示执行区 */
    $J( 'div#id_runningarea' ).empty().css( 'display', 'block' ).append( '<iframe id="' + fid + '" src="' + url + '" class="runningframe"></iframe>' );
//    wb.kissstart = new Date().getTime();
}
;

/**
 * 为批量运行提供入口，参数携带batchrun=true
 */
$J( document ).ready(
    function () {
        if ( location.href.search( "batchrun=true" ) > 0
            || $J( 'input#id_control_runnext' ).attr( 'checked' ) ) {
            run( $J( 'div#id_testlist a' ).attr( 'title' ), true );
        }
    } );
