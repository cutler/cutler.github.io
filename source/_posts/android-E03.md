title: 媒体篇　第三章 动画
date: 2015-2-6 20:34:10
create: 2015-5-15 12:29:42
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

<br>　　视图动画的缺点在属性动画中完全被消除了，你可以动画任何对象的任何属性（视图和非视图），并且对象本身实际（尺寸、位置等）也是会被修改。
　　属性动画的缺点是：在`Android3.0`中才被提出。 
　　但是万事总有一线生机，现在有一个名为`NineOldAndroids`动画库，可以让低于`Android3.0(API Level 11)`的项目使用上属性动画。它的作者是非常牛逼的`JakeWharton`，好几个著名的开源库都是他的作品。
　　项目的官网为：http://nineoldandroids.com/ ，`JakeWharton`的`Github`主页为：https://github.com/JakeWharton 。

<br>**如何选择？**
　　使用视图动画可以花费更少的时间，更少的代码，因此如果视图动画完成了你需要做的，或者你现有的代码已经完成了工作，那就没有必要使用属性动画系统。

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

　　上图中`灰色部分`是一个线性布局，布局内有`TextView`和`Button`两个控件 。若此时按钮B需要播放一个平移动画，那么按钮B的平移动画的`可视范围`则是线性布局所占据的区域，即上图中的灰色部分。 

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
    -  android:fromDegrees	   设置控件(相对于0度)最初倾斜角度。若值为0则控件不倾斜。
    -  android:toDegrees	     设置控件(相对于0度)最终倾斜角度，若值与fromDegrees相等则控件不倾斜。
    -  android:pivotX和pivotY	设置控件旋转时所用的参照点的X和Y轴坐标。

    若将fromDegrees或toDegrees属性的值设置为负数，则动画会按照逆时针旋转。

<br>　　范例2：RotateAnimation类。
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

# 第二节 属性动画 #
　　简单的说，视图动画可以实现的功能，属性动画基本都可以实现，视图动画的缺点，在属性动画中都不存在了。而且，使用的时候我们只需要告诉系统`动画的运行时长`，需要执行`哪种类型的动画`，以及`动画的初始值和结束值`，剩下的工作就可以全部交给系统去完成了。

　　在介绍属性动画之前，首先得需要从的[ NineOldAndroids 官网 ](http://nineoldandroids.com)上下载最新的`NineOldAndroids`动画库源码，如果感觉源码管理起来麻烦，也可以把它们打包成一个`jar`包。


<br>　　笔者在此声明，本节主要参考阅读下面`CSDN郭霖`的三篇文章（有细节上的修改，但几乎可以算是原样抄袭！）：
- [Android属性动画完全解析(上)，初识属性动画的基本用法](http://blog.csdn.net/guolin_blog/article/details/43536355#)
- [Android属性动画完全解析(中)，ValueAnimator和ObjectAnimator的高级用法](http://blog.csdn.net/guolin_blog/article/details/43816093)
  
　　本节参考的其他文章将在本节末尾处列出。

## ValueAnimator ##
　　`ValueAnimator`是整个属性动画机制当中最核心的一个类。我们只需要将`初始值和结束值`提供给`ValueAnimator`，并且告诉它动画所需运行的时长，那么`ValueAnimator`就会自动帮我们完成`从初始值平滑地过渡到结束值`这样的效果。除此之外，`ValueAnimator`还负责管理动画的播放次数、播放模式、以及对动画设置监听器等，确实是一个非常重要的类。

<br>　　但是`ValueAnimator`的用法却很简单，我们先从最简单的功能看起吧，比如说想要将一个值从`0`平滑过渡到`1`，时长`300`毫秒，就可以这样写：
``` android
// 使用ofFloat()方法来创建一个ValueAnimator对象，其中参数0和1就表示将值从0平滑过渡到1。ofFloat()方法当中允许传入多个float类型的参数。
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
// setDuration()方法来设置动画运行的时长。
anim.setDuration(300);
// 启动动画。
anim.start();
```
    语句解释：
    -  值得注意的，本范例使用的是com.nineoldandroids.animation.ValueAnimator类。

<br>　　如果你运行一下上面的代码，程序只是一个将值从`0`过渡到`1`的动画，无法看到任何界面效果，我们需要借助监听器才能知道这个动画是否已经真正运行了，如下所示：
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
    -  在动画执行的过程中系统会不断地进行回调onAnimationUpdate()方法，我们只需要在回调方法当中将当前的值取出并打印出来。
    -  回调onAnimationUpdate()方法的时间间隔是ValueAnimator类根据你设置的初始值、结束值、动画时间三个参数来计算出来的，不需要我们设置，它会尽可能的让动画平滑的播放出来（即在使用最少的回调次数上，保证动画流畅）。

<br>　　另外`ofFloat()`方法当中是可以传入任意多个参数的，因此我们还可以构建出更加复杂的动画逻辑，比如说将一个值在`5`秒内从`0`过渡到`5`，再过渡到`3`，再过渡到`10`，就可以这样写：
``` android
ValueAnimator anim = ValueAnimator.ofFloat(0f, 5f, 3f, 10f);
anim.setDuration(5000);
anim.start();
```
    语句解释：
    -  如果只是希望将一个整数值从0平滑地过渡到100，那么也很简单，只需要调用ValueAnimator.ofInt(0, 100)就可以了。
    -  调用setRepeatCount()设置循环播放的次数，默认为1次，ValueAnimator.INFINITE为无限循环。
    -  调用setRepeatMode()设置循环播放的模式：
       -  RESTART（默认），动画播放到结尾时，直接从开头再播放。
       -  REVERSE，动画播放到结尾时，再从结尾再往开头播放。
    -  除此之外，我们还可以调用setStartDelay()方法来设置动画延迟播放的时间等等。

## ObjectAnimator ##
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

## 组合动画 ##
　　独立的动画能够实现的视觉效果毕竟是相当有限的，因此将多个动画组合到一起播放就显得尤为重要。幸运的是，Android团队在设计属性动画的时候也充分考虑到了组合动画的功能，因此提供了一套非常丰富的`API`来让我们将多个动画组合到一起。
　　实现组合动画功能主要需要借助`AnimatorSet`这个类，这个类提供了一个`play()`方法，如果我们向这个方法中传入一个`Animator`对象(`ValueAnimator`或`ObjectAnimator`)将会返回一个`AnimatorSet.Builder`的实例，`AnimatorSet.Builder`中包括以下四个方法：

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

## Animator监听器 ##
　　在很多时候，我们希望可以监听到动画的各种事件，比如动画何时开始，何时结束，然后在开始或者结束的时候去执行一些逻辑处理。这个功能是完全可以实现的，`Animator`类(ValueAnimator、AnimatorSet都继承自它)当中提供了一个`addListener()`方法，这个方法接收一个`AnimatorListener`，我们只需要去实现这个`AnimatorListener`就可以监听动画的各种事件了。

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
```

<br>　　但是也许很多时候我们并不想要监听那么多个事件，可能我只想要监听动画结束这一个事件，那么每次都要将四个接口全部实现一遍就显得非常繁琐。没关系，为此Android提供了一个适配器类，叫作`AnimatorListenerAdapter`，使用这个类就可以解决掉实现接口繁琐的问题了，如下所示：
``` android
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
    }
});
```

## 使用XML编写动画 ##
　　我们可以使用代码来编写所有的动画功能，这也是最常用的一种做法。不过，过去的补间动画除了使用代码编写之外也是可以使用`XML`编写的，因此属性动画也提供了这一功能，即通过`XML`来完成和代码一样的属性动画功能。
　　通过`XML`来编写动画可能会比通过代码来编写动画要慢一些，但是在重用方面将会变得非常轻松，比如某个将通用的动画编写到`XML`里面，我们就可以在各个界面当中轻松去重用它。
　　如果想要使用`XML`来编写动画，首先要在`res`目录下面新建一个`animator`文件夹，所有属性动画的`XML`文件都应该存放在这个文件夹当中。然后在`XML`文件中我们一共可以使用如下三种标签：


<br>**本节参考阅读：**
- [Android动画进阶—使用开源动画库nineoldandroids](http://blog.csdn.net/singwhatiwanna/article/details/17639987)

<br><br>
