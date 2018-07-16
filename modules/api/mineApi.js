

mineApi = {
	//我的
	minePage      : 'personcenter/homepage',

    //未读公告通知
	unreadCount   : 'msg/person/unreadCount',

    //公告
	bulletinList  : 'msg/bulletin/pageList',

    //公告详情
    noticeDetail: 'msg/notice/detail',

    //通知
	personList    : 'msg/person/pageList',
	
    //通知设置已读
    readed        : 'msg/person/readed',

    //通知全部设置已读
    allReaded     : 'msg/person/allReaded',
    
    //公告设置已读
    noticeReaded :  'msg/notice/detail' ,

    //公告全部设置已读
    noticeAllReaded     : 'msg/notice/allReaded',

    //是否实名认证
	personAuthenticate  : 'account/personcenter/setting',
 
 	//是否设置交易密码
	verifyPayPwdState : 'account/verifyPayPwdState',

    //平台管理
	platfromManager : 'platfrom/accountManager/pageList',

    //绑定平台统计
    platormStatistics  : 'platfrom/accountManager/statistics',

    //检查是否有注册第三方账户
    isBindOtherOrg : 'platfrom/isBindOrgAcct',

    //绑定第三方账户
    bindOrgAcct :'platfrom/bindOrgAcct',
    
    //获取第三方购买路径
    getOrgProductUrl : 'platfrom/getOrgProductUrl',
    
    //获取第个人中心路径
    getOrgUserCenterUrl : 'platfrom/getOrgUserCenterUrl',  

    //是否第三方老用户
    isExistInPlatform : 'platfrom/isExistInPlatform',  

    //投资记录
	customerInvestRecord : 'investRecord/customer/investRecord',

    // 投资其他
    customerOtherInvestRecord:'investRecord/customer/unRecordInvestList',

    //统计数目
    customerInvestRecordCounts:'investRecord/customer/investRecordCounts',

    //验证支付密码
	verifyPayPwd : 'account/verifyPayPwd',

    //修改支付密码
	modifyPayPwd : 'account/modifyPayPwd',

    //重置交易密码验证身份证
    verifyIdCard : 'account/verifyIdCard',

    //重置交易密码验证身份证
    resetPayPwd : ' account/resetPayPwd',   
    
    //重置支付密码-点击手机发送验证码
    sendVcode:'account/sendVcode', 

    //重置支付密码-输入手机验证-已实现
    inputVcode:'account/inputVcode', 

	//小金库账户
	account : 'account/myaccount',

	//我的理财师
	minePlanner : 'user/mycfp',

	//理财师推荐产品列表
	recdProductPageList : 'product/recdProductPageList',

    //理财师推荐平台
    queryPlannerRecommendPlatfrom: 'platfrom/queryPlannerRecommendPlatfrom',

    //红包
	queryRedPacket : 'redPacket/queryRedPacket',

	//邀请有理
	invitation : 'invitation/customer/homepage',
    
    //邀请列表
	invitationList : 'invitation/investor/pageList',

    //邀请统计
	invitationstatistics: 'invitation/investor/statistics',

    // 微信分享
    wechatShare : 'invitation/wechat/share',
    
    //获取系统默认信息
    defaultConfig : 'app/default-config',

    // 退出登录
    logout : "user/logout",
    
    //已经反馈
    feedback : "app/suggestion",
    
    //账户明细
    accountDetailList : 'account/myaccountDetail/pageList',

    //账户提现记录
    withdrawHistory : 'account/queryWithdrawLog',
    
    //提现累计
    withdrawSummary : 'account/getWithdrawSummary',
    
    //查询银行
    queryAllBank : 'account/queryAllBank',
    
    //添加银行卡
    addBankCard : 'account/addBankCard',
    
    //查询用户办卡信息
    getUserBindCard : 'account/getUserBindCard',
    
    //设置支付密码
    initPayPwd      : 'account/initPayPwd',
    
    //我的账户
    myaccount : 'account/myaccount',
    
    //提现银行卡信息
    getWithdrawBankCard : 'account/getWithdrawBankCard',

    //查询省份
    queryAllProvince : 'account/queryAllProvince',
    
    //查询城市
    queryCityByProvince : 'account/queryCityByProvince',
    
    //提现
    userWithdrawRequest : 'account/userWithdrawRequest',

    //我的在投金额
    myCurrInvestAmount :'personcenter/myCurrInvestAmount',

    //用户投资收益
    investProfit : "investRecord/customer/investProfit",

    //T呗奖励余额
    getAccountBalance :"account/getAccountBalance",

    // T呗奖励明细
    queryRewardDetail:"account/queryRewardDetail",

    // 我的投资记录
    myInvestrecord : 'productinvestrecord/myInvestrecord'
}

module.exports = mineApi;






