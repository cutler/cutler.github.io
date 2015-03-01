title: 第二章 应用程序组件 — Activity
date: 2014-10-30 23:28:28
categories: Android
---
　　一个`Activity`是提供给用户的用于与程序进行交互的界面组件，如打电话、拍照片、发邮件、或看地图等。每个Activity都通过一个窗口来描画它的用户界面，通常这个窗口是全屏的，但是也可以比屏幕小，并且可以浮动在其他窗口的上面。

　　一个应用程序通常由多个Activity组成，它们彼此松散的绑定到一起。通常，在一个应用程序中要指定一个Activity作为`主Activity`，当用户启动应用程序时，这个Activity首先表现给用户。每个Activity为了执行不同的动作，可以开启另一个Activity。`每启动一个新的Activity，前一个Activity会被Stop`(如果有前一个的话)，同时系统会把新Activity保留到一个`堆栈`中（即back stack）做为栈顶元素，`back stack`遵循基本的`“后进先出”`机制，因此当用户用当前的Activity完成工作，并按下回退键时，当前Activity就会从堆栈中弹出(并且被摧毁)，同时前一个Activity会恢复之前的状态。

　　当一个Activity因为一个新的Activity被启动而Stop时，它会通过Activity`生存周期的回调方法`通知你这种状态的改变。Activity在状态改变期间可以接受几种回调方法---系统是否正在`createing`、`stopping`、`resuming`或`destroying`它。并且每种回调都提供了在对应状态改变时执行特定工作的机会。例如：

	当Activity被终止(stop)时，你的Activity应该释放任何大对象，如网络和数据库连接等。
	当Activity被恢复(resume)时，你能够重新请求这些必须的资源，并且恢复被中断的行为。这些状态的变换是所有Activity生命周期的一部分。

<br>
# 第一节 基础入门 #
## 创建Activity ##
　　要创建一个Activity，你必须创建一个Activity的子类（或者是现存的Activity子类）。在这个子类中，需要实现系统调用的回调方法，以便Activity在生存周期的各种状态间转换时进行相应的处理。如Activity被`created`、被`stopped`、被`resumed`、或被`destroyed`等时都会调用相应的回调方法，其中两个最重要的回调方法是：
<br>　　onCreate()

	你必须在Activity子类中实现这个方法。在Activity创建时，系统会调用这个方法。在你的实现中，应该初始化必要的Activity组件。最重要的，在这儿你必须调用setContentView()方法来定义Activity的用户界面的布局。
　　onPause()

	当用户有离开当前Activity的动作时，系统会首先调用这个方法（虽然这并不意味着Activity要被销毁），通常在这儿你应该提交在当前用户会话之上的任何应该被持久化的改变（因为用户可能不在回来）。
　　为了在Activity之间切换和处理异常时给用户提供流畅的体验，还应该使用其他的几个生存周期的回调方法。所有的这些生存周期回调方法会在稍后讨论。

<br>　　范例1：Activity类。
``` android
	public class android.app.Activity extends ContextThemeWrapper {
	    // 指定一个xml布局界面文件的资源ID，来设置当前Activity的用户界面。
	    public void setContentView (int layoutResID){}
	
	    // 根据控件的id 属性的值，从当前Activity的xml中查找出与之匹配的View组件。
	    public View findViewById (int id){}
	}
```

	语句解释：
	- 本范例只是列出了Activity的最常用的2个方法，稍后将会用到它们，而Activity类的其它常用方法将在后续慢慢列出。

## 实现一个用户界面 ##
　　传统应用程序中，用户界面是在程序的内部进行构建。当需要修改界面时，就变的很困难、繁琐。目前比较流行的解决方案是将界面描述部份的代码，抽取到程序外部的 XML 描述文件中。Android就是采用此种方案。将应用程序的界面放到`/res/layout`目录下定义。
　　然后你可以把布局文件的资源ID传给Activity类的`setContentView()`方法，用这个ID对应的布局来设置Activity界面的布局。但是，你也可以在你的Activity代码中创建新的View，并且通过把新的View插入到ViewGroup中的方法来构建View树，然后通过把根ViewGroup传递给Activity的setContentView()方法来实现窗口布局。

<br>　　范例1：创建一个Activity需要完成如下步骤。

	-  首先，建立一个类，并继承Activity类。
	-  然后，在自定义Activity中重写Activity的onCreate方法，用于执行初始化操作。
	-  接着，在AndroidManifest.xml文件中声明这个Activity。
	-  最后，为Activity添加必要的控件。


<br>　　范例2：简单Activity。
``` android
package org.cxy.tomcat;

import org.cxy.tomcat.R;
import android.app.Activity;
import android.os.Bundle;
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        // 必须要先调用父类的onCreate()方法,完成一些必要的初始化操作。
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
    } 
}
```

    语句解释：
    -  第9行，调用MainActivity父类的onCreate方法，做一些初始化操作。
	-  第10行，设置当前MainActivity要显示的内容。
	-  此处就是调用 项目根目录/res/layout/main.xml 文件来设置主Activity中要显示的内容。

<br>　　一个Activity的用户界面是通过View树来提供的（这些View对象派生自View类）。每个View在Activity的窗口中都控制一个特定的的矩形区域（你看到的所有圆角、形状等本质上都是在一个矩形内绘制的），并且能够响应用户的操作。例如，一个按钮在用户点击它时，可以启动一个动作。

　　Android提供了很多已经准备好的View，你能够使用这些View来设计和组织到你的布局中。

	“Widgets”是给屏幕提供的可见的并可交互的View元素。如按钮、文本框、单选/复选框、或图片等。
	“Layouts”是派生自ViewGroup的View，可以将它看成一个容器，其内部可以包含widgets或者嵌套另一个Layouts，它为它的子View提供了一个唯一的布局模式，如线性布局、网格布局、或相对布局等。
　　你也能够通过继承`View`和`ViewGroup`来创建自己的`widgets`和`layouts`，并且把它们应用到Activity布局中。

## 注册Activity ##
　　为了让系统能够访问Activity，你必须在清单中声明你的Activity。要声明你Activity，请打开你的清单文件(manifest file)，在<application>元素中添加<activity>子元素。如：
``` android
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
	package="org.cxy.tomcat" android:versionCode="1" android:versionName="1.0">
    <application 
        android:icon="@drawable/ic_launcher" 
        android:label="@string/app_name">
            <activity android:name="org.cxy.tomcat.MainActivity"/>
    </application>
</manifest>
```
　　在这个`<activit>`中还包含几个其他的属性，如Activity的标签、Activity的图标、Activity界面的主题样式等。`android:name`属性是唯一个必须的属性（它指定Activity的类名）。一旦你发布了应用程序，就不应该改变这个名字，因为如果发生改变，就可能破坏某些功能，如应用的快捷方式等。

## 使用Intent过滤器 ##
　　`<Activity>`元素中也能使用`<intent-filter>`元素来指定各种Intent过滤器，以便声明其他应用程序组件可以怎样激活它。

　　当你使用AndroidSDK工具创建一个新的应用程序时，自动创建的那个Activity包含了一个声明Activity响应`“Main”`动作的Intent过滤器，并且这个过滤器被放在`“Launcher”`分类中。过滤器声明如下：
``` android
<activity
    android:name="org.cxy.tomcat.MainActivity"
    android:label="@string/app_name" >
	<intent-filter>
	       <action android:name="android.intent.action.MAIN" />
	       <category android:name="android.intent.category.LAUNCHER" />
	</intent-filter>
</activity>
```

    语句解释：
    -  其中必须要有“android.intent.action.MAIN”否则程序将无法启动，它用来标识当前Activity是应用的入口Activity。
	-  而“android.intent.category.LAUNCHER”是可选的，但是通常都会加上。它用来告诉Android系统需要将当前Activity放入到Launcher列表中。 若没有设置此项，也是可以启动入口Activity的，比如通过Eclipse，在运行程序的时候，会自动启动“Main”Activity。 但是除非特殊需求，又会有谁不把自己的程序放入Launcher里呢？

<br>　　如果你仅打算让你的应用程序使用该Activity，而不允许其他应用来激活这个Activity，那么不需要任何的Intent过滤器。但是，如果你想让你的Activity响应来自其他应用程序（包括应用程序自己）的`隐式的Intent`，那么你就必须给你的Activity定义额外的Intent过滤器。对于你想响应的每种Intent类型，你必须在`<intent-filter>`元素中包含一个`<action>`元素，并且可选择的包含`<category>`和`<data>`元素。
　　这些元素指定了你的Activity能够响应那种类型的Intent。关于Intent的更详细内容将在Intent一节中讲解。

## 启动另一个Activity ##
　　你可以通过调用Context类的`startActivity()`方法来启动另外一个Activity，在调用这个方法时要给它传递一个Intent对象，该Intent对象描述了你想要启动的Activity。这个Intent既可以确切的指定你想要启动的Activity，也可以是你想要执行的Action的类型的描述，系统会依据你指定的Action从操作系统内所有已注册的Activity中给你选择出匹配的Activity，并将它们列出来(如果有多个匹配的话)，甚至可以从不同的应用程序中选择。Intent也能够携带少量的数据给被启动的Activity。
　　注：Activity类是Context类的子类，因此Activity的对象就可以使用startActivity()方法。

<br>　　在你自己的应用程序中，你会经常的需要启动自己的Activity，你可以直接使用类名来启动它们。通过创建一个你想启动的明确定义的Activity的Intent来做这件事。例如，下面的例子说明了怎样启动一个名叫SignInActivity的Activity。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // 启动一个名为ActivityB的界面
        Intent intent = new Intent(this, ActivityB.class);
        startActivity(intent);
    } 
}
```
　　有时你的应用可能要执行诸如发送邮件、文本消息、打开网页等动作，并且你的应用程序中又没有可以执行这些动作的Activity，此时你可以使用设备上其他应用程序提供的Activity来替你执行这些动作，这是Intent的真正价值 -- 你能够创建一个描述你想执行的动作的Intent，这样操作系统就会从其他应用程序中加载相应的Activity。 如果有多个能够处理这个Intent的Activity，那么用户能够选择其中之一来使用。例如，如果你想允许用户发送一个邮件消息，你能够创建下面这样的Intent：
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        Intent intent = new Intent(Intent.ACTION_SEND);
        Intent.putExtra(Intent.EXTRA_EMAIL, recipientArray);
        startActivity(intent);
    } 
}

```

    语句解释：
    -  给Intent设置的Action并不是随便写的，该Action必须是已经在操作系统中存在的。比如“Intent.ACTION_SEND”是系统内置的一个常量，用来启动Email程序。
	-  如果你向操作系统提供了一个Action，但是系统并没有找到对应的Activity，则就会抛出异常。

　　附加给Intent的`EXTRA_EMAIL`是一个要发送邮件的邮件地址字符数组，当邮件应用程序响应这个Intent时，它会读附加物中提供的字符数组，然后把它们放到邮件格式的`“to”`字段中。在这个案例中，邮件应用程序的Activity被启动，当用户发送完毕邮件后，你的Activity被`resume`。
<br>
# 第二节 参数传递 #
　　Activity_A可以通过Intent对象向Activity_B发送数据，当Activity_B被销毁时，Activity_B也可以向Activity_A返回一些数据。

## 通过Activity传递参数 ##

<br>　　范例1：获取返回值，实现步骤。

	-  首先，在Activity_A中必须通过startActivityForResult方法启动Activity_B 。
	-  然后，当用户在Activity_B中完成自己的工作后，程序可以在Activity_B中通过setResult方法设置要返回给Activity_A的返回值。
	-  接着，当Activity_B的finish方法（下面会介绍）被调用后，Android操作系统会执行以下判断：
	   -  若Activity_A是通过startActivityForResult方法启动Activity_B ，则Android操作系统此时会调用Activity_A的onActivityResult方法，并将Activity_B的返回值传递过去。否则，将不会调用Activity_A的onActivityResult方法，而只是将Activity_B关闭。
	   -  若Activity_A是通过startActivityForResult方法启动Activity_B，但是在Activity_B中并没有调用setResult方法设置返回值，则调用Activity_A的onActivityResult方法时会传递null过去。

<br>　　范例2：Activity类。
``` android
	public class android.app.Activity extends ContextThemeWrapper {
     // 启动intent对象指定的Activity 。
     // @param requestCode 请求。若请求码<0 则当Activity_B被销毁时，不会调用Activity_A的onActivityResult方法。
	    public void startActivityForResult (Intent intent, int requestCode){}
	
	    // 设置当前Activity的返回值。
	    public final void setResult (int resultCode, Intent data){}

	    // 接收从Act ivity_B返回过来的值，此方法由系统调用。
	    protected void onActivityResult (int requestCode, int resultCode, Intent data){}

	    // 调用此方法会关闭当前Activity ，调用此方法后会导致Acitivity的onDestroy方法被调用，最终将释放
	    // 当前Activity所占有的资源。
	    public void finish(){}
	}
```

<br>　　通过调用Acitvity的`finish()`、`finishActivity()`等方法你能够关闭一个Activity。
　　大多数情况下，你不应该使用这些方法来确切的关闭一个Activity，在后续的关于Activity生命周期的讨论中，你会了解到，Android系统为你管理着每个Activity的生命，因此你不需要关闭你自己的Activity。调用这些方法会对预期的用户体验带来不利的影响，只有在明确不需要用户再返回这个Activity的实例时才应该使用这个方法。

<br>　　范例3：Activity_A类。
``` android
public class Activity_A extends Activity {

    // 当用户点击界面上的按钮时，程序会执行此方法。
    public void onClick(View view){
        Intent intent = new Intent(this, Activity_B.class);
        intent.putExtra("name", "cxy_jay");
        this.startActivityForResult(intent, 200); //设置请求码为200 。
    }  

    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        if(data != null){
            	if(requestCode==200&&resultCode==Activity.RESULT_OK) //若响应码为200 。
            System.out.println("您是从Activity_B中回来的。");
            System.out.println("calls -->"+data.getStringExtra("message"));
        }else{
            System.out.println("calls --> data is null");
        }
    }
}
```

	语句解释：
	-  若Activity_B没有设置返回值，则data的值为null 。

<br>　　范例4：Activity_B。
``` android
public class Activity_B extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_b);
	
        Intent intent = this.getIntent();
        System.out.println(intent.getStringExtra("name"));
	
        Intent data = new Intent();
        data.putExtra("message", "haha");
        this.setResult(Activity.RESULT_OK, data);
        this.finish();
    }
}
```

	语句解释：
	-  setResult方法应该在finish方法之前调用，否则无法将返回值返回给Activity_A 。
	-  本范例中的data对象仅用于数据传递，在其构造方法中指定参数是无效的。

　　提示：当ActivityB向ActivityA返回值时：
	-  首先执行Activity B的finish方法。
	-  然后执行Activity A的onActivityResult方法。
	-  最后执行Activity B的destroy方法。

<br>　　范例5：显式意图调用其他应用的Activity。
``` android
Intent intent = new Intent();
intent.setClassName("org.cxy.second", "org.cxy.second.OtherActivity");
this.startActivity(intent);
```

	语句解释：
	-  指定目标应用的包名和Activity的名称，就可以在当前项目中完成跳转。
	-  但是，目标Activity必须是目标应用程序的入口Activity ，否则通常会导致无法跳转。

## 通过Application传递参数 ##
　　在Android中Activity之间进行数据传递时，有三种常见的方式：

	-  通过Activity的setResult方法的Intent对象：
		-  传递普通数据：使用putExtra(String,…);方法。
		-  传递JavaBean数据：使用putExtra(String,Serializable);方法。
		-  此时会将对象序列化到Intent对象中，因此JavaBean必须实现了Serializable或Parcelable接口。
	-  通过文件读写：Activity_A将数据写入到SD卡中，Activity_B从SD卡中读入数据。此种方式适合于数据量稍大的情况。
	-  通过Application对象。

<br>　　在应用程序被启动的时候，系统会为该应用程序创建一个Application对象，在整个程序运行的过程中，Application对象都不会被销毁。 因此可以向Application对象中添加对象。

<br>　　范例1：Activity类。
``` android
	public class android.app.Activity extends ContextThemeWrapper {
     // 返回当前应用程序的Application对象。
	    public final Application getApplication (){}
	}
```

<br>　　范例2：自定义Application。
``` android
package org.cxy.application;
import android.app.Application;
public class MyApplication extends Application {
    private Object obj;  // 定义一个Object对象,用于保存数据。
    public Object getObj() {
        return obj;
    }
    public void setObj(Object obj) {
        this.obj = obj;
    }
}
```

	语句解释：
	- 自定义一个Application之后，需要在AndroidManifest中进行注册。

<br>　　范例3：注册Application。
``` android
<application android:name="org.cxy.application.MyApplication">
```

	语句解释：
	-  在<application>标签内添加一个name属性，属性的值就是自定义application的类名。
	-  当程序启动的时候，系统将会创建一个MyApplication类型的对象，做为整个程序的application对象。
	-  若有多个<application>标签都定义了name属性，则程序在运行的时候将默认使用第一个<application>标签的name属性。

<br>　　范例4：利用它传递数据。
``` android
Intent intent = new Intent(this,AAct.class);
MyApplication my = (MyApplicati on) this.getApplication();
my.setObj("Hi Tom!");
this.startActivity(intent);
```

	语句解释：
	-  将obj定义成Map<String,Object>类型，可以更方便的存取数据。至于如何在Activity中取数据，不用多说了吧。 

<br>　　不过并不推荐将太多的数据放到Application中进行储存，因为他的生命周期很长。

<br>
# 第三节 生命周期 #
　　通过重写回调方法来管理Activity的生命周期是开发强壮和灵活应用程序的关键。某个Activity的生命周期直接受到与之相关的其他`Activity`、`Task`和`back Task`的影响。

## 三种状态 ##
　　Activity存在三种基本的状态：

　　恢复态（`Resumed`）：

	当前Activity在屏幕的最前端，并且拥有用户焦点（即可以响应用户的操作，这种状态有时也叫“运行态”）。
　　暂停态（`Paused`）：

	在当前Activity的上面存在有另一个Activity，并且该Activity拥有用户焦点，但是当前Activity依然可见，就是说在当前Activity之上的另一个Activity是可见的，并且那个Activity是部分透明的或没有覆盖整个屏幕。一个暂停态的Activity是完全活动着的（这个Activity对象被保留在内存中，它保持着所有的状态和成员信息，并且依然依附于窗口管理器），但是在内存极低的情况下，能够被系统清除。
　　停止态（`Stopped`）：

	这种状态下的Activity完全被另一个Activity屏蔽（即Activity保持在后台）。被停止的Activity也依然存活着（这个Activity对象被保留在内存中，它保持所有的状态和成员信息，但是不依附于窗口管理器）。而且，对用户它不再可见，并且在任何需要内存的时候，它都可以被系统清除。

<br>　　如果Activity处于`暂停`或`停止`态，系统既可以通过调用它的`finish()`方法把它从内存中删除，也可以简单的杀死它所处的进程。但是当Activity被重新打开时，它必须重新创建所有的内容。

## 七个生命周期方法 ##
　　当Activity在上述的三个不同状态间转换时，Activity会通过各种回调方法来通知应用程序。所有的回调方法都可以重写，用于处理Activity的状态改变时对应的工作。Activity有7个与生命周期有关的方法：
　　`onCreate()`、`onStar()`、`onResume()`、`onRestart()`、`onPause()`、`onStop()`、`onDestroy()`

　　程序通常可以使用Intent来实现多个Activity之间的页面跳转。 当程序流程从Activity A跳转到Activity B时，会同时导致两个Activity的状态发生变化。另外，重写这些生命周期方法时，你必须要先调用父类的方法执行相应的初始化操作后，再去做你自己的事情。
　　综合而言，这些方法定义了Activity的完整的生命周期。通过实现这些方法，你能够在Activity的生命周期中循环监视三种状态。


　　依据这七个生命周期方法的调用时机，可将Activity的生命周期划分为三种：

　　**完整生命周期：**

	-  从onCreate方法被调用开始，到onDestroy方法被调用之间的时间。完整生命周期包含了Activity生命周期的七个方法。
	-  你的Activity应该在onCreate方法中执行全局状态创建工作，在onDestroy方法中释放所有的保留的资源。例如，如果你的Activity有一个运行在后台，从网络上下载数据的线程，可以在onCreate方法中创建这个线程，并且在onDestroy方法中终止这个线程。

　　**可视生命周期：**

	-  自onStart调用开始直到相应的onStop调用为止。在这期间，用户能够在屏幕上看到这个Activity。例如，当一个新的Activity启动时，旧Acitivity的onStop方法将被调用，并且该Activity不再可见。
	-  这两个方法之间，你能保持显示给用户的Activity所需要的资源。例如，你能够在onStart方法中注册一个广播接收器来监视你的UI的改变，并且在onStop方法中解除注册（用户不能再看到Activity显示的内容）。
	-  在Activity整个生命期间，当Activity在显示和隐藏之间切换时，系统可以多次调用onStart和OnStop方法。
	-  调用流程为：onStart、onResume、onPause、onStop、onRestart 五个方法。

　　**前台生命周期：**

	-  自onResume调用起，至onPause调用为止。在这期间，这个Activity在屏幕上所有可见的其他Activity之前，并且有用户输入焦点。Activity能够在前台频繁的切入、切出，例如，当设备休眠或对话框风格的Activity显示时，onPause方法被调用。因为这个状态能够经常的转换，因此在这两个方法中代码应该尽量轻量级，以避免过慢的切换而让用户等待。

<br>　　下图说明了这些循环和状态之间转换可能的路径。矩形代表了Activity在状态间切换是需要实现的执行操作的回调方法：
<center>
![Activity的生命周期方法](/img/android/android_2_1.png)
</center>
<br>　　下面将详细介绍这七个生命周期方法。

<br>　　**onCreate()**
　　当Activity被创建时调用这个方法，在Activity的生命周期中，仅会调用一次。你应该在这个方法中创建所有的全局资源，如视图、把数据绑定到列表等等。当此方法被调用时，同时会给这个方法传递一个包含Activity前一个状态的`Bundle`对象（具体后述）。
　　操作系统启动一个Activity时，会先通过`反射`的方式实例化出该Activity的一个实例。然后调用其构造方法、为其设置Context对象等，一切完毕后才会调用`onCreate()`方法。跟随其后的总是`onStart()`方法。

<br>　　**onRestart()**
　　在Activity被`stop之后，重启之前`调用这个方法。跟随其后的总是`onStart()`方法。

<br>　　**onStart()**
　　在Activity显示对用户`可见之前`调用这个方法。如果该Activity要显示在前台，那么接下来会调用`onResume()`方法，如果被隐藏则会调用`onStop()`方法。

<br>　　**onResume()**
　　在Activity可以和用户交互之前调用这个方法。此时此刻Activity在堆栈的顶部，`能够接受用户的输入`。 调用此方法后，Activity将进入`运行状态`。跟随其后的总是onPause()方法。

<br>　　**onPause()**
　　当系统开始`resuming`另外一个Activity时，会调用当前Acitivty的这个方法。通常，用这个方法来提交那些未保存的改变使数据持久化，终止动画和其他的可能消耗CPU的操作等等。无论怎样，它里面的代码都应该被很快的执行完毕，因为`另一个Activity在它返回之前，将不会被resumed`。
　　若接下来当前Activity再次返回到前台时，会调用onResume()方法，若接着被隐藏，则会调用onStop()方法。 调用此方法后，Activity将进入`暂停状态`。注意：`弹出一个对话框不会导致Activity的onPause方法被调用`。
　　当操作系统内存不足且需要为高优先级的应用程序分配内存资源时，系统可能销毁处于pause状态的Activity。因此onPause()方法是Activity可以保证一定会执行的最后的一个生命周期方法。

　　提示： 对话框形式的Activity`<activity android:theme="@android:style/Theme.Dialog" ... />`。其中`android:`代表引用系统`android.R`类中的数据。`Theme.Dialog`是系统内置的一个主题。关于主题，后述。

<br>　　**onStop()**
　　当Activity不再对用户可见时调用这个方法，因为Activity被销毁或者因为另一个Activity（既可以是既存的也可以是新创建的）被恢复并且`完全覆盖当前Activity`时，这个方法就被调用了。
　　如果随后此Activity从后台返回前台与用户交互，就调用onRestart()方法，如果Activity被清除就调用onDestroy()方法。调用此方法后，Activity将进入`停止状态`。
　　注意：处于onStop()状态的Activity同样会因为系统内存不足而被系统给回收掉。

<br>　　**onDestroy()**
　　在Activity被销毁之前调用这个方法。这是`Activity收到的最后的调用`。此方法既可以因为`finish()`方法的调用而被调用，也可以因为系统临时销毁了这个Activity实例来释放空间而被调用。你能够使用`isFinished()`方法来区分这两种场景。
　　注意：处于onDestory()状态的Activity同样会因为系统内存不足而被系统给回收掉。

<br>**何时才能被杀死？**
　　Activity的三个方法`onPause()`,`onStop()`和`onDestroy()`被调用后，Activity都可能因为在系统内存不足的情况被回收掉，所以Activity一旦被创建，在进程被杀死前能够保证被调用的最后的方法就是`onPause()`，而`onStop()`和`onDestroy()`方法就`可能不被调用了`。因此，你应该使用`onPause()`方法来写关键的持久化数据代码用于保存数据。但是，你应该选择在`onPause()`期间什么信息是必须保留的，因为在这个方法中的任何处理都会锁定系统向下一个Activity转换，如果处理比较慢会影响流畅的用户体验。
　　正常情况下，当除上述三个方法以外的方法被调用后，系统是无法强行回收Activity的内存。特殊的情况将在后面章节中介绍。

<br>
# 第四节 状态保存 #
　　在前面一节中简单的提到，Activity被`pause`或`stop`时，它的状态是被保留的。因为Activity被`pause`或`stop`时它依然被保留在内存中，所有的关于它的成员和当前状态的信息依然存活着，这样用户对Activity做出的任何改变都被保留以便它返回前台时，那些改变依然存在。
　　但是当系统为了回收内存而销毁一个Activity时，这个Activity对象就被销毁了，由于Activity对象里包含了许多用户自定义的字段，因此随后系统不能简单的将它恢复到完整的状态。但是，当用户又导航返回到这个Activity了，系统就必须重新创建它。然而，对于被系统销毁的Activity的重建过程，用户是感知不到的，因此，用户可能预期Activity是先前的状态一样的(同时Activity内的各个字段依然有值)。在这种情况下，你能够通过实现保存Activity状态信息的回调方法（`onSaveInstanceState()`）来确保Activity的重要信息得到保存。
　　系统在Activity被销毁之前会调用`onSaveInstanceState()`方法。 系统给这个方法传递一个`Bundle对象`，在这个对象中，能够使用`putString()`和`putInt()`等名/值对的方法来保存Activity的状态信息。然后，如果系统杀死了你的应用进程，而用户又导航回到了这个Activity，系统会重建这个Activity，并且给`onCreate()`和`onRestoreInstanceState()`方法传递这个Bundle对象。使用这些方法，你能够从Bundle对象中提取你保存的状态信息，并且恢复Activity的状态。如果没有需要恢复的状态信息，那么会传递给你一个null的Bundle的对象（Activity首次被创建时，这个Bundle对象是null）。

　　　　　　　　　　　![状态保存回调方法](/img/android/android_2_2.png)

　　注：在Activity被销毁之前不能保证`onSaveInstanceState()`方法被调用，因为有些场景中不需要保存状态（如用户使用`“回退”`键退出Activity时，因为用户明确的要关闭Activity就不需要保存状态了）。如果系统需要调用`onSaveInstanceState()`方法，则会在`onStop()`方法和`onPause()`方法之前调用，`onRestoreInstanceState()`方法会在`onResume()`之前被调用。

　　但是，即使你什么也没做并且也没有实现`onSaveInstanceState()`方法，通过Activity类默认的`onSaveInstanceState()`方法也能恢复Activity的某些状态。特别是布局中的每个View默认的实现都会调用相应的`onSaveInstanceState()`方法，它允许每个View提供它自己的应该被保存的信息。在Android框架中几乎每个`Widget`都对这个方法做了适当的实现，如当Activity被重建时，UI的任何可见属性的改变都被自动的保存和恢复。例如，EditText控件保存用户输入的任何文本、CheckBox控件保存是否被Check。需要你做的工作只是给每个要保存状态的可视控件提供一个唯一的ID（使用`android:id`属性）即可。如果可视控件没有唯一ID，那么系统就不保存它们的状态。
　　尽管`onSaveInstanceState()`的默认实现保存了界面中有用的信息，但是你仍然可能需要重写这个方法来保存额外的信息，如，你可能需要在Activity生存期间改变的时候保存其内成员值（在UI控件中相关的值可能被恢复，但默认情况下，拥有这些UI值的成员变量不会被恢复）。
　　因为`onSaveInstanceState()`方法的默认实现是帮助保存UI的状态，如果为保存额外的状态信息而重写这个方法，你应该在做任何工作之前首先调用其父类的`onSaveInstanceState()`方法实现。同样如果要重写`onRestoreInstanceState()`方法，你也应该首先调用这个方法的父类实现，以便默认的实现能够恢复View状态。

　　注：因为`onSaveInstanceState()`不保证被调用，因此你应该只使用它来记录Activity的状态变换（用户界面的状态），而不要用它来保存持久化数据 (用户通过back键返回时不会导致此方法被调用) 。相反，在用户离开Activity时，你应该使用`onPause()`方法来保存持久化数据（如应该保存到数据库中的数据）。

　　可以通过旋转设备，让设备的屏幕改变方向来测试你的应用程序状态的恢复。当屏幕的方向改变时，系统为了给新的屏幕配置选择有效的应用资源会销毁Activity并且重建一个新的Activity。仅仅因为这个原因，在Activity被重建时完全恢复它们的状态是至关重要的，因为用户在使用应用程序时会经常旋转屏幕。

<br>　　范例1：Activity类。
``` android
	public class android.app.Activity extends ContextThemeWrapper {
     // 在Activity被动的摧毁或停止的时候调用(用户主动点击键盘的回退键时不会调用此方法)，用于保存运行数据，可以将数据
     // 保存在Bundle中。此方法会在pause方法之前调用。
	    protected void onRestoreInstanceState (Bundle savedInstanceState){}

     // 该方法在Activity被重新绘制的时候调用，例如改变屏幕方向。在onresume之前调用。
     // 参数outState： Activity的onCreate方法中的参数也是onSaveInstanceState方法的同一个Bundle对象。
	    protected void onSaveInstanceState (Bundle outState){}
	}
```

## 处理配置的改变 ##
　　某些设备配置能够在运行期间改变（如屏幕方向、键盘的可用性、语言等）。当这些改变发生时，Android会重建正在运行的Activity（系统调用`onDestroy()`方法后，立即调用`onCreate()`方法）。
　　但是你也可以修改这个默认的行为，从而阻止系统重启你的Activity，即告诉系统由Activity自己来处理配置变化。

　　只需要设置清单文件的`<activity>`元素的`android:configChanges`属性，为你要处理的配置即可。
　　最常用的值是`orientation`(处理当屏幕的方向变化)，`keyboardHidden`(处理键盘可用性改变)，多个配置的值之间通过`“|”`符号将它们分隔开。
　　例如，以下代码声明了Activity中将同时处理屏幕的方向变化和键盘的可用性变化：
``` xml
<activity android:name=".MyActivity"
    android:configChanges="orientation|keyboardHidden"
    android:label="@string/app_name">
```
　　当这些配置中的一个发生改变时，MyActivity不会重新启动。相反，这个Activity会接收`onConfigurationChanged()`方法的调用。这个方法传递一个`Configuration`类的对象来表示新的设备配置。通过读取`Configuration`对象的字段，你可以更新你的界面。当这个方法被调用时，你的Activity的`Resources`对象会被更新并返回一个基于新配置的`Resources`对象，因此你可以在不用系统重启你的Activity的情况下很容易地重置你的UI元素。

　　注意：从`Android3.2`(`API level 13`)开始，当屏幕在横竖屏间切换时也会导致`“screen size”`改变，如果你想在`APILevel 13`或更高的版本中防止运行时重启Activity，你必须同时包含`“screen size”`和`“orientation”`两个值。你也可以将项目的`targetSdkVersion`值设置为`12`或者更低，这样仅设置`orientation`即可。

　　例如，接下来的`onConfigurationChanged()`方法中实现了检查硬件键盘的可用性和当前设备的方向：
``` android
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // Checks the orientation of the screen
    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
    } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
        Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
    }
}
```
　　另外，不论你是同时设置`“screen size”`和`“orientation”`还是将`targetSdkVersion`设置为`<=13`，他们都只是会阻止Activity的重建，但并不会阻止屏幕的横竖屏切换。 
　　如果你想让Activity支持横屏或竖屏二者之一，那么应该使用`android:screenOrientation`属性。

## 协调Activity ##
　　当一个Activity启动另一个Activity时，它们的生命周期都会发生变化。第一个Activity被pause和stop（如果它在新Activity的后面依然对用户可见，则不会被stop）时，另一个Activity就会被创建。
　　特别是当在同一个进程中的两Activity之间切换时，生命周期回调的顺序都被很好的定义了。以下是Activity A启动Activity B是发生的操作。

	1.  ActivityA的onPause()方法被执行；
	2.  ActivityB的onCreate()、onStart()、和onResume()被顺序执行（现在ActivityB有用户焦点）；
	3.  如果ActivityA不再屏幕上显示，它的onStop()方法就会被执行。

　　生命周期回调的可预见顺序允许管理两个Activity之间的交换信息。例如，当第一个Activity被暂停时你必须把数据写到数据库中以便下一个Activity能够读取它，那么你就应该在onPause()方法执行期间把数据写入数据库，而不是在onStop()方法执行期间。

<br>
# 第五节 Fragment #
　　Android在3.0中引入了`fragments`的概念。Android3.0是基于Android的平板电脑专用操作系统。
## 背景介绍 ##
<br>**问题是这样的：**
　　在一个小屏幕的设备上，一个activity通常占据了整个屏幕，其内显示各种UI视图组件。但是当一个activity被显示在一个大屏幕的设备上时，例如平板电脑，总会显得有些不适应。因为平板的屏幕太大了，UI组件会被拉长、模糊。
　　若想使activity的UI组件在大屏幕中美观且充满整个屏幕，则就需要在其内添加更多的组件，但是这样一来，视图的层次结构就很复杂了。
　　虽然如此，但层次结构复杂也许并不是问题的关键。由于activity之间是相对`“独立”`的(它们各自管理着自己的组件)，对于两个功能相似的activity来说，他们UI界面也会高度相仿，这也就意味着代码的重复量会大大增加(这个问题也存在于手机设备上，只不过在大屏幕设备上更为突出而已)。
　　既然Android3.0是平板电脑的专用操作系统，那么这个问题必然要去解决。因此为了支持更加动态和灵活的UI设计，Android在3.0中引入了`fragments`的概念。

<br>**是什么？**
　　解决冗余最好的方法就是把各功能相似的activity中那块相似的部分(组件)抽取出来，然后封装成一个类，以后就可以在需要使用的时候实例化一个对象放入activity即可。
　　在Android3.0中Google已经帮我们封装好了这个类，即`Fragment`。也就是说`Fragment`的作用就是用来封装各activity中公用的组件，以便代码重用。

　　既然已经知道了Fragment的作用，那么接下来说说它的特点：

	-  Fragment可以将多个组件封装成一个整体，但它本身却不是继承自View类。
	-  Fragment必须总是被嵌入到一个Activity中，它无法单独使用。
	-  Fragment更像一个容器，它的存在就是为了将多个组件打包在一起，它本身无法被直接显示。
	-  Fragment有它自己的生命周期，接收属于它的输入事件，并且我们可以在Activity运行期间动态的向Activity中添加和删除Fragment。
	-  Fragment的生命周期直接被其所属的宿主activity的生命周期影响。
　　一个Activity中同时可以嵌入多个Fragment(如下图-左)，并且由于`Fragment`仅仅是一个普通的容器，因此可以在多个Activity中嵌入相同的Fragment。
　　第二点特别重要, 因为这允许你将你的用户体验适配到不同的屏幕尺寸。举个例子,你可能会仅当在屏幕尺寸足够大(例如平板电脑)时,在一个Activity中包含多个`Fragment`,并且,当不属于这种情况(例如手机)时则只包含一个`Fragment`，并在事件触发时启动另一个包含其他`Fragment`的Activity，(如下图-右)。

　　　　　　　　　![Fragment](/img/android/android_2_3.png)
　　将一个`Fragment`作为Activity布局的一部分添加进来时, `Fragment`处在Activity的`viewhierarchy`中的`ViewGroup`中,并且定义有它自己的view布局。

## 基本应用 ##
　　要创建一个Fragment,必须创建一个Fragment的子类 (或者继承自一个已存在的它的子类)。Fragment类的代码看上去有点象Activity，它包含了类似Activity的的回调方法，如`onCreate()`、`onStart()`、`onPause()`和`onStop()`方法。实际上，如果你正在把一个既存的Android应用程序转换成使用Fragment的应用程序，你只需简单的把Activity的回调方法的代码移到各自的Fragment的回调方法中。
　　注：Fragment类是在Android3.0中提供的，若想在`Android2.x`平台上使用Fragment类则需要添加`android-support-v4.jar`库（后述）文件。

<br>**Fragment的子类**

	-  DialogFragment 用于显示一个浮动的对话框。
	-  用这个类来创建一个对话框,是使用在Activity类的对话框工具方法之外的一个好的选择,因为你可以将一个fragment对话框合并到activity管理的fragment back stack中,允许用户返回到一个之前曾被摒弃的fragment。
	-  ListFragment类似于ListActivity，它提供一些方法来管理ListView, 例如 onListItemClick()回调来处理点击事件。
	-  PreferenceFragment是一个显示Preference对象的层次结构的列表, 类似于PreferenceActivity。这在为你的应用创建一个“设置”activity时有用处。

<br>**创建Fragment**
<br>　　范例1：MyFragment。
``` android
public class MyFragment extends Fragment{
	//TODO method and field
}
```

　　由于3.0版本之前的Activity类不支持Fragment这个类，因此在`android-support-v4.jar`中Google使用`FragmentActivity`来对Activity的功能进行了增强。若你项目的SDK版本低于Android3.0，则需要添加android-support-v4.jar包，并且要让你的Activity继承`FragmentActivity`类。
　　FragmentActivity的父类就是Activity。


　　Fragment通常用来作为Activity的用户界面的一部分,其内封装的layout会被放入Activity中。
　　那么应该如何给Fragment提供一个layout呢?
　　实现Fragment类的`onCreateView()`回调方法即可，该方法是Fragment的生命周期方法之一，当Activity需要Fragment绘制它自己的layout的时候，就会调用它。此方法的实现代码必须返回Fragment的layout的根view。

<br>　　范例2：返回View。
``` android
public static class MyFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.example_fragment, null);
    }
}
```

	语句解释：
	-  如果你的Fragment是ListFragment的子类，它的默认实现是返回从onCreateView返回一个ListView，所以一般情况下不必实现它。
	-  从onCreateView返回的View，也可以从一个xml layout资源文件中读取并生成。为了帮助你这么做，onCreateView提供了一个LayoutInflater对象。
	-  传入onCreateView的container参数是你的fragment layout将被插入的父ViewGroup(来自activity的layout)，savedInstanceState参数是一个Bundle，如果fragment是被恢复的，它提供关于fragment的之前的实例的数据。

<br>**添加入Activity中**
　　通常地Fragment为宿主Activity提供UI的一部分，被作为Activity的整个`view hierarchy`的一部分被嵌入。创建完Fragment后，接下来就要将它添加到Activity中进行显示。
　　但是由于Fragment本身并不是View的子类，我们无法通过`addView`等方法将其直接放入到Actvity中。
　　虽然如此，但是还是有2种方法可以添加一个Fragment到activity layout。

<br>　　第一种，在Activity的layout文件中声明<fragment>标签，可以像View一样指定layout属性。
``` android
<fragment
    android:id="@+id/myFragment"
    android:name="com.example.androidtest.MyFragment"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
```
　　`<fragment>`中的`android:name`属性指定了在layout中实例化的Fragment类。
　　当系统创建这个activity layout时,它实例化每一个在layout中指定的`<fragment>`标签,并调用每一个Fragment的onCreateView()方法,来获取每一个Fragment的layout。系统将会把从Fragment返回的View直接插入到`<fragment>`元素所在的地方。
　　另外，每一个Fragment都需要一个唯一的标识，以便在程序中方便的引用Fragment。有3种方法来为一个Fragment提供一个标识：

	-  为android:id属性提供一个唯一ID。
	-  为android:tag属性提供一个唯一字符串。
	-  如果以上2个你都没有提供, 系统使用Fragment所在的容器view的ID。

<br>　　第二种，在Activity运行的任何时候，都可以通过Google提供了另一个类`FragmentManager`来操作和管理Fragment。有两种方式可以获取到`FragmentManager`的实例：

	-  若项目的SDK版本为3.0以上，则通过Activity的getFragmentManager()方法获取。
	-  若项目的SDK版本低于3.0，则通过FragmentActivity的getSupportFragmentManager()方法获取。

<br>　　范例3：FragmentManager类。
``` android
public abstract class FragmentManager extends Object {
    // 开启一个事务，之后对Fragment的操作都是在这个事务对象进行的。
    public abstract FragmentTransaction beginTransaction(){}

    // 指定Fragment的id或tag，从当前FragmentManager对象中查找出Fragment对象。
    public abstract Fragment findFragmentById(int id){}
    public abstract Fragment findFragmentByTag(String tag){}
}
```
　　FragmentManager对象是隶属于Activity的。

	-  不论是Android3.0之后的Activity类还是FragmentActivity类，在它们的内部都定义了一个FragmentManager类型的属性，它管理着所有嵌入到其宿主Activity内的Fragment对象。
	-  由于一个Activity中可以嵌入多个Fragment，为了方便高效的编辑这些Fragment对象，Android采用了“事务提交”的方式。
	-  每当需要编辑Activity中的某个Fragment时，都要先开启一个事务。然后在事务对象上执行编辑操作(如add、remove、replace等)，执行完毕所有的编辑后再一次性的提交给Activity去更新界面。
	-  我们也可以保存每一个事务到一个activity管理的backstack,允许用户经由Fragment的变化往回导航(类似于通过activity往后导航)。

<br>　　范例4：FragmentTransaction类。
``` android
public abstract class FragmentTransaction extends Object {
    // 将参数fragment对象添加到Activity的布局中containerViewId组件下。
    // containerViewId所指向的组件必须是ViewGroup类型的，否则抛异常。
    public abstract FragmentTransaction add(int containerViewId, Fragment fragment){}

    // 删除containerViewId下面的fragment对象，然后将参数fragment对象放到containerViewId下面。
    // 若containerViewId下面有多个fragment对象，则删除最先找到的那个。
    // tag：为参数fragment指定的tag。
    public abstract FragmentTransaction replace(int containerViewId, Fragment fragment, String tag){}

    // 调用此方法相当于调用其重载方法replace(containerViewId, fragment,null) 即参数tag的值为null。
    public abstract FragmentTransaction replace(int containerViewId, Fragment fragment){}

    // 提交事务。
    // 事务中包含的操作不会立刻生效，事务会被放入到创建当前事务对象的FragmentManager对象所在Activity类的mHandler
    // 属性中，等待被主线程处理。但你可以从你的UI线程调用executePendingTransactions()来立即执行由commit()提交的事
    // 务. 但这么做通常不必要,除非事务是其他线程中的job的一个从属。
    public abstract int commit(){}
}
```

<br>　　范例5：添加Fragment。
``` android
public class MyActivity extends FragmentActivity{
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 添加Fragment
        MyFragment f = new MyFragment();
        FragmentManager mgr = getSupportFragmentManager();
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout,f);
        trans.commit();
    }
}
```
	语句解释：
	-  本范例是通过继承FragmentActivity类来实现的。执行完毕编辑操作后，若不调用commit()方法则事务是永远不会生效的。
　　`trans.add(R.id.layout,f)`将Fragment对象添加到Activity的组件下，此语句等价于：
``` android
		ViewGroup container = (ViewGroup)activity.findViewById(R.id.layout);
		container.addView(f.mView);
```
　　其中`f.mView`就是Fragment内部所封装的View。

<br>**事务回滚**
　　事务是支持回滚的，即撤销上一步操作。 
　　在FragmentManager中维护了一个`事务栈`。我们可以在事务对象提交(`commit`)之前，设置是否要将该事务放在事务栈中。 当用户在Activity中按下`back`键时，会撤销栈顶的事务所做出的修改。

<br>　　范例6：添加Fragment。
``` android
public class MyActivity extends FragmentActivity{
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FragmentManager mgr = getSupportFragmentManager();
        MyFragment f = new MyFragment();
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout, f);
        trans.addToBackStack(null);
        trans.commit();
    }
}
```
	语句解释：
	-  本范例添加了一个Fragment，并调用addToBackStack()方法来标识事务对象需要被加入事务栈。
	-  当BACK键被按下时Fragment就会被从Activity中移除，并将该事务从栈中移除。当事务栈为空时，Activity将不会再拦截BACK键事件。
	-  如果添加多个变化到事务(例如add()或remove())并调用addToBackStack(),然后在你调用commit()之前的所有应用的变化会被作为一个单个事务添加到后台堆栈, BACK按键会将它们一起回退。

<br>　　范例7：替换Fragment。
``` android
public class MyActivity extends FragmentActivity{
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentManager mgr = getSupportFragmentManager();
        // 第一个fragment。
        MyFragment f = new MyFragment("AA");
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout, f);
        trans.addToBackStack(null);
        trans.commit();
        // 第二个fragment。		
        MyFragment f2 = new MyFragment("BB");
        FragmentTransaction trans2 = mgr.beginTransaction();
        trans2.add(R.id.layout, f2);
        trans2.addToBackStack(null);
        trans2.commit();
        // 第三个fragment。
        MyFragment f3 = new MyFragment("CC");
        FragmentTransaction trans3 = mgr.beginTransaction();
        trans3.replace(R.id.layout, f3);
        trans3.addToBackStack(null);
        trans3.commit();
    }
}
```
	语句解释：
	-  如果添加多个Fragment到同一个容器, 那么添加的顺序决定了它们在view hierarchy中显示的顺序。 因此f会被放到f2的前面显示。
	-  本范例使用replace方法会将f给删除，并将f3添加到R.id.layout的末尾位置。
	-  本范例的三个事务都被加入到事务栈中，当第一次按下BACK键时，f3会被移除，f会被还原。 注意：f会被还原到f3的位置，而不是f2的前面。也就是说，对于addToBackStack()方法，它只会记录fragment的操作，而不会记录fragment当时的位置。当执行还原的时候，会将fragment放到containerView的末尾。

<br>　　范例8：删除Fragment。
``` android
public class MyActivity extends FragmentActivity{
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentManager mgr = getSupportFragmentManager();

        // ...  此处省略了范例7中的代码。

        FragmentTransaction trans4 = mgr.beginTransaction();
        trans4.remove(f);
        trans4.addToBackStack(null);
        trans4.commit();
    }
}
```
	语句解释：
	-  当按下BACK键时，f会被还原。即f会被还原到f3的后面，而不是f2的前面。
	-  对于每一个Fragment事务, 你可以应用一个事务动画,通过在提交事务之前调用setTransition()实现。

<br>**为Activity创建事件回调方法**
　　在一些情况下, 你可能需要一个Fragment与Activity分享事件。 一个好的方法是在Fragment中定义一个回调的`interface`, 并要求宿主Activity实现它。当Activity通过interface接收到一个回调, 必要时它可以和在layout中的其他Fragment分享信息。
　　例如，如果一个新的应用在Activity中有2个Fragment，一个用来显示文章列表(framgent A)，另一个显示文章内容(fragment B)。 Framgent A必须告诉宿主Activity何时一个list item被选中，然后宿主Activity就可以转告诉FragmentB去显示文章。
　　在这个例子中, OnArticleSelectedListener 接口在Fragment A中声明：

<br>　　范例9：定义回调接口。
``` android
public class FragmentA extends ListFragment {
    // Container Activity must implement this interface
    public interface OnArticleSelectedListener {
        public void onArticleSelected(int position);
    }
}
```
　　然后FragmentA的宿主Activity实现`OnArticleSelectedListener`接口，并覆写抽象方法。当`onArticleSelected()`被调用时，宿主Activity就可以通知FragmentB，并将FragmentA传来的数据转给FragmentB。
　　为了确保宿主Activity实现这个接口, 当FragmentA的`onAttach()`方法被调用 (此方法是生命周期方法之一，后述) 时，可以将作为参数传入`onAttach()`的Activity做类型转换来实例化一个OnArticleSelectedListener实例。
``` android
public class FragmentA extends ListFragment {
    // Container Activity must implement this interface
    public interface OnArticleSelectedListener {
        public void onArticleSelected(int position);
    }

    OnArticleSelectedListener mListener;
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnArticleSelectedListener) activity;
         } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement OnArticleSelectedListener");
        }
    }
}
```
　　若宿主Activity没有实现接口, 则Fragment就会抛出`ClassCastException`异常。
　　正常情形下，mListener成员会保持一个到Activity的OnArticleSelectedListener实现的引用，因此FragmentA可以通过调用在OnArticleSelectedListener接口中定义的方法分享事件给宿主Activity。

　　例如, 如果Fragment A是一个`ListFragment`的子类, 每次用户点击一个列表项, 系统调用在Fragment中的onListItemClick(),然后后者调用 onArticleSelected() 来分配事件给Activity。
``` android
public class FragmentA extends ListFragment {
    // Container Activity must implement this interface
    public interface OnArticleSelectedListener {
        public void onArticleSelected(int position);
    }

    OnArticleSelectedListener mListener;
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnArticleSelectedListener) activity;
         } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement OnArticleSelectedListener");
        }
    }

    public void onListItemClick(ListView l,View v,int position,long id){
        // Send the event and Uri to the host activity
        mListener.onArticleSelected(position);
    }
}
```

## 生命周期 ##
　　Fragment有自己的生命周期，并且生命周期直接被其所属的宿主Activity的生命周期影响。当Activity被暂停，那么在其中的所有Fragment也被暂停；当Activity被销毁，所有隶属于它的Fragment也被销毁。

　　管理Fragment的生命周期，大多数地方和管理Activity生命周期很像，和Activity一样, Fragment可以处于3种状态：

	-  Resumed：在运行中的Activity中Fragment可见。
	-  Paused： 另一个Activity处于前台并拥有焦点, 但是当前Fragment所在的Activity仍然可见(前台activity局部透明或者没有覆盖整个屏幕)。
	-  Stopped：要么是宿主activity已经被停止, 要么是Fragment从Activity被移除但被添加到后台堆栈中。 停止状态的Fragment仍然活着(所有状态和成员信息被系统保持着)。 然而,它对用户不再可见,并且如果Activity被干掉,它也会被干掉。

　　Fragment生命周期各个阶段回调的方法如下图(左)，Fragment和Activity的生命周期方法对应关系图(右)：
　　　　　　　![](/img/android/android_2_4.png)　　　　　![](/img/android/android_2_5.png)
　　和Activity一样, 你可以使用Bundle保持Fragment的状态，万一Activity的进程被干掉，并且当Activity被重新创建的时候，你需要恢复Fragment的状态时就可以用到。
　　在Fragment的`onSaveInstanceState()`期间保存状态，并可以在`onCreate()`，`onCreateView()`或`onActivityCreated()`期间恢复它。


　　生命周期方面Activity和Fragment之间最重要的区别是各自如何在它的后台堆栈中储存。在默认情况下，Activity在停止后，它会被放到一个由系统管理的用于保存Activity的后台堆栈(因此用户可以使用`BACK`按键导航回退到它)。然而，仅当你在一个事务期间编辑Fragment时,显式调用`addToBackStack()`请求保存实例时，Fragment才被放到一个由宿主Activity管理的后台堆栈。
　　管理Fragment的生命周期和管理Activity生命周期非常类似。
　　因此，"Activity的生米周期"中的相同实践也同样适用于Fragment。你需要理解的是,  Activity的生命如何影响Fragment的生命。

<br>**各声明周期方法的调用**
　　Fragment所生存的Activity的生命周期，直接影响Fragment的生命周期，每一个Activity的生命周期的回调行为都会引起每一个fragment中类似的回调。
　　例如，当Activity接收到onPause()时，Activity中的每一个Fragment都会接收到onPause()。
　　Fragment 有一些额外的生命周期回调方法, 那些是处理与Activity的唯一的交互,为了执行。

<br>　　**onAttach()**
　　当Fragment通过事务对象被绑定到Activity时被调用(宿主Activity的引用会被传入)。在onAttach()方法被调用后，其宿主Activity的onAttachFragment()方法将被调用。

<br>　　**onCreate()**
　　通常情况下，在宿主Activity的onAttachFragment()方法将被调用后，会调用Fragment的onCreate方法。

<br>　　**onCreateView()**
　　不论Fragment的onCreate是否调用，都将继续调用onCreateView()方法，在此方法中需要返回Fragment内封装的view的根节点。
　　若onCreateView()方法返回值不为null，则还会导致Fragment的onViewCreated()方法被调用。

<br>　　**onActivityCreated()**
　　若Activity的onCreate()方法已经返回，则此方法将会在onCreateView()方法被调用后而总被调用。

<br>　　**onViewStateRestored()**
　　当Fragment所有保存的状态已经还原完成时，调用此方法。

<br>　　**onStart()、onResume()、onPause()、onStop()**
　　这四个方法的调用情形与Activity一样。

<br>　　**onDestroyView()**
　　当和Fragment关联的view hierarchy被移除之前会调用此方法，此方法返回后就会执行移除操作。

<br>　　**onDestroy()**
　　当Fragment被销毁时被调用。

<br>　　**onDetach()**
　　当Fragment从Activity解除关联时被调用。

## 销毁重建 ##
　　Fragment的生命周期受其宿主Activity的影响。当宿主Activity因为某种原因被摧毁(如手机横竖屏切换、内存不足导致后台Activity被回收等)，但用户再次导航回来时，接着宿主Activity就会执行重建操作，并将自身还原到摧毁之前状态。 在其内部存在的各个Fragment自然也是如此，也会跟随着它执行重建。
　　Activity的重建，简单的说就是重新实例化一个对象，并将之前被摧毁的对象的各种状态设置到新的对象上。 关于重建这一点Fragment和其宿主Activity的操作是一样的。
　　此时就存在一个问题，重建的操作是操作系统来完成的，而重建又需要创建新的对象，那么操作系统是如何实例化我们自己定义的Fragment类的呢?
　　答案就是：通过`反射机制`，并调用无参构造方法。
　　由于通常我们创建自己的类时会依据需要自定义若干个构造方法，而操作系统在重建时只会调用无参的构造器(因为有参的构造器所需要的参数，操作系统是不可以自主的随便提供的，否则程序就乱套了。)
　　因此我们要保证自定义的Fragment类必须要有一个无参的构造方法，以便系统对其重建时调用。
<br>　　那么是系统是如何创建Fragment对象的呢？ 找到Fragment类看到如下代码：
　　　　　![Fragment类代码片段](/img/android/android_2_6.png)
　　通过查看源码（此处省略具体步骤）得知，当Activity被重建时会同时重建其内的每一个Fragment对象。因此必须要为Fragment提供一个无参的构造方法。其实Activity也必须要定义一个无参的构造方法，只是由于Activity的实例通常由操作系统来创建，所以我们以前并没有涉及到此问题。

<br>**实例化的方法**
　　现在我们又遇到一个问题： 很多时候我们需要在实例化Fragment的同时为其传递一些参数，而系统在重建Fragment时只会调用无参的构造方法，也就跳过传参的这一步骤，这必然会导致程序出问题。
　　这该怎么解决呢?  
　　做为一个应用程序员，首先可以确定是我们是不会去改变Fragment类的，因此解决的方法就是，我们也通过Fragment的无参构造方法来实例化Fragment。 然后再想其它办法将参数设置到Fragment中。
　　为了传递参数给Fragment，我们必须要找一个对系统和我们来说都可以执行方法。比如我们虽然可以通过getter、setter方法，在Fragment对象创建完毕后，将参数设置到Fragment中，但是系统在重建Fragment的时候，却不可能去调用getter、setter方法，因此通过getter、setter设置参数的方法是行不通的。
<br>　　这个问题Fragment已经替我们解决了，Fragment类有一个属性名为`mArguments`，它是Bundle类型的。
``` android
// Construction arguments;
Bundle mArguments;
```
　　当我们构造完Fragment对象后，可以将需要传递给Fragment的参数放到这个`Bundle`对象中。这样即便是随后Fragment对象被摧毁了也没关系，因为系统会将Fragment的`mArguments`属性的值保存起来，当重建的时候也会将mArguments属性的值给还原。
<br>　　因此对于Fragment的初始化操作，我们通常的写法是这样的：
``` android
public class MainActivity extends FragmentActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentTransaction trans = getSupportFragmentManager().beginTransaction();
        trans.add(R.id.rootView, MyFragment.getInstance("Hi World"));
        trans.commit();
    }
}
```
	语句解释：
	-  当按下BACK键时，f会被还原。即f会被还原到f3的后面，而不是f2的前面。

<br>　　范例2：MyFragment。
``` android
public class MyFragment extends Fragment {
    private String property;
    public static MyFragment getInstance(String property) {
        MyFragment f = new MyFragment();
        Bundle data = new Bundle();
        data.putString("property", property);
        f.setArguments(data);
        return f;
    }
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        property = getArguments().getString("property");
    }
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        TextView text = new TextView(inflater.getContext());
        text.setText(property);
        return text;
    }
}
```
	语句解释：
	-  前面说了Activity重建的时候是通过反射机制来实例化每个Fragment的。因此我们自定义的Fragment类必须是public修饰的。并且若Fragment是某个类的内部类，则其还必须是static的。

<br>**重写方法**
　　让Fragment重写`onSaveInstanceState(Bundle outState)`方法，并将需要保存的数据存入Bundle对象中即可。该方法将在Fragment的onPause()方法之前被调用。
　　在onCreate方法中有一个Bundle类型的参数，若之前保存了数据，则该参数将不为null。
　　在屏幕进行横竖屏切换保存Activity状态的时候，需要注意的是：
　　在FragmentActivity或`SDK3.0`以后的Activity类中的`onSaveInstanceState(Bundle outState)`会同时保存`FragmentManager`管理的后台栈中的数据。也就是说，在还原数据的时候也会将之前Activity的栈中的数据还原到新`FragmentActivity`中。

　　问题：fragment在viewpager中被切换走， stop方法会被调用吗？

<br>
**本节参考阅读：**
- [Fragments (Android官方文档中文版)](http://www.eoeandroid.com/thread-71642-1-1.html)
- [Android之Fragment（官网资料翻译）](http://blog.csdn.net/aomandeshangxiao/article/details/7671533)

<br>
# 第六节 Task #
　　应用程序通常包含了多个Activity，每个Activity都会为用户提供不同功能，并且能够启动其他的Activity (甚至能够启动设备上其他应用程序中存在的Activity)，比如通过Intent来打开浏览器、短信等Activity。

## 基础知识 ##
　　在Android中，使用Task来组织应用程序的所有Activity。Task中的Activity被保存在一个回退栈(`back stack`)中。Back Stack中的各个Activity按照栈的特点`“后来居上、后进先出”`依次被被安排在栈中。
　　默认情况下，一个应用程序中的所有Activity处于同一个Task中。
　　当一个Activity被创建时，就会被压入到Task的栈顶，当其内销毁时，就会从栈顶移除。 应用程序启动的时候，Android系统会将程序的主Activity压入Task栈底。在用户点击了键盘上的`“Back”`按钮或手动调用finish()方法等情况导致Activity被销毁时，该Activity才会被从栈顶弹出。
　　即通常一个应用程序对应一个Task ，在操作系统中同一时间上会存在多个Task。

<br>　　范例1：图示。
　　说明：在本图中，显示了如何把Task中的每个新的Activity添加到back stack中。在用户按下回退按钮时，当前Activity被销毁，并且前一个Activity被resume：
　　　　　　　　![Task](/img/android/android_2_7.png)
　　第四个图形描述的是Activity3从Task中被弹出。
　　如果用户继续按回退按钮，那么堆栈中的每个Activity会被依次弹出，前一个Activity会被显示，直到用户返回主屏（或者返回到Task开始时运行的那个Activity）。当所有的Activity从堆栈中被删除时，这个Task就不再存在了。

<br>　　范例2：前台与后台。
　　Task有前台和后台之分，当某个应用程序被用户切换到前台时，该应用程序所对应的Task也将会被移动到前台。
　　　　　　　　　　　　　　　　　　![前台与后台Task](/img/android/android_2_8.png)
　　上图描述的内容为：TaskB处于前台、TaskA处于后台。

	-  前台Task：当前正在前台执行的应用程序(正在和用户交互) ,其所拥有的Task也在前台。
	-  后台Task：当前不再前台执行的应用程序。
　　提示：虽然后台可以存在多个Task，但是当系统内存不足时，后台Task中的Activity所占据的内存可能被回收。 在系统中同一时间可能存在多个后台Task ，但只能有一个前台Task。

<br>**多任务**
　　一个Task能够返回到前台，以便用户能够取回他们离开时的状态。例如，假设当前Task A在它的堆栈中有三个Activity。用户按下主页(Home)按钮，然后从应用程序启动器中启动一个的新的应用。当这个新的应用在主屏中显示时，任务A就会被转移到后台。在新的应用启动时，系统会给这个应用启动一个带有自己的Activity堆栈的任务B。跟这个任务B的应用交互完毕后，用户再次返回到主页(Home)，并且选择了最初启动任务A的应用。现在，任务A会返回到前台---它的堆栈中所有的三个Activity是完整的，并且在堆栈顶部的Activity被恢复。在这个时点，用户也能够通过主页按钮和选择启动任务B的应用的图标返回到任务B（或者通过触屏和控制主页按钮来显示最近的任务，并选择其中之一）。这就是基于Android的多任务的例子。
　　注意：后台中可以同时拥有多个任务，但是如果用户同时运行了很多后台任务，系统为了回收内存可能开始销毁一些后台的Activity，从而导致Activity的状态丢失。

　　由于回退堆栈中的Activity不曾被重新排列，因此如果你的应用程序允许用户从多个其他Activity中启动一个的Activity，那么每次都会创建一个新的Activity实例，并且会被压入到栈顶（而不是把之前的Activity实例带到堆栈的顶端）。这样在你的应用程序中一个Activity就可能被实例化多次（甚至来自不同任务）。如图所示：
　　　　　　　　　　　　　　　　　　　　　　　　![](/img/android/android_2_9.png)
　　这样，如果用户使用回退按钮向后导航，那么Activity的每个实例就按照被打开顺序依次显示（每一个都带有自己的UI状态）。但是如果你不想让一个Activity被实例化多次，你可以编辑这个行为，如何编辑会在稍后的会讨论。

<br>**Activity和task的默认行为的总结：**

	1. 当Activity A启动Activity B时，ActivityA被stop，但是系统保留了它的状态（如滚动条的位置和录入表单的文本）。如果用户在Activity B中按回退按钮，Activity A会使用被保存的状态来进行恢复。
	2. 当用户通过按主页(Home)按钮离开一个任务时，当前Task的栈顶Activity会被stop，并且Task会被放入后台，但系统会保留Task中每个Activity的状态。如果用户随后通过选择启动图标来恢复这个任务，那么任务会来到前台，并且恢复了堆栈顶部的Activity。
	3. 如果用户按下回退按钮，当前的Activity会从堆栈中被弹出并且被销毁。堆栈中的前一个Activity会被恢复。Activity被销毁时，系统不会保留Activity的状态。
	4. 默认情况下，Activity能够被实例化多次，甚至来自其他任务。

<br>**保存Activity的状态：**
　　在Activity被stop时保留Activity的状态是系统的默认行为。这样，当用户返回到之前的Activity时，用户界面会显示它们离开时的样子。但是在Activity被销毁和重建的场景中应该主动的使用回调方法保留Activity的状态。
　　当系统stop一个Activity时（如一个新的Activity启动或这个任务被转移到后台），如果需要回收系统内存，那么系统可能完全的销毁这个Activity。当这种情况发生时，有关Activity状态的信息就会丢失。即使这种情况发生了，系统依然知道这个Activity在回退堆栈中位置，但是在Activity被带到堆栈的顶部时，系统必须重新创建它（而不是恢复它）。为了避免丢失用户的工作，你应该在Activity中通过实现onSaveInstanceState()回调方法主动的保留状态信息。

## 管理Task ##
　　Android通过把所有的已启动的Activity依次放到同一个后进先出的堆栈里来进行管理，对于大多数应用程序来说这种方法能够很好的工作，并且你不必担心Activity是如何跟任务关联的或者他们是如何存在回退堆栈中的。但是，你可能决定要打破这种通常的行为。或许你想要应用程序中的一个Activity在启动的时候开启一个新的Task（而不是放在当前的Task中）；或者当你启动一个Activity时，你想使用之前既存的实例（而不是在回退堆栈的顶部创建一个新的实例）；或者你想在用户离开这个Task时清除回退堆栈中根Activity以外的所有Activity。
　　你能够使用`<Activity>`清单元素中的属性和传递给startActivity()方法的Intent中的标识来做这些事情，甚至更多。

<br>**Activity元素的主要属性包括：**
- taskAffinity
- launchMode
- allowTaskReparenting
- clearTaskOnLaunch
- alwaysRetainTaskState
- finishOnTaskLaunch

<br>**Intent的主要标识包括：**
- FLAG_ACTIVITY_NEW_TASK
- FLAG_ACTIVITY_CLEAR_TOP
- FLAG_ACTIVITY_SINGLE_TOP

　　在后面的章节中，你会看到怎样使用这些清单属性和Intent标识来定义Activity是如何跟Task关联的以及在回退堆栈中的行为。
　　警告：大多数应用程序都不应该中断Activity和task的默认行为。如果你决定必须编辑Activity的默认行为，就要谨慎使用，并且确保启动期间和使用回退按钮从其他的Activity和任务中返回时这个Activity的可用性。同时确保导航的结果与用户的预期行为一致。

<br>**设置启动模式：**
　　启动模式允许你定义一个新的Activity实例如何跟当前的任务进行关联。使用以下两种方法可以定义启动模式：

	1、 使用清单文件：当在清单文件中声明一个Activity时，你能够指定这个Activity在启动时应该如何跟任务进行关联。
	2、 使用Intent标识：在调用startActivity方法时，你能够在Intent中包含一个标识(flag)，用来声明这个新的Activity应该如何跟当前的任务进行关联。

　　因此，如果Activity A启动Activity B，Activity B能够在它的清单文件中定义它应该怎样跟当前的任务进行关联，并且Activity A也能够请求Activity B应该怎样跟当前的任务进行关联。如果这两个地方都定义了Activity B应该怎样跟当前任务关联，那么Activity A的请求（在Intent中定义的）的优先级要高于Activity B的请求（在清单文件中定义的）。
　　注意：某些在清单文件中有效的启动模式对Intent标识是无效的，同样某些针对Intent标识有效的启动模式也不能在清单文件中定义。

### 使用清单文件 ###
　　在清单文件中声明一个Activity时，你能够使用<activity>元素的`launchMode`属性来指定这个Activity应该怎样跟一个任务关联。该属性会指定一个有关这个Activity应该如何被加载到一个任务中的指令。有四种不同的启动模式能够跟这个属性进行匹配：

<br>　　**standard模式**

	默认模式。
	默认情况下，系统会在当前Task中启动一个新的Activity实例。使用此模式的Activity可以被实例化多次，每个实例可以属于不同的任务，并且一个任务中也可以有多个实例。

<br>　　**singTop模式**

	如果打算启动的Activity的实例在当前任务的顶部已经存在，那么系统就会通过调用onNewIntent方法把这个Intent传递给这个实例，而不是创建一个新的实例。这个Activity可以被实例化多次，每个实例属于不同的任务，并且一个任务可以有多个实例（只有回退堆栈顶部的Activity不是这个既存的Activity的实例时才会有多个实例存在）。
<br>　　例如，假设一个Task的回退堆栈由跟Activity A和Activity B、Activity C以及在顶部的Activity D组成。一个针对D类型Activity的Intent访问，如果D有默认的`standard`启动模式，那么这个类就会有一个新的实例被启动，并且此时堆栈变成A-B-C-D-D的组合。但是如果D的启动模式是`singleTop`，那么既存的D的实例因为它在堆栈的顶部，所以它会接收通过onNewIntent()方法传递的Intent，堆栈仍然保持着A-B-C-D的组合。但是，如果针对访问B类型Activity的Intent，那么即使B类型Activity的启动模式是“singleTop”，也会有一个新的B的实例被添加到堆栈中。
　　注意：当一个新的Activity实例被创建时，用户能够按回退按钮返回到前一个Activity。但是当一个既存的Activity实例处理了一个新的Intent，那么用户不能按回退按钮返回到接受新的Intent访问之前的Activity的状态。

<br>　　在讲解`singleTask`启动模式之前，先说明一下什么是亲缘关系。
<br>　　**亲缘关系(affinities)：**
　　每个Task都有一个`affinity`属性，它相当于Task的唯一标识。如果某个Activity隶属于某个Task，那么我们就说该Activity与该Task具有亲缘关系，处于相同Task的Activity间也具有亲缘关系。默认情况下，来自同一个应用程序的所有的Activity具有相同的亲缘关系。即默认在同一个应用程序中的所有Activity都应该属于同一个Task。
　　在`AndroidManifest.xml`文件中的`<activity>`标签有一个`taskAffinity`的属性，用来指出当前Activity的亲缘关系，取值是一个字符串。 即告诉系统该Activity希望被放到affinity属性的值与其taskAffinity属性相同的Task中。如果没有为此属性赋值，则当前Activity的亲缘关系就是`<application>`标签的taskAffinity属性的值，若`<application>`标签也没有指定taskAffinity属性的值，则就使用默认包名来作为整个程序的亲缘关系。

　　那么亲缘关系在什么情况下会被用到呢?

<br>　　**singleTask模式**
　　当某个Activity启动了一个启动模式为singleTask的Activity时，系统会执行如下操作：

    -  在整个操作系统中当前正在运行的所有Task中进行查找，查找affinity属性值等于启动模式为singleTask的Activity的taskAffinity属性值的任务是否存在。
    -  若不存在，则系统会开启一个新的Task，并将该Activity作为根元素。
    -  若存在，则系统会查看该Task中是否已经存在了该Activity。
       -  若存在，则将该Activity上的所有Activity都给finish掉。并调用该Activity的onNewIntent()方法，将新的Intent传递过去。
       -  若不存在，则在该Task顶部启动该Activity。
　　提示：定义在不同的应用程序中的Activity能够共享一个亲缘关系，或者定义在同一个应用程序的Activity能够使用不同的亲缘关系。

<br>　　范例1：查看所有Task。
``` android
adb shell dumpsys activity
```
　　使用adb命令可以查看当前操作系统中存在的所有Task。
``` android
Running activities (most recent first):
   TaskRecord{44fbd658 #3 A com.example.androidtest}
     Run #1: HistoryRecord{45032428 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　此时系统中有两个Task，若在MainActivity中启动Activity1，在Activity1中启动Activity2，则Task中的情况如下：
``` android
Running activities (most recent first):
  TaskRecord{4500ff48 #4 A com.example.androidtest}
    Run #3: HistoryRecord{450ea0a8 com.example.androidtest/.Activity2}
    Run #2: HistoryRecord{450268f8 com.example.androidtest/.Activity1}
    Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
  TaskRecord{4502d408 #2 A com.android.launcher}
    Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　若修改Activity1的启动模式为singleTask：
``` android
<activity android:name=".Activity1" android:launchMode="singleTask" >
```
　　则在MainAcitivity中启动它后，栈中的情况如下：
``` android
Running activities (most recent first):
   TaskRecord{45008f00 #6 A com.example.androidtest}
     Run #2: HistoryRecord{45040e18 com.example.androidtest/.Activity1}
     Run #1: HistoryRecord{44f8eed0 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　为什么没有新开启一个Task呢?

<br>　　范例2：开启新Task。
　　首先为Activity设置taskAffinity属性的值。
``` android
<activity android:name=".Activity1" android:launchMode="singleTask"
    android:taskAffinity="ni.die" >
```
　　然后在MainAcitivity中启动它，此时系统中的Task情况如下：
``` android
Running activities (most recent first):
   TaskRecord{44f1e948 #8 A ni.die}
     Run #2: HistoryRecord{45028690 com.example.androidtest/.Activity1}
   TaskRecord{4500b308 #7 A com.example.androidtest}
     Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　原因在于，范例1中Activity的taskAffinity属性的值没有设置，因此最终系统将它默认为包名了，这和MainAcitivity所处的Task的affinity属性的值一致，因此并没有新开Task。

　　如果你启动了指定了singleTask启动模式的Activity，然后如果那个Activity的实例存在于一个后台任务中，那么整个任务就会被带到前台。在这个时点，在这个堆栈的顶部，回退堆栈包含了从这个任务中提取的所有的Activity。下图说明这种场景类型：
　　　　　　　　　　　　　![](/img/android/android_2_10.png)
　　本图显示了一个带有`singleTask`启动模式的Activity是怎样被添加到回退堆栈中，如果这个Activity是一个已经存在的拥有自己回退堆栈的后台任务的一部分，那么整个回退堆栈也会被带到前面来，放到当前任务堆栈的顶部。

　　注意，当启动一个即存的具有singleTask模式的Activity时，该Activity所在的Task将会随着该Activity一起被调入到前台中。

<br>　　**singleInstance模式**
　　使用此启动模式的Activity总是单独的并且是它的Task的唯一成员，即若在该Activity中又启动了另外一个Activity，则新启动的Activity将不会和该Activity处于同一个Task中。
　　例如，Android浏览器应用程序通过在<activity>元素中指定singleTask启动模式来声明这个浏览器Activity应该总是在它自己的任务中打开。这就意味着如果你的应用程序发布了一个打开Android浏览器的Intent，那么这个浏览器的Activity不会被放在与你的应用一样的任务中，相反，会启动一个新的浏览器任务，如果这个浏览器已经在后台运行，那么这个任务会被带到前台，以便处理新的Intent。

### 使用Intent ###
　　启动Activity时，你能够通过在传递给startActivity()方法的Intent中包含标识来修改Activity的默认启动模式，使用以下标识能够修改Activity的默认行为：

<br>　　FLAG_ACTIVITY_NEW_TASK：

	在一个新的任务中启动Activity，如果这个正在启动的Activity是一个已经运行的任务，那么这个任务连同最后被保存的状态一起被提取到前台，并且接受onNewIntent方法中的新的Intent。
	这个过程与launchMode属性值等于singleTask时具有同样的行为。
<br>　　FLAG_ACTIVITY_SINGLE_TOP:

	如果正在启动的Activity是当前的Activity（在前台栈的顶部），那么这个既存的实例会接受一个对onNewIntent方法的调用，而不是创建一个新的Activity实例。
	这个过程与launchMode属性值等于singleTop时具有同样的行为。

<br>　　范例1：设置Intent的Flag。
　　首先为Activity设置taskAffinity属性的值。
``` android
Intent intent = new Intent(this,SecondActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
this.startActivity(intent);
```
	语句解释：
	-  在ActivityA启动ActivityB时 ，既可以在A中指定B的启动模式，也可以在B的<activity>标签中指定。若同时指定，则A中指定的启动模式的优先级更高。
	-  在Intent中两种常见模式：
	   -  FLAG_ACTIVITY_NEW_TASK   作用和singleTask相同。 
	   -  FLAG_ACTIVITY_SINGLE_TOP 作用和singleTop相同。 
	-  在非Activity中启动Activity时，必须为Intent设置FLAG_ACTIVITY_NEW_TASK 。如在“服务”中。
　　注意：Intent类包含有很多有用的flag，这些flag的具体作用将在后面章节中专门介绍。

<br>**清除回退堆栈：**
　　如果用户长时间的离开一个任务，那么系统会清除这个任务根Activity以外的所有Activity。当用户再次返回这个任务时，只有根Activity被存储。这样的系统行为是因为经过长时间以后，用户在返回这个任务之前可能已经放弃它们的作业，而开始了某些新的任务。 你能够使用一些Activity属性来修改这种行为：

　　alwaysRetainTaskState

	如果这个属性在一个任务的根Activity中被设置为“true”，那么像上面描述的那样的默认行为就不会发生。即使是长时间之后，这个任务也会在它的堆栈中保留所有的Activity。
　　clearTaskOnLaunch

	如果这个属性在一个任务的根Activity中被设置为“true”，那么无论用户什么时候离开和返回这个任务，堆栈都会被清除到根Activity的位置。换句话说，它与alwaysRetainTaskState属性相反，用户总是返回到任务的初始状态，即使只离开这个任务一会儿。
　　finishOnTaskLaunch

	这个属性有点像clearTaskOnLaunch属性，但是它只操作单个Activity，而不是整个任务。它也能导致任何Activity离开后就会被finish掉，不包括根Activity。当这个属性设置为“true”时，这个Activity只保持着这个任务中当前会话那部分。如果用户离开了当前Task，然后再返回这个任务，那么它就不再存在了。

<br>**启动任务：**
　　你能够通过用`android.intent.action.MAIN`和`android.intent.category.LAUNCHER`分别给Intent过滤器指定行为和类别，从而创建一个Activity作为一个任务的入口。例如：
``` android
<activity
    android:name="org.cxy.tomcat.MainActivity"
    android:label="@string/app_name" >
	<intent-filter>
	       <action android:name="android.intent.action.MAIN" />
	       <category android:name="android.intent.category.LAUNCHER" />
	</intent-filter>
</activity>
```
　　这种类型的Intent会让对应的Activity的图标和标签显示在应用程序启动器中，给用户提供一种启动这个Activity和返回它创建的这个任务（在它被启动的后的任何时候）的方法。
<br>　　第二个能力是重要的，用户必须能够离开一个任务，并且稍后可以通过这个Activity返回这个任务。因此标记Activity始终作为启动一个任务入口的启动模式有两种：`singleTask`和`singleInstance`，它们只应该在Activity有`ACTION_MAIN`和`CATEGORY_LAUNCHER`过滤器时使用。例如，可以想象一下如果缺少了这个过滤器会发生什么情况：一个Intent启动了一个标有singleTask的Activity，初始化了一个新的任务，并且用户花费了一些时间在这个任务中进行工作。然后用户按下Home按钮，这个任务被转到后台并且不再显示。现在因为在应用程序启动器中没有图标展现，用户就没有办法在返回到这个任务中，除非你在主Activity中另外提供了返回的途径。

<br>**提示**

	-  用户能看见某个Activity并不代表该Activity一定获得焦点。 比如Activity_A中弹出了一个对话框风格的Activity_B时。由于对话框的Activity_B比较小，所以在用户屏幕中照样可以看到Activity_A，但是焦点却在对话框风格的Activity_B中。
	-  当对话框风格的Activity_B 部分覆盖Activity_A时，用户执行弹栈操作将B弹出后，只会触发A 的resume方法。
	-  点击键盘上的home键只会调用Activity的pause、stop方法，而不会调用destroy方法。点击回退键则会调用destroy方法。

<br>**再提示**

	-  新Activity出现时，旧Activity会被stop、且其状态将被保存。
	-  当用户点击home键时，当前Task顶部的Activity会被stop，它的状态会被系统保存，Task被调入后台。 当用户通过点击菜单栏的图标再次启动程序时，程序的Task会被调入前台，Task栈顶activity会获得恢复并焦点。
	-  用户按back键时 ，将当前Task栈顶Activity弹出，并释放其资源。前一个Activity将获得焦点。
	-  当Activity被摧毁时，系统不会再保留其状态。 

<br>**还提示**

	-  一个Activity，在某个Task中可以被实例化多次，它也可以同时存在于不同的Task中。
	-  当系统内存资源不足时，系统会回收后台Task中的Activity，此时Activity的状态会被销毁，但是，Activity仍然存在于Task中，当该Task被置为前台，且该Activity处于栈顶时，会执行创建操作，而不是恢复。 即程序将调用其onCreate方法。

<br><br>