/**
 * @require style.css
 */

var $ 			= require("zepto");
var comm        = require("modules/common/common");
var mineApi 	= require('modules/api/mineApi');
var Service 	= require('modules/common/service');
var comm 		= require("modules/common/common");

var login = {
	init: function () {
		$("#mobile").text(comm.getCookie("__mobile__"));
		this.getData();
	},

	getData: function(){
		var self = this;
		var server = new Service();
		server.api =  mineApi.personAuthenticate;
		server.isNeedToken = true;
		server.success = function(result){
			if(result.bundBankcard){
				$("#isBind").text('已绑定');
				$("#bindCard").attr('href','../bind/bindSuccess.html');
				self.isSettingPayPwd();
			}else{
				$("#isBind").text('未绑定');
				$("#bindCard").attr('href','../bind/bindCard.html');
			}
		}
		server.send();
	},

	isSettingPayPwd : function(){
		var server = new Service();
		server.api =  mineApi.verifyPayPwdState;
		server.isNeedToken = true;
		server.success = function(result){
        if(result.rlt){
           $('#changePayPwd').show();
				}else{
					$('#setPayPwd').show();
				}
		}
		server.send();
	}

};

login.init();
