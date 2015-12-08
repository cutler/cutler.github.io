title: UI篇　第三章 ActionBar
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
	-  本文使用的v7 appcompat库的版本号为：Android Support Library, revision 22 (March 2015)，由于此版本支持Android 5.0的Material Design风格，所以该库的编译版本应该设置为5.0以上。

## 图标和标题 ##
<br>　　下图展示的是一个新项目的`MainActivity`在`三星S5`手机（左）以及`Android2.2模拟器`（右）中的运行效果。

<center>
![图1](/img/android/android_b07_02.png)
</center>

<br>　　从上图中我们可以看到，当`ActionBar`运行在`Android3.0`以下的版本中时，标题栏的右上角不会出现`overflow`按钮，但是我们可以通过点击设备的`Menu`按钮来弹出`overflow`菜单。也就是说`Android3.0`中的`overflow`按钮就等价于`Android3.0`之前的`Menu`按钮。（即便系统版本高于`Android3.0`也不一定保证会显示`overflow`按钮，具体后述）。
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
    -  调用setSubtitle()方法来设置子标题文本。
    -  如果不设置子标题，则默认只显示主标题，且是垂直居中。
    -  调用getSupportActionBar().setDisplayShowTitleEnabled(false);可以同时隐藏两个标题。
    -  调用getSupportActionBar().setDisplayShowHomeEnabled(true);显示一个图标。
    -  调用getSupportActionBar().setIcon(R.drawable.ic_launcher);设置一个图标。

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

<br>　　范例8：修改`ActionButton`的背景范围。

<center>
![](/img/android/android_b07_06.png)
</center>

　　在`V7 appcompat revision 22`中，默认情况下`ActionButton`的按下效果如上图（左），我们可以通过下面的代码，把效果修改为上图（右）：
``` xml
<dimen name="abc_action_button_min_height_material">@dimen/abc_action_bar_default_height_material</dimen>
<dimen name="abc_action_button_min_width_material">@dimen/abc_action_bar_default_height_material</dimen>
```

## ActionView ##
　　`ActionView`是一种可以在`ActionBar`中替换`ActionButton`的控件，它可以允许用户在不切换界面的情况下通过`ActionBar`完成一些较为丰富的操作。比如说，你需要完成一个搜索功能，就可以将`SeachView`这个控件添加到`ActionBar`中。

　　为了声明一个`ActionView`，我们可以在`menu`资源中通过`actionViewClass`属性来指定一个控件，例如可以使用如下方式添加`SearchView`：
``` xml
<item
    android:id="@+id/action_search"
    android:icon="@drawable/actionbar_search_icon"
    android:title="@string/action_search"
    app:actionViewClass="android.support.v7.widget.SearchView"
    app:showAsAction="ifRoom|collapseActionView"/>
```
    语句解释：
    -  collapseActionView表明了这个操作视窗应该被折叠到一个按钮中，当用户选择这个按钮时，这个操作视窗展开。

<center>
![](/img/android/android_b07_07.png)
</center>

　　这里所说的`SearchView`是`V7 appcompat`库内置的一个控件，我们把它添加到`ActionBar`中时，默认会显示上图中的（上）所示的界面，当我们点击那个放大镜时，会显示为上图中的（下）所示的界面。
　　此时可以看到，当`SearchView`被展开时会占满整个`ActionBar`，而其它的`ActionButton`由于将`showAsAction`属性设置成了`ifRoom`，此时都会隐藏到`overflow`当中。

　　如果你还希望在代码中对`SearchView`的属性进行配置（比如添加监听事件等），完全没有问题，只需要在`onCreateOptionsMenu()`方法中获取该`ActionView`的实例就可以了，代码如下所示：
``` android
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    MenuInflater inflater = getMenuInflater();
    inflater.inflate(R.menu.main, menu);
    MenuItem searchItem = menu.findItem(R.id.action_search);

    // 注意此处的SearchView的全名为：android.support.v7.widget.SearchView。
    SearchView searchView = (SearchView) MenuItemCompat.getActionView(searchItem);

    searchView.setOnQueryTextFocusChangeListener(new OnFocusChangeListener() {
        // 当searchView处于可输入状态时，hasFocus等于true。
        public void onFocusChange(View v, boolean hasFocus) {
            System.out.println("hasFocus = "+hasFocus);;
        }
    });
    return true;
}
```

　　`SearchView`还提供了其他事件监听方法，此处就不再一一介绍了。

## ActionProvider ##
　　`ActionProvider`与`ActionView`有点类似，它也可以将一个`ActionButton`替换成一个自定义的布局。
　　但不同的是，`ActionProvider`能够完全控制事件的所有行为，并且还可以在点击的时候显示子菜单。

<br>
### ShareActionProvider ###

　　Android提供好了几个内置的`ActionProvider`，常用的是`ShareActionProvider`。

<br>　　范例1：添加`ShareActionProvider`。
``` xml
<item
    android:id="@+id/action_share"
    android:title="分享"
    app:actionProviderClass="android.support.v7.widget.ShareActionProvider"
    app:showAsAction="ifRoom"/>
```
    语句解释：
    -  注意，此处使用的是actionProviderClass属性。

<br>　　接着通过`Intent`来定义出你想分享哪些东西：
``` android
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    MenuInflater inflater = getMenuInflater();
    inflater.inflate(R.menu.main, menu);

    MenuItem shareItem = menu.findItem(R.id.action_share);  
    ShareActionProvider provider = (ShareActionProvider)MenuItemCompat.getActionProvider(shareItem);
    Intent intent = new Intent(Intent.ACTION_SEND);  
    intent.setType("text/plain");  
    intent.putExtra(Intent.EXTRA_SUBJECT, "知乎分享-ActionBar测试");
    intent.putExtra(Intent.EXTRA_TEXT, "此消息来自虎哥ActionBar测试Demo，没错，虎哥就是这么风骚！");
    provider.setShareIntent(intent);  
    return true;
}
```

<br>　　从上面的代码可以看到，我们构建了一个`Intent`，该`Intent`表示会将所有可以共享文本的程序都列出来。重新运行一下程序，效果如下图所示：

<center>
![](/img/android/android_b07_08.png)
</center>

<br>
### 自定义ActionProvider ###
　　除了使用`ShareActionProvider`之外，我们也可以自定义一个`ActionProvider`。
　　我们可以自定义两种`ActionProvider`，第一种是有弹出菜单的，第二种是可以展开的（与`SearchView`的效果一样），具体效果如下图所示：

<center>
![](/img/android/android_b07_09.gif)
</center>

　　下面我们来创建两个自定义的`ActionProvider`类。

<br>　　范例1：`TextViewActionProvider`类。
``` android
public class TextViewActionProvider extends ActionProvider {
    public TextViewActionProvider(Context context) {
        super(context);
    }

    @Override
    public View onCreateActionView() {
        // 在此方法中返回你想要自定义的布局即可。
        TextView text = new TextView(getContext());
        text.setText("TextViewActionProvider");
        return text;
    }
}
```

<br>　　范例2：`SubMenuActionProvider`类。
``` android
public class SubMenuActionProvider extends ActionProvider {
    public SubMenuActionProvider(Context context) {
        super(context);
    }
    public View onCreateActionView() {
        return null;
    }

    @Override
    public boolean hasSubMenu() {
        // 返回true表名当前SubMenuActionProvider是子菜单类型的。
        return true;
    }

    // 当需要初始化菜单项的时候，回调此方法。
    public void onPrepareSubMenu(SubMenu subMenu) {
        subMenu.clear();
        subMenu.add("sub item 1").setIcon(R.drawable.ic_launcher)
            .setOnMenuItemClickListener(new OnMenuItemClickListener() {
                @Override
                public boolean onMenuItemClick(MenuItem item) {
                    Toast.makeText(getContext(), "sub item 1", Toast.LENGTH_SHORT).show();
                    return true;
                }
            });
        subMenu.add("sub item 2").setIcon(R.drawable.ic_launcher)
            .setOnMenuItemClickListener(new OnMenuItemClickListener() {
                public boolean onMenuItemClick(MenuItem item) {
                    Toast.makeText(getContext(), "sub item 2", Toast.LENGTH_SHORT).show();
                    return false;
                }
            });
    }
}
```

　　接着修改`menu`资源，在里面加入`TextViewActionProvider`和`SubMenuActionProvider`的声明：
``` xml
<item
    android:id="@+id/action_search"
    android:icon="@drawable/icon1"
    android:title="@string/action_search"
    app:actionProviderClass="com.example.actionbardemo.SubMenuActionProvider"
    app:showAsAction="ifRoom|collapseActionView"/>
<item
    android:id="@+id/action_share"
    android:icon="@drawable/icon2"
    android:title="@string/action_search2"
    app:actionProviderClass="com.example.actionbardemo.TextViewActionProvider"
    app:showAsAction="ifRoom|collapseActionView"/>
```

## 自定义布局 ##
　　`ActionBar`为用户提供了统一方式来展示操作和导航，但是这并不意味着你的`app`要看起来和其他`app`一样，我们可以自定义自己的布局。  
　　将`ActionBar`划分为如下所示的4个区域：

<center>
![](/img/android/android_b07_10.png)
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

## 添加导航Tabs ##
　　`Tabs`的应用可以算是非常广泛了，它可以使得用户非常轻松地在你的应用程序中切换不同的视图。而Android官方更加推荐使用ActionBar中提供的`Tabs`功能，因为它更加的智能，可以自动适配各种屏幕的大小。比如说，在平板上屏幕的空间非常充足，`Tabs`会和`ActionButton`在同一行显示，而如果是在手机上，屏幕的空间不够大的话，`Tabs`和`ActionButton`则会分为两行显示，即`Tabs`会放到第二行显示。

　　虽然如此，但是它的灵活性不够强，很难做出高要求的`Tab`效果，笔者并不打算继续介绍它。而且`ActionBar Tab`的替代品也很多，我们可以自己写，也可以使用网上现有的开源框架，比如：[PagerSlidingTabStrip](https://github.com/astuetz/PagerSlidingTabStrip) 。
　　开源框架往往由多个人合力完成，因此不论是在`UI特效`、`执行效率`、`bug搜集与解决`上都比我们自己编写要强很多。不过话还得说回来，虽然 `我们可以不去自己写这些特效，但是必须得会改`。



# 第二节 直接使用ActionBar #
　　仔细想了一下，其实我们没必要使用系统的`ActionBar`，因为`V7 appcompat`库就是Google提供的，`ActionBar`有什么最新的特性也会及时更新到里面去，所以就目前来说`V7 appcompat`库足以够用了。<br><br><br><br>



<br>**本章参考阅读：**
- [Android ActionBar使用介绍](http://blog.csdn.net/wangjinyu501/article/details/9360801)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(上)](http://blog.csdn.net/guolin_blog/article/details/18234477)
- [Android ActionBar完全解析，使用官方推荐的最佳导航栏(下)](http://blog.csdn.net/guolin_blog/article/details/25466665)
- [How to center align the ActionBar title in Android?](http://stackoverflow.com/questions/12387345/how-to-center-align-the-actionbar-title-in-android)
- [Android-Action Bar使用方法-活动栏(一)](http://www.oschina.net/question/54100_34400)


<br><br>