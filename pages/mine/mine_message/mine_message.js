/**
 * @require style.css  
 */
var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var Service 	= require('modules/common/service');
var scrollList  = require("modules/common/scrollList");
var mineApi     = require('modules/api/mineApi');
var tplStr1     = $('#bulletinList').html();
var tplStr2     = $('#underSelect').html();

var message = {
    init: function () {
        this.targetEvents();
        this.unReadCount();
        $('#underSelect').empty().html(tplStr2);
        this.gotoHistory();
    },

    //跳转至之前位置
    gotoHistory: function() {
        var tabIndex = sessionStorage.getItem('__messageTab__');
        if (tabIndex == 2) {
            $('#nav li').eq(1).trigger('click');
        } else {
            this.showPersonList();
        }
        sessionStorage.removeItem('__messageTab__');
    },
    unReadCount: function () {
        var countService = new Service();
        countService.isNeedToken = true;
        countService.api = mineApi.unreadCount; 
        countService.success = function (data) {
            if (data.bulletinMsgCount > 0 ) {
                if (data.bulletinMsgCount > 99) {
                    data.bulletinMsgCount = 99 ;
                };
                $('#bulletinCount').text( data.bulletinMsgCount ).addClass('inline-block');
            }else{
               $('#bulletinCount').text( data.bulletinMsgCount ).removeClass('inline-block');
            }
            if (data.personMsgCount > 0 ) {
                if (data.personMsgCount > 99 ) {
                    data.personMsgCount = 99 ;
                };
                $('#personCount').text(data.personMsgCount).addClass('inline-block');
            }else{
                $('#personCount').text(data.personMsgCount).removeClass('inline-block');
            }
        };
        countService.send();
    }, 

    targetEvents: function () {
        var self = this;
        $('#nav li').on('click',function(){
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            if($(this).data('index') == '0'){
               $('.each-common').removeClass('active');
               $('#bulletinList').parent().addClass('active');
               $('#bulletinList').empty().html(tplStr1);
               self.showBulletinList();
                sessionStorage.setItem('__messageTab__', '2');
            }else{
               $('.each-common').removeClass('active');
               $('#underSelect').parent().addClass('active');                
               $('#underSelect').empty().html(tplStr2);
               // self.showPersonList();
                sessionStorage.setItem('__messageTab__', '1');
            }
        })
     
         //公告设置已读
        $("#bulletinList").on('click','li',function(){
            var _this = this;
            var readService = new Service();
            readService.isNeedToken = true;
            readService.api = mineApi.noticeReaded; 
            readService.isShowLoading = false;
            readService.data = {
                msgId : $(this).data('id')
            }
            readService.success = function (data) {
                comm.goUrl($(_this).attr('href'));
            };
            readService.send();            
        })

        //公告全部设置已读
        $("#bulletinBtn").on('click',function(){
            var readAllService = new Service();
            readAllService.isNeedToken = true;
            readAllService.api = mineApi.noticeAllReaded; 
            readAllService.isShowLoading = false;
            readAllService.success = function (data) {
               $('#bulletinList').empty().html(tplStr1);
               self.showBulletinList();   
               self.unReadCount();             
            };
            readAllService.send();            
        })
        
        //通知设置已读
        $("#underSelect").on('click','li',function(){
            var _this = this;
            var readService = new Service();
            readService.isNeedToken = true;
            readService.api = mineApi.readed; 
            readService.isShowLoading = false;
            readService.data = {
                msgIds : $(this).data('id')
            };
            readService.success = function (data) {
                self.unReadCount();
                $(_this).addClass('gray_font');
            };
            readService.send();            
        })

        //通知全部设置已读
        $('#underSelectBtn').on('click',function(){
            var readAllService = new Service();
            readAllService.isNeedToken = true;
            readAllService.api = mineApi.allReaded; 
            readAllService.isShowLoading = false;
            readAllService.success = function (data) {
               $('#underSelect').empty().html(tplStr2);
               self.showPersonList();    
               self.unReadCount();           
            };
            readAllService.send();
        })
    },

    showBulletinList: function () {
        var _this = this;
        bulletinScroll = new scrollList({
            ele: $( '#bulletinList' ),
            api: mineApi.bulletinList,
            isNeedToken:true,            
            dataFilter: _this.dataTrans
        });
    },

    showPersonList: function () {
        var _this = this;
        personScroll = new scrollList({
            ele: $( '#underSelect' ),
            api: mineApi.personList,
            isNeedToken:true,
            dataFilter: _this.dataTrans,
            callback:function(result){
                $(".linkSkip").on('click',function(event){
                    event.stopPropagation();
                    comm.goUrl($(this).data('href'));
                })
            }
        });
    },

    dataTrans: function (data) {
        if( $.isArray(data)){
            for( var i=0; i< data.length; i++) {
                var linkUrlKey = data[i].linkUrlKey;
                if(linkUrlKey === "myCfp_platform"){
                    data[i].linkUrl = "/pages/mine/mine_planner.html?type=2";
                }else if(linkUrlKey === 'myCfp_product'){
                    data[i].linkUrl = "/pages/mine/mine_planner.html?type=1";
                }

                if(data[i].read == "1"){
                    data[i].grayFont = 'gray_font';
                }
                data[i].link = 'message_detail.html?msgId=' + data[i].id;
            }
        }
        return data;
    }

};

message.init();
