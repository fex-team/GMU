// button.js变化比较大，测试用例全部重新写。

module("webapp - button",{
    setup:function(){
        $("body").append("<div id='btsn_create'></div>");
    },
    teardown: function(){
        $('#btsn_create').remove();
    }
});

test( 'label', function() {
    var container = $( '#btsn_create' ),
        btn;

    btn = $( '<a>按钮</a>' );
    btn.button();
    equal( btn.text(), '按钮' );
    btn.button( 'destroy' );

    btn = $( '<a data-label="按钮2">按钮</a>' );
    btn.button();
    equal( btn.text(), '按钮2' );
    btn.button( 'destroy' );

    btn = $( '<a data-label="">按钮</a>' );
    btn.button();
    equal( btn.text(), '' );
    btn.button( 'destroy' );
} );


test( 'icon', function() {
    // todo
} );