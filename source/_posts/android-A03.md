title: 入门篇　第三章 Service
date: 2014-11-12 22:40:14
categories: Android
---
　　`Service`运行在程序的后台且没有用户界面，通常用来完成一些现不需要用户界面但是需要一直运行的功能，如`处理网络事务(消息推送)`、`播放音乐`等。
　　既然讲到`Service`了，那么就不得不说一下它和`Thread`的区别。

<br>**Service与线程的区别：**

　　1、它们的生命周期不同，Thread生命周期短，Service生命周期长。

	-  在Andriod中后台进程在系统内存紧缺的时候可能被杀掉，其内的静态变量、子线程也会随之被销毁，这种情况可能发生在任何时候，甚至于线程执行的中途。
	-  虽然Thread和Service都会被杀掉，但Thread无法再次重启，而Service当稍后系统内存足够时可以被自动重启。

　　2、实例的个数是不同的。

	-  若在Activity的生命周期方法中（如onCreate等）开启线程，那么当Activity生命周期发生改变（如横竖屏切换导致Activity被重建）时，会导致开启多个Thread来执行相同的任务，即一个任务被执行的多次。
	-  Serivce是单例的，且默认情况下在其宿主进程中运行。

　　3、数量级不同。

	-  与Thread相比较Service就稍显重量级，因为Service需要在清单文件中配置等。

　　4、它们不是对立的。

	-  在Service中若需要执行耗时操作，仍然需要开启一个Thread对象，Service的各个生命周期方法都是在主线程中被调用。

<br>　　因此：
　　对于一些`简单的`、`短暂的`http请求等异步操作可以使用`Thread`类，因为此时不需要考虑到进程被杀掉的风险。
　　对于`长时间运行的`、`重要的耗时操作`，如`音乐播放`、`消息推送`、`上传下载`等操作，应该为该操作启动一个服务，而不是简单的创建一个工作线程，这样可以提升进程的优先级，降低当在系统内存不足时，它被杀掉的几率。
　　因为`Service`具有销毁重启、全局唯一以及其他若干Android封装好的特性，所以最适合长时间运行的场景，但是除了耗时操作外，`Service`另一个重要的功能则是`进程间通信`（IPC）。

<br>
# 第一节 基础入门 #
## 创建Service ##
　　你可以继承下面两个类之一来创建创建自己的Service类：
<br>　　**Service**
　　这是所有服务的基类。当你通过继承这个类来创建自己的Sevice时，需要注意的是对于耗时的操作，你要去创建一个新的线程去执行，因为`Service的各个生命周期方法都是在应用程序的主线程中被调用`，否则可能降低应用程序正在运行的Activity的性能。
<br>　　**IntentService**
　　这是一个Service类的子类，它使用`工作线程(非UI线程)`来依次处理启动请求，需要你做的就是实现`onHandleIntent()`方法。

　　所谓的`启动请求`，即其他组件通过调用`startService()`方法，试图激活Service对象的过程，就是发送了一个`启动请求`。
<br>
### 继承Service ###
　　要创建一个Service，你必须创建一个Service类（或一个既存的Service子类）的子类。
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
	-  若Service不是首次启动，则不会调用它的onCreate()方法，而只会调用Service的onStartCommand()方法。也就是说onCreate()只会在服务首次启动的时候被调用。

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
　　这里所说的`“请求”`被封装成`Intent`，客户端通过调用`startService(Intent)`方法来发送请求。

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

<br>　　在`IntentService`中有一个队列，先发来的请求会被先被处理。若服务正在处理某个请求时，又接到新的请求，则新请求会被放到队列中等待，队列中的所有请求都按照先进先出的原则被依次处理。当队列中的所有请求都被处理完毕后，`IntentService`就会调用`stopSelf(int)`方法来终止自己。
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

## 注册Service ##
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
    -  由于服务是Android四大组件之一，因此需要在<application>标签内配置。
    -  服务和Activity一样,可以为其指定一个意图过滤器。当需要启动某个服务时，Android系统同样会依次和已在系统中注册的服务进行匹配。匹配成功的服务将会被启动。

## 启动Service ##
　　在此之前先了解一下Service的两种启动形式：
<br>　　**被启动(Started)**

	-  应用程序组件（如一个Activity）通过调用startService()方法启动的Service是“被启动（started）”的。
	-  Service一旦启动，它就能够无限期的在后台运行，即使启动它的组件被销毁。
	-  通常，一个被启动的Service执行一个单一操作，并且不给调用者返回结果。例如，这个Service可能在网络上下载或上传文件。当操作完成的时候，Service应该自己终止。

<br>　　**被绑定(Bounded)**

	-  应用程序组件通过调用bindService()方法启动的Service是“被绑定（bound）”的。
	-  一个被绑定的Service提供了一个客户端-服务器接口，允许绑定者与该Service进行交互（发送请求/获取结果），甚至这个交互是跨进程的。
	-  一个被绑定的Service的运行时间跟绑定它的应用程序组件一样长。多个组件能够绑定同一个Service，但是只有所有这些绑定解绑，这个Service才被销毁。

<br>**如何启动一个“被启动”的服务？**
　　你可以把一个`Intent`对象（用它来指出要启动的服务）传递给`Context`类的`sartService()`方法来启动服务。

　　例如：
``` android
Intent intent = new Intent(this, MyService.class);
// 指定一个Intent对象启动Service，Intent对象即可以是隐式意图也可以是显式意图。
startService(intent);
```

    语句解释：
    -  startService()方法将Intent传递给操作系统后会立即返回，随后系统去调用服务的onStartCommand()方法。
       -  如果服务还没有运行，系统首先调用onCreate()方法，然后调用onStartCommand()方法。
    -  每通过startService()方法启动一次服务，都会导致一次服务的onStartCommand()方法被调用。
       -  但是只要有一个请求终止服务（使用stopSelf()方法或stopService()方法），服务就会被终止。

<br>**生命周期方法**
<br>　　“被启动”类型的服务会涉及到三个生命周期方法：
	-  首先，服务对象创建完毕后服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，onCreate方法调用后，服务的onStartCommand方法被调用，开始运行服务。  
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

<br>**使用“被启动”类型的服务时，服务何时会被销毁呢?**
　　答：有两种方式可以销毁：

	-  第一，在程序中调用Context类的stopService方法停止服务。
	-  第二，服务自己调用自己的stopSelf()方法使自己停止。
　　除此之外，服务会一直运行在进程里面。 除非系统要回收系统内存，否则系统不会终止或销毁这个服务。

　　一旦用`stopSelf()`方法或`stopService()`方法请求终止服务，那么系统会尽快的销毁这个服务。但是，如果你的服务正在处理第一个请求的时候，又接受到一个新的启动请求，那么在第一个请求结束时终止服务有可能会终止第二个请求。
　　要避免这个问题，你能够使用`stopSelf(int)`方法来确保你请求终止的服务始终是基于最后启动的请求。也就是说，调用`stopSelf(int)`方法时，你要把那个要终止的服务`ID`传递给这个方法（这个`ID`是系统发送给`onStartCommand()`方法的参数）。这样如果服务在你调用`stopSelf(int)`方法之前收到了一个新的启动请求，那么这个`ID`就会因不匹配而不被终止。

<br>
# 第二节 绑定类型的Service #
　　绑定类型的服务允许应用程序组件通过调用`bindService()`方法与服务创建一个`长连接`。

　　**问：为什么要使用此种方式?**
　　答：很多时候，服务用来完成一个耗时的操作，在服务运行的时候，用户可以通过Activity提供的界面控件，来调用服务中提供的方法，从而控制服务的执行。

　　服务和线程类似，`直接调用服务的生命周期方法，是不会启动服务的`。 
　　但是，以目前所掌握的知识来说，若想启动服务，必须通过`startService`方法。而这个方法仅仅会启动服务，它无法返回该服务对象的引用，无法获取对象就意味着，不能调用服务中的方法。
　　此时就可以通过“绑定服务”的方式启动服务，因为`通过绑定方式启动服务可以获取服务对象的引用`。
　　因此，在你想要`Activity`以及应用程序中的其他组件跟服务进行交互(方法调用、数据交换)时，或者要把应用程序中的某些功能通过进程间通信(IPC，interprocess communication)暴露给其他应用程序时，就需要创建一个绑定类型的服务。

## 基础知识 ##
<br>**生命周期方法**
　　绑定启动方式的服务会涉及到四个生命周期方法：
	-  首先，服务对象被创建后，服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，在第一个访问者和服务建立连接时，会调用服务的onBind方法。 
	-  接着，当最后一个访问者被摧毁，服务的onUnbind方法被调用。因此不要在普通的广播接收者中通过绑定方式，启动服务。因为广播接收者生命周期短暂。
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

<br>　　通过绑定方式启动服务时，一个组件（客户端）可以调用`bindService()`方法来与服务建立连接，调用`unbindService()`方法来关闭与服务连接。多个客户端能够绑定到统一个服务，并且当所有的客户端都解绑以后，系统就会销毁这个服务（服务不需要终止自己）。
　　
<center>
![图的左边显示了用startService()方法创建服务时的生命周期，图的右边显示了用bindService()方法创建服务时的生命周期。](/img/android/android_2_11.png)
</center>

## 创建绑定服务 ##
　　创建具有绑定能力的服务时，必须提供一个`IBinder`对象，它用于给客户端提供与服务端进行交互的编程接口。有三种方法能够定义这个接口：

<br>　　1、 继承Binder类

	如果你的服务仅需要在你的应用程序中使用(即私有服务)，并且它跟客户端运行在同一个进程中，那么就应该通过继承Binder类(它是IBinder接口的实现类)来创建一个返回值。客户端接收这个Binder对象，并且能够使用这个对象直接访问Binder类中实现的或Service中的公共方法。
	当你的服务只是在后台给你自己的应用程序工作时，这是首选技术。不使用这种方法创建服务接口的唯一原因是因为你的服务要被其他应用程序或(进行本应用程序内部)跨进程使用。

<br>　　2、 使用信使(Messenger)

	如果你的服务要跨越不同进程来进行工作，那么你能用Messenger类创建一个IBinder对象。
	这是执行进程间通信(IPC）最简单的方法，因为信使队列的所有请求都在一个单线程中，因此不需要针对线程安全来设计你的服务。

<br>　　3、 使用AIDL(Android Interface Definition Language)

	AIDL(Android 接口定义语言)执行所有的把对象分解成操作系统能够理解的原语的工作，并且把它们编组到执行IPC(进程间通信)的不同进程中。使用Messenger的技术实际上是基于AIDL架构。就像前面提到的，信使在一个单线程中创建了一个所有客户端请求的队列，因此服务每次只能接收一个请求。但是，如果你想要服务同时处理多个请求，那么就能直接使用AIDL，这种情况下，你的服务必须是多线程的并且要线程安全。

	注意：大多数应用程序不应该是AIDL来创建绑定类型的服务，因为它可能需要多线程的能力，并可能导致更复杂的实现。因此AIDL不适用于大多数应用程序。
<br>
### 继承Binder类 ###
　　如果你只在你的应用程序的内部使用服务，并且不需要跨进程工作，那么你可以去实现自己的`Binder`类，用它直接给你的客户端提供访问服务中公共方法的能力。

　　以下是建立绑定类型服务的步骤：

	1、定义一个类MyService，继承Service类，并定义若干个方法。
	2、在MyService中定义一个内部类MyBinder，继承Binder类，MyBinder类提供一个方法getService，返回MyService的引用。
	3、从onBind回调方法中返回这个MyBinder对象的实例；
	4、访问者通过bindService方法启动服务，并构建一个ServiceConnection对象，且已经和服务建立连接后，ServiceConnection的onServiceConnected方法会被调用。该方法的IBinder参数就是Service的onBind方法返回值。
<br>　　注意：服务端和客户端必须在同一个应用中的原因是：这样的客户端能够直接向下转型返回的`IBinder`对象，并正确的调用该对象自己的`APIs`。

<br>　　范例1：MyService。
``` android
public class MyService extends Service {

    // 1、onBind方法只会在第一个访问者和服务建立连接时会调用。
    // 2、onBind方法的返回值IBinder代表服务的一个通信管道。访问者通过IBinder对象来访问服务中的方法。
    // 3、onBind方法返回的IBinder对象会被传送给ServiceConnection接口的onServiceConnected方法。
    public IBinder onBind(Intent intent) {
        return new MyBinder();
    }

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

<br>
### 使用信使(Messenger) ###
　　如果需要服务跟远程进程通信，那么就可以使用`Messenger`对象来给服务提供接口，这种技术允许你在不直接使用`AIDL`的情况下执行进程间通信(`IPC`)。
　　学习`Messenger`需要了解`Handler`的用法，如果你还不知道`Handler`，请先去[《入门篇　第十章 网络编程》](http://cutler.github.io/android-A10/)中查看，本章只讲解`Service`的知识。
　　以下是信使(`Messenger`)对象的使用概要：

	1、服务端，定义一个Handler对象，客户端发送来的请求，都将由它来处理。
	2、服务端，使用这个Handler对象来创建一个信使(Messenger)对象。
	3、服务端，调用Messenger对象的getBinder()方法创建一个准备返回给客户端的IBinder对象。
	4、客户端，绑定成功后，使用这个IBinder对象来实例化一个新的信使对象，客户端使用这个信使给服务端发送Message对象。
	5、服务端，在它的Handler的handleMessage()方法中依次接收客户端发来的每个Message对象，并处理。

<br>　　范例1：客户端MainActivity。
``` android
public class MainActivity extends Activity {

    // 客户端的信使对象，用于接收服务端发来的响应。
    Messenger mMessenger = new Messenger(new Handler(){
        public void handleMessage(Message msg) {
            if (msg.what == 2) {
                System.out.println(msg.arg1);
            }
        };
    });

    ServiceConnection conn = new ServiceConnection() {
        public void onServiceDisconnected(ComponentName name) { }
        public void onServiceConnected(ComponentName name, IBinder service) {
            // 使用服务端传递过来的IBinder对象创建一个信使对象，客户端通过这个信使对象向服务端发送请求。
            Messenger messenger = new Messenger(service);
            Message msg = new Message();
            msg.what = 1;
            msg.arg1 = 5;
            msg.arg2 = 5;
            // 设置回调信使。当服务端处理完客户端请求后，会将响应发送给这个信使对象。
            msg.replyTo = mMessenger;
            try {
                // 使用服务端的Messenger对象发送一个Message对象。
                messenger.send(msg);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    };
}
```

    语句解释：
    -  首先，客户端(MainActivity)创建了一个自己的信使(mMessenger)，用于接收从服务端返回的数据。
	-  然后，当服务绑定成功后，客户端又使用从服务端返回的IBinder对象构造一个新的信使(messenger)，该信使指向服务端的Handler对象。
	-  接着，客户端使用messenger来给服务端发送请求，同时将自己的信使(mMessenger)的引用传递给服务端，以便对方回复消息。
	-  最后，当服务端回复消息时，客户端信使(mMessenger)的Handler就会接收到。

<br>　　范例2：服务端MyService。
``` android
public class MyService extends Service {

    // 服务端的信使对象，用来接收来自各个客户端的请求。
    private Messenger mMessenger = new Messenger(new Handler() {
        // 当客户端发来请求时，系统会回调handleMessage方法处理请求。
        public void handleMessage(android.os.Message msg) {
            if (msg.what == 1) {
                Message newMsg = Message.obtain();
                newMsg.what = 2;
                newMsg.arg1 = add(msg.arg1, msg.arg2);
                try {
                    // 请求处理完毕后，将处理结果封装成一个Message对象，然后发送给客户端的信使对象。
                    msg.replyTo.send(newMsg);
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        };
    });

    public IBinder onBind(Intent intent) {
        // 使用与mMessenger关联的Binder对象。
        return mMessenger.getBinder();
    }

    public int add(int a, int b) {
        return a + b;
    }
}
```

    语句解释：
    -  首先，服务端构造了自己的信使(mMessenger)，用于接收来自各个客户端的请求。
	-  然后，当服务被首次绑定时，会返回一个IBinder对象，客户端通过IBinder对象发送的请求都将被送到mMessenger的Handler中处理。
	-  最后，服务端回复请求时，则会对请求(Message对象)的replyTo所指向的信使发送消息。

<br>**管理绑定类型服务的生命周期：**
　　当服务从所有的客户端解除绑定时，`Android`系统会销毁它（除非它还用`onStartCommand()`方法被启动了）。因此如果是纯粹的绑定类型的服务，你不需要管理服务的生命周期（`Android`系统会基于是否有客户端绑定了这个服务来管理它）。
　　但是，若你使用了`startService()`方法启动这个服务，那么你就必须明确的终止这个服务，因为它会被系统认为是启动类型的。这样服务就会一直运行到服务用`stopSelf()`方法或其他组件调用`stopService()`方法来终止自己，而不管是否有还有客户端绑定了它。
　　另外，如果你的服务是启动类型的并且也接收绑定，那么当系统调用`onUnbind()`方法时，如果你想要在下次客户端绑定这个服务时调用`onRebind()`方法，你可以选择返回`true`（而不是接收`onBind()`调用）。`onRebind()`方法返回`void`，但是客户端依然能够在它的`onServiceConnected()`回调中接收`IBinder`对象。
<center>
![绑定服务的生命周期](/img/android/android_2_12.png)
</center>
# 第三节 AIDL #
　　通常在计算机领域中每一个应用程序都拥有自己的进程，各自都只在自己的进程中运行。但是有些时候设备中的两个进程之间需要进行通信、传递数据，而很多操作系统却是不支持跨进程内存共享的，因此大部分情况下，进程间是无法直接进行通信的。
　　在Android上，一个进程通常不能像访问本进程内存一样访问其他进程的内存。所以，进程间想要对话，需要将对象拆解为操作系统可以理解的基本数据单元，并且有序的通过进程边界。通过代码来实现这个数据传输过程是冗长乏味的，所幸的是Android提供了AIDL工具来帮我们完成了此项工作。

<br>　　**关于IPC：**
>　　进程间通信 (IPC interprocess communication)是一个Unix标准通讯机制，提供在同一台主机不同进程之间可以互相通讯的方法。 
　　Linux内核继承和兼容了丰富的Unix系统进程间通信（IPC）机制，在Linux中，进程间的通信机制有很多种，例如可以采用命名管道（named pipe）、消息队列（message queue）、信号（signal）、共享内存（share memory）、socket等方式，它们都可以实现进程间的通信。但是，在Android终端上的应用软件的通信几乎看不到这些IPC通信方式，取而代之的是Binder方式。

>　　在Android系统的Binder机制中，由四个系统组件组成，分别是Client、Server、Service Manager和Binder驱动程序，其中Client、Server和Service Manager运行在用户空间，Binder驱动程序运行内核空间。Binder就是一种把这四个组件粘合在一起的粘结剂，其中，核心组件便是Binder驱动程序了，Service Manager提供了辅助管理的功能，Client和Server正是在Binder驱动和Service Manager提供的基础设施上，进行Client-Server之间的通信。Service Manager和Binder驱动已经在Android平台中实现好，开发者只要按照规范实现自己的Client和Server组件就可以了。

>　　参考阅读：[Binder的机制的原理](http://blog.csdn.net/luoshengyang/article/details/6618363)

<br>　　**AIDL**
　　AIDL(Android Interface Definition Language，Android接口定义语言) 与你可能使用过的其他`IDLs`类似，它允许你通过AIDL定义客户端和服务端都认可的编程接口来实现IPC通信。
　　简单的说AIDL的作用就是：`在通信的进程之间提供一个标准、规范，通信双方进程同时遵守这个规范`。

　　通信，无论是在两个进程之间，还是在人与人之间，一定会有一个`发起方`和一个`接收方`。
　　并且通常是由发起方提出请求，由接收方进行处理。使用IPC技术进行通信的两个进程也是如此，由接收方(Server)进程定义接口，发起方(Client)进程进行请求。
　　以系统内置的“电话”程序为例，它通过AIDL技术对外界提供了“接电话”、“挂电话”等接口，其他应用程序就可以调用这两个接口。 这个过程类似于客户端/服务器的通信方式。

<br>　　注意：

	你应当仅在需要从其他应用程序访问你应用程序的Service来实现IPC通信，并且在Service需要处理多线程(多个客户端同时)访问的情况下使用AIDL。如果你不需要使用到进程间的IPC通信，那么通过Binder实现将更为合适，如果你需要实现进程间的IPC通信，但不需要处理多线程，通过Messenger来实现将更为合适。

## 定义AIDL接口 ##
　　AIDL的语法规则却是和Java语言中的`interface`高度相似。
　　AIDL编写出来的文件使用`.aidl`做为后缀名。完成之后需要将该`.aidl`文件保存在 `src`目录下(无论是服务端还是客户端都得保存同样的一份拷贝，也就是说只要是需要使用到该AIDL接口的应用程序都得在其src目录下拥有一份`.aidl`文件的拷贝)。
　　编译时AndroidSDK工具将会为`src`目录下的`.aidl`文件在`gen`目录下产生一个`IBinder`接口。服务端必须相应的实现该`IBinder`接口。客户端可以绑定该服务、调用其中的方法实现`IPC`通信。

<br>　　创建一个用AIDL实现的服务端，需要以下3个步骤：
 
	1、创建.aidl文件(内部的代码类似于Java的接口)，其内定义了若干抽象方法。
	2、实现这个接口。 AndroidSDK将会根据你的.aidl文件产生AIDL接口。生成的接口包含一个名为Stub的抽象内部类，该类声明了所有.aidl中描述的方法，你必须在代码里继承Stub类并且实现相应的方法。
	3、向客户端公开服务端的接口。实现一个Service，并且在onBinder方法中返回第2步中实现的那个Stub类的子类（实现类）。
<br>
### 创建.aidl文件 ###
　　AIDL使用简单的语法来描述其方法以及方法的参数和返回值。这些参数和返回值可以是任何类型，甚至是其他AIDL生成的接口。重要的是必须导入所有非内置类型，哪怕是这些类型是在与接口相同的包中。

<br>　　范例1：定义AIDL文件。
``` android
package org.cxy.dao;
interface IDAO {
    int add(int i,int j);
}
```

    语句解释：
    -  将该IDAO.aidl文件保存在工程目录中的“src/org/cxy/dao/”目录下，当需要编译生成apk时，sdk工具将会在 “gen/org/cxy/dao/”目录下生成一个对应的IBiner接口的IDAO.java文件。

<br>　　范例2：AIDL文件的定义规范。

	-  接口名需要和aidl文件名相同。 
	-  接口和方法前不能加访问权限修饰符和存在修饰符。如：public、static都不可以。
	-  AIDL默认支持的类型包话java基本类型(int、long、boolean等)和(String、List、Map、CharSequence)，使用这些类型时不需要import声明。对于List和Map中的元素类型必须是Aidl支持的类型。如果需要使用自定义类型作为参数或返回值，自定义类型必须实现Parcelable接口。
	-  自定义类型和AIDL生成的其它接口类型在aidl描述文件中，应该显式import，即便在该类和定义的包在同一个包中。
	-  在aidl文件中所有非Java基本类型参数必须加上in（传入参数）、out（传出参数）、inout（传入传出参数）标记，这样可以降低序列化的消耗。
	-  Java原始类型默认的标记为in，不能为其它标记。

<br>
### 实现接口 ###
　　当您构建您的应用程序时，SDK工具会依照`.aidl`来生成一个`.java`文件。其内包含一个名为`Stub`的抽象的内部类，并且它`implements`了你在`.aidl`中定义的接口，以及接口中的所有方法。 
　　接下来要做的就是，在你应用程序中实现该接口，并在`Service`的`onBind()`方法被调用时，将该实例返回。

<br>　　范例1：MyService。
``` android
public class MyService extends Service{

    public IBinder onBind(Intent arg0) {
        return new MyBinder();
    }

    public int add(int i, int j) {
        return i+j;
    }

    private final class MyBinder extends IDAO.Stub{
        public int add(int i, int j) {
            return MyService.this.add(i,j);
        }
    }
}
```

<br>　　范例2：配置服务。
``` android
<service android:name="org.cxy.test1.MyService">
    <intent-filter>
        <action android:name="MyService"/>
    </intent-filter>
</service>
```

    语句解释：
    -  由于可能在其他应用程序中绑定MyService类，而在其他应用中又无法直接通过类名绑定，因此设置了意图过滤器。 
    -  Intent匹配相关的知识在《入门篇　第六章 Intent 与 Intent Filters》中有详细的描述。

<br>　　`Stub`类里面还定义了少量的辅助方法，尤其是`asInterface()`，通过它可以获得`IBinder`（当服务绑定成功时传递到客户端的`onServiceConnected()`）并且返回用于调用`IPC`方法的接口实例。

<br>　　范例3：客户端代码。
``` android
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        accessService();
    }

    IDAO dao ;
    public void accessService(){
        Intent  intent = new Intent();
        intent.setAction("MyService");
        this.bindService(intent, new ServiceConnection(){
            public void onServiceConnected(ComponentName name, IBinder service) {
                dao = IDAO.Stub.asInterface(service);
                try {
                    System.out.println(dao.add(100, 200));
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
            public void onServiceDisconnected(ComponentName name) {	}
        }, Context.BIND_AUTO_CREATE  );
    }
}
```

    语句解释：
    -  在AIDL技术中，onServiceConnected()方法的第二个参数是一个IBinderProxy类型的对象，无法直接将其转换成IDAO类型的对象。在IDAO.Stub类中提供了一个静态方法asInterface()，用该方法可以将IBinderProxy类型的对象转换为IDAO类型的对象。


<br>　　范例4：实现步骤。
	-  首先，在应用程序A中定义一个aidl文件。AIDL文件的后缀名是.aidl，是纯文本格式的。AIDL文件和Java中的接口的定义语法十分相似，但也并不是完全一样。它们都使用interface关键字，其内定义的抽象方法就是应用A对外界所提供的接口。定义完毕aidl文件后，eclipse会在gen目录下为.aidl文件生成一个.java文件。在这个java文件中有一个接口，接口中还有一个名为Stub的静态内部类。
	-  然后，在应用程序A中定义一个Service ，Service的内部类去继承Stub类。 同时在onBind方法中返回Service的内部类对象。
	-  接着，将应用A定义的AIDL文件(包括包名)copy到应用B中。
	-  最后，应用B通过绑定方式启动应用A的Service并获取Binder对象。

## Parcelable ##
　　`Android`在`Activity`之间传递`JavaBean`对象时，可让`JavaBean`对象实现`Serializable`或`Parcelable`接口，对象最终会通过序列化和反序列化的方式被传递。
　　通过`Parcelable`接口来传递`Javabean`对象效率比实现`Serializable`接口高，另外如果想要通过`IPC`接口将一个对象从一个进程传递给另外一个进程，那么该类必须支持`Parcelable`接口。

　　创建一个支持`Parcelable`协议的类，需要如下几个步骤：

	1、让你的类实现Parcelabel接口。
	2、然后再让该类实现public void writeToParcel(Parcel out)方法，以便可以将对象的当前状态写入包装对象中（Parcel）。
	3、再在该类中增加一个Parcelable.Creator接口的静态对象CREATOR，用来反序列化。
	4、最后，创建AIDL文件声明这个可打包的类（见下文的Person.aidl），如果使用的是自定义的编译过程，那么不要编译此AIDL文件，它像C语言的头文件一样不需要编译。

<br>　　范例1：实现Parcelable接口。
``` android
public class Person implements Parcelable{
    private int age;
    private String name;

    public int describeContents() {
        return 0;
    }

    // 当需要传递对象时，Android会先调用此方法要求用户将当前对象的各个字段写入到Parcel中。
    public void writeToParcel(Parcel dest, int flags) {
        // 将Person类的各个属性写入到Parcel对象中。
        dest.writeInt(age);
        dest.writeString(name);
    }
}
```

　　上面的代码还并不完整，在实现`Parcelable`接口时，还需要在实现类中定义一个静态常量，常量的签名为：`public static final Parcelable.Creator<T> CREATOR`
　　因为`Parcelable`接口和`Serializable`接口类似，`Serializable`接口在传递对象的时候需要进行“序列化”和“反序列化” 操作，`Parcelable`接口也需要执行相似的操作：

	-  传递之前，先将JavaBean的各个字段写入到一个Parcel对象中。
	-  系统会将Parcel对象传递出去。
	-  数据到达目的地后，系统再从Parcel中将各个数据读出来，然后创建出一个JavaBean对象。
　　也就是说：

	-  当需要将JavaBean对象转成Parcel对象时，会调用Parcelable接口的writeToParcel()方法。
	-  当需要还原JavaBean对象时，则会调用Parcelable.Creator接口中提供的方法。

<br>　　范例2：完整代码。
``` android
public class Person implements Parcelable {
    private int age;	
    private String name;	
	
    public int describeContents() {
        return 0;
    }

    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(age);
        dest.writeString(name);
    }

    public static final Parcelable.Creator<Person> CREATOR = new Parcelable.Creator<Person>() {
        public Person createFromParcel(Parcel source) {
            Person p = new Person();
            p.age = source.readInt();
            p.name = source.readString();
            return p;
        }
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };
}
```

    语句解释：
    -  各个字段读的顺序和写的顺序必须一致。
	-  注意：在同一个进程通过AIDL传递对象的时候，并不会序列化对象，而仅仅是进行参数传递。

## 传递复杂类型 ##
　　在IPC进程通信时，若需要传递Javabean类型的对象，则该Javabean必须要实现Parcelable接口。具体的过程如下：

　　1、在服务端的`org.cxy.entity`包中创建一个`Person`类，并实现Parcelable接口（参见上一节）。
　　2、在服务端的`org.cxy.entity`包中创建一个`Person.aidl`文件，内容如下： 
``` android
package org.cxy.entity;
parcelable Person;
```

    语句解释：
    -  注意aidl文件必须要和Person.java放在同一个包下面。
	-  关键字parcelable必须全部小写。

　　3、在服务端的`org.cxy.aidl`包中创建一个`IDAO.aidl`文件，代码如下：
``` android
package org.cxy.aidl;
import org.cxy.entity.Person;
interface IDAO {
    Person newInstance(int age,String name);
}
```

    语句解释：
    -  在IDAO.aidl文件中，需要使用import关键字，导入Person的aidl文件。

　　4、在服务端定义一个Service，并继承IDAO.Stub类。
``` android
public class Test1Service extends Service {
    public IBinder onBind(Intent intent) {
        return new MyBinder();
    }
    private final class MyBinder extends IDAO.Stub{
        public Person newInstance(int age, String name) throws RemoteException {
            Person instance = new Person();
            instance.setAge(age);
            instance.setName(name);
            return instance;
        }
    }
}

```

    语句解释：
    -  当client端绑定完服务并调用MyBinder的newInstance()方法时，该方法就会创建一个Person对象并返回。


　　5、需要将服务端定义的`IDAO.aidl`文件copy到客户端项目中，以供客户端使用。

	-  但是由于IDAO.aidl文件中使用到了Person.aidl文件，因此相应的也需要将Person.aidl、Person.java文件一起copy到客户端项目中。
	-  在client中Person.aidl和Person.java仍然需要被放在org.cxy.entity包中。

　　6、客户端通过绑定的方式启动服务端的Service即可。
``` android
public class MainActivity extends Activity {
    private void binderService() {
        Intent intent = new Intent();
        // 服务端的Service设置了意图过滤器。 但是配置代码的被我省略了，相信你能看懂下面这行代码。
        intent.setAction("org.cxy.test1.service");
        bindService(intent, new ServiceConnection(){
            public void onServiceConnected(ComponentName name,IBinder service) {
                IDAO dao = IDAO.Stub.asInterface(service);
                try {
                    Person p = dao.newInstance(20, "门庆•西");
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
            public void onServiceDisconnected(ComponentName name) {	}
        },  Context.BIND_AUTO_CREATE);
    }
}
```

<br>　　当client端调用server端的newInstance()方法时，系统会依次执行：

	-  首先，调用server端的newInstance()方法，创建Person对象。
	-  然后，调用server端的Person类的writeToParcel()方法，将该对象写入到Parcel中。
	-  接着，将Parcel对象返回到client端。
	-  最后，在client端的Person类的CREATOR属性的createFromParcel方法中将Parcel中的各个字段读出，并创建出一个Person对象。 

# 第四节 系统内置服务 #
　　在Android系统中内置了许多系统服务，它们各自对应不同的功能。常见的服务有：通知管理器、窗口管理器、包管理器等。
## 包管理器 ##
　　包管理器(PackageManager)可以获取当前用户手机中已安装apk文件中的信息。如：获取某个apk文件的AndroidManifest文件中的数据等。
### PackageInfo ###

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

### ActivityInfo ###
　　ActivityInfo类描述的是AndroidManifest文件中的`<activity>`标签。
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

<br>　　范例2：元数据。在Android中可以在AndroidManifest文件里面为Activity、BroadcastReceiver、Service配置参数，这些参数被称为“元数据”。
``` android
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
    -  使用<meta-data>标签为组件配置元数据,元数据是一个key/value。 
    -  使用android:name属性指出元数据的key，使用android:value属性指出元数据的value 。其中元数据的value可以是一个常量，也可以从资源文件中引用。
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
``` android
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

### ApplicationInfo ###
　　ApplicationInfo类描述的是应用程序的`<application>`标签。
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

<br>　　提示：

	PackageManager类还有一个比较常用的方法：
	-  public abstract Intent getLaunchIntentForPackage (String packageName)
	为它指定一个应用程序(包名)，它将返回一个能打开该包名对应的应用程序的入口Activity的Intent对象。

## 活动管理器 ##
　　本节内容主要是讲解ActivityManager的使用，通过ActivityManager我们可以获得内存信息、进程信息，还可以终止某个进程。当然只能终止用户的进程，系统的进程是杀死不了的。
<br>　　ActivityManager常用的静态内部类如下：

	-  ActivityManager.MemoryInfo： 系统可用内存信息
	-  ActivityManager.RecentTaskInfo： 最近的任务信息
	-  ActivityManager.RunningAppProcessInfo： 正在运行的进程信息
	-  ActivityManager.RunningServiceInfo： 正在运行的服务信息
	-  ActivityManager.RunningTaskInfo： 正在运行的任务信息

### RunningTaskInfo ###
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

<br>　　ComponentName类用于描述Android中的四大组件（Activity等），且它只有两个属性。因为若想在Android系统中找到某个组件，仅需要提供两个数据即可：包名、组件名。

	-  包名：用来指出该组件所在的应用程序。
	-  组件名：找到应用程序后，再依据组件名，来在该程序中找对应的组件。
　　常用方法：

	-  public ComponentName (Context pkg, Class<?> cls)
	   -  根据指定的上下文和Class来构造一个ComponentName对象。
	-  public String getClassName()
	   -  返回当前组件的类名（包含包名）。
	-  public String getShortClassName()
	   -  返回当前组件类名（不包含包名，比如getClassName()返回的是com.example.androidtest.MainActivity，则它返回的是.MainActivity）。
	-  public String getPackageName()
	   -  返回当前组件所在的应用程序的包名。

### MemoryInfo ###
　　MemoryInfo表示当前Android系统的内存信息。
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

### RunningAppProcessInfo ###
　　RunningAppProcessInfo用来描述当前内存中的一个进程的信息。
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


## 连接管理器 ##
　　连接管理器(ConnectivityManager)可以获取当前用户手机网络连接状态。

<br>　　范例1：获取网络类型。
``` android
public class NetworkUtils {

    /** 没有网络 */
    public static final String NETWORKTYPE_INVALID = "unknown";
    /** wap网络 */
    public static final String NETWORKTYPE_WAP = "wap";
    /** 2G网络 */
    public static final String NETWORKTYPE_2G = "2G";
    /** 3G和3G以上网络，或统称为快速网络 */
    public static final String NETWORKTYPE_3G = "3G";
    /** wifi网络 */
    public static final String NETWORKTYPE_WIFI = "wifi";
	
    /**
     * 获取网络状态，wifi,wap,2g,3g.
     *
     * @param context 上下文
     * @return int 网络类型
     */

    public static String getNetWorkType(Context context) {
        ConnectivityManager manager = (ConnectivityManager) 
              context.getSystemService(Context.CONNECTIVITY_SERVICE);
        // 获取当前手机上的正在活动的网络连接。
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        // 默认是无效网络。
        String mNetWorkType = NETWORKTYPE_INVALID;
        // isConnected()方法用来查看网络连接是否存在，并有可以通过连接传递数据。
        if (networkInfo != null && networkInfo.isConnected()) {
            String type = networkInfo.getTypeName();
            if (type.equalsIgnoreCase("WIFI")) {
                // WIFI网络
                mNetWorkType = NETWORKTYPE_WIFI;
            } else if (type.equalsIgnoreCase("MOBILE")) {
                // 进一步检测是2G、3G、wap三种网络中的哪种。
                String proxyHost = android.net.Proxy.getDefaultHost();
                mNetWorkType = TextUtils.isEmpty(proxyHost)? (isFastMobileNetwork(context) ? 
                        NETWORKTYPE_3G : NETWORKTYPE_2G) : NETWORKTYPE_WAP;
            }
        }
        return mNetWorkType;
    }

    private static boolean isFastMobileNetwork(Context context) { 
        TelephonyManager telephonyManager = (TelephonyManager)
                 context.getSystemService(Context.TELEPHONY_SERVICE);
        switch (telephonyManager.getNetworkType()) {
            case TelephonyManager.NETWORK_TYPE_1xRTT:
                return false; // ~ 50-100 kbps
            case TelephonyManager.NETWORK_TYPE_CDMA:
                return false; // ~ 14-64 kbps
            case TelephonyManager.NETWORK_TYPE_EDGE:
                return false; // ~ 50-100 kbps
            case TelephonyManager.NETWORK_TYPE_EVDO_0:
                return true; // ~ 400-1000 kbps
            case TelephonyManager.NETWORK_TYPE_EVDO_A:
                return true; // ~ 600-1400 kbps
            case TelephonyManager.NETWORK_TYPE_GPRS:
                return false; // ~ 100 kbps
            case TelephonyManager.NETWORK_TYPE_HSDPA:
                return true; // ~ 2-14 Mbps
            case TelephonyManager.NETWORK_TYPE_HSPA:
                return true; // ~ 700-1700 kbps
            case TelephonyManager.NETWORK_TYPE_HSUPA:
                return true; // ~ 1-23 Mbps
            case TelephonyManager.NETWORK_TYPE_UMTS:
                return true; // ~ 400-7000 kbps
            case TelephonyManager.NETWORK_TYPE_EHRPD:
                return true; // ~ 1-2 Mbps
            case TelephonyManager.NETWORK_TYPE_EVDO_B:
                return true; // ~ 5 Mbps
            case TelephonyManager.NETWORK_TYPE_HSPAP:
                return true; // ~ 10-20 Mbps
            case TelephonyManager.NETWORK_TYPE_IDEN:
                return false; // ~25 kbps
            case TelephonyManager.NETWORK_TYPE_LTE:
                return true; // ~ 10+ Mbps
            case TelephonyManager.NETWORK_TYPE_UNKNOWN:
                return false;
            default:
                return false;
        }
    }
}

```

    语句解释：
    -  执行本范例的代码需要在清单文件中申请如下两个权限：
       -  <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
       -  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

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

　　在Sensor类中没有提供public的构造器，若想构造一个Sensor对象，则可以使用系统提供的一个类SensorManager。

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
　　由于手机所处的环境是不断变化的，因此在代码中通常会定义一个监听器，不断的监听外界环境，当外界环境改变时，SensorManager就会调用监听器中的方法。

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