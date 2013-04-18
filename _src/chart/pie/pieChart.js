/**
 * @file
 * @name BarChart
 * @desc 柱状图
 * @import core/zepto.js, core/zepto.extend.js, core/zepto.ui.js, chart/base/Chart.js
 */
(function(){
    /**
     * @name    $.ui.PieChart
     * @grammar $.ui.PieChart(el, options) ⇒ instance
     * @grammar $.ui.PieChart(options) ⇒ instance
     * @grammar PieChart(options) ⇒ self
     * @desc **el** 
     * css选择器, 或者zepto对象
     * 
     * 根元素选择器或者对象
     * **Options**
     * - ''width''              {Number|Percent}: (可选)图表区域的宽度，可以使像素值或者百分比。若不设置，则为父容器宽度。
     * - ''height''             {Number|Percent}: (可选)图表区域的高度，可以使像素值或者百分比。若不设置，则为父容器高度。
     * - ''backgroundColor''    {Number}: (可选)cssbackgroundColor属性。
     * - ''outterRadius''       {Number|Percent}: (可选)饼图的外半径。
     * - ''innerRadius''        {Number|Percent}: (可选)饼图的内半径。
     * 
     * **Demo**
     * <codepreview href="">
     * </codepreview>
     */
    $.ui.define("PieChart", {
        chartWidth:0,          // 图表宽
        chartHeight:0,         // 图表高
        tipsHeight:0,          // 标注高
        
        inherit:$.ui.Chart,
        
        pies:[],
        icons:[],
        tips:[],
        
        _data:{
            width:360,
            height:360,
            backgroundColor:"rgba(0, 0, 0, 0)",
            innerRadius:"15%",
            outterRadius:"40%"
        },
        
         _create:function(){
            this.tipsContainer = $("<div class='tips-container'></div>");
            this.root().append(this.tipsContainer);
            this.canvas = $("<canvas class='chart-canvas'></canvas>");
            this.root().append(this.canvas);
        },
        
        _setup:function(){
            this.tipsContainer = $("#piechart .tips-container");
            this.canvas = $("#piechart canvas");
        },
        
        _init:function(){
            me = this;
            $.ui.Chart.prototype._init.call(this);
        },
        
        _do_init:function(){
            var rect = this.root()[0].getBoundingClientRect();
            //var reg = new RegExp("([0-9]+)%$", "gi");
            
            if(/([0-9]+)%$/gi.test(this.data("width"))){
                this.chartWidth = (rect.right - rect.left) * RegExp.$1 * 0.01;
            }
            this.chartWidth = this.chartWidth ? this.chartWidth : parseFloat(this.data("width")) || (rect.right - rect.left);
            
            //reg = new RegExp("([0-9]+)%$", "gi");
            if(/([0-9]+)%$/gi.test(this.data("height"))){
                this.chartHeight = (rect.bottom - rect.top) * RegExp.$1 * 0.01;
            }
            this.chartHeight = this.chartHeight ? this.chartHeight : parseFloat(this.data("height")) || (rect.bottom - rect.top);
                
            rect = this.tipsContainer[0].getBoundingClientRect();
            this.tipsHeight = rect.bottom - rect.top;  
            
            this.canvas.attr({"width":this.chartWidth + "px", "height":this.chartHeight + "px"});
            this.canvas.css({"left":"0px", "top":(0 + this.tipsHeight)+"px", "background-color":this.data("backgroundColor")});
            
            var min = Math.min(this.chartWidth, this.chartHeight);
            if(/([0-9]+)%$/gi.test(this.data("innerRadius"))){
                this.innerRadius = min * RegExp.$1 * 0.01;
            }
            this.innerRadius = this.innerRadius ? this.innerRadius : parseFloat(this.data("innerRadius"));
            
            if(/([0-9]+)%$/gi.test(this.data("outterRadius"))){
                this.outterRadius = min * RegExp.$1 * 0.01;
            } 
            this.outterRadius = this.outterRadius ? this.outterRadius : parseFloat(this.data("outterRadius"));
            
            this.canvas.on("touchstart", this._touchStartEvent); // 因为tap没法拿到点击坐标，所以用touchstart来代替tap
        },
        
        _drawChart:function(){
           var canvas = this.canvas[0];
           var context2d = canvas.getContext("2d");
           context2d.clearRect(0, 0, canvas.width, canvas.height);
        },
        
        _drawData:function(){
            var i = 0, iLen = 0, 
                total = 0, 
                centerX = this.chartWidth * 0.5,
                centerY = this.chartHeight * 0.5,
                startRadian = -Math.PI/2, 
                context2d = this.canvas[0].getContext("2d"), 
                pie;
            
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                total += this.pies[i].data;
            }
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                this.pies[i].percent = this.pies[i].data / total;
            }
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                pie = this.pies[i];
                
                context2d.fillStyle = pie.color;
                context2d.beginPath();
                context2d.moveTo(centerX + this.innerRadius * Math.cos(startRadian), centerY + this.innerRadius * Math.sin(startRadian));
                context2d.lineTo(centerX + this.outterRadius * Math.cos(startRadian), centerY + this.outterRadius * Math.sin(startRadian));
                context2d.arc(centerX, centerY, this.outterRadius, startRadian, startRadian + pie.percent * Math.PI * 2, false);
                context2d.lineTo(centerX + this.outterRadius * Math.cos(startRadian + pie.percent * Math.PI * 2), centerY + this.outterRadius * Math.sin(startRadian + pie.percent * Math.PI * 2));
                context2d.arc(centerX, centerY, this.innerRadius, startRadian + pie.percent * Math.PI * 2, startRadian, true);
                context2d.closePath();
                context2d.fill();
                
                pie.startRadian = ((startRadian * 180 / Math.PI + 90) + 360) % 360 * Math.PI / 180;
                pie.endRadian = (((startRadian + pie.percent * Math.PI * 2) * 180 / Math.PI + 90) + 360) % 360 * Math.PI / 180;
                if(pie.endRadian == 0){
                   pie.endRadian = Math.PI * 2; 
                }
                startRadian += pie.percent * Math.PI * 2;
            }
        },
        
         _addData:function(obj){
             // if(!this.tipsContainer.children().length){
                // var $tmp = $("<div style='width:" + this.data("chartOffsetX") +"px;height:25px;margin-right:5px;float:left;'></div>");
                // this.tipsContainer.append($tmp);
             // }
             
             this._addTip(obj);
             this.pies.push(new Pie(obj));
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
            var xpos = touch.pageX - (me.containerLeft);
            var ypos = touch.pageY - (me.containerTop + me.tipsHeight);
            var centerX = me.chartWidth * 0.5;
            var centerY = me.chartHeight * 0.5;
            var distance = Math.sqrt((xpos - centerX) * (xpos - centerX) + (ypos - centerY) * (ypos - centerY));
            var degree = 0, i = 0, iLen = 0, pie;
            if(distance >= me.innerRadius && distance <= me.outterRadius){
                degree = Math.atan2(ypos - centerY, xpos - centerX) * 180 / Math.PI;
                degree = ((90 + degree) + 360) % 360 * Math.PI / 180;
                for(i = 0, iLen = me.pies.length; i < iLen; i++){
                    pie = me.pies[i]
                    console.log(degree, pie.startRadian, pie.endRadian);
                    if(degree >= pie.startRadian && degree <= pie.endRadian){
                        me.tips[i].text(pie.data);
                        me.trigger("baidu_chart_data_selected", [{data:pie.data, name:pie.name}]);
                        break;
                    }
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
         * @name    setWidth
         * @desc    设置图表宽度
         * @param   {Number} 设置图表宽度
         * @grammar setWidth(800) => instance
         * @example
         * //setup mode
         * $('#piechart').PieChart('setWidth', 800);
         *
         * //render mode
         * var piechart = $.ui.PieChart();
         * piechart.setWidth(800);
         */       
        setWidth:function(value){
            this.chartWidth = value;
            this._data.width = value;
            
            this._do_init();
            
            var i = 0, iLen = 0, newarr = [], pie;
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                pie = this.pies[i];
                newarr.push({"name":pie.name, "color":pie.color, "data":pie.data});
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
         * $('#piechart').PieChart('setHeight', 240);
         *
         * //render mode
         * var piechart = $.ui.PieChart();
         * piechart.setHeight(240);
         */
        setHeight:function(value){
            this.chartHeight = value;
            this._data.height = value;
            
            this._do_init();
            
            var i = 0, iLen = 0, newarr = [], pie;
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                pie = this.pies[i];
                newarr.push({"name":pie.name, "color":pie.color, "data":pie.data});
            }
            this.setData(newarr);
            return this;
        },
        
        /**
         * @name setData
         * @desc 设置数据对象。
         * @param  {Array} Object数组。数组中每一个元素是一个Object。Object格式为{type:..., name:..., data:..., color:...}
         * @grammar pieChart.setData([{name:"数据1", color:"#69cceb", data:37}, 
                {name:"数据2", color:"#ffdd7b", data:54},
                {name:"数据3", color:"#fa99bc", data:24},
                {name:"数据4", color:"#84bd92", data:52},
                {name:"数据5", color:"#f45e5d", data:20}]) => instance
         * @example
         * //setup mode
         * $('#piechart').PieChart('setData', [ {name:"数据1", color:"#69cceb", data:37}, {name:"数据2", color:"#ffdd7b", data:54}, {name:"数据3", color:"#fa99bc", data:24}, {name:"数据4", color:"#84bd92", data:52}, {name:"数据5", color:"#f45e5d", data:20} ]);
         *
         * //render mode
         * var piechart = $.ui.PieChart();
         * piechart.setData([ {name:"数据1", color:"#69cceb", data:37}, {name:"数据2", color:"#ffdd7b", data:54}, {name:"数据3", color:"#fa99bc", data:24}, {name:"数据4", color:"#84bd92", data:52}, {name:"数据5", color:"#f45e5d", data:20} ]);
         */
        setData:function(arr){
            this.pies.splice(0, this.pies.length);
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
         * @param  {Object} 参数是Object。格式为{name:..., color:..., data:...}
         * @grammar addData({name:"数据2", color:"#ffdd7b", data:54}) => instance
         * @example
         * //setup mode
         * $('#piechart').PieChart('addData', [{name:"数据2", color:"#ffdd7b", data:54}]);
         *
         * //render mode
         * var piechart = $.ui.PieChart();
         * piechart.addData([{name:"数据2", color:"#ffdd7b", data:54}]);
         */
        addData:function(obj){
            var i = 0, iLen = 0, newarr = [], pie;
            for(i = 0, iLen = this.pies.length; i < iLen; i++){
                pie = this.pies[i];
                newarr.push({"name":pie.name, "color":pie.color, "data":pie.data});
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
         * $('#piechart').PieChart('clear');
         *
         * //render mode
         * var piechart = $.ui.PieChart();
         * piechart.clear();
         */
        clear:function(){
            this.pies.splice(0, this.pies.length);
            this.tips = [];
            this.icons = [];

            this.tipsContainer[0].innerHTML = "";
            this._do_init();

            $.ui.Chart.prototype.clear.apply(this);
            return this;
        }
    });
    
    function Pie(obj){
        this.name = obj.name;
        this.color = obj. color;
        this.data = obj.data;
        this.percent = 0;
        this.startRadian = 0;
        this.endRadian = 0;
    }
})();
