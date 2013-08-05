<?php
require_once dirname(__FILE__) . '/Mobile_Detect.php';
$arr = array(
    'slider' => array(
        "name" => 'Slider',
        "description" => '图片轮播',
        "group" => 'Widgets',
        "icon" => 'slider.png',
        "href" => 'slider/slider.html'
    ),
    'progressbar' => array(
        "name" => 'Progressbar',
        "description" => '进度条',
        "group" => 'Widgets',
        "icon" => 'slider.png',
        "href" => 'progressbar/progressbar.html'
    ),
    'dialog' => array(
        "name" => 'Dialog',
        "description" => '弹出框',
        "group" => 'Widgets',
        "icon" => 'dialog.png',
        "href" => 'dialog/dialog.html'
    ),
    'navigator' => array(
        "name" => 'Navigator',
        "description" => '导航栏',
        "group" => 'Widgets',
        "icon" => 'navigator.png',
        "href" => 'navigator/navigator.html'
    ),
    'refresh' => array(
        "name" => 'Refresh',
        "description" => '加载更多',
        "group" => 'Widgets',
        "icon" => 'refresh.png',
        "href" => 'refresh/refresh.html'
    ),
    'suggestion' => array(
        "name" => 'Suggestion',
        "description" => '搜索建议',
        "group" => 'Widgets',
        "icon" => 'suggestion.png',
        "href" => 'suggestion/suggestion.html'
    ),
    'tabs' => array(
        "name" => 'Tabs',
        "description" => '选项卡',
        "group" => 'Widgets',
        "icon" => 'tabs.png',
        "href" => 'tabs/tabs.html'
    ),
    'panel' => array(
        "name" => 'Panel',
        "description" => '面板组件',
        "group" => 'Widgets',
        "icon" => 'panel.png',
        "href" => 'panel/panel_position.html',
        'newIcon' => 'new.png'
    ),
    'calendar' => array(
        "name" => 'Calendar',
        "description" => '日历控件',
        "group" => 'Widgets',
        "icon" => 'tabs.png',
        "href" => 'calendar/calendar.html',
        'newIcon' => 'new.png'
    ),
    'toolbar' => array(
        "name" => 'Toolbar',
        "description" => '工具栏',
        "group" => 'Widgets',
        "icon" => 'toolbar.png',
        "href" => 'toolbar/toolbar.html'
    ),
    'dropmenu' => array(
        "name" => 'Dropmenu',
        "description" => '下拉菜单',
        "group" => 'Widgets',
        "icon" => 'dropmenu.png',
        "href" => 'dropmenu/dropmenu.html'
    ),
    'gotop' => array(
        "name" => 'Gotop',
        "description" => '返回顶部',
        "group" => 'Widgets',
        "icon" => 'gotop.png',
        "href" => 'gotop/gotop.html'
    ),
    'adddesktop' => array(
        "name" => 'Add2desktop',
        "description" => '添加到桌面',
        "group" => 'Widgets',
        "icon" => 'adddesktop.png',
        "href" => 'add2desktop/add2desktop.html'
    ),
    'button' => array(
        "name" => 'Button',
        "description" => '按钮',
        "group" => 'Widgets',
        "icon" => 'button.png',
        "href" => 'button/button.html'
    ),
    'imglazyload' => array(
        "name" => 'Imagelazyload',
        "description" => '图片懒加载',
        "group" => 'Widgets',
        "icon" => 'imglazyload.png',
        "href" => 'imglazyload/imglazyload.html'
    )
);

$detect = new Mobile_Detect();

if(!$detect->isiOS()){
    unset($arr['adddesktop']);
}

return $arr;