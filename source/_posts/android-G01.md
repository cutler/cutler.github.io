title: 自定义控件篇　第一章 基础入门
date: 2015-4-29 11:41:12
categories: android
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
``` android
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
　　查看的过程就不说了，直接说一下初始化的步骤吧：

	-  首先，当我们请求启动某个Activity时，系统会调用它的无参构造方法实例化一个它的对象。
	-  然后，会调用该对象的attach方法，执行初始化操作。
	-  最后，mWindow的初始化操作，就是在attach方法中进行的。

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
    -  如果继续追踪上面第8行代码的话，就可以知道mWindowManager所指向的对象将是WindowManagerImpl类型的。
    -  用一句话概括：“当Activity被实例化之后，会接着初始化它的mWindow、mWindowManager属性”。

<br>　　继续追踪就会发现，我们调用`setContentView`方法设置给Activity的布局，最终会由`PhoneWindow`类的`DecorView`管理。

　　这里先给出一个完整的示意图，后面会详细分析：

<center>
![Activity内部结构](/img/android/android_f05_01.png)
</center>

　　`DecorView`是`PhoneWindow`的内部类，继承自`FrameLayout`。还有一点需要知道的是：

	-  我们之所以说Activity的控件是由DecorView管理的，而不说是由PhoneWindow管理的，是因为：
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
    -  这段代码用来检测DecorView是否初始化完毕，然后在将layoutResID所对应的布局放到DecorView中。

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
``` android
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
	-  FrameworkClient用来连接SdkClient端和FrameworkServer端，它通过Binder机制让两者进行（跨进程）通信。
	   -  也就是说，WindowManagerService（简称WMS）只会和ViewRoot类通信，DecorView也只会和ViewRoot通信。

<br>**添加Activity到屏幕**
　　比如我们现在新建一个Activity，那么此时系统会这么执行：
	-  第一，先实例化Activity对象，然后调用attach方法初始化，然后在setContentView被调用时初始化DecorView。
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
    -  然后调用addToDisplay方法来请求WMS执行一些初始化操作。
    -  当然此时屏幕上还没有绘制任何内容，不过我们就不继续向下深入了，只需要知道控件的绘制等操作是在WMS那端完成的即可。

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
    -  在Activity的attach方法中可以找到初始化的代码：
       -  mWindow.setCallback(this);

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
``` android
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
``` android
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
``` android
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
``` android
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
``` android
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
``` android
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
``` android
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
	      -  比如，若父ViewGroup的layout_height值为100，子View的值为200，则最终传入到子View的高度就是200。
	-  第三，当系统需要测量某个View时，会调用View类的onMeasure方法。
	-  第四，MeasureSpec是一个复合的int值，在使用之前需要将它们拆解。

<br>　　需要说的是，普通View和ViewGroup的重写onMeasure方法时是有区别的：

	-  普通View只需要在onMeasure中测量自己的尺寸即可。
	-  ViewGroup除了完成自己的测量过程外，还会遍历去调用其所有子View的measure方法，各个子View再递归去执行这个流程。

<br>**普通View的重写**
<br>　　范例1：重写`onMeasure`方法。
``` android
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

<br>　　当然我们也可以不重写onMeasure方法，而是使用父类的实现：
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
``` android
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
	-  对于ViewGroup类来说，在它内部onLayout方法被改为抽象方法了，即要求所有ViewGroup的子类都必须重写它。

<br>　　接着我们来看下`ViewGroup.java`中的`layout()`和`onLayout()`方法的源码：
``` android
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
       -  若当前ViewGroup未添加LayoutTransition动画，或者动画此刻并未运行，那么调用super.layout(l, t, r, b)。
       -  否则将mLayoutCalledWhileSuppressed设置为true，等待动画完成时再调用requestLayout()。
    -  除此之外，还有两个地方需要注意：
       -  layout()方法增加了final关键字，这意味着它的所有子类无法重写layout()方法。
       -  onLayout()方法使用abstract关键字修饰了，这意味着它的所有子类必须重写此方法。


<br>　　我们来看下`LinearLayout`的`onLayout`方法：
``` android
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
``` android
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
``` android
public void postInvalidate() {
    postInvalidateDelayed(0);
}
```

## 其它常用方法 ##
###定位###
　　`View`的几何形状是`矩形`的，视图的`位置`使用`左上坐标系`表示，`尺寸`由`宽和高`表示，位置和尺寸以`像素`为单位。我们可以通过`getLeft()`和`getTop()`函数取得视图的位置：

	-  前者返回视图的左侧位置（横坐标X）。
	-  后者返回视图的顶部位置（纵坐标Y）。
　　这两个方法返回视图相对于其父视图的位置，例如`getLeft()`返回`20`，代表视图在其直接父视图左侧边的右侧`20`像素的位置。

　　另外，为了避免不必要的计算，提供了一些便利的方法，它们是`getRight()`和`getBottom()`。这些方法返回代表视图的矩形的右侧和底边的坐标。例如，调用`getRight()`比调用`getLeft() + getWidth()`要简单。

<br>
###跳过绘制###
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

<br>
###从窗口中添加和移除###
　　当View和其所在的Activity建立和断开连接时，系统会调用如下两个方法：

	-  Activity关闭或者View从Activity中移除时，View的onDetachedFromWindow方法会被调用。
	   -  通常在此方法中关闭线程和停止动画，从而避免内存泄漏。
	-  View被添加到Activity中时，它的onAttachedToWindow方法会被调用。

<br>
###大小改变###
　　在`View`类中还有一个比较有用的方法是`onSizeChanged`，当`View`的尺寸改变时就会调用它。

	-  一般情况下，我们在自定义控件的时候会依据View的尺寸来确定绘制的大小，但是程序在运行的时候不可避免的因为一些外力而导致View的尺寸发生变化（比如横竖屏切换、输入法弹出等）。
　　因此通常的做法是重写`onSizeChanged`方法，并在其内部更新变量的值，并调用进行`invalidate`方法重绘。
<br>

<br>**本章参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android视图绘制流程完全解析，带你一步步深入了解View(二)](http://blog.csdn.net/guolin_blog/article/details/16330267)
- [Android视图状态及重绘流程分析，带你一步步深入了解View(三)](http://blog.csdn.net/guolin_blog/article/details/17045157)
- [Android自定义View的实现方法，带你一步步深入了解View(四)](http://blog.csdn.net/guolin_blog/article/details/17357967)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)

<br><br>