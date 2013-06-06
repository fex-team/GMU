(function ($, win) {
    gmu.suggestion.option('compat', true, function () {

        this.subscribe('compatData.suggestion', function () {
            var me = this,
                key = me.key,
                localdata = win.localStorage[key],
                dataArr;

            if (localdata && !~localdata.indexOf('\u001e')) {     //兼容老数据，以前以“,”分隔localstorage中的数据，现在改为encodeURIComponent(',')分隔
                localdata = localdata + '\u001e';
                dataArr = localdata.split(',');
                win.localStorage[key] = dataArr.join(key);
            }
        });

    });
})(Zepto, window);