title: 媒体篇　第四章 视频
date: 2015-8-25 17:54:40
categories: android
---
　　笔者假设你对视频播放相关的知识一无所知，咱们从零开始。

# 第一节 概述 #

## 视频 ##
　　视频技术经历了`模拟视频`和`数字视频`两个阶段，我们接下来就简单的介绍一下它们。

<br>**模拟视频**

	模拟视频是指由连续的模拟信号组成的视频图像，以前所接触的电影、电视都是模拟信号，之所以将它们称为模拟信号，是因为它们模拟了表示声音、图像信息的物理量。

	摄像机是获取视频信号的来源，早期的摄像机以电子管作为光电转换器件，把外界的光信号转换为电信号。摄像机前的被拍摄物体的不同亮度对应于不同的亮度值，摄像机电子管中的电流会发生相应的变化。
	模拟信号就是利用这种电流的变化来表示或者模拟所拍摄的图像，记录下它们的光学特征（在录像带等介质上），然后通过调制和解调，将信号传输给接收机，通过电子枪显示在荧光屏上，还原成原来的光学图像。

	这就是电视广播的基本原理和过程。模拟信号的波形模拟着信息的变化，其特点是幅度连续(连续的含义是在某一取值范围内可以取无限多个数值)。其信号波形在时间上也是连续的，因此它又是连续信号。

　　模拟视频的特点：

	-  技术成熟、价格低、系统可靠性较高。
	-  不适宜长期存放，不适宜进行多次复制。随着时间的推移，录像带上的图像信号强度会逐渐衰减，造成图像质量下降、色彩失真等现象。

<br>**数字视频**

	数字视频是对模拟视频信号进行数字化后的产物，它是基于数字技术记录视频信息的。

	我们需要通过模拟/数字（A/D）转换器来将模拟视频转变为数字的“0”或“1”，这个转换过程就是视频捕捉(或采集过程)，然后再将转换后的信号采用数字压缩技术存入计算机磁盘中就成为数字视频。

　　数字视频的特点：

	-  数字视频可以无失真地进行无限次拷贝，而模拟视频信号每转录一次，就会有一次误差积累，会产生信号失真。
	-  即便是拷贝的次数不多，模拟视频在长时间存放后视频质量也会降低，而数字视频便于长时间的存放。
	-  可以对数字视频进行非线性编辑，并可增加特技效果等。
	-  原始的数字视频数据量大，在存储与传输的过程中必须进行压缩编码。

<br>**数字视频的压缩**
　　虽然数字视频有诸多优点，但是它的数据量非常大，`1分钟`的满屏的真彩色数字视频需要`1.5GB`的存储空间，这显然是无法接受的。因此和音频一样，我们需要对原始的数字视频进行压缩。

　　`问`：那么我们应该压缩视频里的哪些东西呢？
　　`答`：压缩视频中的那些人的视觉不能感受到的部分。

　　例如，世界上有成千上万种颜色，但是我们眼睛只能辨别大约`1024`种，因为我们觉察不到一种颜色与其邻近颜色的细微差别，所以也就没必要将每一种颜色都保留下来。
　　而且，视频信息的原始数据存在`帧内“空间相关”`和`相邻帧间“时间相关”`，使原始数据存在大量的数据冗余。

	-  同一帧内有大量区域所显示的内容是一样的，比如蓝天中只有少部分是云，其他都是天。
	-  对于相邻的两帧来说，一般情况下它们的相似度是很高的，只有少部分不同。
	   -  比如在一个60秒的视频作品中每帧图像中都有位于同一位置的同一把椅子，我们完全没必要在每帧图像中都保存这把椅子的数据。

<br>　　视频编码（压缩）标准主要是由`ITU-T`与`ISO／IEC`两大组织制定而成，其发展如下图所示：

<center>
![视频编码标准发展](/img/android/android_d04_01.png)
</center>

　　当然视频编码（压缩）标准不止上图所列的那些，还有诸如`WMV-HD`、`RealVideo`等。

<br>**H.264/MPEG-4 AVC**
　　`H.264/MPEG-4 AVC`（`Advanced Video Coding`，高级视频编码）是一种`视频压缩标准`。
　　`H.264`因其是蓝光盘的一种编解码标准而著名，所有蓝光盘播放器都必须能解码`H.264`。它也被广泛用于网络流媒体数据如`Vimeo`、`YouTube`以及`iTunes Store`，网络软件如`Adobe Flash Player`和`Microsoft Silverlight`，以及各种高清晰度电视陆地广播，线缆以及卫星。

<br>**视频格式**
　　常见的视频格式有`mp4`，`rmvb`，`mkv`，`avi`等，表示视频文件的封装格式，即容器。
　　所谓`容器`，就是把编码器生成的多媒体内容（视频，音频，字幕，章节信息等）混合封装在一起的标准，容器使得不同多媒体内容同步播放变得很简单。
　　容器的一个作用就是为多媒体内容提供索引，也就是说如果没有容器存在的话一部影片你只能从一开始看到最后，不能拖动进度条（当然这种情况下有的播放器会花比较长的时间临时创建索引），而且如果你不自己去手动另外载入音频的话，就没有声音。

<br>　　很显然，不同的容器会有不同的特性，比如`AVI`格式：

	-  优点：微软公司发表的视频格式，图像质量好，应用广泛。
	-  缺点：体积过于庞大，而且压缩标准不统一，比如高版本Windows媒体播放器播放不了采用早期编码编辑的AVI格式视频，反之也一样。所以经常会遇到视频没法播放，或者可以播放但只有声音没有图像的问题。

<br>　　但是视频之间的质量差距不是由视频格式来决定的，而是由`视频编码`和`音频编码`决定的，视频格式仅仅是一个容器而已。
　　比如说，两个后缀名都为`“.avi”`的视频，它们质量就可能不一样，因为`“.avi”`的视频本身既可以使用`H.264`编码也可以使用`WMV7`编码。下面列出了一个视频的简要参数信息：
``` c
视频编码：H.263
视频分辨率：720x480
视频帧率：60fps
音频编码：MP2，MP3，AC-3，AAC，AMR-NB
容器：MP4，FLV，3GP，MOV，MP4
```

<br>　　另外，如果你想了解视频编码之间、视频格式之间的具体区别，请自行搜索。

<br>**本节参考阅读：**
- [MBA智库百科 - 模拟视频](http://wiki.mbalib.com/wiki/%E6%A8%A1%E6%8B%9F%E8%A7%86%E9%A2%91)
- [MBA智库百科 - 数字视频](http://wiki.mbalib.com/wiki/%E6%95%B0%E5%AD%97%E8%A7%86%E9%A2%91)
- [百度百科 - 数字视频](http://baike.baidu.com/view/257435.htm)
- [维基百科 - 视频压缩](https://zh.wikipedia.org/wiki/%E8%A6%96%E8%A8%8A%E5%A3%93%E7%B8%AE)
- [维基百科 - H.264/MPEG-4 AVC](https://zh.wikipedia.org/wiki/H.264/MPEG-4_AVC)
- [视频格式与编码压缩标准 mpeg4，H.264.H.265 等有什么关系？](http://www.zhihu.com/question/20997688)

## 流媒体技术 ##
　　在多媒体发展的初期，音视频文件一般都较大，如果我们想要查看这些文件，就需要先把它们下载到电脑中，根据文件的大小以及网络的带宽，可能往往需要几分钟甚至几小时。
　　这种方式不但浪费下载时间、硬盘空间，重要的是使用起来非常不方便。
　　`流媒体技术`出现后，人们能够`“即点即看”`了，多媒体文件一边被下载一边被播放，极大地减少了用户在线等待的时间，而且也提升了互动性。

　　在流媒体技术中，音视频文件要采用相应的格式，不同格式的文件需要不同的播放器播放，所谓`“一把钥匙开一把锁”`。采用流媒体技术的音视频文件主要有三大`“流派”`：

	-  微软的ASF，这类文件的后缀是.asf和.wmv，与它对应的播放器是微软公司的 “Media Player”。
	-  RealNetworks公司的RealMedia，这类文件的后缀是.rm，文件对应的播放器是“RealPlayer”。
	-  苹果公司的QuickTime，这类文件扩展名通常是.mov，它所对应的播放器是“QuickTime”。

　　此外，`MPEG`、`AVI`、`DVI`、`SWF`等都是适用于流媒体技术的文件格式。

<br>**本节参考阅读：**
- [百度百科 - 流媒体技术](http://baike.baidu.com/link?url=0Z7BN9dkYwvm69UhTeBqRdt39P3eL3Ux2ZZIydX3YIn3JWYcluurnct_c3WT0F59)

# 第二节 Vitamio #
　　上一节中介绍了视频相关的理论知识，本节我们将使用`Vitamio`来实现`Android`平台的流媒体播放功能。
　　另外，由于笔者从事的是`Android`开发工作，因而暂时没去了解如何将普通视频转换成流媒体格式视频，这些由服务端的同事完成了，如果你对此有兴趣请自行学习。

## 简介 ##
　　`Vitamio`是一款`Android`与`iOS`平台上的全能多媒体开发框架，全面支持硬件解码与`GPU`渲染，我们可以用它来播放`720P`甚至`1080P`高清的视频。

<br>**流媒体支持**
　　`Vitamio`支持各种常见的流媒体协议，可以点播或者直播音频和视频，例如如下常见协议均能无缝支持：
``` c
MMS
RTSP (RTP, SDP), RTMP
HTTP progressive streaming
HLS - HTTP live streaming (M3U8)
```

<br>**音频和视频格式** 
　　`Vitamio`使用了`FFmpeg`做为媒体解析器和最主要的解码器，同时开发了针对不同移动平台的硬解码方案，能够完美支持`H.264/AVC`、`H.263`、`MPEG4`等常见的视频编码，覆盖上百种多媒体格式。下表只是一些最常见的视频格式支持，除特殊标明，全部支持硬件加速：
``` c
DivX/Xvid
WMV (一般只有软解码)
FLV
TS/TP
RMVB (只有软解码)
MKV
MOV
M4V
AVI
MP4
3GP
```

<br>　　更详细的信息请[ 点击阅读 ](https://www.vitamio.org/docs/Basic/2013/0429/3.html)

<br>**为什么选 Vitamio？**
　　首先，虽然`Android`已经内置了`VideoView`组件和`MediaPlayer`类来支持开发视频播放器，但支持格式、性能等各方面都十分有限，为了节省开发成本和周期，笔者决定使用第三方开源音视频库。

　　然后，虽然市面上有不少音视频开源库，但笔者从以下几个方面综合考虑后，认为`Vitamio`是最合适的：

	-  国内团队开发，且团队实力过硬遇到问题有能力处理。
	   -  国内团队离我们近，语言没有障碍、文档和Demo齐全。
	   -  公司团队成员100人左右，来自于暴风影音，酷六，新浪等，拥有多年的视频编解码经验以及业内一流的研发实力。
	-  迭代过多个版本，稳定且使用广泛。
	   -  公司在2011年8月成立一直到现在，从Github上就可以看到8个迭代版本。
	   -  目前酷6、CNTV、321影音、酷狗音乐、天天动听等App都使用了Vitamio库。

<br>**准备工作**
　　由于目前`Vitamio`官方没有提供`Android Studio`版本的库，所以我们只能自己手动来搭建环境了。
　　提示：如果你没用过`Android Studio`，请参阅[《实战篇　第四章 Android Studio》](http://cutler.github.io/android-O04/)。

<br>　　第一步，打开`Github`并下载的最新版本：[Android平台](https://github.com/yixia/VitamioBundle/releases) 和 [iOS平台](https://github.com/yixia/Vitamio-iOS/releases)，或者前往[ 中文官网 ](https://www.vitamio.org/Download/)下载，本文档使用的是`4.2.2`版本。
　　第二步，创建一个名为`VitamioTest`的新`Android Studio`项目。
　　第三步，依次点击`File -> New -> Import Module..`，并导入`VitamioBundle-4.2.2\vitamio`项目，名称为`:vitamio`。

　　第四步，不出意外的话，当导入任务执行完毕后你会看到如下一个错误：
``` c
Error:(7, 0) Could not find property 'ANDROID_BUILD_SDK_VERSION' on project ':vitamio'.
```
　　其实`Module`已经导入成功了，只是编译整个项目的时候出错了，解决的方法是：

	-  首先，进入到VitamioTest\app目录下面，打开build.gradle文件。
	-  然后，进入到VitamioTest\vitamio目录下面，也打开build.gradle文件。
	-  接着，使用app\build.gradle中的compileSdkVersion、buildToolsVersion、minSdkVersion、targetSdkVersion四个属性的值覆盖掉vitamio\build.gradle文件内的值。
	-  最后，重启Android Studio。

　　第五步，打开`app`的`build.gradle`文件，在里面加上`compile project(':vitamio')`来引用`Vitamio`。
　　第六步，修改完毕`build.gradle`文件后，都要点一下`Sync project with Gradle files`按钮。

　　第七步，点完按钮之后，也许你还会遇到下面这个错误：
``` c
Error:(7, 9) Attribute application@icon value=(@mipmap/ic_launcher) from AndroidManifest.xml:7:9
Error:(8, 9) Attribute application@label value=(@string/app_name) from AndroidManifest.xml:8:9
	is also present at VitamioTest:vitamio:unspecified:17:9 value=(Vitamio)
	Suggestion: add 'tools:replace="android:label"' to <application> element at AndroidManifest.xml:5:5 to override
Error:Execution failed for task ':app:processDebugManifest'.
> Manifest merger failed with multiple errors, see logs
```
　　这个错误大体的意思是：`app`和`vitamio`两个`Module`的清单文件的`<application>`标签的`icon`和`label`属性重复了。解决的方法就是把`vitamio`的`<application>`标签的所有属性都给删掉即可。

　　第八步，重新编译、运行这个项目，如果都很一切顺利，则证明咱们已经成功集成了`Vitamio`库了。

<br>**本节参考阅读：**
- [Vitamio - 帮助文档](https://www.vitamio.org/docs/)
- [Could not find property 'ANDROID_BUILD_SDK_VERSION'](http://stackoverflow.com/questions/21477884/importing-facebook-library-in-android-studio-could-not-find-property-android-b)

## 开始使用 ##
　　妈的，老子要玩个大的，等着吧！

<br>**本节参考阅读：**
- [随笔分类 - 5、Vitamio](http://www.cnblogs.com/over140/category/409230.html)

<br><br>
