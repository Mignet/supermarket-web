/**
 * @require style.css  
 */
var $ = require('zepto');
var comm 		= require("modules/common/common");
var render 		= require('modules/common/render');
var Service 	= require('modules/common/service');
var ScrollList = require("modules/common/scrollList");
var mineApi     = require('modules/api/mineApi');
var BubbleTip   = require('modules/widget/bubbleTip/bubbleTip');
var template    = $("#rewardBox").html();

var account = {
	init : function(){
        this.type = 0;
        this.getPageData();
        this.checkAuthenticate();
        this.checkSettingPwd();
        this.bindEvent();
        this._tabSwitch();
        this.getAccountBalance();
        this.queryRewardDetail();
        this.fixedNav();
	},

    fixedNav : function() {
	    var navOffsetTop = $('.tab-switch').offset().top;
        $(document).scroll(comm.throttle(function(){
            if( $(window).scrollTop() - navOffsetTop > 0 ) {
                $('.tab-switch').addClass('tab-switch-fixed');
            } else {
                $('.tab-switch').removeClass('tab-switch-fixed');
            }
        }, 50));
    },

	getPageData : function(){
        var acccountService = new Service();
        acccountService.api = mineApi.account;
        acccountService.isNeedToken = true;
        acccountService.success = function(data){
          $('#accountAmt').text(data.totalAmount);
            $('#total-income').text(data.totalIncome);
          if(data.userType == 0){//既是理财师又是投资者显示问号图标
            $("#accountDetail").show();
          }
        }
        acccountService.send();
	},
    /*
    * tab 切换
    */
    _tabSwitch:function(){
        var  self = this;
        $(".tab-switch").on('click',"li",function(){
            if($(this).children('a').hasClass('active')) return;
            $(this).children('a').addClass('active')
            $(this).siblings().children('a').removeClass('active');
            self.type = $(this).data('value');
            $("#rewardBox").html(template);
            $(".empty").addClass('none');
            self.queryRewardDetail();

        });
    },
    //T呗账户余额
    getAccountBalance:function(){
        var service = new Service();
        service.api = mineApi.getAccountBalance;
        service.isNeedToken = true;
        service.success = function(result){
            $("#rewardIncome").text(result.rewardIncome || "0.00");
            $("#rewardPay").text(result.rewardOut || "0.00");
            $("#rewardBalance").text(result.rewardBalance || "0.00");
        }
        service.send();
    },
    //T呗奖励明细
    queryRewardDetail:function(){
        var self = this;
        new ScrollList({
            ele:$("#rewardBox"),
            api:mineApi.queryRewardDetail,
            isNeedToken:true,
            data:{
                typeValue:self.type,
            },
            dataFilter:self._filter,
            callback:function(result){
                if(self.type == 1){
                    $(".empty-text").text("暂无账户收入明细，快去投资赚收益吧！")
                }else if(self.type == 2){
                    $(".empty-text").text("暂无账户支出明细，快去投资赚收益吧！")
                }else if(self.type == 0){
                    $(".empty-text").text("暂无账户明细，快去投资赚收益吧！")
                }
                if(!result.length){
                    $(".empty").removeClass('none');
                }
            }
        })
    },
    _filter:function(result){
        result.forEach(function(data){
            data.questionClass = "none";
            //判断交易金额的正负
            var indexNum = data.amount.toString().indexOf("-");
            if(indexNum != '-1'){
                data.transAmountClass = 'colorGreen'
            }else{
               data.transAmountClass = "colorRed" 
            }
            if(data.status == 0 || data.status == 1 || data.status == 2 || data.status == 8){
                data.rewardOutText = "提现中";
            }else if(data.status == 3 || data.status == 4 || data.status == 6 || data.status == 7){
                data.rewardOutText = "提现失败";
                data.questionClass = "inlineBlock";
            }else if(data.status == 5){
                data.rewardOutText = "提现成功";
            }
        })
        return result;
    },
    checkAuthenticate : function(){
        var authService = new Service();
        authService.api = mineApi.personAuthenticate;
        authService.isNeedToken   = true;
        authService.isShowLoading = false;   
        authService.success = function(data){
             $("#withdraw_link").attr('authenticate',data.bundBankcard);
        }
        authService.send();
    },

    checkSettingPwd : function(){
        var authService = new Service();
        authService.api = mineApi.verifyPayPwdState;
        authService.isNeedToken = true;
        authService.success = function(data){
             $("#withdraw_link").attr('setting',data.rlt);
        }
        authService.send();
    },

    bindEvent : function(){
        $("#withdraw_link").on('click',function(){
            var auth = $(this).attr('authenticate');
            var setting = $(this).attr('setting');
            if(auth == "true"){
                if(setting == "true"){
                    comm.goUrl('../withdraw/withdraw.html');  
                }else{
                    var tip = new BubbleTip({
                        title : '设置交易密码提示',
                        msg   :  '设置交易密码后才能提现，是否现在去设置？',
                        buttonText : ['取消','立即设置'],
                        callback:function(ok){
                            if(ok){                    
                                sessionStorage.setItem('__mineAccountResuorce__',true);
                                comm.goUrl('../setting/setPayPwd.html');                                               
                            }
                        }
                    });
                    tip.show();
                }                
            }else{
                var tip = new BubbleTip({
                    title : '绑卡提示',
                    msg   :  '您暂未绑定银行卡，请绑定后提现',
                    buttonText : ['取消','去绑卡'],
                    callback:function(ok){
                        if(ok){                    
                            sessionStorage.setItem('__mineAccountResuorce__',true);
                            comm.goUrl('../bind/bindCard.html');          
                        }
                    }
                });
                tip.show();       
            }
        });

        $("#accountDetail").on('click',function(){
            var tip = new BubbleTip({
                msg: 'T呗奖励是您参与T呗活动、通过T呗投资等所获得活动奖励、红包返现等。',
                buttonText: ["关闭"],
            });
            tip.show();
        });

        $("#rewardBox").on('click',".question",function(){
            var self = this;
            console.log($(this));
            var tip = new BubbleTip({
                msg: $(self).data('failurecause'),
                buttonText: ["关闭"],
            });
            tip.show();
        }); 
    }    

}

account.init();
