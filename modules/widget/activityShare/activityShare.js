var wechatShare = require("modules/common/wechatShare");
var comm 		= require("modules/common/common");

function activityShare() {
    this.init();
}

activityShare.prototype = {
    init: function() {
        var query = comm.getQueryString();
        var shareContent = {};
        shareContent.shareTitle = query.shareTitle;
        shareContent.shareDesc = query.shareDesc;
        shareContent.shareLink = query.shareLink;
        shareContent.shareImgurl = query.shareImgurl;
        this.createWbChatApi(shareContent);

        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
        head.appendChild(script);
    },

    // 微信分享
    createWbChatApi: function (shareContent){
        var shareData = {
            title  : shareContent.shareTitle, // 分享标题
            desc   : shareContent.shareDesc, // 分享描述
            link   : shareContent.shareLink + '?fromApp=toobei&platform='+this.getChannel(), // 分享链接
            imgUrl : comm.getServerImg(shareContent.shareImgurl) // 分享图标
        };
        console.log(shareData);
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

module.exports =  new activityShare();