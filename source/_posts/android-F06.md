title: 进阶篇　第五章 自定义控件（一）之基础入门
date: 2015-4-29 11:41:12
categories: android
---
　　`Android`系统内置了许多控件，如果这些控件不能满足需求，您可以自定义自己的控件，自定义的控件必须继承`View`类。

<br>**三种自定义控件的方式**
<br>　　按实现方式来划分的话，自定义View分为三种：自绘控件、组合控件、以及继承控件。

	-  自绘控件：
	   -  自绘控件指的是，这个View上所展现的内容全部都是我们自己绘制出来的。此种方式也是最难的，一般会通过直接继承View类来实现自定义控件。
	-  继承控件：
	   -  如果对已有的控件进行小调整就能满足需求，那么可以通过继承它们并重写onDraw()方法来实现自定义控件。比如，继承EditText使之产生了带有下划线的记事本页面。
	-  组合控件：
	   -  通过将几个系统原生的控件组合到一起，来实现自定义控件。比如，使用PopupWindow和Button来组合出一个下拉列表框等。

<br>　　为了更好的理解自定义控件的各个步骤，在正式开始之前，我们先来了解一些相关的知识点：Activity的组成。

# 第一节 Activity的组成 #
　　本节来介绍一下`Window`和`WindowManagerService`两个类。
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
    -  此方法中首先保存了DecorView的引用，因为以后会用到它。
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

<br>**定位**
　　`View`的几何形状是`矩形`的，视图的`位置`使用`左上坐标系`表示，`尺寸`由`宽和高`表示，位置和尺寸以`像素`为单位。我们可以通过`getLeft()`和`getTop()`函数取得视图的位置：

	-  前者返回视图的左侧位置（横坐标X）。
	-  后者返回视图的顶部位置（纵坐标Y）。
　　这两个方法返回视图相对于其父视图的位置，例如`getLeft()`返回`20`，代表视图在其直接父视图左侧边的右侧`20`像素的位置。

　　另外，为了避免不必要的计算，提供了一些便利的方法，它们是`getRight()`和`getBottom()`。这些方法返回代表视图的矩形的右侧和底边的坐标。例如，调用`getRight()`比调用`getLeft() + getWidth()`要简单。

<br>**跳过绘制**
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

<br>**从窗口中添加和移除**
　　当View和其所在的Activity建立和断开连接时，系统会调用如下两个方法：

	-  Activity关闭或者View从Activity中移除时，View的onDetachedFromWindow方法会被调用。
	   -  通常在此方法中关闭线程和停止动画，从而避免内存泄漏。
	-  View被添加到Activity中时，它的onAttachedToWindow方法会被调用。

# 第四节 开始自定义 #
　　在绘制`View`时会涉及到两个类：`Paint`和`Canvas`，这两个类分别代表`画笔`和`画布`。
　　我们需要调用`Canvas`对象所提供的方法进行绘制，其中`Canvas`对象由框架创建，在View的`onDraw()`方法被调用时，系统会同时将`Canvas`对象以形参的形式传递给该方法。

　　`Canvas`对象提供的绘制图形的方法都是以`draw`开头的，我们可以查看`API`：

<center>
![](/img/android/android_b08_03.jpg)
</center>

　　从上面方法的名字看来我们可以知道`Canvas`可以绘制的对象有：弧线(`arcs`)、填充颜色(`argb`和`color`)、 `Bitmap`、圆(`circle`和`oval`)、点(`point`)、线(`line`)、矩形(`Rect`)、图片(`Picture`)、圆角矩形 (`RoundRect`)、文本(`text`)、顶点(`Vertices`)、路径(`path`)。

　　通过组合这些对象我们可以画出一些简单有趣的界面出来，但是光有这些功能还是不够的，如果我们要画一个钟表呢？
　　幸好Android还提供了一些对`Canvas`位置转换的方法：`rorate`、`scale`、`translate`、`skew`等，而且它允许你通过获得它的转换矩阵对象(`getMatrix`方法，不知道什么是转换矩阵？在[《媒体篇　第二章 图片》](http://cutler.github.io/android-D02/)中有介绍) 直接操作它。

　　为了方便执行转换操作，`Canvas`还提供了保存和回滚属性的方法(`save`和`restore`)，比如你可以先调用`save`方法保存目前画布的位置，然后旋转`90`度，向下移动`100`像素后画一些图形，画完后调用`restore`方法返回到刚才保存的位置。

## 画布和画笔 ##
　　简单的说，我们需要使用`Canvas`所提供的方法进行绘制，但绘制的同时还要传递给那些方法一个`Paint`对象，`Paint`对象用来设置画笔的颜色等参数。

<br>　　范例1：绘制文字。
``` android
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
        //   Paint.Align.LEFT : 将文本的左边放到(10,500)的位置，默认设置。
        //   Paint.Align.CENTER : 将文本的中心点放到(10,500)的位置。
        //   Paint.Align.RIGHT : 将文本的右边放到(10,500)的位置。
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

<br>　　范例2：绘制图形。
``` android
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

<br>　　范例3：绘制弧形。

<center>
![本范例运行效果示意图](/img/android/android_b08_01.png)
</center>

``` android
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

<br>　　范例4：绘制`GIF`。
``` android
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

<br>　　范例5：画布的相关操作。
``` java
@Override
protected void onDraw(Canvas canvas) {
    Paint p = new Paint();
    p.setColor(Color.RED);
    canvas.drawText("AAAAAAAAAAAAAA", 100, 100, mPaint);
    p.setColor(Color.GREEN);

    // 保存当前画布的参数。
    canvas.save();
    // 让“绘点”从当前位置（也就是(0,0)上）开始，在水平和垂直方向上，都平移100像素。
    // “绘点”表示当前的绘制位置，它和文本框中的输入光标是一个概念。
    canvas.translate(100,100);
    // 让绘点旋转90度。
    // 由于旋转的是绘点而不是画布，因此在绘点旋转之前就存在于画布中的内容是不会被旋转的。
    // 但接下来所绘制的内容，会相对于新的绘点进行绘制。
    canvas.rotate(90);
    canvas.drawText("1BBBBBBBBBBBBBB2", 0, 0, mPaint);
    // 还原画布。
    canvas.restore();

    p.setColor(Color.BLUE);
    canvas.save();
    // 让绘点在水平和垂直方向上，都放大3倍。
    canvas.scale(3,3);
    // 让绘点旋转30度。 
    canvas.rotate(30);
    // 绘制一个矩形。
    canvas.drawRect(new Rect(100,100,130,130), p);
    // 还原画布。
    canvas.restore();

    p.setColor(Color.BLACK);
    // 绘制一个矩形。
    canvas.drawRect(new Rect(140,140,170,170), p);
}
```
    语句解释：
    -  Canvas对象与Matrix对象类似，也支持平移、缩放、旋转、倾斜四种基本操作。
    -  上面用到的save()方法用来将当前Canvas对象的各项参数保存起来，restore()方法用来将Canvas对象还原到上一次保存的后的状态。
    -  你可以连续调用多次save()方法，相应的如果你想还原画布到最初的状态，就必须得连续调用多次restore()方法。

<br>　　范例6：绘制`Bitmap`。
``` android
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

## 钟表控件 ##
　　接下来我们综合上面所学的知识，自定义一个钟表控件，程序运行的效果如下：

<center>
![钟表控件运行效果示意图](/img/android/android_b08_03.png)
</center>

　　左图是我希望达到的效果，右图是实际达到的效果。 
　　不要日！！！由于笔者本人也是边学边用，因此暂时没有好的方法让表盘上的数字显示的正确，所以现在先让它存留一些缺陷，来日方长，日后再说。

<br>　　完整代码如下：
``` android
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
        mPaint.setTextSize(30);
        mPaint.setStrokeWidth(1);
        mPaint.setAntiAlias(true);
        mPaint.setColor(Color.BLACK);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setTextAlign(Paint.Align.CENTER);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // 如果当前尺寸或者位置发生了变化，则重新初始化各个变量。
        if (changed) {
            // 在onLayout方法被调用的时候，我们就可以通过getWidth()和getHeight()来获取实际宽高了。
            int min = Math.min(getWidth(), getHeight());
            radius = min / 2 - 20;
            hourPointLen = (int) (radius * 0.45);
            minutePointLen = (int) (radius * 0.7);
            secondPointLen = (int) (radius * 0.85);
            bigMarkLen = (int)(radius * 0.045);
            smallMarkLen = (int)(radius * 0.025);
        }
    }

    protected void onDraw(Canvas canvas) {
        canvas.save();
        // 将绘点移动到View的中心。
        canvas.translate(getWidth() / 2, getHeight() / 2);
        // 绘制表盘，其实就是一个圆形。
        canvas.drawCircle(0, 0, radius, mPaint);
        // 绘制表的刻度
        int count = 60, degree, lineLen;
        for(int i=0 ; i <count ; i++){
            degree = 360 / count * i;
            lineLen =  (i % 5 == 0 ? bigMarkLen : smallMarkLen);
            canvas.save();
            canvas.rotate(degree);
            canvas.translate(0, -radius);
            canvas.drawLine(0, 0, 0, lineLen, mPaint);
            // 绘制表盘上的数字。
            if (i % 5 == 0) {
                canvas.rotate(-degree);
                canvas.drawText(String.valueOf(i / 5 == 0 ? 12 : i / 5), 0, 0, mPaint);
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

    private void drawLine(float startX, float startY, float stopX, float stopY, Paint paint, Canvas canvas, int type) {
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
    -  如果你想深刻理解自定控件，那么就必须得亲自去写，我希望你看完本范例（或者根本不看）后直接仿写一遍它，你现在需要做的不是创新，而是模仿。 


## Path ##
　　当我们想在画布上绘制任意多边形时，就可以通过指定`Path`对象来实现。可以把`Path`对象看作是一个点集，在该点击中规划了多边形的路径信息。当然也可以使用`drawLines`方法来实现多边形，但是`drawPath`方法更为灵活、方便。

<br>　　范例1：平行四边形与棒棒糖。
``` android
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
``` android
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

## Xfermodes ##
　　假设现在`Canvas`中有`A`，`B`两张图片，`A`在下面`B`在上面，且它们有重叠的部分，默认情况下此时显示出来的效果将是，`B`图会盖住`A`图的某一部分。不过这个默认的行为是可以修改的，也就是说我们可以让重叠的位置上，显示`A`的部分，或者显示`B`的部分，或者都不显示。

　　这一切都是通过修改`Paint`对象的`Xfermode`属性来完成。

<br>　　范例1：16种显示模式。

<center>
![本范例运行效果示意图，最左边的为原始图像](/img/android/android_b08_02.png)
</center>

``` android
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

<br>　　范例2：圆形头像。

<center>
![运行效果](/img/android/android_b08_04.png)
</center>

``` android
public class MyView extends ImageView {

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        // 获取用户设置的图片
        Bitmap mSrcB = ((BitmapDrawable)getDrawable()).getBitmap();
        // 创建一个与原图具有相同尺寸的位图对象
        int width = mSrcB.getWidth();
        Bitmap mDstB = Bitmap.createBitmap(width, width, Bitmap.Config.ARGB_8888);
        // 创建一个临时的画布，任何向tmpCanvas上绘制的内容，都将被绘制到mDstB上
        Canvas tmpCanvas = new Canvas(mDstB);
        tmpCanvas.drawCircle(width / 2, width / 2, width / 2, paint);
        // 使用SRC_IN
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        // 绘制图片
        tmpCanvas.drawBitmap(mSrcB, 0, 0, paint);
        // 让画笔去掉Xfermode设置
        paint.setXfermode(null);
        // 将生成的新图片绘制到画布中
        canvas.drawBitmap(mDstB, 0, 0, paint);
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
        android:src="@drawable/a"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"  />

</RelativeLayout>
```
    语句解释：
    -  上面的代码中：
       -  首先创建了一个与图片具有相同尺寸的Bitmap对象mDstB，并让一个临时的画布指向该对象。
       -  然后在mDstB上画了一个实心的圆形，圆形之外的区域为透明区域。
       -  接着修改了一下画笔的xfermode属性，并在mDstB之上画了一个Bitmap对象mSrcB。 
       -  最后mDstB和mSrcB之间的重叠部位(一个圆形)将被显示出来（透明像素不算在重合范围内）。

## 控件的属性 ##
　　除了使用系统内置的属性外(如`android:layout_width`等)，我们也可以为自己的控件，自定义属性。具体的步骤为：

	-  首先，在res/values文件夹下创建一个名为attr.xml的文件，并使用<resources>标签作为根节点。
	-  然后，在<resources>标签内部使用标签<declare-styleable>来定义一个属性集合。
	-  接着，属性使用<attr>标签来定义，每个属性都有两个属性：名称和数据类型，<attr>标签具有两个属性：name和format。 

<br>　　范例1：自定义属性。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
``` android
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


<br>**本节参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android视图绘制流程完全解析，带你一步步深入了解View(二)](http://blog.csdn.net/guolin_blog/article/details/16330267)
- [Android视图状态及重绘流程分析，带你一步步深入了解View(三)](http://blog.csdn.net/guolin_blog/article/details/17045157)
- [Android自定义View的实现方法，带你一步步深入了解View(四)](http://blog.csdn.net/guolin_blog/article/details/17357967)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)
- [Android Canvas绘图详解（图文）](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2012/1212/703.html)
- [android.graphics包中的一些类的使用](http://yuanzhifei89.iteye.com/blog/1136651)
- [Android 完美实现图片圆角和圆形（对实现进行分析）](http://blog.csdn.net/lmj623565791/article/details/24555655)
- [Android Canvas绘制图片层叠处理方式porterduff xfermode](http://blog.csdn.net/shichaosong/article/details/21239221)

<br><br>