<?php
$file = isset($_REQUEST['file'])?$_REQUEST['file']:'sample.html';
$debug = isset($_REQUEST['debug'])?intval($_REQUEST['debug']):false;
sleep(1);
$content = file_exists($file)?file_get_contents($file):'<p>指定的文件不存在</p>';
$content = preg_replace_callback('/\<%=(.*?)%\>/', '_preg_callback', $content);
echo $content;
if($debug){
    echo '<h3>请求的数据</h3>';
    echo '<p><pre>'.print_r($_REQUEST, true).'</pre></p>';
}

function _preg_callback($m){
    $key = $m[1];
    return isset($_REQUEST[$key])?$_REQUEST[$key]:'';
}