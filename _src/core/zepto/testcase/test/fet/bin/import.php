<?php
require_once '../conf/config.php';
//加入一个调试开关
if(array_key_exists('debug', $_GET))
ConfigTest::$DEBUG = true;
if(!ConfigTest::$DEBUG){
	header("Content-type: text/javascript; charset=utf-8");
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
}
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: import.php
 * author: berg
 * @姜曙光做了修改，改动较大，可以查看diff
 * date: 2010/07/18 23:57:52
 *
 * @fileoverview * import.js的php版本
 * 接受一个f参数，格式和import.js相同，自动合并js并输出
 * 此外，本脚本支持引入一个包所有文件（其实也就是一个目录下的所有js文件，**不递归**）
 * IE下，get请求不能超过2083字节，请注意。
 */
$cov = array_key_exists('cov', $_GET) ? $_GET['cov'] : false;
$f = explode(',', $_GET['f']);//explode() 函数把字符串分割为数组,此处$f=baidu.ajax.form
$e = (array_key_exists('e', $_GET) && $_GET['e']!='') ? explode(",", $_GET['e']) : array();
$s = array_key_exists('s', $_GET) ? $_GET['s'] : false;

require_once dirname(__FILE__).'/analysis.php';

$analysis = new Analysis();
$IGNORE = array();
foreach ($e as $d){
	if(ConfigTest::$DEBUG)var_dump($d);
    if(preg_match("/.js/",$d)){
        $eDone = preg_replace('/\s+/','',$d);
    }else{
        $eDone = preg_replace('/\s+/','',$d).".js";
    }
    array_push($IGNORE,$eDone);
//    $contents =   $analysis->get_import_srcs($d."js");
//    foreach($contents as $content){
//        $IGNORE = array_merge($IGNORE, $content['i']);
//    }
}

if(ConfigTest::$DEBUG)var_dump($IGNORE);

function importSrc($d, $cov=false){
	global $IGNORE;
    global $analysis;
	if(in_array($d,$IGNORE)){
        return array();
    }
	array_push($IGNORE, $d);
    return $analysis->get_import_srcs($d);//jiangshuguang
}

/*jiangshuguang更改了相关逻辑，适用于gmu*/

$cnt = "";

foreach($f as $d){
    if(preg_match("/.js/",$d)){
        $jsPath = preg_replace('/\s+/','',$d);
    }else{
        $jsPath = preg_replace('/\s+/','',$d).".js";
    }
    if($s){
        $content = Analysis::get_src_cnt($jsPath);
        if($cov){
            $cnt = $cnt.$content["cc"];
        }else{
            $cnt = $cnt.$content["c"];
        }
    }else{
        $contents = importSrc($jsPath);
        foreach($contents as $content){
            if($cov){
                $cnt = $cnt.$content["cc"];
            }else{
                $cnt = $cnt.$content["c"];
            }
        }
    }
}
echo $cnt;

