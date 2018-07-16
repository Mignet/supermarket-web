/**
 * @require register.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm = require("modules/common/checkForm");
var service 	= require('modules/common/service');
var userApi 	= require('modules/api/userApi');
var tipBox 		= require('modules/widget/tipBox/tipBox');
var registerTip = new tipBox();

var register = {

	// 初始化
	init: function () {
		var _this = this;
		var getQueryString = comm.getQueryString();
		var recommendCode = '';
		if( getQueryString.recommendCode ){
			recommendCode = comm.hideMiddleStr( getQueryString.recommendCode );
		}
		var recommendText = getQueryString.name || recommendCode;

		if(recommendText == 'null' && recommendCode){
			recommendText = recommendCode;
		}

		if(recommendText == 'undefined' && recommendCode){
			recommendText = recommendCode;
		}

		if( !(getQueryString && getQueryString.recommendCode) ){
			$('.registerMobile .lineHeight3').show();
		}else{
			$('#recommendMob').html(  recommendText );
			$('.recommendText').show();
		}

		sessionStorage.removeItem( 'registerPageData' );

		// 注册表单校验
		new checkForm({
			isSetButtonState : true,
			formEle : $('#loginFrom'),
			buttonEle : $('#loginSub'),
			callback : function(data){
				_this.getUserType(data);
			}
		});

		$('#loginFrom input').on('focus',function(){
			$('.bodyBottom').hide();
		})
		.on('blur',function(){
			$('.bodyBottom').show();
		});
		
	},


	// 判断用户类型
	getUserType: function (formData) {
		var _this = this;
		var registerService = new service();
		var queryString = comm.getQueryString();
		registerService.api = userApi.checkMobile;
		registerService.data = $.extend( {},queryString,formData);	
		
		registerService.success = function(result){
				var registerPageData = JSON.stringify( $.extend( {},queryString,formData,result));
				sessionStorage.setItem('registerPageData', registerPageData);				
				switch ( result.regFlag.toString() ){
					// 已注册为理财师
					case '2':
						var theTip = new tipBox({
						 	msg : '你已经注册T呗，请直接登陆',
						 	callback : function(){
						 		comm.goUrl('login.html');
						 	}
						});
						theTip.show();
						break;
					// 注册第三方	
					case '1':
						//comm.goUrl('thirdRegister.html' );
						break;
					// 未注册	
					case '0':
						comm.goUrl( 'register2.html' );
						break;
				}
		}
		registerService.send();
	}

};

register.init();
