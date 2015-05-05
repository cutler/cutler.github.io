title: UI篇　第八章 自定义控件
date: 2015-2-5 18:59:50
create: 2015-4-29 11:41:12
categories: Android
---
　　Android平台提供了一套完备的、功能强大的组件化模型用于搭建用户界面，这套组件化模型以`View`和`ViewGroup`这两个基础布局类为基础。平台本身已预先实现了多种用于构建界面的`View`和`ViewGroup`子类，他们被分别称为部件（`widget`）和布局（`layout`）。

	-  部件(widget)分为：
	   -  常用部件：Button、TextView、EditText、ListView、CheckBox、RadioButton、Gallery、Spinner等。
	   -  专门用途的：AutoCompleteTextView、ImageSwitcher 和 TextSwitcher等。
	-  布局（layout）包括：LinearLayout、FrameLayout、RelativeLayout等。

<br>**自定义控件的四种方式**
　　如果上面那些`部件`和`布局`不能满足需求，您可以自定义一个`View`的子类。如果对已有的部件和布局进行小调整就能满足需求，可以通过继承某个已存在的部件或布局并重载特定方法的方式轻松实现。

　　为了使您对定制`View`的可控性有一个直观了解，下面给出就四种自定义`View`的方式：

	-  添加回调接口。
	   -  通过继承现有的View来实现自定义控件，在你自定义的View中添加若干回调接口。
	-  修改已有控件。
	   -  通过继承现有的View并重写它的onDraw()方法来修改该View的屏幕绘制方式（如继承EditText使之产生了带有下划线的记事本页面）。
	-  复合控件。
	   -  通过继承现有的layout来将一组View合成为一个新的独立组件。比如制作一个下拉列表框（弹出列表和输入框的组合）、双区域选择控制器（有左、右两个选择区域，选择框中的元素可随意切换其左右位置）等等。
	-  完全定制的组件。
	   -  通过继承View类来实现自定义控件。您可以将View定制成任意样式，比如一个使用2D图片渲染的音量调节器可以做成模拟电路控制的样子。

# 第一节 完全定制的组件 #
　　不论您对于视图组件的期望多么夸张，完全定制的组件都可以实现，包括实现一个看起来像旧模拟仪表盘的图形化紫外线辐照计，或者实现一个有着进度标记的长文本使之就像一台卡拉ok机的字幕。总之，这些特殊功能不可以通过已有组件实现，而且组合使用已有组件也不能满足需求。

　　幸运的是，您可以轻松构建一个样式、外观完全满足您需要的新组件，包括控制新组件在屏幕上`所占区域大小`等。创建一个完全定制的组件需要以下几步：

	-  第一，完全定制的组件通常继承自View类，所以搭建完全定制的组件的第一步通常是继承该类。
	-  第二，如果你想为你的控件添加自定义的属性，那么就需要重写父类的接收XML属性和参数的构造函数。
	-  第三，对形如“on...”的方法按需进行重写。比如，基本上都会重写：
	   -  系统在测量控件尺寸时会调用的onMeasure()方法。
	   -  在控制组件的显示时会调用的onDraw()方法。
	-  第四，如果需要，你还可以为组件创建新的事件监听器、属性访问修改器以及更为复杂的行为 。

　　在上面的这四步中，第三步是难点，涉及的知识也最多，当然也是我们要重点介绍的部分。继续向下进行之前，先插播个知识点：`Activity`的组成。

## Activity的组成 ##
　　在《UI篇　第三章 输入事件》中我们知道了，Android中的各种事件最初都是被交给`Activity`的，然后由`Activity`负责事件的分发。同样的，屏幕上所显示的`View`也是以`Activity`为单位进行组织的。

　　实际上，`Activity`由`标题栏`和`FrameLayout`两部分组成。
　　我们调用`setContentView()`方法设置的布局，会以子结点的形式加入到这个`FrameLayout`中。如下图所示：

<center>
![](http://img.blog.csdn.net/20131218231254906?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ3VvbGluX2Jsb2c=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
</center>

　　我们可以在`Activity`中通过代码来控制`标题栏`和`contentView`的显示与隐藏。

<br>　　范例1：隐藏`contentView`。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        System.out.println(findViewById(android.R.id.content));
        // FrameLayout的id为android.R.id.content。
        findViewById(android.R.id.content).setVisibility(View.GONE);
    }
}
```



## View ##
　　既然完全定制的组件的第一步就是继承`View`类，那么我们自然得先介绍一下它。

　　在Android中，`View`类是部件（`widget`）和布局（`layout`）的基类，它占据了屏幕上一个`矩形区域`，并负责绘制和处理事件。
　　前面已经说了，`Activity`中的视图被放到一个`FrameLayout`中，你可以动态编写代码向`FrameLayout`中添加`View`，也可以通过在一个或多个`XML`布局文件来添加`View`。
　　另外，从整体上来看，`Activity`内的所有`View`排列成了一个`树型结构`，我们把这个树形结构称为`View树`、`视图树`。

<br>
### 生命周期方法 ###
　　在继承了`View`类且重写完构造方法后，接着你就要根据自己的需要来重写`View`所提供的一些标准的回调方法了。你不需要重载所有的方法，实际上你可以从仅重载`onDraw(android.graphics.Canvas)`方法开始，但是本节将会详细讲解`View`类的各个回调方法的调用时机。

　　首先，我们要知道的是，任何一个视图都不可能凭空突然出现在屏幕上，它们都是要经过非常科学的绘制流程后才能显示出来的。
　　然后，当`Activity`获取焦点的时候，它就需要绘制布局。Android框架会处理绘制过程，但这个`Activity`必须提供它`View树`的根节点。
　　接着，整个`View树`会从根节点开始，依次执行绘制。
　　最后，每个`View`对象从创建到结束的整个生命周期中，会经历`6`个阶段：`创建`、`布局`、`绘制`、`事件处理`、`焦点`、`关联`，每个阶段中都提供了一个或多个回调方法。

<br>
#### 创建阶段 ####
　　在`View`的创建阶段中，框架会首先调用该`View`的构造方法进行对象的初始化，通常在你自定义的`View`类中会定义两个不同的构造器，并在其内部来调用父类的构造器：

<br>　　范例1：重写构造方法。
``` android
public class MyView extends View{
    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }
    // 当从XML文件中inflating一个View时，调用此方法。当所有子View都被加载完毕后，会继续调用onFinishInflate()方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    protected void onFinishInflate() {
        super.onFinishInflate();
    }
}
```
    语句解释：
    -  在View类中没有提供public的无参的构造器，因此在其所有的子类中都必须显式的调用其一个有参的构造器。
    -  若当前View是一个部件，则View (Contex, AttributeSet)构造方法执行完毕后会立刻调用它的onFinishInflate()方法，若它是一个布局，则将在所有子View的onFinishInflate()方法都调用完成后，才会调用它的onFinishInflate()方法。

<br>
#### 布局阶段 ####
　　在`View`的布局阶段中，框架会依次调用`onMeasure()`、`onLayout()`、`onSizeChanged()`三个方法，我们也来依次介绍它们的用法。

<br>**onMeasure()**
　　顾名思义，`measure`是测量的意思，而`onMeasure()`方法，就是当Android框架需要测量视图的尺寸时所回调的方法。

　　关于View树的测量，有以下几点要知道的：

	-  首先，当需要在屏幕上绘制Activity的View树时，Android框架会先测量一下整个View树的尺寸，再进行后续操作。
	-  然后，系统会调用View树的根节点的measure()方法开始测量工作，该方法进行一些简单操作后，就会转去调用onMeasure()方法。
	-  接着，通常在onMeasure()方法中会进行判断：
	   -  若当前View是一个普通的widget，则直接进行测量操作。
	   -  若当前View是一个ViewGroup类型的对象，则会先测量各个子View的尺寸，然后将测量的结果综合起来后，再来计算ViewGroup的尺寸。
	-  最后，View类的measure()方法使用final关键字修饰，因此该方法无法被重写，我们只能重写onMeasure()方法。

<br>　　`measure()`方法接收两个参数，`widthMeasureSpec`和`heightMeasureSpec`，它们表示`父View`对`当前View`的建议宽度和高度。


<br>　　范例1：`onMeasure`方法。
``` android
//  当父控件需要子控件计算出它所需要在屏幕上占据的尺寸时，会调用子控件该方法。
//  注意：
//      重写此方法时，当你计算完毕尺寸后，必须调用setMeasuredDimension(int measuredWidth, int measuredHeight)方法来保存评估出来的宽度
//      和高度。如果忘记将导致抛出IllegalStateException异常。
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec)
```

<br>　　范例2：重写`onMeasure`方法。
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
　　`Activity`的`onCreate`方法的内容为：
``` android
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    MyView myView = new MyView(this);
    myView.setBackgroundColor(Color.BLACK);
    setContentView(myView);
}
```
    语句解释：
    -  直接运行程序就可以在界面中看到一个黑色的方框了。
    -  由于篇幅原因，后面的范例中不会列出MyView类的完整代码，只会列出关键代码。

<br>　　在实际开发中，我们肯定不会像上面那样，把`MyView`的尺寸写死在代码上，而是应该依据`widthMeasureSpec`和`heightMeasureSpec`的值来动态的计算出`MyView`的尺寸。值得注意的是，这两个参数是不能直接使用的，因为它们是由`mode`和`size`混合运算后生成的，因此在使用它们之前，我们首先得使用`MeasureSpec`类来拆分出`mode`和`size`。

<br>　　范例3：获取`mode`与`size`。
``` android
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    // 获取widthMeasureSpec中的mode值。
    int widthMode = MeasureSpec.getMode(widthMeasureSpec);
    // 获取widthMeasureSpec中的size值。
    int widthSize = MeasureSpec.getSize(widthMeasureSpec);
    int heightMode = MeasureSpec.getMode(heightMeasureSpec);
    int heightSize = MeasureSpec.getSize(heightMeasureSpec);
}
```

<br>　　`View.MeasureSpec`类的常见的模式有： 

	-  MeasureSpec.EXACTLY：精确尺寸。
	   -  当控件的layout_width或layout_height指定为具体数值(如50dip)或者为FILL_PARENT时，该控件mode的值会为EXACTLY。
	   -  当mode是EXACTLY时，表示父视图希望子视图的大小应该是由size的值来决定的。
	-  MeasureSpec.AT_MOST：最大尺寸。
	   -  当控件的layout_width或layout_height指定为WRAP_CONTENT时，该控件mode的值会为AT_MOST。
	   -  当mode是AT_MOST时，size给出了父控件允许的最大尺寸，此时控件尺寸只要不超过父控件允许的最大尺寸即可。
	-  MeasureSpec.UNSPECIFIED：未指定尺寸。
	   -  表示开发人员可以将视图按照自己的意愿设置成任意的大小，没有任何限制。
	   -  这种情况比较少见，不太会用到。

<br>　　关于View树的测量，还有以下几点要知道的：

	-  首先，当View对象的measure()返回时，它的getMeasuredWidth()和getMeasuredHeight()方法是肯定有值的，它的所有子View也一样。
	-  然后，父视图可能在它的子视图上调用一次以上的measure(int,int)方法。
	   -  如果子视图不满意它们获得的区域大小，那么父视图将会干涉并设置第二次测量规则。
	-  最后，View对象测量后的宽度和高度必须受到View对象父View的约束，这就保证了在测量过程结束时，所有父视图都会接受它们子视图的测量值。
	   -  若父控件最大允许的宽度为100px，但子控件测量的宽度为200px，最终子控件只会显示前100px的宽度，超出的部分不会被显示。

<br>　　范例4：普通控件重写`onMeasure()`方法——伪代码。
``` android
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    setMeasuredDimension(getMeasuredLength(widthMeasureSpec, true), getMeasuredLength(heightMeasureSpec, false));
}
private int getMeasuredLength(int length, boolean isWidth) {
    int specMode = MeasureSpec.getMode(length);
    int specSize = MeasureSpec.getSize(length);
    int size;
    int padding = isWidth ? getPaddingLeft() + getPaddingRight(): getPaddingTop() + getPaddingBottom();
    if (specMode == MeasureSpec.EXACTLY) {
        size = specSize;
    } else {
        // 下面这行代码大体的意思是 padding + 控件的内容的尺寸。
        size = isWidth ? padding + mWave.length / 4 : DEFAULT_HEIGHT + padding;
        if (specMode == MeasureSpec.AT_MOST) {
            size = Math.min(size, specSize);
        }
    }
    return size;
}
```

<br>　　范例5：`ViewGroup`控件重写`onMeasure()`方法——伪代码。
``` android
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    // 创建测量参数mCellWidth、mCellHeight来创建MeasureSpec对象，它们是子控件的宽度和高度。
    int cellWidthSpec = MeasureSpec.makeMeasureSpec(mCellWidth, MeasureSpec.AT_MOST);
    int cellHeightSpec = MeasureSpec.makeMeasureSpec(mCellHeight, MeasureSpec.AT_MOST);
    // 遍历每一个子控件，依次调用它们的measure()方法，进行测量。
    int count = getChildCount();
    for (int i = 0; i < count; i++) {
        View childView = getChildAt(i);
        childView.measure(cellWidthSpec, cellHeightSpec);
    }
    // 当所有子控件都测量完毕后，下面开始设置当前控件的尺寸大小。
    setMeasuredDimension(resolveSize(mCellWidth * count, widthMeasureSpec), resolveSize(mCellHeight * count, heightMeasureSpec));
}
```
    语句解释：
    -  本范例中所用到的resolveSize()方法继承自View类，可以自行去查看源码。

<br>**onLayout()**
　　当框架测量完毕`View树`的尺寸之后，接下来就需要设置(`layout`)`View树`里的`View`的位置了，这个过程同样是从`根结点`开始，调用的方法为`layout()`。

<br>　　范例1：`layout`方法。
``` android
//  参数l，t，r，b表示当前View的左上角、右下角坐标值，这2个坐标值构成的矩形区域就是该View显示的位置。 
//  注意：这个位置是当前控件在父View内的相对位置，原点是父View的左上角。
public void layout(int l, int t, int r, int b)
```

<br>　　首先我们来看下`View.java`中函数`layout()`和`onLayout()`的源码：
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

    boolean changed = isLayoutModeOptical(mParent) ?
            setOpticalFrame(l, t, r, b) : setFrame(l, t, r, b);

    if (changed || (mPrivateFlags & PFLAG_LAYOUT_REQUIRED) == PFLAG_LAYOUT_REQUIRED) {
        onLayout(changed, l, t, r, b);
        mPrivateFlags &= ~PFLAG_LAYOUT_REQUIRED;

        ListenerInfo li = mListenerInfo;
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

protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
}
```
    语句解释：
    -  值得注意的是，在不同版本的SDK中，各个类的源代码是不完全相同的。笔者所使用的是android-21版本的View.java类。
    -  layout()方法很容易理解：
       -  首先通过调用setFrame()方法来对4个成员变量（l, t, r, b）赋值。
       -  然后回调onLayout()方法。
       -  最后回调所有注册过的listener的onLayoutChange()方法。
    -  对于View类来说，onLayout()只是一个空实现，一般情况下我们也不需要重写该方法。

<br>　　接着我们来看下`ViewGroup.java`中`layout()`和`onLayout()`的源码：
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
       -  若当前ViewGroup未添加LayoutTransition动画，或者LayoutTransition动画此刻并未运行，那么调用super.layout(l, t, r, b)。
       -  否则将mLayoutCalledWhileSuppressed设置为true，等待动画完成时再调用requestLayout()。
    -  除此之外，还有两个地方需要注意：
       -  layout()方法增加了final关键字，这意味着它的所有子类无法重写layout()方法。
       -  onLayout()方法使用abstract关键字修饰了，这意味着它的所有子类必须重写此方法。


<br>　　虽然知道了测量之后会调用`layout()`方法，但是`layout()`中的4个参数`l, t, r, b`如何来确定呢？ 我们来看下`LinearLayout`的`layout`过程：
``` android
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    // 依据方向来调用不同的方法进行layout。
    if (mOrientation == VERTICAL) {
        layoutVertical(l, t, r, b);
    } else {
        layoutHorizontal(l, t, r, b);
    }
}

void layoutVertical(int left, int top, int right, int bottom) {    
    // 此处省略一些对我们没用的代码 ……
    int childTop;
    int childLeft;
    // 此处省略一些对我们没用的代码 ……
    for (int i = 0; i < count; i++) {
        final View child = getVirtualChildAt(i);
        if (child == null) {
            childTop += measureNullChild(i);
        } else if (child.getVisibility() != GONE) {
            // 获取到我们之前测量出来的尺寸。
            final int childWidth = child.getMeasuredWidth();
            final int childHeight = child.getMeasuredHeight();
            // 此处省略一些对我们没用的代码 ……
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
    -  从第25行代码可以看出，LinearLayout的子View最终的显示的宽和高，是由该子View的measure过程的结果来决定的。
    -  因此measure过程的意义就是为layout过程提供视图显示范围的参考值。

<br><br><br><br>


<br>**本章参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)


<br><br>