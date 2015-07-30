title: 入门篇　第八章 Permissions
date: 2015-1-15 18:51:58
categories: Android
---
　　Android 是一种特权分隔的操作系统，本章介绍一下权限相关的知识。

# 用户ID和文件访问 #
　　在应用安装的时候，`Android`会给每个程序分配一个不同的`Linux`用户身份(`UID`)，软件在设备上的生命周期中这个身份标识保持恒定不变。在不同的设备上，相同的软件可能会有一个不同的`UID`，且在相同的设备上，不同的软件肯定具有不同的`UID`。

　　因为安全是在进程级别上实现的，因此默认情况下两个软件包的代码无法在同一个进程中同时运行。
　　我们可以在这两个软件包的`AndroidManifest.xml`中将`<manifest>`标签的`shareUserId`属性分配相同的用户`ID`，即把两个应用程序看作拥有同样的用户`ID`和文件权限的同一个应用程序。但是为了保持安全，在`Android`中只有具有相同签名（请求的`sharedUserId`也相同）的应用程序才会分配相同的用户`ID`。

　　任何由应用程序存储的数据将被赋予应用程序的用户ID，正常情况不能被其它应用程序访问。当使用下面三种方式创建一个新文件时：

	-  getSharedPreferences(String, int)
	-  openFileOutput(String, int)
	-  openOrCreateDatabase(String, int, SQLiteDatabase.CursorFactory)
<br>　　可以使用`Context.MODE_WORLD_READABLE`或`Context.MODE_WORLD_WRITEABLE`标记允许其他应用程序来读/写这个文件。设置这些全局的读写权限标记后，该文件仍然为创建文件的应用程序所拥有，但任何其他应用程序可以操作它。

# 使用权限 #
　　默认情况下一个`Android`应用程序没有任何权限，这意味着它不能做任何会对用户体验或设备上的任何数据造成不利影响的操作。
　　若想要使用设备所的保护功能，则必须在`AndroidManifest.xml`文件中配置一个或多个的`<uses-permission>`标签，来申请所需要的权限。

　　例如，一个监控接收短信的应用程序需要作如下声明：
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.android.app.myapp" >
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    ...
</manifest>
```
<br>　　通常，如果软件在运行的过程中试图使用未在`AndroidManifest.xml`中申请的权限，应用程序会抛出一个`SecurityException`异常。

# 声明和实施权限 #
　　你可以在你的`AndroidManifest.xml`中使用一个或多个`<permission>`标签来创建自己的权限。

　　例如，一个应用程序想要控制谁能够启动它的一个Activity，可以声明如下：
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" 
    package="com.me.app.myapp" >
    <permission android:name="com.me.app.myapp.permission.DEADLY_ACTIVITY"
        android:label="@string/permlab_deadlyActivity"
        android:description="@string/permdesc_deadlyActivity"
        android:permissionGroup="android.permission-group.COST_MONEY"
        android:protectionLevel="dangerous" />
    ...
</manifest>
```
    语句解释：
    -  label属性，权限的名称。
    -  description属性，权限的详细描述，用来警告用户当授权该权限后会发生什么。
    -  protectionLevel属性，权限的等级。
    -  permissionGroup属性，权限所属的权限组，用于帮助系统展示权限给用户。通常优先使用现有的系统组，在极少数情况下也可以由自己进行定义。

<br>　　这里是一个`CALL_PHONE`权限的标签和描述的的例子：
``` xml
<string name="permlab_callPhone">directly call phone numbers</string> 
<string name="permdesc_callPhone">
    Allows the application to call phone numbers without your intervention. Malicious applications may cause unexpected calls on your phone bill. Note that this does not allow the application to call emergency numbers.
</string>
```

　　你可以在命令行中执行`adb shell pm list permissions`来查看现在系统上的权限定义。


<br><br>