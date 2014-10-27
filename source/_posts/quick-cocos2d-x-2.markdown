---
layout: post
title: "第二章 Lua 程序设计"
date: 2014-09-03 22:07:06 +0800
comments: true
categories: quick-cocos2d-x
tags:
- 脚本语言
---
　　本章主要参考《Programming in Lua》中文版一书，并添加了书中未写到的细节知识。<br>
# 第一节 概述 #
　　目前很多程序语言都专注于帮你编写成千上万行的代码，所以此类型的语言所提供的包、命名空间、复杂的类型系统及无数的结构，有上千页的文档需要操作者学习。 而 Lua 并不帮你编写大量的代码的程序，相反的，Lua 仅让你用少量的代码解决关键问题。为实现这个目标，像其他语言一样 Lua 依赖于其可扩展性。但是与其他语言不同的是，不仅用 Lua 编写的软件易于扩展，而且用其他语言比如 C/C++编写的软件也很容易使用 Lua 扩展其功能。
　　一开始，Lua 就被设计成很容易和传统的 C/C++ 整合的语言。这种语言的二元性带来了极大的好处。Lua 是一个小巧而简单的语言，因为 Lua 不致力于做 C 语言已经做得很好的领域，比如：性能、底层操作以及与第三方软件的接口。Lua 依赖于 C 去做完成这些任务。Lua 所提供的机制是 C 不善于的：高级语言、动态结构、简洁、易于测试和调试等。正因为如此，Lua 具有良好的安全保证，自动内存管理，简便的字符串处理功能及其他动态数据的改变。
<br>
**何为“脚本语言”**

	　　首先我们来看看“脚本”这个概念是如何产生的。使用Unix系统的人都会敲入一些命令，而命令貌似都是“一次性”或者“可抛弃”的。然而不久，人们就发现这些命令其实并不是那么的“一次性”，自己其实一直在重复的敲入类似的命令，所以有人就发明了“脚本”这东西。它的设计初衷是“批量式”的执行命令，你在一个文件里把命令都写进去，然后执行这个文件。可是不久人们就发现，这些命令行其实可以用更加聪明的方法构造，比如定义一些变量，或者根据系统类型的不同执行不同的命令。于是，人们为这脚本语言加入了变量，条件语句，数组等构造。“脚本语言”就这样产生了。
以上摘自王垠《[什么是“脚本语言”](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language/)》， Lua 就是一种脚本语言。
<br>
**Lua独有的特点**
　　还有很多与 Lua 类似的脚本语言，例如：Perl、Tcl、Ruby、Forth、Python 虽然其他语言在某些方面与 Lua 有着共同的特色，但下面这些特征是 Lua 特有的：
- 可扩展性。
>Lua 的扩展性非常卓越，以至于很多人把 Lua 用作搭建领域语言的工具（注：比如游戏脚本）。Lua 被设计为易于扩展的，可以通过Lua代码或者 C 代码扩展， Lua的很多功能都是通过外部库来扩展的。Lua很容易与 C/C++、java、fortran、Smalltalk、Ada，以及其他语言接口。
- 简单。
>Lua 本身简单，小巧；内容少但功能强大，这使得 Lua 易于学习，很容易实现一些小的应用。它的完全发布版（代码、手册以及某些平台的二进制文件），仅用一张软盘就可以装得下。
- 高效率。
>Lua 有很高的执行效率，统计表明 Lua 是目前平均效率最高的脚本语言。
- 与平台无关。
>Lua 几乎可以运行在所有我们听说过的系统上，如 NextStep、OS/2、PlayStation II (Sony)、Mac OS-9、OS X、BeOS、MS-DOS、IBM mainframes、EPOC、PalmOS、MCF5206eLITE Evaluation Board、RISC OS，及所有的 Windows 和 Unix。Lua 不是通过使用条件编译实现平台无关，而是完全使用 ANSI (ISO) C，这意味着只要你有 ANSI C 编译器你就可以编译并使用 Lua。

<br>**Lua类库**
　　Lua 大部分强大的功能来自于它的类库，这并非偶然。 Lua 的长处之一就是可以通过新类型和函数来扩展其功能。动态类型检查最大限度允许多态出现，并自动简化调用内存管理的接口，因为这样不需要关心谁来分配内存谁来释放内存，也不必担心数据溢出。高级函数和匿名函数均可以接受高级参数，使函数更为通用。 
　　Lua 自带一个小规模的类库。在受限系统中使用 Lua，如嵌入式系统，我们可以有选择地安装这些类库。若运行环境十分严格，我们甚至可以直接修改类库源代码，仅保留需要的函数。记住：Lua 是很小的（即使加上全部的标准库）并且在大部分系统下你仍可以不用担心的使用全部的功能。
　　如果你真得想学一门语言，参考手册是必备的。本文和 Lua 参考手册互为补充，手册仅仅描述语言本身，因此它既不会告诉你语言的数据结构也不会举例说明。你可以从 http://www.lua.org 可以得到权威性的手册的内容。

<br>
**环境搭建**
　　首先下载 Lua 编译器，用来编译 lua 代码，下载地址：http://www.lua.org/download.html 。
　　安装完毕后将 Lua 的安装路径配置到 Path 环境变量中，如：`;D:\Program Files\Lua\5.1`，这样就可以在 cmd 中通过`lua`命令来启动 lua 编译工具了。

<br>
**本节参考阅读：**
- [什么是“脚本语言”](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language/)
- [知乎：你如何看待王垠的《什么是“脚本语言”》？](http://www.zhihu.com/question/20898488)
- [使用 Lua 编写可嵌入式脚本](http://www.ibm.com/developerworks/cn/linux/l-lua.html)


# 第二节 基础知识 #
本节将介绍 Lua 编程的基础语法知识。
## 起点 ##
　　范例1：hello world。
``` lua
	print("Hello World")
```
	语句解释：
	- 创建 a.lua 文件，并输入本范例中的代码并保存，在cmd中通过执行“lua a.lua”可运行程序。
	- 注意：直接在Windows右键建立一个txt文件可能会有中文编码问题，可以通过专业的文本编辑软件创建，如EditPlus。
<br>
**Chunks**
　　chunk 和 java 中的代码块类似，它是由一行或者多行代码组成的一个代码块。一个 chunk 小到可以仅包含一行代码，大到可以是一系列语句的组合，还可以是函数，在 Lua 中一个 chunk 包含几个 MByte 的代码是很常见的。交互模式下的每一行都是一个 chunk。
　　每个语句结尾的分号（；）是可选的，通常不需要写，但如果同一行有多个语句最好用“；”分开，比如下面的写法是不推荐的，虽然它的语法是正确的：
``` lua
	a = 1   b = a*2
```
	语句解释：
    - Lua和js一样，它们的变量是不需要指定数据类型的，你可以随便给变量a赋值数字、字符串、boolean类型的值。
    - Lua代码保存的文件名后缀为.lua 。 
<br>
**交互模式**
　　直接在 cmd 命令行中执行`lua`命令即可进入到交互模式中。在交互模式下，Lua 通常把每一个行当作一个 chunk，但如果一行不是一个完整的 chunk 时，它会等待继续输入直到得到一个完整的 chunk 。在 Lua 等待续行时，显示不同的提示符（一般是>>）。

　　范例1：进入交互模式。
``` lua
	E:\luademo>lua
	Lua 5.1.4  Copyright (C) 1994-2008 Lua.org, PUC-Rio
	> print("Hello World!!!!")
	Hello World!!!!
```
	语句解释：
    - Lua语言是即时编译的，因此可以在交互模式中实现“一边编写，一边运行”。
<br>　　可以通过指定参数让 Lua 执行一系列 chunk。例如：假定一个a.lua内有单个语句 `x=1;`另一个 b.lua 中有语句`print(x)`，然后执行下面语句：
``` lua
	lua -la -lb
```
　　lua 命令首先在一个 chunk 内先运行 a 然后运行 b 。（注意：`-l` 选项会调用 require函数，它会在指定的目录下搜索文件，如果环境变量没有设好，上面的命令可能不能正确运行。 具体后述。

<br>　　范例2：另一个连接外部 Chunk 的方式是使用 dofile 函数，dofile 函数加载文件并执行它。假设有一个文件lib1.lua：
``` lua
	function add (x, y) 
	  return x + y 
	end
```
　　然后在交互模式下执行：
``` lua
	E:\luademo>lua
	dofile("lib1.lua")
	print(add(3,5))		--程序输出：8
```
　　提示：使用 `function` 关键字来定一个函数，关于函数将在后面具体介绍。
<br>
**全局变量**
　　全局变量不需要声明，给一个变量赋值后即创建了这个全局变量，访问一个没有初始化的全局变量也不会出错，只不过得到的结果是 nil 。
``` lua
	print(b)   -- nil 
	b = 10 
	print(b)   -- 10
```
　　如果你想删除一个全局变量，只需要将变量赋值为 nil
``` lua
	b = nil 
	print(b)   -- nil
```
　　这样变量 b 就好像从没被使用过一样。换句话说，当且仅当一个变量不等于 nil 时，这个变量存在。
<br>
**词法约定**
　　标识符：以字母(letter)或者下划线开头的字母、下划线、数字序列。最好不要使用下划线加大写字母的标示符，因为 Lua 的系统变量也是这样的。Lua 中，letter 的含义是依赖于本地环境的。
　　保留字：以下字符为 Lua 的保留字，不能当作标识符。
``` lua
and     break   do     else   elseif 
end     false   for     function  if 
in     local   nil     not     or 
repeat   return   then   true   until 
while
```
　　注意：Lua 是大小写敏感的，这意味着代码：`a = 3 ; A = 3 `中其实是定义了两个变量 a 和 A ，而不是一个。
<br>
**注释**
　　单行注释：- - 
　　多行注释：- -[[ 此处为需要注释掉的内容 - -]]
``` lua
	local a = 10
	--[[ 
	print(a)      -- no action (comment) 
	--]]
```

<br>
## 类型和值 ##
　　Lua 是动态类型语言，变量不需要类型定义。
　　Lua 中有8个基本类型分别为：nil、boolean、number、string、userdata、function 、thread 和 table 。
``` lua
	-- type()函数可以以字符串的形式返回给定变量或者值的类型。
	print(type("Hello world" ))   --> string 
	print(type(10.4*3))     --> number 
	print(type(print))     --> function 
	print(type(type))      --> function 
	print(type(true))      --> boolean 
	print(type(nil ))      --> nil 
	print(type(type(X)))     --> string
```
　　变量没有预定义的类型，每一个变量都可能包含任一种类型的值。
``` lua
	print(type(a))  --> nil   ('a' is not initialized) 
	a = 10 
	print(type(a))  --> number 
	a = "a string!!" 
	print(type(a))  --> string 
	a = print      -- yes, this is valid! 
	a(type(a))    --> function
```
　　注意上面最后两行，我们可以使用 function 像使用其他值一样使用（后面会有更多的介绍）。一般情况下同一变量代表不同类型的值会造成混乱，最好不要用，但是特殊情况下可以带来便利，比如 nil 。
<br>
**Nil**
　　Lua 中特殊的类型，它只有一个值：`nil`。一个全局变量没有被赋值以前默认值为 nil；给全局变量负 nil 可以删除该变量。
<br>
**Booleans**
　　两个取值`false`和`true`。但要注意 Lua 中所有的值都可以作为条件。在控制结构的条件中除了 false 和 nil 为假，其他值都为真。所以 Lua 认为 0 和空串都是真。
<br>
**Numbers**
　　表示实数，Lua 中没有整数。一般有个错误的看法 CPU 运算浮点数比整数慢。事实不是如此，用实数代替整数不会有什么误差（除非数字大于100,000,000,000,000）。Lua的numbers 可以处理任何长整数不用担心误差。你也可以在编译Lua 的时候使用长整型或者单精度浮点型代替numbers，在一些平台硬件不支持浮点数的情况下这个特性是非常有用的，具体的情况请参考 Lua 发布版所附的详细说明。和其他语言类似，数字常量的小数部分和指数部分都是可选的，数字常量的例子：
``` lua
	4   0.4  4.57e-3  0.3e12  5e+20
```
<br>
**Strings**
　　指字符的序列。lua 是8 位字节，所以字符串可以包含任何数值字符，包括嵌入的0 。这意味着你可以存储任意的二进制数据在一个字符串里。Lua 中字符串是不可以修改的，你可以创建一个新的变量存放你要的字符串，如下：
``` lua
	a = "one string" 
	b = string.gsub(a, "one" , "another")  -- change string parts 
	print(a)     --> one string 
	print(b)     --> another string
```
　　string 和其他对象一样，Lua自动进行内存分配和释放，一个 string 可以只包含一个字母也可以包含一本书，Lua 可以高效的处理长字符串，1M 的string 在Lua 中是很常见的。可以使用单引号或者双引号表示字符串：
``` lua
	a = "a line"  
	b = 'another line'
```
　　为了风格统一，最好使用一种，除非两种引号嵌套情况。对于字符串中含有引号的情况还可以使用转义符“\”来表示。Lua 中的转义序列有：
``` lua
	\a bell 
	\b back space       --  后退 
	\f form feed      --  换页 
	\n newline       --  换行 
	\r carriage return      --  回车 
	\t horizontal tab     --  制表 
	\v vertical tab 
	\\ backslash       -- "\" 
	\" double quote        --  双引号 
	\' single quote        --  单引号
	\[ left square bracket     --  左中括号 
	\] right square bracket    --  右中括号
```
<br>　　范例1：转义字符。
``` lua
	> print( "one line\nnext line\n\"in quotes\", 'in quotes'")
	one line 
	next line 
	"in quotes", 'in quotes' 
	> print( 'a backslash inside quotes: \'\\\'' ) 
	a backslash inside quotes: '\' 
	> print( "a simpler way: '\\'") 
	a simpler way: '\'
```
　　还可以在字符串中使用 `\ddd` （ddd 为三位十进制数字）方式表示字母。如`alo\n123\"`和`\97lo\10\04923"` 是相同的。
　　还可以使用`[[...]]`表示字符串。这种形式的字符串可以包含多行，如果第一个字符是换行符会被自动忽略掉。这种形式的字符串用来包含一段代码是非常方便的。

<br>　　范例2：多行字符串。
``` lua
	page = [[ 
	<HTML> 
	<HEAD> 
	<TITLE>An HTML Page</TITLE> 
	</HEAD> 
	<BODY> 
	Lua 
	</BODY> 
	</HTML> 
	]] 
	print(type(page)) 
```
　　有时多行字符串中可能包含有"]]"，这时可以在两个左方括号之间加上任意数量的等号，比如"[===["，这样字面字符串只有在遇到内嵌有相同数量等号的双右方括号时才会结束。
　　运行时，Lua 会自动在string 和 numbers 之间自动进行类型转换，当对一个字符串使用算术操作符时，string 就会被转成数字。
``` lua
	print("10" + 1)        --> 11 
	print("10 + 1" )     --> 10 + 1 
	print("-5.3e - 10"  * "2" )  --> -1.06e-09 
	print("hello" + 1)      -- ERROR (cannot convert "hello")
```
　　反过来，当Lua 期望一个 string 而碰到数字时，会将数字转成 string。
``` lua
	print(10 .. 20)    --> 1020
```
　　“`..`”在Lua 中是字符串连接符，当在一个数字后面写“`..`”时，必须加上空格以防止被解释错，在前面写则没事。
``` lua
	print(25 ..3)
```
　　尽管字符串和数字可以自动转换，但两者是不同的，像10 == "10" 这样的比较永远都是false的。如果需要显式将 string 转成数字可以使用函数 tonumber() ，如果 string 不是正确的数字该函数将返回 nil 。
``` lua
	line = io.read()      -- read a line 
	n = tonumber(line)    -- try to convert it to a number 
	if n == nil  then 
	 error(line .. " is not a valid number") 
	else 
	 print(n*2) 
	end
```
　　反之, 可以调用 tostring() 将数字转成字符串，这种转换一直有效：
``` lua
	print(tostring(10) == "10")   --> true 
	print(10 .. "" == "10")     --> true
```
　　字符串进行“==”运算时，比较的是字符串的内容。
<br>
**Functions**
　　函数是第一类值（和其他变量相同），意味着函数可以存储在变量中，可以作为函数的参数，也可以作为函数的返回值。这个特性给了语言很大的灵活性：一个程序可以重新定义函数增加新的功能或者为了避免运行不可靠代码创建安全运行环境而隐藏函数，此外这特性在 Lua 实现面向对象中也起了重要作用（在后面详细讲述）。可以调用 Lua 或者 C 实现的函数，Lua 所有标准库都是用 C 实现的。标准库包括 string 库、table 库、I/O 库、OS 库、算术库、debug 库。
<br>
**Userdata and Threads**
　　userdata 可以将 C 数据存放在 Lua 变量中，userdata 在Lua 中除了赋值和相等比较外没有预定义的操作。userdata 用来描述应用程序或者使用 C 实现的库创建的新类型。例如：用标准I/O 库来描述文件。下面在C API 章节中我们将详细讨论。
<br>
## 表达式 ##
　　Lua 中的表达式包括数字常量、字符串常量、变量、一元和二元运算符、函数调用。还可以是非传统的函数定义和表构造。
<br>
**算术运算符**

    二元运算符：+ - * / ^ %    (加，减，乘，除，幂，余数)  
    一元运算符：-  ( 负值)  
　　这些运算符的操作数都是实数。
<br>
**关系运算符**

    <  >  <=  >=  ==  ~=
　　这些操作符返回结果为`false`或者`true`。`==`和`~=`比较两个值是否相等和不等，如果两个值类型不同，Lua 认为两者不同。nil只和自己相等。Lua 通过引用比较 tables 、userdata、functions 。也就是说当且仅当两者表示同一个对象时相等。
``` lua
a = {}; a.x = 1; a.y = 0
b = {}; b.x = 1; b.y = 0
c = a
print(a==c) -- true
print(a~=b) -- true
```
　　Lua 比较数字按传统的数字大小进行，比较字符串按字母的顺序进行，但是字母顺序依赖于本地环境。当比较不同类型的值的时候要特别注意：
``` lua
"0"  == 0    -- false 
2 < 15     -- true 
"2"  <  "15"   -- false (alphabetical order!)
```
　　为了避免不一致的结果，使用> 、<等运算符混合比较数字和字符串，Lua 会报错，比如：`2 < "15"`。
<br>
**逻辑运算符**

    and  or  not

　　逻辑运算符认为 false 和 nil 是假（false ），其他为真，0 也是 true，and 和 or 的运算结果不是 true 和 false ，而是和它的两个操作数相关。<br>
　　范例1：and 运算符。
　　运算规则：参与 and 运算的两个操作数：

    - 若左边为false，则返回左边的操作数，否则返回右边的操作数。
    - 若两边同时为true，则返回右侧的操作数。
    - 若两边同时为false，则返回左侧的操作数。

　　和Java等其它语言中的“简洁与”运算是一样的，and 始终返回为第一个找到的false的操作数，或者最后一个找到的true的操作数。
　　比如：
``` lua
print(4  and  5)    --> 5
print(5  and  4)    --> 4
print(nil  and  13)     --> nil
print(false  and  13)    --> false
print(false  and  nil)    --> false
```
<br>　　范例2-1：or 运算符。
　　运算规则：参与 or 运算的两个操作数：

    - 若左边为true，则返回左边的操作数，否则返回右边的操作数。
    - 若两边同时为true，则返回左侧的操作数。
    - 若两边同时为false，则返回右侧的操作数。

　　和Java等其它语言中的“简洁或”运算是一样的，始终返回为第一个找到的true的操作数，或者最后一个找到的false的操作数。
　　比如：
``` lua
print(4 or 5)       --> 4
print(5 or 4)       --> 5 
print(false or 5)    --> 5
print(false or nil)    --> nil
print(nil or false)    --> false  
```
<br>　　范例2-2：一个很实用的技巧：如果 x 为 false 或者 nil 则给 x 赋初始值 v 。

	x = x or v

　　这等价于：

	if not  x  then 
	  x = v 
	end

　　范例2-3：C 语言中的三元运算符：“a? b : c”，在Lua 中的实现。

	(a  and  b) or c

<br>　　范例3：not 运算符。
　　运算规则：not 的结果一直返回 false 或者true。
``` lua
print(not  nil )    --> true 
print(not  false )     --> true 
print(not  0)     --> false 
print(not  not  nil )   --> false
```
<br>
**连接运算符**
　　“`..`” 两个点。用于字符串连接，如果操作数为数字，Lua 将数字转成字符串。
``` lua
print("Hello "  .. "World")   --> Hello World 
print(0 .. 1)       --> 01
```
<br>
**运算符优先级**
　　从高到底的顺序为：
``` lua
^ 
not  - (unary) 
*   /  %
+   - 
.. 
<  >  <=  >=  ~=  == 
and 
or
```
　　除了^和.. 外所有的二元运算符都是左连接的：
``` lua
^ 
a+i < b/2+1      	-->    (a+i) < ((b/2)+1) 
5+x^2*8    			-->  5+((x^2)*8) 
a < y and y <= z    -->    (a < y) and (y <= z) 
-x^2     			-->  -(x^2) 
x^y^z     			-->  x^(y^z)
```
<br>
## 基本语法 ##
　　Lua 像 C 和 PASCAL 一样，几乎支持所有的传统语句：赋值语句、控制结构语句、函数调用等，同时也支持非传统的多变量赋值、局部变量声明。
<br>
**赋值语句**
　　赋值是改变一个变量的值和改变表域的最基本的方法。
``` lua
a = "hello" .. "world" 
t.n = t.n + 1
```
　　Lua 可以对多个变量同时赋值，变量列表和值列表的各个元素用逗号分开，赋值语句右边的值会依次赋给左边的变量。
``` lua
a, b = 10, 2*x    --    a=10; b=2*x
```
　　遇到赋值语句Lua 会先计算右边所有的值然后再执行赋值操作，所以我们可以这样进行交换变量的值：
``` lua
x, y = y, x            		-- swap 'x' for 'y' 
a[i], a[j] = a[j], a[i]      -- swap 'a[i]' for 'a[i]'
```
<br>　　当变量个数和值的个数不一致时，Lua 会一直以变量个数为基础采取以下策略：

    a.  变量个数>值的个数     按变量个数补足 nil 
    b.  变量个数<值的个数     多余的值会被忽略
　　例如：
``` lua
a, b, c = 0, 1  
print(a,b,c)     --> 0   1   nil 
 
a, b = a+1, b+1, b+2   -- value of b+2 is ignored 
print(a,b)      --> 1   2 
 
a, b, c = 0 
print(a,b,c)     --> 0   nil   nil
```
　　上面最后一个例子是一个常见的错误情况，注意：如果要对多个变量赋值必须依次对每个变量赋值。即“a, b, c = 0, 0, 0”。<br>
　　多值赋值经常用来交换变量，或将函数调用返回给变量，比如f() 返回两个值，第一个赋给a ，第二个赋给 b ：
``` lua
a, b = f()
```
<br>
**局部变量与代码块**
　　使用 local 创建一个局部变量，与全局变量不同，局部变量只在被声明的那个代码块内有效。不用 local 关键字声明的变量即便是在代码块中声明，它也是全局变量。
　　代码块：指一个控制结构内，一个函数体，或者一个 chunk （变量被声明的那个文件或者文本串）。
<br>　　范例1：全局变量。
``` lua
function say()
  s = "Hello World"
end
say();
print(s)
```

    语句解释：
    - Lua使用function关键字来定义函数，函数的知识后面会介绍，此处只需要知道上面的代码定义了一个名为say的函数。
    - Lua代码是自顶向下执行的，因此必须得调用一下say()函数，才会创建变量s，否则print将输出nil。
    - 在print()函数中可以引用到全局变量s的值。
<br>　　范例2：局部变量。
``` lua
function say()
  local s = "Hello World"
end
say();
print(s)
```

    语句解释：
    - 此时print()函数则引用不到s的值，只能输出一个nil。
<br>　　范例3：本地变量和全局变量重名。
``` lua
s = "A"
function say()
  local s = "Hello World"
  print(s)
end
say();
print(s)
```

    语句解释：
    - 同其他变成语言一样，局部变量的作用域内，全局变量会被隐藏掉，即不再起作用。
    - 程序输出：
     Hello World
     A
<br>　　应该尽可能的使用局部变量，有两个好处：
　　1. 避免命名冲突。
　　2. 访问局部变量的速度比全局变量更快。
　　我们给block划定一个明确的界限：do..end 内的部分。当你想更好的控制局部变量的作用范围的时候这是很有用的。
<br>　　范例4：自定义代码快。
``` lua
do
  local  a = 3
  local  b = 7
  x1 = a + b
  x2 = a - b
end
print(x1, x2, a, b)			-- 输出 10 -4 nil nil
```

<br>
**控制结构语句**
　　控制结构的条件表达式结果可以是任何值，Lua 认为 false 和 nil 为假，其他值为真。
<br>　　范例1：if 语句。if 语句，有三种形式：
``` lua
if conditions then  
 -- then-part 
end


if conditions then  
 -- then-part 
else 
 -- else-part 
end


if conditions then  
 -- then-part 
elseif conditions then  
 -- elseif-part 
else 
 -- else-part 
end

```
<br>　　范例2：while 语句。
``` lua
while  condition  do 
 statements; 
end ;

-- 比如：
n = 4;
while n >= 1 do
  print(n)
  n = n - 1
end
```
<br>　　范例3：repeat-until 语句。
``` lua
repeat 
 statements; 
until  conditions;

-- 比如：
n = 4
repeat 
 print(n);
 n = n - 1  
until n>=0;
```

    语句解释：
    - repeat-until和其他语言的do...while()语句是一样的。

<br>
**for 语句**
　　for 语句也属于控制结构语句，由于篇幅较长所以单列为一个部分。for 语句有两大类：
　　•　数值 for 循环。
　　•　泛型 for 循环。（后述）

<br>　　范例1-1：数值 for 循环。
``` lua
for  var=exp1,exp2,exp3  do 
 loop-part 
end
```

    语句解释：
    - for 将用exp3 作为step ，然后从exp1 （初始值）到 exp2 （终止值），执行loop-part 。
    - 其中exp3 可以省略，默认 step=1。
<br>　　范例1-2：应用。
``` lua
for i=4,10,2 do
  print(i)
end
```

    语句解释：
    - 每次循环叠加2，如果想递减则可以将第三个参数设置为负数。<br>
<br>　　关于数值 for 语句有几点需要注意：
　　1. 三个表达式只会被计算一次，并且是在循环开始前。
``` lua
for  i=1,f(x)  do 
 print(i) 
end 
```

    语句解释：
    - 在上面的代码中， f(x) 只会在循环前被调用一次。
　　2. 控制变量 var 是局部变量自动被声明, 并且只在循环内有效。
``` lua
for  i=1,10  do 
 print(i) 
end 
-- 在for循环外部输出i，结果为nil 。
print(i) 

-- 如果需要保留控制变量的值，需要在循环中将其保存： 
local  found = nil  
for  i=1,a.n do 
  if a[i] == value  then 
     found = i   -- save value of 'i' 
   break 
  end 
end 
print(found)
```
　　3. for 循环的过程中不要改变控制变量的值，那样做的结果是不可预知的。如果要退出循
环，使用break语句。

<br>
**break 和 return 语句 **
　　break 语句用来退出当前循环（for,repeat,while）。在循环外部不可以使用。return 用来从函数返回结果，当一个函数自然结束结尾会有一个默认的 return 。（这种函数类似pascal 的过程）。
　　Lua 语法要求 break 和 return 只能出现在 block 的结尾一句（也就是说：作为 chunk 的最后一句，或者在 end 之前，或者 else 前，或者 until 前），例如：
``` lua
local  i = 1 
while  a[i] do 
  if a[i] == v then break  end  
  i = i + 1 
end
```
<br>
**表的构造 **
　　表是 Lua 特有的功能强大的东西。“ {} ” 用来创建一个空表，表是Lua中唯一的数据结构，需要用表来实现一切东西：数组、map等。 
　　构造函数是指创建和初始化表的表达式。

<br>　　范例1：数组。
``` lua
days = { "Sunday" , "Monday" , "Tuesday", "Wednesday", 
     "Thursday" , "Friday" , "Saturday" }
print(days[4])   --> Wednesday
```

    语句解释：
    - Lua 将"Sunday" 初始化days[1]（第一个元素索引为 1），用"Monday"初始化days[2]...。
    - Lua不存在数组越界的异常，访问不再的下标会得到一个nil。
　　表可以使用任何表达式初始化：
``` lua
tab = {sin(1), sin(2), sin(3), sin(4), 
   sin(5),sin(6), sin(7), sin(8)}
```
　　不管用何种方式创建表（table） ，我们都可以向表中添加或者删除任何类型的域，构造函数仅仅影响表的初始化。

<br>　　范例2：map。
``` lua
w = {x=10, y=11, label="console"} 
print(w["x"])
print(w.label)
```

    语句解释：
    - 表支持key-value的形式，访问元素的时候通过key来访问（如上的两种方式）。

<br>　　范例3：数组与map混合。
``` lua
function add(a,b)
  return a+b
end
w = {add(0,4),x=10, y=20, label="console",add(4,5)} 
print(w[1])
print(w[2])
```

    语句解释：
    - map表支持key-value的形式，访问元素的时候通过key来访问（如上的两种方式）。

<br>　　范例4：混合运算。
``` lua
function add(a,b)
  return a+b
end
w = {x=0, y=0, label="console"} 
x = {add(0,4),add(4,5)} 
w[1] = "another field"  
x.f = w 
print(w[ "x" ])   --> 0 
print(w[1])   --> another field 
print(x.f[1])   --> another field 
w.x = nil      -- remove field "x" 
```

<br>　　范例5：在同一个构造函数中可以混合列表风格和 record 风格进行初始化，如：
``` lua
polyline = {color= "blue", thickness=2, npoints=4, 
    {x=0,   y=0}, 
    {x=-10, y=0}, 
    {x=-10, y=1}, 
    {x=0,   y=1} 
} 
print(polyline[2].x)   --> -10
```

    语句解释：
    - 这个例子也表明我们可以嵌套构造函数来表示复杂的数据结构。
<br>　　上面两种的初始化方式（数组和map）还有限制，比如 map 中的 key 中并不能包含特殊的字符，如“-”减号，并且数组中的元素的下表也不能是一个负数。下面介绍一种更一般的初始化方式，我们用“[expression]”显示的表示将被初始化的索引：
``` lua
opnames = {["+" ] = "add" , [ "-" ] = "sub" , 
    ["*" ] = "mul" , [ "/" ] = "div" } 
i = 20; s = "-"  
a = {[i+0] = s, [i+1] = s..s, [i+2] = s..s..s} 
 
print(opnames[s])   --> sub 
print(a[22])     --> ---
```

    语句解释：
    - 若“[]”中的表达式的值是数字，则意味着为元素指定下标，可以通过“表名[下标]”的方式访问。
    - 若表达式的值是字符串，则需要使用“表名["key"]”方式读取，如果key中不包含特殊字符，则也可以使用“表名.key”的
    方式读取。
<br>　　范例6：数组下标从0开始。
``` lua
days = {[0]="Sunday", "Monday", "Tuesday", "Wednesday", 
    "Thursday", "Friday", "Saturday"}
```

    语句解释：
    - 注意：不推荐数组下标从0 开始，否则很多标准库不能使用。
　　在构造函数的最后的"**,**"是可选的，可以方便以后的扩展：
``` lua
a = {[1]="red" , [2]="green", [3]="blue",}
```
　　在构造函数中域分隔符逗号（","）可以用分号（";"）替代，通常我们使用分号用来分割不同类型的表元素：
``` lua
{x=10, y=45;  "one" , "two" , "three"}
```
<br>
**泛型 for 循环 **
　　泛型 for 循环用来遍历一个数组或者一个map。

<br>　　范例1：遍历数组。
``` lua
list = {"a","b","c","d"}
for i,v in ipairs(list)  do
  print("position = " .. i .. " value = " ..v)
end
```

    语句解释：
    - 关于泛型for的具体语法介绍将在后面章节进行，本节只介绍如何使用它。
    - ipairs()函数每次返回两个值，第一个是元素的下标，第二个是该下标上的元素的值。

<br>　　范例2：混合的表。
``` lua
list = {"a",t1="t1","b",t2="t2","c","d"}
for i,v in ipairs(list)  do
  print("position = " .. i .. " value = " ..v)
end
```

    语句解释：
    - 注意ipairs()函数只会返回具有下标的元素，本范例中t1和t2没有下标，所以不会被打印出来，并且他们也不会影响下
    标的计算。

<br>　　范例3：获取下标和 key 。
``` lua
list = {"a",t1="t1","b",t2="t2","c","d"}
for i,v in pairs(list)  do
  print("position = " .. i .. " value = " ..v)
end
```

    语句解释：
    - 使用pairs()函数也可以获取每一个元素，该函数的第一个返回值：
      - 对于没有明确指定key的元素，返回值为它的下标。
      - 对于有key的元素，返回它的key。
    - pairs()函数先返回具有下标的元素，后返回具有key的元素。
　　如果你对范型for 还有些不清楚在后面的章节我们会继续来学习。
<br>
## 函数 ##
　　函数有两种用途：
　　1. 完成指定的任务，这种情况下函数作为调用语句使用；
　　2. 计算并返回值，这种情况下函数作为赋值语句的表达式使用。
<br>　　范例1：语法。
``` lua
function  func_name (arguments-list) 
 statements-list; 
end
```
　　调用函数的时候，如果参数列表为空，必须使用()表明是函数调用。
``` lua
print(8*9, 9/8) 
a = math.sin(3) + math.cos(10) 
print(os.date())
```
　　上述规则有一个例外，当函数只有一个参数并且这个参数是字符串或者表构造的时候，() 是可选的：
``` lua
print "Hello World"   -->  print("Hello World" ) 
dofile 'a.lua'   -->  dofile('a.lua') 
print [[a multi-line]]   -->    print([[a multi-line message]]) 
f{x=10, y=20}    -->  f({x=10, y=20}) 
type{}      -->  type({})
```

    提示：
    - Lua也提供了面向对象方式调用函数的语法，比如 o:foo(x) 与 o.foo(o, x) 是等价的，后面的章节会详细介绍面向
    对象内容。
    - Lua使用的函数可以是 Lua 编写也可以是其他语言编写，对于Lua 程序员来说用什么语言实现的函数使用起来都一样。
　　Lua 函数实参和形参的数量可以不一样，它们的匹配与赋值语句类似，多余部分被忽略，缺少部分用nil补足：
``` lua
function  f(a, b) return a  or b  end  
-- 函数调用
f(3)    -- a=3, b=nil 
f(3, 4)   -- a=3, b=4 
f(3, 4, 5)    -- a=3, b=4  (5 is discarded)
```
<br>
**返回多个值 **
　　Lua 函数可以返回多个结果值，比如 string.find，其返回匹配串“开始和结束的下标”（如果不存在匹配串返回nil）。
``` lua
s, e = string.find("hello Lua users", "Lua" ) 
print(s, e)    --> 7  9
```
　　Lua 函数中，在 return 后列出要返回的值得列表即可返回多值，如：
``` lua
function  maximum (a) 
  local  mi = 1        -- maximum index 
  local  m = a[mi]      -- maximum value 
  for  i,val in ipairs(a) do 
   if val > m then 
   mi = i 
   m = val 
   end 
  end 
  return m, mi 
end 
print(maximum({8,10,23,12,5}))   --> 23   3
```

<br>　　Lua 总是调整函数返回值的个数去适用调用环境，当作为一个语句调用函数时，所有返回值被忽略。假设有如下三个函数：
``` lua
function  foo0 () end        -- returns no results 
function  foo1 () return 'a'  end     -- returns 1 result 
function  foo2 () return 'a','b' end   -- returns 2 results
```
<br>　　第一，当作为表达式调用函数时，有以下2种情况：
　　1. 当调用作为表达式最后一个参数或者仅有一个参数时，根据变量个数函数尽可能多地返回多个值，不足补nil，超出舍去。
　　2. 其他情况下，函数调用仅返回第一个值（如果没有返回值为 nil）
``` lua
x,y = foo2()        -- 此时x='a', y='b' 
x = foo2()         -- 此时 x='a', y='b'
x,y,z = 10,foo2()    -- 此时x=10, y='a', z='b' 
x,y = foo0()        -- 此时x=nil, y=nil 
x,y = foo1()        -- 此时 x='a', y=nil 
x,y,z = foo2()      -- 此时x='a', y='b', z=nil
x,y = foo2(), 20      -- 此时x='a', y=20 
x,y = foo0(), 20, 30   -- 此时x='nil', y=20, 30 is discarded
```
<br>　　第二，函数调用作为函数参数被调用时，和多值赋值是相同。
``` lua
print(foo0())     --> 
print(foo1())     --> a 
print(foo2())     --> a   b 
print(foo2(), 1)      --> a   1 
print(foo2() .. "x" )   --> ax
```
<br>　　第三，函数调用在表构造函数中初始化时，和多值赋值时相同。
``` lua
a = {foo0()}        -- a = {}    (an empty table) 
a = {foo1()}        -- a = {'a'} 
a = {foo2()}        -- a = {'a', 'b'} 
a = {foo0(), foo2(), 4}  -- a[1] = nil, a[2] = 'a', a[3] = 4
```
<br>　　另外，return f() 这种类型的语句，将返回 f() 返回的所有值。
``` lua
function  foo (i) 
  if i == 0  then return foo0() 
  elseif i == 1  then return foo1() 
  elseif i == 2  then return foo2() 
  end 
end 
print(foo(1))     --> a 
print(foo(2))     --> a  b 
print(foo(0))     -- (no results) 
print(foo(3))     -- (no results)
```
　　可以使用圆括号强制使调用返回一个值：
``` lua
print((foo0()))   --> nil 
print((foo1()))   --> a 
print((foo2()))   --> a
```

    提示：
    - 一个 return 语句如果使用圆括号将返回值括起来也将导致返回一个值。
<br>　　函数多值返回的特殊函数 unpack ，接受一个数组作为输入参数，返回数组的所有元素。unpack 被用来实现范型调用机制，在 C 语言中可以使用函数指针调用可变的函数，可以声明参数可变的函数，但不能两者同时可变。在 Lua 中如果你想调用可变参数的可变函数只需要这样：
``` lua
f(unpack(a))
```
　　比如：
``` lua
a = {'A','B','C','D'}
print(a)    -- table: 00000000071CD6A0
print(unpack(a)) -- A B C D
```
　　预定义的unpack 函数是用 C 语言实现的，我们也可以用 Lua 来完成：
``` lua
function  unpack(t, i) 
  i = i  or 1 
  if t[i] then 
   return t[i], unpack(t, i + 1) 
  end 
end
```
<br>
**可变参数**
　　Lua 函数可以接受可变数目的参数，和 C 语言类似在函数参数列表中使用三点（... ）表示函数有可变的参数。Lua 将函数的参数放在一个叫 arg 的表中，除了参数以外，arg表中还有一个域n 表示参数的个数。
　　例如，我们可以仿写print 函数：
``` lua
printResult = "" 
function  output(...) 
  for  i,v  in ipairs(arg)  do 
    printResult = printResult .. tostring(v) .. "\t" 
  end 
  printResult = printResult .. "\n" 
  return printResult
end 
print(output(4,5,6,7))
```
　　有时候我们可能需要几个固定参数加上可变参数：
``` lua
function  g (a, b, ...)  end  
-- CALL PARAMETERS 
g(3)    -- a=3, b=nil, arg={n=0} 
g(3, 4)   -- a=3, b=4, arg={n=0} 
g(3, 4, 5, 8)   -- a=3, b=4, arg={5, 8; n=2}
```
　　如上面所示，Lua 会将前面的实参传给函数的固定参数，后面的实参放在 arg 表中。<br>
　　举个具体的例子，如果我们只想要 string.find 返回的第二个值，则一个典型的方法是使用虚变量（下划线）：
``` lua
local  _, x = string.find(s, p) 
-- now use `x' 
...
```
　　还可以利用可变参数声明一个select 函数：
``` lua
function  select (n, ...) 
  return arg[n] 
end 
 
print(string.find( "hello hello" , " hel"))     --> 6  9 
print(select(1, string.find( "hello hello" , " hel"))) --> 6 
print(select(2, string.find( "hello hello" , " hel"))) --> 9
```

    语句解释：
    - 可变参数会保存在一个名为arg的表中，它是个局部变量。
<br>　　有时候需要将函数的可变参数传递给另外的函数调用，可以使用前面我们说过的 unpack(arg) 返回 arg 表所有的可变参数，Lua 提供了一个文本格式化的函数 string.format（类似C 语言的 sprintf 函数）：
``` lua
function  fwrite(fmt, ...) 
  return io.write(string.format(fmt, unpack(arg))) 
end 
fwrite("%10d",2)
```
　　这个例子将文本格式化操作和写操作组合为一个函数。
<br>
**命名参数**
　　Lua 的函数参数是和位置相关的，调用时实参会按顺序依次传给形参。有时候用名字指定参数是很有用的，比如 rename 函数用来给一个文件重命名，有时候我们我们记不清两个参数的前后顺序了：
``` lua
-- invalid code 
rename(old="temp.lua" , new="temp1.lua")
```
　　上面这段代码是无效的，Lua 可以通过将所有的参数放在一个表中，把表作为函数的唯一参数来实现上面这段伪代码的功能。因为 Lua 语法支持函数调用时实参可以是表的构造。
``` lua
rename{old="temp.lua" , new="temp1.lua"}
```
　　根据这个想法我们重定义了rename ：
``` lua
function  rename (arg) 
  return os.rename(arg.old, arg.new) 
end
```
　　当函数的参数很多的时候，这种函数参数的传递方式很方便的。例如 GUI 库中创建窗体的函数有很多参数并且大部分参数是可选的，可以用下面这种方式（伪代码）：
``` lua
w = Window { 
  x=0, y=0, width=300, height=200, 
 title = "Lua" , background= "blue", 
 border = true 
} 
 
function  Window (options) 
  -- check mandatory options 
  if type(options.title) ~= "string"  then 
  error("no title" ) 
  elseif type(options.width) ~= "number"  then 
  error("no width" ) 
  elseif type(options.height) ~=  "number"  then 
  error("no height") 
end 
 
-- everything else is optional 
 _Window(options.title, 
  options.x or 0,      -- default value 
  options.y or 0,      -- default value
  options.width, options.height, 
  options.background or "white", -- default 
  options.border   -- default is false (nil) 
 ) 
```
<br>
## 再论函数 ##
　　Lua 中的函数是带有词法定界（lexical scoping）的第一类值（first-class values ）。 
　　第一类值指：在 Lua 中函数和其他值（数值、字符串）一样，函数可以被存放在变量中，也可以存放在表中，可以作为函数的参数，还可以作为函数的返回值。
　　词法定界指：被嵌套的函数可以访问他外部函数中的变量。这一特性给 Lua 提供了强大的编程能力。<br>
　　Lua 中关于函数稍微难以理解的是函数也可以没有名字，匿名的。当我们提到函数名（比如print），实际上是说一个指向函数的变量，像持有其他类型值的变量一样：
``` lua
a = {p = print} 
a.p("Hello World" )  --> Hello World 
print = math.sin -- `print' now refers to the sine function 
a.p(print(1))   --> 0.841470 
sin = a.p      -- `sin' now refers to the print function 
sin(10, 20)    --> 10   20
```
　　既然函数是值，那么表达式也可以创建函数了，Lua 中我们经常这样写：
``` lua
function  foo (x) return 2*x  end  
```
　　这实际上是利用Lua 提供的“语法上的甜头”（syntactic sugar）的结果，下面是原本的函数：
``` lua
foo = function  (x)  return 2*x  end    
```
　　函数定义实际上是一个赋值语句，将类型为 function 的值赋给一个变量。我们使用 function (x) ... end 来定义一个函数，这和使用 { } 创建一个表一样。<br>
　　table标准库提供一个排序函数，接受一个表作为输入参数并且排序表中的元素。它必须能够按升序或者降序对不同类型的值（字符串或者数值）进行排序。Lua 不是尽可能多地提供参数来满足这些情况的需要，而是接受一个排序函数作为参数，排序函数接受两个排序元素作为输入参数，并且返回两者的大小关系（排序函数与Java中的Comparable接口类似），例如：
``` lua
network = { 
 {name = "grauna" ,  IP = "210.26.30.34"}, 
 {name = "arraial", IP = "210.26.30.23"}, 
 {name = "lua" ,  IP =  "210.26.23.12"}, 
 {name = "derain" ,  IP = "210.26.23.20"}, 
}   
```
　　如果我们想通过表的name域排序：
``` lua
table.sort(network,  function  (a,b) 
  return (a.name > b.name) 
end )  
```
　　以其他函数作为参数的函数在Lua 中被称作高级函数，高级函数在 Lua 中并没有特权，只是Lua 把函数当作第一类函数处理的一个简单的结果。
<br>
** 闭包 **
　　当一个函数内部嵌套另一个函数定义时，内部的函数体可以访问外部的函数的局部变量，这种特征我们称作词法定界。虽然这看起来很清楚，事实并非如此，词法定界加上第一类函数在编程语言里是一个功能强大的概念，很少语言提供这种支持。
　　下面看一个简单的例子，假定有一个学生姓名的列表和一个学生名和成绩对应的表；现在想根据学生的成绩从高到低对学生进行排序，可以这样做：
``` lua
names = {"Peter", "Paul", "Mary"} 
grades = {Mary = 10, Paul = 7, Peter = 8} 
table.sort(names,  function  (n1, n2) 
  return grades[n1] > grades[n2]    -- compare the grades 
end ) 
```
　　假定创建一个函数实现此功能：
``` lua
function  sortbygrade (names, grades) 
 table.sort(names, function  (n1, n2) 
   return grades[n1] > grades[n2]     -- compare the grades 
  end ) 
end 
```
　　例子中包含在 sortbygrade 函数内部的 table.sort 中的匿名函数可以访问 sortbygrade 的参数 grades ，在匿名函数内部 grades 不是全局变量也不是局部变量，我们称作**外部的局部变量**（external local variable ）或者 upvalue。（upvalue意思有些误导，然而在 Lua 中他的存在有历史的根源，还有他比起 external local variable 简短）。<br>
　　看下面的代码：
``` lua
function  newCounter() 
  local  i = 0 
  return function ()      -- anonymous function 
    i = i + 1 
   return i 
  end 
end 
 
c1 = newCounter() 
print(c1())  --> 1 
print(c1())  --> 2
```
　　匿名函数使用 upvalue i 保存他的计数，当我们调用匿名函数的时候 i 已经超出了作用范围，因为创建 i 的函数 newCounter 已经返回了。然而 Lua 用闭包的思想正确处理了这种情况。简单的说闭包是一个函数加上它可以正确访问的 upvalues 。如果我们再次调用 newCounter，并把它赋值给c2 ，将创建一个新的局部变量 i ，因此我们得到了一个作用在新的变量 i 上的新闭包：
``` lua
c2 = newCounter() 
print(c2())  --> 1 
print(c1())  --> 3 
print(c2())  --> 2
```
　　c1 、c2 是建立在同一个函数上，但作用在同一个局部变量的不同实例上的两个不同的闭包。<br>
　　技术上来讲，闭包指值而不是指函数，函数仅仅是闭包的一个原型声明；尽管如此，在不会导致混淆的情况下我们继续使用术语函数代指闭包。<br>
　　闭包在上下文环境中提供很有用的功能，如前面我们见到的可以作为高级函数（sort）的参数；作为函数嵌套的函数（newCounter）。这一机制使得我们可以在 Lua 的函数世界里组合出奇幻的编程技术。闭包也可用在回调函数中，比如在 GUI 环境中你需要创建一系列 button ，但用户按下 button 时回调函数被调用，可能不同的按钮被按下时需要处理的任务有点区别。具体来讲，一个十进制计算器需要 10 个相似的按钮，每个按钮对应一个数字，可以使用下面的函数创建他们：
``` lua
function  digitButton (digit) 
  return Button{  label = digit, 
   action = function  () 
    add_to_display(digit) 
    end 
 } 
end
```
　　这个例子中我们假定 Button 是一个用来创建新按钮的工具， label 是按钮的标签，action 是按钮被按下时调用的回调函数。（实际上是一个闭包，因为它访问 upvalue digit）。digitButton 完成任务返回后，局部变量 digit 超出范围，回调函数仍然可以被调用并且可以访问局部变量digit 。<br>
　　闭包在完全不同的上下文中也是很有用途的。因为函数被存储在普通的变量内我们可以很方便的重定义或者预定义函数。通常当你需要原始函数有一个新的实现时可以重定义函数。例如你可以重定义 sin 使其接受一个度数而不是弧度作为参数：
``` lua
oldSin = math.sin 
math.sin = function  (x) 
  return oldSin(x*math.pi/180) 
end
```
　　更清楚的方式：
``` lua
do 
  local  oldSin = math.sin 
  local  k = math.pi/180 
  math.sin = function  (x) 
     return oldSin(x*k) 
  end 
end
```
　　这样我们把原始版本放在一个局部变量内，访问sin的唯一方式是通过新版本的函数。<br>
　　利用同样的特征我们可以创建一个安全的环境（也称作沙箱，和 java 里的沙箱一样），当我们运行一段不信任的代码（比如我们运行网络服务器上获取的代码）时安全的环境是需要的，比如我们可以使用闭包重定义 io 库的 open 函数来限制程序打开的文件。
``` lua
do 
  local  oldOpen = io.open 
  io.open = function  (filename, mode) 
   if access_OK(filename, mode) then 
    return oldOpen(filename, mode) 
   else 
    return nil , "access denied"  
   end 
  end 
end
```
<br>
** 非全局函数 **
　　Lua 中函数可以作为全局变量也可以作为局部变量，我们已经看到一些例子：函数作为 table 的域（大部分 Lua 标准库使用这种机制来实现的比如 io.read 、math.sin）。这种情况下，必须注意函数和表语法：

<br>　　范例1：表和函数放在一起。
``` lua
Lib = {} 
Lib.foo =  function  (x,y) return x + y end  
Lib.goo =  function  (x,y) return x - y end  
```

<br>　　范例2：使用表构造函数。
``` lua
Lib = { 
 foo = function  (x,y) return x + y end , 
 goo = function  (x,y) return x - y end  
}  
```

<br>　　范例3：Lua 提供另一种语法方式。
``` lua
Lib = {} 
function  Lib.foo (x,y) 
  return x + y 
end 
function  Lib.goo (x,y) 
  return x - y 
end 
```
　　当我们将函数保存在一个局部变量内时，我们得到一个局部函数，也就是说局部函数像局部变量一样在一定范围内有效。这种定义在包中是非常有用的：因为Lua 把 chunk 当作函数处理，在 chunk 内可以声明局部函数（仅仅在 chunk 内可见），词法定界保证了包内的其他函数可以调用此函数。下面是声明局部函数的两种方式：<br>
　　方式一：
``` lua
local  f =  function  (...) 
 ... 
end 
 
local  g =  function  (...) 
 ... 
  f()   -- external local `f' is visible here 
 ... 
end
```
<br>　　方式二：
``` lua
local  function  f (...) 
 ... 
end
```
　　有一点需要注意的是在声明递归局部函数的方式：
``` lua
local  fact =  function  (n) 
  if n == 0  then 
   return 1 
  else 
   return n*fact(n-1)  -- buggy 
  end 
end
```
　　上面这种方式导致Lua 编译时遇到 fact(n-1) 并不知道它是局部函数 fact ，Lua 会去查找是否有这样的全局函数fact ，运行时会抛异常。为了解决这个问题我们必须在定义函数以前先声明：
``` lua
local  fact 
fact = function  (n) 
  if n == 0  then 
  return 1 
  else 
  return n*fact(n-1) 
  end 
end
```
　　这样在 fact 内部 fact(n-1) 调用是一个局部函数调用，运行时 fact 就可以获取正确的值了。
<br>
** 正确的尾调用 **
　　Lua 中函数的另一个有趣的特征是可以正确的处理尾调用（proper tail recursion，一些书使用术语“尾递归”，虽然并未涉及到递归的概念）。
　　尾调用是一种类似在函数结尾的 goto 调用，当函数最后一个动作是调用另外一个函数时，我们称这种调用尾调用。例如：
``` lua
function  f(x) 
  return g(x) 
end
```

    语句解释：
    - g 的调用是尾调用。
    - 例子中 f 调用 g 后不会再做任何事情，这种情况下当被调用函数 g 结束时程序不需要返回到调用者 f ；所以尾调用
    之后程序不需要在栈中保留关于调用者的任何信息。一些编译器比如 Lua 解释器利用这种特性在处理尾调用时不使用额外的
    栈，我们称这种语言支持正确的尾调用。
　　由于尾调用不需要使用栈空间，那么尾调用递归的层次可以无限制的。<br>
　　需要注意的是：必须明确什么是尾调用。一些调用者函数调用其他函数后虽然也没有做其他的事情但它还是不属于尾调用。比如：
``` lua
function  f (x) 
  g(x) 
  return 
end 
```
　　上面这个例子中 f 在调用 g 后，不得不丢弃 g 地返回值，所以不是尾调用，同样的下面几个例子也不是尾调用：
``` lua
return  g(x) + 1    -- must do the addition 
return  x or g(x)    -- must adjust to 1 result 
return  (g(x))     -- must adjust to 1 result 
```

<br>　　范例1：栈溢出。
``` lua
local function deep(a)
  print(a)
  deep(a-1)
  return
end
deep(10)
```

    语句解释：
    - 在本人的电脑中，打印到-16368时抛出栈溢出异常。

<br>　　范例2：使用尾调用。
``` lua
local function deep(a)
  print(a)
  return deep(a-1)
end
deep(10)
```

    语句解释：
    - 本范例绝对不会发生栈溢出，程序会一直执行下去。
　　Lua 中类似 return g(...) 这种格式的调用是尾调用。但是 g 和 g 的参数都可以是复杂表达式，因为 Lua 会在调用之前计算表达式的值。例如下面的调用是尾调用：
``` lua
return x[i].foo(x[j] + a*b, i + j)
```
　　可以将尾调用理解成一种goto，在状态机的编程领域尾调用是非常有用的。状态机的应用要求函数记住每一个状态，改变状态只需要 goto(or call) 一个特定的函数。我们考虑一个迷宫游戏作为例子：迷宫有很多个房间，每个房间有东西南北四个门，每一步输入一个移动的方向，如果该方向存在即到达该方向对应的房间，否则程序打印警告信息。目标是：从开始的房间到达目的房间。<br>
　　如果没有正确的尾调用，每次移动都要创建一个栈，多次移动后可能导致栈溢出。但正确的尾调用可以无限制的尾调用，因为每次尾调用只是一个goto 到另外一个函数并不是传统的函数调用。
<br>
## 迭代器与泛型for ##
　　在这一章我们讨论为范性for 写迭代器，我们从一个简单的迭代器开始，然后我们学习如何通过利用范性for 的强大之处写出更高效的迭代器。
<br>
**迭代器与闭包 **
　　迭代器是一种支持指针类型的结构，它可以遍历集合的每一个元素。在 Lua 中我们常常使用函数来描述迭代器，每次调用该函数就返回集合的下一个元素。Lua 中的迭代器和 Java 中的 Iterator 是相同的，它们只负责提供下一个元素，而具体的迭代功能则是由 while 、for 语句来完成的。
　　迭代器需要保留上一次成功调用的状态和下一次成功调用的状态，也就是他知道来自于哪里和将要前往哪里。闭包提供的机制可以很容易实现这个任务。记住：闭包是一个内部函数，它可以访问一个或者多个外部函数的外部局部变量。每次闭包的成功调用后这些外部局部变量都保存他们的值（状态）。当然如果要创建一个闭包必须要创建其外部局部变量。所以一个典型的闭包的结构包含两个函数：一个是闭包自己；另一个是工厂（创建闭包的函数）。
　　举一个简单的例子，我们为一个 list 写一个简单的迭代器，与 ipairs() 不同的是我们实现的这个迭代器返回元素的值而不是索引下标：
``` lua
function  list_iter (t) 
  local  i = 0 
  local  n = table.getn(t) 
  return function () 
    i = i + 1 
    if i <= n  then return t[i] end  
  end 
end
```
　　这个例子中 list_iter 是一个工厂，每次调用他都会创建一个新的闭包（迭代器本身）。闭包保存内部局部变量(t,i,n)，因此每次调用他返回 list 中的下一个元素值，当 list 中没有值时，就不返回值。我们可以在 while 语句中使用这个迭代器：
``` lua
t = {10, 20, 30} 
iter = list_iter(t)    -- creates the iterator 
while true do 
  local element = iter()  -- calls the iterator 
  if element == nil  then break  end  
  print(element)
end
```
<br>　　我们设计的这个迭代器也很容易用于范型for 语句，范型for 会为迭代循环处理所有的工作：
　　1.   首先调用迭代工厂；并在其内部保留迭代函数，因此我们不需要 iter 变量；
　　2.   然后在每一个新的迭代处调用迭代器函数；当迭代器返回 nil 时循环结束。

<br>　　范例1：使用范型for。
``` lua
t = {10, 20, 30} 
for element in list_iter(t) do 
 print(element) 
end
```

    语句解释：
    - 使用范型for代码就变得简洁了。
　　下面看一个稍微高级一点的例子：我们写一个迭代器遍历一个文件内的所有匹配的单词。为了实现目的，我们需要保留两个值：当前行和在当前行的偏移量，我们使用两个外部局部变量line 、pos 保存这两个值。
``` lua
function allwords() 
  local  line = io.read()  -- current line 
  local  pos = 1       -- current position in the line 
  return function ()    -- iterator function 
   while  line do     -- repeat while there are lines 
     local  s, e = string.find(line, "%w+" , pos) 
     if s  then     -- found a word? 
       pos = e + 1 -- next position is after this word 
       return string.sub(line, s, e)  -- return the word 
     else 
       line = io.read()  -- word not found; try next line 
       pos = 1  -- restart from first position 
     end 
   end 
   return nil    -- no more lines: end of traversal 
  end 
end
```
　　迭代函数的主体部分调用了 string.find 函数，string.find 在当前行从当前位置开始查找匹配的单词，例子中匹配的单词使用模式 '%w+' 描述的；如果查找到一个单词，迭代函数更新当前位置 pos 为单词后的第一个位置，并且返回这个单词（string.sub 函数从line中提取两个位置参数之间的子串）。否则迭代函数读取新的一行并重新搜索。如果没有 line 可读返回 nil 结束。<br>
　　尽管迭代函数有些复杂，但使用起来是很直观的：
``` lua
for word in allwords() do
print(word) 
end
```
　　通常情况下，迭代函数都难写易用。这不是一个大问题：一般 Lua 编程不需要自己定义迭代函数，而是使用语言提供的, 除非确实需要自己定义。
<br>
**泛型for的语义 **
　　泛型for 的语法如下：
``` lua
for <var-list> in <exp-list> do 
 <body>
end
```
　　其中，var-list 是一个或多个以逗号分割的变量名列表，exp-list 是一个或多个以逗号分割的表达式列表，通常情况下 exp-list 只有一个元素。如：
``` lua
for k, v in pairs(t) do 
 print(k, v) 
end
```

    语句解释：
    - 变量列表：k , v	表达式列表：pair(t) 。
　　在很多情况下变量列表也只有一个变量，比如：
``` lua
for line in io.lines() do 
 io.write(line, '\n') 
end
```
　　for 语句将 var-list 中的第一个元素视为“**循环结束变量**”。当它的值为 nil 时，for 循环就结束了。<br>
　　下面看看泛型for执行的过程：

    - 首先，计算 in 后面 exp-list 的值。 
      - 通常 exp-list 需要有三个表达式：迭代函数，状态常量和控制变量。
      - 与多值赋值一样，如果 exp-list 的个数不足三个会自动用 nil 补足，多出部分会被忽略。 
      - 但是 exp-list 应该至少包含一个值：迭代函数。
    - 第二，每次for循环时，for语句都会将状态常量和控制变量作为参数调用迭代函数（注意：如果第一步没有指定这两个变
    量，则将会传递给迭代函数nil）。
    - 第三，将迭代函数返回的值赋给for语句的变量列表。
    - 第四，如果迭代函数返回的第一个值为 nil 则循环结束，否则将 var-list 中的第一个元素赋值给 exp-list 的控制
    变量，然后执行循环体。
    - 第五，回到第二步再次调用迭代函数。
　　如果用代码描述上面的过程，则这个过程等价于：
``` lua
do 
  local  _f, _s, _var = explist 
  while  true do 
    local  var_1, ... , var_n = _f(_s, _var)
    _var = var_1 
    if _var == nil  then break  end  
    -- block 
  end 
end
```

<br>　　范例1：表达式列表只返回一个值。
``` lua
function iter_factory(t)
    local i = 0
    local c = table.getn(t)
    return function()
      if i <= c then i = i + 1 return t[i] end
    end
end
t = {"A","B","C","D"}
for item in iter_factory(t) do
  print(item)
end
```

    语句解释：
    - 迭代器工厂函数iter_factory()只返回了一个值，即只有迭代函数，没有状态常量和控制变量。

<br>　　范例2：表达式列表返回两个值。
``` lua
local function iter (a, i)
  i = i + 1
  local v = a[i]
  if v then
    return i, v
  end
end
function ipairs (a)
  return iter, a, 0
end
t = {"A","B","C","D"}
for index,value in ipairs(t) do
  print(value)
end
```

    语句解释：
    - 首先，泛型for调用迭代工厂 ipairs() 函数，工厂返回三个值依次为：迭代函数（iter）、状态常量（a）、控制变
    量（迭代函数iter的参数i，初始值为0）。
    - 然后，每次for需要迭代时，会将a和i传递给迭代函数iter()，迭代函数执行后，把数据和新的控制变量返回给变量
    列表。
    - 最后，如果返回的第一个值为nil循环结束，否则执行循环体，并如此反复。
　　状态常量：循环过程中不会改变的状态常量（比如，被遍历的表就是一个状态常量）。
<br>
**无状态的迭代器 **
　　无状态的迭代器是指不保留任何状态的迭代器，因此在循环中我们可以利用无状态迭代器避免创建闭包花费额外的代价。 
　　简单的说，无状态迭代器的迭代函数最多只接受2个参数（状态常量和控制变量，而范例1则是一个都不接收），一个无状态的迭代器只利用这两个值就可以获取下一个元素。因此范例1和范例2都属于无状态迭代器。
<br>
**多状态的迭代器 **
　　很多情况下，迭代器需要保存（除了状态常量和控制变量以外的）多个状态信息而不是简单的状态常量和控制变量，最简单的方法是使用闭包，还有一种方法就是将所有的状态信息封装到一个 table 内，将 table 作为迭代器的状态常量，因为这种情况下可以将所有的信息存放在 table 内，所以迭代函数通常不需要第二个参数。
　　下面我们重写 allwords 迭代器，这一次我们不是使用闭包而是使用带有两个域 (line, pos) 的 table 。开始迭代的函数是很简单的，他必须返回迭代函数和初始状态： 
``` lua
local  iterator    -- to be defined later 
function allwords() 
  local  state = {line = io.read(), pos = 1} 
  return iterator, state 
end
```
　　真正的处理工作是在迭代函数内完成：
``` lua
function  iterator (state) 
  while  state.line do
     local  s, e = string.find(s tate.line, "%w+" , state.pos)
     if s then
        state.pos = e + 1 
        return string.sub(s tate.line, s, e) 
     else 
        state.line = io.read() 
        state.pos = 1
     end 
  end 
  return nil 
end
```
　　我们应该尽可能的写无状态的迭代器，因为这样循环的时候由for 来保存状态，不需要创建对象花费的代价小；如果不能用无状态的迭代器实现，应尽可能使用闭包；尽可能不要使用table 这种方式，因为创建闭包的代价要比创建 table 小，另外Lua处理闭包要比处理table 速度快些。后面我们还将看到另一种使用协同来创建迭代器的方式，这种方式功能更强但更复杂。
<br>
**真正的迭代器 **
　　迭代器的名字有一些误导，因为它并没有迭代，完成迭代功能的是 for 语句，也许更好的叫法应该是‘生成器’。但是在其他语言比如 java 、C++ 迭代器的说法已经很普遍了，我们也将沿用这种术语。 
　　有一种方式创建一个在内部完成迭代的迭代器。这样当我们使用迭代器的时候就不需要使用循环了；我们仅仅使用每一次迭代需要处理的任务作为参数调用迭代器即可，具体地说，迭代器接受一个函数作为参数，并且这个函数在迭代器内部被调用。
　　作为一个具体的例子，我们使用上述方式重写ipairs迭代器：
``` lua
local function iter (t, i)
  i = i + 1
  local v = t[i]
  if v then
    return i, v
  end
end
function ipairs (t,callback)
  for index,value in iter,t,0 do
    callback(index,value)
  end
end
```
　　如果我们想要打印出单词，只需要：
``` lua
t = {"A","B","C","D"}
ipairs(t,print)
```
　　更一般的做法是我们使用匿名函数作为作为参数：
``` lua
t = {"A","B","C","D"}
ipairs(t,function(index,value)
  print(index .. " " ..value)
end)
```
　　在真正的迭代器风格写法中 return 语句只是从匿名函数中返回而不是退出循环。
<br>
## 编译-运行-调试 ##
　　虽然我们把 Lua 当作解释型语言，但是 Lua 会首先把代码预编译成中间码然后再执行（很多解释型语言都是这么做的）。在解释型语言中存在编译阶段听起来不合适，然而，解释型语言的特征不在于他们是否被编译，而是编译器是语言运行时的一部分，所以，执行编译产生的中间码速度会更快。我们可以说函数 dofile 的存在就是说明可以将 Lua 作为一种解释型语言被调用。<br>
　　前面我们介绍过 dofile，把它当作 Lua 运行代码的 chunk 的一种原始的操作。dofile 实际上是一个辅助的函数。真正完成功能的函数是 loadfile；与 dofile 不同的是 loadfile 编译代码成中间码并且返回编译后的 chunk 作为一个函数，而不执行代码；另外 loadfile 不会抛出错误信息而是返回错误代。 我们可以这样定义 dofile：
``` lua
function  dofile (filename) 
  local  f = assert(loadfile(filename)) 
  return f() 
end
```

    语句解释：
    - 如果loadfile 失败assert 会抛出错误。
<br>　　完成简单的功能 dofile 比较方便，它读入文件编译并且执行。然而 loadfile 更加灵活。在发生错误的情况下，loadfile 返回2个值（nil 和 错误信息），这样我们就可以自定义错误处理。另外，如果我们运行一个文件多次的话，loadfile只需要编译一次，但可多次运行。dofile 却每次都要编译。<br>
　　loadstring 与 loadfile 相似，只不过它不是从文件里读入 chunk，而是从一个串中读入。例如：
``` lua
f = loadstring( "i = i + 1")
```
　　f 将被转成一个函数，当调用f时则就等价执行i=i+1。
``` lua
i = 0 
f(); print(i)   --> 1 
f(); print(i)   --> 2
```

    语句解释：
    - loadstring 函数功能强大，但使用时需多加小心。确认没有其它简单的解决问题的方法再使用。
<br>　　Lua 把每一个 chunk 都作为一个匿名函数处理例如：chunk "a = 1"，loadstring 返回与其等价的function () a = 1 end 。与其他函数一样，chunks 可以定义局部变量也可以返回值：
``` lua
f = loadstring( "local a = 10; return a + 20")
print(f())    --> 30
```
　　loadfile 和 loadstring 都不会抛出错误，如果发生错误他们将返回 nil 加上错误信息：
``` lua
print(loadstring("i i" )) 
    --> nil  [string "i i"]:1: '=' expected near 'i'
```
<br>　　另外，loadfile 和 loadstring 都不会有边界效应产生，他们仅仅编译 chunk 成为自己内部实现的一个匿名函数。通常对他们的误解是他们定义了函数。Lua 中的函数定义是发生在运行时的赋值而不是发生在编译时。假如我们有一个文件foo.lua ：
``` lua
-- file foo.lua' 
function foo (x) 
 print(x) 
end
```
　　当我们执行命令f = loadfile("foo.lua")后，foo 被编译了但还没有被定义，如果要定义他必须运行chunk ：
``` lua
f()     -- defines `foo' 
foo("ok")   --> ok
```
　　如果你想快捷的调用 loadstring（比如加载并运行），可以这样：
``` lua
loadstring(s)()
```
　　调用 loadstring 返回的结果，然而如果加载的内容存在语法错误的话，loadstring 返回nil和错误信息（attempt to call a nil value）；为了返回更清楚的错误信息可以使用 assert：
``` lua
assert(loadstring(s))()
```
<br>　　通常使用 loadstring 加载一个字串没什么意义，例如：
``` lua
f = loadstring("i = i + 1")
```
　　大概与 f = function () i = i + 1 end 等价,但是第二段代码速度更快因为它只需要编译一次，第一段代码每次调用 loadstring 都会重新编译，还有一个重要区别：loadstring 编译的时候不关心词法范围：
``` lua
local  i = 0 
f = loadstring( "i = 8;i = i + 1; print(i)") 
g = function  () i = i + 1; print(i)end
f()  --9
g()  --1
```
　　这个例子中，和想象的一样 g 使用局部变量 i ，然而 f 使用全局变量i ；loadstring 总是在全局环境中编译他的串。
<br>　　loadstring 通常用于运行程序外部的代码，比如运行用户自定义的代码。注意：loadstring 期望一个 chunk，即语句。如果想要加载表达式，需要在表达式前加 return ，那样将返回表达式的值。看例子：
``` lua
print "enter your expression:" 
local  l = io.read() 
local  func = assert(loadstring("return " .. l)) 
print("the value of your expression is " .. func())
```
　　loadstring 返回的函数和普通函数一样，可以多次被调用：
``` lua
print "enter function to be plotted (with variable `x'):" 
local  l = io.read() 
local  f = assert(loadstring( "return " .. l)) 
for  i=1,20  do 
  x = i   -- global `x' (to be visible from the chunk) 
 print(string.rep("*" , f())) 
end
```
<br>
##require函数 ##
　　Lua 提供高级的 require 函数来加载运行库，粗略的说 require 和 dofile 完成同样的功能但有两点不同：
　　1. require 会搜索目录加载文件。
　　2. require 会判断是否文件已经加载避免重复加载同一文件。<br>
　　由于上述特征，require 在 Lua 中是加载库的更好的函数。
　　加载文件时，require 函数依次进入 package.path 变量列出的每个路径中去加载文件。package.path 使用的路径和普通我们看到的路径还有些区别，我们一般见到的路径都是一个目录列表。 package.path 的路径是一个模式列表，每一个模式指明一种由虚文件名（require的参数）转成实文件名的方法。更明确地说，每一个模式是一个包含可选的问号的文件名。匹配的时候 Lua 会首先将问号用虚文件名替换，然后看是否有这样的文件存在。如果不存在继续用同样的方法用第二个模式匹配。<br>
　　例如，若 package.path 路径如下：
``` lua
?;?.lua;c:\windows\?;/usr/local/lua/?/?.lua
```
　　则调用 require "lili" 时会试着打开这些文件：
``` lua
lili 
lili.lua 
c:\windows\lili 
/usr/local/lua/lili/lili.lua
```
　　即 require 关注的问题只有分号（模式之间的分隔符）和问号，其他的信息（目录分隔符，文件扩展名）在路径中定义。<br>
　　require 依次进入 package.path 变量列出的每个路径中去加载文件，一旦找到文件则立刻会停止查找，因此如果在不同的目录下有同名的 lua 文件，则 require 会加载优先找到的。

<br>　　范例1：加载指定目录下的文件。
``` lua
print(package.path)
package.path =  "D:\?.lua;" .. package.path
require "b"
```
　　require 的另一个功能是避免重复加载同一个文件两次。Lua 保留一张所有已经加载的文件的列表（使用 table 保存）。如果一个加载的文件在表中已经存在了，则 require 简单的返回；表中保留加载的文件的虚名，而不是实文件名。所以如果你使用不同的虚文件名 require 同一个文件两次，将会加载两次该文件。比如 require "foo" 和 require "foo.lua" ，路径为"?;?.lua" 将会加载 foo.lua 两次。我们也可以通过全局变量 _ LOADED 访问文件名列表，这样我们就可以判断文件是否被加载过；同样我们也可以使用一点小技巧让 require 加载一个文件两次。比如， require "foo" 之后 \_LOADED["foo"] 将不为 nil，我们可以将其赋值为 nil，然后执行 require "foo.lua" 将会再次加载该文件。<br>
　　一个路径中的模式也可以不包含问号而只是一个固定的路径，比如：
``` lua
?;?.lua;/usr/local/default.lua
```
　　这种情况下，require 没有匹配的时候就会使用这个固定的文件（当然这个固定的路径必须放在模式列表的最后才有意义）。在 require 运行一个chunk 以前，它定义了一个全局变量 \_REQUIREDNAME 用来保存被 required 的虚文件的文件名。我们可以通过使用这个技巧扩展 require 的功能。<br>
　　举个极端的例子，我们可以把路径设为"/usr/local/lua/newrequire.lua"，这样以后每次调用 require 都会运行 newrequire.lua ，这种情况下可以通过使用\_REQUIREDNAME 的值去实际加载 required 的文件。
<br>
## C Packages ##
　　Lua 和 C 是很容易结合的，使用 C 为 Lua 写包与 Lua 中写包不同，C 包在使用以前必须首先加载并连接，在大多数系统中最容易的实现方式是通过动态连接库机制，然而动态连接库不是 ANSI C 的一部分，也就是说在标准 C 中实现动态连接是很困难的。
　　通常 Lua 不包含任何不能用标准 C 实现的机制，动态连接库是一个特例。我们可以将动态连接库机制视为其他机制之母：一旦我们拥有了动态连接机制，我们就可以动态的加载 Lua 中不存在的机制。所以，在这种特殊情况下，Lua 打破了他平台兼容的原则而通过条件编译的方式为一些平台实现了动态连接机制。标准的 Lua 为 windows、Linux、FreeBSD 、Solaris 和其他一些 Unix 平台实现了这种机制，扩展其它平台支持这种机制也是不难的。在 Lua 提示符下运行 print(loadlib()) 看返回的结果，如果显示 bad arguments 则说明你的发布版支持动态连接机制，否则说明动态连接机制不支持或者没有安装。<br>
　　Lua 在一个叫 loadlib 的函数内提供了所有的动态连接的功能。这个函数有两个参数：库的绝对路径和初始化函数。所以典型的调用的例子如下：
``` lua
local  path =  "/usr/local/lua/lib/libluasocket.so" 
local  f = loadlib(path, "luaopen_socket")
```
　　loadlib 函数加载指定的库并且连接到 Lua，然而它并不打开库（也就是说没有调用初始化函数），反之他返回初始化函数作为 Lua 的一个函数，这样我们就可以直接在 Lua 中调用他。如果加载动态库或者查找初始化函数时出错，loadlib 将返回 nil 和错误信息。<br>
　　我们可以修改前面一段代码，使其检测错误然后调用初始化函数：
``` lua
local  path =  "/usr/local/lua/lib/libluasocket.so" 
-- or path = "C:\\windows\\luasocket.dll" 
local  f = assert(loadlib(path, "luaopen_socket")) 
f()   -- actually open the library
```
　　一般情况下我们期望二进制的发布库包含一个与前面代码段相似的 stub 文件，安装二进制库的时候可以随便放在某个目录，只需要修改 stub 文件对应二进制库的实际路径即可。将 stub 文件所在的目录加入到 LUA_PATH ，这样设定后就可以使用 require 函数加载 C 库了。
<br>
##错误 ##
　　Errare humanum est（拉丁谚语：犯错是人的本性）。所以我们要尽可能的防止错误的发生，Lua 经常作为扩展语言嵌入在别的应用中，所以不能当错误发生时简单的崩溃或者退出。相反，当错误发生时 Lua 结束当前的 chunk 并返回到应用中。
　　当 Lua 遇到不期望的情况时就会抛出错误，比如：两个非数字进行相加；调用一个非函数的变量；访问表中不存在的值等。<br>
　　你也可以通过调用 error 函数显式的抛出错误，error 的参数是要抛出的错误信息。
``` lua
print "enter a number:" 
n = io.read("*number") 
if not  n  then error("invalid input" ) end
```
　　Lua 提供了专门的内置函数assert来完成上面类似的功能：
``` lua
print "enter a number:" 
n = assert(io.read("*number"),  "invalid input" )
```
　　assert 首先检查第一个参数是否返回错误，如果不返回错误 assert 简单的返回，否则assert 以第二个参数抛出错误信息。第二个参数是可选的。注意 assert 是普通的函数，他会首先计算两个参数然后再调用函数，所以以下代码：
``` lua
n = io.read() 
assert(tonumber(n),  "invalid input: " .. n .. " is not a number")
```
　　将会总是进行连接操作，使用显式的 test 可以避免这种情况。 <br>
　　当函数遇到异常有两个基本的动作：返回错误代码或者抛出错误。这两种方式选择哪一种没有固定的规则，但有一般的原则：容易避免的异常应该抛出错误否则返回错误代码。<br>
　　例如我们考虑 sin 函数，如果以一个 table 作为参数，假定我们返回错误代码，我们需要检查错误的发生，代码可能如下：
``` lua
local  res = math.sin(x)
if not  res  then   -- error 
 ...
```
　　然而我们可以在调用函数以前很容易的判断是否有异常：
``` lua
local  res = math.sin(x)
if not  res  then   -- error 
 ...
```
　　然而通常情况下我们既不是检查参数也不是检查返回结果，因为参数错误可能意味着我们的程序某个地方存在问题，这种情况下，处理异常最简单最实际的方式是抛出错误并且终止代码的运行。<br>
　　再来看一个例子 io.open 函数用来打开一个文件，如果文件不存在结果会怎么样呢？很多系统中，通过试着去打开文件来判断是否文件存在。所以如果 io.open 不能打开文件（由于文件不存在或者没有权限），函数返回nil和错误信息。以这种方式我们可以通过与用户交互（比如：是否要打开另一个文件）合理的处理问题：
``` lua
local  file, msg 
repeat 
  print "enter a file name:"  
  local  name = io.read() 
  if not name then return end    -- no input 
  file, msg = io.open(name,  "r" ) 
  if not file then print(msg) end  
until  file
```
　　如果你想偷懒不想处理这些情况，又想代码安全的运行，可以简单的使用 assert：
``` lua
file = assert(io.open(name,  "r" ))
```
　　Lua 中有一个习惯：如果 io.open 失败，assert 将抛出错误。
``` lua
file = assert(io.open("no-file", "r" )) 
    --> stdin:1: no-file: No such file or directory
```
　　io.open 返回的第二个结果（错误信息）作为 assert 的第二个参数。
<br>
##异常和错误处理 ##
　　很多应用中，不需要在 Lua 进行错误处理，一般由应用来完成。通常应用要求 Lua 运行一段 chunk ，如果发生异常，应用根据 Lua 返回的错误代码进行处理。在控制台模式下的 Lua 解释器如果遇到异常，打印出错误然后继续显示提示符等待下一个命令。<br>
　　如果在 Lua 中需要处理错误，需要使用 pcall 函数封装你的代码。 假定你想运行一段 Lua 代码，这段代码运行过程中可以捕捉所有的异常和错误。<br>
　　第一步：将这段代码封装在一个函数内。
``` lua
function f(a)
  if not a then
    error("where is parama?")
  end
  print(tonumber(a))
end
```
<br>　　第二步：使用 pcall 调用这个函数。
``` lua
if pcall(f,4) then
  print("nothing")
else
  print("error")
end
```

    语句解释：
    -  pcall 函数的第一个参数是要调用的函数的名称，其后的参数则是用来传递给该函数的参数。
    -  若 pcall 函数返回 true 则意味着没有异常发生。
<br>　　当然也可以用匿名函数的方式调用 pcall ：
``` lua
if pcall(function () ...  end ) then ... 
else ...
end
```
　　pcall 在保护模式下调用他的第一个参数并运行，因此可以捕获所有的异常和错误。如果没有异常和错误，pcall 返回 true 和调用返回的任何值；否则返回 nil 加错误信息。 错误信息不一定非要是一个字符串（下面的例子是一个 table ），传递给 error 的任何信息都会被 pcall 返回：
``` lua
local  status, err = pcall(function  () error({code=121}) end )
print(err.code)  -->  121
```
　　这种机制提供了我们在 Lua 中处理异常和错误的所需要的全部内容。我们通过 error 抛出异常，然后通过 pcall 捕获他。
<br>
##错误信息和回跟踪（Tracebacks） ##
　　虽然你可以使用任何类型的值作为错误信息，通常情况下，我们使用字符串来描述遇到的错误信息。如果遇到内部错误（比如对一个非 table 的值使用索引下表访问）Lua 将自己产生错误信息，否则 Lua 使用传递给 error 函数的参数作为错误信息。不管在什么情况下， Lua 都尽可能清楚的描述发生的错误。
``` lua
local  status, err = pcall(function  () a = 'a'+1 end ) 
print(err) 
--> stdin:1: attempt to perform arithmetic on a string value
local  status, err = pcall(function  () error( "my error" ) end )
print(err) 
--> stdin:1: my error
```
    语句解释：
    -  错误信息的格式：“文件名：行号：错误信息”，在本范例中，文件名则为“stdin”。
    -  pcall() 函数的功能和 Java中 的 try…catch 语句是一样的。
　　函数 error 还可以有第二个参数，表示错误的运行级别。有了这个参数你就无法抵赖错误是别人的了，比如，加入你写了一个函数用来检查 error 是否被正确的调用：
``` lua
function  foo (str) 
  if type(str) ~= "string"  then 
      error("string expected") 
  end 
end
```
　　可能有人这样调用这个函数：
``` lua
foo({x=1})
```
　　Lua 会指出发生错误的是 foo 而不是 error ，实际的错误是调用 error 时产生的，为了纠正这个问题修改前面的代码让 error 报告错误发生在第二级（你自己的函数是第一级）如下：
``` lua
function  foo (str) 
  if type(str) ~= "string"  then 
      error("string expected",2) 
  end 
end
```
　　当错误发生的时候，我们常常需要更多的错误发生相关的信息，而不单单是错误发生的位置。至少期望有一个完整的显示导致错误发生的调用栈的 tracebacks，当 pcall 返回错误信息的时候它已经释放了保存错误发生情况的栈的信息。因此，如果我们想得到 tracebacks 我们必须在 pcall 返回以前获取。Lua 提供了 xpcall 来实现这个功能， xpcall 接受两个参数：调用函数和错误处理函数。当错误发生时,Lua 会在栈释放以前调用错误处理函数，因此可以使用 debug 库收集错误相关的信息。有两个常用的 debug 处理函数：debug.debug 和 debug.traceback, 前者给出 Lua 的提示符，你可以自己动手察看错误发生时的情况；后者通过 traceback 创建更多的错误信息, 后者是控制台解释器用来构建错误信息的函数。你可以在任何时候调用 debug.traceback 获取当前运行的  traceback 信息：
``` lua
function  foo (str) 
  if type(str) ~= "string"  then 
  error("string expected") 
  end 
end
xpcall(foo,function ()
  print(debug.traceback()) 
end)
```
<br><br>
# 第三节 标准库 #
　　在这一节中（下面关于标准库的几节中同样）我的主要目的不是对每一个函数给出完整地说明，而是告诉你标准库能够提供什么功能。为了能够清楚地说明问题，我可能会忽略一些小的选项或者行为。主要的思想是激发你的好奇心，这些好奇之处可能在参考手册中找到答案。
<br>
## 数学库 ##
　　数学库由算术函数的标准集合组成，比如三角函数库（sin, cos, tan, asin, acos, 等），幂指函数（exp, log, log10），舍入函数（floor, ceil ）、max、min，加上一个变量 pi 。数学库也定义了一个幂操作符（^）。<br>
　　所有的三角函数都在弧度单位下工作。（Lua4.0 以前在度数下工作。）你可以使用 math.deg 和 math.rad 函数在度和弧度之间转换。如果你想在 degree 情况下使用三角函数，你可以重定义三角函数：
``` lua
local  sin, asin, ... = math.sin, math.asin, ... 
local  deg, rad = math.deg, math.rad 
math.sin = function  (x)  return sin(rad(x))  end  
math.asin = function  (x)  return deg(asin(x)) end  
...
```
　　math.random 用来产生伪随机数，有三种调用方式： 

    第一：不带参数，将产生 [0,1)范围内的随机数. 
	第二：带一个参数n ，将产生 1 <= x <= n 范围内的随机数 x. 
	第三：带两个参数a 和b, 将产生a <= x <= b 范围内的随机数 x.
　　你可以使用 math.randomseed 设置随机数发生器的种子，它只能接受一个数字参数。通常在程序开始时，使用固定的种子初始化随机数发生器，意味着每次运行程序，将产生相同的随机数序列。为了调试方便，这很有好处，但是在游戏中就意味着每次运行都拥有相同的关卡。解决这个问题的一个通常的技巧是使用当前系统时间作为种子：
``` lua
math.randomseed(os.time())
```
　　os.time 函数返回一个表示当前系统时间的数字，通常是自新纪元以来的一个整数。
``` lua
print(math.random(1, 10))
print(math.random(1, 10))
print(math.random(1, 10))
math.randomseed(os.time())
print(os.time(), math.random())
```

    语句解释：
    -  math.randomseed() 函数只接受一个参数。
<br>
## Table库 ##
　　table 库由一些操作 table 的辅助函数组成。它的主要作用之一是对 Lua 中 array 的大小给出一个合理的解释。另外还提供了一些从 list 中插入删除元素的函数，以及对  array 元素排序函数。
<br>
**数组大小**
　　Lua 中我们经常假定 array 在最后一个非 nil 元素处结束。这个传统的约定有一个弊端：我们的 array 中不能拥有 nil 元素。对大部分应用来说这个限制不是什么问题，比如当所有的 array 有固定的类型的时候。但有些时候我们的 array 需要拥有 nil 元素，这种情况下，我们需要一种方法来明确的表明 array 的大小。<br>
　　table 库定义了两个函数操纵 array 的大小：

    -  table.getn() ： 返回 array 的大小 
    -  table.setn() ： 设置 array 的大小 
　　默认情况下，调用 table.setn(t, n) 时，table.setn() 会在将 t 和 n 放入到它的一个内部（weak）table 中，而调用 table.getn(t) 将得到内部 table 中和 t 关联的那个 n 值。然而，如果表 t 有一个带有数字值 n 的域，setn 将修改这个值，而 getn 返回这个值。getn 函数还有一个选择：如果它不能使用上述方法返回 array 的大小，就会使用原始的方法：遍历 array 直到找到第一个 nil 元素。因此，你可以在 array 中一直使用 table.getn(t) 获得正确的结果。看例子：
``` lua
print(table.getn{10,2,4})   --> 3 
print(table.getn{10,2,nil})   --> 2 
print(table.getn{10,2,nil; n=3})  --> 3 
print(table.getn{n=1000})   --> 1000 
 
a = {} 
print(table.getn(a))     --> 0 
table.setn(a, 10000) 
print(table.getn(a))     --> 10000 
 
a = {n=10} 
print(table.getn(a))     --> 10 
table.setn(a, 10000) 
print(table.getn(a))     --> 10000
```
　　默认的，setn 和 getn 使用内部表存储表的大小。这是最干净的选择，因为它不会使用额外的元素污染 array。然而，使用 n 域的方法也有一些优点。在带有可变参数的函数中，Lua 内核使用这种方法设置 arg 数组的大小，因为内核不依赖于库，他不能使用 setn 。另外一个好处在于：我们可以在 array 创建的时候直接初始化他的大小，如我们在上面例子中看到的。<br>
　　使用 setn 和 getn 操纵 array 的大小是个好的习惯，即使你知道大小在域 n 中。 table 库中的所有函数（sort 、concat 、insert 等等）都遵循这个习惯。实际上，提供 setn 用来改变域 n 的值可能只是为了与旧的 lua 版本兼容，这个特性可能在将来的版本中改变，为了安全起见，不要假定依赖于这个特性。请一直使用 getn 获取数组大小，使用 setn 设置数组大小。
<br>
**插入/删除**
　　table 库提供了从一个 list 的任意位置插入和删除元素的函数。table.insert 函数在  array 指定位置插入一个元素，并将后面所有其他的元素后移。另外，insert 会改变 array 的大小 （using setn）。
　　例如：如果 a 是一个数组 {10,20,30}，调用 table.insert(a,1,15) 后，a 变为 {15,10,20,30} 。
　　经常使用的一个特殊情况是，我们不带位置参数调用 insert，将会在 array 最后位置插入元素（所以不需要元素移动）。

<br>　　范例1：下面的代码逐行读入程序，并将所有行保存在一个 array 内。
``` lua
a = {} 
for  line in io.lines() do 
 table.insert(a, line) 
end 
print(table.getn(a))     --> (number of lines read)
```
　　table.remove 函数删除数组中指定位置的元素，并返回这个元素，所有后面的元素前移，并且数组的大小改变。不带位置参数调用的时候，它删除 array 的最后一个元素。

<br>　　范例2：删除元素。
``` lua
list = {"a",t1="t1","b",t2="t2","c","d"}
for i,v in pairs(list)  do
  print("position = " .. i .. " value = " ..v)
end
print(table.remove(list,2))
print("-------------------------")
for i,v in pairs(list)  do
  print("position = " .. i .. " value = " ..v)
end
```

    语句解释：
    -  调用remove函数只会删除具有下标的元素，本范例删除的是“b”。
　　使用这两个函数，很容易实现栈、队列和双端队列。
　　假设有一个表 a = {} ，则一个 push 操作等价于 table.insert(a,x)； 一个 pop 操作等价于 table.remove(a) 。
　　要在结构的另一端结尾插入元素我们使用 table.insert(a,1,x)；删除元素用  table.remove(a,1)。
　　最后两个操作不是特别有效的，因为他们必须来回移动元素。然而，因为 table 库这些函数使用C 实现，对于小的数组(几百个元素)来说效率都不会有什么问题。
<br>
**排序**
　　另一个有用的函数是 table.sort , 它有两个参数：存放元素的 array 和排序函数。排序函数有两个参数并且如果想在 array 中排序后第一个参数在第二个参数前面，排序函数必须返回 true 。如果未提供排序函数，sort 使用默认的小于操作符进行比较。<br>
　　一个常见的错误是企图对表的下标域进行排序。在一个表中，所有下标组成一个集合，但是无序的。如果你想对他们排序，必须将他们复制到一个 array 然后对这个 array 排序。我们看个例子，假定上面的读取源文件并创建了一个表，这个表给出了源文件中每一个函数被定义的地方的行号：
``` lua
lines = { 
  luaH_set = 10, 
  luaH_get = 24, 
  luaH_present = 48, 
}
```
　　现在你想以字母顺序打印出这些函数名，如果你使用 pairs 遍历这个表，函数名出现的顺序将是随机的。然而，你不能直接排序他们，因为这些名字是表的 key。当你将这些函数名放到一个数组内，就可以对这个数组进行排序。首先，必须创建一个数组来保存这些函数名，然后排序他们，最后打印出结果：
``` lua
a = {} 
for  n  in pairs(lines) do table.insert(a, n)  end  
table.sort(a) 
for  i,n  in ipairs(a) do print(n)  end  
```
　　注意，对于 Lua 来说，数组也是无序的。但是我们知道怎样去计数，因此只要我们使用排序好的下标访问数组就可以得到排好序的函数名。这就是为什么我们一直使用 ipairs 而不是 pairs 遍历数组的原因。前者使用 key 的顺序1 、2 、……，后者表的自然存储顺序。
``` lua
function  pairsByKeys (t, f) 
  local  a = {} 
  for  n  in pairs(t)  do table.insert(a, n)  end  
  table.sort(a, f) 
  local  i = 0          -- iterator variable 
  local  iter =  function  ()   -- iterator function 
    i = i + 1 
    if a[i] == nil  then return nil  
    else return a[i], t[a[i]] 
    end 
  end 
  return iter 
end
```
　　有了这个函数，很容易以字母顺序打印这些函数名，循环：
``` lua
for  name, line in pairsByKeys(lines)  do 
 print(name, line) 
end
```

    打印结果：
    luaH_get   24 
    luaH_present   48 
    luaH_set   10
<br>
## String库 ##
　　Lua 解释器对字符串的支持很有限。一个程序可以创建字符串并连接字符串，但不能截取子串，检查字符串的大小，检测字符串的内容。在 Lua 中操纵字符串的功能基本来自于 string 库。

<br>　　范例1：常用函数。
``` lua
-- 获取字符串的长度
s = "Hello World!!!"
print(string.len(s))  -- 14
-- 返回重复n次字符串s的串
print(string.rep("abc",2))
-- 转换为大写
print(string.upper("abc"))
-- 转换为小写
print(string.lower("ABC"))
-- 反转字符串
print(string.reverse("ABC"))
-- 获取指定返回内字符的ASCII码
print(string.byte("abc",1,3))
```

    语句解释：
    -  你使用string.rep("a", 2^20)可以创建一个1M bytes 的字符串（比如，为了测试需要）。

<br>　　范例2：字符串截取。
``` lua
s = "HelloWorld"
print(string.sub(s,3))      -- lloWorld
print(string.sub(s,3,5))    -- llo
print(string.sub(s,3,15))   -- lloWorld
print(string.sub(s,3,1))    -- 空串
print(string.sub(s,3,-2))   -- lloWorl
```

    语句解释：
    -  调用 string.sub(s,i,j) 函数截取字符串 s 的从第 i 个字符到第 j 个字符之间的串。Lua中，字符串的第一个
    字符索引从1 开始。
    -  你也可以使用负索引，负索引从字符串的结尾向前计数：-1 指向最后一个字符，-2 指向倒数第二个，以此类推。
    -  如果不提供第 3 个参数，默认为 -1。
　　记住：Lua 中的字符串是恒定不变的。string.sub 函数以及 Lua 中其他的字符串操作函数都不会改变字符串的值，而是返回一个新的字符串。一个常见的错误是：
``` lua
string.sub(s, 2, -2)
```
　　认为上面的这个函数会改变字符串 s 的值。如果你想修改一个字符串变量的值，你必须将变量赋给一个新的字符串：
``` lua
s = string.sub(s, 2, -2)
```

<br>　　范例3：char与byte。
``` lua
print(string.char(97))       --> a 
i = 99; print(string.char(i, i+1, i+2))  --> cde 
print(string.byte( "abc" ))      --> 97 
print(string.byte( "abc" , 2))     --> 98 
print(string.byte( "abc" , -1))     --> 99
```

    语句解释：
    -  string.char 函数和 string.byte 函数用来将字符在字符和数字之间转换。
    -  string.char 获取0个或多个整数，将每一个数字转换成字符，然后返回一个所有这些字符连接起来的字符串。
    -  string.byte(s, i) 将字符串s的第i个字符的转换成整数；第二个参数是可选的，缺省情况下 i=1 。
    -  上面最后一行，我们使用负数索引访问字符串的最后一个字符。

<br>　　范例4：format函数。
``` lua
--> pi = 3.1416
print(string.format( "pi = %.4f", math.pi))
--> 05/11/1990
print(string.format( "%02d/%02d/%04d", 5, 11, 1990))
--> <h1>a title</h1>
print(string.format( "<%s>%s</%s>" , "h1", "a title", "h1"))
```

    语句解释：
    -  函数 string.format 在用来对字符串进行格式化的时候，特别是字符串输出，是功能强大的工具。这个函数有两个
    参数，使用方法和 C 语言的 printf 函数几乎一模一样，你完全可以照 C 语言的 printf 来使用这个函数。
    -  第一个参数为格式化串：由指示符和控制格式的字符组成。
       -  指示符就是'%'。
       -  控制格式的字符可以为：十进制'd' ；十六进制'x' ；八进制'o' ；浮点数'f' ；字符串's' 。在指示符 '%' 和
       控制格式字符之间还可以有其他的选项：用来控制更详细的格式，比如一个浮点数的小数的位数。
    -  第一个例子，%.4f 代表小数点后面有4位小数的浮点数。第二个例子%02d代表以固定的两位显示十进制数，不足的前面
    补0 。而 %2d 前面没有指定0 ，不足两位时会以空白补足。对于格式串部分指示符得详细描述清参考 lua 手册，或者参
    考 C 手册，因为 Lua 调用标准 C 的 printf 函数来实现最终的功能。
<br>
**模式匹配函数**
　　在 string 库中功能最强大的函数是：string.find（字符串查找），string.gsub （全局字符串替换），以及 string.gfind（全局字符串查找）。这些函数都是基于模式匹配的。<br>
　　与其他脚本语言不同的是，Lua 并不使用 POSIX 规范的正则表达式（也写作regexp ）来进行模式匹配。主要的原因出于程序大小方面的考虑：实现一个典型的符合 POSIX 标准的 regexp 大概需要4000行代码，这比整个Lua标准库加在一起都大。权衡之下，Lua 中的模式匹配的实现只用了500行代码，当然这意味着不可能实现 POSIX 所规范的所有功能。然而，Lua 中的模式匹配功能是很强大的，并且包含了一些使用标准 POSIX 模式匹配不容易实现的功能。<br>
　　string.find 的基本应用就是用来在目标串（subject string）内搜索匹配指定的模式的串。函数如果找到匹配的串则返回它的位置，否则返回 nil 。最简单的模式就是一个单词，仅仅匹配单词本身。比如，模式 'hello' 仅仅匹配目标串中的 "hello" 。当查找到模式的时候，函数返回两个值：匹配串开始索引和结束索引。<br>

<br>　　范例1：format函数。
``` lua
s = "hello world"  
print(string.find(s, "hello"))   --> 1    5 
print(string.find(s, "world"))   --> 7    11 
print(string.find(s, "l" ))      --> 3    3 
print(string.find(s, "lll" ))    --> nil
```

    语句解释：
    -  函数 string.format 在用来对字符串进行格式化的时候，特别是字符串输出，是功能强大的工具。这个函数有两个。
　　string.find 函数第三个参数是可选的：标示目标串中搜索的起始位置。当我们想查找目标串中所有匹配的子串的时候，这个选项非常有用。我们可以不断的循环搜索，每一次从前一次匹配的结束位置开始。

<br>　　范例2：字符串分割。
``` lua
local  t = {}
local  pre = 0
local  next = 0 
s = "a|b|c|d|e"
while  true do 
  next = string.find(s, "|", next+1)
  if next == nil  then break end
  table.insert(t, string.sub(s,pre+1,next-1)) 
  pre = next
end
for _,v in ipairs(t) do
  print(v)
end
```

    语句解释：
    -  本范例用来将字符串分割成若干子串，后面我们还会看到可以使用string.gfind 迭代子来简化上面这个循环。

<br>　　范例3：gsub函数。
　　string.gsub 函数有三个参数：目标串，模式串，替换串。他基本作用是用来查找匹配模式的串，并将使用替换串其替换掉：
``` lua
s = string.gsub("Lua is cute" , "cute", "great") 
print(s)   --> Lua is great 
s = string.gsub("all lii", "l" , "x" ) 
print(s)   --> axx xii 
s = string.gsub("Lua is great", "perl", "tcl" ) 
print(s)   --> Lua is great
```
　　第四个参数是可选的，用来限制替换的次数：
``` lua
s = string.gsub("all lii", "l" , "x" , 1) 
print(s)     --> axl lii 
s = string.gsub("all lii", "l" , "x" , 2) 
print(s)     --> axx lii
s = string.gsub("all lii", "l" , "lll" , 2) 
print(s)     --> allllll lii
```
　　string.gsub 的第二个返回值表示他进行替换操作的次数。例如，下面代码涌来计算一个字符串中空格出现的次数：
``` lua
_, count = string.gsub(str,  " " , " " ) -- 注意，“_”  只是一个哑元变量
```
<br>
**模式**
　　你还可以在模式串中使用字符类。字符类指可以匹配一个特定字符集合内任何字符的模式项。比如，字符类 %d 匹配任意数字。<br>
　　范例1：查询出日期。
``` lua
s = "Deadline is 30/05/1999, firm"  
date = "%d%d/%d%d/%d%d%d%d"  
print(string.sub(s, string.find(s, date)))  --> 30/05/1999
```
　　下面列出了 Lua 支持的所有字符类：
``` lua
.   任意字符 
%a   字母 
%c   控制字符 
%d   数字 
%l   小写字母 
%p   标点字符 
%s   空白符 
%u   大写字母 
%w   字母和数字 
%x   十六进制数字 
%z   代表0 的字符
```
　　范例2：上面字符类的大写形式表示小写所代表的集合的补集。例如，'%A' 表示非字母的字符：
``` lua
print(string.gsub( "hello, up-down!", "%A", "." ))  --> hello..up.down. 4
```

    语句解释：
    -  数字4 不是字符串结果的一部分，它是 gsub 返回的第二个结果，代表发生替换的次数。下面其他的关于打印 gsub 结
    果的例子中将会忽略这个数值。
<br>
**转义字符**
　　在模式匹配中有一些特殊字符，他们有特殊的意义，Lua 中的特殊字符如下：
``` lua
( ) . % + - * ? [ ^ $
```
　　'%' 用作特殊字符的转义字符，因此 '%.' 匹配点；'%%'  匹配字符 '%' 。<br>
　　转义字符 '%' 不仅可以用来转义特殊字符，还可以用于所有的非字母的字符。当对一个字符有疑问的时候，为安全起见请使用转义字符转义他。对 Lua 而言，模式串就是普通的字符串。他们和其他的字符串没有区别，也不会受到特殊对待。只有他们被用作模式串用于函数的时候， '%'  才作为转义字符。<br>
　　但是，如果你需要在一个模式串内放置引号的话，你必须使用在其他的字符串中放置引号的方法来处理，使用 '\'  转义引号，'\'  是 Lua 的转义符。
　　范例1：匹配引号：
``` lua
test = "\"Lua\" Programe"  
print(string.gsub(test, "\"%w+\"" , "Java"))
```
<br>
**字符类**
　　你可以使用方括号将字符类或者字符括起来创建自己的字符类（译者：Lua 称之为 char-set，就是指传统正则表达式概念中的括号表达式）。比如，'[%w_]'  将匹配字母数字和下划线，'[01]'  匹配二进制数字，'[%[%]]' 匹配一对方括号。下面的例子统计文本中元音字母出现的次数：
``` lua
_, nvow = string.gsub(text, "[AEIOUaeiou]", "")
```
　　在 char-set 中可以使用范围表示字符的集合，第一个字符和最后一个字符之间用连字符连接表示这两个字符之间范围内的字符集合。大部分的常用字符范围都已经预定义好了，所以一般你不需要自己定义字符的集合。比如，'%d'  表示 '[0-9]' ；'%x'  表示 '[0-9a-fA-F]' 。然而，如果你想查找八进制数，你可能更喜欢使用 '[0-7]' 而不是 '[01234567]'。你可以在字符集(char-set) 的开始处使用 '^' 表示其补集：'[^0-7]'  匹配任何不是八进制数字的字符；'[^\n]'  匹配任何非换行符户的字符。记住，可以使用大写的字符类表示其补集：'%S' 比 '[^%s]' 要简短些。<br>
　　Lua 的字符类依赖于本地环境，所以 '[a-z]'  可能与 '%l' 表示的字符集不同。在一般情况下，后者包括 'ç'  和 'ã'，而前者没有。应该尽可能的使用后者来表示字母，除非出于某些特殊考虑，因为后者更简单、方便、更高效。
<br>
**匹配次数**
　　可以使用修饰符来修饰模式增强模式的表达能力，Lua 中的模式修饰符有四个：
``` lua
+   匹配前一字符1次或多次 
*   匹配前一字符0次或多次 
-   匹配前一字符0次或多次 
?   匹配前一字符0次或1次
```

<br>　　范例1：`+`，匹配一个或多个字符，总是进行最长的匹配。比如，模式串`%a+`匹配一个或多个字母或者一个单词。
``` lua
print(string.gsub("one, and two; and three", "%a+", "word")) 
  --> word, word word; word word
```
　　`%d+`匹配一个或多个数字（整数）：
``` lua
i, j = string.find("the number 1298 is even" , "%d+" ) 
print(i,j)   --> 12   15
```

<br>　　范例2：`*`与`+`类似，但是它匹配一个字符0 ~ n次出现. 一个典型的应用是匹配空白。比如，为了匹配一对圆括号()或者括号之间的空白，可以使用`%(%s\*%)` 。（`%s\*`用来匹配0个或多个空白。由于圆括号在模式中有特殊的含义，所以我们必须使用`%`转义它。）再看一个例子：
``` lua
'[\_%a][\_%w]\*'  
```

    语句解释：
    -  匹配 Lua 程序中的标示符：字母或者下划线开头的字母下划线数字序列。

<br>　　范例3：`-`与`*`一样，都匹配一个字符的0 ~ n次出现，但是它进行的是最短匹配。某些时候这两个用起来没有区别，但有些时候结果将截然不同。比如，如果你使用模式`[\_%a][\_%w]-`来查找标示符，你将只能找到第一个字母，因为`[\_%w]-`永远匹配空。另一方面，假定你想查找 C 程序中的注释，很多人可能使用`/%\*.\*%\*/`（也就是说`/\*`后面跟着任意多个字符，然后跟着`\*/`）。然而，由于`.\*`进行的是最长匹配，这个模式将匹配程序中第一个`/\*`和最后一个`\*/`之间所有部分：
``` lua
test = "int x; /* x */  int y; /* y */"  
print(string.gsub(test, "/%*.*%*/" , "<COMMENT>")) 
  --> int x; <COMMENT>
```
　　然而模式`.-`进行的是最短匹配，她会匹配`/\*`开始到第一个`\*/`之前的部分：
``` lua
test = "int x; /* x */  int y; /* y */"  
print(string.gsub(test, "/%*.-%*/" , "<COMMENT>")) 
  --> int x; <COMMENT>  int y; <COMMENT>
```

<br>　　范例4：`?`匹配一个字符0 ~ 1次。举个例子，假定我们想在一段文本内查找一个整数，整数可能带有正负号。
``` lua
[+-]?%d+
```

    语句解释：
    -  它可以匹配像 "-12" 、"23" 和 "+1009"  等数字。'[+-]'  是一个匹配 '+'  或者 '-'  的字符类。 接下来的 
    '?'  意思是匹配前面的字符类0次或者1次。
　　与其他系统的模式不同的是，Lua 中的修饰符不能用字符类；不能将模式分组然后使用修饰符作用这个分组。比如，没有一个模式可以匹配一个可选的单词（除非这个单词只有一个字母）。

<br>　　范例5：`^`和`$`。
　　以 '^' 开头的模式只匹配目标串的开始部分，相似的，以 '$' 结尾的模式只匹配目标串的结尾部分。这不仅可以用来限制你要查找的模式，还可以定位（anchor）模式。比如：
``` lua
if string.find(s, "^%d" ) then ...
```
　　检查字符串s 是否以数字开头，而
``` lua
if string.find(s, "^[+-]?%d+$") then ...
```
　　检查字符串s 是否是一个整数。
<br>
**对称匹配**
　　'%b' 用来匹配对称的字符。常写为'%bxy'，x 和 y 是任意两个不同的字符；x 作为匹配的开始，y 作为匹配的结束。比如，'%b()'  匹配以 '('  开始，以 ')'  结束的字符串：
``` lua
print(string.gsub( "a (enclosed (in) parentheses) line", 
          "%b()", ""))
```
　　常用的这种模式有：'%b()' ，'%b[]' 和 '%b<>'。你也可以使用任何字符作为分隔符。 
<br>
**捕获（Captures）**
　　Capture是这样一种机制：可以使用模式串的一部分匹配目标串的一部分。将你想捕获的模式用圆括号括起来，就指定了一个 capture 。
　　在 string.find 使用 captures 的时候，函数会返回捕获的值作为额外的结果。这常被用来将一个目标串拆分成多个：
``` lua
pair = "name = Anna"  
_, _, key, value = string.find(pair, "(%a+)%s*=%s*(%a+)") 
print(key, value)   --> name   Anna
```

    语句解释：
    -  模式串中包含几对()，find 函数就会额外返回几个值。
    -  '%a+' 表示非空的字母序列。
    -  '%s*' 表示0 个或多个空白。
　　在上面的例子中，整个模式代表：一个字母序列，后面是任意多个空白，然后是`=`再后面是任意多个空白，然后是一个字母序列。两个字母序列都是使用圆括号括起来的子模式，当他们被匹配的时候，他们就会被捕获。当匹配发生的时候，find 函数总是先返回匹配串的索引下标（上面例子中我们存储哑元变量`_`中），然后返回子模式匹配的捕获部分。下面的例子情况类似：
``` lua
date = "17/7/1990" 
_, _, d, m, y = string.find(date, "(%d+)/(%d+)/(%d+)") 
print(d, m, y)    --> 17  7  1990
```
<br>
**向前引用**
　　我们可以在模式中使用向前引用，`%d`（d 代表 1-9 的数字）表示第d个捕获的拷贝。比如，你想查找一个字符串中单引号或者双引号引起来的子串，你可能使用模式 `[\"\'].-[\"\']`，但是这个模式对处理类似字符串`it's all right`会出问题。为了解决这个问题，可以使用向前引用，使用捕获的第一个引号来表示第二个引号：
``` lua
s = [[then he said:  "it's all right"!]] 
a, b, c, quotedPart = string.find(s, "([\"\'])(.-)%1") 
print(quotedPart)   --> it's all right 
print(c)     --> "
```
　　第一个捕获是引号字符本身，第二个捕获是引号中间的内容（`.-`匹配引号中间的子串）。
<br>
**gsub**
　　捕获值的第三个应用是用在函数 gsub 中。与其他模式一样，gsub 的替换串可以包含`%d`，当替换发生时他被转换为对应的捕获值。（顺便说一下，由于存在这些情况，替换串中的字符`%`必须用`%%`表示）。

<br>　　范例1：对一个字符串中的每一个字母进行复制，并用连字符将复制的字母和原字母连接起来。
``` lua
print(string.gsub( "hello Lua!", "(%a)", "%1-%1")) 
  --> h-he-el-ll-lo-o L-Lu-ua-a!
```

    语句解释：
    -  第一轮，匹配到字符“h”，然后将它替换为“h-h”。
    -  第二轮，匹配到字符“e”，然后将它替换为“e-e”，并与上次匹配的连接起来，最终为：h-he-e，依此类推。

<br>　　范例2：互换相邻的字符。
``` lua
print(string.gsub( "hello Lua", "(.)(.)" , "%2%1")) 
  -->  ehll ouLa
```

<br>　　范例3：写一个格式转换器，从命令行获取 LaTeX 风格的字符串，形如：`\command{some text}`，并转换为XML风格的字符串：`<command>some text</command>`。
``` lua
s = "the \\quote{task} is to \\em{change} that. "
print(s)     -- the \quote{task} is to \em{change} that.
s = string.gsub(s, "\\(%a+){(.-)}" , "<%1>%2</%1>" )
print(s)     -- the <quote>task</quote> is to <em>change</em> that.
```

<br>　　范例4：去除字符串首尾的空格。
``` lua
function  trim (s) 
  return (string.gsub(s, "^%s*(.-)%s*$", "%1")) 
end 
print(trim("  A B  "))
```

    语句解释：
    -  注意模式串的用法，两个定位符（'^'和'$'）保证我们获取的是整个字符串。因为，两个 '%s*' 匹配首尾的所有空格
    ，'.-' 匹配剩余部分。还有一点需要注意的是gsub 返回两个值，我们使用额外的圆括号丢弃多余的结果（替换发生的
    次数）。
　　最后一个捕获值应用之处可能是功能最强大的，我们可以使用一个函数作为 gsub 的第三个参数。在这种情况下，gsub 每次发现一个匹配的时候就会调用给定的作为参数的函数，捕获值可以作为被调用的这个函数的参数，而这个函数的返回值作为 gsub 的替换串。

<br>　　范例5：将一个字符串中全局变量$varname 出现的地方替换为变量 varname 的值。
``` lua
function  expand (s)
  s = string.gsub(s, "$(%w+)" , function  (n)
    return _G[n]
  end )
  return s
end
name = "Lua" ; status = "great"
print(expand( "$name is $status, isn't it?"))
--> Lua is great, isn't it?
```

    语句解释：
    -  在lua中定义的所有全局变量都会被保存在“_G”表中，可以通过它来获取变量的值，关于“_G”的更多介绍将在后面章节
    中进行。

<br>　　范例6：如果你不能确定给定的变量是否为 string 类型，可以使用 tostring 进行转换。
``` lua
function  expand (s)
  return (string.gsub(s, "$(%w+)" , function  (n)
    return tostring(_G[n])
  end ))
end
print(expand( "print = $print; a = $a"))
--> print = function: 0x8050ce0; a = nil
```

<br>　　范例7：使用 loadstring 来计算一段文本内`$`后面跟着一对方括号内表达式的值。
``` lua
s = "sin(3) = $[math.sin(3)]; 2^5 = $[2^5]" 
print((string.gsub(s, "$(%b[])", function  (x) 
 x = "return " .. string.sub(x, 2, -2) 
  local  f = loadstring(x) 
  return f() 
end ))) 
-->  sin(3) = 0.1411200080598672; 2^5 = 32
```

    语句解释：
    -  第一次匹配是 "$[math.sin(3)]"，对应的捕获为 "$[math.sin(3)]"，调用 string.sub 掉首尾的方括号，所以
    被加载执行的字符串是 "return math.sin(3)" ，"$[2^5]"  的匹配情类似。

<br>　　范例8：我们常常需要使用 string.gsub 遍历字符串，而对返回结果不感兴趣。比如，我们收集一个字符串中所有的单词，然后插入到一个表中。
``` lua
s = "hello hi, again!"
words = {}
string.gsub(s,  "(%a+)", function  (w)
  table.insert(words, w)
end )
```

    结果为：
    -  {"hello", "hi", "again"} 。

<br>　　范例9：使用 string.gfind 函数可以简化上面的代码。
``` lua
s = "hello hi, again!"
words = {} 
for  w  in string.gfind(s, "(%a+)") do 
 table.insert(words, w) 
end
```
　　gfind 函数比较适合用于范性 for 循环。他可以遍历一个字符串内所有匹配模式的子串。我们可以进一步的简化上面的代码，调用 gfind 函数的时候，如果不显式的指定捕获，函数将捕获整个匹配模式。所以，上面代码可以简化为：
``` lua
words = {} 
for  w  in string.gfind(s, "%a") do 
 table.insert(words, w) 
end
```
<br>
**URL解码**
　　URL 编码是 HTTP 协议来用发送 URL 中的参数进行的编码。具体分为四步：

    -  首先，这种编码会将一些特殊字符（比如'='、'&'、'+'）转换为"%XX"形式的编码，其中XX是字符的16进制表示。
    -  然后将空白转换成'+'。比如，将字符串"a+b = c"编码为"a%2Bb+%3D+c" 。
    -  接着，在参数名和参数值之间加一个'='，构成一个name=value形式的串。
    -  最后，在两个name=value 对之间加一个"&"。

<br>　　范例1：URL解码。
``` lua
name = "al";  query = "a+b = c";  q= "yes or no"
被编码为：
name=al&query=a%2Bb+%3D+c&q=yes+or+no
```

<br>　　范例2：现在，假如我们想将这 URL 解码并把每个值存储到表中，下标为对应的名字。下面的函数实现了解码功能。
``` lua
function  unescape (s) 
  s = string.gsub(s, "+" , " " ) 
  s = string.gsub(s, "%%(%x%x)" , function  (h) 
   return string.char(tonumber(h, 16)) 
  end ) 
  return s 
end
```

    语句解释：
    -  第一个语句将 '+' 转换成空白。
    -  第二个gsub 匹配所有的 '%'  后跟两个数字的 16 进制数，然后调用一个匿名函数，匿名函数将16进制数转换成一个
    数字（tonumber 在16进制情况下使用的）然后再转化为对应的字符。
    -  比如：print(unescape( "a%2Bb+%3D+c" ))   --> a+b = c 。

<br>　　范例3：对于 name=value 对，我们使用 gfind 解码，因为 names 和 values 都不能包含`&`和`=`我们可以用模式`[^&=]+`匹配他们。
``` lua
cgi = {} 
function  decode (s) 
  for  name, value in string.gfind(s,  "([^&=]+)=([^&=]+)") do
  name = unescape(name) 
  value = unescape(value) 
  cgi[name] = value 
  end 
end
```

    语句解释：
    -  调用 gfind 函数匹配所有的 name=value 对，对于每一个 name=value 对，迭代子将其相对应的
    捕获的值返回给变量name和value。循环体内调用 unescape 函数解码 name和value部分，并将其存储
    到 cgi 表中。
<br>
**URL编码**
　　与解码对应的编码也很容易实现。首先，我们写一个 escape 函数，这个函数将所有的特殊字符转换成`%`后跟字符对应的 ASCII 码转换成两位的16进制数字（不足两位，前面补0），然后将空白转换为`+`：
``` lua
function  escape (s) 
  s = string.gsub(s, "([&=+%c])", function  (c) 
   return string.format( "%%%02X" , string.byte(c)) 
  end ) 
  s = string.gsub(s, " " , "+" ) 
  return s 
end
```
　　编码函数遍历要被编码的表，构造最终的结果串：
``` lua
function  encode (t) 
  local  s =  "" 
  for  k,v  in pairs(t)  do 
    s = s .. "&"  .. escape(k) .. "="  .. escape(v) 
  end 
  return string.sub(s, 2)    -- remove first `&' 
end 
t = {name = "al",  query = "a+b = c", q="yes or no"} 
 
print(encode(t)) --> q=yes+or+no&query=a%2Bb+%3D+c&name=al
```
<br>
**转换的技巧**
　　模式匹配对于字符串操纵来说是强大的工具，你可能只需要简单的调用 string.gsub 和 find 就可以完成复杂的操作，然而，因为它功能强大你必须谨慎的使用它，否则会带来意想不到的结果。
　　对正常的解析器而言，模式匹配不是一个替代品。对于一个 quick-and-dirty 程序，你可以在源代码上进行一些有用的操作，但很难完成一个高质量的产品。前面提到的匹配C 程序中注释的模式是个很好的例子：`/%*.-%*/`。如果你的程序有一个字符串包含了`/*`，最终你将得到错误的结果：
``` lua
test = [[char s[] =  "a /* here";  /* a tricky string */]]
print(string.gsub(test, "/%*.-%*/" , "<COMMENT>")) 
  --> char s[] = "a <COMMENT>
```
　　虽然这样内容的字符串很罕见，如果是你自己使用的话上面的模式可能还凑活。但你不能将一个带有这种毛病的程序作为产品出售。<br>
　　一般情况下，Lua 中的模式匹配效率是不错的：
　　一个奔腾333MHz机器在一个有200K字符的文本内匹配所有的单词(30K的单词)只需要1/10秒。但是你不能掉以轻心，应该一直对不同的情况特殊对待，尽可能的更明确的模式描述。一个限制宽松的模式比限制严格的模式可能慢很多。一个极端的例子是模式`(.-)%$`用来获取一个字符串内`$`符号以前所有的字符，如果目标串中存在`$`符号，没有什么问题；但是如果目标串中不存在`$`符号。上面的算法会首先从目标串的第一个字符开始进行匹配，遍历整个字符串之后没有找到`$`符号，然后从目标串的第二个字符开始进行匹配，……这将花费原来平方次幂的时间，导致在一个奔腾333MHz的机器中需要3个多小时来处理一个200K的文本串。可以使用下面这个模式避免上面的问题`^(.-)%$`。定位符^告诉算法如果在第一个位置没有没找到匹配的子串就停止查找。使用这个定位符之后，同样的环境也只需要不到1/10秒的时间。<br>
　　也需要小心空模式：匹配空串的模式。比如，如果你打算用模式`%a*`匹配名字，你会发现到处都是名字：
``` lua
i, j = string.find(";$%  **#$hello13", "%a*" ) 
print(i,j)   --> 1  0
```
　　这个例子中调用 string.find 正确的在目标串的开始处匹配了空字符。永远不要写一个以 `-`开头或者结尾的模式，因为它将匹配空串。这个修饰符得周围总是需要一些东西来定位他的扩展。相似的，一个包含`.*`的模式是一个需要注意的，因为这个结构可能会比你预算的扩展的要多。<br>
　　有时候，使用 Lua 本身构造模式是很有用的。看一个例子，我们查找一个文本中行字符大于70个的行，也就是匹配一个非换行符之前有70个字符的行。我们使用字符类`[^\n]`表示非换行符的字符。所以，我们可以使用这样一个模式来满足我们的需要：重复匹配单个字符的模式70次，后面跟着一个匹配一个字符0次或多次的模式。我们不手工来写这个最终的模式，而使用函数rep：
``` lua
pattern = string.rep("[^\n]", 70) .. "[^\n]*"  
```
<br>　　另一个例子，假如你想进行一个大小写无关的查找。方法之一是将任何一个字符x变为字符类`[xX]`。我们也可以使用一个函数进行自动转换：
``` lua
function  nocase (s) 
  s = string.gsub(s, "%a", function  (c) 
   return string.format( "[%s%s]" , string.lower(c), 
            string.upper(c)) 
  end ) 
  return s 
end 
 
print(nocase( "Hi there!")) 
  -->  [hH][iI] [tT][hH][eE][rR][eE]!
```
<br>　　有时候你可能想要将字符串s1转化为s2，而不关心其中的特殊字符。如果字符串s1和s2都是字符串序列，你可以给其中的特殊字符加上转义字符来实现。但是如果这些字符串是变量呢，你可以使用gsub来完成这种转义：
``` lua
s1 = string.gsub(s1, "(%W)", "%%%1") 
s2 = string.gsub(s2, "%%", "%%%%")
```
　　在查找串中，我们转义了所有的非字母的字符。在替换串中，我们只转义了`%`。另一个对模式匹配而言有用的技术是在进行真正处理之前，对目标串先进行预处理。一个预处理的简单例子是，将一段文本内的双引号内的字符串转换为大写，但是要注意双引号之间可以包含转义的引号（`"""`）。下面是一个典型的字符串例子：
``` lua
"This is "great"!".
```
　　我们处理这种情况的方法是，预处理文本把有问题的字符序列转换成其他的格式。比如，我们可以将"""编码为"\1"，但是如果原始的文本中包含"\1"，我们又陷入麻烦之中。一个避免这个问题的简单的方法是将所有"\x"类型的编码为"\ddd"，其中ddd是字符x的十进制表示：
``` lua
function  code (s) 
  return (string.gsub(s, "\\(.)", function  (x) 
   return string.format( "\\%03d" , string.byte(x)) 
  end )) 
end
```
　　注意，原始串中的`\ddd`也会被编码，解码是很容易的：
``` lua
function  decode (s) 
  return (string.gsub(s, "\\(%d%d%d)", function  (d) 
   return "\" .. string.char(d) 
  end )) 
end
```
　　如果被编码的串不包含任何转义符，我们可以简单的使用` ".-" `来查找双引号字符串：
``` lua
s = [[follows a typical string: "This is " great "!" .]] 
s = code(s) 
s = string.gsub(s, '(".-")', string.upper) 
s = decode(s) 
print(s) 
  --> follows a typical string: "THIS IS "GREAT"!".
```
　　更紧缩的形式： 
``` lua
print(decode(string.gsub(code(s), '(".-")', string.upper)))
```
<br>　　我们回到前面的一个例子，转换`\command{string}`这种格式的命令为XML风格：
``` lua
<command>string</command>
```
　　但是这一次我们原始的格式中可以包含反斜杠作为转义符，这样就可以使用`\\`、`\{` 和 `\}`，分别表示 `\`、`{`  和 `}`。为了避免命令和转义的字符混合在一起，我们应该首先将原始串中的这些特殊序列重新编码，然而，与上面的一个例子不同的是，我们不能转义所有的`\x`，因为这样会将我们的命令（`\command`）也转换掉。这里，我们仅当x不是字符的时候才对`\x`进行编码：
``` lua
function  code (s) 
  return (string.gsub(s, '\\(%A)', function  (x) 
   return string.format( "\\%03d" , string.byte(x)) 
  end )) 
end
```
　　解码部分和上面那个例子类似，但是在最终的字符串中不包含反斜杠，所以我们可直接调用 string.char：
``` lua
function  decode (s) 
  return (string.gsub(s, '\\(%d%d%d)', string.char)) 
end 
 
s = [[a \emph{command} is written as \\command\{text\}.]]
s = code(s) 
s = string.gsub(s, "\\(%a+){(.-)}" , "<%1>%2</%1>" )
print(decode(s)) 
-->  a <emph>command</emph> is written as \command{text}.
```
<br>
**CSV**
　　我们最后一个例子是处理CSV（逗号分割）的文件，很多程序都使用这种格式的文本，比如Microsoft Excel。
<br>　　CSV文件十多条记录的列表，每一条记录一行，一行内值与值之间逗号分割，如果一个值内也包含逗号这个值必须用双引号引起来，如果值内还包含双引号，需使用双引号转义双引号（就是两个双引号表示一个），看例子，下面的数组：
``` lua
{'a b', 'a,b', 'a,"b"c', 'hello "world"!', }
```
　　可以看作为：
``` lua
a b,"a,b"," a,""b""c", hello "world"!,
```
　　将一个字符串数组转换为CSV格式的文件是非常容易的。我们要做的只是使用逗号将所有的字符串连接起来：
``` lua
function  toCSV (t) 
  local  s =  "" 
  for  _,p  in pairs(t)  do 
    s = s .. ","  .. escapeCSV(p) 
  end 
  return string.sub(s, 2)    -- remove first comma 
end
```
　　如果一个字符串包含逗号活着引号在里面，我们需要使用引号将这个字符串引起来，并转义原始的引号：
``` lua
function  escapeCSV (s) 
  if string.find(s, '[,"]') then 
   s = '"'  .. string.gsub(s, '"' , '""') ..  '"'  
  end 
  return s 
end
```
<br>　　将CSV文件内容存放到一个数组中稍微有点难度，因为我们必须区分出位于引号中间的逗号和分割域的逗号。我们可以设法转义位于引号中间的逗号，然而并不是所有的引号都是作为引号存在，只有在逗号之后的引号才是一对引号的开始的那一个。只有不在引号中间的逗号才是真正的逗号。这里面有太多的细节需要注意，比如，两个引号可能表示单个引号，可能表示两个引号，还有可能表示空：
``` lua
"hello""hello", "",""
```
　　这个例子中，第一个域是字符串`hello"hello`, 第二个域是字符串` ""`（也就是一个空白加两个引号），最后一个域是一个空串。<br>
　　我们可以多次调用gsub来处理这些情况，但是对于这个任务使用传统的循环（在每个域上循环）来处理更有效。循环体的主要任务是查找下一个逗号；并将域的内容存放到一个表中。对于每一个域，我们循环查找封闭的引号。循环内使用模式` "("?) `来查找一个域的封闭的引号：如果一个引号后跟着一个引号，第二个引号将被捕获并赋给一个变量c，意味着这仍然不是一个封闭的引号：
``` lua
function  fromCSV (s) 
  s = s .. ','    -- ending comma 
  local  t = {}    -- table to collect fields 
  local  fieldstart = 1 
  repeat 
   -- next field is quoted? (start with `"'?) 
   if string.find(s, '^"', fieldstart) then 
   local  a, c 
   local  i  = fieldstart 
   repeat 
    -- find closing quote 
      a, i, c = string.find(s, '"("?)', i+1) 
   until  c ~= '"'  -- quote not followed by quote?
   if not  i  then error('unmatched "' ) end  
    local  f = string.sub(s, fieldstart+1, i-1) 
   table.insert(t, (string.gsub(f, '""', '"' )))  
    fieldstart = string.find(s,  ',' , i) + 1 
   else     -- unquoted; find next comma
    local  nexti = string.find(s, ',' , fieldstart)
    table.insert(t, string.sub(s, fieldstart, 
             nexti-1)) 
      fieldstart = nexti + 1 
   end 
  until  fieldstart > string.len(s) 
  return t 
end
t = fromCSV('"hello "" hello", "",""' ) 
for i, s in ipairs(t) do print(i, s) end  
  --> 1       hello " hello 
  --> 2        "" 
  --> 3
```
<br>
## IO库 ##
　　I/O 库为文件操作提供两种模式。简单模式（simple model ）拥有一个当前输入文件和一个当前输出文件，并且提供针对这些文件相关的操作。完全模式（complete model）使用外部的文件句柄来实现。它以一种面对对象的形式，将所有的文件操作定义为文件句柄的方法。简单模式在做一些简单的文件操作时较为合适，在本书的前面部分我们一直都在使用它。但是在进行一些高级的文件操作的时候，简单模式就显得力不从心。例如同时读取多个文件这样的操作，使用完全模式则较为合适。I/O库的所有函数都放在表（table ）io 中。
<br>
**简单I/O模式**
　　简单模式的所有操作都是在当前文件之上进行的。 
　　默认情况下I/O库将标准输入(stdin) 作为当前输入文件，将标准输出(stdout)作为当前输出文件。

<br>　　范例1：标准输入输出。
``` lua
io.write(io.read())
```

    语句解释：
    -  使用io.read()函数从当前输入文件中读取数据，使用io.write()函数向当前输出文件中写入数据。
    -  标准输入是键盘，标准输出是命令行窗口。
　　我们可以使用 io.input 和 io.output 函数来改变当前文件。例如 io.input(filename)就是打开给定文件（以读模式），并将其设置为当前输入文件。接下来所有的输入都来自于该文件，直到再次使用 io.input，(io.output 函数类似于 io.input)。

<br>　　范例2：修改当前文件。
``` lua
io.write("name = ","Lua") 
io.output("E:\\lua\\b.lua")
io.write("name = ","Lua") 
io.flush()

print(io.read())
io.input("E:\\lua\\b.lua")
print(io.read())
```

    语句解释：
    -  io.flush函数会将内存缓冲区中的数据立刻写入到磁盘。
　　在编写代码时应当避免像io.write(a..b..c)；这样的书写，这同io.write(a,b,c)的效果是一样的。但是后者因为避免了串联操作，而消耗较少的资源。原则上当你进行粗略（quick and dirty ）编程，或者进行排错时常使用print函数。当需要完全控制输出时使用 write。

<br>　　范例3：二者的区别。
``` lua
print( "hello", "Lua" ); print("Hi") 
  --> hello   Lua
  --> Hi
io.write("hello", "Lua" ); io.write("Hi", "\n")
  --> helloLuaHi
```

    语句解释：
    -  write不附加任何额外的字符到输出中去，例如制表符，换行符等等。
    -  write函数是使用当前输出文件，而print 始终使用标准输出。
    -  print函数会自动调用参数的 tostring方法，所以可以显示出表(tables)函数(functions)和nil。
<br>
**read函数**
　　read 函数从当前输入文件读取串，由它的参数控制读取的内容：
```
*all  		-- 读取整个文件 
*line  		-- 读取下一行 
*number  	-- 从串中转换出一个数值 
 num  		-- 读取num 个字符到串
```

<br>　　范例1：读取整个文件。
``` lua
io.input("D: \\b.lua")
print(io.read("*all"))
```

<br>　　范例2：读取一行文本。
``` lua
io.input("D: \\b.lua")
print(io.read("*line"))
```

    语句解释：
    -  对于“*line”来说，函数返回当前输入文件的下一行（不包含最后的换行符）。当到达文件末尾，返回值为 nil（表示
    没有下一行可返回）。
    -  该读取方式是 read 函数的默认方式，所以可以简写为io.read()。

<br>　　范例3：遍历文件的所有行。
``` lua
io.input("D:\\ b.lua")
-- while true do
--     local line = io.read()
--     if not line then break end
--     print(line)
-- end

for line in io.lines() do
    print(line)
end
```

    语句解释：
    -  除了可以通过while实现遍历操作外，使用io.lines函数也可以方便的遍历文件中的所有行。

<br>　　范例4：读取数字。
　　对于`*number`来说，read函数会从当前输入文件的当前读取位置开始，尝试读取数字，如果成功则将数字返回，如果在当前位置找不到一个数字（由于格式不对，或者是到了文件的结尾），则返回nil。可以对每个参数设置选项，函数将返回各自的结果。假如有一个文件每行包含三个数字：
``` lua
6.0   -3.23   15e12 
4.3   234    1000001 
...
```
　　现在要打印出每行最大的一个数，就可以使用一次 read 函数调用来读取出每行的全部三个数字：
``` lua
while  true do 
  local  n1, n2, n3 = io.read("*number", "*number", "*number") 
  if not  n1 then break  end  
  print(math.max(n1, n2, n3)) 
end
```
　　在任何情况下，都应该考虑选择使用 io.read 函数的` *.all `选项读取整个文件，然后使用gfind函数来分解：
``` lua
local  pat = "(%S+)%s+(%S+)%s+(%S+)%s+" 
for  n1, n2, n3 in string.gfind(io.read("*all"), pat)  do
  print(math.max(n1, n2, n3)) 
end
```
　　只有在`*number`参数下 read 函数才返回数值，而不是字符串。

<br>　　范例5：除了基本读取方式外，还可以将数值 n 作为 read 函数的参数。在这样的情况下 read 函数将尝试从输入文件中读取 n 个字符。如果无法读取到任何字符（已经到了文件末尾），函数返回 nil 。否则返回一个最多包含 n 个字符的串。以下是关于该 read 函数参数的一个进行高效文件复制的例子程序（当然是指在 Lua 中）。
``` lua
local  size = 2^13    -- good buffer size (8K) 
while  true do 
  local  block = io.read(size) 
  if not  block then break  end  
 io.write(block) 
end
```
　　特别的，使用 io.read(0) 可以用来测试是否到达了文件末尾。如果不是返回一个空串，如果已是文件末尾返回 nil 。
<br>
**完全I/O模式**
　　为了对输入输出的更全面的控制，可以使用完全模式。完全模式类似于C语言中的文件流（FILE*），其呈现了一个打开的文件以及当前存取位置。
　　使用io.open函数来打开一个文件，它类似于C语言中的 fopen 函数，接收两个输入参数：文件名和打开模式。
　　打开模式：可以是 `r`(读模式)，`w`(写模式，对数据进行覆盖)，或者是`a`(附加模式)。并且可以在它们后面附加字符`b`表示以二进制形式打开文件。
　　正常情况下 open 函数返回一个文件的句柄，如果发生错误，则返回 nil，以及一个错误信息和错误代码。
 
<br>　　范例1：打开文件。
``` lua
print(io.open("D: \\t1.lua", "r" )) 
print(io.open("D: \\t2.lua" , "w" )) 
print(io.open("D: \\t3.lua" , "a" )) 
```

    语句解释：
    -  对于“r”模式来说，若文件不存在，则返回 nil 。
    -  对于“w”和“a”模式来说，若文件不存在则会尝试创建，若创建失败(路径不存在、没有权限等)则会返回 nil 。
　　错误代码的定义由系统决定。 以下是一段典型的检查错误的代码：
``` lua
local  f = assert(io.open(filename, mode))
```
　　如果 open 函数失败，错误信息作为 assert 的参数，由 assert 显示出信息。文件打开后就可以用 read 和 write 方法对他们进行读写操作。它们和 io 表的 read/write 函数类似，但是调用方法上不同，必须使用冒号字符，作为文件句柄的方法来调用。例如打开一个文件并全部读取。可以使用如下代码。
``` lua
local  f = assert(io.open(filename,  "r" )) 
local  t = f:read("*all") 
f:close()
```
　　提示：使用冒号是面向对象章节中的语法，后面会详细介绍。
　　同C语言中的流（stream）设定类似，I/O 库提供三种预定义的句柄：io.stdin 、io.stdout和io.stderr 。因此可以用如下代码直接发送信息到错误流（error stream ）: 
``` lua
io.stderr:write(message)
```
　　我们还可以将完全模式和简单模式混合使用。使用没有任何参数的 io.input() 函数可以得到当前的输入文件的句柄；然后再使用带有参数的 io.input(handle) 函数设置当前的输入文件为 handle 句柄代表的输入文件。（同样的用法对于io.output 函数也适用）例如要实现暂时的改变当前输入文件，可以使用如下代码：
``` lua
local  temp = io.input()    -- save current file 
io.input("newinput" )     -- open a new current file 
...        -- do something with new input 
io.input():close()     -- close current file 
io.input(temp)     -- restore previous current file
```
　　提示：使用完文件后，应该调用 close() 方法关闭流。
<br>
**I/O优化的一个小技巧**
　　由于通常 Lua 中读取整个文件要比一行一行的读取一个文件快的多。尽管我们有时候针对较大的文件（几十，几百兆），不可能把一次把它们读取出来。要处理这样的文件我们仍然可以一段一段（例如8kb 一段）的读取它们。同时为了避免切割文件中的行，还要在每段后加上一行：
``` lua
local  lines, rest = f:read(BUFSIZE, "*line")
```
　　以上代码中的 rest 就保存了任何可能被段划分切断的行。然后再将段（chunk）和行接起来。这样每个段就是以一个完整的行结尾的了。以下代码就较为典型的使用了这一技巧。该段程序实现对输入文件的字符，单词，行数的计数。
``` lua
local  BUFSIZE = 2^13     -- 8K 
local  f = io.input(arg[1])  -- open input file 
local  cc, lc, wc = 0, 0, 0  -- char, line, and word counts 
 
while  true do 
  local  lines, rest = f:read(BUFSIZE, "*line") 
  if not  lines then break  end  
  if rest then lines = lines .. rest .. '\n' end  
  cc = cc + string.len(lines) 
  -- count words in the chunk
  local  _,t = string.gsub(lines, "%S+" , "") 
  wc = wc + t 
  -- count newlines in the chunk 
  _,t = string.gsub(lines, "\n", "\n") 
  lc = lc + t 
end 
 
print(lc, wc, cc)
```
<br>
**二进制文件**
　　默认的简单模式总是以文本模式打开。在 Unix 中二进制文件和文本文件并没有区别，但是在如 Windows 这样的系统中，二进制文件必须以显式的标记来打开文件。控制这样的二进制文件，你必须将`b`标记添加在 io.open 函数的格式字符串参数中。<br>
　　在 Lua 中二进制文件的控制和文本类似。一个串可以包含任何字节值，库中几乎所有的函数都可以用来处理任意字节值。
　　你甚至可以对二进制的“串”进行模式比较，只要串中不存在0值。如果想要进行0值字节的匹配，你可以使用`%z`代替）这样使用`*all`模式就是读取整个文件的值，使用数字n就是读取n个字节的值。以下是一个将文本文件从DOS模式转换到Unix模式的简单程序。（这样转换过程就是将“回车换行字符”替换成“换行字符”。 
　　因为是以二进制形式打开这些文件的，这里无法使用标准输入输入文件（stdin/stdout），所以使用程序中提供的参数来得到输入、输出文件名。
``` lua
local  inp = assert(io.open(arg[1],  "rb")) 
local  out = assert(io.open(arg[2],  "wb")) 
 
local  data = inp:read("*all") 
data = string.gsub(data,  "\r\n", "\n") 
out:write(data) 
 
assert(out:close())
```
　　可以使用如下的命令行来调用该程序：
``` lua
lua prog.lua file.dos file.unix
```
　　第二个例子程序：打印在二进制文件中找到的所有特定字符串。该程序定义了一种最少拥有六个“有效字符”，以零字节值结尾的特定串。（本程序中“有效字符”定义为文本数字、标点符号和空格符，由变量 validchars 定义。）在程序中我们使用连接和 string.rep 函数创建 validchars，以`%z`结尾来匹配串的零结尾。
``` lua
local  f = assert(io.open(arg[1],  "rb"))
local  data = f:read( "*all") 
local  validchars = "[%w%p%s]"  
local  pattern = string.rep(validchars, 6) ..  "+%z"  
for  w  in string.gfind(data, pattern) do 
 print(w) 
end
```
　　最后一个例子：该程序对二进制文件进行一次值分析（Dump）。程序的第一个参数是输入文件名，输出为标准输出。其按照10字节为一段读取文件，将每一段各字节的十六进制表示显示出来。接着再以文本的形式写出该段，并将控制字符转换为点号。
``` lua
local  f = assert(io.open(arg[1],  "rb")) 
local  block = 10 
while  true do 
  local  bytes = f:read(block) 
  if not  bytes then break  end  
  for  b  in string.gfind(bytes, "." ) do 
  io.write(string.format("%02X ", string.byte(b))) 
  end 
 io.write(string.rep("   " , block - string.len(bytes) + 1)) 
 io.write(string.gsub(bytes, "%c", "." ),  "\n") 
end
```
　　如果以vip来命名该程序脚本文件。可以使用如下命令来执行该程序处理其自身：
``` lua
lua vip vip
```
　　在 Unix 系统中它将会会产生一个如下的输出样式：
``` lua
6C 6F 63 61 6C 20 66 20 3D 20    local f =  
61 73 73 65 72 74 28 69 6F 2E    assert(io. 
6F 70 65 6E 28 61 72 67 5B 31    open(arg[1 
5D 2C 20 22 72 62 22 29 29 0A    ], "rb")). 
    ... 
22 25 63 22 2C 20 22 2E 22 29    "%c", ".") 
2C 20 22 5C 6E 22 29 0A 65 6E    , "\n").en 
64 0A         d.
```
<br>
**关于文件的其它操作**
　　函数 tmpfile 函数用来返回零时文件的句柄，并且其打开模式为read/write模式。该零时文件在程序执行完后会自动进行清除。
　　函数 flush 用来应用针对文件的所有修改，同 write 函数一样，该函数的调用既可以按函数调用的方法使用 io.flush() 来应用当前输出文件；也可以按文件句柄方法的样式 f:flush()来应用文件f。<br>
　　函数 seek 用来得到和设置一个文件的当前存取位置，它的一般形式为`filehandle:seek(whence,offset)`：

    - whence参数是一个表示偏移方式的字符串。它可以是：
      "set"，偏移值是从文件头开始。
      "cur"，偏移值从当前位置开始。
      "end"，偏移值从文件尾往前计数。
    - offset 参数为偏移的数值。 
    - 由 whence 的值和 offset 相结合得到新的文件读取位置。该位置是实际从文件开头计数的字节数。
    - whence的默认值为 "cur" ，offset 的默认值为 0 。 
　　这样调用 file:seek() 得到的返回值就是文件当前的存取位置，且保持不变。`file:seek("set")`就是将文件的存取位置重设到文件开头。（返回值当然就是0 ）。而 `file:seek("end")`就是将位置设为文件尾，同时就可以得到文件的大小。<br>
　　如下的代码实现了得到文件的大小而不改变存取位置：
``` lua
function  fsize (file) 
  local  current = file:seek()   -- get current position 
  local  size = file:seek( "end" )  -- get file size 
 file:seek("set" , current)    -- restore position 
  return size 
end
```
　　以上的几个函数在出错时都将返回一个包含了错误信息的 nil 值。
<br>
## 操作系统库 ##
　　操作系统库包含了文件管理，系统时钟等等与操作系统相关信息。这些函数定义在表os中。定义该库时考虑到 Lua 的可移植性，因为 Lua 是以 ANSI C 写成的，所以只能使用ANSI定义的一些标准函数。许多的系统属性并不包含在ANSI定义中，例如目录管理，套接字等等。所以在系统库里并没有提供这些功能。另外有一些没有包含在主体发行版中的 Lua 库提供了操作系统扩展属性的访问。例如posix库，提供了对 POSIX 1 标准的完全支持；在比如 luasocket 库，提供了网络支持。 <br>
　　在文件管理方面操作系统库就提供了`os.rename`函数（修改文件名）和`os.remove`函数（删除文件）。
<br>
**Date 和 Time**
　　time 和 date 两个函数在 Lua 中实现所有的时钟查询功能。

<br>　　范例1：获取时间。
``` lua
print(os.time())
print(os.date())
```

    语句解释：
    -  time函数的返回值依据用户操作系统的当前时区而定：
       - 若是中时区，则返回值是相对于1970年1月1日00:00:00的秒数。
       - 若是东八区，则返回值是相对于1970年1月1日00:08:00的秒数。
<br>
**time函数**
　　函数 time 在没有参数时返回当前时钟的数值。（在许多系统中该数值是当前距离某个特定时间的秒数。）当为函数传递一个时间表时，该函数就是返回距该表所描述的时间的数值。这样的时间表有如下的区间：
``` lua
year		-- a full year
month		-- 01-12
day		-- 01-31
hour		-- 00-23
min		-- 00-59
sec		-- 00-59
isdst		-- a boolean, true  if daylight saving
```

<br>　　范例2：创建一个时间。
``` lua
print(os.time{year=2014, month=1, day=15, hour=0}) 
print(os.time{year=1970, month=1, day=1, hour=8, min = 0,sec = 0}) 
print(os.time{year=1970, month=1, day=1})
```

    语句解释：
    -  前三项是必需的，如果未定义后几项，默认时间为正午(12:00:00)。
    -  第二行代码在东八区中执行返回的是0 ，而在东七区中执行就返回3600。
<br>
**date函数**
　　函数 data 是 time 函数的一种“反函数”。它将一个表示日期和时间的数值，转换成更高级的表现形式。它接收两个参数：

    -  第一个参数是一个格式化字符串，描述了要返回的时间形式。
	-  第二个参数就是时间的数字表示，默认为当前的时间。

<br>　　范例1：格式化日期显示。
``` lua
time = os.date("*t", os.time{year=2014, month=1, day=15});
for k,v in pairs(time) do
    print(k,v)
end
```
　　程序输出：

    hour	11
    min	45
    wday	4
    day	15
    month	1
    year	2014
    sec	49
    yday	15
    isdst	false
　　上表中除了使用到了在上述时间表中的区域以外，这个表还提供了星期（wday，星期天为1）和一年中的第几天（yday ，一月一日为1）除了使用`*t`格式字符串外，如果使用带标记（见下表）的特殊字符串，os.data 函数会将相应的标记位以时间信息进行填充，得到一个包含时间的字符串。（这些特殊标记都是以`%`和一个字母的形式出现）如下：
``` lua
print(os.date("today is %A, in %B" )) 
  --> today is Tuesday, in May 
print(os.date("%x", 906000490)) 
  --> 09/16/1998
```
　　这些时间输出的字符串表示是经过本地化的。所以如果是在巴西（葡萄牙语系），`%B`得到的就是`setembro`，`%x`得到的就是`16/09/98`（月日次序不同）。标记的意义和显示实例总结如下表。实例的时间是在`1998年九月16日，星期三，23:48:10`。返回值为数字形式的还列出了它们的范围。
``` lua
%a		-- 一星期中天数的简写
%A		-- 一星期中天数的全称
%b		-- 月份的简写
%B		-- 月份的全称
%c		-- 日期和时间（09/16/98 23:48:10）
%d		-- 一个月中的第几天（0~31）
%H		-- 24小时制中的小时数（00~23）
%I		-- 12小时制中的小时数（01~12）
%j		-- 一年中的第几天（01~365）
%M		-- 分钟数（00~59）
%m		-- 月份数（01~12）
%P		-- 上午（am）或者下午（pm）
%S		-- 秒数（00~59）
%w		-- 一星期中的第几天（0~6 = 星期天~星期六）
%W		-- 一年中第几个星期（0~52）
%x		-- 日期（09/16/98）
%X		-- 时间（23:48:10）
%y		-- 两位数的年份（00~99）
%Y		-- 完整的年份（2009）
%%		-- 字符串‘%’
```

　　事实上如果不使用任何参数就调用 date ，就是以`%c`的形式输出。这样就是得到经过格式化的完整时间信息。还要注意`%x`、`%X`和`%c`由所在地区和计算机系统的改变会发生变化。如果该字符串要确定下来（例如确定为`mm/dd/yyyy`），可以使用明确的字符串格式方式（例如`%m/%d/%Y`）。<br>
　　函数 os.clock 返回执行该程序 CPU 花去的时钟秒数。该函数常用来测试一段代码。
``` lua
local  x = os.clock() 
local  s = 0 
for  i=1,100000 do s = s + i end  
print(string.format( "elapsed time: %.2f\n", os.clock() - x))
```
<br>
**其它的系统调用**
　　函数`os.exit`终止一个程序的执行。函数`os.getenv`得到“环境变量”的值。以“变量名”作为参数，返回该变量值的字符串。

<br>　　范例1：获取path的值。
``` lua
print(os.getenv("path"))
```

    语句解释：
    -  如果没有该环境变量则返回nil。
　　函数`os.execute`执行一个系统命令（和 C 中的 system 函数等价）。该函数获取一个命令字符串，返回一个错误代码。

<br>　　范例2：在 Unix 和 DOS-Windows 系统里都可以执行如下代码创建一个新目录。
``` lua
function createDir (dirname) 
 os.execute("mkdir "  .. dirname) 
end
```

    语句解释：
    -  os.execute 函数较为强大，同时也更加倚赖于计算机系统。
<br>　　函数`os.setlocale`设定 Lua 程序所使用的区域（locale）。区域定义的变化对于文化和语言是相当敏感的。`os.setlocale`有两个字符串参数：

    区域名。
    特性（category，用来表示区域的各项特性）。 共六种：
    -  “collate ”（排序）控制字符的排列顺序。
    -  "ctype" controls the types of individual characters (e.g., what is a letter) and th e 
    conversion between lower and upper cases。
    -  "monetary" （货币）对Lua 程序没有影响。
    -  "numeric" （数字）控制数字的格式。
    -  "time" （时间）控制时间的格式（也就是os.date 函数）。
    -  “all ” 包含以上所以特性。
　　默认的特性就是`all`，所以如果你只包含地域名就调用函数`os.setlocale`那么所有的特性都会被改变为新的区域特性。如果运行成功函数返回地域名，否则返回 nil（通常因为系统不支持给定的区域）。如：
``` lua
print(os.setlocale("ISO-8859-1", "collate"))  --> ISO-8859-1
```
　　关于`numeric`特性有一点难处理的地方。尽管葡萄牙语和其它的一些拉丁文语言使用逗号代替点号来表示十进制数，但是区域设置并不会改变 Lua 划分数字的方式。（除了其它一些原因之外，由于print（3,4）还有其它的函数意义。）因此设置之后得到的系统也许既不能识别带逗号的数值，又不能理解带点号的数值。
``` lua
--  设置区域为葡萄牙语系巴西 
print(os.setlocale('pt_BR'))  --> pt_BR 
print(3,4)    --> 3    4 
print(3.4)    --> stdin:1: malformed number near '3.4'
```
<br><br>
# 第四节 tables与objects #
## 数据结构 ##
　　table 是 Lua 中唯一的数据结构，其他语言所提供的其他数据结构比如：arrays 、records 、lists 、queues 、sets 等，在 Lua 中都是通过 table 来实现的，并且也很容易。<br>
　　在传统的 C 语言或者 Pascal 语言中我们经常使用 arrays 和 lists （record+pointer）来实现大部分的数据结构，在 Lua 中不仅可以用 table 完成同样的功能，而且 table 的功能更加强大。通过使用 table 很多算法的实现都简化了，比如你在 lua 中很少需要自己去实现一个搜索算法，因为 table 本身就提供了这样的功能。<br>
　　我们需要花一些时间去学习如何有效的使用 table ，下面我们通过一些例子来看看如果通过 table 来实现一些常用的数据结构。首先，我们从 arrays 和 lists 开始，不仅因为它是其他数据结构的基础，而且是我们所熟悉的。在第一部分语言的介绍中，我们已经接触到了一些相关的内容，在这一章我们将再来完整的学习他。
<br>
**数组**
　　在 lua 中通过整数下标访问表中的元素即可简单的实现数组。并且数组不必事先指定大小，大小可以随需要动态的增长。通常我们初始化数组的时候就间接的定义了数组的大小，比如下面的代码：
``` lua
a = {}   -- new array 
for  i=1, 1000 do 
  a[i] = 0 
end
```
　　通过初始化，数组 a 的大小已经确定为1000，企图访问 1-1000 以外的下标对应的值将返回 nil 。你可以根据需要定义数组的下标从 0,1 或者任意其他的数值开始，比如：
``` lua
-- creates an array with indices from -5 to 5 
a = {} 
for  i=-5, 5 do 
  a[i] = 0 
end
```
　　然而在 Lua 中习惯上数组的下表从 1 开始，Lua 的标准库与此习惯保持一致，因此如果你的数组下标也是从 1 开始你就可以直接使用标准库的函数，否则就无法直接使用。我们可以用构造器在创建数组的同时并初始化数组：
``` lua
squares = {1, 4, 9, 16, 25, 36, 49, 64, 81}
```
　　这样的语句中数组的大小可以任意的大，甚至几百万，但是数组的下标默认就从1开始了。
<br>
**阵和多维数组**
　　Lua 中主要有两种表示矩阵的方法，第一种是用数组的数组表示。也就是说一个表的元素是另一个表。例如，可以使用下面代码创建一个 n 行 m 列的矩阵：
``` lua
mt = {}      -- create the matrix 
for  i=1,N do 
  mt[i] = {}   -- create a new row 
  for  j=1,M do 
  mt[i][j] = 0 
  end 
end
```
　　由于 Lua 中 table 是个对象，所以对于每一行我们必须显式的创建一个 table ，这看起来比起 c 或者 pascal 显得冗余，另一方面它也提供了更多的灵活性，例如可以修改前面的例子来创建一个三角矩阵：
``` lua
for  j=1,M do
改成 
for  j=1,i do
```
　　这样实现的三角矩阵比起整个矩阵，仅仅使用一半的内存空间。<br>
　　第二种表示矩阵的方法是将行和列组合起来，如果索引下标都是整数，通过第一个索引乘于一个常量（列）再加上第二个索引，看下面的例子实现创建 n 行 m 列的矩阵：
``` lua
mt = {}      -- create the matrix 
for  i=1,N do 
  for  j=1,M do 
    mt[i*M + j] = 0 
  end 
end
```
　　如果索引都是字符串的话，可以用一个单字符将两个字符串索引连接起来构成一个单一的索引下标，例如一个矩阵 m，索引下标为 s 和 t ，假定 s 和 t 都不包含冒号，代码为：`s..':'..t`，如果s 或者t 包含冒号将导致混淆，比如 `("a:", "b")` 和 `("a", ":b")`，当对这种情况有疑问的时候可以使用控制字符来连接两个索引字符串，比如`\0`。<br>
　　实际应用中常常使用稀疏矩阵，稀疏矩阵指矩阵的大部分元素都为空或者 0 的矩阵。例如，我们通过图的邻接矩阵来存储图，也就是说：当 m,n 两个节点有连接时，矩阵的 m,n 值为对应的 x ，否则为 nil 。如果一个图有 10000 个节点，平均每个节点大约有 5 条边，为了存储这个图需要一个行列分别为10000 的矩阵，总计 10000\*10000 个元素，实际上大约只有50000 个元素非空（每行有五列非空，与每个节点有五条边对应）。很多数据结构的书上讨论采用何种方式才能节省空间，但是在 Lua 中你不需要这些技术，因为用 table 实现的数据本身天生的就具有稀疏的特性。如果用我们上面说的第一种多维数组来表示，需要 10000 个 table ，每个 table 大约需要五个元素（table ）；如果用第二种表示方法来表示，只需要一张大约50000 个元素的表，不管用那种方式，你只需要存储那些非 nil 的元素。
<br>
**链表**
　　Lua 中用 tables 很容易实现链表，每一个节点是一个 table ，指针是这个表的一个域，并且指向另一个节点(table) 。例如，要实现一个只有两个域：值和指针的基本链表，代码如下：
``` lua
head = nil
function addElement()  -- 添加元素，使用此方式可以倒序排列一个数组
  for i=1,10 do
    newNode = {value = i,next = head}
    head = newNode
  end
end
function printElement()
  while head do
    print(head.value)
    head = head.next
  end
end
addElement()
printElement()
```
　　其他类型的链表，像双向链表和循环链表类似的也是很容易实现的。然后在 Lua 中在很少情况下才需要这些数据结构，因为通常情况下有更简单的方式来替换链表。比如，我们可以用一个非常大的数组来表示栈，其中一个域 n 指向栈顶。
<br>
**队列和双端队列**
　　虽然可以使用 Lua 的 table 库提供的 insert 和 remove 操作来实现队列，但这种方式实现的队列针对大数据量时效率太低，有效的方式是使用两个索引下标，一个表示第一个元素，另一个表示最后一个元素。
``` lua
function  ListNew () 
  return {first = 0, last = -1}
end
```
　　为了避免污染全局命名空间，我们重写上面的代码，将其放在一个名为 list 的 table 中：
``` lua
List = {} 
function  List.new () 
  return {first = 0, last = -1} 
end
```
　　下面，我们可以在常量时间内，完成在队列的两端进行插入和删除操作了：
``` lua
function  List.pushleft (list, value) 
  local  first = list.first - 1 
  list.first = first 
  list[first] = value 
end 
 
function  List.pushright (list, value) 
  local  last = list.last + 1 
  list.last = last 
  list[last] = value 
end

function  List.popleft (list) 
  local  first = list.first 
  if first > list.last then error("list is empty" ) end  
  local value = list[first] 
  list[first] = nil    -- to allow garbage collection 
  list.first = first + 1 
  return value 
end

function  List.popright (list) 
  local  last = list.last 
  if list.first > last then error("list is empty" ) end  
  local  value = list[last] 
  list[last] = nil    -- to allow garbage collection 
  list.last = last - 1 
  return value 
end
```
　　对严格意义上的队列来讲，我们只能调用 pushright 和 popleft ，这样以来，first 和last 的索引值都随之增加，幸运的是我们使用的是 Lua 的 table 实现的，你可以访问数组的元素，通过使用下标从 1 到 20，也可以 16,777,216  到 16,777,236 。另外，Lua 使用双精度表示数字，假定你每秒钟执行 100 万次插入操作，在数值溢出以前你的程序可以运行 200 年。
<br>
**集合和包**
　　假定你想列出在一段源代码中出现的所有标示符，某种程度上，你需要过滤掉那些语言本身的保留字。一些 C 程序员喜欢用一个字符串数组来表示，将所有的保留字放在数组中，对每一个标示符到这个数组中查找看是否为保留字，有时候为了提高查询效率，对数组存储的时候使用二分查找或者 hash 算法。<br>
　　Lua 中表示这个集合有一个简单有效的方法，将所有集合中的元素作为下标存放在一个table 里，下面不需要查找 table ，只需要测试看对于给定的元素，表的对应下标的元素值是否为 nil 。比如：
``` lua
reserved = { 
 ["while"] = true,  ["end" ] = true, 
 ["function" ] = true, [ "local"] = true, 
}

for  w  in allwords() do 
  if reserved[w]  then 
  -- `w' is a reserved word 
 ...
```
　　还可以使用辅助函数更加清晰的构造集合：
``` lua
function  Set (list) 
  local  set = {} 
  for  _, l in ipairs(list) do set[l] =  true end  
  return set 
end 
 
reserved = Set{ "while", "end" , "function" , "local", }
```
<br>
**字符串缓冲**
　　假定你要拼接很多个小的字符串为一个大的字符串，比如，从一个文件中逐行读入字符串。你可能写出下面这样的代码：
``` lua
-- WARNING: bad code ahead!! 
local  buff =  "" 
for  line in io.lines() do 
  buff = buff .. line ..  "\n" 
end
```
　　尽管这段代码看上去很正常，但在 Lua 中他的效率极低，在处理大文件的时候，你会明显看到很慢，例如，需要花大概1分钟读取 350KB 的文件。（这就是为什么 Lua 专门提供了`io.read(*all)`选项，她读取同样的文件只需要 0.02s）<br>
　　为什么这样呢？Lua 使用真正的垃圾收集算法，当它发现程序使用太多的内存他就会遍历他所有的数据结构去释放垃圾数据，一般情况下，这个算法有很好的性能（Lua的快并非偶然的），但是上面那段代码 loop 使得算法的效率极其低下。<br>
　　为了理解现象的本质，假定我们身在 loop 中间，buff 已经是一个 50KB 的字符串，每一行的大小为20bytes，当 Lua 执行`buff..line.."\n"`时，它创建了一个新的字符串大小为 50,020 bytes，并且从 buff 中将 50KB 的字符串拷贝到新串中。也就是说，对于每一行，都要移动 50KB 的内存，并且越来越多。读取 100 行的时候（仅仅 2KB ），Lua 已经移动了5MB的内存，使情况变遭的是下面的赋值语句：
``` lua
buff = buff .. line ..  "\n"
```
　　老的字符串变成了垃圾数据，两轮循环之后，将有两个老串包含超过 100KB 的垃圾数据。这个时候 Lua 会做出正确的决定，进行他的垃圾收集并释放 100KB 的内存。问题在于每两次循环Lua 就要进行一次垃圾收集，读取整个文件需要进行 200 次垃圾收集。并且它的内存使用是整个文件大小的三倍。
　　这个问题并不是Lua 特有的：其它的采用垃圾收集算法的并且字符串不可变的语言也都存在这个问题。Java 是最著名的例子，Java 专门提供StringBuffer来改善这种情况。
　　在继续进行之前，我们应该做个注释的是，在一般情况下，这个问题并不存在。对于小字符串，上面的那个循环没有任何问题。为了读取整个文件我们可以使用`io.read(*all)`，可以很快的将这个文件读入内存。但是在某些时候，没有解决问题的简单的办法，所以下面我们将介绍更加高效的算法来解决这个问题。<br>
　　我们最初的算法通过将循环每一行的字符串连接到老串上来解决问题，新的算法避免如此：它连接两个小串成为一个稍微大的串，然后连接稍微大的串成更大的串。。。算法的核心是：用一个栈，在栈的底部用来保存已经生成的大的字符串，而小的串从栈顶入栈。栈的状态变化和经典的汉诺塔问题类似：位于栈下面的串肯定比上面的长，只要一个较长的串入栈后比它下面的串长，就将两个串合并成一个新的更大的串，新生成的串继续与相邻的串比较如果长于底部的将继续进行合并，循环进行到没有串可以合并或者到达栈底。
``` lua
function  newStack () 
  return {""}  -- starts with an empty string
end 
 
function  addString (stack, s) 
 table.insert(stack, s) -- push 's' into the the stack 
  for  i=table.getn(stack)-1, 1, -1  do 
   if string.len(stack[i]) > string.len(stack[i+1])  then
    break 
   end 
    stack[i] = stack[i] .. table.remove(stack) 
  end 
end
```
　　要想获取最终的字符串，我们只需要从上向下一次合并所有的字符串即可。`table.concat` 函数可以将一个列表的所有串合并。
　　使用这个新的数据结构，我们重写我们的代码：
``` lua
local  s = newStack() 
for  line in io.lines() do 
  addString(s, line ..  "\n") 
end 
s = toString(s)
```
　　最终的程序读取 350 KB 的文件只需要 0.5s ，当然调用`io.read("\*all")`仍然是最快的只需要0.02s。<br>
　　实际上，我们调用`io.read("*all")`的时候，io.read就是使用我们上面的数据结构，只不过是用 C 实现的，在 Lua 标准库中，有些其他函数也是用 C 实现的，比如 `table.concat`，使用table.concat我们可以很容易的将一个 table 的中的字符串连接起来，因为它使用 C 实现的，所以即使字符串很大它处理起来速度还是很快的。<br>
　　concat接受第二个可选的参数，代表插入的字符串之间的分隔符。通过使用这个参数，我们不需要在每一行之后插入一个新行：
``` lua
local  t = {} 
for  line in io.lines() do 
 table.insert(t, line) 
end 
s = table.concat(t,  "\n") ..  "\n"
```
　　`io.lines`迭代子返回不带换行符的一行，concat 在字符串之间插入分隔符，但是最后一字符串之后不会插入分隔符，因此我们需要在最后加上一个分隔符。最后一个连接操作复制了整个字符串，这个时候整个字符串可能是很大的。我们可以使用一点小技巧，插入一个空串：
``` lua
table.insert(t, "") 
s = table.concat(t,  "\n")
```
<br>
## 数据文件与持久化 ##
　　当我们处理数据文件时，一般来说，写文件比读取文件内容来的容易。因为我们可以很好的控制文件的写操作，而从文件读取数据常常碰到不可预知的情况。一个健壮的程序不仅应该可以读取存有正确格式的数据还应该能够处理坏文件（译者注：对数据内容和格式进行校验，对异常情况能够做出恰当处理）。正因为如此，实现一个健壮的读取数据文件的程序是很困难的。<br>
　　正如我们在Section 10.1（译者：第 10 章Complete Examples）中看到的例子，文件格式可以通过使用 Lua 中的 table 构造器来描述。我们只需要在写数据的稍微做一些做一点额外的工作，读取数据将变得容易很多。方法是：将我们的数据文件内容作为 Lua 代码写到Lua 程序中去。通过使用 table 构造器，这些存放在 Lua 代码中的数据可以像其他普通的文件一样看起来引人注目。<br>
　　为了更清楚地描述问题，下面我们看看例子. 如果我们的数据是预先确定的格式，比如 CSV （逗号分割值），我们几乎没得选择。（在第 20 章，我们介绍如何在 Lua 中处理 CSV 文件）。但是如果我们打算创建一个文件为了将来使用，除了 CSV ，我们可以使用 Lua 构造器来我们表述我们数据，这种情况下，我们将每一个数据记录描述为一个 Lua 构造器。将下面的代码：
``` lua
Donald E. Knuth,Literate Programming,CSLI,1992 
Jon Bentley,More Programming Pearls,Addison-Wesley,1990
```
　　写成：
``` lua
Entry{"Donald E. Knuth", 
"Literate Programming", 
"CSLI", 
1992} 
 
Entry{"Jon Bentley" , 
"More Programming Pearls" , 
"Addison-Wesley", 
1990}
```
　　记住 Entry{...} 与 Entry({...}) 等价，它是一个以表作为唯一参数的函数调用。所以，前面那段数据在Lua 程序中表示如上。如果要读取这个段数据，我们只需要运行我们的Lua 代码。例如下面这段代码计算数据文件中记录数：
``` lua
local  count = 0 
function  Entry (b) count = count + 1 end  
dofile("data") 
print("number of entries: " .. count)
```
　　下面这段程序收集一个作者名列表中的名字是否在数据文件中出现，如果在文件中出现则打印出来。（作者名字是Entry的第一个域；所以，如果 b 是一个entry的值，b[1]则代表作者名）
``` lua
local  authors = {}    -- a set to collect authors
function  Entry (b) authors[b[1]] = true end  
dofile("data") 
for  name in pairs(authors) do print(name)  end 
```
　　注意，在这些程序段中使用事件驱动的方法： Entry 函数作为回调函数，dofile 处理数据文件中的每一记录都回调用它。当数据文件的大小不是太大的情况下，我们可以使用 name-value 对来描述数据：
``` lua
Entry{ 
author = "Donald E. Knuth", 
title =  "Literate Programming", 
publisher = "CSLI", 
year = 1992 
} 
Entry{ 
author = "Jon Bentley" , 
title =  "More Programming Pearls" , 
publisher = "Addison-Wesley", 
year = 1990 
}
```
　　（如果这种格式让你想起BibTeX，这并不奇怪。Lua 中构造器正是根据来自 BibTeX的灵感实现的）这种格式我们称之为自描述数据格式，因为每一个数据段都根据他的意思简短的描述为一种数据格式。相对 CSV 和其他紧缩格式，自描述数据格式更容易阅读和理解，当需要修改的时候可以容易的手工编辑，而且不需要改动数据文件。例如，如果我们想增加一个域，只需要对读取程序稍作修改即可，当指定的域不存在时，也可以赋予默认值。使用name-value 对描述的情况下，上面收集作者名的代码可以改写为：
``` lua
local  authors = {} -- a set to collect authors 
function  Entry (b) authors[b.author] = true end  
dofile("data") 
for  name in pairs(authors) do print(name)  end  
```
　　现在，记录域的顺序无关紧要了，甚至某些记录即使不存在 author 这个域，我们也只需要稍微改动一下代码即可：
``` lua
function  Entry (b) 
if b.author  then authors[b.author] = true end  
end
```
　　Lua 不仅运行速度快，编译速度也快。例如，上面这段搜集作者名的代码处理一个2MB的数据文件时间不会超过1秒。另外，这不是偶然的，数据描述是 Lua 的主要应用之一，从 Lua 发明以来，我们花了很多心血使他能够更快的编译和运行大的 chunks 。
<br>
**序列化**
　　我们经常需要序列化一些数据，为了将数据转换为字节流或者字符流，这样我们就可以保存到文件或者通过网络发送出去。我们可以在 Lua 代码中描述序列化的数据，在这种方式下，我们运行读取程序即可从代码中构造出保存的值。<br>
　　通常，我们使用这样的方式`varname = <exp>`来保存一个全局变量的值。varname 部分比较容易理解，下面我们来看看如何写一个产生值的代码。对于一个数值来说：
``` lua
function  serialize (o) 
  if type(o) == "number"  then 
    io.write(o) 
  else ... 
end
```
　　对于字符串值而言，原始的写法应该是：
``` lua
if type(o) == "string"  then 
  io.write("'" , o,  "'" )
```
　　然而，如果字符串包含特殊字符（比如引号或者换行符），产生的代码将不是有效的 Lua 程序。这时候你可能用下面方法解决特殊字符的问题：
``` lua
if type(o) == "string"  then 
  io.write("[[", o,  "]]")
```
　　千万不要这样做！双引号是针对手写的字符串的而不是针对自动产生的字符串。<br>
　　如果有人恶意的引导你的程序去使用` ]]..os.execute('rm *')..[[ `这样的方式去保存某些东西（比如它可能提供字符串作为地址）你最终的chunk 将是这个样子：
``` lua
varname = [[ ]]..os.execute( 'rm *')..[[ ]]
```
　　如果你 load 这个数据，运行结果可想而知的。为了以安全的方式引用任意的字符串， string 标准库提供了格式化函数专门提供`%q`选项。它可以使用双引号表示字符串并且可以正确的处理包含引号和换行等特殊字符的字符串。这样一来，我们的序列化函数可以写为：
``` lua
function  serialize (o)
  if type(o) == "number"  then 
    io.write(o) 
  elseif type(o) == "string"  then 
    io.write(string.format("%q", o)) 
  else ... 
end
```
<br>
**保存不带循环的table**
　　我们下一个艰巨的任务是保存表。根据表的结构不同，采取的方法也有很多。没有一种单一的算法对所有情况都能很好地解决问题。简单的表不仅需要简单的算法而且结果文件也需要看起来也更美观。 我们第一次尝试如下：
``` lua
function  serialize (o) 
  if type(o) == "number"  then 
    io.write(o) 
  elseif type(o) == "string"  then 
    io.write(string.format("%q", o)) 
  elseif type(o) == "table" then 
    io.write("{\n" ) 
    for  k,v  in pairs(o)  do 
       io.write(" " , k,  " = " ) 
       serialize(v) 
       io.write(",\n" ) 
    end 
    io.write("}\n" ) 
  else 
    error("cannot serialize a " .. type(o)) 
  end 
end
serialize{
  name = "Google",
  personCount = 8,
  {name = "C1",jobAge = 1},
  {name = "C2",jobAge = 2},
  {name = "C3",jobAge = 3},
  {name = "C4",jobAge = 4}
}
```
　　尽管他很简单，但他的确很好的解决了问题。只要表结构是一个树型结构（也就是说，没有共享的子表并且没有循环），他甚至可以处理嵌套表（表中表）。对于缩进不整齐的表我们可以少作改进使结果更美观，这可以作为一个练习尝试一下。（提示：增加一个参数表示缩进的字符串，来进行序列化）。<br>
　　前面的函数假定表中出现的所有关键字都是合法的标示符。如果表中有不符合 Lua 语法的数字关键字或者字符串关键字，上面的代码将碰到麻烦。一个简单的解决这个难题的方法是将：
``` lua
io.write(" " , k,  " = " )
```
　　改为：
``` lua
io.write(" [") 
serialize(k) 
io.write("] = ")
```
　　这样一来，我们改善了我们的函数的健壮性，比较一下两次的结果：
``` lua
-- result of serialize{a=12, b='Lua', key='another "one"'} 
--  第一个版本 
{ 
a = 12, 
b = "Lua" , 
key = "another \"one\"", 
} 
 
--  第二个版本 
{ 
["a" ] = 12, 
["b" ] = "Lua" , 
["key" ] = "another \"one\"", 
}
```
　　我们可以通过测试每一种情况，看是否需要方括号，另外，我们将这个问题留作一个练习给大家。
<br>
**保存带有循环的table**
　　针对普通 table 概念上的带有循环表和共享子表的 table ，我们需要另外一种不同的方法来处理。构造器不能很好地解决这种情况，我们不使用。为了表示循环我们需要将表名记录下来，下面我们的函数有两个参数：table 和对应的名字。另外，我们还必须记录已经保存过的 table 以防止由于循环而被重复保存。我们使用一个额外的 table 来记录保存过的表的轨迹，这个表的下表索引为 table ，而值为对应的表名。<br>
　　我们做一个限制：要保存的 table 只有一个字符串或者数字关键字。下面的这个函数序列化基本类型并返回结果。
``` lua
function  basicSerialize (o) 
  if type(o) == "number"  then 
   return tostring(o) 
  else   -- assume it is a string 
   return string.format( "%q", o) 
  end
end
```
　　关键内容在接下来的这个函数， saved 这个参数是上面提到的记录已经保存的表的踪迹的 table 。
``` lua
function  save (name, value, saved) 
  saved = saved or {}      -- initial value 
  io.write(name, " = " ) 
  if type(value) == "number"  or type(value) == "string"  then 
      io.write(basicSerialize(value), "\n") 
  elseif type(value) == "table" then 
      if saved[value] then   -- value already saved? 
        -- use its previous name 
        io.write(saved[value], "\n") 
      else 
        saved[value] = name -- save name for next time 
        io.write("{}\n")   -- create a new table 
        for  k,v  in pairs(value) do  -- save its fields 
           local  fieldname = string.format( "%s[%s]" , name, 
           basicSerialize(k)) 
           save(fieldname, v, saved) 
        end 
      end 
  else
      error("cannot save a " .. type(value)) 
  end 
end
```
　　举个例子，我们将要保存的 table 为：
``` lua
a = {x=1, y=2; {3,4,5}} 
a[2] = a    -- cycle 
a.z = a[1]   -- shared sub-table
```
　　调用 save('a', a) 之后结果为：
``` lua
a = {} 
a[1] = {} 
a[1][1] = 3 
a[1][2] = 4 
a[1][3] = 5
a[2] = a 
a["y" ] = 2 
a["x" ] = 1 
a["z" ] = a[1]
```
　　（实际的顺序可能有所变化，它依赖于 table 遍历的顺序，不过，这个算法保证了一个新的定义中需要的前面的节点都已经被定义过） 如果我们想保存带有共享部分的表，我们可以使用同样 table 的 saved 参数调用 save 函数，例如我们创建下面两个表：
``` lua

```
　　保存它们：
``` lua
save( 'a' , a) 
save( 'b' , b)
```
　　结果将分别包含相同部分：
``` lua
a = {} 
a[1] = {} 
a[1][1] =  "one"  
a[1][2] =  "two"  
a[2] = 3 
b = {} 
b["k" ] = {} 
b["k" ][1] = "one"  
b["k" ][2] = "two"  
```
　　然而如果我们使用同一个 saved 表来调用 save 函数：
``` lua
local t = {} 
save( 'a' , a, t) 
save( 'b' , b, t) 
```
　　结果将共享相同部分：
``` lua
a = {} 
a[1] = {} 
a[1][1] =  "one"  
a[1][2] =  "two"  
a[2] = 3 
b = {} 
b["k" ] = a[1]
```
　　上面这种方法是 Lua 中常用的方法，当然也有其他一些方法可以解决问题。比如，我们可以不使用全局变量名来保存（chunk 构造一个 local 值然后返回他）；通过构造一张表，每张表名与其对应的函数对应起来等。Lua 给予你权力，由你决定如何实现。
<br>
## Metatables and Metamethods ##
　　Lua 中的 table 由于定义的行为，我们可以对 key-value 对执行加操作，访问 key 对应的 value，遍历所有的 key-value 。但是我们不可以对两个 table 执行加操作，也不可以比较两个表的大小。<br>
　　Metatables允许我们改变 table 的行为，例如，使用 Metatables 我们可以定义 Lua 如何计算两个 table 的相加操作`a+b`。当 Lua 试图对两个表进行相加时，他会检查两个表是否有一个表有 Metatable ，并且检查 Metatable 是否有`__add`域。如果找到则调用这个`__add`函数（所谓的Metamethod）去计算结果。<br>
　　Lua 中的每一个表都有其 Metatable。（后面我们将看到 userdata 也有Metatable ），Lua默认创建一个不带metatable 的新表：
``` lua
t = {} 
print(getmetatable(t))   --> nil
```
　　可以使用setmetatable函数设置或者改变一个表的 metatable：
``` lua
t1 = {} 
setmetatable(t, t1) 
assert(getmetatable(t) == t1)
```
　　任何一个表都可以是其他一个表的 metatable ，一组相关的表可以共享一个 metatable（描述他们共同的行为）。一个表也可以是自身的 metatable （描述其私有行为）。
<br>
**算术运算的Metamethods**
　　这一部分我们通过一个简单的例子介绍如何使用 metamethods 。假定我们使用table来描述集合，使用函数来描述集合的并操作，交集操作，like 操作。我们在一个表内定义这些函数，然后使用构造函数创建一个集合：
``` lua
Set = {} 
function  Set.new (t) 
  local  set = {} 
  for  _, l in ipairs(t) do set[l] =  true end  
  return set
end 
function  Set.union (a,b) 
  local  res = Set.new{} 
  for  k  in pairs(a)  do res[k] =  true end  
  for  k  in pairs(b)  do res[k] =  true end  
  return res 
end 
function  Set.intersection (a,b) 
  local  res = Set.new{} 
  for  k  in pairs(a)  do 
  res[k] = b[k] 
  end 
  return res 
end
```
　　为了帮助理解程序运行结果，我们也定义了打印函数输出结果：
``` lua
function  Set.tostring (set) 
  local  s =  "{"  
  local  sep = "" 
  for  e  in pairs(set) do 
    s = s .. sep .. e 
  sep = ", " 
  end 
  return s .. "}"  
end 
function  Set.print (s) 
 print(Set.tostring(s)) 
end
```
　　现在我们想加号运算符(+)执行两个集合的并操作，我们将所有集合共享一个 metatable ，并且为这个 metatable 添加如何处理相加操作。<br>
　　第一步，我们定义一个普通的表，用来作为 metatable 。为避免污染命名空间，我们将其放在set内部。
``` lua
Set.mt = {}    -- 定义一个表mt，稍后将用它来作为Set的metatable。
```
　　第二步，修改set.new函数，增加一行，创建表的时候同时指定对应的 metatable 。
``` lua
function  Set.new (t)   -- 2nd version
  local  set = {} 
  setmetatable(set, Set.mt)  --设置Set.mt成为Set的metatable
  for  _, l in ipairs(t) do set[l] =  true end  
  return set
end
```
　　这样一来，set.new创建的所有的集合都有相同的 metatable 了：
``` lua
s1 = Set.new{10, 20, 30, 50}
s2 = Set.new{30, 1}
print(getmetatable(s1))   --> table: 00672B60
print(getmetatable(s2))   --> table: 00672B60
```
　　第三步，给 metatable 增加 __add 函数。
``` lua
Set.mt.__add = Set.union
```
　　当 Lua 试图对两个集合相加时，将调用这个函数，以两个相加的表作为参数。 通过 metamethod，我们可以对两个集合进行相加：
``` lua
s3 = s1 + s2 
Set.print(s3)   --> {1, 10, 20, 30, 50}
```
　　同样的我们可以使用相乘运算符来定义集合的交集操作
``` lua
Set.mt.__mul = Set.intersection 
Set.print((s1 + s2)*s1)    --> {10, 20, 30, 50}
```
　　对于每一个算术运算符，metatable 都有对应的域名与其对应，除了`__add`,`__mul`外，还有`__sub`(减),`__div`(除),`__unm`( 负),`__pow`( 幂)，我们也可以定义`__concat`定义连接行为。<br>
　　当我们对两个表进行加没有问题，但如果两个操作数有不同的metatable 例如：
``` lua
s = Set.new{1,2,3} 
s = s + 8
```
　　Lua 选择 metamethod 的原则：如果第一个参数存在带有`__add`域的metatable ，Lua使用它作为 metamethod ，和第二个参数无关；否则第二个参数存在带有`__add`域的  metatable ，Lua 使用它作为 metamethod，否则报错。<br>
　　Lua 不关心这种混合类型的，如果我们运行上面的 s=s+8 的例子在 Set.union 发生错误：
``` lua
bad argument #1 to `pairs' (table expected, got number)
```
　　如果我们想得到更加清楚地错误信息，我们需要自己显式的检查操作数的类型：
``` lua
function  Set.union (a,b) 
  if getmetatable(a) ~= Set.mt or 
      getmetatable(b) ~= Set.mt then 
  error("attempt to `add' a set with a non-set value" , 2) 
  end 
  ...  -- same as before
```
<br>
## 环境 ##
　　Lua 用一个名为 environment 普通的表来保存所有的你自定义的全局变量。这种结果的优点之一是他简化了 Lua 的内部实现，因为对于所有的全局变量没有必要非要有不同的数据结构。另一个(主要的) 优点是我们可以像其他表一样操作这个保存全局变量的表。为了简化操作，Lua 将环境本身存储在一个全局变量`_G`中，（\_G.\_G 等于\_G）。

<br>　　比如：下面代码打印在当前环境中所有的全局变量的名字。
``` lua
for  n  in pairs(_G) do print(n)  end  
```
<br>
**使用动态名字访问全局变量**
　　Lua程序运行时创建的所有全局变量和全局函数都会被保存在`_G`表中。
　　通常，普通的赋值操作对于访问和修改全局变量已经足够。然而，我们经常需要一些原编程（meta-programming）的方式，比如当我们需要操纵一个名字被存储在另一个变量中的全局变量，或者需要在运行时才能知道的全局变量时，就可能需要\_G的值来访问全局变量。

<br>　　范例1：修改全局变量的值。
``` lua
i = 100
print(i)	-- 100
_G["i"] = 200
print(i)	-- 200
```

    语句解释：
    -  使用local修饰的局部变量是不会被放入_G中的，函数的形参也不会被放入。
    -  环境是一个普通的表，所以你可以使用你需要获取的变量（变量名）索引表即可。
　　也可以用相似的方式对一个全局变量赋值：`_G[varname] = value`。小心：一些程序员对这些函数很兴奋，并且可能写出这样的代码：`_G["a"] = _G["var1"]`，这只是`a = var1`的复杂的写法而已。

<br>　　范例2：直接创建全局变量。
``` lua
_G["i"] = 100
print(i)	-- 100
```
　　在前面章节中使用到的变量table、string、os，以及函数pairs()、type()、tonumber()等，它们都被保存在了`_G`表中，所以可以直接使用。

<br>　　范例3：全局函数。
``` lua
function globalMethod(a)
  print(a)
end
globalMethod(5)
-- 打印出当前内存中所有全局变量和全局函数。
for  n  in pairs(_G) do print(n)  end  
```

    语句解释：
    -  在输出结果中，就可以找到“globalMethod”。
    -  使用local修饰的局部函数并不会被放入到_G表中。

<br>　　范例4：递归创建全局变量。
``` lua
function setValue(tName,value)
  local  t = _G
  for  w, d in string.gfind(tName, "([%w_]+)(.?)") do 
    if d == "."  then  -- 若w不是指的最后一个字段，则意味着它当前表示一个表。
      t[w] = t[w] or {}   -- 若表不存在则创建新表。
      t = t[w]   -- 继续递归
    else      -- w是字段
      t[w] = value   -- 将值赋给它
    end 
  end 
end
-- 创建全局变量。
setValue("a.b.c.d",3)
print(a.b.c.d)
```

    语句解释：
    -  从 _G 开始，一个域一个域的遍历，我们必须记住最后一个名字，必须独立的处理最后一个域。setValue函数当其中的域（注：中间的域肯定是表）不存在的时候还需要创建中间表。
    -  使用 string 库的 gfind函数来迭代 f 中的所有单词（单词指一个或多个子母下划线的序列）。

<br>　　范例5：递归对访问全局变量的值。
``` lua
function  getValue (f) 
  local  v = _G
  for  w  in string.gfind(f, "[%w_]+" ) do 
     v = v[w] 
  end 
  return v 
end
print(getValue("a.b.c.d"))
```
<br>
**声明全局变量**
　　全局变量不需要声明，虽然这对一些小程序来说很方便，但程序很大时，一个简单的拼写错误可能引起 bug 并且很难发现。然而，我们可以改变这种行为。

<br>　　范例1：修改\_G表的metatables。
``` lua
setmetatable(_G, { 
   __newindex = function  (_, n) 
    error("attempt to write to undeclared variable " ..n, 2) 
   end , 
   __index = function  (_, n) 
    error("attempt to read undeclared variable " ..n, 2) 
   end , 
})
```
　　这样一来，任何企图访问一个不存在的全局变量的操作都会引起错误。

<br>　　范例2：绕过metamethod创建变量。
``` lua
A = {}
setmetatable(A, { 
  __newindex = function() 
    print("__newindex")
  end , 
  __index = function() 
    print("__index") 
  end , 
}) 
function  declare (name, initval) 
  rawset(A, name, initval or false ) 
end 

declare("a",500)
print(A.a)	-- 500
```

    语句解释：
    -  程序运行时，并不会打印出“__newindex”或者“__index”。
    -  使用rawset(表，变量名，默认值) 函数可以绕过metamethod创建变量。
    -  “initval or false”是为了保证新的变量不会为 nil 。
    -  创建全局变量的方法是一样的，将表名“A”改为“_G”即可。
    -  使用rawget(表,变量名)函数可以绕过metamethod访问变量。
<br>
## 面向对象程序设计 ##
　　本节将介绍如果在Lua中实现面向对象。
### 类 ###
　　一些面向对象的语言中提供了类的概念，类作为创建对象的模板。在这些语言里，对象是类的实例。
　　虽然在Lua中并不存在类的概念，但Lua通过表来仿效类的概念并不难。

<br>　　范例1：Account类。
``` lua
Account = {} 
Account. balance = 0
function  Account.withdraw (v) 
  Account.balance = Account.balance - v 
end
```

    语句解释：
    -  本范例定义一个名为Account的表，但我们可以把它视为一个类（也要驼峰式命名）。
    -  在Account类中定义了balance域并创建了一个新的函数，并且保存在 Account对象的 withdraw 域内，下面我们可以这样调用：Account.withdraw(100.00)。
　　然而，在一个函数内部使用全局变量名Account是一个不好的习惯。如果我们改变了这个变量的名字，函数 withdraw 将不能工作。

<br>　　范例2：修改变量名。
``` lua
a = Account
Account =  nil  
a.withdraw(100.00)  -- ERROR!
```

    语句解释：
    -  这种行为违背了对象应该有独立的生命周期的原则。 
　　一个灵活的方法是：定义方法的时候带上一个额外的参数，来表示方法作用的对象。这个参数经常为 self 或者 this。

<br>　　范例3：修改变量名。
``` lua
function  Account.withdraw (self, v) 
  self.balance = self.balance - v 
end
```
　　现在，当我们调用这个方法的时候不需要指定他操作的对象了：
``` lua
a1 = Account; Account = nil  
... 
a1.withdraw(a1, 100.00)    -- OK
```
　　使用self 参数定义函数后，我们可以将这个函数用于多个对象上：
``` lua
a2 = {balance=0, withdraw = Account.withdraw}
... 
a2.withdraw(a2, 260.00)
```
　　self 参数的使用是很多面向对象语言的要点。大多数 OO 语言将这种机制隐藏起来，这样程序员不必声明这个参数（虽然仍然可以在方法内使用这个参数）。Lua 也提供了通过使用冒号操作符来隐藏这个参数的声明。我们可以重写上面的代码：
``` lua
function  Account:withdraw (v) 
  self.balance = self.balance - v 
end
```
　　调用方法如下：
``` lua
a:withdraw(100.00)
```
　　冒号的效果相当于在函数定义和函数调用的时候，增加一个额外的隐藏参数。这种方式只是提供了一种方便的语法，实际上并没有什么新的内容。我们可以使用 dot 语法定义函数而用冒号语法调用函数，反之亦然，只要我们正确的处理好额外的参数：
``` lua
Account = { 
 balance=0, 
 withdraw = function (self, v) 
    self.balance = self.balance - v
  end 
} 
 
function  Account:deposit (v) 
  self.balance = self.balance + v 
end 
 
Account.deposit(Account, 200.00) 
Account:withdraw(100.00)
```
<br>
**实例化**
　　现在我们的Account类拥有一个状态和操作这个状态的方法，但依然存在一个问题：怎样才能创建多个accounts呢？
　　在Lua 中，使用前面章节我们介绍过的继承的思想，很容易实现属性的继承。

<br>　　范例1：继承的实现。
``` lua
setmetatable(a, {__index = b})
```

    语句解释：
    -  假设我们有两个对象 a 和 b 。 执行上面的代码后，对象 a 调用任何不存在的成员(属性和方法)都会到对象 b 中查找。
    -  此时，在术语上，可以将b看作类，a 看作b的对象。
　　回到前面银行账号的例子上，为了使得新创建的对象拥有和Account相似的行为，我们使用`__index metamethod`，使新的对象继承 Account。

<br>　　范例2：完整的实例化。
``` lua
function  Account:new (o) 
  o = o or {}  -- 若没有传递参数o，则创建一个空表。
  setmetatable(o, self)  -- 设置表o的metatable为Account 。
  self.__index = self
  return o 
end
-- 创建对象
a = Account:new{balance = 0} 
a:deposit(100.00)
```

    语句解释：
    -  注意一个小的优化：我们不需要创建一个额外的表作为新对象的metatable，而是可以直接用 Account表本身作为metatable。
    -  当我们创建这个新的账号a的时候，a将Account 作为他的metatable。
    -  当我们调用 a:deposit(100.00)，我们实际上调用的是a.deposit(a,100.00)（冒号仅仅是语法上的便利）。然而，Lua在表a中找不到deposit，因此他回到metatable的__index对应的表中查找。
    -  整个过程相当于： getmetatable(a).__index.deposit(a, 100.00)，等价于：Account.deposit(a, 100.00)。
    -  即此时可以说，对象a从Account继承了deposit 方法。
　　使用同样的机制，可以从 Account 继承所有的域。继承机制不仅对方法有效，对表中所有的域都有效。所以，一个类不仅提供方法，也提供了他的实例的成员的默认值。	记住：在我们第一个Account定义中，我们提供了成员balance默认值为0 ，所以，如果我们创建一个新的账号而没有提供 balance的初始值，它将继承默认值。

<br>　　范例3：新建另一个对象。
``` lua
b = Account:new() 
print(b.balance)   --> 0
```

    语句解释：
    -  当我们调用 b 的 deposit 方法时，实际等价于：
    -  b.balance = b.balance + v
<br>
### 继承 ###
　　通常面向对象语言中，继承使得类可以访问其他类的方法，这在 Lua 中也很容易现实。

<br>　　范例1：Account类。
``` lua
Account = {balance = 0} 
 
function  Account:new (o) 
  o = o  or {} 
  setmetatable(o, self) 
  self.__index = self 
  return o 
end 
 
function  Account:deposit (v) 
  self.balance = self.balance + v 
end 
 
function  Account:withdraw (v) 
  if v > self.balance  then error"insufficient funds"  end  
  self.balance = self.balance - v 
end
```
　　我们打算从基类派生出一个子类SpecialAccount，这个子类允许客户取款超过它的存款余额限制，我们从一个空类开始，从基类继承所有操作：
``` lua
SpecialAccount = Account:new()
```
　　到现在为止，SpecialAccount 仅仅是Account的一个实例。现在奇妙的事情发生了：
``` lua
s = SpecialAccount:new{limit=1000.00}
```
　　SpecialAccount 从Account 继承了new 方法，当new 执行的时候，self 参数指向SpecialAccount。所以，s 的metatable 是SpecialAccount，__index  也是SpecialAccount。这样，s 继承了SpecialAccount，后者继承了 Account。当我们执行：
``` lua
s:deposit(100.00)
```
　　Lua 在s 中找不到 deposit 域，他会到SpecialAccount 中查找，在SpecialAccount 中找不到，会到Account中查找。使得SpecialAccount 特殊之处在于，它可以重定义从父类中继承来的方法：
``` lua
function  SpecialAccount:withdraw (v) 
  if v - self.balance >= self:getLimit() then 
    error "insufficient funds"  
  end 
  self.balance = self.balance - v 
end 
 
function  SpecialAccount:getLimit () 
  return self.limit or 0 
end
```
　　现在，当我们调用方法s:withdraw(200.00) ，Lua 不会到Account中查找，因为它第一次救在SpecialAccount 中发现了新的withdraw 方法，由于s.limit 等于1000.00，程序执行了取款操作，s 的balance变成了负值。<br>
　　在Lua 中面向对象有趣的一个方面是你不需要创建一个新类去指定一个新的行为。如果仅仅一个对象需要特殊的行为，你可以直接在对象中实现，例如，如果账号s 表示一些特殊的客户：取款限制是他的存款的10% ，你只需要修改这个单独的账号：
``` lua
function  s:getLimit () 
  return self.balance * 0.10 
end
```
　　这样声明之后，调用 s:withdraw(200.00) 将运行SpecialAccount 的withdraw 方法，但是当方法调用self:getLimit 时，最后的定义被触发。
　　注意：没有使用“类:名称”的函数，需要在主调函数之前定义。
<br>
### 私有性（privacy） ###
　　很多人认为私有性是面向对象语言的应有的一部分。每个对象的状态应该是这个对象自己的事情。在一些面向对象的语言中，比如C++ 和Java 你可以控制对象成员变量或者成员方法是否私有。其他一些语言比如 Smalltalk 中，所有的成员变量都是私有，所有的成员方法都是公有的。第一个面向对象语言Simula 不提供任何保护成员机制。<br> 
　　如前面我们所看到的Lua 中的主要对象设计不提供私有性访问机制。部分原因因为这是我们使用通用数据结构tables 来表示对象的结果。但是这也反映了后来的Lua 的设计思想。Lua 没有打算被用来进行大型的程序设计，相反，Lua 目标定于小型到中型的程序设计，通常是作为大型系统的一部分。典型的，被一个或者很少几个程序员开发，甚至被非程序员使用。所以，Lua 避免太冗余和太多的人为限制。如果你不想访问一个对象内的一些东西就不要访问（If you do not want to access something inside an object, just do not do it. ）。<br>
　　虽然 Lua 中基本的面向对象设计并不提供私有性访问的机制，我们可以用不同的方式来实现他。虽然这种实现并不常用，但知道他也是有益的，不仅因为它展示了Lua 的一些有趣的角落，也因为它可能是某些问题的很好地解决方案。设计的基本思想是，每个对象用两个表来表示：一个描述状态；另一个描述操作（或者叫接口）。对象本身通过第二个表来访问，也就是说，通过接口来访问对象。为了避免未授权的访问，表示状态的表中不涉及到操作；表示操作的表也不涉及到状态，取而代之的是，状态被保存在方法的闭包内。例如，用这种设计表述我们的银行账号，我们使用下面的函数工厂创建新的对象：
``` lua
function  newAccount (initialBalance) 
  local  self = {balance = initialBalance} 
  local  withdraw = function  (v) 
    self.balance = self.balance - v 
  end 
local  deposit = function  (v) 
    self.balance = self.balance + v 
  end 
local  getBalance = function  () return self.balance end  
return {
  withdraw = withdraw, 
  deposit = deposit, 
  getBalance = getBalance 
 } 
end
```
<br>
### Single-Method的对象 ###
　　前面的 OO 程序设计的方法有一种特殊情况：对象只有一个单一的方法。这种情况下，我们不需要创建一个表，取而代之的是，我们将这个单一的方法作为对象返回。
　　关于 single-method 的对象一个有趣的情况是：当这个 single-method 实际是一个基于重要的参数而执行不同的任务的分派（dispatch）方法时。针对这种对象：
``` lua
function newObject (value) 
  return function (action, v) 
   if action == "get" then return value 
   elseif action == "set" then value = v 
   else error("invalid action") 
   end 
  end 
end
```
　　使用起来很简单：
``` lua
d = newObject(0) 
print(d("get"))   --> 0 
d("set", 10) 
print(d("get"))   --> 10
```
　　这种非传统的对象实现是非常有效的，语法 d("set",10)虽然很罕见，但也只不过比传统的 d:set(10)长两个字符而已。每一个对象是用一个单独的闭包，代价比起表来小的多。这种方式没有继承但有私有性：访问对象状态的唯一方式是通过它的内部方法。 Tcl /Tk  的窗口部件（widgets）使用了相似的方法，在 Tk 中一个窗口部件的名字表示一个在窗口部件上执行各种可能操作的函数（a widget command）。
<br>