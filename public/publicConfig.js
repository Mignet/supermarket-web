// 公共配置文件


var publicConfig  = (function(){

    var config = {

        // 开发模式( dev:开发环境，pre:测试环境，produce:生产环境)
        mode : 'produce',

        // 默认开启调试模式
        debug : true,

        //  根目录变量，用于后期可能的子目录
        root : '/',

        // 版本号，解决缓存问题（每次有更改文件需更新版本号）
        version: '2.0.32'
    };

    // 接口主机地址
    var host = {
        //开发环境
        dev  : 'devmarket.toobei.com',
        // 测试环境
        pre  : 'premarket.toobei.com',
        // 生产环境
        produce : 'market.toobei.com'
    };

    //网址地址
    var static = {
        //开发环境
        dev  : 'dev.toobei.com',
        // 测试环境
        pre  : 'pre.toobei.com',
        // 生产环境
        produce : 'www.toobei.com'
    }

    var imgHost = {
        dev     : 'preimage.toobei.com',
        pre     : 'preimage.toobei.com',
        produce : 'image.toobei.com'
    }

    var buyHost = {
        dev     : 'prebuy.toobei.com/app',
        pre     : 'prebuy.toobei.com/app',
        produce : 'buy.toobei.com/app'        
    }

    // http协议名
    var httpProtocol = { https : 'https://'}

    var hostPostfix = '/rest/api/';

    // 默认https协议
    config.serverUrl = httpProtocol.https + host[config.mode] + hostPostfix;

    //默认img server
    config.imageUrl = httpProtocol.https + imgHost[config.mode] + '/';

    //注册图片验证码用
    config.host = httpProtocol.https + host[config.mode];

    //跳转第三方机构辅助服务
    config.buyHost = 'http://' + buyHost[config.mode] + '/';

    // 生产环境则关闭调试模式
    if( config.mode == 'produce' || config.mode == 'pre'){
      // 生产环境关闭调试模式
      config.debug = false;
      config.root  = '/app/';
    }

    //微信跳转用
    config.static = httpProtocol.https + static[config.mode] + config.root;

    // 返回最后配置对象
    return config;

})();
