/**
 * @require style.css  
 */


var $ 			    = require("zepto");
var comm 		    = require("modules/common/common");
var mineApi 	    = require('modules/api/mineApi');
var service 	    = require('modules/common/service');
var inputNumber 	= require('modules/widget/inputNumber/inputNumber');
var tipBox          = require('modules/widget/tipBox/tipBox');
var checkPayTip = new tipBox();

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
					if( arr.join('') == _this.payPwd1 ){
						_this.sureChangePayPwd();
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
				_this.sureChangePayPwd();
			}
		});
	},

	// 确定设置新密码
	sureChangePayPwd : function(){
		var _this = this;
		var initPayService = new service();
		initPayService.api = mineApi.resetPayPwd;
		initPayService.isNeedToken=true;
		initPayService.data = {
			resetPayPwdToken : sessionStorage.getItem( 'resetPayPwdToken' ),
			pwd : _this.payPwd1,
		}
		initPayService.success = function(result){
			 var initPayTip = new tipBox({
			 	msg : '设置成功',
			 	callback : function(){
			 		sessionStorage.removeItem( 'resetPayPwdToken' );
			 		comm.goUrl('setting.html');
			 	}
			 });
			 initPayTip.show();
		}
		initPayService.send();
	}




};

payPwd.init();
