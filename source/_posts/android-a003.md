---
title: 第三章 UI篇
date: 2015-1-21 11:53:48
author: Cutler
categories: Android开发
---

# 第一节 基础知识 #

　　在`Android`的`framework`中已经提供了很多控件，每一个控件也都提供了很多的API接口，由于篇幅关系，在`“UI篇”`中只会列举出这些控件的基本用法，更复杂的用法请自行搜索。

## 概述 ##
　　在`Android`应用程序中，使用`View`和`ViewGroup`类来创建用户界面。

    -  View对象是用户界面的基础单元，如文本框和按钮等。
    -  ViewGroup对象是一个容器，可以包含View对象在其内部，各个View会按照不同的规则进行排列，像线性布局、相对布局。
    -  ViewGroup类是View类的子类，它内部既可以包含View对象，也可以包含另一个ViewGroup。 

<br>**View的层次结构**
　　通常，`Activity`的界面会众多控件组成，它们的组织结构是这样的：

<center>
![](/img/android/android_3_1.png)
</center>

<br>　　我们把这个结构，称为一个`“View hierarchy tree”`（View树）。

　　提示：

    Android会从树的顶部依次解析你的布局中的元素，并把它们添加到界面中，由于这些是依次绘制的，所以如果有位置重叠的元素，那么最后绘制的元素将位于之前在那个位置绘制的对象之上。

## 常用术语 ##

<br>**属性（Attributes）**
　　使用XML文件构建用户界面时，每个`View`和`ViewGroup`对象都对应一个`XML标签`，同时不同的标签支持不同的`XML属性`。比如：

    -  TextView标签的textSize属性（字体大小）、textColor属性（字体颜色）。
    -  LinearLayout标签的orientation属性（设置水平或垂直排列它的子元素）。

　　属性会被继承，因此View类中定义的属性，它的任何子类都可以直接使用（如`id`属性）。


<br>**id属性**
　　`android:id`属性用来唯一标识XML布局文件里的某个View，它的语法是：
``` xml
android:id="@+id/my_button"
```
    语句解释：
    -  开头的@符是一个资源标识符，指示XML解析器接应该继续解析后面的字符串。
    -  在@符后面可以跟随drawable、id、string等字符，其中id则标识了它是一个id资源。
    -  “+”号意味着如果在R.id类中没有对应的字段的话，则必须创建它并且要把它添加到我们的资源文件中（R.java文件），如果有了则不会再次创建。

　　当引用一个Android内部的资源`id`时，不需要`“+”`号，但必须像下例那样添加`android`包命名空间：
``` xml
android:id="@android:id/empty"
```
　　带有`android`包命名空间的地方，说明我们应用的是来自`android.R`资源类的一个`id`，而不是本地资源类。

<br>**布局参数**
　　每个`ViewGroup`类都实现了一个嵌套类，这个类继承了`ViewGroup.LayoutParams`。
　　这个子类封装了`ViewGroup`类的每个子`View`的布局信息（尺寸、位置等）。如下图所示：

<center>
![](/img/android/android_3_2.png)
</center>

　　每个子元素都应该要定义适合它的父元素的`LayoutParam`子类：

    比如被放入到LinearLayout的View对象应该为它指定一个LinearLayout.LayoutParams对象。

<br>**布局位置**
　　一个`View`就是一个`矩形`，它用矩形的左上角顶点坐标来表述它的位置，并且用宽和高来表述它的两边的尺寸：

    -  View类的getLeft()方法返回值代表了这个View的左上角的X坐标。
    -  View类的getTop()方法的返回值代表了这个View的左上角的Y坐标。
    -  View类的getWidth()方法的返回值代表了这个View的宽度。
    -  View类的getHeight()方法的返回值代表了这个View的高度。

　　这四个方法的返回值的单位都是像素，而且返回值是相对它的父元素的位置，也就是说：

    当getLeft方法返回20时，就意味着这个View对象被定为在距离它的父元素的左边缘的右边20个像素的位置。

<br>**尺寸**
　　一个View对象的尺寸(`size`)用宽和高来表述，一个View对象实际上有两对宽和高的值。

　　第一对是被叫做`测量宽度`和`测量高度`。

    -  这两个尺寸定义了一个View对象在它的父元素中想要的大小。
    -  调用getMeasuredWidth()和getMeasuredHeight()方法即可获得。

　　第二对被简单的叫做`宽度`和`高度`，或者某些时候被叫做`描画宽度`和`描画高度`。

    -  这两个尺寸定义了这个View对象在屏幕上的实际描画和布局尺寸。
    -  调用getWidth()和getHeight()方法即可获得。

　　至于为什么要存在两对宽高，后面会有介绍。

## 常用布局 ##
<br>**LinearLayout**
　　线性布局是一个视图组，它所有的子视图都在一个方向对齐，`水平`或者`垂直`。
　　线性布局的所有子视图排列都是一个靠着另一个，因此：

    -  垂直线性布局：布局内的所有控件，每个控件独占一行，所有控件从上到下垂直排放 。
    -  水平线性布局：布局内的所有控件从左到右排在一行中，若当前屏幕显示不下，则也不会另起一行。 整个行的行高，为高度最高的那个组件的高度。

<br>　　属性`android:orientation`指出线性布局的方式（默认值为水平布局），取值有两个： 

    -  垂直布局：vertical
    -  水平布局：horizontal

    
<br>　　范例1：`main.xml`文件。
``` xml
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:orientation="horizontal">

</LinearLayout>
```

<br>　　LinearLayout还支持给单独的子View分配权重（通过`android:layout_weight`属性），`默认权重值是0`。

    例如，如果有三个文本框，其中的两个声明的权重值是1，而另一个没有声明权重值（默认是0），那么第三个没有权重的文本框只会占据它的内容所需要的区域，尺寸并不会变大。
    此时系统会先绘制第三个文本框，然后再将剩余的空间交给前两个文本框平分。
    如果第三个文本框的权重是2（而不是0），那么这就声明了它比其他的两个更重要，因此它会获得总的剩余空间的一半，而另外两个则会平分剩余的空间。

<br>　　范例2：`android:layout_weight`属性。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:orientation="vertical" >
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="click1" />
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:text="click2" />
</LinearLayout>
```
    语句解释：
    -  LinearLayout的子控件使用android:layout_weight属性来为自己设置权重。
    -  LinearLayout按照其android:orientation属性设置的方向，将其自身的宽度或高度平均分成若干分。 
       -  平均分成多少份数是由其所有子View的android:layout_weight属性值的总和。本范例中LinearLayout的高度会被分成2份，两个Button将各占据一半的高度。
    -  若想保持某个子View的原始尺寸，则可以不设置android:layout_weight属性，或者将其值设为0。

<br>**RelativeLayout**
　　`RelativeLayout`顾名思义，相对布局，在这个容器内部的子元素们可以使用彼此之间的相对位置或者和父容器间的相对位置来进行定位。
　　默认情况下，所有的子视图在布局的左上角，所以你必须定义每个视图的位置。

<br>　　范例1：相对布局。
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="10dp">
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/text"
        android:id="@+id/notify"/>
    <EditText
        android:id="@+id/content"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_below="@+id/notify"/>
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/ok"
        android:text="确定"
        android:layout_below="@+id/content"
        android:layout_alignRight="@+id/content"/>
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:id="@+id/cancel"
        android:text="取消"
        android:layout_toLeftOf="@+id/ok"
        android:layout_alignTop="@+id/ok"
        android:layout_marginRight="20dp"/>
</RelativeLayout>
```

<br>　　范例2：属性解释。
``` android
android:layout_above            将当前控件的底部置于给定ID的控件之上。  
android:layout_below            将当前控件的顶部置于给定ID的控件之下。
android:layout_toLeftOf         将当前控件的右边缘和给定ID的控件的左边缘对齐。
android:layout_toRightOf            将当前控件的左边缘和给定ID的控件的右边缘对齐。
android:layout_alignBottom  将当前控件的底部边缘与给定ID控件的底部边缘对齐。
android:layout_alignLeft        将当前控件的左边缘与给定ID控件的左边缘对齐。 
android:layout_alignRight   将当前控件的右边缘与给定ID控件的右边缘对齐。
android:layout_alignTop         将当前控件的顶部边缘与给定ID控件的顶部对齐。
android:layout_alignBaseline    将当前控件的baseline和给定ID的控件的baseline对齐。
android:alignParentBottom   若为true，则将该控件的底部和父控件的底部对齐。  
android:layout_alignParentLeft  若为true，则将该控件的左边与父控件的左边对齐。
android:layout_alignParentRight 若为true，则将该控件的右边与父控件的右边对齐。
android:layout_alignParentTop   若为true，则将该控件的顶部与父控件的顶部对齐。
android:layout_centerHorizontal 若为true，则该控件将被至于水平方向的中央。
android:layout_centerVertical   若为true，则该控件将被至于垂直方向的中央。
android:layout_centerInParent   若为true，该控件将被至于父控件水平方向和垂直方向的中央。
```

<br>　　范例3：padding。
``` android
android:padding
android:paddingLeft="10dp"
android:paddingTop="20dp"
android:paddingRight="30dp"
android:paddingBottom="30dp"
```
    语句解释：
    -  使用android:padding属性设置当前控件的边框与正文的内容之间的间距。
    -  也可以使用其他四个属性，为当前控件的某条边框设置间距。

<br>　　范例4：margin。
``` xml
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent">
    <Button
        android:layout_marginLeft="30dp"
        android:layout_marginTop="30dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="按钮" />
</RelativeLayout>
```
    语句解释：
    -  使用android:layout_margin属性可以设置当前控件与相邻控件之间的间距。
    -  在相对布局中，控件的位置可以通过四个属性来唯一确定：左上角坐标、控件的宽高。

<br>**TableLayout**
　　TableLayout代表表格页面布局，它不显示行、列或单元格的边框线，表的每行会有多个带有单元格的列，单元格可以为空。

<br>　　范例1：`main.xml`文件。
``` xml
<TableLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="match_parent">
    <TableRow>
        <View />
        <View />
    </TableRow>
</TableLayout>
```
    语句解释：
    -  表格中的每一行使用<TableRow>标签来指定。行中有几个<View>则该行就拥有几列。
    -  在表格布局中，每个<View>的具体的宽高不要再使用关键字来指定。而应该使用具体的数值。
    -  在表格布局中，不再必须要为每一个View都提供layout_width和layout_height属性。

<br>　　`TableLayout`的每行有`0`或多个单元格，每个单元格都可以定义为任意类型的View对象。

<br>　　范例2：其他属性。
``` xml
<TableLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:stretchColumns="1" android:shrinkColumns="1">
    <TableRow>
        <View />
        <View />
    </TableRow>
</TableLayout>
```
    语句解释：
    -  属性android:shrinkColumns：若某行超长，则收缩指定的列，列的编号从0开始。
    -  属性android:stretchColumns：若某行中空间未填满，则拉伸指定的列，编号从0开始。

<br>　　范例3：跨列。
``` xml
<TableLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent">
    <TableRow>
        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_span="2"
            android:text="按钮" />
    </TableRow>
    <TableRow>
        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="按钮" />
        <Button
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="按钮" />
    </TableRow>
</TableLayout>
```
    语句解释：
    -  使用layout_span属性可以设置某列的跨度。 

<br>**FrameLayout**
　　`FrameLayout`是最简单的布局对象类型。

　　在帧布局中，组件是以覆盖的方式排列的，即将两个组件A和B依次放入帧布局中时，B组件会压在A组件的上方，这类似于一摞扑克牌。 

<br>　　范例1：帧式布局。
``` xml
<FrameLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" 
    android:layout_height="match_parent">
    <View />
    <View />
</FrameLayout>
```
    语句解释：
    -  如：使用播放器看电影时，点击暂停按钮后，屏幕上会多出一个“继续播放”按钮 。

<br>　　范例2：前景图像。
``` xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"  
    android:layout_width="match_parent"  
    android:layout_height="match_parent"  
    android:foreground="@drawable/logo"  
    android:foregroundGravity="right|bottom">  
    <TextView  
        android:layout_width="200dp"  
        android:layout_height="200dp"  
        android:background="#FF6143" />  
    <TextView  
        android:layout_width="150dp"  
        android:layout_height="150dp"  
        android:background="#7BFE00" />  
     <TextView  
        android:layout_width="100dp"  
        android:layout_height="100dp"  
        android:background="#FFFF00" />  
</FrameLayout>
```
    语句解释：
    -  所谓前景图像，即永远处于帧布局最顶层的图像，比如实现用户头像的圆角效果，可以用到此功能。 
    -  属性android:foreground：设置该帧布局容器的前景图像。
    -  属性android:foregroundGravity：设置前景图像在FrameLayout内部的显示位置。取值有：
       -  right、bottom、top等，如果需要多个值，值之间要使用“|”间隔，本范例的位置为右下角。


## 常用控件 ##
　　本章将介绍一下`Android`中常用的控件，如：`TextView`、`Button`、`RadioButton`等。
### TextView ###
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
android:layout_height       指出当前控件在其父组件中所占据的高度。              可选。
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

### ImageView ###
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
android:src          指定图片的资源ID。
android:layout_gravity   指定当前控件在其父元素内部的对齐方式。
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
``` java
public class ViewTextActivity extends Activity {
    public void onImageViewClick(View view){
        // 调用Activity类的方法,并指定ID,从当前xml布局文件中获取ImageView控件。
        ImageView img = (ImageView) this.findViewById(R.id.img);
        // 修改ImageView控件所显示的图片。
        img.setImageResource(R.drawable.b);
    }
}
```

### ProgressBar ###
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
``` java
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
``` java
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

### SeekBar ###
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
``` java
//  为当前SeekBar添加一个监听器。当SeekBar的值被改变、被拖动时会触发相应的事件。
public void setOnSeekBarChangeListener (SeekBar.OnSeekBarChangeListener l)

```

<br>　　范例3：SeekBar.OnSeekBarChangeListener接口。
``` java
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

### 滚动条 ###
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

### Button ###
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
``` java
Button button = (Button) findViewById(R.id.button_send);
// 为当前Button对象添加一个事件监听器。当用户点击此按钮时，会触发此监听器。
button.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        // Do something in response to button click
    }
});
```

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

### EditText ###
　　文本框允许用户在应用程序中输入文本，在XML布局文件中添加`<EditText>`元素。

<br>**指定键盘类型**
　　`EditText`可以限制用户不同的输入类型，如数字，日期，密码，或电子邮件地址。
　　你可以使用`EditText`对象的`android:inputType`属性指定输入类型的键盘，例如：
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

<br>　　下面列出了常见的定义键盘行为的`inputType`值：

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

　　这里举几个常用的常量值：

    -  actionGo 去往，对应常量EditorInfo.IME_ACTION_GO。 
    -  actionSearch 搜索，对应常量EditorInfo.IME_ACTION_SEARCH。
    -  actionSend 发送，对应常量EditorInfo.IME_ACTION_SEND。
    -  actionNext 下一个，对应常量EditorInfo.IME_ACTION_NEXT。
    -  actionDone 完成，对应常量EditorInfo.IME_ACTION_DONE。
    -  actionNone 没有动作,对应常量EditorInfo.IME_ACTION_NONE。

　　提示：EditText的`android:inputType`属性的值默认是`none`，若不去修改它的默认值，则`android:imeOptions`属性是不起作用的，将`none`改为`text`即可。

<br>**响应按钮事件**
　　如果您已指定键盘采用`android:imeOptions`属性，则可以使用`TextView.OnEditorActionListener`监听事件行为。
``` java
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
    语句解释：
    -  OnEditorActionListener接口提供了一个回调方法onEditorAction。
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
``` java
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
``` java
//  向当前对象中添加指定CharSequence对象。修改了Editable对象中的数据，会导致文本框中的数据同步改变。
//  若想获取EditText中的内容，可以调用Editable的toString方法。
public abstract Editable append(CharSequence text)

//  清空文本框中的数据。 
public abstract void clear()
```

<br>　　范例5：密码的显示和隐藏。
``` java
// 明文显示密码。
editText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
// 密文显示密码。
editText.setTransformationMethod(PasswordTransformationMethod.getInstance());
```

### CheckBox ###
　　复选框（俗称`多选按钮`）允许用户从列表中选择一个或多个选项。通常，你应该在垂直的列表中显示每一个选项。

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
``` java
//  修改当前CheckBox的选定状态。true为选定，false为不选定。
public void setChecked(boolean checked)

//  查看当前CheckBox是否处于选定状态。
public boolean isChecked()

//  设置事件监听器。当当前按钮的选中状态改变时，会触发OnCheckedChange事件。
public void setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener listener)
```

<br>　　范例2：CompoundButton.OnCheckedChangeListener接口。 
``` java
//  当CheckBox触发OnCheckedChange事件时，事件监听器会触发此事件。
//  buttonView ：触发事件的CheckBox对象。
//  isCheck ：CheckBox对象是否处于选中状态。
public abstract void onCheckedChanged(CompoundButton buttonView, boolean isChecked)
```

<br>　　范例3：事件监听。
``` java
CheckBox box = (CheckBox) this.findViewById(R.id.java);
box.setOnCheckedChangeListener(new OnCheckedChangeListener(){
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        System.out.println(buttonView.getText()+"被选中? "+isChecked);
    }
});
```

<br>　　`CheckBox`和`RadioButton`都继承自`TextView` ，因此它们都具有`TextView`类提供的方法。

<br>　　范例4：监听onClick事件。
``` java
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

### RadioButton ###
　　复选框允许用户从一系列选项中选择其中某个选项。
　　如果认为有必要让用户看到所有并列的可选项，并且各个选项中只能有一个被选择，那么单选框是个好选择。 

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
``` java
//  修改当前RadioButton对象的选定状态。true为选定。false为不选定。
public void setChecked(boolean checked)

//  查看当前RadioButton对象是否处于选定状态。
public boolean isChecked()
```

<br>　　范例3：RadioGroup类。 
``` java
//  监听当前按钮组中的按钮，当用户的选择改变时，会触发此事件。
public void setOnCheckedChangeListener(RadioGroup.OnCheckedChangeListener listener)
```

<br>　　范例4：RadioGroup.OnCheckedChangeListener接口。
``` java
//  监听当前按钮组中的按钮，当用户的选择改变时，会调用此方法。
//  group ：产生事件的RadioGroup对象。
//  checkeId ：当前被选中的RadioButton对象的id ，此id在R.java中定义。
public abstract void onCheckedChanged(RadioGroup group, int checkedId)
```

<br>　　范例5：监听按钮组。
``` java
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

### ToggleButton ###
　　`ToggleButton`是一个开关按钮，与普通`Button`的区别在于它有两种状态，选中和未选中。
　　Android有两种开关按钮，在`Android4.0`之前，你可以添加一个基本的`ToggleButton`开关按钮对象到布局文件。 `Android 4.0`（API 级别14）中介绍了另外一种叫做`Switch`的切换按钮，这个按钮提供一个滑动控件，可以通过添加`Switch`对象来实现。

<center>
![](/img/android/android_3_10.png)
</center>

　　`Toggle Button`和`Switch`控件都是`CompoundButton`的子类并且有着相同的功能，所以你可以用同样的方法来实现他们功能。

<br>　　范例1：开关按钮。
``` xml
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
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_checked="true" android:drawable="@drawable/bn_yes_bg"/>
    <item android:state_checked="false" android:drawable="@drawable/bn_no_bg"/>
</selector>

```
　　提示：本范例中涉及到的`<selector>`标签将在后面章节中详细介绍。

<br>　　范例3：控制文字的显示位置。
``` java
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

## 样式和主题 ##
　　`Android`中的`Styles`与网页设计中的`CSS`相似，允许你将设计从内容中分离出来，即可以预先定义一些`Styles`，然后用这些`Styles`美画各种控件，这样做可以减少大量的重复代码。

<br>　　例如，使用一个`style`，你可以将下面这个布局：
``` xml
<TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:textColor="#00FF00"
    android:typeface="monospace"
    android:text="@string/hello" />
```
　　变成这样：
``` xml
<TextView
   style="@style/CodeFont"
   android:text="@string/hello" />
```
    语句解释：
    -  本范例将一些可以公用的属性从XML布局中移出，放到一个名为CodeFont的style定义中，然后各个TextView控件都可以使用style属性引用它。你将在下面章节中看到此style的定义。

<br>　　当一个`style`被作到`Activity`或者`Application`上时，我们就称它为`theme`。
　　例如，你能把`CodeFont style`作为`theme`应用于一个`Activity `，那么这个`Activity`中所有文本都将是绿色等宽字体。

### 样式 ###
　　若想创建`style`，则需保存一个XML文件到你的工程的`res/values/`目录下，文件的名称可以随便定义。

<br>　　范例1-1：定义样式。
``` xml
<resources>
    <style name="CodeFont">
        <item name="android:layout_width">fill_parent</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textColor">#00FF00</item>
        <item name="android:typeface">monospace</item>
    </style>
</resources>
```
    语句解释：
    -  每个style都使用一个<style>元素来表示，该元素有一个用来唯一标识该style的name属性（这个属性是必需的）。 
    -  在<style>内部可以添加多个属性，每个属性使用一个<item>元素表示。
    -  在本范例中，CodeFont就是样式的名称，它内部包含了4个属性。 
    -  当某个控件使用此样式时，实际上就是在使用样式内部的各属性的值。

<br>　　范例1-2：定义样式2。
``` xml
<resources>
    <style name=".20STYLE">
        <item name="android:textColor">#FF0000</item>
        <item name="android:text">20sp</item>
    </style>
</resources>
```
    语句解释：
    -  第4行代码的含义为：将控件的“android:text”属性的值设置为20sp。

<br>　　范例2：使用样式。
``` xml
<TextView
    style="@style/.20STYLE"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="周•杰伦\n崔•杰伦/>
```
    语句解释：
    -  使用控件的style属性可以为当前控件设置一个style。
    -  在本范例中TextView控件的字体的颜色为FF0000字体的大小为20sp。

<br>　　颜色常量有四种常见的书写格式：

    #RRGGBB
    -  6位十六进制的数字。其中RR代表红色。GG代表绿色。BB代表蓝色。
    #AARRGGBB
    -  8位十六进制的数字。其中AA代表颜色的透明度。 00代表完全透明，FF代表完全不透明。
    #ARGB
    -  4位十六进制的数字。
    #RGB
    -  3位十六进制的数字。

<br>　　范例3：样式继承。
``` xml
<resources>
    <style name="STYLE_WH">
        <item name="android:layout_width">wrap_content</item>
        <item name="android:layout_height">wrap_content</item>
    </style>
    <style name="STYLE_TEXT" parent="STYLE_WH">
        <item name="android:textColor">#FF0000</item>
    </style>
</resources>
```
    语句解释：
    -  使用<style>标签的parent属性，可以为当前style设置一个父style。子style会完全继承父style所设置的属性。

<br>　　范例4：就近优先原则。
``` xml
<Button
    style="@style/STYLE_TEXT"
    android:textColor="#00FF00"
    android:text="崔•杰伦\n崔•杰伦"/>
```
    语句解释：
    -  若在style和控件中同时对某个一个属性指定了值，则按照就近优先原则，这和CSS是一样的。
    -  本范例中，字体最终的颜色为绿色。

<br>　　范例5：属性继承2.0。
``` xml
<resources>
    <style name="STYLE_WH">
        <item name="android:layout_width">wrap_content</item>
        <item name="android:layout_height">wrap_content</item>
    </style>
    <style name="STYLE_WH.STYLE_TEXT">
        <item name="android:textColor">#FF0000</item>
    </style>
</resources>
```
    语句解释：
    -  可以通过改变style名称的写法，来继承指定的style，命名规则为：“父style名.当前style名”。你可以像这样继续继承很多次，只要修改句点之前的名称。
    -  若指定的父style不存在，则会报错。范例1-2中的“.” 没有这种含义，它仅仅代表一个字符“.”。
    -  这种技巧仅适用于将你自己定义的资源链接起来。你不能用这种方式继承Android内建的style。要引用一个诸如TextAppearance的内建style，你必须使用parent属性。

<br>**一些提示：**

    -  若View不支持style中某些属性，那么该View将应用那些它支持的属性，并忽略那些不支持的。
    -  一些style属性只能被当作一个theme来应用，而不支持任何View元素。
       -  如用于隐藏应用标题(windowNoTitle)、隐藏状态栏或改变窗口背景(windowBackground)的style属性。
    -  如果一个style应用到一个ViewGroup上，那么子View元素并不会继承应用此style属性（只有你直接应用了style的元素才会应用其属性）。

### 主题 ###
　　用于Activity或者整个应用程序的`style`我们称之为主题(`Theme`)。

<br>　　范例1：定义主题。
``` xml
<style name="FullScreen">
    <item name="android:windowNoTitle">true</item>
    <item name="android:windowFullscreen">true</item>
</style>
```
    语句解释：
    -  windowNoTitle属性指出Activity是否取消标题栏。
    -  windowFullscreen属性指出Activity是否全屏显示。

<br>　　范例2：引用主题。
``` xml
<activity
    android:name="org.cxy.web.TowActivity" 
    android:theme="@style/FullScreen" />
```
    语句解释：
    -  此Activity中的每个View都将应用FullScreen所支持的属性。
    -  在清单文件中使用<activity>标签的android:theme属性来引用建立好的style。
    -  若使用<application>标签的android:theme属性引用style，则style将作用于该应用程序内的所有Activity。

<br>　　范例3：引用值。
``` xml
<style name="FullScreen">
    <item name="android:windowNoTitle">true</item>
    <item name="android:windowFullscreen">?android:windowNoTitle</item>
</style>
```
    语句解释：
    -  使用“?”可以引用某个属性的值。
    -  本范例中windowFullscreen属性的值引用了windowNoTitle属性的值。


# 第二节 应用程序资源 #
　　本章来介绍一下Android开发中常用的几种资源。

## Drawable ##

　　在Android中，`Drawable`类用来表示一个图像。
　　通常我们会把`Drawable`对象设置到View的`background`属性上进行显示。
　　目前`Drawable`有很多子类，它们分别用在不同应用场景，接下来会介绍一些常用的子类。

### BitmapDrawable ###

　　我们开发时，项目里所能使用的图片资源仅支持三种格式的位图：`png`、`jpg`、`gif`，而`BitmapDrawable`就是用来表示位图文件的。
　　创建`BitmapDrawable`有两种方式：通过位图文件、通过`XML`文件。

<br>**位图文件**

　　直接将位图文件放到`res/drawable`目录下即可，图片的名称就是位图资源的ID，在程序中可以通过资源ID引用图片。
<br>　　范例1：当一个图片保存在`res/drawable/myimage.png` 时，使用方法：
``` xml
<ImageView
    android:layout_height="wrap_content"
    android:layout_width="wrap_content"
    android:src="@drawable/myimage" />
```
    语句解释：
    -  在程序运行时，系统会先使用R.drawable.myimage来创建出一个Bitmap对象。
    -  然后使用这个Bitmap对象创建BitmapDrawable对象，BitmapDrawable为Bitmap提供了若干新的功能。

<br>　　`Drawable`就是可画的、可编辑的，因而`Bitmap`对象可以通过`BitmapDrawable`类进行编辑。
<br>　　范例2：获取图像宽高。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img;
    private BitmapDrawable drawable;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.icon);
        this.drawable = (BitmapDrawable) this.img.getDrawable();
        // 设置当前Drawable对象的透明度，取值范围：0 ~ 255 ，255为完全不透明。
        this.drawable.setAlpha(35); 
        // 获取位图文件的尺寸。
        System.out.println("width="+this.drawable.getBitmap().getWidth());
        System.out.println("height="+this.drawable.getBitmap().getHeight());
    }
}
```
    语句解释：
    -  当想获取位图文件的宽高时，可以先调用drawable.getBitmap()方法获取Bitmap对象。

<br>**XML文件**

　　我们也可以使用XML文件来定义一个`BitmapDrawable`，使用此种方式定义可以为图像设定抖动、是否启动图片抗锯齿等附加属性。
<br>　　范例1：在`res/drawable`目录下建立`bitmap.xml`。
``` xml
<bitmap
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/a" />
```
    语句解释：
    -  在xml文件中使用<bitmap>标签来描述一个BitmapDrawable，xml文件名称就是图片的资源ID。
    -  其中<bitmap>标签必须包含src属性，该属性用来指出一个位图文件。
    -  引用xml文件和引用普通位图文件的方式是完全一样的。

<br>　　语法：
``` xml
<bitmap
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@[package:]drawable/drawable_resource"
    android:antialias=["true" | "false"]
    android:dither=["true" | "false"]
    android:filter=["true" | "false"]
    android:gravity=["top" | "bottom" | "left" | "right" | "center_vertical" |
                      "fill_vertical" | "center_horizontal" | "fill_horizontal" |
                      "center" | "fill" | "clip_vertical" | "clip_horizontal"]
    android:tileMode=["disabled" | "clamp" | "repeat" | "mirror"] />
```
    属性解释
    -  antialias：是否允许抗锯齿。开启后会让图片的边线变得平滑。
    -  dither：如果位图与屏幕的像素配置不同时是否允许抖动。比如位图的像素配置是ARGB_8888，但手机的屏幕配置是RGB555，这时候开启抖动选项可以让位图显示不会过于失真。
    -  filter：是否允许对位图进行滤波。当对位图进行缩放或者压缩时，开启过滤效果可以获得较好的显示效果。
    -  gravity：位图的gravity。当位图小于其容器的尺寸时，使用gravity属性指明在容器的何处绘制该位图。
    -  tileMode：平铺模式。repeat是简单的水平和垂直平铺，mirror是镜面投影效果，clamp不好描述，请自行测试。

### NinePatchDrawable ###

　　`NinePatchDrawable`是一个可以伸缩的位图图像，它可以将自己调整到指定的尺寸，并保证不失真。`NinePatchDrawable`必须由一个`png`图片来创建，`NinePatchDrawable`与普通`png`图像不同的是：

    -  它的四条边上包括额外的1个像素的边界。
    -  它的后缀名为“.9.png”。

　　你可以使用`sdk\tools\draw9patch.bat`工具来将普通的`png`图片修改为`*.9.png`的图片，该工具非常直观的展示了图片在上下或左右拉伸时的效果以及作为背景时其内容显示的位置。
　　虽然`.9.png`图片是在`.png`基础上制作出来的，但它的引用方式和`png`图片完全一样。
　　`NinePatchDrawable`也可以在`XML`文件中定义，使用`<nine-patch>`标签即可，它支持的属性与`BitmapDrawable`一致。

### LayerDrawable ###

　　`LayerDrawable`表示一种层次化的图像，它可以将多张图片叠加成一张图片，效果如下：

<center>
![](/img/android/android_4_7.png)
</center>

<br>　　语法：
``` xml
<layer-list
    xmlns:android="http://schemas.android.com/apk/res/android" >
    <item
        android:drawable="@[package:]drawable/drawable_resource"
        android:id="@[+][package:]id/resource_name"
        android:top="dimension"
        android:right="dimension"
        android:bottom="dimension"
        android:left="dimension" />
</layer-list>
```

<br>　　范例1：在`res/drawable`目录下建立`icon.xml`。
``` xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/b" />
    <item android:drawable="@drawable/a" />
</layer-list>
```
    语句解释：
    -  在layer-list下的每一个<item>都表示一个图像，drawable属性表示图像资源。
    -  当layer-list下有多个<item>时，先出现的<item>元素会被放在下面。如：在本范例中a图片会放在b的图片的上面。

<br>　　范例2：其他属性。
``` xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:drawable="@drawable/icon"
        android:top="140dp"
        android:right="150dp"
        android:left="150dp"
        android:bottom="20dp" />
</layer-list>
```
　　效果图：
<center>
![](/img/android/android_4_8.png)
</center>

　　`<item>`标签：

    -  top、right、left、bottom属性，
    -  指出图片的最小padding，即图片距离View某一边实际的padding必须大于等于指定的距离。
    -  若指定的padding超过了View所占据的大小，则将缩小图片，以保证属性的值生效。

<br>　　范例3：引用此图片。
``` xml
<ImageView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:src="@drawable/layout_list"
    android:id="@+id/ico"/>
```
    语句解释：
    -  若此时调用ImageView的getDrawable方法，返回值的类型为： LayerDrawable 。

<br>　　层列表中所定义的图片是可以动态的改变的，与位图资源一样，若想对图片进行编辑，则需要获取图片资源的Drawable对象。

<br>　　范例4：点击事件。
``` xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/b" />
    <item
        android:id="@+id/content"
        android:drawable="@drawable/a" />
</layer-list>
```
    语句解释：
    -  本范例中为<item>标签设置一个ID 。

　　动态更新图片：
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img;
    private Resources rs;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        this.rs = this.getResources();
    }
    public void onClick(View view){
        // 通过Resources类获取一个新的LayerDrawable对象。
        LayerDrawable drawable=(LayerDrawable)rs.getDrawable(R.drawable.layer);
        // 修改新对象的层。
        drawable.setDrawableByLayerId(R.id.content,rs.getDrawable(R.drawable.icon));
        // 将新对象设置给ImageView。
        this.img.setImageDrawable(drawable);
    }
}
```
    语句解释：
    -  动态更新图片后，需要重新设置LayerDrawable对象。

<br>　　范例5：实现如下效果。

<center>
![](/img/android/android_4_9.png)
</center>

　　代码为：
``` xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <bitmap android:src="@drawable/android_red" android:gravity="center" />
    </item>
    <item android:top="10dp" android:left="10dp">
        <bitmap android:src="@drawable/android_green" android:gravity="center" />
    </item>
    <item android:top="20dp" android:left="20dp">
        <bitmap android:src="@drawable/android_blue" android:gravity="center" />
    </item>
</layer-list>
```
    语句解释：
    -  <item>内部可以嵌套其他类型的Drawable。

### StateListDrawable ###

　　`StateListDrawable`类似于单选按钮，它里面可以包含多张图片，但是同一时间只显示一张。
　　`StateListDrawable`可以根据View的当前状态，来决定要显示哪一张图片。
<br>　　语法：
``` xml
<selector xmlns:android="http://schemas.android.com/apk/res/android"
    android:constantSize=["true" | "false"]
    android:dither=["true" | "false"]
    android:variablePadding=["true" | "false"] >
    <item
        android:drawable="@[package:]drawable/drawable_resource"
        android:state_pressed=["true" | "false"]
        android:state_focused=["true" | "false"]
        android:state_hovered=["true" | "false"]
        android:state_selected=["true" | "false"]
        android:state_checkable=["true" | "false"]
        android:state_checked=["true" | "false"]
        android:state_enabled=["true" | "false"]
        android:state_activated=["true" | "false"]
        android:state_window_focused=["true" | "false"] />
</selector>
```
    语句解释：
    -  constantSize属性：设置StateListDrawable的固有大小是否不随着其状态的改变而改变，因为状态的改变会导致StateListDrawable切换到具体的Drawable，而不同的Drawable具有不同的固有大小，true表示StateListDrawable固有大小保持不变，这时它的固有大小是其内部所有Drawable的固有大小的最大值，默认值为false。
    -  variablePadding属性：设置StateListDrawable的padding是否随着其状态的改变而改变，与constantSize属性类似，默认值为false。

<br>　　范例1：在`res/drawable`目录下建立`state_list.xml`。
``` xml
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_focused="false" android:drawable="@drawable/input_out" />
    <item android:state_focused="true" android:drawable="@drawable/input_over" />
</selector>
```
    语句解释：
    -  使用<selector>标签创建一个StateListDrawable。
    -  本范例的含义为，当View获得焦点时显示input_over，失去焦点时显示input_out。

<br>　　范例2：老规矩，引用它。
``` xml
<EditText
    android:layout_width="150dp"
    android:layout_height="wrap_content"
    android:hint="输入 账号"
    android:background="@drawable/state_list" />
```
    语句解释：
    -  当文本框获得和失去焦点时，系统会自动更新文本框的background属性所使用的图片。

<br>　　匹配原则：

    -  当View的状态被改变时，系统会使用View当前的状态和此文件内所有的<item>匹配。
       -  匹配的顺序：从上到下，从左到右依次匹配每一个<item>标签。
       -  匹配的原则：
          -  若View的当前状态与某个<item>标签匹配成功，则将View的背景色设置为该<item>标签指定的色值，并不会再继续匹配，直接返回。
          -  若匹配失败，则继续匹配下一个<item>标签。
          -  若直到最后都没有一个<item>匹配成功，则将为View设置黑色的背景。
          -  若某个<item>标签没有指定任何具体的状态，则意味着该<item>可以和任何状态匹配，因此应该把没有指定状态的<item>标签放到文件的最后书写。
       -  也就是说，并不是基于用“最佳匹配”的算法来选择的，而仅仅遇到第一个符合最低标准的就会被使用。


<br>　　属性介绍：
``` 
android:state_pressed          控件是否被按下（一个点击事件由按下、抬起两个事件组成）。

android:state_focused          控件是否获得焦点。
                               使用滑轮或键盘的方向导航键导航到某一个控件上，此控件就得到了焦点（会被高亮显示，在模拟器容易看到）。

android:state_selected         控件是否被选中。比如一个tab被打开。

android:state_checkable        控件是否处于可选状态。
                               这个属性仅仅用于那些可以在“可选”和“不可选”两种状态之间过渡的控件，如RadioButton。

android:state_checked          控件是否处于选中状态。
                               这个属性仅仅用于那些可以在“可选”和“不可选”两种状态之间过渡的控件，如CheckBox。

android:state_enabled          控件是否处于可用状态。

android:state_window_focused   应用程序的窗口是否处于聚焦状态。 
                               通知罩（即通知栏被拉下后的半透时界面）被打开时或者一个对话框（dialog）出现时，后面的窗口就处于失焦状态。
```

<br>　　范例3：多个属性。
``` xml
<item
    android:state_focused="true"
    android:state_enabled="false"
    android:drawable="@drawable/input_over" />
```
    语句解释：
    -  在<item>标签中，可以同时设置多个属性。
    -  本范例中，当且仅当View被禁用且获得焦点时，才会将该View的背景图片设置为input_over。

<br>　　范例4：pressed属性。
``` xml
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:drawable="@drawable/input_over" />
    <item android:drawable="@drawable/input_out" />
</selector>
```
    语句解释：
    -  当View被用户按下时，View会转变为pressed状态。
    -  pressed状态通常用在：Button、EditText、Spinner等可点击的控件之上。
    -  注意：TextView和ImageView等控件默认是不会产生pressed状态的，但若将其的clickable属性设置为true，则就会产生pressed状态。 

<br>　　范例5：checked属性。
``` xml
<item
    android:state_checked="true"
    android:drawable="@drawable/input_over" />
```
    语句解释：
    -  此属性是专为RadioButton、CheckBox、ToggleButton等控件设定的。当按钮被用户选中时，按钮会转变为checked状态。
    -  RadioButton和CheckBox可以同时触发pressed和checked两种状态，先pressed后checked。
    -  提示：普通的Button按钮不会触发checked状态。

<br>　　范例6：引用color值。
``` xml
<item
    android:state_checked="true"
    android:drawable="@color/green" />
```
    语句解释：
    -  正如你看到的那样，我们也可以是用一个色值。

### LevelListDrawable ###

　　`LevelListDrawable`也类似于单选按钮，它可以根据Drawable的当前等级，来决定要显示哪一张图片。
<br>　　范例1：在`res/drawable`目录下建立`levle.xml`。
``` xml
<level-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" />
    <item
        android:drawable="@drawable/b"
        android:minLevel="1"
        android:maxLevel="10" />
    <item
        android:drawable="@drawable/c"
        android:minLevel="11"
        android:maxLevel="20" />
</level-list>
```
    语句解释：
    -  使用<level-list>标签描述一个等级列表，每一个<item>标签代表一张图片，<item>标签的drawable属性为必选。
    -  <level-list>标签对应于LevelListDrawable类。
    -  在本范例中，当<level-list>的当前等级x与某个<item>标签的minLevel和maxLevel属性满足关系：minLevel <=x<= maxLevel 时，该<item>标签所对应的图片将被显示。
    -  若某个<item>标签没有指定minLevel和maxLevel属性，则它们的默认取值都为0 。
    -  若有两个或以上的<item>标签同时匹配，则系统会选择最先扫描到的，选择之后就不再继续向下匹配。

<br>　　范例2：更改等级。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img; // 图片。
    private EditText text; // 文本框,用来让用户输入等级。
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        this.text = (EditText) this.findViewById(R.id.text);
    }
    public void onClick(View view){
        int level = Integer.valueOf(this.text.getText().toString());
        Drawable drawable = this.img.getDrawable();
        // 根据用户输入的等级,设置Drawable的等级。
        drawable.setLevel(level);
    }
}
```
    语句解释：
    -  若想动态的为LevelListDrawable添加等级，则可以使用LevelListDrawable类的addLevel方法。

### TransitionDrawable ###

　　`TransitionDrawable`用于实现两个Drawable之间的淡出淡入的效果。
<br>　　范例1：`transition.xml`。
``` xml
<transition xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" />
    <item android:drawable="@drawable/b" />
</transition>
```
    语句解释：
    -  使用<transition>标签描述一个TransitionDrawable，每一个<item>标签代表一张图片。
    -  系统会默认显示第一张图片，若指定的<item>的个数大于2，则只有前两个<item>有效。
    -  系统从第一张图片过渡向第二张图片后，第二张图片会覆盖到第一张图片的上面，但是第一张图片并不会消失，因此实际应用中，通常第二张图片的尺寸会大于等于第一张图片的尺寸，以达到完全覆盖的目的。

<br>　　范例2：过渡图片。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img; // 图片。
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
    }
    public void onClick(View view){
        TransitionDrawable transition=(TransitionDrawable)img.getDrawable();
        // 从第一层的图片过渡到第二层的图片。在3000毫秒内完成过渡。 
        transition.startTransition(3000);
    }
}
```

### ClipDrawable ###

　　`ClipDrawable`可以根据Drawable的当前等级，来裁剪Drawable，即只显示图片的某一部分内容。
<br>　　范例1：`clip.xml`。
``` xml
<clip xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/login_input"
    android:clipOrientation="horizontal"
    android:gravity="left" />
```
    语句解释：
    -  使用<clip>标签描述一个剪切图片资源。 <clip>标签的drawable属性为必选。
    -  clipOrientation属性：表示裁剪的方向，取值为：vertical(按照垂直方向裁剪)，horizontal(按照水平方向裁剪)。
    -  gravity 图片的起始方向，取值：left(从左向右)，bottom(从下向上)等。

<br>　　范例2：设置等级。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img; // 图片。
    private ClipDrawable clip;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        this.clip = (ClipDrawable) this.img.getDrawable();
    }
    public void onClick(View view){ // 最初时图片的等级为0，此时图片将完全不显示。
        clip.setLevel(clip.getLevel()+1000);
    }
}
```
    语句解释：
    -  使等级的取值范围为：0~10000，0代表完全不显示图片，10000代表完全显示图片。

### ShapeDrawable ###

　　`ShapeDrawable`可以通过颜色来画出一幅图片，它既可以是纯色的，也可以是渐变色的。
<br>　　范例1：shape文件。
``` xml
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle" >

</shape>
```
    语句解释：
    -  本范例绘制了一个矩形，至于矩形的尺寸、颜色等信息并没有指定，因此若直接使用本范例，则是无法在屏幕中看到矩形的。
    -  android:shape属性的取值有：
       -  rectangle (矩形)，是默认形状。
       -  ring(环形)
       -  oval (椭圆形)
       -  line (直线)，这个形状要求<stroke>元素来定义线的宽度。

<br>　　在`<shape>`内部支持`6`个子标签，用来设置图形的不同属性，下面将依次介绍。

<br>　　范例2：圆角矩形。
``` xml
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle" >
    <!-- 圆角半径 -->
    <corners
        android:radius="10dp"
        android:topLeftRadius="0dp"
        android:topRightRadius="33dp" />
    <!-- 图像的尺寸 -->
    <size
        android:height="100dp"
        android:width="160dp" />
    <!-- 图像的边缘线 -->
    <stroke
        android:dashGap="5dp"
        android:dashWidth="50dp"
        android:width="1dp"
        android:color="#f00" />
    <!-- 图像的填充色 -->
    <solid android:color="#bfafad" />
</shape>
```
    语句解释：
    -  各个标签书写的顺序是任意的。

　　效果图：

<center>
![](/img/android/android_4_10.png)
</center>

<br>　　范例3：各标签的介绍。
``` xml
<corners>标签：为形状创建圆角，只有当形状为矩形时才有用。
-  android:radius：尺寸数，所有的角的半径，优先级比较低，会被下面四个属性的值覆盖。
-  android:topLeftRadius尺寸数，左上角的半径。
-  android:topRightRadius尺寸数，右上角的半径。
-  android:bottomLeftRadius尺寸数，左下角的半径。
-  android:bottomRightRadius尺寸数，右下角的半径。


<size>标签：指定shape的大小。
但一般来说它并不是shape最终显示的大小，因为当shape被作为View的背景显示时，还是会被拉伸或缩小。
-  android:height：形状的高。
-  android:width：形状的宽。


<solid>标签：固定颜色填充形状。
-  android:color：颜色，用到形状上的颜色，作为一个十六进制值或颜色资源。


<stroke>标签：指出图形的边缘线的粗细、颜色、间隔等。
-  android:width：线的宽度(粗细)，单位：尺寸值或尺寸资源。
-  android:color：线的颜色，单位：十六进制值或者颜色资源。
-  android:dashGap：虚线与虚线之前的间隔距离，单位：尺寸值或尺寸资源。
-  android:dashWidth：每段虚线的长度，单位：尺寸值或尺寸资源。


<gradient>标签：可以设置图形内部的渐变色。
-  android:angle：渐变的角度，0度为从左到右，90度是从底到上，必须是45度的倍数，默认为0。
-  android:centerX：距离渐变中心的X坐标的相对位置(0 ~ 1.0)。
-  android:centerY：距离渐变中心的Y坐标的相对位置(0 ~ 1.0)。
-  android:gradientRadius：渐变的半径，只有当android:type="radial"才使用
-  android:startColor：开始颜色，作为一个十六进制值或者颜色资源。
-  android:endColor：结束颜色，作为一个十六进制值或颜色资源。
-  android:centerColor：可选择开始到结束之间的颜色，作为一个十六进制值或颜色资源。
-  android:type：渐变模式，有效值如下：
   -  linear：线性渐变，默认选择。
   -  radial：辐射渐变，开始颜色也是结束颜色。
   -  sweep：卷曲线渐变。

```

<br>　　范例4：渐变色。
``` xml
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval" >
    <size
        android:height="100dp"
        android:width="160dp" />
    <stroke
        android:width="1dp"
        android:color="#f00" />
    <gradient
        android:angle="45"
        android:endColor="#80FF00FF"
        android:startColor="#FFFF0000" />
</shape>
```

　　效果图：

<center>
![](/img/android/android_4_11.png)
</center>

<br>　　值得注意的是，只有当`android:shape="ring"`时`<shape>`标签的下面的属性才能使用：

    -  android:innerRadius：内环半径。
    -  android:thickness：环的厚度。
    -  android:thicknessRatio：环的厚度比上环的宽度。例如，如果android:thicknessRatio="2"，厚度等于环的宽度的1/2，此值被android:innerRadius重写，默认为3.
    -  android:useLevel：为"true"时，用于LevelListDrawable，正常情况设为"false"。

### 其它Drawable ###
<br>**InsetDrawable**

　　`InsetDrawable`用来将一个Drawable嵌入到其内部，并且在内部留一些间距，类似于`padding`的效果。

　　当View希望自己的`android:background`比自己的实际区域小的时候可以使用`InsetDrawable`。

<br>　　范例1：案例。
``` xml
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/background"
    android:insetTop="10dp"
    android:insetLeft="10dp" />
```

<br>**Rotate Drawable**

　　`RotateDrawable`可以旋转其他Drawable对象，旋转的开始和结束角度可以通过属性控制。
<br>　　范例1：使用范例。
``` xml
<rotate xmlns:android="http://schemas.android.com/apk/res/android" 
    android:pivotX="50%" 
    android:pivotY="50%"
    android:fromDegrees="0"
    android:toDegrees="360">
    <shape
        android:shape="ring"
        android:innerRadiusRatio="5"
        android:thicknessRatio="15"
        android:useLevel="false">
    <gradient
        android:type="sweep"
        android:useLevel="false"
        android:startColor="#FF06436e" 
        android:centerColor="#FF094c7b"
        android:centerY="0.50"
        android:endColor="#FF127fc4" />
    </shape>
</rotate>
```
    语句解释：
    -  通过本范例可以看出来各个Drawable是可以相互嵌套使用的。

## ColorStateList ##

　　`ColorStateList`和`StateListDrawable`类似，它依据View的状态来显示相应的颜色。
<br>　　范例1：在`res/color`文件夹下建立`my_color.xml`文件。
``` xml
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:state_pressed="true"
        android:color="#f00" />
    <item
        android:state_focused="true"
        android:color="#0f0" />
    <item android:color="#00f" />
</selector>
```
    语句解释：
    -  使用<selector>标签创建一个state-list文件，此标签必须为根节点。
    -  View的每一个状态使用一个<item>标签来描述，标签常用的属性为color，表示颜色值，其值可以是资源id或者颜色常量。
    -  本例的含义为，当View获得焦点时，其背景色将被设置为“0f0” ，被按下时背景色将被设置为“f00”。

<br>　　范例2：使用颜色状态列表。
``` xml
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="领奖"
    android:textColor="@color/my_color" />
```
    语句解释：
    -  当按钮被按下时，按钮上的文字的颜色将变为红色。

## Layout ##

　　布局(`layout`)的基本语法再次就不再重复介绍了，只介绍一些常用的标签。
<br>**&lt;requestFocus&gt;**
　　将屏幕的初始焦点设成其父元素，任何表示View类对象的元素都能包含这个内容为空的元素，但每个文件内只能出现一次本元素。

<br>**&lt;include&gt;**
　　将另一个布局（`layout`）文件包含到此标签所处的位置上。

　　属性：
    -  layout：要引用的布局资源。
    -  android:id：覆盖包含进来的layout资源中的根view ID。
    -  android:layout_height：
       -  覆盖包含进来的layout资源中根view给出的高度，仅在同时给出android:layout_width时才生效。
    -  android:layout_width：
       -  覆盖包含进来的layout资源中根view给出的高度，仅在同时给出android:layout_height时才生效。

　　只要是被包含的`layout`资源根元素支持的属性，都能在`<include>`元素中包含进来，并且会覆盖本资源内根元素已定义的属性。

　　包含`layout`资源的另一种方式是使用`ViewStub`，它是个轻量级的View，它在实际被填充之前不占用`layout`空间。在实际被填充时，它再把`android:layout`属性指定的`layout`资源文件动态包含进来。

<br>**&lt;merge&gt;**
　　如果希望`layout`能被其他`layout`用`<include>`包含进去，并不再另外生成`ViewGroup`容器，本元素特别有用。

## String ##
　　应用程序可以使用三种类型的字符串资源：

    -  配置XML中的普通字符串。
    -  字符串数组。
    -  具有格式化参数的字符串。

<br>　　范例1：`res/values/strings.xml`。
``` xml
<resources>
    <string name="hello">Hello!</string>
</resources>
```
　　XML布局文件把字符串应用到一个View中：
``` xml
<TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:text="@string/hello" />
```
　　应用程序通过以下代码返回一个字符串：
``` android
String string = getString(R.string.hello);
```

<br>　　范例2：字符串数组。
``` xml
<resources>
    <string-array name="planets_array">
        <item>Mercury</item>
        <item>Venus</item>
        <item>Earth</item>
        <item>Mars</item>
    </string-array>
</resources>
```

<br>　　范例3：撇号和引号的转义。
``` xml
<string name="good_example">"This'll work"</string>
<string name="good_example_2">This\'ll also work</string>
<string name="bad_example">This doesn't work</string>
<string name="bad_example_2">XML encodings don&apos;t work</string>
```
    语句解释：
    -  前两个是正确的范例，后两个是错误的范例。

<br>　　范例4：字符串的格式化。
``` xml
<string name="welcome_messages">Hello, %1$s! You have %2$d new messages.</string>
```
    语句解释：
    -  此例中存在两个占位符：%$s是个字符串，%$d是个数字，数字表示参数的序号，从1开始。
　　在应用程序中可以用如下方式用参数来格式化字符串：
``` android
Resources res = getResources();
String text = String.format(res.getString(R.string.welcome_messages), username, mailCount);
```

<br>　　范例5：用HTML标记来样式化。
``` xml
<resources>
    <string name="welcome">Welcome to <b>Android</b>!</string>
</resources>
```
    语句解释：
    -  支持以下HTML元素：
       -  <b>文本加粗bold。
       -  <i>文本变斜体italic。
       -  <u>文本加下划线underline。

## More Types ##

<br>　　范例1：bool类型数据(`res/values-small/bools.xml`)。
``` xml
<resources>
   <bool name="screen_small">true</bool>
   <bool name="adjust_view_bounds">true</bool>
</resources>
```
　　程序代码获取：
``` xml
<ImageView
    android:layout_height="fill_parent"
    android:layout_width="fill_parent"
    android:src="@drawable/logo"
    android:adjustViewBounds="@bool/adjust_view_bounds" />
```

<br>　　范例2：color类型数据(`res/values-small/colors.xml`)。
``` xml
<resources>
   <color name="opaque_red">#f00</color>
   <color name="translucent_red">#80ff0000</color>
</resources>
```
　　程序代码获取：
``` xml
<TextView
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:textColor="@color/translucent_red"
    android:text="Hello"/>
```
    语句解释：
    -  颜色值通常以 “#” 字符开头，接着Alpha-Red-Green-Blue（透明度-红-绿-蓝）信息。
    -  常见的颜色格式有：RGB、ARGB、RRGGBB、AARRGGBB。
       
<br>　　范例3：inteter类型数据(`res/values-small/integers.xml`)。
``` xml
<resources>
    <integer name="max_speed">75</integer>
    <integer name="min_speed">5</integer>
</resources>
```
　　程序代码获取：
``` java
Resources res = getResources();
int maxSpeed = res.getInteger(R.integer.max_speed);
```

<br>　　范例4：inteter数组数据(`res/values/integers.xml`)。
``` xml
<resources>
    <integer-array name="bits">
        <item>4</item>
        <item>8</item>
        <item>16</item>
        <item>32</item>
    </integer-array>
</resources>
```
　　程序代码获取：
``` java
Resources res = getResources();
int[] bits = res.getIntArray(R.array.bits);
```

<br>　　范例5：数组数据(`res/values/arrays.xml`)。
``` xml
<resources>
   <array name="icons">
        <item>@drawable/home</item>
        <item>@drawable/settings</item>
        <item>@drawable/logout</item>
   </array>
   <array name="colors">
        <item>#FFFF0000</item>
        <item>#FF00FF00</item>
        <item>#FF0000FF</item>
   </array>
</resources>
```
　　程序代码获取：
``` java
Resources res = getResources();
TypedArray icons = res.obtainTypedArray(R.array.icons);
Drawable drawable = icons.getDrawable(0);
 
TypedArray colors = res.obtainTypedArray(R.array.colors);
int color = colors.getColor(0,0);
```


# 第三节 通知 #

　　有几种类型的场景可能会要求你把应用程序中发生的事件通知给用户，这些事件有的需要用户响应，有的则不需要。

　　在Android中提供了三种不同的技术来通知用户事件的发生： 

    Toast、Dialog、Notification


## Toast ##
　　土司是在屏幕上弹出一个消息，它在显示1~3秒后会消失，而且不接受交互事件，如下图所示：

<center>
![](/img/android/android_3_21.png)
</center>

　　`Toast`仅填充了消息要求的空间大小，并且依然保留当前Activity的可见性和交互性。

　　应用场景：

    由于它拥有自动消失的特点，所以通常用来显示一些对用户不重要的信息。

<br>**基础应用**
　　最简单的`Toast`通知是仅显示一行文本消息，我们可以使用`Toast.makeText()`方法实例化一个`Toast`对象。

<br>　　范例1：创建Toast对象。
``` java
//  三个参数依次为：Context、要显示的文本消息、Toast通知持续显示的时间。
Toast toast = Toast.makeText(getApplicationContext(), "Hello toast!", Toast.LENGTH_SHORT);
// 显示到屏幕上。
toast.show();

// 你也可以用链式组合方法写且避免持有Toast对象的引用，向下面这样：
// Toast.makeText(context, text, duration).show();
```
    语句解释：
    -  Activity、Application都是Context的子类，因此可以使用它们的对象，初始化第一个参数。
    -  在Toast类中提供了两个常量，makeText方法的第三个参数的取值可以为二者之一：
       -  LENGTH_SHORT ：对话框显示的时间稍短。
       -  LENGTH_LONG ：对话框显示的时间稍长。

<br>**Toast定位**
　　默认情况下，`Toast`会显示在屏幕底部且水平居中，但是可以通过`setGravity(int, int, int)`方法来重新设置显示位置。这个方法有三个参数：
 
    1. Gravity常量（详细参照Gravity类）。
    2. X轴偏移量。
    3. Y轴偏移量。
　　例如：如果你想让`Toast`通知显示在屏幕的左上角，可以这样设置：
``` java
//  多个位置参数之间使用“|”符号间隔。
toast.setGravity(Gravity.TOP|Gravity.LEFT, 0, 0);
```
　　如果想让`Toast`从当前位置向右偏移，可以增加第二个参数的值，第三个参数同理。

<br>**自定义Toast**
　　如果一个简单的文本消息不能满足显示的需要，你可以给`Toast`通知创建一个自定义的布局(`layout`)，然后把布局传递给`setView(View)`方法。

<br>　　范例1：显示一个按钮。
``` java
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        Button btn = new Button(this);
        btn.setText("我是一个按钮");

        // 直接通过new来手动创建一个Toast对象。
        Toast toast = new Toast(this);
        toast.setView(btn);
        toast.show();
    }
}
```

## Dialogs ##
　　对话框通常是一个显示在当前Activity之前的小窗口，当对话框显示出来时，它下面的Activity会失去输入焦点，并且对话框会接受所有的用户交互。

　　应用场景：

    它通常用来显示一个需要用户确认的短消息（例如带有“确定”按钮的提醒），除非用户响应，否则对话框不会自动消失。

<br>　　常见的对话框如下图所示：

<center>
![](/img/android/android_3_24.png)
</center>

<br>　　`Dialog`类是所有对话框的基类，但你应该避免直接实例化`Dialog`。相反，应该使用以下子类：

    -  AlertDialog：可以显示0~3个按钮的对话框，并且能够包含一个单选或多选按钮列表。
    -  ProgressDialog：显示一个进度滚轮或进度条的对话框，它是AlertDialog的子类。
    -  DatePickerDialog和TimePickerDialog：一个有预定义用户界面的对话框，允许用户选择一个日期或时间。

<br>　　范例1：下面是Dialog类的常用方法：
``` java
//  将Dialog从屏幕中移除，同时释放掉Dialog对象所占据的资源。
public void dismiss();

//  设置是否允许用户通过点击手机中的回退按钮来关闭对话框。
public void setCancelable(boolean flag);

//  当用户手指点击对话框外部的区域时，是否关闭对话框。
public void setCanceledOnTouchOutside (boolean cancel)

//  设置对话框窗口的标题。
public void setTitle(CharSequence title);

//  在屏幕上启动并显示出对话框。
public void show();
```

<br>　　注意：

    -  在实例化各种Dialog时，需要为其构造方法传递一个Context对象，这个Context对象只能是Activity。
    -  Toast对象则没有这个要求，它可以接收任何Context对象，因为它不依赖于某个Activity。
    -  在非main线程中是不可以Toast和显示Dialog的。
 
### AlertDialog ###
　　警告对话框`AlertDialog`是Dialog最常用的一个子类。一个警告对话框有三个地区，如下图所示：

<center>
![](/img/android/android_3_25.png)
</center>

　　**1. 标题** 
　　这是可选的。如果你需要显示一个简单的信息（如下图），则就不需要使用标题。

<center>
![](/img/android/android_3_26.png)
</center>

　　**2. 内容区域。 **
　　对话框的正文部分。这里可以显示一个文本消息，一个列表，或其他自定义布局。

　　**3. 动作按钮。 **
　　用户可点击的按钮，在`AlertDialog`对话框中最多只支持三个按钮。

<br>　　范例1：创建一个`AlertDialog`，需要使用它的静态内部类`AlertDialog.Builder`，创建的过程为：
``` java
// 1. 通过构造方法实例化一个AlertDialog.Builder对象。
AlertDialog.Builder builder = new AlertDialog.Builder(context);

// 2. 调用各个set方法为对话框设置不同的数据。
builder.setMessage(R.string.dialog_message).setTitle(R.string.dialog_title);

// 3. 调用create()方法创建AlertDialog对象。
AlertDialog dialog = builder.create();
```

<br>　　范例2：添加按钮。
``` java
public void onClick(View view) {
    // 创建一个事件监听器，注意这里是DialogInterface.OnClickListener类型的。
    OnClickListener listener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            // whick表示产生事件的按钮。AlertDialog有三个常量与之对应：
            // AlertDialog.BUTTON_POSITIVE、AlertDialog.BUTTON_NEUTRAL、AlertDialog.BUTTON_NEGATIVE
            switch (which) {
                case AlertDialog.BUTTON_POSITIVE:
                    Toast.makeText(getApplicationContext(),"POSITIVE",0).show();
                break;
            }
        }
    };
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    // 下面三个方法，依次用来设置对话框的标题栏上的图标、标题、消息正文。
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setMessage(R.string.content);
    // 下面三个方法依次用来设置对话框的三个按钮，listener是一个监听器，当用户点击该按钮时会触发点击事件。
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setNegativeButton("...", listener);
    dialog.setNeutralButton("哦,是吗!", listener);
    // 显示对话框。
    dialog.show();
}
```
    语句解释：
    -  我们最多可以在对话框中设置三个动作按钮：
       -  Positive：对应最左边的按钮，通常使用这个按钮来表示“接受”或“继续”动作。
       -  Neutral：对应中间的按钮，通常使用它表示“拒绝”动作。
       -  Negative：对应最右边的按钮，通常使用这个按钮来表示“取消”动作。
    -  这三种类型的按钮每个类型在AlertDialog只能设置一个，也就是说无法在对话框中设置两个Positive按钮。
    -  当对话框中的某个按钮被点击后，对话框会自动被关闭。


<br>　　范例3：添加列表。
　　使用`AlertDialog`提供的API可以添加三种类型的列表：

    -  传统的单一选择列表。
    -  单选列表(包含多个单选按钮)。
    -  多选列表(包含多个多选按钮)。
　　创建一个像下图所示的传统的单一选择列表需要调用`setItems()`方法：

<center>
![](/img/android/android_3_27.png)
</center>

　　由于这个列表显示在对话框的内容区域中，所以你不可以同时显示文本消息和列表，也就是说`AlertDialog.Builder`类的`setItems()`方法和`setMessage()`方法不可以同时使用。
``` java
public void onClick(View view) {
    final String[] array = { "A", "B", "C", "D" };
    // 创建一个事件监听器。
    OnClickListener listener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            if (AlertDialog.BUTTON_POSITIVE == which) {
                Toast.makeText(getApplicationContext(), "POSITIVE ", 0).show();
                return;
            }
            Toast.makeText(getApplicationContext(), "您点击的 " + array[which], 0).show();
        }
    };
    int i = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setItems(array, listener);
    dialog.show();
}
```
    语句解释：
    -  对话框中的按钮和各个Item项可以共用一个事件监听器。
    -  当某个Item被点击时，当前对话框同样会自动被关闭，参数which的值就是该Item的下标，下标从0开始计算。

<br>　　范例4：单选对话框。
``` java
private String choose = null;
private String[] array = {"男","女"};
public void onClick(View view){
    // 创建一个事件监听器。
    OnClickListener listener = new OnClickListener(){
        public void onClick(DialogInterface dialog, int which) {
            if(AlertDialog.BUTTON_POSITIVE == which){
                Toast.makeText(getApplicationContext(),"您点击的"+choose,0).show();
                return;
            }
            choose = array[which];
        }
    };
    int i  = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setSingleChoiceItems(array, -1, listener);
    dialog.show();
}
```
    语句解释：
    -  使用setSingleChoiceItems方法可以显示一个单选按钮列表。
    -  参数which是用户点击的单选按钮的下标，下标从0开始。

<br>　　范例5：多选对话框。
``` java
private boolean[] choose = new boolean[2];
private String[] array = { "A", "B" };
public void onClick(View view) {
    // 创建一个事件监听器。
    OnClickListener btnlistener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < choose.length; i++) {
                if (choose[i]) {
                    sb.append(array[i]).append(",");
                }
            }
            Toast.makeText(getApplicationContext(), sb.toString(), 0).show();
        }
    };
    int i = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", btnlistener);
    dialog.setMultiChoiceItems(array, choose,
            new OnMultiChoiceClickListener() {
                //  描述：用户点击了多选框对话框中的某个Item时，会触发此事件。
                //  参数：
                //  -  dialog：产生事件的Dialog对象。
                //  -  which：产生事件的多选按钮，下标从0开始。
                //  -  isChecked：产生事件的多选按钮的当前是否被选中。
                public void onClick(DialogInterface dialog, int which, boolean isChecked) {
                    choose[which] = isChecked;
                }
            });
    dialog.show();
}
```
    语句解释：
    -  使用setMultiChoiceItems方法可以显示一个多选按钮对话框。
    -  可以在调用setMultiChoiceItems方法时，指定一个DialogInterface.OnMultiChoiceClickListener类型的监听器，用于监听每一选项。

### ProgressDialog ###
　　进度条对话框`ProgressDialog`和进度条控件`ProgressBar`的用法十分相似，都是通过线程来不断的更新进度条。

<br>　　范例1：创建进度条对话框。
``` java
public class ViewTextActivity extends Activity {
    private ProgressDialog dialog;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        this.dialog = new ProgressDialog(this);
        //  设置进度条的最大值。
        this.dialog.setMax(100);
        //  设置进度条的显示风格。取值：
        //  -  水平进度条：ProgressDialog.STYLE_HORIZONTAL 。
        //  -  环形进度条：ProgressDialog.STYLE_SPINNER 。
        this.dialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
    }
    public void onClick(View view) {
        dialog.show();      
        new Thread(){
            int i = 0;
            public void run(){
                //  获取进度条的当前值、最大值。若当前Progress是圆形(即未知)进度条，则getProgress()总是返回0 。
                while(dialog.getProgress()<dialog.getMax()){
                    //  设置进度条的当前值。
                    dialog.setProgress(i++);
                    try {
                        Thread.sleep(30);
                    } catch (InterruptedException e) {}
                }
                dialog.dismiss();
            }
        }.start();
    }
}
```
    语句解释：
    -  可以直接在子线程中调用ProgressDialog的setProgress方法，因为其内部是通过Handler来更新的。
    -  在后面的章节中会对Handler进行详细介绍。

### LayoutInflater ###
　　因为在下一节自定义对话框时会用到`LayoutInflater`类，所以此处先来学习一下这个类。

　　通常我们会使用XML文件来创建界面，但是在一些特殊的情况下，可能需要在程序运行的时动态的修改界面中的内容（比如增删控件）。
<br>　　范例1：`main.xml`文件。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" 
    android:id="@+id/rootLayout" >
</LinearLayout>
```

<br>　　范例2：通过编码的方式添加TextView。
``` java
public class MainActivity extends Activity {
    private LinearLayout rootLayout;
    private TextView textView;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        // 初始化控件。
        this.rootLayout = (LinearLayout) this.findViewById(R.id.rootLayout);
        this.textView = new TextView(MainActivity.this);
        this.textView.setText("Hi TextView!");
        
        // 将textView添加到rootLayout中。
        this.rootLayout.addView(this.textView);
    }
}
```
    语句解释：
    -  首先，通过资源ID，从当前Activity的xml布局文件中获取LinearLayout的引用。
    -  然后，创建一个TextView控件，创建TextView对象时需要为其指出一个Context对象。 
    -  接着，调用LinearLayout继承自ViewGroup类的addView方法，将新控件添加到布局中。
    -  最后，一个控件只可以有一个父控件，即textView被放入到rootLayout后就不可以再被放入其他布局对象中，否则程序将抛异常。

<br>　　范例3：对象重用。
``` java
TextView text1 = (TextView) this.findViewById(R.id.text);
TextView text2 = (TextView) this.findViewById(R.id.text);
System.out.println(text1 == text2); //输出true。
```
    语句解释：
    -  findViewById方法只是从布局中查找指定的子View，因此使用相同的id连续调用两次，它们返回的结果是一样的。

<br>　　假设有一个需求，需要将其它XML布局中的控件添加到当前Activity中，此时就需要使用`LayoutInflater`类了。 

<br>　　范例4：`LayoutInflater`类。
``` java
//  描述：从指定的xml文件中获取其根节点(View) ，然后将根节点添加到root中，接着将该根节点的引用返回来。
//  参数：
//    resource ：xml文件的id 。如R.layout.main。root的取值可以为空。
//  返回值：返回resource所对应的布局文件中的根View的引用。
public View inflate(int resource, ViewGroup root);

//  根据指定的Context对象构造出一个LayoutInflater对象。
public static LayoutInflater from (Context context)
```

<br>　　范例5：招募小弟。
``` java
//  指定服务的名称，获取一个系统级的服务。此处则是获取一个LayoutInflater对象。
LayoutInflater inflater = (LayoutInflater) this.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
//  获取当前xml文件的根节点。
LinearLayout layout =(LinearLayout) this.findViewById(R.id.rootLayout);
//  从other.xml文件中获取其根节点，并将其放入layout中，如果已经存在了则不会再次放入。
LinearLayout text1 = (LinearLayout) inflater.inflate(R.layout.other, layout);
LinearLayout text2 = (LinearLayout) inflater.inflate(R.layout.other, layout);
//  注意： 此处会输出true 。
System.out.println(text1 ==  text2); 
```
    语句解释：
    -  虽然通过inflate方法向layout中添加了两遍，但是在当前Activity中只会显示添加一个。

<br>　　范例6：招募小弟2.0。
``` java
LayoutInflater inflater = (LayoutInflater) this.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
LinearLayout layout =(LinearLayout) this.findViewById(R.id.rootLayout);
LinearLayout text1 = (LinearLayout) inflater.inflate(R.layout.other, null);
LinearLayout text2 = (LinearLayout) inflater.inflate(R.layout.other, null);
//  注意： 此处会输出false。
System.out.println(text1 ==  text2); 
layout.addView(text1);
layout.addView(text2);
```
    语句解释：
    -  由于调用inflate方法时并没有将布局文件放入到任何控件中，因此每次inflate时都会返回一个新对象，所以调用ViewGroup的addView方法可以重复添加元素。

<br>　　范例7：父与子。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" 
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" 
    android:id="@+id/rootLayout">
    <TextView 
        android:layout_width="fill_parent"
        android:layout_height="wrap_content" 
        android:text="@string/hello" 
        android:id="@+id/text" />
</LinearLayout>
```
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        LinearLayout layout = (LinearLayout)this.findViewById(R.id.rootLayout);
        TextView text = (TextView) layout.getChildAt(0);
        // 输出true 。
        System.out.println(text.getParent() == layout);
    }
}
```
    语句解释：
    -  View类的getParent()方法返回值是一个ViewParnet对象，通常可以将ViewParnet进行向下转型为View。
    -  ViewGroup的getChildAt(int index)方法指定一个下标，获取当前View内部所包含的子View，下标从0开始，若下标越界则返回null。

<br>**ViewGroup.LayoutParams**
　　前面已经成功的实现动态向Activity中添加控件了。但是还是有一个缺点：上面的代码在创建完毕控件后，并没有为控件指定宽、高等属性。

<br>　　范例1：动态添加组件。
``` java
public class WebViewActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 初始化控件。
        LinearLayout linear = new LinearLayout(this);
        TextView username = new TextView(this);
        Button validate = new Button(this);
        // 设置文本
        username.setText("用户名：");
        validate.setText("验证");
        // 将Button和TextView添加到LinearLayout中。
        linear.addView(username);
        linear.addView(validate);
        setContentView(linear);
    } 
}
```
    语句解释：
    -  本范例就是在程序中动态的添加控件。
    -  本范例中控件的宽、高、padding、margin等属性的值都没有设置。 这些属性被称为：布局参数。使用ViewGroup.LayoutParams类来表示。 

<br>　　范例2：指定宽、高。
``` java
//  设置线性布局的排列方式。取值有：LinearLayout.VERTICAL（垂直排列）和LinearLayout.HORIZONTAL（水平排列）。
linear.setOrientation(LinearLayout.VERTICAL);
// 将Button和TextView添加到LinearLayout中，同时为它们指定宽、高。
linear.addView(username, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
linear.addView(validate, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
setContentView(linear);
```
    语句解释：
    -  在ViewGroup.LayoutParams的构造方法中除了可以使用常量外，也可以指定具体数值。
    -  在Android中的布局控件(如：LinearLayout、RadioGroup等)都具有一个名为LayoutParams的内部类。
    -  各个LayoutParams各自提供了不同的布局参数，用于描述该控件不同的属性。它们都派生自ViewGroup.LayoutParams。 

<br>　　范例3：Margin属性。
``` java
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 创建一个线形布局。
        LinearLayout linearLayout = new LinearLayout(this);
        TextView textView = new TextView(this);
        textView.setText("Hi Androdi");
        // 为TextView设置布局参数。
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(100, 50);
        params.topMargin = 100;
        params.leftMargin = 100;
        // 将TextView添加到布局中。
        linearLayout.addView(textView,params);
       
        setContentView(linearLayout);
    }
}
```
    语句解释：
    -  使用布局参数的topMargin等属性可以设置当前View与其相邻控件或父控件间的间距。
    -  本范例中addView()方法将控件textView按照params所指定的参数，将其放置到父控件linearLayout中。

### Custom Dialog ###
　　在实际中，内置的各种对话框并不能满足应用的需求，因此往往需要自定义对话框。

<br>　　自定义对话框的步骤：
    -  首先，实例化出一个Dialog对象，并设置对话框的初始参数，如标题、图标等。
    -  然后，自定义一个xml布局文件。
    -  接着，将xml布局文件导入到程序中。
    -  最后，调用Dialog对象的setContentView方法，将xml布局文件中所有的控件设置到Dialog对象中去。

<br>　　范例1：自定义布局文件(`layout.xml`)。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" >
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/text"/>
    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="点击"
        android:id="@+id/btn"/>
</LinearLayout>
```

<br>　　范例2：自定义对话框的内容。
``` java
Dialog dialog = new Dialog(this);
// 初始化对话框。
dialog.setTitle("对话框的标题");
dialog.setCancelable(false);
// 获取布局文件的根节点。
LayoutInflater inflater = LayoutInflater.from(getApplicationContext());;
LinearLayout layout = (LinearLayout) inflater.inflate(R.layout.layout, null);
// 获取布局中的控件。
Button okBtn = (Button) layout.findViewById(R.id.btn);
EditText input_psw = (EditText) layout.findViewById(R.id.text);
// 在下面可以为按钮添加OnClickListener 、为TextView设置文本信息。
// ......
// 最后，将布局的根节点添加到View中。
dialog.addContentView(layout, new LinearLayout.LayoutParams(220,150));
// 显示对话框。
dialog.show();
```

## Pickers ##
　　Android给用户提供了选择`时间`（小时，分钟，上午/下午）或`日期`（月，日，年）的控件，使用这些选择器有助于确保用户可以选择一个有效的、格式正确的时间或日期，并自动调整到用户的所在区域。

<center>
![](/img/android/android_3_28.png)
</center>

<br>　　范例1：创建一个时间选择器。
``` java
public class MainActivity extends Activity implements OnTimeSetListener {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final Calendar c = Calendar.getInstance();
        int hour = c.get(Calendar.HOUR_OF_DAY);
        int minute = c.get(Calendar.MINUTE);
        //  创建一个TimePickerDialog对象。构造方法：
        //  TimePickerDialog(Context context, TimePickerDialog.OnTimeSetListener callBack, int hourOfDay, int minute, boolean is24HourView)
        //  参数：
        //  -  callBack：当用户选择完时间后，会调用此接口中定义的回调方法。
        //  -  hourOfDay、minute ：时间选择器默认的小时、分钟。
        //  -  is24HourView：是否按24小时制。
        Dialog d = new TimePickerDialog(this, this, hour, minute, DateFormat.is24HourFormat(this));
        d.show();
    }
    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
        // TODO Auto-generated method stub
    }
}
```

<br>　　范例2：创建一个日期选择器。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Dialog d = new DatePickerDialog(this, new OnDateSetListener() {
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Toast.makeText(getApplicationContext(), year + "年" + monthOfYear + "月" + dayOfMonth + "日", 1).show();
            }
        }, 2011, 10, 28);
        d.show();
    }
}
```

<br>　　开发中往往不会直接写死具体日期常量，而是使用`Calendar`工具类。

<br>　　范例3：Calendar抽象类。
``` java
Calendar calendar = new GregorianCalendar();
System.out.println("年: " + calendar.get(Calendar.YEAR));
System.out.println("月: " + (calendar.get(Calendar.MONTH)+1));
System.out.println("日: " + calendar.get(Calendar.DAY_OF_MONTH));
System.out.println("时: " + calendar.get(Calendar.HOUR_OF_DAY));
System.out.println("分: " + calendar.get(Calendar.MINUTE));
System.out.println("秒: " + calendar.get(Calendar.SECOND));
System.out.println("毫秒: " +calendar.get(Calendar.MILLISECOND));
```
    语句解释：
    -  使用java.util包中的Calendar类可以截取出当前Date对象的各个部分。

<br>　　提示：系统自带的Pickers会依据系统的版本不同而拥有不同的外观，我们可以使用开源项目：[ Android-Holo-DateTimePicker ](https://github.com/aizhang/Android-Holo-DateTimePicker)来统一风格。

## Notification ##
　　`Notification`（通知）是一个被放到系统状态栏中的消息：

<center>
![](/img/android/android_3_22.png)
</center>

<center>
![](/img/android/android_3_23.png)
</center>

　　它与对话框一样都是用来告诉用户有事件发生了，不同的是，对话框需要用户立刻处理事件，而通知由于被放到了状态栏中，所以用户可以自己选择在适当的时候处理此事件。

　　应用场景：

    当用户的应用程序正在一个后台服务中工作，并且需要把一个内部事件通知给用户时，这种类型的通知是非常合适的。

<br>**Notification类**
　　当你向系统发出一个通知时，系统就会将一个图标放在`状态栏`的`通知区域`（如下图所示），然后当用户下拉状态栏时，就可以看到详细的通知。`状态栏`是系统控制的区域，它们不隶属于任何用户程序，用户可以随时查看。

<center>
![状态栏的通知区域](/img/android/android_3_29.png)
</center>

　　为了创建通知，你必须用到两个类：`Notification`和`NotificationManager`。

    -  Notification类的一个实例代表一个通知，通知有很多属性：如图标，播放的声音等。
    -  NotificationManager是系统服务，用于执行和管理系统中所有通知(Notification)对象。诸如发送、移除通知等操作都由此类来完成，你不需要直接初始化NotificationManager。

<br>　　在正式创建通知之前，需要先了解下面列出的一些概念。

<br>　　**1. NotificationManager**
　　由于状态栏不隶属于任何应用程序，因此向状态栏`发送`、`更新`、`删除`通知需要使用系统对外提供的接口，也就是通过`NotificationManager`类来完成。
　　`NotificationManager`是通知管理器类，通过下面的代码可以获取该类的对象：
``` android
// 其中this表示Activity对象。
NotificationManager mgr = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
```

<br>　　**2. Notification视觉风格**
　　`Notification`有两种视觉风格，一种是标准视图(Normal view)、一种是大视图（Big view）。标准视图在Android中各版本是通用的，但是对于大视图而言，仅在`Android4.1+`的版本上可用。

<br>　　**3. PendingIntent**
　　对于一个通知而言，它能显示的消息是有限的（仅显示一些概要信息），所以我们需要给它设置一个事件回调，当用户点击它的时候，就打开一个Activity（或其它组件）来显示详细的内容。
　　这个点击回调就用`PendingIntent`类表示：

    PendingIntent是对Intent的包装，通过名称可以看出PendingIntent可以译为“延期意图”，它用于表示即将发生的意图，而Intent用来表示马上发生的意图，对于通知来说，它是系统级的全局通知，并不确定这个意图被执行的时间。

### 标准视图 ###
　　从官方文档了解到，一个标准视图显示的大小要保持在`64dp`高，宽度为屏幕标准。标准视图的通知主体内容有一下几个：

<center>
![](/img/android/android_3_30.png)
</center>

    1. 通知标题（contentTitle）。
    2. 大图标（largeIcon）。
    3. 通知内容（contentText）。
    4. 通知消息（number）。
    5. 小图标（smallIcon）。
    6. 通知的时间，一般为系统时间，也可以使用setWhen()设置。

　　下面通过一个示例，模仿上面效果的通知。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(MainActivity.this);
        mBuilder.setSmallIcon(R.drawable.ic_launcher);
        mBuilder.setContentTitle("5 new message");
        mBuilder.setContentText("twain@android.com");
        //  状态栏通知区域上一闪而过的文本消息。
        mBuilder.setTicker("New message");
        mBuilder.setNumber(12);
        //  设置大图标。如果不设置大图标，则小图标会被显示到大图标所在的位置上。
        Bitmap btm = BitmapFactory.decodeResource(getResources(),R.drawable.ic_action_download);
        mBuilder.setLargeIcon(btm);
        //  当通知被点击后，通知会自动从状态栏中删除。
        mBuilder.setAutoCancel(true);
        //  构建一个Intent
        Intent resultIntent = new Intent(MainActivity.this, MainActivity.class);
        //  当用户点击了通知栏上的通知时，系统会触发执行这个PendingIntent对象。
        //  相应的PendingIntent类还提供了getService、getBroadcas两个方法。
        PendingIntent resultPendingIntent = PendingIntent.getActivity(
                MainActivity.this, 0, resultIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        //  设置通知主题的意图
        mBuilder.setContentIntent(resultPendingIntent);
        //  获取通知管理器对象
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, mBuilder.build());
    }
}
```

　　显示效果：

<center>
![](/img/android/android_3_31.png)
</center>

<br>**更新与移除通知**
　　在使用`NotificationManager.notify()`发送通知的时候，需要同时传递一个标识符，用于唯一标识这个通知。

　　对于一个通知，当展示在状态栏之后，如何取消呢？Android为我们提供两种方式移除通知：
　　第一种是`Notification`自己维护，使用`setAutoCancel()`方法设置是否维护。
　　第二种是使用`NotificationManager`通知管理器对象来维护，它通过`notify()`发送通知的时候，指定的通知标识`id`来操作通知，可以使用`cancel(int)`来移除一个指定的通知，也可以使用`cancelAll()`移除所有的通知。

``` java
//  使用NotificationManager移除指定通知示例。
NotificationManager mNotificationManager = (NotificationManager) 
              getSystemService(Context.NOTIFICATION_SERVICE);
mNotificationManager.cancel(0);
```

### 大视图 ###
　　而对于大视图（Big View）而言，它的细节区域只能显示`256dp`高度的内容，并且只对`Android4.1+`之后（但在之前的版本中也不会报错）的设备才支持，它比标准视图不一样的地方，均需要使用`setStyle()`方法设定，它大致的效果如下：

<center>
![](/img/android/android_3_32.png)
</center>

　　`setStyle()`传递一个`NotificationCompat.Style`对象，它是一个抽象类，Android为我们提供了三个实现类，用于显示不同的场景。分别是：

    -  NotificationCompat.BigPictureStyle，在细节部分显示一个256dp高度的位图。
    -  NotificationCompat.BigTextStyle，在细节部分显示一个大的文本块。
    -  NotificationCompat.InboxStyle，在细节部分显示多行文本。

<br>　　下面会以一个示例来展示`InboxStyle`的使用，模仿上面图片的显示。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Bitmap btm = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,PendingIntent.FLAG_CANCEL_CURRENT);
        Notification noti = new NotificationCompat.Builder(this)
            .setSmallIcon(R.drawable.ic_launcher)
            .setLargeIcon(btm)
            .setNumber(13)
            .setContentText("ContentText")
            .setContentTitle("ContentTitle")
            .setContentIntent(pendingIntent)
            // 设置通知被展开时，所显示的内容。
            .setStyle(new NotificationCompat.InboxStyle()
                // 一行行的增加文本。
                .addLine("M.Twain (Google+) Haiku is more than a cert...")
                .addLine("M.Twain Reminder")
                .addLine("M.Twain Lunch?")
                .addLine("M.Twain Revised Specs")
                .addLine("M.Twain ")
                .addLine("Google Play Celebrate 25 billion apps with Goo..")
                .addLine("Stack Exchange StackOverflow weekly Newsl...")
                .setBigContentTitle("6 new message")
                .setSummaryText("mtwain@android.com"))
        .build();
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, noti);
    }
}
```

　　显示效果：

<center>
![](/img/android/android_3_33.png)
</center>

　　值得注意的是，不同厂家的手机对大视图风格的通知有不同的展现形式，比如：

    -  在三星S5手机上，当程序向状态栏中添加大视图风格的通知时，默认情况该通知会被折叠起来（即和正常通知的大小一样），用户可以通过滑动来展开通知，通知一旦被展开则无法重新折叠回去。
    -  在Android4.1的模拟器上，默认直接将大视图的通知给展开，因而用户无法查看到通知的contentTitle、contentText属性的值，同时也无法将通知折叠回去，所以通常情况下我们应该为setContentText和setBigContentTitle传递相似的值。

　　还有一点就是，`Android4.1`之前的设备上是无法显示大视图的通知的，因此为了兼容性考虑，请务必设置通知的`contentTitle`、`contentText`属性的值。

### 进度条样式的通知 ###
　　对于一个标准通知，有时候显示的消息并不一定是静态的，还可以设定一个进度条用于显示事务完成的进度。

　　`Notification.Builder`类中提供一个`setProgress(int max, int progress, boolean indeterminate)`方法用于设置进度条：

    -  max用于设定进度的最大数。
    -  progress用于设定当前的进度
    -  indeterminate用于设定是否是一个不确定进度的进度条。
　　通过`indeterminate`的设置，可以实现两种不同样式的进度条，一种是有进度刻度的（`true`）,一种是循环流动的（`false`）。


<br>　　范例1：有进度刻度。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        final NotificationCompat.Builder builder = new NotificationCompat.Builder(MainActivity.this);
        builder.setSmallIcon(R.drawable.ic_launcher);
        builder.setContentTitle("Picture Download");
        builder.setContentText("Download in progress");
        builder.setAutoCancel(true);
        final PendingIntent pendingintent = PendingIntent.getActivity(this, 0, new Intent(), PendingIntent.FLAG_CANCEL_CURRENT);
        builder.setContentIntent(pendingintent);
        final NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        //通过一个子线程，动态增加进度条刻度
        new Thread(new Runnable() {
            public void run() {
                int incr;
                for (incr = 0; incr <= 100; incr += 5) {
                    builder.setProgress(100, incr, false);
                    manager.notify(0, builder.build());
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException e) { }
                }
                builder.setContentText("Download complete");
                builder.setProgress(0, 0, false);
                manager.notify(0, builder.build());
            }
        }).start();
    }
}
```
    语句解释：
    -  只有在Android4.0+以后的版本中通知才支持进度条，在更低的版本中通知里是不会包含进度条的。
    -  只要把setProgress方法的第三个参数改为true，就可以显示一个不确定的进度条。

### 设定提示响应 ###
　　对于有些通知，需要调用一些设备的资源，使用户能更快的发现有新通知，一般可设定的响应有：铃声、闪光灯、震动。对于这三个属性，`NotificationCompat.Builder`提供了三个方法设定：

    -  setSound(Uri sound)：设定一个铃声，用于在通知的时候响应，传递一个Uri的参数。
    -  setLights(int argb, int onMs, int offMs)：设定前置LED灯的闪烁速率，持续毫秒数，停顿毫秒数。
    -  setVibrate(long[] pattern)：设定震动的模式，以一个long数组保存毫秒级间隔的震动。

<br>　　大多数时候，我们并不需要设定一个特定的响应效果，只需要遵照用户设备上系统通知的效果即可，那么可以使用`setDefaults(int)`方法设定默认响应参数，在`Notification`中，对它的参数使用常量定义了，我们只需使用即可：

    -  DEFAULT_ALL：铃声、闪光、震动均系统默认。
    -  DEFAULT_SOUND：系统默认铃声。
    -  DEFAULT_VIBRATE：系统默认震动。
    -  DEFAULT_LIGHTS：系统默认闪光。

<br>　　而在Android中，如果需要访问硬件设备的话，是需要用户对其进行授权的，所以需要在清单文件`AndroidManifest.xml`中增加两个授权，分别授予访问振动器与闪光灯的权限：
``` xml
<!-- 闪光灯权限 -->
<uses-permission android:name="android.permission.FLASHLIGHT"/>
<!-- 振动器权限 -->
<uses-permission android:name="android.permission.VIBRATE"/>
```

<br>**添加声音**
``` java
// 使用res/raw目录下的音乐文件。
mBuilder.setSound(Uri.parse("android.resource://"+getPackageName()+"/"+R.raw.system));

// 使用SD卡下的音乐文件。
mBuilder.setSound(Uri.parse("file://"+Environment.getExternalStorageDirectory()+"/notification/ringer.mp3"));

// 使用系统的默认声音。
mBuilder.setDefaults(Notification.DEFAULT_SOUND);
```

<br>**添加震动**
``` java
// 使用系统默认的震动
mBuilder.setDefaults(Notification.DEFAULT_VIBRATE);

// 自定义的方式，要是定义一个long型数组，赋值给vibrate属性。
mBuilder.setVibrate(new long[] { 100, 200, 300 });
```
    语句解释：
    -  long型的数组定义了交替振动的方式和振动的时间（毫秒）。
    -  第一个值是指振动前的准备（间歇）时间，第二个值是第一次振动的时间，第三个值又是间歇的时间，以此类推。

<br>**添加闪灯**
``` java
// 使用默认闪灯
mBuilder.setDefaults(Notification.DEFAULT_LIGHTS);
```

<br>
**本节参考阅读：**
- [Android--通知之Notification](http://www.cnblogs.com/plokmju/p/android_notification.html)
- [Notifications in Android 4.4 and Lower](http://developer.android.com/design/patterns/notifications_k.html)


# 第四节 自定义控件 - 基础入门 #

　　`Android`系统内置了许多控件，如果这些控件不能满足需求，您可以自定义自己的控件，自定义的控件必须继承`View`类。

<br>**三种自定义控件的方式**
<br>　　按实现方式来划分的话，自定义View分为三种：自绘控件、组合控件、以及继承控件。

    -  自绘控件：View上所展现的内容全部都是我们自己绘制出来的。此种方式也是最难的，一般会通过直接继承View类来实现自定义控件。
    -  继承控件：如果对已有的控件进行小调整就能满足需求，那么可以通过继承它们并重写onDraw()方法来实现自定义控件。比如，继承EditText使之产生了带有下划线的记事本页面。
    -  组合控件：通过将几个系统原生的控件组合到一起，来实现自定义控件。比如，使用PopupWindow和Button来组合出一个下拉列表框等。

<br>　　为了更好的理解自定义控件的各个步骤，在正式开始之前，我们先来了解一些相关的知识点：Activity的组成。

## Activity的组成 ##
　　本节来介绍一下`Window`、`WindowManagerService`、`WindowManager`三个类。
### Window ###
　　我们都知道，在Android中，屏幕上所显示的控件是以Activity为单位进行组织的。
　　但是再深入点看的话，就会发现Activity其实主要是处理一些逻辑问题（比如生命周期的管理等），显示在屏幕上的控件并不是由它来管理的，而是交给了`Window`类。

　　不信的话，可以打开Activity类的源码，看一下它的setContentView方法：
``` java
private Window mWindow;
private WindowManager mWindowManager;

public void setContentView(@LayoutRes int layoutResID) {
    getWindow().setContentView(layoutResID);
    initWindowDecorActionBar();
}

public Window getWindow() {
    return mWindow;
}
```
    语句解释：
    -  从上面可以发现，Activity会转调用Window类的setContentView方法。
    -  再次声明，Android系统的源码每个版本之间都会有一些差别，所以笔者在本章以及以后章节中所贴出的源码，如果和你看到的源码不一致，那么请淡定！
       -  笔者使用的源码版本是：Android-23 。

<br>　　观察仔细点的话会发现Window是一个抽象类，为了能继续追踪源码，我们得先去查看`mWindow`是何时初始化的，进而找到实例化的是哪个类。
　　查看的过程以后再说，直接说结果吧：

    -  首先，当我们请求启动某个Activity时，系统会调用它的无参构造方法实例化一个它的对象。
    -  然后，会调用该对象的attach方法，执行初始化操作，而它的mWindow属性就是在attach方法中初始化的。

<br>　　那么就来看一下Activity的`attach`方法的代码：
``` java
final void attach(/*此处省略若干参数*/) {

    mWindow = new PhoneWindow(this);
    
    // 省略若干代码...

    // 依据一些参数，来初始化WindowManager对象。
    mWindow.setWindowManager(
            (WindowManager)context.getSystemService(Context.WINDOW_SERVICE),
            mToken, mComponent.flattenToString(),
            (info.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0);

    // 省略若干代码...

    // 为mWindowManager属性赋值。
    mWindowManager = mWindow.getWindowManager();

    // 省略若干代码...
}
```
    语句解释：
    -  其实Window类官方文档已经告诉我们了，该类只有一个唯一的子类android.view.PhoneWindow。
    -  如果继续追踪上面第8行代码的话，还可以知道mWindowManager所指向的对象将是WindowManagerImpl类型的。
    -  用一句话概括：“当Activity被实例化之后，会接着初始化它的mWindow、mWindowManager属性”。

<br>　　继续追踪就会发现，我们调用`setContentView`方法设置给Activity的布局，最终会由`PhoneWindow`类的`DecorView`管理。

　　这里先给出一个完整的示意图，后面会详细分析：

<center>
![Activity内部结构](/img/android/android_f05_01.png)
</center>

　　`DecorView`是`PhoneWindow`的内部类，继承自`FrameLayout`。还有一点需要知道的是：

    -  笔者之所以说Activity的控件是由DecorView管理的，而不说是由PhoneWindow管理的，是因为：
       -  DecorView是一个真正的View对象，我们设置给Activity的布局，最终会被放到DecorView里面。
       -  而PhoneWindow并不是一个View。

<br>　　回到刚才说的地方，我们来看一下`PhoneWindow`类的`setContentView`方法：
``` java
public void setContentView(int layoutResID) {
    // 省略若干代码...

    // mContentParent就是上图的R.id.content所对应的布局。
    if (mContentParent == null) {
        // mContentParent没有值就意味着DecorView没被初始化，下面就去初始化。
        installDecor();
    } else if (!hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
        // 如果已经初始化了，则删除现有的所有子View。
        mContentParent.removeAllViews();
    }

    if (hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
        final Scene newScene = Scene.getSceneForLayout(mContentParent, layoutResID,
                getContext());
        transitionTo(newScene);
    } else {
        // 将用户传递过来的布局，放入到mContentParent中。
        mLayoutInflater.inflate(layoutResID, mContentParent);
    }

    // 省略若干代码...
}
```
    语句解释：
    -  这段代码用来检测DecorView是否初始化完毕，然后再将layoutResID所对应的布局放到DecorView中。

<br>　　接着看一下`installDecor`、`generateDecor`、`generateLayout`方法：
``` java
private void installDecor() {
    if (mDecor == null) {
        // 创建DecorView。
        mDecor = generateDecor();
        // 省略若干代码...
    }
    if (mContentParent == null) {
        // 获取R.id.content所对应的布局，并把它赋值给mContentParent。
        mContentParent = generateLayout(mDecor);
        // 省略若干代码...
    }
}

protected DecorView generateDecor() {
    return new DecorView(getContext(), -1);
}

protected ViewGroup generateLayout(DecorView decor) {
    // 省略若干代码...

    // 依据当前设备的情况来决定使用哪个布局。
    int layoutResource;
    int features = getLocalFeatures();
    if ((features & (1 << FEATURE_SWIPE_TO_DISMISS)) != 0) {
        layoutResource = R.layout.screen_swipe_dismiss;
    } else if ((features & ((1 << FEATURE_LEFT_ICON) | (1 << FEATURE_RIGHT_ICON))) != 0) {
        // 省略若干代码...
    } else if ((features & ((1 << FEATURE_PROGRESS) | (1 << FEATURE_INDETERMINATE_PROGRESS))) != 0
            && (features & (1 << FEATURE_ACTION_BAR)) == 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_CUSTOM_TITLE)) != 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_NO_TITLE)) == 0) {
        // 省略若干代码...
    } else if ((features & (1 << FEATURE_ACTION_MODE_OVERLAY)) != 0) {
        // 省略若干代码...
    } else {
        layoutResource = R.layout.screen_simple;
    }

    // 装载布局，并将它放入到DecorView中。
    View in = mLayoutInflater.inflate(layoutResource, null);
    decor.addView(in, new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT));
    // 这个mContentRoot在上面的图中有标注。
    mContentRoot = (ViewGroup) in;

    // 从DecorView中查找出id为R.id.content的布局。
    ViewGroup contentParent = (ViewGroup)findViewById(ID_ANDROID_CONTENT);
    
    // 省略若干代码...

    return contentParent;
}

public View findViewById(@IdRes int id) {
    return getDecorView().findViewById(id);
}

```
    语句解释：
    -  至此也就看明白了，传递给setContentView方法的布局，最终会被放入到DecorView中。
    -  第23行代码用来获取当前窗口配置，后面会依据该方法的返回值来决定使用哪个布局。
       -  例如，窗口配置类型包括FullScreen(全屏)、NoTitleBar(不含标题栏)等。

<br>　　另外，我们可以使用Activity的`requestFeature()`方法来修改窗口配置，不过该方法必须在`setContentView`之前调用。
　　从`PhoneWindow`类的`requestFeature`方法可以看出，若在`setContentView`之后修改窗口配置，会抛异常：
``` java
@Override
public boolean requestFeature(int featureId) {
    if (mContentParent != null) {
        throw new AndroidRuntimeException("requestFeature() must be called before adding content");
    }

    // 省略若干代码...

    return super.requestFeature(featureId);
}
```

<br>　　默认情况下，`DecorView`内部只有一个子元素，也就是上面说的`mContentRoot`，而且`mContentRoot`一般是`LinearLayout`的子类，里面包含`标题栏`和`内容区域`两部分：
``` xml

<!--   android-sdk\platforms\android-8\data\res\layout\screen.xml   -->

<!-- Title bar and content -->
<LinearLayout  xmlns:android="http://schemas.android.com/apk/res/android"
    android:fitsSystemWindows="true"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <!-- Title bar -->
    <RelativeLayout android:id="@android:id/title_container"
        style="?android:attr/windowTitleBackgroundStyle"
        android:layout_width="match_parent"
        android:layout_height="?android:attr/windowTitleSize" >

        <!-- 此处省略若干行代码 -->

    </RelativeLayout>

    <!-- Content -->
    <FrameLayout android:id="@android:id/content"
        android:layout_width="match_parent"
        android:layout_height="0dip"
        android:layout_weight="1"
        android:foregroundGravity="fill_horizontal|top"
        android:foreground="?android:attr/windowContentOverlay"
    />
</LinearLayout>
```
    语句解释：
    -  我们调用Activity的setContentView()方法设置的布局，最终会以子结点的形式加入到这个FrameLayout中。

<br>　　比如，我们可以在`Activity`中通过代码来控制`内容区域`的显示与隐藏。
　　范例1：隐藏`contentView`。
``` java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // FrameLayout的id为android.R.id.content。
        findViewById(android.R.id.content).setVisibility(View.GONE);
    }
}
```
    语句解释：
    -  您可以直接输出findViewById(android.R.id.content)的值来验证是否是一个帧布局。
    -  你也可以在onCreate方法中隐藏掉标题栏、状态栏，具体的代码请自行搜索。

### WindowManagerService ###
　　通过上面的分析，我们知道DecorView是何时创建的了，但它是如何被添加到屏幕上的呢？

    答案是：通过WindowManagerService类来完成的。

<br>　　下面给出一张示意图：

<center>
![Activity深层结构图](/img/android/android_f05_02.png)
</center>

　　我们从下往上看这张图，整个图分为三部分：

    -  SdkClient部分表示Activity的内部结构，由PhoneWindow和DecorView组成。
    -  FrameworkServer端用来完成整个Android系统的窗口、事件捕获和分发、输入法等的控制。
    -  FrameworkClient用来连接SdkClient端和FrameworkServer端，它通过Binder机制让两者跨进程通信。
    -  从上图可以看出，WindowManagerService（简称WMS）只会和ViewRoot类通信，DecorView则是通过WindowManager类来与ViewRoot通信。

<br>**添加Activity到屏幕**

　　比如我们现在新建一个Activity，那么此时系统会这么执行：
    -  第一，先实例化Activity对象，然后调用attach方法、setContentView方法初始化。
    -  第二，当需要显示Activity时，系统会使用WindowManager类来将DecorView添加到屏幕上。
    -  第三，但WindowManager并不会执行添加操作，它会为DecorView创建一个ViewRoot对象，然后再请ViewRoot去添加。
    -  第四，但ViewRoot实际上也不会执行添加操作，它会使用Binder机制（跨进程）访问远程的WMS类，也就是说添加操作会由WMS来完成。

　　上面只是说了一下大体执行步骤，下面就来跟随源码一起，观察一个新Activity被添加到屏幕中的过程。

<br>　　第一步，当系统准备resume一个Activity时，会调用`ActivityThread`的`handleResumeActivity`方法：
``` java
final void handleResumeActivity(IBinder token,
    boolean clearHide, boolean isForward, boolean reallyResume) {

    // 省略若干代码...

    if (r.window == null && !a.mFinished && willBeVisible) {
        r.window = r.activity.getWindow();
        View decor = r.window.getDecorView();
        decor.setVisibility(View.INVISIBLE);
        ViewManager wm = a.getWindowManager();
        WindowManager.LayoutParams l = r.window.getAttributes();
        a.mDecor = decor;
        l.type = WindowManager.LayoutParams.TYPE_BASE_APPLICATION;
        l.softInputMode |= forwardBit;
        if (a.mVisibleFromClient) {
            a.mWindowAdded = true;
            wm.addView(decor, l);
        }

    // If the window has already been added, but during resume
    // we started another activity, then don't yet make the
    // window visible.
    } else if (!willBeVisible) {
        if (localLOGV) Slog.v(
            TAG, "Launch " + r + " mStartedActivity set");
        r.hideForNow = true;
    }

    // 省略若干代码...
}
```
    语句解释：
    -  从第17行代码可以看出来，系统会调用WindowManager的addView方法来将DecorView添加到屏幕上。
    -  通过前面的分析可以知道，实际上调用的是WindowManagerImpl类的addView方法。
    -  继续跟进的话，就会看到最终会调用WindowManagerGlobal的addView方法。

<br>　　第二步，查看`WindowManagerGlobal`类的`addView`方法：
``` java
public void addView(View view, ViewGroup.LayoutParams params,
        Display display, Window parentWindow) {

    // 省略若干代码...

    ViewRootImpl root;
    View panelParentView = null;

    // 省略若干代码...

    root = new ViewRootImpl(view.getContext(), display);

    // 省略若干代码...

    root.setView(view, wparams, panelParentView);

    // 省略若干代码...
}
```
    语句解释：
    -  此方法里创建一个ViewRootImpl对象，这个对象很重要：
       -  当WMS需要分发事件、绘制控件时都会通知ViewRootImpl，然后再由ViewRootImpl来通知DecorView。
       -  相应的，当想往屏幕上添加控件时，也得通过ViewRootImpl类来将控件传递给WMS。
    -  第15行代码调用了ViewRootImpl的setView方法，同时将DecorView传递过去。

<br>　　第三步，查看`ViewRootImpl`类的`setView`方法：
``` java
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {

    //  持有DecorView的引用。
    mView = view;

    // 省略若干代码...

    // 调用WindowManagerService来执行添加操作。
    res = mWindowSession.addToDisplay(mWindow, mSeq, mWindowAttributes,
            getHostVisibility(), mDisplay.getDisplayId(),
            mAttachInfo.mContentInsets, mAttachInfo.mStableInsets,
            mAttachInfo.mOutsets, mInputChannel);

    // 省略若干代码...
}

```
    语句解释：
    -  此方法第4行代码，首先保存了DecorView的引用，因为以后会用到它。
    -  可以把WindowSession类理解为WMS抛给咱们进程的回调，第9行代码调用addToDisplay方法来请求WMS执行一些初始化操作。当然此时屏幕上还没有绘制任何内容，不过我们就不继续向下深入了，只需要知道控件的绘制等操作是在WMS那端完成的即可。

<br>**分发输入事件**

　　除了负责往屏幕上添加和删除控件外，WMS还会用来分发输入事件。

　　以触摸事件为例：

    触摸事件是由Linux内核的一个Input子系统来管理的(InputManager)，Linux子系统会在/dev/input/这个路径下创建硬件输入设备节点(这里的硬件设备就是我们的触摸屏了)。当手指触动触摸屏时，硬件设备通过设备节点像内核(其实是InputManager管理)报告事件，InputManager经过处理将此事件传给Android系统的一个系统Service —— WindowManagerService 。

<br>　　当WMS接收到一个输入事件时，会按照下面的路线传递：

    -  首先，把事件传递给当前前台Activity的ViewRootImpl类。
    -  然后，ViewRootImpl又会将事件传递给它的内部类ViewPostImeInputStage，该类依据事件的类型来调用不同的方法：
       -  processPointerEvent方法：处理触屏事件。
       -  processTrackballEvent方法：处理轨迹球事件。
       -  processKeyEvent方法：处理键盘事件。

　　接着，同样以触屏事件为例，`processPointerEvent`方法在接到事件后，源代码如下所示：
``` java
private int processPointerEvent(QueuedInputEvent q) {
    final MotionEvent event = (MotionEvent)q.mEvent;

    mAttachInfo.mUnbufferedDispatchRequested = false;
    // 将事件传递给DecorView的dispatchPointerEvent方法。
    boolean handled = mView.dispatchPointerEvent(event);
    if (mAttachInfo.mUnbufferedDispatchRequested && !mUnbufferedInputDispatch) {
        mUnbufferedInputDispatch = true;
        if (mConsumeBatchedInputScheduled) {
            scheduleConsumeBatchedInputImmediately();
        }
    }
    return handled ? FINISH_HANDLED : FORWARD;
}
```
    语句解释：
    -  从第6行代码可以看到调用了DecorView的dispatchPointerEvent方法，该方法继承自View类。

　　接着来看一下View类的`dispatchPointerEvent`方法：
``` java
public final boolean dispatchPointerEvent(MotionEvent event) {
    // 如果当前处于触摸模式，则调用View类的dispatchTouchEvent方法。
    if (event.isTouchEvent()) {
        return dispatchTouchEvent(event);
    } else {
        return dispatchGenericMotionEvent(event);
    }
}
```
    语句解释：
    -  就像我们看到的那样，一般情况下，会接着转调用View类的dispatchTouchEvent方法。

　　接着，看一下`DecorView`的`dispatchTouchEvent`方法：
``` java
public boolean dispatchTouchEvent(MotionEvent ev) {
    final Callback cb = getCallback();
    return cb != null && !isDestroyed() && mFeatureId < 0 ? cb.dispatchTouchEvent(ev)
            : super.dispatchTouchEvent(ev);
}
```
    语句解释：
    -  这里的Callback是一个关键点，实际上它就是DecorView所属的Activity。
    -  在Activity的attach方法中可以找到初始化的代码：“mWindow.setCallback(this);”。

<br>　　分析到此也就明白了，输入事件的传递顺序为：

    WMS -> ViewRootImpl -> DecorView -> Activity 

<br>**执行绘制操作**

　　与分发输入事件的过程类似，当系统需要绘制Activity的界面时，也会执行下面的步骤：

    -  首先，调用ViewRootImpl的performTraversals方法。
    -  然后，该方法依据具体的情况来调用不同的子方法：
       -  performMeasure方法：执行测量操作。其内部会转调用DecorView的measure方法。
       -  performLayout方法：执行布局操作。其内部会转调用DecorView的layout方法。
       -  performDraw方法：执行绘制操作。其内部会转调用DecorView的draw方法。

　　其实`DecorView`类的`measure`、`layout`、`draw`三个方法都是继承自View类，而且我们稍后也会遇到它，所以此处先将它们列出来，混脸熟。

<br>**本节参考阅读：**
- [Android 窗口管理](http://1025250620.iteye.com/blog/1779670)
- [Android Touch事件的分发过程](http://www.ithao123.cn/content-2273147.html)
- [Android 事件分发机制详解](http://stackvoid.com/details-dispatch-onTouch-Event-in-Android/)

### WindowManager ###
　　`Activity`、`Dialog`、`Toast`里的控件，都是通过`WindowManager`来添加到屏幕上的，因此我们先来看一看该类的用法。

#### 基础用法 ####
　　接下来，从最简单的范例开始，一步步的介绍`WindowManager`类。

<br>　　范例1：添加一个`TextView`。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 将Activity的引用传递过去。
        addViewToScreen(this);
    }

    private void addViewToScreen(Context context){
        // 首先，获取一个WindowManager对象。
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        // 然后，创建布局参数。
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        // 接着，创建一个按钮。
        Button button = new Button(context);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Toast.makeText(getApplicationContext(), "click", Toast.LENGTH_SHORT).show();
            }
        });
        button.setText("请点击这个按钮");
        // 最后，将载入的内容放到屏幕中。
        manager.addView(button, params);
    }
}
```
    语句解释：
    -  添加到屏幕上的View对象，既可以是使用LayoutInflater来载入一个布局文件，也可以是通过代码来new出来的View对象。
    -  运行本范例时，我们就可以在屏幕的中央看到按钮了。

<br>　　程序运行后就会发现一个问题：

    -  除了按钮之外屏幕上的任何东西都没法点击了。
    -  这是因为，默认情况下，通过WindowManager添加到屏幕中的控件会拦截所有事件。

<br>　　我们可以通过给`WindowManager.LayoutParams`类的`flags`属性设置值来解决这个问题：
``` java
params.flags =
    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
```
    语句解释：
    -  FLAG_NOT_FOCUSABLE表示View不需要获取焦点，也不需要接收各种输入事件，此标记会同时启用FLAG_NOT_TOUCH_MODAL。
    -  FLAG_NOT_TOUCH_MODAL表示系统会将View区域以外的单击事件传递给底层控件，区域以内的单击事件则由View自己处理。
    -  FLAG_SHOW_WHEN_LOCKED可以让Window对象显示在锁屏界面上，这个Flag需要作用到Window对象上，具体用法请自行搜索。
    -  如果想为LayoutParams指定多个flag，则flag之间使用“|”间隔。

<br>　　解决了这个问题之后，又发现如果我们点击`Home`键，那么屏幕上的按钮就会随着`Activity`一起被切到后台。
　　如果想让按钮一直显示在屏幕上，而不随着`Activity`一起隐藏，那么可以这么写：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 将Activity的引用传递过去。
        addViewToScreen(getApplicationContext());
    }

    private void addViewToScreen(Context context) {
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        // 为type字段赋值。
        params.type = WindowManager.LayoutParams.TYPE_PHONE;
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        Button button = new Button(context);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                System.out.println("click");
                Toast.makeText(getApplicationContext(), "click", Toast.LENGTH_SHORT).show();
            }
        });
        button.setText("请点击这个按钮");
        manager.addView(button, params);
    }
}
```
    语句解释：
    -  本范例中主要修改了两处代码，这两处缺一不可：
       -  将传递给addTextViewToScreen()方法的Activity对象改为Application对象。
       -  将params.type属性赋值为TYPE_PHONE。常用取值为：
          -  TYPE_PHONE ：手机级别，即表示在所有应用程序之上，但在状态栏之下。
          -  TYPE_SYSTEM_ALERT ：系统窗口级别。比如：显示电量低时弹出的Alert对话框。
          -  TYPE_SYSTEM_OVERLAY ：系统窗口之上的级别，此级别的控件无法响应点击事件。
    -  创建浮动窗需要添加下面这个权限：
       -  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    -  如果你是小米手机则默认是无法在屏幕上添加View的，去应用程序设置里，把权限给打开即可。

<br>**优先级**
　　事实上`WindowManager`中可以放置很多个`View`（控件），控件之间有优先级之分，`优先级高的将被放到优先级低的上面`。若最高优先级控件的宽高是`“MATCH_PARENT”`，则其下面的控件都将被完全遮住，`若优先级相同则后加入的会被放到上面显示`。
<br>　　我们来看一下下面的代码：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone1");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone2");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY, "Overlay");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_SYSTEM_ALERT, " Alert ");
        addTextViewToScreen(getApplication(), WindowManager.LayoutParams.TYPE_PHONE, "Phone3");
    }
    static int offsetY;
    private void addTextViewToScreen(Context context, int type, String text){
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = 70;
        params.type = type;
        // 设置View在y轴上的坐标值，相应的也可以设置x值。
        params.y = offsetY;
        offsetY += 60;
        TextView textView = new TextView(context);
        textView.setText(text);
        manager.addView(textView, params);
    }
}
```

<br>　　程序的运行效果为：

<center>
![](/img/android/android_b09_01.png)
</center>

<br>　　从上图可以看出：

    -  Phone2与Phone1是同级别的，但是Phone2却在Phone1上面。
    -  Overlay的级别最高，所以它压在了Phone2上面。
    -  Alert的级别第二高，虽然是在Overlay之后添加的，但是它任然被放到了Overlay下面。
    -  Phone3被压在了Alert下面。

<br>**删除和更新**

<br>　　范例1：从屏幕中移除一个已经存在的控件。
``` java
windowManager.removeView(destView);
```

<br>　　范例2：更新屏幕中一个已经存在的控件。
``` java
// 让y轴坐标偏移100个像素
mParams.y += 100;
// 依据最近的mParams中的信息（x、y、width、height等）来重新设置view的显示效果。
mWindowManager.updateViewLayout(view, mParams);
```
    语句解释：
    -  这里所说的更新控件，其实就是更新控件的LayoutParams对象。
<br>
#### 百度安全卫士 ####
　　如果你基础不错的话，通过上面学的知识，就可以模仿`360的小火箭特效`了（具体请参考郭霖的博客），笔者仿写了一个百度安全卫士内存清理动画的`Demo`，程序运行效果如下：

<center>
![](http://img.blog.csdn.net/20150602150418233?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZ2l0aHViXzI4NTU0MTgz/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
</center>

　　从上图中可以看出，仿写的效果和正牌还是有一些差距的，但是通过这个`Demo`可以让大家更深刻的理解`WindowManager`类可以做哪些事情。

　　[点击下载源码](http://download.csdn.net/detail/github_28554183/8764099)

　　如果你没有`Android Studio`环境，那么可以去`AndroidTest\app\build\outputs\apk`目录找到`apk`直接安装运行。

<br>**本节参考阅读：**
- [Android桌面悬浮窗效果实现，仿360手机卫士悬浮窗效果](http://blog.csdn.net/guolin_blog/article/details/8689140)
- [Android桌面悬浮窗进阶，QQ手机管家小火箭效果实现](http://blog.csdn.net/guolin_blog/article/details/16919859)

## Hello World ##
　　为了对自定义控件有个整体的认识，接下来我们先来写一个`HelloWorld`，其中涉及到的知识后面会详细介绍。

<br>　　范例1：`MyView`。
``` java
// 所有自定义控件都必须继承View或View的子类。
public class MyView extends View {
    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }
    // 当通过XML标签来创建View对象时，调用此方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}
```
    语句解释：
    -  我们有两种方式来创建View对象：
       -  第一种，在代码中通过new关键字，直接实例化View对象。
       -  第二种，在XML中使用标签来创建View对象。
    -  这两种方式分别会导致上面两个构造方法的调用。

<br>　　然后，我们来重写`onDraw`方法，该方法继承自`View`类，当系统需要绘制某个`View`时，就会调用该`View`对象的`onDraw`方法执行绘制操作。

<br>　　范例2：`MyView`。
``` java
public class MyView extends View {

    // 当通过代码来创建View对象时（通过new关键字），调用此方法初始化View。
    public MyView(Context context) {
        super(context);
    }
    // 当通过XML标签来创建View对象时，调用此方法。
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 在当前控件上写一行文字。
        Paint p = new Paint();
        p.setTextSize(72);
        canvas.drawText("Hello World!!!", 0, 100, p);
    }
}
```
    语句解释：
    -  对于onDraw方法里的代码，暂且知道它们的作用即可，每行代码的具体含义后面会有详细的介绍。

<br>　　接着，在布局文件中使用我们自定义的控件：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.cutler.demo.common.view.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

</LinearLayout>
```
    语句解释：
    -  使用自定义控件时，控件的名称要包含包名。
    -  由于笔者将MyView放到了com.cutler.demo.common.view包中，所以才这么写。

<br>　　最后，程序的运行效果如下图所示：

<center>
![](/img/android/android_b08_05.png)
</center>

<br>　　提示：

    -  在Android中，View类占据了屏幕上一个“矩形区域”，并负责绘制和处理事件。
    -  从整体上来看，Activity内的所有View按照从上到下的顺序，排列成了一个“树型结构”，我们把这个树形结构称为“View树”、“视图树”。

## 生命周期方法 ##
　　在继承了`View`类且重写完构造方法后，接着你就可以根据自己的需要来重写`View`所提供的一些回调方法了。你不需要重写所有的方法，实际上你可以从仅重写`onDraw(android.graphics.Canvas)`方法开始，但是本节将会详细讲解`View`类的各个回调方法的调用时机。

　　首先，要知道的是，任何一个视图都不可能凭空突然出现在屏幕上，它们都是要经过非常科学的绘制流程后才能显示出来的。
　　然后，当`Activity`获取焦点的时候，它就需要绘制它的`View树`了。
　　接着，整个`View树`会从根节点开始，依次执行绘制。
　　最后，每个`View`对象从创建到结束的整个生命周期中，会经历多个阶段：创建、布局、绘制、事件处理、焦点等，每个阶段中都提供了一个或多个回调方法。

### 创建阶段 ###
　　在`View`的创建阶段中，框架会首先调用该`View`的构造方法进行对象的初始化，通常在你自定义的`View`类中会定义两个不同的构造器，并在其内部来调用父类的构造器。

　　在构造方法返回之后，系统会进行如下判断： 

    -  若当前控件继承自View类，则构造方法执行完毕后会接着调用它的onFinishInflate方法。
    -  若当前控件继承自ViewGroup或其子类，则将在当前控件的所有子View的onFinishInflate方法都调用完成后，才会调用它的onFinishInflate方法。

<br>　　`onFinishInflate`方法的一个比较常见的应用场景是：

    -  你自定义了一个ViewGroup，它支持在XML文件中使用，这就不可避免的在它的标签里包含其它子标签。
    -  如果你想在代码中获取到它的子标签的引用，那么就应该在这个方法里写，而不是在构造方法里。这是因为，当ViewGroup的此方法被调用时，意味着它所包含的所有子控件也都加载完了（但只是加载完毕，宽高什么的都没测量）。

<br>　　假设我们有如下的布局文件：
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.cutler.demo.common.view.MyViewGroup
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <com.cutler.demo.common.view.MyView
            android:id="@+id/myView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />

    </com.cutler.demo.common.view.MyViewGroup>

</LinearLayout>
```

<br>　　然后，`MyViewGroup`类的代码为：
``` java
public class MyViewGroup extends LinearLayout {

    private MyView myView;

    public MyViewGroup(Context context) {
        super(context);
    }

    public MyViewGroup(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        myView = (MyView) findViewById(R.id.myView);
    }

}
```
    语句解释：
    -  程序运行时，会按照下面的顺序调用：
       -  首先，调用MyViewGroup的构造方法。
       -  然后，调用MyView的构造方法。
       -  接着，调用MyView的onFinishInflate方法。
       -  最后，再调用MyViewGroup的onFinishInflate方法。

<br>　　注意：如果你的控件不是从`XML`中创建的（而是通过代码`new`出来的），那么不会导致`onFinishInflate`方法调用。

<br>　　创建阶段完成后，还有三个比较重要的阶段：`测量`、`布局`、`绘制`。

### 测量阶段 ###
　　测量（`measure`）指的是对View的尺寸进行测量，因为父控件只有知道了每个子View的尺寸之后，它才能正确的摆放子View（比如防止子View重叠等）。
　　因此在创建完View之后，系统首先要做的就是测量View的尺寸。

<br>　　前面已经分析过，当系统需要测量View时，会调用`DecorView`的`measure`方法，它内部的代码如下：
``` java
public final void measure(int widthMeasureSpec, int heightMeasureSpec) {

    // 省略若干代码...

    if (cacheIndex < 0 || sIgnoreMeasureCache) {
        // measure ourselves, this should set the measured dimension flag back
        onMeasure(widthMeasureSpec, heightMeasureSpec);
        mPrivateFlags3 &= ~PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
    }

    // 省略若干代码...
}
```
    语句解释：
    -  measure方法定义在View中，并且是final的，子类没法去重写它。
    -  简单的说在measure方法内，就做了三件事：
       -  首先，在测量之前执行一些预处理操作。
       -  然后，在上面第7行代码中调用了onMeasure方法，开始正式的测量工作。
       -  最后，对测量的结果进行收尾处理。
    -  由于一个View到底需要多少宽高只有它自己才知道，因此系统在View类中提供了onMeasure()方法供子类重写，你只需要在该方法内部执行测量操作即可，当然可以不重写它，因为View提供了默认的实现。

<br>　　在讲解如何重写`onMeasure()`方法进行测量之前，需要先介绍一下`MeasureSpec`类。

#### MeasureSpec ####
　　首先让`MyView`类重写`onMeasure`方法，但是在其内部会直接调用父类的实现：
``` java
public class MyView extends View {
    public MyView(Context context) {
        super(context);
    }

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        // 我们不做任何操作，只是输出参数的值。
        System.out.println(widthMeasureSpec + "," + heightMeasureSpec);
    }
}
```
    语句解释：
    -  从onMeasure方法的两个参数的名字来看，它们应该是表示宽度和高度，但是在程序运行时输出的值却是类似于：
       -  -2147482568,-2147481937
       -  1073742904,-2147481937
    -  这他妈根本看不懂啊，逗爹呢？ 

<br>　　其实`onMeasure`方法的两个参数虽然是`int`类型的，但是我们称它们为`MeasureSpec`：

    -  MeasureSpec是一个32位的int值，高2位代表SpecMode（测量模式），低30位代表SpecSize（测量尺寸）。
    -  MeasureSpec通过将SpecMode和SpecSize打包成一个int值来避免过多的对象内存分配。而且为了方便操作，MeasureSpec类提供了打包和解包的方法。
    -  SpecMode和SpecSize也使用int值表示。
　　总之一句话，“系统之所以使用int值，就是为了节省内存分配，这样只需要使用1个int值就能表示两个数据”。

<br>　　既然这两参数是混合值，那么在使用它们之前，首先得使用`MeasureSpec`类来拆分出`SpecMode`和`SpecSize`。

　　范例1：获取`mode`与`size`。
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);

    // 获取widthMeasureSpec中的mode值。
    int widthMode = MeasureSpec.getMode(widthMeasureSpec);
    // 获取widthMeasureSpec中的size值。
    int widthSize = MeasureSpec.getSize(widthMeasureSpec);
    int heightMode = MeasureSpec.getMode(heightMeasureSpec);
    int heightSize = MeasureSpec.getSize(heightMeasureSpec);
}
```

<br>　　其中`size`指的是尺寸，`mode`指的是模式，常见的模式有： 

    -  MeasureSpec.EXACTLY：精确尺寸。
       -  当控件的layout_width或layout_height指定为具体数值(如50dip)或FILL_PARENT时，mode的值会为EXACTLY。
       -  当mode是EXACTLY时，表示父视图希望子视图的大小应该是由size的值来决定的。
    -  MeasureSpec.AT_MOST：最大尺寸。
       -  当控件的layout_width或layout_height指定为WRAP_CONTENT时，mode的值会为AT_MOST。
       -  当mode是AT_MOST时，size给出了父控件允许的最大尺寸，此时控件尺寸只要不超过父控件允许的最大尺寸即可。
    -  MeasureSpec.UNSPECIFIED：未指定尺寸。
       -  这种情况比较少见，不太会用到，笔者也没搞清楚。

<br>　　从上面的描述可以看出来，`MeasureSpec`的值与`LayoutParams`有关系，下面就具体介绍。

#### LayoutParams ####
　　当系统需要测量控件尺寸时，会从DecorView开始，从上到下依次测量View树中的每一个控件。在测量时，每一个子View的`onMeasure`方法的参数，都是由其父View传递过来的。

    父View会综合自身的情况以及子控件的LayoutParams来计算出需要传递给子控件的MeasureSpec值。

<br>　　而且，DecorView和普通View的`MeasureSpec`的计算过程略有不同，我们分开来看。

<br>**DecorView**
　　对于DecorView来说，它的`MeasureSpec`值是在`ViewRootImpl`中的`measureHierarchy`方法中计算的，代码：
``` java
// desiredWindowWidth和desiredWindowHeight是屏幕的尺寸
childWidthMeasureSpec = getRootMeasureSpec(desiredWindowWidth, lp.width);
childHeightMeasureSpec = getRootMeasureSpec(desiredWindowHeight, lp.height);
performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
```
　　接着再看一下`getRootMeasureSpec`方法的代码：
``` java
private static int getRootMeasureSpec(int windowSize, int rootDimension) {
    int measureSpec;
    switch (rootDimension) {

    case ViewGroup.LayoutParams.MATCH_PARENT:
        // Window can't resize. Force root view to be windowSize.
        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.EXACTLY);
        break;
    case ViewGroup.LayoutParams.WRAP_CONTENT:
        // Window can resize. Set max size for root view.
        measureSpec = MeasureSpec.makeMeasureSpec(windowSize, MeasureSpec.AT_MOST);
        break;
    default:
        // Window wants to be an exact size. Force root view to be that size.
        measureSpec = MeasureSpec.makeMeasureSpec(rootDimension, MeasureSpec.EXACTLY);
        break;
    }
    return measureSpec;
}
```
    语句解释：
    -  静态方法MeasureSpec.makeMeasureSpec用来将两个普通的int值合成一个MeasureSpec值。
    -  上面的代码已经表示的很清楚了，ViewRootImpl会依据DecorView的LayoutParams的值以及窗口的尺寸来计算出DecorView的MeasureSpec。

<br>**普通View**
　　对于普通View来说，它的`measure`方法是由ViewGroup调用的，先来看一下ViewGroup的`measureChildWithMargins`方法：
``` java
protected void measureChildWithMargins(View child, int parentWidthMeasureSpec, int widthUsed,
        int parentHeightMeasureSpec, int heightUsed) {
    final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

    final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
            mPaddingLeft + mPaddingRight + lp.leftMargin + lp.rightMargin + widthUsed, lp.width);
    final int childHeightMeasureSpec = getChildMeasureSpec(parentHeightMeasureSpec,
            mPaddingTop + mPaddingBottom + lp.topMargin + lp.bottomMargin + heightUsed, lp.height);

    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
}

public static int getChildMeasureSpec(int spec, int padding, int childDimension) {
    int specMode = MeasureSpec.getMode(spec);
    int specSize = MeasureSpec.getSize(spec);

    int size = Math.max(0, specSize - padding);

    int resultSize = 0;
    int resultMode = 0;

    switch (specMode) {
    // Parent has imposed an exact size on us
    case MeasureSpec.EXACTLY:
        if (childDimension >= 0) {
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size. So be it.
            resultSize = size;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size. It can't be
            // bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        }
        break;

    // Parent has imposed a maximum size on us
    case MeasureSpec.AT_MOST:
        if (childDimension >= 0) {
            // Child wants a specific size... so be it
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size, but our size is not fixed.
            // Constrain child to not be bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size. It can't be
            // bigger than us.
            resultSize = size;
            resultMode = MeasureSpec.AT_MOST;
        }
        break;

    // Parent asked to see how big we want to be
    case MeasureSpec.UNSPECIFIED:
        if (childDimension >= 0) {
            // Child wants a specific size... let him have it
            resultSize = childDimension;
            resultMode = MeasureSpec.EXACTLY;
        } else if (childDimension == LayoutParams.MATCH_PARENT) {
            // Child wants to be our size... find out how big it should
            // be
            resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
            resultMode = MeasureSpec.UNSPECIFIED;
        } else if (childDimension == LayoutParams.WRAP_CONTENT) {
            // Child wants to determine its own size.... find out how
            // big it should be
            resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
            resultMode = MeasureSpec.UNSPECIFIED;
        }
        break;
    }
    return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
}
```
    语句解释：
    -  从代码中也可以容易看出来，子View的MeasureSpec值，是由其父容器的MeasureSpec和子View的LayoutParams来确定的。

<br>
#### 开始测量 ####
　　稍微总结一下，我们现在知道的知识有：

    -  第一，当需要测量View的时，系统会从DecorView开始自上向下的测量每一个View。
    -  第二，不论是DecorView还是普通的View，它们的MeasureSpec都是由它的上级传递过来的。
       -  对于DecorView来说，它的MeasureSpec是由屏幕的尺寸和它自身的LayoutParams决定的。
       -  对于普通View来说，它的MeasureSpec是由父View剩余空间和它自身的LayoutParams决定的。
          -  若父ViewGroup的layout_height值为100，子View的值为200，则最终传入到子View的高度就是200。
    -  第三，当系统需要测量某个View时，会调用View类的onMeasure方法。
    -  第四，MeasureSpec是一个复合的int值，在使用之前需要将它们拆解。

<br>　　需要说的是，普通View和ViewGroup的重写onMeasure方法时是有区别的：

    -  普通View只需要在onMeasure中测量自己的尺寸即可。
    -  ViewGroup除了完成自己的测量过程外，还需要遍历去调用其所有子View的measure方法，各个子View再递归去执行这个流程。

<br>**普通View的重写**
<br>　　范例1：重写`onMeasure`方法。
``` java
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
    语句解释：
    -  当系统调用onMeasure方法时，就是在要求View执行测量了。
    -  当View测量完毕时需要将测量结果给保存起来，但是由于Java方法只能返回一个值，没法同时将宽度和高度一起返回，所以系统给我们提供一个setMeasuredDimension方法，我们把测量的结果传递过去即可。
    -  在实际开发中，很少会像上面那样把MyView的尺寸写死在代码上，而是会依据widthMeasureSpec和heightMeasureSpec的值来动态的计算出MyView的尺寸。

<br>　　当然我们也可以不重写onMeasure方法，而是使用父类（View类）的实现：
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    setMeasuredDimension(getDefaultSize(getSuggestedMinimumWidth(), widthMeasureSpec),
            getDefaultSize(getSuggestedMinimumHeight(), heightMeasureSpec));
}
public static int getDefaultSize(int size, int measureSpec) {
    int result = size;
    int specMode = MeasureSpec.getMode(measureSpec);
    int specSize = MeasureSpec.getSize(measureSpec);

    switch (specMode) {
    case MeasureSpec.UNSPECIFIED:
        result = size;
        break;
    case MeasureSpec.AT_MOST:
    case MeasureSpec.EXACTLY:
        result = specSize;
        break;
    }
    return result;
}
```
<br>　　总结一下`onMeasure`方法：

    -  若没有重写onMeasure方法，则会按照View类的默认方式处理：
       -  通常情况下View对象的测量尺寸就是layout_width和layout_height所设置的值。
       -  在少数情况下，View对象的测量尺寸是getSuggestedMinimumWidth和getSuggestedMinimumHeight方法返回的。
    -  若重写了onMeasure方法，则View对象的测量尺寸就是你在onMeasure方法里测量的结果。
       -  但是onMeasure方法测出的宽度和高度不一定就是View最终的宽高。
       -  测量宽高会受到View对象父View的约束，若父控件最大允许的宽度为100px，但子View测量的宽度为200px，最终子控件只会显示前100px的宽度，超出的部分不会被显示，除非加上滚动条。

<br>　　注意，视图实际拥有两对宽度和高度的值：

    -  第一对被称作测量宽度和测量高度。
       - 这两个尺寸表示View在其父View中需要的大小，也就是我们在onMeasure方法里计算出来的宽高。
       - 当View对象的measure()返回时，就可以通过getMeasuredWidth()和getMeasuredHeight()方法来获得测量宽高。
    -  第二对被简单的称作宽度和高度，或绘制宽度和绘制高度。
       -  这两个尺寸表示View最终在屏幕上的实际大小，不过在少数情况下，绘制宽高可能与测量宽高不同。
       -  当View对象的onLayout()被调用时，就可以通过getWidth()方法和getHeight()方法来获取视图的宽高了。

<br>　　说了这么多，也许你还是不知道怎么重写onMeasure方法，没关系，后面会有实战范例，不要慌！

<br>**ViewGroup的重写**
　　事实上，`ViewGroup`类并没有重写`onMeasure`方法，而是交给它的子类来重写了。

　　下面是`LinearLayout`类的`onMeasure`方法：
``` java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    if (mOrientation == VERTICAL) {
        measureVertical(widthMeasureSpec, heightMeasureSpec);
    } else {
        measureHorizontal(widthMeasureSpec, heightMeasureSpec);
    }
}

void measureVertical(int widthMeasureSpec, int heightMeasureSpec) {

    // 此处省略若干行代码

    // 遍历测量每一个子View。
    for (int i = 0; i < count; ++i) {
        // 此处省略若干行代码
        measureChildBeforeLayout(
               child, i, widthMeasureSpec, 0, heightMeasureSpec,
               totalWeight == 0 ? mTotalLength : 0);
        // 此处省略若干行代码
    }

    // 此处省略若干行代码

    // 当所有子View都测量完毕后，再测量自己的尺寸。
    mTotalLength += mPaddingTop + mPaddingBottom;
    int heightSize = mTotalLength;
    heightSize = Math.max(heightSize, getSuggestedMinimumHeight());
    int heightSizeAndState = resolveSizeAndState(heightSize, heightMeasureSpec, 0);
    heightSize = heightSizeAndState & MEASURED_SIZE_MASK;
    
    // 此处省略若干行代码
    
    setMeasuredDimension(resolveSizeAndState(maxWidth, widthMeasureSpec, childState),
            heightSizeAndState);

    // 此处省略若干行代码
}

void measureChildBeforeLayout(View child, int childIndex,
        int widthMeasureSpec, int totalWidth, int heightMeasureSpec, int totalHeight) {
    measureChildWithMargins(child, widthMeasureSpec, totalWidth, heightMeasureSpec, totalHeight);
}

protected void measureChildWithMargins(View child,
        int parentWidthMeasureSpec, int widthUsed, int parentHeightMeasureSpec, int heightUsed) {
    final MarginLayoutParams lp = (MarginLayoutParams) child.getLayoutParams();

    // 调用getChildMeasureSpec方法，综合自身和当前子View的尺寸信息，计算出子View最终的测量尺寸。
    final int childWidthMeasureSpec = getChildMeasureSpec(parentWidthMeasureSpec,
            mPaddingLeft + mPaddingRight + lp.leftMargin + lp.rightMargin + widthUsed, lp.width);
    final int childHeightMeasureSpec = getChildMeasureSpec(parentHeightMeasureSpec,
            mPaddingTop + mPaddingBottom + lp.topMargin + lp.bottomMargin + heightUsed, lp.height);

    child.measure(childWidthMeasureSpec, childHeightMeasureSpec);
}
```

<br>　　提示：父视图可能在它的子视图上调用一次以上的`measure(int,int)`方法。

### 布局阶段 ###
　　当所有`View`都测量完毕后，就需要设置它们的位置了，这个过程同样是从`DecorView`开始，调用的方法为`layout()`。

<br>　　首先，我们来看下`View.java`中的`layout()`方法的源码：
``` java
public void layout(int l, int t, int r, int b) {
    if ((mPrivateFlags3 & PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT) != 0) {
        onMeasure(mOldWidthMeasureSpec, mOldHeightMeasureSpec);
        mPrivateFlags3 &= ~PFLAG3_MEASURE_NEEDED_BEFORE_LAYOUT;
    }

    int oldL = mLeft;
    int oldT = mTop;
    int oldB = mBottom;
    int oldR = mRight;

    // 调用setFrame或setOpticalFrame方法来修改当前View的位置。
    // 注意：这个位置是当前控件在父View内的相对位置，原点是父View的左上角。
    boolean changed = isLayoutModeOptical(mParent) ?
            setOpticalFrame(l, t, r, b) : setFrame(l, t, r, b);

    if (changed || (mPrivateFlags & PFLAG_LAYOUT_REQUIRED) == PFLAG_LAYOUT_REQUIRED) {
        // 如果上面修改成功了，或者用户强制要求更新，则回调onLayout()方法。
        onLayout(changed, l, t, r, b);
        mPrivateFlags &= ~PFLAG_LAYOUT_REQUIRED;

        ListenerInfo li = mListenerInfo;
        // 回调所有注册过的（如果有的话）listener的onLayoutChange()方法。
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
```
    语句解释：
    -  从第3行代码可以看出来，在View的layout阶段也有可能调用onMeasure方法。

<br>　　关于`onLayout()`方法：

    -  当需要确定当前View的所有子View的位置时，才会调用onLayout方法。
    -  对于普通的View类来说，由于它是没有子View的，因此View类的onLayout()只是一个空实现。
    -  对于ViewGroup类来说，在它内部onLayout方法被改为抽象方法了，所有ViewGroup的子类都必须重写它。

<br>　　接着我们来看下`ViewGroup.java`中的`layout()`和`onLayout()`方法的源码：
``` java
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
       -  若当前ViewGroup未添加LayoutTransition动画，或动画未运行，则调用super.layout(l,t,r,b)。
       -  否则将mLayoutCalledWhileSuppressed设置为true，等待动画完成时再调用requestLayout()。
    -  除此之外，还有两个地方需要注意：
       -  layout()方法增加了final关键字，这意味着它的所有子类无法重写layout()方法。
       -  onLayout()方法使用abstract关键字修饰了，这意味着它的所有子类必须重写此方法。


<br>　　我们来看下`LinearLayout`的`onLayout`方法：
``` java
//  参数 changed 表示当前ViewGroup的尺寸或者位置是否发生了改变。
//  也就是说ViewGroup的尺寸和位置没有发生变化时，此方法也有可能被调用。
protected void onLayout(boolean changed, int l, int t, int r, int b) {
    // 依据方向来调用不同的方法进行layout。
    if (mOrientation == VERTICAL) {
        layoutVertical(l, t, r, b);
    } else {
        layoutHorizontal(l, t, r, b);
    }
}

void layoutVertical(int left, int top, int right, int bottom) {    
    // 此处省略若干行代码
    int childTop;
    int childLeft;
    // 此处省略若干行代码
    for (int i = 0; i < count; i++) {
        final View child = getVirtualChildAt(i);
        if (child == null) {
            childTop += measureNullChild(i);
        } else if (child.getVisibility() != GONE) {
            // 获取到我们之前测量出来的尺寸。
            final int childWidth = child.getMeasuredWidth();
            final int childHeight = child.getMeasuredHeight();
            // 此处省略若干行代码
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
    -  从第23行代码可以看出，LinearLayout的子View最终的显示的宽和高，是由该子View的measure过程的结果来决定的。
    -  因此measure过程的意义就是为layout过程提供视图显示范围的参考值。

### 绘画阶段 ###
　　布局阶段执行完毕后，框架就会调用DecorView的`draw()`方法开始绘制`View树`。但是每次绘图时，并不会重新绘制整个`View树`中的所有`View`，而只会重新绘制那些`“需要重绘”`的`View`，`View`类内部变量包含了一个标志位`DRAWN`，当该视图需要重绘时，就会为该`View`添加该标志位。

<br>　　通过查看源码可以知道，View类的绘制流程由六步构成：

    -  第一，绘制当前View的背景。
    -  第二，如果有必要，则为稍后绘制渐变效果做一些准备操作(大多数情况下，不需要)。
    -  第三，调用onDraw()方法绘制视图本身。
       -  View类的onDraw()方法是空实现，ViewGroup类没有重写此方法。
    -  第四，调用dispatchDraw()方法绘制子视图。
       -  View类的dispatchDraw()方法是空实现，因为对于不包含子View的控件来说不需要重写此方法。
       -  ViewGroup类已经为我们重写了dispatchDraw()的功能实现，因此ViewGroup的子类一般不需要重写该方法。
    -  第五，如果第二步被执行了，那么第五步也会被执行。第五步用来绘制渐变效果以及绘制渐变效果之后的一些收尾工作。
    -  第六，绘制滚动条。
       -  在Android中不管是Button还是TextView，任何一个视图都是有滚动条的，只是一般情况下我们都没有让它显示出来而已。

<br>　　总而言之，每一个具体的`View`都应该重写`onDraw()`方法，并且不论是`View`还是`ViewGroup`的子类，一般不需要重写`dispatchDraw()`方法。

　　绘制的时候主要是借助`Canvas`这个类，它会作为参数传入到`onDraw()`方法中，供给每个视图使用。
　　`Canvas`这个类的用法非常丰富，基本可以把它当成一块画布，在上面绘制任意的东西，那么我们就来尝试一下吧。

<br>　　范例1：初步使用画笔和画布。
``` java
public class MyView extends View {
    private Paint mPaint;
    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onFinishInflate() {
        mPaint = new Paint();
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
    <com.cutler.demo.common.view.MyView
        android:layout_width="200dp"
        android:layout_height="100dp" />
</LinearLayout>
```
    语句解释：
    -  Paint表示一个画笔，Canvas表示一个画布。 
    -  另外，由于MyView类没有重写onMeasure方法，则系统使用默认的策略来计算它的测量尺寸，即使用XML中设置的尺寸。

<br>**View重绘**

　　虽然View会在`Activity`加载完成之后绘制到屏幕上，但是在程序的运行时View的状态是会改变的。当改变发生时，之前绘制出的内容其实就已经过期了，此时应该对视图进行重绘。

　　调用视图的`setVisibility()`、`setEnabled()`、`setSelected()`等方法时都会导致视图重绘，而如果我们想要手动地强制让视图进行重绘，可以调用`invalidate()`方法来实现。

    -  setVisibility、setEnabled、setSelected等方法的内部其实也是通过调用invalidate方法来实现的。
    -  这里的重绘是指谁请求invalidate方法，就重绘该视图(View的话只绘制该View，ViewGroup则绘制整个ViewGroup)。
　　`invalidate()`只可以在主线程中调用，如果你需要在子线程中重绘`View`，那么可以调用`postInvalidate()`方法。

<br>　　如果你需要`定时重绘`，那么你可以使用`postInvalidateDelayed(long delayMilliseconds)`方法，当倒计时结束后，该方法会有如下判断：

    -  若调用该方法的View依然显示在屏幕中，则该方法会在主线程中调用invalidate()方法执行重绘。
    -  若调用该方法的View已经不显示了，则这个重绘任务会被挂起，等到该View再次显示时，才会触发重绘。

　　比如，对于一个计时器`View`来说，每秒钟都需要重绘一次，如果通过开启`Thread`来定时调用`postInvalidate()`方法来实现计时的话，有两个缺点：

    -  第一，开启Thread类需要消耗一定资源，并需要处理内存泄漏的问题。
    -  第二，若计时器View当前不再屏幕中（比如用户把App切换到后台了），那么线程仍然在跑，View仍然是每秒钟都重绘一次，浪费大量资源。

<br>　　如果你不需要`定时重绘`，那么最好也去使用`postInvalidate()`方法，当`View`不再显示时，它同样不会立刻执行重绘操作，它的源码为：
``` java
public void postInvalidate() {
    postInvalidateDelayed(0);
}
```

### 其它常用方法 ###
#### 定位 ####
　　`View`的几何形状是`矩形`的，视图的`位置`使用`左上坐标系`表示，`尺寸`由`宽和高`表示，位置和尺寸以`像素`为单位。我们可以通过`getLeft()`和`getTop()`函数取得视图的位置：

    -  前者返回视图的左侧位置（横坐标X）。
    -  后者返回视图的顶部位置（纵坐标Y）。
　　这两个方法返回视图相对于其父视图的位置，例如`getLeft()`返回`20`，代表视图在其直接父视图左侧边的右侧`20`像素的位置。

　　另外，为了避免不必要的计算，提供了一些便利的方法，它们是`getRight()`和`getBottom()`。这些方法返回代表视图的矩形的右侧和底边的坐标。例如，调用`getRight()`比调用`getLeft() + getWidth()`要简单。


#### 跳过绘制 ####
　　`View`类有一个特殊的方法setWillNotDraw，先来看一下的它的源码：
``` java
/**
 * If this view doesn't do any drawing on its own, set this flag to
 * allow further optimizations. By default, this flag is not set on
 * View, but could be set on some View subclasses such as ViewGroup.
 *
 * Typically, if you override {@link #onDraw(android.graphics.Canvas)}
 * you should clear this flag.
 *
 * @param willNotDraw whether or not this View draw on its own
 */
public void setWillNotDraw(boolean willNotDraw) {
    setFlags(willNotDraw ? WILL_NOT_DRAW : 0, DRAW_MASK);
}
```
    语句解释：
    -  从注释可以看出来，如果一个View不需要绘制任何内容，那么设置这个标记位为true后，系统就会进行相应的优化。
    -  默认情况下，View没有启用这个优化标记位，但是ViewGroup会默认启用这个标记位。


#### 从窗口中添加和移除 ####
　　当View和其所在的Activity建立和断开连接时，系统会调用如下两个方法：

    -  Activity关闭或者View从Activity中移除时，View的onDetachedFromWindow方法会被调用。
       -  通常在此方法中关闭线程和停止动画，从而避免内存泄漏。
    -  View被添加到Activity中时，它的onAttachedToWindow方法会被调用。


#### 大小改变 ####
　　在`View`类中还有一个比较有用的方法是`onSizeChanged`，当`View`的尺寸改变时就会调用它。

    一般情况下，我们在自定义控件的时候会依据View的尺寸来确定绘制的大小，但是程序在运行的时候不可避免的因为一些外力而导致View的尺寸发生变化（比如横竖屏切换、输入法弹出等）。
　　因此通常的做法是重写`onSizeChanged`方法，并在其内部更新变量的值，并调用`invalidate`方法进行重绘。
<br>

<br>**本章参考阅读：**
- [Android LayoutInflater原理分析，带你一步步深入了解View(一)](http://blog.csdn.net/guolin_blog/article/details/12921889)
- [Android视图绘制流程完全解析，带你一步步深入了解View(二)](http://blog.csdn.net/guolin_blog/article/details/16330267)
- [Android视图状态及重绘流程分析，带你一步步深入了解View(三)](http://blog.csdn.net/guolin_blog/article/details/17045157)
- [Android自定义View的实现方法，带你一步步深入了解View(四)](http://blog.csdn.net/guolin_blog/article/details/17357967)
- [Android如何绘制视图，解释了为何onMeasure有时要调用多次](http://blog.csdn.net/jewleo/article/details/39547631)
- [How Android Draws Views](http://developer.android.com/guide/topics/ui/how-android-draws.html)
- [Android中layout过程详解](http://www.cnblogs.com/xilinch/archive/2012/10/24/2737248.html)


## 道理我都懂，到底要怎么干？##

　　至此我们已经对自定义控件有个大致的了解，不出意外的话，此时你应该还是不知道如何去写代码。

　　笔者认为，之所以我们会觉得自定义控件很难，主要是因为我们知道的相关API太少，只要我们尽可能多的学习相关API，那么自定义控件就不足为惧。

　　因此，本章的任务就是如下两个：

    -  第一，尽可能多的介绍自定义控件时所用的常见API，（本章的内容会不定时更新）。
    -  第二，将前两章的理论知识融合到实践中。
       -  理论结合实践是非常重要的，举个例子：我们都会用嘴发声，也会通过击打手臂发声，但是当我们看到芈月用嘴和手臂放屁时，还是会眼前一亮，原来还可以这么玩。
       -  也就是说，基础知识学会之后，还要再学习如何将它们组合在一起使用。
　　千言万语汇成一句话：想创新，先模仿！

　　在绘制`View`时会涉及到两个类：`Paint`和`Canvas`，这两个类分别代表`画笔`和`画布`。
　　我们需要调用`Canvas`对象所提供的方法进行绘制，其中`Canvas`对象由系统创建，在View的`onDraw()`方法被调用时，系统会同时将`Canvas`对象以形参的形式传递给该方法。

　　`Canvas`对象提供的绘制图形的方法都是以`draw`开头的，我们可以查看`API`：

<center>
![](/img/android/android_b08_03.jpg)
</center>

　　从上面方法的名字看来我们可以知道`Canvas`可以绘制的对象有：弧线(`arcs`)、填充颜色(`argb`和`color`)、 `Bitmap`、圆(`circle`和`oval`)、点(`point`)、线(`line`)、矩形(`Rect`)、图片(`Picture`)、圆角矩形 (`RoundRect`)、文本(`text`)、顶点(`Vertices`)、路径(`path`)。

　　通过组合这些对象我们可以画出一些简单有趣的界面出来，但是光有这些功能还是不够的，如果我们要画一个钟表呢？
　　幸好Android还提供了一些对`Canvas`位置转换的方法：`rorate`、`scale`、`translate`、`skew`等，而且它允许你通过获得它的矩阵对象（`getMatrix`方法，不知道什么是矩阵？以后会介绍）直接操作它。

　　为了方便执行转换操作，`Canvas`还提供了保存和回滚属性的方法(`save`和`restore`)，比如你可以先调用`save`方法保存目前画布的位置，然后旋转`90`度，向下移动`100`像素后画一些图形，画完后调用`restore`方法返回到刚才保存的位置。

### 绘制文本 ###
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

### 绘制图形 ###
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

### Path ###
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

### 画布 ###
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
    -  更多关于Btimap与Matrix类的介绍，请参看笔者的另一篇博文《媒体篇》。

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


### Xfermodes ###
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

### Shader ###
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

### SurfaceView概述 ###
　　`Android`提供了View进行绘制处理，View可以满足大部分的绘图需求，但是在某些时候却也显得有些力不从心。

　　系统通过发出`VSYNC`信号来进行屏幕View的重绘，刷新的间隔时间为`16ms`。如果在`16ms`内View完成了你指定的所有操作，那么用户在视觉上就不会产生卡顿的感觉，而如果执行的操作逻辑太多，特别是需要频繁刷新的界面上，例如游戏界面，那么就会不断的阻塞主线程，从而导致画面卡顿。很多时候，在自定义View的Log中经常会看见如下所示的警告：

    -  skipped 47 frames , application may doing too much work on its main thread

　　这些警告的产生，很多情况下就是由于在绘制过程中处理逻辑太多造成的。

　　Android提供了`SurfaceView`组件来解决这个问题，`SurfaceView`可以说是View的孪生兄弟，它俩之间的区别：

    -  View在主线程中对画面进行刷新，而SurfaceView通常会通过一个子线程来进行页面的刷新。
    -  View在绘图时没有使用双缓冲机制，而SurfaceView在底层实现机制中就已经支持了双缓冲机制。

　　因此，若你的View需要大量的刷新，或者刷新的时候数据处理量比较大，那么就可以考虑使用`SurfaceView`了。
<br>　　笔者暂时不打算去看`SurfaceView`的用法，有兴趣的读者可以自行去搜索。

### 控件的属性 ###
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

# 第五节 自定义控件 - 输入事件 #

　　本章将介绍一下`Android`中的各类输入事件。
　　本章主要参考书籍：[《Android开发艺术探索》](http://item.jd.com/1710650057.html)和[《Android群英传》](http://item.jd.com/11758334.html)，同时加上了笔者自己的体会。

## 基础知识 ##
　　我们先来介绍两个基础知识。

<br>**事件类型**
　　在`Android`中`View`类支持监听如下`五种`输入事件，我们可以通过设置监听器来监听事件：

    -  点击事件：当用户点击一个View（如Button）时，系统会产生点击事件，并传递给该View。
       -  调用View的setOnClickListener方法来监听此事件。
    -  长按事件：当用户长时间按住一个View时，系统会产生长按事件，并传递给该View。
       -  调用View的setOnLongClickListener方法来监听此事件。
    -  焦点改变事件：当用户使用导航键或滚迹球将输入焦点导入或导出某个View时，系统会产生焦点改变，并传递给该View。
       -  调用View的setOnFocusChangeListener方法来监听此事件。
    -  按键事件：当用户让输入焦点落到某个View上，并且按下或释放设备上的一个按键时，系统会产生按键事件，并传递给该View。
       -  调用View的setOnKeyListener方法来监听此事件。
    -  触摸事件：当用户手指触摸某个View时，系统会产生触摸事件，并传递给该View。
       -  调用View的setOnTouchListener方法来监听此事件。

<br>　　比如，下面代码展示了如何给一个`Button`注册一个`View.OnClickListener`监听器：
``` java
Button button = (Button) findViewById(R.id.button_send);
button.setOnClickListener(new View.OnClickListener() {
    public void onClick(View v) {
        // Do something in response to button click
    }
});
```
　　你可能也发现把`OnClickListener`作为Activity的一部分来实现会更方便。这样会避免类的加载和对象空间的分配。如：
``` java
public class ExampleActivity extends Activity implements OnClickListener {
    protected void onCreate(Bundle savedValues) {
        Button button = (Button)findViewById(R.id.corky);
        button.setOnClickListener(this);
    }
    public void onClick(View v) { }
}
```
<br>　　如果我们想监听系统内置控件的事件，那么只能使用上面这种调用`setXxx`设置监听器。但是，若控件是我们自己创建的，那就可以通过重写下面的方法来监听事件：
``` java
// 当一个键被按下时，会调用这个方法；
onKeyDown(int, KeyEvent)

// 当一个被按下的键弹起时，会调用这个方法；
onKeyUp(int, KeyEvent)

// 当轨迹球滚动时，会调用这个方法；
onTrackballEvent(MotionEvent)

// 当一个View对象获得或失去焦点时，会调用这个方法。
onFoucusChanged(Boolean, int, Rect)

// 触摸事件
onTouchEvent(MotionEvent event) 
```

<br>　　上面列出的五种事件中，相对来说`触摸事件稍显复杂`，本章会重点介绍触摸事件。
<br>　　**触摸模式**
　　对于一个有触摸能力的设备，一旦用户触摸屏幕，这个设备就会进入`触摸模式(touch mode)`。
　　任何时刻，只要用户点击了一个`方向键`（比如Android电视的遥控器）或滚动了`鼠标滚轮`，设备就会退出触摸模式，同时系统会查找一个需要焦点的View对象，并给予其焦点（高亮显示）。
　　触摸模式状态是被整个系统管理的，我们可以调用`View#isInTouchMode()`来查看设备当前是否是触摸模式。

## 触摸事件 ##
　　触摸事件在开发中是最常见的，也是最容易让人搞混的，因此从本节开始将详细介绍触摸事件。
### 滑动位置 ###
　　在开发中，比较常见的一个需求：让View能随着用户的手指而拖动，要实现这个功能就需要监听View的触摸事件。

　　示例代码：
``` java
Button button = (Button) this.findViewById(R.id.img);
button.setOnTouchListener(new View.OnTouchListener() {
    public boolean onTouch(View v, MotionEvent event) {
        return false;
    }
});
```
<br>　　为了了解`onTouch`方法，我们先来看看`View.OnTouchListener`接口：
``` java
//  描述：当View被用户“触摸”时，会调用此回调方法。
//  参数：
//       v：     被触摸的组件。
//       event： 表示一个触摸事件，其内封装了与“触摸事件”有关的数据。如：用户手指在屏幕的X、Y坐标等。
//  返回值：用于告知Android系统，当前事件是否被成功处理。
public abstract boolean onTouch(View v, MotionEvent event)
```
　　其中`MotionEvent`类用来表示`“触摸事件”`，触摸事件有如下三个常见的状态：

    -  ACTION_DOWN：表示手指按在了View上。
    -  ACTION_MOVE：表示手指按下后(此时手指没有抬起)，接着在View上拖动手指。
    -  ACTION_UP：表示手指从View上抬起。

　　正常情况下，一次手指触摸屏幕的行为会触发一系列的触摸事件，最常见的是如下两种情况：

    -  点击屏幕后立刻松开，事件序列为：ACTION_DOWN -> ACTION_UP。
    -  点击屏幕后滑动一会再松开，事件序列为：ACTION_DOWN -> ACTION_MOVE -> …… -> ACTION_MOVE -> ACTION_UP。

　　在继续向下进行之前，先介绍一个名词：“事件序列”。
<br>　　**事件序列**
　　同一个事件序列是指从手指接触屏幕的那一刻起，到手指离开屏幕的那一刻结束，在这个过程中所产生的一系列事件。通常这个事件序列以`ACTION_DOWN`事件开始，中间含有数量不定的`ACTION_MOVE`事件，最终以`ACTION_UP`事件结束。

<br>　　范例1：MotionEvent类的常用方法：
``` java
//  描述：获取当前产生的事件的类型，常见的取值有：ACTION_DOWN、ACTION_MOVE、ACTION_UP。
public final int getAction();

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于该View的左上角坐标的偏移量。 
public final float getX();
public final float getY();

//  当在View产生了MotionEvent事件时，这两个方法可以获取用户手指相对于屏幕左上角坐标的偏移量。
//  屏幕左上角就是状态栏的左上角的那个点。 
public final float getRawX();
public final float getRawY();
```

<br>　　最后，下面给出一个完整的范例，如果你感觉看不懂，那就请去阅读其它人的教程，学会了触摸事件后，再回来继续。

<br>　　范例2：通过`getX()`和`getY()`移动按钮。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final Button button = (Button) findViewById(R.id.btn);
        button.setOnTouchListener(new View.OnTouchListener() {
            private int lastX, lastY;

            public boolean onTouch(View v, MotionEvent event) {
                int x = (int) event.getX();  // 获取手指在Button上的位置。
                int y = (int) event.getY();
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        lastX = x;           // 保存手指按下时的位置。
                        lastY = y;
                        break;
                    case MotionEvent.ACTION_MOVE:
                        int offsetX = x - lastX;
                        int offsetY = y - lastY;
                        // 调用layout方法更新View的位置。
                        button.layout(button.getLeft() + offsetX, button.getTop() + offsetY,
                                button.getRight() + offsetX, button.getBottom() + offsetY);
                        break;
                }
                return false;
            }
        });
    }
}
```
    语句解释：
    -  通过本范例看出，我们可以手工调用View的layout方法来更新位置，在其内部会调用invalidate进行重绘。
    -  需要注意的是本范例中，只有当手指按下的时候才会保存位置，手指移动时并不会。

<br>　　范例3：通过`getRawX()`和`getRawY()`移动按钮。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final Button button = (Button) findViewById(R.id.btn);
        button.setOnTouchListener(new View.OnTouchListener() {
            private int lastX, lastY;

            public boolean onTouch(View v, MotionEvent event) {
                int x = (int) event.getRawX();  // 获取手指在屏幕上的位置。
                int y = (int) event.getRawY();
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        lastX = x;
                        lastY = y;
                        break;
                    case MotionEvent.ACTION_MOVE:
                        int offsetX = x - lastX;
                        int offsetY = y - lastY;
                        button.layout(button.getLeft() + offsetX, button.getTop() + offsetY,
                                button.getRight() + offsetX, button.getBottom() + offsetY);
                        // 此处需要保存x、y的值。
                        lastX = x;
                        lastY = y;
                        break;
                }
                return false;
            }
        });
    }
}
```
    语句解释：
    -  再次强调本范例与范例2的区别，本范例中在手指移动的时候需要保存位置，具体原因请自己思考。
    -  提示：                要啥提示？动动脑子吧。

<br>　　也可以通过修改View的`LayoutParams`来改变View的位置，只需要把`范例3`的第`22`行代码替换为：
``` java
LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) button.getLayoutParams();
params.leftMargin += offsetX;
params.topMargin += offsetY;
button.setLayoutParams(params);
```
<br>
### 滑动内容 ###
　　在Android中，对于一个View来说它有两种类型滑动：

    -  第一种，View本身的位置发生变化（即上面一节介绍的知识）。
    -  第二种，View的内容发生变化。
       -  比如当LinearLayout的子元素的尺寸超过了LinearLayout的尺寸，那么超出的部分默认是无法显示的。
       -  不过Android中所有的View的内容都是可以滑动的，也就是说可以通过滑动LinearLayout的内容，来让被隐藏的部分显示出来。

　　本节就是来介绍如何滑动View的内容。

<br>**使用scrollTo和scrollBy方法**
　　为了实现`View`内容的滑动，`View`类提供了专门的方法来实现这个功能，那就是`scrollTo`和`scrollBy`，它们的源码为：
``` java
   /**
     * Set the scrolled position of your view. This will cause a call to
     * {@link #onScrollChanged(int, int, int, int)} and the view will be
     * invalidated.
     * @param x the x position to scroll to
     * @param y the y position to scroll to
     */
    public void scrollTo(int x, int y) {
        if (mScrollX != x || mScrollY != y) {
            int oldX = mScrollX;
            int oldY = mScrollY;
            mScrollX = x;
            mScrollY = y;
            invalidateParentCaches();
            onScrollChanged(mScrollX, mScrollY, oldX, oldY);
            if (!awakenScrollBars()) {
                postInvalidateOnAnimation();
            }
        }
    }

    /**
     * Move the scrolled position of your view. This will cause a call to
     * {@link #onScrollChanged(int, int, int, int)} and the view will be
     * invalidated.
     * @param x the amount of pixels to scroll by horizontally
     * @param y the amount of pixels to scroll by vertically
     */
    public void scrollBy(int x, int y) {
        scrollTo(mScrollX + x, mScrollY + y);
    }
```
　　可以看出来，其中`scrollBy`转调用了`scrollTo`方法，它实现了基于当前位置的相对滑动，而`scrollTo`则实现了基于所传递参数的绝对滑动。

<br>　　使用范例，如下所示：
``` java
public class MyView extends View {

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 每次点击时，都使当前View的内容，在x轴方向滑动30像素。
        setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                scrollBy(30, 0);
            }
        });
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        StringBuilder sub = new StringBuilder();
        sub.append("11111111111111111111111111111111");
        sub.append("22222222222222222222222222222222");
        sub.append("33333333333333333333333333333333");
        sub.append("44444444444444444444444444444444");
        sub.append("55555555555555555555555555555555");
        canvas.drawText(sub.toString(), 0, 100, paint);
    }
}
```
    语句解释：
    -  有两点需要注意：
       -  第一，scrollBy和scrollTo滑动的是View的内容，而不是View本身的位置。
       -  第二，scrollBy和scrollTo滑动是瞬间完成的，没有滚动时的滑翔效果。
    -  调用View类的getScrollX()和getScrollY()方法可以获取View的滚动条的当前位置。

<br>**Scroller**
　　使用`scrollBy`和`scrollTo`的滑动是瞬间完成的，效果比较生硬，为了给用户流畅的体验，可以把一次大的滑动分成若干个小的滑动，并在若干时间内完成。
　　我们通过`Scroller`类就可以实现动画滑动的任务。

<br>　　修改后的范例，如下所示：
``` java
public class MyView extends View {

    public MyView(Context context) {
        super(context);
        setBackgroundColor(Color.BLACK);
        setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                // 第一步，先为Scroller对象设置滚动参数。
                //        参数依次为：滚动条当前X轴位置、Y轴位置、X轴位移长度、Y轴位移长度、多少毫秒内完成滚动。
                mScroller.startScroll(getScrollX(), getScrollY(), 30, 0, 1000);
                // 第二步，设置完参数后，调用invalidate方法，触发View的重绘。
                invalidate();
            }
        });
    }

    private Scroller mScroller = new Scroller(getContext());

    // 当View被重绘时，系统会回调View类的此方法，计算滚动条的当前位置。
    @Override
    public void computeScroll() {
        // 方法computeScrollOffset会依据时间的流逝，来计算Scroller当前所处的位置。
        if (mScroller.computeScrollOffset()) {
            // 让当前View的滚动条，滚动到Scroller对象当前的位置。
            scrollTo(mScroller.getCurrX(), mScroller.getCurrY());
            // 再次出发重绘，直到Scroller对象滚动到终点（即computeScrollOffset返回false）才停止。
            // 这样一来，就实现了动画滚动的效果了。
            postInvalidate();
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Paint paint = new Paint();
        paint.setColor(Color.WHITE);
        StringBuilder sub = new StringBuilder();
        sub.append("11111111111111111111111111111111");
        sub.append("22222222222222222222222222222222");
        sub.append("33333333333333333333333333333333");
        sub.append("44444444444444444444444444444444");
        sub.append("55555555555555555555555555555555");
        canvas.drawText(sub.toString(), 0, 100, paint);
    }
}
```
    语句解释：
    -  Scroller的startScroll方法里面什么都没有做，只是记录了一下传递过来的参数。
    -  Scroller对象只是用来协助计算滚动条的位置的，它本身无法使View的内容滚动，它需要和View类的computeScroll、scrollTo、scrollBy方法配合使用。

<br>　　另外，`Android3.0`中提出的属性动画也可以完成`Scroller`的功能，具体请参阅[《媒体篇》](http://cutler.github.io/android-D03/)。

### 高级用法 ###
<br>**TouchSlop**
　　`TouchSlop`是系统所能识别出的被认为是滑动的最小距离。换句话说，当手指在屏幕上滑动时，如果两次滑动之间的距离小于这个值，那么系统就不认为它是滑动。

　　通过下面的代码可以获取这个值，返回值的单位是`px`：
``` java
ViewConfiguration.get(getApplicationContext()).getScaledTouchSlop()
```
　　我们在处理滑动时，可以利用它来做一些过滤，即滑动距离小于这个值时就不认为是滑动，这样可以有更好的用户体验。

<br>**VelocityTracker**
　　速度追踪器（`VelocityTracker`）用于追踪手指在屏幕上的滑动速度，它的使用方法很简单：
　
``` java
// ******* 第一步，获取一个VelocityTracker对象：
VelocityTracker mTracker = VelocityTracker.obtain();

// ******* 第二步，在onTouchEvent方法中添加如下代码，记录每一个触摸事件：
mTracker.addMovement(event);

// ******* 第三步，在ACTION_UP事件发生时，使用如下执行计算操作。
// 以当前mTracker对象中收集的所有MotionEvent对象为基础，计算出手指1秒所能滑动的像素数量，并将它们保存起来。
mTracker.computeCurrentVelocity(1000); 

// ******* 第四步，获取上面计算出的速度：
mTracker.getXVelocity();  // 水平方向。
mTracker.getYVelocity();  // 垂直方向。

// ******* 第五步，释放资源：
mTracker.recycle();
mTracker = null;
```
<br>　　完整的范例，如下所示：
``` java
public class MyView extends View {

    private VelocityTracker mTracker;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (mTracker == null) {
            mTracker = VelocityTracker.obtain();
        }
        mTracker.addMovement(event);
        switch (event.getAction()) {
            case MotionEvent.ACTION_UP:
                mTracker.computeCurrentVelocity(1000);
                String message = "不算滑动";
                if (Math.abs(mTracker.getXVelocity()) >= 50) {
                    message = (mTracker.getXVelocity() > 0 ? "从左到右滑动" : "从右到左滑动");
                }
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                mTracker.recycle();
                mTracker = null;
                break;
        }
        return true;
    }
}

```
    语句解释：
    -  本范例只是演示VelocityTracker的使用方法，更实用的案例后面会介绍。

<br>**GestureDetector**
　　通过重写`onTouchEvent`方法来实现一些复杂的手势（比如双击、长按等）会很麻烦。
　　幸运的是，`Android SDK`给我们提供了一个手势识别的类——`GestureDetector`，通过这个类我们可以识别很多的手势。

　　它的使用方法也很简单，直接看代码吧：
``` java
public class MyView extends View {

    private GestureDetector mGestureDetector;

    private GestureDetector.OnGestureListener onGestureListener = 
                new GestureDetector.SimpleOnGestureListener() {
        public void onLongPress(MotionEvent e) {
            // 当手指长按时回调此方法。
        }
    };

    private GestureDetector.OnDoubleTapListener onDoubleTapListener = 
                new GestureDetector.SimpleOnGestureListener() {
        public boolean onSingleTapConfirmed(MotionEvent e) {
            // 当单击时回调此方法。
            // 与onSingleTapUp的区别在于，如果触发了onSingleTapConfirmed，那么后面不可能再紧跟着另一个单击行为。
            // 也就是说，这只可能是单击行为，而不可能是双击中的一次单击。
            return false;
        }
        public boolean onDoubleTap(MotionEvent e) {
            // 当双击时回调此方法。
            return false;
        }
    };

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 创建GestureDetector对象。
        mGestureDetector = new GestureDetector(getContext(), onGestureListener);
        // 设置双击事件监听器。
        mGestureDetector.setOnDoubleTapListener(onDoubleTapListener);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        // 将当前View的触摸事件托管给GestureDetector处理。
        mGestureDetector.onTouchEvent(event);
        return true;
    }
}
```
    语句解释：
    -  SimpleOnGestureListener和SimpleOnGestureListener类里还有其它方法，请自行查看。
    -  需要说明的是，若你需要监听双击事件的话就用GestureDetector吧，否则还是自己处理触摸事件比较好。

<br>**本节参考阅读：**
- [Android UI 学习 自定义的布局 平滑移动 VelocityTracker（）](http://www.cnblogs.com/dyllove98/archive/2013/06/20/3146813.html)



## 事件分发机制 ##
　　本节将以触摸事件为范例，从源码的角度进行分析，详细说明事件的分发机制。

### Activity的事件分发 ###
　　前面我们已经分析过了，当一个事件产生时，它的传递过程，现在我们在它基础上再次扩展一下，最终的顺序为：

    WMS -> ViewRootImpl -> DecorView -> Activity -> Window -> DecorView

　　即当事件传递给`Activity`后，`Activity`会转交给`Window`，`Window`再传递给`DecorView`。

<br>　　在Activity类中定义了如下几个方法，当对应的事件发生时，系统会调用它们：
``` java
// 当触摸事件发生时，系统回调此方法。
public boolean dispatchTouchEvent(MotionEvent ev);

// 当按键事件发生时，系统回调此方法。
public boolean dispatchKeyEvent(KeyEvent event);

// 当轨迹球事件发生时，系统回调此方法。
public boolean dispatchTrackballEvent(MotionEvent ev);
```

<br>　　既然是以触摸事件为范例，那么我们就从Activity的`dispatchTouchEvent`方法开始分析：
``` java
public boolean dispatchTouchEvent(MotionEvent ev) {
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        onUserInteraction();
    }
    if (getWindow().superDispatchTouchEvent(ev)) {
        return true;
    }
    return onTouchEvent(ev);
}
```
　　从代码中可以看到，事件会被交给Activity的`Window`对象的方法`superDispatchTouchEvent`方法进行分发处理：

    -  若该方法返回true则说明事件被某个控件处理了，那么Activity就认为这个事件已经结束了，直接返回即可。
    -  若该方法返回false则说明事件没人处理，那么Activity就是把事件交给它的onTouchEvent方法去处理。
　　提示：你可以通过重写`Activity`的`dispatchTouchEvent`方法且不调用`“super.dispatchTouchEvent()”`来拦截所有的触摸事件。

<br>　　上一章我们说了，`Window`类的唯一子类就是`PhoneWindow`类，因此我们接着看它的`superDispatchTouchEvent`方法：
``` java
public boolean superDispatchKeyEvent(KeyEvent event) {
    return mDecor.superDispatchKeyEvent(event);
}
```
　　发现它只是转调用了`DecorView`类的方法，继续深入：
``` java
public boolean superDispatchTouchEvent(MotionEvent event) {
    // 只是简单的调用了父类的实现。
    return super.dispatchTouchEvent(event);
}
```
　　由于`DecorView`继承自`FrameLayout`，此时事件就由Activity传到`View`手中了。

### ViewGroup的事件分发 ###
　　当事件传递到`DecorView`手中时，一切才刚刚开始而已，后面还有很多步骤要执行。
　　接着上面的分析，由于在`DecorView`和`FrameLayout`类中都没有`dispatchTouchEvent`方法的定义，所以我们只能继续去上级父类中找，最终在`ViewGroup`类中找到了该方法。
　　不过由于该方法太长，所以为了看的清晰，我们下面将会分段来分析。

#### 拦截事件 ####
　　我们知道每个`MotionEvent`都有一个坐标点，当触摸事件传递到`ViewGroup`手中时，默认情况下`ViewGroup`会遍历它的所有子`View`，若该坐标点正好处于某个子`View`的范围内，则就将触摸事件转发给这个子`View`去处理。
　　不过，这个默认行为是可以改变，即`ViewGroup`可以将事件拦截下来留给自己处理，而不把事件传递给子`View`。

　　首先我们来看一下`dispatchTouchEvent`方法的这段：
``` java
// Check for interception.
final boolean intercepted;
if (actionMasked == MotionEvent.ACTION_DOWN
        || mFirstTouchTarget != null) {
    final boolean disallowIntercept = (mGroupFlags & FLAG_DISALLOW_INTERCEPT) != 0;
    if (!disallowIntercept) {
        intercepted = onInterceptTouchEvent(ev);
        ev.setAction(action); // restore action in case it was changed
    } else {
        intercepted = false;
    }
} else {
    // There are no touch targets and this action is not an initial down
    // so this view group continues to intercept touches.
    intercepted = true;
}
```

　　上面的代码就是ViewGroup用来判断是否需要拦截触摸事件的，可以看出`ViewGroup`在如下两种情况时会判断是否拦截当前事件：
``` java
actionMasked == MotionEvent.ACTION_DOWN || mFirstTouchTarget != null
```

　　前者很好理解，但`mFirstTouchTarget`是什么呢？
　　其实等我们看到后面的代码时就会知道，当`ACTION_DOWN`事件由ViewGroup的某个子元素成功处理时，`mFirstTouchTarget`就会被赋值并指向那个子元素。

　　当上述的两个条件满足其一时，并且第`5`行代码也返回`false`时，就会调用ViewGroup类的`onInterceptTouchEvent`方法：

    -  ViewGroup的子类可以重写onInterceptTouchEvent方法，用来决定当前ViewGroup是否拦截本次触摸事件：
       -  若重写方法时返回true，则本次的触摸事件将由当前ViewGroup处理，不会再传递给子View了。
       -  若重写方法时返回false，则表示本次的触摸事件当前ViewGroup将不拦截，事件的传递机制一切照旧。
    -  当需要处理滑动冲突时，就可以重写此方法，并依据实际情况返回不同的值，该方法默认返回false。

　　上面第`5`行代码用来获取当前ViewGroup是否开启了`“禁止拦截事件”`的功能，若开启了，则ViewGroup就无法拦截事件了，可以使用`requestDisallowInterceptTouchEvent`方法可以修改这个状态。

<br>　　总结一下这段代码的价值：

    -  onInterceptTouchEvent方法在ViewGroup中定义，用来决定ViewGroup是否拦截事件。
    -  onInterceptTouchEvent方法不是每次都调用，如果想提前处理事件，应重写dispatchTouchEvent方法。
    -  requestDisallowInterceptTouchEvent方法在ViewGroup中定义，能禁止ViewGroup拦截事件。

<br>
#### 分发事件 ####
　　上面的代码用来确定ViewGroup是否需要拦截事件，接下来就分别看一下这两种情况。

　　当ViewGroup不拦截事件的时候，事件会向下分发交给它的子View进行处理，这段源代码如下所示：
``` java
final View[] children = mChildren;
for (int i = childrenCount - 1; i >= 0; i--) {
    final int childIndex = customOrder
            ? getChildDrawingOrder(childrenCount, i) : i;
    final View child = (preorderedList == null)
            ? children[childIndex] : preorderedList.get(childIndex);

    // If there is a view that has accessibility focus we want it
    // to get the event first and if not handled we will perform a
    // normal dispatch. We may do a double iteration but this is
    // safer given the timeframe.
    if (childWithAccessibilityFocus != null) {
        if (childWithAccessibilityFocus != child) {
            continue;
        }
        childWithAccessibilityFocus = null;
        i = childrenCount - 1;
    }

    if (!canViewReceivePointerEvents(child)
            || !isTransformedTouchPointInView(x, y, child, null)) {
        ev.setTargetAccessibilityFocus(false);
        continue;
    }

    newTouchTarget = getTouchTarget(child);
    if (newTouchTarget != null) {
        // Child is already receiving touch within its bounds.
        // Give it the new pointer in addition to the ones it is handling.
        newTouchTarget.pointerIdBits |= idBitsToAssign;
        break;
    }

    resetCancelNextUpFlag(child);
    if (dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)) {
        // Child wants to receive touch within its bounds.
        mLastTouchDownTime = ev.getDownTime();
        if (preorderedList != null) {
            // childIndex points into presorted list, find original index
            for (int j = 0; j < childrenCount; j++) {
                if (children[childIndex] == mChildren[j]) {
                    mLastTouchDownIndex = j;
                    break;
                }
            }
        } else {
            mLastTouchDownIndex = childIndex;
        }
        mLastTouchDownX = ev.getX();
        mLastTouchDownY = ev.getY();
        newTouchTarget = addTouchTarget(child, idBitsToAssign);
        alreadyDispatchedToNewTouchTarget = true;
        break;
    }

    // The accessibility focus didn't handle the event, so clear
    // the flag and do a normal dispatch to all children.
    ev.setTargetAccessibilityFocus(false);
}
```
　　上面这段代码逻辑也很清晰，首先遍历ViewGroup的所有子元素，然后判断子元素是否能够接收这个事件，判断的依据有两个：

    -  !canViewReceivePointerEvents(child)：子元素是否在执行动画。
    -  !isTransformedTouchPointInView(x, y, child, null)：事件的坐标是否落在了子元素的区域内。

　　如果某个元素满足这两个条件，那么就会接着调用`dispatchTransformedTouchEvent`方法将触摸事件传递该元素。

　　接着查看`dispatchTransformedTouchEvent`的源码，发现该方法中出现多次类似的`if`判断：
``` java
if (child == null) {
    // 此时ViewGroup会调用继承自View类的方法，来自己处理事件。
    handled = super.dispatchTouchEvent(event);
} else {
    // 由子View去处理事件。
    handled = child.dispatchTouchEvent(event);
}
```
　　可以看到不管`child`是否为`null`，这段代码最终都会调用`dispatchTouchEvent`方法来处理事件。

　　那么`child`是什么呢，它又何时为`null`呢？
　　`child`就是用来处理本次触摸事件的控件，当ViewGroup拦截了事件时，也会调用`dispatchTransformedTouchEvent`方法处理事件，只不过`child`的值会传递为`null`。源码如下：
``` java
handled = dispatchTransformedTouchEvent(ev, canceled, null, TouchTarget.ALL_POINTER_IDS);
```
　　到此我们就清楚了：

    -  若ViewGroup没有拦截事件，则会继续将事件分发给子View处理：
       -  若某个子View能处理这个事件，则会调用该子View的dispatchTouchEvent方法进行处理。
       -  若for循环结束后，没有任何一个子View能处理这个事件，则ViewGroup会自己进行处理。
    -  若ViewGroup拦截了事件，则它也会自己处理这个事件。
    -  当需要ViewGroup自己来处理事件时，ViewGroup会调用继承自View类的dispatchTouchEvent方法来处理。

<br>　　还有一点要知道，当子View的`dispatchTouchEvent`方法返回`true`时，意味着这个事件被处理了，上面的第`51`行代码就会被执行，然后跳出for循环：
``` java
newTouchTarget = addTouchTarget(child, idBitsToAssign);
```
　　其实`mFirstTouchTarget`真正的赋值过程是在`addTouchTarget`内完成的：
``` java
private TouchTarget addTouchTarget(View child, int pointerIdBits) {
    TouchTarget target = TouchTarget.obtain(child, pointerIdBits);
    target.next = mFirstTouchTarget;
    mFirstTouchTarget = target;
    return target;
}
```
　　相应的，`ACTION_DOWN`之后的事件都会直接传递给`mFirstTouchTarget`处理，因为`for`循环寻找能处理事件的子View的过程只在`ACTION_DOWN`时才会触发。

　　至此我们就得出了一个结论了，不论事件最终是由`ViewGroup`类处理，还是由某个子`View`处理，程序最终都会调用`View`类的`dispatchTouchEvent`方法，接下来我们就来看一下这个方法。
### View的事件分发 ###
　　View对点击事件的处理过程稍微简单一些，因为它没有子元素不需要向下传递事件，所以它需要处理自己的事件。

　　先看它的`dispatchTouchEvent`方法，如下所示：
``` java
public boolean dispatchTouchEvent(MotionEvent event) {
    // 此处省略若干代码...

    boolean result = false;

    // 此处省略若干代码...

    if (onFilterTouchEventForSecurity(event)) {
        //noinspection SimplifiableIfStatement
        ListenerInfo li = mListenerInfo;
        if (li != null && li.mOnTouchListener != null
                && (mViewFlags & ENABLED_MASK) == ENABLED
                && li.mOnTouchListener.onTouch(this, event)) {
            result = true;
        }

        if (!result && onTouchEvent(event)) {
            result = true;
        }
    }

    // 此处省略若干代码...

    return result;
}
```
　　上面代码很简单，分两种方式处理触摸事件：

    -  第一种，若当前View处于可用状态，且设置了OnTouchListener，则调用监听器的onTouch方法处理事件。
    -  第二种，若第一种方式未能成功处理事件，则调用自己的onTouchEvent方法来处理。
       -  让OnTouchListener优先于onTouchEvent的好处是，方便在外界处理触摸事件。

<br>　　OnTouchListener的应用场景：

    我们使用ScrollView来包含一些控件，同时要求程序可以动态的控制ScrollView是否能滚动。即：
    -  在手机横屏的时候，允许它滑动。
    -  在手机竖屏的时候，不许它滑动。
　　示例代码：
``` java
// 此处设置的OnTouchListener会优先于ScrollView本身的onTouchEvent方法执行。
mScrollView.setOnTouchListener(new View.OnTouchListener(){
    public boolean onTouch(View v, MotionEvent event) {
        // 若当前是竖屏状态，则直接返回true，即不需要在执行ScrollView的onTouchEvent方法了。
        // ScrollView执行滑动的代码是写在onTouchEvent方法中的，该方法不被调用的话，也就没法滑动了。
        return isShuPing ? true : false;
    }
});
```

<br>　　接下来在看一下`onTouchEvent`方法的源码，由于代码比较长，我们同样分块来看，首先是这段：
``` java
if ((viewFlags & ENABLED_MASK) == DISABLED) {
    if (action == MotionEvent.ACTION_UP && (mPrivateFlags & PFLAG_PRESSED) != 0) {
        setPressed(false);
    }
    // A disabled view that is clickable still consumes the touch
    // events, it just doesn't respond to them.
    return (((viewFlags & CLICKABLE) == CLICKABLE
            || (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE)
            || (viewFlags & CONTEXT_CLICKABLE) == CONTEXT_CLICKABLE);
}
```
　　从上面的代码中可以看出，不可用状态下的View照样会消耗事件。

　　接着，如果View设置了代理，那么还会执行`TouchDelegate`的`onTouchEvent`方法，代理的工作机制和`OnTouchListener`，这里就不再细说了。
``` java
if (mTouchDelegate != null) {
    if (mTouchDelegate.onTouchEvent(event)) {
        return true;
    }
}
```

　　下面再看一下`onTouchEvent`中对点击事件的具体处理，如下所示：
``` java
if (((viewFlags & CLICKABLE) == CLICKABLE ||
                (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE) ||
                (viewFlags & CONTEXT_CLICKABLE) == CONTEXT_CLICKABLE) {
    switch (action) {
        case MotionEvent.ACTION_UP:

            // 此处省略若干代码...

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

            // 此处省略若干代码...
    }

    return true;
}
```
　　从上面的代码来看，只要View的CLICKABLE、LONG_CLICKABLE和CONTEXT_CLICKABLE有一个为true，那么它就会消耗这个事件，即onTouchEvent方法将返回true。

    -  View的LONG_CLICKABLE默认为false。
    -  View的CLICKABLE是否为false与具体的View类有关，比如Button是可以点击的，TextView是不可点击的。

　　同时，当ACTION_UP事件发生时，会触发performClick方法，如果View设置了OnClickListener，那么performClick方法内部会调用它的onClick方法，如下所示：
``` java
public boolean performClick() {
    final boolean result;
    final ListenerInfo li = mListenerInfo;
    if (li != null && li.mOnClickListener != null) {
        playSoundEffect(SoundEffectConstants.CLICK);
        li.mOnClickListener.onClick(this);
        result = true;
    } else {
        result = false;
    }

    sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_CLICKED);
    return result;
}
```

　　至此，触摸事件的分发过程的源码分析已经结束了，接下来将利用所学的知识，来处理滑动冲突的问题。

## 实战 ##
　　本节开始综合前面所学的知识。

### 自定义ScrollView ###
　　现在有个需求，创建一个ViewGroup控件，可以通过滑动来在多个子View之间切换，效果和ViewPager类似。

　　代码：
``` java
public class MyScrollView extends LinearLayout {

    private Scroller mScroller = new Scroller(getContext());
    private VelocityTracker mTracker;
    private int mTouchSlop;
    private int mLastX;
    private int mChildIndex;

    public MyScrollView(Context context) {
        super(context);
        setOrientation(HORIZONTAL);
        mTouchSlop = ViewConfiguration.get(getContext()).getScaledTouchSlop();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (mTracker == null) {
            mTracker = VelocityTracker.obtain();
        }
        mTracker.addMovement(event);
        int currX = (int) event.getX();
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                // 如果当前正在播放动画，则停止它，这样能提供更好的用户体验。
                // 当然也可以把这三行代码注释掉，注释后的效果请自行体验。
                if (!mScroller.isFinished()) {
                    mScroller.abortAnimation();
                }
                break;
            case MotionEvent.ACTION_MOVE:
                // 在用户手指滑动的同时滚动内容，这样就模仿了ViewPager随着手指滚动的效果。
                scrollBy(mLastX - currX, 0);
                break;
            case MotionEvent.ACTION_UP:
                mTracker.computeCurrentVelocity(500);
                if (Math.abs(mTracker.getXVelocity()) >= mTouchSlop) {
                    if (getChildCount() == 0) {
                        mChildIndex = 0;
                    } else {
                        if (mTracker.getXVelocity() > 0) {
                            //从左到右滑动
                            mChildIndex = (mChildIndex - 1 < 0 ? 0 : mChildIndex - 1);
                        } else { //从右到左滑动
                            mChildIndex = (mChildIndex + 1 > getChildCount() - 1 ? getChildCount() - 1 : mChildIndex + 1);
                        }
                    }
                }
                mTracker.recycle();
                mTracker = null;
                // 当手指抬起的时候，开始播放滚动动画，从当前位置开始，到最近的一个子View结束。
                mScroller.startScroll(getScrollX(), 0, mChildIndex * getChildAt(0).getWidth() - getScrollX(), 0, 1000);
                postInvalidate();
                break;
        }
        mLastX = currX;
        return true;
    }

    @Override
    public void computeScroll() {
        if (mScroller.computeScrollOffset()) {
            scrollTo(mScroller.getCurrX(), mScroller.getCurrY());
            postInvalidate();
        }
    }
}
```

　　Activity的代码：
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView scrollView = new MyScrollView(this);
        int[] colorls = new int[]{Color.BLUE, Color.CYAN, Color.YELLOW};
        for (int i = 0; i < colorls.length; i++) {
            TextView listView = new TextView(this);
            listView.setBackgroundColor(colorls[i]);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  创建了三个TextView对象，尺寸与屏幕的宽高一致，可以把这两个类复制到项目中，直接运行。

### View的滑动冲突 ###
　　本节介绍View体系中的一个深入话题：滑动冲突。只要在界面中存在内外两层同时可以滑动，这个时候就会产生滑动冲突。

　　常见的滑动冲突场景有如下三种：

    -  第一种，外部滑动方向和内部滑动方向不一致。
    -  第二种，外部滑动方向和内部滑动方向一致。
    -  第三种，上面两种情况的嵌套。

　　在介绍如何处理这三类冲突之前，要先知道如下几个知识点：

    -  ViewGroup重写onInterceptTouchEvent方法可以拦截事件：
       -  若在ACTION_DOWN时返回true，则子View不会接到任何事件，事件将由ViewGroup的onTouchEvent处理。
       -  若在ACTION_MOVE时返回true，则子View会接到ACTION_CANCEL事件，后续事件将交给ViewGroup处理。
       -  若在ACTION_UP时返回true，则子View只会接到ACTION_CANCEL事件，不会接到ACTION_UP事件。
       -  也就是说，只要事件被ViewGroup拦截，那么本事件序列结束之前，都不会在将事件传递给子View。
       -  同时，即便子View处理了事件，只要它没有禁用ViewGroup的拦截事件功能，那么ViewGroup的onInterceptTouchEvent仍会被调用。
    -  子View可以通过调用它父View的requestDisallowInterceptTouchEvent方法来禁止其父View拦截事件。
       -  子View无法阻止父View的onInterceptTouchEvent方法接收ACTION_DOWN事件。
       -  子View通常会在接到ACTION_DOWN事件时，禁止其父View拦截事件。
       -  子View通常会在ACTION_MOVE事件中，解除对其父View的禁止，随后父View就能接到ACTION_MOVE事件了。
       -  子View在ACTION_UP事件中解除对其父View的禁止，则父View无法接到ACTION_UP事件。
       -  子View对父View的禁止，只在一个事件序列内有效，即子View在ACTION_DOWN时禁止父View，即便不将父View解禁，当本次事件序列结束，父再次接到ACTION_DOWN事件时就会清除掉禁用状态。

<br>**滑动方向不一致**
　　接着刚才的范例，我们把TextView换成ListView，就可以重现这种场景，即外部是左右滑动，内部是上下滑动。
　　解决的思路是，当用户左右滑动时，让外部View处理事件，当上下滑动时，让内部View处理事件。
　　重点在于，我们如何判断用户当前是左右滑，还是上下滑。 有好几种方式：

    -  依据水平方向和垂直方向的距离差来判断
    -  依据水平方向和垂直方向的速度差来判断
    -  依据依据路径和水平方向所形成的夹角来判断

　　接下来以“距离差”为例子，做示范，我们只需要在MyScrollView中重写xxx方法即可，其它代码不需要修改：
``` java
private int mLastInterceptX;
private int mLastInterceptY;
@Override
public boolean onInterceptTouchEvent(MotionEvent ev) {
    boolean intercept = false;
    int currX = (int) ev.getX();
    int currY = (int) ev.getY();
    switch (ev.getAction()) {
        // 当手指按下的时候，MyScrollView不能拦截事件，否则子View将无法接到事件。
        
        case MotionEvent.ACTION_MOVE:
            // 当手指移动时，如果手指在x轴方向上移动的距离比y轴的距离长，则拦截事件。
            // 注意，一旦此处拦截了事件，那么在本次事件序列结束之前，子View都接不到事件。
            if (Math.abs(currX - mLastInterceptX) > Math.abs(currY - mLastInterceptY)) {
                intercept = true;
            }
            break;
    }
    mLastInterceptX = currX;
    mLastInterceptY = currY;
    return intercept;
}
```

　　然后是Activity的代码：
``` java
public class MainActivity extends ActionBarActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView scrollView = new MyScrollView(this);
        for (int i = 0; i < 3; i++) {
            ListView listView = new ListView(this);
            List<String> data = new ArrayList<String>();
            for (int j = 0; j < 20; j++) {
                data.add("List" + i + " - " + j);
            }
            ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_expandable_list_item_1, data);
            listView.setAdapter(adapter);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  程序运行后，发现已经解决了滑动冲突。

<br>**内部解决法**
　　上面是通过修改外部View的代码来解决滑动冲突的，接下来介绍一下如何通过修改内部View的代码来解决滑动冲突：

    -  首先，父ViewGroup不拦截action_DWON事件，拦截另外两个事件。
    -  然后，由子View来决定事件处理。

<br>　　第一步，创建一个MyScrollView2类，所有代码与MyScrollView相同，但下面的代码不同：
``` java
@Override
public boolean onInterceptTouchEvent(MotionEvent ev) {
    // 按下事件不能拦截，否则子View将接不到事件。
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        return false;
    } else {
        // 除了按下事件之外的其它所有事件都会拦截。
        return true;
    }
}
```

<br>　　第二步，定义MyListView类：
``` java
public class MyListView extends ListView {
    public MyListView(Context context) {
        super(context);
    }

    private int mLastInterceptX;
    private int mLastInterceptY;

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        int currX = (int) ev.getX();
        int currY = (int) ev.getY();
        switch (ev.getAction()) {
            // 当子View接到按下事件时，设置不允许父View拦截事件。
            // 这意味着当前View一定能接到本次事件序列的后续事件。
            case MotionEvent.ACTION_DOWN:
                ((ViewGroup)getParent()).requestDisallowInterceptTouchEvent(true);
                break;
            case MotionEvent.ACTION_MOVE:
                // 如果当前View发现用户手指水平方向移动的距离比垂直方向移动的大，则允许父View拦截事件。
                // 又由于MyScrollView2的onInterceptTouchEvent方法会拦截任何“非按下”事件。
                // 这意味着当前View将不会接到后续事件。
                if (Math.abs(currX - mLastInterceptX) > Math.abs(currY - mLastInterceptY)) {
                    ((ViewGroup)getParent()).requestDisallowInterceptTouchEvent(false);
                }
                break;
        }
        mLastInterceptX = currX;
        mLastInterceptY = currY;

        return super.dispatchTouchEvent(ev);
    }
}
```
<br>　　第三步，Activity的代码为：
``` java

public class MainActivity extends ActionBarActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayMetrics dm = getResources().getDisplayMetrics();
        MyScrollView2 scrollView = new MyScrollView2(this);
        for (int i = 0; i < 3; i++) {
            MyListView listView = new MyListView(this);
            List<String> data = new ArrayList<String>();
            for (int j = 0; j < 20; j++) {
                data.add("MyList" + i + " - " + j);
            }
            ArrayAdapter<String> adapter 
                = new ArrayAdapter<String>(this, android.R.layout.simple_expandable_list_item_1, data);
            listView.setAdapter(adapter);
            scrollView.addView(listView, new LinearLayout.LayoutParams(dm.widthPixels, dm.heightPixels));
        }

        setContentView(scrollView);
    }

}
```
    语句解释：
    -  从实现上来看，内部拦截法要复杂一些，因此推荐采用外部拦截法来解决常见的滑动冲突。

<br>　　另外两种滑动冲突的处理方式也是类似，暂时就不举例了，以后有空的时候再补上。

<br><br>