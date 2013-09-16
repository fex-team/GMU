/*
 * 测试GMU官网自定义下载，从页面获取下载链接
 */

(function(){
    function sendMessage() {
        var args = [].slice.call(arguments);
        alert(JSON.stringify(args));
    }

    document.getElementById('J_test').click();

    sendMessage('download.getdownloadurl', downloadurl);

})();