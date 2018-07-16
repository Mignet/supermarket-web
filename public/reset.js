// 设置页面rem大小
// 以iPhone 6s的参考宽度414为标准，html的fontsize此时为100px
;(function (win, doc) {
    var max = 414;

    var setFontSize = function () {
        var theHTML = doc.querySelector("html");
        var docWidth = doc.documentElement.clientWidth > max ? max : doc.documentElement.clientWidth;
        theHTML.style.fontSize = 100 * docWidth / max  + 'px';
    };

    win.addEventListener('resize',function(){
        setFontSize();
    });

    setFontSize();
})(window, document)


// 设置body的最小高度为可视区的高度
;(function (win, doc) {
    win.addEventListener('load',function(){
        var docHeight = doc.documentElement.clientHeight;
        var bodyHeight = doc.body.offsetHeight;
        if( bodyHeight < docHeight ){
            doc.body.style.height = docHeight + 'px';
        }
    });
})(window, document)


;(function(win,doc) {
    //用户来源统计
    if(!sessionStorage.getItem('__statistics__')){
        sessionStorage.setItem('__statistics__',true);
        sessionStorage.setItem('__href__',win.location.href);
        sessionStorage.setItem('__referer__',doc.referrer);
    }   

    var _hmt = _hmt || [];

    if(publicConfig.mode == "produce"){
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?eb0f04f6e3e81bc27e93021a1df603f3";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }

    if(publicConfig.mode == "pre"){
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?449f0c153a91ea1d44e0d5a1ba9a0110";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }    

})(window, document);  




