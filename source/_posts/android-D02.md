title: 媒体篇　第二章 图片
date: 2015-3-29 17:43:45
categories: android
---

# 第一节 高效的显示图片 #
　　本节将讲解一些处理和加载`Bitmap`（位图）对象的技巧，这些技术可以在某种程度上避免图片超出应用的内存限制。 如果你不注意这些，那么图片就会迅速地消耗你的可用内存，甚至于会抛出一个可怕的异常并导致应用崩溃：
```
java.lang.OutofMemoryError: bitmap size exceeds VM budget
```

## 基本概念 ##
　　以下是在你的Android应用程序中加载位图时会遇到的一些棘手问题：

<br>　　1、 移动设备通常都只有有限的系统资源，Android设备可以为单个应用分配最小`16MB`大小的内存空间。

	-  不同的Android版本，虚拟机所分配的内存大小是不同的，在各个版本的Android兼容性定义文档(CDD)的3.7章节中，虚拟机兼容性给出了不同尺寸和密度的手机屏幕下应用程序所需的最小内存。如：
	   -  Android2.2中，对于中等或者低密度的屏幕尺寸，虚拟机必须为每个应用程序分配至少16MB的内存。
	   -  Android4.2中，内存分配的情况如下图所示。
	-  Android不光存在最小的内存的限制（即系统最小会分配的内存大小），也存在最大内存限制，因此应用程序应当进行优化处理后再运行。

<center>
![最小内存示意图](/img/android/android_e02_1.png)
</center>

　　注意：上述的内存值被认为是最小值，在很多设备中可能会为每个应用程序分配更多的内存。

<br>　　2、位图占据了大量的内存空间，特别是像图册这种富图像的应用。

	-  例如，Galaxy Nexus上的照相机所照的图片最大达到2592x1936像素(500万像素)。
	-  如果位图的配置使用ARGB_8888(Android 2.3的默认配置)那么加载这个图像到内存需要19MB的存储空间(2592*1936*4bytes)，直接超过了许多设备上的单应用限制。
	-  值得注意的是，图片在磁盘中占据2M的大小，并不意味着它在内存中也占据2M。图片在内存中大小的公式：分辨率*单个像素点占据的字节大小。

<br>　　3、`ListView`，`GridView`等在一屏中会包含多个位图的组件，通常要求在手指滑动后马上就要在屏幕上马上显示出来。

<br>　　总而言之，上面这三个问题其实就是在要求我们：

	-  在有限的内存空间里，尽可能快速且平滑的，显示更多的图片。
　　本章介绍的知识就是为了完成这个目标。

## 加载大尺寸图片 ##
　　图像会有各种各样的尺寸，在很多情况下，图片的实际尺寸往往会比UI界面的显示尺寸更大。

	-  例如，使用Android设备的摄像头拍摄的照片，照片的分辨率往往要远高于设备的屏幕分辨率。
　　考虑到手机内存有限，在需要显示图片时理想的做法是，程序会先将大分辨率的图片缩小到与UI组件相同的尺寸后，再将它加载到内存中来。因为一张比UI组件尺寸大的高分辨率的图片并不能带给你任何可见的好处，却要占据着宝贵的内存，以及间接导致由于动态缩放引起额外的性能开销。

<br>　　范例1：使用`BitmapFactory`所提供的如下几个方法，可以将图片加载到内存中。
``` java
public static Bitmap decodeFile(String pathName);
public static Bitmap decodeStream(InputStream is);
public static Bitmap decodeResource(Resources res, int id);
public static Bitmap decodeByteArray(byte[] data, int offset, int length);
```
    语句解释：
	-  这些方法会按照位图的实际大小来将位图加载到内存中，并构造出Bitmap对象。

<br>　　现在已经知道要使用哪些方法来加载图片了，但应该如何去将一张大图缩放成我们所需要的尺寸的图片呢?

	-  首先，需要获取图片的原始尺寸，以及UI组件的尺寸。
	-  然后，使用“图片尺寸/UI组件尺寸”来计算出两者相差的倍数n。
	-  最后，将图片缩放n倍后再加载入内存，交给UI组件显示。

　　按照正常的思路，如果不把图片加载到内存就无法知道尺寸，但是如果先把图片加载到内存，那还计算个蛋缩放尺寸？因为图片的尺寸过大就直接导致OOM异常了。
　　这样一看好像就无法完成`“先缩放后加载”`的任务了。

<br>　　不要慌！上面列出的方法都有一个重载方法，接收`BitmapFactory.Options`类型的参数：
``` java
public static Bitmap decodeFile(String pathName, BitmapFactory.Options ops);
public static Bitmap decodeResource(Resources res, int id, BitmapFactory.Options ops);
public static Bitmap decodeByteArray(byte[] data, int offset, int length, BitmapFactory.Options ops);
```
    语句解释：
	-  使用这些方法加载图片的时候，若设置BitmapFactory.Options类的inJustDecodeBounds属性为true，则BitmapFactory不会加载图片的真正数据，即这些方法的返回值对象为null。
	-  但是却会将图片的实际宽度、高度、类型设置到outWidth，outHeight和outMimeType属性中。
	-  这项技术允许你在创建Bitmap（并分配内存）之前读取图片的尺寸和类型。

<br>　　范例2：加载图片尺寸。
``` java
public void loadSize(){
    BitmapFactory.Options options = new BitmapFactory.Options();
    // options.inJustDecodeBounds标识是否仅获取图片的尺寸信息。
    // 若值为true则BitmapFactory不会加载图片，只是获取图片的尺寸信息。
    options.inJustDecodeBounds = true;
    BitmapFactory.decodeResource(getResources(), R.id.myimage, options);

    // 当inJustDecodeBounds为true且图片加载完毕后，图片的高度会保存在options.outHeight中。
    int imageHeight = options.outHeight;

    // 当inJustDecodeBounds为true且图片加载完毕后，图片的宽度会保存在options.outWidth中。
    int imageWidth = options.outWidth;
    String imageType = options.outMimeType;
}
```

<br>　　现在图片的尺寸已经知道了，为了告诉解码器如何对图像进行采样，加载更小版本的图片，需要为`BitmapFactory.Options`对象中的`inSampleSize`属性设置值。

	-  inSampleSize表示图片的缩放倍数。
	   -  若inSampleSize > 1则执行缩小操作，返回的图片是原来 1/inSampleSize 。
	   -  若inSampleSize <= 1则结果与1相同。

　　例如一张分辨率为`2048*1536px`的图像，假设`Bitmap`配置为`ARGB_8888`，整张图片加载的话需要`12M`。

	-  2024*1536个像素点 * 每个像素点使用4字节表示 /1024/1024 = 12MB
	-  ARGB4_8888，即每个像素中A、R、G、B的色值各使用1字节(0~255)来表示。
　　若使用`inSampleSize`值为`4`的设置来解码，产生的`Bitmap`大小约为`512*384px`，相较于完整图片占用`12M`的内存，这种方式只需`0.75M`内存。

<br>　　范例3：这里有一个方法用来计算基于目标高宽的`sample size`的值：
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
    -  使用2的次幂来设置inSampleSize值可以使解码器执行地更加迅速、更加高效。

<br>　　范例4：完整范例。
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
    -  值得注意的是，ImageView在默认情况下会自动帮助我们缩放图片，从而使该图片的内容可以全部显示在ImageView中。 
    -  但是它仅仅是将显示的内容缩放了，却并不会将图片的容量也给缩小。
    -  换句话说ImageView的缩放是在图片加载入内存之后进行的，而本范例则是在图片加载之前执行的。

## 在非UI线程处理图片 ##
　　在上一节中我们讲解了`BitmapFactory.decode*`系列方法，这些方法主要用来加载本地的图片，但如果源数据来自网络，是不应该在主线程加载的。
　　这是因为读取这样的数据所需的加载时间是不确定的，如果时间过长就会阻塞了主线程，系统会弹出`ANR`对话框。
　　本节将使用`AsyncTask`类来加载并显示来自网络的图片，如果你不会使用`AsyncTask`类，请先阅读[《进阶篇　第四章 Android的消息机制》](http://cutler.github.io/android-F04/)。

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

<br>**本节参考阅读：**
- [【Google官方教程】第一课：高效地加载大Bitmap(位图)](http://my.oschina.net/ryanhoo/blog/88242) 

# 第二节 图片的缓存 #
　　不论是Android还是iOS设备，流量对用户来说都是一种宝贵的资源，所以在开发中无能都尽可能的少消耗用户的流量，为此就需要对网络上的图片进行缓存。

　　目前比较常见的图片缓存策略是三级缓存：

	-  首先，当需要显示一张图片时，我们会从服务其端下载它，完成后将它保存到本地，以后就不用重新下载了。
	   -  此乃第三级缓存，使用DiskLruCache类实现。
	-  然后，由于将图片从磁盘读到内存也是需要时间的，所以我们会把一些频繁被使用到的图片缓存再内存中，这样能进一步减少图片加载的时间。
	   -  此乃第一级缓存，使用LruCache类实现。
	-  最后，由于内存的大小是有限制的，所以不能在内存中缓存太多图片，当内存缓存达到一定值时，就需要将一些图片从内存中删除，此时就可以把踢出的图片放入到软引用中，这样既能缓存又不阻止内存回收。
	   -  此乃第二级缓存，使用LinkedHashMap类实现。

　　当需要加载图片时，会执行如下步骤：

	-  首先，从一级缓存中查看，若找到了则直接显示，若没找到则查看二级缓存。
	-  然后，若在二级缓存中找到了，则直接显示，并将该图片从二级缓存移动到一级缓存中。
	-  接着，若在二级缓存中也没找到，则去三级缓存中找（本地磁盘），若没找到则去服务器端下载，下载完后缓存到本地。
	-  最后，若在三级缓存中找到了，则将图片读取内存显示，并放入到一级缓存中。

## LruCache ##
　　我们来看一下，实现第一级缓存所需要使用的`LruCache`类。

　　`LruCache`是Android3.1中所提供的一个工具类，通过support-v4兼容包也可以使用它。
　　`LruCache`的特点有：

	-  第一，实现原理基于LRU算法，这种算法的核心思想为：当缓存快满时，会将近期最少使用的数据从缓存中删除。
	-  第二，它内部采用LinkedHashMap以强引用的方式存储数据。

<br>　　`LruCache`的使用也很简单，这里给出一个范例：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 下面这个LruCache中保存的数据，key是String类型的，value是Integer类型的。
        // 构造方法里的数字3，表示当前LruCache的缓存容量是3。
        LruCache<String, Integer> lruCache = new LruCache<String, Integer>(3) {
            // 当需要计算某个数据所占据的大小时，此方法被调用。
            protected int sizeOf(String key, Integer value) {
                // 这里总是返回1，也就意味着当前LruCache中最多只能保存3个数字。
                return 1;
            }
        };
        // 向缓存中添加数据。
        lruCache.put("1", 100);
        lruCache.put("2", 200);
        lruCache.put("3", 300);
        // 调用get方法从lruCache中读取数据，由于没存储过4，所以会输出：null。
        System.out.println(lruCache.get("4"));

        // System.out.println(lruCache.get("1"));

        // 由于咱们这个lruCache只能保存3个数据，所以当保存第四个数的时候，就会把数字1给踢出。
        lruCache.put("4", 400);

        // 由于数字1被踢出了，所以此处会输出：null。
        System.out.println(lruCache.get("1"));

    }
}
```
    语句解释：
    -  上面之所以会踢出1，是因为在1、2、3三个数字中，1最久没被使用过。
    -  如果把上面第23行代码给解除注释，则当4被加入到缓存中时，被踢出的将是2。
    -  LruCache类还有一些有用的方法：evictAll（清空数据）、size（当前容量）、remove（删除）等等。

<br>　　`LruCache`虽然简单，但是我们不能满足于只会用它，还应该知道它的内部原理。
　　`LruCache`内部是通过`LinkedHashMap`类来实现的，既然说到了`LinkedHashMap`，下面就来介绍一下`HashMap`类。

<br>**HashMap**
　　在`Map`接口的众多子类中，比较常用的是`HashMap`类，在它的内部是使用数组来存储每一个元素的，虽然是基于数组实现，但它却可以高速存取元素。

	-  原因就是HashMap的内部在查找元素的时候，并不是从数组头部依次遍历匹配。
	-  而是依据key的hashCode值来计算出一个下标，查找时会从这个下标开始依次查找。

<br>　　范例1：`HashMap`的`get`方法。
``` java
public V put(K key, V value) {
    if (key == null) {
        return putValueForNullKey(value);
    }

    int hash = Collections.secondaryHash(key);
    HashMapEntry<K, V>[] tab = table;
    int index = hash & (tab.length - 1);
    for (HashMapEntry<K, V> e = tab[index]; e != null; e = e.next) {
        if (e.hash == hash && key.equals(e.key)) {
            preModify(e);
            V oldValue = e.value;
            e.value = value;
            return oldValue;
        }
    }

    // No entry for (non-null) key is present; create one
    modCount++;
    if (size++ > threshold) {
        tab = doubleCapacity();
        index = hash & (tab.length - 1);
    }
    addNewEntry(key, value, hash, index);
    return null;
}
```
    语句解释：
    -  在此方法中若参数key不为null，则会先计算key的hashCode码，然后从对应的位置开始依次遍历余下的元素。

<br>　　问：对象的`hashCode`码不是唯一的吗？ 为什么在得到`hashCode`码还会存在`“依次遍历余下的元素”`这个操作呢？
　　答：`hashCode`码并不是唯一的，比如下面的代码：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        HashMap<A, Integer> hashMap = new HashMap<A, Integer>();
        hashMap.put(new A(), 5);
        hashMap.put(new A(), 6);
        System.out.println(hashMap.size());   // 输出2。
    }

    class A {
        public int hashCode() {
            return 1;
        }
    }
}

```
    语句解释：
    -  也就是说，两个完全不同的对象，它们的hashCode码却可能相同。

<br>**查找算法**
　　笔者在此简单的普及一下数据结构中的`“查找”`算法的基本概念（没错，纯粹是为了装逼！）。

　　有n条记录的集合`T`是实施查找的数据基础，`T`称为“查找表”（`Search Table`）。

	-  比如在集合{1,2,3}中查找出数字2，则“集合{1,2,3}”被称为查找表。

　　常见的查找算法有`顺序查找`、`折半查找`、`索引表查找`、`二叉查找树查找`等：

	-  所谓的顺序查找，即从查找表的第一个元素开始，依次使用待查找的数字和查找表中的每一个元素进行比较，若匹配则视为查找成功。
	-  但不论是顺序查找还是折半、索引表等查找算法，它们的查找效率都与查找表的长度紧密相关，查找表的长度越短，查找的速度也就越快。查找的理想做法是不去或很少进行匹配，因此就出现了另一种高速查找的算法，哈希（也称散列）查找。
	-  哈希查找算法就是通过一个公式（被称为散列函数）来计算元素的位置，从而尽可能的减少匹配次数。
	-  HashMap、HashSet等类都是基于哈希算法的，它们之所以可以高速的定位元素的位置，就是因为它们是通过即散列函数来计算出元素的位置的。
　　散列函数通常是接受一个参数，然后依据这个参数进行计算，并产生一个输出值。如：
``` java
int fun(n){
  return 4*n;
}
```
　　但是在哈希查找中，不论散列函数设计的多么好，也难免会有冲突出现，也就是说会存在散列函数的输入参数不相同，但是散列函数依据该参数所计算出来的值却是相同的：
 
	这就像 3*4=12 与 2*6=12 是一个道理。

　　查找的时候会存在冲突，那么存储的时候必然也会存在冲突，解决冲突的方案有多种，笔者就不展开介绍了。

<br>　　说这些是为了告诉大家两个事情：

	-  第一，HashMap中的元素位置是通过计算得来的。
	-  第二，在HashMap中，可以同时存在两个Key不同，但hashCode相同的元素。
	-  第三，当想把A存入HashMap时，会先使用A的hashCode来计算它将要存储到的位置，若该位置已经有B了，但A和B的key不相同，则A会被放到HashMap的其他位置。

<br>**回到正题**
　　既然知道了`HashMap`是通过哈希算法来计算元素的存储位置，那么这意味着元素在`HashMap`中的排列顺序和插入的顺序可能不同。而当咱们需要遍历`HashMap`的时候，输出的元素的顺序就不是咱们插入的顺序了。

　　范例1：输出元素。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Map<String, String> map = new HashMap<String, String>();
        map.put("apple", "1");
        map.put("orange", "2");
        map.put("pear", "3");
        System.out.println(map.toString());   // 输出：{orange=2, apple=1, pear=3}
    }
}
```
    语句解释：
    -  本范例依次将apple、orange和pear加入到HashMap中，但是程序输出的顺序却是orange、apple和pear。
    -  正是由于Hash的这种特点会带来很多不便，于是LinkedHashMap便应运而生。

<br>**LinkedHashMap**
　　`LinkedHashMap`是`HashMap`的子类，它解决了遍历`HashMap`的无序的问题。

<br>　　范例1：顺序一致。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Map<String, String> map = new LinkedHashMap<String, String>();
        map.put("apple", "1");
        map.put("orange", "2");
        map.put("pear", "3");
        System.out.println(map.toString());  // 输出：{apple=1, orange=2, pear=3}
    }
}
```

<br>　　`LinkedHashMap`内部的链表提供了两种元素的排列方式：

	-  按照元素插入的顺序（默认）。
	-  按访元素访问的顺序。每当元素被访问（通过get、put等方法）的时候，就将元素移至链表尾部。 

<br>　　范例2：删除元素。
``` java
public class MainActivity extends ActionBarActivity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 三个参数依次为：HashMap的初始容量、加载因子、是否启用“按访元素访问的顺序”排序。
        Map<String, String> map = new LinkedHashMap<String, String>(0, 0.75f, true) {
            protected boolean removeEldestEntry(Entry<String, String> eldest) {
                // 若当前已经有4个元素了，则删除eldest。
                return size() > 3;
            }
        };
        map.put("1", "100");
        map.put("2", "200");
        map.put("3", "300");
        map.put("4", "400");
        map.put("5", "500");
        System.out.println(map.toString());  // 输出：{3=300, 4=400, 5=500}
    }
}
```
    语句解释：
    -  加载因子采用小数表示，0.75表示当Map中的数据量达到总容量的75%时，其容量空间自动扩张。
    -  每当往LinkedHashMap中添加数据时，都会导致它的removeEldestEntry方法被调用。该方法用来决定是否将参数eldest从removeEldestEntry中删除。

<br>**LruCache**
　　虽然`LinkedHashMap`已经实现`LRU`算法，但是它只能在对象的数量上做限制，而不可以在对象的大小上进行限制。

	-  如现在需要做一个Bitmap对象的缓存，限制缓存区的大小是15MB。
	-  只要所有Bitmap的容量加起来不超过15MB即可，至于Map中保存多少个Bitmap对象则不做限制。

　　而`LruCache`类则可以在对象的大小上进行限制。

<br>　　范例1：两级缓存同时使用。
``` java
public class MemoryCache {

    // 一级缓存。
    private LruCache<String, Bitmap> mL1Cache = new LruCache<String, Bitmap>(1024 * 300) {
        protected int sizeOf(String key, Bitmap value) {
            int size = 1;
            if (value != null) {
                size = value.getRowBytes() * value.getHeight();
            }
            return size;
        }
        // 每当LruCache类的put等方法被调用后，LruCache都会检查一下当前容量是否超过的最大容量。
        // 若是则entryRemoved()方法将被调用。
        protected void entryRemoved(boolean evicted, String key, Bitmap oldValue, Bitmap newValue) {
            // 当Bitmap的强引用被删除的时候，将其放入二级缓存中。
            mL2Cache.put(key, new SoftReference<Bitmap>(oldValue));
        }
    };

    // 二级缓存。
    Map<String, SoftReference<Bitmap>> 
            mL2Cache = new LinkedHashMap<String, SoftReference<Bitmap>>(0, 0.75f, true) {
        protected boolean removeEldestEntry(Map.Entry<String, SoftReference<Bitmap>> eldest) {
            // 当软引用的个数超过了5则删除表头元素。
            return size() > 5;
        }
    };

    public void put(String key, Bitmap bitmap) {
        mL1Cache.put(key, bitmap);
    }

    public Bitmap get(String key) {
        // 从一级缓存中读取数据。
        Bitmap bitmap = mL1Cache.get(key);
        if (bitmap == null) {
            // 从二级缓存中读取数据。
            bitmap = mL2Cache.get(key).get();
            if (bitmap != null) {
                // 再次将数据放入到一级缓存中。
                mL1Cache.put(key, bitmap);
            }
        }
        return bitmap;
    }
}
```
    语句解释：
    -  MemoryCache类使用两级缓存来缓存Bitmap对象。
    -  其中mL1Cache使用强引用缓存，当mL1Cache空间不足时，会将数据移到mL2Cache中。
    -  另外mL2Cache不会阻止系统回收Bitmap对象，只要Bitmap对象在外界有强引用被持有，mL2Cache中的值就不会被回收。


<br>**本节参考阅读：**
- [百度百科 - LRU](http://baike.baidu.com/view/70151.htm) 
- [LRU算法的实现](http://blog.csdn.net/Ackarlix/article/details/1759793) 

## DiskLruCache ##
　　[DiskLruCache ](https://github.com/JakeWharton/DiskLruCache)用于实现存磁盘缓存，它通过将缓存对象写入文件系统从而实现缓存的效果。网上有很多关于`DiskLruCache`教程，笔者也不打算重复造轮子，本节只给出几个简单范例。

　　推荐阅读：[《Android DiskLruCache缓存完全解析》](http://blog.csdn.net/guolin_blog/article/details/28863651)

<br>　　范例1：创建`DiskLruCache`。
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        DiskLruCache mDiskLruCache = null;
        try {
            File cacheDir = getDiskCacheDir(this, "bitmap");
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }
            // 第一个参数：表示缓存文件存放的目录。
            // 第二个参数：表示应用的版本号，一般设置为1，当版本号发生改变时，DiskLruCache会清空之前的所有缓存。
            // 第三个参数：表示单个节点所对应的数据的个数，一般设置为1。
            // 第四个参数：表示缓存的总大小，单位是字节，下面设置的是10M。
            mDiskLruCache = DiskLruCache.open(cacheDir, 1, 1, 10 * 1024 * 1024);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 获取本地缓存目录。
    public static File getDiskCacheDir(Context context, String uniqueName) {
        String cachePath = null;
        // 若SD卡已就绪，或者SD卡不可移除。
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())
                || !Environment.isExternalStorageRemovable()) {
            // 缓存路径为：/Android/data/packageName/cache
            cachePath = context.getExternalCacheDir().getPath();
        } else {
            // 缓存路径为：/data/data/packageName/cache
            cachePath = context.getCacheDir().getPath();
        }
        return new File(cachePath, uniqueName);
    }

}
```
    语句解释：
    -  SD卡上的/Android/data/packageName目录是Android推荐的App数据目录，当App被卸载时系统会自动删除该目录。
    -  当本地缓存大于指定的大小时，DiskLruCache会清除一些缓存文件，从而保证总大小不大于这个设定值。
    -  在缓存目录下会有一个名为journal文件，它是DiskLruCache的日志文件，程序对每张图片的操作记录都存放在这个文件中。

<br>　　范例2：写入缓存。
``` java
new Thread(new Runnable() {
    public void run() {
        try {
            String imageUrl = "http://img.my.csdn.net/uploads/201309/01/1378037235_7476.jpg";
            // 由于图片的url中可能存在特殊字符，所以先将url转成一个MD5字符串，作为唯一标识。
            String key = hashKeyForDisk(imageUrl);
            // DiskLruCache的缓存添加的操作需要通过Editor完成。
            // Editor表示一个缓存对象的编辑对象，如果这个缓存正在被编辑，那么edit方法会返回null。
            // 若如果当前本地不存在缓存对象，则edit方法就会返回一个新的Editor对象。
            DiskLruCache.Editor editor = mDiskLruCache.edit(key);
            if (editor != null) {
                // 由于DiskLruCache.open的第三个参数我们设置为1，因此下面的newOutputStream方法传递0。
                OutputStream outputStream = editor.newOutputStream(0);
                // 执行图片的下载。
                if (downloadUrlToStream(imageUrl, outputStream)) {
                    // 下载成功则提交。
                    editor.commit();
                } else {
                    // 下载失败则回退。
                    editor.abort();
                }
            }
            // 将数据写入到本地。
            mDiskLruCache.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}).start();
```
    语句解释：
    -  关于hashKeyForDisk和downloadUrlToStream的具体代码，请参阅上面给出的博文。


<br>　　范例3：读取缓存。
``` java
try {
    String imageUrl = "http://img.my.csdn.net/uploads/201309/01/1378037235_7476.jpg";
    // 获取url的MD5串。
    String key = hashKeyForDisk(imageUrl);
    // Snapshot表示本地缓存文件的一个快照，通过它我们可以获取缓存文件的输入流。
    DiskLruCache.Snapshot snapShot = mDiskLruCache.get(key);
    if (snapShot != null) {
        InputStream is = snapShot.getInputStream(0);
        Bitmap bitmap = BitmapFactory.decodeStream(is);
        mImage.setImageBitmap(bitmap);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```
    语句解释：
    -  如果图片的尺寸很大，则上面第9行代码，直接将它加载到内存是很危险的。
    -  此时就可以结合LruCache一节的知识，加载缩略图并将图片放到MemoryCache中，至此就实现了三级缓存的功能。

# 第三节 EXIF #

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

# 第四节 图片处理 #
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
    -  在使用完毕Bitmap对象后，应该调用recycle方法将其所占据的系统资源回收掉。

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
    -  本范例中调用的writeBitmap方法是一个用来将Bitmap保存到磁盘上的工具方法。
    -  getDrawingCache方法不可以在Activity的onCreate方法中调用。因为那时，View并没有被显示到屏幕中。

## 缩放、平移、旋转、倾斜 ##
　　在实际开发中，我们可能并不满足于仅仅使用`ImageView`显示一张图片，可能还会想对图片进行缩放、平移、旋转、倾斜，本节将介绍如何通过`android.graphics.Matrix`（矩阵）类来实现这四种基本操作。

<br>　　矩阵就是一个`m*n`（`m行n列`）的二维数组，而`Matrix`类用来描述一个`3*3`矩阵。

<br>　　此时你可能会问，`Matrix`和图片的操作（缩放、旋转、移动、倾斜）有什么关系呢？

	-  开发中我们可能会频繁的缩放、旋转、移动、倾斜图片，甚至于要执行一组操作（比如先平移，再旋转，再放大）。
	-  如果每次修改都立刻作用到图片上，那么效率就会很低。
	-  为了提高效率，并且方便的在任何时候都可以追加修改图片，我们想到了Matrix。
	-  把每次的修改（缩放、旋转、移动、倾斜）都放到一个Matrix对象里，当全部修改完毕后，再统一将修改后的Matrix对象作用到ImageView、Bitmap等对象上，以此来提高效率。

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
	-  然后，一个m×n的矩阵a(m,n)乘以一个n×p的矩阵b(n,p)，会得到一个m×p的矩阵c(m,p) 。

　　假设有下面A、B两个矩阵要相乘：
```
      1  2              5  6  7
A =   3  4         B =  8  9  10
      5  6 
```
　　具体过程：

	-  首先，用A的第一行依次乘以B的每一列。
	   -  C[0][0] = 1*5 + 2*8   也就是用A[0][0]*B[0][0]+A[0][1]*B[1][0]。
	   -  C[0][1] = 1*6 + 2*9   也就是用A[0][0]*B[0][1]+A[0][1]*B[1][1]。
	   -  C[0][2] = 1*7 + 2*10  也就是用A[0][0]*B[0][2]+A[0][1]*B[1][2]。
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
　　在矩阵的乘法中，有一种矩阵起着特殊的作用，如同数的乘法中的1，我们称这种矩阵为`单位矩阵`。它是个方阵，除左上角到右下角的对角线（称为主对角线）上的元素均为`1`以外全都为`0`。 如下图所示：

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

　　在`ImageView`类中提供了两个方法，可以获取和设置当前图片的`Matrix`对象。
``` android
// 获取当前ImageView的矩阵，返回值可能为null。
public Matrix getImageMatrix();

// 使用参数Matrix对象来更新ImageView中的Matrix对象。
public void setImageMatrix(Matrix matrix);
```

<br>
### Matrix ###
　　接下来我们开始介绍`Matrix`类的用法。

　　前面已经说了，`Matrix`类支持`4`种操作：平移(translate)、缩放(rotate)、旋转(scale)、倾斜(skew)。
　　同时它也是一个`3*3`的矩阵，由`9`个`float`值构成，事实上这`9`个值目前只使用了`前6个`，它们各自用来记录不同的数据，如下图：

<center>
![](/img/android/android_e02_7.png)
</center>

　　图释：

	-  平移位置： 由两个值来记录，即上图中的transX和transY，它表示矩阵当前所在的位置，距离原点的偏移量。 
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

	-  set：  用于覆盖Matrix中的值。
	-  pre：  参与运算的两个矩阵，当前矩阵做为第一个操作数，即在参数矩阵之前。
	-  post： 参与运算的两个矩阵，当前矩阵做为第二个操作数，即在参数矩阵之后。

　　因为矩阵的`乘法不满足交换律`，因此先乘、后乘必须要严格区分。但是矩阵的`加法则是满足交换律`的。

<br>　　范例2：平移操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        // 创建一个新的矩阵对象，其实就是创建一个单位矩阵。
        Matrix m = new Matrix();
        // 将图片的左上角移动到ImageView内部的(100,100)点。
        m.setTranslate(100, 100);
        // 更新ImageView的矩阵。 必须保证ImageView的android:scaleType="matrix"，否则即使修改矩阵也没效果。
        img.setImageMatrix(m);
    }
}
```
    语句解释：
    -  在控制台中输出m就会看到，m[0][2]和m[1][2]的值都变成100了。

<br>　　范例3：缩放操作。
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
    }
}
```
    语句解释：
    -  在控制台中输出m就会看到，m[0][0]的值变成了2，m[1][1]的值变成了0.5。

<br>　　范例4：旋转操作。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = img.getImageMatrix();
        // 顺时针旋转45度。
        m.setRotate(45);
        img.setImageMatrix(m);
    }
}
```
    语句解释：
    -  让图像顺时针旋转45度，如果想逆时针旋转，则可以设为负数。

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
        Matrix m = img.getImageMatrix();
        // 让图像的x轴保持不变，y轴倾斜0.4 。
        m.setSkew(0, 0.4f);
        img.setImageMatrix(m);
    }
}
```

　　下图（左）是原图，（右）是图片在`y`轴上倾斜`0.4`之后的效果，倾斜的数值可以是`负数`，负数则往`逆方向`上倾斜。

<center>
![](/img/android/android_e02_9.png)
</center>

<br>**围绕一个中心点**
<br>　　除`平移`外，`旋转`、`缩放`和`倾斜`都可以`围绕一个中心点`来进行，如果不指定，在默认情况下是围绕`(0, 0)`来进行相应的变换的。 也就是说，`setRotate(45)`与`setRotate(45, 0, 0)`是等价的。

<br>　　范例1：指定旋转的中心点。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView imageView = (ImageView) findViewById(R.id.img);
        Bitmap bitmap = ((BitmapDrawable)imageView.getDrawable()).getBitmap();
        Matrix m = imageView.getImageMatrix();
        // 以图片的中心点为原点，顺时针旋转180度。
        m.setRotate(180, bitmap.getWidth()/2, bitmap.getHeight()/2);
        // 更新ImageView的矩阵。
        imageView.setImageMatrix(m);
    }
}
```
    语句解释：
    -  围绕某一点进行旋转，被分成3个步骤：首先将坐标原点移至该点，然后围绕新的坐标原点进行旋转变换，再然后将坐标原点移回到原先的坐标原点。被围绕的点可以是任意取值，它不受控件大小的限制。比如我们可以围绕(1000, 1000)这个点来旋转。
    -  简单的说，可以把用来绘制图像的区域，想象成一个无限大小的画布，当执行旋转时，默认情况下是旋转画布的左上角(0, 0)，而若我们指定了一个相对的点，比如(300, 300)，那么此时将以画布的(300, 300)为中心了。

<br>**前乘与后乘** 
　　我们已经知道了，只有当矩阵`A`的列数与矩阵`B`的行数相等时`A*B`才有意义，所以用矩阵`A`乘以矩阵`B`，需要考虑是左乘（`A*B`），还是右乘（`B*A`）。
　　左乘：又称前乘，比如说，矩阵`A(m,n)`左乘矩阵`B(n,p)`，会得到一个`m*p`的矩阵`C(m,p)`，写作`A*B=C`。

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
　　从注释中可以看出，`pre`其实执行的就是让`当前矩阵左乘参数矩阵`，而`post`执行的就是让`当前矩阵右乘参数矩阵`。

<br>**单次运算** 

<br>　　范例1：单次运算——旋转45度。
```
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        // 此处也可以调用postRotate()方法，它们的效果相同。
        m.preRotate(45);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
    语句解释：
    -  一个新创建的Matrix对象就是一个单位矩阵。对于平移、缩放、旋转、倾斜四个操作来说，当它们与一个单位矩阵进行运算时，不论调用的是pre还是post方法，最终的效果是一样的。
    -  一旦单位矩阵执行了某种操作，那么它就不再是单位矩阵了，此时就需要区分pre和post方法的调用。

<br>　　范例2：`setXxx`方法。
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
　　接下来我们通过一个范例来讲解如何进行混合连乘。

<br>　　范例1：请证明下面两段代码是等价的。
``` android
// 需求是：让图片沿着(a, b)点顺时针旋转30度。
int a = 100, b = 100;

// 第一种实现方式
Matrix m = new Matrix();
m.setRotate(30, a, b);

// 第二种实现方式
Matrix m = new Matrix();
m.setTranslate(a, b);
m.preRotate(30);
m.preTranslate(-a, -b);
```

<br>　　第一种实现方式很容易理解，也是不多说，直接说第二种方式。

　　首先我们得知道，矩阵先乘(`preXxx`)和后乘(`postXX`)的区别在于：当前矩阵对象，是先执行参数矩阵的变换，还是后执行参数矩阵的变换。
　　比如，我们可以根据第二种实现方式写出下面的公式：
``` java
// T  表示translate。
// R  表示rotate。
// M1 表示最终的结果矩阵。
M1 = T(a, b) * R(30) * T(-a, -b)

// 推导过程为：
// 第一步，由于先调用的是m.setTranslate(a, b)，所以会先把矩阵重置为单位矩阵，然后再把T放入，得到：
M1 = T(a, b)
// 第二步，由于m.preRotate(30)是前乘，所以直接把参数矩阵放到现有公式的末尾，得到：
M1 = T(a, b) * R(30)
// 第三步，同理，最终得到：
M1 = T(a, b) * R(30) * T(-a, -b)
```
　　需要注意的是，在计算的时候，图片会按照`从右向左`的顺序，依次被每个矩阵变换。
　　也就是说，公式`M1 = T(a, b) * R(30) * T(-a, -b)`的语义为：
	-  首先，把图片移动到(-a, -b)。
	-  然后，让图片以(0, 0)为中心旋转30度。
	-  最后，把图片移动到(a, b)。

　　按照上面的步骤，我们可以直观想一下：

	-  第一步，先进行preTranslate(-a, -b)操作，即把原图的左上角平移(-a, -b)个位置，也就相当于把原图的(100, 100)这个位置放到了(0, 0)上。
	-  第二步，以(0, 0)为中心旋转30度，就相当于以原图的(100, 100)为中心旋转30度。
	-  第三步，旋转完后再平移(a, b)，这样原图(100, 100)这个位置的点又回到了它原来的位置。
	-  最后，就相当于整个图做了一个以(100, 100)为中心的30度旋转，所以说第一种方式与第二种方式是等价的。


<br>　　最后，我们再看如果把第二种方式中的`m.preRotate(30)`变成`m.postRotate(30)`后，为什么效果就完全不一样了：
``` java
// 最终得到的公式为：
M1 = R(30) * T(a, b) * T(-a, -b)
```
　　在上面的公式中，两个平移变换相互抵消了，公式的语义是：以`(0,0)`为中心旋转`30`度，这显然和以`(100, 100)`为中心旋转`30`度是不同的。

<br>　　因此，我们可以总结一下：

	-  m.preTranslate(a, b)  ：先执行平移(a, b)的变换，再执行matrix中已经定义的其它变换。
	-  m.postTranslate(a, b) ：先执行matrix中已经定义的其它变换，再执行平移(a, b)的变换。
	-  m.setTranslate(a, b)  ：清空matrix中所有变换，调用这个函数后，matrix就会只包含平移(a, b)这一个变换。

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
　　比如，我们常见的对图像进行颜色方面的处理有：`黑白老照片`、`泛黄旧照片`、`低饱和度`等效果，这些效果都可以通过使用颜色矩阵（`ColorMatrix`）来实现。

<br>**基本概念**
　　位图是由像素（`Pixel`）组成的，`像素`是位图最小的信息单元。每个像素都具有特定的`位置`和`颜色值`，颜色值有`ARGB`四个通道，分别对应`透明度`、`红`、`绿`、`蓝`这四个通道分量。
　　位图文件会按`从左到右`、`从上到下`的顺序来记录图像中每一个像素的信息。

　　根据位深度（即每个像素点用几位二进制表示），可将位图分为`1`、`4`、`8`、`16`、`24`及`32`位图像等。每个像素使用的信息位数越多，可用的颜色就越多，颜色表现就越逼真，相应的数据量越大。例如，位深度为`1`的像素位图只有两个可能的值（黑色和白色），所以又称为二值位图。
　　位深度为`8`的图像有`2^8`（即`256`）个可能的值，而位深度为`8`的`灰度模式`图像有`256`个可能的`灰色值`。

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
    }
}
```
    语句解释：
    -  饱和度是指色彩的鲜艳程度，也称色彩的纯度，0代表灰，100代表饱和。
    -  这样一来，对于被禁用的按钮所显示的图片，如果美工不给，我们也可以自己做出来了。

<br>　　范例3：修改色调。
``` java
ImageView imageView = (ImageView) findViewById(R.id.img);
ColorMatrix colorMatrix = new ColorMatrix();
// 系统分别用0、1、2来代表Red、Green、Blue三种颜色，第二个参数表示色调值。
colorMatrix.setRotate(0, 100);
imageView.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
```
    语句解释：
    -  色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
    -  生活中经常见到这样一种现象：不同颜色的物体或被笼罩在一片金色的阳光之中，或被统一在冬季银白色的世界之中。
    -  这种在不同颜色的物体上，笼罩着某一种色彩，使不同颜色的物体都带有同一色彩倾向，这样的色彩现象就是色调。

<br>　　范例4：混合修改。
``` java
ImageView imageView = (ImageView) findViewById(R.id.img);
// 色调
ColorMatrix hueMatrix = new ColorMatrix();
hueMatrix.setRotate(0, 30);
hueMatrix.setRotate(1, 40);
hueMatrix.setRotate(2, 50);
// 饱和度
ColorMatrix saturationMatrix = new ColorMatrix();
saturationMatrix.setSaturation(5);
// 亮度
ColorMatrix lumMatrix = new ColorMatrix();
lumMatrix.setScale(50, 150, 250, 10);

// 将它们三个混在一起。
ColorMatrix matrix = new ColorMatrix();
matrix.postConcat(hueMatrix);
matrix.postConcat(lumMatrix);
matrix.postConcat(saturationMatrix);
imageView.setColorFilter(new ColorMatrixColorFilter(matrix));
```

<br>**本节参考阅读：**
- [Android学习笔记22：图像颜色处理（ColorMatrix）](http://www.cnblogs.com/menlsh/archive/2013/02/03/2890888.html)
- [Android图片处理：颜色矩阵和坐标变换矩阵](http://ju.outofmemory.cn/entry/26741)
- [维基百科 - 位图](http://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE)
- [百度百科 - 位图图像](http://baike.baidu.com/view/80262.htm)

<br><br>
