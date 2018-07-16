/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var mineApi = require('modules/api/mineApi');
var Service 	= require('modules/common/service');
var loading = require('modules/widget/loading/loading');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');

var thirdPersonalCenter = {
    init: function () {
        this.search = comm.getQueryString();
        loading.tip('即将离开T呗，为您跳转至' + this.search.orgName, true);
        this.getPersonalCenterUrl();
    },

    getPersonalCenterUrl : function(){
       var self = this;
       var server = new Service();
       server.api = mineApi.getOrgUserCenterUrl;
       server.isShowLoading = false;
       server.data = {
         'orgNo' : self.search.orgNumber
       }
       server.success = function(data){
          $("#form").attr('action',data.orgUsercenterUrl);
          $("#orgAccount").val(data.orgAccount);
          $("#orgKey").val(data.orgKey);
          $("#orgNumber").val(data.orgNumber);
          $("#sign").val(data.sign);
          $("#timestamp").val(data.timestamp);
          $("#requestFrom").val(data.requestFrom);
          $("#form").submit();  
       },
       server.error = function(msg,data){
          loading.hide();
          comm.alert(msg);
       }
       server.send(); 
    }
};
thirdPersonalCenter.init();