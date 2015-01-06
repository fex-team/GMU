<?php
$file = isset($_REQUEST['file'])?$_REQUEST['file']:'sample.html';
// $debug = isset($_REQUEST['debug'])?intval($_REQUEST['debug']):false;
sleep(2);
$file = ltrim($file, './');

$whiteList = array("baike1.json", "baike2.json", "sample.html", "sample.json", "tabs.html");
if (!in_array($file, $whiteList)) {
    header("HTTP/1.0 404 Not Found");
    exit(1);
}

$content = file_exists($file)?file_get_contents($file):'<p>指定的文件不存在</p>';
$content = preg_replace_callback('/\<%=(.*?)%\>/', '_preg_callback', $content);
echo $content;
// if($debug){
//     echo '<h3>请求的数据</h3>';
//     echo '<p>'.htmlspecialchars(print_r($_REQUEST, true)).'</p>';
// }

function _preg_callback($m){
    $key = $m[1];
    return isset($_REQUEST[$key])&&is_string($_REQUEST[$key])?htmlspecialchars($_REQUEST[$key]):'';
}
