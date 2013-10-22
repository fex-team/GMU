<?php
    $searchUrl = 'http://nssug.baidu.com/su?&sugParams&prod=baike&ie=uft-8';
    header('Content-Type: application/json');
    if(!empty($_GET['wd'])) {
        // 判断是否为bae环境
        if(!preg_match('/baidu\.com/', $_SERVER['HTTP_HOST'])){
            $content = file_get_contents($searchUrl . '&wd=' . urlencode($_GET['wd']) . '&cb=' . urlencode($_GET['cb']));
            echo iconv('GB2312', 'UTF-8//IGNORE', $content);
        }else {

            require_once("../../../../bae_config.php");

            $httpproxy = BaeFetchUrl::getInstance(array('timeout' =>100000,'conn_timeout'=>100000,'max_response_size'=> 102400));
            $res = $httpproxy->get($searchUrl . '&wd=' . urlencode($_GET['wd']) . '&cb=' . urlencode($_GET['cb']));
            echo iconv('GB2312', 'UTF-8//IGNORE', $httpproxy->body());
        }

    }

?>