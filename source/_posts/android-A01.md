title: 入门篇　第一章 概述
date: 2014-10-27 23:15:24
categories: android
---
　　首先要说一下，笔者所写的每一篇`Android`相关的博文都假设您对`Android`开发已经有了整体的认识，因而对一些细节上的零碎知识就一笔带过了。
　　如果您对`Android`完全陌生，那么推荐你先去网上搜索一些视频教程。

<br>
# 第一节 什么是 Android #
<br>　　`Android`英文含义为`“男性机器人”`，中文名称为 `安卓` 。
　　`Android`是`Google`公司的开发的、运行在`Linux`操作系统内核(`kernel`)上的开放源代码的操作系统。它可以运行在手机、平板电脑（甚至是笔记本电脑）等设备上。
　　在移动设备中`Android`操作系统的地位与`WindowsMobile`、`Symbian`、`iOS`等操作系统处在同一级别。

<br>
# 第二节 应用程序原理 #

##基础入门##
　　我们先来简单的介绍几个常识。

<br>**编程语言**
　　截止至`2015年7月6日`，`Android`系统中运行的应用程序除游戏之外，多是使用`Java`语言开发的。不过，谷歌已经在准备一门全新语言`Sky`。

<br>**Android SDK**
　　`Android SDK(software development kit)`是`Android`专属的软件开发工具包。
　　`Android SDK`可以把应用程序的`代码`、`数据`和`资源文件`组合到一起编译到一个以`.apk`为后缀的归档文件中。

　　`Google`为我们开发者提供了一个官网 [Android Developers](http://developer.android.com) ，里面提供了`Android`开发的各类教程、文档。

　　最初，我们使用`Eclipse`来进行`Android`开发，但是在`Google 2013`年`I/O大`会上，`Android Studio`这款开发工具被首次公布，它的下载地址为 [Download Android Studio and SDK Tools](http://developer.android.com/sdk/index.html) 。 



<br>**安全沙箱**
　　安装在设备上的每个`Android`应用程序都生存在它们自己的安全沙箱中：
	-  Android操作系统是一个多用户的Linux系统，在这个系统中每个应用程序都是一个不同的用户。
	-  默认情况下，系统给每个应用程序分配一个唯一的Linux用户ID（这个ID只能被系统使用，并且对于应用程序是未知的）。系统给应用程序中的所有文件设置权限，以便只有跟用户ID匹配的应用程序能够访问他们。
	-  默认情况下，每个应用程序运行在它们自己的Linux进程中，当任何应用程序的组件需要被执行时，Android会启动该组件所对应的进程，在不再需要的时候或系统必须为其他应用程序恢复内存时这个进程将被关闭。
	-  每个进程都有它们自己的虚拟机，因此应用程序的运行是彼此隔离，某一个进程崩溃不会影响到其他进程。


　　但是，还有一些应用程序间共享数据和应用程序访问系统服务的方法：

	-  两个应用程序共享相同的Linux用户ID是可能的，这样它们就能够访问彼此的文件。为了节省系统资源，拥有相同用户ID的应用程序也可以运行在相同的Linux进程中，并且共享相同的虚拟机（应用程序必有拥有相同的数字签名证书）。
	-  应用程序能够请求访问设备数据的权限（如用户的通讯录、短信、可安装的存储设备、照相机、蓝牙等等），所有的应用程序的权限都必须在安装时被用户授予。

<br>**应用程序组件**
　　应用程序组件是`Android`应用程序的重要基石。
　　`Android`中有四种不同类型的组件，每种类型服务一个不同的目的，每个组件都是系统进入应用程序的不同入口。 
　　`Android`的四大组件分别是：`Activity`、`BroadcastReceiver`、`ContentProvider`、`Service`。

　　提示：

	-  有人认为Intent可以算是Android的第五大组件，笔者认为这是错误的。
	-  我们可以从上面四大组件共有的3个特点来判断Intent到底能不能算是第五大组件：
	   -  组件需要在AndroidManifest.xml文件中配置。
	   -  组件可以通过配置，运行在一个独立的进程中。
	   -  组件可以作为应用程序的入口。用户或者系统可以通过特定的方式来激活某个组件，进而激活组件所隶属的进程。

##四大组件##
　　我们已经知道了`Android`中有四大组件，下面来依次介绍一下它们的作用。

<br>**Activities**
　　`Activity`和`HTML`等网页文件类似，用于将信息通过`“图片、按钮、文字”`等方式显示给用户。
　　软件通常是由多个界面组成的，用户可以在软件的多个界面之间来回的切换，这在`Android`中也不例外，例如一个`Email`应用程序可以有一个显示新邮件列表的`Activity`、一个写邮件的`Activity`和一个读邮件的`Activity`。
　　虽然这三个`Activity`一起工作，从而形成统一的用户体验，但是它们是彼此独立的。这样一来，其他应用程序能够启动这些 `Activity`中的任何一个（如果邮件应用程序允许）。例如，一个相机应用程序为了给用户共享一张图片，可以启动邮件程序中编写新邮件的`Activity`。 

<br>**Services**
　　与`PC`机上的`Window`操作系统一样，在`Android`中也存在服务。服务是没有界面的，它运行在程序的后台。`Android`中的服务主要用于`执行长时操作(播放音乐、上传下载)`或`执行远程处理工作(IPC)`，服务的开启和关闭由程序控制。
　　关于服务和线程的关系，将在后面章节中详细讨论。

<br>**Content Providers**
　　在`Android`中应用程序的数据可以保存在`SQLite`数据库、网络或者应用程序可以访问到的任何本地的持久化的存储介质中。
　　如果应用程序需要`向外界（即其它应用程序）`提供自己的数据，则可以通过`Content Provider`（内容提供者）来完成。
　　例如，`Android`系统提供了一个管理用户通讯录的`Content Provider`，任何带有适当授权的应用程序都能够通过`Content Provider`来读/写用户通讯录的数据。

<br>　　**为什么要通过Content Provider来向外界来提供数据呢?**
　　数据对于每个应用程序来说都应该是私有的，`应用程序A`若想访问`应用程序B`的数据，则必须要经过`B`的同意。
　　退一步说，若是`应用B`允许`应用A`直接通过`IO`等方式操作`应用B`的数据，那么`应用B`的数据的安全性就大大降低了。若`应用A`是个恶意程序，此时它会利用这个特点胡乱修改`应用B`的数据，这是绝对不允许的。
　　因此若`应用A`需要访问`应用B`的数据，则就需要同时运行`A`和`B`然后再访问。这样一来`A`所进行的操作都会被`B`给`“看”`到，`B`也可以对`A`所进行的操作进行限制(`B`只提供有限的接口给外界)。
　　然而每个应用程序都是运行在自己的进程中，当`应用A`需要访问`应用B`的数据时，数据就需要在不同的虚拟机之间传递。这样操作起来可能就很困难。此时可以使用`Content Provider`（具体由`Android`系统来帮我们实现），它能在不同的应用程序之间方便的传递数据。

　　另外`Content Provider`并不仅仅用于向外共享数据，它也可用于`应用程序内部`业务层和数据层之间传递数据，例如`Note Pad`程序就是用一个`Content Provider`来保存注释。

<br>**Broadcast Receivers**
　　在现实世界中发生一个新闻后，广播电台会广播这个新闻给打开收音机的人，对这个新闻感兴趣的人会关注，可能会拿笔记下。`Android`也提供了类似的机制，它将`系统开关机`、`时间变更`、`屏幕变暗`、`电池电量不足通知`、`抓图通知` 、 `手机接到外界的电话` 、`短信` 等等事件封装成一个广播，当这些事件发生时它就会通知所有关注该事件的应用软件。

　　`Broadcast Receivers` （广播接收者）是应用程序中用来接收广播的一个组件。
　　事实上广播既可以是系统发出的，也可以是当前或者其他应用程序(`委托系统`)发出的。一个应用程序内部可以定义多个广播接收者，当系统中有广播产生时，每个应用程序内定义的广播接收者都会查看该广播是否是其所需要的，若是，则广播接收者将会接收该广播。

    -  由于在系统内置的电话和短信的软件中就定义了广播接收者，所以，当用户手机接到外界的电话、短信时这两个软件会接收到系统广播。
       -  软件接到广播后，就可以做出相应的操作。比如短信软件会从广播中将短信读取出来，并提示用户有新短信到来等。 
    -  系统发出的广播“任何有权限的软件”都可以接收到。
       -  只要在用户开发的软件中定义了一个用来“接收短信”的广播接收者后，当手机来短信时，用户开发的软件和系统内置的短信软件都会接收到这个系统的广播。

<br>　　广播接收者接收广播时是有`优先级`的，优先级高的接收者会先接到广播，先接到广播的应用程序，有时是可以将广播给拦截下来的，从而使其他程序无法获得系统的广播。以前常见的`垃圾短信过滤器`就是利用了广播接收者的优先级将短信拦截下来，使系统内置的短信软件无法接到系统广播，以此来达到屏蔽垃圾短信的目的。

<br>**小结**
　　`Android`系统设计独特一面是任何应用程序都能够启动另外应用程序的组件。例如，如果想要用户使用相机设备拍照，就有可能在一个应用程序中拍照而在另外一个应用程序中使用照片，而不需要在自己的应用程序中开发一个用于拍照的 `Activity` 。你不需要合并或事件联接来自相机应用的代码，而是简单启动照相机应用中用于拍照的 `Activity` 。当拍照完成，这个事件就返回到你的应用程序以便你能够使用照片。对于用户来说，照相机应用程序就好像你的应用的一部分。

　　系统启动一个组件时，它会同时启动该组件所隶属应用的进程（如果应用未运行），并且实例化组件需要的类。例如，如果你的应用程序启动照相机应用中用于拍照的`Activity`，这个`Activity`将运行在照相机应用的进程中，而不是你自己的进程中。因此，跟大多数其他系统不一样，`Android`应用程序没有一个单独的进入点（例如，没有`main()`方法）。

　　应用程序不能直接激活其他应用程序的组件，但`Android系统可以做到`。因此要激活其它应用程序中的组件，就必须发一个消息(即`Intent（意图）`)给系统，然后系统为你激活这个组件。

　　`Broadcast Receivers` 与 `Service`、`Content Provider` 都不显示用户界面，但是他们可以创建状态栏通知，提醒用户事件发生了。

##激活组件##
　　四种类型组件中的三种（`Activities`、`Services`、`Broadcast Receivers`）是通过被叫做`Intent`的异步消息激活的。在程序运行的时候可以为`Intent`设置它要启动的组件，`Intent`并不关注该组件是属于应用自己还是其他的应用程序。
　　一个`Intent`就是一个`android.content.Intent`类的对象。当某个组件需要启动其他组件时，该组件可以通过调用系统提供的`API`来给操作系统发出一个请求，来请求操作系统去启动那个组件，`Intent`类就是用来封装这个请求。
　　`Content Provider`不是用`Intent`来激活的，它是由`ContentResolver`类来激活的。

<br>　　每种类型组件都有独立的方法来进行激活：
- Activity
>通过传递一个 Intent 给 Context 类的 `startActivity()` 或 `startActivityForResult()` 方法能够启动一个 Activity（或者让这个 Activity 做一些新的事情）。
- Service
>通过传递一个 Intent 给 Context 类 `startService()` 方法来启动一个 Service （或者给一个运行的 Service 发送新的指令），也可以通过传递一个 Intent 给 `bindService()` 方法绑定 Service 。
- Broadcast Receivers
>通过传递一个 Intent 给 `sendBroadcast()` 、 `sendOrderedBroadcast()` 、`sendStickyBroadcast()` 这样的方法可以启动一个广播。
- Content Provider
>通过调用 ContentResolver 上的 `query()` 方法，可以执行一个对 Content Provider 的查询。


<br>　　在后面章节中将会对 `Intent` 和四大组件进行详细介绍。

<br>
# 第三节 系统架构 #
　　`Android`的系统架构和其他操作系统一样，采用了分层的架构。`Android`操作系统被分为四个层次，每一层都是为上层服务，各层次由内向外依次为： 
-  `Linux Kernel` 层
-  `Libraries` 和 `Android Runtime` 层
-  `Application Framework` 层
-  `Applications` 层

<center>
![Android系统架构](/img/android/android_1_2.jpg)
</center>

<br>**Linux Kernel层**
　　在`Linux`内核层中提供的各种驱动和管理程序都是由`C/C++`语言编写的，这些程序为`Libraries`和`Android Runtime`层的程序提供服务。

<br>**Libraries(库)：**
　　`Android`包含一些`C/C++`库，这些库能被`Android`系统中不同的组件使用。在应用程序框架（`application framework`）层通过`JNI`技术调用`Libraries`提供的函数库，并通过`Java`代码暴露给开发者（`Applications`层）。
　　常见的库函数：  

	- FreeType用于位图(bitmap)和矢量(vector)字体显示。
	- SQLite是一个在手机等移动设备中通用的关系型数据库引擎。
	- WebKit/LibWebCore是Android中内置的Web浏览器引擎。

<br>**Android Runtime (Android运行环境)：**
　　`Android`运行环境又分为两部分：`核心库` 和 `Dalvik虚拟机`。
　　`核心库` 中提供了`JavaSE`核心类库的大多数类(但并不是全部，如`Android`不支持`JavaSE`的`Swing`编程)。 
　　`Dalvik` 是`Google`公司自己设计的用于`Android`平台的虚拟机，`Android`系统中的应用程序是运行在`Android`自身的`Dalvik`虚拟机上的，而不是运行在`Java VM`之上。 

<br>**Dalvik虚拟机：**
　　`Dalvik`虚拟机中执行的同样是字节码文件。但字节码文件的后缀名为`.dex`。

	 - dex格式是专为Dalvik设计的一种压缩格式，其针对小内存使用做了优化，适合内存和处理器速度有限的系统。
	 - dex文件格式可以减少整体文件尺寸，提高I/O操作的类查找速度。
	 - odex是为了在运行过程中进一步提高性能，对dex文件的进一步优化。
　　`Dalvik`虚拟机依赖于`Linux`内核的一些功能，比如线程机制和底层内存管理机制。
　　在`Android`系统中可以同时运行多个应用程序，每个应用程序都会开启一个独立的进程，在每个进程中有一个`Dalvik`虚拟机的实例，应用程序只能在它自己的`Dalvik VM`实例中运行。 应用程序占据独立的进程可以防止在某个虚拟机崩溃的时候导致`Android`系统内的所有程序都被关闭。

　　资料：
>Dalvik 基于CPU中的寄存器，而 Java VM 基于内存中的栈。这意味着什么？ 请自行去搜索 :) 。

<br>**Application Framework层**
　　提供使用`Java`编写的各种框架，以供应用程序员在程序中调用，本层中的代码由`Java`语言编写。

``` java
android 		提供一些扩展的 JAVA 类库，类库分为若干个包，每个包中包含若干个类。
android.app 		提供高层的程序模型、提供基本的运行环境。
android.content 	包含各种的对设备上的数据进行访问和发布的类。
android.database 	通过内容提供者浏览和操作数据库。
android.graphics 	底层的图形库，包含画布，颜色过滤，点，矩形，可以将他们直接绘制到屏幕上。
android.location 	定位和相关服务的类。
android.media 		提供一些类管理多种音频、视频的媒体接口。
android.net 		提供帮助网络访问的类，超过通常的 java.net.* 接口。
android.os 		提供了系统服务、消息传输、 IPC 机制。
android.opengl 		提供 OpenGL 的工具。
android.provider 	提供类访问 Android 的内容提供者。
android.telephony 	提供与拨打电话相关的 API 交互。
android.view 		提供基础的用户界面接口框架。
android.util 		涉及工具性的方法，例如时间日期的操作。
android.webkit 		默认浏览器操作接口。
android.widget 		包含各种 UI 元素(大部分是可见的)在应用程序的屏幕中使用。
```

<br>**Applications层**
　　此层中的应用程序是由应用程序员编写或系统内置的。 

<br>
# 第四节 新建应用程序 #
　　你可以阅读官方教程[《Creating an Android Project》](http://developer.android.com/training/basics/firstapp/creating-project.html)，也可以自行去搜索其它人写的中文教程，由于过程比较简单因此笔者不再冗述。

<br>　　其中有个`package name`属性表示当前应用程序的核心包的包名。
	-  此包名就像是人的身份证一样，用于唯一标识一个应用程序。也就说在同一台手机中，只能安装一个核心包的名称为org.cxy.tomcat的应用程序。若设备中已经存在与要安装的应用程序的核心包具有相同名称的应用程序，且它们的数字签名一致，则后安装的会覆盖掉原来的程序。

<br>　　创建并编译完成项目后，会生成一个以`.apk`为后缀名的文件，该文件就是一个`Android`应用程序，安装`Android`手机软件本质上就是将这个`.apk`文件解压到`Android`设备中。

<br>**APK：**
　　`APK`是`Android Package`的缩写，即`Android`安装包(后缀名为`.apk`)。
　　`.apk`文件是类似`Symbian`的`.sis`或`.sisx`的文件格式。将`.apk`文件直接传到`Android`模拟器或`Android`手机中执行即可安装。  
　　`APK`文件本质是一个`zip`文件，但后缀名被修改为`.apk`，使用压缩软件可以直接将它打开，其内包括（但不限于）：

	-  dex文件。
	-  AndroidManifest.xml 文件。
	-  资源文件和其他文件。

<br>　　APK文件的产生：

	-  首先，使用Java语言编写源文件，并将源文件编译生成.class文件。
	-  然后，使用Android SDK中的dx工具把编译后得到的多个.class文件转换为一个jar文件，然后dx工具会再将jar文件优化压缩为一个.dex文件。
	   -  dex是Dalvik VM executes的缩写，即Android Dalvik执行程序，它是Dalvik的字节码。 
	-  接着，将classses.dex文件与应用程序所有的资源文件，组合在一起，打包成一个apk文件。
	-  最后，就可以使用android-sdk-windows\platform-tools\adb 工具将apk文件安装到Android手机中。

<br>**Adb工具： **
　　安装应用程序：

	-  首先，将手机连接到电脑，接着打开cmd，进入到android-sdk-windows\platform-tools\文件夹 。
	-  然后，执行：“adb install apk文件绝对路径” 如：adb install D:\tomcat.apk 。

<br>　　卸载应用程序：

	-  首先，将手机连接到电脑，接着进入到android-sdk-windows\tools\文件夹中。
	-  然后，执行：“adb uninstall 核心包名” 如：adb uninstall org.cxy.tomcat 。 

　　也可以将`adb`工具的路径加入到`path`环境变量中。另外，`adb`工具的功能不止于安装、卸载软件。

<br>　　安装完后，程序就可以投入运行了。当用户点击手机主菜单列表中的某个图标时，`Android`系统会执行如下步骤：

	-  首先，获取用户点击的图标所对应的主Activity 。
	-  然后，若该主Activity所对应的应用程序没有在当前系统中运行，则Android系统会为该应用程序创建一个进程，并在进程内部创建一个主线程。
	-  接着，主线程通过反射机制，实例化出主Activity的对象，并调用构造方法初始化Activity对象，调用构造方法之后会将当前应用程序的上下文对象的引用放入Activity对象中。 
	-  最后，调用主Activity的onCreate方法，对Activity进行初始化。

<br>
# 第五节 清单文件 #
　　`Android`系统在启动某个应用程序的组件之前，必须得知道该应用程序里有哪些组件。
　　因此，`Android`系统要求应用程序提供一个名为`AndroidManifest.xml`的文件，应用程序必须在这个文件中声明所有的它定义的组件。

## 基础介绍 ##
　　清单文件除了声明应用程序组件之外，还做了许多其他的事情，如：
　　1、	标识应用程序需要的权限。
　　如当前应用程序使用到了系统内置的应用(如拨打电话、互联网服务、发送短信、GPS服务等等`会产生消费`、`引发安全问题`或`包含用户隐私`的功能时，`需在AndroidManifest.xml文件中事先声明，程序中使用了这些服务`。 声明之后：

	-  首先，当用户安装此应用程序时，Android系统会读取应用程序的清单文件。
	-  然后，Android系统会查看清单文件中声明的，应用程序运行时所需要使用的功能。
	-  接着，Android系统会告知用户，程序在运行过程中会执行哪些特殊的操作，并询问用户是否仍然安装。
	-  最后，若用户选择了“是”，则开始安装程序。
	-  若不再清单文件中声明程序所需要的系统功能，则在程序运行的时候，程序是无法使用那些功能的，甚至于导致程序抛异常。
　　2、 声明应用程序使用或需要的硬件和软件的功能，例如照相机、蓝牙服务、或多点触摸。
　　3、 应用程序需要的API库链接（`Android`框架`API`除外），如`Google`地图类库。

## 整体结构 ##
　　清单文件就是一个`xml`文件，它以必须`“<manifest>”`标签为根节点。
<br>　　范例1：清单文件。
``` android
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.cxy.tomcat"
    android:versionCode="1"
    android:versionName="1.0">
</manifest>
```

    语句解释：
    - 本范例列出了清单文件的最简单形式，下面将一一介绍<manifest>标签各个属性的含义。
<br>　　范例2：`<manifest>`标签。

	含义：清单文件的根元素。
	属性解释：
	- package：指出当前应用程序的包名。	必选。
	- android:versionCode：指出当前应用程序的版本号，取值必须是整数。可负。	可选。
	- android:versionName：指出当前应用程序的版本名称，取值是字符串。		  可选。

　　在`“<manifest>”`标签下面定义了若干个子标签，它们各自用于不同的目的，在后面的章节中会详细介绍它们，在此先介绍几个比较常见的标签。

<br>　　范例3：`<application>`标签。
　　此标签代表一个`Android`应用程序，程序中开发的四大组件都需要在此标签内部书写。
``` android
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.cxy.tomcat" android:versionCode="1" android:versionName="1.0">
    <application 
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name">
    </application>
</manifest>
```

	属性解释：
	- android:icon：指出当前应用程序所使用的图标，尺寸可以任意。取值：“@内部类/常量”，其中@代表R.java文件。 可选。
	- android:label：指出当前应用程序的名称，在手机应用程序列表中显示。		  可选。
	- android:process：指出当前应用程序运行时，进程的名字。默认为包名。		  可选。

　　在`“<application>”`标签下面同样定义了若干个子标签，应用程序创建的组件都需要在此标签内部声明。

<br>　　范例4：声明应用程序组件。
``` android
<application android:icon="@drawable/ic_launcher" android:label="@string/app_name">
    <activity/>
    <service/>
    <receiver/>
    <provider/>
</application>
```

	标签解释：
	- <activity>元素用于声明Activities。
	- <service> 元素用于声明Services。
	- <receiver>元素用于声明Broadcast Receivers。
	- <provider>元素用于声明Content Providers

<br>　　范例5：<activity>标签。
　　此标签代表一个`Activity`组件。任何一个派生自`Activity`类的类都是一个`Activity`组件 。
``` android
<application android:icon="@drawable/ic_launcher" android:label="@string/app_name">
    <activity
        android:name="com.example.androidtest.MainActivity"
        android:label="@string/app_name" >
    </activity>
</application>
```

	属性解释：
	- android:name： 当前Activity类的全名。即：“包.类”。 				   必选。
	- android:label：当前Activity的标签。与HTML的<title>作用一样。		  可选。
<br>　　属性`android:name`的值是`“包.类”`，也可以简写成相对位置，如：`android:name=".MainActivity"`，系统会默认去核心包中查找此类。若`Activity`处于`“com.example.androidtest.activity”`包中，则也可以将`android:name`属性的值简写为，`“.activity.MainActivity”`。

<br>　　安装应用程序时，系统会读取清单文件，来初始化应用程序。
　　若在源代码中包含的`Activities`、`Services`、和`Content Providers`没有在清单文件中声明，则对系统就是不可见的，所以就不能运行。但是`Broadcast Receivers`既可以在清单文件中声明也可以在代码中动态的创建，然后通过调用`registerReceiver()`方法在系统中注册(具体后述)。

<br>　　范例6：`<intent-filter>`标签。

	<intent-filter>标签是一个意图过滤器，用于匹配意图对象。
	前面说过，Android四种类型组件中的三种（Activities、Services、Broadcast receivers）是通过被叫做Intent的异步消息激活的。因而在这三种标签内部可以定义意图过滤器，当Android系统接到某个意图对象A后，会使用A依次与系统以及用户自定义的组件中的意图过滤器进行匹配。
	   -  若是调用Context的startActivity()或startActivityForResult()方法，则系统只会匹配所有Activity，其它同理。 
	   -  若意图对象A与某个意图过滤器匹配成功，则系统将调用该意图过滤器所隶属的组件。 
	   -  若匹配失败，则继续与下一个组件中的意图过滤器进行匹配。
	   -  若有多个组件的意图过滤器都与意图对象A匹配，则Android系统会给用户弹出一个对话框，要求用户自己选择出，想要调用的组件。
``` android
<activity
    android:name="com.example.androidtest.MainActivity"
    android:label="@string/app_name" >
	<intent-filter>
	     <action android:name="android.intent.action.MAIN" />
	     <category android:name="android.intent.category.LAUNCHER" />
	</intent-filter>
</activity>
```

	语句解释：
	- 其中必须要有“android.intent.action.MAIN”否则程序将无法启动，它用来标识当前Activity是应用的入口Activity。
	- “android.intent.category.LAUNCHER”是可选的，但是通常都会加上。它用来告诉Android系统需要将当前Activity放入到Launcher列表中。 若没有设置此项，也是可以启动入口Activity的，比如通过Eclipse。 

<br><br>