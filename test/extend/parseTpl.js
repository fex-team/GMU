module('parseTpl');

test("parseTpl", function() {
    expect(1);
    var obj = {
            name: 'ajean',
            pwd: 1234567
        },
        tpl = '登录名<%=name%>，密码<%=pwd%>';
    equal('登录名ajean，密码1234567', $.parseTpl(tpl, obj));
});