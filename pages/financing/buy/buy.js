/**
 * @require style.css
 */
var $ = require("zepto");
var comm = require('modules/common/common');
var financingApi = require('modules/api/financingApi');
var Service 	= require('modules/common/service');
var loading = require('modules/widget/loading/loading');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');

var buy = {
    init: function () {
        this.search = comm.getQueryString();
        this.getOrgProductUrl();  
    },

    getOrgProductUrl : function(){
        var self = this;
        var server = new Service();
        server.api = financingApi.getOrgProductUrl;
        server.data = {
            'orgNo'    : this.search.orgNumber,
            'productId': this.search.productId
        }
        server.success = function (data) {
            self.httpFormPost(data);
        },
        server.error = function (msg, data) {
            loading.hide();
            comm.alert(msg);
        }
        server.send();        
    },

    httpFormPost : function(data){
       var arr = [];
       for(attr in data){
         arr.push( attr+'='+data[attr]);           
       }
       var str = arr.join('&');
       var $iframe = $('<iframe scrolling="no" frameborder="0" width="100%"></iframe>');
       $iframe.attr('height',document.documentElement.clientHeight+'px');
       //$iframe.attr('src',"http://prebuy.toobei.com/app/buy.html"+location.search+"&token="+comm.getCookie('__token__'));
       $iframe.attr('src',"http://prebuy.toobei.com/app/buys.html?"+str+'&orgName='+this.search.orgName);
       $('body').append($iframe);
    }
};
buy.init();