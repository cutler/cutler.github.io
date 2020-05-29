---
title: 架构篇 第二章 Jetpack
date: 2020-4-06 17:33:49
author: Cutler
categories: Android - 03 - 高级开发
---

　　在 Google I/O 2018 开发者大会上，谷歌推出了Jetpack组件，<font color='red'>它是一个库的集合</font>，使用这些库可帮助您：

>1、消除样板代码：帮你管理繁琐 Activity（如后台任务、导航和生命周期管理）等
>2、构建高质量的强大应用：围绕现代化设计实践构建而成，具有向后兼容性，可以减少崩溃和内存泄漏

　　遵循最佳做法、让您摆脱编写样板代码的工作并简化复杂任务，以便您将精力放在编写更重要的代码上。

# 第一节 概述

　　从 [Jetpack官网](https://developer.android.google.cn/jetpack?hl=zh-cn) 上可以看出，谷歌将 Jetpack 组件按照功效的不同，划分为四种类型的子组件：

<center>
![视频编码标准发展](/img/android/android_architecture002_01.png)
</center>

　　每个子组件里又包含了若干个具体的库 ：
>基础组件：Android KTX、AppCompat、Auto、多dex处理等。
>架构组件：数据绑定、Lifecycles、LiveData、Paging、ViewModel、Room等。
>行为组件：媒体和播放、权限、通知、分享、下载管理器等。
>界面组件：动画和过度、表情符号、布局、Fragment等。

　　其实从上面列出来的库名就可以看出，Jetpack组件里除了添加新的库外，也将一些老技术放到了其内。

# 第二节 架构组件 

　　本节我们就来介绍一下架构组件里的各个库。

## 什么是软件架构 ##

　　首先我们需要达成一个共识：复杂的软件必须有清晰合理的架构，否则无法长久的开发和维护。

　　虽然都知道软件架构的重要性，<font color='red'>但是我们到底要架构什么？</font>

　　在回答这个问题之前，我们先来思考另一个问题：软件的本质是什么？
>本质就是程序员给用户一堆按钮列表，让用户执行相应的操作，然后将产生的数据持久化。

　　也就是说我们可以将软件开发，拆分成“<font color='red'>绘制用户界面</font>” 和 “<font color='red'>处理与保存用户数据</font>”两大部分，即<font color='red'>“输入/输出”</font>。

　　而我们所谓的架构，其实就是想办法让代码以更合理的方式，完成上面两个任务。

## 三种软件架构方式 ##

### MVC ###

　　在MVC架构模式中，软件被分成如下三个部分：

<center>
![MVC](/img/android/android_jetpack_001.png)
</center>

　　上图中各个部分的作用<font color='red'>“大致为”</font>：
>视图（View）：用户界面；对应着上面提到的“用户输入”。
>模型（Model）：数据处理与持久化；对应着上面提到的“用户输出”。
>控制器（Controller）：业务逻辑和业务转发

　　为什么要说<font color='red'>“大致为”</font>呢？

　　因为虽然 MVC 已经拥有将近 50 年的历史了，且也是一个应用很广泛的架构模式了，<font color='red'>但 MVC 并没有一个明确的定义</font>，网上流传的 MVC 架构图也是形态各异，各有各的道理。

　　感兴趣的朋友可以去看看这篇[《浅谈 MVC、MVP 和 MVVM 架构模式》](https://draveness.me/mvx)文章。

　　总而言之，在这些年中 MVC 产生了很多的变种，不同的平台对 MVC 的使用也各有特色。笔者不打算也没有能力给出 MVC 的明确定义，只能在这里简单的分享一下自己的理解，如果和您的理解不同，请多包涵。

<br>** 以下是个人理解 **

　　[ 阮一峰 ](https://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)在自己的博客中画了一张图，图中列出了 MVC 各部分之间的通信方式。

<center>
![MVC](/img/android/android_jetpack_002.png)
</center>

>1、用户通过View来与软件交互
>2、View 被操作后，会传送指令到 Controller
>3、Controller 接到请求后，会依据情况，来将请求转发给对应的 Model 进行处理
>4、Model 处理完毕后，将新的数据发送到 View，用户得到反馈

　　需要注意的是，在上图中<font color='red'>所有通信都是单向的</font>，峰哥的这张图与笔者对 MVC 理解比较相近，但不够详细。

<br>　　笔者以 Android 为例，具体的介绍一下三个模块的职责：

>View：负责绘制用户界面。它包括Activity、Fragment、Dialog、各类Adapter和自定义控件。
> 
>Model：负责处理与持久化数据。它提供一些数据处理的方法给外界使用（包括但不限于：联网请求数据、数据库CRUD等等），Model 一直是被动的响应请求，它感知不到 View 和 Controller 的存在。
> 
>Controller：负责处理业务逻辑和业务转发。它依据 View 传递过来的请求，调用一个或者多个 Model 响应。

<br>　　此时你可能会有一个问题： 既然 Model 无法感知到 View ，那当它处理完数据后，如何通知 View 更新呢？

>通过观察者模式，我们可以实现 Model 和 View 之间的通讯和解耦。
>对应到 MVC 中，Model 是被观察的对象，View 是观察者，Model 层一旦发生变化，View 层即被通知更新。


<br>　　只靠嘴说可能有点难以理解，请看下面的类图：

<center>
![MVC](/img/android/android_jetpack_003.png)
</center>

图释：
>1、图中有两个 Activity 类，它们各自拥有自己的 Controller 类。
>2、图中只有一个 Model 类（UserInfoManager），但是它却可以服务于多个 Activity 类，相应的一个 Activity 如果足够复杂的话，是可以使用多个 Model 类所管理的数据的。
>3、在 Activity 被创建后，除了会调用 Controller 的init方法获取初始化数据外，还需要调用 Model 类提供的 regster 将自己注册成为观察者，以便接收数据的改变回调。
>4、如果你想为“网络请求”和“数据存储”提供多种实现方式（比如数据存储不一定要用数据库），改动范围就只涉及到 Model 类了。

<br>　　有一个建议：在 MVC 程序中，<font color='red'>View 的设计要‘傻’，Controller 要‘轻’，Model 要‘重’</font>。

>View 里面不要写复杂的逻辑，这样就不好维护，一般只是数据的展示，UI 和 交互。
>Controller 就调用 Model 里面的方法，做一些的逻辑转发的事情。
>Model 里写各种业务逻辑的方法，数据的CRUD。

<br>　　另外，笔者在面试的时候通常会问候选人“MVP是为了解决什么问题而诞生的？”，得到的答案一般都是：
>我们以前是用 MVC 模式的，但是会导致 Activity 的代码特别多，不利于维护，所以我们就用了 MVP 模式，代码结构就清晰好多，虽然会产生大量的接口。

　　其实不是 MVC 导致 Activity 代码臃肿，而是他们根本没理解 MVC 应该怎么写。
>他们把 Activity 视为 Controller ，自然会把 Controller 的代码写到 Activity 中，甚至于如果心情不好偷懒的话，Activity 还会承担部分 Model 的工作，自然会越写越臃肿。

　　退一步说，Activity 最多只能算是 View 层内部的 Controller ，负责控制界面里的所有 View 的。

<br>　　最后，你可能还会有一个问题，按照前面说的，软件的本质就是输入和输出，而 View 表示输入， Model 表示输出，既然 Controller 只是用来转发，那么直接让 View 和 Model 交互就好了，为什么还要有 Controller 呢？

　　如果让 View 和 Model 直接通讯的话，缺点显而易见：
>1、Controller 原来的工作势必由 View 来承担，导致 View 代码臃肿。
>2、Model 和 View 的代码势必穿插在各个类里，任何一方的改变，通常都会伴随着大量的代码修改。

　　记住一个经验：
>如果两个人需要通信，那么最好不要让他们直接通讯，而应该加入一个中间层，用来转发通信。
>这么做就大大提高了灵活度，当 V 发生变化时不会影响CM，当 M 发生变化时，只稍微修改一下 C 就可以了，而 C 的代码量并不多，大头都在 V 和 M 上了。

<br>**本节参考阅读：**
- [百度百科 - MVC](https://baike.baidu.com/item/MVC%E6%A1%86%E6%9E%B6?fromtitle=mvc&fromid=85990)
- [阮一峰 - MVC、MVP、MVVM](https://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)
- [知乎 - 深入理解MVC](https://zhuanlan.zhihu.com/p/35680070)
- [知乎 - 吴峥的回答](https://www.zhihu.com/question/289024198)
- [《浅谈 MVC、MVP 和 MVVM 架构模式》](https://draveness.me/mvx)

### MVP ###

　　MVP 架构模式是 MVC 的一个变种，它们之间的区别其实并不明显，笔者认为两者之间最大的区别就是 MVP 中使用 Presenter 对视图和模型进行了解耦，它们彼此都对对方一无所知，沟通都通过 Presenter 进行。

<center>
![MVP](/img/android/android_jetpack_004.jpg)
</center>

　　MVP 架构模式的交互流程为：

>1、用户通过View来与软件交互
>2、View 被操作后，会传送指令到 Presenter
>3、Presenter 接到请求后，会依据情况，来将请求转发给对应的 Model 进行处理
>4、Model 处理完毕后，通知 Presenter ， Presenter 再将新的数据发送到 View ，用户得到反馈

　　虽然看起来变化不大，但是代码的写法上却有明显的区别，我们同样来看一个例子：

<center>
![MVP](/img/android/android_jetpack_005.png)
</center>

>1、HomeActivity 和 UserInfoManager 依然表示 View 和 Model ，但 HomeController 却被替换为三个类。
>2、与 MVC 的流程类似： View -> Presenter -> Model ，而 IDataCallback是一个接口，当 Presenter 调用 Model 执行具体业务时，会传递此对象给Model，当做回调对象。
>3、IHomeView也是一个接口，当 Presenter 接到 Model 的回调后，会调用此接口的方法去操作 View ，因此让 HomeActivity 去实现此接口。

　　也就是说， MVP 相比于 MVC 产生了如下变化：

>1、彻底断开了 View 和 Model 之间的观察者连接，让 Presenter 和 Model 通过回调接口的方式建立连接。
>2、在 Presenter 中同时持有 View 和 Model 的引用。


　　另外， Google 早已经提供了一个官方的 MVP Demo ：[TODO - MVP](https://github.com/android/architecture-samples/tree/todo-mvp)，有兴趣的同学可以去看看。


<br>　　最后以笔者目前有限的眼界总结一下： MVP 模式引入的大量的类与接口，却带不来明显的好处。

<br>**本节参考阅读：**
- [《浅谈 MVC、MVP 和 MVVM 架构模式》](https://draveness.me/mvx)
- [《从谷歌官方 TODO-MVP 看 MVP 模式》](http://lastwarmth.win/2016/06/27/mvp/)

### MVVM

　　MVVM 是 Model - View - ViewModel 的简写。
　　MVVM 其实是 MVP 的改进版，它将 MVP 中的 Presenter 替换成了 ViewModel 。

<center>
![MVP](/img/android/android_jetpack_006.jpg)
</center>

　　MVVM 架构模式的交互流程为：

>1、首先在 View 和 ViewModel 之间使用“数据绑定”技术，让二者建立双向绑定，一旦某一方被修改，“数据绑定”就会立刻通知另一方
>2、当 View 被用户操作后，会传送指令到 ViewModel
>3、ViewModel 接到请求后，会依据情况，来将请求转发给对应的 Model 进行处理
>4、Model 处理完毕后，通知 ViewModel 更新数据，此时由于“数据绑定”的存在，View 也会立刻更新

　　也就是说， MVVM 相比于 MVP 的改动有：

>1、将 Presenter 替换成了 ViewModel 。
>2、在 View 和 ViewModel 之间，添加了一个“数据绑定”技术，这个技术就消除了 MVP 模式中 View 和 Presenter 之间的接口。


## Android 中的 MVVM

　　事实上， MVVM 是目前 Google 官方比较推崇的架构模式，Jetpack 里提供的 DataBinding 、 ViewModel 等库都非常适用于实现 MVVM ，本节会着重介绍这些库的用法。

　　首先来看一下下面这张图，该图显示了基于 MVVM 架构的项目应该是什么样的：

<center>
![](/img/android/android_architecture002_02.png)
</center>

　　请注意，<font color='red'>每个组件仅依赖于其下一级的组件</font>。例如，Activity 和 Fragment 仅依赖于视图模型， Repository 是唯一依赖于其他多个类的类。

　　小提示：
> 上面的架构图不可能适合所有项目，但这个架构是我们学习 MVVM 的一个不错的起点。



### ViewModel

　　在正式介绍 ViewModel 的作用之前，我们先来看一下三个问题。

　　** 问题1：数据存储 **

　　我们知道 Android 框架可以管理界面控制器（如 Activity 和 Fragment）的生命周期，同时它也会依据用户的操作来决定销毁或重新创建界面控制器。

　　如果系统销毁或重新创建界面控制器，则存储在其中的任何临时性界面相关数据都会丢失。对于简单的数据，Activity 可以使用 onSaveInstanceState() 方法从 onCreate() 中的捆绑包恢复其数据，但此方法仅适合可以序列化再反序列化的少量数据，而不适合数量可能较大的数据。

　　** 问题2：异步请求 **

　　界面控制器经常需要进行异步调用，因此需要确保在控制器销毁后及时清理这些调用，以避免潜在的内存泄露。此项管理需要大量的维护工作，并且若用户切换了一下屏幕，默认会导致 Activity 重建，如果此时触发清理操作，会造成资源的浪费，因为对象需要重新发起异步调用。

　　** 问题3：数据共享 **

　　如果一个 Activity 里存在多个 Fragment ，那么多个 Fragment 之间就可能需要进行数据通信，为了实现这个需求，同样需要写不少代码。

　　不论你之前是用 MVC 还是 MVP ，你都需要直面这三个问题，虽然解决它们并不难，但在 Jetpack 中已经帮我们处理好了，它就是 ViewModel 库。


<br>　　范例1：创建一个 ViewModel 类。
``` java
// 创建一个类继承 androidx.lifecycle.ViewModel 即可。
public class UserViewModel extends ViewModel {
    private User user;

    public UserViewModel() {
        // 姓名和年龄
        user = new User("Hello", 20);
    }

    public User getUser() {
        return user;
    }

    // 当 ViewModel 需要被销毁的时候会回调此方法。
    @Override
    protected void onCleared() {
    }
}
```

<br>　　范例2：实例化 ViewModel 类。
``` java
// 下面的 this 可以是 FragmentActivity 或 Fragment 的子类。
UserViewModel model = new ViewModelProvider(this).get(UserViewModel.class);
```
    语句解释：
    -  需要注意的是不同版本的 ViewModel 库实例化的方法不一样，本范例是基于 viewmodel-2.2.0 版本的。 

<br>　　下图展示了 ViewModel 与 Activity 之间的生命周期对应关系。

<center>
![](/img/android/android_architecture002_03.png)
</center>

　　也就是说 Activity 因为配置改变（比如屏幕旋转）而导致的销毁重建并不会让 ViewModel 销毁。另外，如果你想在多个 Fragment 中共享数据的话，可以在 Fragment 中这么写代码：

``` java
UserViewModel model = new ViewModelProvider(getActivity()).get(UserViewModel.class);
```

<br>　　最后总结一下：
>1、ViewModel 主要的任务就是建立 View 和 Model 之间的链接，它内部通常会保存着从 Model 层获取到的 JavaBean 对象，以供 View 层使用。
>2、ViewModel 已经帮我们监听了 Activity 和 Fragment 的生命周期，防止不必要的资源浪费和内存泄漏。
>3、ViewModel 可以实现多个 Fragment 之间的数据共享。

　　如果你想知道 ViewModel 的更多信息，请阅读 [《ViewModel 概览》](https://developer.android.google.cn/topic/libraries/architecture/viewmodel?hl=zh-cn) 。

### Lifecycle

　　Lifecycle 直译过来的意思是“生命周期”，通常我们用它来监听“界面控制器”的生命周期。

　　此时你可能会有一个疑问， Activity 和 Fragment 本身已经提供了生命周期方法，直接在对应的方法里写代码就好了，为什么还要搞一个 Lifecycle 呢？

　　其实前面笔者一直在强调 “要简化Activity中的代码” ， “View层要傻” ，如果在生命周期方法里写了太多代码，会导致 Activity 越来越臃肿。

　　假设我们有一个 Activity 需要实时显示用户手机的方向和地理位置，你可能会这么写代码：
``` java
public class MainActivity extends AppCompatActivity implements SensorEventListener, LocationListener {

    private SensorManager mSensorManager;
    private LocationManager mLocationManager;

    @Override
    protected void onResume() {
        super.onResume();
        // 方向传感器
        mSensorManager.registerListener(this,
                mSensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION),
                SensorManager.SENSOR_DELAY_GAME);
        mSensorManager.registerListener(this, mSensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE),
                SensorManager.SENSOR_DELAY_NORMAL);
        // 获取位置信息。注意执行此代码需要权限，为了方便阅读，本范例就省略了。
        mLocationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 0, this);
    }

    // 此处省略 SensorEventListener 和 LocationListener 接口里的若干方法

    @Override
    protected void onPause() {
        super.onPause();
        mSensorManager.unregisterListener(this);
        mSensorManager.unregisterListener(this);
        mLocationManager.removeUpdates(this);
    }
}
```
　　稍微优化一点的话，代码可能是这样的：
``` java
public class MainActivity extends AppCompatActivity {

    // 将它们定义成单独的类
    private MySensorManager mSensorManager = new MySensorManager();
    private MyLocationManager mLocationManager = new MyLocationManager();

    @Override
    protected void onResume() {
        super.onResume();
        mSensorManager.onResume();
        mLocationManager.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mSensorManager.onPause();
        mLocationManager.onPause();
    }
}
```
　　这样一来 Activity 的代码是少多了，但是也变蠢了，此时如果用 Lifecycle 代码就能优雅很多。

　　其实 Lifecycle 不是什么高深技术，本质上是“<font color='red'> 观察者模式 + 生命周期管理 </font>”：
>1、在 Fragment 、 Activity 内部维护了一个“被观察者”，调用 getLifecycle() 方法获取“被观察者”的引用。
>2、定义了一个 LifecycleObserver 接口，它是个空接口，需要我们去实现。
>3、在实现类的方法中加上对应的注解。

　　具体使用的代码如下：
``` java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 通过 getLifecycle() 方法获取被观察者对象，然后将观察者注册进去。
        getLifecycle().addObserver(new MySensorManager());
        getLifecycle().addObserver(new MyLocationManager());
    }
}

// 每一个观察者都必须实现 LifecycleObserver 接口，它是一个空接口
class MySensorManager implements LifecycleObserver , SensorEventListener {

    // 当被观察者切换到 ON_RESUME 状态时，就会调用下面的 onResume 方法
    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void onResume() {
        System.out.println("_______ onResume = " + this);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    public void onPause() {
        System.out.println("_______ onPause = " + this);
    }
}

class MyLocationManager implements LifecycleObserver , LocationListener {

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void onResume() {
        System.out.println("_______ onResume = " + this);
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    public void onPause() {
        System.out.println("_______ onPause = " + this);
    }
}
```

　　简单的说，如果你需要监听组件的生命周期方法，且需要在生命周期方法里编写大量的代码，那么就可以考虑将代码从组件中抽离，并配合 Lifecycle 来实现。

　　另外，可以通过下面的代码来获取“被观察者”当前的状态：
``` java
lifecycle.getCurrentState().isAtLeast(Lifecycle.State.STARTED);
```

　　下图包含了构成 Activity 生命周期的状态和事件：

<center>
![](/img/android/android_architecture002_04.svg)
</center>

　　当然，你也可以自定义自己的“被观察者”，如果你想知道 Lifecycle 的更多用法，请阅读 [《使用生命周期感知型组件处理生命周期》](https://developer.android.google.cn/topic/libraries/architecture/lifecycle?hl=zh-cn#java) 。

　　小提示：
>如果你想知道 Activity 是在何时回调 LifecycleObserver 接口里的方法的，请看 ReportFragment 类源码。

### LiveData

　　在正式介绍 LiveData 的作用之前，我们先来看一个问题：

>通过前面的介绍，我们知道 ViewModel 的生命比 Activity 和 Fragment要长，所以我们不应该在 ViewModel 中持有它们的引用。
>但是通常 Activity 显示的数据都是从网络上获取的，这就存在一个异步的情况。
>那么如果 ViewModel 不持有它们引用的话，当异步回来时， ViewModel 应该怎么更新界面？

　　答案很明显，就是“观察者模式”：ViewModel 持有的数据是“被观察者”，Activity 是“观察者”。
　　但是不能使用<font color='red'>“传统的观察者模式”</font>，<font color='red'>“传统的观察者模式”</font>只是屏蔽了具体类型，其依然存在强引用，依然会有内存泄漏的风险。

　　LiveData 是 Jetpack 为我们提供的<font color='red'>“特殊的观察者模式”</font>，它在“传统的观察者模式”基础上，提供了监听 Activity 生命周期的能力，当 Activity 被销毁(处于 DESTROYED 状态)时，会自动帮助我们断开链接。

<br>　　范例1：使用 LiveData 。
``` java
public class UserViewModel extends ViewModel {
    // LiveData 是一个抽象类，通常我们会使用 MutableLiveData 类。
    private MutableLiveData<User> user;

    public UserViewModel() {
        user = new MutableLiveData<>();
        // 模拟异步请求
        new Thread() {
            @Override
            public void run() {
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                // 由于当前是子线程中，所以使用 postValue 方法来更新，主线程的话可以使用 setValue 方法
                user.postValue(new User("Cutler", 20));
            }
        }.start();
    }

    public LiveData<User> getUser() {
        return user;
    }
}

public class MainActivity extends AppCompatActivity {

    private UserViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        viewModel = new ViewModelProvider(this).get(UserViewModel.class);
        final TextView textView = findViewById(R.id.textView);
        // 调用 observe 方法注册监听
        viewModel.getUser().observe(this, new Observer<User>() {
            @Override
            public void onChanged(User user) {
                textView.setText(user.getName());
            }
        });
    }
}
```
    语句解释：
    -  程序执行第 39 行代码后，MutableLiveData 就会监听当前 Activity 的生命周期，当 Activity 被切换到 Lifecycle.State.DESTROYED 状态时就会断开链接。

　　除此之外，LiveData 还有如下三个特点：

>1、如果观察者的生命周期处于 STARTED 或 RESUMED 状态，则 LiveData 会认为该观察者处于活跃状态，LiveData 只会将更新通知给活跃的观察者。
>2、观察者从非活跃状态更改为活跃状态时也会收到更新。
>3、如果观察者第二次从非活跃状态更改为活跃状态，则只有在自上次变为活跃状态以来值发生了更改时，它才会收到更新。

　　如果你想知道 LiveData 的更多用法，请阅读 [《LiveData 概览》](https://developer.android.google.cn/topic/libraries/architecture/livedata?hl=zh-cn) 。

<br>

---

<br>　　通过前面的介绍，我们已经可以搭建出 View 层 和 ViewModel 层的代码了，但是它们本身不负责生产数据，数据是由 Model 层生产的，因此本文后面的内容就来介绍一下如何设计 Model 层的代码。

　　在大多数情况下， Model 的职责有如下三个：

>1、从服务器请求数据
>2、读写缓存数据（内存、磁盘）
>3、把从本地或者网络上拿到的数据返回给前端代码之前，对数据进行预处理。

　　为了实现这三个职责，我们会用到 OkHttp、Retrofit、RxJava、Room 四个开源库。

　　因此在继续向下之前，笔者打算先简单的介绍一下这四个类库，如果您已经会用了则可以跳过。

<br>

---

<br>

### OkHttp

<br>　　本节将通过提问的方式来介绍 OkHttp 库的相关基础知识。

<br>　　**1、为什么要用 OkHttp ？**

　　在 Okhttp 库没出现之前，我们使用 HttpURLConnection 或者 HttpClient 进行网络请求，它们的特点是：

    -  HttpURLConnection 是轻量级的 HTTP 客户端，提供的API比较简单，如果你想执行文件的上传、下载等高级操作，需要自己去实现。
    -  HttpClient 的功能十分强大，可以方便的进行一些复杂的操作，但是它最初并不是为移动端设计的，且由于庞大的 API 数量使得 Google 很难在不破坏兼容性的情况下对它进行升级和扩展。

　　上面两个类库和 OkHttp 比起来就弱爆了，因为 OkHttp 不仅具有高效的请求效率，并且提供了很多开箱即用的网络疑难杂症解决方案：

    -  支持HTTP/2，HTTP/2通过使用多路复用技术在一个单独的 TCP 连接上支持并发，通过在一个连接上一次性发送多个请求来发送或接收数据 
    -  如果HTTP/2不可用，连接池复用技术也可以极大减少延时 
    -  支持 GZIP，可以压缩下载体积，支持文件的上传和下载
    -  响应缓存可以直接避免重复请求 
    -  会从很多常用的连接问题中自动恢复 
    -  如果您的服务器配置了多个IP地址，当第一个 IP 连接失败的时候，OkHttp 会自动尝试下一个 IP
    -  OkHttp 还处理了代理服务器问题和SSL握手失败问题

　　简单的说，你能遇到的和网络请求相关的问题，几乎在 OkHttp 中都能得到解决。

<br>　　**2、如何使用 OkHttp ？**

　　下面笔者将通过几个简单的范例来介绍一下 OkHttp 的用法。

<br>　　范例1：执行 Get 请求。
``` java
private void doRequest() {
    // 首先创建一个 OkHttpClient 用来执行网络请求
    OkHttpClient client = new OkHttpClient();
    // 封装一个请求对象
    Request request = new Request.Builder().url("http://www.baidu.com").build();
    try {
        // 在当前线程发起网络请求，然后返回请求结果
        Response response = client.newCall(request).execute();
        // 通过 response 对象可以获取响应码、响应头、相应内容等数据
        System.out.println("___________ response " + response.code() + "," + response.body().string());
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
    语句解释：
    -  通常我们只需要全局创建一个 OkHttpClient 对象即可，不需要每次请求的时候都创建一个。
    -  请在子线程中执行上面的代码，因为从 Android 3.0 开始在主线程执行网络请求将会得到 NetworkOnMainThreadException 异常。

<br>　　范例2：异步执行 Get 请求。
``` java
private void doRequest() {
    OkHttpClient client = new OkHttpClient();
    Request request = new Request.Builder().url("http://www.baidu.com").build();
    // 通过 enqueue 方法执行异步请求
    client.newCall(request).enqueue(new Callback() {
        @Override
        public void onFailure(@NotNull Call call, @NotNull IOException e) {

        }

        @Override
        public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
            System.out.println("___________ response " + response.code() + "," + response.body().string());
        }
    });
}
```
    语句解释：
    -  当请求成功后会在子线程中回调 onResponse 方法。


<br>　　**3、其它知识在哪学？**

　　由于篇幅有限且 OkHttp 涉及到的知识比较多，笔者就不再继续了，如果你想知道 OkHttp 的更多用法，请参阅下面的链接：

[《官方网站》](https://square.github.io/okhttp/) 、[《OkHttp使用完全教程》](https://cloud.tencent.com/developer/article/1174298) 、[《Github - OkHttp》](https://github.com/square/okhttp)  、[《Android OkHttp源码解析入门教程》](https://juejin.im/post/5c46822c6fb9a049ea394510) 


### RxJava

<br>　　本节将通过提问的方式来介绍 RxJava 库的相关基础知识。

<br>　　**1、 RxJava 到底是什么?**

　　一个词：**异步**。它在 GitHub 主页上的自我介绍是：

    RxJava – Reactive Extensions for the JVM – a library for composing asynchronous and event-based programs using observable sequences for the Java VM.

    翻译：一个在 Java VM 上使用可观测的序列来组成异步的、基于事件的程序的库。

　　概括得非常精准，然而对于初学者来说，这太难看懂了，因为它是一个『总结』。
　　简单的说， RxJava 就是一个实现异步操作的库。

<br>　　此时你可能会有一个问题：异步无非就是开个线程干点事，然后在切换回主线程，或者给控件设置的监听器也可以算是异步操作，但这有什么难的，这点破事还用单独写一个开源库？

　　其实 RxJava 这个库有两个最明显的特点，它可以让你在执行异步请求时：
>1、方便的进行线程切换。
>2、方便的执行复杂的、多层次的异步操作。

　　也就是说，有的人用 RxJava 是看中了它第一个特点，有的人则是看中了第二个。

    当项目的业务逻辑足够复杂的时候，可能会需要同时发起多个异步操作、甚至存在嵌套的异步操作，考虑到异步操作在时间上地不确定性，此时再自己处理异步的话，先不说需要自己处理线程切换、 AsyncTask 的版本兼容性等问题，光是随之而来的复杂性就不容忽视了，比如若需求是等所有异步都返回的时候，再对结果统一处理，程序员就需要提供一些额外的逻辑来判断异步操作何时结束以及后续的操作何时开始。


<br>　　**2、为什么还听说过 RxSwitf ？**

　　RxJava 其实是 ReactiveX 的一个具体实现， ReactiveX 是 Reactive Extensions 的缩写，一般简写为 Rx 。

    Rx由微软的架构师Erik Meijer领导的团队开发一个项目，它主要是用来帮助开发者更方便的处理异步，事实上Rx只定义了一套编程接口。
    既然定义接口，那它就得有具体的实现，事实也确实如此，它在很多语言平台上都有自己的实现。
    截止至2020年3月份，从Rx官网上可以看到，Rx库支持.NET、js、java、swift、c++等18种语言，Rx的大部分语言由ReactiveX这个组织维护。

　　我们上面说的 RxJava 就是 ReactiveX 在 JVM 上的一个实现，帮助我们更方便的处理复杂异步。


<br>　　**3、 RxAndroid又是什么 ？**

　　ReactiveX 这个组织针对 Android 平台还提供了一个适配库，名为[ RxAndroid ](https://github.com/ReactiveX/RxAndroid)，这个库是在 RxJava 基础上编写的，它的源码一共也没多少，就是针对Android平台上线程切换等事情做了些适配。

　　另外，由于在 RxAndroid 的内部就引用的 RxJava 库，所以我们只需要在项目里引用 RxAndroid 库就可以了。

<br>**基础用法**
<br>　　本质上来说 RxJava 是基于观察者模式的，在继续往下学习之前，关于这个模式的定义咱们需要先达成共识：

>第一，常见的观察者模式里，被观察者内部持有一个观察者者列表，当数据变化时，被观察者会遍历列表，依次通知每一个观察者。
>第二，在更广义的观察者模式中，被观察者的内部可以不持有一个观察者列表，而只持有一个观察者的引用，比如我们经常调用 setOnClickListener 方法给 Button 设置回调函数，这个操作也可以理解为观察者模式。

　　事实上 RxJava 就是基于广义的观察者模式，它创建的被观察者的内部并没有维护一个观察者列表。

<br>　　范例1：HelloWorld。
``` java
// Observable 类表示被观察者，它的 create 方法用来创建一个被观察者对象。
// ObservableOnSubscribe 是一个回调接口，当有新的观察者绑定到 Observable 上时，就会回调它的 subscribe 方法。
Observable<String> observable = Observable.create(new ObservableOnSubscribe<String>() {
    @Override
    // 我们通常在此方法中执行异步任务。
    // ObservableEmitter 类被称为发射器，在执行异步任务时，我们可以通过它来通知观察者当前任务的执行状态。
    // 比如：进度更新、发生错误、顺利完成等。
    public void subscribe(ObservableEmitter<String> emitter) throws Exception {
        System.out.println("__________________ 有新观察者链接进来了 " + this);
    }
});
//  Observer 接口用来表示观察者。 
Observer<String> observer = new Observer<String>() {

    @Override
    // 当观察者与被观察者建立完毕链接时调用此方法，先调用此方法再调用 subscribe 方法。
    public void onSubscribe(Disposable d) {
        System.out.println("__________________ 订阅成功 " + this);
    }

    @Override
    // 当被观察者通过 ObservableEmitter 发送 onNext 事件时，回调此方法。
    public void onNext(String s) {
        // 这里接收被观察者发出的事件
        System.out.println("__________________ 接到新事件 " + this + "," + s);
    }

    @Override
    // 当被观察者通过 ObservableEmitter 发送 onError 事件时，回调此方法。
    public void onError(Throwable e) {
        System.out.println("__________________ onError " + this);
    }

    @Override
    // 当被观察者通过 ObservableEmitter 发送 onComplete 事件时，回调此方法。
    public void onComplete() {
        System.out.println("__________________ onComplete " + this);
    }
};
// 让观察者和被观察者建立链接
observable.subscribe(observer);
```
    语句解释：
    -  Observable 表示被观察者， Observer 表示观察者。
    -  我们在 ObservableOnSubscribe 的 subscribe 方法里执行异步操作，并通过 ObservableEmitter 类来与观察者进行沟通。

<br>**线程控制**

　　在不指定线程的情况下， RxJava 遵循的是线程不变的原则，即：在哪个线程调用 subscribe()，就在哪个线程生产事件；在哪个线程生产事件，就在哪个线程消费事件，如果需要切换线程，就需要用到 Scheduler（调度器）。

　　RxJava 已经内置了几个 Scheduler ，它们已经适合大多数的使用场景：

| 代码 | 含义 | 使用场景 | 
| -------- | -------- | -------- |
| Schedulers.io()  | IO操作线程 | 读写SD卡文件、查询数据库、访问网络等IO密集型等操作 | 
| Schedulers.computation()  | CPU计算操作线程 | 图片压缩取样、xml、json解析等CPU密集型计算 | 
| Schedulers.newThread()  | 创建新线程 | 总是启用新线程，并在新线程执行操作 |
| AndroidSchedulers.mainThread()  | Android主线程 | 更新UI | 

<br>　　范例1：线程切换方法。
``` java
// 设置被观察者所在的线程，即 ObservableOnSubscribe 的 subscribe 方法应该在哪个线程被调用。
// 如果多次调用此方法，只有第一次有效。
.subscribeOn(Schedulers.io())
// 设置此行代码之后设置的回调，应该在哪个线程中被调用。
// 此方法可以多次调用，调用后就会对后续接收回调的函数生效，具体请看范例2。
.observeOn(AndroidSchedulers.mainThread())
```
    语句解释：
    -  需要注意的是，Observer 的 onSubscribe 方法不会受 observeOn 的控制。
    -  通过测试发现，你在哪个线程注册观察者， onSubscribe 方法就会在哪个线程被调用。


<br>　　范例2：线程切换与监听事件。
``` java
// 创建一个被观察者
Observable.create(new ObservableOnSubscribe<String>() {
    @Override
    public void subscribe(ObservableEmitter<String> emitter) throws Exception {
        // 当前方法会在子线程中被调用
        String result = getDataFromNetwork();
        // 通过 emitter 对象去调用观察者的 onNext 方法
        emitter.onNext(result);
    }
})
// 设置被观察者在子线程中执行异步操作
.subscribeOn(Schedulers.io())
// 设置此行代码之后的回调函数在 IO 子线程中执行
.observeOn(Schedulers.io())
// 监听 onNext 事件，在调用 onNext 方法之前会调用 doOnNext 设置的回调
.doOnNext(new Consumer<String>() {
    @Override
    public void accept(String s) throws Exception {
        // 在 IO 子线程中调用
        System.out.println("__________________ accept 1 " + Thread.currentThread().getName());
    }
})
// 设置此行代码之后的回调函数在 computation 子线程中执行
.observeOn(Schedulers.computation())
// 再次设置监听
.doOnNext(new Consumer<String>() {
    @Override
    public void accept(String s) throws Exception {
        // 在 computation 子线程中执行
        System.out.println("__________________ accept 2 " + Thread.currentThread().getName());
    }
})
// 设置此行代码之后的回调函数在主线程中执行
.observeOn(AndroidSchedulers.mainThread())
.subscribe(new MyObserver<String>() {
    @Override
    public void onNext(String s) {
        // 在主线程中执行
        System.out.println("__________________ 1 onNext " + Thread.currentThread().getName());
    }
});

// 程序最终输出：
// __________________ accept 1 RxCachedThreadScheduler-2
// __________________ accept 2 RxComputationThreadPool-1
// __________________ 1 onNext main

```
    语句解释：
    -  为了让代码简洁我定义了一个 MyObserver 类，它仅仅是继承了 Observer ，其它什么都没做。
    -  设置 doOnNext 监听，通常是为了对被观察者返回的数据进行二次处理，然后将处理过的数据返回给观察者。
    -  除了 doOnNext 外，还可以使用 doOnComplete 、 doOnError 等方法。

<br>**本节参考阅读：**
- [抛物线 - 给 Android 开发者的 RxJava 详解](https://gank.io/post/560e15be2dca930e00da1083)
- [Rx概述（RxJava2）](https://www.jianshu.com/p/f0fd9d8803a3)
- [极客学院 - ReactiveX](http://wiki.jikexueyuan.com/project/rx-docs/Intro.html)
- [reactivex.io](http://reactivex.io/#)
- [LINQ教程一：LINQ简介](https://www.cnblogs.com/dotnet261010/p/8278793.html)
- [所以什么是LINQ](https://ithelp.ithome.com.tw/articles/10194251)
- [RxJava 1.x 和 RxJava 2.x 的异同](https://www.jianshu.com/p/765591cb2fd8)
- [RxJava 1.x 和 RxJava 2.x 的异同](https://www.jianshu.com/p/765591cb2fd8)
- [RxJava1 升级到 RxJava2 所踩过的坑](https://www.jianshu.com/p/6d644ca1678f)
- [这可能是最好的RxJava 2.x 教程（完结版）](https://www.jianshu.com/p/0cd258eecf60)
- [RxJava 从入门到放弃再到不离不弃](https://www.daidingkang.cc/2017/05/19/Rxjava/)
- [关于RxJava最友好的文章](https://juejin.im/post/580103f20e3dd90057fc3e6d)
- [RxJava2入门教程一](https://blog.csdn.net/u012527802/article/details/81117684)
- [Rxjava2入门教程五：Flowable背压支持——对Flowable最全面而详细的讲解](https://blog.csdn.net/chmodzora/article/details/81713269)


### Retrofit

　　在 Android 平台中，Retrofit 是当下最热的一个网络请求库。

　　更准确的说，Retrofit 是对 OkHttp 的二次封装，网络请求的工作本质上仍然是 OkHttp 完成。如下图所示：

<center>
![](/img/android/android_architecture002_04.jpg)
</center>

<br>　　**1、为什么要用 Retrofit ？**

　　虽然 OkHttp 已经很方便、强大了，但是使用 Retrofit 可以进一步的方便我们进行网络请求。
>1、通过接口的封装，方便我们管理 App 内的所有请求。
>2、通过对第三方库（rxjava、gson）的支持，可以方便我们发起请求和解析返回值。


<br>　　**2、如何使用 Retrofit ？**

　　使用 Retrofit 的步骤共有如下 7 个：

>步骤1：添加 Retrofit 相关的依赖库
>步骤2：创建 JavaBean 类
>步骤3：创建 用于描述网络请求 的接口
>步骤4：创建 Retrofit 实例
>步骤5：创建 网络请求接口实例 并 配置网络请求参数
>步骤6：发送网络请求（异步 / 同步）

<br>　　范例1：添加依赖。
``` gradle
// 引入 rxjava 和 okhttp
implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
implementation("com.squareup.okhttp3:okhttp:4.4.0")

// 引入 retrofit
implementation("com.squareup.retrofit2:retrofit:2.8.1")

// 引入 retrofit 对 gson 和 rxjava 的适配器
implementation 'com.squareup.retrofit2:converter-gson:2.8.1'
implementation 'com.squareup.retrofit2:adapter-rxjava2:2.8.1'
```

<br>　　接下来我们以网易有道翻译的接口为例，介绍如何使用 retrofit 进行网络请求。

　　这是我们的测试接口：
>http://fanyi.youdao.com/openapi.do?keyfrom=Yanzhikai&key=2032414398&type=data&doctype=json&version=1.1&q=car 

<br>　　范例2：创建 JavaBean 类。
``` java
public class TranslationText {
    // 翻译的译文
    private List<String> translation;
    // 翻译的原文
    private String query;

    public List<String> getTranslation() {
        return translation;
    }

    public String getQuery() {
        return query;
    }
}
```

<br>　　范例3：创建 用于描述网络请求 的接口。
``` java
public interface YouDaoApi {
    @GET("openapi.do?keyfrom=Yanzhikai&type=data&doctype=json&version=1.1&key=2032414398")
    Observable<TranslationText> toTranslation(@Query("q") String q);
}
```
    语句解释：
    -  @GET注解表示执行get请求，相应的还有POST、PUT等注解，注解内的值是相对路径。
    -  @Query注解表示请求参数，最终会以“&参数名=参数值”的形式附加到URL后面。

<br>　　范例4：执行网络请求。
``` java
// 1、创建 Retrofit 对象
Retrofit retrofit = new Retrofit.Builder()
        // 设置网络请求的 host 地址
        .baseUrl("http://fanyi.youdao.com/") 
        // 设置数据解析器为Gson，即当接口返回时， Retrofit 会自动使用 Gson 来将 json 转换成 JavaBean 对象
        .addConverterFactory(GsonConverterFactory.create())
        // 设置请求适配器，让 Retrofit 通过 RxJava 处理异步
        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
        .build();
// 2、执行网络请求
retrofit
        // 创建对应的接口对象
        .create(YouDaoApi.class)
        // 调用接口的 toTranslation 方法
        .toTranslation("car")
        .subscribeOn(Schedulers.computation())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(new MyObserver<TranslationText>() {
            @Override
            public void onNext(TranslationText translationText) {
                System.out.println("___________ " + translationText.getQuery() + " = " + translationText.getTranslation());
            }
        });
// 程序最终输出：
// ___________ car = [小汽车]
```
    语句解释：
    -  默认情况下 Retrofit 内部会自己创建一个 OkHttpClient 对象，当然你可以传递给它一个对象。
    -  因此整个进程中只需要一个 Retrofit 对象就可以了。

<br>　　由于篇幅有限，笔者就不再继续了，如果你想知道 Retrofit 的更多用法，请参阅：[《这是一份很详细的 Retrofit 2.0 使用教程（含实例讲解）》](https://blog.csdn.net/carson_ho/article/details/73732076) 

### Room

　　Android 采用 SQLite 作为数据库存储，但 SQLite 提供的 API 很强大也很低级，使用起来麻烦且容易出错，所以开源社区里出现了各种 ORM（Object Relational Mapping ）库，常见的有 ORMLite ，GreenDAO 等。
　　而 Room 数据库就是 Google 做的，本质上来说 Room 是在 SQLite 上提供了一层抽象。

　　在 Room 中有三个主要的组件，如下图所示：

<center>
![](/img/android/android_architecture002_05.png)
</center>

>Entity：这是一个 Model 类，对应于数据库中的一张表。Entity 类是 SQLite 表结构在 Java 中的映射。
>DAO（Data Access Objects，数据访问对象）：负责定义访问数据库的方法，我们可以通过它来访问数据。
>RoomDatabase：数据库管理类，通常让它来负责创建数据库、管理各个 DAO 、处理数据库升级等任务，它也是 App 层访问数据库的主要入口类。

<br>　　范例1：创建实体类 —— User 。
``` java
// 如果一个类需要写入到数据库中，那么需要在此处加一个 @Entity 的注解
@Entity
public class User {

    // 每一个实体类都需要一个唯一的标识即主键，使用 @PrimaryKey 注解
    // 下面将主键设置为自增长，默认false
    @PrimaryKey(autoGenerate = true)
    private int uid;

    // 默认情况下会用属性名作为表的列名，但是可以通过 @ColumnInfo 注解修改
    @ColumnInfo(name = "name")
    private String name;

    private int age;

    // 使用 @Ignore 注解可以让其修饰的字段不加入数据表中
    @Ignore
    private String sex;

    // 此处省略各个属性的 get 、set 方法，如果将属性设置成 public 的则不需要 get 、 set 
}
```
    语句解释：
    -  除了上面介绍的知识，你还可以修改表名、建立唯一键、外键、索引。

<br>　　范例2：创建 Dao 类 —— UserDao 。
``` java
// 此处需要使用 @Dao 注解定义一个接口
@Dao
public interface UserDao {
    /**
     * 查询所有数据
     */
    @Query("Select * from user")
    List<User> getAll();
    /**
     * 依据 uid 从数据库中查找出一个 User 对象
     */
    @Query("SELECT * FROM user WHERE uid = :uid")
    User findById(String uid);
    /**
     * 一次插入单条数据 或 多条，如果发生了冲突，则用新数据取代旧数据 
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(User... users);
    /**
     * 一次删除单条数据 或 多条
     */
    @Delete
    void delete(User... users);
    /**
     * 一次更新单条数据 或 多条
     */
    @Update
    void update(User... users);
}
```
    语句解释：
    -  我们不需要去实现这个接口， Room 会自动依据方法上的 SQL 语句（如果你写了的话）帮我们生成实现类 UserDao_Impl 。

<br>　　范例3：创建 RoomDatabase 类 —— MyRoomDatabase 。
``` java
// 使用 @Database 注解定义一个统一对外的数据库管理类，此类需要是抽象类
// 参数 entities 用来指出数据库中的表对应的 Java 类
// 参数 version 用来指出当前数据库的版本号
@Database(entities = {User.class}, version = 1)
public abstract class MyDatabase extends RoomDatabase {

    public abstract UserDao getUserDao();

    private static MyDatabase appDataBase;

    public static MyDatabase getInstance(Context context) {
        if (appDataBase == null) {
            synchronized (MyDatabase.class) {
                if (appDataBase == null) {
                    // 通过此方法来创建 MyDatabase 对象即可，第三个参数是数据库的名称。
                    appDataBase = Room.databaseBuilder(context, MyDatabase.class, "myDatabase.db")
                            // 设置允许在主线程操作数据库，默认情况下是不需要
                            .allowMainThreadQueries()
                            .build();
                }
            }
        }
        return appDataBase;
    }
}
```
    语句解释：
    -  我们同样不需要事先 MyDatabase 类， Room 会自动生成一个实现类 MyDatabase_Impl 。

<br>　　范例4：前端代码。
``` java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 通过查看 MyDatabase_Impl 源码可以知道，此处获取的 UserDao 是一个单例对象
        UserDao userDao = MyDatabase.getInstance(getApplicationContext()).getUserDao();

        userDao.insert(new User("Cutler", 20));
        userDao.insert(new User("Fucker", 18));

        System.out.println("__________________ "+userDao.getAll().size());
    }
}
```
    语句解释：
    -  默认情况下，系统会在 data/data/package/databases 中生成数据库文件，共包含如下三个文件：
       -  myDatabase.db
       -  myDatabase.db-shm
       -  myDatabase.db-wal
    -  您如果想查看数据库里的内容，则必须将这3个文件导出到同一目录中，然后打开 myDatabase.db 即可。


<br>　　当升级 Android 应用的时候，有时需要更改数据库中表的结构（添加、删除列），但是不能直接在 Entity 对象上删除，而应该使用数据库提供的 Migration 类。

<br>　　范例5：数据库升级 —— 四步法。
``` java
// 1、修改 User 类
@Entity
public class User {
    // …… 上面省略其它代码
    public String sex;
}

// 2、将数据库的版本号从 1 升级到 2 
@Database(entities = {User.class}, version = 2)
public abstract class MyDatabase extends RoomDatabase {

    // 3、创建一个Migration 类，每个对象包含数据库的开始版本号和结束版本号
    static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE user ADD COLUMN sex TEXT");
        }
    };

    public static MyDatabase getInstance(Context context) {
        if (appDataBase == null) {
            synchronized (MyDatabase.class) {
                if (appDataBase == null) {
                    appDataBase = Room.databaseBuilder(context, MyDatabase.class, "myDatabase.db")
                            .allowMainThreadQueries()
                            // 4、设置 Migrations 
                            .addMigrations(MIGRATION_1_2)
                            .build();
                }
            }
        }
        return appDataBase;
    }
}
```
    语句解释：
    -  需要注意的是，使用 fallbackToDestructiveMigration() 会清空数据库里的所有数据。

<br>　　另外，我们可以让 LiveData 与 Room 配合使用。
<br>　　范例6：实时监听数据库变化。
``` java
// 1、创建一个 UserDao 类
@Dao
public interface UserDao {
    // 注意此方法的返回类型是 LiveData 的，Room 最终会创建一个 RoomTrackingLiveData 类对象。
    @Query("SELECT * FROM user WHERE uid=:uid")
    LiveData<User> findById(int uid);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(User... users);
}

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        UserDao userDao = MyDatabase.getInstance(getApplicationContext()).getUserDao();
        int uid = 10;
        // 往数据库插入数据，如果已经存在则执行替换
        userDao.insert(new User(uid, "Cutler ", 20));
        // 通过查看源码可以发现，我们无法通过调用 RoomTrackingLiveData 的 getValue() 方法获取数据。
        // 只能通过 observer 方法设置监听。
        userDao.findById(uid).observe(this, new Observer<User>() {
            @Override
            public void onChanged(User user) {
                System.out.println("__________________ " + user);
            }
        });
    }
    // 当界面中的按钮被点击时会调用此方法
    public void onClick(View view) {
        UserDao userDao = MyDatabase.getInstance(getApplicationContext()).getUserDao();
        int uid = 10;
        // 更新用户的名称
        userDao.insert(new User(uid, "Fucker ", 20));
    }
}
```
    语句解释：
    -  程序执行第 36 行代码后，我们就会在第 27 行接受到数据改变的通知。

<br>　　由于篇幅有限，笔者就不再继续了，如果你想知道 Room 的更多用法，请自行搜索。

<br>**本节参考阅读：**
- [知乎 - Room的基本使用](https://zhuanlan.zhihu.com/p/77036077)
- [Android架构组件（四）：Room](https://powerofandroid.com/2019/10/25/Android%E6%9E%B6%E6%9E%84%E7%BB%84%E4%BB%B6%EF%BC%88%E5%9B%9B%EF%BC%89%EF%BC%9ARoom/)

### DataBinding

　　数据绑定（DataBinding）可以将你的数据（Model对象）与UI界面进行绑定，从而省去了很多更新 UI 的模板代码。简单的说，数据绑定可以帮你做到：
>1、省去 findViewById 的调用。
>2、省去 setXxxListener 的调用，比如当用户点击 UI 控件时，可以将事件转调用给相应的 ViewModel 。
>3、省去数据更新时手动更新 UI 的操作，比如当 ViewModel 的数据发生变化的时候，可以自动更新 UI 控件。

　　关于 DataBinding 库 Google 提供了详细的中文教程，且非常容易学习上手，因此本节只会介绍其部分功能，想要完整的学习，请阅读 [《DataBinding》](https://developer.android.google.cn/topic/libraries/data-binding?hl=zh-cn) 。

<br>　　范例1：HelloWorld。

　　第一步，创建一个布局文件。
``` xml
<?xml version="1.0" encoding="utf-8"?>

<layout xmlns:android="http://schemas.android.com/apk/res/android">

   <data>
      <variable name="viewModel" type="com.meevii.myapplication.viewmodel.MainViewModel" />
   </data>

   <LinearLayout
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       android:orientation="vertical">
      <TextView
          android:layout_width="wrap_content"
          android:layout_height="wrap_content"
          android:text="@{viewModel.data.name}"
          android:textColor="@android:color/black" />
   </LinearLayout>

</layout>
```
    语句解释：
    -  根节点必须是 layout ，布局文件中包含一个 data 标签，用来声明当前布局所用到的对象。
    -  在数据绑定中对变量的引用要通过“@{}”来实现。
    -  上面的代码中创建了一个 TextView ，它的文本是 viewModel.getData.getName 方法的返回值。

　　第二步，在 MainActivity 中初始化布局。
``` java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 第一种加载方式：
        // ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        // setContentView(binding.getRoot());

        // 第二种加载方式：
        ActivityMainBinding binding = DataBindingUtil.setContentView(this, R.layout.activity_main);
        binding.setLifecycleOwner(this);
        binding.setViewModel(new ViewModelProvider(this).get(MainViewModel.class));
    }
}
```
    语句解释：
    -  默认情况下， DataBinding 库会依据布局文件的名称自动生成一个类，比如上面的 ActivityMainBinding 。
    -  加载完毕布局之后，需要创建一个 MainViewModel 对象，注入到 XML 文件中，实现数据绑定。

　　第三步，创建 MainViewModel 类。
``` java
public class MainViewModel extends ViewModel {

    // 注意本属性是 LiveData 类型的
    private MutableLiveData<User> data;

    public MainViewModel() {
        data = new MutableLiveData<>();
        doRequestUserInfoForNetwork();
    }

    private void doRequestUserInfoForNetwork() {
        // 使用 RxJava 来模拟一下网络请求
        Observable.create((ObservableOnSubscribe<User>) emitter -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            emitter.onNext(new User(10, "Fucker", 200));
        }).subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new MyObserver<User>() {
                    @Override
                    public void onNext(User user) {
                        data.setValue(user);
                    }
                });
    }

    public MutableLiveData<User> getData() {
        return data;
    }

}
```
    语句解释：
    -  由于数据绑定对 LiveData 做了兼容，所以当成功执行第 25 行代码时， TextView 会立刻更新文本。
    -  需要注意的是，本范例只是为了演示 DataBinding 的用法，正确的网络请求应该放到 Model 层里，而不是放到 ViewModel 中。


　　当然，数据绑定的功能肯定不止于此，比如你可以在XML中写出如下表达式：
``` xml
 <TextView
    android:text="@{String.valueOf(index + 1)}"
    android:visibility="@{age > 13 ? View.GONE : View.VISIBLE}"
    android:transitionName='@{"image_" + id}'/>
```
    语句解释：
    -  需要注意的是，通常 TextView 的 text 属性接收的是一个字符串类型，所以这里需要把数字使用 String.valueOf 方法转换一下。

　　如果你想知道更多的 XML 语法，请阅读 [《布局和绑定表达式》](https://developer.android.google.cn/topic/libraries/data-binding/expressions?hl=zh-cn#property_reference) 。


### 小结

<br>　　至此算是介绍完了 MVVM 所需要涉及到的所有库，其实大家可以看出来，笔者对每一个库的介绍都是浅尝辄止，因为只是想告诉大家它们是什么，至于它们的高级用法网上的教程一大堆，不需要笔者在这里吆五和六。

　　现在再稍微总结一下它们所处的模块：

>前端代码：DataBinding、ViewModel、LiveData、Lifecycle
>网络请求：OkHttp、Retrofit、RxJava
>数据库：Room 、LiveData、RxJava


<br>　　最后留下一个练习题，题目的要求为：

>1、程序从 MainActivity 中跳转到一个新界面 UserDetailsActivity 。
>2、新界面需要接收一个参数“ id ”，它依据“ id ”去查询并显示对应的用户信息。

　　由于篇幅有限，笔者就不提供源码了，下面是笔者画的类图，希望对大家有帮助。

<center>
![](/img/android/android_architecture002_06.png)
</center>

<br>　　最后笔者需要说一句：<font color='red'>要时刻警惕过渡架构！</font>
>一个项目通常有多个模块，不是所有模块都适合 MVVM 架构的，比如“设置”模块，我们没必要把简单的问题复杂化。

<br><br>