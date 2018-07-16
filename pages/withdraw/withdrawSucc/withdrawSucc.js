/**
 * @require style.css  
 */


var $ 			= require("zepto");
var comm 		= require("modules/common/common");
// var comm = new common();

var withdrawSucc = {

	// 初始化
	init: function () {
		var temWrap = $('#myCardInfo');
		var cardInfo = JSON.parse(sessionStorage.getItem('withdrawInfo'));
		var list = $('#myCardInfo .inputWraper');
		if( cardInfo ){
			list.eq(0).html(cardInfo.bankName + ' 尾号' + cardInfo.bankNum);
			list.eq(1).html(cardInfo.kaiHuHang);
			list.eq(2).html(getTwiceNum(cardInfo.amount));
			list.eq(3).html(cardInfo.paymentDate);
			list.eq(4).html(cardInfo.userOutFee);
			temWrap.show();
		}

		function getTwiceNum(num){
			num = num.toString();
			var arr = num.split('.');
			if( arr.length == 1 ){
				return num + '.00';
			}else{
				return Number(num).toFixed(2)
			}
		}

	}
};

withdrawSucc.init();
