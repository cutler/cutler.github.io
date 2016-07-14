---
title: "Cocos2dx篇　第三章 环境搭建"
date: 2014-12-10 21:52:05
comments: true
categories: 游戏开发
---
　　经过前两章的学习我们已经做好了充足的准备，那么接下来我们就开始吧。

# 第一节 基础概念 #
　　	为了全面掌握游戏开发，我们首先需要了解该引擎的几个基本概念。实际上这些基本概念是所有游戏开发所必须的，并非`Cocos2d-x`专有。任何游戏都是通过这些概念所针对的对象组建起来的，游戏的复杂程度决定了这些对象实现的复杂程度。

## 游戏组成 ##

### 导演（Diretor） ###
　　	一款游戏好比一部电影，只是游戏具有更强的交互性，不过它们的基本原理是一致的。所以在`Cocos2dx`中把统筹游戏大局的类抽象为导演（`Director`），`Director`是整个`Cocos2dx`引擎的核心，是整个游戏的导航仪，游戏中的一些常用操作就是由`Director`来控制的。
　　	导演（`Director`）常用的功能：

	-  OpenGL ES的初始化、游戏暂停继续的控制
	-  场景的转换、世界坐标和GL坐标之间的切换
	-  游戏数据的保存调用，屏幕尺寸的获取
	-  控制FPS的显示隐藏，窗口大小，游戏的进入，退出，获取当前正在运行的场景等等。

　　在整个游戏里面，一般只有一个导演，导演来指定游戏规则让游戏内的场景、布景和人物等可以有序的运行。

<br>　　我们假设一个只有两关的游戏，通常情况下，我们会返样设计整个游戏的流程（workflow）：

<center>
![游戏流程](/img/quick-cocos2d-x/quick_3_1.png)
</center>

　　显示完开场动画之后，接下来玩家的选择有多种，无论开始还是读取进度都会进入到游戏的预设关卡。游戏过程中第一关胜利则进入第二关，第二关胜利则进入结尾胜利画面（播放视频或者在背景图上显示文字），确认以后进入排名画面看看本次得了多少分。有一个统一的画面处理失败提示，确定后跳转到主画面重新开始。

　　从开场动画到菜单显示，再到各个关卡的切换，这一切的流程都是由导演来控制的。
<br>
### 场景（Scene） ###
　　从上面的描述中我们可以知道，玩家玩游戏的过程就是在我们预设的画面之间进行跳转，一个画面根据玩家操作的结果（选择菜单项、杀死或被敌人消灭）跳转到不同的画面。

　　这些构成整个游戏的流程的画面就是我们所说的场景（`Scene`）。显然不同的场景都提供不同的操作，大致可以分为以下几类场景：

	-  展示类场景：播放视频或简单的在图像上输出文字，来实现游戏的开场介绍、胜利、失败提示、帮助简介。
	-  选项类场景：主菜单、设置游戏参数等。
	-  游戏场景：这是游戏的主要内容，除了这个场景之外的其他类场景基本上都是通用架构实现的。
　　那么不同的场景是如何实现不同的功能的呢？每个场景都是通过不同的层（`Layer`）的叠加和组合协作来实现不同的功能的。因此，通常每个场景都是由一个或者几个层组成的。

　　通常，当我们需要完成一个场景时候，会创建一个`Scene`的子类，并在子类中实现我们需要的功能。比如，我们可以在子类的初始化中载入游戏资源，为场景添加层，启动音乐播放等等。
<br>
### 层（Layer） ###
　　每个游戏场景中都可以有很多层，每一层有各自的职责任务，例如专门负责显示背景，专门负责显示道具，专门负责显示任务角色等。层是我们写游戏的重点，我们大约`99%`以上的时间是在层上实现我们游戏内容。如下图所示，一个简单的主菜单画面是由3个层叠加实现的：

<center>
![](/img/quick-cocos2d-x/quick_3_2.png)
</center>

<br>　　本图描述的是`主菜单画面场景`中所包含的三个层：图像背景层、运动精灵层、菜单选项层。

　　细心的读者可能已经注意到，为了让不同的层可以组合产生统一的效果，这些层基本上都是透明或者半透明的（否则我们只能看到最上面的一个层了）。
　　层的叠加是有顺序的，如图所示：编号为1的图像背景层在最下面，2号中间，3号最上面，处于最上面的层内部的不透明的内容将覆盖下面层的内容。
　　这个次序同样用于编程模型中的事件响应机制。即编号3的层最先接收到系统事件（手指单击屏幕事件），然后是编号2，最后编号1。在事件的传递过程中，如果有一个层处理了该事件，则排在后面的层将不再接收到该事件。
　　在每一层上面可以放置不同的元素，包括文本（`Label`）、链接（`HTMLLabel`）、精灵（`Sprite`）、地图等等，其中，精灵是重点。
　　通过层与层之间的组合关系，我们可以很容易的控制和显示各种各样的界面了。

　　也许你会有疑问：**为什么不把文本、链接、精灵等直接放在场景里却放到层里？ **
　　事实上`Layer`是处理玩家事件响应的`Node`子类。与场景不同，层通常包含的是直接在屏幕上呈现的内容，并且可以接受用户的输入事件，包括触摸，加速度计和键盘输入等。我们需要在层中加入精灵，文本标签或者其他游戏元素，并设置游戏元素的属性，比如位置，方向和大小；设置游戏元素的动作等。通常，层中的对象功能类似，耦合较紧，与层中游戏内容相关的逻辑代码也编写在层中，在组织好层后，只需要把层按照顺序添加到场景中就可以显示出来了。

　　对于场景而言，通常我们添加的节点就是层。先添加的层会被置于后添加的层之下。如果需要为它们指定先后次序，可以使用不同的`zOrder`值。层可以包含任何Node作为子节点，包括`Sprites`，`Labels`，甚至其他的`Layer`对象。
<br>
### 精灵（Sprite） ###
　　精灵是整个游戏开发处理的主要对象，包括主角和敌人、`NPC`等，甚至随机飘过的一片云或飞鸟从技术上讲，也是精灵，因为精灵在`Cocos2dx`中，就是一个可以不断变化的图片，这些变化包括位置变化，旋转、放大缩小和运动等。
　　因此所谓游戏，本质上就是玩家操作一个或多个人工控制的精灵与一个或者若干个系统控制的敌方精灵进行互动：近身肉搏、远程射击、贴近对话等等。
　　`Cocos2dx`中的精灵和其他游戏引擎中的精灵相似，它可以移动，旋转，缩放，执行动画，并接受其他转换。

## 整体结构 ##
　　到此为止，我们已经大概了解了一个游戏的整体架构，不同的场景由不同的层组成，每个层又包括自己的精灵在层上运动。玩家玩游戏的过程就是在操作每个层上的精灵或者菜单选项，导致整个游戏在不同的场景中切换。
　　好了，有些OO编程基础的读者已经猜到导演（`Director`）对象的作用了。是的，按照面向对象的设计原则和反向依赖原则：精灵不应该依赖层、层不应该依赖场景、场景不应该依赖整个流程。导演对象是整个流程的代表，他负责游戏全过程的场景切换。

　　导演通常只有一个，因此这个对象是单例（`singleton`），`Cocos2d-x`框架已经预定义了该实例，我们直接使用就可以。
　　导演接受层/场景的要求，按照预先设计好的流程来终止、压栈、激活当前场景，引导下一个场景。至此，我们可以勾勒出一个游戏的整体框架和`Cocos2d-x`关键对象与之的对应关系：

<center>
![游戏整体结构](/img/quick-cocos2d-x/quick_3_3.jpg)
</center>

　　需要特别说明的是：任何时间只有一个`Scene`对象实例处于运行激活状态。该对象可以作为当前游戏内容的对象的整体包容对象。
　　以上就是一个游戏的主要整体对象架构。
　　实际上，针对每个游戏场景而言，不同场景（关卡）、每一个层（静态、动态）、每一个对象（敌人、我方、中立方）其实都很复杂。

　　万里长征，第一步吧。

**备注：**
　　笔者在此万分感谢新浪博主“知易”写的[“知易Cocco2D-iPhone开发教程”](http://blog.sina.com.cn/s/articlelist_1400679352_3_1.html)，前人为我们铺平了道路，在此向工作在前线的前辈们致敬。

<br>**本节参考阅读：**
- [基础概念介绍——导演、场景、层、精灵](http://cn.cocos2d-x.org/article/index?type=cocos2d-x&url=/doc/cocos-docs-master/manual/framework/native/v3/basic-concepts/zh.md)

## Cocos2d-x 3.0坐标系详解 ##
### 坐标系 ###
　　无论是搞`2D`(dimension，维)游戏还是`3D`游戏开发，最需要搞清楚的就是坐标系，这部分混乱的话就没啥奔头了。

　　在介绍坐标系之前，先介绍一下维度的概念。
　　维度，又称维数，是数学中独立参数的数目。在物理学和哲学的领域内，指独立的时空坐标的数目。

	-  0维是一点，没有长度。
	-  1维是线，它由n个连续点组成，线只有长度。如直线、曲线。
	-  2维是一个平面，它由n个连续的线组成，平面有长度和宽度，以及面积。如圆形、矩形。
	-  3维是2维加上高度，形成“体积面”。如圆柱、长方体。而常说的2D、3D游戏开发，就是指在二维游戏、三维游戏。

　　游戏在运行的时候会绘制各种游戏元素(精灵、层等)到屏幕上，这些元素在屏幕上的位置称为该元素的在屏幕中的坐标。  
　　在`2D`游戏中坐标由`x`和`y`两个值构成，它们分别代表`x`轴(水平方向)和`y`轴(垂直方向)相对于原点的偏移量。 如将一个精灵放在屏幕坐标`(10,10)`上，就是水平和垂直都偏移`10`个位置。如图所示：

<center>
![坐标轴](/img/quick-cocos2d-x/quick_3_4.png)
</center>

　　而在`3D`游戏中的坐标则是由三个值构成。

　　坐标系是数学或物理学用语，定义：对于一个`n`维系统，能够使每一个点和一组（n个）标量构成一一对应的系统。
　　在`Cocos2d`中存在四种坐标系（`屏幕坐标系`、`Cocos2dx坐标系`、`世界坐标系`、`本地坐标系`），它们各自有自己的特点，接下来将对他们依次介绍。
<br>
### 笛卡尔坐标系 ###
　　`Cocos2dx坐标系`和`OpenGL坐标系`相同，都是起源于`笛卡尔坐标系`。
　　笛卡尔坐标系中定义右手系原点在左下角，x向右，y向上，z向外，OpenGL坐标系为笛卡尔右手系。

<center>
![坐标轴](/img/quick-cocos2d-x/quick_3_5.png)
</center>

<br>**屏幕坐标系和Cocos2dx坐标系**
　　标准屏幕坐标系使用和`OpenGL`不同的坐标系，而`Cocos2dx`则使用和`OpenGL`相同的坐标系。
　　`iOS`，`Android`，`Windows Phone`等在开发普通应用时使用的是标准屏幕坐标系，即它们视屏幕左上角为原点，`x`向右为正方向，`y`向下为正方向。
　　而`Cocos2dx`坐标系和`OpenGL`坐标系一样，它们将屏幕左下角视为原点，`x`向右为正方向，`y`向上为正方向。

<center>
![屏幕坐标系和Cocos2d坐标系](/img/quick-cocos2d-x/quick_3_6.png)
</center>

　　在开发中，我们还经常会提到两个比较抽象的概念：`世界坐标系`和`本地坐标系`。这两个概念可以帮助我们更好的理解节点在`Cocos2dx`坐标系中的位置以及对应关系。

<br>**世界坐标系(World Coordinate)和本地坐标系（Node Local）**
　　`世界坐标系`也叫做`绝对坐标系`，是游戏开发中建立的概念。这里的`“世界”`指游戏世界。
　　`Cocos2dx`中的元素是有父子关系的层级结构，我们通过`Node`的`setPosition()`方法（关于Node类后面会详细介绍）设定元素的位置使用的是相对与其父节点的本地坐标系而非世界坐标系。最后在绘制屏幕的时候`Cocos2dx`会把这些元素的本地坐标映射成`世界坐标系坐标`。

　　`本地坐标系`也叫`相对坐标系`，是和节点相关联的坐标系。每个节点都有独立的坐标系，当节点移动或改变方向时，和该节点关联的坐标系将随之移动或改变方向。
　　Cocos2dx最终在屏幕中绘制元素时会把这些元素的`本地坐标映射成世界坐标系坐标`。

　　几乎所有的游戏引擎都会使用本地坐标系而非世界坐标系来指定元素的位置，这样做的好处是当计算物体运动的时候使用同一本地坐标系的元素可以作为一个子系统独立计算，最后再加上坐标系的运动即可，这是物理研究中常用的思路。例如一个在行驶的车厢内上下跳动的人，我们只需要在每帧绘制的时候计算他在车厢坐标系中的位置，然后加上车的位置就可以计算出人在世界坐标系中的位置，如果使用单一的世界坐标系，人的运动轨迹就变复杂了。
<br>
### 锚点 ###
　　通常我们习惯于只使用一个点来决定图片的位置的。选中了某个点后，图片的左上角就会被绘制到该点上。
　　比如，在App开发中向屏幕上绘制图片只需要提供三个参数即可： `图片对象`、`x坐标`、`y坐标`，然后图片的左上角就会被绘制到`x`和`y`的位置上。

　　但是在游戏开发中可能就会有更高的要求了，除了指定`position`（上面提到的`x`和`y`坐标）外，还需要指定一个锚点(`anchor point`)。
　　锚点用来指出`position`究竟是针对于图片的那个部位来说的。
　　比如，`g.drawImage(img,10,20,Gravity.LEFT|Gravity.TOP);`的作用就是在`(10,20)`这个地方画一个图片，而`Gravity.LEFT|Gravity.TOP`则表示，图片的左上角就会被画在`(10,20)`这个坐标上。
　　相应的，如果锚点是`Gravity.CENTER_HORIZONTAL|Gravity.CENTER_VERTICAL`，则表示图片的正中点就会被画在`(10，20)`这个坐标。

　　因此，一张图片的最终显示位置是由`position`和`锚点`来共同决定的。
　　锚点的范围是`[0,1]`，当设置`（0，0）`时是以左下角为锚点，当设置`（1，1）`时是以右上角角为锚点。 
　　锚点的概念存在于任何的`Node`对象中。

<br>**本节参考阅读：**
- [Cocos2d-x 3.0坐标系详解](http://cn.cocos2d-x.org/article/index?type=cocos2d-x&url=/doc/cocos-docs-master/manual/framework/native/v3/coordinate-system/zh.md)

# 第二节 Hello World #
　　本系列文章将以`quick-cocos2d-x 3.3 rc1`做为讲解的基础，下载地址：http://cn.cocos2d-x.org/download 。
　　`quick-cocos2d-x v3`是在`cocos2dx 3.x`的最新版本基础之上，移植了原来`quick-cocos2d-x`的核心框架、强大的player、丰富的示例等，并增加更多新的功能。

　　安装完毕后打开`quick-3.3rc1\README.html`就可以按照教程创建一个`HelloWorld`项目，但为了文章的完整性，本节会创建一个`HelloWorld`项目，并指出创建过程中可能出错的部分以供大家参考。

## 创建项目 ##
　　首先，运行`quick-cocos2d-x\player3.bat`文件来打开`quick`提供的`player`工具（即模拟器，它提供了创建、编译、模拟运行项目等功能）。
　　然后，点击“`新建项目`”，player会弹出如下界面：

<center>
![创建项目](/img/quick-cocos2d-x/quick_3_7.jpg)
</center>

　　其中：
　　“`Choose Project Location`”用来选择项目的保存目录。
　　“`Package name`”设置项目的唯一标识。
　　点击“`Create Project`”按钮后，`player`会在`Project Location`目录下，用包名的最后一级名称来创建一个文件夹，用来存放新项目。
　　等待项目创建完毕后，关闭掉对话框，点击“`Open Project`”即可在`player`中运行该项目。

　　这里笔者有一句忠告：`如果你是一个新手，那么在首次搭建一个陌生的开发环境时，最好使用它们推荐的默认设置`。 笔者第一次使用`quick3.3`时把“`Copy Source Files`”项给去掉勾选了，结果导致项目总是没法编译出`apk`，耗费了半天多的时间才找到原因。

## 编译项目 ##
　　若想让项目编译生成`apk`，则必须要先安装`Android SDK`和`Android NDK`。由于`Cocos2d-x 3.3`不支持`NDK r10`，我们需要下载`NDK r9d`用于编译。

　　[[ 点击下载 Android SDK ]](http://developer.android.com/sdk/index.html)
　　[[ 点击下载 NDK - http://dl.google.com/android/ndk/android-ndk-r9d-windows-x86_64.zip ]](http://dl.google.com/android/ndk/android-ndk-r9d-windows-x86_64.zip)

<br>　　下载完`SDK`和`NDK`后，将它们解压到指定目录，然后需要配置一下环境变量，以`Windows`为例，在系统设置里添加以下环境变量：

	-  ANDROID_NDK_ROOT=D:\Work\android-ndk-r9d
	-  ANDROID_SDK_ROOT=D:\Work\android-sdk
	-  ANDROID_HOME=%ANDROID_SDK_ROOT%

<br>**开始编译**
　　编译项目分两步：

	1、编译C++、lua代码。
	2、编译Android端的java代码。

　　首先，我们打开cmd窗口，将`helloworld\frameworks\runtime-src\proj.android\build_native.bat`拖入窗口中，执行编译（编译的是`C++`和`lua`代码）。
　　首次编译的过程会很慢（以后就会很快了），而且中途`cmd`窗口会打印出很多“`warning`”，我们直接忽视它们，只要最终编译没出错即可。

　　如果一切顺利，我们将看到输出信息的中有如下几行：
``` android
SharedLibrary  : libgame.so
Install        : libgame.so => libs/armeabi/libgame.so
```

<br>　　运行`build_native`只是编译了`C++`部分，而`Android`应用还存在`Java`代码，这时就需要`Eclipse ADT`来进行了。
　　现在`Android`的开发者网站上的`SDK`安装包里，已经不包含`Eclipse`了，而变成了`Google`推出的`Android`开发专用的`IDE`软件`Android Studio`。
　　但是不论`Android Studio`还是`Eclipse`，都可以对`Android`项目进行编译，而且它们的界面也很相似，`Eclipse`的开发者很容易上手`Android Studio`。
<br>　　启动`Eclipse`后，需要先导入`Cocos2d-x`的`Java`库：

	1、选择菜单File -> Import，再选择Android -> Existing Android Code Into Workspace
	2、点击Browse按钮，选择quick目录中的cocos/platform/android/java
	3、点击“Finish”完成操作。
　　接下来导入HelloWorld的`Android`工程：

	1、重复上述步骤，导入helloworld/frameworks/runtime-src/proj.android
	2、在HelloWorld工程上点击右键选择菜单“Properties”打开工程设置对话框
	3、从左侧选择Android，然后点击右侧“Add”按钮，将刚才导入的库添加进来（即一个名为java的项目）。
	4、在菜单栏中点击Project -> clean，完毕后即可运行。

## 项目结构 ##
　　为了更好的进行开发工作，下面来介绍一下HelloWorld项目的目录结构：
``` android
-  frameworks
   -  cocos2d-x
   -  runtime-src
      -  proj.android
-  res
-  runtime
   -  android
   -  win32
-  src
   -  app
   -  cocos
   -  framework
   -  config.lua
   -  main.lua
-  config.json
```
    语句解释：
	-  frameworks目录用来存放项目的C++、Java等源代码。
	   -  cocos2d-x目录存放Cocos2dx的源码。
	   -  runtime-src目录存放游戏的本地源码。
	      -  proj.android表示Android源码。这个目录刚才我们也用过了。
	      -  proj.ios_mac表示iOS和Mac源码。
	-  res目录用来存放游戏的所有资源。如：图片、音乐、字体、视频。
	-  runtime目录用来存放游戏编译后生成的可执行文件。
	   -  android子目录用来存放生成的apk文件。
	   -  win32用来存放生成的exe文件。
	-  src目录用来存放游戏的lua源代码。
	   -  app子目录用来存放我们编写的游戏的lua代码。
	   -  cocos子目录存放cocos-lua中的一些lua代码。
	   -  framework子目录存放quick针对cocos2dx进行封装的所有lua接口，我们后面章节中会重点学习它们。
	   -  config.lua用来存放整个游戏运行时都会使用到的常量。
	   -  main.lua是游戏在lua端的入口。以Android为例，游戏的真正入口其实是被标识为Home类型的一个Activity，然后经过一系列的调用，最终将会调用main.lua。
	-  config.json文件保存模拟器相关的参数。

　　我们可以任意修改`src/framework`的代码，但是并不推荐这么做，因为当我们一旦需要升级`quick`到新版本时，就得把这些修改也放到新版本的`framework`中。

　　更详细的介绍请参看：[Quick-Cocos2d-x文件结构分析](http://cn.cocos2d-x.org/article/index?type=quick_doc&url=/doc/cocos-docs-master/tutorial/framework/quick/quick-file-system/zh.md)

## 启动流程 ##
　　在此我们不打算关注当游戏被玩家启动后，程序在`Android`、`iOS`等端的启动流程是怎样的，而是会简单的介绍一下当游戏从它们那里（`Android`、`iOS`等端）执行到`Lua`端时，程序是如何运行的。另外这里只是一个简单的介绍，不明白也没有关系，后面的章节会详细介绍这里所涉及的知识。

　　在Lua端最先被调用的代码是“`main.lua`”文件。

<br>　　范例1：src/main.lua。
``` lua
function __G__TRACKBACK__(errorMessage)
    print("----------------------------------------")
    print("LUA ERROR: " .. tostring(errorMessage) .. "\n")
    print(debug.traceback("", 2))
    print("----------------------------------------")
end

-- 将src目录添加到搜索路径中去（在第二章 Lua 程序设计中已经详细介绍了package.path的作用）。
package.path = package.path .. ";src/"
cc.FileUtils:getInstance():setPopupNotify(false)

-- 首先，加载当前目录(即src)下的子目录app下的MyApp.lua文件。
-- 然后，通过MyApp.lua返回的引用来调用new()方法创建一个MyApp对象。
-- 最后，调用MyApp对象的run()方法。
require("app.MyApp").new():run()
```

<br>　　范例2：src/app/MyApp.lua。
``` lua
-- 下面的三行代码用来加载quick所必需要的库文件。
-- 如果没有特殊指明，那么require函数只会从src目录下开始查找。如：会从src/cocos目录下加载init.lua文件。
require("config")
require("cocos.init")
require("framework.init")

-- 创建一个MyApp类，并使其继承framework/cc/mvc/AppBase类。
local MyApp = class("MyApp", cc.mvc.AppBase)

-- MyApp类的构造方法，当调用MyApp.new()创建对象时会导致此方法被调用。
function MyApp:ctor()
    MyApp.super.ctor(self)
end

-- MyApp类的实例方法。
function MyApp:run()
    -- 游戏中会执行大量的加载图片、音乐、字体等操作。
    -- 下面这行代码告诉系统，当需要加载这些资源时，可以从项目根目录下的res目录中查找。
    cc.FileUtils:getInstance():addSearchPath("res/")
    -- 调用父类AppBase定义的函数，进入到指定的Scene中。
    self:enterScene("MainScene")
end

-- 返回MyApp类的引用。
return MyApp
```
　　在其他面向对象语言中，类是模版，对象是实例，我们不可以去直接使用类。
　　但请记住：`Lua`本身并不支持面向对象编程，它通过“`表`”来实现面向对象，难免会有一些和其他语言语法不同的地方。
　　比如，`MyApp`本质上也是一个对象(表)，只不过我们将其视为一个类。它和`Java`中的字节码对象(`Class`)是一样的，对象的创建是通过`MyApp`对象的`new()`方法完成的。

<br>　　通常一个类会单独写在一个`Lua`文件中，当`require`该文件后会需要接着调用该类的函数，因而都会在`Lua`文件的最后一行将该类的引用返回。

<br>　　游戏从`main.lua`进入的第一个类通常要继承`cc.mvc.AppBase`类，该类提供了一些控制游戏的方便函数。 当然这个继承并不是必须的，就像我们上厕所大便时，也不强制人一定要带纸，但谁又会不带纸呢。
　　`AppBase`类的对象会被全局保存着(使用一个名为`app`的变量)，因此你可以在任何`lua`文件中引用它。
　　默认情况下`enterScene()`函数会去“`app.senes`”目录下去查找，因此在本范例中就是查找“`app.scenes.MainScene`”。

<br>　　范例3：src/app/scenes/MainScene.lua。
``` lua
-- 定义一个MainScene类，并使它继承cc.Scene类
local MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)

-- 构造方法
function MainScene:ctor()
    -- 创建一个文本控件，内容为Hell World，并将它显示在屏幕的正中央。
    cc.ui.UILabel.new({
            UILabelType = 2, text = "Hello, World", size = 64})
        :align(display.CENTER, display.cx, display.cy)
        :addTo(self)
end

return MainScene
```
    语句解释：
	-  在Cocos2dx中场景使用cc.Scene类来表示，自定义的场景必须要继承该类。
	-  上面的display.newScene("MainScene")用来创建一个cc.Scene对象，关于该代码将在下一章详细介绍进行。
	-  为了方便代码管理，一个cc.Scene通常单独写在一个文件中，且使用local关键字修饰，而且在最后一行应该返回其自身的引用。
	-  cc.ui.UILabel是一个文本标签，用来显示文字，具体后述。
	-  默认情况下，元素的锚点是(0.5,0.5)，可以直接将元素添加到CCScene中。

<br>　　提示：Cocos2dx中，所有的场景、层、精灵都是`cc.Node`类的子类。

<br><br>





