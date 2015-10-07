title: 架构篇　第二章 Model数据管理
date: 2015-6-29 17:15:30
categories: android
---
　　本章将介绍如何通过观察者模式来管理`Model`数据。

# 第一节 问题描述 #
　　在`Adroid`中从`A`页面跳转到`B`页面，然后`B`页面进行某些操作后需要通知`A`页面去刷新数据，我们可以通过在`A`页面重写`onActivityResult`来接收返回结果从而来刷新页面。
　　但是如果跳转路径是`A->B->C->……`，那么`C`或者`C`以后的页面来刷新`A`，就会非常的难处理。

<br>　　常见的解决这个问题的方法有如下三种（但不限于）：

	-  使用广播机制。 
	   -  先在A界面动态注册广播接收者，然后在C界面更新数据后就发送一个广播，A界面接到广播后执行刷新界面。
	-  使用文件存储。 
	   -  在C界面中把最新的数据写到本地文件中，当A界面onResume时再从本地读取数据。
	-  使用Application对象。 
	   -  首先，程序得自定义一个Application对象。
	   -  然后，在Application中创建一个Map对象专门用来保存全局变量，C界面修改完数据后就将数据放入到Map中。
	   -  最后，当A界面onResume时再从Map中读取数据。

<br>　　这三种解决方法各有缺点：

	-  使用广播机制的缺点：
	   -  代码混乱，各个界面都得动态注册和销毁接收者，不利于维护。
	   -  注册和发送广播是系统级别的操作，如果连续开启多个界面，每个界面都动态注册接收者，那么十分占用系统资源。
	-  使用文件存储的缺点： 
	   -  如果有多个线程同时执行任务时，无法保证文件里保存的内容是最新的。
	   -  文件存储涉及到IO操作，相比之下要消耗不少资源。
	-  使用Application对象的缺点： 如果处理不当，Map中的对象会不断累积，导致内存泄露。

<br>　　我们可以使用`“观察者模式”`来解决数据刷新的问题，同时不会存在上面这三种方案带来的弊端。

# 第二节 观察者模式 #
　　假设我们的项目有一个登录功能，当登录成功后会依据服务端返回的数据来创建一个`User`对象。这里有个要求，在项目的任何界面都可以访问和修改该`User`对象，为了实现这个需求，我们可以这么做：

	-  1、使用一个名为LoginUserEntityManager的类来管理这个User对象，该类是单例模式的，以后各个界面通过LoginUserEntityManager类来操作User对象了。
	-  2、由于User对象可能被同时显示在多个界面中，当某一个界面修改User的值后，我们得通知其它界面刷新数据。
	-  3、因此我们得在LoginUserEntityManager类里维护一个列表，用来保存这些界面的引用，以便及时通知它们更新数据。

<br>　　先来创建一个最简单的`User`类。
<br>　　范例1：`com.cutler.demo.model.user.User`类。
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

<br>　　然后定义一个接口，让每个界面都实现它，当`User`对象的值被修改时，`LoginUserEntityManager`类会通过这个接口的方法来通知界面。
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

<br>　　事实上项目中不可能只有`User`对象会在多个界面中被显示，因此我们再创建一个名为的`EntityManager`类，放一些公共的代码。

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
                // 此处不用担心会阻塞主线程，从以往的经验来看，通常观察者的数量不会导致主线程明显阻塞。
                synchronized(observers) {
                    for (Observer<T> observer : observers) {
                        observer.onDataLoaded(data);
                    }
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

<br>　　接着是`LoginUserEntityManager`类，它继承自`EntityManager`类。
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

<br>　　最后，就可以让`Activity`实现接口：
``` android
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
　　同时在观察者模式的基础上加入了`单例模式`，让结构变的清晰了。

<br>**本节参考阅读：**
- [观察者模式在android 上的最佳实践](http://www.akiyamayzw.com/%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F%E5%9C%A8android-%E4%B8%8A%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5/)



<br><br>
