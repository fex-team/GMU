module("bar/BarChart", {
    setup: function(){
        $("body").append('<div id="barchart" style="width:900px; height:210px;"></div>');
        console.log("setup");
    },
    teardown: function(){
        $("#barchart").remove();
//        lineChart = null;
        console.log("teardown");
        console.log("==========================");
    }
});

function createChart(){
    var barChart;
    barChart = $.ui.BarChart("#barchart");
    barChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    barChart.setValueGrid([0, 4, 8, 12, 16, 20]);
    
    barChart.setData([
                [
                    {
                        "name":"数据1",
                        "color":"#ffcc33",
                        "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
                    },
                    {
                        "name":"数据2",
                        "color":"#3366cc",
                        "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]
                    },
                ],
                {
                    "name":"数据3",
                    "color":"#ff4411",
                    "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
                },
                {
                    "name":"数据4",
                    "color":"#6633bb",
                    "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
                } ]);
    return barChart;
}

test("create方式创建 & 参数默认",function(){
    stop();
    expect(41);
    ua.loadcss(["chart/barChart.css"], function(){
        var barChart;
        barChart = $.ui.BarChart("#barchart");
        barChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
        barChart.setValueGrid([0, 4, 8, 12, 16, 20]);
        barChart.setData([
                [
                    {
                        "name":"数据1",
                        "color":"#ffcc33",
                        "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
                    },
                    {
                        "name":"数据2",
                        "color":"#3366cc",
                        "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]
                    },
                ],
                {
                    "name":"数据3",
                    "color":"#ff4411",
                    "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
                },
                {
                    "name":"数据4",
                    "color":"#6633bb",
                    "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
                } ]);
                
        $.later(function(){
            //测试barChart显示
            ok(ua.isShown(barChart._el[0]), "The barChart shows");
            equals(barChart._el.attr("id"), "barchart", "The el is right");
            
            // 测试默认属性
            equals(barChart.canvas[0].offsetWidth, 840);
            equals(barChart.canvas[0].offsetHeight, 160);
            equals(barChart.canvas[0].offsetLeft, 60);
            equals(barChart.canvas[0].offsetTop, $(".tips-container").height() + 5);
            equals(barChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
            
            equals(barChart.data("width"), 840);
            equals(barChart.data("height"), 160);
            equals(barChart.data("chartOffsetX"), 60);
            equals(barChart.data("chartOffsetY"), 5);
            equals(barChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
            equals(barChart.data("axisColor"), "#999999");
            equals(barChart.data("axisLineWidth"), 2);
            equals(barChart.data("gridColor"), "#cccccc");
            equals(barChart.data("gridLineWidth"), 1);
            equals(barChart.data("gridXStep"), 1);
            equals(barChart.data("gridYStep"), 1);
            equals(barChart.data("showLastSplitLineX"), true);
            equals(barChart.data("showLastSplitLineY"), true);
            equals(barChart.data("barWidth"), 12);
            
            // 测试标注个数
            equals($(".category-label", barChart._el).length,12, "gridXStep");
            equals($(".value-label", barChart._el).length,6, "gridYStep");
            
            // 测试标注位置
            approximateEqual($(".value-label", barChart._el)[0].offsetTop,
                (barChart.canvas[0].offsetHeight + barChart.canvas[0].offsetTop - $(".value-label", barChart._el)[0].offsetHeight - barChart.BAR_CHART_OFFSET),1,
                "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的BAR_CHART_OFFSET#");
           
            approximateEqual($(".category-label", barChart._el).last()[0].offsetLeft,
                (barChart.canvas[0].offsetLeft + barChart.canvas[0].offsetWidth - $(".category-label", barChart._el).last()[0].offsetWidth * 0.5 - barChart.BAR_CHART_OFFSET - (0.5 * (barChart.data("width") - 2 * barChart.BAR_CHART_OFFSET) / 12)),1,
                "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去barChart的BAR_CHART_OFFSET再减去barChart宽度的12分之一的一半");
            
            // 测试线数量
            equals(barChart.barCollections.length, 3);
            equals(barChart.barCollections[0].length, 2);
            equals(barChart.barCollections[1].length, 1);
            equals(barChart.barCollections[2].length, 1);
            
            // 测试线数据值
            equals(barChart.barCollections[1][0].name, "数据3");
            equals(barChart.barCollections[0][0].name, "数据1");
            equals(barChart.barCollections[0][0].color, "#ffcc33");
            equals(barChart.barCollections[1][0].data[5], 11);
            
            //测试tips样式
            equals($(".tip-color", barChart._el)[0].style["backgroundColor"], "rgb(255, 204, 51)");//ffcc33
            equals($(".tip-color", barChart._el)[0].textContent, "数据1:");
            equals($(".tip-color", barChart._el)[1].style["backgroundColor"], "rgb(51, 102, 204)");//3366cc
            equals($(".tip-color", barChart._el)[1].textContent, "数据2:");
            equals($(".tip-color", barChart._el)[2].style["backgroundColor"], "rgb(255, 68, 17)");//ff4411
            equals($(".tip-color", barChart._el)[2].textContent, "数据3:");
            equals($(".tip-color", barChart._el)[3].style["backgroundColor"], "rgb(102, 51, 187)");//6633bb
            equals($(".tip-color", barChart._el)[3].textContent, "数据4:");
            
            start();
        }, 100);
    });
});

test("setup方式创建",function(){
    stop();
    expect(41);
    
    // 搭建骨架
    $("#barchart").append('<div class="tips-container"></div>');
    $("#barchart").append('<canvas class="chart-canvas"></canvas>');
    
    var barChart = $("#barchart").BarChart().BarChart("setCategoryGrid", ["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]).BarChart("setValueGrid",[0, 4, 8, 12, 16, 20]).BarChart("setData", [
        [
            {
                "name":"数据1",
                "color":"#ffcc33",
                "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
            },
            {
                "name":"数据2",
                "color":"#3366cc",
                "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]
            },
        ],
        {
            "name":"数据3",
            "color":"#ff4411",
            "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
        },
        {
            "name":"数据4",
            "color":"#6633bb",
            "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
        }
    ]).BarChart(this).BarChart("this");

    $.later(function(){
        //测试lineChart显示
        ok(ua.isShown(barChart._el[0]), "The barChart shows");
        equals(barChart._el.attr("id"), "barchart", "The el is right");
        
        // 测试默认属性
        equals(barChart.canvas[0].offsetWidth, 840);
        equals(barChart.canvas[0].offsetHeight, 160);
        equals(barChart.canvas[0].offsetLeft, 60);
        equals(barChart.canvas[0].offsetTop, $(".tips-container").height() + 5);
        equals(barChart.canvas.css("backgroundColor"), "rgba(0, 0, 0, 0)");
        
        equals(barChart.data("width"), 840);
        equals(barChart.data("height"), 160);
        equals(barChart.data("chartOffsetX"), 60);
        equals(barChart.data("chartOffsetY"), 5);
        equals(barChart.data("backgroundColor"), "rgba(0, 0, 0, 0)");
        equals(barChart.data("axisColor"), "#999999");
        equals(barChart.data("axisLineWidth"), 2);
        equals(barChart.data("gridColor"), "#cccccc");
        equals(barChart.data("gridLineWidth"), 1);
        equals(barChart.data("gridXStep"), 1);
        equals(barChart.data("gridYStep"), 1);
        equals(barChart.data("showLastSplitLineX"), true);
        equals(barChart.data("showLastSplitLineY"), true);
        equals(barChart.data("barWidth"), 12);
        
        // 测试标注个数
        equals($(".category-label", barChart._el).length,12, "gridXStep");
        equals($(".value-label", barChart._el).length,6, "gridYStep");
        
        // 测试标注位置
        approximateEqual($(".value-label", barChart._el)[0].offsetTop,
            (barChart.canvas[0].offsetHeight + barChart.canvas[0].offsetTop - $(".value-label", barChart._el)[0].offsetHeight - barChart.BAR_CHART_OFFSET),1,
            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去lineChart的BAR_CHART_OFFSET#");
           
        approximateEqual($(".category-label", barChart._el).last()[0].offsetLeft,
            (barChart.canvas[0].offsetLeft + barChart.canvas[0].offsetWidth - $(".category-label", barChart._el).last()[0].offsetWidth * 0.5 - barChart.BAR_CHART_OFFSET - (0.5 * (barChart.data("width") - 2 * barChart.BAR_CHART_OFFSET) / 12)),1,
            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去barChart的BAR_CHART_OFFSET再减去barChart宽度的12分之一的一半");
            
        // 测试线数量
        equals(barChart.barCollections.length, 3);
        equals(barChart.barCollections[0].length, 2);
        equals(barChart.barCollections[1].length, 1);
        equals(barChart.barCollections[2].length, 1);
            
        // 测试线数据值
        equals(barChart.barCollections[1][0].name, "数据3");
        equals(barChart.barCollections[0][0].name, "数据1");
        equals(barChart.barCollections[0][0].color, "#ffcc33");
        equals(barChart.barCollections[1][0].data[5], 11);
            
        //测试tips样式
        equals($(".tip-color", barChart._el)[0].style["backgroundColor"], "rgb(255, 204, 51)");//ffcc33
        equals($(".tip-color", barChart._el)[0].textContent, "数据1:");
        equals($(".tip-color", barChart._el)[1].style["backgroundColor"], "rgb(51, 102, 204)");//3366cc
        equals($(".tip-color", barChart._el)[1].textContent, "数据2:");
        equals($(".tip-color", barChart._el)[2].style["backgroundColor"], "rgb(255, 68, 17)");//ff4411
        equals($(".tip-color", barChart._el)[2].textContent, "数据3:");
        equals($(".tip-color", barChart._el)[3].style["backgroundColor"], "rgb(102, 51, 187)");//6633bb
        equals($(".tip-color", barChart._el)[3].textContent, "数据4:");
            
        start();
    }, 100);
});

test("初始化大小：百分比",function(){
    stop();
    //默认值
    var barChart;
    barChart = $.ui.BarChart("#barchart", {"width":"50%", "height":"50%"});
    $.later(function(){
        approximateEqual(barChart.canvas.width(), 900/2,1,"百分比是父容器宽度的百分比");
        approximateEqual(barChart.canvas.height(), 210/2, 1,"百分比是父容器高度的百分比");
        start();
    },50);
});

test("初始化其他参数设置,还需要人力看是否正常",function(){
    stop();

    expect(21);
    var barChart;
    //默认值
    barChart = $.ui.BarChart("#barchart", {"width":600, "height":200, 
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
                                                barWidth:10});

    barChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    barChart.setValueGrid([0, 20, 40, 60, 80, 100]);

    barChart.setData([
        [
            {
                "name":"数据1",
                "color":"#ffcc33",
                "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
            },
            {
                "name":"数据2",
                "color":"#3366cc",
                "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]
            },
        ],
        {
            "name":"数据3",
            "color":"#ff4411",
            "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
        },
        {
            "name":"数据4",
            "color":"#6633bb",
            "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
        } ]);
    
    $.later(function(){
        equals(barChart.data("width"), 600);
        equals(barChart.data("height"), 200);
        equals(barChart.data("chartOffsetX"), 70);
        equals(barChart.data("chartOffsetY"), 15);
        equals(barChart.data("backgroundColor"), '#cccccc');
        equals(barChart.data("axisColor"), '#666666');
        equals(barChart.data("axisLineWidth"), 4);
        equals(barChart.data("gridColor"), "#336633");
        equals(barChart.data("gridLineWidth"), 2);
        equals(barChart.data("gridXStep"), 2);
        equals(barChart.data("gridYStep"), 2);
        equals(barChart.data("showLastSplitLineX"), false);
        equals(barChart.data("showLastSplitLineY"), false);
        equals(barChart.data("barWidth"), 10);

        //实际数值
        equals(barChart.canvas[0].offsetWidth, 600);
        equals(barChart.canvas[0].offsetHeight, 200);
        equals(barChart.canvas.css("backgroundColor"),"rgb(204, 204, 204)","backgroundColor背景色");
        equals(barChart.canvas[0].offsetLeft,70,"chartOffsetX");
        approximateEqual(barChart.canvas[0].offsetTop,15+$("#barchart .tips-container")[0].offsetHeight,1,"chartOffsetY");

        equals($(".category-label", barChart._el).length,12/2+1,"gridXStep");
        equals($(".value-label", barChart._el).length,6/2+1,"gridYStep");

        start();
    }, 50);
});

test("点击交互&数据选中事件", function(){
    stop();
    expect(7);
    var barChart = createChart();

    var container, canvas;
    barChart.on("baidu_chart_data_selected",function(event){
        barChart.off("baidu_barchart_data_selected");
        //选中一个点
        equals(event.data.length, 1);
        equals(event.data[0].data, 11);
        equals(event.data[0].name, "数据4");
        // 测试tip显示值
        equals($(".tips-container>.tip-group>.tip-content", barChart._el)[0].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", barChart._el)[1].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", barChart._el)[2].textContent, "");
        equals($(".tips-container>.tip-group>.tip-content", barChart._el)[3].textContent, "11");

        $.later(function(){
            start();
        }, 500);
    });

    $.later(function(){
        container = barChart._el[0];
        canvas = barChart.canvas[0];
        var rect = container.getBoundingClientRect();
        ta.touchstart(canvas,{
            targetTouches:[{
                pageX:rect.left + 180,
                pageY:rect.top + 135
            }]
        });
    },100);
});

test("多实例",function(){
    stop();
    var barChart;
    barChart = $.ui.BarChart("#barchart", {"width":400, "height":200});

    $("body").append('<div id="barchart1" style="width:800px; height:240px;"></div>');
    var barChart1 = $.ui.BarChart("#barchart1", {"width":300, "height":190});

    expect(4);

    $.later(function(){
        equals(barChart._el.attr("id"), "barchart","实例id不冲突");
        equals(barChart1._el.attr("id") , "barchart1");
        equals(barChart.chartWidth, 400);
        equals(barChart1.chartWidth, 300, "多实例的属性不冲突");
        $('#barchart1').remove();
        start();
    },50);

});

test("测试setCategoryGrid&setValueGrid接口", function(){
    stop();
    expect(20);
    var barChart = createChart();
    
    $.later(function(){
    	var categorys = $(".category-label", barChart._el),
    	values = $(".value-label", barChart._el);
    	
        equals(categorys.length, 12);
        equals(categorys[0].textContent, "09pm");
        equals(categorys[1].textContent, "10pm");
        equals(categorys[2].textContent, "11pm");
        equals(categorys[3].textContent, "12pm");
        equals(categorys[4].textContent, "01am");
        equals(categorys[5].textContent, "02am");
        equals(categorys[6].textContent, "03am");
        equals(categorys[7].textContent, "04am");
        equals(categorys[8].textContent, "05am");
        equals(categorys[9].textContent, "06am");
        equals(categorys[10].textContent, "07am");
        equals(categorys[11].textContent, "08am");
        equals(values.length, 6);
        equals(values[0].textContent, 0);
        equals(values[1].textContent, 4);
        equals(values[2].textContent, 8);
        equals(values[3].textContent, 12);
        equals(values[4].textContent, 16);
        equals(values[5].textContent, 20);
        start();
    }, 50);
});

test("测试clear接口  & baidu_chart_clear事件", function(){
    stop();
    expect(4);

    var barChart = createChart();
    barChart.on("baidu_chart_data_rendered",function(){
        notEqual(barChart.tipsContainer[0].innerHTML, "");
        notEqual(barChart.barCollections.length, 0);

        barChart.clear();
    });
    barChart.on("baidu_chart_clear",function(){
         equals(barChart.tipsContainer[0].innerHTML, "");
         equals(barChart.barCollections.length, 0);

         start();
    });
});

test("测试setData接口", function(){
    stop();
    expect(18);
    
    var barChart;
    barChart = $.ui.BarChart("#barchart", {"width":688, "height":178});
    barChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
    barChart.setValueGrid([0, 20, 40, 60, 80, 100]);
    
    barChart.setData([
        [
            {
                "name":"数据1",
                "color":"#ffcc33",
                "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
            },
            {
                "name":"数据2",
                "color":"#3366cc",
                "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]
            },
        ],
        {
            "name":"数据3",
            "color":"#ff4411",
            "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
        },
        {
            "name":"数据4",
            "color":"#6633bb",
            "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
        } ]);
        
    $.later(function(){
        equals(barChart.barCollections.length, 3);
        equals(barChart.barCollections[0].length, 2);
        equals(barChart.barCollections[1].length, 1);
        equals(barChart.barCollections[2].length, 1);
        
        equals(barChart.barCollections[1][0].name, "数据3");
        equals(barChart.barCollections[1][0].color, "#ff4411");

        equals(barChart.barCollections[2][0].name, "数据4");
        equals(barChart.barCollections[2][0].color, "#6633bb");

        equals(barChart.barCollections[0][0].name, "数据1");
        equals(barChart.barCollections[0][0].color, "#ffcc33");
        
        equals(barChart.barCollections[0][1].name, "数据2");
        equals(barChart.barCollections[0][1].color, "#3366cc");

        //真实元素
        equals($(".tip-group:nth-of-type(1) .tip-color", barChart._el).css("background-color"),"rgb(255, 204, 51)"); //#0000ff
        equals($(".tip-group:nth-of-type(1) .tip-color", barChart._el).text(),"数据1:");
        equals(barChart.barCollections[0][0].data[0] , 1);

        equals($(".tip-group:nth-of-type(2) .tip-color", barChart._el).css("background-color"),"rgb(51, 102, 204)"); //#ff0000
        equals($(".tip-group:nth-of-type(2) .tip-color", barChart._el).text(),"数据2:");
        equals(barChart.barCollections[1][0].data[1] , 10);
       
        start();
    }, 50);
});

test("测试addData接口 & baidu_chart_data_rendered事件", function(){
    stop();
    expect(19);

    var barChart = createChart();
    barChart.on("baidu_chart_data_rendered", function(event){
        barChart.off("baidu_chart_data_rendered");

        barChart.addData({name:"新数据1", data:[6,4,8,4,8,1,7,6,2,6,2,6], color:"#ff00ff"});
        barChart.addData({name:"新数据2", data:[3,7,10,5,6,1,2,5,8,3,1,8], color:"#00ffff"});
        
        barChart.on("baidu_chart_data_rendered", function(event){
            equals(barChart.barCollections.length, 5);
        
            equals(barChart.barCollections[0][0].name, "数据1");
            equals(barChart.barCollections[0][0].color, "#ffcc33");
            
            equals(barChart.barCollections[0][1].name, "数据2");
            equals(barChart.barCollections[0][1].color, "#3366cc");
            
            
            equals(barChart.barCollections[1][0].name, "数据3");
            equals(barChart.barCollections[1][0].color, "#ff4411");
            
            equals(barChart.barCollections[2][0].name, "数据4");
            equals(barChart.barCollections[2][0].color, "#6633bb");
            
            equals(barChart.barCollections[3][0].name, "新数据1");
            equals(barChart.barCollections[3][0].color, "#ff00ff");
            
            equals(barChart.barCollections[4][0].name, "新数据2");
            equals(barChart.barCollections[4][0].color, "#00ffff");


            //真实元素
            equals($(".tip-group:nth-of-type(5) .tip-color", barChart._el).css("background-color"),"rgb(255, 0, 255)"); //#ff00ff
            equals($(".tip-group:nth-of-type(5) .tip-color", barChart._el).text(),"新数据1:");
            equals(barChart.barCollections[3][0].data[1] , 4);


            equals($(".tip-group:nth-of-type(6) .tip-color", barChart._el).css("background-color"),"rgb(0, 255, 255)"); //#00ffff
            equals($(".tip-group:nth-of-type(6) .tip-color", barChart._el).text(),"新数据2:");
            equals(barChart.barCollections[4][0].data[0] , 3);

            start();
        });
    });
});

test("测试setWidth&setHeight接口", function(){
    stop();
    expect(6);

    var barChart = createChart();
    
    $.later(function(){
        approximateEqual($(".value-label", barChart._el)[0].offsetTop,
            (barChart.canvas[0].offsetHeight + barChart.canvas[0].offsetTop - $(".value-label", barChart._el)[0].offsetHeight - barChart.BAR_CHART_OFFSET),1,
            "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去barChart的BAR_CHART_OFFSET#");

        approximateEqual($(".category-label", barChart._el).last()[0].offsetLeft,
            (barChart.canvas[0].offsetLeft + barChart.canvas[0].offsetWidth - $(".category-label", barChart._el).last()[0].offsetWidth * 0.5 - barChart.BAR_CHART_OFFSET - (0.5 * (barChart.data("width") - 2 * barChart.BAR_CHART_OFFSET) / 12)),1,
            "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去barChart的BAR_CHART_OFFSET再减去barChart宽度的12分之一的一半");
        
        barChart.setWidth(800);
        barChart.setHeight(400);
        
        $.later(function(){
            equals(barChart.canvas[0].offsetWidth, 800);
            equals(barChart.canvas[0].offsetHeight, 400);
            
            approximateEqual($(".value-label", barChart._el)[0].offsetTop,
                (barChart.canvas[0].offsetHeight + barChart.canvas[0].offsetTop - $(".value-label", barChart._el)[0].offsetHeight - barChart.BAR_CHART_OFFSET),1,
                "value-label的第一个标注的定位是：#canvas的高度加上canvas在父容器的top再减去这个标注的高度再减去barChart的BAR_CHART_OFFSET#");

            approximateEqual($(".category-label", barChart._el).last()[0].offsetLeft,
                (barChart.canvas[0].offsetLeft + barChart.canvas[0].offsetWidth - $(".category-label", barChart._el).last()[0].offsetWidth * 0.5 - barChart.BAR_CHART_OFFSET - (0.5 * (barChart.data("width") - 2 * barChart.BAR_CHART_OFFSET) / 12)),1,
                "category-label的最后一个标注的定位是：#canvas的宽度减去这个标注的宽度的一半再减去barChart的BAR_CHART_OFFSET再减去barChart宽度的12分之一的一半");
                
            start();
        }, 50);
    }, 50);
});

test("测试调用顺序1", function(){
    stop();
    expect(13);

    var barChart=createChart();
    $.later(function(){
        barChart.clear();
        
        barChart.setData([
            [
                {
                    "name":"数据1",
                    "color":"#33cc33",
                    "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
                }
            ],
            {
                "name":"数据2",
                "color":"#664411",
                "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
            },
            {
                "name":"数据3",
                "color":"#663333",
                "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
            } ]);
        
        barChart.addData({name:"产品1", data:[6,4,8,4,8,1,7,6,2,6,2,6], color:"#006f6f"});   
        
        barChart.on("baidu_chart_data_rendered", function(event){
            equals(barChart.barCollections.length, 4);
        
            equals(barChart.barCollections[0].length, 1);
            equals(barChart.barCollections[0][0].name, "数据1");
            equals(barChart.barCollections[0][0].color, "#33cc33");
            
            equals(barChart.barCollections[1].length, 1);
            equals(barChart.barCollections[1][0].name, "数据2");
            equals(barChart.barCollections[1][0].color, "#664411");
            
            equals(barChart.barCollections[2].length, 1);
            equals(barChart.barCollections[2][0].name, "数据3");
            equals(barChart.barCollections[2][0].color, "#663333");
            
            equals(barChart.barCollections[3].length, 1);
            equals(barChart.barCollections[3][0].name, "产品1");
            equals(barChart.barCollections[3][0].color, "#006f6f");
            
            barChart.off("baidu_chart_data_rendered");
            start();
        }); 
    }, 50);
});

test("测试调用顺序2", function(){
    stop();
    expect(10);

    var barChart = createChart();
    $.later(function(){
        barChart.clear();
        
        barChart.addData({name:"产品1", data:[6,4,8,4,8,1,7,6,2,6,2,6], color:"#006f6f"});   
        
        barChart.setData([
            [
                {
                    "name":"数据1",
                    "color":"#33cc33",
                    "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]
                }
            ],
            {
                "name":"数据2",
                "color":"#664411",
                "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]
            },
            {
                "name":"数据3",
                "color":"#663333",
                "data":[9, 11, 8, 9, 12, 10, 11, 11, 8, 4, 10, 6]
            } ]);
        
        barChart.on("baidu_chart_data_rendered", function(event){
            equals(barChart.barCollections.length, 3);
        
            equals(barChart.barCollections[0].length, 1);
            equals(barChart.barCollections[0][0].name, "数据1");
            equals(barChart.barCollections[0][0].color, "#33cc33");
            
            equals(barChart.barCollections[1].length, 1);
            equals(barChart.barCollections[1][0].name, "数据2");
            equals(barChart.barCollections[1][0].color, "#664411");
            
            equals(barChart.barCollections[2].length, 1);
            equals(barChart.barCollections[2][0].name, "数据3");
            equals(barChart.barCollections[2][0].color, "#663333");
            
            barChart.off("baidu_chart_data_rendered");
            start();
        });
    }, 50);
});

test("destroy",function(){
    ua.destroyTest(function(w,f){
    	$("#barchart").remove();
    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

        w.$("body").append('<div id="barchart" style="width:900px; height:210px;"></div>');
        
        var barChart = w.$.ui.BarChart("#barchart");
        barChart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
        barChart.setValueGrid([0, 4, 8, 12, 16, 20]);
        barChart.setData([
                    {
                        "name":"数据1",
                        "color":"#ffcc33",
                        "data":[11, 14, 15, 12, 11, 13, 11, 12, 15, 3, 5, 2]
                    }
                ]);
        
        var me = this;
        $.later(function(){
        	barChart.destroy();
            
            var el2= w.dt.eventLength();
            var ol = w.dt.objLength(barChart);
            var dl2 =w.dt.domLength(w);

            equal(dl1,dl2,"The dom is ok");
            equal(el1,el2,"The event is ok");
            ok(ol==0,"The toolbar is destroy");
            me.finish();        
        },100);
    });
});
