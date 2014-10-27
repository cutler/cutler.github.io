title: 第一章 概述
date: 2014-10-27 23:15:24
categories: android
tags:
- 概述
---
　　本章主要介绍 Android 应用程序的原理、Android 系统架构，以及如何创建一个新的Android 项目。
# 第一节 什么是 Android #
　　Android 英文含义为： 男性机器人，中文名称为 `安卓` 。
　　Android 是 `Google` 公司的产品。它是一个运行在 `Linux` 操作系统内核(kernel) 上的开放手机平台(即开放源代码) 的操作系统。
　　Android 系统可以运行在手机、平板电脑（甚至是笔记本电脑）等设备上。
　　在手机设备中，Android 操作系统的地位与 `WindowsMobile`、`Symbian`等其它手机操作系统处在同一级别。 常见的智能手机操作系统有：`Symbian`, `Windows Mobile`, `RIM BlackBerry`, `Android`, `iOS`。 
　　Google 公司在 Android 系统中内置了很多应用软件，如打电话、发短信软件。

　　提示：

	Android开发属于客户端开发，JavaEE开发属于服务器端开发。 

# 第二节 应用程序原理 #
　　目前，Android 系统中运行的应用程序都是使用`Java`程序语言来编写。Android SDK 工具把应用程序的代码、数据和资源文件一起编译到一个 Android 程序包中（这个程序包是以`.apk`为后缀的归档文件）。一个`.apk`文件就是一个 Android 应用程序，安装 Android 手机软件本质上就是将这个`.apk`文件解压到 Android 设备中。

##Activitys##