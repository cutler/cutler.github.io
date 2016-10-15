title: 优化篇　第一章 插件化开发
date: 2016-3-14 16:41:24
categories: Android开发 - 不屈白银
---
　　本章来讲解一下Android插件化开发相关的知识。

# 第一节 基础知识 #
<br>　　2015年是Android插件化技术突飞猛进的一年，随着业务的发展各大厂商都碰到了Android Native平台的瓶颈：

	-  从技术上讲，业务逻辑的复杂导致代码量急剧膨胀，各大厂商陆续出到65535方法数的天花板；同时，运营为王的时代对于模块热更新提出了更高的要求。
	-  在业务层面上，功能模块的解耦以及维护团队的分离也是大势所趋；各个团队维护着同一个App的不同模块，如果每个模块升级新功能都需要对整个app进行升级，那么发布流程不仅复杂而且效率低下；在讲究小步快跑和持续迭代的移动互联网必将遭到淘汰。

　　插件化技术听起来高深莫测，实际上要解决的就是两个问题：`代码加载`和`资源加载`。
<!-- more -->
<br>　　**代码加载**
	-  不同于Java的是，在Android中并不是说类加载进来就可以用了，很多组件都是有“生命”的（比如Activity）；因此对于这些有血有肉的类，必须给它们注入活力，也就是所谓的组件生命周期管理；
	-  另外，如何管理加载进来的类也是一个问题。假设多个插件依赖了相同的类，是抽取公共依赖进行管理还是插件单独依赖？

<br>　　**资源加载**

	-  资源加载方案大家使用的原理都差不多，都是用AssetManager的隐藏方法addAssetPath。
	-  但是这里面还是存在不少问题：如何正确的从多个插件中正确加载这些资源？如何处理插件与宿主的资源冲突？等等。

<br>　　接下来，笔者通过几个简单的范例，来介绍如何实现动态加载代码和资源。

## ClassLoader ##

　　笔者在[《入门篇　第四章 数据存取》](http://cutler.github.io/android-A04/#ClassLoader)中简单的介绍了`Classloader`的作用，本节将通过源码阅读，来看一下它的内部实现。

<br>　　**双亲委托机制**

	-  任何自定义ClassLoader都必须继承抽象类ClassLoader，并为其paren字段初始化。
	-  任何自定义ClassLoader在加载一个类之前都会先委托其parent去加载，只有parent加载失败才会自己加载。
	   -  这样既可以防止重复加载，又可以排除安全隐患（防止用户替换系统核心类）。

<br>　　范例1：`ClassLoader`类。
``` java
public abstract class ClassLoader {

    // 此处省略若干代码

    private ClassLoader parent;

    // 此处省略若干代码

    ClassLoader(ClassLoader parentLoader, boolean nullAllowed) {
        if (parentLoader == null && !nullAllowed) {
            throw new NullPointerException("parentLoader == null && !nullAllowed");
        }
        parent = parentLoader;
    }

    // 此处省略若干代码
}
```

<br>　　事实上，双亲委托机制是在`loadClass()`方法实现的，如果你要想避开这个机制，必须重写`loadClass()`方法。
``` java
protected Class<?> loadClass(String className, boolean resolve) throws ClassNotFoundException {
    // 首先查看该类是否已在缓存中了。
    Class<?> clazz = findLoadedClass(className);

    if (clazz == null) {
        ClassNotFoundException suppressed = null;
        try {
            // 然后调用父类去执行加载的任务
            clazz = parent.loadClass(className, false);
        } catch (ClassNotFoundException e) {
            suppressed = e;
        }

        if (clazz == null) {
            try {
                // 最后才会由自己加载
                clazz = findClass(className);
            } catch (ClassNotFoundException e) {
                e.addSuppressed(suppressed);
                throw e;
            }
        }
    }

    return clazz;
}
```
    语句解释：
    -  从上面加载类的顺序中我们可以知道，loadClass会先看这个类是不是已经被loaded过，没有的话则去他的parent去找，如此递归，称之为双亲委托。

<br>　　**Android的类加载器**

　　需要知道的是，`Dalvik`虚拟机毕竟不算是标准的`Java`虚拟机，因此在类加载机制上，它们有相同的地方，也有不同之处。我们必须区别对待。

	-  因此Android为我们从ClassLoader派生出了两个类：DexClassLoader和PathClassLoader。
	-  这两个类都属于符合双亲委派模型的类加载器（因为它们没有重写loadClass方法）。
	-  其中DexClassLoader类，可以在运行时动态加载并解释执行包含在jar或apk文件内的dex文件，也是我们接下来要用到的类。

<br>**本节参考阅读：**
- [DexClassLoader 实现 Android 插件加载](http://blog.rincliu.com/posts/150419-classloader/) 
- [Android类动态加载技术](http://www.blogjava.net/zh-weir/archive/2011/10/29/362294.html) 


## 加载代码 ##

　　接下来我们使用`DexClassLoader`来加载一个普通的`jar`文件。

<br>　　范例1：创建Person类。
``` java
package com.cutler.classload;

public class Person {
    public static void say() {
        System.out.println("Hello !!!");
    }
}
```
    语句解释：
    -  在Eclipse创建一个新项目，然后在项目中创建这个Person类即可。

<br>　　接着，将这个`Person`导出成一个`test.jar`文件，如果不会导出，请点击[ 这里 ](http://blog.csdn.net/bboyfeiyu/article/details/11710497)。
　　接着，将`test.jar`上传到手机的SD卡根目下，并在Android项目中执行下面`范例2`的代码。

<br>　　范例2：动态加载Person类。
``` java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // test.jar在SD卡上的位置
        File filePath = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/test.jar");
        // test.jar文件的解压目录，即/data/data/packagename/app_dex/下面
        File outputDir = getDir("dex", Context.MODE_PRIVATE);
        // 创建一个DexClassLoader对象
        DexClassLoader classLoader = new DexClassLoader(
                filePath.getAbsolutePath(),
                outputDir.getAbsolutePath(), null, getClassLoader());
        try {
            // 使用类加载器加载类文件
            Class<?> clazz = classLoader.loadClass("com.cutler.classload.Person");
            // 获取say方法
            Method m = clazz.getMethod("say");
            // 调用say方法，由于它是静态方法所以参数传递null即可
            m.invoke(null);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
        }
    }
}
```
    语句解释：
    -  如果不出意外的话，这段代码并不会成功运行，而是会抛异常。
    -  这是因为普通的jar文件是没法被DexClassLoader加载的，我们需要使用sdk里的dx工具优化一下jar文件才行。

<br>　　范例3：dx工具。
``` c
dx --dex --output=newtest.jar test.jar
```
    语句解释：
    -  将test.jar拷贝到dx工具所在的目录后，执行这条命令即可。
    -  dx工具在“android-sdk-windows\build-tools\选择一个版本\”下面。

<br>　　然后再把`newtest.jar`放到手机中就可以了。

<br>　　**安全提醒**

　　需要注意的是，在实际开发的时候最好不要把`test.jar`放到SD卡上，有两个原因：

	-  首先，如果用户把SD卡上的test.jar文件给删除的话，程序就无法再加载了。
	-  然后，SD卡上的test.jar文件是可以被任意程序修改的，因此它可能会遭到恶意程序的代码注入。
	   -  如果必须放到SD卡上的话，那每次加载之前最好对jar或dex文件做完整性校验。

　　最好的做法是把文件放到`私有目录(/data/data/...)`或者直接放到`apk`中。

<br>**本节参考阅读：**
- [Java ClassLoader基础及加载不同依赖 Jar 中的公共类](http://www.trinea.cn/android/java-loader-common-class/) 

## 加载资源 ##
　　加载资源的操作也很简单，需要用到`ClassLoader`和`AssetManager`类。

<br>　　首先，来创建一个新的Android项目，包名为`com.cutler.androidtest2`，并随便添加几个资源（如字符串、图片等）。
　　然后，打出`apk`，并将`apk`放到SD卡上。

<br>　　范例1：加载未安装apk中的资源。
``` java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView img = (ImageView) findViewById(R.id.img);

        // apk文件的路径
        String pluginPath = Environment.getExternalStorageDirectory()
                .getAbsolutePath() + "/app-debug.apk";
        // 创建ClassLoader，稍后会用到。
        ClassLoader classLoader = new DexClassLoader(
                new File(pluginPath).getAbsolutePath(),
                getDir("dex", Context.MODE_PRIVATE).getAbsolutePath(), null, getClassLoader());

        // 新创建一个Resource对象。
        Resources pluginRes = getPluginResource(pluginPath);

        // 获取文本的资源id。
        int resId = getPluginResourceId(classLoader, "com.cutler.androidtest2", "string", "text");
        System.out.println(pluginRes.getString(resId));
        // 获取图片的资源id。
        resId = getPluginResourceId(classLoader, "com.cutler.androidtest2", "mipmap", "mv");
        img.setImageDrawable(pluginRes.getDrawable(resId));
    }

    public Resources getPluginResource(String pluginPath) {
        Resources pluginRes = null;
        try {
            // 创建一个新的AssetManager对象。
            AssetManager assetManager = AssetManager.class.newInstance();
            // 调用addAssetPath方法，将apk的路径放上去。
            Method addAssetPath = assetManager.getClass().getMethod("addAssetPath", String.class);
            addAssetPath.invoke(assetManager, pluginPath);
            Resources superRes = super.getResources();
            // 使用assetManager创建一个新的Resources对象。
            pluginRes = new Resources(assetManager, superRes.getDisplayMetrics(),
                    superRes.getConfiguration());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pluginRes;
    }

    public int getPluginResourceId(ClassLoader classLoader, String packageName, 
           String resType, String name) {
        int resId = 0;
        try {
            // 反射apk中的R文件，获取资源所对应的id。
            Class clazz = classLoader.loadClass(packageName + ".R$" + resType);
            Field property = clazz.getField(name);
            // 由于资源都是静态的，所以这里传null。
            resId = property.getInt(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resId;
    }

}
```
    语句解释：
    -  默认的Resources对象只能加载当前APK中的资源，想要加载其他APK的资源，就需要手动创建一个Resources对象。
    -  由于新Resources对象是由AssetManager创建的，而该AssetManager查找文件时会从apk中查找，所以新Resources对象也会从apk中查找文件。

<br>　　范例2：加载已安装apk中的资源。
``` java
public class MainActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ImageView img = (ImageView) findViewById(R.id.img);
        String pkgName = "com.cutler.androidtest2";
        try {
            // 获取指定App的Context对象，如果该App未安装，则会抛异常。
            Context context = createPackageContext(pkgName,
                    Context.CONTEXT_IGNORE_SECURITY | Context.CONTEXT_INCLUDE_CODE);
            Resources pluginRes = context.getResources();
            // 加载文本
            System.out.println(pluginRes.getString(
                pluginRes.getIdentifier("text","string", pkgName)));
            // 加载图片
            img.setImageDrawable(pluginRes.getDrawable(
                pluginRes.getIdentifier("mv","mipmap", pkgName)));
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

}
```
    语句解释：
    -  从上面的代码可以看出来，如果App已经安装在手机上了，则我们可以很容易加载它的资源。

# 第二节 插件化开源库 #

　　通过上面的学习可以发现，动态加载代码和资源的过程其实十分的简单；但是实际开发中的情况要复杂的多，可能会要求我们能动态加载四大组件，这就会有很多问题：

	-  Activity由代码和布局组成，布局如何加载？
	-  由于是我们自己实例化的Activity，它的生命周期方法如何调用？so文件怎么加载？
	-  如何保证在各种机型、各版本系统上都正常运行不报错？
	-  插如何管理、如何升级？

　　以上这些问题都需要去解决，如果只靠一个人的话就很慢了，所以笔者更推荐使用开源的插件库。

<br>　　目前国内开源的较成熟的插件方案有`DL`和`DroidPlugin`：

	-  DL方案仅仅对Framework的表层做了处理，严重依赖that语法，编写插件代码和主程序代码需单独区分。
	-  DroidPlugin通过Hook增强了Framework层的很多系统服务，开发插件就跟开发独立app差不多。

　　以Activity生命周期的管理为例：
	-  DL的代理方式就像是牵线木偶，插件只不过是操纵傀儡而已。
	-  而DroidPlugin则是借尸还魂，插件就是一个正常的APK，它自己并不知道自己是插件。
	   -  DroidPlugin Hook了系统几乎所有的Sevice，欺骗了大部分的系统API；
	   -  掌握这个Hook过程需要掌握很多系统原理，因此学习DroidPlugin对于整个Android FrameWork层大有裨益。

<br>　　最后，笔者有两点要说：

	-  首先，虽然笔者推荐去使用开源库，但不代表我们不需要去了解开源库是如何工作的。所以下一节会在源码层次来介绍这两个库的实现原理。
	-  然后，就目前而言，笔者更偏向于使用DroidPlugin，上面介绍它的优点不太直观，稍后大家就会明白它的过人之处。

## DL ##
　　`DL` 全称[ dynamic-load-apk ](https://github.com/singwhatiwanna/dynamic-load-apk)，是由[ singwhatiwanna ](http://blog.csdn.net/singwhatiwanna)发起的一个插件化开源库。

<br>**实现原理**
<br>　　现有的问题：

	-  所谓的插件化，其实包括“宿主”和“插件”两部分，插件可以是从网上下载到本地的。
	-  由于插件未安装到设备上的，所以当我们过反射实例化插件里的Activity时，创建出来的只是一个普通的对象，它是没有Context对象的，这意味着如果我们调用这个Activity的getResources等方法，就会抛异常。
	   -  也就是说，以前Activity的Context对象是系统设置给它的，而我们自己实例化Activity的话，它就没有Context对象了。
	   -  我们都知道，Context对象可以做很多事，当Activity没有Context对象时，可以说是寸步难行了，甚至连布局都没法设置。
<br>　　`DL` 是这么解决问题的：

	-  首先，在宿主项目中定义一个ProxyActivity类，它是正经的Activity。
	-  然后，每当宿主项目需要启动插件里的ActivityA时，DL框架都会先启动自己的ProxyActivity。
	-  接着，再在ProxyActivity中反射并实例化ActivityA的对象，接着把ProxyActivity的引用传递给ActivityA对象。
	-  最后，当ActivityA需要使用Context的时候，就使用ProxyActivity的Context对象。

<br>　　整个过程说起来简单，实际操作的时候会遇到各种问题，我们接下来就仿写一下这个过程。


<br>　　范例1：在宿主项目中，创建`ProxyActivity`类。
``` java
public class ProxyActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String pluginPath = Environment.getExternalStorageDirectory()
                .getAbsolutePath() + "/app-debug.apk";
        ClassLoader classLoader = new DexClassLoader(
                new File(pluginPath).getAbsolutePath(),
                getDir("dex", Context.MODE_PRIVATE).getAbsolutePath(), null, getClassLoader());

        try {
            // 创建插件项目中的MainActivity的实例。
            Class<?> clazz = classLoader.loadClass("com.cutler.androidtest2.MainActivity");
            Constructor constructor = clazz.getConstructor();
            Activity pluginActivity = (Activity) constructor.newInstance();
            // 将ProxyActivity设置到pluginActivity中。
            Method m1 = clazz.getMethod("setRemoteProxyActivity", Activity.class);
            m1.invoke(pluginActivity, this);
            // 调用pluginActivity的onCreate方法，并把插件的本地路径传递过去。
            Method m2 = clazz.getDeclaredMethod("onCreate", Bundle.class);
            m2.setAccessible(true);
            Bundle bundle = new Bundle();
            bundle.putString("pluginPath", pluginPath);
            m2.invoke(pluginActivity, bundle);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```
    语句解释：
    -  宿主项目与插件项目不能包含相同的类，否则会抛异常：
       -  Class ref in pre-verified class resolved to unexpected implementation
       -  比如宿主项目引用了suport-v7库，那么插件项目就不能在编译的时候，也把suport-v7库放入apk中。


<br>　　范例2：插件项目中的`MainActivity`。
``` java
public class MainActivity extends Activity {
    // 默认情况下，让它指向自己，这么做是为了可以单独运行插件。
    private Activity remoteProxyActivity = this;

    @Override
    protected void onCreate(Bundle bundle) {
        Resources resources = null;
        if (remoteProxyActivity == this) {
            super.onCreate(bundle);
            resources = getResources();
        } else {
            // 程序如果走此流程，则意味着当前Activity是被人当插件使用的。
            // 所以不会调用super.onCreate()方法，因为当前Activity只是一个傀儡，它并不是真的Activity。

            // 读取宿主的ProxyActivity传递过来的，当前插件的路径，并为当前插件新建一个Resources对象。
            resources = getPluginResource(bundle.getString("pluginPath"));
        }
        // 为了统一处理，这里通过Resources加载一个XmlPullParser，在从XmlPullParser对象中创建布局。
        // 之所以不使用LayoutInflater.from(remoteProxyActivity).inflate(int, ViewGroup)加载布局
        // 是因为在该方法内部会使用remoteProxyActivity的Resources对象去加载资源，也就是宿主的Resources对象，
        // 但是这个对象是无法加载插件中的资源的。
        XmlPullParser parser = resources.getLayout(R.layout.activity_main);
        View contentView = LayoutInflater.from(remoteProxyActivity).inflate(parser, null);

        // 将加载好的布局设置到宿主的ProxyActivity中。
        // 到这里大家应该是明白了，上面为什么说DL的实现机制是“操纵傀儡”了吧。
        // 即在宿主里开启真正的Activity，而该Activity的布局、生命周期处理都是由插件来处理。
        // 但插件仅仅是处理，它处理的结果需要放到宿主的那个Activity上展现。
        remoteProxyActivity.setContentView(contentView);

        // 为布局中的控件初始化数据。
        // 需要注意的是，不要让布局文件中的控件引用任何资源，比如让TextView引用string资源等。
        // 而应该在代码里，使用插件的Resources对象，来动态为它们设置值。
        ImageView imageView = (ImageView) contentView.findViewById(R.id.image);
        imageView.setImageDrawable(resources.getDrawable(R.mipmap.mv));
        Button button = (Button) contentView.findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Toast.makeText(remoteProxyActivity,"click from plugin", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public Resources getPluginResource(String pluginPath) {
        Resources pluginRes = null;
        try {
            AssetManager assetManager = AssetManager.class.newInstance();
            Method addAssetPath = assetManager.getClass().getMethod("addAssetPath", String.class);
            addAssetPath.invoke(assetManager, pluginPath);
            Resources superRes = remoteProxyActivity.getResources();
            pluginRes = new Resources(assetManager, superRes.getDisplayMetrics(),
                    superRes.getConfiguration());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pluginRes;
    }

    public void setRemoteProxyActivity(Activity activity) {
        this.remoteProxyActivity = activity;
    }
}
```
    语句解释：
    -  注释写的很清楚了，也是不多说。

<br>　　以上就模仿了`DL`框架的实现原理，接下来我们就跟着程序的执行流程，来阅读源码。

<br>**源码阅读**

　　很显然，插件化开发的第一步就是，让宿主项目在运行时把插件项目加载到内存中。
　　而在`DL`中，宿主项目可以使用`DLPluginManager`类的`loadApk`方法来完成加载任务，我们来看一下源码：
``` java
public DLPluginPackage loadApk(String dexPath) {
    return loadApk(dexPath, true);
}

public DLPluginPackage loadApk(final String dexPath, boolean hasSoLib) {
    mFrom = DLConstants.FROM_EXTERNAL;
    // 读取插件apk的信息，如果插件apk不存在，则返回null。
    PackageInfo packageInfo = mContext.getPackageManager().getPackageArchiveInfo(dexPath,
            PackageManager.GET_ACTIVITIES | PackageManager.GET_SERVICES);
    if (packageInfo == null) {
        return null;
    }
    // 初始化插件apk相关的参数（ClassLoader、Resources、AssetManager对象）。
    // 如果已经初始化过了，则不会重复初始化。
    DLPluginPackage pluginPackage = preparePluginEnv(packageInfo, dexPath);
    // 如果需要，则拷贝so文件，若so已经拷贝过了（依靠最后修改时间来判断）则不会重复拷贝。
    if (hasSoLib) {
        copySoLib(dexPath);
    }

    return pluginPackage;
}
```
    语句解释：
    -  至于preparePluginEnv方法内部的代码是什么样的，请自行去查看源码。

<br>　　当加载完插件之后，就可以调用`DLPluginManager`类的`startPluginActivity`方法来启动`Activity`了。
``` java
public int startPluginActivity(Context context, DLIntent dlIntent) {
    return startPluginActivityForResult(context, dlIntent, -1);
}

public int startPluginActivityForResult(Context context, DLIntent dlIntent, int requestCode) {
    // 此处省略若干代码，主要是做安全性校验，比如未调用loadApk初始化插件就调用此方法启动Activity。

    // 获取ProxyActivity，若获取失败则返回。
    Class<? extends Activity> activityClass = getProxyActivityClass(clazz);
    if (activityClass == null) {
        return START_RESULT_TYPE_ERROR;
    }

    // 将要启动的插件里的Activity放到参数里，然后去启动宿主项目中的ProxyActivity。
    dlIntent.putExtra(DLConstants.EXTRA_CLASS, className);
    dlIntent.putExtra(DLConstants.EXTRA_PACKAGE, packageName);
    dlIntent.setClass(mContext, activityClass);
    performStartActivityForResult(context, dlIntent, requestCode);
    return START_RESULT_SUCCESS;
}

private Class<? extends Activity> getProxyActivityClass(Class<?> clazz) {
    Class<? extends Activity> activityClass = null;
    // 如果待启动的插件中的类是DLBasePluginActivity的子类，则宿主项目就启动DLProxyActivity类。
    // 如果是DLBasePluginFragmentActivity的子类，则宿主就启动DLProxyFragmentActivity。
    // 言外之意就是，插件中的所有Activity都必须继承这两个类，否则是无法被启动的。
    if (DLBasePluginActivity.class.isAssignableFrom(clazz)) {
        activityClass = DLProxyActivity.class;
    } else if (DLBasePluginFragmentActivity.class.isAssignableFrom(clazz)) {
        activityClass = DLProxyFragmentActivity.class;
    }

    return activityClass;
}
```
    语句解释：
    -  另外，Class类的isAssignableFrom方法用来比较两个Class对象，而instanceof关键字是判断一个对象是否属于某个类。

<br>　　接着，我们去查看`DLProxyActivity`类的源码：
``` java
public class DLProxyActivity extends Activity implements DLAttachable {
    // 插件Activity的引用。
    // 刚才说了插件中的Activity必须继承DLBasePluginActivity和DLBasePluginFragmentActivity二者之一。
    // 而它们二者又都实现了DLPlugin接口，所以这个mRemoteActivity其实就是一个Activity对象。
    protected DLPlugin mRemoteActivity;
    // 用来连接DLProxyActivity和mRemoteActivity类的一个业务类对象。
    private DLProxyImpl impl = new DLProxyImpl(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 当DLProxyActivity被启动的时候，调用业务类对象的onCreate方法。
        impl.onCreate(getIntent());
    }

    @Override
    public void attach(DLPlugin remoteActivity, DLPluginManager pluginManager) {
        mRemoteActivity = remoteActivity;
    }

    // 此处省略若干代码
    // 主要都是一些生命周期方法，DLProxyActivity会调用mRemoteActivity去处理。
}
```
    语句解释：
    -  这里需要注意的是DLProxyActivity类实现了DLAttachable接口，并重写了接口中的attach方法，稍后会用到。

<br>　　接着，我们去查看`DLProxyImpl`类的源码：
``` java
public void onCreate(Intent intent) {
    intent.setExtrasClassLoader(DLConfigs.sPluginClassloader);

    mPackageName = intent.getStringExtra(DLConstants.EXTRA_PACKAGE);
    mClass = intent.getStringExtra(DLConstants.EXTRA_CLASS);
    Log.d(TAG, "mClass=" + mClass + " mPackageName=" + mPackageName);

    mPluginManager = DLPluginManager.getInstance(mProxyActivity);
    mPluginPackage = mPluginManager.getPackage(mPackageName);
    mAssetManager = mPluginPackage.assetManager;
    mResources = mPluginPackage.resources;

    initializeActivityInfo();
    handleActivityInfo();
    // 启动插件Activity。
    launchTargetActivity();
}
protected void launchTargetActivity() {
    try {
        // 创建插件Activity的对象
        Class<?> localClass = getClassLoader().loadClass(mClass);
        Constructor<?> localConstructor = localClass.getConstructor(new Class[] {});
        Object instance = localConstructor.newInstance(new Object[] {});
        mPluginActivity = (DLPlugin) instance;

        // 将插件Activity的引用设置到代理Activity中
        ((DLAttachable) mProxyActivity).attach(mPluginActivity, mPluginManager);

        // 将代理Activity的引用也设置到插件Activity中
        mPluginActivity.attach(mProxyActivity, mPluginPackage);

        // 手工调用插件Activity的onCreate方法
        Bundle bundle = new Bundle();
        bundle.putInt(DLConstants.FROM, DLConstants.FROM_EXTERNAL);
        mPluginActivity.onCreate(bundle);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

<br>　　至此程序的流程就走到了插件中了，由于插件Activity需要继承`DLBasePluginActivity`类，所接着来看它的源码：
``` java
public void attach(Activity proxyActivity, DLPluginPackage pluginPackage) {
    Log.d(TAG, "attach: proxyActivity= " + proxyActivity);
    mProxyActivity = (Activity) proxyActivity;
    that = mProxyActivity;
    mPluginPackage = pluginPackage;
}

@Override
public void onCreate(Bundle savedInstanceState) {
    if (savedInstanceState != null) {
        mFrom = savedInstanceState.getInt(DLConstants.FROM, DLConstants.FROM_INTERNAL);
    }
    if (mFrom == DLConstants.FROM_INTERNAL) {
        super.onCreate(savedInstanceState);
        mProxyActivity = this;
        that = mProxyActivity;
    }

    mPluginManager = DLPluginManager.getInstance(that);
    Log.d(TAG, "onCreate: from= "
            + (mFrom == DLConstants.FROM_INTERNAL ? "DLConstants.FROM_INTERNAL" : "FROM_EXTERNAL"));
}
```
    语句解释：
    -  其中mFrom用来区别插件Activity当前是被宿主加载的还是自己启动的，这么做是为了在开发插件的时候可以调试。


<br>　　通过以上源码阅读可以知道，DL框架的实现方式就是我们前面说的那样，由于篇幅有限，就不继续深入介绍了。
<br>　　以上是简单的介绍了`DL`框架的基本原理，而`DL`里面所做的事情要多得多：

	-  支持Service
	-  支持在插件中用R访问plugin资源
	-  支持so加载、生命周期处理、插件管理等等


<br>**使用步骤**

　　在使用`DL`进行插件化开发之前，需要先将`DL`的源码打包成一个`jar`，然后再将它分别引入到`宿主`和`插件`项目中。

	-  也就是说，宿主项目和插件项目都需要引用jar。
	-  但是，它们也都分别只会使用到这个jar包中的某几个类，而并不是全部的类。



　　接下来简单的说一下`DL`的使用步骤。

<br>　　第一步，前往[ dynamic-load-apk ](https://github.com/singwhatiwanna/dynamic-load-apk)将`DL`库的源代码下载下来，并导入到`Android Studio`中。

	-  下载完毕后，先选中“lib”模块，然后打开Android Studio的Build菜单并执行Build Project。
	-  完成后，AS会在lib/build/intermediates/bundles/debug（这个目录以后版本可能会变）里生成一个classes.jar。
	-  classes.jar就是我们稍后会用到的DL库，把它拷贝出来并改名为dl.jar即可。

<br>　　第二步，创建一个名为`DLHost`的宿主项目，并将`dl.jar`放入其`libs`目录下，并将下面代码放到清单文件中。
``` xml
<activity
    android:name="com.ryg.dynamicload.DLProxyActivity"
    android:label="@string/app_name" >
    <intent-filter>
        <action android:name="com.ryg.dynamicload.proxy.activity.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
<activity
    android:name="com.ryg.dynamicload.DLProxyFragmentActivity"
    android:label="@string/app_name" >
    <intent-filter>
        <action android:name="com.ryg.dynamicload.proxy.fragmentactivity.VIEW" />

        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>
<service android:name="com.ryg.dynamicload.DLProxyService" />
```
    语句解释：
    -  就像之前说的，DL是通过代理的方式实现的插件化，所以我们需要在宿主项目中配置代理Activity、Service。


<br>　　第三步，在`DLHost`中加载插件。
``` java
public void onClick(View view) {
    // 加载插件
    DLPluginPackage pluginPackage = DLPluginManager.getInstance(this)
            .loadApk(Environment.getExternalStorageDirectory() + File.separator + "plugin.apk");
    // 如果加载成功，则启动其内的Activity
    if(pluginPackage != null) {
        DLIntent intent = new DLIntent("com.cutler.dlplugin","com.cutler.dlplugin.MainActivity");
        DLPluginManager.getInstance(this).startPluginActivity(this, intent);
    }
}
```
    语句解释：
    -  本范例用来加载SD卡根目录下的“plugin.apk”。

<br>　　第四步，创建一个名为`DLPlugin`的插件项目，并将`dl.jar`放入其`libs`目录下，同时修改它的依赖。
``` gradle
dependencies {
    provided fileTree(dir: 'libs', include: ['*.jar'])
}
```
    语句解释：
    -  需要注意的是，本范例使用的是“provided”关键字，它表示当前项目在打包的时候，不会把libs目录下的jar给放入APK中。
    -  这么做的目的是防止插件和宿主项目引用重复的jar包，因为dl.jar已经在宿主项目中存在了。
    -  使用provided关键字后，如果直接安装插件项目的apk的话，运行时就会抛异常，因为系统找不到apk所需要的类。
    -  但是如果是在宿主项目动态加载插件项目的话，就不会有问题，因为宿主项目已经把dl.jar加载到进程中了。

<br>　　第五步，让`DLPlugin`的`MainActivity`继承`DLBasePluginActivity`。
``` java
public class MainActivity extends DLBasePluginActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```
    语句解释：
    -  继承之后，就可以让宿主项目加载MainActivity了。
    -  需要注意的是，由于插件中的MainActivity并不是真正的启动，所以不要在它里面使用this关键字，而应该使用DL为我们提供的that关键字。
       -  如果你不知道that关键字是什么，那请自行阅读DL的源码，笔者只能帮你到这了。


<br>**本节参考阅读：**
- [DL动态加载框架技术文档](http://blog.csdn.net/singwhatiwanna/article/details/40283117)
- [DynamicLoadApk 源码解析](https://github.com/aosp-exchange-group/android-open-project-analysis/tree/master/tool-lib/plugin/dynamic-load-apk)

## DroidPlugin ##
　　在正式介绍`DroidPlugin`之前，我们得学一下代理相关的知识。
<br>　　本节介绍的知识主要参考自[ 《Android插件化原理解析》 ](http://weishu.me/2016/01/28/understand-plugin-framework-overview/)，推荐大家去阅读该系列文章。

	-  不过，如果你以为只看他写的博客就能日天的话，呵呵，那你就错了。
	-  他写的知识我会写，他没写的我也会写，所以看我写的，才能日天！ 简单的说，哥就是抄，也能抄出自己的风格！

<br>　　代理是什么？为什么需要代理呢？

	-  其实程序里的代理与日常生活中的“代理”，“中介”差不多；比如你想海淘买东西，不可能亲自飞到国外去购物，这时候我们使用第三方海淘服务比如考拉海购等；
	-  代理其实是有两面性的：
	   -  好处是：方便、省时间。
	   -  坏处是：由于我们不是和最终商家沟通，而是和代理者沟通，因此代理可以提高商品的价格、或者将购买的正品留下，换成次品再发给我们等。

　　在程序中，我们通常用`“代理”`来对系统API进行拦截，或者修改原方法的参数和返回值，从而实现某种目的。

　　用文字说有点难以理解，下面通过代码来详细介绍。

<br>**静态代理**

　　静态代理，是最原始的代理方式；假设我们有一个购物的接口，如下：
``` java
public interface Shopping {
    // 传递钱进去，返回买到的商品。
    Object[] doShopping(long money);
}
```
　　它有一个原始的实现，我们可以理解为亲自，即亲自去商店购物：
``` java
public class ShoppingImpl implements Shopping {
    @Override
    public Object[] doShopping(long money) {
        System.out.println("逛淘宝 ,逛商场,买买买!!");
        System.out.println(String.format("花了%s块钱", money));
        return new Object[] { "鞋子", "衣服", "零食" };
    }
}
```
　　好了，现在我们自己没时间但是需要买东西，于是我们就找了个代理帮我们买：
``` java
public class ProxyShopping implements Shopping {

    Shopping base;

    ProxyShopping(Shopping base) {
        this.base = base;
    }

    @Override
    public Object[] doShopping(long money) {

        // 帮忙我们买需要的东西
        Object[] things = base.doShopping(money);

        // 偷梁换柱
        if (things != null && things.length > 0) {
            things[0] = "被掉包的东西!!";
        }

        return things;
    }
}
```
    语句解释：
    -  从上面可以看出，我们用代码所实现的代理，其实就是在真正的任务的开头或末尾加上一些操作。
       -  换句话说，只要我们保证任务最终能被执行就可以，在任务执行之前和之后的事情没人会关注。
       -  进而可以理解成，我们是不是可以将系统的startActivity方法给替换成我们的a方法呢？只要我们能保证最终在a方法中调用系统的startActivity即可，至于我们在a方法中还做了哪些事，谁会关心呢？
    -  各位请先控制一下情绪，具体咱们稍后详述。

<br>**动态代理**

　　从上面的介绍可以知道，静态代理要为每一个需要代理的类写一个代理类。

	-  如果需要代理的类有几百个，那就很蛋疼了；而且在使用的时候会发现，每个代理方法里的内容相似度很高。
	-  为此Java提供了动态代理方式，可以简单理解为，在运行时虚拟机会帮我们动态生成一系列的代理类，这样我们就不需要手写每一个静态的代理类了。

　　依然以购物为例，用动态代理实现如下：
``` java
public void onClick(View view) {
    final Shopping women = new ShoppingImpl();
    // 创建代理对象
    Shopping womenProxy = (Shopping) Proxy.newProxyInstance(
            Shopping.class.getClassLoader(),
            women.getClass().getInterfaces(), new InvocationHandler() {

                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    if ("doShopping".equals(method.getName())) {
                        // 先黑点钱(修改输入参数)
                        long money = (Long) args[0];
                        long readCost = (long) (money * 0.5);

                        // 帮忙买东西
                        return method.invoke(women, readCost);
                    }
                    return null;
                }
            });
    System.out.println(Arrays.toString(women.doShopping(100)));
}
```
    语句解释：
    -  如果不明白Proxy类的用法，请自行搜索，网上都是答案。
    -  另外，动态代理只能作用在接口上，不能动态代理类。

<br>**Hook**

　　我们把通过`“代理”`技术来替换掉对象，并修改参数，替换返回值等行为，称之为`Hook`。

	-  具体来说，Hook是基于Java的反射技术来实现的。

<br>　　现在我们有一个任务：

	-  Hook掉startActivity方法，使得在任何地方调用这个方法时，都能额外弹出一条Toast。

　　Hook的思路为：

	-  首先，Hook操作的第一步就是寻找Hook点，即找到一个可以被我们替换的对象。
	   -  查看startActivity的源码，发现最终会调用Activity的mInstrumentation属性的execStartActivity方法。
	   -  这意味着，若能把Activity的mInstrumentation属性替换为我们的对象，那么启动Activity时调用的就是我们的对象了。
	-  第二，通过代码搜索得知Activity的mInstrumentation属性是在它的attach方法中初始化的，即是由外界传递过来的。
	-  第三，我们知道Activity的attch方法是由ActivityThread的performLaunchActivity方法调用的（你现在知道了）。
	   -  这意味着，我们得继续看ActivityThread中的Instrumentation对象是哪来的。
	-  第四，通过阅读android-23版本的ActivityThread源码发现，Instrumentation对象是它的一个属性。
	   -  这意味着，我们如果把ActivityThread的Instrumentation属性给Hook掉，那么就能完成任务了。
	   -  同时也发现ActivityThread类的currentActivityThread方法可以获取它的对象。
　　有了思路后，接下来就开始Hook吧。

<br>　　范例1：在Application里执行Hook操作。
``` java
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        try {
            // 由于ActivityThread类被hide了，所以只能通过反射来获取它的Class对象。
            Class clazz = Class.forName("android.app.ActivityThread");

            // 下面这段代码用来获取ActivityThread对象。
            // 需要注意的是，不同版本的Android源码的ActivityThread的内部实现是不同的。
            // 所以为了确保反射成功，我们应该调用currentActivityThread方法来获取ActivityThread的对象。
            // 而不是直接访问ActivityThread的sCurrentActivityThread属性。
            // 简单的说，在android2.x的源码里，ActivityThread是没有sCurrentActivityThread属性的。
            // 它是用过ThreadLocal来保存变量。
            Method currentActivityThreadMethod = clazz.getMethod("currentActivityThread");
            currentActivityThreadMethod.setAccessible(true);
            Object currentActivityThread = currentActivityThreadMethod.invoke(null);

            // 获取mInstrumentation属性
            Field mInstrumentationField = clazz.getDeclaredField("mInstrumentation");
            mInstrumentationField.setAccessible(true);
            Instrumentation instrumentation = (Instrumentation) 
                                 mInstrumentationField.get(currentActivityThread);

            // 使用我们自定义的CutlerInstrumentation，替换mInstrumentation属性
            mInstrumentationField.set(currentActivityThread, new CutlerInstrumentation(instrumentation));
            System.out.println(instrumentation);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
    语句解释：
    -  之所以把Hook的代码写在Application里是想在程序启动的第一时间执行Hook操作。

<br>　　范例2：CutlerInstrumentation类。
``` java
// 首先让我们的类继承Instrumentation，不然没法用它进行替换。
public class CutlerInstrumentation extends Instrumentation {

    // 还得持有被Hook的对象，因为启动Activity的操作，还是得由它来完成。
    Instrumentation obj;

    public CutlerInstrumentation(Instrumentation obj) {
        this.obj = obj;
    }

    // 定义一个与父类具有相同签名的方法。
    public ActivityResult execStartActivity(
            Context who, IBinder contextThread, IBinder token, Activity target,
            Intent intent, int requestCode, Bundle options) {

        Toast.makeText(who, "Cutler 虎爷! 到此一游！", Toast.LENGTH_SHORT).show();
        ActivityResult result = null;
        try {
            // 调用obj同名的方法，执行启动Activity的任务。
            // 由于Instrumentation类的execStartActivity方法也被hide，所以只能通过反射进行调用。
            Method execStartActivityMethod = Instrumentation.class.getDeclaredMethod("execStartActivity",
                    Context.class, IBinder.class, IBinder.class, Activity.class,
                    Intent.class, int.class, Bundle.class);
            execStartActivityMethod.setAccessible(true);
            result = (ActivityResult) execStartActivityMethod.invoke(obj, who,
                    contextThread, token, target, intent, requestCode, options);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
```
    语句解释：
    -  然后运行程序，在启动Activity时就可以看到Toast消息了。

<br>　　需要注意的是：

	-  不同的Android版本的源码是不同的，如果你把上面的代码运行在2.3.2（及以下）的手机上，就会发现并没有Toast弹出来。

　　这是因为在[ 2.3.2版本中的Activity的源码 ](http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/2.3.2_r1/android/app/Activity.java#Activity.startActivityForResult%28android.content.Intent%2Cint%29)调用的是：

	-  execStartActivity(Context, IBinder, IBinder, Activity,Intent, int)
　　而`范例2`重写的方法比它多一个`Bundle`参数，所以只要在`CutlerInstrumentation`类中也重写该方法即可。

<br>　　还有一点需要注意的是：

	-  Hook的作用于仅限于当前进程。
	-  也就是说，如果你在A进程中hook了ActivityThread，那么B进程中调用的startActivity方法时，并不会弹出Toast。
	   -  即便B进程和A进程是属于同一个项目的两个不同的进程也不行。
	-  这很好理解，即ActivityThread等Framework层的API是运行在我们进程中的，它们与远程的系统进程中的服务进行IPC通信。无论我们对自己进程中的API做何种修改，都不会影响系统进程中服务的执行流程。

<br>**DroidPlugin简介**

　　`DroidPlugin` 全称 [Qihoo360/DroidPlugin](https://github.com/Qihoo360/DroidPlugin/blob/master/readme_cn.md) ，是由 [Andy Zhang](https://github.com/cmzy) 发起的一个插件化开源库。

<br>　　我们首先要明白的一点是：

	-  正常情况下，任何人都无法调起一个未安装的apk中的Activity。
	-  市面上的各类插件化框架都是通过“代理”的方式成功加载插件中的Activity的，不同只是它们的实现代理方式。

　　一个成熟的插件框架通常具备如下特点：

	-  使用DexLoader动态的加载dex文件进入进程中。
	-  在宿主的AndroidManifest.xml中预注册一些将要使用的四大组件，做为代理组件。
	-  能处理好插件中的so文件、Resources对象、保证R文件的正确使用。 

<br>　　笔者引用知乎上两位答主的答案：

　　**@周柯文　-　**[原文连接 ](https://www.zhihu.com/question/35138070/answer/62789302) 

	360这个就是用的动态代理，而且用的非常彻底，看的出来开发者很熟悉AOP和Android。
	DroidPlugin把所有常用到的XXXManager都代理了一遍，然后由自己模拟的各种XXXManagerHookHandle接管，并且开发者为版本兼容性做了很大的努力。
	总之是个很值得学习的框架。

　　**@AndyZhang　-　**[原文连接 ](https://www.zhihu.com/question/35138070/answer/61622444) 

	1、基于动态代理的Hook，我们通过此，hook了系统的大部分与system—server进程通讯的函数，以此作为“欺上瞒下”的目的，欺骗系统“以为”只有一个apk在运行，瞒过插件让其“认为”自己已经安装。
	2、基于Android的多个apk可以运行在同一个进程的原理。
	3、预注册 Activity等组件实现免注册。
	4、灵活的进程管理，回收机制。


<br>　　接下来，笔者将从源码角度来介绍`DP`的工作机制，但是不会介绍的太深（因为需要的前驱知识太多）。

<br>**DP的启动流程**

　　官方文档要求我们在`Application`创建的时候，执行如下代码：
``` java
@Override
public void onCreate() {
    super.onCreate();
    //这里必须在super.onCreate方法之后，顺序不能变
    PluginHelper.getInstance().applicationOnCreate(getBaseContext());
}

@Override
protected void attachBaseContext(Context base) {
    PluginHelper.getInstance().applicationAttachBaseContext(base);
    super.attachBaseContext(base);
}
```
　　那我们就从`PluginHelper`类的`applicationOnCreate`方法开始吧。

<br>　　通过阅读源码发现，`applicationOnCreate`方法会转调用`initPlugin`方法：
``` java
private void initPlugin(Context baseContext) {
    // 此处省略若干代码

    // 安装各个Hook类
    PluginProcessManager.installHook(baseContext);

    // 此处省略若干代码

    // 将已经安装到DP中的插件加载到内存中
    PluginManager.getInstance().addServiceConnection(PluginHelper.this);
    PluginManager.getInstance().init(baseContext);

    // 此处省略若干代码
}
```
    语句解释：
    -  在DP中，对于插件有两个操作：安装、卸载。
       -  当我们把SD卡中的插件安装到DP中后，DP会将其解压到宿主项目中的/data/data目录下，这意味着如果随后用户把SD卡上的文件给删除了，DP依然能访问到插件。
       -  卸载就不用说了。

<br>　　接着调到了`HookFactory`类的`installHook`方法：
``` java
public final void installHook(Context context, ClassLoader classLoader) throws Throwable {
    installHook(new IClipboardBinderHook(context), classLoader);

    // 此处省略若干代码

    installHook(new IActivityManagerHook(context), classLoader);
    installHook(new InstrumentationHook(context), classLoader);

    // 此处省略若干代码
}

public void installHook(Hook hook, ClassLoader cl) {
    try {
        // 调用Hook类的onInstall方法执行安装操作。
        hook.onInstall(cl);
        synchronized (mHookList) {
            mHookList.add(hook);
        }
    } catch (Throwable throwable) {
        Log.e(TAG, "installHook %s error", throwable, hook);
    }
}
```
    语句解释：
    -  可以看出来，在DP被初始化的时候，就会安装很多Hook到系统中，但是这些Hook只会在当前进程中有效。
    -  正如你所见到的那样，在DP中Hook类是所有XxxHook的父类。

<br>　　我们以`InstrumentationHook`类为例，看一下它的源码：
``` java
public class InstrumentationHook extends Hook {

    // 此处省略若干代码

    @Override
    protected void onInstall(ClassLoader classLoader) throws Throwable {
        // 获取ActivityThread.mInstrumentation属性
        Object target = ActivityThreadCompat.currentActivityThread();
        Class ActivityThreadClass = ActivityThreadCompat.activityThreadClass();
        Field mInstrumentationField = FieldUtils.getField(ActivityThreadClass, "mInstrumentation");
        Instrumentation mInstrumentation = (Instrumentation) 
            FieldUtils.readField(mInstrumentationField, target);

        // 创建我们自己的PluginInstrumentation，并用它替换掉之前的Instrumentation。
        if (!PluginInstrumentation.class.isInstance(mInstrumentation)) {
            PluginInstrumentation pit = new PluginInstrumentation(mHostContext, mInstrumentation);
            pit.setEnable(isEnable());
            mPluginInstrumentations.add(pit);
            FieldUtils.writeField(mInstrumentationField, target, pit);
        }
        // 此处省略若干代码
    }
}
```
    语句解释：
    -  从上面的代码可以看出，DP框架Hook的步骤和我们之前说的步骤是一样的。
    -  也就是说，当程序执行startActivity时，系统会调用PluginInstrumentation去处理。
    -  但是如果你打开PluginInstrumentation类看时会发现，它根本就没有重写execStartActivity方法，这是为什么呢？
       -  这是因为之前笔者为了方便讲解，才对Instrumentation进行Hook的。
       -  其实更适合Hook对象是ActivityManagerNative类，只是怕大家迷糊才没对它Hook。

<br>　　我们如果点开`Instrumentation`类的`execStartActivity`方法可以看到：
``` java
public ActivityResult execStartActivity(
        Context who, IBinder contextThread, IBinder token, Activity target,
        Intent intent, int requestCode, Bundle options) {

    // 此处省略若干代码

    int result = ActivityManagerNative.getDefault()
        .startActivity(whoThread, who.getBasePackageName(), intent,
                intent.resolveTypeIfNeeded(who.getContentResolver()),
                token, target != null ? target.mEmbeddedID : null,
                requestCode, 0, null, options);

    // 检测是否成功启动了Activity
    checkStartActivityResult(result, intent);

    // 此处省略若干代码
}

public static void checkStartActivityResult(int res, Object intent) {
    // 此处省略若干代码

    switch (res) {
        case ActivityManager.START_INTENT_NOT_RESOLVED:
        case ActivityManager.START_CLASS_NOT_FOUND:
                throw new ActivityNotFoundException(
                        "Unable to find explicit activity class "
                        + ((Intent)intent).getComponent().toShortString()
                        + "; have you declared this activity in your AndroidManifest.xml?");

        // 此处省略若干代码
    }
}

```
    语句解释：
    -  发现Instrumentation类其实又调用了ActivityManagerNative类的startActivity方法。
    -  同时我们也在这里看到了那个常见的异常：
       -  have you declared this activity in your AndroidManifest.xml?


<br>　　事实上我们前面看到的`IActivityManagerHook`类就是`ActivityManagerNative`类的`Hook`类，它的源码：
``` java
public class IActivityManagerHook extends ProxyHook {

    // 此处省略若干代码

    @Override
    public BaseHookHandle createHookHandle() {
        return new IActivityManagerHookHandle(mHostContext);
    }

    @Override
    public void onInstall(ClassLoader classLoader) throws Throwable {
        // 先获取ActivityManagerNative类的静态属性gDefault。
        Class cls = ActivityManagerNativeCompat.Class();
        Object obj = FieldUtils.readStaticField(cls, "gDefault");
        if (obj == null) {
            ActivityManagerNativeCompat.getDefault();
            obj = FieldUtils.readStaticField(cls, "gDefault");
        }

        if (IActivityManagerCompat.isIActivityManager(obj)) {
            setOldObj(obj);
            Class<?> objClass = mOldObj.getClass();

            // 此处省略若干代码

            // 使用动态代理创建一个代理对象
            Object proxiedActivityManager = MyProxy.newProxyInstance(objClass.getClassLoader(), ifs, this);

            // 将我们的代理对象设置到ActivityManagerNative类的gDefault属性上。
            FieldUtils.writeStaticField(cls, "gDefault", proxiedActivityManager);
        }

        // 此处省略若干代码
    }
}

```
    语句解释：
    -  简而言之，此后我们不论在什么地方调用ActivityManagerNative的方法，最终都会被IActivityManagerHook接管。
    -  也就说会调用IActivityManagerHook的invoke方法，该方法定义在其父类ProxyHook中。

<br>　　由于篇幅有限，后续的操作就不贴代码了，下面简单说一下后续步骤：

	-  在ProxyHook类的invoke方法中会调用mHookHandles.getHookedMethodHandler去处理。
	   -  其中mHookHandles是在Hook类的createHookHandle方法中被初始化的。
	   -  换到IActivityManagerHook类的话，它的mHookHandles属性就是IActivityManagerHookHandle类型的。
	-  接着打开IActivityManagerHookHandle类，看他的init方法就能明白了，它拦截了哪些方法。

<br>　　继续深入的话，大家很容易迷失在代码里，所以如果真想看的话自己去看就行，总之：

	-  当我们调用startActivity方法时，IActivityManagerHookHandle.startActivity类的beforeInvoke方法会被调用。
	-  而在该方法中会修改Intent的内容，即让系统去启动代理Activity，同时该方法也处理了各个系统版本的兼容性问题。

<br>**DP的使用**

　　使用方法官方文档已经介绍的很清楚了，有几个需要注意的问题是：

	-  截止至2016.3.25日，DP的项目源码还是Eclipse格式的，不过笔者推荐大家在AndroidStudio中使用DP。
	-  将DP导入到AndroidStudio中后，如果发现AIDL文件无法生成，可以clean、build一下项目。
	-  正式使用时，只需要将Libraries-DroidPlugin导入即可。

<br>**本节参考阅读：**
- [ArchSummit北京2015-《分拆：DroidPl](http://pan.baidu.com/s/1bnWR2b1)


# 第三节 结尾 #

　　除了上一节中所介绍的插件库之外，市面上还有不少优秀的插件库，由于精力关系笔者就不再一一介绍了。

<br>　　笔者选择插件库时，会主要考虑如下几点：

	-  成熟稳定。即经历了大量的用户测试、处理了各种兼容问题。 这一点DL和DP都符合。
	-  易移植。　即API入侵低，可以方面的从该插件库移植到另一个插件库。这一点DP要更胜一筹。
	-  代码性能。当然是越快越好、越少占内存越好。这一点DL要更胜一筹，毕竟DP里有很多反射和静态属性。
	-  功能完备（可选）。即插件库提供了除“安装、卸载”以外的其他功能。

<br>　　综合考虑的话，笔者暂时更倾向于使用`DP`，但不排除以后随着笔者对它们二者的了解加深，情况会有所改变。

<br><br>
