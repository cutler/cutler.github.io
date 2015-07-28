title: 入门篇　第二章 Activity
date: 2014-10-30 23:28:28
categories: Android
---
　　`Activity`是提供给用户的用于与程序进行交互的界面组件，如打电话、拍照片、发邮件、看地图等。它通过一个窗口来描画它的用户界面，通常这个窗口是全屏的，但是也可以比屏幕小，并且可以浮动在其他窗口的上面。

　　本章会略过`Activity`的基础知识（创建、配置、传参等），请您自行搜索学习。
<br>
# 第一节 生命周期 #
　　`Activity`从创建到销毁会经历多个阶段，每个阶段都会回调不同的生命周期方法，共有`7`个与生命周期有关的方法：

	onCreate、onStar、onResume、onRestart、onPause、onStop、onDestroy

　　重写这些生命周期方法时，你必须要先调用父类的方法执行相应的操作后，再去做你自己的事情。

<br>　　下图说明了这些生命周期方法之间转换可能的路径：

<center>
![Activity的生命周期方法](/img/android/android_2_1.png)
</center>

<br>　　下面将详细介绍这七个生命周期方法。

<br>　　**onCreate()**

	-  当Activity被创建时调用这个方法，在Activity的生命周期中，仅会调用一次。你应该在这个方法中创建所有的全局资源，如视图、把数据绑定到列表等等。当此方法被调用时，同时会接到一个Bundle对象（具体后述）。
	-  提示：操作系统启动一个Activity时，会先通过反射的方式实例化出该Activity的一个实例。然后调用其构造方法、为其设置Context对象等，一切完毕后才会调用onCreate()方法。跟随其后的总是onStart()方法。

<br>　　**onRestart()、onStart()、onResume()**

	-  onRestart：在Activity被onStop()之后且重启之前调用这个方法，跟随其后的总是onStart()方法。
	-  onStart：在Activity显示对用户可见之前调用这个方法。如果该Activity要显示在前台，那么接下来会调用onResume()方法。
	-  onResume：在Activity可以和用户交互之前调用这个方法。此时此刻Activity在堆栈的顶部，能够接受用户的输入。 

<br>　　**onPause()**

	-  当系统开始resuming另外一个Activity时，会调用当前Acitivty的这个方法。通常，用这个方法来提交那些未保存的改变使数据持久化，终止动画和其他的可能消耗CPU的操作等等。无论怎样，它里面的代码都应该被很快的执行完毕，因为另一个Activity在它返回之前，将不会被resumed。
	-  若接下来当前Activity再次返回到前台时，会调用onResume()方法，若接着被隐藏，则会调用onStop()方法。
	   -  注意：弹出一个对话框不会导致Activity的onPause方法被调用。
	-  当操作系统内存不足且需要为高优先级的应用程序分配内存资源时，系统可能销毁处于pause状态的Activity。因此onPause()方法是Activity可以保证一定会执行的最后的一个生命周期方法。

<br>　　**onStop()**

	-  当Activity即将不再对用户可见时调用这个方法。也就是说当Activity被销毁或者因为另一个Activity（既可以是既存的也可以是新创建的）被resume并且完全覆盖当前Activity时，这个方法就被调用了。
	-  如果随后此Activity从后台返回前台与用户交互，就调用onRestart()方法，如果Activity被清除就调用onDestroy()方法。
	-  注意：当系统内存不足时系统会将已经调用过onPause()方法Activity给回收掉，也就是说此方法不一定会被调用。

<br>　　**onDestroy()**

	-  在Activity被销毁之前调用这个方法，这是Activity收到的最后的调用。
	-  此方法既可以因为finish()方法的调用而被调用，也可以因为系统临时销毁了这个Activity实例来释放空间而被调用。你能够使用isFinished()方法来区分这两种场景。
	-  注意：当系统内存不足时系统会将已经调用过onPause()方法Activity给回收掉，也就是说此方法不一定会被调用。

<br>**何时才能被杀死？**
　　`Activity`的三个方法`onPause()`，`onStop()`和`onDestroy()`被调用后，`Activity`都可能因为在系统内存不足的情况被回收掉，所以`Activity`一旦被创建，在进程被杀死前能够保证被调用的最后的方法就是`onPause()`，而`onStop()`和`onDestroy()`方法就可能不被调用了。
　　因此，你应该使用`onPause()`方法来写关键的持久化数据代码用于保存数据。但是，你应该选择在`onPause()`期间什么信息是必须保留的，因为在这个方法中的任何处理都会锁定系统向下一个`Activity`转换，如果处理比较慢会影响流畅的用户体验。
　　正常情况下，当除上述三个方法以外的方法被调用后，系统是无法强行回收`Activity`的内存。特殊的情况将在后面章节中介绍。

<br>
# 第二节 状态保存 #
　　一开始`Activity`被`pause`或`stop`时它所有的成员和信息依然会保留在内存中，但是当系统需要回收内存时，这个`Activity`对象可能就会被销毁了。
　　为了在`Activity`被销毁之前保存重要信息，你需要重写回调方法`onSaveInstanceState(Bundle)`。
　　如果系统杀死了你的进程，而用户又导航回到了这个`Activity`，系统会重建这个`Activity`，并且给`onCreate()`和`onRestoreInstanceState()`方法传递这个`Bundle`对象。你能够从`Bundle`对象中提取你保存的状态信息，并且恢复`Activity`之前的状态。如果没有需要恢复的状态信息，那么会传递给你一个`null`的`Bundle`的对象（`Activity`首次被创建时，这个`Bundle`对象是`null`）。

　　　　　　　　　　　![状态保存回调方法](/img/android/android_2_2.png)

　　注：在`Activity`被销毁之前不能保证`onSaveInstanceState()`方法被调用，因为有些场景中不需要保存状态（如用户使用`“BACK”`键退出时，因为用户明确的要关闭`Activity`就不需要保存状态了）。如果系统需要调用`onSaveInstanceState()`方法，则会在`onStop()`方法和`onPause()`方法之前调用，`onRestoreInstanceState()`方法会在`onResume()`之前被调用。

　　但是，即使你什么也没做并且也没有实现`onSaveInstanceState()`方法，通过`Activity`类默认的`onSaveInstanceState()`方法也能恢复`Activity`的某些状态。特别是布局中的每个`View`默认的实现都会调用相应的`onSaveInstanceState()`方法，它允许每个`View`提供它自己的应该被保存的信息。在Android框架中几乎每个`Widget`都对这个方法做了适当的实现，如当`Activity`被重建时，`EditText`控件保存用户输入的任何文本、`CheckBox`控件保存是否被选中。需要你做的工作只是给每个要保存状态的可视控件提供一个唯一的`ID`（使用`android:id`属性）即可。如果可视控件没有唯一`ID`，那么系统就不保存它们的状态。

　　注意：

	-  onSaveInstanceState方法的默认实现只是帮助保存UI的状态，因此在重写它时要先调用父类方法的实现。onRestoreInstanceState方法同理。

<br>　　可以通过旋转设备，让设备的屏幕改变方向来测试你的应用程序状态的恢复。当屏幕的方向改变时，系统为了给新的屏幕配置选择有效的应用资源会销毁`Activity`并且重建一个新的。

<br>　　范例1：Activity类。
``` android
	public class android.app.Activity extends ContextThemeWrapper {
     // 在Activity被动的摧毁或停止的时候调用(用户主动点击键盘的回退键时不会调用此方法)，用于保存运行数据，可以将数据
     // 保存在Bundle中。此方法会在pause方法之前调用。
	    protected void onRestoreInstanceState (Bundle savedInstanceState){}

     // 该方法在Activity被重新绘制的时候调用，例如改变屏幕方向。在onresume之前调用。
     // 参数outState： Activity的onCreate方法中的参数也是onSaveInstanceState方法的同一个Bundle对象。
	    protected void onSaveInstanceState (Bundle outState){}
	}
```

## 处理配置的改变 ##
　　某些设备配置能够在运行期间改变（如屏幕方向、键盘的可用性、语言等）。当这些改变发生时，系统会重建正在运行的`Activity`（系统调用`onDestroy()`方法后，立即调用`onCreate()`方法）。
　　但是你也可以修改这个默认的行为，从而阻止系统重启你的`Activity`，即告诉系统由`Activity`自己来处理配置变化。

　　只需要设置清单文件的`<activity>`元素的`android:configChanges`属性，为你要处理的配置即可。
　　最常用的值是`orientation`(处理当屏幕的方向变化)，`keyboardHidden`(处理键盘可用性改变)，多个配置的值之间通过`“|”`符号将它们分隔开。
　　例如，以下代码声明了`Activity`中将同时处理屏幕的方向变化和键盘的可用性变化：
``` xml
<activity android:name=".MyActivity"
    android:configChanges="orientation|keyboardHidden"
    android:label="@string/app_name">
```
　　当这些配置中的一个发生改变时，`MyActivity`不会重新启动。相反，它会接收`onConfigurationChanged()`方法的调用。这个方法传递一个`Configuration`类的对象来表示新的设备配置。通过读取`Configuration`对象的字段，你可以更新你的界面。当这个方法被调用时，你的`Activity`的`Resources`对象会被更新并返回一个基于新配置的`Resources`对象，因此你可以在不用系统重启你的`Activity`的情况下很容易地重置你的UI元素。

　　注意：从`Android3.2`(`API level 13`)开始，当屏幕在横竖屏间切换时也会导致`“screen size”`改变，如果你想在`APILevel 13`或更高的版本中防止运行时重启Activity，你必须同时包含`“screen size”`和`“orientation”`两个值。你也可以将项目的`targetSdkVersion`值设置为`12`或者更低，这样仅设置`orientation`即可。

　　例如，接下来的`onConfigurationChanged()`方法中实现了检查硬件键盘的可用性和当前设备的方向：
``` android
public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // Checks the orientation of the screen
    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
        Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
    } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
        Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
    }
}
```
　　另外，不论你是同时设置`“screen size”`和`“orientation”`还是将`targetSdkVersion`设置为`<=13`，他们都只是会阻止`Activity`的重建，但并不会阻止屏幕的横竖屏切换。 
　　如果你想让`Activity`支持横屏或竖屏二者之一，那么应该使用`android:screenOrientation`属性。

## 协调Activity ##
　　当在同一个进程中的两`Activity`之间切换时，它们两个的生命周期都会发生变化，以下是`ActivityA`启动`ActivityB`是发生的操作：

	-  ActivityA的onPause方法被执行。
	-  ActivityB的onCreate、onStart、和onResume被顺序执行（现在ActivityB有用户焦点）。
	-  如果ActivityA不再屏幕上显示，它的onStop方法就会被执行。

　　这意味着，在`ActivityA`的`onPause`方法返回之前，`ActivityB`的`onCreate`方法不会被调用，因此请不要在`onPause`方法中执行耗时操作。

<br>
# 第三节 Fragment #
　　`Android`在`3.0`中引入了`fragments`的概念，`Android3.0`是基于`Android`的平板电脑专用操作系统。
## 背景介绍 ##
<br>**问题是这样的：**
　　在一个小屏幕的设备上，一个`Activity`通常占据了整个屏幕，其内显示各种UI视图组件。但是当一个`Activity`被显示在一个大屏幕的设备上时，例如平板，总会显得有些不适应。因为平板的屏幕太大了，UI组件会被拉长、模糊。
　　因此若想使`Activity`的UI组件在大屏幕中美观且充满整个屏幕，则就需要在其内添加更多的组件，但是这样一来，视图的层次结构就很复杂了。但层次结构复杂也许并不是问题的关键，对于两个功能相似的`Activity`来说，他们UI界面也会高度相仿，这也就意味着代码的重复量会大大增加(这个问题也存在于手机设备上，只不过在大屏幕设备上更为突出而已)。

　　因此`Android3.0`为了支持更加动态和灵活的UI设计，它引入了`fragments`的概念。

<br>**是什么？**
　　解决代码冗余最好的方法就是把各功能相似的`Activity`中那块相似的部分抽取出来，然后封装成一个类，以后就可以在需要使用的时候实例化一个对象放入`Activity`即可。
　　在`Android3.0`中`Google`已经帮我们封装好了这个类，即`Fragment`。也就是说`Fragment`的作用就是用来封装各`Activity`中公用的组件，以便代码重用。

　　既然已经知道了`Fragment`的作用，那么接下来说说它的特点：

	-  Fragment可以将一组View封装成一个整体，但它本身却不是继承自View类。
	-  Fragment必须总是被嵌入到一个Activity中，它无法单独使用。
	-  Fragment更像一个容器，它的存在就是为了将多个View打包在一起，它本身无法被直接显示。
	-  Fragment有它自己的生命周期，接收属于它的输入事件，并且我们可以在Activity运行期间动态的向Activity中添加和删除Fragment。
	-  Fragment的生命周期直接被其所属的宿主Activity的生命周期影响。
　
　　一个`Activity`中可以同时嵌入多个`Fragment`。
　　举个例子，你可能会仅当在屏幕尺寸足够大（平板电脑）时，在一个`Activity`中包含多个`Fragment`（如下图-左），而当不属于这种情况（手机）时则只包含一个`Fragment`（如下图-右）。

　　　　　　　　　![Fragment](/img/android/android_2_3.png)

　　提示：

	-  Fragment是在Android3.0中提供的，若想在Android2.x平台上使用Fragment则需要添加android-support-v4.jar库。

## 基本应用 ##
　　要创建一个`Fragment`类，必须让该类继承`Fragment`或其子类 。
　　`Fragment`类的代码看上去有点象`Activity`，它也包含了`onCreate()`、`onStart()`、`onPause()`和`onStop()`方法。

<br>**创建Fragment**
　　我们已经知道`Fragment`用来作为`Activity`的用户界面的一部分，其内封装的`view`会被放入`Activity`中。
　　那么应该如何给`Fragment`提供一个`view`呢?
　　答：实现`Fragment`类的`onCreateView()`回调方法即可，该方法是`Fragment`的生命周期方法之一，当`Activity`需要`Fragment`绘制它自己的`view`时，就会调用它。

<br>　　范例1：MyFragment。
``` android
public static class MyFragment extends Fragment {
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.example_fragment, null);
    }
}
```
	语句解释：
	-  inflater：一个工具类的对象，可以从一个XML Layout资源文件中读取并生成View。
	   -  笔者在《UI篇　第四章 通知》中会详细介绍此类的用法。
	-  container：你的Fragment将被插入的父ViewGroup(来自activity的layout)。
	-  savedInstanceState：如果Fragment是被恢复的，它提供关于Fragment的之前的实例的数据。

<br>**添加入Activity中**
　　创建完`Fragment`后，接下来就要将它添加到`Activity`中进行显示了。

	-  Fragment会嵌入到宿主Activity的View Hierarchy中，被作为Activity的整个的一部分。

　　但是由于`Fragment`本身并不是`View`的子类，我们无法通过`addView`等方法将其直接放入到`Actvity`中。
　　虽然如此，但是还是有`2`种方法可以添加一个`Fragment`到`Activity`中。

<br>　　第一种，在`Activity`的`layout`文件中声明`<fragment>`标签，可以像`View`一样指定`layout`属性。
``` xml
<fragment
    android:id="@+id/myFragment"
    android:name="com.example.androidtest.MyFragment"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
```
	语句解释：
	-  android:name属性指定了要实例化Fragment类的名称。
	-  当系统创建Activity的界面时，会依次实例化每个<fragment>标签，并调用它们的onCreateView()方法来获取View，然后把返回的View直接插入到<fragment>元素所在的地方。

<br>　　第二种，在`Activity`运行的任何时候都可以通过`FragmentManager`来操作和管理`Fragment`。有两种方式可以获取到`FragmentManager`的实例：

	-  若项目的SDK版本为3.0以上，则通过Activity的getFragmentManager()方法获取。
	-  若项目的SDK版本低于3.0，则通过FragmentActivity（稍后介绍）的getSupportFragmentManager()方法获取。

<br>　　另外，每个`Fragment`都需要一个唯一的标识，以便在程序中引用它。有`3`种方法来为一个Fragment提供一个标识：

	-  为android:id属性提供一个唯一ID。
	-  为android:tag属性提供一个唯一字符串。
	-  如果以上2个你都没有提供, 系统使用Fragment所在的容器view的ID。

<br>　　范例1：添加Fragment。
``` android
public class MyActivity extends FragmentActivity{
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // 添加Fragment
        MyFragment f = new MyFragment();
        // FragmentManager和FragmentTransaction后面介绍。
        FragmentManager mgr = getSupportFragmentManager();
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout,f);
        trans.commit();
    }
}
```
	语句解释：
	-  由于Android3.0之前的Activity类不支持Fragment这个类，因此在android-support-v4.jar中Google使用FragmentActivity来对Activity的功能进行了增强。若你项目的SDK版本低于Android3.0，则需要添加android-support-v4.jar包，并且要让你的Activity继承FragmentActivity类。
	-  本范例是通过继承FragmentActivity类来实现的。执行完毕编辑操作后，若不调用commit()方法则事务是永远不会生效的。

<br>　　范例2：FragmentManager类。
``` android
public abstract class FragmentManager extends Object {
    // 开启一个事务，之后对Fragment的操作都是在这个事务对象进行的。
    public abstract FragmentTransaction beginTransaction(){}

    // 指定Fragment的id或tag，从当前FragmentManager对象中查找出Fragment对象。
    public abstract Fragment findFragmentById(int id){}
    public abstract Fragment findFragmentByTag(String tag){}
}
```
	语句解释：
	-  不论是Android3.0之后的Activity类还是FragmentActivity类，在它们的内部都定义了一个FragmentManager类型的属性，它管理着所有嵌入到其宿主Activity内的Fragment对象。
	-  由于一个Activity中可以嵌入多个Fragment，为了方便高效的编辑这些Fragment对象，Android采用了“事务提交”的方式。
	-  每当需要编辑Activity中的某个Fragment时，都要先开启一个事务。然后在事务对象上执行编辑操作(如add、remove、replace等)，执行完毕所有的编辑后再一次性的提交给Activity去更新界面。

<br>　　范例3：FragmentTransaction类。
``` android
public abstract class FragmentTransaction extends Object {
    // 将参数fragment对象添加到Activity的布局中containerViewId组件下。
    // containerViewId所指向的组件必须是ViewGroup类型的，否则抛异常。
    public abstract FragmentTransaction add(int containerViewId, Fragment fragment){}

    // 删除containerViewId下面的fragment对象，然后将参数fragment对象放到containerViewId下面。
    // 若containerViewId下面有多个fragment对象，则删除最先找到的那个。
    // tag：为参数fragment指定的tag。
    public abstract FragmentTransaction replace(int containerViewId, Fragment fragment, String tag){}

    // 调用此方法相当于调用其重载方法replace(containerViewId, fragment,null) 即参数tag的值为null。
    public abstract FragmentTransaction replace(int containerViewId, Fragment fragment){}

    // 提交事务。
    // 事务中包含的操作不会立刻生效，事务会被放入到创建当前事务对象的FragmentManager对象所在Activity类的mHandler
    // 属性中，等待被主线程处理。但你可以从你的UI线程调用executePendingTransactions()来立即执行由commit()提交的事
    // 务. 但这么做通常不必要,除非事务是其他线程中的job的一个从属。
    public abstract int commit(){}
}
```

　　`trans.add(R.id.layout,f)`将`Fragment`对象添加到`Activity`的组件下，此语句等价于：
``` android
		ViewGroup container = (ViewGroup)activity.findViewById(R.id.layout);
		container.addView(f.mView);
```
　　其中`f.mView`就是Fragment内部所封装的View。

<br>**事务回滚**
　　事务是支持回滚的，即撤销上一步操作。 
　　在`FragmentManager`中维护了一个`事务栈`。我们可以在事务对象提交(`commit`)之前，设置是否要将该事务放在事务栈中。 当用户在`Activity`中按下`back`键时，会撤销栈顶的事务所做出的修改。

<br>　　范例1：添加Fragment。
``` android
public class MyActivity extends FragmentActivity{
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FragmentManager mgr = getSupportFragmentManager();
        MyFragment f = new MyFragment();
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout, f);
        trans.addToBackStack(null);
        trans.commit();
    }
}
```
	语句解释：
	-  本范例添加了一个Fragment，并调用addToBackStack()方法来标识事务对象需要被加入事务栈。
	-  当BACK键被按下时Fragment就会被从Activity中移除，并将该事务从栈中移除。当事务栈为空时，Activity将不会再拦截BACK键事件。
	-  如果添加多个变化到事务(例如add()或remove())并调用addToBackStack()，然后在你调用commit()之前的所有应用的变化会被作为一个单个事务添加到后台堆栈，BACK按键会将它们一起回退。

<br>　　范例2：替换Fragment。
``` android
public class MyActivity extends FragmentActivity{
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentManager mgr = getSupportFragmentManager();
        // 第一个fragment。
        MyFragment f = new MyFragment("AA");
        FragmentTransaction trans = mgr.beginTransaction();
        trans.add(R.id.layout, f);
        trans.addToBackStack(null);
        trans.commit();
        // 第二个fragment。		
        MyFragment f2 = new MyFragment("BB");
        FragmentTransaction trans2 = mgr.beginTransaction();
        trans2.add(R.id.layout, f2);
        trans2.addToBackStack(null);
        trans2.commit();
        // 第三个fragment。
        MyFragment f3 = new MyFragment("CC");
        FragmentTransaction trans3 = mgr.beginTransaction();
        trans3.replace(R.id.layout, f3);
        trans3.addToBackStack(null);
        trans3.commit();
    }
}
```
	语句解释：
	-  如果添加多个Fragment到同一个容器, 那么添加的顺序决定了它们在view hierarchy中显示的顺序。 因此f会被放到f2的前面显示。
	-  本范例使用replace方法会将f给删除，并将f3添加到R.id.layout的末尾位置。
	-  本范例的三个事务都被加入到事务栈中，当第一次按下BACK键时，f3会被移除，f会被还原。 注意：f会被还原到f3的位置，而不是f2的前面。也就是说，对于addToBackStack()方法，它只会记录fragment的操作，而不会记录fragment当时的位置。当执行还原的时候，会将fragment放到containerView的末尾。

<br>　　范例3：删除Fragment。
``` android
public class MyActivity extends FragmentActivity{
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentManager mgr = getSupportFragmentManager();

        // ...  此处省略了范例2中的代码。

        FragmentTransaction trans4 = mgr.beginTransaction();
        trans4.remove(f);
        trans4.addToBackStack(null);
        trans4.commit();
    }
}
```
	语句解释：
	-  当按下BACK键时，f会被还原。即f会被还原到f3的后面，而不是f2的前面。
	-  对于每一个Fragment事务，你可以应用一个事务动画，通过在提交事务之前调用setTransition()实现。

<br>**为Activity创建事件回调方法**
　　在一些情况下，你可能需要一个`Fragment`与`Activity`分享事件。 
　　例如，`Activity`中有`2`个`Fragment`，一个用来显示文章列表(`A`)，另一个显示文章内容(`B`)。 当用户点击了`A`中的某个文章时，`A`就告诉宿主`Activity`，然后宿主`Activity`就可以转告诉`B`去显示文章。

<br>　　范例1：定义回调接口。
``` android
public class FragmentA extends ListFragment {
    // Container Activity must implement this interface
    public interface OnArticleSelectedListener {
        public void onArticleSelected(int position);
    }

    OnArticleSelectedListener mListener;
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnArticleSelectedListener) activity;
         } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement OnArticleSelectedListener");
        }
    }

    public void onListItemClick(ListView l,View v,int position,long id){
        // Send the event and Uri to the host activity
        mListener.onArticleSelected(position);
    }
}
```
	语句解释：
	-  让FragmentA的宿主Activity实现OnArticleSelectedListener接口，并覆写抽象方法。
	-  当onArticleSelected()被调用时，宿主Activity就可以通知FragmentB，并将FragmentA传来的数据转给FragmentB。
	-  为了确保宿主Activity实现这个接口，在onAttach()方法被调用 (此方法是生命周期方法之一，后述) 时，可以将onAttach()的参数做类型转换来实例化一个OnArticleSelectedListener实例。
	-  若宿主Activity没有实现接口，则Fragment就会抛出ClassCastException异常。
	-  由于FragmentA是ListFragment的子类，因此每次用户点击一个列表项，系统调用在Fragment中的onListItemClick()，然后后者调用onArticleSelected()来分配事件给Activity。


## 生命周期 ##
　　`Fragment`有自己的生命周期，并且生命周期直接被其所属的宿主`Activity`的生命周期影响。当`Activity`被暂停，那么在其中的所有`Fragment`也被暂停，当`Activity`被销毁，所有隶属于它的`Fragment`也被销毁。

　　管理`Fragment`的生命周期，大多数地方和管理`Activity`生命周期很像，和`Activity`一样。
　　`Fragment`生命周期各个阶段回调的方法如下图(左)，`Fragment`和`Activity`的生命周期方法对应关系图(右)：
　　　　　　　![](/img/android/android_2_4.png)　　　　　![](/img/android/android_2_5.png)
　　和`Activity`一样，你可以使用`Bundle`保持`Fragment`的状态，万一`Activity`的进程被干掉，并且当`Activity`被重新创建的时候，你需要恢复`Fragment`的状态时就可以用到。
　　在`Fragment`的`onSaveInstanceState()`期间保存状态，并可以在`onCreate()`，`onCreateView()`或`onActivityCreated()`期间恢复它。

<br>**各声明周期方法的调用**

	-  onAttach()
	   -  当Fragment通过事务对象被绑定到Activity时被调用(宿主Activity的引用会被传入)。在onAttach()方法被调用后，其宿主Activity的onAttachFragment()方法将被调用。
	-  onCreate()：通常情况下，在宿主Activity的onAttachFragment()方法将被调用后，会调用Fragment的onCreate方法。
	-  onCreateView()：不论Fragment的onCreate是否调用，都将继续调用onCreateView()方法，此方法需要返回Fragment内封装的view的根节点。
	-  onActivityCreated()：若Activity的onCreate()方法已经返回，则此方法将会在onCreateView()方法被调用后被调用。
	-  onStart()、onResume()、onPause()、onStop()：这四个方法的调用情形与Activity一样。
	-  onDestroyView()：当和Fragment关联的view hierarchy被移除之前会调用此方法，此方法返回后就会执行移除操作。
	-  onDestroy()：当Fragment被销毁时被调用。
	-  onDetach()：
	   -  当Fragment与宿主Activity解除关联时被调用。

## 销毁重建 ##
　　`Fragment`的生命周期受其宿主`Activity`的影响，当宿主`Activity`因为某种原因被摧毁(如手机横竖屏切换、内存不足导致后台`Activity`被回收等)，且用户再次导航回来时，接着宿主`Activity`就会执行重建操作，其内部的各个`Fragment`也会跟随着它执行重建。

　　`Activity`的重建，简单的说就是重新实例化一个对象，并将之前被摧毁的对象的各种状态设置到新的对象上，关于重建这一点`Fragment`和其宿主`Activity`的操作是一样的。此时就存在一个问题，重建的操作是系统来完成的，而重建又需要创建新的对象，那么操作系统是如何实例化我们自己定义的`Fragment`类的呢?
　　答案就是：通过`反射机制`，并调用无参构造方法。

　　由于通常我们创建自己的类时会依据需要自定义若干个构造方法，而操作系统在重建时只会调用无参的构造器(因为有参的构造器所需要的参数，操作系统是不可以自主的随便提供的，否则程序就乱套了)。
　　因此我们要保证自定义的`Fragment`类必须要有一个无参的构造方法，以便系统对其重建时调用。
<br>　　那么是系统是如何创建`Fragment`对象的呢？ 找到`Fragment`类看到如下代码：
　　　　　![Fragment类代码片段](/img/android/android_2_6.png)
　　通过查看源码（此处省略具体步骤）得知，必须要为`Fragment`提供一个无参的构造方法。其实`Activity`也必须要定义一个无参的构造方法，只是由于`Activity`的实例通常由操作系统来创建，所以我们以前并没有涉及到此问题。

<br>**实例化的方法**
　　现在我们又遇到一个问题： 很多时候我们需要在实例化`Fragment`的同时为其传递一些参数，而系统在重建`Fragment`时只会调用无参的构造方法，也就跳过传参的这一步骤，这必然会导致程序出问题。
　　这该怎么解决呢?  
<br>　　这个问题`Fragment`已经替我们解决了，`Fragment`类有一个属性名为`mArguments`，它是`Bundle`类型的。
``` android
// Construction arguments;
Bundle mArguments;
```
　　当我们构造完`Fragment`对象后，可以将需要传递给`Fragment`的参数放到这个`Bundle`对象中。这样即便是随后`Fragment`对象被摧毁了也没关系，因为系统会将`Fragment`的`mArguments`属性的值保存起来，当重建的时候也会将`mArguments`属性的值给还原。
<br>　　因此对于`Fragment`的初始化操作，我们通常的写法是这样的：
``` android
public class MainActivity extends FragmentActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        FragmentTransaction trans = getSupportFragmentManager().beginTransaction();
        trans.add(R.id.rootView, MyFragment.getInstance("Hi World"));
        trans.commit();
    }
}
```

<br>　　范例2：MyFragment。
``` android
public class MyFragment extends Fragment {
    private String property;
    public static MyFragment getInstance(String property) {
        MyFragment f = new MyFragment();
        Bundle data = new Bundle();
        data.putString("property", property);
        f.setArguments(data);
        return f;
    }
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        property = getArguments().getString("property");
    }
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        TextView text = new TextView(inflater.getContext());
        text.setText(property);
        return text;
    }
}
```
	语句解释：
	-  前面说了Activity重建的时候是通过反射机制来实例化每个Fragment的。因此我们自定义的Fragment类必须是public修饰的。并且若Fragment是某个类的内部类，则其还必须是static的。

<br>
**本节参考阅读：**
- [Fragments (Android官方文档中文版)](http://www.eoeandroid.com/thread-71642-1-1.html)
- [Android之Fragment（官网资料翻译）](http://blog.csdn.net/aomandeshangxiao/article/details/7671533)

<br>
# 第四节 Task #

## 基础知识 ##
　　`Android`使用`Task`来组织应用程序的所有`Activity`，`Task`是一个栈(`back stack`)结构，各个`Activity`按照栈的特点`“后来居上、后进先出”`依次被被安排在栈中。
　　默认情况下，一个应用程序中的所有`Activity`处于同一个`Task`中，在操作系统中同一时间上会存在多个`Task`。
　　当一个`Activity`被创建时，就会被压入到`Task`的栈顶，当其销毁时（用户点击`“Back”`键或调用`finish()`方法等），就会从栈顶移除。

<br>　　范例1：图示。
　　　　　　　　![Task](/img/android/android_2_7.png)
　　第四个图形描述的是`Activity3`从`Task`中被弹出。
　　如果用户继续按`“Back”`按钮，那么堆栈中的每个`Activity`会被依次弹出，当所有的`Activity`从堆栈中被删除时，这个`Task`就不再存在了。

<br>　　范例2：前台与后台。
　　`Task`有前台和后台之分，当某个应用程序被用户切换到前台时，该应用程序所对应的`Task`也将会被移动到前台。
　　　　　　　　　　　　　　　　　　![TaskB处于前台、TaskA处于后台](/img/android/android_2_8.png)

　　提示：虽然后台可以存在多个`Task`，但是当系统内存不足时，后台`Task`中的`Activity`所占据的内存可能被回收。系统在同一时间可能存在多个后台`Task` ，但只能有一个前台`Task`。

<br>　　`Task`的默认行为：

	-  当用户通过按主页(Home)按钮离开一个任务时，当前Task的栈顶Activity会被stop，并且Task会被放入后台，但系统会保留Task中每个Activity的状态。如果用户随后通过选择启动图标来恢复这个任务，那么任务会来到前台，并且恢复了堆栈顶部的Activity。
	-  如果用户按下回退按钮，当前的Activity会从堆栈中被弹出并且被销毁，堆栈中的前一个Activity会被恢复。

## 管理Task ##
　　`Android`通过把所有的已启动的`Activity`依次放到同一个后进先出的堆栈里来进行管理，对于大多数应用程序来说这种方法能够很好的工作。但是你可以修改这种默认的行为，即`修改启动模式`。

<br>**修改启动模式：**
　　启动模式用来告诉系统，当用户请求启动一个`Activity`时，系统应该怎么做。使用以下两种方法可以定义启动模式：

	1、 使用清单文件：即在配置Activity的同时，指定该Activity的启动模式。
	2、 使用Intent对象：在调用startActivity方法时，通过Intent对象来设置待启动的Activity的启动模式。

<br>　　假设`ActivityA`启动`ActivityB`，并且：

	-  B在清单文件中定义了自己的启动模式。
	-  同时A又通过在Intent中设置了flag的方式，来为B指定启动模式。
　　此时`A`的请求（在`Intent`中定义的）的优先级要高于`B`的请求（在清单文件中定义的）。
<br>　　注意：某些在清单文件中有效的启动模式对`Intent`标识是无效的，同样某些针对`Intent`标识有效的启动模式也不能在清单文件中定义。

### 使用清单文件 ###
　　在清单文件中声明一个`Activity`时，你能够使用`<activity>`元素的`launchMode`属性来指定这个`Activity`的启动模式，该属性有有四种取值：

<br>　　**standard模式**

	系统会直接创建该Activity的一个新实例，并将该实例放到Task栈顶。
	也就是说，如果你启动5次使用了此模式的Activity，那么Task中就有5个该Activity的实例。
	如果你在清单文件中配置Activity时不为它的launchMode属性赋值，那么该Activity就默认是此种启动模式。

<br>　　**singTop模式**

	如果打算启动的Activity的实例在当前Task的顶部已经存在，那么系统就会通过调用onNewIntent方法把这个Intent传递给这个实例，而不是创建一个新的实例。
	只有栈顶部的Activity不是这个既存的Activity的实例时才会有多个实例存在。
<br>　　假设现在有一个`Task`，它的栈由`A`、`B`、`C`、`D`四个`Activity`组成，其中`D`在栈顶。

	-  若此时又试图启动一个D类型Activity，那么：
	   -  若D的启动模式是standard，那么D就会被直接启动，并且此时堆栈变成A-B-C-D-D的组合。
	   -  若D的启动模式是singleTop，那么既存的D的实例因为它在堆栈的顶部，所以它会接收通过onNewIntent()方法传递的Intent，堆栈仍然保持着A-B-C-D的组合。
	-  但是，如果是启动一个B类型Activity，那么即使B类型Activity的启动模式是“singleTop”，也会有一个新的B的实例被添加到堆栈中，因为栈顶是D。

<br>　　在讲解`singleTask`启动模式之前，先说明一下什么是亲缘关系。
<br>　　**亲缘关系(affinities)：**
　　每个`Task`都有一个`affinity`属性，它相当于`Task`的唯一标识。
　　每个`<activity>`标签也有一个`taskAffinity`的属性，用来指出当前`Activity`的亲缘关系。

	-  若Activity为它的taskAffinity属性设置了值，即告诉系统该Activity希望被放到affinity属性的值与其taskAffinity属性相同的Task中。
	-  若没有为此属性赋值，则当前Activity的亲缘关系就是<application>标签的taskAffinity属性的值。
	-  若<application>标签也没有指定taskAffinity属性的值，则就使用包名来作为整个程序的亲缘关系。

　　默认情况下，同一个应用程序中的所有`Activity`都应该属于同一个`Task`。

　　那么亲缘关系在什么情况下会被用到呢?

<br>　　**singleTask模式**
　　当启动了一个启动模式为`singleTask`的`Activity`时，系统会执行如下操作：

    -  在整个操作系统中当前正在运行的所有Task中进行查找，查找affinity属性值等于启动模式为singleTask的Activity的taskAffinity属性值的任务是否存在。
    -  若不存在，则系统会开启一个新的Task，并将该Activity作为根元素。
    -  若存在，则系统会查看该Task中是否已经存在了该Activity。
       -  若存在，则将该Activity上的所有Activity都给finish掉。并调用该Activity的onNewIntent()方法，将新的Intent传递过去。
       -  若不存在，则在该Task顶部启动该Activity。
　　提示：定义在不同的应用程序中的`Activity`能够共享一个亲缘关系。

<br>　　范例1：查看所有`Task`。
``` android
adb shell dumpsys activity
```
　　使用`adb`命令可以查看当前操作系统中存在的所有`Task`。
``` android
Running activities (most recent first):
   TaskRecord{44fbd658 #3 A com.example.androidtest}
     Run #1: HistoryRecord{45032428 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　此时系统中有两个`Task`，若在`MainActivity`中启动`Activity1`，在`Activity1`中启动`Activity2`，则`Task`中的情况如下：
``` android
Running activities (most recent first):
  TaskRecord{4500ff48 #4 A com.example.androidtest}
    Run #3: HistoryRecord{450ea0a8 com.example.androidtest/.Activity2}
    Run #2: HistoryRecord{450268f8 com.example.androidtest/.Activity1}
    Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
  TaskRecord{4502d408 #2 A com.android.launcher}
    Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　若修改`Activity1`的启动模式为`singleTask`：
``` android
<activity android:name=".Activity1" android:launchMode="singleTask" >
```
　　则在`MainAcitivity`中启动它后，栈中的情况如下：
``` android
Running activities (most recent first):
   TaskRecord{45008f00 #6 A com.example.androidtest}
     Run #2: HistoryRecord{45040e18 com.example.androidtest/.Activity1}
     Run #1: HistoryRecord{44f8eed0 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```
　　为什么没有新开启一个`Task`呢?
　　因为`Activity`的`taskAffinity`属性的值没有设置，因此最终系统将它默认为包名了，这和`MainAcitivity`所处的`Task`的`affinity`属性的值一致，所以没有新开`Task`。

<br>　　范例2：开启新`Task`。
　　首先为`Activity`设置`taskAffinity`属性的值。
``` android
<activity android:name=".Activity1" android:launchMode="singleTask"
    android:taskAffinity="ni.die" >
```
　　然后在`MainAcitivity`中启动它，此时系统中的`Task`情况如下：
``` android
Running activities (most recent first):
   TaskRecord{44f1e948 #8 A ni.die}
     Run #2: HistoryRecord{45028690 com.example.androidtest/.Activity1}
   TaskRecord{4500b308 #7 A com.example.androidtest}
     Run #1: HistoryRecord{44eb1ea8 com.example.androidtest/.MainActivity}
   TaskRecord{4502d408 #2 A com.android.launcher}
     Run #0: HistoryRecord{4502ab48 com.android.launcher/com.android.launcher2.Launcher}
```

<br>　　**singleInstance模式**
　　使用此启动模式的`Activity`总是单独占有一个`Task`，即若在该`Activity`中又启动了另外一个`Activity`，则新启动的`Activity`将不会和该`Activity`处于同一个`Task`中。

### 使用Intent ###
　　启动`Activity`时，你能够通过在传递给`startActivity()`方法的`Intent`中包含标识来修改`Activity`的默认启动模式，常用的取值：

	-  FLAG_ACTIVITY_NEW_TASK：与launchMode属性值等于singleTask时具有同样的行为。
	-  FLAG_ACTIVITY_SINGLE_TOP:与launchMode属性值等于singleTop时具有同样的行为。

<br>　　范例1：设置`Flag`。
``` android
Intent intent = new Intent(this,SecondActivity.class);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
this.startActivity(intent);
```
	语句解释：
	-  在非Activity中启动Activity时，必须为Intent设置FLAG_ACTIVITY_NEW_TASK，如在“服务”中。

<br>**清除回退堆栈（笔者未测试）：**
　　如果用户长时间的离开一个任务，那么系统会清除这个任务根`Activity`以外的所有`Activity`。当用户再次返回这个任务时，只有根`Activity`被存储。这样的系统行为是因为经过长时间以后，用户在返回这个任务之前可能已经放弃它们的作业，而开始了某些新的任务。 你能够使用一些`Activity`属性来修改这种行为：

　　alwaysRetainTaskState

	如果这个属性在一个任务的根Activity中被设置为“true”，那么像上面描述的那样的默认行为就不会发生。即使是长时间之后，这个任务也会在它的堆栈中保留所有的Activity。
　　clearTaskOnLaunch

	如果这个属性在一个任务的根Activity中被设置为“true”，那么无论用户什么时候离开和返回这个任务，堆栈都会被清除到根Activity的位置。换句话说，它与alwaysRetainTaskState属性相反，用户总是返回到任务的初始状态，即使只离开这个任务一会儿。

<br>**提示**

	-  用户能看见某个Activity并不代表该Activity一定获得焦点。 比如Activity_A中弹出了一个对话框风格的Activity_B时。由于对话框的Activity_B比较小，所以在用户屏幕中照样可以看到Activity_A，但是焦点却在对话框风格的Activity_B中。
	-  当对话框风格的Activity_B 部分覆盖Activity_A时，用户执行弹栈操作将B弹出后，只会触发A 的resume方法。
	-  点击键盘上的home键只会调用Activity的pause、stop方法，而不会调用destroy方法。点击回退键则会调用destroy方法。

<br>**再提示**

	-  新Activity出现时，旧Activity会被stop、且其状态将被保存。
	-  当用户点击home键时，当前Task顶部的Activity会被stop，它的状态会被系统保存，Task被调入后台。 当用户通过点击菜单栏的图标再次启动程序时，程序的Task会被调入前台，Task栈顶activity会获得恢复并焦点。
	-  用户按back键时 ，将当前Task栈顶Activity弹出，并释放其资源。前一个Activity将获得焦点。
	-  当Activity被摧毁时，系统不会再保留其状态。 

<br><br>