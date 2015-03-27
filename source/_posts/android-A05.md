title: 入门篇　第五章 BroadcastReceiver
date: 2014-11-29 14:28:35
create: 2014-11-29 14:28:35
categories: Android
---
　　在现实世界中发生一个新闻后，广播电台会广播这个新闻给打开收音机的人，对这个新闻感兴趣的人会关注，可能会拿笔记下。 Android 也提供了类似的机制，它将`系统开关机`、`时间变更`、`屏幕变暗`、`电池电量不足通知`、`抓图通知` 、 `手机接到外界的电话` 、`短信` 等等事件封装成一个广播，当这些事件发生时它就会通知所有关注该事件的应用软件。

　　`Broadcast Receivers` （广播接收者）是应用程序中用来接收广播的一个组件。
　　事实上广播既可以是系统发出的，也可以是当前或者其他应用程序(`委托系统`)发出的。一个应用程序内部可以定义多个广播接收者。当系统中有广播产生时，每个应用程序内定义的广播接收者都会查看该广播是否是其所需要的，若是，则广播接收者将会接收该广播。

<br>**广播接收者的特点：**

	-  广播接收者是静止的，它不会主动做任何事情，而总是等待着广播的到来。
	-  广播接收者可以接收来自用户自定义的广播和来自系统的广播。
	-  可以简单的理解：广播接收者是一个时刻等待冲锋的士兵，而广播就是一个信号。士兵接到信号后就可以做一些事情了。
	-  事实上，广播接收者并不是一个随便的人，它也会对外界传来的广播进行筛选，他所不喜欢的，他不会去接收。

# 第一节 基础知识 #
　　在Android中一个类若继承了`BroadcastReceiver`那么它就是一个广播接收者。
　　在Android中使用一个Intent对象来代表`广播`，用户或系统发送广播时，发送的就是Intent对象，与广播相关的数据都被保存在Intent对象中了。

<br>　　范例1：简单的广播接收者。
``` android
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
    -  当一个广播产生时，系统会拿广播Intent依次和所有已经注册到系统中的广播接收者匹配。
    -  当某个广播接收者匹配成功后，系统都会创建该广播接收者的实例，然后调用该实例的onReceive方法，同时将广播Intent传入给onReceive方法。
    -  当onReceive方法执行完毕后，广播接收者的实例会被销毁。
    -  广播接收者的onReceive方法由主线程调用，因此在此方法中不要做一些耗时超过10秒的操作，否则系统将提示ANR(Application Not Responding)。
    -  使用onReceive方法中的context参数不能弹出一个Dialog，但是可以Toast。 

　　做为Android中的四大组件之一，广播接收者同样需要在清单文件中进行声明。

<br>　　范例2：AndroidManifest.xml。
``` android
<receiver android:name="com.example.androidtest.MyBroadcastReceiver">
    <intent-filter>
        <action android:name="abc" />
    </intent-filter>
</receiver>
```
    语句解释：
    -  在<application>标签内部使用<receiver>标签来声明一个广播接收者。
	-  属性android:name：指明当前BroadcastReceiver所对应的类。
	-  当广播产生后，系统会依次拿广播Intent和所有的广播接收者的intent-filter进行匹配，若匹配成功，则将广播交给该广播接收者。一个广播可以同时被多个广播接收者接收。

<br>　　范例3：发送广播。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        Intent intent = new Intent();
        intent.setAction("abc");
        // Activity类是Context类的子类，调用Context的sendBroadcast()方法，发送一个无序广播。
        // 此时变量intent代表一个广播，广播的主要职责就是与广播接收者的意图过滤器(IntentFilter)进行匹配。
        this.sendBroadcast(intent);
    }
}
```
    语句解释：
    -  当MainActivity被启动后就可以在屏幕上看到一个Toast消息“Hi Tom”。

# 第二节 无序广播和有序广播 #
　　广播分为：无序广播(Normal broadcasts)和有序广播(Ordered broadcasts)。

　　**无序广播：**
　　广播的发送者会将广播同时发送给所有符合条件的广播接收者。

　　**有序广播：**
　　广播的发送者会按照广播接收者的优先级将广播发送给所有符合条件的广播接收者，广播最初会被发送给符合条件的、优先级最高的接收者，然后广播会从优先级最高的接收者手中开始，在所有符合条件组成的接收者集合中，按照优先级的高低，被依次传递下去。若多个接收者具有相同的优先级，则广播会被先传递给Android系统最先找到的那个接收者。

　　有序广播和无序广播最明显的区别在于发送它们时所调用的方法不同：

	-  无序广播：sendBroadcast(intent)
	-  有序广播：sendOrderedBroadcast (intent, receiverPermission)
　　除此之外，无序广播相对有序广播消息传递的效率比较高，但各个接收者无法终止和修改广播。而有序广播的某个接收者在中途可以终止、修改广播。

<br>　　范例1：广播接收者的优先级。
``` android
<receiver android:name="com.example.androidtest.MyBroadcastReceiver2" >
    <intent-filter android:priority="1000" >
        <action android:name="abc" />
    </intent-filter>
</receiver>
```
    语句解释：
    -  用同样的方法再创建一个MyBroadcastReceiver2，并在配置它的时候使用android:priority属性指定它的优先级。
    -  优先级的取值范围是 -1000 ~ 1000 ，最高优先级为1000。

<br>　　范例2：发送广播。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        Intent intent = new Intent();
        intent.setAction("abc");
        // 发送有序广播
        this.sendOrderedBroadcast(intent, null);
    }
}
```
    语句解释：
    -  程序运行时MyBroadcastReceiver2会先接到广播，然后MyBroadcastReceiver才会接到。
    -  如果MyBroadcastReceiver2在接到广播后把广播给拦截了（让广播不再往下继续传递），那么MyBroadcastReceiver将无法接到广播。

<br>　　范例3：自定义权限。
``` android
<permission android:name="cxy.mypermisson"/>
```
    语句解释：
    -  在<manifest>标签内部以及<application>标签的外部，使用<permission>标签可以自定义一个权限。
	-  属性android:name：指出权限的名称。权限的名称最少要是二级的。若权限的名称仅为：cxy 则是错误的。必须是二级以上：cxy.mypermisson。
	-  定义完权限后，在其他应用程序中就可以通过<uses-permission>标签直接使用这个权限。

<br>　　范例4：发送广播。
``` android
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
	-  提示：当系统发送广播时，若广播接收者所在的应用程序并没有运行，则系统会自动将其运行。以保证广播能被顺利接收。

<br>　　范例5：终止广播。
``` android
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
``` android
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
``` android
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
    -  发送有序广播时除了可以往Intent对象中设置数据外，还可以将数据放在一个Bundle对象中，然后通过sendOrderedBroadcast方法发送数据。 毕竟亲兄弟都还明算账呢，何况Intent中除了存数据外还会存储action、flag等数据，比较混杂，所以为接收者创建一个专属的Bundle对象，只用来存数据是完全可以的。

<br>　　范例8：接收数据。
``` android
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
``` android
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
``` android
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

# 第三节 动态注册 #
　　从本质来说，Android系统的广播机制是一种消息`订阅/发布`机制，因此使用这种消息驱动模型的第一步便是订阅消息，而对Android应用程序来说，订阅消息其实就是注册广播接收器。
　　注册的方法有两种，一种是静态注册，一种是动态注册：

	-  静态注册：通过在AndroidManifest.xml文件中添加<receiver>元素来将广播接收者注册到Android系统中。
	-  动态注册：在程序运行的时候，先创建一个你的BroadcastReceiver的对象，然后通过调用ContextWrapper类的registerReceiver方法将该对象注册到Android系统中。
　　在Android的广播机制中，动态注册的优先级是要高于静态注册优先级的，而且有的广播只接收动态注册广播接收者，因此我们需要学习如果动态注册广播接收器。

<br>　　范例1：动态注册广播接收者。
``` android
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

# 第四节 应用范例 #
## 开机启动广播 ##
<br>**最简单的用法：**
　　开机广播需要监听BOOT_COMPLETED动作：
``` android
<receiver android:name="com.example.androidtest.BootReceiver" >
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```
　　接收开机启动广播所需的权限：
``` android
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

<br>**但现实并非如此简单：**
　　从Android 3.1开始的Android加入了一种保护机制，这个机制导致程序接收不到某些系统广播，其中就包含了开机启动广播。
　　系统为Intent添加了两个flag，`FLAG_INCLUDE_STOPPED_PACKAGES`和`FLAG_EXCLUDE_STOPPED_PACKAGES`，用来控制Intent是否要对处于`stopped`状态的App起作用，如果一个App`安装后未启动过`或者`被用户在管理应用中手动停止`（强行停止）的话，那么该App就处于`stopped`状态了。

　　顾名思义：

	-  FLAG_INCLUDE_STOPPED_PACKAGES：表示包含未启动的App
	-  FLAG_EXCLUDE_STOPPED_PACKAGES：表示不包含未启动的App

　　对于系统开机启动广播来说则是添加了一个flag（FLAG_EXCLUDE_STOPPED_PACKAGES），这样的结果就是一个处于`stopped`状态的App就不能接收系统开机的广播。这样就可以防止病毒木马之类的恶意程序。

　　如果你的App没有处于`stopped`状态（被启动过并且没有在系统设置界面被强行停止）那么当用户重启手机的时候，你的App就可以接收到开机启动广播了。

<br>**小米手机：**
　　小米自己维护了一个白名单，默认情况下只有白名单内的App才可以被设置为开机启动（即便你的应用程序没有处于stopped状态也不会接收到开机启动广播）。这个白名单中通常包含一些使用比较广泛的App，比如微信、QQ等。当然事情还是有转机的，小米针对每一个App都提供了一个设置，如果用户在小米手机中手动设置允许你的程序开机启动的话，那么你的App就可以接到开机广播了。

<br>**本节参考阅读：**
- [Android 3.1 APIs](http://developer.android.com/about/versions/android-3.1.html)
<br><br>