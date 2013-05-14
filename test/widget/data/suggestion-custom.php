<?php
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    header("Content-Type:application/javascript");
    $key = $_GET["wd"];
    $cb = $_GET["cb"];
    if($key == '1'){
         echo $cb.'({s:["10+10","11对战平台","1080p","123网址之家","12593","1号店"]});';
    }
    else if($key == '19'){
         echo $cb.'({s:["192.168.1.1", "1912年", "19岁的纯情", "1976年", "19楼", "1998年", "1997年", "1988年"]});';
    }
    else {
    	echo $cb.'({s:[]});';
    }
   ?>