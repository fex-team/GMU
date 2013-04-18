module("line/LineChart", {
	setup: function(){
		$("body").append('<div id="linechart" style="width:800px; height:240px;"></div>');
        console.log("setup");
	},
    teardown: function(){
        $("#linechart").remove();
//        lineChart = null;
        console.log("teardown");
        console.log("==========================");
    }
});


function createChart(){
    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":688, "height":178});
    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);
    
    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
    return lineChart;
}

test("create方式创建 & 参数默认",function(){
    stop();
    expect(36);
    ua.loadcss(["chart/LineChart.css"], function(){
	    var lineChart = $.ui.LineChart("#linechart", {});
	    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
	    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);
	    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
	                {type:"rect", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
	    
	    $.later(function(){
	    	
	    	//测试lineChart显示
	    	ok(ua.isShown(lineChart._el[0]), "The lineChart shows");
	    	equals(lineChart._el.attr("id"), "linechart", "The el is right");
	    	
	        // 测试默认属性
	        equals(lineChart.canvas[0].offsetWidth, 320);
	        equals(lineChart.canvas[0].offsetHeight, 160);
	        equals(lineChart.canvas[0].offsetLeft, 60);
	        equals(lineChart.canvas[0].offsetTop, $(".tips-container").height() + 5);
	        equals(lineChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
	        
	        equals(lineChart.data("width"), 320);
	        equals(lineChart.data("height"), 160);
	        equals(lineChart.data("chartOffsetX"), 60);
	        equals(lineChart.data("chartOffsetY"), 5);
	        equals(lineChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
	        equals(lineChart.data("axisColor"), "#999999");
	        equals(lineChart.data("axisLineWidth"), 2);
	        equals(lineChart.data("gridColor"), "#cccccc");
	        equals(lineChart.data("gridLineWidth"), 1);
	        equals(lineChart.data("gridXStep"), 1);
	        equals(lineChart.data("gridYStep"), 1);
	        equals(lineChart.data("showLastSplitLineX"), true);
	        equals(lineChart.data("showLastSplitLineY"), true);
	        equals(lineChart.data("showTouchLine"), true);
	        equals(lineChart.data("enableDrag"), true);
	        equals(lineChart.data("touchTimeout"), 500);
	        
	        // 测试标注个数
	        equals($(".category-label", lineChart._el).length,12, "gridXStep");
	        equals($(".value-label", lineChart._el).length,6, "gridYStep");
	        
	        // 测试标注位置
	        approximateEqual($(".value-label", lineChart._el)[0].offsetTop,
	            (lineChart.canvas[0].offsetHeight + lineChart.canvas[0].offsetTop - $(".value-label", lineChart._el)[0].offsetHeight - lineChart.LINE_CHART_OFFSET),1,
	            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的LINE_CHART_OFFSET#");
	
	        approximateEqual($(".category-label", lineChart._el).last()[0].offsetLeft,
	            (lineChart.canvas[0].offsetLeft + lineChart.canvas[0].offsetWidth - $(".category-label", lineChart._el).last()[0].offsetWidth * 0.5 - lineChart.LINE_CHART_OFFSET),1,
	            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去lineChart的LINE_CHART_OFFSET");
	            
	        // 测试线数量
	        equals(lineChart.lines.length, 2);
	        // 测试线数据值
	        equals(lineChart.lines[1].type, "rect");
	        equals(lineChart.lines[0].name, "graph1");
	        equals(lineChart.lines[0].color, "#0000ff");
	        equals(lineChart.lines[1].data[5], 10);
	            
	        //测试tips样式
	        equals($(".tip-color", lineChart._el)[0].style["backgroundColor"], "rgb(0, 0, 255)");
	        equals($(".tip-color", lineChart._el)[0].textContent, "graph1:");
	        equals($(".tip-color", lineChart._el)[1].style["backgroundColor"], "rgb(255, 0, 0)");
	        equals($(".tip-color", lineChart._el)[1].textContent, "graph2:");
	        
	        start();
	    }, 100);
    });
});

test("setup方式创建",function(){
    stop();
    expect(36);
    
    // 搭建骨架
    $("#linechart").append('<div class="tips-container"></div>');
    $("#linechart").append('<canvas class="chart-canvas"></canvas>');
    
    var lineChart = $("#linechart").LineChart({}).LineChart("setCategoryGrid", ["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]).LineChart("setValueGrid",[0, 20, 40, 60, 80, 100]).LineChart("setData", [{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                {type:"rect", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]).LineChart(this).LineChart("this");
    
    $.later(function(){
    	//测试lineChart显示
    	ok(ua.isShown(lineChart._el[0]), "The lineChart shows");
    	equals(lineChart._el.attr("id"), "linechart", "The el is right");
    	
        // 测试默认属性
        equals(lineChart.canvas[0].offsetWidth, 320);
        equals(lineChart.canvas[0].offsetHeight, 160);
        equals(lineChart.canvas[0].offsetLeft, 60);
        equals(lineChart.canvas[0].offsetTop, Math.round($(".tips-container").height()) + 5);
        equals(lineChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
        
        equals(lineChart.data("width"), 320);
        equals(lineChart.data("height"), 160);
        equals(lineChart.data("chartOffsetX"), 60);
        equals(lineChart.data("chartOffsetY"), 5);
        equals(lineChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
        equals(lineChart.data("axisColor"), "#999999");
        equals(lineChart.data("axisLineWidth"), 2);
        equals(lineChart.data("gridColor"), "#cccccc");
        equals(lineChart.data("gridLineWidth"), 1);
        equals(lineChart.data("gridXStep"), 1);
        equals(lineChart.data("gridYStep"), 1);
        equals(lineChart.data("showLastSplitLineX"), true);
        equals(lineChart.data("showLastSplitLineY"), true);
        equals(lineChart.data("showTouchLine"), true);
        equals(lineChart.data("enableDrag"), true);
        equals(lineChart.data("touchTimeout"), 500);
        
        // 测试标注个数
        equals($(".category-label", lineChart._el).length,12, "gridXStep");
        equals($(".value-label", lineChart._el).length,6, "gridYStep");
        
        // 测试标注位置
        approximateEqual($(".value-label", lineChart._el)[0].offsetTop,
            (lineChart.canvas[0].offsetHeight + lineChart.canvas[0].offsetTop - $(".value-label", lineChart._el)[0].offsetHeight - lineChart.LINE_CHART_OFFSET),1,
            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的LINE_CHART_OFFSET#");

        approximateEqual($(".category-label", lineChart._el).last()[0].offsetLeft,
            (lineChart.canvas[0].offsetLeft + lineChart.canvas[0].offsetWidth - $(".category-label", lineChart._el).last()[0].offsetWidth * 0.5 - lineChart.LINE_CHART_OFFSET),1,
            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去lineChart的LINE_CHART_OFFSET");
            
        // 测试线数量
        equals(lineChart.lines.length, 2);
        // 测试线数据值
        equals(lineChart.lines[1].type, "rect");
        equals(lineChart.lines[0].name, "graph1");
        equals(lineChart.lines[0].color, "#0000ff");
        equals(lineChart.lines[1].data[5], 10);
            
        //测试tips样式
        equals($(".tip-color", lineChart._el)[0].style["backgroundColor"], "rgb(0, 0, 255)");
        equals($(".tip-color", lineChart._el)[0].textContent, "graph1:");
        equals($(".tip-color", lineChart._el)[1].style["backgroundColor"], "rgb(255, 0, 0)");
        equals($(".tip-color", lineChart._el)[1].textContent, "graph2:");
        
        start();
    }, 100);
});

test("初始化大小：数值",function(){
    stop();
    var lineChart;
    //默认值
    lineChart = $.ui.LineChart("#linechart", {"width":600, "height":200});
    $.later(function(){
        equals(lineChart.canvas[0].offsetWidth, 600,"直接设置宽度数值");
        equals(lineChart.canvas[0].offsetHeight, 200,"直接设置宽度数值");
        start();
    },50);
});


test("初始化大小：默认值",function(){
    stop();
    var lineChart;
    //默认值
    lineChart = $.ui.LineChart("#linechart", {});
    $.later(function(){
        equals(lineChart.canvas[0].width,  320,"不设置的话，宽度默认320");
        equals(lineChart.canvas[0].height, 160,"不设置的话，160");
        start();
    },50);
});

test("初始化大小：百分比",function(){
    stop();
    //默认值
    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":"50%", "height":"50%"});
    $.later(function(){
        approximateEqual(lineChart.canvas.width(), 800/2,1,"百分比是父容器宽度的百分比");
        approximateEqual(lineChart.canvas.height(), 240/2, 1,"百分比是父容器高度的百分比");
        start();
    },50);
});

test("初始化其他参数设置,还需要人力看是否正常",function(){
    stop();

    expect(23);
    var lineChart;
    //默认值
    lineChart = $.ui.LineChart("#linechart", {"width":600, "height":200, 
                                                backgroundColor:"#cccccc", 
                                                axisColor:"#666666",
                                                axisLineWidth:4,
                                                gridColor:"#336633",
                                                gridLineWidth:2,
                                                gridXStep:2,
                                                gridYStep:2,
                                                chartOffsetX:70,
                                                chartOffsetY:15,
                                                showLastSplitLineX:false,
                                                showLastSplitLineY:false,
                                                showTouchLine:false,
                                                enableDrag:false,
                                                touchTimeout:800});

    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);

    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
        {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
    
    $.later(function(){
    	equals(lineChart.data("width"), 600);
        equals(lineChart.data("height"), 200);
        equals(lineChart.data("chartOffsetX"), 70);
        equals(lineChart.data("chartOffsetY"), 15);
        equals(lineChart.data("backgroundColor"), '#cccccc');
        equals(lineChart.data("axisColor"), '#666666');
        equals(lineChart.data("axisLineWidth"), 4);
        equals(lineChart.data("gridColor"), "#336633");
        equals(lineChart.data("gridLineWidth"), 2);
        equals(lineChart.data("gridXStep"), 2);
        equals(lineChart.data("gridYStep"), 2);
        equals(lineChart.data("chartOffsetX"), 70);
        equals(lineChart.data("chartOffsetY"), 15);
        equals(lineChart.data("showLastSplitLineX"), false);
        equals(lineChart.data("showLastSplitLineY"), false);
        equals(lineChart.data("showTouchLine"), false);
        equals(lineChart.data("enableDrag"), false);
        equals(lineChart.data("touchTimeout"), 800);

        //实际数值
        equals(lineChart.canvas.css("backgroundColor"),"rgb(204, 204, 204)","backgroundColor背景色");
        equals(lineChart.canvas[0].offsetLeft,70,"chartOffsetX");
        approximateEqual(lineChart.canvas[0].offsetTop,15+$("#linechart .tips-container")[0].offsetHeight,1,"chartOffsetY");

        equals($(".category-label", lineChart._el).length,12/2+1,"gridXStep");
        equals($(".value-label", lineChart._el).length,6/2+1,"gridYStep");

        start();
    }, 50);
});

test("点击交互&数据选中事件", function(){
    stop();
    expect(5);
    var lineChart = createChart();

    var container, canvas;
    lineChart.on("baidu_chart_data_selected",function(event){
        lineChart.off("baidu_chart_data_selected");
        //选中一个点
        equals(event.data.length, 1);
        equals(event.data[0].data, 60);
        equals(event.data[0].name, "graph2");
        // 测试tip显示值
        equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "60");

        $.later(function(){
            start();
        }, 500);
    });

    $.later(function(){
        container = lineChart._el[0];
        canvas = lineChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 311,
                pageY:rect.top + 100
            }]
        });
    },100);
});

test("拖拽事件和TouchEnd事件", function(){
     stop();
     expect(26);
     
     var lineChart = createChart();
     lineChart.on("baidu_chart_data_selected",function(event){
    	//选中一个点
        equals(event.data.length, 1);
        equals(event.data[0].data, 60);
        equals(event.data[0].name, "graph2");
        
        // 测试tip显示值
        equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "60");
        console.log("emulate touch start event triggered");
        
        lineChart.off("baidu_chart_data_selected");
     });
     
     var container, canvas, rect;
     $.later(function(){
        container = lineChart._el[0];
        canvas = lineChart.canvas[0];
        rect = container.getBoundingClientRect();
        
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 311,
                pageY:rect.top + 100
            }]
        });
     },50);
     $.later(function(){
    	 //touch-line
         ok(ua.isShown($(".touch-line", lineChart._el)[0]), ".touch-line被创建");
         approximateEqual($(".touch-line", lineChart._el)[0].offsetLeft, 311);
         var count = 0, xvalue = 0;

         lineChart.on("baidu_chart_data_selected",function(event){
        	 //选中两个点
             equals(event.data.length, 2);
             
             if(count == 1){
            	//选中两个点
            	 equals(event.data[0].data, 50);
                 equals(event.data[0].name, "graph1");
                 equals(event.data[1].data, 10);
                 equals(event.data[1].name, "graph2");
                 
                 //touch-line
            	 ok(ua.isShown($(".touch-line", lineChart._el)[0]), ".touch-line被创建");
                 approximateEqual($(".touch-line", lineChart._el)[0].offsetLeft, 373);
                 
                 // 测试tip显示值
                 equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "50");
                 equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "10");
             }
             if(count == 2){
            	//选中两个点
            	equals(event.data[0].data, 60);
                equals(event.data[0].name, "graph1");
                equals(event.data[1].data, 20);
                equals(event.data[1].name, "graph2");
                
                //touch-line
           	    ok(ua.isShown($(".touch-line", lineChart._el)[0]), ".touch-line被创建");
                approximateEqual($(".touch-line", lineChart._el)[0].offsetLeft, 434);
                
                // 测试tip显示值
                equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "60");
                equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "20");
                 
                lineChart.off("baidu_chart_data_selected");
                
                // 触发touchend事件
                ta.touchend(canvas);
                
                ok(!$(".touch-line", lineChart._el)[0], "touchend事件之后，.touch-line被移除");
                start();
             }
         });
         
         var idx = setInterval(function(){
            count++;
            if(count == 2){
                clearInterval(idx);
            }
            xvalue = count == 1 ? 374 : 435;
            rect = container.getBoundingClientRect();
            
            ta.touchmove(canvas, {
                targetTouches:[{
                    pageX:rect.left + xvalue,
                    pageY:rect.top + 100
                }]
            });
         }, 1200);
     }, 1500);
})

test("多实例",function(){
    stop();
    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":400, "height":200});

    $("body").append('<div id="linechart1" style="width:800px; height:240px;"></div>');
    var lineChart1 = $.ui.LineChart("#linechart1", {"width":300, "height":190});

    expect(4);

    $.later(function(){
        equals(lineChart._el.attr("id"), "linechart","实例id不冲突");
        equals(lineChart1._el.attr("id") , "linechart1");
        equals(lineChart.chartWidth, 400);
        equals(lineChart1.chartWidth, 300, "多实例的属性不冲突");
        $('#linechart1').remove();
        start();
    },50);

});

test("测试setCategoryGrid&setValueGrid接口", function(){
    stop();
    expect(20);
    var lineChart = createChart();
    
    $.later(function(){
        equals(lineChart.categorys.length, 12);
        equals(lineChart.categorys[0], "09pm");
        equals(lineChart.categorys[1], "10pm");
        equals(lineChart.categorys[2], "11pm");
        equals(lineChart.categorys[3], "12pm");
        equals(lineChart.categorys[4], "01am");
        equals(lineChart.categorys[5], "02am");
        equals(lineChart.categorys[6], "03am");
        equals(lineChart.categorys[7], "04am");
        equals(lineChart.categorys[8], "05am");
        equals(lineChart.categorys[9], "06am");
        equals(lineChart.categorys[10], "07am");
        equals(lineChart.categorys[11], "08am");
        equals(lineChart.values.length, 6);
        equals(lineChart.values[0], 0);
        equals(lineChart.values[1], 20);
        equals(lineChart.values[2], 40);
        equals(lineChart.values[3], 60);
        equals(lineChart.values[4], 80);
        equals(lineChart.values[5], 100);
        start();
    }, 50);
});

test("测试clear接口  & baidu_chart_clear事件", function(){
    stop();
    expect(4);

    var lineChart = createChart();
    lineChart.on("baidu_chart_data_rendered",function(){
        notEqual(lineChart.tipsContainer[0].innerHTML, "");
        notEqual(lineChart.lines.length, 0);

        lineChart.clear();
    });
    lineChart.on("baidu_chart_clear",function(){
    	 equals(lineChart.tipsContainer[0].innerHTML, "");
         equals(lineChart.lines.length, 0);

         start();
    });
});

test("测试setData接口", function(){
    stop();
    expect(19);
    
    // lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                // {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);

    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":688, "height":178});
    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);

    lineChart.setData([
        {type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
        {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"},
        {type:"none", name:"graph3", data:[60,40,80,40,80,10,70,60,20,60,20,60], color:"#ff00ff"},
        {type:"rect", name:"graph4", data:[50,75,100,55,65,15,25,95,80,30,15,85], color:"#00ffff"}
    ]);
              
    $.later(function(){
        equals(lineChart.lines.length, 4);
        equals(lineChart.lines[0].type, "diamond");
        equals(lineChart.lines[0].name, "graph1");
        equals(lineChart.lines[0].color, "#0000ff");
        
        equals(lineChart.lines[1].type, "circle");
        equals(lineChart.lines[1].name, "graph2");
        equals(lineChart.lines[1].color, "#ff0000");

        equals(lineChart.lines[2].type, "none");
        equals(lineChart.lines[2].name, "graph3");
        equals(lineChart.lines[2].color, "#ff00ff");

        equals(lineChart.lines[3].type, "rect");
        equals(lineChart.lines[3].name, "graph4");
        equals(lineChart.lines[3].color, "#00ffff");

        //真实元素
        equals($(".tip-group:nth-of-type(1) .tip-color", lineChart._el).css("background-color"),"rgb(0, 0, 255)"); //#0000ff
        equals($(".tip-group:nth-of-type(1) .tip-color", lineChart._el).text(),"graph1:");
        equals(lineChart.lines[0].data[0] , 100);

        equals($(".tip-group:nth-of-type(2) .tip-color", lineChart._el).css("background-color"),"rgb(255, 0, 0)"); //#ff0000
        equals($(".tip-group:nth-of-type(2) .tip-color", lineChart._el).text(),"graph2:");
        equals(lineChart.lines[1].data[1] , 70);
       
        start();
    }, 50);
});

test("测试addData接口 & baidu_chart_data_rendered事件", function(){
    stop();
    expect(19);


    var lineChart = createChart();
    lineChart.on("baidu_chart_data_rendered", function(event){
        lineChart.off("baidu_chart_data_rendered");

        lineChart.addData({type:"none", name:"graph3", data:[60,40,80,40,80,10,70,60,20,60,20,60], color:"#ff00ff"});
        lineChart.addData({type:"rect", name:"graph4", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#00ffff"});
        
        lineChart.on("baidu_chart_data_rendered", function(event){
            equals(lineChart.lines.length, 4);
        
            equals(lineChart.lines[0].type, "diamond");
            equals(lineChart.lines[0].name, "graph1");
            equals(lineChart.lines[0].color, "#0000ff");
            
            equals(lineChart.lines[1].type, "circle");
            equals(lineChart.lines[1].name, "graph2");
            equals(lineChart.lines[1].color, "#ff0000");
            
            
            equals(lineChart.lines[2].type, "none");
            equals(lineChart.lines[2].name, "graph3");
            equals(lineChart.lines[2].color, "#ff00ff");

            equals(lineChart.lines[3].type, "rect");
            equals(lineChart.lines[3].name, "graph4");
            equals(lineChart.lines[3].color, "#00ffff");

            //真实元素
            equals($(".tip-group:nth-of-type(3) .tip-color", lineChart._el).css("background-color"),"rgb(255, 0, 255)"); //#ff00ff
            equals($(".tip-group:nth-of-type(3) .tip-color", lineChart._el).text(),"graph3:");
            equals(lineChart.lines[2].data[0] , 60);


            equals($(".tip-group:nth-of-type(4) .tip-color", lineChart._el).css("background-color"),"rgb(0, 255, 255)"); //#00ffff
            equals($(".tip-group:nth-of-type(4) .tip-color", lineChart._el).text(),"graph4:");
            equals(lineChart.lines[3].data[1] , 70);

            start();
        });
        

    });
});

test("测试setWidth&setHeight接口", function(){
    stop();
    expect(6);

    var lineChart = createChart();
    
    $.later(function(){
        approximateEqual($(".value-label", lineChart._el)[0].offsetTop,
            (lineChart.canvas[0].offsetHeight + lineChart.canvas[0].offsetTop - $(".value-label", lineChart._el)[0].offsetHeight - lineChart.LINE_CHART_OFFSET),1,
            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的LINE_CHART_OFFSET#");

        approximateEqual($(".category-label", lineChart._el).last()[0].offsetLeft,
            (lineChart.canvas[0].offsetLeft + lineChart.canvas[0].offsetWidth - $(".category-label", lineChart._el).last()[0].offsetWidth * 0.5 - lineChart.LINE_CHART_OFFSET),1,
            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去lineChart的LINE_CHART_OFFSET");
        
        lineChart.setWidth(800);
        lineChart.setHeight(400);
    }, 50);
    
    $.later(function(){
        equals(lineChart.canvas[0].offsetWidth, 800);
        equals(lineChart.canvas[0].offsetHeight, 400);
        
        // equals($("#linechart .value-label")[0].offsetTop,800);
        // equals($("#linechart .category-label").last()[0].offsetLeft,400);
        approximateEqual($(".value-label", lineChart._el)[0].offsetTop,
            (lineChart.canvas[0].offsetHeight + lineChart.canvas[0].offsetTop - $(".value-label", lineChart._el)[0].offsetHeight - lineChart.LINE_CHART_OFFSET),1,
            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的LINE_CHART_OFFSET#");

        approximateEqual($(".category-label", lineChart._el).last()[0].offsetLeft,
            (lineChart.canvas[0].offsetLeft + lineChart.canvas[0].offsetWidth - $(".category-label", lineChart._el).last()[0].offsetWidth * 0.5 - lineChart.LINE_CHART_OFFSET),1,
            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去lineChart的LINE_CHART_OFFSET");
        start();
    }, 1500);
});

test("测试调用顺序1", function(){
    stop();
    expect(10);

    var lineChart=createChart();
    $.later(function(){
        lineChart.clear();
        
        lineChart.setData([{type:"diamond", name:"产品1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#000066"},
            {type:"circle", name:"产品2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#660000"}]);
        lineChart.addData({type:"none", name:"产品3", data:[60,40,80,40,80,10,70,60,20,60,20,60], color:"#006f6f"});   
        
        lineChart.on("baidu_chart_data_rendered", function(event){
            equals(lineChart.lines.length, 3);
        
            equals(lineChart.lines[0].type, "diamond");
            equals(lineChart.lines[0].name, "产品1");
            equals(lineChart.lines[0].color, "#000066");
            
            equals(lineChart.lines[1].type, "circle");
            equals(lineChart.lines[1].name, "产品2");
            equals(lineChart.lines[1].color, "#660000");
            
            equals(lineChart.lines[2].type, "none");
            equals(lineChart.lines[2].name, "产品3");
            equals(lineChart.lines[2].color, "#006f6f");
            
            lineChart.off("baidu_chart_data_rendered");
            start();
        }); 
    }, 50);
    
});

test("测试调用顺序2", function(){
    stop();
    expect(7);

    var lineChart = createChart();
    $.later(function(){
        lineChart.clear();
        
        
        lineChart.addData({type:"none", name:"产品3", data:[60,40,80,40,80,10,70,60,20,60,20,60], color:"#006f6f"});    
        
        lineChart.setData([{type:"diamond", name:"产品1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#000066"},
            {type:"circle", name:"产品2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#660000"}]);
            
        lineChart.on("baidu_chart_data_rendered", function(event){
            equals(lineChart.lines.length, 2);
        
            equals(lineChart.lines[0].type, "diamond");
            equals(lineChart.lines[0].name, "产品1");
            equals(lineChart.lines[0].color, "#000066");
            
            equals(lineChart.lines[1].type, "circle");
            equals(lineChart.lines[1].name, "产品2");
            equals(lineChart.lines[1].color, "#660000");
            
            lineChart.off("baidu_chart_data_rendered");
            start();
        });
    }, 50);
});

test("测试touchTimeout(默认)", function(){
    stop();
    expect(3);

    var lineChart = createChart();
    var container, canvas;
    lineChart.on("baidu_chart_data_selected",function(event){
        lineChart.off("baidu_chart_data_selected");
        ok(true);
    });

    $.later(function(){
        container = lineChart._el[0];
        canvas = lineChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 311,
                pageY:rect.top + 100
            }]
        });
        
        //隔490ms去取touch-line，不存在
        $.later(function(){
           ok(!$(".touch-line", lineChart._el)[0], ".touch-line还没有创建");
        }, 490);
        
        //隔510ms去取touch-line，存在
        $.later(function(){
           ok($(".touch-line", lineChart._el)[0], ".touch-line被创建啦");
           
           start();
        }, 510);
    },50);
});

test("测试touchTimeout(传值)", function(){
    stop();
    expect(3);

    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":688, "height":178, touchTimeout:300});
    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);
    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
                
    var container, canvas;
    lineChart.on("baidu_chart_data_selected",function(event){
        lineChart.off("baidu_chart_data_selected");
        ok(true);
    });

    $.later(function(){
        container = lineChart._el[0];
        canvas = lineChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 311,
                pageY:rect.top + 100
            }]
        });
        
        //隔290ms去取touch-line，不存在
        $.later(function(){
           ok(!$(".touch-line", lineChart._el)[0], ".touch-line还没有创建");
        }, 290);
        
        //隔330ms去取touch-line，存在
        $.later(function(){
           ok($(".touch-line", lineChart._el)[0], ".touch-line被创建啦");
           start();
        }, 330);
    },50);
});

test("测试showTouchLine: false", function(){
    stop();
    
    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":688, "height":178, showTouchLine:false});
    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);
    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
                
    var container, canvas;
    lineChart.on("baidu_chart_data_selected",function(event){
        lineChart.off("baidu_chart_data_selected");
        ok(true);
    });

    $.later(function(){
        container = lineChart._el[0];
        canvas = lineChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 311,
                pageY:rect.top + 100
            }]
        });
        
        //隔490ms去取touch-line，不存在
        $.later(function(){
           ok(!$(".touch-line", lineChart._el)[0], ".touch-line还没有创建");
        }, 490);
        
        //隔530ms去取touch-line，不存在
        $.later(function(){
           ok(!$(".touch-line", lineChart._el)[0], ".touch-line依然不会被创建啦");
           
           ta.touchend(canvas);
           
           start();
        }, 530);
    },50);
});

test("enableDrag:false", function(){
    stop();
    expect(6);
    
    var lineChart;
    lineChart = $.ui.LineChart("#linechart", {"width":688, "height":178, enableDrag:false});
    lineChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    lineChart.setValueGrid([0, 20, 40, 60, 80, 100]);
    lineChart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"},
                {type:"circle", name:"graph2", data:[30,70,100,50,60,10,20,50,80,30,10,80], color:"#ff0000"}]);
                
    lineChart.on("baidu_chart_data_selected",function(event){
    	
       //tip-content
       equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "");
       equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "60");
       
       lineChart.off("baidu_chart_data_selected");
    });
    
    var container, canvas, rect;
    $.later(function(){
       container = lineChart._el[0];
       canvas = lineChart.canvas[0];
       rect = container.getBoundingClientRect();
       
       ta.touchstart(canvas,{
           targetTouches:[{
               pageX:rect.left + 311,
               pageY:rect.top + 100
           }]
       });
    },50);
    
    $.later(function(){
   	 	//touch-line
        ok(!ua.isShown($(".touch-line", lineChart._el)[0]), ".touch-line不被创建");
        rect = container.getBoundingClientRect();
       
        ta.touchmove(canvas, {
            targetTouches:[{
                pageX:rect.left + 374,
                pageY:rect.top + 100
            }]
        });
        
        $.later(function(){
        	
            //touch-line
            ok(!ua.isShown($(".touch-line", lineChart._el)[0]), ".touch-line不被创建");
           
            // 测试tip显示值
            equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[0].textContent, "");
            equals($(".tips-container>.tip-group>.tip-content", lineChart._el)[1].textContent, "60");
            ta.touchend(canvas);
            
            start();
        }, 500);
    }, 1000);
})