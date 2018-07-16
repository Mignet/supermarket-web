
/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var organizationApi  = require('modules/api/organizationApi');
var comm        = require('modules/common/common');
var Service     = require('modules/common/service');
var ScrollList  = require('modules/common/scrollList');
var Toolbar     = require('modules/widget/toolbar/toolbar');
// var template    = $('#organizationList').html();
var Swiper = require('modules/library/swiper/swiper');
var Render = require('modules/common/render');

var organization = {
    init:function(){
      this.securityLevel  = ''; 
      this.yearProfit     = '';    
      this.productDeadLine = '';    
      this.bindEvent();
    },

    bindEvent : function(){
      new Toolbar(2);
      this.renderOrgList();
      this.renderBanner();
      //回到顶部
      comm.backTop();
      /*
      * 平台选择 暂不需要 勿删备用
      $('.tab li').on('click',function(){
         $('.tab').find('span.arrow-up').removeClass('arrow-up').addClass('arrow-down');         
         var element = $(this).find('span').eq(1);
         element.removeClass('arrow-down').addClass('arrow-up');       
         $('#select-component').find('ul').hide();
         $('#select-component').find($(this).data('for')).show();
         $('#select-component').find('.mask').show();
      });

      $('#select-component').on('click','li',function(){
          $(this).siblings().removeClass('selected');
          $(this).addClass('selected');
          var attr = $(this).parent().attr('id');
          var parent = $('li[data-for="#'+attr+'"]');
          parent.find('span').eq(0).text($(this).text())
          parent.find('span').eq(1).removeClass('arrow-up').addClass('arrow-down'); 
          $('#select-component').find('ul').hide();
          $('#select-component').find('.mask').hide();
          if(attr == "safeLevel"){
            self.securityLevel  = $(this).data('value');
          }
          if(attr == "rateLavel"){
            self.yearProfit     = $(this).data('value');            
          }
          if(attr == "productTerm"){
            self.productDeadLine = $(this).data('value');            
          }
          $('#organizationList').html(template);
          self.renderOrgList();
      });

      $('.mask').on('click',function(){
          $('.tab').find('span.arrow-up').removeClass('arrow-up').addClass('arrow-down');   
          $('#select-component').find('ul').hide();
          $('#select-component').find('.mask').hide();        
      })
      */

    },
/*
  *平台选择  暂不需要 勿删备用
    renderSelect  : function(){
       var selectService = new Service();
       selectService.api = organizationApi.platformHead;
       selectService.isShowLoading = false;
       selectService.success = function(result){
          result.orgLevel.forEach(function(obj,index){
            $("#safeLevel").append('<li data-value="'+obj.value+'">'+obj.key+'</li>');
          })

          result.profit.forEach(function(obj,index){
            $("#rateLavel").append('<li data-value="'+obj.value+'">'+obj.key+'</li>');
          })

          result.deadline.forEach(function(obj,index){
            $("#productTerm").append('<li data-value="'+obj.value+'">'+obj.key+'</li>');
          });
       }
       selectService.send();
    },
    */

    renderOrgList : function(){
        var self  = this;
        new ScrollList({
          ele : $('#organizationList'),
          api : organizationApi.platfromList,
            isNeedToken: true,
          data:{
            securityLevel   : this.securityLevel,
            yearProfit      : this.yearProfit,
            productDeadLine  : this.productDeadLine
          },
          dataFilter:this._filter,
          callback:function(data){
            $('.org-logo').forEach(function(obj,index){
              $(obj).attr('src',$(obj).data('src'));
            });
            self.noticeStart();
          }          
        });
    },

    _filter : function(arr){
      arr.forEach(function(obj,index){
			obj.platformIcon    = comm.getServerImg(obj.platformIco);
      //产品自定义标签
      obj.orgInvestTagArr = obj.orgInvestTag.split(',');
      obj.orgInvestTag = "";
      if(obj.orgInvestTagArr.length){
        obj.orgInvestTagArr.forEach(function(data,index){
          if(index<3 && data!="" ){
            obj.orgInvestTag += "<span class='product-character' style='display:inline-block'>"+data.substr(0,6)+"</span>"
          }
        })
      }

      //机构标签
      obj.orgTagArr = obj.orgTag.split(",");
      obj.orgTag = "";
      if(obj.orgTagArr.length){
        obj.orgTagArr.forEach(function(data,index){
          if(index<3 && data!="" ){       
            obj.orgTag += data.substr(0,5)+"｜"
          }
        })
      }

      // 机构亮点
      if(obj.orgAdvantage){
        obj.orgAdvantageClass = 'block';
        var num = 20;
        if(obj.orgAdvantage.length >=num){
          obj.orgAdvantage.length = num;
        }
      }else{
        obj.orgAdvantageClass = "hidden";
      }

			//产品期限
			var arr = obj.deadLineValueText.split(',');
			//固定期限
			if(arr.length == 2){
				obj.deadLineText = arr[0] + '<span class="unit">'+arr[1]+'</span>';
			}
			//浮动期限
			if(arr.length == 4){
				obj.deadLineText = arr[0] + '<span class="unit">'+arr[1]+'</span> ~'+ arr[2] +'<span class="unit">'+arr[3]+'</span>';
			}

      // 可投标数为待发布的时候的的样式
			if(isNaN(obj.usableProductNums)){
				obj.productNumsClass="last_fontsize";
			}else{
				obj.productNumsClass="";
			}

      //是否显示红包
      obj.isShowRedpacket = 'hidden';
      if( obj.hashRedpacket) {
          obj.isShowRedpacket = 'inline-block';
      }

      if(obj.redemptionText == "" && obj.isShowRedpacket == 'hidden'){
          obj.redemptionClass = 'hidden';
      }

      // 机构活动测试数据
      // obj.orgActivitys = [{activityName:"突破500亿，回馈老客户！1",linkUrl:'afhashjdh'},{activityName:"突破500亿，回馈老客户！2",linkUrl:'afhashjdh'},{activityName:"突破500亿，回馈老客户！3",linkUrl:'afhashjdh'}];

      /*
      * 机构活动
      * orgActivitysClass:机构活动标签(隐藏||显示)
      * orgActivityList  :活动模板
      * orgActivitys     :机构活动 后台传回参数
      */
      if(!obj.orgActivitys.length){
        obj.orgActivitysClass = 'hidden';
      }else if(obj.orgActivitys.length){
        obj.orgActivitysClass = 'block';
        obj.orgActivityList = "";
        obj.orgActivitys.forEach(function(item){
          if(item.linkUrl.indexOf('http') ===-1){
            item.linkUrl = 'http://'+item.linkUrl
          }
          obj.orgActivityList += '<a class="orgList-label-text" href="'+item.linkUrl+'">'+item.activityName+'</a>';
        })
      }
      });
       return arr;
    },
    /*
    * 活动循环开始
    */
    noticeStart:function(){
        var _this = this;
        for(var i= 0;i<$(".orgList-announce").length;i++){
          var childrenLen = $(".orgList-announce").eq(i).children("a").length;//公告的条数
          if(childrenLen <= 1) continue;// 当公告为(1||0)的时候,函数不调用
          _this.noticeLoop(i);//循环调用
        };
    },
    /*
    * 活动循环
    */
    noticeLoop:function(index){
      var noticeTimer = setInterval(function(){
        $(".orgList-announce").eq(index).animate({marginTop:'-0.16rem'},500,function(){
          $(this).children().first().appendTo($(this));
          $(this).css('margin-top',0);
        })
      },4000)
    },
    /*
    * banner渲染
    */
    renderBanner:function(){
      var self = this;
      new Render({
        isList:true,
        ele:$("#headerBanner"),
        api:organizationApi.adQuery,
        data:{
          advPlacement:'platform_banner',
          appType:2
        },
        isShowLoading:false,
        filter:self.bannerFilter,
        callback:function(result){
          $("#headerBanner").find('img').each(function(i,obj){
            $(obj).attr('src',$(obj).data('src'))
          });
          // 轮播
          if(result.datas.length >1) { // 只有一张图片的时候不轮播
            self._swiper();
          }
        }
      })
    },
    _swiper:function(){
      new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          centeredSlides: true,
          speed: 1000,
          autoplay: 2500,
          autoplayDisableOnInteraction: false,
          loop: true
      });
    },
    bannerFilter:function(result){
      // 如果没有banner:隐藏
      if(!result.length){
        $("header").hide();
        return result;
      }
      result.forEach(function(data){
        if (data.linkUrl.indexOf('http') ===-1) {
          data.linkUrl = 'http://'+data.linkUrl
        }
      })
      return result;
    },

};

organization.init();
