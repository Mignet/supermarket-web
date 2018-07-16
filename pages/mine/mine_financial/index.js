/**
 * @require style.css
 */
var $ = require('zepto');
var mineApi     = require('modules/api/mineApi');
var ScrollList  = require('modules/common/scrollList');
var Service     = require('modules/common/service');
var Render      = require('modules/common/render');
var comm        = require('modules/common/common');
var loading     = require('modules/widget/loading/loading');
var temp = $("#recording").html();


var platform = {
    init:function(){
        this.query = comm.getQueryString();
        this.token = comm.getCookie("__token__") || this.query.token;
        if(this.query.token){
            comm.setCookie("__token__",this.token,2);     
        }
        this.bindEvent();
        this.renderBindPage();
    },

    bindEvent:function(){
      var self = this;

      $("#orgList").on('click','.withdraw',function(e){
          self.orgNumber = $(this).data('num');
          self.orgName   = $(this).data('name');
          var url = $(this).data('url');
          if( $(this).data('status') == 0 ) {
              comm.goUrl(url);
          } else {
              self.goPersonalCenterPage();
          }
      })

      $("#tab").on('click',".tab-item",function(){
        if($(this).hasClass("active")){
            return;
        }else{
            $(".tab-item").removeClass('active');
            $(this).addClass('active')
            self.scrollTop = $(window).scrollTop();
            $("#recording").html(temp)
            self.myInvestrecord($(this).data('index'))
        }
      })
    },
    // 我的投资记录
    myInvestrecord:function(investType){
        var self = this;
        new ScrollList({
            ele:$("#recording"),
            api:mineApi.myInvestrecord,
            isNeedToken:true,
            data:{
                type:1,
                pageSize:10,
                investType:investType
            },
            dataFilter:function(arr){
                arr.forEach(function(obj,index){
                    obj.platformlistIco = comm.getServerImg(obj.platformlistIco)
                    if(obj.canRedemption == 0){
                        obj.isCanRedemptionClass = 'hidden'
                    }else if(obj.canRedemption == 1){
                        obj.isCanRedemptionClass = "";
                    }
                })
                return arr;
            },
            callback:function(resultArr,result){
              if(result.totalCount <= 0){
                $('#recording').add(".listMore").hide();
                $("#recordingEmptyContainer").show()
              }else{
                $('#recording').add(".listMore").show();
                $("#recordingEmptyContainer").hide()
                if(self.scrollTop){
                    $(window).scrollTop(self.scrollTop)
                }
              }
            }
        })
    },
    renderBindPage : function(){
      var self = this;
        new Render({
            ele:$('#orgList'),
            api: mineApi.platfromManager,
            data:{
                type:1,
                pageSize:100
            },
            isList:true,
            callback:function(result){
              if(result.totalCount <= 0){
                $("#orgContainer").add("#recordContainer").hide();
                setTimeout(function(){
                  $("#emptyOrgContainer").show()
                },100)
              }else{
                self.myInvestrecord(0);
              }
              $("#wraper").show()
            }
        })
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
