var dt={
    eventCount:0,
    objCount:0,
    domCount:0,

    addEvent:function(){
        var me = this;
        me.eventCount = 0;
        var addEventHandler = document.addEventListener;
        document.addEventListener = function(){
            me.eventCount++;
            addEventHandler.apply(this,arguments);
        }
    },

    removeEvent:function(){
        var me =this;
        var removeEventHandler = document.removeEventListener;
        document.removeEventListener = function(){
             me.eventCount--;
             removeEventHandler.apply(this,arguments);
        }
    },

    _objLength:function(obj){
        var me =this;
		var $$ = top.$J;
        $$.each(obj,function(key,val){
            if($$.isPlainObject(val)){
                me._objLength(val);
            }
           me.objCount ++;
        });
    },

    _domLength:function(dom){
        var me =this;
        me.domCount ++;
		var $$ = top.$J;
        $.each($$(dom).children(),function(key,val){
            if($$(val).children()!=null || $$(val).children()!=undefined){
                me._domLength(val);
            }
        });
    },

    eventLength:function(){
        return this.eventCount;
    },

    objLength:function(obj){
        this._objLength(obj);
        var length = this.objCount;
        this.objCount = 0;
        return length;
    },

    domLength:function(w){
         this._domLength(w.document.body);
         var length  = this.domCount;
         this.domCount = 0;
         return length;
    }
};
dt.addEvent();
dt.removeEvent();
