---
layout: post
title: GMU代码规范
category: standards
tagline: GMU
group: standards
---
{% include JB/setup %}
## 内容导航
 * [基本的格式化](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#1-)
    * [合适的换行](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#1-5-)
    * [合适的空格](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#1-6-)
 * [Javascript命名规范](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#2-javascript)
 * [注释](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#3-)
 * [其他规范](https://github.com/gmuteam/GMU/wiki/GMU-代码规范#4-)

##1. 基本的格式化

1-1. 代码缩进采用4个空白符。

1-2. 语句必须都有分号结尾，除了 for, function申明, if, switch, try, while。
**非申明式函数也需要分号**
```javascript
var a;

//错误, 结尾缺少分号
a = function() {
    //do some thing.
}
```

1-3. 所有的循环体和判断体都需要用"{}"括起来。如：
```javascript
//正确
if( condition ) {
    doSomething();
}

//错误
if( condition ) doSomething();
```

1-4. 变量声明。同一作用域下的所有变量，全部提至函数顶部，且使用一个var来集中申明。

```javascript
//正确
function a() {
    var v1 = 1,
        v2 = 2,
        v3 = 3,
        i = 0,
        len = 3;

    statement;

    for( ; i < len; i++ ) {
        //do some thing.
    }
}

//错误
function a() {

	var v1 = 1;
	var v2 = 2;
	var v3 = 3;

	statement;
}

//错误
function a() {
    var a = 1;

    for( var i = 0, len = arr.length; i < len ; i++ ) {
        //do some thing.
    }

    if( condition ) {
       var b = 2;

       //do something.
    }
}

//错误
function a() {
    var a = 1;

    if( condition ) {
       var b = 2;

       //do something.
    }
}
```

同时每个变量独占一行，第二个起应当有两个缩进。需要赋值初始值的优先放在前面，如：

```javascript
function a() {
    var first = 1,
        second = 2,
        third = 3,
        fourth,
        fifth;

    doSomething();
}
```

### 1-5. 合适的换行。

单行语句不允许超出80个字符，超出的需要进行合适的断行处理。

1-5-1. 函数链式调用，从第二个点的前面开始换行，且换行后前面应当有一个缩进。

```javascript
//函数链式调用
var $item = $( '<div></div>' ).attr( 'id', 'test' )
    .attr( 'id', 'what ever' )
    .addClass( 'className' )
    .html( 'xxxx' );

//非赋值语句
$( '<div></div>' ).attr( 'id', 'test' )
    .attr( 'id', 'what ever' )
    .addClass( 'className' )
    .html( 'xxxx' );

//先取对象再取方法
obj.obj1
    .obj3
    .funA()
    .funB();
```

1-5-2. 方法参数过长，if语句中条件过多时也需要换行，这种情况下的缩进为2个。同是操作符应当保留在右边结尾处。

```javascript
callFunc( arg1, arg2, longArgmunent3, longArgmuent4,
        longArgmument5 );

function doSomething( arg1, arg2, longArgmunent3, longArgmuent4,
        longArgmument5 ) {

    doSomething();
}

if ( condition1 && condition2 || condition3 &&
       condition5 ) {

    doSomething();
}
```

1-5-3. 每一个块状代码的开始都应当有一个空行。
```javascript
function myFunc() {
    var v1 = 1,
        v2 = 2,
        v3 = 3;

    if( v1 == 1 ) {
        statement
    }

    while( condition ) {
        statement
    }

    if( condition ) {
        statement
    }
}

//错误
function myFunc() {
    var v1 = 1,
        v2 = 2,
        v3 = 3;
    if( v1 == 1 ) {
        statement
    }
    while( condition ) {
        statement
    }

}
```

1-5-4. if之后的else的代码块应当在前个代码块之后，不允许另起新行。
```javascript
if ( a === 1 ) {
    statement
} else if ( a === 2 ) {
    statement
}

//错误
if ( a === 1 ) {
    statement
}
else if ( a === 2 ) {
    statement
}
```

1-5-5. 包含代码块的"{}"，应该在"{"后立即换行。
```javascript
//正确
for ( t in selected ) {
    statement1
    statement2
}

for ( t in selected ) {
    statement1
}


//错误
for (t in selected)
{
    //statement1
    //statement2
}
for (t in selected) { statement }
```

1-5-6. switch语句中的断行, 每个case之前有一个缩进，case之后的语句两个缩进, 每个break;后都有一个新行，最后一个除外。

```javascript
switch( condition ) {
    case 'first':
        doSomething();
        break;

    case 'second':
        doSomething();
        break;

    case 'third':
    case 'fourth':
         doSomething();
         break;

    default:
        break;
}
```

1-5-7. 超长字符串应该使用"+"进行换行。
```javascript
//正确
var myString = 'A rather long string of English text, an error message ' +
			 'actually that just keeps going and going -- an error ' +
			 'message to make the Energizer bunny blush (right through ' +
			 'those Schwarzenegger shades)! Where was I? Oh yes, ' +
			 'you\'ve got an error and all the extraneous whitespace is ' +
			 'just gravy.  Have a nice day.';

//错误
var myString = 'A rather long string of English text, an error message \
              actually that just keeps going and going -- an error \
              message to make the Energizer bunny blush (right through \
              those Schwarzenegger shades)! Where was I? Oh yes, \
              you\'ve got an error and all the extraneous whitespace is \
              just gravy.  Have a nice day.';
```


### 1-6. 适当的空格。

1-6-1. 包含"()"括号的语句，括号前后应当各有一个空格，括号内部开头和结尾处应当各有一空格，诸如： if / for / while / switch ( statements ) { … } 等；
```javascript
if ( a === 1 ) {
    statement
}

for ( var i = 0; i < 1000; i++ ) {
    statement
}

while ( v ) {
    statement
}

switch ( v ) {
    case '':...
}
```

1-6-2. 方法定义和方法调用左括号“(”前面不需要空格, 右括号与{之间始终有一个空格，括号内部开头和结尾应当各有一空格。
```javascript
//函数定义
function myFunc( arg ) {
    statement
}

//匿名函数
function( arg ) {
    statement
}

//函数调用
myFunc( arg );

```

**方法调用时，有几种例外，函数调用时有些场景不需要要空格**

```javascript
//1. 函数调用中无参数
callFunc();

//2. 参数是obj，array，function直接量时
callFunc([ a, b, c ]);

callFunc({
    a: 1,
    b: 2
});

callFunc(function() {
    doSomething();
});
```

1-6-3. "="、"=="、"&&"、"||"、">"、"<"前后需要跟空格

1-6-4. 数组成员间的","和各个参数间的","（包括形参和实参）后面需要跟空格。

1-6-5. "[]"中的"["后以及"]"前需要跟空格
```javascript
for ( t in selected ) {

    if ( !hash[ t ] && isOk ) {
         deselect( t );
    }
 }

function MyClass( selector ){
    //.....
}

new MyClass( '#abc' );

var arr = [ 1, 2, 3, 4 ];

//错误
for (t in selected) {
    if (!hash[t]&&isOk){
        deselect(t)
    }
}

function MyClass(selector){
    //.....
}

new MyClass('#abc');

var arr = [1,2,3,4];
```

##2. Javascript命名规范
2-1.  构造器采用驼峰式命名，并且首字母大写。如：
```javascript
function DialogManager ( config ) {
	statement;
}
```

2-2. 枚举类型变量采用驼峰式命名，并且首字母大写。属性名单词全部大写，单词间以下划线分隔。如：
```javascript
var QueueError = {
	QUEUE_LIMIT_EXCEEDED: -100,
	FILE_EXCEEDS_SIZE_LIMIT: -110,
	ZERO_BYTE_FILE: -120,
	INVALID_FILETYPE: -130
};
```

2-3. 对象的属性或方法名采用小驼峰式(lower camel-case)，如"init", "bindEvent", "updatePosition"：
```javascript
Dialog.prototype = {
	init: function () {},
	bindEvent: function () {},
	updatePosition: function () {}
};
```

2-4. 私有变量名用下划线开头。如："_current", "_defaultConfig"
```javascript
function Dialog( config ) {
    this._defaultConfig = {};
}
```

2-5. 常量名全部大写，单词间用下划线分隔。如：“CSS_BTN_CLOSE”, "TXT_LOADING"
```javascript
function Dialog( config ) {
    this.DEFAULT_CONFIG = {
        CSS_BTN_CLOSE: 'x-btn-cls',
        TXT_LOADING: '加载中...'
    };
}
```

2-6. 方法的返回值如果是布尔值，则必须以is、can、has、should等为前缀
```javascript
function isGroupId( id ) {
	return (id + '').indexOf( 'G' ) > 0;
}
```

2-7. 简写单词在变量名中出现时也应该遵循驼峰式写法。
```javascript
//正确
function getXml () {}
function getId () {}
function getHtml () {}
var xmlDocument;

//错误
function getXML(){}
function getID(){}
function getHTML(){}
var XMLDocument;
```

2-8. 在闭包中访问所在实例this指针时，统一使用变量me指向。
```javascript
var me = this;
setTimeout( function() {
    //me.
}, 1000 );

//错误
var ins = this;
setTimeout( function() {
    //ins.
}, 1000 );
```

2-9. 符合下列场景的变量，请使用对应的命名。

<table>
    <tr>
        <th>变量名</th>
        <th>变量含义</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>e</td>
        <td>Event对象</td>
        <td><pre><code>$( '#a' ).click( function( e ){
    //...
});
</code></pre></td>
    </tr>
    <tr>
        <td>el</td>
        <td>HTMLElement</td>
        <td><pre><code>var el =$( 'div.demo' )[ 0 ];</code></pre></td>
    </tr>
    <tr>
        <td>ex</td>
        <td>Exception</td>
        <td><pre><code>try{
    //statement
}
catch( ex ){
    console.log( ex );
}
</code></pre></td>
    </tr>
    <tr>
        <td>opts</td>
        <td>JSON结构的配置项</td>
        <td><pre><code>function MyClass( opts ){
    this._defaultOpts = {...};
    K.mix( this._defaultOpts, opts );
}
</code></pre></td>
    </tr>
</table>

2-10. 所有Zepto/jQuery对象，变量名以$符号开头，如：
```javascript
var $div = $('<div></div>');
```

2-11. 变量命名前缀应当是名词，与函数区分开来，函数应当是动词
```javascript
//好的写法
var count = 10,
    myName = 'Abcd',
    found = true;

//不好的写法
var getCount = 10,
    isFound = true;

//好的写法
function getName() {
    return myName;
}

//不好的写法
function theName(){
    return myName;
}
```

##3. 注释
3-1. Js文档注释，每个js文件顶部都必须包含关于Js文件功能的注释信息。
```javascript
/**
 * @fileoverview 文件功能描述或一些其他相关信息.
 */
```

3-2. 单行注释。

以两个斜线开始，以行尾结束，两个斜线与内容之间应当有一个空格。
```javascript
    // 这是一个注释
```

单行注释分以下两种：

1. 独占一行，用来解释下一行代码。这行注释之前应当有一个空行，且缩进层级和下一行代码保持一致。
2. 在代码行的尾部添加，代码结束到注释之间至少有一个缩进。注释（包括前面的代码部分）不能超过单行最大字符数限制，如果超过改成第一种注释。

```javascript
function doSomething() {
    var a = 3,  //这变量用来存长度

        //这个变量用来存宽度
        b,

        //这个变量用来存高度
        c;

    if( condition ) {

        //如果代码执行到这，则说明通过安全验证。
        popupDialog();
    }
}
```

3-3. 多行注释

当内容比较多用单行注释不能满足需求时，推荐使用多行注释，格式如下，前面应当有个空格。
```javascript

/*
 * 我的注释
 * 注释中的第二段
 */
if( condition ) {
    statement
}
```

3-4. 避免多余的注释，当代码很明了时不应当添加注释。
```javascript
// 不必要的注释

// 初始化count
var count = 10;
```


###4. 其他规范
4-1.  for-in循环体中必须用hasOwnProperty方法检查成员是否为自身成员。避免来自原型链上的污染。

```javascript
//正确
for ( name in object ) {

    if ( object.hasOwnProperty( name ) ) {
        doSomething();
    }
}
```

4-2. 不要使用with, void, eval。

4-3. 在与类型确定的变量进行条件判断时，使用严格的条件判断符。用===代替==，用!==代替!=。
```javascript
if ( isValid === true ) {
    //
}
```

4-14. 下面类型的对象不建议用new构造：new Number, new String, new Boolean, new Object(用{}代替), new Array(用[]代替)。

4-5. 引用对象成员用obj.prop代替obj['prop']，除非属性名是变量。

4-6. 使用parseInt将字符串转换成整数时必须使用基数参数。
```javascript
//10进制
parseInt( str, 10 );

//2进制
parseInt( str, 2 );

//8进制
parseInt( str, 8 );

//16进制
parseInt( str, 16 );

//错误
parseInt( str );
```
另外`parseInt( str, 10)`可以考虑是用`~~str`或者`str>>0`来达到同样的效果

4-7. 函数定义。不要在if、for的代码块中定义函数，在函数中定义内嵌函数时应该把函数定义放在顶部。闭包除外。

```javascript
//正确
function outerFunc( va ){
    va = va || 0;

    function innerFunc(){
        //to do....
    }

    if( va ){
        innerFunc();
    }
}

//错误
function outerFunc( va ){
    va = va || 0;

    if( va ){
        function innerFunc(){
            //to do....
        }
        innerFunc();
    }
}

```

4-8. 立即调用的函数用括号括起来.

```javascript
//正确
(function(){
    doSomething();
})();

//错误
void function(){
    doSomething();
}();

//错误
(function(){
    doSomething();
}());

//错误
function(){
    doSomething();
}();
```

4-9. 初始化一个可能赋值为对象的变量时，设为null。
```javascript
var a = null;

//later
a = new Foo();

```

4-10. 如果某方法，期待返回某一对象时，在异常的情况下应当返回null, 不要返回undefined, 0, false之类的。
```javascript
function getPerson() {

    if( condition ) {
        return new Persion();
    } else {
        return null;
    }
}
```

4-11. 引号，字符串外层必须使用单引号，内部如果是HTML属性所需的引号则必须为双引号。
```javascript
var myString = '< a href="http://www.baidu.com">Let\'sGo</a>';

//错误
var myString = "< a href='http://www.baidu.com'>Let'sGo</a>"';
```

4-12. 构造函数，使用函数申明定义。
```javascript
function MyClass( opts ){
    statement
}

//错误
var MyClass = function( opts ){
    statement
}
```

4-13. 不要分发事件对象，目标方法应该明确所需变量。
```javascript
var myApp = {
    handler: function( e ) {
        this.showPopup( e.pageX, e.pageY );
    },

    showPopup: function( x, y ) {
        //do popup
    }
}

addListener( elem, "click", function() {
    myApp.handler( e );
});

//错误
var myApp = {
    handler: function( e ) {
        this.showPopup( e );
    },

    showPopup: function( e ) {
        //do popup
    }
}

addListener( elem, "click", function() {
    myApp.handler( e );
});
```