##Notice##
+ 当前版本（2.1.0）基于zepto 1.0
+ 2.0.3及以下版本（支持zepto 1.0rc1），请移步至老的github地址 https://github.com/campaign/gmu

##Build State [![Build Status](https://secure.travis-ci.org/gmuteam/GMU.png?branch=dev-refactor)](https://travis-ci.org/gmuteam/GMU)

##GMU##
GMU是基于zepto的轻量级mobile UI组件库，符合jquery ui使用规范，提供webapp、pad端简单易用的UI组件。兼容iOS3+ / android2.1+，支持国内主流移动端浏览器，如safari, chrome, UC, qq等。
GMU由百度GMU小组开发，基于开源BSD协议，支持商业和非商业用户的免费使用和任意修改，您可以通过[get started](http://gmu.baidu.com/getstarted)快速了解。

###Quick Start###
+ **官网：**http://gmu.baidu.com/
+ **API：**http://gmu.baidu.com/doc

###命令行工具###
命令行工具提供代码打包，[规范](https://github.com/gmuteam/jsbint/blob/master/standard.md)检测和生成文档功能。命令行工具基于grunt环境，请安装grunt-cli `npm install -g grunt-cli`

在使用前需要安装依赖，`npm install`

####1. 打包代码####
`grunt`

####2. 代码规范检测####
gmu所有的代码要求通过[此内定代码规范](https://github.com/gmuteam/jsbint/blob/master/standard.md), 通过以下命令可以得到检测结果
`grunt jsbint`

####3. 生成文档####
通过以下命令可以在doc目录下生成静态文档，也可以[在线查看](http://gmu.baidu.com/doc);
`grunt doc`


###反馈bug###
如果您有任何关于GMU或移动前端开发中的问题，可以在QQ群中讨论，也可以通过[git issue](https://github.com/campaign/gmu/issues)给我们反馈bug，我们会尽快解决。
当然，我们更欢迎您的fork，为GMU添砖加瓦。

###联系我们###
+ QQ：127405799
+ Email：gmu@baidu.com

