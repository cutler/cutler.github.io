---
title: UI篇 第四章 自定义控件 - 基础入门
date: 2015-4-29 11:41:12
author: Cutler
categories: Android - 01 - 初级开发
---

　　`Android`系统内置了许多控件，如果这些控件不能满足需求，您可以自定义自己的控件，自定义的控件必须继承`View`类。

<br>**三种自定义控件的方式**
<br>　　按实现方式来划分的话，自定义View分为三种：自绘控件、组合控件、以及继承控件。

    -  自绘控件：View上所展现的内容全部都是我们自己绘制出来的。此种方式也是最难的，一般会通过直接继承View类来实现自定义控件。
    -  继承控件：如果对已有的控件进行小调整就能满足需求，那么可以通过继承它们并重写onDraw()方法来实现自定义控件。比如，继承EditText使之产生了带有下划线的记事本页面。
    -  组合控件：通过将几个系统原生的控件组合到一起，来实现自定义控件。比如，使用PopupWindow和Button来组合出一个下拉列表框等。

<br>　　为了更好的理解自定义控件的各个步骤，在正式开始之前，我们先来了解一些相关的知识点：Activity的组成。

# 第一节 Activity的组成 #
　　本节来介绍一下`Window`、`WindowManagerService`、`WindowManager`三个类。
## Window ##
　　我们都知道，在Android中，屏幕上所显示的控件是以Activity为单位进行组织的。
　　但是再深入点看的话，就会发现Activity其实主要是处理一些逻辑问题（比如生命周期的管理等），显示在屏幕上的控件并不是由它来管理的，而是交给了`Window`类。

　　不信的话，可以打开Activity类的源码，看一下它的setContentView方法：
``` java
private Window mWindow;
private WindowManager mWindowManager;

public void setContentView(@LayoutRes int layoutResID) {
    getWindow().setContentView(layoutResID);
    initWindowDecorActionBar();
}

public Window getWindow() {
    return mWindow;
}
```
    语句解释：
    -  从上面可以发现，Activity会转调用Window类的setContentView方法。
    -  再次声明，Android系统的源码每个版本之间都会有一些差别，所以笔者在本章以及以后章节中所贴出的源码，如果和你看到的源码不一致，那么请淡定！
       -  笔者使用的源码版本是：Android-23 。

<br>　　观察仔细点的话会发现Window是一个抽象类，为了能继续追踪源码，我们得先去查看`mWindow`是何时初始化的，进而找到实例化的是哪个类。
　　查看的过程以后再说，直接说结果吧：

    -  首先，当我们请求启动某个Activity时，系统会调用它的无参构造方法实例化一个它的对象。
    -  然后，会调用该对象的attach方法，执行初始化操作，而它的mWindow属性就是在attach方法中初始化的。

<br>　　那么就来看一下Activity的`attach`方法的代码：
``` java
final void attach(/*此处省略若干参数*/) {

    mWindow = new PhoneWindow(this);
    
    // 省略若干代码...

    // 依据一些参数，来初始化WindowManager对象。
    mWindow.setWindowManager(
            (WindowManager)context.getSystemService(Context.WINDOW_SERVICE),
            mToken, mComponent.flattenToString(),
            (info.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0);

    // 省略若干代码...

    // 为mWindowManager属性赋值。
    mWindowManager = mWindow.getWindowManager();

    // 省略若干代码...
}
```
    语句解释：
    -  其实Window类官方文档已经告诉我们了，该类只有一个唯一的子类android.view.PhoneWindow。
    -  如果继续追踪上面第8行代码的话，还可以知道mWindowManager所指向的对象将是WindowManagerImpl类型的。
    -  用一句话概括：“当Activity被实例化之后，会接着初始化它的mWindow、mWindowManager属性”。

<br>　　继续追踪就会发现，我们调用`setContentView`方法设置给Activity的布局，最终会由`PhoneWindow`类的`DecorView`管理。

　　这里先给出一个完整的示意图，后面会详细分析：

<center>
![Activity内部结构](/img/android/android_f05_01.png)
</center>

　　`DecorView`是`PhoneWindow`的内部类，继承自`FrameLayout`。还有一点需要知道的是：

    -  笔者之所以说Activity的控件是由DecorView管理的，而不说是由PhoneWindow管理的，是因为：
       -  DecorView是一个真正的View对象，我们设置给Activity的布局，最终会被放到DecorView里面。
       -  而PhoneWindow并不是一个View。

<br>　　回到刚才说的地方，我们来看一下`PhoneWindow`类的`setContentView`方法：
``` java
public void setContentView(int layoutResID) {
    // 省略若干代码...

    // mContentParent就是上图的R.id.content所对应的布局。
    if (mContentParent == null) {
        // mContentParent没有值就意味着DecorView没被初始化，下面就去初始化。
        installDecor();
    } else if (!hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
        // 如果已经初始化了，则删除现有的所有子View。
        mContentParent.removeAllViews();
    }

    if (hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
        final Scene newScene = Scene.getSceneForLayout(mContentParent, layoutResID,
                getContext());
        transitionTo(newScene);
    } else {
        // 将用户传递过来的布局，放入到mContentParent中。
        mLayoutInflater.inflate(layoutResID, mContentParent);
    }

    // 省略若干代码...
}
```
    语句解释：
    -  这段代码用来检测DecorView是否初始化完毕，然后再将layoutResID所对应的布局放到DecorView中。

<br>　　接着看一下`installDecor`、`generateDecor`、`generateLayout`方法：
``` java
private void installDecor() {
    if (mDecor == null) {
        // 创建DecorView。
        mDecor = generateDecor();
        // 省略若干代码...
    }
    if (mContentParent == null) {
        // 获取R.id.content所对应的布局，并把它赋值给mContentParent。
        mContentParent = generateLayout(mDecor);
        // 省略若干代码...
    }
}

protected DecorView generateDecor() {
    return new DecorView(getContext(), -1);
}

protected ViewGroup generateLayout(DecorView decor) {
    // 省略若干代码...

    // 依据当前设备的情况来决定使用哪个布局。
    int layoutResource;
    int features = getLocalFeatures();
    if ((features & (1 << FEATURE_SWIPE_TO_DISMISS)) != 0) {
        layoutResource = R.layout.screen_swipe_dismiss;
    } else if ((features & ((1 << FEATURE_LEFT_ICON) | (1 << FEATURE_RIGHT_ICON))) != 0) {
        // 省略若干代码...
    } else if ((features & ((1 << FEATURE_PROGRESS) | (1 << FEATURE_INDETERMINATE_PROGRESS))) != 0
            && (features & (1 << FEATURE_ACTION_BAR)) == 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_CUSTOM_TITLE)) != 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_NO_TITLE)) == 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_ACTION_MODE_OVERLAY)) != 0) {
        // 省略若干代码...
    } else {
        layoutResource = R.layout.screen_simple;
    }

    // 装载布局，并将它放入到DecorView中。
    View in = mLayoutInflater.inflate(layoutResource, null);
    decor.addView(in, new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT));
    // 这个mContentRoot在上面的图中有标注。
    mContentRoot = (ViewGroup) in;

    // 从DecorView中查找出id为R.id.content的布局。
    ViewGroup contentParent = (ViewGroup)findViewById(ID_ANDROID_CONTENT);
    
    // 省略若干代码...

    return contentParent;
}

public View findViewById(@IdRes int id) {
    return getDecorView().findViewById(id);
}

```
    语句解释：
    -  至此也就看明白了，传递给setContentView方法的布局，最终会被放入到DecorView中。
    -  第23行代码用来获取当前窗口配置，后面会依据该方法的返回值来决定使用哪个布局。
       -  例如，窗口配置类型包括FullScreen(全屏)、NoTitleBar(不含标题栏)等。

<br>　　另外，我们可以使用Activity的`requestFeature()`方法来修改窗口配置，不过该方法必须在`setContentView`之前调用。
　　从`PhoneWindow`类的`requestFeature`方法可以看出，若在`setContentView`之后修改窗口配置，会抛异常：
``` java
@Override
public boolean requestFeature(int featureId) {
    if (mContentParent != null) {
        throw new AndroidRuntimeException("requestFeature() must be called before adding content");
    }

    // 省略若干代码...

    return super.requestFeature(featureId);
}
```

<br>　　默认情况下，`DecorView`内部只有一个子元素，也就是上面说的`mContentRoot`，而且`mContentRoot`一般是`LinearLayout`的子类，里面包含`标题栏`和`内容区域`两部分：
``` xml

<!--   android-sdk\platforms\android-8\data\res\layout\screen.xml   -->

<!-- Title bar and content -->
<LinearLayout  xmlns:android="http://schemas.android.com/apk/res/android"
    android:fitsSystemWindows="true"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <!-- Title bar -->
    <RelativeLayout android:id="@android:id/title_container"
        style="?android:attr/windowTitleBackgroundStyle"
        android:layout_width="match_parent"
        android:layout_height="?android:attr/windowTitleSize" >

        <!-- 此处省略若干行代码 -->

    </RelativeLayout>

    <!-- Content -->
    <FrameLayout android:id="@android:id/content"
        android:layout_width="match_parent"
        android:layout_height="0dip"
        android:layout_weight="1"
        android:foregroundGravity="fill_horizontal|top"
        android:foreground="?android:attr/windowContentOverlay"
    />
</LinearLayout>
```
    语句解释：
    -  我们调用Activity的setContentView()方法设置的布局，最终会以子结点的形式加入到这个FrameLayout中。

<br>　　比如，我们可以在`Activity`中通过代码来控制`内容区域`的显示与隐藏。
　　范例1：隐藏`contentView`。
``` java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // FrameLayout的id为android.R.id.content。
        findViewById(android.R.id.content).setVisibility(View.GONE);
    }
}
```
    语句解释：
    -  您可以直接输出findViewById(android.R.id.content)的值来验证是否是一个帧布局。
    -  你也可以在onCreate方法中隐藏掉标题栏、状态栏，具体的代码请自行搜索。

## WindowManagerService ##
　　通过上面的分析，我们知道DecorView是何时创建的了，但它是如何被添加到屏幕上的呢？

    答案是：通过WindowManagerService类来完成的。

<br>　　下面给出一张示意图：

<center>
![Activity深层结构图](/img/android/android_f05_02.png)
</center>

　　我们从下往上看这张图，整个图分为三部分：

    -  SdkClient部分表示Activity的内部结构，由PhoneWindow和DecorView组成。
    -  FrameworkServer端用来完成整个Android系统的窗口、事件捕获和分发、输入法等的控制。
    -  FrameworkClient用来连接SdkClient端和FrameworkServer端，它通过Binder机制让两者跨进程通信。
    -  从上图可以看出，WindowManagerService（简称WMS）只会和ViewRoot类通信，DecorView则是通过WindowManager类来与ViewRoot通信。

<br>**添加Activity到屏幕**

　　比如我们现在新建一个Activity，那么此时系统会这么执行：
    -  第一，先实例化Activity对象，然后调用attach方法、setContentView方法初始化。
    -  第二，当需要显示Activity时，系统会使用WindowManager类来将DecorView添加到屏幕上。
    -  第三，但WindowManager并不会执行添加操作，它会为DecorView创建一个ViewRoot对象，然后再请ViewRoot去添加。
    -  第四，但ViewRoot实际上也不会执行添加操作，它会使用Binder机制（跨进程）访问远程的WMS类，也就是说添加操作会由WMS来完成。

　　上面只是说了一下大体执行步骤，下面就来跟随源码一起，观察一个新Activity被添加到屏幕中的过程。

<br>　　第一步，当系统准备resume一个Activity时，会调用`ActivityThread`的`handleResumeActivity`方法：
``` java
final void handleResumeActivity(IBinder token,
    boolean clearHide, boolean isForward, boolean reallyResume) {

    // 省略若干代码...

    if (r.window == null && !a.mFinished && willBeVisible) {
        r.window = r.activity.getWindow();
        View decor = r.window.getDecorView();
        decor.setVisibility(View.INVISIBLE);
        ViewManager wm = a.getWindowManager();
        WindowManager.LayoutParams l = r.window.getAttributes();
        a.mDecor = decor;
        l.type = WindowManager.LayoutParams.TYPE_BASE_APPLICATION;
        l.softInputMode |= forwardBit;
        if (a.mVisibleFromClient) {
            a.mWindowAdded = true;
            wm.addView(decor, l);
        }

    // If the window has already been added, but during resume
    // we started another activity, then don't yet make the
    // window visible.
    } else if (!willBeVisible) {
        if (localLOGV) Slog.v(
            TAG, "Launch " + r + " mStartedActivity set");
        r.hideForNow = true;
    }

    // 省略若干代码...
}
```
    语句解释：
    -  从第17行代码可以看出来，系统会调用WindowManager的addView方法来将DecorView添加到屏幕上。
    -  通过前面的分析可以知道，实际上调用的是WindowManagerImpl类的addView方法。
    -  继续跟进的话，就会看到最终会调用WindowManagerGlobal的addView方法。

<br>　　第二步，查看`WindowManagerGlobal`类的`addView`方法：
``` java
public void addView(View view, ViewGroup.LayoutParams params,
        Display display, Window parentWindow) {

    // 省略若干代码...

    ViewRootImpl root;
    View panelParentView = null;

    // 省略若干代码...

    root = new ViewRootImpl(view.getContext(), display);

    // 省略若干代码...

    root.setView(view, wparams, panelParentView);

    // 省略若干代码...
}
```
    语句解释：
    -  此方法里创建一个ViewRootImpl对象，这个对象很重要：
       -  当WMS需要分发事件、绘制控件时都会通知ViewRootImpl，然后再由ViewRootImpl来通知DecorView。
       -  相应的，当想往屏幕上添加控件时，也得通过ViewRootImpl类来将控件传递给WMS。
    -  第15行代码调用了ViewRootImpl的setView方法，同时将DecorView传递过去。

<br>　　第三步，查看`ViewRootImpl`类的`setView`方法：
``` java
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {

    //  持有DecorView的引用。
    mView = view;

    // 省略若干代码...

    // 调用WindowManagerService来执行添加操作。
    res = mWindowSession.addToDisplay(mWindow, mSeq, mWindowAttributes,
            getHostVisibility(), mDisplay.getDisplayId(),
            mAttachInfo.mContentInsets, mAttachInfo.mStableInsets,
            mAttachInfo.mOutsets, mInputChannel);

    // 省略若干代码...
}

```
    语句解释：
    -  此方法第4行代码，首先保存了DecorView的引用，因为以后会用到它。
    -  可以把WindowSession类理解为WMS抛给咱们进程的回调，第9行代码调用addToDisplay方法来请求WMS执行一些初始化操作。当然此时屏幕上还没有绘制任何内容，不过我们就不继续向下深入了，只需要知道控件的绘制等操作是在WMS那端完成的即可。

<br>**分发输入事件**

　　除了负责往屏幕上添加和删除控件外，WMS还会用来分发输入事件。

　　以触摸事件为例：

    触摸事件是由Linux内核的一个Input子系统来管理的(InputManager)，Linux子系统会在/dev/input/这个路径下创建硬件输入设备节点(这里的硬件设备就是我们的触摸屏了)。当手指触动触摸屏时，硬件设备通过设备节点像内核(其实是InputManager管理)报告事件，InputManager经过处理将此事件传给Android系统的一个系统Service —— WindowManagerService 。

<br>　　当WMS接收到一个输入事件时，会按照下面的路线传递：

    -  首先，把事件传递给当前前台Activity的ViewRootImpl类。
    -  然后，ViewRootImpl又会将事件传递给它的内部类ViewPostImeInputStage，该类依据事件的类型来调用不同的方法：
       -  processPointerEvent方法：处理触屏事件。
       -  processTrackballEvent方法：处理轨迹球事件。
       -  processKeyEvent方法：处理键盘事件。

　　接着，同样以触屏事件为例，`processPointerEvent`方法在接到事件后，源代码如下所示：
``` java
private int processPointerEvent(QueuedInputEvent q) {
    final MotionEvent event = (MotionEvent)q.mEvent;

    mAttachInfo.mUnbufferedDispatchRequested = false;
    // 将事件传递给DecorView的dispatchPointerEvent方法。
    boolean handled = mView.dispatchPointerEvent(event);
    if (mAttachInfo.mUnbufferedDispatchRequested && !mUnbufferedInputDispatch) {
        mUnbufferedInputDispatch = true;
        if (mConsumeBatchedInputScheduled) {
            scheduleConsumeBatchedInputImmediately();
        }
    }
    return handled ? FINISH_HANDLED : FORWARD;
}
```
    语句解释：
    -  从第6行代码可以看到调用了DecorView的dispatchPointerEvent方法，该方法继承自View类。

　　接着来看一下View类的`dispatchPointerEvent`方法：
``` java
public final boolean dispatchPointerEvent(MotionEvent event) {
    // 如果当前处于触摸模式，则调用View类的dispatchTouchEvent方法。
    if (event.isTouchEvent()) {
        return dispatchTouchEvent(event);
    } else {
        return dispatchGenericMotionEvent(event);
    }
}
```
    语句解释：
    -  就像我们看到的那样，一般情况下，会接着转调用View类的dispatchTouchEvent方法。

　　接着，看一下`DecorView`的`dispatchTouchEvent`方法：
``` java
public boolean dispatchTouchEvent(MotionEvent ev) {
    final Callback cb = getCallback();
    return cb != null && !isDestroyed() && mFeatureId < 0 ? cb.dispatchTouchEvent(ev)
            : super.dispatchTouchEvent(ev);
}
```
    语句解释：
    -  这里的Callback是一个关键点，实际上它就是DecorView所属的Activity。
    -  在Activity的attach方法中可以找到初始化的代码：“mWindow.setCallback(this);”。

<br>　　分析到此也就明白了，输入事件的传递顺序为：

    WMS -> ViewRootImpl -> DecorView -> Activity 

<br>**执行绘制操作**

　　与分发输入事件的过程类似，当系统需要绘制Activity的界面时，也会执行下面的步骤：

    -  首先，调用ViewRootImpl的performTraversals方法。
    -  然后，该方法依据具体的情况来调用不同的子方法：
       -  performMeasure方法：执行测量操作。其内部会转调用DecorView的measure方法。
       -  performLayout方法：执行布局操作。其内部会转调用DecorView的layout方法。
       -  performDraw方法：执行绘制操作。其内部会转调用DecorView的draw方法。

　　其实`DecorView`类的`measure`、`layout`、`draw`三个方法都是继承自View类，而且我们稍后也会遇到它，所以此处先将它们列出来，混脸熟。

<br>**本节参考阅读：**
- [Android 窗口管理](http://1025250620.iteye.com/blog/1779670)
- [Android Touch事件的分发过程](http://www.ithao123.cn/content-2273147.html)
- [Android 事件分发机制详解](http://stackvoid.com/details-dispatch-onTouch-Event-in-Android/)

## WindowManager ##
　　`Activity`、`Dialog`、`Toast`里的控件，都是通过`WindowManager`来添加到屏幕上的，因此我们先来看一看该类的用法。

### 基础用法 ###
　　接下来，从最简单的范例开始，一步步的介绍`WindowManager`类。

<br>　　范例1：添加一个`TextView`。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 将Activity的引用传递过去。
        addViewToScreen(this);
    }

    private void addViewToScreen(Context context){
        // 首先，获取一个WindowManager对象。
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        // 然后，创建布局参数。
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        // 接着，创建一个按钮。
        Button button = new Button(context);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "click", Toast.LENGTH_SHORT).show();
            }
        });
        button.setText("请点击这个按钮");
        // 最后，将载入的内容放到屏幕中。
        manager.addView(button, params);
    }
}
```
    语句解释：
    -  添加到屏幕上的View对象，既可以是使用LayoutInflater来载入一个布局文件，也可以是通过代码来new出来的View对象。
    -  运行本范例时，我们就可以在屏幕的中央看到按钮了。

<br>　　程序运行后就会发现一个问题：

    -  除了按钮之外屏幕上的任何东西都没法点击了。
    -  这是因为，默认情况下，通过WindowManager添加到屏幕中的控件会拦截所有事件。

<br>　　我们可以通过给`WindowManager.LayoutParams`类的`flags`属性设置值来解决这个问题：
``` java
params.flags =
    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
```
    语句解释：
    -  FLAG_NOT_FOCUSABLE表示View不需要获取焦点，也不需要接收各种输入事件，此标记会同时启用FLAG_NOT_TOUCH_MODAL。
    -  FLAG_NOT_TOUCH_MODAL表示系统会将View区域以外的单击事件传递给底层控件，区域以内的单击事件则由View自己处理。
    -  FLAG_SHOW_WHEN_LOCKED可以让Window对象显示在锁屏界面上，这个Flag需要作用到Window对象上，具体用法请自行搜索。
    -  如果想为LayoutParams指定多个flag，则flag之间使用“|”间隔。

<br>　　解决了这个问题之后，又发现如果我们点击`Home`键，那么屏幕上的按钮就会随着`Activity`一起被切到后台。
　　如果想让按钮一直显示在屏幕上，而不随着`Activity`一起隐藏，那么可以这么写：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 将Activity的引用传递过去。
        addViewToScreen(getApplicationContext());
    }

    private void addViewToScreen(Context context) {
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        // 为type字段赋值。
        params.type = WindowManager.LayoutParams.TYPE_PHONE;
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        Button button = new Button(context);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                System.out.println("click");
                Toast.makeText(getApplicationContext(), "click", Toast.LENGTH_SHORT).show();
            }
        });
        button.setText("请点击这个按钮");
        manager.addView(button, params);
    }
}
```
    语句解释：
    -  本范例中主要修改了两处代码，这两处缺一不可：
       -  将传递给addTextViewToScreen()方法的Activity对象改为Application对象。
       -  将params.type属性赋值为TYPE_PHONE。常用取值为：
          -  TYPE_PHONE ：手机级别，即表示在所有应用程序之上，但在状态栏之下。
          -  TYPE_SYSTEM_ALERT ：系统窗口级别。比如：显示电量低时弹出的Alert对话框。
          -  TYPE_SYSTEM_OVERLAY ：系统窗口之上的级别，此级别的控件无法响应点击事件。
    -  创建浮动窗需要添加下面这个权限：
       -  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    -  如果你是小米手机则默认是无法在屏幕上添加View的，去应用程序设置里，把权限给打开即可。

<br>**优先级**
　　事实上`WindowManager`中可以放置很多个`View`（控件），控件之间有优先级之分，`优先级高的将被放到优先级低的上面`。若最高优先级控件的宽高是`“MATCH_PARENT”`，则其下面的控件都将被完全遮住，`若优先级相同则后加入的会被放到上面显示`。
<br>　　我们来看一下下面的代码：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone1");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone2");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY, "Overlay");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_SYSTEM_ALERT, " Alert ");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone3");
    }
    static int offsetY;
    private void addTextViewToScreen(Context context, int type, String text){
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = 70;
        params.type = type;
        // 设置View在y轴上的坐标值，相应的也可以设置x值。
        params.y = offsetY;
        offsetY += 60;
        TextView textView = new TextView(context);
        textView.setText(text);
        manager.addView(textView, params);
    }
}
```

<br>　　程序的运行效果为：

<center>
![](/img/android/android_b09_01.png)
</center>

<br>　　从上图可以看出：

    -  Phone2与Phone1是同级别的，但是Phone2却在Phone1上面。
    -  Overlay的级别最高，所以它压在了Phone2上面。
    -  Alert的级别第二高，虽然是在Overlay之后添加的，但是它任然被放到了Overlay下面。
    -  Phone3被压在了Alert下面。

<br>**删除和更新**

<br>　　范例1：从屏幕中移除一个已经存在的控件。
``` java
windowManager.removeView(destView);
```

<br>　　范例2：更新屏幕中一个已经存在的控件。
``` java
// 让y轴坐标偏移100个像素
mParams.y += 100;
// 依据最近的mParams中的信息（x、y、width、height等）来重新设置view的显示效果。
mWindowManager.updateViewLayout(view, mParams);
```
    语句解释：
    -  这里所说的更新控件，其实就是更新控件的LayoutParams对象。
<br>
### 百度安全卫士 ###
　　如果你基础不错的话，通过上面学的知识，就可以模仿`360的小火箭特效`了（具体请参考郭霖的博客），笔者仿写了一个百度安全卫士内存清理动画的`Demo`，程序运行效果如下：

<center>
![](http://img.blog.csdn.net/20150602150418233?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2l0aHViXzI4NTU0MTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
</center>

　　从上图中可以看出，仿写的效果和正牌还是有一些差距的，但是通过这个`Demo`可以让大家更深刻的理解`WindowManager`类可以做哪些事情。

　　[点击下载源码](http://download.csdn.net/detail/github_28554183/8764099)

　　如果你没有`Android Studio`环境，那么可以去`AndroidTest\app\build\outputs\apk`目录找到`apk`直接安装运行。

<br>**本节参考阅读：**
- [Android桌面悬浮窗效果实现，仿360手机卫士悬浮窗效果](http://blog.csdn.net/guolin_blog/article/details/8689140)
- [Android桌面悬浮窗进阶，QQ手机管家小火箭效果实现](http://blog.csdn.net/guolin_blog/article/details/16919859)

# 第二节 Hello World #
　　为了对自定义控件有个整体的认识，接下来我们先来写一个`HelloWorld`，其中涉及到的知识后面会详细介绍。

<br>　　范例1：`MyView`。
``` java
// 所有自定义控件都必须继承View或View的子类。
public class MyView extends View {
    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }
    // 当通过XML标签来创建View对象时，调用此方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}
```
    语句解释：
    -  我们有两种方式来创建View对象：
       -  第一种，在代码中通过new关键字，直接实例化View对象。
       -  第二种，在XML中使用标签来创建View对象。
    -  这两种方式分别会导致上面两个构造方法的调用。

<br>　　然后，我们来重写`onDraw`方法，该方法继承自`View`类，当系统需要绘制某个`View`时，就会调用该`View`对象的`onDraw`方法执行绘制操作。

<br>　　范例2：`MyView`。
``` java
public class MyView extends View {

    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }
    // 当通过XML标签来创建View对象时，调用此方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 在当前控件上写一行文字。
        Paint p = new Paint();
        p.setTextSize(72);
        canvas.drawText("Hello World!!!", 0, 100, p);
    }
}
```
    语句解释：
    -  对于onDraw方法里的代码，暂且知道它们的作用即可，每行代码的具体含义后面会有详细的介绍。

<br>　　接着，在布局文件中使用我们自定义的控件：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.cutler.demo.common.view.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

</LinearLayout>
```
    语句解释：
    -  使用自定义控件时，控件的名称要包含包名。
    -  由于笔者将MyView放到了com.cutler.demo.common.view包中，所以才这么写。

<br>　　最后，程序的运行效果如下图所示：

<center>
![](/img/android/android_b08_05.png)
</center>

<br>　　提示：

    -  在Android中，View类占据了屏幕上一个“矩形区域”，并负责绘制和处理事件。
    -  从整体上来看，Activity内的所有View按照从上到下的顺序，排列成了一个“树型结构”，我们把这个树形结构称为“View树”、“视图树”。

# 第三节 生命周期方法 #
　　在继承了`View`类且重写完构造方法后，接着你就可以根据自己的需要来重写`View`所提供的一些回调方法了。你不需要重写所有的方法，实际上你可以从仅重写`onDraw(android.graphics.Canvas)`方法开始，但是本节将会详细讲解`View`类的各个回调方法的调用时机。

　　首先，要知道的是，任何一个视图都不可能凭空突然出现在屏幕上，它们都是要经过非常科学的绘制流程后才能显示出来的。
　　然后，当`Activity`获取焦点的时候，它就需要绘制它的`View树`了。
　　接着，整个`View树`会从根节点开始，依次执行绘制。
　　最后，每个`View`对象从创建到结束的整个生命周期中，会经历多个阶段：创建、布局、绘制、事件处理、焦点等，每个阶段中都提供了一个或多个回调方法。

## 创建阶段 ##
　　在`View`的创建阶段中，框架会首先调用该`View`的构造方法进行对象的初始化，通常在你自定义的`View`类中会定义两个不同的构造器，并在其内部来调用父类的构造器。

　　在构造方法返回之后，系统会进行如下判断： 

    -  若当前控件继承自View类，则构造方法执行完毕后会接着调用它的onFinishInflate方法。
    -  若当前控件继承自ViewGroup或其子类，则将在当前控件的所有子View的onFinishInflate方法都调用完成后，才会调用它的onFinishInflate方法。

<br>　　`onFinishInflate`方法的一个比较常见的应用场景是：

    -  你自定义了一个ViewGroup，它支持在XML文件中使用，这就不可避免的在它的标签里包含其它子标签。
    -  如果你想在代码中获取到它的子标签的引用，那么就应该在这个方法里写，而不是在构造方法里。这是因为，当ViewGroup的此方法被调用时，意味着它所包含的所有子控件也都加载完了（但只是加载完毕，宽高什么的都没测量）。

<br>　　假设我们有如下的布局文件：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.cutler.demo.common.view.MyViewGroup
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <com.cutler.demo.common.view.MyView
            android:id="@+id/myView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />

    </com.cutler.demo.common.view.MyViewGroup>

</LinearLayout>
```

<br>　　然后，`MyViewGroup`类的代码为：
``` java
public class MyViewGroup extends LinearLayout {

    private MyView myView;

    public MyViewGroup(Context context) {
        super(context);
    }

    public MyViewGroup(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        myView = (MyView) findViewById(R.id.myView);
    }

}
```
    语句解释：
    -  程序运行是，会按照下面的顺序调用：
       -  首先，调用MyViewGroup的构造方法。
       -  然后，调用MyView的构造方法。
       -  接着，调用MyView的onFinishInflate方法。
       -  最后，再调用MyViewGroup的onFinishInflate方法。

<br>　　注意：如果你的控件不是从`XML`中创建的（而是通过代码`new`出来的），那么不会导致`onFinishInflate`方法调用。

<br>　　创建阶段完成后，还有三个比较重要的阶段：`测量`、`布局`、`绘制`。

## 测量阶段 ##
　　测量（`measure`）指的是对View的尺寸进行测量，因为父控件只有知道了每个子View的尺寸之后，它才能正确的摆放子View（比如防止子View重叠等）。
　　因此在创建完View之后，系统首先要做的就是测量View的尺寸。

<br>　　前面已经分析过，当系统需要测量View时，会调用`DecorView`的`measure`方法，它内部的代码如下：
``` java
public final void measure(int widthMeasureSpec, int heightMeasureSpec) {

    // 省略若干代码...

    if (cacheIndex < 0 || sIgnoreMeasureCache) {
        // measure ourselves, this should set the measured dimension flag back
        onMeasure(widthMeasureSpec, heightMeasureSpec);
        mPrivateFlags3 &= ~PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
    }

    // 省略若干代码...
}
```
    语句解释：
    -  measure方法定义在View中，并且是final的，子类没法去重写它。
    -  简单的说在measure方法内，就做了三件事：
       -  首先，在测量之前执行一些预处理操作。
       -  然后，在上面第7行代码中调用了onMeasure方法，开始正式的测量工作。
       -  最后，对测量的结果进行收尾处理。
    -  由于一个View到底需要多少宽高只有它自己才知道，因此系统在View类中提供了onMeasure()方法供子类重写，你只需要在该方法内部执行测量操作即可，当然可以不重写它，因为View提供了默认的实现。

<br>　　在讲解如何重写`onMeasure()`方法进行测量之前，需要先介绍一下`MeasureSpec`类。

### MeasureSpec ###
　　首先让`MyView`类重写`onMeasure`方法，但是在其内部会直接调用父类的实现：
``` java
public class MyView extends View {
    public MyView(Context context) {
        super(context);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        // 我们不做任何操作，只是输出参数的值。
        System.out.println(widthMeasureSpec + "," + heightMeasureSpec);
    }
}
```
    语句解释：
    -  从onMeasure方法的两个参数的名字来看，它们应该是表示宽度和高度，但是在程序运行时输出的值却是类似于：
       -  -2147482568,-2147481937
       -  1073742904,-2147481937
    -  这他妈根本看不懂啊，逗爹呢？ 

<br>　　其实`onMeasure`方法的两个参数虽然是`int`类型的，但是我们称它们为`MeasureSpec`：

    -  MeasureSpec是一个32位的int值，高2位代表SpecMode（测量模式），低30位代表SpecSize（测量尺寸）。
    -  MeasureSpec通过将SpecMode和SpecSize打包成一个int值来避免过多的对象内存分配。而且为了方便操作，MeasureSpec类提供了打包和解包的方法。
    -  SpecMode和SpecSize也使用int值表示。
　　总之一句话，“系统之所以使用int值，就是为了节省内存分配，这样只需要使用1个int值就能表示两个数据”。

<br>　　既然这两参数是混合值，那么在使用它们之前，首先得使用`MeasureSpec`类来拆分出`SpecMode`和`SpecSize`。

　　范例1：获取`mode`与`size`。
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);

    // 获取widthMeasureSpec中的mode值。
    int widthMode = MeasureSpec.getMode(widthMeasureSpec);
    // 获取widthMeasureSpec中的size值。
    int widthSize = MeasureSpec.getSize(widthMeasureSpec);
    int heightMode = MeasureSpec.getMode(heightMeasureSpec);
    int heightSize = MeasureSpec.getSize(heightMeasureSpec);
}
```

<br>　　其中`size`指的是尺寸，`mode`指的是模式，常见的模式有： 

    -  MeasureSpec.EXACTLY：精确尺寸。
       -  当控件的layout_width或layout_height指定为具体数值(如50dip)或FILL_PARENT时，mode的值会为EXACTLY。
       -  当mode是EXACTLY时，表示父视图希望子视图的大小应该是由size的值来决定的。
    -  MeasureSpec.AT_MOST：最大尺寸。
       -  当控件的layout_width或layout_height指定为WRAP_CONTENT时，mode的值会为AT_MOST。
       -  当mode是AT_MOST时，size给出了父控件允许的最大尺寸，此时控件尺寸只要不超过父控件允许的最大尺寸即可。
    -  MeasureSpec.UNSPECIFIED：未指定尺寸。
       -  这种情况比较少见，不太会用到，笔者也没搞清楚。

<br>　　从上面的描述可以看出来，`MeasureSpec`的值与`LayoutParams`有关系，下面就具体介绍。

### LayoutParams ###
　　当系统需要测量控件尺寸时，会从DecorView开始，从上到下依次测量View树中的每一个控件。在测量时，每一个子View的`onMeasure`方法的参数，都是由其父View传递过来的。

    父View会综合自身的情况以及子控件的LayoutParams来计算出需要传递给子控件的MeasureSpec值。

<br>　　而且，DecorView和普通View的`MeasureSpec`的计算过程略有不同，我们分开来看。

<br>**DecorView**
　　对于DecorView来说，它的`MeasureSpec`值是在`ViewRootImpl`中的`measureHierarchy`方法中计算的，代码：
``` java
// desiredWindowWidth和desiredWindowHeight是屏幕的尺寸
childWidthMeasureSpec = getRootMeasureSpec(desiredWindowWidth, lp.width);
childHeightMeasureSpec = getRootMeasureSpec(desiredWindowHeight, lp.height);
performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
```
　　接着再看一下`getRootMeasureSpec`方法的代码：
``` java
private static int getRootMeasureSpec(int windowSize, int rootDimension) {
    int measureSpec;
    switch (rootDimension) {

    case ViewGroup.LayoutParams.MATCH_PARENT:
        // Window can't resize. Force root view to be windowSize.
        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.EXACTLY);
        break;
    case ViewGroup.LayoutParams.WRAP_CONTENT:
        // Window can resize. Set max size for root view.
        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.AT_MOST);
        break;
    default:
        // Window wants to be an exact size. Force root view to be that size.
        measureSpec = MeasureSpec.makeMeasureSpec(rootDimension, MeasureSpec.EXACTLY);
        break;
    }
    return measureSpec;
}
```
    语句解释：
    -  静态方法MeasureSpec.makeMeasureSpec用来将两个普通的int值合成一个MeasureSpec值。
    -  上面的代码已经表示的很清楚了，ViewRootImpl会依据DecorView的LayoutParams的值以及窗口的尺寸来计算出DecorView的MeasureSpec。

<br>**普通View**
　　对于普通View来说，它的`measure`方法是由ViewGroup调用的，先来看一下ViewGroup的`measureChildWithMargins`方法：
``` java
protected void measureChildWithMargins(View child, int parentWidthMeasureSpec, int widthUsed,
        int parentHeightMeasureSpec, int heightUsed) {
    final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

    final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
            mPaddingLeft + mPaddingRight + lp.leftMargin + lp.rightMargin + widthUsed, lp.width);
    final int childHeightMeasureSpec = getChildMeasureSpec(parentHeightMeasureSpec,
            mPaddingTop + mPaddingBottom + lp.topMargin + lp.bottomMargin + heightUsed, lp.height);

    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
}

public static int getChildMeasureSpec(int spec, int padding, int childDimension) {
    int specMode = MeasureSpec.getMode(spec);
    int specSize = MeasureSpec.getSize(spec);

    int size = Math.max(0, specSize - padding);

    int resultSize = 0;
    int resultMode = 0;

    switch (specMode) {
    // Parent has imposed an exact size on us
    case MeasureSpec.EXACTLY:
        if (childDimension >= 0) {
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size. So be it.
            resultSize = size;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size. It can't be
            // bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        }
        break;

    // Parent has imposed a maximum size on us
    case MeasureSpec.AT_MOST:
        if (childDimension >= 0) {
            // Child wants a specific size... so be it
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size, but our size is not fixed.
            // Constrain child to not be bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size. It can't be
            // bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        }
        break;

    // Parent asked to see how big we want to be
    case MeasureSpec.UNSPECIFIED:
        if (childDimension >= 0) {
            // Child wants a specific size... let him have it
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size... find out how big it should
            // be
            resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
            resultMode = MeasureSpec.UNSPECIFIED;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size.... find out how
            // big it should be
            resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
            resultMode = MeasureSpec.UNSPECIFIED;
        }
        break;
    }
    return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
}
```
    语句解释：
    -  从代码中也可以容易看出来，子View的MeasureSpec值，是由其父容器的MeasureSpec和子View的LayoutParams来确定的。

<br>
### 开始测量 ###
　　稍微总结一下，我们现在知道的知识有：

    -  第一，当需要测量View的时，系统会从DecorView开始自上向下的测量每一个View。
    -  第二，不论是DecorView还是普通的View，它们的MeasureSpec都是由它的上级传递过来的。
       -  对于DecorView来说，它的MeasureSpec是由屏幕的尺寸和它自身的LayoutParams决定的。
       -  对于普通View来说，它的MeasureSpec是由父View剩余空间和它自身的LayoutParams决定的。
          -  若父ViewGroup的layout_height值为100，子View的值为200，则最终传入到子View的高度就是200。
    -  第三，当系统需要测量某个View时，会调用View类的onMeasure方法。
    -  第四，MeasureSpec是一个复合的int值，在使用之前需要将它们拆解。

<br>　　需要说的是，普通View和ViewGroup的重写onMeasure方法时是有区别的：

    -  普通View只需要在onMeasure中测量自己的尺寸即可。
    -  ViewGroup除了完成自己的测量过程外，还需要遍历去调用其所有子View的measure方法，各个子View再递归去执行这个流程。

<br>**普通View的重写**
<br>　　范例1：重写`onMeasure`方法。
``` java
public class MyView extends View {

    public MyView(Context context) {
        super(context);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        // 什么都不干，直接设置MyView的宽高为300*300像素，注意此处的单位是px，而不是dp。
        setMeasuredDimension(300, 300);
    }
}
```
    语句解释：
    -  当系统调用onMeasure方法时，就是在要求View执行测量了。
    -  当View测量完毕时需要将测量结果给保存起来，但是由于Java方法只能返回一个值，没法同时将宽度和高度一起返回，所以系统给我们提供一个setMeasuredDimension方法，我们把测量的结果传递过去即可。
    -  在实际开发中，很少会像上面那样把MyView的尺寸写死在代码上，而是会依据widthMeasureSpec和heightMeasureSpec的值来动态的计算出MyView的尺寸。

<br>　　当然我们也可以不重写onMeasure方法，而是使用父类（View类）的实现：
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    setMeasuredDimension(getDefaultSize(getSuggestedMinimumWidth(), widthMeasureSpec),
            getDefaultSize(getSuggestedMinimumHeight(), heightMeasureSpec));
}
public static int getDefaultSize(int size, int measureSpec) {
    int result = size;
    int specMode = MeasureSpec.getMode(measureSpec);
    int specSize = MeasureSpec.getSize(measureSpec);

    switch (specMode) {
    case MeasureSpec.UNSPECIFIED:
        result = size;
        break;
    case MeasureSpec.AT_MOST:
    case MeasureSpec.EXACTLY:
        result = specSize;
        break;
    }
    return result;
}
```
<br>　　总结一下`onMeasure`方法：

    -  若没有重写onMeasure方法，则会按照View类的默认方式处理：
       -  通常情况下View对象的测量尺寸就是layout_width和layout_height所设置的值。
       -  在少数情况下，View对象的测量尺寸是getSuggestedMinimumWidth和getSuggestedMinimumHeight方法返回的。
    -  若重写了onMeasure方法，则View对象的测量尺寸就是你在onMeasure方法里测量的结果。
       -  但是onMeasure方法测出的宽度和高度不一定就是View最终的宽高。
       -  测量宽高会受到View对象父View的约束，若父控件最大允许的宽度为100px，但子View测量的宽度为200px，最终子控件只会显示前100px的宽度，超出的部分不会被显示，除非加上滚动条。

<br>　　注意，视图实际拥有两对宽度和高度的值：

    -  第一对被称作测量宽度和测量高度。
       - 这两个尺寸表示View在其父View中需要的大小，也就是我们在onMeasure方法里计算出来的宽高。
       - 当View对象的measure()返回时，就可以通过getMeasuredWidth()和getMeasuredHeight()方法来获得测量宽高。
    -  第二对被简单的称作宽度和高度，或绘制宽度和绘制高度。
       -  这两个尺寸表示View最终在屏幕上的实际大小，不过在少数情况下，绘制宽高可能与测量宽高不同。
       -  当View对象的onLayout()被调用时，就可以通过getWidth()方法和getHeight()方法来获取视图的宽高了。

<br>　　说了这么多，也许你还是不知道怎么重写onMeasure方法，没关系，后面会有实战范例，不要慌！

<br>**ViewGroup的重写**
　　事实上，`ViewGroup`类并没有重写`onMeasure`方法，而是交给它的子类来重写了。

　　下面是`LinearLayout`类的`onMeasure`方法：
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    if (mOrientation == VERTICAL) {
        measureVertical(widthMeasureSpec, heightMeasureSpec);
    } else {
        measureHorizontal(widthMeasureSpec, heightMeasureSpec);
    }
}

void measureVertical(int widthMeasureSpec, int heightMeasureSpec) {

    // 此处省略若干行代码

    // 遍历测量每一个子View。
    for (int i = 0; i < count; ++i) {
        // 此处省略若干行代码
        measureChildBeforeLayout(
               child, i, widthMeasureSpec, 0, heightMeasureSpec,
               totalWeight == 0 ? mTotalLength : 0);
        // 此处省略若干行代码
    }

    // 此处省略若干行代码

    // 当所有子View都测量完毕后，再测量自己的尺寸。
    mTotalLength += mPaddingTop + mPaddingBottom;
    int heightSize = mTotalLength;
    heightSize = Math.max(heightSize, getSuggestedMinimumHeight());
    int heightSizeAndState = resolveSizeAndState(heightSize, heightMeasureSpec, 0);
    heightSize = heightSizeAndState & MEASURED_SIZE_MASK;
    
    // 此处省略若干行代码
    
    setMeasuredDimension(resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
            heightSizeAndState);

    // 此处省略若干行代码
}

void measureChildBeforeLayout(View child, int childIndex,
        int widthMeasureSpec, int totalWidth, int heightMeasureSpec, int totalHeight) {
    measureChildWithMargins(child, widthMeasureSpec, totalWidth, heightMeasureSpec, totalHeight);
}

protected void measureChildWithMargins(View child,
        int parentWidthMeasureSpec, int widthUsed, int parentHeightMeasureSpec, int heightUsed) {
    final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

    // 调用getChildMeasureSpec方法，综合自身和当前子View的尺寸信息，计算出子View最终的测量尺寸。
    final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
            mPaddingLeft + mPaddingRight + lp.leftMargin + lp.rightMargin + widthUsed, lp.width);
    final int childHeightMeasureSpec = getChildMeasureSpec(parentHeightMeasureSpec,
            mPaddingTop + mPaddingBottom + lp.topMargin + lp.bottomMargin + heightUsed, lp.height);

    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
}
```

<br>　　提示：父视图可能在它的子视图上调用一次以上的`measure(int,int)`方法。

## 布局阶段 ##
　　当所有`View`都测量完毕后，就需要设置它们的位置了，这个过程同样是从`DecorView`开始，调用的方法为`layout()`。

<br>　　首先，我们来看下`View.java`中的`layout()`方法的源码：
``` java
public void layout(int l, int t, int r, int b) {
    if ((mPrivateFlags3 & PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
        onMeasure(mOldWidthMeasureSpec, mOldHeightMeasureSpec);
        mPrivateFlags3 &= ~PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
    }

    int oldL = mLeft;
    int oldT = mTop;
    int oldB = mBottom;
    int oldR = mRight;

    // 调用setFrame或setOpticalFrame方法来修改当前View的位置。
    // 注意：这个位置是当前控件在父View内的相对位置，原点是父View的左上角。
    boolean changed = isLayoutModeOptical(mParent) ?
            setOpticalFrame(l, t, r, b) : setFrame(l, t, r, b);

    if (changed || (mPrivateFlags & PFLAG_LAYOUT_REQUIRED) == PFLAG_LAYOUT_REQUIRED) {
        // 如果上面修改成功了，或者用户强制要求更新，则回调onLayout()方法。
        onLayout(changed, l, t, r, b);
        mPrivateFlags &= ~PFLAG_LAYOUT_REQUIRED;

        ListenerInfo li = mListenerInfo;
        // 回调所有注册过的（如果有的话）listener的onLayoutChange()方法。
        if (li != null && li.mOnLayoutChangeListeners != null) {
            ArrayList<OnLayoutChangeListener> listenersCopy =
                    (ArrayList<OnLayoutChangeListener>)li.mOnLayoutChangeListeners.clone();
            int numListeners = listenersCopy.size();
            for (int i = 0; i < numListeners; ++i) {
                listenersCopy.get(i).onLayoutChange(this, l, t, r, b, oldL, oldT, oldR, oldB);
            }
        }
    }

    mPrivateFlags &= ~PFLAG_FORCE_LAYOUT;
    mPrivateFlags3 |= PFLAG3_IS_LAID_OUT;
}
```
    语句解释：
    -  从第3行代码可以看出来，在View的layout阶段也有可能调用onMeasure方法。

<br>　　关于`onLayout()`方法：

    -  当需要确定当前View的所有子View的位置时，才会调用onLayout方法。
    -  对于普通的View类来说，由于它是没有子View的，因此View类的onLayout()只是一个空实现。
    -  对于ViewGroup类来说，在它内部onLayout方法被改为抽象方法了，所有ViewGroup的子类都必须重写它。

<br>　　接着我们来看下`ViewGroup.java`中的`layout()`和`onLayout()`方法的源码：
``` java
public final void layout(int l, int t, int r, int b) {
    if (!mSuppressLayout && (mTransition == null || !mTransition.isChangingLayout())) {
        if (mTransition != null) {
            mTransition.layoutChange(this);
        }
        super.layout(l, t, r, b);
    } else {
        // record the fact that we noop'd it; request layout when transition finishes
        mLayoutCalledWhileSuppressed = true;
    }
}

protected abstract void onLayout(boolean changed, int l, int t, int r, int b);
```
    语句解释：
    -  相比之下ViewGroup增加了LayoutTransition的处理：
       -  若当前ViewGroup未添加LayoutTransition动画，或动画未运行，则调用super.layout(l,t,r,b)。
       -  否则将mLayoutCalledWhileSuppressed设置为true，等待动画完成时再调用requestLayout()。
    -  除此之外，还有两个地方需要注意：
       -  layout()方法增加了final关键字，这意味着它的所有子类无法重写layout()方法。
       -  onLayout()方法使用abstract关键字修饰了，这意味着它的所有子类必须重写此方法。


<br>　　我们来看下`LinearLayout`的`onLayout`方法：
``` java
//  参数 changed 表示当前ViewGroup的尺寸或者位置是否发生了改变。
//  也就是说ViewGroup的尺寸和位置没有发生变化时，此方法也有可能被调用。
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    // 依据方向来调用不同的方法进行layout。
    if (mOrientation == VERTICAL) {
        layoutVertical(l, t, r, b);
    } else {
        layoutHorizontal(l, t, r, b);
    }
}

void layoutVertical(int left, int top, int right, int bottom) {    
    // 此处省略若干行代码
    int childTop;
    int childLeft;
    // 此处省略若干行代码
    for (int i = 0; i < count; i++) {
        final View child = getVirtualChildAt(i);
        if (child == null) {
            childTop += measureNullChild(i);
        } else if (child.getVisibility() != GONE) {
            // 获取到我们之前测量出来的尺寸。
            final int childWidth = child.getMeasuredWidth();
            final int childHeight = child.getMeasuredHeight();
            // 此处省略若干行代码
            // 调用setChildFrame()方法来设置子控件的位置
            setChildFrame(child, childLeft, childTop + getLocationOffset(child), childWidth, childHeight);
            // 由于是垂直排列元素，因此这里需要更新childTop变量的值，以便下一个子View进行布局。
            childTop += childHeight + lp.bottomMargin + getNextLocationOffset(child);
            i += getChildrenSkipCount(child, i);
        }
    }
}

private void setChildFrame(View child, int left, int top, int width, int height) {        
    child.layout(left, top, left + width, top + height);
}
```
    语句解释：
    -  从第23行代码可以看出，LinearLayout的子View最终的显示的宽和高，是由该子View的measure过程的结果来决定的。
    -  因此measure过程的意义就是为layout过程提供视图显示范围的参考值。

## 绘画阶段 ##
　　布局阶段执行完毕后，框架就会调用DecorView的`draw()`方法开始绘制`View树`。但是每次绘图时，并不会重新绘制整个`View树`中的所有`View`，而只会重新绘制那些`“需要重绘”`的`View`，`View`类内部变量包含了一个标志位`DRAWN`，当该视图需要重绘时，就会为该`View`添加该标志位。

<br>　　通过查看源码可以知道，View类的绘制流程由六步构成：

    -  第一，绘制当前View的背景。
    -  第二，如果有必要，则为稍后绘制渐变效果做一些准备操作(大多数情况下，不需要)。
    -  第三，调用onDraw()方法绘制视图本身。
       -  View类的onDraw()方法是空实现，ViewGroup类没有重写此方法。
    -  第四，调用dispatchDraw()方法绘制子视图。
       -  View类的dispatchDraw()方法是空实现，因为对于不包含子View的控件来说不需要重写此方法。
       -  ViewGroup类已经为我们重写了dispatchDraw()的功能实现，因此ViewGroup的子类一般不需要重写该方法。
    -  第五，如果第二步被执行了，那么第五步也会被执行。第五步用来绘制渐变效果以及绘制渐变效果之后的一些收尾工作。
    -  第六，绘制滚动条。
       -  在Android中不管是Button还是TextView，任何一个视图都是有滚动条的，只是一般情况下我们都没有让它显示出来而已。

<br>　　总而言之，每一个具体的`View`都应该重写`onDraw()`方法，并且不论是`View`还是`ViewGroup`的子类，一般不需要重写`dispatchDraw()`方法。

　　绘制的时候主要是借助`Canvas`这个类，它会作为参数传入到`onDraw()`方法中，供给每个视图使用。
　　`Canvas`这个类的用法非常丰富，基本可以把它当成一块画布，在上面绘制任意的东西，那么我们就来尝试一下吧。

<br>　　范例1：初步使用画笔和画布。
``` java
public class MyView extends View {
    private Paint mPaint;
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onFinishInflate() {
        mPaint = new Paint();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // 设置画笔颜色为黄色
        mPaint.setColor(Color.YELLOW);
        // 使用画笔绘制一个黄色的矩形
        canvas.drawRect(0, 0, getWidth(), getHeight(), mPaint);
        // 设置画笔颜色为蓝色
        mPaint.setColor(Color.BLUE);
        // 设置画笔的字体大小
        mPaint.setTextSize(20);
        String text = "Hello View";
        // 将一行文本绘制到画布中去，字体的颜色是蓝色，字体的大小是20px。
        canvas.drawText(text, 0, getHeight() / 2, mPaint);
    }
}
```
　　布局文件的内容为：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="match_parent" >
    <com.cutler.demo.common.view.MyView
        android:layout_width="200dp"
        android:layout_height="100dp" />
</LinearLayout>
```
    语句解释：
    -  Paint表示一个画笔，Canvas表示一个画布。 
    -  另外，由于MyView类没有重写onMeasure方法，则系统使用默认的策略来计算它的测量尺寸，即使用XML中设置的尺寸。

　　运行效果如下图所示：

<center>
![](http://img.blog.csdn.net/20131223234856718?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ3VvbGluX2Jsb2c=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
</center>

<br>**View重绘**
　　虽然View会在`Activity`加载完成之后绘制到屏幕上，但是在程序的运行时View的状态是会改变的。当改变发生时，之前绘制出的内容其实就已经过期了，此时应该对视图进行重绘。

　　调用视图的`setVisibility()`、`setEnabled()`、`setSelected()`等方法时都会导致视图重绘，而如果我们想要手动地强制让视图进行重绘，可以调用`invalidate()`方法来实现。

    -  setVisibility、setEnabled、setSelected等方法的内部其实也是通过调用invalidate方法来实现的。
    -  这里的重绘是指谁请求invalidate方法，就重绘该视图(View的话只绘制该View，ViewGroup则绘制整个ViewGroup)。
　　`invalidate()`只可以在主线程中调用，如果你需要在子线程中重绘`View`，那么可以调用`postInvalidate()`方法。

<br>　　如果你需要`定时重绘`，那么你可以使用`postInvalidateDelayed(long delayMilliseconds)`方法，当倒计时结束后，该方法会有如下判断：

    -  若调用该方法的View依然显示在屏幕中，则该方法会在主线程中调用invalidate()方法执行重绘。
    -  若调用该方法的View已经不显示了，则这个重绘任务会被挂起，等到该View再次显示时，才会触发重绘。

　　比如，对于一个计时器`View`来说，每秒钟都需要重绘一次，如果通过开启`Thread`来定时调用`postInvalidate()`方法来实现计时的话，有两个缺点：

    -  第一，开启Thread类需要消耗一定资源。
    -  第二，若计时器View当前不再屏幕中（比如用户把App切换到后台了），那么线程仍然在跑，View仍然是每秒钟都重绘一次，浪费大量资源。

<br>　　如果你不需要`定时重绘`，那么最好也去使用`postInvalidate()`方法，当`View`不再显示时，它同样不会立刻执行重绘操作，它的源码为：
``` java
public void postInvalidate() {
    postInvalidateDelayed(0);
}
```

## 其它常用方法 ##
### 定位 ###
　　`View`的几何形状是`矩形`的，视图的`位置`使用`左上坐标系`表示，`尺寸`由`宽和高`表示，位置和尺寸以`像素`为单位。我们可以通过`getLeft()`和`getTop()`函数取得视图的位置：

    -  前者返回视图的左侧位置（横坐标X）。
    -  后者返回视图的顶部位置（纵坐标Y）。
　　这两个方法返回视图相对于其父视图的位置，例如`getLeft()`返回`20`，代表视图在其直接父视图左侧边的右侧`20`像素的位置。

　　另外，为了避免不必要的计算，提供了一些便利的方法，它们是`getRight()`和`getBottom()`。这些方法返回代表视图的矩形的右侧和底边的坐标。例如，调用`getRight()`比调用`getLeft() + getWidth()`要简单。


### 跳过绘制 ###
　　`View`类有一个特殊的方法setWillNotDraw，先来看一下的它的源码：
``` java
/**
 * If this view doesn't do any drawing on its own, set this flag to
 * allow further optimizations. By default, this flag is not set on
 * View, but could be set on some View subclasses such as ViewGroup.
 *
 * Typically, if you override {@link #onDraw(android.graphics.Canvas)}
 * you should clear this flag.
 *
 * @param willNotDraw whether or not this View draw on its own
 */
public void setWillNotDraw(boolean willNotDraw) {
    setFlags(willNotDraw ? WILL_NOT_DRAW : 0, DRAW_MASK);
}
```
    语句解释：
    -  从注释可以看出来，如果一个View不需要绘制任何内容，那么设置这个标记位为true后，系统就会进行相应的优化。
    -  默认情况下，View没有启用这个优化标记位，但是ViewGroup会默认启用这个标记位。


### 从窗口中添加和移除 ###
　　当View和其所在的Activity建立和断开连接时，系统会调用如下两个方法：

    -  Activity关闭或者View从Activity中移除时，View的onDetachedFromWindow方法会被调用。
       -  通常在此方法中关闭线程和停止动画，从而避免内存泄漏。
    -  View被添加到Activity中时，它的onAttachedToWindow方法会被调用。


### 大小改变 ###
　　在`View`类中还有一个比较有用的方法是`onSizeChanged`，当`View`的尺寸改变时就会调用它。

    -  一般情况下，我们在自定义控件的时候会依据View的尺寸来确定绘制的大小，但是程序在运行的时候不可避免的因为一些外力而导致View的尺寸发生变化（比如横竖屏切换、输入法弹出等）。
　　因此通常的做法是重写`onSizeChanged`方法，并在其内部更新变量的值，并调用`invalidate`方法进行重绘。
<br>

<br>**本章参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android视图绘制流程完全解析，带你一步步深入了解View(二)](http://blog.csdn.net/guolin_blog/article/details/16330267)
- [Android视图状态及重绘流程分析，带你一步步深入了解View(三)](http://blog.csdn.net/guolin_blog/article/details/17045157)
- [Android自定义View的实现方法，带你一步步深入了解View(四)](http://blog.csdn.net/guolin_blog/article/details/17357967)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)


# 第四节 道理我都懂，到底要怎么干？#

　　至此我们已经对自定义控件有个大致的了解，不出意外的话，此时你应该还是不知道如何去写代码。

　　笔者认为，之所以我们会觉得自定义控件很难，主要是因为我们知道的相关API太少，只要我们尽可能多的学习相关API，那么自定义控件就不足为惧。

　　因此，本章的任务就是如下两个：

    -  第一，尽可能多的介绍自定义控件时所用的常见API，（本章的内容会不定时更新）。
    -  第二，将前两章的理论知识融合到实践中。
       -  理论结合实践是非常重要的，举个例子：我们都会用嘴发声，也会通过击打手臂发声，但是当我们看到芈月用嘴和手臂放屁时，还是会眼前一亮，原来还可以这么玩。
       -  也就是说，基础知识学会之后，还要再学习如何将它们组合在一起使用。
　　千言万语汇成一句话：想创新，先模仿！

　　在绘制`View`时会涉及到两个类：`Paint`和`Canvas`，这两个类分别代表`画笔`和`画布`。
　　我们需要调用`Canvas`对象所提供的方法进行绘制，其中`Canvas`对象由系统创建，在View的`onDraw()`方法被调用时，系统会同时将`Canvas`对象以形参的形式传递给该方法。

　　`Canvas`对象提供的绘制图形的方法都是以`draw`开头的，我们可以查看`API`：

<center>
![](/img/android/android_b08_03.jpg)
</center>

　　从上面方法的名字看来我们可以知道`Canvas`可以绘制的对象有：弧线(`arcs`)、填充颜色(`argb`和`color`)、 `Bitmap`、圆(`circle`和`oval`)、点(`point`)、线(`line`)、矩形(`Rect`)、图片(`Picture`)、圆角矩形 (`RoundRect`)、文本(`text`)、顶点(`Vertices`)、路径(`path`)。

　　通过组合这些对象我们可以画出一些简单有趣的界面出来，但是光有这些功能还是不够的，如果我们要画一个钟表呢？
　　幸好Android还提供了一些对`Canvas`位置转换的方法：`rorate`、`scale`、`translate`、`skew`等，而且它允许你通过获得它的矩阵对象（`getMatrix`方法，不知道什么是矩阵？在[《媒体篇　第二章 图片》](http://cutler.github.io/android-D02/)中有介绍）直接操作它。

　　为了方便执行转换操作，`Canvas`还提供了保存和回滚属性的方法(`save`和`restore`)，比如你可以先调用`save`方法保存目前画布的位置，然后旋转`90`度，向下移动`100`像素后画一些图形，画完后调用`restore`方法返回到刚才保存的位置。

## 绘制文本 ##
　　虽然我们只能使用`Canvas`所提供的方法来进行绘制，但绘制时还要传递给`Canvas`一个`Paint`对象，`Paint`对象用来设置画笔的相关的参数。

<br>　　范例1：绘制文字。
``` java
public class MyView extends View {
    private Paint mPaint;
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 初始化画笔对象。
        mPaint = new Paint();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // 修改画笔的颜色，下面使用的是android.graphics.Color类。
        mPaint.setColor(Color.RED);
        // 字体大小
        mPaint.setTextSize(70);
        // 字体下面加下划线
        mPaint.setUnderlineText(true);
        // 从(10,10)的位置开始，绘制一行文本。
        canvas.drawText("Hello Wrold!", 10, 100, mPaint);
        // 加粗字体。 如果字体的型号比较小，那么加粗的效果可能就不是很明显。
        mPaint.setFakeBoldText(true);
        // 给字体加上删除线。
        mPaint.setStrikeThruText(true);
        canvas.drawText("Hello Wrold2!", 10, 300, mPaint);
        // 设置文本在水平方向上的倾斜比例，负数向右倾斜，正数向左倾斜。
        mPaint.setTextSkewX(-0.3f);
        // 设置文本水平方向上的对齐方法，以坐标(10,500)为例：
        //   Paint.Align.LEFT :   将文本的左下角放到(10,500)的位置，默认设置。
        //   Paint.Align.CENTER : 将文本的底边中心点放到(10,500)的位置。
        //   Paint.Align.RIGHT :  将文本的右下角放到(10,500)的位置。
        mPaint.setTextAlign(Paint.Align.LEFT);
        canvas.drawText("Hello Wrold3!", 10, 500, mPaint);
        //按照既定点 绘制文本内容
        canvas.drawPosText("Android", new float[]{
                10,610, //第一个字母在坐标10,610
                120,640, //第二个字母在坐标120,640
                230,670, //....
                340,700,
                450,730,
                560,760,
                670,790,
        }, mPaint);
    }
}
```
    语句解释：
    -  调用drawPosText方法时，float数组的长度必须是text.length*2。


<br>　　范例2：测量文字宽度，运行效果如下图所示：

<center>
![](/img/android/android_g03_01.png)
</center>

　　代码：
``` java
protected void onDraw(Canvas canvas) {
    String s = "Hello. I'm some text!";

    Paint p = new Paint();
    p.setTextSize(60);

    // 也可以使用TypedValue类来计算字体的大小，比如设置字体为24sp：
    // DisplayMetrics dm = getResources().getDisplayMetrics();
    // p.setTextSize(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 24, dm));

    drawText(s, 100, 100, p, canvas);
    p.setTextSkewX(-0.6f);
    drawText(s, 100, 400, p, canvas);
}

private void drawText(String s, int x, int y, Paint p, Canvas canvas) {
    // 使用measureText方法测量字符串宽度
    canvas.drawText(s, x, y, p);
    canvas.drawLine(x, y, x + p.measureText(s), y, p);

    // 使用getTextBounds方法测量字符串宽度
    y += 100;
    canvas.drawText(s, x, y, p);
    Rect bounds = new Rect();
    // 字符串的宽高会为放到bounds里面。
    p.getTextBounds(s, 0, s.length(), bounds);
    canvas.drawLine(x, y, x + bounds.width(), y, p);
}
```
    语句解释：
    -  目前有多种方法可以获取到字符串的宽度，本范例只列出了其中两种，其它方法请自行搜索。
    -  从程序运行的效果图可以看出来：
       -  如果绘制文字时，Paint对象没有特殊的效果（比如字体倾斜），那么使用measureText效果最好。
       -  如果为Paint设置了特效，或者需要获取字体的高度，则使用getTextBounds方法效果最好。
    -  之所以这两个方法计算的结果不同，是因为getTextBounds方法返回值是int类型，所以它的结果与measureText有差距。

## 绘制图形 ##
<br>　　范例1：绘制图形。
``` java
@Override
protected void onDraw(Canvas canvas) {
    // 定义一个画笔对象。
    Paint p = new Paint();
    p.setColor(Color.RED);
    p.setStyle(Paint.Style.FILL_AND_STROKE);

    // 将整个canvas染成蓝色。也可以调用canvas.drawARGB(100, 255, 0, 0);来设置具体的颜色值。  
    canvas.drawColor(Color.BLUE);
    // 使用画笔p在canvas上绘画出一条直线，直线的起点为(10,10)，结束点为(10,40)。
    canvas.drawLine(10, 10, 10, 40, p);
    // 使用画笔p在canvas上绘画出一个矩形，矩形的左上角坐标为(20,20)，右下角坐标为(40,50)。 
    canvas.drawRect(new Rect(20,20,40,50), p);
    // 使用画笔p在canvas上绘画出一个圆形，圆心坐标为(150,150)，半径为60。
    canvas.drawCircle(150, 150, 60, p);
    // 使用画笔p在canvas上绘画出一个圆角矩形，矩形左上角坐标为(80,220)，右下角坐标为(210,280)，x和y方向上的圆角半径为(10,10)。
    canvas.drawRoundRect(new RectF(80,220,210,280), 10, 10, p);
}
```
    语句解释：
    -  Rect类用来描述一个矩形的四个顶点，RectF类也是一样的，与Rect不同的是，它使用4个float类型的变量。
    -  Paint类的setStyle()方法设置当前画笔在绘图(圆形、矩形等)时要使用的样式，常用取值： 
       -  Paint.Style.STROKE： 只画出图形的边框线。
       -  Paint.Style.FILL：使用当前画笔的颜色填充图形的内部。
       -  Paint.Style.FILL_AND_STROKE：既画出边框线又填充图形内部。
    -  绘制椭圆形可以使用drawOval(RectF oval, Paint paint)方法。

<br>　　范例2：绘制弧形。

<center>
![本范例运行效果示意图](/img/android/android_b08_01.png)
</center>

``` java
@Override
protected void onDraw(Canvas canvas) {
    Paint p = new Paint();
    // 在画图的时候，进行图片旋转或缩放等操作之后，在图片的四条边上总是会出现锯齿。我们可以通过下面这行代码消除锯齿。
    p.setAntiAlias(true);
    p.setColor(Color.BLUE);

    // 绘制一个弧形，并使用画笔当前的颜色填充它。
    p.setStyle(Paint.Style.FILL);
    // 我们提供一个RectF对象作为弧形的外切矩形，系统就知道弧形的位置和尺寸了。
    // 下面的代码是从-90度开始画，画一个300度的弧形。
    // 我们常规认为12点方向是0度，但在这里默认3点方向是0度，因而要从-90度开始画弧线。
    // 这个弧形运行时的效果，请看上面示意图中的第一个，后面三个以此类推。
    canvas.drawArc(new RectF(100,100,250,250), -90, 300, true, p);

    // 绘制一个弧形，只绘制弧线，不填充内容。
    p.setStyle(Paint.Style.STROKE);
    // 设置线的粗（宽度）为5，线宽对Paint.Style.FILL无效、对文本字体无效。
    p.setStrokeWidth(5);
    canvas.drawArc(new RectF(300,100,450,250), -90, 300, true, p);

    // 绘制一个弧形，但useCenter字段为false。具体效果请看上面示意图中的第三个。
    canvas.drawArc(new RectF(500,100,650,250), -90, 300, false, p);

    // 绘制一个弧形，但useCenter字段为false。
    p.setStyle(Paint.Style.FILL);
    canvas.drawArc(new RectF(700,100,850,250), -90, 300, false, p);
}
```
    语句解释：
    -  通过第一幅和第四幅图对比我们可以发现，useCenter为false时，弧线区域是用弧线开始角度和结束角度直接连接起来的，当useCenter为true时，是弧线开始角度和结束角度都与中心点连接，形成一个扇形。


<br>　　范例3：圆角弧形。

<center>
![本范例运行效果示意图](/img/android/android_g03_02.png)
</center>

``` java
protected void onDraw(Canvas canvas) {
    Paint p = new Paint();
    p.setAntiAlias(true);
    p.setColor(Color.BLUE);
    p.setStyle(Paint.Style.STROKE);
    // 通过修改线的宽度，这样弧形就变粗了，这个特性可以用来模仿ProgressBar。
    p.setStrokeWidth(25);

    // 画一个非圆角弧形
    canvas.drawArc(new RectF(100,100,250,250), -90, 300, false, p);

    // 画一个圆角弧形
    p.setStrokeCap(Paint.Cap.ROUND);
    canvas.drawArc(new RectF(500,100,650,250), -90, 300, false, p);
}
```
    语句解释：
    -  使用Paint.Cap.ROUND就可以让弧形的两头变为圆角。

## Path ##
　　当我们想在画布上绘制任意多边形时，就可以通过指定`Path`对象来实现，可以把`Path`对象看作是一个点集，在该点集中规划了多边形的路径信息。
　　当然也可以使用`drawLines`方法来实现多边形，但是`drawPath`方法更为灵活、方便。

<br>　　范例1：平行四边形与棒棒糖。
``` java
protected void onDraw(Canvas canvas) {
    Paint paint = new Paint();
    paint.setColor(Color.RED);
    paint.setStyle(Paint.Style.STROKE);
    Path path1 = new Path();
    // 移到(50, 50)点处作为起点
    path1.moveTo(50, 50);
    // 绘制一条线，起点是(50,50)，终点是(100,50)
    path1.lineTo(100, 50);
    path1.lineTo(150, 100);
    path1.lineTo(50, 100);
    // 调用此方法自动闭合这个多边形，即补足最后一条边（绘制一条从当前位置开始到Path起点之间的连线）。
    path1.close();
    canvas.drawPath(path1, paint);

    Path path2 = new Path();
    path2.moveTo(300, 50);
    path2.lineTo(300, 250);
    path2.addCircle(300, 50, 40, Path.Direction.CCW);
    canvas.drawPath(path2, paint);
}
```
    语句解释：
    -  Path.Direction.CCW 表示逆时针，Path.Direction.CW 表示顺时针。

<br>　　范例2：`Path`与文字。
``` java
protected void onDraw(Canvas canvas) {
    Paint paint = new Paint();
    paint.setTextSize(30);
    Path path = new Path(); //定义一条路径
    path.moveTo(10, 50);    //移动到 坐标10,10
    path.lineTo(150, 160);
    path.lineTo(300,350);
    // 使用此方法绘制一行文本，文本会沿着path的路线绘制。
    canvas.drawTextOnPath("Android drawTextOnPath 世界，你好！", path, 10, 10, paint);
}
```
    语句解释：
    -  如果文本的长度超出了Path的长度，那么多出的文本将不会被显示。

<br>　　范例3：一个简单的画板。

<center>
![本范例运行效果示意图：左边是样图，右边是笔者画的](/img/android/android_g03_03.png)
</center>

``` java
public class MyView extends View {

    private Paint mPaint;
    private Path mPath;

    public MyView(Context context) {
        super(context);
        // 初始化画笔对象。
        mPaint = new Paint();
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setColor(Color.RED);
        mPaint.setStrokeWidth(20);
        // 初始化Path对象。
        mPath = new Path();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                //  mPath.reset();  可以调用此方法清空所有数据。
                mPath.moveTo(event.getX(), event.getY());
                break;
            case MotionEvent.ACTION_MOVE:
                mPath.lineTo(event.getX(), event.getY());
                invalidate();
                break;
        }
        return true;
    }

    protected void onDraw(Canvas canvas) {
        canvas.drawPath(mPath, mPaint);
    }

}
```
    语句解释：
    -  本范例综合了Path与触摸事件的知识，实现了一个简单的画板功能。
    -  其实还可以扩展一下，把绘制到Canvas上的内容保存到一个Bitmap对象中，然后再将Bitmap写到磁盘上。

<br>**PathEffect**
　　开发时往往会对`Path`有更高的要求，比如绘制虚线、让线的拐角处变圆滑等。`PathEffect`类就可以完成这些功能。

<br>　　范例1：使用`PathEffect`。
``` java
// 只需要调用Paint类的setPathEffect方法，并传递一个PathEffect的子类即可。
mPaint.setPathEffect(new CornerPathEffect(30));
```
    语句解释：
    -  CornerPathEffect类用来让Path在拐角出变的圆滑，30表示半径。
    -  你可以把这行代码放到上面的“范例3：一个简单的画板。”的范例中，然后观察运行效果，下同。

<br>　　范例2：打散效果。

<center>
![DiscretePathEffect的效果](/img/android/android_g03_06.png)
</center>

``` java
// DiscretePathEffect（打散效果），其会在路径上绘制很多“杂点”。其构造方法有两个参数：
// 第一个指这些“杂点”的密度，值越小杂点越密集。
// 第二个指“杂点”突出的大小，值越大突出的距离越大。
mPaint.setPathEffect(new DiscretePathEffect(3,5));
```
    语句解释：
    -  segmentLength指定最大的段长，deviation则为绘制时的偏离量。

<br>　　范例3：虚线效果。

<center>
![DashPathEffect的效果](/img/android/android_g03_07.png)
</center>

``` java
// DashPathEffect（虚线效果），其构造方法有两个参数：
// 第一个float[]数组，其内通常包含2n（n>=1）个元素：
// -  数组的第2n-1个元素表示第n条线段的长度。
// -  数组的第2n个元素表示第n条线段与第n+1条线段之间的距离间隔。
// 第二个指偏移量，主要用来实现动画效果，稍后会介绍。
mPaint.setPathEffect(new DashPathEffect(new float[]{1, 10, 10, 10}, 0));
```
    语句解释：
    -  DashPathEffect第一个参数float[]数组，最少需要有2两个元素，当数组中的元素绘制完毕后，会再次重头绘制数组。
    -  如果觉得虚线太宽了，可以调用Paint的setStrokeWidth方法修改。

<br>　　范例4：让虚线动起来。
``` java
// 定义一个迭代变量。
int mPhase;
protected void onDraw(Canvas canvas) {
    // 修改画笔的PathEffect，需要注意的是，下面每次都会增加mPhase的值。
    mPaint.setPathEffect(new DashPathEffect(new float[]{10, 10}, mPhase++));
    canvas.drawPath(mPath, mPaint);
    // 执行重绘。
    invalidate();
}
```
    语句解释：
    -  你不用担心上面直接在onDraw方法中毫无阻拦的调用invalidate会带来效率问题，这是因为即使我们这么做了，默认情况下系统1秒内只会执行60次onDraw方法。
    -  另外mPhase的数据类型最好定义为float的，int的取值范围也许不够用。

<br>　　范例5：自定义形状。

<center>
![PathDashPathEffect的效果](/img/android/android_g03_08.png)
</center>

``` java
int mPhase;
protected void onDraw(Canvas canvas) {
    mPaint.setStrokeWidth(4);

    // 直角三角形
    Path path = new Path();
    path.lineTo(30, 30);
    path.lineTo(0, 30);
    path.close();

    mPaint.setPathEffect(new PathDashPathEffect(path, 50, mPhase++, PathDashPathEffect.Style.TRANSLATE));
    canvas.drawPath(mPath, mPaint);
    invalidate();
}
```
    语句解释：
    -  使用PathDashPathEffect来自定义虚线的形状，构造方法的参数：
       -  第一个参数，表示形状。
       -  第二个参数，表示虚线之间的距离间隔。
       -  第三个参数，用来让虚线动起来的偏移量。
       -  第四个参数，当虚线动起来时，形状的移动方式，有三个取值，它们所对应的效果请自行观察，一言难尽！

<br>　　范例6：复合特效——波浪线。

<center>
![ComposePathEffect的效果](/img/android/android_g03_09.png)
</center>

``` java
mPaint.setPathEffect(new ComposePathEffect(new CornerPathEffect(30),new DiscretePathEffect(10,5)));
```
    语句解释：
    -  使用ComposePathEffect用来将两个特效合并起来。
    -  其中ComposePathEffect会首先将构造方法的第二个参数表现出来，然后再在它的基础上去增加第一个参数的效果。

<br>　　范例7：复合特效——简单叠加。

<center>
![SumPathEffect的效果](/img/android/android_g03_10.png)
</center>

``` java
// SumPathEffect(PathEffect first, PathEffect second)
mPaint.setPathEffect(new SumPathEffect(new DiscretePathEffect(10, 20), new CornerPathEffect(30)));
```
    语句解释：
    -  顾名思义，SumPathEffect表示叠加效果，和ComposePathEffect不同，它在表现时会将两个参数的效果都独立的表现出来，接着将两个效果简单的重叠在一起显示出来！




## 画布 ##
<br>　　范例1：画布的相关操作。

<center>
![效果图](/img/android/android_g03_04.png)
</center>

``` java
@Override
protected void onDraw(Canvas canvas) {
    Paint p = new Paint();
    p.setColor(Color.RED);
    p.setTextSize(25);
    canvas.drawText("AAAAAAAAAAAAAA", 100, 100, p);
    p.setColor(Color.GREEN);
    // 保存当前画布的参数。
    canvas.save();
    // 让“绘点”从当前位置（也就是(0,0)上）开始，在水平和垂直方向上，都平移100像素。
    // “绘点”表示当前的绘制位置，它和文本框中的输入光标是一个概念。
    canvas.translate(100, 100);
    // 让绘点旋转90度。
    // 由于旋转的是绘点而不是画布，因此在绘点旋转之前就存在于画布中的内容是不会被旋转的。
    // 但接下来所绘制的内容，会相对于新的绘点进行绘制。
    canvas.rotate(90);
    canvas.drawText("1BBBBBBBBBBBBBB2", 0, 0, p);
    // 还原画布。需要注意的是，还原的只是“绘点”等参数的值，我们刚才绘制的“1BBBBBBBBBBBBBB2”依然存在。
    canvas.restore();
    p.setColor(Color.BLUE);
    canvas.save();
    // 让绘点在水平和垂直方向上放大3倍，稍后绘制的东西都将被放大3倍。
    canvas.scale(3, 3);
    // 将会在300,300的位置上绘制一个矩形。  
    canvas.drawRect(new Rect(100, 100, 130, 130), p);
    // 还原画布。
    canvas.restore();

    p.setColor(Color.BLACK);
    canvas.drawRect(new Rect(140, 140, 170, 170), p);

    p.setColor(Color.RED);
    canvas.drawRect(new Rect(300, 300, 380, 380), p);
}
```
    语句解释：
    -  Canvas对象与Matrix对象类似，也支持平移、缩放、旋转、倾斜四种基本操作。
    -  上面用到的save()方法用来将当前Canvas对象的各项参数保存起来，restore()方法用来将Canvas对象还原到上一次保存的后的状态。
    -  你可以连续调用多次save()方法，相应的如果你想还原画布到最初的状态，就必须得连续调用多次restore()方法。

<br>　　接下来我们综合上面所学的知识，自定义一个钟表控件，程序运行的效果如下：

<center>
![然而此刻已是：2016-1-14 0点10分](/img/android/android_g03_05.png)
</center>

<br>　　完整代码如下：
``` java
public class MyView extends View {

    private Paint mPaint;
    // 表盘的半径
    private int radius;
    // 时分秒三个指针的长度
    private int hourPointLen;
    private int minutePointLen;
    private int secondPointLen;
    // 表盘上的大、小刻度线的长度
    private int smallMarkLen;
    private int bigMarkLen;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint();
        mPaint.setStrokeWidth(1);
        mPaint.setAntiAlias(true);
        mPaint.setColor(Color.BLACK);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setTextAlign(Paint.Align.CENTER);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        // 如果当前尺寸或者位置发生了变化，则重新初始化各个变量。
        // 通过阅读View类的源码可知，在onSizeChanged、onLayout方法被调用的时候，
        //       就可以通过getWidth()和getHeight()来获取实际宽高了，具体请参阅前面两章博文。
        int min = Math.min(getWidth(), getHeight());
        radius = min / 2 - 20;
        hourPointLen = (int) (radius * 0.45);
        minutePointLen = (int) (radius * 0.7);
        secondPointLen = (int) (radius * 0.85);
        bigMarkLen = (int) (radius * 0.045);
        smallMarkLen = (int) (radius * 0.025);
        // 字体的大小随着半径的大小而变化。
        mPaint.setTextSize(radius / 8);
    }

    Rect rect = new Rect();

    protected void onDraw(Canvas canvas) {
        canvas.save();
        // 将绘点移动到View的中心。
        canvas.translate(getWidth() / 2, getHeight() / 2);
        // 绘制表盘，其实就是一个圆形。
        canvas.drawCircle(0, 0, radius, mPaint);
        // 绘制表的刻度
        int count = 60, degree, lineLen;
        for (int i = 0; i < count; i++) {
            degree = 360 / count * i;
            lineLen = (i % 5 == 0 ? bigMarkLen : smallMarkLen);
            canvas.save();
            canvas.rotate(degree);
            canvas.translate(0, -radius);
            canvas.drawLine(0, 0, 0, lineLen, mPaint);
            // 绘制表盘上的数字。
            if (i % 5 == 0) {
                int numberInt = (i / 5 == 0 ? 12 : i / 5);
                String numberStr = String.valueOf(numberInt);
                // 获取字体的尺寸，因为下面会用到字体的高度。
                mPaint.getTextBounds(numberStr, 0, numberStr.length(), rect);
                int xOffsetRate = 0;
                float yOffsetRate = 0;
                if (numberInt != 6 && numberInt != 12) {    // 1~5或者7~11
                    xOffsetRate = (numberInt < 6 ? 1 : -1);
                }
                if (numberInt != 3 && numberInt != 9) {    // 10~2或者4~8
                    yOffsetRate = (numberInt > 9 || numberInt < 3 ? 1 : -0.25f);
                }
                // 调整绘点的位置，以便稍后绘制数字时，数字不会跑偏。
                canvas.translate(xOffsetRate * (rect.width() / 2), 
                       2 * lineLen + yOffsetRate * (rect.height() / 2));
                // 然后将绘点旋转回去，不然数字也会旋转。
                canvas.rotate(-degree);
                canvas.drawText(numberStr, 0, 0, mPaint);
            }
            canvas.restore();
        }
        // 绘制指针尾部的圆点。
        canvas.drawCircle(0, 0, 7, mPaint);
        // 绘制时针、分针、秒针。
        drawLine(0, 10, 0, -hourPointLen, mPaint, canvas, Calendar.HOUR);
        drawLine(0, 10, 0, -minutePointLen, mPaint, canvas, Calendar.MINUTE);
        drawLine(0, 10, 0, -secondPointLen, mPaint, canvas, Calendar.SECOND);
        // 1秒后进行重绘。
        postInvalidateDelayed(1000);
        canvas.restore();
    }

    private void drawLine(float startX, float startY, float stopX, float stopY, 
            Paint paint, Canvas canvas, int type) {
        Calendar curTime = Calendar.getInstance();
        canvas.save();
        float rotate = 0, num = curTime.get(type);
        switch (type) {
            case Calendar.HOUR:
                float offsetDegree = (curTime.get(Calendar.MINUTE) / 10.0f - 1) * 6;
                rotate = (num == 12 ? 0 : num * 30 + offsetDegree);
                break;
            case Calendar.MINUTE:
            case Calendar.SECOND:
                rotate = (num == 0 ? 0 : num * 6);
                break;
        }
        canvas.rotate(rotate);
        canvas.drawLine(startX, startY, stopX, stopY, paint);
        canvas.restore();
    }

}
```
　　XML代码如下：
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/aa"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <com.cutler.demo.common.view.MyView
        android:layout_centerInParent="true"
        android:id="@+id/myView"
        android:layout_width="200dp"
        android:layout_height="200dp"  />

</RelativeLayout>
```
    语句解释：
    -  如果你想深刻理解自定控件，那么就必须得亲自去写。

<br>　　范例3：绘制`Bitmap`。
``` java
public class MyView extends TextView {

    // 此处省略构造方法和onMeasure()方法。

    private Bitmap mBitmap;
    private Paint mPaint;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 加载位图。
        mBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
        mPaint = new Paint();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // 将位图绘制到(100,100)的点上。
        canvas.drawBitmap(mBitmap, 100, 100, mPaint);

        // 先通过Matrix来记录位图的缩放、位置、旋转、倾斜的信息，然后统一交给Canvas对象进行绘制。
        Matrix matrix = new Matrix();
        matrix.setTranslate(100,400);
        matrix.postScale(1, 2);
        canvas.drawBitmap(mBitmap, matrix, mPaint);
    }
}
```
    语句解释：
    -  更多关于Btimap与Matrix类的介绍，请参看笔者的另一篇博文《媒体篇　第二章 图片》。

<br>　　范例4：绘制`GIF`。
``` java
public class MyView extends TextView {
    // 我们将使用android.graphics.Movie类来绘制GIF。
    private Movie mMovie;
    // 记录当前播放的位置。
    private long mMovieStart;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 获取res/drawable目录下的GIF文件的输入流。
        InputStream input = context.getResources().openRawResource(R.drawable.animated_gif);
        // 从输入流中读入数据，并创建一个Movie对象。
        mMovie = Movie.decodeStream(input);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // 获取当前时间。
        long now = android.os.SystemClock.uptimeMillis();
        if (mMovieStart == 0) {   // first time
            mMovieStart = now;
        }
        if (mMovie != null) {
            // 获取GIF文件的总时长。
            int dur = mMovie.duration();
            if (dur == 0) {
                dur = 1000;
            }
            // 计算当前需要播放的位置。
            int relTime = (int)((now - mMovieStart) % dur);
            // 将GIF调整到relTime所对应的帧上。
            mMovie.setTime(relTime);
            // 将当前帧绘制到canvas的(0,0)坐标上。
            mMovie.draw(canvas, 0, 0);
            // 绘制完后，调用下面的方法，触发下一次绘制。
            invalidate();
        }
    }
}
```
    语句解释：
    -  如果你执行本范例出错了，可能是默认开启了硬件加速导致的，你可以在清单文件的Application标签中添加如下属性来禁用硬件加速：
       -  android:hardwareAccelerated="false"
    -  如果你想通过代码来放大、缩小GIF，那么可以调用Canvas提供的scale()方法实现。


## Xfermodes ##
　　假设现在`Canvas`中有`A`，`B`两张图片，`A`在下面`B`在上面，且它们有重叠的部分，默认情况下此时显示出来的效果将是，`B`图会盖住`A`图的某一部分。不过这个默认的行为是可以修改的，也就是说我们可以让重叠的位置上，显示`A`的部分，或者显示`B`的部分，或者都不显示。

　　这一切都是通过修改`Paint`对象的`Xfermode`属性来完成。

<br>　　范例1：16种显示模式。

<center>
![本范例运行效果示意图，最左边的为原始图像](/img/android/android_b08_02.png)
</center>

``` java
public class MyView extends View {

    public MyView(Context context) {
        super(context);
    }

    private static final Xfermode[] sModes = {
            new PorterDuffXfermode(PorterDuff.Mode.CLEAR),
            new PorterDuffXfermode(PorterDuff.Mode.SRC),
            new PorterDuffXfermode(PorterDuff.Mode.DST),
            new PorterDuffXfermode(PorterDuff.Mode.SRC_OVER),
            new PorterDuffXfermode(PorterDuff.Mode.DST_OVER),
            new PorterDuffXfermode(PorterDuff.Mode.SRC_IN),
            new PorterDuffXfermode(PorterDuff.Mode.DST_IN),
            new PorterDuffXfermode(PorterDuff.Mode.SRC_OUT),
            new PorterDuffXfermode(PorterDuff.Mode.DST_OUT),
            new PorterDuffXfermode(PorterDuff.Mode.SRC_ATOP),
            new PorterDuffXfermode(PorterDuff.Mode.DST_ATOP),
            new PorterDuffXfermode(PorterDuff.Mode.XOR),
            new PorterDuffXfermode(PorterDuff.Mode.DARKEN),
            new PorterDuffXfermode(PorterDuff.Mode.LIGHTEN),
            new PorterDuffXfermode(PorterDuff.Mode.MULTIPLY),
            new PorterDuffXfermode(PorterDuff.Mode.SCREEN)
    };

    private static final String[] sLabels = {
            "Clear", "Src", "Dst", "SrcOver",
            "DstOver", "SrcIn", "DstIn", "SrcOut",
            "DstOut", "SrcATop", "DstATop", "Xor",
            "Darken", "Lighten", "Multiply", "Screen"
    };

    // create a bitmap with a rect, used for the "src" image
    static Bitmap makeSrc(int w, int h) {
        Bitmap bm = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bm);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setColor(0xFF66AAFF);
        c.drawRect(w/3, h/3, w*19/20, h*19/20, p);
        return bm;
    }

    // create a bitmap with a circle, used for the "dst" image
    static Bitmap makeDst(int w, int h) {
        Bitmap bm = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bm);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setColor(0xFFFFCC44);
        c.drawOval(new RectF(0, 0, w*3/4, h*3/4), p);
        return bm;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        int W = 128, H = 128, ROW_MAX = 4;
        // 创建一些初始化参数
        Bitmap mSrcB = makeSrc(W, H);
        Bitmap mDstB = makeDst(W, H);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Paint labelP = new Paint(Paint.ANTI_ALIAS_FLAG);
        labelP.setTextSize(30);
        Bitmap bm = Bitmap.createBitmap(new int[] { 0xFFFFFFFF, 0xFFCCCCCC, 0xFFCCCCCC, 0xFFFFFFFF }, 2, 2,
            Bitmap.Config.RGB_565);
        BitmapShader mBG = new BitmapShader(bm, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT);
        Matrix m = new Matrix();
        m.setScale(6, 6);
        mBG.setLocalMatrix(m);

        // 绘制原始效果图
        canvas.drawBitmap(mDstB, 200, 200, paint);
        canvas.drawBitmap(mSrcB, 200, 200, paint);

        // 移动画布，然后在新位置上绘制各类型的效果图
        canvas.translate(400, 200);

        int x = 0;
        int y = 0;
        for (int i = 0; i < sModes.length; i++) {
            // draw the border
            paint.setStyle(Paint.Style.STROKE);
            paint.setShader(null);
            canvas.drawRect(x - 0.5f, y - 0.5f,
                    x + W + 0.5f, y + H + 0.5f, paint);
            // draw the checker-board pattern
            paint.setStyle(Paint.Style.FILL);
            paint.setShader(mBG);
            canvas.drawRect(x, y, x + W, y + H, paint);
            // draw the src/dst example into our offscreen bitmap
            int sc = canvas.saveLayer(x, y, x + W, y + H, null,
                    Canvas.MATRIX_SAVE_FLAG |
                            Canvas.CLIP_SAVE_FLAG |
                            Canvas.HAS_ALPHA_LAYER_SAVE_FLAG |
                            Canvas.FULL_COLOR_LAYER_SAVE_FLAG |
                            Canvas.CLIP_TO_LAYER_SAVE_FLAG);
            canvas.translate(x, y);
            canvas.drawBitmap(mDstB, 0, 0, paint);
            paint.setXfermode(sModes[i]);
            canvas.drawBitmap(mSrcB, 0, 0, paint);
            paint.setXfermode(null);
            canvas.restoreToCount(sc);
            // draw the label
            canvas.drawText(sLabels[i], x, y - labelP.getTextSize()/2, labelP);
            x += W + 10;
            // wrap around when we've drawn enough for one row
            if ((i % ROW_MAX) == ROW_MAX - 1) {
                x = 0;
                y += H + 60;
            }
        }
    }
}
```
    语句解释：
    -  上面这一大段代码可能会让你头大，不过没关系，里面有不少代码是为了显示效果更好而加上的(如BitmapShader类)，最重要的代码是96-99行。

<br>　　我们使用`Xfermode`的步骤通常为：

    -  第一步，往画布中绘制一个Bitmap对象，这个对象就是上图中的Dst，同时也是上面范例中的mDstB变量。
    -  第二步，调用画笔的setXfermode()方法修改Xfermode。
    -  第三步，往画布中绘制第二个Bitmap对象，这个对象就是上图中的Src，同时也是上面范例中的mSrcB变量。
    -  第四步，调用paint.setXfermode(null);来还原，以免对后续的绘图产生影响。

<br>　　简单的说，先画到画布上的图片被称为`Dst`，后画的则称为`Src`。

<br>　　范例2：简单应用。

<center>
![运行效果](/img/android/android_g03_11.png)
</center>

``` java
public class MyView extends View {
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        // 创建一个新的Bitmap对象。
        Bitmap bitmap = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
        // 通过Bitmap对象来创建一个Canvas，之后在此Canvas上绘制的内容，都会被放到Bitmap上。
        Canvas newCanvas = new Canvas(bitmap);

        Bitmap mDstB = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
        Bitmap mSrcB = BitmapFactory.decodeResource(getResources(), R.mipmap.bg);
        // 先绘制照片，然后再绘制背景图片。由于背景图片尺寸大，所以运行时会将照片盖住。
        newCanvas.drawBitmap(mDstB, 0, 0, paint);
        newCanvas.drawBitmap(mSrcB, 0, 0, paint);

        newCanvas.translate(0, 400);

        // 同样是先绘制照片，再绘制背景图片。
        newCanvas.drawBitmap(mDstB, 0, 0, paint);
        // 修改画笔的Xfermode，让照片显示在背景图片的上面。
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OVER));
        // 绘制背景图片。
        newCanvas.drawBitmap(mSrcB, 0, 0, paint);
        // 清空设置。
        paint.setXfermode(null);

        // 将bitmap绘制到控件上。
        canvas.drawBitmap(bitmap, 0, 0, paint);
    }
}
```

<br>　　范例3：圆形头像。

<center>
![运行效果](/img/android/android_g03_12.png)
</center>

``` java
public class MyView extends View {
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.FILL);

        Bitmap bitmap = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
        Canvas newCanvas = new Canvas(bitmap);

        Bitmap mSrcB = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
        // 先绘制圆形。
        newCanvas.drawCircle(mSrcB.getWidth() / 2, mSrcB.getHeight() / 2, mSrcB.getWidth() / 2, paint);
        // 修改画笔的Xfermode。
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        // 绘制照片。
        newCanvas.drawBitmap(mSrcB, 0, 0, paint);
        // 情况设置。
        paint.setXfermode(null);

        // 将bitmap绘制到控件上。
        canvas.drawBitmap(bitmap, 0, 0, paint);
    }
}
```
    语句解释：
    -  需要注意的是，本范例一定要先绘制圆形，再绘制照片。
    -  因为PorterDuffXfermode只会影响调用setXfermode方法之后所绘制的图片，它没法修改已经被画到Canvas上的图片。
    -  本范例中，圆形和背景图片之间的重叠部位将被显示出来，如果画笔使用的是Paint.Style.STROKE，则就只会显示一个圆形，即透明像素不算在重合范围内。


<br>　　范例4：帮美女脱衣服 —— 是时候该撸一波了。

<center>
![营养跟不上了](/img/android/android_g03_13.png)
</center>

``` java
public class MyView extends View {
    private Bitmap mBgBitmap;    // 背景图片
    private Bitmap mFgBitmap;    // 前景图片
    private Canvas mFgCanvas;
    private Path mFgPath;
    private Paint mPaint;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);

        // 背景图片，柳岩大胸照
        mBgBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.bg);
        mFgBitmap = Bitmap.createBitmap(mBgBitmap.getWidth(), 
            mBgBitmap.getHeight(), Bitmap.Config.ARGB_8888);
        mFgCanvas = new Canvas(mFgBitmap);
        // 前景图片，填充灰色。
        mFgCanvas.drawColor(Color.LTGRAY);

        // path和画笔。
        mFgPath = new Path();
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(30);
        mPaint.setStrokeCap(Paint.Cap.ROUND);     // 让线的两头圆角显示。
        mPaint.setStrokeJoin(Paint.Join.ROUND);   // 让连接处更圆滑的显示。
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mFgPath.moveTo(event.getX(), event.getY());
                break;
            case MotionEvent.ACTION_MOVE:
                mFgPath.lineTo(event.getX(), event.getY());
                break;
        }
        // 注意这里一定要把画笔设置为完全透明。
        // 当系统通过Xfermode决定了要绘制的内容后，就会使用Paint进行绘制。
        // 而如果Paint的透明度为0，则就会实现擦除效果。
        mPaint.setAlpha(0);
        // 由于设置了画笔的透明度为0，所以此行代码也可以使用PorterDuff.Mode.SRC_IN模式。
        mPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
        mFgCanvas.drawPath(mFgPath, mPaint);
        mPaint.setXfermode(null);
        // 设置为完全不透明。
        mPaint.setAlpha(255);
        invalidate();
        return true;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawBitmap(mBgBitmap, 0, 0, mPaint);
        canvas.drawBitmap(mFgBitmap, 0, 0, mPaint);
    }
}
```
    语句解释：
    -  拿好你的纸，小鬼，否则你会发现自己正躺在基地等重生！

## Shader ##
　　Shader又被称为着色器、渲染器，它用来实现一系列的渐变、渲染效果。Android中的Shader包括以下几种：

    -  BitmapShader（位图Shader）、LinearGradient（线性Shaer）、RadialGradient（光束Shader）。
    -  SweepGradient（梯度Shader）、ComposeShader（混合Shader）。


<br>　　`BitmapShader`是一个特殊的`Shader`，它使用一张图片来实现渐变效果。

<br>　　范例1：BitmapShader —— 图片填充。

<center>
![BitmapShader](/img/android/android_g03_14.png)
</center>

``` java
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
    // 使用Paint类的setShader方法可以为画笔设置Shader。
    // BitmapShader构造方法的三个参数分别是：图片、图片在x和y轴的填充方式。
    paint.setShader(new BitmapShader(bitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP));
    // 当图片的尺寸小于这个Rect时，就会拉伸图片x和y轴上的最后一个像素来填充Rect。
    canvas.drawRect(new Rect(0, 0, 300, 300), paint);

    bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
    paint.setShader(new BitmapShader(bitmap, Shader.TileMode.REPEAT, Shader.TileMode.REPEAT));
    // 当图片的尺寸小于这个Rect时，通过平铺图片的方式来填充Rect。
    canvas.drawRect(new Rect(350, 0, 650, 300), paint);

    bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
    paint.setShader(new BitmapShader(bitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP));
    canvas.drawRect(new Rect(700, 0, 1000, 300), paint);
}
```
    语句解释：
    -  BitmapShader的填充方式有三种取值：
       -  Shader.TileMode.CLAMP：通过拉伸图片x和y轴的最后一个像素来填充显示区域。
       -  Shader.TileMode.REPEAT：通过平铺图片的方式来填充显示区域。
       -  Shader.TileMode.MIRROR：通过镜像的方式来填充显示区域，具体会在后面介绍。
    -  观察第三副图你会发现它里面的内容其实和第一副图的拉伸区域一样，这是因为：
       -  不论第三个图的Rect是在什么位置上，图片都会从当前View的（0,0）点开始填充。
       -  因此Rect(700, 0, 1000, 300)所看到的就是拉伸后的区域。
       -  第二幅图也是一个道理，也是从当前View的（0,0）点开始平铺。

<br>　　范例2：BitmapShader —— 圆形头像。

<center>
![运行效果](/img/android/android_g03_12.png)
</center>

``` java
Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.photo);
paint.setShader(new BitmapShader(bitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP));
canvas.drawCircle(bitmap.getWidth() / 2, bitmap.getWidth() / 2, bitmap.getWidth() / 2, paint);
```
    语句解释：
    -  当显示区域的尺寸和图片的尺寸相同时，就看不到被拉伸的部位了。
    -  或者也可以让美工给图片是边缘加上1像素的透明，这样拉伸的其实就是那个透明像素了。


<br>　　范例3：LinearGradient —— 线性渐变。

<center>
![运行效果](/img/android/android_g03_15.png)
</center>

``` java
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

    // 从左到右、从蓝色到黄色。当渐变区域的尺寸小于下面的Rect时，拉伸最后一像素渐变。
    paint.setShader(new LinearGradient(0, 0, 100, 0, Color.BLUE, Color.YELLOW, Shader.TileMode.CLAMP));
    canvas.drawRect(new Rect(0, 0, 200, 200), paint);

    // 从上到下、从蓝色黄色。当渐变区域的尺寸小于下面的Rect时，平铺渐变。
    paint.setShader(new LinearGradient(0, 0, 0, 100, Color.BLUE, Color.YELLOW, Shader.TileMode.REPEAT));
    canvas.drawRect(new Rect(250, 0, 450, 200), paint);

    // 从左上到右下、从蓝色黄色。当渐变区域的尺寸小于下面的Rect时，镜像渐变。
    paint.setShader(new LinearGradient(500, 0, 600, 100, Color.BLUE, Color.YELLOW, Shader.TileMode.MIRROR));
    canvas.drawRect(new Rect(500, 0, 700, 200), paint);
}
```
    语句解释：
    -  BitmapShader的图片默认会从当前View的（0,0）点开始填充，而在LinearGradient中则可以明确指定开始渐变的位置。
    -  比如本范例的第三个图，第14行代码明确的指定了从当前View的（500,0）开始渐变，到View的（600,100）结束。

<br>　　也许你会说：“但学这些又有什么卵用呢？”，笔者只能回答：`young man , too simple , always naive !`。

<br>　　范例4：仿QQ音乐歌词播放。

<center>
![程序运行效果](/img/android/android_g03_16.png)
</center>

``` java
public class MyView extends View {
    public static final int RATE = 10;  // 每秒钟绘制的次数。
    private LinearGradient mLinearGradient;
    private Matrix mGradientMatrix;
    private List<Line> mTextList;
    private Paint mPaint;
    private int mLineHeight;
    private long mStartTime = -1;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mTextList = new ArrayList<Line>();
        // Line类的定义在最下面，每个Line对象表示一行歌词。
        mTextList.add(new Line("再见我的爱", 0));
        mTextList.add(new Line("I wanna say goodbye", 1));
        mTextList.add(new Line("再见我的过去", 2));
        mTextList.add(new Line("I want a new life", 3));
        mTextList.add(new Line("再见我的眼泪跌倒和失败", 4));
        mTextList.add(new Line("再见那个年少轻狂的时代", 7));
        mTextList.add(new Line("再见我的烦恼 不再孤单", 10));
        mTextList.add(new Line("再见我的懦弱 不再哭喊", 13));
        mTextList.add(new Line("Now I wanna say", 16));
        mTextList.add(new Line("Hello Hello", 17));

        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setTextSize(34);
        Rect rect = new Rect();
        // 依次计算每行歌词的停止时间、歌词的宽度，稍后会用到。
        for (int i = 0; i < mTextList.size(); i++) {
            Line line = mTextList.get(i);
            mPaint.getTextBounds(line.text, 0, line.text.length(), rect);
            // 最后一行歌词的播放时间是1秒。
            line.stopTime = (i + 1 < mTextList.size() ? 
                 mTextList.get(i + 1).startTime : line.startTime + 1000);
            // 之前我们说过，getTextBounds会有误差，所以这里我们给加上10。
            line.textWidth = rect.width() + 10;
            // 每行歌词之间有20像素的间隔，即行间距。
            mLineHeight = rect.height() + 20;
        }

        // 设置点击事件，每次点击当前View时，就开始播放歌词。
        setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                // 记录用户的点击时间，把它视为开始播放的时间。
                mStartTime = System.currentTimeMillis();
                invalidate();
            }
        });
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        // 线性渐变，从左到右，从黑色到绿色。
        mLinearGradient = new LinearGradient(0, 0, getWidth() * 2, 0, 
             Color.BLACK, Color.parseColor("#32CD32"), Shader.TileMode.REPEAT);
        mPaint.setShader(mLinearGradient);
        // 这个矩阵稍后用来让渐变效果像动画一样动起来。
        mGradientMatrix = new Matrix();
    }

    int mTranslateX;

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        int offsetY = mLineHeight;
        // 依次绘制每一行歌词。
        for (int i = 0; i < mTextList.size(); i++) {
            Line line = mTextList.get(i);
            // 如果已经开始播放歌词了。
            if (mStartTime != -1) {
                float currentTime = System.currentTimeMillis() - mStartTime;
                // 如果当前已播放的时间，正好处于line的时间范围内。
                if (currentTime >= line.startTime && currentTime < line.stopTime) {
                    // 计算出渐变的位置。
                    mTranslateX = (int) ((currentTime - line.startTime) / 
                         (line.stopTime - line.startTime) * line.textWidth);
                    // 让矩阵移动到mTranslateX位置上。
                    mGradientMatrix.setTranslate(mTranslateX, 0);
                    // 更新Shader的Matrix对象，这样就能达到动画的效果了。
                    mLinearGradient.setLocalMatrix(mGradientMatrix);
                    // 你懂的。
                    mPaint.setShader(mLinearGradient);
                }
            }
            canvas.drawText(line.text, 0, offsetY, mPaint);
            offsetY += mLineHeight;
            mPaint.setShader(null);
        }
        postInvalidateDelayed(1000 / RATE);
    }

    static class Line {
        String text;
        float startTime;
        float stopTime;
        int textWidth;

        public Line(String text, float startTime) {
            this.text = text;
            this.startTime = startTime * 1000;
        }
    }
}
```
    语句解释：
    -  pia pia pia，打的疼不？
    -  本范例可以直接运行，由于它只是演示一个思路，所以在把它拿到项目中使用之前，还得做一些优化。
    -  本范例是笔者在看到《Android群侠传》有一个使用LinearGradient变色文字的范例后，突然想到QQ音乐的歌词效果，就尝试着实现了，（我知道，无形装逼最为致命）。

<br>　　范例5：图片倒影1.0。

<center>
![程序运行效果](/img/android/android_g03_17.png)
</center>

``` java
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.bg);
    canvas.drawColor(Color.BLACK);

    // 使用镜像方式绘制图片，下面的代码将会绘制2份srcBitmap，一个是正常显示，一个是倒影显示。
    paint.setShader(new BitmapShader(bitmap, Shader.TileMode.MIRROR, Shader.TileMode.MIRROR));
    canvas.drawRect(new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight() * 2), paint);

    // 从当前控件的（0, bitmap.getHeight()）点开始、从上到下、线性渐变。
    paint.setShader(new LinearGradient(0, bitmap.getHeight(), 0, bitmap.getHeight() * 1.5f,
         // 颜色值也可以使用8位16进制的常量表示，从左到右分别对应ARGB。
         0x77000000, 0x00000000, Shader.TileMode.CLAMP));
    // 此处利用了我们前面说的“纯透明不算重合”的特性。
    paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
    // 在倒影图片的位置上绘制一个矩形。
    canvas.drawRect(new Rect(0, bitmap.getHeight(), bitmap.getWidth(), bitmap.getHeight() * 2), paint);
}
```
    语句解释：
    -  正如你看到的那样，使用镜像方式实现倒影的效果并不好，因为原图和倒影图之间没有缝隙，紧紧地挨着。

<br>　　范例5：图片倒影2.0。

<center>
![程序运行效果](/img/android/android_g03_18.png)
</center>

``` java
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    canvas.drawColor(Color.BLACK);

    Bitmap srcBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.bg);
    Matrix matrix = new Matrix();
    // 把x和y的值设置为负数，分别可以将图在x轴、y轴上的颠倒。
    matrix.setScale(1, -1);
    Bitmap shadowBitmap = Bitmap.createBitmap(srcBitmap, 0, 0, srcBitmap.getWidth(),
         srcBitmap.getHeight(), matrix, true);
    // 绘制原图。
    canvas.drawBitmap(srcBitmap, 0, 0, paint);
    // 这个数字5就是原图和倒影图之间的距离间隔。
    int shadowBitmapY = srcBitmap.getHeight() + 5;
    canvas.drawBitmap(shadowBitmap, 0, shadowBitmapY, paint);

    paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_IN));
    paint.setShader(new LinearGradient(0, shadowBitmapY, 0, shadowBitmapY + 
          shadowBitmap.getHeight() * 0.5f, 0x77000000, 0x00000000, Shader.TileMode.CLAMP));
    canvas.drawRect(new Rect(0, shadowBitmapY, shadowBitmap.getWidth(), 
          shadowBitmapY + shadowBitmap.getHeight()), paint);
}
```
    语句解释：
    -  笔者认为这种方式效果比第一种好。

<br>　　另外几种`Shader`请读者自行搜素，网上有很多博文，笔者就不再重复造轮子了。
<br>　　正如上面的几个范例那样，在实际开发中我们并不会直接去使用`Shader`，而是会和其它技术配合使用。

## SurfaceView概述 ##
　　`Android`提供了View进行绘制处理，View可以满足大部分的绘图需求，但是在某些时候却也显得有些力不从心。

　　系统通过发出`VSYNC`信号来进行屏幕View的重绘，刷新的间隔时间为`16ms`。如果在`16ms`内View完成了你指定的所有操作，那么用户在视觉上就不会产生卡顿的感觉，而如果执行的操作逻辑太多，特别是需要频繁刷新的界面上，例如游戏界面，那么就会不断的阻塞主线程，从而导致画面卡顿。很多时候，在自定义View的Log中经常会看见如下所示的警告：

    -  skipped 47 frames , application may doing too much work on its main thread

　　这些警告的产生，很多情况下就是由于在绘制过程中处理逻辑太多造成的。

　　Android提供了`SurfaceView`组件来解决这个问题，`SurfaceView`可以说是View的孪生兄弟，它俩之间的区别：

    -  View在主线程中对画面进行刷新，而SurfaceView通常会通过一个子线程来进行页面的刷新。
    -  View在绘图时没有使用双缓冲机制，而SurfaceView在底层实现机制中就已经支持了双缓冲机制。

　　因此，若你的View需要大量的刷新，或者刷新的时候数据处理量比较大，那么就可以考虑使用`SurfaceView`了。
<br>　　笔者暂时不打算去看`SurfaceView`的用法，有兴趣的读者可以自行去搜索。

## 控件的属性 ##
　　除了使用系统内置的属性外(如`android:layout_width`等)，我们也可以为自己的控件，自定义属性。具体的步骤为：

    -  首先，在res/values文件夹下创建一个名为attr.xml的文件，并使用<resources>标签作为根节点。
    -  然后，在<resources>标签内部使用标签<declare-styleable>来定义一个属性集合。
    -  接着，属性使用<attr>标签来定义，每个属性都有两个属性：名称和数据类型，<attr>标签具有两个属性：name和format。 

<br>　　范例1：自定义属性。
``` xml
<resources>
    <declare-styleable name="CustomAttribute">
        <attr name="textSize"    format="integer" />
        <attr name="textWidth"   format="dimension" />
        <attr name="textColor"   format="color" />
        <attr name="textContent" format="reference" />
        <attr name="type">
            <flag name="top" value="0x1" />
            <flag name="bottom" value="0x2" />
        </attr>
    </declare-styleable>
</resources>
```
    语句解释：
    -  <declare-styleable>标签的name属性用来指出当前属性集合的名称，此标签内部定义的属性都将被放到这个属性集合中去。
    -  属性常见的数据类型有如下几种：
       -  integer：整型，可以为当前属性赋值一个整数。
       -  dimension：尺寸类型，可以为当前属性赋值一个尺寸数据。如：30dp 。
       -  color：颜色类型，可以为当前属性赋值一个颜色数据。如：#FF00FF 。
       -  reference：引用类型，可以为当前属性赋值一个资源ID。如：@drawable/icon 。
       -  string、boolean、float：数值类型。
    -  若某个属性支持多种数据类型，则数据类型之间可以使用“|”进行间隔，如：reference|string。属性也可以是枚举类型的，使用<flag>标签即可。

<br>　　范例2：让它们发生关系。
``` xml
<RelativeLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:cutler="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.example.cutler.androidtest.MyView
        android:id="@+id/myView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        cutler:textSize="30"
        cutler:textWidth="30dp"
        cutler:textColor="#FF0000"
        cutler:textContent="ContentMessage" />
</RelativeLayout>
```
    语句解释：
    -  以xmlns:为开头的代码就是在定义命名空间，本范例中定义了android和cutler两个命名空间。
    -  当Android程序运行的时候，系统为某个Activity初始化界面时，会解析其指定的布局文件。在解析其内某个控件的某个属性时，会去该属性所对应的命名空间中查看该属性的数据类型和用户赋的值的数据类型是否匹配。
       -  在android命名空间中存放的是系统内置的属性，咱们自定义的属性并不会被放到android命名空间中。
    -  问：Android系统最终会去什么地方验证呢?
       -  答：去R文件中。
    -  问：哪个R文件?
       -  答：命名空间后面跟随的那串字符串，最后一个“/”后面的字符，用来指明R文件的所在包。如在本范例中：
          -  android命名空间的属性，都会去andriod.R文件中验证。
          -  cutler命名空间中的属性，都会去com.example.cutler.androidtest.R文件中如验证，注意此处的res-auto表示由系统自动识别。
    -  事实上，使用<attr>标签定义的每一个属性，在R.attr内部类中都有一个与之对应的常量。验证属性时，首先根据属性的名称去R文件中获取该属性的资源ID，然后再通过资源ID来找到<attr>标签，然后再进行验证。 

<br>　　在程序中有多种方法可以获取到`xml`文件中的属性的值，最为简便、易懂的方法是通过`TypedArray`类来完成。

<br>　　范例3：获取属性值。
``` java
public class MyView extends View {

    public MyView(Context context) {
        super(context);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray list = context.obtainStyledAttributes(attrs, R.styleable.CustomAttribute);
        // 获取属性值。
        System.out.println("textSize "+list.getInt(R.styleable.CustomAttribute_textSize, 0));
        System.out.println("textWidth "+list.getDimension(R.styleable.CustomAttribute_textWidth, 0));
        System.out.println("textColor "+list.getColor(R.styleable.CustomAttribute_textColor, 0));
        System.out.println("textContent "+list.getString(list.getIndex(R.styleable.CustomAttribute_textContent)));
        System.out.println("count="+attrs.getAttributeCount());
    }
}
```
    语句解释：
    -  常量“R.styleable.CustomAttribute_textSize”是“R.attr.textSize”在数组“R.styleable.CustomAttribute”内的下标。

<br>**本章参考阅读：**
- [Android Canvas绘图详解（图文）](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2012/1212/703.html)
- [android.graphics包中的一些类的使用](http://yuanzhifei89.iteye.com/blog/1136651)
- [Android 完美实现图片圆角和圆形（对实现进行分析）](http://blog.csdn.net/lmj623565791/article/details/24555655)
- [Android Canvas绘制图片层叠处理方式porterduff xfermode](http://blog.csdn.net/shichaosong/article/details/21239221)
- [详解Paint的setPathEffect](http://www.myext.cn/c/a_7962.html)
- [Paint API之—— PathEffect(路径效果)](http://www.kancloud.cn/kancloud/android-tutorial/87257)

<br><br>