title: 第二章 应用程序组件 — Intent与Intent Filters
date: 2014-12-1 21:39:45
categories: Android
tags:
- Android
---
　　Android四大组件中有三个组件（Activity、Service、Broadcast Receiver）是通过叫做Intent的对象来激活的。 
　　给每种类型组件发送Intent对象都有其独立的机制：
　　把一个Intent对象传递给`startActivity`方法可以启动Activity。或者把它传递给`startActivityForResult`方法来启动一个新的Activity，被启动的Activity可以调用`setResult`方法来返回响应的信息。
　　把一个Intent对象传递给`startService`方法来初始化一个服务或给一个正在运行的服务发送新的指令。类似地，也能把Intent对象传递给`bindService`方法，在调用组件和目标服务之间建立一个连接，如果服务还没有运行可以选择启动。
　　传递给广播方法（如`sendBroadcast`、`sendOrderedBroadcast`、或`sendStickyBroadcast`方法）的任何Intent对象都被发送给所有对其感兴趣的广播接收者。
<br>　　在上述每种情况下，Intent对象只会被发送给其对应的组件：
	-  广播的Intent对象仅发送给Broadcast Receiver组件，不会发送给Activity或Service组件。
	-  传递给startActivity()方法的Intent对象仅发送给一个Activity，不会发送给一个Service或Broadcast Receiver组件等等。

<br>　　接下来将介绍Intent对象，然后介绍Android把Intent对象映射给组件的规则（Android系统是如何解析哪个组件应该接收对应的Intent消息），对于没有明确命名目标组件的Intent对象，这个过程涉及用与潜在的目标关联Intent过滤器(Intent Filter)来检测Intent对象。


# 第一节 Intent基本组成 #
　　一个Intent对象就是一个信息包。它包含了接收这个Intent对象的组件感兴趣的信息（如要执行的动作和动作相关的数据）和Android系统感兴趣的信息（如处理这个Intent对象的组件的分类和有关如何启动目标Activity的指令等）。
　　Intent类中包含很多信息，其中主要有7个重要的字段，它们分别用在不同的场合：

	mComponent、mAction、mData、mCategories、mExtras、mType、mFlags
　　创建Intent对象时，不需要为这7个属性全都赋值，它们只是在不同的情况下，会用到其中的某几个属性而已。
<br>　　下面简单的说一下各个组成部分，稍后会详细介绍如何使用它们。

## 组件名（Component） ##
　　组件名指的是能够处理Intent对象的组件的名字，即Intent类的`mComponent`字段，这个字段是一个`ComponentName`类的对象。
　　ComponentName类用来表示目标组件的完整类名（如：com.example.project.app.FreneticActivity）和组件所在的应用程序的清单文件中设置的包名（如：com.example.project）的组合。注意：完整类名的包部分和清单文件中设置的包名不一定一致。
　　`mComponent`字段是可选的，如果设置了`mComponent`字段，Intent对象就会被发送给这个指定类的实例。如果没有设置，Android系统使用Intent对象中的其他信息来定位合适的目标。
　　组件名是通过Intent类的`setComponent()`、`setClass()`或`setClassName()`方法来设置，并且可以通过Intent类的`getComponent()`方法来读取。

## 动作（Action） ##
　　动作指的是一个要执行的动作的命名字符串，即Intent类的`mAction`字段，这个字段是String类的对象。在广播Intent对象的情况下，Action指的是已经发生和正在报告的动作。Intent类定义很多动作常量，详见下表：
``` android
常量                         目标组件              描述
ACTION_CALL	             Activity             发起电话呼叫
ACTION_EDIT	             Activity             为用户显示其想要编辑的数据
ACTION_MAIN	             Activity             作为一个任务的初始Activity启动，没有数据输入和返回输出。
ACTION_SYNC	             Activity	          用移动设备上的数据同步服务上的数据。
ACTION_BATTERY_LOW	     Broadcast Receiver	  低电量的一个警告
ACTION_HEADSET_PLUG	     Broadcast Receiver	  耳麦已经被插入设备，或者从设备上拔出。
ACTION_SCREEN_ON             Broadcast Receiver   显示屏已经被打开
ACTION_TIMEZONE_CHANED       Broadcast Receiver   时区相关的设置已经被改变
```
　　对于一般性动作(Action)的预定义常量列表，请看Intent类说明。在Android API的其他地方还定义了一些其他的动作(Action)。你也可以在自己的应用程序中给你的Activity组件定义自己的动作(Action)字符串。你创建这些动作(Action)应该包含应用程序的包名作为动作前缀。例如：`com.example.project.SHOW_COLOR`。
　　Intent对象中的动作是由它的`setAction()`方法设定的，并且有`getAction()`方法读取的。

## 数据（Data） ##
　　Data指的是与Action相关的数据，即Intent类的`mData`字段，这个字段是Uri类的对象。
　　显然不同的动作要跟不同的数据规范类型配合使用，比如：
	-  如果动作字段是ACTION_EDIT，那么它的数据字段（即URI）应该指向它所要编辑的数据。
	-  如果动作是ACTION_CALL，那么数据字段就应该是一个呼叫号码。在Android中会使用“tel:呼叫号码”来表示这个数据。
	-  如果动作是ACTION_VIEW，那么数据字段就应该指向一个可被查看的东西，比如网页、图片、视频等。
　　在把一个Intent对象分配给一个有处理`mData`能力的组件时，了解`mData`的数据类型（即MIME类型）是至关重要的。例如，能够显示图片的组件不应该被调用来播放音频文件。
　　很多情况下，从URI中能够推断出数据类型（特别是content:URIs，它指明了设备上数据的位置和控制数据的内容提供器），但是数据类型也能够在Intent对象中明确的设定，Intent类的`setData()`方法只能给它指定数据，`setType()`方法只能给数据指定MIME类型，`setDataAndType()`方法同时指定数据和数据的MIME类型。通过`getData()`方法读取数据，`getType()`方法获取数据类型。

## 分类（Category） ##
　　分类指的是包含能够处理这个Intent对象的组件类型的相关信息的字符串，即Intent类的`mCategories`字段，这个字段是`HashSet<String>`类的对象。任何类别的分类描述都能够被放在Intent对象中。跟Action的动作一样，Intent类也定义几个分类常量，如下表：
``` android
常量                         描述
CATEGORY_BROWSABLE          目标Activity能够安全的调用浏览器来显示链接所指向的数据（如图片或电子邮件）。
CATEGORY_GADGET             Activity能够被嵌入到持有小部件的另一个Activity中。
CATEGORY_HOME               Activity显示在主屏幕上，开机时用户看到的第一个屏幕或Home按钮被按下时，用户看到的屏幕。
CATEGORY_LAUNCHER           Activity能够作为任务的初始Activity，并且被列在应用程序启动器的顶层。
```
　　完整的分类列表请看Intent类的说明。
　　Intent类的`addCategory()`方法把一个分类放到一个Intent对象中，`removeCategory()`方法删除先前添加的分类，`getCategories()`方法获取当前Intent对象中的所有分类设置。

## 附加信息（Extras） ##
　　组件的访问者可以通过向Intent添加一些附加信息来给目标组件传递数据，这些附加信息可以是各种类型的变量，附加信息即Intent类的`mExtras`字段，这个字段是`Bundle`类的对象。
　　Bundle以key-value对的形式将附加信息发送给处理这个Intent对象的组件。你可以往里面放入任何目标组件所需要的参数。如一个`ACTION_TIMEZONE_CHANGED`类型的Intent对象有一个指定新时区的time-zone附加信息，`ACTION_HEADSET_PLUG`类型的Intent对象有一个指示耳麦当前是插入还拔出状态的附加信息，对于耳麦类型还有一个`name`的附加信息。如果你创建了一个`SHOW_COLOR`动作，颜色值应该被设置在一个key-value对的附加信息中。
　　Intent对象为插入各种类型的附加数据提供了一系列的`put…()`方法，并为读取数据也提供了一组类似的`get…()`方法。这些方法并行于Bundle对象一些方法。实际上，附加信息能够作为一个Bundle对象使用Intent类的`putExtras()`和`getExtras()`方法来安装和读取。

## 标记（Flags） ##
　　Intent对象可以有各种标记，很多标记都是用于指示Android系统如何启动Activity。如Activity应该属于哪个任务以及启动后如何处理（如它是否属于最近的Activity列表）。
　　所有这些标记都在Intent类中定义，Intent对象的`mFlags`字段用于保存标记。
　　Android系统和平台相关的应用都采用Intent对象来发出面向系统的广播和激活系统定义的组件。


# 第二节 Intent对象解析 #
　　Intent被译为意图，在Android中意图分为：显式意图和隐式意图。
<br>　　**显式意图**
　　Intent对象的`mComponent`属性用来代表需要操作系统启动的组件。若在Intent对象被发送给操作系统之前，程序为mComponent属性赋值了，则此Intent对象被称为显式意图。显示意图明确的为Intent指定了其要启动的组件的所在包名、类名，Android系统接到Intent对象时，直接去对应的包中反射实例化并初始化目标组件。
<br>　　**隐式意图**
　　在程序中没有为Intent对象明确指出想要其启动组件。而是提供一些筛选条件，操作系统会从当前已在系统中注册的所有组件中，筛选出满足要求的组件(可能是一个也可能是多个)，然后予以启动。 

<br>　　接下来将分别详细介绍这两种类型的Intent。

## 显式意图 ##
　　当操作系统接到Intent对象后，会检查Intent对象的`mComponent`是否有值：
	-  若有值：则直接启动mComponent所代表的组件。
	-  若无值：则按照隐式意图处理。
　　mComponent属性是ComponentName类型的，ComponentName类用于描述Android中的组件，且它只有两个属性。因为，若想在Android系统中找到某个组件，仅需要提供两个数据即可：包名、组件名。

	-  包名：用来指出该组件所在的应用程序。
	-  组件名：找到应用程序后，再依据组件名，来在该程序中找对应的组件。


<br>　　范例1：通过ComponentName启动新Activity。
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
    -  在Android中可以通过意图对象将一些参数传递到目标组件中去。Intent对象的mExtras属性用来保存这些数据。
    -  可以在构造Intent对象的同时，设置当前Intent对象，从何处跳往何处：
       -  Intent intent = new Intent(MainActivity.this,MyActivity.class);
	-  可以先将数据存放在一个新的Bundle对象中去，然后调用Intent对象的putExtras方法将新的Bundle中的所有数据添加到Intent对象中的Bundle对象里面去。

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

　　因为一般情况下应用的开发者不会了解其他应用程序中组件的名字，也就无法通过显示意图来启动其他应用中定义的组件。
　　所以显式意图是通常针对应用程序内部消息使用明确命名的Intent对象，如一个Activity启动一个下属服务或启动一个姊妹Activity。

## 隐式意图 ##
　　隐式意图：在程序中没有为Intent对象的`mComponent`属性明确指出想要其启动组件。
　　隐式意图仅仅是为Intent对象指出一些筛选条件，然后Android系统会取出Intent对象中的数据和所有已经注册到系统中的组件进行匹配。

	-  若匹配成功，则系统将激活该组件。
	-  若有多个组件匹配成功，则系统将弹出一个对话框，要求用户选择所要激活的组件。
	-  若没有任何组件匹配成功则抛异常。

　　应用程序中定义的Android组件都需要在AndroidManifest.xml文件中记录。当系统在进行意图匹配时，就会取出Intent对象中的筛选条件与所有已注册到系统中的各个组件的`<intent-filter>`标签（Intent过滤器）下定义的数据进行匹配。
　　如果组件没有任何过滤器，那么它仅能接收明确命名的Intent对象。带有过滤器的组件能够接收命名和匿名的Intent对象。
　　Intent过滤器会参考Intent对象以下三个方面来检测是否接收这个Intent对象：

	1、动作（mAction）
	2、数据（mData和mType）
	3、分类（mCategories）
　　附加信息（mExtras）和标记（mFlags）不作为判断哪个组件接收这个Intent对象标准。

<br>**Action**
　　mAction：描述一个动作。如：张三看书、李四唱歌中的“看”、“唱”就是指动作。在Android中内置的动作有很多，常见的有：

	-  Intent.ACTION_VIEW ：“查看”动作。
	-  Intent.ACTION_EDIT ：“编辑”动作。
	-  Intent.ACTION_DELETE ：“删除”动作。
	-  Intent.ACTION_MAIN ：标记当前Activity是程序的入口。
　　进行意图匹配时，只有在意图的mAction属性与`<intent-filter>`下的`<action>`标签的值匹配成功后，才会去匹配mCategories属性。 若意图过滤器中没有定义mAction属性，则当前组件将被直接忽略，系统不会再与之进行匹配。

<br>**Categories**
　　mCategories：描述在执行意图对象时关于mAction的一组附加信息。在Android中内置的类型有：

	-  Intent.CATEGORY_LAUNCHER ：在手机“应用菜单”中列出当前Activity。
　　只有在Intent全部的mCategorie属性与`<intent-filter>`下的所有`<category>`标签的值都匹配成功后，才会去匹配`<data>`标签。

<br>**Data和Type**
　　数据：以URI的形式描述“动作”所要操作的数据。准确的说数据包括两部分：数据的uri 和数据类型：

	-  数据的URI(mData)：如file:///tmp/android.txt 。
	-  数据的类型(mType)：即数据的MIME类型。如：text/html 。
　　当mAction和mCategories都匹配后，使用data可以进一步定位一个组件。

### IntentFilter ###
　　IntentFilter是用来通知操作系统组件能够处理哪种类型隐式的Intent对象，Activity、Service、Broadcast Receiver能够有一个或多个Intent过滤器。每个过滤器都描述了组件的一种能力，说明了组件将会接受的Intent对象集。一个有明确命名的Intent对象总是被发送给它的目标类的实例，即该组件的过滤器将不起作用。但是隐式的Intent对象仅能发送给能够通过组件的某一个过滤器验证的组件。

　　例如，实例应用Note Pad应用程序的NoteEditorActivity就有两个过滤器：
	-  一个是用于启动带有用户能够查看或编辑的特定注释信息的过滤器。
	-  一个是用于启动一个新的，用户能够填充和保存的空白注释过滤器。

　　一个Intent过滤器是IntentFilter类的实例。但是因为Android系统在它启动组件之前必须了解有关组件的能力，所以Intent过滤器通常都不是用Java代码来建立的，而是在应用程序的清单文件（AndroidManifest.xml）中用`<intent-filter>`元素来声明。（但是，通过调用Context.registerReceiver()方法来动态注册的Broadcast Receiver是一个例外，它们直接创建IntentFilter对象做为过滤器。）

　　过滤器有类似于Intent对象的`动作`、`数据`、和`分类`的字段，过滤器会用这三个字段来检测一个隐式的Intent对象。如果组件的某个IntentFilter与Intent匹配失败了，Android系统则不会把Intent发送给该组件--至少在基于那个过滤器的基础上不会发送。但是，因为一个组件能够有多个Intent过滤器，即使不能通过组件的一个过滤器来传递Intent对象，也可以使用其他的过滤器。

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
　　对于一个要通过Category检测的Intent对象，在Intent对象中每个分类都必须跟过滤器中的一个分类匹配。 过滤器能够列出额外的分类，但是它不能忽略Intent对象中的任何分类。因此，原则上一个没有category的Intent对象应该始终通过这个检测，而不管过滤器中声明的分类。

　　大多数情况都是这样的，但是有一个例外，Android处理所有传递给startActivity()方法的隐式Intent对象，都会至少包含了一个`android.intent.category.DEFAULT`。
　　因此接收隐式Intent对象的Activity必须在它们的Intent过滤器中包含android.intent.category.DEFAULT分类。
　　带有`android.intent.action.MAIN`和`android.intent.category.LAUNCHER`设置的过滤器是个例外。因为它们把Activity标记为新任务的开始，并且代表了启动屏。它们能够在分类列表中包含`android.intent.category.DEFAULT`，但是不需要。

<br>**Data检测**
　　像Action、category检测一样，针对Intent过滤器的数据规则也要包含在一个子元素中，并且，跟动作和分类的情况一样，这个子元素也能够出现多次，或者不出现。例如：
``` android
<intent-filter>
    <data android:mimeType="video/mpeg" android:scheme="http" /> 
    <data android:mimeType="audio/mpeg" android:scheme="http" />
</intent-filter>
```
　　每个`<data>`元素能够指定一个URI和一个数据类型（MIME媒体类型）对于每个URI部分都会有独立的属性---scheme、host、port、path。格式：
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
　　其中host和port一起构成了`authority`，如果没有指定host，那么port也会被忽略。
　　这些属性都是可选的，但是，它们不是彼此独立的，如一个authority意味着必须指定一个scheme，一个path意味着必须指定scheme和authority。

　　当Intent对象中的URI跟过滤器的一个URI规则比较时，它仅比较在过滤器中实际提到的URI部分。如，如果一个过滤器仅指定了一个scheme，那么带有这个scheme的所有的URIs都会跟这个过滤器匹配。如果一个过滤器指定了一个scheme和authority，但是没有path，那么带有相同scheme和authority的所有URIs的Intent对象都会匹配，而不管它们的path。如果一个过滤器指定了一个scheme、authority、和path，那么就只有相同的scheme、authority和path的Intent对象才会匹配。

　　`<data>`元素的`mimeType`属性指定了数据的MIME类型。对于子类型域，Intent对象和过滤器都能够使用`*`通配符。例如`text/*`或`audio/*`指明可以跟任意子类型匹配。

　　数据检测会比较Intent对象和过滤器中的URI和数据类型。规则如下：

	A、只有过滤器没有指定任何URI或数据类型的情况下，既没有URI也没有数据类型的Intent对象才能通过检测。
	B、一个包含URI但没有数据类型的Intent对象（并且不能从URI中推断出数据类型）只能跟同样只包含URI没有指定数据类型的过滤器匹配。
	C、一个包含了数据类型但没有包含URI的Intent对象，只有过滤器也列出相同的数据类型，并也没有指定URI的情况下，才能通过检测。

<br>**常见情况**
　　过滤器能够只列出数据类型，并且不需要明确的列出URI的其他部分。这是一种典型的情况。例如，像下面的<data>元素那样，告诉Android，组件能够从一个内容提供器中获取图片并显示它：
``` android
<data android:mimeType="image/*" />
```
　　因为大多数有效的数据是通过内容提供器来配发的，所以，指定一个数据类型但没有URI的过滤器或许是最常见的。

　　另一个常见的配置是带有scheme和type的过滤器。例如，像下面这样的<data>元素会告诉Android组件能够从网络上获取视频并显示它。
``` android
<data android:scheme="http" android:type="video/*" />
```
　　例如，我们来研究一下当用户点击一个网页上的一个链接时，浏览器应用程序要做的事情。首先，它会试着来显示数据（如果这个链接是一个HTML页，那么就显示）。如果不能显示这个数据，那么就会把scheme和type一起放到一个隐式Intent对象中，并试着启动一个能够做这项工作的Activity，如果没有接受者，它就会要求下载管理器来下载数据。然后把数据放在一个内容提供器的控制之下，以便一个潜在的更大的Activity池（那些只带有命名数据类型的过滤器）能够响应。

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
    -  使用隐式意图时，Android系统会取出Intent对象中的action、category等数据和当前系统中所有已注册的Activity进行匹配(和每个<activity>标签内部的意图过滤器<intent-filter>匹配)。若匹配成功，则将触发该Activity 。
	-  本范例并没有为Intent指定具体要跳转到哪个Activity，而是为Intent指定一个action。在调用startActivity方法启动Activity时，会自动为Intent对象设置一个category，这个category就是：“android.intent.category.DEFAULT”。
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
``` android
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
　　Intent对象跟过滤器匹配不仅是要发现要激活的目标组件，而且也发现设备上有关组件集的一些事情。
　　例如，Android系统通过查找所有的拥有指定的`android.intent.action.MAIN`动作和`android.intent.category.LAUNCHER`分类的过滤器的Activity，把它们填充到应用程序的启动器，把用户启动的有效的应用程序显示在屏幕的顶层，然后显示启动器中的那些Activity的图标和标签。
　　类似地，系统通过查找它的过滤中带有`android.intent.category.HOME`的Activity来发现主屏界面。

　　PackageManager类中有一组`query…()`方法，它们返回能够接受一个特殊Intent对象的所有组件，并且还有一组类似的`resolve…（）`方法，用来判断响应一个Intent对象的最好组件。
　　例如：

	-  queryIntentActivities()方法返回一个能够执行这个Intent对象要求动作的所有Activity。
	-  queryIntentServices()方法类似地返回Service列表。
	-  queryBroadcastReceivers()方法类似地返回Broadcast Receiver列表。
　　这些方法都不激活组件，它们只是列出能够响应这个Intent对象的所有组件。


<br><br>