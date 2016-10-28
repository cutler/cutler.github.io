title: 架构篇　第一章 设计模式
date: 2015-6-29 17:15:30
categories: Android开发 - 不屈白银
---
　　在应用开发过程中，最难的不是完成应用的开发工作，而是在后续的升级、维护过程中让应用系统能够在满足需求且不破坏系统稳定性的前提下，保持高可扩展性、高内聚、低耦合，在经历了各版本的变更后依然保持清晰、灵活、稳定。
　　当然，这是一个比较理想的情况，但我们必须要朝着这个方向去努力。

　　本章主要参考[《Android 源码设计模式解析与实战》](https://item.jd.com/11793928.html)，感谢二位作者的无私奉献。

# 第一节 问题起源 #

<br>**什么是设计模式？**

　　按照百度百科的介绍：

>设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。

　　简单的说，设计模式就是一些写代码的套路，按照这些前人总结出来的套路去写代码，可以写出质量更高的代码。

<br>**为什么要学设计模式？**

　　就像一开始说的，软件开发并不难，难的是后期的维护，下面说一个笔者亲身经历的事情：

	-  机缘巧合下，我需要去维护一个nodejs+python开发的网站（但之前根本没学过这两者）。
	-  而且由于时间紧迫，草草学完python基础语法后，也没去深入理解现有代码的逻辑，看个大概就开始干了。
	-  那句老话说的好“你觉悟的有多深，你受到的伤害就有多深”，正因为有这一波经历，我才下定决心去学习设计模式。

　　也就是说，学习设计模式是为了提高编码技巧，从而写出更容易维护和扩展的软件。

<br>**只涨工龄不涨技术**

　　在行业内很多初、中级工程师甚至高级工程师由于某些原因都还停留在功能实现层面，甚至对设计模式、面向对象知之甚少，因此也就很少去考虑代码的设计问题，这是很不妥的，希望各位居安思危，引以为戒。

<br>**本节参考阅读：**
- [百度百科 - 设计模式](http://www.importnew.com/6605.html)


# 第二节 六大原则 #

　　我们知道“面向对象”的三大特性是封装、继承、多态，其实在这三个特性之上，还可以延伸出六大原则，这些原则是学习设计模式所必需的知识，本节就来详细介绍一下它们。

## 单一职责原则 ##

　　单一职责原则要求，一个类应该是一组相关性很高的函数、数据的封装；简单的说就是“一个类只做一件事”，那相应的这个类也只应该因为它做的那件事需要修改而被修改。

<br>　　比如领导让我们写一个图片加载库，要求能在内存中缓存图片，于是写出了如下第一版本的代码：
``` java
public class ImageLoader {
    // 图片缓存
    LruCache<String, Bitmap> mImageCache;
    // 线程池，线程数量为CPU的数量
    ExecutorService mExecutorService = Executors.newFixedThreadPool (Runtime.getRuntime().availableProcessors());

    public ImageLoader() {
        initImageCache();
    }

    // 此方法用来初始化mImageCache缓存对象，比如设计缓存区的大小等。
    // 之所以不把方法的具体实现给写出来，是想让大家把关注的重心放到代码的结构上。
    private void initImageCache() { }

    // 此方法由外界调用，用来执行图片加载的操作。
    public  void displayImage(final String url, final ImageView imageView) {
        // 在子线程中执行操作
        mExecutorService.submit(new Runnable() {
            public  void run() {
                // 下载图片
                Bitmap bitmap = downloadImage(url);
                // 将Bitmap设置到ImageView中。
                // ...
                // 将Bitmap加入到缓存。
                mImageCache.put(url, bitmap);
          }
       });
    }

    // 此方法只负责在当前线程中执行网络请求，接收一个url，返回一个Bitmap对象。
    private  Bitmap downloadImage(String imageUrl) { }
}
```
    语句解释：
    -  如果你看不出这段代码的问题，那么本文将要介绍的知识就十分适合你了。
    -  其实这个ImageLoader根本就没有设计可言，更不要说扩展性、灵活性了，因为它把所有的功能都写在一个类，即图片的加载和图片的缓存是两码事，不应该由一个类来承担，随着时间的推移这个类将越来越难维护。

<br>　　修改的方法也很简单，将图片加载和图片缓存分别交给两个类去做，代码如下：
``` java
// 负责内存缓存
public class ImageCache {
    // 图片LRU缓存
    LruCache<String, Bitmap> mImageCache;

    public ImageCache() {
        initImageCache();
    }

    private void initImageCache() {

    }

    public void put(String url, Bitmap bitmap) {
        mImageCache.put(url, bitmap) ;
    }

    public Bitmap get(String url) {
        return mImageCache.get(url) ;
    }
}
// 负责图片加载
public class ImageLoader {
    private ImageCache mImageCache = new ImageCache();

    // 线程池，线程数量为CPU的数量
    ExecutorService mExecutorService = Executors.newFixedThreadPool (Runtime.getRuntime().availableProcessors());

    // 此方法只负责执行网络请求，接收一个url，返回一个Bitmap对象。
    private  Bitmap downloadImage(String imageUrl) { }

    // 此方法由外界调用，用来执行图片加载的操作。
    public  void displayImage(final String url, final ImageView imageView) { }
}
```
    语句解释：
    -  修改之后情况变的好一些了，但是依然存在不少问题，后面会一一指出。

<br>　　其实大家也可以看出来，单一职责的划分界限并不是总是那么清晰，很多时候都是需要靠个人经验来界定。当然，最大的问题就是对职责的定义，什么是类的职责，以及怎么划分类的职责。

## 开闭原则 ##

　　开闭原则的定义是：`软件中的对象（类、模块、函数等）应该对于扩展是开放的，对于修改是封闭的`。

　　开闭原则认为一旦完成，一个类的实现只应该因错误而修改，新的或者改变的特性应该通过新建不同的类实现。

	-  在实际工作中，因为变化、升级和维护等原因需要对软件原有代码进行修改时，可能会将错误引入原本已经经过测试的旧代码中，破坏原有系统。
	-  因此，我们应该尽量让代码事先就支持通过扩展（也就是继承）的方式来实现变化，而不是当问题发生时，再修改已有的代码。
	-  当然，在现实开发中，只通过继承的方式来升级、维护原有系统只是一个理想化的愿景。
	-  因此，在实际的开发过程中，修改原有代码、扩展代码往往是同时存在的。

　　也就是说，我们应该尽量让一个实体在不改变自身的源代码的前提下变更自己的行为。

<br>　　接着上面的图片加载库的例子，它现在只支持内存缓存，当进程关闭后缓存也就丢失了，再次启动时用户还得花流量从服务器端重新下载，因此领导要求再增加一个磁盘缓存，代码如下所示：
``` java
// 磁盘缓存类
public class DiskCache {
    // 为了简单起见临时写个路径，在开发中请避免这种写法。
    static String cacheDir = "sdcard/cache/";
    // 从缓存中获取图片
    public Bitmap get(String url) { }
    // 将图片缓存到内存中
    public  void  put(String url, Bitmap bmp) { }
}

// 内存+磁盘缓存类
public class DoubleCache {
    ImageCache mMemoryCache = new ImageCache();
    DiskCache mDiskCache = new DiskCache();
    // 先从内存缓存中获取图片，如果没有，再从SD卡中获取
    public   Bitmap get(String url) {
       Bitmap bitmap = mMemoryCache.get(url);
        if (bitmap == null) {
            bitmap = mDiskCache.get(url);
        }
        return  bitmap;
    }
    // 将图片缓存到内存和SD卡中
    public void put(String url, Bitmap bmp) {
        mMemoryCache.put(url, bmp);
        mDiskCache.put(url, bmp);
   }
}

// 图片加载类
public class ImageLoader {
    // 内存缓存
    ImageCache mImageCache = new ImageCache();
    // SD卡缓存
    DiskCache mDiskCache = new DiskCache();
    // 双缓存
    DoubleCache mDoubleCache = new DoubleCache() ;
    // 使用SD卡缓存
    boolean isUseDiskCache = false;
    // 使用双缓存
    boolean isUseDoubleCache = false;
    // 线程池,线程数量为CPU的数量
    ExecutorService mExecutorService = Executors.newFixedThreadPool (Runtime.getRuntime().availableProcessors());

    public void displayImage(final String url, final ImageView imageView) {
        Bitmap bmp = null;
        if (isUseDoubleCache) {
            bmp = mDoubleCache.get(url);
        } else if (isUseDiskCache) {
            bmp = mDiskCache.get(url);
        } else {
            bmp = mImageCache.get(url);
        }
        if ( bmp != null ) {
            imageView.setImageBitmap(bmp);
        }
        // 没有缓存，则提交给线程池进行异步下载图片
    }
    // ...
}
```
    语句解释：
    -  上面代码有如下几个缺点：
       -  增加新的缓存策略时要修改ImageLoader类，这样很可能会引入Bug。
       -  用户无法自定义缓存策略，只能在内存、磁盘、双缓存三者选其一，即可扩展性差，而可扩展性可是框架最重要的特性之一。
       -  在displayImage方法中出现过多的if判断。


<br>　　上面说的那三个缺点都可以通过一个接口来解决，代码如下：
``` java
// 定义一个缓存接口，所有缓存策略都实现它
public interface ImageCache {
    public Bitmap get(String url);
    public void put(String url, Bitmap bmp);
}
public class MemoryCache implements ImageCache { }
public class DiskCache implements ImageCache { }
public class DoubleCache implements ImageCache{ }

public class ImageLoader {
    // 默认使用内存缓存
    ImageCache mImageCache = new MemoryCache();
    // 用户可以动态的修改缓存方案
    public void setImageCache(ImageCache cache) {
        mImageCache = cache;
    }
    // 省略其它代码
}
```
    语句解释：
    -  本范例就可以在不修改ImageLoader任何代码的基础上，实现各类缓存策略的更换，同时也解决了上面说的三个问题了。
    -  本范例虽然仅仅是增加一个接口，但是却玄妙无比，各位客观可要看仔细了。

## 里氏替换原则 ##

　　这个原则主要是为了体现面向对象的“继承”特征来提出的。

	-  通俗点讲，我们在写代码时，要保证只要父类能出现的地方子类都可以出现，而且替换为子类也不会产生任何错误或异常，使用者可能根本就不需要知道是父类还是子类。
	-  因此，为了保证这种透明的无差别的使用，子类不应该随意的重写父类已经定义好的非抽象的方法。
	-  因为这些非抽象方法，类似于某种职能或契约，当父类保持这种约定时，子类也应该遵循并保证该特性，而非修改该特性。


<center>
![就像这样](/img/android/android_BY_d01_01.png)
</center>

## 依赖倒置原则 ##

　　传统的依赖关系中，上层调用下层，上层依赖于下层，当下层剧烈变动时上层也要跟着变动。
　　依赖倒置原则就是一种特定的解耦方式，它可以让上层不依赖于下层的实现：

	-  一般情况下抽象（就把抽象理解成java里的接口）的变化概率很小，基于这个特点，我们可以在上层和下层之间创建一个中间层（即一个接口）。
	-  让高层的模块和下层的模块都依赖于这个中间层，这样一来即使实现细节不断变动，只要抽象不变，高层的模块就不需要变化。
	-  简单的说，就是模块之间不应该直接产生调用关系，在上层和下层模块之间，增加一个接口，让上层和下层分别依赖这个接口编程。

<br>　　依赖倒置原则的特点：

	-  高层次的模块不应该依赖于低层次的模块，他们都应该依赖于抽象。
	-  抽象不应该依赖于具体实现，具体实现应该依赖于抽象。
	-  对于两个各自拥有自己抽象的模块，模块间的依赖通过抽象发生，它们的实现类之间不发生直接的依赖关系。

<br>　　换到前面的图片加载的例子中，最初的时候，在ImageLoader中会持有各种类型缓存的强引用，代码为：
``` java
public class ImageLoader {
    // 内存缓存
    ImageCache mImageCache = new ImageCache();
    // SD卡缓存
    DiskCache mDiskCache = new DiskCache();
    // 双缓存
    DoubleCache mDoubleCache = new DoubleCache() ;
}
```
    语句解释：
    -  这就是典型的上层与下层直接通信的场景，二者耦合度太高，当缓存策略发生变化时，不可避免的就得去修改ImageLoader类。
    -  所以后来我们在上层和下层之间新增了一个ImageCache接口，通过它来解耦ImageLoader与具体的缓存策略。

## 接口隔离原则 ##

　　这个原则的定义是：`客户端不应该被迫重写它不使用的方法`，说白了就是，让客户端依赖的接口尽可能地小。

	-  如果一个接口定义了过多的抽象方法，则意味着它的每一个实现类都要实现这些方法，这就无形中增加了实现类的负担。
	-  因此接口定义的要小（即抽象方法少），但是要有限度，对接口细化可以增加灵活性，但是过度细化则会使设计复杂化。
	-  接口隔离原则和单一职责原则的关系：
	   -  共同点：都是尽可能的缩小涉及的范围。
	   -  不同点：单一原则主要是指封装性，它更偏向对一个类的要求。而接口隔离原则更偏向对一个接口的要求。

<br>　　在JDK6之前，我们需要写很多工具方法，去关闭那些可关闭的对象（输入/输出流、Cursor），比如：
``` java
public static void closeInputStream(InputStream input) {
    if (input != null) {
        try {
            input.close();
        } catch (IOException e) { }
    }
}

public static void closeOutputStream(OutputStream output) {
    if (output != null) {
        try {
            output.close();
        } catch (IOException e) { }
    }
}
```
    语句解释：
    -  上面这段代码重复代码太多，严重影响代码的可读性。

<br>　　其实Java中有一个Closeable接口，它只有一个close方法，但拥有100多个子类，各种流都是它的子类，所以可以改为：
``` java
public static void closeQuietly(Closeable closeable) {
    if (null != closeable) {
        try {
            closeable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
   }
}
```
    语句解释：
    -  这个方法基本原理就是依赖于Closeable抽象而不是具体实现，即依赖倒置原则。
    -  并且建立在最小化依赖原则的基础，它只需要知道这个对象是可关闭，其他的一概不关心，也就是这里的接口隔离原则。

<br>　　以上五条原则就是著名的SOLID（单一功能、开闭原则、里氏替换、接口隔离以及依赖倒置）原则。

## 最少知识原则 ##

　　这个原则有如下特点：

	-  每个单元对于其他的单元只能拥有有限的知识：只是与当前单元紧密联系的单元。
	-  每个单元只能和它的朋友交谈：不能和陌生单元交谈。
	-  只和自己直接的朋友交谈。

<br>　　下面我们就以租房为例来讲讲最少知道原则，我们设定的情境为：我只要求房间的面积和租金，其他的一概不管，中介将符合我要求的房子提供给我就可以。代码如下：
``` java
// 房间
public class Room {
    public float area;
    public float price;
    public Room(float area, float price) {
        this.area = area;
        this.price = price;
    }
}

// 中介
public class Mediator {
    List<Room> mRooms = new ArrayList<Room>();
    public Mediator() {
        for (inti = 0; i < 5; i++) {
            mRooms.add(new Room(14 + i, (14 + i) * 150));
       }
   }
    public List<Room>getAllRooms() {
        return mRooms;
   }
}


// 租户
public class Tenant {
    public float roomArea;
    public float roomPrice;
    public static final float diffPrice = 100.0001f;
    public static final float diffArea = 0.00001f;
    public void rentRoom(Mediator mediator) {
        List<Room>rooms = mediator.getAllRooms();
        for (Room room : rooms) {
            if (isSuitable(room)) {
               System.out.println("租到房间啦! " + room);
               break;
          }
       }
    }
    private boolean isSuitable(Room room) {
        return Math.abs(room.price - roomPrice) < diffPrice
                &&Math.abs(room.area - roomArea) < diffArea;
   }
}
```
    语句解释：
    -  从上面的代码中可以看到，Tenant不仅依赖了Mediator类，还需要频繁地与Room类打交道。
    -  租户的要求只是通过中介找到一间适合自己的房间，上面代码中，中介把n个房屋的信息给了租户，然后让租户自己去匹配房屋，这尼玛逗爹呢。
    -  这样一来中介类的功能就被弱化，而且导致Tenant与Room的耦合较高，因为Tenant必须知道许多关于Room的细节。

<br>　　既然是耦合太严重，那我们就只能解耦了，首先要明确地是，我们只和我们的朋友通信，这里就是指Mediator对象。必须将Room相关的操作从Tenant中移除，而这些操作案例应该属于Mediator，我们进行如下重构：
``` java
// 中介
public class Mediator {
    List<Room> mRooms = new ArrayList<Room>();
    public Mediator() {
        for (inti = 0; i < 5; i++) {
            mRooms.add(new Room(14 + i, (14 + i) * 150));
       }
    }
    public Room rentOut(float  area, float  price) {
        for (Room room : mRooms) {
            if (isSuitable(area, price, room)) {
                return  room;
          }
       }
        return null;
    }
    private boolean isSuitable(float area, float price, Room room) {
        return Math.abs(room.price - price) < Tenant.diffPrice
            && Math.abs(room.area - area) < Tenant.diffPrice;
    }
}

// 租户
public class Tenant {
    public float roomArea;
    public float roomPrice;
    public static final float diffPrice = 100.0001f;
    public static final float diffArea = 0.00001f;
    public void rentRoom(Mediator mediator) {
        System.out.println("租到房啦 " + mediator.rentOut(roomArea, roomPrice));
     }
}
```
    语句解释：
    -  现在租户并不需要知道太多关于Room的细节，比如与房东签合同、维修等，所有的事情租户直接与中介沟通就好了，房东、维修师傅等这些角色并不是我们直接的“朋友”。
    -  “只与直接的朋友通信”这简单的几个字就能够将我们从乱七八糟的关系网中抽离出来，使我们的耦合度更低、稳定性更好。

<br>　　很多面向对象程序设计语言用`.`来调用对象的属性和方法（比如Java），基于此我们可以得出如下结论：

	-  最小知道原则可以理解为“只使用一个.算符”，比如a.b.Method()违反了此定律，而a.Method()不违反此定律。
	-  一个简单例子是，人可以命令一条狗行走（walk），但是不应该直接指挥狗的腿行走，应该由狗去指挥控制它的腿如何行走。
	-  它与单一职责的区别在于，单一职责是对类的定义提出要求，而它是对在何处使用这个类的对象提出要求。

## 小结 ##
　　最后我们来总结一下六大原则的特点：

	-  单一职责：每个类只做一件事，同时就这个类而言，应该仅有一个引起它变化的原因。
	-  开闭原则：对扩展开放，对于修改封闭，这意味着一个实体是允许在不改变它的源代码的前提下变更它的行为。
	-  里氏替换：保证只要父类能出现的地方子类都可以出现，而且替换为子类也不会产生任何错误或异常。
	-  依赖倒置：模块之间不应该直接产生调用关系，应该通过增加一个中间层（即接口）来解耦。
	-  接口隔离：多个小的接口要好于一个宽泛用途的接口。
	-  最少知道：人可以命令一条狗行走，但是不应该直接指挥狗的腿行走。

<br>　　等各位学到了后面章节里介绍的设计模式时，就会发现其中不少模式都借鉴了这六大原则，所以想学会、学懂设计模式，必须要彻底搞懂六大原则。

<br>**本节参考阅读：**
- [面向对象六大原则](http://blog.csdn.net/bboyfeiyu/article/details/50103471)
- [Java面向对象的六大原则](http://blog.tingyun.com/web/article/detail/410)
- [维基百科 - SOLID(面向对象设计)](https://zh.wikipedia.org/wiki/SOLID_(%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%AE%BE%E8%AE%A1))
- [维基百科 - 得墨忒耳定律](https://zh.wikipedia.org/wiki/%E5%BE%97%E5%A2%A8%E5%BF%92%E8%80%B3%E5%AE%9A%E5%BE%8B)

# 第三节 常用模式 #

　　限于篇幅原因，本节只会介绍开发中常用的模式。


## 单例模式 ##

　　所谓的单例(`Singleton`)设计模式，就是指一个类只允许有一个对象。如果我们的某个类不需要存在多个对象，那么就可以考虑把这个类写成单例模式的。

　　单例设计模式的实施步骤：

	1、使用private修饰构造方法。这样外界就不可以通过new关键字来创建该类的对象了，但本类中的代码仍然可以创建。
	2、在本类中建立一个静态的本类的对象。
	3、建立一个静态方法用来返回此对象的引用。

<br>　　范例1：最简单的单例模式。
``` java
public class SingleClass {
    private static SingleClass instance = new SingleClass();

    private SingleClass() {
        // 默认提供的构造方法是public的，因此在此需要自定义一个无参的构造，并将访问权限该为private的。
    }

    public static SingleClass getInstance() {
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```

<br>　　上面就是一个最简单的单例模式的写法，不过它并不是最优的写法，后面我们会继续完善它。
<br>　　当程序运行的时候，我们可以通过下面的代码来调用`SingleClass`类的`getInfo`方法：
``` java
// 不需要创建任何SingleClass类的对象，就可以在程序的任何地方调用getInfo()方法。
SingleClass.getInstance().getInfo();
```
<br>**单例与静态的抉择**

　　我们在设计程序经常会有这种需求，某个类里的方法能够全局访问。在这种情况下有两种实现方案：

	-  单例模式(Singleton)
	-  静态方法

　　但是，我们应该如何选择使用哪种方式呢？

	-  如果你的类不维持任何状态，仅仅是提供全局的访问，这个时候就适合用静态类。
	   -  最基本的例子就是在Java中的java.lang.Math类的实现方式，Math类就是用过静态方法来实现的，而不是单例来实现的。
	-  如果你的类需要维持一些状态，或者需要从线程安全、兼容性上来考虑一些问题，那么选用单例为宜。

<br>**单例的各种写法**

　　上面的范例的写法有个缺点，当`SingleClass`类被加载的时候就会立刻实例化单例对象。
　　这意味着如果单例对象里包含了很多属性，那这个对象就会占有很多内存空间，而这块空间我们一时半会可能用不到。因此可以改造一下代码，只有在我们需要使用单例对象的时候才去创建这个单例对象。

<br>　　范例1：懒汉式。
``` java
public class SingleClass {
    private static SingleClass instance;

    private SingleClass() { }

    public static SingleClass getInstance() {
        if(instance == null){
            instance = new SingleClass();
        }
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```

<br>　　不过懒汉式的写法依然存在问题，当多个线程同时访问`getInstance`方法时，会导致创建多个`SingleClass`类的对象，每个线程操作不同的单例对象，会导致数据错乱。
<br>　　范例2：懒汉式（线程安全）。
``` java
public class SingleClass {
    private static SingleClass instance;

    private SingleClass() { }

    public static SingleClass getInstance() {
        if(instance == null){
            // 此处加个线程同步。
            synchronized (SingleClass.class) {
                if(instance == null){
                    instance = new SingleClass();
                }
            }
        }
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```
    语句解释：
    -  此种方式也被称为双重校验锁。
    -  也有人将synchronized关键字直接修饰在getInstance()方法上，缺点是每次调用getInstance()方法都需要进行线程同步操作。

<br>　　范例3：静态内部类。
``` java
public class SingleClass {
    private static class SingletonHolder {
        private static final SingleClass INSTANCE = new SingleClass ();
    }
    private SingleClass(){}
    public static final SingleClass  getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```
    语句解释：
    -  此种方式利用了静态内部类的特点，即实现了懒加载又不用担心多线程问题。
    -  但是由于双重校验锁更直观容易理解，因而比此种方式常见。

<br>**有两个问题需要注意：**
　　1、如果单例由不同的类装载器装入，那便有可能存在多个单例类的实例。
　　2、如果`Singleton`实现了`java.io.Serializable`接口，那么这个类的实例就可能被序列化和复原。不管怎样，如果你序列化一个单例类的对象，接下来复原多个那个对象，那你就会有多个单例类的实例。

<br>　　范例4：通过反序列化来创建多个对象。
``` java
import java.io.*;
public class Main {

    public static void main(String[] args) throws Exception {
        // 先输出两遍单例对象，结果它们输出的内存地址是一样的。
        System.out.println(SingleClass.getInstance());
        System.out.println(SingleClass.getInstance());	

        File file = new File("a.txt");
        // 将单例对象序列化到a.txt文件中。
        write(file);
        // 反序列化4次，程序每次输出的内存地址都是不一样的。
        System.out.println(read(file));
        System.out.println(read(file));
        System.out.println(read(file));
        System.out.println(read(file));
    }

    private static void write(File file) throws Exception {
        ObjectOutputStream output = new ObjectOutputStream(new FileOutputStream(file));
        output.writeObject(SingleClass.getInstance());
        output.close();
    }

    private static SingleClass read(File file) throws Exception{
        ObjectInputStream input = new ObjectInputStream(new FileInputStream(file));
        SingleClass inst = (SingleClass)input.readObject();
        input.close();
        return inst;
    }

}
```
    语句解释：
    -  在执行本范例之前，请先让SingleClass实现Serializable接口。

<br>　　解决方案请自行搜索，不过笔者认为，开发的时候使用`“双重校验锁”`方式就够用的了。
　　另外，如果你担心别人通过反射的方式来调用你的私有构造器，那么可以在里面加上检测，一旦存在了单例对象，则直接抛出异常。


<br>**参考阅读：**
- [程序设计之---单例模式VS静态方法](http://blog.csdn.net/johnny901114/article/details/11969015)
- [单例模式的七种写法](http://cantellow.iteye.com/blog/838473)


## Builder模式 ##

<br>**问题描述**

　　假设我们有一个`Person`类，类中有`id`、`age`、`sex`、`name`四个必须的属性，并且还会有若干个可选的属性（比如`address`、`phone`等）。

　　对于这样的类，它的构造方法通常我们会这么写：
``` java
public class Person {
    private int id;
    private int age;
    private String sex;
    private String name;
    public Person(int id, int age, String sex, String name) {
        this.id = id;
        this.age = age;
        this.sex = sex;
        this.name = name;
    }
    // 此处省略若干get、set方法。
}
```
    语句解释：
    -  猛地一看没有任何问题，但是当Person类不断的增加字段时，你可能需要重载多个构造方法，客户端的代码就会变得很难编写以及阅读。
    -  如果客户端不小心颠倒了其中两个参数的顺序，编译器也不会报错，但程序在运行的时候会出现错误的行为。

　　此问题可以通过在`Person`类中`get`、`set`方法来解决，同时客户端的代码读起来也很舒服：
``` java
Person p = new Person();
p.setId(1);
p.setAge(30);
p.setName("Tome");
p.setSex("M");
```
　　遗憾的是，上面的代码有着很严重的缺点，因为构造过程被分到几个调用过程中，在构造过程中`JavaBean`可能处于不一致状态（需要线程同步安全）。
　　不过还有第三种替代方法，既能保证构造方法那样的安全性，也能保证`JavaBean`模式的可读性，这就是`Builder`模式。

<br>**模式介绍**

　　由一个名为`Builder`的内部来来完成实例化的任务。

<br>　　范例1：`Person`类。
``` java
public class Person {

    private int id;
    private int age;
    private String sex;
    private String name;

    // 私有化构造方法。
    private Person(Builder builder) {
        id = builder.id;
        age = builder.age;
        sex = builder.sex;
        name = builder.name;
    }

    public static class Builder {
        private int id;
        private int age;
        private String sex;
        private String name;

        public Builder setId(int id){
            this.id = id;
            return this;
        }

        public Builder setAge(int age){
            this.age = age;
            return this;
        }

        public Builder setSex(String sex){
            this.sex = sex;
            return this;
        }

        public Builder setName(String name){
            this.name = name;
            return this;
        }

        // 执行实例化操作。
        public Person build(){
            return new Person(this);
        }
    }
}
```
    语句解释：
    -  Builder类内的各个方法返回本身，以便可以连续调用。

　　下面就是客户端代码：
``` java
Person p = new Person.Builder()
    .setId(1)
    .setAge(30)
    .setName("Tom")
    .setSex("M")
    .build(); // 执行构造
```

<br>**Builder模式优缺点**

	-  使用Builder模式会导致写两遍相关属性的代码get和set方法，但调用者代码的便用性和可读性得到了大大提高。
	-  为了实例化对象，我们需要为类添加一个Builder类，让代码变得稍显冗长。
	-  当类新添加属性时，容易忘记给Builder类也添加上该属性，因此通常推荐把Builder类作为静态内部类来写。

　　简而言之，如果类的构造器中有多个参数，设计这种类时，`Builder`模式就是种不错的选择，特别的是当大多数参数都是可选的时候。
　　提示：`Android`中的`AlertDialog`、`NotificationCompat`等类都是使用了`Builder`模式。


<br>**实战**


<br>**本节参考阅读：**
- [Java方法参数太多怎么办—Part3—Builder模式](http://www.importnew.com/6605.html)




<br><br>
