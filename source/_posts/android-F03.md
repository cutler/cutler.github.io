title: 进阶篇　第三章 消息机制与线程池
date: 2015-4-29 11:41:12
categories: Android开发 - 倔强青铜
---

# 第一节 Handler #
## 概述 ##
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

## 基础应用 ##
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
	   -  若需要传递多个Object类型的数据，则可以使用Bundle对象。当然也可以仍然使用obj属性，万物皆对象嘛。

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
## ThreadLocal ##
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

## 运行原理 ##
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

## HandlerThread ##
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
                // 在主线程中发送消息给子线程。
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

# 第二节 AsyncTask #
　　本节将介绍一个开发中常用的类：`AsyncTask`。

## 基础应用 ##
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

## 运行原理 ##
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

# 第三节 线程池 #
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

<br><br>