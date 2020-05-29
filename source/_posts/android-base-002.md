---
title: 入门篇 第二章 BroadcastReceiver
date: 2014-11-12 22:40:14
author: Cutler
categories: Android - 01 - 初级开发
---

# 第一节 基础知识 #
　　在现实世界中发生一个新闻后，广播电台会广播这个新闻给打开收音机的人，对这个新闻感兴趣的人会关注。
　　`Android`也提供了类似的机制，它将`系统开关机`、`时间变更`、`屏幕变暗`、`电池电量不足通知`、`抓图通知`等等事件封装成一个广播，当这些事件发生时它就会通知所有关注该事件的应用软件。

　　`Broadcast Receivers` （广播接收者）是应用程序中用来接收广播的一个组件。

<br>**广播接收者的特点：**

    -  广播接收者是静止的，它不会主动做任何事情，而总是等待着广播的到来。
       -  可以简单的理解：广播接收者是一个时刻等待冲锋的士兵，而广播就是一个信号，士兵接到信号后就可以做一些事情了。
    -  广播接收者可以接收来自用户自定义的广播和来自系统的广播。
    -  广播接收者并不是一个随便的人，它也会对外界传来的广播进行筛选，它所不需要的，它不会去接收。

　　若一个类继承了`BroadcastReceiver`那么它就是一个广播接收者。
　　我们使用一个`Intent`对象来代表`广播`，用户或系统发送广播时，发送的就是`Intent`对象，与广播相关的数据都被保存在`Intent`对象中了。

<br>　　范例1：简单的广播接收者。
``` java
public class MyBroadcastReceiver extends BroadcastReceiver {

    /**
     * BroadcastReceiver唯一一个需要子类重写的方法，当接到外界的广播时系统会调用此方法。
     * @param context: 上下文对象。 
     * @param intent: 广播相关的数据都保存在这个Intent对象中。
     */
    public void onReceive(Context context, Intent intent) {
        // 在屏幕上弹出一个消息，关于Toast的具体用法后面章节会有介绍。
        Toast.makeText(context, "Hi Tom", Toast.LENGTH_SHORT).show();
    }
}
```
    语句解释：
    -  当一个广播产生时，系统会拿广播依次和所有已经注册到系统中的广播接收者匹配。
    -  当某个广播接收者匹配成功后，系统都会创建该广播接收者的实例，然后调用该实例的onReceive方法，同时将广播Intent传入给onReceive方法。
    -  当onReceive方法执行完毕后，广播接收者的实例会被销毁。
    -  onReceive方法由主线程调用，因此在此方法中不要做一些耗时超过10秒的操作，否则系统将提示ANR(Application Not Responding)。
    -  使用onReceive方法中的context参数不能弹出一个Dialog，但是可以Toast。 

<br>　　做为`Android`中的四大组件之一，广播接收者同样需要在清单文件中进行声明。

<br>　　范例2：配置接收者。
``` xml
<receiver android:name="com.example.androidtest.MyBroadcastReceiver">
    <intent-filter>
        <action android:name="aaa.abc" />
    </intent-filter>
</receiver>
```
    语句解释：
    -  在<application>标签内部使用<receiver>标签来声明一个广播接收者。
    -  属性android:name：指明当前BroadcastReceiver所对应的类。
    -  当广播产生后，系统会依次拿广播Intent和所有的广播接收者的intent-filter进行匹配，若匹配成功，则将广播交给该广播接收者。一个广播可以同时被多个广播接收者接收。

<br>　　范例3：发送广播。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent();
        intent.setAction("aaa.abc");
        // Activity类是Context类的子类，调用Context的sendBroadcast()方法，发送一个无序广播。
        // 此时变量intent代表一个广播，广播的主要职责就是与广播接收者的意图过滤器(IntentFilter)进行匹配。
        this.sendBroadcast(intent);
    }
}
```
    语句解释：
    -  当MainActivity被启动后就可以在屏幕上看到一个Toast消息“Hi Tom”。

## 无序广播和有序广播 ##
　　广播分为：无序广播(`Normal broadcasts`)和有序广播(`Ordered broadcasts`)。

　　**无序广播：**
　　广播的发送者会将广播同时发送给所有符合条件的广播接收者。

　　**有序广播：**
　　与无序广播不同的是，广播最初会被发送给符合条件的、优先级最高的接收者，然后广播会从优先级最高的接收者手中开始，在所有符合条件组成的接收者集合中，按照优先级的高低，被依次传递下去。若多个接收者具有相同的优先级，则广播会被先传递给Android系统最先找到的那个接收者。

　　有序广播和无序广播最明显的区别在于发送它们时所调用的方法不同：

    -  无序广播：sendBroadcast(intent)
    -  有序广播：sendOrderedBroadcast(intent, receiverPermission)
　　除此之外，无序广播相对有序广播消息传递的效率比较高，但各个接收者无法终止和修改广播。而有序广播的某个接收者在中途可以终止、修改广播。

<br>　　范例1：广播接收者的优先级。
``` xml
<receiver android:name="com.example.androidtest.MyBroadcastReceiver2" >
    <intent-filter android:priority="1000" >
        <action android:name="aaa.abc" />
    </intent-filter>
</receiver>
```
    语句解释：
    -  用同样的方法再创建一个MyBroadcastReceiver2，并在配置它的时候使用android:priority属性指定它的优先级。
    -  优先级的取值范围是 -1000 ~ 1000 ，最高优先级为1000。

<br>　　范例2：发送广播。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent();
        intent.setAction("aaa.abc");
        // 发送有序广播
        this.sendOrderedBroadcast(intent, null);
    }
}
```
    语句解释：
    -  程序运行时MyBroadcastReceiver2会先接到广播，然后MyBroadcastReceiver才会接到。
    -  如果MyBroadcastReceiver2在接到广播后把广播给拦截了（让广播不再往下继续传递），那么MyBroadcastReceiver将无法接到广播。

<br>　　范例3：自定义权限。
``` xml
<permission android:name="cxy.mypermisson"/>
```
    语句解释：
    -  在<manifest>标签内部以及<application>标签的外部，使用<permission>标签可以自定义一个权限。
    -  属性android:name：指出权限的名称。权限的名称最少要是二级的。若权限的名称仅为：cxy 则是错误的。必须是二级以上：cxy.mypermisson。
    -  定义完权限后，在其他应用程序中就可以通过<uses-permission>标签直接使用这个权限。

<br>　　范例4：发送广播。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent();
        intent.setAction("abc");
        // 发送有序广播，只有申请了cxy.mypermisson权限的应用程序里所定义的广播接收者才能接到这个广播。
        this.sendOrderedBroadcast(intent, "cxy.mypermisson");
    }
}
```
    语句解释：
    -  此时只有在申请了cxy.mypermisson权限的应用程序中定义的BroadcastReceiver才可以接收到广播。 
    -  当程序运行时上面定义的两个广播接收者都接不到广播，若想让它们接到广播，则需要在<manifest>标签内部以及<application>标签的外部使用<uses-permission android:name="cxy.mypermisson" />申请权限，即便这个权限是它自己定义的，也需要申请。
    -  提示：一般情况下，当系统发送广播时，若广播接收者所在的应用程序并没有运行，则系统会自动将其运行。以保证广播能被顺利接收。

<br>　　范例5：终止广播。
``` java
public class MyBroadcastReceiver2 extends BroadcastReceiver{
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context, "Hi Tom2", Toast.LENGTH_SHORT).show();
        // 在某个广播接收者中调用此方法可以终止广播继续向下传递。
        // 如果广播被前面的接收者终止，后面的接收者就再也无法获取到广播。
        // 此方法仅对通过sendOrderedBroadcast方法发送的有序广播有效。
        abortBroadcast();
    }
}
```
    语句解释：
    -  由于MyBroadcastReceiver2的优先级比MyBroadcastReceiver大，所以后者将不会再接到广播。


<br>　　范例6：哥不是你可以终止的。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent();
        intent.setAction("abc");
        /*
         * 发送一个有序广播，同时指定一个广播接收者的对象，这个对象一定会接到广播，即便广播在中途被其他接收者终止了。
         * 第三个参数：必须接收当前广播的接收者。若不需要此设置，可以传递null。
         * 第四个参数：此参数为null，则接收者将在Context所在的主线程被调用。
         * 第五个参数：用于标识结果数据的结果码。通常为：Activity.RESULT_OK。
         * 第六个参数：传递给各个广播接收的一个String类型的数据。
         * 第七个参数：若String类型的数据，不能满足使用，则可以使用此参数，将其他数据附加到广播中。
         */
        sendOrderedBroadcast(intent,"cxy.mypermisson",
                new MyBroadcastReceiver(), null, Activity.RESULT_OK, null, null); 
    }
}
```
    语句解释：
    -  这种确保某个广播接收者一定能够接到广播的方式仅适用于你自己的广播接受者，因为我们是无法实例化其他应用程序的接收者的。
    -  如果广播在传播的过程中未被任何接收者终止，则最终MyBroadcastReceiver将会接收到2次广播，一次是正常传递来的调用，另一次则是为了确保一定接到广播导致的调用。


<br>　　范例7：发送数据。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent();
        intent.putExtra("string", "from intent");
        intent.setAction("abc");
        Bundle data = new Bundle();
        data.putString("string", "from bundle");
        sendOrderedBroadcast(intent,"cxy.mypermisson",
                new MyBroadcastReceiver(), null, Activity.RESULT_OK, "Hello World", data); 
    }
}
```
    语句解释：
    -  发送任何广播时都可以往Intent中设置附加数据，以供接收者使用。 
    -  发送有序广播时除了可以往Intent对象中设置数据外，还可以将数据放在一个Bundle对象中，然后通过sendOrderedBroadcast方法发送数据。

<br>　　范例8：接收数据。
``` java
public class MyBroadcastReceiver extends BroadcastReceiver {

    public void onReceive(Context context, Intent intent) {
        // 接收sendOrderedBroadcast()方法第六个参数的值。
        System.out.println(getResultData());
        // 接收intent对象设置的值，即范例7设置的：“from intent”。
        System.out.println(intent.getStringExtra("string"));
        // 接收sendOrderedBroadcast()方法第七个参数里的值，即范例7设置的：“from bundle”。
        System.out.println(getResultExtras(true).getString("string"));
    }
}
```
    语句解释：
    -  发送广播的时候，虽然我们可以确保某个接收者一定会接到广播，但是无法保证它接到的数据是最初的。 
    -  getResultExtras()方法的boolean类型参数用来设置当没有找到Bundle对象时，是否返回一个空的Bundle对象。 若置为false则当未设置Bundle对象时，此方法将返回null。


<br>　　范例9：妈的，还有谁?
``` java
public class MyBroadcastReceiver2 extends BroadcastReceiver{
    public void onReceive(Context context, Intent intent) {
        setResultData("from receiver 2");
        intent.putExtra("string", "from receiver 2");
        getResultExtras(true).putString("string", "from receiver 2");
        abortBroadcast();
    }
}
```
    语句解释：
    -  经过测试发现，修改intent中的值是无效的，之后的接收者接到的仍然是最初设置的值。
    -  但是调用setResultData()修改值和修改getResultExtras()方法获取的Bundle对象的值却是可以影响到后面的接收者的。

<br>　　范例10：广播的发送者，你也得证明你是个好人。
``` xml
<receiver 
    android:name="com.example.androidtest.MyBroadcastReceiver2"
    android:permission="org.cxy.permission.TEST">
    <intent-filter android:priority="888">
        <action android:name="myAction" />
    </intent-filter>
</receiver>
```
    语句解释：
    -  在声明BroadcastReceiver时，可以在<receiver>标签中指定android:permission属性。此属性表明，当前广播接收者仅接收，来自于拥有org.cxy.permission.TEST权限的应用程序中发出的广播。

## 动态注册 ##
　　事实上，注册广播的方法有两种，一种是静态注册，一种是动态注册：

    -  静态注册：通过在AndroidManifest.xml文件中添加<receiver>元素来将广播接收者注册到Android系统中。
    -  动态注册：在程序运行的时候，先创建一个你的BroadcastReceiver的对象，然后通过调用ContextWrapper类的registerReceiver方法将该对象注册到Android系统中。
<br>　　在Android的广播机制中，动态注册的优先级是要高于静态注册优先级的，而且有的广播只接收动态注册广播接收者，因此我们需要学习如果动态注册广播接收器。

<br>　　范例1：动态注册广播接收者。
``` java
public class MainActivity extends Activity {
    private static final String ACTION = "cn.etzmico.broadcastreceiverregister.SENDBROADCAST"; 
    private BroadcastReceiver myReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            Toast.makeText(context, "myReceiver receive", Toast.LENGTH_SHORT).show();
        }
    };
    
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        IntentFilter filter = new IntentFilter();  
        filter.addAction(ACTION);
        registerReceiver(myReceiver, filter);  
    }

    protected void onDestroy() {
        super.onDestroy();
        // 在Activity退出时解除注册。
        unregisterReceiver(myReceiver);
    }
}
```
　　动态注册广播接收器有一个特点，就是必须要程序运行的时候才可以注册，因此如果程序未运行就接不到广播了。

<br>**本节参考阅读：**
- [【Android】动态注册广播接收器 - CSDN博主 伊茨米可](http://blog.csdn.net/etzmico/article/details/7317528)

## 本地广播 ##

<br>　　在 Google 的[ 开发指南 ](https://developer.android.com/guide/components/broadcasts.html)中清楚的描述了，广播接受者是用于接受来自系统的消息，例如：系统启动、开始充电、应用安装等，但实际上，它被大量的误用于应用内部通信，这就违背了它最初的设计用途及理念。

　　直接使用 BroadcastReceiver 进行应用内部通信有如下的问题：

    -  广播接受者默认情况下是可以被任何第三方App唤醒的，数据的安全性不高。虽然可以通过设置权限等方式来禁止别人这么做。
    -  广播接收者的运行机制需要进程间通信的，内部通信通常很频繁且不需要跨进程。

　　基于这个现实的问题，Google 推出了一个新的API，叫做`LocalBroadcastManager`，专门用来实现应用内部通信。

<br>　　范例1：基础用法。
``` java
public class MainActivity extends AppCompatActivity {

    public static final String ACTION = "com.cutler.demo";
    private MyBroadcastReceiver mBroadcastReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 像往常一样创建广播接受者对象
        mBroadcastReceiver = new MyBroadcastReceiver();
        // 将这个对象动态注册到LocalBroadcastManager中
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ACTION);
        LocalBroadcastManager.getInstance(this).registerReceiver(mBroadcastReceiver, intentFilter);
    }

    /**
     * 界面中有个按钮，按钮被点击的时候会调用方法，发送一个广播
     */
    public void onClick(View view) {
        Intent intent = new Intent();
        intent.setAction(ACTION);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 界面关闭的时候，解除注册
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mBroadcastReceiver);
    }

    class MyBroadcastReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Toast.makeText(context, "收到", Toast.LENGTH_SHORT).show();
        }
    }
}
```
    语句解释：
    -  LocalBroadcastManager内部没有什么高深的技术，一共就300多行代码，它其实就是观察者模式的实现。
    -  它的应用场景和观察者模式一样，如果您不了解观察者模式，后续博文中会有介绍。
    -  事实上Github上有一个名为EventBus的开源库，此类能实现的功能它都能实现，且更棒，所以此类并不常用，了解即可。


<br>　　Google官方对这个类了的介绍原文如下：

    LocalBroadcastManager is an application-wide event bus and embraces layer violations in your app: any component may listen events from any other.
    You can replace usage of LocalBroadcastManager with other implementation of observable pattern, depending on your usecase suitable options may be LiveData or reactive streams.

<br>**本节参考阅读：**
- [为什么应该使用本地广播](http://effmx.com/articles/wei-shi-yao-ying-gai-shi-yong-ben-di-yan-bo-localbroadcastmanager/)
- [Android本地广播和全局广播的区别及实现原理](https://blog.csdn.net/u010126792/article/details/82417190)

## 监听系统广播 ##

<br>　　范例1：以开机广播为例，我们需要监听`BOOT_COMPLETED`动作：
``` xml
<receiver android:name="com.example.androidtest.BootReceiver" >
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```
　　接收开机启动广播所需的权限：
``` xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```


<br>　　范例2：时间改变广播：
``` java
public class MainActivity extends AppCompatActivity {

    private IntentFilter intentFilter;

    private TimeChangeReceiver timeChangeReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        intentFilter = new IntentFilter();
        //每分钟变化
        intentFilter.addAction(Intent.ACTION_TIME_TICK);
        //设置了系统时区
        intentFilter.addAction(Intent.ACTION_TIMEZONE_CHANGED);
        //设置了系统时间
        intentFilter.addAction(Intent.ACTION_TIME_CHANGED);
        timeChangeReceiver = new TimeChangeReceiver();
        registerReceiver(timeChangeReceiver, intentFilter);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(timeChangeReceiver);
    }

    class TimeChangeReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            switch (intent.getAction()) {
                case Intent.ACTION_TIME_TICK:
                    //每过一分钟 触发
                    System.out.println("____ 1 min passed");
                    break;
                case Intent.ACTION_TIME_CHANGED:
                    //设置了系统时间
                    System.out.println("____ system time changed");
                    break;
                case Intent.ACTION_TIMEZONE_CHANGED:
                    //设置了系统时区的action
                    System.out.println("____ system time zone changed");
                    break;
                default:
                    break;
            }
        }
    }
}
```
    语句解释：
    -  其中ACTION_TIME_TICK事件要求必须动态注册，另外两种事件可以静态注册。

　　静态注册时，设置如下action即可：
``` xml
  <intent-filter>
    <!-- 设置时间、时区时触发 -->
    <action android:name="android.intent.action.TIME_SET"></action>
    <action android:name="android.intent.action.TIMEZONE_CHANGED"></action>
   </intent-filter>
```

<br>　　范例3：开屏、关屏、解锁广播：
``` java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        IntentFilter filter = new IntentFilter();
        // 开屏
        filter.addAction(Intent.ACTION_SCREEN_ON);
        // 关屏
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        // 解锁屏幕，若用户没有设置任何方式的解锁，则会紧随开屏广播之后发出
        filter.addAction(Intent.ACTION_USER_PRESENT);
        receiver = new MyReceiver();
        registerReceiver(receiver, filter);
    }
}
```
    语句解释：
    -  其中开屏和关屏广播要求必须动态注册，ACTION_USER_PRESENT事件在Android O (8.0 api 26)以上则只能动态注册。
    -  为了让动态注册的广播接收者有更长的生命周期，可以在Application里注册它。

　　静态注册时，设置如下action即可：
``` xml
<intent-filter>
    <action android:name="android.intent.action.USER_PRESENT" />
</intent-filter>
```


<br>　　范例4：网络状态改变广播：
``` java
// WIFI总开关的打开和关闭事件
filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);

// 监听WIFI的连接状态即是否连上了一个有效无线路由
filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);

// 监听网络连接的设置，包括WIFI和移动数据的打开和关闭
filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
```
    语句解释：
    -  其中CONNECTIVITY_ACTION在Android7.0(api 24)以后必须动态注册，另外两个则在8.0以后才需要。
    -  另外需要注意的是，CONNECTIVITY_ACTION的最大弊端是比另外两个广播的反应要慢。
    -  如果仅仅是接收系统的广播（比如用来做进程保活），是可以不用申请权限的。

　　静态注册时，设置如下action即可：
``` xml
<intent-filter>
    <action android:name="android.net.wifi.WIFI_STATE_CHANGED" />
    <action android:name="android.net.wifi.STATE_CHANGE" />
    <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
</intent-filter>
```


<br>　　范例5：安装、更新、卸载广播：
``` java
// 一个新应用已经安装在设备上（监听所在的app安装时，接不到此广播。）
filter.addAction(Intent.ACTION_PACKAGE_ADDED);

// 一个新版本的应用覆盖安装到设备上。会先收到remove的再收到replace的，监听所在的app的更新也能收到。
// 所谓的更新就是versionCode或者versionName发生了变化
filter.addAction(Intent.ACTION_PACKAGE_REPLACED);

// 一个已存在的app已经从设备上卸载（卸载监听所在的app，监听不到自己的卸载）
filter.addAction(Intent.ACTION_PACKAGE_REMOVED);
```
    语句解释：
    -  这三个事件在Android O (8.0 api 26)以上则只能动态注册，8.0以下则可以静态注册。

　　静态注册时，设置如下action即可：
``` xml
<intent-filter>
    <action android:name="android.intent.action.PACKAGE_ADDED" />
    <action android:name="android.intent.action.PACKAGE_REPLACED" />
    <action android:name="android.intent.action.PACKAGE_REMOVED" />
    <data android:scheme="package" />
</intent-filter>
```

<br>　　范例6：充电状态广播：
``` java
// 每当设备连接或断开电源时，BatteryManager就会发送下面两个广播
filter.addAction(Intent.ACTION_POWER_CONNECTED);
filter.addAction(Intent.ACTION_POWER_DISCONNECTED);

// 电量发生改变时会发出此广播，此事件只能动态注册
filter.addAction(Intent.ACTION_BATTERY_CHANGED);

// 每当设备电池电量不足或退出不足状态时，便会触发下面两个广播
filter.addAction(Intent.ACTION_BATTERY_OKAY);
filter.addAction(Intent.ACTION_BATTERY_LOW);
```
    语句解释：
    -  前两个事件在Android O (8.0 api 26)以上则只能动态注册，8.0以下则可以静态注册。
    -  需要注意的是，ACTION_BATTERY_CHANGED只能动态注册。
    -  后两个广播不太好重现，估计和其它广播类似，8.0以后会受限制。

　　静态注册时，设置如下action即可：
``` xml
<intent-filter>
    <action android:name="android.intent.action.ACTION_POWER_CONNECTED"/>
    <action android:name="android.intent.action.ACTION_POWER_DISCONNECTED"/>
    <action android:name="android.intent.action.ACTION_BATTERY_LOW"/>
    <action android:name="android.intent.action.ACTION_BATTERY_OKAY"/>
</intent-filter>
```

# 第二节 各版本变化 #

　　本节将列出广播在各个Android版本中的表现。

## Android 3.1 ##
<br>　　从`Android 3.1`开始的Android加入了一种保护机制，这个机制导致程序接收不到系统广播。

　　系统为Intent添加了两个flag，`FLAG_INCLUDE_STOPPED_PACKAGES`和`FLAG_EXCLUDE_STOPPED_PACKAGES`，用来控制Intent是否要对处于`stopped`状态的App起作用，如果一个App`安装后未启动过`或者`被用户在管理应用中手动停止`（强行停止）的话，那么该App就处于`stopped`状态了。

　　顾名思义：

    -  FLAG_INCLUDE_STOPPED_PACKAGES：表示包含stopped的App
    -  FLAG_EXCLUDE_STOPPED_PACKAGES：表示不包含stopped的App

　　从`Android 3.1`开始，系统会在所有广播上添加了一个flag（`FLAG_EXCLUDE_STOPPED_PACKAGES`），这样的结果就是一个处于`stopped`状态的App就不能接收系统的广播，这样就可以防止病毒木马之类的恶意程序。

　　正常情况下，如果你的App没有处于`stopped`状态，那么当用户重启手机的时候，你的App就可以接收到开机启动广播了。
　　但事实并非这么简单，国内的各大手机厂商对开机启动的权限，除了上面的限制外，还有自己的策略。

    -  比如小米自己维护了一个白名单，默认情况下只有白名单内的App才可以被设置为开机启动（即便你的应用程序没有处于stopped状态也不会接收到开机启动广播）。这个白名单中通常包含一些使用比较广泛的App，比如微信、QQ等。当然事情还是有转机的，小米针对每一个App都提供了一个设置，如果用户在小米手机中手动设置允许你的程序开机启动的话，那么你的App就可以接到开机广播了。


## Android 7.0 ##

　　如果应用程序注册接收广播，则应用程序的接收器每次发送广播时都会消耗资源。如果有太多应用程序注册接收基于系统事件的广播，则会导致问题；触发广播的系统事件可能导致所有这些应用快速连续消耗资源，从而影响用户体验。
　　为了缓解此问题Android 7.0（API级别24）应用以下限制：

    -  从7.0开始应用在清单文件中静态注册的 CONNECTIVITY_ACTION 的广播接收器，不再会接到广播，但动态注册仍然可以。
    -  应用无法发送，接收 ACTION_NEW_PICTURE 或 ACTION_NEW_VIDEO 广播。此优化会影响所有应用，而不仅仅是针对API级别24的应用。

　　Android框架提供了多种解决方案来减轻对这些隐式广播的需求。例如`JobScheduler`或者`WorkManager`。


## Android 8.0 ##

　　为了进一步缓解资源消耗的问题，Android 8.0（API级别26）中实行了更加严格的限制：

    -  除了有限的例外之外，应用无法使用清单注册（静态注册）的方式来接收大部分的隐式广播。
　　但是：
    -  这些隐式广播，依然可以通过运行时注册（动态注册）的方式注册。
    -  对于显式广播，则依然可以通过清单注册（静态注册）的方式监听。

　　在Android8.0上，除了以下隐式广播外，其他所有隐式广播均无法通过在`AndroidManifest.xml`中注册监听：
``` java
/**
开机广播
 Intent.ACTION_LOCKED_BOOT_COMPLETED
 Intent.ACTION_BOOT_COMPLETED
*/
"保留原因：这些广播只在首次启动时发送一次，并且许多应用都需要接收此广播以便进行作业、闹铃等事项的安排。"

/**
增删用户
Intent.ACTION_USER_INITIALIZE
"android.intent.action.USER_ADDED"
"android.intent.action.USER_REMOVED"
*/
"保留原因：这些广播只有拥有特定系统权限的app才能监听，因此大多数正常应用都无法接收它们。"
    
/**
时区、ALARM变化
"android.intent.action.TIME_SET"
Intent.ACTION_TIMEZONE_CHANGED
AlarmManager.ACTION_NEXT_ALARM_CLOCK_CHANGED
*/
"保留原因：时钟应用可能需要接收这些广播，以便在时间或时区变化时更新闹铃"

/**
语言区域变化
Intent.ACTION_LOCALE_CHANGED
*/
"保留原因：只在语言区域发生变化时发送，并不频繁。 应用可能需要在语言区域发生变化时更新其数据。"

/**
Usb相关
UsbManager.ACTION_USB_ACCESSORY_ATTACHED
UsbManager.ACTION_USB_ACCESSORY_DETACHED
UsbManager.ACTION_USB_DEVICE_ATTACHED
UsbManager.ACTION_USB_DEVICE_DETACHED
*/
"保留原因：如果应用需要了解这些 USB 相关事件的信息，目前尚未找到能够替代注册广播的可行方案"

/**
蓝牙状态相关
BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED
BluetoothA2dp.ACTION_CONNECTION_STATE_CHANGED
BluetoothDevice.ACTION_ACL_CONNECTED
BluetoothDevice.ACTION_ACL_DISCONNECTED
*/
"保留原因：应用接收这些蓝牙事件的广播时不太可能会影响用户体验"

/**
Telephony相关
CarrierConfigManager.ACTION_CARRIER_CONFIG_CHANGED
TelephonyIntents.ACTION_*_SUBSCRIPTION_CHANGED
TelephonyIntents.SECRET_CODE_ACTION
TelephonyManager.ACTION_PHONE_STATE_CHANGED
TelecomManager.ACTION_PHONE_ACCOUNT_REGISTERED
TelecomManager.ACTION_PHONE_ACCOUNT_UNREGISTERED
*/
"保留原因：设备制造商 (OEM) 电话应用可能需要接收这些广播"

/**
账号相关
AccountManager.LOGIN_ACCOUNTS_CHANGED_ACTION
*/
"保留原因：一些应用需要了解登录帐号的变化，以便为新帐号和变化的帐号设置计划操作"

/**
应用数据清除
Intent.ACTION_PACKAGE_DATA_CLEARED
*/
"保留原因：只在用户显式地从 Settings 清除其数据时发送，因此广播接收器不太可能严重影响用户体验"
    
/**
软件包被移除
Intent.ACTION_PACKAGE_FULLY_REMOVED
*/
"保留原因：一些应用可能需要在另一软件包被移除时更新其存储的数据；对于这些应用，尚未找到能够替代注册此广播的可行方案"

/**
外拨电话
Intent.ACTION_NEW_OUTGOING_CALL
*/
"保留原因：执行操作来响应用户打电话行为的应用需要接收此广播"
    
/**
当设备所有者被设置、改变或清除时发出
DevicePolicyManager.ACTION_DEVICE_OWNER_CHANGED
*/
"保留原因：此广播发送得不是很频繁；一些应用需要接收它，以便知晓设备的安全状态发生了变化"
    
/**
日历相关
CalendarContract.ACTION_EVENT_REMINDER
*/
"保留原因：由日历provider发送，用于向日历应用发布事件提醒。因为日历provider不清楚日历应用是什么，所以此广播必须是隐式广播。"
    
/**
安装或移除存储相关广播
Intent.ACTION_MEDIA_MOUNTED
Intent.ACTION_MEDIA_CHECKING
Intent.ACTION_MEDIA_EJECT
Intent.ACTION_MEDIA_UNMOUNTED
Intent.ACTION_MEDIA_UNMOUNTABLE
Intent.ACTION_MEDIA_REMOVED
Intent.ACTION_MEDIA_BAD_REMOVAL
*/
"保留原因：这些广播是作为用户与设备进行物理交互的结果：安装或移除存储卷或当启动初始化时（当可用卷被装载）的一部分发送的，因此它们不是很常见，并且通常是在用户的掌控下"

/**
短信、WAP PUSH相关
Telephony.Sms.Intents.SMS_RECEIVED_ACTION
Telephony.Sms.Intents.WAP_PUSH_RECEIVED_ACTION

注意：需要申请以下权限才可以接收
"android.permission.RECEIVE_SMS"
"android.permission.RECEIVE_WAP_PUSH"
*/
"保留原因：SMS短信应用需要接收这些广播"

```

　　默认情况下，这个更改仅会影响`targetSDK >= 26`的应用。但是，用户可以从“设置”界面为任何应用启用这些限制，即使应用的目标是低于26的API级别。


<br>**本节参考阅读：**
- [咦，Oreo怎么收不到广播了？](https://juejin.im/post/5aefd27f6fb9a07ab45889cc)
- [后台执行限制](https://developer.android.com/about/versions/oreo/background#broadcasts)
- [Android 3.1 APIs](http://developer.android.com/about/versions/android-3.1.html)

<br><br>