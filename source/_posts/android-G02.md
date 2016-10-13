title: 自定义控件篇　第二章 输入事件
date: 2015-1-27 14:53:50
categories: Android开发 - 青铜
---
　　本章将介绍一下`Android`中的各类输入事件。
　　本章主要参考书籍：[《Android开发艺术探索》](http://item.jd.com/1710650057.html)和[《Android群英传》](http://item.jd.com/11758334.html)，同时加上了笔者自己的体会。

# 第一节 基础知识 #
　　我们先来介绍两个基础知识。

<br>**事件类型**
　　在`Android`中`View`类支持监听如下`五种`输入事件，我们可以通过设置监听器来监听事件：

	-  点击事件：当用户点击一个View（如Button）时，系统会产生点击事件，并传递给该View。
	   -  调用View的setOnClickListener方法来监听此事件。
	-  长按事件：当用户长时间按住一个View时，系统会产生长按事件，并传递给该View。
	   -  调用View的setOnLongClickListener方法来监听此事件。
	-  焦点改变事件：当用户使用导航键或滚迹球将输入焦点导入或导出某个View时，系统会产生焦点改变，并传递给该View。
	   -  调用View的setOnFocusChangeListener方法来监听此事件。
	-  按键事件：当用户让输入焦点落到某个View上，并且按下或释放设备上的一个按键时，系统会产生按键事件，并传递给该View。
	   -  调用View的setOnKeyListener方法来监听此事件。
	-  触摸事件：当用户手指触摸某个View时，系统会产生触摸事件，并传递给该View。
	   -  调用View的setOnTouchListener方法来监听此事件。

<br>　　比如，下面代码展示了如何给一个`Button`注册一个`View.OnClickListener`监听器：
``` java
Button button = (Button) findViewById(R.id.button_send);
button.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        // Do something in response to button click
    }
});
```
　　你可能也发现把`OnClickListener`作为Activity的一部分来实现会更方便。这样会避免类的加载和对象空间的分配。如：
``` java
public class ExampleActivity extends Activity implements OnClickListener {
    protected void onCreate(Bundle savedValues) {
        Button button = (Button)findViewById(R.id.corky);
        button.setOnClickListener(this);
    }
    public void onClick(View v) { }
}
```
<br>　　如果我们想监听系统内置控件的事件，那么只能使用上面这种调用`setXxx`设置监听器。但是，若控件是我们自己创建的，那就可以通过重写下面的方法来监听事件：
``` java
// 当一个键被按下时，会调用这个方法；
onKeyDown(int, KeyEvent)

// 当一个被按下的键弹起时，会调用这个方法；
onKeyUp(int, KeyEvent)

// 当轨迹球滚动时，会调用这个方法；
onTrackballEvent(MotionEvent)

// 当一个View对象获得或失去焦点时，会调用这个方法。
onFoucusChanged(Boolean, int, Rect)

// 触摸事件
onTouchEvent(MotionEvent event) 
```

<br>　　上面列出的五种事件中，相对来说`触摸事件稍显复杂`，本章会重点介绍触摸事件。


<br>**触摸模式**
　　对于一个有触摸能力的设备，一旦用户触摸屏幕，这个设备就会进入`触摸模式(touch mode)`。
　　任何时刻，只要用户点击了一个`方向键`（比如Android电视的遥控器）或滚动了`鼠标滚轮`，设备就会退出触摸模式，同时系统会查找一个需要焦点的View对象，并给予其焦点（高亮显示）。
　　触摸模式状态是被整个系统管理的，我们可以调用`View#isInTouchMode()`来查看设备当前是否是触摸模式。

# 第二节 触摸事件 #
　　触摸事件在开发中是最常见的，也是最容易让人搞混的，因此从本节开始将详细介绍触摸事件。
## 滑动位置 ##
　　在开发中，比较常见的一个需求：让View能随着用户的手指而拖动，要实现这个功能就需要监听View的触摸事件。

　　示例代码：
``` java
Button button = (Button) this.findViewById(R.id.img);
button.setOnTouchListener(new View.OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        return false;
    }
});
```
<br>　　为了了解`onTouch`方法，我们先来看看`View.OnTouchListener`接口：
``` java
//  描述：当View被用户“触摸”时，会调用此回调方法。
//  参数：
//       v：     被触摸的组件。
//       event： 表示一个触摸事件，其内封装了与“触摸事件”有关的数据。如：用户手指在屏幕的X、Y坐标等。
//  返回值：用于告知Android系统，当前事件是否被成功处理。
public abstract boolean onTouch(View v, MotionEvent event)
```
　　其中`MotionEvent`类用来表示`“触摸事件”`，触摸事件有如下三个常见的状态：

	-  ACTION_DOWN：表示手指按在了View上。
	-  ACTION_MOVE：表示手指按下后(此时手指没有抬起)，接着在View上拖动手指。
	-  ACTION_UP：表示手指从View上抬起。

　　正常情况下，一次手指触摸屏幕的行为会触发一系列的触摸事件，最常见的是如下两种情况：

	-  点击屏幕后立刻松开，事件序列为：ACTION_DOWN -> ACTION_UP。
	-  点击屏幕后滑动一会再松开，事件序列为：ACTION_DOWN -> ACTION_MOVE -> …… -> ACTION_MOVE -> ACTION_UP。

　　在继续向下进行之前，先介绍一个名词`“事件序列”`。
<br>**事件序列**
　　同一个事件序列是指从手指接触屏幕的那一刻起，到手指离开屏幕的那一刻结束，在这个过程中所产生的一系列事件。
　　通常这个事件序列以`ACTION_DOWN`事件开始，中间含有数量不定的`ACTION_MOVE`事件，最终以`ACTION_UP`事件结束。

<br>　　范例1：MotionEvent类的常用方法：
``` java
//  描述：获取当前产生的事件的类型，常见的取值有：ACTION_DOWN、ACTION_MOVE、ACTION_UP。
public final int getAction();

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于该View的左上角坐标的偏移量。 
public final float getX();
public final float getY();

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于屏幕左上角坐标的偏移量。
//  屏幕左上角就是状态栏的左上角的那个点。 
public final float getRawX();
public final float getRawY();
```

<br>　　最后，下面给出一个完整的范例，如果你感觉看不懂，那就请去阅读其它人的教程，学会了触摸事件后，再回来继续。

<br>　　范例2：通过`getX()`和`getY()`移动按钮。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final Button button = (Button) findViewById(R.id.btn);
        button.setOnTouchListener(new View.OnTouchListener() {
            private int lastX, lastY;

            public boolean onTouch(View v, MotionEvent event) {
                int x = (int) event.getX();  // 获取手指在Button上的位置。
                int y = (int) event.getY();
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        lastX = x;           // 保存手指按下时的位置。
                        lastY = y;
                        break;
                    case MotionEvent.ACTION_MOVE:
                        int offsetX = x - lastX;
                        int offsetY = y - lastY;
                        // 调用layout方法更新View的位置。
                        button.layout(button.getLeft() + offsetX, button.getTop() + offsetY,
                                button.getRight() + offsetX, button.getBottom() + offsetY);
                        break;
                }
                return false;
            }
        });
    }
}
```
    语句解释：
    -  通过本范例看出，我们可以手工调用View的layout方法来更新位置，在其内部会调用invalidate进行重绘。
    -  需要注意的是本范例中，只有当手指按下的时候才会保存位置，手指移动时并不会。

<br>　　范例3：通过`getRawX()`和`getRawY()`移动按钮。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final Button button = (Button) findViewById(R.id.btn);
        button.setOnTouchListener(new View.OnTouchListener() {
            private int lastX, lastY;

            public boolean onTouch(View v, MotionEvent event) {
                int x = (int) event.getRawX();  // 获取手指在屏幕上的位置。
                int y = (int) event.getRawY();
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        lastX = x;
                        lastY = y;
                        break;
                    case MotionEvent.ACTION_MOVE:
                        int offsetX = x - lastX;
                        int offsetY = y - lastY;
                        button.layout(button.getLeft() + offsetX, button.getTop() + offsetY,
                                button.getRight() + offsetX, button.getBottom() + offsetY);
                        // 此处需要保存x、y的值。
                        lastX = x;
                        lastY = y;
                        break;
                }
                return false;
            }
        });
    }
}
```
    语句解释：
    -  再次强调本范例与范例2的区别，本范例中在手指移动的时候需要保存位置，具体原因请自己思考。
    -  提示：                要啥提示？动动脑子吧。

<br>　　也可以通过修改View的`LayoutParams`来改变View的位置，只需要把`范例3`的第`22`行代码替换为：
``` java
LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) button.getLayoutParams();
params.leftMargin += offsetX;
params.topMargin += offsetY;
button.setLayoutParams(params);
```
<br>
## 滑动内容 ##
　　在Android中，对于一个View来说它有两种类型滑动：

	-  第一种，View本身的位置发生变化（即上面一节介绍的知识）。
	-  第二种，View的内容发生变化。
	   -  比如当LinearLayout的子元素的尺寸超过了LinearLayout的尺寸，那么超出的部分默认是无法显示的。
	   -  不过Android中所有的View的内容都是可以滑动的，也就是说可以通过滑动LinearLayout的内容，来让被隐藏的部分显示出来。

　　本节就是来介绍如何滑动View的内容。

<br>**使用scrollTo和scrollBy方法**
　　为了实现`View`内容的滑动，`View`类提供了专门的方法来实现这个功能，那就是`scrollTo`和`scrollBy`，它们的源码为：
``` java
   /**
     * Set the scrolled position of your view. This will cause a call to
     * {@link #onScrollChanged(int, int, int, int)} and the view will be
     * invalidated.
     * @param x the x position to scroll to
     * @param y the y position to scroll to
     */
    public void scrollTo(int x, int y) {
        if (mScrollX != x || mScrollY != y) {
            int oldX = mScrollX;
            int oldY = mScrollY;
            mScrollX = x;
            mScrollY = y;
            invalidateParentCaches();
            onScrollChanged(mScrollX, mScrollY, oldX, oldY);
            if (!awakenScrollBars()) {
                postInvalidateOnAnimation();
            }
        }
    }

    /**
     * Move the scrolled position of your view. This will cause a call to
     * {@link #onScrollChanged(int, int, int, int)} and the view will be
     * invalidated.
     * @param x the amount of pixels to scroll by horizontally
     * @param y the amount of pixels to scroll by vertically
     */
    public void scrollBy(int x, int y) {
        scrollTo(mScrollX + x, mScrollY + y);
    }
```　
　　可以看出来，其中`scrollBy`转调用了`scrollTo`方法，它实现了基于当前位置的相对滑动，而`scrollTo`则实现了基于所传递参数的绝对滑动。

<br>　　使用范例，如下所示：
``` java
public class MyView extends View {

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 每次点击时，都使当前View的内容，在x轴方向滑动30像素。
        setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                scrollBy(30, 0);
            }
        });
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        StringBuilder sub = new StringBuilder();
        sub.append("11111111111111111111111111111111");
        sub.append("22222222222222222222222222222222");
        sub.append("33333333333333333333333333333333");
        sub.append("44444444444444444444444444444444");
        sub.append("55555555555555555555555555555555");
        canvas.drawText(sub.toString(), 0, 100, paint);
    }
}
```
    语句解释：
    -  有两点需要注意：
       -  第一，scrollBy和scrollTo滑动的是View的内容，而不是View本身的位置。
       -  第二，scrollBy和scrollTo滑动是瞬间完成的，没有滚动时的滑翔效果。
    -  调用View类的getScrollX()和getScrollY()方法可以获取View的滚动条的当前位置。

<br>**Scroller**
　　使用`scrollBy`和`scrollTo`的滑动是瞬间完成的，效果比较生硬，为了给用户流畅的体验，可以把一次大的滑动分成若干个小的滑动，并在若干时间内完成。
　　我们通过`Scroller`类就可以实现动画滑动的任务。

<br>　　修改后的范例，如下所示：
``` java
public class MyView extends View {

    public MyView(Context context) {
        super(context);
        setBackgroundColor(Color.BLACK);
        setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                // 第一步，先为Scroller对象设置滚动参数。
                //        参数依次为：滚动条当前X轴位置、Y轴位置、X轴位移长度、Y轴位移长度、多少毫秒内完成滚动。
                mScroller.startScroll(getScrollX(), getScrollY(), 30, 0, 1000);
                // 第二步，设置完参数后，调用invalidate方法，触发View的重绘。
                invalidate();
            }
        });
    }

    private Scroller mScroller = new Scroller(getContext());

    // 当View被重绘时，系统会回调View类的此方法，计算滚动条的当前位置。
    @Override
    public void computeScroll() {
        // 方法computeScrollOffset会依据时间的流逝，来计算Scroller当前所处的位置。
        if (mScroller.computeScrollOffset()) {
            // 让当前View的滚动条，滚动到Scroller对象当前的位置。
            scrollTo(mScroller.getCurrX(), mScroller.getCurrY());
            // 再次出发重绘，直到Scroller对象滚动到终点（即computeScrollOffset返回false）才停止。
            // 这样一来，就实现了动画滚动的效果了。
            postInvalidate();
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        StringBuilder sub = new StringBuilder();
        sub.append("11111111111111111111111111111111");
        sub.append("22222222222222222222222222222222");
        sub.append("33333333333333333333333333333333");
        sub.append("44444444444444444444444444444444");
        sub.append("55555555555555555555555555555555");
        canvas.drawText(sub.toString(), 0, 100, paint);
    }
}
```
    语句解释：
    -  Scroller的startScroll方法里面什么都没有做，只是记录了一下传递过来的参数。
    -  Scroller对象只是用来协助计算滚动条的位置的，它本身无法使View的内容滚动，它需要和View类的computeScroll、scrollTo、scrollBy方法配合使用。

<br>　　另外，`Android3.0`中提出的属性动画也可以完成`Scroller`的功能，具体请参阅[《媒体篇　第三章 动画》](http://cutler.github.io/android-D03/)。

## 高级用法 ##
<br>**TouchSlop**
　　`TouchSlop`是系统所能识别出的被认为是滑动的最小距离。换句话说，当手指在屏幕上滑动时，如果两次滑动之间的距离小于这个值，那么系统就不认为它是滑动。

　　通过下面的代码可以获取这个值，返回值的单位是`px`：
``` java
ViewConfiguration.get(getApplicationContext()).getScaledTouchSlop()
```
　　我们在处理滑动时，可以利用它来做一些过滤，即滑动距离小于这个值时就不认为是滑动，这样可以有更好的用户体验。

<br>**VelocityTracker**
　　速度追踪器（`VelocityTracker`）用于追踪手指在屏幕上的滑动速度，它的使用方法很简单：
　
``` java
// ******* 第一步，获取一个VelocityTracker对象：
VelocityTracker mTracker = VelocityTracker.obtain();

// ******* 第二步，在onTouchEvent方法中添加如下代码，记录每一个触摸事件：
mTracker.addMovement(event);

// ******* 第三步，在ACTION_UP事件发生时，使用如下执行计算操作。
// 以当前mTracker对象中收集的所有MotionEvent对象为基础，计算出手指1秒所能滑动的像素数量，并将它们保存起来。
mTracker.computeCurrentVelocity(1000); 

// ******* 第四步，获取上面计算出的速度：
mTracker.getXVelocity();  // 水平方向。
mTracker.getYVelocity();  // 垂直方向。

// ******* 第五步，释放资源：
mTracker.recycle();
mTracker = null;
```
<br>　　完整的范例，如下所示：
``` java
public class MyView extends View {

    private VelocityTracker mTracker;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (mTracker == null) {
            mTracker = VelocityTracker.obtain();
        }
        mTracker.addMovement(event);
        switch (event.getAction()) {
            case MotionEvent.ACTION_UP:
                mTracker.computeCurrentVelocity(1000);
                String message = "不算滑动";
                if (Math.abs(mTracker.getXVelocity()) >= 50) {
                    message = (mTracker.getXVelocity() > 0 ? "从左到右滑动" : "从右到左滑动");
                }
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                mTracker.recycle();
                mTracker = null;
                break;
        }
        return true;
    }
}

```
    语句解释：
    -  本范例只是演示VelocityTracker的使用方法，更实用的案例后面会介绍。

<br>**GestureDetector**
　　通过重写`onTouchEvent`方法来实现一些复杂的手势（比如双击、长按等）会很麻烦。
　　幸运的是，`Android SDK`给我们提供了一个手势识别的类——`GestureDetector`，通过这个类我们可以识别很多的手势。

　　它的使用方法也很简单，直接看代码吧：
``` java
public class MyView extends View {

    private GestureDetector mGestureDetector;

    private GestureDetector.OnGestureListener onGestureListener = 
                new GestureDetector.SimpleOnGestureListener() {
        public void onLongPress(MotionEvent e) {
            // 当手指长按时回调此方法。
        }
    };

    private GestureDetector.OnDoubleTapListener onDoubleTapListener = 
                new GestureDetector.SimpleOnGestureListener() {
        public boolean onSingleTapConfirmed(MotionEvent e) {
            // 当单击时回调此方法。
            // 与onSingleTapUp的区别在于，如果触发了onSingleTapConfirmed，那么后面不可能再紧跟着另一个单击行为。
            // 也就是说，这只可能是单击行为，而不可能是双击中的一次单击。
            return false;
        }
        public boolean onDoubleTap(MotionEvent e) {
            // 当双击时回调此方法。
            return false;
        }
    };

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 创建GestureDetector对象。
        mGestureDetector = new GestureDetector(getContext(), onGestureListener);
        // 设置双击事件监听器。
        mGestureDetector.setOnDoubleTapListener(onDoubleTapListener);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        // 将当前View的触摸事件托管给GestureDetector处理。
        mGestureDetector.onTouchEvent(event);
        return true;
    }
}
```
    语句解释：
    -  SimpleOnGestureListener和SimpleOnGestureListener类里还有其它方法，请自行查看。
    -  需要说明的是，若你需要监听双击事件的话就用GestureDetector吧，否则还是自己处理触摸事件比较好。

<br>**本节参考阅读：**
- [Android UI 学习 自定义的布局 平滑移动 VelocityTracker（）](http://www.cnblogs.com/dyllove98/archive/2013/06/20/3146813.html)



# 第三节 事件分发机制 #
　　本节将以触摸事件为范例，从源码的角度进行分析，详细说明事件的分发机制。

## Activity的事件分发 ##
　　上一章我们已经分析过了，当一个事件产生时，它的传递过程，现在我们在它基础上再次扩展一下，最终的顺序为：

	WMS -> ViewRootImpl -> DecorView -> Activity -> Window -> DecorView

　　即当事件传递给`Activity`后，`Activity`会转交给`Window`，`Window`再传递给`DecorView`。

<br>　　在Activity类中定义了如下几个方法，当对应的事件发生时，系统会调用它们：
``` java
// 当触摸事件发生时，系统回调此方法。
public boolean dispatchTouchEvent(MotionEvent ev);

// 当按键事件发生时，系统回调此方法。
public boolean dispatchKeyEvent(KeyEvent event);

// 当轨迹球事件发生时，系统回调此方法。
public boolean dispatchTrackballEvent(MotionEvent ev);
```

<br>　　既然是以触摸事件为范例，那么我们就从Activity的`dispatchTouchEvent`方法开始分析：
``` java
public boolean dispatchTouchEvent(MotionEvent ev) {
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        onUserInteraction();
    }
    if (getWindow().superDispatchTouchEvent(ev)) {
        return true;
    }
    return onTouchEvent(ev);
}
```
　　从代码中可以看到，事件会被交给Activity的`Window`对象的方法`superDispatchTouchEvent`方法进行分发处理：

	-  若该方法返回true则说明事件被某个控件处理了，那么Activity就认为这个事件已经结束了，直接返回即可。
	-  若该方法返回false则说明事件没人处理，那么Activity就是把事件交给它的onTouchEvent方法去处理。
　　提示：你可以通过重写`Activity`的`dispatchTouchEvent`方法且不调用`“super.dispatchTouchEvent()”`来拦截所有的触摸事件。

<br>　　上一章我们说了，`Window`类的唯一子类就是`PhoneWindow`类，因此我们接着看它的`superDispatchTouchEvent`方法：
``` java
public boolean superDispatchKeyEvent(KeyEvent event) {
    return mDecor.superDispatchKeyEvent(event);
}
```
　　发现它只是转调用了`DecorView`类的方法，继续深入：
``` java
public boolean superDispatchTouchEvent(MotionEvent event) {
    // 只是简单的调用了父类的实现。
    return super.dispatchTouchEvent(event);
}
```
　　由于`DecorView`继承自`FrameLayout`，此时事件就由Activity传到`View`手中了。

## ViewGroup的事件分发 ##
　　当事件传递到`DecorView`手中时，一切才刚刚开始而已，后面还有很多步骤要执行。
　　接着上面的分析，由于在`DecorView`和`FrameLayout`类中都没有`dispatchTouchEvent`方法的定义，所以我们只能继续去上级父类中找，最终在`ViewGroup`类中找到了该方法。
　　不过由于该方法太长，所以为了看的清晰，我们下面将会分段来分析。

<br>
### 拦截事件 ###
　　我们知道每个`MotionEvent`都有一个坐标点，当触摸事件传递到`ViewGroup`手中时，默认情况下`ViewGroup`会遍历它的所有子`View`，若该坐标点正好处于某个子`View`的范围内，则就将触摸事件转发给这个子`View`去处理。
　　不过，这个默认行为是可以改变，即`ViewGroup`可以将事件拦截下来留给自己处理，而不把事件传递给子`View`。

　　首先我们来看一下`dispatchTouchEvent`方法的这段：
``` java
// Check for interception.
final boolean intercepted;
if (actionMasked == MotionEvent.ACTION_DOWN
        || mFirstTouchTarget != null) {
    final boolean disallowIntercept = (mGroupFlags & FLAG_DISALLOW_INTERCEPT) != 0;
    if (!disallowIntercept) {
        intercepted = onInterceptTouchEvent(ev);
        ev.setAction(action); // restore action in case it was changed
    } else {
        intercepted = false;
    }
} else {
    // There are no touch targets and this action is not an initial down
    // so this view group continues to intercept touches.
    intercepted = true;
}
```

　　上面的代码就是ViewGroup用来判断是否需要拦截触摸事件的，可以看出`ViewGroup`在如下两种情况时会判断是否拦截当前事件：
``` java
actionMasked == MotionEvent.ACTION_DOWN || mFirstTouchTarget != null
```

　　前者很好理解，但`mFirstTouchTarget`是什么呢？
　　其实等我们看到后面的代码时就会知道，当`ACTION_DOWN`事件由ViewGroup的某个子元素成功处理时，`mFirstTouchTarget`就会被赋值并指向那个子元素。

　　当上述的两个条件满足其一时，并且第`5`行代码也返回`false`时，就会调用ViewGroup类的`onInterceptTouchEvent`方法：

	-  ViewGroup的子类可以重写onInterceptTouchEvent方法，用来决定当前ViewGroup是否拦截本次触摸事件：
	   -  若重写方法时返回true，则本次的触摸事件将由当前ViewGroup处理，不会再传递给子View了。
	   -  若重写方法时返回false，则表示本次的触摸事件当前ViewGroup将不拦截，事件的传递机制一切照旧。
	-  当需要处理滑动冲突时，就可以重写此方法，并依据实际情况返回不同的值，该方法默认返回false。

　　上面第`5`行代码用来获取当前ViewGroup是否开启了`“禁止拦截事件”`的功能，若开启了，则ViewGroup就无法拦截事件了，可以使用`requestDisallowInterceptTouchEvent`方法可以修改这个状态。

<br>　　总结一下这段代码的价值：

	-  onInterceptTouchEvent方法在ViewGroup中定义，用来决定ViewGroup是否拦截事件。
	-  onInterceptTouchEvent方法不是每次都调用，如果想提前处理事件，应重写dispatchTouchEvent方法。
	-  requestDisallowInterceptTouchEvent方法在ViewGroup中定义，能禁止ViewGroup拦截事件。

<br>
### 分发事件 ###
　　上面的代码用来确定ViewGroup是否需要拦截事件，接下来就分别看一下这两种情况。

　　当ViewGroup不拦截事件的时候，事件会向下分发交给它的子View进行处理，这段源代码如下所示：
``` java
final View[] children = mChildren;
for (int i = childrenCount - 1; i >= 0; i--) {
    final int childIndex = customOrder
            ? getChildDrawingOrder(childrenCount, i) : i;
    final View child = (preorderedList == null)
            ? children[childIndex] : preorderedList.get(childIndex);

    // If there is a view that has accessibility focus we want it
    // to get the event first and if not handled we will perform a
    // normal dispatch. We may do a double iteration but this is
    // safer given the timeframe.
    if (childWithAccessibilityFocus != null) {
        if (childWithAccessibilityFocus != child) {
            continue;
        }
        childWithAccessibilityFocus = null;
        i = childrenCount - 1;
    }

    if (!canViewReceivePointerEvents(child)
            || !isTransformedTouchPointInView(x, y, child, null)) {
        ev.setTargetAccessibilityFocus(false);
        continue;
    }

    newTouchTarget = getTouchTarget(child);
    if (newTouchTarget != null) {
        // Child is already receiving touch within its bounds.
        // Give it the new pointer in addition to the ones it is handling.
        newTouchTarget.pointerIdBits |= idBitsToAssign;
        break;
    }

    resetCancelNextUpFlag(child);
    if (dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)) {
        // Child wants to receive touch within its bounds.
        mLastTouchDownTime = ev.getDownTime();
        if (preorderedList != null) {
            // childIndex points into presorted list, find original index
            for (int j = 0; j < childrenCount; j++) {
                if (children[childIndex] == mChildren[j]) {
                    mLastTouchDownIndex = j;
                    break;
                }
            }
        } else {
            mLastTouchDownIndex = childIndex;
        }
        mLastTouchDownX = ev.getX();
        mLastTouchDownY = ev.getY();
        newTouchTarget = addTouchTarget(child, idBitsToAssign);
        alreadyDispatchedToNewTouchTarget = true;
        break;
    }

    // The accessibility focus didn't handle the event, so clear
    // the flag and do a normal dispatch to all children.
    ev.setTargetAccessibilityFocus(false);
}
```
　　上面这段代码逻辑也很清晰，首先遍历ViewGroup的所有子元素，然后判断子元素是否能够接收这个事件，判断的依据有两个：

	-  !canViewReceivePointerEvents(child)：子元素是否在执行动画。
	-  !isTransformedTouchPointInView(x, y, child, null)：事件的坐标是否落在了子元素的区域内。

　　如果某个元素满足这两个条件，那么就会接着调用`dispatchTransformedTouchEvent`方法将触摸事件传递该元素。

　　接着查看`dispatchTransformedTouchEvent`的源码，发现该方法中出现多次类似的`if`判断：
``` java
if (child == null) {
    // 此时ViewGroup会调用继承自View类的方法，来自己处理事件。
    handled = super.dispatchTouchEvent(event);
} else {
    // 由子View去处理事件。
    handled = child.dispatchTouchEvent(event);
}
```
　　可以看到不管`child`是否为`null`，这段代码最终都会调用`dispatchTouchEvent`方法来处理事件。

　　那么`child`是什么呢，它又何时为`null`呢？
　　`child`就是用来处理本次触摸事件的控件，当ViewGroup拦截了事件时，也会调用`dispatchTransformedTouchEvent`方法处理事件，只不过`child`的值会传递为`null`。源码如下：
``` java
handled = dispatchTransformedTouchEvent(ev, canceled, null, TouchTarget.ALL_POINTER_IDS);
```
　　到此我们就清楚了：

	-  若ViewGroup没有拦截事件，则会继续将事件分发给子View处理：
	   -  若某个子View能处理这个事件，则会调用该子View的dispatchTouchEvent方法进行处理。
	   -  若for循环结束后，没有任何一个子View能处理这个事件，则ViewGroup会自己进行处理。
	-  若ViewGroup拦截了事件，则它也会自己处理这个事件。
	-  当需要ViewGroup自己来处理事件时，ViewGroup会调用继承自View类的dispatchTouchEvent方法来处理。

<br>　　还有一点要知道，当子View的`dispatchTouchEvent`方法返回`true`时，意味着这个事件被处理了，上面的第`51`行代码就会被执行，然后跳出for循环：
``` java
newTouchTarget = addTouchTarget(child, idBitsToAssign);
```
　　其实`mFirstTouchTarget`真正的赋值过程是在`addTouchTarget`内完成的：
``` java
private TouchTarget addTouchTarget(View child, int pointerIdBits) {
    TouchTarget target = TouchTarget.obtain(child, pointerIdBits);
    target.next = mFirstTouchTarget;
    mFirstTouchTarget = target;
    return target;
}
```
　　相应的，`ACTION_DOWN`之后的事件都会直接传递给`mFirstTouchTarget`处理，因为`for`循环寻找能处理事件的子View的过程只在`ACTION_DOWN`时才会触发。

　　至此我们就得出了一个结论了，不论事件最终是由`ViewGroup`类处理，还是由某个子`View`处理，程序最终都会调用`View`类的`dispatchTouchEvent`方法，接下来我们就来看一下这个方法。
## View的事件分发 ##
　　View对点击事件的处理过程稍微简单一些，因为它没有子元素不需要向下传递事件，所以它需要处理自己的事件。

　　先看它的`dispatchTouchEvent`方法，如下所示：
``` java
public boolean dispatchTouchEvent(MotionEvent event) {
    // 此处省略若干代码...

    boolean result = false;

    // 此处省略若干代码...

    if (onFilterTouchEventForSecurity(event)) {
        //noinspection SimplifiableIfStatement
        ListenerInfo li = mListenerInfo;
        if (li != null && li.mOnTouchListener != null
                && (mViewFlags & ENABLED_MASK) == ENABLED
                && li.mOnTouchListener.onTouch(this, event)) {
            result = true;
        }

        if (!result && onTouchEvent(event)) {
            result = true;
        }
    }

    // 此处省略若干代码...

    return result;
}
```
　　上面代码很简单，分两种方式处理触摸事件：

	-  第一种，若当前View处于可用状态，且设置了OnTouchListener，则调用监听器的onTouch方法处理事件。
	-  第二种，若第一种方式未能成功处理事件，则调用自己的onTouchEvent方法来处理。
	   -  让OnTouchListener优先于onTouchEvent的好处是，方便在外界处理触摸事件。

<br>　　OnTouchListener的应用场景：

	我们使用ScrollView来包含一些控件，同时要求程序可以动态的控制ScrollView是否能滚动。即：
	-  在手机横屏的时候，允许它滑动。
	-  在手机竖屏的时候，不许它滑动。
　　示例代码：
``` java
// 此处设置的OnTouchListener会优先于ScrollView本身的onTouchEvent方法执行。
mScrollView.setOnTouchListener(new View.OnTouchListener(){
    public boolean onTouch(View v, MotionEvent event) {
        // 若当前是竖屏状态，则直接返回true，即不需要在执行ScrollView的onTouchEvent方法了。
        // ScrollView执行滑动的代码是写在onTouchEvent方法中的，该方法不被调用的话，也就没法滑动了。
        return isShuPing ? true : false;
    }
});
```

<br>　　接下来在看一下`onTouchEvent`方法的源码，由于代码比较长，我们同样分块来看，首先是这段：
``` java
if ((viewFlags & ENABLED_MASK) == DISABLED) {
    if (action == MotionEvent.ACTION_UP && (mPrivateFlags & PFLAG_PRESSED) != 0) {
        setPressed(false);
    }
    // A disabled view that is clickable still consumes the touch
    // events, it just doesn't respond to them.
    return (((viewFlags & CLICKABLE) == CLICKABLE
            || (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE)
            || (viewFlags & CONTEXT_CLICKABLE) == CONTEXT_CLICKABLE);
}
```
　　从上面的代码中可以看出，不可用状态下的View照样会消耗事件。

　　接着，如果View设置了代理，那么还会执行`TouchDelegate`的`onTouchEvent`方法，代理的工作机制和`OnTouchListener`，这里就不再细说了。
``` java
if (mTouchDelegate != null) {
    if (mTouchDelegate.onTouchEvent(event)) {
        return true;
    }
}
```

　　下面再看一下`onTouchEvent`中对点击事件的具体处理，如下所示：
``` java
if (((viewFlags & CLICKABLE) == CLICKABLE ||
                (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE) ||
                (viewFlags & CONTEXT_CLICKABLE) == CONTEXT_CLICKABLE) {
    switch (action) {
        case MotionEvent.ACTION_UP:

            // 此处省略若干代码...

            if (!focusTaken) {
                // Use a Runnable and post this rather than calling
                // performClick directly. This lets other visual state
                // of the view update before click actions start.
                if (mPerformClick == null) {
                    mPerformClick = new PerformClick();
                }
                if (!post(mPerformClick)) {
                    performClick();
                }
            }

            // 此处省略若干代码...
    }

    return true;
}
```
　　从上面的代码来看，只要View的CLICKABLE、LONG_CLICKABLE和CONTEXT_CLICKABLE有一个为true，那么它就会消耗这个事件，即onTouchEvent方法将返回true。

	-  View的LONG_CLICKABLE默认为false。
	-  View的CLICKABLE是否为false与具体的View类有关，比如Button是可以点击的，TextView是不可点击的。

　　同时，当ACTION_UP事件发生时，会触发performClick方法，如果View设置了OnClickListener，那么performClick方法内部会调用它的onClick方法，如下所示：
``` java
public boolean performClick() {
    final boolean result;
    final ListenerInfo li = mListenerInfo;
    if (li != null && li.mOnClickListener != null) {
        playSoundEffect(SoundEffectConstants.CLICK);
        li.mOnClickListener.onClick(this);
        result = true;
    } else {
        result = false;
    }

    sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_CLICKED);
    return result;
}
```

　　至此，触摸事件的分发过程的源码分析已经结束了，接下来将利用所学的知识，来处理滑动冲突的问题。

# 第四节 实战 #
　　本节开始综合前面所学的知识。

## 自定义ScrollView ##
　　现在有个需求，创建一个ViewGroup控件，可以通过滑动来在多个子View之间切换，效果和ViewPager类似。

　　代码：
``` java
public class MyScrollView extends LinearLayout {

    private Scroller mScroller = new Scroller(getContext());
    private VelocityTracker mTracker;
    private int mTouchSlop;
    private int mLastX;
    private int mChildIndex;

    public MyScrollView(Context context) {
        super(context);
        setOrientation(HORIZONTAL);
        mTouchSlop = ViewConfiguration.get(getContext()).getScaledTouchSlop();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (mTracker == null) {
            mTracker = VelocityTracker.obtain();
        }
        mTracker.addMovement(event);
        int currX = (int) event.getX();
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                // 如果当前正在播放动画，则停止它，这样能提供更好的用户体验。
                // 当然也可以把这三行代码注释掉，注释后的效果请自行体验。
                if (!mScroller.isFinished()) {
                    mScroller.abortAnimation();
                }
                break;
            case MotionEvent.ACTION_MOVE:
                // 在用户手指滑动的同时滚动内容，这样就模仿了ViewPager随着手指滚动的效果。
                scrollBy(mLastX - currX, 0);
                break;
            case MotionEvent.ACTION_UP:
                mTracker.computeCurrentVelocity(500);
                if (Math.abs(mTracker.getXVelocity()) >= mTouchSlop) {
                    if (getChildCount() == 0) {
                        mChildIndex = 0;
                    } else {
                        if (mTracker.getXVelocity() > 0) {
                            //从左到右滑动
                            mChildIndex = (mChildIndex - 1 < 0 ? 0 : mChildIndex - 1);
                        } else { //从右到左滑动
                            mChildIndex = (mChildIndex + 1 > getChildCount() - 1 ? getChildCount() - 1 : mChildIndex + 1);
                        }
                    }
                }
                mTracker.recycle();
                mTracker = null;
                // 当手指抬起的时候，开始播放滚动动画，从当前位置开始，到最近的一个子View结束。
                mScroller.startScroll(getScrollX(), 0, mChildIndex * getChildAt(0).getWidth() - getScrollX(), 0, 1000);
                postInvalidate();
                break;
        }
        mLastX = currX;
        return true;
    }

    @Override
    public void computeScroll() {
        if (mScroller.computeScrollOffset()) {
            scrollTo(mScroller.getCurrX(), mScroller.getCurrY());
            postInvalidate();
        }
    }
}
```

　　Activity的代码：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView scrollView = new MyScrollView(this);
        int[] colorls = new int[]{Color.BLUE, Color.CYAN, Color.YELLOW};
        for (int i = 0; i < colorls.length; i++) {
            TextView listView = new TextView(this);
            listView.setBackgroundColor(colorls[i]);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  创建了三个TextView对象，尺寸与屏幕的宽高一致，可以把这两个类复制到项目中，直接运行。

## View的滑动冲突 ##
　　本节介绍View体系中的一个深入话题：滑动冲突。只要在界面中存在内外两层同时可以滑动，这个时候就会产生滑动冲突。

　　常见的滑动冲突场景有如下三种：

	-  第一种，外部滑动方向和内部滑动方向不一致。
	-  第二种，外部滑动方向和内部滑动方向一致。
	-  第三种，上面两种情况的嵌套。

　　在介绍如何处理这三类冲突之前，要先知道如下几个知识点：

	-  ViewGroup重写onInterceptTouchEvent方法可以拦截事件：
	   -  若ViewGroup在ACTION_DOWN时返回true，则子View不会接到任何事件，事件将由ViewGroup的onTouchEvent处理。
	   -  若ViewGroup在ACTION_MOVE时返回true，则子View会接到ACTION_CANCEL事件，后续事件将交给ViewGroup处理。
	   -  若ViewGroup在ACTION_UP时返回true，则子View只会接到ACTION_CANCEL事件，不会接到ACTION_UP事件。
	   -  也就是说，只要事件被ViewGroup拦截，那么本事件序列结束之前，都不会在将事件传递给子View。
	   -  同时，即便子View处理了事件，只要它没有禁用ViewGroup的拦截事件功能，那么ViewGroup的onInterceptTouchEvent仍会被调用。
	-  子View可以通过调用它父View的requestDisallowInterceptTouchEvent方法来禁止其父View拦截事件。
	   -  子View无法阻止父View的onInterceptTouchEvent方法接收ACTION_DOWN事件。
	   -  子View通常会在接到ACTION_DOWN事件时，禁止其父View拦截事件。
	   -  子View通常会在ACTION_MOVE事件中，解除对其父View的禁止，随后父View就能接到ACTION_MOVE事件了。
	   -  子View在ACTION_UP事件中解除对其父View的禁止，则父View无法接到ACTION_UP事件。
	   -  子View对父View的禁止，只在一个事件序列内有效，即子View在ACTION_DOWN时禁止父View，即便不将父View解禁，当本次事件序列结束，父再次接到ACTION_DOWN事件时就会清除掉禁用状态。

<br>**滑动方向不一致**
　　接着刚才的范例，我们把TextView换成ListView，就可以重现这种场景，即外部是左右滑动，内部是上下滑动。
　　解决的思路是，当用户左右滑动时，让外部View处理事件，当上下滑动时，让内部View处理事件。
　　重点在于，我们如何判断用户当前是左右滑，还是上下滑。 有好几种方式：

	-  依据水平方向和垂直方向的距离差来判断
	-  依据水平方向和垂直方向的速度差来判断
	-  依据依据路径和水平方向所形成的夹角来判断

　　接下来以“距离差”为例子，做示范，我们只需要在MyScrollView中重写xxx方法即可，其它代码不需要修改：
``` java
private int mLastInterceptX;
private int mLastInterceptY;
@Override
public boolean onInterceptTouchEvent(MotionEvent ev) {
    boolean intercept = false;
    int currX = (int) ev.getX();
    int currY = (int) ev.getY();
    switch (ev.getAction()) {
        // 当手指按下的时候，MyScrollView不能拦截事件，否则子View将无法接到事件。
        
        case MotionEvent.ACTION_MOVE:
            // 当手指移动时，如果手指在x轴方向上移动的距离比y轴的距离长，则拦截事件。
            // 注意，一旦此处拦截了事件，那么在本次事件序列结束之前，子View都接不到事件。
            if (Math.abs(currX - mLastInterceptX) > Math.abs(currY - mLastInterceptY)) {
                intercept = true;
            }
            break;
    }
    mLastInterceptX = currX;
    mLastInterceptY = currY;
    return intercept;
}
```

　　然后是Activity的代码：
``` java
public class MainActivity extends ActionBarActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView scrollView = new MyScrollView(this);
        for (int i = 0; i < 3; i++) {
            ListView listView = new ListView(this);
            List<String> data = new ArrayList<String>();
            for (int j = 0; j < 20; j++) {
                data.add("List" + i + " - " + j);
            }
            ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_expandable_list_item_1, data);
            listView.setAdapter(adapter);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  程序运行后，发现已经解决了滑动冲突。

<br>**内部解决法**
　　上面是通过修改外部View的代码来解决滑动冲突的，接下来介绍一下如何通过修改内部View的代码来解决滑动冲突：

	-  首先，然父ViewGroup不拦截action_DWON事件，拦截另外两个事件。
	-  然后，由子View来决定事件处理。

<br>　　第一步，创建一个MyScrollView2类，所有代码与MyScrollView相同，但下面的代码不同：
``` java
@Override
public boolean onInterceptTouchEvent(MotionEvent ev) {
    // 按下事件不能拦截，否则子View将接不到事件。
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        return false;
    } else {
        // 除了按下事件之外的其它所有事件都会拦截。
        return true;
    }
}
```

<br>　　第二步，定义MyListView类：
``` java
public class MyListView extends ListView {
    public MyListView(Context context) {
        super(context);
    }

    private int mLastInterceptX;
    private int mLastInterceptY;

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        int currX = (int) ev.getX();
        int currY = (int) ev.getY();
        switch (ev.getAction()) {
            // 当子View接到按下事件时，设置不允许父View拦截事件。
            // 这意味着当前View一定能接到本次事件序列的后续事件。
            case MotionEvent.ACTION_DOWN:
                ((ViewGroup)getParent()).requestDisallowInterceptTouchEvent(true);
                break;
            case MotionEvent.ACTION_MOVE:
                // 如果当前View发现用户手指水平方向移动的距离比垂直方向移动的大，则允许父View拦截事件。
                // 又由于MyScrollView2的onInterceptTouchEvent方法会拦截任何“非按下”事件。
                // 这意味着当前View将不会接到后续事件。
                if (Math.abs(currX - mLastInterceptX) > Math.abs(currY - mLastInterceptY)) {
                    ((ViewGroup)getParent()).requestDisallowInterceptTouchEvent(false);
                }
                break;
        }
        mLastInterceptX = currX;
        mLastInterceptY = currY;

        return super.dispatchTouchEvent(ev);
    }
}
```
<br>　　第三步，Activity的代码为：
``` java

public class MainActivity extends ActionBarActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView2 scrollView = new MyScrollView2(this);
        for (int i = 0; i < 3; i++) {
            MyListView listView = new MyListView(this);
            List<String> data = new ArrayList<String>();
            for (int j = 0; j < 20; j++) {
                data.add("MyList" + i + " - " + j);
            }
            ArrayAdapter<String> adapter 
                = new ArrayAdapter<String>(this, android.R.layout.simple_expandable_list_item_1, data);
            listView.setAdapter(adapter);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  从实现上来看，内部拦截法要复杂一些，因此推荐采用外部拦截法来解决常见的滑动冲突。

<br>　　另外两种滑动冲突的处理方式也是类似，暂时就不举例了，以后有空的时候再补上。

<br><br>