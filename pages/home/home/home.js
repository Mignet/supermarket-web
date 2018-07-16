/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 *
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');
var financingApi = require('modules/api/financingApi');
var userApi = require('modules/api/userApi');
var render = require('modules/common/render');
var ScrollList = require('modules/common/scrollList');
var toolbar = require('modules/widget/toolbar/toolbar');
var tipBox = require('modules/widget/tipBox/tipBox');
var Swiper = require('modules/library/swiper/swiper');
var FinacingList = require('modules/widget/finacingList/finacingList');
var CountDown = require('modules/widget/saleCountdown/saleCountdown');

$("#productList").html($('#produce-head').html() + FinacingList.template);

var home = {
    // 初始化
    init: function () {
        new toolbar(0);
        this.jinfuLogin();
        this.getServerDefaultConfig();
        this.renderBanner();
        // this.renderOrg();
        this.getList();
        this.bindEvent();
        this.activeToken();
        this.postWechatCode();


    },

    bindEvent: function () {
        var self = this;


        // 新手红包
        var redPacketFlag = true;
        var first = true;
        $(".mine_redPacket").on('click', function (event) {
            if (redPacketFlag ) {
                location.href = "/pages/home/newhand.html";
            } else {
                redPacketFlag = true;
                $(this).parent().css('right', '0.1rem');

            }

            event.preventDefault();
        });

        comm.backTop();

        $(document).scroll(comm.throttle(function(){
            redPacketFlag = false;
            $('.mine_redPacket').parent().css('right', '-0.44rem');
        }, 500));

        //注册成功红包弹窗是否显示
        var query = comm.getQueryString();
        if( query.isPush == '1' && !sessionStorage.getItem('__showHomeRedpacket__') ) {
            $('#success-pop').show();
            sessionStorage.setItem('__showHomeRedpacket__', '1');
        }

        //注册成功红包弹窗
        $('#success-pop .close').on('click', function(){
            $('#success-pop').hide();
        });

        $('#success-pop .btn').on('click', function(){
            comm.goUrl('/pages/mine/mine.html');
        });
    },
    renderBanner: function () {
        var _this = this;
        new render({
            isList: true,
            ele: $('#bannerContent'),
            api: financingApi.newbanners,
            data: {
                appType: 2,
                advPlacement: 'app_home_page'
            },
            isShowLoading: false,
            filter:function(data){
               data.forEach(function(obj,index){
                    if(obj.shareTitle == "稳健前行 浓情感恩"){
                        if(comm.getCookie("__token__")){
                            obj.linkUrl = 'https://www.xiaoniu88.com/weixin/activity/thanksgivingseason/index';
                        }else{
                            obj.linkUrl = 'https://www.toobei.com/app/pages/user/login.html';                            
                        }
                    }
                   obj.shareDesc = encodeURIComponent(obj.shareDesc);
                   obj.shareImgurl = encodeURIComponent(obj.shareImgurl);
                   obj.shareIcon = encodeURIComponent(obj.shareIcon);
                   obj.shareTitle = encodeURIComponent(obj.shareTitle);
                    obj.linkUrl += '?shareDesc=' + obj.shareDesc + '&shareImgurl=' + obj.shareIcon
                   + '&shareLink=' +  obj.shareLink + '&shareTitle=' + obj.shareTitle;
               });
               return data;
            },
            callback: function (result) {
                $('#bannerContent').find('img').each(function (i, obj) {
                    $(obj).attr('src', $(obj).data('src'))
                });
                if(result.datas.length >1){//只有一张图片的时候不轮播
                    new Swiper('.banner', {
                        pagination: '.banner-pagination',
                        paginationClickable: true,
                        centeredSlides: true,
                        speed: 1000,
                        autoplay: 2500,
                        autoplayDisableOnInteraction: false,
                        loop: true
                    });
                };
            }
        });
    },

    renderOrg: function () {
        new render({
            isList: true,
            ele: $('#organizationContent'),
            api: financingApi.organization,
            isShowLoading: false,
            isNeedToken: true,
            callback: function (result) {
                $('#organizationContent').find('img').each(function (i, obj) {
                    $(obj).attr('src', comm.getServerImg($(obj).data('src')));
                })
                new Swiper('.organization', {
                    slidesPerView: 5,
                    paginationClickable: true,
                    freeMode: true
                });
            }
        });
    },

    getList: function () {
        var self = this;
        var getProductList = new service();
        getProductList.api = financingApi.productClassifyPreference;
        getProductList.isShowLoading = true;
        getProductList.isNeedToken = true;
        getProductList.success = function (result) {
            var productArr = {};
            productArr.datas = [];
            result.datas.forEach(function(obj){
                var tmpArr = obj.productPageListResponse;
                tmpArr.cateName = obj.cateName;
                //跳转列表的标题名
                tmpArr.titleName = obj.cateName;
                tmpArr.cateId = obj.cateId;
                tmpArr.imgSrc = $('#home-ico-' + obj.cateId).attr('src');
                if( obj.cateId > 100 ) {
                    tmpArr.imgSrc = $('#home-ico-8').attr('src');
                }
                switch(obj.cateId) {
                    case 2: {
                        tmpArr.linkUrl = '/pages/financing/target.html?cateId=2';
                        break;
                    }
                    case 3: {
                        tmpArr.linkUrl = '/pages/financing/financing.html?cateId=3';
                        break;
                    }
                    case 4: {
                        tmpArr.linkUrl = '/pages/financing/financing.html?cateId=4';
                        break;
                    }
                    case 5: {
                        tmpArr.linkUrl = '/pages/financing/financing.html?cateId=5';
                        break;
                    }
                    case 801: {
                        tmpArr.linkUrl = '/pages/mine/mine_planner.html';
                        break;
                    }
                    case 802: {
                        tmpArr.linkUrl = '/pages/financing/financing.html?cateId=802';
                        tmpArr.titleName += '产品排行';
                        break;
                    }
                }
                productArr.datas.push(tmpArr);
            });
            self.renderHotProductList(productArr);
            self.getNewhandStatus();
        }
        getProductList.send();
    },

    renderHotProductList: function(localData){
        new render({
            isList: true,
            ele: $('#productList'),
            isLocalData: localData,
            filter: this._filter,
            callback: function (result) {
                result.datas.forEach(function (obj, index) {
                    //发售时间大于当前时间
                    if (obj.saleStartTime.length > 0 && Date.now() < new Date(obj.saleStartTime.replace(/-/g, '/')).getTime()) {
                        var $circle = $('#productList .circle').eq(index + ((result.pageIndex - 1) * result.pageSize));
                        $circle.addClass('circle-white');
                        var $text = $('#productList .circle-text').eq(index + ((result.pageIndex - 1) * result.pageSize));
                        new CountDown({
                            ele: $text,
                            saleTimeStr: obj.saleStartTime,
                            nowTimeStr: obj.timeNow,
                            callback: function () {
                                $circle.removeClass('circle-white');
                                $text.text('购买');
                            },
                            isProduceList: true
                        });
                    }
                });

                $('.header a').on('click', function(e){
                    sessionStorage.setItem('financingTitle',$(this).data('name'))
                });
            }
        });
    },

    _filter: function (arr) {
        arr.forEach(function(obj,index){
            if(obj.isFlow == "1"){
                obj.yearRate = obj.flowMinRate.toFixed(2)
            }else{
                obj.yearRate = obj.flowMinRate.toFixed(2) + '~' + obj.flowMaxRate.toFixed(2);
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

            //产品标签
            obj.redemptionText= "";
            obj.tagList.forEach(function(data,index){
                if(index<3){
                    obj.redemptionText += "<span class='character' style='display: inline'>"+data +"</span>";
                    obj.redemptionClass = 'block';
                }
            })

            //是否显示红包
            obj.isShowRedpacket = 'hidden';
            if( obj.hasRedPacket == true ) {
                obj.isShowRedpacket = 'inline-block';
            }

            //是否显示标签栏
            if(obj.redemptionText == "" && obj.isShowRedpacket == 'hidden'){
                obj.redemptionClass = 'hidden';
            }

            //是否显示产品进度
            if(obj.isHaveProgress == "0"){
                obj.isHaveProgressClass  = 'block';
                if(obj.buyTotalMoney - obj.buyedTotalMoney < 0 ){
                    obj.percentage = 100 + '%';
                }else{
                    obj.buyedTotalMoney = obj.buyedTotalMoney || 0;
                    obj.buyTotalMoney   = obj.buyTotalMoney || 1;
                    obj.percentage      = parseInt(obj.buyedTotalMoney/obj.buyTotalMoney * 100) + "%";
                }
            }else{
                obj.isHaveProgressClass  = '';
                obj.percentage      = '';
            }

            //产品标签
            if( obj.tagList.length > 0 ) {
                obj.tagListText = obj.tagList.map(function(item, index){
                    if(index<2){
                        return '<span class="character" style="display: inline">' + item + '</span>';
                    }
                }).join('\n');
            }else{
                obj.tagListText = "";
            }
            // 新手标标签
            //obj.tagListRightNewer = ['新手专享'];
            
            if(obj.tagListRightNewer && obj.tagListRightNewer.length > 0){
                obj.tagListRightNewerText = obj.tagListRightNewer.map(function(item,index){
                    if(index<2){
                        return '<span class="tag">' + item + '</span>';
                    }
                }).join('\n');
            }else{
                obj.tagListRightNewerText = "";
            }


        });

        return arr;
    },

    // 获取服务器配置信息
    getServerDefaultConfig: function () {
        var getDefaultService = new service();
        getDefaultService.api = financingApi.defaultConfig;
        getDefaultService.isShowLoading = false;
        getDefaultService.success = function (data) {
            sessionStorage.setItem('__serverDefaultConfig__', JSON.stringify(data));
        }
        getDefaultService.send();
    },

    jinfuLogin: function() {
        var query = comm.getQueryString();
        if( query.code && query.key ) {
            var targetService = new service();
            targetService.api = userApi.jinfuLogin;
            targetService.data = {
                code: query.code,
                key: query.key
            };
            targetService.success = function (result) {
                comm.setCookie("__token__",result.token,2);
                sessionStorage.setItem("__jinfutoken__", query.token);
            };
            targetService.send();
        }
    },

    activeToken : function(){
        var tokenService = new service();
        tokenService.api = userApi.activeToken;
        tokenService.isShowLoading = false;
        tokenService.data = {token : comm.getCookie('__token__')};
        tokenService.onSuccess = function(data){
            var jsonData = JSON.parse(data);
            if( jsonData.code == 0 ){
                comm.setCookie("__token__",tokenService.data.token,2);
            }else{
                if(jsonData.code != "100003"){
                    this.onError(jsonData);
                }
            }          
        }
        tokenService.send();        
    },

    postWechatCode: function() {
        var query = comm.getQueryString();
        if( query.code && !query.key ) {
            var codeService = new service();
            codeService.api = userApi.saveWeiXinOpenId;
            codeService.isNeedToken = true;
            codeService.data = {
                code: query.code,
                isPush: query.isPush
            };
            codeService.success = function(data){

            }
            codeService.send();
        }
    },

    getNewhandStatus: function() {
        if( !comm.getCookie('__token__') ) return ;
        var Service = new service();
        Service.api = 'investornewcomertask/newcomerWelfare';
        Service.isNeedToken = true;
        Service.success = function(data){
            if( data.finishAll == '1' ) {
                $('#newRedPacket').hide();
            }
        }
        Service.send();
    }

};

home.init();





