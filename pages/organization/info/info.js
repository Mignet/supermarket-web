/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var organizationApi = require('modules/api/organizationApi');
var comm = require('modules/common/common');
var Service = require('modules/common/service');
var template = require('modules/common/template');
var loading = require('modules/widget/loading/loading');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var native    = require('modules/common/native');
var Swiper = require('modules/library/swiper/swiper');
var tabContentStr = $("#tabContent").html();
var teamIntroStr = $("#teamIntro").html();
var adTemp = $("#orgActivity").html();
var FinacingList = require('modules/widget/finacingList/finacingList');
// var backHome = require('modules/widget/backHome/backHome');
$("#productList").html(FinacingList.template);

var organizationInfo = {
    init: function () {
        var self = this;
        this.query = comm.getQueryString();
        $('title').text(this.query.orgName);
        this.NUM = 114;
        this.isLarge  = false;
        //动态信息id
        this.orgDynamicId = 1;
        this.renderOrgInfo();
        this.renderProducList();
        this.bindEvent();
        this.setToken();
        if(document.referrer == "" && !native.isApp){
            $(".toolbar-index").show();
        }
    },
    renderOrgInfo: function () {
        var _this = this;
        var orgServer = new Service();
        orgServer.api = organizationApi.platfromDetail;
        orgServer.data = {orgNo: this.query.orgNumber};
        orgServer.isShowLoading = true;
        orgServer.success = function (result) {
            // 头部和内容部分展现
            $('header').add('section').show();
            $('title').text(result.orgName);
            // 没有数据时展现模板
            var noDataTemp = '<div class="no-data">暂无动态</div>';

            // 机构亮点
            if (result.orgAdvantage) {
                $(".orgAdvantage").text(result.orgAdvantage.substr(0, 30)).show();
            }

            // 机构标签
            result.orgTagArr = result.orgTag.split(",");
            if (result.orgTagArr) {
                result.orgTagText = result.orgTagArr.map(function (ele, index) {
                    if (ele) {
                        return "<span><i></i>" + ele + "</span>";
                    }
                }).join("\n");
            }
            $(".orgTagText").prepend(result.orgTagText);

            // 机构等级
            $(".orgLevel").append(result.orgLevel);

            // 机构logo
            $("#organizationLogo").attr('src', comm.getServerImg(result.orgLogo, false));

            //产品期限
            var arr = result.deadLineValueText.split(',');
            //固定期限
            if (arr.length == 2) {
                result.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>';
            }
            //浮动期限
            if (arr.length == 4) {
                result.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span> ~' + arr[2] + '<span class="unit">' + arr[3] + '</span>';
            };

            //导入模板
            $("#tabContent").html(template.getHtml(tabContentStr, result));
            // 团队信息
            if (result.teamInfos.length) {
                $("#teamIntro").empty();
                result.teamInfos.forEach(function (obj) {
                    $("#teamIntro").append(template.getHtml(teamIntroStr, obj));
                });

                $("#teamIntro").find("img[data-src]").forEach(function (obj) {
                    if ($(obj).data('src')) {
                        $(obj).attr('src', comm.getServerImg($(obj).data('src')));
                    }
                });
            } else {
                $("#teamIntro").empty();
                $("#teamIntro").prev('h2').hide()
            }
            // 平台简介
            if (!result.orgProfile) {
                // 数据为空展示无数据模板
                $(".orgProfile").parent().html(noDataTemp);
            } else if (result.orgProfile.length < _this.NUM) {
                //箭头隐藏
                $(".orgProfile").next().hide();
            } else {
                //箭头展现
                $(".orgProfile").next().show();
            }

            // 安全保障
            if (!result.orgSecurity) {
                // 数据为空展示无数据模板
                $(".org-insurance-box").html(noDataTemp);
            } else if (result.orgSecurity.length < _this.NUM) {
                //箭头隐藏
                $("#org-insurance").next().css('opacity',0);
            } else {
                //箭头展现
                $("#org-insurance").next().css('opacity',1);
            }
            // 展开收起
            _this.arrowStatus();
            // tab切换
            _this.tabSwitch();
            //安全保障
            $("#org-insurance").html(result.orgSecurity);
            // 平台信息图片广告
            if (result.orgActivitys.length) {
                // 平台信息图片展示
                $(".orgActivity").show();
                result.orgActivitys.forEach(function (data) {
                    data.platformImg = comm.getServerImg(data.platformImg);
                    if(data.linkUrl.indexOf('http') === -1 ){
                        data.linkUrl = "http://"+data.linkUrl
                    }
                    var temp = '<div class="swiper-slide"><a href="' + data.linkUrl + '" class="orgActivityAdvertiseUrl"><img src="' + data.platformImg + '" class="activityImg" alt="'+data.activityName+'"></a></div>';
                    $("#orgActivity").append(temp)
                });
                // 轮播
                if(result.orgActivitys.length > 1){
                    _this._swiper();
                };
            }
            $(".minHeight").addClass('short-height');//设置默认高度

            // 平台动态
            /*
            *   测试数据
            */
            // result.orgDynamicList = [{orgTitle:'机构标题1',orgDynamicUrl:'',id:1},{orgTitle:'机构标题2',orgDynamicUrl:'afjahsdf',id:1},{orgTitle:'机构标题3',orgDynamicUrl:'afjahsdf',id:1}]
            if(result.orgDynamicList.length<4){
                $('.org-dynamic .arrowStatus').css('opacity', 0);
            }
            var orgDynamicList = result.orgDynamicList.map(function(item,index){
                if(!item) return;
                var temp = '';
                if(item.orgTitle.length>18){
                   item.orgTitle =  item.orgTitle.substr(0,18)+"...";
                }
                if(item.orgDynamicUrl){

                    temp = '<li class="arrow"><a href="'+item.orgDynamicUrl+'" data-id="'+item.id+'">'+item.orgTitle+'<span class="create-time">'+item.createTime+'</span></a></li>';
                }else{
                    temp = '<li class="arrow"><a data-id="'+item.id+'">'+item.orgTitle+'<span class="create-time">'+item.createTime+'</span></a></li>';
                };
                return temp;
            }).join('\n');
            if(orgDynamicList){
                $(".org-dynamic > ul").html(orgDynamicList);
            }else{
                $(".org-dynamic > ul").html(noDataTemp);
            }
            $('.org-dynamic > ul').on('click','li',function(){
                if(!$(this).children('a').attr('href')){
                    _this.orgDynamicId = $(this).children('a').data('id')
                    comm.goUrl('organization_news.html?id=' + _this.orgDynamicId);
                }
            });

            //机构环境

            _this._imgLoad( result.orgEnvironmentList,'orgEnvironmentList');
            _this._imgLoad(result.orgPapersList,'orgPapersList');

            $("#orgHonor").html(result.orgHonor)
            _this._imgLoad(result.orgHonorList,'orgHonorList');


            $(".imgLarge").on("click",function(){
                if(!_this.isLarge){
                    _this.isLarge = true;
                    $("#img-large-layer").fadeIn().children('img').attr("src",$(this).attr('src'))
                }
            })
            $("#img-large-layer").on('click',function(){
                if(_this.isLarge){
                    _this.isLarge = false;
                    $(this).fadeOut();
                }
            })

            //无数据时:标题隐藏 
            if(!Boolean(result.orgHonor.length||result.orgHonorList.length)){
                $(".orgHonor").prev().hide();
            }
        } 
        orgServer.send();
    },
    /*
    * 轮播图
    */
    _swiper:function(){
        new Swiper('.swiper-container', {
            loop: true,
            autoplay: 2500,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            centeredSlides: true,
            speed: 1000,
            autoplayDisableOnInteraction: false,
        });
    },
    /*
    * 图片加载
    * param result 图片数组 
    */
    _imgLoad:function(resultArr,selector){

        //用默认图片填满一行
        var imgArr = [];
        var imgTmp = $('#img-tmp img');

        //加入图片数据
        for(var i = 0; i < resultArr.length; i ++) {
            imgArr.push({orgPicture: comm.getServerImg(resultArr[i].orgPicture, false)});
        }

        //多于一张每行显示3张图片
        if( resultArr.length > 1 ) {
            $("#"+selector).addClass('more');

            //不够的用默认图片补充
            var len = resultArr.length % 3;
            if( len !== 0 ) {
                for(var i = 0; i < 3 - len; i ++) {
                    imgArr.push({orgPicture: imgTmp.attr('src')});
                }
            }
        }

        //转为HTML插入页面
        imgArr.forEach(function(item,index){
            var temp;
            //中间图片应用样式
            if( index % 3 == 1 ) {
                temp = '<p class="center-img"><img class="imgLarge" src="'+item.orgPicture+'"></p>';
            } else {
                temp = '<p><img class="imgLarge" src="'+item.orgPicture+'"></p>';
            }
            $("#"+selector).append(temp);
        });
    },
    /*
    * 箭头方向以及内容是否展开
    */
    arrowStatus: function () {
        $(".arrowStatus").addClass("arrowDown").on('click',function(){
            //箭头状态
            if($(this).hasClass('arrowDown')){
                $(this).removeClass('arrowDown').addClass('arrowUp');
            }else{
                $(this).removeClass('arrowUp').addClass('arrowDown');
                // 收起回到顶部
                $("body").scrollTop(0);
            }
            //内容状态
            $(this).prev().toggleClass('short-height')
        })
    },
    /*
    * tab切换
    */
    tabSwitch: function () {
        $(".tabSwitch li").on('click', function () {
            //多次点击同一标签
            if ($(this).children('span').hasClass('active')) return;

            $(".tabSwitch li span").removeClass('active');
            $(this).children('span').addClass('active');
            // 内容展示
            $("#tabContent").children('div').hide().eq($(this).index()).show();
        });
    },
    renderProducList: function () {
        new FinacingList({
            ele: $('#productList'),
            api: organizationApi.productPageList,
            data: {
                orgCode: this.query.orgNumber,
                sort: 1,
                order: 1
            },
            dataFilter: this._filter,
            callback: function (data, result) {
                $(".investStrategy").show();
            }
        });
    },

    _filter: function (arr) {
        arr.forEach(function (obj, index) {
            // 机构名称隐藏
            obj.orgNameClass = 'hidden';
        });

        return arr;
    },

    bindEvent: function () {
        var self = this;
        comm.backTop()
        $(".footer").on('click', function () {
            self.goThirdPlatform();
        })
        $(".investStrategy").on('click', function (event) {
            comm.goUrl('/pages/question/investmentStrategy.html?orgCode=' + self.query.orgNumber)
        });
    },
    /*
    * 机构动态信息 
    * @param data:{orgDynamicId(动态信息id):} 
    */
    queryOrgDynamicInfo:function(){
        var self = this;
        var dynamicInfoService         =  new Service();
        dynamicInfoService.api         =  organizationApi.queryOrgDynamicInfo;
        dynamicInfoService.isNeedToken =  false;
        dynamicInfoService.data        =  {orgDynamicId:self.orgDynamicId};
        dynamicInfoService.success     =  function(result){
            comm.goUrl(result.orgDynamicUrl);
        };
        dynamicInfoService.send();
    },

    goThirdPlatform: function () {
        var self = this;
        var service = new Service();
        service.api = organizationApi.personAuthenticate;
        service.backUrl = location.pathname + location.search;
        service.isNeedToken = true;
        service.success = function (result) {
            if (result.bundBankcard) {
                self.isRegisterThirdAccount();
            } else {
                var tip = new BubbleTip({
                    title: '银行卡绑定提示',
                    msg: '绑定银行卡后才能购买产品，是否现在绑定银行卡？',
                    buttonText: ['取消', '立即绑定'],
                    callback: function (ok) {
                        if (ok) {
                            comm.goUrl('../bind/bindCard.html');
                        }
                    }
                });
                tip.show();
            }
        }
        service.send();
    },

    //检查是否注册了第三方平台
    isRegisterThirdAccount: function () {
        var self = this;
        var server = new Service();
        server.api = organizationApi.isBindOtherOrg;
        server.isNeedToken = true;
        server.isShowLoading = false;
        server.data = {
            'platFromNumber': self.query.orgNumber
        }
        server.success = function (data) {
            if (data.isBind) {
                self.queryThirdCenterUrl();
            } else {
                self.registerThirdAccount();
            }
        }
        server.send();
    },

    // 注册第三方平台
    registerThirdAccount: function () {
        var self = this;
        loading.tip('正在为您开通账户', true);
        var server = new Service();
        server.api = organizationApi.bindOrgAcct;
        server.isNeedToken = true;
        server.isShowLoading = false;
        server.data = {
            'platFromNumber': self.query.orgNumber
        }
        server.success = function (data) {
            self.queryThirdCenterUrl();
        }
        server.error = function (msg, data) {
            loading.hide();
            comm.alert(msg);
        }
        server.send();
    },

    //获取第三方跳转路径
    queryThirdCenterUrl: function () {
        var self = this;
        loading.tip('即将离开T呗，为您跳转至' + document.title, true);
        var server = new Service();
        server.api = organizationApi.getOrgUserCenterUrl;
        server.isNeedToken = true;
        server.isShowLoading = false;
        server.data = {
            'orgNo': self.query.orgNumber
        }
        server.success = function (data) {
            $("#form").attr('action', data.orgUsercenterUrl);
            $("#orgAccount").val(data.orgAccount);
            $("#orgKey").val(data.orgKey);
            $("#orgNumber").val(data.orgNumber);
            $("#sign").val(data.sign);
            $("#timestamp").val(data.timestamp);
            $("#form").submit();
        },
            server.error = function (msg, data) {
                loading.hide();
                comm.alert(msg);
            }
        server.send();
    },

    setToken: function() {
        var query = comm.getQueryString();
        if( query.token ) {
            comm.setCookie("__token__",query.token,2);
        }
    }
}

organizationInfo.init();
