title: UI篇　第三章 ActionBar 和 Toolbar
date: 2015-4-14 14:09:02
categories: android
---
　　在`Android 3.0`中除了`Fragment`外，`ActionBar`也是一个重要的内容。`ActionBar`主要是用于代替传统的`标题栏`与`Menu按钮`：

	-  标题栏：使用ActionBar来做标题栏，可以展示更多丰富的内容，且方便操控。
	-  Menu按钮：
	   -  在Android 3.0系统之前，Android手机有一个专门的Menu按钮用于打开设置选项。
	   -  从Android 3.0系统开始，系统通过引进ActionBar移除了系统对于硬件Menu按钮的依赖，让用户在屏幕的标题栏上直接可以看到各种设置选项。当然，这不意味着OEM厂商们不会继续在手机上提供这个按钮，但从Google的角度来说，Menu按钮已经是过去时了。

# 第一节 V7 appcompat #

　　我们可以从官方的[ Dashboards ](http://developer.android.com/about/dashboards/index.html)中看出来，目前市场上的Android设备的系统版本已经转移到`4.x`上。虽然如此，我们仍应该保持对低版本的适配，因此本节将以添加`V7 appcompat`库的方式来讲解如何使用`ActionBar`。

<br>　　`ActionBar`有多种形式，你既可以在上面同时放置多个图标、按钮，也可以什么都不放。但对于大多数应用来说，`ActionBar`可以分割为`3`个不同的功能区域，下面是一张使用`ActionBar`的界面截图：

<center>
![ActionBar示意图](/img/android/android_b07_01.png)
</center>

　　其中，`[1]`是`ActionBar`的图标与标题，`[2]`是两个`action`按钮，`[3]`是`overflow`按钮（就是那三个点，点击后会打开一个列表）。
<br>　　提示：

	-  如果你使用的是Eclipse，并且搭建了最新的开发环境，那么在创建新项目的时候，会自动引入v7 appcompat库，如果没有自动引用，可以从<sdk>/extras/android/support/v7/appcompat/中复制一份。

## 图标和标题 ##
<br>　　下图展示的是一个新项目的`MainActivity`在`三星S5`手机（左）以及`Android2.2模拟器`（右）中的运行效果。

<center>
![图1](/img/android/android_b07_02.png)
</center>

<br>　　从上图中我们可以看到，当`ActionBar`运行在`Android3.0`以下的版本中时，标题栏的右上角不会出现`overflow`按钮，但是我们可以通过点击设备的`Menu`按钮来弹出`overflow`菜单。也就是说`Android3.0`中的`overflow`按钮就等价于`Android3.0`之前的`Menu`按钮。（不过，即便系统版本高于`Android3.0`也不一定保证会显示`overflow`按钮，具体后述）。
　　现在我们要实现如下图所示的一个效果：

<center>
![图2](/img/android/android_b07_03.png)
</center>

<br>　　由于`ActionBar`在不同的Android版本中显示的效果是不一样的，因此为了提供统一的视觉效果，我们接下来要修改一下`ActionBar`的背景图片。
　　范例1：修改背景图片。
``` android
public class MainActivity extends AppCompatActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 修改ActionBar的背景图片。
        getSupportActionBar().setBackgroundDrawable(getResources().getDrawable(R.drawable.bg_topbar));
    }
    // 以下省略其它代码。
}
```
    语句解释：
    -  getSupportActionBar()方法继承自android.support.v7.app.AppCompatActivity类。
    -  getSupportActionBar()方法返回一个ActionBar对象，我们可以通过这个对象来修改ActionBar的样式。
    -  ActionBar的setBackgroundDrawable()方法就是用来修改背景图片的。

<br>　　`ActionBar`支持两个文本标题，在上面的被称为主标题（`title`），在下面的被称为子标题（`subTitle`）。
　　范例2：修改标题文本。
``` android
public class MainActivity extends ActionBarActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 修改ActionBar的背景图片。
        getSupportActionBar().setBackgroundDrawable(getResources().getDrawable(R.drawable.bg_topbar));

        // 修改标题文字。
        getSupportActionBar().setTitle("店小二。");
        getSupportActionBar().setSubtitle("陌陌号：18204884");
    }
    // 以下省略其它代码。
}
```
    语句解释：
    -  调用setTitle()方法来设置标题文本。
    -  调用setSubtitle()方法来设置子标题文本。如果不设置子标题，则默认只显示主标题，且是垂直居中。
    -  调用getSupportActionBar().setDisplayShowTitleEnabled(false);可以同时隐藏两个标题。
    -  调用getSupportActionBar().setDisplayShowHomeEnabled(true);显示图标。
    -  调用getSupportActionBar().setIcon(R.drawable.ic_launcher);设置图标。

<br>　　仔细观察上面的`图1`可以发现，当程序运行在`三星S5`手机上时，标题的字体颜色为`白色`，而运行在`Android2.2模拟器`时，颜色则为`黒色`。这个情况肯定是不能忍的，需要给它们设置一个统一的颜色。
　　为了方便管理与更新，我们不会去直接修改`V7 appcompat`库里的属性，而是在自己项目里创建一个`res\values\custom_actionbar.xml`文件，并在该文件中创建一些与`V7 appcompat`库中同名的属性，即用我们的值覆盖掉它们的值。

　　范例3：修改字体颜色。
``` xml
<resources>
    <!-- 基本的主题 -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    </style>

    <!-- 定义主题，继承自@style/AppTheme。 -->
    <style name="MyActionBarTheme" parent="@style/AppTheme">
        <item name="actionBarStyle">@style/MyActionBar</item>
    </style>

    <!-- 定义ActionBar的样式 -->
    <style name="MyActionBar" parent="@style/Widget.AppCompat.ActionBar">
        <!-- 背景色 -->
        <item name="background">@android:color/black</item>
        <!-- 主标题的字体样式 -->
        <item name="titleTextStyle">@style/MyActionBarTitleText</item>
        <!-- 子标题的字体样式 -->
        <item name="subtitleTextStyle">@style/MyActionBarSubtitleText</item>
    </style>

    <style name="MyActionBarTitleText" parent="@style/Base.TextAppearance.AppCompat.Title">
        <item name="android:textColor">#5ec0e8</item>
        <item name="android:textSize">13sp</item>
    </style>
    <style name="MyActionBarSubtitleText" parent="@style/Base.TextAppearance.AppCompat.Subhead">
        <item name="android:textColor">#cccfff</item>
        <item name="android:textSize">8sp</item>
    </style>

</resources>
```
    语句解释：
    -  首先，定义一个名为MyActionBarTheme的主题，并为该主题指定了新的ActionBar样式。
    -  然后，又为ActionBar指定了背景色、主标题、子标题的样式。
    -  最后，就可以在清单文件中为某个Activity使用这个主题了。

## ActionButton ##
　　前面已经说了，在`Android3.0`之后菜单被移到了标题栏上，以便用户直接可以看到各种设置选项。
　　`ActionButton`相当于之前`Menu`菜单下的一个菜单项（`MenuItem`），它也包含一个`图标`和`文字`，同时它会直接显示在`ActionBar`上。当然，如果按钮过多导致`ActionBar`上显示不完，多出的一些按钮可以隐藏在`overflow`里面，点击一下`overflow`按钮就可以看到全部的`ActionButton`了。

　　现在我们要实现如下图所示的一个效果：

<center>
![](/img/android/android_b07_04.gif)
</center>


<br>　　范例1：创建菜单文件（`res\menu\main.xml`）。
``` xml
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto" >

    <item
        android:id="@+id/action_plus"
        android:icon="@drawable/actionbar_add_icon"
        android:title="@string/action_plus"
        app:showAsAction="always"/>
    <item
        android:id="@+id/action_album"
        android:icon="@drawable/ofm_photo_icon"
        android:title="我的相册"
        app:showAsAction="never"/>
    <item
        android:id="@+id/action_collection"
        android:icon="@drawable/ofm_collect_icon"
        android:title="我的收藏"
        app:showAsAction="never"/>
    <item
        android:id="@+id/action_card"
        android:icon="@drawable/ofm_card_icon"
        android:title="我的银行卡"
        app:showAsAction="never"/>
    <item
        android:id="@+id/action_settings"
        android:icon="@drawable/ofm_setting_icon"
        android:title="设置"
        app:showAsAction="never"/>
    <item
        android:id="@+id/action_feed"
        android:icon="@drawable/ofm_feedback_icon"
        android:title="意见反馈"
        app:showAsAction="never"/>

</menu>
```
    语句解释：
    -  各个Activity的Actionbar里包含的选项可能是不同的，因而每个Activity会有一个对应的menu.xml文件。
    -  在menu.xml中，每一个<item>标签都表示一个ActionButton。
    -  其中android:id、android:icon、android:title依次表示ActionButton的id、图标、文本标题。
    -  其中app:showAsAction属性用来设置ActionButton显示的位置，注意这个属性是在app命名空间里的。常用取值为：
       -  always：表示永远显示在ActionBar中，如果屏幕空间不够则无法显示。
       -  ifRoom：表示屏幕空间够的情况下显示在ActionBar中，不够的话就显示在overflow中。
       -  never：则表示永远显示在overflow中。

<br>　　范例2：将菜单添加到Activity的`ActionBar`中。
``` android
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.main, menu); 
    return true;
}
```
    语句解释：
    -  在MainActivity中重写此方法即可，当Activity检测到它自己没有创建过菜单时，就会调用此方法，此方法只会调用一次。系统会根据方法的返回值做出相应的反应：
       -  若返回 true 则意味着菜单已经被初始化完毕。系统接到返回值后，会在ActionBar中显示出overflow按钮。
       -  若返回 false 则意味着菜单没被初始化，此时ActionBar中则不会出现overflow按钮。
    -  MenuInflater类是一个用来将菜单文件加载并解析为一个Menu对象的工具类。调用Activity的getMenuInflater()方法可以获取一个MenuInflater对象。   

<br>　　范例3：响应菜单项的点击事件。
``` android
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();
    switch(id){
    case R.id.action_album:
        Toast.makeText(this, "我的相册", Toast.LENGTH_SHORT).show();
        break;
    case R.id.action_plus:
        Toast.makeText(this, "加号被点击", Toast.LENGTH_SHORT).show();
        break;
    }
    return super.onOptionsItemSelected(item);
}
```
    语句解释：
    -  当用户选择了选项菜单中的一个菜单项（也包括ActionBar中的ActionButton），系统会调用Activity的onOptionsItemSelected()方法。这个方法把用户选择的菜单项作为参数来传递。你能够通过调用getItemId()方法来识别菜单项，这个方法返回了对象菜单项的唯一ID（这个ID是在菜单资源的android:id属性中定义的，或者是传递给add方法的一个整数）。你能够把这个ID与已知的菜单项匹配，让它执行对应的动作。
    -  在MainActivity中重写此方法即可。

<br>　　前面说了，即使当前设备的系统版本高于`Android3.0`，也不保证在`ActionBar`中一定会显示出`overflow`按钮。
　　[《Android ActionBar完全解析，使用官方推荐的最佳导航栏(上)》](http://blog.csdn.net/guolin_blog/article/details/18234477) 中解释了，即`overflow`按钮的显示情况和手机的硬件情况是有关系的，如果手机没有物理`Menu`键的话，`overflow`按钮就可以显示，如果有物理`Menu`键的话（比如Android模拟器都有物理`Menu`键），`overflow`按钮就不会显示出来。

<br>　　范例4：显示出`overflow`按钮。
``` android
private void setOverflowShowingAlways() {
    try {
        ViewConfiguration config = ViewConfiguration.get(this);
        Field menuKeyField = ViewConfiguration.class.getDeclaredField("sHasPermanentMenuKey");
        menuKeyField.setAccessible(true);
        menuKeyField.setBoolean(config, false);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```
    语句解释：
    -  在Activity的onCreate()方法的最后一行调用setOverflowShowingAlways()方法即可。
    -  在ViewConfiguration这个类中有一个叫做sHasPermanentMenuKey的静态变量，系统就是根据这个变量的值来判断手机有没有物理Menu键的。本范例就是使用反射的方式将sHasPermanentMenuKey的值设置成false。


<br>　　如果你此时运行程序，然后点击`overflow`按钮，你会发现里面的`ActionButton`都是只显示文字不显示图标的。这是官方的默认效果，但我们可以通过反射来改变这一默认行为。

<br>　　范例5：让菜单项显示图标。
``` android
@Override
public boolean onMenuOpened(int featureId, Menu menu) {
    if (featureId == Window.FEATURE_ACTION_BAR && menu != null) {
        if (menu.getClass().getSimpleName().equals("MenuBuilder")) {
            try {
                Method m = menu.getClass().getDeclaredMethod("setOptionalIconsVisible", Boolean.TYPE);
                m.setAccessible(true);
                m.invoke(menu, true);
            } catch (Exception e) {}
        }
    }
    return super.onMenuOpened(featureId, menu);
}
```
    语句解释：
    -  直接在Activity中重写onMenuOpened()方法即可。
    -  由MenuBuilder这个类的setOptionalIconsVisible()方法来决定overflow中的ActionButton应不应该显示图标，如果我们在overflow被展开的时候给这个方法传入true，那么里面的每一个ActionButton对应的图标就都会显示出来了。
    
<br>　　最后，来我们就要修改一下`overflow`菜单以及其内的各个`ActionButtom`的样式了，比如字体颜色等。

<br>　　范例6：修改样式。
``` xml
<resources xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- overflow弹出菜单的样式 -->
    <style name="Base.Widget.AppCompat.ListPopupWindow" parent="">
        <!-- 菜单默认弹出的位置是0，此处将它在垂直方向的偏移量设置为52dp，即让弹出菜单向下移动一些位置 -->
        <item name="android:dropDownVerticalOffset">52dp</item>
        <!-- 弹出菜单的背景图片 -->
        <item name="android:popupBackground">@drawable/bg_dropmenu_topbar</item>
    </style>

    <!-- overflow弹出菜单内部的样式 -->
    <style name="Base.Widget.AppCompat.ListView.DropDown" parent="android:Widget.ListView">
        <!-- overflow弹出菜单内部，每个Item之间的分割线 -->
        <item name="android:divider">@drawable/ic_divider</item>
        <!-- overflow弹出菜单内部，每个Item的selector -->
        <item name="android:listSelector">@drawable/actionbar_item_selector</item>
    </style>

     <!-- overflow出菜单内部的每个Item的字体颜色与大小 -->
     <style name="Base.TextAppearance.AppCompat.Menu">
        <item name="android:textSize">16sp</item>
        <item name="android:textColor">@android:color/black</item>
    </style>

</resources>
```

<br>　　范例7：现在我们要实现如下图所示的一个效果：

<center>
![](/img/android/android_b07_05.png)
</center>

<br>　　上图中添加了两个新修改，一个是标题栏左边的`“←”`，另一个是`overflow`按钮左边是一个文本的`ActionButton`。

	-  前者，调用getSupportActionBar().setDisplayHomeAsUpEnabled(true);即可。
	   -  当它被点击时同样会调用onOptionsItemSelected()方法，菜单项id为android.R.id.home。
	-  后者，在main.xml文件中，只为<item>标签指定android:title属性，而不指定android:icon属性即可。

　　下面是文本`ActionButton`相关的样式：
``` xml
// 字体的大小、背景selector
<style name="Base.Widget.AppCompat.ActionButton" parent="">
    <item name="android:textSize">14sp</item>
    <item name="android:background">@drawable/actionbar_text_actionbtn_selector</item>
</style>
```

## 自定义布局 ##
　　`ActionBar`为用户提供了统一方式来展示操作和导航，但是这并不意味着你的`app`要看起来和其他`app`一样，我们可以自定义自己的布局。  
　　将`ActionBar`划分为如下所示的4个区域：

<center>
![](/img/android/android_b07_06.png)
</center>

　　其中：

	-  1表示返回按钮和图标。
	-  2表示标题
	-  3表示ActionButton、ActionProvider、ActionView。
	-  4表示Overflow按钮。

<br>　　我们可以通过调用如下代码来自定义`ActionBar`的布局：
``` java
getSupportActionBar().setDisplayShowCustomEnabled(true);
getSupportActionBar().setCustomView(R.layout.common_title);
```
    语句解释：
    -  自定义的布局将显示在上图中“2”的位置，如果你把其他三个位置都给隐藏掉，那么我们自定义的布局将占据整个ActionBar的空间。

<br>　　`ActionBar`的高级用法（`ActionView`、`ActionProvider`），笔者不打算继续介绍了，下面的参考阅读中都有。

<br>**本节参考阅读：**
- [Android ActionBar使用介绍](http://blog.csdn.net/wangjinyu501/article/details/9360801)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(上)](http://blog.csdn.net/guolin_blog/article/details/18234477)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(下)](http://blog.csdn.net/guolin_blog/article/details/25466665)
- [How to center align the ActionBar title in Android?](http://stackoverflow.com/questions/12387345/how-to-center-align-the-actionbar-title-in-android)
- [Android-Action Bar使用方法-活动栏(一)](http://www.oschina.net/question/54100_34400)

# 第二节 Toolbar #
　　`Toolbar`是`Android 5.0`中新引入的一个控件，其出现的目的就是为了取代`ActionBar`。

<br>　　**为什么要替换ActionBar呢？**

　　因为ActionBar是属于应用UI的一部分，但是我们却又不能对其完全控制：

	-  ActionBar是由系统创建并对其进行相关参数的初始化。
	-  ActionBar限制多、定制困难（比如标题居中、修改字体样式等）。

　　基于这两点（但不限于），Google在`Android 5.0`后推出了`Toolbar`。

<br>　　这里先说一下，Toolbar所带来的自由性与其本身的定位密不可分，因为它是一个`ViewGroup`：
``` java
public class Toolbar extends ViewGroup {
    // 此处省略了Toolbar内的代码
}
```

<br>　　既然Toolbar是用来替代ActionBar的，那么就意味着之前ActionBar能实现的功能，Toolbar也能实现，下面就来介绍它。

<br>　　范例1：添加Gradle依赖。
``` gradle
dependencies {
    compile 'com.android.support:appcompat-v7:23.1.1'
}
```
    语句解释：
    -  由于Toolbar被放到了appcompat-v7库中，所以我们需要先引用该库。

<br>　　回想一下，我们以前使用ActionBar时，都会让项目的`AppTheme`去继承ActionBar的主题，比如：
``` xml
<!-- Base application theme. -->
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    
</style>
```
　　接着，会再让Application去使用这个主题，这样项目里的所有Activity里就会显示出ActionBar了：
``` xml
<application
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/AppTheme" >
</application>
```

<br>　　不过，如果想用Toolbar来替代ActionBar，则就需要修改`AppTheme`主题了：
``` xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">

</style>
```
    语句解释：
    -  这么做是为了不让Toolbar和ActionBar的样式起冲突。
    -  当然也可以不修改AppThem，而是直接在清单文件的activity标签上修改。

<br>　　范例2：在布局文件中创建Toolbar。
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.Toolbar
        android:id="@+id/mToolbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

</RelativeLayout>
```
    语句解释：
    -  因为Toolbar是一个ViewGroup，所以可以直接在布局文件中使用它。
    -  此时的Toolbar可能没有背景色，后面会介绍如何给它设置。

<br>　　范例3：Activity的代码。
``` java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = (Toolbar) findViewById(R.id.mToolbar);
        // 将toolbar做为ActionBar设置到Activity中。
        setSupportActionBar(toolbar);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
```
    语句解释：
    -  注意，这里继承的是AppCompatActivity类，第10行调用的setSupportActionBar方法也是继承自该类。
    -  另外，onCreateOptionsMenu方法返回的菜单同样会被放到Toolbar中。

<br>　　范例4：修改标题栏。

<center>
![Android2.2模拟器上的运行效果图](/img/android/android_b03_01.png)
</center>

``` java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Toolbar toolbar = (Toolbar) findViewById(R.id.mToolbar);
    setSupportActionBar(toolbar);
    
    toolbar.setTitle("店小二");
    toolbar.setSubtitle("陌陌号：18204884");
    // 设置一个不可点击图标。
    toolbar.setLogo(R.mipmap.ic_launcher);
    // 设置一个可以点击的图片，即上图最左侧的那个“三条横线”的图。
    toolbar.setNavigationIcon(R.drawable.ic_menu);
    toolbar.setNavigationOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            Toast.makeText(MainActivity.this, "AAA", Toast.LENGTH_SHORT).show();
        }
    });
}
```
    语句解释：
    -  有两点需要注意：
       -  第一，要先调用setSupportActionBar，然后再调用setNavigationOnClickListener才会有效果。
       -  第二，如果执行本代码时，发现标题并没有变成“店小二”，则有两个方法可以解决：
          -  1、将第8行代码放到第6行之前。
          -  2、将第8行代码改成getSupportActionBar().setTitle()。
          -  这是因为当我们把toolbar设置到Activity上之后，调用toolbar的某些方法进行修改，是无法反映到Activity中的。

<br>　　范例5：修改字体颜色。

<center>
![属性对应图](/img/android/android_b03_02.png)
</center>

``` html
<style name="AppTheme" parent="Theme.AppCompat.NoActionBar">
    <!--导航栏背景色-->
    <item name="colorPrimary">#2196F3</item>
    <!--状态栏背景色-->
    <item name="colorPrimaryDark">#1976D2</item>
    <!--导航栏上的主标题颜色-->
    <item name="android:textColorPrimary">@android:color/white</item>
    <!--导航栏上的子标题颜色-->
    <item name="android:textColorSecondary">@android:color/white</item>
    <!--Activity的背景色-->
    <item name="android:windowBackground">@android:color/white</item>
</style>
```
    语句解释：
    -  上面设置的色值会作用于整个项目，以textColorPrimary和textColorSecondary为例：
       -  为它们设置颜色之后，不止会影响Toolbar的标题的颜色，还会影响到其他多个地方的字体颜色。
       -  因此笔者不推荐通过修改它们二者来达到修改标题栏字体的目的。
       -  而应该使用Toolbar提供的setTitleTextColor和setSubtitleTextColor方法去修改。
    -  windowBackground会影响使用此主题的所有Activity（但不限于Activity）的背景色，使用时也要注意。



<br>　　由于Toolbar自带的设置会覆盖上面的`colorPrimary`，所以还需要修改一下它：
``` xml
<android.support.v7.widget.Toolbar
    android:id="@+id/mToolbar"
    android:background="?colorPrimary"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```
　　其中`?colorPrimary`表示引用当前主题下的`colorPrimary`属性的值，也可以写成`?attr/colorPrimary`。

<br>　　范例6：修改overflow菜单样式。
``` xml
<style name="PopupMenu" parent="ThemeOverlay.AppCompat.Light" >
    <!--菜单背景色-->
    <item name="android:colorBackground">#0000ff</item>
    <item name="android:textColor">#ffffff</item>
    <item name="android:textSize">10sp</item>
</style>
```
　　然后在布局文件中设置：
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.Toolbar
        android:id="@+id/mToolbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary"
        app:popupTheme="@style/PopupMenu" />

</RelativeLayout>
```
    语句解释：
    -  使用popupTheme属性设置菜单的样式。

<br>　　范例7：自定义Toolbar。
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v7.widget.Toolbar
        android:id="@+id/mToolbar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="?attr/colorPrimary"
        app:popupTheme="@style/PopupMenu">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="Title"
            android:textColor="@android:color/white"
            android:textSize="22sp" />
    </android.support.v7.widget.Toolbar>
</RelativeLayout>
```
    语句解释：
    -  由于Toolbar是一个ViewGroup，因此直接在Toolbar标签里添加控件即可。
    -  本范例用于创建一个标题居中的Toolbar，在执行之前还需要在Activity里把原有的标题给隐藏了：
       -  getSupportActionBar().setDisplayShowTitleEnabled(false);

<br><br>　　上面只是列举了Toolbar的基本用法，更高级的应用请阅读：[《实战篇　第三章 开源库》](http://cutler.github.io/android-O03/)。


<br>**本节参考阅读：**
- [Toolbar：上位的小三](http://blog.csdn.net/aigestudio/article/details/47090167)
- [【Android】Toolbar](http://my.oschina.net/xesam/blog/356855)
- [Android Self study course (manterial design)—Toolbar(2)](http://www.codes9.com/mobile-development/android/android-self-study-course-manterial-design-toolbar2-3/)


<br><br>