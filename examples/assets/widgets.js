var widgets = {
    'slider': {
        "name": 'Slider',
        "description": '图片轮播',
        "icon": 'slider.png'
    },
    'progressbar': {
        "name": 'Progressbar',
        "description": '进度条',
        "icon": 'slider.png'
    },
    'dialog': {
        "name": 'Dialog',
        "description": '弹出框',
        "icon": 'dialog.png'
    },
    'navigator': {
        "name": 'Navigator',
        "description": '导航栏',
        "icon": 'navigator.png'
    },
    'refresh': {
        "name": 'Refresh',
        "description": '加载更多',
        "icon": 'refresh.png'
    },
    'suggestion': {
        "name": 'Suggestion',
        "description": '搜索建议',
        "icon": 'suggestion.png'
    },
    'historylist': {
        "name": 'Historylist',
        "description": '历史记录',
        "icon": 'suggestion.png'
    },
    'tabs': {
        "name": 'Tabs',
        "description": '选项卡',
        "icon": 'tabs.png'
    },
    'panel': {
        "name": 'Panel',
        "description": '面板组件',
        "icon": 'panel.png'
    },
    'calendar': {
        "name": 'Calendar',
        "description": '日历控件',
        "icon": 'tabs.png'
    },
    'toolbar': {
        "name": 'Toolbar',
        "description": '工具栏',
        "icon": 'toolbar.png'
    },
    'dropmenu': {
        "name": 'Dropmenu',
        "description": '下拉菜单',
        "icon": 'dropmenu.png'
    },
    'popover': {
        "name": 'Popover',
        "description": '提示层',
        "icon": 'dropmenu.png'
    },
    'gotop': {
        "name": 'Gotop',
        "description": '返回顶部',
        "icon": 'gotop.png'
    },
    'add2desktop': {
        "name": 'Add2desktop',
        "description": '添加到桌面',
        "icon": 'adddesktop.png'
    },
    'button': {
        "name": 'Button',
        "description": '按钮',
        "icon": 'button.png'
    },
    'imglazyload': {
        "name": 'Imagelazyload',
        "description": '图片懒加载',
        "icon": 'imglazyload.png'
    }
};

if(!/.*(iPhone|iPad).*/.test(navigator.userAgent)){
    delete widgets.add2desktop;
}