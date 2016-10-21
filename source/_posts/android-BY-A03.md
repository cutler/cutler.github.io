title: 优化篇　第三章 内存优化 —— 应用内存
date: 2015-3-10 10:40:53
categories: Android开发 - 不屈白银
---

　　所谓知己知彼百战不殆，为了以后能更深入的进行内存分析，我们需要先来了解内存相关的知识。

# 第一节 概述 #
<br>**名词解释**
　　内存泄漏（`Memory Leak`）

	-  有个引用指向一个不再被使用的对象，导致该对象不会被垃圾回收器回收。如果这个对象内部有个引用指向一个包括很多其他对象的集合，就会导致这些对象都不会被垃圾回收。
　　内存溢出（`Out of memory`）：

	-  当程序需要为新对象分配空间，但是虚拟机能使用的内存不足以分配时，将会抛出内存溢出异常（即我们常说的OOM），当内存泄漏严重时通常会导致内存溢出。

<br>**最大内存限制**
　　我们都知道Android是个多任务操作系统，同时运行着很多程序，它们都需要分配内存，所以系统不可能为一个程序分配越来越多的内存以至于让整个系统都崩溃。因此每个进程的`heap`的大小有个硬性的限制，跟设备相关，从发展来说也是越来越大，`G1：16MB`，`Droid：24MB`，`Nexus One：32MB`，`Xoom：48MB`，但是一旦超出了这个使用的范围，`OOM`便产生了。
　　如果你想知道设备的单个进程最大内存的限制是多少，并根据这个值来估算自己应用的缓存大小应该限制在什么样一个水平，你可以使用`ActivityManager#getMemoryClass()`来获得一个单位为`MB`的整数值，一般来说最低不少于`16MB`，对于现在的设备而言这个值会越来越大，`32MB`，`128MB`甚至更大。

	-  需要知道的是，就算设备的单进程最大允许是128M，操作系统也不会在进程刚启动就给它128M，而是随着进程不断的有需求是才不断的分配，直到进程达到阀值（128M），系统就会抛出OOM。

<br>　　但是对于一些内存非常吃紧的比如图库、浏览器等应用，在平板上所需的内存更大了。因此在`Honeycomb(Android3.0)`之后`AndroidManifest.xml`增加了`largeHeap`的选项：
``` xml
<application
    android:largeHeap="true"
    ...>
</application>
```
　　它允许你的应用使用更多的`heap`，可以用`ActivityManager#getLargeMemoryClass()`获取允许使用的`heap`容量。
　　但是这里要警告的是，千万不要因为你的应用报`OOM`了而使用这个选项，因为更大的`heap size`意味着更多的`GC`时间，意味着应用的性能越来越差，而且用户也会发现其他应用很有可能会内存不足。因此只有你需要使用很多的内存而且非常了解每一部分内存的用途，这些所需的内存都是不可或缺的，这个时候你才应该使用这个选项。

<br>　　**扩展：为什么图片会占据大量内存？**
　　笔者在[《媒体篇　第二章 图片》](http://cutler.github.io/android-D02/)中已经介绍了，这里再次重复一下：

	-  需要知道的是，图片在磁盘中占据2M的大小，并不意味着它在内存中也占据2M。
	-  图片在内存中大小的公式：图片的分辨率*单个像素点占据的字节大小。
	   -  例如，Galaxy Nexus上的照相机所照的图片最大达到2592x1936像素(500万像素)。
	   -  如果位图的配置使用ARGB_8888(Android 2.3的默认配置)那么加载这个图像到内存需要19MB的存储空间(2592*1936*4bytes)，直接超过了许多低端设备上的单应用限制。

# 第二节 JVM内存结构 #
　　接着再来看一下JVM的内存结构。

　　JVM会把它所管理的内存会分为若干个不同的数据区域，这些区域都有各自的用途、创建和销毁的时间，有的区域随着虚拟机进程的启动而存在，有些区域则是依赖用户线程的启动和结束而建立和销毁。
　　根据[《Java虚拟机规范》](https://book.douban.com/subject/25792515/)，包括以下几个运行时数据区域：

<center>
![](/img/android/android_BY_a02_01.jpg)
</center>

<br>　　我们先抛开上图不看，而是基于自己现有的Java基础来想象一下内存应该是什么样的。

<br>　　首先，Java程序是多线程的。

	-  即每个进程中可以同时存在多个线程，在进程运行的时候，CPU会在它内部的多个线程之间来回切换执行。
	-  那么问题来了，当CPU从线程A上切换到线程B上执行时，线程B应该从哪里开始呢？换而言之，其实每个线程都应该有自己的专属内存空间，用来保存一些自己的数据。
	-  比如线程需要记录当前执行到哪一行代码了，以便当CPU切走又切换来时可以继续向下执行。

　　然后，还应该存在一个共有的区域。

	-  无论是我们编写的代码，还是利用的第三方的类库，都是需要载入到内存的，即内存中应该有区域专门用于存储这些信息（类，方法，常量池等）。
	-  这块区域应该对每个线程进行开放共享的。

　　最后，堆和栈。

	-  从学习JAVA开始，我们就知道了内存有堆和栈的概念，而且我们都说new出来的对象是存放在堆中的，要知道JAVA是面向对象的，所以说这一块应该是占用空间较大的一块，也是内存管理、回收的一个核心点。堆，也是每个线程都可以来访问的，如果堆的空间不足了，却仍需为对象分配空间的话，就会OOM了。
	-  而栈空间其实是每个线程所私有的，栈中存放的是方法中的局部变量，方法入口信息等。每一次调用方法，都涉及到入栈和出栈，如果有一个递归方法调用了几千次，甚至几万次，那么可能会因为在栈中积压了那么多信息导致栈溢出的，从而抛出StackOverFlow。

<br>　　现在我们再回过头去看上面那张图就清晰一些了：

	-  方法区和堆就是我们说的公共区域（线程公用）。
	-  方法区用于存储已经被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。
	   -  相对而言，垃圾收集行为在这个区域比较少出现，主要是针对该区域废弃常量的和无用类的回收。
	   -  运行时常量池是方法区的一部分，Class文件中除了有类的版本、字段、方法、接口等描述信息外，还有一项信息是常量池（Class文件常量池），用于存放编译器生成的各种字面量和符号引用，这部分内容将在类加载后存放到方法区的运行时常量池中。
	-  虚拟机栈、本地方法栈、程序计数器则是线程私有的，各个线程相互不影响。
	-  程序计数器就是上面说的用来记录线程的执行位置。字节码解释器工作时，会通过改变该计数器的值来选择下一条需要执行的字节码指令，分支、循环等基础功能都要依赖它来实现。每条线程都有一个独立的的程序计数器，各线程间的计数器互不影响，因此该区域是线程私有的。
	-  虚拟机栈就是上面说的栈，该区域也是线程私有的，它的生命周期也与线程相同。每个方法被执行的时候都会同时创建一个栈帧，对于执行引擎来讲，活动线程中只有栈顶的栈帧是有效的，称为当前栈帧，这个栈帧所关联的方法称为当前方法。栈帧用于存储局部变量表、操作数栈、动态链接、方法返回地址和一些额外的附加信息。
	-  本地方法栈，该区域与虚拟机栈所发挥的作用非常相似，只是虚拟机栈为虚拟机执行Java方法服务，而本地方法栈则为使用到的本地操作系统（Native）方法服务。


<br>　　既然上面说栈是隶属于线程的，那么栈溢出时应该只会影响其所隶属的线程才对。

<br>　　范例1：事实就是如此。
``` java
public class Test {

    public static void main(String[] args) {
        new Thread() {
            public void run() {
                deepCall();
            }
        }.start();
        while (true) {
            try {
                System.out.println(Thread.currentThread().getName());
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                    e.printStackTrace();
            }
        }
    }

    private static void deepCall() {
        System.out.println(Thread.currentThread().getName());
        deepCall();
    }

}
```
	语句解释：
	-  程序运行后就会发现就算子线程栈溢出了，主线程依然会正常运行。如果反过来，主线程栈溢出的话，那么整个进程就会被终止了。
	-  栈的大小因Java实现和架构的不同而不同，一些实现支持为 Java 线程指定栈大小，其范围通常在 256KB 到 756KB 之间。尽管每个线程使用的内存量非常小，但对于拥有数百个线程的应用程序来说，线程栈的总内存使用量可能非常大。
	-  如果运行的应用程序的线程数量比可用于处理它们的处理器数量多，效率通常很低（因为CPU在线程间切换也是有消耗的），并且可能导致糟糕的性能和更高的内存占用。

<br>**本节参考阅读：**
- [对Java内存结构的一点思考和实践](http://zhangfengzhe.blog.51cto.com/8855103/1762431)
- [Java 内存区域与内存溢出](http://wiki.jikexueyuan.com/project/java-vm/storage.html)
- [《深入理解Java虚拟机》学习笔记](https://yq.aliyun.com/articles/38104)
- [IBM内存详解](https://www.ibm.com/developerworks/cn/java/j-nativememory-linux/)

## Java垃圾回收 ##
　　Java中垃圾回收的工作由垃圾回收器 (`Garbage Collector`) 完成的，它的核心思想是：

	-  有一组元素被称为根元素集合(GC Roots)，它们是一组被虚拟机直接引用的对象，比如，正在运行的线程对象，方法区中的类静态属性（以及常量）引用的对象等。
	-  GC会对虚拟机可用内存空间中的对象进行识别，主要是堆空间。
	-  GC会从这些根节点开始向下搜索，搜索所走过的路径称为引用链，当一个对象到GC Roots没有任何引用链相连时，就证明此对象是不可用的（可以被回收）。
	-  也就是说，存活对象占据的内存空间不能被回收和释放，垃圾对象的空间则可以。
	-  如果说一个对象已经不被任何程序逻辑所需要但是还存在被根元素引用的情况，我们就说这里存在内存泄露。

　　由于下图蓝色部分没有直接或者间接引用到`GC Roots`，所以它们就是垃圾，会被`GC`回收掉：

<center>
![图1](/img/android/android_8_2.png)
</center>

　　从图中也可以看出，更大的`heap size`需要遍历的对象更多，所以说使用`largeHeap`选项会导致更多的`GC`时间。

	-  另外需要注意的是，Activity有View的引用，View也有Activity的引用，默认情况下当Activity被finish掉之后，Activity和View的循环引用已成孤岛，它们不再引用到GC Roots，因此它们之间无需断开也会被回收掉。
	-  这和上图底部的那两个对象的情况是一样的。

　　从上面可知，若对象的（强）引用被某个GC Root对象所持有，那么该对象就不会被当做垃圾回收掉。
　　另外从JDK1.2版本开始，Java把对象的引用分为四种级别，强引用、软引用、弱引用和虚引用，简单的说：
    -  强引用：是Java程序中最普遍的，只要强引用还存在，GC宁愿抛OOM也不会回收掉被引用的对象。
    -  软引用：若对象存在强引用，则对象不会被GC回收，同时它的软引用也不会返回空,否则GC会在系统内存不够用时回收该对象，当该对象被回收后，它的软引用将返回空。需要注意的是，软引用返回空有两个条件：系统内存不足和对象没有强引用；只满足某一条是不行的，比如若对象只是没有强引用时你主动调用gc后，你立刻访问软引用所引用的对象，是可以获取到该对象的。
    -  弱引用：它的强度比软引用更弱些，被弱引用关联的对象只能生存到下一次垃圾收集发生之前。当垃圾收集器工作时，无论当前内存是否足够，都会回收掉只被弱引用关联的对象。若对象存在强引用则不会回收弱引用。
    -  虚引用：最弱的一种引用关系，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。为一个对象设置虚引用关联的唯一目的是希望能在这个对象被收集器回收时收到一个系统通知。

<br>　　应用层开发中只有强引用和弱引用比较常用，而且非常简单不再冗述，笔者下面来介绍一下引用队列的概念。

　　引用队列配合Reference的子类使用，当Reference所指向的内存空间被GC回收后，该对象就会被追加到引用队列的末尾。
　　范例1：引用队列的使用。
``` java
public class Test {
    public static void main(String[] args) throws Exception {
        // 引用队列。
        ReferenceQueue<Object> queue = new ReferenceQueue<Object>();
        // 弱引用。
        WeakReference<Object> soft = new WeakReference<Object>(new Test(), queue);
        // 调用gc之前先打印一下内容。
        System.out.println(soft.get() + "," + queue.poll());
        System.gc();
        // 之所以要等100毫秒是因为虚拟机将引用对象放入到队列中是有延迟的。
        Thread.sleep(100);
        System.out.println(soft.get() + "," + queue.poll());
    }
}
```
	语句解释：
	-  引用队列的poll方法用来从队列中出队一个元素，若队列为空则返回null。

<br>　　表面上来看引用队列好像没什么屌用，但那只是表面上看。
　　在Github上有一个检测内存泄露的项目 [leakcanary](https://github.com/square/leakcanary) ，现在市面上有大量的项目都集成了它，它就是利用了引用队列的特性。

　　我们来看一下 [leakcanary](https://github.com/square/leakcanary) 的源码，它是如何利用引用队列的。
<br>　　范例2：`com.squareup.leakcanary.RefWatcher`代码片段。
``` java
  // 当Activity被finish时，程序就会调用这个watch方法。
  // 你暂时就把watchedReference当做一个Activity对象即可。
  public void watch(Object watchedReference, String referenceName) {
      checkNotNull(watchedReference, "watchedReference");
      checkNotNull(referenceName, "referenceName");
      if (debuggerControl.isDebuggerAttached()) {
          return;
      }
      final long watchStartNanoTime = System.nanoTime();
      String key = UUID.randomUUID().toString();
      retainedKeys.add(key);
      // 创建一个弱引用去持有Activity，当弱引用被回收时，虚拟机就会把它放入到queue中。
      final KeyedWeakReference reference = new KeyedWeakReference(watchedReference, key, referenceName, queue);
      // 然后在另一个线程中去执行后续工作。
      watchExecutor.execute(new Runnable() {
          @Override public void run() {
            ensureGone(reference, watchStartNanoTime);
          }
      });
  }

  void ensureGone(KeyedWeakReference reference, long watchStartNanoTime) {
      long gcStartNanoTime = System.nanoTime();

      long watchDurationMs = NANOSECONDS.toMillis(gcStartNanoTime - watchStartNanoTime);
      // 需要注意的是，线程间切换是存在时间的，因此当程序执行到此处时，多多少少经历了一些时间。
      // 通常情况下，在这段时间中Activity就应该被回收了，且弱引用也应该被放入到queue中了。
      // 因此下面先执行一次出队操作，判断弱引用是否成功入队了。
      removeWeaklyReachableReferences();
      // 如果出队成功则直接返回，出队成功就意味着Activity被回收了。
      if (gone(reference) || debuggerControl.isDebuggerAttached()) {
        return;
      }
      // 如果未出队成功，说明Activity虽然被finish了，但它还没被回收，即Activity没被加入到queue中。
      // 此时主动调用gc。
      gcTrigger.runGc();
      // 再次尝试出队。
      removeWeaklyReachableReferences();
      // 如果依然出队失败，则此时就可以断定Activity被泄露了。
      if (!gone(reference)) {
        long startDumpHeap = System.nanoTime();
        long gcDurationMs = NANOSECONDS.toMillis(startDumpHeap - gcStartNanoTime);

        File heapDumpFile = heapDumper.dumpHeap();

        if (heapDumpFile == HeapDumper.NO_DUMP) {
          // Could not dump the heap, abort.
          return;
        }
        // 既然出问题了，那就dump出当前进程的内存信息，以供我们分析原因。
        long heapDumpDurationMs = NANOSECONDS.toMillis(System.nanoTime() - startDumpHeap);
        heapdumpListener.analyze(
            new HeapDump(heapDumpFile, reference.key, reference.name, excludedRefs, watchDurationMs,
                gcDurationMs, heapDumpDurationMs));
    }
  }
```
	语句解释：
	-  多的也不说了，大家可以去试一试 leakcanary 的效果。

<br>　　了解了`leakcanary`后，咱们还得把话说回来。

　　在`Gingerbread(Andrid2.3)`之前，`GC`执行的时候整个应用会暂停下来执行全面的垃圾回收，因此有时候会看到应用卡顿的时间比较长，一般来说`>100ms`，对用户而言已经足以察觉出来。`Gingerbread`及以上的版本，`GC`做了很大的改进，基本上可以说是并发的执行（注意只是基本上，实际上在GC时还是会有暂停所有线程的操作），并且也不是执行完全的回收。只有在`GC`开始以及结束的时候会有非常短暂的停顿时间，一般来说`<5ms`，用户也不会察觉到。

　　注意，`Android4.4`引进了新的`ART虚拟机`来取代`Dalvik虚拟机`。它们的机制大有不同，简单而言：

	-  Dalvik虚拟机的GC是非常耗资源的，并且在正常的情况下一个硬件性能不错的设备，单次GC很容易耗费掉10-20ms的时间；
	-  ART虚拟机的GC会动态提升垃圾回收的效率，单次GC通常在2-3ms之间，比Dalvik虚拟机有很大的性能提升；
	-  虽然单次GC时间被大幅缩短了，但我们仍需要尽可能避免产生过多的GC操作，特别是在执行动画的情况下，过多次的GC仍可能会导致一些让用户明显感觉的丢帧。

　　推荐阅读：[《Android 4.4的ART虚拟机性能实测：任务切换更迅速》](http://www.expreview.com/29372.html) 

　　最后，再来看一下常见的[ GC Root ](http://blog.csdn.net/fenglibing/article/details/8928927)：

	-  Class：由系统类加载器加载的对象，这些类是不能够被回收的，他们可以以静态字段的方式保存持有其它对象。
	-  Thread：已经启动且正在执行的线程。
	-  JNI Local：JNI方法的local变量或参数。
	-  JNI Global：全局JNI引用。
	-  Monitor Used：用于同步的监控对象。

## 常见内存泄露 ##

　　在应用层开发的兄弟，最常见到内存问题应该就是因为OOM了。

　　从早期`G1`的`192MB RAM`开始，到现在动辄`2G - 3G RAM`的设备，系统为单个App分配的内存从`16MB`到`48MB`甚至更多，但`OOM`从不曾离我们远去。这是因为大部分App中图片内容占据了`50%`甚至`75%`以上，而App内容的极大丰富，所需的图片越来越多，屏幕尺寸也越来越大分辨率也越来越高，所需的图片的大小也跟着往上涨，这在大屏手机和平板上尤其明显，而且还经常要兼容低版本的设备，所以Android的内存管理显得极为重要。

　　本节先来介绍几个常见的内存年泄漏的范例，以便在以后写代码的时候可以避免掉。
<br>　　范例1：Handler导致的泄露。
``` java
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
　　猛地一看并没有什么问题，但是`Eclipse`或`Android Studio`却会有如下警告：

	This Handler class should be static or leaks might occur (com.example.ta.HandlerActivity.1)

　　大体的意思是：`Handler`应该使用静态声明，不然可能导致`HandlerActivity`被泄露。

　　为啥出现这样的问题呢？这是因为：

	-  首先，当在主线程中初始化Handler时，该Handler会和主线程中的Looper的消息队列关联。
	-  然后，通过Handler发送的消息，会被发送到Looper的消息队列里，直到消息被处理。
	-  接着，但是通过Handler对象发送的消息会反向持有Handler的引用，这样系统可以调用Handler#handleMessage(Message)来分发处理该消息。
	-  最后，由于消息会延迟60秒处理，因此Message对象的引用会被一直持有，同时导致Handler无法回收，又因为Handler是实例内部类，所以最终会导致Activity被泄漏。

　　也许你会说`“我不去执行这种延期的Message不就行了”`，但是：

	-  首先，你不会执行但你不能保证你同事也不会执行。
	-  然后，由于程序中可以存在多个Handler，并且一般情况下都是在主线程中处理消息，因此你也不能保证在其他地方的Handler对象不会阻塞主线程，进而导致你的Message被迫延迟处理。
	-  因此，为了避免这些未知的情况，我们尽量不要这么写代码。

<br>**如何避免呢？**
　　最简单的方法就是把`Handler`写成一个外部类，不过这样一来就会多出很多文件，也难以查找和管理。

　　另一个方法就是使用`静态内部类+软引用`：
``` java
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
    public void onDestroy() {
        // 当Activity被finish后Handler对象还是在Message中排队，还是会处理消息，但这些处理已经没有必要了。
        // 我们可以在Activity的onStop或者onDestroy的时候，取消掉该Handler对象的Message和Runnable，代码如下：
        mHandler.removeMessages(MESSAGE_1);
        mHandler.removeMessages(MESSAGE_2);
        mHandler.removeMessages(MESSAGE_3);
        mHandler.removeCallbacks(mRunnable);
    }
}
```
    语句解释：
    -  本范例中创建了一个名为MyHandler的静态内部类，与实例内部类不同的是，静态内部类不会默认持有其外部类的引用。
    -  在构造MyHandler类的对象时，虽然仍需要传递一个HandlerActivity2的引用过去，但MyHandler类不会持有它的强引用，因而不会阻止HandlerActivity2回收。

<br>　　范例2：Thread导致的泄露。
``` java
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
    语句解释：
    -  在MyThread执行结束之前，Activity也会一直被持有，解决的方法同样也是静态内部累+软引用。
    -  此时你可能会有疑问，在范例1中，Activity被泄漏是因为Handler对象被持有，但是这里的Thread对象是一个匿名对象，没有任何人持有它，为什么也会导致Activity泄漏呢？
    -  因为Thread对象是GCRoot对象，虽然没有被引用，但是一旦它被启动了，那直到它执行完毕，都不会被回收。除非程序被切到后台且因为系统内存不足，该进程被系统杀掉进而终止线程。

<br>　　范例3：HanderThread对象是如何防止泄露的。
``` java
for (;;) {
  // 下面的msg对象是栈上的局部变量，每次循环都将会重写。
  // 一旦被重写，上一次循环的msg引用指向的对象将不再被其引用。
  // 但是在Dalvik虚拟机的实现中，如果queue.next()阻塞了，那么本次循环的msg未被赋值，则上次的msg的引用将不会被清除。
  Message msg = queue.next(); // might block
  if (msg == null) {
    return;
  }
  msg.target.dispatchMessage(msg);
  // 所以在这里，每次循环的最后都会清空msg，这样一来泄漏的仅仅是一个空的msg对象，影响不大。
  msg.recycleUnchecked();
}
```


<br>**本节参考阅读：**
- [Android App 内存泄露之Handler](https://github.com/loyabe/Docs/blob/master/%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2/Android%20App%20%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E4%B9%8BHandler.md) 
- [Android App 内存泄露之Thread](https://github.com/loyabe/Docs/blob/master/%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2/Android%20App%20%E5%86%85%E5%AD%98%E6%B3%84%E9%9C%B2%E4%B9%8BThread.md) 
- [Memory leak专题](http://wiki.jikexueyuan.com/project/notes/Android-Java/MemoryLeak.html)

# 第三节 内存优化 #
　　实际工作中遇到的问题可不会像上一节说的那么简单，假设Leader给你一个任务，让你把你们进程所占的内存在原有的基础上降低15M，你是不是就不知道要如何下手了？

　　不要怕，本节将通过若干实例来让大家对内存优化有一个简单的认识。

## 预备知识 ##
　　知己知彼才能胜利，因此“想优化，就得先了解”，我们只有先了解现有进程的内存占用情况，才能制定出相应的优化方案。

<br>**1、进程占了多少内存？**

　　通常我们会通过Android Studio（以后简称AS）里的Android Monitor或者DDMS来查看某个进程所占的内存值，一般情况下是没问题的，但是它不是很精确。

　　推荐使用adb命令来查看进程的内存（要把手机连接到电脑上不用我说了吧？）：

```
adb shell dumpsys meminfo com.android.systemui
```

<br>　　下图是输出的内容摘要：
<center>
![](/img/android/android_BY_a03_01.png)
</center>

　　这些字段的含义为：

    -  Native Heap行和Dalvik Heap行，分别表示当前进程的Native堆和Dalvik堆的大小，这些数字的单位都是KB。
    -  Heap Size列表示堆的总大小，它与后两者的关系是 Heap Size = Heap Alloc + Heap Free。其实AS和DDMS中所显示的堆大小、已分配、空闲内存，就是这三个字段的值。
    -  Pss Total列表示实际占用的内存值，比如Dalvik Heap的Pss Total占了62M，即Heap Alloc并不是堆的实际内存大小，Pss Total才是（具体后述）。
    -  最后一行就是一个合计，它的Pss Total就是表示当前进程最终占据的实际内存大小，即125M。


<br>**2、手机总内存**

　　整个系统的已用内存就是各进程的Total Pss的总和，执行如下命令可以查看所有进程的内存和系统总内存：

``` c
adb shell dumpsys meminfo
```
<br>　　下图是输出的内容摘要：
<center>
![](/img/android/android_BY_a03_02.png)
</center>

　　这些字段的含义为：

	-  Total RAM表示手机的总内存，我的手机是3G的；另外三项也很容易理解，分别是：空闲内存、已使用内存、丢失内存。
	-  上面四者的关系是：Total = Free + Used + Lost。
	-  其中Used RAM就是由当前系统中所有正在运行的进程的Pss Total的值加在一起得到的。


<br>**3、堆转储文件**

　　除了要知道进程所占的内存外，还得去获取进程的详细内存log，有了log之后，就可以通过分析log，来知道进程的内存都被什么对象占据了。

　　堆转储文件（Heap Dump）就是我们说的log文件。

　　它是某个时刻对一个Java进程所使用的堆内存情况的一次快照，也就是在某个时刻把Java进程的内存以某种格式持久化到了磁盘上，通常以`.hprof`为后缀名。

	-  不同厂家的JVM所生成的堆转储文件在数据存储格式以及数据存储内容上有很多区别。
	-  比如Oracle、HP、IBM等。
	-  但总的来说，Heap Dump一般都包含了一些堆中的Java Objects，Class等基本信息。当你在执行一个转储（dump）操作时，往往会触发一次GC，所以你转储得到的文件里包含的信息通常是有效的内容（包含比较少，或没有垃圾对象了）。

　　大家可以在 DDMS 或 Android Studio 中自己 dump 出 hprof 文件（具体方法请自行搜索）。

	-  需要注意的是，只有root后的手机才能dump进程的hprof文件。
	-  未root的手机在DDMS和AS中是看不见进程列表的，或者使用Android模拟机也行，它默认是root的。
	-  如果你是小米手机，直接用小米助手刷一个开发版的ROM就可以方便的root，市面上的一键root工具都是菜。

<br>　　接下来需要知道的是，hprof文件不是普通的文件，得需要专业的软件才能查看它的内容，目前比较常见的、用来查看hprof的软件就是MAT（稍后详述）。

　　这里强调一下，如果你直接使用MAT打开刚 dump 的堆转储文件的话，那么MAT通常会报如下错误：

``` java
Error opening heap dump 'com.android.systemui.hprof'. Check the error log for further details.
Error opening heap dump 'com.android.systemui.hprof'. Check the error log for further details.
Unknown HPROF Version (JAVA PROFILE 1.0.3) (java.io.IOException)
Unknown HPROF Version (JAVA PROFILE 1.0.3)
```
　　原因是: Android的虚拟机导出的hprof文件格式与标准的java hprof文件格式标准不一样，根本原因两者的虚拟机不一致导致的。解决方法：使用`sdk\platform-tools\hprof-conv.exe`工具转换就可以了：

``` c
hprof-conv 源文件 目标文件
```


## MAT入门 ##

　　网上关于MAT的教程有很多，也很容易搜到，所以笔者就不重复造轮子了，下面主要介绍一些经验性的总结。

　　`Memory Analyzer（MAT）`是一个功能丰富的`JAVA`堆转储文件分析工具，可以帮助你发现内存漏洞和减少内存消耗。


	通常内存泄露分析被认为是一件很有难度的工作，一般由团队中的资深人士进行。
    不过，今天我们要介绍的MAT被认为是一个“傻瓜式”的堆转储文件分析工具，你只需要轻轻点击一下鼠标就可以生成一个专业的分析报告。
    和其他内存泄露分析工具相比，MAT的使用非常容易，基本可以实现一键到位，即使是新手也能够很快上手使用。

<br>　　先来看看MAT工具的预览界面：

<center>
![](/img/android/android_8_11.png)
</center>

　　红框括起来了是一些快捷键和功能按钮，如果不小心把某个窗口给关掉后，可以通过这些按钮重新打开对应的界面。
  
<br>　　接下来我们有两个任务要做：

	第一，写一个内存泄漏的代码。
	第二，导出一个堆转储文件，然后使用MAT工具来分析这个文件。

### 问题代码 ###
　　前面说过`Thread`一旦被启动，那么直到它运行结束都不会被回收（当然若进程被操作系统杀掉了那么线程会中止），你可能会不信，那么咱们现在就创建一个范例，完成后面知识的讲解。

<br>　　范例1：内存泄漏代码。
``` java
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

　　因此我们可以这样判断是否存在内存泄漏：

	-  首先，不断打开和关闭应用中的某个界面，同时注意观察data object的Total Size值。
	-  然后，正常情况下Total Size值都会稳定在一个有限的范围内。
	   -  也就是说若程序中的代码写的很好，即便不断的操作会不断的生成很多对象，而在虚拟机不断的进行GC的过程中，这些对象都被回收了，内存占用量会会落到一个稳定的水平。
	   -  反之如果代码中存在没有释放对象引用的情况，则data object的Total Size值在每次GC后不会有明显的回落，随着操作次数的增多Total Size的值会越来越大，直到到达一个上限后导致进程被kill掉。
	-  提示：我们可以点击DDMS视图里的“Cause GC”按钮来手动触发GC。

### Leak Suspects ###
　　现在，我们已经确定程序存在内存泄漏的问题了，并且也知道是哪个界面存在泄漏了，为了进一步确定是哪块代码出的问题，我们需要将该进程的内存信息导出来，生成一个`.hprof`文件，并加以分析。

　　再次提示：

	-  如果你是使用MAT单机版（而不是AS或者Eclipse插件），那么你需要手动把hprof转换一下格式。

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

<br>　　我们可以点击上图中的`“Details »”`按钮来查看详细信息。在继续向下讲解之前，还需要再插一个知识点。

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
　　笔者计算`Person2`对象的浅堆是`36`字节，就算在你的机器上计算的值与笔者计算的有偏差也不必在乎它们，因为误差不是我们关注重点。事实上，我们只是借助`Person2`类来理解浅堆和保留堆的概念，至于`Person2`类会占多少字节`Who cares?`，只要不是很离谱就可以了。

　　如果程序中有这样的代码：
``` java
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
``` java
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

　　这里要说一下的是，`Retained Heap`并不总是那么有效：

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

### Dominator Tree ###
　　MAT提供了一个称为`支配树`（Dominator Tree）的对象图。支配树体现了对象实例间的支配关系。在对象引用图中，所有指向对象`B`的路径都经过对象`A`，则认为对象`A`支配对象`B`。
　　简单的说，之所以提出支配树这个概念，就是为了计算对象的`Retained Heap`。

<center>
![](/img/android/android_8_17.png)
</center>

　　比如我们可以从上图左侧的引用图（对象`A`引用`B`和`C`，`B`和`C`又都引用到`D`）构造出右侧的`Dominator Tree`，计算出来的`Retained Memory`为：

	-  A的Retained Heap包括A本身和B，C，D，E。
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

　　当然，在实际操作的时候情况肯定会比上面的要复杂的多。比如我们有这样一段代码：
``` java
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
    // 此处省略了其它代码（加载图片等）。
}
```
    语句解释：
    -  本范例是通过Leaky泄露了MainActivity对象，并且我们在MainActivity中显示了一些图片。
    -  接下来我们就演示一下如何通过Bitmap对象来定位出内存泄露的根源。

　　依然是打开`Dominator Tree`视图，由于Bitmap比较大，所以在打开`Dominator Tree`的第一眼就能看到它，于是我们按照下图所示的操作，来查看Bitmap的引用连：

<center>
![](/img/android/android_8_21.png)
</center>

　　上图中排在第一的是`Resources`类型对象，由于一般是系统用于加载资源的，所以`Retained heap`较大是个比较正常的情况。但我们注意到下面有一个`Retained heap`很大的`Bitmap`对象，为了防止存在内存泄露的问题，我们就去看看它被谁引用了（如果没人引用，那这个Bitmap就被回收了，不会出现在hprof中）。
　　所以我们右键点击这行，选择`Path To GC Roots -> exclude weak references`：

	-  Path To GC Roots 选项用来告诉MAT将当前对象到某个GC根对象之间的所有引用链给列出来。
	-  exclude weak references选项用来告诉MAT，不用列出weak类型的引用，如果你只想查看强引用的话，可以直接选倒数第二项。
<br>　　然后可以看到下图的情形：

<center>
![](/img/android/android_8_22.png)
</center>

　　`Bitmap`最终被`leak`变量引用到，这应该是一种不正常的现象，内存泄漏很可能就在这里了。

　　也就是说，`MAT`不会告诉哪里是内存泄漏，需要你自行分析，由于这是`Demo`，是我们特意造成的内存泄漏，因此比较容易就能看出来，真实的应用场景可能需要你仔细的进行分析。

　　如果我们`Path To GC Roots -> with all references`，我们可以看到下图的情形：

<center>
![](/img/android/android_8_23.png)
</center>

　　可以看到还有另外一个对象在引用着这个`Bitmap`对象，了解`weak references`的同学应该知道`GC`是如何处理`weak references`，因此在内存泄漏分析的时候我们可以把`weak references`排除掉。

### Histogram ###
　　支配树用来把当前内存中的、符合筛选条件的对象，按照保留堆从大到小的顺序列出来。如果你希望根据某种类型的对象个数来分析内存泄漏，则可以使用`Histogram`视图。
　　与`Dominator Tree`一样，较小的对象可以通过在第一行的`“ClassName”`列中输入关键字进行查找。

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

　　从上图中我们发现第一个`byte[]`的`Retained heap`较大，内存泄漏的可能性较大。
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

## 内存泄露分析技巧 ##

<br>**第一，导出Bitmap对象。**

　　在[《 查看MAT中的bitmap》](http://blog.csdn.net/chenzhiqin20/article/details/51241249)中介绍了如何把 hprof 文件里的 Bitmap 给导出来，然后查看图片的内容。


<br>**第二，sPreloadDrawables属性。**

　　在查看hprof文件时，经常会发现一些Bitmap最终会被`Resources`的`sPreloadDrawables`属性所引用，如果导出这些图片查看的话，会发现咱们根本没用到它们，既然如此，那如果能将它们给释放掉，岂不是能降低不少内存？
　　其实不需要，这些图片是整个系统所有进程共有的，如果这些图片总共占25M内存的话，那这25M内存是由所有进程均摊的，所以说就算咱们把它给清了，最多也就能降低1M左右的内存。
　　[这里](http://blog.csdn.net/dingjikerbo/article/details/50540268) 有个哥们去清理了，而且从DDMS上看内存也确实被清了，人家的结果和我说的不一样的原因是：

	-  前面说过，进程真正占多少内存是由其Pss Total的值决定的，而不是Heap Size的值。
	-  这是因为Heap Size是一个有点虚高的值，它也将sPreloadDrawables里的图片的一起统计了。
	-  但是由于sPreloadDrawables里的图片所占的内存并不是当前进程一人承担，所以说它不是精确的值。
	-  同时，从AS和DDMS中看到的其实是Heap Size的值，所以肉眼上看起来内存降低了很多，但实际上则不多。
	-  如果各位不相信，可以按照他的方法清理试试，看看在清理之前和之后进程的Total Pss是否有很大差距。

<br>**第三，遍历功能。**

　　最常见的定位内存泄露的方法就是，手动遍历进程的所有界面，一边操作一边查看进程的内存信息，观察是否存在内存泄露。

　　比如，如果我们想测试MiuiHome进程是否存在泄露，则可以往桌面上加Widgets，具体测试步骤为：

	1、先把手机重启，让手机恢复到最低的内存状态（因为Home是系统进程没法杀，只有重启手机才能让Home重置内存）。
	2、起来之后，在AS或DDMS中为Home进程手动触发几次GC，然后就不要做任何操作了。
	3、接着使用dumpsys meminfo命令获取com.miui.home进程的内存信息，假设它叫log1，同时也导出Home进程的hprof文件，假设它叫hprof1，这两个文件稍后会用到。
	4、在桌面多放置几个大一点尺寸的Widgets，接着再把它们都给删了。
	5、手动触发几次GC，确保Home进程中此时包含尽可能少的垃圾对象。
	6、再次dump出com.miui.home的内存信息log2和hprof2，并让log2和log1进行比较。
	7、如果log2明显比log1多出很多内存，则就接着去比较hprof2比hprof1中多了哪些东西。
	8、所谓的比较两个hprof，主要就是看看它们的Histogram列出的类，比如是否多了Bitmap等（至于如何比较，后面会有范例）。

<br>**第四，比较两个hprof文件。**

　　假设我们有如下图所示的两个hprof文件，a是初始内存，b是执行N次操作后的内存：
<center>
![](/img/android/android_BY_a03_03.png)
</center>

　　通过观察可以发现，b里的String[]对象的个数多出了将近100个，我们接着使用“with incoming references”，去看看多出了哪些String[]。

	-  你可能会说String对象还多1000呢，你怎么不看？
	-  当然是先挑少的看了，不优先追踪只有2200多个对象的String[]，反而去追踪有6W+对象的String？
	-  不要搞事情，我跟你讲。

<br>　　接着继续比较String[]，如下图所示：
<center>
![](/img/android/android_BY_a03_04.png)
</center>

　　可以发现b（右侧的）里多出一些大小为960字节的String[]，而a中并没有，继续追踪下去发现如下引用链：
<center>
![](/img/android/android_BY_a03_05.png)
</center>

　　其实走到这里就可以做出判断了：

	-  首先在b.hprof中发现了大量的960字节的String[]数组。
	-  然后通过查看String[]的引用链发现，这些String[]并不是共存在某个集合中的，而是一对一的被持有的。
	-  因此内存中很有可能存在多个MusicListenerService对象，每个对象会间接引用一个String[]。

　　于是分别打开两份日志的dominator tree视图，可以看到如下所示：
<center>
![](/img/android/android_BY_a03_06.png)
</center>

　　找到问题后，剩下的事情就交给SystemUI的人搞就好了。

　　上面就是内存分析过程，干货就是定位问题的思路，希望对各位能有所帮助。

<br><br>
