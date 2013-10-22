<?php
$file = isset($_REQUEST['file'])?$_REQUEST['file']:'sample.html';
$debug = isset($_REQUEST['debug'])?intval($_REQUEST['debug']):false;
sleep(2);
$file = ltrim($file, './');
$content = file_exists($file)?file_get_contents($file):'<p>指定的文件不存在</p>';
$content = preg_replace_callback('/\<%=(.*?)%\>/', '_preg_callback', $content);
echo $content;
if($debug){
    echo '<h3>请求的数据</h3>';
    echo '<p>'.htmlspecialchars(print_r($_REQUEST, true)).'</p>';
}

function _preg_callback($m){
    $key = $m[1];
    return isset($_REQUEST[$key])?htmlspecialchars($_REQUEST[$key]):'';
}