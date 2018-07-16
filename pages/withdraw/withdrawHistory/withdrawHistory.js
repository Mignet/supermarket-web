/**
 * @require style.css  
 */
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var mineApi 	= require('modules/api/mineApi');
var ScrollList = require("modules/common/scrollList");
var Service 	= require('modules/common/service');

var bankCardSucc = {

	init: function () { 
		this.getWithdrawSummary();
        this.getWithDrawHistory();
	},

	//累计提现
	getWithdrawSummary: function(){
		var _this = this;
		var serverSum = new Service();
        serverSum.api = mineApi.withdrawSummary;
        serverSum.isNeedToken = true;
        serverSum.isShowLoading = false;
        serverSum.success=function(data){
            $("#withDrawTotal").text(data.outTotalAmount);
        }
        serverSum.send();
	},
    
    //提现记录
	getWithDrawHistory : function(){
		var self = this;
		var withdrawLogScroll = new ScrollList({
			ele: $('#withDrawHistoryList'),
			api : mineApi.withdrawHistory,
			isNeedToken:true,
			dataFilter : self.ListDataFilter
		});
	},

	// 列表数据过滤
	ListDataFilter : function(datas){
		var _this =  this;
        datas.forEach(function(obj,index){
        	var val = obj.status;
			if( val == 0 || val == 1 || val == 2 || val == 8){
				obj.statusText = '提现中';
                obj.statusTextClass = "gray";
                obj.remark = obj.paymentDate;
			}else if( val == 3 || val == 4 || val == 6 || val == 7 ){
				obj.statusText = '失败';
                obj.statusTextClass = "green";
                obj.remark = obj.transDate;
			}else if( val == 5 ){
				obj.statusText = '成功';
				obj.statusTextClass = "red"
                obj.remark = '手续费：' + obj.fee + '元';
			}
        });
        return datas;
	}

};

bankCardSucc.init();
