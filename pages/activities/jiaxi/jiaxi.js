/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var countDown = require('modules/widget/saleCountdown/saleCountdown');
var wechatShare = require("modules/common/wechatShare");
var share 	    = require("modules/widget/share/share");
var tipBox      = require('modules/widget/tipBox/tipBox');
var native = require('modules/common/native');
var shareTip    = new tipBox();

var jiaxi = {
    init: function() {
        this.bindEvent();
        native.runInitFunction(this,this.getInfo);
    },

    bindEvent: function() {
        var self = this;
        //倒计时
        new countDown({
            ele: $('#time'),
            saleTimeStr: '2017-04-01'
        });

        //跳转注册
        $('.register-btn').on('click', function() {
           comm.goUrl('../user/register.html');
        });

        //邀请
        $('.invite .no-complete').on('click', function() {
            if( native.isApp ) {
                var shareData = {
                    shareTitle  : self.userName + '正在T呗投资，需要你助力加息', // 分享标题
                    shareDesc   : '你的好友' + self.userName + '正通过T呗进行投资理财，现邀请你助力加息，赚取更多收益！', // 分享描述
                    shareLink   : publicConfig.static + 'pages/activities/jiaxi2.html?shareMobile='+ self.mobile + '&name=' + self.userName + '&fromApp=toobei&platform='+self.getChannel(), // 分享链接
                    shareImgurl : 'ef545fa3a52bd5a2546593296922a222' // 分享图标
                };
                native.appShare(shareData);
            } else {
                if( comm.isWebChat() ){
                    share.show();
                }else{
                    shareTip.show('请在微信中分享。')
                }
            }
        })
    },

    getInfo: function() {
        var self = this;
        var Service = new service();
        Service.api = 'helpRaiseRate/homepage';
        Service.isShowLoading = false;
        Service.success = function (result) {

            //处理名字
            if( result.userName ) {
                result.userName = result.userName.replace(/./g, function(word, index){
                    if( index == 1 ) {
                        return '*';
                    } else {
                        return word;
                    }
                });
            } else {
                result.userName = result.mobile.replace(/./g, function(word, index){
                    if( index > 2 && index < 7 ) {
                        return '*';
                    } else {
                        return word;
                    }
                });
            }

            self.userName = result.userName;
            self.setProcess(parseFloat(result.raisedRate));
            self.mobile = result.mobile;
            self.createWbChatApi();

        }
        Service.send();
    },

    setProcess: function(num) {
        if( num == 2 ) {
            $('.no-complete').hide();
            $('.process-num-box').hide();
            $('.complete').show();
        }
        $('.process-text').text(num.toFixed(2)+'%');
        num = num * 50;
        $('.process-color').css('width', num + '%');
        $('.process-num').css('left', num + '%');
    },

    // 微信分享
    createWbChatApi: function (){
        var self = this;
        var shareData = {
            title  : self.userName + '正在T呗投资，需要你助力加息', // 分享标题
            desc   : '你的好友' + self.userName + '正通过T呗进行投资理财，现邀请你助力加息，赚取更多收益！', // 分享描述
            link   : publicConfig.static + 'pages/activities/jiaxi2.html?shareMobile='+ self.mobile + '&name=' + self.userName + '&fromApp=toobei&platform='+self.getChannel(), // 分享链接
            imgUrl : comm.getServerImg('ef545fa3a52bd5a2546593296922a222') // 分享图标
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

jiaxi.init();
