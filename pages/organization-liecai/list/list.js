
/**
 * @require style.css
 */
var $ = require("zepto");
var organizationApi  = require('modules/api/organizationApi');
var comm        = require('modules/common/common');
var Service     = require('modules/common/service');
var ScrollList  = require('modules/common/scrollList');
var Toolbar     = require('modules/widget/toolbar/toolbar');
var template    = $('#organizationList').html();

var organization = {
    init:function(){
      this.securityLevel  = ''; 
      this.yearProfit     = '';    
      this.productDeadLine = '';
      this.bindEvent();
      this.renderSelect();
      this.renderOrgList();
    },

    bindEvent : function(){
      var self = this;
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

      $('.toolbar-top').on('click',function(){
          $('#organizationList').empty();
          $('#organizationList').html(template);
          self.renderOrgList();
      })
    },

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

    renderOrgList : function(){
        new ScrollList({
          ele : $('#organizationList'),
          api : organizationApi.platfromList,
          data:{
            securityLevel   : this.securityLevel,
            yearProfit      : this.yearProfit,
            productDeadLine  : this.productDeadLine
          },
          dataFilter:this._filter,
          callback:function(data,result){
              /*回到顶部图标显示*/
              document.onscroll=function(){
                  var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                  if(scrollTop>=900){
                      $('.toolbar-top').show();
                  }else{
                      $('.toolbar-top').hide();
                  }
              }
                      
            $('.org-logo').forEach(function(obj,index){
              $(obj).attr('src',$(obj).data('src'));
            });
          }          
        });
    },

    _filter : function(arr){
      arr.forEach(function(obj,index){
			obj.platformIcon    = comm.getServerImg(obj.platformIco);

      //产品标签
      obj.orgProductTagArr = obj.orgProductTag.split(',');
      obj.orgProductTag = "";

      if(obj.orgProductTagArr.length){
        obj.orgProductTagArr.forEach(function(data,index){
          if(index<3 && data!="" ){
            obj.orgProductTag += "<span class='product-character' style='display:inline-block'>"+data.substr(0,6)+"</span>"
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
       });
       return arr;
    }
};

organization.init();
