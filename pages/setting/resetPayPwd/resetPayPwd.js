/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm 	= require("modules/common/checkForm");
var service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var tipBox      = require('modules/widget/tipBox/tipBox');
var resetPayTip = new tipBox();

var resetPayPwd = {

	// 初始化
	init: function () {
		var _this = this;


		// 表单配置
		new checkForm( {
			isSetButtonState : true,
			isShowErrorMsg : true,
			formEle   : $('#resetPayPwdFrom'),
			buttonEle :$('#resetPayPwd'),			
			callback : function(formData){
				_this.resetPwd(formData);
			}
		} );
		this.events();
	},

	events : function(){
		// 处理键盘弹出，定位元素错位问题
		$('#resetPayPwdFrom input').on('focus',function(){
			$('.bodyBottom').hide();
		})
		.on('blur',function(){
			$('.bodyBottom').show();
		});
		
	},

	// 登录操作
	resetPwd : function(formData){
		var _this = this;
		var resetPwdService = new service();
		resetPwdService.data = $.extend({},formData);
		resetPwdService.api = mineApi.verifyIdCard;
		resetPwdService.isNeedToken=true;
		resetPwdService.success = function(result){
			if( result.rlt ){
				_this.sendCode();
			}else{
				resetPayTip.show('身份验证失败。');
			}
		}
		resetPwdService.send();
	},

	// 发送验证码
	sendCode : function(){
		var _this = this;
		var sendCodeService = new service();
		sendCodeService.api = mineApi.sendVcode
		sendCodeService.isNeedToken=true;
		//sendCodeService.data = {type : 3};
		sendCodeService.isShowErrorMsg = false;
		sendCodeService.success = function(result){
			comm.goUrl('resetPayPwd2.html');
		}
		sendCodeService.send();
	}


};

resetPayPwd.init();
