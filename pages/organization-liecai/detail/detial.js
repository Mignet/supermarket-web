/**
 * @require style.css
 */
var $        = require("zepto");
var template = require('modules/common/template');
var tempStr  = $("#managerIntro").html();
var organizationApi         = require('modules/api/organizationApi');
var loading     = require('modules/widget/loading/loading');
var Service     = require('modules/common/service');
var comm        = require('modules/common/common');
var BubbleTip      = require('modules/widget/bubbleTip/bubbleTip');

var organizationDetail = {

	init:function(){
		var detail = JSON.parse(sessionStorage.getItem('__organizationDetail__'));
		document.title = detail.orgName;
    this.orgNumber = detail.orgNo;
    $("#orgIntroduction").val(detail.orgProfile);
    $("#safeIntroduction").val(detail.orgSecurity);
    $("#managerIntro").empty();            
    detail.teamInfos.forEach(function(obj){
       $("#managerIntro").append(template.getHtml(tempStr,obj));
    });
    $("#managerIntro").find("img[data-src]").forEach(function(obj){
        if($(obj).data('src')){
           $(obj).attr('src',comm.getServerImg($(obj).data('src')));
        }
    });
    $('textarea').each(function(index,obj){
      $(this).height(this.scrollHeight);
    })
    this.bindEvent();
	},

    bindEvent : function(){
      var self = this;
      $(".footer").on('click',function(){
        self.goThirdPlatform();
      })
    },

    goThirdPlatform : function(){
        var self = this;
        var service = new Service();
        service.api         = organizationApi.personAuthenticate;
        service.backUrl     = location.pathname + location.search;
        service.isNeedToken = true;
        service.success = function(result){
            if(result.bundBankcard){
              self.isRegisterThirdAccount();
            }else{
              var tip = new BubbleTip({
                  title : '银行卡绑定提示',
                  msg   :  '绑定银行卡后才能购买产品，是否现在绑定银行卡？',
                  buttonText : ['取消','立即绑定'],
                  callback:function(ok){
                    if(ok){                    
                      comm.goUrl('../bind/bindCard.html');                                               
                    }
                  }
              });
              tip.show();
            }
        } 
        service.send();           
    },  

    //检查是否注册了第三方平台
    isRegisterThirdAccount : function(){
       var self = this;
       var server = new Service();
       server.api = organizationApi.isBindOtherOrg;
       server.isNeedToken = true;
       server.isShowLoading = false; 
       server.data = {
         'platFromNumber': self.orgNumber
       }
       server.success = function(data){
          if(data.isBind){            
             self.queryThirdCenterUrl();
          }else{
             self.registerThirdAccount();
          }
       }
       server.send();
    },
    
    // 注册第三方平台
    registerThirdAccount : function(){
       var self = this;
       loading.tip('正在为您开通账户',true);       
       var server = new Service();
       server.api = organizationApi.bindOrgAcct;
       server.isNeedToken   = true;
       server.isShowLoading = false;       
       server.data = {
         'platFromNumber': self.orgNumber
       }
       server.success = function(data){
          self.queryThirdCenterUrl();
       }
       server.error = function(msg,data){
          loading.hide();
          comm.alert(msg);
       }
       server.send(); 
    },

    //获取第三方跳转路径
    queryThirdCenterUrl : function(){
       var self = this;
       loading.tip('即将离开T呗，为您跳转至' + document.title ,true);
       var server = new Service();
       server.api = organizationApi.getOrgUserCenterUrl;
       server.isNeedToken   = true;
       server.isShowLoading = false;
       server.data = {
         'orgNo'         : self.orgNumber
       }
       server.success = function(data){
          $("#form").attr('action',data.orgUsercenterUrl);
          $("#orgAccount").val(data.orgAccount);
          $("#orgKey").val(data.orgKey);
          $("#orgNumber").val(data.orgNumber);
          $("#sign").val(data.sign);
          $("#timestamp").val(data.timestamp);
          $("#form").submit();
       },
       server.error = function(msg,data){
          loading.hide();
          comm.alert(msg);
       }       
       server.send();         
    }      
}

organizationDetail.init();
