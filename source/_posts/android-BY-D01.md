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

　　简单的说，设计模式就是一些写代码的套路，按照这些前人总结出来的套路去写代码，写出的代码质量更高。

<br>**为什么要学设计模式？**

　　就像一开始说的，软件开发并不难，难的是后期的维护，下面说一个笔者亲身经历的事情：

	-  机缘巧合下，我需要去维护一个nodejs+python开发的网站（但之前根本没学过这两者）。
	-  而且由于时间紧迫，草草学完python基础语法后，也没去深入理解现有代码的逻辑，看个大概就开始干了。
	-  但是老项目的代码乱的不行，搞的我晕头转向，废了不少功夫在上面。
	-  就像老话说的那样，“你觉悟的有多深，伤害就有多深”，我做为一个后来者，在亲身体验过杂乱的代码后，才下定决心去学习设计模式。

　　也就是说，学习设计模式是为了提高编码技巧，从而写出更容易维护和扩展的软件。

<br>**只涨工龄不涨技术**

　　在行业内很多初、中级工程师甚至高级工程师由于某些原因都还停留在功能实现层面，甚至对设计模式、面向对象知之甚少，因此也就很少去考虑代码的设计问题，这是很不妥的，希望各位居安思危，引以为戒。

<br>**本节参考阅读：**
- [百度百科 - 设计模式](http://www.importnew.com/6605.html)


# 第二节 六大原则 #

　　我们知道“面向对象”的三大特性是`封装`、`继承`、`多态`，其实在这三个特性之上，还可以延伸出六大原则，这些原则是学习设计模式所必需的知识，本节就来详细介绍一下它们。

## 单一职责原则 ##

　　单一职责原则要求，一个类应该是一组相关性很高的函数、数据的封装；简单的说就是“一个类只做一件事”，那相应的这个类也只应该因为它做的那件事需要修改而被修改。

<br>　　比如领导让我们写一个图片加载库，要求能在内存中缓存图片，于是写出了如下第一版本的代码：
``` java
public class ImageLoader {
    // 图片缓存
    LruCache<String, Bitmap> mImageCache;
    // 线程池，线程数量为CPU的数量
    ExecutorService mExecutorService 
          = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

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
    ExecutorService mExecutorService = 
          Executors.newFixedThreadPool (Runtime.getRuntime().availableProcessors());

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

　　开闭原则认为一旦完成，一个类只应该因错误而修改，新的或者改变的特性应该通过新建不同的类实现。

	-  在实际工作中，因为变化、升级和维护等原因需要对软件原有代码进行修改时，可能会将错误引入原本已经经过测试的旧代码中，破坏原有系统。因此，我们应该尽量让代码事先就支持通过扩展（也就是继承）的方式来实现变化，而不是当问题发生时，再修改已有的代码。
	-  当然，在现实开发中，只通过继承的方式来升级、维护原有系统只是一个理想化的愿景，在实际的开发过程中，修改原有代码、扩展代码往往是同时存在的。

　　也就是说，我们应该尽量让一个实体在不改变自身的源代码的前提下变更自己的行为。

<br>　　接着上面的图片加载库的例子，它现在只支持内存缓存，当进程关闭后缓存也就丢失了，再次启动时用户还得花流量从服务器端重新下载，因此领导要求再增加一个磁盘缓存，一开始我们写的代码可能是这样的：
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
    public Bitmap get(String url) {
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
    ExecutorService mExecutorService = 
          Executors.newFixedThreadPool (Runtime.getRuntime().availableProcessors());

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

<br>　　下面我们就以租房为例来讲讲最少知道原则，我们设定的情境为：我只要求房间的面积和租金，其他的一概不管，中介将符合我要求的房子提供给我就可以。一开始我们可能写出这样的代码：
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
    -  租户想通过中介找到一间适合自己的房间，上面代码中，中介把n个房屋的信息给了租户，然后让租户自己去匹配房屋，这尼玛逗爹呢。
    -  此时中介类的功能被弱化了，导致Tenant与Room的耦合较高，因为Tenant必须知道许多关于Room的细节。

<br>　　既然是耦合太严重，那就需要解耦了，首先要明确地是“我们只和我们的朋友通信”，这里就是指Mediator对象。必须将Room相关的操作从Tenant中移除，而这些操作案例应该属于Mediator，我们进行如下重构：
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

<br>　　很多面向对象程序设计语言用`“.”`来调用对象的属性和方法（比如Java），基于此我们可以得出如下结论：

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

# 第三节 模式概述 #

<br>**发展历史**

	建筑师克里斯托佛·亚历山大在1977/79年编制了一本汇集设计模式的书，但是这种设计模式的思想在建筑设计领域里的影响远没有后来在软件开发领域里传播的广泛。
	肯特·贝克和沃德·坎宁安在1987年，利用克里斯托佛·亚历山大在建筑设计领域里的思想开发了设计模式并把此思想应用在Smalltalk中的图形用户接口（GUI）的生成中。
    一年后埃里希·伽玛在他的苏黎世大学博士毕业论文中开始尝试把这种思想改写为适用于软件开发。Erich Gamma 得到了博士学位后去了美国，在那与Richard Helm, Ralph Johnson ,John Vlissides 合作出版了《设计模式：可复用面向对象软件的基础》（Design Patterns - Elements of Reusable Object-Oriented Software） 一书，在此书中共收录了23个设计模式。
	这四位作者在软件开发领域里以“四人帮”（英语，Gang of Four，简称GoF）而闻名，并且他们在此书中的协作导致了软件设计模式的突破。有时，GoF也会用于代指《设计模式》这本书。

<br>**类型划分**

　　《设计模式》一书把23种设计模式分为`创建型模式`、`结构型模式`、`行为型模式`三大类。

　　创建型模式：

	-  我们知道在Java中使用new关键字就可以创建一个对象，但是可不要小瞧对象创建这件事，它有很多大学问。
	-  创建型设计模式就是用来解决对象创建时遇到的各类问题的，让对象以适应工作环境的方式被创建。
	-  属于创建模式的是：单例、建造者（Builder）、原型、工厂方法、抽象工厂。

　　结构型模式：

	-  结构型设计模式是从程序的结构上解决模块之间的耦合问题，该模式有助于在系统的某一部分发生改变的时候，整个系统结构不需要改变。
	-  属于结构模式的是：
	-  、桥接、组合、修饰、外观、享元、代理。

　　行为型模式：

	-  行为型设计模式用来识别对象之间的常用交流模式并加以实现，可在进行这些交流活动时增强弹性。
	-  属于行为模式的是：责任连、命令、解释器、迭代器、中介者、备忘录、观察者、状态、策略、模板方法、访问者。

<br>　　限于篇幅原因，本文只会介绍笔者认为的、开发中常用的模式，未介绍的请您自行搜索学习。

<br>**本节参考阅读：**
- [维基百科 - 设计模式 (计算机)](https://zh.wikipedia.org/wiki/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F_(%E8%AE%A1%E7%AE%97%E6%9C%BA))
- [极客学院 - 设计模式的分类](http://wiki.jikexueyuan.com/project/javascript-design-patterns/classification.html)


# 第四节 创建型模式 #

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
        // 默认提供的构造方法是public的，因此在此需要自定义一个无参的构造。
        // 将访问权限该为private的。
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

	-  如果你的类不维持任何状态，仅仅是提供全局的访问，这个时候就适合用静态类。比如java.lang.Math类的实现方式，Math类就是用过静态方法来实现的，而不是单例来实现的。
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

<br>**有三个问题需要注意：**
　　1、如果单例由不同的类装载器装入，那便有可能存在多个单例类的实例。
　　2、如果`Singleton`实现了`java.io.Serializable`接口，那么这个类的实例就可能被序列化和复原。不管怎样，如果你序列化一个单例类的对象，接下来复原多个那个对象，那你就会有多个单例类的实例。
　　3、如果你在Manifest中配置某个组件单独运行在新进程中，那么主进程和子进程中会各有一份单例对象。

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


## 建造者模式 ##

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
　　不过还有另一种替代方法，既能保证构造方法那样的安全性，也能保证`JavaBean`模式的可读性，这就是建造者（`Builder`）模式。

<br>**模式介绍**

　　Build模式在Android开发中也比较常用，通常作为配置类的构建器将配置的构建和表示分离开来，同时也是将配置从目标类中隔离出来。
　　咱们还是以ImageLoader库为例，实际开发中还会有更多的需求，比如设置图片在加载时ImageView显示的图片，加载失败时显示的图片，加载时最大使用的线程数等。

　　通常情况下，新手写出来的代码可能是这样的：
``` java
public class ImageLoader {

    // 正在加载和加载失败的图片
    int mLoadingImageId;
    int mLoadingFailedImageId;
    //  此处省略上面两个属性的get、set方法。

    // 省略其它代码
}
```
    语句解释：
    -  直接在ImageLoader增加字段有好几个缺点：
       -  随着配置项不断增加，ImageLoader类中的代码和get、set也会越来越多，有违单一职责原则。
       -  用户的使用成本变大，方法增多，每次使用的时候都需要仔细选择。
       -  新增的这些配置可以实时修改，那么当用户修改最大允许线程数时，岂不是得关掉之前的线程池，然后重新新开一个？那如果新开一个，是不是还得考虑把老池中的未执行任务转移到新池中？
    -  针对这个场景最好的做法就是专门分配一个类去管理这些配置项，同时只允许ImageLoader在初始化的时候修改这些配置，初始化之后则不能再改。

　　下面是使用Builder模式之后的代码：
``` java
public class ImageLoaderConfig {
    // 正在加载和加载失败的图片
    int mLoadingImageId;
    int mLoadingFailedImageId;
    // 私有化构造器，本类的对象只能通过Builder类创建。
    private ImageLoaderConfig(){}

    // 静态内部类，Builder模式
    public static class Builder{
        int mLoadingImageId;
        int mLoadingFailedImageId;
        public Builder setLoadingImageId(int id){
            this.mLoadingImageId = id;
            return this;
        }
        public Builder setLoadingFailedImageId(int id){
            this.mLoadingFailedImageId = id;
            return this;
        }
        public ImageLoaderConfig build(){
            ImageLoaderConfig config = new ImageLoaderConfig();
            config.mLoadingImageId = this.mLoadingImageId;
            config.mLoadingFailedImageId = this.mLoadingFailedImageId;
            return config;
        }
    }
}

public class ImageLoader {
    private ImageLoaderConfig mConfig;
    public void init(ImageLoaderConfig config){
        this.mConfig = config;
    }
    // ……
}
```
　　此时客户端的代码为：
``` java
private void initImageLoader(){
    ImageLoaderConfig config = new ImageLoaderConfig.Builder()
        .setLoadingImageId(R.drawable.loading)
        .setLoadingFailedImageId(R.drawable.not_found).builder();
    ImageLoader.getInstance().init(config)
}
```

<br>**Builder模式优缺点**

	-  使用Builder模式会导致写两遍相关属性的代码get和set方法，但调用者代码的便用性和可读性得到了大大提高。
	-  为了实例化对象，我们需要为类添加一个Builder类，让代码变得稍显冗长。
	-  当类新添加属性时，容易忘记给Builder类也添加上该属性，因此通常推荐把Builder类作为静态内部类来写。

　　简而言之，如果类的构造器中有多个参数，设计这种类时，`Builder`模式就是种不错的选择，特别的是当大多数参数都是可选的时候。
　　提示：`Android`中的`AlertDialog`、`NotificationCompat`等类都是使用了`Builder`模式。

<br>**本节参考阅读：**
- [Java方法参数太多怎么办—Part3—Builder模式](http://www.importnew.com/6605.html)


## 原型模式 ##

　　原型模式（Prototype）是创建型模式的一种，其特点在于通过“复制”一个已经存在的实例来返回新的实例，而不是新建实例。被复制的实例就是我们所称的“原型”。

　　应用场景：

	-  创建复杂的或者耗时的实例。因为这种情况下，复制一个已经存在的实例使程序运行更高效。
	-  你的对象需要提供给他人访问，为了防止访问者修改你的对象，可以复制出一个新的对象交给外界访问，即保护型拷贝。

<br>　　原型模式在Java中可以很容易的实现，就是利用`Cloneable`接口即可，假设我们有如下代码：
``` java
public class Person implements Cloneable {
    private int age;
    private String name;

    public Person(int age, String name) {
            this.age = age;
            this.name = name;
    }

    public void setAge(int age) {
            this.age = age;
    }

    @Override
    public String toString() {
            return "Person [age=" + age + ", name=" + name + "]";
    }

    @Override
    // 注意，默认情况下clone方法是protected，为了让外界可以访问，需要将其改为public的。
    public Person clone() throws CloneNotSupportedException {
            return (Person) super.clone();
    }
}

// 客户端代码
public class Test {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person p1 = new Person(12, "Tom");
        Person p2 = p1.clone();
        System.out.println(p1);  //输出 Person [age=12, name=Tom]
        System.out.println(p2);  //输出 Person [age=12, name=Tom]
        p2.setAge(30);
        System.out.println(p1);  //输出 Person [age=12, name=Tom]
        System.out.println(p2);  //输出 Person [age=30, name=Tom]
    }
}
```
    语句解释：
    -  首先要知道的是，Cloneable接口中没有任何方法，它只是起到一个标识作用，某个类实现了此接口就相当于告诉系统它启用了clone功能，其实clone方法是在Object定义的，对于未实现Cloneable接口的类来说，调用clone方法会抛异常。

<br>　　上面的代码表面上看一切正常，但其实有一个隐藏的问题，现在我们给Person加一个属性：
``` java
public class Person implements Cloneable {
    private int age;
    private String name;
    private ArrayList<String> images;

    public Person(int age, String name) {
            this.age = age;
            this.name = name;
            this.images = new ArrayList<String>();
    }

    @Override
    public String toString() {
            return "Person [age=" + age + ", name=" + name + ", images=" + images + "]";
    }

    public void addImage(String img) {
            this.images.add(img);
    }

    @Override
    public Person clone() throws CloneNotSupportedException {
            return (Person) super.clone();
    }
}

// 客户端代码
public class Test {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person p1 = new Person(12, "Tom");
        Person p2 = p1.clone();
        System.out.println(p1);  //输出 Person [age=12, name=Tom, images=[]]
        System.out.println(p2);  //输出 Person [age=12, name=Tom, images=[]]
        p2.addImage("c.jpg");
        System.out.println(p1);  //输出 Person [age=12, name=Tom, images=[c.jpg]]
        System.out.println(p2);  //输出 Person [age=12, name=Tom, images=[c.jpg]]
    }
}
```
    语句解释：
    -  从代码中可以发现，我们往p2中加的字符串也出现在了p1中，原因是clone方法默认是进行浅复制，即只会复制属性的值。

<br>　　解决的方法也很简单，修改一下clone方法即可：
``` java
public Person clone() throws CloneNotSupportedException {
    // 先调用Object类的clone方法，复制当前对象。
    Person p = (Person) super.clone();
    // 再调用列表的clone方法。
    p.images = (ArrayList<String>) this.images.clone();
    return p;
}
```
    语句解释：
    -  上面的代码就是在进行深度复制。

<br>**本节参考阅读：**
- [维基百科 - 原型模式](https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%9E%8B%E6%A8%A1%E5%BC%8F)

## 工厂模式 ##

　　工厂模式（Factory）是创建型模式的一种，其特点在于“代理”，即实例化对象时除了创建对象本身外，可能还需要执行其它操作（比如先创建辅助对象、初始化对象属性等），同时这些操作不是一两行代码就能完成的，基于代码重用等原因，我们会把创建对象的任务交给一个工厂，每当需要创建对象时调用工厂即可。

　　工厂模式根据抽象程度的不同，按照从低到高分为三种：简单工厂模式、工厂方法模式、抽象工厂模式，它们各自都有自己的应用场景，接下来就来依次介绍它们。

### 简单工厂模式 ###

　　简单工厂又叫做静态工厂方法（Static Factory Method）模式，但不属于23种GOF设计模式之一，算是工厂方法模式的特殊实现。

<br>　　假设现在有两辆车（奥迪和宝马），作为司机，如果要开其中一种车比如AodiCar，最直接的做法是直接创建AodiCar对象，并调用其drive方法，代码如下：
``` java
// 遵循开闭原则，定义一个Car接口
public interface Car {
    public void drive();
}
// 奥迪车
class AodiCar implements Car {
    public void drive() {
        System.out.println("奥迪开车");
    }
}
// 宝马车
class BaomaCar implements Car {
    public void drive() {
        System.out.println("宝马开车");
    }
}
// 客户端代码
public class Driver {
    public static void main(String[] args) {
        Car car = new AodiCar();
        car.drive();
    }
}
```
    语句解释：
    -  这么写代码最大的问题就是，当需要司机想换车或者有新车时，需要修改客户端的代码。
    -  以Android为例，客户端其实就是一个APK文件，如果需要修改客户端代码，那就得发布新版本，成本有点大。

<br>　　为了解决这个问题，我们可以新增一个专门用来创建Car对象的类，代码如下：
``` java
public class CarFactory {
    public static Car getCar() {
        Car car = null;
        // 从本地配置文件中读取类名。
        String name = getCarNameFromFile();
        switch (name) {
        case "Aodi":
            car = new AodiCar();
            break;
        case "Baoma":
            car = new BaomaCar();
            break;
        default:
            car = null;
            break;
        }
        return car;
    }
    // 读取本地配置文件
    private String getCarNameFromFile() { }
}
```
    语句解释：
    -  在上面的代码中，当需要换车或新增车时，客户端的代码也不需要改动，只需要修改配置文件就行。

<br>　　还可以通过反射技术来进一步优化：
``` java
// 汽车工厂
public class CarFactory {
    public static Car getCar() {
        Car car = null;
        // 从本地配置文件中读取类名，然后通过反射的方式动态实例化出对应的Car。
        String name = getCarNameFromFile();
        try {
            car = (Car) Class.forName(name).newInstance();
        } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) { }
        return car;
    }
    // 读取本地配置文件
    private String getCarNameFromFile() { }
}
// 客户端代码
public class Driver {
    public static void main(String[] args) {
        CarFactory.getCar().drive();
    }
}
```
    语句解释：
    -  这样一来，如果只是换车的话，不需要修改任何代码，只修改配置文件就行。

<br>　　上面写的代码就是运用了简单工厂模式，也就是说：

	-  如果对于一个任务，你提供了多种解决方案供客户端选择，那么最好不要让客户端直接去实例化这些方案的对象。应该在客户端和解决方案之间增加一个中间层（工厂类），比如上面就是通过简单工厂模式来让客户端与具体业务解耦。

<br>　　简单工厂模式角色划分：

	-  工厂角色（CarFactory类），由它负责创建所有的类的内部逻辑，一般而言其内部会提供一个静态方法，外部程序通过该方法创建所需对象。
	-  抽象产品角色（Car类），简单工厂模式所创建的是所有对象的父类，它可以是接口也可以是抽象类，它负责描述所创建实例共有的公共接口。
	-  具体产品角色（AodiCar、BaomaCar类），简单工厂所创建的具体实例对象。

<br>　　简单工厂模式缺点：

	-  由于工厂类集中了所有实例的创建逻辑，这就直接导致一旦这个工厂出了问题，所有的客户端都会受到牵连。
	-  由于简单工厂模式的产品是基于一个共同的抽象类或者接口，这样一来，产品的种类增加的时候（比如新增了飞机类），工厂类就需要判断何时创建何种接口的产品，这就和创建何种种类的产品相互混淆在了一起，违背了单一职责原则，导致系统丧失灵活性和可维护性。

### 工厂方法模式 ###
　　要说明工厂方法模式的优点，可能没有比组装汽车更合适的例子了。场景是这样的：汽车由发动机、轮、底盘组成，现在需要组装一辆车交给调用者。假如不使用工厂模式，代码如下：
``` java
class Engine {
    public void getStyle(){
        System.out.println("这是汽车的发动机");
    }
}
class Underpan {
    public void getStyle(){
        System.out.println("这是汽车的底盘");
    }
}
class Wheel {
    public void getStyle(){
        System.out.println("这是汽车的轮胎");
    }
}
public class Client {
    public static void main(String[] args) {
        Engine engine = new Engine();
        Underpan underpan = new Underpan();
        Wheel wheel = new Wheel();
        ICar car = new Car(underpan, wheel, engine);
        car.show();
    }
}
```
    语句解释：
    -  可以看到，调用者为了组装汽车还需要另外实例化发动机、底盘和轮胎，而这些汽车的组件是与调用者无关的，严重违反了最少知道法则，耦合度太高，非常不利于扩展。
    -  另外，本例中发动机、底盘和轮胎还是比较具体的，在实际应用中，可能这些产品的组件也都是抽象的，调用者根本不知道怎样组装产品。

<br>　　假如使用工厂方法的话，整个架构就显得清晰了许多：
``` java
interface IFactory {
    public ICar createCar();
}
class AudiCar implements ICar {
    public void show(){ }
} 
class AudiFactory implements IFactory {
    public ICar createCar() {
        Engine engine = new Engine();
        Underpan underpan = new Underpan();
        Wheel wheel = new Wheel();
        ICar car = new AudiCar(underpan, wheel, engine);
        return car;
    }
}
public class Client {
    public static void main(String[] args) {
        IFactory factory = new AudiFactory();
        ICar car = factory.createCar();
        car.show();
    }
}
```
    语句解释：
    -  对于工厂方法模式来说，每个类型的工厂只对应一个车型，如果还想生产宝马车，那么就创建一个BMWFactory，这样就遵循了开闭原则，当新增车型时不会影响老代码。

<br>　　工厂方法模式角色划分：

	-  工厂接口（IFactory），工厂接口是工厂方法模式的核心，与调用者直接交互用来提供产品。
	-  工厂实现（AudiFactory），决定如何实例化产品，需要有多少种产品，就需要有多少个具体的工厂实现。
	-  产品接口（ICar），定义产品的规范，所有的产品实现都必须遵循产品接口定义的规范。
	-  产品实现（AudiCar），实现产品接口的具体类，决定了产品在客户端中的具体行为。


<br>　　工厂方法主要优点有：

	-  1、可以使代码结构清晰，有效地封装变化，使得调用者根本无需关心产品的实例化过程，只需依赖工厂即可得到自己想要的产品。
	-  2、降低耦合度。客户端不需要知道除了Car以外的任何其它类。

### 抽象工厂模式 ###
　　在工厂方法模式中，每一个具体工厂对应一种具体产品，一般情况下，一个具体工厂中只有一个工厂方法。但是有时候我们需要一个工厂可以提供多个产品对象，而不是单一的产品对象。

　　比如我们想要一个工厂，让它不仅能创建汽车，还能生产手机和pad。

　　我们来模拟一个场景来说明一下这其中的关系吧。

	-  富士康公司给两个品牌作代工产品：苹果和三星。众所周知，这两个品牌都有手机和平板产品，由于生产工艺的不同，富士康开设了两条生产线，一条线只生产手机，另一条线只生产平板。

　　我们可以使用如下代码来实现：

``` java
// 手机和Pad类
public interface Phone {}
public interface Pad {}

// 苹果和三星的手机和Pad实现类
public class ApplePhone implements Phone {}
public class ApplePad implements Pad {}
public class SamSungPhone implements Phone {}
public class SamSungPad implements Pad {}

// 富士康工厂，用来生成手机和Pad
interface FoxconnFactory {
    public Phone createPhone();
    public Pad createPad();
}

// 苹果的生产线，用来生成手机和Pad
public class AppleFactory implements FoxconnFactory {
    public static Phone createPhone() {
        return new ApplePhone();
    }
    public static Pad createPad() {
        return new ApplePad();
    }
}

// 三星的生产线，用来生成手机和Pad
public class SamSungFactory implements FoxconnFactory {
    public static Phone createPhone() {
        return new SamSungPhone();
    }
    public static Pad createPad() {
        return new SamSungPad();
    }
}
```
    语句解释：
    -  这种写法就是抽象工厂模式。
    -  优点是分离接口与实现，客户端使用抽象工厂来创建对象，而客户端根本就不知道具体的实现是谁，客户端只是面向接口编程而已。
    -  缺点是类文件的爆炸性增长，同时当新增加产品类时（比如增加笔记本电脑类）需要修改抽象工厂，从而导致所有具体的工厂均会被修改。
    -  抽象工厂模式在Android开发中使用的并不多，主要是因为开发中很少出现多个产品种类的情况，大部分情况使用另外两种工厂模式即可解决问题。

　　无论是简单工厂模式，工厂方法模式，还是抽象工厂模式，他们都属于工厂模式，在形式和特点上也是极为相似的，他们的最终目的都是为了解耦。在使用时，我们不必去在意这个模式到底工厂方法模式还是抽象工厂模式，因为他们之间的演变常常是令人琢磨不透的。经常你会发现，明明使用的工厂方法模式，当新需求来临，稍加修改，加入了一个新方法后，由于类中的产品构成了不同等级结构中的产品族，它就变成抽象工厂模式了；而对于抽象工厂模式，当减少一个方法使的提供的产品不再构成产品族之后，它就演变成了工厂方法模式。

<br>**本节参考阅读：**
- [工厂方法模式](http://wiki.jikexueyuan.com/project/java-design-pattern/factory-pattern.html)
- [Java设计模式（一） 简单工厂模式不简单](http://www.jasongj.com/design_pattern/simple_factory/)
- [JAVA设计模式之工厂模式(简单工厂模式+工厂方法模式)](http://blog.csdn.net/jason0539/article/details/23020989)
- [维基百科 - 抽象工厂](https://zh.wikipedia.org/zh-cn/%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82#Java)




# 第五节 行为型模式 #

## 策略模式 ##

<br>**模式介绍**

　　在软件开发中也常常遇到这样的情况：

	-  实现某一个功能可以有多种算法或策略，我们根据实际情况选择不同的算法或者策略来完成任务。例如，排序算法，可以使用插入排序、归并排序、冒泡排序等。

　　针对这种情况，一种常规的方法是将多种算法写在一个工具类中，每个方法对应一个算法，这种方式我们可以称为硬编码。然后当很多个算法集中在一个类中时，这个类就会变得很臃肿，维护成本变高，也容易引发错误，同时当需要新增一种排序算法时，需要修改那个工具类的源代码，违反了我们之前说的单一职责和开闭原则。

　　如果将这些算法或者策略抽象出来，提供一个统一的接口，不同的算法或策略有不同的实现类，这样在程序客户端就可以通过注入不同的实现对象来实现算法或者策略的动态替换，这种模式的可扩展性、可维护性也就更高，也就是我们本节要说的策略模式。


<br>**UML类图**
<center>
![](/img/android/android_BY_d01_02.png)
</center>

　　角色介绍：

	-  Context：用来操作策略的上下文环境。
	-  Stragety：策略的抽象。
	-  ConcreteStragetyA、ConcreteStragetyB：具体的策略实现。

<br>**应用范例**

　　这里以简单的计算操作(+、-、*、/)作为示例，如果不使用策略模式，写出的代码通常是这样的：
``` java
public static double calc(String op, double paramA, double paramB) {
    if ("+".equals(op)) {
        System.out.println("执行加法...");
        return paramA + paramB;
    } else if ("-".equals(op)) {
        System.out.println("执行减法...");
        return paramA - paramB;
    } else if ("*".equals(op)) {
        System.out.println("执行乘法...");
        return paramA * paramB;
    } else if ("/".equals(op)) {
        System.out.println("执行除法...");
        if (paramB == 0) {
            throw new IllegalArgumentException("除数不能为0!");
        }
        return paramA / paramB;
    } else {
        throw new IllegalArgumentException("未找到计算方法!");
    }
}
```


使用策略模式，则是：
``` java
//针对操作进行抽象
public interface Strategy {
    public double calc(double paramA, double paramB);
}

//加法的具体实现策略
public class AddStrategy implements Strategy {
    @Override
    public double calc(double paramA, double paramB) {
        return paramA + paramB;
    }
}

//减法的具体实现策略
public class SubStrategy implements Strategy {
    @Override
    public double calc(double paramA, double paramB) {
        return paramA - paramB;
    }
}

//乘法的具体实现策略
public class MultiStrategy implements Strategy {
    @Override
    public double calc(double paramA, double paramB) {
        return paramA * paramB;
    }
}

//除法的具体实现策略
public class DivStrategy implements Strategy {
    @Override
    public double calc(double paramA, double paramB) {
        if (paramB == 0) {
            throw new IllegalArgumentException("除数不能为0!");
        }
        return paramA / paramB;
    }
}

//上下文环境的实现
public class Calc {
    private Strategy strategy;
    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public double calc(double paramA, double paramB) {
        if (this.strategy == null) {
            throw new IllegalStateException("你还没有设置计算的策略");
        }
        return this.strategy.calc(paramA, paramB);
    }
}


//执行方法
public static double calc(Strategy strategy, double paramA, double paramB) {
    Calc calc = new Calc();
    calc.setStrategy(strategy);
    return calc.calc(paramA, paramB);
}

```
    语句解释：
    -  上面的代码看起来是不是很熟悉，其实咱们一开始说ImageLoader的缓存模块就是使用了策略模式。
    -  策略模式中的Context类其实就对应ImageLoader类，它们都有setXxxx方法。
    -  举一反三的话，还可以举一个范例，比如我们出行时可以乘坐地铁或者打的，我们需要依据用户输出的距离长度，计算出这两种方式的金额，这个问题就比四则运算要复杂一些，以北京为例，2014年12月28号之后，北京提高公交的价格，按照里程计费，如果通过if、else的话，那就太难维护了，而且当增加第三种方式“公交”时，需要修改老代码。
    -  从上面两个范例可以看出来，二者区别非常明显，if-else或者switch方式代码臃肿，耦合性高，容易产生错误。


<br>**总结**

　　策略模式的优缺点：

	-  优点：结构清晰， 消除了一些if else条件语句，耦合度相对于if-else判断来说要低，数据的封装也更为彻底，数据更安全，完美诠释开闭原则。
	-  缺点是随着策略的增加，子类会变多（这都不是事），客户端必须知道所有的策略类，并自行决定使用哪一个策略类。

## 状态模式 ##

<br>**模式介绍**

　　状态模式中的行为是由状态来决定的，不同的状态下有不同的行为。状态模式和策略模式的结构几乎完全一样，但它们的目的、本质却完全不一样。状态模式的行为是平行的、不可替换的，策略模式的行为是彼此独立、可相互替换的。用一句话来表述，状态模式把对象的行为包装在不同的状态对象里，每一个状态对象都有一个共同抽象状态基类。状态模式的意图是让一个对象在其内部状态改变的时候，其行为也随之改变。


<br>**UML类图**

　　与策略模式一样，略。

<br>**应用范例**
　　下面我们就以电视遥控器为例来演示一下状态模式的实现。我们首先将电视的状态简单分为开机和关机两个状态，且只有在开机状态下才可以进行频道切换、调整音量等操作，我们看看第一版的代码实现。
``` java

public class TvController {
    private final static int POWER_ON = 1;
    private final static int POWER_OFF = 2;
    private int mState = POWER_OFF;

    public void powerOn() {
        if (mState == POWER_OFF) {
            System.out.println("开机啦");
        }
        mState = POWER_ON;
    }

    public void powerOff() {
        if (mState == POWER_ON) {
            System.out.println("关机啦");
        }
        mState = POWER_OFF;
    }

    public void nextChannel() {
        if (mState == POWER_ON) {
            System.out.println("下一频道");
        } else {
            System.out.println("没有开机");

        }
    }

    public void prevChannel() {
        if (mState == POWER_ON) {
            System.out.println("上一频道");
        } else {
            System.out.println("没有开机");

        }
    }

    public void turnUp() {
        if (mState == POWER_ON) {
            System.out.println("调高音量");
        } else {
            System.out.println("没有开机");

        }
    }

    public void turnDown() {
        if (mState == POWER_ON) {
            System.out.println("调低音量");
        } else {
            System.out.println("没有开机");

        }
    }
}
```
    语句解释：
    -  本范例通过mState字段来存储电视的状态，每个功能中都需要使用if-else，代码重复、相对较为混乱，这还只是有2个状态的情况下，当有5个状态就能乱了。

　　状态模式就是为了解决这类问题而出现的，我们将这些状态用对象来代替，将这些行为封装到对象中，使得在不同的状态下有不同的实现，这样就将这些if-else从TvController类中去掉，整个结构也变的清晰起来。我们来看看实现代码：
``` java
public interface TvState {
    void nextChannel();

    void prevChannel();

    void turnUp();

    void turnDown();
}

public class PowerOffState implements TvState {
    @Override
    public void nextChannel() {

    }

    @Override
    public void prevChannel() {

    }

    @Override
    public void turnUp() {

    }

    @Override
    public void turnDown() {

    }
}


public class PowerOnState implements TvState {
    @Override
    public void nextChannel() {
        System.out.println("下一频道");
    }

    @Override
    public void prevChannel() {
        System.out.println("上一频道");
    }

    @Override
    public void turnUp() {
        System.out.println("调高音量");
    }

    @Override
    public void turnDown() {
        System.out.println("调低音量");
    }
}
```
    语句解释：
    -  状态模式将这些行为封装到状态类中，在进行操作时将这些功能转发给状态对象，不同的状态有不同 的实现，这样就通过多态的形式去除了重复、杂乱的if-else语句，这也正式状态模式的精髓所在。


<br>**总结**
　　状态模式的优缺点：

	-  优点：将所有与一个特定的状态相关的行为都放入一个状态对象中，它提供了一个更好的方法来组织与特定状态相关的代码，将繁琐的状态转换成结构清晰的状态类族，在避免代码膨胀的同时也保证了可扩展性与可维护性。
	-  缺点：状态模式的使用必然会增加系统类和对象的个数。

<br>　　状态模式和策略模式：

	-  策略模式的每一个策略相互独立，相互替换，策略的个数可以是无限的。
	-  状态模式描述某个对象的所有状态，对象某一时间只能处于一种状态，对象可以在有限的几个状态之间切换。
	-  策略模式服务于算法族，而状态模式服务于某个对象。



## 责任链模式 ##

<br>**模式介绍**

　　责任链模式（Chain of Responsibility）中维护了一个链表，链表里的每个元素都是一个可以处理特定事件的对象，当某个事件发生时，会从表头元素开始检测是否能处理该事件，若能则处理，若不能则将事件传递给下一个节点，以此类推，直到有对象处理这个请求为止。

<br>**UML类图**

<center>
![](/img/android/android_BY_d01_03.jpg)
</center>

　　角色介绍：

	-  Handler：抽象处理者角色，声明一个处理的请求的方法，并在其中持有下一个Handler对象的引用。
	-  ConcreteHandler：具体的处理者角色，对请求进行处理，如果不能处理则将该请求转发给下一个Handler。
	-  Client：使用责任链模式的客户端。

<br>**应用范例**

　　张三代表公司出国培训，来回一趟花了5万元，回来上班第一天就向组长申请报销费用，组长一看是笔不小的数目，他没有权限审批，于是组长又去找部门主管，主管一看要报这么多钱，自己的权限内只能批五千，于是主管又去找经理，经理一看二话不说直接拿着票据奔向了老板的办公室，因为他的权限也只是一万。

　　我们来用代码来模拟一下这个过程，第一版本的代码可能是这样的：

``` java
float money = 50000;
if (money <= 1000) {
    leader.handleRequest(money);
} else if (money <= 5000) {
    director.handleRequest(money);
} else if (money <= 10000) {
    manager.handleRequest(money);
} else {
    boss.handleRequest(money);
}
```
    语句解释：
    -  这么写虽然很容易理解，但是有如下两个问题：
    -  代码臃肿：实际应用中的判定条件通常不是这么简单地判断是否为1或者是否为2，也许需要复杂的计算，也许需要查询数据库等等，这就会有很多额外的代码，如果判断条件再比较多，那么这个if…else…语句基本上就没法看了。
    -  耦合度高：如果我们想继续添加处理请求的类，那么就要继续添加else if判定条件；另外，这个条件判定的顺序也是写死的，如果想改变顺序，那么也只能修改这个条件语句。

　　既然缺点我们已经清楚了，就要想办法来解决。这个场景的业务逻辑很简单：如果满足条件1，则由Handler1来处理，不满足则向下传递；如果满足条件2，则由Handler2来处理，不满足则继续向下传递，以此类推，直到条件结束。其实改进的方法也很简单，就是把判定条件的部分放到处理类中，这就是责任连模式的原理。


``` java
//首先是Handler的定义
public abstract class LeaderHandler {
    // 相当于上面类图中的sucessor
    protected LeaderHandler nextHandler;

    // 把共有的代码抽取到父类中，具体的业务逻辑有实现类重写handle方法处理。
    public final void handleRequest(int money) {
        if (money <= limit()) {
            handle(money);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(money);
        }
    }

    protected abstract void handle(int money);

    public void setNextHandler(LeaderHandler nextHandler) {
        this.nextHandler = nextHandler;
    }

    protected abstract int limit();
}

public class GroupLeader extends LeaderHandler {
    @Override
    protected void handle(int money) {
        System.out.println("组长给你报销");
    }

    @Override
    protected int limit() {
        return 1000;
    }
}
public class Boss extends LeaderHandler {
    @Override
    protected void handle(int money) {
        System.out.println("老板给你报销");
    }

    @Override
    protected int limit() {
        return Integer.MAX_VALUE;
    }
}
public class Client {
    private LeaderHandler handler;

    public void setLeaderHandler(LeaderHandler handler) {
        this.handler = handler;
    }

    public void handleRequest(int money) {
        this.handler.handleRequest(money);
    }
}
public class LeaderHandlerFactory {
    public static LeaderHandler getLeaderList() {
        LeaderHandler groupLeader = new GroupLeader();
        LeaderHandler boss = new Boss();
        groupLeader.setNextHandler(boss);
        return groupLeader;
    }
}
public class Demo {
    public static void main(String[] args){
        Client client = new Client();
        client.setLeaderHandler(LeaderHandlerFactory.getLeaderList());
        client.handleRequest(50000);
    }
}

```
    语句解释：
    -  可以看到此时Client不会依赖具体的业务类（GroupLeader、Boss等）。

<br>**总结**

　　责任链模式优缺点：

	-  优点：消除某类if-else语句，让请求者和处理者解耦，满足开闭原则（新增一个leader不会影响client）。
	-  缺点：链表元素比较多时，处理请求会很耗时，因为对于每个请求都需要遍历链表中的每一个元素，直到请求被处理。

<br>　　其它介绍：

	-  实际使用中，责任链模式分为纯和不纯两种，一个纯的责任链模式要求一个具体的处理者对象只能在两个行为中选择一个：一是处理请求，二是把请求推给下家。不允许出现某一个具体处理者对象在处理了请求后又把请求向下传的情况，而不纯的则可以又处理又推给下家。
	-  在实际开发中，责任链模式用的比较少，纯的责任链模式的实际例子很难找到，一般看到的例子均是不纯的责任链模式的实现。
	-  在java中switch、try-catch语句都有责任链模式的影子。
	-  客户端发送一个请求，有多个对象都有机会来处理这个请求，但客户端不知道究竟谁来处理。此时可以使用责任链模式。

<br>**本节参考阅读：**
- [Android设计模式源码解析之责任链模式](https://github.com/simple-android-framework-exchange/android_design_patterns_analysis/tree/master/chain-of-responsibility/AigeStudio)
- [极客学院 - 责任连模式](http://wiki.jikexueyuan.com/project/java-design-pattern/chain-responsibility-pattern.html)


## 命令模式 ##
<br>**模式介绍**
　　命令模式（Command Pattern）的定义为：

	-  将一个请求封装成一个对象，从而让用户使用不同的请求把客户端参数化，对请求排队或者记录请求日志，以及支持可撤销的操作。

　　假设我们有一个`Document`类，它提供了加粗字体和粘贴两个方法，一般情况下我们可能会这么写代码：
``` java
public class Document {
    public void bold() {

    }

    public void paste() {

    }
}
public class Cilent {
    public static void main(String[] args){
        Document document = new Document();
        document.bold();
        document.paste();
    }
}
```
    语句解释：
    -  就是直接在客户端中调用具体的方法。这么做有两个问题：
       -  违反开闭原则，如果这两个方法的名字发生改变，则需要修改Client类。
       -  如果需要增加“撤销”操作，则就无法完成。


　　接下来我们先来解决第一个问题，按照前面的学习，可以在Client和Document类之间加一个抽象层，代码如下：
``` java
public interface Command {
    void execute();
}
public class BoldCommand implements Command {
    Document document;

    public BoldCommand(Document document) {
        this.document = document;
    }

    @Override
    public void execute() {
        document.bold();
    }
}
public class PasteCommand implements Command {
    Document document;

    public PasteCommand(Document document) {
        this.document = document;
    }

    @Override
    public void execute() {
        document.paste();
    }
}
public class Cilent {
    public static void main(String[] args){
        Document document = new Document();

        BoldCommand boldCommand = new BoldCommand(document);
        PasteCommand pasteCommand = new PasteCommand(document);

        boldCommand.execute();
        pasteCommand.execute();
    }
}
```
    语句解释：
    -  这样一来当底层Document对象的方法名改变时，最多我们会修改PasteCommand和BoldCommand里的代码，而Client则不会变。也就是说，对于客户端来说，他只需要知道系统提供了哪些操作就可以，但是当系统中新增了操作时，还是得修改客户端的。


　　接着在来让它支持“撤销”操作，既然说道撤销，那么肯定得有个记录机制，我们得把所有执行过的操作都给记录下来，才能在稍后的时候，支持撤销操作。因此我们专门创建一个类来完成此工作：
``` java
// 首先每个命令除了执行方法外，还应该有一个撤销方法。相应的PasteCommand和BoldCommand需要重写该方法，此处就省了。
public interface Command {
    void execute();
    void undo();
}

// 新增一个调用者类，客户端不再直接调用某个命令的execute方法了，而是通过Invoker来调用
// 这么做是用来统一记录客户端执行了哪些命令，以便后续执行撤销操作。
public class Invoker {
    List<Command> commandList = new ArrayList<Command>();

    public void execute(Command command) {
        commandList.add(command);
        command.execute();
    }

    public void undo() {
        if(canUndo()){
            Command command = commandList.get(commandList.size()-1);
            commandList.remove(command);
            command.undo();
        }
    }

    public boolean canUndo() {
        return commandList.size() > 0;
    }
}

```
    语句解释：
    -  至此我们就完成了需求，同时这个代码就是传说中的命令模式。


<br>**UML类图**

<center>
![](/img/android/android_BY_d01_04.png)
</center>

　　角色介绍：

	-  Invoke：维护一个命令列表，用于执行撤销等操作。
	-  Command：命令角色。
	-  ConcreteCommand：具体的命令角色。
	-  Receiver：最终执行命令的人，也就是Document对象。
	-  Client：使用责任链模式的客户端。


<br>**总结**

　　命令模式优缺点：

	-  优点：让客户端和具体业务解耦，从上面我们也可以得知，何时去使用命令模式了，即存在撤销操作时，命令模式是首选。
	-  缺点：充分体现了设计模式的通病，就是类的膨胀，大量衍生类的创建，这是不可避免的问题。

<br>**本节参考阅读：**
- [设计模式学习笔记（十七）——Command命令模式](http://www.cnblogs.com/kid-li/archive/2006/11/18/564852.html)


## 观察者模式 ##
<br>**模式介绍**

　　观察者模式定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会接到通知并自动更新。

<br>**问题描述**

　　假设我们有一个`User`对象（包含姓名、签名、性别等）以及`A、B、C`三个界面，`A`界面用来显示用户信息，`B`界面用来编辑信息，`C`界面用来编辑用户签名，它们三者的跳转关系是`A->B->C`，很显然当我们在`C`界面修改了用户签名后，需要同时更新`A`和`B`界面的内容。

<br>　　常见的解决这个问题的方法有如下三种（但不限于）：

	-  使用广播机制。 
	   -  先在A界面动态注册广播接收者，然后在C界面更新数据后就发送一个广播，A界面接到广播后执行刷新界面。
	-  使用文件存储。 
	   -  在C界面中把最新的数据写到本地文件中，当A界面onResume时再从本地读取数据。
	-  使用Application对象。 
	   -  首先，程序得自定义一个Application对象。
	   -  然后，在Application中创建一个Map对象专门保存全局变量，C界面修改完数据后就将数据放入到Map中。
	   -  最后，当A界面onResume时再从Map中读取数据。

　　这三种解决方法各有缺点：

	-  使用广播机制的缺点：
	   -  代码混乱，各个界面都得动态注册和销毁接收者，不利于维护。
	   -  注册和发送广播是系统级别的操作，如果连续开启多个界面，每个界面都动态注册接收者，很占系统资源。
	-  使用文件存储的缺点： 
	   -  如果有多个线程同时执行任务时，无法保证文件里保存的内容是最新的。
	   -  文件存储涉及到IO操作，相比之下要消耗不少资源。
	-  使用Application对象的缺点： 如果处理不当，Map中的对象会不断累积，导致内存泄露。

　　其实，这个问题本质上就是`“一对多的问题”（一就是User对象，多就是ABC三个界面）`，我们可以使用`“观察者模式”`来解决数据刷新的问题，同时不会存在上面这三种方案带来的弊端。


<br>**UML类图**

<center>
![](/img/android/android_BY_d01_05.jpg)
</center>

　　角色介绍：

	-  Subject：抽象的主题类，也就是被观察（Observable）的对象，其内维护一个被观察的数据（如User对象）以及一个观察者列表，当数据发生变化时，就去通知列表中的所有观察者。
	-  ConcreteSubject：具体主题，除了继承了Subject的特性外，还依据自身维护的数据的不同（如果User等），而提供不同的操作。
	-  Observer：抽象的观察者，它定义了一个观察者所应该具备的接口，以便当数据更新时，主题可以通知观察者。
	-  ConcreteObserver：具体的观察者，当数据发送改变时，每个具体的观察者都会做出不同的处理。

<br>**应用范例**

　　假设我们的项目有一个登录功能，当登录成功后会依据服务端返回的数据来创建一个`User`对象。
　　需求是：登陆成功后，在项目的任何界面都可以访问和修改该`User`对象。

<br>　　范例1：为了实现这个需求，我们先创建一个`com.cutler.demo.model.user.User`类。
``` java
public class User {
    private int id;
    private String nickname;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
```
    语句解释：
    -  也是不多说。

<br>　　然后定义一个观察者接口。
<br>　　范例2：`com.cutler.demo.common.entity.Observer`类。
``` java
public interface Observer<T> {

    /**
     * 当数据被改变时，观察者的此方法会被回调。
     * 注意：此方法会在ui线程中被调用。
     * @param data 新数据。
     */
    public void onDataLoaded(T data);
}
```
    语句解释：
    -  T是泛型，不懂请自己查去。

<br>　　接着，再创建一个名为的`EntityManager`类，用来管理观察者。
<br>　　范例3：`com.cutler.demo.common.entity.EntityManager`类。
``` java
public class EntityManager<T> {
    // 保存所有注册到本Manager中的观察者。
    private List<Observer<T>> observers = new ArrayList<Observer<T>>();
    // 本类所管理的数据。
    private T data;
    // 用于将当前流程，从子线程切换到主线程。
    private Handler mHandler = new Handler(Looper.getMainLooper());

    /**
     * 添加一个观察者。
     */
    public void addObserver(final Observer<T> observer) {
        if(observer == null) {
            throw new NullPointerException();
        }
        // 同步块，防止并发修改observers对象。
        synchronized(observers){
            observers.remove(observer);
            observers.add(observer);
        }
    }

    /**
     * 删除一个观察者。
     */
    public void removeObserver(Observer<T> observer) {
        synchronized(observers) {
            observers.remove(observer);
        }
    }

    /**
     * 通知Manager中已注册的所有观察者，数据已经更新了。
     */
    protected void notifyObservers() {
        mHandler.post(new Runnable() {
            public void run() {
                for (Observer<T> observer : observers) {
                    observer.onDataLoaded(data);
                }
            }
        });
    }

    /**
     * 返回当前Manager的观察者个数。
     */
    public int getObserverCount(){
        return observers.size();
    }

    /**
     * @return 返回当前Manager当前管理的数据。
     */
    public T getData() {
        return data;
    }

    /**
     * @return 設置当前Manager当前管理的数据。
     */
    public void setData(T data) {
        this.data = data;
    }
}
```
    语句解释：
    -  EntityManager类就是上面说的Subject类。

<br>　　`EntityManager`类用来保存共用代码，还需要创建一个单例的类来管理`User`对象，该类继承自`EntityManager`类。
<br>　　范例4：`com.cutler.demo.model.user.LoginUserEntityManager`类。
``` java
public class LoginUserEntityManager extends EntityManager<User> {

    /**
     * 当用户登录成功后调用此方法，将User对象设置到LoginUserEntityManager中。
     * @param user
     */
    public void login(User user) {
        if (user != null) {
            setData(user);
            // TODO 如果需要，你可以在这里将User对象持久化到本地文件中。
        }
    }

    /**
     * 当用户登出时，调用此方法清除本地缓存。
     */
    public void logout() {
        setData(null);
        // TODO 如果需要，你可以在这里将本地缓存的文件给删除。
    }

    /**
     * 修改用户的昵称。
     * @param newName
     */
    public void setName(String newName) {
        if(getData() != null){
            getData().setNickname(newName);
            // 通知各个界面进行数据更新。
            notifyObservers();
            // TODO 如果需要，你可以在这里将User对象持久化到本地文件中。
        }
    }

    // 单例对象
    private static LoginUserEntityManager inst;

    private LoginUserEntityManager() {
        // TODO 如果需要，你可以在这里从本地文件中读取一个User对象。
    }

    /**
     * 返回单例对象
     * @return
     */
    public static LoginUserEntityManager getInstance() {
        if (inst == null) {
            synchronized (LoginUserEntityManager.class) {
                if (inst == null) {
                    inst = new LoginUserEntityManager();
                }
            }
        }
        return inst;
    }
}
```
    语句解释：
    -  LoginUserEntityManager类就是上面说的ConcreteObserver类。

<br>　　最后，就可以让`Activity`实现接口：
``` java
public class LoginActivity extends Activity implements Observer<User> {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 添加观察者
        LoginUserEntityManager.getInstance().addObserver(this);
    }

    public void onDataLoaded(User data) {
        if(data != null){
            // 进行界面数据回填。
            System.out.println(data.getNickname());
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 移除观察者
        LoginUserEntityManager.getInstance().removeObserver(this);
    }
}
```
    语句解释：
    -  这样一来，不论开启了几个Activity，只要在其中一个Activity中更新了User的昵称，那么在其它界面中就会立刻更新。

<br>**与广播接收者对比：**
　　咱们上面是通过`单例+观察者`的模式来管理`Model`数据：

	-  单例模式，让数据可以全局唯一，方便读写。
	-  观察者模式，当数据被更新时，能及时反映到其他所有界面或者类中。

<br>　　使用`观察者`模式和`广播接收者`有什么不同？
　　事实上，广播机制内部就是通过观察者模式来实现的，它们都是事先注册、事后注销，所以广播接收者和观察者不是对立关系，可以相互替代。

<br>　　那为什么不使用`单例+广播接收者`模式呢？
　　广播接收者是为更大的场景而设计的，所以它提供了`Action`等特性，而这些特性是笔者所用不到的。在管理`Model`数据这个问题上，笔者直接用`观察者模式`反而更灵活（占内存少、代码更简单）。
　　同时在观察者模式的基础上加入了`单例模式`，让结构变的清晰了，还可以加上原型模式。观察者在Android比较常用，主要用于GUI。

<br>**本节参考阅读：**
- [观察者模式在android 上的最佳实践](http://www.akiyamayzw.com/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%9C%A8android-%E4%B8%8A%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5/)


## 备忘录模式 ##

<br>**模式介绍**

　　下面是备忘录模式的定义：

	-  在不破坏封闭的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样，以后就可将该对象恢复到原先保存的状态。

　　其实这个模式很简单，我们先不管上面的描述，假设现在要做一个记事本的App，要拥有保存、撤销两个功能，我们第一版的代码可能是这样的：

``` java
public class MainActivity extends AppCompatActivity {

    private EditText mEditText;
    private final int MAX = 10;
    private ArrayList<String> mContentList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.save:
                saveText();
                break;
            case R.id.undo:
                restoreText();
                break;
        }
    }

    private void saveText() {
        if (mContentList.size() > MAX) {
            mContentList.remove(0);
        }
        String text = mEditText.getText().toString();
        mContentList.add(text);
    }

    private void restoreText() {
        if (mContentList.size() > 0) {
            String text = mContentList.remove(mContentList.size() - 1);
            mEditText.setText(text);
        }
    }
}

```
    语句解释：
    -  使用EditText来实现记事本，并提供两个按钮，当点击保存时就把内容存到ArrayList中。

<br>　　通过前面的学习，我们很容易就能看出来这么写代码如下问题：

	-  MainActivity职责太多，即要负责View部分的逻辑，还要负责管理记事本保存和还原操作，长此以往就会导致代码膨胀，难以维护。
	-  如果除了要保存文本外，还需要保存光标的位置等其他信息，则现有代码需要改动很大。

<br>　　解决的方法很简单，代码如下：
``` java
// 首先创建一个JavaBean用来封装要保存的数据。
public class Memento {
    public String text;
    public int cursor;
}
// 然后自定义EditText，让它自己处理数据的备份和还原。
public class NoteEditText extends EditText {
    public NoteEditText(Context context) {
        super(context);
    }

    public NoteEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public Memento createMemento(){
        Memento memento = new Memento();
        memento.text = getText().toString();
        memento.cursor = getSelectionStart();
        return memento;
    }

    public void restore(Memento memento){
        setText(memento.text);
        setSelection(memento.cursor);
    }
}
// 创建一个管理类，负责维护记录列表。
public class NoteCaretaker {
    private final int MAX = 10;
    private ArrayList<Memento> mContentList = new ArrayList<Memento>();

    public void appendMemento(Memento memento) {
        if (mContentList.size() > MAX) {
            mContentList.remove(0);
        }
        mContentList.add(memento);
    }

    public Memento removeMemento() {
        Memento memento = null;
        if (mContentList.size() > 0) {
            memento = mContentList.remove(mContentList.size() - 1);
        }
        return memento;
    }
}
// 最后就是客户端的代码。
public class MainActivity extends AppCompatActivity {

    private NoteEditText mEditText;
    private NoteCaretaker mCaretaker = new NoteCaretaker();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.save:
                mCaretaker.appendMemento(mEditText.createMemento());
                break;
            case R.id.undo:
                mEditText.restore(mCaretaker.removeMemento());
                break;
        }
    }
}
```
    语句解释：
    -  上面每一个类都是不可缺少的，Memento表示一个备份记录，自定义EditText是因为只有它自己才知道要备份哪些东西，NoteCaretaker用来维护备份列表。
    -  此时可以看出，Activity的代码变清晰了。

<br>　　上面代码就是使用了备忘录模式，我们接下来看一下这个模式的UML图。

<br>**UML类图**


<center>
![](/img/android/android_BY_d01_06.png)
</center>

　　角色介绍：

	-  Originator：被备份的目标，它需要提供备份和还原数据的方法，比如上面的NoteEditText。
	-  Memento：备份对象，通常它是Originator的子集，之所以不直接备份Originator是因为很多时候我们只需要备份Originator的某几个字段，而不是全部字段，比如上面的Memento类。
	-  Caretaker：负责管理备份对象，比如将数据持久化到本地等，就是上面的NoteCaretaker对象。


<br>**总结**

　　备忘录模式的扩展：

	-  当需要保存一个对象在某一个时刻的状态或部分状态时，就可以使用备忘录模式（比如游戏存档）。
	-  其实Activity类的源码就有备忘录模式的影子：
	   -  Activity、Fragment、View、ViewGroup等可被保存状态对象就是Originator对象，因为它们都提供了类似于onSaveInstanceState和onRestoreInstanceState方法。
	   -  Activity还扮演了Caretaker角色。
	   -  Memento则由Bundle类扮演。
	-  从Activity的例子可以看出来，设计模式并没有固定的形式，应该活学活用。


　　备忘录模式的优缺点：

	-  优点：给用户提供了一种可以恢复状态的机制，可以使用户能比较方便地回到某个历史的状态。
	-  缺点：消耗资源，如果类的成员变量过多，势必会占用比较大的资源，而且每一次保存都会消耗一定的内存。



## 迭代器模式 ##

<br>**模式介绍**

　　迭代器（Iterator Pattern）又称为游标（Cursor）模式，是行为型设计模式之一。迭代器模式算是一个比较古老的设计模式，其源于对容器的访问，比如Java中的List、Map、数组等，我们知道对容器对象的访问必然会涉及遍历算法，我们可以将遍历的方法封装在容器中，或者不提供遍历方法。如果将遍历的方法封装到容器中，那么对于容器类来说就承担了过多的功能，容器类不仅要维护自身内部的数据元素而且还要对外提供遍历的接口方法，如果我们不提供遍历方法而让使用者自己去实现，又会让容器的内部细节暴露无遗，正因于此，迭代器模式应运而生，在客户访问类与容器之间插入了一个第三者——迭代器，很好地解决了上面所述的弊端。

　　因此迭代器模式的定义为：

	-  提供一种方法顺序访问一个容器对象中的各个元素，而又不需要暴露该对象的内部表示。
	-  很显然，当需要遍历一个容器对象时，就是使用迭代器模式之日。

<br>**UML类图**

<center>
![](/img/android/android_BY_d01_07.png)
</center>

　　角色介绍：

	-  Iterator：迭代器接口，定义迭代器所必备的公共方法，如hasNext、next等。
	-  ConcreteIterator：Iterator的实现类，负责具体的实现。
	-  Aggregate：容器接口，定义容器应该具有的公共方法，如add、remove等。
	-  ConcreteAggregate：具体的容器类。


<br>**应用范例**

``` java
// 它的相当于java.util.Iterator类。
public interface Iterator {  
    public Object next();  
    public boolean hasNext();  
}  
// 它相当于ArrayList的内部类ArrayList.Itr类。
public class ConcreteIterator implements Iterator{  
    private List list = new ArrayList();  
    private int cursor =0;  
    public ConcreteIterator(List list){  
        this.list = list;  
    }  
    public boolean hasNext() {  
        return cursor!=list.size();  
    }  
    public Object next() {  
        Object obj = null;  
        if(this.hasNext()){  
            obj = this.list.get(cursor++);  
        }  
        return obj;  
    }  
}  
// 它相当于ArrayList实现的List接口。
public interface Aggregate {  
    public void add(Object obj);  
    public void remove(Object obj);  
    public Iterator iterator();  
}  
// 它相当于ArrayList。
class ConcreteAggregate implements Aggregate {  
    private List list = new ArrayList();  
    public void add(Object obj) {  
        list.add(obj);  
    }  
  
    public Iterator iterator() {  
        return new ConcreteIterator(list);  
    }  
  
    public void remove(Object obj) {  
        list.remove(obj);  
    }  
}  
public class Client {  
    public static void main(String[] args){  
        Aggregate ag = new ConcreteAggregate();  
        ag.add("小明");  
        ag.add("小红");  
        ag.add("小刚");  
        Iterator it = ag.iterator();  
        while(it.hasNext()){  
            String str = (String)it.next();  
            System.out.println(str);  
        }  
    }  
}  
```
    语句解释：
    -  对于迭代器模式来说，其自身的有点很明显也很单一，支持以不同的方式去遍历一个容器对象，也可以有多个遍历，弱化了容器类与遍历算法之间的关系，而其缺点就是对类文件的增加，另外我们通常会把Iterator做为容器的内部类来写。
    -  大家也可能会想到其他的语言，如C++、Python、PHP等，它们内部也有众多容器体的定义，当然也有相应的迭代器。迭代器模式发展至今，几乎每一种高级语言都有相应的内置实现，对于开发者而言，已经极少会去由自己来实现迭代器了，因此，对于本节的内容更多的是在于了解而非应用。

## 模版方法模式 ##

<br>**模式介绍**

　　模版方法模式的定义为：

	-  定义一个操作中的算法的框架，而将一些步骤延迟到子类中，使得子类可以不改变一个算法的结构即可以重定义该算法的某些特定步骤。


<br>　　举个办银行卡例子，其实银行已经将开户的所有流程给规定好了（填表、排号、交身份证、交手续费等），虽然流程固定好了，但是每个步骤中需要我们客户参与到其中，比如填表时每个客户填自己的信息，交本人的身份证等，每个客户的信息银行是无法预知的，只能让客户来提供。这个场景换算到程序中就是模板设计模式，所谓的模版就是我们事先把能考虑到的、重用的代码放到父类中，而将一些不可预知的、需要用户提供的数据定义成抽象方法，并交给子类去重写。

　　假设现在有一个Person类，它有两个学生和工人两个子类，学生和工人都可以说话，只不过内容不同。


``` java
public abstract class Person {
    private String name;
    public Person(String name){
        this.name=name;
    }
    public String getName(){
        return this.name;
    }
    // 此方法不能被子类重写
    public final void speak(){
        System.out.println(getInfo());
    }
}
class Student extends Person{
    private int score;
    public Student(String name,int score){
        super(name);
        this.score=score;
	}
    public String getInfo(){
        return getName()+"说：我是个学生 我考了 "+this.score+"分";
    }
}
class Worker extends Person{
    private float sal;
    public Worker(String name,float sal){
        super(name);
        this.sal=sal;
    }
    public String getInfo(){
        return getName()+"说：我是个工人 我的月工资是 "+this.sal+" 元";
    }
}
public class Demo{
    public static void main(String[] args){
        new Student("小明",90).speak();
        new Worker("张三",5000F).speak();
    }
}
```
    语句解释：
    -  从本范例可以看出来，模版设计模式就是把共用的代码提取到父类中，并定义若干方法供子类重写，这些方法不一定要是抽象的。


<br>**UML类图**

<center>
![](/img/android/android_BY_d01_08.jpg)
</center>

　　角色介绍：

	-  AbstractClass：模版类，其内封装公用的代码。
	-  SubClass1：子类1。
	-  SubClass2：子类2。


<br>**总结**

　　模版设计模式：

	-  在Android中AsyncTask就是模版设计模式的应用典范。
	-  优点：封装不变部分，扩展可变部分，便于维护。
	-  缺点：对于初级工程师来说，代码阅读难度增加。


## 中介者模式 ##

<br>**模式介绍**

　　有时候在一个系统中对象之间的联系呈现为网状结构（如下图左所示），对象之间存在大量的多对多联系，将导致系统非常复杂。在网状结构中，几乎每个对象都需要与其他对象发生相互作用，而这种相互作用表现为一个对象与另外一个对象的直接耦合，这将导致一个过度耦合的系统。

　　此时我们就可以使用中介者模式，它能够使对象之间的依赖关系如下图右所示，即让各对象只依赖于中介者（Mediator），并由该中介者进行统一协调，这样对象之间多对多的复杂关系就转化为相对简单的一对多关系。通过引入中介者来简化对象之间的复杂交互，中介者模式是“迪米特法则”的一个典型应用。

<center>
![对象依赖关系图](/img/android/android_BY_d01_09.jpg)
</center>


<br>**应用范例**

　　我们使用一个例子来说明一下什么是同事类：有两个类A和B，类中各有一个数字，并且要保证类B中的数字永远是类A中数字的100倍。也就是说，当修改类A的数时，将这个数字乘以100赋给类B，而修改类B时，要将数除以100赋给类A。类A类B互相影响，就称为同事类。代码如下：

``` java
abstract class AbstractColleague {
    protected int number;

    public int getNumber() {
        return number;
    }

    public void setNumber(int number){
        this.number = number;
    }
    //抽象方法，修改数字时同时修改关联对象
    public abstract void setNumber(int number, AbstractColleague coll);
}

class ColleagueA extends AbstractColleague{
    public void setNumber(int number, AbstractColleague coll) {
        this.number = number;
        coll.setNumber(number*100);
    }
}

class ColleagueB extends AbstractColleague{

    public void setNumber(int number, AbstractColleague coll) {
        this.number = number;
        coll.setNumber(number/100);
    }
}

public class Client {
    public static void main(String[] args){

        AbstractColleague collA = new ColleagueA();
        AbstractColleague collB = new ColleagueB();

        System.out.println("==========设置A影响B==========");
        collA.setNumber(1288, collB);
        System.out.println("collA的number值："+collA.getNumber());
        System.out.println("collB的number值："+collB.getNumber());

        System.out.println("==========设置B影响A==========");
        collB.setNumber(87635, collA);
        System.out.println("collB的number值："+collB.getNumber());
        System.out.println("collA的number值："+collA.getNumber());
    }
}
```
    语句解释：
    -  上面的代码中，类A类B通过直接的关联发生关系，假如我们要使用中介者模式，类A类B之间则不可以直接关联，他们之间必须要通过一个中介者来达到关联的目的。


　　修改后的代码为：
``` java
 abstract class AbstractColleague {
    protected int number;

    public int getNumber() {
        return number;
    }

    public void setNumber(int number){
        this.number = number;
    }
    //注意这里的参数不再是同事类，而是一个中介者
    public abstract void setNumber(int number, AbstractMediator am);
}

class ColleagueA extends AbstractColleague{
    public void setNumber(int number, AbstractMediator am) {
        this.number = number;
        am.AaffectB();
    }
}

class ColleagueB extends AbstractColleague{
    public void setNumber(int number, AbstractMediator am) {
        this.number = number;
        am.BaffectA();
    }
}

abstract class AbstractMediator {
    protected AbstractColleague A;
    protected AbstractColleague B;

    public AbstractMediator(AbstractColleague a, AbstractColleague b) {
        A = a;
        B = b;
    }

    public abstract void AaffectB();

    public abstract void BaffectA();

}
class Mediator extends AbstractMediator {

    public Mediator(AbstractColleague a, AbstractColleague b) {
        super(a, b);
    }

    //处理A对B的影响
    public void AaffectB() {
        int number = A.getNumber();
        B.setNumber(number*100);
    }

    //处理B对A的影响
    public void BaffectA() {
        int number = B.getNumber();
        A.setNumber(number/100);
    }
}

public class Client {
    public static void main(String[] args){
        AbstractColleague collA = new ColleagueA();
        AbstractColleague collB = new ColleagueB();

        AbstractMediator am = new Mediator(collA, collB);

        System.out.println("==========通过设置A影响B==========");
        collA.setNumber(1000, am);
        System.out.println("collA的number值为："+collA.getNumber());
        System.out.println("collB的number值为A的10倍："+collB.getNumber());

        System.out.println("==========通过设置B影响A==========");
        collB.setNumber(1000, am);
        System.out.println("collB的number值为："+collB.getNumber());
        System.out.println("collA的number值为B的0.1倍："+collA.getNumber());

    }
}
```
    语句解释：
    -  复杂的网状结构，是一种过度耦合的架构，即不利于类的复用，也不稳定。
    -  引入中介者模式后，同事类之间的关系将变为星型结构，任何一个类的变动，只会影响的类本身，以及中介者，这样就减小了系统的耦合。

<br>**UML类图**

<center>
![](/img/android/android_BY_d01_10.png)
</center>

　　角色介绍：

	-  Mediator：抽象中介者角色，定义了同事对象到中介者对象的接口，一般以抽象类的方式实现。
	-  ConcreteMediator：具体的中介者。
	-  Colleague：抽象同事类。
	-  ConcreteColleagueA/B：具体的同事类角色。


<br>**总结**

　　中介者设计模式：

	-  其实在Android中我们经常使用中介者模式，Activity就扮演着Mediator的角色，比如登录界面，只有用户在两个文本框都输入内容时，登录按钮才可以被点击，这样一来文本框和按钮就是同事对象了。
	-  优点：将对象间多对多的关系转为一对多，降低耦合。
	-  缺点：中介者模式是一种比较常用的模式，也是一种比较容易被滥用的模式。对于大多数的情况，同事类之间的关系不会复杂到混乱不堪的网状结构，因此，大多数情况下，将对象间的依赖关系封装的同事类内部就可以的，没有必要非引入中介者模式。滥用中介者模式，只会让事情变的更复杂。
	-  另外，中介者需要对外界提供所有同事类的接口，以供其它同事类调用，因此中介者里的代码会有很多。

<br>**本节参考阅读：**
- [极客学院 - 中介者模式](http://wiki.jikexueyuan.com/project/java-design-pattern/mediator-pattern.html)


# 第六节 结构型模式 #

## 代理模式 ##

<br>　　代理是什么？为什么需要代理呢？

	-  其实程序里的代理与日常生活中的“代理”，“中介”差不多；比如你想海淘买东西，不可能亲自飞到国外去购物，这时候我们使用第三方海淘服务比如考拉海购等；
	-  代理其实是有两面性的：
	   -  好处是：方便、省时间。
	   -  坏处是：由于我们不是和最终商家沟通，而是和代理者沟通，因此代理可以提高商品的价格、或者将购买的正品留下，换成次品再发给我们等。

　　在程序中，我们也有很多场景会用到`“代理”`的概念，接下来先来学习一下代理模式的基本写法。

<br>**UML类图**

<center>
![](/img/android/android_BY_d01_12.png)
</center>

　　角色介绍：

	-  Subject：抽象主题类，其内定义了公共的抽象方法。
	-  RealSubject：真是的主题类。
	-  ProxySubject：代理主题类，它不会真正执行业务逻辑，而是会转调用RealSubject去执行。


<br>　　通常，每个项目都会有自己的Http模块，我们来模拟一下请求过程，先定义一个HttpRequest接口：
``` java
public interface HttpRequest {
    // 传递url和参数，执行请求。
    String doRequest(String url, Map<String,String> params);
}
```
　　它有一个原始的实现，代码如下：
``` java
public class RealHttpRequest implements HttpRequest {
    @Override
    public String doRequest(String url, Map<String,String> params) {
        // 用伪代码来模拟一下，执行网络请求
        HttpResponse response = ...;
        String json = response.getResult();
        return json;
    }
}
```
　　上面的代码看起来没有问题，但是有一天新来个需求：

	-  在任何接口的返回值中，如果状态吗返回了20003，则就让程序跳转到登录界面，让用户登录。

　　此时新手可能会这么写代码：
``` java
public class RealHttpRequest implements HttpRequest {
    @Override
    public String doRequest(String url, Map<String,String> params) {
        // 用伪代码来模拟一下，执行网络请求
        HttpResponse response = ...;
        String json = response.getResult();
        // 判断状态码
        if(new JSONObject(json).getInt("code") == 20003){
             startActivity(...);
        }
        return json;
    }
}
```
    语句解释：
    -  这么做确实能解决问题，但是违反了单一指责原则，RealHttpRequest应该只负责执行网络请求，对状态码的判断应该在另外的地方。
    -  而且如果这种情况都去修改RealHttpRequest类的话，以后再来新需求，还可能会去修改它。


　　此时可以使用代理模式，定义一个ProxyHttpRequest类，在其内部转调用RealHttpRequest：
``` java
public class ProxyHttpRequest implements HttpRequest {

    // 真正去执行请求的对象。
    HttpRequest real;

    ProxyHttpRequest(HttpRequest real) {
        this.real = real;
    }

    @Override
    public String doRequest(String url, Map<String,String> params) {

        // 请求执行之前的预处理操作
        // ……

        // 调用正主执行请求
        String json = real.doRequest(url, params);

        // 判断状态码
        if(new JSONObject(json).getInt("code") == 20003){
             startActivity(...);
        }

        // 返回数据
        return json;
    }
}
```
    语句解释：
    -  代理模式其实就是在真正的任务的开头或末尾加上一些操作，最终执行任务的，仍然是客户本人。


<br>　　再举个例子：假设现在有A、C两个对象，但是A和C不在一个服务器上，且A会频繁的调用C。
　　此时就可以做一个代理类Proxy，把访问C的工作交给Proxy（处理网络请求等），这样对于A来说，就好像在直接访问C的对象，在对A的开发中我们可以把注意力完全放在业务的实现上。如下图所示：

<center>
![](/img/android/android_BY_d01_11.jpg)
</center>

<br>　　另外，在[《Framework篇　第二章 Binder机制》](http://cutler.github.io/android-BY-C02/)中也可以看到代理模式的应用范例，在IPC时客户端和服务端分别存在一个Proxy对象，用来帮助对象在跨进程传递时的封包和拆包。

<br>**动态代理**

　　上面的介绍代理模式被称为静态代理，静态代理要为每一个需要代理的类写一个代理类。

	-  如果需要代理的类有几百个，那就很蛋疼了；而且在使用的时候会发现，每个代理方法里的内容相似度很高（都是先在方法的开头或结尾做一些事情，然后再调用真正的业务类的方法）。
	-  为此Java提供了动态代理方式，可以简单理解为，在运行时虚拟机会帮我们动态生成一系列的代理类，这样我们就不需要手写每一个静态的代理类了。

　　其实JDK本身就支持动态代理，依然以Http请求为例，用动态代理实现如下：
``` java
public void onClick(View view) {
    final HttpRequest real = new RealHttpRequest();
    // 创建代理对象
    HttpRequest proxy = (HttpRequest) Proxy.newProxyInstance(
            HttpRequest.class.getClassLoader(),
            real.getClass().getInterfaces(), new InvocationHandler() {

                public Object invoke(Object proxy, 
                              Method method, Object[] args) throws Throwable {
                    if ("doRequest".equals(method.getName())) {
                        // 调用正主执行请求
                        String json = method.invoke(real, args);
                        // 判断状态码
                        if(new JSONObject(json).getInt("code") == 20003){
                            startActivity(...);
                        }
                        return json;
                    }
                    return null;
                }
            });
    // 执行网络请求
    System.out.println(proxy.doRequest("http://xxxxx", new HashMap<String,String>()));
}
```
    语句解释：
    -  动态代理只能作用在接口上，不能动态代理类。

<br>**总结**

　　代理模式：

	-  代理模式应用很广泛，后面我们讲到的其它结构型模式中，你都可以看到代理模式的影子。
	-  一言以蔽之，代理类的任务就是处理真实主题类所不愿意处理的事情，最终任务的执行还是由真是主题类去做。

<br>**本节参考阅读：**
- [java设计模式——代理模式](https://www.zybuluo.com/pastqing/note/174679)


## 适配器模式 ##

<br>**模式介绍**

　　有时，现有的类可以满足客户类的功能需要，但是它所提供的接口不一定是客户类所期望的，这可能是因为现有类中方法名与客户端期望的方法名不一致等原因所导致的。
　　在这种情况下，现有的接口需要转化为客户类期望的接口，这样保证了对现有类的重用。

　　适配器模式的定义为：

	-  适配器模式把一个类的接口变成客户端所期望的另一个接口，从而使原本因接口不匹配而无法在一起工作的两个类能够在一起工作。

<br>**UML类图**

<center>
![](/img/android/android_BY_d01_13.png)
</center>

　　角色介绍：

	-  Target：目标角色，也就是客户端所期望的接口。
	-  Adaptee：现有的类，也就是需要被适配的接口。
	-  Apdater：适配器类。


<br>**应用范例**

　　下面是Adapter模式的简单实现：
``` java
// 已存在的、具有特殊功能、但不符合我们既有的标准接口的类
public class Adaptee {
    public void specificRequest() {
        System.out.println("被适配的类，具有特殊功能...");
    }
}
// 客户端期望的接口，或称为标准接口
public interface Target {
    public void request();
}

// 具体目标类，只提供普通功能
public class Adapter implements Target {
    Adaptee base;
    public Adapter(Adaptee base){
        this.base = base;
    }
    public void request() {
        base.specificRequest();
    }
}
public class Client {
    public static void main(String[] args) {
        // 使用普通功能类
        Target adapter = new Adapter(new Adaptee());
        adapter.request();
    }
}
```
    语句解释：
    -  从上面的代码中可以看到，在Adapter模式中存在了代理模式的影子。
    -  不同的是，代理模式会在request方法中添加一些代码，而适配器模式只是转调用。


<br>　　还有一种情况，现有的类提供了相同的方法，但是却因为继承关系不匹配导致客户端无法使用：
``` java
// 已存在的、具有特殊功能、但不符合我们既有的标准接口的类
public class Adaptee {
    public void request() {
        System.out.println("被适配类具有 特殊功能...");
    }
}
// 目标接口，或称为标准接口
public interface Target {
    public void request();
}

// 具体目标类，只提供普通功能
public class Adapter extends Adaptee implements Target {

}
public class Client {
    public static void main(String[] args) {
        // 使用普通功能类
        Target adapter = new Adapter();
        adapter.request();
    }
}
```
    语句解释：
    -  这种写法被称为类适配器，上面的被称为对象适配器。
    -  如果你手上有一个对象，且没有办法去实例化一个新对象的话，就可以用对象适配器。

<br>　　还有一种情况，适配器做为外抛给客户端的接口：

>比如ListView用来显示一个列表，但是它并不知道每个Item长什么样。于是通过一个BaseAdapter类来告诉客户端（开发者）要提供哪些数据，此时BaseAdapter就处于ListView和开发者之间，扮演转接的角色。

## 装饰模式 ##

　　继承可以让一个类拥有其父类的行为，但是有些场景下继承并不总合适。比如我们开了家咖啡馆，有4种咖啡豆，同时用户购买咖啡时还可以搭配一些调料（比如牛奶、糖等），假设我们有5种调料，那么最终至少就需要20个类来表示所有的咖啡（还不算复合咖啡，就是同时加牛奶和糖）。而且如果牛奶的价格发生改变，那么至少得修改4个类的代码，显然是不可取的的。 此时我们就可以使用装饰模式。


	-  装饰模式（Decorator）也称为包装模式（Wrapper），是结构型设计模式之一，它可以动态的给一个对象添加一些额外的职责，就增加功能来说，装饰模式相比生成子类更为灵活。

<br>**UML类图**

　　我们先来看看装饰模式的UML图，然后去学习一下装饰模式的基础写法，最后再去看它的应用场景。

<center>
![](/img/android/android_BY_d01_14.jpg)
</center>

　　角色介绍：

	-  Component：抽象组件，就是被装饰的对象所实现的接口。
	-  ConcreteComponent：具体组件，也就是被装饰的对象。
	-  Decorator：抽象的装饰器。
	-  ConcreteDecoratorA：具体的装饰器。

<br>　　接下来给出一个最简单的装饰器模式的写法：

``` java
public abstract class Coffee {
    //描述
    public abstract String getDescription();
    //价格
    public abstract double getPrice();
}
// 普通咖啡
public class NormalCoffee extends Coffee {
    public String getDescription() {
        return "NormalCoffee";
    }
    public double getPrice() {
        return 10;
    }
}
// 抽象的装饰器，其内定义一些共有的代码，以供子类使用。
public abstract class Decorator extends Coffee {
    Coffee beverage;
    public Decorator(Coffee beverage) {
        this.beverage = beverage;
    }
    public String getDescription() {
        return beverage.getDescription();
    }
    public double getPrice() {
        return beverage.getPrice();
    }
}
// 牛奶装饰器
public class MilkCoffee extends Decorator {
    public MilkCoffee(Coffee beverage) {
        super(beverage);
    }
    public String getDescription() {
        return "加牛奶的 "+super.getDescription();
    }
    public double getPrice() {
        return 20 + super.getPrice();
    }
}
// 客户端代码
public class DecoratorDemo {
    public static void main(String[] args){
        Coffee beverage = new MilkCoffee(new NormalCoffee());
        System.out.println(beverage.getDescription());
        System.out.println(beverage.getPrice());
    }
}
```
    语句解释：
    -  其实从写法上来说，Decorator是可以不继承Coffee类的，之所以让它继承，是因为装饰器必须和被装饰类拥有相同的接口。这样才能让客户端感觉到，使用装饰器和使用具体组件是没有区别的。
    -  这样一来，假设用户选择了“加糖加牛奶加冰毒”我们的代码也能完成。

<br>**应用范例1**
<br>　　装饰模式在Java语言中的最著名的应用莫过于Java I/O标准库的设计了。

	-  由于Java I/O库需要很多性能的各种组合，如果这些性能都是用继承的方法实现的，那么每一种组合都需要一个类，这样就会造成大量性能重复的类出现。而如果采用装饰模式，那么类的数目就会大大减少，性能的重复也可以减至最少。因此装饰模式是Java I/O库的基本模式。

　　Java I/O库的对象结构图如下，由于Java I/O的对象众多，因此只画出InputStream的部分。
<center>
![](/img/android/android_BY_d01_15.png)
</center>

　　根据上图可以看出：

	-  Component：由InputStream扮演。这是一个抽象类，为各种子类型提供统一的接口。
	-  ConcreteComponent：由FileInputStream等类扮演，它们实现了抽象构件角色所规定的接口。
	-  Decorator：由FilterInputStream扮演，它实现了InputStream所规定的接口。
	-  ConcreteDecoratorA：由BufferedInputStream等类扮演。

<br>**应用范例2**

　　我们都知道Context是Android开发中的上帝对象，很多地方都会用到这个类里定义的方法，而且Activity、Service都是该类的间接子类，但是当我们查看它们的继承树时就会发现，它们并不是直接继承Context类的，而是继承一个名为ContextWrapper的类。


　　很显然，ContextWrapper就是我们本节介绍的装饰模式里的装饰器，它内部持有一个`mBase`属性，它定义的所有方法都是转调用`mBase`的，原因可能是：

	-  第一，Activity的使命是UI的展示，如果把startActivity等方法定义在其内话，违反单一指责原则。
	-  第二，Service中也需要执行startActivity等方法，将这些方法放到ContextImpl类中可以方法代码重用。

<br>**本节参考阅读：**
- [《JAVA与模式》之装饰模式](http://www.cnblogs.com/java-my-life/archive/2012/04/20/2455726.html)


## 享元模式 ##

<br>**模式介绍**

　　享元模式（Flyweight）听起来很牛逼，其实在咱们一开始那个图片加载器中就已经使用到它了，简单地说，享元模式就是对象缓存的技术。

<br>　　下面以买火车票为例，第一版的代码为：
``` java
public interface Ticket {
    public void showTicketInfo(String bunk);
}
public class TrainTicket implements Ticket {
    public String from; // 始发地
    public String to;   // 目的地

    public TrainTicket(String from, String to) {
        this.from = from;
        this.to = to;
    }

    @Override
    public void showTicketInfo(String bunk) {
        System.out.println("TrainTicket{" +
                "from='" + from + '\'' +
                ", to='" + to + '\'' +
                '}');
    }

}
public class TicketFactory {
    public static Ticket getTicket(String from, String to) {
        return new TrainTicket(from, to);
    }
}
```
    语句解释：
    -  猛地一看好像没什么问题，但是如果短时间内getTicket方法被调用10000次呢？每次查询的参数都是一样的，但是频繁创建了大量对象。

<br>　　为了减少对象的创建，我们就可以使用享元模式，对一些常用的对象进行缓存，代码如下：
``` java
public class TicketFactory {
    static Map<String, Ticket> cache = new HashMap<>();

    public static Ticket getTicket(String from, String to) {
        String key = from + "-" + to;
        Ticket ticket = cache.get(key);
        if (ticket == null) {
            ticket = new TrainTicket(from, to);
            cache.put(key, ticket);
        }
        return ticket;
    }
}
```
    语句解释：
    -  当然，本范例只是为了演示模式的用法，正式使用的时候，还可以在这基础上加一个超时机制，超过1分钟对象即便被缓存，也应该重新请求。

<br><br>
