title: 第三章 用户界面 — 常用控件
date: 2015-1-25 14:37:55
categories: Android
---
　　本章将介绍一下Android中常用的控件，如：TextView、Button、RadioButton等。

# 第一节 简单控件 #
## TextView ##
　　TextView是一个文本控件，用来显示一行文本，在文本中可以包含图片、超链接、HTML代码等。

　　在XML文件中使用`<TextView>`标签可以构建出一个文本控件，每个`<TextView>`标签都对应于TextView类的一个实例。

<br>　　范例1：`<TextView>`标签。
``` xml
<TextView
    android:id="@+id/notify"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="请输入您的联系电话："/>
```
　　属性解释：
``` xml
android:id                  为当前标签指定一个ID，ID保存在R.java中。           可选。
android:layout_width        指出当前控件在其父组件中所占据的宽度。              可选。
android:layout_height	    指出当前控件在其父组件中所占据的高度。              可选。
android:text                指出标签所要显示的数据，可直接指定字符串常量。       可选。
```
　　提示：
	-  表达式：“@+id/notify”的含义：向R的内部类id中添加一个名为notify静态常量，若R中不存在内部类id，则要先创建内部类id ，若存在，则不会再建立，而是直接在其内创建一个名为notify的静态常量。 若notify静态常量也存在，则不执行任何操作，仅会将notify的引用返回来。
	-  当前组件在其父组件中所占据的宽度和高度的值可以是： 
	   -  具体的数值。如：89dp 。
	   -  关键字：match_parent、fill_parent、wrap_content。

<br>　　组件常用的尺寸单位：
``` xml
单位                                         描述
px (pixels)                像素。
dip或dp                    设备独立像素。根据当前屏幕分辨率，自动调节控件的大小。
pt                         点，一般用于设置字体的大小。
sp                         一般用于设置字体的大小，常用。
```

<br>　　范例2：响应点击事件。
``` xml
<TextView
    android:id="@+id/notify"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="请输入您的联系电话："
    android:clickable="true"
    android:onClick="onClick"/>
```
　　属性解释：
``` xml
android:onClick    在当前组件被点击时，应该调用的处理点击事件的方法。该方法需要在引用当前xml文件的Activity中定义。
方法的签名应该为：  public void 方法名(View view)
即：
|-  必须是public的。
|-  必须是void的。
|-  必须有且只有一个View类型的参数。
|-  其中“方法名”是android:onClick属性的值。

android:clickable  设置当前View是否可以接收点击事件，若设置为false则android:onClick属性的值将被忽略。
```

<br>　　在代码中可以通过调用TextView类的`setText()`和`getText()`方法，来设置和获取TextView对象所显示的文字。

<br>　　范例3：背景色、单行显示、字体大小、文字对其方式。
``` xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#cccfff"
    android:text="@string/text"
    android:singleLine="true"
    android:id="@+id/notify"
    android:textSize="20sp"
    android:gravity="right"/>
```
　　属性解释：
``` xml
android:background  设置当前标签控件所占据的空间的背景色。
android:singleLine  设置标签上的文字，是否全部显示在同一行中。若是，当文字一行显示不开时，则使用 … 代替。
android:textSize    设置字体的大小，通常的单位为sp。
android:gravity     设置标签上的文字在当前标签控件所占据的空间中的对齐方式。
```

<br>　　TextView是支持滚动条滑动的，当TextView的内容超出了其宽或高则就可以使用其内置滚动条了。
 
<br>　　范例4：启用内置水平、垂直滚动条。
``` xml
<!-- 水平滚动条 -->
<TextView
    android:id="@+id/tv"
    android:layout_width="310dp"
    android:layout_height="110dp"
    android:scrollHorizontally="true"
    android:text="bbbbb" />

<!-- 垂直滚动条 -->
<TextView
    android:id="@+id/tv2"
    android:layout_width="310dp"
    android:layout_height="110dp"
    android:scrollbars="vertical"
    android:text="bbbbb" />
```
<br>　　在Activity中还需要写上如下代码：
``` android
TextView text = (TextView) findViewById(R.id.tv);
text.setMovementMethod(ScrollingMovementMethod.getInstance());
```
　　值得注意的是，水平和垂直滚动条不可以同时存在。

<br>　　范例5：发光字体。
``` xml
<TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:shadowColor="@color/blue"
    android:shadowDx="-2"
    android:shadowDy="0"
    android:shadowRadius="6"
    android:text="曲 : 周杰伦/ 词:黄俊郎 "
    android:textColor="@android:color/white"
    android:textSize="16sp" />
```
　　属性解释：
``` xml
android:shadowColor       设置文字的阴影色。              
android:shadowDx          设置文字的阴影，距离文字的水平偏移量。 
android:shadowDy          设置文字的阴影，距离文字的垂直偏移量。 
android:shadowRadius      设置文字的阴影半径(范围)。        
```

<br>　　范例6：设置行数。
``` xml
<TextView
    android:layout_width="50dp"
    android:layout_height="350dp"
    android:background="@color/grey"
    android:lines="2"
    android:text="AAAABBBBBBBBBCCCCCCC" />
```
    语句解释：
    -  若layout_height属性的值为wrap_content且也设置了android:lines属性的值，则TextView的最终高度为行高*android:lines的值。
    -  若layout_height属性的值为具体的数值，则TextView的最终高度就是该属性的值。
       -  若指定了android:lines属性，且TextView的实际内容超过了android:lines的值，则TextView就只会显示android:text属性的前android:lines行的内容。 注意：
          -  即便TextView的高度完全可以显示更多的内容，TextView也不会显示。
          -  虽然只显示指定的行内容，但调用TextView的getText()方法返回的内容确是完整的。

<br>　　范例7：ellipsize。
``` xml
<TextView
    android:layout_width="49dp"
    android:layout_height="wrap_content"
    android:ellipsize="end"
    android:singleLine="true"
    android:text="AAAABBBBB" />
```
    语句解释：
    -  使用android:ellipsize属性可以设置，当前TextView显示不了所有的文本时，使用“…”来代替未显示的文本。取值：
       -  start：在文本的开始位置显示“…”。
       -  middle：在文本的中间位置显示“…”。
       -  end：在文本的结束位置显示“…”。
       -  marquee：使用循环滚动方式显示文本。
    -  使用android:lines="1" 是不会显示出“…”的。

## ImageView ##
　　ImageView是一个用来显示图片的控件，在XML文件中使用`<ImageView>`标签表示。

<br>　　范例1：`<ImageView>`标签。
``` xml
<ImageView 
    android:src="@drawable/icon"
    android:layout_width="wrap_content" 
    android:layout_height="match_parent"
    android:layout_gravity="center" />
```
　　属性解释：
``` xml
android:src	         指定图片的资源ID。 

android:layout_gravity	 指定当前控件在其父元素内部的对齐方式。
常用对齐方式：
水平左对齐(left)、水平右对齐(right)、水平垂直居中(center)、垂直顶对齐(top)、垂直底部对齐(bottom)。    
```

<br>　　范例2：动态修改显示图片。
``` xml
<!-- 当图片被点击的时候，会自动调用Activity的onImageViewClick方法。 -->
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:id="@+id/img"
    android:src="@drawable/a"
    android:onClick="onImageViewClick"/>
```
　　Java代码：
``` android
public class ViewTextActivity extends Activity {
    public void onImageViewClick(View view){
        // 调用Activity类的方法,并指定ID,从当前xml布局文件中获取ImageView控件。
        ImageView img = (ImageView) this.findViewById(R.id.img);
        // 修改ImageView控件所显示的图片。
        img.setImageResource(R.drawable.b);
    }
}
```

## ProgressBar ##
　　ProgressBar是一个进度条控件，在XML文件中使用`<ProgressBar>`标签定义一个进度条。

<br>　　范例1：进度条。
``` xml
<ProgressBar
    android:id="@+id/firstPro"
    style="?android:attr/progressBarStyleHorizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:visibility="gone"/>
```
　　属性解释：
``` xml
style               进度条有圆形和条形两种显示风格，默认为圆形风格。使用style属性可以设置Progress显示风格。
android:visibility  此属性继承自View类，任何View的子类都可以使用它。此属性来设置当前控件是否可见。  
```

<br>　　范例2：ProgressBar类的常用方法。
``` android
//  设置ProgressBar对象的当前进度值。
public synchronized void setProgress (int progress)

//  设置ProgressBar对象的最大值。默认为100。
public synchronized void setMax (int max)

//  获取ProgressBar对象的当前值。
public synchronized int getProgress ()

//  获取ProgressBar对象的第二进度条的当前值。
public synchronized int getSecondaryProgress ()

//  设置ProgressBar对象的第二进度条的当前值。 第二进度条通常用来显示缓冲的进度，如：视频缓冲进度。
public synchronized void setSecondaryProgress (int secondaryProgress)

```

<br>　　范例3：代码片段。
``` android
class UpdateBar extends Thread{
    private int i = 0;
    public void run(){
        progressbar.setMax(100);
        while(progressbar.getProgress() <= 100){
            progressbar.setProgress(i++);
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {}
        }
    }
}
```
    语句解释：
    -  实例化出一个UpdateBar的对象，然后启动它即可。
    -  进度条的实现原理：通过线程不断的调用进度条的setProgress方法来更新进度条。

## SeekBar ##
　　SeekBar是一个可拖动的进度条。用户可以通过拖动手柄，来调整进度条的当前位置。一般用于音乐、视频播放器中。


<center>
![SeekBar预览图](/img/quick-cocos2d-x/quick_5_12.png)
</center>

　　SeekBar是ProgressBar的间接子类，因此可以按照操作ProgressBar的方式，操作SeekBar。

<br>　　范例1：SeekBar标签。
``` xml
<SeekBar
    android:id="@+id/seekBar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
```

<br>　　范例2：SeekBar类的常用方法。
``` android
//  为当前SeekBar添加一个监听器。当SeekBar的值被改变、被拖动时会触发相应的事件。
public void setOnSeekBarChangeListener (SeekBar.OnSeekBarChangeListener l)

```

<br>　　范例3：SeekBar.OnSeekBarChangeListener接口。
``` android
//  当SeekBar的值被改变时，触发此方法。
//  progress：SeekBar的当前值。  
//  fromUser：当前事件是否由用户拖动或点击SeekBar而导致的。
//            因为SeekBar的值改变有程序调用setProgress()和用户拖动或点击SeekBar两种情况。  
public abstract void onProgressChanged (SeekBar seekBar, int progress, boolean fromUser)

//  当SeekBar被用户点击时，调用此方法。此方法只在用户按下SeekBar时调用一次。
public abstract void onStartTrackingTouch (SeekBar seekBar)

//  当用户从SeekBar上抬起了手指后，调用此方法。此方法只会调用一次。
public abstract void onStopTrackingTouch (SeekBar seekBar)
```

## 滚动条 ##
　　在Android中有垂直滚动条（ScrollView）和水平滚动条（HorizontalScrollView）两种。

<br>　　范例1：添加垂直滚动条。
``` xml
<ScrollView
   	android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:id="@+id/content"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
</ScrollView>
```
    语句解释：
    -  当控件的内容超出控件的大小时，垂直滚动条就会显示出来。
    -  关于ScrollView有三点注意事项：
       -  首先，ScrollView仅在垂直方向上有滚动条。
       -  然后，ScrollView内仅可以包含一个子View。
       -  最后，子View可以是一个简单的View，如按钮、标签等，也可以是一个布局。

<br>　　范例2：水平滚动条。
``` xml
<HorizontalScrollView
    android:layout_width="200dp"
    android:layout_height="200dp"
    android:id="@+id/horizontalScroll">
        <TextView
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:id="@+id/content"
            android:text="@string/hello" />
</HorizontalScrollView>

```
    语句解释：
    -  当控件的内容超出控件的大小时，垂直滚动条就会显示出来。

<br>　　View类提供了一个`scrollBy (int x, int y)`方法，用来将控件的滚动条从当前位置上，向右移动x像素，向下方移动y像素。

	-  在使用ScrollView时参数x无效。
	-  在使用HorizontalScrollView时参数y无效。

# 第二节 输入控件 #
　　输入控件是应用程序的用户接口的一种交互式组件。Android提供了大量的可供人们在UI中使用的控件，比如按钮、文本区域、(带滑块的)进度条、复选框、缩放按钮以及切换按钮等等。

## Button ##
　　Button表示一个按钮，按钮包括文字或者图标，或者两者兼而有之，当用户触摸到按钮时就会触发事件。

<center>
![Button](/img/android/android_3_3.png)
</center>

　　按照你的需要按钮可以设置文本、图标或两者兼而有之，您可以以三种方式创建按钮布局：


## Notifications ##


## Styles and Themes ##

<br><br>