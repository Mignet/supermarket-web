/**
 * @require style.css
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
var wechatShare = require("modules/common/wechatShare");
var backHome = require("modules/widget/backHome/backHome");

var financing = {
    init: function () {
        var self = this;
        this.query = comm.getQueryString();
        self.token = comm.getCookie("__token__") || this.query.token;
        if(this.query.token){
            comm.setCookie("__token__",this.token,2);     
        }
        this.setToken();
        if(native.isApp && !sessionStorage.getItem("__jinfutoken__")){
            native.getAppToken(function(data){
                self.token = data || '';
                comm.setCookie('__token__', self.token);
                self.bindEvent();
                self.renderData();
            });
        } else {
            this.bindEvent();
            this.renderData();
        }
    },

    bindEvent: function () {
        var self = this;
        //查看平台、产品详情事件
        $('.main').on('click', '.downup', function () {
            if ($(this).hasClass('arrow-up')) {
                $(this).removeClass('arrow-up').addClass('arrow-down');
            } else {
                $(this).removeClass('arrow-down').addClass('arrow-up');
            }
            $(this).next().toggle();
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

        //点击投资攻略
        $('.main').on('click', '.footer-item.strategy', function () {
            comm.goUrl('/pages/question/investmentStrategy.html?orgCode='+ self.orgNumber);
        });

        if(!self.token){
            $(".use-packet").remove()
            $(".lvdun").css({width:"100%",border:"0"}); 
        }
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
            data: {productId: self.query.productId},
            filter: self._filter,
            callback: function (data) {
                var shareWechat = {};
                shareWechat.title = data.productName;
                shareWechat.desc = '年化收益: '+ data.yearRate + '%　产品期限：' + data.deadLineValueNewText;
                self.createWbChatApi(shareWechat);
                self.orgName = data.orgInfoResponse.orgName;
                if( native.isApp ) {
                    native.action('setAppWebTitle', {title: data.productName});
                }
                $('title').text(data.productName || self.query.productName);
                self.productId = data.productId;
                self.orgNumber = data.orgNumber;
                self.status = data.status;
                var orgInfoResponse = data.orgInfoResponse;
                self.org = data.orgInfoResponse.orgName;
                self.orgIsstaticproduct = data.orgInfoResponse.orgIsstaticproduct;
                self.orgUrl = data.detailOpenUrl;

                if (data.orgInfoResponse) {
                    for (var attr in data.orgInfoResponse) {
                        $('#' + attr).text(data.orgInfoResponse[attr]);
                    }
                }
                $("#flat-logo").attr('src',comm.getServerImg(orgInfoResponse.platformIco));

                $("#product-flat-detail").on('click',function(){
                    if( native.isApp ) {
                        native.action('getAppPlatfromDetail', {orgNo:data.orgInfoResponse.orgNo});
                    } else {
                        comm.goUrl('../organization/organization_info.html?orgNumber='+data.orgInfoResponse.orgNo);
                    }
                });

                var usePacketJson = {
                    "deadline"    : data.deadLineMinValue,
                    "model"       : data.orgInfoResponse.orgFeeType,
                    "patform"     : data.orgInfoResponse.orgNo,
                    "productId"   : data.productId,
                    "type"        : 2
                }
                usePacketJson = JSON.stringify(usePacketJson);

                if( data.couldUseRedPacketCounts !== '没有' ) {
                    $("#usePacket").on('click',function(){
                        comm.setCookie("__usePacket__",usePacketJson,2);
                        comm.goUrl("/pages/redPacket/usePacket.html")
                    });
                }

                //产品预售 测试时间
                //data.saleStartTime =  '2016-10-19 12:50:00'

                if( data.saleStartTime.length > 0 &&  Date.now() < new Date( data.saleStartTime.replace( /-/g,'/' ) ).getTime() ) {
                    $(".progress-bar").addClass('gray');
                    $('.product-feature p').addClass('gray');
                    //是否预售
                    self.isAdvance = true;
                    new CountDown({
                        ele: $('.footer-item.text span'),
                        saleTimeStr: data.saleStartTime,
                        nowTimeStr: data.timeNow,
                        callback: function(){
                            $('.product-feature p').removeClass('gray');
                            $('.progress-bar').removeClass('gray');
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
        data.buttonText = '购买';
        //产品年化收益
        if (data.isFlow == "1") {
            data.yearRate = data.flowMinRate.toFixed(2)
        } else {
            data.fontSize = "fontSize";
            data.marginTop = "marginTop";
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
            data.isHaveProgressClass = 'block';
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

        }else{
          //虚拟标，隐藏 剩余额度 、购买人数、产品总额
          data.virtualProduct = 'hidden';
          data.virtualProductShow = 'block'
          //首投金额
          //不显示产品购买占比
          data.isShowProgress = false;

          /*新增*/
            data.isHaveProgressClass = '';
            data.percentage = '';

        }
        var income = "";
        // 计算规则
        // 1：投资金额：机构是cps  投资金额是 10万    cpa  投资金额是机构的限购金额
        // 2：产品期限： 产品的最小期限（天）
        // 3：产品利率：产品最小利率
        // 收益=投资金额*产品期限*产品利率/360
        //1:cpa-按投资人数量进行收费 2:cps-按投资金额进行收费
        //机构收费类型为cpa,显示限购金额(首投金额)
        if(data.orgInfoResponse && data.orgInfoResponse.orgFeeType == '1'){
          data.firstBuyAmt      = data.orgInfoResponse ? data.orgInfoResponse.orgAmountLimit : '';
          data.firstBuyAmtClass = "block";
            income = (data.orgInfoResponse.orgAmountLimit * data.deadLineMinValue * data.flowMinRate/100/360).toFixed(2);
            data.incomeEvaluate = "现在投资"+parseInt(data.orgInfoResponse.orgAmountLimit/10000)+"万元,"+data.deadLineMinValue+"天后收益"+income+"元";
        }else{
            data.firstBuyAmt= "";
            data.firstBuyAmtClass = "";
            income = (100000 * data.deadLineMinValue * data.flowMinRate/100/360).toFixed(2);
            data.incomeEvaluate = "现在投资10万元,"+data.deadLineMinValue+"天后收益"+income+"元";
        }

        //产品标签
        data.redemptionText = "";

        if( data.tagList.length >=1 ) {
            data.redemptionText += data.tagList.map(function(item, index){
                if(index<3){
                    return '<span class="product-character" style="display: inline-block">' + item + '</span>'
                }
            }).join('');
        };

        if(data.tagListRightNewer.length>=1){
            data.tagListRightNewerText = data.tagListRightNewer.map(function(item,index){
                if(index<3){
                    return "<span class='tag'>"+item+"</span>";
                }
            }).join('\n');
        }else{
            data.tagListRightNewerText = "";
        }

        if(data.redemptionText == ""){
            data.redemptionClass = "hidden";
        }

        //产品售罄
        if (data.status == '2') {
            data.isShowProgress = true;
            data.percentage = "100%";
            data.gray = 'gray';
            data.buttonText = '已售罄';
            data.showSub = 'show-sub';
            data.inlineBlock = 'inline-block';
            data.investShow = "hidden";
        } else {
            data.gray = '';
        }

        //静态产品 对接
        data.orgIsstaticproduct = data.orgInfoResponse.orgIsstaticproduct;
        if(data.orgIsstaticproduct == "1"){
           $(".checkInvest").show();
        }else if(data.orgIsstaticproduct == "0"){
           $(".checkInvest").hide();
        }

        //可用红包个数
        if( data.couldUseRedPacketCounts == 0 ) {
            data.showRedpacket = 'showgray';
            data.couldUseRedPacketCounts = '没有';
        } else {
            data.couldUseRedPacketCounts += '个';
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
            // console.log(href)
            $("body").find('#buyPorductButton').trigger('click');                                 
        },
        server.error = function (msg, data) {
            loading.hide();
            comm.alert(msg);
        }
        server.send();    
    },

    //猎财“自己购买”
    setToken: function() {
        // var query = comm.getQueryString();
        // if( query.token ) {
        //     comm.setCookie("__token__",query.token,2);
        //     new backHome();
        // }else if( query.from ) {
        //     new backHome();
        // }
        if( document.referrer == '' && !native.isApp ) {
            new backHome();
        }
    },

    // 微信分享
    createWbChatApi: function (data){
        var shareData = {
            title  : data.title, // 分享标题
            desc   : data.desc, // 分享描述
            link   : location.href + '&fromApp=toobei&platform='+this.getChannel(), // 分享链接
            imgUrl : comm.getServerImg('dad370d83937e159ce9e47ed48af3183') // 分享图标
        };
        new wechatShare(shareData);
    },


    // 判断是否为微信
    getChannel : function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == "micromessenger") {
            return "wechat" ;
        }else{
            return "wap";
        }
    }
};

financing.init();
