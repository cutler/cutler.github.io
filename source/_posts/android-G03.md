title: 自定义控件篇　第三章 道理我都懂，到底要怎么干？
date: 2016-1-11 17:47:58
categories: Android开发 - 倔强青铜
---
　　通过前两章的学习，我们已经对自定义控件有个大致的了解，不出意外的话，此时你应该还是不知道如何去写代码。

	-  笔者认为，之所以我们会觉得自定义控件很难，主要是因为我们知道的相关API太少，只要我们尽可能多的学习相关API，那么自定义控件就不足为惧。

　　因此，本章的任务就是如下两个：

	-  第一，尽可能多的介绍自定义控件时所用的常见API，（本章的内容会不定时更新）。
	-  第二，将前两章的理论知识融合到实践中。
	   -  理论结合实践是非常重要的，举个例子：我们都会用嘴发声，也会通过击打手臂发声，但是当我们看到芈月用嘴和手臂放屁时，还是会眼前一亮，原来还可以这么玩。
	   -  也就是说，基础知识学会之后，还要再学习如何将它们组合在一起使用。
　　千言万语汇成一句话：想创新，先模仿！

# 第一节 基础入门 #
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