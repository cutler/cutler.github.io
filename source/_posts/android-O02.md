title: 实战篇　第二章 Android Studio
date: 2015-4-15 21:44:35
categories: Android开发 - 青铜
---
　　`Android Studio`是谷歌推出的一个Android开发环境，基于`IntelliJ IDEA`。

# 第一节 基础入门 #

　　在`Google 2013`年`I/O`大会上，`Android Studio`这款开发工具被首次公布。

<br>**架构组成**
　　在`IntelliJ IDEA`的基础上，`Android Studio`提供：

	-  基于Gradle的构建支持
	-  Android专属的重构和快速修复
	-  提示工具以捕获性能、可用性、版本兼容性等问题
	-  支持ProGuard和应用签名
	-  基于模板的向导来生成常用的Android应用设计和组件
	-  功能强大的布局编辑器，可以让你拖拉UI控件并进行效果预览

<br>**中文社区**
　　[Android Studio 中文组](http://android-studio.org/index.php)，是2013年5月16日筹办，5月21号上线的`Android Studio`中文社区网站，对`Android Studio`的安装，配置，调试，`BUG`提交等问题进行经验交流和总结； 中文组还承载着对`Android Studio`进行汉化和教程编写的工作，为中文开发者提供了本地支持！

<br>**为何使用AndroidStudio？**
　　以上介绍都是从百度百科中摘抄过来的，猛地一看，没看懂多少，说的太空泛了。
　　笔者也是被大势所趋，在`2015年4月14日 夜`，突然顿悟，看透天机，明白使用`Android Studio`开发才是正道，未来Android推出的新技术，势必会完全向`Android Studio`靠拢，而不会是`Eclipse`（开源社区越来越偏向`Android Studio`了）。
　　因而在`Android Studio`发布`1.1.0`版本时，笔者决定开始接触它。

　　`Android Studio`中文组在`2015年6月28日`发表了一篇文章，也表明了Google未来的态度：

	-  为了简化Android的开发力度，Google决定将重点建设Android Studio工具，并会在今年年底停止支持其他集成开发环境，比如Eclipse。

<br>　　环境搭建的步骤很简单，网上很容易就可以搜到，笔者不再冗述。

## HelloWorld ##
　　环境搭建完毕后，我们接下来就开始创建一个名为`HelloWorld`的项目，然后运行它。
　　项目创建的具体过程，可以参阅：[《使用Android Studio开发Android APP》](http://blog.csdn.net/u014450015/article/details/46534567)，笔者就不再冗述了，主要是因为要截很多图，太占博客的空间了。

　　进入到`Android Studio`后，你会看到如下界面（可能和你的有点不同，但是不影响）：

<center>
![](/img/android/android_o04_01.jpg)
</center>

　　右面的那一个红框里的按钮，都是我们常用的功能键，比如第二个和第三个分别是`运行`和`Debug`，倒数第二个和倒数第一个分别是，`SDK Manager`和`Android Device Monitor`（即原来Eclipse中的`DDMS`视图）。
　　左面的那一个红框里的按钮，用来切换项目的展示方式，常用的一共有三种：`Project`、`Packages`、`Android`，它们的区别请自行查看，开发的时候都是用`Android`。

<br>**运行项目**
　　首先要做的是打开`Android Device Monitor`窗口，创建一个模拟器，或者连接真机。

　　假设项目的包名为`com.cutler.helloworld`，然后点击上面说的`运行按钮`（绿色的三角）后，你可能会遇到这个错误：
``` c
Installing com.cutler.helloworld
DEVICE SHELL COMMAND: pm install -r "/data/local/tmp/com.cutler.helloworld"
pkg: /data/local/tmp/com.cutler.helloworld
Failure [INSTALL_FAILED_OLDER_SDK]
```
　　这是因为项目的`minSdkVersion`属性设置的高于设备的`Api Level`版本号。
　　按照以前的思路，应该去`AndroidManifest.xml`文件里修改这个值，但是现在在清单文件中却找不到`<uses-sdk>`标签了。

	-  事实上，使用Android Studio创建的Android项目的目录结构已经和Eclipse创建的不一样了。
	-  现在我们需要进入到一个名为build.gradle的文件中修改。
	-  即下图中的build.gradle(Module:app)，把里面的minSdkVersion 21改为minSdkVersion 8即可。

<center>
![](/img/android/android_o04_02.png)
</center>

<br>**Poject 与 Module**
　　在 Android Studio 中，一个`Project`对应一个`Studio`窗口，如果想打开多个`Project`，那么就得打开多个`Studio`窗口。

　　通常，一个完整的`Project`是由一个主项目+若干`library`项目组成的：

	-  AS提出了Module的概念，上面说的主项目、library项目都被称为一个Module，即一个Project由多个Module组成。
	-  每一个Module需要有属于自己的build.gradle文件。
	-  build.gradle文件包含了一些很重要的内容，比如所支持的安卓版本和项目依赖的东西等。
　　此时应该就能明白，刚才为什么要修改上面的`build.gradle(Module:app)`文件了。

<br>**删除项目**
　　本文使用的是`Android Studio 1.2.2`版本，在该版本中没法很方便的删除一个项目，有位道友折腾了半天也没找到好的方法，他折腾的过程请参见[《Android studio删除工程项目》](http://www.cnblogs.com/smiler/p/3854816.html) 。 
　　笔者找到一个相对省事的方法：首先把 Android Studio 给关掉，然后去本地直接删掉项目的目录即可。

<br>**本节参考阅读：**
- [百度百科 - Android Studio](http://baike.baidu.com/view/10600831.htm)
- [Android Studio vs Eclipse：你需要知道的那些事](http://mobile.51cto.com/abased-434702.htm)

## API Level ##
　　考虑到有的读者可能不清楚项目的`编译版本`和`最低运行版本`之间的区别，特此增加这一节专门介绍一下`API Level`相关的知识。

　　Android平台提供了一套框架API，使得应用程序可以与系统底层进行交互。该框架API由以下模块组成：

	-  一组核心的包和类。
	-  清单(manifest)文件的XML元素和属性声明。
	-  资源文件的XML元素和属性声明及访问形式。
	-  各类意图(Intents)。
	-  应用程序可以请求的各类授权，以及系统中包含的授权执行。
　　每个版本的Android操作系统以及其提供的框架`API`，都被指定一个`整数`标识符，称为`API Level`。以`Android1.0`系统为例，它的`API`的版本号是`1`，这个数字被保存在操作系统内部，之后Android系统版本的`API Level`依次递增`1`。
``` c
操作系统             API等级          操作系统             API等级
Android1.0	        1            Android1.1              2
Android1.5	        3            Android1.6              4
Android2.0	        5            Android2.0.1            6
Android2.1.x	        7            Android2.2.x            8
Android2.3,2.3.x       	9            Android2.3.x            10
Android3.0.x	        11           Android3.1.x            12
Android3.2              13           Android4.0,4.0.x        14
Android4.0.3,4.0.4      15           Android4.1,4.1.x        16
Android4.2,4.2.2	17
```

<br>**minSdkVersion**
　　开发程序之前，为了保证程序正确的运行，需要设置App所支持最低`API Level`（`minSdkVersion`）。
　　当项目设置了`minSdkVersion`后，在用户准备安装这个项目生成的`apk`到手机等Android设备前，操作系统会检查该`apk`所支持的`minSdkVersion`是否和系统内部的`API Level`匹配，当且仅当小于或等于系统中保存的`API Level`时，才会继续安装此程序，否则将不允许安装。

　　警告：

	-  如果你不声明minSdkVersion属性，系统会假设一个默认值“1”，这意味着您的应用程序兼容所有版本的Android。
	-  如果您的应用程序不兼容所有版本(例如，它使用了API级别3中的接口)并且你没有设置minSdkVersion的值，那么当安装在一个API级别小于3的系统中时，应用程序在运行，并且执行到了调用Android1.5（API级别3级）的API的那句代码时，就会崩溃，即试图访问不可用API(但是程序的其他没有调用该API的地方可以正常运行)。出于这个原因，一定要申报相应的API级别在minSdkVersion属性。

<br>**targetSdkVersion**
　　标明应用程序目标`API Level`的一个整数。如果不设置，默认值和`minSdkVersion`相同。
　　这个属性通知系统，你已经针对这个指定的目标版本测试过你的程序，系统不必再使用兼容模式来让你的应用程序正常运行在这个目标版本。

　　比如：

	-  从Android 3.0开始，在绘制View的时候支持硬件加速，充分利用GPU的特性，使得绘制更加平滑（会多消耗一些内存）。
	-  若是将targetSdkVersion设置为11或以上，则系统会默认使用硬件加速来绘制，但Android3.0之前版本提供的某些绘图API，在硬件加速下进行绘制时，会抛异常。
	-  若是将targetSdkVersion设置为10或以下，则系统不会使用硬件加速。
	-  因此，除非你充分测试了，否则不要把targetSdkVersion设置的过高。

<br>**compileSdkVersion**
　　项目的编译版本（`compileSdkVersion`）和`android:minSdkVersion`属性的值：

	-  compileSdkVersion是指编译当前项目时所使用的SDK平台的版本。
	-  minSdkVersion属性则是限定了当前项目只能安装在大于等于其指定API等级的设备上。

	-  也就是说，我们可以将项目的compileSdkVersion设置为17，而minSdkVersion属性的值则仅为8 。 
	-  只要保证在项目中不去调用API等级8中所未提供的API，那么使用API等级17编译出来的项目依然会正常运行在Android2.2的设备上。

<br>　　问：为什么要把项目的编译版本提高呢?
　　答：它可以让我们的应用程序，既可以使用高版本Android系统中所提供的新功能，同时又能完美的运行在低版本的系统中。以`holo`主题为例，众所周知`holo`主题是`Android3.0`之后的系统中的一个非常大的亮点。如果可以实现“当应用程序运行在3.0之前的系统时使用一般的主题，而运行在3.0之后的系统时则使用holo主题”那可就太好了。

<br>　　范例1：使用`Holo`主题（`res\values-v11\styles.xml`）。
``` xml
<!-- For API level 11 or later, the Holo theme is available and we prefer that. -->
<style name="ThemeHolo" parent="android:Theme.Holo">
</style>
```
　　如果项目的当前编译版本低于`3.0`则`Android Studio`就会报错。
　　因为在编译`styles.xml`时，会依据项目的编译版本，去SDK的安装目录下查找其所依赖的资源，若未找到则就报错： 
``` java
SDK\platforms\android-8\data\res\values
```
　　其中`“android-8”`与项目的编译版本相对应。

　　提示：

	-  当程序运行的时候，系统会检测当前设备的API Level，若大于等于11则使用values-v11目录下的styles.xml，否则则使用values目录下的。
	-  高版本Andrdoid平台的框架API与早期版本兼容，即新版本的Android平台大多数都是新增功能，和引进新的或替代的功能。
	-  对于API的升级，会将老版本的标记为已过时，但不会从新版本中删除，因此现有的应用程序仍然可以使用它们。在极少数情况下，部分旧版本的API可能被修改或删除，通常这种变化是为了保障API的稳定性及应用程序或系统的安全。

# 第二节 Gradle #
　　新增的`Gradle`将会是你转到`Android Studio`上最大的障碍，和`Maven`一样，`Gradle`只是提供了构建项目的一个框架，真正起作用的是`Plugin`。

　　如果你不知道什么是`构建工具`、`Maven`，那么请参看笔者的另一篇文章[《实战篇　第一章 Maven》](http://cutler.github.io/android-O01/)。
　　笔者将本节的内容，定位为`“了解”`，也就是说你不需要记住下面所有的知识，只要能看懂范例、理解思路即可。

## 概述 ##
　　`Gradle`是以`Groovy`语言为基础的，面向Java应用为主的`构建工具`，它同时继承了`Ant`和`Maven`二者的优点。

　　`Groovy`是Java平台上设计的面向对象编程语言，它的特点：

	-  这门动态语言拥有类似Python、Ruby和Smalltalk中的一些特性，可以作为Java平台的脚本语言使用。
	-  它的语法与Java非常相似，以至于多数的Java代码也是正确的Groovy代码。
	-  Groovy代码动态的被编译器转换成Java字节码。
	-  由于其运行在JVM上的特性，Groovy可以使用其他Java语言编写的库。

　　下面是来自于 http://Groovy.CodeHaus.org 的一个例子程序：
``` gradle
class Foo {
    doSomething() {
        data = ["name": "James", "location": "London"]
        for (e in data) {
            println("entry ${e.key} is ${e.value}")
        }
    }
 
    closureExample(collection) {
        collection.each { println("value ${it}") }
    }
 
    static void main(args) {
        values = [1, 2, 3, "abc"]
        foo = new Foo()
        foo.closureExample(values)
        foo.doSomething()
    }
}
```

<br>**JVM生态圈三大构建工具**

　　最初只有`Make`一种构建工具，后来其发展为`GNU Make`，当今JVM生态圈由三大构建工具所统治：

	-  Apache Ant带着Ivy
	-  Maven
	-  Gradel

　　软件行业新旧交替的速度之快往往令人咂舌，不用多少时间，你就会发现曾经大红大紫的技术已经成为了昨日黄花，当然，`Maven`也不会例外。虽然目前它仍然是`Java`构建的事实标准，但我们也能看到新兴的工具在涌现，比如`Gradle`。

<br>　　Ant

	-  介绍：Ant是第一个“现代”构建工具，在很多方面它有些像Make。发布于2000年，在很短时间内成为Java项目上最流行的构建工具。在最初的版本之后，逐渐具备了支持插件的功能。
	-  优点（但不限于）：主要优点在于对构建过程的控制上。随着通过网络进行依赖管理成为必备功能，Ant采用了Apache Ivy。
	-  缺点：用XML作为脚本编写格式。本质上是层次化的，并不能很好地贴合Ant过程化编程的初衷。除非是很小的项目，否则它的XML文件很快就大得无法管理。
	
<br>　　Maven

	-  介绍：Maven发布于2004年。目的是解决码农使用Ant所带来的一些问题。
	-  优点（但不限于）：
	   -  天生具备从网络上自动下载依赖的能力（Ant后来通过Ivy也具备了这个功能）。
	   -  由于Maven的缺省构建规则有较高的可重用性，所以常常用两三行Maven构建脚本就可以构建简单的项目，而使用Ant则需要十几行。
	-  缺点：
	   -  仍然用XML作为脚本编写格式。在大型项目中，它经常什么“特别的”事还没干就有几百行代码。
	   -  正是由于Maven的构建规则的可重用性，导致用Maven很难写出复杂、定制化的构建脚本，甚至不如Ant。

<br>　　Gradle

	-  Gradle结合了前两者的优点，在此基础之上做了很多改进，它既有Ant的强大和灵活，又有Maven的依赖管理。
	-  Gradle不用XML，它使用基于Groovy的专门的DSL，从而使Gradle构建脚本变得比用Ant和Maven写的要简洁清晰。Gradle样板文件的代码很少，这是因为它的DSL被设计用于解决特定的问题：贯穿软件的生命周期，从编译，到静态检查，到测试，直到打包和部署。
	-  Gradle的成就可以概括为：约定好，灵活性也高。 

　　推荐阅读：[《Java构建工具：Ant vs Maven vs Gradle》](http://blog.csdn.net/napolunyishi/article/details/39345995) 与 [《Gradle, 基于DSL的新一代Java构建工具》](http://www.blogjava.net/wldandan/archive/2012/06/26/381532.html)。

<br>　　当我们成功运行完`HelloWorld`项目后，为了更好的使用`Android Studio`进行开发工作，会不可避免的对`build.gradle`文件的语法产生好奇。 
　　接下来笔者将会介绍编写`Gradle`构建脚本的基础知识（虽然一般情况下几乎用不到它们）。
　　为了理论结合实践，接下来我们要安装一下`Gradle`，这样就能一边写代码一边测试了。

<br>**本节参考阅读：**
- [维基百科 - Gradle](http://zh.wikipedia.org/zh-cn/Gradle)
- [维基百科 - Groovy](http://zh.wikipedia.org/zh-cn/Groovy)
- [Android Studio 简介及导入 jar 包和第三方开源库方法](http://drakeet.me/android-studio)
- [Maven实战（六）——Gradle，构建工具的未来？](http://www.infoq.com/cn/news/2011/04/xxb-maven-6-gradle)


## 环境搭建 ##

　　首先，前往官方下载界面下载`Gradle`安装包，下载地址为：https://gradle.org/downloads/ ，本节将以`2.2.1`版本为例讲解`Gradle`的用法。

　　官方安装教程：http://gradle.org/docs/current/userguide/installation.html 。

<br>　　前提条件：

	-  Gradle需要安装1.6及以上版本的Java JDK或JRE。
	-  Gradle拥有自己的Groovy库，因此不需要另行安装Groovy。

<br>　　环境变量

	-  第一，下载完毕后解压缩，然后添加GRADLE_HOME/bin到你的PATH环境变量。比如：F:\apps\gradle-2.2.1\bin。
	-  第二，通过输入gradle -v检查Gradle是否安装正常。
	   -  如果安装正确的话会输出Gradle版本和一些本地环境配置（Groovy，Java虚拟机版本，操作系统等等）。

## 构建脚本基础 ##
　　我们对项目进行编译、运行单元测试、生成文档、打包和部署等烦琐且不起眼的工作，都可以说是在对项目进行`构建`。

　　`Gradle`里的构建是基于`task`的：

	-  一个task代表一个具体的任务，它可能是编译一些classes，创建一个jar，生成javadoc等。

<br>**HelloWorld**
　　首先，我们先来创建一个名为`gradleTest`的空文件夹。
　　然后，要知道Gradle与Maven、Ant一样，有一个核心的构建文件，名为`build.gradle`，整个构建的过程都是从它开始的。

<br>　　范例1：将如下代码放入到`build.gradle`中。
``` gradle
task hello {
    doLast {
        println 'Hello world!'
    }
}
```
    语句解释：
    -  首先，我们在脚本中创建了一个名为hello的task。
    -  然后，每一个task中可以有多个代码块（使用{}括起来），这些代码块被称为action。
    -  接着，task使用一个队列来管理它所有的action。当task被执行的时候，按照先后顺序依次执行每个action。
    -  最后，代码块是没有名字的，我们使用doLast关键字来将一个action放到task的队列的队尾。

<br>　　接着，我们创建完毕`gradleTest/build.gradle`后，就可以使用`gradle task名称`命令来启动构建了。
``` gradle
gradle -q hello
```
    语句解释：
    -  这里需要注意两点：
       -  由于我们是在Windows命令行中执行这个脚本，因此build.gradle必须是ANSI编码，别用UTF-8编码，否则编译会出错。
       -  gradle命令后面跟着的是task的名称，而不是文件的名称。
    -  本节之后的绝大多数范例会在命令里加入-q，加上它之后就不会生成Gradle的日志信息，所以用户只能看到task的输出。当然也可以不加它。

<br>　　范例2：快捷的任务定义。
``` gradle
task hello << {
    println "Hello world!!"
}
```
    语句解释：
    -  与前面的例子比较，doLast 被替换成了 <<，它们有一样的功能，但看上去更加简洁了。
    -  字符串既可以用单引号也可以用双引号。

<br>　　上面把HelloWorld范例介绍完了，下面就介绍如果构建Java项目。

## 构建Java项目 ##
　　在正式讲解如何使用`Gradle`构建Java项目之前，先来介绍一下`“插件”`的概念。

<br>**插件**
　　`Gradle`与`Maven`类似，它的很多功能（编译、测试、部署）都是通过插件（`Plugin`）来完成的。简单的说，插件就是一组`task`的集合，我们所说的使用某个插件，实际上就是在使用插件中的`task`。`Gradle`装载了许多插件，针对不同类型的项目、不同的需求，你可以使用不同的插件，比如`java插件`、`android插件`等。你也可以编写自己的插件并和其他开发者分享它。

　　插件是`基于合约`的，这意味着插件给项目的许多方面定义了默认的值（如存放项目源文件的目录叫什么）。如果你在项目里遵从这些合约，你通常不需要在你的构建脚本里加入太多东西。如果你不想要或者是你不能遵循合约，`Gradle`允许你自己定制你的项目。

<br>**开始构建**
　　让我们来看一个简单的例子，先创建一个名为`HelloWorld`目录，然后创建`HelloWorld\build.gradle`，接着在`build.gradle`中加入下面的代码来使用Java插件：
``` gradle
// 我们可以使用“apply plugin: '插件名称'”的格式来引入一个插件。
apply plugin: 'java'
```
    语句解释：
    -  我们此时就可以直接运行“gradle -q build”命令了，其中build任务就是Java插件提供的。
    -  对于Java项目来说，它构建完成后最终会生成一个jar文件，里面包含了你创建的类。
    -  如果一切顺利，Java插件会在HellWorld目录创建一个名为“build”的目录，用来存放编译生成的文件。只不过由于我们目录下除了build.gradle外什么都没有，所以使用Java插件生成的jar里面不会有任何类文件。

<br>　　Java插件有如下几个默认的事情：

	-  从 src/main/java 搜索并编译你的Java源代码。
	-  从 src/test/java 搜索你的测试代码。
	-  任何在 src/main/resources 的文件都将被包含在 JAR 文件里。
	-  任何在 src/test/resources 的文件会被加入到 classpath 中以运行测试代码。
	-  所有的输出文件将会被创建在build里。如：JAR 文件 存放在 build/libs 文件夹里。

<br>　　我们接下来创建`HelloWorld\src\main\java\Demo1.java`，内容如下：
``` android
public class Demo1 {
    public static void main(String[] args) {
        System.out.println("Hello World from Java!");
    }
}
```
　　然后再执行`gradle -q build`，此时生成的jar里就会包含我们的`Demo1.class`了。 

　　在继续向下讲解之前，我们先插播个小的知识点。

<br>**Java插件有哪些构件任务？**
　　你可以使用`gradle tasks`来列出项目的所有任务（包括Java插件中的任务）。
　　虽然Java插件在你的项目里加入了许多任务，但通常你只会用到其中的一小部分任务。最常用的任务是`build`，它会构建你的项目，当你运行`gradle build`命令时，Gradle 将编译和测试你的代码, 并且创建一个包含类和资源的`JAR`文件。

　　其余一些有用的任务是：

	-  clean：删除build生成的目录和所有生成的文件。
	-  assemble：编译并打包你的代码，但是并不运行单元测试。
	-  check：编译并测试你的代码。

<br>**定制项目**
　　我们接着刚才的步骤，当我们生成出一个jar包之后，就可以执行它了，以此来验证这个包是否正确。 我们可以通过下面的代码来执行一个jar包：
``` gradle
java -jar ./build/libs/HelloWorld.jar
```
　　但是执行这条命令的时候，却得到一个错误：

	./build/libs/HelloWorld.jar中没有主清单属性

　　问题出在，我们没有在`manifest`文件中配置`Jar`文件的`主类`。

　　Java插件给项目加入了一些属性，这些属性已经被定义了默认的值，已经足够来开始构建项目了。如果你认为不合适，改变它们的值也是很简单的。比如我们可以通过下面的代码来为`jar`设置主类：
``` gradle
apply plugin: 'java'

// 定义一个变量，保存主类的名称
def mainClassName = 'Demo1'

// 下面定义一个名为jar的方法，如果方法没有参数，则可以省写括号。
// jar方法里面包含要传给Java插件的参数，Java插件会自动来读取它们。
jar {
    manifest {
        attributes 'Main-Class': mainClassName , 'CustomAttributes': 'Hi Attributes'
    }
}
```
    语句解释：
    -  Main-Class属性就是用来指明主类的，由于我们的主类没有放到任何包里，所以本范例中直接写的类名。
    -  其中CustomAttributes是我们自定义的，对于manifest来说，任何自定义的属性都会被原样写到文件中。

<br>　　此时我们再执行一下`jar`包，就可以得到我们想要的结果了。

<br>
### 外部的依赖 ###
　　在现实生活中，要创造一个没有任何`外部依赖`（使用外部`jar`）的应用程序并非不可能，但也是极具挑战的。这也是为什么依赖管理对于每个软件项目都是至关重要的一部分。

　　笔者推荐阅读：[《Gradle入门系列（3）：依赖管理》](http://blog.jobbole.com/72992/) ，本节中的大部分内容参考自该文章。

<br>**仓库**
　　本质上说，仓库是一种存放依赖的容器，每一个项目都具备一个或多个仓库。
　　类似于`Maven`的仓库，仓库可以被用来提取依赖，或者放入一个依赖，或者两者皆可。当`Gradle`需要引用依赖时就会自动去仓库中查找这个依赖（`jar`、`so`等都是依赖）。

　　Gradle支持以下仓库格式：

	-  Ivy仓库
	-  Maven仓库
	-  Flat directory仓库

<br>　　以`Maven`仓库为例，我们可以通过`URL`地址或本地文件系统地址，将`Maven`仓库加入到我们的构建中。如果想通过`URL`地址添加一个`Maven`仓库，我们可以将以下代码片段加入到`build.gradle`文件中：
``` gradle
repositories {
    maven {
        url "http://maven.petrikainulainen.net/repo"
    }
}
```

　　如果想通过本地文件系统地址添加一个`Maven`仓库，我们可以将以下代码片段加入到`build.gradle`文件中：
``` gradle
repositories {
    maven {       
        url "../maven-repo"
    }
}
```

<br>　　在加入`Maven`仓库时，`Gradle`提供了三种“别名”供我们使用，它们分别是：

	-  mavenCentral()别名，表示依赖是从Central Maven 2 仓库中获取的。
	-  jcenter()别名，表示依赖是从Bintary’s JCenter Maven 仓库中获取的。
	-  mavenLocal()别名，表示依赖是从本地的Maven仓库中获取的。

　　如果我们想要将`Central Maven 2`仓库加入到构建中，我们必须在`build.gradle`文件中加入以下代码片段：
``` gradle
repositories {
    mavenCentral()
}
```

<br>**配置中的依赖分类**
　　Gradle会对依赖进行分组，比如：编译Java时使用的是这组依赖，运行Java时又可以使用另一组依赖。我们把每一组依赖都称为一个`“DependencyGroup”`。

　　Java插件指定了若干依赖配置项，其描述如下：

	-  compile      配置项中包含的依赖在当前项目的源代码被编译时是必须的。
	-  runtime      配置项中包含的依赖在运行时是必须的。
	-  testCompile  配置项中包含的依赖在编译项目的测试代码时是必须的。
	-  testRuntime  配置项中包含的依赖在运行测试代码时是必须的。
	-  archives     配置项中包含项目生成的文件（如Jar文件）。
	-  default      配置项中包含运行时必须的依赖。

<br>**配置依赖**
　　一个外部依赖可以由以下属性指定：

	-  group属性指定依赖的分组（在Maven中，就是groupId）。
	-  name属性指定依赖的名称（在Maven中，就是artifactId）。
	-  version属性指定外部依赖的版本（在Maven中，就是version）。

　　我们假设我们需要指定以下依赖：

	-  依赖的分组是foo。
	-  依赖的名称是foo。
	-  依赖的版本是0.1。
	-  在项目编译时需要这些依赖。

　　我们可以将以下代码片段加入到`build.gradle`中，进行依赖声明：
``` gradle
dependencies {
    compile group: 'foo', name: 'foo', version: '0.1'
}
```
　　我们也可以采用一种快捷方式声明依赖：`[group]:[name]:[version]`。如果我们想用这种方式，我们可以将以下代码段加入到`build.gradle`中：
``` gradle
dependencies {
    compile 'foo:foo:0.1'
}
```

<br>
### Pinyin4j ###
　　`Pinyin4j`是一个流行的Java库，支持中文字符和拼音之间的转换，拼音输出格式可以定制。

　　现在，继续完善我们之前的项目，在`build.gradle`文件中加入对`Pinyin4j`的依赖，在里面添加如下内容：
``` gradle
repositories {
    // Gradle会从Maven的中央仓库(http://search.maven.org/#browse)中查找依赖。
    mavenCentral()
}

dependencies {
    compile group: 'com.belerweb', name: 'pinyin4j', version: '2.5.0'
    testCompile group: 'junit', name: 'junit', version: '4.+'
}
```
　　然后，修改`Demo1`类的代码为：
``` java
import net.sourceforge.pinyin4j.*;
public class Demo1{
    public static void main(String[] args) {
        System.out.println("Hello World from Java!");

        // 由于汉字有不少多音字，因此返回值是一个String[]类型的。
        String[] pinyin = PinyinHelper.toHanyuPinyinStringArray('重');
        for(String item : pinyin){
            System.out.println(item);
        }
    }
}
```
　　然后编译并运行生成的`jar`文件，你可能会得到如下的一个异常：
``` java
Exception in thread "main" java.lang.NoClassDefFoundError: net/sourceforge/pinyi
n4j/PinyinHelper
        at Demo1.main(Demo1.java:6)
Caused by: java.lang.ClassNotFoundException: net.sourceforge.pinyin4j.PinyinHelp
er
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.misc.Launcher$AppClassLoader.loadClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        ... 1 more

```
　　抛出异常的原因是，当我们运行程序时，`Pinyin4j`的依赖在`classpath`中没有找到。
　　解决这个问题最简单的方式是创建一个所谓的`“胖”jar`文件，即把所有程序运行所需的依赖都打包到`jar`文件中去。
``` gradle
apply plugin: 'java'

// 定义一个变量，保存主类的名称
def mainClassName = 'Demo1'

// 下面是要传给Java插件的参数，Java插件会自动来读取它们。
jar {
    manifest {
	    attributes 'Main-Class': mainClassName , 'CustomAttributes': 'Hi Attributes'
    }
    // 创建胖jar
    from { configurations.compile.collect { it.isDirectory() ? it : zipTree(it) } }
}

// 添加maven仓库。
repositories {
    mavenCentral()
}

// Gradle会对依赖进行分组，比如：编译Java时使用的是这组依赖，运行Java时又可以使用另一组依赖。
// 每一组依赖称为一个“DependencyGroup”。
dependencies {
    compile group: 'com.belerweb', name: 'pinyin4j', version: '2.5.0'
    testCompile group: 'junit', name: 'junit', version: '4.+'
}
```

## 构建多个项目 ##
　　在实际开发中，一个完整的项目可能是由一个根项目（root project）和若干个子项目（subject project）构成的。

　　要创建多`Project`的`Gradle`项目，我们首先需要在根中加入名为`settings.gradle`的配置文件，该文件应该包含各个子项目的名称。比如，我们有一个根项目名为`root-project`，它包含有两个子项目，名字分别为`sub-project1`和`sub-project2`，此时对应的文件目录结构如下：
``` c
root-project/
   sub-project1/
      build.gradle
   sub-project2/
      build.gradle
build.gradle
settings.gradle
```

　　根项目本身也有自己的`build.gradle`文件，同时它还拥有`settings.gradle`文件位于和`build.gradle`相同的目录下。此外，两个子项目也拥有它们自己的`build.gradle`文件。

<br>　　要将`sub-project1`和`sub-project2`加入到`root-project`中，我们需要在`settings.gradle`中加入：
``` gradle
include 'sub-project1', 'sub-project2'
```

<br>**通用配置**
　　在Gradle中，我们可以通过根项目的`allprojects()`方法将配置一次性地应用于所有的子项目，当然也包括定义Task。比如，在根项目的`build.gradle`中，我们可以做以下定义：
``` gradle
allprojects {
    repositories {
        jcenter()
    }
}
```

　　除了`allprojects()`之外，根项目还提供了`subprojects()`方法用于配置所有的子项目（不包含根项目）。


<br>**本节参考阅读：**
- [从零开始学习Gradle之一---初识Gradle](http://www.blogjava.net/wldandan/archive/2012/06/27/381605.html)
- [Gradle User Guide 中文版](http://dongchuan.gitbooks.io/gradle-user-guide-/content/index.html)
- [Gradle学习系列之八——构建多个Project](http://www.cnblogs.com/CloudTeng/p/3418425.html)


# 第三节 Android应用 #
　　从本节开始，我们将以Android项目为例，介绍`Gradle`相关的技术的用法。

　　经过前面章节的学习，我们再回过头去看网上那些教程，就能很好的理解了，其中写的比较好的（这个列表会不定期更新）有如下几个：

- [Android Studio系列教程四--Gradle基础](http://stormzhang.com/devtools/2014/12/18/android-studio-tutorial4/)
- [IDEA 及 Gradle 使用总结](http://www.jiechic.com/archives/the-idea-and-gradle-use-summary)

## build.gradle ##
　　本节介绍一下Android项目的`build.gradle`中的各种配置的含义。
``` gradle
// 使用android插件构建项目。
apply plugin: 'com.android.application'

// 创建一个名为android的方法，该方法由android插件调用。
android {
    // 项目的编译版本。
    compileSdkVersion 21
    buildToolsVersion "21.1.2"

    // 项目的基本信息，见名知意，也是不多说！
    defaultConfig {
        applicationId "com.cutler.helloworld"
        minSdkVersion 8
        targetSdkVersion 21
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            // 是否进行混淆
            minifyEnabled false
            // 混淆文件的位置。由这个文件来控制哪些代码需要混淆，哪些不需要。
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    // 设置module的libs目录为jar文件的查找目录。
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
```

## 从Eclipse迁移老项目 ##

　　既然是从Eclipse迁移老项目，那么我们首先要做的就是在`Android Studio`中配置`SVN`。

<br>**配置SVN**
　　`Android Studio`配`SVN`比普通IDE复杂点，它需要电脑里有独立的SVN客户端，我们可以到[ TortoiseSVN官网 ](http://tortoisesvn.net/downloads.html)上下载。
　　`Android Studio`会使用到`TortoiseSVN`的`“command line client tools”`，但是由于在安装`TortoiseSVN`时，默认是不安装这个工具的，因而即便是你已经安装了`TortoiseSVN`，仍然需要卸载了重新装。

<center>
![安装时，选择第一项即可](/img/android/android_o04_03.png)
</center>

　　安装完成后，执行如下步骤：

	-  首先，打开Android Studio，找到的 File > Settings > Version Control > Subversion。
	-  然后，在“Genneral”选项卡下，勾选“Use command line client”，并选择你svn的安装路径下的bin\svn.exe。
	   -  比如：D:\workspace\programe\tortoiseSVN1.8.11\bin\svn.exe 。
	-  接着，点击ok即可。

　　如果你想从SVN上检出代码，可以这么做：点击`“VCS”`菜单，然后点击`“Checkout from Version Control > Subversion”`即可。

<br>**无痛将Eclipse项目导入Andriod Studio**
　　如果你导入的是一个Eclipse项目，那么`Android Studio`会自动将它转换成`Android Studio`项目。

　　具体会按照如下步骤执行：

	-  首先，点击“File > New > Import Project”。
	-  然后，选择转换后的项目，所要保存的路径。
	-  接着，保持默认设置，点击“Finish”。
	-  最后，等待Studio自己完成转换过程。

　　导入Eclipse格式的项目后，你可能会遇到`“Android Manifest doesn't exists or has incorrect root tag”`的错误，解决的方式是点击下图所示的按钮：

<center>
![Sync project with Gradle files](/img/android/android_o04_04.png)
</center>

　　如果你没有找到这个按钮，请参看 [Android Studio: Android Manifest doesn't exists or has incorrect root tag](http://stackoverflow.com/questions/17424135/android-studio-android-manifest-doesnt-exists-or-has-incorrect-root-tag) 。


　　如果你是通过向导来导入项目的，那么请选择下图所示的`Import project (Eclipse ADT, Gradle, etc.)`：

<center>
![](/img/android/android_o04_05.png)
</center>

<br>**快捷键设置**
　　在开发方面`Android Studio`确实是比`Eclipse`好用，但是之前使用`Eclipse`的时间还是比较长的，所以很多快捷键还是比较习惯`Eclipse`的，`Android Studio`的快捷键其实是可以设置成`Eclipse`的快捷键的，很方便。
　　更改的过程为：`File > Settings > Keymap`，然后将`Keymaps`的值设置为`Eclipse`即可。

　　如果你希望在`copy`一段代码到你的类中时，`Android Studio`能自动帮你导入对应的类，那么你可以参看下面这个网页：
　　[What is the shortcut to Auto import all in Android Studio?](http://stackoverflow.com/questions/16615038/what-is-the-shortcut-to-auto-import-all-in-android-studio)

<br>**修改Logcat字体颜色**
　　`Android Studio`的`Logcat`的字体颜色，默认全是黑色看着很不舒服，我们可以修改它：

	-  首先，File > Settings > Editor > Colors &Fonts > Android Logcat 。
	-  然后，就可以修改Verbose、Info、Debug、Warning、Error、Assert等选项了。
	   -  第一，取消勾选 Inherit Attributes From 。
	   -  第二，勾选Foreground前的复选框选上。
	   -  第三，双击Foreground后面的框框去选择颜色了。

　　如果你对修改之后的`Logcat`的显示效果仍然不满意，那么可以使用我们前面一开始提到的`“Android Device Monitor”`窗口。

<br>**编译缓慢**
　　不出意外的话，我们在使用`Android Studio`时会感觉很卡，稍微干点什么事情就得等半天，导致卡的原因有如下两个：

	-  电脑软硬件问题。比如用的是32位的xp系统、内存容量不足、CPU型号老旧等。
	-  网络问题。Gradle在构建项目时会自动联网查找依赖，如果它访问的网站被墙或者你的网速缓慢，就会导致构建项目的时间变长。
	
　　在排除电脑操作系统、内存等问题之后，如果你使用`Android Studio`编译、运行一个`HelloWorld`程序仍然很慢（可能消耗几十秒），那么你可以按照下面的方法修改试试。

　　[点击阅读：Building and running app via Gradle and Android Studio is slower than via Eclipse](http://stackoverflow.com/questions/16775197/building-and-running-app-via-gradle-and-android-studio-is-slower-than-via-eclips)

　　笔者认为导致`Android Studio`卡的最主要原因就是网络问题，可以按照下图所示的操作，把`Offline work`勾上，即将`Gradle`切换到离线工作模式。

<center>
![](/img/android/android_o04_06.png)
</center>

　　当设置为离线模式后，在项目进行`build`时`Gradle`只会从本地查找依赖，若本地没有缓存过那个的库，则将会导致`build`失败。也就是说，之前`build`速度很慢，是因为`Gradle`去网上查找依赖了。

　　所以为了提高`build`的速度，有两个方法：

	-  配置一个靠谱的代理，让Gradle尽情的去网上查吧。
	-  每当build.gradle文件发生变化时，启用在线模式，把依赖下载到本地之后，再次启动离线模式。



<br>**本节参考阅读：**
- [Android Studio 关于SVN的相关配置简介](http://blog.csdn.net/zhouzme/article/details/22790395)
- [Android Studio 快捷键设置为Eclipse的快捷键](http://www.chenwg.com/android/android-studio%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%AE%BE%E7%BD%AE%E4%B8%BAeclipse%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE.html)
- [Android Studio 如果修改LogCat的颜色，默认全是黑色看着挺不舒服的](http://blog.csdn.net/hotlinhao/article/details/9150519)

## 引入类库 ##
<br>　　前面也说了，实际开发中我们很难写出一个完全不引用第三方类库的项目，因此本节就介绍一下如何在`Android Studio`中引用各种第三方类库。

<br>**依赖本地jar文件**
　　首先，打开 [Chinese to Pinyin](http://sourceforge.net/projects/pinyin4j/files/) 将`Pinyin4j`的`jar`包下载到本地。
　　然后，把`jar`包放入到要使用这个`jar`的`Module`下的`libs`目录下。比如`MainProject\app\libs`。
　　接着，光把`pinyin4j-2.5.0.jar`添加到`libs`目录下还不够，还得再配置一下，即告诉`IDE`当前项目在编译的时候需要也同时编译这个`jar`包。 不过这个配置的过程我们可以省略屌，因为在`app`的`build.gradle`文件中默认就存在了下面的代码：
``` gradle
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
```
　　最后，必须得再点击下图所示的按钮，就可以正常使用它了：

<center>
![Sync project with Gradle files](/img/android/android_o04_04.png)
</center>

　　相当于让`Android Studio`重新更新一下项目。

<br>**依赖仓库中的jar文件**
　　就像前面说的那样，除了可以从本地添加依赖外，我们还可以直接从中央仓库中依赖一个`jar`包。
``` gradle
dependencies {
    compile 'com.belerweb:pinyin4j:2.5.0'
}
```
　　同样的，每次修改完毕`build.gradle`文件后，都要执行一下`Sync project with Gradle files`。

<br>**依赖项目的其他Moudle**
　　我们已经知道一个项目中包含若干个`Module`，可以通过修改项目根目录下的`settings.gradle`文件中的设置，来让编译时同时编译多个项目。但这只是编译过程，如果`ModuleA`想引用`ModuleB`中的类，那么还得需要在`ModuleA`的`build.gradle`文件中进行配置。

　　比如我们新建一个`Library Module`，步骤为：`File > New > New Module... > Android Library`，需要注意的是，此种方法创建出来的`Module`的`build.gradle`文件的内容有些不同：

	-  首先，编译的插件变成了com.android.library。
	   -  普通Module的编译插件是com.android.application。
	-  然后，defaultConfig中没有applicationId属性。
	   -  作为一个Library Module是不需要这个属性的，项目的包名应该由主Module设置。

　　创建完之后，还得在`主调Module`的`build.gradle`文件中引用`被调Module`，代码如下：
``` gradle
dependencies {
    // moduleb就是被调module的名字
    compile project(':moduleb')
}
```
　　配置完毕之后，就可以在`主调Module`中引用`moduleb`所提供的类了。
　　同样的，每次修改完毕`build.gradle`文件后，都要执行一下`Sync project with Gradle files`。


<br>**本节参考阅读：**
- [How to import android project as library and NOT compile it as apk (Android studio 1.0)](http://stackoverflow.com/questions/27536491/how-to-import-android-project-as-library-and-not-compile-it-as-apk-android-stud)


<br><br>
