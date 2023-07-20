---
title:  第四章 通讯篇
date: 2015-4-29 11:41:12
author: Cutler
categories: Android开发
---
# 第一节 线程间通信 #
## Handler ##
### 概述 ###
　　Android的消息机制主要是指`Handler`的运行机制，因此本章会围绕着`Handler`的工作过程来分析消息机制。
　　整个过程主要涉及到了如下5个类：

    -  Handler、Message、MessageQueue、Looper、ThreadLocal

<br>**Handler的作用**
　　对于任何一个线程来说，同一时间只能做一件事，主线程也不例外。
　　因此，若我们让主线程去执行上传/下载等耗时的任务时，在任务执行完毕之前，用户点击了界面中的按钮，主线程是无法响应用户的操作的。
　　并且，如果主线程`5`秒后仍没响应用户，则`Android`系统会弹出`ANR`对话框，询问用户是否强行关闭该应用。

　　这样说的话，我们就只能把耗时的操作放在子线程中执行了。不过，Android规定访问UI只能在主线程中进行，如果在其他线程中访问UI，那么程序就会抛出异常。
　　这个验证线程的操作由`ViewRootImpl`类的`checkThread`方法完成：
``` java
void checkThread() {
    if (mThread != Thread.currentThread()) {
        throw new CalledFromWrongThreadException(
                "Only the original thread that created a view hierarchy can touch its views.");
    }
}
```
　　这意味着，当子线程执行完毕耗时操作后，`得想办法通知主线程一下`，然后借助主线程来修改UI。  
　　而`Handler`就可以完成子线程向父线程发送通知的需求。

<br>**知识扩展**
　　这里再延伸一点，系统为什么不允许在子线程中访问UI呢？ 

    -  这是因为Android的UI控件并不是线程安全的，如果允许在多线程中并发访问，可能会导致UI控件处于不可预知的状态。
    -  也许你会说，加上同步不就行了？ 但是加同步有两个缺点：
       -  第一，Android控件众多，加上同步会让UI的逻辑变得复杂。
       -  第二，过多的同步操作会降低UI的访问效率，因为锁机制会阻塞某些线程的执行。
    -  基于这两个缺点，最简单和高效的方法就是采用单线程来处理UI操作，而且对于开发者来说也不是很麻烦，只需要使用Handler切换一下线程即可。

　　另外，并不是所有的更新UI的操作都只能在主线程中完成的。

    -  比如在子线程中可以简单的修改ProgressBar、SeekBar、ProgressDialog等控件。
    -  也就是只能调用这些控件的某些方法（如setProgress()等），若调用其他方法，则仍然会抛异常。
    -  如果追踪源码的话，会发现setProgress等方法最终还是会通过Handler来更新。

### 基础应用 ###
　　`Handler`的用法十分简单，笔者不打算过多介绍如何使用它，下面给出两个范例，如果不理解请自行搜索。

<br>　　范例1：发送消息。
``` java
public class TestActivity extends Activity {
    public Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            // 获取Message对象中的数据。
            System.out.println(msg.arg1);
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        new Thread(){// 创建一个线程对象。
            public void run(){
                // 创建一个Message对象。
                Message msg = new Message();
                // 为Message对象设置数据。
                msg.arg1= 100;
                mHandler.sendMessage(msg); // 将消息对象发送到Handler对象中。
            }
        }.start();
    }
}
```
    语句解释：
    -  本范例中，使用Handler对象的sendMessage方法，给它自己发送消息。
    -  Message类用来封装一个消息，在Message对象中可以保存一些数据，以供Handler使用。
       -  若需要传递给Handler的数据是int类型的，则可以使用Message类提供的两个int类型的属性arg1、arg2，它们方便使用且会更节约系统资源。
       -  若需要传递一个Object类型的数据，则可以使用Message类提供的obj属性。
       -  若要传递多个Object数据，则可以使用Bundle对象，当然也可以仍然使用obj属性，万物皆对象嘛。

<br>　　范例2：处理消息。
``` java
// 发送数据：
public void sendMessage() {
    new Thread() {
        public void run() {
            //  发送消息1：
            Message msg = new Message();
            msg.obj = "已下载 80%";
            msg.what = 1;
            mHandler.sendMessage(msg);
 
            //  发送消息2：
            msg = new Message();
            msg.obj = "Hi";
            msg.what = 2;
            mHandler.sendMessage(msg); 
        }
    }.start();
}
// 接收数据：
public Handler mHandler = new Handler() {
    public void handleMessage(Message msg) {
        switch(msg.what){
        case 1:
            System.out.println("更新进度条"+msg.obj);
            break;
        case 2:
            System.out.println("打印数据"+msg.obj);
            break;
        }
    }
};
```
    语句解释：
    -  父线程中创建的Handler对象可以接收来自其n个子线程中发送过来的消息。
    -  这些不同的子线程所要完成的任务是不尽相同的，因而他们发送的Message对象需要区别开来处理。
    -  Message的what属性类似于给消息增加一个“唯一标识”，以此来区分不同的Message 。

<br>　　在继续向下之前，先来介绍一下`ThreadLocal`类。
### ThreadLocal ###
　　假设现在有一个需求：

    -  有A、B、C、D四个类，它们的调用顺序是：A → B → C → D，即A类调用B类，B调用C，C调用D。
    -  若现在有个变量n，在ABCD四个类中都会用到它，若是将变量n随着程序的执行流程从A类开始依次传递，最后转给D，则代码会很乱。若是这类变量有很多，则这种传递数据的方式就很繁琐。
    -  用静态变量吗? 若是这个功能模块会被多个线程并发调用，那么静态变量很显然就不行了。
　　此时可以使用`ThreadLocal`类来完成数据的传递。

　　`ThreadLocal`可以将一些变量存放到当前线程对象中，那么只要是这个线程能走到的地方(代码)，都可以获取该变量的值。

<br>　　范例1：传送变量。
``` java
public class MainActivity extends ActionBarActivity {

    ThreadLocal<String> threadLocal = new ThreadLocal<String>();

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 主线程调用set方法保存自己的数据。
        threadLocal.set("1");
        // 创建第一个子线程。
        new Thread() {
            public void run() {
                threadLocal.set("2");
                System.out.println("Thread 1 = " + threadLocal.get());  // 输出：Thread 1 = 2
            }
        }.start();
        // 创建第二个子线程。
        new Thread() {
            public void run() {
                threadLocal.set("3");
                System.out.println("Thread 2 = " + threadLocal.get());  // 输出：Thread 2 = 3
            }
        }.start();
        // 主线程调用get方法读取自己的数据。
        System.out.println("Main Thread = " + threadLocal.get());       // 输出：Main Thread = 1
    }
}
```
    语句解释：
    -  多个线程可以共用一个ThreadLocal对象，每个线程都可以通过ThreadLocal的set方法来保存数据，各线程的数据互不影响。
    -  在同一个线程中，每个ThreadLocal只会为它保存一个值，若set两次，则新值覆盖旧值。
    -  可以将ThreadLocal封装入一个单例类中，不同的线程调用get和set方法，操作的都是其自己的数据。

<br>　　范例2：一个线程对应多个`ThreadLocal`。
``` java
public class MainActivity extends ActionBarActivity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ThreadLocal<String> t1 = new ThreadLocal<String>();
        ThreadLocal<String> t2 = new ThreadLocal<String>();

        t1.set("大家好,");
        t2.set("我是崔杰伦!");

        System.out.println(t1.get()+""+t2.get());
    }
}
```
    语句解释：
    -  由此可以得出结论，Thread和ThreadLocal是多对多的关系：
       -  一个Thread对象内可以有多个数据。
       -  一个ThreadLocal对象可以在多个Thread中被使用。

<br>　　介绍完了基础用法，下面说一下它的内部原理。首先看`ThreadLocal`的`set`方法，如下所示：
``` java
public void set(T value) {
    // 获取当前线程对象。
    Thread currentThread = Thread.currentThread();
    // Thread类中有一个ThreadLocal.Values类型的属性，用于保存ThreadLocal传递过去的数据。
    // 获取线程对象的Values属性。
    Values values = values(currentThread);
    if (values == null) {
        // 如果线程中还没有任何数据，则调用下面的方法初始化。
        values = initializeValues(currentThread);
    }
    // 将数据保存到Values对象中。
    values.put(this, value);
}
```

<br>　　`ThreadLocal.Values`类的`put`方法用来实现数据的存储，这里不去分析它的具体算法，但是可以看出如下几点：

    -  第一，ThreadLocal的值存在ThreadLocal.Values类的table属性中，它是一个Object[]。
    -  第二，每次存储新数据时，都会检查table是否存满，若满了则会自动扩充数组的长度。
    -  第三，ThreadLocal的值最终会被存储在table[index+1]的位置上，这个index是依据ThreadLocal的一些属性计算出来的。

<br>　　然后看`ThreadLocal`的`get`方法，如下所示：
``` java
public T get() {
    // Optimized for the fast path.
    Thread currentThread = Thread.currentThread();
    Values values = values(currentThread);
    if (values != null) {
        Object[] table = values.table;
        int index = hash & values.mask;
        if (this.reference == table[index]) {
            return (T) table[index + 1];
        }
    } else {
        // 如果当前线程没有保存过数据，则为它初始化values属性。
        values = initializeValues(currentThread);
    }

    // 返回默认值。
    return (T) values.getAfterMiss(this);
}
```
    语句解释：
    -  get方法也很简单，一看就明白，也是不多说。

<br>　　最后，从`ThreadLocal`的`set`和`get`方法可以看出：

    -  第一，数据最终是存储在table属性中的，table是一个数组，可以保存多个值。
    -  第二，每个ThreadLocal只能在当前线程的table属性中保存一个值，因为保存值的时候，保存的位置是通过ThreadLocal计算出来的，因此两次计算的结果肯定是一样的。
    -  第三，就像前面说的那样，ThreadLocal和Thread是多对多的关系。

### 运行原理 ###
　　接下来咱们就需要研究一下`Message`对象到底是如何被发送给其他线程中创建的`Handler`的。

　　`Handler`机制中主要牵扯到了`Handler`、`Message`、`MessageQueue`、`Looper`四个类。

<br>　　它们四者的身份：

    -  Message表示一个消息对象，它封装了子线程想要做的事情。
    -  MessageQueue表示一个消息队列，队列中的每个元素都是一个Message对象，各个子线程发送给Handler的消息，都会先被放到消息队列中排队等待处理。
    -  Looper：表示一个循环器，它会不断的从MessageQueue的头部获取Message对象，然后将该Message对象交给Handler去处理。
    -  Handler：表示一个处理器，用于处理Message对象。

<br>　　它们四者的关系：

    -  Handler中有一个Looper对象。
    -  Looper中有一个MessageQueue对象。
    -  MessageQueue是一个链队，链队中的每个节点都是一个Message对象，每个Message对象的next域指向下一个Message对象。

<br>**Handler对象**
<br>　　既然上面说`Handler`类中有一个`Looper`对象，我们就来看看`Handler`的构造方法：
``` java
public Handler() {
    this(null, false);
}
public Handler(Callback callback, boolean async) {
    if (FIND_POTENTIAL_LEAKS) {
        final Class<? extends Handler> klass = getClass();
        if ((klass.isAnonymousClass() || klass.isMemberClass() || klass.isLocalClass()) &&
                (klass.getModifiers() & Modifier.STATIC) == 0) {
            Log.w(TAG, "The following Handler class should be static or leaks might occur: " +
                klass.getCanonicalName());
        }
    }
    // 从ThreadLocal中获取Looper对象。
    mLooper = Looper.myLooper();
    if (mLooper == null) {
        throw new RuntimeException(
            "Can't create handler inside thread that has not called Looper.prepare()");
    }
    mQueue = mLooper.mQueue;
    mCallback = callback;
    mAsynchronous = async;
}
```
    语句解释：
    -  如果当前线程中没有保存过Looper对象，那么就会抛异常。
    -  也可以通过构造方法Handler(Looper looper)人为的为Handler设置Looper对象。

<br>　　但是，以前我们在实例化`Handler`对象时，并没有为其提供`Looper`对象，为什么没有抛异常呢？

    -  因为在主线程被创建的时候，会同时为其创建一个Looper对象，所以不会抛异常。

<br>　　我们常说的主线程其实就是指的`ActivityThread`类，主线程的入口方法为`main`：
``` java
public static void main(String[] args) {

    // 此处省略若干代码...

    // 在主线程中创建一个Looper对象。
    Looper.prepareMainLooper();

    ActivityThread thread = new ActivityThread();
    thread.attach(false);

    if (sMainThreadHandler == null) {
        sMainThreadHandler = thread.getHandler();
    }

    if (false) {
        Looper.myLooper().setMessageLogging(new
                LogPrinter(Log.DEBUG, "ActivityThread"));
    }

    // End of event ActivityThreadMain.
    Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
    Looper.loop();

    throw new RuntimeException("Main thread loop unexpectedly exited");
}
```
    语句解释：
    -  从上面第6和22行代码可以看出来，当主线程被创建时，会同时创建一个Looper对象，并调用它的loop方法。

<br>　　总之，当`Handler`被成功创建的时候，就意味着它里面已经存在一个`Looper`对象了。

<br>**Looper对象**
<br>　　接下来咱们再来看看`Looper`类，`Looper`在消息机制中扮演着循环器的角色，具体来说就是：

    -  Handler负责发送和处理消息，Handler发送的消息最终会被保存在Looper对象的MessageQueue属性中。
    -  Looper对象就是一个循环器，它通过一个无限for循环，不断的从它的MessageQueue中读取消息。
       -  若读到了消息，则会处理；若读不到，则会阻塞在那里，等待新消息的到来。

<br>　　在`Looper`类中提供了三个静态方法，用来在当前线程中创建`Looper`对象。
``` java
public static void prepare() {
    prepare(true);
}

private static void prepare(boolean quitAllowed) {
    if (sThreadLocal.get() != null) {
        throw new RuntimeException("Only one Looper may be created per thread");
    }
    sThreadLocal.set(new Looper(quitAllowed));
}

public static void prepareMainLooper() {
    prepare(false);
    synchronized (Looper.class) {
        if (sMainLooper != null) {
            throw new IllegalStateException("The main Looper has already been prepared.");
        }
        sMainLooper = myLooper();
    }
}
```
    语句解释：
    -  其中prepareMainLooper用法在主线程中创建Looper对象，另外两个方法用来在当前线程中创建Looper对象。

<br>　　创建完`Looper`对象后，需要调用`loop`方法来启动`Looper`，一旦启动成功后，`Looper`就可以不断的接收和处理消息了。

<br>　　范例1：在子线程中使用`Handler`。
``` java
public class TestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        new Thread() {
            public void run() {
                Looper.prepare();// 在当前线程中创建一个Looper。
                Handler mHandler = new Handler() {
                    public void handleMessage(Message msg) {
                        String currThdName = Thread.currentThread().getName();
                        System.out.println("当前线程 = " + currThdName);
                    }
                };
                Message msg = new Message();
                mHandler.sendMessage(msg);
                Looper.loop();
            }
        }.start();
    }
}
```
    语句解释：
    -  想在子线程中创建Handler对象，需要先调用Looper.prepare方法在当前线程中创建一个Looper对象。 
    -  创建完Looper对象后，还需要调用Looper对象的loop方法来启动它本身。
    -  Looper提供了quit和quitSafely两个方法来退出loop循环，二者的区别是，quit会直接退出，quitSafely会设定一个退出标记，然后等消息队列中的所有消息都处理完毕后才安全退出。

<br>**消息的发送流程**

　　假设现在主线程中创建了一个`Handler`对象，子线程A要向主线程中的`Handler`发送消息。
<br>　　首先，子线程A通过`Handler`类发送消息：

    -  Handler类中提供的sendMessage等方法，可以将Message对象发送到MessageQueue中。
    -  当消息被发送到MessageQueue中后，当前线程A就直接返回，它接着就去执行sendMessage之后的代码。
    -  类似于去邮局寄信，当把信放入信箱后，就可以回去了，至于信如何被发送到目的地，不需要关心。
    -  事实上，每个Message对象都有一个target属性，它指出由哪个Handler对象来处理当前消息对象。

<br>　　然后，来看一下`Looper`类的`loop`方法：
``` java
public static void loop() {

    // 此处省略若干代码...

    for (;;) {
        Message msg = queue.next(); // might block
        if (msg == null) {
            // No message indicates that the message queue is quitting.
            return;
        }

        // 此处省略若干代码...

        msg.target.dispatchMessage(msg);

        // 此处省略若干代码...

        msg.recycleUnchecked();
    }
}
```
    语句解释：
    -  从上面的代码可以看出：
       -  当Looper会使用无限for循环，不断的调用MessageQueue的next方法，读取消息。
       -  若MessageQueue当前没有需要处理的消息，则它的next方法就会被阻塞，一直不返回。
       -  当next方法返回时，Looper就会将Message发送给其target属性指向的Handler的dispatchMessage方法。
    -  当Message被处理后，Looper会执行上面第18行代码，清空Message的所有属性，并将其加入到回收栈中。
       -  当Handler调用obtainXxx()方法获取Message对象时，就从回收栈顶弹出一个Message对象。
       -  若回收栈栈中没有任何Message对象，则会new一个Message对象返回，但该Message不会被入栈。

<br>　　为什么每个`Message`对象要存在一个`target`属性呢?  

    -  一个线程中只会有一个Looper对象，但是却可能存在多个Handler对象。
    -  当Looper从消息队列中拿到一个消息时，需要把这个消息交给某个具体的Handler处理。
    -  通常这个Handler就是发送该消息的Handler对象。

<br>　　接着看一下`Handler`的`dispatchMessage`方法：
``` java
public void dispatchMessage(Message msg) {
    // 若Message对象的callback属性不为null，则调用callback属性的run()方法。
    if (msg.callback != null) {
        handleCallback(msg);
    } else {
        // 若当前Handler对象的mCallback属性不为null，则将消息交给它处理。
        if (mCallback != null) {
            if (mCallback.handleMessage(msg)) {
                return;
            }
        }
        // 最后，才会调用当前Handler对象的handleMessage(Message)方法去处理。
        handleMessage(msg);
    }
}
```

<br>　　最后，介绍三个`Handler`类的常用方法：
``` java
// 向当前Handler的消息队列中添加一个Runnable 。
// 在Handler内部会构建一个Message对象，并将该对象的callback属性设为r，然后再将这个Message对象加入到消息队列。
// 返回值：
// -  若r被成功加入到消息队列中则返回true。
public final boolean post(Runnable r);

// 向当前Handler的消息队列中添加一个Runnable 。Handler会等待delayMillis毫秒后，才调用Runnable的run()方法。
public final boolean postDelayed(Runnable r, long delayMillis);

// 从当前Handler的消息队列中删除一个Message对象，若找不到该Message则不删除。
public final void removeMessages(int what);
```

### HandlerThread ###
　　通常我们使用Handler是为了在主线程更新UI，但是这并不是Handler的唯一作用，客观点说Handler可以实现线程间的通信，比如主线程给子线程发消息。

<br>　　范例1：在子线程中使用`Handler`。
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

         // 创建一个线程对象，并为其指定名称。
        HandlerThread handlerThread = new HandlerThread("HandlerThread") {
            @Override
            protected void onLooperPrepared() {
                // 使用子线程中的Looper对象来创建Handler。
                Handler handler = new Handler(getLooper()) {
                    // 虽然Handler对象是在主线程中创建的，但是Looper却是运行在子线程中的。
                    // 而handleMessage方法又是由Looper调用的，所以该方法也是运行在子线程中的。
                    public void handleMessage(Message msg) {
                        System.out.println(Thread.currentThread() + " 准备处理消息");
                    }
                };
                handler.sendEmptyMessage(1);
            }
        };
        // 启动这个线程，在其内部会初始化并启动Looper对象。
        handlerThread.start();
    }
}
```
    语句解释：
    -  按照前面学的知识，为了让主线程给子线程发消息，我们得先创建一个子线程，并在其中创建Looper对象，然后才能通信。而系统已经帮我们封装好了一个类专门去做这件事，它叫HandlerThread类，它继承自Thread类，本质上是一个线程对象，其内部封装了一个Looper对象，同时它重写了run方法，并在其内执行Looper的创建和启动操作。
    -  如果想停止HandlerThread，则可以调用它的quit或quitSafely方法。
    -  HandlerThread是一个很有用的类，它在Android中的一个具体的使用场景是IntentService类。

<br>**本节参考阅读：**
- [Android HandlerThread用法](http://blog.csdn.net/qq_695538007/article/details/43376985)

## AsyncTask ##
　　本节将介绍一个开发中常用的类：`AsyncTask`，它可以实现在子线程执行任务，在主线程更新UI。

### 基础应用 ###
　　`AsyncTask`与`Thread`一样，都是用来执行一些耗时的操作的类，但与传统方式不同：

    -  内部使用线程池管理线程，这样就减少了线程创建和销毁时的消耗。
    -  内部使用Handler处理线程切换，这样省去了我们自己处理的过程，代码直观、方便。

<br>　　范例1：最简单的`AsyncTask`。
``` java
public class MyAsyncTask extends AsyncTask {

    // 此方法用于执行当前异步任务。 
    // 此方法会在AsyncTask的线程池中取出的线程上运行。此方法和Thread类的run方法类似。
    protected Object doInBackground(Object... params) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            try {
                sum = sum + i;
                Thread.sleep(200);
                System.out.println("sum + " + i + " = " + sum);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}

// 调用execute方法启动当前异步任务，此方法和Thread类的start方法类似。 
AsyncTask task = new MyAsyncTask();
task.execute();
```
    语句解释：
    -  本范例是AsyncTask的最简单应用。
    -  完全可以将本范例中的AsyncTask替换成Thread，把doInBackground方法替换成run方法。启动异步任务的execute方法和启动Thread的start方法是一样的。

<br>　　假设现在有一个任务，要求在计算的时候显示一个进度条对话框，当计算完毕后关闭该对话框，并将计算的结果通过`Toast`输出。此时就需要使用`AsyncTask`类提供的其他方法了。

<br>　　范例2：完成任务。
``` java
private final class MyAsyncTask extends AsyncTask {
    private ProgressDialog dialog;

    // 此方法用于在开始执行当前异步任务之前，做一些初始化操作。 
    // 此方法在主线程中运行。
    // 此方法由execute方法调用。此方法会在doInBackground方法之前被调用。
    protected void onPreExecute() {
        // 创建一个对话框。
        dialog = new ProgressDialog(AsyncTaskActivity.this);
        dialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        dialog.setTitle("百数相加");
        dialog.setMessage("计算出：1+2+3+...+100的和 !");
        dialog.setMax(5050);
        dialog.show();
    }

    // 在当前异步任务正在执行时，我们可以向AsyncTask里的Handler发送更新UI的消息。
    // Handler接到消息后，会在主线程中，回调用此方法方法更新UI。 
    protected void onProgressUpdate(Object... values) {// 更新进度条。
        this.dialog.setProgress((Integer)values[0]);
    }

    protected Object doInBackground(Object... params) {// 计算结果。
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            try {
                sum = sum + i;
                Thread.sleep(20);
                // 此方法用于在当前异步任务正在执行时，向AsyncTask里的Handler发送更新UI的消息。
                // Handler接到消息后，会调用onProgressUpdate方法更新UI。 此方法由用户根据需求手工调用。
                this.publishProgress(sum); // 通知Handler更新UI。
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return sum;
    }

    // 此方法用于在当前异步任务执行完成之后，做一些收尾操作。 
    // 此方法在主线程中运行。
    // 此方法会在doInBackground方法之后被调用。doInBackground方法的返回值会被当作此方法的参数。
    protected void onPostExecute(Object result) {
        // 销毁进度条。
        dialog.dismiss();
        Toast.makeText(AsyncTaskActivity.this,"计算结果为："+result,0).show();
    }
}
```
    语句解释：
    -  AsyncTask内的各个方法调用顺序：
       -  第一，我们调用execute方法启动AsyncTask 。
       -  第二，调用onPreExecute方法，执行初始化操作。
       -  第三，从线程池中取出一个空闲的线程，并使用该线程调用doInBackground方法，执行耗时的操作。
       -  第四，当doInBackground方法执行完毕后，onPostExecute方法将被调用（onPostExecute方法的参数就是doInBackground方法的返回值）。
       -  第五，若想更新UI控件，则可以在doInBackground方法中调用publishProgress方法。
          -  提示：调用publishProgress方法时设置的参数将被传递给onProgressUpdate方法。

<br>　　在上面的范例中，各个方法的参数、返回值都是`Object`类型的，这对于严格控制程序有很大负面的影响。
　　但是事实上，`AsyncTask`类是有泛型的。即`AsyncTask<Params, Progress, Result>`其中：

    -  Params：用于设置execute和doInBackground方法的参数的数据类型。
    -  Progress：用于设置onProgressUpdate和publishProgress方法的参数的数据类型。
    -  Result：用于设置onPostExecute方法的参数的数据类型和doInBackground方法的返回值类型。

<br>　　`AsyncTask`类经过几次修改，导致了不同的API版本中的`AsyncTask`具有不同的表现：

    -  Android1.6之前，AsyncTask是串行执行任务的。
    -  Android1.6时，开始采用线程池处理并行任务。
    -  Android3.0开始，为了避免AsyncTask所带来的并发错误，AsyncTask又采用一个线程来串行执行任务。

　　尽管如此，在Android3.0以及之后的版本中，我们仍然可以通过`AsyncTask`的`executeOnExecutor`方法来并行的执行任务。

### 运行原理 ###
<br>　　我们先从`AsyncTask`的`execute`方法开始分析：
``` java
public final AsyncTask<Params, Progress, Result> execute(Params... params) {
    // 转调用executeOnExecutor方法。
    return executeOnExecutor(sDefaultExecutor, params);
}

public final AsyncTask<Params, Progress, Result> executeOnExecutor(Executor exec,
        Params... params) {
    if (mStatus != Status.PENDING) {
        switch (mStatus) {
            case RUNNING:
                throw new IllegalStateException("Cannot execute task:"
                        + " the task is already running.");
            case FINISHED:
                throw new IllegalStateException("Cannot execute task:"
                        + " the task has already been executed "
                        + "(a task can be executed only once)");
        }
    }

    mStatus = Status.RUNNING;
    // 在当前线程中调用AsyncTask的onPreExecute方法。
    onPreExecute();

    // 将params保存到当前AsyncTask对象的mWorker属性中。
    mWorker.mParams = params;
    // 调用sDefaultExecutor的execute方法来将当前AsyncTask对象的mWorker属性添加到队列中。
    exec.execute(mFuture);

    return this;
}
```
    语句解释：
    -  sDefaultExecutor是一个static属性，它实际上是一个串行的线程池，一个进程中的所有AsyncTask都在它里面排队，按照先进先出的顺序依次执行。

<br>　　接着看一下`sDefaultExecutor`属性：
``` java
public static final Executor SERIAL_EXECUTOR = new SerialExecutor();
private static volatile Executor sDefaultExecutor = SERIAL_EXECUTOR;

private static class SerialExecutor implements Executor {
    // 这是一个队列，用来保存等待执行的任务。
    final ArrayDeque<Runnable> mTasks = new ArrayDeque<Runnable>();
    Runnable mActive;

    public synchronized void execute(final Runnable r) {
        // 向队列中添加一个任务。
        mTasks.offer(new Runnable() {
            public void run() {
                try {
                    // 当任务被执行时，调用mFuture的run方法。
                    r.run();
                } finally {
                    // 执行下一个任务。
                    scheduleNext();
                }
            }
        });
        // 如果当前没有任务正在执行，则立刻开始执行队首任务。
        if (mActive == null) {
            scheduleNext();
        }
    }

    protected synchronized void scheduleNext() {
        // 尝试获取任务。
        if ((mActive = mTasks.poll()) != null) {
            // 使用THREAD_POOL_EXECUTOR线程池来执行队首任务。
            THREAD_POOL_EXECUTOR.execute(mActive);
        }
    }
}
```
    语句解释：
    -  AsyncTask中有两个线程池：
       -  sDefaultExecutor用来保存等待执行的任务。
       -  THREAD_POOL_EXECUTOR用来执行任务。

<br>　　接着看一下`mFuture`的定义：
``` java
public AsyncTask() {
    mWorker = new WorkerRunnable<Params, Result>() {
        // 在FutureTask的run方法中会调用mWorker的call方法。
        // call方法是在子线程中被调用的。
        public Result call() throws Exception {
            mTaskInvoked.set(true);

            Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
            // 执行任务，并调用postResult方法处理结果。
            return postResult(doInBackground(mParams));
        }
    };

    mFuture = new FutureTask<Result>(mWorker) {
        @Override
        protected void done() {
            try {
                postResultIfNotInvoked(get());
            } catch (InterruptedException e) {
                android.util.Log.w(LOG_TAG, e);
            } catch (ExecutionException e) {
                throw new RuntimeException("An error occured while executing doInBackground()",
                        e.getCause());
            } catch (CancellationException e) {
                postResultIfNotInvoked(null);
            }
        }
    };
}
```
    语句解释：
    -  从上面代码可以看出，mWorker和mFuture都是实例属性。
    -  也就是说，当线程池执行任务的时候，程序的流程会从THREAD_POOL_EXECUTOR中回到某个具体的AsyncTask对象上。

<br>　　接着看一下`postResult`方法：
``` java
private Result postResult(Result result) {
    @SuppressWarnings("unchecked")
    // 封装一个AsyncTaskResult对象，并将它发送到主线程中。
    Message message = getHandler().obtainMessage(MESSAGE_POST_RESULT,
            new AsyncTaskResult<Result>(this, result));
    message.sendToTarget();
    return result;
}

private static Handler getHandler() {
    synchronized (AsyncTask.class) {
        if (sHandler == null) {
            sHandler = new InternalHandler();
        }
        return sHandler;
    }
}

private static class InternalHandler extends Handler {
    public InternalHandler() {
        // 使用主线程的Looper对象。
        super(Looper.getMainLooper());
    }

    @SuppressWarnings({"unchecked", "RawUseOfParameterizedType"})
    @Override
    public void handleMessage(Message msg) {
        AsyncTaskResult<?> result = (AsyncTaskResult<?>) msg.obj;
        switch (msg.what) {
            case MESSAGE_POST_RESULT:
                // 如果任务执行完毕，则调用AsyncTask类的finish方法。
                result.mTask.finish(result.mData[0]);
                break;
            case MESSAGE_POST_PROGRESS:
                // 这个你懂的。
                result.mTask.onProgressUpdate(result.mData);
                break;
        }
    }
}

private void finish(Result result) {
    // 如你所见。
    if (isCancelled()) {
        onCancelled(result);
    } else {
        onPostExecute(result);
    }
    mStatus = Status.FINISHED;
}
```
    语句解释：
    -  InternalHandler类用来将程序的从子线程切换到主线程中。

### 线程池 ###
　　提到线程池就必须先说一下线程池的好处：

    -  它可以维持其内线程不死，让线程重复使用，避免因为线程的创建和销毁所带来的性能开销。
    -  比较常用的一个场景是`http`请求，如果程序需要频繁的、大量的执行请求，那么推荐使用线程池。

<br>　　线程池都是直接或者间接通过配置`ThreadPoolExecutor`来实现的，因此我们来看一下它的构造方法：
``` java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler)
```
    语句解释：
    -  corePoolSize表示线程池的核心线程数，默认情况下，核心线程会在线程池中一直存活，即使它们处于空闲状态。
       -  线程池中有两类线程，一类是核心线程，另一类是非核心线程。
       -  默认情况下，当任务的数量超过corePoolSize时，就会尝试开启非核心线程去执行任务，执行完毕后非核心线程将被销毁。
    -  maximumPoolSize表示线程池所能容纳的最大线程数，即核心线程+非核心线程的和。
       -  当线程池中的线程数达到这个数值后，新任务将交给handler处理。
    -  keepAliveTime表示非核心线程闲置的时间，即非核心线程执行完任务会等待keepAliveTime时间后才会销毁。
       -  当线程池的allowCoreThreadTimeOut属性设置为true时，keepAliveTime同样会作用于核心线程。
    -  unit表示keepAliveTime的单位，常用取值为：TimeUnit.SECONDS（秒）、TimeUnit.MINUTES（分钟）等。
    -  workQueue表示任务队列，通过线程池的execute方法提交的任务，会保存在此队列中。
    -  threadFactory表示线程工厂，用来创建线程的。
    -  handler当线程池无法执行新任务时（比如任务队列已满或者无法成功执行任务），就会调用RejectedExecutionHandler的rejectedException方法来处理。
       -  线程池的默认实现是抛出一个RejectedExecution异常。

<br>　　若任务队列使用`LinkedBlockingQueue`类，则`ThreadPoolExecutor`类在执行任务时大致遵循如下规则：

    -  若线程池中的核心线程的数量 < corePoolSize，那么会直接启动一个核心线程来执行任务。
    -  若大于或等于corePoolSize，则检测任务队列是否有空位，若有，则将任务直接添加到任务队列中等待执行。
    -  若任务队列已满，则会尝试开启一个非核心线程来执行队首的任务，并把新任务放入队尾。
       -  注意，若任务队列未满，则不会开启非核心线程，所有的任务都会交给核心线程来执行。
       -  也就是说，若我们不为任务队列指定长度的话，那么线程池永远都不会开启非核心线程。
    -  若任务队列满了，且线程池中的线程总数大于maximumPoolSize，那么就拒绝执行此任务，并调用RejectedExecutionHandler来处理。

<br>　　我们来看看`AsyncTask`类的线程池：
``` java
private static final int CPU_COUNT = Runtime.getRuntime().availableProcessors();
private static final int CORE_POOL_SIZE = CPU_COUNT + 1;
private static final int MAXIMUM_POOL_SIZE = CPU_COUNT * 2 + 1;
private static final int KEEP_ALIVE = 1;

private static final ThreadFactory sThreadFactory = new ThreadFactory() {
    private final AtomicInteger mCount = new AtomicInteger(1);

    public Thread newThread(Runnable r) {
        return new Thread(r, "AsyncTask #" + mCount.getAndIncrement());
    }
};

private static final BlockingQueue<Runnable> sPoolWorkQueue =
        new LinkedBlockingQueue<Runnable>(128);

/**
 * An {@link Executor} that can be used to execute tasks in parallel.
 */
public static final Executor THREAD_POOL_EXECUTOR
        = new ThreadPoolExecutor(CORE_POOL_SIZE, MAXIMUM_POOL_SIZE, KEEP_ALIVE,
                TimeUnit.SECONDS, sPoolWorkQueue, sThreadFactory);
```

<br>　　上面只是简单的介绍了各个参数的含义，在`Executors`类为我们提供好了四种线程池，在大部分情况下我们是不需要自己创建线程池的，因为直接使用它们就可以满足需求了。

<br>　　范例1：FixedThreadPool。
``` java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```
    语句解释：
    -  FixedThreadPool线程池中只有核心线程，除非线程池关闭，否则核心线程会一直存在。
    -  由于没有非核心线程，所以也就没设置超时时间。
    -  任务队列也没有设置长度，因而理论上可以无限接收任务。

<br>　　范例2：CachedThreadPool。
``` java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```
    语句解释：
    -  CachedThreadPool线程池中没有核心线程，有多少任务就会执行多少任务，任务执行完毕后就销毁线程。
    -  前面已经说过了线程池执行任务的流程，但那个过程是基于LinkedBlockingQueue做为任务队列的。
    -  需要注意的是，CachedThreadPool线程池使用SynchronousQueue做为任务队列，该队列不会存储元素，任何任务都会被立刻执行，具体介绍请自行搜索。

<br>　　范例3：ScheduledThreadPoolExecutor。
``` java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}

public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE,
          DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
          new DelayedWorkQueue());
}
```
    语句解释：
    -  需要注意的是，ScheduledThreadPoolExecutor线程池使用DelayedWorkQueue做为任务队列，具体介绍请自行搜索。

<br>　　范例4：SingleThreadExecutor。
``` java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService(new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```
    语句解释：
    -  此线程池只有1个核心线程，所有任务都由这个核心线程来执行。

<br>　　最后，如果想让`AsyncTask`可以在`Android3.0`以及以上的系统上并行运行，可以使用如下代码：
``` java
task.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, params)
```

# 第二节 进程间通讯 #

　　本章来介绍一下`Android`的`IPC`（进程间通信）机制，主要参考书籍：[《Android开发艺术探索》](http://item.jd.com/1710650057.html)，并加上了笔者自己的体会。

## 简介 ##
<br>**问题描述**
　　通常在计算机领域中每一个应用程序都拥有自己的进程，各自都只在自己的进程中运行，相互不干扰。但是，有些时候设备中的两个进程之间需要进行通信、传递数据，这就需要用到`IPC`技术了。

　　目前，很多操作系统不支持跨进程内存共享，Android也不例外，一个进程通常不能像访问本进程内存一样访问其他进程的内存。因此，若进程间想要对话，则就需要将数据`拆解`为操作系统可以理解的基本数据单元，并且有序的通过`进程边界`。
<!-- more -->
<br>**多进程的分类**
　　多进程的情况分两种：

    -  第一种，相互通信的两个进程属于同一个应用。
       -  比如应用中的某些模块由于特殊原因需要运行在单独的进程中，此时就需要在一个应用内部开启多个进程。
       -  又或者为了增大应用可使用的内存，而使用多进程来获取多份的内存空间，因为系统为每个进程分配的空间是有限的。
    -  第二种，相互通信的两个进程属于完全不同的应用。
       -  比如我们在使用ContentProvider查询数据时，就是在进行进程间通讯，只不过通信细节被系统内部屏蔽了。

## 多进程模式 ##
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

## IPC基础知识 ##
　　本节主要介绍IPC中的一些基础概念，主要包含三个方面内容：`Serializable`、`Parcelable`以及`Binder`。
　　只有熟悉这三方面的内容后，我们才能更好的理解跨进程通信的各种方式。

### Serializable ###
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

### Parcelable ###
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

<br>　　`Parcelable`其实也是在进行序列化和反序列化操作，使用`Parcelable`的步骤是这样的：

    -  首先，系统调用writeToParcel方法要求JavaBean把自己的各个字段写入到一个Parcel对象中。
    -  然后，系统会将Parcel对象传递到目的地去。
    -  最后，数据到达目的地后，系统再调用Parcelable.Creator接口中提供的方法，从Parcel中将各个数据读出来，然后创建出一个JavaBean对象。

### Binder ###
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

## IPC的实现方式 ##
　　本节开始详细介绍各种跨进程通信的方式。
### Bundle ###
　　我们知道，四大组件中有三大组件都支持在`Intent`中传递`Bundle`数据，由于`Bundle`实现了`Paracelable`接口，所以它可以方便地在不同的进程间传输。

　　不过我们传输的数据必须能够被序列化，比如基本类型、实现了`Paracelable`和`Serializable`接口的对象、Android支持的特殊对象，Bundle不支持的类型我们是无法跨进程传递的。

### 文件共享 ###
　　两个进程通过`读/写`同一个文件来交换数据，比如A进程把数据写入文件，B进程通过读取这个文件来获取数据。

　　这种方法虽然能实现通信，但是仍然有三个缺点：

    -  第一，文件如果并发读写，则可能会导致数据丢失、混乱。
    -  第二，两个进程之间仍然需要发送广播来通知对方，自己已经把数据写到本地了，你可以读了。
    -  第三，文件读写涉及到了IO操作，如果数据量大的话，性能上会有所降低。

　　虽然我们一般都不会使用此方法来进行进程间通信，但是还是得注意一下，避免并发访问`SharedPreferences`文件。
### Messenger ###
　　`Messenger`可以翻译为信使，通过它可以在不同进程中传递`Message`对象，在`Message`中放入我们需要传递的数据，就可以轻松的实现数据在进程间的传递了。

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

　　因此，如果你既不需要并发处理，也不需要实时响应，那么请使用`Messenger`，因为它是最简单的`IPC`实现方案。但是，如果你需要并发访问或者实时响应的话，那`Messenger`就无能为力了，不过我们还有其它IPC方案，比如`AIDL`。事实上，`Messenger`内部就是通过`AIDL`来实现`IPC`的，如果确定使用`AIDL`的话，你必须自己处理并发访问以及线程安全。

### AIDL ###
　　AIDL是基于`Binder`来实现的。

#### 基础用法 ####

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
       -  否则，需要将Server端定义的AIDL文件原样copy到Client的项目中。
    -  第五步，在Client端，通过绑定的方式启动服务端的Service，并在连接成功后持有服务端返回的引用。

　　我们接下来就一步步的按照上面的步骤来吧。


<br>**创建AIDL文件**
<br>　　在创建AIDL文件之前，先来看一下它的一些特点：

    -  AIDL文件的后缀名为.aidl。
    -  AIDL文件也保存在src目录下。
    -  AIDL的语法和Java的interface高度相似，不过我们不能直接使用AIDL编写出来的代码，而是需要将它转为.java文件才行。（这个工作由IDE来调用AndroidSDK里的工具来完成，最终会在gen目录下产生一个.java文件，以供我们使用）

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
    -  如果你使用的Android Studio开发，那么在创建文件的时候，选择File -> New -> AIDL即可。

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
            public void onServiceDisconnected(ComponentName name) { }
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

<br>　　1、在服务端的`org.cutler.aidl.entity`包中创建一个`Person`类，并实现`Parcelable`接口：
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
#### 事件回掉 ####
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
#### 注意事项 ####
　　到这里，AIDL的基本使用方法已经介绍完了，但是有几点还需要再次说明一下。

    第一，客户端调用远程服务的方法时，被调用的方法运行在服务端的Binder线程池中，同时客户端会被挂起。若你在主线程中调用远程方法，那么远程方法不应该去执行耗时操作，因为客户端会被挂起超过5秒就会抛出ANR。若你在工作线程中调用远程方法，则远程方法内部可以执行耗时操作。
    第二，客户端的onServiceConnected和onServiceDisconnected都在主线程中运行。
    第三，远程服务调用客户端的方法时，被调用的方法也运行在Binder线程池中，只不过是客户端的线程池。
    第四，默认情况下，我们的远程服务任何人都可以连接，可以通过下面三种方式进行权限验证：
    -  第一种，在Service的onBind中验证，验证不通过则直接返回null。
    -  第二种，重写AIDL接口的Stub类的onTransact方法，若验证失败则直接返回false。
    -  第三种，在清单文件中，为<Service>设置android:permission属性。
    第五，服务端的远程方法可以返回IBinder类型的参数，我们可以依据客户端传递的参数来返回不同的Binder对象，这样就可以不用为每一个AIDL接口都创建一个Service了。

### ContentProvider ###
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
#### 基础应用 ####

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

　　范例1：Cursor接口。
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
#### 实现权限 ####
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

### Socket ###
　　在Android中，也可以通过`Socket`来实现进程间通信，在服务端开启一个`Socket`，然后服务端就可以等待客户端接入了。网上`Socket`的教程有很多，笔者就不再冗述了。

# 第三节 网络通信 #

　　本章来讲解一下`Android`开发中网络编程相关的知识。

## HTTP协议 ##
　　本节简单的介绍一些`http`协议的基础知识，如果你没有任何网络编程的经验，那么你不适合阅读本文。
### 基础知识 ###
　　超文本传送协议 (`HTTP-Hypertext transfer protocol`) 是一个基于请求与响应模式的、无状态的、应用层的通信协议，它工作在`TCP/IP`协议体系中的`TCP`协议上。 

　　如图所示：

<center>
![](/img/android/android_7_1.png)
</center>

　　`http`协议是万维网（`world wide web`）交换信息的基础，它允许将超文本标记语言(`HTML`)网页从服务器传送到`Web`浏览器(如`IE`等)。

<br>**特点**
　　`http`协议是无状态的。

    -  无状态是指协议对于事务处理没有记忆能力。
    -  也就是说如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。如：用户登录，若第一次登录密码输入错误，则在第二次登录时，同样需要再次提供账号和密码，而不是只提供密码。

　　基于请求/应答模式的。

    -  客户端发送一个请求(request)给服务器，服务器在接收到这个请求后执行相应的操作，并在操作完成后生成一个响应(response)返回给客户端。
    -  用户在浏览器地址栏中输入一个网址(URL)，就是在向服务器端发送一个请求，请求查看网页的内容。
    -  服务器端总是等待客户端发来的请求，而不会主动的向客户端发送请求。

<br>**作用**
　　`http`能做什么?
　　浏览网页是`http`的主要应用，但是这并不代表`http`就只能应用于网页的浏览。 `http`是一种协议，只要通信的双方都遵守这个协议，`http`就能有用武之地。

<br>**URI和URL**
　　URL是URI的子集。

    -  URI 可以描述任意一个(本地系统、互联网等地方的)资源的路径。
    -  URL 是一种特殊类型的URI，包含了用于查找某个资源的足够的信息，主要用来描述互联网上的一个资源的路径。

　　比如：`“http://www.baidu.com/test/a.txt”`是一个URL，它也是一个URI 。

<br>　　URL 的一般形式是：`<URL的访问方式>://<主机>:[端口][路径]`，比如：`http://www.baidu.com:8080/test/a.txt`。其中：

    -  “http”表示要通过http协议来定位网络资源，常见的访问方式有：http、ftp、news等。
    -  “www.baidu.com”表示资源所在的地址，它是一个合法的Internet主机域名或者IP地址。
    -  “8080”表示端口号，若省写了端口则默认访问80端口。
    -  “/test/a.txt”表示资源在服务器端的存放路径。

<br>**协议版本号**
　　超文本传输协议已经演化出了很多版本，它们中的大部分都是向下兼容的。
　　目前有`0.9`(已过时)、`HTTP/1.0`、`HTTP/1.1`。
　　`HTTP/0.9`只接受`GET`一种请求方法，没有在通讯中指定版本号，且不支持请求头。由于该版本不支持`POST`方法，所以客户端无法向服务器传递太多信息。

　　`HTTP/1.0`这是第一个在通讯中指定版本号的HTTP协议版本，至今仍被广泛采用，特别是在代理服务器中。

　　`HTTP/1.1`是当前版本（现在是2015年），持久连接被默认采用，并能很好地配合代理服务器工作，还支持以管道方式在同时发送多个请求，以便降低线路负载，提高传输速度。

<br>**HTTP/1.0与HTTP/1.1**
　　网站每天可能要接收到上百万的请求，为了提高系统效率，`HTTP1.0`规定浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个`TCP`连接，服务器完成请求处理后立即断开`TCP`连接，服务器不跟踪每个客户也不记录过去的请求。但是，这也造成了一些性能上的缺陷。

　　首先浏览器去请求服务器端的一个网页文件，这个网页文件中又引用了多张图片。
　　当浏览器访问这个网页文件时，发现其中的`<img>`图像标签后，浏览器会再次向服务器发出下载图像数据的请求。
　　显然，访问一个包含有许多图像的网页文件的整个过程包含了多次请求和响应，`每次请求和响应都需要建立一个单独的连接`，每次连接只是传输一个文档和图像，上一次和下一次请求完全分离。
　　客户端和服务器端每次建立和关闭连接却是一个相对比较费时的过程，并且会严重影响客户机和服务器的性能。当一个网页文件中包含 `Applet`，`JavaScript`文件，`CSS`文件等内容时，也会出现类似上述的情况。

　　为了克服`HTTP 1.0`的这个缺陷，`HTTP 1.1`支持持久连接。
　　在一个`TCP`连接上可以传送多个`HTTP`请求和响应，减少了建立和关闭连接的消耗和延迟。一个包含有许多图像的网页文件的多个请求和应答可以在一个`TCP`连接中传输，但每个单独的网页文件的请求和应答仍然需要使用各自的连接。

<br>　　扩展：

    HTTP 1.1在继承了HTTP 1.0优点的基础上，也克服了HTTP 1.0的性能问题。
    HTTP 1.1 还通过增加更多的请求头和响应头来改进和扩充HTTP 1.0 的功能。例如，由于HTTP 1.0不支持Host请求头字段，WEB浏览器无法使用主机头名来明确表示要访问服务器上的哪个WEB站点，这样就无法使用WEB服务器在同一个IP地址和端口号上配置多个虚拟WEB站点。在HTTP 1.1中增加Host请求头字段后，WEB浏览器可以使用主机头名来明确表示要访问服务器上的哪个WEB站点，这才实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多个虚拟WEB站点。HTTP 1.1 的持续连接，也需要增加新的请求头来帮助实现，例如，Connection 请求头的值为Keep-Alive 时，客户端通知服务器返回本次请求结果后保持连接；Connection 请求头的值为close 时，客户端通知服务器返回本次请求结果后关闭连接。 HTTP 1.1还提供了与身份认证、状态管理和Cache缓存等机制相关的请求头和响应头。

<br>**本节参考阅读：**
- [HTTP协议详解（真的很经典）](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html) 
- [HTTP_互动百科](http://www.baike.com/wiki/HTTP)
- [超文本传输协议_维基百科](http://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE#.E5.8D.8F.E8.AE.AE.E7.89.88.E6.9C.AC.E5.8F.B7)  

### HTTP请求 ###
　　客户端连上服务器后，并请求访问服务器内的某个`web`资源，称之为客户端向服务器发送了一个HTTP请求(`request`)。一个完整的HTTP请求包括如下内容：

    -  一个请求行。
    -  若干请求报头。
    -  一个空白行(起到间隔作用)。
    -  请求正文(以post方式发送的请求才有此项)。

<br>**请求行**
　　请求行由三部分组成：请求的方式，请求的资源名称，请求使用的协议以及版本。
　　HTTP请求的方式有：`POST`、`GET`、`HEAD`、`OPTIONS`、`DELETE`、`TRACE`、`PUT`、`CONNECT`。其中`GET`和`POST`最常用。

<br>　　范例1：请求行。
``` 
GET / books/java.html  HTTP/1.1
```

<br>　　`GET`方式：将需要传递给服务器的数据直接写在URL后面。

<center>
![](/img/android/android_7_2.png)
</center>

　　如：`GET / cxy/a.html?name=tomcat&password=123 HTTP/1.1`
　　含义：请求查看`a.html`文件，并向服务器中传递两个参数，`name`和`password`，多个参数之间使用`&`间隔。 文件名与参数之间使用`?` 间隔。
　　缺点：由于浏览器地址栏的长度有限，因此若参数过多，则就不要使用此方式。

<br>　　`POST`方式：参数将通过“请求正文”发送给服务器，因此参数的数量、长度是无限制。

<center>
![](/img/android/android_7_3.png)
</center>

<br>**请求报头**
　　请求报头是客户端向服务器端发送请求时，请求中附加的信息以及客户端自身的信息。

<br>　　范例1：请求头中的常见信息。
```
Accept: image/gif, image/jpeg, image/pjpeg, image/pjpeg, application/x-shockwave-flash, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*
Referer: http://localhost/cxy/a.html?name=tomcat&password=123
Accept-Language: zh-CN,en-US;q=0.5
User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate
Host: localhost
Content-Length: 24
Connection: Keep-Alive
Cache-Control: no-cache
```
    语句解释：
    -  请求头Accept：告知服务器，客户端浏览器可接受的文件的类型。如：
       -  Accept:image/gif，表明客户端希望接受 gif 图象。
       -  Accept:text/html，表明客户端希望接受 html 文本。
    -  请求头Accept-Encoding：告知服务器，客户端浏览器可接受的数据压缩编码。
    -  请求头Accept-Language：告知服务器，客户端浏览器当前语言环境(用于国际化程序设计)。
    -  请求头Host：告知服务器，客户端浏览器要访问的主机。必须要提供此请求头。
    -  请求头Referer：告知服务器，当前请求是由客户端浏览器的哪个页面发出的。
    -  请求头User-Agent：告知服务器，客户端操作系统、浏览器的类型、版本号等信息，此属性由浏览器来设置。
    -  请求头Cookie：告知服务器，客户端浏览器中的Cookie 。
    -  请求头Connection：取值有两个“Keep-Alive和close” 。
    -  请求头Date：告知服务器，客户端浏览器发送请求的时间。
    -  请求头Content-Length：告知服务器，请求中的请求正文的长度。

### HTTP响应 ###
　　服务器接收到客户端的请求后，会将用户请求的数据，以一个回应(`response`)的方式返回给客户端。一个完整的HTTP回应包括如下内容：

    -  一个响应行。
    -  若干响应报头。
    -  一个空白行(起到间隔作用)。
    -  响应正文。

<br>**响应行**
　　响应行由三部分组成：协议及版本号，响应码，响应信息。

<br>　　范例1：响应行。
```
HTTP/1.1  200  OK
```
　　响应码用于表示服务器对请求的处理结果。常见的HTTP响应码有：
```
状态码                                   表示的含义
100～199                        表示成功接收请求，要求客户端继续提交下一次请求才能完成整个处理过程。
200～299                        表示成功接收请求并已完成整个处理过程，常用200 。
300～399                        重定向，客户需进一步细化请求。例如，请求的资源已经移动一个新地址，常用302、304。
400～499                        客户机中出现的错误
                                403 服务器收到请求，但是拒绝提供服务
                                404 服务器找不到客户端请求的资源
500～599                        服务器中出现的错误
                                500 服务器内部错误 —— 因为意外情况，服务器不能完成请求。
```

　　提示：响应码为`200`，则意味着请求被处理完成，客户端请求的数据被完整的返回。关于响应码的详细描述，请参看：[HTTP状态码_百度百科](http://baike.baidu.com/view/1790469.htm)。

<br>**响应报头**
　　响应报头允许服务器传递不能放在响应行中的附加响应信息，以及关于服务器的信息和对`Request-URI`所标识的资源进行下一步访问的信息。

<br>　　范例1：响应头中的常见信息。
```
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 10
Date: Sun, 21 Aug 2011 13:32:33 GMT
Location: http://www.baidu.com
Content-Encoding: gzip 
Content-Type: text/html;charset=gbk
Refresh: 1;url=http://www.qq.com
Content-Disposition: attachment; filename=aaa.zip
Expires: -1
Cache-Control: no-cache  
Pragma: no-cache   
Connection: close/Keep-Alive   

Hi Tomcat!
```
    语句解释：
    -  响应头Server：包含了服务器用来处理请求的软件信息。与 User-Agent 请求报头域是相对应的。
    -  响应头Content-Length：指出返回的“回应正文”的长度。
    -  响应头Date：服务器回应的时间，和咱们东八区有8个小时的时差。
    -  响应头Location：告知客户端浏览器，需要将浏览器窗口重定位到其指向的页面中。只有响应码为302时，浏览器才会执行重定位。
    -  响应头Content-Encoding：告知客户端浏览器，数据(回应正文)的压缩格式。
    -  响应头Content-Type：告知浏览器，服务器返回给浏览器的数据，是什么格式的。即MIME类型。
    -  响应头Refresh：告知浏览器，定时刷新页面。
    -  响应头Expires、Cache-Control、Pragma：都是用来告知浏览器不要缓存资源数据。由于浏览器的种类繁多，所以有3种头信息。

## HttpURLConnection ##
<br>　　范例1：发送GET请求。
``` java
public boolean sendGet() throws Exception{
    boolean mark = false;
    // 根据一个String来构造一个URL对象。
    // URLEncoder.encode()方法用来将给定字符串s按照指定编码enc的方式进行编码。
    URL url = new URL("http://192.168.1.108/Picture/PersonServlet?name="+URLEncoder.encode("张三","GBK"));
    // 返回一个 URLConnection 对象，它表示URL 所引用的远程对象的连接。通过这个连接，可以获取远程对象的IO流。
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    // 设置超时的时间。当程序请求访问当前URLConnection指向的资源时，若服务器端在timeout毫秒内没有响应程序的请求
    // 则程序会抛java.net.SocketTimeoutException异常。
    // 设置为0则意味着无限等待，即没有超时时限。默认值也为0 。
    // 设置为负数，则此方法将抛IllegalArgumentException异常。
    conn.setConnectTimeout(5000);
    // 设置当前HttpURLConnection对象向服务器端发送请求时，所使用的请求方式。默认为GET。注意：请求的方式要使用大写字母 。
    conn.setRequestMethod("GET");
    if( conn.getResponseCode() == 200){
        mark = true;
    }
    return mark;
}
```
    语句解释：
    -  使用GET方式提交数据时，若需要传递中文，则可以使用URLEcoder类对汉字进行编码。

<br>　　范例2：Post请求。
``` java
public void sendPost()throws Exception{
    StringBuilder sb = new StringBuilder();
    sb.append("name=").append("张三").append("&");
    sb.append("age=").append("30"); 
    
    URL url = new URL("http://192.168.0.101/Picture/2.jsp");
    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    conn.setConnectTimeout(5000);
    conn.setRequestMethod("POST");// 设置请求方式为post。
    
    // 设置数据。
    byte[] array = sb.toString().getBytes();
    // 设置允许程序通过conn向服务器写数据。默认是不允许的。
    conn.setDoOutput(true);
    // 将数据写入内存。
    OutputStream out = conn.getOutputStream();
    out.write(array);
    // 发送数据，并获得服务器端的响应。
    if(conn.getResponseCode() == 200){
        // Do something
    }
    out.close();
}
```
    语句解释：
    -  默认情况下，当调用服务器端输出流的write方法写数据时，数据将被写入内存(HttpURLConnection对象)中，而不会发送到服务器端。 只有调用了HttpURLConnection类的getResponseCode、getResponseMessage等方法请求获取服务器端的响应时，数据才会被发送到服务器端。

<br>　　扩展：断点下载。

    -  向服务器发送请求时，需要设定如下头字段：
       -  conn.setRequestProperty("range", "bytes="+start+"-"+end);
       -  其中start和end就是需要请求下载数据的范围。


## HttpClient ##

### 简介 ###
　　`java.net`包中已经提供了访问网络资源所需要使用的API（如`HttpURLConnection`等），但是对于一些应用程序来说，它的功能还不够丰富和灵活，实现稍微复杂点业务时比较难（比如文件上传）。

<br>**是什么?**
　　`HttpClient`是`Apache Jakarta Common`下的子项目，用来提供高效的、最新的、功能丰富的支持HTTP协议的客户端编程工具包，简单地说它就是用来接收和发送HTTP消息的。

　　下载地址为：http://hc.apache.org/downloads.cgi （本文基于`4.1.2`版本）。

　　`HttpClient`不是一个浏览器，它不会去缓存内容、执行嵌入在HTML页面中的`javascript`代码。

<br>**核心接口**
　　在`HttpClient`框架中最核心的一个接口就是`HttpClient`接口，使用它的实例可以向服务器端发送请求。

<br>　　范例1：`HttpClient`接口。
``` java
public interface HttpClient {
    // 使用当前HttpClient对象，发送一个HTTP请求，并将返回值封装成一个HttpResponse对象。
    public abstract HttpResponse execute(HttpUriRequest request)
}
```
    语句解释：
    -  前面说了，基于HTTP协议发送请求有多种不同的请求方式（如Get、Post等）。
    -  这些请求方式在HttpClient框架中也被封装成了具体的类。如：HttpGet类、HttpPost等类。

<br>　　`HttpClient`会将服务器返回的数据封装成一个`HttpResonse`对象，客户端通过该对象提供的方法查看响应的内容。

<br>　　范例2：`HttpResponse`接口。
``` java
public interface HttpResponse extends HttpMessage {
    // 返回服务器端返回的响应的正文数据。若没有响应则返回null。
    public abstract HttpEntity getEntity()

    // 返回服务器端返回的响应的响应行。
    public abstract StatusLine getStatusLine()
}
```

### 请求 ###
　　`DefaultHttpClient`类是`HttpClient`接口的具体实现类，我们用它来与服务器进行交互。

<br>　　范例1：发送Get请求。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        // 指定当前请求对象所要请求的位置，构造一个HttpGet对象。
        // uri的格式为：协议名、主机名、端口、资源的路径、请求参数，其中前两者是必须要提供的。
        HttpGet httpget = new HttpGet("http://www.baidu.com");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭HttpClient的连接管理器，并释放已经分配的资源。
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  默认情况下，若服务器端一直无响应，则HttpClient是会永远等待下去。

<br>　　范例2：拼接URI。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        // 依据指定参数创建一个URI对象。
        // 参数依次为：scheme 协议名、host主机名、port端口、path请求路径、query请求参数。
        URI uri = URIUtils.createURI("http","localhost",-1,"/Server", "name=cxy",null);
        HttpGet httpget = new HttpGet(uri);
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  使用HttpClient提供的URIUtils类可以动态的组装出一个URI。
       -  若端口号≤0 ，则默认访问服务器的80端口。
       -  在第一个请求参数前面一定不要加“?”号，请求参数之间使用“&”间隔。
    -  URIUtils类会使用UTF-8编码来创建出一个URI对象，请求参数的值可以包含中文，在服务器端使用UTF-8进行解码即可，但是请求参数的值不可以包含空格。
       -  因为使用UTF-8编码时，空格会被转换为“+”号。
    -  使用HttpRequestBase类定义的getURI方法可以获取当前请求路径，HttpPost和HttpGet都是HttpRequestBase的子类。

<br>　　若想在请求参数的值中包含空格等字符，也可以使用如下两个类：

    -  NameValuePair：请求中的每个参数都被看作成一个名值对（key=value），使用一个NameValuePair实例来表示。
    -  URLEncodedUtils：将一个List<NameValuePair>按照指定的编码转换成字符串的形式。

<br>　　范例3：发送Get请求。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
        params.add(new BasicNameValuePair("name","张   三"));
        params.add(new BasicNameValuePair("age","29"));
        HttpGet httpget = new HttpGet("http://localhost/Server?"+URLEncodedUtils.format(params, "utf-8"));
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  此时可以在请求参数的值中包含空格字符。

<br>　　范例4：设置请求头。
``` java
HttpGet get = new HttpGet(URI.create("http://192.168.0.110/Service/index.jsp"));
get.addHeader("Content-Length", "1011");
get.addHeader("cxy","tsx");
client1.execute(get);
```
    语句解释：
    -  在服务器端就可以获取此时设置的请求头。

<br>　　范例5：发送表单实体。
``` java
public void test() {
    HttpClient client = new DefaultHttpClient();
    HttpPost httppost = new HttpPost("http://localhost/Server/index.jsp");
    // 创建请求参数。
    List<NameValuePair> params = new ArrayList<NameValuePair>();
    params.add(new BasicNameValuePair("name", "张 三 啊"));
    params.add(new BasicNameValuePair("age", "422"));
    // 创建表单实体
    UrlEncodedFormEntity form = new UrlEncodedFormEntity(params,"utf-8");
    httppost.setEntity(form);
    // 发送请求。
    HttpResponse response = client.execute(httppost);
    client.getConnectionManager().shutdown();
}
```
    语句解释：
    -  若需要使用post方式发送一些字符串类型的请求参数，可以使用此种方式。

<br>　　范例6：字符串参数。
``` java
public viod text() {
    HttpClient client = new DefaultHttpClient();
    HttpPost httppost = new HttpPost("http://localhost/Server/index.jsp");
    // 在发送Post请求时，若请求正文中需要包含多媒体类型的数据，则可以使用MultipartEntity类。
    MultipartEntity entity = new MultipartEntity();
    StringBody body = new StringBody("cxy");
    entity.addPart("name",body);
    httppost.setEntity(entity);
    // 发送请求。
    HttpResponse response = client.execute(httppost);
    client.getConnectionManager().shutdown();
}
```
    语句解释：
    -  MultipartEntity类代表一个多媒体表单，它会在请求中加上一个相当于HTML中的form的enctype="multipart/form-data"属性，在服务器端获取请求中的参数时，要注意一下。
    -  ContentBody常用的子类还有：FileBody、ByteArrayBody、InputStreamBody，如果决定这些子类提供的功能扔不够用，也可以自定义。

### 响应 ###
　　在`HttpClient`中使用`HttpResponse`类表示服务器对客户端的响应。

<br>　　范例1：获取响应中的数据。
``` java
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    System.out.println(response.getStatusLine().getStatusCode());// 响应码
    System.out.println(response.getStatusLine().getReasonPhrase());// 响应信息
    System.out.println(response.getStatusLine().getProtocolVersion());//协议版本号
}
```
    语句解释：
    -  程序输出：200 OK HTTP/1.1。

<br>　　范例2：响应头字段。
``` java
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    Header[] heads = response.getAllHeaders();
    for(Header head:heads){
        System.out.println(head.getName()+" = "+head.getValue());
    }
}
```

<br>　　范例3：迭代器遍历。
``` java
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    HeaderIterator iterator = response.headerIterator();
    while(iterator.hasNext()){
        Header item = iterator.nextHeader();
        System.out.println(item.getName()+" = "+item.getValue());
    }
}
```
    语句解释：
    -  方法headerIterator是从其父接口HttpMessage中继承而来。
    -  在HttpResponse对象中可能返回多个具有相同name的头信息。此时可以使用HttpResponse类提供的getFirstHeader(name)和getLastHeader(name)来分别获取第一个和最后一个头信息。

<br>　　范例4：获取响应正文。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpGet get = new HttpGet(URI.create("http://www.baidu.com"));
        HttpResponse response = client.execute(get);
        HttpEntity entity = response.getEntity();
        
        System.out.println(entity.getContentEncoding());
        System.out.println(entity.getContentType());
        System.out.println(entity.getContentLength());
        System.out.println(EntityUtils.toString(entity,"UTF-8"));
        entity.consumeContent();
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  使用EntityUtils类中的toString()方法，可以将HttpEntity中的数据转换成指定编码格式的文本。
    -  当响应实体使用完毕后，应该立刻将其与服务器端的连接断开。使用HttpEntity类的consumeContent方法回收实体所占有的资源。
    -  注意：若HttpEntity中的数据量很多，则不要使用EntityUtils类。

### 其它 ###

<br>　　范例1：设置超时时间。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpParams params = client.getParams();
        // 设置连接超时时间。
        params.setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT,1000);
        // 设置连接成功后，读取数据超时时间。
        params.setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 1000);
        HttpGet httpget = new HttpGet("http://www.apache.org");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭连接。
        client.getConnectionManager().shutdown();
    }
}
```

<br>　　范例2：设置缓冲区大小。
``` java
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpParams params = client.getParams();
        params.setIntParameter(CoreConnectionPNames.SOCKET_BUFFER_SIZE,1);
        HttpGet httpget = new HttpGet("http://www.apache.org");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭连接。
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  HttpClient的默认缓冲区是8k ，当数据存满时HttpClient会自动将数据发送出去。

<br>　　默认情况下，HttpClient 会试图自动从 I/O 异常中恢复：
 
    -  HttpClient 不会从任意逻辑或 HTTP 协议错误（那些是从 HttpException 类中派生出的）中恢复的。 
    -  HttpClient 将会自动重新执行那些假设是幂等的方法。 
    -  HttpClient 将会自动重新执行那些由于运输异常失败，而 HTTP 请求仍然被传送到目标服务器（也就是请求没有完全被送到服务器）失败的方法。
    -  HttpClient 将会自动重新执行那些已经完全被送到服务器，但是服务器使用 HTTP 状态码（服务器仅仅丢掉连接而不会发回任何东西）响应时失败的方法。在这种情况下，假设请求没有被服务器处理，而应用程序的状态也没有改变。如果这个假设可能对于你应用程序的目标 Web 服务器来说不正确，那么就强烈建议提供一个自定义的异常处理器。

<br>　　范例3：请求重试。
``` java
private void setRetryTimes(DefaultHttpClient httpclient) {
    HttpRequestRetryHandler myRetryHandler = new HttpRequestRetryHandler() {
        public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
            if (executionCount >= 5) {
                return false;
            }
            if (exception instanceof NoHttpResponseException) {
                return true;
            }
            if (exception instanceof SSLHandshakeException) {
                return false;
            }
            HttpRequest request = (HttpRequest) context.getAttribute(ExecutionContext.HTTP_REQUEST);
            boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);
            if (idempotent) {
                return true;
            }
            return false;
        }
    };
    httpclient.setHttpRequestRetryHandler(myRetryHandler);
}
```
    语句解释：
    -  若是没有设置请求重试处理器，且发生了上述之一的情形，则HttpClient会不断的自动重新请求。因此强烈建议提供一个自定义的异常处理器。


## WebService（已过时、了解即可） ##
　　`WebService`相当于一个部署在服务器上的公共接口，它接收用户的请求，并返回相应的数据。它主要为用户提供一些方便、实用的服务。 如：电话归属地查询、QQ在线状态查询等。
　　常用的Webservice站点有：[WebXml](http://www.webxml.com.cn/zh_cn/index.aspx) 。 

　　问题：如何调用Webservice呢?

    -  Webservice是基于HTTP协议和XML文件的，由于这二者是跨平台的，因此在任何语言中都可以使用Webservice技术。
    -  在客户端程序中只需要向Webservice所在的服务器发送一个http请求即可实现Webservice的调用。
       -  调用Webservice有两种方式：通过HTTP协议和通过SOAP协议。
       -  调用Webservice后，Webservice会将结果以XML文件的形式返回给用户。 

### HTTP协议 ###
　　下面将以`“电话号码归属地查询”`为例，讲述如何通过HTTP方式调用Webservice。

<br>　　范例1：准备工作。

    -  首先，打开http://www.webxml.com.cn/zh_cn/index.aspx页面。
    -  然后，找到“国内手机号码归属地查询WEB服务”。
    -  最后，点击“getMobileCodeInfo”，通过此接口可以获取国内手机号码归属地省份、地区和手机卡类型信息。

<br>　　范例2：阅读发送规范。
``` c
POST /WebServices/MobileCodeWS.asmx/getMobileCodeInfo HTTP/1.1
Host: webservice.webxml.com.cn
Content-Type: application/x-www-form-urlencoded
Content-Length: length

mobileCode=string&userID=string
```
    语句解释：
    -  接收用户请求的地址为：/WebServices/MobileCodeWS.asmx/getMobileCodeInfo 。
    -  头字段Content-Type：指出客户所发送的数据的MIME类型 ，属性值固定。
    -  头字段Content-Length：指出客户所发送的数据长度，属性值由客户设置。  
    -  消息正文中的mobileCode属性：指出要查询的手机号 。
    -  消息正文中的userID属性：指出客户在webservice.webxml.com.cn网站上注册的ID 。
       -  若为userID属性指定了值，则查询出来的数据会很详细，但是需要收费。否则仅会查询出基本的数据。通常不会为userID属性赋值。

　　通过阅读上述规范得知`“国内手机号码归属地查询WEB服务”`，客户端应该将请求发送到：
``` c
    http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo
```

<br>　　范例3：POST请求。
``` java
public static void sendXMLPOST()throws Exception{
    URL url = new URL("http://webservice.webxml.com.cn" + "/WebServices/MobileCodeWS.asmx/getMobileCodeInfo");  
    String xml = "mobileCode=13412345678&userID="; 
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
    conn.setRequestProperty("Content-Length", String.valueOf(xml.getBytes().length));
    conn.setDoOutput(true);
    // 获取连接的输出流。
    OutputStream out = conn.getOutputStream();
    out.write(xml.getBytes("UTF-8"));
    // 向服务器端发送请求。
    if(conn.getResponseCode() == 200){
        // 调用自定义的readSendXML方法将服务器端返回的xml文件中包含的信息解析出来。
        InputStream input = conn.getInputStream();
        System.out.println(this.readSendXML(input));
        input.close();
    }
    out.close();
    conn.disconnect();
}
```
    语句解释：
    -  若没有userID，则可以不为其指定值，但是在请求的时候必须要写上它。

<br>　　范例4：GET请求。
``` java
public static void sendXMLGET()throws Exception{
    URL url = new URL("http://webservice.webxml.com.cn" +"/WebServices/MobileCodeWS.asmx/getMobileCodeInfo?mobileCode=13412345678&userID="); 
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    if(conn.getResponseCode() == 200){
        InputStream input = conn.getInputStream();
        System.out.println(readSendXML(input));
        input.close();
    }
    conn.disconnect();
}
```
    语句解释：
    -  服务器端返回的数据是一个XML文件，使用dom、sax、pull等方式可以对其进行解析。

### SOAP协议 ###
　　在传统的方式中，客户端与服务器端数据交换的格式为：`属性名1=属性值1&属性名2=属性值2`。

　　而在`Webservice`技术中，客户端和服务器端收发请求时都需要将数据封装成`SOAP消息`再传递。 

<br>　　问题：怎么构建一个SOAP消息?

    -  使用xml文件来构建SOAP消息。

<br>
#### XML调用 ####
　　使用SOAP协议发送请求时，需要按照如下代码列出的数据，向服务器发送数据。

<br>　　范例1：阅读发送规范。
``` xml
POST /WebServices/MobileCodeWS.asmx HTTP/1.1
Host: webservice.webxml.com.cn
Content-Type: application/soap+xml; charset=utf-8
Content-Length: length

<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <getMobileCodeInfo xmlns="http://WebXml.com.cn/">
      <mobileCode>string</mobileCode>
      <userID>string</userID>
    </getMobileCodeInfo>
  </soap12:Body>
</soap12:Envelope>
```
    语句解释：
    -  SOAP协议有两个版本：SOAP1.1和SOAP1.2，本范例是SOAP1.2的规范。
    -  本范例中的xml文件就是一个SOAP消息，SOAP消息的语法规则：
       -  SOAP 消息的根节点必须是Envelope 。
       -  SOAP 消息中必须要存在一个节点Body 。Body节点内列出要当前消息要访问服务器端的webservice中的哪个方法以及传递给该方法的参数。 
    -  本范例中，将调用服务器端webservice的getMobileCodeInfo方法，该方法接收两个参数mobileCode和userID 。

<br>　　范例2：创建SOAP消息。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <getMobileCodeInfo xmlns="http://WebXml.com.cn/">
      <mobileCode>13412345678</mobileCode>
      <userID></userID>
    </getMobileCodeInfo>
  </soap12:Body>
</soap12:Envelope>
```
    语句解释：
    -  若不需要为<userID>传递值，则可以不写。但是标签<userID>必须要写上。

<br>　　范例3：发送消息。
``` java
public static void sendXML(String xml)throws Exception {
    // 核心代码如下。
    URL url = new URL("http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setConnectTimeout(4000);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/soap+xml; charset=utf-8");
    conn.setRequestProperty("Content-Length",xml.getBytes().length+"");
    conn.setDoOutput(true);

    OutputStream out = conn.getOutputStream();
    out.write(xml.getBytes("UTF-8"));
    // 其它代码省写 ... 
}
```
    语句解释：
    -  注意：“国内手机号码归属地查询WEB服务”中soap协议与http协议数据提交的目的地是不一样的。

<br>
#### WSDL调用 ####
　　通过发送SOAP消息的方式访问Webservice时，通信双方都需要对SOAP消息进行解析。
　　但有些Webservice返回的SOAP消息包含的数据很多，解析起来很麻烦，因此也会使用`WSDL方式`来发送SOAP消息，这样客户端开发人员就不需要编写解析SOAP消息的代码了。
<br>　　`WSDL(Web Service Description Language)`

    -  它是一个用来描述Webservice的语言，这门语言使用的是xml语言的语法规则。
       -  WSDL描述了Webservice内部提供的各个接口所用到的数据类型(如每个接口的形参的类型、返回值的类型)、以及接口的名称等信息，它更像一本关于Webservice的说明书。 
    -  通过阅读某个Webservice的WSDL文件，可以知道该Webservice提供了哪些接口。

<br>　　范例1：使用WSDL发送SOAP消息的具体流程。

    -  首先，客户端向服务器端发送请求，获取某个Webservice的WSDL文件。
    -  然后，客户端依据WSDL文件的内容，发送SOAP消息。
    -  最后，该Webservice接到SOAP消息后，会解析SOAP消息，根据消息中的信息做出相应的操作，并将操作的结果封装成SOAP消息，返回给客户端。 

　　下面将以`“2400多个城市天气预报Web服务”`为例，讲述如何通WSDL方式调用Webservice。

<br>　　范例2：下载WSDL文件。

    -  首先，打开http://webservice.webxml.com.cn页面。
    -  然后，找到“2400多个城市天气预报Web服务”。 
    -  接着，找到“服务说明”，然后点击去。然后将该xml文件另存为到本地，名为test.xml。
    -  然后，使用JDK提供的“wsimport”工具，生成此wsdl所描述的api的源代码。
    -  最后，使用生成的源代码调用Webservice即可。

<br>　　范例3：wsimport工具。
```
wsimport -s . test.xml
```
    语句解释：
    -  含义为：解析test.xml文件，并将生成的.java和.class文件放到当前目录下面。
    -  提示：若解析的时候报错，则将wsdl文件中导致报错的那行代码给删掉即可。
    -  wsimport.exe位于JAVA_HOME\bin目录下.
    -  常用参数为：
       -  “-d  <目录>”            将生成.class文件，放于指定的目录下。默认参数。
       -  “-s  <目录>”            将生成.java文件和.class文件，放于指定的目录下。
       -  “-p  <生成的新包名>”     将生成的类，放于指定的包下。

<br>　　范例4：查询天气。
``` java
public class Test {
    public static void main(String[] args){
        WeatherWS service = new WeatherWS();
        WeatherWSSoap soap = service.getWeatherWSSoap();
        // 获取中国的所有省、直辖市、地区的编号。
        ArrayOfString provinceList = soap.getRegionProvince();
        // 依次遍历每一个城市。
        for(String province : provinceList.getString()){
            System.out.println(province);// 得出山东的代号为3119 。
        }
        // 查询出山东省下面的所有市、区。
        ArrayOfString cityList = soap.getSupportCityString("3119");
        for(String city : cityList.getString()){
            System.out.println(city); // 获取到台儿庄的编号为1869。 
        }
        // 查询出台儿庄的天气。
        ArrayOfString skyInfo = soap.getWeather("1869", null);
        for(String sky : skyInfo.getString()){
            System.out.println("☆☆☆☆ "+sky);
        }
    }
}
```
    语句解释：
    -  在webxml.com.cn中的“2400多个城市天气预报Web服务”中提供了各个类的API，可以在线观看。
    -  通常，在wsdl文件中的“<wsdl:service name="WeatherWS">”节点的name属性的值就是Webservice所对应的主类，通过主类就可以找出调用Webservice的具体方法。
    -  提示：这些API不需要记忆，用到某个新技术时，可以看着官方提供的Demo慢慢摸索。
