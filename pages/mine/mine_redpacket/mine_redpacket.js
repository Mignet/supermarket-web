/**
 * @require style.css  
 */
var $            = require("zepto");
var mineApi      = require('modules/api/mineApi');
var ScrollList   = require('modules/common/scrollList');
var tempStr1     = $("#avaiPacketList").html();
var tempStr2     = $("#usedPacketLis").html();
var tempStr3     = $("#expiredPacketList").html();

var redpacket = {
	init:function(){
		this.type = 1;
		this.initEvent();
        this.renderAvaPacket();
	},
    
    /**
     * 绑定标题头部
     * @return {[type]} [description]
     */
	initEvent : function(){		
		var self = this;
		$(".redpacketnav a").on('click',function(e){
            $(".redpacketnav a").removeClass('act');
            $(e.target).addClass('act');
	        $(".packetList section").hide();
	        var index = + $(this).data('value');
	        $(".packetList section").eq(index-1).show();
            self.type = index;
            if(index == 1) {
            	$("#avaiPacketList").html(tempStr1);
            	self.renderAvaPacket();
            }else if(index == 2){
            	$("#usedPacketLis").html(tempStr2);
				self.renderUsedPacket();
            }else{
            	$("#expiredPacketList").html(tempStr3);
            	self.renderExpirePacket();
            }
		});
	},

    /**
     * render可用红包 
     */
	renderAvaPacket:function(){
		var self = this;
        new ScrollList({
        	ele : $("#avaiPacketList"),
        	api : mineApi.queryRedPacket,
        	isNeedToken : true,
        	data:{
        		type:this.type
        	},
        	dataFilter:this._filter,
			callback: this._callback.bind(self)
        });
	},	

    /**
     * render 已使用红包
     */
	renderUsedPacket:function(){
		var self = this;
        new ScrollList({
        	ele : $("#usedPacketLis"),
        	api : mineApi.queryRedPacket,
        	isNeedToken : true,
        	data:{
        		type:this.type
        	},
        	dataFilter:this._filter,
			callback: this._callback.bind(self)
        });
	},

	/**
     * render 已使用红包
     */
	renderExpirePacket:function(){
		var self = this;
        new ScrollList({
        	ele : $("#expiredPacketList"),
        	api : mineApi.queryRedPacket,
        	isNeedToken : true,
        	data:{
        		type:this.type
        	},
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
		// var move = $('.rolling').width() - $('.rolling').parent().width();
		// if( move > 0 ) {
		//
		// }
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
				case 1: obj.investLimetText = '用户首次投资';break;
				case 2: obj.investLimetText = '平台首次投资';break;
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
