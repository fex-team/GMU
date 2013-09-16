<?php
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    header("Content-Type:application/javascript");
    $key = $_GET["word"];
    $cb = $_GET["cbtest"];
    $param = $_GET["param"];

    if ($param == '1') {
        if($key == '1'){
            echo $cb.'({s:["param1"]});';
        }
    }
   ?>