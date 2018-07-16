var $ = require("zepto");
var tipBox = require('modules/widget/tipBox/tipBox');

// 公共对象
function commom() {
    if (commom.unique) {	// 启用单例模式，保证实例为同一个
        return commom.unique;
    }
    commom.unique = this;
    this.init();
}

// 公共对象
function commom() {
    if (commom.unique) {	// 启用单例模式，保证实例为同一个
        return commom.unique;
    }
    commom.unique = this;
    this.init();
}

commom.prototype = {

    // 修正constructor
    constructor: commom,

    // 初始化
    init: function () {
        this.clearCache();
    },

    getServerImg: function (str, isPng) {
        if( isPng == undefined ) {
            isPng = true;
        }
        var pngStr = '';
        if( isPng ) {
            pngStr = '?f=png';
        }
        var config = sessionStorage.getItem('__serverDefaultConfig__');
        if (config) {
            return JSON.parse(config).img_server_url + str + pngStr;
        } else {
            return publicConfig.imageUrl + str + pngStr;
        }
    },

    // 跳转代理,flg为true则采用根绝对路径
    goUrl: function (url, flg) {
        if(url.indexOf('?') > -1){
            url = url + '&v='+Date.now();
        }else{
            url = url + '?v='+Date.now();
        }
        if (flg) {
            location.href = publicConfig.root + url;
        } else {
            location.href = url;
        }
    },

    // 调试模式数据输出
    log: function (msg) {
        if (publicConfig.debug && window.console) {
            console.log(msg);
        }
    },

    // 弹出提示信息
    alert: function (msg) {
        if (!this.tip) {
            this.tip = new tipBox();
        }
        this.tip.show(msg);
    },

    // 判断是否为微信
    isWebChat: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    //获取url中search部分字符串为json对象
    getQueryString: function (search) {
        var url = search || location.search;
        var request = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            arr = str.split("&");
            for (var i = 0; i < arr.length; i++) {
                request[decodeURIComponent(arr[i].split("=")[0])] = arr[i].split("=")[1];
            }
        }
        return request || {};
    },

    // 替换字符串中间字符为*号
    // start开头显示字符个数
    // end结束显示字符个数
    hideMiddleStr: function (str, start, end) {
        var str = str.toString();
        var start = start || 3;
        var end = end || 4;
        var len = str.length - start - end;
        var hideStr = '';
        for (var i = 0; i < len; i++) {
            hideStr += '*';
        }
        return str.substring(0, start) + hideStr + str.substring(str.length - end, str.length);
    },

    hideName:function(val){
        if(!val) return ;
        if(val=="undefined" || val == "null") return;
        if(val.length <= 2){
            val = val.substr(0,1) + "*";
        }else {
            var points = "";
            for(var i=0;i<val.length;i++){
                if (i != 0 && i != val.length-1) {
                    points += "*";
                }
            }
            val = val.substr(0,1) + points + val[val.length-1];
        }
        return val;
    },

    // 截取数字两位小数
    toDecimal: function (num, flg, decimal) {
        var decimal = decimal || 2;
        var thePow = Math.pow(10, decimal);
        var theNum = Math.floor(num * thePow) / thePow;
        if (flg) {	// 不多于两位
            return theNum;
        } else {	// 强制为两位
            return theNum.toFixed(decimal);
        }
    },

    // 数字转换为万及亿
    changeBigData: function (num) {
        // 剩余额度转换
        if (num >= 1000000) {
            if (num >= 100000000) {
                num = this.toDecimal(num / 100000000) + '亿';
            } else {
                num = this.toDecimal(num / 10000) + '万';
            }
        }
        return num;
    },

	addVersion: function(href) {
    	if( href.indexOf('tel:') == 0 || href.indexOf('mailto:') == 0 ) {
    		return href;
		}

		if( href.indexOf('?') != -1 ) {
			href += '&version=' + publicConfig.version;
		} else {
			href += '?version=' + publicConfig.version;
		}
		return href;
	},

    throttle: function (fn, wait) {
        var last = 0;
        return function(){
            var curr = +new Date()
            if (curr - last > wait){
                fn.apply(this, arguments);
                last = curr;
            }
        }
    },

    /*
    * 回到顶部
    */
    backTop: function () {
        var self = this;
        // 回到顶部点击事件
        $('.toolbar-top').on('click', function () {
            $('body').scrollTop(0);
        })

        /*回到顶部图标显示*/
        $(document).scroll(self.throttle(function () {
            var scrollTop = $('body').scrollTop();
            if (scrollTop >= 900) {
                $('.toolbar-top').show();
            } else {
                $('.toolbar-top').hide();
            }
        }, 500));
    },
    // 清除缓存
    clearCache: function () {
        var self = this;
        var localVersion = this.getCookie('__version__');
        if (localVersion == publicConfig.version) {
            //版本已是最新
        } else {
            this.isClearCache = true;
            this.setCookie('__version__', publicConfig.version);
        }

        //清缓存
        if (this.isClearCache) {
            $('html').attr('manifest', 'IGNORE.manifest');
            $('head').append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />');
            $('head').append('<meta http-equiv="Pragma" content="no-cache" />');
            $('head').append('<meta http-equiv="Expires" content="0" />');
        }

        //清缓存
        $(document).on('click', 'a', function (e) {
            var href = $(this).attr('href');
            if (href) {
                href = self.addVersion(href);
                location.href = href;
                return false;
            }
        });
    },

    setCookie : function(name,value,expiredays){
        var d = new Date();
        d.setDate(d.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires=" + d.toGMTString())+";path=/";
    },

    getCookie : function (name){
        if (document.cookie.length > 0){
            var start = document.cookie.indexOf(name + "=")
            if (start != -1){ 
                start = start + name.length + 1; 
                var end = document.cookie.indexOf(";" , start);
                if (end == -1){
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(start,end));
            } 
        }     
        return '';
    },

    /**
     * 跳转绝对路径，获取微信CODE
     * @param url 跳转路径
     */
    goRealUrl : function(url) {

        if( this.isWebChat() ) {
            var realUrl = publicConfig.static + url;
            var targetUrl = 'https://www.toobei.com/app/get-weixin-code.html?appid=wx4ddbb3a6f5a7cec0&redirect_uri=' + encodeURIComponent(realUrl) + '&scope=snsapi_base&state=1#wechat_redirect'
            this.goUrl(targetUrl);
        } else {
            this.goUrl(url, true);
        }

    }

}

module.exports = new commom();






