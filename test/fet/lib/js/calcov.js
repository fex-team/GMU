//需要在父窗口中定义2个全局变量
/*
 /*用例运行的结果
 window.tr = {};
 /*覆盖率信息
 window.covinfo = {};
 * */
//var caseResult = parent.window.caseResult;
// var covinfo = parent.window.covinfo;
(function () {
    if ( !QUnit )
        return;
    var d = QUnit.done, td = QUnit.testDone, s = QUnit.start;
    var tr = parent.window.tr;

    function _done( args /* failures, total */ ) {

        /*所有用例都运行结束，这时候需要计算结果和覆盖率*/
        calcov();

        var query = top.window.location.search.substring( 1 );
        var plat = '';
        tr['config'] = query;
        var taskid ;
        if(query.indexOf('tid') > -1 ){
            if(/platform=mtc/.test(query)){
                taskid = query.substr(query.indexOf('tid') ).split('=')[1].split('--__--')[0];
                plat = 'mtc';
            }else{
                var args = ua.getArgs(query);
                taskid = args['tid'];
                plat = args['platform'];
            }
        }
        tr['taskId'] = taskid;
        tr['plat'] = plat;

        if(/platform=mtc/.test(query)){
            taskid = query.substr(query.indexOf('tid') ).split('=')[1].split('--__--')[0];
            plat = 'mtc';
            url = "http://10.81.15.166:8098/report/report.php";
        }else{
            var args = ua.getArgs(query);
            taskid = args['tid'];
            plat = args['platform'];
            url = "http://123.125.69.115:8098/report/report.php";
        }
        $J.ajax( {
            url:"report.php",
            type:'post',
            data: tr ,
            success:function ( msg ) {
            },
            error:function ( xhr, msg ) {
            }
        } );
        $J.getJSON(url,tr);
    }


    QUnit.done = function () {
        d.apply( this, arguments );
        //先让window._isFinished改变，然后再判断
        /localhost/.test(location.href) < -1 && _done( arguments );
    };


    function calcov() {
        function covmerge( cc, covinfo ) {
            for ( var key in covinfo ) {//key ：每个文件
                for ( var idx in covinfo[key] ) {
                    if ( idx != 'source' ) {

                        cc[key] = cc[key] || [];
                        cc[key][idx] = (cc[key][idx] || 0) + covinfo[key][idx];
                    }
                }
            }
            return cc;
        }

        var cc = [];

        covmerge( cc, window._$jscoverage );

        var file;
        var files = [];
        for ( file in cc ) {
            if ( !cc.hasOwnProperty( file ) ) {
                continue;
            }

            files.push( file );
        }
        files.sort();
        for ( var f = 0; f < files.length; f++ ) {
            file = files[f];
            var lineNumber;
            var num_statements = 0;
            var num_executed = 0;
            var missing = [];
            var fileCC = cc[file];
            var length = fileCC.length;
            var currentConditionalEnd = 0;
            var conditionals = null;
            if ( fileCC.conditionals ) {
                conditionals = fileCC.conditionals;
            }
            for ( lineNumber = 0; lineNumber < length; lineNumber++ ) {
                var n = fileCC[lineNumber];

                if ( lineNumber === currentConditionalEnd ) {
                    currentConditionalEnd = 0;
                } else if ( currentConditionalEnd === 0 && conditionals
                    && conditionals[lineNumber] ) {
                    currentConditionalEnd = conditionals[lineNumber];
                }

                if ( currentConditionalEnd !== 0 ) {
                    continue;
                }

                if ( n === undefined || n === null ) {
                    continue;
                }

                if ( n === 0 ) {
                    missing.push( lineNumber );
                } else {
                    num_executed++;
                }
                num_statements++;
            }

            var percentage = (num_statements === 0 ? 0 : parseInt( 100 * num_executed / num_statements ));
            var caseName = file.replace( '.js', '' )/**.split( '/' ).join( '.' )*/;
            // 统计所有用例的覆盖率信息和测试结果
//                        window.covinfo[caseName] = percentage;
            if ( tr[caseName] == undefined )
                tr[caseName] = '0,0,_,0,0';
            var info = tr[caseName].split( ',_,' );// 覆盖率的处理在最后环节加入到用例的测试结果中
            parent.window.tr[caseName] = info[0] + ',' + percentage + ',' + info[1];
        }
    }
})();

