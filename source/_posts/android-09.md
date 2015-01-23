title: 第三章 用户界面
date: 2015-1-21 11:53:48
categories: Android
---
# 第一节 概述 #
　　在Android应用程序中，使用`View`和`ViewGroup`对象来创建用户界面。

　　`View`对象是Android平台上用户界面的基础单元，它通过在屏幕中绘制一些内容来与用户交互，如文本框和按钮等，View类是它们公有的基类。
　　`ViewGroup`对象是一个容器，可以包含View对象在其内部，各个View会按照不同的规则进行排列，像线性布局、表格布局、相对布局。ViewGroup也可以包含另一个ViewGroup，ViewGroup类是View类的子类。 

　　`ViewGroup`是用于叫做`“layouts”`子类的基类，它提供了不同类型的布局结构，文本框和按钮一类的元素被称为`“widgets”`。
　　

　　一个View对象就是一个数据结构，它的属性保存了屏幕的特定`矩形区域`的布局参数和内容。View对象会处理它自己的尺寸、布局、描画、焦点变更、滚动和跟驻留在屏幕特定矩形区域交互的键/手势等特性。作为用户界面中的一个对象，一个View也是给用户的一个交互点，并且接受交互的事件。

## View的层次结构 ##
　　在Android平台上，你会像下图显示的那样，使用`View`和`ViewGroup`节点的层次结构来定义一个Activity的UI，这个层次结构树能够根据你的需要简化或复杂化，并且你能够使用Android预定义的一组构件和布局来构建UI，或者创建你自己的定制的View。
　　每个ViewGroup是一个看不见的容器，它组织着自己的子View，子View可以是常见的输入控件（按钮、文本框）或其他可以被绘制在UI上的widgets。

<center>
![](/img/android/android_3_1.png)
</center>

　　你可以在代码中实例化View的子类来构建你的`layout`，但是最常见方法是用一个XML布局文件，XML提供了一个人类可读的结构布局，类似于HTML。
　　通常，我们把构成`layout`的多个View称为一个`“View hierarchy tree”`(层次树)。

　　当定义完毕`layout`后，为了把这个View层次树展现到屏幕上，你的Activity必须调用`setContentView()`方法，并且把这个View层次树的根节点的引用传递给根节点对象。Android系统接受这个引用，并且使用这个引用来废止、计算和绘制新的View层次结构树。
　　层次结构的根节点请求它的子节点依次绘制它们自己，每个ViewGroup节点负责调用它自己的每个子View来绘制它们自己，子节点可以请求它们在父节点中的尺寸和位置，但是父对象能够最终决定每个子节点的大小和位置。
　　Android会依次解析你的布局中的元素（从层次结构树的顶部），实例化View类，并且把它们添加到它们的父容器中。因为这些是依次绘制的，所以如果有`位置重叠`的元素，那么`最后绘制的元素将位于之前在那个位置绘制的对象之上`。

<br>　　在Android中View是大部分UI组件的基类，它常用的子类有：

	ImageView、ProgressBar、SurfaceView、TextView、ViewGroup
　　其中`ViewGroup`和`TextView`是各种页面布局和常用文本控件（标签、文本框、按钮）的基类。 

## 布局（Layout） ##
　　为Activity等创建布局最常见方法是用一个`XML`布局文件，`XML`像`HTML`那样给布局提供一个可读的结构。
　　XML中每个元素既可以是一个View对象也可以是一个ViewGroup对象（或者是它们的子类）。View对象是层次结构树中的`叶子`，ViewGroup对象是层次结构树中的`分支`。
　　一个XML元素的名字对应了它所代表的Java类的名字，因此一个`<TextView>`元素要在你的UI中创建一个`TextView`对象，`<LinearLayout>`元素要创建一个`LinearLayout`（`ViewGroup`的子类）。当你装载布局资源时，Android系统会根据你的布局文件中对应的元素来初始化这些运行时对象。

　　例如，下例是用文本框和按钮做的一个垂直布局：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent" 
    android:layout_height="fill_parent"
    android:orientation="vertical" >
    <TextView android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, I am a TextView" />
    <Button android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, I am a Button" />
</LinearLayout>
```

　　上面代码中`LinearLayout`元素包含了`TextView`和`Button`对象。你还可以在内部嵌套另一个`LinearLayout`元素（或其他类型的ViewGroup对象），来拉长View的层次结构树，并创建一个更复杂的布局。

　　使用多种不同类型的ViewGroup对象，你能够用无限多的方法来构建子View和ViewGroup对象。Android提供了一些预定义的ViewGroup对象，包括`LinearLayout`、`RelativeLayout`、`TableLayout`、`GridLayout`等。每个布局组件都提供一组唯一的用于定义子View位置和布局结构的布局参数。

<br>　　范例1：页面布局的基本语法。 
``` xml
<?xml version="1.0" encoding="utf-8"?>
<ViewGroup xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_height= ["dimension" | "fill_parent" | "wrap_content"]
    android:layout_width= ["dimension" | "fill_parent" | "wrap_content"]>
    <View/>
    <ViewGroup>
        <View />
    </ViewGroup>
</ViewGroup>
```
    语句解释：
    -  在一个XML页面文档中，其根节点可以是一个<View>或<ViewGroup>，且根节点必须被放到android命名空间中，其他的结点不需要。
    -  标签<ViewGroup>代表抽象类ViewGroup类的一个对象，表示一个布局。标签<View>代表类View的一个对象。
    -  在xml用户界面文档中，通常使用以下四个标签来设置布局： 
       -  <LinearLayout>标签： 线性布局。
       -  <RelativeLayout>标签： 相对布局。
       -  <FrameLayout>标签： 帧布局。
       -  <TableLayout>标签： 表格布局。
    -  <ViewGroup>内部可以嵌套其他<ViewGroup>或<View>。 


<br>　　ViewGroup类的常见子类：

	-  直接子类：AbsoluteLayout、FrameLayout、LinearLayout、RelativeLayout 
	-  间接子类：ListView、Spinner、Gallery、GridView、RadioGroup、ScrollView、TabHost、TableLayout、WebView 

## 构件（Widgets） ##
　　一个`Widget`是一个用于跟用户交互的View对象。 
　　Android提供了一组完整的`Widget`实现，如，按钮、复选框、文本输入域等，以及一些更复杂的`Widget`，如日期选择器、时钟、缩放控制等，因此你能够快速的构建你的UI。

　　如果你更喜欢做一些定制化的事情，并且要创建你自己的可操作的元素，你可以通过定义你自己的View对象或继承合并既存的`Widget`来达到自己的目的。
　　另外，`android.widget`包列出了Android系统提供的全部widget。

## 输入事件 ##
　　一旦你给UI添加了一些`View/Widget`对象，你就可能想要了解有关用户跟它们的交互，以便能够执行一些动作。要获取用户的输入事件，你需要做以下两件事之一：

<br>**定义一个事件监听器并且把它注册给View对象**
　　通常，你要关注如何监听事件。View类包含了一组名称是`On<something>`的监听器嵌套接口，每个都是一个回调方法。
　　例如，`View.OnClickListener`(针对处理View上的“点击”动作)、`View.OnTouchListener`(针对View内的触屏事件)、`View.OnKeyListener`(针对View对象内的设备按键事件)。
　　因此如果想要在它被点击时（如一个按钮被点击时）通知View对象，就要实现`OnClickListener`监听器并定义它的`onClick()`回调方法（点击按钮时要执行的动作），并且用`setOnClickListener()`方法把它注册给这个View对象。

<br>**重写View类的既存的回调方法**
　　在你实现自己的View类，并且想要监听它内部发生的特定的事件时，就要这么做。
　　例如：触屏事件（`onTouchEvent()`）、轨迹球移动事件（`onTrackballEvent()`）、或设备的按键事件（`onKeyDown()`）。
　　这样就允许你在这个定制View类内部给每个事件定义默认的行为，并且决定这个事件是否应该传递给其他的子View。当你建立一个定制组件时，这是你给这个View类再次定义这些回调方法的唯一的机会。

## 适配器（Adapters） ##
　　有些时候，你会想封装一个带有一些非硬编码信息的ViewGroup类，比如你可能会需要显示一个列表，列表的长度是可以动态增长的。
　　Android提供了一些继承自`AdapterView`类的控件，`AdapterView`是ViewGroup类的子类。与普通ViewGroup的区别在于，它的子元素的个数可以是在程序运行时动态变化的，每个子View都用`Adapter`中的数据来初始化和填充。

　　`AdapterView`类，它基于给定的适配器（`Adapter`）对象来决定它的子View对象。`Adapter`在数据源和`AdapterView`（用于显示数据）之间扮演着一个邮递员的角色。在Android中Adapter类已经有几个现成的子类了，如针对从`Cursor`对象中读取数据库数据的`CursorAdapter`类，或者是针对读取数组数据的`ArrayAdapter`类。

## 样式和主题（Styles and Themes） ##
　　也许你对标准的`Widget`外观不满意，你能够创建一些你自己的样式和主题来修改它们。
 
　　样式（`Styles`）与CSS类似，是一组属性的集合，我们可以把一个样式直接应用到一个View上。如，你能够定义一个指定某个文本大小和颜色的样式，然后把它只应用到一个`TextView`上。
　　当我们把一个样式设置到`Activity`上使用时，这个样式也就被称为主题（`Themes`）了，主题中包含的属性能够应用于指定的Activity或整个应用程序。

　　后面章节中会介绍更多的样式和主题的使用方法。

# 第二节 Layouts #
　　布局定义了用户界面的视觉结构，如`Activity`或`app widget`的用户界面。你能够用以下两种方法来声明你的布局：

	1.  在XML文件中声明布局元素。Android提供了一个简单的XML词汇表，用来对应View类和子类。
	2.  在运行时实例化布局元素。你的应用程序能够编程创建View和ViewGroup对象（并且操作它们的属性）。

<br>　　Android框架为声明和管理应用程序UI提供了灵活的方法，你可以使用上述方法之一或两者同时使用。例如，你能够在XML文件中声明应用程序默认的布局，包括将要在布局中显示的屏幕元素和属性。然后你能够在应用程序中添加代码在运行时来修改屏幕对象的状态，包括那些在XML文件中声明的属性。

　　在XML文件中声明应用程序的UI的优点是`它能更好的把应用程序的表现跟控制它们行为的代码分离`。你的UI在应用程序代码外部描述，这就意味着你不用修改代码和重新编译就能够修改和调整UI。例如，你能够给不同的屏幕方向、不同的设备屏幕尺寸、和不同语言创建XML布局文件。另外，在XML文件中声明布局使得更容易看清UI的结构，以便更容易调试问题。

　　一般对于声明UI元素的XML词汇表都紧密的跟这些类和方法的结构和命名关联。实际上，这种对应是你直接就能猜出XML属性对应的一个类方法，或者猜出类对应的xml元素。但是请注意，不是所有的词汇表都是相同的，在某些情况下，会有轻微的命名差异。例如，`EditText`元素有一个`text`属性对应`EditText.setText()`方法。

## 在XML中创建用户界面 ##
<br>**编写XML**
　　使用XML创建用户界面，能让我们快速的设计UI布局和它们包含的屏幕元素，就像用HTML标签创建网页一样方便快捷。
　　每个布局文件必须包含明确的一个根元素，它必须是一个`View`或`ViewGroup`对象。一旦你定义了根元素，就能够添加额外的`Layout`和`Widget`等子元素来逐步的构建一个定义整体布局View层次结构树。例如，以下是使用持有`TextView`对象和`Button`对象的垂直`LinearLayout`对象的XML布局：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent" 
    android:layout_height="fill_parent" 
    android:orientation="vertical" >
    <TextView android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, I am a TextView" />
    <Button android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, I am a Button" />
</LinearLayout>
```
　　在XML中声明了布局以后，要把带有`.xml`扩展名的文件保存到你的Android工程的`res/layout`目录中，以便工程能够正确的编译。
　　上例中的每个属性会在稍后讨论。

<br>**装载XML资源**
　　当编译应用程序时，每个XML布局文件都被编译到一个View资源中，你应该在应用程序的`Activity.onCreate()`回调的实现代码中装载布局资源。通过调用`setContentView()`方法来完成View资源的加载，调用这个方法时要用`R.layout.layout_file_name`格式把引用的布局资源传递给它。例如，如果XML布局被保存在`main_layout.xml`文件中，应该用以下方式来加载：
``` android
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main_layout);
}
```
　　当Activity被启动时，Activity中的`onCreate()`回调方法被Android框架调用。

## 常用术语 ##

### 属性（Attributes） ###
　　使用XML文件构建用户界面时，每个`View`和`ViewGroup`对象都对应一个`XML标签`，同时不同的xml标签支持不同的`XML属性`。比如：

	-  TextView标签的textSize属性（字体大小）、textColor属性（字体颜色）。
	-  LinearLayout标签的orientation属性（设置水平或垂直排列它的子元素）。

　　属性会被继承这个类的任何View对象继承。因此View类中定义的属性，它的任何子类都可以直接使用（如`id`属性）。


### id属性 ###
　　为了唯一标识XML布局文件里的某个View，Android提供了一个`android:id`属性，这是一个对所有View对象都通用的属性（由View类定义），并且你也会经常使用。以下是它在XML标签中的语法：
``` xml
android:id="@+id/my_button"
```
　　开头的`@`符是一个资源标识符，指示XML解析器接应该继续解析后面的字符串。
　　在`@`符后面可以跟随`drawable`、`id`、`string`等字符，其中`id`则标识了它是一个`id`资源。
　　`“+”`号意味着如果在`R.id`类中没有对应的字段的话，则必须创建它并且要把它添加到我们的资源文件中（`R.java`文件），如果有了则不会再次创建。

　　Android中内置了许多`id`资源，当引用一个Android内部的资源`id`时，不需要`“+”`号，但必须像下例那样添加`android`包命名空间：
``` xml
android:id="@android:id/empty"
```
　　带有`android`包命名空间的地方，说明我们应用的是来自`android.R`资源类的一个`id`，而不是本地资源类。

<br>　　为了创建View并能在应用程序中引用它们，通用的做法如下：
　　首先，在布局文件中定义一个View/Widget，并给它分配一个唯一的ID；
``` xml
<Button android:id="@+id/my_button"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/my_button_text"/>
```
　　然后，创建一个View对象的实例，并且从布局中获取它（通常是在Activity的onCreate()方法中）。
``` java
Button myButton = (Button) findViewById(R.id.my_button);
```

　　事实上，`android:id`属性不需要在整个层次结构树中唯一，只需要在检索范围内唯一即可。（但因为检索经常是整个层次结构树，所以最好还尽可能的全局唯一）。

### 布局参数 ###
　　每个`ViewGroup`类都实现了一个嵌套类，这个类继承了`ViewGroup.LayoutParams`。
　　这个子类封装了ViewGroup类的每个子View的布局信息（如：View的尺寸、位置等），以便子View队形适应这个ViewGroup对象。如下图所示，父ViewGroup给每个子View（包括子ViewGroup）定义到了布局参数：

<center>
![](/img/android/android_3_2.png)
</center>

　　注意，每个`ViewGroup.LayoutParams`子类都有它自己管理布局参数的方式。因此每个子元素都应该要定义适合它的父元素的`LayoutParam`子类，比如被放入到`LinearLayout`的View对象应该为它指定一个`LinearLayout.LayoutParams`对象。

　　所有的ViewGroup都包含一个宽度和高度（`layout_width`和`layout_height`属性），并且每个View都要定义定义它们。许多`LayoutParam`类也包含了可选的边距和边框等属性。

　　你可以直接写一个数值来指定宽度和高度，虽然不可能经常这样做。更多的，你会使用以下方式来设定宽度和高度：

	-  wrap_content会告诉你View，它的尺寸是由它的内容的大小来决定的。
	-  fill_parent（在API级别8中推荐match_parent）会告诉你的View，它会变得与它的父ViewGroup所允许大小一样大。
　　一般情况下，设置宽高时不推荐使用绝对单位（如`px`）来指定布局的宽度和高度。
　　相反，而要使用相对单位，如分辨率无关的像素单位（`dp`），`wrap_content`或`fill_parent`是比较好的方法，因为它有助于让你的应用程序在各种尺寸的设备屏幕上显示。

### 布局位置 ###
　　一个View就是一个矩形，它用矩形的左上角顶点坐标来表述它的位置（`left`和`top`属性），并且用`width`和`height`属性来表述它的两边的尺寸。位置和尺寸的计量单位是像素。
　　通过调用View类的`getLeft()`和`getTop()`方法来获取一个View的左上角位置。`getLeft()`方法返回值代表了这个View的左边距或X点坐标。`getTop()`方法的返回值代表了这个View的上边距或Y点坐标。这两个方法的返回值都是相对它的父元素的位置，如，当`getLeft()`方法返回`20`时，就意味着这个View对象被定为在距离它的父元素的左边缘的右边20个像素的位置。

　　另外，还有几个便利的方法，从而避免不必要的计算，分别是`getRight()`和`getBottom()`。这两个方法返回了这View对象的右下点坐标。例如，调用`getRight()`方法等同于`getLeft()+getWidth()`的计算结果。

### 尺寸、填充方式 ###
　　一个View对象的尺寸(`size`)用宽和高来表述。一个View对象实际上有两对宽和高的值。

　　第一对是被叫做`测量宽度`和`测量高度`。这两个尺寸定义了一个View对象在它的父元素中想要的大小。测量尺寸能够通过调用`getMeasuredWidth()`和`getMeasuredHeight()`方法获得。

　　第二对被简单的叫做`宽度`和`高度`，或者某些时候被叫做`描画宽度`和`描画高度`。这两个尺寸定义了这个View对象在屏幕上的实际描画和布局尺寸。这两个值可以但不必区分与测量宽度和高度。通过调用`getWidth()`和`getHeight()`方法能够获得View对象的宽度和高度。

　　要计算View对象的尺寸，需要计算它们的填充方式。填充方式以像素(`px`)为单位，代表了View对象的左顶点到右下点之间的矩形区域。填充方式能够被用于View对象内容的偏移（通过指定偏移像素）。例如，左边填充方式是2的时候，View对象的内容会被推到距离这个对象左边缘右边2个像素的位置。
　　填充方式能够调用`setPadding(ing, int, int, int)`方法来设置。
　　通过调用`getPaddingLeft()`、`getPaddingTop()`、`getPaddingRight()`、`getPaddingBottom()`方法来查询。

## 常用布局 ##
### LinearLayout ###
　　线性布局是一个视图组，它所有的子视图都在一个方向对齐，`水平`或者`垂直`。你可以通过`android:orientation`属性指定布局的方向。
　　线性布局的所有子视图排列都是一个靠着另一个，因此：

	-  垂直线性布局：布局内的所有控件，每个控件独占一行，所有控件从上到下垂直排放 。
	-  水平线性布局：布局内的所有控件从左到右排在一行中，若当前屏幕显示不下，则也不会另起一行。 整个行的行高，为高度最高的那个组件的高度。

<br>　　属性`android:orientation`指出线性布局的方式(默认值为水平布局)，取值有两个： 

	-  垂直布局：vertical
	-  水平布局：horizontal

	
<br>　　范例1：`main.xml`文件。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"	android:layout_height="match_parent"
    android:orientation="horizontal">

</LinearLayout>
```

<br>　　LinearLayout还支持给单独的子View分配权重（通过`android:layout_weight`属性）。
　　这个属性给View对象分配一个重要性的值，允许它在其父View中的剩余空间中展开和填充。子View能够被指定一个整数的权重值，然后ViewGroup中剩余空间会按照它们声明的比例分配给每个子View。默认权重值是0。例如，如果有三个文本框，其中的两个声明的权重值是1，而另一个没有声明权重值（默认是0），那么第三个没有权重的文本框只会占据它的内容所需要的区域，尺寸并不会变大。而另外的两个文本框则在三个文本框被测量后，平分剩余的空间。如果第三个文本框的权重是2（而不是0），那么这就声明了它比其他的两个更重要，因此它会获得总的剩余空间的一半，而另外两个则会平分剩余的空间。

<br>　　范例2：`android:layout_weight`属性。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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

### RelativeLayout ###
　　RelativeLayout顾名思义，相对布局，在这个容器内部的子元素们可以使用彼此之间的相对位置或者和父容器间的相对位置来进行定位。
　　RelativeLayout是非常强大与常用的一个布局类，因为它可以消除嵌套视图组，并保持你的布局层次平坦，从而提高性能。如果你发现自己使用多个嵌套的LinearLayout组，您可能能够一个RelativeLayout来取代它。

<br>**定位视图**
　　相对布局可以让它的子视图指定自己的相对于父视图的位置或者其他的(通过指定的ID)。默认情况下，所有的子视图在布局的左上角。所以你必须定义每个视图的位置。

<br>　　范例1：相对布局。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
android:layout_toRightOf	将当前控件的左边缘和给定ID的控件的右边缘对齐。
android:layout_alignBottom	将当前控件的底部边缘与给定ID控件的底部边缘对齐。
android:layout_alignLeft	将当前控件的左边缘与给定ID控件的左边缘对齐。 
android:layout_alignRight	将当前控件的右边缘与给定ID控件的右边缘对齐。
android:layout_alignTop	        将当前控件的顶部边缘与给定ID控件的顶部对齐。
android:layout_alignBaseline	将当前控件的baseline和给定ID的控件的baseline对齐。
android:alignParentBottom	若为true,则将该控件的底部和父控件的底部对齐。  
android:layout_alignParentLeft	若为true,则将该控件的左边与父控件的左边对齐。
android:layout_alignParentRight	若为true,则将该控件的右边与父控件的右边对齐。
android:layout_alignParentTop	若为true,则将该控件的顶部与父控件的顶部对齐。
android:layout_centerHorizontal	若为true,则该控件将被至于水平方向的中央。
android:layout_centerVertical	若为true,则该控件将被至于垂直方向的中央。
android:layout_centerInParent	若为true,该控件将被至于父控件水平方向和垂直方向的中央。
```

<br>　　范例3：padding(填充)。
``` android
android:padding
android:paddingLeft="10dp"
android:paddingTop="20dp"
android:paddingRight="30dp"
android:paddingBottom="30dp"
```
    语句解释：
    -  使用android:padding属性可以设置当前控件所占据的空间的边框 与当前控件正文的内容之间的间距。也可以使用其他四个属性，为当前控件所占据的空间的某条特定的边框，设置填充。
    -  使用android:layout_margin属性可以设置当前控件与相邻控件之间的间距。

<br>　　范例4：绝对定位。
``` android
<?xml version="1.0" encoding="utf-8"?>
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
    -  在相对布局中，控件的位置可以通过四个属性来唯一确定：左上角坐标、控件的宽高。

### TableLayout ###
　　TableLayout代表表格页面布局，它不显示行、列或单元格的边框线，表的每行会有多个带有单元格的列，单元格可以为空。

<br>　　范例1：`main.xml`文件。
``` android
<?xml version="1.0" encoding="utf-8"?>
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

<br>　　`TableLayout`的每行有`0`或多个单元格，每个单元格都可以定义为任意类型的View对象。但是，`TableLayout`已经不常用了。

<br>　　范例2：其他属性。
``` android
<?xml version="1.0" encoding="utf-8"?>
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
``` android
<?xml version="1.0" encoding="utf-8"?>
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

### FrameLayout ###
　　FrameLayout是最简单的布局对象类型。它基本上是屏幕上的一块空白区域，你能够在这块区域中填充一个单一的对象（如图片）。FrameLayout的所有的子元素都是从屏幕的左上角开始定位的，不能给子View指定不同的位置，后续的子View会描画在前一个子View的上面，并部分或全部的遮挡住前一个View（除非新的对象是透明的）。

　　在帧布局中，组件是以覆盖的方式排列的，即将两个组件A和B依次放入帧布局中时，B组件会压在A组件的上方，这类似于一摞扑克牌。 

<br>　　范例1：帧式布局。
``` android
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
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
    -  所谓前景图像，即永远处于帧布局最顶的，直接面对用户的图像，就是不会被覆盖的图片。
       -  比如用户头像的圆角效果，可以用到此功能。 
    -  属性android:foreground：设置该帧布局容器的前景图像。
    -  属性android:foregroundGravity：设置前景图像在FrameLayout内部的显示位置。取值有：
       -  right、bottom、top等，如果需要多个值，值之间要使用“|”间隔，本范例的位置为右下角。

## 简单控件 ##
### TextView ###
　　在XML文件中使用`<TextView>`标签可以构建出一个标签控件，`TextView`用于显示文本数据。每个`<TextView>`标签都对应于TextView类的一个实例。

<br>　　范例1：`<TextView>`标签。
``` xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="请输入您的联系电话："
    android:id="@+id/notify"/>
```
　　属性解释：
``` xml
android:id                  为当前标签指定一个ID，ID保存在R.java中。           可选。
android:text                指出标签所要显示的数据，可直接指定字符串常量。       可选。
android:layout_width        指出当前控件在其父组件中所占据的宽度。              可选。
android:layout_height	    指出当前控件在其父组件中所占据的高度。              可选。
android:clickable           指出当前控件是否启用android:onClick属性。          可选。
```
　　提示：
	-  表达式：“@+id/notify”的含义：向R的内部类id中添加一个名为notify静态常量，若R中不存在内部类id，则要先创建内部类id ，若存在，则不会再建立，而是直接在其内创建一个名为notify的静态常量。 若notify静态常量也存在，则不执行任何操作，仅会将notify的引用返回来。
	-  当前组件在其父组件中所占据的宽度和高度的值可以是： 
	   -  具体的数值。如：89dp 。
	   -  关键字：
	      -  match_parent： 设置当前组件的尺寸为其父组件中当前剩余的空间。 
          -  fill_parent：效果和match_parent一样，它的存在是历史遗留问题，Google推荐使用match_parent 。
	      -  wrap_content：设置当前组件的尺寸随着其包含的内容所占的大小改变而改变。
	-  若android:clickable属性的值为true，则为TextView设置android:onClick属性时，可以触发点击事件。
	-  若android:clickable属性的值为false，则即便为TextView设置了android:onClick属性，也不会触发TextView的点击事件。


<br>　　组件常用的尺寸单位：
``` xml
单位                                         描述
px (pixels)                像素。
dip或dp                    设备独立像素。根据当前屏幕分辨率，自动调节控件的大小。
pt                         点，一般用于设置字体的大小。
sp                         一般用于设置字体的大小。
```

<br>　　在代码中可以通过调用TextView类的`setText()`和`getText()`方法，来设置和获取TextView对象所显示的文字。


<br>　　范例2：其他属性。
``` xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="#cccfff"
    android:text="@string/text"
    android:singleLine="true"
    android:id="@+id/notify"
    android:gravity="right"/>
```
　　属性解释：
``` xml
android:singleLine	设置标签上的文字，是否全部显示在同一行中。若是，当文字一行显示不开时，则使用 … 代替。	可选。
android:background	设置当前标签控件所占据的空间的背景色。                           可选。
android:gravity         设置标签上的文字在当前标签控件所占据的空间中的对齐方式。           可选。
```

<br>　　TextView是支持滚动条滑动的，当TextView的内容超出了其宽或高则就可以使用其内置滚动条了。
 
<br>　　范例3：启用内置水平、垂直滚动条。
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

<br>　　范例4：发光字体。
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

<br>　　范例5：设置行数。
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
　　ImageView是一个用来显示图片的控件，在XML文件中使用`<ImageView>`标签表示。

<br>　　范例1：`<ImageView>`标签。
``` xml
<ImageView android:src="@drawable/movie"
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

### ProgressBar ###
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
style	ProgressBar有两种显示风格，使用style属性可以设置Progress显示风格。关于style在后面章节会详述。
android:visibility	进度条最初是默认可见的，可以使用此属性来设置其初态。  
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

### SeekBar ###
　　SeekBar是一个可拖动的进度条。
　　用户可以通过拖动手柄，来调整进度条的当前位置。一般用于音乐、视频播放器中。
　　SeekBar是ProgressBar的间接子类，因此可以按照操作ProgressBar的方式，操作SeekBar。

<br>　　范例1：SeekBar标签。
``` xml
<SeekBar
	android:id="@+id/seekBar"
	android:layout_width="match_parent"
	android:layout_height="wrap_content"/>
```


范例2：SeekBar类	 。
类型	class	所属包	android.widget
签名	public class SeekBar extends AbsSeekBar
常用方法：
方法签名：	public void 
setOnSeekBarChangeListener (SeekBar.OnSeekBarChangeListener l)
描述：
|-  为当前SeekBar添加一个监听器。当SeekBar的值被改变、SeekBar被拖动时会触发相应的事件。
|-  SeekBar默认的最大值为100 ，可以通过setMax()方法修改最大值。

范例3：SeekBar.OnSeekBarChangeListener接口。
类型	static interface	所属包	android.widget
签名	public static interface SeekBar.OnSeekBarChangeListener
常用方法：
方法签名：	public abstract void 
onProgressChanged (SeekBar seekBar, int progress, boolean fromUser)
描述：
|-  当SeekBar的值被改变时，触发此方法。
参数：
|-  progress：SeekBar的当前值。  
|-  fromUser：当前事件是否由用户拖动或点击SeekBar而导致的。
|-  SeekBar的值改变有两种情况：
      |-  程序调用setProgress()方法 和 用户拖动或点击SeekBar。
方法签名：	public abstract void onStartTrackingTouch (SeekBar seekBar)
描述：
|-  当SeekBar被用户点击时，调用此方法。此方法只在用户按下SeekBar时调用一次。
方法签名：	public abstract void onStopTrackingTouch (SeekBar seekBar)
描述：
|-  当用户从SeekBar上抬起了手指后，调用此方法。此方法只会调用一次 。

### 滚动条 ###


## Notifications ##


## Styles and Themes ##

<br><br>