/**
 * @require style.css
 */
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var Service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var wechatShare = require("modules/common/wechatShare");
var share 	    = require("modules/widget/share/share");
var tipBox      = require('modules/widget/tipBox/tipBox');
var tip    = new tipBox();

var bindCard = {
   init:function(){
   	  this.initPattern();
      this.bindEvent();
      this.getBankData();
   },

   initPattern : function(){
		this.nameReg = /^[\u4e00-\u9fa5]{2,}$/;
		this.identifyReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		this.cardReg = /^\d{16}|\d{19}$/;
		this.mobileReg = /^1\d{10}$/;
   },

   bindEvent : function(){
   	var self = this;
      $("a.button").on('click',function(){
          var result = self.validate();
          if(result == true){
             self.submit();
          }else{
             tip.show(result);
          }
      });	

      $("#select").on('focus',function(){
         $(this).addClass('color');
      })
   },

   validate : function(){
      var name = $("#name").val();      
      if(name == ""){
      	 return '请输入持卡人姓名';
      }
      if(!this.nameReg.test(name)){
         return '请输入正确的持卡人姓名';
      }

      var identity = $("#identity").val();  
      if(identity == ""){
      	 return '请输入持卡人身份证号';
      }
      if(!this.identifyReg.test(identity)){
      	 return '请输入正确持卡人身份证号';
      }
      var card = $("#card").val();      
      if(card == ""){
      	 return '请输入银行卡号';
      }
      var selected = $("#select").val();
      if(!selected){
          return '请选择开户银行';
      }      
      if(!this.cardReg.test(card)){
         return '请输入正确的银行卡号';
      }

      var mobile = $("#mobile").val();      
      if(mobile == ""){
      	 return '请输入银行预留手机号码';
      }
      if(!this.mobileReg.test(mobile)){
         return '请输入正确的银行预留手机号码';
      }
      return true;
   },

   getBankData : function(){
      var bankServer = new Service();
      bankServer.api = mineApi.queryAllBank;
      bankServer.isNeedToken=true;
      bankServer.success = function(result){
      	result.datas.forEach(function(obj,index){
            $("#select").append('<option value="'+obj.bankId+','+obj.bankCode+'">'+obj.bankName+'</option>');
      	});        
      }
      bankServer.send();
   },

   submit : function(){
		var addServer = new Service();
		addServer.api = mineApi.addBankCard;
		addServer.isNeedToken=true;
		addServer.data = {
			bankCard : $("#card").val(),
			idCard   : $("#identity").val(),
			mobile   : $("#mobile").val(),
			userName : $("#name").val()			
		}
      var selected = $("#select").val();
      addServer.data.bankId   = selected.split(',')[0];
      addServer.data.bankCode = selected.split(',')[1];
      addServer.data.bankName = $('option[value="'+selected+'"]').text();
      addServer.success=function(result){
         comm.goUrl('bindSuccess.html');
      }
      addServer.send();
   }
}

bindCard.init();