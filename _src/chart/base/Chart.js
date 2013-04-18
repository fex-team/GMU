/**
 * DVBase继承自Widget，是图表库的基类。
 */
(function(){
	var Chart = {};
	
	$.extend(Chart, {
		INVALID_TYPE:{
				INIT:"init",
				ALL:"all",
				DATA:"data"
		},
		
		EVENT_TYPE:{
			DATA_RENDERED:"baidu_chart_data_rendered",
			DATA_SELECTED:"baidu_chart",
			CLEAR:"clear"
		},
		
		_init : function(){
			this.inCallLaterPhase = false;
        	this.invalidHash = {};
        	this.invalide(this.INVALID_TYPE.INIT);
		},
		
		_create:function(){
			//console.log("create");
		},
		
		_setup:function(){
			//console.log("setup");
		},
		
		invalide : function(prop){
        	this.invalidHash[prop] = true;
        	this.callLater();
   		},
   		
   		validate : function(){
        	for(var key in this.invalidHash){
            	delete this.invalidHash[key];
        	}
    	},
    	
    	callLater : function(){
        	if(this.inCallLaterPhase){
            	return; 
        	}
            
        	this.inCallLaterPhase = true;
        	var me = this;
        	setTimeout(function(){me.refresh.apply(me);}, 50);
    	},
    	
    	draw : function(){
    		// Chart里的draw什么都不做
        	//console.log("execute draw function in Chart");
        	
        	//this.trigger("baidu_chart_data_rendered");
    	},
    	
    	refresh : function(){
        	this.draw();
            
        	this.validate();
        	this.inCallLaterPhase = false;
        	
        	this.trigger("baidu_chart_data_rendered");
    	},
    	
    	clear : function(){
    		this.validate();
        	this.inCallLaterPhase = false;
    		this.trigger("baidu_chart_clear");
    	},
    	
    	setData : function(arr){
    		//console.log("execute setData function in Chart");
    		
    		this.invalide(this.INVALID_TYPE.ALL);
    	},
    	
    	addData : function(obj){
    		//console.log("execute addData function in Chart");
    		this.invalide(this.INVALID_TYPE.DATA);
    	}
	})
	
	$.ui.define("Chart", Chart);
})();
