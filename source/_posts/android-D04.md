title: 实战篇　第四章 Android Studio
date: 2015-4-15 21:44:35
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
　　笔者也是被大势所趋，在`2015年4月14日 夜`，突然顿悟，看透天机，明白使用`Android Studio`开发才是正道，未来Android推出的新技术，势必会完全向`Android Studio`靠拢，而不会是`Eclipse`，（开源社区也都越来越偏向`Android Studio`了）。因而在`Android Studio`发布`1.1.0`版本时，笔者决定开始接触它了。接下来我们从环境搭建开始，一步步的揭开`Android Studio`的面纱。

## 环境搭建 ##
　　第一步，从官方下载界面中下载 [AndroidStudio](https://developer.android.com/sdk/index.html) ，本节将以Mac为例，讲解搭建过程。
　　第二步，下载完毕后，双击打开，显示的是经典的Mac安装界面，直接将应用图表拖近`Applications`目录就可以了。
　　第三步，开始安装时会询问你：`“You can import your settings from a previous version of Android Studio”`，由于我们是第一次安装，因此选择第二项 `“I do not ……”`即可。

　　不出意外的话，此时你会遇到第一个问题，`Studio`会卡在`“fetching Android sdk compoment information”`上面，这其实是去获取`android sdk`组件信息，这个过程相当慢（视你的网速而定），甚至是加载失败，进而导致`Studio`启动不起来。之所以这么慢是因为`Google`被墙掉了。同时由于是第一次启动`Studio`，因而`Studio`在获取完毕组件信息后，还会去下载一些东西（可以帮我们省很多事，所以尽量让它去下载），所以这个问题必须解决。
　　解决这个问题，只需要配置一个代理服务器即可，具体步骤请参阅：[《关于红杏的公益代理，Android Studio以及freso的编译》](http://www.liaohuqiu.net/cn/posts/about-red-apricot-and-compiling-fresco/) 。（这里帮红杏打个广告，笔者是个懒人，能花小钱搞定的事情，绝对不想去花费时间和精力，红杏让我可以用最简单的方式翻墙，所以我很干脆就掏钱了，:）。

<br>**Windows平台**
　　如果你是在Windows平台，可以这么做：

	-  首先，到android studio安装目录，打开bin目录，编辑idea.properties, 在文件末尾添加：
	   -  disable.android.first.run=true 这将禁用第一次运行。
	-  然后，打开android studio，在File > Settings > HTTP Proxy settings设置代理相关参数，关闭android studio。
	-  最后，再次打开idea.properties文件，删除刚刚添加的disable.android.first.run=true，并重新打开studio。

## HelloWorld ##
　　环境搭建完毕后，我们接下来就开始创建一个名为`HelloWorld`的项目，然后运行它。
　　项目创建的具体过程，可以参阅：[《Android Studio for Mac初体验》](http://blog.csdn.net/keyboardota/article/details/8937384)，笔者就不再冗述了，主要是因为要截很多图，太占博客的空间了。

　　进入到`Android Studio`后，你会看到如下界面：

<center>
![](/img/android/android_d04_01.jpg)
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
　　这是因为项目的`minSdkVersion`属性设置的高于设备的`Api Level`版本号。按照以前的思路，我们应该去`AndroidManifest.xml`文件里修改这个值，但是现在我们在`AndroidManifest.xml`中却找不到`<uses-sdk>`标签了。

　　事实上，使用	`Android Studio`创建的Android项目的`目录结构`已经和Eclipse创建的不一样了，现在我们需要进入到一个名为`build.gradle`的文件中修改，即下图中的`build.gradle(Module:app)`，把里面的`minSdkVersion 21`改为`minSdkVersion 8`即可。

<center>
![](/img/android/android_d04_02.png)
</center>

<br>**Poject 与 Module**
　　在`Android Studio`中，不再存在工作空间的概念了（但创建项目时可以设置保存的位置），也不再像`Eclipse`那样可以同时将工作空间的中所有项目导入到程序中，而是一个`Project`对应一个`Studio`窗口，如果想打开多个`Project`，那么只能打开多个`Studio`窗口。
　　我们都知道，在实际开发中可能会用到第三方提供的`Android library`项目，因而一个完整的项目是由一个主项目+若干`library`项目组成的。`Android Studio`提出了`Module`的概念，`Module`就是指的一个具体的项目，我们刚才说的`主项目`、`library项目`都被称为一个`Module`，即`一个Project由多个Module组成`。

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
　　笔者将本节的内容，定位为`“了解”`，也就是说你不需要记住下面所有的知识，只要能看懂范例、理解思路即可。

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
<br>
### HelloWorld ###
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
    -  本节之后的内容绝大多数的范例会在命令里加入-q，加上它之后就不会生成Gradle的日志信息，所以用户只能看到tasks的输出。当然也可以不加它。

<br>　　范例2：快捷的任务定义。
``` gradle
task hello << {
    println "Hello world!!"
}
```
    语句解释：
    -  与前面的例子比较，doLast 被替换成了 <<，它们有一样的功能，但看上去更加简洁了。
    -  字符串既可以用单引号也可以用双引号。
<br>
### 构建脚本代码 ###
　　Gradle 的构建脚本展示了 Groovy 的所有能力。作为开胃菜，来看看这个：

<br>　　范例1：字符串连接与函数调用。
``` gradle
task upper << {
    String someString = 'mY_nAmE'
    println "Original: " + someString
    println "Upper case: " + someString.toUpperCase()
    println "Length: " + someString.length()
}
```
　　程序输出：

	E:\gradleTest>gradle -q upper
	Original: mY_nAmE
	Upper case: MY_NAME
	Length: 7

<br>　　范例2：循环语句与判断语句。
``` gradle
task count << {
    4.times { 
        if("$it" < 3){
            print "$it " 
        } else {
            println "$it " 
        }
    }
}
```
    语句解释：
    -  本范例会循环4次，前三次只会打印出数字，最后一次打印完数字后，会接着打印一个换行符。
    -  it是迭代变量的默认名称，后面我们会介绍如何修改迭代变量的名称。

<br>
### 任务 ###
　　就像你所猜想的那样，你可以声明任务之间的依赖关系、定义动态任务等。

<br>　　范例1：申明任务之间的依赖关系。
``` gradle
task hello << {
    println 'Hello world!'
}

task intro(dependsOn: hello) << {
    println "I'm Gradle"
}
```
　　程序输出：

	E:\gradleTest>gradle -q intro
	Hello world!
	I'm Gradle

　　由于`intro`依赖于`hello`，所以执行`intro`的时候`hello`命令会被优先执行来作为启动`intro`任务的条件。

<br>　　范例2：其他的任务还没有存在。
``` gradle
task taskX(dependsOn: 'taskY') << {
    println 'taskX'
}
task taskY << {
    println 'taskY'
}
```
　　程序输出：

	E:\gradleTest>gradle -q taskX
	taskY
	taskX

　　在加入一个依赖之前，这个依赖的任务不需要提前定义，`taskX`到`taskY`的依赖在`taskY`被定义之前就已经声明了。这一点对于我们之后讲到的多任务构建是非常重要的。

<br>　　范例3：动态的创建一个任务。
``` gradle
4.times { counter ->
    task "task$counter" << {
        println "I'm task number $counter"
    }
}
```
    语句解释：
    -  本范例通过循环语句动态的创建了4个task。
    -  我们可以自定义循环语句的迭代变量的名称，本范例中迭代变量的名字为counter，引用迭代变量是使用 "$变量名"，注意要有引号。
       -  循环次数.times{迭代变量 -> 循环体}
    -  事实上，我们在命令行中执行“gradle -q hello”命令时，Grale做了如下两步操作：
       -  第一，从当前目录下查找build.gradle文件，然后从该文件第一行代码开始扫描执行。
       -  第二，等一切都结束后，再开始执行hello任务。这意味着我们可以直接“gradle -q”命令，后面不需要跟随一个task。
　　程序输出：

	E:\gradleTest>gradle -q task2
	I'm task number 2

<br>　　范例4：通过API访问一个任务 - 加入一个依赖。
``` gradle
// 先动态创建4个task
4.times { counter ->
    task "task$counter" << {
        println "I'm task number $counter"
    }
}
// 由于Gradle从上到下执行,因此会在创建完毕任务后,让task0依赖task2、task3
task0.dependsOn task2, task3
```
    语句解释：
    -  当任务创建之后, 它可以通过API来访问。
　　程序输出：

	E:\gradleTest>gradle -q task0
	I'm task number 2
	I'm task number 3
	I'm task number 0

<br>　　范例5：通过API访问一个任务 - 加入行为。
``` gradle
// 创建一个task，并在队列尾部添加一个action
task hello << {
    println 'Hello Earth'
}
// 在队列首部添加一个action
hello.doFirst {
    println 'Hello Venus'
}
// 在队列尾部添加一个action
hello.doLast {
    println 'Hello Mars'
}
// 在队列尾部添加一个action
hello << {
    println 'Hello Jupiter'
}
```
    语句解释：
    -  doFirst 和 doLast 可以被执行许多次。他们分别可以在任务动作列表的开始和结束加入动作。当任务执行的时候，在动作列表里的动作将被按顺序执行。这里第四个行为中 << 操作符是 doLast 的简单别称。
　　程序输出：

	E:\gradleTest>gradle -q hello
	Hello Venus
	Hello Earth
	Hello Mars
	Hello Jupiter

<br>　　正如同你已经在之前的示例里看到，有一个短标记`$`可以访问一个存在的任务。也就是说每个任务都可以作为构建脚本的属性：

<br>　　范例6：当成构建脚本的属性来访问一个任务。
``` gradle
task hello << {
    println 'Hello world!'
}
hello.doLast {
    println "Greetings from the $hello.name task."
}
```
    语句解释：
    -  这里的name是任务的默认属性，代表当前任务的名称。
    -  这使得代码易于读取，特别是当使用了由插件（如编译）提供的任务时尤其如此。
　　程序输出：

	E:\gradleTest>gradle -q hello
	Hello world!
	Greetings from the hello task.

<br>　　范例7：给任务加入自定义属性。
``` gradle
task boy << {
    ext.age = "17"
}
boy.doLast {
    println boy.name + " age is " + boy.age
}
```
    语句解释：
    -  给任务加自定义属性是没有限制的。
    -  如果不是在一个字符串中引用属性，则可以去掉$符号。
　　程序输出：

	E:\gradleTest>gradle -q boy
	boy age is 17

<br>　　范例8：创建一个方法。
``` gradle
task listFile << {
    // 首先，调用_doFistFile()方法，并传递一个路径过去。
    // 然后，在返回的File[]对象上，调用each()方法进行遍历，迭代变量的名称为file。
    _doFistFile('E:/gradleTest').each {File file ->
        println "I'm fond of $file.name"
    }
}
// 此处定义了一个方法。
File[] _doFistFile(String dir) {
    // 调用API获取文件列表，注意不会列出文件夹。 看不懂也没关系，我们主要的目的是了解。
    file(dir).listFiles({file -> file.isFile() } as FileFilter).sort()
}
```
　　程序输出：

	E:\gradleTest>gradle -q listFile
	I'm fond of build.gradle
	I'm fond of gradle

<br>　　范例9：定义默认任务。
``` gradle
// 定义默认执行的任务，此行代码放在任何地方都可以，不一定要放在第一行。
// 它等价于 gradle clean run ，即我们可以同时运行多个task，task之间使用空格间隔。
defaultTasks 'clean', 'run'

task clean << {
    println 'Default Cleaning!'
}

task run << {
    println 'Default Running!'
}

task other << {
    println "I'm not a default task!"
}

```
    语句解释：
    -  在一个多项目构建中，每一个子项目都可以有它特别的默认任务。如果一个子项目没有特别的默认任务，父项目的默认任务将会被执行。
　　程序输出：

	E:\gradleTest>gradle -q
	Default Cleaning!
	Default Running!

<br>
### 通过DAG配置 ###
　　`Gradle`有一个配置阶段和执行阶段，在配置阶段后，`Gradle`将会知道应执行的所有任务。`Gradle`为你提供一个`"钩子"`（即回调），以便利用这些信息。举个例子，判断发布的任务是否在要被执行的任务当中。根据这一点，你可以给一些变量指定不同的值。

<br>　　范例1：根据选择的任务产生不同的输出。
``` gradle
task distribution << {
    println "We build the zip with version=$version"
}

task release(dependsOn: 'distribution') << {
    println 'We release now'
}
// 通过gradle.taskGraph.whenReady来设置回调，回调方法接收一个名为taskGraph的参数。
gradle.taskGraph.whenReady {taskGraph ->
    // 如果release任务将会被执行，则版本号设定为1.0 。
    if (taskGraph.hasTask(release)) {
        version = '1.0'
    } else {
        version = '1.0-SNAPSHOT'
    }
}
```
    语句解释：
    -  回调函数将优先于任何task执行，因此在distribution被执行之前，version变量已经存在且有值了。
　　程序输出：

	E:\gradleTest>gradle -q distribution
	We build the zip with version=1.0-SNAPSHOT
	E:\gradleTest>gradle -q release
	We build the zip with version=1.0
	We release now

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
　　类似于`Maven`的仓库，仓库可以被用来提取依赖，或者放入一个依赖，或者两者皆可。当`Gradle`需要引用依赖时就会自动去仓库中查找这个依赖。

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
　　我们也可以在同一个配置项中加入多个依赖，传统的方式如下：
``` gradle
dependencies {
    compile (
        [group: 'foo', name: 'foo', version: '0.1'],
        [group: 'bar', name: 'bar', version: '0.1']
    )
}
```
　　如果采用快捷方式，那可以是这样：
``` gradle
dependencies {
    compile 'foo:foo:0.1', 'bar:bar:0.1'
}
```
　　自然地，声明属于不同配置项的依赖也是可以的。比如说，如果我们想要声明属于`compile`和`testCompile`配置项的依赖，可以这么做：
``` gradle
dependencies {
    compile group: 'foo', name: 'foo', version: '0.1'
    testCompile group: 'test', name: 'test', version: '0.1'
}
```
　　同样的，给力的快捷方式又来了：
``` gradle
dependencies {
    compile 'foo:foo:0.1'
    testCompile 'test:test:0.1'
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

## 基础知识 ##
<br>
### build.gradle ###
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
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
```

<br>　　在`build.gradle`中，Android项目可以依赖三种类型的`libs`库：
``` gradle
// 第一种，依赖jar文件。 我们将jar文件放到module\libs目录下，然后在build.gradle中进行配置：
compile files('libs/something_local.jar')            // 依赖单个jar文件。
compile fileTree(dir: 'libs', include: ['*.jar'])    // 依赖libs目录下的所有jar文件。

// 第二种，依赖仓库中的支持包（目前很多好的都在maven进行管理，比如 v4，v7支持包）。
compile 'com.android.support:appcompat-v7:22.0.0'

// 第三种，依赖当前项目中的其他library module。
compile project(':jiechic-library')
```
　　值得注意的是，当你添加完依赖时，记得执行`Tools -> Android -> Sync Project with Gradle Files`。

<br>
### API Level ###
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

　　提示：

	-  高版本Andrdoid平台的框架API与早期版本兼容，即新版本的Android平台大多数都是新增功能，和引进新的或替代的功能。
	-  对于API的升级，会将老版本的标记为已过时，但不会从新版本中删除，因此现有的应用程序仍然可以使用它们。在极少数情况下，部分旧版本的API可能被修改或删除，通常这种变化是为了保障API的稳定性及应用程序或系统的安全。

<br>**minSdkVersion**
　　开发程序之前，为了保证程序正确的运行，需要设置App所支持最低`API Level`（`minSdkVersion`）。
　　当项目设置了`minSdkVersion`后，在用户准备安装这个项目生成的`apk`到手机等Android设备前，操作系统会检查该`apk`所支持的`minSdkVersion`是否和系统内部的`API Level`匹配，当且仅当小于或等于系统中保存的`API Level`时，才会继续安装此程序，否则将不允许安装。

　　警告：

	-  如果你不声明minSdkVersion属性，系统会假设一个默认值“1”，这意味着您的应用程序兼容所有版本的Android。
	-  如果您的应用程序不兼容所有版本(例如，它使用了API级别3中的接口)并且你没有设置minSdkVersion的值，那么当安装在一个API级别小于3的系统中时，应用程序在运行，并且执行到了调用Android1.5（API级别3级）的API的那句代码时，就会崩溃，即试图访问不可用API(但是程序的其他没有调用该API的地方可以正常运行)。出于这个原因，一定要申报相应的API级别在minSdkVersion属性。
	-  例如，android.appwidget类包是在API级别3中开始引入的。如果一个应用程序使用了这个API，就必须通过指明minSdkVersion属性为3来声明运行的最低要求。于是，该应用程序就可以在Android 1.5、Android 1.6 (API级别4级)等平台上安装，但是在Android 1.1 (API级别2级)和 Android 1.0 平台(API级别1级)上却是无法安装的。

<br>**targetSdkVersion**
　　标明应用程序目标`API Level`的一个整数。如果不设置，默认值和`minSdkVersion`相同。
　　这个属性通知系统，你已经针对这个指定的目标版本测试过你的程序，系统不必再使用兼容模式来让你的应用程序向前兼容这个目标版本。应用程序仍然能在低于`targetSdkVersion`的系统上运行（一直到`minSdkVersion`属性值所指定的版本）。

　　在Android演进的每个新版本中，都会有一些行为甚至外观的改变。但是，如果平台的`API Level`比应用程序声明的`targetSdkVersion`的值大，那么系统就可以启用兼容行为，以便确保应用程序能够继续执行期望的工作。因此，可以通过指定应用程序所运行的目标SDK版本（`targetSdkVersion`）来禁止启用这种兼容行为。
　　例如，把这个属性值设置为`11`或更大，就会允许系统把新的默认主题应用给在`Android3.0`或更高版本平台之上的应用程序，并且在运行在较大屏幕的设备上时，也禁止使用屏幕兼容模式（因为针对`API Level 11`的支持，暗示着对较大屏幕的支持）。
　　这个属性在`API Leve 4`中被引入。

　　个人经验：

	-  比如从Android 3.0开始，在绘制View的时候支持硬件加速，充分利用GPU的特性，使得绘制更加平滑(会多消耗一些内存)。若是将targetSdkVersion设置为11或以上，则系统会默认使用硬件加速来绘制，但Android3.0之前版本提供的某些绘图API，在硬件加速下进行绘制时，会抛异常。
	-  因此，除非你充分测试了，否则不要把targetSdkVersion设置的过高。

<br>**compileSdkVersion**
　　项目的编译版本（`compileSdkVersion`）和`android:minSdkVersion`属性的值：

	-  compileSdkVersion是指编译当前项目时所使用的SDK平台的版本。
	-  minSdkVersion属性则是限定了当前项目只能安装在大于等于其指定API等级的设备上。

	-  也就是说，我们可以将项目的compileSdkVersion设置为17，而minSdkVersion属性的值则仅为8 。 
	-  只要保证在项目中不去调用API等级8中所未提供的API，那么使用API等级17编译出来的项目依然会正常运行在Android2.2的设备上。

<br>　　问：为什么要把项目的编译版本提高呢?
　　答：它可以让我们的应用程序，既可以使用高版本Android系统中所提供的新功能，同时又能完美的运行在低版本的系统中。以`holo`主题为例，众所周知`holo`主题是`Android3.0`之后的系统中的一个非常大的亮点。如果可以实现“当应用程序运行在3.0之前的系统时使用一般的主题，而运行在3.0之后的系统时则使用holo主题”那可就太好了。

<br>　　范例1：使用`Holo`主题（`styles.xml`）。
``` xml
<!-- For API level 11 or later, the Holo theme is available and we prefer that. -->
<style name="ThemeHolo" parent="android:Theme.Holo">
</style>
```
　　如果项目的当前编译版本低于`3.0`则`Android Studio`就会报错。
　　因为`Android Studio`在编译Android的`xml`文件时，会依据当前项目的编译版本，去SDK的安装目录下查找其所依赖的所有资源，若未找到则就报错。 本范例中查找`Theme.Holo`主题的目录为：
　　`SDK\platforms\android-11\data\res\values`
　　其中`“android-11”`与项目的编译版本相对应。我们进入到`values`目录后，打开`themes.xml`就可以找到`Theme.Holo`主题了。同样的，在项目中引用的其他系统资源(如颜色、尺寸等)在`platforms`目录下面都是可以找到的。

　　然后我们就可以在项目中建立`res\values-v11`目录，并把上面的`styles.xml`放到里面去。当程序运行的时候，系统会检测当前设备的`API Level`，若大于等于`11`则使用`values-v11`目录下的`styles.xml`，否则则使用`values`目录下的。

## 从Eclipse迁移老项目 ##

　　既然是从Eclipse迁移老项目，那么我们首先要做的就是在`Android Studio`中配置`SVN`。

<br>**配置SVN**
　　`Android Studio`配`SVN`比普通IDE复杂点，它需要电脑里有独立的SVN客户端，我们可以到[ TortoiseSVN官网 ](http://tortoisesvn.net/downloads.html)上下载。
　　`Android Studio`会使用到`TortoiseSVN`的`“command line client tools”`，但是由于在安装`TortoiseSVN`时，默认是不安装这个工具的，因而即便是你已经安装了`TortoiseSVN`，仍然需要卸载了重新装。

<center>
![安装时，选择第一项即可](/img/android/android_d04_03.png)
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

	-  首先，点击“File > Import Project”。
	-  然后，选择转换后的项目，所要保存的路径。
	-  接着，保持默认设置，点击“Finish”。
	-  最后，等待Studio自己完成转换过程。

　　导入Eclipse格式的项目后，你可能会遇到`“Android Manifest doesn't exists or has incorrect root tag”`的错误，解决的方式是点击下图所示的按钮：

<center>
![Sync project with Gradle files](/img/android/android_d04_04.png)
</center>

　　如果你没有找到这个按钮，请参看 [Android Studio: Android Manifest doesn't exists or has incorrect root tag](http://stackoverflow.com/questions/17424135/android-studio-android-manifest-doesnt-exists-or-has-incorrect-root-tag) 。


　　如果你是通过向导来导入项目的，那么请选择下图所示的`Import project (Eclipse ADT, Gradle, etc.)`：
<center>
![](/img/android/android_d04_05.png)
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

<br>**本节参考阅读：**
- [Android Studio 关于SVN的相关配置简介](http://blog.csdn.net/zhouzme/article/details/22790395)
- [Android Studio 快捷键设置为Eclipse的快捷键](http://www.chenwg.com/android/android-studio%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%AE%BE%E7%BD%AE%E4%B8%BAeclipse%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE.html)
- [Android Studio 如果修改LogCat的颜色，默认全是黑色看着挺不舒服的](http://blog.csdn.net/hotlinhao/article/details/9150519)


<br><br>
