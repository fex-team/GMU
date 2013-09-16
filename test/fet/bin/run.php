<?php
header( "Content-type: text/html; charset=utf-8" );
header( "Cache-Control: no-cache, max-age=10, must-revalidate" );
error_reporting(E_ERROR|E_WARNING);
if ( !array_key_exists( 'quirk' , $_GET ) ) {
    print '<!DOCTYPE html>';
}
require_once dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "../lib/php/case.class.php";
require dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "../lib/php/filehelper.php";
$c = new Testcase( $_GET[ 'case' ] );
$title = $c->name;
$cov = false;
$release = $_GET['release'];

/*某些环节下起浏览器时会将&符号自动截断，因此这里参数只通过判断字符是否存在来实现*/
foreach ( $_GET as $key => $paras ) {
    if ( $key == 'cov' && $paras == true || strstr( $paras , 'cov=true' ) ) {
        $cov = true;
        break;
    }
    if($s = strpos($paras,'release=')){
        $rel = substr($paras,$s+8,strlen($paras)-1);
        $rel = explode('--__--',$rel);
        $release = $rel[0];
    }
}
?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <title><?php print( "run case $title" );?></title>
    <?php $c->print_js( $title , $cov ,$release); ?>
    <link rel="stylesheet" href="../lib/css/tangramtest.css">
</head>
<body>


<div id="report-div" class="normalTestResult">
    <h1 id="qunit-header"><?php print( $c->name );?></h1>
    <h2 id="qunit-banner"></h2>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
</div>

<input type="button" style="position:fixed;bottom:0px;right:0px; z-index:9998;" id="changeDisplay" value="隐藏测试结果"
       onclick="btnOnClick()">
<script type="text/javascript">
    /*有些情况下希望测试结果可以定制是否显示*/
    var btnOnClick = function () {
        var reportDiv = document.getElementById( 'report-div' );
        var btn = document.getElementById( 'changeDisplay' );
        reportDiv.style.zIndex = 9999;
        if ( $J(reportDiv ).css('display') == 'block' ) {
            btn.value = "显示测试结果";
            $J(reportDiv ).attr('class','hideTestResult');
        } else {
            btn.value = "隐藏测试结果";
            $J(reportDiv ).attr('class','normalTestResult');
        }
    }
</script>
</body>
</html>