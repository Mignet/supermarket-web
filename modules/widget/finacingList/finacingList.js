/**
 * @require finacingList/style.css
 */

var $ = require("zepto");
var CountDown = require('modules/widget/saleCountdown/saleCountdown');
var ScrollList = require('modules/common/scrollList');

// 初始化
function finacingList(options){
    for( key in options ){
        this[key] = options[key];
    }
    this.init();
};

//HTML模板
finacingList.template =
    '<li>'
    +'    <a href="/pages/financing/product_detail.html?productId={{productId}}&productName={{productName}}">'
    +'        <div class="title clearfix">'
    +'            <div class="orgName ellipsis">'
    +'                <span class={{orgNameClass}}>{{orgName}} -</span>{{productName}}'
    +'            </div>'
    +'            <div class="characterBox">{{tagListRightNewerText}}</div>'
    +'        </div>'
    +'    </a>'
    +'    <a class="content" href="/pages/financing/product_detail.html?productId={{productId}}&productName={{productName}}">'
    +'        <div>'
    +'            <p>年化收益</p>'
    +'            <p class="year-rate">{{yearRate}}'
    +                '<span>%</span></p>'
    +'        </div>'
    +'        <div>'
    +'            <p>产品期限</p>'
    +'            <p>{{deadLineText}}</p>'
    +'        </div>'
    +'        <div class="circle">'
    +'            <span style="display:none">倒计时</span>'
    +'            <span class="circle-text">购买</span></div>'
    +'    </a>'
    +'    <div class="progress-bar {{isHaveProgressClass}}">'
    +'        <div class="progress">'
    +'            <p class="percent" style="width:{{percentage}}"></p>'
    +'        </div>'
    +'        <div class="progress-num">已售{{percentage}}</div>'
    +'    </div>'
    +'    <div class="sub-title {{redemptionClass}}">'
    +'        <p><img class="{{isShowRedpacket}}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAzCAMAAAA0GHFDAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEjUExURQAAAP1TU/1TU/////1TU/1TU/1TU/1TU/1TU/1TU/1TU/1dXf1UVP/z8/1WVv61tf1XV//29v66uv/8/P/v7/6Skv/6+v/r6/1tbf/09P/m5v/l5f/+/v6vr/1eXv/k5P1nZ/10dP/f3/1VVf1hYf6Wlv6QkP60tP/w8P6Tk/1bW/1YWP/9/f7Ly/1cXP6qqv/39/1iYv11df/Z2f64uP7AwP/q6v/b2/6urv6Ojv7Jyf/y8v7IyP/a2v17e/7Kyv7Q0P6+vv1fX/1zc/6UlP/19f1mZv6trf1aWv6wsP6Hh/7Nzf6Pj/6pqf/i4v/p6f6MjP1ZWf6bm/6Fhf7Bwf7Gxv1vb//u7v6AgP13d/1lZf7ExP/j4/6YmP6zs/6IiP6JiSIxhNYAAAAKdFJOUwBMTv/z8vS+TYQtEz6FAAABU0lEQVRIx+WW527CMBSFTRkJJ04gbMKeZdO9W7r33rt9/6doEKqYwU5F1UqcP76yPln3Hq9LCBEFG5iyCRbSlBOccuqwBW6XbGVKdrkhEiJg0sqlGARC7JD5aBl2QgArp4Cf0Z68aoxN+T1ddHgbzy9GcCOJuNy1duQJeHwdxF4cA6lET96V9xKUYqSXDV6XcXXg7a/y4U0BvbkLtNHKyaUb9DQ42BMtVwbiy3OzPq+3sOjJZwHFf27sYOFop/NkhM6CDL8X5nMz04qSTRW3tNHszpjRm752rN5Gh9PrmWT6O46E4BpOr26gtNIKqzXca4xMAn7QmD5G6xQfKrvKJYrdgPoJWo/yeLJ2iAxFrcrpYHpfP34Jbr99wJ6J3TGY7KOlztsgjZY2l8lv0uNR5X+jJekPXh8Tf7HN7D8v6j1EmM2GWz2Euf6EkAnBwUYdQnPlL7NGPSNrPFvcAAAAAElFTkSuQmCC" alt="红包" >{{redemptionText}}</p>'
    +'    </div>'
    +'</li>';

finacingList.prototype = {
    //构造函数
    constructor: finacingList,

    //dom对象
    ele : '',

    //ajax请求链接
    api : '',

    //请求参数（JSON数组）
    data: null,

    //是否需要登录
    isNeedToken: false,

    //拦截器
    dataFilter: function() {},

    //回调
    callback: function() {},

    init: function() {
        var self = this;
        new ScrollList({
            ele : this.ele,
            api : this.api,
            data: this.data,
            isNeedToken: this.isNeedToken,
            dataFilter:function(arr){
                arr = self.dataFilter(arr);
                arr.forEach(function(obj,index){
                    if(obj.isFlow == "1"){
                        obj.yearRate = obj.flowMinRate.toFixed(2)
                    }else{
                        obj.yearRate = obj.flowMinRate.toFixed(2) + '~' + obj.flowMaxRate.toFixed(2);
                    }
                    //产品期限
                    var arr = obj.deadLineValueText.split(',');
                    //固定期限
                    if(arr.length == 2){
                        obj.deadLineText = arr[0] + '<span class="unit">'+arr[1]+'</span>';
                    }
                    //浮动期限
                    if(arr.length == 4){
                        obj.deadLineText = arr[0] + '<span class="unit">'+arr[1]+'</span> ~'+ arr[2] +'<span class="unit">'+arr[3]+'</span>';
                    }

                    //产品标签
                    obj.redemptionText= "";
                    obj.tagList.forEach(function(data,index){
                        if(index<3){
                            obj.redemptionText += "<span class='character' style='display: inline'>"+data +"</span>";
                            obj.redemptionClass = 'block';
                        }
                    })

                    //是否显示红包
                    obj.isShowRedpacket = 'hidden';
                    if( obj.hasRedPacket == true ) {
                        obj.isShowRedpacket = 'inline-block';
                    }

                    //是否显示标签栏
                    if(obj.redemptionText == "" && obj.isShowRedpacket == 'hidden'){
                        obj.redemptionClass = 'hidden';
                    }

                    //是否显示产品进度
                    if(obj.isHaveProgress == "0"){
                        obj.isHaveProgressClass  = 'block';
                        if(obj.buyTotalMoney - obj.buyedTotalMoney < 0 ){
                            obj.percentage = 100 + '%';
                        }else{
                            obj.buyedTotalMoney = obj.buyedTotalMoney || 0;
                            obj.buyTotalMoney   = obj.buyTotalMoney || 1;
                            obj.percentage      = parseInt(obj.buyedTotalMoney/obj.buyTotalMoney * 100) + "%";
                        }
                    }else{
                        obj.isHaveProgressClass  = '';
                        obj.percentage      = '';
                    }

                    //产品标签
                    if( obj.tagList.length > 0 ) {
                        obj.tagListText = obj.tagList.map(function(item, index){
                            if(index<2){
                                return '<span class="character" style="display: inline">' + item + '</span>';
                            }
                        }).join('\n');
                    }else{
                        obj.tagListText = "";
                    }

                    // 新手标标签
                    //obj.tagListRightNewer = ['新手专享'];
                    if(obj.tagListRightNewer.length > 0){
                        obj.tagListRightNewerText = obj.tagListRightNewer.map(function(item,index){
                            if(index<2){
                                return '<span class="tag">' + item + '</span>';
                            }
                        }).join('\n');
                    }else{
                        obj.tagListRightNewerText = "";
                    }


                });

                return arr;
            },
            callback: function (data, result) {
                self.callback(data, result);
                //遍历每一项列表
                result.datas.forEach(function (obj, index) {
                    //发售时间大于当前时间
                    if (obj.saleStartTime.length > 0 && Date.now() < new Date(obj.saleStartTime.replace(/-/g, '/')).getTime()) {
                        var $circle = $('#productList .circle').eq(index + ((result.pageIndex - 1) * result.pageSize));
                        $circle.addClass('circle-white');
                        var $text = $('#productList .circle-text').eq(index + ((result.pageIndex - 1) * result.pageSize));
                        new CountDown({
                            ele: $text,
                            saleTimeStr: obj.saleStartTime,
                            nowTimeStr: obj.timeNow,
                            callback: function () {
                                $circle.removeClass('circle-white');
                                $text.text('购买');
                            },
                            isProduceList: true
                        });
                    }
                });
            }
        });
    }
}



module.exports = finacingList;