/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var mineApi 	= require('modules/api/mineApi');
var service 	= require('modules/common/service');
var render 		= require('modules/common/render');

var bankCardSucc = {

	// 初始化
	init: function () {
		var _this = this;
		this.bindCardInfo();
		this.payPwdState();
	},

	//用户绑卡信息
	bindCardInfo: function(){
		var _this = this;
		var bindCardRender = new render({
			ele : $('#myCardInfo'),
			api : mineApi.getUserBindCard,
			isNeedToken : true,
			filter : function(result){
				result.bankCard = _this.hideNum(result.bankCard.toString());
				result.idCard = _this.hideNum(result.idCard.toString());
				return result;
			}
		});
	},

	// 判断用户是否设置了交易密码
	payPwdState : function(){
		var bindCard = $('#bindCard');
		var bindService = new service();
		bindService.isShowErrorMsg = false;
        bindService.api = mineApi.verifyPayPwdState;
        bindService.isNeedToken = true;
		bindService.success = function(result){
			if(!result.rlt){	
			    // 没有设置，设置交易密码
				$('#setPayPwdBtn').show();
			}
		}
		bindService.send();
	},

	// 保留数字前后四位
	hideNum : function(num){
		var str = '';
		var len = num.length;
		if( num.length > 8 ){
			str = num.substring(0,4);
			for(var i = 0; i < len - 8; i++){
				str +='*';
			}
			str += num.substring(len-4,len);
		}else{
			str = num;
		}
		return str;
	}
};

bankCardSucc.init();
