// android与ios交互处理对象

function Native(){
	if( Native.unique ){	// 启用单例模式，保证实例为同一个
		return Native.unique;
	}
	Native.unique = this;
    this.init();
}

Native.prototype = {

	// 修正constructor
	constructor : Native,

	// 初始化
	init : function(){
		var search = location.search;
		if( sessionStorage.getItem("__AppSource__") ){
			this.source = sessionStorage.getItem("__AppSource__");
		}else{
			if( search.indexOf('channel_ios') > -1 ){	//当前环境为ios的app中
				this.source =  'ios';
			}else if( typeof AppObject == 'object' ){	//当前环境为android的app中
				this.source = 'android';
			}
			if(this.source){
				sessionStorage.setItem("__AppSource__",this.source);					
			}
		}
		if( this.source ){
			this.isApp = true;
		}
	},

	runInitFunction: function(context) {
		var self = this;
		var funArr = [].slice.call(arguments, 1);
		if( self.isApp ) {
			self.setCookie('__token__', '', -1);
			self.getAppToken(function(data){
				self.setCookie('__token__', data);
				for(var i = 0; i < funArr.length; i ++) {
					funArr[i].call(context);
				}
			});
		} else {
			for(var i = 0; i < funArr.length; i ++) {
				funArr[i].call(context);
			}
		}
	},

	// 获取app的token
	// ios中为异步执行，暂时只能采用回调函数的形式
	getAppToken : function(fn){
		this.action('getAppToken',null,fn);
	},

	//获取kind
	getAppKind: function(fn) {
		this.action('getAppKind',null,fn);
	},

	// app退出登录
	appLogOut : function(){
		this.action('getAppLogOut');
	},

	// 调用app分享功能
	appShare : function( shareData ){
		this.action('getAppShareFunction',shareData);
	},

	// 跳转到app详情页
	appProductDetail : function(data){
		this.action('getAppProductDetailFunction',data);
	},

	// 操作代理
	action : function(str,data,callback){
		var _this = this;
		var appAction = {
			android : function(){
				if( data ){	// android中如果data没有而传了，会出错
					_this.appToken  = AppObject[str]( JSON.stringify(data) );
				}else{
					_this.appToken  = AppObject[str]();
				}
    			if( typeof callback == 'function' ){
    				callback(_this.appToken);
    			}
			},
			ios : function(){
		    	_this.setupWebViewJavascriptBridge(function(bridge){
		    		bridge.callHandler(str, data, function(responseData){
		    			_this.appToken = responseData;
		    			if( typeof callback == 'function' ){
		    				callback(responseData);
		    			}
		    		});
		    	});
			}
		};

		if( this.source ){
			appAction[this.source]();
		}
	},

	// ios桥接处理
	setupWebViewJavascriptBridge : function(callback){
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
	},

	setCookie : function(name,value,expiredays){
		var d = new Date();
		d.setDate(d.getDate() + expiredays);
		document.cookie = name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + d.toGMTString())+";path=/";
	}

};

module.exports = new Native();