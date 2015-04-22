title: 实战篇　第四章 Android Studio
date: 2015-4-15 21:44:35
create: 2015-4-15 21:44:35
categories: Android
---
　　`Android Studio`是谷歌推出的一个Android开发环境，基于`IntelliJ IDEA`。类似`Eclipse ADT`， `Android Studio`提供了集成的Android开发工具用于开发和调试。

# 第一节 基础应用 #

　　在`Google 2013`年`I/O`大会上，`Android Studio`这款开发工具被首次公布，这也是为了方便开发者基于Android开发，目前已经更新到`1.1.0`版本。`Studio`首先解决的一个问题是多分辨率。Android设备拥有大量不同尺寸的屏幕和分辨率，使用`Studio`开发者可以在编写程序的同时看到自己的应用在不同尺寸屏幕中的样子。

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

<br>　　以上是从百度百科中摘抄过来的介绍，猛地一看，没看懂多少，说的太空泛了。
　　笔者也是被大势所趋，在`2015年4月14日 夜`，突然顿悟，看透天机，明白使用`Android Studio`开发才是正道，未来Android推出的新技术，势必会完全向`Android Studio`靠拢，而不会是`Eclipse`，（开源社区都越来越偏向`Android Studio`了）。因而在`Android Studio`发布`1.1.0`版本时，笔者决定开始接触它了。接下来我们从环境搭建开始，一步步的揭开`Android Studio`的面纱。

## 环境搭建 ##
　　第一步，从官方下载界面中下载 [AndroidStudio](https://developer.android.com/sdk/index.html) ，本节将以Mac为例，讲解搭建过程。
　　第二步，下载完毕后，双击打开，显示的是经典的Mac安装界面，直接将应用图表拖近`Applications`目录就可以了。
　　第三步，开始安装时会询问你：`“You can import your settings from a previous version of Android Studio”`，由于我们是第一次安装，因此选择第二项 `“I do not ……”`即可。

　　不出意外的话，此时你会遇到第一个问题，`Studio`会卡在`“fetching Android sdk compoment information”`上面，这其实是去获取`android sdk`组件信息，这个过程相当慢（视你的网速而定），甚至是加载失败，进而导致`Studio`启动不起来。之所以这么慢是因为`Google`被墙掉了。同时由于是第一次启动`Studio`，因而`Studio`在获取完毕组件信息后，还会去下载一些东西（可以帮我们省很多事，所以尽量让它去下载），所以这个问题必须解决。
　　解决这个问题，只需要配置一个代理服务器即可，具体步骤请参阅：[《关于红杏的公益代理，Android Studio以及freso的编译》](http://www.liaohuqiu.net/cn/posts/about-red-apricot-and-compiling-fresco/) 。（这里帮他们打个广告，笔者是个懒人，能花小钱搞定的事情，绝对不想去花费时间和精力，红杏让我可以用最简单的方式翻墙，所以我很干脆就掏钱了，:）。

## HelloWorld ##
　　环境搭建完毕后，我们接下来就开始创建一个名为`HelloWorld`的项目，然后运行它。
　　项目创建的具体过程，可以参阅：[《Android Studio for Mac初体验》](http://blog.csdn.net/keyboardota/article/details/8937384)，笔者就不再冗述了，主要是因为要截很多图，太占博客的空间了。

　　进入到`Android Studio`后，你会看到如下界面：

<center>
![](/img/android/android_d03_01.jpg)
</center>

　　上面的那一个红框里的按钮，都是我们常用的功能键，比如第二个和第三个分别是`运行`和`Debug`，倒数第二个和倒数第一个分别是，`SDK Manager`和`Android Device Monitor`（即原来Eclipse中的`DDMS`视图）。
　　下面的那一个红框里的按钮，用来切换项目的展示方式，一共有三种：`Project`、`Packages`、`Android`，它们的区别请自行查看，比较常用的展示方式是`Android`。

<br>**运行项目**
　　项目创建完毕后，接下来我们就要运行它了。 首先要做的是打开`Android Device Monitor`窗口，创建一个模拟器，或者连接真机。

　　假设我们的项目的包名为`com.cutler.helloworld`，然后点击上面说的`运行`（绿色的三角）按钮后，你可能会遇到这个错误：
``` c
Installing com.cutler.helloworld
DEVICE SHELL COMMAND: pm install -r "/data/local/tmp/com.cutler.helloworld"
pkg: /data/local/tmp/com.cutler.helloworld
Failure [INSTALL_FAILED_OLDER_SDK]
```
　　这是因为项目的`minSdkVersion`属性设置的高于设备的SDK版本号。按照以前的思路，我们应该去`AndroidManifest.xml`文件里修改这个值，但是我们在`AndroidManifest.xml`中却找不到`<uses-sdk>`标签了。

　　事实上，使用	`Android Studio`创建的Android项目的`目录结构`已经和Eclipse创建的不一样了，现在我们需要进入到一个名为`build.gradle`的文件中修改，即下图中的`build.gradle(Module:app)`，把里面的`minSdkVersion 21`改为`minSdkVersion 8`即可。

<center>
![](/img/android/android_d03_02.png)
</center>

<br>**Poject 与 Module**
　　在`Android Studio`中，仍然存在工作空间的概念，但是`Studio`不再像`Eclipse`那样可以同时将工作空间的中所有项目导入到程序中，而是一个`Project`对应一个`Android Studio`窗口，如果想打开多个`Project`，那么只能打开多个`Studio`窗口了。
　　我们都知道，在实际开发中可能会用到第三方提供的`Android library`项目，因而一个完整的项目是由一个主项目+若干library项目组成的。`Android Studio`提出了`Module`的概念，`Module`就是指的一个具体的项目，我们刚才说的`主项目`、`library项目`都被称为一个`Module`，即`一个Project由多个Module组成`。

　　每一个`Module`需要有属于自己的`Gradle build file`（当你新建一个`Module`时会自动帮你生成的，当你导入一个Eclipse的项目时需自己创建）。这些`Gradle`文件包含了一些很重要的内容，比如所支持的安卓版本和项目依赖的东西，以及安卓项目中其它重要的数据。
　　这样一来，我们就能明白为什么要修改上面的`build.gradle(Module:app)`文件了。

<br>**删除项目**
　　本文使用的是`Android Studio 1.1.0`版本，在该版本中没法很方便的删除一个项目，有位道友折腾了半天也没找到好的方法，他折腾的过程请参见[《Android studio删除工程项目》](http://www.cnblogs.com/smiler/p/3854816.html) 。 
　　笔者找到一个相对省事的方法，以Mac为例：

	-  首先，右键你的Module并点击“Reveal in Finder”，打开本地文件夹。
	-  然后，通过快捷键“command + Q”来退出Android Studio。
	-  接着，把Module所在的Project的目录，整个删除。
	-  最后，启动Android Studio即可。

<br>**本节参考阅读：**
- [百度百科 - Android Studio](http://baike.baidu.com/view/10600831.htm)
- [Android Studio vs Eclipse：你需要知道的那些事](http://mobile.51cto.com/abased-434702.htm)

# 第二节 Gradle #
　　新增的`Gradle`将会是你转到`Android Studio`上最大的障碍，和`Maven`一样，`Gradle`只是提供了构建项目的一个框架，真正起作用的是`Plugin`。如果你不知道什么是`构建工具`、`Maven`，那么请参看笔者的另一篇文章《实战篇　第三章 Maven》。

## 概述 ##
<br>**是什么？**
　　`Gradle`是以`Groovy`语言为基础，面向`Java`应用为主的`自动化构建工具`。它同时继承了`Apache Ant`和`Apache Maven`二者的优点。
　　当前`Gradle`仅可以用来构建使用`Java`、`Groovy`和`Scala`语言编写的项目，计划未来将支持更多的语言。

<br>**Groovy**
　　`Groovy`是`Java`平台上设计的面向对象编程语言。这门动态语言拥有类似`Python`、`Ruby`和`Smalltalk`中的一些特性，可以作为`Java`平台的`脚本语言`使用。它的语法与`Java`非常相似，以至于多数的`Java`代码也是正确的`Groovy`代码。`Groovy`代码动态的被编译器转换成`Java字节码`。由于其运行在`JVM`上的特性，`Groovy`可以使用其他`Java`语言编写的库。

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
　　最初只有`Make`一种构建工具，后来其发展为`GNU Make`。由于需求的不断涌现，码农的世界里逐渐演化出了千奇百怪的构建工具。当前，JVM生态圈由三大构建工具所统治：

	-  Apache Ant带着Ivy
	-  Maven
	-  Gradel

　　软件行业新旧交替的速度之快往往令人咂舌，不用多少时间，你就会发现曾经大红大紫的技术已经成为了昨日黄花，当然，`Maven`也不会例外。虽然目前它仍然是`Java`构建的事实标准，但我们也能看到新兴的工具在涌现，比如基于`Groovy`的`Gradle`。

<br>**三大构建工具优缺点**

<br>　　Ant with Ivy

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

<br>　　**Gradle**
　　`Gradle`结合了前两者的优点，在此基础之上做了很多改进，它既有`Ant`的强大和灵活，又有`Maven`的依赖管理。
　　`Gradle`不用`XML`，它使用基于`Groovy`的专门的`DSL`，从而使`Gradle`构建脚本变得比用`Ant`和`Maven`写的要简洁清晰。`Gradle`样板文件的代码很少，这是因为它的`DSL`被设计用于解决特定的问题：贯穿软件的生命周期，从编译，到静态检查，到测试，直到打包和部署。
　　`Gradle`的成就可以概括为：约定好，灵活性也高。 

　　推荐阅读：[《Java构建工具：Ant vs Maven vs Gradle》](http://blog.csdn.net/napolunyishi/article/details/39345995) 与 [《Gradle, 基于DSL的新一代Java构建工具》](http://www.blogjava.net/wldandan/archive/2012/06/26/381532.html)。

<br>**本节参考阅读：**
- [维基百科 - Gradle](http://zh.wikipedia.org/zh-cn/Gradle)
- [维基百科 - Groovy](http://zh.wikipedia.org/zh-cn/Groovy)
- [Android Studio 简介及导入 jar 包和第三方开源库方法](http://drakeet.me/android-studio)
- [Maven实战（六）——Gradle，构建工具的未来？](http://www.infoq.com/cn/news/2011/04/xxb-maven-6-gradle)


## 环境搭建 ##
　　首先，前往官方下载界面下载`Gradle`安装包，下载地址为：https://gradle.org/downloads/ ，本节将以`2.2.1`版本为例讲解`Gradle`的用法。

　　官方安装教程：http://gradle.org/docs/current/userguide/installation.html 。

<br>**前提条件**
　　`Gradle`需要安装`1.6`及以上版本的`Java JDK`或`JRE`。它拥有自己的`Groovy`库，因此不需要另行安装`Groovy`。任何已安装的`Groovy`都会被`Gradle`给忽略。

<br>**环境变量**
　　下载完毕后，解压缩，然后添加`GRADLE_HOME/bin`到你的`PATH`环境变量。比如：`F:\apps\gradle-2.2.1\bin`。
　　然后，你可以通过输入`gradle -v`检查`Gradle`是否安装正常。如果安装正确的话会输出`Gradle`版本和一些本地环境配置（`Groovy`，`Java`虚拟机版本，操作系统等等）。

## 构建脚本基础 ##
<br>**Projects 和 tasks**
　　`Gradle`里的任何东西都是基于这两个基础概念：`projects`（项目）、`tasks`（任务）。

　　我们每天对项目进行编译、运行单元测试、生成文档、打包和部署等烦琐且不起眼的工作，都可以说是在对项目进行`构建`。
　　使用Gradle构建时，可以同时构建一个或多个`project`，一个project到底代表什么依赖于你想用Gradle做什么。举个例子，一个project可以代表一个`JAR`或者一个网页应用。它也可能代表一个发布的`ZIP`压缩包，这个ZIP可能是由许多其他项目的`JARs`构成的。但是一个project不一定非要代表被构建的某个东西。它可以代表一件要做的事，比如部署你的应用。
　　`每一个project是由一个或多个tasks构成的`。一个`task`代表一些更加细化的构建。它可能是编译一些`classes`，创建一个`JAR`，生成`javadoc`，或者生成某个目录的压缩文件。

### HelloWorld ###
　　首先，我们先来创建一个名为`gradleTest`的空文件夹。
　　然后，要知道Gradle与Maven、Ant一样，有一个核心的构建文件，名为`build.gradle`，整个构建的过程都是从它开始的。
　　接着，我们创建完毕`gradleTest/build.gradle`后，就可以使用`gradle`命令来启动构建了。



<br>**本节参考阅读：**
- [从零开始学习Gradle之一---初识Gradle](http://www.blogjava.net/wldandan/archive/2012/06/27/381605.html)
- [Gradle User Guide 中文版](http://dongchuan.gitbooks.io/gradle-user-guide-/content/index.html)

<br><br>
