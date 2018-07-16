
var $ = require("zepto");
var template = require('modules/common/template');
var service = require('modules/common/service');
var comm = require('modules/common/common');

// 初始化
function scrollList(options){
	for( key in options ){
		this[key] = options[key];
	}
	this.init();
};

scrollList.prototype = {
	//构造函数
	constructor : scrollList,
	//当前页数
	pageIndex : 1,
	//每页条数
	pageSize  : 10,
	//总页数
	pageCount : 1,	
	//总条数
	totalCount :0,
    
	init : function(){
		var self = this;
		
        //解绑之前绑定的scroll事件
		$(window).off('scroll');

		//ajax服务
		this.scrollService = new service();

		// 获取模板字符串
		this.temStr = this.ele.html();

		// 加载初始数据
		this.getInitData();

		//函数节流
		var throttleGetMoreData = comm.throttle(function(){
			self.getMoreData();
		}, 1500);

		// 滚动加载更多
		$(window).on('scroll',function(){			
	  		var top = $(document).scrollTop() || $('body').scrollTop();
	  		if( $(document).height()-$(window).height() - top <= 20 ){
				throttleGetMoreData();
			}
		});
	},

	getInitData : function(){
       this.pageIndex = 1;
       this.ele.html("");
       $('#listMore').remove();
       this.getData();
	},

	getMoreData : function(){
		if(this.ele.css('display') == "none") return;
		if(this.pageIndex >= this.pageCount) return;
		if( !this.totalCount ) return ;
		this.pageIndex++;
		this.getData();
	},

	getData : function(){
		var self = this;
		this.scrollService.api  = this.api; 
		this.scrollService.isNeedToken = true;
		this.scrollService.data = $.extend({}, {'pageIndex':this.pageIndex,'pageSize':this.pageSize}, this.data);
        this.removeLoadTip();	
        if(this.pageIndex > 1){
        	this.scrollService.isShowLoading = false;
			this.ele.after( '<div class="listMore scrollLoading">&nbsp;正在加载</div>' );       	
        }	
		this.scrollService.success = function(result){
            if(self.show || self.show === undefined)  self.ele.show();
		    self.removeLoadTip();				
			if(result.totalCount == 0){
				self.ele.html("");
				self.ele.after( '<div class="listEmpty">暂无查询数据</div>');
				self.render(result);
				return;				
			}
			self.totalCount = result.totalCount;			
			self.pageCount = Math.ceil(self.totalCount/self.pageSize);			
			self.render(result);
		}
		this.scrollService.error = function(msg,data){
			self.pageIndex--;
            comm.alert(msg);
		}
		this.scrollService.send();
	},

	render : function(result){
		var resultArr = result.datas;
		if($.isArray(resultArr) && resultArr.length > 0){
			if(this.dataFilter) resultArr = this.dataFilter(resultArr,result);
			this.ele.append( template.getHtml(this.temStr,resultArr));
			if(this.pageIndex >= this.pageCount || !this.totalCount){
				if(this.pageCount > 1 || !this.totalCount){
					this.ele.after( '<div class="listFull">没有更多内容</div>' );
				} 
			}else{
				this.ele.after( '<div class="listMore">上拉加载更多</div>' );
			}

		}
		if( typeof this.callback == 'function'){
			this.callback(resultArr,result);
		}
	},

	removeLoadTip : function(){
		$('.listFull').remove();
		$('.listMore').remove();
		$('.listEmpty').remove();
	}
};

module.exports = scrollList;