(function($){
    ({
        loadCount: 0,
        backUrl: $('#bootstrap').attr('data-backurl') || '../..',
        pages: ($('#bootstrap').attr('data-page') || '').split(','),
        basePath: {
            js: $('#bootstrap').attr('data-jspath') || '../../../_src/' ,
            css: $('#bootstrap').attr('data-csspath') || '../../../assets/'
        },
        requires: {
            css: ['icons.default.css', 'widget/button/button.css', 'widget/button/button.default.css', 'widget/dropmenu/dropmenu.css',
                'widget/dropmenu/dropmenu.default.css', 'widget/toolbar/toolbar.css', 'widget/toolbar/toolbar.default.css'],
            js: ['core/touch.js', 'core/zepto.highlight.js', 'core/zepto.fix.js', 'widget/button.js', 'widget/dropmenu.js', 'widget/toolbar.js']
        },
        initHeader: function () {
            var that = this,
                jss = that.requires.js,
                loaded =  {},
                i = 0,
                len = jss.length,
                path;

            //收集已经加载进来的js
            $('script').each(function(){
                if(/([^\/]+\/[^\/]+\.js)$/i.test(this.src)){
                    loaded[RegExp.$1] = true;
                }
            });

            $.each(that.requires['css'], function (i, path) {
                that.addResource(that.basePath['css'] + path, 'css')
            });

            for( ; i < len; i++) {
                path = jss[i];
                loaded[path] ? jss.splice((len--, i--), 1) :
                    that.sendRequest(that.basePath['js'] + path, that.addResource);
            }
        },
        addResource: function (text, type, done) {
            var head = document.head || document.getElementsByTagName('head')[0],
                body = document.body || document.getElementsByTagName('body')[0],
                node;
            if (type == 'css') {
                $('<link>').attr({
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: text
                }).appendTo(head);
            } else {
                node = document.createElement('script');
                node.type = "text/javascript";
                node.innerHTML = text;
                body.appendChild(node);
            }

        done && this.initToolbar();
        },
        sendRequest: function (url, cb) {
            var that = this,
                xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function() {
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    if(xhr.readyState === 4) {
                        that.loadCount++;
                        cb && cb.apply(that, [xhr.responseText, 'js', that.loadCount === that.requires['js'].length]);
                    }
                }
            };
            xhr.send(null);
        },
        initToolbar: function () {
            var that = this,
                pages = that.pages,
                $header = $('<header></header>').prependTo('body'),
                btn = pages.length && pages[0] ? $.ui.button({
                    label: '切换'
                }).root() : '',
                toolbar = $.ui.toolbar({
                    title: document.title,
                    container: $header,
                    useFix:!($.os.ios && parseInt($.os.version) == 4),
                    btns: btn,
                    backButtonClick: function(){
                        location.href = that.backUrl;
                    }
                }), item;
            if(btn && btn.length){
                var pageArr = [];
                for(var i = pages.length; i--;){
                    item = pages[i].split('|');
                    pageArr.unshift({
                        text: item[0],
                        href: item[1]
                    });
                }
                $.ui.dropmenu({
                    align: 'right',
                    arrowPos: {left:'auto', right:'17px'},
                    items: pageArr,
                    container: $header.find('.ui-toolbar').first(),
                    cacheParentOffset: false
                }).bindButton(btn);

            }
            setTimeout(function () {
                $(document).trigger('headready');
            }, 100);
        }
    }).initHeader();

})(Zepto);