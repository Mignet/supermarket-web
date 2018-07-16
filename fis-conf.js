/****************模块化处理***************/
// 模块化设置
// npm install [-g] fis3-hook-module
// mode: 模块化类型(AMD,CDM, CommandJs)
// baseUrl: 基础路径,模块路径均基于此路径（包括页面require路径）
// paths: 配置别名,基于baseUrl
fis.hook('module', {
    mode: 'commonJs',
    paths: {
      modules : "/modules",
	    zepto: "/modules/library/zepto"
	}
});


// modules目录下的js文件均采用模块化包装
// 自动包裹define
fis.match('/modules/**.js', {
    isMod: true
});

// pages目录下的js文件均采用模块化包装
// 自动包裹define
fis.match('/pages/**.js', {
    isMod: true
});


// 根据资源依赖表，加资源载到页面上
// npm install -g fis3-postpackager-loader
// 解析require需开启改插件,fis3 不在默认支持解析js中的require
fis.match('::package', {
  postpackager: fis.plugin('loader', {
     allInOne: true  // 基于页面零散资源合并
  })
});



/****************资源合并处理***************/
// 公共js资源合并
fis.match('/public/**.js', {
  packTo: 'public/public_merge.js'
});

// 第三方js库资源合并
fis.match('/modules/library/**.js', {
  packTo: 'modules/library/librarys_merge.js'
});

// 常用js资源合并
fis.match('/modules/common/**.js', {
  packTo: 'modules/common/common_merge.js'
});


// 公共css资源合并
fis.match('/static/css/**.css', {
  preprocessor : fis.plugin("autoprefixer",{
      "browsers": ["last 2 versions",'iOS 7','not ie <= 8','Firefox <= 20']
  }),
  packTo: 'static/css/static_merge.css'
});



/****************资源后缀设置***************/

// 指定文件添加md5戳
fis.match('*.{js,css,png,jpg,gif}', {
  useHash: true
});



/****************发布处理***************/

// 设置发布时不产出的文件
fis.match('**.{tmpl,txt,md}', {
    release: false
});


/****************发布路径设置***************/
// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
});

// 模块采用相对路径
fis.hook('relative');



/**************资源压缩处理*************/

// 设置js压缩
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

// 设置css压缩
fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  preprocessor : fis.plugin("autoprefixer",{
      "browsers": ["last 2 versions",'iOS 7','not ie <= 8','Firefox <= 20']
  }),
  optimizer: fis.plugin('clean-css')
});

// 设置png图片压缩
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});


/****************预处理***************/

// 替换所有文件中$root$字符串为/pages
fis.match('**', {
    deploy: [
      fis.plugin('replace', {  // 设置根目录
          from: '__root__',
          to: '/'
      }),
      fis.plugin('local-deliver',{
        
      })
    ]
});




