title: 入门篇　第一章 Activity
date: 2014-10-30 23:28:28
categories: Android开发 - 青铜
---
　　`Activity`是提供给用户的用于与程序进行交互的界面组件，如打电话、拍照片、发邮件、看地图等。它通过一个窗口来描画它的用户界面，通常这个窗口是全屏的，但是也可以比屏幕小，并且可以浮动在其他窗口的上面。

　　本章会略过`Activity`的基础知识（创建、配置、传参等），请您自行搜索学习。
<br>
# 第一节 生命周期 #
　　Activity从创建到销毁会经历多个阶段，每个阶段都会回调不同的生命周期方法，本节将分两部分来介绍它的生命周期。

## 正常生命周期 ##
　　在正常情况下，Activity会执行下面`7`个生命周期方法：

	onCreate、onStar、onResume、onRestart、onPause、onStop、onDestroy

<br>　　下图说明了这些生命周期方法之间转换可能的路径：

<center>
![Activity的生命周期方法](/img/android/android_2_1.png)
</center>

<br>　　下面将详细介绍这七个生命周期方法。

<br>　　**onCreate()**

	-  当Activity构造方法返回之后，系统会调用这个方法，创建各种全局资源，如设置界面布局等。
	-  在Activity的整个生命周期中，此方法仅会调用一次。

<br>　　**onRestart()、onStart()、onResume()**

	-  onRestart：当Activity从不可见即将变为可见状态时，此方法会被调用。注意上图，一个新创建的Activity不会调用此方法。
	-  onStart：  当Activity已经可见时，此方法会被调用，此时Activity还无法和用户交互。
	-  onResume： 当Activity已经可见且可以和用户交互时，此方法会被调用。

<br>　　**onPause()**

	-  当Activity可见但不能和用户交互时，此方法会被调用。它强调Activity即将不可见，而onStart强调Activity即将可交互。
	-  通常，此方法中会进行数据持久化，终止动画等操作。

　　当在同一个进程中的两`Activity`之间切换时，它们两个的生命周期都会发生变化，以下是`ActivityA`启动`ActivityB`时发生的操作：

	-  ActivityA的onPause方法被执行。
	-  ActivityB的onCreate、onStart、和onResume被顺序执行（现在ActivityB有用户焦点）。
	-  如果ActivityA不再屏幕上显示，它的onStop方法就会被执行。

　　这意味着，在`ActivityA`的`onPause`方法返回之前，`ActivityB`的`onCreate`方法不会被调用，因此请不要在`onPause`方法中执行耗时操作。
　　另外，当操作系统内存不足且需要为高优先级的应用程序分配内存资源时，系统可能销毁处于pause状态的Activity，因此`onPause()`方法是Activity可以保证一定会执行的最后的一个生命周期方法。

<br>　　**onStop()**

	-  当Activity即将不再对用户可见时调用这个方法。有两种情况：
	   -  第一，当前Activity被销毁。
	   -  第二，另一个Activity被显示出来且完全挡住了当前Activity。
	-  注意：当系统内存不足时系统会将已经调用过onPause()方法Activity给回收掉，也就是说此方法不一定会被调用。

<br>　　**onDestroy()**

	-  在Activity被销毁之前调用这个方法，这是Activity收到的最后的调用。
	-  注意：当系统内存不足时系统会将已经调用过onPause()方法Activity给回收掉，也就是说此方法不一定会被调用。


## 异常生命周期 ##
　　上一节我们介绍了`Activity`常见的`7`个生命周期方法，这些方法主要是依靠用户的操作来触发的，比如用户打开一个新的`Activity`，会导致当前界面的`onPause`等方法调用。
　　但是实际开发时，情况会稍微复杂一些，我们还会涉及到其它几个生命周期方法，本节就来介绍一下它们。
<br>
### 设备配置改变 ###
　　当设备配置在运行期间改变（如屏幕方向、语言等）时，系统会重启正在运行的Activity（系统调用onDestroy()方法后，立即调用onCreate()方法）。
　　但是你也可以修改这个默认的行为，从而阻止系统重启你的Activity，即告诉系统由Activity自己来处理配置变化。

<br>　　我们只需要设置清单文件的`<activity>`元素的`android:configChanges`属性即可，该属性最常用的值是`orientation`(处理当屏幕的方向变化)，多个配置的值之间通过`“|”`符号将它们分隔开。例如：
``` xml
<activity android:name=".MyActivity"
    android:configChanges="orientation|screenSize"
    android:label="@string/app_name">
```
　　这样一来当屏幕方向发生变化时，`MyActivity`不会重新启动，相反，它的`onConfigurationChanged()`方法会被系统的调用，如果您没这么配置则不会被调用。

　　注意：

	-  从Android3.2(API level 13)开始，当屏幕在横竖屏间切换时也会导致“screenSize”改变。
	-  因此若想在APILevel 13或更高的版本中防止屏幕方向变化时重启Activity，你必须同时包含“screenSize”和“orientation”两个值。

<br>　　例如，接下来的`onConfigurationChanged()`方法中实现了检查当前设备的方向：
``` java
// 当这个方法被调用时，你的Activity的Resources对象会被更新并返回一个基于新配置的Resources对象。
// 因此你可以在不用系统重启你的Activity的情况下很容易地重置你的UI元素。
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);

    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
    } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
        Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
    }
}
```
　　另外，不论你是同时设置`“screen size”`和`“orientation”`还是将`targetSdkVersion`设置为`<=13`，它们都只是会阻止`Activity`的重建，但并不会阻止屏幕的横竖屏切换。 
　　如果你想让`Activity`支持横屏或竖屏二者之一，那么应该使用`android:screenOrientation`属性。
<br>
### 状态保存 ###
　　程序在运行时会遇到各种各样的突发事件，当这些事件发生时就会导致Activity被重建，除了上面说的屏幕方向改变外，系统内存不足也是一个常见的、导致后台进程中的Activity被杀掉的原因。
　　也就是说，即便我们避免了屏幕方向改变导致的Activity被重建的情况，但是Activity还会因为其他原因而重建。

<br>　　为了应对这些突发事件，系统在Activity类中为我们提供了如下两个回调方法：

	-  onSaveInstanceState：
	   -  在Activity有可能被销毁之前，系统会回调此方法。
	   -  我们重写此方法时，将自己需要保存的数据，存在该方法的参数（一个Bundle对象）中即可。
	-  onRestoreInstanceState：
	   -  如果Activity之前存储了数据，则当该Activity再次被显示时，系统会回调此方法。
	   -  我们重写此方法时，从该方法的参数（一个Bundle对象）中还原我们的数据即可。

<br>　　范例1：保存数据。
``` java
public class MainActivity extends Activity {

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        // 保存一个int变量到Bundle对象中。
        outState.putInt("key", 1024);
    }


    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        // 从Bundle中读取数据。
        System.out.println("onRestoreInstanceState " + savedInstanceState.get("key"));
    }

}
```
	语句解释：
	-  Activity的onCreate方法的Bundle对象与onRestoreInstanceState是同一个。
	-  如果没有需要恢复的状态信息，那么会传递给onCreate方法一个null的Bundle的对象（Activity首次被创建时）。
	-  一般情况下，我们推荐在onRestoreInstanceState中执行还原操作。

<br>　　注意：

	-  在Activity被销毁之前不能保证onSaveInstanceState()方法被调用。
	-  因为有些场景中不需要保存状态，如用户使用“BACK”键退出时，因为用户明确的要关闭Activity就不需要保存状态了。
	-  如果系统需要，则：
	   -  会在onPause()方法之前调用onSaveInstanceState()方法。
	   -  会在onResume()之前调用onRestoreInstanceState()方法。

<br>　　但是，如果你没有重写`onSaveInstanceState()`方法，那么Activity类默认的`onSaveInstanceState()`方法也能恢复某些状态：

	-  在Android框架中几乎每个Widget都对onSaveInstanceState()方法做了适当的实现。
	-  Activity的onSaveInstanceState()方法，会依次调用它自己的布局中的View的onSaveInstanceState()方法，来保存数据。
	   -  比如当Activity被重建时，EditText控件保存用户输入的文本、CheckBox控件保存是否被选中。
	-  需要你做的工作只是给每个要保存状态的View提供一个唯一的ID（使用android:id属性）即可，系统不会保存未提供Id的View的状态。

# 第二节 Task #

## 基础知识 ##
　　`Android`使用`Task`来组织应用程序的所有`Activity`，`Task`是一个栈(`Stack`)结构，各个`Activity`按照栈的特点`“后来居上、后进先出”`依次被安排在栈中。
　　默认情况下，一个应用程序中的所有`Activity`处于同一个`Task`中，在操作系统中同一时间上会存在多个`Task`。
　　默认情况下，当一个`Activity`被创建时，就会被压入到`Task`的栈顶，当其销毁时（用户点击`“Back”`键或调用`finish()`方法等），就会从栈顶移除。

<br>　　范例1：图示。
　　　　　　　　![Task](/img/android/android_2_7.png)
　　第四个图形描述的是`Activity3`从`Task`中被弹出。
　　如果用户继续按`“Back”`按钮，那么堆栈中的每个`Activity`会被依次弹出，当所有的`Activity`从堆栈中被删除时，这个`Task`就不再存在了。

<br>　　范例2：前台与后台。
　　`Task`有前台和后台之分，当某个应用程序被用户切换到前台时，该应用程序所对应的`Task`也将会被移动到前台。
　　　　　　　　　　　　　　　　　　![TaskB处于前台、TaskA处于后台](/img/android/android_2_8.png)

　　很显然，系统在同一时间可能存在多个后台`Task` ，但只能有一个前台`Task`。
　　提示：虽然后台可以存在多个`Task`，但是当系统内存不足时，后台`Task`中的`Activity`所占据的内存可能被回收。

<br>　　`Task`的默认行为：

	-  当用户通过按主页（Home）按钮离开一个Task（任务）时，当前Task的栈顶Activity会被stop，并且Task会被放入后台，但系统会保留Task中每个Activity的状态。
	   -  如果用户随后通过选择启动图标来恢复这个任务，那么任务会来到前台，并且恢复了堆栈顶部的Activity。
	-  如果用户按下回退按钮，当前的Activity会从堆栈中被弹出并且被销毁，堆栈中的前一个Activity会被恢复。

## 启动模式 ##
　　默认情况下，`Android`会把同一个应用程序的所有`Activity`放到同一个栈里来进行管理，对于大多数应用程序来说这种方法能够很好的工作。
　　但是实际应用时情况复杂多变，这种默认的行为难以满足一些特殊的需求，不过你可以修改它，即`修改启动模式`。

<br>**修改启动模式：**
　　启动模式用来告诉系统，当用户请求启动一个`Activity`时，系统应该怎么做。使用以下两种方法可以定义启动模式：

	1、 使用清单文件：即在配置Activity的同时，指定该Activity的启动模式。
	2、 使用Intent对象：在调用startActivity方法时，通过Intent对象来设置待启动的Activity的启动模式。

<br>　　假设`ActivityA`启动`ActivityB`，并且：

	-  B在清单文件中定义了自己的启动模式。
	-  同时A又通过在Intent中设置了flag的方式，来为B指定启动模式。
　　那么此时`A`的请求（在`Intent`中定义的）的优先级要高于`B`的请求（在清单文件中定义的）。
<br>　　注意：某些在清单文件中有的启动模式在`Intent`类中却没有，同样某些`Intent`类有的启动模式也不能在清单文件中使用。
<br>
### 使用清单文件 ###
　　在清单文件中声明一个`Activity`时，你能够使用`<activity>`元素的`launchMode`属性来指定这个`Activity`的启动模式，该属性有有四种取值：

<br>　　**standard模式**

	-  标准模式，如果你在清单文件中配置Activity时，不为它的launchMode属性赋值，那么该Activity就默认是此种启动模式。
	-  当启动一个standard模式的Activity时，系统会直接创建一个该Activity的实例，并将该实例放到启动者所在的Task的栈顶。
	   -  比如ActivityA启动了ActivityB（B是标准模式），那么B就会运行在A所在的栈中，即使A与B不是一个应用程序也不例外。
	-  如果A启动了5次B，那么A的Task中就有5个B的实例。

　　当我们用`Application`或`Service`对象来启动一个`standard`模式的Activity时，会报如下错误：
``` java
Caused by: android.util.AndroidRuntimeException: Calling startActivity() 
            from outside of an Activity  context requires the FLAG_ACTIVITY_NEW_TASK flag. 
            Is this really what you want?
```
　　这是因为`standard`模式的Activity默认会进入它的启动者的Task中，但是由于Application并没有所谓的Task的概念，所以就出问题了。

<br>　　**singTop模式**

	-  栈顶复用模式。如果打算启动的Activity的实例，已经存在于启动者所在的Task的顶部，那么系统就会通过调用onNewIntent方法把这个Intent传递给这个实例，而不是创建一个新的实例。
	-  只有启动者所在的栈的顶部的Activity不是该Activity的实例时才会有多个实例存在。
<br>　　假设现在有一个`Task`，它的栈由`A`、`B`、`C`、`D`四个`Activity`组成，其中`D`在栈顶。

	-  若此时又试图启动一个D类型Activity，那么：
	   -  若D的启动模式是standard，那么D就会被直接启动，并且此时堆栈变成A-B-C-D-D的组合。
	   -  若D的启动模式是singleTop，那么既存的D的实例因为它在堆栈的顶部，所以它会接收通过onNewIntent()方法传递的Intent，堆栈仍然保持着A-B-C-D的组合。
	-  但是，如果是启动一个B类型Activity，那么即使B类型Activity的启动模式是“singleTop”，也会有一个新的B的实例被添加到堆栈中，因为栈顶是D。

<br>　　在讲解`singleTask`启动模式之前，先说明一下什么是`affinity`。
<br>　　**affinity：**
　　每个`Task`都有一个`affinity`属性，它相当于`Task`的名字。
　　每个`<activity>`标签也有一个`taskAffinity`的属性，用来指出当前`Activity`想从属的Task。

	-  若Activity为它的taskAffinity属性设置了值，即告诉系统该Activity希望被放到affinity属性的值与其taskAffinity属性相同的Task中。
	-  若没有为此属性赋值，则当前Activity的affinity就是<application>标签的taskAffinity属性的值。
	-  若<application>标签也没有指定taskAffinity属性的值，则就使用包名来作为整个程序所有Activity的taskAffinity。
	   -  也就是说，默认情况下同一个应用程序中的所有Activity，会运行在同一个Task中。

　　
　　问：那么`affinity`在什么情况下会被用到呢?
　　答：`taskAffinity`属性主要和`singleTask`等启动模式或者`allowTaskReparenting`属性配对使用。

<br>　　**singleTask模式**
　　当启动了一个启动模式为`singleTask`的`Activity`时，系统会执行如下操作：

    -  在整个操作系统中当前正在运行的所有Task中进行查找，查找affinity属性值等于启动模式为singleTask的Activity的taskAffinity属性值的任务是否存在。
    -  若不存在，则系统会开启一个新的Task，并将该Activity作为根元素。
    -  若存在，则系统会查看该Task中是否已经存在了该Activity。
       -  若存在，则将该Activity上的所有Activity都给finish掉，并调用该Activity的onNewIntent()方法，将新的Intent传递过去。
       -  若不存在，则在该Task顶部启动该Activity。
　　提示：`singleTask`默认具有`clearTop`的效果。


<br>　　范例1：查看所有`Task`。
``` android
adb shell dumpsys activity
```
　　使用`adb`命令可以查看当前操作系统中存在的所有`Task`。
``` java
Running activities (most recent first):
   TaskRecord{44fbd658 #3 A com.example.androidtest}
     Run #1: HistoryRecord{45032428 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　此时系统中有两个`Task`，若在`MainActivity`中启动`Activity1`，在`Activity1`中启动`Activity2`，则`Task`中的情况如下：
``` java
Running activities (most recent first):
  TaskRecord{4500ff48 #4 A com.example.androidtest}
    Run #3: HistoryRecord{450ea0a8 com.example.androidtest/.Activity2}
    Run #2: HistoryRecord{450268f8 com.example.androidtest/.Activity1}
    Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
  TaskRecord{4502d408 #2 A com.android.launcher}
    Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　若修改`Activity1`的启动模式为`singleTask`：
``` xml
<activity android:name=".Activity1" android:launchMode="singleTask" >
```
　　则在`MainAcitivity`中启动它后，栈中的情况如下：
``` java
Running activities (most recent first):
   TaskRecord{45008f00 #6 A com.example.androidtest}
     Run #2: HistoryRecord{45040e18 com.example.androidtest/.Activity1}
     Run #1: HistoryRecord{44f8eed0 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　为什么没有新开启一个`Task`呢?
　　因为`Activity`的`taskAffinity`属性的值没有设置，因此最终系统将它默认为包名了，这和`MainAcitivity`所处的`Task`的`affinity`属性的值一致，所以没有新开`Task`。

<br>　　范例2：开启新`Task`。
　　首先为`Activity1`设置`taskAffinity`属性的值。
``` xml
<activity android:name=".Activity1" android:launchMode="singleTask"
    android:taskAffinity="ni.die" >
```
　　然后在`MainAcitivity`中启动它，此时系统中的`Task`情况如下：
``` android
Running activities (most recent first):
   TaskRecord{44f1e948 #8 A ni.die}
     Run #2: HistoryRecord{45028690 com.example.androidtest/.Activity1}
   TaskRecord{4500b308 #7 A com.example.androidtest}
     Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```

<br>　　**移动整个栈**
　　这里需要指出一种情况，我们假设目前有2个任务栈，前台栈中有AB，后台栈中有CD，且假设CD的启动模式均为`singleTask`。
　　然后处于前台栈顶的B：

	-  如果请求启动D：由于D是栈顶，那么整个后台栈都会被切换到前台，此时的序列为ABCD。
	-  如果请求启动C：由于C不是栈顶，因此请求C时，D会被直接出栈，此时的序列为ABC。

<br>　　**singleInstance模式**
　　使用此启动模式的`Activity`总是单独占有一个`Task`，若在该`Activity`中又启动了另外一个`Activity`，则新启动的`Activity`将不会和该`Activity`处于同一个`Task`中。

　　需要注意的是：`singleInstance`模式也会使用`taskAffinity`属性。

	-  假设我们有A、B两个Activity，其中A是standard模式，B是singleInstance模式的，并且它俩都没有指定taskAffinity属性，同时我们的包名为com.cutler.androidtest。
	-  由于B是singleInstance模式，所以它必须单独占据一个栈，那么当我们在A中启动B时会发生什么呢？ 如下图所示。

<center>
![](/img/android/android_2_13.png)
</center>

　　从上面可以看出`BActivity`仍然会被放到`com.cutler.androidtest`中，但是它和`AActivity`却分别处在不同的两个栈中。

<br>
### 使用Intent ###
　　启动`Activity`时，你能够通过在传递给`startActivity()`方法的`Intent`中包含标识来修改`Activity`的默认启动模式，常用的取值：

	-  FLAG_ACTIVITY_NEW_TASK：与launchMode属性值等于singleTask时具有同样的行为。
	-  FLAG_ACTIVITY_SINGLE_TOP:与launchMode属性值等于singleTop时具有同样的行为。

<br>　　范例1：设置`Flag`。
``` java
Intent intent = new Intent(this,SecondActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
this.startActivity(intent);
```
	语句解释：
	-  在非Activity中启动Activity时，必须为Intent设置FLAG_ACTIVITY_NEW_TASK，如在“服务”中。

<br>**清除回退堆栈（笔者未测试）：**
　　如果用户长时间的离开一个任务，那么系统会清除这个任务根`Activity`以外的所有`Activity`。当用户再次返回这个任务时，只有根`Activity`被存储。这样的系统行为是因为经过长时间以后，用户在返回这个任务之前可能已经放弃它们的作业，而开始了某些新的任务。 你能够使用一些`Activity`属性来修改这种行为：

　　alwaysRetainTaskState

	如果这个属性在一个任务的根Activity中被设置为“true”，那么像上面描述的那样的默认行为就不会发生。即使是长时间之后，这个任务也会在它的堆栈中保留所有的Activity。
　　clearTaskOnLaunch

	如果这个属性在一个任务的根Activity中被设置为“true”，那么无论用户什么时候离开和返回这个任务，堆栈都会被清除到根Activity的位置。换句话说，它与alwaysRetainTaskState属性相反，用户总是返回到任务的初始状态，即使只离开这个任务一会儿。
# 第三节 Intent #
　　`Android`四大组件中有三个组件（不包括内容提供者）是通过叫做`Intent`的对象来激活的，因此接下来将介绍`Intent`对象。

　　Intent被译为意图，一个Intent对象就是一个信息包，我们把一些信息放到Intent中，然后把它交给操作系统，然后操作系统会依据里面的数据来做出相应的操作。

　　Intent中主要有`7`个重要的字段：

	mComponent、mAction、mData、mCategories、mExtras、mType、mFlags
　　但是我们在使用Intent对象的时候，不需要为这7个属性都赋值，而只需要在不同的情况下为某几个属性赋值即可，稍后会详细介绍如何使用它们。

<br>　　在`Android`中意图分为：`显式意图`和`隐式意图`。
<br>　　**显式意图**
　　若在`Intent`对象被发送给操作系统之前，程序为它的`mComponent`属性赋值了，则此`Intent`对象被称为显式意图。显示意图明确的指定了其要启动的组件的所在包名、类名，`Android`系统接到`Intent`对象时，直接去对应的包中反射实例化并初始化目标组件。
<br>　　**隐式意图**
　　在程序中没有为`Intent`对象明确指出想要其启动的组件（即没有为`mComponent`属性赋值），而是提供一些筛选条件，操作系统会从当前已在系统中注册的所有组件中，筛选出满足要求的组件(可能是一个也可能是多个)，然后予以启动。 

## 显式意图 ##
　　当操作系统接到`Intent`对象后，会检查`Intent`对象的`mComponent`是否有值：
	-  若有值：则直接启动mComponent所代表的组件。
	-  若无值：则按照隐式意图处理。

　　`mComponent`字段是`ComponentName`类型的，用来表示`Intent`所要启动的组件的名字，它只有两个属性：`包名`、`组件名`。

	-  包名：用来指出该组件所在的应用程序。
	-  组件名：找到应用程序后，再依据组件名，来在该程序中找对应的组件。


<br>　　范例1：通过`ComponentName`启动新`Activity`。
``` java
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
    -  我们可以通过Intent对象的mExtras属性，来将一些参数传递到目标组件中去。
    -  也可以在创建Intent对象的同时，设置当前Intent对象从何处跳往何处：
       -  Intent intent = new Intent(MainActivity.this,MyActivity.class);

<br>　　范例2：接收参数。
``` java
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

　　上面所说的“筛选条件”指的就是`Intent`对象以下三个方面：

	1、动作（mAction）
	2、数据（mData和mType）
	3、分类（mCategories）

　　也就是说，我们通过为Intent的上面四个属性赋值，来设置“筛选条件”，然后操作系统也会读取这四个属性，并用它们进行匹配。

<br>**动作**
　　`mAction`：是`String`类型的，用来告诉系统本次请求要执行什么样的动作。如：张三看书、李四唱歌中的`“看”`、`“唱”`就是指动作。在Android中内置的动作有很多，常见的有：

	-  Intent.ACTION_VIEW ：“查看”动作。
	-  Intent.ACTION_EDIT ：“编辑”动作。
	-  Intent.ACTION_DELETE ：“删除”动作。
	-  Intent.ACTION_CALL：“呼叫”动作，通常指打电话。
	-  Intent.ACTION_MAIN ：标记当前Activity是程序的入口。

<br>**数据**
　　数据：`“动作”`所要操作的数据，显然不同的动作要跟不同的数据规范类型配合使用，比如：
	-  如果动作是ACTION_VIEW，那么数据就应该指向一个可被查看的东西，比如网页、图片、视频等。
	-  如果动作字段是ACTION_EDIT，那么它的数据应该指向它所要编辑的数据。
	-  如果动作是ACTION_CALL，那么数据就应该是一个呼叫号码。

　　再具体点说，数据包括两部分：`mData`和`mType`：

	-  数据的URI(mData)：用来指出数据所在的位置。如file:///tmp/android.txt。
	-  数据的类型(mType)：用来指出数据的MIME类型。如：text/html 。

<br>**分类**
　　`mCategories`：`“动作”`的附加信息（可以有多个）。在Android中内置的类型有：

	-  Intent.CATEGORY_LAUNCHER ：目标Activity能够被列在应用程序启动器上。
	-  Intent.CATEGORY_BROWSABLE ：目标Activity能够安全的调用浏览器来显示链接所指向的数据（如图片或电子邮件）。
	-  Intent.CATEGORY_HOME ：目标Activity显示在主屏幕上。

<br>
### IntentFilter类 ###
　　通过前面的介绍，我们已经知道这三点：

	-  创建完Activity等组件后，还需要在清单文件中配置它们，以便让系统知道这些组件的存在。
	-  在配置它们的时候，除了ContentProvider之外的另外三个组件都可以配置一个或多个<IntentFilter>，它表示过滤器。
	-  当我们需要启动一个组件时，整个流程是这样的：
	   -  首先，我们创建一个Intent对象，然后将它传递给操作系统。
	   -  然后，系统会检测Intent，若它是显式意图的直接启动目标组件，否则会依据Intent内部的信息进行匹配。
	   -  接着，如果我们调用的startActivity来启动组件，那么系统会获取当前所有注册到系统中的Activity，并获取它们的<IntentFilter>。
	   -  最后，让Intent对象和这些Activity的<IntentFilter>进行匹配，匹配成功就会启动该Activity，若有多个Activity都匹配成功，则系统会让用户选择启动哪一个。
	   -  另外，组件可以有多个<IntentFilter>标签，只要该组件有一个匹配成功，则就能启动。


　　`IntentFilter`类与`<IntentFilter>`标签对应，它有类似于Intent对象的动作、数据、和分类字段。


<br>**Action匹配**
　　在清单文件中的`<intent-filter>`元素内的`<action>`子元素对应咱们前面说的“动作”。如：
``` xml
<intent-filter>
    <action android:name="com.example.project.SHOW_CURRENT" />
    <action android:name="com.example.project.SHOW_RECENT" />
    <action android:name="com.example.project.SHOW_PENDING" />
</intent-filter>
```
    语句解释：
    -  像本例显示的这样，一个过滤器可以列出多个Action。但这个列表不能是空的，一个过滤器必须包含至少一个<action>元素，否则它不会匹配任何Intent对象。
    -  要通过这个检测，在Intent对象中指定的Action必须跟这个过滤器的动作列表中的某个Action一致匹配。

　　
　　进行意图匹配时，只有在Intent的`mAction`属性与`<intent-filter>`下的某个`<action>`标签的值匹配成功后，才会去匹配`mCategories`属性。 

<br>**Category检测**
　　`<intent-filter>`元素内的`<category>`子元素对应前面说的“分类”。例如：
``` xml
<intent-filter>
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
</intent-filter>
```
　　对于一个要通过`Category`检测的`Intent`对象，在`Intent`对象中所包含的每个分类，过滤器中都必须得包含，过滤器能够列出Intent中不包含的分类，但是它不能忽略`Intent`对象中的任何分类。
　　因此，原则上一个没有`category`的`Intent`对象应该始终通过这个检测，而不管过滤器中声明的分类。

　　注意：

	-  所有传递给startActivity()方法的隐式Intent对象，都会至少包含了一个android.intent.category.DEFAULT。
	-  只有Intent对象的mCategorie里的所有类型都匹配成功后，才会去匹配<data>标签。

<br>**Data检测**
　　像`Action`、`Category`检测一样，针对`IntentFilter`的“数据”也要包含在一个子元素中，这个子元素能够出现`0~n`次。例如：
``` xml
<intent-filter>
    <data android:mimeType="video/mpeg" android:scheme="http" /> 
    <data android:mimeType="audio/mpeg" android:scheme="http" />
</intent-filter>
```
　　每个`<data>`元素能够指定`URI`和数据类型（`MIME`）对于每个`URI`部分都会有独立的属性：scheme、host、port、path。格式：
``` c
<scheme>://<host>:<port>/[<path>|<pathPrefix>|<pathPattern>]
```
　　例如，以下URI：
``` c
content://com.example.project:200/folder/subfolder/etc
```

	-  scheme是content
	-  host  是com.example.project
	-  port  是200
	-  path  是folder/subfolder/etc。
　　其中`host`和`port`一起构成了`authority`，如果没有指定`host`，那么`port`也会被忽略。

<br>
### 开始匹配 ###
　　范例1：新建Activity。
``` xml
<activity android:name="org.cxy.intent.SecondActivity">
    <intent-filter>
        <action android:name="act.second"/>
        <category android:name="android.intent.category.DEFAULT"/>
    </intent-filter>
</activity>
```
　　在MainActivity中书写如下跳转语句：
``` java
Intent intent =  new Intent();
intent.setAction("act.second"); 
this.startActivity(intent);
```
    语句解释：
	-  本范例并没有为Intent指定具体要跳转到哪个Activity，而是为Intent指定一个action。
	-  在调用startActivity方法启动Activity时，该方法会自动为Intent对象设置一个category，即：“android.intent.category.DEFAULT”。

<br>　　范例2：data匹配。
``` xml
<activity android:name="org.cxy.intent.SecondActivity">
    <intent-filter>
        <action android:name="org.cxy.action.Second"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:scheme="http" android:host="www.cxy.com" android:port="80" android:path="/hi.jsp"/>
    </intent-filter>
</activity>
```
　　在MainActivity中书写如下跳转语句：
``` java
Intent intent = new Intent();
intent.setAction("org.cxy.action.Second");
intent.setData(Uri.parse("http://www.cxy.com:80/hi.jsp"));
this.startActivity(intent);
```
    语句解释：
    -  使用scheme属性匹配代码中的协议名。
	-  使用host属性匹配代码中的主机名，使用此属性之前，必须要先指定scheme属性，在代码中scheme和host之间要写上“://”作为间隔。 
	-  使用port属性匹配代码中的端口号，使用path属性匹配代码中的路径。

<br>　　范例3：数据类型匹配。
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
``` java
Intent intent = new Intent();
intent.setAction("org.cxy.action.Second");
intent.setDataAndType(Uri.parse("http://www.cxy.com:80/hi.jsp"),"image/gif");
this.startActivity(intent);
```
    语句解释：
    -  使用mimeType属性可以对数据的MIME类型进行限制。
	-  使用setData方法设置Intent的Uri，使用setType方法设置Intent的MIME类型。
	-  但是如果你想同时设置这两者，则只能使用setDataAndType方法，因为setData和setType方法中会彼此清除对方的值，具体请查看源码。

<br>　　在`<intent-filter>`中可以不列出`<data>`元素，但是只要列出了，那么`<data>`中所列出的所有属性都得匹配。

<br>　　范例4：假设我们有如下配置：
``` xml
<activity android:name=".B">
    <intent-filter>
        <action android:name="aa.test.BBBBBB"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="image/*"/>
    </intent-filter>
</activity>
```
　　那么我们可以用如下代码进行匹配：
``` java
Intent intent = new Intent();
intent.setAction("aa.test.BBBBBB");
intent.setDataAndType(Uri.parse("content://abc"),"image/png");
startActivity(intent);
```
    语句解释：
    -  也就是说，虽然我们没有为<data>元素设置scheme属性，但是它却存在默认值，会默认匹配“file”、“content”。
    -  另外，在<data>元素的path和mimeType属性的值中，都可以包含通配符“*”，用来匹配0~n个任意字符。

<br>　　范例5：安装应用程序。
``` java
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

<br>　　范例6：卸载应用程序。
``` java
Intent intent = new Intent();
intent.setAction(Intent.ACTION_DELETE);
intent.setData(Uri.parse("package:"+ this.getPackageName()));
startActivity(intent);
```
    语句解释：
    -  调用系统内置的ACTION_DELETE动作可以执行删除操作。
	-  若删除的数据为：“package:应用程序包名”，则相当于卸载该应用程序。 
	-  调用Activity的getPackageName()方法可以获取当前应用程序的包名称。

<br>　　范例7：启动发送短信Acitivity。
``` java
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

<br>**扩展：**
　　`PackageManager`类中有一组`query…()`以及`resolve…()`方法。
　　前者返回能够接受指定`Intent`对象的所有组件，后者返回最佳匹配结果（即只返回1个结果），例如：

	-  queryIntentActivities()方法返回能够执行这个Intent对象的所有Activity。
	-  queryIntentServices()方法类似地返回Service列表。
	-  queryBroadcastReceivers()方法类似地返回Broadcast Receiver列表。
　　这些方法都不激活组件，它们只是列出能够响应这个`Intent`对象的所有组件。

# 第四节 Fragment #
　　`Android`在`3.0`中引入了`fragments`的概念，`Android3.0`是基于`Android`的平板电脑专用操作系统。
## 背景介绍 ##
<br>**问题是这样的：**
　　在一个小屏幕的设备上，一个`Activity`通常占据了整个屏幕，其内显示各种UI视图组件。但是当一个`Activity`被显示在一个大屏幕的设备上时，例如平板，总会显得有些不适应，因为平板的屏幕太大了，UI组件会被拉长、模糊。
　　因此若想使`Activity`的UI组件在大屏幕中美观且充满整个屏幕，则就需要在其内添加更多的组件，但是这样一来，视图的层次结构就很复杂了。但层次结构复杂也许并不是问题的关键，对于两个功能相似的`Activity`来说，他们UI界面也会高度相仿，这也就意味着代码的重复量会大大增加（这个问题也存在于手机设备上，只不过在大屏幕设备上更为突出而已）。

　　因此`Android3.0`为了支持更加动态和灵活的UI设计，它引入了`fragments`的概念。

<br>**是什么？**
　　解决代码冗余最好的方法就是把各功能相似的`Activity`中那块相似的部分抽取出来，然后封装成一个类，以后就可以在需要使用的时候实例化一个对象放入`Activity`即可。
　　在`Android3.0`中`Google`已经帮我们封装好了这个类，即`Fragment`。也就是说`Fragment`的作用就是用来封装各`Activity`中公用的组件，以便代码重用和管理。

　　既然已经知道了`Fragment`的作用，那么接下来说说它的特点：

	-  Fragment可以将一组View封装成一个整体，但它本身却不是继承自View类。
	-  Fragment必须总是被嵌入到一个Activity中，它无法单独使用。
	-  Fragment更像一个容器，它的存在就是为了将多个View打包在一起，它本身无法被直接显示。
	-  Fragment有它自己的生命周期，接收属于它的输入事件，并且我们可以在Activity运行期间动态的向Activity中添加和删除Fragment。
	-  Fragment的生命周期直接被其所属的宿主Activity的生命周期影响。
　
　　一个`Activity`中可以同时嵌入多个`Fragment`。
　　举个例子，你可能会仅当在屏幕尺寸足够大（平板电脑）时，在一个`Activity`中包含多个`Fragment`（如下图-左），而当不属于这种情况（手机）时则只包含一个`Fragment`（如下图-右）。

　　　　　　　　　![Fragment](/img/android/android_2_3.png)

　　提示：

	-  Fragment是在Android3.0中提供的，若想在Android2.x平台上使用Fragment则需要添加android-support-v4.jar库。

<br>　　还有一种应用场景，比如ActionBar上有多个Tab页，切换不同的Tab页时，Activity就显示不同的布局。
　　在以前，我们可能会把所有布局都放到一个布局文件中，随着Tab的切换而执行setVisibility，这样做有两个问题：

	-  第一，Activity首次加载的控件很多，即便是通过延迟加载延缓解决这个问题，还有下面的问题。
	-  第二，布局文件里的控件的初始化、事件监听/处理等代码都得写在Activity中，不方便管理和移动。 
	   -  也许你会说，封装成一个类不久行了。
	   -  是的，Fragment就是Android帮我们封装好的，我们只需要使用Fragment来实现这几个Tab的界面即可。

　　也就是说，我们并不是只有在多个界面都需要显示相同的布局时才使用Fragment，上面这种情况也应该使用Fragment。

## 基本应用 ##
　　要创建一个`Fragment`类，必须让该类继承`Fragment`或其子类 。
　　`Fragment`类的代码看上去有点象`Activity`，它也包含了`onCreate()`、`onStart()`、`onPause()`和`onStop()`方法。

<br>**创建Fragment**
　　我们已经知道`Fragment`用来作为`Activity`的用户界面的一部分，其内封装的`view`会被放入`Activity`中。
　　那么应该如何给`Fragment`提供一个`view`呢?
　　答：实现`Fragment`类的`onCreateView()`回调方法即可，该方法是`Fragment`的生命周期方法之一，当`Activity`需要`Fragment`创建它自己的`view`时，就会调用它。

<br>　　范例1：MyFragment。
``` java
public static class MyFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.example_fragment, null);
    }
}
```
	语句解释：
	-  inflater：一个工具类的对象，可以从一个XML Layout资源文件中读取并生成View。
	-  container：你的Fragment将被插入的父ViewGroup(来自activity的layout)。
	-  savedInstanceState：如果Fragment是被恢复的，它提供关于Fragment的之前的实例的数据。

<br>**添加入Activity中**
　　创建完`Fragment`后，接下来就要将它添加到`Activity`中进行显示了。

	-  Fragment会嵌入到宿主Activity的View Hierarchy中，被作为Activity的整个的一部分。

　　但是由于`Fragment`本身并不是`View`的子类，我们无法通过`addView`等方法将其直接放入到`Actvity`中。
　　虽然如此，但是还是有`2`种方法可以添加一个`Fragment`到`Activity`中。

<br>　　第一种，在`Activity`的`layout`文件中声明`<fragment>`标签，可以像`View`一样指定`layout`属性。
``` xml
<fragment
    android:id="@+id/myFragment"
    android:name="com.example.androidtest.MyFragment"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
```
	语句解释：
	-  android:name属性指定了要实例化Fragment类的名称。
	-  当系统创建Activity的界面时，会依次实例化每个<fragment>标签，并调用它们的onCreateView()方法来获取View，然后把返回的View直接插入到<fragment>元素所在的地方。

<br>　　第二种，在`Activity`运行的任何时候都可以通过`FragmentManager`来操作和管理`Fragment`。有两种方式可以获取到`FragmentManager`的实例：

	-  若项目的SDK版本为3.0以上，则通过Activity的getFragmentManager()方法获取。
	-  若项目的SDK版本低于3.0，则通过FragmentActivity的getSupportFragmentManager()方法获取。

<br>　　另外，每个`Fragment`都需要一个唯一的标识，以便在程序中引用它。有`3`种方法来为一个Fragment提供一个标识：

	-  为android:id属性提供一个唯一ID。
	-  为android:tag属性提供一个唯一字符串。
	-  如果以上2个你都没有提供，系统使用Fragment所在的容器view的ID。

<br>　　范例1：添加Fragment。
``` java
public class MyActivity extends FragmentActivity{
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 添加Fragment
        MyFragment f = new MyFragment();
        // FragmentManager和FragmentTransaction后面介绍。
        FragmentManager mgr = getSupportFragmentManager();
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout,f);
        trans.commit();
    }
}
```
	语句解释：
	-  由于Android3.0之前的Activity类不支持Fragment这个类，因此在android-support-v4.jar中Google使用FragmentActivity来对Activity的功能进行了增强。若你项目的SDK版本低于Android3.0，则需要添加android-support-v4.jar包，并且要让你的Activity继承FragmentActivity类。
	-  本范例是通过继承FragmentActivity类来实现的。执行完毕编辑操作后，若不调用commit()方法则事务是永远不会生效的。

<br>　　范例2：FragmentManager类。
``` java
public abstract class FragmentManager extends Object {
    // 开启一个事务，之后对Fragment的操作都是在这个事务对象进行的。
    public abstract FragmentTransaction beginTransaction(){}

    // 指定Fragment的id或tag，从当前FragmentManager对象中查找出Fragment对象。
    public abstract Fragment findFragmentById(int id){}
    public abstract Fragment findFragmentByTag(String tag){}
}
```
	语句解释：
	-  不论是Android3.0之后的Activity类还是FragmentActivity类，在它们的内部都定义了一个FragmentManager类型的属性，它管理着所有嵌入到其宿主Activity内的Fragment对象。
	-  由于一个Activity中可以嵌入多个Fragment，为了方便高效的编辑这些Fragment对象，Android采用了“事务提交”的方式。
	-  每当需要编辑Activity中的某个Fragment时，都要先开启一个事务。然后在事务对象上执行编辑操作(如add、remove、replace等)，执行完毕所有的编辑后再一次性的提交给Activity去更新界面。

<br>　　范例3：FragmentTransaction类。
``` java
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

　　`trans.add(R.id.layout,f)`将`Fragment`对象添加到`Activity`的组件下，此语句等价于：
``` java
ViewGroup container = (ViewGroup)activity.findViewById(R.id.layout);
container.addView(f.mView);
```
　　其中`f.mView`就是Fragment内部所封装的View。

<br>**事务回滚**
　　事务是支持回滚的，即撤销上一步操作。 
　　在`FragmentManager`中维护了一个`事务栈`。我们可以在事务对象提交(`commit`)之前，设置是否要将该事务放在事务栈中。 当用户在`Activity`中按下`back`键时，会撤销栈顶的事务所做出的修改。

<br>　　范例1：添加Fragment。
``` java
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
	-  如果添加多个变化到事务(例如add()或remove())并调用addToBackStack()，然后在你调用commit()之前的所有应用的变化会被作为一个单个事务添加到后台堆栈，BACK按键会将它们一起回退。

<br>　　范例2：替换Fragment。
``` java
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
	-  如果添加多个Fragment到同一个容器，那么添加的顺序决定了它们在view hierarchy中显示的顺序。 因此f会被放到f2的前面显示。
	-  本范例使用replace方法会将f给删除，并将f3添加到R.id.layout的末尾位置。
	-  本范例的三个事务都被加入到事务栈中，当第一次按下BACK键时，f3会被移除，f会被还原。 注意：f会被还原到f3的位置，而不是f2的前面。也就是说，对于addToBackStack()方法，它只会记录fragment的操作，而不会记录fragment当时的位置。当执行还原的时候，会将fragment放到containerView的末尾。

<br>　　范例3：删除Fragment。
``` java
public class MyActivity extends FragmentActivity{
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentManager mgr = getSupportFragmentManager();

        // ...  此处省略了范例2中的代码。

        FragmentTransaction trans4 = mgr.beginTransaction();
        trans4.remove(f);
        trans4.addToBackStack(null);
        trans4.commit();
    }
}
```
	语句解释：
	-  当按下BACK键时，f会被还原。即f会被还原到f3的后面，而不是f2的前面。
	-  对于每一个Fragment事务，你可以应用一个事务动画，通过在提交事务之前调用setTransition()实现。

<br>**为Activity创建事件回调方法**
　　在一些情况下，你可能需要一个`Fragment`与`Activity`分享事件。 
　　例如，`Activity`中有`2`个`Fragment`，一个用来显示文章列表(`A`)，另一个显示文章内容(`B`)。 当用户点击了`A`中的某个文章时，`A`就告诉宿主`Activity`，然后宿主`Activity`就可以转告诉`B`去显示文章。

<br>　　范例1：定义回调接口。
``` java
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
	语句解释：
	-  让FragmentA的宿主Activity实现OnArticleSelectedListener接口，并覆写抽象方法。
	-  当onArticleSelected()被调用时，宿主Activity就可以通知FragmentB，并将FragmentA传来的数据转给FragmentB。
	-  为了确保宿主Activity实现这个接口，在onAttach()方法被调用 (此方法是生命周期方法之一，后述) 时，可以将onAttach()的参数做类型转换来实例化一个OnArticleSelectedListener实例。
	-  若宿主Activity没有实现接口，则Fragment就会抛出ClassCastException异常。
	-  由于FragmentA是ListFragment的子类，因此每次用户点击一个列表项，系统调用在Fragment中的onListItemClick()，然后后者调用onArticleSelected()来分配事件给Activity。


## 生命周期 ##
　　`Fragment`有自己的生命周期，并且生命周期直接被其所属的宿主`Activity`的生命周期影响。当`Activity`被暂停，那么在其中的所有`Fragment`也被暂停，当`Activity`被销毁，所有隶属于它的`Fragment`也被销毁。

　　管理`Fragment`的生命周期，大多数地方和管理`Activity`生命周期很像，和`Activity`一样。
　　`Fragment`生命周期各个阶段回调的方法如下图(左)，`Fragment`和`Activity`的生命周期方法对应关系图(右)：
　　　　　　　![](/img/android/android_2_4.png)　　　　　![](/img/android/android_2_5.png)
　　和`Activity`一样，你可以使用`Bundle`保持`Fragment`的状态，万一`Activity`的进程被干掉，并且当`Activity`被重新创建的时候，你需要恢复`Fragment`的状态时就可以用到。
　　在`Fragment`的`onSaveInstanceState()`期间保存状态，并可以在`onCreate()`，`onCreateView()`或`onActivityCreated()`期间恢复它。

<br>**各生命周期方法的调用**

	-  onAttach：当Fragment通过事务对象被绑定到Activity时被调用(宿主Activity的引用会被传入)。在onAttach方法被调用后，其宿主Activity的onAttachFragment方法将被调用。
	-  onCreate：通常情况下，在宿主Activity的onAttachFragment方法将被调用后，会调用Fragment的onCreate方法。
	-  onCreateView：不论Fragment的onCreate是否调用，都将继续调用onCreateView方法，此方法需要返回Fragment内封装的view的根节点。
	-  onActivityCreated：若Activity的onCreate方法已经返回，则此方法将会在onCreateView方法被调用后被调用。
	-  onStart、onResume、onPause、onStop：这四个方法的调用情形与Activity一样。
	-  onDestroyView：当和Fragment关联的view hierarchy被移除之前会调用此方法，此方法返回后就会执行移除操作。
	-  onDestroy：当Fragment被销毁时被调用。
	-  onDetach：当Fragment与宿主Activity解除关联时被调用。

## 销毁重建 ##
　　`Fragment`的生命周期受其宿主`Activity`的影响，当宿主`Activity`因为某种原因被摧毁(如手机横竖屏切换、内存不足导致后台`Activity`被回收等)，且用户再次导航回来时，接着宿主`Activity`就会执行重建操作，其内部的各个`Fragment`也会跟随着它执行重建。

　　`Activity`的重建，简单的说就是重新实例化一个对象，并将之前被摧毁的对象的各种状态设置到新的对象上，关于重建这一点`Fragment`和其宿主`Activity`的操作是一样的。此时就存在一个问题，重建的操作是系统来完成的，而重建又需要创建新的对象，那么操作系统是如何实例化我们自己定义的`Fragment`类的呢?
　　答案就是：通过`反射机制`。

　　由于通常我们创建自己的类时会依据需要自定义若干个构造方法，而操作系统在重建时只会调用无参的构造器(因为有参的构造器所需要的参数，操作系统是不可以自主的随便提供的，否则程序就乱套了)。
　　因此我们要保证自定义的`Fragment`类必须要有一个无参的构造方法，以便系统对其重建时调用。
<br>　　找到`Fragment`类看到如下代码：
　　　　　![Fragment类代码片段](/img/android/android_2_6.png)
　　上面的源码也可以证实，必须要为`Fragment`提供一个无参的构造方法。
　　其实`Activity`也需要无参的构造方法，只是由于它的实例由操作系统来创建，所以我们以前并没有涉及到此问题。

<br>**实例化的方法**
　　现在我们又遇到一个问题： 很多时候我们需要在实例化`Fragment`的同时为其传递一些参数，而系统在重建`Fragment`时只会调用无参的构造方法，也就跳过传参的这一步骤，这必然会导致程序出问题。
　　这该怎么解决呢?
<br>　　这个问题`Fragment`已经替我们考虑到了，`Fragment`类有一个属性名为`mArguments`，它是`Bundle`类型的。
``` android
// Construction arguments;
Bundle mArguments;
```
　　当我们构造`Fragment`对象时，可以将需要传递给`Fragment`的参数放到这个`Bundle`对象中。这样即便是随后`Fragment`对象被摧毁了也没关系，因为系统会将`Fragment`的`mArguments`属性的值保存起来，当重建的时候也会将`mArguments`属性的值给还原。
<br>　　因此对于`Fragment`的初始化操作，我们通常的写法是这样的：
``` java
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

<br>　　范例2：MyFragment。
``` java
public class MyFragment extends Fragment {
    private String property;
    public static MyFragment getInstance(String property) {
        // 我们也调用无参构造方法。
        MyFragment f = new MyFragment();
        Bundle data = new Bundle();
        data.putString("property", property);
        // 将参数设置到MyFragment中。
        f.setArguments(data);
        return f;
    }
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 当MyFragment被创建时，读取参数。
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

<br>
**本节参考阅读：**
- [Fragments (Android官方文档中文版)](http://www.eoeandroid.com/thread-71642-1-1.html)
- [Android之Fragment（官网资料翻译）](http://blog.csdn.net/aomandeshangxiao/article/details/7671533)

<br><br>