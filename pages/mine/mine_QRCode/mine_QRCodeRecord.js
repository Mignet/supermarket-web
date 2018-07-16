/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var Service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var wechatShare = require("modules/common/wechatShare");
var share 	    = require("modules/widget/share/share");
var tipBox      = require('modules/widget/tipBox/tipBox');
var ScrollList  = require('modules/common/scrollList');
var shareTip    = new tipBox();

var invitRecord = {
   init:function(){
   	   this.bindEvent();
   	   this.getInvitationCount();
   	   this.renderInvitationList();
   	   this.getShareInfo();
   },

   bindEvent : function(){
      $("#footer").on('click',function(){
		if( comm.isWebChat() ){
			share.show();
		}else{
			shareTip.show('请在微信中分享。')
		}	      	
      });
   },
   
   //获取统计数据
   getInvitationCount : function(){
	   var server = new Service();
	   server.api = mineApi.invitationstatistics;
	   server.isNeedToken=true;
	   server.success = function(result){
           $(".register_num").text(result.regPersons);
           $(".investor_num").text(result.investPersons);
	   }
	   server.send();
   },

   //渲染投资列表
   renderInvitationList : function(){
		new ScrollList({
			ele : $("#invitationList"),
			api : mineApi.invitationList,
			isNeedToken:true,
			dataFilter:function(arr){
                arr.forEach(function(obj,index){
					if(obj.investFlag > 0){
						obj.investFlagText = "已投资";
					}else{
						obj.investFlagText = "未投资";
					}
					if( obj.customerName == '' ) {
						obj.customerName = '未认证';
					}
                });
                return arr;
			}
		});
   },

	// 获取分享信息
	getShareInfo : function(){
		var _this = this;
		var getWechatService = new Service();
		getWechatService.api = mineApi.invitation;
		getWechatService.isNeedToken = true;
		getWechatService.success = function(result){
			_this.createWbChatApi(result.shareContent);
		}
		getWechatService.send();
	},

	// 微信分享
 	createWbChatApi: function (shareContent){
 		var shareData = {
		    title  : shareContent.shareTitle, // 分享标题
		    desc   : shareContent.shareDesc, // 分享描述
		    link   : shareContent.shareLink, // 分享链接
		    imgUrl : comm.getServerImg(shareContent.shareImgurl) // 分享图标 			
 		};
 		new wechatShare(shareData);		
 	}   
}

invitRecord.init();