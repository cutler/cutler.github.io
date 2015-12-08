title: 进阶篇　第四章 Android的消息机制
date: 2015-4-29 11:41:12
categories: android
---

# 第一节 概述 #

　　本章待整理，2015年12月20号之前一定搞完它。


　　Android的消息机制主要是指`Handler`的运行机制，因此本章会围绕着`Handler`的工作过程来分析消息机制。
　　整个过程主要涉及到了如下5个类：

	-  Handler、Message、MessageQueue、Looper、ThreadLocal

<br>**主线程的任务**
　　对于任何一个线程来说，同一时间只能做一件事，主线程也不例外，Android规定访问UI只能在主线程中进行，如果在其他线程中访问UI，那么程序就会抛出异常。
　　这个验证线程的操作由`ViewRootImpl`类的`checkThread`方法完成：
``` java
void checkThread() {
    if (mThread != Thread.currentThread()) {
        throw new CalledFromWrongThreadException(
                "Only the original thread that created a view hierarchy can touch its views.");
    }
}
```
　　也就是说，主线程的任务至少有两个：

	-  第一，响应用户在UI上的操作。如：响应按钮被点击、手指滑动等操作。
	-  第二，修改UI所显示的内容。
　　因此，若我们让主线程去执行上传/下载等耗时的任务，那么在任务执行完毕之前，主线程是无法响应用户的操作的，如果这个过程超过了`5`秒，则`Android`系统会弹出`ANR`对话框，询问用户是否强行关闭该应用。

<br>**Handler的作用**
　　因此，耗时操作需要在子线程中执行，但是还存在一个问题：按照Android的规定，子线程是无法修改UI的。
　　这意味着，当子线程执行完毕耗时操作后，`得想办法通知主线程一下`，然后借助主线程来修改UI。  
　　而`Handler`就可以完成子线程向父线程发送通知的需求。

<br>　　这里再延伸一点，系统为什么不允许在子线程中访问UI呢？ 

	-  这是因为Android的UI控件并不是线程安全的，如果允许在多线程中并发访问，可能会导致UI控件处于不可预知的状态。
	-  也许你会说，加上同步不就行了？ 但是加同步有两个缺点：
	   -  第一，Android控件众多，加上同步会让UI的逻辑变得复杂。
	   -  第二，过多的同步操作会降低UI的访问效率，因为锁机制会阻塞某些线程的执行。
	-  基于这两个缺点，最简单和高效的方法就是采用单线程来处理UI操作，而且对于开发者来说也不是很麻烦，只需要使用Handler切换一下线程即可。

<br>　　这里再延伸一点，并不是所有的更新UI的操作都只能在主线程中完成的。

	-  比如在子线程中可以简单的修改ProgressBar、SeekBar、ProgressDialog等控件。
	-  所谓的简单的修改，就是只能调用这些控件的某些方法（如setProgress()等），若调用其他方法，则仍然会抛异常。

# 第二节 Handler #

## 基本用法 ##
　　因为`Handler`的用法十分简单，所以笔者不打算过多介绍如何使用它，下面给出两个范例，如果不理解请自行搜索。

<br>　　范例1：发送消息。
``` android
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
``` android
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

　　`ThreadLocal`可以将一些变量存放到某个线程对象中，那么只要是这个线程能走到的地方(代码)，都可以从线程对象中获取变量的值。

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
	-  get方法也很简单，一看就明白，笔者就不多说了。

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
	-  从上面的代码可以看出来，当主线程被创建时，会同时创建一个Looper对象，并调用它的loop方法。

<br>　　总之，当`Handler`被成功创建的时候，就意味着它里面已经存在一个`Looper`对象了。

<br>**Looper对象**
<br>　　接下来咱们再来谈谈`Looper`类，`Looper`在消息机制中扮演着循环器的角色，具体来说就是：

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
``` android
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
	-  若想在子线程中创建Handler对象，则需要手工的调用Looper类的prepare方法在当前线程中创建一个Looper对象。 
	-  创建完Looper对象后，还需要调用Looper对象的loop方法来启动它本身。
	-  Looper提供了quit和quitSafely两个方法来退出loop循环，二者的区别是，quit会直接退出，quitSafely会设定一个退出标记，然后等消息队列中的所有消息都处理完毕后才安全退出。

<br>**消息的发送流程**
　　假设现在主线程中创建了一个`Handler`对象，子线程A要向主线程中的`Handler`发送消息。

<br>　　首先，子线程A通过`Handler`类发送消息：

	-  Handler类中提供的sendMessage等方法，可以将Message对象发送到MessageQueue中。
	-  当消息被发送到MessageQueue中后，子线程A就直接返回，它接着就去执行sendMessage之后的代码。
	   -  这类似于咱们去邮局寄信，当咱们把信放入信箱后，咱们就可以回去了，至于信如何被发送到目的地，咱们不需要关心。
	-  事实上，每个Message对象都有一个Handler类型的target属性，它指出由哪个Handler对象来处理当前消息对象。

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
	   -  当next方法返回Message时，Looper就会将Message发送给其target属性指向的Handler的dispatchMessage方法。
	-  当Message被处理后，Looper会执行上面第18行代码，将该Message对象的所有属性清空，并将其加入到一个回收栈中。
	   -  当Handler调用obtainXxx()方法获取Message对象时，就从回收栈顶弹出一个Message对象。
	   -  若回收栈栈中没有任何Message对象，则会new一个Message对象返回，但该Message不会被入栈。

<br>　　为什么每个`Message`对象要存在一个`target`属性呢?  

	-  父线程A中创建的Handler对象可以接收从多个子线程发送来的消息。
	-  父线程A中可以创建多Handler对象，每个Handler对象中都必须要存在一个Looper对象。 默认的情况下，多个Handler对象都会从当前线程中获取Looper对象。
	-  这意味着，在父线程A中的Looper对象的MessageQueue属性中保存的消息对象，会可能来自于多个Handler。

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

<br>　　最后，在介绍三个`Handler`类的常用方法：
``` android
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


#待整理#
　　本节将使用`AsyncTask`类来加载并显示来自网络的图片，接下来先简单的介绍一下`AsyncTask`类。

### AsyncTask基础 ###
　　`AsyncTask`与`Thread`一样，都是用来执行一些耗时的操作的类，但与传统方式不同：

	-  内部使用线程池管理线程，这样就减少了线程创建和销毁时的消耗。
	-  内部使用Handler处理线程切换，这样省去了我们自己处理的过程，代码直观、方便。

<br>　　范例1：最简单的`AsyncTask`。
``` android
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
``` android
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

<br>　　这里有一个使用`AsyncTask`和`decodeSampledBitmapFromResource()`加载大图片到`ImageView`中的例子：
``` java
public class MainActivity extends ActionBarActivity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imageView = (ImageView) findViewById(R.id.img);
        BitmapWorkerTask task = new BitmapWorkerTask(imageView);
        task.execute(R.drawable.ic_launcher);
    }

    class BitmapWorkerTask extends AsyncTask<Integer, Void, Bitmap> {
        private final WeakReference<ImageView> imageViewReference;
        private int data = 0;

        public BitmapWorkerTask(ImageView imageView) {
            imageViewReference = new WeakReference<ImageView>(imageView);
        }

        protected Bitmap doInBackground(Integer... params) {
            data = params[0];
            return decodeSampledBitmapFromResource(getResources(), data, 100, 100);
        }

        protected void onPostExecute(Bitmap bitmap) {
            if (imageViewReference != null && bitmap != null) {
                final ImageView imageView = imageViewReference.get();
                if (imageView != null) {
                    imageView.setImageBitmap(bitmap);
                }
            }
        }
    }
    // 此处省略了decodeSampledBitmapFromResource和calculateInSampleSize方法。
}
```
    语句解释：
    -  ImageView的WeakReference(弱引用)可以确保AsyncTask不会阻止ImageView和它的任何引用被垃圾回收器回收。


<br><br>