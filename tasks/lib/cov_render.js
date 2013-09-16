(function() {
    'use strict';
    // -----------------------------------------------------------------------------
    // list
    var templates = {
            codeListTotal: 'Total | @{coverStatementTotal} | @{coverBranchTotal} | @{coverFunctionTotal}',
            codeListLine: '@{fileName} | @{coverStatement} | @{coverBranch} | @{coverFunction}'
        },
        codeIndex;

    function format( source, data ) {
        var rtn = source,
            blank = {}, item;

        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;

            if (item = data[key])
                item = item.toString().replace(/\$/g, "$$$$");

            item = typeof item === "undefined" ? "" : item;
            rtn = rtn.replace(RegExp("@{" + key + "}", "g"), item);
        }

        return rtn.toString();
    }

    function round(digit, length) {
        length = length ? parseInt(length) : 0;
        if (length <= 0) return Math.round(digit);
        digit = Math.round(digit * Math.pow(10, length)) / Math.pow(10, length);
        return digit;
    }

    function coverStatement(cc) {
        var scov = 0,
            ssum = 0;
        if (cc)
            var s = cc.s;
        for (var i in s) {
            ssum++;
            if (s[i] > 0)
                scov++;
        }

        if (cc) {
            cc.ssum = ssum;
            cc.scov = scov;
        }

        var srate = ssum == 0 ? 1 : scov / ssum;
        if (cc)
            return round(srate * 100, 2) + "% (" + scov + "/" + ssum + ")";
        else return "<font class=nan>NAN</font>";
    }

    function coverBranch(cc) {
        var bcov = 0,
            bsum = 0;
        if (cc)
            var b = cc.b;
        for (var i in b) {
            for (var j = 0; j < b[i].length; j++) {
                bsum++;
                if (b[i][j] > 0)
                    bcov++;
            }
        }

        if (cc) {
            cc.bsum = bsum;
            cc.bcov = bcov;
        }

        var brate = bsum == 0 ? 1 : bcov / bsum;

        if (cc)
            return round(brate * 100, 2) + "% (" + bcov + "/" + bsum + ")";
        else return "<font class=nan>NAN</font>";
    }

    function coverFunction(cc) {
        var fcov = 0,
            fsum = 0;
        if (cc)
            var f = cc.f;
        for (var i in f) {
            fsum++;
            if (f[i] > 0)
                fcov++;
        }

        if (cc) {
            cc.fsum = fsum;
            cc.fcov = fcov;
        }

        var frate = fsum == 0 ? 1 : fcov / fsum;

        if (cc)
            return round(frate * 100, 2) + "% (" + fcov + "/" + fsum + ")";
        else return "<font class=nan>NAN</font>";
    }

    function coverStatementGraph(cc) {
        if (cc) {
            var scov = cc.scov,
                ssum = cc.ssum;
        }

        var srate = ssum == 0 ? 1 : scov / ssum;

        return Math.round(srate * 100);
    }

    function coverStatementTotal(ccList) {
        var scov = 0,
            ssum = 0;

        for (var i in ccList) {
            ssum += ccList[i].ssum;
            scov += ccList[i].scov;
        }

        var srate = ssum == 0 ? 0 : scov / ssum;

        return round(srate * 100, 2) + "% (" + scov + "/" + ssum + ")";
    }

    function coverBranchTotal(ccList) {
        var bcov = 0,
            bsum = 0;

        for (var i in ccList) {
            bsum += ccList[i].bsum;
            bcov += ccList[i].bcov;
        }

        var brate = bsum == 0 ? 0 : bcov / bsum;

        return round(brate * 100, 2) + "% (" + bcov + "/" + bsum + ")";
    }

    function coverFunctionTotal(ccList) {
        var fcov = 0,
            fsum = 0;

        for (var i in ccList) {
            fsum += ccList[i].fsum;
            fcov += ccList[i].fcov;
        }

        var frate = fsum == 0 ? 0 : fcov / fsum;

        return round(frate * 100, 2) + "% (" + fcov + "/" + fsum + ")";
    }

    function coverStatementGraphTotal(ccList) {
        var scov = 0,
            ssum = 0;

        for (var i in ccList) {
            ssum += ccList[i].ssum;
            scov += ccList[i].scov;
        }

        var srate = ssum == 0 ? 0 : scov / ssum;

        return Math.round(srate * 100);
    }

    function codeTemplate(cc) {
        return format(templates.codeListLine, {
            id: cc.path,
            index: ++codeIndex,
            fileName: cc.path,
            coverStatement: coverStatement(cc),
            coverBranch: coverBranch(cc),
            coverFunction: coverFunction(cc),
            coverStatementGraph: coverStatementGraph(cc)
        });
    }

    function codeTotalTemplate(ccList) {
        return format(templates.codeListTotal, {
            coverStatementTotal: coverStatementTotal(ccList),
            coverBranchTotal: coverBranchTotal(ccList),
            coverFunctionTotal: coverFunctionTotal(ccList),
            coverStatementGraphTotal: coverStatementGraphTotal(ccList)
        });
    }

    function codeListTemplate(ccList) {
        var htmls,
            i;

        htmls = [];

        codeIndex = 0;

        for (i in ccList) {
            htmls[codeIndex + 1] = codeTemplate(ccList[i]);
        };

        htmls[0] = codeTotalTemplate(ccList);

        return htmls.join('\n');
    }

    module.exports = function( coverage ){
        var data = [
                //['名称', '语句覆盖', '分支覆盖', '函数覆盖']
                ['Name', 'Statement', 'Condition', 'Function']
            ],
            text;
            
        text = codeListTemplate(coverage);
        text = text.split(/\n/g);
        for( var i=0, len = text.length; i<len; i++ ) {
            data.push( text[i].split(/\s\|\s/g) );
        }
        return data;
    };
})();