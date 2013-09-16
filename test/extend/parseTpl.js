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

test("一次编译，多次Render", function() {
    expect(3);
    var tpl = '登录名<% if( name ) {%><%= name %><% } %>，密码<%=pwd%>',
        fn = $.parseTpl( tpl );
    equal('登录名ajean，密码1234567', fn( {
        name: 'ajean',
        pwd: 1234567
    } ) );

    equal('登录名abc，密码321', fn( {
        name: 'abc',
        pwd: 321
    } ) );

    equal('登录名，密码321', fn( {
        name: '',
        pwd: 321
    } ) );
});