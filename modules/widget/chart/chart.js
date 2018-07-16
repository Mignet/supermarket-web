/**
 * @require style.css
 */
var $ = require("zepto");
/**
* ele : [容器]
* data_arr :[比例数组]
* this.color_arr : [颜色数组]
**/
function chart(options){
    for(key in options){
        this[key] = options[key];
    }
    this.init();
}

chart.template = '<canvas id="myCanvas"></canvas><canvas id="maskCanvas" class="mask-canvas"></canvas>';

chart.prototype.init = function(){
    this.ele.html(chart.template);
    this.drawChart();
};

chart.prototype.drawChart = function(){
    this.clientWidth = this.ele.width();//宽度/直径
    this.radius = this.clientWidth/2;//半径
    $("#myCanvas").add("#maskCanvas").attr({"width":this.clientWidth+'px',"height":this.clientWidth+"px"})
    this.clientWidth = this.clientWidth;
    var ctx = document.querySelector('#myCanvas').getContext('2d');
    var startAngle = -Math.PI/2;
    var endAngle = -Math.PI/2;
    for(var i= 0;i<this.data_arr.length;i++){
        ctx.beginPath();
        if(i == this.data_arr.length-1){
            endAngle = Math.PI*3/2
        }else{
            endAngle = endAngle + this.data_arr[i]*2*Math.PI;
        }
        ctx.arc(this.radius,this.radius,this.radius*3/4,startAngle,endAngle,false);
        ctx.lineWidth = this.radius/2;
        ctx.strokeStyle = this.color_arr[i];
        ctx.stroke();
        ctx.closePath();
        startAngle = endAngle;
    }
    for(var j= 0;j<this.data_arr.length;j++){
        if(this.data_arr[j] != 0){
            break;
        }else{
            ctx.clearRect(0,0,this.clientWidth,this.clientWidth);
            ctx.beginPath();
            ctx.arc(this.radius,this.radius,this.radius*3/4,-Math.PI/2,3/2*Math.PI,false);
            ctx.lineWidth = this.radius/2;
            ctx.strokeStyle = "#dcdcdc";
            ctx.stroke();
            ctx.closePath();
        }
    }
    // this.drawMask();
};

chart.prototype.drawMask = function(){
    var self = this;
    var oCanvas = document.querySelector('#maskCanvas').getContext('2d');
    var step = 0;
    self.moveCircle(oCanvas,-Math.PI/2);
    var timer = setInterval(function(){
        step ++;
        self.moveCircle(oCanvas,-Math.PI/2 + step/100*2*Math.PI);
        if(step >= 100){
            clearInterval(timer);
            oCanvas.clearRect(0,0,self.clientWidth,self.clientWidth);
        }
    },4)
};

chart.prototype.moveCircle =function(canvasObj,bAngle){
    canvasObj.clearRect(0,0,this.clientWidth,this.clientWidth);
    canvasObj.beginPath();
    canvasObj.moveTo(this.radius, this.radius); 
    canvasObj.arc(this.radius,this.radius,this.radius+10,bAngle,3*Math.PI/2,false);
    canvasObj.fillStyle="#fff";
    canvasObj.fill();
    canvasObj.closePath();
};



module.exports = chart;
