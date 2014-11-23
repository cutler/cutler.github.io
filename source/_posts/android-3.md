title: 第二章 应用程序组件 — Service
date: 2014-11-12 22:40:14
categories: android
tags:
- Android
---
　　一个Service就是一个能够在后台执行长时操作的应用程序组件。Service与Activity不同之处是Service没有用户界面，它运行在程序的后台，通常用来完成一些现不需要用户界面但是需要一直运行的功能，如`处理网络事务(消息推送)`、`播放音乐`、`执行文件I/O`、或者`跟CotentProvider交互`等，所有这些都是在后台完成的。
　　任何一个应用程序组件都能够启动Service，即使用户随后切换到另一个应用程序，这个Service也会继续在后台运行。此外，一个组件也能够绑定一个跟它交互的Service，甚至是进程间通信（IPC）。

<br>**启动Service与开启线程的区别：**
　　1、它们的生命周期不同。

	由于Andriod的特殊性，后台进程在系统内存紧缺的时候可能被杀掉，其内的静态变量、子线程也会随之被销毁，这种情况可能发生在任何时候，甚至于线程执行的中途。最重要的是，一旦被杀掉Thread是无法再次重新启动，而Service所在的进程虽然也可能被杀掉，但当稍后系统内存足够时它可以被自动重启，继续未完成的工作，同时拥有Service的进程的优先级高，内存紧张时也不容易被终止。

　　2、实例的个数是不同的。

	若在Activity的某个生命周期方法中（如onCreate、onStart等）开启线程，那么当Activity生命周期发生改变（如横竖屏切换导致Activity被重建）时，会导致生命周期方法被反复调用，因此就可能开启多个Thread来执行相同的任务，即一个任务被执行的多次。 
	Serivce是单例的，且默认情况下在其宿主进程中运行。

　　3、数量级不同。

	与Thread相比较Service就稍显重量级，对于一些简单的、短暂的(几秒钟内就能完成的)http请求，并不一定需要在Service中执行，直接通过Thread来实现会更方便一些。

　　4、它们不是对立的。

	在Service中若需要执行耗时操作，仍然需要开启一个Thread对象，Service的各个生命周期方法都是在主线程中被调用。

<br>　　因此：
　　对于一些`简单的`、`短暂的`http请求等异步操作可以使用`Thread`类，因为此时不需要考虑到进程被杀掉的风险。
　　对于`长时间运行的`、`重要的耗时操作`，如`音乐播放`、`消息推送`、`上传下载`等操作，相比之下则更应该使用Service来完成（但也不是必须的）。 
　　因为Service具有销毁重启、全局唯一以及其他若干Android封装好的特性，所以最适合长时间运行的场景，但是除了耗时操作外，Service另一个重要的功能则是`进程间通信`（IPC）。 

<br>　　**警告：**

	一个Service运行在它的宿主进程的 “主线程” 中，这个Service不创建它自己的线程，并且不在一个单独的进程中运行（除非你指定）。这就意味着如果你的Service要做一些频繁的CPU工作或阻塞操作（如MP3的回放或网络操作），你应该在这个Service中创建一个新的线程来做这项工作。通过使用一个单独的线程，你会减少应用程序不响应（ANR）的错误风险，并且应用程序的主线程能够保留给用户，专用于跟Activity的交互。
<br>
# 第一节 基础入门 #
## 创建Service ##
　　通常，你能够继承两个类来创建一个Service类：
<br>　　**Service**
　　这是所有服务的基类。当你通过继承这个类来创建自己的Sevice时，需要注意的是对于耗时的操作，你要去创建一个新的线程去执行，因为`Service的各个生命周期方法都是在应用程序的主线程中被调用`，否则可能降低应用程序正在运行的Activity的性能。
<br>　　**IntentService**
　　这是一个Service类的子类，它使用`工作线程(非UI线程)`来依次处理所有的启动请求，如果你不想自己去写代码来使你的Service可以同时处理多个启动请求，那么这是最好的选择。 需要你做的所有工作就是实现`onHandleIntent()`方法，它接受每个启动请求的Intent对象，以便完成后台工作。
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
　　与Activity相同，你需要重写一些处理Service生命周期关键特征的回调方法，在不同的时刻完成对应的功能。需要重写的重要的回调方法如下：

<br>　　**onCreate()**

	通常我们可以通过Context类的startService()方法来启动一个Service。
	当程序调用startService()方法请求操作系统来启动Service时，操作系统会进行如下判断：
	-  若该Service在操作系统中不存在，则系统会创建一个进程并在这个进程中启动该Service，同时调用onCreate()方法。
	-  若操作系统检测到该Service正在运行，则不会调用它的onCreate()方法。 也就是说onCreate()只会在服务首次启动的时候被调用。
	另外，onCreate方法通常用来编写一些初始化相关的代码（它在onStartCommand()或onBind()方法之前调用）。

<br>　　**onStartCommand()**

	在Android中一个Service可以被startService()方法启动多次，但当且仅当Service首次被创建时才会回调onCreate()方法。
	-  若Service是首次启动，系统会先回调onCreate()方法，然后接着回调onStartCommand()方法。
	-  若Service不是首次启动，则系统只会调用Service的onStartCommand()方法。
	而一旦onStartCommand()方法执行了，那么这个Service就被启动了，并且在后台无限期的运行。 

	如果你实现了这个方法，当Service的工作结束时，你有责任通过调用stopSelf()方法或stopService()方法来终止Service。（如果你只想让Service提供绑定的能力，你不需要实现这个方法。）
　　提示：如果你创建的应用是针对`Android1.6`或更早版本的，你需要实现onStart()而不是onStartCommand()(在`Android2.0`中，`onStart()被废弃代替之以onStartCommand()`)。

<br>　　从onStartCommand()方法中返回的值必须是以下常量，这个常量是一个描述了在系统的杀死事件中，系统应该如何继续这个服务的值（虽然你能够修改这个值，但是IntentService处理还是为你提供了默认实现）：


	- START_NOT_STICKY
	  - 若系统在onStartCommand()方法返回后杀死这个服务，那么直到再次接收到新的Intent对象，这个服务才会被重新创建。这是最安全的选项，用来避免在不需要的时候运行你的服务。
	- START_STICKY
	  - 若系统在onStartCommand()返回后杀死了这个服务，系统就会重新创建这个服务并且调用onStartCommand()方法，但是它不会重新传递最后的Intent对象，系统会用一个null的Intent对象来调用onStartCommand()方法。这个选项适用于不执行命令的媒体播放器（或类似的服务），它只是无限期的运行着并等待工作的到来。
	- START_REDELIVER_INTENT
	  - 若系统在onStartCommand()方法返回后杀死了这个服务，系统就会重新创建了这个服务，并且用发送给这个服务的最后的Intent对象调用了onStartCommand()方法。这个选项适用于那些应该立即恢复正在执行的工作的服务，如下载文件。

<br>　　**onBind()**

	有两种方式启动Service，一种是通过startService()方法，另一种是通过bindService()方法。
	当程序想通过调用bindService()方法跟这个Service（如执行RPC）绑定时，系统会调用这个方法。在这个方法的实现中，你必须通过返回一个IBinder对象给客户提供一个可以跟Service进行交互的接口。你必须实现这个方法，因为它是抽象的，但是如果你不想其他组件绑定Service，那么这个方法应该返回null。

<br>　　**onDestroy()**

	当Service正在销毁时，系统会调用这个方法。你的Service应该使用这个方法来实现一些清理资源的工作，如清理线程、被注册的Listener、receiver等。这是Service能够接收的最后的调用。

<br>　　如果组件通过调用startService()方法启动Service，那么这个Service就会一直运行到它自己用stopSelf()方法终止Service，或另一个组件通过调用stopService()方法来终止它。
　　如果一个组件调用bindService()方法来创建这个Service（并且不调用onStartCommand()方法），那么这个Service只跟绑定的组件运行同样长的时间。一旦这个Service从所有的客户端解绑，系统就会销毁它。

　　Android系统只有在内存不足和必须给有用户焦点的Activity回收系统资源时，才会`强制终止一个Service`。如果Service是被一个有用户焦点的Activity绑定的，那么`它不可能被杀死`，并且如果这个Service被声明运行在前台（稍后讨论），那么它也几乎不能被杀死。否则如果这个Service被启动并且长时间运行，那么`随着时间的推移`系统会降低它在后台任务列表中位置，并且这个Service将很容易被杀死（如果你的Service被启动了，那么你必须把它设计成能够通过系统来进行妥善的重启）。如果系统杀死了你的Service，那么`一旦资源变为有效它就会重启`（虽然这也依赖从onStartCommand()方法返回的值，稍后讨论）。
<br>
### 继承IntentService ###
　　前面说到，创建服务可以通过继承Service类或IntentService类来实现，本节将详细介绍如何通过继承IntentService来创建服务。
　　事实上`IntentService`继承自Service类，Service类的所有生命周期方法都是在`主线程`中被调用的，这意味着如果你需要执行耗时操作的话，就必须自己开启一个Thread，然后在Thread中去执行。而IntentService内部封装了这一功能，它会把所有接到的请求交给一个工作线程去执行，这里所说的`“请求”`被封装成Intent，客户端通过调用startService(Intent)方法来发送请求。
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

<br>　　在IntentService中有一个队列，先发来的请求会被先被处理。若服务正在处理某个请求时，又接到新的请求，则新请求会被放到队列中等待，队列中的所有请求都按照先进先出的原则被依次处理。当队列中的所有请求都被处理完毕后，IntentService就会调用stopSelf(int)方法来终止自己。
　　若接到新请求时IntentService并没有被启动，则会像普通Service那样，调用onCreate()方法，且在onCreate()方法中会创建一个队列，并开始处理新请求。
　　由于IntentService类的各个生命周期方法中，都对Service做了扩展，因此除非必要你不应该重写这些方法，重写时应该先调用父类的实现，同时你不应该重写onStartCommand()方法。

<br>　　IntentService类执行以下操作：

	1、 创建一个独立与应用程序主线程的默认工作线程，执行所有传递给onStartCommand()方法Intent的处理；
	2、 创建一个工作队列，以便每次只给你的onHandleIntent()方法实现传递一个Intent，因此你不必担心多线程的问题；
	3、 当所有的启动请求都被处理之后自动终止这个服务，因此你不需要自己去调用stopSelf()方法；
	4、 提供返回null的onBind()方法的默认实现；
	5、 提供一个onStartCommand()方法的默认实现和onHandleIntent()方法的实现。
　　所以这些加起来实际上只需要实现`onHandleIntent()`方法，来完成由客户提供的工作（虽然，你还需要给服务提供一个小的构造器）。

<br>　　以上就是你做的全部：`一个构造器`和`一个onHandleIntent()方法的实现`。
　　如果你还决定要重写其他的回调方法，如onCreate()、onStartCommand()、或onDestroy()，那么就要确保调用父类的实现，以便IntentService对象能够适当的处理工作线程的活动。
　　例如，onStartCommand()方法必须返回默认的实现（默认的实现获取Intent并把它交付给onHandleIntent()方法），因此重写它时你大致需要这么做：
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
　　除了onHandleIntent()方法以外，唯一不需要调用父类实现的方法是onBind()方法（但是如果你的服务允许绑定，就要实现这个方法）。

<br>　　提示：IntentService还提供了一个有用的方法：public void setIntentRedelivery (boolean enabled)

	如果参数enabled设置为true，onStartCommand(Intent, int, int)将会返回START_REDELIVER_INTENT，随后若onHandleIntent(Intent)返回之前进程死掉了，那么服务以及其所在进程都将会重新启动，且intent重新投递，如果有多个的intent已经投递了，那么只保证最后一个的intent会被重投递。

<br>　　**何时使用?**
　　使用IntentService类实现服务的特点如下：

	-  任务按照先进先出顺序依次执行，同一时间无法执行一个以上的任务。
	-  任务一旦被安排后，无法撤销、终止。
　　因此，IntentService类适合于对上述两种缺点无要求的应用场合。

<br>　　**继承Service**
　　继承IntentService类来实现一个服务很简单，但是如果你`需要服务同时执行多个线程`（而不是通过工作队列来处理启动请求），那么你就要继承Service类来处理每个Intent。继承Service时你可以自己处理每个onStartCommand()方法的调用，因此你就能够同时执行多个请求。

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

<br>　　在`<service>`元素中还包括了一些其他的属性定义，如启动Service所需的权限和Service应该运行在哪个进程中。`android:name`属性是唯一必须的属性（它指定了这个Service的类名）。一旦你发布了应用，就不应该改变这个名字，因为如果修改了，就会中断那些使用Intent引用这个Service的功能。
　　就像Activity一样，一个Service也能够定义`Intent过滤器`，允许其他组件使用隐式的Intent来调用这个Service。通过声明Intent过滤器，安装在用户设备上的任何应用程序的组件都能启动你的Service（如果你的Service声明了一个可供其他应用程序传递给startService()方法的Intent匹配的Intent过滤器）。
　　如果你计划你的Service只在局部使用（其它的应用程序不使用它），那么你就不需要提供任何Intent过滤器（并且也不应该提供）。没有任何Intent过滤器，你就必须使用一个确切的命名Service类的Intent来启动这个Service。关于启动Service的更多信息会在后面讨论。
　　另外，如果你在`<service>`元素中包含了`android:exported`属性，并且属性值设置为`false`，那么就能确保这个Service是你的应用的私有Service了。即使这个Service支持Intent过滤器，这也是有效的。

## 启动Service ##
　　在此之前先了解一下Service的两种启动形式：
<br>　　**被启动(Started)**

	应用程序组件（如一个Activity）通过调用startService()方法启动的Service是“被启动（started）”的。Service一旦启动，它就能够无限期的在后台运行，即使启动它的组件被销毁。通常，一个被启动的Service执行一个单一操作，并且不给调用者返回结果。例如，这个Service可能在网络上下载或上传文件。当操作完成的时候，Service应该自己终止。

　　启动类型的服务应该在工作结束时通过调用stopSelf()方法来终止自己，或者另一个组件通过调用stopService()方法也能终止这个服务。一个应用程序组件(如Activity)能够通过调用startService()方法来启动服务，并且给指定的服务传递一个Intent对象，同时包含一些服务所使用的数据。服务在onStartCommand()方法中接受这个Intent对象。
　　例如，假设一个Activity需要把一些数据保存到服务器端的数据库中。这个Activity就能启动一个服务，并且把要保存的数据放到Intent中，并将Intent对象传递给startService()方法。这个服务在onStartCommand()方法中接受这个Intent对象，连接到互联网，并且执行数据库事务。当事务结束，这个服务就自己终止并销毁。

<br>　　**被绑定(Bounded)**

	应用程序组件通过调用bindService()方法绑定的Service是“被绑定（bound）”的。一个被绑定的Service提供了一个客户端-服务器接口,允许绑定者与该Service进行交互,发送请求,获取结果,甚至这个交互的过程是跨进程的，即进程与进程间通信(IPC)。一个被绑定的Service的运行时间跟绑定它的应用程序组件一样长。多个组件能够绑定同一个Service，但是只有所有这些绑定解绑，这个Service才被销毁。

　　无论你的应用程序是启动、绑定或`同时使用这两种方式`开启一个Service，任何应用程序组件都能使用这个Service（即使是另一个的应用程序），同样的，任何组件也能够通过Intent来启动一个Activity。但是，你能够在清单文件中`声明私有的Service`，并且阻止来自其他应用程序的访问。

<br>**如何启动一个“被启动”的服务？**
　　你可以通过把一个Intent对象（用它来指出要启动的服务）传递给Context类的sartService()方法来启动服务。服务被启动后，Android系统会自动调用服务的onStartCommand()方法，并且给它传递Intent对象（你不应该直接调用onStartCommand()方法）。

　　例如，一个Activity能够使用带有明确的Intent对象的startService()方法来启动一个服务：
``` android
Intent intent = new Intent(this, MyService.class);
// 指定一个Intent对象启动Service，Intent对象即可以是隐式意图也可以是显式意图。
startService(intent);
```

    语句解释：
    -  事实上，在Context类中就提供了启动四大组件所需要使用的方法。

　　方法startService()将Intent传递给操作系统后，`会立即返回`，随后则由Android系统去调用服务的onStartCommand()方法。如果服务还没有运行，系统首先调用onCreate()方法，然后调用onStartCommand()方法。
　　如果服务不支持绑定（即onBind方法返回null），那么用startService()方法发送Intent对象是应用程序组件和服务之间仅有的通信模式。但是，你想要服务发送一个反馈结果，那么启动服务的客户端可以使用PendingIntent对象（用getBroadcast()方法）来创建一个用于广播的PendingIntent对象，并且把它发送给启动服务的Intent对象所在的服务。然后这个服务随后就能够使用这个PendingIntent对象来发送结果。
　　组件每启动一次服务(发起请求)，都会导致一次服务的onStartCommand()方法被调用，但是只要有一个请求终止服务（使用stopSelf()方法或stopService()方法），服务就会被终止。

<br>**生命周期方法**
<br>　　“被启动”类型的服务会涉及到三个生命周期方法：
	-  首先，服务对象创建完毕后服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，onCreate方法调用后，服务的onStartCommand方法被调用，开始运行服务。  
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

　　**使用“被启动”类型的服务时，服务何时会被销毁呢?**
　　答：有两种方式可以销毁：

	-  第一，在程序中调用Context类的stopService方法停止服务。
	-  第二，服务自己调用自己的stopSelf()方法使自己停止。
　　除此之外，服务会一直运行在进程里面。 除非系统要回收系统内存，否则系统不会终止或销毁这个服务。


## 停止Service ##
　　启动类型的服务必须管理它自己的生命周期。也就是说除非系统要回收系统内存，否则系统不会终止或销毁这个服务，在onStartCommand()方法返回后，这个服务会继续运行。因此而这种类型的服务必须通过调用`stopSelf()`方法或另一个组件通过调用`stopService()`方法才能终止。
　　一旦用stopSelf()方法或stopService()方法请求终止服务，那么系统会尽快的销毁这个服务。但是，如果你的服务同时处理多个对onStartCommand()方法的请求，那么在你完成某个请求的处理过程后，不应该终止这个服务，因为你的服务可能正在接受一个新的启动请求（在第一个请求结束时终止服务有可能会终止第二个请求）。
　　要避免这个问题，你能够使用`stopSelf(int)`方法来确保你请求终止的服务始终是基于最后启动的请求。也就是说，调用stopSelf(int)方法时，你要把那个要终止的服务ID传递给这个方法（这个ID是系统发送给onStartCommand()方法的参数）。这样如果服务在你调用stopSelf(int)方法之前收到了一个新的启动请求，那么这个ID就会因不匹配而不被终止。

　　警告：你的应用程序要在工作结束时终止它的服务，这是十分重要的，这样可以避免浪费系统资源和电池电量。如果需要，其他的组件能够调用stopService()方法终止服务。即使对于通过绑定方式启动的服务，如果这个服务被绑定之后又接收到了对onStartCommand()方法的调用，你也必须自己来终止这个服务。

<br>
# 第二节 绑定类型的Service #
　　绑定类型的服务允许应用程序组件通过调用bindService()方法与服务创建一个`长连接`。

　　**问：为什么要使用此种方式?**
　　答：很多时候，服务用来完成一个耗时的操作，在服务运行的时候，用户可以通过Activity提供的界面控件，来调用用户自定义的服务中提供的方法，从而控制服务的执行。

　　服务和线程类似，`直接调用服务的生命周期方法，是不会启动服务的`。 
　　但是，以目前所掌握的知识来说，若想启动服务，必须通过startService方法。而这个方法仅仅会启动服务，它无法返回该服务对象的引用，无法获取对象就意味着，不能调用服务中的方法。
　　简单的说，使用startService方法启动服务，只有服务的访问者可以向服务发送数据，而`服务是无法返回数据给访问者`的。此时就可以通过“绑定服务”的方式启动服务，因为`通过绑定方式启动服务可以获取服务对象的引用`。
　　因此，在你想要Activity以及应用程序中的其他组件跟服务进行交互(方法调用、数据交换)时，或者要把应用程序中的某些功能通过进程间通信(IPC,interprocess communication )暴露给其他应用程序时，就需要创建一个绑定类型的服务。

## 基础知识 ##
<br>**绑定服务**
　　绑定类型的`Service`是`客户-服务`模式中的`服务端`。 
　　绑定类型服务允许组件(如Activity)通过调用bindService()方法来绑定服务，然后访问者(即客户端)就可以发送请求、接收响应、以及执行进程间通信（IPC）。
　　要创建绑定类型的服务，首先要定义一个接口，用于指定客户端怎样跟服务进行通信(即创建一个interface，interface中提供若干抽象方法)。同时该接口的实现类也必须是IBinder接口的实现，并且要求必须从onBind()回调方法返回这个接口的实现类的对象。然后客户端（其他应用程序组件）就可以调用`bindService()`方法获取这个接口对象，并开始调用这个服务的方法。绑定类型的服务只服务于绑定它的应用程序组件，因此`当没有应用组件绑定这个服务时，系统就会销毁它`。（你不必像样终止通过onStartCommand()方法启动的服务那样终止绑定类型服务）。
　　当某个客户端完成与服务的交互时，它可以调用`unbindService()`方法来解绑。

　　绑定服务时，客户端必须同时为bindService()方法提供一个`ServiceConnection`接口的实现，这个接口中的方法用来监视客户端跟服务端的连接状态。bindService()方法不带有返回值，并立即返回。当Android系统在客户端和服务端创建连接时，它会在ServiceConnection接口上调用`onServiceConnected()`方法来发送客户端跟服务端进行交互用的IBinder对象。
　　注意：若返回的IBinder对象为null，则系统不会回调onServiceConnected()方法。

　　多个客户端能够连接到同一个服务上，但是`只在第一个客户端绑定时`，系统调用服务的onBind()方法来发送获取对象。在随后的绑定请求中，系统会给其他任何绑定的客户端发送相同的IBinder对象，而不会再次调用onBind()方法。当最后一个客户端从服务上解绑时，系统才会调用服务的onUnbind()、onDestroy()方法，并且销毁这个服务(除非这个服务也通过startService()方法启动了)。

　　这里只是大概介绍了如何创建绑定服务，具体的代码实现将在后面列出。

<br>**Service中给用户发送通知**
　　服务一旦运行，就能够使用`土司通知`（Toast Notifications）或`状态栏通知`（Status Bar Notifications）来给用户传递一些必要的提示信息。
　　Toast通知是一个在当前窗口表面短暂显示的一个消息，而状态栏消息会在状态栏中提供一个带有消息的图标，用户能够选择这个图标来启动一个动作（如启动一个Activity）。
　　通常，状态栏通知是用来告知后台任务完成的最好的技术（如文件下载完成），并且用户能够采取相应的动作。当用户从扩展窗口选择这个通知时，这个通知能够启动一个Activity（如文件下载完成的窗口）。
　　关于更多的信息，在后面的“广播通知”或“状态栏通知”的章节中将会详细讲解。

<br>**前台Service**
　　前台服务是那些被认为用户知道的并且`在内存低的时候不允许系统杀死的服务`。
　　前台服务必须在状态栏中放置一个通知(notification)，这就意味着直到这个服务被终止或从前台删除时，通知才能被解除。
　　例如，一个播放音乐的音乐播放器服务应该被设置在前台运行，因为用户明确的知道它们的操作。状态栏中的通知可能指明了当前的歌曲，并且用户启动一个跟这个音乐播放器交互的Activity。
　　要让你的服务在前台运行，需要调用`startForeground()`方法，这个方法需要两个参数：一个唯一标识通知的整数和给状态栏的通知，如：
``` android
Notification notification = new Notification(R.drawable.icon, "ticker_text",System.currentTimeMillis());
Intent notificationIntent = new Intent(this, ExampleActivity.class);
PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
notification.setLatestEventInfo(this, "notification_title", "notification_message", pendingIntent);
startForeground(100, notification);
```
　　要从前台删除服务，需要调用`stopForeground()`方法，这个方法需要一个布尔型参数，指示是否同时删除状态栏通知。这个方法不终止服务。但是，如果你终止了正在运行的前台服务，那么通知也会被删除。
　　注意：startForeground()和stopForeground()方法是在`Android2.0(API Level 5)`中引入的。为了在比较旧的平台版本中运行你的服务，你必须使用以前的setForeground()方法---关于如何提供向后的兼容性，请看startForeground()方法文档。

<br>**生命周期方法**
　　绑定启动方式的服务会涉及到四个生命周期方法：
	-  首先，服务对象被创建后，服务的onCreate方法被调用，执行一些初始化操作。
	-  然后，在第一个访问者和服务建立连接时，会调用服务的onBind方法。 
	-  接着，当最后一个访问者被摧毁，服务的onUnbind方法被调用。因此不要在普通的广播接收者中通过绑定方式，启动服务。因为广播接收者生命周期短暂。
	-  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

　　一个组件（客户端）可以调用`bindService()`方法来与服务建立连接，也可以调用`unbindService()`方法来关闭与服务连接。多个客户端能够绑定到统一个服务，并且当所有的都解绑以后，系统就会销毁这个服务（服务不需要终止自己）。
　　你能够绑定一个已经用startService()方法启动的服务。例如，一个后台的音乐服务能够被带有“标识要播放的音乐”的Intent的startService()方法来启动，稍后，可能在用户想要进行一些播放器的控制时，或想要获取有关当前歌曲信息，那么一个Activity就能够调用bindService()方法来绑定这个服务。在这个场景中，直到所有的客户端解绑，stopService()或stopSelf()方法才能实际终止这个服务。
<center>
![图的左边显示了用startService()方法创建服务时的生命周期，图的右边显示了用bindService()方法创建服务时的生命周期。](/img/android/android_2_11.png)
</center>

　　通过实现这些回调方法，你能够监视服务生命周期的两个嵌套循环：
　　完整生命周期：

	发生在onCreate()和onDestroy()方法调用之间。
	跟Activity一样，服务在onCreate()方法完成初始化安装，在onDestroy()方法中释放所有的保留资源。
	例如，一个音乐回放的服务能够在onCreate()方法中播放音乐的地方创建一个线程，然后在onDestroy()方法中终止这个线程。所有的服务都会调用onCreate()和onDestroy()方法，不管是startService()方法还是bindService()方法创建的服务。
　　活动生命周期：

	发生在onStartCommand()或onBind()方法被调用的时候。
	如果是启动类型的服务，那么服务的活动生命周期的结束时机与完整生命时的结束时机是相同的(服务在onStartCommand()方法返回之后仍然存活)。
	如果是绑定类型的服务，那么活动生命周期是在onUnbind()方法返回时结束。

## 创建绑定服务 ##
　　创建具有绑定能力的服务时，必须提供一个IBinder对象，它用于给客户端提供与服务端进行交互的编程接口。有三种方法能够定义这个接口：

<br>　　1、 继承Binder类

	如果你的服务仅需要在你的应用程序中使用(即私有服务)，并且它跟客户端运行在同一个进程中，那么就应该通过继承Binder类(它是IBinder接口的实现类)来创建一个返回值。客户端接收这个Binder对象，并且能够使用这个对象直接访问Binder类中实现的或Service中的公共方法。
	当你的服务只是在后台给你自己的应用程序工作时，这是首选技术。不使用这种方法创建服务接口的唯一原因是因为你的服务要被其他应用程序或(进行本应用程序内部)跨进程使用。

<br>　　2、 使用信使(Messenger)

	如果你的服务要跨越不同进程来进行工作，那么你能用Messenger类创建一个IBinder对象。在这种方式中，服务定义了响应不同消息对象类型的Handler。这个Handler是一个Messenger的基础，它能够跟客户端共享一个IBinder对象，允许客户端使用Message对象给服务端发送命令。另外，客户端能够定义一个自己的信使，以便服务端能够给客户端发送消息。
	这是执行进程间通信(IPC）最简单的方法，因为信使队列的所有请求都在一个单线程中，因此不需要针对线程安全来设计你的服务。

<br>　　3、 使用AIDL(Android Interface Definition Language)

	AIDL(Android 接口定义语言)执行所有的把对象分解成操作系统能够理解的原语的工作，并且把它们编组到执行IPC(进程间通信)的不同进程中。使用Messenger的技术实际上是基于AIDL架构。就像前面提到的，信使在一个单线程中创建了一个所有客户端请求的队列，因此服务每次只能接收一个请求。但是，如果你想要服务同时处理多个请求，那么就能直接使用AIDL，这种情况下，你的服务必须是多线程的并且要线程安全。
	要使用直接AIDL，就必须创建一个定义编程接口的.aidl文件。Android SDK使用这个文件生成一个实现文件中定义的接口和处理IPC的抽象类，然后你能够在你的服务中进行扩展。
	注意：大多数应用程序不应该是AIDL来创建绑定类型的服务，因为它可能需要多线程的能力，并可能导致更复杂的实现。因此，AIDL不适用于大多数应用程序，并且本节不讨论怎样使用它来创建服务，如果你确定需要直接使用AIDL，请看下节的内容。

### 继承Binder类 ###
　　如果你只在你的应用程序的内部使用服务，并且不需要跨进程工作，那么你可以去实现自己的Binder类，用它直接给你的客户端提供访问服务中公共方法的能力。
　　注意：此种工作方式仅适用于客户端和服务端只是在同一个应用和进程中工作，例如，对于一个要良好工作的播放音乐的应用程序，就需要把在后台工作的播放音乐的服务与应用自己的一个Activity绑定。

　　以下是建立绑定类型服务的步骤：

	1、定义一个类MyService，继承Service类，并定义若干个方法。
	2、在MyService中定义一个内部类MyBinder，继承Binder类，MyBinder类提供一个方法getService()，返回MyService的引用。
	2、从onBind()回调方法中返回这个MyBinder对象的实例；
	3、当访问者通过bindService方法启动服务，并构建一个ServiceConnection对象，且已经和服务建立连接后，ServiceConnection的onServiceConnected方法会被调用。该方法的IBinder参数就是Service的onBind方法返回值。
　　注意：服务端和客户端必须在同一个应用中的原因是：这样的客户端能够直接向下转型返回的IBinder对象，并正确的调用该对象自己的APIs。服务端和客户端也必须是在同一个进程中，因为这种技术不执行任何跨进程处理。

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


### 使用信使(Messenger) ###
　　如果需要服务跟远程进程通信，那么就可以使用Messenger对象来给服务提供接口。这种技术允许你在不使用AIDL的情况下执行进程间通信(IPC)。
　　学习Messenger需要了解Handler的用法，如果你还不知道Handler，请先去第七章网络编程中查看，本章只讲解Service的知识。
　　以下是信使(Messenger)对象的使用概要：

	1、服务端定义一个Handler对象，客户端发送来的请求，都将由它来处理。
	2、使用这个Handler对象来创建一个信使(Messenger)对象。
	3、调用Messenger对象的getBinder()方法创建一个准备返回给客户端的IBinder对象。
	4、客户端绑定成功后，使用这个IBinder对象来实例化一个新的信使对象(但新信使引用了服务端的Handler)，客户端使用这个信使给服务端发送Message对象。
	5、服务端在它的Handler的handleMessage()方法中依次接收客户端发来的每个Message对象，并处理。
　　在这种方法中，没有给客户端提供服务端的方法调用，相反，客户端会给服务端发送消息(Message)对象，服务端会在它的Handler中接受这些消息对象。

　　**问题：服务端接收到请求并处理后，如果将返回值返回到客户端呢?**
　　答：通过Message对象的`replyTo`属性。
　　
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

<br>**以下是关于绑定的重要注意事项：**

	1、你应该始终捕获DeadObjectException异常，当连接被中断时这个异常被抛出。这是由远程方法抛出的唯一异常。
	2、对象的引用计数是跨进程的。
	3、通常绑定和解除绑定应该成对使用，而且要跟客户端的生命周期的启动和退出时刻匹配。例如：
	   -  如果你只需要在Activity可见的时候跟服务交互，那么就应该在onStart()期间绑定在onStop()期间解绑。
	   -  如果你想要Activity在终止(stop)的时候也能在后台接收响应事件，那么可以在onCreate()期间绑定，在onDestroy()期间解绑。这就意味着你的Activity需要在Activity的整个生命周期中都要使用这个服务，这样做要小心了。
	4、由于Messenger是基于Handler的消息队列，因此它同样具有IntentService类的优缺点： 同一时间只能处理单任务、任务无法撤销。

　　注意：通常在Activity的`onResume()`和`onPause()`期间不应该绑定和解除绑定服务，因为这两个回调方法不应该执行过多的处理。 而且，如果应用程序中两个Activity绑定了同一个服务，那么在两个Activity之间切换的时候，由于在第一个Activity的onPause()执行完毕之前，第二个Activity的`onCreate()`、`onStart()`、`onResume()`方法是不会被执行的，因此这个服务就可以在当前Activity绑定解除(暂停期间onPause)与下一个Activity绑定之前(恢复期间onResume)被销毁和创建。

<br>**管理绑定类型服务的生命周期：**
　　当服务从所有的客户端解除绑定时，Android系统会销毁它（除非它还用onStartCommand()方法被启动了）。因此如果是纯粹的绑定类型的服务，你不需要管理服务的生命周期（Android系统会基于是否有客户端绑定了这个服务来管理它）。
　　但是，若你使用了startService()方法启动这个服务，那么你就必须明确的终止这个服务，因为它会被系统认为是启动类型的。这样服务就会一直运行到服务用stopSelf()方法或其他组件调用stopService()方法来终止自己，而不管是否有还有客户端绑定了它。
　　另外，如果你的服务是启动类型的并且也接收绑定，那么当系统调用onUnbind()方法时，如果你想要在下次客户端绑定这个服务时调用onRebind()方法，你可以选择返回true（而不是接收onBind()调用）。onRebind()方法返回void，但是客户端依然能够在它的onServiceConnected()回调中接收IBinder对象。
<center>
![绑定服务的生命周期](/img/android/android_2_12.png)
</center>
# 第三节 AIDL #
　　通常在计算机领域中每一个应用程序都拥有自己的进程，各自的程序都只在自己的进程中运行。但是有些时候设备中的两个进程之间需要进行通信、传递数据，而很多操作系统却是不支持跨进程内存共享的，因此大部分情况下，进程间是无法直接进行通信的。
　　在Android上，一个进程通常不能像访问本进程内存一样访问其他进程的内存。所以，进程间想要对话，需要将对象拆解为操作系统可以理解的基本数据单元，并且有序的通过进程边界。通过代码来实现这个数据传输过程是冗长乏味的，所幸的是android提供了AIDL工具来帮我们完成了此项工作。

<br>　　**关于IPC：**
>　　进程间通信 (IPC interprocess communication)是一个Unix标准通讯机制，提供在同一台主机不同进程之间可以互相通讯的方法。 
　　Linux内核继承和兼容了丰富的Unix系统进程间通信（IPC）机制，在Linux中，进程间的通信机制有很多种，例如可以采用命名管道（named pipe）、消息队列（message queue）、信号（signal）、共享内存（share memory）、socket等方式，它们都可以实现进程间的通信。但是，在Android终端上的应用软件的通信几乎看不到这些IPC通信方式，取而代之的是Binder方式。

>　　在Android系统的Binder机制中，由四个系统组件组成，分别是Client、Server、Service Manager和Binder驱动程序，其中Client、Server和Service Manager运行在用户空间，Binder驱动程序运行内核空间。Binder就是一种把这四个组件粘合在一起的粘结剂，其中，核心组件便是Binder驱动程序了，Service Manager提供了辅助管理的功能，Client和Server正是在Binder驱动和Service Manager提供的基础设施上，进行Client-Server之间的通信。Service Manager和Binder驱动已经在Android平台中实现好，开发者只要按照规范实现自己的Client和Server组件就可以了。

>　　参考阅读：[Binder的机制的原理](http://blog.csdn.net/luoshengyang/article/details/6618363)

<br>　　**AIDL**
　　AIDL(Android Interface Definition Language，Android接口定义语言) 与你可能使用过的其他`IDLs`类似，它允许你通过AIDL定义客户端和服务端都认可的编程接口来实现IPC通信。
　　简单的说AIDL的作用就是：`在通信的进程之间提供一个标准、规范，通信双方进程同时遵守这个规范`。

　　通信，无论是在两个进程之间，还是在人与人之间，一定会有一个`发起方`和一个`接收方`。
　　并且通常是由发起方提出请求，由接收方进行处理。使用IPC技术进行通信的两个进程也是如此，由接收方(Server)进程定义接口，发起方(Client)进程进行请求。当发起方进程需要与接收方进程通信交换数据时，发起方可以调用接收方提供的接口。
　　以系统内置的“电话”程序为例，它通过AIDL技术对外界提供了“接电话”、“挂电话”等接口，其他应用程序就可以调用这两个接口。 这个过程类似于客户端/服务器的通信方式。

<br>　　注意：

	你应当仅在需要从其他应用程序访问你应用程序的Service来实现IPC通信，并且在Service需要处理多线程(多个客户端同时)访问的情况下使用AIDL。如果你不需要使用到进程间的IPC通信，那么通过Binder接口实现将更为合适，如果你需要实现进程间的IPC通信，但不需要处理多线程(多个客户端同时访问Service)，通过Messenger来实现将更为合适。不管怎样，在使用AIDL之前，应先确保已理解了Bound Service。

<br>　　在开始设计你的AIDL接口之前，要先了解一件事情：

	1、AIDL接口的调用采用的是直接的函数调用方式，但你无法预知哪个进程(或线程)将调用该接口。同进程的线程调用和其他进程调用该接口之间是有所区别的。
	2、在同进程中调用AIDL接口，AIDL接口代码的执行将在调用该AIDL接口的线程中完成，如果在主UI线程中调用AIDL接口，那么AIDL接口代码的执行将会在这个主UI线程中完成。因此，如果仅仅是本进程中的线程访问该服务，你完全可以控制哪些线程将访问这个服务（但是如果是这样，那就完全没必要使用AIDL了,而采取Binder接口的方式更为合适）。
	3、远程进程中调用AIDL接口时，将会在AIDL所属的进程的线程池中分派一个线程来执行该AIDL代码，所以编写AIDL时，你必须准备好可能有未知线程访问、同一时间可能有多个调用发生（多个线程的访问），所以ADIL接口的实现必须是线程安全的。
	4、可以用关键字oneway来标明远程调用的行为属性，如果使用了该关键字，那么远程调用将仅仅是调用所需的数据传输过来并立即返回，而不会等待结果的返回，也即是说不会阻塞远程线程的运行。AIDL接口将最终将获得一个从Binder线程池中产生的调用（和普通的远程调用类似）。如果关键字oneway在本地调用中被使用，将不会对函数调用有任何影响，调用仍然是同步的。

	注意：第3、4条所说的本人并未去验证。

## 定义AIDL接口 ##
　　AIDL顾名思义，它也是一种语言。但是它的语法规则却是和Java语言中的`interface`高度相似。
　　AIDL编写出来的文件使用`.aidl`做为后缀名。完成之后需要将该`.aidl`文件保存在 `src`目录下(无论是服务端还是客户端都得保存同样的一份拷贝，也就是说只要是需要使用到该AIDL接口的应用程序都得在其src目录下拥有一份.aidl文件的拷贝)。
　　编译时Android sdk 工具将会为`src`目录下的`.aidl`文件在`gen`目录下产生一个IBinder接口。服务端必须相应的实现该IBinder接口。客户端可以绑定该服务、调用其中的方法实现IPC通信。

<br>　　创建一个用AIDL实现的服务端，需要以下3个步骤：
 
	1、创建.aidl文件(内部的代码类似于Java的接口)。其内定义了若干抽象方法。
	2、实现这个接口。 Android SDK将会根据你的.aidl文件产生AIDL接口。生成的接口包含一个名为Stub的抽象内部类，该类声明了所有.aidl中描述的方法，你必须在代码里继承Stub类并且实现相应的方法。
	3、向客户端公开服务端的接口。实现一个Service，并且在onBinder方法中返回第2步中实现的那个Stub类的子类（实现类）。
　　注意：服务端AIDL的任何修改都必须的同步到所有的客户端，否则客户端调用服务端得接口可能会导致程序异常(因为此时客户端此时可能会调用到服务端已不再支持的接口)。

### 创建.aidl文件 ###
　　AIDL使用简单的语法来描述其方法以及方法的参数和返回值。这些参数和返回值可以是任何类型，甚至是其他AIDL生成的接口。重要的是必须导入所有非内置类型，哪怕是这些类型是在与接口相同的包中。

　　默认的AIDL支持一下的数据类型(这些类型不需要通过import导入)：

	1、java语言的原始数据类型(包括 int, long, char, boolen 等等)。
	2、String
	3、CharSequence
	4、List：列表中的所有元素必须是在此列出的类型，包括其他AIDL生成的接口和可打包类型。List可以像一般的类（例如List<String>）那样使用，另一边接收的具体类一般是一个ArrayList，这些方法会使用List接口
	5、Map：Map中的所有元素必须是在此列出的类型，包括其他AIDL生成的接口和可打包类型。一般的maps(例如Map<String,Integer>)不被支持，另一边接收的具体类一般是一个HashMap，这些方法会使用Map接口。
　　对于以上未列出的其他类型，你必须在aidl中使用import导入，即使该类型和aidl处于同一包内。
　　
　　定义一个服务端接口时，注意一下几点：

	1、方法可以有0个或多个参数，可以返回一个值也可以不返回值(void)。
	2、所有非原始数据类型的参数必须指定参数方向(是传入参数，还是传出参数)，传入参数使用in关键字标记，传出参数使用out，传入传出参数使用inout。如果没有显示的指定，那么将缺省使用in。 限定参数的传输方向非常有必要，因为编组（序列化）参数的代价非常昂贵。
	3、在aidl文件中所有的注释都将会包含在生成的IBinder接口中(在import和pacakge语句之上的注释除外)。
	4、aidl中只支持成员方法，不支持static变量。

<br>　　范例1：定义AIDL文件。
``` android
package org.cxy.dao;
interface IDAO {
    int add(int i,int j);
}
```

    语句解释：
    -  将该IDAO.aidl文件保存在工程目录中的“src/org/cxy/dao/”目录下，当需要编译生成apk时，sdk工具将会在 “gen/org/cxy/dao/”目录下生成一个对应的IBiner接口的IDAO.java文件。
	-  如果使用eclipse编写app，那么这个IBinder接口文件将会瞬间生成。如果不是使用eclipse，Ant 工具将会在下次编译你的app时，生成这个IBinder接口文件——所以当你编写.aidl文件之后应该立即使用 ant debug 编译你的app，这样你后续的代码就可以使用这个已生成的IBinder接口类了。

<br>　　范例2：AIDL文件的定义规范。

	-  接口名需要和aidl文件名相同。 
	-  接口和方法前不能加访问权限修饰符和存在修饰符。如：public、static都不可以。
	-  AIDL默认支持的类型包话java基本类型(int、long、boolean等)和(String、List、Map、CharSequence)，使用这些类型时不需要import声明。对于List和Map中的元素类型必须是Aidl支持的类型。如果需要使用自定义类型作为参数或返回值，自定义类型必须实现Parcelable接口。
	-  自定义类型和AIDL生成的其它接口类型在aidl描述文件中，应该显式import，即便在该类和定义的包在同一个包中。
	-  在aidl文件中所有非Java基本类型参数必须加上in、out、inout标记，以指明参数是输入参数、输出参数还是输入输出参数。
	-  Java原始类型默认的标记为in,不能为其它标记。

### 实现接口 ###
　　当您构建您的应用程序时，SDK工具会依照`.aidl`来生成一个`.java`文件。其内包含一个名为`Stub`的抽象的内部类，并且它`implements`了你在`.aidl`中定义的接口，以及接口中的所有方法。 
　　接下来要做的就是，在你应用程序中实现该接口，并在Service的onBind()方法被调用时，将该实例返回。

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
    -  由于可能在其他应用程序中绑定MyService类，而在其他应用中又无法直接通过类名绑定，因此设置了意图过滤器。 关于Intent匹配在后面章节中会有详细的描述。

　　Stub类里面还定义了少量的辅助方法，尤其是asInterface()，通过它可以获得IBinder（当服务绑定成功时传递到客户端的onServiceConnected()）并且返回用于调用IPC方法的接口实例。

<br>　　范例3：MainActivity。
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
　　AIDL技术是基于Service来实现的，即在接收方(Server)定义Service来为发起方(Client)服务。
	-  首先，在应用程序A中定义一个aidl文件。AIDL文件的后缀名是.aidl，是纯文本格式的。AIDL文件和Java中的接口的定义语法十分相似，但也并不是完全一样。它们都使用interface关键字，其内定义的抽象方法就是应用A对外界所提供的接口。定义完毕aidl文件后，eclipse会在gen目录下为.aidl文件生成一个.java文件。在这个java文件中有一个接口，接口中还有一个名为Stub的静态内部类。
	-  然后，在应用程序A中定义一个Service ，Service的内部类去继承Stub类。 同时在onBind方法中返回Service的内部类对象。
	-  接着，将应用A定义的AIDL文件(包括包名)copy到应用B中。
	-  最后，应用B通过绑定方式启动应用A的Service并获取Binder对象。

## Parcelable ##
　　Android在Activity之间传递JavaBean对象时，可让JavaBean对象实现`Serializable`或`Parcelable`接口。然后就可以将这个JavaBean对象放入到Intent中进行传递了。对象最终会通过序列化和反序列化的方式被传递。
　　通过Parcelable接口来传递Javabean对象效率比实现Serializable接口高，而且还可以用在进程间通信(IPC)中。

　　如果想要通过IPC接口将一个对象从一个进程传递给另外一个进程，这个可以实现，但是必须得保证这个对象的类型在IPC两端的有效性，并且该类必须支持Parcelable接口。支持Parcelable接口非常重要，因为这允许Android系统将Object拆解为原始数据类型，这样才能达到跨进程封送（序列化发送）。

　　创建一个支持Parcelable协议的类，需要如下几个步骤：

	1、让你的类实现Parcelabel接口。
	2、然后再让该类实现public void writeToParcel(Parcel out)方法，以便可以将对象的当前状态写入包装对象中（Parcel）。
	3、再在该类中增加一个Parcelable.Creator接口的静态对象CREATOR。
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

　　上面的代码还并不完整，在实现Parcelable接口时，还需要在实现类中定义一个静态常量，常量的签名为：`public static final Parcelable.Creator<T> CREATOR`
　　因为，Parcelable接口和Serializable接口类似，Serializable接口在传递对象的时候需要进行“序列化”和“反序列化” 操作，Parcelable接口也需要执行相似的操作：

	-  传递之前，先将JavaBean的各个字段写入到一个Parcel对象中。
	-  系统会将Parcel对象传递出去。
	-  数据到达目的地后，系统再从Parcel中将各个数据读出来，然后创建出一个JavaBean对象。
　　即当需要将JavaBean对象转成Parcel对象时，会调用Parcelable接口的writeToParcel()方法。
　　而当需要还原JavaBean对象时，则会调用Parcelable.Creator接口中提供的方法。

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

　　1、在服务端的org.cxy.entity包中创建一个Person类，并实现Parcelable接口（参见上一节）。
　　2、在服务端的org.cxy.entity包中创建一个Person.aidl文件。 
``` android
package org.cxy.entity;
parcelable Person;
```

    语句解释：
    -  注意aidl文件必须要和Person.java放在同一个包下面。
	-  关键字parcelable必须全部小写。

　　3、在服务端的org.cxy.aidl包中创建一个IDAO.aidl文件，代码如下：
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


　　5、需要将服务端定义的IDAO.aidl文件copy到客户端项目中，以供客户端使用。

	-  但是由于IDAO.aidl文件中使用到了Person.aidl文件。
	-  相应的也需要将Person.aidl、Person.java文件一起copy到客户端项目中。
　　注意：Person.aidl和Person.java的包结构不能改，在client中它们仍然需要被放在org.cxy.entity包中。

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

