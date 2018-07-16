/**
 * @require style.css
 * 
*/
var $       = require("zepto");
var comm    = require('modules/common/common');
var Service     = require('modules/common/service');
var api = require('modules/api/api');
var native = require('modules/common/native');

var strategy = {
    init:function(){
        this.token = comm.getCookie('__token__');
        if( native.isApp ) {
            var self = this;
            native.getAppToken(function(data){
                self.token = data || '';
                self.collectFn();
            });
        } else {
            this.collectFn();
        }
    },
    collectFn:function(){
        this.judgeState();
        this.getData();
        this.bindEvent();
    },
    bindEvent:function(){
        var self = this;
        $("#register").on('click',function(){
            if(self.token){
                comm.alert('您已经注册了账号哦!看看其他攻略吧！');
                return false;
            }else if(native.isApp){
                self.appRegister();
                return false;
            }
        })

        //跳转邀请注册页面
        $('#invited').on('click', function(){
            if(native.isApp){
                self.skipInviteCustomer();
                return false;
            }
        })
    },
    skipInviteCustomer:function(){
        native.action("invitedCustomer");
    },
    judgeState: function() {
        //判断是否注册
        if( this.token ) {
            $('.register-wrapper .inner').addClass('gray');
            $('#register').html('已经<br/>注册');
        }
    },
    //app跳转登录
    appRegister:function(){
        native.action("register");
    },
    //数据获取
    getData:function(){
        var self = this;
        var dataService = new Service();
        dataService.api = api.productClassifyPreference;
        dataService.data={
            cateIdList:2
        };
        dataService.success=function(result){
            var flowMaxRate = result.datas[0].productPageListResponse.flowMaxRate.toFixed(2);
            var productId = result.datas[0].productPageListResponse.productId;
            var productName = encodeURI(result.datas[0].productPageListResponse.productName);
            var orgName = result.datas[0].productPageListResponse.orgName;
            var orgNo = result.datas[0].productPageListResponse.orgNumber;
            $("#buyNow").attr('href',"../financing/product_detail.html?productId="+productId+"&productName="+productName);
            $("#newRate").text(flowMaxRate+"%");
            if( native.isApp ) {
                $('#buyNow').on('click', function(){
                    native.action('buyTBProduct',{
                        url:publicConfig.static+'pages/financing/product_detail.html?productId='+ productId + '&token=' + self.token,
                        orgNo: orgNo,
                        orgName: orgName,
                        productId: productId,
                    });
                    return false;
                });
            }
        }
        dataService.send();
    }
};
strategy.init();