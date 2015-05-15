title: 入门篇　第十一章 应用程序资源
date: 2015-1-18 12:56:41
create: 2015-2-27 12:56:41
categories: Android
---

# 第一节 概述 #
　　你应该总是将你的资源从应用程序代码中分离出来（如图像和字符串），这样您就可以保持他们的独立。外部化资源后，您还可以提供替代资源（如依据不同的语言或屏幕尺寸），这变得越来越重要，因为越来越多的android设备提供不同的配置。为了提供不同配置的兼容性，您必须在项目的资源目录`res/`下，使用各种子目录组类型和配置资源。

　　你可以为您的应用程序中任何类型的资源，指定一个默认和多个替代资源：

	-  当程序提供的所有资源都不符合当前设备配置时，会使用默认资源。
	-  替代资源是你为某个特定设备的配置设计的资源。 要为某个配置指定一组资源，需要在追在目录名前面加上特定的限定符。

<center>
![两个不同屏幕尺寸的设备，使用显示同一个布局时的效果](/img/android/android_4_1.png)
</center>


　　例如，您的默认的UI布局保存在`res/layout/`目录下，你还可以指定一个在屏幕处于横向时是使用的布局，它保存在`res/layout-land/`目录下。 当程序运行时，Android会依据当前设备的状态来自动使用适当的资源。

　　在上图所示的情况中，APK里只提供了一个针对小屏幕设备来设计的布局文件，因此当APK被安装在一个大屏幕设备中时，界面就显得很难看了。我们可以在APK中增加一个更大的屏幕替代布局资源，即提供两套布局文件，分别适用于不同尺寸的设备，如下图所示：

<center>
![APK在小屏幕设备上运行时显示左侧的布局，在大屏幕设备上则显示右侧的布局](/img/android/android_4_2.png)
</center>

# 第二节 提供资源 #
　　你应该总是化将你应用程序中的资源外部，比如`图片`、`字符串`等，这样有利于你独立处理这些资源。
　　你也应该根据特定的设备配置提供一些`可替代的资源`，并且把他们分别设备保存在指定的路径名下。运行时，Android可以根据当前的配置使用适当的资源。比如，你也许会根据不同的屏幕尺寸提供不同的UI布局或是不同的语言设定提供不同的字符串。
　　一旦你外部化了应用程序中的资源，你就能通过项目中的`R.class`生成的`ID`来调用他们（怎么使用你的资源将在下一节讨论）。本节将向你展示怎么样分类你Android项目中的资源，以及怎么样给特定的设备配置提供可替代的资源。

## 分组资源类型 ##
　　你应该把每一种类型的资源分别放在你的项目中`res/`中特定的子路径下。比如，下面是一个简单的项目中，文件分层的例子：
``` android
MyProject/
   src/
      MyActivity.java
   res/
      drawable/
         icon.png
      layout/
         main.xml
         info.xml
      values/
         strings.xml
```
　　从这个例子中你可以看到，`res/`路径下包含了：一个图片资源，两个布局资源和一个字符串资源文档。资源路径名非常重要，并在下表中做了具体描述。

<br>　　范例1：项目`res/`下的资源路径子目录。
``` android
目录名			资源类型
animator	存放XML格式的属性动画(property animations)。
anim		存放XML格式的补间动画(tween animations)。
		提示：属性动画也能保存在这个路径下，但animator/路径是专为属性动画准备的，用来区别这两种类型的动画。
color		存放XML格式的颜色状态列表。
drawable	存放位图(.png，.9.png，.jpg，.gif)或XML文件， 编译成以下绘图资源子类型：
		-  Bitmap Files（位图文件）
		-  Nine-Patches (re-sizable bitmaps，尺寸可变的位图)
		-  State Lists（状态列表）
		-  Shapes（形状）
		-  Animation Drawables
		-  Other Drawables
layout		存放XML格式的布局文件。
menu		存放XML格式的菜单，如选项菜单(Options Menu)，快捷菜单(Context Menu)和子菜单。
raw		存放任意的原始格式文件。
		如果你想调用原始的文件名和文件层级，你应该考虑把这些资源保存在assets/路径下(而不是res/raw/)。
		在assets/中的文件不会被赋予资源ID，你只能通过AssetManager类来读取它们。
values		存放XML格式的基本数值，如字符串、样式和颜色等。
		XML文件的根节点为<recources>，我们可以在根节点内部定义各种元素。
		比如，一个字符串<string>元素对应一个R.string资源，一个颜色<color>元素对应一个R.color资源。
		为清楚起见，你应该把不同的资源放在不同的文件中。例如，以下是一些你可以使用的每一种资源对应的常用文件名：
		-  arrays.xml 数组资源 (数组类型)
		-  colors.xml 颜色
		-  dimens.xml 尺寸
		-  strings.xml 字符串
		-  styles.xml 样式
xml		任意的XML文件，能在运行时被Resources.getXML()调用。各种XML的配置文件必需存放在此。
```

<br>　　所有保存在上表中提到的子路径下的资源都是你的`“默认”`资源。也就是说，这些资为你的应用程序定义了默认的设计和内容。但是不同类型的Android设备，可能会要求不同类型的资源。
　　例如，某个设备有一个比一般设备更大的屏幕，那你应该提供不同的布局资源来充分利用额外的屏幕空间。
　　又如，某个设备使用了一个不同的语言设置，那你应该提供一个可替代资源来翻译你的UI中的字符串资源。

## 提供备选资源 ##
　　几乎所有的应用都应该提供备选资源来支持特定的设备配置。比如，你应该为不同的屏幕密度提供备选的`drawable`资源，为不同的语言提供不备选的字符串资源。在运行时，Android将检测当前的设备配置，为你的应用加载适当的资源。

　　指定一系列特殊配置备选资源时，需要在`res/`路径下，以`“<resources_name>-<config_qualifier>”`的形式创建一个新的路径。

	-  <resources_name>就是默认资源的路径名（见上表）。
	-  <qualifier>是一个名字，指向了一个独立的配置，表示这个资源的用途(见下表）。
　　注意：当添加多个修饰语（`qualifier`）时，你必须把他们按下表中的名字顺序排列。如果修饰语的顺序不对，这个资源将被忽略。

<br>　　范例1：配置修饰名(仅列出常用修饰符，更详细的列表请参阅[ 官方文档 ](http://developer.android.com/guide/topics/resources/providing-resources.html))。
``` android
配置			修饰值				描述
语言和区域		en、fr、en-rUS等		语言由两个字母组成，后面可以跟着两个区域代码字母(前面加小写字母“r”)。
						这些代码不区分大小写，前缀“r”是用来区分区域代码的部分。你不能单独使用区域代码。
						在应用程序的运行生命周期中，用户可以更改了他的系统语言设定。
屏幕方向			port、land		port为竖屏 (垂直方向的)，land为横屏 (水平方向的)
屏幕像素密度		ldpi、mdpi、hdpi、xhdpi、nodpi、tvdpi
			-  ldpi: 低密度屏幕；约120dpi。
			-  mdpi: 中等密度（传统的HVGA）屏幕；约160dpi。 
			-  hdpi: 高密度屏幕；约240dpi。 
			-  xhdpi: 加高密度屏幕；约320dpi。在API level 8中加入。 
			-  nodpi: 这个可以用做位图资源，你不需要通过拉伸来匹配屏幕密度。 
			-  tvdpi: 屏幕在中等与高密度屏幕之间；约213dpi。这个不在首选的密度分组范围之内。这个主要是为电视和大部分不需要这个配置的应用准备的。对于很多应用，提供mdpi和hdpi资源都不能有效的匹配，系统会将它们拉伸到适合的大小。这个修饰语是在API level 13中加入的。 

平台版本			v3、v4、v7等。		设备所支持的API版本号。例如：
						v1指API level 1 (设备为 Android 1.0 或更高版本)。
						v4指API level 4 (设备为 Android 1.6 或更高版本)。
```

<br>　　关于屏幕像素密度有一点需要提示：

	-  在首选的密度中有一个3:4:6:8拉伸比例（不考虑tvdpi）。这意味着，一个在ldpi中显示为9x9大小的位图，在mdpi中会被放大为12x12，在hdpi中为18x18，在xhdpi中为24x24。 
	-  如果你认为你的图片在电视或其他一些设备中效果不会很好，并且想尝试tvdpi资源，那么拉伸系数为1.33*mdpi。例如：在mdpi中一个100px x 100px的图像，在tvdpi中将为133px x 133px.
	-  注意，使用一个密度修饰语并不表示这些资源只被用在指定的密度的屏幕中。如果你提供的可选资源和修饰语没有很好的匹配当前的设备配置，系统将会使用其中最好的那一个。


<br>　　注意：有些配置修饰语在`Android 1.0`时就被加入了，但并不是所有的Android版本都支持全部的修饰语。有些修饰语，隐藏的添加了版本号修饰语。例如：使用`w600dp`修饰语，将会自动添加`v13`修饰语，因为可用宽度修饰语在`API level 13`中被加入。

<br>**修饰语命名规则**
　　以下是一些关于使用配置修饰语命名的规则：

	-  你可以为单独的一系列资源指定多个修饰语，用“－”分隔。如：为美式英语、水平方向的设备指定drawable-en-rUS-land。
	-  修饰语必须按照上表中所列的顺序排序。如：
	   -  错误：drawable-hdpi-port/
	   -  正确：drawable-port-hdpi/
	-  可选资源的路径不能被嵌套。如，你不用这么使用res/drawable/drawable-en/
	-  修饰语不区分大小写。为了避免在大小写敏感的文件系统中出错，资源编译器在处理前会先将路径名全部转化会小写。名字中的任何大写字母只是为了有利于阅读。
	-  每一个修饰语类型中只有一个值被使用。例如，如果你想为西班牙和法国使用相同drawable，你不能这样命名路径drawable-rES-rFR/。而是，你应该使用两个资源路径，如drawable-rES/和drawable-rFR/，其中包含了恰当的内容。然而，你并不需要在两个路径中使用相同的文件。你可以为一个资源创建一个别名。具体后述。

<br>　　当你把资源保存在了这些以修饰语命名的路径中之后，Android自动的根据当前设备的配置来为你的应用提供合适的资源。
　　每一次需要调用一个资源时，Android将检查包含被要求资源的可选资源路径，然后找到最佳资源（在下文讨论）。如果没有与特定设备配置所匹配的可选资源，那么，Android将使用默认资源（默认资源是指一系列没有设置配置修饰语的资源类型）。

<br>**应用范例**
<br>　　范例1：文本国际化。
``` 
-  首先，在res目录下建立多个values文件夹，每个values文件夹对应一个国家或地区。各个文件夹的命名规范为：
   -  第一种：values
   -  第二种：values-语言代号
   -  第三种：values-语言代号-r国家或地区代号
-  接着，当程序运行的时候，Android系统会根据用户手机当前使用的语言，来调用对应文件夹中的xml文件。  
-  最后，Android系统根据手机当前语言查找xml文件时，匹配的原则为：
   -  首先，会找到与手机当前语言环境完全匹配的文件夹。即语言、地区完全匹配。
   -  然后，若没有地区匹配的，则查找语言匹配的文件夹。
   -  接着，若没有语言匹配的则找默认values文件夹。
   -  最后，若没有values文件夹，则显示：文本数据的资源ID的十进制表示形式。
-  提示：若找到了匹配的文件夹，但是文件夹中并没有xml文件，则同样视为失配，系统会继续匹配其他目录。
```

<br>　　在不同的文件夹中的`strings.xml`文件中使用不同的文字，就可以完成文本数据的国际化：

<center>
![](/img/android/android_4_3.png)
</center>

<br>　　范例2：图片国际化。
``` 
-  首先，在res目录下建立多个drawable文件夹，每个文件夹对应一个国家或地区。文件夹的命名规范为：
   -  第一种：drawable
   -  第二种：drawable-分辨率。如：drawable-hdpi 、drawable-mdpi、drawable-ldpi。
   -  第三种：drawable-语言代号
   -  第四种：drawable-语言代号-r国家或地区代号
   -  第五种：drawable-语言代号-r国家或地区代号-分辨率
-  程序运行的时候同样需要进行匹配，匹配原则：
   -  首先，找到国家、地区、分辨率都和当前用户手机匹配的文件夹。
   -  然后，若上面的不匹配，则会找到国家、地区都和当前用户手机匹配的文件夹。
   -  再然后，若上面的不匹配，则会找到国家和当前用户手机匹配的文件夹。
   -  还然后，若上面的不匹配，则会找到分辨率匹配的drawable文件夹。
   -  接着，若上面的不匹配，则会找到drawable文件夹。
   -  接着，若上面的不匹配，则会找到分辨率不匹配的drawable文件夹。
   -  最后，若仍找不到，则报错。
```

<br>　　示意图：

<center>
![](/img/android/android_4_4.png)
</center>

<br>　　屏幕适配是针对于布局文件来说的，在`layout`文件夹后加上分辨率，程序运行的时候，操作系统会根据屏幕尺寸自动选择相应的布局文件。

<br>　　范例3：布局文件。
``` 
-  首先，在res目录下建立多个layout文件夹，每个文件夹对应一个分辨率。文件夹的命名规范为：
   -  第一种：layout
   -  第二种：layout-高x宽   (提示：此处的x是英文字母x)
-  程序运行的时候同样需要进行匹配，匹配原则：
   -  首先，找到分辨率匹配的layout文件夹。
   -  然后，若失配，则找到layout文件夹。注意：不会去找分辨率不匹配的文件夹。
   -  最后，若失配，则报错。
```

<br>　　示意图：

<center>
![](/img/android/android_4_5.png)
</center>

## 为资源创建别名 ##
　　当你有一个资源，想为多个设备配置使用（但不想作为默认资源提供）时，你不需要把一个相同的资源放在多个可选资源路径下。而是，你可以（在某些情况下）创建一个可选资源作为某个资源的化名（`alias`，也称别名）保存在你的默认资源路径下。
　　注意：不是所有资源都提供了这样的机制，能够为另一个资源创建一个化名。比如动画`<animation>`，菜单`<menu>`，`res/raw`，以及其他在`res/xml`路径下的非特指的资源不提供这个功能。

<br>　　例如，假设你有一个图标`icon.png`需要在不同的地区中使用。然后在两个地区，英国和法国，需要使用相同的版本。你也许会认为你需要拷贝同一个图片资源到英国和法国两个资源路径下，但这是不对的。你可以把两个都使用到的图片资源保存为`icon_ca.png`（除了`icon.png`外的任何名字），并把他放在默认的`res/drawable/`路径下。然后在`res/drawable-en-rCA`和`res/drawable-fr-rCA`创建一个`icon.xml`文件，使用`<bitmap>`元素指向`icon_ca.png`资源。

<br>**绘图-Drawable**
　　使用`<bitmap>`元素为一个已存在的绘图文件创建一个化名。如：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/icon_ca" />
```
　　如果把这个文件保存为`icon.xml`（在可选资源路径下，如`res/drawable-en-rCA/`）,它将被编译成一个资源，你可以通过`R.drawable.icon`来引用，但它实际上是`R.drawable.icon_ca`的化名（被保存在`res/drawable/`）。

<br>**布局-Layout**
　　使用`<include>`元素为已存在的布局创建一个化名，包装在一个`<merge>`中 如：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<merge>
    <include layout="@layout/main_ltr"/>
</merge>
```
　　如果你把这个文件保存为`main.xml`，那它将被编译成一个资源，你可以通过`R.layout.main`来引用，但实际上他是`R.layout.main_ltr`这个资源的化名。
　　我们可以使用`<merge>`标签可以将多个布局合成一个更大的布局，具体用法请自行搜索。

<br>**字条串和其他基本值**
　　为一个已存在的字符串创建一个化名，简单的使用想要的字符串的资源ID作为一个新字符串的值。如：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="hello">Hello</string>
    <string name="hi">@string/hello</string>
</resources>
```
　　现在`R.string.hi`资源是`R.string.hello`的一个化名。

<br>　　其他的基本值使用方式相同。如，一个颜色值：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="yellow">#f00</color>
    <color name="highlight">@color/red</color>
</resources>
```

## 提供默认资源 ##
　　为了让你的应用程序支持多个设备配置，始终为你的应用中每一种资源都提供默认的资源是非常重要的。 
　　例如，如果你的应用程序支持多个语言，始终包括一个不含任何语言和区域修饰语的`values/`路径（其中保存了你用到的字符串）。如果你把所有的字符串都保存在带有语言和地区修饰语的路径下，那么如果一个设备设置了一个你的字符串不支持的语言和区域，你的应用程序将崩溃。但是，只要你提供了默认了的`values/`,那么你的应用将正常运行（即使是用户不懂这种语言，也好过于应用程序崩溃）。


## Android怎样寻找最佳匹配资源 ##
　　当你需要一个你提供的可选资源时，Android会根据当前的设备配置，在运行时来选择一个可选资源。为了展现Android怎么选择一个可选资源，假设下列绘图路径每一个都包含了不同版本的同一个图片：

	-  drawable/
	-  drawable-en/
	-  drawable-fr-rCA/
	-  drawable-en-port/
	-  drawable-en-notouch-12key/
	-  drawable-port-ldpi/
	-  drawable-port-notouch-12key/

　　并且假设以下设备配置：
	-  地区 = en-GB
	-  屏幕方向= port 
	-  屏幕像素密度= hdpi 
	-  触摸屏类型 = notouch 
	-  首选文本输入方法 = 12key

　　通过对比设备配置和可能的备选资源，Android从`drawable-en-port/`选择了`drawable`。 

　　随后，系统按照以下的逻辑来选择所要的资源：

	1、 排除与设备配置矛盾的资源文件。drawable-fr-rCA/这个路径被排除，因为他与en-GB这个地区矛盾。
	    注意：屏幕像素密度这个修饰语没有因矛盾而被排除。即使设备的屏幕密度是hdpi，但drawable-port-ldpi/没有被排除，因为这时，第一个屏幕密度都被认为是匹配的。
	2、 取（下一个）根据（上表）所列的优先级最高的修饰语。（从MCC开始，然后往下走。）
	3、 是否有哪一个路径包括这个修饰语？如果没有，返回第2步查找下一个修饰语。如果有，继续第4步。
	4、 排除不包含此修饰语的资源路径。在本例中排除了：drawable、drawable-port-ldpi/、drawable-port-notouch-12key/。
	5、 重复第2，3和4步，直到只有一个路径剩下。随后，在本例中没指定屏幕方向的路径被排除：drawable-en/、drawable-en-notouch-12key/。
	6、 最终剩下drawable-en-port/路径。

<br>　　虽然这个处理流程查找了每一个要求的资源，但系统在一些方面做出了进一步的优化。其中一个优化是，一但这个设备配置已知，它将排除那些永远不能匹配的可选资源。例如，如果配置语言为英语（`“en”`），那么任意一个设置了除英语以外的语言修饰语的资源路径将不会再包括在被检测的资源池中（但是，没有设置语言修饰语的路径还被包括在内）。 
　　当选择基于屏幕尺寸修饰语的资源时，如果没有更好的匹配资源，系统将会使用一个比当前屏幕更小的资源（如，在需要的情况下，一个大尺寸`<large-size>`屏幕将会使用一个普通尺寸`<normal-size>`的屏幕资源）。但是，如果只有一个比当前屏幕更大的可用资源，系统将不会使用他们，如果没有其他资源与设备配置匹配，你的应用程序将会崩溃（例如，所有的布局资源都标着`xlarger`这个修饰语，但设备是一个普通尺寸`<normal-size>`的屏幕）。

# 第三节 访问资源 #
　　一旦你在你的应用程序中提供了一个资源，你可以通过引用它的`资源ID`来调用它。所有在工程项目中`R.class`中定义的`资源ID`都是通过`aapt`自动生成的。
　　当你的应用程序被编译时，`aapt`生成了`R.class`，其中包含了`res/`路径下所有资源的`资源ID`。对于每种类型的资源，都有的一个`R`的子类与之对应（如：`R.drawable`对应绘图`<drawable>`资源），并且对于每一种资源类型，都有一个静态整型常量与之对应（如，`R.drawable.icon`）。这个整型常量就是可以被用来调用资源的资源ID。
　　虽然资源ID是在`R.class`中指定的，但你并不需要去那儿找资源ID。一个资源ID总是由以下部分组成：

	-  资源类型：每一个资源都是以某种“类型”分组的，如string、drawable、layout。
	-  资源名（依据不同的资源类型，会使用不同的名字）：
	   -  若资源只是一个基本类型值（如string），则资源名就是在XML中android:name属性的值。
	   -  否则资源名就是文件名，不包括其括展名。

<br>**两种访问方式：**
　　访问一个资源有两种方法：
	-  在代码中：使用一个R.class子类中的一个静态整型值。
	   -  如： R.string.hello，其中string是资源类型，hello是资源名。
	   -  当你提供一个这种格式的资源类型时，有很多的Android API可以访问你你的资源。
	-  在XML中：使用一个特殊的XML语法，对应R.class中定义的资源ID。
	   -  如： @string/hello。string是资源类型，hello是资源名。
	   -  你可以在XML中任意一个需要的地方使用这个语法。

## 在代码中访问资源 ##
<br>**语法**
　　这是在代码中引用一个资源的语法：
```
[<package_name>.]R.<resource_type>.<resource_name>
```
    语句解释：
    -  <package_name>是资源所在的包名（如果被引用的资源在你自己的包中，不需要指明）。
    -  <resource_type>是R的子类中资源的类型。
    -  <resource_name>是不包括扩展名的资源文件名或XML元素中android:name属性的值（基本类型）。

<br>**使用案例**
　　有很多种方法可以接受一个资源ID参数，你可以使用`Resources`中的方法来检索资源。你可以通过`Context.getResources()`来获得`Resources`的一个实例。
　　以下是在代码中访问资源的一些实例：
``` android 
// Load a background for the current screen from a drawable resource
getWindow().setBackgroundDrawableResource(R.drawable.my_background_image) ;
 
// Set the Activity title by getting a string from the Resources object, because
//  this method requires a CharSequence rather than a resource ID
getWindow().setTitle(getResources().getText(R.string.main_title));
 
// Load a custom layout for the current screen
setContentView(R.layout.main_screen);
 
// Set a slide in animation by getting an Animation from the Resources object
mFlipper.setInAnimation(AnimationUtils.loadAnimation(this, R.anim.hyperspace_in));
 
// Set the text on a TextView object using a resource ID
TextView msgTextView = (TextView) findViewById(R.id.msg);
msgTextView.setText(R.string.hello_message);
```

　　不要手动修改`R.java`文件——它是在项目被编译时由`aapt`生成的。任何的改变将在下一次编译时被重写。

## 通过XML访问资源 ##
　　你可以使用一个已存在的资源的引用来定义一些XML的属性和元素的值。当你创建布局文件时将会经常使用到这个方法为你的小部件提供字符串和图片。

　　例如，假如你有以下资源文件，包括了一个颜色资源和一个字符串资源：
``` xml
<resources>
   <color name="opaque_red">#f00</color>
   <string name="hello">Hello!</string>
</resources>
```
　　你可以在以下的布局文件中使用这些资源来设置文本颜色和文本字符串：
``` xml
<EditText xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:textColor="@color/opaque_red"
    android:text="@string/hello" />
```
　　在这个案例中，在资源引用时，你不需要指名包名，因为这些资源来自于你自己的包。引用一个系统资源，你需要包括一个包名。如：
``` xml
<EditText xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:textColor="@android:color/secondary_text_dark"
    android:text="@string/hello" />
```
　　注意：你应该始终都使用字符串资源，这样你的应用就可以依据设备的语言来进行动态的本地化。

<br>**引用样式属性**
　　引用一个样式属性本质上说的是，“在当前主题下，使用一个被这个属性所定义的样式。”
　　引用一个样式属性，其命名的语法几乎是与一般资源的格式相同，但是，使用一个问号`“?”`来替代`“@”`符号，并且资源类型部分是可选的。如：

	?[<package_name>:][<resource_type>/]<resource_name>

　　例如，下面展示了如何引用一个属性来设定文本颜色以匹配系统主题的文本颜色：
``` xml
<EditText id="text"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:textColor="?android:textColorSecondary"
    android:text="@string/hello_world" />
```
　　在这个小部件中，Android将使用`android:textColorSecondary`样式属性的值作为`android:textColor`的值。
　　编译工具知道，在这个环境下需要一个属性资源，因此并不需要明确指定其类型（即`?android:attr/textColorSecondary`），此处可省些`attr`。

# 第四节 资源类型 #
　　本节的每小节都描述了一类应用资源的用法，格式和语法。你可以把这些资源放在你的资源目录下（即`res/`)。

## Animation ##
　　动画相关的知识，请参阅[《媒体篇　第三章 动画》](http://cutler.github.io/2015/02/06/android-E03/)。

## Color State List ##
　　你可以在XML中定义`ColorStateList`对象，并且把它作一个`color`来使用的对象，这个对象会根据所使用它的View对象的状态改变颜色。
　　例如， 一个`Button`控件可以存在几种不同的状态（`press`按下、`focused`获得焦点、`selected`和`checked`选中），此时使用`ColorStateList`，就可以跟据每个状态提供不同的颜色值来显示。

　　您可以在一个XML文件中，把每种颜色定义在一个单独的`<selector>`标签内的`<item>`标记里面。
　　每个`<item>`可使用各种属性来描述其对应的状态，在每个状态变化时，状态列表将从上到下，找到第一个符合当前的状态将就会被用上。也就是说，并不是基于用`“最佳匹配”`的算法来选择的，而仅仅遇到第一个符合最低标准的就会被使用。
　　
<br>**语法：**
``` xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android" >
    <item
        android:color="hex_color"
        android:state_pressed=["true" | "false"]
        android:state_focused=["true" | "false"]
        android:state_selected=["true" | "false"]
        android:state_checkable=["true" | "false"]
        android:state_checked=["true" | "false"]
        android:state_enabled=["true" | "false"]
        android:state_window_focused=["true" | "false"] />
</selector>
```

<br>　　范例1：`my_color.xml`文件。此文件必须在`res/color`文件夹下建立。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
    -  View的每一个状态使用一个<item>标签来描述，标签常用的属性为color，表示颜色值，其值可以是资源id或者颜色常量。此属性必须被指定。
    -  本范例的含义为，当View获得焦点时，View的背景色将被设置为“0f0” ，被按下时，背景色将被设置为“f00”。

<br>　　匹配原则：

	-  当View的状态被改变时，系统会使用View当前的状态和此文件内所有的<item>匹配。
	   -  匹配的顺序：从上到下，从左到右依次匹配每一个<item>标签。
	   -  匹配的原则：
	      -  若View的当前状态与某个<item>标签匹配成功，则将View的背景色设置为该<item>标签指定的色值，并不会再继续匹配，直接返回。
	      -  若匹配失败，则继续匹配下一个<item>标签。
	      -  若直到最后都没有一个<item>匹配成功，则将为View设置黑色的背景。
	      -  若某个<item>标签没有指定任何具体的状态，则意味着该<item>可以和任何状态匹配，因此应该把没有指定状态的<item>标签放到文件的最后书写。

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


<br>　　范例3：属性介绍。
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

## Drawable ##
　　在Android中有`十一种`类型常用的图片资源，它们分别对应与不同的应用场景。这些类型的图片都是`可编辑`的，它们有一个共同的父类`Drawable`。
　　一个`Drawable`资源，就是能被画到屏幕的一个一般的图形概态。

### 位图资源 ###
　　Android开发中，应用程序所使用的图片资源仅支持三种格式的位图：`png`、`jpg`、`gif` (不可以使用`bmp`格式的图片)。
　　创建位图资源有两种方式：通过位图文件、通过`xml`文件（即为其创建一个资源id的别名）。

<br>
#### Bitmap File ####
　　位图文件：直接将`png`、`jpg`、`gif`格式的文件放到`res/drawable`目录下即可。图片的名称就是位图资源的ID，在程序中可以通过资源ID引用图片。

<br>　　范例1：当一个图片保存在`res/drawable/myimage.png` ,下面就是xml来使用此图到一个View上：
``` xml
<ImageView
    android:layout_height="wrap_content"
    android:layout_width="wrap_content"
    android:src="@drawable/myimage" />
```

　　下面的应用代码是将一个图片恢复为一个Drawable对象：
``` 
Resources res = getResources();
Drawable drawable = res.getDrawable(R.drawable.myimage);
```

<br>　　注意：在编译过程中`Bitmap`文件可能使用`aapt`工具优化为无损压缩图像，例如，一个不需要`256`色的真彩PNG图片可能转化为附有调色板的`8-bitPNG`图片。这会产生同等质量的图片，但只需要较少的内存。所以需要明白在此路径下的图片在编译中会改变。如果打算按`bit`流读取图片以转换成位图，把图片放在`res/raw/`文件夹，这不会被优化。

　　`Drawable`顾名思义就是可画的、可编辑的。而位图资源则可以通过`BitmapDrawable`类进行编辑。

<br>　　范例2：获取图像宽高。
``` android
public class AndroidTestActivity extends Activity {
    private ImageView img;
    private BitmapDrawable drawable;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
        this.img = (ImageView) this.findViewById(R.id.icon);
        this.drawable = (BitmapDrawable) this.img.getDrawable();
        // 取值范围：0 ~ 255 ，255为完全不透明。透明度取值范围：0 ~ 255 ，255为完全不透明。
        this.drawable.setAlpha(35); 
        System.out.println("width="+this.drawable.getBitmap().getWidth());
        System.out.println("height="+this.drawable.getBitmap().getHeight());
    }
}
```

<br>
#### XML Bitmap ####
　　XML Bitmap是定义在xml文件中的，指向一个位图的资源文件。这种作用对于原始的位图文件尤其有效。并且XML可以设定抖动，拼接等位图的附加属性。

<br>　　范例1：通过xml文件。本xml文件需要在`res/drawable`目录下建立，名为`bitmap.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<bitmap
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/a" />
```
    语句解释：
    -  在xml文件中使用<bitmap>标签来描述一个位图资源，xml文件名称就是图片的资源ID。
    -  其中<bitmap>标签必须包含src属性，该属性用来指出一个位图文件。
    -  通过xml文件方式创建位图资源，可以为指定位图文件做一些附加的修饰。
       -  如：指出图片的gravity、平铺模式以及是否启动图片抗锯齿等。

<br>　　范例2：引用位图资源。
``` xml
<ImageView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:src="@drawable/bitmap"
    android:id="@+id/icon"/>
```
    语句解释：
    -  引用xml文件和引用普通位图文件的方式是完全一样的。

<br>**语法：**
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
    -  android:antialia      布尔型，是否允许抗锯齿。
    -  android:dither        布尔型，如果位图与屏幕的像素配置不同时，是否允许抖动.（例如：一个位图的像素设置是 ARGB 8888，但屏幕的设置是RGB 565）。
    -  android:filter        布尔型。 是否允许对位图进行滤波。对位图进行收缩或者延展使用滤波可以获得平滑的外观效果。
    -  android:gravity       定义位图的gravity，如果位图小于其容器，使用gravity属性指明在容器的何处绘制该位图。

### Nine-Patch ###
　　`NinePatch`是一个标准的PNG图像，它是一个可以伸缩的位图图像，Android会自动调整大小来容纳显示的内容。一个例子就是NinePatch为背景，使用标准的Android按钮，按钮必须伸缩来容纳长度变化的字符。 NinePatch与传统PNG图像不同的是：

	-  它的四条边上包括额外的1个像素的边界。
	-  它的后缀名为“.9.png”。
	-  它需要被保持到工程的res/drawable目录中。
　　另外，若你是从`apk`解压后得到的`*.9.png`文件，则会发现它是已将周围的空白像素去掉了的，在使用时必须再加上。

<br>**NinePatch的边界：**
　　这个边界是用来确定图像的可伸缩和静态区域。你可以在`左边`和`上边`的线上画一个或多个黑色的1个像素`指出可伸缩的部分`，它的相对位置在可伸缩部分相同，所以大的部分总是很大的。
　　你还有可以在图像的`右边`和`下边`画一条可选的drawable区域（有效的，内边距线）。如果你的View对象设置NinePath为背景然后指定特殊的视图字体，它将自行伸缩使所有的文本来适应根据右线与底部线设计好的区域（如果有的话），当然内边距线不包括其中，Android可以使用左边的线与上面的线来定义一个drawable区域。

<br>
#### Nine-Patch File ####
　　你可以使用`tools\draw9patch.bat`工具来将普通的png图片修改为`*.9.png`的图片，该工具非常直观的展示了图片在上下或左右拉伸时的效果以及作为背景时其内容显示的位置。

　　虽然`.9.png`图片是在`.png`基础上制作出来的，但它在项目中的引用方式和`png`图片完全一样。

<br>　　范例1：有一个图片保存在`res/drawable/myninepatch.9.png`, 此布局XML应用到一个View。
``` xml
<Button
    android:layout_height="wrap_content"
    android:layout_width="wrap_content"
    android:background="@drawable/myninepatch" />
```

<br>
#### XML Nine-Patch ####
　　一个`XML Nine-Patch`是一个定义在XML中，指向一个`Nine-Patch`文件的资源，此XML能够设置图片的抖动。

<br>**语法：**
``` xml
<?xml version="1.0" encoding="utf-8"?>
<nine-patch
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@[package:]drawable/drawable_resource"
    android:dither=["true" | "false"] />
```
    属性解释
	-  xmlns:android      定义XML的命名空间，必须要有且值必须是“http://schemas.android.com/apk/res/android”。
	-  android:src        可绘制资源，必要的，指向一个Nine-Patch文件。
	-  android:dither     布尔型，如果位图与屏幕的像素配置不同时，是否允许抖动.（例如：一个位图的像素设置是 ARGB 8888，但屏幕的设置是RGB 565）。

　　提示：NinePatch图片使用`NinePatchDrawable`类来表示。

<br>
### Layer List ###
　　层列表(`layer-list`) 类型的图片资源是一个复合的图片资源，它可以将多张图片组合成一张图片。它类似于帧布局。

　　效果图：
<center>
![](/img/android/android_4_7.png)
</center>

　　`Layer-list`类型的图片资源通过xml文件来构建。

<br>**语法：**
``` xml
<?xml version="1.0" encoding="utf-8"?>
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

<br>　　范例1：`icon.xml`。本文件需要在`res/drawable`目录下建立。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/b" />
    <item android:drawable="@drawable/a" />
</layer-list>
```
    语句解释：
    -  使用<layer-list>标签创建一个Layer-list文件，<layer-list>标签必须为根节点。
    -  每一张图片使用一个<item>标签来描述，drawable属性表示图片资源。此属性必须被指定。
    -  多张图片组合时，先出现的<item>元素会被放在下面。如：在本范例中a图片会放在b的图片的上面。

<br>　　范例2：其他属性。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
	-  指出图片在ImageView所占据的空间的最小padding 。即图片距离ImageView某一边实际的padding必须大于等于指定的距离。
	-  若指定的padding超过了ImageView所占据的大小，则将缩小图片，以保证属性的值生效。
	-  在<item>标签内部可以使用<bitmap>等标签直接构造一张图片。<bitmap>标签的gravity属性可以取多个值，多个值间使用“|”间隔。 

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
<?xml version="1.0" encoding="utf-8"?>
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
``` android
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
        drawable.setDrawableByLayerId(R.id.content,rs.getDrawable(R.drawable.icon));
        // 将新的LayerDrawable对象赋值给ImageView。
        this.img.setImageDrawable(drawable);
    }
}
```
    语句解释：
    -  层列表类型的图片资源在程序运行的时候，其内的多张图片会被转成一幅图片。
    -  因此在动态更新图片时，需要重新创建一个新的LayerDrawable对象。

<br>　　范例5：实现如下效果。

<center>
![](/img/android/android_4_9.png)
</center>

　　代码为：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
      <bitmap android:src="@drawable/android_red"
        android:gravity="center" />
    </item>
    <item android:top="10dp" android:left="10dp">
      <bitmap android:src="@drawable/android_green"
        android:gravity="center" />
    </item>
    <item android:top="20dp" android:left="20dp">
      <bitmap android:src="@drawable/android_blue"
        android:gravity="center" />
    </item>
</layer-list>
```

<br>
### Level List ###
　　等级列表(`level-list`) 类型的图片资源，可以根据Drawable当前的等级，让View显示不同的背景图片。
　　有些时候，View的背景图片更新的时间是不确定的，仅仅通过View的状态的改变来更新View难以满足特殊的需求。此时可以使用等级列表。 
　　等级列表和状态列表类似，他们均是事先规定好View所能使用的背景图片。不同的是：
	-  状态列表：依赖于View的状态，图片的改变由用户的操作来决定。
	-  等级列表：依赖于一个“等级”，图片的改变由程序当前执行的情况来决定。

<br>　　范例1：`levle.xml`。本文件需要在`res/drawable`目录下建立。
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
    -  使用<level-list>标签描述一个等级列表，每一个<item>标签代表一张图片。<item>标签的drawable属性为必选。
    -  <level-list>标签对应于LevelListDrawable类。
    -  在本范例中，当<level-list>的当前等级x与某个<item>标签的minLevel和maxLevel属性满足关系：minLevel <=x<= maxLevel 时，该<item>标签所对应的图片将被使用当前LevelListDrawable作为背景图片的View使用。
    -  若某个<item>标签没有指定minLevel和maxLevel属性，则他们的默认取值都为0 。
    -  若有两个或以上的<item>标签同时匹配，则系统会选择最先扫描到的，选择之后就不再继续向下匹配。

<br>　　范例2：更改等级。
``` android
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
    -  若想在程序中动态的为LevelListDrawable添加等级，则可以使用LevelListDrawable类的addLevel方法。

<br>
### Transition Drawable ###
　　过渡(`transition`)类型的图片资源，其内包含有两张图片，它类似于动画，当用户做出特定的操作时，View的Drawable会从第一张图片慢慢的过渡为第二张图片。
　　事实上，这两张图片在Drawable中分别占据一个图层，第一张图片占据第一层，第二张图片占据第二层。第一层是最底层。

<br>　　范例1：`transition.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<transition xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/a" />
    <item android:drawable="@drawable/b" />
</transition>
```
    语句解释：
    -  使用<transition>标签描述一个过渡图片资源，每一个<item>标签代表一张图片。
       -  <item>标签的drawable属性为必选。
       -  <transition>标签对应于TransitionDrawable类。
    -  系统会默认显示第一张图片，若指定的<item>的个数大于2，则只有前两个<item>有效。
    -  系统从第一张图片过渡向第二张图片后，第二张图片会覆盖到第一张图片的上面，但是第一张图片并不会消失，因此实际应用中，通常第二张图片的尺寸会大于等于第一张图片的尺寸，以达到完全覆盖的目的。

<br>　　范例2：过渡图片。
``` android
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

<br>
### Clip Drawable ###
　　剪切(`clip`)类型的图片资源，它可以根据Drawable的当前等级，来显示图片的某一部分内容。等级的取值范围为：`0~10000`(0代表完全不显示图片，10000代表完全显示图片)。

<br>　　范例1：clip.xml。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<clip xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/login_input"
    android:clipOrientation="horizontal"
    android:gravity="left" />
```
    语句解释：
    -  使用<clip>标签描述一个剪切图片资源。 <clip>标签的drawable属性为必选。

    属性解释：
    -  clipOrientation 图片显示的方式，取值为：vertical(按照垂直方向显示)，horizontal(按照水平方向显示)。
    -  gravity 图片的起始方向，取值：left(从左向右)，bottom(从下向上)。

<br>　　范例2：设置等级。
``` android
public class AndroidTestActivity extends Activity {
    private ImageView img; // 图片。
    private ClipDrawable clip;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
        this.img = (ImageView) this.findViewById(R.id.img);
        this.clip = (ClipDrawable) this.img.getDrawable();
    }
    public void onClick(View view){ // 最初时,图片的等级为0,此时图片将完全不显示。
        clip.setLevel(clip.getLevel()+1000);
    }
}
```

<br>
### Shape Drawable ###
　　图形(`shape`)类型的图片资源，通过它可以画出一幅图片。使用`<shape>`标签描述一个shape图片资源。

<br>　　范例1：shape文件。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
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
<corners>标签：为形状创建圆角，只有当形状为矩形时才应用。
-  android:radius：尺寸数，所有的角的半径，作为一个尺寸值或尺寸资源，对于每个角会重写如下的属性：
-  android:topLeftRadius尺寸数，左上角的半径。每个角的角半径必须大于1，不然没有圆角。下面三个属性也是一样。
-  android:topRightRadius尺寸数，右上角的半径。
-  android:bottomLeftRadius尺寸数，左下角的半径。
-  android:bottomRightRadius尺寸数，右下角的半径。


<size>标签：指定形状的大小。
-  android:height：尺寸，形状的高，作为一个尺寸值或者尺寸资源。
-  android:width：尺寸，形状的宽，作为一个尺寸值或者尺寸资源。


<solid>标签：固定颜色填充形状。
-  android:color：颜色，用到形状上的颜色，作为一个十六进制值或颜色资源。


<stroke>标签：指出图形的边缘线的粗细、颜色、间隔等。
-  android:width：线的宽度(粗细)，单位：尺寸值或尺寸资源。
-  android:color：线的颜色，单位：十六进制值或者颜色资源。
-  android:dashGap：虚线与虚线之前的间隔距离，单位：尺寸值或尺寸资源。
-  android:dashWidth：每段虚线的长度，单位：尺寸值或尺寸资源。


<gradient>标签：可以设置图形内部的渐变色。
-  android:angle：整形，渐变的角度，度数，0度为从左到右，90度是从底到上，必须是45度的倍数，默认为0。
-  android:centerX：浮点型，距离渐变中心的X坐标的相对位置(0 - 1.0)。
-  android:centerY：浮点型，距离渐变中心的Y坐标的相对位置(0 - 1.0)。
-  android:gradientRadius：浮点型，渐变的半径，只有当android:type="radial"才使用
-  android:startColor：颜色，开始颜色，作为一个十六进制值或者颜色资源。
-  android:endColor：颜色，结束颜色，作为一个十六进制值或颜色资源。
-  android:centerColor：颜色，可选择开始到结束之间的颜色，作为一个十六进制值或颜色资源。
-  android:type：关键字，使用的渐变模式，有效值如下：
-  linear：线性渐变，默认选择。
-  radial：辐射渐变，开始颜色也是结束颜色。
-  sweep：卷曲线渐变。

```

<br>　　范例4：渐变色。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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

<br>　　值得注意的是，只有当`android:shape="ring"`时下面的属性才能使用：

	-  android:innerRadius：尺寸，内环半径（中间的孔），单位：尺寸值或尺寸资源。
	-  android:thickness：尺寸，环的厚度，单位：尺寸值或尺寸资源。
	-  android:thicknessRatio：浮点型，环的厚度比上环的宽度，例如，如果android:thicknessRatio="2"，厚度等于环的宽度的1/2，此值被android:innerRadius重写，默认为3.
	-  android:useLevel：布尔型，为"true"时，用于LevelListDrawable，正常情况设为"false",或者形状不出现。

<br>
### Inset Drawable ###
　　`InsetDrawable`用来将一个drawable嵌入到其内部，并且在内部留一些间距，这一点很像`padding`属性，表示它与容器之间的边距。当控件需要的背景比实际的边框小的时候比较适合使用`InsetDrawable`。

<br>　　范例1：语法。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<inset
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/drawable_resource"
    android:insetTop="dimension"
    android:insetRight="dimension"
    android:insetBottom="dimension"
    android:insetLeft="dimension" />
```

<br>　　范例2：案例。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/background"
    android:insetTop="10dp"
    android:insetLeft="10dp" />
```

<br>
### Scale Drawable ###
　　一个定义在XML中的可绘制对象，能够依据当前级别改变另一个可绘制对象的大小。

<br>　　范例1：语法。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<scale
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/drawable_resource"
    android:scaleGravity=["top" | "bottom" | "left" | "right" | "center_vertical" |
                          "fill_vertical" | "center_horizontal" | "fill_horizontal" |
                          "center" | "fill" | "clip_vertical" | "clip_horizontal"]
    android:scaleHeight="percentage"
    android:scaleWidth="percentage" />
```
    语句解释：
    -  scaleGravity属性，指定缩放后的gravity位置，取值必须是如下常量中一个或多个（以“|”分隔）。

<br>
### Rotate Drawable ###
　　`RotateDrawable`可以旋转其他Drawable对象，旋转的开始和结束角度可以通过属性控制。

<br>　　范例1：使用范例。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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


## Layout ##
　　布局(`layout`)的基本语法再次就不再重复介绍了，只介绍一些常用的标签。

<br>**< requestFocus >**
　　将屏幕的初始焦点设成其父元素，任何表示View类对象的元素都能包含这个内容为空的元素。但每个文件内只能出现一次本元素。

<br>**< include >**
　　将另一个布局（`layout`）文件包含到此标签所处的位置上。

　　属性：
	-  layout：Layout资源。必填项。引用布局资源。
	-  android:id：资源ID。覆盖包含进来的layout资源中的根view ID。
	-  android:layout_height：尺寸值或关键字。覆盖包含进来的layout资源中根view给出的高度。仅在同时给出android:layout_width时才生效。
	-  android:layout_width：尺寸值或关键字。覆盖包含进来的layout资源中根view给出的高度。仅在同时给出android:layout_height时才生效。

　　只要是被包含的`layout`资源根元素支持的属性，都能在`<include>`元素中包含进来，并且会覆盖本资源内根元素已定义的属性。

　　注意：如果要覆盖`layout`的长度和宽度，必须同时覆盖`android:layout_height`和`android:layout_width`——不能只覆盖长度或只覆盖宽度。如果只覆盖其中一个，则不会生效。而其他未覆盖的布局属性，比如`weight`，仍然继承自原有的`layout`。

　　包含`layout`资源的另一种方式是使用`ViewStub`。这是个轻量级的View，它在实际被填充之前不占用`layout`空间。在实际被填充时，它再把`android:layout`属性指定的`layout`资源文件动态包含进来。

<br>**< merge >**
　　在`layout`的层次结构图里并没画出这个可充当根的元素。当明确知道本`layout`会被放入某个父View中去时，可以用`<merge>`作为根元素来包裹其下的子元素。如果希望本`layout`能被其他`layout`用`<include>`包含进去，并不再另外生成`ViewGroup`容器，本元素也特别有用。

## String ##
　　字符串资源为应用程序提供可选样式和格式的文本字符串。应用程序可以使用三种类型的字符串资源：

	-  String：提供了一个字符串的XML资源。
	-  String Array：提供了一个字符串数组的资源。
	-  Quantity Strings (Plurals)：提供同一个单词或者词组不固定重复组成的字符串资源，所有的字符串都可以匹配某种标记样式和格式化参数。

<br>　　范例1：`res/values/strings.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
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
　　此例中存在两个占位符：`%1$s`是个字符串，`%2$d`是个数字，在应用程序中可以用如下方式用参数来格式化字符串：
``` android
Resources res = getResources();
String text = String.format(res.getString(R.string.welcome_messages), username, mailCount);
```

<br>　　范例5：用HTML标记来样式化。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
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
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <integer name="max_speed">75</integer>
    <integer name="min_speed">5</integer>
</resources>
```
　　程序代码获取：
``` android
Resources res = getResources();
int maxSpeed = res.getInteger(R.integer.max_speed);
```

<br>　　范例4：inteter数组数据(`res/values/integers.xml`)。
``` xml
 <?xml version="1.0" encoding="utf-8"?>
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
``` android
Resources res = getResources();
int[] bits = res.getIntArray(R.array.bits);
```

<br>　　范例5：TypeArray数据(`res/values/arrays.xml`)。
``` xml
<?xml version="1.0" encoding="utf-8"?>
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
``` android
Resources res = getResources();
TypedArray icons = res.obtainTypedArray(R.array.icons);
Drawable drawable = icons.getDrawable(0);
 
TypedArray colors = res.obtainTypedArray(R.array.colors);
int color = colors.getColor(0,0);
```
<br><br>