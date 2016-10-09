title: Framework篇　第二章 Binder机制
date: 2016-3-28 9:58:23
categories: Android开发 - 白银
---
　　从本章开始我们将学习`Android Framework`中的东西，而首当其冲的就是`Binder`。

	-  正如其名“粘合剂”所喻，它是系统间各个组件的桥梁。
	-  理解Binder对于理解整个Android系统有着非常重要的作用，Android系统的四大组件，AMS，PMS等系统服务无一不与Binder挂钩。如果对Binder不甚了解，那么就很难了解这些系统机制，从而仅仅浮游于表面，要深入Android那么Binder是必须迈出的一步。
<!-- more -->
# 第一节 背景知识 #
　　由于`Android`系统基于`Linux`内核，因此在正式介绍`Binder`机制之前，有必要了解相关知识。

　　**进程隔离**

	-  进程隔离是为保护操作系统中进程互不干扰而设计的一组不同硬件和软件的技术。
	-  进程隔离技术使用了虚拟地址空间，即进程A的虚拟地址和进程B的虚拟地址不同，这样就防止进程A将数据信息写入进程B。

　　以上来自维基百科；因此当一个进程需要与另外一个进程通信时，就需要某种系统机制才能完成。

	-  扩展：DOS系统能够允许任何进程对其他进程的内存进行写操作。

<br>　　`Linux`将系统内存划分成了** 内核空间 **和** 用户空间 **两部分：

	-  系统的核心软件会运行在较高的特权级别上，它们驻留在被保护的内存空间上，拥有访问硬件设备的所有权限，Linux将此块内存称为内核空间。
	-  普通应用程序则运行在用户空间上，它们不能使用某些特定的系统功能，不能直接访问硬件，不能直接访问内核空间等。

<br>　　高安全级别的东西（硬件等）只能由内核空间里的程序访问，那么当普通程序也需要访问这些资源时，该怎么办呢？

<br>　　**系统调用/内核态/用户态**

	-  用户空间访问内核空间的唯一方式就是系统调用：通过这个统一入口接口，所有的资源访问都是在内核程序的控制下执行，以免导致用户程序对系统资源的越权访问，从而保障了系统的安全和稳定。
	-  当用户进程执行系统调用而陷入内核代码中执行时，就称进程处于内核运行态，此时处理器处于特权级最高的(0级)。
	-  当用户进程在执行自己的代码时，则称其处于用户运行态，此时处理器在特权级最低的(3级)。
	-  处理器在特权等级高的时候才能执行那些特权CPU指令。

<br>　　也就是说，虽然用户进程之间是相互独立的，但它们却是共享一份内核空间。

　　很显然，当一个用户进程想与另外一个用户进程进行通信时，就可以通过内核空间来完成了。

<br>　　**内核模块/Binder驱动**

	-  即进程A发起请求给内核里的程序，内核里的程序再将请求转发给进程B，从而达到进程间通信。不过，Android使用的Binder机制并不是Linux内核的一部分，它是怎么做到访问内核空间的呢？
	-  Linux的动态可加载内核模块（Loadable Kernel Module，LKM）机制解决了这个问题：
	   -  模块是具有独立功能的程序，可以被单独编译，但不能独立运行。
	   -  它在运行时被链接到内核作为内核的一部分在内核空间运行。
	-  这样，Android系统可以通过添加一个内核模块运行在内核空间，用户进程之间的通过这个模块作为桥梁，就可以完成通信了。
	   -  这个运行在内核空间的、负责各个用户进程通信的内核模块，就是我们后面要涉及到的：Binder驱动。

<br>　　既然`Linux`已经存在了很多通信机制，为什么还会有`Binder`机制？

	-  在移动设备上，Binder的传输效率和可操作性很好。
	-  Binder机制能够很好地实现Client-Server架构。
	-  Binder机制的安全性高。
	   -  传统方式对于通信双方的身份并没有做出严格的验证，只有在上层协议上进行架设；
	   -  比如Socket通信ip地址是客户端手动填入的，都可以进行伪造；
	   -  而Binder机制从协议本身就支持对通信双方做身份校检，因而大大提升了安全性。

<br>**本节参考阅读：**
- [Android Binder机制(1):Binder架构分析](http://blog.imallen.wang/blog/2016/02/24/android-binderji-zhi-1-binderjia-gou-fen-xi/)
- [linux内核空间与用户空间信息交互方法](http://www.kerneltravel.net/jiaoliu/005.htm)
- [用户空间与内核空间，进程上下文与中断上下文总结](http://www.cnblogs.com/Anker/p/3269106.html)
- [Binder学习指南](http://weishu.me/2016/01/12/binder-index-for-newer/)

# 第二节 Binder通信过程 #
　　通信，无论是在两个进程之间，还是在人与人之间，一定会有一个`发起方`和一个`接收方`。
　　在`Binder`机制中也是如此，由接收方(`Server`)进程定义接口，发起方(`Client`)进程按照接口的规范进行请求。

<br>　　回想一下日常生活中我们通信的过程：

	-  假设A和B要进行通信，通信的媒介是打电话（A是Client，B是Server）；A要给B打电话，必须知道B的号码，这个号码怎么获取呢？答案是：通信录。

　　这个通信录就是一张表，内容大致是：
``` c
B -> 12345676
C -> 12334354
```
　　那么，整个通信的过程则为：

	-  A先查阅通信录，拿到B的号码，才能进行通信；否则，怎么知道应该拨什么号码？
	-  进一步细化这个过程的话就是，如果A要给B打电话，必须先连接通话中心，说明给我接通B的电话，这时候通话中心帮他呼叫B，连接建立，就完成了通信。

　　我们看到，一次电话通信的过程除了通信的双方还有两个隐藏角色：`通信录`和`通话中心`。Binder机制也是一样：

	-  两个运行在用户空间的进程要完成通信，必须借助内核的帮助，这个运行在内核里面的程序叫做Binder驱动，它的功能类似于通话中心，负责转接任务。
	-  通信录，就是一个叫做ServiceManager的东西（简称SM），稍后详述。

　　下图是通信过程的示意图：
<center>
![](/img/android/android_BY_c01_01.jpg)
</center>

　　图释：

	-  首先，手机启动时，有一个进程告诉Binder驱动程序自己是Binder上下文管理者，即申请为SM。
	-  然后，驱动同意之后，该进程就开始负责管理整个系统的所有服务了，不过这时候通信录还是空的，一个号码都没有。
	   -  常见的有服务有TelephonyManager、ActivityManager、PackageManager、LocationManager等。
	   -  每个服务又分为Client端和Server端，其中Client端在每个用户进程中都有一份，而Server则在整个操作系统中唯一。
	-  接着，每个服务的Server端启动之后，都会向SM报告，比如：
	   -  我是zhangsan，如果有人要找我请返回0x1234；其它Server端也是如此。
	   -  这样SM就建立了一张表，对应着各个Server的名字和地址。
	-  接着，当某个Client想与某个服务的Server端通信时，会首先询问SM，SM收到请求后会返回一个联系方式，于是就开始通信了。
	-  最后，Client与SM以及Client与Server的通信，都会经过Binder驱动，驱动在背后默默无闻，但是做着最重要的工作。
	   -  驱动是整个通信过程的核心，因此完成跨进程通信的秘密全部隐藏在驱动里面；这个我们稍后讨论。

<br>**本节参考阅读：**
- [Binder学习指南](http://weishu.me/2016/01/12/binder-index-for-newer/)

# 第三节 Binder机制跨进程原理 #
　　从上一节中我们知道了如下三点：

	-  通信过程的四个角色：Client、Server、SM、Binder驱动。
	-  Client在与Server通信之前，需要先和SM通信，来获取Server的通信地址。
	-  不论是Client与Server，还是Client与SM之间的通信，都是属于进程间通信，都需要经过Binder驱动来中转。

　　但是我们仍然不清楚当`Client`得到`Server`的地址之后，它到底是如何与`Server`完成通信的。

	-  答案就是：Binder驱动为我们做了一切。

<br>　　假设`Client`进程想要调用`Server`进程的`object`对象的一个方法`add`；我们来看看`Binder`机制是如何做的：

<center>
![](/img/android/android_BY_c01_02.jpg)
</center>

　　图释：

	-  首先，Server所在的进程要向SM注册，并告诉SM它叫zhangsan，有一个object对象，可以执行add操作。
	-  然后，Client向SM查询：我需要联系一个名字叫做zhangsan的进程里面的object对象。
	   -  这时候关键来了：进程之间通信的数据都会经过运行在内核空间里面的Binder驱动，驱动在数据流过的时候做了一点手脚。
	   -  它并不会给Client进程返回一个真正的object对象，而是返回一个看起来跟object一模一样的代理对象objectProxy。
	   -  这个objectProxy也有一个add方法，但是这个add方法没有Server进程里面object对象的add方法那个能力。
	   -  objectProxy的add只是一个傀儡，它唯一做的事情就是把参数包装然后交给驱动。
	-  接着，Client进程并不知道驱动返回给它的对象动过手脚，于是Client开开心心地拿着objectProxy对象然后调用add方法。
	   -  我们说过，这个add什么也不做，直接把参数做一些包装然后直接转发给Binder驱动。
	-  最后，驱动收到这个消息，发现是这个objectProxy；一查表就明白了，Client真正应该要访问的是object对象的add方法。
	   -  于是Binder驱动通知Server进程，调用你的object对象的add方法，然后把结果发给我。
	   -  Sever进程收到这个消息，照做之后将结果返回驱动，驱动然后把结果返回给Client进程。


<br>　　从上面的过程可以看出来：

	-  Binder跨进程传输并不是真的把一个对象传输到了另外一个进程。
	-  而是让服务在Server端进程留下了一个真身，在另外一个进程幻化出一个影子（影子可以有很多个）。
	-  Client进程的操作其实是对于影子的操作，影子利用Binder驱动最终让真身完成操作。

<br>　　另外，在上一节中我们说到`Client`与`SM`通信是跨进程的，而事实上：

	-  一般情况下，Server、Client、SM三个人是分别属于三个不同的进程。
	-  所以Server与SM的通信也是跨进程的，也是基于Binder机制的。
	-  所以Server将自己注册到SM时，其实就是把自己的影子对象注册到SM中，之后Client从SM中获取的也是影子对象。
	-  总之Server进程的本地对象仅有一个，其他进程所拥有的全部都是它的代理，代理对象协助驱动完成了跨进程通信。

<br>　　现在我们应该知道了，所谓的`Binder`机制就是一个进程间通信的机制，它的具体实现原理就是上面说的。

# 第四节 源码分析 #
　　笔者在[《第三章 服务与广播接收者》](http://cutler.github.io/android-A03/)和[《第一章 IPC机制》](http://cutler.github.io/android-F01/)中已经介绍了绑定方式启动`Service`和`AIDL`的基础用法，本节来从源码角度分析`Binder`机制的调用过程。

## 基础知识 ##

<br>　　在正式进行源码分析之前，我们再来缕一下进程间通讯的相关知识：

	-  第一，在进行IPC通信时会涉及到四个东西：Client、Server、Binder驱动、SM，其中前两者与我们关系最为密切。
	-  第二，在通信之前Server端需要事先定义一个接口A，接口A用来告诉所有Client端，Server端提供哪些功能。
	-  第三，在通信之前Server端还得定义一个实现了接口A的类B，类B用来执行具体的任务。
	-  第四，既然是进程间通讯，那么Server端就得想法把类B的对象传递给各个Client，以便它们能调用功能。
	-  第五，就像前面说的，当Client和Server端在同一个进程中时，Binder驱动会直接将类B的对象交给Client端，但当它们不再同一个进程时，就得创建一个影子对象了。
	   -  显然，判断Client和Server是否在同一个进程以及创建影子的工作，得需要一个专门的类去做。

　　如果你赞同上面我说的那五点，就可以继续往下看，如果不赞同，那请再读一遍。

<br>　　首先，我们按照[ 这里 ](http://cutler.github.io/android-F01/#AIDL)的步骤创建好`IDAO.aidl`、`MyService`等类，并保证程序能正确执行。

　　然后，打开生成`IDAO.java`，查看里面的源代码：
``` java
public interface IDAO extends android.os.IInterface {

    public static abstract class Stub extends android.os.Binder implements org.cutler.aidl.IDAO { }

    public int add(int i, int j) throws android.os.RemoteException;
}
```
    语句解释：
    -  可以看到里面涉及到了很多类，我们依次来介绍它们。
    -  其中IDAO接口就是我们上面说的接口A，Client端通过查看IDAO接口可以知道Server端有哪些功能。
    -  另外，一个接口如果想被跨进程访问就得遵循系统的规范，也就是得继承IInterface接口。

<br>　　从上面的代码可以看到，还有一个`IDAO.Stub`内部类，它继承自`Binder`，我们先来介绍`IBinder`接口和`Binder`类。

<br>　　**IBinder接口**

	-  在Android中，如果你想让你的Service中的方法被其他进程调用，那就必须在它的onBind方法中返回一个IBinder对象。
	-  这个IBinder接口中定义了一些进程间通信所必需的公共方法，若你想让你的类跨进程传递就得实现IBinder接口，并重写里面的抽象方法。

<br>　　**Binder类**

	-  虽然知道了IBinder接口定义了进程间通信必需的方法，但是我们却不知道应该如何实现这些方法。
	-  好在Android为我们提供的一个现成的IBinder接口的实现类，Binder类。
	-  也就是说，理论上只要让我们的类去继承Binder类，那么我们的类就可以被跨进程访问了。
	-  但事实上还差一步，原因在下面。

<br>　　**Stub类**

	-  因为虽然Binder类实现了IBinder接口中的所有方法，但是它只是进行了公共的实现。
	   -  比如我们的A类有3个字段，B类有5个字段，而各个字段的类型不相同。
	   -  再比如我们A类有一个add方法、B类有个remove方法，这两个方法都有不同的参数列表和返回值。
	   -  按照刚才说的，如果想让A、B顺利跨进程传递属性值以及进行方法调用的话，就得让它继承Binder类，但是Binder类却不知道要如何将A、B类中的字段传递到其它进程中，也就是说需要类A、B自己处理字段的读和写，以及在调用方法的时候，手动的为它们设置参数以及读取返回值。
	-  因此直接让类A、B继承Binder类还是不够的，我们还需要在A、B外面在套一个包装类，专门负责方法的调用、参数的传递。
	-  而IDAO.Stub就是这个类。

<br>　　**Proxy类**

	-  其实在Stub类内部还有一个名为Proxy的内部类，顾名思义它是一个代理类，和Stub的作用是一样的，用来在正式的工作之前，帮我们做一些预处理。
	-  可以不负责任的说：
	   -  Proxy类主要由Client端调用。它用来处理方法参数的封装、调用Server端的方法并解析返回值。
	   -  Stub类主要由Server端调用。它用来解析Client发来的请求，然后调用对应的方法去执行功能，并将结果返回给Client端的Proxy类。

<br>　　下面用一个实例来讲解`Binder`机制的具体调用流程。


## 分析实例 ##
　　我们已经知道，客户端绑定服务的代码为：
``` java
this.bindService(intent, new ServiceConnection() {
    public void onServiceConnected(ComponentName name, IBinder service) {

        // 将服务端返回的IBinder对象，转换成一个IDAO对象。
        dao = IDAO.Stub.asInterface(service);
        try {
            Toast.makeText(MainActivity.this, dao.add(100, 200)+"", Toast.LENGTH_SHORT).show();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    public void onServiceDisconnected(ComponentName name) {
    }
}, Context.BIND_AUTO_CREATE);
```
    语句解释：
    -  需要注意的是，上一节中说的是Stub类“主要”由Server端调用，并不是说Stub类“只会”由Server端调用。
    -  所以我们在客户端中使用IDAO.Stub的方法，没什么好大惊小怪的。

<br>　　接着来看一下`IDAO.Stub`类的`asInterface`方法的源码：
``` java
public static org.cutler.aidl.IDAO asInterface(android.os.IBinder obj) {
    if ((obj == null)) {
        return null;
    }
    // 尝试获取IBinder的本地对象。
    android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
    if (((iin != null) && (iin instanceof org.cutler.aidl.IDAO))) {
        // 如果本地对象获取成功，则意味着客户端和服务端处在同一个进程，则直接返回本地对象。
        return ((org.cutler.aidl.IDAO) iin);
    }
    // 否则创建一个代理对象。
    // 因为既然是跨进程通信，那么在方法调用的时候，方法参数是不能直接传递到另一个进程的。
    // 所以我们在obj外面加一层Proxy类，由Proxy类对方法的参数和返回值进行处理。
    return new org.cutler.aidl.IDAO.Stub.Proxy(obj);
}
```
    语句解释：
    -  由于IDAO.Stub.Proxy也实现了IDAO接口，所以外界可以正常调用add方法。
    -  只不过在Proxy类中并不会进行真正的任务，它只会对方法的参数进行封装，以及对返回值进行解析而已。

<br>　　如果通信的双方不再同一个进程的话，当程序执行`dao.add(100, 200)`时，其实就是调用的`Proxy.add()`方法。

<br>　　因此，我们接着再来看看`IDAO.Stub.Proxy`类的`add`方法的源码：
``` java
private static class Proxy implements org.cutler.aidl.IDAO {
    private android.os.IBinder mRemote;

    Proxy(android.os.IBinder remote) {
        mRemote = remote;
    }

    @Override
    public android.os.IBinder asBinder() {
        return mRemote;
    }

    public java.lang.String getInterfaceDescriptor() {
        return DESCRIPTOR;
    }

    @Override
    public int add(int i, int j) throws android.os.RemoteException {
        android.os.Parcel _data = android.os.Parcel.obtain();
        android.os.Parcel _reply = android.os.Parcel.obtain();
        int _result;
        try {
            // 首先将参数i、j放到Parcel中，最终会传递给服务端的Service。
            _data.writeInterfaceToken(DESCRIPTOR);
            _data.writeInt(i);
            _data.writeInt(j);
            // 调用远程Service的add方法。
            mRemote.transact(Stub.TRANSACTION_add, _data, _reply, 0);
            // 读取返回值。
            _reply.readException();
            _result = _reply.readInt();
        } finally {
            _reply.recycle();
            _data.recycle();
        }
        return _result;
    }
}
```
    语句解释：
    -  通过上面的分析，我们已经知道Proxy类的mRemote属性是由Stub的asInterface方法传递过来的。
    -  也就是说，上面第28行代码最终调用的其实是Binder类的transact方法。

<br>　　事实上，在`Binder`类里还有一个名为`BinderProxy`的内部类：

	-  当客户端成功绑定上服务端的Service后，会接收到一个IBinder对象。
	-  如果客户端和服务端不是在一个进程的话，这个IBinder其实是BinderProxy类型的，即BinderProxy就是前面说的Binder驱动创建的影子对象。

<br>　　于是整个调用过程变成了：

	-  首先，Client端通过IDAO.Stub.asInterface(service)获取到一个IDAO对象，并调用它的add方法。
	-  然后，真正被调用的其实是IDAO.Stub.Proxy类的add方法。
	-  接着，IDAO.Stub.Proxy类的add方法又调用了BinderProxy类的transact方法。
	-  最后，在BinderProxy类的transact方法中，会通过JNI去通知Binder驱动调用远程对象的add方法。
	   -  也就是说，当BinderProxy类的JNI被调用前，程序流程其实还处于Client端进程的。

<br>　　我们来看一下`BinderProxy`的`transact`方法：
``` java
public boolean transact(int code, Parcel data, Parcel reply, int flags) throws RemoteException {
    Binder.checkParcel(this, code, data, "Unreasonably large binder buffer");
    return transactNative(code, data, reply, flags);
}
public native boolean transactNative(int code, Parcel data, Parcel reply,
        int flags) throws RemoteException;
```


<br>　　经过Binder驱动的中转之后，接下来的程序的流程就进入到Server端了：

	-  首先，程序流程从JNI层回到Java层时，服务端的Binder类的transact方法会被调用。
	-  然后，通过查看源码可知，在它的内部又会转调用onTransact方法。
	-  最后，由于Server端的本地对象是Stub，且它重写了Binder类的onTransact方法，所以我们接下来看看它的源码。

<br>　　`Stub`类的`onTransact`的源码：
``` java
public boolean onTransact(int code, android.os.Parcel data, 
    android.os.Parcel reply, int flags) throws android.os.RemoteException {
    switch (code) {
        case INTERFACE_TRANSACTION: {
            reply.writeString(DESCRIPTOR);
            return true;
        }
        case TRANSACTION_add: {
            // 从Parcel中读取数据
            data.enforceInterface(DESCRIPTOR);
            int _arg0;
            _arg0 = data.readInt();
            int _arg1;
            _arg1 = data.readInt();
            // 调用自己的add方法
            int _result = this.add(_arg0, _arg1);
            // 将计算结果写到reply中，并返回。
            reply.writeNoException();
            reply.writeInt(_result);
            return true;
        }
    }
    return super.onTransact(code, data, reply, flags);
}
```
    语句解释：
    -  最后就是通过Binder类的onTransact方法来将计算结果返回到Client进程中了。

# 第五节 ServiceManager #
　　在第二节中提到了一个`“通信录”`的概念，Android中是确实存在这样的一个类的：`ServiceManager`。

	-  需要注意的是，ServiceManager其实有两个实现：
	   -  管理Java系统服务的ServiceManager
	   -  管理本地系统服务的ServiceManager
	-  Java系统服务通过Java层的ServiceManager注册服务，本地系统服务通过C/C++层的ServiceManager注册服务。
	-  Java层的ServiceManager通过JNI与C/C++层的ServiceManager连接在一起。

<br>　　如果你对`SM`的启动感兴趣，可以看看老罗的[ 这篇文章 ](http://blog.csdn.net/luoshengyang/article/details/6621566)。

　　不过笔者认为，查看底层`C/C++`源码是黄金级别选手的事情，咱们白银的选手暂时可以不去看，把精力花在其它地方吧。


<br>　　范例1：`android.os.ServiceManager`类。
``` java
/** @hide */
public final class ServiceManager {
    private static final String TAG = "ServiceManager";

    private static IServiceManager sServiceManager;
    private static HashMap<String, IBinder> sCache = new HashMap<String, IBinder>();

    private static IServiceManager getIServiceManager() {
        if (sServiceManager != null) {
            return sServiceManager;
        }

        // ServiceManagerNative类就相当于我们上面的IDAO.Stub类。
        // 这行代码的作用不用多说了吧？ 就是从IBinder中获取一个IServiceManager对象。
        // 由于可以肯定的是在进行跨进程，所以BinderInternal.getContextObject()的返回值就是BinderProxy类型的。
        sServiceManager = ServiceManagerNative.asInterface(BinderInternal.getContextObject());
        return sServiceManager;
    }

    public static IBinder getService(String name) {
        try {
            // 这段逻辑也很直白：先从缓存中查询远程服务的IBinder对象，如果没有则去跨进程查找。
            IBinder service = sCache.get(name);
            if (service != null) {
                return service;
            } else {
                return getIServiceManager().getService(name);
            }
        } catch (RemoteException e) {
            Log.e(TAG, "error in getService", e);
        }
        return null;
    }

    public static void addService(String name, IBinder service) {
        try {
            // 如你所见
            getIServiceManager().addService(name, service, false);
        } catch (RemoteException e) {
            Log.e(TAG, "error in addService", e);
        }
    }

    // 此处省略若干代码

}
```
    语句解释：
    -  大家可以打开ServiceManagerNative类看看，它的执行流程和我们之前说的是一致的。

<br>　　至于`ServiceManager`是何时被初始化的，大家可以自行寻找答案。

<br>**本节参考阅读：**
- [Android Binder机制(1):Binder架构分析](http://blog.imallen.wang/blog/2016/02/24/android-binderji-zhi-1-binderjia-gou-fen-xi/)



<br><br>
　　







