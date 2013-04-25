# GMU 代码规范

##1. 基本格式化

1.1 把代码缩进设成4个空白符。

1.2 语句必须都有分号结尾，除了 for, funciton, if, switch, try, while。

1.3 单行语句不允许超出80个字符，超出的需要进行合适的断行处理如
函数链式调用，从第二个点的前面开始换行，且换行后前面应当有一个缩进。

```javascript
//函数链式调用
var item = $( '<div></div>' ).attr( 'id', 'test' )
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

1.4 避免额外的逗号。如：

```javascript
//错误
var arr = [1, 2, 3,];
```

1.5 所有的循环体和判断体都需要用"{}"括起来。如：
```javascript
//正确
if( condition ) {
    doSomething();
}

//错误
if( condition ) doSomething();
```

1.6  for-in循环体中必须用hasOwnProperty方法检查成员是否为自身成员。避免来自原型链上的污染。

```javascript
//正确
for ( name in object ) {

    if ( object.hasOwnProperty( name ) ) {
        doSomething();
    }
}
```

1.7 变量声明。同一个逻辑块中使用的变量应该使用同一个var集中声明。
```javascript
//正确
function() {

    var v1 = 1,
        v2 = 2,
        v3 = 3;

    statement;
}

//错误
function() {

	var v1 = 1;
	var v2 = 2;
	var v3 = 3;

	statement;
}
```
同时每个变量独占一行，需要赋值初始值的优先放在前面，var开始前需要一个空行，如：

```javascript
function a() {

    var first = 1,
        second = 2,
        third = 3，
        fourth，
        fifth；

        doSomething();
}
```

1.8 不要使用with, void, eval。

1.9 在与类型确定的变量进行条件判断时，使用严格的条件判断符。用===代替==，用!==代替!=。
```javascript
if ( isValid === true ) {
    //
}
```

1.10 下面类型的对象不建议用new构造：new Number, new String, new Boolean, new Object(用{}代替), new Array(用[]代替)。

1.11 引用对象成员用obj.prop代替obj['prop']，除非属性名是变量。

1.12 使用parseInt将字符串转换成整数时必须使用基数参数。
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

**代码中禁止使和八进制?**

1.13 函数定义。不要在if、for的代码块中定义函数，在函数中定义内嵌函数时应该把函数定义放在顶部。闭包除外。

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
1-14 块语句间隔。所有块语句开始前需要一个新行.

```javascript
if( condition ) {

    while( condition ) {
        doSomething();
    }

    for( ; condition ; ; ) {
        doSomething();
    }
}
```

1-15 立即调用的函数用括号括起来.

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

1-16 使用局部严格模式
```javascript
(function(){
    "use strict";

    var a,
    b,
    c;

    doSomething();
})();
```

1-17 switch语句中的断行, 每个case之前有一个缩进，case之后的语句两个缩进, 每个break;后都有一个新行，最后一个除外。

```javascript
switch( condition ) {
    case “first”:
        doSomething();
        break;

    case “second”:
        doSomething();
        break;

    case “third”:
    case “fourth”:
         doSomething();
         break;

    default:
        break;
}
```

1-18 初始化一个可能赋值为对象的变量时，设为null。
```javascript
var a = null;

//later
a = new Foo();

```

1-19 如果某方法，期待返回某一对象时，在异常的情况下应当返回null, 不要返回undefined, 0, false之类的。
```javascript
function getPerson() {

    if( condition ) {
        return new Persion();
    } else {
        return null;
    }
}
```

1-19. 语句中的必要空格和缩进

1-20. 用来包含语句的"()"前后需要跟空格，诸如： if / for / while / switch ( statements ) { … } 等；函数定义以及调用中的"()"，"("前无空格，后加空格，")"后加空格，前加空格。
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

//函数定义
function myFunc( arg ) {
    statement
}

//匿名函数
function ( arg ) {
    statement
}

//函数调用
myFunc( arg );

```

//有几种例外函数调用时不需要要空格

```javascript
//1. 函数调用中无参数
myFunc();

//2. 参数是obj，array，function直接量时
myFunc([ a, b, c ]);

myFunc({
    a: 1,
    b: 2
});
```

1-21. "="、"=="、"&&"、"||"、">"、"<"前后需要跟空格

1-22. 数组成员间的","后面需要跟空格

1-23. "[]"中的"["后以及"]"前需要跟空格
```javascript
for ( t in selected ) {       if ( !hash[t] && isOk ) {           deselect(t);         }
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

1-24. 超长字符串应该使用"+"进行换行。
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

1-25. 包含代码块的"{}"，应该在"{"后立即换行。
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

1-26. if/else中新的代码块应该另起一行开始。
```javascript
if ( a === 1 ){
    statement
}
else if ( a === 2 ){
    statement
}

//错误

if ( a === 1 ){
    statement
} else if ( a === 2 ){
    statement
}
```

1-27. 每一个块状代码的开始都应当有一个空行。
```javascript
function myFunc(){
    var v1 = 1,
       v2 = 2,
       v3 = 3;

    if( v1 == 1 ){
        statement
    }
}

//错误
function myFunc(){
    var v1 = 1,
       v2 = 2,
       v3 = 3;
    if( v1 == 1 ){
        statement
    }
}
```

1-28. 引号，字符串外层必须使用单引号，内部如果是HTML属性所需的引号则必须为双引号。
```javascript
var myString = '< a href="http://www.kaixin001.com">Let\'sGo</a>';

//错误
var myString = "< a href='http://www.kaixin001.com'>Let'sGo</a>"';
```

1-29. 构造函数，使用函数申明定义。
```javascript
function MyClass( opts ){
    statement
}

//错误
var MyClass = function( opts ){
    statement
}
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
function isGroupId( id ){
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
setTimeout( function(){
    //me.
}, 1000 );

//错误
var ins = this;
setTimeout( function(){
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
        <td>evt</td>
        <td>Event对象</td>
        <td><pre><code>$( '#a' ).click( function( evt ){
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

2-10. 所有Zepto/jQuery对象，变量名已$符号开头，如：
```javascript
var $div = $(‘<div></div>’);
```

2-11. 变量命名前缀应当是名词，与函数区分开来，函数应当是动词
```javascript
//好的写法
var count = 10,
    myName = “Abcd”,
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
###3-1. APP中的注释应该遵守以下约定
3-1-1. JS文件头部必须添加文件描述注释
```javascript
/**
 * @fileoverview 文件功能描述或一些其他相关信息.
 */
```

3-1-2. 任何超过10行的函数必须在函数前添加函数注释，至少需要描述清楚函数功能。如果有潜在逻辑也应该描述清楚。注释前面应当有个空行。
```javascript
//在函数定义上一行添加函数注释，说明函数功能
function myFunc(){
    ....
}

/*
* 在函数定义上一行添加函数注释，说明函数功能
* 多行情况使用这种方式
*/
function myFunc(){
    ....
}
```

###4. 其他规范
4-1. 不要分发事件对象，目标方法应该明确所需变量。
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


