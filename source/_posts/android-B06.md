title: UI篇　第六章 Support Library
date: 2015-2-5 17:58:50
create: 2015-4-13 11:22:25
categories: Android
---
　　`Android Support Library`是一组代码库，提供向后兼容版本的Android框架`API`，若需要在低版本系统中使用高版本中的功能则只能通过该库的`API`。 目前有多个支持库，每个支持库都是向后兼容某个特定的`Android API`级别。这意味着您的应用程序既可以使用支持库所提供的高版本的特点，并且仍然可以在低版本中运行。

# 第一节 概述 #

## 组成 ##
　　`Android Support Library`目前包含`5`个库（`v4`、`v7`、`v8`、`v13`、`v17`），其中`‘v’`代表该支持库所支持的`最低版本的API等级`，如`v4`即指最低支持`Android1.6`。每个库支持一个特定范围的Android平台版本和功能集。
　　一般来说，我们建议包括`v4`和`v7`库到你的应用程序中，因为他们支持广泛的Android版本，并提供`API`推荐用户界面模式。

## 下载 ##
　　`Android Support Library`是对SDK的补充，可以使用`Android SDK Manager`来下载。具体步骤如下：

	1.  启动SDK Manager，通过SDK安装的根目录下的SDK Manager.exe文件。
	2.  打开SDK Manager然后滚动到最底部，找到“Extras”文件夹并将其展开。
	3.  若你使用Eclipse开发项目则需要选择“Android Support Library”，但如果你使用Android Studio开发则需要下载“Android support Repository”。
	4.  点击“安装”按钮。
 
　　下载完毕后，这些文件被放入到`“<sdk>/extras/android/support/”`目录下面。

　　提示：很多时候打开`SDK Manager`时总是为卡在一个地方无法继续向下，从而也导致无法下载支持库。 解决的方法是修改`hosts`文件，首先打开电脑C盘并找到这个文件：
```
C:\WINDOWS\system32\drivers\etc\hosts
```
　　然后在末尾加上一行`“74.125.237.1  dl-ssl.google.com”`，保存后关闭即可。 然后重启`SDK Manager`就可以继续了。

## 特点 ##
　　下面依次介绍一下`5`个支持库的应用场景及特点，你可以依据自己的需求来选择使用哪一个支持库。

<br>
### V4 支持库 ###
　　这个支持库是为`Android1.6`(`API Level 4`)或更高版本的平台设计的。相比其他库它包括更大量的`APIs`。包括应用程序组件、用户接口特性、可访问性、数据处理、网络连通性和编程工具。这里有几个关键的类包含在`v4`库：

	-  应用程序组件：
	   -  Fragment：增加了支持封装的用户界面和功能的Fragment，使应用程序可以方便的在小和大屏幕设备之间提供布局。
	   -  NotificationCompat：可以支持丰富的通知功能。
	   -  LocalBroadcastManager：允许应用程序在其内部很容易注册和接收意图，一个私有的广播。
	-  用户接口：
	   -  ViewPager：增加一个ViewGroup来管理布局里的子View，用户可以通过手指左右滑动在子View之间来回切换。
	   -  PagerTitleStrip：PagerTitleStrip是ViewPager的导航栏（不可以点击）。
	   -  PagerTabStrip：PagerTitleStrip是ViewPager的导航栏（可以点击）。
	   -  DrawerLayout：可以支持创建导航抽屉，可以从一个窗口的边缘。
	   -  SlidingPaneLayout：可以用它实现滑动菜单效果，具体参见 http://my.oschina.net/summerpxy/blog/211835 。
	-  可访问性：
	   -  ExploreByTouchHelper、AccessibilityEventCompat。
	   -  AccessibilityNodeInfoCompat、AccessibilityNodeProviderCompat。
	   -  AccessibilityDelegateCompat
	-  数据处理：
	   -  Loader：可以支持异步加载数据。在V4支持库中也提供了这个类的具体实现，包括CursorLoader和AsyncTaskLoader。
	   -  FileProvider：可以支持应用程序之间共享的私人文件。
　　提示：还有许多其他`API`包含在这个库中。更详细的介绍，请参看`android.support.v4`包。这个库放在：`<sdk>\extras\android\support\v4`目录下。

<br>
### V7 支持库 ###
　　除了`v4`以外，还有一些库设计用于与`Android 2.1`(`API level 7`)或更高的平台。这些库(它们都是以Android库项目的方式存在)提供特定的功能集，可以包含在您的应用程序，并且独立于其他应用程序。
　　`v7`库下面有多个子库，它们分别用于不同的场景，其中有几个子库体积比较大，因而不再像`v4`包那样合在一起，而是将他们分开发布，下面将依次介绍它们。

<br>**V7 appcompat库**
　　这个库添加了对 [ActionBar](http://developer.android.com/guide/topics/ui/actionbar.html) 的支持，同时也支持`Android5.0`提出的`Material Design`风格。
　　值得注意的是，这个库需要依赖于`v4`库，如果你使用`Ant`或者`Eclipse`，要确保这个库中的类可以引用到`v4`库中的类。

　　这里有几个关键的类包含在`v7 appcompat`库：

	-  ActionBar：提供了ActionBar的实现。
	-  ActionBarActivity：需要使用ActionBar的Activity必须派生自此类。
	-  ShareActionProvider：可以支持一个标准化共享行动(比如电子邮件或发布到社交应用程序),可以包含在操作栏中。

　　这个库放在：`<sdk>\extras\android\support\v7\appcompat\libs`目录下。

v7 gridlayout library
这个库添加支持GridLayout类,它允许您安排用户界面元素使用网格的矩形框。这个库放在：<sdk> \extras\android\support\v7\gridlayout\libs目录下。
v7 mediarouter library
	这个库添加支持MediaRouter, MediaRouteProvider，以及其他相关的媒体类。
一般来说,这些在v7 mediarouter库中的api提供了一种手段,控制路由的媒体渠道和流从当前设备到外部屏幕、音箱、和其他目标设备。该库依赖于v7 apcompat库，因此你的项目要同时导入这两个库。

<br>
### V8 支持库 ###

这个库设计用于与Android 2.2(API level 8)或更高的平台，它增加了对RenderScript计算框架的支持，这些APIs被包含在android.support.v8.renderscript包中。值得注意的是，包含这个支持库到你项目中的方法不同于其他支持库，更多信息请参看RenderScript 开发手册。

<br>
### V13 支持库 ###

这个库设计用于与Android 3.2(API level 13)或更高的平台。它增加了对FragmentCompat类的支持，以及更多与Fragment相关的支持类。
这个库放在：<sdk> \extras\android\support\v13\目录下。

<br>**本节参考阅读：**
- [Support Library](http://developer.android.com/tools/support-library/index.html)


# 第二节 Multidex 支持库 #
　　随着Android的不断发展，不论是官方还是`Github`上都出现了大量的新功能、新类库。如果你是一名幸运的Android应用开发者，正在开发一个前景广阔的应用，那么当你不断地加入新功能、添加新的类库，并达到一定规模时，就会遇到下面的构建错误，它表明你的应用已经达到了一个Android应用程序构建架构的限制。早期版本的构建系统报告这个错误如下：
``` c
Conversion to Dalvik format failed:
Unable to execute dex: method ID not in [0, 0xffff]: 65536
```

　　最近版本的Android构建系统会显示一个不同的错误信息，但它们是一个同样的问题:
``` c
trouble writing output:
Too many field references: 131000; max is 65536.
You may try using --multi-dex option.
```
<br>　　这两个错误条件显示一个共同的数字：`65536`。这个数字很重要，因为它代表了`方法的总数`。Android平台的Java虚拟机`Dalvik`在执行`DEX`格式的Java应用程序时，使用原生类型`short`来索引`DEX`文件中的方法。这意味着单个`DEX`文件可被引用的方法总数被限制为`65536`。通常`APK`包含一个`classes.dex`文件，因此Android应用的方法总数不能超过这个数量，这个数量是`Android框架`、`第三方类库`和`你自己开发的代码`的总和。如果你已经建立了一个Android应用，并且收到了这个错误，那么恭喜你，你的方法数已经超过了这个限制。

　　这个问题可以通过将一个`DEX`文件分拆成多个`DEX`文件解决。在`Facebook`、`Android Developers`博客等地方，介绍了通过自定义类加载过程的方法来解决此问题，但这些方法有些复杂而且并不优雅。
　　随着新的`MultiDex支持库`发布，`Google`正式为解决此问题提供`官方支持`，[《Building Apps with Over 65K Methods》](http://developer.android.com/tools/building/multidex.html)介绍了如何使用`Gradle`构建多`DEX`应用。

<br>**在Android 5.0是个分水岭**
　　`Android 5.0`之前版本的平台使用的`Dalvik`执行应用程序代码。默认情况下，`Dalvik`限制每`APK`文件只能有一个`classes.dex`的字节码。为了绕过这个限制，您可以使用`Multidex支持库`，它允许你的`APK`中包含多个`dex`文件。
　　`Android 5.0`和`更高版本`使用`ART`来执行应用程序代码，它原生支持从`APK`文件加载多个`DEX`文件。在应用安装时，它会执行预编译，扫描`classes(..N).dex`文件然后将其编译成单个`.oat`文件用于执行。

　　更多关于`ART`的介绍可以参看博文： [《Android运行时ART简要介绍和学习计划》](http://blog.csdn.net/luoshengyang/article/details/39256813) 。

<br>**仍需控制项目大小**
　　虽然`Google`解决了应用总方法数限制的问题，但并不意味着开发者可以任意扩大项目规模。`Multidex`仍有一些限制：

	1、DEX文件安装到设备的过程非常复杂，如果第二个DEX文件太大，可能导致应用无响应。此时应该使用ProGuard减小DEX文件的大小。
	2、由于Dalvik linearAlloc的Bug，应用可能无法在Android 4.0之前的版本启动，如果你的应用要支持这些版本就要多执行测试。
	3、同样因为Dalvik linearAlloc的限制，如果请求大量内存可能导致崩溃。Dalvik linearAlloc是一个固定大小的缓冲区。在应用的安装过程中，系统会运行一个名为dexopt的程序为该应用在当前机型中运行做准备。dexopt使用LinearAlloc来存储应用的方法信息。Android 2.2和2.3的缓冲区只有5MB，Android 4.x提高到了8MB或16MB。当方法数量过多导致超出缓冲区大小时，会造成dexopt崩溃。
	4、Multidex构建工具还不支持指定哪些类必须包含在首个DEX文件中，因此可能会导致某些类库（如某个类库需要从原生代码访问Java代码）无法使用。

<br>　　避免应用过大、方法过多仍然是Android开发者要注意的问题。`Mihai Parparita`的开源项目[ dex-method-counts ](https://github.com/mihaip/dex-method-counts)可以用于统计`APK`中每个包的方法数量。通常开发者自己的代码很难达到这样的方法数量限制，但随着第三方类库的加入，方法数就会迅速膨胀。因此选择合适的类库对Android开发者来说尤为重要。

　　开发者应该避免使用`Google Guava`这样的类库，它包含了`13000`多个方法。尽量使用专为移动应用设计的`Lite/Android`版本类库，或者使用小类库替换大类库，例如用`Google-gson`替换`Jackson JSON`。而对于`Google Protocol Buffers`这样的数据交换格式，其标准实现会自动生成大量的方法。采用`Square Wire`的实现则可以很好地解决此问题。


<br>**本节参考阅读：**
- [Android应用打破65K方法数限制](http://www.infoq.com/cn/news/2014/11/android-multidex)

# 第三节 JIT #
　　既然在[《Android运行时ART简要介绍和学习计划》](http://blog.csdn.net/luoshengyang/article/details/39256813) 中提到了`JIT`，我们本节就简单介绍一下`JIT`。

<br>**序：**
　　从计算机程序出现的第一天起，对效率的追逐就是程序员天生的、坚定的信仰，这个过程犹如一场没有终点，永不停歇的`F1方程式竞赛`。程序员犹如车手，技术平台则是赛道上飞驰的赛车。

　　`JIT`，即时编译器（`JIT compiler`，`just-in-time compiler`）是一种提高程序运行效率的方法。
　　通常，程序有两种运行方式：`静态编译`与`动态直译`。`静态编译`的程序(如`C语言`)在执行前全部被翻译为机器码，而`动态直译`执行的则是一句一句边运行边翻译(如`Java`)。而`即时编译器则混合了这二者`，一句一句编译源代码，但是`会将翻译过的代码缓存起来以降低性能损耗`。相对于静态编译代码，即时编译的代码可以处理延迟绑定并增强安全性。

<br>**JVM即时编译器**
　　以`Java`语言为例，首先，我们大家都知道，通常`javac`将程序源代码编译，转换成`java`字节码，而这个字节码不是编译成与某个特定的处理器硬件平台对应的指令代码（比如，`Intel`的`Pentium`微处理器或`IBM`的`System/390`处理器），因此后续`JVM`还要通过解释字节码将其翻译成对应的机器指令，逐条读入，逐条解释翻译。
　　当`JVM`发现某个方法或代码块运行特别频繁的时候，就会认为这是`“热点代码”`（`Hot Spot Code`)。为了提高热点代码的执行效率，就会将这些`“热点代码”`编译成与本地机器相关的机器码，进行各个层次的优化。 完成这个任务的编译器就是即时编译器（`JIT`）。因此即时编译器的性能好坏，代码的优化程度高低是衡量一款商用虚拟机优秀与否的最关键指标之一，它是虚拟机最核心最能体现技术水平的部分。
　　 常见的热点代码有两类：

	-  多次被调用的方法
	-  多次被执行的循环体

<br>　　提示1：`Java JIT`工作流程。

	-  首先，Java源码通过编译器转为平台无关的字节码文件。
	-  然后，在启动Java应用程序后，JVM会在运行时加载编译后的类并通过Java解释器执行适当的语义计算。
	-  接着，当开启JIT时，JVM会分析Java应用程序的函数调用并且（达到内部一些阀值后）编译字节码为本地更高效的机器码。JIT流程通常为最繁忙的函数调用提供更高的优先级。
	-  最后，一旦函数调用被转为机器码，JVM会直接执行而不是“解释执行”。

<br>　　提示2：`JIT`不是`Java`专有的。

	-  微软的.NET Framework等语言都依赖即时翻译以提供高速的代码执行。Mozilla Firefox使用的Javascript引擎SpiderMonkey也用到了JIT的技术。Ruby的第三方实现Rubinius和Python的第三方实现PyPy也都通过JIT来明显改善了解释器的性能。

<br><br>