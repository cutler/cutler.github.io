title: Framework篇　第三章 系统、进程、四大组件启动过程
date: 2016-3-30 18:05:12
categories: Android开发 - 白银
---
　　本章将从源码的角度来介绍一下操作系统、进程和四大组件的启动过程。本章第`3~6`节主要参考[《Android开发艺术探索》](http://item.jd.com/1710650057.html)。

　　在开始讲解知识之前，笔者有下面四点要说：

	-  第一，本文只分析Java层的代码，不包含C++层的代码。
	-  第二，请各位一定要跟随笔者描述的步骤去看一遍源码，否则你阅读本文时，会很不爽。
	-  第三，由于篇幅有限以及阅读方便，本文中列出的源码都是笔者简化后的，请自行查看完整源码。
	-  第四，如果您之前没接触过Framework层的话，那么本文您至少需要读两遍。

<!-- more -->
# 第一节 系统的启动 #
　　`Android`是基于`Linux`的开源操作系统，它的启动过程与`Linux`有很多相似的地方。

　　本节就来介绍一下它的启动过程。
## 基础入门 ##
　　当你按下电源开关后，Android设备执行了如下图所示的几个步骤：

<center>
![](/img/android/android_BY_c02_02.jpg)
</center>

<br>　　我们按照上图的顺序，看一下前四个操作：

	-  首先，Android设备上电后，会先启动ROM，并寻找Bootloader代码，将它加载到内存。
	-  然后，执行Bootloader，即先完成硬件的初始化，然后再找到Linux内核代码，并将它加载到内存。
	-  接着，启动Linux内核，即初始化各种软硬件环境，加载驱动程序，挂载根文件系统。
	-  最后，由内核启动init进程，它是整个系统第一个启动的进程，我们可以说它是root进程或者所有进程的父进程。
	   -  需要知道的是，init进程是Android启动过程中最核心的程序。
	   -  Android系统以及各大Linux的发行版，内核部分启动过程都是差不多的，他们之间区别就在于init进程的不同。
	   -  因为init进程决定了系统在启动过程中，究竟会启动哪些守护进程和服务，以及呈现出怎样的一个用户UI界面。

<br>　　其实前三步没什么好说的，我们只关注第四步中提到的`init`进程，它主要做了如下三件事：

	-  第一，是挂载目录，比如挂载/sys、/dev等目录。
	-  第二，运行init.rc脚本，一系列的Android服务在这时被启动起来。
	   -  这一步是最重要的，因为系统所有的功能都是依赖这些服务来完成的。比如拨打电话，使用WIFI，播放音视频等等。
	   -  只要这些服务都能正常地启动起来并且正常工作，整个Android系统也就完成了自己的启动。
	-  第三，在设备的屏幕上显示出“Android”logo了。

<br>　　事实上`init`进程启动的服务，可以划分为两类：一类是`本地服务`，另一类是`Android服务`。

<br>　　**本地服务**
	-  本地服务是指运行在C++层的系统守护进程，它又分为两部分：
	   -  一部分是init进程直接启动的，如ueventd、servicemanager、debuggerd、rild、mediaserver等。
	   -  另一部分是由本地服务进一步创建的，如mediaserver服务会启动AudioFlinger等本地服务。
	-  注意，每一个由init直接启动的本地服务都是一个独立的Linux进程，我们通过adb shell命令查看这些本地进程。

<br>　　**Android服务**
	-  Android服务是指运行在Dalvik虚拟机进程中的服务。
	-  init进程会创建Zygote进程，它是第一个Android进程，所有后续的Android应用程序都是由它fork出来的。

<br>　　以上是为了防止笔者与您之间存在知识断层，而补充的一些基础知识，各位接下来就准备`“迎接风暴吧”`。

## Zygote进程 ##
　　我们都知道，每一个App其实都是：

	-  一个单独的dalvik虚拟机
	-  一个单独的进程
　　为了实现资源共用和更快的启动速度，系统使用如下方式来开启新进程：

	-  每当要为App启动新进程时，都会fork（拷贝）一下zygote进程，并把fork出来的新进程做为App进程。
	-  也就是说，其他应用所在的进程都是Zygote的子进程。
	-  这就是将Zygote进程称为“受精卵”的原因，因为他确实和受精卵一样，能快速的分裂，并且产生遗传物质一样的细胞！

<br>　　既然`Zygote`进程这么重要，那么我们就来看看它是如何被系统启动的。

<br>　　我们忽略`C++`层的代码，系统最开始调用的`Java`层代码是`ZygoteInit.main()`方法：
``` java
public static void main(String argv[]) {
    try {
        // 此处省略若干代码。

        // 在加载首个zygote的时候，会传入初始化参数，使得startSystemServer = true
        boolean startSystemServer = false;
        String socketName = "zygote";
        String abiList = null;
        for (int i = 1; i < argv.length; i++) {
            if ("start-system-server".equals(argv[i])) {
                startSystemServer = true;
            } else if (argv[i].startsWith(ABI_LIST_ARG)) {
                abiList = argv[i].substring(ABI_LIST_ARG.length());
            } else if (argv[i].startsWith(SOCKET_NAME_ARG)) {
                socketName = argv[i].substring(SOCKET_NAME_ARG.length());
            } else {
                throw new RuntimeException("Unknown command line argument: " + argv[i]);
            }
        }

        // 此处省略若干代码。

        // 创建一个Socket的服务端，以便外界可以通过Socket技术来给当前Zygote进程发送数据。
        registerZygoteSocket(socketName);

        // 此处省略若干代码。

        // 启动一些系统服务。
        if (startSystemServer) {
            // 在操作系统中通常会提供一些公共的功能，让系统中的所有App共同访问，比如下面这些常见的系统服务：
            // ActivityManagerService（简称AMS）、PackageManagerService、WindowManagerService等。
            // 如果你没见过它们也没关系，暂时只需要知道它们都是公有的类就可以了，它们的功能稍后会介绍。
            // 既然是共用的，那么它们就应该存在一个单独的进程中，这样每个APP进程就可以通过IPC方式访问它们了。
            // 这个单独的进程是确实存在的，名字就叫SystemServer，上面的三个类都是运行在SystemServer进程中的。

            // 下面这行代码就是用来启动SystemServer进程的。
            startSystemServer(abiList, socketName);
        }

        // 此处省略若干代码。

        // 执行一个死循环，不断的监听是否有人给自己发数据。
        runSelectLoop(abiList);
        // 关闭Socket。
        closeServerSocket();
    } catch (MethodAndArgsCaller caller) {
        caller.run();
    } catch (RuntimeException ex) {
        Log.e(TAG, "Zygote died with exception", ex);
        closeServerSocket();
        throw ex;
    }
}
```
    语句解释：
    -  从上面的代码可以看到，当Zygote进程启动的时候，会先执行一些初始化操作，并调用startSystemServer方法创建服务。
    -  然后，它就开始进行无限的循环中了，循环监听Socket。

<br>　　我们接着来看看`Zygote`进程在`startSystemServer`方法中是如何启动`SystemServer`进程的：
``` java
private static boolean startSystemServer(String abiList, String socketName)
        throws MethodAndArgsCaller, RuntimeException {

    // 此处省略若干代码。

    String args[] = {
        "--setuid=1000",
        "--setgid=1000",
    "--setgroups=1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1018,1021,1032,3001,3002,3003,3006,3007",
        "--capabilities=" + capabilities + "," + capabilities,
        "--nice-name=system_server",
        "--runtime-args",
        "com.android.server.SystemServer",
    };
    ZygoteConnection.Arguments parsedArgs = null;
    int pid;

    try {
        parsedArgs = new ZygoteConnection.Arguments(args);
        ZygoteConnection.applyDebuggerSystemProperty(parsedArgs);
        ZygoteConnection.applyInvokeWithSystemProperty(parsedArgs);

        // 在forkSystemServer方法内部会调用本地方法，执行fork进程的操作。
        pid = Zygote.forkSystemServer(
                parsedArgs.uid, parsedArgs.gid,
                parsedArgs.gids,
                parsedArgs.debugFlags,
                null,
                parsedArgs.permittedCapabilities,
                parsedArgs.effectiveCapabilities);
    } catch (IllegalArgumentException ex) {
        throw new RuntimeException(ex);
    }

    // 笔者猜测，系统在fork Zygote进程时，是完完整整的拷贝。
    // 也就是说，fork进程不光会拷贝进程的空间，还会拷贝进程的当前方法调用栈。
    // 换句话说，下面这个if代码，在Zygote进程以及Zygote的子进程都会执行。
    // 但是只有Zygote的子进程中，变量pid的值才是0，即只有子进程会执行下面的if里的代码。
    // 而Zygote进程会直接返回true，然后进入到我们前面说的那个无限循环里去，继续监听Socket了。
    if (pid == 0) {
        if (hasSecondZygote(abiList)) {
            waitForSecondaryZygote(socketName);
        }

        // 子进程会接着执行下面的方法，注意它的参数parsedArgs，其实是对args的封装。
        // 而args的最后一个元素的值是：com.android.server.SystemServer，我们稍后会用到它。
        handleSystemServerProcess(parsedArgs);
    }

    return true;
}
```
    语句解释：
    -  虽然从上面代码中可以看到fork了SystemServer进程，但是并没有看到AMS等类被初始化。
    -  那么它们是在何时初始化的呢？ 别着急，马上就告诉你。


<br>　　接着来看`handleSystemServerProcess`方法的源码：
``` java
private static void handleSystemServerProcess(
        ZygoteConnection.Arguments parsedArgs)
        throws ZygoteInit.MethodAndArgsCaller {

    // 还记得Zygote进程一开始打开的那个Socket服务端吗？
    // 由于SystemServer进程并不需要那个功能，所以下面的代码就是用来把Socket给关掉的。
    closeServerSocket();

    // 此处省略若干代码。

    // 继续调用其他方法，执行初始化操作。
    RuntimeInit.zygoteInit(parsedArgs.targetSdkVersion, parsedArgs.remainingArgs, cl);

    // 此处省略若干代码。

    /* should never reach here */
}
```
    语句解释：
    -  第7行代码的出现，能从侧面证明，笔者在上面的猜测应该是对的。

<br>　　那么我们来看一下`RuntimeInit`的`zygoteInit`的方法：
``` java
public static final void zygoteInit(int targetSdkVersion, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {
    if (DEBUG) Slog.d(TAG, "RuntimeInit: Starting application from zygote");

    Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "RuntimeInit");
    redirectLogStreams();

    // 执行Java层的初始化操作，比如设置异常捕获器Thread.setDefaultUncaughtExceptionHandler等。
    commonInit();
    // 执行C++层的初始化操作，比如初始化Binder对象，便于以后进行IPC操作。
    nativeZygoteInit();
    // 应用程序相关的初始化，比如虚拟机相关、Target SDK版本等等。
    applicationInit(targetSdkVersion, argv, classLoader);
}

private static void applicationInit(int targetSdkVersion, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码

    VMRuntime.getRuntime().setTargetHeapUtilization(0.75f);
    VMRuntime.getRuntime().setTargetSdkVersion(targetSdkVersion);

    // 此处省略若干代码

    // 执行进程的入口函数，其实就是调用SystemServer的main方法。
    invokeStaticMain(args.startClass, args.startArgs, classLoader);
}
```
    语句解释：
    -  上面第27行代码中的args.startClass其实就是之前我们提到的com.android.server.SystemServer。

<br>　　接着来看一下`invokeStaticMain`方法，其实在该方法中使用了一个小技巧：
``` java
private static void invokeStaticMain(String className, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码
    Class<?> cl = Class.forName(className, true, classLoader);

    // 此处省略若干代码
    Method m = cl.getMethod("main", new Class[] { String[].class });

    // 此处省略若干代码

    /*
     * This throw gets caught in ZygoteInit.main(), which responds
     * by invoking the exception's run() method. This arrangement
     * clears up all the stack frames that were required in setting
     * up the process.
     */
    throw new ZygoteInit.MethodAndArgsCaller(m, argv);
}
```
    语句解释：
    -  在方法的最后抛出一个异常，并把m放到了异常中。
    -  这个异常最终会被ZygoteInit.main方法捕获，然后再由ZygoteInit.main去调用SystemServer类的main函数。
    -  为什么要这样做呢？注释里面已经讲得很清楚了，它是为了清理堆栈的，这样就会让SystemServer类的main函数觉得自己是进程的入口函数，而事实上，在执行它之前已经做了大量的工作了。

<br>　　我们看看`ZygoteInit.main`函数在捕获到这个异常的时候做了什么事：
``` java
// 此处省略若干代码

try {
    // 此处省略若干代码
} catch (MethodAndArgsCaller caller) {
    caller.run();
} catch (RuntimeException ex) {
    Log.e(TAG, "Zygote died with exception", ex);
    closeServerSocket();
    throw ex;
}

// 此处省略若干代码
```
    语句解释：
    -  直接调用了MethodAndArgsCaller的run方法，而run方法里的内容也就不言而喻了。
    -  至此应该可以彻底证实笔者的猜测了：系统在fork Zygote进程时，是完完整整的拷贝，不光会拷贝进程的空间，还会拷贝进程的当前方法调用栈。

<br>　　既然程序的流程走到了`SystemServer.main`方法中，那么我就来看看它的源码：
``` java
public static void main(String[] args) {
    new SystemServer().run();
}
private void run() {
    // 此处省略若干代码。

    // Create the system service manager.
    mSystemServiceManager = new SystemServiceManager(mSystemContext);
    LocalServices.addService(SystemServiceManager.class, mSystemServiceManager);

    // Start services.
    try {
        // 初始化AMS、PMS等类。
        startBootstrapServices();
        startCoreServices();
        // 初始化WMS等类。
        startOtherServices();
    } catch (Throwable ex) {
        Slog.e("System", "******************************************");
        Slog.e("System", "************ Failure starting system services", ex);
        throw ex;
    }

    // 此处省略若干代码。

    // 开启轮询。
    Looper.loop();
    throw new RuntimeException("Main thread loop unexpectedly exited");
}
```
    语句解释：
    -  可以看到，SystemServer初始化完各类服务之后，自己也通过Looper进入无限循环了。

<br>　　至此，整个开机流程算是被我们简单的过了一遍了，等我们进入`“黄金分段”`的时候，也许会进一步深入。

　　最后请记住一句话：

	-  妈的，我要用我手中的Q，拿回属于我的一切，操！

<br>**本节参考阅读：**
- [【凯子哥带你学Framework】Activity启动过程全解析](http://blog.csdn.net/zhaokaiqiang1992/article/details/49428287)
- [Android内核开发：图解Android系统的启动过程](http://ticktick.blog.51cto.com/823160/1659473)


# 第二节 进程的启动 #

<br>**初识AMS**

　　当手机开机时，操作系统会分别在`C/C++`和`java`层中启动很多服务。

　　其中就有一个`Java`层的组件，它运行在`SystemServer`进程里的，名为`ActivityManagerService`（简称`AMS`）。

	-  AMS有很多功能，后面我们会一一介绍，此处我们会涉及到它其中一个功能，就是为Android应用程序创建新的进程。
	-  即当用户请求启动四大组件时，系统会先检测该组件所在的进程是否已经启动。
	-  如果没有启动，则就会调用AMS去创建一个新的进程，然后在这个新的进程中启动该组件。


<br>　　当`AMS`需要启动新的进程时，会调用自己的`startProcessLocked`方法（至于该方法是被谁调用的，第三节再说）：
``` java
private final void startProcessLocked(ProcessRecord app, String hostingType,
        String hostingNameStr, String abiOverride, String entryPoint, String[] entryPointArgs) {

    // 此处省略若干代码。

    int uid = app.uid;
    int[] gids = null;

    // 此处省略若干代码。

    if (entryPoint == null) entryPoint = "android.app.ActivityThread";

    // 此处省略若干代码。

    Process.ProcessStartResult startResult = Process.start(entryPoint,
        app.processName, uid, uid, gids, debugFlags, mountExternal,
        app.info.targetSdkVersion, app.info.seinfo, requiredAbi, instructionSet,
        app.info.dataDir, entryPointArgs);

    // 此处省略若干代码。
}
```
    语句解释：
    -  首先，startProcessLocked方法执行了一些操作之后，转调用了Process.start函数去创建进程。
    -  需要注意的是，此时传递给Process.start方法的第一个参数的值是android.app.ActivityThread。
       -  ActivityThread是用户进程初始化时要加载的入口Java类，而且它就是我们常说的主线程，具体后述。

<br>　　在`Process`的`start`方法内部，又经历了如下几个调用：

	-  接着调用了Process的startViaZygote方法。
	-  接着调用了Process的openZygoteSocketIfNeeded方法，并在该方法中打开一个连接到Zygote进程的Socket。
	-  接着调用了Process的zygoteSendArgsAndGetResult方法，并将一些参数写入到刚才打开的那个Socket中。

<br>　　这样一来，程序的流程就从`SystemServer`进程中的`AMS`中转到了`Zygote`进程中了。

　　在第一节中已经说了，这个`Socket`由`ZygoteInit`类的`runSelectLoopMode`函数侦听，我们来看一下它的代码：
``` java
private static void runSelectLoop(String abiList) throws MethodAndArgsCaller {
    ArrayList<FileDescriptor> fds = new ArrayList<FileDescriptor>();
    ArrayList<ZygoteConnection> peers = new ArrayList<ZygoteConnection>();

    fds.add(sServerSocket.getFileDescriptor());
    peers.add(null);

    while (true) {
        // 此处省略若干代码。

        for (int i = pollFds.length - 1; i >= 0; --i) {
            if ((pollFds[i].revents & POLLIN) == 0) {
                continue;
            }
            if (i == 0) {
                ZygoteConnection newPeer = acceptCommandPeer(abiList);
                peers.add(newPeer);
                fds.add(newPeer.getFileDesciptor());
            } else {
                // 使用peers.get(i)得到的是一个ZygoteConnection对象，表示一个Socket连接。
                // 接着调用它的runOnce方法，从Socket中读取数据。
                boolean done = peers.get(i).runOnce();

                // 此处省略若干代码。
            }
        }

        // 此处省略若干代码。
    }
}
```
    语句解释：
    -  因此，接下来就是调用ZygoteConnection.runOnce方法进一步处理了。

<br>　　接着看一下`runOnce`方法的代码：
``` java
boolean runOnce() throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码

    // 执行创建进程的操作
    pid = Zygote.forkAndSpecialize(parsedArgs.uid, parsedArgs.gid, parsedArgs.gids,
            parsedArgs.debugFlags, rlimits, parsedArgs.mountExternal, parsedArgs.seInfo,
            parsedArgs.niceName, fdsToClose, parsedArgs.instructionSet,
            parsedArgs.appDataDir);

    // 此处省略若干代码

    try {
        if (pid == 0) {
            // in child
            IoUtils.closeQuietly(serverPipeFd);
            serverPipeFd = null;
            handleChildProc(parsedArgs, descriptors, childPipeFd, newStderr);

            // should never get here, the child is expected to either
            // throw ZygoteInit.MethodAndArgsCaller or exec().
            return true;
        } else {
            // in parent...pid of < 0 means failure
            IoUtils.closeQuietly(childPipeFd);
            childPipeFd = null;
            return handleParentProc(pid, descriptors, serverPipeFd, parsedArgs);
        }
    } finally {
        IoUtils.closeQuietly(childPipeFd);
        IoUtils.closeQuietly(serverPipeFd);
    }
}
```
    语句解释：
    -  有Linux开发经验的读者从forkAndSpecialize方法的名字就能看出它会创建一个进程。
    -  这个方法有两个返回值，一个是在当前进程中返回的，一个是在新创建的子进程中返回。
    -  在当前进程中的返回值就是新创建的子进程的pid值，而在子进程中的返回值是0，就跟之前一样，此时Zygote进程会继续监听Socket，而子进程则继续往下执行。
    -  我们沿着子进程的执行路径继续看下去，看到了在handleChildProc方法中又调用了RuntimeInit.zygoteInit方法。

<br>　　在第一节中，我们已经分析过`RuntimeInit`的`zygoteInit`方法了，它会抛出异常并被`main`方法捕获，此处就不再冗述。

　　经历了一番干柴烈火，程序流程终于走到了我们的主线程`ActivityThread`类中了：
``` java
public static void main(String[] args) {
    // 此处省略若干代码

    // 在当前线程中创建Looper对象。
    Looper.prepareMainLooper();

    ActivityThread thread = new ActivityThread();
    thread.attach(false);

    if (sMainThreadHandler == null) {
        sMainThreadHandler = thread.getHandler();
    }

    // 此处省略若干代码

    // 启动Looper，此后主线程只在消息队列里处理消息了。
    Looper.loop();

    // 此处省略若干代码
}
```
    语句解释：
    -  需要知道的是，ActivityThread本身并不是一个线程，在它内部有一个Handler类型的mH属性，用来接收外界传来的消息。
    -  这个mH属性就是使用的上面第5行代码所创建的Looper对象。
    -  通过观察可以发现，mH属性是实例的，这意味着只有在程序执行上面第7行代码时，mH才会被创建，而Looper对象是在第5行代码就创建，所以不会有问题。

<br>　　进程启动过程的源代码，我们就先分析到这里，更多的步骤咱们以后再慢慢谈。

　　最后请记住：

	-  我们的App、AMS以及zygote进程分属于三个独立的进程。
	-  App与AMS通过Binder进行IPC通信，AMS(在SystemServer进程中)与zygote通过Socket进行IPC通信。

<br>**本节参考阅读：**
- [Android应用程序进程启动过程的源代码分析](http://blog.csdn.net/luoshengyang/article/details/6747696)

# 第三节 Activity的启动 #
　　既然要介绍Activity的启动流程，那么肯定要从`startActivity`方法开始了。

<br>　　在开始之前需要知道两点：

	-  第一，startActivity方法最初是在Context类定义的，但在Activity类中对它进行了重写。
	-  第二，在Activity中提供了好几个startActivity方法重载，不过它们最终都会调用startActivityForResult方法。

<br>　　因此，我们就直接来看看`startActivityForResult`的源码：
``` java
public void startActivityForResult(Intent intent, int requestCode, @Nullable Bundle options) {

    // 如果当前Activity不是ActivityGroup的子Activity的话，则执行if里的代码。
    // 我们以前常用ActivityGroup来实现Tab切换界面，它在API level 13中被废弃了，具体请自行搜索。
    // 所以我们接下来只关心if里面的代码。
    if (mParent == null) {
        // 下面的代码会调用Instrumentation的execStartActivity方法执行启动任务。
        // 至于Instrumentation是什么，稍后介绍。
        Instrumentation.ActivityResult ar = mInstrumentation.execStartActivity(
                this, mMainThread.getApplicationThread(), mToken, this,
                intent, requestCode, options);

        // 此处省略若干代码。
    } else {
        if (options != null) {
            mParent.startActivityFromChild(this, intent, requestCode, options);
        } else {
            mParent.startActivityFromChild(this, intent, requestCode);
        }
    }
}
```
    语句解释：
    -  需要注意的是第10行中的“mMainThread.getApplicationThread()”：
       -  其中mMainThread就是我们的主线程ActivityThread，进程中的每个Activity对象都会持有它的引用。
       -  它的getApplicationThread方法返回的是一个IBinder对象。
    -  你可能会疑惑，我们为何要注意这个参数呢？这是因为：
       -  在startActivity这个操作中，稍后我们会经历一系列的方法调用，甚至于程序最终会跑到AMS的进程中去执行。
          -  各位不用奇怪为什么启动一个Activity还需要跳来跳去的，因为启动Activity并不是简单的创建个对象就行的。
          -  它还涉及到很多事物要处理，但遵循“单一职责”的原则每个类都只管一件事，所以只能跳来跳去。
       -  但是无论如何，实例化Activity对象的任务最终还是由我们的进程完成的。
       -  也就是说，这一些列的方法调用只是为了通知系统各个地方，我们要启动Activity了，最终执行启动还是我们自己。
       -  就像刚才说的，在这个过程中程序会跨进程进入到AMS中执行，那么“有去就得有回”才行。
       -  所以，这个IBinder对象就是我们抛给AMS的一个IPC接口。
       -  当AMS处理完毕所有的事情后，就通过这个IBinder对象来给我们发通知，也就是说，我们和AMS是互为Server端了。
    -  如果你没明白我在说什么，那么就暂时先记得它是一个回调就可以了，看了后面的步骤你就慢慢理解。

## Instrumentation ##

　　上面的代码提到了`Instrumentation`，在`Framework`层混的好汉们，谁人不知道这个类？因此必须得介绍一下它。

	-  Instrumentation翻译为仪器、仪表，用于在应用程序中进行“测量”和“管理”工作。
	-  Instrumentation将在进程启动的最开始时执行初始化（稍后详述），可以通过它监测Activity里的所有交互。

　　总之它有很多用途，而这里我们只介绍它与Activity相关的功能：

	-  一个Activity的创建、暂停、恢复操作，最终都会调用Instrumentation的方法来实现，如：
	   -  创建时，会调用callActivityOnCreate 
	   -  暂停时，会调用callActivityOnPause
	   -  恢复时，会调用callActivityOnResume
	-  而且一个进程中只有一个Instrumentation实例对象，就保存在ActivityThread中，且每个Activity都持有此对象的引用。

<br>　　接着来看一下`Instrumentation`的`execStartActivity`方法：
``` java
public ActivityResult execStartActivity(
        Context who, IBinder contextThread, IBinder token, Activity target,
        Intent intent, int requestCode, Bundle options) {

    // 此处省略若干代码。

    // 此时将IBinder类型转换为IApplicationThread类型的了。
    // 其实这个IBinder对象就是ActivityThread的内部类ApplicationThread的对象。
    // 而该类就实现了IApplicationThread接口，所以可以顺利转换。
    // 看不懂这段描述也没关系，我稍后会详细介绍ApplicationThread。
    IApplicationThread whoThread = (IApplicationThread) contextThread;

    // 此处省略若干代码。

    // 调用ActivityManagerNative去执行启动Activity，并将起返回值保存到result中。
    int result = ActivityManagerNative.getDefault()
        .startActivity(whoThread, who.getBasePackageName(), intent,
                intent.resolveTypeIfNeeded(who.getContentResolver()),
                token, target != null ? target.mEmbeddedID : null,
                requestCode, 0, null, options);

    // 检测result的值。
    checkStartActivityResult(result, intent);

    return null;
}

public static void checkStartActivityResult(int res, Object intent) {
    // 如果启动成功，则直接返回。
    if (res >= ActivityManager.START_SUCCESS) {
        return;
    }
    
    switch (res) {
        // 如果无法从Intent中解析出要启动的Activity，或者找不到该Activity，则就报错。
        case ActivityManager.START_INTENT_NOT_RESOLVED:
        case ActivityManager.START_CLASS_NOT_FOUND:
            if (intent instanceof Intent && ((Intent)intent).getComponent() != null)
                throw new ActivityNotFoundException(
                        "Unable to find explicit activity class "
                        + ((Intent)intent).getComponent().toShortString()
                        + "; have you declared this activity in your AndroidManifest.xml?");
            throw new ActivityNotFoundException(
                    "No Activity found to handle " + intent);

        // 此处省略若干代码。
    }
}
```
    语句解释：
    -  在checkStartActivityResult方法中我们看见了这个久违的异常。

## ActivityManager ##
　　接下来的内容会涉及到`Binder`相关的知识，请先去阅读[《Framework篇　第一章 Binder机制》](http://cutler.github.io/android-BY-C01/)再继续往下阅读。

<br>　　通过上一章的学习，可以知道`ActivityManagerNative`只是一个中转类：
``` java
// ActivityManagerNative是一个抽象类。
public abstract class ActivityManagerNative 
    extends Binder implements IActivityManager{
}

// 代理类
class ActivityManagerProxy implements IActivityManager{}
```
    语句解释：
    -  我们知道IPC通信有四个角色：client、server、binder驱动、SM，其中前两者与我们经常打交道。
    -  整个通信过程大致是这样的：
       -  首先，由server端定义接口，并在server端为这个接口提供一个实现类。
       -  然后，server端再通过Binder机制，把这个实现类返回给client。
       -  接着，client接到server端发来的对象后，就可以调用server端的接口了。
    -  将这上面说的过程转换到启动Activity的工作上时，它们各自对应的情况是：
       -  client就是指我们的进程，而server端指的是AMS所在的SystemServer进程。
       -  IActivityManager就是那个由server端定义的接口，而AMS就是那个接口在server端的具体实现类。
    -  而ActivityManagerNative(简称AMN)则只是一个中转类，在client和server进程中，各有一份该类的代码：
       -  server端的AMS继承了AMN，而AMN又继承了Binder类，也就是说AMN对server端的作用，就是用来将AMS发送到client端。
       -  而AMN对于client的端的作用，就是client可以通过AMN来调用服务端的接口。
       -  因为client接到的从server端传来的对象其实是ActivityManagerProxy类型的。
    -  另外，在IActivityManager里面定义各种操作三大组件（不包括内容提供者）的方法，同时AMS、AMN、AMP都实现这个接口。



<br>　　为了便于理解，笔者在这里以`AMS`的调用过程为例，带大家再走一遍`Binder`机制。

<br>　　接着上文，此时程序的流程还处于我们自己进程的`Instrumentation`的`execStartActivity`方法中。

　　然后程序调用`ActivityManagerNative.getDefault`获取单例对象，源码如下：
``` java
static public IActivityManager getDefault() {
    return gDefault.get();
}

// Singleton类用来定义一个单例对象。
private static final Singleton<IActivityManager> gDefault = new Singleton<IActivityManager>() {
    protected IActivityManager create() {

        // 从SM中查询出AMS的IBinder对象。
        IBinder b = ServiceManager.getService("activity");

        // 此处省略若干代码。

        // 使用IBinder对象创建一个IActivityManager的实现类
        IActivityManager am = asInterface(b);
 
        // 此处省略若干代码。

        return am;
    }
};

static public IActivityManager asInterface(IBinder obj) {
    if (obj == null) {
        return null;
    }

    // 在Binder机制中，若client和server在同一进程中，那么Binder驱动会将server端的Binder对象直接传给client。
    // 但如果二者不在同一个进程中，那么Binder驱动就会为server端的Binder对象创建一个影子对象。
    // 这个影子对象就是BinderProxy类型的。

    // 下面的代码通过调用IBinder接口的queryLocalInterface方法，尝试获取IActivityManager对象。
    // 如果obj对象是BinderProxy类型的话，in的值将为null。
    IActivityManager in =
        (IActivityManager)obj.queryLocalInterface(descriptor);
    if (in != null) {
        return in;
    }

    // 也就是说，如果obj对象是BinderProxy类型的话，就会使用obj去创建一个代理对象。
    return new ActivityManagerProxy(obj);
}
```
    语句解释：
    -  很显然，由于AMS是在SystemServer进程中的，所以最终获得到的对象是ActivityManagerProxy类型的。
    -  这意味着“ActivityManagerNative.getDefault().startActivity”调用的将是ActivityManagerProxy的方法。


<br>　　然后，来看看调用`ActivityManagerProxy.startActivity`方法的代码：
``` java
// 注意第一个参数的类型变成了IApplicationThread
public int startActivity(IApplicationThread caller, String callingPackage, Intent intent,
        String resolvedType, IBinder resultTo, String resultWho, int requestCode,
        int startFlags, ProfilerInfo profilerInfo, Bundle options) throws RemoteException {

    // 第一步，把参数放到Parcel中，准备发给远程进程。
    Parcel data = Parcel.obtain();
    Parcel reply = Parcel.obtain();
    // 将我们的Binder对象传递给AMS，当AMS处理完一切后，就使用它通知我们。
    data.writeStrongBinder(caller != null ? caller.asBinder() : null);

    // 此处省略若干代码。

    // 第二步，调用mRemote的transact方法，将参数传递到AMS进程中，并获取其返回值。
    // 其中ActivityManagerProxy类的mRemote属性是由刚才说的那个asInterface方法传递过来的。
    // 也就是说，最终将会调用BinderProxy的transact，执行跨进程通信的操作。
    mRemote.transact(START_ACTIVITY_TRANSACTION, data, reply, 0);
    reply.readException();

    // 第三步，将返回值返回，并回收Parcel所占用的资源。
    int result = reply.readInt();
    reply.recycle();
    data.recycle();
    return result;
}
```
    语句解释：
    -  在上一章中我们看过了类似的代码，这里不再重复解释。


<br>　　然后又经历了下面一番调用：

	-  首先，经过Binder驱动的中转，在client端对BinderProxy.transact方法的调用会转给AMS的transact方法。
	-  然后，由于AMS并没有重写transact方法，所以调用了它的父类ActivityManagerNative的transact方法。
	-  但是，由于ActivityManagerNative也没有重写，所以最终调用了Binder类的transact方法。

<br>　　那我们来看看`Binder`类的`transact`方法：
``` java
public final boolean transact(int code, Parcel data, Parcel reply,
        int flags) throws RemoteException {
    if (false) Log.v("Binder", "Transact: " + code + " to " + this);
    if (data != null) {
        data.setDataPosition(0);
    }
    boolean r = onTransact(code, data, reply, flags);
    if (reply != null) {
        reply.setDataPosition(0);
    }
    return r;
}
```
    语句解释：
    -  显而易见，程序会调用onTransact方法。
    -  这次AMS重写了这个方法，它做了一些操作后，又调用了父类ActivityManagerNative的onTransact方法。

<br>　　好吧，再去看看`ActivityManagerNative`的`onTransact`方法：
``` java
public boolean onTransact(int code, Parcel data, Parcel reply, int flags)
        throws RemoteException {
    switch (code) {
    case START_ACTIVITY_TRANSACTION:
    {
        data.enforceInterface(IActivityManager.descriptor);

        // 将我们的Binder接口读取出来。
        IBinder b = data.readStrongBinder();
        IApplicationThread app = ApplicationThreadNative.asInterface(b);
        String callingPackage = data.readString();
        Intent intent = Intent.CREATOR.createFromParcel(data);
        String resolvedType = data.readString();
        IBinder resultTo = data.readStrongBinder();
        String resultWho = data.readString();
        int requestCode = data.readInt();
        int startFlags = data.readInt();
        ProfilerInfo profilerInfo = data.readInt() != 0
                ? ProfilerInfo.CREATOR.createFromParcel(data) : null;
        Bundle options = data.readInt() != 0
                ? Bundle.CREATOR.createFromParcel(data) : null;

        // 调用当前对象的startActivity方法，并把我们的Binder对象传递过去。
        int result = startActivity(app, callingPackage, intent, resolvedType,
                resultTo, resultWho, requestCode, startFlags, profilerInfo, options);
        reply.writeNoException();
        reply.writeInt(result);
        return true;
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  由于当前对象其实就是AMS，所以最终会调用AMS的startActivity方法。

<br>　　然后在`AMS`的`startActivity`中又经历了如下调用：

	-  接着调用了ActivityManagerService的startActivityAsUser方法。
	-  接着调用了ActivityStackSupervisor的startActivityMayWait方法。
	-  接着调用了ActivityStackSupervisor的startActivityLocked方法。
	-  接着调用了ActivityStackSupervisor的startActivityUncheckedLocked方法。
	-  接着调用了ActivityStack的resumeTopActivityLocked方法。
	-  接着调用了ActivityStack的resumeTopActivityInnerLocked方法。
	-  接着调用了ActivityStackSupervisor的startSpecificActivityLocked方法。
	-  接着调用了ActivityStackSupervisor的realStartActivityLocked方法。

<br>　　我们来看一下`realStartActivityLocked`方法的源码：
``` java
final boolean realStartActivityLocked(ActivityRecord r,
        ProcessRecord app, boolean andResume, boolean checkConfig)
        throws RemoteException {

    // 此处省略若干代码。

    app.thread.scheduleLaunchActivity(new Intent(r.intent), r.appToken,
            System.identityHashCode(r), r.info, new Configuration(mService.mConfiguration),
            new Configuration(stack.mOverrideConfig), r.compat, r.launchedFromPackage,
            task.voiceInteractor, app.repProcState, r.icicle, r.persistentState, results,
            newIntents, !andResume, mService.isNextTransitionForward(), profilerInfo);

    // 此处省略若干代码。

    return true;
}
```
    语句解释：
    -  其中app.thread是类型的IApplicationThread，它就是我们从自己的进程中传递过来的回调。
    -  从上面可以看出，当AMS处理完所有事情后，就会调用app.thread来将程序的执行流程交回给我们。

<br>　　接下来打开`ApplicationThread`类的`scheduleLaunchActivity`方法，它又进行了如下调用：

	-  接着调用ActivityThread类的sendMessage方法，给ActivityThread的mH发送消息，消息的类型为H.LAUNCH_ACTIVITY。
	-  接着调用ActivityThread类的handleLaunchActivity方法。
	-  接着调用ActivityThread类的performLaunchActivity方法。

<br>　　咱们来看看这个`performLaunchActivity`方法：
``` java
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {

    // 此处省略若干代码。

    // 首先从ActivityClientRecord中获取待启动的Activity的组件信息。
    ComponentName component = r.intent.getComponent();

    // 此处省略若干代码。

    // 然后调用Instrumentation类的newActivity方法，创建Activity类的对象。
    java.lang.ClassLoader cl = r.packageInfo.getClassLoader();
    activity = mInstrumentation.newActivity(
            cl, component.getClassName(), r.intent);

    // 此处省略若干代码。

    // 接着调用了LoadedApk类的makeApplication方法创建Application对象（如果需要的话）。
    Application app = r.packageInfo.makeApplication(false, mInstrumentation);

    // 此处省略若干代码。

    // 接着调用Activity的attach方法，执行初始化操作。
    // 注意，此时ActivityThread会把自己的引用、自己的Instrumentation属性的引用传递给新Activity对象。
    // 这也就解释了，之前笔者说的整个进程中所有Activity共用一个Instrumentation对象的说法。
    // 同时也说明了，Activity的mMainThread属性就是指向的ActivityThread对象。
    activity.attach(appContext, this, getInstrumentation(), r.token,
            r.ident, app, r.intent, r.activityInfo, title, r.parent,
            r.embeddedID, r.lastNonConfigurationInstances, config,
            r.referrer, r.voiceInteractor);

    // 此处省略若干代码。

    return activity;
}
```
    语句解释：
    -  注释写的很清楚了，也是不多说。
    -  至于Activity的attach方法里面什么写什么代码，可以自己去看看。

<br>**本节参考阅读：**
- [Android Activity.startActivity流程简介](http://www.kancloud.cn/digest/androidframeworks/127785)


# 第四节 Service #
　　我们知道`Service`有两种启动方式，接下来就分别介绍它们的具体执行流程。

## 普通启动 ##
　　当我们在`Activity`中调用`startService`方法时，程序执行的其实是`ContextWrapper`类的方法。

<br>　　该方法的源码为：
``` java
public ComponentName startService(Intent service) {
    return mBase.startService(service);
}
```

<br>　　在继续向下讲解之前，需要先了解一下`Context`类的继承关系，如下图所示：

<center>
![](/img/android/android_BY_c02_01.jpg)
</center>

　　图释：

	-  首先要知道的是，Context是一个抽象类没法实例化对象，所以我们开发时用到的Context对象都是它子类的对象。
	-  然后从图上可以看出，Context有很多子类，其中比较常见的是ContextImpl和ContextWrapper。
	   -  创建Activity时，需要传递给它一个Context对象，而这个对象就是ContextImpl类型的。
	   -  而ContextWrapper之所以常见，就是因为它是Application、Service以及Activity的父类。
	   -  提示：Activity的直接父类是ContextThemeWrapper。

<br>　　既然上面说，`Activity`所持有的`Context`其实是`ContextImpl`类的对象，那么下面就用源码来证明：

	-  就像我们知道的那样，当启动Activity时，最终会调用ActivityThread的performLaunchActivity方法执行创建。在该方法中会依次做如下三件事：
	   -  第一，创建Activity对象。
	   -  第二，创建Application对象。
	   -  第三，调用Activity的attach方法。
	-  而事实上，在第二步和第三步之间，还有一步操作：创建Context对象。
	   -  此时会调用ActivityThread的createBaseContextForActivity方法。

<br>　　来看一下`createBaseContextForActivity`源码：
``` java
private Context createBaseContextForActivity(ActivityClientRecord r, final Activity activity) {

    // 此处省略若干代码。

    ContextImpl appContext = ContextImpl.createActivityContext(
            this, r.packageInfo, displayId, r.overrideConfig);
    appContext.setOuterContext(activity);
    Context baseContext = appContext;

    // 此处省略若干代码。

    return baseContext;
}
```
    语句解释：
    -  从代码中可以看出来，实例化的就是ContextImpl类的对象。

<br>　　我们接着来看一下`Activity`的`attach`方法的源码，看它是如何使用这个`ContextImpl`对象的：
```java
final void attach(Context context, ActivityThread aThread,
        Instrumentation instr, IBinder token, int ident,
        Application application, Intent intent, ActivityInfo info,
        CharSequence title, Activity parent, String id,
        NonConfigurationInstances lastNonConfigurationInstances,
        Configuration config, String referrer, IVoiceInteractor voiceInteractor) {
    // 保存Context的引用
    attachBaseContext(context);

    // 此处省略若干代码。

    // 创建Window对象，这个对象在研究Touch机制时会涉及到（Touch机制属于青铜选手的知识范围，已讲解）。
    mWindow = new PhoneWindow(this);
    mWindow.setCallback(this);

    // 此处省略若干代码。

    // 保存各类变量。
    mMainThread = aThread;
    mInstrumentation = instr;
    mToken = token;
    mIdent = ident;
    mApplication = application;
    mIntent = intent;

    // 此处省略若干代码。

    // 初始化WindowManager对象，这个对象在研究Touch机制时会涉及到（Touch机制属于青铜选手的知识范围，已讲解）。
    mWindow.setWindowManager(
            (WindowManager)context.getSystemService(Context.WINDOW_SERVICE),
            mToken, mComponent.flattenToString(),
            (info.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0);
    if (mParent != null) {
        mWindow.setContainer(mParent.getWindow());
    }
    mWindowManager = mWindow.getWindowManager();

    // 此处省略若干代码。
}
```
    语句解释：
    -  可以发现，Activity并没有简单的将Context保存到一个变量中，而是调用了attachBaseContext方法进行保存。

<br>　　跟进去之后，就会发现最终会调用`ContextWrapper`类的`attachBaseContext`方法：
``` java
protected void attachBaseContext(Context base) {
    if (mBase != null) {
        throw new IllegalStateException("Base context already set");
    }
    mBase = base;
}
```
    语句解释：
    -  至此我们就知道了，当我们在Activity中调用startService方法时，最终调用的是ContextImpl的方法。

<br>　　然后把话题拉回来，接着从的`ContextImpl.startService`方法开始看：
``` java
public ComponentName startService(Intent service) {
    warnIfCallingFromSystemProcess();
    return startServiceCommon(service, mUser);
}
private ComponentName startServiceCommon(Intent service, UserHandle user) {
    // 此处省略若干代码。

    ComponentName cn = ActivityManagerNative.getDefault().startService(
        mMainThread.getApplicationThread(), service, service.resolveTypeIfNeeded(
                    getContentResolver()), getOpPackageName(), user.getIdentifier());

    // 此处省略若干代码。
}
```
    语句解释：
    -  从上面的代码可以知道，程序最终会执行到AMS所在的进程中，并调用AMS的startService方法。


<br>　　然后在`AMS`的`startService`中又经历了如下调用：

	-  首先调用了ActiveServices的startServiceLocked方法。
	   -  ActiveServices是一个辅助AMS进行Service管理的类，包括启动、绑定、停止服务等。
	-  接着调用了ActiveServices的startServiceInnerLocked方法。
	-  接着调用了ActiveServices的bringUpServiceLocked方法。

<br>　　我们来看看`bringUpServiceLocked`方法的源码：
``` java
private final String bringUpServiceLocked(ServiceRecord r, int intentFlags, boolean execInFg,
        boolean whileRestarting) throws TransactionTooLargeException {

    // 此处省略若干代码。

    // 如果该服务已经被启动了，则调用它的生命周期方法（比如onStartCommand），然后直接返回。
    if (r.app != null && r.app.thread != null) {
        sendServiceArgsLocked(r, execInFg, false);
        return null;
    }

    // 此处省略若干代码。

    if (!isolated) {
        app = mAm.getProcessRecordLocked(procName, r.appInfo.uid, false);
        if (app != null && app.thread != null) {
            try {
                app.addPackage(r.appInfo.packageName, r.appInfo.versionCode, mAm.mProcessStats);

                // 执行启动Service的工作
                realStartServiceLocked(r, app, execInFg);
                return null;
            } catch (TransactionTooLargeException e) {
                throw e;
            } catch (RemoteException e) {
                Slog.w(TAG, "Exception when starting service " + r.shortName, e);
            }
        }
    } 

    // 此处省略若干代码。

    return null;
}

private final void realStartServiceLocked(ServiceRecord r,
        ProcessRecord app, boolean execInFg) throws RemoteException {
    
    // 此处省略若干代码。

    // 调用服务所在进程中的ActivityThread，通知它启动服务。
    app.thread.scheduleCreateService(r, r.serviceInfo,
            mAm.compatibilityInfoForPackageLocked(r.serviceInfo.applicationInfo),
            app.repProcState);

    // 此处省略若干代码。

    // 接着调用服务的生命周期方法（比如onStartCommand）。
    sendServiceArgsLocked(r, execInFg, true);

    // 此处省略若干代码。
}
```
    语句解释：
    -  上面注释写的很清楚了，此后程序流程将回到服务所在的进程中。

<br>　　与之前介绍的套路一样，最终会调用到`ActivityThread.handleCreateService`方法：
``` java
private void handleCreateService(CreateServiceData data) {

    // 此处省略若干代码。

    // 实例化服务对象
    java.lang.ClassLoader cl = packageInfo.getClassLoader();
    service = (Service) cl.loadClass(data.info.name).newInstance();

    // 此处省略若干代码。

    // 创建Context对象。
    ContextImpl context = ContextImpl.createAppContext(this, packageInfo);
    context.setOuterContext(service);

    // 创建Application对象。
    Application app = packageInfo.makeApplication(false, mInstrumentation);

    // 调用attach和onCreate方法。
    service.attach(context, this, data.info.name, data.token, app,
            ActivityManagerNative.getDefault());
    service.onCreate();
    // 将服务对象保存起来。
    mServices.put(data.token, service);

    // 此处省略若干代码。
}
```
    语句解释：
    -  对于服务的其它生命周期方法，最终也会调用到ActivityThread.handleServiceArgs方法，它的内容请自行去查看。

## 绑定启动 ##
　　绑定启动与普通启动的过程很相似。

<br>　　经历了几次简单的调用，就调到了`ContextImpl.bindServiceCommon`方法：
``` java
private boolean bindServiceCommon(Intent service, ServiceConnection conn, int flags,
        UserHandle user) {
    IServiceConnection sd;
    if (conn == null) {
        throw new IllegalArgumentException("connection is null");
    }
    if (mPackageInfo != null) {

        // 首先获取一个IServiceConnection对象。
        sd = mPackageInfo.getServiceDispatcher(conn, getOuterContext(),
                mMainThread.getHandler(), flags);
    } else {
        throw new RuntimeException("Not supported in system context");
    }
    validateServiceIntent(service);
    try {
        IBinder token = getActivityToken();
        if (token == null && (flags&BIND_AUTO_CREATE) == 0 && mPackageInfo != null
                && mPackageInfo.getApplicationInfo().targetSdkVersion
                < android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
            flags |= BIND_WAIVE_PRIORITY;
        }
        service.prepareToLeaveProcess();

        // 然后调用AMS的方法绑定服务，并将sd传递过去。
        int res = ActivityManagerNative.getDefault().bindService(
            mMainThread.getApplicationThread(), getActivityToken(), service,
            service.resolveTypeIfNeeded(getContentResolver()),
            sd, flags, getOpPackageName(), user.getIdentifier());
        if (res < 0) {
            throw new SecurityException(
                    "Not allowed to bind to service " + service);
        }
        return res != 0;
    } catch (RemoteException e) {
        throw new RuntimeException("Failure from system", e);
    }
}
```
    语句解释：
    -  在上面的代码中，涉及到一个IServiceConnection类的对象sd，简单的说它是对ServiceConnection的封装。
    -  因为绑定服务是可能跨进程的，所以就要求客户端与服务之间的这个ServiceConnection对象得基于Binder机制。
    -  如果跟进第10行代码的话，就会知道这个sd变量指向的对象本质上是ServiceDispatcher.InnerConnection类型的。并且它实现了IServiceConnection.Stub接口。


<br>　　接着流程就走到了`AMS`的`bindService`方法，并在其中又经历了如下调用：

	-  接着调用了ActiveServices的bindServiceLocked方法。
	-  接着调用了ActiveServices的bringUpServiceLocked方法。
	-  接着调用了ActiveServices的realStartServiceLocked方法。

　　细心的读者可以发现，后两步和普通启动`Service`执行的流程是一样的，具体过程就不冗述了。

<br>　　但是与普通启动方式不同的是，绑定启动服务在调用完服务的`onCreate`方法之后，还会接着调用`onBinder`方法。
　　我们来细化一下`realStartServiceLocked`方法的执行步骤：
``` java
private final void realStartServiceLocked(ServiceRecord r,
        ProcessRecord app, boolean execInFg) throws RemoteException {
    
    // 此处省略若干代码。

    // 调用服务所在进程中的ActivityThread，通知它启动服务。
    app.thread.scheduleCreateService(r, r.serviceInfo,
            mAm.compatibilityInfoForPackageLocked(r.serviceInfo.applicationInfo),
            app.repProcState);

    // 此处省略若干代码。

    // 尝试调用服务的onBinder方法。
    requestServiceBindingsLocked(r, execInFg);

    // 此处省略若干代码。

    // 接着调用服务的生命周期方法（比如onStartCommand）。
    sendServiceArgsLocked(r, execInFg, true);

    // 此处省略若干代码。
}
```

<br>　　为了锻炼大家的阅读源码的能力，就不带大家看源码了，只简单的说一下步骤：

	-  在requestServiceBindingsLocked中最终会调用服务所在进程的ActivityThread的scheduleBindService方法。
	-  然后就是调用handleBindService方法。

<br>　　来看一下`handleBindService`方法的源码：
``` java
private void handleBindService(BindServiceData data) {
    Service s = mServices.get(data.token);
    if (DEBUG_SERVICE)
        Slog.v(TAG, "handleBindService s=" + s + " rebind=" + data.rebind);
    if (s != null) {
        try {
            data.intent.setExtrasClassLoader(s.getClassLoader());
            data.intent.prepareToEnterProcess();
            try {
                if (!data.rebind) {
                    // 1、onBind方法只会在第一个访问者和服务建立连接时会调用。
                    // 2、onBind方法的返回值IBinder代表服务的一个通信管道，访问者通过该对象来访问服务中的方法。
                    // 3、onBind方法返回的IBinder对象会被传送给ServiceConnection接口的onServiceConnected方法。
                    IBinder binder = s.onBind(data.intent);
                    // 将服务的IBinder对象传递给客户端进程。
                    ActivityManagerNative.getDefault().publishService(
                            data.token, data.intent, binder);
                } else {
                    s.onRebind(data.intent);
                    ActivityManagerNative.getDefault().serviceDoneExecuting(
                            data.token, SERVICE_DONE_EXECUTING_ANON, 0, 0);
                }
                ensureJitEnabled();
            } catch (RemoteException ex) {
            }
        } catch (Exception e) {
            if (!mInstrumentation.onException(s, e)) {
                throw new RuntimeException(
                        "Unable to bind to service " + s
                        + " with " + data.intent + ": " + e.toString(), e);
            }
        }
    }
}
```


<br>　　接着流程就走到了`AMS`的`publishService`方法，并调用了`ActiveServices`的`publishServiceLocked`方法。

<br>　　在`publishServiceLocked`方法中，有如下代码：
``` java
void publishServiceLocked(ServiceRecord r, Intent intent, IBinder service) {

    // 此处省略若干代码。

    try {
        // 调用客户端传递过来的LoadedApk.ServiceDispatcher.InnerConnection对象的connected方法。
        c.conn.connected(r.name, service);
    } catch (Exception e) {
        Slog.w(TAG, "Failure sending service " + r.name +
              " to connection " + c.conn.asBinder() +
              " (in " + c.binding.client.processName + ")", e);
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  在InnerConnection的connected方法中，会转调用它外部类ServiceDispatcher的connected方法。


<br>　　接着就来看一下`ServiceDispatcher.connected`方法的源码：
``` java
public void connected(ComponentName name, IBinder service) {
    if (mActivityThread != null) {
        // 向主线程中发送消息。
        mActivityThread.post(new RunConnection(name, service, 0));
    } else {
        doConnected(name, service);
    }
}
```
    语句解释：
    -  其实如果你去追踪源码的话，就会发现mActivityThread其实就是主线程中的那个mH。

<br>　　后面的代码就不带大家看了，只简单的说一下步骤：

	-  首先，主线程会调用RunConnection的run方法。
	-  然后，会转调用doConnected方法。
	-  最后，在doConnected方法中就可以看到onServiceConnected的调用了。

# 第五节 BroadcastReceiver #
　　广播接收者的工作过程，主要包含两方面：广播的注册、广播的发送和接收；本节来简单介绍一下这两个过程。

<br>**动态注册**

　　广播的注册分为静态注册和动态注册，其中静态注册的广播是在应用安装时由系统自动完成注册，具体来说是由`PMS`来完成整个注册过程的。

	-  PMS就是PackageManagerService。
	-  除了广播注册的过程外，其它三大组建只能在应用安装时由PMS解析并注册。

<br>　　这里只分析广播的动态注册的过程，最先调用的同样是`ContextWrapper`类的`registerReceiver`方法。

　　经过几次跳转之后，程序就执行到了`ContextImpl`类的`registerReceiverInternal`方法：
``` java
private Intent registerReceiverInternal(BroadcastReceiver receiver, int userId,
        IntentFilter filter, String broadcastPermission,
        Handler scheduler, Context context) {
    IIntentReceiver rd = null;
    if (receiver != null) {
        if (mPackageInfo != null && context != null) {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            rd = mPackageInfo.getReceiverDispatcher(
                receiver, context, scheduler,
                mMainThread.getInstrumentation(), true);
        } else {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            rd = new LoadedApk.ReceiverDispatcher(
                    receiver, context, scheduler, null, true).getIIntentReceiver();
        }
    }
    try {
        return ActivityManagerNative.getDefault().registerReceiver(
                mMainThread.getApplicationThread(), mBasePackageName,
                rd, filter, broadcastPermission, userId);
    } catch (RemoteException e) {
        return null;
    }
}
```
    语句解释：
    -  从上面的代码可以发现，广播的注册和服务的绑定的步骤很类似，这是因为它们本质上都是在进行IPC。
    -  在上面的代码中，涉及到一个IIntentReceiver类的对象rd，简单的说它是对BroadcastReceiver的封装。
    -  如果跟进第10行代码的话，就会知道这个rd变量指向的对象本质上是ReceiverDispatcher.InnerReceiver类型的。并且它实现了IIntentReceiver.Stub接口。


<br>　　接着流程就走到了`AMS`的`registerReceiver`方法：
``` java
public Intent registerReceiver(IApplicationThread caller, String callerPackage,
        IIntentReceiver receiver, IntentFilter filter, String permission, int userId) {

    // 此处省略若干代码。

    // 将Binder对象保存起来，当广播来临时用它进行回调。
    mRegisteredReceivers.put(receiver.asBinder(), rl);

    // 创建一个意图过滤器，用来让系统匹配广播。
    BroadcastFilter bf = new BroadcastFilter(filter, rl, callerPackage,
            permission, callingUid, userId);
    rl.add(bf);
    if (!bf.debugCheck()) {
        Slog.w(TAG, "==> For Dynamic broadcast");
    }
    // 将意图过滤器保存起来。
    mReceiverResolver.addFilter(bf);

    // 此处省略若干代码。
}
```
    语句解释：
    -  正如大家看到的那样，所谓的广播注册，本质上就是在AMS中添加一些记录。

<br>**发送广播**

　　当我们通过`sendXxx`方法发送广播时，`AMS`会查找出匹配的广播接收者并将广播发送给它们处理。

	-  广播有普通广播和有序广播之分。
	-  虽然二者有不同的特性，但是它们发送和接收的过程是类似的，因此这里只分析普通广播的实现。

<br>　　我们依然是从`ContextImpl`类的`sendBroadcast`方法开始说，然后会调用`AMS`的`broadcastIntent`方法。

　　然后会接着调用`AMS`的`broadcastIntentLocked`方法：

``` java
private final int broadcastIntentLocked(ProcessRecord callerApp,
            String callerPackage, Intent intent, String resolvedType,
            IIntentReceiver resultTo, int resultCode, String resultData,
            Bundle resultExtras, String[] requiredPermissions, int appOp, Bundle options,
            boolean ordered, boolean sticky, int callingPid, int callingUid, int userId) {

    intent = new Intent(intent);

    // 从Android 3.1开始的Android加入了一种保护机制，这个机制导致程序接收不到某些系统广播，其中就包含了开机启动广播。
    // 系统为Intent添加了两个flag，FLAG_INCLUDE_STOPPED_PACKAGES和FLAG_EXCLUDE_STOPPED_PACKAGES。
    // 用来控制Intent是否要对处于stopped状态的App起作用，如果一个App安装后未启动过或者被用户在管理应用中手动
    // 停止（强行停止）的话，那么该App就处于stopped状态了。
    // FLAG_INCLUDE_STOPPED_PACKAGES：表示包含stopped的App
    // FLAG_EXCLUDE_STOPPED_PACKAGES：表示不包含stopped的App

    // 从Android3.1开始，系统会为所有广播默认添加FLAG_EXCLUDE_STOPPED_PACKAGES标识。
    // 当FLAG_INCLUDE_STOPPED_PACKAGES和FLAG_EXCLUDE_STOPPED_PACKAGES共存时，以前者为准。
    intent.addFlags(Intent.FLAG_EXCLUDE_STOPPED_PACKAGES);

    // 此处省略若干代码。

    if ((receivers != null && receivers.size() > 0)
            || resultTo != null) {
        BroadcastQueue queue = broadcastQueueForIntent(intent);
        BroadcastRecord r = new BroadcastRecord(queue, intent, callerApp,
                callerPackage, callingPid, callingUid, resolvedType,
                requiredPermissions, appOp, brOptions, receivers, resultTo, resultCode,
                resultData, resultExtras, ordered, sticky, false, userId);

        if (DEBUG_BROADCAST) Slog.v(TAG_BROADCAST, "Enqueueing ordered broadcast " + r
                + ": prev had " + queue.mOrderedBroadcasts.size());
        if (DEBUG_BROADCAST) Slog.i(TAG_BROADCAST,
                "Enqueueing broadcast " + r.intent.getAction());

        boolean replaced = replacePending && queue.replaceOrderedBroadcastLocked(r);
        if (!replaced) {
            // 将所有满足条件的广播接收者放到BroadcastQueue中。
            queue.enqueueOrderedBroadcastLocked(r);
            // 发送广播。
            queue.scheduleBroadcastsLocked();
        }
    }

    return ActivityManager.BROADCAST_SUCCESS;
}
```
    语句解释：
    -  无。


<br>　　接着流程就走到了`BroadcastQueue`的`scheduleBroadcastsLocked`方法，并在其中又经历了如下调用：

	-  接着在其内部通过Handler发送一个消息。
	-  接着调用了BroadcastQueue的processNextBroadcast方法。
	-  接着调用了BroadcastQueue的deliverToRegisteredReceiverLocked方法。
    -  接着调用了BroadcastQueue的performReceiveLocked方法。

<br>　　我们来看看`performReceiveLocked`方法的源码：
``` java
private static void performReceiveLocked(ProcessRecord app, IIntentReceiver receiver,
        Intent intent, int resultCode, String data, Bundle extras,
        boolean ordered, boolean sticky, int sendingUser) throws RemoteException {
    // Send the intent to the receiver asynchronously using one-way binder calls.
    if (app != null) {
        if (app.thread != null) {
            // If we have an app thread, do the call through that so it is
            // correctly ordered with other one-way calls.
            app.thread.scheduleRegisteredReceiver(receiver, intent, resultCode,
                    data, extras, ordered, sticky, sendingUser, app.repProcState);
        } else {
            // Application has died. Receiver doesn't exist.
            throw new RemoteException("app.thread must not be null");
        }
    } else {
        receiver.performReceive(intent, resultCode, data, extras, ordered,
                sticky, sendingUser);
    }
}
```
    语句解释：
    -  显而易见，此时程序的流程会回到广播接收者所在的进程中的ApplicationThread类。

<br>　　那接着就来看看`ApplicationThread.scheduleRegisteredReceiver`方法：
``` java
public void scheduleRegisteredReceiver(IIntentReceiver receiver, Intent intent,
        int resultCode, String dataStr, Bundle extras, boolean ordered,
        boolean sticky, int sendingUser, int processState) throws RemoteException {
    updateProcessState(processState, false);

    // 调用之前创建的ReceiverDispatcher.InnerReceiver对象的方法。
    receiver.performReceive(intent, resultCode, dataStr, extras, ordered,
            sticky, sendingUser);
}
```
    语句解释：
    -  接着在ReceiverDispatcher.InnerReceiver中又会调用在ReceiverDispatcher的performReceive方法。
    -  接着会创建一个Args对象，并把它放到主线程中执行，Args是Runnable的子类。
    -  接着在Args类的run方法里就可以看到对广播接收者onReceive的调用。


# 第六节 ContentProvider #
　　内容提供者也是通过`Binder`机制向其他组件提供数据的：

	-  当ContentProvider所在的进程被启动时，ContentProvider会同时启动并被发布到AMS中。
	-  另外，ContentProvider的onCreate方法比Application的onCreate方法更早被调用。
	-  这意味着，如果我们想知道ContentProvider的启动过程的话，那就势必得得看进程启动相关的代码了。

<br>　　在第一节中我们分析了进程的启动流程的前半部分，接下来就接着一起来看看后半部分。

　　那咱们就从`ActivityThread`的`attach`方法开始：
``` java
private void attach(boolean system) {

    // 此处省略若干代码。

    final IActivityManager mgr = ActivityManagerNative.getDefault();
    try {
        mgr.attachApplication(mAppThread);
    } catch (RemoteException ex) {
        // Ignore
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  在attach方法中会进行一系列的初始化操作。
    -  其中比较重要的一步就是，会将ActivityThread通过AMS的attachApplication方法跨进程传递到AMS中。

<br>　　在`AMS`的`attachApplication`方法中又调用了`attachApplicationLocked`方法：
``` java
private final boolean attachApplicationLocked(IApplicationThread thread,
        int pid) {

    // 此处省略若干代码。

    // 调用用户进程的bindApplication方法，通知其注册完毕。
    thread.bindApplication(processName, appInfo, providers, app.instrumentationClass,
            profilerInfo, app.instrumentationArguments, app.instrumentationWatcher,
            app.instrumentationUiAutomationConnection, testMode, enableOpenGlTrace,
            isRestrictedBackupMode || !normalMode, app.persistent,
            new Configuration(mConfiguration), app.compat,
            getCommonServicesLocked(app.isolated),
            mCoreSettingsObserver.getCoreSettingsLocked());

    // 此处省略若干代码。

    // 我们来缕一下流程：
    // 首先，当我面启动一个Activity时，系统会判断：
    //      若该Activity所在的进程已经存在，则直接启动，并返回。
    //      若该Activity所在的进程不存在，则AMS会先去开启一个进程。
    // 接着，当新进程启动完毕后，新进程会按照上面说的那样，调用AMS的方法把它自己的ActivityThread注册到AMS中。
    // 接着，当AMS给新进程发送“注册完毕”的通知后，它就会检测：
    //      是否有需要启动的Activity、Service、BroadcastReceiver? 如果有，则就启动它们。
    //      而下面的这个代码，就是检测是否需要启动Activity的，相应的还有启动服务和广播接收者的代码，
    //      不过被我给省略了。之所以没有ContentProvider，是因为他是在进程启动的时候，就同时被启动了。
    if (normalMode) {
        try {
            if (mStackSupervisor.attachApplicationLocked(app)) {
                didSomething = true;
            }
        } catch (Exception e) {
            Slog.wtf(TAG, "Exception thrown launching activities in " + app, e);
            badApp = true;
        }
    }

    // 此处省略若干代码，其中就包括对Service、BroadcastReceiver的启动相关的代码。

    return true;
}
```
    语句解释：
    -  各位可以去mStackSupervisor.attachApplicationLocked中看看，是否有启动Activity相关的代码。

<br>　　当程序流程回到用户进程的时候，会在主线程中调用`handleBindApplication`方法：
``` java
private void handleBindApplication(AppBindData data) {

    // 此处省略若干代码。

    // 第一，创建Instrumentation对象。
    java.lang.ClassLoader cl = instrContext.getClassLoader();
    mInstrumentation = (Instrumentation)
        cl.loadClass(data.instrumentationName.getClassName()).newInstance();

    // 此处省略若干代码。

    // 第二，创建Application对象。
    Application app = data.info.makeApplication(data.restrictedBackupMode, null);
    mInitialApplication = app;

    // 此处省略若干代码。

    // 第三，启动当前进程的ContentProvider并调用onCreate方法
    if (!data.restrictedBackupMode) {
        List<ProviderInfo> providers = data.providers;
        if (providers != null) {
            installContentProviders(app, providers);
            // For process that contains content providers, we want to
            // ensure that the JIT is enabled "at some point".
            mH.sendEmptyMessageDelayed(H.ENABLE_JIT, 10*1000);
        }
    }

    // 第四，调用Application对象的onCreate方法。
        
    mInstrumentation.callApplicationOnCreate(app);
}
```
    语句解释：
    -  在handleBindApplication方法中做了很多事，我们主要就关注上面四件事。
    -  就像第二节说的那样，整个进程中只会有一个对象Instrumentation，而这个对象就是在此时创建的。


<br>　　接着深入`installContentProviders`方法去看看：
``` java
private void installContentProviders(
        Context context, List<ProviderInfo> providers) {
    final ArrayList<IActivityManager.ContentProviderHolder> results =
        new ArrayList<IActivityManager.ContentProviderHolder>();

    // 遍历所有内容提供者
    for (ProviderInfo cpi : providers) {
        if (DEBUG_PROVIDER) {
            StringBuilder buf = new StringBuilder(128);
            buf.append("Pub ");
            buf.append(cpi.authority);
            buf.append(": ");
            buf.append(cpi.name);
            Log.i(TAG, buf.toString());
        }
        
        // 在下面的installProvider方法中执行了实例化ContentProvider的操作。
        // 然后通过ContentProvider的attachInfo方法来调用其onCreate方法。
        // 接着将ContentProvider封装成一个cph对象，并把它放入到results中。
        IActivityManager.ContentProviderHolder cph = installProvider(context, null, cpi,
                false /*noisy*/, true /*noReleaseNeeded*/, true /*stable*/);
        if (cph != null) {
            cph.noReleaseNeeded = true;
            results.add(cph);
        }
    }

    try {
        // 将这些内容提供者发布到AMS中。
        ActivityManagerNative.getDefault().publishContentProviders(
            getApplicationThread(), results);
    } catch (RemoteException ex) {
    }
}
```
    语句解释：
    -  和服务、广播接收者一样，做为组件是不能直接跨进程的，所以要将他封装成一个ContentProviderHolder对象。
    -  在AMS的publishContentProviders方法中，会将这些观察者保存到一个名为mProviderMap的属性里。

<br>　　接着深入`installProvider`方法去看看：
``` java
private IActivityManager.ContentProviderHolder installProvider(Context context,
    IActivityManager.ContentProviderHolder holder, ProviderInfo info,
    boolean noisy, boolean noReleaseNeeded, boolean stable) {

    // 此处省略若干代码。

    final java.lang.ClassLoader cl = c.getClassLoader();
    localProvider = (ContentProvider)cl.
        loadClass(info.name).newInstance();
    // 获取ContentProvider的IContentProvider对象。
    provider = localProvider.getIContentProvider();

    // 此处省略若干代码。

    localProvider.attachInfo(c, info);

    // 此处省略若干代码。
}
```
    语句解释：
    -  之所以要将ContentProviderHolder传给AMS，是为了当AMS接到请求时，好把请求转给内容提供者处理。
    -  因此这是一个跨进程的操作，也就是说ContentProviderHolder内部都应该是支持跨进程的。
    -  但是做为组件的ContentProvider是不能跨进程的。
    -  所以被封装到ContentProviderHolder中的其实是IContentProvider对象，它是一个Binder接口。
    -  可以进入到内容提供者的getIContentProvider方法里看看，它返回的是一个Transport对象。
    -  当AMS转发的请求最后就会交给这个Transport处理。

<br>　　现在我们回过头来看看，当客户端访问`ContentProvider`的`query`方法时，程序的执行流程。

	-  首先调用的依然是ContextWrapper类的getContentResolver方法。
	-  接着通过追踪源码可以发现，会转调用ApplicationContentResolver的query方法。
	-  接着由于ApplicationContentResolver没有重写query方法，所以会调用ContentResolver的。
	-  接着会调用acquireUnstableProvider方法。
	-  接着经历一些跳转，会调用到ActivityThread的acquireProvider方法。
	-  接着会调用AMS的getContentProvider方法，然后进行一些列的调用，最终返回一个IContentProvider对象。
	-  接着再用这个IContentProvider对象调用query方法，也就是调用到Transport对象中了。

# 结尾 #
　　至此，本章就算完结了，以后有时间再来进一步完善细节部分。

　　如果想看`C/C++`部分的源码分析，则等笔者晋级到`“黄金分段”`时再说吧。

<br><br>
　　







