title: 实战篇　第三章 开源库
date: 2015-7-17 19:05:35
categories: android
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
	   -  /Android/data/packageName
	   -  该目录是Android推荐的App数据缓存目录，当App被卸载时系统会自动删除该目录。
	   -  缓存目录下可以有个名为“.nomedia”的、大小为0b的文件，用来告诉系统图库等App，此目录下的文件不需要展示给用户。
	-  当SD卡不可用，或者创建缓存目录失败（如空间不足等）时，缓存目录为手机内部存储上的：context.getCacheDir()。
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

# 第二节 DrawerLayout #
　　相信大家都听说过`DrawerLayout`控件（如果未听过那请去搜索），它是`v4`库中提供的一个侧滑菜单控件。
　　本节将介绍如何让`DrawerLayout`和`Toolbar`配合使用，关于`Toolbar`请阅读[《UI篇　第三章 ActionBar 和 Toolbar》](http://cutler.github.io/android-B03/)。

<br>　　范例1：添加Gradle依赖。
``` gradle
dependencies {
    compile 'com.android.support:appcompat-v7:23.1.1'
}
```
    语句解释：
    -  由于Toolbar被放到了appcompat-v7库中，所以我们需要先引用该库。
    -  由于appcompat-v7库需要依赖v4库，所以AS也会默认把v4导入进项目中，因此上面只需要加一个v7引用即可。

<br>　　本质上看，`DrawerLayout`的作用就是，为我们的界面加上左右两个滑动菜单，因此它由三个部分组成：

	-  主布局
	-  左侧滑动菜单
	-  右侧滑动菜单。

<br>　　范例2：布局文件。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <android.support.v7.widget.Toolbar
        android:id="@+id/mToolbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary" />

    <android.support.v4.widget.DrawerLayout
        android:id="@+id/drawer"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <LinearLayout
            android:id="@+id/content"
            android:layout_width="match_parent"
            android:layout_height="match_parent">
            <Button
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:onClick="onClick"
                android:text="中间的按钮" />
        </LinearLayout>

        <LinearLayout
            android:id="@+id/left"
            android:layout_width="220dp"
            android:layout_height="match_parent"
            android:layout_gravity="start"
            android:background="@android:color/white"
            android:orientation="vertical">
            <Button
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="左侧的按钮" />
        </LinearLayout>

        <LinearLayout
            android:id="@+id/right"
            android:layout_width="220dp"
            android:layout_height="match_parent"
            android:layout_gravity="end"
            android:background="@android:color/white"
            android:orientation="vertical">
            <Button
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="右侧的按钮" />
        </LinearLayout>

    </android.support.v4.widget.DrawerLayout>
</LinearLayout>
```
    语句解释：
    -  DrawerLayout标签内部最多支持3个子View（但也可以不设置第三个子View）：
      -  第一个子View表示界面的主布局，会一直显示出来。
      -  第二个子View表示界面左侧的菜单，需要滑动才能显示出来。
      -  第三个子View表示界面右侧的菜单，需要滑动才能显示出来。
    -  我们把第二、第三个子View称为抽屉View，抽屉View必须要使用android:layout_gravity属性来指定滑动方向：
       -  start表示当前抽屉View显示在左侧。
       -  end表示当前抽屉View显示在右侧。
    -  抽屉View的宽度最好不要超过320dp，这样可以让用户总能看到内容视图的一部分。


<br>　　范例3：Activity代码。
``` android
public class MainActivity extends AppCompatActivity {

    private DrawerLayout drawer;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 设置Toolbar的标题。
        Toolbar toolbar = (Toolbar) findViewById(R.id.mToolbar);
        toolbar.setTitle("绳命是乳次的灰黄");
        setSupportActionBar(toolbar);

        drawer = (DrawerLayout) findViewById(R.id.drawer);
        // ActionBarDrawerToggle用来监听DrawerLayout的打开与关闭状态。
        ActionBarDrawerToggle mDrawerToggle = new ActionBarDrawerToggle(this, 
            drawer, toolbar, R.string.app_name, R.string.app_name);
        // 设置让ActionBarDrawerToggle的开关状态随着DrawerLayout的开关状态而改变。
        mDrawerToggle.syncState();
        // 将监听器设置到DrawerLayout中。
        drawer.setDrawerListener(mDrawerToggle);
    }

    public void onClick(View view){
        // 通过代码的方式打开左侧的滑动菜单。
        drawer.openDrawer(Gravity.LEFT);
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
```
    语句解释：
    -  需要注意的是，本范例使用的ActionBarDrawerToggle是v7包中的那个。

<br>　　此时此刻任何语言都是苍白的，点击[ 下载源码 ](http://download.csdn.net/detail/github_28554183/9439065)（里面也包含apk），安装运行之后，你就能知道什么效果了。

<center>
![运行效果图](/img/android/android_o03_01.jpg)
</center>

<br>　　上图左上角的那个箭头是带动画的，当抽屉View展开时显示一个箭头，抽屉View关闭是显示三条线。
<br>　　最后，若想让`DrawerLayout`在展开时将`Toolbar`给盖住，只需要将布局文件里的`Toolbar`移动到`DrawerLayout`中即可。

# 第三节 Android 5.0 #
　　`Android 5.0`（Lollipop）是`Google`于`2014/10/15`日（美国太平洋时间）发布的全新`Android`操作系统。
　　它是迄今为止规模最大、最为雄心勃勃的`Android`版本，它不仅为用户推出了各种崭新的新功能，为开发者则提供了数千个新的`API`，还将`Android`的疆土扩展得更远，小到`手机`、`平板电脑`和`穿戴式设备`，大到`电视`和`汽车`，都可以是它活跃的领地。

　　要深入了解面向开发者的新`API`，请参阅[ Android 5.0 API ](http://developer.android.com/intl/zh-cn/about/versions/android-5.0.html)概述，本章只会介绍一些`Android5.0`中已经被广泛使用的技术。

　　`Android 5.0`将`Material design`设计引入`Android`系统，您可以借助`Material design`设计创建应用，使其呈现动态的视觉效果并为用户提供自然的界面元素过渡效果。此支持包括：

	-  素材主题背景
	-  视图阴影
	-  RecyclerView 小部件
	-  可绘制的动画和样式效果
	-  Material Design 设计动画和活动过渡效果
	-  基于视图状态的视图属性动画生成器
	-  可自定义的界面小部件和应用栏（含您可以控制的调色板）
	-  基于 XML 矢量图形的动画和非动画图形内容

　　要详细了解如何向您的应用添加`Material Design`设计功能，请参阅[ Material Design ](http://developer.android.com/intl/zh-cn/training/material/index.html)设计。

　　上面这些文字都是从百度、`Google`官方文档上复制过来的，说的很抽象，不过没关系，我们接下来将分多个小结依次介绍`Android5.0`在界面上新增的内容。

## CardView ##
　　`Android5.0`中增加了一个全新的控件`CardView`，它是`FrameLayout`类的子类，并在`FrameLayout`基础上添加了`圆角`和`阴影`效果。
　　也就是说，从此以后我们可以方便的通过代码来实现`圆角`和`阴影`的效果，而不再像以前那样依赖于美工做图了（而且给的图不易进行微调）。

<br>　　`Google`已经将`CardView`放到一个名为[ v7 cardview library ](http://developer.android.com/intl/zh-cn/tools/support-library/features.html#v7-cardview)的支持库中了，我们可以在`Android2.1`之上的任何版本中使用它。在项目中添加对该库的依赖：
``` gradle
dependencies {
    compile 'com.android.support:cardview-v7:21.0.0'
}
```

<br>　　`CardView`的使用方法十分简单，添加完项目依赖后，直接修改咱们的布局文件即可。

<br>　　范例1：`activity_main.xml`。

<center>
![运行效果](/img/android/android_o06_01.png)
</center>

``` xml
<android.support.v7.widget.CardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:card_view="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="20dp"
    card_view:cardCornerRadius="5dp"
    card_view:cardElevation="2dp">

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="10dp"
        android:text="HELLO" />

</android.support.v7.widget.CardView>
```
    语句解释：
    -  由于CardView的父类是FrameLayout，因而它的使用方法和FrameLayout是一样的。
    -  本范例中定义了android和card_view两个命名空间，CardView所提供的属性都放到了card_view中，也是不多说。
    -  属性解释：
       -  cardCornerRadius：设置CardView的圆角半径，值越大圆角就越明显。
       -  cardElevation：设置CardView的阴影高度，值越大阴影就越明显。
       -  cardBackgroundColor：设置CardView的背景色。
       -  contentPadding、contentPaddingLeft、contentPaddingRight、contentPaddingTop、contentPaddingBottom：你懂的。

<br>　　范例2：显示层级。

<center>
![运行在Android5.0设备上的效果](/img/android/android_o06_02.png)
</center>

``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:card_view="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.CardView
        android:layout_width="200dp"
        android:layout_height="100dp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="20dp"
        card_view:cardBackgroundColor="#ff0000"
        card_view:cardCornerRadius="10dp"
        card_view:cardElevation="3dp" />

    <android.support.v7.widget.CardView
        android:layout_width="200dp"
        android:layout_height="100dp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="50dp"
        card_view:cardBackgroundColor="#00ff00"
        card_view:cardCornerRadius="10dp"
        card_view:cardElevation="2dp" />

</RelativeLayout>
```
    语句解释：
    -  Android5.0中View在绘制的时候增加一个z轴的概念（即显示层级），层级高的View将显示在层级低的View的上面。
    -  CardView的cardElevation属性既是用来设置阴影高度，也是用来设置显示层级的，按照以往的情况，由于绿色的CardView是后添加的，因而它会被放到上面显示，但由于它的cardElevation值低，因此最终它被放到了下面去显示。
      -  注意，显示层级是Android5.0提出的，也就是说这段代码只有运行在Android5.0的设备上时，红色的才会盖在绿色上面，否则仍然是绿色在上。

## RecyclerView ##
　　`Android5.0`中增加了另一个重要的控件就是`RecyclerView`，它用来取代现有的`ListView`和`GridView`控件。

<br>**问题是这样的**

　　在开发中，我们都或多或少的会对`ListView`的性能有所要求，以便给用户提供流畅的滑动体验，常见的优化方案有如下几个：

	-  第一，使用convertView来重用现有的Item。
	-  第二，使用ViewHolder来减少findViewById方法的调用次数。
	-  第三，尽可能的降低getView方法内对象产生的数量以及大小。如果Item中包含图片那么应该进行异步加载。

<br>　　而且除了效率上的要求，我们还希望`ListView`能实现：

	-  第一，能实横向、纵向、九宫格、瀑布流等各种布局那就太好了。
	-  第二，能在添加和删除每个Item的时候，都播放一个动画那就太好了。

<br>　　现实的情况是，不论是效率还是功能，`ListView`都不是最优的，因而`Google`提出了`RecyclerView`。

<br>**是什么、能做什么？**
　　从类名上看，`RecyclerView`代表的意义是只管`回收和复用View`，其他的功能由你自己去完成，给予你充分的定制自由，实现了高度的解耦。在结构上`RecyclerView`与`ListView`的区别在于：

	-  ListView：
	   -  数据由Adapter提供。
	   -  Item的创建/重用由ListView来完成。
	   -  Item的排列方式（只支持垂直）由ListView来控制。
	-  RecyclerView：
	   -  数据由Adapter提供。
	   -  Item的创建/重用由RecyclerView来完成。
	   -  Item的排列方式（垂直、水平、瀑布流等任意方式）由LayoutManager来完成。如果你想自定义自己的排列方式，那么只需要自定义一个LayoutManager类即可。

<br>　　`RecyclerView`在提升效率方面上做了如下操作（但不限于）：

	-  第一，强制使用ViewHolder。
	   -  Android推荐（非强制）LisView使用ViewHolder来减少findViewById()的使用以提高效率。
	   -  在RecyclerView中变成了必须使用的模式，Adapter要求返回的值也从普通的View变成了ViewHolder。
	-  第二，使用局部更新。
	   -  当LisView的数据改变时会更新整个列表，而RecyclerView既支持整体刷新也支持局部刷新（只会更新发生变化的View）。

　　同时，`RecyclerView`在功能方面上已经实现了刚才我们提到的两点：自定义`Item`排列方式和`Item`动画。
<br>　　提示：如果你想阅读各个`support`库的源码，请点击[ platform_frameworks_support ](https://github.com/android/platform_frameworks_support)。

<br>**开始使用**
　　同样的`Google`也已经将`RecyclerView`放到一个名为[ v7 recyclerview library ](http://developer.android.com/intl/zh-cn/tools/support-library/features.html#v7-recyclerview)的支持库中了，我们可以在`Android2.1`之上的任何版本中使用它。在项目中添加对该库的依赖：
``` gradle
dependencies {
    compile 'com.android.support:recyclerview-v7:21.0.0'
}
```

<br>　　范例1：`activity_main.xml`。
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/my_recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</RelativeLayout>
```

<br>　　`RecyclerView`与`AdapterView`类似，实现了数据和视图的分离，数据仍然是使用`Adapter`来提供。`RecyclerView`的使用步骤为：

	-  第一，获取RecyclerView对象。
	-  第二，为RecyclerView设置Item的排列方式。
	-  第三，为RecyclerView设置Adapter。

<br>　　范例2：`MainActivity`。
``` android
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 第一，获取RecyclerView对象。
        RecyclerView mRecyclerView = (RecyclerView) findViewById(R.id.my_recycler_view);

        // 第二，为RecyclerView设置Item的排列方式。下面的代码使用线性布局排列子元素，垂直排列。
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(this);
        mLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // 第三，为RecyclerView设置Adapter。
        List<String> data = Arrays.asList("Android","ios","jack","tony","window","mac");
        mRecyclerView.setAdapter(new MyRecyclerAdapter(data));
    }
}
```
    语句解释：
    -  系统内置的Item布局方式还有网格（GridView）和瀑布流两种，稍后会介绍它们。

<br>　　范例3：`MyRecyclerAdapter`。
``` android
// 注意：MyRecyclerAdapter的父类是RecyclerView.Adapter类型的。
public class MyRecyclerAdapter extends RecyclerView.Adapter<MyRecyclerAdapter.ViewHolder> {
    private List<String> items;

    public MyRecyclerAdapter(List<String> items) {
        this.items = items;
    }

    // 此方法相当于ListView的getView()方法，当需要返回控件时会调用它。
    // 注意此方法的返回值被强制要求返回RecyclerView.ViewHolder类型的。
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recyclerview, parent, false);
        return new ViewHolder(v);
    }

    // 当需要更新holder所对应的Item中的信息时，会调用此方法。
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        String item = items.get(position);
        holder.text.setText(item);
        // 下面这行代码为了以后能方便通过holder.itemView来获取到这个item对象，下面会介绍holder.itemView是什么。
        holder.itemView.setTag(item);
    }

    // 返回适配器中的元素个数。
    @Override
    public int getItemCount() {
        return items.size();
    }

    // 自定义ViewHolder类，注意此类我们用static修饰，可以防止ViewHolder持有Adapter的引用。
    public static class ViewHolder extends RecyclerView.ViewHolder {
        // 和以前一样，ViewHolder将它所管理的每一个控件都作为一个字段，方便外界访问。
        public TextView text;

        public ViewHolder(View itemView) {
            // 调用父类的构造方法，在父类中有一个名为itemView字段，专门用来持有参数itemView的引用的，因为父类在后续操作中会用到。
            // 而itemView的子控件的引用，则由当前ViewHolder类的属性来持有，具体请参阅源码。
            super(itemView);
            // 从View中获取各个子控件的引用，以减少findViewById方法的调用次数。
            text = (TextView) itemView.findViewById(R.id.text);
        }
    }
}
```
    语句解释：
    -  如果你没理解holder.itemView的含义，请自行去阅读源码。

<br>　　范例4：`item_recyclerview.xml`。
``` xml
<android.support.v7.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:card_view="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginLeft="10dp"
    android:layout_marginRight="10dp"
    card_view:contentPadding="10dp"
    card_view:cardCornerRadius="4dp"
    card_view:cardElevation="3dp">

    <TextView
        android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

</android.support.v7.widget.CardView>
```
    语句解释：
    -  使用了CardView作为根节点，其内部只有一个TextView，用来显示一行文字。

<center>
![运行效果](/img/android/android_o06_03.png)
</center>

<br>**设置点击事件**
　　`RecyclerView`没有提供设置点击事件的方法，我们可以直接在`ViewHolder`类上添加事件。

<br>　　范例1：点击和长按事件。
``` android
public static class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener, View.OnLongClickListener {
    public TextView text;

    public ViewHolder(View itemView) {
        super(itemView);
        text = (TextView) itemView.findViewById(R.id.text);
        text.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Toast.makeText(v.getContext(),"text click", Toast.LENGTH_SHORT).show();
            }
        });
        // 给根View设置点击和长按事件。
        itemView.setOnClickListener(this);
        itemView.setOnLongClickListener(this);
    }

    @Override
    public void onClick(View v) {
        Toast.makeText(v.getContext(),"itemView click", Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean onLongClick(View v) {
        Toast.makeText(v.getContext(),"itemView long click", Toast.LENGTH_SHORT).show();
        return true;
    }
}
```
    语句解释：
    -  直接在构造方法内部给itemVIew设置事件监听器即可。

<br>**Item排列方式**

<br>　　范例1：网格、瀑布流。
``` android
// 线性布局排列
mRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));

// 网格布局排列
mRecyclerView.setLayoutManager(new GridLayoutManager(this, 2, GridLayoutManager.VERTICAL, false));

// 交错网格布局，类似于网格布局，但每个格子的高度或者长度可以不一样。
mRecyclerView.setLayoutManager(new StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL));
```
    语句解释：
    -  LinearLayoutManager构造方法的三个参数：
       -  context：也是不多说。
       -  orientation：元素排列方向，取值有LinearLayoutManager.VERTICAL和LinearLayoutManager.HORIZONTAL。
       -  reverseLayout：是否反转布局。即元素将从下到上显示，效果参看微信、QQ等软件的聊天界面。
    -  GridLayoutManager构造方法的第二个参数：
       -  spanCount：设置每一排上元素的个数。
    -  StaggeredGridLayoutManager构造方法的第一个参数也是spanCount，与GridLayoutManager一样。


<br>　　下图展示了`GridLayoutManager`（左）和`StaggeredGridLayoutManager`（右）排列方式的区别：
<center>
![运行效果](/img/android/android_o06_04.png)
</center>

<br>**数据更新**
　　`RecyclerView`提供了两种数据更新的方式：

	-  全部更新：让整个RecyclerView所有正在显示的控件都更新。
	   -  调用RecyclerView.Adapter类的notifyDataSetChanged()方法即可。
	-  局部更新：如果你往Adapter中“增加、删除、更新”了一个或多个Item，那么就可以调用对应的方法来只刷新这几个Item，从而提升效率。
	-  添加：notifyItemInserted(position)、notifyItemRangeInserted(position, itemCount)。
	   -  前者告诉RecyclerView，当前往position位置上插入了1个新元素。
	   -  后者是从position位置开始，加入了itemCount个元素。
	-  删除：notifyItemRemoved(position)、notifyItemRangeRemoved(position, itemCount)。
	-  更新：notifyItemChanged(position)、notifyItemChanged(position, itemCount)。

<br>　　范例1：局部更新。
``` android
public class MyRecyclerAdapter extends RecyclerView.Adapter<MyRecyclerAdapter.ViewHolder> {
    private List<String> items;

    public MyRecyclerAdapter(List<String> items) {
        this.items = items;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recyclerview, parent, false);
        // 注意此处把MyRecyclerAdapter的引用传递了过去。
        return new ViewHolder(v, this);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        String item = items.get(position);
        holder.text.setText(item);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    // 添加
    public void appendData(List<String> newItems){
        if (newItems != null && newItems.size() > 0) {
            items.addAll(newItems);
            notifyItemRangeInserted(items.size()-newItems.size(), newItems.size());
        }
    }

    public void removeData(int position) {
        if (position >= 0 && position < items.size()) {
            items.remove(position);
            notifyItemRemoved(position);
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        // 弱引用
        private SoftReference<MyRecyclerAdapter> mAdapter;

        public TextView text;

        public ViewHolder(View itemView, MyRecyclerAdapter adapter) {
            super(itemView);
            mAdapter = new SoftReference<MyRecyclerAdapter>(adapter);
            text = (TextView) itemView.findViewById(R.id.text);
            itemView.setOnClickListener(this);
        }

        public void onClick(View v) {
            if (mAdapter != null && mAdapter.get() != null) {
                // 调用RecyclerView.ViewHolder类的getPosition()获取当前位置
                mAdapter.get().removeData(getPosition());
            }
        }
    }
}
```
    语句解释：
    -  如果一个对象被两个地方引用，一个是弱引用，一个是强引用，那么在强引用被释放之前，弱引用会始终有值。


<br>**下拉刷新**
　　我们也可以很容易的给`RecyclerView`加上下拉刷新功能。

<br>　　范例1：`SwipeRefreshLayout`。
``` xml
<android.support.v4.widget.SwipeRefreshLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/refreshLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/my_recycler_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</android.support.v4.widget.SwipeRefreshLayout>
```
    语句解释：
    -  使用v4包中的SwipeRefreshLayout类将需要下拉刷新的控件包裹一下就可以了。


<br>　　范例2：设置下拉事件监听器。
``` android
final SwipeRefreshLayout mRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.refreshLayout);
// 调用此方法设置下拉监听器，当用户触发下拉刷新时，会在主线程中回调onRefresh()方法。
mRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
    @Override
    public void onRefresh() {
        // 1.5秒后将下拉刷新的状态置为false。
        new Handler().postDelayed(new Runnable() {
            public void run() {
                mRefreshLayout.setRefreshing(false);
            }
        }, 1500);
    }
});
```
    语句解释：
    -  你也可以直接调用setRefreshing(true);来触发下拉刷新的动画，但是不会导致onRefresh方法被调用。
    -  下拉刷新的箭头颜色等都是可以修改的。


<br>　　[点击下载源码 ](http://download.csdn.net/detail/github_28554183/8920585)

　　如果你没有`AndroidStudio`环境，可以在`MateriaDesign\app\build\outputs\apk`目录中找到`apk`文件。

<br>**其它特性**
　　`RecyclerView`还支持`Item分割线`、`多种Item类型`等功能，由于篇幅关系（同时也很容易在网上搜索到答案），笔者暂时就不介绍了。

<br>**本节参考阅读：**
- [百度百科 - Android 5.0](http://baike.baidu.com/view/5930831.htm)
- [Android Lollipop](http://developer.android.com/intl/zh-cn/about/versions/lollipop.html)
- [RecyclerView体验简介](http://blog.iderzheng.com/first-date-with-recyclerview/)

## Design支持库 ##
　　`Android5.0`是有史以来最重要的安卓版本之一，这其中有很大部分要归功于material design的引入，这种新的设计让整个安卓的用户体验焕然一新。谷歌在`2015 I/O`大会时，宣布了一个名叫`Design`的支持库，在这个库里提供了一堆material design控件。

　　接下来我们就一起来看看它们到底是何方神圣。

　　首先要知道的是，我们可以在`Android2.1`之上的任何版本中使用`Design`库，只需要在项目中添加对该库的依赖：
``` gradle
dependencies {
    compile 'com.android.support:design:22.2.0'
}
```

<br>
### NavigationView ###
　　在本章的第二节已经介绍了`DrawerLayout`是由三部分的组成的，可以用它来创建两个滑动菜单。

　　简单的说，`NavigationView`就是一个Google帮我们好的滑动菜单控件，它的外表大致为：

<center>
![知乎客户端](/img/android/android_o03_02.jpg)
</center>

　　从上图可以看出来，`NavigationView`分为上下两部分：

	-  上面的蓝色部分被称为是headerLayout，它可以放任意的控件。
	-  下面的白色部分是一组功能按钮，通常是单选的，某一时刻只能有一个被选中。

<br>　　下面就来介绍如何让`Toolbar`、`DrawerLayout`和`NavigationView`三者配合使用。
<br>　　范例1：首先在主题下面添加如下两个属性。
``` xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">#2196F3</item>
        <item name="colorPrimaryDark">#1976D2</item>
    </style>

    <style name="AppThemeBase" parent="AppTheme">
    </style>
</resources>
```
    语句解释：
    -  AppTheme主题下的两个属性分别用来设置状态栏和标题栏的背景色。
    -  然后在清单文件中，直接让Activity或者Application使用AppThemeBase主题即可。

<br>　　范例2：布局文件。
``` xml
<android.support.v4.widget.DrawerLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/drawer"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <android.support.v7.widget.Toolbar
            android:id="@+id/mToolbar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="?attr/colorPrimary" />
    </LinearLayout>

    <android.support.design.widget.NavigationView
        android:id="@+id/navigation"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/drawer_header"
        app:menu="@menu/drawer" />
</android.support.v4.widget.DrawerLayout>
```
    语句解释：
    -  根节点是DrawerLayout，内容布局是LinearLayout，左侧滑动菜单是NavigationView。
    -  NavigationView的headerLayout属性用来设置顶部的布局。
    -  NavigationView的menu属性用来指定菜单文件。这个属性几乎是必选的，不然NavigationView控件就失去意义了（我们用NavigationView就是为了导航的，结果却不为它设置导航菜单？）。
       -  另外，也可以在运行时动态改变menu属性。

<br>　　范例3：headerLayout。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="192dp"
    android:background="?attr/colorPrimaryDark"
    android:padding="16dp"
    android:theme="@style/ThemeOverlay.AppCompat.Dark"
    android:orientation="vertical"
    android:gravity="bottom">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Username"
        android:textAppearance="@style/TextAppearance.AppCompat.Body1"/>

</LinearLayout>
```
    语句解释：
    -  这个布局可以任意写，上面的代码是我copy网上的。

<br>　　范例4：菜单文件。
``` xml
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <group android:checkableBehavior="single">
        <item
            android:id="@+id/nav_home"
            android:checked="true"
            android:icon="@drawable/ic_dashboard"
            android:title="Home" />
        <item
            android:id="@+id/nav_messages"
            android:icon="@drawable/ic_event"
            android:title="Messages" />
        <item
            android:id="@+id/nav_friends"
            android:icon="@drawable/ic_headset"
            android:title="Friends" />
        <item
            android:id="@+id/nav_discussion"
            android:icon="@drawable/ic_forum"
            android:title="Discussion" />
    </group>

    <item android:title="Sub items">
        <menu>
            <item
                android:icon="@drawable/ic_dashboard"
                android:title="Sub item 1" />
            <item
                android:icon="@drawable/ic_forum"
                android:title="Sub item 2" />
        </menu>
    </item>
</menu>
```
    语句解释：
    -  每个菜单项使用item标签来表示，菜单项可以设置标题和图标。
    -  上面使用group标签来定义一个菜单组，组内的菜单同一时间只能有一个被选中，且默认选择第一个。
    -  菜单是可以嵌套的，嵌套时会将菜单的名字显示出来，同时自动出现一个分割线，具体效果请自行写代码体验。

<br>　　范例5：Activity代码。
``` android
public class MainActivity extends AppCompatActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer);

        // 初始化Toolbar
        Toolbar toolbar = (Toolbar) findViewById(R.id.mToolbar);
        toolbar.setTitle("张德彪");
        // 将overflow按钮的颜色改为白色，这个用法是蒙出来的。
        toolbar.getOverflowIcon().setColorFilter(Color.WHITE, PorterDuff.Mode.DST);
        setSupportActionBar(toolbar);
        toolbar.setTitleTextColor(Color.WHITE);
        toolbar.setNavigationIcon(R.drawable.ic_menu);
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // 用户点击标题栏左侧的按钮时，直接打开左侧的滑动菜单。
                drawer.openDrawer(Gravity.LEFT);
            }
        });

        // 初始化NavigationView
        NavigationView navigationView = (NavigationView) findViewById(R.id.navigation);
        // 设置菜单的点击事件。
        navigationView.setNavigationItemSelectedListener(
                new NavigationView.OnNavigationItemSelectedListener() {
                    public boolean onNavigationItemSelected(MenuItem menuItem) {
                        // 当菜单被点击时，就将它设置为选中状态。
                        menuItem.setChecked(true);
                        // 关闭滑动菜单。
                        drawer.closeDrawers();
                        return true;
                    }
                });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
```
    语句解释：
    -  注意：如果你运行项目的时候发现NavigationView里的菜单看不见了，那应该是你在AppTheme主题下为textColorPrimary和textColorSecondary属性设置值了。

<br>　　**针对Android 5.0及以上版本**

　　运行上面的代码时，仔细观察状态栏的背景色，会发现状态栏的颜色和`NavigationView`的颜色重叠了（下面的左图）：

<center>
![](/img/android/android_o03_03.jpg)
</center>

　　我们可以通过配置，让程序变成上面右图的效果，即让状态栏的颜色透明。

<br>　　第一步，创建`res\values-v21\styles.xml`，并加入如下代码：
``` xml
<style name="AppThemeBase" parent="AppTheme">
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:statusBarColor">@android:color/transparent</item>
</style>
```
<br>　　第二步，修改布局文件，给`DrawerLayout`加上如下属性：
``` xml
android:fitsSystemWindows="true"
```
    语句解释：
    -  这个属性用来告诉系统由将DrawerLayout来接管状态栏的背景的绘制工作。

<br>　　最后，[点击此处下载源码 ](http://download.csdn.net/detail/github_28554183/9440751)（里面也包含apk），安装运行之后，就能体验`NavigationView`了。
<br>　　另外，笔者认为知乎的Android端并没有使用`NavigationView`，而是自己实现的一个类似的布局。

<br>
### TextInputLayout ###
　　在以前，`EditText`中的`hint`属性会在用户点击文本框，准备输入内容的时候就消失。

　　这就会导致下面这样的问题：

	假设一个页面有多个EditView，很有可能用户在输入多个EditView之后，不知道当前EditView需要输入什么内容。
　　`TextInputLayout`用来包裹`EditText`对象，当`EditText`获取输入焦点时，它会自动将`hint`移动到`EditText`上方显示。
　　另外，当用户输入的内容不合法时，`TextInputLayout`还可以在文本框的底部，显示一条错误信息。

　　笔者推荐大家去阅读：[《使用TextInputLayout创建一个登陆界面》](http://www.jcodecraeer.com/a/basictutorial/2015/0821/3338.html)，写的很详细。

<br>
### Snackbar ###
　　`Snackbar`提供了一个介于`Toast`和`Dialog`之间的轻量级控件，它可以很方便的显示消息和处理点击事件。

<br>　　范例1：显示Snackbar。

<center>
![Snackbar显示效果](/img/android/android_o03_04.jpg)
</center>

``` android
final Snackbar snackbar = Snackbar.make(view,"这是一条Snackbar消息", Snackbar.LENGTH_LONG);
// 当用户点击“关闭”二字的时候，就把Snackbar给关掉。
snackbar.setAction("关闭",new View.OnClickListener() {
    public void onClick(View v) {
        snackbar.dismiss();
    }
});
snackbar.show();
```
    语句解释：
    -  Snackbar的使用方法和Toast类似，其中view可以取值为当前界面上的任何一个View。

<br>　　范例2：修改字体的颜色。
``` java
final Snackbar snackbar = Snackbar.make(view,
        Html.fromHtml("<font color='green'>这是一条Snackbar消息</font>"), Snackbar.LENGTH_LONG);
// 设置action文本的字体颜色。
snackbar.setActionTextColor(Color.RED);
snackbar.setAction("关闭",new View.OnClickListener() {
    public void onClick(View v) {
        snackbar.dismiss();
    }
});
snackbar.show();
```
    语句解释：
    -  笔者想说的是，既然Snackbar并没有提供直接修改消息字体颜色的方法，那就表明不希望我们修改，它会帮我们处理各个系统之间的差异。
    -  如果实在是想修改，则可以使用Html类，因为Snackbar可以显示一个CharSequence类型的文本。

<br>　　`Toast`和`SnackBar`的区别是，前者是悬浮在所有布局之上的包括软键盘，后者则是显示在当前界面的View树上的。

<br>　　这一点从的源码上可以看出来：
``` java
private static ViewGroup findSuitableParent(View view) {
    ViewGroup fallback = null;
    do {
        if (view instanceof CoordinatorLayout) {
            // We've found a CoordinatorLayout, use it
            return (ViewGroup) view;
        } else if (view instanceof FrameLayout) {
            if (view.getId() == android.R.id.content) {
                // If we've hit the decor content view, then we didn't find a CoL in the
                // hierarchy, so use it.
                return (ViewGroup) view;
            } else {
                // It's not the content view but we'll use it as our fallback
                fallback = (ViewGroup) view;
            }
        }

        if (view != null) {
            // Else, we will loop and crawl up the view hierarchy and try to find a parent
            final ViewParent parent = view.getParent();
            view = parent instanceof View ? (View) parent : null;
        }
    } while (view != null);

    // If we reach here then we didn't find a CoL or a suitable content view so we'll fallback
    return fallback;
}
```
    语句解释：
    -  这段代码主要的作用是，从我们传递给Snackbar的View开始往上找，直到找到CoordinatorLayout或FrameLayout，然后Snackbar将被显示到找到的布局里。
    -  也就是说：
       -  如果界面中有CoordinatorLayout或android.R.id.content对象，则Snackbar会被直接放进去。
       -  如果界面中没有找到这两者中的任何一个，则Snackbar会被放到最后找到的（也就是最外层的）FrameLayout中去。
       -  因此网上有人说不要传递给Snackbar一个ScrollView对象的说法不完全成立，因为若你的布局中有android.R.id.content，则就不用担心。

<br>　　另外，有哥们在[《Snackbar使用及其注意事项》](http://blog.csdn.net/jywangkeep_/article/details/46405301)中说多次弹出Snackbar会让内存不足：

	-  笔者认为这个问题完全不用担心，就算可用内存变成0了，这都没关系，只要Snackbar不存在内存泄漏就行。
	-  因为当系统需要分配新内存且检测到内存不足时，就会自动触发gc，这样就会瞬间把之前的Snackbar占据的内存给回收回来。
	-  不信你可以写个demo，在真机上运行看看，当可用内存为0的时候，是不是瞬间就还原了。

<br>
### TabLayout ###
　　`TabLayout`用来实现`Tabs`选项卡界面，效果类似网易新闻客户端的Tab。

<center>
![TabLayout显示效果](http://www.jcodecraeer.com/uploads/20150731/1438306976405961.gif)
</center>

　　其实在`Github`上有很多开源库可以实现这个效果，只是谷歌把它官方化了，使得开发者无需引用第三方库就能使用。

　　它的用法网上有很多教程，笔者在这里简单说一下它的特点：

	-  支持Tab页滚动。
	-  支持和ViewPager连动。
	-  支持各种基础操作：事件监听、动态增删Tab等等。
　　更多的细节不打算细说，推荐阅读：[《android design library提供的TabLayout的用法》](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0731/3247.html)。

<br>
### FloatingActionButton ###
　　顾名思义，`FloatingActionButton`是一个浮动按钮，它的特点就是可以浮动显示在其它控件之上。

<br>　　从源码上可以看出，它本质上就是一个按钮：
``` java
public class FloatingActionButton extends ImageButton {
    // 省略若干行代码...
}
```
    语句解释：
    -  FloatingActionButton继承自我们早就知道的ImageButton类。

<br>　　范例1：使用FloatingActionButton。

<center>
![程序运行效果](/img/android/android_o03_05.jpg)
</center>

``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/drawer"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="10dp">

    <android.support.design.widget.FloatingActionButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@mipmap/ic_launcher"
        app:fabSize="mini" />

    <android.support.design.widget.FloatingActionButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_done"
        app:elevation="1dp"
        app:backgroundTint="#000af4"
        app:fabSize="normal" />

</LinearLayout>
```
    语句解释：
    -  src属性，设置按钮所显示的图片。
    -  fabSize属性，设置按钮的尺寸，有mini(小尺寸)和normal(正常尺寸)两个取值。
    -  elevation属性，设置按钮的阴影高度。
    -  backgroundTint属性，设置按钮的背景色。
    -  layout_anchor属性，为浮动按钮指出它要浮动在哪个View上，取值是View的id。
    -  layout_anchorGravity属性，设置浮动按钮在View上的位置。


<br>　　需要说明的是，`FloatingActionButton`需要和配合`CoordinatorLayout`使用才能发挥它真正的威力，下面就来介绍它。

<br>
### CoordinatorLayout ###
　　`Coordinator`中文翻译为协调者、协调器，也就是说它本身不会在屏幕上显示内容，而是做为其它控件的协调器。
　　
　　这一点从的源码上可以看出来：
``` java
public class CoordinatorLayout extends ViewGroup implements NestedScrollingParent {
    // 省略若干行代码...
}
```
    语句解释：
    -  之前我们说过，默认情况下ViewGroup是不绘制任何内容的。

<br>　　范例1：放置控件。
``` xml
<android.support.design.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left|bottom"
        android:onClick="onClick"
        android:text="Button1" />

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right|top"
        android:text="Button2" />

</android.support.design.widget.CoordinatorLayout>
```
    语句解释：
    -  CoordinatorLayout的子元素需要使用layout_gravity属性来设置自己的位置。
       -  水平方向的取值有：start、end、left、right等。
       -  垂直方向的取值有：top、bottom等。
    -  另外，CoordinatorLayout对Snackbar做了增强：
       -  当Snackbar被放到CoordinatorLayout中显示时，那么在Snackbar自动关闭之前，用户还可以手动滑动删除它。

<br>　　范例2：与`FloatingActionButton`配合使用。
``` xml
<android.support.design.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.design.widget.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="end|bottom"
        android:layout_margin="16dp"
        android:onClick="onClick"
        android:src="@drawable/ic_done" />

</android.support.design.widget.CoordinatorLayout>
```
    语句解释：
    -  当Snackbar在显示的时候，往往出现在屏幕的底部，若我们把FloatingActionButton也放到屏幕右下角的话，那么当Snackbar弹出时，浮动按钮就会被遮挡。
    -  不过CoordinatorLayout专门为做了浮动按钮做了适配，当Snackbar弹出时：
       -  若Snackbar将会遮挡浮动按钮，则就会将浮动按钮向上移动，Snackbar关闭时再移回来。
       -  若不会遮挡浮动按钮，则不移动。
       -  对于其他非浮动按钮控件来说，即便是Snackbar遮挡了它们，它们也不会移动。

<br>　　事实上，`CoordinatorLayout`也可以和`Toolbar`组合在一起实现各种效果。
　　但是它们是无法直接配合的，我们需要在它们之间添加一个名为`AppBarLayout`的控件，该控件是`LinearLayout`的子类，默认垂直排列元素。

　　也就是说，我们的布局文件的结构最终的应该为：
``` xml
<CoordinatorLayout>

    <AppBarLayout>

        <Toolbar />

    </AppBarLayout>

    <RecyclerView />

</CoordinatorLayout>
```
    语句解释：
	-  整个配合过程为：
	   -  首先，使用CoordinatorLayout来监听RecyclerView、ViewPager等控件的滑动事件。
	   -  然后，CoordinatorLayout将它得到的滑动事件交给AppBarLayout。
	   -  接着，AppBarLayout来修改Toolbar的状态（显示或隐藏、尺寸等）。

<br>　　范例3：修改标题栏。
``` xml
<android.support.design.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/recycle"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior" />

    <android.support.design.widget.AppBarLayout
        android:id="@+id/appbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar">

        <android.support.v7.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            app:layout_scrollFlags="scroll|enterAlways"
            app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />

            <!-- 你可以在此处添加一个Button控件，但是不为它设置layout_scrollFlags属性，然后观察效果。-->
            <!-- 正确的效果应该是，Toolbar会随着滚动而显示或隐藏，而Button会一直显示。-->
            <!-- 因此比较常见的做法是，会在这里加一个TabLayout，这样就可以保证Tab总会显示了。-->
             

    </android.support.design.widget.AppBarLayout>
</android.support.design.widget.CoordinatorLayout>
```
    语句解释：
    -  首先，RecyclerView和AppBarLayout定义的位置无所谓，CoordinatorLayout会自动让标题栏显示在上方。
    -  然后，第11行代码用来让CoordinatorLayout来监听RecyclerView的滑动事件。
    -  接着要知道的是，AppBarLayout内部可以包含多个控件，因此当AppBarLayout接到CoordinatorLayout的事件后，会遍历所有子控件并进行判断：
       -  若当前子控件愿意接收滑动事件，则进行后续处理。
       -  若不愿接收，则跳过该子控件，继续检查下一个。
    -  也就是说，子控件使用layout_scrollFlags属性来告诉AppBarLayout它愿意接收事件，以及当事件发生时它希望的处理方式。
       -  如果愿意接收滑动事件，则取值中必须得包含scroll关键字。
       -  多个取值之间使用‘|’符号间隔。
    -  layout_scrollFlags属性的常用取值：
       -  enterAlways：不论RecyclerView当前滚动到何处，只要它向下滑动就隐藏标题栏，向上滚动就显示标题栏。
       -  enterAlwaysCollapsed：只有RecyclerView滚动到顶部时，才会显示和隐藏标题栏。
       -  exitUntilCollapsed：稍后介绍。


<br>　　我们还可以让`Toolbar`实现折叠效果，只需要使用`CollapsingToolbarLayout`包裹`Toolbar`即可。

<br>　　范例4：折叠标题栏。

<center>
![程序运行效果](http://www.jcodecraeer.com/uploads/allimg/150717/1G0543025-1.gif)
</center>

``` xml
<android.support.design.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/recycle"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior" />

    <android.support.design.widget.AppBarLayout
        android:id="@+id/appbar"
        android:layout_width="match_parent"
        android:layout_height="192dp"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar">

        <android.support.design.widget.CollapsingToolbarLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            app:contentScrim="?attr/colorPrimary"
            app:layout_scrollFlags="scroll|exitUntilCollapsed">

            <android.support.v7.widget.Toolbar
                android:id="@+id/toolbar"
                android:layout_width="match_parent"
                android:layout_height="?attr/actionBarSize"
                android:background="?attr/colorPrimary"
                app:layout_collapseMode="pin"
                app:popupTheme="@style/ThemeOverlay.AppCompat.Light" />
        </android.support.design.widget.CollapsingToolbarLayout>
    </android.support.design.widget.AppBarLayout>
</android.support.design.widget.CoordinatorLayout>
```
    语句解释：
    -  必须得为AppBarLayout显式的指定高度，Toolbar的高度不能是wrap_content，而需要是具体的数值。
    -  需要为Toolbar设置layout_collapseMode属性，且值为pin。
    -  contentScrim属性，ToolBar被折叠到顶部固定时候的背景。
    -  layout_collapseMode属性，设置折叠的方式，有两个取值：
       -  pin：固定模式，在折叠的时候最后固定在顶端，效果如上图所示。
       -  parallax：视差模式，在折叠的时候会有个视差折叠的效果，效果如下图所示。

<br>　　范例5：视差滚动。

<center>
![程序运行效果](http://www.jcodecraeer.com/uploads/allimg/150717/1G0541510-7.gif)
</center>

``` xml
<android.support.design.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.RecyclerView
        android:id="@+id/recycle"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior" />

    <android.support.design.widget.AppBarLayout
        android:id="@+id/appbar"
        android:layout_width="match_parent"
        android:layout_height="192dp"
        android:theme="@style/ThemeOverlay.AppCompat.Dark.ActionBar">

        <android.support.design.widget.CollapsingToolbarLayout
            android:id="@+id/collapsing_toolbar"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            app:layout_scrollFlags="scroll|exitUntilCollapsed"
            android:fitsSystemWindows="true"
            app:contentScrim="?attr/colorPrimary"
            app:expandedTitleMarginStart="48dp"
            app:expandedTitleMarginEnd="64dp">

            <ImageView
                android:id="@+id/backdrop"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="centerCrop"
                android:src="@drawable/cheese_1"
                android:fitsSystemWindows="true"
                app:layout_collapseMode="parallax" />

            <android.support.v7.widget.Toolbar
                android:id="@+id/toolbar"
                android:layout_width="match_parent"
                android:layout_height="?attr/actionBarSize"
                app:popupTheme="@style/ThemeOverlay.AppCompat.Light"
                app:layout_collapseMode="pin" />

        </android.support.design.widget.CollapsingToolbarLayout>

    </android.support.design.widget.AppBarLayout>

    <android.support.design.widget.FloatingActionButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ic_done"
        app:layout_anchor="@id/appbar"
        app:layout_anchorGravity="bottom|right|end" />

</android.support.design.widget.CoordinatorLayout>
```
    语句解释：
    -  使用layout_anchorGravity和layout_anchor属性可以让FloatingActionButton可以跟着AppBarLayout一起消失。




<br>**本节参考阅读：**
- [官方博客：Android Design Support Library](http://android-developers.blogspot.hk/2015/05/android-design-support-library.html)
- [中文翻译：Android的材料设计兼容库](http://www.jcodecraeer.com/a/anzhuokaifa/developer/2015/0531/2958.html)
- [通过 Navigation View 创建导航抽屉](http://myihsan.farbox.com/post/use-navigation-view-to-make-navigation-drawer)
- [Android SnackBar](http://www.cnblogs.com/wingyip/p/4604461.html)
- [Android M新控件之AppBarLayout，NavigationView，CoordinatorLayout，CollapsingToolbarLayout的使用](http://blog.csdn.net/feiduclear_up/article/details/46514791)
- [探索新的Android Material Design支持库](https://www.aswifter.com/2015/06/21/andorid-material-design-support-library/)
- [CoordinatorLayout与滚动的处理](http://www.jcodecraeer.com/a/anzhuokaifa/androidkaifa/2015/0717/3196.html)
- [android CoordinatorLayout使用](http://blog.csdn.net/xyz_lmn/article/details/48055919)


<br><br>


