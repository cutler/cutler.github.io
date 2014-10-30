---
layout: post
title: "第一章 概述"
date: 2014-08-26 22:16:54 +0800
comments: true
categories: quick-cocos2d-x
tags:
- quick-cocos2d-x
---
# 第一节 游戏引擎 #
## 起源 ##
　　在游戏发展的初期，游戏开发者关心的只是如何尽量多地开发出新的游戏并把它们推销给玩家。尽管那时的游戏大多简单粗糙，但每款游戏的平均开发周期也要达到8到10个月以上，这一方面是由于技术的原因，另一方面则是因为几乎每款游戏都要从头编写代码，造成了大量的重复劳动。渐渐地，一些有经验的开发者摸索出了一条偷懒的方法，他们借用上一款类似题材的游戏中的部分代码作为新游戏的基本框架，以节省开发时间和开发费用。根据马老先生的生产力学说，单位产品的成本因生产力水平的提高而降低，自动化程度较高的手工业者最终将把那些生产力低下的手工业者淘汰出局，引擎的概念就是在这种机器化作业的背景下诞生的。 <br><!-- more -->
　　**游戏引擎是指一些已编写好的，并可继续向上编辑的游戏系统或者一些交互式实时图像应用程序的核心组件。这些系统为游戏设计者提供各种编写游戏所需的各种工具，其目的在于让游戏设计者能容易和快速地做出游戏程式而不用由零开始。**<br>
　　我们可以把游戏的引擎比作赛车的引擎，大家知道，引擎是赛车的心脏，决定着赛车的性能和稳定性，赛车的速度、操纵感这些直接与车手相关的指标都是建立在引擎的基础上的。游戏也是如此，玩家所体验到的剧情、关卡、美工、音乐、操作等内容都是由游戏的引擎直接控制的，它扮演着中场发动机的角色，把游戏中的所有元素捆绑在一起，在后台指挥它们同时、有序地工作。简单地说，引擎就是“用于控制所有游戏功能的主程序，从计算碰撞、物理系统和物体的相对位置，到接受玩家的输入，以及按照正确的音量输出声音等等。”
因此游戏引擎相当于游戏的框架，框架打好后，关卡设计师、建模师、动画师只要往里填充内容就可以了。列一个公式就是：游戏=引擎（程序代码）+资源（图象，声音，动画等）。<br>
　　不论在是桌面游戏中还是3D游戏中，引擎的制作往往会占用非常多的时间，《马科斯•佩恩》的MAX-FX引擎从最初的雏形FinalReality到最终的成品共花了四年多时间，LithTech引擎的开发共花了整整五年时间，耗资700万美元，Monolith公司（LithTech引擎的开发者）的老板詹森•霍尔甚至不无懊悔地说：“如果当初意识到制作自己的引擎要付出这么大的代价的话，我们根本就不可能去做这种傻事。没有人会预料得到五年后的市场究竟是怎样的。”
正是出于节约成本、缩短周期和降低风险这三方面的考虑，越来越多的开发者倾向于使用第三方的现成引擎制作自己的游戏，一个庞大的引擎授权市场已经形成。
## 组成 ##
　　市面上的每种引擎都有自己的特色，其所提供的功能也是不尽相同的，通常每一款游戏都会有自己的引擎，但真正能获得他人认可并成为标准的引擎并不多。以桌面游戏引擎来说，其主要包含以下系统：渲染引擎（即“渲染器”，含二维图像引擎和三维图像引擎）、物理引擎、碰撞检测系统、音效、脚本引擎、电脑动画、人工智能、网络引擎以及场景管理。<br>
<br>**本节参考阅读：**<br>
http://hp.dewen.org/?p=924 <br>
http://job.17173.com/content/2008-10-15/20081015164759892,1.shtml <br><br>
# 第二节 Cocos2d #
## Cocos2d的前世今生 ##
　　Cocos2d是一个开源的2D游戏框架，它可以让你在创建自己的多平台游戏时节省很多的时间。它有多种语言开发的版本，最初的Cocos2D框架是使用Python编写的，基于pyglet开发。目前Cocos2D框架已经被移植到了多种语言和平台上。<br><br>
<div align="center">{% img /images/quick-cocos2d-x/a1.jpg %}<br>目前Cocos2D的各个版本示意图</div>
### 简介 ###
　　Cocos2d-iphone是原框架在iOS和Mac上的Objective-C移植(即把python语言换成了Objective-C)，使用了一样的设计和概念。 Cocos2d-iphone该API集成了Box2d和Chipmunk物理引擎。 在App Store上面的很多游戏都是使用Cocos2d-iphone框架开发的。<br>
　　Cocos2d-x是基于Cocos2d-iPhone的C++移植版，通过C++的重新编写，使得Cocos2d可以用在不同的平台上。它兼容iOS, Android, Windows, Marmalade, Linux, Bada, Blackberry-QNX等平台， 同时还有Lua和JavaScript脚本实现。简单的说就是使用C++（或lua、javascript）来开发游戏，可以达到一次编译，在各平台到处运行的效果。本r人将使用cocos2d-x讲解游戏开发。<br>
　　Cocos2d-android同样基于Cocos2d-iPhone，它是Java实现的运行于Android平台的版本。<br>
　　Cocos2d-android-1由国内自身开发者建立发展的，他认为Cocos2d-android发展太慢，所以创建了一个新的android实现，以实现最新的cocos2d-iphone的版本。<br>
　　Cocos2d-javascript是Cocos2d-iPhone的JavaScript实现。<br>
　　Cocos2d-html5是基于Cocos2d-X的运行于网页中的JavaScript实现。<br>
　　Cocos2d-XNA是基于Cocos2d-X的运行于微软XNA平台上的C#实现。<br>
<br>**本节参考阅读：**<br>
http://www.cocoachina.com/gamedev/gameengine/2012/0629/4405.html。<br><br>
# 第三节 quick-cocos2d-x #
## 什么是quick？ ##
　　quick-cocos2d-x（后文简称quick）与 cocos2d-x 的关系，用一句话概括：**quick 是 cocos2d-x 针对 Lua 的豪华套装威力加强版**。<br>
　　Cocos2d-x 是一个用 C++ 开发的游戏引擎，其架构设计和 API 基本上是照搬的 Cocos2d-iphone（一个用 Objective-C 的 iOS 游戏开发引擎）。由于 C++ 对开发人员要求较高，所以网龙科技利用 tolua++ 这个工具，将 Cocos2d-x 的 C++ 接口转为了 Lua 接口（这种将 C++ 接口导出为 Lua 接口的库通常称为 luabinding）。让开发者可以使用 Lua 这种简单易懂的脚本语言来编写游戏，从而大大提高开发效率。
在 Cocos2d-x 2.0 发布后，luabinding 又进行了不少改进和完善。截止到 Cocos2d-x 2.1.4，整个 luabinding 已经可以说是相当稳定了。所以《我是 MT》、《大掌门》这些赚钱像印钱的游戏，就纷纷采用 Cocos2d-x + Lua 的解决方案了。可惜 Cocos2d-x 团队从 2012 年以来一直在强力推广 Cocos2d-x 的 JavaScript 解决方案，所以在 Lua 支持上基本上就没有什么大动作了。而从使用 Lua 解决方案的开发商看来，需要 luabinding 具备更强大的功能，因此这就是开发 quick 的最初原因。
使用Lua可以在线更新代码和资源，这个特性对于网游来说是非常有吸引力的，它可以不经过审核就更新，就像页游可以热更新。<br>
　　总结而言，quick 和 cocos2d-x 的主要区别有如下几点：　　

    - 更完善的Lua支持，包括一个Lua框架对C++接口进行了二次封装。
    - 补充了大量cocos2d-x没有提供，但游戏需要的功能。
    - 为提高开发效率，提供了Objective-C和Java的桥接模块，以及强化的Windows/Mac模拟器。 
## Lua 与 JavaScript ##
　　目前 cocos2d-x 支持两种脚本语言的 binding，它们的区别主要在如下几个方面：<br>
　　1. 运行效率。Lua 在所有性能测试里，都比 JavaScript 快不少。特别是 LuaJIT 可以在运行时将 Lua 代码和字节码编译为机器指令，使得 Lua 代码的最终运行效率接近 C 的程度。<br>
　　2. 是否容易扩展。Lua 从设计时就是作为嵌入式语言来设计的，所以需要将某个 C/C++ 接口导出给 Lua 使用，那是相当轻松的事情。<br>
　　3. 源代码保护。LuaJIT 编译的字节码目前是无法反编译的，因为 LuaJIT 在编译时不是 1:1 直接转换源代码，而是对源代码做了相当多的深入优化。LuaJIT 编译出的字节码体积是 Lua 编译字节码的三分之一，由此可见优化程度。<br>
　　客观的说，JavaScript binding 最大的优势是以前大量的 JS 前端开发人员可以很容易的上手，而且支持 HTML5 平台。但如果从手游体验来说，Lua 的运行效率是很重要的优势。 

<br>**本节参考阅读：**<br>
http://quick.cocoachina.com/?p=1<br><br>
# 第四节 quick-cocos2d-x的组成 #
## quick的组成 ##
　　quick-cocos2d-x 由以下部分组成：<br>
　　1. quick-cocos2d-x Runtime（游戏引擎，见下图）<br>
　　2. quick-cocos2d-x Player（模拟器）：负责在不同平台上初始化运行环境和游戏引擎，然后载入 Lua 脚本执行。<br>
　　3. tools：一些辅助工具，例如编译 Lua 脚本、创建自定义的 tolua++ 模块等等。<br>

<br><div align="center">{% img /images/quick-cocos2d-x/a2.png %}<br>quick-cocos2d-x Runtime 结构</div><br> 
　　•　在上面的图片中，最底层是操作系统提供的 OpenGL 库，可以利用硬件加速完成图像绘制（音乐在不同平台会使用不同 API，这里没有单独列出）。<br>
　　•　中间一层，首先是 C++ 编写的 cocos2d-x 引擎。这个引擎提供一个高性能的游戏开发基础架构，让开发者从不同平台的图像渲染、音乐播放、用户交互等细节中解脱出来。接下来用 tolua++ 这个辅助工具，将 cocos2d-x 引擎的 C++ 接口导入 Lua 环境，让 Lua 脚本可以调用 cocos2d-x 的 API。最后，LuaJIT 提供了一个高性能的 Lua 虚拟机，在支持 JIT 的平台上，可以以接近 C 语言的速度运行 Lua 脚本。<br>
　　•　Lua Objc/Java Bridge 则是 quick-cocos2d-x 专为游戏集成各种第三方库提供的便捷工具，可以大大降低游戏接入渠道的成本。<br>
　　•　顶层的 quick framework 是在 cocos2d-x 接口基础上进行的封装，简化了大部分游戏开发时的常用功能。<br>
## Player ##
 　　虽然 quick 已经提供了 iOS/Android/Windows/Mac 平台的 Player，但如果需要添加自己的第三方库，或者对 quick 做一些扩展，那么就需要安装各个平台自己的开发工具，才能够完成自定义 Player 的创建工作：<br>
<br><div align="center">{% img /images/quick-cocos2d-x/a3.png %}<br>quick player</div><br>
<br>**本节参考阅读：**<br>
http://dualface.github.io/blog/2013/02/28/from-flash-to-quick/<br><br>

# 第五节 怎么入门 quick #
## 第一步，学习 Lua。 ##
 　　Lua 是一种简单易用的语言。学习这种语言最好的方式就是花几天时间写代码，然后在命令行中运行。学习的重点：<br>
 　　1. table 在 Lua 中是一种万能数据结构，既可以表示数组，又可以表示名值对。这和 PHP 里的 array 一样。唯一的区别在于 table 用作数组时，第一个元素的下标是从 1 开始。<br>
 　　2. function 在 Lua 里是 first-class 类型，也就是说你可以把一个 function 当做普通值，传递来传递去，这和其他函数式编程语言是一样的，例如 JavaScript。<br>
 　　3. Lua 里用 table 配合 metatable 实现面向对象。由于 C++ 对象导出到 Lua 里后就是这样的机制，所以这个一定要搞明白。<br>
 　　4. 搞清楚在定义方法和调用方法的时候，用“.”和“:”的区别。<br><br>
## 第二步，尝试修改和完善 quick 的各个示例程序。 ##
 　　用quick-x-player（quick 里牛叉的模拟器）运行sample目录里的各个例子，无差别爆改。改一点就按F5（Mac上按CMD+R）刷新模拟器看看效果（做过 Web 前端的童鞋感动吧），要不了几天就成熟练工了。<br><br>
## 第三步，熟悉 cocos2d-x API ##
 　　本质上，quick 是 cocos2d-x 的一个增强版本，所以熟悉 cocos2d-x API 是基本要求。好在 cocos2d-x 目前已经有相当丰富的学习资料，即便是 C++ 代码的，改写为 Lua 也非常简单，也就语法的区别而已。这个阶段可以用 quick 里的 CoinFlip 示例为基础，添加更多玩法或功能。CoinFlip 已经具备一个完整游戏的雏形，所以能够在 CoinFlip 中自在添加功能时，也就达到可以独立开发游戏的程度了。<br><br>
## 第四步，学习使用扩展功能和第三方 Lua 扩展 ##
 　　quick 里包含了相当丰富的扩展库，从支付到网络服务都应有尽有。而这些功能也是游戏从项目变成产品时必须的，所以在熟练掌握扩展功能可以大大提高开发效率，避免重复劳动。在学习扩展功能时，要了解这个扩展功能是基于什么开源项目来开发的，这样才能找到有针对性的学习资源。例如 LuaSocket、LuaFileSystem 等 Lua 扩展、Chipmunk 2D 物理引擎等等，它们的用法在各自项目的网站上都能找到。<br><br>
## 第五步，其他（可选） ##
 　　包括导出自己的 C++ 对象到 Lua、集成第三方 SDK等。<br><br>