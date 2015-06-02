title: UI篇　第九章 高级控件
date: 2015-2-5 19:59:50
create: 2015-5-28 16:07:35
categories: Android
---
　　本章将介绍Android开发中常用的高级控件，包括`Android5.0`中提出的`CardView`、`RecyclerView`。

# 第一节 WindowManager #
　　我们可以使用`WindowManager`类来向屏幕上添加`View`对象，比较流行的`悬浮窗`功能也是通过此类来实现的。我们先从最简单的范例开始，一步步的介绍`WindowManager`类的用法。

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
	-  第二，没有为WindowManager.LayoutParams对象的type属性设置值，常用取值为：
	   -  TYPE_PHONE ：手机级别，即表示在所有应用程序之上，但在状态栏之下。
	   -  TYPE_SYSTEM_ALERT ：系统窗口级别。比如：显示电量低时弹出的Alert对话框。
	   -  TYPE_SYSTEM_OVERLAY ：系统窗口之上的级别，此级别的控件无法响应点击事件。

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
       -  将params.type属性赋值为TYPE_PHONE（其它取值的含义稍后会介绍）。
    -  创建浮动窗需要添加下面这个权限：
       -  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<br>　　我们来总结一下`context`对象与`type`属性的配对关系：

	-  若context是一个Activity对象，则：
	   -  若我们也没有为type属性赋值，那么View将被放到Activity中。当Activity被切到后台或销毁时，View将会随着Activity一起消失。
	   -  若我们为type属性赋值为TYPE_PHONE(或更高)，那么View仍然会被放到Activity中。当Activity被切到后台或销毁时，View也会随着Activity一起消失。但是如果Activity被销毁了，程序还会抛出异常，因为我们使用Activity对象加载的布局文件和获取的WindowManager对象，因此可能导致Activity对象泄漏。
	-  若context是一个Application对象，则：
	   -  若我们也没有为type属性赋值，那么程序运行的时候将会抛出异常(请自行测试分析)。
	   -  若我们为type属性赋值了TYPE_PHONE(或更高)，那么当Activity消失或销毁时，View仍会显示在屏幕上。
　　简单的说，如果想做出`悬浮窗`的效果，那么就需要使用`application`对象和`type`属性，且值要是`TYPE_PHONE`(或更高)。
　　所谓`悬浮窗`就是在设备屏幕上添加一个`View`，即便随后我们的应用程序被切换到后台了，这个`View`依然能悬浮在屏幕上。

## 优先级 ##
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

## 删除和更新 ##

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

## 百度安全卫士 ##
　　接下来，笔者仿写了一个百度安全卫士内存清理动画的`Demo`，程序运行效果如下：

<center>
![](http://img.blog.csdn.net/20150602150418233?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2l0aHViXzI4NTU0MTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
</center>

　　从上图中可以看出，仿写的效果和正牌还是有一些差距的，但是通过这个`Demo`可以让大家更深刻的理解`WindowManager`类可以做哪些事情。

　　[点击下载源码](http://download.csdn.net/detail/github_28554183/8764099)

　　如果你没有`AndroidStudio`环境，那么可以去`AndroidTest\app\build\outputs\apk`目录找到`apk`直接安装运行效果。


<br>**本节参考阅读：**
- [Android桌面悬浮窗效果实现，仿360手机卫士悬浮窗效果](http://blog.csdn.net/guolin_blog/article/details/8689140)
- [Android桌面悬浮窗进阶，QQ手机管家小火箭效果实现](http://blog.csdn.net/guolin_blog/article/details/16919859)


<br><br>