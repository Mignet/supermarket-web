# 金融超市

项目目录结构说明

1、modules	模块目录
	——api			接口地址
	——common		公共模块
		——ajax				AJAX底层封装类
		——checkForm			表单功能封装类
		——common			公共函数类
		——render			模板渲染类
		——scrollList		列表滚动加载类
		——service			ajax进一步封装类，实际ajax请求统一使用该类
		——template	        模板替换对象
		——wechatShare		微信分享类
	——library		第三方库，暂时只用到zepto
	——widget		组件模块

2、pages	页面目录
	——模块目录
		——html文件
		——html对应js及css文件目录

3、public	公共js文件

4、static	    静态文件目录
	——css 		公共样式文件
	——public	通用样式
	——reset	    初始化样式
	——images 	图片文件
	——svg 		svg文件

5、index		首页

6、fis-config	fis3构建配置文件
