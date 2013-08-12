代码说明
===================

此文件夹是为GMU的Popover组件源码，具体功能说明请查看js文件的文档注释部分。


一共五个文件。

基础版本
* popover.js

功能增强部分。
* arrow.js
* collision.js
* dismissible.js
* placement.js

组件底层方法说明
-------------------------

gmu.define( name, object[, superClass])
定义一个组件

gmu.$widgetName.option( propname, condition, fun );
给已定义的组件，添加option。当用户初始此组件是，如果`options`中的`propname`值，等于`condition`时，
fun会在组件的init过程中执行。

gmu.$widgetName.register( pluginName, object )
给已定义组件添加插件，object如果存在_init方法，此方法将在组件实例过程中执行。另外如果覆盖了原组件同名方法，
在方法内可以通过this.origin调用原来的方法。