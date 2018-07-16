/**
 * @require login.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service 	= require('modules/common/service');
var userApi 	= require('modules/api/userApi');

var login = {

	// 初始化
	init: function () {
		var _this = this;
		// 上次登录信息
		$('#mobile').val(comm.getCookie("__mobile__"));
		// 登录暂不校验密码
		new checkForm({
			isCheckPassword : false,
			isSetButtonState : true,
			formEle : $('#loginFrom'),
			buttonEle : $('#loginSub'),
			callback : function(data){
				_this.goLogin(data);
			}
		});

		this.events();
	},

	events : function(){
		var _this = this;

		$('#loginFrom input').on('focus',function(){
			$('.bodyBottom').hide();
		})
		.on('blur',function(){
			$('.bodyBottom').show();
		});
		

		$('#eyes').on('click',function(){
			if( $(this).hasClass('openEyes') ){
				$(this).removeClass('openEyes');
				$('#loginPwd').prop('type','password');
			}else{
				$(this).addClass('openEyes');
				$('#loginPwd').prop('type','text');
			}
		});

	},

	// 登录操作
	goLogin : function(formData){
		var _this = this;
		var loginService = new service();
		loginService.isHttps = true;
		loginService.api = userApi.login;
		loginService.data = formData;
		loginService.data.accessUrl = sessionStorage.getItem('__href__');
		loginService.data.fromUrl   = sessionStorage.getItem('__referer__'); 
		loginService.success = function(result){
			comm.setCookie("__mobile__",formData.mobile,2);
			comm.setCookie("__token__",result.token,2);         
			var  productDetailBuy = sessionStorage.getItem('productDetailBuy');			
			if(productDetailBuy){
				sessionStorage.removeItem('productDetailBuy');
				location.href = productDetailBuy;
			}else{
				comm.goRealUrl('index.html?isPush=0');
			}
		}
		loginService.send();
	}
};

login.init();
