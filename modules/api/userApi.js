

userApi = {
	// 登录
    login : "user/login",

    // 微信登录
    weChatLogin : "user/wechat/login",

    // 发送验证码
    sendVcode : "user/sendVcode",

    // 用户注册
    register : 'user/register',

    // 重置登录密码
    resetLoginPwd : 'user/resetLoginPwd',

    // 修改登录密码
    modifyLoginPwd : 'user/modifyLoginPwd',

    // 微信分享
    wechatShare: 'user/wechat/share',

    // 用户是否注册
    checkMobile : 'user/checkMobile',

    // 获取配置信息
    getDefaultConfig  : 'client/getDefaultConfig',
    
    //下载app列表
    downloadAppList : 'app/downloadAppList',

    //领会金服登录
    jinfuLogin: 'user/jinfuLogin',

    activeToken : 'user/gesturePwdLogin',

    //保存微信ID
    saveWeiXinOpenId : 'user/saveWeiXinOpenId'

}


// 用户api
module.exports = userApi;






