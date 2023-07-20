---
title: 第一章 四大组件
date: 2014-10-30 23:28:28
author: Cutler
categories: Android开发
---

# 第一节 Activity #
　　`Activity`是提供给用户的用于与程序进行交互的界面组件，如打电话、拍照片、发邮件、看地图等。它通过一个窗口来描画它的用户界面，通常这个窗口是全屏的，但是也可以比屏幕小，并且可以浮动在其他窗口的上面。

　　本章会略过`Activity`的基础知识（创建、配置、传参等），请您自行搜索学习。
<br>
## 生命周期 ##
　　Activity从创建到销毁会经历多个阶段，每个阶段都会回调不同的生命周期方法，本节将分两部分来介绍它的生命周期。

### 正常生命周期 ###
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


### 异常生命周期 ###
　　上一节我们介绍了`Activity`常见的`7`个生命周期方法，这些方法主要是依靠用户的操作来触发的，比如用户打开一个新的`Activity`，会导致当前界面的`onPause`等方法调用。
　　但是实际开发时，情况会稍微复杂一些，我们还会涉及到其它几个生命周期方法，本节就来介绍一下它们。
<br>
#### 设备配置改变 ####
　　当设备配置在运行期间改变（如屏幕方向、语言等）时，系统会重启正在运行的Activity（系统调用onDestroy()方法后，立即调用onCreate()方法）。但是你也可以修改这个默认的行为，从而阻止系统重启你的Activity，即告诉系统由Activity自己来处理配置变化。

<br>　　我们只需要设置清单文件的`<activity>`元素的`android:configChanges`属性即可，该属性最常用的值是`orientation`(处理当屏幕的方向变化)，多个配置的值之间通过`“|”`符号将它们分隔开。例如：
``` xml
<activity android:name=".MyActivity"
    android:configChanges="orientation|screenSize"
    android:label="@string/app_name">
```
　　这样一来当屏幕方向发生变化时，`MyActivity`不会重新启动，相反，它的`onConfigurationChanged()`方法会被系统的调用，如果您没这么配置则不会被调用。

　　注意：

    -  从Android 3.2(API level 13)开始，当屏幕在横竖屏间切换时也会导致“screenSize”改变。
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
　　另外，不论你是同时设置`“screen size”`和`“orientation”`还是将`targetSdkVersion`设置为`<=13`，它们都只是会阻止`Activity`的重建，但并不会阻止屏幕的横竖屏切换。 如果你想让`Activity`保持横屏或竖屏二者之一，那么应该使用`android:screenOrientation`属性。
<br>
#### 状态保存 ####
　　程序在运行时会遇到各种各样的突发事件，当这些事件发生时就会导致Activity被重建，除了上面说的屏幕方向改变外，系统内存不足也是一个常见的、导致后台进程中的Activity被杀掉的原因。也就是说，即便我们避免了屏幕方向改变导致的Activity被重建的情况，但是Activity还会因为其他原因而重建。

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

## Task ##

### 基础知识 ###
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
    -  如果用户随后通过选择启动图标来恢复这个任务，那么任务会来到前台，并且恢复了堆栈顶部的Activity。若用户接着按下回退按钮，当前的Activity会从堆栈中被弹出并且被销毁，堆栈中的前一个Activity会被恢复。

### 启动模式 ###
　　默认情况下，`Android`会把同一个应用程序的所有`Activity`放到同一个栈里来进行管理，对于大多数应用程序来说这种方法能够很好的工作。但是实际应用时情况复杂多变，这种默认的行为难以满足一些特殊的需求，不过你可以修改它，即“修改启动模式”。

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
#### 使用清单文件 ####
　　在清单文件中声明一个`Activity`时，你能够使用`<activity>`元素的`launchMode`属性来指定这个`Activity`的启动模式，该属性有有四种取值：

<br>　　**standard模式**

    -  标准模式，如果你在清单文件中配置Activity时，不为它的launchMode属性赋值，那么该Activity就默认是此种启动模式。
    -  当启动一个standard模式的Activity时，系统会直接创建一个该Activity的实例，并将该实例放到启动者所在的Task的栈顶。比如ActivityA启动了ActivityB（B是标准模式），那么B就会运行在A所在的栈中，即使A与B不是一个应用程序也不例外。如果A启动了5次B，那么A的Task中就有5个B的实例。

　　当我们用`Application`或`Service`对象来启动一个`standard`模式的Activity时，会报如下错误：
``` java
Caused by: android.util.AndroidRuntimeException: Calling startActivity() 
            from outside of an Activity  context requires the FLAG_ACTIVITY_NEW_TASK flag. 
            Is this really what you want?
```
　　这是因为`standard`模式的Activity默认会进入它的启动者的Task中，但是由于`Application`和`Service`对象并没有所谓的Task的概念，所以就出问题了。

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

　　从上面可以看出`BActivity`仍然会被放到`com.cutler.androidtest`中，但是它和`AActivity`却分别处在不同的两个栈中。从上图中可以看出来，系统中可以存在多个同名的Task。

<br>
#### 使用Intent ####
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

    如果这个属性在一个Task的根Activity中被设置为“true”，那么像上面描述的那样的默认行为就不会发生。即使是长时间之后，这个Task也会在它的堆栈中保留所有的Activity。
　　clearTaskOnLaunch

    如果这个属性在一个Task的根Activity中被设置为“true”，那么无论用户什么时候离开和返回这个Task，堆栈都会被清除到根Activity的位置。换句话说，它与alwaysRetainTaskState属性相反，用户总是返回到Task的初始状态，即使只离开这个Task一会儿。
## Intent ##
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

### 显式意图 ###
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

### 隐式意图 ###
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
　　`mCategories`：`“动作”`的附加信息（可以有多个），在Android中内置的类型有：

    -  Intent.CATEGORY_LAUNCHER ：目标Activity能够被列在应用程序启动器上。
    -  Intent.CATEGORY_BROWSABLE ：目标Activity能够安全的调用浏览器来显示链接所指向的数据（如图片或电子邮件）。
    -  Intent.CATEGORY_HOME ：目标Activity显示在主屏幕上。

<br>
#### IntentFilter类 ####
<br>　　通过前面的介绍，我们已经知道这三点：

    -  创建完Activity等组件后，还需要在清单文件中配置它们，以便让系统知道这些组件的存在。
    -  在配置它们的时候，除了ContentProvider之外的另外三个组件都可以配置一个或多个<IntentFilter>，它表示过滤器。
    -  当我们需要启动一个组件时，整个流程是这样的：
       -  首先，我们创建一个Intent对象，然后将它传递给操作系统。
       -  然后，系统会检测Intent，若是显式意图则直接启动组件，否则会依据Intent内部的信息进行匹配。
       -  接着，如果我们调用的startActivity来启动组件，那么系统会获取当前所有注册到系统中的Activity，并获取它们的<IntentFilter>。
       -  最后，让Intent对象和这些Activity的<IntentFilter>进行匹配，匹配成功就会启动该Activity，若有多个Activity都匹配成功，则系统会让用户选择启动哪一个。
       -  另外，组件可以有多个<IntentFilter>标签，只要该组件有一个匹配成功，则就能启动。


　　`IntentFilter`类与`<IntentFilter>`标签对应，它有类似于Intent对象的动作、数据、和分类。


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
　　对于一个要通过`Category`检测的`Intent`对象，在`Intent`对象中所包含的每个分类，过滤器中都必须得包含，过滤器能够列出Intent中不包含的分类，但是它不能忽略`Intent`对象中的任何分类。因此，原则上一个没有`category`的`Intent`对象应该始终通过这个检测，而不管过滤器中声明的分类。

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

#### 开始匹配 ####
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

## Fragment ##
　　`Android`在`3.0`中引入了`fragments`的概念，`Android3.0`是基于`Android`的平板电脑专用操作系统。
### 背景介绍 ###
<br>**问题是这样的：**

　　在一个小屏幕的设备上，一个`Activity`通常占据了整个屏幕，其内显示各种UI视图组件。但是当一个`Activity`被显示在一个大屏幕的设备上时，例如平板，总会显得有些不适应，因为平板的屏幕太大了，UI组件会被拉长、模糊，整个界面也显得空旷。

　　因此若想使`Activity`的UI组件在大屏幕中美观且充满整个屏幕，则就需要在其内添加更多的组件，但是这样一来，视图的层次结构就很复杂了。但层次结构复杂也许并不是问题的关键，对于两个功能相似的`Activity`来说，他们UI界面也会高度相仿，这也就意味着代码的重复量会大大增加（这个问题也存在于手机设备上，只不过在大屏幕设备上更为突出而已）。

　　因此`Android3.0`为了支持更加动态和灵活的UI设计，它引入了`fragments`的概念。

<br>**是什么？**

　　解决代码冗余最好的方法就是把各功能相似的`Activity`中那块相似的部分抽取出来，然后封装成一个类，以后就可以在需要使用的时候实例化一个对象放入`Activity`即可。在`Android3.0`中`Google`已经帮我们封装好了这个类，即`Fragment`，也就是说`Fragment`的作用就是用来封装各`Activity`中公用的组件，以便代码重用和管理。

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

    Fragment是在Android3.0中提供的，若想在Android2.x平台上使用Fragment则需要添加android-support-v4.jar库。

<br>　　还有一种应用场景，比如ActionBar上有多个Tab页，切换不同的Tab页时，Activity就显示不同的布局。在以前，我们可能会把所有布局都放到一个布局文件中，随着Tab的切换而执行setVisibility，这样做有两个问题：

    -  第一，Activity首次加载的控件很多，即便是通过延迟加载延缓解决这个问题，还有下面的问题。
    -  第二，布局文件里的控件的初始化、事件监听/处理等代码都得写在Activity中，不方便管理和移动。 
       -  也许你会说，封装成一个类不久行了。
       -  是的，Fragment就是Android帮我们封装好的，我们只需要使用Fragment来实现这几个Tab的界面即可。

　　也就是说，我们并不是只有在多个界面都需要显示相同的布局时才使用Fragment，上面这种情况也应该使用Fragment。

### 基本应用 ###
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


### 生命周期 ###

　　`Fragment`有自己的生命周期，并且生命周期直接被其所属的宿主`Activity`的生命周期影响。当`Activity`被暂停，那么在其中的所有`Fragment`也被暂停，当`Activity`被销毁，所有隶属于它的`Fragment`也被销毁。

　　管理`Fragment`的生命周期，大多数地方和管理`Activity`生命周期很像，和`Activity`一样。
　　`Fragment`生命周期各个阶段回调的方法如下图所示：
<center>
![](/img/android/android_2_4.png)
</center>

　　`Fragment`和`Activity`的生命周期方法对应关系图：
<center>
![](/img/android/android_2_5.png)
</center>

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

### 销毁重建 ###
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

# 第二节 BroadcastReceiver #

## 基础知识 ##
　　在现实世界中发生一个新闻后，广播电台会广播这个新闻给打开收音机的人，对这个新闻感兴趣的人会关注。
　　`Android`也提供了类似的机制，它将`系统开关机`、`时间变更`、`屏幕变暗`、`电池电量不足通知`、`抓图通知`等等事件封装成一个广播，当这些事件发生时它就会通知所有关注该事件的应用软件。

　　`Broadcast Receivers` （广播接收者）是应用程序中用来接收广播的一个组件。

<br>**广播接收者的特点：**

    -  广播接收者是静止的，它不会主动做任何事情，而总是等待着广播的到来。广播接收者像是一个时刻等待冲锋的士兵，而广播就是一个信号，士兵接到信号后就可以做一些事情了。
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
　　除此之外，无序广播相对有序广播消息传递的效率比较高，但各个接收者无法终止和修改广播，而有序广播的某个接收者在中途可以终止、修改广播。

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

<br>　　范例2：发送有序广播。
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
<br>　　在Android的广播机制中，动态注册的优先级是要高于静态注册优先级的，而且有的广播只接收动态注册广播接收者，因此我们需要学习如何动态注册广播接收器。

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

## 各版本变化 ##

　　本节将列出广播在各个Android版本中的表现。

### Android 3.1 ###

　　从`Android 3.1`开始的Android加入了一种保护机制，这个机制导致程序接收不到系统广播。

　　系统为Intent添加了两个flag，`FLAG_INCLUDE_STOPPED_PACKAGES`和`FLAG_EXCLUDE_STOPPED_PACKAGES`，用来控制Intent是否要对处于`stopped`状态的App起作用，如果一个App`安装后未启动过`或者`被用户在管理应用中手动停止`（强行停止）的话，那么该App就处于`stopped`状态了。

　　顾名思义：

    -  FLAG_INCLUDE_STOPPED_PACKAGES：表示包含stopped的App
    -  FLAG_EXCLUDE_STOPPED_PACKAGES：表示不包含stopped的App

　　从`Android 3.1`开始，系统会在所有广播上添加了一个flag（`FLAG_EXCLUDE_STOPPED_PACKAGES`），这样的结果就是一个处于`stopped`状态的App就不能接收系统的广播，这样就可以防止病毒木马之类的恶意程序。

　　正常情况下，如果你的App没有处于`stopped`状态，那么当用户重启手机的时候，你的App就可以接收到开机启动广播了。
　　但事实并非这么简单，国内的各大手机厂商对开机启动的权限，除了上面的限制外，还有自己的策略。

    -  比如小米自己维护了一个白名单，默认情况下只有白名单内的App才可以被设置为开机启动（即便你的应用程序没有处于stopped状态也不会接收到开机启动广播）。这个白名单中通常包含一些使用比较广泛的App，比如微信、QQ等。当然事情还是有转机的，小米针对每一个App都提供了一个设置，如果用户在小米手机中手动设置允许你的程序开机启动的话，那么你的App就可以接到开机广播了。


### Android 7.0 ###

　　如果有很多应用程序都注册了广播接收者，则当系统事件发生时，触发广播的系统事件可能导致所有这些应用快速连续消耗手机的系统资源，从而影响用户体验。
　　为了缓解此问题Android 7.0（API级别24）应用以下限制：

    -  从7.0开始应用在清单文件中静态注册的 CONNECTIVITY_ACTION 的广播接收器，不再会接到广播，但动态注册仍然可以。
    -  应用无法发送，接收 ACTION_NEW_PICTURE 或 ACTION_NEW_VIDEO 广播。此优化会影响所有应用，而不仅仅是针对API级别24的应用。

　　Android提供了多种方案来减轻对这些隐式广播的需求，如`JobScheduler`和`WorkManager`。


### Android 8.0 ###

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

# 第三节 Service #
## 基础知识 ##
<br>　　服务（`Service`）运行在程序的后台，通常用来完成一些现不需要用户界面但是需要一直运行的功能，如`处理网络事务(消息推送)`、`播放音乐`等。

　　此时就有疑问，既然Service用来执行耗时任务，那和开启一个`Thread`有什么区别？

    -  首先，Service最明显的一个优势是，提高进程的优先级。
       -  当系统内存不足时，系统会从众多后台进程中选择优先级最低的进程，予以杀掉。
       -  同时Android也规定了，内部没有Service的进程比有Service的进程要更优先被杀掉。
    -  然后，Service和Thread并不冲突。
       -  Service的各个生命周期方法都是在主线程中调用的，如果它内部需要执行耗时操作，那么同样要开启Thread。

<br>　　简单的说：

    -  对于一些简单的、短暂的http请求等异步操作可以使用Thread类，因为此时不需要考虑进程被杀掉的风险。
    -  对于长时间运行的、重要的耗时操作，如音乐播放、消息推送、上传下载等操作，应该为该操作启动一个服务，而不是简单的创建一个工作线程，这样可以提升进程的优先级，降低当在系统内存不足时，它被杀掉的几率。

<br>　　不过，除了执行耗时操作外，`Service`另一个重要的功能则是`进程间通信`（以后章节会介绍）。

## 普通Service ##
<br>　　你可以继承下面两个类之一来创建自己的Service类：

    -  Service：这是所有服务的基类，它的各个生命周期方法都是在应用程序的主线程中被调用。
    -  IntentService：Service类的子类，它使用工作线程（非UI线程）来依次处理启动请求。

<br>　　范例1：继承Service类。
``` java
package com.example.androidtest;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
public class MyService extends Service {

    // 当Service创建时，系统会调用这个方法。在Service被销毁之前，此方法只会被调用一次。
    public void onCreate() {
        super.onCreate();
    }

    // 此方法有两个调用时机：
    // 第一：onCreate被调用后，会接着调用此方法。
    // 第二：当Service已经启动后，有人再次调用startService方法试图启动服务时，此方法会被调用，但不会调用onCreate。
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    // 当Service销毁时，系统会调用这个方法。
    // 你应该使用这个方法来实现一些清理资源的工作，如清理线程等。
    public void onDestroy() {
        super.onDestroy();
    }

    // 当程序想通过调用bindService()方法跟这个Service绑定时，系统会调用这个方法，具体后述。
    // 你必须实现这个方法，因为它是抽象的，如果你不想处理绑定请求可以返回null。
    public IBinder onBind(Intent arg0) {
        return null;
    }
}
```
    语句解释：
    -  从onStartCommand方法中返回的值必须是以下常量，用来告诉系统当服务需要被杀死时，服务的重启策略：
       - START_NOT_STICKY：直到再次接收到新的Intent对象，这个服务才会被重新创建。
       - START_STICKY：立刻重启，但不会重新传递最后的Intent对象，而会传来null。
       - START_REDELIVER_INTENT：立刻重启，会重新传递最后的Intent对象给onStartCommand方法。
    -  Service类的所有生命周期方法都是在主线程中被调用的，这意味着如果你需要执行耗时操作的话，就必须自己开启一个线程，然后在线程中去执行。

<br>　　范例2：继承IntentService类。
``` java
package com.example.androidtest;
import android.app.IntentService;
import android.content.Intent;
public class MyIntentService extends IntentService {
    public MyIntentService() {
        // 由于IntentService类没有提供无参构造器，因此其子类必须显示调用有参构造器。
        super("MyIntentService");
    }

    // 此方法将在子线程中被调用，因此不要在其内部执行更新UI的操作。
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
    -  IntentService是Service类的子类，它内部会把所有接到的请求交给一个工作线程去执行，帮我们省去创建线程的操作。
    -  若接到新请求时IntentService并没有被启动，则会像普通Service那样，调用onCreate方法，且在onCreate方法中会创建一个队列，并开始处理新请求。
    -  若服务正在处理某个请求时，又接到新的请求，则新请求会被放到队列中等待，队列中的所有请求都按照先进先出的原则被依次处理。当队列中的所有请求都被处理完毕后，IntentService就会调用stopSelf(int)方法来终止自己。
    -  由于IntentService类的各个生命周期方法中，都对Service做了扩展，因此除非必要你不应该重写这些方法，重写时应该先调用父类的实现，同时你不应该重写onStartCommand方法。

<br>　　以上就是你做的全部：`一个构造器`和`一个onHandleIntent()方法的实现`。

<br>　　**何时使用?**
　　使用`IntentService`类实现服务的特点如下：

    -  任务按照先进先出顺序依次执行，同一时间无法执行一个以上的任务。
    -  任务一旦被安排后，无法撤销、终止。
　　因此`IntentService`类适合于对上述两种缺点无要求的应用场合。

<br>　　范例3：配置服务。
``` xml
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
    -  由于服务是Android四大组件之一，因此需要在<application>标签内配置，服务和Activity一样，可以指定意图过滤器。当需要启动某个服务时，Android系统同样会依次和已在系统中注册的服务进行匹配，匹配成功的服务将会被启动。

<br>　　范例4：有两种方法可以启动服务，分别是调用`startService()`和`bindService()`两个方法。

　　本节只介绍通过`startService()`方法启动服务的知识，它有如下几个特点：

    -  Service一旦启动，它就能够无限期的在后台运行，除非下面的两种情况发生：
       -  第一，系统内存不足，需要杀死Service所在的进程。
       -  第二，调用stopSelf方法或stopService方法来明确停止服务。
    -  通过startService方法启动的服务，会涉及到三个生命周期方法：
       -  首先，服务对象创建完毕后服务的onCreate方法被调用，执行一些初始化操作。
       -  然后，onCreate方法调用后，服务的onStartCommand方法被调用，开始运行服务。  
       -  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。


<br>　　范例5：关于停止服务。

    -  当调用stopSelf方法或stopService方法请求终止服务后，系统会尽快的销毁这个服务。
    -  但是，如果你的服务正在处理一个请求的时候，又接受到一个新的启动请求，那么在第一个请求结束时终止服务有可能会导致第二个请求不被处理。
    -  要避免这个问题，你能够使用stopSelf(int)方法来确保你请求终止的服务始终是基于最后启动的请求。
    -  也就是说，调用stopSelf(int)方法时，你要把那个要终止的服务ID传递给这个方法（这个ID是系统发送给onStartCommand方法的参数）。
    -  这样若服务在你调用stopSelf(int)方法之前收到了一个新启动请求，那这个ID就会因不匹配而不被终止。

## 绑定Service ##
　　服务允许应用程序组件通过调用`bindService()`方法来启动服务。

　　**问：为什么要使用此种方式?**
　　答：很多时候，服务用来完成一个耗时的操作，在服务运行的时候，用户可以通过Activity提供的界面控件，来调用服务中提供的方法，从而控制服务的执行。

　　但是，若通过`startService`方法启动服务，是无法返回该服务对象的引用，也就意味着没法调用服务中的方法。
　　通过绑定方式启动服务可以获取服务对象的引用。
　　因此，在你想要`Activity`以及应用程序中的其他组件跟服务进行交互（方法调用、数据交换）时，或者要把应用程序中的某些功能通过进程间通信（IPC）暴露给其他应用程序时，就需要创建一个绑定类型的服务。

<br>**生命周期方法**
　　绑定启动方式的服务会涉及到四个生命周期方法：
    -  首先，服务对象被创建后，服务的onCreate方法被调用，执行一些初始化操作。
    -  然后，在第一个访问者和服务建立连接时，会调用服务的onBind方法。 
    -  接着，当最后一个访问者被摧毁，服务的onUnbind方法被调用。
       -  最好不要在普通的广播接收者中通过绑定方式启动服务，因为广播接收者生命周期短暂。
    -  最后，当服务被销毁时，服务的onDestroy方法被调用，执行收尾工作。

<br>　　一个组件（客户端）可以调用`bindService()`方法来与服务建立连接，调用`unbindService()`方法来关闭与服务连接。多个客户端能够绑定到同一个服务，并且当所有的客户端都解绑以后，系统就会自动销毁这个服务（服务不需要终止自己）。
　　
<center>
![图的左边显示了用startService()方法创建服务时的生命周期，图的右边显示了用bindService()方法创建服务时的生命周期。](/img/android/android_2_11.png)
</center>

<br>　　范例1：创建绑定服务。
``` java
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
    语句解释：
    -  创建具有绑定能力的服务时，必须提供一个IBinder对象，它用于给客户端提供与服务端进行交互的编程接口。

<br>　　范例2：创建客户端。
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Intent intent = new Intent(this,MyService.class);
        // 1、bindService方法用来通过绑定方式来启动Service。
        // 2、bindService方法的三个参数：
        //    intent：要启动的服务
        //    conn：代表一个访问者指向service的连接。当服务被启动或停止时，会导致连接的建立与断开。当连接建立
        //          或断开时系统就会调用ServiceConnection内定义的回调方法。
        //    flags：设置服务启动的模式。
        bindService(intent, conn, BIND_AUTO_CREATE);
    }

    ServiceConnection conn = new ServiceConnection() {

        // 系统会在连接的服务突然丢失的时候调用这个方法，如服务崩溃时或被杀死时。在客户端解除服务绑定时不会调用。
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
    -  bindService方法的flags参数通常取值（后两个常量的具体作用暂不知道，一般会用第一个）：
       -  Context.BIND_AUTO_CREATE ：若服务当前未启动，则新建立一个服务对象。
       -  Context.BIND_DEBUG_UNBIND
       -  Context.BIND_NOT_FOREGROUND
    -  提示：bindService方法是异步方法，调用完此方法后，主线程会立刻返回。因此，程序中操作服务对象的那部分代码（第26行），应该写在成功建立连接之后。
    -  客户端（MainActivity）获得到Service的引用后，就可以调用其所提供的public方法了。 

<br>**管理绑定类型服务的生命周期：**
　　当服务从所有的客户端解除绑定时，`Android`系统会销毁它（除非它还被`startService()`方法启动了）。因此如果是纯粹的绑定类型的服务，你不需要管理服务的生命周期（`Android`系统会基于是否有客户端绑定了这个服务来管理它）。
　　但是，若你使用了`startService()`方法启动这个服务，那么你就必须明确的终止这个服务，因为它会被系统认为是启动类型的。这样服务就会一直运行到服务用`stopSelf()`方法或其他组件调用`stopService()`方法来终止服务。
　　另外，如果你的服务是启动类型的并且也接收绑定，那么当系统调用`onUnbind()`方法时，如果你想要在下次客户端绑定这个服务时调用`onRebind()`方法，你可以选择返回`true`。
<center>
![绑定服务的生命周期](/img/android/android_2_12.png)
</center>

## 系统内置服务 ##
　　在Android系统中内置了许多系统服务，它们各自对应不同的功能。常见的服务有：通知管理器、窗口管理器、包管理器等。
<br>
### 包管理器 ###
　　包管理器(PackageManager)可以获取当前用户手机中已安装`APK`文件中的信息（如`AndroidManifest`文件）。

<br>　　范例1：获取基本信息。
``` java
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
       -  packageName：获取PackageInfo所代表的应用程序的<manifest>标签的package属性的值。 
       -  versionCode：获取PackageInfo所代表的应用程序的<manifest>标签的versionCode属性的值。
       -  versionName：获取PackageInfo所代表的应用程序的<manifest>标签的versionName属性的值。
       -  permissions：获取PackageInfo所代表的应用程序内所有的<permission>标签。
       -  activities：获取PackageInfo所代表的应用程序内所有的<Activity>标签。
       -  若需要获取其它信息，请自行查阅API。

<br>　　范例2：获取所有的Activity。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        PackageManager mgr = this.getPackageManager();
        PackageInfo info;
        try {
            info = mgr.getPackageInfo(this.getPackageName(), PackageManager.GET_ACTIVITIES);
            System.out.println(info.activities);
        } catch (NameNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```
    语句解释：
    -  若getPackageInfo方法的第二个参数设置为0，则调用info.activities获得的将是null。

<br>　　范例3：获取ActivityInfo的基本信息。
``` java
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
    -  ActivityInfo类描述的是AndroidManifest文件中的<activity>标签。
    -  ActivityInfo类除了上面列出的name、icon、labelRes三个属性外还有其他属性，比较常用的还有一个launchMode属性，它用来指明Activity的启动模式：
       -  ActivityInfo.LAUNCH_MULTIPLE ：相当于standard模式。
       -  ActivityInfo.LAUNCH_SINGLE_TOP ：你懂的。
       -  ActivityInfo.LAUNCH_SINGLE_TASK ：你懂的。
       -  ActivityInfo.LAUNCH_SINGLE_INSTANCE ：你懂的。

<br>　　范例4：元数据。
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

<br>　　范例5：访问元数据。
``` java
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

<br>　　范例6：元数据 -- 图片资源。
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

<br>　　范例7：resource属性。
``` java
// 在Activity标签内配置：
<meta-data android:name="img" android:resource="@drawable/icon"/>

// 那么在程序中能够这么访问：
ImageView img = new ImageView(this);
img.setImageResource(metaData.getInt("img"));
setContentView(img);
```

    语句解释：
    -  元数据的value也可以使用android:resource属性为其赋值，android:resource保存资源数据的ID。在程序运行时，使用Bundle对象的getInt方法可以获取该资源数据的ID。

<br>　　范例8：用户程序和系统程序。
``` java
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
    -  ApplicationInfo类描述的是应用程序的<application>标签。
    -  ApplicationInfo的flags表示其所代表的Application标签的一个标记，通常用它来判断该应用程序是否是系统程序。

<br>　　PackageManager类还有一个比较常用的方法：
``` android
public abstract Intent getLaunchIntentForPackage (String packageName)
```
　　为它指定一个应用程序(包名)，它将返回一个能打开该包名对应的应用程序的入口`Activity`的`Intent`对象。
<br>
### 活动管理器 ###
　　本节内容主要是讲解`ActivityManager`的使用，通过它我们可以获得内存信息、进程信息，还可以终止某个进程。当然只能终止用户的进程，系统的进程是杀死不了的。
<br>　　ActivityManager常用的静态内部类如下：

    -  ActivityManager.MemoryInfo： 系统可用内存信息
    -  ActivityManager.RecentTaskInfo： 最近的任务信息
    -  ActivityManager.RunningAppProcessInfo： 正在运行的进程信息
    -  ActivityManager.RunningServiceInfo： 正在运行的服务信息
    -  ActivityManager.RunningTaskInfo： 正在运行的任务信息

<br>　　范例1：获取当前系统中所有Task。
``` java
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
       -  baseActivity：当前Task的栈底Activity 。
       -  numActivities：当前Task中的Activity的个数。
       -  topActivity：当前Task的栈顶Activity 。

<br>　　范例2：获取当前系统的内存使用情况。
``` java
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

<br>　　范例3：获取当前系统中的所有进程的信息。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        // 获取当前系统中所有正在运行的进程。若无任何进程运行，则返回null 。此List中的元素是无序的。
        List<RunningAppProcessInfo> list = manager.getRunningAppProcesses();
        for (RunningAppProcessInfo p : list) {
            // 三个字段依次表示：进程的名称、进程的id、进程的重要性。
            System.out.println(p.processName +","+ p.pid + "," + p.importance);
        }
    }
}
```
    语句解释：
    -  RunningAppProcessInfo用来描述当前内存中的一个进程的信息。
    -  importance值越小进程的优先级越高，常用取值为：
       -  RunningAppProcessInfo.IMPORTANCE_FOREGROUND：100
       -  RunningAppProcessInfo.IMPORTANCE_VISIBLE：200
       -  RunningAppProcessInfo.IMPORTANCE_SERVICE：300
       -  RunningAppProcessInfo.IMPORTANCE_BACKGROUND：400
       -  RunningAppProcessInfo.IMPORTANCE_EMPTY：500
       -  RunningAppProcessInfo.IMPORTANCE_GONE：1000
    -  需要注意的是，不同Android版本的划分规则会有不同，比如8.1的源码中使用 IMPORTANCE_CACHED 来代替 IMPORTANCE_BACKGROUND 。

<br>　　问：进程的优先级有什么用呢？

    -  当系统内存低并且其它进程要求立即服务用户的时候，Android系统可以决定在某个时点关掉一个进程，运行在这个进程中的应用程序组件也会因进程被杀死而销毁。
    -  当要决定要杀死哪个进程时，Android系统会权衡它们对用户的重要性，即依赖于那个进程的优先级。
    -  通常情况下，按照优先级从高到底排列，系统将进程划分为五个级别：
       -  前台进程、可见进程、服务进程、后台进程、空进程。

<br>**前台进程**
　　一个进程满足以下任何条件都被认为是前台进程：

    A.  进程持有一个正在跟用户交互的Activity对象（它的onResume方法已经被调用）。
    B.  进程持有一个正在前台运行的Service对象，这个Service已经调用了startForeground方法。
    C.  进程持有一个正在执行生命周期方法的Service对象（onCreate、onStart、或onDestroy）。
    D.  进程持有一个正在执行onReceive方法的BroadcastReceiver对象。
　　一般情况，在给定的时间内只有很少的前台进程存在，只有当设备已到达内存的饱和状态时，系统才会杀死一些前台进程来保持对用户界面的响应。

<br>**可见进程**
　　可见进程是指没有任何前台组件的一个进程，但是仍然能够影响用户在屏幕上看到的内容。如果满足下列条件之一，进程被认为是可见的：

    A.  进程持有一个不在前台的Activity，但是这个Activity依然对用户可见（它的onPause方法已经被调用）。
    B.  进程持有一个Service对象，该对象被一个正在跟用户交互的Activity所绑定。

<br>**服务进程**
　　服务进程是指持有了一个用`startService`方法启动的服务的进程，并且这个进程没有被归入上面介绍的两个分类。
　　虽然服务进程不直接跟用户看到的任何东西捆绑，但是，通常他们都在做用户关心的事情（如在后台播放音乐，或下载网络上的数据），除非前台和可见进程的内存不足，否则系统会一直保留它们。

<br>**后台进程**
　　后台进程是指持有一个用户当前不可见的`Activity`的进程（即`onStop`方法已经被调用）。
　　这些进程不会直接影响用户体验，并且为了给前台、可见、或服务进程回收内存，系统能够在任何时候杀死它们。
　　通常会有很多后台进程在运行，因此它们被保留在一个`LRU`（Least recently used）列表中以确保用户最近看到的那个带有`Activity`的进程最后被杀死。如果一个`Activity`正确的实现了它的生命周期方法，并且保存了当前的状态，那么杀死它的进程将不会影响用户的视觉体验，因为当用户返回到这个`Activity`时，这个`Activity`会恢复所有的可见状态。

<br>**空进程**
　　空进程是指不持有任何活动的应用程序组件的一个进程。保留这种进程存活的唯一原因是为了缓存的目的，以便提高需要在其中运行的组件的下次启动时间。
　　为了平衡进程缓存和基础内核缓存之间的整体系统资源，系统会经常杀死这些进程。

<br>特殊说明：

    -  Android会选择其中优先级最高的组件，来作为进程的级别。
    -  如一个进程持有一个Service和一个可见的Activity，那么这个进程就会被当作可见进程而不是服务进程。


<br>　　范例4：获取各个进程所占用的内存大小。
``` java
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
    语句解释：
    -  调用Formatter.formatFileSize来格式化显示字节数量。

<br>　　范例5：关闭进程。
``` java
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
<br>
### 传感器 ###
　　传感器是一种检测装置，能感受到被测量的信息，并能将检测感受到的信息，按一定规律变换成为电信号或其他所需形式的信息输出，以满足信息的传输、处理、存储、显示、记录和控制等要求。

　　目前，在Android中提供了6种传感器，这些传感器可以检测出手机当前所处的环境中的信息。

<br>　　范例1：android.hardware.Sensor类。

    -  方向传感器：Sensor.TYPE_ORIENTATION。
    -  重力传感器：Sensor.TYPE_ACCELEROMETER。
    -  光线传感器：Sensor.TYPE_LIGHT。
    -  磁场传感器：Sensor.TYPE_MAGNETIC_FIELD。
    -  距离传感器：Sensor.TYPE_PROXIMITY。
    -  温度传感器：Sensor.TYPE_TEMPERATURE。

<br>　　在`Sensor`类中没有提供`public`的构造器，若想构造一个`Sensor`对象，则可以使用系统提供的一个类`SensorManager`。

<br>　　范例1：获取方向传感器。
``` java
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
<br>　　由于手机所处的环境是不断变化的，因此在代码中通常会定义一个监听器，当外界环境改变时`SensorManager`就会调用监听器中的方法。

<br>　　范例2：监听传感器的数据变化。
``` java
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
    -  在registerListener()方法的第三个参数用来指明传感器每秒钟采样的频率。常见的取值为：
       -  SensorManager.SENSOR_DELAY_FASTEST：每秒80次。
       -  SensorManager.SENSOR_DELAY_GAME：每秒60次。
       -  SensorManager.SENSOR_DELAY_UI：每秒40次。
       -  SensorManager.SENSOR_DELAY_NORMAL：每秒20次。
    -  当传感器的数据发生变化时，系统会将相关数据封成SensorEvent对象并传递给onSensorChanged方法。
    -  SensorEvent有一个常用字段float[] values，传感器监听到的数据都保存在此数组中，对于不同的传感器，此数组的长度是不同的。对于方向传感器来说，values[0]表示手机当前指向的方向相对于北方的偏移角度。0北方、90东方、180南方、270西方。


## 各版本变化 ##

### Android 8.0 ###

　　在后台中运行的服务会消耗设备资源，这可能降低用户体验。 为了缓解这一问题，系统对这些服务施加了一些限制:

    -  第一，系统不再允许后台应用创建后台服务，当后台应用中尝试调用startService方法时会抛出IllegalStateException。
    -  第二，而即使是在应用前台状态时启动的Service，在应用退到后台的一小段时间后（几分钟）也会被系统停止(等同于stopSelf方法被调用)，不过绑定服务不会受此影响。

　　上面提到了`前台应用`和`后台应用`的概念，需要注意的是，用于服务限制目的的后台定义与用于内存管理目的的后台应用的定义不同；一个应用按照内存管理的定义可能处于后台，但按照能够启动服务的定义却可能处于前台。

　　对于服务限制来说，如果满足以下任意条件，应用将被视为处于前台，否则视为处于后台：

    -  具有可见 Activity（不管该 Activity 已启动还是已暂停）。
    -  具有前台服务。
    -  另一个前台应用已关联到该应用（不管是通过绑定到其中一个服务，还是通过使用其中一个内容提供程序）。 例如，如果另一个应用绑定到该应用的服务，那么该应用处于前台：
       - IME、壁纸服务、通知侦听器、语音或文本服务


　　现在就有一个问题了，如果想在后台应用中创建前台服务该怎么办？

    -  因为，在8.0之前，创建前台服务的方式通常是先创建一个后台服务，然后将该服务推到前台。
    -  但是，在8.0及其之后，如果后台应用startService将导致crash。

　　现在 Android O 中提供了新的`startForegroundService`方法，该方法本质上和`startService`相同，只是要求`Service`中必须调用`startForeground()`，它和`startService`相比，可以随时进行调用，即使当前应用不在前台。
　　我们可以这样来实现：
 
    -  首先，调用 startForegroundService 并传入要执行 Service 的 Intent。
    -  然后，在被启动的 Service 中创建一个通知，注意优先级需要至少是 PRIORITY_LOW。
    -  最后，在服务内部调用 startForeground(id, notification)，注意在创建服务后，有五秒钟来调用 startForeground()，如果没有及时调用，系统将终止 Service 并声明应用 ANR。


<br>　　接下来我们来验证一下：当应用被切到后台时，绑定方式启动的服务是否会在几分钟后被停止。验证的步骤为：

    -  首先，创建一个BaseService，它只负责定时打印一些Log，和一些公用代码。
    -  然后，创建两个继承了BaseService的Service类，一个接受普通方式启动，一个接受绑定方式启动。
    -  接着，在Activity_A中分别通过两种方式启动它们。
    -  最后，点击Home键将程序切到后台，观察Log输出。

<br>　　范例1-1：创建一个父类
``` java
public class BaseService extends Service {
    protected Handler handler;
    public void onCreate() {
        super.onCreate();
        handler = new Handler();
        System.out.println("______________ onCreate " + getName());
    }
    public String getName() {
        return "BaseService";
    }
    protected Runnable runnable = new Runnable() {
        public void run() {
            System.out.println("______________ tick " + getName());
            handler.postDelayed(this, 5000);
        }
    };
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(runnable);
        System.out.println("______________ onDestroy " + getName());
    }
    public IBinder onBind(Intent intent) {
        return null;
    }
}
```

<br>　　范例1-2：创建两个子Service
``` java
public class NormalService extends BaseService {
    public int onStartCommand(Intent intent, int flags, int startId) {
        System.out.println("______________ onStartCommand " + getName());
        handler.post(runnable);
        return START_STICKY;
    }
    public String getName() {
        return "普通服务";
    }
}

public class BindService extends BaseService {
    public IBinder onBind(Intent intent) {
        handler.post(runnable);
        System.out.println("______________ onBind " + getName());
        return new MyBinder();
    }
    public class MyBinder extends Binder {
        public BindService getService() {
            return BindService.this;
        }
    }
    public String getName() {
        return "绑定服务";
    }
}
```

<br>　　范例1-3：启动两个服务
``` java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        startService(new Intent(this, NormalService.class));
        bindService(new Intent(this, BindService.class), new ServiceConnection() {
            public void onServiceConnected(ComponentName name, IBinder service) {
                System.out.println("_____ 链接建立");
            }
            public void onServiceDisconnected(ComponentName name) {
                System.out.println("_____ 链接断开");
            }
        }, BIND_AUTO_CREATE);
    }
}
```

<br>　　通过观察输出得出结论：
 
    -  程序切到后台1分钟后，普通方式启动的服务会被杀掉，绑定仍然存活。
    -  绑定方式启动的服务会随着绑定它的组件销毁而销毁，除非是在Application中执行绑定。


<br>**本节参考阅读：**
- [后台服务限制](https://developer.android.google.cn/about/versions/oreo/background.html#services)
- [内存管理](https://developer.android.google.cn/topic/performance/memory-overview.html)
- [Android Oreo 中对后台任务的限制](https://zhuanlan.zhihu.com/p/29289780)

# 第四节 ContentProvider #

<br>　　请前往《第四章 通讯篇》里查看详细介绍。

<br><br>