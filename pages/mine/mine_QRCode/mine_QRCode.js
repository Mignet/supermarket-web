/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var wechatShare = require("modules/common/wechatShare");
var share 	    = require("modules/widget/share/share");
var tipBox      = require('modules/widget/tipBox/tipBox');
var shareTip    = new tipBox();

var myQRCode = {

	init: function () {
		this.QRCodeImg         = $('#QRCodeImg');
		this.sendInviteCode    = $('#sendInviteCode');
		this.getShareInfo();
		this.regEvent();	
	},

	// 事件绑定
	regEvent: function () {
		this.sendInviteCode.on('click',function(){
			if( comm.isWebChat() ){
				share.show();
			}else{
				shareTip.show('请在微信中分享。')
			}		
		});

	},

	// 获取分享信息
	getShareInfo : function(){
		var _this = this;
		var getWechatService = new service();
		getWechatService.api = mineApi.invitation;
		getWechatService.isNeedToken = true;
		getWechatService.isShowLoading = true;
		getWechatService.success = function(result){
			if( result.url ){
				_this.QRCodeImg.html('<img src="'+comm.getServerImg(result.url)+'" />');
			}
			_this.createWbChatApi(result.shareContent);
		}
		getWechatService.send();
	},

	// 微信分享
 	createWbChatApi: function (shareContent){
 		var linkArr = shareContent.shareLink.split("?")
 		var request = {};
        var arr = linkArr[1].split("&");
 		for (var i = 0; i < arr.length; i++) {
 		    request[decodeURIComponent(arr[i].split("=")[0])] = decodeURIComponent(arr[i].split("=")[1]);
 		}
 		if(request && request.name){
 			request.name = encodeURI(request.name)
 		}
 		shareContent.shareLink = linkArr[0]+"?recommendCode="+request.recommendCode+"&name="+request.name + '&fromApp=toobei&platform='+this.getChannel();
 		var shareData = {
		    title  : shareContent.shareTitle, // 分享标题
		    desc   : shareContent.shareDesc, // 分享描述
		    link   : shareContent.shareLink, // 分享链接
		    imgUrl : comm.getServerImg(shareContent.shareImgurl) // 分享图标 			
 		};
 		console.log(JSON.stringify(shareData));
 		new wechatShare(shareData);		
 	},


    // 判断是否为微信
    getChannel : function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == "micromessenger") {
            return "wechat" ;
        }else{
            return "wap";
        }
    }

};

myQRCode.init();





