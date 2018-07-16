/**
 * @require style2.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var countDown = require('modules/widget/saleCountdown/saleCountdown');
var wechatShare = require("modules/common/wechatShare");
var render = require('modules/common/render');

var jiaxi2 = {
    init: function() {
        this.query = comm.getQueryString();
        if( this.query.name ) {
            $('title').text(this.query.name + '正在T呗投资，需要你助力加息');
        }
        this.loginWechat();
        this.bindEvent();
    },

    bindEvent: function() {
        var self = this;

        //倒计时
        new countDown({
            ele: $('#time'),
            saleTimeStr: '2017-04-01'
        });

        //加息
        $('.no-help').on('click', function() {
            self.helpPeople();
        });

        //跳转注册
        $('.register-btn').on('click', function() {
            sessionStorage.setItem('__referer__', 'jiaxi');
            comm.goUrl('../user/register.html?recommendCode=' + self.query.shareMobile);
        });

        //更多
        self.tmp = $('.friends-list').html();
        $('.more-info').on('click', function() {
            $('.friends-list').html(self.tmp);
            new render({
                ele: $('.friends-list'),
                isLocalData: self.moreData,
                callback: function (result) {
                    $('.more-info').hide();
                }
            });
        });
    },

    getState: function() {
        var Service = new service();
        Service.api = 'helpRaiseRate/helpResult';
        Service.isShowLoading = false;
        Service.isNeedToken = false;
        Service.data = {
            mobile: this.query.shareMobile,
            openid: sessionStorage.getItem('__openid__')
        }
        Service.success = function (result) {
            $('.no-help').hide();
            $('.in-help').show();
            $('.help-num').text(result.helpRate);
        }
        Service.error = function() {

        }
        Service.send();
    },

    loginWechat: function() {
        var self = this;

        function getCode() {
            // var realUrl = publicConfig.static + 'pages/activities/getWechatInfo.html';
            // var realUrl ='http://10.16.2.92:9003/pages/activities/jiaxi2.html?shareMobile=15274433347';
            var realUrl = location.href;
            var url = 'https://www.toobei.com/app/get-weixin-code.html?appid=wx4ddbb3a6f5a7cec0&redirect_uri=' + encodeURIComponent(realUrl) + '&scope=snsapi_userinfo&state=getinfo#wechat_redirect'
            comm.goUrl(url);
        }

        function getInfo(code) {
            var Service = new service();
            Service.api = 'helpRaiseRate/getWeixinInfo';
            Service.isShowLoading = true;
            Service.isNeedToken = false;
            Service.data = {
                code: code
            }
            Service.success = function (result) {
                sessionStorage.setItem('__headimgurl__', result.headimgurl);
                sessionStorage.setItem('__nickname__', result.nickname);
                sessionStorage.setItem('__openid__', result.openid);
                self.getInfo();
            }
            Service.error = function (msg, result) {
                comm.alert('验证失败！');
                getCode();
            }
            Service.send();
        }

        if( this.query.state == 'getinfo' ) {
            if( sessionStorage.getItem('__openid__') ) {
                self.getInfo();
            } else {
                getInfo(this.query.code);
            }
        } else {
            getCode();
        }

    },

    helpPeople: function() {
        var self = this;
        var Service = new service();
        Service.api = 'helpRaiseRate/help';
        Service.isShowLoading = true;
        Service.isNeedToken = false;
        Service.data = {
            mobile: this.query.shareMobile,
            openid: sessionStorage.getItem('__openid__'),
            weixinIcoUrl: sessionStorage.getItem('__headimgurl__'),
            weixinNickname: sessionStorage.getItem('__nickname__')
        }
        Service.success = function (result) {
            $('.friends-list').html(self.tmp);
            self.getInfo();
            $('.no-help').hide();
            $('.in-help').show();
            $('.help-num').text(result.helpRate);
        }
        Service.send();
    },

    getInfo: function() {
        var self = this;
        var Service = new service();
        Service.api = 'helpRaiseRate/homepage';
        Service.isNeedToken = false;
        Service.data = {
            mobile: this.query.shareMobile
        }
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

            $('.nickname').text(result.userName);
            self.setProcess(parseFloat(result.raisedRate));

            if( result.helpDetailList.length == 0 ) {
                $('.friends').css('minHeight', '2.8rem');
                $('.no-content').show();
            } else {
                $('.no-content').hide();
            }

            var lessData = result.helpDetailList.slice(0, 3);
            self.moreData = result.helpDetailList;
            if(result.helpDetailList.length > 3 ) {
                $('.more-info').show();
            }

            new render({
                ele: $('.friends-list'),
                isLocalData: lessData,
                callback: function (result) {
                    console.log(result);
                }
            });
        }
        Service.send();
    },

    setProcess: function(num) {
        if( num == 2 ) {
            $('.process-num-box').hide();
            $('.help-text').hide();
            $('.no-help').hide();
            $('.com-help').show();
        } else {
            this.getState();
        }
        $('.process-text').text(num.toFixed(2)+'%');
        num = num * 50;
        $('.process-color').css('width', num + '%');
        $('.process-num').css('left', num + '%');
    }
};

jiaxi2.init();
