title: UI篇　第八章 自定义控件（一）
date: 2015-4-29 11:41:12
categories: android
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
public class MyView extends View {

    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }

    // 当通过XML标签来创建View对象时，调用此方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    // 若当前View是一个部件，则View(Contex, AttributeSet)构造方法执行完毕后会立刻调用它的onFinishInflate()方法。
    // 若它是一个布局，则将在所有子View的onFinishInflate()方法都调用完成后，才会调用它的onFinishInflate()方法。
    protected void onFinishInflate() {
        super.onFinishInflate();
        //   一个比较常见的应用场景是：
        //   你自定义了一个ViewGroup，它支持在XML文件中使用，这就不可避免的在它的标签里包含其它子标签。
        //   如果你想在代码中获取到它的子标签的引用，那么就应该在这个方法里写，而不是在构造方法里。
        //   这是因为，当ViewGroup的此方法被调用时，意味着它所包含的所有子控件也都加载完了（只是加载完毕，宽高什么的都没测量）。 
        //   比如：  ImageView img = findViewById(R.id.img); 就可以获取XML中当前ViewGroup标签下的id为img的子标签的引用。
    }
}
```
    语句解释：
    -  在View类中没有提供public的无参的构造器，因此在其所有的子类中都必须显式的调用其一个有参的构造器。

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

//  参数 changed 表示当前ViewGroup的尺寸或者位置是否发生了改变，也就是说ViewGroup的尺寸和位置没有发生变化时，此方法也有可能被调用。
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

<br>
#### 绘画阶段 ####
　　布局阶段执行完毕后，框架就会调用根节点的`draw()`方法开始绘制`View树`。但是每次绘图时，并不会重新绘制整个`View树`中的所有`View`，而只会重新绘制那些`“需要重绘”`的`View`，`View`类内部变量包含了一个标志位`DRAWN`，当该视图需要重绘时，就会为该`View`添加该标志位。

<br>　　通过查看源码可以知道，View类的绘制流程由六步构成：

	-  第一，绘制当前View的背景。
	-  第二，如果有必要，则为稍后绘制渐变效果做一些准备操作(大多数情况下，不需要)。
	-  第三，调用onDraw()方法绘制视图本身。
	   -  View类的onDraw()方法是空实现，ViewGroup类没有重写此方法。
	-  第四，调用dispatchDraw()方法绘制子视图。
	   -  View类的dispatchDraw()方法是空实现，对于不包含子View的控件来说不需要重写此方法。
	   -  ViewGroup类已经为我们重写了dispatchDraw()的功能实现，因此ViewGroup的子类一般不需要重写该方法。
	-  第五，如果第二步被执行了，那么第五步也会被执行。第五步用来绘制渐变效果以及绘制渐变效果之后的一些收尾工作。
	-  第六，绘制滚动条。
	   -  在Android中不管是Button还是TextView，任何一个视图都是有滚动条的，只是一般情况下我们都没有让它显示出来而已。

　　总而言之，每一个具体的`View`都应该重写`onDraw()`方法，并且不论是`View`还是`ViewGroup`的子类，一般不需要重写`dispatchDraw()`方法。

　　我们现在知道了，View是不会帮我们绘制内容部分的，因此需要每个`View`根据想要展示的内容来自行绘制。如果你去观察`TextView`、`ImageView`等类的源码，你会发现它们都有重写`onDraw()`这个方法，并且在里面执行了相当不少的绘制逻辑。绘制的方式主要是借助`Canvas`这个类，它会作为参数传入到`onDraw()`方法中，供给每个视图使用。
　　`Canvas`这个类的用法非常丰富，基本可以把它当成一块画布，在上面绘制任意的东西，那么我们就来尝试一下吧。

<br>　　范例1：初步使用画笔和画布。
``` android
public class MyView extends View {
    private Paint mPaint;
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
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
    <com.example.viewtest.MyView 
        android:layout_width="200dp"
        android:layout_height="100dp" />
</LinearLayout>
```
    语句解释：
    -  Paint表示一个画笔，Canvas表示一个画布。 
    -  我们既可以调用Paint类提供的各种方法，设置画笔的颜色等，也可以调用Canvas类提供的方法，对画布进行缩放、平移等操作。这两个类的详细用法后面会具体介绍。

　　运行效果如下图所示：

<center>
![](http://img.blog.csdn.net/20131223234856718?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ3VvbGluX2Jsb2c=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)
</center>

<br>**视图重绘**
　　虽然视图会在`Activity`加载完成之后自动绘制到屏幕上，但是我们完全有理由在与`Activity`进行交互的时候要求`动态更新视图`，比如改变视图的状态、以及显示或隐藏某个控件等。那在这个时候，之前绘制出的视图其实就已经过期了，此时我们就应该对视图进行重绘。

　　调用视图的`setVisibility()`、`setEnabled()`、`setSelected()`等方法时都会导致视图重绘，而如果我们想要手动地强制让视图进行重绘，可以调用`invalidate()`方法来实现。当然了，`setVisibility()`、`setEnabled()`、`setSelected()`等方法的内部其实也是通过调用`invalidate()`方法来实现的，这里的重绘是指谁请求`invalidate()`方法，就绘制该视图(`View`的话只绘制该`View`，`ViewGroup`则绘制整个`ViewGroup`)。

<br>　　如果你需要`定时重绘`，那么你可以使用`postInvalidateDelayed(long delayMilliseconds)`方法，当倒计时结束后，该方法会有如下判断：

	-  若调用该方法的View依然显示在屏幕中，则该方法直接去调用invalidate()方法执行重绘。
	-  若调用该方法的View已经不显示了，则这个重绘任务会被挂起，等到该View再次显示时，才会触发重绘。
　　比如，对于一个计时器`View`来说，每秒钟都需要重绘一次，如果通过开启`Thread`来定时调用`invalidate()`方法来实现计时的话，有两个缺点：

	-  第一，开启Thread类需要消耗一定资源。
	-  第二，若计时器View当前不再屏幕中（比如用户把App切换到后台了），那么线程仍然在跑，View仍然是每秒钟都重绘一次，浪费大量资源。

<br>　　如果你不需要`定时重绘`，那么最好也去使用`postInvalidate()`方法，当`View`不再显示时，它同样不会立刻执行重绘操作，它的源码为：
``` android
public void postInvalidate() {
    postInvalidateDelayed(0);
}
```

<br>　　提示：`View`的其它阶段所涉及的方法暂时先放一放，主要是因为它们不常用，等用到的时候再去研究吧。

<br>
### 其它常用方法 ###

<br>**定位**
　　`View`的几何形状是`矩形`的，视图的`位置`使用`左上坐标系`表示，`尺寸`由`宽和高`表示，位置和尺寸以`像素`为单位。我们可以通过`getLeft()`和`getTop()`函数取得视图的位置：

	-  前者返回代表视图的矩形的左侧位置（横坐标X）。
	-  后者返回代表视图的矩形的顶部位置（纵坐标Y）。
　　这些方法返回视图相对于其父视图的位置，例如`getLeft()`返回`20`，代表视图在其直接父视图左侧边的右侧`20`像素的位置。

　　另外，为了避免不必要的计算，提供了一些便利的方法，它们是`getRight()`和`getBottom()`。这些方法返回代表视图的矩形的右侧和底边的坐标。例如，调用`getRight()`比调用`getLeft() + getWidth()`要简单。

<br>**大小、内边距和外边距**
　　视图的大小是由`宽度`和`高度`表示的，视图实际拥有`两对宽度和高度`的值。

	-  第一对被称作测量宽度和测量高度。这两个尺寸定义了视图在其父视图中需要的大小，测量的尺寸可以通过调用getMeasuredWidth()和getMeasuredHeight()获得。
	-  第二对被简单的称作宽度和高度，有时称作绘制宽度和绘制高度。这两个尺寸定义了视图绘制时和布局之后在屏幕上的实际大小。这些值可以（但不是必须）与测量宽度和测量高度不同。宽度和高度可以通过调用getWidth()和getHeight()获得。

　　测量视图大小时，也将它的`内边距(padding)`计算在内，内边距表示视图内部左上右下部的空白。例如，左内边距为2，表示将视图内容从左边向右移动两个像素。
　　内边距可以通过`setPadding(int, int, int, int)`方法设置，通过`getPaddingLeft()`、`getPaddingTop()`、`getPaddingRight()`、 `getPaddingBottom()`方法来取值。

## 开始自定义 ##
　　在绘制`View`时会涉及到两个类：`Paint`和`Canvas`，这两个类分别代表`画笔`和`画布`。
　　我们需要调用`Canvas`对象所提供的方法进行绘制，其中`Canvas`对象由框架创建，在View的`onDraw()`方法被调用时，系统会同时将`Canvas`对象以形参的形式传递给该方法。

　　`Canvas`对象提供的绘制图形的方法都是以`draw`开头的，我们可以查看`API`：

<center>
![](/img/android/android_b08_03.jpg)
</center>

　　从上面方法的名字看来我们可以知道`Canvas`可以绘制的对象有：弧线(`arcs`)、填充颜色(`argb`和`color`)、 `Bitmap`、圆(`circle`和`oval`)、点(`point`)、线(`line`)、矩形(`Rect`)、图片(`Picture`)、圆角矩形 (`RoundRect`)、文本(`text`)、顶点(`Vertices`)、路径(`path`)。

　　通过组合这些对象我们可以画出一些简单有趣的界面出来，但是光有这些功能还是不够的，如果我们要画一个仪表盘(数字围绕显示在一个圆圈中)呢？幸好Android还提供了一些对`Canvas`位置转换的方法：`rorate`、`scale`、`translate`、`skew`等，而且它允许你通过获得它的转换矩阵对象(`getMatrix`方法，不知道什么是转换矩阵？在[《媒体篇　第二章 图片》](http://cutler.github.io/2015/02/06/android-E02/)中有介绍) 直接操作它。
　　这些操作就像是虽然你的笔还是原来的地方画，但是画布旋转或者移动了，所以你画的东西的方位就产生变化。

　　为了方便一些转换操作，`Canvas`还提供了保存和回滚属性的方法(`save`和`restore`)，比如你可以先保存目前画纸的位置(`save`)，然后旋转`90`度，向下移动`100`像素后画一些图形，画完后调用`restore`方法返回到刚才保存的位置。

<br>
### 画布和画笔 ###
　　简单的说，我们需要使用`Canvas`所提供的方法进行绘制，但绘制的同时还要传递给那些方法一个`Paint`对象，`Paint`对象用来设置画笔的颜色等参数。

<br>　　范例1：绘制文字。
``` android
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    setMeasuredDimension(1500, 1500);
}

@Override
protected void onDraw(Canvas canvas) {
    // 定义一个画笔对象。
    Paint p = new Paint();
    // 修改画笔的颜色，下面使用的是android.graphics.Color类。
    p.setColor(Color.RED);
    // 字体大小
    p.setTextSize(70);
    // 字体下面加下划线
    p.setUnderlineText(true);
    // 从(10,10)的位置开始，绘制一行文本。
    canvas.drawText("Hello Wrold!", 10, 100, p);
    // 加粗字体。 如果字体的型号比较小，那么加粗的效果可能就不是很明显。
    p.setFakeBoldText(true);
    // 给字体加上删除线。
    p.setStrikeThruText(true);
    canvas.drawText("Hello Wrold2!", 10, 300, p);
    // 设置文本在水平方向上的倾斜比例，负数向右倾斜，正数向左倾斜。
    p.setTextSkewX(-0.3f);
    // 设置文本的对齐方法，以坐标(10,10)为例： 
    //   Paint.Align.LEFT : 将文本的左边放到(10,500)的位置，默认设置。
    //   Paint.Align.CENTER : 将文本的中心点放到(10,500)的位置。
    //   Paint.Align.RIGHT : 将文本的右边放到(10,500)的位置。
    p.setTextAlign(Paint.Align.LEFT);
    canvas.drawText("Hello Wrold3!", 10, 500, p);
    //按照既定点 绘制文本内容
    canvas.drawPosText("Android", new float[]{
        10,610, //第一个字母在坐标10,610
        120,640, //第二个字母在坐标120,640
        230,670, //....
        340,700,
        450,730,
        560,760,
        670,790,
    }, p);
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
    -  setStyle()方法设置当前画笔在画图(圆形、矩形等)时要使用的样式，常用取值： 
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
``` android
public class MyView extends TextView {

    // 此处省略构造方法和onMeasure()方法。

    @Override
    protected void onDraw(Canvas canvas) {
        Paint p = new Paint();
        p.setColor(Color.RED);
        canvas.drawText("AAAAAAAAAAAAAA", 100, 100, mPaint);
        p.setColor(Color.GREEN);

        // 保存当前画布的参数。
        canvas.save();
        // 让画布从当前位置开始，在水平和垂直方向上，都平移100像素。
        canvas.translate(100,100);
        // 让画布的原点旋转90度。即当前已经存在于画布上的东西不会有任何改变，但接下来所绘制的内容，会相对于新的原点进行绘制。
        canvas.rotate(90);
        canvas.drawText("1BBBBBBBBBBBBBB2", 0, 0, mPaint);
        canvas.restore();

        p.setColor(Color.BLUE);
        canvas.save();
        // 让画布在水平和垂直方向上，都放大3倍。
        canvas.scale(3,3);
        // 让画布的原点旋转30度。 
        canvas.rotate(30);
        // 绘制一个矩形。
        canvas.drawRect(new Rect(100,100,130,130), p);
        // 还原两个画布。
        canvas.restore();

        p.setColor(Color.BLACK);
        // 绘制一个矩形。
        canvas.drawRect(new Rect(140,140,170,170), p);
    }
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

<br>　　接下来我们综合上面所学的知识，自定义一个钟表控件，程序运行的效果如下：

<center>
![钟表控件运行效果示意图](/img/android/android_b08_03.png)
</center>

　　完整代码如下：
``` android
/**
 * Created by cutler on 2015/5/4.
 */
public class MyView extends TextView {

    private Paint mMainPaint;
    private int radius = 200;

    public MyView(Context context) {
        super(context);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mMainPaint = new Paint();
        mMainPaint.setTextSize(30);
        mMainPaint.setStrokeWidth(1);
        mMainPaint.setAntiAlias(true);
        mMainPaint.setColor(Color.BLACK);
        mMainPaint.setStyle(Paint.Style.STROKE);
        mMainPaint.setTextAlign(Paint.Align.CENTER);
    }

    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        setMeasuredDimension(getMeasuredLength(widthMeasureSpec, true), getMeasuredLength(heightMeasureSpec, false));
    }

    private int getMeasuredLength(int length, boolean isWidth) {
        int specMode = MeasureSpec.getMode(length);
        int specSize = MeasureSpec.getSize(length);
        int size;
        if (specMode == MeasureSpec.EXACTLY) {
            size = specSize;
            radius = size / 2;
        } else {
            int padding = isWidth ? getPaddingLeft() + getPaddingRight(): getPaddingTop() + getPaddingBottom();
            size = padding + radius;
            if (specMode == MeasureSpec.AT_MOST) {
                size = Math.min(size, specSize);
            }
        }
        return size;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        // 将原点移动到中心点，绘制表盘。
        canvas.translate(radius, radius);
        canvas.drawCircle(0, 0, radius, mMainPaint);
        // 绘制表的刻度
        int count = 60;
        int unitOffsetX = radius / 90;
        for(int i=0 ; i <count ; i++){
            int degree = 360 / count * i;
            canvas.save();
            canvas.rotate(degree, 0f, 0f);
            canvas.drawLine(0, -radius + (i % 5 == 0 ? 12 : 5), 0, -radius, mMainPaint);
            canvas.restore();
            // 绘制表盘上的数字。
            if (i % 5 == 0) {
                int x = degree % 90 * unitOffsetX;
                int y = 0;
                if (degree >= 0 && degree <= 90) {
                    x += 25;
                    y = -radius + x - 20;
                    if (degree == 0) {
                        x = 0;
                        y = -radius + 40;
                    } else if (degree == 90) {
                        x = radius - 30;
                        y = 10;
                    }
                } else if (degree > 90 && degree <= 180) {
                    y = x + 35;
                    x = radius - x + 5;
                    if (degree == 180) {
                        y = radius - 20;
                        x = 0;
                    }
                } else if (degree > 180 && degree <= 270) {
                    x = -x - 25;
                    y = radius + x + 35;
                    if (degree == 270) {
                        x = -radius + 30;
                        y = 10;
                    }
                } else if (degree > 270 && degree <= 360) {
                    x = -radius + x;
                    y = -(radius + x) - 15;
                }
                canvas.drawText(String.valueOf(i / 5 == 0 ? 12 : i / 5), x, y, mMainPaint);
            }
        }
        // 绘制指针尾部的圆点。
        canvas.drawCircle(0, 0, 7, mMainPaint);
        // 绘制时针、分针、秒针。
        drawLine(0, 10, 0, -70, mMainPaint, canvas, Calendar.HOUR);
        drawLine(0, 10, 0, -90, mMainPaint, canvas, Calendar.MINUTE);
        drawLine(0, 10, 0, -120, mMainPaint, canvas, Calendar.SECOND);
        // 1秒后进行重绘。
        postInvalidateDelayed(1000);
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
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:layout_height="match_parent">

    <com.example.cutler.smstest.MyView
        android:layout_width="133dp"
        android:layout_height="133dp" />

</LinearLayout>
```
    语句解释：
    -  这个控件的尺寸只有在被设置为133dp时，显示的效果才算完美。 
    -  由于笔者本人也是边学边用，因此暂时没有好的方法让这个控件在任何尺寸下都完美展示，所以现在先让它存留一些缺陷，来日方长，日后再说。

<br>
### Path ###
　　当我们想在画布上绘制任意多边形时，就可以通过指定`Path`对象来实现。可以把`Path`对象看作是一个点集，在该点击中规划了多边形的路径信息。当然也可以使用`drawLines`方法来实现多边形，但是`drawPath`方法更为灵活、方便。

<br>　　范例1：平行四边形与棒棒糖。
``` android
public class MyView extends TextView {

    // 此处省略构造方法和onMeasure()方法。

    @Override
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
}
```
    语句解释：
    -  Path.Direction.CCW 表示逆时针，Path.Direction.CW 表示顺时针。

<br>　　范例2：`Path`与文字。
``` android
public class MyView extends TextView {

    // 此处省略构造方法和onMeasure()方法。

    @Override
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
}
```
    语句解释：
    -  如果文本的长度超出了Path的长度，那么多出的文本将不会被显示。

<br>
### Xfermodes ###
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
/**
 * Created by cutler on 2015/5/13.
 */
class MyView extends ImageView {

    public MyView(Context context) {
        super(context);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);
        // 用户的头像
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
        canvas.drawBitmap(mDstB, 200, 200, paint);
    }
}

class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ImageView imageView = new MyView(this);
        imageView.setImageResource(R.drawable.icon);
        setContentView(imageView);
    }
}
```
<br>
### 控件的属性 ###
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
    -  <declare-styleable>标签的name属性用来指出当前属性集合的名称，在此标签内部所定义的属性都将被放到这个属性集合中去。
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
    -  以xmlns:为开头的代码，就是在定义命名空间，本范例中定义了android和cutler两个命名控件。
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

<br>　　至此，本节讲解了自定义控件的一些基础知识，但在实际开发中仅仅掌握它们是远远不够的，笔者由于精力有限，还有一些技术没法一次性研究透，比如`clipRect`、`Layers`等，因此就不写出来了，过段时间再继续搞它们。


<br>**本节参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android视图绘制流程完全解析，带你一步步深入了解View(二)](http://blog.csdn.net/guolin_blog/article/details/16330267)
- [Android视图状态及重绘流程分析，带你一步步深入了解View(三)](http://blog.csdn.net/guolin_blog/article/details/17045157)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)
- [Android Canvas绘图详解（图文）](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2012/1212/703.html)
- [android.graphics包中的一些类的使用](http://yuanzhifei89.iteye.com/blog/1136651)
- [Android 完美实现图片圆角和圆形（对实现进行分析）](http://blog.csdn.net/lmj623565791/article/details/24555655)
- [Android Canvas绘制图片层叠处理方式porterduff xfermode](http://blog.csdn.net/shichaosong/article/details/21239221)




<br><br>