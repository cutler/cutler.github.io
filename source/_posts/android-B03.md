title: UI篇　第三章 输入事件
date: 2015-1-27 14:53:50
create: 2015-1-27 14:53:50
categories: android
---
　　本章将介绍一下`Android`中的输入事件。

# 第一节 基础知识 #
　　当`Android`系统中当产生了一个输入事件（触摸、按键等）时，事件通常会被系统（通过回调方法）发送给与用户正在交互的View手中，这些回调方法被定义在View类里。
　　例如，当触摸一个`View`对象（如一个按钮）时，该对象的`onTouchEvent()`方法会被调用。

## 触摸模式 ##
　　当用户用`方向键`或`鼠标滚轮`（比如Android电视需要使用遥控器操作）浏览一个用户界面时，程序就需要给可操作的项目一个焦点（如按钮高亮显示），以便用户能够看到界面在接收输入。但是，如果设备有触摸的能力，并且用户通过触摸的方式来与界面进行交互，那么就不再需要高亮显示项目，或是把焦点给一个特殊的View对象。这样，就有了名叫`“触摸模式(touch mode)”`的交互模式。

　　对于一个有触摸能力的设备，一旦用户触摸屏幕，这个设备就会进入`触摸模式`。
　　任何时刻，只要用户点击了一个方向键或滚动了鼠标滚轮，设备就会退出触摸模式，同时系统会查找一个需要焦点的View对象，并给予其焦点。

　　触摸模式状态是被整个系统保持的（所有的窗口和Activity）。你能够调用`isInTouchMode()`来查看设备当前是否是触摸模式。

## 事件监听器 ##
　　一个事件监听器是View类中的一个接口，通常接口中只有一个回调方法，当对应的事件被触发时，Android框架会调用这些方法。

<br>**点击事件**
　　当用户在触摸模式中，点击一个项目(如Button)时，系统会产生一个`点击事件`，并会回调`View.OnClickListener`接口的`onClick()`方法（如果事先设置了监听器的话）。

<br>**长按事件**
　　当用户在触摸模式中，长时间按住或长时间触摸一个项目（如Button）时，系统会产生一个`长按事件`，并会回调`View.OnLongClickListener`接口的`onLongClick()`（如果事先设置了监听器的话）。

<br>**焦点改变事件**
　　当用户使用导航键或滚迹球将输入焦点导入或导出某个View时，系统会产生一个`焦点改变事件`，并会回调`View.OnFocusChangeListener`接口的`onFocusChange()`方法（如果事先设置了监听器的话）。

<br>**按键事件**
　　当用户让输入焦点落到某个项目上，并且按下或释放设备上的一个按键时，系统会产生一个`按键事件`，并会回调`View.OnKeyListen`接口的`onKey()`方法（如果事先设置了监听器的话）。

<br>**触摸事件**
　　当用户手指触摸某个项目时，系统会产生一个`触摸事件`，并会回调`View.OnTouchListener`接口中的`onTouch()`方法（如果事先设置了监听器的话）。
　　一个触摸事件由多个动作（Action）组成：`手指按下View`、`在View上拖动`(此时不抬起手指)、`手指抬起`等一系列动作，都可以称为`“触摸”`。 因此一个点击事件会在两个触摸动作（按下动作、抬起动作）产生后才会产生。

　　要定义这些方法并用它们来处理来事件，就要在Activity中实现这些嵌套的接口，或者把它作为一个匿名类来定义。然后，把你实现的实例传递给各自的`View.set…Listener()`方法。（例如，调用`setOnClickListener()`方法，并把`OnClickListener`接口的实现传递给它）。

<br>　　范例1：下例显示了如何给一个Button注册一个onClick监听器。
``` android
Button button = (Button) findViewById(R.id.button_send);
button.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        // Do something in response to button click
    }
});
```
　　你可能也发现把`OnClickListener`作为Activity的一部分来实现会更方便。这样会避免外部类的加载和对象空间的分配。如：
``` android
public class ExampleActivity extends Activity implements OnClickListener {
    protected void onCreate(Bundle savedValues) {
        Button button = (Button)findViewById(R.id.corky);
        button.setOnClickListener(this);
    }
    public void onClick(View v) { }
}
```

<br>　　我们注意到，上例代码中的`onClick()`回调方法没有返回值，但是其他的一些事件监听器方法必须要返回一个布尔值。其原因要依赖具体的事件。以下是原因说明：
　　Android产生的事件是由上到下依次传递到目标View的，事件可以在传递的途中被某个View给消化掉，从而终止事件向下传递。

	boolean onLongClick()：
	-  若返回true，表明你已经处理了这个事件，系统应该就此停止继续向下传递事件。
	-  若返回false，表明你没有处理这个事件，因而这个事件应该继续传递给任何其他的onLongClick监听器。

	boolean onKey()：
	-  若返回true，表明你已经处理了这个事件，并且事件应该就此停止。
	-  若返回false，表明你没有处理这个事件，并且这个事件应该继续传递给任何其他的onKey监听器。

	boolean onTouch()：
	-  若在接收到按下动作事件时返回了true，表明你处理了这个事件，并且还会接收后续的事件（如手指滑动等）。
	-  若在接收到按下动作事件时返回了false，表明你不使用这个事件，并且对来自这个事件的后续动作也不感兴趣（系统将不会把后续动作传递给onTouch方法）。

## 处理焦点 ##
　　Android框架会处理焦点的移动来响应用户的输入，这包括在View对象被删除或隐藏，或一个新View对象变成有效时焦点的改变。
　　View对象通过`isFocusable()`方法来表明它们是否有意愿获取焦点。调用`setFocusable()`可以设置View是否有意愿获取焦点。在触摸模式中，你可以用`isFocusableIntouchMode()`方法来查询一个View对象是否允许有焦点。你能够用`setFocusableInTouchMode()`方法来改变这种设置。

　　焦点的移动是基于在特定的方向中查找最近的可接受焦点的View对象的算法，很少的情况下，这种算法会与开发者的期望行为不匹配，在这种情况下，你能够用下列的布局文件中的XML属性来明确的覆盖默认的算法：`nextFocusDown`、`nextFocusLeft`、`nextFocusRight`和`nextFocusUp`。给离开焦点的View对象添加这些属性中的一个，在这个属性值中指定焦点要移到下一个View对象的id，如：
``` xml
<LinearLayout
    android:orientation="vertical">
    <Button android:id="@+id/top"
        android:nextFocusUp="@+id/bottom"/>
    <Button android:id="@+id/bottom"
        android:nextFocusDown="@+id/top"/>
</LinearLayout>
```

<br>　　通常，在这个垂直布局中，从第一个Button的向上浏览不会去任何地方，同样从第二个Button的向下浏览也不会去任何地方。现在，top按钮把bottom按钮定义为下一个焦点获得者（反之亦然），这样浏览焦点就会在这两个按钮之间来回切换。
　　调用`requestFocus()`方法给一个特定的View对象设置焦点。
　　使用`onFocusChange()`方法来监听焦点事件（当一个View对象接受或失去焦点时会发出通知）。


## 常用事件 ##

### 触摸事件 ###
　　使用View类提供的`setOnTouchListener()`方法可以为View设置一个触摸事件监听器，当View被`Touch`(按下、抬起、移动等)时，系统会回调`onTouch()`方法。

<br>　　范例1：View.OnTouchListener接口。
``` android
//  描述：当View被用户“触摸”时，会调用此回调方法。
//  参数：
//    v：被触摸的组件。
//    event：当组件被触摸时，系统产生的一个MotionEvent类型的“事件对象”。
//           事件对象封装了一些与“触摸事件”有关的数据。如：事件产生时，用户手指在屏幕的X、Y坐标等。
//  返回值：
//    用于告知Android系统，当前事件是否被成功处理。
//
//    如：通常“触摸事件”的基本顺序为：“手指按下”、 “手指拖拽”、 “手指抬起”。
//    若手指按下时方法返回false，则即便随后用户在View上拖动手指，系统也不会触发“手指拖拽”事件。
//    若手指按下时方法返回true，则系统会触发“手指拖拽”事件，且会终止事件向下传递。
public abstract boolean onTouch(View v, MotionEvent event)
```

<br>　　使用上面的API为组件设置的事件监听器后，接下来，就应该看看`MotionEvent`类中提供了哪些属性和方法，然后调用这些属性和方法来使程序能更好的处理产生的事件。

<br>　　范例2：MotionEvent类。
``` android
//  描述：获取当前产生的事件的类型。
//  常用返回值：
//    MotionEvent.ACTION_DOWN：手指按下。
//    MotionEvent.ACTION_MOVE：手指按下后(此时手指没有抬起)，接着在View上拖动手指。
//    MotionEvent.ACTION_UP：手指抬起。
public final int getAction()

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于该View的左上角坐标的偏移量。 
public final float getX()
public final float getY()

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于屏幕左上角坐标的偏移量。屏幕左上角就是状态栏的左上角的那个点。 
public final float getRawX()
public final float getRawY()
```

<br>　　范例3：触发事件。
``` android
public class AndroidTestActivity extends Activity {
    private ImageView img;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        // 从xml文件中获取ImageView对象。
        this.img = (ImageView) this.findViewById(R.id.cxy);;
        this.img.setOnTouchListener(new OnTouchListener(){
            public boolean onTouch(View v, MotionEvent event) {
                float x = event.getX();
                float y = event.getY();
                switch(event.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        System.out.println("手指按下(x="+x+",y="+y+")!");
                        break;
                    case MotionEvent.ACTION_MOVE:
                        System.out.println("手指拖拽(x="+x+",y="+y+")!");
                        break;
                    case MotionEvent.ACTION_UP:
                        System.out.println("手指抬起(x="+x+",y="+y+")!");
                        break;
                }
                return true;
            }
        });
    }
}
```

### 按键事件 ###
　　请记住，按键事件始终是发送给当前具有焦点的View对象。事件从层次结构树的顶层开始调度，然后依次向下，直到它们到达合适的目标。如果当前的View（或View的子View）有焦点，那么通过`dispatchKeyEvent()`方法你能够看到事件的执行轨迹。你可以有选择的捕获通过的View对象的按键事件，因为你能够接受到Activity内部的`onKeyDown()`和`onKeyUp()`两个事件。

<br>　　范例1：Activity类。
``` android
//  描述：当某个键被按下，且在当前Activity内部没有任何一个控件处理此键盘事件时，系统调用此方法。
//    若在Activity中当前拥有焦点的控件是一个EditText，那么当用户按下键盘上的某个键(如数字1)，事件将会被EditText所接收并处理，之后将不会调用Activity的此方法。 
//    若用户按下键盘上的back键，则由于EditText不会响应此事件，所以会调用此方法。
//  参数：
//    keyCode：用户按下的键的编号。
//    event：产生的键盘事件对象。
//  返回值：
//    若返回true则意味着在当前方法中已经处理完毕键盘事件，事件将不会向下传递。
//    当长按某个键时系统会不断的为该键调用本方法，若本方法连续返回两次false则会导致Activity的onKeyLongPress方法被调用。
public boolean onKeyDown (int keyCode, KeyEvent event)

//  当某个键被松开，且在当前Activity内部没有任何一个控件处理此键盘事件时，系统调用此方法。
public boolean onKeyUp (int keyCode, KeyEvent event)
```

<br>　　范例2：退出程序。
``` android
public boolean onKeyDown(int keyCode, KeyEvent event) {
    // 若按下的是back键。
    if(KeyEvent.KEYCODE_BACK == keyCode){
        Toast.makeText(this, "您即将退出程序!", 1).show();
        this.finish();
        return true;
    }
    return super.onKeyDown(keyCode, event);
}
```

<br>**事件处理器**
　　如果你是从View类开始构建一个定制的组件，那么你要定义几个默认的回调方法作为默认的事件处理器。在“自定义控件”的章节中，你会学到一些共同的用于事件处理的回调方法，它们是：
``` android
	// 当一个键被按下时，会调用这个方法；
	onKeyDown(int, KeyEvent)

	// 当一个被按下的键弹起时，会调用这个方法；
	onKeyUp(int, KeyEvent)

	// 当轨迹球滚动时，会调用这个方法；
	onTrackballEvent(MotionEvent)

	// 当个触屏动作发生时，会调用这个方法；
	onTouchEvent(MotionEvent)

	// 当一个View对象获得或失去焦点时，会调用这个方法。
	onFoucusChanged(Boolean, int, Rect)
```

<br>　　还有一些其他的你应该了解的方法，它们不是View类的一部分，但是能够直接的影响到你处理事件的方式。因此，在管理布局中更复杂的事件时，要考虑这些方法：
``` android
	// 这个方法允许你在触屏事件被分发被对应的窗口之前截获所有的触屏事件。
	Activity.dispatchTouchEvent(MotionEvent)

	// 这个方法允许一个ViewGroup对象查看分发给它的子View对象的事件。
	ViewGroup.onInterceptTouchEvent(MotionEvent)

	// 在父View对象上调用这个方法，指明父View对象是否应该截获onInterceptTouchEvent(MotionEvent)触屏事件。
	ViewParent.requestDisallowInterceptTouchEvent(Boolean)
```

# 第二节 事件分发机制 #
　　通过上一节了解了Android几种的事件类型（onClick、onTouch等）的概念以及用法，本节将从源码的角度进行分析，详细说明各种事件的分发机制。
　　注：本节内容主要来源自 [Android事件分发机制完全解析，带你从源码的角度彻底理解](http://blog.csdn.net/guolin_blog/article/details/9097463) ，有删改。

## View的事件分发 ##
　　阅读源码讲究由浅入深，循序渐进，因此我们也从简单的开始，现在先带大家探究View的事件分发，稍后再去探究难度更高的ViewGroup的事件分发。
　　比如说你当前有一个非常简单的项目，只有一个Activity，并且Activity中只有一个按钮。我们已经知道，如果想要给这个按钮注册一个点击事件，只需要调用：
``` android
button.setOnClickListener(new OnClickListener() {
    public void onClick(View v) {
        Log.d("TAG", "onClick execute");
    }
});
```
　　这样在`onClick`方法里面写实现，就可以在按钮被点击的时候执行。

<br>　　我们也已经知道，如果想给这个按钮再添加一个`touch`事件，只需要调用：
``` android
button.setOnTouchListener(new OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "onTouch execute, action " + event.getAction());
        return false;
    }
});
```

<br>　　`onTouch`方法里能做的事情比`onClick`要多一些，比如判断手指按下、抬起、移动等事件。那么如果我两个事件都注册了，哪一个会先执行呢？我们来试一下就知道了，运行程序点击按钮，打印结果如下：

<center>
![](/img/android/android_3_11.png)
</center>

　　可以看到，`onTouch`是优先于`onClick`执行的，并且`onTouch`执行了两次，一次是`ACTION_DOWN`（手指按下），一次是`ACTION_UP`(手指抬起，你还可能会有多次`ACTION_MOVE`的执行，如果你手抖了一下)。因此事件传递的顺序是先经过`onTouch`，再传递到`onClick`。

<br>　　细心的朋友应该可以注意到，`onTouch`方法是有返回值的，这里我们返回的是`false`，如果我们尝试把`onTouch`方法里的返回值改成`true`，再运行一次，结果如下：

<center>
![](/img/android/android_3_12.png)
</center>

　　我们发现，`onClick`方法不再执行了！为什么会这样呢？你可以先理解成`onTouch`方法返回`true`就认为这个事件被`onTouch`消费掉了，因而不会再继续向下传递。
　　如果到现在为止，以上的所有知识点你都是清楚的，那么说明你对Android事件传递的基本用法应该是掌握了。不过别满足于现状，让我们从源码的角度分析一下，出现上述现象的原理是什么。

<br>　　首先你需要知道一点，只要你触摸到了任何一个控件，就一定会调用该控件的`dispatchTouchEvent`方法，它的返回值用来决定事件是否继续向下传递，如果返回`true`则意味着当前View已经处理了事件，不需要继续向下传递。 
　　该方法在View类中定义，因此默认情况下所有子类都将继承该方法。当我们去点击按钮的时候，就会调用View类`dispatchTouchEvent`方法，因为`Button`类及其父类`TextView`都没有重写View类的该方法。
　　然后我们来看一下View中`dispatchTouchEvent`方法的源码：
``` android
public boolean dispatchTouchEvent(MotionEvent event) {
    if (mOnTouchListener != null && (mViewFlags & ENABLED_MASK) == ENABLED &&
            mOnTouchListener.onTouch(this, event)) {
        return true;
    }
    return onTouchEvent(event);
}
```
　　提示：不同版本的Android源代码会有一些差异。比如，此方法在`Android2.2`和`Android4.0`就不是完全一致的。

　　这个方法非常的简洁，只有短短几行代码！我们可以看到，在这个方法内，首先是进行了一个判断，如果：
　　`mOnTouchListener != null`，`(mViewFlags & ENABLED_MASK) == ENABLED`和`mOnTouchListener.onTouch(this, event)`这三个条件都为真，就返回`true`，否则就去执行`onTouchEvent(event)`方法并返回。

　　先看一下第一个条件，`mOnTouchListener`这个变量是在哪里赋值的呢？我们寻找之后在View里发现了如下方法：
``` android
public void setOnTouchListener(OnTouchListener l) {
    mOnTouchListener = l;
}
```
　　找到了，`mOnTouchListener`正是在`setOnTouchListener`方法里赋值的，也就是说只要我们给控件注册了`touch`事件，`mOnTouchListener`就一定被赋值了。
　　第二个条件`(mViewFlags & ENABLED_MASK) == ENABLED`是判断当前点击的控件是否是`enable`的，按钮默认都是`enable`的，因此这个条件恒定为`true`。
　　第三个条件就比较关键了，`mOnTouchListener.onTouch(this, event)`，其实也就是去回调控件注册`touch`事件时的`onTouch`方法。也就是说如果我们在`onTouch`方法里返回`true`，就会让这三个条件全部成立，从而整个方法直接返回`true`。如果我们在`onTouch`方法里返回`false`，就会再去执行`onTouchEvent(event)`方法。

<br>　　现在我们可以结合前面的例子来分析一下了，首先在`dispatchTouchEvent`中最先执行的就是`onTouch`方法，因此`onTouch`肯定是要优先于`onClick`执行的，也是印证了刚刚的打印结果。而如果在`onTouch`方法里返回了`true`，就会让`dispatchTouchEvent`方法直接返回`true`，不会再继续往下执行。而打印结果也证实了如果`onTouch`返回`true`，`onClick`就不会再执行了。
　　根据以上源码的分析，从原理上解释了我们前面例子的运行结果。而上面的分析还透漏出了一个重要的信息，那就是`onClick`的调用肯定是在`onTouchEvent(event)`方法中的！那我们马上来看下`onTouchEvent`的源码。
``` andriod
public boolean onTouchEvent(MotionEvent event) {
    final int viewFlags = mViewFlags;
    if ((viewFlags & ENABLED_MASK) == DISABLED) {
        // A disabled view that is clickable still consumes the touch
        // events, it just doesn't respond to them.
        return (((viewFlags & CLICKABLE) == CLICKABLE ||
                (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE));
    }
    if (mTouchDelegate != null) {
        if (mTouchDelegate.onTouchEvent(event)) {
            return true;
        }
    }
    if (((viewFlags & CLICKABLE) == CLICKABLE ||
            (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE)) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_UP:
                boolean prepressed = (mPrivateFlags & PREPRESSED) != 0;
                if ((mPrivateFlags & PRESSED) != 0 || prepressed) {
                    // take focus if we don't have it already and we should in
                    // touch mode.
                    boolean focusTaken = false;
                    if (isFocusable() && isFocusableInTouchMode() && !isFocused()) {
                        focusTaken = requestFocus();
                    }
                    if (!mHasPerformedLongPress) {
                        // This is a tap, so remove the longpress check
                        removeLongPressCallback();
                        // Only perform take click actions if we were in the pressed state
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
                    }
                    if (mUnsetPressedState == null) {
                        mUnsetPressedState = new UnsetPressedState();
                    }
                    if (prepressed) {
                        mPrivateFlags |= PRESSED;
                        refreshDrawableState();
                        postDelayed(mUnsetPressedState,
                                ViewConfiguration.getPressedStateDuration());
                    } else if (!post(mUnsetPressedState)) {
                        // If the post failed, unpress right now
                        mUnsetPressedState.run();
                    }
                    removeTapCallback();
                }
                break;
            case MotionEvent.ACTION_DOWN:
                if (mPendingCheckForTap == null) {
                    mPendingCheckForTap = new CheckForTap();
                }
                mPrivateFlags |= PREPRESSED;
                mHasPerformedLongPress = false;
                postDelayed(mPendingCheckForTap, ViewConfiguration.getTapTimeout());
                break;
            case MotionEvent.ACTION_CANCEL:
                mPrivateFlags &= ~PRESSED;
                refreshDrawableState();
                removeTapCallback();
                break;
            case MotionEvent.ACTION_MOVE:
                final int x = (int) event.getX();
                final int y = (int) event.getY();
                // Be lenient about moving outside of buttons
                int slop = mTouchSlop;
                if ((x < 0 - slop) || (x >= getWidth() + slop) ||
                        (y < 0 - slop) || (y >= getHeight() + slop)) {
                    // Outside button
                    removeTapCallback();
                    if ((mPrivateFlags & PRESSED) != 0) {
                        // Remove any future long press/tap checks
                        removeLongPressCallback();
                        // Need to switch from pressed to not pressed
                        mPrivateFlags &= ~PRESSED;
                        refreshDrawableState();
                    }
                }
                break;
        }
        return true;
    }
    return false;
}
```
　　相较于刚才的`dispatchTouchEvent`方法，`onTouchEvent`方法复杂了很多，不过没关系，我们只挑重点看就可以了。
　　首先从`onTouchEvent`方法中可以看出，如果该控件是可以点击的就会进入到`switch`判断中去，而如果当前的事件是抬起手指，则会进入到`MotionEvent.ACTION_UP`这个`case`当中。在经过种种判断之后，会执行到`performClick()`方法，那我们进入到这个方法里瞧一瞧：
``` android
public boolean performClick() {
    sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_CLICKED);
    if (mOnClickListener != null) {
        playSoundEffect(SoundEffectConstants.CLICK);
        mOnClickListener.onClick(this);
        return true;
    }
    return false;
}
```
　　发现只要`mOnClickListener != null`，就会去调用它的`onClick`方法。那`mOnClickListener`又是在哪里赋值的呢？经过寻找后找到如下方法：
``` android
public void setOnClickListener(OnClickListener l) {
    if (!isClickable()) {
        setClickable(true);
    }
    mOnClickListener = l;
}
```
　　一切都是那么清楚了！当我们通过调用`setOnClickListener`方法来给控件注册一个点击事件时，就会给`mOnClickListener`赋值。然后每当控件被点击时，都会在`performClick()`方法里回调被点击控件的`onClick`方法。

<br>　　这样View的整个事件分发的流程就让我们搞清楚了！不过现在还没结束，还有一个很重要的知识点需要说明，就是`touch`事件的层级传递。我们都知道如果给一个控件注册了`touch`事件，每次点击它的时候都会触发一系列的`ACTION_DOWN`，`ACTION_MOVE`，`ACTION_UP`等事件。这里需要注意，如果你在执行`ACTION_DOWN`的时候返回了`false`，后面一系列其它的`Action`就不会再得到执行了。简单的说，就是当View的`dispatchTouchEvent`方法在进行事件分发的时候，只有前一个`Action`返回`true`，才会触发后一个`Action`。

<br>　　说到这里，很多的朋友肯定要有巨大的疑问了。这不是在自相矛盾吗？前面的例子中，明明在`onTouch`事件里面返回了`false`，`ACTION_DOWN`和`ACTION_UP`不是都得到执行了吗？其实你只是被假象所迷惑了，让我们仔细分析一下，在前面的例子当中，我们到底返回的是什么。
　　参考着我们前面分析的源码，首先在`onTouch`事件里返回了`false`，就一定会进入到`onTouchEvent`方法中，然后我们来看一下`onTouchEvent`方法的细节。由于我们点击了按钮，就会进入到`switch`判断的内部，然后你会发现，不管当前的`Action`是什么，最终都一定会返回一个`true`。
　　是不是有一种被欺骗的感觉？明明在`onTouch`事件里返回了`false`，系统还是在`onTouchEvent`方法中帮你返回了`true`。就因为这个原因，才使得前面的例子中`ACTION_UP`可以得到执行。

<br>　　那我们可以换一个控件，将按钮替换成`ImageView`，然后给它也注册一个`touch`事件，并返回`false`。如下所示：
``` android
imageView.setOnTouchListener(new OnTouchListener() {
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "onTouch execute, action " + event.getAction());
        return false;
    }
});
```
　　运行一下程序，点击`ImageView`，你会发现结果如下：

<center>
![](/img/android/android_3_13.png)
</center>

　　在`ACTION_DOWN`执行完后，后面的一系列`Action`都不会得到执行了。这又是为什么呢？因为`ImageView`和`Button`不同，它是默认不可点击的，因此在`onTouchEvent`的判断时无法进入到`if`的内部，直接返回了`false`，也就导致后面其它的`Action`都无法执行了。

<br>　　问：`onTouch`和`onTouchEvent`有什么区别，又该如何使用？
　　答：从源码中可以看出，这两个方法都是在View的`dispatchTouchEvent`中调用的，`onTouch`优先于`onTouchEvent`执行。如果在`onTouch`方法中通过返回`true`将事件消费掉，`onTouchEvent`将不会再执行。
　　另外需要注意的是，`onTouch`能够得到执行需要两个前提条件，第一个是`mOnTouchListener != null`，第二个是当前点击的控件必须是`enable`的。因此如果你有一个控件是`非enable`的，那么给它注册`onTouch`事件将永远得不到执行。对于这一类控件，如果我们想要监听它的`touch`事件，就必须通过在该控件中重写`onTouchEvent`方法来实现。

## ViewGroup的事件分发 ##
　　我们平时项目里经常用到的各种布局，全都属于ViewGroup的子类，ViewGroup实际上也是一个View，只不过比起View，它多了可以包含子View和定义布局参数的功能。

　　首先我们来自定义一个布局，命名为MyLayout，继承自LinearLayout，如下所示：
``` android
public class MyLayout extends LinearLayout {
    public MyLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}
```
　　然后，打开主布局文件`activity_main.xml`，在其中加入我们自定义的布局：
``` xml
<com.example.viewgrouptouchevent.MyLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/my_layout_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >
    <com.example.viewgrouptouchevent.MyLayout
        android:id="@+id/my_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@android:color/black"
        android:orientation="vertical"
        android:padding="10dp" >
        <Button
            android:id="@+id/button1"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Button1" />
        <Button
            android:id="@+id/button2"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Button2" />
    </com.example.viewgrouptouchevent.MyLayout>
</com.example.viewgrouptouchevent.MyLayout>
```
　　可以看到，我们在MyLayout中添加了两个按钮，接着在MainActivity中为这两个按钮和MyLayout都注册了监听事件：
``` android
myLayout.setOnTouchListener(new OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "myLayout on touch");
        return false;
    }
});
myLayoutRoot.setOnTouchListener(new OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "myLayoutRoot on touch");
        return false;
    }
});
button1.setOnTouchListener(new OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "btn1 on touch");
        return false;
    }
});
button2.setOnTouchListener(new OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        Log.d("TAG", "btn2 on touch");
        return false;
    }
});
```
　　我们在MyLayout的`onTouch`方法，和Button1、Button2的`onClick`方法中都打印了一句话。现在运行一下项目，效果图如下所示：

<center>
![](/img/android/android_3_14.png)
</center>

　　分别点击一下Button1、Button2、黑色区域和空白区域(上图中的底部区域)，打印结果如下所示：

<center>
![](/img/android/android_3_15.png)
</center>

　　先来关注一下前四条信息，它们是当两个按钮被点击时打印出来的（按下和抬起）。你会发现，当点击按钮的时候，`myLayout`和`myLayoutRoot`注册的`onTouch`方法并不会执行，只有点击空白区域（或黑色区域）的时候才会执行`myLayoutRoot`(或`myLayout`)的`onTouch`方法。
　　按照上一节的结论得知，即便Button的`onTouch`方法返回了`false`，其`onTouchEvent`方法最终都会返回`true`，也就是说Touch事件一定会被Button给消耗掉，不会再继续向下传递。
　　那就说明Android中的`touch`事件是先传递到View，再传递到ViewGroup的？现在下结论还未免过早了，让我们再来做一个实验。

　　查阅文档可以看到，ViewGroup中有一个`onInterceptTouchEvent`方法，我们来看一下这个方法的源码：
``` android
public boolean onInterceptTouchEvent(MotionEvent ev) {  
    return false;  
}
```
　　源码很简单，只有一行代码，返回了一个`false`！
　　好吧，既然是布尔型的返回，那么只有两种可能，我们在MyLayout中重写这个方法，然后返回一个`true`试试，代码如下所示：
``` android
public class MyLayout extends LinearLayout {
    public MyLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        return true;
    }
}
```
　　现在再次运行项目，然后分别Button1、Button2、黑色区域和空白区域，打印结果如下所示：

<center>
![](/img/android/android_3_16.png)
</center>

　　你会发现，不管你点击哪里，永远都只会触发`myLayoutRoot`的`touch`事件了，按钮的点击事件完全被屏蔽掉了！
　　问题来了：如果Android中的`touch`事件是先传递到View，再传递到ViewGroup的，那么MyLayout又怎么可能屏蔽掉Button的点击事件呢？

　　实时上，当用户点击了某个控件时，系统首先会去调用该控件所在布局的`dispatchTouchEvent`方法，然后在布局的`dispatchTouchEvent`方法中找到被点击的相应控件，再去调用该控件的`dispatchTouchEvent`方法，如果没有找到任何子View可以处理事件，或者所有的子View都不处理，则最终才会由自己来处理。
　　比如：我们点击了`myLayout`中的按钮，会先去调用`myLayout`的`dispatchTouchEvent`方法，可是你会发现`myLayout`中并没有这个方法。那就再到它的父类`LinearLayout`中找一找，发现也没有这个方法。那只好继续再找`LinearLayout`的父类`ViewGroup`，终于在`ViewGroup`中看到了这个方法，按钮的`dispatchTouchEvent`方法就是在这里调用的。

``` android
public boolean dispatchTouchEvent(MotionEvent ev) {
    final int action = ev.getAction();
    final float xf = ev.getX();
    final float yf = ev.getY();
    final float scrolledXFloat = xf + mScrollX;
    final float scrolledYFloat = yf + mScrollY;
    final Rect frame = mTempRect;
    boolean disallowIntercept = (mGroupFlags & FLAG_DISALLOW_INTERCEPT) != 0;
    if (action == MotionEvent.ACTION_DOWN) {
        if (mMotionTarget != null) {
            mMotionTarget = null;
        }
        if (disallowIntercept || !onInterceptTouchEvent(ev)) {
            ev.setAction(MotionEvent.ACTION_DOWN);
            final int scrolledXInt = (int) scrolledXFloat;
            final int scrolledYInt = (int) scrolledYFloat;
            final View[] children = mChildren;
            final int count = mChildrenCount;
            for (int i = count - 1; i >= 0; i--) {
                final View child = children[i];
                if ((child.mViewFlags & VISIBILITY_MASK) == VISIBLE
                        || child.getAnimation() != null) {
                    child.getHitRect(frame);
                    if (frame.contains(scrolledXInt, scrolledYInt)) {
                        final float xc = scrolledXFloat - child.mLeft;
                        final float yc = scrolledYFloat - child.mTop;
                        ev.setLocation(xc, yc);
                        child.mPrivateFlags &= ~CANCEL_NEXT_UP_EVENT;
                        if (child.dispatchTouchEvent(ev))  {
                            mMotionTarget = child;
                            return true;
                        }
                    }
                }
            }
        }
    }
    boolean isUpOrCancel = (action == MotionEvent.ACTION_UP) ||
            (action == MotionEvent.ACTION_CANCEL);
    if (isUpOrCancel) {
        mGroupFlags &= ~FLAG_DISALLOW_INTERCEPT;
    }
    final View target = mMotionTarget;
    if (target == null) {
        ev.setLocation(xf, yf);
        if ((mPrivateFlags & CANCEL_NEXT_UP_EVENT) != 0) {
            ev.setAction(MotionEvent.ACTION_CANCEL);
            mPrivateFlags &= ~CANCEL_NEXT_UP_EVENT;
        }
        return super.dispatchTouchEvent(ev);
    }
    if (!disallowIntercept && onInterceptTouchEvent(ev)) {
        final float xc = scrolledXFloat - (float) target.mLeft;
        final float yc = scrolledYFloat - (float) target.mTop;
        mPrivateFlags &= ~CANCEL_NEXT_UP_EVENT;
        ev.setAction(MotionEvent.ACTION_CANCEL);
        ev.setLocation(xc, yc);
        if (!target.dispatchTouchEvent(ev)) {
        }
        mMotionTarget = null;
        return true;
    }
    if (isUpOrCancel) {
        mMotionTarget = null;
    }
    final float xc = scrolledXFloat - (float) target.mLeft;
    final float yc = scrolledYFloat - (float) target.mTop;
    ev.setLocation(xc, yc);
    if ((target.mPrivateFlags & CANCEL_NEXT_UP_EVENT) != 0) {
        ev.setAction(MotionEvent.ACTION_CANCEL);
        target.mPrivateFlags &= ~CANCEL_NEXT_UP_EVENT;
        mMotionTarget = null;
    }
    return target.dispatchTouchEvent(ev);
}
```
　　这个方法代码比较长，我们只挑重点看。在第`13`行可以看到一个`if`语句，若它的两个表达式有一个为`true`，就会进入到`if`中。
　　第一个表达式`disallowIntercept`是指是否禁用掉事件拦截的功能，默认是`false`，也可以通过调用`requestDisallowInterceptTouchEvent`方法对这个值进行修改。
　　第二个表达式是对`onInterceptTouchEvent`方法的返回值取反。

　　这个时候就可以思考一下了：
　　由于我们刚刚在`myLayout`中重写了`onInterceptTouchEvent`方法，让这个方法返回`true`，导致所有按钮的点击事件都被屏蔽了，那我们就完全有理由相信，按钮点击事件的处理就是在第`13`行条件判断的内部进行的！
<br>　　在第`19`行通过一个`for`循环，遍历了当前`ViewGroup`下的所有子`View`，然后在第`24`行判断当前遍历的View是不是正在点击的View，如果是的话就会进入到该条件判断的内部，然后在第`29`行调用了该`View`的`dispatchTouchEvent`，之后的流程就和上一节中讲解的是一样的了。我们也因此证实了，按钮点击事件的处理确实就是在这里进行的。

　　然后需要注意一下，调用子View的`dispatchTouchEvent`后是有返回值的。我们已经知道，如果一个控件是可点击的，那么点击该控件时，`dispatchTouchEvent`的返回值必定是`true`。因此会导致第`29`行的条件判断成立，于是在第`31`行给`ViewGroup`的`dispatchTouchEvent`方法直接返回了`true`。这样就导致后面的代码无法执行到了，也是印证了我们前面的Demo打印的结果，如果按钮的点击事件得到执行，就会把`MyLayout`的`touch`事件拦截掉。

　　那如果我们点击的不是按钮，而是黑色区域或空白区域呢？这种情况就一定不会在第`31`行返回`true`了，而是会继续执行后面的代码。
　　在第`44`行，如果`target == null`，就会在第`50`行调用`super.dispatchTouchEvent(ev)`。也就是会调用到`View`中的`dispatchTouchEvent`方法，因为ViewGroup的父类就是View，之后的处理逻辑又和前面所说的是一样的了。
　　
<br>　　整个ViewGroup事件分发过程的流程图：

<center>
![](/img/android/android_3_17.png)
</center>

　　现在整个ViewGroup的事件分发流程的分析也就到此结束了，我们最后再来简单梳理一下吧。

	1、Android事件分发是先传递到ViewGroup，再由ViewGroup传递到View的。
	2、在ViewGroup中可以通过onInterceptTouchEvent方法对事件传递进行拦截，onInterceptTouchEvent方法返回true代表不允许事件继续向子View传递，返回false代表不对事件进行拦截，默认返回false。
	3、若子View中将传递的事件消费掉，ViewGroup中将不会再处理事件，否则将会处理。

## Activity的事件分发 ##
　　事实上，不论是`key`、`trackball`还是`touch`事件，事件的传递最开始都是从`Activity`中开始的。
　　以`touch`事件为例，事件首先被传递给你`Activity`的`dispatchTouchEvent`方法，若不想事件继续向下传递，则可以不调用`“super.dispatchTouchEvent()”`，这样事件是不会被发送到`View`的。

　　首先再定义一个TextView，用于观察`touch`事件的传递过程：
``` android
public class MyText extends TextView {
    public MyText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public boolean onTouchEvent(MotionEvent event) {
        System.out.println("onTouchEvent:"+this);
        return super.onTouchEvent(event);
    }
}
```

　　在`MyText`中重写了父类的`onTouchEvent`方法，但是不执行任何操作，仅仅是打印了一行文本。然后修改一下原来的`MyLayout`类，也重写`onTouchEvent`方法：
``` android
public class MyLayout extends LinearLayout {
    public MyLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public boolean onTouchEvent(MotionEvent event) {
        System.out.println("onTouchEvent:"+this);
        return super.onTouchEvent(event);
    }
}
```

　　接着看一下布局文件：
``` xml
<com.example.viewgrouptouchevent.MyLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/my_layout_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >
    <com.example.viewgrouptouchevent.MyLayout
        android:id="@+id/my_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@android:color/black"
        android:orientation="vertical"
        android:padding="10dp" >
        <com.example.viewgrouptouchevent.MyText
            android:id="@+id/text1"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="text1"
            android:textColor="@android:color/white" />
    </com.example.viewgrouptouchevent.MyLayout>
</com.example.viewgrouptouchevent.MyLayout>
```
　　在Activity中注册事件监听器，以及重写Activity的`dispatchTouchEvent`和`onTouchEvent`方法：
``` android
public void onCreate(Bundle savedInstanceState) {
    myLayoutRoot = (ViewGroup)findViewById(R.id.my_layout_root);
    myLayoutRoot.setOnTouchListener(new OnTouchListener() {
	    public boolean onTouch(View v, MotionEvent event) {
	    	System.out.println("onTouch: "+myLayoutRoot);
	    	return false;
	    }
    });
    final ViewGroup myLayout = (ViewGroup) findViewById(R.id.my_layout);
    myLayout.setOnTouchListener(new OnTouchListener() {
	    public boolean onTouch(View v, MotionEvent event) {
	    	System.out.println("onTouch: "+myLayout);
	    	return false;
	    }
    });
    final TextView text1 = (TextView) findViewById(R.id.text1);
    text1.setOnTouchListener(new OnTouchListener() {
	    public boolean onTouch(View v, MotionEvent event) {
	    	System.out.println("onTouch: "+v);
	    	return false;
	    }
    });
}

public boolean dispatchTouchEvent(MotionEvent ev) {
    System.out.println("Activity dispatchTouchEvent,"+ev.getAction());
    return super.dispatchTouchEvent(ev);
}

public boolean onTouchEvent(MotionEvent ev) {
    System.out.println("Activity onTouchEvent,"+ev.getAction());
    return super.onTouchEvent(ev);
}

```
　　程序运行的效果如下图所示：

<center>
![](/img/android/android_3_18.png)
</center>

　　按住`“text1”`并稍微在上面拖动一下，程序会输出如下信息：

<center>
![](/img/android/android_3_19.png)
</center>

　　调用流程：
　　首先，Activity的`dispatchTouchEvent`被调用，并且当前事件是按下动作(即输出0)。
　　然后，事件被从上到下依次传递给`myLayoutRoot`、`myLayout`、`text1`，按照之前讲的知识，当事件传递给`text1`时，会先调用`text1`的`dispatchTouchEvent`方法，然后是`onTouch`，若`onTouch`返回`false`则会接着调用`onTouchEvent`方法，调用完毕后程序逻辑就会返回到`text1`的`dispatchTouchEvent`方法中。 
　　接着，系统将依据`text1`的`dispatchTouchEvent`方法返回值，执行下一步操作：
　　若返回`false`，则就如上图所示，系统会将事件返回给当前控件的父控件（`myLayout`、`myLayoutRoot`）。若它们都没有处理，则会调用Activity的`onTouchEvent`方法（注：2是移动动作、1是抬起动作）。
　　若返回`true`，则事件将被终止传递，并且打印如下内容：

<center>
![](/img/android/android_3_20.png)
</center>

　　也就是说，按下动作的后续动作将只会通过Activity传递给`text1`，而`myLayoutRoot`和`myLayout`将不会接收到。

<br>**本节参考阅读：**
- [Android事件分发机制完全解析，带你从源码的角度彻底理解](http://blog.csdn.net/guolin_blog/article/details/9097463) 


<br><br>