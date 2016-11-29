title: UI篇　第一章 基础知识
date: 2015-1-21 11:53:48
categories: Android开发 - 倔强青铜
---
　　在`Android`的`framework`中已经提供了很多控件，每一个控件也都提供了很多的API接口，由于篇幅关系，在`“UI篇”`中只会列举出这些控件的基本用法，更复杂的用法请自行搜索。

# 第一节 概述 #
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

# 第二节 常用术语 #

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

# 第三节 常用布局 #
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
    android:layout_width="match_parent"	android:layout_height="match_parent"
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
android:layout_above	        将当前控件的底部置于给定ID的控件之上。  
android:layout_below	        将当前控件的顶部置于给定ID的控件之下。
android:layout_toLeftOf	        将当前控件的右边缘和给定ID的控件的左边缘对齐。
android:layout_toRightOf	        将当前控件的左边缘和给定ID的控件的右边缘对齐。
android:layout_alignBottom	将当前控件的底部边缘与给定ID控件的底部边缘对齐。
android:layout_alignLeft        将当前控件的左边缘与给定ID控件的左边缘对齐。 
android:layout_alignRight	将当前控件的右边缘与给定ID控件的右边缘对齐。
android:layout_alignTop	        将当前控件的顶部边缘与给定ID控件的顶部对齐。
android:layout_alignBaseline	将当前控件的baseline和给定ID的控件的baseline对齐。
android:alignParentBottom	若为true，则将该控件的底部和父控件的底部对齐。  
android:layout_alignParentLeft	若为true，则将该控件的左边与父控件的左边对齐。
android:layout_alignParentRight	若为true，则将该控件的右边与父控件的右边对齐。
android:layout_alignParentTop	若为true，则将该控件的顶部与父控件的顶部对齐。
android:layout_centerHorizontal	若为true，则该控件将被至于水平方向的中央。
android:layout_centerVertical	若为true，则该控件将被至于垂直方向的中央。
android:layout_centerInParent	若为true，该控件将被至于父控件水平方向和垂直方向的中央。
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


# 第四节 常用控件 #
　　本章将介绍一下`Android`中常用的控件，如：`TextView`、`Button`、`RadioButton`等。
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

## EditText ##
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

## CheckBox ##
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

## RadioButton ##
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

## ToggleButton ##
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

# 第五节 样式和主题 #
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
　　例如，你能把`CodeFont style`作为`theme`应用于一个`Activity	`，那么这个`Activity`中所有文本都将是绿色等宽字体。

## 样式 ##
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

## 主题 ##
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
# 第六节 Support Library #
　　`Android Support Library`是一组代码库，提供向后兼容版本的Android框架`API`，若需要在低版本系统中使用高版本中的功能则只能通过该库的`API`。 目前有多个支持库，每个支持库都是向后兼容某个特定的`Android API`级别。这意味着您的应用程序既可以使用支持库所提供的高版本的特点，并且仍然可以在低版本中运行。

## 概述 ##

<br>**组成**
　　`Android Support Library`目前包含`5`个库（`v4`、`v7`、`v8`、`v13`、`v17`），其中`‘v’`代表该支持库所支持的`最低版本的API等级`，如`v4`即指最低支持`Android1.6`。每个库支持一个特定范围的Android平台版本和功能集。
　　一般来说，我们建议包括`v4`和`v7`库到你的应用程序中，因为他们支持广泛的Android版本，并提供`API`推荐用户界面模式。

<br>**下载**
　　`Android Support Library`是对SDK的补充，可以使用`Android SDK Manager`来下载。具体步骤如下：

	1.  启动SDK Manager，通过SDK安装的根目录下的SDK Manager.exe文件。
	2.  打开SDK Manager然后滚动到最底部，找到“Extras”文件夹并将其展开。
	3.  若你使用Eclipse开发项目则需要选择“Android Support Library”，但如果你使用Android Studio开发则需要下载“Android support Repository”。
	4.  点击“安装”按钮。
 
　　下载完毕后，这些文件被放入到`“<sdk>/extras/android/support/”`目录下面。

<br>**特点**
　　下面依次介绍这些支持库的应用场景及特点，你可以依据自己的需求来选择使用哪一个支持库。

## V4 支持库 ##
　　这个支持库是为`Android1.6`(`API Level 4`)或更高版本的平台设计的。相比其他库它包括更大量的`APIs`。包括应用程序组件、用户接口特性、可访问性、数据处理、网络连通性和编程工具。这里有几个关键的类包含在`v4`库：

	-  应用程序组件：
	   -  Fragment：增加了支持封装的用户界面和功能的Fragment，使应用程序可以方便的在小和大屏幕设备之间提供布局。
	   -  NotificationCompat：可以支持丰富的通知功能。
	   -  LocalBroadcastManager：允许应用程序在其内部很容易注册和接收意图，一个私有的广播。
	-  用户接口：
	   -  ViewPager：增加一个ViewGroup来管理布局里的子View，用户可以通过手指左右滑动在子View之间来回切换。
	   -  PagerTitleStrip：PagerTitleStrip是ViewPager的导航栏（不可以点击）。
	   -  PagerTabStrip：PagerTitleStrip是ViewPager的导航栏（可以点击）。
	   -  DrawerLayout：可以支持创建导航抽屉，可以从一个窗口的边缘。
	   -  SlidingPaneLayout：可以用它实现滑动菜单效果，具体参见 http://my.oschina.net/summerpxy/blog/211835 。
	-  可访问性：
	   -  ExploreByTouchHelper、AccessibilityEventCompat。
	   -  AccessibilityNodeInfoCompat、AccessibilityNodeProviderCompat。
	   -  AccessibilityDelegateCompat
	-  数据处理：
	   -  Loader：可以支持异步加载数据。在V4支持库中也提供了这个类的具体实现，包括CursorLoader和AsyncTaskLoader。
	   -  FileProvider：可以支持应用程序之间共享的私人文件。
　　提示：还有许多其他`API`包含在这个库中。更详细的介绍，请参看`android.support.v4`包。这个库放在：`<sdk>\extras\android\support\v4`目录下。

## V7 支持库 ##
　　除了`v4`以外，还有一些库设计用于与`Android 2.1`(`API level 7`)或更高的平台。这些库(它们都是以Android库项目的方式存在)提供特定的功能集，可以包含在您的应用程序，并且独立于其他应用程序。
　　`v7`库下面有多个子库，它们分别用于不同的场景，其中有几个子库体积比较大，因而不再像`v4`包那样合在一起，而是将它们分开发布，下面将依次介绍它们。

<br>**V7 appcompat 库**
　　这个库添加了对 [ActionBar](http://developer.android.com/guide/topics/ui/actionbar.html) 的支持，同时也支持`Android5.0`（`Android Lollipop`）提出的`Material Design`风格。
　　值得注意的是，这个库需要依赖于`v4`库，如果你使用`Ant`或者`Eclipse`，要确保这个库中的类可以引用到`v4`库中的类。

　　这里有几个关键的类包含在`v7 appcompat`库：

	-  ActionBar：提供了ActionBar的实现。
	-  ActionBarActivity：需要使用ActionBar的Activity必须派生自此类。
	-  ShareActionProvider：可以支持一个标准化共享行动(比如电子邮件或发布到社交应用程序)，可以包含在操作栏中。

　　这个库放在：`<sdk>/extras/android/support/v7/appcompat/`目录下。

<br>**V7 cardview 库**
　　这个库添加了对`CardView`类的支持，它是`Android 5.0`推出的一个卡片式的`View`组件。卡片化是全新的`Material`风格设计中重要的组成部分之一，卡片设计适合重要信息的展示，以及在`List`中作为一个包含有复杂操作的`item`使用。
　　`CardView`继承自`FrameLayout`类，同时卡片可以包含圆角、阴影。
　　经常使用`Google APP`的人应该对卡片式设计非常熟悉，不管是`Google Now`、`Google Email`、`Google+`等都沿用了卡片式设计的风格，非常清新明了，感觉没有任何冗余的信息。它的具体用法此处就不在展开介绍了。
　　这个库放在：`<sdk>/extras/android/support/v7/gridlayout/ `目录下。

效果参看：

- [《Android L中的RecyclerView 、CardView 、Palette的使用》](http://blog.csdn.net/xyz_lmn/article/details/38735117)
- [《使用CardView实现卡片式Google Plus布局》](http://www.yiqivr.com/2015/01/%E4%BD%BF%E7%94%A8cardview%E5%AE%9E%E7%8E%B0%E5%8D%A1%E7%89%87%E5%BC%8Fgoogle-plus%E5%B8%83%E5%B1%80/)

<br>**V7 gridlayout 库**
　　这个库添加了对`GridLayout`类的支持，它是在`Android 4.0`中，新引入的一个布局控件。`GridLayout`可以用来做一个象`TableLayout`这样的布局样式，但其性能及功能都要比`Tablelayout`要好，比如`GridLayout`的布局中的单元格可以跨越多行，而`Tablelayout`则不行，此外，其渲染速度也比`Tablelayout`要快。它的具体用法此处就不在展开介绍了。
　　这个库放在：`<sdk>/extras/android/support/v7/gridlayout/`目录下。

效果参看：

- [《Android 4.0开发之GridLayOut布局实践》](http://tech.it168.com/a2011/1213/1287/000001287977.shtml)

<br>**V7 mediarouter 库**
　　这个库添加支持`MediaRouter`，`MediaRouteProvider`以及其他相关的媒体类。
　　当用户使用无线技术连接电视，家庭影院和音乐播放器时，他们希望`android apps`的内容可以在这些大屏幕的设备上播放。启用这种方式的播放，能把一台设备一个用户模式变为一个乐于分享的、令人激动和鼓舞的多用户模式。
　　android媒体路由（`mediarouter`）接口被设计成可以在二级设备上呈现和播放媒体。
　　这个库放在：`<sdk>/extras/android/support/v7/mediarouter/`目录下。注意：该库依赖于`v7 apcompat`库，因此你的项目要同时导入这两个库。

参考阅读：

- [《media and camera 框架之二： MediaRouter》](http://blog.csdn.net/go_strive/article/details/19973011)


<br>**V7 palette 库**
　　这个库添加了对`Palette`类的支持，它是`Android 5.0`推出的一个新特性。`Palette` 可以从一张图片中提取颜色，我们可以把提取的颜色融入到`App UI`中，可以使`UI`风格更加美观融洽。比如，我们可以从图片中提取颜色设置给`ActionBar`做背景颜色，这样`ActionBar`的颜色就会随着显示图片的变化而变化。
　　这个库放在：`<sdk>/extras/android/support/v7/palette/`目录下。

参考阅读：

- [《Android Lollipop 新特性 - Palette》](http://baoyz.com/android/2014/10/21/android-palette-use/)

<br>**V7 recyclerview 库**
　　这个库添加了对`RecyclerView`类的支持，它是`Android 5.0`推出的一个新`View`组件，用来取代`ListView`的。
　　`RecyclerView`的特性（但不限于）如下：

	-  支持设置横向和纵向显示Item。
	-  默认情况下，删除或者增加IteM的时候有动画，当然也可以自定义。

　　这个库放在：`<sdk>/extras/android/support/v7/recyclerview/`目录下。它的具体用法此处就不在展开介绍了。

## V8 支持库 ##
　　这个库设计用于与`Android 2.2`(`API level 8`)或更高的平台，它增加了对`RenderScript`计算框架的支持，这些`APIs`被包含在`android.support.v8.renderscript`包中。值得注意的是，包含这个支持库到你项目中的方法不同于其他支持库，更多信息请参看`RenderScript`开发手册。

## V13 支持库 ##
　　这个库设计用于与`Android 3.2`(`API level 13`)或更高的平台。它增加了对`FragmentCompat`类的支持，以及更多与`Fragment`相关的支持类。
　　这个库放在：`<sdk>/extras/android/support/v13/ `目录下。

<br>**本节参考阅读：**
- [Support Library](http://developer.android.com/tools/support-library/index.html)


## Multidex 支持库 ##
　　随着Android的不断发展，不论是官方还是`Github`上都出现了大量的新功能、新类库。如果你是一名幸运的Android应用开发者，正在开发一个前景广阔的应用，那么当你不断地加入新功能、添加新的类库，并达到一定规模时，就会遇到下面的构建错误，它表明你的应用已经达到了一个Android应用程序构建架构的限制。早期版本的构建系统报告这个错误如下：
``` c
Conversion to Dalvik format failed:
Unable to execute dex: method ID not in [0, 0xffff]: 65536
```

　　最近版本的Android构建系统会显示一个不同的错误信息，但它们是一个同样的问题:
``` c
trouble writing output:
Too many field references: 131000; max is 65536.
You may try using --multi-dex option.
```
<br>　　这两个错误条件显示一个共同的数字：`65536`。这个数字很重要，因为它代表了`方法的总数`。Android平台的Java虚拟机`Dalvik`在执行`DEX`格式的Java应用程序时，使用原生类型`short`来索引`DEX`文件中的方法。这意味着单个`DEX`文件可被引用的方法总数被限制为`65536`。通常`APK`包含一个`classes.dex`文件，因此Android应用的方法总数不能超过这个数量，这个数量是`Android框架`、`第三方类库`和`你自己开发的代码`的总和。如果你已经建立了一个Android应用，并且收到了这个错误，那么恭喜你，你的方法数已经超过了这个限制。

　　这个问题可以通过将一个`DEX`文件分拆成多个`DEX`文件解决。在`Facebook`、`Android Developers`博客等地方，介绍了通过自定义类加载过程的方法来解决此问题，但这些方法有些复杂而且并不优雅。
　　随着新的`MultiDex支持库`发布，`Google`正式为解决此问题提供`官方支持`，[《Building Apps with Over 65K Methods》](http://developer.android.com/tools/building/multidex.html)介绍了如何使用`Gradle`构建多`DEX`应用。

<br>**在Android 5.0是个分水岭**
　　`Android 5.0`之前版本的平台使用的`Dalvik`执行应用程序代码。默认情况下，`Dalvik`限制每`APK`文件只能有一个`classes.dex`的字节码。为了绕过这个限制，您可以使用`Multidex支持库`，它允许你的`APK`中包含多个`dex`文件。
　　`Android 5.0`和`更高版本`使用`ART`来执行应用程序代码，它原生支持从`APK`文件加载多个`DEX`文件。在应用安装时，它会执行预编译，扫描`classes(..N).dex`文件然后将其编译成单个`.oat`文件用于执行。

　　更多关于`ART`的介绍可以参看博文： [《Android运行时ART简要介绍和学习计划》](http://blog.csdn.net/luoshengyang/article/details/39256813) 。

<br>**仍需控制项目大小**
　　虽然`Google`解决了应用总方法数限制的问题，但并不意味着开发者可以任意扩大项目规模。`Multidex`仍有一些限制：

	1、DEX文件安装到设备的过程非常复杂，如果第二个DEX文件太大，可能导致应用无响应。
	2、由于Dalvik linearAlloc的Bug，应用可能无法在Android 4.0之前的版本启动，如果你的应用要支持这些版本就要多测试。
	3、同样因为Dalvik linearAlloc的限制，如果请求大量内存可能导致崩溃。Dalvik linearAlloc是一个固定大小的缓冲区。在应用的安装过程中，系统会运行一个名为dexopt的程序为该应用在当前机型中运行做准备。dexopt使用LinearAlloc来存储应用的方法信息。Android 2.2和2.3的缓冲区只有5MB，Android 4.x提高到了8MB或16MB。当方法数量过多导致超出缓冲区大小时，会造成dexopt崩溃。
	4、Multidex构建工具还不支持指定哪些类必须包含在首个DEX文件中，因此可能会导致某些类库（如某个类库需要从原生代码访问Java代码）无法使用。

<br>　　避免应用过大、方法过多仍然是Android开发者要注意的问题。`Mihai Parparita`的开源项目[ dex-method-counts ](https://github.com/mihaip/dex-method-counts)可以用于统计`APK`中每个包的方法数量。通常开发者自己的代码很难达到这样的方法数量限制，但随着第三方类库的加入，方法数就会迅速膨胀。因此选择合适的类库对Android开发者来说尤为重要。

　　开发者应该避免使用`Google Guava`这样的类库，它包含了`13000`多个方法。尽量使用专为移动应用设计的`Lite/Android`版本类库，或者使用小类库替换大类库，例如用`Google-gson`替换`Jackson JSON`。而对于`Google Protocol Buffers`这样的数据交换格式，其标准实现会自动生成大量的方法。采用`Square Wire`的实现则可以很好地解决此问题。


<br>**本节参考阅读：**
- [Android应用打破65K方法数限制](http://www.infoq.com/cn/news/2014/11/android-multidex)

## JIT ##
　　既然在[《Android运行时ART简要介绍和学习计划》](http://blog.csdn.net/luoshengyang/article/details/39256813) 中提到了`JIT`，我们本节就简单介绍一下`JIT`。

<br>**序：**
　　从计算机程序出现的第一天起，对效率的追逐就是程序员天生的、坚定的信仰，这个过程犹如一场没有终点，永不停歇的`F1方程式竞赛`。程序员犹如车手，技术平台则是赛道上飞驰的赛车。

　　`JIT`，即时编译器（`JIT compiler`，`just-in-time compiler`）是一种提高程序运行效率的方法。
　　通常，程序有两种运行方式：`静态编译`与`动态直译`。`静态编译`的程序(如`C语言`)在执行前全部被翻译为机器码，而`动态直译`执行的则是一句一句边运行边翻译(如`Java`)。而`即时编译器则混合了这二者`，一句一句编译源代码，但是`会将翻译过的代码缓存起来以降低性能损耗`。相对于静态编译代码，即时编译的代码可以处理延迟绑定并增强安全性。

<br>**JVM即时编译器**
　　以`Java`语言为例，首先，我们大家都知道，通常`javac`将程序源代码编译，转换成`java`字节码，而这个字节码不是编译成与某个特定的处理器硬件平台对应的指令代码（比如，`Intel`的`Pentium`微处理器或`IBM`的`System/390`处理器），因此后续`JVM`还要通过解释字节码将其翻译成对应的机器指令，逐条读入，逐条解释翻译。
　　当`JVM`发现某个方法或代码块运行特别频繁的时候，就会认为这是`“热点代码”`（`Hot Spot Code`)。为了提高热点代码的执行效率，就会将这些`“热点代码”`编译成与本地机器相关的机器码，进行各个层次的优化。 完成这个任务的编译器就是即时编译器（`JIT`）。因此即时编译器的性能好坏，代码的优化程度高低是衡量一款商用虚拟机优秀与否的最关键指标之一，它是虚拟机最核心最能体现技术水平的部分。
　　 常见的热点代码有两类：

	-  多次被调用的方法
	-  多次被执行的循环体

<br>　　提示1：`Java JIT`工作流程。

	-  首先，Java源码通过编译器转为平台无关的字节码文件。
	-  然后，在启动Java应用程序后，JVM会在运行时加载编译后的类并通过Java解释器执行适当的语义计算。
	-  接着，当开启JIT时，JVM会分析Java应用程序的函数调用并且（达到内部一些阀值后）编译字节码为本地更高效的机器码。JIT流程通常为最繁忙的函数调用提供更高的优先级。
	-  最后，一旦函数调用被转为机器码，JVM会直接执行而不是“解释执行”。

<br>　　提示2：`JIT`不是`Java`专有的。

	-  微软的.NET Framework等语言都依赖即时翻译以提供高速的代码执行。Mozilla Firefox使用的Javascript引擎SpiderMonkey也用到了JIT的技术。Ruby的第三方实现Rubinius和Python的第三方实现PyPy也都通过JIT来明显改善了解释器的性能。

<br><br>