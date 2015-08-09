title: 入门篇　第六章 Intent 与 Intent Filters
date: 2014-12-1 21:39:45
categories: android
---
　　`Android`四大组件中有三个组件是通过叫做`Intent`的对象来激活的，因此接下来将介绍`Intent`对象。


# 第一节 Intent基本组成 #
　　一个`Intent`对象就是一个信息包，其中主要有`7`个重要的字段，它们分别用在不同的场合：

	mComponent、mAction、mData、mCategories、mExtras、mType、mFlags
<br>　　但是创建`Intent`对象时，不需要为这`7`个属性全都赋值，我们只是在不同的情况下，会用到其中的某几个属性而已。
　　下面简单的说一下各个组成部分，稍后会详细介绍如何使用它们。

<br>**组件名（Component）**
　　`Intent`类的`mComponent`字段是`ComponentName`类型的，它用来表示`Intent`所要启动的组件的名字。
　　`mComponent`字段是可选的：

	-  如果设置了mComponent字段，系统就会启动mComponent所对应的组件。
	-  如果没有设置，系统则会使用Intent对象中的其他信息来定位合适的目标。

<br>**动作（Action）**
　　`Intent`类的`mAction`字段是`String`类型的，它用来告诉系统本次请求要执行什么样的动作。
　　比如你现在想打电话，那么就可以把`Intent`的字段设置为`ACTION_CALL`，这样一来系统就会帮你启动`“打电话”`相关的界面。

　　`Intent`类定义很多动作常量，详见下表：
``` android
常量                         目标组件              描述
ACTION_CALL	             Activity             发起电话呼叫
ACTION_EDIT	             Activity             编辑数据
ACTION_MAIN	             Activity             作为一个任务的初始Activity启动，没有数据输入和返回输出。
ACTION_SYNC	             Activity	          用移动设备上的数据同步服务上的数据。
ACTION_BATTERY_LOW	     Broadcast Receiver	  低电量的一个警告
ACTION_HEADSET_PLUG	     Broadcast Receiver	  耳麦已经被插入设备，或者从设备上拔出。
ACTION_SCREEN_ON             Broadcast Receiver   显示屏已经被打开
ACTION_TIMEZONE_CHANED       Broadcast Receiver   时区相关的设置已经被改变
```

<br>**数据（Data）**
　　`Intent`类的`mData`字段段是`Uri`类的对象，它用来表示与`Action`相关的数据，显然不同的动作要跟不同的数据规范类型配合使用，比如：
	-  如果动作字段是ACTION_EDIT，那么它的数据字段（即URI）应该指向它所要编辑的数据。
	-  如果动作是ACTION_CALL，那么数据字段就应该是一个呼叫号码。在Android中会使用“tel:呼叫号码”来表示这个数据。
	-  如果动作是ACTION_VIEW，那么数据字段就应该指向一个可被查看的东西，比如网页、图片、视频等。

<br>**分类（Category）**
　　`Intent`类的`mCategories`字段是`HashSet<String>`类的对象。`Intent`类也定义几个分类常量，如下表：
``` android
常量                         描述
CATEGORY_BROWSABLE          目标Activity能够安全的调用浏览器来显示链接所指向的数据（如图片或电子邮件）。
CATEGORY_GADGET             Activity能够被嵌入到持有小部件的另一个Activity中。
CATEGORY_HOME               Activity显示在主屏幕上，开机时用户看到的第一个屏幕或Home按钮被按下时，用户看到的屏幕。
CATEGORY_LAUNCHER           Activity能够作为任务的初始Activity，并且被列在应用程序启动器的顶层。
```

<br>**附加信息（Extras）**
　　`Intent`类的`mExtras`字段是`Bundle`类的对象，你可以通过`mExtras`字段来将任意类型的数据传递给目标组件。

<br>**标记（Flags）**
　　`Intent`对象可以有各种标记，所有这些标记都在`Intent`类中定义，`Intent`对象的`mFlags`字段用于保存标记。

# 第二节 Intent对象解析 #
　　`Intent`被译为意图，在`Android`中意图分为：`显式意图`和`隐式意图`。
<br>　　**显式意图**
　　若在`Intent`对象被发送给操作系统之前，程序为`mComponent`属性赋值了，则此`Intent`对象被称为显式意图。显示意图明确的指定了其要启动的组件的所在包名、类名，`Android`系统接到`Intent`对象时，直接去对应的包中反射实例化并初始化目标组件。
<br>　　**隐式意图**
　　在程序中没有为`Intent`对象明确指出想要其启动组件。而是提供一些筛选条件，操作系统会从当前已在系统中注册的所有组件中，筛选出满足要求的组件(可能是一个也可能是多个)，然后予以启动。 

## 显式意图 ##
　　当操作系统接到`Intent`对象后，会检查`Intent`对象的`mComponent`是否有值：
	-  若有值：则直接启动mComponent所代表的组件。
	-  若无值：则按照隐式意图处理。
　　`ComponentName`类用于描述`Android`中的组件，且它只有两个属性：`包名`、`组件名`。

	-  包名：用来指出该组件所在的应用程序。
	-  组件名：找到应用程序后，再依据组件名，来在该程序中找对应的组件。


<br>　　范例1：通过`ComponentName`启动新`Activity`。
``` android
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ComponentName component = new ComponentName(this, SecondActivity.class);
        // 输出com.example.androidtest.SecondActivity
        System.out.println(component.getClassName()); 
        // 输出com.example.androidtest
        System.out.println(component.getPackageName()); 
        // 输出.SecondActivity
        System.out.println(component.getShortClassName()); 
        Intent intent = new Intent();
        // 往Intent中添加数据
        intent.putExtra("name", "tom");
        intent.setComponent(component);
        // 启动SecondActivity
        startActivity(intent);
    }
}
```
    语句解释：
    -  在Android中可以通过Intent对象的mExtras属性将一些参数传递到目标组件中去。
    -  也可以在构造Intent对象的同时，设置当前Intent对象从何处跳往何处：
       -  Intent intent = new Intent(MainActivity.this,MyActivity.class);

<br>　　范例2：接收参数。
``` android
public class SecondActivity extends Activity{

    protected void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        Intent intent = this.getIntent();
        System.out.println(intent.getStringExtra("name"));
    };
}
```
    语句解释：
    -  每个Activity都拥有一个启动自己的Intent对象，可以通过getIntent()方法获取。

## 隐式意图 ##
　　隐式意图：在程序中没有为`Intent`对象的`mComponent`属性明确指出想要其启动组件。
　　隐式意图仅仅是为`Intent`对象指出一些筛选条件，然后`Android`系统会取出`Intent`对象中的数据和所有已经注册到系统中的组件进行匹配。

	-  若匹配成功，则系统将激活该组件。
	-  若有多个组件匹配成功，则系统将弹出一个对话框，要求用户选择所要激活的组件。
	-  若没有任何组件匹配成功则抛异常。

　　应用程序中定义的`Android`组件都需要在`AndroidManifest.xml`文件中记录。当系统在进行意图匹配时，就会取出`Intent`对象中的筛选条件与所有已注册到系统中的各个组件的`<intent-filter>`标签下定义的数据进行匹配。
　　`Intent`过滤器会参考`Intent`对象以下三个方面来检测是否接收这个`Intent`对象：

	1、动作（mAction）
	2、数据（mData和mType）
	3、分类（mCategories）

<br>**Action**
　　`mAction`：描述一个动作。如：张三看书、李四唱歌中的`“看”`、`“唱”`就是指动作。在Android中内置的动作有很多，常见的有：

	-  Intent.ACTION_VIEW ：“查看”动作。
	-  Intent.ACTION_EDIT ：“编辑”动作。
	-  Intent.ACTION_DELETE ：“删除”动作。
	-  Intent.ACTION_MAIN ：标记当前Activity是程序的入口。
　　进行意图匹配时，只有在意图的`mAction`属性与`<intent-filter>`下的`<action>`标签的值匹配成功后，才会去匹配`mCategories`属性。 若意图过滤器中没有定义`mAction`属性，则当前组件将被直接忽略，系统不会再与之进行匹配。

<br>**Categories**
　　`mCategories`：描述在执行意图对象时关于`mAction`的一组附加信息。在Android中内置的类型有：

	-  Intent.CATEGORY_LAUNCHER ：在手机“应用菜单”中列出当前Activity。
　　只有在`Intent`全部的`mCategorie`属性与`<intent-filter>`下的所有`<category>`标签的值都匹配成功后，才会去匹配`<data>`标签。

<br>**Data和Type**
　　数据：以`URI`的形式描述`“动作”`所要操作的数据。准确的说数据包括两部分：`mData`和`mType`：

	-  数据的URI(mData)：如file:///tmp/android.txt 。
	-  数据的类型(mType)：即数据的MIME类型。如：text/html 。

### IntentFilter ###
　　`IntentFilter`用来通知操作系统当前组件能够处理哪种类型的隐式意图，三大组件能够有一个或多个`IntentFilter`。
　　`IntentFilter`有类似于`Intent`对象的`动作`、`数据`、和`分类`的字段，过滤器会用这三个字段来检测一个隐式的`Intent`对象。
　　如果组件的某个`IntentFilter`与`Intent`匹配失败了，Android系统会继续让`Intent`与该组件的下一个`IntentFilter`进行匹配（如果有的话）。

<br>**Action检测**
　　在清单文件中的`<intent-filter>`元素内列出对应动作的`<action>`子元素。如：
``` android
<intent-filter>
    <action android:name="com.example.project.SHOW_CURRENT" />
    <action android:name="com.example.project.SHOW_RECENT" />
    <action android:name="com.example.project.SHOW_PENDING" />
</intent-filter>
```
    语句解释：
    -  像本例显示的这样，一个过滤器可以列出多个Action。但这个列表不能是空的，一个过滤器必须包含至少一个<action>元素，否则它不会匹配任何Intent对象。
    -  要通过这个检测，在Intent对象中指定的Action必须跟这个过滤器的动作列表中的某个Action一致匹配。

<br>**Category检测**
　　`<intent-filter>`元素也要列出分类作为子元素。例如：
``` android
<intent-filter>
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
</intent-filter>
```
　　对于一个要通过`Category`检测的`Intent`对象，在`Intent`对象中每个分类都必须跟过滤器中的一个分类匹配。 过滤器能够列出额外的分类，但是它不能忽略`Intent`对象中的任何分类。因此，原则上一个没有`category`的`Intent`对象应该始终通过这个检测，而不管过滤器中声明的分类。

　　注意，`Android`处理所有传递给`startActivity()`方法的隐式`Intent`对象，都会至少包含了一个`android.intent.category.DEFAULT`。

<br>**Data检测**
　　像`Action`、`Category`检测一样，针对`IntentFilter`的“数据”也要包含在一个子元素中，这个子元素能够出现`0~n`次。例如：
``` android
<intent-filter>
    <data android:mimeType="video/mpeg" android:scheme="http" /> 
    <data android:mimeType="audio/mpeg" android:scheme="http" />
</intent-filter>
```
　　每个`<data>`元素能够指定`URI`和数据类型（`MIME`）对于每个`URI`部分都会有独立的属性：`scheme`、`host`、`port`、`path`。格式：
``` android
scheme://host:port/path
```
　　例如，以下URI：
``` android
content://com.example.project:200/folder/subfolder/etc
```

	-  scheme是content
	-  host  是com.example.project
	-  port  是200
	-  path  是folder/subfolder/etc。
　　其中`host`和`port`一起构成了`authority`，如果没有指定`host`，那么`port`也会被忽略。

　　`<data>`元素的`mimeType`属性指定了数据的`MIME`类型。对于子类型域，`Intent`对象和过滤器都能够使用`*`通配符。例如`text/*`或`audio/*`指明可以跟任意子类型匹配。

<br>**常见情况**
　　常见的配置是带有`scheme`和`type`的过滤器。例如，像下面这样的`<data>`元素会告诉Android，组件能够从网络上获取视频并显示它。
``` xml
<data android:scheme="http" android:type="video/*" />
```
　　例如，当用户点击一个网页上的一个链接时，浏览器应用程序首先会试着来显示数据（如果这个链接是一个`HTML`页就显示）。如果不能显示这个数据，那么就会把`scheme`和`type`一起放到一个隐式`Intent`对象中，并试着启动一个能够做这项工作的`Activity`，如果没有接受者，它就会要求下载管理器来下载数据。

### 使用Intent对象进行匹配 ###
<br>　　范例1：新建Activity。
``` android
<activity android:name="org.cxy.intent.SecondActivity">
    <intent-filter>
        <action android:name="second"/>
        <category android:name="android.intent.category.DEFAULT"/>
    </intent-filter>
</activity>
```
　　在MainActivity中书写如下跳转语句：
``` android
Intent intent =  new Intent();
intent.setAction("second"); 
this.startActivity(intent);
```
    语句解释：
	-  本范例并没有为Intent指定具体要跳转到哪个Activity，而是为Intent指定一个action。
	-  在调用startActivity方法启动Activity时，该方法会自动为Intent对象设置一个category，即：“android.intent.category.DEFAULT”。
	-  若指定的Intent对象与系统中多个Activity的意图过滤器匹配成功，则Android系统会弹出一个对话框，要求用户自己选择，要打开的Activity。
	-  若Intent对象中存在多个Category ，则要求<intent-filter>所有的Category都必须要匹配成功。

<br>　　范例2：安装应用程序。
``` android
Intent intent = new Intent(Intent.ACTION_VIEW);
// Uri.fromFile()方法根据文件对象的路径来构造一个Uri。
intent.setDataAndType(Uri.fromFile(file),"application/vnd.android.package-archive");
startActivity(intent);
```
    语句解释：
    -  本范例使用系统内置的ACTION_VIEW动作安装APK文件。
	-  ACTION_VIEW动作所要操作的数据的Uri是通过一个File对象的路径构造出来的。
	-  ACTION_VIEW动作用于“查看”，该动作会根据其所要查看的数据的MIME类型的不同，来调用不同的应用程序来查看数据。
	-  APK文件的MIME类型为application/vnd.android.package-archive ，而查看APK文件，其实就是安装APK文件。

<br>　　范例3：卸载应用程序。
``` android
Intent intent = new Intent();
intent.setAction(Intent.ACTION_DELETE);
intent.setData(Uri.parse("package:"+ this.getPackageName()));
startActivity(intent);
```
    语句解释：
    -  调用系统内置的ACTION_DELETE动作可以执行删除操作。
	-  若删除的数据为：“package:应用程序包名”，则相当于卸载该应用程序。 
	-  调用Activity的getPackageName()方法可以获取当前应用程序的包名称。

<br>　　范例4：启动发送短信Acitivity。
``` android
Intent intent = new Intent();
// 设置意图的动作为“发送”和“发送数据”的MIME类型。
intent.setAction(Intent.ACTION_SEND);
intent.setType("text/plain");
 
// 设置要发送的 正文数据。
intent.putExtra(Intent.EXTRA_TEXT, "Hi 发送短信哦!");
startActivity(intent);
```
    语句解释：
    -  程序运行时会打开系统发送短信界面。

<br>　　范例5：data匹配。
``` android
<activity android:name="org.cxy.intent.SecondActivity">
    <intent-filter>
        <action android:name="org.cxy.action.Second"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:scheme="http" android:host="www.cxy.com" android:port="80" android:path="/hi.jsp"/>
    </intent-filter>
</activity>
```
　　在MainActivity中书写如下跳转语句：
``` android
Intent intent = new Intent();
intent.setAction("org.cxy.action.Second");
intent.setData(Uri.parse("http://www.cxy.com:80/hi.jsp"));
this.startActivity(intent);
```
    语句解释：
    -  使用scheme属性匹配Uri中的协议名，scheme属性的值中不要包含“:”号。若scheme属性值为http，则Uri就需要为“http:”
	-  使用host属性匹配Uri中的主机名，使用此属性之前，必须要先指定scheme属性，在Uri中scheme和host之间要写上“//”作为间隔。 
	-  使用port属性匹配Uri中的端口号。使用path属性匹配Uri中的路径。
	-  提示：只有在data中所列出的所有属性都匹配时，才可以激活该Activity 。

<br>　　范例6：数据类型匹配。
``` xml
<activity android:name="org.cxy.intent.SecondActivity">
    <intent-filter>
        <action android:name="org.cxy.action.Second"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:scheme="http" android:host="www.cxy.com" android:port="80"
                 android:path="/hi.jsp" android:mimeType="image/gif"/>
    </intent-filter>
</activity>
```
　　在MainActivity中书写如下跳转语句：
``` android
Intent intent = new Intent();
intent.setAction("org.cxy.action.Second");
intent.setDataAndType(Uri.parse("http://www.cxy.com:80/hi.jsp"),"image/gif");
this.startActivity(intent);
```
    语句解释：
    -  使用mimeType属性可以对数据的MIME类型进行限制。
	-  使用setDataAndType方法可以同时设置Intent对象的Uri和MIME类型。

　　提示：意图的选择。
	-  若需要激活其他应用中的组件，就使用隐式意图。若需要激活本应用中的组件，则可以使用显式意图。 原因：
	-  首先，使用显式意图仅可以激活其他应用的入口Activity ，因此需要使用隐式的。
	-  然后，使用隐式意图存在一个匹配的过程，影响性能，因此在本项目中，应该使用显式的。

<br>**扩展：**
　　`PackageManager`类中有一组`query…()`方法，它们返回能够接受一个特殊`Intent`对象的所有组件。
　　例如：

	-  queryIntentActivities()方法返回一个能够执行这个Intent对象要求动作的所有Activity。
	-  queryIntentServices()方法类似地返回Service列表。
	-  queryBroadcastReceivers()方法类似地返回Broadcast Receiver列表。
　　这些方法都不激活组件，它们只是列出能够响应这个`Intent`对象的所有组件。


<br><br>