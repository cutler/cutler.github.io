title: 第一章 概述
date: 2014-10-27 23:15:24
categories: Android
---
　　本章主要介绍 Android 应用程序的原理、Android 系统架构，以及如何创建一个新的Android 项目。
<br>
# 第一节 什么是 Android #
　　Android 英文含义为： 男性机器人，中文名称为 `安卓` 。
　　Android 是 `Google` 公司的产品。它是一个运行在 `Linux` 操作系统内核(kernel) 上的开放手机平台(即开放源代码) 的操作系统。
　　Android 系统可以运行在手机、平板电脑（甚至是笔记本电脑）等设备上。
　　在手机设备中，Android 操作系统的地位与 `WindowsMobile`、`Symbian`等其它手机操作系统处在同一级别。 常见的智能手机操作系统有：`Symbian`, `Windows Mobile`, `RIM BlackBerry`, `Android`, `iOS`。 
　　Google 公司在 Android 系统中内置了很多应用软件，如打电话、发短信软件。

　　提示：

	Android开发属于客户端开发，JavaEE开发属于服务器端开发。 
<br>
# 第二节 应用程序原理 #
　　目前，Android 系统中运行的应用程序都是使用`Java`程序语言来编写。Android SDK 工具把应用程序的代码、数据和资源文件一起编译到一个 Android 程序包中（这个程序包是以`.apk`为后缀的归档文件）。一个`.apk`文件就是一个 Android 应用程序，安装 Android 手机软件本质上就是将这个`.apk`文件解压到 Android 设备中。

　　安装在设备上的每个 Android 应用程序都生存在它们自己的安全沙箱中：
	-  Android操作系统是一个多用户的Linux系统，在这个系统中每个应用程序都是一个不同的用户。
	-  默认情况下，系统给每个应用程序分配一个唯一的Linux用户ID（这个ID只能被系统使用，并且对于应用程序是未知的）。系统给应用程序中的所有文件设置权限，以便只有跟用户ID匹配的应用程序能够访问他们。
	-  默认情况下，每个应用程序运行在它们自己的Linux进程中，当任何应用程序的组件需要被执行时，Android会启动该组件所对应的进程，在不再需要的时候或系统必须为其他应用程序恢复内存时这个进程将被关闭。
	-  每个进程都有它们自己的虚拟机，因此应用程序的运行是彼此隔离。

　　通过这种方式，Android 系统实现了最小特权原则。也就是说，默认情况下，每个应用程序只能访问支持它工作的必须的组件。这样就创建了一个安全的环境，在这个环境中应用程序不能访问系统没有给它授权的部分。

　　但是，还有一些应用程序间共享数据和应用程序访问系统服务的方法：

	-  两个应用程序共享相同的Linux用户ID是可能的，这样它们就能够访问彼此的文件。为了节省系统资源，拥有相同用户ID的应用程序也可以运行在相同的Linux进程中，并且共享相同的虚拟机（应用程序必有拥有相同的数字签名证书）。
	-  应用程序能够请求访问设备数据的权限（如用户的通讯录、短信、可安装的存储设备、照相机、蓝牙等等），所有的应用程序的权限都必须在安装时被用户授予。

<br>　　本章还会介绍Android应用程序是如何存在于系统中的基础知识，包括：
	-  定义应用程序的核心框架组件。
	-  在manifest文件中为应用程序声明组件、请求设备功能。
	-  把应用程序的代码与资源分离，并且允许应用程序针对各种设备配置优化它们的行为。
<br>**应用程序组件**
　　应用程序组件是 Android 应用程序的重要基石。
　　Android中有四种不同类型的组件，每种类型服务一个不同的目的。每个组件都是系统进入应用程序的不同入口，对于用户来说，不是所有的组件都是实际的入口，并且有一些是彼此依赖的，但是每一个组件都存在它们自己的实体，并且扮演着特殊的角色--它们都是帮助定义应用程序整体行为的唯一的模块。
　　各种组件都有创建和摧毁不同等的生命周期。 

　　Android中提供了四大组件：`Activity`、`BroadcastReceiver`、`ContentProvider`、`Service`。

##Activities##
　　在 Android 中，一个 `Activity` 就是一个用户界面。
　　Activity 和 `HTML`、`JSP`文件类似，代表一个`“视图”` 视图用于将信息通过`“控件”`显示给用户看。在 Activity 中可以添加各种各样的控件(如按钮、文本框等)。 
　　各种语言开发的`GUI`应用程序都是由多个视图组成，程序会在多个视图之间来回的跳转。 例如，一个 email 应用程序可以有一个显示新邮件列表的 Activity，一个写邮件的 Activity 和一个读邮件的 Activity 。
　　在邮件应用程序中虽然这些 Activity 一起工作，从而形成统一的用户体验，但是它们是彼此独立的。这样，其他应用程序能够启动这些 Activity 中的任何一个（如果邮件应用程序允许）。例如，一个相机应用程序为了给用户共享一张图片，可以启动邮件程序中编写新邮件的 Activity 。
　　Activity 之间还可以通过`传递参数`和`获取返回值`的方式进行数据的交互。 

##Services##
　　与 `PC` 机上的 `Window` 操作系统一样，在 Android 中也存在服务。服务是没有界面的，它运行在程序的后台。 Android 中的服务主要用于`执行长时操作`或`执行远程处理工作`。服务的开启和关闭可以由程序控制。
　　关于服务和线程的关系，将在后面章节中详细讨论。
　　例如，一个 `Service` 可能在后台播放音乐而用户却在使用另一个不同的应用程序，也可以是一个不带有 Activity 用户接口的从网络上获取数据的 `Service` 。

##Content Providers##
　　在 Android 中应用程序的数据可以保存在 `SQLite` 数据库、网络或者应用程序可以访问到的任何本地的持久化的存储介质中。
　　如果应用程序需要`向外界（即其它应用程序）`提供自己的数据，则可以通过 `Content Provider` （内容提供者）来完成。通过 `Content Provider` ，其他的应用程序能够查询或编辑（如果 Content Provider 允许）应用程序的数据。
　　例如，Android 系统提供了一个管理用户通讯录的 `Content Provider` 。这样，任何带有适当授权的应用程序都能够查询由 `Content Provider` 读/写的数据。

<br>　　**为什么要通过 Content Provider 来向外界来提供数据呢?**
　　数据对于每个应用程序来说都应该是私有的。应用程序A若想访问应用程序B的数据，则必须要经过B的同意。
　　退一步说，若是应用B允许应用A直接通过`IO`等方式操作应用B的数据，那么应用B的数据的安全性就大大降低了。若应用A是个恶意程序，此时它会利用这个特点胡乱修改应用B的数据，这是绝对不允许的。
　　因此若程序A需要访问程序B的数据，则就需要同时运行A和B，然后再访问。这样一来，A所进行的操作都会被B所`“看”`到，B也可以对A所进行的操作进行限制(B只提供有限的接口给外界)。
　　然而每个应用程序都是运行在自己的进程中，当应用A需要访问应用B的数据时，数据就需要在不同的虚拟机之间传递。这样操作起来可能就很困难。
　　此时可以使用 `Content Provider` （具体由Android系统来帮我们实现），它能在不同的应用程序之间方便的传递数据。

<br>　　另外 Content Provider 并不仅仅用于向外共享数据，它也可用于`应用程序内部`业务层和数据层之间传递数据，例如 `Note Pad` 程序就是用一个 `Content Provider` 来保存注释。

##Broadcast Receivers##
　　在现实世界中发生一个新闻后，广播电台会广播这个新闻给打开收音机的人，对这个新闻感兴趣的人会关注，可能会拿笔记下。 Android 也提供了类似的机制，它将`系统开关机`、`时间变更`、`屏幕变暗`、`电池电量不足通知`、`抓图通知` 、 `手机接到外界的电话` 、`短信` 等等事件封装成一个广播，当这些事件发生时它就会通知所有关注该事件的应用软件。

　　`Broadcast Receivers` （广播接收者）是应用程序中用来接收广播的一个组件。
　　事实上广播既可以是系统发出的，也可以是当前或者其他应用程序(`委托系统`)发出的。一个应用程序内部可以定义多个广播接收者。当系统中有广播产生时，每个应用程序内定义的广播接收者都会查看该广播是否是其所需要的，若是，则广播接收者将会接收该广播。

    由于在系统内置的电话和短信的软件中，就定义了广播接收者，所以，当用户手机接到外界的电话、短信时这两个软件会接收到系统广播。软件接到广播后，就可以做出相应的操作。比如短信软件会从广播中将短信读取出来，并提示用户有新短信到来等。 
    系统发出的广播“任何有权限的软件”都可以接收到。只要在用户开发的软件中定义了一个用来“接收短信”的广播接收者后，当手机来短信时，用户开发的软件和系统内置的短信软件都会接收到这个系统的广播。

<br>　　广播接收者接收广播时是有`优先级`的，优先级高的接收者会先接到广播。先接到广播的应用程序，有时是可以将广播给拦截下来。 从而使其他程序无法获得系统的广播。以前常见的`垃圾短信过滤器`就是利用了广播接收者的优先级将短信拦截下来，使系统内置的短信软件无法接到系统广播，以此来达到屏蔽垃圾短信的目的。

　　Android 系统设计独特一面是任何应用程序都能够启动另外应用程序的组件。例如，如果想要用户使用相机设备拍照，就有可能在一个应用程序中拍照而在另外一个应用程序中使用照片，而不需要在自己的应用程序中开发一个用于拍照的 `Activity` 。你不需要合并或事件联接来自相机应用的代码，而是简单启动照相机应用中用于拍照的 `Activity` 。当拍照完成，这个事件就返回到你的应用程序以便你能够使用照片。对于用户来说，照相机应用程序就好像你的应用的一部分。

　　系统启动一个组件时，它会同时启动该组件所隶属应用的进程（如果应用未运行），并且实例化组件需要的类。例如，如果你的应用程序启动照相机应用中用于拍照的 `Activity`，这个 `Activity` 将运行在属于照相机应用的进程中，而不是你自己的进程中。因此，跟大多数其他系统不一样，Android 应用程序没有一个单独的进入点（例如，没有`main()`方法）。

　　由于系统在一个独立的限制访问其他应用文件的进程中运行每个应用程序，所以应用程序不能直接激活来自其他应用程序的组件。但是，`Android系统可以做到`，因此要激活另一个应用程序中的一个组件，就必须发一个消息(即`Intent（意图）`)给系统，指定打算启动的特定的组件，然后系统为你激活这个组件。

　　`Broadcast Receivers` 与 `Service`、`Content Provider` 都不显示用户界面，但是他们可以创建状态栏通知，提醒用户事件发生了。

##激活组件##
　　四种类型组件中的三种（`Activities`、`Services`、`Broadcast Receivers`）是通过被叫做 `Intent` 的异步消息激活的。在程序运行的时候可以为 `Intent` 设置它要启动的组件，`Intent` 并不关注该组件是属于应用自己还是其他的应用程序。
　　一个 `Intent` 就是一个 `android.content.Intent` 类的对象。当某个组件需要启动其他组件时，该组件可以通过调用系统提供的API来`给操作系统发出一个请求`，来请求操作系统去启动那个组件。 `Intent` 类就是用来封装这个请求。
　　Content Provider 不是用 Intent 来激活的，它是由 `ContentResolver` 类来激活的。

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
# 第三节 搭建开发环境 #
## 配置要求 ##

<br>**操作系统：**

    Windows XP (32-bit), Vista (32- or 64-bit), or Windows 7 (32- or 64-bit).
    Mac OS X 10.5.8 or later (x86 only).
    Linux (tested on Ubuntu Linux, Lucid Lynx)：
     -  64-bit distribution capable of running 32-bit applications.
     -  GNU C Library (glibc) 2.11 or later is required.
     -  Tested on Ubuntu 12.04, Precise Pangolin.


<br>**Eclipse IDE：**
<center>
![Eclipse的各个版本及其代号（此图于2014/10/29 22:17摘自百度百科）](/img/android/android_1_1.png)
</center>

    Eclipse 3.6.2 (Helios) or greater.
    注意: Eclipse 3.5 (Galileo) is no longer supported with the latest version of ADT.

##所需软件## 
<br>　　`ADT` 插件(Android Development Toolsplugin) (推荐)：

	ADT是基于Eclipse的Android开发工具扩充套件。ADT插件可以让用户快速的在Eclipse中建立Android项目。

<br>　　`Android SDK`(Software Development Kit)软件开发工具(必选)：

	SDK提供了在Android平台使用java语言进行android应用程序开发必须的工具和API接口(类)。
	SDK中也包含Android手机模拟器 (Emulator)，通过使用手机模拟器，可以使Android应用程序直接在计算机中运行。
	通常把Android手机模拟器称作Android 虚拟设备(AndroidVirtual Device), 简写为 “AVD” 。

<br>**其他环境：**
<br>　　JDK6。 由于需要编译Java源程序，所以只安装 Java 运行环境 (JRE) 是不够的。

<br>**注意事项：**
- 有些 Linux 发行版可能包括`JDK 1.4`或支持`Java`的`Gnu`编译器，两者都不支持 Android 开发。
- Google 目前为`Windows`、`Mac OS X`、`Linux`三个平台提供了各自的 SDK 。


<br>**相关链接：**
- [Android Developers](http://developer.android.com)
- [Get the Android SDK](http://developer.android.com/sdk/index.html)

<br>
# 第四节 系统架构 #
　　Android的系统架构和其他操作系统一样，采用了分层的架构。Android操作系统被分为四个层次，每一层都是为上层服务，各层次由内向外依次为： 
-  `Linux Kernel` 层
-  `Libraries` 和 `Android Runtime` 层
-  `Application Framework` 层
-  `Applications` 层

<center>
![Android系统架构](/img/android/android_1_2.jpg)
</center>

## Linux Kernel层 ##
　　在 `linux` 内核层中提供的各种驱动和管理程序都是由 `C/C++` 语言编写的，这些程序为 `Libraries` 和 `Android Runtime` 层的程序提供服务。

## Libraries和Android Runtime层 ##

<br>**Libraries(库)：**
　　Android 包含一些 `C/C++` 库，这些库能被 Android 系统中不同的组件使用。在应用程序框架（`application framework`）层通过 `JNI` 技术调用 `Libraries` 提供的函数库，并通过 `Java` 代码暴露给开发者（`Applications`层）。
　　常见的库函数：  

	- FreeType用于位图(bitmap)和矢量(vector)字体显示。
	- SQLite是一个在手机等移动设备中通用的关系型数据库引擎。
	- WebKit/LibWebCore是Android中内置的Web浏览器引擎。

<br>**Android Runtime (Android运行环境)：**
　　Android运行环境又分为两部分：`核心库` 和 `Dalvik虚拟机`。
　　`核心库` 中提供了`JavaSE`核心类库的大多数类(但并不是全部，如Android不支持JavaSE的`Swing`编程)。 
　　`Dalvik` 是Google公司自己设计的用于Android平台的虚拟机。Android系统中的应用程序是运行在Android自身的`Dalvik`虚拟机上的，而不是运行在`Java VM`之上。 

<br>**Dalvik虚拟机：**
　　`Dalvik`虚拟机中执行的同样是字节码文件。但字节码文件的后缀名为`.dex`。

	 - dex格式是专为Dalvik设计的一种压缩格式，其针对小内存使用做了优化，适合内存和处理器速度有限的系统。
	 - dex文件格式可以减少整体文件尺寸，提高I/O操作的类查找速度。
	 - odex是为了在运行过程中进一步提高性能，对dex文件的进一步优化。
　　Dalvik虚拟机依赖于Linux内核的一些功能，比如线程机制和底层内存管理机制。
　　在Android系统中可以同时运行多个应用程序，每个应用程序都会开启一个独立的进程，在每个进程中有一个Dalvik虚拟机的实例，应用程序只能在它自己的Dalvik VM实例中运行。 应用程序占据独立的进程可以防止在某个虚拟机崩溃的时候导致Android系统内的所有程序都被关闭。

　　资料：
>Dalvik 基于CPU中的寄存器，而 Java VM 基于内存中的栈。基于寄存器的虚拟机对于更大的程序来说，在它们编译的时候，花费的时间更短。

<br>**APK：**
　　`APK`是`Android Package`的缩写，即Android安装包(后缀名为`.apk`)。
　　`.apk`文件是类似Symbian的`.sis`或`.sisx`的文件格式。将`.apk`文件直接传到Android模拟器或Android手机中执行即可安装。  
　　APK文件本质是一个`zip`文件，但后缀名被修改为`.apk`，使用压缩软件可以直接将它打开，其内包括：

	-  dex文件。
	-  AndroidManifest.xml 文件。
	-  资源文件和其他文件。

<br>**APK文件的产生：**

	-  首先，使用Java语言编写源文件，并将源文件编译生成.class文件。
	-  然后，使用Android SDK中的dx工具把编译后得到的多个.class文件转换为一个jar文件，然后dx工具会自动的再将jar文件优化压缩为一个.dex文件。
	-  dex是Dalvik VM executes的缩写，即Android Dalvik执行程序，它是Dalvik的字节码。 
	-  接着，将classses.dex文件与应用程序所有的资源文件，组合在一起，打包成一个apk文件。
	-  最后，就可以使用android-sdk-windows\platform-tools\adb 工具将apk文件安装到Android手机中。

<br>**Adb工具： **
　　安装应用程序：

	-  首先，将手机连接到电脑，接着打开cmd，进入到android-sdk-windows\platform-tools\文件夹 。
	-  然后，执行：“adb install apk文件绝对路径” 如：adb install D:\tomcat.apk 。

　　卸载应用程序：

	-  首先，将手机连接到电脑，接着进入到android-sdk-windows\tools\文件夹中。
	-  然后，执行：“adb uninstall 核心包名” 如：adb uninstall org.cxy.tomcat 。 

　　也可以将`adb`工具的路径加入到`path`环境变量中。另外，`adb`工具的功能不止于安装、卸载软件。

## Application Framework层 ##
　　提供使用Java编写的各种框架，以供应用程序员在程序中调用,本层中的代码由Java语言编写。

## Applications层 ##
　　此层中的应用程序是由应用程序员编写或系统内置的。 

## Android的其他特性 ##

	集成的浏览器 基于开源的 WebKit 引擎。
	优化的图形库 基于 OpenGL ES 1.0定制的 2D/3D 图形库。 
	SQLite数据库用作结构化的数据存储。
	多媒体支持 包括常见的音频、视频和静态图像格式。

　　扩展类库：
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
<br>
# 第五节 新建应用程序 #
　　官方教程：[如何新建一个Android项目](http://developer.android.com/training/basics/firstapp/creating-project.html)

<br>　　首先，在Eclipse中依次执行 File →  new  →  other →  android  →  Android Project 。
　　然后，在Project name 中输入项目的名称：
　　![](/img/android/android_1_3.png)
<br>　　然后，在Contents栏中选择第一项，表示将当前项目建立在当前工作空间中。
　　![](/img/android/android_1_4.png)
<br>　　然后，在 BuildTarget栏中选择Android2.2，表示当前项目是基于Android2.2版本操作系统开发的。
　　![](/img/android/android_1_5.png)
<br>　　然后，在Properties栏中依次填写如下属性：
　　![](/img/android/android_1_6.png)
<br>　　图释：

	-  Application name： 指出当前应用程序(在手机主菜单中显示)的名称。
	-  Package name： 当前应用程序的核心包的包名。此包名就像是人的身份证一样，用于唯一标识一个应用程序。也就说在同一台手机中，只能安装一个核心包的名称为org.cxy.tomcat的应用程序。若设备中已经存在与要安装的应用程序的核心包具有相同名称的应用程序，且它们的数字签名一致，则后安装的会覆盖掉原来的程序，即会先卸载原来的程序。
	-  Create Activity： 在Android中一个Activity就是一个视图。此项用来选择是否自动建立一个Activity作为当前应用程序的主Activity (最先显示的Activity) 。主Activity也被称为入口Activity ，它相当于JavaSE里面的main方法。
	-  Min SDK Version：指出当前应用程序运行所需要的SDK的最低版本。若不写，则会有默认值。

　　提示：上述建立Android工程的步骤在不同版本的ADT插件中会略有不同。


<br>　　创建项目并编译、安装完后，程序就可以投入运行了。当用户点击手机主菜单列表中的某个图标时，Android系统会执行如下步骤：

	-  首先，获取用户点击的图标所对应的主Activity 。
	-  然后，若该主Activity所对应的应用程序没有在当前系统中运行，则Android系统会为该应用程序创建一个进程，并在进程内部创建一个主线程。
	-  接着，主线程通过反射机制，实例化出主Activity的对象，并调用构造方法初始化Activity对象，调用构造方法之后会将当前应用程序的上下文对象的引用放入Activity对象中。 
	-  最后，调用主Activity的onCreate方法，对Activity进行初始化。

<br>
# 第六节 应用程序结构 #
　　在Eclipse中新创建一个Android应用程序，最初其内具有如下文件：

	-  src目录：与Java Project一样，此文件夹用于存放程序员编写的源(.java)文件。
	-  gen目录：存放R.java和AIDL等文件。
	-  res目录：存放资源文件，此目录下的文件发生变化会导致R文件发生变化。
	-  assets目录：用于存放应用程序的资源文件。
	-  AndroidManifest.xml 文件：当前应用程序的清单文件。
	-  project.properties文件：指出运行当前应用程序需要的环境信息。

## gen目录 ##
　　此目录中的所有源文件都由`ADT`插件自动生成，不需要程序员编辑。 创建新项目时`ADT`会在`gen`文件夹内创建核心包，并在核心包内创建一个`R.java文件`。 `R.java`在 Android 应用中起到`“字典”`的作用，当向`res`的某个子目录中中放入`xml`描述文件、图片等资源时，`ADT`插件会为该资源生成一个`int`类型的`id`，同时还会为该资源创建一个`int`类型变量，以文件的名称为变量名，以`id`为变量值，然后将变量写入到`R.java中`，在程序中，通过`R.java`可以很方便地找到对应资源。

　　提示：不要修改此文件夹内的任何文件。

## res目录 ##
　　一个Android应用程序`不只是由代码组成`的，它还需要独立与代码之外的资源，如`图片`、`音频文件`、以及`任何有关应用程序的视觉表现的文件`。例如，你应该使用XML文件来定义用户界面的`动画`、`菜单`、`样式`、`颜色`、以及Activity的`布局`等。使用应用程序资源使更新应用程序的各种功能更加容易，而不必编辑代码，通过提高可选的资源集，能够使你针对各种设备配置优化应用程序(例如不同的语言和屏幕尺寸)。

　　对于在你Android项目中包含的每种资源，SDK编译工具都给定义了一个唯一的数字ID，你能够使用XML文件中定义的这个ID在应用程序的代码或其他的资源中引用这个资源。如，若应用程序中包含了一个名叫`logo.png`的图片文件（保存在`res/drawable/`目录中），SDK工具就会生成一个叫做`R.drawable.logo`的资源ID，你能够通过这个ID来引用这个图片，并把它插入到用户界面中。

　　把资源与代码分离的重要原因之一是给不同的设备配置提供可选资源的能力。例如，通过在XML文件中定义UI字符串，你能够把这些字符串翻译成其他的语言，并且把它们保存到一个独立的文件中，然后基于一个语言限定符（你追加的资源目录名，如`res/values-fr/`目录中保存法语字符串）和用户的语言设置，Android系统就会在UI中使用适当的语言字符串。

<br>**子目录**
　　当前应用可能使用到的各种资源都存放在`res`目录中，如`xml`界面文件，图片或数据。子目录有：

	drawable	  用于存放png、jpg等图像资源。
	layout		用于存放xml格式的用户界面文件。(也称为布局文件)
	values		用于存放xml格式的数据文件。这些文件中保存了在当前应用中会使用到的各种类型的数据，不同类型的数据一般会存放在不同的xml文件中。 

<br>　　drawable下通常会有三个子文件夹：drawable-hdpi、drawable-mdpi、drawable-ldpi 。
	-  drawable-hdpi里面存放高分辨率的图片。
	-  drawable-mdpi里面存放中等分辨率的图片。
	-  drawable-ldpi里面存放低分辨率的图片。
　　当在程序中需要显示某张图片时，Android系统会根据当前机器的屏幕密度来分别到这几个文件夹里面去找对应的图片。关于屏幕密度等知识在后面章节会详细介绍。

<br>　　layout文件夹：
	-  在Android中，每个Activity就是一个用户界面，界面内的组件以及界面所使用的布局一般都是由xml文件来构建的。在Android中xml布局文件主要用于显示用户操作界面。 
	-  提示：Android也可以向Swing那样直接在Java 程序中通过代码来动态的构建用户界面。


<br>　　values文件夹：
	-  此文件夹用来定义程序内要使用到的字符串、尺寸、样式、颜色、数组等数据。这些数据保存在xml文件中。通常每种类型的数据都单独建立一个xml文件。
	-  字符串数据(strings.xml)、数组数据(arrays.xml)、颜色数据(colors.xml)。
	-  属性数据(attrs.xml)、样式数据(styles.xml)、尺寸数据(dimens.xml)。

<br>　　xml文件夹：
	-  用来保存xml文件，这些xml在编译apk时，最终会被编译成二进制形式的。

<br>　　raw文件夹：
	-  用来保存应用使用到的原始文件。这里的文件会原封不动的放入apk包中，不会被编译为二进制形式，访问的方式也是通过R类。
	-  其他目录下的xml文件在编译时会被编译成二进制的，直接打开编译后的xml文件是无法阅读的。但是此目录中的文件则是例外，若想保持xml文件的原始内容，可以将xml文件放入此目录下。

　　提示：apk里除了`assets`和`res/raw`目录外，其他目录的`xml`文件经过了处理，和原始的`xml`文件不一样了，因此直接解压apk获取到的`xml`文件是不能直接阅读。

<br>**对应关系**
　　每个被放入res文件夹的资源，都会在`R.java`中的某个内部类中创建一个与之对应的int类型的常量。 在Android中的清单、用户界面等文件中，可以通过`“@内部类/常量”`的方式来引用。

　　在R.java中有如下常见的几个内部类：

	-  drawable、layout、string、color、array、dimen、style。

　　在R.java类中，其各个内部类与res文件夹内的子文件夹的对应关系如下：

	-  在drawable-hdpi 、drawable-mdpi、drawable-ldpi三个文件夹中的每一个图片都与drawable类的一个静态常量相对应。
	-  在layout文件夹中的每一个xml文件都与layout类的一个静态常量对应。
	-  在values文件夹中保存的是程序中所需要用到的各种数据类型的数值。如：
	   -  字符串数据，使用<string>标签定义。
	   -  颜色数据，使用<color>标签定义。
	   -  尺寸数据，使用<dimen>标签定义。
	   -  数组数据，使用<数据类型-array>标签定义。 如： <string-array> 和 <integer-array> 。 
	   -  样式数据，使用<style>标签定义。
	-  使用不同类型的标签定义的元素，在对应的内部类中，都有一个类常量与之对应。

　　Android支持很多不同选择`资源的限定符`，限定符是一个包含在资源目录名中的简短的字符串，以便定义设备配置应该使用哪些资源。如，根据设备屏幕的方向和尺寸，针对Activity应该创建不同的布局，当设备屏幕纵向高的时候，你可能想要按钮垂直布局，而当屏幕横向宽的时候，你可能想要按钮水平布局。要改名依赖取向的布局，你可以定义两个不同的布局并且用每个布局的目录名作为相应的限定符，然后系统就会根据当前屏幕的取向，自动的使用相应的布局了。

　　关于应用程序中能够包含的资源种类以及如何为不同设备配置创建`可选资源`，后面章节中会详细介绍。

## assets目录 ##
　　assets目录主要用于放一些多媒体文件以及应用会使用到的其他类型的原始文件。

	-  打包时assets目录下的文件会直接被原样放到apk包中，不进行任何编译。
	-  此目录下保存的资源文件不会在R.java自动生成ID ，因此无法通过R类来访问。
	-  单个文件的大小必须<=1024kb。
	-  若需要读取assets目录下的文件，则必须指定文件的具体路径。 
	-  可以在assets下面任意建立文件夹，其内的文件在编译的时候，同样不会被编译。它比res/raw文件夹有更高的自由度。
<br>
# 第七节 清单文件基础 #
　　Android系统在启动一个应用程序组件之前，必须通过阅读应用程序的`AndroidManifest.xml`文件来了解组件的存在情况。应用程序必须在这个文件中声明所有的它定义的组件，这个文件必须在应用项目目录的根目录。

## 基础介绍 ##
　　清单文件除了声明应用程序组件之外，还做了许多其他的事情，如：
　　1、	标识应用程序需要的用户权限。
　　如当前应用程序使用到了系统内置的应用(如拨打电话、互联网服务、发送短信、GPS服务等等`会产生消费`、`引发安全问题`或`包含用户隐私`的功能)时，`需在此文件中事先声明，程序中使用了这些服务`。 声明之后：

	-  首先，当用户安装此应用程序时，Android系统会读取应用程序的清单文件。
	-  然后，Android系统会查看清单文件中声明的，应用程序运行时，所需要使用的功能。
	-  接着，Android系统会告知用户，程序在运行过程中会执行哪些特殊的操作，并询问用户是否仍然安装。
	-  最后，若用户选择了是 则开始安装程序。
	-  若不再清单文件中声明程序所需要的系统功能，则在程序运行的时候，程序是无法使用那些功能的，甚至于导致程序抛异常。
　　2、 声明应用程序需要的最小API级别，也就是要说明应用程序使用的是基于哪个级别的Android API。
　　3、 声明应用程序使用或需要的硬件和软件的功能，例如照相机、蓝牙服务、或多点触摸。
　　4、 应用程序需要的API库链接（Android框架API除外），如Google地图类库。

## 整体结构 ##
　　清单文件就是一个`xml`文件，它以必须`“<manifest>”`标签为根节点。
<br>　　范例1-1：清单文件。
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
<br>　　范例1-2：`<manifest>`标签。

	含义：清单文件的根元素。
	属性解释：
	- package：指出当前应用程序的包名。	必选。
	- android:versionCode：指出当前应用程序的版本号，取值必须是整数。可负。	可选。
	- android:versionName：指出当前应用程序的版本名称，取值是字符串。		  可选。

　　在`“<manifest>”`标签下面定义了若干个子标签，它们各自用于不同的目的，在后面的章节中会详细介绍它们，在此先介绍几个比较常见的标签。

<br>　　范例1-3：`<application>`标签。
　　此标签代表一个android应用程序。程序中开发的四大组件都需要在此标签内部书写。一个清单文件中可以存在多个`<application>`标签。
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

<br>　　范例1-4：声明应用程序组件。
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
	- <receiver>元素用于声明Broadcast receivers。
	- <provider>元素用于声明Content Providers

<br>　　范例1-5：<activity>标签。
　　此标签代表一个Activity组件。任何一个派生自Activity类的类都是一个Activity组件 。
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
　　属性name的值是`“包.类”`，也可以简写成相对位置，如：`android:name=".MainActivity"`，系统会默认去核心包中查找此类。若Activity处于`“com.example.androidtest.activity”`包中，则也可以将name属性的值简写为，`“.activity.MainActivity”`。

<br>　　安装应用程序时，系统会读取清单文件，来初始化应用程序。
　　若在源代码中包含的Activities、Services、和Content Providers没有在清单文件中声明，则对系统就是不可见的，所以就不能运行。但是Broadcast Receivers既可以在清单文件中声明也可以在代码中动态的创建（如BroadcastReceiver对象），然后通过调用registerReceiver()方法在系统中注册(具体后述)。

<br>　　范例1-5：`<intent-filter>`标签。

	<intent-filter>标签是一个意图过滤器，用于匹配意图对象。
	前面说过，Android四种类型组件中的三种（Activities、Services、Broadcast receivers）是通过被叫做Intent的异步消息激活的。
	意图的大体工作流程：
	|-  首先，在程序中创建一个意图对象A，并为A指明其要访问的组件。
	|-  然后，调用Context类提供方法将意图对象交给Android系统，接着由操作系统根据Intent中的内容，执行相应的操作。

	在<activity>、<service>、<receiver>标签内部可以定义意图过滤器，当Android系统接到某个意图对象A后，会使用A依次与系统以及用户自定义的所有非Content Providers组件中的意图过滤器 进行匹配。
	   |-  若意图对象A与某个意图过滤器匹配成功，则系统将调用该意图过滤器所隶属的组件。 
	   |-  若匹配失败，则继续与下一个组件中的意图过滤器 进行匹配。
	|-  若有多个组件的意图过滤器都与意图对象A匹配，则Android系统会给用户弹出一个对话框，要求用户自己选择出，想要调用的组件 。 
	若是调用Context的startActivity()或startActivityForResult()方法，则系统只会匹配所有Activity，相应的若调用startService()方法，则系统只会匹配所有Service。
	在非Content Providers组件中也可以不定义<intent-filter>标签。 
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
	- 第5行<action>标签：设置当前Activity为入口Activity 。入口Activity会被手机的应用列表中，用户点击程序图标时，就会启动入口Activity。
	- 第6行<category>标签：将当前Activity放到手机的应用程序菜单列表中。
	- 当安装应用程序时，Android系统自己会产生一个意图，然后从当前应用程序的清单文件中匹配出所有用户自定义的Activity中包含上面两行代码的Activity ，然后将该Activity放到手机的应用列表中。
	- 在匹配意图时，具体会匹配哪些东西，将在后面章节中详细描述。
	- 提示：一个Android应用程序，可以有多个主Activity 。 也就是说，上面的这四行代码可以写在多个<activity>标签中。此时手机中会显示多个图标，虽然有多个主Activity，但是默认情况下，Android系统只会建立一个进程。 

<br><br>