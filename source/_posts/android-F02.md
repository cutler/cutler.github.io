title: 进阶篇　第二章 屏幕适配
date: 2015-3-12 16:44:50
categories: Android开发 - 青铜
---
　　`Android`的屏幕适配一直以来都在折磨着我们这些开发者，本篇文章以`Google`的官方文档为基础，全面而深入的讲解了`Android`屏幕适配的原因、重要概念、解决方案及最佳实践。

<br>　　本文转载自[《Android屏幕适配全攻略(最权威的官方适配指导)》](http://blog.csdn.net/zhaokaiqiang1992/article/details/45419023)，内容有删改，笔者在此感谢该博主的无私分享。
# 第一节 为什么要屏幕适配 #
　　在我们学习如何进行屏幕适配之前，我们需要先了解下为什么`Android`需要进行屏幕适配。

<br>　　由于`Android`系统的开放性，任何用户、开发者、`OEM`厂商、运营商都可以对`Android`进行定制，修改成他们想要的样子。但是这种“碎片化”到底到达什么程度呢？
　　`OpenSignalMaps`（以下简称`OSM`）发布的`Android`碎片化报告，统计数据表明：

	-  2012年，支持Android的设备共有3997种。
	-  2013年，支持Android的设备共有11868种。
	-  2014年，支持Android的设备共有18796种。

<br>　　下面这张图片所显示的内容足以充分说明当今`Android`系统碎片化问题的严重性，因为该图片中的每一个矩形都代表着一种`Android`设备。

<center>
![](http://img1.gtimg.com/tech/pics/hv1/135/67/1688/109779420.png)
</center>

　　而随着支持`Android`系统的设备(手机、平板、电视、手表)的增多，`设备碎片化`、`品牌碎片化`、`系统碎片化`、`传感器碎片化`和`屏幕碎片化`的程度也在不断地加深。而我们今天要探讨的，则是对我们开发影响比较大的——屏幕的碎片化。

　　详细的统计数据请到[ 这里 ](http://opensignal.com/reports/2014/android-fragmentation/)查看。

　　现在大家应该很清楚为什么要对`Android`的屏幕进行适配了吧？屏幕尺寸这么多，为了让我们开发的程序能够比较美观的显示在不同尺寸、分辨率、像素密度(这些概念会在下面详细讲解)的设备上，那就要在开发的过程中进行处理，至于如何去进行处理，这就是我们今天的主题了。

# 第二节 适配哪些设备？ #
　　但是在开始进入主题之前，我们再来探讨一件事情，那就是`Android`设备的屏幕尺寸，从几寸的智能手机，到`10`寸的平板电脑，再到几十寸的数字电视，我们应该适配哪些设备呢？

　　其实这个问题不应该这么考虑，因为对于具有相同像素密度的设备来说，像素越高，尺寸就越大，所以我们可以换个思路，将问题从单纯的尺寸大小转换到像素大小和像素密度的角度来。

　　下图是`2014`年初，友盟统计的占比`5%`以上的`6`个主流分辨率，可以看出，占比最高的是`480*800`（`宽*高`），`320*480`的设备竟然也占据了很大比例，但是和`2015`年的数据相比较，中低分辨率(`320*480`、`480*800`)的比例在减少，而中高分辨率的比例则在不断地增加。虽然每个分辨率所占的比例在变化，但是总的趋势没变，还是这六种，只是分辨率在不断地提高。

<center>
![](http://i1.tietuku.com/ef60ff2cbf9c9a5f.png)
</center>

　　截止至2016年2月14日，我们最低只要需要适配480*800分辨率，就可以在大部分的手机上正常运行了。当然了，这只是手机的适配，对于平板设备(电视也可以看做是平板)，我们还需要一些其他的处理。

# 第三节 重要概念 #
　　到目前为止，我们已经弄清楚了`Android`开发为什么要进行适配，以及我们应该适配哪些对象，接下来，先要学习几个重要的概念。

<br>**屏幕尺寸**
　　屏幕尺寸指屏幕（左上角到右下角）的对角线的长度，单位是英寸（`1`英寸=`2.54`厘米）。比如常见的屏幕尺寸有`2.4`、`3.5`、`5.0`等。

<br>**屏幕分辨率**
　　屏幕分辨率是指屏幕上的像素总数，即`屏幕水平方向的像素数*屏幕垂直方向的像素数`。单位是`px`，`1px`就是指`1`个像素点。如`480*800`。

<br>**屏幕像素密度**
　　屏幕像素密度是指每英寸上的像素点数，单位是`dpi`，即`“Dots Per Inch”`的缩写。屏幕像素密度与屏幕尺寸和屏幕分辨率有关，在单一变化条件下，屏幕尺寸越小、分辨率越高，它的像素密度越大，反之越小。

<br>**px、dp、dip、sp**
　　`px`(像素)我们应该是比较熟悉的，前面的分辨率就是用的像素为单位，大多数情况下，比如`UI`设计、`Android`原生`API`都会以`px`作为统一的计量单位，像是获取屏幕宽高等。

　　`dip`和`dp`是一个意思，都是`Density Independent Pixels`的缩写，即密度无关像素，上面我们说过，`dpi`是屏幕像素密度，假如一英寸里面有`160`个像素，这个屏幕的像素密度就是`160dpi`。那么`dp`和`px`如何换算呢？
　　在`Android`中，规定以`160dpi`（`mdpi`）为基准，`1dip=1px`，如果密度是`320dpi`，则`1dip=2px`，以此类推。

<center>
![dp与px对比图](/img/android/android_o01_01.png)
</center>

　　我们可以通过`context.getResources().getDisplayMetrics().density`来在获取当前设备的`dppx`参数，即`1dp=?px`，然后可以写出如下的代码让实现`dp`和`px`之间的转换：
``` android
// 从dp转成为px
public static int dip2px(Context context, float dpValue) {
    float dppx = context.getResources().getDisplayMetrics().density;
    // 如果 dpValue * dppx 的结果的小数为是0.5以上，那么此处的+0.5就可以让结果进位，即实现四舍五入的功能。
    // dp转px的公式为：px = dp * (dpi / 160)，其中“(dpi / 160)”已经由系统帮我们计算好了，它就是dppx。
    return (int) (dpValue * dppx + 0.5f);
}

// 从px转成为dp
public static int px2dip(Context context, float pxValue) {
    float dppx = context.getResources().getDisplayMetrics().density;
    return (int) (pxValue / dppx + 0.5f);
}
```

<br>　　`sp`，即`scale-independent pixels`，与`dp`类似，但是可以根据文字大小首选项进行放缩，是设置字体大小的御用单位。

<br>**用 dp 而不用 px **
　　假如我们使用`px`为单位来画一条长度为`320`的横线，程序分别运行在`480*800`和`320*480`的手机上时，虽然线的长度都是`320px`，但是线的视觉效果却不一样：线在`480*800`上占据屏幕`2/3`的宽度，在`320*480`上占满了全屏。
　　但是如果使用`dp`为单位画一条`160dp`的横线，无论你在`320*480`还`480*800`的设备上，线都是一样长（当屏幕尺寸不变时）。 

　　也就是说：

	-  使用px作为单位的特点： 
	   -  第一，线最终绘制到屏幕上的长度是固定的。即设置线的长度为320px，那么屏幕上最终就会绘制320px长度的线。
	   -  第二，线在高分辨率的设备上会显小，反之显大。
	-  使用dp作为单位的特点：
	   -  第一，线最终绘制到屏幕上的长度是变化的，即随着设备的屏幕密度而变化。即100dp在160dpi的设备上为100px，在320dpi的设备上为200px。
	   -  第二，若两个设备的屏幕尺寸相同，那么不论二者的分辨率是否相同，100dp长的线在两个设备中看起来是一样长的，虽然它们实际占有的px是不同的。

<br>　　正因为`dp`是变长的单位，且在相同尺寸的设备中显示的效果是一样的，所以在`Android`开发中，写布局的时候都使用`dp`而不是`px`。

<br>**dpi 的自动归一**
　　值得注意的是，`px = dp * (dpi / 160)`中的`dpi`是归一化后的`dpi`，而不是手机的实际`dpi`值。目前常见的`dpi`有：

	-  ldpi (low)                       ~ 120dpi
	-  mdpi (medium)                    ~ 160dpi
	-  hdpi (high)                      ~ 240dpi
	-  xhdpi (extra-high)               ~ 320dpi
	-  xxhdpi (extra-extra-high)        ~ 480dpi
	-  xxxhdpi (extra-extra-extra-high) ~ 640dpi

　　比如三星`Galaxy S5`的参数为`5.1寸、1920×1080、432dpi、3dppx`，假设我现在创建一个宽度为`360dp`的背景是红色的`TextView`，那么它换算成`px`后的宽度应该是`360 * (432 / 160) = 972`像素，按道理说`TextView`应该填充不满整个屏幕的宽度，但程序运行时却发现它填充满了。
　　事实上`Android`系统并没有拿`432`来计算，而是将`S5`视作`xxhdpi`设备，并使用`480dpi`来计算，所以最终是：`360 * (480 / 160) = 1080`像素，刚好满屏。 

<br>**drawable 的 mdpi、hdpi、xdpi、xxdpi**
　　`Android`中的`drawable`文件夹后面可以跟随一些修饰符，如：`hdpi`、`mdpi`、`ldpi`，这三个文件夹分别放置高清分辨率、中分辨率、低分辨率的资源文件。
　　当前你的应用在`hdpi`的手机上运行，假设代码中加载一张`“icon.png”`的图，那么系统首先会去`drawable-hdpi`文件夹下去找这张图，一旦找不到，系统会再到其他`drawable`下寻找，再假设你其实把这张`“icon.png”`放在了`drawable-mdpi`中，那么系统会默认把这张图片放大；反之一样，如果你在`ldpi`中运行加载一张图片的话，一旦你将图片放入高清的`drawable-dpi`中，那么系统默认缩小这张图。

　　系统为什么要这么做呢？这是因为：
　　假设我们现在使用`ImageView`来显示一张`180*180`尺寸的图片，`ImageView`的宽高为`wrap_content`。
　　当程序运行在`160dpi`的手机上时，图片可以按照正常尺寸(`180*180`)显示，但当运行在`320dpi`的手机上时，虽然图片仍然是`180*180`像素，但是从显示效果上看就比前者缩小了一半。
　　因此，`Android`为了让图片能适应当前设备，默认提供了一个自动缩放图片的机制。

<br>　　举个例子来说，我们已经知道了三星`Galaxy S5`被视为`480dpi`以及`xxhdpi`，那么此时找一张`180*180`的图，把它复制三份并改名，然后放在下面三个目录：

	-  res\drawable\icon1.jpg
	-  res\drawable-xhdpi\icon2.jpg
	-  res\drawable-xxhdpi\icon3.jpg

<br>　　范例1：布局文件`activity_main.xml`。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/rootView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <ImageView
        android:id="@+id/m1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/icon1" />

    <ImageView
        android:id="@+id/m2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/icon2" />

    <ImageView
        android:id="@+id/m3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/icon3" />
</LinearLayout>

```
    语句解释：
    -  创建垂直排列的三个ImageView控件，它们的尺寸都是wrap_content。

<br>　　范例2：`MainActivity`。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        printSize((ImageView) findViewById(R.id.m1));   //  输出：width = 540, height = 540
        printSize((ImageView) findViewById(R.id.m2));   //  输出：width = 270, height = 270
        printSize((ImageView) findViewById(R.id.m3));   //  输出：width = 180, height = 180
    }

    void printSize(ImageView img){
        BitmapDrawable d = (BitmapDrawable) img.getDrawable();
        System.out.println("width = "+d.getIntrinsicWidth()+", height = "+d.getIntrinsicHeight());
    }

}
```
    语句解释：
    -  首先，我们在Galaxy S5上面运行这些代码，手机的屏幕密度是xxhdpi。
    -  然后，m1所显示的图片icon1被放到了res\drawable目录。
       -  在Androi中，“drawable”专门用来存放默认的资源，系统认为该目录下的资源都是基于normal屏幕大小和mdpi密度设计的。
       -  由于当前的设备是xxhdpi密度的，但是图却是从drawable目录下找到的，为了显示统一系统会将图片放大3倍，导致图片的宽度和高度都是540。
    -  接着，同样的道理，m2所显示的图片icon2被放到了res\drawable-xhdpi目录。
       -  系统会从xhdpi目录下找到的图片，宽高放大1.5倍。
    -  最后，你可能会疑问系统是怎么决定应该放大或缩小多少倍的？ 后面就会详细说明。

<br>　　事实上，`Android`自动缩放图片的机制有一个前提：系统只有在`drawable-当前屏幕密度`目录中没找到想要的图片，但是在其它目录下却找到了时，才会执行缩放。
　　即如果系统在`drawable-当前屏幕密度`目录中找到了它想要的图片，那么就会把图片原样的显示出来，绝不会执行任何缩放。

　　因此如果不想让系统自动帮我们缩放图片，我们可以自己来提供多套图片：

	-  第一，在res下创建若干目录，比如ldpi、mdpi、hdpi、xhdpi、xxhdpi。
	-  第二，在这些目录下放置不同尺寸的图片。

<center>
![](/img/android/android_o01_02.png)
</center>

　　上图表明，如果你在`mdpi`密度下有一张`48*48`尺寸的图，那么你在`hdpi`下的图的尺寸应该是`mdpi`的`1.5`倍(`72*72`)，在`xhdpi`下图片的尺寸应是`mdpi`的`2`倍(`96x96`)，依此类推。

<br>**本节参考阅读：**
- [【Android游戏开发二十七】讲解游戏开发与项目下的hdpi 、mdpi与ldpi资源文件夹以及游戏高清版本的设置](http://www.himigame.com/android-game/389.html)

# 第四节 开始适配 #
　　我们已经知道屏幕适配要考虑很多问题，如`屏幕尺寸（手机/平板/电视）`、`屏幕密度`等，因而也就不可能只通过一种方法来实现所有的适配任务，也就是说我们需要针对不同的问题来使用不同的适配方法。
　　本节将介绍一些常见的问题以及对应的解决方案。
## 手机适配 ##
### 布局适配 ###
<br>　　第一，对于布局文件里的`View`来说，能使用`wrap_content`和`match_parent`来设置尺寸，就尽量不写死尺寸，这样可让布局正确适应各种`屏幕尺寸`和`屏幕方向`。

	-  wrap_content：系统就会将视图的宽度或高度设置成所需的最小尺寸以适应视图中的内容。
	-  match_parent：在低于API别8的级别中称为“fill_parent”，则会展开组件以匹配其父视图的尺寸。

<br>　　下面是一段示例代码：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <LinearLayout android:layout_width="match_parent"
        android:id="@+id/linearLayout1"  
        android:gravity="center"
        android:layout_height="50dp">
        <ImageView android:id="@+id/imageView1"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:src="@drawable/logo"
            android:paddingRight="30dp"
            android:layout_gravity="left"
            android:layout_weight="0" />
        <View android:layout_height="wrap_content"
            android:id="@+id/view1"
            android:layout_width="wrap_content"
            android:layout_weight="1" />
        <Button android:id="@+id/categorybutton"
            android:background="@drawable/button_bg"
            android:layout_height="match_parent"
            android:layout_weight="0"
            android:layout_width="120dp"
            style="@style/CategoryButtonStyle"/>
    </LinearLayout>

    <fragment android:id="@+id/headlines"
        android:layout_height="fill_parent"
        android:name="com.example.android.newsreader.HeadlinesFragment"
        android:layout_width="match_parent" />
</LinearLayout>
```

<br>　　下图是在横纵屏切换的时候的显示效果，我们可以看到这样可以很好的适配屏幕尺寸的变化。

<center>
![](http://i1.tietuku.com/dfd108386cb27572.png)
</center>

<br>　　第二，`LinearLayout`的子控件可以使用`android:layout_weight`属性来按照比例对界面进行分配，完成一些特殊的需求。

　　看下面的例子，我们在布局中这样设置我们的界面：

<center>
![](http://i1.tietuku.com/0aa7782577bca94d.png)
</center>

<br>　　我们在布局里面设置为线性布局，横向排列，然后放置两个宽度为`0dp`的按钮，分别设置`weight`为`1`和`2`，在效果图中，我们可以看到两个按钮按照`1：2`的宽度比例正常排列，`Button1`的宽度就是`1/(1+2) = 1/3`，`Button2`的宽度则是`2/(1+2) = 2/3`。

<br>　　第三，使用相对布局，禁用绝对布局。
　　在开发中，我们大部分时候使用的都是`线性布局`、`相对布局`和`帧布局`，`绝对布局`由于适配性极差，所以极少使用。如果我们需要将子视图排列出各种效果而不是一条直线，通常更合适的解决方法是使用`RelativeLayout`。

　　例如，我们可以将某个子视图对齐到屏幕左侧，同时将另一个视图对齐到屏幕右侧。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:id="@+id/label"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Type here:"/>
    <EditText
        android:id="@+id/entry"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_below="@id/label"/>
    <Button
        android:id="@+id/ok"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_below="@id/entry"
        android:layout_alignParentRight="true"
        android:layout_marginLeft="10dp"
        android:text="OK" />
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_toLeftOf="@id/ok"
        android:layout_alignTop="@id/ok"
        android:text="Cancel" />
</RelativeLayout>
```
　　在上面的代码中我们使用了相对布局，并且使用`alignXXX`等属性指定了子控件的位置，下面是这种布局方式在应对屏幕变化时的表现

<center>
![在小尺寸屏幕的显示](http://i1.tietuku.com/330dff8002435f49.png)
</center>

<center>
![在平板的大尺寸上的显示效果](http://i1.tietuku.com/984c4d4b06e1baa4.png)
</center>

　　虽然控件的大小由于屏幕尺寸的增加而发生了改变，但是我们可以看到，由于使用了相对布局，所以控件之前的位置关系并没有发生什么变化，这说明我们的适配成功了。


<br>　　第四，使用自动拉伸位图。

	-  支持各种屏幕尺寸通常意味着您的图片资源还必须能适应各种尺寸。例如，无论要应用到什么尺寸的按钮上，按钮背景都必须能适应。
	-  如果在可以更改尺寸的组件上使用了简单的图片，您很快就会发现显示效果多少有些不太理想，因为系统会在运行时平均地拉伸或收缩您的图片。解决方法为使用自动拉伸位图，这是一种格式特殊的PNG文件，其中会指明可以拉伸以及不可以拉伸的区域。
　　下图是对`.9`图的四边的含义的解释，`左上边`代表`拉伸区域`，`右下边`代表`padding`，我们可以修改`View`的`padding`属性来覆盖掉`.9`图右下边画线的效果。

<center>
![](http://img.blog.csdn.net/20150121140154047?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvemhhb2thaXFpYW5nMTk5Mg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
</center>

<br>　　第五，提供备用位图。
　　就像前面说的那样，如果不想让系统自动帮我们缩放图片，我们可以自己来提供多套图片：

	-  第一，在res下创建若干目录，比如ldpi、mdpi、hdpi、xhdpi、xxhdpi。
	-  第二，在这些目录下放置不同尺寸的图片。

　　但是还有个问题需要注意下，`.9`图放在`drawable`文件夹即可，对应分辨率的图片要正确的放在合适的文件夹，否则会造成图片拉伸等问题。

## 平板适配 ##
　　由于笔者没适配过平板，所以本节暂缓，请移步[《Android屏幕适配全攻略(最权威的官方适配指导)》](http://blog.csdn.net/zhaokaiqiang1992/article/details/45419023)。
<br><br>
