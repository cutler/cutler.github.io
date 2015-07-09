title: 媒体篇　第三章 动画
date: 2015-5-15 12:29:42
categories: Android
---
　　动画是多媒体中的一个重要组成部分，我们常见的各种炫酷的特效大部分都是通过动画来实现的。

<br>　　在`Android3.0`之前，我们有两种实现动画效果的方式：帧动画 和 视图动画。

	-  帧动画(Frame Animation)通过短时间内连续播放多张图片，来达到动画的效果，和电影类似。
	-  视图动画(View Animation)通过让View对象执行平移、缩放、旋转、透明四种操作，来达到动画效果。
　　从`Android 3.0`开始，系统推出了属性动画(`property animation`)，它的功能非常强大，弥补了之前视图动画的一些缺陷，几乎是可以完全替代掉视图动画了。

<br>**视图动画的缺点**

	-  第一，视图动画提供的功能只能作用在View对象上，所以如果你想动画非View对象，你要自己来实现。 
	-  第二，视图动画系统只能动画View对象几个方面，如缩放、平移等。它没法把View的背景颜色、字体颜色、margin、padding等属性进行动态变化。
	-  第三，视图动画不是会修改View本身。虽然你的动画在屏幕上移动一个按钮后，从屏幕上来看按钮确实被移动到了新的位置，但按钮实际的位置不会改变，所以你要实现自己的逻辑来处理这个问题。

<br>　　视图动画的缺点在属性动画中完全被消除了，你可以动画任何对象的任何属性（视图和非视图），并且对象本身实际（尺寸、位置等）也是会被修改。属性动画的缺点是：在`Android3.0`中才被提出。 
　　即便如此，现在也算是到了学习属性动画的时候了，截止至`2015/05/25`，配置`Android3.0`以下版本系统的设备已经不足`6%`了，换句话说我们现在完全可以把项目的`minSdkVersion`设置为`11`了。
　　当然在`Android3.0`之前版本的系统中我们也是可以使用属性动画的，这一点在第四节将详细介绍，第三节将以`Android3.0`版本来讲解属性动画。

<br>**使用视图动画还是属性动画？**
　　在某些时候，使用视图动画可以花费更少的时间，更少的代码，因此如果视图动画完成了你需要做的，或者你现有的代码已经完成了工作，那就没有必要使用属性动画系统。

# 第一节 视图动画 #
　　虽然视图动画已经不常用了，但是我们仍然要介绍一下它们的用法。

　　在Android中实现视图动画的方式有两种：
	-  通过XML文件。在res/anim文件夹下面建立动画文件，每个动画文件对应一个xml文件。
	-  通过编写代码。直接在代码中new出一个动画对象。

<br>　　Android提供了四种视图动画：`透明`、`平移`、`旋转`、`缩放`。

<br>**透明**
　　透明(`alpha`)动画 ，可以将一个`View`从某个透明度转变为另一个透明度。

<br>　　范例1：透明动画(`alpha.xml`)。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <alpha 
      	android:fromAlpha="1.0"
     	android:toAlpha="0"
     	android:duration="5000" />
</set>
```
    语句解释：
    -  本范例通过XML文件来定义一个透明动画，必须要将动画文件放到res/anim文件夹下。
    -  动画文件必须以<set>，<objectAnimator>，<valueAnimator>三者之一作为根节点。根节点中必须定义android命名空间。
    -  使用<alpha>标签来定义一个透明动画。

    属性解释：
    -  android:fromAlpha	 控件的初始透明度。取值在0.0~1.0之间。1.0为完全不透明。
    -  android:toAlpha       动画结束时，控件的透明度。
    -  android:duration	  播放动画时持续的时间。 

<br>　　范例2：播放动画。
``` android
public class AndroidTestActivity extends Activity {
    private ImageView img;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        // 指定动画文件的资源ID ，将其从res/anim目录导入到程序中，并将其转换为一个Animation对象。
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.alpha);
        this.img.startAnimation(animation);
    } 
}
```
    语句解释：
    -  本范例是在ImageView上面播放刚才我们创建的透明动画。
 
<br>　　范例3：通过代码实现动画。
``` android
public class AndroidTestActivity extends Activity {
    private ImageView img; 
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        // 直接实例化一个AlphaAnimation对象，构造方法为：AlphaAnimation (float fromAlpha,float toAlpha)。
        Animation animation = new AlphaAnimation(1.0f,0.1f);
        // 设置动画的播放时间，单位(毫秒)。
        animation.setDuration(4000);
        // 设置控件是否定格在动画播放完成后的状态。
        animation.setFillAfter(true);
        this.img.startAnimation(animation);
    } 
}
```
    语句解释：
    -  本范例是在ImageView上面播放刚才我们创建的透明动画。

<br>**平移**
　　平移(`translate`)动画，可以将指定的View从某一个位置移动到另一个位置。某个View的平移动画的播放范围是其父控件所占的空间。如下图所示： 

<center>
![](/img/android/android_4_6.png)
</center>

　　上图中`灰色部分`是一个线性布局，布局内有`TextView`和`Button`两个控件 。若此时`按钮B`需要播放一个平移动画，那么`按钮B`的平移动画的`可视范围`则是线性布局所占据的区域，即上图中的灰色部分。 

<br>　　范例1：平移动画(`alpha.xml`)。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate 
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="100"
        android:toYDelta="150"
        android:duration="3000"	/>
</set>
```
    属性解释：
    -  android:fromXDelta	设置动画移动时的起始X坐标。
    -  android:fromYDelta	设置动画移动时的起始Y坐标。
    -  android:toXDelta	  设置动画移动时的结束X坐标。
    -  android:toYDelta	  设置动画移动时的结束Y坐标。 

<br>　　对于平移动画的四个属性来说，其值可以使用百分比或具体数字来表示：

	-  若取值为百分比：则表示当前控件内部的某个位置。如“50%”。
	-  若取值为百分比p：则表示当前控件的父控件内部的某个位置。如“50%p”。
	-  若取值为具体常量：常量就是相对于当前控件的在未播放动画时的左上角坐标的偏移量。

　　因此，在范例1中，动画的起点就是按钮B的左上角，动画的终点就是左上角坐标沿着`x`轴偏移`100`像素，沿着`y`轴偏移`150`像素。 

<br>**旋转**
　　旋转(`rotate`)动画，可以将指定的View沿着某一个点从某一个角度旋转到另一个角度。旋转动画的可视范围同样是待播放动画的View的父控件所占据的空间。

<br>　　范例1：旋转动画。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <rotate
        android:fromDegrees="0"
        android:toDegrees="-90"
        android:pivotX="50%"
        android:pivotY="50%"
        android:duration="3000" />
</set>
```
    属性解释：
    -  android:fromDegrees	   设置控件(相对于0度)最初旋转角度。若值为0则控件不旋转。
    -  android:toDegrees	     设置控件(相对于0度)最终旋转角度，若值与fromDegrees相等则控件不旋转。
    -  android:pivotX和pivotY	设置控件旋转时所用的参照点的X和Y轴坐标。

    若将fromDegrees或toDegrees属性的值设置为负数，则动画会按照逆时针旋转。

<br>　　范例2：`RotateAnimation`类。
``` android
// 根据指定的参数构造一个RotateAnimation对象。 
// 此构造方法默认是相对于屏幕上的某个点进行旋转。若想相对于控件本身或父元素旋转，则需要调用另一个构造方法。
public RotateAnimation(float fromDegrees, float toDegrees, float pivotX, float pivotY)

// 根据指定的参数构造一个RotateAnimation对象。
// 其中pivotXType和pivotYType指出当前动画旋转的参照点的类型，有三个取值：
// -  相对的(RELATIVE)：
//    -  Animation.RELATIVE_TO_SELF ：控件围绕自己内部的某点旋转。
//    -  Animation.RELATIVE_TO_PARENT ：控件围绕其父组件内部某点旋转。
// -  绝对的(ABSOLUTE)：
//    -  Animation.ABSOLUTE：控件围绕屏幕中的某个具体的点旋转。
// -  其中pivotXValue和pivotYValue的取值范围为：
// -  若Type设置为相对的(RELATIVE)，则取值范围是0.0~1.0之间。1.0就是100%。
// -  若Type设置为绝对的(ABSOLUTE) ，则取值可以是一个具体的数字。
public RotateAnimation(float fromDegrees, float toDegrees, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

<br>**缩放**
　　缩放(`scale`)动画，可以将指定的View沿着某一个点从某一个尺寸缩放到另一个尺寸。缩放动画的可视范围同样是待播放动画的View的父控件所占据的空间。

<br>　　范例1：缩放动画。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <scale 
        android:fromXScale="1.0" 
        android:fromYScale="5.0"
        android:toXScale="3.0" 
        android:toYScale="1.0" 
        android:pivotX="50%"
        android:pivotY="50%" 
        android:duration="5000" />
</set>
```
    属性解释：
    -  android:fromXScale	设置控件最初在水平方向上被缩放的倍数。若为1.0则不缩放。
    -  android:fromYScale	设置控件最初在垂直方向上被缩放的倍数。若为1.0则不缩放。
    -  android:toXScale	  设置控件最终在水平方向上被缩放的倍数。
    -  android:toYScale	  设置控件最终在垂直方向上被缩放的倍数。
    -  android:pivotX	    设置控件以某个中心点进行缩放时，中心点的X坐标。 
    -  android:pivotY	    设置控件以某个中心点进行缩放时，中心点的Y坐标。

<br>　　范例2：反向。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<scale
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXScale="1"
    android:fromYScale="1"
    android:toXScale="-1"
    android:toYScale="-1"
    android:pivotX="50%"
    android:pivotY="50%"
    android:duration="3000" />
```
    语句解释：
    -  若fromXScale、fromYScale、toXScale、toYScale四个属性的取值为负数，则：
       -  X轴会以中心点X轴坐标为准从右到左的反向。
       -  Y轴会以中心点Y轴坐标为准从上到下的反向。

<br>**AnimationSet**
　　使用`<set>`标签来定义一个动画集合，其内部可以嵌套其他动画元素（`<alpha>`，`<scale>`，`<translate>`，`<rotate>`），甚至是另一个`<set>`，`<set>`元素使用`AnimationSet`类来表示。
　　
<br>　　范例1：一组动画。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android" >
    <alpha
        android:duration="1000"
        android:fromAlpha="0.5"
        android:toAlpha="1.0" />
    <scale
        android:duration="1000"
        android:fromXScale="1"
        android:fromYScale="1"
        android:toXScale="0.5"
        android:toYScale="0.5" />
    <translate
        android:duration="1000"
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="150"
        android:startOffset="3000"
        android:toYDelta="150"/>
</set>
```
    语句解释：
    -  使用动画的android:startOffset属性可以设置其播放的开始时间，单位是毫秒。
    -  本范例中，当这个动画集合开始时会首先播放前两个动画，等动画集已经播放了三秒时，第三个平移动画才开始播放。

    属性解释：
    -  android:interpolator为<set>元素设置加速器。
    -  android:shareInterpolator
       -  “true” if you want to share the same interpolator among all child elements.

<br>**Interpolators**
　　`Interpolators`是在xml中定义的动画加速器，它可以影响动画的播放速度，允许您对现有的动画效果进行`加速`、`减速`、`重复`、`反弹`等。Android中所有的加速器都是`Interpolators`类的子类。Android中已提供的加速器如下表所示：
```
加速器类名				资源id
AccelerateDecelerateInterpolator	@android:anim/accelerate_decelerate_interpolator
AccelerateInterpolator			@android:anim/accelerate_interpolator
AnticipateInterpolator			@android:anim/anticipate_interpolator
AnticipateOvershootInterpolator		@android:anim/anticipate_overshoot_interpolator
BounceInterpolator			@android:anim/bounce_interpolator
CycleInterpolator			@android:anim/cycle_interpolator
DecelerateInterpolator			@android:anim/decelerate_interpolator
LinearInterpolator			@android:anim/linear_interpolator
OvershootInterpolator			@android:anim/overshoot_interpolator
```
　　使用的方法：
``` xml
<set android:interpolator="@android:anim/accelerate_interpolator">
    <!-- ... -->
</set>
```
    语句解释：
    -  interpolator属性的值必须指向加速器的资源Id，而不是类名。

<br>**自定义Interpolators**
　　如果平台提供的加速器无法满足你的需求，你可以在这些加速器的基础上再创建一个自定义的加速器。

　　文件位置：`res/anim/filename.xml`
　　语法：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<InterpolatorName 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:attribute_name="value"/>
```
　　如果你不为加速器指定任何属性，那么和直接使用它们是没有任何区别的，关于系统内置的加速器支持哪些属性，请自行搜索。

# 第二节 帧动画 #
　　帧动画通过在短时间内连续播放多张图片来达到动画的效果。

<br>　　范例1：建立动画文件`res/drawable/look.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android" android:oneshot="false">
    <item android:drawable="@drawable/girl_1" android:duration="120" />
    <item android:drawable="@drawable/girl_2" android:duration="120" />
    <item android:drawable="@drawable/girl_3" android:duration="120" />
    <item android:drawable="@drawable/girl_4" android:duration="120" />
</animation-list>
```
    语句解释：
    -  帧动画的根标签为<animation-list>，帧动画的xml文件必须要放在res/drawable文件夹中。
    -  <item>标签描述帧动画中的每一帧所要显示的图片。

    属性解释
    -  android:oneshot   设置动画是否只播放一次。若值为false，则动画会循环播放。
    -  <item>标签的 android:drawable 当前帧所显示的图片。
    -  <item>标签的 android:duration 当前帧的持续时间（毫秒）。

<br>　　范例2：使用动画。
``` xml
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/look"
    android:onClick="onClick"
    android:id="@+id/img" />
```
    语句解释：
    -  使用<ImageView>的android:src属性来指向新建立好的动画文件look.xml。

<br>　　范例3：播放动画。
``` 
AnimationDrawable drawable = (AnimationDrawable) this.img.getDrawable();
drawable.start();
```
    语句解释：
    -  调用ImageView的getDrawable方法获取动画后，就可以启动动画了。
    -  提示：帧动画不可以通过AnimationUtils工具类获取，该类仅能获取Tween动画。

<br>　　在`Activity`的`onCreate()`中调用`AnimationDrawable`的`start()`方法动画并不会被播放。这是因为`AnimationDrawable`不能在不完全的窗口上运行。可以在`onCreate()`方法之后的`onWindowFocusChanged()`方法中启动动画。


<br>　　范例4：在`onWindowFocusChanged`中。
``` android
public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if(hasFocus){ // 若当前Activity获得焦点。
        TextView text = (TextView) findViewById(R.id.text);
        AnimationDrawable drawable =(AnimationDrawable) text.getBackground();
        drawable.start();    		
    }
}
```
    语句解释：
    -  onWindowFocusChanged方法将在Activity的onResume方法之后且用户可操作之前被调用。

# 第三节 属性动画 #
　　简单的说，视图动画可以实现的功能，属性动画基本都可以实现，视图动画的缺点，在属性动画中都不存在了。而且，使用的时候我们只需要告诉系统`动画的运行时长`，需要执行`哪种类型的动画`，以及`动画的初始值和结束值`，剩下的工作就可以全部交给系统去完成了。

<br>　　笔者在此声明，本节主要参考阅读下面`CSDN郭霖`的三篇文章（有细节上的修改，但几乎可以算是原样抄袭！）：
- [Android属性动画完全解析(上)，初识属性动画的基本用法](http://blog.csdn.net/guolin_blog/article/details/43536355#)
- [Android属性动画完全解析(中)，ValueAnimator和ObjectAnimator的高级用法](http://blog.csdn.net/guolin_blog/article/details/43816093)
  
　　本节参考的其他文章将在本节末尾处列出。

## 基础入门 ##
　　属性动画有两个常用的类：`ValueAnimator`和`ObjectAnimator`，我们接下来依次介绍它们。
<br>
### ValueAnimator ###
　　`ValueAnimator`是整个属性动画机制当中最核心的一个类。我们只需要将`初始值和结束值`提供给`ValueAnimator`，并且告诉它动画所需运行的时长，那么`ValueAnimator`就会自动帮我们完成`从初始值平滑地过渡到结束值`这样的效果。除此之外，`ValueAnimator`还负责管理动画的播放次数、播放模式、以及对动画设置监听器等，确实是一个非常重要的类。

<br>　　但是`ValueAnimator`的用法却很简单，比如说想要将一个值从`0`平滑过渡到`1`，时长`300`毫秒，就可以这样写：
``` android
// 使用ofFloat()方法来创建一个ValueAnimator对象，其中参数0和1就表示将值从0平滑过渡到1。ofFloat()方法当中允许传入多个float类型的参数。
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
// setDuration()方法来设置动画运行的时长。
anim.setDuration(300);
// 启动动画。
anim.start();
```
    语句解释：
    -  值得注意的，本范例使用的是android.animation.ValueAnimator类。

<br>　　运行上面的代码时，程序会将值从`0`过渡到`1`，但是我们却无法看到任何界面效果，我们需要借助监听器才能知道这个动画是否已经真正运行了，如下所示：
``` android
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
anim.setDuration(300);
anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    public void onAnimationUpdate(ValueAnimator valueAnimator) {
        System.out.println("cuurent value is " + valueAnimator.getAnimatedValue());
    }
});
anim.start();
```
    语句解释：
    -  在动画执行的过程中系统会不断地回调onAnimationUpdate()方法，我们只需要在回调方法当中将当前的值取出并打印出来。
    -  回调onAnimationUpdate()方法的时间间隔是ValueAnimator类根据你设置的初始值、结束值、动画时间三个参数来计算出来的，不需要我们设置，它会尽可能的让动画平滑的播放出来（即在使用最少的回调次数的基础上，保证动画流畅）。

<br>　　另外`ofFloat()`方法当中是可以传入任意多个参数的，因此我们还可以构建出更加复杂的动画逻辑，比如说将一个值在`5`秒内从`0`过渡到`5`，再过渡到`3`，再过渡到`10`，就可以这样写：
``` android
ValueAnimator anim = ValueAnimator.ofFloat(0f, 5f, 3f, 10f);
anim.setDuration(5000);
anim.start();
```
    语句解释：
    -  如果只是希望将一个整数值从0平滑地过渡到100，那么也很简单，只需要调用ValueAnimator.ofInt(0, 100)就可以了。
    -  调用anim.setRepeatCount()设置循环播放的次数，默认为1次，ValueAnimator.INFINITE为无限循环。
    -  调用anim.setRepeatMode()设置循环播放的模式：
       -  RESTART（默认），动画播放到结尾时，直接从开头再播放。
       -  REVERSE，动画播放到结尾时，再从结尾再往开头播放。
    -  除此之外，我们还可以调用anim.setStartDelay()方法来设置动画延迟播放的时间等等。
<br>
### ObjectAnimator ###
　　相比于`ValueAnimator`，`ObjectAnimator`可能才是我们最常接触到的类，因为`ValueAnimator`只不过是对值进行了一个平滑的动画过渡，但我们实际使用到这种功能的场景好像并不多。而`ObjectAnimator`则就不同了，它是可以直接对任意对象的任意属性进行动画操作，如`View`的`alpha`属性。

　　值得注意的是`ObjectAnimator`是`ValueAnimator`的子类，因此它们的用法也非常类似，这里如果我们想要将一个`Button`在`5`秒中内从常规变换成全透明，再从全透明变换成常规，就可以这样写：
``` android
Button btn = (Button) findViewById(R.id.btn);
// 第一个参数是想动画的对象，第二个参数是该对象的属性。
ObjectAnimator animator = ObjectAnimator.ofFloat(btn, "alpha", 1f, 0f, 1f);
animator.setDuration(5000);
animator.start();
```
    语句解释：
    -  把代码改成“ObjectAnimator.ofFloat(btn, "rotation", 0, 360)”则按钮就会被旋转。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "scaleY", 1f, 3f, 1f)”则按钮就会在垂直方向上进行缩放，然后还原。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "rotation", 0, 360)”则按钮就会被旋转。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "translationX", curTranslationX, -500f)”则按钮就会从curTranslationX移动到-500。

<br>　　相信肯定会有不少朋友现在心里都有同样一个疑问，就是`ObjectAnimator`的`ofFloat()`方法的第二个参数到底可以传哪些值呢？目前我们使用过了`alpha`、`rotation`、`translationX`和`scaleY`这几个值，那么还有哪些值是可以使用的呢？答案是我们可以传入`任意的值`到`ofFloat()`方法的第二个参数当中。因为`ObjectAnimator`在设计的时候就没有针对于`View`来进行设计，而是针对于任意对象的，它所负责的工作就是不断地向某个对象中的某个属性进行赋值，然后对象根据属性值的改变再来决定如何展现出来。
　　以`ObjectAnimator.ofFloat(btn, "alpha", 1f, 0f, 1f)`为例，这行代码的意思就是不断的修改`Button`的`alpha`属性值，但不是直接去修改，而是当动画启动时，`ObjectAnimator`会不断的调用`Button`对象的`getAlpha()`和`setAlpha()`方法，这个两个方法定义在`View`类。
　　相应的，`rotation`对应的就是`setRotation()`和`getRotation()`方法。

<br>**引入一个问题**
　　我们现在有个需求，给`Button`加一个动画，让这个`Button`的`paddingLeft`从当前值增加到`500px`。按照上面的思路，我们可以这么写代码：
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void onClick(View button) {
        // 当Button被点击时，我们启动一个属性动画，修改Button的paddingLeft属性的值到500 。
        ObjectAnimator.ofInt(button, "paddingLeft", 500).setDuration(5000).start();
    }
}
```
　　上述代码运行后发现没效果，其实没效果是对的。这是因为属性动画如果想成功运行，需要两个条件：

	-  object必须要提供setXxx方法，如果动画的时候没有传递初始值，那么还要提供getXxx方法，因为系统要去拿xxx属性的初始值。
	-  object的setXxx对属性xxx所做的改变必须能够通过某种方法反映出来（不然你是看不到的），比如会带来ui的改变。
　　上面范例之所以不成功是因为`View`类没有`setPaddingLeft`方法，而只有`setPadding()`方法，为了实现这个需求，我们可以用一个类来包装原始的`Button`对象，代码为：
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void onClick(View button) {
        // 将按钮放到一个ButtonWrapper中。
        ObjectAnimator.ofInt(new ButtonWrapper((Button) button), "paddingLeft", 500).setDuration(5000).start();
    }
    // 一个普通的包装类。
    public class ButtonWrapper {
        private Button mTarget;
        public ButtonWrapper(Button mTarget) {
            this.mTarget = mTarget;
        }
        public int getPaddingLeft() {
            return mTarget.getPaddingLeft();
        }
        public void setPaddingLeft(int paddingLeft){
            mTarget.setPadding(paddingLeft, 0, 0, 0);
        }
    }
}
```
    语句解释：
    -  这样一来程序运行时就可以看到动画效果了。
    -  如果你修改完属性后View没有自动更新，那么你可以调用requestlayout()或invalidate()方法手动更新。


<br>**本节参考阅读：**
- [Android属性动画深入分析：让你成为动画牛人](http://blog.csdn.net/singwhatiwanna/article/details/17841165)

<br>
### 组合动画 ###
　　独立的动画能够实现的视觉效果毕竟是相当有限的，因此将多个动画组合到一起播放就显得尤为重要。幸运的是，Android团队在设计属性动画的时候也充分考虑到了组合动画的功能，因此提供了一套非常丰富的`API`来让我们将多个动画组合到一起。
　　实现组合动画功能主要需要借助`AnimatorSet`这个类，这个类提供了一个`play()`方法，如果我们向这个方法中传入一个`Animator`对象(`ValueAnimator`和`ObjectAnimator`的父类)将会返回一个`AnimatorSet.Builder`的实例。
　　`AnimatorSet.Builder`中包括以下四个方法：

	-  after(Animator anim)    将现有动画插入到传入的动画之后执行
	-  after(long delay)       将现有动画延迟指定毫秒后执行
	-  before(Animator anim)   将现有动画插入到传入的动画之前执行
	-  with(Animator anim)     将现有动画和传入的动画同时执行

<br>　　比如说我们想要让`Button`先从屏幕外移动进屏幕，然后开始旋转`360`度，旋转的同时进行淡入淡出操作，就可以这样写：
``` android
Button btn = (Button) findViewById(R.id.btn);
ObjectAnimator moveIn = ObjectAnimator.ofFloat(btn, "translationX", -500f, 0f);
ObjectAnimator rotate = ObjectAnimator.ofFloat(btn, "rotation", 0f, 360f);
ObjectAnimator fadeInOut = ObjectAnimator.ofFloat(btn, "alpha", 1f, 0f, 1f);
AnimatorSet animSet = new AnimatorSet();
animSet.play(rotate).with(fadeInOut).after(moveIn);
animSet.setDuration(5000);
animSet.start();
```
<br>　　当然除了上面说的4个方法外，`AnimatorSet`这个类来提供了不少其它有用的方法，比如`playTogether()`、`playSequentially()`等。
<br>
### Animator监听器 ###
　　在很多时候，我们希望可以监听到动画的各种事件，比如动画何时开始，何时结束，然后在开始或者结束的时候去执行一些逻辑处理。这个功能是完全可以实现的，`Animator`类(ValueAnimator、AnimatorSet的父类)当中提供了一个`addListener()`方法，这个方法接收一个`AnimatorListener`，我们只需要去实现这个`AnimatorListener`就可以监听动画的各种事件了。

``` android
ValueAnimator anim = ValueAnimator.ofInt(0, 10);
anim.setDuration(1000);
anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    public void onAnimationUpdate(ValueAnimator valueAnimator) {
        System.out.println(valueAnimator.getAnimatedValue());
    }
});
anim.addListener(new Animator.AnimatorListener() {
    // 动画开始的时候调用
    public void onAnimationStart(Animator animation) {
        System.out.println("onAnimationStart");
    }
    // 动画重复执行的时候调用
    public void onAnimationRepeat(Animator animation) {
        System.out.println("onAnimationRepeat");
    }
    // 动画结束的时候调用
    public void onAnimationEnd(Animator animation) {
        System.out.println("onAnimationEnd");
    }
    // 动画被取消的时候调用
    public void onAnimationCancel(Animator animation) {
        System.out.println("onAnimationCancel");
    }
});
anim.start();
```

<br>　　但是也许很多时候我们并不想要监听那么多个事件，可能我只想要监听动画结束这一个事件，那么每次都要将四个接口全部实现一遍就显得非常繁琐。没关系，为此Android提供了一个适配器类，叫作`AnimatorListenerAdapter`，使用这个类就可以解决掉实现接口繁琐的问题了，如下所示：
``` android
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
    }
});
```
<br>
### 使用XML编写动画 ###
　　我们可以使用代码来编写所有的动画功能，这也是最常用的一种做法。不过，过去的补间动画除了使用代码编写之外也是可以使用`XML`编写的，因此属性动画也提供了这一功能，即通过`XML`来完成和代码一样的属性动画功能。
　　通过`XML`来编写动画可能会比通过代码来编写动画要慢一些，但是在重用方面将会变得非常轻松，比如某个将通用的动画编写到`XML`里面，我们就可以在各个界面当中轻松去重用它。
<br>　　如果想要使用`XML`来编写动画，首先要在`res`目录下面新建一个`animator`文件夹，所有属性动画的`XML`文件都应该存放在这个文件夹当中。然后在`XML`文件中我们一共可以使用如下三种标签：

	-  <animator>        对应代码中的 ValueAnimator
	-  <objectAnimator>  对应代码中的 ObjectAnimator
	-  <set>             对应代码中的 AnimatorSet

<br>　　那么比如说我们想要实现一个从`0`到`100`平滑过渡的动画，在`XML`当中就可以这样写：
``` xml
<animator xmlns:android="http://schemas.android.com/apk/res/android"
    android:valueFrom="0"
    android:valueTo="100"
    android:valueType="intType"/>
```
　　而如果我们想将一个视图的`alpha`属性从`1`变成`0`，就可以这样写：
``` xml
<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
    android:valueFrom="1"
    android:valueTo="0"
    android:valueType="floatType"
    android:propertyName="alpha"/>
```
　　其实`XML`编写动画在可读性方面还是挺高的，上面的内容相信不用我做解释大家也都看得懂吧。

<br>　　另外，我们也可以使用`XML`来完成复杂的组合动画操作，比如将一个视图先从屏幕外移动进屏幕，然后开始旋转`360`度，旋转的同时进行淡入淡出操作，就可以这样写：
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:ordering="sequentially" >
    <objectAnimator
        android:duration="2000"
        android:propertyName="translationX"
        android:valueFrom="-500"
        android:valueTo="0"
        android:valueType="floatType" >
    </objectAnimator>

    <set android:ordering="together" >
        <objectAnimator
            android:duration="3000"
            android:propertyName="rotation"
            android:valueFrom="0"
            android:valueTo="360"
            android:valueType="floatType" >
        </objectAnimator>

        <set android:ordering="sequentially" >
            <objectAnimator
                android:duration="1500"
                android:propertyName="alpha"
                android:valueFrom="1"
                android:valueTo="0"
                android:valueType="floatType" >
            </objectAnimator>
            <objectAnimator
                android:duration="1500"
                android:propertyName="alpha"
                android:valueFrom="0"
                android:valueTo="1"
                android:valueType="floatType" >
            </objectAnimator>
        </set>
    </set>
</set>
```
　　这段`XML`实现的效果和我们刚才通过代码来实现的组合动画的效果是一模一样的，每个参数的含义都非常清楚，相信大家都是一看就懂，我就不再一一解释了。

<br>　　最后`XML`文件是编写好了，那么我们如何在代码中把文件加载进来并将动画启动呢？只需调用如下代码即可：
``` android
Animator animator = AnimatorInflater.loadAnimator(context, R.animator.anim_file);
animator.setTarget(view);
animator.start();
```
　　调用`AnimatorInflater`的`loadAnimator`来将`XML`动画文件加载进来，然后再调用`setTarget()`方法将这个动画设置到某一个对象上面，最后再调用`start()`方法启动动画就可以了，就是这么简单。
<br>　　最后要注意的是，如果你使用的是`NineOldAndroids`动画库，那么在`Android2.2`设备上加载上面那个动画`XML`文件时会报错。

## 高级用法 ##
　　正如上一节当中所说到的，属性动画对补间动画进行了很大幅度的改进，之前补间动画可以做到的属性动画也能做到，补间动画做不到的现在属性动画也可以做到了。因此，今天我们就来学习一下属性动画的高级用法，看看如何实现一些补间动画所无法实现的功能。
<br>
### ValueAnimator进阶 ###
　　在上一节中介绍补间动画缺点的时候有提到过，补间动画是只能对`View`对象进行动画操作的。而属性动画就不再受这个限制，它可以对任意对象进行动画操作。比如说我们有一个自定义的`View`，在这个`View`当中有一个`Point`对象用于管理坐标，然后在`onDraw()`方法当中就是根据这个`Point`对象的坐标值来进行绘制的。也就是说，如果我们可以对`Point`对象进行动画操作，那么整个自定义`View`的动画效果就有了。下面我们就来学习一下如何实现这样的效果。

<br>　　在开始动手之前，我们还需要掌握另外一个知识点，就是`TypeEvaluator`的用法。可能在大多数情况下我们使用属性动画的时候都不会用到`TypeEvaluator`，但是大家还是应该了解一下它的用法，以防止当我们遇到一些解决不掉的问题时能够想起来还有这样的一种解决方案。
　　简单来说，`TypeEvaluator`就是告诉动画系统如何从初始值过度到结束值。我们在上一节中学到的`ValueAnimator.ofFloat()`方法就是实现了初始值与结束值之间的平滑过度，那么这个平滑过度是怎么做到的呢？其实就是系统内置了一个`FloatEvaluator`，它通过计算告知动画系统如何从初始值过度到结束值，我们来看一下`FloatEvaluator`的代码实现：
``` andriod
// FloatEvaluator实现了TypeEvaluator接口。
public class FloatEvaluator implements TypeEvaluator {
    // fraction：表示动画的完成度的，我们应该根据它来计算当前动画的值应该是多少。
    // startValue和endValue：表示动画的初始值和结束值。
    public Object evaluate(float fraction, Object startValue, Object endValue) {
        float startFloat = ((Number) startValue).floatValue();
        // 用结束值减去初始值，算出它们之间的差值，然后乘以fraction这个系数，再加上初始值，那么就得到当前动画的值了。
        return startFloat + fraction * (((Number) endValue).floatValue() - startFloat);
    }
}
```
    语句解释：
    -  其中evaluate()方法是在TypeEvaluator接口中定义的。

<br>　　上面的`FloatEvaluator`是系统内置好的功能，并不需要我们自己去编写，但介绍它的实现方法是要为我们后面的功能铺路的。
　　前面我们使用过了`ValueAnimator`的`ofFloat()`和`ofInt()`方法，分别用于对浮点型和整型的数据进行动画操作的，但实际上`ValueAnimator`中还有一个`ofObject()`方法，是用于对任意对象进行动画操作的。但是相比于浮点型或整型数据，对象的动画操作明显要更复杂一些，因为系统将完全无法知道如何从初始对象过度到结束对象，因此这个时候我们就需要实现一个自己的`TypeEvaluator`来告知系统如何进行过度。

　　下面来先定义一个`Point`类，如下所示：
``` android
public class Point {
    private float x;

    private float y;

    public Point(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }
}
```
　　`Point`类非常简单，只有`x`和`y`两个变量用于记录坐标的位置，并提供了构造方法来设置坐标，以及`get`方法来获取坐标。

　　接下来定义`PointEvaluator`，如下所示：
``` android
public class PointEvaluator implements TypeEvaluator{
    @Override
    public Object evaluate(float fraction, Object startValue, Object endValue) {
        Point startPoint = (Point) startValue;
        Point endPoint = (Point) endValue;
        float x = startPoint.getX() + fraction * (endPoint.getX() - startPoint.getX());
        float y = startPoint.getY() + fraction * (endPoint.getY() - startPoint.getY());
        Point point = new Point(x, y);
        return point;
    }
}
```
　　这样我们就将`PointEvaluator`编写完成了，接下来我们就可以非常轻松地对`Point`对象进行动画操作了，比如说我们有两个`Point`对象，现在需要将`Point1`通过动画平滑过度到`Point2`，就可以这样写：
``` android
Point point1 = new Point(0, 0);
Point point2 = new Point(300, 300);
ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), point1, point2);
anim.setDuration(5000);
anim.start();
```
　　好的，这就是自定义`TypeEvaluator`的全部用法，掌握了这些知识之后，我们就可以来尝试一下如何通过对`Point`对象进行动画操作，从而实现整个自定义`View`的动画效果。

　　新建一个`MyAnimView`继承自`View`，代码如下所示：
``` android
public class MyAnimView extends View {
    public static final float RADIUS = 50f;

    private Point currentPoint;

    private Paint mPaint;

    public MyAnimView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setColor(Color.BLUE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (currentPoint == null) {
            currentPoint = new Point(RADIUS, RADIUS);
            drawCircle(canvas);
            startAnimation();
        } else {
            drawCircle(canvas);
        }
    }

    private void drawCircle(Canvas canvas) {
        float x = currentPoint.getX();
        float y = currentPoint.getY();
        canvas.drawCircle(x, y, RADIUS, mPaint);
    }

    private void startAnimation() {
        Point startPoint = new Point(RADIUS, RADIUS);
        Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);
        ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint, endPoint);
        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                currentPoint = (Point) animation.getAnimatedValue();
                invalidate();
            }
        });
        anim.setDuration(5000);
        anim.start();
    }
}
```

　　下面我们只需要在布局文件当中引入这个自定义控件：
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.example.cutler.androidtest.MyAnimView
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```
　　最后运行一下程序，效果如下图所示：

<center>
![](http://img.blog.csdn.net/20150504225258841)
</center>

　　这样我们就成功实现了通过对对象进行值操作来实现动画效果的功能，这就是`ValueAnimator`的高级用法。
<br>
### ObjectAnimator进阶###
　　之前我们在吐槽补间动画的时候有提到过，补间动画是只能实现移动、缩放、旋转和淡入淡出这四种动画操作的，功能限定死就是这些，基本上没有任何扩展性可言。比如我们想要实现对`View`的颜色进行动态改变，补间动画是没有办法做到的。
　　但是属性动画就不会受这些条条框框的限制，它的扩展性非常强，对于动态改变`View`的颜色这种功能是完全可是胜任的，那么下面我们就来学习一下如何实现这样的效果。

<br>　　我们此时就需要在`MyAnimView`中定义一个`color`属性，并提供它的`get`和`set`方法。这里我们可以将`color`属性设置为字符串类型，使用`#RRGGBB`这种格式来表示颜色值，代码如下所示：
``` android
public class MyAnimView extends View {
    //...
    private String color;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
        // 修改画笔颜色
        mPaint.setColor(Color.parseColor(color));
        // 重绘视图，调用此方法后会导致onDraw()方法被调用。
        invalidate();
    }
    //...
}
```
    语句解释：
    -  在onDraw()方法当中会根据画笔mPaint的颜色来进行绘制，这样颜色也就会动态进行改变了。

<br>　　那么接下来的问题就是怎样让`setColor()`方法得到调用了，毫无疑问，当然是要借助`ObjectAnimator`类，但是在使用`ObjectAnimator`之前我们还要完成一个非常重要的工作，就是编写一个用于告知系统如何进行颜色过度的`TypeEvaluator`。创建`ColorEvaluator`并实现`TypeEvaluator`接口，代码如下所示：
``` android
public class ColorEvaluator implements TypeEvaluator {
    private int mCurrentRed = -1;
    private int mCurrentGreen = -1;
    private int mCurrentBlue = -1;

    @Override
    public Object evaluate(float fraction, Object startValue, Object endValue) {
        String startColor = (String) startValue;
        String endColor = (String) endValue;
        int startRed = Integer.parseInt(startColor.substring(1, 3), 16);
        int startGreen = Integer.parseInt(startColor.substring(3, 5), 16);
        int startBlue = Integer.parseInt(startColor.substring(5, 7), 16);
        int endRed = Integer.parseInt(endColor.substring(1, 3), 16);
        int endGreen = Integer.parseInt(endColor.substring(3, 5), 16);
        int endBlue = Integer.parseInt(endColor.substring(5, 7), 16);
        // 初始化颜色的值
        if (mCurrentRed == -1) {
            mCurrentRed = startRed;
        }
        if (mCurrentGreen == -1) {
            mCurrentGreen = startGreen;
        }
        if (mCurrentBlue == -1) {
            mCurrentBlue = startBlue;
        }
        // 计算初始颜色和结束颜色之间的差值
        int redDiff = Math.abs(startRed - endRed);
        int greenDiff = Math.abs(startGreen - endGreen);
        int blueDiff = Math.abs(startBlue - endBlue);
        int colorDiff = redDiff + greenDiff + blueDiff;
        if (mCurrentRed != endRed) {
            mCurrentRed = getCurrentColor(startRed, endRed, colorDiff, 0, fraction);
        } else if (mCurrentGreen != endGreen) {
            mCurrentGreen = getCurrentColor(startGreen, endGreen, colorDiff, redDiff, fraction);
        } else if (mCurrentBlue != endBlue) {
            mCurrentBlue = getCurrentColor(startBlue, endBlue, colorDiff, redDiff + greenDiff, fraction);
        }
        // 将计算出的当前颜色的值组装返回
        String currentColor = "#" + getHexString(mCurrentRed) + getHexString(mCurrentGreen) + getHexString(mCurrentBlue);
        return currentColor;
    }

    /**
     * 根据fraction值来计算当前的颜色。
     */
    private int getCurrentColor(int startColor, int endColor, int colorDiff, int offset, float fraction) {
        int currentColor;
        if (startColor > endColor) {
            currentColor = (int) (startColor - (fraction * colorDiff - offset));
            if (currentColor < endColor) {
                currentColor = endColor;
            }
        } else {
            currentColor = (int) (startColor + (fraction * colorDiff - offset));
            if (currentColor > endColor) {
                currentColor = endColor;
            }
        }
        return currentColor;
    }
	
    /**
     * 将10进制颜色值转换成16进制。
     */
    private String getHexString(int value) {
        String hexString = Integer.toHexString(value);
        if (hexString.length() == 1) {
            hexString = "0" + hexString;
        }
        return hexString;
    }

}
```

　　`ColorEvaluator`写完之后我们就把最复杂的工作完成了，剩下的就是一些简单调用的问题了，比如说我们想要实现从蓝色到红色的动画过度，历时5秒，就可以这样写：
``` android
ObjectAnimator anim = ObjectAnimator.ofObject(myAnimView, "color", new ColorEvaluator(), "#0000FF", "#FF0000");
anim.setDuration(5000);
anim.start();
```
　　用法非常简单易懂，相信不需要我再进行解释了。

　　接下来我们需要将上面一段代码移到`MyAnimView`类当中，让它和刚才的`Point`移动动画可以结合到一起播放，这就要借助我们在上篇文章当中学到的组合动画的技术了。修改`MyAnimView`中的代码，如下所示：
``` android
public class MyAnimView extends View {

    // ...

    private void startAnimation() {
        Point startPoint = new Point(RADIUS, RADIUS);
        Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);
        ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint, endPoint);
        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                currentPoint = (Point) animation.getAnimatedValue();
                invalidate();
            }
        });
        ObjectAnimator anim2 = ObjectAnimator.ofObject(this, "color", new ColorEvaluator(), "#0000FF", "#FF0000");
        AnimatorSet animSet = new AnimatorSet();
        animSet.play(anim).with(anim2);
        animSet.setDuration(5000);
        animSet.start();
    }

}
```

　　可以看到，我们并没有改动太多的代码，重点只是修改了`startAnimation()`方法中的部分内容。这里先是将颜色过度的代码逻辑移动到了`startAnimation()`方法当中，注意由于这段代码本身就是在`MyAnimView`当中执行的，因此`ObjectAnimator.ofObject()`的第一个参数直接传`this`就可以了。接着我们又创建了一个`AnimatorSet`，并把两个动画设置成同时播放，动画时长为`5`秒，最后启动动画。现在重新运行一下代码，效果如下图所示：

<center>
![](http://img.blog.csdn.net/20150504225554203)
</center>

# 第四节 NineOldAndroids #
　　前面说了，属性动画是在`Android3.0`中推出的，在`Android3.0`之前没法使用它。
　　但是万事总有一线生机，现在有一个名为`NineOldAndroids`动画库，可以让低于`Android3.0(API Level 11)`的项目使用上属性动画。它的作者是非常牛逼的`JakeWharton`，好几个著名的开源库都是他的作品。
　　项目的官网为：http://nineoldandroids.com/ ，`JakeWharton`的`Github`主页为：https://github.com/JakeWharton 。

　　`NineOldAndroids`的原理很简单，判断当前设备的`API Level`版本，如果大于等于`11`，那么就调用`官方的API`，否则就调用自己实现动画效果。在`API`的名称等方面，它与官方的属性动画基本一致（如`ObjectAnimator`、`ValueAnimator`等），这意味着你只需要修改一下包名就可以在官方和`NineOldAndroids`之间切换。
　　比如说想要将一个值从`0`平滑过渡到`1`，时长`300`毫秒，写法与官方`API`完全一致：
``` android
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
anim.setDuration(300);
anim.start();
```
    语句解释：
    -  值得注意的，本范例使用的是com.nineoldandroids.animation.ValueAnimator类。

<br>　　遗憾的是，经过笔者测试验证，当`NineOldAndroids`动画库运行在`Android3.0`之前（`Android3.0`及之后会调用系统的API所以不会）的平台时，仍然存在视图动画的缺点（视图的位置不会真正发生改变），`Jake Wharton`本人也对此做出了回应：
```
Yes, this is a platform limitation. 
You need to physically move the view when the animation ends on pre-Honeycomb. 
```
　　[点击查看详情](http://stackoverflow.com/questions/13173808/nineoldandroids-not-clickable-view-after-rotation-or-move?rq=1)

　　更劲爆的是，作者本人已经将这个项目给`DEPRECATED`了，下面是他的解释：
```
NineOldAndroids is deprecated. No new development will be taking place. 
Existing versions will (of course) continue to function. 
New applications should use minSdkVersion="14" or higher which has access to the platform animation APIs.

Thanks for all your support!
```


<br>　　这是不是说`NineOldAndroids`动画库就完全没用了？ 并不是！事实上`NineOldAndroids`动画库有两个功能：

	-  第一，让Android3.0之前的平台使用属性动画。
	-  第二，让Android3.0之前的平台使用setAlpha()、setTranslationX()等方法。

　　经过前面几节的学习，我们已然知道了属性动画解决了视图动画的三个缺点，就算`NineOldAndroids`动画库没法真正修改视图的位置，那么它还是解决了视图动画的另外两个缺点。
　　另外，通过查看`View`类可以看到，`setAlpha()`、`setTranslationX()`等（透明度、平移、缩放）方法是在`Android3.0`中提出的，这几个`API`是十分有用的，`NineOldAndroids`里帮我们做了一些兼容，让我们在`Android3.0`之前就可以使用它们：
``` java
// 让view向下方移50像素。
ViewHelper.setTranslationY(view, 50);
// 让view宽度放大2倍。
ViewHelper.setScaleX(view, 2);
```
    语句解释：
    -  比如我们想让控件随着手指的滑动来平移、放大，就可以使用上面的工具类：ViewHelper。
       -  示例项目地址：https://github.com/BlueMor/Android-PullLayout 。
    -  通过查看ViewHelper类的源码可以知道，ViewHelper类也是同样的逻辑，当设备是Android3.0或以上时，则会调用系统API，否则则会调用自己实现的API。 
       -  相应的，当设备是Android3.0之前时，ViewHelper类也只会改变View的视觉效果，View的实际位置等还是不会改变。

<br>　　因此，笔者提出如下的建议：

	-  如果你的项目是基于Android3.0或以上开发的，那么完全不需要使用NineOldAndroids库，直接用系统的API即可。
	-  如果基于Android3.0之前的版本：
	   -  如果你只是想用属性动画来动画一个非View对象，那么使用NineOldAndroids库完全没问题。
	   -  如果你想很方便的、真正意义的在Android3.0之前的设备上改变View位置、旋转等属性，那么NineOldAndroids库很难做到。


<br>**本节参考阅读：**
- [Android动画进阶—使用开源动画库nineoldandroids](http://blog.csdn.net/singwhatiwanna/article/details/17639987)
- [NineOldAndroids动画兼容库的使用](http://www.chengxuyuans.com/Android/87451.html)

<br><br>
