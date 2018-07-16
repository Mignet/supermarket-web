/**
 * @require detail.css  
 */
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var render 		= require('modules/common/render');
var ScrollList  = require("modules/common/scrollList");
var mineApi 	= require('modules/api/mineApi');
var template    = $("#detialListBox").html();
var accountDetail = {
	init: function () {	
		this.type = 1;
		this.bindEvent();
		this.getDetailList();
	},

	bindEvent : function(){
		var self = this;
		$('.header').on('click',function(){
			var element = $(this).find('#arrow');
			if(element.hasClass('arrow-up')){
				element.removeClass('arrow-up').addClass('arrow-down'); 
			}
			$('.select').find('ul').show();
			$('.select').find('.mask').show();
		});	

		$('.select').on('click','li',function(){
		   $(this).siblings().removeClass('selected');
		   $(this).addClass('selected');
		   $("#selectedText").text($(this).text());	      
		   $('.select').find('ul').hide();
		   $('.select').find('.mask').hide();
		   $('#arrow').removeClass('arrow-down').addClass('arrow-up'); 
		   self.type  = $(this).data('value');
		   $("#detialListBox").html(template);
           self.getDetailList();
		})

		$(".mask").on('click',function(){
		   $('.select').find('ul').hide();
		   $('.select').find('.mask').hide();
		   $('#arrow').removeClass('arrow-down').addClass('arrow-up'); 			
		})
	},

    getDetailList : function(){
       new ScrollList({
	       ele        : $("#detialListBox"),
	       api        : mineApi.accountDetailList,
           isNeedToken: true,
           data  : {
             	typeValue : this.type
           },
           dataFilter : function(arr){
              arr.forEach(function(obj,index){
                if(obj.transAmount * 1 > 0){
                	obj.transAmountClass="come_in";
                }else{
                	obj.transAmountClass="come_out";
                }
              })   
              $(".font-color").text(this.totalCount);           
              return arr;
           }
       })
    }
};

accountDetail.init();





