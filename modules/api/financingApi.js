

financingApi = {
    //获取机构banner
    banners : "homepage/banners",

    //获取首页banner
    newbanners : "homepage/advs",
    
    //获取优质平台
    organization : 'platfrom/highQualityPlatform',
    
    //热门产品列表
    hotProduct : 'product/hotProduct',

    //产品列表
    productPageList : 'product/productPageList',
    
    //产品详情
    productDetail : 'product/productDetail',
    
    //是否实名验证
    personAuthenticate  : 'account/personcenter/setting',
    
    //获取用户信息
    getUserInfo : 'user/getUserInfo', 

    // 产品分类统计
    productClassifyStatistics:'product/productClassifyStatistics',

    // 产品分类统计2.0.1
    productClassifyStatistics201:'product/productClassifyStatistics/2.0.1',

    //产品分类列表
    productClassifyPagelist:'product/productClassifyPageList',

    //产品分类列表2.0.1
    productClassifyPagelist201:'product/productClassifyPageList/2.0.1',

    //理财师热推
    hotRecommendProductListTop201: 'product/hotRecommendProductListTop/2.0.1',

    //产品分类优选
    productClassifyPreference : 'product/productClassifyPreference/2.0.1',
    
    //默认配置
    defaultConfig : 'app/default-config',

    //检查是否有注册第三方账户
    isBindOtherOrg : 'platfrom/isBindOrgAcct',

    //绑定第三方账户
    bindOrgAcct :'platfrom/bindOrgAcct',

    //是否第三方老用户
    isExistInPlatform : 'platfrom/isExistInPlatform',
    
    //获取第三方购买路径
    getOrgProductUrl : 'platfrom/getOrgProductUrl',
    
    //获取第个人中心路径
    getOrgUserCenterUrl : 'platfrom/getOrgUserCenterUrl',

    //投资攻略
    investmentStrategy  : "platfrom/investmentStrategy",

    //可用红包
    queryAvailableRedPacket : "redPacket/queryAvailableRedPacket"
}

// 用户api
module.exports = financingApi;
