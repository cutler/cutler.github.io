title: Framework篇　第二章 Binder机制
date: 2016-3-28 9:58:23
categories: Android开发 - 不屈白银
---
　　从本章开始我们将学习`Android Framework`中的东西，而首当其冲的就是`Binder`。

	-  正如其名“粘合剂”所喻，它是系统间各个组件的桥梁。
	-  理解Binder对于理解整个Android系统有着非常重要的作用，Android系统的四大组件，AMS，PMS等系统服务无一不与Binder挂钩。如果对Binder不甚了解，那么就很难了解这些系统机制，从而仅仅浮游于表面，要深入Android那么Binder是必须迈出的一步。
<!-- more -->
# 第一节 背景知识 #
　　由于`Android`系统基于`Linux`内核，因此在正式介绍`Binder`机制之前，有必要了解相关知识。

<br>　　**进程隔离**

	-  在早期的计算机中，程序是直接运行在物理内存上的，即程序在运行的过程中访问的都是物理地址。
	-  由于程序直接访问的是物理内存，这个时候程序所使用的内存空间不是隔离的。
	-  举个例子，进程A的地址空间是0-10M这个范围内，但是如果A中有一段代码是操作10M-128M这段地址空间内的数据，且这些内存已经分配给进程B了，那么此时B就很可能会崩溃（每个程序都可以访问系统的整个地址空间）。
	-  因此就提出了进程隔离技术（不允许进程A读写进程B的内存）。

　　既然出现了进程隔离机制，那么当两个进程需要通信时，就需要另想办法了。

<br>　　**内核中转**

	-  在Linux中，虽然用户进程之间是相互独立的，但它们却是共享一份内核空间。
	-  系统的核心软件会运行在较高的特权级别上，它们驻留在被保护的内存空间上，拥有访问硬件设备的所有权限，Linux将此块内存称为内核空间。普通应用程序则运行在用户空间上，它们不能使用某些特定的系统功能，不能直接访问硬件，不能直接访问内核空间等。
	-  很显然，当一个用户进程想与另外一个用户进程进行通信时，就可以通过内核空间来完成了。
	-  即进程A发起请求给内核里的程序，内核里的程序再将请求转发给进程B，从而实现进程间通信。

<br>　　**内核模块/Binder驱动**

	-  不过，Android使用的Binder机制并不是Linux内核的一部分，它是怎么做到访问内核空间的呢？
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

　　回想一下日常生活中我们通信的过程，A给B打电话时的流程为：

	-  首先，A和B要去营业厅办理手机卡，申请自己的电话号码。
	-  然后，两者互换电话号码。
	-  接着，A拨通B的号码，此时实际上电话先会打给通话中心，由通话中心进行转接。
	-  最后，通话中心接到A的请求时会先检测A提供的号码是否存在，只有存在才会帮忙转接。

　　我们看到，一次电话通信的过程除了通信的双方还有两个隐藏角色：`通话中心`和`通话中心的数据库`。Binder机制也是一样：

	-  两个运行在用户空间的进程要完成通信，必须借助内核的帮助，这个运行在内核里面的程序叫做Binder驱动，它的功能类似于通话中心，负责转接任务。
	-  通话中心的数据库，就是一个叫做ServiceManager的东西（简称SM），用来记录当前系统中已经存在哪些服务，以便进行转接。

　　下图是Binder通信过程的示意图：
<center>
![](/img/android/android_BY_c01_01.jpg)
</center>

　　图释：

	-  首先，手机启动时SystemServer进程告诉Binder驱动程序它是Binder上下文管理者，即申请为SM。
	-  然后，驱动同意之后，SystemServer就开始负责管理整个系统的所有服务了，不过这时候系统中还没有任何服务，于是SystemServer就会依次启动各大服务。
	   -  常见的有服务有TelephonyManager、ActivityManager、PackageManager、LocationManager等。
	   -  除了系统服务外，我们也可以自定义自己的服务，然后将它注册到SM中，以此来实现进程间通信。
	-  接着，每个服务启动之后，都会向SystemServer进程中的SM报告，比如：
	   -  我是zhangsan，如果有人要找我请返回0x1234。
	   -  这样SM就建立了一张表，对应着各个Server的名字和地址。
	-  然后，当某个Client想与某个服务通信时，会首先询问SM，SM收到请求后会返回对应的联系方式。
	-  一般情况下Server、Client、SM是分别属于三个不同的进程，因此Client与SM以及Client与Server的通信，都会经过Binder驱动，驱动是整个通信过程的核心，但是做着最重要的工作。

<br>**本节参考阅读：**
- [Binder学习指南](http://weishu.me/2016/01/12/binder-index-for-newer/)

# 第三节 Binder机制跨进程原理 #
　　从上一节中我们知道了如下三点：

	-  通信过程的四个角色：Client、Server、Binder驱动、SM。
	-  Client在与Server通信之前，需要先和SM通信，来获取Server的通信地址。
	-  不论是Client与Server，还是Client与SM之间的通信，都是属于进程间通信，都需要经过Binder驱动来中转。

　　但是我们仍然不清楚当`Client`得到`Server`的地址之后，它到底是如何与`Server`完成通信的。

	-  答案就是：Binder驱动为我们做了一切。


<br>　　接下来通过一个AIDL的实例来讲解Binder的通讯过程。

## 建立链接 ##

<br>　　首先新建一个项目，并在其内创建一个`IDAO.aidl`，内容如下：
``` java
// IDAO.aidl
package org.cutler.aidl;

interface IDAO {
    int add(int i,int j);
}
```

    语句解释：
    -  aidl的文件名必须和接口名一致。
    -  接口和方法前不能加访问权限修饰符和存在修饰符。如：public、static都不可以。
    -  如果你使用Eclipse开发，那么ADT会自动编译这个aidl文件，并为你生成一个IDAO.java文件。
    -  如果你使用的Android Studio开发，那么在创建文件的时候，选择File -> New -> AIDL即可。

<br>　　创建完毕后，Android SDK工具会依照`IDAO.aidl`来生成一个`IDAO.java`文件，它的内容如下所示：
``` java
public interface IDAO extends android.os.IInterface {

    public static abstract class Stub extends android.os.Binder 
            implements org.cutler.aidl.IDAO {
        // 省略若干代码。
        private static class Proxy implements org.cutler.aidl.IDAO {
            // 省略若干代码。
        }
    }

    public int add(int i, int j) throws android.os.RemoteException;
}
```
    语句解释：
    -  从上面代码可以看到，除了IDAO接口外还多出了3个新类：IInterface、IDAO.Stub、IDAO.Stub.Proxy，它们的作用稍后会介绍，此处暂且略过。

<br>　　接着，创建一个服务，并在它的`onBind()`方法被调用时，将返回一个`Binder`对象。
``` java
public class MyService extends Service {
    // 注意，此处继承的是IDAO.Stub类。
    private IBinder mBinder = new IDAO.Stub() {
        @Override
        public int add(int i, int j) throws RemoteException {
            return i + j;
        }
    };
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
}
```
    语句解释：
	-  在Android中，如果想让Service中的方法被其他进程调用，就必须在onBind方法中返回一个IBinder对象。
	-  IBinder是一个接口，其内定义了进程间通信所必需的共用方法，只有实现该接口中的方法才能进行进程间通信。
	-  很显然，我们不知道如何实现IBinder接口里的方法，好在Android提供了现成的实现类，即Binder。
	-  也就是说，理论上只要返回一个Binder类的对象，那么我们的Service中的方法就可以被跨进程访问了。
    -  而IDAO.Stub类就继承了Binder类，除此之外它还实现了IDAO接口，所以本范例创建了一个该类对象并返回。

<br>　　然后，配置服务：
``` xml
<service
    android:name="com.cutler.myapplication.MyService"
    android:process=":remote" />
```
    语句解释：
    -  注意此处将MyService类配置到了“:remote”进程中运行。 

<br>　　客户端代码为：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        accessService();
    }

    IDAO dao ;
    public void accessService(){
        Intent  intent = new Intent(this, MyService.class);
        this.bindService(intent, new ServiceConnection(){
            public void onServiceConnected(ComponentName name, IBinder service) {
                dao = IDAO.Stub.asInterface(service);
                try {
                    System.out.println(dao.add(100, 200));
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
            public void onServiceDisconnected(ComponentName name) {	}
        }, Context.BIND_AUTO_CREATE  );
    }
}
```
    语句解释：
    -  IDAO.Stub类里面定义了少量的辅助方法，其中asInterface方法可以将IBinder对象转型为IDAO对象。

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
    -  简单的说，这个方法就是检测MainActivity和MyService是否处在不同的进程中。
    -  如果两者在同一个进程中，则不涉及到IPC操作，此时的obj其实就是onBind方法的返回值，客户端可以直接用它来进行方法调用。
    -  若两者不再同一个进程，则此时的obj是BinderProxy类型的，系统为了让客户端能统一调用obj，所以在其外层封装一下，返回一个IDAO.Stub.Proxy对象。

## 分析实例 ##

<br>　　假设我们此时执行`dao.add(100, 200)`，整个程序的调用流程如下图所示：

<center>
![](/img/android/android_BY_c01_02.png)
</center>

<br>　　由于在我们上面的范例中，客户端和服务端在不同进程，所以当执行`dao.add(100, 200)`时，会先用`IDAO.Stub.Proxy`类的`add`方法：
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
    -  从它的add代码可以看出来，IDAO.Stub.Proxy类的职责是将方法参数给封装起来，以便后续进行跨进程操作。
    -  通过上面的分析，我们已经知道Proxy类的mRemote属性是由Stub的asInterface方法传递过来的。
    -  也就是说，上面第28行代码最终调用的其实是BinderProxy类的transact方法。

<br>　　于是整个调用过程变成了：

	-  首先，Client端通过IDAO.Stub.asInterface(service)获取到一个IDAO对象，并调用它的add方法。
	-  然后，真正被调用的其实是IDAO.Stub.Proxy类的add方法。
	-  接着，IDAO.Stub.Proxy类的add方法又调用了BinderProxy类的transact方法。
	-  最后，在BinderProxy类的transact方法中，会通过JNI去通知Binder驱动调用远程对象的add方法。

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
	-  然后，通过查看源码可知，在它的内部又会转调用它自己的onTransact方法。
	-  最后，由于Server端的本地对象是Stub，且它重写了Binder类的onTransact方法，所以接下来看看它的源码。

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

# 第四节 ServiceManager #
　　在第二节中提到了一个`“通话中心的数据库”`的概念，Android中是确实存在这样的一个类的：`ServiceManager`。

	-  需要注意的是，ServiceManager其实有两个实现：
	   -  管理Java系统服务的ServiceManager
	   -  管理本地系统服务的ServiceManager
	-  Java系统服务通过Java层的ServiceManager注册服务，本地系统服务通过C/C++层的ServiceManager注册服务，二者通过JNI连接在一起。

<br>　　如果你对`SM`的启动感兴趣，可以看看老罗的[ 这篇文章 ](http://blog.csdn.net/luoshengyang/article/details/6621566)。

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
　　







