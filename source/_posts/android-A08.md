title: 入门篇　第八章 Permissions
date: 2015-1-15 18:51:58
categories: Android
---
　　Android是一种特权分隔的操作系统，每个应用程序都具有各自独立的系统标识（Linux用户ID和组ID），系统各部分有不同的身份标识，因此各个应用程序相互独立且与系统无关。
　　`“Permissions”`机制通过限定进程能够执行的操作和限定对每一个资源点对点的访问的URI许可来提供附加细粒度的安全功能。


# 安全体系架构 #
　　Android安全体系架构设计的核心是在默认情况下没有任何一个程序可以执行对其他程序、操作系统或者用户有害的操作，包括读写用户的隐私数据（例如联系人或者电子邮件），读写其他程序的文件，进行网络访问或者唤醒设备等等。

　　由于内核让每个应用程序运行在独立的沙盒中，应用程序必须通过声明所需要而沙盒没有提供的权限来明确的分配资源和数据。Android没有采用会使用户体验复杂并且不利于安全的动态授权机制。应用程序静态的声明他们所需要的权限，在程序安装时Android系统会提示用户同意它们获取这些权限。

　　沙盒程序独立于生成普通应用程序的机制。特别地，`Dalvik`虚拟机不是一个安全的边界，任何的应用程序都能够运行本地代码（`NDK`）。所有类型的应用程序（`java`、`native`和混合的）均用相同的方式置以相同的安全等级在沙盒中运行。

# 应用程序数字签名 #
　　所有的Android应用程序（`apk`）都必须使用一个开发人员掌握私钥、用于识别应用程序作者的证书进行签名。 
　　该证书要求很宽松，并不需要由专门的证书颁发机构进行签名，我们自己就可以手工创建。

　　Android证书的目的是区分应用程序的作者，可以允许操作系统授予或者拒绝应用程序使用签名级别的权限和操作系统授予或者拒绝应用程序请求和其他应用程序相同的Linux身份。

# 用户ID和文件访问 #
　　在应用安装的时候，Android会给每个程序分配一个不同的`Linux`用户身份(`UID`)，软件在设备上的生命周期中这个身份标识保持恒定不变。在不同的设备上，相同的软件可能会有一个不同的`UID`，且在相同的设备上，不同的软件肯定具有不同的`UID`。

　　因为安全是在进程级别上实现的，因此默认情况下两个软件包的代码无法在同一个进程中同时运行。
　　我们可以在这两个软件包的`AndroidManifest.xml`中将`<manifest>`标签的`shareUserId`属性分配相同的用户`ID`，即把两个应用程序看作拥有同样的用户ID和文件权限的同一个应用程序。但是为了保持安全，在Android中只有具有相同签名（请求的`sharedUserId`也相同）的应用程序才会分配相同的用户`ID`。

　　Android中，任何由应用程序存储的数据将被赋予应用程序的用户ID，正常情况不能被其它应用程序访问。当使用下面三种方式创建一个新文件时：

	-  getSharedPreferences(String, int)
	-  openFileOutput(String, int)
	-  openOrCreateDatabase(String, int, SQLiteDatabase.CursorFactory)
　　可以使用`Context.MODE_WORLD_READABLE`或`Context.MODE_WORLD_WRITEABLE`标记允许其他应用程序来读/写这个文件。设置这些全局的读写权限标记后，该文件仍然为创建文件的应用程序所拥有，但任何其他应用程序可以看到它。

# 使用权限 #
　　默认情况下一个Android应用程序没有任何权限，这意味着它不能做任何会对用户体验或设备上的任何数据造成不利影响的操作。若想要使用设备所的保护功能，则必须在`AndroidManifest.xml`文件中配置一个或多个的`<uses-permission>`标签上声明应用程序所需要的权限。

　　例如，一个监控接收短信的应用程序需要作如下声明：
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.android.app.myapp" >
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    ...
</manifest>
```
　　通常，如果软件在运行的过程中试图使用未在`AndroidManifest.xml`中申请的权限，应用程序会抛出一个`SecurityException`异常。

　　所有Android系统提供的权限可以在`Manifest.permission`中找到，同时任何应用程序也可以定义并执行其自己的权限。

# 声明和实施权限 #
　　你可以在你的`AndroidManifest.xml`中使用一个或多个`<permission>`标签来声明自己的权限。

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

# 组件和权限 #
　　通过在相应的组件中包含`android:permission`属性，以使其被用以控制进入的权限。

<br>**Activity权限**
　　应用于`<activity>`标签，用于限制谁才可以启动相关的Activity。
　　该权限在运行`Context.startActivity()`和`Activity.startActivityForResult()`期间被检查，如果调用方不具有相应必需的权限，那么将会从此次调用中抛出`SecurityException`异常。

<br>**Service权限**
　　应用于`<service>`标签，用于限制谁才可以启动或绑定该Service。
　　该权限在运行`Context.startService()`,`Context.stopService()`和`Context.bindService()`调用的时候会进行权限检查。如果调用方没有所需的权限，则会抛出一个`SecurityException`异常。

<br>**BroadcastReceiver权限**
　　应用于`<receiver>`标签，用于限制谁可以向相关的接收器发送广播。
　　该权限检查会在`Context.sendBroadcast()`返回后当系统去发送已经提交的广播给相应的`Receiver`时进行。

<br>**ContentProvider权限**
　　应用于`<provider>`标签，用于限制谁才可以访问ContentProvider提供的数据。
　　不像其它组件那样，提供者有两个单独的权限属性，你可以设置`android:readPermission`用于限制谁能够读，`android:writePermission`用于限制谁能够写。



<br><br>