/**
 * @require style.css
 */

var $ 			= require("zepto");
var comm 		= require("modules/common/common");
var checkForm 	= require("modules/common/checkForm");
var Service 	= require('modules/common/service');
var mineApi 	= require('modules/api/mineApi');
var tipBox      = require('modules/widget/tipBox/tipBox');


var feedback = {
	init: function () {
		var _this = this;
		this.bindEvent();
	},

    bindEvent : function(){
    	var self = this;
        $('#inputFeedback').on('input',function(){
			var len = $(this).val().length;
			if( len <= 200 ){
				$("#wordNum").text( 200 - len );
			}
        })

        $("#quiet").on('click',function(){
        	var str = $('#inputFeedback').val().trim();
        	if(str.length == 0) return;
            self.sureFeedback(str);
        });
    },


	// 提交反馈
	sureFeedback: function(str){
		var sureFeedbackService = new Service();
		sureFeedbackService.data = {
			'content' : str
		};
		sureFeedbackService.api = mineApi.feedback;
		sureFeedbackService.isNeedToken = true;
		sureFeedbackService.success = function(result){
			var feedbackTip = new tipBox({
				msg : '提交成功。',
				callback : function(){
					comm.goUrl('about.html');
				}
			});
			feedbackTip.show();
		}
		sureFeedbackService.send();
	}
};

feedback.init();
