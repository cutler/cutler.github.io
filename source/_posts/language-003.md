---
title: 语言篇 第三章 Windows批处理
date: 2015-1-9 15:21:49
author: Cutler
categories: 计算机基础
---
　　本章介绍一下`Windows`中常用的批处理命令，在日后的开发中不免会使用到它，比如`Android`的多渠道打包。

# 第一节 概述 #
　　批处理（Batch）通常被认为是一种简化的`脚本语言`，它应用于`DOS`和`Windows`系统中，它是由`DOS`或者`Windows`系统内嵌的直译器（通常是`COMMAND.COM`或者`CMD.EXE`）解释运行。它类似于`Unix`中的`Shell`脚本。


<br>**何为“脚本语言”**

    　　首先我们来看看“脚本”这个概念是如何产生的。使用Unix系统的人都会敲入一些命令，而命令貌似都是“一次性”或者“可抛弃”的。然而不久，人们就发现这些命令其实并不是那么的“一次性”，自己其实一直在重复的敲入类似的命令，所以有人就发明了“脚本”这东西。它的设计初衷是“批量式”的执行命令，你在一个文件里把命令都写进去，然后执行这个文件。可是不久人们就发现，这些命令行其实可以用更加聪明的方法构造，比如定义一些变量，或者根据系统类型的不同执行不同的命令。于是，人们为这脚本语言加入了变量，条件语句，数组等构造。“脚本语言”就这样产生了。
　　以上摘自王垠《[什么是“脚本语言”](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language/)》， 批处理 就是一种脚本语言。

<br>**目前有哪些批处理？**

　　目前比较常见的批处理包含两类：`DOS批处理`和`PS批处理`。

    -  PS批处理是基于强大的图片编辑软件Photoshop的，用来批量处理图片的脚本。
    -  DOS批处理则是基于DOS命令的，用来自动地批量地执行DOS命令以实现特定操作的脚本。

　　我们本章将要讲解的就是`DOS`批处理。

<br>**批处理文件及其特点**
　　批处理文件是扩展名为`.bat`或`.cmd`的文本文件，包含一条或多条命令，由`DOS`或`Windows`系统内嵌的命令解释器来解释运行。
　　批处理文件是无格式的文本文件。在命令提示下键入批处理文件的名称，或者双击该批处理文件，系统就会调用`cmd.exe`按照该文件中各个命令出现的顺序来逐个运行它们。使用批处理文件（也被称为批处理程序或脚本），可以简化日常或重复性任务。

　　批处理文件的本质是，`一堆DOS命令按一定顺序排列而形成的集合`。

　　批处理文件特点有：

    -  每一行可视为一个命令，每个命令里可以含多条子命令。
    -  从文件的第一行开始执行，直到最后一行结束。
    -  支持if、for、goto等命令控制程式的运行过程。  
    -  批处理程序虽然是在命令行环境中运行，但不仅仅能使用命令行软件，任何当前系统下可运行的程序都可以放在批处理文件中运行。

<br>
**本节参考阅读：**
- [什么是“脚本语言”](http://www.yinwang.org/blog-cn/2013/03/29/scripting-language/)
- [维基百科 - 批处理](http://zh.wikipedia.org/zh/%E6%89%B9%E5%A4%84%E7%90%86)
- [百度百科 - 批处理](http://baike.baidu.com/view/80110.htm)
- [百度百科 - 批处理文件](http://baike.baidu.com/view/295769.htm)

# 第二节 批处理命令 #
　　本节将详细介绍各种常用批处理命令。

　　首先，按下键盘上的`Win+R`键（Win键在`Ctrl`和`Alt`旁边，微软标志），打开运行对话框，在里面输入`cmd`后，按下回车键。

<br>　　范例1：Hello World。
``` batch
echo Hello World
```
    语句解释：
    -  echo命令有两个作用：
       -  显示一行消息。
       -  打开回显或关闭请求回显功能。
    -  如果没有任何参数echo命令将显示当前回显设置。

## 目录命令 ##

<br>　　范例1：盘符切换。
``` batch
Microsoft Windows [版本 6.1.7601]
版权所有 (c) 2009 Microsoft Corporation。保留所有权利。

C:\Users\cutler>D:

D:\>D:
```
    语句解释：
    -  直接在命令行中输入磁盘的名称即可进行切换。

<br>　　范例2：查看目录里的文件。
``` batch
D:\>dir
 驱动器 D 中的卷没有标签。
 卷的序列号是 4410-5037

 D:\ 的目录

2014/12/11  14:45    <DIR>          360Downloads
2015/01/04  11:59    <DIR>          360安全浏览器下载
2015/01/09  13:04                 6 a.txt
2014/12/03  13:19    <DIR>          cuihu
2014/06/07  19:24    <DIR>          MyDrivers
2014/12/08  13:38    <DIR>          Program Files
2014/12/08  18:10    <DIR>          Program Files (x86)
2014/11/11  10:55    <DIR>          QMDownload
2015/01/09  11:17    <DIR>          test
2015/01/04  12:50    <DIR>          workspace
               1 个文件              6 字节
               9 个目录 47,979,810,816 可用字节

D:\>
```
    语句解释：
    -  使用dir命令可以查看当前目录下的所有内容（文件、子目录）。
    -  上面输出的每行数据的信息依次为：最后修改日期，类型，大小，名称。
       -  类型为<DIR>表示该项是一个目录。

<br>　　范例3：目录切换。
``` batch
D:\>cd test

D:\test>
```
    语句解释：
    -  使用cd命令可以切换当前目录。
    -  如果当前处于D盘，但想进入C:\Users目录，则必须得先切换到C盘后，再执行cd Users命令才行。

## 文件命令 ##

<br>　　范例1：创建文件。
``` batch
D:\test>echo channel=360>common.txt

D:\test>
```
    语句解释：
    -  使用echo命令与重定向符号结合来实现输入一些内容到特定的文件中。
    -  本范例就是将“channel=360”，输出到当前目录下的common.txt中，如果文件不存在则会自动创建它。

<br>　　范例2：往文件中追加内容。
``` batch
D:\test>echo language=en>>common.txt

D:\test>
```
    语句解释：
    -  使用两个“>>”符号即可以追加内容到文件中。

<br>　　范例3：修改文件名称。
``` batch
D:\test>rename common.txt common.properties

D:\test>
```
    语句解释：
    -  使用rename命令即可修改文件的名称。格式为：rename 要修改的文件 文件的新名。 

<br>　　范例4：删除文件。
``` batch
D:\test>del common.properties

D:\test>
```
    语句解释：
    -  使用del命令即可删除一个文件。 

<br>　　范例5：复制文件-1。
``` batch
D:\test>copy D:\common.properties D:\test
已复制         1 个文件。
```
    语句解释：
    -  使用copy命令即可复制一个文件。格式为：copy 要复制的文件 目标路径。

<br>　　范例6：复制文件-2。
``` batch
D:\test>copy D:\common.properties D:\test\a.txt
已复制         1 个文件。
```
    语句解释：
    -  复制的同时为文件改名。

<br>　　范例7：创建目录。
``` batch
D:\test>md hiDir

D:\test>
```
    语句解释：
    -  使用copy命令即可创建一个目录。

## 流程控制命令 ##

### 选择结构 ###
　　`if`命令实现条件判断，包括字符串比较、存在判断、定义判断等。通过条件判断，`if`命令即可以实现选择功能。

<br>　　范例1：if命令比较字符串的语法格式为：
``` batch
IF [not] string1 compare-op string2 command1 [else command2]
```
    语句解释：
    -  “[not]”：是可选的，用来对表达式的结果进行取反操作。
    -  “compare-op”：比较的操作符，常用的有如下几种：
       -  == 或者 EQU 都表示“等于”。
       -  NEQ 表示“不等于”。
       -  LSS 表示“小于”。
       -  LEQ 表示“小于或等于”。
       -  GTR 表示“大于”。
       -  GEQ 表示“大于或等于”。
    -  “[else command2]”：是可选的，用来指定else子句。

<br>　　范例2：比较字符串：
``` batch
@echo off 
set str1=abcd1233
set str2=ABCD1234
if not %str1% NEQ %str2% (
    echo yes!
) else (
    echo no!
)
```
    语句解释：
    -  程序最终输出“no!”。

### 循环结构 ###

　　`for`命令可以实现类似于`C`语言里面的循环结构，当然`for`命令的功能要更强大一点，通过不同的参数可以实现更多的功能。

<br>　　范例1：for命令语法格式为：
``` batch
for 参数 %%变量名 in (set) do 循环体
```
    语句解释：
    -  “参数”：for命令支持多种参数，后面会具体介绍，也可以不指定任何参数。
    -  “set”：表示待遍历的集合，它可以是一个文件、一组数据等。
    -  “变量名”：迭代变量。
       -  即for命令会将集合中的每一个数据都赋值给它。

<br>　　范例2：无参数的for命令。
``` batch
for %%i in (a,"b c",d) do echo %%i
```
    语句解释：
    -  需要将这段代码放到一个bat文件中才可能正常运行。
    -  本范例将循环3次，依次将“a”、“"b c"”、“d”给输出到cmd窗口中。

<br>　　范例3：`\L`参数。
``` batch
for /l %%i in (1,2,10) do md %%i
```
    语句解释：
    -  参数使用大小写均可。
    -  使用/L参数的for语句，可以根据set里面的设置进行循环，从而实现对循环次数的直接控制。其命令格式为：
       -  for /L %%变量名 IN (start,step,end) DO 循环体
    -  其中，start为开始计数的初始值，step为每次递增的值（可以是负数），end为结束值。

<br>　　范例4：`\F`参数。
　　含有`/F`参数的`for`有很大的用处，在批处理中使用的最多，它可以用来遍历字符串、文件、命令。格式如下：
``` batch
FOR /F ["options"] %%i IN (file) DO command
FOR /F ["options"] %%i IN ("string") DO command
FOR /F ["options"] %%i IN ('command') DO command
```
    语句解释：
    -  ["options"]：是可选的。

<br>　　假设我们有一个`a.txt`文件（GBK编码），内容为：
``` batch
1-1号,1-2号,1-3号
2-1号,2-2号,2-3号
3-1号,3-2号,3-3号
```
　　我们可以使用如下语句进行遍历：
``` batch
@echo off
for /f %%i in (a.txt) do echo %%i
```
    语句解释：
    -  第一行代码用来关闭echo，即不会把for命令给输出到窗口中，而只是将for命令循环体的执行结果输出。
    -  for命令会先从括号执行，因为含有参数/f，所以for会先打开a.txt，然后读出a.txt里面的所有内容，把它作为一个集合，并且以每一行作为一个元素，所以最终会循环3遍。
    -  如果把\f参数去掉的话，则for命令不会去读取a.txt中的内容，而只会将文件名输出。

<br>　　通过上面的范例，我们发现`for /f`会默认以每一行来作为一个元素，但是如果我们还想把每一行再分解更小的内容，该怎么办呢？不用担心，`for`命令还为我们提供了更详细的参数，使我们将每一行分为更小的元素成为可能。

``` batch
@echo off
for /f "delims=," %%i in (a.txt) do echo %%i

# 执行结果
D:\test>D:\test\test.bat
1-1号
2-1号
3-1号
```
    语句解释：
    -  delims用来告诉for每一行应该拿什么作为分隔符，默认的分隔符是空格。
    -  之所以每行只输出一个数据，是因为for命令将每个元素以空格分割，默认是只取分割之后的第一个元素。

<br>　　但是这样还是有局限的，如果我们想要每一行的第二列元素，那又如何呢？这时候，`tokens`跳出来说，我能做到。它的作用就是当你通过`delims`将每一行分为更小的元素时，由它来控制要取哪一个或哪几个。
　　还是上面的例子，执行如下命令：

``` batch
@echo off
for /f "tokens=2 delims=," %%i in (a.txt) do echo %%i

# 执行结果
D:\test>D:\test\test.bat
1-2号
2-2号
3-2号
```
    语句解释：
    -  如果要显示第三列，那就将tokens设置为3。

<br>　　如果要显示第二列和第三列，则换成`tokens=2,3`或`tokens=2-3`,如果还有更多的则为：`tokens=2-10`之类的。
``` batch
@echo off
for /f "tokens=1-3 delims=," %%i in (a.txt) do echo %%i,%%j,%%k

# 执行结果
D:\test>D:\test\test.bat
1-1号,1-2号,1-3号
2-1号,2-2号,2-3号
3-1号,3-2号,3-3号
```
    语句解释：
    -  怎么多出j、k两个变量？这是因为tokens后面要取每一行的前三列的值，用i来替换第一列，并且按照英文字母顺序排列，第二、三列的数据被放到了j、k变量中。

<br>　　范例5：for命令中更新局部变量的值。
``` batch
@echo off 
for /l %%i in (1,1,5) do ( 
    set var=Hi-%%i 
    echo %var% 
)
```
    语句解释：
    -  如果for命令的循环体中包含多行代码，那么需要使用括号将它们括起来。
    -  从表面上来看这段代码是没问题的，但是程序运行后却输出5遍Hi-5，为了解决这个问题，我们需要引入 延迟环境变量扩展 的概念。

　　代码修改为：
``` batch
@echo off 
setlocal ENABLEDELAYEDEXPANSION 
for /l %%i in (1,1,5) do ( 
    set var=Hi-%%i 
    echo !var! 
)
```
    语句解释：
    -  这样输出就正常了。

<br>
**本节参考阅读：**
- [批处理读取文本中的每一行](http://blog.csdn.net/mfx1986/article/details/5606228)
- [Windows Bat](http://inching.org/2014/03/31/windows-bat/)

## 其他命令 ##

<br>　　范例1：清屏。
``` batch
D:\test>cls
```
    语句解释：
    -  使用cls命令可以将cmd窗口中的所有文本都给清空。

<br>　　范例2：调用其他批处理文件。
　　假设我们现在有一个`test.bat`文件，里面的内容为：
``` batch
echo Hello World
```
　　那么我们可以在另一个批处理文件中这么调用它：
``` batch
D:\test>call test.bat

D:\test>echo Hello World
Hello World

D:\test>
```
    语句解释：
    -  call命令可以从一个批处理程序调用另一个批处理程序，并且不终止父批处理程序。



<br><br>