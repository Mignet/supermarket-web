/**
 * @require style.css
 */


var $ = require("zepto");
var comm = require("modules/common/common");
var mineApi = require('modules/api/mineApi');
var service = require('modules/common/service');
var render = require('modules/common/render');
var tipBox = require('modules/widget/tipBox/tipBox');

var bankCardTip = new tipBox();


var bankCard = {

    // 初始化
    init: function () {
        this.initTextFile();
        this.events();
        this.getMyaccount();
        this.getWithdrawBank();
    },


    events: function () {
        var _this = this;
        // 限制最多输入两位小数
        $('body').on('input', '#inputMoney', function () {
            var v = $(this).val();
            if (isNaN(v)) {
                $(this).val('');
            } else {
                if (v.toString().indexOf('.') > -1) {
                    var arr = v.split('.');
                    if (arr[1] && arr[1].length > 2) {
                        $(this).val(arr[0] + '.' + arr[1].substring(0, 2));
                    }
                }
            }
        });


        this.inputWDPwdNum.on('input', function () {
            var val = $(this).val();
            if (/^\d{1,6}$/g.test(val)) {
                for (var i = 0; i < val.length; i++) {
                    _this.inputWDPwd.children().eq(i).text('*');
                }
                if (val.length == 6) {
                    $(this).blur();
                    _this.regPayPwd(val);
                }
            } else {
                _this.inputWDPwd.children().text('');
                $(this).val('');
            }

        });

        this.closeInputPwd.on('click', function () {
            _this.showInputWDPwd.hide();
        })

        $('#province').on('change', function () {
            if (!$(this).val()) {
                $("#city").html('<option value="">选择城市</option>');
                return;
            }
            _this.getCity($(this).val());
        });

        // 点击提现
        this.withdrawSub.on('click', function () {
            if ($(this).hasClass('disButton')) return;
            if (!$("#openBankBox").hasClass('hidden')) {
                if (!$("#openBankName").val()) {
                    bankCardTip.show('请选择开户银行');
                    return
                }
                ;
            }

            if (!$("#openAddress").hasClass('hidden')) {
                if (!$("#province").val()) {
                    bankCardTip.show('请选择省份');
                    return
                }
                ;
                if (!$("#city").val()) {
                    bankCardTip.show('请选择城市');
                    return
                }
            }

            if (!$("#openAddressInfo").hasClass('hidden')) {
                if (!$("#bankDetailAddress").val()) {
                    bankCardTip.show('请填写支行详细地址');
                    return
                }
            }

            var val = $('#inputMoney').val();

            if (!isNaN(val) && val > 0) {
                if (val >= 0.1) {
                    if (Number(val) > Number(_this.accountBalance.text())) {	// 提现金额大于余额
                        bankCardTip.show('提现金额不能超过账户余额');
                    } else {
                        _this.moneyNum.text('￥' + val);
                        _this.inputWDPwdNum.val('');
                        _this.inputWDPwd.children().text('');
                        _this.showInputWDPwd.show();
                        _this.inputWDPwdNum.focus();
                    }
                } else {
                    bankCardTip.show('提现金额不能小于0.1元');
                }
            } else {
                bankCardTip.show('提现金额输入有误');
            }
        });

        $("select").on('focus', function () {
            $(this).addClass('color');
        })
    },

    //获取账户余额
    getMyaccount: function () {
        var _this = this;
        new render({
            ele: $('#accountBalance'),
            api: mineApi.myaccount,
            isNeedToken: true
        });
    },

    //查询提现银行卡信息
    getWithdrawBank: function () {
        var self = this;
        new render({
            ele: $('#myCardInfo'),
            api: mineApi.getWithdrawBankCard,
            isNeedToken: true,
            filter: function (data) {
                if (data.limitTimes > 0) {
                    data.userOutFee = '本月还可免费提现<span class="limitColor"> ' + data.limitTimes + ' </span>次';
                    data.userOutFee2 = '本次提现免费';
                } else {
                    data.userOutFee = '本次 ' + data.fee + ' 元';
                    data.userOutFee2 = '本次 ' + data.fee + ' 元';
                }
                return data;
            },
            callback: function (data) {
                self.cardInfo = data;
                var str = data.bankCard + "";
                if (data.needkaiHuHang) {
                    var first = str.substring(0, 4);
                    var last = str.substring(str.length - 4, str.length);
                    $("#bankCardInfo").text(first + '********' + last);
                    $("#openBankBox").removeClass("hidden");
                    $("#openAddress").removeClass("hidden");
                    $("#openAddress2").removeClass("hidden");
                    $("#openAddressInfo").removeClass("hidden");
                    self.cardInfo.bankNum = last;
                    self.cardInfo.kaihuhang = data.needkaiHuHang;
                    self.getAllBankInfo();
                    self.getProvince();
                } else {
                    self.cardInfo.bankNum = str.substring(str.length - 4, str.length)
                    $("#bankCardInfo").text(data.bankName + "（尾号" + self.cardInfo.bankNum + "）");
                }
            }
        });
    },

    getAllBankInfo: function () {
        var bankServer = new service();
        bankServer.api = mineApi.queryAllBank;
        bankServer.isNeedToken = true;
        bankServer.success = function (result) {
            var arr = [];
            result.datas.forEach(function (obj, index) {
                arr.push('<option value="' + obj.bankId + ',' + obj.bankCode + ',' + obj.bankName + '">' + obj.bankName + '</option>')
            });
            $("#openBankName").append(arr.join(','));
        };
        bankServer.send();
    },

    getProvince: function () {
        var provinceServer = new service();
        provinceServer.isShowLoading = false;
        provinceServer.isNeedToken = true;
        provinceServer.api = mineApi.queryAllProvince;
        provinceServer.success = function (result) {
            var arr = ['<option value="">选择省份</option>'];
            result.datas.forEach(function (obj, index) {
                arr.push('<option value="' + obj.provinceId + '">' + obj.provinceName + '</option>');
            });
            $("#province").html(arr.join(""));
        }
        provinceServer.send();
    },

    getCity: function (value) {
        var cityServer = new service();
        cityServer.api = mineApi.queryCityByProvince;
        cityServer.isNeedToken = true;
        cityServer.data = {
            provinceId: value
        }
        cityServer.success = function (result) {
            var arr = ['<option value="">选择城市</option>']
            result.datas.forEach(function (obj, index) {
                arr.push('<option value="' + obj.cityName + '">' + obj.cityName + '</option>');
            });
            $("#city").html(arr.join(""));
            $('#city').trigger('click');
        }
        cityServer.send();
    },

    // 提现密码验证
    regPayPwd: function (pwd) {
        var _this = this;
        var regPayService = new service();
        regPayService.api = mineApi.verifyPayPwd
        regPayService.isNeedToken = true;
        regPayService.data = {pwd: pwd};
        regPayService.success = function (result) {
            if (result && result.rlt) {
                _this.inputWDPwdNum.val('');
                _this.inputWDPwd.children().text('');
                _this.showInputWDPwd.hide();
                _this.withdrawRequest();
                _this.moneyNum.text('');
            } else {
                var regPayTip = new tipBox({
                    msg: '交易密码输入有误，请重试',
                    callback: function () {
                        _this.inputWDPwdNum.val('');
                        _this.inputWDPwd.children().text('');
                        _this.inputWDPwdNum.focus();
                    }
                });
                regPayTip.show();
            }
        };
        regPayService.send();
    },

    // 提现请求
    withdrawRequest: function () {
        var _this = this;
        var isSuccessed = false;
        if (isSuccessed) return;
        isSuccessed = true;
        var regPayService = new service();
        regPayService.api = mineApi.userWithdrawRequest;
        regPayService.isNeedToken = true;
        var arr = $("#openBankName").val().split(',');
        regPayService.data = {
            amount: $('#inputMoney').val(),
            bankCard: _this.cardInfo.bankCard,
            bankId: arr.length > 1 ? arr[0] : undefined,
            bankCode: arr.length > 1 ? arr[1] : undefined,
            bankName: arr.length > 1 ? arr[2] : _this.cardInfo.bankName,
            city: $('#city').val(),
            kaihuhang: $("#bankDetailAddress").val().trim()
        };

        regPayService.success = function (result) {
            isSuccessed = false;
            if (regPayService.data.kaihuhang) {
                _this.cardInfo.kaiHuHang = regPayService.data.kaihuhang;
                _this.cardInfo.bankName = arr[2];
            }
            var nextData = $.extend({}, regPayService.data, _this.cardInfo);
            sessionStorage.setItem('withdrawInfo', JSON.stringify(nextData));
            comm.goUrl('withdrawSucc.html');
        }

        regPayService.error = function (msg, data) {
            isSuccessed = false;
            comm.alert(msg);
        }
        regPayService.send();
    },

    initTextFile: function () {
        this.cardInfo = {};
        this.myAccount = $('#myAccount');
        this.myCardWrap = $('#myCardWrap');
        this.inputMoney = $('#inputMoney');
        this.withdrawSub = $('#withdrawSub');
        this.getTime = $('#getTime');
        this.accountBalance = $('#accountBalance');
        this.showInputWDPwd = $('#showInputWDPwd');
        this.inputWDPwdNum = $('#inputWDPwdNum');
        this.inputWDPwd = $('#inputWDPwd');
        this.closeInputPwd = $('#closeInputPwd');
        this.moneyNum = $('#moneyNum');
        this.inputMoney.val('');
        this.inputWDPwdNum.val('');
        this.inputWDPwd.children().text('');
    }

};

bankCard.init();
