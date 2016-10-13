title: 进阶篇　第一章 IPC机制
date: 2015-9-24 17:39:58
categories: Android开发 - 青铜
---
　　本章来介绍一下`Android`的`IPC`（进程间通信）机制，主要参考书籍：[《Android开发艺术探索》](http://item.jd.com/1710650057.html)，并加上了笔者自己的体会。

# 第一节 简介 #
<br>**问题描述**
　　通常在计算机领域中每一个应用程序都拥有自己的进程，各自都只在自己的进程中运行，相互不干扰。但是，有些时候设备中的两个进程之间需要进行通信、传递数据，这就需要用到`IPC`技术了。

　　目前，很多操作系统不支持跨进程内存共享，Android也不例外，一个进程通常不能像访问本进程内存一样访问其他进程的内存。因此，若进程间想要对话，则就需要将对象`拆解`为操作系统可以理解的基本数据单元，并且有序的通过`进程边界`。
<!-- more -->
<br>**多进程的分类**
　　多进程的情况分两种：

	-  第一种，相互通信的两个进程属于同一个应用。
	   -  比如应用中的某些模块由于特殊原因需要运行在单独的进程中，此时就需要在一个应用内部开启多个进程。
	   -  又或者为了增大应用可使用的内存，而使用多进程来获取多份的内存空间，因为系统为每个进程分配的空间是有限的。
	-  第二种，相互通信的两个进程属于完全不同的应用。
	   -  比如我们在使用ContentProvider查询数据时，就是在进行进程间通讯，只不过通信细节被系统内部屏蔽了。

# 第二节 多进程模式 #
　　正常情况下，我们常说的多进程是指一个应用中存在多个进程的情况，因此这里不讨论两个应用之间的多进程情况，不过二者并没有太大区别。

　　在Android中有两种使用多进程的方法：

	-  第一种，在清单文件中为四大组件指定android:process属性。
	   -  也就是说我们只能让四大组件运行在单独的进程中，其它类则不行。
	-  第二种，通过JNI在native层fork一个新的进程。
	   -  此方法属于特殊情况，并不常用，因此我们也不关注它。

<br>　　范例1：让Activity运行在不同的进程中。
``` xml
<activity
    android:name=".MainActivity"
    android:screenOrientation="portrait">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>

<activity android:name=".SecondActivity" android:process=":remote"/>
<activity android:name=".ThirdActivity" android:process="com.test.process.remote"/>
```

    语句解释：
    -  上面创建了三个Activity，但是只有后两个Activity指定了android:process属性。
    -  运行程序并依次打开这三个Activity后，系统中会看到三个进程：
       -  com.cutler.test
          -  MainActivity所在的进程，由于没有为其指定process属性，它自动运行在默认进程中，默认进程的名字就是包名。
       -  com.cutler.test:remote
          -  SecondActivity所在的进程。
       -  com.test.process.remote
          -  ThirdActivity所在的进程。

<br>　　上面SecondActivity和ThirdActivity的`android:process`属性的值分别为`:remote`和`com.test.process.remote`，它们的区别有两点：

	-  首先，“:”表示这是一种简写，系统要在进程名前附加上当前的包名。
	   -  对于SecondActivity来说，它最终的进程名为com.cutler.test:remote。
	   -  对于ThirdActivity来说，它使用的是完整的写法，因此不会附加包名信息。
	-  其次，进程名以“:”开头的进程属于当前应用的私有进程，其他应用的组件不可以和它跑在同一个进程中。
	   -  而进程名不以“:”开头的进程则属于全局进程，其他应用通过ShareUID方式可以和它跑在同一个进程中。

<br>　　多进程实现虽然起来很简单，但是也会带来一些问题，比如说我们有这么一个类：
``` java
public class UserManager {
    public static int userId = 1;
}
```
　　接着按照下面的步骤修改代码：

	-  首先，在MainActivity中将userId修改为2，然后输出userId的值。
	-  然后，启动SecondActivity，并在SecondActivity中也输出userId的值。

　　程序运行的时候，在`SecondActivity`中输出的是`1`，而不是`2`。

<br>　　这是因为，系统会为每个进程都分配一个虚拟机，并且`类、变量只能保证在虚拟机内部唯一存在，但在虚拟机之间无法保证`，即当前操作系统中有多个`UserManager`类的副本。
　　因此，在进程`com.cutler.test`中修改了`UserManager`类的变量，并不会影响到`com.cutler.test:remote`进程。

<br>　　这也意味着我们没法通过内存来共享数据了，而且使用多进程还会造成如下几个方面的问题：

	-  静态成员和单例模式失效。
	-  线程同步机制失效。
	-  SharedPreferences的可靠性下降，因为存在并发读写的问题。
	-  Application对象会多次创建。
	   -  和UserManager类一样，有几个进程就会有几个Application对象，各个Application运行在自己的进程里，互不干扰。

<br>　　为了解决进程之间通信、数据共享的问题，系统为我们提供了多种方法，后面会依次介绍它们。

# 第三节 IPC基础知识 #
　　本节主要介绍IPC中的一些基础概念，主要包含三个方面内容：`Serializable`、`Parcelable`以及`Binder`。
　　只有熟悉这三方面的内容后，我们才能更好的理解跨进程通信的各种方式。

## Serializable ##
　　`java.io.Serializable`是Java提供的一个序列化接口，它是一个空接口，为对象提供标准的序列化和反序列化操作。

　　问：什么是对象序列化？
　　答：将对象转成字节并保存在硬盘的操作就是对象序列化，相应的从磁盘中将序列化后得到的数据给读到内存中，并还原成对象的操作就是对象反序列化。

<br>　　范例1： 序列化对象。
``` java
class Person implements Serializable {

    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String toString() {
        return "姓名：" + this.name + "; 年龄: " + this.age;
    }
}

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            ObjectOutputStream out = new ObjectOutputStream(openFileOutput("a.txt", Context.MODE_PRIVATE));
            out.writeObject(new Person("张三", 40));
            out.close();
            ObjectInputStream in = new ObjectInputStream(openFileInput("a.txt"));
            Person p = (Person) in.readObject();
            in.close();
            System.out.println(p);
        } catch (Exception e) {
            System.out.println("======== 异常："+e.getMessage());
            e.printStackTrace();
        }
    }

}
```
    语句解释：
    -  使用ObjectOutputStream类的writeObject()方法进行序列化操作。
    -  使用ObjectInputStream类的readObject()方法进行序列化操作。
    -  对象会被递归序列化，因此对象所有属性必须都实现了Serializable接口，否则会导致该对象序列化失败。
    -  另外，使用transient修饰的属性不会被序列化，静态属性也不会被序列化。

　　查看`"a.txt"`文件内容显示大致为：
``` c
 sr cxy.zy.io.Personv-邇n I ageL namet Ljava/lang/String;xp   (t 寮犱笁
```
　　上面大体可以看到，所谓的对象序列化其实序列化的内容是：包名、类名、类中的属性、属性所在的类以及属性的取值。
　　但是并没有序列化方法，因为方法都是固定不变的，而对象间的区别实际上就在于属性上。

<br>　　在对象序列化的时候，会存在一个问题，假设我们执行如下步骤：

	-  首先，创建一个Person类，它有两个属性name、age。
	-  然后，实例化一个Person类的对象，并将该对象序列化它到本地。
	-  然后，修改一下Person类，比如修改属性的名字、或者添加一个新的属性等。
	-  接着，在新的Person类上，对刚才生成的文件进行反序列化操作。
	-  最后，程序运行的时候就会抛异常。

　　这是因为序列化时，还需要在`Person`类中定义一个常量`static final long serialVersionUID`，它用来标识当前类的版本号：

	-  序列化时，JVM会将serialVersionUID同时写到文件中。
	-  反序列化时，JVM会把传来的字节流中的serialVersionUID与Person.class文件中的SerialVersionUID比较：
	   -  如果相同，则就认为版本一致，可以进行反序列化。
	   -  如果不相同，则就认为版本不一致，就抛“序列化版本不一致”异常。

　　虽然我们上面并没有定义它，但是系统却会依据`Person`的属性名、属性的标识符等自动生成的一个`serialVersionUID`。

　　为了解决反序列化时版本不匹配导致的问题，我们可以显式的在`Perosn`中定义一个`serialVersionUID`，它的值可以随便设置。这样一来不论如何修改`Person`类，只要本地文件和类文件的`serialVersionUID`相同，那么序列化的时候就不会抛异常，并且只会将两者都有的属性进行反序列化。

<br>**序列化一组对象**
　　由于Object类型的引用变量是可以接受任意引用类型的对象的，因此可以利用此特点来序列化一组对象。
``` java
out.writeObject(
    new Person[]{
        new Person("张三",40),
        new Person("李四",42),
        new Person("王五",20)
    }
);
```
　　相应的反序列化时就需要向下转型成数组类型`Person[] p = (Person[]) in.readObject();`。

　　在序列化对象时要将所有对象一次性序列化完毕，因为：

	-  序列化时，会先写入一个头部，然后写入数据，最后加上结束符号。
	-  如果使用追加方式写入的话，那新数据就会在文件末尾继续向下写入。
	-  但是在读取时只会读到第一个结束符就停止，后来再次写入的数据就根本都不到了，若仍然继续读，就会抛StreamCorruptedException异常，这个异常和EOFException颇为相似。
	-  因此，不要用追加的方式序列化对象，要一次性序列化完所有的对象后，再关闭ObjectOutputStream。

## Parcelable ##
　　`Android`在`Activity`之间传递`JavaBean`对象时，可让`JavaBean`对象实现`Serializable`或`Parcelable`接口，对象最终会通过序列化和反序列化的方式被传递。
　　通过`Parcelable`接口来传递`Javabean`对象效率比实现`Serializable`接口高，另外如果想要通过`IPC`将一个对象从一个进程传递给另外一个进程，那么该类必须支持`Parcelable`接口。

　　创建一个支持`Parcelable`协议的类，需要如下几个步骤：

	-  首先，让你的类实现Parcelable接口。
	-  然后，再让该类实现public void writeToParcel(Parcel out)方法，以便将对象的当前属性写入包装对象中（Parcel）。
	-  最后，再在该类中增加一个Parcelable.Creator接口的静态对象CREATOR，用来执行反序列化。

<br>　　范例1：实现Parcelable接口。
``` java
public class Person implements Parcelable {
    private int age;	
    private String name;	
	
    public int describeContents() {
        return 0;
    }

    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(age);
        dest.writeString(name);
    }

    public static final Parcelable.Creator<Person> CREATOR = new Parcelable.Creator<Person>() {
        public Person createFromParcel(Parcel source) {
            Person p = new Person();
            p.age = source.readInt();
            p.name = source.readString();
            return p;
        }
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };
}
```
    语句解释：
    -  各个字段读的顺序和写的顺序必须一致。

<br>　　`Parcelable`其实也是在进行序列化和反序列化操作，系统在使用`Parcelable`的步骤是这样的：

	-  首先，系统调用writeToParcel方法要求JavaBean把自己的各个字段写入到一个Parcel对象中。
	-  然后，系统会将Parcel对象传递到目的地去。
	-  最后，数据到达目的地后，系统再调用Parcelable.Creator接口中提供的方法，从Parcel中将各个数据读出来，然后创建出一个JavaBean对象。

## Binder ##
　　在稍后介绍的IPC的众多实现方式中，有好几种都是基于Binder机制来实现的，这里的Binder机制指的是“绑定方式启动服务”。

　　Binder机制有如下特点：

	-  由客户端和服务端两部分组成：
	   -  客户端通常是一个Activity，它通过bindService方法来绑定到服务端。
	   -  服务端通常是一个Service。
	-  服务端：
	   -  在第一个访问者和服务建立连接时，会调用服务的onBind方法，该方法需要返回一个IBinder类型的对象。
	   -  当最后一个访问者被摧毁，服务的onUnbind方法被调用，不要在普通的广播接收者中通过绑定方式启动服务，因为广播接收者生命周期短暂。
	   -  在Activity中，可以通过调用unbindService()方法来关闭与服务连接。
	-  客户端：
	   -  调用bindService方法绑定服务时，需要提供一个ServiceConnection对象。
	   -  通过其持有的IBinder对象，可以调用远程Service中定义的方法。

<br>　　关于`Binder`机制，更详细的介绍请参看[《入门篇　第三章 Service》](http://cutler.github.io/android-A03/)。

# 第四节 IPC的实现方式 #
　　本节开始详细介绍各种跨进程通信的方式。
## Bundle ##
　　我们知道，四大组件中有三大组件都支持在`Intent`中传递`Bundle`数据，由于`Bundle`实现了`Paracelable`接口，所以它可以方便地在不同的进程间传输。

　　不过我们传输的数据必须能够被序列化，比如基本类型、实现了`Paracelable`和`Serializable`接口的对象、Android支持的特殊对象，Bundle不支持的类型我们是无法跨进程传递的。

## 文件共享 ##
　　两个进程通过`读/写`同一个文件来交换数据，比如A进程把数据写入文件，B进程通过读取这个文件来获取数据。

　　这种方法虽然能实现通信，但是仍然有三个缺点：

	-  第一，文件如果并发读写，则可能会导致数据丢失、混乱。
	-  第二，两个进程之间仍然需要发送广播来通知对方，自己已经把数据写到本地了，你可以读了。
	-  第三，文件读写涉及到了IO操作，如果数据量大的话，性能上会有所降低，但一般不会有太大影响。

　　虽然我们一般都不会使用此方法来进行进程间通信，但是还是得注意一下，避免并发访问`SharedPreferences`文件。
## Messenger ##
　　`Messenger`可以翻译为信使，通过它可以在不同进程中传递`Message`对象，在`Message`中放入我们需要传递的数据，就可以轻松的实现数据在进程间的传递了。
　　学习`Messenger`需要了解`Handler`的用法，如果你还不知道`Handler`，请先阅读[《进阶篇　第四章 消息机制与线程池》](http://cutler.github.io/android-F04/)。

　　以下是信使(`Messenger`)对象的使用概要：

	1、服务端，定义一个Handler对象，客户端发送来的请求，都将由它来处理。
	2、服务端，使用这个Handler对象来创建一个信使(Messenger)对象。
	3、服务端，调用Messenger对象的getBinder()方法创建一个准备返回给客户端的IBinder对象。
	4、客户端，绑定成功后，使用这个IBinder对象来实例化一个新的信使对象，客户端使用这个信使给服务端发送Message对象。
	5、服务端，在它的Handler的handleMessage()方法中依次接收客户端发来的每个Message对象，并处理。

<br>　　范例1：客户端MainActivity（代码片段）。
``` java
public class MainActivity extends Activity {

    // 客户端的信使对象，用于接收服务端发来的响应。
    Messenger mMessenger = new Messenger(new Handler(){
        public void handleMessage(Message msg) {
            if (msg.what == 2) {
                System.out.println(msg.arg1);
            }
        };
    });

    ServiceConnection conn = new ServiceConnection() {
        public void onServiceDisconnected(ComponentName name) { }
        public void onServiceConnected(ComponentName name, IBinder service) {
            // 使用服务端传递过来的IBinder对象创建一个信使对象，客户端通过这个信使对象向服务端发送请求。
            Messenger messenger = new Messenger(service);
            Message msg = new Message();
            msg.what = 1;
            msg.arg1 = 5;
            msg.arg2 = 5;
            // 设置回调信使。当服务端处理完客户端请求后，会将响应发送给这个信使对象。
            msg.replyTo = mMessenger;
            try {
                // 使用服务端的Messenger对象发送一个Message对象。
                messenger.send(msg);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    };
}
```

<br>　　范例2：服务端MyService。
``` java
public class MyService extends Service {

    // 服务端的信使对象，用来接收来自各个客户端的请求。
    private Messenger mMessenger = new Messenger(new Handler() {
        // 当客户端发来请求时，系统会回调handleMessage方法处理请求。
        public void handleMessage(android.os.Message msg) {
            if (msg.what == 1) {
                Message newMsg = Message.obtain();
                newMsg.what = 2;
                newMsg.arg1 = add(msg.arg1, msg.arg2);
                try {
                    // 请求处理完毕后，将处理结果封装成一个Message对象，然后发送给客户端的信使对象。
                    msg.replyTo.send(newMsg);
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
        };
    });

    public IBinder onBind(Intent intent) {
        // 使用与mMessenger关联的Binder对象。
        return mMessenger.getBinder();
    }

    public int add(int a, int b) {
        return a + b;
    }
}
```

    语句解释：
    -  首先，服务端构造了自己的信使（mMessenger），用于接收来自各个客户端的请求。
	-  然后，当服务绑定成功时会返回一个IBinder对象，客户端通过IBinder发送的请求都将被送到mMessenger的Handler中处理。
	-  最后，服务端回复请求时，则会对请求（Message对象）的replyTo所指向的信使发送消息。

<br>　　**何时使用信使？(Messenger)**

	信使以串行的方式处理客户端发来的消息，服务每次只能接收一个请求，消息按照先进先出的顺序被处理，因此你不需要针对线程安全来设计你的服务。

　　使用信使进行IPC通信有两个缺点：

	-  第一，信使一次只能处理一个消息，没法并发处理多个请求。
	-  第二，信使是基于消息机制的，而消息机制又是异步的，因此如果你需要依据远程进程的返回值来执行后续操作，那就不得不将代码写在回调中。

　　因此，如果你既不需要并发处理，也不需要实时响应，那么请使用`Messenger`，因为它是最简单的`IPC`实现方案。
　　但是，如果你需要并发访问或者实时响应的话，那`Messenger`就无能为力了，不过我们还有其它IPC方案，比如`AIDL`。
　　事实上，`Messenger`内部就是通过`AIDL`来实现`IPC`的，如果确定使用`AIDL`的话，你必须自己处理并发访问以及线程安全。

## AIDL ##
　　AIDL是基于`Binder`来实现的。

### 基础用法 ###

<br>**什么是AIDL**
　　AIDL(Android Interface Definition Language，Android接口定义语言)

　　通信，无论是在两个进程之间，还是在人与人之间，一定会有一个`发起方`和一个`接收方`。
　　使用`AIDL`技术的两个进程也是如此，由接收方(`Server`)进程定义接口，发起方(`Client`)进程按照接口的规范，进行请求。

<br>　　AIDL的大致工作流程（为了方便理解，笔者省写了一些东西，后面会具体介绍）：

	-  第一步，在Server端，使用AIDL来定义一个接口，接口中定义了若干抽象方法，假设这个接口叫A。
	-  第二步，在Server端，找一个类来实现这个接口A，并重写其内的抽象方法。
	-  第三步，在Server端，创建一个Service类，并在其onBind方法中返回接口A的实现类。
	-  第四步，在Client端，依据不同的情况，执行下面的操作：
	   -  若Client和Server端是同一个项目里的不同进程，则什么都不需要做。
	   -  若Client和Server端完全不同的两个项目，则需要将Server端定义的AIDL文件原样copy到Client的项目中。
	-  第五步，在Client端，通过绑定的方式启动服务端的Service，并在连接成功后持有服务端返回的引用。

　　我们接下来就一步步的按照上面的步骤来吧。


<br>**创建AIDL文件**
<br>　　在创建AIDL文件之前，先来看一下它的一些特点：

	-  AIDL文件的后缀名为.aidl。
	-  AIDL文件也保存在src目录下。
	-  AIDL的语法和Java的interface高度相似，不过我们不能直接使用AIDL编写出来的代码，而是需要将它转为.java文件才行。
	   -  这个工作由IDE来调用AndroidSDK里的工具来完成，最终会在gen目录下产生一个.java文件，以供我们使用。

<br>　　首先创建`org.cutler.aidl`包，并在其内创建一个`IDAO.aidl`，内容如下：
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
    -  如果你使用的Android Studio开发，那么在创建文件的时候，选择File -> New -> AIDL即可，具体请自行摸索。

<br>**创建服务**
<br>　　按照刚才说的，Android SDK工具会依照`IDAO.aidl`来生成一个`IDAO.java`文件，它的内容如下所示：
``` java
public interface IDAO extends android.os.IInterface {

    public static abstract class Stub extends android.os.Binder implements org.cutler.aidl.IDAO {
        // 省略若干代码。
    }

    public int add(int i, int j) throws android.os.RemoteException;
}
```
    语句解释：
    -  开发时，我们不会直接使用IDAO接口，而会使用它的抽象内部类Stub。
       -  因为Stub继承了Binder，这样它就可以通过Binder机制跨进程。
       -  同时Stub也实现了IDAO接口，但没重写IDAO中的方法，留给它的子类去重写。
    -  另外，所有在Binder中传输的接口都需要继承IInterface这个接口。

<br>　　接下来要做的就是，在你应用程序中实现该接口，并在`Service`的`onBind()`方法被调用时，将该实例返回。

<br>　　范例1：MyService。
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

<br>　　范例2：配置服务。
``` xml
<service android:name="com.cutler.androidtest.MyService" android:process=":remote">
    <intent-filter>
        <action android:name="com.cutler.androidtest.MyService" />
    </intent-filter>
</service>
```

    语句解释：
    -  由于可能在其他应用程序中绑定MyService类，而在其他应用中又无法直接通过类名绑定，因此设置了意图过滤器。 

<br>**客户端代码**
<br>　　范例1：客户端代码。
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        accessService();
    }

    IDAO dao ;
    public void accessService(){
        Intent  intent = new Intent();
        intent.setAction("com.cutler.androidtest.MyService");
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

<br>　　注意，如果客户端和服务端是完全不同的两个项目，则需要：

	-  把服务端定义的IDAO.aidl文件复制到客户端的项目中即可。
	-  在服务端时IDAO.aidl被放到了org.cutler.aidl包中，那么在客户端时IDAO.aidl也必须放到org.cutler.aidl包中。
<br>　　如果客户端真和服务端不再一个项目里的话，那我们还得保证手机上已经安装了服务端应用，否则客户端是访问不了服务端的。这也就是为什么前面我们说，不同应用之间的进程间通信我们不做考虑，因为还得确保服务端程序安装到设备上了。
　　不过掌握了这个知识后，我们却可以使用Android系统提出的AIDL接口。

<br>**传递复杂类型**
<br>　　AIDL所支持的数据类型：

	-  java基本类型（int、long、boolean等）、String、CharSequence、List和Map（它们之中的元素类型必须是AIDL支持的类型），这些类型不需要import导入就可以使用。
	-  如果需要使用自定义类型作为方法的参数或返回值，自定义类型必须实现Parcelable接口。在AIDL文件中需要显式import自定义类型，即便该类型和AIDL文件定义的包在同一个包中。
	-  所有的AIDL接口本身也可以在AIDL文件使用。
	-  在AIDL文件中所有非Java基本类型参数必须加上in（传入参数）、out（传出参数）、inout（传入传出参数）标记，这样可以降低序列化的消耗，Java原始类型默认的标记为in，不能为其它标记。

<br>　　接下来我们添加一个Person类，具体的过程如下：

<br>　　1、在服务端的`org.cutler.aidl.entity`包中创建一个`Person`类，并实现`Parcelable`接口，代码如下：
``` java
package org.cutler.aidl.entity;

import android.os.Parcel;
import android.os.Parcelable;
public class Person implements Parcelable {
    private int age;
    private String name;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int describeContents() {
        return 0;
    }

    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(age);
        dest.writeString(name);
    }

    public static final Parcelable.Creator<Person> CREATOR = new Parcelable.Creator<Person>() {
        public Person createFromParcel(Parcel source) {
            Person p = new Person();
            p.age = source.readInt();
            p.name = source.readString();
            return p;
        }

        public Person[] newArray(int size) {
            return new Person[size];
        }
    };
}
```
<br>　　2、在服务端的`org.cutler.aidl.entity`包中创建一个`Person.aidl`文件，内容如下： 
``` java
// Person.aidl
package org.cutler.aidl.entity;

parcelable Person;
```

    语句解释：
    -  注意aidl文件必须要和Person.java放在同一个包下面。
	-  关键字parcelable必须全部小写。

<br>　　3、修改服务端的`IDAO.aidl`文件，代码如下：
``` java
// IDAO.aidl
package org.cutler.aidl;
import org.cutler.aidl.entity.Person;

interface IDAO {
    int add(int i,int j);

    Person newInstance(int age, String name);
}
```

    语句解释：
    -  在IDAO.aidl文件中，需要使用import关键字，导入Person的aidl文件。

<br>　　4、修改服务端的`MyService`类。
``` java
public class MyService extends Service {

    private IBinder mBinder = new IDAO.Stub() {
        @Override
        public int add(int i, int j) throws RemoteException {
            return i + j;
        }

        @Override
        public Person newInstance(int age, String name) throws RemoteException {
            Person p = new Person();
            p.setName(name);
            p.setAge(age);
            return p;
        }
    };

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

}
```

    语句解释：
    -  当Client端绑定完服务并调用newInstance方法时，该方法就会创建一个Person对象并返回。


<br>　　5、如果有需要，则将服务端定义的`IDAO.aidl`、`Person.aidl`、`Person.java`三个文件及它们所在的目录，复制到客户端项目中，以供客户端使用。


<br>　　6、客户端通过绑定的方式启动服务端的Service即可。

<br>　　提示：如果你使用的是`AndroidStudio`并且在运行项目的时候，提示`程序包org.cutler.aidl.entity不存在`，则把下面代码添加到`app`的`build.gradle`文件的`android`块中即可。
``` gradle
sourceSets {
    main {
        java.srcDirs = ['src/main/java', 'src/main/aidl']
    }
}
```

<br>　　如果你以为到这里AIDL的介绍就结束了，那你就错了。
<br>
### 事件回掉 ###
　　假设我们有这样的需求：每当服务端的数据发生变化时，它会通知所有客户端数据已经发生变化了。
　　这是一种典型的观察者模式，客户端不需要定时的去检查服务端的数据，省去了不少麻烦，我们接下来就来完成这个需求。

<br>　　第一步，创建`IOnNewPersonListener.aidl`，用来让客户端接收服务端的通知。
``` java 
// IOnNewPersonListener.aidl
package org.cutler.aidl;

import org.cutler.aidl.entity.Person;

interface IOnNewPersonListener {
    void onNewPerson(in Person p);
}
```
    语句解释：
    -  参数Person前面需要使用in关键字。

<br>　　第二步，修改`IDAO.aidl`，添加两个新的方法，分别用来注册、删除观察者。
``` java
// IDAO.aidl
package org.cutler.aidl;
import org.cutler.aidl.entity.Person;
import org.cutler.aidl.IOnNewPersonListener;

interface IDAO {
    int add(int i, int j);

    Person newInstance(int age, String name);

    void registerListener(IOnNewPersonListener listener); // 添加观察者。

    void unregisterListener(IOnNewPersonListener listener); // 删除观察者。
}
```

<br>　　第三步，修改`MyService`，重写新加两个新的方法，并定时创建`Person`对象。
``` java
public class MyService extends Service {

    // 观察者列表
    private CopyOnWriteArrayList<IOnNewPersonListener> 
                 list = new CopyOnWriteArrayList<IOnNewPersonListener>();
    // 标识Servier的onDestory方法是否被调用。
    private AtomicBoolean mIsServiceDestoryed = new AtomicBoolean(false);

    private IBinder mBinder = new IDAO.Stub() {
        @Override
        public int add(int i, int j) throws RemoteException {
            return i + j;
        }

        @Override
        public Person newInstance(int age, String name) throws RemoteException {
            Person p = new Person();
            p.setName(name);
            p.setAge(age);
            return p;
        }

        @Override
        public void registerListener(IOnNewPersonListener listener) throws RemoteException {
            if (listener != null) {
                list.add(listener);
                System.out.println("添加，当前列表中监听器的个数为：" + list.size());
            }
        }

        @Override
        public void unregisterListener(IOnNewPersonListener listener) throws RemoteException {
            if (list.contains(listener)) {
                list.remove(listener);
                System.out.println("执行删除，列表中还有：" + list.size());
            } else {
                System.out.println("无法删除，列表中没有它：" + list.size());
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        // 开启一个线程，每3秒创建一个Person对象，并通知所有客户端。
        new Thread(new Runnable() {
            public void run() {
                while (!mIsServiceDestoryed.get()) {
                    try {
                        Thread.sleep(3000);
                        for (IOnNewPersonListener listener : list) {
                            Person p = new Person();
                            p.setName("name - " + System.currentTimeMillis());
                            p.setAge((int) (20 + System.currentTimeMillis() % 10));
                            listener.onNewPerson(p);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // 将变量标识为true，停止每3秒创建一个Person对象。
        mIsServiceDestoryed.set(true);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

}
```

<br>　　第四步，修改`MainActivity`。
``` java
public class MainActivity extends Activity {

    // 注意此处的内部类是IOnNewPersonListener.Stub类型的。
    private IOnNewPersonListener mListener = new IOnNewPersonListener.Stub() {
        @Override
        public void onNewPerson(Person p) throws RemoteException {
            System.out.println(Thread.currentThread()+" 收到新Person："+p.getName()+","+p.getAge());
        }
    };

    private ServiceConnection conn = new ServiceConnection() {
        public void onServiceConnected(ComponentName name, IBinder service) {
            dao = IDAO.Stub.asInterface(service);
            try {
                dao.registerListener(mListener);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }

        public void onServiceDisconnected(ComponentName name) {
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        accessService();
    }
    IDAO dao ;
    public void accessService(){
        Intent  intent = new Intent();
        intent.setAction("com.cutler.androidtest.MyService");
        this.bindService(intent, conn, Context.BIND_AUTO_CREATE);
    }

    @Override
    protected void onDestroy() {
        try {
            dao.unregisterListener(mListener);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
        unbindService(conn);
        super.onDestroy();
    }
}
```
    语句解释：
    -  当服务连接成功时，执行注册观察者的操作，当Activity被关闭时，删除观察者并取消服务绑定。

<br>　　程序运行时，从表面上看一切都正常，但是当我们关闭`MainActivity`时，服务端却并没有将观察者成功删除。
　　这是因为虽然客户端在注册和删除观察者时传递的`IOnNewPersonListener`对象是同一个，但是当程序执行在服务端时，每次接到的都是一个新的`IOnNewPersonListener`对象。

<br>　　系统专门提供的用于删除跨进程`listener`的泛型类`RemoteCallbackList`。它支持管理任意的AIDL接口，这点从它的声明就可以看出，因为所有的AIDL接口都继承自`IInterface`接口：
``` java
public class RemoteCallbackList<E extends IInterface>
```

<br>　　它的工作原理很简单，在它的内部有一个Map属性，专门用来保存所有的AIDL回调，这个Map的key是`IBinder`类型的，value是`Callback`类型，如下所示：
``` java
ArrayMap<IBinder, Callback> mCallbacks = new ArrayMap<IBinder, Callback>();
```
　　其中Callback中封装了真正的远程listener。当客户端注册listener的时候，它会把这个listener存入到mCallbacks中，其中key和value分别通过下面的方式获得：
``` java
IBinder binder = callback.asBinder();
Callback cb = new Callback(callback, cookie);
```
<br>　　也就是说，虽然多次跨进程客户端传递过来的同一个对象在服务端会生成不同的对象，但是这些新对象有一个共同点，就是它们的底层的`Binder`对象是同一个，利用这个特性就可以实现上面我们无法实现的功能。
　　同时`RemoteCallbackList`还有一个很有用的功能，那就是当客户端进程终止后，它能自动移除客户端所注册的listener。
　　另外，`RemoteCallbackList`内部已经实现了线程同步的功能，所以我们使用它来注册和解注册时，不需要做额外的线程同步工作。

<br>　　最终修改后的MyService的代码为：
``` java
public class MyService extends Service {

    private RemoteCallbackList<IOnNewPersonListener> list = new RemoteCallbackList<IOnNewPersonListener>();
    private AtomicBoolean mIsServiceDestoryed = new AtomicBoolean(false);

    private IBinder mBinder = new IDAO.Stub() {
        @Override
        public int add(int i, int j) throws RemoteException {
            return i + j;
        }

        @Override
        public Person newInstance(int age, String name) throws RemoteException {
            Person p = new Person();
            p.setName(name);
            p.setAge(age);
            return p;
        }

        @Override
        public void registerListener(IOnNewPersonListener listener) throws RemoteException {
            if (listener != null) {
                System.out.println("执行添加" + list.register(listener));
            }
        }

        @Override
        public void unregisterListener(IOnNewPersonListener listener) throws RemoteException {
            System.out.println("执行删除，：" + list.unregister(listener));
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        new Thread(new Runnable() {
            public void run() {
                while (!mIsServiceDestoryed.get()) {
                    try {
                        Thread.sleep(3000);
                        // 我们无法像操作List一样去操作RemoteCallbackList，因为它并不是一个List。
                        // 遍历RemoteCallbackList时：
                        //   先调用beginBroadcast。
                        //   然后是getBroadcastItem。
                        //   最后还需要调用finishBroadcast，具体原因请自行阅读源码。
                        int n = list.beginBroadcast();
                        for (int i = 0; i < n; i++) {
                            IOnNewPersonListener listener = list.getBroadcastItem(i);
                            if (listener != null) {
                                Person p = new Person();
                                p.setName("name - " + System.currentTimeMillis());
                                p.setAge((int) (20 + System.currentTimeMillis() % 10));
                                listener.onNewPerson(p);
                            }
                        }
                        list.finishBroadcast();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mIsServiceDestoryed.set(true);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

}
```

<br>
### 注意事项 ###
　　到这里，AIDL的基本使用方法已经介绍完了，但是有几点还需要再次说明一下。

	第一，客户端调用远程服务的方法时，被调用的方法运行在服务端的Binder线程池中，同时客户端会被挂起。
	-  若你在主线程中调用远程方法，那么远程方法不应该去执行耗时操作，因为客户端会被挂起超过5秒就会抛出ANR。
	-  若你在工作线程中调用远程方法，则远程方法内部可以执行耗时操作。
	第二，客户端的onServiceConnected和onServiceDisconnected都在主线程中运行。
	第三，远程服务调用客户端的方法时，被调用的方法也运行在Binder线程池中，只不过是客户端的线程池。
	第四，默认情况下，我们的远程服务任何人都可以连接，可以通过下面三种方式进行权限验证：
	-  第一种，在Service的onBind中验证，验证不通过则直接返回null。
	-  第二种，重写AIDL接口的Stub类的onTransact方法，若验证失败则直接返回false。
	-  第三种，在清单文件中，为<Service>设置android:permission属性。
	第五，服务端的远程方法可以返回IBinder类型的参数，我们可以依据客户端传递的参数来返回不同的Binder对象，这样就可以不用为每一个AIDL接口都创建一个Service了。

## ContentProvider ##
　　内容提供者(`Content Provider`)是Android的四大组件之一，它主要用来在`应用程序之间`共享数据。
　　通过内容提供者可以：

	-  使当前应用程序产生的数据被其他应用程序访问。
	-  使当前应用程序访问其他应用程序的数据。

<br>**为什么要使用内容提供者来共享数据呢?**
　　数据对于每个应用程序来说都是私有的，默认情况下应用只能修改自己的数据，不能修改其它应用的数据。
　　每个应用都运行在自己的进程中，当应用A需要访问应用B的数据时，数据就需要在不同的虚拟机之间传递，即`IPC`。

　　前面介绍的`Messenger`和`AIDL`更适用于一个应用内部的多个进程之间的IPC，它们可以很轻松的处理请求并返回简单的数据，但是若让它们执行结构化的数据传递，则会稍显麻烦。
　　此时可以使用 `Content Provider`，它能在不同的应用程序之间方便的传递结构化的数据。

<br>**何时使用?**
　　如果你想要把你的应用中的复杂数据或文件复制粘贴到另一个应用程序中，你就需要创建自己的提供者。

<br>
### 基础应用 ###

　　下面通过创建一个简单的内容提供者来介绍ContentProvider类的常用方法。

<br>　　范例1：服务端的MyContentProvider类。
``` java
public class MyContentProvider extends ContentProvider{

    /**
     *  当ContentProvider被创建完成后调用此方法。用于完成一些初始化操作。
     */
    public boolean onCreate() {
        return false;
    }
	
    /**
     * 向内容提供者所在的应用程序中插入数据。
     * @param uri: 要操作的表。 
     * @param values: 要插入的数据。
     * @return 返回新插入的数据的Uri。
     */
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }
	
    /**
     * 从内容提供者所在的应用程序中删除数据。
     * @param uri: 要操作的表。 
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @return 返回受影响的行数。
     */
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }
	
    /**
     * 从内容提供者所在的应用程序中更新数据。
     * @param uri: 要操作的表。 
     * @param values: 要插入的数据。
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @return 返回受影响的行数。
     */
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }

    /**
     * 从内容提供者所在的应用程序中查询数据。
     * @param uri: 要操作的表。 
     * @param projection: 要查询的列。
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @param sortOrder: 排序语句，如：“id desc”含义为：按照id列进行降序排列，升序排列则用“id asc”。
     * @return 返回查询出来的数据。
     */
    public Cursor query(Uri uri, String[] projection, String selection,
                  String[] selectionArgs, String sortOrder) {
        return null;
    }
	
    /**
     * 此方法的作用后面会进行介绍。
     */
    public String getType(Uri arg0) {
        return null;
    }

}
```
    语句解释：
    -  这六个方法里，除了onCreate由系统回调并运行在主线程里之外，其它五个方法均由外界回调并运行在Binder线程池中。

<br>　　与Android的另外三个组件一样，内容提供者也需要在清单文件中配置：
``` xml
<provider
   android:name=".MyContentProvider"
   android:authorities="org.cxy.provider.test"/>
```
    语句解释：
    -  属性android:authorities表示内容提供者的唯一标识。

<br>　　我们可以通过`ContentResolver`类来访问内容提供者。

<br>**插入数据**
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        // 调用Context类中的方法,获取一个ContentResolver对象。
        ContentResolver c =  this.getContentResolver();
        ContentValues values = new ContentValues();
        values.put("name", "Tom!");
        c.insert(Uri.parse("content://org.cxy.provider.test/tab1"), values);
    }
}
```

	语句解释：
	-  ContentResolver类的insert、delete、update、query四个方法内部会转调用ContentProvider的对应方法。
	-  这四个方法都要求传递一个Uri类型的参数，该参数表示本次操作的目标。
	-  Uri的格式：“content://authorities/路径”。
	   -  “content”是固定的，内容提供者的Uri必须是它。
	   -  “authorities”是内容提供者的唯一标识，即清单文件中的android:authorities属性的值。
	   -  “路径”由于内容提供者通常是使用数据库来存储数据，因此“路径”通常是一个表名。
	-  本范例中ContentResolver会调用com.example.test.provider的insert方法。
	-  若在系统中注册了多个android:authorities属性具有相同值的ContentProvider ，则Android系统会调用第一个被找到的ContentProvider。

<br>**查询数据**
　　例如，要从提供者中查询出数据，你要调用`ContentResolver.query()`方法：
``` java
Cursor mCursor = getContentResolver().query(mUri, mProjection, mSelection, mSelectionArgs, mSortOrder);
```

　　下图显示了`ContentResolver.query()`方法的参数是如何跟`SQL`的`select`语句进行匹配的：
<center>
![](/img/android/android_2_15.png)
</center>

<br>**显示查询结构**
　　`ContentResolver.query()`方法返回一个`Cursor`对象，这个对象包含了跟查询条件匹配的行和列。

<br>　　范例1：Cursor接口。
　　此接口代表一个游标，即一个行集，最初游标指向第一个实体之前的位置。
``` java
public interface Cursor implements Closeable {

    /**
     * 将游标移动到下一个实体所在的位置。
     * @return 
     *     若移动成功，则返回true 。
     *     若当前游标移动到最后一个实体的后面，则返回false 。
     *     若数据库已经被关闭，此方法会返回false。
     */
    public abstract boolean moveToNext();

    /**
     * 指定列号，查询出当前行中的指定列上的数据。
     * 除了getString()外还有对应的重载方法用来获取int、long、float、double、short 类型的值。
     * @param columnIndex: 列的编号，列号从0开始。
     * @return 以String类型返回查询结果。
     */
    public abstract String getString(int columnIndex);

    /**
     * 指定列名，查询出该列在本行中所对应的列号。
     * @param columnName: 列的名称。
     * @return 以int类型返回结果。
     */
    public abstract int getColumnIndex(String columnName);

    /**
     * 关闭游标，释放其所占的资源，并将其标记为无效。当不需要使用Cursor对象你应该调用此方法。
     */
    public abstract void close();
}
```

<br>**验证URI**
　　前面说了，不论客户端调用提供者“增删查改”中的哪个方法，都需要提供一个URI，用来告知提供者其所要操作的表。 提供者为了确保客户端传递的URI格式的合法性，需要进行必要的验证。

<br>　　范例1：UriMatcher类。
``` java
public class UriMatcher extends Object {

    /**
     * UriMatcher类用于匹配某个Uri是否满足它的要求。
     * 内容提供者事先向UriMatcher类中添加若干个合法的Uri格式，然后提供者可以把insert、delete等方法中接到的Uri
     * 传递给UriMatcher类进行验证Uri的合法性。
     * @param code: 若用户指定Uri和UriMatcher内所有的Uri都失配时则返回此code 。
     * 
     */
    public UriMatcher(int code);

    /**
     * 向UriMatcher类中添加一个authority和path。
     * @param authority: 提供者的authority
     * @param path: 提供者所支持的path
     * @param code: 当进行匹配的时候，若该Uri和此项匹配成功则返回code
     */
    public void addURI(String authority, String path, int code);

    /**
     * 匹配指定的uri，待匹配uri必须是以“content://”开头。否则无法匹配成功。
     * 在UriMatcher中预先保存的Uri可以使用通配符：
     *     # ：任意数字。 注意 # 必须要在一个单独“/”后面使用。
     *     * ：任意字符。
     * 若Uri为“content://www.cxy.cn/person/5”且UriMatcher预先调用了addURI (“www.cxy.cn”, “person/#”, 1)，
     * 则当调用UriMatcher类的match方法匹配后，将返回1 。
     * @param uri: 要匹配的Uri
     * @return 匹配结果。
     */
    public int match(Uri uri);

}
```

<br>**完整范例**
``` java
public class MyContentProvider extends ContentProvider {

    public static final String AUTHORITIES = "org.cxy.provider.test";

    public static final int PERSON_CODE = 10;
    public static final String PERSON_TNAME = "person";

    public static final int BOOK_CODE = 11;
    public static final String BOOK_TNAME = "book";

    private UriMatcher matcher;

    // 创建一个SQLiteOpenHelper对象，用于操作数据库 。
    private SQLiteOpenHelper dbc;
    private SQLiteDatabase conn;

    public boolean onCreate() {
        matcher = new UriMatcher(UriMatcher.NO_MATCH);
        matcher.addURI(AUTHORITIES, PERSON_TNAME, PERSON_CODE);
        matcher.addURI(AUTHORITIES, BOOK_TNAME, BOOK_CODE);
        dbc = new SQLiteOpenHelper(this.getContext(), "data.db", null, 1) {
            public void onCreate(SQLiteDatabase db) {
                // 创建person表
                db.execSQL("CREATE TABLE " + PERSON_TNAME + "(id integer primary key,name)");
                // 创建book表
                db.execSQL("CREATE TABLE " + BOOK_TNAME + "(id integer primary key,name)");
            }

            public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            }
        };
        conn = dbc.getWritableDatabase();
        return false;
    }

    // 依据Uri，返回表名称
    private String getTableName(Uri uri) {
        int code = matcher.match(uri);
        String tableName = null;
        switch (code) {
            case PERSON_CODE:
                tableName = PERSON_TNAME;
                break;
            case BOOK_CODE:
                tableName = BOOK_TNAME;
                break;
        }
        return tableName;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        String tname = getTableName(uri);
        if (uri == null) {
            throw new IllegalArgumentException("Uri not Found!");
        }
        conn.insert(tname, null, values);
        return uri;
    }


    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        String tname = getTableName(uri);
        if (uri == null) {
            throw new IllegalArgumentException("Uri not Found!");
        }
        return conn.query(tname, projection, selection, selectionArgs, null, null, sortOrder);
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        String tname = getTableName(uri);
        if (uri == null) {
            throw new IllegalArgumentException("Uri not Found!");
        }
        return conn.delete(tname, selection, selectionArgs);
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        String tname = getTableName(uri);
        if (uri == null) {
            throw new IllegalArgumentException("Uri not Found!");
        }
        return conn.update(tname, values, selection, selectionArgs);
    }

    @Override
    public String getType(Uri uri) {
        return null;
    }
}
```

	语句解释：
	-  在用户程序中访问其他程序的内容提供者时，若该内容提供者所在的程序当前在操作系统中没有运行，则操作系统会自动运行那个程序，以保证数据能顺利的提供给访问者。

<br>
### 实现权限 ###
　　你可以在清单文件中用一个或多个`<permission>`元素给你的提供者定义权限。

　　总体的步骤为：

	-  首先，在提供者所在的应用程序的清单文件中，使用<permission>标签定义一个权限。
	-  然后，注册提供者时，设置<provider>标签permission的属性。
	-  最后，在访问者所在的应用程序中使用<uses-permission>标签申请权限。

<br>　　范例1：定义读权限。
``` xml
<permission android:name="com.example.app.provider.permission.READ_PROVIDER"/>
```
	语句解释：
	-  当应用程序想自定义权限时，只需要在AndroidManifest.xml文件中，使用标签<permission>定义一个权限，这个权限将被注册到Android系统中。

<br>　　范例2：限制访问者必须具备权限。
``` xml
<provider
   android:name=".MyContentProvider"
   android:authorities="org.cxy.provider.test"
   android:permission="com.example.app.provider.permission.READ_PROVIDER"/>
```
	语句解释：
	-  通过为<provider>标签permission的属性设定值来要求访问者所在的应用程序所必须具有的权限。 

<br>　　范例3：使用权限。
``` xml
<uses-permission android:name="com.example.app.provider.permission.READ_PROVIDER" />
```
	语句解释：
	-  在访问者所在的应用程序中，需要使用<uses-permission>标签来告诉Android系统，其所想要使用的权限。
	-  由于只有被注册到Android系统的权限，其他用用程序才可以通过<uses-permission>标签去申请，因此，如果在提供者所在的应用程序中，并没有使用<permission>标签定义权限，仅仅是在<provider>标签的permission属性上指定了权限，则其他应用程序是无法访问此提供者的，即便该应用程序使用了<uses-permission>标签。
	-  若应用程序没有访问其他应用程序中的提供者的权限，且试图访问，则运行时会抛出异常。

## Socket ##
　　在Android中，也可以通过`Socket`来实现进程间通信，在服务端开启一个`Socket`，然后服务端就可以等待客户端接入了。网上`Socket`的教程有很多，笔者就不再冗述了。

<br><br>