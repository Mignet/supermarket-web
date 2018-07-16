var $           = require("zepto");
var comm      = require("modules/common/common");
var Service     = require('modules/common/service');
var accountApi  = require('modules/api/accountApi');


var protocol = {

    init:function(){
        var self = this;
        this.queryString = comm.getQueryString();
        // 定义app调用函数，暂未使用
        window.getAppToken = function(token,source){
            self.getData(token);
        }
        if( userInfo.getToken() ){  // 微信已登录
            self.getData(userInfo.getToken());
        }
    },

    getData:function(token){
        var self = this;
        var protocolServer =  new Service();
        protocolServer.needAddToken = false;
        protocolServer.isShowLoading = false;
        protocolServer.isShowErrorMsg = false;
        protocolServer.data = {
            'method' : accountApi.protocal,
            'token'  : token
        }
        if(this.queryString.productId)
        protocolServer.data['productId'] = this.queryString.productId;   

        if(this.queryString.investId){
            protocolServer.data['investId'] = this.queryString.investId; 
            $(".startInterestDate").text('2016-06-10');                
            $(".endInterestDate").text('2016-07-09');                
        }

        protocolServer.success = function(result){
           self.fillData(result);
        }
        protocolServer.send();
    },

    fillData : function(result){
        $(".userNname").text(result.customerName);
        $(".userIdcard").text(result.customerCard);        
        $(".userMobile").text(result.customerMobile);

        $.each(result.ratelist,function(index,obj){
            $("#rateToby").append('<tr><td>'+obj.deadLine+'</td><td>'+obj.rate +'</td></tr>');
        });

        $(".span-day-num").text(result.deadLine);    

        $(".yearRate").text(result.yearRate);

        if(result.signDate && result.deadLine){
            var s = new Date(result.signDate).getTime() + result.deadLine*24*60*60*1000;
            var d = new Date(s);
            $(".endDate").text((d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()));
        }

        var now = new Date();
        $('.today').text(result.signDate || (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()));  


        if(this.queryString.investId){
            $(".yiBigUpper").text(result.transferAmountCN);
            $(".yiSmallLower").text(result.transferAmount);

            $(".jiaBigUpper").text(result.transfereeAmountCN);
            $(".jiaSmallLower").text(result.transfereeAmount);
        }  
    }



};

protocol.init();

