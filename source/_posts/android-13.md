title: 第三章 用户界面 — Styles and Themes
date: 2015-2-4 17:58:50
categories: Android
---
　　`Styles`是用于指定`View`或`Window`的外观和格式的一系列属性的集合。比如指定高（`height`）、填补（`padding`）、字体颜色、字体大小、背景颜色等等属性。
　　Android中的`Styles`与网页设计中的`CSS`有着相似的原理——允许你将设计从内容中分离出来。在Android中可以像`CSS`那样，预先定义一些`Styles`，然后用这些`Styles`美画各种控件，这样做可以减少大量的重复代码。

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

<br>　　`Theme`是一个应用于整个Activity或整个App中的`style`，而不是某一个单独的View。当一个`style`被作为`theme`来应用时，Activity或应用中的每个View都会使用`style`的所有属性。 例如，你能把`CodeFont style`作为`theme`应用于一个Activity，那么这个Activity中所有文本都将是绿色等宽字体。

# 第一节 样式 #
　　若想创建`style`，则需保存一个XML文件到你的工程的`res/values/`目录下，这个XML文件的名称可以随便定义，但必须使用`.xml`作为后缀，且要保存在`res/values/`文件夹中。
　　这个XML文件的根节点必须是`<resources>`。
　　每个`style`都使用一个`<style>`元素来表示，该元素有一个用来唯一标识该`style`的`name`属性（这个属性是必需的）。 

　　在`style`元素内部可以添加多个属性，每个属性使用一个`<item>`元素表示，该元素也包含一个`name`属性（这个属性是必需的），以及一个使用的值。这个`<item>`的值可以是一个关键字符串、十六进制颜色、到另一个资源类型的引用或其他值，取决于`style`的属性。这里有一个单独`style`的例子：

<br>　　范例1-1：定义样式。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
    -  CodeFont就是样式的名称，它内部包含了4个属性。 当某个控件使用此样式时，实际上就是在使用样式内部的各属性的值。
    -  每个<resources>元素的子节点在编译时都被转换为一个应用程序资源对象，其可通过<style>元素的name属性的值来引用。

<br>　　范例1-2：定义样式2。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name=".20STYLE">
        <item name="android:textColor">#FF0000</item>
        <item name="android:text">20sp</item>
    </style>
</resources>
```
    语句解释：
    -  第5行代码的含义为：将控件的“android:text”属性的值设置为20sp。

<br>　　范例2：使用样式。
``` xml
<TextView
   	style="@style/.20STYLE"
 	android:layout_width="wrap_content"
 	android:layout_height="wrap_content"
 	android:text="周•杰伦\n崔•杰伦/>
```
    语句解释：
    -  使用控件的style属性可以为当前控件设置一个style。在本范例中TextView控件的字体的颜色为FF0000字体的大小为20sp。

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
<?xml version="1.0" encoding="utf-8"?>
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
    -  若在style和控件中同时对某个一个属性指定了值，则按照就近优先原则。这和CSS是一样的。本范例中，字体最终的颜色为绿色。

<br>　　范例5：属性继承2.0。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
    -  可以通过改变style名称的写法，来继承指定的style，命名规则为：父style名.当前style名。你可以像这样继续继承很多次，只要修改句点之前的名称。
    -  若指定的父style不存在，则会报错。范例1-2中的“.” 没有这种含义，它仅仅代表一个字符“.”。
    -  这种技巧仅适用于将你自己定义的资源链接起来。你不能用这种方式继承Android内建的style。要引用一个诸如TextAppearance的内建style，你必须使用parent属性。

<br>**一些提示：**

	1、如果你对一个View应用了style，而其并不支持此style中某些属性，那么此View将应用那些它支持的属性，并忽略那些不支持的。
	2、一些style属性只能被当作一个theme来应用，而不支持任何View元素。如用于隐藏应用标题(windowNoTitle)、隐藏状态栏或改变窗口背景(windowBackground)的style属性，它们不属于任何View对象。
	3、不要忘记对每个<item>元素中的属性冠以“android:”命名空间前缀。如：android:inputType。

# 第二节 主题 #
　　用于Activity或者整个应用程序的`style`我们称之为主题(`Theme`)。

　　有两种方式来设置style：
	-  对一个独立的View，则使用style属性。
	-  对一个Activity或整个应用，则需要在<activity>或<application>元素中使用android:theme属性。

<br>　　当你应用一个`style`到布局中一个单独的View上时，由此`style`定义的属性会仅应用于那个View。
　　如果一个`style`应用到一个`ViewGroup`上，那么子View元素并不会继承应用此`style`属性(只有你直接应用了`style`的元素才会应用其属性)。然而，你可以通过将它作为一个`theme`来应用到所有View元素上。

　　将一个style作为一个`theme`来应用，你必须在`Android manifest`中将其应用到一个`<activity>`或`<application>`中。
　　当你这样做，此Activity或应用中的每个View都将应用其所支持的属性。例如，如果你应用前面示例中的`CodeFont style`到一个Activity，那么支持此文本`style`属性的所有View元素都将应用它们。所有View所不支持的属性都会被忽略。如果一个View仅支持某些属性，那么它就只应用那些属性。

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


<br><br>