/**
 * @require style.css  
 */
var $            = require("zepto");
var mineApi      = require('modules/api/mineApi');
var financingApi = require('modules/api/financingApi');
var ScrollList   = require('modules/common/scrollList');
var comm = require('modules/common/common');
var tempStr1     = $("#avaiPacketList").html();
var mineApi      = require('modules/api/mineApi');

var redpacket = {
    init:function(){
        this.type = 1;
        this.usePacketJson = $.parseJSON(comm.getCookie("__usePacket__"));
        this.initEvent();
        this.renderAvaPacket();
    },
    
    /**
     * 绑定标题头部
     * @return {[type]} [description]
     */
    initEvent : function(){

    },

    /**
     * render可用红包 
     */
    renderAvaPacket:function(){
        var self = this;
        new ScrollList({
            ele : $("#avaiPacketList"),
            api : financingApi.queryAvailableRedPacket,
            isNeedToken : true,
            data:self.usePacketJson,
            dataFilter:this._filter,
            callback: this._callback.bind(self)
        });
    },

    _callback: function(arr, result) {
        var self = this;
        $('.rolling').each(function(index, obj){
            var moveLength = $(obj).width() - $(obj).parent().width();
            if( moveLength > 0 ) {
                self.rollLeft(moveLength + 30, $(obj));
            }
        });
    },

    _filter : function(arr){
        arr.forEach(function(obj,i){
            //去掉小数点
            if( obj.redpacketMoney.indexOf('.') != -1 ) {
                obj.redpacketMoney = obj.redpacketMoney.substring(0, obj.redpacketMoney.length-3);
            }
            if(obj.remark){
                obj.remarkTime = obj.remark.split(',')[0] || '';
                obj.remarkAmt = obj.remark.split(',')[1] || '';
                obj.remarkAmt = obj.remarkAmt.substring(0, obj.remarkAmt.length-2);
            }else{
                obj.remarkTime = ''     
                obj.remarkAmt  = ''                 
            }
            if(obj.redpacketType == "1"){
               obj.isActive = "active";
            }else{
               obj.isActive = "";
            }
            //首投限制
            switch (obj.investLimit) {
                case 0: obj.investLimetText = '不限';break;
                case 1: obj.investLimetText = '用户首投';break;
                case 2: obj.investLimetText = '平台首投';break;
            }

            //适用平台
            obj.platform = obj.platform || '全部平台';

            //适用产品
            switch (obj.productLimit) {
                case 0: obj.produce = '全部产品'; break;
                case 1: obj.produce = obj.productName; break;
                case 2: obj.produce = obj.deadline + '天产品'; break;
                case 3: obj.produce = obj.deadline + '天以上产品'; break;
            }
            // obj.produce += '123456789123456789123456789';
        });   
        return arr;
    },

    rollLeft: function(pos, $obj) {
        function movePos(pos) {
            $obj.animate({
                left: '-' + pos + 'px'
            },30*pos, 'linear', function(){
                $obj.css({left: 0});
            });
        }
        movePos(pos);
        setInterval(function(){
            movePos(pos);
        }, 35*pos);

    }
};

redpacket.init();
