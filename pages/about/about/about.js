/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var Service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var prompt		= require("modules/widget/prompt/prompt");
var template 	= require('modules/common/template');

var more = {
	init: function () {
		var _this = this;
		this.events();		
        this.getDefaultConfig();
	},

	events : function(){
		var _this = this;
		var morePrompt = new prompt("确定退出么？");
		$('#quiet').on('click',function(){
			morePrompt.show();
		});
		morePrompt.callback = function(){
			_this.loginOut();
		}
	},

    getDefaultConfig : function(){
       var config = sessionStorage.getItem('__serverDefaultConfig__');
       if(config){
          $("#mine_more").html(template.getHtml($("#mine_more").html(),JSON.parse(config)));
          $("#mine_more").css('visibility','visible');
       }else{
	       var service = new Service();
	       service.api = mineApi.defaultConfig;
	       service.success=function(data){
	          $("#mine_more").html(template.getHtml($("#mine_more").html(),data));
	          $("#mine_more").css('visibility','visible');
	          
	       }
	       service.send();      	
       }
    },

	// 退出登录
	loginOut: function(){
		var loginOutService = new Service();		
		loginOutService.isHttps = true;
		loginOutService.isNeedToken = true;
		loginOutService.api     = mineApi.logout;
		loginOutService.success = function(result){

		}
		loginOutService.send();
		comm.setCookie('__mobile__','',-1);
		comm.setCookie('__token__','',-1);
		comm.goUrl('pages/user/login.html', true);
	}


};

more.init();