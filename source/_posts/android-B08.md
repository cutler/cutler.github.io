title: UI篇　第八章 自定义控件
date: 2015-2-5 18:59:50
create: 2015-4-29 11:41:12
categories: Android
---
　　Android平台提供了一套完备的、功能强大的组件化模型用于搭建用户界面，这套组件化模型以`View`和`ViewGroup`这两个基础布局类为基础。平台本身已预先实现了多种用于构建界面的`View`和`ViewGroup`子类，他们被分别称为部件（`widget`）和布局（`layout`）。

	-  部件(widget)分为：
	   -  常用部件：Button、TextView、EditText、ListView、CheckBox、RadioButton、Gallery、Spinner等。
	   -  专门用途的：AutoCompleteTextView、ImageSwitcher 和 TextSwitcher等。
	-  布局（layout）包括：LinearLayout、FrameLayout、RelativeLayout等。

<br>**自定义控件的四种方式**
　　如果上面那些`部件`和`布局`不能满足需求，您可以自定义一个`View`的子类。如果对已有的部件和布局进行小调整就能满足需求，可以通过继承某个已存在的部件或布局并重载特定方法的方式轻松实现。

　　为了使您对定制`View`的可控性有一个直观了解，下面给出就四种自定义`View`的方式：

	-  添加回调接口。
	   -  通过继承现有的View来实现自定义控件，在你自定义的View中添加若干回调接口。
	-  修改已有控件。
	   -  通过继承现有的View并重写它的onDraw()方法来修改该View的屏幕绘制方式（如继承EditText使之产生了带有下划线的记事本页面）。
	-  复合控件。
	   -  通过继承现有的layout来将一组View合成为一个新的独立组件。比如制作一个下拉列表框（弹出列表和输入框的组合）、双区域选择控制器（有左、右两个选择区域，选择框中的元素可随意切换其左右位置）等等。
	-  完全定制的组件。
	   -  通过继承View类来实现自定义控件。您可以将View定制成任意样式，比如一个使用2D图片渲染的音量调节器可以做成模拟电路控制的样子。

# 第一节 完全定制的组件 #
　　不论您对于视图组件的期望多么夸张，完全定制的组件都可以实现，包括实现一个看起来像旧模拟仪表盘的图形化紫外线辐照计，或者实现一个有着进度标记的长文本使之就像一台卡拉ok机的字幕。总之，这些特殊功能不可以通过已有组件实现，而且组合使用已有组件也不能满足需求。

　　幸运的是，您可以轻松构建一个样式、外观完全满足您需要的新组件，包括控制新组件在屏幕上`所占区域大小`等。创建一个完全定制的组件需要以下几步：

	-  第一，完全定制的组件通常继承自View类，所以搭建完全定制的组件的第一步通常是继承该类。
	-  第二，如果你想为你的控件添加自定义的属性，那么就需要重写父类的接收XML属性和参数的构造函数。
	-  第三，对形如“on...”的方法按需进行重写。比如，基本上都会重写：
	   -  系统在测量控件尺寸时会调用的的onMeasure()方法。
	   -  在控制组件的显示时会调用的onDraw()方法。
	-  第四，如果需要，你还可以为组件创建新的事件监听器、属性访问修改器以及更为复杂的行为 。

　　在上面的这四步中，第三步是难点，涉及的知识也最多，当然也是我们要重点介绍的部分。

## View ##
　　既然完全定制的组件的第一步就是继承`View`类，那么我们自然得先介绍一下它。

　　在Android中，`View`类是部件（`widget`）和布局（`layout`）的基类，它占据了屏幕上一个`矩形区域`，并负责绘制和处理事件。在`Activity`中所有的视图(`View`)都排列在一个树上，你可以从代码中添加视图，也可以通过在一个或多个`XML`布局文件中指定视图树来添加视图。


<br>**本章参考阅读：**
- [Android ActionBar使用介绍](http://blog.csdn.net/wangjinyu501/article/details/9360801)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(上)](http://blog.csdn.net/guolin_blog/article/details/18234477)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(下)](http://blog.csdn.net/guolin_blog/article/details/25466665)
- [How to center align the ActionBar title in Android?](http://stackoverflow.com/questions/12387345/how-to-center-align-the-actionbar-title-in-android)
- [Android-Action Bar使用方法-活动栏(一)](http://www.oschina.net/question/54100_34400)


<br><br>