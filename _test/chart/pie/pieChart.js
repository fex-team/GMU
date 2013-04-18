module("pie/PieChart", {
    setup: function(){
        $("body").append('<div id="piechart" style="width:360px; height:360px;"></div>');
        console.log("setup");
    },
    teardown: function(){
        $("#piechart").remove();
        console.log("teardown");
        console.log("==========================");
    }
});

function createChart(){
    var pieChart;
    pieChart = $.ui.PieChart("#piechart", {"width":380, "height":380});
    pieChart.setData([{name:"数据1", color:"#69cceb", data:37}, 
        {name:"数据2", color:"#ffdd7b", data:54},
        {name:"数据3", color:"#fa99bc", data:24},
        {name:"数据4", color:"#84bd92", data:52},
        {name:"数据5", color:"#f45e5d", data:20}]);
    return pieChart;
}

test("create方式创建 & 参数默认",function(){
    stop();
    expect(20);
    ua.loadcss(["chart/barChart.css"], function(){
        var pieChart;
        pieChart = $.ui.PieChart("#piechart", {"width":360, "height":360});
        pieChart.setData([{name:"数据1", color:"#69cceb", data:37}, 
            {name:"数据2", color:"#ffdd7b", data:54},
            {name:"数据3", color:"#fa99bc", data:24},
            {name:"数据4", color:"#84bd92", data:52},
            {name:"数据5", color:"#f45e5d", data:20}]);
        
        $.later(function(){
            //测试pieChart显示
            ok(ua.isShown(pieChart._el[0]), "The pieChart shows");
            equals(pieChart._el.attr("id"), "piechart", "The el is right");
            
            // 测试默认属性
            equals(pieChart.canvas[0].offsetWidth, 360);
            equals(pieChart.canvas[0].offsetHeight, 360);
            equals(pieChart.canvas[0].offsetLeft, 0);
            equals(pieChart.canvas[0].offsetTop, $(".tips-container").height());
            equals(pieChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
            
            equals(pieChart.data("width"), 360);
            equals(pieChart.data("height"), 360);
            equals(pieChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
            equals(pieChart.data("innerRadius"), "15%");
            equals(pieChart.data("outterRadius"), "40%");
            
            // 测试pie数量
            equals(pieChart.pies.length, 5);
            
            // 测试线数据值
            equals(pieChart.pies[0].data, 37);
            equals(pieChart.pies[1].data, 54);
            equals(pieChart.pies[2].data, 24);
            
            //测试tips样式
            equals($(".tip-color", pieChart._el)[0].style["backgroundColor"], "rgb(105, 204, 235)");//69cceb
            equals($(".tip-color", pieChart._el)[0].textContent, "数据1:");
            equals($(".tip-color", pieChart._el)[1].style["backgroundColor"], "rgb(255, 221, 123)");//ffdd7b
            equals($(".tip-color", pieChart._el)[1].textContent, "数据2:");
            
            start();
        }, 100);
    });
});

test("setup方式创建",function(){
    stop();
    expect(20);
    
    // 搭建骨架
    $("#piechart").append('<div class="tips-container"></div>');
    $("#piechart").append('<canvas class="chart-canvas"></canvas>');
    
    var pieChart = $("#piechart").PieChart({width:360, height:360}).PieChart("setData", [
        {name:"数据1", color:"#69cceb", data:37}, 
        {name:"数据2", color:"#ffdd7b", data:54},
        {name:"数据3", color:"#fa99bc", data:24},
        {name:"数据4", color:"#84bd92", data:52},
        {name:"数据5", color:"#f45e5d", data:20}
    ]).PieChart(this).PieChart("this");
    
    $.later(function(){
        //测试pieChart显示
        ok(ua.isShown(pieChart._el[0]), "The pieChart shows");
        equals(pieChart._el.attr("id"), "piechart", "The el is right");
            
        // 测试默认属性
        equals(pieChart.canvas[0].offsetWidth, 360);
        equals(pieChart.canvas[0].offsetHeight, 360);
        equals(pieChart.canvas[0].offsetLeft, 0);
        equals(pieChart.canvas[0].offsetTop, $(".tips-container").height());
        equals(pieChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
            
        equals(pieChart.data("width"), 360);
        equals(pieChart.data("height"), 360);
        equals(pieChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
        equals(pieChart.data("innerRadius"), "15%");
        equals(pieChart.data("outterRadius"), "40%");
            
        // 测试pie数量
        equals(pieChart.pies.length, 5);
            
        // 测试线数据值
        equals(pieChart.pies[0].data, 37);
        equals(pieChart.pies[1].data, 54);
        equals(pieChart.pies[2].data, 24);
            
        //测试tips样式
        equals($(".tip-color", pieChart._el)[0].style["backgroundColor"], "rgb(105, 204, 235)");//69cceb
        equals($(".tip-color", pieChart._el)[0].textContent, "数据1:");
        equals($(".tip-color", pieChart._el)[1].style["backgroundColor"], "rgb(255, 221, 123)");//ffdd7b
        equals($(".tip-color", pieChart._el)[1].textContent, "数据2:");
            
        start();
    }, 100);
});

test("初始化大小：数值",function(){
    stop();
    var pieChart;
    //默认值
    pieChart = $.ui.PieChart("#piechart", {"width":240, "height":200});
    $.later(function(){
        equals(pieChart.canvas[0].offsetWidth, 240, "直接设置宽度数值");
        equals(pieChart.canvas[0].offsetHeight, 200, "直接设置宽度数值");
        start();
    },50);
});

test("初始化大小：默认值",function(){
    stop();
    var pieChart;
    //默认值
    pieChart = $.ui.PieChart("#piechart", {});
    $.later(function(){
        equals(pieChart.canvas[0].width,  360,"不设置的话，宽度默认360");
        equals(pieChart.canvas[0].height, 360,"不设置的话，360");
        start();
    },50);
});

test("初始化大小：百分比",function(){
    stop();
    //默认值
    var pieChart;
    pieChart = $.ui.PieChart("#piechart", {"width":"50%", "height":"50%"});
    $.later(function(){
        approximateEqual(pieChart.canvas.width(), 360/2, 1,"百分比是父容器宽度的百分比");
        approximateEqual(pieChart.canvas.height(), 360/2, 1,"百分比是父容器高度的百分比");
        start();
    },50);
});

test("点击交互&数据选中事件", function(){
    stop();
    expect(5);
    var pieChart = createChart();
    
    var container, canvas;
    pieChart.on("baidu_chart_data_selected",function(event){
        pieChart.off("baidu_barchart_data_selected");
        //选中一个点
        equals(event.data.length, 1);
        equals(event.data[0].data, 54);
        equals(event.data[0].name, "数据2");
        // 测试tip显示值
        equals($(".tips-container>.tip-group>.tip-content", pieChart._el)[0].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", pieChart._el)[1].textContent, "54");

        $.later(function(){
            start();
        }, 500);
    });

    $.later(function(){
        container = pieChart._el[0];
        canvas = pieChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 270,
                pageY:rect.top + 220
            }]
        });
    },100);
});

test("多实例",function(){
    stop();
    var pieChart;
    pieChart = $.ui.PieChart("#piechart", {"width":400, "height":200});

    $("body").append('<div id="piechart1" style="width:800px; height:240px;"></div>');
    var pieChart1 = $.ui.PieChart("#piechart1", {"width":300, "height":190});

    expect(4);

    $.later(function(){
        equals(pieChart._el.attr("id"), "piechart","实例id不冲突");
        equals(pieChart1._el.attr("id") , "piechart1");
        equals(pieChart.chartWidth, 400);
        equals(pieChart1.chartWidth, 300, "多实例的属性不冲突");
        $('#barchart1').remove();
        start();
    },50);

});

test("测试clear接口  & baidu_chart_clear事件", function(){
    stop();
    expect(4);

    var pieChart = createChart();
    pieChart.on("baidu_chart_data_rendered",function(){
        notEqual(pieChart.tipsContainer[0].innerHTML, "");
        notEqual(pieChart.pies.length, 0);

        pieChart.clear();
    });
    pieChart.on("baidu_chart_clear",function(){
         equals(pieChart.tipsContainer[0].innerHTML, "");
         equals(pieChart.pies.length, 0);

         start();
    });
});

test("测试setData接口", function(){
    stop();
    expect(20);
    
    var pieChart;
    pieChart = $.ui.PieChart("#piechart", {"width":380, "height":380});
    pieChart.setData([{name:"数据1", color:"#69cceb", data:37}, 
        {name:"数据2", color:"#ffdd7b", data:54},
        {name:"数据3", color:"#fa99bc", data:24},
        {name:"数据4", color:"#84bd92", data:52},
        {name:"数据5", color:"#f45e5d", data:20}]);
        
    $.later(function(){
        equals(pieChart.pies.length, 5);
        equals(pieChart.pies[0].name, "数据1");
        equals(pieChart.pies[1].name, "数据2");
        equals(pieChart.pies[2].name, "数据3");
        equals(pieChart.pies[3].name, "数据4");
        equals(pieChart.pies[4].name, "数据5");
        
        equals(pieChart.pies[0].color, "#69cceb");
        equals(pieChart.pies[1].color, "#ffdd7b");
        equals(pieChart.pies[2].color, "#fa99bc");
        equals(pieChart.pies[3].color, "#84bd92");
        equals(pieChart.pies[4].color, "#f45e5d");
        
        equals(pieChart.pies[0].data, 37);
        equals(pieChart.pies[1].data, 54);
        equals(pieChart.pies[2].data, 24);
        equals(pieChart.pies[3].data, 52);
        equals(pieChart.pies[4].data, 20);
        
        //真实元素
        equals($(".tip-group:nth-of-type(1) .tip-color", pieChart._el).css("background-color"),"rgb(105, 204, 235)"); //#69cceb
        equals($(".tip-group:nth-of-type(1) .tip-color", pieChart._el).text(),"数据1:");

        equals($(".tip-group:nth-of-type(2) .tip-color", pieChart._el).css("background-color"),"rgb(255, 221, 123)"); //#ffdd7b
        equals($(".tip-group:nth-of-type(2) .tip-color", pieChart._el).text(),"数据2:");
       
        start();
    }, 50);
});

test("测试addData接口 & baidu_chart_data_rendered事件", function(){
    stop();
    expect(26);

    var pieChart = createChart();
    pieChart.on("baidu_chart_data_rendered", function(event){
        pieChart.off("baidu_chart_data_rendered");

        pieChart.addData({name:"新数据1", data:64, color:"#ff00ff"});
        pieChart.addData({name:"新数据2", data:36, color:"#00ffff"});
        
        pieChart.on("baidu_chart_data_rendered", function(event){
            equals(pieChart.pies.length, 7);
            equals(pieChart.pies[0].name, "数据1");
            equals(pieChart.pies[1].name, "数据2");
            equals(pieChart.pies[2].name, "数据3");
            equals(pieChart.pies[3].name, "数据4");
            equals(pieChart.pies[4].name, "数据5");
            equals(pieChart.pies[5].name, "新数据1");
            equals(pieChart.pies[6].name, "新数据2");
        
            equals(pieChart.pies[0].color, "#69cceb");
            equals(pieChart.pies[1].color, "#ffdd7b");
            equals(pieChart.pies[2].color, "#fa99bc");
            equals(pieChart.pies[3].color, "#84bd92");
            equals(pieChart.pies[4].color, "#f45e5d");
            equals(pieChart.pies[5].color, "#ff00ff");
            equals(pieChart.pies[6].color, "#00ffff");
        
            equals(pieChart.pies[0].data, 37);
            equals(pieChart.pies[1].data, 54);
            equals(pieChart.pies[2].data, 24);
            equals(pieChart.pies[3].data, 52);
            equals(pieChart.pies[4].data, 20);
            equals(pieChart.pies[5].data, 64);
            equals(pieChart.pies[6].data, 36);

            //真实元素
            equals($(".tip-group:nth-of-type(6) .tip-color", pieChart._el).css("background-color"),"rgb(255, 0, 255)"); //#ff00ff
            equals($(".tip-group:nth-of-type(6) .tip-color", pieChart._el).text(),"新数据1:");


            equals($(".tip-group:nth-of-type(7) .tip-color", pieChart._el).css("background-color"),"rgb(0, 255, 255)"); //#00ffff
            equals($(".tip-group:nth-of-type(7) .tip-color", pieChart._el).text(),"新数据2:");

            start();
        });
    });
});

test("测试setWidth&setHeight接口", function(){
    stop();
    expect(2);

    var pieChart = createChart();
    
    $.later(function(){
        pieChart.setWidth(800);
        pieChart.setHeight(400);
    }, 50);
    
    $.later(function(){
        equals(pieChart.canvas[0].offsetWidth, 800);
        equals(pieChart.canvas[0].offsetHeight, 400);
        
            
        start();
    }, 1500);
});

test("测试调用顺序1", function(){
    stop();
    expect(12);

    var pieChart=createChart();
    $.later(function(){
        pieChart.clear();
        
        pieChart.setData([
            {
                "name":"产品1",
                "color":"#664411",
                "data":45
            },
            {
                "name":"产品2",
                "color":"#6633ff",
                "data":22
            },
            {
                "name":"产品3",
                "color":"#668866",
                "data":64
            },
            {
                "name":"产品4",
                "color":"#339933",
                "data":13
            } ]);
        
        pieChart.addData({name:"产品5", data:30, color:"#006f6f"});   
        
        pieChart.on("baidu_chart_data_rendered", function(event){
            equals(pieChart.pies.length, 5);
        
            equals(pieChart.pies.length, 5);
            equals(pieChart.pies[0].name, "产品1");
            equals(pieChart.pies[0].color, "#664411");
            
            equals(pieChart.pies[1].name, "产品2");
            equals(pieChart.pies[1].color, "#6633ff");
            
            equals(pieChart.pies[2].name, "产品3");
            equals(pieChart.pies[2].color, "#668866");
            
            equals(pieChart.pies[3].name, "产品4");
            equals(pieChart.pies[3].color, "#339933");
            
            equals(pieChart.pies[4].name, "产品5");
            equals(pieChart.pies[4].color, "#006f6f");
            
            pieChart.off("baidu_chart_data_rendered");
            start();
        }); 
    }, 50);
});

test("测试调用顺序2", function(){
    stop();
    expect(9);

    var pieChart = createChart();
    $.later(function(){
        pieChart.clear();
        
        pieChart.addData({name:"产品5", data:30, color:"#006f6f"});   
        
        pieChart.setData([
            {
                "name":"产品1",
                "color":"#664411",
                "data":45
            },
            {
                "name":"产品2",
                "color":"#6633ff",
                "data":22
            },
            {
                "name":"产品3",
                "color":"#668866",
                "data":64
            },
            {
                "name":"产品4",
                "color":"#339933",
                "data":13
            } ]);
        
        pieChart.on("baidu_chart_data_rendered", function(event){
            equals(pieChart.pies.length, 4);
        
            equals(pieChart.pies[0].name, "产品1");
            equals(pieChart.pies[0].color, "#664411");
            
            equals(pieChart.pies[1].name, "产品2");
            equals(pieChart.pies[1].color, "#6633ff");
            
            equals(pieChart.pies[2].name, "产品3");
            equals(pieChart.pies[2].color, "#668866");
            
            equals(pieChart.pies[3].name, "产品4");
            equals(pieChart.pies[3].color, "#339933");
            
            pieChart.off("baidu_chart_data_rendered");
            start();
        }); 
    }, 50);
});