title: 实战篇　第二章 内存分析
date: 2015-3-10 10:40:53
categories: android
---
　　本章来讲解一下Android开发中内存管理相关的知识。

# 第一节 概述 #

## 引言 ##
　　尽管随着科技的进步，现今移动设备上的内存大小已经达到了低端桌面设备的水平，但是现今开发的应用程序对内存的需求也在同步增长。
　　主要问题出在设备的屏幕尺寸上——`分辨率越高需要的内存越多`。
　　熟悉Android平台的开发人员一般都知道垃圾回收器并不能彻底杜绝`内存泄露`问题，对于大型应用而言，内存泄露对性能产生的影响是难以估量的，因此开发人员必须要有内存分析的能力。

　　从早期`G1`的`192MB RAM`开始，到现在动辄`1G -2G RAM`的设备，为单个App分配的内存从`16MB`到`48MB`甚至更多，但`OOM`从不曾离我们远去。这是因为大部分App中图片内容占据了`50%`甚至`75%`以上，而App内容的极大丰富，所需的图片越来越多，屏幕尺寸也越来越大分辨率也越来越高，所需的图片的大小也跟着往上涨，这在大屏手机和平板上尤其明显，而且还经常要兼容低版本的设备，所以Android的内存管理显得极为重要。
<br>　　在本节我们主要讲两件事情：

	-  Gingerbread和Honeycomb中的一些影响你使用内存的变化（heap size、GC、bitmaps）。
	-  理解heap的用途分配（logs、merory leaks、Eclispe Memory Analyzer）。

<br>**名词解释**
　　内存泄漏（`Memory Leak`）

	-  有个引用指向一个不再被使用的对象，导致该对象不会被垃圾回收器回收。如果这个对象内部有个引用指向一个包括很多其他对象的集合，就会导致这些对象都不会被垃圾回收。
　　内存溢出（`Out of memory`）：

	-  当程序需要为新对象分配空间，但是虚拟机能使用的内存不足以分配时，将会抛出内存溢出异常，当内存泄漏严重时会导致内存溢出。

## Gingerbread和Honeycomb ##
　　我们都知道Android是个多任务操作系统，同时运行着很多程序，都需要分配内存，不可能为一个程序分配越来越多的内存以至于让整个系统都崩溃。因此`heap`的大小有个硬性的限制，跟设备相关，从发展来说也是越来越大，`G1：16MB`，`Droid：24MB`，`Nexus One：32MB`，`Xoom：48MB`，但是一旦超出了这个使用的范围，`OOM`便产生了。
　　如果你正在开发一个应用，想知道设备的`heap`大小的限制是多少，比方说根据这个值来估算自己应用的缓存大小应该限制在什么样一个水平，你可以使用`ActivityManager#getMemoryClass()`来获得一个单位为`MB`的整数值，一般来说最低不少于`16MB`，对于现在的设备而言这个值会越来越大，`24MB`，`32MB`，`48MB`甚至更大。

<br>　　但是对于一些内存非常吃紧的比如图片浏览器等应用，在平板上所需的内存更大了。因此在`Honeycomb(Android3.0)`之后`AndroidManifest.xml`增加了`largeHeap`的选项：
``` xml
<application
    android:largeHeap="true"
    ...>
</application>
```
　　这允许你的应用使用更多的`heap`，可以用`ActivityManager#getLargeMemoryClass()`返回一个更大的可用`heap size`。
　　但是这里要警告的是，千万不要因为你的应用报`OOM`了而使用这个选项，因为更大的`heap size`意味着更多的`GC`时间，意味着应用的性能越来越差，而且用户也会发现其他应用很有可能会内存不足。只有你需要使用很多的内存而且非常了解每一部分内存的用途，这些所需的内存都是不可或缺的，这个时候你才应该使用这个选项。

<br>　　既然我们提到更大的`heap size`意味着更多的`GC`时间，下面我们来谈谈`Garbage Collection`。

<br>**垃圾回收**
　　首先我们简单回顾下`JAVA`的内存回收机制，内存空间中垃圾回收的工作由垃圾回收器 (`Garbage Collector，GC`) 完成的，它的核心思想是：对虚拟机可用内存空间，即堆空间中的对象进行识别，如果对象正在被引用，那么称其为存活对象，反之，如果对象不再被引用，则为垃圾对象，可以回收其占据的空间，用于再分配。
　　在垃圾回收机制中有一组元素被称为`根元素集合`，它们是一组被虚拟机直接引用的对象，比如，正在运行的线程对象，系统调用栈里面的对象以及被`system class loader`所加载的那些对象。堆空间中的每个对象都是由一个根元素为起点被层层调用的。因此，一个对象还被某一个存活的根元素所引用，就会被认为是`存活对象`，不能被回收和进行内存释放。因此，我们可以`通过分析一个对象到根元素的引用路径来分析为什么该对象不能被顺利回收`。如果说一个对象已经不被任何程序逻辑所需要但是还存在被根元素引用的情况，我们可以说这里存在内存泄露。

<center>
![](/img/android/android_8_1.png)
</center>

　　如上图所示，`GC`会选择一些它了解还存活的对象作为内存遍历的根节点，比方说`thread stack`中的变量，`JNI`中的全局变量，`zygote`中的对象等，然后开始对`heap`进行遍历。到最后，那些没有直接或者间接引用到`GC Roots`的就是需要回收的垃圾，会被`GC`回收掉。如下图蓝色部分：

<center>
![](/img/android/android_8_2.png)
</center>

　　因此也可以看出，更大的`heap size`需要遍历的对象更多，回收垃圾的时间更长，所以说使用`largeHeap`选项会导致更多的`GC`时间。

　　提示：

	Activity有View的引用，View也有Activity的引用，当Activity被finish掉之后，Activity和View的循环引用已成孤岛，不再引用到GC Roots，无需断开也会被回收掉。

<br>　　在`Gingerbread(Andrid2.3)`之前，`GC`执行的时候整个应用会暂停下来执行全面的垃圾回收，因此有时候会看到应用卡顿的时间比较长，一般来说`>100ms`，对用户而言已经足以察觉出来。`Gingerbread`及以上的版本，`GC`做了很大的改进，基本上可以说是并发的执行，并且也不是执行完全的回收。只有在`GC`开始以及结束的时候会有非常短暂的停顿时间，一般来说`<5ms`，用户也不会察觉到。


<br>**常见GC Root**
　　GC会收集那些不是GC roots且没有被GC roots引用的对象。一个对象可以属于多个root，常见的GC root有几下种：

	-  Class：由系统类加载器加载的对象，这些类是不能够被回收的，他们可以以静态字段的方式保存持有其它对象。
	-  Thread：已经启动且正在执行的线程。
	-  JNI Local：JNI方法的local变量或参数。
	-  JNI Global：全局JNI引用。
	-  Monitor Used：用于同步的监控对象。

　　参考阅读：[GC Root](http://blog.csdn.net/fenglibing/article/details/8928927) 

<br>**内存结构**
　　在`Honeycomb(Android3.0)`之前，`Bitmap`的内存分配如下图：

<center>
![](/img/android/android_8_3.png)
</center>

　　蓝色部分是`Dalvik heap`，黄色部分是`Bitmap`引用对象的堆内存，而`Bitmap`实际的`Pixel Data`是分配在`Native Memory`中(VM中的另一块地方，与`heap`是平级的)。这样做有几个问题，首先需要调用`reclyce()`来表明`Bitmap`的`Pixel Data`占用的内存可回收，不调用这个方法的话就要靠`finalizer`来让`GC`回收这部分内存，但了解`finalizer`的应该都知道这相当的不可靠；其次是很难进行`Debug`，因为一些内存分析工具是查看不到`Native Memory`的。

<br>　　`Honeycomb`之后，`Bitmap`的内存分配做出了改变，如下图：

<center>
![](/img/android/android_8_4.png)
</center>

　　蓝色黄色部分没有变化，但`Bitmap`实际的`Pixel Data`的内存也同样分配在了`Dalvik heap`中。这样做有几个好处。首先能同步的被`GC`回收掉；其次`Debug`变得容易了，因为内存分析工具能够查看到这部分的内存；再次就是`GC`变成并发了，可做部分的回收，也就是极大缩短了`GC`执行时暂停的时间。

## Heap的分配 ##
　　一般来说我们希望了解我们应用内存分配，最基本的就是查看`Log`信息。比方说看这样一个`Log`信息(这是`Gingerbread`版本的，`Honeycomb`以后`log`信息有改动)：
```
D/dalvikvm( 9050): 
GC_CONCURRENT freed 2049K, 
65% free 3571K/9991K, external 4703K/5261K, paused 2ms+2ms
```

　　第二行代码的`“GC_xxx”`说明是哪类`GC`以及触发`GC`的原因，常见有五种类型：

	-  GC_CONCURRENT：这是因为你的heap内存占用开始往上涨了，为了避免heap内存满了而触发执行的。
	-  GC_FOR_MALLOC：这是由于concurrent gc没有及时执行完而你的应用又需要分配更多的内存，内存要满了，这时不得不停下来进行malloc gc。
	-  GC_EXTERNAL_ALLOC：这是为external分配的内存执行的GC，也就是上文提到的Bitmap Pixel Data之类的。
	-  GC_HPROF_DUMP_HEAP：这是当你做HPROF这样一个操作去创建一个HPROF profile的时候执行的。
	-  GC_EXPLICIT：这是由于你显式的调用了System.gc()，这是不提倡的，一般来说我们可以信任系统的GC。


　　第二行代码的`“freed 2049K”`表明在这次`GC`中回收了多少内存。
　　第三行代码的`“65% free 3571K/9991K”`是`heap`的一些统计数据，表明这次回收后仍有`65%`的`heap`可用，存活的对象大小`3571K`，`heap`大小是`9991K`。
　　`“external 4703K/5261K”`是`Native Memory`的数据，存放`Bitmap Pixel Data`或者是`NIO Direct Buffer`之类的。

	-  第一个数字表明Native Memory中已分配了多少内存。
	-  第二个值有点类似一个浮动的阀值，表明分配内存达到这个值系统就会触发一次GC进行内存回收。
　　`“paused 2ms+2ms”`表明`GC`暂停的时间。从这里你可以看到越大的`heap size`你需要暂停的时间越长。如果是`concurrent gc`你会看到`2`个时间一个开始一个结束，这时间是很短的，但如果是其他类型的`GC`，你很可能只会看到一个时间，而这个时间是相对比较长的。

<br>**内存分析的工具**
　　有很多工具可以用来帮助检测内存泄露问题，我们主要使用如下两个工具：

	-  DDMS (Dalvik调试监视服务器) ：
	   -  和SDK一起推出的调试工具（被放在SDK的tools目录下），提供端口转发服务、截屏、线程监控、堆dump、logcat、进程和无线状态监控以及一些其他功能。
	-  MAT (内存分析工具)：
	   -  快速的Java堆分析器，该工具可以检测到内存泄露，降低内存消耗，它有着非常强大的解析堆内存空间dump能力。

　　接下来我们就分别介绍一下它们的用法。

# 第二节 DDMS #
　　Android SDK附带一个调试工具称为`Dalvik Debug Monitor Server`(`DDMS`)，它提供了端口转发服务、屏幕捕获、线程和堆信息、进程、`logcat`、网络的状态信息、来电、发送模拟短信等。
　　本节仅对`DDMS`功能的进行一个简要的讨论，后面内存分析主要使用的工具是`MAT`。

<br>　　`DDMS`既可以连接模拟器也可以连接一个真实的设备。你有三种方式可以启动`DDMS`：

	-  从Eclipse：ADT插件把DDMS集成到了Eclipse中，点击“Window > Open Perspective > Other.. > DDMS” 。
	-  从命令行：通过cmd进入到SDK的tools目录下，然后执行“ddms”命令启动该工具。
	-  从AndroidStudio：自己去差，满地都是教程。

<br>　　接下来介绍一下如何使用`DDMS`以及该视图下面的各种标签和窗格的作用。

<br>**查看进程堆使用情况**
　　`DDMS`允许您查看一个进程正在使用有多少堆内存，这些信息很重要我们稍后会用到。

<center>
![查看进程堆使用情况](/img/android/android_8_6.png)
</center>

<br>　　具体查看步骤：

	1、首先在Devices选项卡中，选中你想查看堆信息的进程。
	2、然后，点击Devices选项卡中的Update Heap按钮，启用监听这个进程的堆信息。
	3、在右侧窗口中的Heap选项卡中，点击Cause GC按钮去调用垃圾回收器开始收集堆信息，随后你将看到一组对象类型以及这些类型被分配的内存大小。
	4、点击列表中的一个对象类型来看到一个条形图显示对象的数量分配给一个特定的内存字节大小。

　　一旦点击了`Cause GC`按钮后，后续的堆信息的收集就会每隔一段时间自动进行了，但你仍可以再次点击`Cause GC`按钮可以手动触发信息收集。

<br>**跟踪内存分配的对象**
　　`DDMS`提供一个很有用的功能，它跟踪正在分配内存的对象和查看那些类和线程正分配对象。这样，在应用中执行特定操作时你就可以实时跟踪哪些对象正在被分配资源。分析影响到应用性能的内存使用是很有价值的信息。

<center>
![](/img/android/android_8_7.png)
</center>

<br>　　跟踪内存的对象分配：

	1、首先在Devices选项卡，选择需要跟踪内存分配的进程。
	2、然后在allocation选项卡，点击Start Tracking按钮开始分配跟踪。这时，任何在应用中的操作都会被跟踪。
	3、点击Get Allocations来查看从点击Start Tracking按钮以来已经分配的对象列表。再点击Get Allocations就会将已分配的新对象添加到列表中。
	4、如果要停止跟踪或清除数据后重新开始，点击Stop Tracking按钮。
	5、点击列表中的特定行就可以看到更详细的信息，比如已分配的对象的方法和代码行。

<br>**使用模拟器或设备的文件系统**
　　`DDMS`提供了文件系统选项（上图中的`“File Explorer”`），它允许查看、复制和删除设备上的文件。这个功能对于检查应用创建的文件或向设备中导入文件和从设备导出文件来说，非常有用。
　　使用模拟器或设备文件系统：

	1、在设备选项，选择要查看文件系统的模拟器。
	2、要从设备中复制文件，先在文件浏览中定位文件，然后点击Pull file按钮。
	3、要把文件复制到设备中，点击文件浏览选项中的Push file按钮

# 第三节 MAT #
　　对于大型`JAVA`应用程序来说，再精细的测试也难以堵住所有的漏洞，即便我们在测试阶段进行了大量卓有成效的工作，很多问题还是会在生产环境下暴露出来，并且很难在测试环境中进行重现。`JVM`能够记录下问题发生时系统的部分运行状态，并将其存储在堆转储(`Heap Dump`)文件中，从而为我们分析和诊断问题提供了重要的依据。

　　`Memory Analyzer（MAT）`是一个功能丰富的`JAVA`堆转储文件分析工具，可以帮助你发现内存漏洞和减少内存消耗。 

　　通常内存泄露分析被认为是一件很有难度的工作，一般由团队中的资深人士进行。不过，今天我们要介绍的`MAT`被认为是一个`“傻瓜式”`的堆转储文件分析工具，你只需要轻轻点击一下鼠标就可以生成一个专业的分析报告。和其他内存泄露分析工具相比，`MAT`的使用非常容易，基本可以实现一键到位，即使是新手也能够很快上手使用。
　　

## 安装步骤 ##
　　`MAT`的使用是如此容易，你是不是也很有兴趣来亲自感受下呢，那么第一步我们先来安装`MAT`。

<br>**安装 MAT**
　　和其他插件的安装非常类似，`MAT`支持两种安装方式，一种是`“单机版”`的，也就是说用户不必安装`Eclipse IDE`环境，`MAT`作为一个独立的`Eclipse RCP`应用运行；另一种是`“集成版”`的，也就是说`MAT`也可以作为`Eclipse IDE`的一部分，和现有的开发平台集成。
　　集成版的安装需要借助`Eclipse`的`Update Manager`。如下图所示，首先通过`Help -> Install NewSoftware... `启动软件更新管理向导。

<center>
![](/img/android/android_8_8.png)
</center>

　　点击`add`按钮，然后按下图所示的方式输入`MAT`的更新地址（最新是 http://download.eclipse.org/mat/1.5/update-site/ ） 。

<center>
![](/img/android/android_8_9.png)
</center>

　　如果你已经配置过了，则Eclipse就会像上面那样提示`“Duplicate location”`。 
　　如下图所示，接下来选择你想要安装的`MAT`的功能点，需要注意的是展开项目后有一个`Memory Analyzer (Chart)`，这个功能是一个可选的安装项目（但是推荐安装），它主要用来生成相关的报表，不过如果需要用到这个功能，你还需要额外的安装`BIRT Chart Engine`。

<center>
![](/img/android/android_8_10.png)
</center>

<br>　　如果你打算安装`Memory Analyzer (Chart)`功能，那么上图第二个红框应该勾选，它可以自动搜索并安装MAT所必须依赖的其他插件，在这里就是`BIRT Chart Engine`。
　　插件安装完毕，你还需要重新启动`Eclipse`的工作平台。

　　比较而言，单机版的安装方式非常简单，用户只需要下载相应的安装包，然后解压缩即可运行，这也是被普遍采用的一种安装方式。在下面的例子里，我们使用的也是单机版的`MAT`。
　　笔者使用的是`Memory Analyzer V1.5.0.20150527`单机版，[下载地址](http://www.eclipse.org/mat/downloads.php)。

<br>　　接下来我们有两个任务要做：

	-  第一，写一个内存泄漏的代码。
	-  第二，导出一个堆转储文件，然后分析这个文件。所谓的堆转储文件，就是一个保存了内存中的各种信息的文件，我们通过分析它就可以定位出内存泄漏。

## 常见泄漏 ##
　　本节先来介绍几个常见的内存年泄漏的范例，以便在以后写代码的时候可以避免掉。

### Handler与Thread ###
　　`Handler`是造成内存泄露的一个重要的源头。
<br>　　看一下如下代码：
``` android
public class HandlerActivity extends Activity {
    private final Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            // ...
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 发送一个消息，60秒后处理。
        mHandler.sendMessageDelayed(Message.obtain(), 60000);
        // 关闭Activity。
        finish();
    }
}
```
<br>　　猛地一看并没有什么问题，但是`Eclipse`或`Android Studio`却会有如下警告：

	This Handler class should be static or leaks might occur (com.example.ta.HandlerActivity.1)

　　大体的意思是：`Handler`应该使用静态声明，不然可能导致`HandlerActivity`被泄露。

<br>　　为啥出现这样的问题呢？这是因为：

	-  首先，当在主线程中初始化Handler时，该Handler会和主线程中的Looper的消息队列关联。
	-  然后，通过Handler发送的消息，会被发送到Looper的消息队列里，直到消息被处理。
	-  接着，但是通过Handler对象发送的消息会反向持有Handler的引用，这样系统可以调用Handler#handleMessage(Message)来分发处理该消息。
	-  最后，由于消息会延迟60秒处理，因此Message对象的引用会被一直持有，同时导致Handler无法回收，又因为Handler是实力内部类，所以最终会导致Activity被泄漏。

<br>　　也许你会说`“我不去执行这种延期的Message不就行了”`，但是：

	-  首先，你不会执行但你不能保证你同事也不会执行。
	-  然后，由于程序中可以存在多个Handler，并且一般情况下都是在主线程中处理消息，因此你也不能保证在其他地方的Handler对象不会阻塞主线程，进而导致你的Message被迫延迟处理等。
	-  因此，为了避免这些未知的情况，我们尽量不要这么写代码。

<br>**如何避免呢？**
　　最简单的方法就是把`Handler`写成一个外部类，不过这样一来就会多出很多文件，也难以查找和管理。

　　另一个方法就是使用`静态内部类+软引用`：
``` android
public class HandlerActivity2 extends Activity {

    private static final int MESSAGE_1 = 1;
    private static final int MESSAGE_2 = 2;
    private static final int MESSAGE_3 = 3;

    private final Handler mHandler = new MyHandler(this);

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mHandler.sendMessageDelayed(Message.obtain(), 60000);
        finish();
    }

    private static class MyHandler extends Handler {
        private final SoftReference<HandlerActivity2> mActivity;

        public MyHandler(HandlerActivity2 activity) {
            mActivity = new SoftReference<HandlerActivity2>(activity);
        }

        @Override
        public void handleMessage(Message msg) {
            // 如果当前Activity被GC回收了，则就不处理这个消息了，直接返回。
            if (mActivity.get() == null) {
                return;
            }
        }
    }
}
```
    语句解释：
    -  本范例中创建了一个名为MyHandler的静态内部类，与实例内部类不同的是，静态内部类不会默认持有其外部类的引用。
    -  在构造MyHandler类的对象时，虽然仍需要传递一个HandlerActivity2的引用过去，但MyHandler类不会持有它的强引用，因而不会阻止HandlerActivity2回收。

<br>**上面这样就可以了吗？**
　　当`Activity`被`finish`后`Handler`对象还是在`Message`中排队，还是会处理消息，但这些处理已经没有必要了。
　　我们可以在`Activity`的`onStop`或者`onDestroy`的时候，取消掉该`Handler`对象的`Message`和`Runnable`，代码如下：
``` java
public void onDestroy() {
    mHandler.removeMessages(MESSAGE_1);
    mHandler.removeMessages(MESSAGE_2);
    mHandler.removeMessages(MESSAGE_3);
    mHandler.removeCallbacks(mRunnable);
}   
```

<br>**Thread对象也一样**
　　比如我们有如下代码：
``` android
public class ThreadActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        new MyThread().start();
    }

    private class MyThread extends Thread {
        public void run() {

        }
    }
}
```
　　它的问题和`Handler`的问题是一样的，解决的方法同样也是`静态内部累+软引用`。

　　此时你可能会有疑问，在刚才说的`Handler`问题中，`Activity`被泄漏是因为`Handler`对象被持有，但是这里的`Thread`对象是一个匿名对象，没有任何人持有它，为什么也会导致`Activity`泄漏呢？
　　答：`Thread`对象是`GCRoot`对象，虽然没有被引用，但是一旦它被启动了，那直到它执行完毕，都不会被回收。除非程序被切到后台且因为系统内存不足，该进程被杀掉进而终止线程。

<br>**本节参考阅读：**
- [Android App 内存泄露之Handler](https://github.com/loyabe/Docs/blob/master/%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2/Android%20App%20%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E4%B9%8BHandler.md) 
- [Android App 内存泄露之Thread](https://github.com/loyabe/Docs/blob/master/%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2/Android%20App%20%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E4%B9%8BThread.md) 

## 堆转储文件 ##
　　在进行分析内存之前，还需要获得一个堆转储文件(`dump heap`)，该文件中保存了内存中的各种信息，堆转储文件以`.hprof`为后缀。

<br>**Heap Dump**
　　如果你不知道`Java`里面的`Heap`是什么意思，这篇文章可能就不太适合你阅读了。
　　一个`Heap Dump`是指在某个时刻对一个Java进程所使用的堆内存情况的一次`快照`，也就是在某个时刻把`Java`进程的内存以某种格式持久化到了磁盘上。`Heap Dump`的格式有很多种，而且不同的格式包含的信息也可能不一样。
　　但总的来说，`Heap Dump`一般都包含了一个堆中的`Java Objects`，`Class`等基本信息。同时，当你在执行一个转储操作时，往往会触发一次`GC`，所以你转储得到的文件里包含的信息通常是有效的内容（包含比较少，或没有垃圾对象了）。

<br>　　我们往往可以在`Heap Dump`看到以下基本信息（一项或者多项，与`Dump`文件的格式有关）：

	-  所有的对象信息：对象的类信息、字段信息、原生值(int, long等)及引用值。
	-  所有的类信息：类加载器、类名、超类及静态字段。
	-  垃圾回收的根对象：根对象是指那些可以直接被虚拟机触及的对象。
	-  线程栈及局部变量：包含了转储时刻的线程调用栈信息和栈帧中的局部变量信息。
　　一个`Heap Dump`是不包含内存分配信息的，也就是说你无法从中得知是谁创建了这些对象，以及这些对象被创建的地方是哪里。但是通过分析对象之间的引用关系，往往也能推断出相关的信息了。

<br>**获取堆转储文件**
　　首先，您需要了解到，不同厂家的`JVM `所生成的堆转储文件在数据存储格式以及数据存储内容上有很多区别，`MAT`不是一个万能工具，它并不能处理所有类型的堆存储文件。但是比较主流的厂家和格式，例如`Oracle`，`HP`，`SAP`所采用的`HPROF`二进制堆存储文件，以及`IBM`的`PHD`堆存储文件等都能被很好的解析。
　　获得堆转储文件很容易，打开`DDMS`，启动想要监控的进程，点击左边`Devices`窗口上方工具栏的`“Dump HPROF File”`按钮。

　　如果你直接使用`MAT`打开刚生成的堆转储文件的话，那么`MAT`通常会报如下错误：
``` c
Error opening heap dump 'a.hprof'. Check the error log for further details.
Error opening heap dump 'a.hprof'. Check the error log for further details.
Unknown HPROF Version (JAVA PROFILE 1.0.3) (java.io.IOException)
Unknown HPROF Version (JAVA PROFILE 1.0.3)
```
　　原因是: Android的虚拟机导出的`hprof`文件格式与标准的`java hprof`文件格式标准不一样，根本原因两者的虚拟机不一致导致的。
　　解决方法：使用`sdk\platform-tools\hprof-conv.exe`工具转换就可以了：
``` c
hprof-conv 源文件 目标文件
```

<br>**MAT插件界面概览**
　　文件加载完成后，你可以看到类似如下图所示的界面：

<center>
![](/img/android/android_8_11.png)
</center>

　　红框括起来了是一些快捷键和功能按钮，如果不小心把某个窗口给关掉后，可以通过这些按钮重新打开对应的界面。

## 基础应用 ##
### 问题代码 ###
　　前面说过`Thread`一旦被启动，那么直到它运行结束都不会被回收（当然若进程被操作系统杀掉了那么线程会中止），你可能会不信，那么咱们现在就创建一个范例，完成后面知识的讲解。

<br>　　范例1：内存泄漏代码。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        new Thread() {
            public void run() {
                for (int i = 1; i <= 600; i++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + " = " + i+", " + MainActivity.this);
                }
            };
        }.start();
    }
}
```
	语句解释：
	-  每当新建立一个Activity的时候就开启一个线程，并让这个线程运行600秒。

<br>　　程序运行后，我们可以通过不断的横竖屏切换来触发`Activity`重建，来模拟内存泄漏。

<br>
### 发现问题 ###
　　若我们的项目运行一段时间后就变得很慢，那么不出意外的话是有内存泄漏了，但是由于不知道具体在哪里泄漏的，所以可能无从下手，应该怎么办呢？
　　在`DDMS`视图中的`Heap`选项卡中部有一个`Type`叫做`data object`，即数据对象。
　　在`data object`一行中有一列是`“Total Size”`，其值就是当前进程中所有`Java`数据对象的内存总量，一般情况下，这个值的大小决定了是否会有内存泄漏。

<br>　　以我们上面的问题代码为例，程序刚启动时内存的信息为：

<center>
![](/img/android/android_o02_12.png)
</center>

　　然后我们不断的横竖屏切换`5~10`次后，内存的信息为：

<center>
![](/img/android/android_o02_13.png)
</center>

　　很明显可以看到，随着我们横竖屏切换的次数增加，`“Count”`和`“Total Size”`两列下的数值也不断的增加，并且不会减少。这基本就可以断定这个界面存在内存泄漏了。

<br>　　因此我们可以这样判断是否存在内存泄漏：

	-  首先，不断打开和关闭应用中的某个界面，同时注意观察data object的Total Size值。
	-  然后，正常情况下Total Size值都会稳定在一个有限的范围内。
	   -  也就是说若程序中的代码写的很好，即便不断的操作会不断的生成很多对象，而在虚拟机不断的进行GC的过程中，这些对象都被回收了，内存占用量会会落到一个稳定的水平。
	   -  反之如果代码中存在没有释放对象引用的情况，则data object的Total Size值在每次GC后不会有明显的回落，随着操作次数的增多Total Size的值会越来越大，直到到达一个上限后导致进程被kill掉。
	-  提示：我们可以点击DDMS视图里的“Cause GC”按钮来手动触发GC。

<br>
### Leak Suspects ###
　　现在，我们已经确定程序存在内存泄漏的问题了，并且也知道是哪个界面存在泄漏了，为了进一步确定是哪块代码出的问题，我们需要将该进程的内存信息导出来，生成一个`.hprof`文件，并加以分析。

　　再次提示：

	-  如果你是使用MAT单机版，那么你需要把IDE导出的堆转储文件转换一下格式。

<br>　　当使用`MAT`打开`.hprof`文件时，会默认打开一个名为`“Leak suspects”（泄露疑点）`的视图，并且生成报告给用户。
　　`“泄露疑点”`会列出当前内存中的个头大的对象，在这里列出的对象并不一定是真正的内存泄露，但它仍然是检查内存泄露的一个绝佳起点。

　　如下图所示：

<center>
![](/img/android/android_o02_14.png)
</center>

　　图释：

	-  android.content.res.Resources：类名称。
	-  <system class loader>：加载该类的加载器。
	-  5,309,840 (47.06%)：该类所有对象所占用的内存。

<br>　　我们可以点击上图中的`“Details »”`按钮来查看详细信息。
　　报告主要包括`到达聚点的最短路径`，这个功能非常有用，它可以让开发人员快速发现到底是哪里让这些对象无法被`GC`回收：

<center>
![](/img/android/android_8_16.png)
</center>

<br>　　在继续向下讲解之前，我们需要先插一个知识点。

<br>**浅堆和保留堆**
　　`MAT`可以根据堆转储文件，以可视化的方式告诉我们哪个类，哪个对象分配了多少内存。不过要想看懂它们，则需要掌握2个概念：`Shallow heap`(浅堆)和`Retained heap`（保留堆）。

<br>　　`Shallow Heap`是指该对象占用了多少内存（字节），不包含对其他对象的引用，也就是对象头加成员变量的头的总和。如：
``` java
public class Person {	// 头部8字节
    private int age;	// 整型4字节
    private int age1;
    private int age2;
    private int age3;
    private int age4;
    private int age5;
    private long birthday;	// 长整型8字节
    private long birthday1;
    private long birthday2;
}
```
    语句解释：
    -  一个对象的头部往往需要32或64比特(bit)（基于不同的平台实现，该值也会不同），在32位系统上，对象头占用8字节，int占用4字节。这些是JVM规范里规定，但不同JVM实现可以按照自己方式来存储数据。另外，基于不同的Heap Dump格式，这些值也可能会有变化，但往往会更加真实地反应出内存的占用量。
    -  因此这个Person对象的浅堆大小大约为56字节。

<br>　　`Retained Set`指的是一个对象集合。假定一些对象会由于对象`X`被垃圾回收（`GC`）后，也同时需要被`GC`掉，那么这些对象就属于`X`的`Retained Set`。注意，`Retained Set`是包含`X`本身的。
　　`Retained Heap`可以简单地理解为对象的`Retained Set`中的对象所占用的内存的总和。换句话说，`Retained Heap`是该对象自己的`shallow size`，加上从该对象能直接或间接访问到对象的`shallow size`之和。
``` java
public class Person2 { // 头部8字节
    private int age;
    private long birthday;
    private String img; // 头部8字节
    private Person p;   // 头部8字节
    public Person2(Person p) {
        this.p = p;
    }
}
```
　　我们计算`Person2`对象的浅堆是`36`字节，就算在你的机器上计算的值与笔者计算的有偏差也不必在乎它们，因为误差不是我们关注重点。事实上，我们只是借助`Person2`类来理解浅堆和保留堆的概念，至于`Person2`类会占多少字节`Who cares?`，只要不是很离谱就可以了。

<br>　　如果程序中有这样的代码：
```
public class MainActivity extends Activity {
    Person p ;
    Person2 p2 ;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        p = new Person();
        p2 = new Person2(null);
    }
}
```
　　则计算出`Person`和`Person2`的浅堆与保留堆的大小如图所示：

<center>
![](/img/android/android_8_13.png)
</center>

<br>　　若是有如下代码：
``` android
public class MainActivity extends Activity {
    Person2 p2 ;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        p2 = new Person2(new Person());
    }
}
```
　　则计算出`Person`和`Person2`的浅堆与保留堆的大小如图所示：

<center>
![](/img/android/android_8_14.png)
</center>

　　即`Person2`的保留堆为：`Person2`的浅堆+`Person`的浅堆。

<br>　　这里要说一下的是，`Retained Heap`并不总是那么有效：

	-  例如，我们new了一块内存，赋值给A的一个成员变量，同时让B也指向这块内存。
	-  这样一来，由于A和B都引用到这块内存，所以当A释放时，该内存不会被释放。
	-  所以这块内存不会被计算到A或者B的Retained Heap中。
	-  因此我们应当只把它当作一个参考值，而不是精确的追求它的每一个字节对应的内容是什么。

<br>**话说回来**
　　介绍完浅堆和保留堆的概念后，咱们回到`“Leak suspects”`上来。

　　不过需要说明的是，通常我们从`“Leak suspects”`中是没法直接得到有用的信息的，它只是一个参考界面，在很多时候是没多大屌用的，不过不要慌。

　　分析`.hprof`文件的起点有多个：

	-  第一，我们确实会从“Leak suspects”开始查看，如果它没直观的提供出有用的信息，那也没关系，再换其他方法。
	-  第二，使用Dominator Tree视图来继续追踪。
	-  第三，使用Histogram视图来继续追踪。

<br>
### Dominator Tree ###
　　MAT提供了一个称为`支配树`（Dominator Tree）的对象图。支配树体现了对象实例间的支配关系。在对象引用图中，所有指向对象`B`的路径都经过对象`A`，则认为对象`A`支配对象`B`。
　　简单的说，之所以提出支配树这个概念，就是为了计算对象的`Retained Heap`。

<center>
![](/img/android/android_8_17.png)
</center>

　　比如我们可以从上图左侧的引用图（对象`A`引用`B`和`C`，`B`和`C`又都引用到`D`）构造出右侧的`Dominator Tree`，计算出来的`Retained Memory`为：

	-  A的包括A本身和B，C，D，E。
	-  B和C因为共同引用D，所以B的Retained Memory只是它本身。
	-  C是自己和E。
	-  D、E当然也只是自己。

<br>　　支配树有以下重要属性：

	-  X的子树中的所有元素表示X的保留对象集合。
	-  如果X是Y的持有者，那么X的持有者也是Y的持有者。
	-  在支配树中表示持有关系的边并不是和代码中对象之间的关系直接对应，比如代码中X持有Y，Y持有Z，在支配树中，X的直接子节点中会有Z。
　　这三个属性对于理解支配树而言非常重要，一个熟练的开发人员可以通过这个工具快速的找出持有对象中哪些是不需要的以及每个对象的保留堆。

<br>**界面介绍**
　　支配树可以算是`MAT`中第二有用的工具，它依据我们设置的关键字来列出符合条件的、堆中较大的（不是所有的）对象以及它们之间的引用关系
　　我们可以直接在`“Overview”`选项页中点击`“Dominator Tree”`进入该工具，或者从菜单栏中也可以进入。

<br>　　支配树的界面如下图所示：
<center>
![](/img/android/android_8_18.png)
</center>

　　表头依次代表：`类名`、`浅堆大小`、`保留堆大小`、`百分比`，可以通过点击某个表头来按特定的字段进行排序。
　　第一行用于输入查找条件，支持正则表达式，如需要查找出`MainActivity`相关的类，则可以在`ClassName`列的第一行输入`“MainActivity”`关键字。
　　
<br>**检索出相关对象**
　　如果你泄漏的对象所占据的内存比较大的话，那么通常在打开`Dominator Tree`时就可以看到它被排在前列。
　　但是，由于前面的范例中只是在`onCreate`方法里创建了线程，并没有执行显示图片等耗内存的操作，因此即便是运行时多执行几次横竖屏切换，泄漏的内存也不会很大，还不至于在`Dominator Tree`视图打开的时候就被列出来，所以我们得通过输入关键字`“MainActivity”`查找后才能看到。

　　如下图所示：

<center>
![](/img/android/android_o02_15.png)
</center>

　　上图列出了当前内存中存在的、所有符合筛选条件（`*.MainActivity.*`）的对象，可以看出明显存在多个`Thread`对象，这显然是不正常的。

<br>**另一个范例**
<br>　　当然，在实际操作的时候情况肯定会比上面的要复杂的多。比如我们有这样一段代码：
``` android
public class MainActivity extends Activity {
    static Leaky leak = null;
    class Leaky {
        void doSomething() {
            System.out.println("Wheee!!!");
        }
    }
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (leak == null) {
            leak = new Leaky();
        }
    }
    // 此处省略了其它代码。
}
```
<br>　　并且我们在界面中显示了一些图片。于是我们导出的`Dominator Tree`如下图所示：

<center>
![](/img/android/android_8_21.png)
</center>

　　`Resources`类型对象由于一般是系统用于加载资源的，所以`Retained heap`较大是个比较正常的情况。但我们注意到下面的`Bitmap`类型对象的`Retained heap`也很大，很有可能是由于内存泄漏造成的。
　　所以我们右键点击这行，选择`Path To GC Roots -> exclude weak references`：

	-  Path To GC Roots 选项用来告诉MAT将当前对象到某个GC根对象之间的所有引用链给列出来。
	-  exclude weak references选项用来告诉MAT，不用列出weak类型的引用。
<br>　　然后可以看到下图的情形：

<center>
![](/img/android/android_8_22.png)
</center>

　　`Bitmap`最终被`leak`变量引用到，这应该是一种不正常的现象，内存泄漏很可能就在这里了。`MAT`不会告诉哪里是内存泄漏，需要你自行分析，由于这是`Demo`，是我们特意造成的内存泄漏，因此比较容易就能看出来，真实的应用场景可能需要你仔细的进行分析。

　　如果我们`Path To GC Roots -> with all references`，我们可以看到下图的情形：

<center>
![](/img/android/android_8_23.png)
</center>

　　可以看到还有另外一个对象在引用着这个`Bitmap`对象，了解`weak references`的同学应该知道`GC`是如何处理`weak references`，因此在内存泄漏分析的时候我们可以把`weak references`排除掉。

<br>
### Histogram ###
　　支配树用来把当前内存中的、符合筛选条件的对象，按照保留堆从大到小的顺序列出来。如果你希望根据某种类型的对象个数来分析内存泄漏，此时可以使用`Histogram`视图。 
　　与`Dominator Tree`一样，较小的对象可以通过在第一行的`“ClassName”`列中输入正则进行查找。

　　我们在`Overview`视图中选择`Actions -> Histogram`，可以看到类似下图的情形：

<center>
![](/img/android/android_8_24.png)
</center>

　　在上图中，`Objects`列表示内存中该类型的对象个数。
　　我们看到`byte[]`占用`Shallow heap`最多，那是因为`Honeycomb`之后`Bitmap Pixel Data`的内存分配在`Dalvik heap`中。

　　接下来，我们右键选中`byte[]`数组，选择`List Objects -> with incoming references`，然后可以看到`byte[]`具体的对象列表：

<center>
![](/img/android/android_8_25.png)
</center>

<br>　　提示：

	-  With Outgoing References表示该对象的出节点（被该对象引用的对象）。
	-  With Incoming References表示该对象的入节点（引用到该对象的对象）。

<br>　　从上图中我们发现第一个`byte[]`的`Retained heap`较大，内存泄漏的可能性较大。
　　右键选中这行，`Path To GC Roots -> exclude weak references`，同样可以看到上文所提到的情况，我们的`Bitmap`对象被`leak`所引用到（如下图所示），这里存在着内存泄漏。

<center>
![](/img/android/android_8_27.png)
</center>

<br>　　我们也可以在`Histogram`视图中第一行中输入`MainActivity`，来过滤出我们自己应用中的类型。

<br>**本章参考阅读：**
- [Memory Analyzer (MAT)](http://www.eclipse.org/mat/) 
- [使用 Eclipse Memory Analyzer 进行堆转储文件分析](http://www.ibm.com/developerworks/cn/opensource/os-cn-ecl-ma/index.html)
- [Android内存泄漏研究](http://jiajixin.cn/2015/01/06/memory_leak/)
- [Android内存泄露开篇](https://github.com/loyabe/Docs/blob/master/%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2/Android%20App%20%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E4%B9%8B%E5%BC%80%E7%AF%87.md)
- [Java程序内存分析：使用mat工具分析内存占用](http://my.oschina.net/biezhi/blog/286223#OSC_h4_7)

<br><br>
