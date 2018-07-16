/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var mineApi 	= require('modules/api/mineApi');
var Service 	= require('modules/common/service');
var inputNumber = require('modules/widget/inputNumber/inputNumber');
var tipBox      = require('modules/widget/tipBox/tipBox');
var checkPayTip = new tipBox();

var payPwd = {

	// 初始化
	init: function () {
		this.sixPwd     	= $('#sixPwd');
		this.setPwdInfo 	= $('#setPwdInfo');
		this.setPayPwdSub	= $('#setPayPwdSub');
		this.oldPayPwd = '';
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
			if( _this.oldPayPwd == '' ){
				if( arr.length == 6){
					_this.checkPayPwd( arr.join('') );
				}
			}else{
				if( _this.payPwd1 == '' ){	//初次输入处理
					if( arr.length == 6){
						_this.payPwd1 = arr.join('');
						_this.inputPwd.clearInput(function(){
							_this.setPwdInfo.text('请再次输入交易密码');
						});
					}
				}else{	//再次输入处理
					if( arr.length == 6){
						if( arr.join('') == _this.payPwd1 ){
							_this.sureChangePayPwd();
						}else{
							_this.setPwdInfo.addClass('inputErr');
							_this.setPwdInfo.text('两次密码输入不一致');
							checkPayTip.show('两次密码输入不一致,请重新设置');
							_this.inputPwd.clearInput(function(){
								_this.setPwdInfo.text('请输入交易密码');
								_this.payPwd1 = '';
							});

						}
						
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
				_this.sureChangePayPwd();
			}
		});
	},

	// 验证交易密码
	checkPayPwd : function(num){
		var _this = this;
		var verifyService = new Service();
		verifyService.isHttps = true;
		verifyService.isNeedToken = true;
		verifyService.api = mineApi.verifyPayPwd;
		verifyService.data = {pwd : num}
		verifyService.success = function(result){
			if( result.rlt ){
				_this.inputPwd.clearInput(function(){
					_this.setPwdInfo.text('请设置新的交易密码');
					_this.oldPayPwd = num;
				});
			}else{
				 _this.inputPwd.clearInput(function(){
				 	checkPayTip.show('交易密码错误');
				 	_this.oldPayPwd = '';
				 });
			}

		}
		verifyService.send();
	},

	// 确定修改密码
	sureChangePayPwd : function(){
		var _this = this;
		var changeService = new Service();
		changeService.isHttps = true;
		changeService.isNeedToken = true;
		changeService.api = mineApi.modifyPayPwd;
		changeService.data = {
			oldPwd : _this.oldPayPwd,
			newPwd : _this.payPwd1
		}
		changeService.success = function(result){
			 var initPayTip = new tipBox({
			 	msg : '设置成功',
			 	callback : function(){
			 		comm.goUrl('setting.html');
			 	}
			 });
			 initPayTip.show();
		}
		changeService.send();
	}
};

payPwd.init();
