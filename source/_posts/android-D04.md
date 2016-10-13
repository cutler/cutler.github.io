title: 媒体篇　第四章 视频
date: 2015-8-25 17:54:40
categories: Android开发 - 青铜
---
　　笔者假设你对视频播放相关的知识一无所知，咱们从零开始。

# 第一节 概述 #

## 视频 ##
　　与音频一样，视频技术也经历了`模拟视频`和`数字视频`两个阶段，我们接下来就简单的介绍一下它们。

<br>**模拟视频**

	模拟视频是指由连续的模拟信号组合而成的视频图像，以前所接触的电影、电视都是模拟信号。

	摄像机是获取视频信号的来源，早期的摄像机以电子管作为光电转换器件，把外界的光信号转换为电信号。摄像机前的被拍摄物体的不同亮度对应于不同的亮度值，摄像机电子管中的电流会发生相应的变化。
	模拟信号就是利用这种电流的变化来表示或者模拟所拍摄的图像，记录下它们的光学特征（在录像带等介质上），然后通过调制和解调，将信号传输给接收机，通过电子枪显示在荧光屏上，还原成原来的光学图像。

　　模拟视频的特点：

	-  技术成熟、价格低、系统可靠性较高。
	-  不适宜长期存放，不适宜进行多次复制。随着时间的推移，录像带上的图像信号强度会逐渐衰减，造成图像质量下降、色彩失真等现象。

<br>**数字视频**

	数字视频是对模拟视频信号进行数字化后的产物，它是基于数字技术记录视频信息的。

	我们需要通过模拟/数字（A/D）转换器来将模拟视频转变为数字的“0”或“1”，这个转换过程就是视频捕捉（或采集过程），然后再将转换后的信号采用数字压缩技术存入计算机磁盘中就成为数字视频。

　　数字视频的特点：

	-  数字视频可以无失真地进行无限次拷贝，而模拟视频信号每转录一次，就会有一次误差积累，会产生信号失真。
	-  即便是拷贝的次数不多，模拟视频在长时间存放后视频质量也会降低，而数字视频便于长时间的存放。
	-  可以对数字视频进行非线性编辑，并可增加特技效果等。
	-  原始的数字视频数据量大，在存储与传输的过程中必须进行压缩编码。

<br>**数字视频的压缩**
　　虽然数字视频有诸多优点，但是它的数据量非常大，原始的`1分钟`的满屏的真彩色数字视频需要`1.5GB`的存储空间，这显然是无法接受的。因此和音频一样，我们需要对原始的数字视频进行压缩。

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

　　流媒体技术涉及的范围非常广，在线播放视频、现场直播等都是对它的应用，本章暂时只介绍如何播放在线视频。

　　另外，采用流媒体技术的音视频文件主要有三大“流派”：

	-  微软的ASF，这类文件的后缀是.asf和.wmv，与它对应的播放器是微软公司的 “Media Player”。
	-  RealNetworks公司的RealMedia，这类文件的后缀是.rm，文件对应的播放器是“RealPlayer”。
	-  苹果公司的QuickTime，这类文件扩展名通常是.mov，它所对应的播放器是“QuickTime”。

　　此外，`MPEG`、`AVI`、`DVI`、`SWF`等都是适用于流媒体技术的文件格式。

<br>**本节参考阅读：**
- [百度百科 - 流媒体技术](http://baike.baidu.com/link?url=0Z7BN9dkYwvm69UhTeBqRdt39P3eL3Ux2ZZIydX3YIn3JWYcluurnct_c3WT0F59)

# 第二节 播放在线视频 #

　　上一节中介绍了视频相关的理论知识，本节我们将实现`Android`平台的流媒体播放功能。

## 选择框架 ##
　　总的来说，在目前版本的`Android`系统中，我们有两种方式来播放流媒体视频：

	-  第一种，使用系统自带的API。
	-  第二种，使用Github等地方的开源库。

　　两种方式各有优点，并不是说开源库就一定比系统内置的`API`要好，我们得依据自己的需求来做出决定。笔者接下来详细介绍这两种方式的优缺点，并为您做出明智的选择提出睿智的建议。

<br>**系统自带的API**
　　使用系统自带的API来播放视频，又可以分为两种方式：

	-  第一种：MediaPlayer + SurfaceView。
	   -  优点：功能强大、可以更灵活的对其进行自定义。
	   -  缺点：使用的难度比较大，需要做很多的操作才能顺利播放出视频。
	-  第二种：VideoView。
	   -  它继承自SurfaceView类，且其内部包含了一个MediaPlayer属性，简单的说就是对上面的方法进行进一步封装。
	   -  优点：方便使用。
	   -  缺点：封装就意味着规矩多，所以它的灵活性就降低了，不过对于大多数场景来说，使用VideoView是最优的选择。

　　不过上面两种有一个共有的缺点，就是它们支持的流媒体协议、格式比较少，如果你需要播放的流媒体比较特殊，那么就选择使用开源库吧，系统内置的API并不适合。

　　如果你想查看`Android`支持哪些媒体的格式，请阅读：[《Supported Media Formats》](https://developer.android.com/intl/zh-cn/guide/appendix/media-formats.html)。

<br>**mp4格式**
　　由于`Android`手机默认支持`mp4`编码和解码，所以通常我们会采用`mp4`格式作为视频的存储格式。

　　下面这两段文字摘抄自[《Android视频播放之边缓存边播放》](http://blog.zhourunsheng.com/2012/05/android%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B9%8B%E8%BE%B9%E7%BC%93%E5%AD%98%E8%BE%B9%E6%92%AD%E6%94%BE/)：

	-  其实最真实的流媒体协议传输格式并不是普通的http方式，而是rtsp，那样的话得搭建专门的流媒体服务器，成本比较高，采用普通的http方式，实现的是一种伪流媒体传输，但是对于常用的视频缓存播放也足够了。

	-  要想实现视频的边缓存边播放，原则上就要求视频的存储格式是分段的，而mp4正好满足这个要求。只要将mp4的整体视频信息放在mp4文件的开头，这样只要加载了mp4文件的头部之后，就能解析出该mp4文件的时长，比特率等等，为后续的视频缓存做初始化设置，然后每加载一段mp4文件的数据流，通过解析头部来或得当前视频流的帧信息，并在播放器中播放，这样就能先加载一段进行播放，同时缓存后续的一段，依此原理就能实现。

<br>**Vitamio**
　　[ Vitamio ](https://github.com/yixia/VitamioBundle)是一款`Android`与`iOS`平台上的全能多媒体开发框架，全面支持硬件解码与`GPU`渲染，我们可以用它来播放`720P`甚至`1080P`高清的视频。

　　`Vitamio`支持各种常见的流媒体协议，可以点播或者直播音频和视频，例如如下常见协议均能无缝支持：
``` c
MMS
RTSP (RTP, SDP), RTMP
HTTP progressive streaming
HLS - HTTP live streaming (M3U8)
```

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
　　更多关于`Vitamio`的介绍，请点击查看：[官方网站](https://www.vitamio.org/)

<br>　　虽然如此，但是经过笔者的调研，发现`Vitamio`有如下三个缺点：

	-  第一，Vitamio for Android已经被标记为DEPRECATED了，即开发团队已经不维护它了。
	-  第二，Vitamio 对个人开发者免费，对公司收费。但是笔者是给公司干活，所以如果使用的它的话就得交钱。
	-  第三，Vitamio for Android播放视频时，视频缓冲的很慢，并且它的Android代码写的很差，没有合理的架构不利于扩展。

　　由于它存在这三个致命的缺点，所以笔者决定不使用它，也许以前它很火，但廉颇已老！

　　也许你会说“我哥们公司就用的它，人家用的好好的呢”，但是`Vitamio`对笔者来说并不友好，所以笔者不想用它。

<br>**ijkPlayer**
　　`Android`内置的`API`不能多路播放，而且实时流媒体延迟过高，因此如果你对流媒体的要求过高，则就无法使用它们了。

　　当今，业内一般都使用`bilibili`开源出来的[ IJKPlayer ](https://github.com/Bilibili/ijkplayer)，像斗鱼TV之类的都是自己基于`IJKPlayer`改造的，技术方案比较成熟，稳定性方面比较可靠，使用起来也很简单，项目的编译脚本做的比较简单、灵活。

	-  优点：
	   -  支持多种流媒体协议、文件压缩编码，功能强大的同时也可以依据自己的需求定制，灵活性高。
	   -  在Github上开源已久，项目成熟，各路大牛一起维护，为你采坑！
	   -  免费。
	-  缺点：
	   -  生成的安装包略大。笔者运行官方的Demo，在一切保持默认的情况下，打出来的apk有6M多。

<br>　　稍后笔者会介绍一下自己在编译`ijkPlayer`时候所遇到的坑，节省您的时间。
　　
<br>**本节参考阅读：**
- [HLS直播技术方案及踩过的坑](http://www.koulianbing.com/?p=97)

## 推荐阅读 ##
　　如果您打算使用`MediaPlayer + SurfaceView`的方式来播放视频，笔者推荐你阅读：[《承香墨影-MediaPlayer》](http://www.cnblogs.com/plokmju/tag/MediaPlayer/)，作者通过三篇博文来介绍`MediaPlayer`的各种特性，很赞。

　　如果您打算`VideoView`的方式来播放视频，笔者推荐你阅读：[《承香墨影-使用VideoView播放视频》](http://www.cnblogs.com/plokmju/p/android_VideoView.html)，同样高品质，并在文章的末尾附有`Demo`。

　　由于笔者只需要简单的播放一下`mp4`格式的流媒体视频，因此通过上面的一番比较，最终决定使用`VideoView`来实现，当然笔者会对`VideoView`进行一些封装，[ 查看源码 ](https://github.com/cutler/AndroidTemplate)。

## ijkplayer ##
　　刚才说到了`ijkPlayer`，本节就来简单的说一下`Mac`上编译的流程，由于`ijkPlayer`的版本会不断更新，因此请以[ 官方教程 ](https://github.com/Bilibili/ijkplayer)为准。　

<br>　　第一步，安装`git`，如果你没有安装过，请自行搜索，很简单。
　　第二步，配置`git`，即让`git`和你的`Github`帐号关联起来，[《Mac下的配置教程》](https://help.github.com/articles/generating-ssh-keys/#platform-mac)。
　　第三步，安装[ NDK r10e ](http://developer.android.com/intl/zh-cn/tools/sdk/ndk/index.html)、[Android SDK and Android Studio](https://developer.android.com/intl/zh-cn/sdk/index.html)，如果你有的话就跳过。
　　　　　　如果你没法翻墙可以去[ Android Studio 中文组 ](http://android-studio.org/index.php)。
　　　　　　由于红杏近期被封了，如果你想访问`Google`的话，可以使用[ huhamhire-hosts ](https://github.com/huhamhire/huhamhire-hosts/releases)。
<br>　　第四步，解压`NDK`。先把文件移动到你的工作目录，然后使用如下代码解压：
``` c
ndk$ chmod a+x android-ndk-r10c-darwin-x86_64.bin
ndk$ ./android-ndk-r10c-darwin-x86_64.bin
```
<br>　　第五步，配置`NDK`和`SDK`的路径，即创建下面两个环境变量：
``` c
cd ~
open .bash_profile
```
　　然后在窗口中加上类似如下的代码：
``` c
export ANDROID_NDK=/Users/cutler/Programer/ProgramFiles/android/android-ndk-r10e
export ANDROID_SDK=/Users/cutler/Programer/ProgramFiles/android/android-sdk-macosx
```
　　需要注意的是，修改完`.bash_profile`文件之后，我们需要重启终端窗口才能生效。


<br>　　第六步，使用下面的代码来下载最新版的代码：
``` c
git clone https://github.com/Bilibili/ijkplayer.git ijkplayer-android
cd ijkplayer-android
git checkout -B latest k0.3.2.2
```
　　笔者此时能看到的最新版就是`k0.3.2.2`，您在执行之前请去官网查看一下最新版的版本号。

<br>　　第七步，依次使用如下代码来初始化、编译`ijkPlayer`，要一条条执行，别一口气都执行了：
``` sh
cd ijkplayer-android
#下面这条语句会自动下载 ffmpeg 和 android-libyuv 依赖包。
#其中由于 ffmpeg 仓库在国外，故需要等待较长时间，本人以 15KB/s 的速度下载了两个多小时。
./init-android.sh

cd android/contrib
./compile-ffmpeg.sh clean
./compile-ffmpeg.sh all

cd ..
./compile-ijk.sh all
```

<br>　　第八步，将`android/ijkplayer`导入到`Android Studio`中，并在项目的根`build.gradle`文件中添加如下代码：
``` c
ext {
    compileSdkVersion = 22       // depending on your sdk version
    buildToolsVersion = "22.0.1" // depending on your build tools version
}
```
　　注意：`compileSdkVersion`和`22`之间是用`=`号相连的，而不是空格，笔者在这卡了很久。

<br>　　最后，就是编译运行项目了，如果你本地没有`platform-22`，那么可以使用`SDK Manager`下载，如果你没法翻墙，那么可以给`SDK Manager`配置如下代理：
``` c
代理服务器：mirrors.neusoft.edu.cn
端口：80
```

<br>　　提示：

	由于笔者从事的是Android开发工作，因而暂时没去了解如何将普通视频转换成流媒体格式视频，这些由服务端的同事完成了，如果你对此有兴趣请自行学习。


<br><br>
