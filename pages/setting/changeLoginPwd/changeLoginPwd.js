/**
 * @require style.css
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var userApi 	= require('modules/api/userApi');
var tipBox      = require('modules/widget/tipBox/tipBox');
var changePwdTip = new tipBox();

var changeLoginPwd = {

	// 初始化
	init: function () {
		this.events();
	},

	events : function(){
		var _this = this;
		var pwdMsg = '请使用6~20位数字、字母组合登录密码';
		// 点击修改密码
		$('#findPasswordSub').on('click',function(){
			var oldPwd = $('#oldPwd').val();
			var newPwd = $('#newPwd').val();
			var newPwdAgain = $('#newPwdAgain').val();

			if( oldPwd == '' ){
				changePwdTip.show('请先输入旧密码');
			}else{

				if( newPwd == '' ){
					changePwdTip.show('请输入新密码');
				}else{
					if( isPwdReg( newPwd ) ){
						if( newPwd != newPwdAgain ){
							changePwdTip.show('两次密码输入不一致');
						}else{
							_this.changePwd();
						}
					}else{
						changePwdTip.show(pwdMsg);
					}
				}

			}
		});

		// 密码验证
		function isPwdReg(val){
			// if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val)){
			// 	return true;
			// }else{
			// 	return false;
			// }
			
			if(val.length < 6 || val.length > 20){
			   return false;
			}else{
               return true;
			} 
		}
	},

	// 重置密码
	changePwd : function(){
		var _this = this;
		var registerService = new service();
		registerService.isHttps = true;
		registerService.isNeedToken = true;
		registerService.api     = userApi.modifyLoginPwd;
		registerService.data = {
			oldPwd : $('#oldPwd').val(),
			newPwd : $('#newPwd').val()
		}
		registerService.success = function(result){
			 var theTip = new tipBox({
			 	msg : '恭喜，密码修改成功！',
			 	callback : function(){
			 		comm.goUrl('setting.html');
			 	}
			 });
			 theTip.show();
		}
		registerService.send();
	}

};

changeLoginPwd.init();
