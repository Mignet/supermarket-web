/**
 * @require loading.css
 */
var $ 	= require("zepto");
var loading = {
	template : function(){
		tempStr = '<div class="loadWrapper">'
				+'		<div class="loadContent">'
				+'			<div class="loadingBg"></div>'
				+'		</div>'			
				+'		<div class="bgmask"></div>'
				+'	</div>';
		return tempStr;
	},

    fill : function(){
		tempStr = '<div class="loadWrapper">'
		        +'      <div class="container">'
				+'			<div></div>'
				+'		    <span>'+(this.msg||'')+'</span>'	
				+'      </div>'			
				+'		<div class="loadmask"></div>'
				+'	</div>';
		return tempStr;
    },

	show: function(msg,show){
        if(show) this.msg = msg || '正在加载...';     
		$('.loadWrapper').remove();
		$('body').append(this.template());
		$('.loadWrapper').css('display','block');
	},

    tip : function(msg,show){
        if(show) this.msg = msg;     
		$('.loadWrapper').remove();
		$('body').append(this.fill());
		$('.loadWrapper').show();
    },

	hide: function(){
	    $('.loadWrapper').remove();
	}

}



module.exports = loading;