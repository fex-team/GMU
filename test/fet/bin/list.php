<?php
    header( "Content-type: text/html; charset=utf-8" );
    /*某些环节下起浏览器时会将&符号自动截断，因此这里参数只通过判断字符是否存在来实现*/
    $filter = "*";
    $uri = $_SERVER["REQUEST_URI"];

    if(strstr($uri,"--__--")){
        foreach ( $_GET as $key => $paras ) {
            if ( $key == 'filter'){
                $filter = $_GET[ 'filter' ];
                $para = explode("--__--",$filter);
                $filter = $para[0];
                break;
            }else
                if(strstr( $paras , 'filter=' ) ) {
                    $para = explode("--__--",substr($paras,strpos($paras,"filter=")));
                    $filter = str_replace("filter=","",$para[0]);
                    break;
                }else{
                    $filter = "*";
                }
        }

    }else{
        if ( isset($_GET['filter'])){
            $filter = $_GET[ 'filter' ];
        }
    }
if(!$filter){
    $filter = '*';
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>js组件 Test Index Page</title>
    <?php
    require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "../lib/php/case.class.php";
    Testcase::print_common_js();?>
    <script type="text/javascript" src="../lib/js/run.js"></script>
    <script type="text/javascript" src="../lib/js/calcov.js"></script>
    <link media="screen" href="../lib/css/tangramtest.css" type="text/css" rel="stylesheet"/>
    <script type="text/javascript">
        $J( document ).ready(
            function () {
                if ( location.href.search( "batchrun=true" ) > 0
                    || $J( 'input#id_control_runnext' ).attr( 'checked' ) ) {
                    var search = location.search.substring(1);
                    if(/platform=mtn/.test(search)&&/autoshot=true/.test(search)){
                        te.autoshot();
                    }

                }
            } );
    </script>
</head>
<body>
<div id="title">
    <h1>web app Test Index Page</h1>

    <p>
        web app
    </p>
</div>


<div id="id_control" class="control">
    <input id="id_control_runnext" type="checkbox"/>自动下一个<input
    id="id_control_breakonerror" type="checkbox"/>出错时终止<input
    id="id_control_clearstatus" type="button" value="清除用例状态"
    onclick="$J('.testlist a').removeClass('running_case pass_case fail_case');"/>
</div>
<div>
    <a id="id_testlist_status" class="button"> <span
        onclick="$J('div#id_testlist').slideToggle('slow');"> 折叠用例 </span> </a>
    <a id="id_srconly" class="button"><span
        onclick="$J('#id_runningarea').slideToggle('slow');">折叠执行</span> </a>
</div>
<div style="clear: both"></div>
<div id="id_testlist" class="testlist">
    <?php
    /*分析所有源码与测试代码js文件一一对应的文件并追加到当前列表中*/
    Testcase::listcase( $filter );
    ?>
    <div style="clear: both; overflow: hidden"></div>
</div>
<script>
    /*jiangshuguang 在android2.3和ios4上，用例列表不能滚动  overflow-y: scroll; */
    var isIos4= navigator.userAgent.match(/(iPhone\sOS)\s\d+_/)?navigator.userAgent.match(/(iPhone\sOS)\s\d+_/)[0].match(/\d/)[0]==4:false;
    (/Android.*2\.3/.test(navigator.userAgent) || isIos4) || $J(".testlist").css("max-height","200px");
</script>
<div id="id_runningarea" class="runningarea"
     style="border: solid; display: none"></div>
<div id="id_reportarea" class="reportarea" style="display: none;"></div>
<div class='clear'></div>
<div id="id_showSrcOnly" class="testlist" style="display: none;">
    <div class="clear"></div>
</div>
</body>
</html>
