/**
 * @require style.css  
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm 	= require("modules/common/checkForm");
var service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
// var comm = new common();
var tipBox = require('modules/widget/tipBox/tipBox');


var feedback = {

	// 初始化
	init: function () {

		var _this = this;

		this.events();

		// 表单配置
		new checkForm( {
			form : $('#feedback'),
			subButton : $('#quiet'),
			success : function(formData){
				_this.sureFeedback(formData);
			}
		} );

	},

	events : function(){

		var _this = this;

		// 剩余字符统计
		var inputFeedback = $('#inputFeedback');
		var wordNum = $('#wordNum');
		inputFeedback.on('input',function(){
			var len = $(this).val().length;
			if( len <= 140 ){
				wordNum.text( 140 - len );
			}
		})

	},

	// 提交反馈
	sureFeedback: function(formData){
		var sureFeedbackService = new service();
		sureFeedbackService.data = formData;
		sureFeedbackService.data.method = mineApi.feedback;
		sureFeedbackService.success = function(result){
			var feedbackTip = new tipBox({
				msg : '提交成功。',
				callback : function(){
					comm.goUrl('more.html');
				}
			});
			feedbackTip.show();
		}
		sureFeedbackService.send();
	}


};

feedback.init();