/**
 * @require style.css
 */

var $ = require("zepto");
var comm = require("modules/common/common");
var service = require('modules/common/service');

var newhand = {
    init: function() {
        this.bindEvent();
        this.getNewhandStatus();
    },

    bindEvent: function() {
        $('.new-hand-btn').on('click', '.complete', function(e){
            return false;
        });
    },

    getNewhandStatus: function() {
        if( !comm.getCookie('__token__') ) return ;
        var Service = new service();
        Service.api = 'investornewcomertask/newcomerWelfare';
        Service.isNeedToken = true;
        Service.success = function(data){
            //完成状态
            var tmpArr = [];
            tmpArr.push(data.registerStatus);
            tmpArr.push(data.bindCardStatus);
            tmpArr.push(data.firstInvestStatus);
            tmpArr.push(data.inviteCustomerStatus);
            var tmpCount = 0;
            tmpArr.forEach(function(item, index){
                if( item == '1' ) {
                    //按钮状态
                    $('.new-hand-btn a').eq(index).addClass('complete');
                    //红包状态
                    $('.new-hand-redpack li').eq(index).find('.redpack').hide().parent().find('.open-redpack').show();
                    //竖线进度
                    $('.new-hand-dot li').eq(index).addClass('complete');
                    tmpCount ++;
                }
            });

            for(var i = 0; i < tmpCount; i ++) {
                //横线点
                $('.new-hand-row-dot li').eq(i).addClass('complete');
                //横线
                if( i > 0 ) {
                    $('.new-hand-row-line li').eq(i-1).addClass('complete');
                }
            }

            //金额
            $('.registerAmount').text(data.registerAmount);
            $('.bindCardAmount').text(data.bindCardAmount);
            $('.firstInvestAmount').text(data.firstInvestAmount);
            $('.inviteCustomerAmount').text(data.inviteCustomerAmount);
        }
        Service.send();
    }
};

newhand.init();