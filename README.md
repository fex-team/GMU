##Notice##
+ 当前版本（2.1.0）基于zepto 1.0
+ 2.0.3及以下版本（支持zepto 1.0rc1），请移步至老的github地址 https://github.com/campaign/gmu

##Build State [![Build Status](https://travis-ci.org/fex-team/GMU.svg?branch=master)](https://travis-ci.org/fex-team/GMU)

##GMU##
GMU是基于zepto的轻量级mobile UI组件库，符合jquery ui使用规范，提供webapp、pad端简单易用的UI组件。兼容iOS3+ / android2.1+，支持国内主流移动端浏览器，如safari, chrome, UC, qq等。
GMU由百度GMU小组开发，基于开源BSD协议，支持商业和非商业用户的免费使用和任意修改，您可以通过[get started](http://gmu.baidu.com/getstarted)快速了解。

###Quick Start###
+ **官网：**http://gmu.baidu.com/
+ **API：**http://gmu.baidu.com/doc

###命令行工具###
命令行工具提供代码打包，[规范](https://github.com/gmuteam/jsbint/blob/master/standard.md)检测和生成文档功能。

环境依赖
* git
* node(包括npm)
* grunt (npm install -g grunt-cli)

####1. 如何跑Demo####
如果想要本地跑demo需要做以下几步操作。由于gmu没有直接存放zepto的代码，而是引用了zepto官方仓库。所以需要通过git命令
去zepto官方仓库取代码，然合并成zepto.js。不过这个过程已经写好了脚本，只要按以下步骤操作，脚本能把这个工作完成。

打开命令行工具。

1. `git clone https://github.com/gmuteam/GMU.git` 把gmu代码checkout到当前目录下的GMU目录里面
2. `cd GMU` 进入GMU目录
3. `npm install` 安装node依赖。
4. `grunt dist` 生成合并的zepto.js, gmu.js到dist目录。

####2. 打包代码####
`grunt concat`

`grunt concat_gmu`

####3. 代码规范检测####
gmu所有的代码要求通过[此内定代码规范](https://github.com/gmuteam/jsbint/blob/master/standard.md), 通过以下命令可以得到检测结果
`grunt jsbint`

####4. 生成文档####
通过以下命令可以在doc目录下生成静态文档，也可以[在线查看](http://gmu.baidu.com/doc);
`grunt doc`


###关于dist目录###

如果不想自己打包也可以直接使用 `dist` 目录中打包好的资源，其中包括

```html
reset.css
gmu.css
zepto.js
gmu.js
```

按顺序直接引用即可，此外，`dist` 中还有压缩版本，可以按需使用。

需要注意的是，GMU中有些插件是无法共存的，因此 `dist` 目录中的 `gmu.js` 中并不包含这些插件，如需自定打包规则请参考之前的打包教程。

###反馈bug###
如果您有任何关于GMU或移动前端开发中的问题，可以在QQ群中讨论，也可以通过[git issue](https://github.com/campaign/gmu/issues)给我们反馈bug，我们会尽快解决。
当然，我们更欢迎您的fork，为GMU添砖加瓦。

###联系我们###
+ QQ：127405799 (已满) 339271891 （群2）305735121 （群3）
+ Email：gmu@baidu.com

