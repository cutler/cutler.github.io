title: UI篇　第二章 常用控件
date: 2015-1-25 14:37:55
create: 2015-1-25 14:37:55
categories: android
---
　　本章将介绍一下`Android`中常用的控件，如：`TextView`、`Button`、`RadioButton`等。

# 第一节 简单控件 #
## TextView ##
　　`TextView`是一个文本控件，用来显示一行文本，在文本中可以包含图片、超链接、HTML代码等。

　　在XML文件中使用`<TextView>`标签可以构建出一个文本控件，每个`<TextView>`标签都对应于`TextView`类的一个实例。

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

<br>　　在代码中可以通过调用`TextView`类的`setText()`和`getText()`方法，来设置和获取`TextView`对象所显示的文字。

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

<br>　　`TextView`是支持滚动条滑动的，当`TextView`的内容超出了其宽或高则就可以使用其内置滚动条了。
 
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
　　`ImageView`是一个用来显示图片的控件，在XML文件中使用`<ImageView>`标签表示。

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
　　`ProgressBar`是一个进度条控件，在XML文件中使用`<ProgressBar>`标签定义一个进度条。

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
　　`SeekBar`是一个可拖动的进度条。用户可以通过拖动手柄，来调整进度条的当前位置。一般用于音乐、视频播放器中。


<center>
![SeekBar预览图](/img/quick-cocos2d-x/quick_5_12.png)
</center>

　　`SeekBar`是`ProgressBar`的间接子类，因此可以按照操作`ProgressBar`的方式，操作`SeekBar`。

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
　　`Button`表示一个按钮，按钮可以包括文字或者图标，或者两者兼而有之，当用户触摸到按钮时就会触发事件。

<center>
![Button](/img/android/android_3_3.png)
</center>

　　您可以以三种方式创建按钮布局：
``` xml
<!-- 有文字的按钮 -->
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/button_text"/>

<!-- 有图标的按钮 -->
<ImageButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/button_icon"/>

<!-- 有文字和图标的按钮 -->
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/button_text"
    android:drawableLeft="@drawable/button_icon"/>
```

<br>**使用事件监听器**
　　您也可以声明单击事件处理程序，而不是在XML布局中通过`android:clickable`属性。这可能是必要的，如果你在运行时实例化`<Button>`，或者你需要在一`<Fragment>`子类中声明单击事件。

　　为了声明事件处理程序，你需要创建一个`View.OnClickListener`类的对象，并将它分配给按钮。例如：
``` android
Button button = (Button) findViewById(R.id.button_send);
// 为当前Button对象添加一个事件监听器。当用户点击此按钮时，会触发此监听器。
button.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        // Do something in response to button click
    }
});
```

<br>**按钮的样式**
　　按钮的外观（背景图片和字体）可能会因为机器不同而有所不同，因为不同厂家的设备的输入控件的默认样式往往不同。
　　您可以控制控件使用适用于整个应用程序的样式。例如，要确保所有运行`Android4.0`甚至更高版本的设备在您的应用程序使用Holo主题，需要在manifest的`<application>`元素中声明`android:theme="@android:style/Theme.Holo"`。
　　
　　另外，您可以使用一种类似于HTML的样式来定义按钮的样式，可以定义多种属性，如背景、字体、大小等等。关于应用样式的更多信息，请参阅后面章节。

<br>**无边框按钮**
　　一种有用的设计是无边框按钮。无边框按钮与基本按钮相似，但是无边框按钮没有无边框或背景，但在不同状态如点击时，会改变外观。要创建一个无边框“按钮，为按钮应用`borderlessButtonStyle`样式。

<center>
![无边框按钮](/img/android/android_3_4.png)
</center>

　　实例代码为：
``` xml
<Button
    android:id="@+id/button_send"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/button_send"
    android:onClick="sendMessage"
    style="?android:attr/borderlessButtonStyle" />
```

<br>**定制背景**
　　如果你想真正重新定义按钮的外观，你可以指定一个自定义的背景。而不是提供一个简单的位图或颜色，然而，你的背景应该是一个状态列表资源，可以使按钮能取决于按钮的当前状态而改变外观。
　　您可以在一个XML文件中定义状态列表，定义三种不同的图像或颜色，用于不同的按钮状态。

　　要为按钮的背景创建一个状态列表资源：
　　1、创建三个按钮背景位图以表示默认、按下和选中的按钮状态。为了确保图像适合不同大小的按钮，以`9-patch`的格式创建图像。
　　2、位图放到你工程的`res/drawable/`下面，确保每个位图命名正确能够反映它们分别代表的按钮状态。如：

	button_default.9.png、button_pressed.9.png、button_focused.9.png
　　3、在`res/drawable/ directory`下创建一个新的XML文件。使用下面的XML：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/button_pressed"
          android:state_pressed="true" />
    <item android:drawable="@drawable/button_focused"
          android:state_focused="true" />
    <item android:drawable="@drawable/button_default" />
</selector>
```
    语句解释：
    -  这定义一个单一的绘制资源，将基于按钮的当前状态改变其图像。
       -  第一个<item>定义了按下按钮（激活）时使用的位图。
       -  第二个<item>定义了按钮按下时（按钮高亮时，使用轨迹球或方向键）使用的位图。
       -  第三个<item>定义了默认状态下的按钮（既不是按下也不是选中）使用的位图。
    -  注意：<item>元素的顺序是重要的。当图像可用时，按顺序遍历<item>元素，以确定哪一个适合当前按钮状态。因为默认的位图在最后，当android:state_pressed 和android:state_focused的值都为false时才会被应用。


<br>　　现在，这个XML文件代表一个`Drawable`资源，当`<Button>`引用它作为背景，图像将基于按钮的三种状态而改变。
　　然后，只需应用此XML文件作为按钮的背景：
``` xml
<Button
    android:id="@+id/button_send"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/button_send"
    android:onClick="sendMessage"
    android:background="@drawable/button_custom"  />
```

## EditText ##
　　文本框允许用户在应用程序中输入文本。它们可以是单行的，也可以是多行的。点击文本框后显示光标，并自动显示键盘。除了输入，文本框还包含其它操作，比如文本选择（剪切，复制，粘贴）以及自动完成的数据查找。
　　你可以在布局中添加一个文本框字段`EditText`， android里的写法通常是在XML布局文件中添加`<EditText>`元素

<br>**指定键盘类型**
　　EditText可以限制用户不同的输入类型，如数字，日期，密码，或电子邮件地址。输入类型决定文本框内允许输入什么样的字符，它可能会提示虚拟键盘，其布局优化常用的字符。
　　你可以使用EditText对象的`android:inputType`属性指定输入类型的键盘，例如：你想输入一个电子邮件地址上的用户，`inputType`属性应为`textEmailAddress`。
``` xml
<EditText
    android:id="@+id/email_address"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:inputType="textEmailAddress" />
```

　　默认类型的软键盘：

<center>
![](/img/android/android_3_5.png)
</center>

　　textEmailAddress类型的软键盘：

<center>
![](/img/android/android_3_6.png)
</center>

　　针对不同的情况有几种不同的输入类型。你可以找到所有的文件中列出的`android:inputType`属性值：

	-  text：普通的文本键盘。
	-  textEmailAddress：普通的文本键盘，同时多一个“@”字符。
	-  textUri：普通的文本键盘，同时多一个“/”字符。
	-  number：普通的数字键盘。
	-  phone：电话号码类型的键盘。

<br>**控制其他行为**
　　`android:inputType`还允许您指定操作行为，如在键盘上是否要首字母大写所有新词，或使用自动完成和拼写建议功能。
　　`android:inputType`属性允许按位组合，让您可以一次指定一个键盘布局和一个或多个操作行为。例如，你如何收集邮政地址，利用每一个字，并禁用文字的行为。
　　下面列出了常见的定义键盘行为的`inputType`值：

	-  textCapSentences：普通的文本键盘，将每个新句子的第一个字母转为大写。
	-  textCapWords：普通的文本键盘，将每个单词的第一个字母转为大写，适用于人名。
	-  textAutoCorrect：普通的文本键盘，纠正一般的单词拼写错误。
	-  textPassword：普通的文本键盘，所有输入到文本框中的内容都回显为“•”符号。
	-  textMultiLine：普通的文本键盘，允许用户输入包含换行符的长文本。
``` xml
<EditText
    android:id="@+id/postal_address"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:hint="@string/postal_address_hint"
    android:inputType="textPostalAddress|textCapWords|textNoSuggestions" />
```

<br>**指定键盘操作**
　　除了改变键盘的输入类型，当用户完成输入时，android允许你指定特殊的按钮进行相应的操作，如把回车键作为 “搜索”或 “发送”操作。
　　您可以通过`android:imeOptions`属性设置指定的动作。例如，这里你可以指定发送的行为：
``` xml
<EditText
    android:id="@+id/editText"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:imeOptions="actionSearch"
    android:inputType="text"
    android:text="actionSearch" />
```

　　如果你不明确指定一个输入动作(`action`)，当用户点击右下角的按钮时，系统将尝试确定是否有任何后续的`android:focusable`属性动作。
　　如果发现了有`android:focusable`属性动作，那么这个系统适用于在当前的EditText的action则为`actionNext`，这样使用户可以选择“下一步”或移动到下一个字段。
　　如果是没有后续的`focusable`属性，那该系统适用`actionDone`动作，你也可以通过设置`android:imeOptions`属性使系统更改到其它值，如`actionSend`或`actionSearch`或禁止使用`actionNone`动作的默认行为。

　　这里举几个常用的常量值：

	-  actionGo 去往，对应常量EditorInfo.IME_ACTION_GO。 
	-  actionSearch 搜索，对应常量EditorInfo.IME_ACTION_SEARCH。
	-  actionSend 发送，对应常量EditorInfo.IME_ACTION_SEND。
	-  actionNext 下一个，对应常量EditorInfo.IME_ACTION_NEXT。
	-  actionDone 完成，对应常量EditorInfo.IME_ACTION_DONE。
	-  actionNone 没有动作,对应常量EditorInfo.IME_ACTION_NONE。

　　提示：EditText的`android:inputType`属性的值默认是`none`，若不去修改它的默认值，则`android:imeOptions`属性是不起作用的，将`none`改为`text`即可。

<br>**响应按钮事件**
　　如果您已指定键盘采用`android:imeOptions`属性（`actionSend`等）的操作方法，你可以使用`TextView.OnEditorActionListener`监听事件行为。
　　`OnEditorActionListener`接口提供了一个回调方法`onEditorAction()`，它通过输入的动作ID，如`IME_ACTION_SEND`或`IME_ACTION_SEARCH`行为调用相关的动作类型方法。
``` android
EditText editText = (EditText) findViewById(R.id.search);
editText.setOnEditorActionListener(new OnEditorActionListener() {
    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        boolean handled = false;
        if (actionId == EditorInfo.IME_ACTION_SEND) {
            sendMessage();
            handled = true;
        }
        return handled;
    }
});
```

<br>**其他用法**

<br>　　范例1：`<EditText>`标签。
``` xml
<EditText
    android:id="@+id/content"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:maxLines="1"
    android:minLines="3"/>
```
　　属性解释：
``` xml
android:id          一般都需要为文本框指定一个id，以便在Activity中引用此文本框。  
android:minLines    设置文本框的高度，即最少可以容纳数据的行数。 
android:maxLines    设置文本框的高度，即最多容纳数据的行数。多出的数据，不会导致文本框的高度变大。
android:password    若取值为true则密文显示当前文本框中的内容。
android:hint        设置文本框中的背景文字。用户向文本框输入数据时，背景文字会自动消失。
```

<br>　　范例2：限制数据。
``` xml
<EditText
    android:id="@+id/content"
    android:numeric="integer"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
```
    语句解释：
    -  若文本框需要用户只能输入数字，则android:numeric属性置为integer即可。 取值：
	   -  decimal：0或正整数、小数。
	   -  integer：0或正整数。
	   -  signed：0、负、正整数。
	-  使用android:phoneNumber="true"属性可以设置文本框，只接收电话号码。
	-  使用android:digits="fee24a"属性可以枚举出当前TextView所能接收的字符，用户将无法输入其他字符。
	-  属性android:inputType="number"的效果和android:numeric="integer" 一样。它们都会修改软件盘的布局。

<br>　　范例3：EditText类常用方法。
``` android
//  以Editable类型的对象，将文本框中的数据返回。修改Editable对象中的数据会导致文本框中当前保存的数据一同被修改。
public Editable getText()

//  选择出文本框中的所有内容。 
public void selectAll()

//  选择出文本框中的内容，从start(包括)开始到stop(不包括)结束。 
public void setSelection(int start, int stop)

//  将文本框的当前输入位置，设置到指定位置的前面。 若下标<0或>上界则程序报错。
public void setSelection(int index)
```

<br>　　范例4：Editable接口。
``` android
//  向当前对象中添加指定CharSequence对象。修改了Editable对象中的数据，会导致文本框中的数据同步改变。
//  若想获取EditText中的内容，可以调用Editable的toString方法。
public abstract Editable append(CharSequence text)

//  清空文本框中的数据。 
public abstract void clear()
```

<br>　　范例5：密码的显示和隐藏。
``` android
// 明文显示密码。
editText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
// 密文显示密码。
editText.setTransformationMethod(PasswordTransformationMethod.getInstance());
```

## CheckBox ##
　　复选框(俗称`多选按钮`)允许用户从列表中选择一个或多个选项。通常，你应该在垂直的列表中显示每一个选项。

<center>
![](/img/android/android_3_8.png)
</center>

　　当你要创建一个复选框时，你就必须要在你的布局文件中创建一个`CheckBox`字段。因为一组复选框选项允许用户选择多个选项，而且每个复选框分开管理，你必须为每一个选项注册点击监听器。

　　在XML文件中使用`<CheckBox>`标签定义一个多选按钮，每个`<CheckBox>`标签都对应于`CheckBox`类的一个实例。
``` xml
<CheckBox
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:id="@+id/java"
    android:text="Java"/>
```

<br>**响应单击事件**
　　当用户选择一个复选框中的选项时，该复选框对象接收`onClick`事件，当复选框的选中状态被改变时，该复选框对象接受`onCheckedChange`事件。 因此这两种方案都可以处理复选框的点击事件。

<br>　　范例1：CheckBox类常用方法。
``` android
//  修改当前CheckBox的选定状态。true为选定，false为不选定。
public void setChecked(boolean checked)

//  查看当前CheckBox是否处于选定状态。
public boolean isChecked()

//  设置事件监听器。当当前按钮的选中状态改变时，会触发OnCheckedChange事件。
public void setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener listener)
```

<br>　　范例2：CompoundButton.OnCheckedChangeListener接口。 
``` android
//  当CheckBox触发OnCheckedChange事件时，事件监听器会触发此事件。
//  buttonView ：触发事件的CheckBox对象。
//  isCheck ：CheckBox对象是否处于选中状态。
public abstract void onCheckedChanged(CompoundButton buttonView, boolean isChecked)
```

<br>　　范例3：事件监听。
``` android
CheckBox box = (CheckBox) this.findViewById(R.id.java);
box.setOnCheckedChangeListener(new OnCheckedChangeListener(){
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        System.out.println(buttonView.getText()+"被选中? "+isChecked);
    }
});
```

<br>　　`CheckBox`和`RadioButton`都继承自`TextView` ，因此它们都具有`TextView`类提供的方法。

<br>　　范例4：监听onClick事件。
``` android
public void onCheckboxClicked(View view) {
    boolean isChecked = ((CheckBox) view).isChecked();
    switch(view.getId()) {
        case R.id.checkbox_meat:
            if (isChecked)
                // Put some meat on the sandwich
            else
                // Remove the meat
            break;
        case R.id.checkbox_cheese:
            if (isChecked)
                // Cheese me
            else
                // I'm lactose intolerant
            break;
        // TODO: Veggie sandwich
    }
}
```

## RadioButton ##
　　复选框允许用户从一系列选项中选择其中某个选项。
　　如果认为有必要让用户看到所有并列的可选项，并且各个选项中只能有一个被选择，那么单选框是个好选择。 
　　如果没有必要显示所有的并列选项，那么可以用`Spinner`下拉列表代替。

<center>
![](/img/android/android_3_9.png)
</center>

　　创建单个选项之前，需要在布局文件中创建选项按钮`RadioButton`。然而，因为复选按钮之间是互斥的，它们需要被放在同一个选项组框`RadioGroup`里。这样系统会认为在同一个选项组里每次只能有一个选项被选择。


　　即：
	-  在xml文件中使用<RadioButton>标签定义一个单选按钮。
	-  在xml文件中使用<RadioGroup>标签将多个单选按钮组成一个组，从而使组中的所有按钮同一时间只能有一个被选择。
	-  在xml文件中每个<RadioButton>标签都对应于RadioButton类的一个实例。标签<RadioGroup> 也同样如此。

<br>　　范例1：单选按钮。
``` xml
<RadioGroup
    android:id="@+id/group"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" >
    <RadioButton
        android:id="@+id/boy"
        android:text="男"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
    <RadioButton
        android:id="@+id/girle"
        android:text="女"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
</RadioGroup>
```

<br>　　范例2：RadioButton类。 
``` android
//  修改当前RadioButton对象的选定状态。true为选定。false为不选定。
public void setChecked(boolean checked)

//  查看当前RadioButton对象是否处于选定状态。
public boolean isChecked()
```

<br>　　范例3：RadioGroup类。 
``` android
//  监听当前按钮组中的按钮，当用户的选择改变时，会触发此事件。
public void setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener listener)
```

<br>　　范例4：RadioGroup.OnCheckedChangeListener接口。
``` android
//  监听当前按钮组中的按钮，当用户的选择改变时，会调用此方法。
//  group ：产生事件的RadioGroup对象。
//  checkeId ：当前被选中的RadioButton对象的id ，此id在R.java中定义。
public abstract void onCheckedChanged(RadioGroup group, int checkedId)
```

<br>　　范例5：监听按钮组。
``` android
RadioGroup g = (RadioGroup) this.findViewById(R.id.group);
g.setOnCheckedChangeListener(
    new OnCheckedChangeListener(){
    public void onCheckedChanged(RadioGroup radiogroup, int checkedId) {
        String sex = null;
        sex = (R.id.boy == checkedId ? "男":"女");
        System.out.println("您选择了："+sex);
    }
});
```
    语句解释：
    -  一般来说会在RadioGroup对象上添加事件监听器，当RadioGroup中的某个按钮的状态被改变了，就会触发onCheckedChanged方法。
    -  当然直接在RadioButton上进行监听也是可以的，选择哪种方案就看具体情况了。

## ToggleButton ##
　　`ToggleButton`是一个开关按钮，与普通Button的区别在于它有两种状态，选中和未选中。程序可以根据ToggleButton的当前状态，设置其所要显示的文本。
　　Android有两种开关按钮，在`Android4.0`之前，你可以添加一个基本的`ToggleButton`开关按钮对象到布局文件。 `Android 4.0`（API 级别14）中介绍了另外一种叫做`Switch`的切换按钮，这个按钮提供一个滑动控件，可以通过添加`Switch`对象来实现。

<center>
![](/img/android/android_3_10.png)
</center>

　　`Toggle Button`和`Switch`控件都是`CompoundButton`的子类并且有着相同的功能，所以你可以用同样的方法来实现他们功能。

<br>　　范例1：开关按钮。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent">
    <ToggleButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textOn="开"
        android:textOff="关"
        android:checked="true"
        android:paddingRight="20dp"
        android:onClick="onClick"
        android:background="@drawable/toggle_btn_bg" />
</LinearLayout>
```
　　属性解释：
``` xml
android:textOn    按钮处于选中状态时所要显示的文本。 
android:textOff   按钮处于非选中状态时所要显示的文本。
android:checked   设置按钮的当前是否处于选中状态。
```

<br>　　范例2：`toggle_btn_bg.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_checked="true" android:drawable="@drawable/bn_yes_bg"/>
    <item android:state_checked="false" android:drawable="@drawable/bn_no_bg"/>
</selector>

```
　　提示：本范例中涉及到的`<selector>`标签将在后面章节中详细介绍。

<br>　　范例3：控制文字的显示位置。
``` android
public void onClick(View view) {
    ToggleButton switchbtn = (ToggleButton) view;
    // 若当前按钮处于选中状态。
    if (switchbtn.isChecked()) {
        // 将按钮上的文本左对齐。
        switchbtn.setPadding(0, 0, switchbtn.getWidth() / 2, 0);
    } else {
        // 将按钮上的文本右对齐。
        switchbtn.setPadding(switchbtn.getWidth() / 2, 0, 0, 0);
    }
}
```
    语句解释：
    -  当ToggleButton的状态改变时，除了会改变按钮的background属性外，还会将按钮上的文本的位置改变。
    -  提示：如果需要改变按钮的状态，通过使用setChecked(boolean)或者toggle() 方法可以实现。


<br><br>