title: 架构篇　第二章 开源库
date: 2018-9-24 23:18:30
categories: Android开发 - 不屈白银
---
　　我们都知道要写一款精品软件是有难度且很复杂的：不仅要满足特定要求，而且软件还必须具有稳健性，可维护、可测试性强，并且能够灵活适应各种发展与变化。这虽然很难，但也不是没法办到：实际上在咱们Android圈里已经出现了很多优秀的工具库，它们各自针对不同的应用场景，我们基于它们可以二次创作出非常优秀的项目架构，因此本章就来介绍一些当前比较流行的开源库。



# 第一章 RxJava #

<br>　　写在前面的话：
<br>　　本文综合了十篇以上的博文内容，并以笔者自己的逻辑路线加以修改与汇总，希望对大家有帮助，所以如果你感觉本文中的某些内容似曾相识，不要疑惑，那一定是我抄的。
　　另外，RxJava本身的功能很多、很强大，而本文主要的目的是入门RxJava，因此很多高级用法没有介绍，各位请自学。

## 第一节 它到底是什么 ##

<br>　　一个词：**异步**。它在 GitHub 主页上的自我介绍是：

    RxJava – Reactive Extensions for the JVM – a library for composing asynchronous and event-based programs using observable sequences for the Java VM.

    翻译：一个在 Java VM 上使用可观测的序列来组成异步的、基于事件的程序的库。

　　概括得非常精准，然而对于初学者来说，这太难看懂了，因为它是一个『总结』。
　　简单的说，RxJava就是一个实现异步操作的库。

<br>**简单异步和复杂异步：**

　　我知道你在想什么，和我当时想的一样，异步谁不会，为什么用它来搞异步？ 
　　异步无非就是开个线程干点事，然后在切换回主线程，或者给控件设置的监听器也可以算是异步操作，但这有什么难的，这点破事还用单独写一个开源库？

　　其实更准确的说，RxJava主要用来执行`复杂的`、`多层次的`异步操作，简单的异步操作发挥不了它的优势。

　　也就是说，当项目的业务逻辑足够复杂的时候，可能会需要同时发起多个异步操作、甚至存在嵌套的异步操作，考虑到异步操作在时间上地不确定性，此时再用上面列出的技术的话，先不说需要自己处理线程切换、AsyncTask的版本兼容性等问题，光是随之而来的复杂性就不容忽视了，比如若需求是等所有异步都返回的时候，再对结果统一处理，程序员就需要提供一些额外的逻辑来判断异步操作何时结束以及后续的操作何时开始。

　　此时就是RxJava系列库的用武之地，这就是大家之所以说小项目可以不用RxJava的真正原因。
　　但这并不是说就没必学RxJava了，其实RxJava还可以和其它开源库一起配合使用（比如Retrofit），效果非常棒。

<br>**本节参考阅读：**
- [抛物线 - 给 Android 开发者的 RxJava 详解](https://gank.io/post/560e15be2dca930e00da1083)
- [Rx概述（RxJava2）](https://www.jianshu.com/p/f0fd9d8803a3)


## 第二节 前世今生 ##

<br>　　既然知道了RxJava是用来做什么的了，那在正式介绍它的用法之前，先来简要说一下它的前世今生，本节的内容理解即可，不需要背诵。

### 源于ReactiveX

<br>　　RxJava 其实是 ReactiveX 的一个具体实现， ReactiveX 是 Reactive Extensions 的缩写，一般简写为 Rx 。

    Rx由微软的架构师Erik Meijer领导的团队开发一个项目，它主要是用来帮助开发者更方便的处理异步，事实上Rx只定义了一套编程接口。
    既然定义接口，那它就得有具体的实现，事实也确实如此，它在很多语言平台上都有自己的实现。
    截止至2018年9月份，从Rx官网上可以看到，Rx库支持.NET、js、java、swift、c++等18种语言，Rx的大部分语言由ReactiveX这个组织维护。

　　我们上面说的 RxJava 就是 ReactiveX 在JVM上的一个实现，帮助我们更方便的处理复杂异步。

### 源于LINQ

<br>　　如果继续向上追溯的话，就会知道还有一种名为LINQ的技术，Rx其实借鉴了LINQ的很多东西，也算是对LINQ的一种扩展，接下来咱们就稍微看一下LINQ到底是什么。

    提示：其实知不知道LINQ对咱们学习RxJava没有任何影响，但是了解一下也不会花多少时间。

<br>　　`LINQ`是`Language Integrated Query`的简称，翻译为“集成查询语言”。

　　我们知道`SQL`是一种操作数据库的通用语言，不论是Oracle、SQLite还是SyBase数据库，它们都支持标准的SQL语法，这样一来就给程序员带来的极大的方便，学一门语言就可以对各种DBMS进行基础操作。
　　但是，SQL仍然存在三个问题：

    1、SQL没法和编程语言直接配合使用，比如Java、Android中没法直接编译SQL语句，只是将它们视为一个字符串在运行的时候执行。
    2、实际开发中，数据并不一定都保存在数据库中，也可能保存在XML等任何地方，但SQL只服务于数据库。
    3、最主要的是，对于复杂的查询操作，SQL语句写出的代码也很复杂，维护成本高，编写效率低。

　　而 LINQ 其实是在 SQL 之上又进行了一层抽象：

    LINQ其实也提供了一套统一的编程接口，它可以高效的对数据进行增删查改操作，从它的官网上可以看到，目前提供了C#和VB两个语言平台的实现。
    有了LINQ，程序员便可以不再沉泥于不同的数据访问技术的学习，也不需要关心他将要操作的将是关系数据库还是XML，甚至是远程的对象，它都采用同样的查询方式。
    不管编程语言如何发展，还是数据库技术的发展，都不再需要程序员进行学习，数据存储的效率由数据库厂商进行优化，灵活的数据操作方法由数据访问中间件厂商提供，程序员只需要编写业务逻辑。

　　简而言之， LINQ 的语法既类似于SQL，又高效且简洁于 SQL ，它可以实现链式调用。笔者推荐各位看一下[《为什么说 LINQ 要胜过 SQL》](https://www.oschina.net/translate/why-linq-beats-sql)，这样可以对LINQ以及它的语法有一个更形象的了解。

<br>　　话说回来，事实上Rx借鉴了LINQ的操作符和链式调用的特点，并融合的观察者模式和Schedulers，因此可以这么说：

    Rx = Observables（观察者模式） + LINQ + Schedulers。

　　关于这个定义各位现在可能不太好理解，不用担心，等整体看完一遍本文后，再回头来看就能明白了。

### 扩展出RxAndroid

<br>　　ReactiveX 这个组织针对 Android 平台还提供了一个适配库，名为[ RxAndroid ](https://github.com/ReactiveX/RxAndroid)，这个库是在 RxJava 基础上编写的，它的源码一共也没多少，就是针对Android平台上线程切换等事情做了些适配。
　　也就是说，学会了RxJava你就学会了RxAndroid，因此后面再说到Rx的时候，各位就直接理解为RxJava就好了。

### 现存两大版本

<br>　　事实上，目前Rxjava有1.x和2.x两个大版本在被使用，ReactiveX在2014年11月18号发布了1.0，在2016年8月26号发布了2.0，相比于1.x版本主要的改动有：

    -  包名改变了，从ix.xx改为io.reactivex.xx。
    -  代码完全遵守Reactive Streams规范。
    -  新增和更新了若干API，如Flowable等。

　　关于RxJava1.x和2.x的更多区别，请去看本节末尾列出参考链接，为了适应的面更广，本文会主要介绍1.x的语法，其实学会了1.x再去看2.x就很快了。


<br>**本节参考阅读：**
- [极客学院 - ReactiveX](http://wiki.jikexueyuan.com/project/rx-docs/Intro.html)
- [reactivex.io](http://reactivex.io/#)
- [LINQ教程一：LINQ简介](https://www.cnblogs.com/dotnet261010/p/8278793.html)
- [所以什么是LINQ](https://ithelp.ithome.com.tw/articles/10194251)
- [RxJava 1.x 和 RxJava 2.x 的异同](https://www.jianshu.com/p/765591cb2fd8)

## 第三节 RxJava 1.x ##

<br>　　范例1：环境配置。在 AndroidStudio 中使用如下代码：

``` gradle
api 'io.reactivex:rxandroid:1.2.1'
```
    语句解释：
    -  RxAndroid是和RxJava保持同步的，也分为1.x和2.x版本，其中1.2.1就是RxAndroid1.x的最后一个版本。
    -  由于在RxAndroid的内部就引用的RxJava库，所以我们只需要引用RxAndroid库就可以了。


<br>　　前面说了 RxJava 是基于观察者模式的，在继续往下学习之前，关于这个模式的定义咱们需要先达成共识：

    第一，常见的观察者模式里，被观察者内部持有一个观察者者列表，当数据变化时，被观察者会遍历列表，依次通知每一个观察者。
    第二，在更广义的观察者模式中，被观察者的内部可以不持有一个观察者列表，而只持有一个观察者的引用，比如我们经常调用setOnClickListener方法给Button设置回调函数，这个操作就可以理解为观察者模式：Button是被观察者，被点击时，会调用回调函数通知我们这个唯一的观察者。

　　事实上RxJava就是基于广义的观察者模式，它创建的被观察者的内部并没有维护一个观察者列表。


### 基础用法 ###

　　既然前面一直在说RxJava是基于观察者模式的，那么我们就以观察者模式为切入点讲解RxJava，首先来回想一下观察者模式的写法：

    第一步，创建被观察者。
    第二步，创建观察者。
    第三步，将二者绑定到一起。

　　在RxJava中也是一样的步骤，稍后我们就来搞一遍。
　　但是要事先说明的是，接下来笔者为了介绍Rx的语法，会写出一些没有实用价值的范例，请各位多包涵。

<br>　　范例1：先来创建被观察者。
``` java
// RxJava中最最常见的三个类在本范例中都出现了，它们分别是：
//     Observable类，表示被观察者，它的create方法用来创建一个对象。
//     Subscriber类，表示观察者。
//     Observable.OnSubscribe类，是一个回调接口，会被存储在返回的Observable对象中。
//          当有新的观察者绑定到Observable上时，Observable就会调用该接口的call方法，并将该观察者传给call方法。
Observable.create(new Observable.OnSubscribe<User>() {
    @Override
    public void call(final Subscriber<? super User> subscriber) {
        System.out.println("检测到新的观察者来访：____________ " + subscriber);
    }
});
```
    语句解释：
    -  User类表示具体的被观察的数据类型，也就是说我们创建了一个被观察者，它提供一个User类型的数据供外界观察。

<br>　　被观察者创建完毕了，然后咱们来创建观察者。
<br>　　范例2：创建观察者。

``` java
// 其实在RxJava中，使用Observer接口来表示观察者，而我们前面说的Subscriber是一个抽象类，它实现了Observer接口。 
// Subscriber对Observer接口进行了一些扩展，但它们的基本使用方式是完全一样的。
Subscriber observer = new Subscriber<User>() {

    // 对于观察者，RxJava其实有几条明确的规定：
    // 第一，Observer需要实现三个抽象方法：onNext、onCompleted、onError。
    // 第二，onNext用来接收Observable发来的数据，onCompleted表示正常终止，onError表示Observable异常终止。
    // 第三，在一个正确运行的事件序列中, onNext可以被多次调用，但onCompleted和onError有且只有一个，并且是得最后一个。
    // 第四，需要注意的是，onCompleted和onError二者也是互斥的，即在队列中调用了其中一个，就不应该再调用另一个。

    @Override
    public void onNext(User s) {
        System.out.println("____________ onNext " + s);
    }

    @Override
    public void onCompleted() {
        System.out.println("____________ onCompleted ");
    }

    @Override
    public void onError(Throwable e) {
        System.out.println("____________ onError ");
    }

};
```
    语句解释：
    -  上面说的那四条规定是一个规定，RxJava的官方API会遵守这个规定，但是如果你自定义Observable的时候非得在call方法里调用多次onCompleted方法，也没人会拦着你。
    -  对于本范例，你只需要知道自定义的Subscriber需要重写三个方法，至于实际开发中需要在里面写什么代码，先别管，爱他妈咋写咋写。

<br>　　上面提到了“`事件`”二字，其实很好理解，我们知道被观察者发生了任何变化，都会通过回调方法通知观察者，比如调用观察者的onNext、onCompleted和onError方法，我们把每次调用都看为：被观察者向观察者发送一个事件。

<br>　　范例3：建立链接。

``` java
observable.subscribe(observer);
```
    语句解释：
    -  使用这行代码就将observer绑定到observable身上了，然后程序会执行Observable.OnSubscribe的call方法。
    -  需要注意的是，这个subscribe()方法会返回一个Subscription对象，这个对象代表了被观察者和观察者之间的连接，你可以在后面使用这个Subscription对象来操作被观察者和观察者之间的连接，比如调用unsubscribe方法解除观察。

<br>　　至此，RxJava整个执行流程我们算是体验完了，但是目前学到的东西没有任何意义。
　　而且上面范例1只是展示了如何创建被观察者，那Observable.OnSubscribe的call方法应该写什么样的代码呢？

<br>　　范例4：再来一个没有意义的范例。
``` java
Observable observable = Observable.create(new Observable.OnSubscribe<User>() {
    @Override
    public void call(final Subscriber<? super User> subscriber) {
        try {
            // 加载数据
            User user = loadUserFromNetwork();
            // 将数据回调给观察者之前，先判断观察者当前是否仍然处于观察状态。
            if (!subscriber.isUnsubscribed()) {
                // 调用观察者的onNext方法将数据传递过去。
                subscriber.onNext(user);
                // 调用onCompleted方法告诉观察者，整个流程已经走完了，以后不再会接到新事件了。
                subscriber.onCompleted();
            }
        } catch (Exception e) {
            if (!subscriber.isUnsubscribed()) {
                // LoadFailureException是我们自定义的异常。
                subscriber.onError(e);
            }
        }
    }
});
```
    语句解释：
    -  通常情况下我们会在call方法中产生数据，并将数据通过call方法的参数传递给观察者。
    -  需要说明的是，之所以需要在call方法里判断Subscriber的连接是否还存在，是因为call方法是可能在子线程中被调用的，因此如果在第6行代码被执行的时候，Subscriber在主线程断开了连接，那么当第6行结束时不判断连接状态的话，就会有问题了。


<br>　　范例5：完整代码。

``` java
Observable observable = Observable.create(new Observable.OnSubscribe<User>() {
    @Override
    public void call(final Subscriber<? super User> subscriber) {
        try {
            User user = loadUserFromNetwork();
            if (!subscriber.isUnsubscribed()) {
                subscriber.onNext(user);
                subscriber.onCompleted();
            }
        } catch (Exception e) {
            if (!subscriber.isUnsubscribed()) {
                subscriber.onError(e);
            }
        }
    }
});
observable.subscribe(new Subscriber<User>() {
    public void onCompleted() {
        System.out.println("____________ onCompleted ");
    }
    public void onError(Throwable e) {
        System.out.println("____________ onError ");
    }
    public void onNext(User s) {
        System.out.println("____________ onNext " + s);
    }
});
```
    语句解释：
    -  此时再一看这段代码，整体的含义就一目了然了。

<br>　　补充一下，其实 Subscriber 和 Observer 的区别对于使用者来说主要有两点：

    -  onStart(): 这是Subscriber增加的方法。它会在subscribe刚开始，而事件还未发送之前被调用，可以用于做一些准备工作，例如数据的清零或重置。这是一个可选方法，默认情况下它的实现为空。
    -  unsubscribe(): 这是Subscriber所实现的另一个接口Subscription的方法，用于取消观察。在这个方法被调用后，Subscriber将不再接收事件。这个方法很重要，因为在subscribe之后， Observable会持有Subscriber的引用，如果不及时释放引用，将有内存泄露的风险。

<br>　　到现在为止，我们并没有看到RxJava的任何实际作用，仅仅是写了一遍观察者模式而已。不要慌，其实观察者模式就是核心，仔细想一下：

    -  被观察者作为事件的产生方，是整个流程的起点。
    -  观察者作为事件的处理方，是整个流程的终点。
    -  在起点和终点之间，我们是可以做手脚的，即事件传递的过程中是可以被加工，过滤，转换，合并等等方式处理的。
    -  而RxJava的强大之处，就是它做手脚的能力，也就是稍后要讲到的操作符，RxJava提供了各种操作符满足你的各种需求。


<br>　　比如说，前面说过RxJava是一个做异步的库，那么现在咱们先来想一下，实际开发中遇到的异步操作，有哪些特点：

    第一，输入的数据和输出的数据格式不一致。比如发送网络请求，输入时接口地址，返回一个是对象。
    第二，线程切换。
    第三，在某些场景下，客户端不会直接展示服务器返回的数据，会和本地的数据进行融合后在显示。
    第四，多个异步同时出发，并等待全部回来后，统一处理。
　　这些需求在RxJava中都有对应的操作符来应对，甚至于你还可以将多个操作符同时混合使用。

### 操作符 ###

<br>　　RxJava的操作符有很多，本文只会挑一些比较常用介绍，其它操作符请各位自行搜索：

![常用操作符一览](/img/android/android_BY_d02_01.png)

　　提示：操作符是从LINQ那里传递过来的术语，在RxJava中操作符其实就是指的一系列的方法。

#### 创建操作 ####

<br>　　在RxJava中，除了使用前面用到的`Observable.create`方法创建被观察者外，还提供了很多其它方便的方法进行创建。

<br>　　范例1：just方法。
``` java
// just方法创建的Observable，当有观察者接入时，会自动为你调用观察者的onNext发送数据。
// just方法可以支持多个参数，假设它有4个参数，那么当有新观察者绑定时，会调用该观察者的onNext方法四次，即每个参数对应一次调用。
Observable observable1 = Observable.just("a");
Observable observable2 = Observable.just("a","b","c");
```
    语句解释：
    -  查看源码可以发现just方法的参数是泛型类型的，也就意味着在RxJava中万事万物都可以被定义为一个Observable。
    -  之前我们是User，现在是String，以后还可以是Student或者是Fucker。


<br>　　范例2：from方法。
``` java
String[] array = new String[]{"1","2","3"};
Observable observable = Observable.from(array);
```
    语句解释：
    -  just方法最多只支持10个参数，如果您的参数数量大于10个就可以使用from方法。
    -  from方法可以从一个Iterable或者数组中获取数据，并创建一个Observable。
    -  其实从源码上可以看到，如果调用的一个参数的just方法，则会创建一个ScalarSynchronousObservable对象，超过一个参数的just方法其实会在内部转调用from方法。


<br>　　范例3：empty、error、never方法。
``` java
Observable observable1 = Observable.empty(); // 直接调用onCompleted
Observable observable2 = Observable.error(new RuntimeException());// 直接调用onError，这里可以自定义异常
Observable observable3 = Observable.never(); // 什么都不做
```
    语句解释：
    -  这三个方法创建的Observable，当有观察者绑定时，会按上面说的那样有各自的行为。
    -  前面说过，在某些场景下创建Observable和Subscriber的操作并不是重点，重点是事件的起点和重点之间所要做的事情，这一点本范例中已经能看出来了，我们有时候根本不需要定义被观察的数据是什么，我们要的仅仅是一个Observable对象而已。
    -  我们最需要其实是各种操作符，我们也会把核心代码写在各种操作符中，具体后面就会看到。

<br>　　范例3介绍了简化版的Observable，其实Subscriber的创建也是可以简化的。

<br>　　范例4：简化Subscriber。
``` java
Observable observable = Observable.just("a", "b");
Action1<String> onNextAction = new Action1<String>() {
    // onNext()
    @Override
    public void call(String s) {
        System.out.println("____________onNext call " + s);
    }
};
Action1<Throwable> onErrorAction = new Action1<Throwable>() {
    @Override
    public void call(Throwable throwable) {
        System.out.println("____________onError  call ");
    }
};
Action0 onCompletedAction = new Action0() {
    @Override
    public void call() {
        System.out.println("____________completed  call ");
    }
};
// 内部会自动创建Subscriber，并使用onNextAction来顶替Subscriber类的onNext()
observable.subscribe(onNextAction);
observable.subscribe(onNextAction, onErrorAction);
observable.subscribe(onNextAction, onErrorAction, onCompletedAction);
```
    语句解释：
    -  在RxJava中提供了Action0 - Action9等接口，它们内部都只有一个无返回值的call方法，它们的区别是参数的个数不同，Action0接口的call方法没有参数，Action1的有1个，其它依次类推。
    -  就像你看到的这样，我们在调用observable的subscribe方法时，其实可以不传递一个Subscriber对象，而只是传递一个Action接口即可。
    -  其实这些方法内部实现就是将我们传递的Action对象封装成一个Subscriber而已。


<br>　　范例5：timer方法。
``` java
final long start = System.currentTimeMillis();
Observable.timer(2, TimeUnit.SECONDS).subscribe(new Action1<Long>() {
    @Override
    public void call(Long aLong) {
        System.out.println(" ____________ onNext call " + (System.currentTimeMillis() - start));
    }
});
```
    语句解释：
    -  timer方法用来创建一个在给定的延时之后发射数据项为0的Observable，注意泛型必须是Long型的。
    -  定时相关的操作符还有interval，请自行测试。


<br>　　范例6：range方法。
``` java
Observable.range(2, 5).subscribe(new Action1<Integer>() {
    @Override
    public void call(Integer integer) {
        System.out.println(" ____________ onNext call " + integer);
    }
});
```
    语句解释：
    -  创建一个可以发送指定范围内数列的Observable，第一个参数是起点，第二参数是个数。


#### 线程控制 ####
<br>　　在不指定线程的情况下， RxJava 遵循的是线程不变的原则，即：在哪个线程调用 subscribe()，就在哪个线程生产事件；在哪个线程生产事件，就在哪个线程消费事件，如果需要切换线程，就需要用到 Scheduler（调度器）。

<br>　　在RxJava中，Scheduler相当于线程控制器，RxJava 通过它来指定每一段代码应该运行在什么样的线程。RxJava已经内置了几个Scheduler，它们已经适合大多数的使用场景：

    Schedulers.immediate(): 直接在当前线程运行，相当于不指定线程，这是默认的Scheduler。
    Schedulers.newThread(): 总是启用新线程，并在新线程执行操作。
    Schedulers.io(): I/O操作（读写文件、读写数据库、网络信息交互等）所使用的Scheduler。它和newThread()差不多，区别在于io()的内部实现是是用一个无数量上限的线程池，可以重用空闲的线程，因此多数情况下io()比newThread()更有效率。
    Schedulers.computation(): 计算所使用的Scheduler。这个计算指的是CPU密集型计算，即不会被I/O等操作限制性能的操作，例如图形的计算。这个Scheduler使用的固定的线程池，大小为CPU核数。不要把I/O操作放在computation()中，否则I/O操作的等待时间会浪费CPU。
　　另外， Android还有一个专用的`AndroidSchedulers.mainThread()`，它指定的操作将在Android主线程运行。


<br>　　范例1：线程切换方法。
``` java
Observable.create(new Observable.OnSubscribe<Integer>() {
    @Override
    public void call(Subscriber<? super Integer> subscriber) {
        System.out.println("call " + Thread.currentThread().getName());
        subscriber.onNext(1024);
    }
}).subscribeOn(Schedulers.io()) // 设置Observable.OnSubscribe被激活时所处的线程。
        .observeOn(AndroidSchedulers.mainThread()) // 指定Subscriber的各个回调方法在主线程中被调用
        .subscribe(new Subscriber<Integer>() {
            @Override
            public void onStart() {
                System.out.println("onStart " + Thread.currentThread().getName());
            }

            @Override
            public void onCompleted() {
                System.out.println("onCompleted " + Thread.currentThread().getName());
            }

            @Override
            public void onError(Throwable e) {
                System.out.println("onError " + Thread.currentThread().getName());
            }

            @Override
            public void onNext(Integer integer) {
                System.out.println("onNext " + Thread.currentThread().getName() + "," + integer);
            }
        });
// 程序运行结果：
// onStart main
// call RxIoScheduler-2
// onNext main,1024
```
    语句解释：
    -  使用subscribeOn()和observeOn()两个方法可以对线程进行控制。
       -  subscribeOn: 指定Observable.OnSubscribe被激活时所处的线程，或者叫做事件产生的线程。
       -  observeOn: 指定Subscriber所运行在的线程，或者叫做事件消费的线程。
    -  从程序运行的结果可以看出来，我们在call方法中调用了onNext，但并没有进行任何切换线程的操作，RxJava帮我们做了。
    -  事实上，这种在subscribe()之前写上两句subscribeOn(Scheduler.io())和observeOn(AndroidSchedulers.mainThread())的使用方式非常常见，它适用于多数的『后台线程取数据，主线程显示』的程序策略。
    -  另外，如果看源码的话，就会发现subscribeOn和observeOn的返回值其实是Observable对象，即对原有的Observable进行了封装。


#### 变换操作 ####

<br>　　我们在写异步的代码时，代码往往都有一个特点：输入数据和输出数据的类型不同。比如在接口请求时，输入数据是一个URL，输出数据则是一个对象（通过返回的json生成的）。
　　同时我们希望在子线程处理好一切后，再将返回值返回到主线程中，这个需求使用map操作符就可以。

<br>　　范例1：map方法 —— 依据学号查询出对应的Student对象。
``` java
// 输入数据一个String类型的，在本范例中这个字符串表示学生的学号。
Observable.just("20090403")
    .subscribeOn(Schedulers.io())  
    // 简单的来说，map方法就是一个转换器，接收String类型的参数，返回Student类型的值。
    .map(new Func1<String, Student>() {
        @Override
        public Student call(String userId) {   
            // 由于前面设置了，所以此处的call方法将在io线程中调用，因此这里可以执行网络请求，或者本地数据库查询。
            // 但是为了代码整洁，此处直接new了一个对象，并将当前线程的名字设置到Student上了。
            return new Student(userId, "张三 " + Thread.currentThread().getName());
        }
    })
    .observeOn(AndroidSchedulers.mainThread()) // 设置观察者的回调方法在主线程中被调用。
    .subscribe(new Action1<Student>() {
        @Override
        public void call(Student student) {
            System.out.println("onNext " + Thread.currentThread().getName() + "," + student.getUserName());
        }
    });
// 程序运行结果：
// onNext main,张三 RxIoScheduler-2
```
    语句解释：
    -  本范例中出现了一个叫做Func1的类，它和Action1非常相似，也是RxJava的一个接口，用于包装含有一个参数的方法。
    -  和ActionX一样，FuncX也有多个，用于不同参数个数的方法，Func1和Action的区别在于，Func里方法有返回值，Action则没有。
    -  简单的说：
       -  如果你只想在子线程中请求数据，那么使用Observable.create方法即可，需要自己调用观察者的onNext方法。
       -  如果你既需要子线程中请求数据，又需要将结果转成特定类型，就可以使用map操作符。
    -  另外，观察源码可以发现，map方法返回值也是一个Observable，即二次封装了。


<br>　　范例2：多次转换。
``` java
Observable.just("20090403")
    .subscribeOn(Schedulers.io()) 
    // 下面这个map会沿用之前的线程，即io线程。
    .map(new Func1<String, Student>() {
        @Override
        public Student call(String userId) {
            return new Student(userId, "张三 " + Thread.currentThread().getName());
        }
    })
    // 设置之后的代码将运行在主线程中
    .observeOn(AndroidSchedulers.mainThread())
    .map(new Func1<Student, String>() {
        @Override
        public String call(Student student) {
            return student.getUserName() + ", 二次转换：" + Thread.currentThread().getName();
        }
    })
    // 再次将后面的代码切换到子线程中
    .observeOn(Schedulers.newThread())
    .subscribe(new Action1<String>() {
        @Override
        public void call(String str) {
            System.out.println("onNext " + Thread.currentThread().getName() + "," + str);
        }
    });
// 程序运行结果：
// onNext RxNewThreadScheduler-1,张三 RxIoScheduler-2, 二次转换：main
```
    语句解释：
    -  observeOn方法可以多次调用，它会对其之后的代码产生影响。
    -  subscribeOn也可以调用多次，可以写在整个调用链的任何位置（但需要在subscribe方法之前），但只有第一次调用的会生效。
    -  map方法也可以多次调用，它会将之前的代码的返回值作为输入数据，进行转换。
    -  从上面可以看出，不论是observeOn、subscribeOn还是map方法，它们都会对原有的Observable对象进行二次封装，因此要使用这种链式调用才能保证代码正确执行。
    -  实际上，整个在subscribe方法调后程序才开始运转，在其之前仅仅是做了一层层的封装，即排在后面的操作符会将前面的操作符包装起来。



#### 其它操作 ####


<br>　　范例1：条件/布尔操作。
``` java
Observable.just(2, 3, 4, 5)
    .all(new Func1<Integer, Boolean>() {
        @Override
        public Boolean call(Integer integer) {
            return integer > 1;
        }
    })
    .subscribe(new Action1<Boolean>() {
        @Override
        public void call(Boolean aBoolean) {
            System.out.println("_____________ " + aBoolean);
        }
    });
```
    语句解释：
    -  all操作符用来判断所有数据项是否都满足某个条件。
    -  相应的还有exits、contains、isEmpty、takeWhile等操作符，请自行搜索。


<br>　　范例2：过滤操作。
``` java
bservable.just(3, 4, 5, 6)
    .filter(new Func1<Integer, Boolean>() {
        @Override
        public Boolean call(Integer integer) {
            return integer > 4;
        }
    })
    .subscribe(new Action1<Integer>() {
        @Override
        public void call(Integer integer) {
            System.out.println(integer);
        }
    }); //5,6
```
    语句解释：
    -  过滤数据，只有满足条件的数据才会执行后续操作。
    -  相应的还有ofType、take、takeFirst、distinct等操作符，请自行搜索。


<br>**本节参考阅读：**
- [RxJava 从入门到放弃再到不离不弃](https://www.daidingkang.cc/2017/05/19/Rxjava/)
- [关于RxJava最友好的文章](https://juejin.im/post/580103f20e3dd90057fc3e6d)


## 第四节 RxJava 2.x ##

　　关于RxJava2.x的介绍网上已经有很多优秀的博文了，笔者就不再重复写一遍了，下面分享几个链接大家看一看就好了，RxJava入门稍微费点劲，但从1.x转到2.x则不难。


<br>**本节参考阅读：**
- [RxJava 1.x 和 RxJava 2.x 的异同](https://www.jianshu.com/p/765591cb2fd8)
- [RxJava1 升级到 RxJava2 所踩过的坑](https://www.jianshu.com/p/6d644ca1678f)
- [这可能是最好的RxJava 2.x 教程（完结版）](https://www.jianshu.com/p/0cd258eecf60)



# 第二章 Retrofit #

 


<br><br>
