title: 实战篇　第七章 开源库
date: 2015-7-22 18:41:50
categories: Android
---
　　在软件开发中，有一个比较重要的原则：`“避免写重复的代码，以提高软件开发的效率”`。
　　现实的情况是，每个`Android`项目通常都会包含`网络请求`、`图片加载`、`json解析`等模块，如果每开启一个新项目都重写一遍这些代码，那就太耗精力了。我们完全可以将这些模块抽取出来，放到一个单独的库中，当再开新项目时就可以快速的搭建出一个项目雏形。

　　我们知道一个的人力量是有限的，有太多的原因（个人见识、测试不足）会导致我们写的代码不健壮，所以对于上述那些公共的模块，`笔者推荐大家使用开源的项目（除非你有安全方面的考虑）`，因为开源项目由很多人一起维护，聚集了他们知识的精华。


# 第一节 图片加载 #
　　关于图片加载的开源库，最著名的当属[ Android-Universal-Image-Loader ](https://github.com/nostra13/Android-Universal-Image-Loader)了，我们本节就以`1.9.4`版本为基础，来介绍一下它的基本应用。

<br>**是什么？**
　　`UIL`(Universal-Image-Loader)是一个专为`下载`、`缓存`、`显示`图片而设计的一个`强大的`、`灵活的`和`高度可定制的`工具。

## 环境配置 ##
　　接下来我们以`AndroidStudio`为例进行介绍，详细的配置过程请参看[ Quick Setup ](https://github.com/nostra13/Android-Universal-Image-Loader/wiki/Quick-Setup)。

<br>　　范例1：添加Gradle依赖。
``` gradle
compile 'com.nostra13.universalimageloader:universal-image-loader:1.9.4'
```
    语句解释：
    -  1.9.4版本将是最后一个发布在Maven上的版本，以后版本的UIL将只在Gradle中发布。

<br>　　范例2：添加权限。
``` xml
<!-- Include following permission if you load images from Internet -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Include following permission if you want to cache images on SD card -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```
    语句解释：
    -  第一个是网络访问权限，第二个是往SD卡写数据的权限。

## 简单应用 ##
　　环境配置完毕后，我们在使用`UIL`之前还需要在`Activity`或者`Application`（推荐）类中执行初始化操作。

<br>　　范例1：初始化`UIL`。
``` android
public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        // 为了简单起见，我们这里创建一个默认的配置对象，而不是自定义一个。
        ImageLoaderConfiguration config = ImageLoaderConfiguration.createDefault(this);
        // 使用这个配置对象进行初始化操作。
        ImageLoader.getInstance().init(config);
    }
}
```
    语句解释：
    -  我们也可以自定义一个配置对象来执行初始化操作，具体后面会介绍。

<br>　　范例2：直接将图片显示在`ImageView`上。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgIV = (ImageView) findViewById(R.id.img);
        // 下载并将图片显示到ImageView中。
        ImageLoader.getInstance().displayImage("http://img.7160.com/uploads/allimg/110630/1-110630103534.jpg", imgIV);
    }
}
```
    语句解释：
    -  调用displayImage(uri, view)方法可以直接加载图片，并在加载完毕后将自动显示图片。

<br>　　范例3：设置加载图片时的额外参数。
``` android

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgIV = (ImageView) findViewById(R.id.img);
        // DisplayImageOptions对象用来表示本次加载图片时的参数信息。
        DisplayImageOptions options = new DisplayImageOptions.Builder()
                // 执行加载时，imgIV所显示的图片。
                .showImageOnLoading(R.drawable.ic_stub)      
                // 图片的地址是无效时，imgIV所显示的图片。
                .showImageForEmptyUri(R.drawable.ic_empty)   
                // 图片加载失败（网络等原因）时，imgIV所显示的图片。
                .showImageOnFail(R.drawable.ic_error)        
                // 图片加载完成后是否将其缓存在内存中，如果true则再次加载该图片时加载的速度会变快。
                .cacheInMemory(true)                         
                // 图片加载完成后是否将其缓存在磁盘（手机内存或SD卡）上。
                .cacheOnDisk(true)                           
                .build();
        ImageLoader.getInstance().displayImage("http://img.7160.com/uploads/allimg/110630/1-110630103534.jpg", imgIV, options);
    }
}
```
    语句解释：
    -  DisplayImageOptions类还有其他选项，在此就不一一介绍了，您可以自行阅读源码。

<br>　　我们已经知道了`UIL`可以把下载来的图片缓存到磁盘上，那么缓存的目录是什么呢？
　　通过查看`com.nostra13.universalimageloader.utils.StorageUtils`类我们发现：

	-  当手机已经装载SD卡，并且程序可以向SD卡中写数据（在清单文件中申请了权限）时，缓存目录为SD卡上的：
	   -  /Android/data/packageName/cache
	      -  /Android/data/packageName/目录是Android推荐的App数据缓存目录，当App被卸载时系统会自动删除该目录下的所有文件。
	      -  缓存目录下可以有一个名为“.nomedia”的、大小为0b的文件，它用来告诉系统图库等App，此目录下的文件不需要展示给用户看。
	-  当手机SD卡不可用，或者可用但是创建缓存目录失败（如空间不足等）时，缓存目录为手机内部存储上的：context.getCacheDir()。
	-  当context.getCacheDir()返回null时，则缓存目录为：/data/data/packageName/cache/。

<br>　　范例4：设置加载图片的回调。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String uri = "http://a.hiphotos.baidu.com/image/pic/item/9d82d158ccbf6c8170e6ac2eb93eb13532fa4027.jpg";
        ImageView imgIV = (ImageView) findViewById(R.id.img);
        SimpleImageLoadingListener lListener = new SimpleImageLoadingListener(){
            @Override
            public void onLoadingCancelled(String imageUri, View view) {
                System.out.println(imageUri+" onLoadingCancelled ");
            }

            @Override
            public void onLoadingComplete(String imageUri, View view, Bitmap loadedImage) {
                System.out.println(imageUri+" onLoadingComplete ");
            }

            @Override
            public void onLoadingFailed(String imageUri, View view, FailReason failReason) {
                System.out.println(imageUri+" onLoadingFailed "+failReason.getCause());
            }

            @Override
            public void onLoadingStarted(String imageUri, View view) {
                System.out.println(imageUri+" onLoadingStarted ");
            }
        };
        ImageLoadingProgressListener lpListener = new ImageLoadingProgressListener() {
            public void onProgressUpdate(String imageUri, View view, int current, int total) {
                System.out.println(imageUri+" = "+current+"/"+total);
            }
        };
        ImageLoader.getInstance().displayImage(uri, imgIV, new DisplayImageOptions.Builder()
                .showImageOnLoading(R.drawable.ic_stub)
                .showImageForEmptyUri(R.drawable.ic_empty)
                .showImageOnFail(R.drawable.ic_error)
                .cacheInMemory(true)
                .cacheOnDisk(true)
                .build(), lListener, lpListener);
    }
}
```
    语句解释：
    -  当图片加载的状态改变时会回调SimpleImageLoadingListener中的方法。
    -  当且仅当把图片缓存到本地时，才会调用ImageLoadingProgressListener中的方法，如果本地有缓存则不会调用。

<br>　　范例5：设置渐入效果的`displayer`。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String uri = "http://a.hiphotos.baidu.com/image/pic/item/9d82d158ccbf6c8170e6ac2eb93eb13532fa4027.jpg";
        ImageView imgIV = (ImageView) findViewById(R.id.img);
        ImageLoader.getInstance().displayImage(uri, imgIV, new DisplayImageOptions.Builder()
                .showImageOnLoading(R.drawable.ic_stub)
                .showImageForEmptyUri(R.drawable.ic_empty)
                .showImageOnFail(R.drawable.ic_error)
                .cacheInMemory(true)
                .cacheOnDisk(true)
                // 设置本次要使用的displayer。
                .displayer(new FadeInBitmapDisplayer(1500))
                .build());
    }
}
```
    语句解释：
    -  目前UIL中有四种displayer可供选择：
       -  FadeInBitmapDisplayer、RoundedBitmapDisplayer、RoundedVignetteBitmapDisplayer、SimpleBitmapDisplayer（默认）。

<br>　　范例6：只是加载图片。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String uri = "http://a.hiphotos.baidu.com/image/pic/item/9d82d158ccbf6c8170e6ac2eb93eb13532fa4027.jpg";
        ImageView imgIV = (ImageView) findViewById(R.id.img);
        // Load image, decode it to Bitmap and return Bitmap to callback
        ImageLoader.getInstance().loadImage(uri, new SimpleImageLoadingListener() {
            @Override
            public void onLoadingComplete(String imageUri, View view, Bitmap loadedImage) {
                // Do whatever you want with Bitmap
                Toast.makeText(MainActivity.this, loadedImage.toString(),Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```
    语句解释：
    -  使用loadImage去加载图片，并获取到Bitmap对象，然后你想干什么就干什么。

<br>　　范例7：动态拼接`Uri`。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 加载assets目录下的a.jpg文件。
        String uri = ImageDownloader.Scheme.ASSETS.wrap("a.jpg");

        ImageView imgIV = (ImageView) findViewById(R.id.img);
        ImageLoader.getInstance().displayImage(uri, imgIV);
    }
}
```
    语句解释：
    -  UIL支持下面六种格式的Uri：
       -  http、https：网络图片。
       -  file：Sd卡图片。
       -  content：内容提供者图片。
       -  assets：assets目录下的图片。
       -  drawable：res\drawable目录下的图片，除非必要，否则推荐使用Android原生加载方法来加载drawable下的图片。
    -  这六种格式的Uri在ImageDownloader.Scheme类中有定义，该类还提供了两个实用的方法：
       -  wrap：用来生成Uri。
       -  crop：用来从Uri中解析出图片的路径。

<br>　　范例8：同步加载。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String uri = ImageDownloader.Scheme.ASSETS.wrap("a.jpg");
        ImageView imgIV = (ImageView) findViewById(R.id.img);
       
        // 同步加载
        Bitmap bitmap = ImageLoader.getInstance().loadImageSync(uri);
        imgIV.setImageBitmap(bitmap);
    }
}
```
    语句解释：
    -  如果你的图片是本地图片并且不是很大，那么可以使用同步加载的方式。

<br>　　范例9：限制图片尺寸。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView imgIV = (ImageView) findViewById(R.id.img);

        String uri = ImageDownloader.Scheme.ASSETS.wrap("a.jpg");
        ImageSize targetSize = new ImageSize(80, 50);
        Bitmap bitmap = ImageLoader.getInstance().loadImageSync(uri, targetSize);

        imgIV.setImageBitmap(bitmap);
    }
}

```
    语句解释：
    -  如果图片的实际尺寸大于指定的尺寸，那么会对图片进行等比例缩放，否则不会。

<br>**常用配置**
　　通过刚才的介绍我们学会了`UIL`的基本用法，接下来介绍一些可选的配置操作。


<br>　　范例1：初始化`UIL`。
``` android
public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        ImageLoaderConfiguration.Builder config = new ImageLoaderConfiguration.Builder(this);
        // 设置线程的优先级
        config.threadPriority(Thread.NORM_PRIORITY - 2);
        // 设置内存缓存允许缓存一张图片的多个尺寸，默认不允许。
        config.denyCacheImageMultipleSizesInMemory();
        // 设置本地缓存文件的名称的样式，默认是HashCodeFileNameGenerator。
        config.diskCacheFileNameGenerator(new Md5FileNameGenerator());
        // 设置磁盘缓存的最大字节数，如果大于0则稍后会用LruDiskCache，否则使用无大小限制的UnlimitedDiskCache。
        config.diskCacheSize(50 * 1024 * 1024); // 50 MiB
        // 设置任务的处理顺序，默认为FIFO。
        config.tasksProcessingOrder(QueueProcessingType.LIFO);

        // Initialize ImageLoader with configuration.
        ImageLoader.getInstance().init(config.build());
    }

}
```
    语句解释：
    -  关于本地缓存大小，还可以使用diskCacheFileCount方法，来设置缓存的文件个数。


<br>**本节参考阅读：**
- [Android Universal Image Loader 源码分析](http://codekk.com/blogs/detail/54cfab086c4761e5001b2540)

<br><br>


