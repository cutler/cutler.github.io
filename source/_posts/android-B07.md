title: UI篇　第七章 ActionBar
date: 2015-2-5 18:58:50
create: 2015-4-14 14:09:02
categories: Android
---
　　在`Android 3.0`中除了`Fragment`外，`Action Bar`也是一个重要的内容。
　　`Action Bar`主要是用于`代替传统的标题栏`，对于Android平板设备来说屏幕更大，它的标题使用`Action Bar`来设计可以展示更多丰富的内容，方便操控。同时，`Action Bar`可以给用户提供一种全局统一的`UI`界面，使得用户在使用任何一款软件时都懂得该如何操作，并且`ActionBar`还可以自动适应各种不同大小的屏幕。

　　我们可以从官方的[ Dashboards ](http://developer.android.com/about/dashboards/index.html)中看出来，目前市场上的Android设备的系统版本已经转移到`4.0`左右。虽然如此，我们仍应该保持对低版本的适配，因此本章将以添加`V7 appcompat`库的方式来讲解如何使用`ActionBar`。

# 第一节 基本应用 #

　　`ActionBar`有多种形式，你既可以在上面同时放置多个图标、按钮，也可以什么都不放。但对于大多数应用来说，`ActionBar`可以分割为`3`个不同的功能区域，下面是一张使用`ActionBar`的界面截图：

<center>
![ActionBar示意图](/img/android/android_b07_01.png)
</center>

　　其中，`[1]`是`ActionBar`的图标与标题，`[2]`是两个`action`按钮，`[3]`是`overflow`按钮。
　　提示：如果你搭建了最新的开发环境，那么在创建新项目的时候，会自动引入`V7 appcompat`库，如果没有自动引用，可以从`<sdk>/extras/android/support/v7/appcompat/`中复制一份。

## 图标和标题 ##

Android Support Library, revision 22 (March 2015)


<br>**本章参考阅读：**
- [Android ActionBar使用介绍](http://blog.csdn.net/wangjinyu501/article/details/9360801)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(上)](http://blog.csdn.net/guolin_blog/article/details/18234477)
- [Android-Action Bar使用方法-活动栏(一)](http://www.oschina.net/question/54100_34400)








<br><br>