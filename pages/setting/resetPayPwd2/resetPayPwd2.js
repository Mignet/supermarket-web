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

var resetPayPwd2 = {
	// 初始化
	init: function () {
		var _this = this;
		var mineInfo = comm.getCookie('__mobile__');	
		if( mineInfo.mobile ){
			$('#formTitle').text( '已发送短信验证码到 ' + comm.hideMiddleStr( mineInfo.mobile, 3, 4 ) );
		}
		// 表单配置
		this.sendCodeForm = new checkForm( {
			formEle   : $('#getCodeForm'),
			buttonEle : $('#phoneCode'),
			disButtonClass : 'hadSend',				
			callback : function(){
				_this.sendCode();
			}
		} );

		this.sendCodeForm.countdown();

		// 表单配置
		new checkForm( {
			formEle : $('#getCodeForm'),
			buttonEle : $('#findPasswordSub'),
			callback : function(formData){
				if( formData.vcode ){
					_this.resetPwd(formData);
				}else{
					resetPayTip.show('请先输入验证码');
				}
			}
		} );
	},

	// 登录操作
	resetPwd : function(formData){
		var resetPwdService = new service();
		resetPwdService.data = $.extend({},formData);
		resetPwdService.api = mineApi.inputVcode;
		resetPwdService.isNeedToken = true;
		resetPwdService.success = function(result){
			sessionStorage.setItem('resetPayPwdToken', result.resetPayPwdToken);
			comm.goUrl('resetPayPwd3.html');
		}
		resetPwdService.send();
	},


	// 发送验证码
	sendCode : function(){
		var _this = this;
		var sendCodeService = new service();
		sendCodeService.api = mineApi.sendVcode;
		sendCodeService.isNeedToken = true;
		sendCodeService.success = function(result){
			_this.sendCodeForm.countdown();
		}
		sendCodeService.send();
	}

};

resetPayPwd2.init();
