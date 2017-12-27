## wybc-vue-4.0

// 项目结构
.
|-- build                               // 项目构建(webpack)相关代码
|   |-- build.js                        // 生产环境构建代码
|   |-- check-version.js                // 检查node、npm等版本
|   |-- dev-client.js                   // 热重载相关
|   |-- dev-server.js                   // 构建本地服务器
|   |-- utils.js                        // 构建工具相关
|   |-- webpack.base.conf.js            // webpack基础配置
|   |-- webpack.dev.conf.js             // webpack开发环境配置
|   |-- webpack.prod.conf.js            // webpack生产环境配置
|-- config                              // 项目开发环境配置
|   |-- dev.env.js                      // 开发环境变量
|   |-- index.js                        // 项目一些配置变量
|   |-- prod.env.js                     // 生产环境变量
|   |-- test.env.js                     // 测试环境变量
|-- src                                 // 源码目录
|   |-- components                      // vue公共组件
|    |-- minishop                            // 功能开发
|   |-- store                           // vuex的状态管理
|   |-- index.ts                        // 页面入口文件
|    | -- index.tpl.html                // 入口页面
|    | -- favicon.ico
|   |-- main.ts                         // 程序入口文件，加载各种公共组件
|-- static                              // 静态文件，比如一些图片，json数据等
|   |-- data                            // 群聊分析得到的数据用于数据可视化
|-- .gitignore                          // git上传需要忽略的文件格式
|-- README.md                           // 项目说明
|-- package.json                        // 项目基本信息
|-- tsconfig.json                       // 编译ts配置文件
|-- postcss.config.js                   // 配置postcss编译，比如px2rem, autoprefixer等
.

// 构建项目环境
npm/cnpm
1, npm install or cnpm install
2, npm run webpack
3, npm run server


// 代码规范
功能组件 app/    eg: app/login/(login.component.ts, login.component.html, login.component.scss, login.component.service.ts)
公共组件 components/   eg: components/dialog/(dialog.component.ts, dialog.component.html, dialog.component.scss)

html, css, js规范请参考
![](http://alloyteam.github.io/CodeGuide)

消息分发规范：
命名 (app.(功能模块).(类型名称))
this.$on 注册
this.$emit 发布

qa服务器发布
sh /opt/sh/qa/release-qa-st-vue.sh      ----   (build&&server)

prod服务器发布--暂无

icon-font 
http://www.iconfont.cn/
accountType:github
account:xiaodi@365bencao.com
password:wybc@2017
projectName:无忧本草pc-web







#======================== 以下忽略 =======================================================
cnpm install

#webpack 
cnpm install  optimize-css-assets-webpack-plugin            --save-dev
cnpm install  webpack-parallel-uglify-plugin                --save-dev
cnpm install  uglifyjs-webpack-plugin                       --save-dev
cnpm install  webpack-bundle-analyzer                       --save-dev
cnpm install  webpack-md5-hash                              --save-dev

#babel
cnpm install  babel-preset-env                              --save-dev
cnpm install  babel-loader babel-core                       --save-dev
cnpm install  babel-cli                                     --save-dev

#loader
cnpm install  raw-loader css-loader  style-loader           --save-dev
cnpm install  file-loader vue-loader                        --save-dev
cnpm install  sass sass-loader node-sass                    --save-dev
cnpm install  postcss-px2rem  postcss-loader autoprefixer   --save-dev

cnpm install  url-loader                                    --save-dev
cnpm install  css-loader                                    --save-dev
cnpm install  @types/node                                   --save-dev



#typescript
cnpm install  @types/core-js ts-loader typescript           --save-dev
cnpm install  core-js                                       --save-dev


#vue
cnpm install  vuex                                          --save
cnpm install  vue                                           --save
cnpm install  vue-router                                    --save
cnpm install  vue-property-decorator                        --save
cnpm install  vue-class-component                           --save
cnpm install  vue-template-compiler                         --save-dev
cnpm install  vue-typescript                                --save-dev

#vue-plugins
cnpm install  vue-form                                       --save
cnpm install  vue-ydui                                       --save
cnpm install  vue-upload-component                           --save
cnpm install  vue-progressive-image                          --save
cnpm install  vue-lazyload                                   --save
cnpm install  vue-scroller                                   --save
cnpm install  vue2-animate                                   --save


#log
cnpm install  vconsole                                       --save

#wecat
cnpm install  weui                                           --save
cnpm install  weixin-js-sdk                                  --save

#other
cnpm install  swiper                                         --save
cnpm install  clipboard-polyfill                             --save
cnpm install  axios                                          --save
cnpm install  @types/lodash                                  --save
cnpm install  qs                                             --save
cnpm install es6-promise                                     --save-dev

#gulp
cnpm install  gulp                                           --save-dev