/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 *
 */
var $       = require("zepto");
var comm = require("modules/common/common");
var Swiper = require('modules/library/swiper/swiper');
var wechatShare = require("modules/common/wechatShare");

var safeShield = {

    init: function() {
        $(".swiper-container").height($(window.parent).height());
        new Swiper ('.swiper-container', {
            direction : 'vertical',
            mousewheelControl : true,
        });
        this.createWbChatApi();
    },

    // 微信分享
    createWbChatApi: function (){
        var shareData = {
            title  : '律盾让理财更安全', // 分享标题
            desc   : '律盾为您的理财额外增加多重安全保障：平台风险保证金  维权基金  顶尖律师团队', // 分享描述
            link   : location.href + '&fromApp=toobei&platform='+this.getChannel(), // 分享链接
            imgUrl : comm.getServerImg('f47c42663fc271b23bd5bfec8104f837') // 分享图标
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

safeShield.init();