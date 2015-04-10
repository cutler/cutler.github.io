title: 媒体篇　第二章 图片
date: 2015-2-6 19:34:10
create: 2015-3-29 17:43:45
categories: Android
---

# 第一节 高效的显示图片 #
　　本章将讲解一些常用的处理和加载`Bitmap`(位图)对象到应用程序中的技巧，这些技术可以在某种程度上保持你的`UI组件`能够及时响应操作，并且避免图片超出应用的内存限制。 如果你不注意这些，那么图片就会迅速地消耗你的可利用内存，甚至于会抛出一个可怕的异常并导致应用的崩溃：
```
java.lang.OutofMemoryError: bitmap size exceeds VM budget
```

## 基本概念 ##
　　以下是在你的Android应用程序中加载位图时会遇到的一些棘手问题：

<br>　　1、 移动设备通常都只有有限的系统资源，Android设备可以为单个应用分配最小`16MB`大小的内存空间。

	-  不同的Android版本，虚拟机所分配的内存大小是不同的，在各个版本的Android兼容性定义文档(CDD)的3.7章节中，虚拟机兼容性给出了不同尺寸和密度的手机屏幕下应用程序所需的最小内存。如：
	   -  Android2.2中，对于中等或者低密度的屏幕尺寸，虚拟机必须为每个应用程序分配至少16MB的内存。
	   -  Android4.2中，内存分配的情况如下图所示。
	-  由于存在最小的内存的限制（即系统最小会分配的内存大小，同时它也是应用所能使用的最大内存），因此应用程序应当进行优化处理后再运行。注意，上述的内存值被认为是最小值，在很多设备中可能会为每个应用程序分配更多的内存。

<center>
![最小内存示意图](/img/android/android_e02_1.png)
</center>

<br>　　2、位图占据了大量的内存空间，特别是像图册这种富图像的应用。

	-  例如，Galaxy Nexus上的照相机所照的图片最大达到2592x1936像素(500万像素)。
	-  如果位图的配置使用ARGB_8888(Android 2.3的默认配置)那么加载这个图像到内存需要19MB的存储空间(2592*1936*4bytes)，直接超过了许多设备上的单应用限制。
	-  值得注意的是，图片在磁盘中占据2M的大小，并不意味着它在内存中也占据2M。图片在内存中大小的公式：分辨率*单个像素点占据的字节大小。

<br>　　3、Android中一些UI通常需要一次加载多个图片进行显示。

	-  像ListView，GridView和ViewPager等在一屏中会包含多个位图的组件，通常要求在手指滑动后马上就要在屏幕上马上显示出来。

## 加载大尺寸图片 ##
　　图像可以有各种各样的形状和大小，在很多情况下，它们的`实际尺寸往往会比UI界面的显示尺寸更大`。

	-  例如，系统的Gallery程序展示使用Android设备的摄像头拍摄的照片时，照片的分辨率往往要远高于设备的屏幕分辨率。
 
　　考虑到你所使用的内存有限，理想的情况是你只会想加载一个分辨率相对较低的图片到内存中来。低分辨率版本的图片与相应UI组件的尺寸应该是相匹配的。`一张比相应的UI组件尺寸大的高分辨率的图片并不能带给你任何可见的好处，却要占据着宝贵的内存`，以及间接导致由于动态缩放引起额外的性能开销。
　　本节将向你演示如何解码大图片，通过加载较小的图片样本以避免超出应用的内存限制。


<br>　　那么我们应该如何去将一张大图缩放成我们所需要的尺寸的样图呢?

	-  首先，需要获取图片的原始尺寸，以及UI组件的尺寸。
	-  然后，使用“图片尺寸/UI组件尺寸”来计算出两者相差的倍数n。
	-  最后，将图片缩放n倍后再加载入内存，交给UI组件显示。
　　我们可以使用`BitmapFactory`所提供的几个解码方法(`decodeByteArray()`，`decodeFile()`，`decodeResource()`等等)，来从各种渠道中创建一个`Bitmap`(位图)对象，具体使用哪个方法取决于你的图片数据来源。
<br>　　范例1：`BitmapFactory`类。
``` android
public static Bitmap decodeFile(String pathName);
public static Bitmap decodeStream(InputStream is);
public static Bitmap decodeResource(Resources res, int id);
public static Bitmap decodeByteArray(byte[] data, int offset, int length);
```

　　但是这些方法会试图按照位图的实际大小来分配内存并构造出`Bitmap`对象，这很容易导致`OutOfMemory(OOM)`异常。按照通常的思路，只有先将图片加载入内存后，我们才可以获取图片的尺寸等信息，这样一来我们好像就无法完成`“先缩放后加载”`的任务了。

　　上面列出每一个解码方法都有一个重载方法，接收`BitmapFactory.Options`类型的参数。你可以通过`BitmapFactory.Options`类指定一些解码参数，`BitmapFactory`类在解码图片的时候会依据这些参数的值做出相应的操作。如：
```
public static Bitmap decodeFile(String pathName, BitmapFactory.Options ops);
public static Bitmap decodeResource(Resources res, int id, BitmapFactory.Options ops);
public static Bitmap decodeByteArray(byte[] data, int offset, int length, BitmapFactory.Options ops);
```
　　使用这些方法解码图片的时候，若设置`BitmapFactory.Options`类的`inJustDecodeBounds`属性为`true`，则`BitmapFactory`不会加载图片的真正数据，即这些方法的返回值对象为`null`。
　　但是却会将图片的实际宽度、高度、类型设置到`outWidth`，`outHeight`和`outMimeType`属性中。 这项技术允许你在创建`Bitmap`(并分配内存)之前读取图片的尺寸和类型。

<br>　　范例2：加载图片尺寸。
``` java
public void loadSize(){
    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inJustDecodeBounds = true;
    BitmapFactory.decodeResource(getResources(), R.id.myimage, options);
    int imageHeight = options.outHeight;
    int imageWidth = options.outWidth;
    String imageType = options.outMimeType;
}
```
    语句解释：
    -  为了避免OOM错误，在解码图片之前就要检查图片的尺寸，除非你十分确信图片资源的尺寸是可预见的并且有着充裕的可用内存。

<br>　　范例3：`BitmapFactory`类常用字段。
``` android
// 图片的缩放倍数。若值>1则执行缩小操作，返回的图片是原来1/ inSampleSize 。 若值<=1则结果与1相同。
public int inSampleSize;

// 标识是否仅获取图片的尺寸信息。
// 若值为true则BitmapFactory不会加载图片，只是获取图片的尺寸信息。即后返回值为null。
public boolean inJustDecodeBounds;

// 当inJustDecodeBounds为true且图片加载完毕后，图片的宽度会保存在此变量中。
public int outWidth;

// 当inJustDecodeBounds为true且图片加载完毕后，图片的高度会保存在此变量中。
public int outHeight;
```

<br>　　现在图片的尺寸已经知道了，这些信息可以用来决定是将一个完整尺寸的图片加载到内存中，还是应该用一个图片的子样本来取代它。这里有一些可供考虑的因素：

	1、 估计加载全尺寸的图片所要消耗的内存。
	2、 在考虑应用中其他内存需求的情况下，你愿意给加载这个图片分配的内存空间。
	3、 准备加载该图像的目标ImageView或者UI组件的尺寸。
	4、 当前设备的屏幕的尺寸和密度。
　　例如，如果最终只是要在`ImageView`中显示一张`128*96px`大小的缩略图，而直接加载`1024*768px`的图片是非常不值得的。

<br>　　为了告诉解码器如何对图像进行采样，加载更小版本的图片，需要为`BitmapFactory.Options`对象中的`inSampleSize`属性设置值。
　　例如一张分辨率为`2048*1536px`的图像，假设`Bitmap`配置为`ARGB_8888`，整张图片加载的话需要`12M`。

	-  2024*1536个像素点 * 每个像素点使用4字节表示 /1024/1024 = 12MB
	-  ARGB4_8888，即每个像素中A、R、G、B的色值各使用1字节(0~255)来表示。
　　若使用`inSampleSize`值为`4`的设置来解码，产生的`Bitmap`大小约为`512*384px`。相较于完整图片占用`12M`的内存，这种方式只需`0.75M`内存。这里有一个方法用来计算基于目标高宽的`sample size`的值：

<br>　　范例4：计算`inSampleSize`。
``` android
public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
    // Raw height and width of image
    final int height = options.outHeight;
    final int width = options.outWidth;
    int inSampleSize = 1;
    if (height > reqHeight || width > reqWidth) {
        if (width > height) {
            inSampleSize = Math.round((float) height / (float) reqHeight);
        } else {
            inSampleSize = Math.round((float) width / (float) reqWidth);
        }
    }
    return inSampleSize;
}
```
    语句解释：
    -  使用2的次幂来设置inSampleSize值可以使解码器执行地更加迅速、更加高效。但是，如果你想在内存或者硬盘上缓存一个调整过大小的图片，通常还是解码到合适的图片尺寸更加节省空间。

<br>　　要使用这个方法，首先要使用`inJustDecodeBounds`为`true`来解码尺寸信息，将`options`传递过去使用新的`inSampleSize`值再次解码并且要将`inJustDecodeBounds`值设置为`false`。

<br>　　范例5：完整范例。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ImageView img = (ImageView) findViewById(R.id.img);
        Bitmap bm = decodeSampledBitmapFromResource(getResources(),R.drawable. img,200,200);
        img.setImageBitmap(bm);
    }

    public static Bitmap decodeSampledBitmapFromResource(Resources res, int resId, int reqWidth, int reqHeight){
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeResource(res, resId, options);
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeResource(res, resId, options);
    }
}
```
    语句解释：
    -  值得注意的是，ImageView在默认情况下会自动帮助我们缩放图片，从而使该图片的内容可以全部显示在ImageView中。 但是它仅仅是将显示的内容缩放了，却并不会同时将图片的容量也给缩小。
    -  本范例就是将图片的容量也一起缩小了。换句话说ImageView的缩放是在图片加载入内存之后进行的，而本范例则是在图片加载之前执行的。

## 在非UI线程处理图片 ##
　　在上一节中我们讲解了`BitmapFactory.decode*`系列方法，但如果源数据来自硬盘或者网络(或者除内存之外的来源)，是不应该在主UI线程执行的。
　　这是因为读取这样的数据所需的加载`时间是不确定的`，它依赖于多种因素(从`硬盘`或`网络的读取速度`、`图片的大小`、`CPU的功率`等等)。如果这些任务里面任何一个阻塞了UI线程，系统会将你的应用标记为未响应，并且用户可以选择关闭应用。

<br>　　本节将使用`AsyncTask`类来加载并显示`Bitmap`对象，以及处理并发问题，接下来先简单的介绍一下`AsyncTask`类。

### AsyncTask ###
　　使用传统方式，执行下载有弊端：`线程数多`、`更新UI时需要手工编写代码在子线程和主线程之间来回切换`。
　　`AsyncTask`(异步任务)，它同样是用来执行一些耗时的操作，如下载文件等。与传统方式不同，在`AsyncTask`内部封装了线程池、`Handler`等。`AsyncTask`执行任务时，会自动从线程池中取出线程，若需要更新`UI`，则可以调用`AsyncTask`内置的`Handler`。因此，使用`AsyncTask`会更方便、高效率。
　　`AsyncTask`类有效地降低了线程创建数量及限定了同时运行的线程数。若一个类继承了`AsyncTask`，则该类就成为了一个异步任务。

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
       -  首先，用户调用execute方法，启动AsyncTask 。然后在execute方法中：
          -  首先调用onPreExecute方法，执行初始化操作。
          -  然后从线程池中取出一个空闲的线程，并使用该线程调用doInBackground方法，执行耗时的操作，如文件下载等。
             -  提示：调用execute方法时设置的参数会被直接传递给doInBackground方法。
       -  当doInBackground方法执行完毕后，onPostExecute方法将被调用。onPostExecute方法的参数就是doInBackground方法的返回值。
       -  若doInBackground方法中途被终止，则同样会调用onPostExecute方法，但是方法的参数却为null 。
       -  若想更新UI控件，则可以在doInBackground方法中调用publishProgress方法向主线程中的Handler发送消息，Handler接到消息后会转调用onProgressUpdate方法来更新UI。
       -  提示：调用publishProgress方法时设置的参数将被传递给onProgressUpdate方法。

<br>　　在上面的范例中，各个方法的参数、返回值都是`Object`类型的，这对于严格控制程序有很大负面的影响。但是事实上，`AsyncTask`类是有泛型的。即`AsyncTask<Params, Progress, Result>`其中：

	-  Params：用于设置execute和doInBackground方法的参数的数据类型。
	-  Progress：用于设置onProgressUpdate和publishProgress方法的参数的数据类型。
	-  Result：用于设置onPostExecute方法的参数的数据类型和doInBackground方法的返回值类型。

<br>　　范例3：泛型。
``` android
public class MyAsyncTask extends AsyncTask<Integer,Integer,Integer> {
    protected void onPreExecute(){}
    protected void onPostExecute(Integer result){}
    protected void onProgressUpdate(Integer... values){}
    protected Integer doInBackground(Integer... params){}
}
```
<br>　　其实在Android中，很少会去直接使用`Thread`类来完成异步下载任务的。
　　若程序在运行的时候，用户切换了手机屏幕显示方式(如：将手机从竖屏转为横屏)，那么当前`Activity`会被摧毁，然后系统会再重新建立一个。 
　　这意味着，`Activity`被摧毁，但是其内的`Thread`仍然会存在。这就导致，当`Activity`被重建的时候，会再开启一个线程，此时系统中就有`2`个线程在执行相同的任务，当这两个线程都结束的时候，将导致一个任务被执行两遍。
　　解决方案：

	-  利用Activity的两个生命周期函数：onPause、onResume ，当Activit失去焦点的时候，就停止其内的线程继续运行。

　　如果想让`Thread`可以被终止，我们就得修改一下我们的`Thread`或`Runnable`类。而`AsyncTask`类已经帮我们提供了一个可以“取消当前正在执行的任务”的方法。

<br>　　范例4：cancel方法。
``` android
// 停止当前AsyncTask的执行。可以在任何时候调用此方法，调用这个方法后会导致：
// -  随后调用isCancelled()则返回true。
// -  若AsyncTask未启动，则将永远不会被启动，并会立刻调用onCancelled(Object)方法。
// -  若AsyncTask已启动，且mayInterruptIfRunning值为true，则会调用AsyncTask内线程的interrupt()方法。
//    若线程没被终止，则当线程运行完毕后，会调用onCancelled(Object)方法。
// -  不论AsyncTask是否已经启动，最终都将调用onCancelled(Object)方法，而不是onPostExecute(Object)方法。
public final boolean cancel(boolean mayInterruptIfRunning);
```

<br>
### 加载图片 ###
　　`AsyncTask`类提供了一种简单的方法，可以在后来线程处理一些事情，并将结果返回到`UI线程`。要使用它，需要创建一个继承于它的子类，并且覆写它提供的方法。
　　这里有一个使用`AsyncTask`和`decodeSampledBitmapFromResource()`加载大图片到`ImageView`中的例子。

<br>　　范例1：通过图片的资源id来加载图片。
``` android
class BitmapWorkerTask extends AsyncTask<Integer, Void, Bitmap> {
    private final WeakReference<ImageView> imageViewReference;
    private int data = 0;
    public BitmapWorkerTask(ImageView imageView) {
        imageViewReference = new WeakReference<ImageView>(imageView);
    }
    protected Bitmap doInBackground(Integer... params) {
        data = params[0];
        return decodeSampledBitmapFromResource(getResources(),data,100,100));
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
```
　　`ImageView`的`WeakReference`(弱引用)可以确保`AsyncTask`不会阻止`ImageView`和它的任何引用被垃圾回收器回收。由于不能保证在异步任务完成后`ImageView`依然存在，因此你必须在`onPostExecute()`方法中检查引用。`ImageView`可能已经不存在了，比如说，用户在任务完成前退出了当前`Activity`或者应用配置发生了变化(横屏)。

<br>　　为了异步加载`Bitmap`，我们创建一个简单的异步任务并且执行它：
``` android
public void loadBitmap(int resId, ImageView imageView) {
    BitmapWorkerTask task = new BitmapWorkerTask(imageView);
    task.execute(resId);
}
```

<br>
### 处理并发 ###
　　在`ListView`和`GridView`等控件中，与`AsyncTask`配合使用的时候会引出了另外一个问题。
　　为了提升内存效率，当用户滚动`ListView`和`GridView`等控件时候，这些控件会进行子视图的回收(主要是回收不可见的视图)。
　　因此如果我们为每个子视图都触发了一个`AsyncTask`，无法保证在任务完成的时候，该子视图还没有被回收而被用来显示另一个子视图。此外，也无法保证异步任务结束的顺序与它们开始的顺序一致。

　　解决这个问题大致的步骤为：

	-  首先，自定义一个Drawable子类，其内存储worker task的引用，以备稍后使用。
	-  然后，将自定义的Drawable设置到ImageView中，充当占位符。
	-  接着，每开启一个下载任务都会实例化自定义Drawable并设置到ImageView中。即后一次设置的Drawable会覆盖掉前一次设置的Drawable对象。
	-  最后，若当ImageView的前一个任务没有执行完成时又为其设置了第二个任务，则第一个任务完成后将不会把数据设置到ImageView中。

<br>　　范例1：自定义`Drawable`。
``` android
static class AsyncDrawable extends BitmapDrawable {
    private final WeakReference<BitmapWorkerTask> bitmapWorkerTaskReference;
    public AsyncDrawable(Resources res, Bitmap bitmap, BitmapWorkerTask bitmapWorkerTask) {
        super(res, bitmap);
        bitmapWorkerTaskReference = new WeakReference<BitmapWorkerTask>(bitmapWorkerTask);
    }
    public BitmapWorkerTask getBitmapWorkerTask() {
        return bitmapWorkerTaskReference.get();
    }
}
```
    语句解释：
    -  本类保存BitmapWorkerTask对象的若引用在后面的程序中会用到。

<br>　　在执行`BitmapWorkerTask`前，你需要创建一个`AsyncDrawable`并将之绑定到目标`ImageView`：
``` android
public void loadBitmap(int resId, ImageView imageView) {
    if (cancelPotentialWork(resId, imageView)) {
        final BitmapWorkerTask task = new BitmapWorkerTask(imageView);
        final AsyncDrawable asyncDrawable = new AsyncDrawable(getResources(), mPlaceHolderBitmap, task);
        imageView.setImageDrawable(asyncDrawable);
        task.execute(resId);
    }
}
```
    语句解释：
    -  变量mPlaceHolderBitmap是在AsyncTask加载完成之前所显示的默认图片，由您来自定义。 
    -  也就是说在本方法执行完毕后，ImageView会首先显示mPlaceHolderBitmap。

<br>　　在上面的代码示例中引用的`cancelPotentialWork`方法可以检测一个执行中的任务是否与当前这个`ImageView`有关联。如果有关联，它将通过调用`cancel()`方法试图取消之前的任务。在少数情况下，新的任务中的数据与现有的任务相匹配，因此不需要做什么。下面是`calcelPotentialWork`的具体实现：
``` android
public static boolean cancelPotentialWork(int data, ImageView imageView{
    final BitmapWorkerTask bitmapWorkerTask = getBitmapWorkerTask(imageView);
    if (bitmapWorkerTask != null) {
        final int bitmapData = bitmapWorkerTask.data;
        if (bitmapData != data) {
            bitmapWorkerTask.cancel(true);
        } else {
            return false;
        }
    }
    return true;
}

// 本方法是一个助手方法，在上面用来检索和指定ImageView相关的任务。
private static BitmapWorkerTask getBitmapWorkerTask(ImageView imageView{
   if (imageView != null) {
       final Drawable drawable = imageView.getDrawable();
       if (drawable instanceof AsyncDrawable) {
           final AsyncDrawable asyncDrawable = (AsyncDrawable) drawable;
           return asyncDrawable.getBitmapWorkerTask();
       }
    }
    return null;
}
```

<br>　　最后一步是更新`BitmapWorkerTask`中的`onPostExecute()`方法，以便检测与`ImageView`关联的任务是否被取消或者与当前任务相匹配。
``` android
class BitmapWorkerTask extends AsyncTask<Integer, Void, Bitmap> {
    // ...
    protected void onPostExecute(Bitmap bitmap) {
        if (isCancelled()) {
            bitmap = null;
        }
        if (imageViewReference != null && bitmap != null) {
            final ImageView imageView = imageViewReference.get();
            final BitmapWorkerTask bitmapWorkerTask = getBitmapWorkerTask(imageView);
            if (this == bitmapWorkerTask && imageView != null) {
                imageView.setImageBitmap(bitmap);
            }
        }
    }
}

```
    语句解释：
    -  这里的方法也适合用在ListView、GridView以及其他任何需要回收子视图的组件中。
    -  当你只需要为ImageView设置图片，调用loadBitmap就可以了。例如，在GridView中实现的方式是在Adapter的getView()方法中。

<br>**本节参考阅读：**
- [【Google官方教程】第一课：高效地加载大Bitmap(位图)](http://my.oschina.net/ryanhoo/blog/88242) 

# 第二节 EXIF #

<br>**简介**
　　`EXIF`( `Exchangeable image file format`，可交换图像文件) 是专门为数码相机的照片设定的，可以记录数码照片的属性信息和拍摄数据。
　　`EXIF`最初由小日本电子工业发展协会在`1996`年制定版本为`1.0`。`1998`年升级到`2.1`，增加了对音频文件的支持。`2002`年`3`月发表了`2.2`版。
　　`EXIF`数据可以附加于`JPEG`、`TIFF`、`RIFF`等文件之中，为其增加有关数码相机拍摄信息的内容和索引图或图像处理软件的版本信息。以`Windows 7`操作系统为例，最简单的查看`EXIF`信息的方法是右键点击图片打开菜单，点击属性并切换到详细信息标签下即可。

<br>　　以下列出了几项EXIF会提供的讯息：
```
项目                                   资讯
制造厂商                               Canon	                         
影像方向                               正常（upper-left）              
影像分辨率Y                            300 分辨率单位 dpi
相机型号                               Canon EOS-1Ds Mark III
影像分辨率 X                           300
Software                              Adobe Photoshop CS Macintosh
最后异动时间                           2005:10:06 12:53:19
YCbCrPositioning                      2
闪光灯                                 关闭
影像拍摄时间                           2005:09:25 15:00:18	
影像色域空间                           sRGB
影像尺寸 X                            5616 pixel	
影像尺寸 Y                            3744 pixel
```

<br>　　`EXIF`信息是`可以被任意编辑`的，因此只有参考的功能，不能完全相信。
　　`EXIF`信息以`0xFFE1`作为开头标记，后两个字节表示`EXIF`信息的长度。所以`EXIF`信息最大为`64 kB`，而内部采用`TIFF`格式。

<br>**Android支持**
　　从`Android 2.0`开始新增了`ExifInterface`类。
　　此类主要描述多媒体文件比如`JPG`格式图片的`EXIF`信息，比如拍照的设备厂商，当时的日期时间，曝光时间等。该类需要调用`API Level`至少为`5`即`Android 2.0`。

<br>　　范例1：`ExifInterface`类 。
``` android
// 获取和设置一个String类型的EXIF信息。 本类还提供了支持设置int、double类型。
public String getAttribute(String tag);
public void setAttribute(String tag, String value);

// 保存标记数据到JPEG文件，此方法很消耗性能。
// 因为它会将当前所有的属性与图片的具体内容组合起来创造一个新图片，然后再删除旧图片，并重命名新图片。
// 因此最好设置完所有属性后，只调用一次本方法，而不是为每个属性都调用。
public void saveAttributes();

// 获取缩略图。
public byte[] getThumbnail();
```

<br>　　范例2：常用的`Exif`信息。
``` android
ExifInterface.TAG_DATETIME     // 拍照日期。
ExifInterface.TAG_IMAGE_LENGTH  // 图片长度。
ExifInterface.TAG_IMAGE_WIDTH   // 图片宽度。
```
    语句解释：
    -  若需要其他信息，请自行查阅API文档。

<br>**本节参考阅读：**
- [维基百科，EXIF](http://zh.wikipedia.org/wiki/EXIF) 

# 第三节 图片处理 #
　　本节将详细的讲解一些图片处理相关的知识。

## Bitmap ##
　　`位图`是我们开发中最常用的资源，毕竟一个漂亮的界面对用户是最有吸引力的，在`Android`中使用`Bitmap`类来表示位图。在第一节中我们已经介绍了如何加载一个`Bitmap`到内存中，本节将继续深入讲解`Bitmap`的其它操作。

<br>　　范例1：将`Bitmap`保存到本地。
``` android
private boolean writeBitmap(Bitmap bitmap,String name){
    // 获取一个Bitmap对象。
    try{
        FileOutputStream output = new FileOutputStream(this.getFilesDir()+"/"+name);
        // 将当前Bitmap对象写入到指定的输出流中。若写入成功则返回true 。
        if(bitmap.compress(CompressFormat.JPEG, 100, output)){
            System.out.println("OK");;
            // 释放与当前Bitmap对象所关联的系统资源。
            bitmap.recycle();
            return true;
        }
    }catch(Exception e){
        e.printStackTrace();
    }
    return false;
}
```
    语句解释：
    -  关于compress方法的两个参数：
       -  format：Bitmap对象的压缩格式。常见取值：
          -  CompressFormat.PNG 
          -  CompressFormat.JPEG
       -  quality：生成的图片的质量，最高质量为100 。若本方法生成的不会失真的PNG格式的图片，则此参数将不起作用。
    -  提示：使用此方法可以将一个Bitmap对象保存到手机中，也可以将一个JPEG格式的图片转换为PNG格式的图片，反之也可以。
    -  在使用完毕Bitmap对象后，应该调用recycle()方法将其所占据的系统资源回收掉。

<br>　　范例2：获取`View`的快照。
``` android
public void camera(){
    this.linearLayout = (LinearLayout) findViewById(R.id.layout);
    // 此方法继承自View类，用来设置当前View的缓存图像功能是否启用。
    this.linearLayout.setDrawingCacheEnabled(true);
    // 当调用getDrawingCache方法获取当前View的缓存图片时，获取到的图片的背景色默认是透明的，可以使用此方法设置缓存图片的背景色。
    this.linearLayout.setDrawingCacheBackgroundColor(Color.BLACK);
    // 将View的当前外观，截图，然后以Bitmap的形式返回。 此方法相当于为当前View照相。相片内会包含当前控件和其内部的所有子控件。
    // 提示：调用此方法前需要先调用setDrawingCacheEnabled方法，开启缓存图像的功能。
    this.writeBitmap(linearLayout.getDrawingCache(), "linear.png")
}
```
    语句解释：
    -  本范例中调用的writeBitmap()方法是一个用来将Bitmap保存到磁盘上的工具方法。
    -  getDrawingCache()方法不可以在Activity的onCreate()方法中调用。因为那时，View并没有被显示到屏幕中。

## 缩放、平移、旋转、倾斜 ##
　　在Android中，我们使用`ImageView`来显示一张图片，但是在实际开发中，需求可能并不满足于仅仅是简单显示，可能会要求能让图片随着手指的滑动来进行`缩放`、`平移`、`旋转`、`倾斜`。 本节将介绍如何通过`Matrix`类来实现这四种基本操作。

　　`Matrix`用来描述一个矩阵，矩阵就是一个`m*n`的二维数组。在图像处理方面，矩阵主要用于平面的`缩放`、`平移`、`旋转`、`倾斜`等操作。
　　`android.graphics.Matrix`类描述的是一个`3*3`的矩阵，即表示一个`3行3列`的数组。

<br>　　此时你可能会问，`Matrix`和图片的操作（缩放、旋转、移动、倾斜）有什么关系呢？
　　事实上，开发中我们可能会频繁的缩放、旋转、移动、倾斜某张图片，甚至于要执行一组操作（比如先平移，然后在旋转，接着在放大），如果每次修改都立刻作用到图片上，那么效率就会很低。 为了提高效率，并且方便的在任何时候都可以追加修改，我们想到了`Matrix`。把每次的修改（缩放、旋转、移动、倾斜）都放到一个`Matrix`对象里，当全部修改完毕后，再统一将修改后的`Matrix`对象作用到`ImageView`、`Bitmap`等对象上，然后图像就会发生变化，因此我们本节重点来介绍一下`Matrix`类的使用方法。

<br>　　在正式介绍`Matrix`之前，我们要先介绍几个与`矩阵`和`ImageView`相关的几个知识点，以减少我们之间的知识断层。
<br>
### 矩阵 ###
<br>**方阵与主对角线**
　　方阵：`行数和列数相等`的矩阵称为`方阵`。如`3*3`、`4*4`的矩阵都称为方阵，它们也被称为是`3`阶方阵、`4`阶方阵。
　　主对角线：一个`n`阶方阵的`主对角线`就是方阵内所有第`k`行`k`列元素的全体，`k=1, 2, 3… n`，即从左上到右下的一条斜线。如：

<center>
![主对角线示意图，主对角线上的元素就是：1，5，9三个。](/img/android/android_e02_2.png)
</center>

<br>**矩阵相乘**
　　矩阵相乘就是指两个矩阵进行乘法运算。矩阵相乘需要按照如下步骤：

	-  首先，只有当矩阵A的列数与矩阵B的行数相等时A×B才有意义，否则就无法相乘。
	-  然后，一个m×n的矩阵a(m,n)乘以一个n×p的矩阵b(n,p) ,会得到一个m×p的矩阵c（m,p) 。

　　假设有下面A、B两个矩阵要相乘：
```
      1  2              5  6  7
A =   3  4         B =  8  9  10
      5  6 
```
　　具体过程：

	-  首先，用A的第一行依次乘以B的每一列。
	   -  C[0][0] = 1*5 + 2*8   此时就是用A[0][0]*B[0][0]+A[0][1]*B[1][0]。
	   -  C[0][1] = 1*6 + 2*9   此时就是用A[0][0]*B[0][1]+A[0][1]*B[1][1]。
	   -  C[0][2] = 1*7 + 2*10  此时就是用A[0][0]*B[0][2]+A[0][1]*B[1][2]。
    -  然后，用A的第二行依次乘以B的每一列。
       -  C[1][0] = 3*5 + 4*8
       -  C[1][1] = 3*6 + 4*9
       -  C[1][2] = 3*7 + 4*10
    -  最后，用A的第三行依次乘以B的每一列。
       -  C[2][0] = 5*5 + 6*8
       -  C[2][1] = 5*6 + 6*9
       -  C[2][2] = 5*7 + 6*10

　　矩阵乘法的两个重要性质：
	-  矩阵乘法不满足交换律。
	   -  假设A*B可以相乘，但是交换过来后B*A两个矩阵有可能根本不能相乘。
	   -  如：A(3,2)*B(2,4)是可以的，但是B(2,4)*A(3,2)就无法相乘。
	-  矩阵乘法满足结合律。
	   -  假设有三个矩阵A、B、C，那么(AB)C和A(BC)的结果的第i行第j列上的数都等于所有A(ik)*B(kl)*C(lj)的和（枚举所有的k和l）。
<br>
**矩阵加减法**
　　在数学中，矩阵加法一般是指`两个矩阵把其相对应元素加在一起的运算`。通常的矩阵加法被定义在两个相同大小的矩阵。 如：

<center>
![](/img/android/android_e02_3.png)
</center>

　　也可以做矩阵的减法，只要其大小相同的话。`A-B`内的各元素为其相对应元素相减后的值，且此矩阵会和`A`、`B`有相同大小。例如：

<center>
![](/img/android/android_e02_4.png)
</center>

<br>
**单位矩阵**
　　在矩阵的乘法中，有一种矩阵起着特殊的作用，如同数的乘法中的1，我们称这种矩阵为`单位矩阵`。它是个方阵，除左上角到右下角的对角线(称为主对角线)上的元素均为`1`以外全都为`0`。 如下图所示：

<center>
![](/img/android/android_e02_5.png)
</center>

　　通常用字母`E`来表示单位矩阵，对于单位矩阵，有`A*E=E*A=A`。

<br>
### ImageView ###
　　这里，我们还得介绍几个`ImageView`的基本常识。

　　首先，有一点要明白，`ImageView`控件可以设置两张图片。

	-  第一张是通过ImageView的background属性设置的。
	-  第二张是通过ImageView的src属性设置的。

　　它们的区别在于，第一张图片做为控件的背景，它是固定死的，是不可以被移动的。而第二张图片则是被放置在`ImageView`控件内的，它可以在`ImageView`内部进行移动的。

<br>　　假设有如下代码：
``` xml
<ImageView
    android:layout_width="300dp"
    android:layout_height="300dp"
    android:src="@drawable/icon"
    android:scaleType="matrix" />
```
　　那么它所对应的显示效果（`在真机上运行时不会有那个灰色的部分`），如图所示：

<center>
![](/img/android/android_e02_6.png)
</center>

　　上图中的灰色部分是`ImageView`控件所占据的空间(`300*300`)。通过`src`属性所设置的图片，可以在灰色的范围内移动。

<br>　　再说说`scaleType`属性，它用来指出通过`src`属性所设置的图片，在`ImageView`中的缩放类型，常用的取值为：
``` c
fitCenter    在水平和垂直方向上按比例缩放(缩小或放大)图片的尺寸，以保证图片能完全填充ImageView的显示空间。
             图片最终会显示在ImageView的中间。此值为scaleType属性的默认值。
fitXY        在水平和垂直方向上不按比例缩放图片，使图片填充满整个ImageView。
center       将图片显示在ImageView的正中部(水平和垂直方向都居中)，但是不会缩放图片的大小。
matrix       将图片的左上角和ImageView的左上角对齐，且不缩放图像。
```

　　若想通过`Matrix`来操作`ImageView`中的图片，则就需要将`ImageView`的`scaleType`属性设置为`matrix`。
　　若想在整个屏幕范围内拖动图片，则可以在当前`Activity`中只放置一个`ImageView`控件，控件的宽高都`“match_parent”`即可。 

　　在`ImageView`类中提供了两个方法，可以获取和设置当前图片的`Matrix`对象。
``` android
// 获取当前ImageView的矩阵，返回值可能为null。
public Matrix getImageMatrix();

// 使用参数Matrix对象来更新ImageView中的Matrix对象。
public void setImageMatrix(Matrix matrix);
```

<br>
### Matrix ###
　　前面已经说了，`Matrix`类支持`4`种操作：`平移(translate)`、`缩放(rotate)`、`旋转(scale)`、`倾斜(skew)`。同时它也是一个`3*3`的矩阵，由`9`个`float`值构成。事实上这`9`个值目前只使用了`前6个`，它们各自用来记录不同的数据，如下图：

<center>
![](/img/android/android_e02_7.png)
</center>

　　图释：

	-  平移位置： 由两个值来记录，即上图中的transX和transY，它表示矩阵当前所在的位置，距离原点所在的位置，在x和y轴上的偏移量。 
	-  缩放大小： 由两个值来记录，即上图中的scaleX和scaleY，表示当前矩阵在水平方向(X轴)和垂直方向(Y轴)上放大的比例。
	-  倾斜信息： 由两个值来记录，即上图中的skewX和skewY，表示当前矩阵在水平方向(X轴)和垂直方向(Y轴)上倾斜的大小。
	-  旋转角度： 由四个值来记录，即上图中的scaleX和scaleY、skewX和skewY，即通过缩放+倾斜，我们可以实现旋转效果。

<br>　　提示：一个刚创建的`Matrix`对象其实就是一个`单位矩阵`。

<br>　　范例1：Matrix类。
```
// 构造一个Matrix对象，其实就是一个3*3的单位矩阵。
public Matrix();

// 将当前矩阵沿X轴移动dx个偏移量，沿Y轴移动dy个偏移量。
public boolean postTranslate(float dx, float dy);
```

<br>　　值得注意的是，针对每种操作，`Matrix`类各自提供了`pre`、`set`和`post`三种操作方式。其中：

	-  set用于覆盖Matrix中的值。
	-  pre：  参与运算的两个矩阵，当前矩阵做为第二个操作数，即在参数矩阵之后。
	-  post： 参与运算的两个矩阵，当前矩阵做为第一个操作数，即在参数矩阵之前。

　　因为矩阵的`乘法不满足交换律`，因此先乘、后乘必须要严格区分。但是矩阵的`加法则是满足交换律`的。


<br>　　为了后面讲解方便，我们在此先假设有如下代码：
``` xml
<ImageView
    android:id="@+id/img"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"/>
```

<br>**平移**

<br>　　范例1：平移操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 创建一个新的矩阵对象。 其实就是创建一个单位矩阵。
        Matrix m = new Matrix();
        // 将图片的左上角移动到ImageView内部的(100,100)点。
        m.setTranslate(100, 100);
        // 更新ImageView的矩阵。 必须保证ImageView的android:scaleType="matrix"，否则即使修改矩阵也没效果。
        img.setImageMatrix(m);
        // 设置ImageView要显示的位图。
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
<br>　　`Matrix`是个`3阶方阵`，其内的`9`个元素用来记录图片的不同信息，其中`m[0][2]`和`m[1][2]`的值，就是用来记录当前图片的`左上角`所在的位置相对于`(0,0)`点平移了多少位置。
　　当我们调用`Matrix`对象`A`的`setTranslate`方法时，在该方法的内部，会先创建一个新的`Matrix`对象`B`，然后再让`A`与`B`进行矩阵相乘运算。

<br>**缩放**

<br>　　范例1：缩放操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 获取ImageView的矩阵。
        Matrix m = img.getImageMatrix();
        // 让图像的宽度放大2倍，高度缩小到0.5倍
        m.setScale(2, 0.5f);
        // 更新ImageView的矩阵。
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
    }
}
```

<br>**倾斜**
　　我们这里所说的`倾斜`，其实更专业的说法是`错切变换(skew)`，在数学上又称为`Shear mapping`。它是一种比较特殊的`线性变换`，错切变换的效果就是`让所有点的x坐标(或者y坐标)保持不变，而对应的y坐标(或者x坐标)则按比例发生平移`。错切变换，属于`等面积变换`，即一个形状在错切变换的前后，其面积是相等的。

　　如下图（左）中，各点的`y`坐标保持不变，但其`x`坐标则按比例发生了平移。这种情况将`水平错切`。
　　如下图（右）中，各点的`x`坐标保持不变，但其`y`坐标则按比例发生了平移。这种情况叫`垂直错切`。

<center>
![](/img/android/android_e02_8.png)
</center>

　　简单地说，错切变幻指的是类似于四边形不稳定性那种性质，`方形变平行四边形`，任意一边都可以被拉长的过程。

<br>　　范例1：倾斜操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 获取ImageView的矩阵。
        Matrix m = img.getImageMatrix();
        // 让图像的x轴保持不变，y轴倾斜0.4 。
        m.setSkew(0, 0.4f);
        // 更新ImageView的矩阵。
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
    }
}
```


　　下图（左）是原图，（右）是图片在`y`轴上倾斜`0.4`之后的效果，倾斜的数值可以是`负数`，负数则往`逆方向`上倾斜。

<center>
![](/img/android/android_e02_9.png)
</center>

<br>**旋转**

<br>　　范例1：旋转操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 获取ImageView的矩阵。
        Matrix m = img.getImageMatrix();
        // 顺时针旋转45度。
        m.setRotate(45);
        // 更新ImageView的矩阵。
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
    }
}
```
    语句解释：
    -  让图像顺时针旋转45度，如果想逆时针旋转，则可以设为负数。

<br>**围绕一个中心点**
<br>　　除`平移`外，`旋转`、`缩放`和`倾斜`都可以`围绕一个中心点`来进行，如果不指定，在默认情况下是围绕`(0, 0)`来进行相应的变换的。 也就是说，`setRotate(45)`与`setRotate(45, 0, 0)`是等价的。

<br>　　范例1：指定旋转的中心点。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.icon);
        // 获取ImageView的矩阵。
        Matrix m = img.getImageMatrix();
        // 以图片的中心点为原点，顺时针旋转180度。
        m.setRotate(180, bitmap.getWidth()/2, bitmap.getHeight()/2);
        // 更新ImageView的矩阵。
        img.setImageMatrix(m);
        img.setImageBitmap(bitmap);
    }
}
```
    语句解释：
    -  围绕某一点进行旋转，被分成3个步骤：首先将坐标原点移至该点，然后围绕新的坐标原点进行旋转变换，再然后将坐标原点移回到原先的坐标原点。被围绕的点可以是任意取值，它不受控件大小的限制。比如我们可以围绕(1000, 1000)这个点来旋转。
    -  简单的说，可以把用来绘制图像的区域，想象成一个无限大小的画布，当执行旋转时，默认情况下是旋转画布的左上角(0, 0)，而若我们指定了一个相对的点，比如(300, 300)，那么此时将以画布的(300, 300)为中心了。

<br>**前乘与后乘** 
　　我们已经知道了，只有当矩阵`A`的列数与矩阵`B`的行数相等时`A*B`才有意义。所以用矩阵`A`乘以矩阵`B`，需要考虑是左乘（`A*B`），还是右乘（`B*A`）。
　　左乘：又称前乘，就是乘在左边(即乘号前)，比如说，矩阵`A(m,n)`左乘矩阵`B(n,p)`，会得到一个`m*p`的矩阵`C(m,p)`，写作`A*B=C`。

　　还有一点值得注意的是，假设`A`和`B`都是一个`3*3`的矩阵，那么`A*B`与`B*A`的结果也可能是不一样的。 如下图所示：

<center>
![](/img/android/android_e02_10.png)
</center>

<br>　　由于矩阵乘法不满足交换律，`Matrix`类为我们提供了类似的方法，以平移操作为例，`Matrix`类的源代码为：
``` android
    /**
     * Preconcats the matrix with the specified translation.
     * M' = M * T(dx, dy)
     */
    public boolean preTranslate(float dx, float dy) {
        return native_preTranslate(native_instance, dx, dy);
    }

    /**
     * Postconcats the matrix with the specified translation.
     * M' = T(dx, dy) * M
     */
    public boolean postTranslate(float dx, float dy) {
        return native_postTranslate(native_instance, dx, dy);
    }
```
　　通过比较，我们可以看出，`pre`其实执行的就是让`参数矩阵右乘当前矩阵`，而`post`执行的就是`让参数矩阵左乘当前矩阵`。

<br>**单次运算与单类型连乘** 

<br>　　范例1：单次运算——旋转45度。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        // 此处也可以调用postRotate()方法，并且效果相同。
        m.preRotate(45);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
    语句解释：
    -  一个新创建的Matrix对象就是一个单位矩阵。对于平移、缩放、旋转、倾斜四个操作来说，当它们与一个单位矩阵进行运算时，不论调用的是pre还是post方法，最终的效果是一样的。
    -  一旦单位矩阵执行了某种操作，那么它就不再是单位矩阵了，此时就需要区分pre和post方法的调用。

<br>　　范例2：单类型连乘——旋转45度。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        m.preRotate(15);
        m.postRotate(15);
        m.preRotate(15);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));

        // 将图片移动到ImageView内部的(100,100)点。
        // m.postTranslate(100, 100);
        // 将图片移动到ImageView内部的(110,90)点。
        // m.postTranslate(10, -10);
        // 将图片移动到ImageView内部的(100,80)点。
        // m.preTranslate(-10, -10);

        // 先缩小10倍。
        // m.postScale(0.1f, 0.1f);
        // 再放大10倍。 此时显示出来的图片尺寸就是它本身的尺寸。
        // m.preScale(10, 10);
    }
}
```
    语句解释：
    -  如果矩阵中只包含平移、选择、倾斜、缩放中的某一种类型的操作，那么我们也不需要考虑pre和post方法的区别。以平移操作为例，不论我们调用的pre还是post方法，最终产生的矩阵，除了m[0][2]和m[1][2]的值之外，其他位置的值都和单位矩阵的值一样。
    -  提示：两个单位矩阵相乘，结果仍是一个单位矩阵。

<br>　　范例3：`setXxx`方法。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        m.preRotate(45);
        m.preTranslate(100, 100);
        m.postSkew(0.2f, 0.2f);
        // 不论矩阵之前执行了什么操作，只要它调用了setXxx方法，那么就会先将矩阵重置为单位矩阵，然后再做相应的操作。
        m.setScale(2, 2);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
    语句解释：
    -  在本范例中，最终图片只会被放大到2倍，除此之外，其他什么操作都不会执行。

<br>**混合连乘** 
　　假设现在有三个变换，分别是平移变换，对应矩阵`T`，旋转变换，对应矩阵`R`，缩放变换，对应矩阵`S`，顺序是先平移，再旋转，后缩放，那么这个矩阵乘法该如何去写呢？

　　我他妈也不知道，查了好久，没人说的明白，在此先略过矩阵的混合连乘，等技术有所突破的时候再回过头来研究。

<br>**拖动ImageView里的图片** 

<br>　　范例1：移动图片。
``` android
private final class MyOnTouchListener implements OnTouchListener{
    private Matrix matrix = new Matrix();
    private float preX;
    private float preY;
    public boolean onTouch(View v, MotionEvent event) {
        switch(event.getAction()){
        case MotionEvent.ACTION_DOWN:
            preX = event.getX();  // 记录用户按下手指时的x坐标。
            preY = event.getY();  // 记录用户按下手指时的y坐标。
            break;
        case MotionEvent.ACTION_MOVE:
            float currX = event.getX();// 用户移动手指时,记录当前x坐标。
            float currY = event.getY();// 用户移动手指时,记录当前y坐标。
            float dx = currX - preX; // 用当前x坐标减去上一次的x坐标。
            float dy = currY - preY; // 用当前y坐标减去上一次的y坐标。
            // 让matrix在当前位置上,平移dx和dy个位置。
            matrix.postTranslate(dx, dy); 
            preX = currX; // 记录下当前x坐标。
            preY = currY; // 记录下当前y坐标。
            break;
        }
        //更新ImageView控件的矩阵。
        img.setImageMatrix(matrix); 
        return true;
    }
}
```
    语句解释：
    -  把这个类的对象设置到ImageView中即可。

<br>**本节参考阅读：**
- [百度文库 - Android Matrix基础+详解](http://wenku.baidu.com/view/96590cd076a20029bd642ddf.html) 
- [Android中图像变换Matrix的原理、代码验证和应用(一)](http://blog.csdn.net/pathuang68/article/details/6991867)
- [Android中关于矩阵（Matrix）前乘后乘的一些认识](http://blog.csdn.net/linmiansheng/article/details/18820599) 
- [百度百科 - 剪切变换](http://baike.baidu.com/view/2424073.htm) 
- [Android之Matrix用法](http://blog.csdn.net/yuzhiboyi/article/details/7619238)
- [Android学习记录（9）—Android之Matrix的用法](http://blog.csdn.net/loongggdroid/article/details/18706999)  
- [云算子 - 在线矩阵相乘计算器](http://www.yunsuanzi.com/matrixcomputations/solvematrixmultiplication.html)   
- [百度百科 - 矩阵乘法](http://baike.baidu.com/view/2455255.htm)  

## 图像颜色处理 ##
　　在实际应用中，我们除了会对图片进行`缩放`、`平移`、`旋转`、`倾斜`操作外，也会对图片的`显示效果`做出修改。
　　比如，我们常见的对图像进行颜色方面的处理有：`黑白老照片`、`泛黄旧照片`、`高对比度`、`低饱和度`等效果，这些处理操作在Android中都可以通过使用颜色矩阵（`ColorMatrix`）来实现。

<br>**基本概念**
　　位图是由像素（`Pixel`）组成的，`像素`是位图最小的信息单元。每个像素都具有特定的`位置`和`颜色值`，颜色值有`ARGB`四个通道，分别对应`透明度`、`红`、`绿`、`蓝`这四个通道分量。位图文件会按`从左到右`、`从上到下`的顺序来记录图像中每一个像素的信息，如：像素在屏幕上的`位置`、`颜色`等。

　　根据位深度（即每个像素点用几位二进制表示），可将位图分为`1`、`4`、`8`、`16`、`24`及`32`位图像等。每个像素使用的信息位数越多，可用的颜色就越多，颜色表现就越逼真，相应的数据量越大。例如，位深度为`1`的像素位图只有两个可能的值（黑色和白色），所以又称为二值位图。位深度为`8`的图像有`2^8`（即`256`）个可能的值。位深度为`8`的`灰度模式`图像有`256`个可能的`灰色值`。

<br>
### ColorMatrix ###
　　颜色矩阵是一个`5*4`的矩阵，用来对图片颜色值进行处理。在Android中，颜色矩阵是以`一维数组`的方式进行存储的（参见`ColorMatrix`类的源码）。

<center>
![颜色矩阵M的示意图，其中第二个括号里的值是颜色矩阵的初始值](/img/android/android_e02_11.png)
</center>

　　通过颜色矩阵，修改原图像的`RGBA`值的步骤为：

	-  首先，系统会遍历图像中的所有像素点。
	-  然后，让每个像素点的颜色值与颜色矩阵进行矩阵乘法运算。
	-  接着，将计算出来的新颜色值设置到那个像素点上。
	-  最后，当所有像素点都运算完毕后，整张图的颜色就变化完成了。

　　为了能让`像素点的色值`和`颜色矩阵`进行乘法运算，系统会先将像素点的`RGBA`值存储在一个`5*1`的分量矩阵中，然后再和颜色矩阵相乘。这意味着，我们可以`通过修改颜色矩阵的值，来控制图像最终的颜色效果`。如下图所示：

<center>
![颜色矩阵与分量矩阵相乘示意图](/img/android/android_e02_12.png)
</center>

　　通过阅读`ColorMatrix`类的源码，得知在上面说的`5*4`的颜色矩阵中，第一行参数`abcde`决定了图像的`红色`成分，第二行参数`fghij`决定了图像的`绿色`成分，第三行参数`klmno`决定了图像的`蓝色`成分，第四行参数`pqrst`决定了图像的`透明度`。并且，从上图可知，颜色矩阵的`第五列`参数`ejot`是颜色的`偏移量`，即如果只是想在像素点现有的颜色上进行微调的话，我们只需要修改`ejot`即可。

<br>　　接下来我们通过两个范例来实现下图所示的效果：

<center>
![原图（左）、变黄（中）、灰度化（右）](/img/android/android_e02_13.png)
</center>

<br>　　范例1：让图片变黄。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 创建一个新的颜色矩阵。
        ColorMatrix cm = new ColorMatrix();
        // 重新设置颜色矩阵中的值。 此处只是将R和G的偏移量设置为100。
        cm.set(new float[]{
            1, 0, 0, 0, 100,
            0, 1, 0, 0, 100,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
        });
        // 创建一个ColorMatrixColorFilter对象，用它来包装一下颜色矩阵，并将它设置到ImageView中。
        img.setColorFilter(new ColorMatrixColorFilter(cm));
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
    }
}
```
    语句解释：
    -  通过计算后可以得知该颜色矩阵的作用是使图像的红色分量和绿色分量均增加100，这样的效果就使图片泛黄（因为红色与绿色混合后得到黄色）。

<br>　　范例2：让图片灰度化。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        ColorMatrix cm = new ColorMatrix();
        // 饱和度设置为0 。
        cm.setSaturation(0);
        img.setColorFilter(new ColorMatrixColorFilter(cm));
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.icon));
    }
}
```
    语句解释：
    -  这样一来，对于被禁用的按钮所显示的图片，如果美工不给，我们也可以自己做出来了。


<br>**本节参考阅读：**
- [Android学习笔记22：图像颜色处理（ColorMatrix）](http://www.cnblogs.com/menlsh/archive/2013/02/03/2890888.html)
- [Android图片处理：颜色矩阵和坐标变换矩阵](http://ju.outofmemory.cn/entry/26741)
- [维基百科 - 位图](http://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE)
- [百度百科 - 位图图像](http://baike.baidu.com/view/80262.htm)

<br><br>
