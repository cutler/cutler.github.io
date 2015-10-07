title: 实战篇　第三章 Android5.0开发
date: 2015-7-17 19:05:35
categories: android
---
　　`Android 5.0`（Lollipop）是`Google`于`2014/10/15`日（美国太平洋时间）发布的全新`Android`操作系统。
　　它是迄今为止规模最大、最为雄心勃勃的`Android`版本，它不仅为用户推出了各种崭新的新功能，为开发者则提供了数千个新的`API`，还将`Android`的疆土扩展得更远，小到`手机`、`平板电脑`和`穿戴式设备`，大到`电视`和`汽车`，都可以是它活跃的领地。

　　要深入了解面向开发者的新`API`，请参阅[ Android 5.0 API ](http://developer.android.com/intl/zh-cn/about/versions/android-5.0.html)概述，本章只会介绍一些`Android5.0`中已经被广泛使用的技术。


# 第一节 界面新特性 #
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
       -  cardElevation：设置CardView的阴影高度，值越大阴影就月明显。
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
	   -  每个Item的创建/重用由RecyclerView来完成。
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
        List<String> data = Arrays.asList("Android","ios","jack","tony","window","mac");
        RecyclerView mRecyclerView = (RecyclerView) findViewById(R.id.my_recycler_view);

        // 第二，为RecyclerView设置Item的排列方式。下面的代码使用线性布局排列子元素，垂直排列。
        LinearLayoutManager mLayoutManager = new LinearLayoutManager(this);
        mLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // 第三，为RecyclerView设置Adapter。
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
        // 下面这行代码为了以后能方便通过holder.itemView来获取到这个item对象，稍后会介绍holder.itemView是什么。
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
<?xml version="1.0" encoding="utf-8"?>
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
       -  orientation：布局的排列方向，取值有LinearLayoutManager.VERTICAL和LinearLayoutManager.HORIZONTAL。
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
	   -  前者告诉RecyclerView，当前往position位置上插入了1个新元素，后者是从position位置开始，加入了itemCount个元素。
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
　　我们也可以很容易的给`RecyclerView`加上下来刷新功能。

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


<br><br>


