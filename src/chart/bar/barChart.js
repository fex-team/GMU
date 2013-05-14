/**
 * @file
 * @name BarChart
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/chart/barchart/barchart_demo.html</qrcode>
 * 柱状图
 * @import zepto.js, core/extend.js, core/ui.js, chart/base/Chart.js
 */
(function(){
    /**
     * @name    $.ui.BarChart
     * @grammar $.ui.BarChart(el, options) ⇒ instance
     * @grammar $.ui.BarChart(options) ⇒ instance
     * @grammar BarChart(options) ⇒ self
     * @desc **el** 
     * css选择器, 或者zepto对象
     * 
     * 根元素选择器或者对象
     * **Options**
     * - ''width''              {Number|Percent}: (可选)图表区域的宽度，可以使像素值或者百分比。若不设置，则为父容器宽度。
     * - ''height''             {Number|Percent}: (可选)图表区域的高度，可以使像素值或者百分比。若不设置，则为父容器高度。
     * - ''backgroundColor''    {Number}: (可选)cssbackgroundColor属性。
     * - ''axisColor''          {Number}: (可选)#xxxxxx格式。坐标轴颜色。
     * - ''axisLineWidth''      {Number}: (可选)坐标轴线宽度。
     * - ''gridColor''          {Number}: (可选)#xxxxxx格式。图表网格颜色。
     * - ''gridLineWidth''      {Number}: (可选)图表网格线宽度。
     * - ''gridXStep''          {Number}: (可选)横轴间隔数。TODO...
     * - ''gridYStep''          {Number}: (可选)纵轴间隔数。TODO...
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/chart/barchart/barchart_demo.html">
     * ../gmu/_examples/chart/barchart/barchart_demo.html
     * ../gmu/_examples/chart/barchart/barChart.css
     * </codepreview>
     */
     $.ui.define("BarChart", {
            chartWidth:0,          // 图表宽
            chartHeight:0,         // 图表高
            tipsHeight:0,          // 标注高
            maxVal:0,              // y轴的最大值
            minVal:0,              // y轴的最小值
            
            BAR_CHART_OFFSET:4,   // 图表起点在Canvas中的偏移，这个值在线图中是为了边界的点不要被盖住;
            COLLISION_OFFSET:40,   //
            barCollections:[],
            icons:[],
            tips:[],
            
            inherit:$.ui.Chart,
            
            _data:{
                chartOffsetX:60,            // 图表内容在容器中x方向上的偏移量
                chartOffsetY:5,             // 图表内容在容器中y方向上的偏移量
                width:840,
                height:160,
                backgroundColor:"rgba(0, 0, 0, 0)",
                axisColor: "#999999",
                axisLineWidth:2,
                gridColor: "#cccccc",
                gridLineWidth:1,
                gridXStep:1,
                gridYStep:1,
                showLastSplitLineX:true,
                showLastSplitLineY:true,
                showTouchLine:true,
                enableDrag:true,
                touchTimeout:500,
                barWidth:12
            },
            
            _create:function(){
                this.tipsContainer = $("<div class='tips-container'></div>");
                this.root().append(this.tipsContainer);
                this.canvas = $("<canvas class='chart-canvas'></canvas>");
                this.root().append(this.canvas);
            },
            
             _setup:function(){
                this.tipsContainer = $("#barchart .tips-container");
                this.canvas = $("#barchart canvas");
            },
            
            _init:function(){
                me = this;
                $.ui.Chart.prototype._init.call(this);
            },
            
            _do_init:function(){
                var rect = this.root()[0].getBoundingClientRect();
                var reg = new RegExp("([0-9]+)%$", "gi");
                if(reg.test(this.data("width"))){
                    this.chartWidth = (rect.right - rect.left) * RegExp.$1 * 0.01;
                }
                this.chartWidth = this.chartWidth ? this.chartWidth : parseFloat(this.data("width")) || (rect.right - rect.left);

                reg = new RegExp("([0-9]+)%$", "gi");
                if(reg.test(this.data("height"))){
                    this.chartHeight = (rect.bottom - rect.top) * RegExp.$1 * 0.01;
                }
                this.chartHeight = this.chartHeight ? this.chartHeight : parseFloat(this.data("height")) || (rect.bottom - rect.top);

                rect = this.tipsContainer[0].getBoundingClientRect();
                this.tipsHeight = rect.bottom - rect.top;

                this.canvas.attr({"width":this.chartWidth + "px", "height":this.chartHeight + "px"});
                this.canvas.css({"left":this.data("chartOffsetX")+"px", "top":(this.data("chartOffsetY") + this.tipsHeight)+"px", "background-color":this.data("backgroundColor")});

                // 注册事件 TODO...
                this.canvas.on("touchstart", this._touchStartEvent); // 因为tap没法拿到点击坐标，所以用touchstart来代替tap
                //this.canvas.on("touchend", this._touchEndEvent);
            },
            
            _drawChart:function(){
                this._drawLabels();
                this._drawGrids();
            },
            
            _drawLabels:function(){
                // 绘制Category标注
                this.hlabs = this.hlabs || [];
                var $elem = this.root()[0];
                while(this.hlabs.length){
                    this.hlabs.shift().remove();
                }
                var i = 0, iLen = this.categorys.length, $span, box;
                var categoryUnit = (this.chartWidth - 2 * this.BAR_CHART_OFFSET) / this.categorys.length ; // x轴画线需要间隔的距离
                for(var xstep = this.data("gridXStep"); i < iLen; i+=xstep) {
                    $span = $("<span class='category-label'>"+this.categorys[i]+"</span>");
                    this.root().append($span);
                    box = $span[0].getBoundingClientRect();
                    $span.css({"top":(this.data("chartOffsetY") + this.canvas[0].offsetHeight + this.tipsHeight) + "px", "left":(this.data("chartOffsetX") + this.BAR_CHART_OFFSET + (i + 0.5) * categoryUnit - box.width * 0.5)+"px"});
                    this.hlabs.push($span);
                }
                if((i - xstep) != (iLen - 1)){  // 最后标注必须展现
                    $span = $("<span class='category-label'>"+this.categorys[iLen - 1]+"</span>");
                    this.root().append($span);
                    box = $span[0].getBoundingClientRect();
                    $span.css({"top":(this.data("chartOffsetY") + this.canvas[0].offsetHeight + this.tipsHeight) + "px", "left":(this.data("chartOffsetX") + this.chartWidth - 0.5 * categoryUnit - this.BAR_CHART_OFFSET - box.width * 0.5)+"px"});
                    this.hlabs.push($span);
                }
                
                this.vlabs = this.vlabs || [];
                while(this.vlabs.length){
                    this.vlabs.shift().remove();
                }
                var valueUnit = (this.chartHeight - 2 * this.BAR_CHART_OFFSET) / (this.values.length - 1);  // y轴画线需要间隔的距离
                this.maxVal = Math.max.apply(null, this.values);
                this.minVal = Math.min.apply(null, this.values);

                for(i = 0, iLen = this.values.length, ystep = this.data("gridYStep"); i < iLen; i+=ystep){
                    $span = $("<span class='value-label'>"+this.values[i]+"</span>");
                    this.root().append($span);
                    box = $span[0].getBoundingClientRect();
                    var tmp = "";
                    if(i == 0){
                        tmp = (this.data("chartOffsetY") + this.chartHeight - this.BAR_CHART_OFFSET - box.height + this.tipsHeight) + "px";
                    } else {
                        tmp = (this.data("chartOffsetY") + this.chartHeight - this.BAR_CHART_OFFSET - i * valueUnit - box.height * 0.5 + this.tipsHeight) + "px;";
                    }
                    $span.css({"left":(this.data("chartOffsetX") - box.width - 10) + "px", "top":tmp});
                    this.vlabs.push($span);
                }
                if((i - ystep) != (iLen - 1)){
                    $span = $("<span class='value-label'>"+this.values[iLen - 1]+"</span>");
                    this.root().append($span);
                    box = $span[0].getBoundingClientRect();
                    var tmp = (this.data("chartOffsetY") + this.tipsHeight + this.BAR_CHART_OFFSET - box.height * 0.5) + "px";
                    $span.css({"left":(this.data("chartOffsetX") - box.width - 10) + "px", "top":tmp});
                    this.vlabs.push($span);
                }
            },
            
            _drawGrids:function(){
                var canvas = this.canvas[0];
                var context2d = canvas.getContext("2d");
                context2d.clearRect(0, 0, canvas.width, canvas.height);

                var x1 = this.BAR_CHART_OFFSET;
                var y1 = this.BAR_CHART_OFFSET;
                var y2 = this.chartHeight - this.BAR_CHART_OFFSET;
                var x2 = this.chartWidth - this.BAR_CHART_OFFSET;
                // draw axis
                context2d.strokeStyle = this.data("axisColor");
                context2d.lineWidth = this.data("axisLineWidth");
                context2d.beginPath();
                drawLines(context2d, [{x:x1, y:y1}, {x:x1, y:y2}, {x:x2, y:y2}]);
                context2d.stroke();
                
                // draw grids
                context2d.strokeStyle = this.data("gridColor");
                context2d.lineWidth = this.data("gridLineWidth");
                context2d.beginPath();
                var i = 1, iLen = this.categorys.length, dest = 0.0;
                var categoryUnit = (this.chartWidth - 2 * this.BAR_CHART_OFFSET) / this.categorys.length; // x轴画线需要间隔的距离
                for(xstep = this.data("gridXStep"), i = 0; i < iLen; i+= xstep){
                    dest = this.BAR_CHART_OFFSET + (i + 0.5) * categoryUnit;
                    drawLines(context2d, [{x:dest, y:this.BAR_CHART_OFFSET}, {x:dest, y:this.chartHeight - this.BAR_CHART_OFFSET}]);
                }
                if(this.data("showLastSplitLineX")){
                    dest = this.chartWidth - this.BAR_CHART_OFFSET;
                    drawLines(context2d, [{x:dest, y:this.BAR_CHART_OFFSET}, {x:dest, y:this.chartHeight - this.BAR_CHART_OFFSET}]);
                }
                
                var valueUnit = (this.chartHeight - 2 * this.BAR_CHART_OFFSET) / (this.values.length - 1);  // y轴画线需要间隔的距离
                for(ystep = this.data("gridYStep"), i = ystep, iLen = this.values.length - 1; i < iLen; i+=ystep){
                    dest = this.chartHeight - this.BAR_CHART_OFFSET - i * valueUnit;
                    drawLines(context2d, [{x:this.BAR_CHART_OFFSET, y:dest}, {x:this.chartWidth - this.BAR_CHART_OFFSET, y:dest}]);
                }
                if(this.data("showLastSplitLineY")){
                    dest = this.BAR_CHART_OFFSET;
                    drawLines(context2d, [{x:this.BAR_CHART_OFFSET, y:dest}, {x:this.chartWidth - this.BAR_CHART_OFFSET, y:dest}]);
                }

                context2d.stroke();
            },
            
            _drawData:function(){
                var i = 0, iLen = 0, j = 0, jLen = 0, temp = 0,
                    xval = 0, yval = 0,
                    startx = 0, starty = 0, barWidth = this.data("barWidth"),
                    minx = this.barCollections.length % 2 ? -1 * barWidth * (Math.floor(this.barCollections.length / 2) + 0.5) : -1 * barWidth * (this.barCollections.length / 2),
                    context2d = this.canvas[0].getContext("2d"),
                    categoryUnit = (this.chartWidth - 2 * this.BAR_CHART_OFFSET) / this.categorys.length, // x轴画线需要间隔的距离
                    height = this.chartHeight - 2 * this.BAR_CHART_OFFSET,
                    context2d = this.canvas[0].getContext("2d"),
                    bar = null;
                
                for(i = 0, iLen = this.categorys.length; i < iLen; i++){
                    startx = this.BAR_CHART_OFFSET + (i + 0.5) * categoryUnit;
                    for(j = 0, jLen = this.barCollections.length; j < jLen; j++){
                        starty = 0;
                        for(k = 0, kLen = this.barCollections[j].length; k < kLen; k++){
                            bar = this.barCollections[j][k];
                            context2d.fillStyle = bar.color;
                            temp = height * bar.data[i] / (this.maxVal - this.minVal);
                            
                            xval = startx + minx + j * barWidth;
                            yval = this.BAR_CHART_OFFSET + height - temp - starty;
                            
                            context2d.fillRect(xval, yval, barWidth, temp);
                            starty = starty + temp;
                            
                            bar.area[i] = bar.area[i] || {};
                            bar.area[i].left = xval;
                            bar.area[i].top = yval;
                            bar.area[i].right = xval + barWidth;
                            bar.area[i].bottom = yval + temp;
                        }
                    }
                }
            },
            
            /**
             * 真正完成添加线对象的方法。
             * @private
             */
            _addData:function(obj){
                if(!this.tipsContainer.children().length){
                    var $tmp = $("<div style='width:" + this.data("chartOffsetX") +"px;height:25px;margin-right:5px;float:left;'></div>");
                    this.tipsContainer.append($tmp);
                }
            
                var i = 0, iLen = 0, arr = [];
                if(typeof obj == "object" && obj.length && obj.constructor == Array){   // 是数组
                    for(i = 0, iLen = obj.length; i < iLen; i++){
                        var bar = new Bar(obj[i]);
                        arr.push(bar);
                        this._addTip(obj[i]);
                    }
                    this.barCollections.push(arr);
                } else {    // 是对象
                    this._addTip(obj);
                    this.barCollections.push([new Bar(obj)]);
                }
            },
            
            _addTip:function(obj){
                var $group  = $("<span class='tip-group'></span>");
                var $icon = $("<span class='tip-color' style='background-color:"+obj.color+"'>"+obj.name+":"+"</span>");
                $group.append($icon);
                this.icons.push($icon);

                var $txt = $("<span class='tip-content'></span>");
                $group.append($txt);
                this.tips.push($txt);
                this.tipsContainer.append($group);
            },
            
            _touchStartEvent:function(event){
                var rect = me.root()[0].getBoundingClientRect();
                me.containerLeft = rect.left + document.body.scrollLeft;
                me.containerTop = rect.top + document.body.scrollTop;

                var touch = event.targetTouches[0];
                var xpos = touch.pageX - (me.containerLeft + me.data("chartOffsetX"));
                var ypos = touch.pageY - (me.containerTop + me.data("chartOffsetY") + me.tipsHeight);
                var matched = false, i = 0, iLen = 0, j = 0, jLen = 0, k = 0, kLen = 0, tipIdx = 0;
                for(i = 0, iLen = me.categorys.length; i < iLen; i++){
                    tipIdx = 0;
                    for(j = 0, jLen = me.barCollections.length; j < jLen; j++){
                        for(k = 0, kLen = me.barCollections[j].length; k < kLen; k++){
                            bar = me.barCollections[j][k];
                            if(xpos <= bar.area[i].right 
                                && xpos >= bar.area[i].left
                                && ypos >= bar.area[i].top
                                && ypos <= bar.area[i].bottom){
                                matched = true;
                                me.tips[tipIdx].text(bar.data[i]);
                                me.trigger("baidu_chart_data_selected", [{data:bar.data[i], name:bar.name}]);
                                break;
                            }
                            tipIdx++;
                            console.log("###", tipIdx)
                        }
                        if(matched){
                            break;
                        }
                    }
                    if(matched){
                        break;
                    }
                }
            },
        
            /**
             * @private 
             */
            draw:function(){
                if(this.invalidHash[this.INVALID_TYPE.INIT]){
                    this._do_init();
                }
                if(this.invalidHash[this.INVALID_TYPE.ALL]){
                    this._drawChart();
                    this._drawData();
                }
                if(this.invalidHash[this.INVALID_TYPE.DATA]){
                    this._drawData();
                }

                $.ui.Chart.prototype.draw.apply(this);
            },
            
            /**
             * @name    setCategoryGrid
             * @desc    设置横轴标注
             * @param   {Array} 表示横轴标注。
             * @grammar setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('setCategoryGrid', ["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
             */
            setCategoryGrid:function(value){
                this.categorys = (value || []).concat();
                this.invalide(this.INVALID_TYPE.ALL);
                return this;
            },
            
            /**
             * @name    setValueGrid
             * @desc    设置纵轴标注
             * @param   {Array} 表示纵轴标注
             * @grammar setValueGrid([0, 20, 40, 60, 80, 100]) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('setValueGrid', [0, 20, 40, 60, 80, 100]);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.setValueGrid([0, 20, 40, 60, 80, 100]);
             */
            setValueGrid:function(value){
                this.values = (value || []).concat();
                this.invalide(this.INVALID_TYPE.ALL);
                return this;
            },
            
            /**
             * @name    setWidth
             * @desc    设置图表宽度
             * @param   {Number} 设置图表宽度
             * @grammar setWidth(800) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('setWidth', 800);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.setWidth(800);
             */
            setWidth:function(value){
                this.chartWidth = value;
                this._data.width = value;

                this._do_init();
                
                var i = 0, iLen = 0, j = 0, jLen = 0, newarr = [], temp;
                for(i = 0, iLen = this.barCollections.length; i < iLen; i++){
                    if(this.barCollections[i].length > 1){
                        temp = [];
                        for(j = 0, jLen = this.barCollections[i].length; j < jLen; j++){
                            temp.push({"name":this.barCollections[i][j].name, "data":this.barCollections[i][j].data, "color":this.barCollections[i][j].color});
                        }
                        newarr.push(temp);
                    } else {
                        newarr.push({"name":this.barCollections[i][0].name, "data":this.barCollections[i][0].data, "color":this.barCollections[i][0].color});
                    }
                }
                this.setData(newarr);
                return this;
            },

            /**
             * @name    setHeight
             * @desc    设置图表高度
             * @param   {Number} 设置图表高度
             * @grammar setHeight(240) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('setHeight', 240);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.setHeight(240);
             */
            setHeight:function(value){
                this.chartHeight = value;
                this._data.height = value;

                this._do_init();
               
                var i = 0, iLen = 0, j = 0, jLen = 0, newarr = [], temp;
                for(i = 0, iLen = this.barCollections.length; i < iLen; i++){
                    if(this.barCollections[i].length > 1){
                        temp = [];
                        for(j = 0, jLen = this.barCollections[i].length; j < jLen; j++){
                            temp.push({"name":this.barCollections[i][j].name, "data":this.barCollections[i][j].data, "color":this.barCollections[i][j].color});
                        }
                        newarr.push(temp);
                    } else {
                        newarr.push({"name":this.barCollections[i][0].name, "data":this.barCollections[i][0].data, "color":this.barCollections[i][0].color});
                    }
                }
                this.setData(newarr);
                return this;
            },
            
            /**
             * @name setData
             * @desc 设置数据对象。
             * @param  {Array} Object数组。数组中每一个元素是一个数组或者Object。如果是Object，格式为{type:..., name:..., data:..., color:...}；如果是数组，格式为[{type:..., name:..., data:..., color:...}, {type:..., name:..., data:..., color:...}, ...]
             * @grammar setData([ [{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}],{"name":"数据3", "color":"#ff4411", "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]} ]) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('setData', [ [{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}],{"name":"数据3", "color":"#ff4411", "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]} ]);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.setData([ [{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}],{"name":"数据3", "color":"#ff4411", "data":[12, 10, 6, 11, 9, 11, 8, 4, 11, 8, 9, 10]} ]);
             */
            setData:function(arr){
                this.barCollections.splice(0, this.barCollections.length);
                this.tips = [];
                this.icons = [];
                this.tipsContainer[0].innerHTML = "";
                
                for(var i = 0, iLen = arr.length; i < iLen; i++){
                    this._addData(arr[i]);
                }

                $.ui.Chart.prototype.setData.apply(this, [arr]);
                return this;
            },
            
            /**
             * @name addData
             * @desc 设置数据对象。
             * @param  {*} 参数是一个数组或者Object。如果是Object，格式为{type:..., name:..., data:..., color:...}；如果是数组，格式为[{type:..., name:..., data:..., color:...}, {type:..., name:..., data:..., color:...}, ...]
             * @grammar addData([{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}]) => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('addData', [{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}]);
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.addData([{"name":"数据1", "color":"#ffcc33", "data":[1, 4, 5, 2, 1, 3, 1, 2, 5, 3, 5, 2]}, {"name":"数据2", "color":"#3366cc", "data":[7, 9, 11, 8, 13, 11, 9, 12, 9, 14, 8, 13]}]);
             */
            addData:function(obj){
                var i = 0, iLen = 0, j = 0, jLen = 0, newarr = [], temp;
                for(i = 0, iLen = this.barCollections.length; i < iLen; i++){
                    if(this.barCollections[i].length > 1){
                        temp = [];
                        for(j = 0, jLen = this.barCollections[i].length; j < jLen; j++){
                            temp.push({"name":this.barCollections[i][j].name, "data":this.barCollections[i][j].data, "color":this.barCollections[i][j].color});
                        }
                        newarr.push(temp);
                    } else {
                        newarr.push({"name":this.barCollections[i][0].name, "data":this.barCollections[i][0].data, "color":this.barCollections[i][0].color});
                    }
                }
                newarr.push(obj);
                this.setData(newarr);
                return this;
            },
            
            /**
             * @name    clear
             * @desc    清除绘制的数据
             * @grammar clear() => instance
             * @example
             * //setup mode
             * $('#barchart').BarChart('clear');
             *
             * //render mode
             * var barchart = $.ui.BarChart();
             * barchart.clear();
             */
            clear:function(){
                this.barCollections.splice(0, this.barCollections.length);
                this.tips = [];
                this.icons = [];

                this.tipsContainer[0].innerHTML = "";
                this._do_init();
                this._drawChart();

                $.ui.Chart.prototype.clear.apply(this);
                return this;
            }
     });
     
     function drawLines(context, pts){
        var x1 = pts[0].x, y1 = pts[0].y, x2, y2;
        for(var i = 0, iLen = pts.length - 1; i < iLen; i++){
            x2 = pts[i+1].x;
            y2 = pts[i+1].y;

            if(x1 == x2){
                x1 = Math.round(x1) + 0.5;
                x2 = x1;
            } else if(y1 == y2){
                y1 = Math.round(y1) + 0.5;
                y2 = y1;
            }

            if(i == 0){
                context.moveTo(x1, y1);
            }
            context.lineTo(x2, y2);

            x1 = x2;
            y1 = y2;
        }
    }
    
    function Bar(obj){
        this.name = obj.name;
        this.data = obj.data;
        this.color = obj.color;
        this.area = [];
    }
    
    Bar.prototype.draw = function(context2d, startx, starty, chartWidth, chartHeight, maxVal, minVal, LINE_CHART_OFFSET){
        context2d.fillStyle = this.color;
        context2d.fillRect(0, 0, 30, 60);
    }
})();
