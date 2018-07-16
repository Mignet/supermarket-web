/**
 * @require detail.css
 */
var $ = require("zepto");
var BubbleTip = require('modules/widget/bubbleTip/bubbleTip');
var comm = require('modules/common/common');
var Service = require('modules/common/service');
var Render = require('modules/common/render');
var native = require('modules/common/native');
var financingApi = require('modules/api/financingApi');
var loading = require('modules/widget/loading/loading');
var CountDown = require('modules/widget/saleCountdown/saleCountdown');

var financing = {
    init: function () {
        var self = this;
        this.query = comm.getQueryString();
        self.token = comm.getCookie("__token__") || this.query.token;
        if(this.query.token){
            comm.setCookie("__token__",this.token,2);     
        }
        this.bindEvent();
        this.renderData();
    },

    bindEvent: function () {
        var self = this;

        var isOpen = false;
        $('.main').on('click','#openIcon',function(){
            if(isOpen){
                $("#productDesc").height(96)  
                $("#actualImage").attr('src',$("#openImage").data('src'));
                isOpen = false;
            }else{
                $("#productDesc").height("")
                $("#actualImage").attr('src',$("#foldImage").data('src'));
                isOpen = true;
            }

        })

        //购买按钮点击事件
        $('.main').on('click', '.footer-item.text', function () {
            if( native.isApp  && !sessionStorage.getItem("__jinfutoken__") ) {
                var data = {
                    orgNo: $('#footer').data('orgnumber'),
                    productId: $('#footer').data('productid'),
                    orgName: self.orgName
                };
                native.action('buyProduct',data);
            } else {
                //预售
                if( self.isAdvance ) return ;
                if (self.orgIsstaticproduct == "1") {
                    location.href = self.orgUrl;
                } else {
                    if (self.status == '2') {
                        //已经售罄
                        comm.goUrl('../organization/organization_info.html?orgNumber=' + self.orgNumber);
                    } else {
                        self.buyProcess();
                    }
                }
            }
        })
    },

    buyProcess: function () {
        var self = this;
        var service = new Service();
        service.api = financingApi.personAuthenticate;
        service.backUrl = location.pathname + location.search;
        service.isNeedToken = true;
        service.async = false;
        service.success = function (result) {
            if (result.bundBankcard) {
                self.isBindThirdPlatfrom();
            } else {
                var tip = new BubbleTip({
                    title: '银行卡绑定提示',
                    msg: '绑卡后购买产品、提现T呗奖励更方便。是否现在绑定银行卡？',
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

    renderData: function () {
        var self = this;
        new Render({
            ele: $('.main'),
            api: financingApi.productDetail,
            data: {
                productId: self.query.productId
            },
            filter: self._filter,
            callback: function (data) {
                self.orgName = data.orgInfoResponse.orgName;
                $('title').text(data.productName || self.query.productName);
                self.productId = data.productId;
                self.orgNumber = data.orgNumber;
                self.status = data.status;
                var orgInfoResponse = data.orgInfoResponse;
                self.org = data.orgInfoResponse.orgName;
                self.orgIsstaticproduct = data.orgInfoResponse.orgIsstaticproduct;
                self.orgUrl = data.detailOpenUrl;

                if (data.orgInfoResponse) {
                    $("#platformLogo").attr('src', comm.getServerImg(data.orgInfoResponse.platformlistIco));
                    for (var attr in data.orgInfoResponse) {
                        $('#' + attr).text(data.orgInfoResponse[attr]);
                    }
                }

                if($("#productDesc").height() > 96){
                    $("#productDesc").height(96);
                    $("#openIcon").show();
                }

                //产品预售 测试时间
                // data.saleStartTime =  '2018-3-5 17:11:30'

                if( data.saleStartTime.length > 0 &&  Date.now() < new Date( data.saleStartTime.replace( /-/g,'/' ) ).getTime() ) {
                    $("#footer .footer-item").css("backgroundColor","#dcdcdc")
                    //是否预售
                    self.isAdvance = true;
                    new CountDown({
                        ele: $('.footer-item.text span'),
                        saleTimeStr: data.saleStartTime,
                        nowTimeStr: data.timeNow,
                        callback: function(){
                            $("#footer .footer-item").css("backgroundColor","#7e99ce")
                            $('.footer-item.text span').text('购买');
                            self.isAdvance = false;
                        },
                        isProduce: true
                    });
                }
            }
        });
    },

    _filter:function(data){
        var investQuota = 10000;//投资额度
        var daysPerYear = 360;//一年投资天数
        var percent = 0; //进度百分比(不加%)
        var investIncome = 0;

        data.buttonText = '购买';

        investIncome = comm.toDecimal((investQuota * data.flowMinRate/ 100 * data.deadLineMinValue / daysPerYear))
        data.investIncome = investIncome;

        data.orgLevel = data.orgInfoResponse.orgLevel;
        data.orgAdvantage =data.orgInfoResponse.orgAdvantage;

        //产品年化收益
        if (data.isFlow == "1") {
            data.yearRate = data.flowMinRate.toFixed(2)
        } else {
            data.yearRate = data.flowMinRate.toFixed(2) + '~' + data.flowMaxRate.toFixed(2);
        }
        //产品期限
        var arr = data.deadLineValueText.split(',');
        //固定期限
        if (arr.length == 2) {
            data.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>';
        }
        //浮动期限
        if (arr.length == 4) {
            data.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>~' + arr[2] + '<span class="unit">' + arr[3] + '</span>';
        }
        //是否显示产品销售进度
        if(data.isHaveProgress == "0"){
            if (data.buyTotalMoney - data.buyedTotalMoney < 0) {
                data.percentage = 100 + '%';
            } else {
                data.buyedTotalMoney = data.buyedTotalMoney || 0;
                data.buyTotalMoney = data.buyTotalMoney || 1;
                data.percentage = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100) + "%";
            }

          //显示剩余额度(默认)
          data.isShowResidualAmount = '';
          data.residualAmount = (data.buyTotalMoney - data.buyedTotalMoney).toFixed(2);
          //产品购买占比
          if(data.residualAmount < 0){
            //如果为负数,就使用最大最小化处理，避免数据错误
            data.residualAmount = 0;
            data.percentage    = 100;
            percent = 100;
          }else{
            data.buyedTotalMoney = data.buyedTotalMoney || 0;
            data.buyTotalMoney   = data.buyTotalMoney   || 1;
            data.percentage      = parseInt(data.buyedTotalMoney/data.buyTotalMoney * 100) + "%";            
          }
          //显示产品购买占比
          data.isShowProgress = true;
          //年化收益为红色
          data.yearRateClass = '';
          data.virtualProduct = '';
          data.virtualProductShow = ''

          percent = parseInt(data.buyedTotalMoney / data.buyTotalMoney * 100);

        }else{
            //虚拟标，隐藏 剩余额度 、购买人数、产品总额
            data.virtualProduct = 'hidden';
            data.virtualProductShow = 'block'
            //首投金额
            //不显示产品购买占比
            data.isShowProgress = false;
            data.percentage = '';
        }
        //判断是否是新手标
        if(data.ifRookie == 1){
            data.isNewerClass="block";
        }else if(data.ifRookie == 2){
            data.isNewerClass="";
        }

        data.inlineBlock = '';
        data.investShow = "";
        data.showSub = "";
        //产品售罄
        if (data.status == '2') {
            data.isShowProgress = true;
            data.percentage = "100%";
            data.buttonText = '已售罄';
            data.showSub = 'show-sub';
            data.inlineBlock = 'inline-block';
            data.investShow = "hidden";
            percent = 100;
            $("#footer .footer-item").css("backgroundColor","#dcdcdc")
        }

        data.percentage = percent+'%';
        if(percent <= 8){
            data.textPercentage = '0';
            data.textTransform = '.1rem';
        }else if(percent > 8 && percent <=85){
            data.textPercentage = data.percentage;
            data.textTransform = '-0.26496rem';
        }else if(percent >=85){
            data.textPercentage = '85%';
            data.textTransform = '-0.26496rem';
        }

        //静态产品 对接
        data.orgIsstaticproduct = data.orgInfoResponse.orgIsstaticproduct;
        if(data.orgIsstaticproduct == "1"){
           $(".checkInvest").show();
        }else if(data.orgIsstaticproduct == "0"){
           $(".checkInvest").hide();
        }

        //可赎回可转让
        data.isRedemptionClass = 'block'
        if(data.isRedemption == 0){
            data.isRedemptionClass = "";
        }else if(data.isRedemption == 1){
            data.isRedemptionText = data.redemptionTime+'天后可赎回';
        }else if(data.isRedemption == 2){
            data.isRedemptionText = data.assignmentTime+'天后可转让';  
        }else if(data.isRedemption == 3){
            data.isRedemptionText = data.redemptionTime+'天后可赎回' + data.assignmentTime+'天后可转让';  
        }

        return data;
    },

    //检查t呗是否绑定了第三方平台
    isBindThirdPlatfrom: function () {
        var self = this;
        var server = new Service();
        server.api = financingApi.isBindOtherOrg;
        server.isNeedToken = true;
        server.async = false;
        server.data = {
            'platFromNumber': self.orgNumber
        }
        server.success = function (data) {
            if (data.isBind) {
                self.queryThirdBuyUrl();
            } else {
                if(self.orgNumber=='OPEN_XIAONIUZAIXIAN_WEB'){
                    var tip = new BubbleTip({
                        title: '账户绑定提示',
                        msg: '购买前需要绑定账户，且可能收到合作平台的回访，是否继续购买？',
                        buttonText: ['取消', '继续'],
                        callback: function (ok) {
                            if (ok) {
                                self.registerThirdAccount();
                            }
                        }
                    });
                    tip.show();                    
                }else{
                    self.isThirdOldAccount();                    
                }
            }
        }
        server.send();
    },

    /**
     * 检查是否是第三方老账户
     * [isThirdOldAccount description]
     * @return {Boolean} [description]
     */
    isThirdOldAccount : function(){
        var self = this;
        var server = new Service();
        server.api = financingApi.isExistInPlatform;
        server.isNeedToken = true;
        server.async = false;
        server.data = {
            'platFromNumber': self.orgNumber
        }
        server.success = function(data){
            if(data.isExist){
                comm.alert('您是'+self.org+'的老用户，通过T呗投资不能享受红包等奖励，建议购买其他平台产品');
            }else{
                var tip = new BubbleTip({
                    title: '账户绑定提示',
                    msg: '购买前需要绑定账户，且可能收到合作平台的回访，是否继续购买？',
                    buttonText: ['取消', '继续'],
                    callback: function (ok) {
                        if (ok) {
                            self.registerThirdAccount();
                        }
                    }
                });
                tip.show();                   
            }
        }
        server.send();
    },


    // 注册第三方平台
    registerThirdAccount: function () {
        var self = this;
        var server = new Service();
        server.api = financingApi.bindOrgAcct;
        server.isNeedToken = true;
        server.async = false;        
        server.data = {
            'platFromNumber': self.orgNumber
        }
        server.success = function (data) {
            self.queryThirdBuyUrl();
        }
        server.error = function (msg, data) {
            comm.alert(msg);
        }
        server.send();
    },

    //获取第三方跳转路径
    queryThirdBuyUrl: function () {
        var self = this;
        var server = new Service();
        server.async = false; 
        server.api = financingApi.getOrgProductUrl;
        server.data = {
            'orgNo'    : self.orgNumber,
            'productId': self.productId
        }
        server.success = function (data) {
            var arr = [];
            for(attr in data){
                data[attr] = decodeURIComponent(data[attr]).replace(/=/g,'?equals?').replace(/&/g,'?and?')
                if(attr == 'orgProductUrl'){
                    arr.push( attr+'='+data[attr].replace(/=/g,'?equals?').replace(/&/g,'?and?'));           
                }else{
                    arr.push( attr+'='+data[attr]);                      
                }
            }
            var href = publicConfig.buyHost+'buy.html?orgName='+ self.org +'&'+ arr.join('&');
            $("body").find('#buyPorductButton').remove();
            $("body").append("<a id='buyPorductButton' style='display:none' href='"+href+"'></a>");
            $("body").find('#buyPorductButton').trigger('click');                                 
        },
        server.error = function (msg, data) {
            loading.hide();
            comm.alert(msg);
        }
        server.send();    
    }
};

financing.init();
