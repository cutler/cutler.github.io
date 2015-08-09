title: 安全篇　第一章 应用程序破解
date: 2014-12-29 22:10:15
categories: android
---
　　本章主要介绍如何使用`ApkTool`工具对`Android`应用程序（包含游戏）进行破解。
　　软件破解本就是违法行为，如果市场上充斥着破解软件，那么开发正版游戏、正版软件的公司将难以生存，为了中国软件事业的健康发展，请支持正版。
　　本章提到的破解技术仅供学习交流，尽可能多的了解软件破解的原理也能让我们写出更安全、优秀的软件。

　　这里特别感谢好哥们`张扬（大饼）`为本文指出不足之处，并为笔者指明了反编译思路。
<br>

# 第一节 破解工具 #
　　软件破解，本质上就是先把软件给拆开了，然后修改一下软件的内容（比如去掉收费相关的软件代码），接着在把软件给组装起来的过程。 
　　因此，在进行软件破解时，第一步要做的就是把软件给拆开，而ApkTool就是用来将软件拆开的一个工具。
　　工欲善其事必先利其器，在开始破解之前我们要先介绍一下ApkTool，以便后面顺利的开展破解工作。

<br>**ApkTool**
　　ApkTool是Google提供的apk编译工具，它不仅可以用来反编译apk，还可以用来将反编译的apk重新编译回apk。反编译时我们需要使用`decode`命令，重新编译时则需要使用`build`命令，这两个命令的具体用法后面会有详细介绍。

　　下载地址：http://ibotpeaches.github.io/Apktool/ ，本文档使用的是`2.0.0rc3`版本。

<br>**Apk文件**
　　在进行破解之前，为了减少我们之间的知识断层，这里先介绍一些apk相关的常识：

	-  Apk文件本质上是一个压缩文件，可以使用压缩软件打开它。
	-  Apk文件必须被签名之后才能被安装到设备（手机、平板等）上，否则无法安装。
	-  所谓的对Apk文件进行签名，就是使用JDK里自带的jarsigner.exe工具将一个签名文件和一个未签名的Apk文件绑定到一起。
	-  使用Eclipse开发时，Eclipse每次生成Apk时都会使用一个默认的签名文件（debug.keystore）对APK进行签名。
	-  debug.keystore被保存在当前操作系统用户目录下的.android目录下：
	   -  在Vista和Windows7系统中，路径为：C:\Users\用户\.android\debug.keystore
	   -  在更早版本的Windows（如XP）系统中，路径为：C:\Document and Settings\用户\.android\debug.keystore
	-  Apk文件里的xml是二进制格式的，如果直接使用压缩软件解压Apk，那么解压出来的xml文件是无法直接查看、编辑的，但是里面的图片是可以直接查看的。
	-  只有包名和签名完全一样的两个Apk之间才可以相互覆盖安装，否则无法覆盖安装。
	-  Dalvik与JVM的最大的区别之一就是Dalvik是基于寄存器的。

# 第二节 HelloWorld #
　　针对不同的需求破解Apk有不同方式，最简单的破解就是不修改程序的代码，而只是替换一下程序中所用到的图片、文本等数据。

　　接下来将介绍这种破解方式的具体实施步骤。

　　1、创建一个名为`Decode`的`Android`项目，项目的包名为`com.cutler.decode`，然后在`Eclipse`中进行编译、运行。
　　2、将下载来的`apltool`工具和刚生成的`apk`文件都复制到`D:\decode`目录下。
　　3、打开`cmd`窗口，进入到`D:\decode`目录，执行如下命令：
``` android
apktool.bat d -f Decode.apk
```
    语句解释：
    -  apktool.bat会在D:\decode目录下创建一个Decode目录，并将Decode.apk的内容解压到其中。
    -  通过apktool.bat解压apk时，解压出来的xml是可以查看和修改的。

<br>**decode命令**
　　既然上面用到apktool工具的`decode`命令，那么在继续向下进行之前，有必要先学习一下该命令的用法。
　　它的语法格式为：
``` lua
apktool d[ecode] [options] <file_apk>
```
	语句解释：
	-  在上面的语法遵守了“扩展巴科斯范式”的约定，中括号括起来的代表是可选的，尖括号括起来的是必选的。
	-  刚才我们执行的命令是“apktool.bat d -f Decode.apk”，其中d是decode的简写，它等价于：apktool decode。
	-  [options]是decode命令的附加选项，常用的取值有：
	   -  -s：反编译时不反编译apk中的源代码。即不会把apk里的classes.dex文件反编译。
	   -  -r：反编译时不反编译apk中的资源文件。即res目录下的xml文件等仍然保持二进制形式的，并且res/values将不会被反编译。
	   -  -f：强制覆盖已经存在的文件。即执行反编译命令时，如果输出路径所已经存在了，则是无法进行反编译的，除非加上-f参数。
	   -  -o：反编译的输出路径。如果不写则默认为当前目录，并且以apk的文件名作为输出目录名。
	-  <file.apk>：要反编译的文件的名称。

　　4、接着修改`Decode\res\values\strings.xml`文件中的“`Hello world!`”为“`世界，你好!`”。
　　5、接着删除`Decode\res\drawable-ldp`、`Decode\res\drawable-mdpi`、`Decode\res\drawable-xhdpi`三个目录。
　　6、然后找一个`72*72`尺寸的`png`图来替换调`Decode\res\drawable-hdpi`目录中的“`ic_launcher.png`”。
　　7、在`cmd`窗口中执行如下命令：
``` lua
apktool.bat b Decode -o newDecode.apk
```
　　另外，在打开、修改、保存`Decode\res\values\strings.xml`文件时，要始终保证文件编码是`UTF-8`，因为在“记事本”等文本编译软件中会自动使用系统的默认编码来操作文本文件，而中文操作系统的默认编码是`GBK`，这会导致打包失败。

<br>**build命令**
　　同样的，我们也来学习一下apktool工具的`build`命令的语法格式为：
``` lua
apktool b[uild] [options] <app_path>
```
	语句解释：
	-  [options]是build命令的附加选项，常用的取值有：
	   -  -o：打包成功后生出的文件。如果不写则默认将apk放到<app_path>/dist目录下。
	-  <app_path>：要打包的目录。

　　值得注意的是，使用`apktool`的`build`命令生成的`apk`是一个未签名的文件，而未签名的文件是无法被安装的，因此接下来我们要对`apk`进行签名，并且为了能覆盖安装，我们将不再创建新的签名文件，而是使用`debug.keystore`进行签名。

　　说到这里，我们就可以发现一件事：如果我们能得到软件作者的签名文件，那么我们破解后的包将完全可以覆盖安装掉原作者的包！！！

　　我们需要使用下面的命令来对apk进行签名：
``` lua
jarsigner -verbose -keystore debug.keystore -signedjar signed.apk newDecode.apk androiddebugkey -storepass android -digestalg SHA1 -sigalg MD5withRSA
```
	语句解释：
	-  首先要保证JDK\bin目录已经被放到了PATH环境变量中，否则无法使用上面的命令进行打包。
	-  下面依次介绍一下jarsigner.exe的各个参数的取值：
	   -  [-verbose[:suboptions]]：签名/验证时输出详细的过程信息。子选项可以是all, grouped或summary。
	   -  [-keystore <url>]：签名文件的保存位置。
	   -  [-signedjar <文件>]，这个参数分为三个部分：
	      -  第一部分是即将生成的已签名的JAR文件所要使用的名称。
	      -  第二部分是待签名的apk文件。
	      -  第三部分是签名文件里设置的别名(alias)。
	   -  [-storepass <口令>]：签名文件里设置的密码。
	   -  [-digestalg <算法>]：摘要算法的名称。
	   -  [-sigalg <算法>]：签名算法的名称。

　　然后就可以将生成的`signed.apk`安装到手机上查看运行效果了。

　　至此我们通过修改`apk`里的文字、图片资源，完成了一个最简单的破解。 但是真正的游戏、软件破解可不是这么简单的，万里长征，第一步吧。

# 第三节 破解App #
　　本节将介绍如何破解一个纯Android开发的应用软件，至于游戏的破解将在下一节中介绍。

　　老规矩为了更好的理解破解过程，我们在此之前先介绍一下`JVM`、`Dalvik`、`Dex`三者的概念。

　　JVM、Dalvik与Dex：

	-  JVM是Java Virtual Machine（Java虚拟机）的缩写，简单的说它就是用来运行Java程序的。
	   -  目前Android程序使用Java语言来开发，因而不可避免的会使用JVM来运行程序。但实际上JVM对移动设备的支持并没有想象中的那么完美，因而Google公司自己设计了一个用于Android平台的虚拟机，即Dalvik。
	-  Dalvik和JVM是一样的，用来解释执行Java字节码文件，但Dalvik解析的字节码文件的后缀名为.dex，而不是JVM的.class。
	   -  这也就是说，Android系统中的应用程序是运行在Android自身的Dalvik虚拟机上的，而不是运行在Java VM之上。
	-  对于Android来说，通常情况下一个Apk文件内部只有一个classes.dex文件，而这个.dex文件内部其实保存着多个.class文件。

<br>　　然后再介绍一下`Smali`语言的概念：

	-  在使用Apktool工具反编译apk时，它会在输出目录里创建一个smali子目录，并将apk里面的classes.dex里的一个个类，按照它们的包结构反编译成一个个的smali文件，Smali文件里的代码都是用Smali语言写的。
	-  Smali代码是Android的Dalvik虚拟机的可执行文件DEX文件反汇编后的代码，Smali语言是Dalvik的反汇编语言。  

<br>　　到这里一切都明白了，由于我们手上不可能拥有`apk`的源代码， 所以为了达到破解的目的，我们只能通过修改反编译生成的`smali`文件的内容来完成修改游戏逻辑的需求了。既然我们目标已经明确了（需要去修改`smali`文件），那么下一步就应该动手去做了。但在动手之前，还得先学习一下`Smali`语言的基础语法，不然是无从下手的（看都看不懂，又怎能知道如何修改）。

## Smali语言入门 ##
　　为了由浅入深的介绍`Smali`语言，我们先在原来的`Decode`项目基础上创建一个普通的类：`HelloWorld`。

<br>　　范例1：com.cutler.decode.HelloWorld.java。
``` java
package com.cutler.decode;

public class HelloWorld {
    // 定义基本类型变量
    static short varShort;
    protected static int varInt;
    // 定义对象类型变量
    String objString = "ABC";
    Long objLong;
	
    public HelloWorld(int param1, boolean param2){
        int param3 = 2;
        long param4 = 3;
    }
}
```
	语句解释：
	-  在HelloWorld中定义了各种类型的变量和方法，稍后我们将看到这些代码的在Smali语言中是如何表示的。
	-  由于篇幅有限，笔者不会把所有Java支持的语法都列举出来，并将它们对应于Smali代码，因此本章中未讲到的语法知识，读者可以自行去测试。

<br>　　然后对项目执行编译、运行操作，并将生成的apk文件反编译，接着打开`smali/com/cutler/decode/HelloWorld.smali`文件。

<br>　　范例2：HelloWorld.smali代码解读（1）。
``` smali
# .class指明当前文件是一个类文件，后面跟随着该类的访问（和存在）修饰符、包名、类名
.class public Lcom/cutler/decode/HelloWorld;
# .super指明当前类的父类
.super Ljava/lang/Object;
# .source指明当前类所在的文件名
.source "HelloWorld.java"


# static fields
# .field 指明接下来定义的是一个字段。 格式为：[.field 修饰符 字段名:字段数据类型简写形式]
.field protected static varInt:I
.field static varShort:S


# instance fields
.field objLong:Ljava/lang/Long;
.field objString:Ljava/lang/String;


# direct methods
# .method 指明接下来定义的是一个方法。 constructor表名该方法是一个构造方法。
# 方法内部代码的含义，会在下面的几个范例中逐一讲解。
.method public constructor <init>(IZ)V
    .locals 4
    .param p1, "param1"    # I
    .param p2, "param2"    # Z

    .prologue
    .line 11
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 8
    const-string v3, "ABC"

    iput-object v3, p0, Lcom/cutler/decode/HelloWorld;->objString:Ljava/lang/String;

    .line 12
    const/4 v0, 0x2

    .line 13
    .local v0, param3:I
    const-wide/16 v1, 0x3

    .line 14
    .local v1, param4:J
    return-void
#.end method是方法结束的标志。
.end method
```
	语句解释：
	-  上面提到的字段的数据类型简写形式，可以通过JDK提供的javap工具获取，在NDK开发的时候也会用到javap工具。
	-  javap的命令为：javap -s 包名.类名
	-  数据类型的简写形式有：
	   -  byte -> B    char -> C      short -> S      double -> D      long -> J
	   -  int -> I     float -> F     boolean -> Z    int[]-> [I       Object -> L

<br>　　范例3：HelloWorld.smali代码解读（2）。
　　方法有直接方法和虚方法两种，直接方法的声明格式如下：
``` smali
.method <访问权限> [修饰关键字] <方法签名>  
    <.locals> 
    [.parameter] 
    [.prologue] 
    [.line] 
    <代码体>
.end method 
```
	语句解释：
	-  <访问权限>的取值有public、private等。
	-  [修饰关键字]的取值有static、constructor等。
	-  <方法签名>的格式为：（参数1的类型参数2的类型...）方法返回值的类型。也可以通过javap工具获取某个类的方法签名。
	-  <.locals>指定了方法中局部变量所占据的寄存器的总数（注意不包括方法的参数）。这里有三点需要注意的：
	   -  1、如果局部变量没有被赋值，则是不会被计算到.locals里的。比如int a;不会被计算，而int a = 3;则就会被计算。
	   -  2、特别说明一下：Long和Double类型是64位的，需要2个寄存器。
	   -  3、在apktool的其他版本中，反编译出来的smali文件里可能使用的是.registers而不是.locals。
	-  [.parameter]指定了方法的参数。 每一个参数对应一个[.parameter]，格式为：.parameter 参数名。
	-  [.prologue]指明当前位置是代码的开始处。即在它之前出现的都是些方法的元数据，在它之后出现的才是真正的代码。
	-  [.line]指定了该处指令在源代码中的位置。
	-  <代码体>指明了代码的内容。一般情况下它总是跟随着[.line]一起出现。

<br>　　在继续学习之前，有些东西需要先说明一下。
　　前面说过，`Dalvik`与`JVM`的最大的区别之一就是`Dalvik`是基于寄存器的。这意味着在`Smali`里的所有操作都必须经过寄存器来进行，比如函数调用、变量赋值等等。
<br>　　寄存器分为两种：本地寄存器和参数寄存器。

	-  本地寄存器是用来保存方法内的局部变量的值所使用的寄存器。用v开头数字结尾的符号来表示，如v0、v1、v2、...。本地寄存器没有限制，理论上是可以任意使用的。
	-  参数寄存器是用来保存方法参数的值所使用的寄存器。以p开头以数字结尾的符号来表示，如p0、p1、p2、...。特别注意的是p0不一定是方法的第一个参数：
	   -  在非static函数中，p0代指“this”，p1表示函数的第一个参数，依此类推...。
	   -  在static函数中p0才对应第一个参数（因为Java的static方法中没有this）。   

　　之所以范例2的代码中`.locals`的值是4，是因为`smali`代码中包含了`v0-v3`共4个寄存器。

<br>　　范例4：HelloWorld.smali代码解读（3）。
``` smali
.line 11
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
```
	语句解释：
	-  invoke-direct指令用来调用一个实例方法，格式为：invoke-direct {参数列表}, 方法所在的类以及方法签名。
	-  本范例的含义为：在对象p0上调用其继承自父类Object类的无参构造方法。

<br>　　范例5：HelloWorld.smali代码解读（4）。
``` smali
const-string v3, "ABC"
const/4 v0, 0x2
const-wide/16 v1, 0x3
```
	语句解释：
	-  以const开头的指令都是在定义常量。
	-  const-string指令用来定义一个字符串常量。第一行代码的含义为：将字符串ABC的地址赋值给v3。
	-  const/4和const-wide/16分别对应int和long型的长量。
	
<br>　　范例6：HelloWorld.smali代码解读（5）。
``` smali
iput-object v3, p0, Lcom/cutler/decode/HelloWorld;->objString:Ljava/lang/String;
```
	语句解释：
	-  以iput开头的指令都是为一个成员变量赋值，以iget开头的指令都是用来获取成员变量的值。如：iget-boolean。
	-  以sput开头的指令都是为一个静态变量赋值，以sget开头的指令都是用来获取静态变量的值。如：sput-short。
	-  没有“-object”后缀的表示操作的成员变量对象是基本数据类型，带“-object”表示操作的成员变量是对象类型。
	-  本范例代码的含义是：将寄存器v3中保存的值，赋值到对象p0的objString属性上去。
	   -  Lcom/cutler/decode/HelloWorld; 表示属性所隶属的类。
	   -  ->表示从属关系。即箭头右端的字段隶属于箭头左端的类。
	   -  objString表示属性的名称。
	   -  Ljava/lang/String;表数属性的数据类型。

　　最后的那一条`return-void`指令，就是表示方法没有返回值。如果方法有返回值的话代码类似于：`return v0`。

<br>**本节参考阅读：**
- [Smali语法学习与DEX文件详解](http://wenku.baidu.com/link?url=B4NykyUlMMkK_zTAZSUT92mNVpCpX0NscXAGlDJGUGPVwZcTrlzJCDONz0x-KiKVNT1-hkACWSc-hbApUbVpWYTmKkXBYfqoJsJg1lv89Wq) 
- [APK反编译之一：基础知识](http://blog.csdn.net/lpohvbe/article/details/7981386)  

## MainActivity.smali ##
　　通过上一节我们了解了`Smali`语言的基础语法，但是仅仅了解那几个语法还是远远不够的，本节则通过分析`MainActivity.smali`文件来介绍`Smali`语言的其它语法。

<br>　　范例1：onCreate()方法分析。
``` smali
# virtual methods
.method public onCreate(Landroid/os/Bundle;)V
    .locals 1
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 11
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 12
    const/high16 v0, 0x7f030000

    invoke-virtual {p0, v0}, Lcom/cutler/decode/MainActivity;->setContentView(I)V

    .line 13
    return-void
.end method
```
	语句解释：
	-  以invoke开头的指令都是在进行方法调用。常用的几个指令有：
	   -  invoke-static 调用静态方法。
	   -  invoke-super 调用父类的方法。
	   -  invoke-interface 调用接口的方法。
	   -  invoke-direct

<br>　　现在我们想在`MainActivity.smali`的`onCreate()`方法里加个`Toast`，Android中对应的代码应该是这样的：
``` android
Toast.makeText(this, "世界，你好！", Toast.LENGTH_SHORT).show();
```
<br>　　那么问题来了，虽然我们之前讲解的东西都很容易懂，但是现在让我们真刀真枪的上去干，还是不会写啊，怎么办？ 
　　简单，那就自己建立一个Android项目，在Android中把这行代码给写出来，然后再反编译它，就得到了我们想要的代码了，这种方法对于那些比较复杂的情况也照样适用，最多在代码使用之前我们稍微改改而已。
　　`写代码不会写，尼玛改代码还不会么？？？？`

<br>　　范例2：添加Toast输出。
``` smali
# virtual methods
.method public onCreate(Landroid/os/Bundle;)V
    .locals 2
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 11
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 12
    const/high16 v0, 0x7f030000

    invoke-virtual {p0, v0}, Lcom/cutler/decode/MainActivity;->setContentView(I)V

    .line 13
    const-string v0, "\u4e16\u754c\uff0c\u4f60\u597d\uff01"

    const/4 v1, 0x0

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 14
    return-void
.end method
```
	语句解释：
	-  将Demo项目为Toast而生成的smali代码放到待破解项目中时，有以下几点要注意：
	   -  确保函数第一行上的那个“.locals 寄存器数量”的数值是正确的。 比如默认情况下onCreate的.locals值为1，但是由于我们添加了的Toast操作需要两个寄存器变量，所以需要把.locals修改为2。
	   -  onCreate()函数里的代码的“.line 行号”就得相应后移了。如本范例把Toast的smali代码插入到onCreate()函数的13行上，相应的return-void就应该被定义为“.line 14了”。
	-  move-result-object指令用来将它上一条“方法调用”指令的返回值放到一个寄存器中。

　　关于Smali的其他语法在此就不一一介绍了，当遇到不认识的指令时Google搜索或自己推测一下，问题都不大。

# 第四节 破解游戏 #
　　在破解之前，先来说一下游戏破解最常见的两个目的：

	-  修改游戏里的数值。 比如金钱、血量。
	-  修改游戏里的支付、分享等逻辑。 比如让玩家点击充值、分享时直接可以获取到奖励，而不用真正的去充值、分享。

　　市场中的游戏都是基于各种各样的游戏引擎开发的，而大多数游戏的源代码最终都被打入一个`so`库中，然后在程序中动态加载这个库文件。如果想修改游戏的数值必须得修改`so`库。
　　由于修改`so`库的技术含量比较高，因此本节只会讲解如何破解使用`Cocos2d-x`、`Unity3D`游戏引擎开发的单机游戏的支付、分享等逻辑。

<br>**思路是这样的**
　　以国内游戏为例，通常游戏会接入支付宝、银联等支付SDK，接入微信、新浪微博等分享SDK，而这些SDK的厂家都是通过`jar`包的形式对外提供SDK的，这就好办多了，我们通过前三节学习的知识完全可以完成破解工作（也许你还需要再学习一些指令，比如`if`指令）。
　　我们以分享为例，通常游戏需要进行分享时，开发人员的做法会是：

	-  当玩家在游戏中点击分享按钮时，游戏会调用Android中的某个类（假设它叫ShareUtil）的某个方法（假设它叫share）中执行分享操作。
	-  在ShareUtil.share()方法中会执行两个操作：
	   -  首先，设置一些与分享相关的信息（比如要分享的文字、图片等）。
	   -  然后，调用分享SDK进行分享。
	-  当分享SDK分享成功后会通过回调通知ShareUtil。
	-  最后，ShareUtil接到通知后会转过来去告诉游戏端发放奖励。

　　支付的流程与分享的流程是类似的，既然已经知道了它们的套路，那么接下来我们就开始吧。

## 《愚公移山》 ##
　　《愚公移山》是由厦门青瓷开发，上海黑桃互动代理发行的手机休闲游戏，运用Unity3D技术实现游戏的多平台均可运行的游戏。

　　[点击查看：《愚公移山1.1》](http://zhushou.360.cn/detail/index/soft_id/2037801)

　　将apk下载到本地后，为了避免中文文件名导致的各种问题，我们先把apk文件的名称为`“ygys.apk”`。

<br>　　范例1：先把它反编译。
```
apktool.bat d ygys.apk
```
	语句解释：
	-  你懂得！！！！

<br>　　破解游戏的第一步要干什么？ 当然是先确定目标啊，我们的破解任务有两个：

	-  进入游戏后，点击“商店”，找到“微信分享”，让玩家可以在点击“一键分享朋友圈”时，直接获得“5000儿孙”!!!
	-  在“商店”里，找到“花费：1200金币”，让玩家可以不花费金币就“儿孙数量翻倍”。

　　确立了目标后，然后就该各个击破它们了。

### 破解分享功能 ###
　　知己知彼百战不殆，破解之前先打开游戏玩一下，看看它们用的是哪家的分享SDK，这样我们就可以也下载那个SDK，然后参考SDK的接入流程来进行破解了。  

　　通过观察，从表面上只能看出愚公移山使用的是微信分享，但是没法确定具体是哪一家的（有些第三方分享SDK将各大平台的分享SDK封装到一起了），没办法只能进入到smali目录下，随便瞎看，结果没点几下就看到了`smali\cn\sharesdk`目录，看到这里我们就知道了，它使用的是[ ShareSDK ](http://sharesdk.mob.com/Download)。
　　然后，我们就可以去ShareSDK官网把Android端的分享SDK的接入Demo给下载下来，稍后会用到。

　　现在我们来看看ShareSDK的demo项目中是如何进行微信分享的，找到`cn.sharesdk.demo.WechatPage`类，发现有如下代码：
``` android
ShareSDK.setPlatformDevInfo("WechatMoments", map);
```
　　这行代码的作用看起来像是为SDK指定分享的方式的，那么就用它作为我们的入口，因为不论是`.java`文件还是`.smali`文件，虽然它们的语法差别很大，但是方法的名称是不会被改变的。

　　为了方便代码定位，我们将反编译出来的`ygys`文件夹放入到Eclipe中，因为Eclipse有全文搜索的功能，快捷键是“`ctrl+H`”，打开搜索窗口后，找到“`File Search`”选项卡，搜索`setPlatformDevInfo`关键字，如下图所示：

<center>
![Eclipse全文搜索](/img/android/android_26_1.png)
</center>

　　最终搜索出两个结果，通过观察发现，第一个结果是`setPlatformDevInfo`的定义，而第二个则是对`setPlatformDevInfo`的调用。
　　我们打开`smali\com\qcplay\www\wechat\wxapi\WXShare.smali`，找到`318`行，发现它是属于“`.method private _init()V`”函数的，以我们以往接入SDK的经验来看，一般SDK都会存在一个“初始化”的步骤，只有初始化完毕后，SDK才能正常工作，所以`_init`方法应该不是用户点击按钮的时候调用的，因为初始化通常是个耗时操作，放在点击按钮的时候调用明显不合适（用户等待的时间就变长了）。
　　当然最重要的一点是，仔细看了一下这个方法里的代码，并没有任何与分享有关的代码，所以综合这些信息，可以判定我们要找的不是这个方法。

　　那么既然已经找到了`setPlatformDevInfo`方法的调用位置了，那么真正执行分享的代码应该也在附近（除非那个狗日的程序员是个傻屌乱写代码），现在只有上下看看`WXShare.smali`里还有其他什么方法没有，结果看到了下面这八个方法：

	-  ShareImgBit、ShareImgPath、ShareText、ShareWebPage、_shareImgBit、_shareImgPath、_shareText、_shareWebPage

　　其中后四个是`private`修饰的，外界没法直接调用它们，因此先将它们排除。
　　现在只剩下四个方法了，但是当玩家在游戏中点击“`一键分享朋友圈`”按钮时，真正调用的是哪一个方法呢？ 没办法只有在这四个方法里都加入我们的代码，进行测试了，比如我们把`ShareText`方法的代码修改如下：
``` smali
.method public static ShareText(ZLjava/lang/String;)V
    .locals 2
    .param p0, "isTimelineCb"    # Z
    .param p1, "text"    # Ljava/lang/String;

    .prologue
    .line 96
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;

    const-string v1, "*********************************** Hi ShareText"

    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 97
    return-void
.end method
```
	语句解释：
	-  实际上就是加了一个System.out.println("*********************************** Hi ShareText");
	-  注意还要修改一下 .locals 2，因为System.out语句使用到了2个寄存器。

　　相应的我们也在另外三个方法里加上不同的输出内容，然后重新打包、签名、安装、运行，当点击“一键分享朋友圈”时，发现输出的内容是我们在`ShareWebPage`方法里写的内容，至此我们就确定了，当用户点击分享按钮时Android端第一个被调用的方法了。

　　查看`ShareWebPage`方法的内部，发现它又调用了`_shareWebPage`方法，我们接着跟进去，第一眼看到的就是我们熟悉的`Handler`的定义：
``` smali
.prologue
.line 127
new-instance v6, Landroid/os/Handler;
```
　　通过连猜带蒙的方式，得知它调用了`Handler.post(Runnable)`方法执行一个任务，这个`Runnable`对象就是`WXShare$3.smali`。由于那一行代码看起来像是在调用分享SDK，所以我们只能硬着头皮继续看`WXShare$3.smali`了。
　　提示：在Java中，一个内部类的类名的格式为`外部类名$内部类名`，对于匿名内部类来说，内部类名用数字编号。

　　既然知道`WXShare$3`是`Runnable`的子类，那我们直接去找`run`方法，看看里面有什么。又是一阵连蒙带猜结束后，看到了如下代码：
``` smali
.line 141
.local v2, "wechat":Lcn/sharesdk/framework/Platform;
invoke-virtual {v2, v1}, Lcn/sharesdk/framework/Platform;->share(Lcn/sharesdk/framework/Platform$ShareParams;)V
```
　　终于找到了我们想要看到的“`share`”函数的调用了，虽然不确定是不是分享，但是从名字上看，`90%`是没错了。假设我们没找错，那也只是能证明“`点击一键分享朋友圈按钮时，程序会调用ShareWebPage函数，并由ShareWebPage函数执行分享操作`”，接下来我们该干什么?

　　我们没必要继续向下追踪了，那里面都是分享SDK相关的代码了，对我们没用。现在就需要回到ShareSDK官方提供的Demo项目中看看当分享成功后它是怎么接到通知的。
　　从`WechatPage.java`中找到了如下代码：
``` android
Platform plat = null;
ShareParams sp = getShareParams(v);
if (ctvPlats[0].isChecked()) {
    plat = ShareSDK.getPlatform("Wechat");
} else if (ctvPlats[1].isChecked()) {
    plat = ShareSDK.getPlatform("WechatMoments");
} else {
    plat = ShareSDK.getPlatform("WechatFavorite");
}
plat.setPlatformActionListener(this);
plat.share(sp);
```
　　发现它是在调用`share`方法进行分享之前，调用`setPlatformActionListener`方法设置了一个回调接口，`WechatPage`类实现了该接口。
　　那么我们再在`WechatPage`类找找`PlatformActionListener`接口定义了哪些方法，最终找到了它：
``` android
public void onComplete(Platform plat, int action, HashMap<String, Object> res)
```

　　终于又找到新的线索了，当分享成功后ShareSDK会调用`PlatformActionListener`接口的`onComplete`函数。那么还是按照刚才的结论(同一模块内部的一些相关的类所在的位置相距不会太远），在`smali\com\qcplay\www\wechat\wxapi`目录下找找，看看有没有实现`PlatformActionListener`接口的`smali`文件。
　　最终，我们定位到了`WXShare$2.smali`，在它的`onComplete`函数里找到了如下代码：
``` smali
.line 71
const-string v0, "3rd_sdk"

const-string v1, "OnWeChatResp"

const-string v2, "errcode=0"

invoke-static {v0, v1, v2}, Lcom/unity3d/player/UnityPlayer;->UnitySendMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
```
　　这就是当分享成功后，程序要执行的代码，`onComplete`函数里的其他代码就是用来打印`Log`的，不重要，我们不用管。
　　现在我们需要做的就是，把这段代码copy出来，然后放到`WXShare.smali`的`ShareWebPage`函数里。即当用户点击分享的时候，我们不调用分享，而是直接调用上面的代码，让用户可以立刻领取奖励，最终的代码如下：
``` smali
.method public static ShareWebPage(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;[B)V
    .locals 6
    .param p0, "isTimelineCb"    # Z
    .param p1, "url"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;
    .param p3, "description"    # Ljava/lang/String;
    .param p4, "img"    # [B

    .prologue
    .line 122
    const-string v0, "3rd_sdk"
    const-string v1, "OnWeChatResp"
    const-string v2, "errcode=0"
    invoke-static {v0, v1, v2}, Lcom/unity3d/player/UnityPlayer;->UnitySendMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 123
    return-void
.end method
```
　　然后保存、打包、签名、运行。

　　至此我们就完成了分享SDK的破解，看了这么多你可能会感觉，如果是自己搞的话思路不会有这么清晰，还是会感觉无从下手。 没关系，万事开头难，我搞这个SDK破解也是没头绪的晕了2天，然后才慢慢走出来的。


### 破解短信支付功能 ###
　　还是老套路，先观察游戏使用的是什么支付方式再决定怎么破解。 但经过观察后，我们从游戏界面上只能看出来《愚公移山》使用的是短信支付，其他的却什么都看不出来，那么只能再去看看`smali`文件夹下面有什么线索没有了。

　　虽然现在没什么头绪，只能是胡乱翻找，但是按照“`相关代码不会离太远`”的原则，我们先去`sharesdk`所在的目录看看，结果发现了一个名为“`egame`”的支付SDK，然后果断去百度一下，看看`egame`是怎么个用法，结果搜索到了 http://180.96.63.69/Documents/SDK_Pay.html 。

　　接着将`egame`的SDK下载下来，打开`cn.play.egamesmsonline69.MainActivity`文件，发现有个名为`EgamePay`的类比较核心，我们也许可以从它入手。 
　　然后在Eclipse中全文搜索`EgamePay`类，查询出了2个目录：

	-  cn\egame\terminal\paysdk
	-  com\heitao\mp\channel
　　其中第一个目录不出意外的话应该是`egame`提供给游戏开发者的SDK中的`jar`包，所以对我们没什么用。
　　而第二个目录，看起来就像是游戏开发者自己写的充值代码了，所以我们打算先打开`HTMP_CHA.smali`文件看看，查看之后，结果里面就是支付相关的代码。

　　但是此时还有个问题，`com\heitao\mp\channel`目录下有`7`个类，其中`HTMPBaseChannel.smali`是一个父类，另外`6`个类中有三个是内部类，而剩下的三个类从名字来看的话，应该是代表三个充值渠道，那么可以肯定的是，这三个渠道不会同时被使用，所以需要知道我们从`360`市场下载过来的apk会走哪个充值渠道。
　　这个好判断，只要在这三个类中都加上我们万能的HelloWorld代码，然后重新打包，看看运行时输出的内容就可以了。

``` smali
.method public doPay(Lcom/heitao/mp/model/HTMPPayInfo;Lcom/heitao/mp/listener/HTMPPayListener;)V

#以上省略若干代码

    .line 150
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
    const-string v1, "*********************************** Hello World22"
    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V
    :goto_0
    return-void

#以下省略若干代码

.end method
```
<br>　　从运行结果看出来，我们从360上下载的apk所使用的渠道为`HTMP_CHL.smali`，那么接下来要做的就是：

	-  先把调用充值SDK的代码（假设为A）给删掉。
	-  然后找到充值成功后程序要执行的代码（假设为B）。
	-  将B放到原来A所在的地方。
　　
　　那么先来删除调用充值SDK的代码（`HTMP_CHL.smali`的第`74`行），即下面的这段：
``` smali
invoke-virtual/range {v0 .. v6}, Lmm/purchasesdk/Purchase;->order(Landroid/content/Context;Ljava/lang/String;ILjava/lang/String;ZLmm/purchasesdk/OnPurchaseListener;)Ljava/lang/String;
```
　　为什么知道是这个方法呢? 还是老样子，一半是猜的，一半是根据支付SDK分析的。 
　　事实上《愚公移山》的apk中包含了多个支付SDK（至少我就看到了2个），一个是`egame`，一个是中国移动的`purchasesdk`。
　　从360平台上下载的《愚公移山》实际上使用的是中国移动的`purchasesdk`，我们上面的分析过程的意义就是：通过搜索`egmae`中的`EgamePay`类来定位出《愚公移山》的支付模块所在的位置，进而确定了它使用的支付SDK实际为`purchasesdk`。

　　接下来我们需要找到充值后要执行的代码，目前唯一的线索就是`HTMP_CHL$1.smali`这个内部类，进入看看后，发下了如下可疑代码：
``` smali
.line 57
iget-object v1, p0, Lcom/heitao/mp/channel/HTMP_CHL$1;->this$0:Lcom/heitao/mp/channel/HTMP_CHL;

iget-object v1, v1, Lcom/heitao/mp/channel/HTMP_CHL;->mPayListener:Lcom/heitao/mp/listener/HTMPPayListener;

invoke-virtual {v1}, Lcom/heitao/mp/listener/HTMPPayListener;->onHTPayCompleted()V
```
　　然后把这三行代码中的后两行copy出来，放到`HTMP_CHL.smali`的`doPay`方法里即可，最终结果如下：
``` smali

#以上省略若干代码

    move v5, v3

    iget-object v1, p0, Lcom/heitao/mp/channel/HTMP_CHL;->mPayListener:Lcom/heitao/mp/listener/HTMPPayListener;

    invoke-virtual {v1}, Lcom/heitao/mp/listener/HTMPPayListener;->onHTPayCompleted()V

    .line 150
    :goto_0
    return-void

#以下省略若干代码

```
	语句解释：
	-  HTMP_CHL类的mPayListener字段继承自父类HTMPBaseChannel。
	-  注意：copy过来代码后，还要把“iget-object v1, v1”改成“iget-object v1, p0”。

<br>　　从上面的破解过程可以看出来，软件破解的成功与否，除了需要大量的代码分析外，还与运气有那么一点关系。

## 《消灭星星》 ##
　　《消灭星星》是一款经典的消除类益智休闲手游，由掌游天下从韩国引入后深受中国玩家们的喜爱。简单的游戏规则，轻松的趣味关卡，1分钟即可上手,，一旦开始根本停不下来！

　　[点击查看：《消灭星星4.0.1》](http://shouji.baidu.com/game/item?docid=7371485&from=web_alad_6)

**此次破解任务：**
　　将《消灭星星》里的支付SDK替换成我们自己的支付SDK，具体可以将任务分为两步来执行：

	-  首先，定位出游戏调用支付和处理支付结果的代码。
	-  然后，将我们的SDK插入到游戏中。

### 定位支付代码 ###
　　游戏下载完毕后我们不着急破解，而是先将它安装到手机上观察一下整个游戏，比如看看它使用的是什么样的支付方式（手机话费、支付宝等）。

<br>**移动MM支付SDK？**
　　首次打开游戏，发现了`“MM伴我，移动生活”`的闪屏页，因而可以初步判断游戏应该是接入了中国移动的支付SDK，然后进入游戏，在商城中选择某个充值项后，游戏确实也打开了手机话费的充值界面，这样一来就有`90%`的把握确定游戏是接入的移动支付。
　　然后，在百度中搜索`“移动mm支付sdk”`可以搜索到[ 中国移动应用内计费SDK ](http://dev.10086.cn/cmdn/bbs/thread-80671-1-1.html)，从帖子中的截图来看，这和《消灭星星》中弹出的支付界面十分相似，那么现在我们有`98%`的把握确定游戏是接入的移动支付。
　　接着，我们下载这个移动支付的SDK，打开`Demo\src\com\aspire\demo\Demo.java`文件，找一下支付相关的代码，发现了支付时所执行的代码为`purchase.order(context, mPaycode, listener);`，我们从这行代码中提取出两个关键词`Purchase`和`order`。
　　接着，把《消灭星星》的`apk`给反编译了，并把`smali`文件夹放入到`Eclipse`中，全文搜索这两个关键字，虽然搜索出来的内容不少，但是能和`order(context, mPaycode, listener)`对上号的却没有。
　　但是，从已到的信息来看，游戏很大可能是使用了移动MM支付，但是我们却搜不到支付相关的代码，现在好像是没头绪了，然后笔者无意识的退出游戏，再次重新进入时发现闪屏页变化成了`百度移动游戏`。

<br>**百度移动游戏SDK！**
　　既然获取到了新线索，那现在就去搜索`百度移动游戏SDK`，然后就找到了[ Android单机SDK ](http://dev.mgame.baidu.com/yyjr/djsdk)。
　　下载完毕后打开`doc\百度移动游戏SDK（单机版）接入API参考手册_支付模块.doc`，我们找到了一个名为`invokePayCenterActivity`支付接口，然后全文搜索它，结果找到了我们想要的代码。
　　从搜索结果中我们可以确定，《消灭星星》接入了百度移动游戏SDK，而在百度SDK中又接入了移动支付的SDK，我们的任务就是搞掉百度的支付SDK就可以了。

　　经过一番比较，我们猜测`PopStarxiaomiexingxingguan_401\smali\com\brianbaek\popstar\popStarA$1.smali`第`245`行（由于`ApkTool`的版本不同，你反编译出来的代码行数可能和笔者不同，请以下面的代码为准）是支付代码。
``` smali
    invoke-virtual/range {v0 .. v6}, Lcom/duoku/platform/single/DKPlatform;->invokePayCenterActivity(Landroid/content/Context;Lcom/duoku/platform/single/item/GamePropsInfo;Lcom/duoku/platform/single/item/DKCMMdoData;Lcom/duoku/platform/single/item/DKCMMMData;Lcom/duoku/platform/single/item/DKCMGBData;Lcom/duoku/platform/single/callback/IDKSDKCallBack;)V
```
　　为了验证猜测，将那行代码替换为我们万能的`HelloWorld`：
``` smali
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
    const-string v1, "*********************************** Hello World22"
    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V
```
　　然后打包、签名、运行，从运行的结果可以看到，我们的猜测是正确的。

<br>**支付成功后的代码**
　　继续查看`百度移动游戏SDK`的文档，发现在调用支付接口时，第6个参数是一个名为`IDKSDKCallBack`回调接口，用来接收支付的结果。
　　然后，我们通过`popStarA$1.smali`第`239`行代码得知，支付函数的第六个参数（即`v6`）是`com/brianbaek/popstar/popStarA$1$4;`类型的，因此我们现在就去该文件中找一找线索。

　　整体查看一遍`popStarA$1$4;`后，猜测对我们有用的代码应该在`onResponse`方法中，然后再经历一些连蒙带猜，定位出第`66`和`107`行是支付完成后，通知游戏进行后续操作的代码，它们分别表示`支付失败`（值为0）和`支付成功`（值为1）。

　　为了验证猜测，我们把下面的代码替换到`popStarA$1.smali`第`245`行上：
``` smali
    const/4 v3, 0x1

    invoke-static {v3}, Lcom/zplay/iap/ZplayJNI;->sendMessage(I)V
```
　　然后打包、签名、运行，从运行的结果可以看到，每当我们点击支付时，会立刻增加幸运星的个数。

### 替换支付SDK ###
　　在上一节中已经找到了游戏的支付相关的代码，那么破解后的游戏的支付流程应为：

	-  首先，用户点击支付按钮。
	-  然后，游戏调用我们的支付SDK进行支付。
	-  接着，依据我们的SDK的支付结果来控制游戏是否发放游戏币。

<br>　　通常，各平台（支付宝、微信等）的支付SDK会以一个`lib`项目的形式提供给开发者，且`lib`项目中会包含一些`drawable`、`style`、`layout`等资源，因此如果我们想把它们的SDK插入到某个`apk`中，则必须得把SDK中的`drawable`等也同时插入进去。

　　这此时就有一个问题，任何存在于`res`目录里的资源都是有`资源id`的，因此在破解时，我们除了要把支付SDK`res`目录下的资源文件复制到待破解的apk里外，还需要为它们创建资源id，否则在程序中是无法引用的。

　　问：那既然要添加资源id，我们总不能手工修改项目的`R`文件，挨个的为每个资源添加资源id吧？
　　答：我们可以创建一个辅助项目，把游戏和我们SDK的资源都放到它里面去，让Eclipse帮我们生成资源id，然后再把这个辅助项目的apk给反编译出来，获取到其中的`R`文件即可。

　　接下来以《消灭星星》为例，来介绍如何向apk中添加自己的SDK。

<br>**创建辅助项目**

　　第一步，创建一个新的Android项目，名为`XmxxDecode`，项目的包名要与游戏的包名相同，此处我们设置为`com.wpd.game.popstar`。
　　第二步，删除`XmxxDecode`项目中的以下内容：

	-  MainActivity.java
	-  res下的所有文件
	-  libs下的所有文件(如android-support-v4.jar)

　　第三步，将反编译出来的《消灭星星》的`res`目录的所有文件复制到`XmxxDecode`的`res`目录下。
　　第四步，删除`XmxxDecode\res\values\public.xml`文件，该文件是反编译时生成的，具体用法请自行搜索。
　　第五步，假设我们要插入到游戏中的SDK项目叫做`PaySDK`，则让`XmxxDecode`去引用`PaySDK`项目。
　　第六步，如果`PaySDK`除了提供了`lib`项目外，还提供了`jar`包让开发者接入，那么就把`jar`包复制到`XmxxDecode\libs`目录下。

<br>**将辅助项目合并到游戏中**
　　第一步，运行`XmxxDecode`项目。虽然不会成功，但是会生成一个apk，接着将`bin\XmxxDecode.apk`复制出来，反编译。
　　第二步，把在`XmxxDecode\smali`下的所有文件覆盖到`PopStarxiaomiexingxingguan_401\smali`目录下。
　　第三步，把在`XmxxDecode\res`下的所有文件覆盖到`PopStarxiaomiexingxingguan_401\res`目录下。
　　第四步，把接入`PaySDK`时所需要的权限、组件等都复制到`PopStarxiaomiexingxingguan_401\AndroidManifest.xml`中。
　　第五步，将`PopStarxiaomiexingxingguan_401`文件夹打包、签名。

　　不出意外的话，程序运行将一切正常，但事实上我们已经把`PaySDK`的资源和代码都给插入到apk中了，剩下的就是调用它们了。

<br>**调用我们的支付SDK**
　　第一步，找到`popStarA$1.smali`第`245`行，把它删掉，然后改成调用我们的支付接口。如果不会写调用语句，可以按照前面那样先在Android中写一遍然后反编译。
　　第二步，当支付有结果时，调用游戏的代码，通知游戏是否增加游戏币。

　　这里有个小的技术难点：如果Android通知游戏发放游戏币的接口是静态的，那么在我们的支付SDK中可以直接调用它，但是如果是实例的，则在支付SDK中就得想办法获取该接口的一个对象了。不过这都问题不大，稍微想想就可以解决。

<br><br>
　　







