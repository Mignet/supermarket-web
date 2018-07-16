
var $ = require("zepto");
var comm = require('modules/common/common');
var ajax    = require("modules/common/ajax");
var errorsMsg = require('modules/common/errorsMsg');
var loading = require('modules/widget/loading/loading');

// ajax代理处理
function service(){}

service.prototype = {

    // 修正constructor
    constructor : service,

    // 是否https
    isHttps : false,
    
    //是否需要token
    isNeedToken   : true,

    // 是否提示返回错误
    isShowErrorMsg : true,

    // 是否显示加载提示
    isShowLoading : true,


    send : function(){

        this.showLoading();
        var self = this;
        if(self.async === undefined){
           self.async = true; 
        }
        var settting = {
            url     : self.getURL(),
            method  : self.method || 'POST',
            async   : self.async,
            data    : self.getParams(),
            timeout : 30000,
            success : function(data){
                self.hideLoading();
                self.onSuccess(data);
            },
            error : function(data){
                self.hideLoading();
                self.onFail(errorsMsg.systemError,data);
            },
            onTimeout : function(){
                self.hideLoading();
                self.onFail(errorsMsg.timeoutError);               
            }
        }
        var request = new ajax();
        request.config = settting;
        request.send();
    },

    /**
     *  接口调用理论成功操作
     */
    onSuccess : function(data){
        var jsonData = JSON.parse(data);
        if( jsonData.code == 0 ){
            this.success(jsonData.data);
        }else{
            this.onError(jsonData);
        }
        comm.log( '接口:'+ this.api +'，返回数据为：' );
        comm.log( jsonData );
    },

    /**
     * 接口业务逻辑失败操作
     */
    onError : function( data ){
        if( data.code == "100003"){  
            if(this.backUrl){
                sessionStorage.setItem('productDetailBuy',this.backUrl);                
            }
            comm.setCookie('__mobile__','',-1);
            comm.setCookie('__token__','',-1);
            comm.goUrl('pages/user/login.html',true);
        }else{
            var msg = '';
            if( $.isArray( data.errors ) && data.errors.length > 0 ){
                msg = data.errors[0].msg;
            }else{
                msg = data.msg;
            }
            msg = msg || errorsMsg.systemError;
            this.onFail(msg,data);
        }
    },

    /**
     * 接口调用失败操作
     */
    onFail : function(msg,data){
        if(this.error){
            this.error(msg,data);
        }else{
            if( this.isShowErrorMsg ){
                comm.alert(msg);
            }           
        }
    },
    
    /**
     *  获取请问ulr
     */
    getURL : function(){
        return this.url || publicConfig.serverUrl + this.api;               
    },

    /**
     * 组装上传参数
     */
    getParams : function(){
        var sendData = $.extend( {}, this.baseData(), this.data);
        sendData.token = sendData.token || comm.getCookie('__token__');
        var arr = [];
        for ( key in sendData ) {
            arr.push( key + "=" + encodeURIComponent( sendData[key] ) );
        }
        return arr.join("&");
    },    

    /**
     *  添加接口基础参数
     */
    baseData : function(){
        return {
            orgNumber : this.isWechat() ? 'App_investor_wechat' : 'App_investor_wap',
            appKind   : 'investor',
            appClient : this.isWechat() ? 'wechat' : 'wap',
            appVersion: '1.0.0',
            v         : '1.0.0',
            timestamp : this.getNowDate()
        }         
    },

    /**
     *  获取当前时间戳
     */
    getNowDate : function () {
        var d = new Date();
        var o = {};
        o.y = d.getFullYear();
        o.m = d.getMonth()+1;
        o.d = d.getDate();
        o.h = d.getHours();
        o.min = d.getMinutes();
        o.s = d.getSeconds();
        return o.y+'-'+o.m+'-'+o.d+' '+o.h+':'+o.min+':'+o.s;
    },

    // 判断是否为微信
    isWechat : function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        }else{
            return false;
        }
    },

    /**
     * 显示加载loading标识
     */
    showLoading : function(){
        if(this.isShowLoading){
            loading.show();
        }
    },

    /**
     * 隐藏加载loading标识
     */   
    hideLoading : function(){
        if(this.isShowLoading){
            loading.hide();
        }
    }
}


module.exports = service;

