/**
 * @require style.css  
 */

var $ = require('zepto');
var mineApi = require('modules/api/mineApi');
var ScrollList = require('modules/common/scrollList');
var comm = require("modules/common/common");
var Render = require('modules/common/render');
var Service = require('modules/common/service');
var Chart = require('modules/widget/chart/chart');
var template = $('#content-box').html();
var otherTemplate = $('#other-box').html();

var investment = {
    init: function() {
        this.status = 1;
        this.query = comm.getQueryString();
        $("#acc_income").text(this.query.totalProfit)
        document.title = decodeURIComponent(this.query.title) || "投资明细";//路径来源不同,标题不同
        $("#investmentPlatform").attr('href', './mine_platform.html?investAmount=' + this.query.investAmount + '&totalProfit=' + this.query.totalProfit);
        this.renderTotalCount();
        this.bindEvent();
        this.getInvestProfit();
    },

    bindEvent: function() {
        var self = this;
        $(".tab div").on('click', function() {
            $(this).siblings().find('a').removeClass('active');
            $(this).find('a').addClass('active');
            self.status = $(this).data('status');
            if ($(this).index() < 3) {
                $('#content-box').html(template);
                self.renderPage();
                $("#content-box").removeClass('hidden');
                $("#other-box").addClass('hidden');
            } else if ($(this).index() >= 3) {
                $('#other-box').html(otherTemplate);
                self.renderOtherPage();
                $("#other-box").removeClass('hidden')
                $("#content-box").addClass('hidden');

            }
        })

        $('#content-box').on('click', 'li', function() {
            self.orgNumber = $(this).data('orgnumber');
            self.orgName = $(this).data('orgname');
            self.goPersonalCenterPage();
        })

        $('#other-box').on('click', 'li', function() {
            location.href = $(this).data('href');
        })
    },
    //获取用户投资收益
    getInvestProfit:function(){
        var self = this;
        var service = new Service;
        service.api = mineApi.investProfit;
        service.isNeedToken = true;
        service.success = function(result){
            var profit_arr = [];
            var keyArr = [];
            var color_arr = ["#7ccdf8", "#f7da94","#f99186","#a5eea5"];
            for(key in result){
                $("#"+key).text(result[key]);
                if(self.query.totalProfit == 0){
                    profit_arr.push("0");
                }else{
                    profit_arr.push((result[key]/(self.query.totalProfit)).toFixed(2));
                }
                keyArr.push(key);
            }
            for(var i =0;i<profit_arr.length;i++){
                $("#"+keyArr[i]).prev().css('backgroundColor', color_arr[i]);
            }
            new Chart({
                ele:$(".chart_content"),
                data_arr : profit_arr,
                color_arr : color_arr,
            })
        };
        service.send();
    },
    renderPage: function() {
        var _this = this;
        new ScrollList({
            ele: $('#content-box'),
            api: mineApi.customerInvestRecord,
            isNeedToken: true,
            data: {
                status: this.status
            },
            dataFilter: this._filter,
            callback: function(data){
                if( data.length == 0 ) {
                    $('footer').hide();
                } else {
                    $('footer').show();
                }
            }
        });
    },

    _filter: function(arr) {
        arr.forEach(function(obj, index) {
            //产品期限
            var arr = obj.day.split(',');
            //固定期限
            if (arr.length == 2) {
                obj.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>';
            }
            //浮动期限
            if (arr.length == 4) {
                obj.deadLineText = arr[0] + '<span class="unit">' + arr[1] + '</span>~' + arr[2] + '<span class="unit">' + arr[3] + '</span>';
            }
            obj.investAmount = obj.investAmount.toFixed(2);
            obj.profit = obj.profit.toFixed(2);
        });
        return arr;
    },

    renderTotalCount: function() {
        var self = this;
        var service = new Service();
        service.api = mineApi.customerInvestRecordCounts;
        service.isNeedToken = true;
        service.success = function(response) {
            $.each(response, function(key, value) {
                for (var i = 0; i < $(".investNum").length; i++) {
                    if ($(".investNum").eq(i).attr("id") == key) {
                        $(".investNum").eq(i).text(value)
                    }
                }
            })
            var selector = "";
            if(response["tzz"] > 0){
                selector = "#tzz";
                self.status = 1;
                self.renderPage();
            }else if(response["hkz"] > 0){
                selector = "#hkz";
                self.status = 2;
                self.renderPage();
            }else if(response["hkwc"] > 0){
                selector = "#hkwc";
                self.status = 3 ;
                self.renderPage();
            }else if(response["qt"] > 0){
                selector = "#qt";
                self.renderOtherPage();
            }else{
                selector = "#tzz";
                self.status = 1;
                self.renderPage();
            }
            $(selector).parent().addClass('active');
        }
        service.send();
    },

    // 其他
    renderOtherPage: function() {
        var _this = this;
        new ScrollList({
            ele: $('#other-box'),
            api: mineApi.customerOtherInvestRecord,
            isNeedToken: true,
            callback: function(data){
                if( data.length == 0 ) {
                    $('footer').hide();
                } else {
                    $('footer').show();
                }
            }
        });
    },

    //获取第三方跳转路径
    goPersonalCenterPage: function() {
        var self = this;
        var server = new Service();
        server.api = mineApi.getOrgUserCenterUrl;
        server.async = false;
        server.data = {
            'orgNo': self.orgNumber
        };
        server.success = function(data) {
            var arr = [];
            for (attr in data) {
                if (attr == 'orgUsercenterUrl') {
                    arr.push(attr + '=' + data[attr].replace('=', '?equals?'));
                } else {
                    arr.push(attr + '=' + data[attr]);
                }
            }
            var href = publicConfig.buyHost + 'personal.html?orgName=' + self.orgName + '&' + arr.join('&');
            $("body").find('#personalCenterButton').remove();
            $("body").append("<a id='personalCenterButton' style='display:none' href='" + href + "'></a>");
            $("body").find('#personalCenterButton').trigger('click');
        },
        server.error = function(msg, data) {
            loading.hide();
            comm.alert(msg);
        }
        server.send();
    }
}

investment.init();
