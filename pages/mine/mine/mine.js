/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var toolbar 	= require('modules/widget/toolbar/toolbar');
var tipBox      = require('modules/widget/tipBox/tipBox');
var prompt      = require("modules/widget/prompt/prompt");
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');

var mine = {
	init: function () {
        new toolbar(3);
        this.query = comm.getQueryString();
        this.token = comm.getCookie("__token__") || this.query.token;
        if(this.query.token){
            comm.setCookie("__token__",this.token,2);     
        }
        if(this.token ) {
            this.renderPage();
            this.targetEvent();
        } else {
            this.showNoLogin();
        }
	},

    targetEvent: function () {
        var _this = this;
        var layer = $( '#layer' ),
            layerBg = $( '#layerBg' ),
            layerBtnCancel = $( '#layerBtnCancel');

        $('#checkEye img').on('click',function(){
            var open_eye     = $('.open' );
            var close_eye    = $('.close' );
            var investAmount = $('.investAmount');
            var num = investAmount.data('num');
            if($(this).hasClass('open')){
                open_eye.hide();
                close_eye.show();
                investAmount.text("******");
                sessionStorage.setItem('__desensitization__',0);
            }else{
                open_eye.show();
                close_eye.hide();
                investAmount.text(num);
                sessionStorage.setItem('__desensitization__',1);
            }
        });

        $(document).on( 'click', '.authentication.none', function () {
          layer.show();
        });

        layerBtnCancel.on( 'click', function () {
          layer.hide();
        });

        layerBg.on( 'click', function () {
          layer.hide();
        });   

        $("#totalIncomeQuestion").on('click',function(){
            var tip = new BubbleTip({
                msg: '累计收益为“投资中”、“回款中”、“已完成”投资的收益之和',
                buttonText: ["关闭"],
            });
            tip.show();
        });
        $("#balanceQuestion").on('click',function(){
             var tip = new BubbleTip({
                 msg: 'T呗奖励是您参与T呗活动、通过T呗投资等所获得活动奖励、红包返现等。',
                 buttonText: ["关闭"],
             });
             tip.show();
            return false;
         });
    },

    // 获取首页数据
    renderPage : function(){
        var self = this;
        var mineService = new service();
        mineService.api         = mineApi.minePage;
        mineService.isNeedToken = true;
        mineService.success = function(result){
            $(".username").text(result.userName);
            $(".mobile").text(comm.hideMiddleStr(result.mobile, 3, 4 ));
            if( result.hongbaoCount == 0 ) {
                $(".hongbaoCount").html('无红包可用');
            } else {
                $(".hongbaoCount").html('<span>'+result.hongbaoCount+'</span>个可用');
            }
            $(".orgcount").html(result.orgAccountCount);
            $(".accountBalance").text(result.accountBalance);
            $(".total-profit").text(result.totalProfit);
            if(result.msgCount * 1 > 0) {
                $('.msgCount').text(result.msgCount).show();
            }
            if(result.isBindBankCard){
                $('.authentication' ).text('已认证');
            }else{
                $('.username').addClass('nameHidden');
                $('.authentication' ).text('未认证').addClass( 'none' );
            }
            var toobeiAccount = result.totalProfit;
            var accountUrl = 'mine_account.html';
            var platformUrl = 'mine_platform.html?investAmount=' + result.investAmount + '&totalProfit=' + result.totalProfit;
            if(sessionStorage.getItem('__desensitization__') == "0"){
                $('.close').show();
                $('.open').hide();               
                $(".total-profit").text("******").attr('data-num',toobeiAccount);
            }else{
                $('.close').hide();
                $('.open').show(); 
                $(".total-profit").text(toobeiAccount).attr('data-num',toobeiAccount);
            }
            // $('.total-profit').attr('href',platformUrl);
            $('.platform-list').attr('href',platformUrl);
            $("#minePlatform").attr('href',platformUrl);
            $('.total-profit-text').attr('href',"./mine_investment.html?investAmount=" + result.investAmount + '&title=我的投资&totalProfit=' + result.totalProfit)
            //跳转投资账户
            $('#platform_link').attr('href',accountUrl);
            sessionStorage.setItem('__authentication__',result.isBindBankCard);
        }
        mineService.send();
    },

    showNoLogin: function() {
        $('.no-login').show();
    }
};

mine.init();
