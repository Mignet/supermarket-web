/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var Service = require('modules/common/service');
var comm = require('modules/common/common');
var mineApi = require('modules/api/mineApi');
var financingApi = require('modules/api/financingApi');
var organizationApi = require('modules/api/organizationApi');
var platformListTP = $("#organizationList").html();
var render = require('modules/common/render');
var ScrollList = require('modules/common/scrollList');
var Swiper = require('modules/library/swiper/swiper');
var FinacingList = require('modules/widget/finacingList/finacingList');
$("#productList").html(FinacingList.template);
$('#noRecommendProduct').html($("#noRecommendProduct").html()+FinacingList.template);

var planner = {
    init: function () {
        this.type = comm.getQueryString().type;
        this.renderPlanner();
        this.bindEvent();
        this.gotoHistory();
    },

    gotoHistory: function() {
        //跳转至之前位置
        var tabIndex = sessionStorage.getItem('__plannerTab__') || this.type;
        if (tabIndex == 2) {
            $('.tab a').eq(1).trigger('click');
        } else {
            this.renderProductList();
        }
        sessionStorage.removeItem('__plannerTab__');
    },

    bindEvent: function () {
        var self = this;

        this.renderRecommendOrg();
        // 回到顶部点击
        $('.toolbar-top').on('click', function () {
            $('body').scrollTop(0);
        })

        /*回到顶部图标显示*/
        $(document).scroll(comm.throttle(function(){
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop>=900){
                $('.toolbar-top').show();
            }else{
                $('.toolbar-top').hide();
            }
        }, 500));

        //切换标签
        $('.tab a').on('click', function () {
            $('.tab a').removeClass('active');
            $(this).addClass('active');
            $(".list").hide();
            if ($(this).data('id') == "produce") {
                $("#productList").html(FinacingList.template);
                self.renderProductList();
                //type表示标签栏位置
                self.type = 1;
            } else {
                $('#organizationList').html(platformListTP);
                self.renderOrgList();
                self.type = 2;
            }
        });

        //记录当前标签位置，返回时回到原位
        $('#productList').on('click', 'a', function () {
            sessionStorage.setItem('__plannerTab__', self.type);
        });

        $('#organizationList').on('click', 'a', function () {
            sessionStorage.setItem('__plannerTab__', self.type);
        });

    },

    renderPlanner: function () {
        var plannerService = new Service();
        plannerService.api = mineApi.minePlanner;
        plannerService.isNeedToken = true;
        plannerService.success = function (result) {
            $('.userName').text(result.userName || result.mobile);
            $('.level').text(result.cfpLevelName);
            $('.mobile').attr('href', 'tel:' + result.mobile);
            if (result.headImage) {
                $("#portrait").attr('src', comm.getServerImg(result.headImage));
            }
        }
        plannerService.send();
    },

    renderProductList: function () {
        var self = this;
        new FinacingList({
            ele: $("#productList"),
            api: financingApi.productClassifyPagelist,
            data: {
                cateId: 801
            },
            isNeedToken: true,
            dataFilter: this._filter,
            callback: function (data, result) {
                if (result.totalCount === 0) {
                    $('.listEmpty').remove();
                    self.renderHotRecommendProduct();
                }
            }
        });
    },

    _filter: function (arr) {
        arr.forEach(function (obj, index) {

        });
        return arr;
    },

    renderOrgList: function () {
        var self = this;
        new ScrollList({
            ele: $('#organizationList'),
            api: mineApi.queryPlannerRecommendPlatfrom,
            isNeedToken: true,
            dataFilter: this._filterOrg,
            callback: function (data, result) {
                if (result.totalCount === 0) {
                    //如果没有推荐平台，将scrollList默认样式替换
                    $('.listEmpty').remove();
                    $('#no-data').show();

                    // self.renderRecommandOrg();
                }
                $("#noRecommendProduct").hide();
                $('.org-logo').forEach(function (obj, index) {
                    $(obj).attr('src', $(obj).data('src'));
                });
            }
        });
    },

    _filterOrg: function (arr) {
        arr.forEach(function (obj, index) {
            obj.platformIcon = comm.getServerImg(obj.orgLogo);

            //产品标签
            obj.orgInvestTag = obj.orgInvestTag.split(',');
            obj.orgProductTag = "";
            if (obj.orgInvestTag.length > 1) {
                obj.orgInvestTag.forEach(function (data, index) {
                    if (data.trim().length > 0 && index < 3) {
                        obj.orgProductTag += "<span class='product-character' style='display:inline-block'>" + data + "</span>";
                    }
                })
            }

            //是否显示红包
            obj.isShowRedpacket = 'hidden';
            if( obj.hashRedpacket) {
                obj.isShowRedpacket = 'inline-block';
            }

            //机构标签
            obj.orgTagArr = obj.orgTag.split(",");
            obj.orgTag = "";
            if (obj.orgTagArr.length > 1) {
                obj.orgTagArr.forEach(function (data) {
                    obj.orgTag += data + "｜";
                })
            }

            // 机构亮点
            if (obj.orgAdvantage) {
                obj.orgAdvantageClass = 'block';
            } else {
                obj.orgAdvantageClass = "hidden";
            }


            //产品期限
            var arr = obj.deadLineValueText.split(',');
            //固定期限
            if (arr.length == 2) {
                obj.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>';
            }
            //浮动期限
            if (arr.length == 4) {
                obj.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span> ~' + arr[2] + '<span class="unit">' + arr[3] + '</span>';
            }

            // 可投标数为待发布的时候的的样式
            if (isNaN(obj.usableProductNums)) {
                obj.productNumsClass = "last_fontsize";
            } else {
                obj.productNumsClass = "";
            }
        });
        return arr;
    },
    renderRecommendOrg: function () {
        new render({
            isList: true,
            ele: $('#organizationContent'),
            api: financingApi.organization,
            isShowLoading: true,
            callback: function (result) {
                $('#organizationContent').find('img').each(function (i, obj) {
                    $(obj).attr('src', comm.getServerImg($(obj).data('src')));
                });
                new Swiper('.swiper-container', {
                    slidesPerView : 5,
                    freeMode: true
                });
                if (self.type !== 2) {
                    $('#no-data').hide();
                }
            }
        });
    },
    renderHotRecommendProduct:function(){
        var self = this;
        var HotRecommendProduct = new Service();
        HotRecommendProduct.api = financingApi.productClassifyPreference;
        HotRecommendProduct.data = {
            cateIdList:802
        };
        HotRecommendProduct.isShowLoading = true;
        HotRecommendProduct.isNeedToken = true;
        HotRecommendProduct.success = function (result) {
            var productArr = {};
            productArr.datas = [];
            result.datas.forEach(function(obj){
                var tmpArr = obj.productPageListResponse;
                tmpArr.cateName = obj.cateName;
                //跳转列表的标题名
                tmpArr.titleName = obj.cateName;
                tmpArr.cateId = obj.cateId;
                tmpArr.imgSrc = $('#home-ico-8').attr('src');
                tmpArr.linkUrl='/pages/financing/financing.html?cateId=802';
                productArr.datas.push(tmpArr);
            });
            self.renderHotProductList(productArr);
        }
        HotRecommendProduct.send();
    },
    renderHotProductList: function(localData){
        new render({
            isList: true,
            ele: $('#noRecommendProduct'),
            isLocalData: localData,
            filter: this.hotProductfilter,
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

                $('.linkSkip').on('click', function(e){
                    sessionStorage.setItem('financingTitle',$(this).data('name'));
                });
                $('#noRecommendProduct').show();
            }
        });
    },

    hotProductfilter: function (arr) {
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
            if(obj.tagListRightNewer.length > 0){
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
    }
}

planner.init();
