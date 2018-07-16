/**
 * @require style.css
 */
var $ = require("zepto");
function toolbar(n){
    if( toolbar.unique ){	// 启用单例模式，保证实例为同一个
        return toolbar.unique;
    }
    toolbar.unique = this;
    this.create(n);
}

toolbar.prototype = {

    // 修正constructor
    constructor : toolbar,

    // toolbar id
    id : 'toolbar',

    // 当前class
    currentClass : 'current',

    create : function(n){
            n = n || 0;
            if( $( '#' + this.id ).size() < 1 ){
                $('body').append( this.htmlStr() );
                this.bindEvent();
            }
            this.ele = $( '#' + this.id );


            this.ele.find('li').eq(n).addClass(this.currentClass);
            this.ele.show();
            // 保持元素在可视区底部
            var _this = this;
            $(window).on('scroll',function(){
                    _this.ele.css('bottom',0);
            })

    },

	// 模板
	htmlStr : function(){
		var str	='<div class="ios-fixed-hack"></div>'
				+'<div class="toolbar" id="' + this.id + '">'
				+	'<ul>'
				+		'<li>'
				+			'<a data-href="__root__index.html">推荐</a>'
				+		'</li>'
				+		'<li>'
				+			'<a data-href="__root__pages/financing/manageMoney.html">产品</a>'
				+		'</li>'
				+		'<li>'
				+			'<a data-href="__root__pages/organization/organization.html">平台</a>'
				+		'</li>'
				+		'<li>'
				+			'<a data-href="__root__pages/mine/mine.html">我的</a>'
				+		'</li>'
                +		'<li>'
                +			'<a data-href="__root__pages/download/download.html">下载APP</a>'
                +		'</li>'
				+	'</ul>'
				+'</div>';
		return str;
	},

    /**
     * 这里的a标签在（特指：安卓）微信上有时不能触发跳转，
     * 所以在后面加时间戳~
     * @return {[type]} [description]
     */
    bindEvent : function(){
        $(".toolbar a").on('click',function(){
           if((publicConfig.mode == 'produce' || publicConfig.mode == 'pre') && $(this).data('href')=="/index.html"){
               location.href= publicConfig.root+"?r="+Date.now();     
           }else{
               location.href= $(this).data('href')+"?r="+Date.now();     
           }
        })
    }
}

module.exports = toolbar;
