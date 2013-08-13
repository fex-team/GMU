module("webapp - button - plugin",{
    setup:function(){
        $("body").append("<div id='btsn_create'></div>");
    },
    teardown: function(){
        $('#btsn_create').remove();
    }
});

// todo