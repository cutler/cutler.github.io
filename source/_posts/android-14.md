title: 第四章 应用程序资源
date: 2015-2-27 12:56:41
categories: Android
---

# 第一节 概述 #
　　你应该总是将你的资源从应用程序代码中分离出来（如图像和字符串），这样您就可以保持他们的独立。外部化资源后，您还可以提供替代资源（如依据不同的语言或屏幕尺寸），这变得越来越重要，因为越来越多的android设备提供不同的配置。为了提供不同配置的兼容性，您必须在项目的组织资源`res/`目录下，使用各种子目录组类型和配置资源。

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
　　你也应该根据特定的设备配置提供一些`可替代的资源`，并且把他们分组保存在指定的路径名下。运行时，Android可以根据当前的配置使用适当的资源。比如，你也许会根据不同的屏幕尺寸提供不同的UI布局或是不同的语言设定提供不同的字符串。
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
　　从这个例子中你可以看到，`res/`路径下包含了所有类型的资源：一个图片资源，两个布局资源和一个字符串资源文档。资源路径名非常重要，并在下表中做了具体描述。

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
		比如，一个字符串<string>元素创建了一个R.string资源，一个颜色<color>元素创建了一个R.color资源。
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
　　Android框架提供了两种动画系统：

	-  property animation（属性动画）：使用Animator类来表示一个属性动画，在Android3.0中提出。
	-  view animation（视图动画），而在视图动画框架中又包含两种动画：
	   -  tween animation（补间动画）：使用Animation类表示一个补间动画，补间动画会为控件指定一个变化的范围，让控件在这个范围内不断的变化。tween动画定义了四种操作：平移、渐变、缩放、旋转。
	   -  frame animation（帧动画）：使用AnimationDrawable类表示一个帧动画，它通过短时间内连续播放多张图片，来达到动画的效果，和电影类似。

<br>　　在Android中实现动画的方式有两种：
	-  通过XML文件。依据不同的动画，在res文件夹下面建立对应的文件夹用于存放动画文件。每个动画文件对应一个xml文件。
	-  通过编写代码。直接在代码中new出一个动画对象。

<br>**视图动画和属性动画特点**
<br>　　视图动画提供的功能，只针对动画View对象，所以如果你想动画非View对象，你要自己来实现。 
　　视图动画的缺点是：
	-  视图动画系统事实上只能暴露一个View对象几个方面的动画，如缩放和旋转视图，但没有背景颜色。
	-  视图动画不是会修改View本身。 虽然你的动画在屏幕上移动一个按钮后，从屏幕上来看按钮确实被移动到了新的位置，但按钮实际的位置不会改变，所以你要实现自己的逻辑来处理这个问题。

<br>　　属性动画中这些限制完全消除，你可以动画任何对象的任何属性（视图和非视图）和对象本身实际也是可以被修改。属性动画系统也更强大的方式进行了动画。在一个较高的水平，你分配要动画的属性，如颜色，位置或大小，可以定义方面，如插补和同步多个动画的动画。
　　属性动画的缺点是：
	-  在Android3.0中才被提出。

　　然而，视图动画系统，花费更少的时间设置，需要更少的代码。如果视图动画完成了你需要做的，或者你现有的代码已经完成了工作，那就没有必要使用属性动画系统。




<br><br>