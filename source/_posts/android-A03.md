title: 入门篇　第三章 Service
date: 2014-11-12 22:40:14
categories: android
---
　　`Service`运行在程序的后台且没有用户界面，通常用来完成一些现不需要用户界面但是需要一直运行的功能，如`处理网络事务(消息推送)`、`播放音乐`等。

　　此时你可能会有疑问，既然Service用来执行耗时任务，那和开启一个`Thread`有什么区别？

	-  首先，Service最明显的一个优势是，提高进程的优先级。
	   -  当系统内存不足时，系统会从众多后台进程中选择优先级最低的进程，予以杀掉。
	   -  同时Android也规定了，内部没有Service的进程比有Service的进程要更优先被杀掉。
	-  然后，Service和Thread并不冲突。
	   -  Service的各个生命周期方法都是在主线程中调用的，如果它执行耗时操作，同样需要开启Thread。

<br>　　简单的说：

	-  对于一些简单的、短暂的http请求等异步操作可以使用Thread类，因为此时不需要考虑到进程被杀掉的风险。
	-  对于长时间运行的、重要的耗时操作，如音乐播放、消息推送、上传下载等操作，应该为该操作启动一个服务，而不是简单的创建一个工作线程，这样可以提升进程的优先级，降低当在系统内存不足时，它被杀掉的几率。

<br>　　不过，除了执行耗时操作外，`Service`另一个重要的功能则是`进程间通信`（IPC，后面章节中会详细介绍）。

<br>
# 第一节 基础入门 #
## 普通Service ##
<br>　　你可以继承下面两个类之一来创建自己的Service类：

	-  Service：
	   -  这是所有服务的基类，它的各个生命周期方法都是在应用程序的主线程中被调用。
	-  IntentService：
	   -  继承Service类，它使用工作线程(非UI线程)来依次处理启动请求，需要你做的就是实现onHandleIntent()方法。
<br>
### 继承Service ###
<br>　　范例1：MyService。
``` android
package com.example.androidtest;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
public class MyService extends Service {

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent arg0) {
        return null;
    }
}
```
<br>　　与Activity相同，你需要重写一些处理Service生命周期关键特征的回调方法，在不同的时刻完成对应的功能。需要重写的回调方法如下：

<br>　　**onCreate()、onStartCommand()**

　　当有人请求启动某个`Service`时，操作系统会进行如下判断：

	-  若该Service当前在内存中不存在，系统会创建一个进程并在这个进程中启动该Service，同时调用onCreate()方法，然后接着回调onStartCommand()方法。
	-  若Service已经在内存中存在，则不会调用它的onCreate()方法，而只会调用Service的onStartCommand()方法。也就是说onCreate()只会在服务首次启动的时候被调用。

　　从`onStartCommand()`方法中返回的值必须是以下常量，它们用来告诉系统当服务需要被杀死时，服务的重启策略：


	- START_NOT_STICKY
	  - 若系统在onStartCommand()方法返回后杀死这个服务，那么直到再次接收到新的Intent对象，这个服务才会被重新创建。
	- START_STICKY
	  - 若系统在onStartCommand()返回后杀死了这个服务，系统就会重新创建这个服务并且调用onStartCommand()方法，但是它不会重新传递最后的Intent对象，系统会用一个null来调用onStartCommand()方法。
	- START_REDELIVER_INTENT
	  - 若系统在onStartCommand()方法返回后杀死了这个服务，系统就会重新创建了这个服务，并且用发送给这个服务的最后的Intent对象调用了onStartCommand()方法。这个选项适用于那些应该立即恢复正在执行的工作的服务，如下载文件。

<br>　　**onBind()**

	-  当程序想通过调用bindService()方法跟这个Service绑定时，系统会调用这个方法，具体后述。
	-  你必须实现这个方法，因为它是抽象的，如果你不想处理绑定请求可以返回null。

<br>　　**onDestroy()**

	-  当Service销毁时，系统会调用这个方法。
	-  你应该使用这个方法来实现一些清理资源的工作，如清理线程等。

<br>
### 继承IntentService ###
　　`Service`类的所有生命周期方法都是在`主线程`中被调用的，这意味着如果你需要执行耗时操作的话，就必须自己开启一个`Thread`，然后在`Thread`中去执行。
　　`IntentService`继承自`Service`类，它内部会把所有接到的请求交给一个工作线程去执行，帮我们省去创建线程的操作。

<br>　　范例1：MyIntentService。
``` android
package com.example.androidtest;
import android.app.IntentService;
import android.content.Intent;
public class MyIntentService extends IntentService {
    public MyIntentService() {
        super("MyIntentService");
    }
    @Override
    protected void onHandleIntent(Intent arg0) {
        long endTime = System.currentTimeMillis() + 5 * 1000;
        while (System.currentTimeMillis() < endTime) {
            synchronized (this) {
                try {
                    wait(endTime - System.currentTimeMillis());
                } catch (Exception e) { }
            }
        }
    }
}
```

    语句解释：
    -  由于IntentService类没有提供无参构造器，因此其子类必须显示调用无参构造器。
    -  onHandleIntent(Intent)方法将在子线程中被调用，因此不要在其内部执行更新UI的操作。

<br>　　在`IntentService`中有一个队列，先发来的请求会被先被处理。
　　若服务正在处理某个请求时，又接到新的请求，则新请求会被放到队列中等待，队列中的所有请求都按照先进先出的原则被依次处理。当队列中的所有请求都被处理完毕后，`IntentService`就会调用`stopSelf(int)`方法来终止自己。
　　若接到新请求时`IntentService`并没有被启动，则会像普通`Service`那样，调用`onCreate()`方法，且在`onCreate()`方法中会创建一个队列，并开始处理新请求。
　　由于`IntentService`类的各个生命周期方法中，都对`Service`做了扩展，因此除非必要你不应该重写这些方法，重写时应该先调用父类的实现，同时你不应该重写`onStartCommand()`方法。

<br>　　以上就是你做的全部：`一个构造器`和`一个onHandleIntent()方法的实现`。
　　如果你还决定要重写其他的回调方法，如`onCreate()`、`onStartCommand()`、或`onDestroy()`，那要确保调用父类的实现。
　　例如，`onStartCommand()`方法必须返回默认的实现（默认的实现获取`Intent`并把它交付给`onHandleIntent()`方法），因此重写它时你大致需要这么做：
``` android
package com.example.androidtest;
import android.app.IntentService;
import android.content.Intent;
public class MyIntentService extends IntentService {
    public MyIntentService() {
        super("MyIntentService");
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(this, "service starting",Toast.LENGTH_SHORT).show();
        return super.onStartCommand(intent,flags,startId);
    }
}
```

<br>　　提示：`IntentService`还提供了一个有用的方法：`setIntentRedelivery (boolean enabled)`。

<br>　　**何时使用?**
　　使用`IntentService`类实现服务的特点如下：

	-  任务按照先进先出顺序依次执行，同一时间无法执行一个以上的任务。
	-  任务一旦被安排后，无法撤销、终止。
　　因此，`IntentService`类适合于对上述两种缺点无要求的应用场合。

<br>
### 注册Service ###
　　像Activity（和其他的组件）一样，所有的Service都必须在应用程序的清单文件中声明。要声明Service就要给`<application>`元素添加一个`<service>`子元素，例如：
<br>　　范例1：配置服务。
``` android
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
	package="com.example.androidtest" android:versionCode="1" android:versionName="1.0">
    <application 
        android:icon="@drawable/ic_launcher" 
        android:label="@string/app_name">
            <Service android:name="com.example.androidtest.MyService"/>
    </application>
</manifest>
```

    语句解释：
    -  由于服务是Android四大组件之一，因此需要在<application>标签内配置，服务和Activity一样，可以为其指定一个意图过滤器。
    -  当需要启动某个服务时，Android系统同样会依次和已在系统中注册的服务进行匹配，匹配成功的服务将会被启动。
<br>
### 启动Service ###
　　Service有两种启动方法，分别调用`startService()`和`bindService()`两个方法。

　　例如：
``` android
Intent intent = new Intent(this, MyService.class);
// 指定一个Intent对象启动Service，Intent对象即可以是隐式意图也可以是显式意图。
startService(intent);
```

    语句解释：
    -  startService()方法将Intent传递给操作系统后会立即返回，随后系统去启动服务的。

<br>　　通过`startService()`方法启动的服务，有如下几个特点：

	-  Service一旦启动，它就能够无限期的在后台运行，除非下面的两种情况发生：
	   -  第一，系统内存不足，需要杀死Service所在的进程。
	   -  第二，调用stopSelf()方法或stopService()方法来明确停止服务。
	-  每通过startService()方法启动一次服务，都会导致一次服务的onStartCommand()方法被调用。
	-  通常，Service不会给调用者返回结果，它只接收请求，处理完毕后就停止自己。

<br>　　通过`startService()`方法启动的服务，会涉及到三个生命周期方法：
	-  首先，服务对象创建完毕后服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，onCreate方法调用后，服务的onStartCommand方法被调用，开始运行服务。  
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

<br>　　停止通过`startService()`方法启动的服务时，所需要知道的：

	-  当调用stopSelf()方法或stopService()方法请求终止服务后，系统会尽快的销毁这个服务。
	-  但是，如果你的服务正在处理第一个请求的时候，又接受到一个新的启动请求，那么在第一个请求结束时终止服务有可能会导致第二个请求不被处理。
	-  要避免这个问题，你能够使用stopSelf(int)方法来确保你请求终止的服务始终是基于最后启动的请求。
	-  也就是说，调用stopSelf(int)方法时，你要把那个要终止的服务ID传递给这个方法（这个ID是系统发送给onStartCommand()方法的参数）。
	-  这样如果服务在你调用stopSelf(int)方法之前收到了一个新的启动请求，那么这个ID就会因不匹配而不被终止。

## 绑定Service ##
　　服务允许应用程序组件通过调用`bindService()`方法来启动服务。

　　**问：为什么要使用此种方式?**
　　答：很多时候，服务用来完成一个耗时的操作，在服务运行的时候，用户可以通过Activity提供的界面控件，来调用服务中提供的方法，从而控制服务的执行。

　　但是，若通过`startService`方法启动服务，是无法返回该服务对象的引用，也就意味着没法调用服务中的方法。
　　通过绑定方式启动服务可以获取服务对象的引用。
　　因此，在你想要`Activity`以及应用程序中的其他组件跟服务进行交互(方法调用、数据交换)时，或者要把应用程序中的某些功能通过进程间通信(IPC，interprocess communication)暴露给其他应用程序时，就需要创建一个绑定类型的服务。

<br>**生命周期方法**
　　绑定启动方式的服务会涉及到四个生命周期方法：
	-  首先，服务对象被创建后，服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，在第一个访问者和服务建立连接时，会调用服务的onBind方法。 
	-  接着，当最后一个访问者被摧毁，服务的onUnbind方法被调用。
	   -  因此不要在普通的广播接收者中通过绑定方式启动服务，因为广播接收者生命周期短暂。
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

<br>　　一个组件（客户端）可以调用`bindService()`方法来与服务建立连接，调用`unbindService()`方法来关闭与服务连接。多个客户端能够绑定到同一个服务，并且当所有的客户端都解绑以后，系统就会销毁这个服务（服务不需要终止自己）。
　　
<center>
![图的左边显示了用startService()方法创建服务时的生命周期，图的右边显示了用bindService()方法创建服务时的生命周期。](/img/android/android_2_11.png)
</center>

<br>**创建绑定服务**
　　创建具有绑定能力的服务时，必须提供一个`IBinder`对象，它用于给客户端提供与服务端进行交互的编程接口。

<br>　　范例1：MyService。
``` android
public class MyService extends Service {

    // 1、onBind方法只会在第一个访问者和服务建立连接时会调用。
    // 2、onBind方法的返回值IBinder代表服务的一个通信管道。访问者通过IBinder对象来访问服务中的方法。
    // 3、onBind方法返回的IBinder对象会被传送给ServiceConnection接口的onServiceConnected方法。
    public IBinder onBind(Intent intent) {
        return new MyBinder();
    }

    // Binder类实现了IBinder接口
    public class MyBinder extends Binder {
        public MyService getService() {
            return MyService.this;
        }
    }

    public int add(int a, int b) {
        return a + b;
    }
}
```

<br>　　范例2：MainActivity。
``` android
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        Intent intent = new Intent(this,MyService.class);
        // 1、bindService方法用来通过绑定方式来启动Service。
        // 2、bindService方法的三个参数：
        //    intent：要启动的服务
        //    conn：代表一个访问者指向service的连接。当服务被启动或停止时，会导致连接的建立与断开。当连接建立或断开时
        //          系统就会调用ServiceConnection内定义的回调方法。
        //    flags：设置服务启动的模式。
        bindService(intent, conn, BIND_AUTO_CREATE);
    }

    ServiceConnection conn = new ServiceConnection() {

        // Android系统会在连接的服务突然丢失的时候调用这个方法，如服务崩溃时或被杀死时。在客户端解除服务绑定时不会调用。
        public void onServiceDisconnected(ComponentName name) { }

        // 此方法当访问者和服务之间成功建立连接后由系统回调。
        public void onServiceConnected(ComponentName name, IBinder service) {
            // 由于MyService和MainActivity定义在同一个项目中，所以MainActivity中可以直接向下转型IBinder对象。
            MyBinder binder = (MyBinder) service;
            System.out.println(binder.getService().add(5, 5));
        }
    }

    protected void onStop() {
        super.onStop();
        // 手工的解除绑定指定的服务。
        unbindService(conn);
    }
}
```

    语句解释：
    -  bindService方法的flags参数通常取值：
       -  Context.BIND_AUTO_CREATE ：若服务当前未启动，则新建立一个服务对象。
       -  Context.BIND_DEBUG_UNBIND
       -  Context.BIND_NOT_FOREGROUND
    -  后两个常量的具体作用，是什么暂不知道。一般都会使用Context.BIND_AUTO_CREATE 。
    -  提示：bindService方法是异步方法，调用完此方法后，主线程会立刻返回。因此，程序中操作服务对象的那部分代码，应该写在成功建立连接之后。
    -  客户端(MainActivity)获得到Service的引用后，就可以调用其所提供的public方法了。 

<br>**管理绑定类型服务的生命周期：**
　　当服务从所有的客户端解除绑定时，`Android`系统会销毁它（除非它还用`onStartCommand()`方法被启动了）。因此如果是纯粹的绑定类型的服务，你不需要管理服务的生命周期（`Android`系统会基于是否有客户端绑定了这个服务来管理它）。
　　但是，若你使用了`startService()`方法启动这个服务，那么你就必须明确的终止这个服务，因为它会被系统认为是启动类型的。这样服务就会一直运行到服务用`stopSelf()`方法或其他组件调用`stopService()`方法来终止服务。
　　另外，如果你的服务是启动类型的并且也接收绑定，那么当系统调用`onUnbind()`方法时，如果你想要在下次客户端绑定这个服务时调用`onRebind()`方法，你可以选择返回`true`。
<center>
![服务的生命周期](/img/android/android_2_12.png)
</center>

# 第二节 系统内置服务 #
　　在Android系统中内置了许多系统服务，它们各自对应不同的功能。常见的服务有：通知管理器、窗口管理器、包管理器等。
## 包管理器 ##
　　包管理器(PackageManager)可以获取当前用户手机中已安装`APK`文件中的信息（如`AndroidManifest`文件）。

<br>**PackageInfo **

<br>　　范例1：获取基本信息。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 使用Context对象获取一个全局的PackageManager对象。
        PackageManager mgr = this.getPackageManager();
        PackageInfo info;
        try {
            // 为getPackageInfo()方法指定一个应用程序的包名，可以获取该应用程序AndriodManifest文件中的信息。
            // Context的getPackageName()方法可以获取当前应用的包名。
            // 因此下面这行代码的含义为：获取当前应用程序的AndriodManifest文件中的信息。
            info = mgr.getPackageInfo(this.getPackageName(), 0);
            System.out.println("当前应用程序的包名称：" + info.packageName);
            System.out.println("当前应用程序的版本号：" + info.versionCode);
            System.out.println("当前应用程序的版本名称：" + info.versionName);
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

    语句解释：
    -  PackageInfo类描述的是某个应用程序中的AndroidManifest文件中的信息。 
    -  PackageManager的getPackageInfo()方法的第二个参数用来指明获取哪些信息常用取值：
       -  0 ：获取基本信息。
       -  PackageManager.GET_SERVICES：获取基本信息+所有Service的信息。
       -  PackageManager.GET_ACTIVITIES：获取基本信息+所有Activity的信息。
       -  PackageManager.GET_PERMISSIONS：获取基本信息+所有自定义权限的信息。
       -  若需要获取其它类型的信息，请自行查阅API 。
    -  PackageInfo类的常用属性： 
       -  int packageName：获取PackageInfo所代表的应用程序的<manifest>标签的package属性的值。 
       -  String versionCode：获取PackageInfo所代表的应用程序的<manifest>标签的versionCode属性的值。
       -  String versionName：获取PackageInfo所代表的应用程序的<manifest>标签的versionName属性的值。
       -  PermissionInfo[] permissions：获取PackageInfo所代表的应用程序内所有的<permission>标签。
       -  ActivityInfo[] activities：获取PackageInfo所代表的应用程序内所有的<Activity>标签。
       -  若需要获取其它信息，请自行查阅API。

<br>　　范例2：获取所有的Activity。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PackageManager mgr = this.getPackageManager();
        PackageInfo info;
        try {
            // 若第二个参数设置为0，则调用info.activities获得的将是null。
            info = mgr.getPackageInfo(this.getPackageName(), PackageManager.GET_ACTIVITIES);
            System.out.println(info.activities);
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

<br>**ActivityInfo**
　　`ActivityInfo`类描述的是`AndroidManifest`文件中的`<activity>`标签。
<br>　　范例1：获取ActivityInfo的基本信息。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PackageManager mgr = getPackageManager();
        PackageInfo info;
        try {
            // 当前应用程序的所有Activity信息。
            info = mgr.getPackageInfo(this.getPackageName(), PackageManager.GET_ACTIVITIES);
            for (ActivityInfo ainfo : info.activities) {
                System.out.println("Activity名称：" + ainfo.name);
                System.out.println("Activity图标的资源ID：" + ainfo.icon);
                System.out.println("Activity标题的资源ID：" + ainfo.labelRes);
                System.out.println("标题：" + getResources().getString(ainfo.labelRes));
            }

            // 系统gallery程序的所有Activity信息。
            info = mgr.getPackageInfo("com.android.gallery", PackageManager.GET_ACTIVITIES);
            for (ActivityInfo ainfo : info.activities) {
                System.out.println("Activity名称：" + ainfo.name);
                System.out.println("Activity图标的资源ID：" + ainfo.icon);
                System.out.println("Activity标题的资源ID：" + ainfo.labelRes);
                // 必须使用loadLabel()方法,才能导入其他应用程序的资源。
                System.out.println("标题：" + ainfo.loadLabel(mgr));
            }
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

    语句解释：
    -  ActivityInfo类除了上面列出的name、icon、labelRes三个属性外还有其他属性，比较常用的还有一个launchMode属性，它用来指明Activity的启动模式：
       -  ActivityInfo.LAUNCH_MULTIPLE ：值为0 ，相当于standard模式。
       -  ActivityInfo.LAUNCH_SINGLE_TOP ：值为1。
       -  ActivityInfo.LAUNCH_SINGLE_TASK ：值为2。
       -  ActivityInfo.LAUNCH_SINGLE_INSTANCE ：值为3。
       -  若需要获取其它类型的信息，请自行查阅API 

<br>　　范例2：元数据。
　　在`AndroidManifest`文件里面为`Activity`、`BroadcastReceiver`、`Service`配置参数，这些参数被称为“元数据”。
``` xml
<activity android:name=".MainActivity" android:label="@string/app_name">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    <meta-data android:name="name" android:value="张三" />
    <meta-data android:name="age" android:value="20"/>
    <meta-data android:name="sex" android:value="@string/sex"/>
    <meta-data android:name="isStudent" android:value="false"/>
</activity>
```

    语句解释：
    -  使用<meta-data>标签为组件配置元数据，元数据是一个key/value。 
    -  使用android:name属性指出元数据的key，使用android:value属性指出元数据的value，其中元数据的value可以是一个常量，也可以从资源文件中引用。
    -  元数据value的类型可以是：boolean、int、String、float类型的。

<br>　　范例3：访问元数据。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PackageManager mgr = this.getPackageManager();
        ComponentName component = new ComponentName(this, MainActivity.class);
        try {
            // 获取元数据。
            ActivityInfo activityInfo = mgr.getActivityInfo(component, PackageManager.GET_META_DATA);
            Bundle metaData = activityInfo.metaData;
            System.out.println(metaData.getString("name"));
            System.out.println(metaData.getInt("age")); 
            System.out.println(metaData.getString("sex"));
            System.out.println(metaData.getBoolean("isStudent"));
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

    语句解释：
    -  在程序运行的时候，通过ActivityInfo的metaData属性可以获取组件的元数据，元数据被保存在一个Bundle对象中。

<br>　　范例4：元数据 -- 图片资源。
``` c
// 假设在Activity标签内配置了这个元数据：
<meta-data android:name="img" android:value="@drawable/icon"/>

// 那么在程序中能够这么访问：
System.out.println(metaData.get("img"));

// 但是程序输出的结果将是：
res/drawable-mdpi/icon.png
```

    语句解释：
    -  直接给元数据的value赋图片资源的ID是不可以的，当程序运行时从Bundle对象中获取到的数据，是该图片资源所在的路径，这个路径是String类型的。

<br>　　范例5：resource属性。
``` android
// 在Activity标签内配置：
<meta-data android:name="img" android:resource="@drawable/icon"/>

// 那么在程序中能够这么访问：
ImageView img = new ImageView(this);
img.setImageResource(metaData.getInt("img"));
setContentView(img);
```

    语句解释：
    -  元数据的value也可以使用android:resource属性为其赋值，android:resource保存资源数据的ID。在程序运行时，使用Bundle对象的getInt方法可以获取该资源数据的ID。

<br>**ApplicationInfo**
　　`ApplicationInfo`类描述的是应用程序的`<application>`标签。
<br>　　范例1：用户程序和系统程序。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PackageManager mgr = this.getPackageManager();
        // 获取当前系统中已安装的应用程序的全部信息。
        List<ApplicationInfo> list = mgr.getInstalledApplications(PackageManager.GET_UNINSTALLED_PACKAGES);
        for (ApplicationInfo app : list) {
            if ((app.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0) {
                // 用户升级了原来的系统的程序。
                System.out.println(app.packageName + " 用户程序!");
            } else if ((app.flags & ApplicationInfo.FLAG_SYSTEM) == 0) {
                // 用户自己安装的app。
                System.out.println(app.packageName + " 用户程序!");
            } else {
                System.out.println(app.packageName + " 系统内置程序!");
            }
        }
    }
}
```

    语句解释：
    -  ApplicationInfo的flags表示其所代表的Application标签的一个标记，通常用它来判断该应用程序是否是系统程序。

<br>　　PackageManager类还有一个比较常用的方法：
``` android
public abstract Intent getLaunchIntentForPackage (String packageName)
```
　　为它指定一个应用程序(包名)，它将返回一个能打开该包名对应的应用程序的入口`Activity`的`Intent`对象。

## 活动管理器 ##
　　本节内容主要是讲解`ActivityManager`的使用，通过它我们可以获得内存信息、进程信息，还可以终止某个进程。当然只能终止用户的进程，系统的进程是杀死不了的。
<br>　　ActivityManager常用的静态内部类如下：

	-  ActivityManager.MemoryInfo： 系统可用内存信息
	-  ActivityManager.RecentTaskInfo： 最近的任务信息
	-  ActivityManager.RunningAppProcessInfo： 正在运行的进程信息
	-  ActivityManager.RunningServiceInfo： 正在运行的服务信息
	-  ActivityManager.RunningTaskInfo： 正在运行的任务信息

<br>**RunningTaskInfo**
<br>　　范例1：获取当前系统中所有Task。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 调用Context的getSystemService()方法获取一个ActivityManager对象。
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        // 从当前系统中，按照Task出现在前后台的顺序，获取maxNum个正在运行的Task。
        // 若当前系统中运行的Task少于100，则返回所有Task 。处于前台的Task将被放到List的第一个位置。
        // ActivityManager.RunningTaskInfo类描述一个正在运行的Task有关的信息。
        RunningTaskInfo stack = manager.getRunningTasks(100).get(0);
        System.out.println(stack.topActivity.getClassName());
        System.out.println(stack.topActivity.getShortClassName());
        System.out.println(stack.topActivity.getPackageName());
        System.out.println(stack.topActivity.toShortString());
        System.out.println(stack.topActivity);
    }
}
```

    语句解释：
    -  想要正确的运行本范例获取系统中Task的信息，你需要在<manifest>标签下面申请权限：
       -  <uses-permission android:name="android.permission.GET_TASKS" />
    -  RunningTaskInfo类常用属性
       -  ComponentName baseActivity：当前Task的栈底Activity 。
       -  int numActivities：当前Task中的Activity的个数。
       -  ComponentName topActivity：当前Task的栈顶Activity 。

<br>**MemoryInfo**
　　`MemoryInfo`表示当前Android系统的内存信息。
<br>　　范例1：获取当前系统的内存使用情况。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        // 将当前系统内存信息保存到ActivityManager.MemoryInfo对象中。
        ActivityManager.MemoryInfo info = new ActivityManager.MemoryInfo();
        manager.getMemoryInfo(info);
        // 当前系统的可用内存。 当前系统中打开的程序越多其值将越小。
        System.out.println(formateFileSize(info.availMem));
        // 如果系统处于低内存状态下，此变量的值将为true。
        System.out.println(info.lowMemory);
        // 内存低的阀值。当availMem到达threshold以下时，系统进入低内存状态，并将会开始关闭一些后台Service以及进程。
        System.out.println(formateFileSize(info.threshold));
    }
	
    //调用系统函数，将一个long变量转换为String类型的表示形式：KB/MB。  
    private String formateFileSize(long size){  
        return Formatter.formatFileSize(MainActivity.this, size);   
    }  
}
```

    语句解释：
    -  android.text.format.Formatter类是提供的用于格式化各类文本的工具类。

<br>**RunningAppProcessInfo**
　　`RunningAppProcessInfo`用来描述当前内存中的一个进程的信息。
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
            System.out.println(p.processName +","+ p.pid + "," + p.importance);
        }
    }
}
```

    语句解释：
    -  processName表示进程的名称。
    -  pid表示进程的id，全局唯一。
    -  importance表示进程的重要性，其值越小进程的优先级越高，常用取值为：
       -  RunningAppProcessInfo.IMPORTANCE_FOREGROUND：100
       -  RunningAppProcessInfo.IMPORTANCE_VISIBLE：200
       -  RunningAppProcessInfo.IMPORTANCE_SERVICE：300
       -  RunningAppProcessInfo.IMPORTANCE_BACKGROUND：400
       -  RunningAppProcessInfo.IMPORTANCE_EMPTY：500
       -  RunningAppProcessInfo.IMPORTANCE_GONE：1000

<br>　　范例2：获取各个进程所占用的内存大小。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<RunningAppProcessInfo> list = manager.getRunningAppProcesses();
        for (RunningAppProcessInfo p : list) {
            int size = manager.getProcessMemoryInfo(new int[]{p.pid})[0].getTotalPrivateDirty() * 1024;
            System.out.println(p.processName +","+ Formatter.formatFileSize(this, size));
        }
    }
}
```

<br>　　范例3：关闭进程。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<RunningAppProcessInfo> runningAppProcessInfos = am.getRunningAppProcesses();
        if (runningAppProcessInfos == null || runningAppProcessInfos.size() == 0){
            for (RunningAppProcessInfo info : runningAppProcessInfos) {
                if (info.processName.equals("com.cutler.template")) {
                    android.os.Process.killProcess(info.pid);
                    am.killBackgroundProcesses(info.processName);
                }
            }
        }
    }
}
```

    语句解释：
    -  关闭名称为com.cutler.template的进程。
    -  执行本范例的代码需要在清单文件中申请如下两个权限：
       -  <uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />
       -  <uses-permission android:name="android.permission.RESTART_PACKAGES"/>

## 传感器 ##
　　传感器是一种检测装置，能感受到被测量的信息，并能将检测感受到的信息，按一定规律变换成为电信号或其他所需形式的信息输出，以满足信息的传输、处理、存储、显示、记录和控制等要求。它是实现自动检测和自动控制的首要环节。

　　在Android中提供了6种传感器：方向传感器、重力传感器、光线传感器、磁场传感器、距离传感器、温度传感器。这些传感器可以检测出手机当前所处的环境中的信息。

<br>　　范例1：android.hardware.Sensor类。

	-  方向传感器：Sensor.TYPE_ORIENTATION。
	-  重力传感器：Sensor.TYPE_ACCELEROMETER。
	-  光线传感器：Sensor.TYPE_LIGHT。
	-  磁场传感器：Sensor.TYPE_MAGNETIC_FIELD。
	-  距离传感器：Sensor.TYPE_PROXIMITY。
	-  温度传感器：Sensor.TYPE_TEMPERATURE。

<br>　　在`Sensor`类中没有提供`public`的构造器，若想构造一个Sensor对象，则可以使用系统提供的一个类`SensorManager`。

<br>　　范例1：获取方向传感器。
``` android
public class MainActivity extends Activity {
    SensorManager manager;
    Sensor orientationSensor;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        // 获取SensorManager对象。
        manager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);
        // manager.getDefaultSensor()方法指定传感器的类型，获取一个传感器对象。
        orientationSensor = manager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
    }
}
```
<br>　　由于手机所处的环境是不断变化的，因此在代码中通常会定义一个监听器，不断的监听外界环境，当外界环境改变时SensorManager就会调用监听器中的方法。

<br>　　范例2：监听传感器的数据变化。
``` android
public class MainActivity extends Activity {
    SensorManager manager;
    Sensor orientationSensor;
    MySensorEventListener myListener;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        // 获取SensorManager对象。
        manager = (SensorManager)getSystemService(Context.SENSOR_SERVICE);
        // manager.getDefaultSensor()方法指定传感器的类型，获取一个传感器对象。
        orientationSensor = manager.getDefaultSensor(Sensor.TYPE_ORIENTATION);
        // MySensorEventListener的定义在下面，它是SensorEventListener的子类。
        myListener = new MySensorEventListener();
    }

    protected void onResume() {
        // 当Activity获得焦点的时候，注册一个事件监听器。
        manager.registerListener(myListener, orientationSensor, SensorManager.SENSOR_DELAY_NORMAL);
        super.onResume();
    }

    protected void onPause() {
        // 当Activity失去焦点时，解除注册。
        manager.unregisterListener(this.myListener);
        super.onPause();
    }

    private final class MySensorEventListener implements SensorEventListener {
        public void onAccuracyChanged(Sensor sensor, int accuracy) { }

        // 当传感器监听到的值改变时调用此方法。
        public void onSensorChanged(SensorEvent event) {
            float currentDegree = -event.values[0]; // 当前角度。
        }
    }
}
```

    语句解释：
    -  在SensorManager.registerListener()方法的第三个参数用来指明传感器每秒钟采样的频率。常见的取值为：
       -  SensorManager.SENSOR_DELAY_FASTEST：每秒80次。
       -  SensorManager.SENSOR_DELAY_GAME：每秒60次。
       -  SensorManager.SENSOR_DELAY_UI：每秒40次。
       -  SensorManager.SENSOR_DELAY_NORMAL：每秒20次。
    -  当传感器的数据发生变化时，系统会将相关的数据封装成一个SensorEvent对象并传递给onSensorChanged方法。
    -  SensorEvent有一个常用字段float[] values，传感器监听到的数据都保存在此数组中。对于不同的传感器，此数组的长度是不同的。
       -  对于方向传感器来说，values[0]表示手机当前指向的方向相对于北方的偏移角度。0北方、90东方、180南方、270西方。

<br><br>