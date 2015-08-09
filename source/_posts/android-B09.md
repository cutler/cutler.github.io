title: UI篇　第九章 自定义控件（二）
date: 2015-5-28 16:07:35
categories: android
---
　　学习要坚持`“以理论为指导，以实践验证理论”`的原则，因而本章将通过一些`实例Demo`、`开源项目分析`来使用上一篇博客中介绍的知识。笔者也始终坚信`“纸上学来终觉浅，绝知此事要躬行”`，只有当你自己亲自写一遍的时候，才会发现一些作者没有写的（因为太琐碎）、细节上的东西，而这些东西才是让程序员之间拉开差距的重点。

# 第一节 自定义控件实战 #


## WindowManager ##
　　笔者本人也是在跟随着前人的脚步来学习的，因而我们第一个实战是`通过WindowManager实现悬浮窗`功能。 本节主要参考下面两篇文章：

- [Android桌面悬浮窗效果实现，仿360手机卫士悬浮窗效果](http://blog.csdn.net/guolin_blog/article/details/8689140)
- [Android桌面悬浮窗进阶，QQ手机管家小火箭效果实现](http://blog.csdn.net/guolin_blog/article/details/16919859)


<br>　　简单的说，我们可以使用`WindowManager`类来向屏幕上添加`View`对象，最重要的是这个`View`可以在我们程序切入后台时仍然显示在屏幕上。具体的效果可以参看`“百度手机卫士”`。

　　接下来，我们先从最简单的范例开始，一步步的介绍`WindowManager`类的用法。

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
        // 接着，载入一个布局。
        View contentView = LayoutInflater.from(context).inflate(R.layout.inflate_tv, null);
        // 最后，将载入的内容放到屏幕中。
        manager.addView(contentView, params);
    }
}
```
    语句解释：
    -  添加到屏幕上的View对象，既可以是使用LayoutInflater来载入一个布局文件，也可以是通过代码来new出来的View对象。
    -  运行本范例时，我们就可以在屏幕的中央看到contentView所对应的内容。


<br>　　但是，如果我们在程序运行后，点击`Home`键，那么`contentView`就会随着`Activity`一起被切到后台。导致这个问题有两个原因：

	-  第一，我们传递给和方法的context是一个Activity对象。
	-  第二，没有为WindowManager.LayoutParams对象的type属性设置值。

<br>　　如果我们想让`contentView`不随着`Activity`一起隐藏，那么可以这么写：
``` android
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 传递Application对象过去。
        addViewToScreen(getApplication());
        // 3秒后关闭当前Activity。
        new Handler().postDelayed(new Runnable() {
            public void run() {
                finish();
            }
        }, 3000);
    }

    private void addViewToScreen(Context context){
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        // 为type字段赋值。
        params.type = WindowManager.LayoutParams.TYPE_PHONE;
        View view = LayoutInflater.from(context).inflate(R.layout.inflate_tv, null);
        manager.addView(view, params);
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

<br>　　程序运行`3`秒后，`Activity`就会被关闭，同时被添加到屏幕的中的`控件并不会消失`。但是此时你可能会发现一个新问题，即整个手机都滑不动了，就像是`Touch事件`被拦截了一样。
　　这是因为我们添加到屏幕中的控件的`type`属性的为`TYPE_PHONE`，它就是告诉系统这个控件需要接收`Touch`事件，不要把事件传给其它控件了。我们有两个解决方法：

　　第一，设置`flags`属性，明确告诉系统当前控件不需要接收`Touch事件`：
``` android
params.flags =
    // 控件将不会接收触摸事件。
    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
    // 控件将不会获取焦点。   
    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
```

　　第二，修改`type`属性的值为`TYPE_SYSTEM_OVERLAY`：
``` android
// TYPE_SYSTEM_OVERLAY级别的悬浮窗默认就无法被点击，因为不会拦截事件。关于这三个常量的优先级，稍后会详细介绍。
params.type = WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY;
```

<br>　　我们来总结一下`context`对象与`type`属性的配对关系：

	-  若context是一个Activity对象，则：
	   -  若我们也没有为type属性赋值，那么View将被放到Activity中。当Activity被切到后台或销毁时，View将会随着Activity一起消失。
	   -  若我们为type属性赋值为TYPE_PHONE(或更高)，那么View仍然会被放到Activity中。当Activity被切到后台或销毁时，View也会随着Activity一起消失。但是如果Activity被销毁了，程序还会抛出异常，因为我们使用Activity对象加载的布局文件和获取的WindowManager对象，因此可能导致Activity对象泄漏。
	-  若context是一个Application对象，则：
	   -  若我们也没有为type属性赋值，那么程序运行的时候将会抛出异常(请自行测试分析)。
	   -  若我们为type属性赋值了TYPE_PHONE(或更高)，那么当Activity消失或销毁时，View仍会显示在屏幕上。
　　简单的说，如果想做出`悬浮窗`的效果，那么就需要使用`application`对象和`type`属性，且值要是`TYPE_PHONE`(或更高)。
　　所谓`悬浮窗`就是在设备屏幕上添加一个`View`，即便随后我们的应用程序被切换到后台了，这个`View`依然能悬浮在屏幕上。
<br>
### 优先级 ###
　　事实上`WindowManager`中可以放置很多个`View`（控件），控件之间有优先级之分，`优先级高的控件将被放到优先级低的控件上面`。若最高优先级控件的宽高是`“MATCH_PARENT”`，则其下面的控件都将被完全遮住，`若优先级相同则后加入的会被放到上面显示`。
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
        new Handler().postDelayed(new Runnable() {
            public void run() {
                finish();
            }
        }, 3000);
    }

    static int offsetY;

    private void addTextViewToScreen(Context context, int type, String text){
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.type = type;
        // 设置View在y轴上的坐标值，相应的也可以设置x值。
        params.y = offsetY;
        offsetY += 60;
        TextView textView = (TextView) LayoutInflater.from(context).inflate(R.layout.inflate_tv, null);
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

<br>　　值得注意的是，对于小米等手机而言，可能不允许添加`TYPE_SYSTEM_OVERLAY`类型的控件(笔者没去测试)，不过`TYPE_PHONE`足够我们使用了。

<br>　　还有几个知识点：
``` java
// 设置控件的背景色为纯透明。
params.format = PixelFormat.TRANSLUCENT;
// 设置控件显示到屏幕的左上角。这里说的左上角也就是状态栏的下面。
params.gravity = Gravity.LEFT | Gravity.TOP;
// 设置控件在x和y轴的偏移量。 即控件最终的位置将由gravity和x、y共同决定。
params.x = 10;
params.y = 10;
// 设置一些附加信息，多个flag之间使用“|”间隔。
params.flags = 
    // 控件将不会接收触摸事件。
    LayoutParams.FLAG_NOT_TOUCH_MODAL |
    // 控件将不会获取焦点。   
    LayoutParams.FLAG_NOT_FOCUSABLE;
```
<br>
### 删除和更新 ###

<br>　　范例1：从屏幕中移除一个已经存在的控件。
``` android
windowManager.removeView(destView);
```

<br>　　范例2：更新屏幕中一个已经存在的控件。
``` android
// 让y轴坐标偏移100个像素
mParams.y += 100;
// 依据最近的mParams中的信息（x、y、width、height等）来重新设置view的显示效果。
mWindowManager.updateViewLayout(view, mParams);
```
    语句解释：
    -  这里所说的更新控件，其实就是再更新控件的LayoutParams对象。
<br>
### 百度安全卫士 ###
　　如果你基础不错的话，通过上面学的知识，就可以模仿`360的小火箭特效`了（具体请参考郭霖大神的博客），笔者仿写了一个百度安全卫士内存清理动画的`Demo`，程序运行效果如下：

<center>
![](http://img.blog.csdn.net/20150602150418233?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2l0aHViXzI4NTU0MTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
</center>

　　从上图中可以看出，仿写的效果和正牌还是有一些差距的，但是通过这个`Demo`可以让大家更深刻的理解`WindowManager`类可以做哪些事情。

　　[点击下载源码](http://download.csdn.net/detail/github_28554183/8764099)

　　如果你没有`AndroidStudio`环境，那么可以去`AndroidTest\app\build\outputs\apk`目录找到`apk`直接安装运行。

## SlidingMenu ##
<br>　　即将更新，请先移步[《Android双向滑动菜单完全解析，教你如何一分钟实现双向滑动特效》](http://blog.csdn.net/guolin_blog/article/details/9671609)。
<br><br><br>
# 第二节 开源项目 #
　　相信您也看多过`Github`上的各类`Android`开源项目，里面有各种绚丽的特效，笔者也看的眼馋，虽然咱们的原则是`“可以不会写，但必须得会改”`，但是每每看到里面的特效，笔者都想知道它们是如何实现的，并希望自己能学会。因此从本节开始，笔者将以各个开源项目为例，来讲自定义控件相关的知识。 当然我们不会去完整的分析每个项目，只是会去看它们关键代码。

## Android-PullLayout ##
　　这个项目提供了两个功能：`仿UC天气下拉`和`微信下拉眼睛`，`Github`地址：https://github.com/BlueMor/Android-PullLayout 。

<br>　　其中的`微信下拉眼睛`功能，咱们通过上一章学到的`Xfermode`就可以实现。笔者运行了这个项目，在它的`微信下拉眼睛`功能上发现两个缺点：

	-  第一，功能依赖于API Lavel 11中的新API，即程序运行在Android2.2系统中，会有黑框出现。
	-  第二，项目中的EyeView继承自FrameLayout类，不知道作者出于什么考虑，其实完全可以继承ImageView或者View类。

<br>　　因此，笔者优化后的`EyeView`代码为：
``` android
public class EyeView extends View {

    private int mRadius;
    private int maxRadius;
    private Bitmap mEyeBitmap;

    public EyeView(Context context) {
        super(context);
        mEyeBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.eye);
        maxRadius = Math.max(mEyeBitmap.getWidth(), mEyeBitmap.getHeight())/2+1;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap mDstB = Bitmap.createBitmap(mEyeBitmap.getWidth(), mEyeBitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas tmpCanvas = new Canvas(mDstB);
        tmpCanvas.drawCircle(mEyeBitmap.getWidth() / 2, mEyeBitmap.getHeight() / 2, mRadius, paint);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        tmpCanvas.drawBitmap(mEyeBitmap, 0, 0, paint);
        paint.setXfermode(null);
        canvas.drawBitmap(mDstB, 200, 200, paint);
    }

    public void setRadius(int radius){
        if (radius >= 0) {
            // 更新半径，然后执行重绘。
            mRadius = radius;
            if(radius > maxRadius){
                mRadius = maxRadius;
            }
            invalidate();
        }
    }
}
```
    语句解释：
    -  本范例中所涉及的知识我们都已经讲过了，不再冗述。并且本范例可以完美运行在Android2.2版本的系统中。

<br>　　另外，它的`仿UC天气下拉`功能是通过属性动画实现的，并使用了`NineOldAndroids`动画库，关于属性动画请参看笔者写的另一篇文章《媒体篇　第三章 动画》，在此就不再冗述了。

<br>　　在这个项目中还涉及到一个小知识点，我们知道在`Activity`的`onCreate()`方法中调用`View`类的`getWidth()`和`getHeight()`方法无法获得`View`的高度和宽度，这是因为`View`组件布局要在`Activity`的`onResume()`回调后完成。我们可以通过下面的代码解决这个问题：
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final TextView textView = (TextView) findViewById(R.id.text);
        // 通过textView来获取一个ViewTreeObserver对象，然后将一个回调接口添加到其中。
        textView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            public void onGlobalLayout() {
                System.out.println(textView.getWidth());
                System.out.println(textView.getHeight());
                System.out.println(textView.getLineCount());
                // 但是需要注意的是OnGlobalLayoutListener可能会被多次触发，因此在得到了高度之后，要将OnGlobalLayoutListener注销掉。
                textView.getViewTreeObserver().removeGlobalOnLayoutListener(this);
            }
        });

    }
}
```
    语句解释：
    -  ViewTreeObserver有多个内部类：
       -  OnGlobalLayoutListener：当视图树中全局布局发生改变或者视图树中的某个视图的可视状态发生改变时，所要调用的回调函数的接口类。
       -  OnPreDrawListener：当视图树将要绘制时，所要调用的回调函数的接口类。
       -  OnScrollChangedListener：当视图树中的一些组件发生滚动时，所要调用的回调函数的接口类。
       -  OnTouchModeChangeListener：当视图树的触摸模式发生改变时，所要调用的回调函数的接口类。

<br>**本节参考阅读：**
- [OnGlobalLayoutListener获得一个视图的高度](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/0731/1640.html)


<br><br>