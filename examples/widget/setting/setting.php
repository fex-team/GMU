<?php
require_once dirname(__FILE__) . '/Mobile_Detect.php';
$arr = array(
    'slider' => array(
        "name" => 'Slider',
        "description" => '图片轮播',
        "group" => 'Components',
        "icon" => 'slider.png',
        "href" => 'slider/slider.html'
    ),
    'progressbar' => array(
        "name" => 'Progressbar',
        "description" => '进度条',
        "group" => 'Components',
        "icon" => 'slider.png',
        "href" => 'progressbar/progressbar.html'
    ),
    'dialog' => array(
        "name" => 'Dialog',
        "description" => '弹出框',
        "group" => 'Components',
        "icon" => 'dialog.png',
        "href" => 'dialog/dialog.html'
    ),
    'navigator' => array(
        "name" => 'Navigator',
        "description" => '导航栏',
        "group" => 'Components',
        "icon" => 'navigator.png',
        "href" => 'navigator/navigator.html'
    ),
    'refresh' => array(
        "name" => 'Refresh',
        "description" => '加载更多',
        "group" => 'Components',
        "icon" => 'refresh.png',
        "href" => 'refresh/refresh.html'
    ),
    'suggestion' => array(
        "name" => 'Suggestion',
        "description" => '搜索建议',
        "group" => 'Components',
        "icon" => 'suggestion.png',
        "href" => 'suggestion/suggestion.html'
    ),
    'tabs' => array(
        "name" => 'Tabs',
        "description" => '选项卡',
        "group" => 'Components',
        "icon" => 'tabs.png',
        "href" => 'tabs/tabs.html'
    ),
    'panel' => array(
        "name" => 'Panel',
        "description" => '面板组件',
        "group" => 'Components',
        "icon" => 'panel.png',
        "href" => 'panel/panel_position.html',
        'newIcon' => 'new.png'
    ),
    'calendar' => array(
        "name" => 'Calendar',
        "description" => '日历控件',
        "group" => 'Components',
        "icon" => 'tabs.png',
        "href" => 'calendar/calendar.html',
        'newIcon' => 'new.png'
    ),
    'toolbar' => array(
        "name" => 'Toolbar',
        "description" => '工具栏',
        "group" => 'Components',
        "icon" => 'toolbar.png',
        "href" => 'toolbar/toolbar.html'
    ),
    'dropmenu' => array(
        "name" => 'Dropmenu',
        "description" => '下拉菜单',
        "group" => 'Components',
        "icon" => 'dropmenu.png',
        "href" => 'dropmenu/dropmenu.html'
    ),
    'gotop' => array(
        "name" => 'Gotop',
        "description" => '返回顶部',
        "group" => 'Components',
        "icon" => 'gotop.png',
        "href" => 'gotop/gotop.html'
    ),
    'adddesktop' => array(
        "name" => 'Add2desktop',
        "description" => '添加到桌面',
        "group" => 'Components',
        "icon" => 'adddesktop.png',
        "href" => 'add2desktop/add2desktop.html'
    ),
    'button' => array(
        "name" => 'Button',
        "description" => '按钮',
        "group" => 'Components',
        "icon" => 'button.png',
        "href" => 'button/button.html'
    ),
    'imglazyload' => array(
        "name" => 'Imagelazyload',
        "description" => '图片懒加载',
        "group" => 'Components',
        "icon" => 'imglazyload.png',
        "href" => 'imglazyload/imglazyload.html'
    ),
    'linechart' => array(
        "name" => 'LineChart',
        "description" => '折线图',
        "group" => 'Chart',
        "icon" => 'linechart.png',
        "href" => '../chart/linechart/linechart.html'
    ),
    'barchart' => array(
        "name" => 'BarChart',
        "description" => '柱状图',
        "group" => 'Chart',
        "icon" => 'barchart.png',
        "href" => '../chart/barchart/barchart_demo.html'
    ),
    'piechart' => array(
        "name" => 'Piechart',
        "description" => '饼图',
        "group" => 'Chart',
        "icon" => 'piechart.png',
        "href" => '../chart/piechart/piechart_demo.html'
    )
);

$detect = new Mobile_Detect();

if(!$detect->isiOS()){
    unset($arr['adddesktop']);
}

return $arr;