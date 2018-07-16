/**
 * @require style.css
 * @require modules/library/swiper/swiper.css
 */
var $ = require("zepto");
var organizationApi = require('modules/api/organizationApi');
var comm = require('modules/common/common');
var ScrollList = require('modules/common/scrollList');
var Service = require('modules/common/service');
var template = require('modules/common/template');
var loading = require('modules/widget/loading/loading');
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var Swiper = require('modules/library/swiper/swiper');
var tabContentStr = $("#tabContent").html();
var managerIntroStr = $("#managerIntro").html();
var adTemp = $("#orgActivity").html();


var organizationInfo = {
    init: function () {
        this.query = comm.getQueryString();
        this.__NUM__ = 114;
        this.renderOrgInfo();
        this.bindEvent();
    },
    renderOrgInfo: function () {
        var _this = this;
        var orgServer = new Service();
        orgServer.api = organizationApi.platfromDetail;
        orgServer.data = {orgNo: this.query.orgNumber};
        orgServer.isShowLoading = true;
        orgServer.success = function (result) {
            $('header').add('section').show();
            document.title = result.orgName;
            // 没有数据时展现模板
            var noDataTemp = '<div class="no-data">暂无查询数据</div>';

            // 机构亮点
            if (result.orgAdvantage) {
                $(".orgAdvantage").text(result.orgAdvantage.substr(0, 30)).show();
            }

            // 机构标签
            result.orgTagArr = result.orgTag.split(",");
            if (result.orgTagArr) {
                result.orgTagText = result.orgTagArr.map(function (ele, index) {
                    if (ele != "") {
                        return "<span><i></i>" + ele + "</span>";
                    }
                }).join("\n");
            }
            $(".orgTagText").prepend(result.orgTagText);

            // 机构等级
            $(".orgLevel").append(result.orgLevel);

            // 机构logo
            $("#organizationLogo").attr('src', comm.getServerImg(result.orgLogo));

            //产品期限
            var arr = result.deadLineValueText.split(',');
            //固定期限
            if (arr.length == 2) {
                result.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>';
            }
            //浮动期限
            if (arr.length == 4) {
                result.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span> ~' + arr[2] + '<span class="unit">' + arr[3] + '</span>';
            }
            ;

            //导入模板
            $("#tabContent").html(template.getHtml(tabContentStr, result));
            if (result.teamInfos.length) {
                $("#managerIntro").empty();
                result.teamInfos.forEach(function (obj) {
                    $("#managerIntro").append(template.getHtml(managerIntroStr, obj));
                });

                $("#managerIntro").find("img[data-src]").forEach(function (obj) {
                    if ($(obj).data('src')) {
                        $(obj).attr('src', comm.getServerImg($(obj).data('src')));
                    }
                });
            } else {
                $("#managerIntro").empty();
                $(".managerIntro .arrowStatus").hide();
                $(".managerIntro").html(noDataTemp);
            }
            if (result.orgProfile.length === 0) {
                $(".orgProfile").parent().html(noDataTemp);
            } else if (result.orgProfile.length < _this.__NUM__) {
                $(".orgProfile").next().hide();
            } else {
                $(".orgProfile").next().show();
            }
            if (result.orgSecurity.length === 0) {
                $("#orgSecurity").parent().html(noDataTemp);
            } else if (result.orgSecurity.length < _this.__NUM__) {
                $("#orgSecurity").next().hide();
            } else {
                $("#orgSecurity").next().show();
            }
            _this.arrowStatus();
            _this.tabSwitch();
            //安全保障
            $("#orgSecurity").html(result.orgSecurity);

            // 机构活动广告
            if (result.orgAdvertises.length > 0) {
                result.orgAdvertises.forEach(function (data, index) {
                    data.orgActivityAdvertise = comm.getServerImg(data.orgActivityAdvertise);
                    var temp = '<div class="swiper-slide"><a href="' + data.orgActivityAdvertiseUrl + '" class="orgActivityAdvertiseUrl"><img src="' + data.orgActivityAdvertise + '" class="orgActivityAdvertise"></a></div>';
                    $("#orgActivity").append(temp)
                });

                $(".orgActivity").show();

                new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: 2500,
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    centeredSlides: true,
                    speed: 1000,
                    autoplayDisableOnInteraction: false,
                });
            }
            // sessionStorage.setItem('__organizationDetail__',JSON.stringify(result));

        }
        orgServer.send();
    },
    arrowStatus: function () {
        $(".managerIntro .arrowStatus").addClass('arrowDown').click(function () {
            if ($(this).hasClass('arrowDown')) {
                $(this).prev().removeClass('height')
            } else {
                $(this).prev().addClass("height")
            }
        })

        $(".orgRecord .arrowStatus").click(function () {
            if ($(this).hasClass('arrowDown')) {
                $(this).prev().removeClass('height')
            } else {
                $(this).prev().addClass("height")
            }
        });


        $(".arrowStatus").addClass('arrowDown').click(function () {
            if ($(this).hasClass('arrowDown')) {
                $(this).removeClass('arrowDown').addClass('arrowUp');
            } else {
                $(this).removeClass('arrowUp').addClass('arrowDown');
                document.documentElement.scrollTop = window.pageYOffset = document.body.scrollTop = 0;
            }
            $(this).prev().toggleClass("clamp4")
        });
    },
    tabSwitch: function () {
        $(".tabSwitch li").on('click', function () {
            if ($(this).children('span').hasClass('active')) return;
            $(".tabSwitch li span").removeClass('active');
            $(this).children('span').addClass('active');
            $("#tabContent").children('div').hide();
            $("#tabContent>div").eq($(this).index()).show();
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
        self.backTop()
        $(".footer").on('click', function () {
            self.goThirdPlatform();
        })
        $(".investStrategy").on('click', function (event) {
            comm.goUrl('/pages/question/investmentStrategy.html?orgCode=' + self.query.orgNumber)
        });
    },

    /*回到顶部*/
    backTop: function () {
        // 回到顶部点击
        $('.toolbar-top').on('click', function () {
            $('body').scrollTop(0);
        })

        /*回到顶部图标显示*/
        $(document).scroll(comm.throttle(function () {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if (scrollTop >= 900) {
                $('.toolbar-top').show();
            } else {
                $('.toolbar-top').hide();
            }
        }, 500));
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
    }
}

organizationInfo.init();
