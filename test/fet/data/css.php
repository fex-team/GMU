<?php
$nowPath = dirname(__FILE__).'/';
$cssDir = realpath($nowPath.'../../../assets').'/';
$path = $_REQUEST['path'];
$cssFile = $cssDir.$path;
if(!file_exists($cssFile)){
    header("HTTP/1.1 404 Not Found");
    header("Status: 404 Not Found");
    exit;
}
header("Content-type: text/css");
$content = file_get_contents($cssFile);

preg_match_all('/url\((([\'"]?)(?!data)([^\'"]+?)\2)\)/im', $content, $m);
if(isset($m[3])) {
    foreach($m[3] as $image) {
        if(!preg_match('/\.(gif|png|jpg|jpeg)$/i', $image))continue;
        $imagePath = realpath(dirname($cssFile).'/'.$image);
        if(!$imagePath) continue;
        $relativePath = getRelativePath($imagePath, $nowPath);
        $content = str_replace($image, $relativePath, $content);
    }
}

echo $content."\n".".cssloaded{ width: 20px;}";

function getRelativePath($path, $relativePath){
    $relativePath = rtrim(str_replace("\\", "/", $relativePath), '/');
    $newPath = '';
    $path = explode("/", str_replace("\\", "/", $path));
    $relativePath = explode("/", $relativePath);
    foreach( $path as $k => $v) {
        if($v != $relativePath[$k] )break;
    }
    array_splice($path, 0, $k);
    array_splice($relativePath, 0, $k);
    $newPath = str_pad($newPath, count($relativePath)*3, '../');
    $newPath .= implode("/", $path);
    return $newPath;
}

