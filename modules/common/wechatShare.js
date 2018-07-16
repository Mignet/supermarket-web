
// 获取微信分享信息
var mineApi 	= require('modules/api/mineApi');
var service 	= require('modules/common/service');

function wechatShare(shareData){
	this.init( shareData );
};

wechatShare.prototype.init = function ( shareData ) {
	var _this = this;
	var wechatShareService = new service();
	wechatShareService.api = mineApi.wechatShare;
	wechatShareService.isNeedToken = true;
	wechatShareService.data = {
		url : location.href.replace(/#.+$/, ''),
	};
	wechatShareService.success = function(result){
		wx.config({
			appId : result.appid,
			timestamp : result.timestamp,
			nonceStr : result.nonceStr,
			signature : result.signature,
			jsApiList : ['showOptionMenu','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ']
		});

		shareData = $.extend({},shareData);
		
		wx.ready(function(){
			// 分享到QQ
			wx.onMenuShareQQ(shareData);
			// 分享到朋友圈
			wx.onMenuShareTimeline(shareData);
			// 分享给朋友
			wx.onMenuShareAppMessage(shareData);
		});

		wx.error(function (res) {
			// alert(res.errMsg);
		});
	}

	wechatShareService.send();

}

module.exports = wechatShare;