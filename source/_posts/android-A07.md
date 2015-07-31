title: 入门篇　第七章 Process 与 Thread
date: 2015-1-15 16:35:14
categories: Android
---
　　当`应用程序A`请求启动`应用程序B`的某个组件时：

	-  若应用B在此之前并没有运行，Android系统会先给应用B启动一个新的Linux进程，然后再在这个进程里启动该组件。
	-  若应用B的进程已经存在，那么就会直接在这个进程中启动组件。

　　本章讨论`Android`应用程序中进程和线程是怎样工作的。

# 第一节 Process #
　　默认情况下，同一应用程序的所有组件都运行在同一进程中，并且大多数应用程序都不应该改变这种模式。但是，如果你发现需要控制某个组件属于哪个进程时，你能够在清单文件中做这件事情。

　　四大组件`<activity>`、`<service>`、`<receiver>`、和`<provider>`都支持一个`android:process`属性，它能够指定组件应该运行在哪个进程中。通过这个属性可以让每个组件运行在它自己的进程中，或者让某些组件共享一个进程，而其他的不共享。也可以让不同应用程序的组件运行在同一个进程中——前提是两者需要提供应用程序共享的相同的`Linux`用户`ID`和相同的证书签名。
　　`<application>`元素也支持一个`android:process`属性，用于设置应用程序所有组件`android:process`属性的默认值。

　　当系统内存低并且其它进程要求立即服务用户的时候，Android系统可以决定在某个时点关掉一个进程，运行在这个进程中的应用程序组件也会因进程被杀死而销毁。当用户再次要求被杀死的进程为其工作时，包含这些组件的进程会再次被启动。当要决定要杀死哪个进程时，Android系统会权衡它们对用户的重要性。
　　例如，跟持有可见`Activity`的进程相比，系统更容易关掉持有不在屏幕上显示的`Activity`的进程。
　　因此，要决定是否终止一个进程，依赖于那个进程中组件的运行状态。本节将讨论`Android`决定要终止哪个进程时所使用的规则。

## 进程的优先级 ##
　　`Android`系统会尝试尽可能长维护一个应用程序进程，但是最终为了给新的或更重要的进程回收内存时要删除旧的进程。要决定哪个进程要保留，哪个进程要杀死，系统会基于进程中运行的组件和这些组件的状态把每个进程放到一个`“重要性层次表”`中，带有最低重要性的进程会首先被销毁，然后是下一个最低重要的，依次类推，直到系统回收到了需要的资源。
　　在重要性层次中有五个级别，接下来按照重要性的顺序列出了不同类型进行的表现（第一种类型进程是最终的并且在最后被杀死）。

<br>**前台进程**
　　一个进程满足以下任何条件都被认为是前台进程：

	A.  进程持有一个正在跟用户交互的Activity对象（它的onResume()方法已经被调用）。
	B.  进程持有一个正在跟用户交互的Activity所绑定的Service对象。
	C.  进程持有一个正在前台运行的Service对象，这个Service已经调用了startForeground()方法。
	D.  进程持有正在执行生命周期的一个回调方法的Service对象（onCreate()、onStart()、或onDestroy()）。
	E.  进程持有一个正在执行onReceive()方法的BroadcastReceiver对象。
　　一般情况，在给定的时间内只有很少的前台进程存在，只有当设备已到达内存的饱和状态时，系统才会杀死一些前台进程来保持对用户界面的响应。

<br>**可见进程**
　　可见进程是指没有任何前台组件的一个进程，但是仍然能够影响用户在屏幕上看到的内容。如果满足下列条件之一，进程被认为是可见的：

	A.  进程持有一个不在前台的Activity，但是这个Activity依然对用户可见（它的onPause()方法已经被调用）。
	    -  如前台程序启动一个对话框风格的Activity。
	B.  进程持有一个绑定到一个可见（或前台）的Activity的Service。

<br>**服务进程**
　　服务进程是指持有了一个用`startService()`方法启动的服务的进程，并且这个进程没有被归入上面介绍的两个分类。
　　虽然服务进程不直接跟用户看到的任何东西捆绑，但是，通常他们都在做用户关心的事情（如在后台播放音乐，或下载网络上的数据），除非前台和可见进程的内存不足，否则系统会一直保留它们。

<br>**后台进程**
　　后台进程是指持有一个用户当前不可见的`Activity`的进程（即`onStop()`方法已经被调用）。
　　这些进程不会直接影响用户体验，并且为了给前台、可见、或服务进程回收内存，系统能够在任何时候杀死它们。
　　通常会有很多后台进程在运行，因此它们被保留在一个`LRU`（Least recently used）列表中以确保用户最近看到的那个带有`Activity`的进程最后被杀死。如果一个`Activity`正确的实现了它的生命周期方法，并且保存了当前的状态，那么杀死它的进程将不会影响用户的视觉体验，因为当用户返回到这个`Activity`时，这个`Activity`会恢复所有的可见状态。

<br>**空进程**
　　空进程是指不持有任何活动的应用程序组件的一个进程。保留这种进程存活的唯一原因是为了缓存的目的，以便提高需要在其中运行的组件的下次启动时间。为了平衡进程缓存和基础内核缓存之间的整体系统资源，系统会经常杀死这些进程。

<br>**特殊说明**
　　1、Android基于进程中当前活跃的组件的重要性来安排一个进程的级别（`选择其中优先级最高的作为进程的级别`）。

	例如，一个进程持有一个Service和一个可见的Activity，那么这个进程就会被安排到可见进程而不是服务进程。

　　2、`一个进程的排名可能因为其他进程的依赖而上升`。一个正在服务另一个进程的进程，它的排名不会比它所服务的那个进程低。

	例如，进程A中的一个内容提供器服务与客户端进程B，或者进程A中的一个服务绑定了进程B中的一个组件，那么进程A始终被认为比进程B重要。

　　3、因为运行服务的进程的排名要比带有后台Activity的进程高，因此执行一个耗时的任务时（比如下载），应该为此操作启动一个服务，以此来提高进程优先级，降低被杀死的几率，而不是简单的创建一个工作线程。

	例如，给一个网站上传图片的Activity就应该启动一个执行上传功能的服务，以便上传能够在后台持续工作，即使用户离开了这个Activity。
	同样的，Broadcast Receiver应该采用服务而不是简单的放在一个耗费操作时间的线程中。

<br>　　范例1：获取当前系统中的所有进程的信息。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        // 获取当前系统中所有正在运行的进程。若无任何进程运行，则返回null 。此List中的元素是无序的。
        List<RunningAppProcessInfo> list = manager.getRunningAppProcesses();
        for (RunningAppProcessInfo p : list) {
            // processName表示进程的名称。
            // pid表示进程的id（全局唯一）。
            System.out.println(p.processName +","+ p.pid + "," + p.importance);
        }
    }
}
```

    语句解释：
    -  importance表示进程的重要性，其值越小进程的优先级越高，常用取值为：
       -  RunningAppProcessInfo.IMPORTANCE_FOREGROUND：100
       -  RunningAppProcessInfo.IMPORTANCE_VISIBLE：200
       -  RunningAppProcessInfo.IMPORTANCE_SERVICE：300
       -  RunningAppProcessInfo.IMPORTANCE_BACKGROUND：400
       -  RunningAppProcessInfo.IMPORTANCE_EMPTY：500
       -  RunningAppProcessInfo.IMPORTANCE_GONE：1000

<br>　　通过上面的API我就可以实现“一键释放内存”的功能，将优先级低的进程给杀掉。

# 第二节 Thread #
　　应用程序启动时，`Android`系统会给应用程序创建一个叫做`“main”`的执行线程，`“main”`线程也被称为叫`UI线程`。这个线程很重要，因为它负责给用户界面调度事件，包括描画事件。

　　系统不会给每个组件的实例创建一个单独的线程，运行在同一个进程的所有的组件都被实例化在`UI线程`中。
　　同时，系统回调的方法（如组件生命周期的回调方法）始终运行在这个进程的UI线程中。
　　例如，当用户触摸屏幕上的一个按钮时，你的应用程序的`UI线程`会调度对应窗口的`touch`事件，它会依次设置按钮的按下状态，并且把一个有效的请求发送给这个事件队列，`UI线程`会让请求出队并通知对应的窗口应该重绘自己。

　　如果你把每件正在发生的事情都放在`UI线程`中（如网络访问、数据库查询等耗时操作），这些操作将会使整个`UI`被阻塞。`UI线程`被阻塞时，任何事件都不能被调度，包括描画事件。从用户的角度，应用程序似乎被挂起了。甚至更糟，如果`UI线程`被阻塞几秒钟（大约是`5`秒钟），用户就会看到臭名昭著的`“应用程序没有响应”（ANR）`对话框。那么用户就可能决定退出你的应用程序，并且如果他们感觉不好，还会`怒删`你的应用程序。

## 工作线程 ##
　　因此你的应用程序一定不要阻塞UI线程，如果你执行的不是瞬时操作，就应该用一个单独的线程来工作。
　　例如，下面`click`方法里的代码就是从一个单独的线程中下载图片，并在一个`ImageView`对象中显示它：
``` android
public void onClick(View v) {
    new Thread(new Runnable() {
        public void run() {
            Bitmap b = loadImageFromNetwork("http://example.com/image.png");
            mImageView.setImageBitmap(b);
        }
    }).start();
}
```

<br>　　初看以上这段代码，似乎能够很好的工作，因为它为处理网络操作创建了一个新的线程。但是，这个示例在工作线程中修改了`ImageView`对象而不是在`UI线程`中，这样会导致系统抛异常。

　　要修正这个问题，Android提供了以下几个方法用于从其他线程访问UI线程：

	-  Activity.runOnUiThread(Runnable)
	-  View.post(Runnable)
	-  View.postDelayed(Runnable, long)

　　例如，你能够通过`View.post(Runnable)`方法来修改以上代码：
``` android
public void onClick(View v) {
    new Thread(new Runnable() {
        public void run() {
            final Bitmap bitmap = loadImageFromNetwork("http://example.com/image.png");
            mImageView.post(new Runnable() {
                public void run() {
                    mImageView.setImageBitmap(bitmap);
                }
            });
        }
    }).start();
}
```
<br>　　现在这个实现是线程安全的了，因为网络操作是在工作线程中完成的，而对`ImageView`的操作则在`UI线程`中完成的，但是操作的复杂性增加了。
　　要处理跟工作线程更复杂的交互，你可能考虑在你的工作线程中使用`Handler`对象（后述），来处理由`UI线程`发送的消息。
　　另外，继承`AsyncTask`类（后述）可能是最好的解决方案，它简化了工作线程执行需要跟`UI`交互的任务。




<br><br>