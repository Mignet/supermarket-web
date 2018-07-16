/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var userApi 	= require('modules/api/userApi');
var mineApi 	= require('modules/api/mineApi');
var prompt		= require("modules/widget/prompt/prompt");
// var comm = new common();

var more = {

	// 初始化
	init: function () {

		var _this = this;

		this.events();		

	},

	events : function(){

		var _this = this;

		// 提示确认退出登录
		var morePrompt = new prompt("确定退出么？");
		$('#quiet').on('click',function(){
			morePrompt.show();
		});
		morePrompt.callback = function(){
			_this.loginOut();
		}

	},

	// 退出登录
	loginOut: function(){
		var loginOutService = new service();
		loginOutService.data = {
			method : userApi.logout
		};
		loginOutService.success = function(result){
			userInfo.clearUserInfo();
			userInfo.clearToken();
			comm.goUrl('pages/user/login.html', true);
		}
		loginOutService.send();
	}


};

more.init();