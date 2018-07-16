/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var mineApi 	= require('modules/api/mineApi');
var service 	= require('modules/common/service');
var inputNumber 	= require('modules/widget/inputNumber/inputNumber');
var tipBox = require('modules/widget/tipBox/tipBox');
var payPwdTip = new tipBox();

var payPwd = {
	// 初始化
	init: function () {
		this.sixPwd     	= $('#sixPwd');
		this.setPwdInfo 	= $('#setPwdInfo');
		this.setPayPwdSub	= $('#setPayPwdSub');
		this.payPwd1 = '';
		this.setPayPwdSub.hide();
		this.setPayPwdSub.attr('data-inputAgain',0);
		this.inputPwd = new inputNumber( this.sixPwd );
		this.events();

	},

	events: function () {
		var _this = this;
		// 输入数字操作
		this.inputPwd.callback = function(arr){
			if( _this.payPwd1 == '' ){	//初次输入处理
				if( arr.length == 6){
					_this.payPwd1 = arr.join('');
					_this.inputPwd.clearInput(function(){
						_this.setPwdInfo.text('请再次输入交易密码');
					});
				}
			}else{	//再次输入处理
				if( arr.length == 6){
					if( arr.join('') == _this.payPwd1){
						_this.initPayPwd();
					}else{
						_this.setPwdInfo.addClass('inputErr');
						_this.setPwdInfo.text('两次密码输入不一致');
					}
					
				}
			}
		}

		// 回删数字处理
		this.inputPwd.delFun = function(){
			if( _this.payPwd1 != '' ){
				_this.setPayPwdSub.addClass('disButton');
			}
		} 

		// 修改密码
		_this.setPayPwdSub.on('click',function(){
			if( !$(this).hasClass('disButton') ){
				_this.initPayPwd();
			}
		});
	},


	// 确定修改密码
	initPayPwd : function(){
		var _this = this;
		var initPayService = new service();
		initPayService.isHttps = true;
		initPayService.api =  mineApi.initPayPwd;
		initPayService.isNeedToken = true;
		initPayService.data = {
			pwd : _this.payPwd1
		}
		initPayService.success = function(result){
			 var initPayTip = new tipBox({
			 	msg : '交易密码设置成功',
			 	callback : function(){
			 		comm.goUrl('../mine/mine.html');
			 	}
			 });
			 initPayTip.show();
		}
		initPayService.send();
	}




};

payPwd.init();
