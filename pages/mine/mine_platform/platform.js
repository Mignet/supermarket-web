/**
 * @require style.css
 */
var $ = require('zepto');
var mineApi     = require('modules/api/mineApi');
var ScrollList  = require('modules/common/scrollList');
var Service     = require('modules/common/service');
var BubbleTip   = require('modules/widget/bubbleTip/bubbleTip');
var TipBox   = require('modules/widget/tipBox/tipBox');
var comm        = require('modules/common/common');
var loading     = require('modules/widget/loading/loading');
var tplStr1     = $('.bind-org').html();
var tplStr2     = $('.org-box').html();


var platform = {
    init:function(){
        this.isSafariTip = true;
        var query = comm.getQueryString();
        $("#invest-detail").attr('href', 'mine_investment.html?investAmount=' + query.investAmount + '&title=投资明细&totalProfit=' + query.totalProfit);
        this.bindEvent();
        this.renderBindPage();
        this.renderUnBindPage();
        this.platormStatistics();
        this.myCurrInvestAmount();
    },

    bindEvent:function(){
      var self = this;

      $('.unbind-org').on('click','.bind-button',function(){
          self.orgNumber = $(this).data('number');
          self.orgName   = $(this).data('name');
          if(sessionStorage.getItem('__authentication__') === "true"){
              if(self.orgNumber=='OPEN_XIAONIUZAIXIAN_WEB'){
                self.registerThirdAccount();
              }else{
                self.isThirdOldAccount();
              }
          }else{
              var tip = new BubbleTip({
                  title : '银行卡绑定提示',
                  msg   : '绑定银行卡后才能购买产品，是否现在绑定银行卡？',
                  buttonText : ['取消','立即绑定'],
                  callback:function(ok){
                    if(ok){
                        comm.goUrl('../bind/bindCard.html');
                    }
                  }
              });
              tip.show();
          }
      }),

      $(".bind-org").on('click','.info-item-right',function(e){
          self.orgNumber = $(this).data('num');
          self.orgName   = $(this).data('name');
          var url = $(this).data('url');
          if( $(this).data('status') == 0 ) {
              comm.goUrl(url);
          } else {
              self.goPersonalCenterPage();
          }
      })

      $("#totalInvestQuestion").on('click',function(){
        var tip = new BubbleTip({
            msg: '在投资金为“募集中”、“回款中”投资金额之和',
            buttonText: ["关闭"],
        });
        tip.show();
        return false;
      })
    },
    //我的在投金额
    myCurrInvestAmount:function(){
      var service = new Service();
      service.api = mineApi.myCurrInvestAmount;
      service.isNeedToken = true;
      service.success = function(result){
        $(".total-invest-value").text(result.amount)
      };
      service.send();
    },

    renderBindPage : function(){
        var self = this;
        new ScrollList({
            ele  : $('.bind-org'),
            api  : mineApi.platfromManager,
            isNeedToken:true,
            data : {
                type : 1,
                pageSize: 20
            },
            dataFilter:function(arr){
               arr.forEach(function(obj,index){
                    if(obj.isInvested == '1'){
                        obj.isInvestedText = '已投资';
                    }else{
                        obj.isInvestedText = '未投资';
                    }
               });
               return arr;
            }, 
            callback: function(arr, result) {
                //无数据
                if( result.totalCount === 0 &&  !sessionStorage.getItem('__jinfutoken__') ) {
                    $('.listEmpty').hide();
                    $('.no-bind').show();
                }

                //金服跳转
                var jinfutoken = sessionStorage.getItem('__jinfutoken__');
                if( jinfutoken ) {
                    $('.bind-org').prepend($('#jinfu-tp').html());
                    $('#jinfu-tp').html('');
                    $('#jinfu-link').attr('href','http://minvestor.xiaoniuapp.com/pages/mine/my_account.html?token=' + sessionStorage.getItem('__jinfutoken__'));
                }
            }
        });
    },

    renderUnBindPage : function(){
        new ScrollList({
            ele  : $('.org-box'),
            api  : mineApi.platfromManager,
            pageSize : 15,
            isNeedToken:true,
            data : {
                type : 2
            }, callback: function(arr,result) {
                //无数据
                if( result.totalCount === 0 ) {
                    $('.listEmpty').hide();
                    $('.no-unbind').show();
                }
            }
        });
    },

    platormStatistics : function(){
       var service = new Service();
       service.api = mineApi.platormStatistics;
       service.isNeedToken=true;
       service.success = function(data){
           //金服跳转
           if( sessionStorage.getItem('__jinfutoken__') ) {
               $("#bind-count").text(parseInt(data.bindOrgAccountCount)+1);
           } else {
               $("#bind-count").text(data.bindOrgAccountCount);
           }

            $("#unbind-count").text(data.unBindOrgAccountCount);
       }
       service.send();
    },

    /**
     * 检查是否是第三方老账户
     * [isThirdOldAccount description]
     * @return {Boolean} [description]
     */
    isThirdOldAccount : function(){
        var self = this;
        var server = new Service();
        server.api = mineApi.isExistInPlatform;
        server.isNeedToken = true;
        server.data = {
            'platFromNumber': self.orgNumber
        }
        server.success = function(data){
            if(data.isExist){
                comm.alert('您是'+self.orgName+'的老用户，通过T呗投资不能享受红包等奖励，建议购买其他平台产品');
            }else{
                self.registerThirdAccount();                             
            }
        }
        server.send();
    },    

    // 注册第三方平台
    registerThirdAccount : function(){
       var self = this;
       var server = new Service();
       server.api = mineApi.bindOrgAcct;
       server.data = {
          'platFromNumber': self.orgNumber
       }
       server.success = function(data){  
          $('.org-box').html(tplStr2);
          $('.bind-org').html(tplStr1);
          self.renderBindPage();
          self.renderUnBindPage();
          self.platormStatistics();          
       }
       server.error = function(msg,data){
          comm.alert(msg);          
       }
       server.send();
    },

    //获取第三方跳转路径
    goPersonalCenterPage : function(){
       var self = this;
       var server = new Service();
       server.api = mineApi.getOrgUserCenterUrl;
       server.async = false;
       server.data = {
         'orgNo' : self.orgNumber
       }
       server.success = function(data){
          var arr = [];
          for(attr in data){
            data[attr] = decodeURIComponent(data[attr]).replace(/=/g,'?equals?').replace(/&/g,'?and?')  
            if(attr == 'orgUsercenterUrl'){
                arr.push( attr+'='+data[attr].replace('=','?equals?'));           
            }else{
                arr.push( attr+'='+data[attr]);                      
            }       
          }
          var href = publicConfig.buyHost+'personal.html?orgName='+ self.orgName +'&'+ arr.join('&');
          $("body").find('#personalCenterButton').remove();
          $("body").append("<a id='personalCenterButton' style='display:none' href='"+href+"'></a>");
          $("body").find('#personalCenterButton').trigger('click');        
       },
       server.error = function(msg,data){
          loading.hide();
          comm.alert(msg);
       }
       server.send(); 
    }
}

platform.init();
