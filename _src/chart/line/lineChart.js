/**
 * @file
 * @name LineChart
 * @desc 折线图
 * @import core/zepto.js, core/zepto.extend.js, core/zepto.ui.js, chart/base/Chart.js
 */
(function(){
    /**
     * @name    $.ui.LineChart
     * @grammar $.ui.LineChart(el, options) ⇒ instance
     * @grammar $.ui.LineChart(options) ⇒ instance
     * @grammar LineChart(options) ⇒ self
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
     * - ''gridXStep''          {Number}: (可选)横轴间隔数。默认为1。
     * - ''gridYStep''          {Number}: (可选)纵轴间隔数。默认为1。
     * - ''showLastSplitLineX'' {Boolean} 是否展示x轴最后一条线。
     * - ''showLastSplitLineY'' {Boolean} 是否展示y轴最后一条线。
     * - ''showTouchLine''      {Boolean} 手指按下时是否展示选择线。
     * - ''enableDrag''         {Boolean} 是否允许拖拽操作。
     * - ''touchTimeout''       {Number}  手指按下多少毫秒后进入拖拽模式。
     * 
     * **Demo**
     * <codepreview href="../gmu/_examples/chart/linechart/linechart_demo.html">
     * ../gmu/_examples/chart/linechart/linchart_demo.html
     * ../gmu/_examples/chart/linechart/lineChart.css
     * </codepreview>
     */
    $.ui.define("LineChart", {
        chartWidth:0,          // 图表宽
        chartHeight:0,         // 图表高
        tipsHeight:0,          // 标注高度
        maxVal:0,              // y轴的最大值
        minVal:0,              // y轴的最小值

        LINE_CHART_OFFSET:4,   // 图表起点在Canvas中的偏移，这个值在线图中是为了边界的点不要被盖住;
        COLLISION_OFFSET:40,   //
        lines:[],
        newLines:[],
        icons:[],
        tips:[],
        
        inherit:$.ui.Chart,

        _data:{
            chartOffsetX:60,            // 图表内容在容器中x方向上的偏移量
            chartOffsetY:5,             // 图表内容在容器中y方向上的偏移量
            width:320,
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
            touchTimeout:500
        },

        _create:function(){
            this.tipsContainer = $("<div class='tips-container'></div>");
            this.root().append(this.tipsContainer);
            this.canvas = $("<canvas class='chart-canvas'></canvas>");
            this.root().append(this.canvas);
        },

        _setup:function(){
            this.tipsContainer = $("#linechart .tips-container");
            this.canvas = $("#linechart canvas");
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
            this.canvas.on("touchend", this._touchEndEvent);

            this.$touchLine = null;
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
            var categoryUnit = (this.chartWidth - 2 * this.LINE_CHART_OFFSET) / (this.categorys.length - 1); // x轴画线需要间隔的距离
            for(var xstep = this.data("gridXStep"); i < iLen; i+=xstep) {
                $span = $("<span class='category-label'>"+this.categorys[i]+"</span>");
                this.root().append($span);
                box = $span[0].getBoundingClientRect();
                $span.css({"top":(this.data("chartOffsetY") + this.canvas[0].offsetHeight + this.tipsHeight) + "px", "left":(this.data("chartOffsetX") + this.LINE_CHART_OFFSET + i * categoryUnit - box.width * 0.5)+"px"});
                this.hlabs.push($span);
            }
            if((i - xstep) != (iLen - 1)){  // 最后标注必须展现
                $span = $("<span class='category-label'>"+this.categorys[iLen - 1]+"</span>");
                this.root().append($span);
                box = $span[0].getBoundingClientRect();
                $span.css({"top":(this.data("chartOffsetY") + this.canvas[0].offsetHeight + this.tipsHeight) + "px", "left":(this.data("chartOffsetX") + this.chartWidth - this.LINE_CHART_OFFSET - box.width * 0.5)+"px"});
                this.hlabs.push($span);
            }

            this.vlabs = this.vlabs || [];
            while(this.vlabs.length){
                this.vlabs.shift().remove();
            }
            var valueUnit = (this.chartHeight - 2 * this.LINE_CHART_OFFSET) / (this.values.length - 1);  // y轴画线需要间隔的距离
            this.maxVal = Math.max.apply(null, this.values);
            this.minVal = Math.min.apply(null, this.values);

            for(i = 0, iLen = this.values.length, ystep = this.data("gridYStep"); i < iLen; i+=ystep){
                $span = $("<span class='value-label'>"+this.values[i]+"</span>");
                this.root().append($span);
                box = $span[0].getBoundingClientRect();
                var tmp = "";
                if(i == 0){
                    tmp = (this.data("chartOffsetY") + this.chartHeight - this.LINE_CHART_OFFSET - box.height + this.tipsHeight) + "px";
                } else {
                    tmp = (this.data("chartOffsetY") + this.chartHeight - this.LINE_CHART_OFFSET - i * valueUnit - box.height * 0.5 + this.tipsHeight) + "px;";
                }
                $span.css({"left":(this.data("chartOffsetX") - box.width - 10) + "px", "top":tmp});
                this.vlabs.push($span);
            }
            if((i - ystep) != (iLen - 1)){
                $span = $("<span class='value-label'>"+this.values[iLen - 1]+"</span>");
                this.root().append($span);
                box = $span[0].getBoundingClientRect();
                var tmp = (this.data("chartOffsetY") + this.tipsHeight + this.LINE_CHART_OFFSET - box.height * 0.5) + "px";
                $span.css({"left":(this.data("chartOffsetX") - box.width - 10) + "px", "top":tmp});
                this.vlabs.push($span);
            }
        },

        _drawGrids:function(){
            var canvas = this.canvas[0];
            var context2d = canvas.getContext("2d");
            context2d.clearRect(0, 0, canvas.width, canvas.height);

            var x1 = this.LINE_CHART_OFFSET;
            var y1 = this.LINE_CHART_OFFSET;
            var y2 = this.chartHeight - this.LINE_CHART_OFFSET;
            var x2 = this.chartWidth - this.LINE_CHART_OFFSET;
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
            var i = 1, iLen = this.categorys.length - 1, dest = 0.0;
            var categoryUnit = (this.chartWidth - 2 * this.LINE_CHART_OFFSET) / (this.categorys.length - 1); // x轴画线需要间隔的距离
            for(xstep = this.data("gridXStep"), i = xstep; i < iLen; i+= xstep){
                dest = this.LINE_CHART_OFFSET + i * categoryUnit;
                drawLines(context2d, [{x:dest, y:this.LINE_CHART_OFFSET}, {x:dest, y:this.chartHeight - this.LINE_CHART_OFFSET}]);
            }
            if(this.data("showLastSplitLineX")){
                dest = this.chartWidth - this.LINE_CHART_OFFSET;
                drawLines(context2d, [{x:dest, y:this.LINE_CHART_OFFSET}, {x:dest, y:this.chartHeight - this.LINE_CHART_OFFSET}]);
            }

            var valueUnit = (this.chartHeight - 2 * this.LINE_CHART_OFFSET) / (this.values.length - 1);  // y轴画线需要间隔的距离
            for(ystep = this.data("gridYStep"), i = ystep, iLen = this.values.length - 1; i < iLen; i+=ystep){
                dest = this.chartHeight - this.LINE_CHART_OFFSET - i * valueUnit;
                drawLines(context2d, [{x:this.LINE_CHART_OFFSET, y:dest}, {x:this.chartWidth - this.LINE_CHART_OFFSET, y:dest}]);
            }
            if(this.data("showLastSplitLineY")){
                dest = this.LINE_CHART_OFFSET;
                drawLines(context2d, [{x:this.LINE_CHART_OFFSET, y:dest}, {x:this.chartWidth - this.LINE_CHART_OFFSET, y:dest}]);
            }

            context2d.stroke();
        },

        _drawData:function(){
            var line,
                context2d = this.canvas[0].getContext("2d"),
                width = this.chartWidth - 2 * this.LINE_CHART_OFFSET,
                height = this.chartHeight - 2 * this.LINE_CHART_OFFSET;

            while(this.newLines.length){
                this.lines.push(this.newLines.shift().draw(context2d, width, height, this.maxVal, this.minVal, this.LINE_CHART_OFFSET));
            }
        },

        /**
         * 真正完成添加线对象的方法。
         * @private
         */
        _addData:function(obj){
            line = new Line(obj);
            this.newLines.push(line);

            if(!this.tipsContainer.children().length){
                var $tmp = $("<div style='width:" + this.data("chartOffsetX") +"px;height:25px;margin-right:5px;float:left;'></div>");
                //$tmp.css("width","60");
                this.tipsContainer.append($tmp);
            }

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
            var line, pt, matched = false;
            for(var i = 0, iLen = me.lines.length; i < iLen; i++){
                line = me.lines[i];
                for(var j = 0, jLen = line.pts.length; j < jLen; j++){
                    pt = line.pts[j];
                    if((Math.abs(xpos - pt.x) + Math.abs(ypos - pt.y)) < me.COLLISION_OFFSET){
                        matched = true;
                        me.tips[i].text(pt.data);
                        me.trigger("baidu_chart_data_selected", [{data:pt.data, name:line.name}]);
                        break;
                    }
                }
                if(matched){
                    break;
                }
            }

            if(!me.data("enableDrag")){
                return;
            }
            isDown = true;

            setTimeout(function(){
                if(isDown){
                    if(me.data("showTouchLine") && matched){
                        me._showTouchIndicator(pt.x);
                    }
                    me.on("touchmove", me._touchMoveEvent);
                }
            }, me.data("touchTimeout"));
        },

        _touchEndEvent:function(event){
            me.off("touchmove", me._touchMoveEvent);
            //
            if(me.data("showTouchLine")){
                me._hideTouchIndicator();
            }
            isDown = false;
        },

        _touchMoveEvent:function(event){
            var touch = event.targetTouches[0];
            var clientX = touch.pageX - (me.containerLeft + me.data("chartOffsetX"));
            var line, pt, eventArr = [];
            for(var i = 0, iLen = me.lines.length; i < iLen; i++){
                line = me.lines[i];
                for(var j = 0, jLen = line.pts.length; j < jLen; j++){
                    pt = line.pts[j];
                    if(Math.abs(clientX - pt.x) < 6){
                        matched = true;
                        me.tips[i].text(pt.data);
                        eventArr.push({data:pt.data, name:line.name});
                        if (me.data("showTouchLine")) {
                            me._moveTouchIndicator(pt.x);
                        }
                    }
                }
            }
            eventArr.length && me.trigger("baidu_chart_data_selected", eventArr);

            event.preventDefault();
        },

        _showTouchIndicator:function(x){
            if(!me.$touchLine){
                me.$touchLine = $("<div class='touch-line'></div>");
                me.$touchLine.css("height", me.chartHeight - 2 * me.LINE_CHART_OFFSET);
                me.$touchLine.css("top", $('#linechart canvas')[0].offsetTop + me.LINE_CHART_OFFSET);
            }

            me.$touchLine.css("left",x + this.data("chartOffsetX"));
            me.root().append(me.$touchLine);
        },

        _moveTouchIndicator:function(x){
            if(!me.$touchLine){
                me.$touchLine = $("<div class='touch-line'></div>");
                me.$touchLine.css("height", me.chartHeight - 2 * me.LINE_CHART_OFFSET);
                me.$touchLine.css("top", $('#linechart canvas')[0].offsetTop + me.LINE_CHART_OFFSET);
            }
            if(!me.$touchLine.parent() || !me.$touchLine.parent().length){
                me.root().append(me.$touchLine);
            }

            me.$touchLine.css("left",x + me.data("chartOffsetX"));
        },

        _hideTouchIndicator:function(){
            me.$touchLine && me.$touchLine.parent() && me.$touchLine.remove();
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
         * $('#linechart').LineChart('setCategoryGrid', ["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.setCategoryGrid(["09pm","10pm","11pm","12pm","01am","02am","03am","04am","05am","06am","07am","08am"]);
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
         * $('#linechart').LineChart('setValueGrid', [0, 20, 40, 60, 80, 100]);
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.setValueGrid([0, 20, 40, 60, 80, 100]);
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
         * $('#linechart').LineChart('setWidth', 800);
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.setWidth(800);
         */
        setWidth:function(value){
            this.chartWidth = value;
            this._data.width = value;

            this._do_init();
            var tmpLines = this.lines.splice(0, this.lines.length);
            var tmpObjs, obj;
            for(var i = 0, iLen = tmpLines.length; i < iLen; i++){
                tmpObjs = tmpObjs || [];
                obj = {type:tmpLines[i].type, name:tmpLines[i].name, data:tmpLines[i].data.concat(), color:tmpLines[i].color};
                tmpObjs.push(obj);
            }
            //tmpObjs.length && this.setData(tmpObjs);
            this.setData(tmpObjs);
            return this;
        },

        /**
         * @name    setHeight
         * @desc    设置图表高度
         * @param   {Number} 设置图表高度
         * @grammar setHeight(240) => instance
         * @example
         * //setup mode
         * $('#linechart').LineChart('setHeight', 240);
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.setHeight(240);
         */
        setHeight:function(value){
            this.chartHeight = value;
            this._data.height = value;

            this._do_init();
            var tmpLines = this.lines.splice(0, this.lines.length);
            var tmpObjs, obj;
            for(var i = 0, iLen = tmpLines.length; i < iLen; i++){
                tmpObjs = tmpObjs || [];
                obj = {type:tmpLines[i].type, name:tmpLines[i].name, data:tmpLines[i].data.concat(), color:tmpLines[i].color};
                tmpObjs.push(obj);
            }
            //tmpObjs.length && this.setData(tmpObjs);
            this.setData(tmpObjs);
            return this;
        },

        /**
         * @name    clear
         * @desc    清除绘制的数据
         * @grammar clear() => instance
         * @example
         * //setup mode
         * $('#linechart').LineChart('clear');
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.clear();
         */
        clear:function(){
            this.lines.splice(0, this.lines.length);
            this.newLines.splice(0, this.newLines.length);
            this.tips = [];
            this.icons = [];

            this.tipsContainer[0].innerHTML = "";
            this._do_init();
            this._drawChart();

            $.ui.Chart.prototype.clear.apply(this);
            return this;
        },

        /**
         * @name setData
         * @desc 设置数据对象。
         * @param  {Array} Object数组。数组中每一个元素的格式为{type:..., name:..., data:..., color:...}
         * @grammar setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"}]) => instance
         * @example
         * //setup mode
         * $('#linechart').LineChart('setData', [{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"}]);
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.setData([{type:"diamond", name:"graph1", data:[100,10,20,30,20,50,60,40,50,40,50,40], color:"#0000ff"}]);
         */
        setData:function(arr){
            if(!arr){
                $.ui.Chart.prototype.setData.apply(this, [arr]);
                return;
            }
            this.lines.splice(0, this.lines.length);
            this.newLines.splice(0, this.newLines.length);
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
         * @desc 增加数据对象
         * @param  {Object} 线数据对象，对象的格式为{type:..., name:..., data:..., color:...}
         * @grammar addData({"type":"baidu.dv.line.LineGraph", "name":"graph5", "data":[80,50,40,80,20,50,70,20,60,20,80,70], color:"#ff00ff"}) => instance
         * @example
         * //setup mode
         * $('#linechart').LineChart('addData', {"type":"baidu.dv.line.LineGraph", "name":"graph5", "data":[80,50,40,80,20,50,70,20,60,20,80,70], color:"#ff00ff"});
         *
         * //render mode
         * var linechart = $.ui.LineChart();
         * linechart.addData({"type":"baidu.dv.line.LineGraph", "name":"graph5", "data":[80,50,40,80,20,50,70,20,60,20,80,70], color:"#ff00ff"});
         */
        addData:function(obj){
            this._addData(obj);
            $.ui.Chart.prototype.addData.apply(this, [obj]);
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

    // 内部类Line
    function Line(obj){
        this.name = obj.name;
        this.data = obj.data;
        this.color = obj.color;
        this.type = obj.type;
        this.pts = [];
    }

    Line.prototype.draw = function(context2d, chartWidth, chartHeight, maxVal, minVal, LINE_CHART_OFFSET){
        // 画线
        context2d.strokeStyle = this.color;
        context2d.lineWidth = 2;
        context2d.beginPath();

        var tmpy = 0.0, ratio = chartHeight / (maxVal - minVal), categoryUnit = chartWidth / (this.data.length - 1);
        var tmpArr = [];
        for(var i = 0, iLen = this.data.length; i < iLen; i++){
            tmpy = LINE_CHART_OFFSET + chartHeight - (this.data[i] - me.minVal) * ratio;
            //if(i == 0){
            //  context2d.moveTo(i * categoryUnit + LINE_CHART_OFFSET, tmpy);
            //} else {
            //  context2d.lineTo(i * categoryUnit + LINE_CHART_OFFSET, tmpy);
            //}
            tmpArr.push({x:i * categoryUnit + LINE_CHART_OFFSET, y:tmpy});
            this.pts.push({x:i * categoryUnit + LINE_CHART_OFFSET, y:tmpy, data:this.data[i]});
        }
        drawLines(context2d, tmpArr);
        context2d.stroke();

        var pt;
        if(this.type == "circle"){
            // 画点
            for(i = 0, iLen = this.pts.length; i < iLen; i++){
                pt = this.pts[i];
                context2d.beginPath();
                context2d.fillStyle = "#ffffff";
                context2d.strokeStyle = this.color;
                context2d.arc(pt.x, pt.y, 3, 0, 2 * Math.PI, true);
                context2d.stroke();
                context2d.fill();
            }
        } else if(this.type == "diamond"){
            // 画点
            for(i = 0, iLen = this.pts.length; i < iLen; i++){
                pt = this.pts[i];
                context2d.beginPath();
                context2d.fillStyle = "#ffffff";
                context2d.strokeStyle = this.color;
                context2d.moveTo(pt.x - 3, pt.y);
                context2d.lineTo(pt.x, pt.y - 3);
                context2d.lineTo(pt.x + 3, pt.y);
                context2d.lineTo(pt.x, pt.y + 3);
                context2d.lineTo(pt.x - 3, pt.y);
                context2d.stroke();
                context2d.fill();
            }
        } else if(this.type == "rect"){
            // 画点
            for(i = 0, iLen = this.pts.length; i < iLen; i++){
                pt = this.pts[i];
                context2d.beginPath();
                context2d.fillStyle = "#ffffff";
                context2d.strokeStyle = this.color;
                context2d.moveTo(pt.x - 3, pt.y - 3);
                context2d.lineTo(pt.x - 3, pt.y + 3);
                context2d.lineTo(pt.x + 3, pt.y + 3);
                context2d.lineTo(pt.x + 3, pt.y - 3);
                context2d.lineTo(pt.x - 3, pt.y - 3);
                context2d.stroke();
                context2d.fill();
            }
        }
        return this;
    }
})();
