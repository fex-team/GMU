<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE);
header("Content-type: text/html; charset=utf-8");

if(!preg_match('#(webkit|android|ios)#i', $_SERVER['HTTP_USER_AGENT'])){
    echo 'GMU组件demo需要在无线设备上使用，请使用webkit引擎（chrome, safari等）浏览器浏览';
    exit;
}

//collect demos
$setting = require_once('./setting/setting.php');
$components = array();
foreach ($setting as $item) {
    empty($item['group']) && ($item['group'] = 'Widgets');
    if (empty($components[$item['group']])) {
        $components[$item['group']] = array();
    }
    $components[$item['group']][] = $item;
}
?><!doctype html>
<html>
<head>
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <meta charset="utf-8">
    <title>GMU demos</title>
    <link rel="stylesheet" type="text/css" href="../../assets/reset.css" />
    <style>
        body {
            padding: 0;
            margin: 0;
        }

        .thelist h3 {
            background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#DDD), to(#BFBFBF));
            border-top: solid 1px #CCC;
            border-bottom: solid 1px #999;
            color: gray;
            text-shadow: rgba(255, 255, 255, 0.25) 1px 1px 0;
            height: 25px;
            line-height: 25px;
            padding: 3px;
        }

        .thelist ul, .thelist ul li {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .thelist ul li {
            position: relative;
            border-bottom: solid 1px #CCC;
        }

        .thelist ul li img {
            position: absolute;
            width: 54px;
            left: 10px;
            margin-top: -27px;
            top: 50%;
        }
        .thelist ul li img.newIcon{
            width: 22px;
            height: 12px;
            right: 60px;
            left: auto;
            top: 70%;
        }

        .thelist ul li a {
            color: #B2B2B2;
            text-decoration: none;
            display: block;
            padding: 1em 1em 1em 80px;
            min-height: 50px;
            background: no-repeat right center url(data:image/png;base64,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);
            -webkit-background-size: 45px 14px;
        }

        .thelist ul li a .title {
            display: block;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }

        .thelist ul li.ui-state-hover {
            background: #ddd;
        }

        .thelist ul li.ui-state-hover a {
            color: #333;
        }
    </style>

    <script type="text/javascript" src="../../dist/zepto.js"></script>
    <script type="text/javascript" src="../../src/extend/highlight.js"></script>
    <script type="text/javascript">
        (function ($) {
            $(function(){$('.thelist ul li').highlight('ui-state-hover');});
        })(Zepto);
    </script>
</head>
<body>
<div id="wrap">
    <div class="thelist">
        <?php foreach ($components as $group => $demos): ?>
        <div class="group">
            <h3><?php echo $group?></h3>
            <ul>
                <?php foreach ($demos as $demo): ?>
                <li>
                    <a href="<?php echo $demo['href']?>">
                        <img src="setting/<?php echo $demo['icon']?>" alt="<?php echo $demo['name']?>"/>
                        <span class="title"><?php echo $demo['name']?></span>
                        <span class="desc"><?php echo $demo['description']?></span>
                        <?php if ($demo['newIcon']): ?><img class="newIcon" src="setting/<?php echo $demo['newIcon']?>" />
                        <?php endif;?>
                    </a>
                </li>
                <?php endforeach;?>
            </ul>
        </div>
        <?php endforeach;?>
    </div>
</div>
<link rel="stylesheet" type="text/css" href="../../assets/widget/toolbar/toolbar.blue.css">
</body>
</html>