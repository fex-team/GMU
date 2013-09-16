<?php header("Content-type: text/html; charset=utf-8");
?>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
<style type="text/css">
* {
	margin: 0;
	padding: 0;
}
</style>
<?php
$release = preg_match('/release=true/i', $_SERVER['QUERY_STRING']);
$cov = preg_match('/cov=true/i', $_SERVER['QUERY_STRING']); //为支持cov模式而修改 田丽丽
if(preg_match('/destroy=true/i', $_SERVER['QUERY_STRING'])){
    print '<script type="text/javascript" src="../lib/js/DestroyTest.js"></script>' . "\n";

}
// 直接引入Zepto
print '<script type="text/javascript" src="../../../dist/zepto.js"></script>' . "\n";
if($release == 0 && array_key_exists('f', $_GET)){
//    print "<script type='text/javascript' src='../lib/js/zepto.js'></script>\n";
	if($cov)
		print "<script type='text/javascript' src='../bin/import.php?f={$_GET['f']}&cov=true'></script>"."\n";
	else
		print "<script type='text/javascript' src='../bin/import.php?f={$_GET['f']}'></script>"."\n";
//	print "<script type='text/javascript' src='../../../src/mobile/iscroll.js'></script>";
}
else{  //为了支持release模式而修改 田丽丽
	 print "<script type='text/javascript' src='../bin/zepto.js'></script>\n";
     print "<script type='text/javascript' src='../bin/iscroll.js'></script>\n";
     print "<script type='text/javascript' src='../bin/gmu.js'></script>\n";
}
?>
<script type="text/javascript">
	parent && parent.ua.onload && parent.ua.onload(window);
</script>
</head>
<body>
</body>
</html>
