---
layout: post
title: "第二章 Lua 程序设计"
date: 2014-09-03 22:07:06 +0800
comments: true
categories: quick-cocos2d-x
---
　　本章主要参考《Programming in Lua》中文版一书，并添加了书中未写到的细节知识。<br>
# 第一节 概述 #
　　目前很多程序语言都专注于帮你编写成千上万行的代码，所以此类型的语言所提供的包、命名空间、复杂的类型系统及无数的结构，有上千页的文档需要操作者学习。 而 Lua 并不帮你编写大量的代码的程序，相反的，Lua 仅让你用少量的代码解决关键问题。为实现这个目标，像其他语言一样 Lua 依赖于其可扩展性。但是与其他语言不同的是，不仅用 Lua 编写的软件易于扩展，而且用其他语言比如 C/C++编写的软件也很容易使用 Lua 扩展其功能。<br>
　　一开始，Lua 就被设计成很容易和传统的 C/C++整合的语言。这种语言的二元性带来了极大的好处。Lua 是一个小巧而简单的语言，因为 Lua不致力于做 C 语言已经做得很好的领域，比如：性能、底层操作以及与第三方软件的接口。Lua 依赖于 C 去做完成这些任务。Lua 所提供的机制是 C 不善于的：高级语言、动态结构、简洁、易于测试和调试等。正因为如此，Lua 具有良好的安全保证，自动内存管理，简便的字符串处理功能及其他动态数据的改变。<br><br>
　　**何为“脚本语言”**<br>

    首先我们来看看“脚本”这个概念是如何产生的。使用Unix系统的人都会敲入一些命令，而命令貌似都是“一次性”或者“可抛
    弃”的。然而不久，人们就发现这些命令其实并不是那么的“一次性”，自己其实一直在重复的敲入类似的命令，所以有人就发
    明了“脚本”这东西。它的设计初衷是“批量式”的执行命令，你在一个文件里把命令都写进去，然后执行这个文件。可是不久
    人们就发现，这些命令行其实可以用更加聪明的方法构造，比如定义一些变量，或者根据系统类型的不同执行不同的命令。
    于是，人们为这脚本语言加入了变量，条件语句，数组，等等构造。“脚本语言”就这样产生了。
    　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　———— 摘自王垠《什么是“脚本语言”》
<br>
　　**Lua独有的特点**<br>
　　除了 Lua 外，还有很多类似的脚本语言，例如：Perl、Tcl、Ruby、Forth、Python虽然其他语言在某些方面与 Lua 有着共同的特色，但下面这些特征是 Lua 特有的：

- 可扩展性。Lua 的扩展性非常卓越，以至于很多人把 Lua 用作搭建领域语言的工具（注：比如游戏脚本）。Lua 被设计为易于扩展的，可以通过 Lua 代码或者C代码扩展， Lua的很多功能都是通过外部库来扩展的。 Lua很容易与C/C++、 java、fortran、Smalltalk、Ada，以及其他语言接口。
- 简单。Lua 本身简单，小巧；内容少但功能强大，这使得 Lua易于学习，很容易实现一些小的应用。他的完全发布版（代码、手册以及某些平台的二进制文件），仅用一张软盘就可以装得下。
- 高效率。Lua 有很高的执行效率，统计表明 Lua是目前平均效率最高的脚本语言。
- 与平台无关。Lua 几乎可以运行在所有我们听说过的系统上，如 NextStep、OS/2、PlayStation II (Sony)、Mac OS-9、OS X、BeOS、MS-DOS、IBM mainframes、EPOC、PalmOS、MCF5206eLITE Evaluation Board、RISC OS，及所有的 Windows 和 Unix。Lua 不是通过使用条件编译实现平台无关，而是完全使用 ANSI (ISO) C，这意味着只要你有 ANSI C 编译器你就可以编译并使用 Lua。<br><br>
　　**Lua类库**<br>
　　Lua 大部分强大的功能来自于他的类库，这并非偶然。Lua 的长处之一就是可以通过新类型和函数来扩展其功能。动态类型检查最大限度允许多态出现，并自动简化调用内存管理的接口，因为这样不需要关心谁来分配内存谁来释放内存，也不必担心数据溢出。高级函数和匿名函数均可以接受高级参数，使函数更为通用。 <br>
　　Lua 自带一个小规模的类库。在受限系统中使用 Lua，如嵌入式系统，我们可以有选择地安装这些类库。若运行环境十分严格，我们甚至可以直接修改类库源代码，仅保留需要的函数。记住：Lua 是很小的（即使加上全部的标准库）并且在大部分系统下你仍可以不用担心的使用全部的功能。<br>
　　如果你真得想学一门语言，参考手册是必备的。本文和 Lua 参考手册互为补充，手册仅仅描述语言本身，因此他既不会告诉你语言的数据结构也不会举例说明。你可以从 http://www.lua.org 可以得到权威性的手册的内容。<br><br>
　　**环境搭建**<br>
　　首先下载Lua编译器，用来编译lua代码。下载地址：http://code.google.com/p/luaforwindows/downloads/list。<br>
　　安装完毕后将Lua的安装路径配置到Path环境变量中，如：“;D:\Program Files\Lua\5.1”这样就可以在cmd中通过“lua”命令来启动lua编译工具了。<br>
<br>**本节参考阅读：**<br>
http://www.yinwang.org/blog-cn/2013/03/29/scripting-language/<br>
http://www.zhihu.com/question/20898488<br>
http://www.ibm.com/developerworks/cn/linux/l-lua.html <br><br>
# 第二节 基础知识 #
## 起点 ##
　　范例1：hello world。
``` lua
print("Hello World")
```

    语句解释：
    - 创建a.lua文件，并输入本范例中的代码并保存，在cmd中通过执行“lua a.lua”即可运行程序。
    - 注意：直接在Windows右键建立一个txt文件可能会有中文编码问题，可以通过专业的文本编辑软件创建，如EditPlus。
<br>
　　**Chunks**<br>
　　Chunk 和 Java 中的代码块类似，它小到可以仅包含一行代码，大到可以是一系列语句的组合，还可以是函数，在 Lua 中几个 MByte的Chunk 是很常见的。交互模式下的每一行都是一个 Chunk。<br>
　　每个语句结尾的分号（；）是可选的，通常不需要写，但如果同一行有多个语句最好用“；”分开，比如下面的写法是不推荐的，虽然它的语法是正确的：
``` lua
a = 1   b = a*2
```

    语句解释：
    - Lua和js一样，它们的变量是不需要指定数据类型的，你可以随便给变量a赋值数字、字符串、boolean类型的值。
    - Lua代码保存的文件名后缀为.lua 。 
<br>
　　**交互模式**<br>
　　直接在cmd命令行中执行“lua”命令即可进入到 **交互模式** 中。在交互模式下，Lua 通常把每一个行当作一个Chunk，但如果一行不是一个完整的Chunk时，它会等待继续输入直到得到一个完整的Chunk。在Lua等待续行时，显示不同的提示符（一般是>>）。<br>
　　范例1：进入交互模式。
``` 
E:\luademo>lua
Lua 5.1.4  Copyright (C) 1994-2008 Lua.org, PUC-Rio
> print("Hello World!!!!")
Hello World!!!!
```

    语句解释：
    - Lua语言是即时编译的，因此可以在交互模式中实现“一边编写，一边运行”。
<br>
　　可以通过指定参数让Lua执行一系列Chunk。例如：假定一个a.lua内有单个语句x=1；另一个b.lua中有语句 print(x)，然后执行下面语句：
```
lua -la -lb
```
　　命令首先在一个 Chunk 内先运行 a 然后运行 b 。（注意：-l 选项会调用 require函数，它会在指定的目录下搜索文件，如果环境变量没有设好，上面的命令可能不能正确运行。 具体后述。<br><br>

　　范例2：另一个连接外部 Chunk 的方式是使用 dofile 函数，dofile 函数加载文件并执行它。假设有一个文件lib1.lua：
``` lua
function add (x, y) 
  return x + y 
end
```
　　然后在交互模式下执行：
``` lua
E:\luademo>lua
dofile("lib1.lua")
print(add (3,5))		--程序输出：8
```
　　- 提示：使用function关键字来定一个函数，关于函数将在后面具体介绍。
<br><br>
　　**全局变量**<br>
　　全局变量不需要声明，给一个变量赋值后即创建了这个全局变量，访问一个没有初始化的全局变量也不会出错，只不过得到的结果是：nil。
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
<br><br>
　　**词法约定**<br>
　　标识符：以字母(letter)或者下划线开头的字母、下划线、数字序列。最好不要使用下划线加大写字母的标示符，因为 Lua的系统变量也是这样的。Lua 中，letter的含义是依赖于本地环境的。<br>
　　保留字：以下字符为 Lua 的保留字，不能当作标识符。
``` lua
and     break   do     else   elseif 
end     false   for     function  if 
in     local   nil     not     or 
repeat   return   then   true   until 
while
```
　　注意：Lua 是大小写敏感的。
<br><br>
　　**注释**<br>
　　单行注释：- - <br>
　　多行注释：- -[[ 此处为需要注释掉的内容 - -]]<br>
``` lua
local a = 10
--[[ 
print(a)      -- no action (comment) 
--]]
```
<br>
## 类型和值 ##
　　Lua 是动态类型语言，变量不需要类型定义。<br>
　　Lua 中有8个基本类型分别为：nil、boolean、number、string、userdata、function 、thread 和table 。
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
　　注意上面最后两行，我们可以使用function 像使用其他值一样使用（后面会有更多的介绍）。一般情况下同一变量代表不同类型的值会造成混乱，最好不要用，但是特殊情况下可以带来便利，比如nil。
<br><br>
　　**Nil**<br>
　　Lua 中特殊的类型，它只有一个值：nil；一个全局变量没有被赋值以前默认值为 nil；给全局变量负nil可以删除该变量。<br>
<br>
　　**Booleans**<br>
　　两个取值 false 和 true 。但要注意 Lua 中所有的值都可以作为条件。在控制结构的条件中除了 false 和 nil 为假，其他值都为真。所以 Lua 认为 0 和空串都是真。<br>
<br>
　　**Numbers**<br>
　　表示实数，Lua 中没有整数。一般有个错误的看法 CPU 运算浮点数比整数慢。事实不是如此，用实数代替整数不会有什么误差（除非数字大于100,000,000,000,000）。Lua的numbers 可以处理任何长整数不用担心误差。你也可以在编译Lua 的时候使用长整型或者单精度浮点型代替numbers，在一些平台硬件不支持浮点数的情况下这个特性是非常有用的，具体的情况请参考 Lua 发布版所附的详细说明。和其他语言类似，数字常量的小数部分和指数部分都是可选的，数字常量的例子：
``` lua
4   0.4  4.57e-3  0.3e12  5e+20
```
<br>
　　**strings**<br>
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
　　范例1：转义字符。
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
　　还可以在字符串中使用\ddd （ddd 为三位十进制数字）方式表示字母。如"alo\n123\""和'\97lo\10\04923"' 是相同的。<br><br>
　　还可以使用[[...]]表示字符串。这种形式的字符串可以包含多行，如果第一个字符是换行符会被自动忽略掉。这种形式的字符串用来包含一段代码是非常方便的。<br>
　　范例2：多行字符串。
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
　　有时多行字符串中可能包含有"]]"，这是可以在两个左方括号之间加上任意数量的等号，比如"[===["，这样字面字符串只有在遇到内嵌有相同数量等号的双右方括号时才会结束。<br><br>
　　运行时，Lua 会自动在string 和numbers 之间自动进行类型转换，当对一个字符串使用算术操作符时，string 就会被转成数字。
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
　　“**..**”在Lua 中是字符串连接符，当在一个数字后面写“**..**”时，必须加上空格以防止被解释错，在前面写则没事。
``` lua
print(25 ..3)
```
　　尽管字符串和数字可以自动转换，但两者是不同的，像10 == "10" 这样的比较永远都是false的。如果需要显式将 string 转成数字可以使用函数 tonumber() ，如果 string 不是正确的数字该函数将返回nil。
``` lua
line = io.read()      -- read a line 
n = tonumber(line)    -- try to convert it to a number 
if n == nil  then 
 error(line .. " is not a valid number") 
else 
 print(n*2) 
end
```
　　反之, 可以调用tostring() 将数字转成字符串，这种转换一直有效：
``` lua
print(tostring(10) == "10")   --> true 
print(10 .. "" == "10")     --> true
```
　　字符串进行“==”运算时，比较的是字符串的内容。<br>
<br>
　　**Functions**<br>
　　函数是第一类值（和其他变量相同），意味着函数可以存储在变量中，可以作为函数的参数，也可以作为函数的返回值。这个特性给了语言很大的灵活性：一个程序可以重新定义函数增加新的功能或者为了避免运行不可靠代码创建安全运行环境而隐藏函数，此外这特性在Lua 实现面向对象中也起了重要作用（在后面详细讲述）。<br>
　　可以调用 lua 或者C 实现的函数，Lua 所有标准库都是用 C 实现的。标准库包括string 库、table 库、I/O 库、OS库、算术库、debug 库。<br>
<br>
　　**Userdata and Threads**<br>
　　userdata 可以将 C 数据存放在 Lua 变量中，userdata 在Lua 中除了赋值和相等比较外没有预定义的操作。userdata 用来描述应用程序或者使用 C 实现的库创建的新类型。例如：用标准I/O 库来描述文件。下面在C API 章节中我们将详细讨论。<br>
<br>
## 表达式 ##
　　Lua 中的表达式包括数字常量、字符串常量、变量、一元和二元运算符、函数调用。还可以是非传统的函数定义和表构造。<br>
<br>
　　**算术运算符**<br>

    二元运算符：+ - * / ^ %    (加，减，乘，除，幂，余数)  
    一元运算符：-  ( 负值)  
　　这些运算符的操作数都是实数。<br>
<br>
　　**关系运算符**<br>

    <  >  <=  >=  ==  ~=
　　这些操作符返回结果为false 或者true ；==和~=比较两个值是否相等和不等，如果两个值类型不同，Lua 认为两者不同；nil只和自己相等。Lua 通过引用比较 tables 、userdata、functions 。也就是说当且仅当两者表示同一个对象时相等。
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
　　为了避免不一致的结果，使用> 、<等运算符混合比较数字和字符串，Lua 会报错，比如：2 < "15"。<br>
<br>
　　**逻辑运算符**<br>

    and  or  not
　　逻辑运算符认为false 和nil是假（false ），其他为真，0 也是true，and 和or 的运算结果不是 true 和false ，而是和它的两个操作数相关。<br><br>
　　范例1：and运算符。<br>
　　运算规则：参与and运算的两个操作数：

    - 若左边为false，则返回左边的操作数，否则返回右边的操作数。
    - 若两边同时为true，则返回右侧的操作数。
    - 若两边同时为false，则返回左侧的操作数。

　　和Java等其它语言中的“简洁与”运算是一样的，and 始终返回为第一个找到的false的操作数，或者最后一个找到的true的操作数。<br>
　　比如：
``` lua
print(4  and  5)    --> 5
print(5  and  4)    --> 4
print(nil  and  13)     --> nil
print(false  and  13)    --> false
print(false  and  nil)    --> false
```
<br>
　　范例2-1：or运算符。<br>
　　运算规则：参与or运算的两个操作数：

    - 若左边为true，则返回左边的操作数，否则返回右边的操作数。
    - 若两边同时为true，则返回左侧的操作数。
    - 若两边同时为false，则返回右侧的操作数。

　　和Java等其它语言中的“简洁或”运算是一样的，始终返回为第一个找到的true的操作数，或者最后一个找到的false的操作数。<br>
　　比如：
``` lua
print(4 or 5)       --> 4
print(5 or 4)       --> 5 
print(false or 5)    --> 5
print(false or nil)    --> nil
print(nil or false)    --> false  
```
　　范例2-2：一个很实用的技巧：如果 x 为 false 或者 nil 则给 x 赋初始值 v 。
``` lua
x = x or v
```
　　这等价于：
``` lua
if not  x  then 
  x = v 
end
```
　　范例2-3：C 语言中的三元运算符：“a? b : c”，在Lua 中的实现。
``` lua
(a  and  b) or c
```
<br>
　　范例3：not 运算符。<br>
　　运算规则：not 的结果一直返回 false 或者true。<br>
　　比如：
``` lua
print(not  nil )    --> true 
print(not  false )     --> true 
print(not  0)     --> false 
print(not  not  nil )   --> false
```
<br>
　　**连接运算符**<br>
　　“**..**” 两个点。用于字符串连接，如果操作数为数字，Lua 将数字转成字符串。
``` lua
print("Hello "  .. "World")   --> Hello World 
print(0 .. 1)       --> 01
```
<br>
　　**运算符优先级**<br>
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
　　Lua 像 C 和 PASCAL 一样，几乎支持所有的传统语句：赋值语句、控制结构语句、函数调用等，同时也支持非传统的多变量赋值、局部变量声明。<br>
<br>
　　**赋值语句**<br>
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
<br>
　　当变量个数和值的个数不一致时，Lua 会一直以变量个数为基础采取以下策略：

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
　　**局部变量与代码块**<br>
　　使用 local 创建一个局部变量，与全局变量不同，局部变量只在被声明的那个代码块内有效。不用local关键字声明的变量即便是在代码块中声明，它也是全局变量。<br>
　　代码块：指一个控制结构内，一个函数体，或者一个 chunk （变量被声明的那个文件或者文本串）。<br>
　　范例1：全局变量。
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
　　范例2：局部变量。
``` lua
function say()
  local s = "Hello World"
end
say();
print(s)
```

    语句解释：
    - 此时print()函数则引用不到s的值，只能输出一个nil。
　　范例3：本地变量和全局变量重名。
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
    - 同其他变成语言一样，局部变量的作用域内，全局变量会被隐藏掉。
    - 程序输出：
     Hello World
     A
<br>
　　应该尽可能的使用局部变量，有两个好处： <br>
　　1. 避免命名冲突。<br>
　　2. 访问局部变量的速度比全局变量更快。<br>
　　我们给block划定一个明确的界限：do..end 内的部分。当你想更好的控制局部变量的作用范围的时候这是很有用的。
<br><br>
　　范例4：自定义代码快。
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
　　**控制结构语句**<br>
　　控制结构的条件表达式结果可以是任何值，Lua 认为false 和nil为假，其他值为真。
<br>
　　范例1：if 语句。if 语句，有三种形式：
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
　　范例2：while 语句。
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
　　范例3：repeat-until 语句。
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
　　**for 语句**<br>
　　for 语句也属于控制结构语句，由于篇幅较长所以单列为一个部分。for 语句有两大类：<br>
　　•　数值 for 循环。<br>
　　•　范型 for 循环。<br>
<br>
　　范例1-1：数值 for 循环。
``` lua
for  var=exp1,exp2,exp3  do 
 loop-part 
end
```

    语句解释：
    - for 将用exp3 作为step ，然后从exp1 （初始值）到 exp2 （终止值），执行loop-part 。
    - 其中exp3 可以省略，默认 step=1。

　　范例1-2：应用。
``` lua
for i=4,10,2 do
  print(i)
end
```

    语句解释：
    - 每次循环叠加2，如果想递减则可以将第三个参数设置为负数。<br>
<br>
　　关于数值 for 语句有几点需要注意： <br>
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
