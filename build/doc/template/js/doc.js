(function ($, undeinfied) {
    $(function () {
        //滚动动画代码
        $(document).delegate('a[href^=#]', 'click', function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var id = this.hash.slice(1),
                    $target = $('[id="' + id + '"], [name="' + id + '"]');
                if ($target.length) {
                    $('html,body').stop().animate({
                        scrollTop:$target.offset().top
                    }, {
                        duration:500,
                        complete:function () {
                            $(window).trigger('refreshGotop');
                        }
                    });
                    history.pushState && history.pushState(null, this.hash, this.hash);
                    return false;
                }
            }
        });

        //toolbar
        (function(){
            var wraper = $('.wrapper:first'),
                nav = $('#sidebar .nav', wraper);

            nav.delegate('ul>li>a', 'click', function(){
                var $me = $(this);
                if($me.is('.text-large')){
                    wraper.addClass('text-large');
                    return false;
                } else if($me.is('.text-small')) {
                    wraper.removeClass('text-large');
                    return false;
                } else if($me.is('.collapse, .expand')){
                    var isExpand = $me.is('.collapse');
                    if(isExpand) {
                        $me.removeClass('collapse').addClass('expand');
                    } else {
                        $me.removeClass('expand').addClass('collapse');
                    }
                    wraper.toggleClass('collapsed');
                    return false;
                }
            });

        })();


        //collapsible 左边展开收起代码
        $('#sidebar .collapsble').each(function () {
            var $el = $(this),
                $header = $('.toc_title', this),
                $content = $('.toc_section', this),
                update = function () {
                    if ($el.is('.collapsed')) {
                        $content.slideUp('fast');
                    } else {
                        $content.slideDown('fast');
                    }
                }
            $('span.icon', $header).bind('click', function () {
                $el.toggleClass('collapsed');
                update();
                return false;
            });
            update();
        });

        //tabs
        $('.ui-tabs').each(function(){
            var titles = $('>ul>li', this),
                contents = $('>div', this),
                switchTo = function(li){
                    var link = $.trim($('a', li).attr('href'));
                    if(/^#/.test(link)){
                        titles.removeClass('active');
                        $(li).addClass('active');
                        contents.removeClass('active').filter(link).addClass('active');
                        return false;
                    }
                };

            titles.bind('click', function(){
                return switchTo(this);
            });
        });

        //codepreview
        $('.codepreivew').each(function(){
            var me = this,
                $me = $(me),
                titles = $('>ul.toptabs>li', me),
                btns = $('>ul.btns>li', me),
                contents = $('>div', me),
                lastContent = null,
                editors = {},
                _eid = 1,
                content,
                allowed = {
                    javascript : 'text/javascript',
                    html: 'text/html',
                    css: 'text/css'
                },
                switchTo = function(li){
                    var link = $.trim($('a', li).attr('href'));
                    if(/^#/.test(link)){
                        titles.removeClass('active');
                        $(li).addClass('active');
                        content = contents.removeClass('active').filter(link).addClass('active');
                        $me.trigger('switchContent.codepreivew', [content, lastContent]);
                        lastContent = content;
                        return false;
                    }
                };
            titles.bind('click', function(){
                return switchTo(this);
            });

            $me.bind('switchContent.codepreivew', function(e, content, lastContent){
                var textarea = $('textarea', content), type, eid;
                if(!(eid = textarea.data('codepreivew_eid'))){
                    type = textarea.attr('data-type');
                    if(!type in allowed) return ;
                    eid = _eid++;
                    editors[eid] = CodeMirror.fromTextArea(textarea[0], {
                        mode: allowed[type],
                        lineNumbers: true,
                        lineWrapping: true,
                        tabMode: "indent",
                        readOnly: true,
                        onCursorActivity: function() {

                        }
                    });
                    textarea.data('codepreivew_eid', eid);
                }
            });

            /*$me.bind('switchContent.codepreivew', function(e, content, lastContent){
                var textarea = $('textarea', content), type, pre;
                if(textarea.is(':visible')){
                    type = textarea.attr('data-type');
                    if(!type in allowed) return ;
                    pre = $('<pre class="cm-s-default"></pre>');

                    CodeMirror.runMode(textarea.val(), allowed[type],
                        pre[0]);

                    pre.insertAfter(textarea.hide());
                }
            });*/

            switchTo(titles.filter('.active'));
        });

        //goTop
        (function () {
            var gotop = $('#gotopBtn'), update = function () {
                gotop[window.pageYOffset > $(window).height() ? 'show' : 'hide']();
            };
            gotop.click(function () {
                $('html,body').stop().animate({
                    scrollTop:0
                }, {
                    duration:500,
                    complete:function () {
                        update();
                    }
                });
                return false;
            });
            $(window).bind('scroll refreshGotop', function () {
                update();
            });
            setTimeout(update, 500);
        })();

        //highlight
        (function(){
            var allowed = {
                javascript : 'text/javascript',
                html: 'text/html',
                css: 'text/css'
            }
            $('pre.highlight code').each(function(){
                var type = this.className.split(' ')[0],
                    pre ;

                if(type && type in allowed){
                    pre = $('<pre class="cm-s-default cm-type-'+type+'"></pre>');
                    CodeMirror.runMode($(this).text(), allowed[type],
                        pre[0]);
                    $(this).parent().replaceWith(pre);
                }
            });
        })();

        //autocomplete
        (function(settings){
            if(!settings)return ;

            var search = $('#search input:first'),
                staticlist = $('#static_list'),
                result = $('#result'),
                listUl = $('<ul class="result-list"></ul>').appendTo(result),
                isResultShow = false,
                active,
                escapeRegex = function( value ) {
                    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                },
                filter = function(array, term) {
                    var matcher = new RegExp( escapeRegex(term), "i" );
                    return $.grep( array, function(value) {
                        return matcher.test( value.label || value.value || value );
                    });
                },
                switchTo = function(item){
                    listUl.children().removeClass('active').filter(item).addClass('active');
                    active = item;
                },
                renderList= function(list){
                    var html = '';
                    listUl.empty();
                    $.each(list, function(){
                        html += '<li><a href="'+(this.href||'')+'">'
                            + '<span class="title">'+this.label+'</span>'
                            + this.desc
                            + '<span class="cat"> - '+this.category+'</span>'
                            +'</a></li>';
                    });
                    if(html){
                        listUl.html(html);
                        if(listUl.children('.active').length == 0){
                            switchTo(listUl.children(':first'));
                        }
                    } else {
                        listUl.html('<li class="notice">无此方法</li>');
                    }
                },
                source = settings.source;
            listUl.delegate('li', 'click', function(){
                switchTo($(this));
                search.val($.trim($('a span.title', this).text()));
            });

            search.bind('input', function(){
                var value = $(this).val(), list;
                if(!value && isResultShow){
                    result.hide();
                    staticlist.show();
                    isResultShow = false;
                } else if(value && !isResultShow){
                    result.show();
                    staticlist.hide();
                    isResultShow = true;
                }
                if(value){
                    list = filter(source, value);
                    renderList(list);
                }
            }).bind('keydown', function(event){
                switch(event.keyCode){
                    case 38://向上
                        if(active && active.prev().length){
                            switchTo(active.prev());
                        }
                        event.preventDefault();
                        break;
                    case 40://向下
                        if(active && active.next().length){
                            switchTo(active.next());
                        }
                        event.preventDefault();
                        break;
                    case 13://Enter
                        if(active){
                            $('a', active).trigger('click');
                            search.val($.trim($('a span.title', active).text()));
                        }
                        event.preventDefault();
                        break;
                }
            });

            search.prop('disabled', false);

        })(globalSettings || undeinfied);

        (function(settings){
            if(!settings)return ;
            //切换主题
            var $items = $('.themes-list li'), themes = settings.themes, theme_key = settings.activeTheme;
            $items.bind('click', function () {
                var $el = $(this), a = $('a', this), key = a.prop('className').split(/\s+/)[0];
                if (theme_key !== key) {
                    $('link#theme-link').prop('href', themes[key]);
                    $.cookie && $.cookie('activeTheme', key);
                    $items.removeClass('on');
                    $el.addClass('on');
                    theme_key = key;
                }
                return false;
            });
        })(globalSettings || undeinfied);

    });
})(jQuery);
