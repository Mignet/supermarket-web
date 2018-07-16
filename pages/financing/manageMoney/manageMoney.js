/**
 * @require style.css
 */
var $ = require("zepto");
var Toolbar     = require('modules/widget/toolbar/toolbar');
var financingApi 	= require('modules/api/financingApi');
var Render      = require('modules/common/render');
var service = require('modules/common/service');
var comm 		= require("modules/common/common");

var financing = {
    init:function(){
    	new Toolbar(1);
		this.bindEvent();
		this.renderTarget();
		this.renderTargetTitle();
    },

	bindEvent: function() {
    	$('.newTarget').on('click', function(){
    		comm.goUrl('./target.html?cateId=2');
    		var financingTitle = $(this).find('.targetName').text();
    		sessionStorage.setItem('financingTitle',financingTitle)
		});
	},

	renderTarget:function(){
		var _this = this;
		new Render({
			ele:$('#target_lists'),
			api: financingApi.productClassifyStatistics201,
			data:{
				cateIdList:'3,4,5'
			},
			filter:_this.filter,
			isList:true,
			callback:function(){
				$(".target_right:last").css({
					"border-bottom":0
				});
				_this.imgReplace();

				// 点击储存,作为下一个列表的标题
				$('.financingTitle').click(function(event){
					var financingTitle = $(this).children('p').eq(0).html().split('<')[0];
					sessionStorage.setItem('financingTitle',financingTitle);
				});
			}
		})
	},
	filter:function(data){
		data = data.filter(function(obj){
			return obj.cateId != 2;
		});
		data.forEach(function(obj, index){
			obj.newTargetClass = '';
			obj.flowMinRateStatistics = obj.flowMinRateStatistics.toFixed(2);
			obj.flowMaxRateStatistics = obj.flowMaxRateStatistics.toFixed(2)
			switch(obj.cateId){
				// case 2:
				//  	obj.newTargetClass = 'hidden';
				// 	$(".new_target img").attr('src', comm.getServerImg(obj.cateLogoInvestor));
				// 	$(".new_target span").text(obj.cateName);
				// 	$(".new_target a").text(obj.cateDeclare.substr(0,10));
				// 	$(".new_target").show();
				// break;
				case 3:
					if(obj.flowMinRateStatistics==0 && obj.flowMaxRateStatistics==0){
						obj.flowMinRateStatistics = '6.00';
						obj.flowMaxRateStatistics = '12.00';
					}
					break;
				case 4:
					if(obj.flowMinRateStatistics==0 && obj.flowMaxRateStatistics==0){
						obj.flowMinRateStatistics = '10.00';;
						obj.flowMaxRateStatistics = '18.00';
					}
					break;
				case 5:
					if(obj.flowMinRateStatistics==0 && obj.flowMaxRateStatistics==0){
						obj.flowMinRateStatistics = '6.00';
						obj.flowMaxRateStatistics = '10.00';
					};
			}
			
			if(obj.cateDeclare.length>23){
				obj.cateDeclare = obj.cateDeclare.substr(0,20)+"...";
			}
		})
		return data;
	},
	/*
	 新手标和理财师推荐产品
	 */
	renderTargetTitle: function () {
		var targetService = new service();
		targetService.api = financingApi.productClassifyStatistics;
		targetService.isNeedToken = true;
		targetService.data = {
			cateIdList: '2,801'
		};
		targetService.success = function (response) {
			$(".product_recommend").show();
			response.datas.forEach(function(obj,index){
				var imageSrc = comm.getServerImg(obj.cateLogoInvestor);
				var yearRate = obj.flowMinRateStatistics.toFixed(2)+"~"+obj.flowMaxRateStatistics.toFixed(2)+"<span>%</span>";
				switch(obj.cateId){
					case 2:
						$(".newTarget img").attr('src', imageSrc);
						$(".newTarget .year_rate").html(yearRate);
						// $(".newTarget .cateDeclare").html('<span>'+obj.cateDeclare.substr(0,5)+"</span><a href='../financing/target.html?cateId=2'>&nbsp;&nbsp;新手攻略</a>");
						$(".newTarget .cateDeclare").html('<span>'+obj.cateDeclare.substr(0,11)+"</span>");
						break;
					case 801:
						$(".planner_remommend img").attr('src', imageSrc);
						$(".planner_remommend .year_rate").html(yearRate);
						$(".planner_remommend .cateDeclare").text(obj.cateDeclare.substr(0,10));
				}
			});
		};
		targetService.send();
	},
	imgReplace:function(){
		$('#target_lists').find("img[data-src]").forEach(function(obj){
		  	if($(obj).data('src')){
           		$(obj).attr('src',comm.getServerImg($(obj).data('src')));
       		 }
		});
	}
};

financing.init();