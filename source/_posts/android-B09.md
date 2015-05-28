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


<br>　　但是，如果我们此时点击`Home`键，那么`contentView`就会随着`Activity`一起被切到后台。
　　这是正常的，因为`WindowManager`中可以放置很多个`View`（控件），控件之间有等级之分，`等级高的控件将被放到等级低的控件上面`。若最高等级控件的宽高是`“MATCH_PARENT”`，则其下面的控件都将被完全遮住，`若等级相同则后加入的会被放到上面显示`。我们刚才添加往`WindowManager`中添加`View`时并没有指定任何等级，所以系统使用了默认值。 

　　通过`WindowManager.LayoutParams`的`type`属性来设置控件等级，常用取值为：

	-  TYPE_TOAST ：吐司级别。
	-  TYPE_SYSTEM_ALERT ：系统窗口级别。比如：显示电量低时弹出的Alert对话框。
	-  TYPE_SYSTEM_OVERLAY ：系统窗口之上的级别，此级别的控件无法响应点击事件。




下面列出常见的type：

因为被添加当屏幕上的View也是有优先级的，我们可以使用WindowManager.LayoutParams的`type`的属性来改变这种行为：

有很多作用，但是我们通常用它来实现。所谓`悬浮窗`就是在设备屏幕上添加一个`View`，即便随后我们的应用程序被切换到后台了，这个`View`依然能悬浮在屏幕上。

<br>**本节参考阅读：**
- [OnGlobalLayoutListener获得一个视图的高度](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2014/0731/1640.html)


<br><br>