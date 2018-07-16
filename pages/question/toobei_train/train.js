/**
 * @require style.css
 */
var $ = require("zepto");
var comm 		= require("modules/common/common");
var wechatShare = require("modules/common/wechatShare");

var train = {
    init: function () {
        $(".tab-change li").click(function () {
            if ($(this).children('span').hasClass('tab-active')) return;
            $(".tab-change li span").removeClass('tab-active');
            $(this).children('span').addClass('tab-active');
            $("section > div").addClass('hidden');
            $("section > div").eq($(this).index()).removeClass('hidden').addClass('block');
        });

        $('.arrow a').on('click', function(e) {
            var index = $('.tab-change span.tab-active').parent().index();
            sessionStorage.setItem("__guideTabIndex__",index);
        });

        var index = sessionStorage.getItem("__guideTabIndex__");
        if (index > 0) {
            $('.tab-change li').eq(index).trigger('click');
        }
        sessionStorage.removeItem("__guideTabIndex__");
        this.createWbChatApi();
    },

    // 微信分享
    createWbChatApi: function (){
        var shareData = {
            title  : 'T呗小白训练营', // 分享标题
            desc   : '传攻略、解疑惑  分分钟让小白变成老司机', // 分享描述
            link   : location.href + '&fromApp=toobei&platform='+this.getChannel(), // 分享链接
            imgUrl : comm.getServerImg('27faef940a394110deb930c4705af9a3') // 分享图标
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

train.init();