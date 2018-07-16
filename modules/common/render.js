
var $ 	= require("zepto");
var template = require('modules/common/template');
var service = require('modules/common/service');

// 模板渲染类
	// ele：模板元素
	// isList：是否为列表类型
	// data：ajax所需数据
	// filter：渲染前对的处理
	// callback：渲染完成后的操作
function render(options){
	// console.log(options)
	for( key in options ){
		this[key] = options[key];
	}
	this.init();
}

render.prototype = {

	// 修正constructor
	constructor : render,

	// 是否为列表类型
	isList : false,

	// 是否自动隐藏与展示模板
	isAutoShow : true,

	//已有数据
	isLocalData: null,

	// 请求数据
	init : function(){
		// 获取模板字符串
		this.temStr = this.ele.html();
		if( this.isAutoShow ){
			this.ele.hide();
		}
		if( this.isLocalData ) {
			this.madeHtml(this.isLocalData);
		} else {
			var _this = this;
			var renderService  = new service();
			renderService.api  =  this.api;
			renderService.data = this.data;
			renderService.isNeedToken = this.isNeedToken || false;
			renderService.isShowLoading = this.isShowLoading || true;
			renderService.success = function(result){
				_this.madeHtml(result);
			}
			renderService.send();
		}

	},

	// 生成html
	madeHtml : function(result){
		var data = result;
		if( this.isList ){
			data = result.datas;
		}
		
		if( this.filter ){	// 数据渲染前处理
			data = this.filter(data);
		}

		this.ele.html( template.getHtml(this.temStr,data) );

		if( this.isAutoShow ){
			this.ele.show();
		}

		if( this.callback ){	//数据渲染后处理
			this.callback(result);
		}	
	}
}

// 公共配置文件
module.exports = render;






