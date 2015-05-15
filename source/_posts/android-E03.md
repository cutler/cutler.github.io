title: 媒体篇　第三章 动画
date: 2015-2-6 20:34:10
create: 2015-5-15 12:29:42
categories: Android
---

　　Android框架提供了两种动画系统：

	-  Property Animation（属性动画）
	   -  使用Animator类来表示一个属性动画，在Android3.0中提出。
	-  View Animation（视图动画），视图动画框架中又包含两种动画：
	   -  Tween Animation（渐变动画）：使用Animation类表示一个渐变动画，渐变动画会为控件指定一个变化的范围，让控件在这个范围内不断的变化。它定义了平移、渐变、缩放、旋转四种操作。
	   -  Frame Animation（帧动画）：使用AnimationDrawable类表示一个帧动画，它通过短时间内连续播放多张图片，来达到动画的效果，和电影类似。

<br>　　在Android中实现动画的方式有两种：
	-  通过XML文件。依据不同的动画，在res文件夹下面建立对应的文件夹用于存放动画文件。每个动画文件对应一个xml文件。
	-  通过编写代码。直接在代码中new出一个动画对象。

<br>**视图动画和属性动画特点**

　　视图动画提供的功能，只针对动画View对象，所以如果你想动画非View对象，你要自己来实现。 
　　视图动画的缺点是：
	-  视图动画不是会修改View本身。 虽然你的动画在屏幕上移动一个按钮后，从屏幕上来看按钮确实被移动到了新的位置，但按钮实际的位置不会改变，所以你要实现自己的逻辑来处理这个问题。
	-  视图动画系统事实上只能暴露一个View对象几个方面的动画，如缩放和旋转视图。它没法把View的背景颜色等属性进行动态变化。

<br>　　视图动画的缺点在属性动画中完全被消除了，你可以动画任何对象的任何属性（视图和非视图），并且对象本身实际（尺寸、位置等）也是会被修改。
　　属性动画的缺点是：在`Android3.0`中才被提出。 
　　但是万事总有一线生机，现在有一个名为`NineOldAndroids`动画库，可以让低于`Android3.0（API Level 11）`的项目使用上属性动画。它的作者是非常牛逼的`JakeWharton`，好几个著名的开源库都是他的作品。
　　项目的官网为：http://nineoldandroids.com/ ，`JakeWharton`的`Github`主页为：https://github.com/JakeWharton 。

<br>**如何选择？**
　　使用视图动画可以花费更少的时间，更少的代码，因此如果视图动画完成了你需要做的，或者你现有的代码已经完成了工作，那就没有必要使用属性动画系统。

# 第一节 视图动画 #
　　视图动画框架同时支持`Tween动画`和`Frame动画`，它都可以用`XML`声明。

## Tween动画 ##
　　Android提供了四种Tween动画：`透明`、`平移`、`旋转`、`缩放`。

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

## Frame动画 ##
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
暂缓。



<br>**本节参考阅读：**
- [Android动画进阶—使用开源动画库nineoldandroids](http://blog.csdn.net/singwhatiwanna/article/details/17639987)

<br><br>
