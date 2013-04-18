<?php
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    header("Content-Type:application/javascript");
    $key = $_GET["wd"];
    $cb = $_GET["cb"];
    if($key == '1'){
         echo $cb.'({s:["10+10","11对战平台","1080p","123网址之家","12593","1号店"]});';
    }
   ?>