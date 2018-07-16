
organizationApi = {

	//筛选条件
	platformHead           : 'platfrom/platformHead',

	 //机构列表
	'platfromList'         : 'platfrom/pageList',

	 //机构详情
	'platfromDetail'       : 'platfrom/detail',

	 //机构在售产品
	'productPageList' : 'product/productPageList',

	//是否实名验证
    personAuthenticate  : 'account/personcenter/setting',

    //检查是否有注册第三方账户
    isBindOtherOrg : '/platfrom/isBindOrgAcct',

    //绑定第三方账户
    bindOrgAcct :'/platfrom/bindOrgAcct',
    
    //获取第三方购买路径
    getOrgProductUrl : '/platfrom/getOrgProductUrl',
    
    //获取第个人中心路径
    getOrgUserCenterUrl : '/platfrom/getOrgUserCenterUrl',

    //广告查询
    adQuery:'homepage/advs',

    //查询机构动态信息
    queryOrgDynamicInfo:'platfrom/queryOrgDynamicInfo'
}

module.exports = organizationApi;