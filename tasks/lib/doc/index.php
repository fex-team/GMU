<?php
/**
 * Created by JetBrains PhpStorm.
 * User: liaoxuezhi
 * Date: 13-4-19
 * Time: 下午11:38
 * To change this template use File | Settings | File Templates.
 */
error_reporting(E_ERROR | E_WARNING | E_PARSE);
define("DS", DIRECTORY_SEPARATOR);
define("PS", PATH_SEPARATOR);
//将lib目录加到path里面去。
set_include_path(dirname(__FILE__) . DIRECTORY_SEPARATOR . "lib" . PATH_SEPARATOR . get_include_path());

require_once "JsDoc/JsDoc.php";
require_once "phpqrcode.php";

$baseDir = dirname(dirname(dirname(dirname(__FILE__))));

$zeptoDir = $baseDir . "/src/zeptodoc";
$gmuDir = $baseDir . "/src";
$templateDir = $baseDir."/tasks/lib/doc/template";
$outputDir = $baseDir."/doc";

$themes = array(
    'purple' => './css/purple.css',
    'blue' => './css/blue.css',
    'dark' => './css/dark.css',
    'orange' => './css/orange.css'
);

$zeptoDoc = new JsDoc($zeptoDir);
$zeptoDoc->setData('name', 'Zepto.js');
$zeptoDoc->setData('title', 'Zepto API');
$zeptoDoc->setData('desc', 'Zepto是一个轻量级的针对现代浏览器的JS库，兼容jQuery用法');
$zeptoDoc->setOrder('core.js
            event.js
            ajax.js
            effect.js
            touch.js
            form.js
            ');


$gmuDoc = new JsDoc($gmuDir, array('core/zepto/*', 'core/fx.js'), true);
$gmuDoc->setData('name', 'GMU 新版API');
$gmuDoc->setData('title', 'GMU 新版API');
$gmuDoc->setOrder('
            core/extend.js
            core/ui.js
            core/highlight.js
            core/fix.js
            core/iscroll.js
            core/imglazyload.js
            widget/suggestion.js
            widget/quickdelete.js
            widget/appframe.js
            widget/pageswipe.js
            widget/tabs.js
            widget/tabs.ajax.js
            widget/tabs.swipe.js
            widget/navigator.js
            widget/navigator.iscroll.js
            widget/refresh.js
            widget/refresh.lite.js
            widget/refresh.iscroll.js
            widget/refresh.iOS5.js
            widget/dropmenu.js
            widget/dropmenu.iscroll.js
            widget/calendar.js
            widget/calendar.picker.js
            widget/slider.js
            widget/add2desktop.js
            widget/gotop.js
            widget/gotop.iscroll.js
            widget/pageswipe.js
            widget/dialog.js
            widget/dialog.position.js
            widget/toolbar.js
            widget/button.js
            widget/button.input.js
            widget/more.js
            ');

JsDoc_Template::setTemplateDir($templateDir);
JsDoc_Template::setTheme('');

$navTemplate = new JsDoc_Template('nav.phtml');
$jsDocTemplate = new JsDoc_Template_Doc('doc.phtml', $zeptoDoc);
$jsDocTemplate->addJsDoc($gmuDoc);
$jsDocTemplate->assignVariable('NavPrefix', $navTemplate->render());

$template = new JsDoc_Template('index.phtml');
$template->assignVariable('title', 'GMU API 文档 ');
$template->assignVariable('docContent', $jsDocTemplate->render());
$template->assignVariable('searchEntries', $jsDocTemplate->getSearchEntries());

$template->assignVariable('themes', $themes);
$template->assignVariable('theme', 'blue');
$template->assignVariable('activeTheme', 'purple');
$content = $template->render();

if(!is_dir($outputDir)){
    @mkdir($outputDir);
}

// 删除doc目录下所有文件
//todo 加配置项
if( true ) {
    emptyDir($outputDir);
}

//生成二维码
@mkdir($outputDir."/qrcode");
$content = preg_replace_callback('#\ssrc=(\'|")(.+?)\1#', function($maches){
    global $outputDir;

    if(preg_match('#qrcode\.php\?data=(.*)$#i', $maches[2], $m)){
        $url = urldecode($m[1]);
        $filename = "/qrcode/".md5($url).".png";
        QRcode::png($url, $outputDir.$filename, QR_ECLEVEL_L, 4);
        return " src=\".".$filename."\"";
    }
    return $maches[0];
}, $content);

//生成文档首页
file_put_contents($outputDir."/index.html", $content);

//把非.phtml文件或目录全部移过去
$items = scandir($templateDir);
foreach($items as $item) {
    if ($item == '.' || $item == '..' || preg_match('#\.phtml$#', $item)) continue;
    copyDir($templateDir.'/'.$item, $outputDir.'/'.$item);
}

echo "✓ 生成API文档成功\n";

//清空文件夹
function emptyDir($dir, $includeSelf = false){
    if (!file_exists($dir)) return true;
    if (!is_dir($dir) || is_link($dir)) return unlink($dir);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (!emptyDir($dir . "/" . $item, true)) {
            @chmod($dir . "/" . $item, 0777);
            if (!emptyDir($dir . "/" . $item, true)) return false;
        };
    }
    return $includeSelf ? rmdir($dir) : true;
}

function copyDir($src, $desc){
    if( is_file($src) ){
        return copy($src, $desc);
    } else if(is_dir( $src )) {
        is_dir($desc) || mkdir($desc);
        $files = scandir($src);
        foreach($files as $file) {
            if ($file == '.' || $file == '..') continue;
            if(!copyDir($src.'/'.$file, $desc."/".$file)){
                return false;
            }
        }
        return true;
    }
}