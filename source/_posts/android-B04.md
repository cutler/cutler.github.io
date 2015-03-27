title: UI篇　第四章 通知
date: 2015-1-29 14:30:28
create: 2015-1-29 14:30:28
categories: Android
---
　　有几种类型的场景可能会要求你把应用程序中发生的事件通知给用户，这些事件有的需要用户响应，有的则不需要。如：

	-  当像文件保存完成时，就应该显示一个短消息，提示用户保存成功了。
	-  如果应用程序正在后台运行，并且需要用户的关注，那么应用程序就应该创建一个允许用户方便响应的Notification。
	-  如果应用程序正在执行用户必须等待的工作（如装载文件），那么应用程序就应该显示一个悬停的进度对话框。

<br>　　在Android中提供了三种不同的技术来通知用户事件的发生： 

	1. 土司通知，主要针对来自后台的短消息，不需要用户响应。
	2. 状态栏通知，主要针对来自后台的并要求用户响应的持续性提醒。
	3. 对话框通知，主要针对Activity相关的通知。

<br>**土司通知（Toast）**
　　土司通知是在屏幕上弹出一个消息（如下图所示）。它仅填充了消息要求的空间大小，并且依然保留当前Activity的可先性和交互性。这种类型的通知自动的渐入渐出，而且不接受交互事件。因为土司通知是由后台服务创建的，即使你的应用程序不可见，它也会显示。

<center>
![](/img/android/android_3_21.png)
</center>

　　当你完全将注意力集中在屏幕上时，那么`Toast`通知是最好的提示简短消息的方式（例如文件保存成功提醒）。这种通知不接受用户的交互事件，但假如你想让用户去响应和做出动作，你可以考虑使用状态栏通知来代替。

<br>**状态栏通知（Status Bar）**
　　状态栏通知是将图标添加到系统的状态栏（其后带有一个可选的滚动文本消息）（如下面第一张图所示），并把一个可点击的消息添加到`“通知”`窗口中（如下面第二张图所示）。当用户点击这个消息时，Andriod会触发一个由`“通知”`定义的`Intent`对象（通常是要启动一个Activity）。你也能够在设备上给`“通知”`配置一个声音、震动、屏幕闪亮等效果以提醒用户。

<center>
![](/img/android/android_3_22.png)
</center>

<center>
![](/img/android/android_3_23.png)
</center>

　　当用户的应用程序正在一个后台服务中工作，并且需要把一个内部事件通知给用户时，这种类型的通知是非常合适的。假如你需要提醒用户正在发生的事件，且这个事件正持续进行时，你可以考虑使用对话框通知来代替。

<br>**对话框通知（Dialog）**
　　对话框通常是显示在当前Activity前面的一个小窗口。它下面的Activity会失去焦点(注意此处不是指的`onPause()`方法被调用)，并且对话框会接受所有的用户交互。
　　当你需要显示一个进度条或者一个需要用户确认的短消息（例如带有`“确定”`和`“取消”`按钮的提醒）时，你可以利用对话框来实现。你也能够把对话框作为集成应用程序组件的UI界面来使用。



# 第一节 Toast #
　　	`Toast`通知是在屏幕表面弹出的一个简短的小消息。它只填充消息所需要的空间，并且用户当前的Activity依然保持可见性和交互性。这种通知可自动的淡入淡出，且不接受用户的交互事件。
　　	例如，在你的电子邮件发送之前，你导航到了其他界面，此时就会触发程序弹出一个`“草稿已保存”`的`Toast`，让你知道稍后你可以继续编辑，另外弹出的`Toast`在显示一段时间后，就自动关闭。

## 基础应用 ##
　　最简单的`Toast`通知是仅显示一行文本消息。我们可以使用`Toast.makeText()`方法实例化一个`Toast`对象。

<br>　　你可以调用该对象的`show()`方法显示`Toast`通知，例子如下：
``` android
//  三个参数依次为：应用程序的上下文Context、要显示的文本消息、Toast通知持续显示的时间。
Toast toast = Toast.makeText(getApplicationContext(), "Hello toast!", Toast.LENGTH_SHORT);
toast.show();
```

　　你也可以用链式组合方法写且避免持有`Toast`对象的引用，向下面这样：
``` android
Toast.makeText(context, text, duration).show();
```
    语句解释：
    -  Activity是Context的子类，因此可以使用Activity的对象，初始化第一个参数。
    -  在Toast类中提供了两个常量, makeText方法的第三个参数的取值可以为二者之一：
       -  LENGTH_SHORT ：对话框显示的时间稍短。常量的值等于0 。
       -  LENGTH_LONG ：对话框显示的时间稍长。常量的值等于1 。

<br>　　范例1：Toast类。
``` android
//  指定当前Android应用程序的上下文、要显示的文本数据、显示的时间。
public static Toast makeText (Context context, CharSequence text, int duration);

//  指定字符串类型数据的资源ID。
public static Toast makeText (Context context, int resId, int duration);

//  设置当前Toast对象要显示的控件。View可以是一个布局。
public void setView (View view);

//  设置当前Toast对象要显示在屏幕的哪个位置。
public void setGravity (int gravity, int xOffset, int yOffset);
```

## Toast定位 ##
　　标准的`Toast`通知水平居中显示在屏幕底部附近，可以通过`setGravity(int, int, int)`方法来重新设置显示位置。这个方法有三个参数：
 
	1. Gravity常量（详细参照Gravity类）。
	2. X轴偏移量。
	3. Y轴偏移量。
　　例如：如果你想让`Toast`通知显示在屏幕的左上角，可以这样设置`setGravity(int ,int ,int )`方法：
``` android
//  多个位置参数之间使用“|”符号间隔。
toast.setGravity(Gravity.TOP|Gravity.LEFT, 0, 0);
```
　　如果想让位置向右移，可以增加第二个参数的值，要向下移动，可以增加最后一个参数的值。

## 自定义Toast ##
　　如果一个简单的文本消息不能满足显示的需要，你可以给`Toast`通知创建一个自定义的布局(`layout`)。要创建一个自定义的布局(`layout`)，可以在XML文件或程序代码中定义一个`View`布局，然后把(根)View对象传递给`setView(View)`方法。

<br>　　范例1：显示一个控件。
``` android
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
        Button btn = new Button(this);
        btn.setText("我是一个按钮");
		
        Toast toast = new Toast(this);
        toast.setView(btn);
        toast.show();
    }
}
```
    语句解释：
    -  若需要显示一个丰富多彩的提示信息，可以通过new来手动创建一个Toast对象。

# 第二节 Dialogs #
　　对话框通常是一个显示在当前Activity之前的小窗口，常用于通知用户做出选择或输入信息。一个对话框不填满屏幕，并且是模式对话框(即不处理对话框则无法操作其他界面)。
　　常见的对话框如下图所示：

<center>
![](/img/android/android_3_24.png)
</center>

<br>　　`Dialog`类是所有对话框的基类，但你应该避免直接实例化`Dialog`。相反，应该使用以下子类：

	-  AlertDialog：可以显示0~3个按钮的对话框，并且能够包含一个单选或多选按钮列表。AlertDialog是最常用的对话框。
	-  ProgressDialog：显示一个进度滚轮或进度条的对话框。它是AlertDialog的子类，所以也支持按钮。进度条对话框影响用户体验，已不推荐使用。
	-  DatePickerDialog和TimePickerDialog：一个有预定义用户界面的对话框，允许用户选择一个日期或时间。

<br>　　范例1：Dialog类。
``` android
//  将Dialog从屏幕中移除，同时释放掉Dialog对象所占据的资源。
public void dismiss();

//  设置是否允许用户通过点击手机中的回退按钮来关闭对话框。默认为true。
public void setCancelable(boolean flag);

//  设置对话框窗口的标题。此方法有重载setTitle(int) 其中参数为String类型的资源ID。
public void setTitle(CharSequence title);

//  在屏幕上启动并显示出对话框。
public void show();

//  将指定的View添加到向Dialog中。
public void addContentView(View view, ViewGroup.LayoutParams params);
```

<br>　　注意：

	-  在实例化各种Dialog时，需要为其构造方法传递一个Context对象。
	-  在Android中，当应用程序开启时，系统会为该应用程序创建一个全局Context对象。在程序中的某个Activity被创建时，系统会将该Context对象设置到Activity对象中，然后Activity会再次把该全局Context对象进行封装。
	-  最初的全局Context对象通过ContextWrapper类的getApplicationContext()方法可以获得。
	-  在构造对话框对象时，为其构造方法传递的Context对象，不能是最初的那个全局Context对象。而只能是Activity封装后的Context对象，也就是可以直接把Activity对象传递给Dialog。
	-  但是Toast对象则没有这个要求，它可以接收任何Context对象，因为它不依赖与某个Activity。
	-  在非main线程中是不可以Toast和显示Dialog的。
 
## AlertDialog ##
　　警告对话框`AlertDialog`是Dialog最常用的一个子类。一个警告对话框有三个地区，如下图所示：

<center>
![](/img/android/android_3_25.png)
</center>

　　**1. 标题** 
　　这是可选的。如果你需要显示一个简单的信息或问题的状态(如下图)，则你就不需要使用标题。

<center>
![](/img/android/android_3_26.png)
</center>

　　**2. 内容区域。 **
　　对话框的正文部分。这里可以显示一个文本消息，一个列表，或其他自定义布局。

　　**3. 动作按钮。 **
　　用户可点击的按钮，在`AlertDialog`对话框中最多只支持三个按钮。

<br>　　构建警告对话框需要使用`AlertDialog`的静态内部类`AlertDialog.Builder`类。去构造一个`AlertDialog`最简单的步骤：
``` android
// 1. 通过构造方法实例化一个AlertDialog.Builder对象。
AlertDialog.Builder builder = new AlertDialog.Builder(context);

// 2. 调用各个set方法为对话框设置不同的数据。
builder.setMessage(R.string.dialog_message).setTitle(R.string.dialog_title);

// 3. 调用create()方法创建AlertDialog对象。
AlertDialog dialog = builder.create();
```

<br>　　范例1：`AlertDialog.Builder`类。
``` android
//  下面三个方法，依次用来设置对话框的标题栏上的图标、标题、消息正文。
public AlertDialog.Builder setIcon(int iconId);
public AlertDialog.Builder setTitle(CharSequence title);
public AlertDialog.Builder setMessage(CharSequence messageId);


//  描述：在警告对话框中最多可以存在三个Button对象，下面三个方法依次用来设置对话框的三个按钮。
//    positiveButton对应最左边的按钮。
//    neutralButton对应中间的按钮。
//    negativeButton对应最右边的按钮。
//  参数：
//    text ：按钮所要显示的文本。
//    listener是一个监听器，当用户点击该按钮时，会触发相应的事件。
public AlertDialog.Builder setPositiveButton(CharSequence text, DialogInterface.OnClickListener listener);
public AlertDialog.Builder setNeutralButton(CharSequence text, DialogInterface.OnClickListener listener);
public AlertDialog.Builder setNegativeButton(CharSequence text, DialogInterface.OnClickListener lis);


//  描述：显示一个列表对话框。此方法有重载setItems(String[]) 。
//  参数：
//    itemsId：对话框所要显示的数据的资源ID。数据应该是一个数组类型的。
//    listener是一个监听器，当用户点击该对话框中的某个Item时，会触发相应的事件。
public AlertDialog.Builder setItems(int itemsId, DialogInterface.OnClickListener listener);


//  描述：显示一个单选按钮对话框。此方法有setSingleChoiceItems(CharSequence[]) 等多个重载。
//  参数：
//    itemsId：对话框所要显示的数据的资源ID。数据应该是一个数组类型的。
//    checkedItem默认选中项，下标从0开始计算，若取值为-1则将没有默认选中项。 
public AlertDialog.Builder setSingleChoiceItems(int itemsId, int checkedItem, DialogInterface.OnClickListener listener);


//  描述：显示一个多选按钮对话框。此方法有setMultiChoiceItems(CharSequence[]) 等多个重载。
//  参数：
//    itemsId：对话框所要显示的数据的资源ID。数据应该是一个数组类型的。
//    checkedItem 设置每个选项的当前状态，若被选中，则值为True 。
public AlertDialog.Builder setMultiChoiceItems (int itemsId, boolean[] checkedItems, DialogInterface.OnMultiChoiceClickListener listener)
```

<br>　　范例2：`DialogInterface.OnClickListener`接口。
``` android
//  描述：当用户点击了对话框中的按钮时，会触发此监听器，并调用此方法。
//  参数：
//    itemsId：对话框所要显示的数据的资源ID。数据应该是一个数组类型的。
//    whick ：产生事件的按钮。AlertDialog有三个常量与之对应：
//    -  AlertDialog.BUTTON_POSITIVE ：第一个按钮 。值为 -1 。
//    -  AlertDialog.BUTTON_NEUTRAL ：第二个按钮。值为 -2 。
//    -  AlertDialog.BUTTON_NEGATIVE ：第三个按钮。值为 -3 。
public abstract void onClick (DialogInterface dialog, int which)
```

<br>　　范例3：添加按钮。
　　调用`set…Button()`方法可以为按钮指定一个文本标签，也可以为按钮设置事件监听器对象(`DialogInterface.OnClickListener`类型的)，当用户点击按钮时会回调对应的方法。
　　你最多可以在对话框中设置三个动作按钮：

	-  Positive：你应该使用这个按钮来表示“接受”或“继续”动作。
	-  Negative：你应该使用这个按钮来表示“取消”动作。
	-  Neutral：你应该使用它表示“用户不想处理”动作，不一定表示取消。它在positive和negative按钮之间显示，比如这个按钮可能显示“稍后提醒”。
　　这三种类型的按钮每个类型在AlertDialog只能设置一个，也就是说你无法在对话框中设置两个`positive`按钮。
　　当对话框中的某个按钮被点击后，对话框会自动被关闭。

``` android
public void onClick(View view) {
    // 创建一个事件监听器。
    OnClickListener listener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            switch (which) {
                case AlertDialog.BUTTON_POSITIVE:
                    Toast.makeText(getApplicationContext(),"POSITIVE",0).show();
                break;
            }
        }
    };
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setMessage(R.string.content);
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setNegativeButton("...", listener);
    dialog.setNeutralButton("哦,是吗!", listener);
    dialog.show();
}
```

<br>　　范例4：添加列表。
　　使用`AlertDialog`提供的API可以添加三种类型的列表：

	-  传统的单一选择列表。
	-  单选列表(包含多个单选按钮)。
	-  多选列表(包含多个多选按钮)。
　　创建一个像下图所示的传统的单一选择列表需要调用`setItems()`方法：

<center>
![](/img/android/android_3_27.png)
</center>

　　由于这个列表显示在对话框的内容区域中，所以你不可以同时显示文本消息和列表，也就是说`AlertDialog.Builder`类的`setItems()`方法和`setMessage()`方法不可以同时使用。
``` android
public void onClick(View view) {
    final String[] array = { "A", "B", "C", "D" };
    // 创建一个事件监听器。
    OnClickListener listener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            if (AlertDialog.BUTTON_POSITIVE == which) {
                Toast.makeText(getApplicationContext(), "POSITIVE ", 0).show();
                return;
            }
            Toast.makeText(getApplicationContext(), "您点击的 " + array[which], 0).show();
        }
    };
    int i = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setItems(array, listener);
    dialog.show();
}
```
    语句解释：
    -  对话框中的按钮和各个Item项可以共用一个事件监听器。
    -  当某个Item被点击时，当前对话框同样会自动被关闭，参数which的值就是该Item的下标，下标从0开始计算。

<br>　　范例5：单选对话框。
``` android
private String choose = null;
private String[] array = {"男","女"};
public void onClick(View view){
    // 创建一个事件监听器。
    OnClickListener listener = new OnClickListener(){
        public void onClick(DialogInterface dialog, int which) {
            if(AlertDialog.BUTTON_POSITIVE == which){
                Toast.makeText(getApplicationContext(),"您点击的"+choose,0).show();
                return;
            }
            choose = array[which];
        }
    };
    int i  = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", listener);
    dialog.setSingleChoiceItems(array, -1, listener);
    dialog.show();
}
```
    语句解释：
    -  使用setSingleChoiceItems方法可以显示一个单选按钮列表。
    -  注意：此时，当点击对话框中的单选按钮后，对话框并不会被关闭。参数which是用户点击的单选按钮的下标，下标从0开始。
    -  若3个按钮都没有设置，则只有通过back键才能将对话框关闭，若您又禁用了back键，则就不好办了。

<br>　　范例6：多选对话框。
``` android
private boolean[] choose = new boolean[2];
private String[] array = { "A", "B" };
public void onClick(View view) {
    // 创建一个事件监听器。
    OnClickListener btnlistener = new OnClickListener() {
        public void onClick(DialogInterface dialog, int which) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < choose.length; i++) {
                if (choose[i]) {
                    sb.append(array[i]).append(",");
                }
            }
            Toast.makeText(getApplicationContext(), sb.toString(), 0).show();
        }
    };
    int i = AlertDialog.BUTTON_NEGATIVE;
    // 创建一个对话框。
    AlertDialog.Builder dialog = new AlertDialog.Builder(this);
    dialog.setIcon(R.drawable.icon);
    dialog.setTitle(R.string.title);
    dialog.setCancelable(false);
    dialog.setPositiveButton("哈哈,知道了!", btnlistener);
    dialog.setMultiChoiceItems(array, choose,
            new OnMultiChoiceClickListener() {
                //  描述：用户点击了多选框对话框中的某个Item时，会触发此事件。
                //  参数：
                //  -  dialog：产生事件的Dialog对象。
                //  -  which：产生事件的多选按钮，下标从0开始。
                //  -  isChecked：产生事件的多选按钮的当前是否被选中。
                public void onClick(DialogInterface dialog, int which, boolean isChecked) {
                    choose[which] = isChecked;
                }
            });
    dialog.show();
}
```
    语句解释：
    -  使用setMultiChoiceItems方法可以显示一个多选按钮对话框。
    -  注意：此时，当点击对话框中的多选按钮后，对话框并不会被关闭。
    -  可以在调用setMultiChoiceItems方法时，指定一个DialogInterface.OnMultiChoiceClickListener类型的监听器，用于监听每一选项。

## ProgressDialog ##
　　进度条对话框`ProgressDialog`和进度条控件`ProgressBar`的用法十分相似，都是通过线程来不断的更新进度条。

<br>　　范例1：ProgressDialog类 。
``` android
//  获取第一进度条的最大值、当前值。若当前Progress是圆形(即未知)进度条，则getProgress()总是返回0 。
public int getMax(); 
public int getProgress();

//  设置第一进度条的最大值、当前值。
public void setMax(int max);
public void setProgress(int value);

//  设置进度条的显示风格。取值：
//  -  水平进度条：ProgressDialog.STYLE_HORIZONTAL 。
//  -  环形进度条：ProgressDialog.STYLE_SPINNER 。
public void setProgressStyle(int style);

//  设置进度条对话框显示的正文。
public void setMessage(CharSequence message);

//  设置第二进度条当前值。
public int setSecondaryProgress();
```

<br>　　范例2：创建进度条对话框。
``` android
public class ViewTextActivity extends Activity {
    private ProgressDialog dialog;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        this.dialog = new ProgressDialog(this);
        this.dialog.setMax(100);
        this.dialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
    }
    public void onClick(View view) {
        dialog.show();		
        new Thread(){
            int i = 0;
            public void run(){
                while(dialog.getProgress()<dialog.getMax()){
                    dialog.setProgress(i++);
                    try {
                        Thread.sleep(30);
                    } catch (InterruptedException e) {}
                }
                dialog.dismiss();
            }
        }.start();
    }
}
```

## LayoutInflater ##
　　通过XML文件来设置Activity的布局，布局中的控件的位置、数量在程序编译的时候都已经是固定的了。
　　但是在一些特殊的情况下，可能需要在程序运行的时动态的修改布局的内容（比如增删控件），此时就只能通过编码的方式，动态的修改布局中的内容了。

<br>　　范例1：`main.xml`文件。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" 
    android:id="@+id/rootLayout" >
</LinearLayout>
```

<br>　　范例2：通过编码的方式添加TextView。
``` android
public class MainActivity extends Activity {
    private LinearLayout rootLayout;
    private TextView textView;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        // 初始化控件。
        this.rootLayout = (LinearLayout) this.findViewById(R.id.rootLayout);
        this.textView = new TextView(MainActivity.this);
        this.textView.setText("Hi TextView!");
        
        // 将textView添加到rootLayout中。
        this.rootLayout.addView(this.textView);
    }
}
```
    语句解释：
    -  首先，通过资源ID，从当前Activity的xml布局文件中获取LinearLayout的引用。
    -  然后，创建一个TextView控件，创建TextView对象时需要为其指出一个Context对象。 
    -  接着，调用LinearLayout继承自ViewGroup类的addView方法，将新控件添加到布局中。
    -  最后，一个控件只可以有一个父控件，即textView被放入到rootLayout后就不可以再被放入其他布局对象中，否则程序将抛异常。

<br>　　范例3：对象重用。
``` android
TextView text1 = (TextView) this.findViewById(R.id.text);
TextView text2 = (TextView) this.findViewById(R.id.text);
System.out.println(text1 == text2); //输出true。
```
    语句解释：
    -  若满足“text1 == text2”则意味着它们是同一个控件对象。
    -  在为Activity调用setContentView()方法设置布局后，就会将xml文件中的根节点实例化出来，而之后调用Activity的findViewById()方法就是在根节点对象内依据id查找子控件。 因此本范例会输出true。

<br>　　Activity类的`findViewById()`方法只能获取当前Activity的XML布局文件中的控件。若想将其他XML文件中的控件添加到当前Activity中就需要使用`LayoutInflater`类了。 

<br>　　范例4：`LayoutInflater`类。
``` android
//  描述：从指定的xml文件中获取其根节点(View) ，然后将根节点添加到root中，接着将该根节点的引用返回来。
//  参数：
//    resource ：xml文件的id 。如R.layout.main。root的取值可以为空。
//  返回值：返回resource所对应的布局文件中的根View的引用。
public View inflate(int resource, ViewGroup root);

//  根据指定的Context对象构造出一个LayoutInflater对象。
public static LayoutInflater from (Context context)
```

<br>　　范例5：招募小弟。
``` java
//  指定服务的名称，获取一个系统级的服务。此处则是获取一个LayoutInflater对象。
LayoutInflater inflater = (LayoutInflater) this.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
//  获取当前xml文件的根节点。
LinearLayout layout =(LinearLayout) this.findViewById(R.id.rootLayout);
//  从other.xml文件中获取其根节点，并将其放入layout中，如果已经存在了则不会再次放入。
LinearLayout text1 = (LinearLayout) inflater.inflate(R.layout.other, layout);
LinearLayout text2 = (LinearLayout) inflater.inflate(R.layout.other, layout);
//  注意： 此处会输出true 。
System.out.println(text1 ==  text2); 
```
    语句解释：
    -  虽然通过inflate方法向layout中添加了两遍，但是在当前Activity中只会显示添加一个。

<br>　　范例6：招募小弟2.0。
``` java
LayoutInflater inflater = (LayoutInflater) this.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
LinearLayout layout =(LinearLayout) this.findViewById(R.id.rootLayout);
LinearLayout text1 = (LinearLayout) inflater.inflate(R.layout.other, null);
LinearLayout text2 = (LinearLayout) inflater.inflate(R.layout.other, null);
//  注意： 此处会输出false。
System.out.println(text1 ==  text2); 
layout.addView(text1);
layout.addView(text2);
```
    语句解释：
    -  由于调用inflate方法时并没有将布局文件放入到任何控件中，因此每次inflate时都会返回一个新对象。所以调用ViewGroup的addView方法可以重复添加元素。

<br>　　范例7：父与子。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" 
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" 
    android:id="@+id/rootLayout">
<TextView 
    android:layout_width="fill_parent"
    android:layout_height="wrap_content" 
    android:text="@string/hello" 
    android:id="@+id/text" />
</LinearLayout>
```
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        LinearLayout layout = (LinearLayout)this.findViewById(R.id.rootLayout);
        TextView text = (TextView) layout.getChildAt(0);
        // 输出true 。
        System.out.println(text.getParent() == layout);
    }
}
```
    语句解释：
    -  View类的getParent()方法返回值是一个ViewParnet对象，通常可以将ViewParnet进行向下转型为View，但是，这并不意味着返回的ViewParnet一定是个View，仅仅是通常 。
    -  ViewGroup的getChildAt(int index)方法指定一个下标，获取当前View内部所包含的子View，下标从0开始，若下标越界则返回null。
       -  提示：在AdapterView中，此方法从当前布局中所有可见的子View 中获取index所对应的View，下标从0开始，若下标越界则返回null 。

<br>**ViewGroup.LayoutParams**
　　前面已经成功的实现动态向Activity中添加控件了。但是还是有一个缺点：上面的代码在创建完毕控件后，并没有为控件指定宽、高等属性。

<br>　　范例1：动态添加组件。
``` android
public class WebViewActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // 初始化控件。
        LinearLayout linear = new LinearLayout(this);
        TextView username = new TextView(this);
        Button validate = new Button(this);
        // 设置文本
        username.setText("用户名：");
        validate.setText("验证");
        // 将Button和TextView添加到LinearLayout中。
        linear.addView(username);
        linear.addView(validate);
        setContentView(linear);
    } 
}
```
    语句解释：
    -  本范例就是在程序中动态的添加控件。
    -  本范例中控件的宽、高、padding、margin等属性的值都没有设置。 这些属性被称为：布局参数。使用ViewGroup.LayoutParams类来表示。 

<br>　　范例2：指定宽、高。
``` android
//  设置线性布局的排列方式。取值有：LinearLayout.VERTICAL（垂直排列）和LinearLayout.HORIZONTAL（水平排列）。
linear.setOrientation(LinearLayout.VERTICAL);
// 将Button和TextView添加到LinearLayout中，同时为它们指定宽、高。
linear.addView(username, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
linear.addView(validate, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
setContentView(linear);
```
    语句解释：
    -  在ViewGroup.LayoutParams的构造方法中除了可以使用常量外，也可以指定具体数值。
    -  在Android中的布局控件(如：LinearLayout、RadioGroup等)都具有一个名为LayoutParams的内部类。
    -  各个LayoutParams各自提供了不同的布局参数，用于描述该控件不同的属性。它们都派生自ViewGroup.LayoutParams。 

<br>　　范例3：Margin属性。
``` android
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 创建一个线形布局。
        LinearLayout linearLayout = new LinearLayout(this);
        TextView textView = new TextView(this);
        textView.setText("Hi Androdi");
        // 为TextView设置布局参数。
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(100, 50);
        params.topMargin = 100;
        params.leftMargin = 100;
        // 将TextView添加到布局中。
        linearLayout.addView(textView,params);
       
        setContentView(linearLayout);
    }
}
```
    语句解释：
    -  使用布局参数的topMargin等属性可以设置当前View与其相邻控件或父控件间的间距。
    -  本范例中addView()方法将控件textView按照params所指定的参数，将其放置到父控件linearLayout中。

<br>**WindowManager.LayoutParams**
　　使用WindowManager提供的API可以向其内部添加的控件，控件最终会被放到当前屏幕上。

<br>　　范例1：添加控件。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WindowManager manager = getWindowManager();
        TextView text = new TextView(this);
        text.setText("AAAAAA");
        
        LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        manager.addView(text, params);
    }
}
```

<br>　　`WindowManager.LayoutParams`中有两个特殊的属性：
	-  flags：为控件设置一些附加信息。下面列出常见的flag：
	   -  FLAG_NOT_FOCUSABLE ：控件将不会获取焦点。
	   -  FLAG_ALT_FOCUSABLE_IM ：控件将会获取焦点。
	   -  FLAG_NOT_TOUCHABLE ：控件将不会接收触摸事件。
	   -  FLAG_KEEP_SCREEN_ON ：使屏幕保持高亮。
	-  type：指出控件的类型。被放入WindowManager的控件是有等级之分的，等级高的控件将被放到等级低的控件上面。若最高等级控件的宽高是“MATCH_PARENT”，则其下面的控件都将被完全遮住，若等级相同则后加入的会被放到上面显示。下面列出常见的type：
	   -  TYPE_TOAST ：吐司级别。
	   -  TYPE_SYSTEM_ALERT ：系统窗口级别。比如：显示电量低时弹出的Alert对话框。
	   -  TYPE_SYSTEM_OVERLAY ：系统窗口之上的级别，此级别的控件无法响应点击事件。

<br>　　范例2：使用`flags`、`type`。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        WindowManager manager = getWindowManager();
        TextView text = new TextView(this);
        text.setText("MainActivity");
        
        LayoutParams params = new WindowManager.LayoutParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
        		| WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;
        params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
        manager.addView(text, params);
    }
}
```
    语句解释：
    -  多个flag之间可以使用“|”连接。

<br>　　若`type == TYPE_SYSTEM_ALERT`则需要在`AndroidManifest.xml`中添加如下权限：
``` xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```

## Custom Dialog ##
　　在实际中，内置的各种对话框并不能满足应用的需求，因此往往需要自定义对话框。自定义对话框的最终目的就是自定义对话框中显示的控件。

<br>　　自定义对话框的步骤：
	-  首先，实例化出一个Dialog对象，并设置对话框的初始参数，如标题、图标等。
	-  然后，自定义一个xml布局文件。
	-  接着，将xml布局文件导入到程序中。
	-  最后，调用Dialog对象的setContentView方法，将xml布局文件中所有的控件设置到Dialog对象中去。

<br>　　范例1：自定义布局文件(`layout.xml`)。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" >
    <EditText
    	android:layout_width="match_parent"
    	android:layout_height="wrap_content"
    	android:id="@+id/text"/>
    <Button
    	android:layout_width="wrap_content"
    	android:layout_height="wrap_content"
    	android:text="点击"
    	android:id="@+id/btn"/>
</LinearLayout>
```

<br>　　范例2：自定义对话框的内容。
``` android
Dialog dialog = new Dialog(this);
// 初始化对话框。
dialog.setTitle("对话框的标题");
dialog.setCancelable(false);
// 获取布局文件的根节点。
LayoutInflater inflater = LayoutInflater.from(getApplicationContext());;
LinearLayout layout = (LinearLayout) inflater.inflate(R.layout.layout, null);
// 获取布局中的控件。
Button okBtn = (Button) layout.findViewById(R.id.btn);
EditText input_psw = (EditText) layout.findViewById(R.id.text);
// 在下面可以为按钮添加OnClickListener 、为TextView设置文本信息。
// ......
// 最后，将布局的根节点添加到View中。
dialog.addContentView(layout, new LinearLayout.LayoutParams(220,150));
// 显示对话框。
dialog.show();
```

## Pickers ##
　　Android给用户提供了选择`时间`（小时，分钟，上午/下午）或`日期`（月，日，年）的控件，使用这些选择器有助于确保用户可以选择一个有效的、格式正确的时间或日期，并自动调整到用户的所在区域。

<center>
![](/img/android/android_3_28.png)
</center>

<br>　　范例1：创建一个时间选择器。
``` android
public class MainActivity extends Activity implements OnTimeSetListener {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final Calendar c = Calendar.getInstance();
        int hour = c.get(Calendar.HOUR_OF_DAY);
        int minute = c.get(Calendar.MINUTE);
        //  创建一个TimePickerDialog对象。构造方法：
        //  TimePickerDialog(Context context, TimePickerDialog.OnTimeSetListener callBack, int hourOfDay, int minute, boolean is24HourView)
        //  参数：
        //  -  callBack：当用户选择完时间后，会调用此接口中定义的回调方法。
        //  -  hourOfDay、minute ：时间选择器默认的小时、分钟。
        //  -  is24HourView：是否按24小时制。
        Dialog d = new TimePickerDialog(this, this, hour, minute, DateFormat.is24HourFormat(this));
        d.show();
    }
    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
        // TODO Auto-generated method stub
    }
}
```

<br>　　范例2：创建一个日期选择器。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Dialog d = new DatePickerDialog(this, new OnDateSetListener() {
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Toast.makeText(getApplicationContext(), year + "年" + monthOfYear + "月" + dayOfMonth + "日", 1).show();
            }
        }, 2011, 10, 28);
        d.show();
    }
}
```

<br>　　开发中往往不会直接写死具体日期常量，而是使用`Calendar`工具类。

<br>　　范例3：Calendar抽象类。
``` android
Calendar calendar = new GregorianCalendar();
System.out.println("年: " + calendar.get(Calendar.YEAR));
System.out.println("月: " + (calendar.get(Calendar.MONTH)+1));
System.out.println("日: " + calendar.get(Calendar.DAY_OF_MONTH));
System.out.println("时: " + calendar.get(Calendar.HOUR_OF_DAY));
System.out.println("分: " + calendar.get(Calendar.MINUTE));
System.out.println("秒: " + calendar.get(Calendar.SECOND));
System.out.println("毫秒: " +calendar.get(Calendar.MILLISECOND));
```
    语句解释：
    -  使用java.util包中的Calendar类可以截取出当前Date对象的各个部分。

# 第三节 Notification #
　　`Notification`(通知)，可以让你在你的应用程序UI的外部（即非Activity中）显示给用户一条可交互的消息，在Android中使用`Notification`类来表示一个通知。
　　当你向系统发出一个通知时，系统就会将一个图标放在`状态栏`的`通知区域`（如下图所示），然后当用户下拉状态栏时，就可以看到详细的通知。`状态栏`是系统控制的区域，它们不隶属于任何用户程序，用户可以随时查看。

<center>
![状态栏的通知区域](/img/android/android_3_29.png)
</center>

　　为了创建通知，你必须用到两个类：`Notification`和`NotificationManager`。

	-  Notification类的一个实例代表一个通知，通知有很多属性，如图标，通知信息和一些其他的设定，如播放的声音。
	-  NotificationManager是系统服务，用于执行和管理系统中所有通知(Notification)对象。诸如发送、移除通知等操作都由此类来完成，你不需要直接初始化NotificationManager。

<br>　　在正式创建通知之前，需要先了解下面列出的一些概念。

<br>　　**1. 虽然Android发展的很快，但发展的途中也导致了一些兼容性的问题**
　　对于`Notification`而言`Android3.0`是一个分水岭：

	-  在Android3.0之前，构建Notification推荐使用NotificationCompat.Builder，它位于android.support.v4.app.NotificationCompat.Builder，是一个Android向下版本的兼容包。
	-  在Android3.0之后，一般推荐使用Notification.Builder构建。

　　本节将使用`NotificationCompat.Builder`进行讲解演示。

<br>　　**2. NotificationManager**
　　由于状态栏不隶属于任何应用程序，因此向状态栏`发送`、`更新`、`删除`通知需要使用系统对外提供的接口，也就是通过`NotificationManager`类来完成。
　　`NotificationManager`是通知管理器类，这个对象是由系统维护的服务，是以单例模式的方式存在，通过下面的代码可以获取该类的对象：
``` android
// 其中this表示Activity对象。
NotificationManager mgr = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
```

<br>　　**3. Notification**
　　`Notification`类的一个实例代表一个通知。虽然通知中提供了各种属性的设置，但是一个通知对象，有几个属性是必须要设置的，其他的属性均是可选的，必须设置的属性如下：

	-  小图标，使用setSamllIcon()方法设置。
	-  标题，使用setContentTitle()方法设置。
	-  文本内容，使用setContentText()方法设置。 

<br>　　**4. 更新与移除通知**
　　在使用`NotificationManager.notify()`发送通知的时候，需要传递一个标识符，用于唯一标识这个通知。对于有些场景，并不是无限的添加新的通知，有时候需要更新原有通知的信息，这个时候可以重新构建一个`Notification`对象，而使用与之前通知相同标识符来发送通知，这个时候旧的通知就被被新的通知所取代，起到更新通知的效果。

　　对于一个通知，当展示在状态栏之后，如何取消呢？Android为我们提供两种方式移除通知：
　　第一种是`Notification`自己维护，使用`setAutoCancel()`方法设置是否维护，传递一个`boolean`类型的数据。
　　第二种是使用`NotificationManager`通知管理器对象来维护，它通过`notify()`发送通知的时候，指定的通知标识`id`来操作通知，可以使用`cancel(int)`来移除一个指定的通知，也可以使用`cancelAll()`移除所有的通知。

``` android
//  使用NotificationManager移除指定通知示例。
NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
mNotificationManager.cancel(0);
```

<br>　　**5. PendingIntent**
　　对于一个通知而言，它显示的消息是有限的，一般仅用于提示一些概要信息。但是一般简短的消息，并不能表达需要告诉用户的全部内容，所以需要绑定一个意图，当用户点击通知的时候，调用一个意图展示出一个Activity（或其它组件）用来显示详细的内容。而`Notification`中，并不使用常规的`Intent`去传递一个意图，而是使用`PendingIntent`。

　　先来说说`Intent`和`PendingIntent`的区别，`PendingIntent`是对`Intent`的包装，通过名称可以看出`PendingIntent`可以译为`“延期意图”`，它用于处理即将发生的意图，而`Intent`用来处理马上发生的意图。而对于通知来说，它是系统级的全局通知，并不确定这个意图被执行的时间。当在应用外部执行`PendingIntent`时，因为它保存了触发应用的`Context`，使得外部应用可以如在当前应用中一样，执行`PendingIntent`里的`Intent`，就算执行的时候响应通知的应用已经被销毁（但此时进程没被杀死，若进程死了，则状态栏的通知也就跟着消失了）了，也可以通过存在`PendingIntent`里的`Context`照常执行它，并且还可以处理`Intent`所带来的额外信息。

　　`PendingIntent`提供了多个静态的`getXxx()`方法，用于获得适用于不同场景的`PendingIntent`对象。一般需要传递的几个参数都很常规，这里只介绍一个`flag`参数，用于标识`PendingIntent`的构造选择：

	-  FLAG_CANCEL_CURRENT：如果构建的PendingIntent已经存在，则取消前一个，重新构建一个。
	-  FLAG_NO_CREATE：如果前一个PendingIntent已经不存在了，将不再构建它。
	-  FLAG_ONE_SHOT：表明这里构建的PendingIntent只能使用一次。
	-  FLAG_UPDATE_CURRENT：如果构建的PendingIntent已经存在，则替换它，常用。

<br>　　**6. Notification视觉风格**
　　`Notification`有两种视觉风格，一种是标准视图(Normal view)、一种是大视图（Big view）。标准视图在Android中各版本是通用的，但是对于大视图而言，仅支持`Android4.1+`的版本。

## 标准视图 ##
　　从官方文档了解到，一个标准视图显示的大小要保持在`64dp`高，宽度为屏幕标准。标准视图的通知主体内容有一下几个：

<center>
![](/img/android/android_3_30.png)
</center>

	1. 通知标题（contentTitle）。
	2. 大图标（largeIcon）。
	3. 通知内容（contentText）。
	4. 通知消息（number）。
	5. 小图标（smallIcon）。
	6. 通知的时间，一般为系统时间，也可以使用setWhen()设置。

　　下面通过一个示例，模仿上面效果的通知。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(MainActivity.this);
        mBuilder.setSmallIcon(R.drawable.ic_launcher);
        mBuilder.setContentTitle("5 new message");
        mBuilder.setContentText("twain@android.com");
        //  状态栏通知区域上一闪而过的文本消息。
        mBuilder.setTicker("New message");
        mBuilder.setNumber(12);
        Bitmap btm = BitmapFactory.decodeResource(getResources(),R.drawable.ic_action_download);
        mBuilder.setLargeIcon(btm);
        //  自己维护通知的消失
        mBuilder.setAutoCancel(true);
        //  构建一个Intent
        Intent resultIntent = new Intent(MainActivity.this, MainActivity.class);
        //  封装一个PendingIntent
        PendingIntent resultPendingIntent = PendingIntent.getActivity(
                MainActivity.this, 0, resultIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        //  设置通知主题的意图
        mBuilder.setContentIntent(resultPendingIntent);
        //  获取通知管理器对象
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, mBuilder.build());
    }
}
```

　　显示效果：

<center>
![](/img/android/android_3_31.png)
</center>

## 大视图 ##
　　而对于大视图（Big View）而言，它的细节区域只能显示`256dp`高度的内容，并且只对`Android4.1+`之后（但在之前的版本中也不会报错）的设备才支持，它比标准视图不一样的地方，均需要使用`setStyle()`方法设定，它大致的效果如下：

<center>
![](/img/android/android_3_32.png)
</center>

　　`setStyle()`传递一个`NotificationCompat.Style`对象，它是一个抽象类，Android为我们提供了三个实现类，用于显示不同的场景。分别是：

	-  NotificationCompat.BigPictureStyle, 在细节部分显示一个256dp高度的位图。
	-  NotificationCompat.BigTextStyle，在细节部分显示一个大的文本块。
	-  NotificationCompat.InboxStyle，在细节部分显示多行文本。

<br>　　如果仅仅显示一个图片，使用`BigPictureStyle`是最方便的；如果需要显示一个富文本（或者是不需要换行的长文本）信息，则可以使用`BigTextStyle`；如果仅仅用于显示一个文本（需要换行）的信息，那么使用`InboxStyle`即可。下面会以一个示例来展示`InboxStyle`的使用，模仿上面图片的显示。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        Bitmap btm = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,PendingIntent.FLAG_CANCEL_CURRENT);
        Notification noti = new NotificationCompat.Builder(this)
            .setSmallIcon(R.drawable.ic_launcher)
            .setLargeIcon(btm)
            .setNumber(13)
            .setContentText("ContentText")
            .setContentTitle("ContentTitle")
            .setContentIntent(pendingIntent)
            // 设置通知被展开时，所显示的内容。
            .setStyle(new NotificationCompat.InboxStyle()
                // 一行行的增加文本。
                .addLine("M.Twain (Google+) Haiku is more than a cert...")
                .addLine("M.Twain Reminder")
                .addLine("M.Twain Lunch?")
                .addLine("M.Twain Revised Specs")
                .addLine("M.Twain ")
                .addLine("Google Play Celebrate 25 billion apps with Goo..")
                .addLine("Stack Exchange StackOverflow weekly Newsl...")
                .setBigContentTitle("6 new message")
                .setSummaryText("mtwain@android.com"))
        .build();
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, noti);
    }
}
```

　　显示效果：

<center>
![](/img/android/android_3_33.png)
</center>

　　值得注意的是，不同厂家的手机对大视图风格的通知有不同的展现形式，比如：

	-  在三星S5手机上，当程序向状态栏中添加大视图风格的通知时，默认情况该通知会被折叠起来（即和正常通知的大小一样），用户可以通过滑动来展开通知，通知一旦被展开则无法重新折叠回去。
	-  在Android4.1的模拟器上，默认直接将大视图的通知给展开，因而用户无法查看到通知的contentTitle、contentText属性的值，同时也无法将通知折叠回去，所以通常情况下我们应该为setContentText和setBigContentTitle传递相似的值。

　　还有一点就是，`Android4.1`之前的设备上是无法显示大视图的通知的，因此为了兼容性考虑，请务必设置通知的`contentTitle`、`contentText`属性的值。

## 进度条样式的通知 ##
　　对于一个标准通知，有时候显示的消息并不一定是静态的，还可以设定一个进度条用于显示事务完成的进度。

　　`Notification.Builder`类中提供一个`setProgress(int max, int progress, boolean indeterminate)`方法用于设置进度条：

	-  max用于设定进度的最大数。
	-  progress用于设定当前的进度
	-  indeterminate用于设定是否是一个不确定进度的进度条。
　　通过`indeterminate`的设置，可以实现两种不同样式的进度条，一种是有进度刻度的（`true`）,一种是循环流动的（`false`）。


<br>　　范例1：有进度刻度。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        final NotificationCompat.Builder builder = new NotificationCompat.Builder(MainActivity.this);
        builder.setSmallIcon(R.drawable.ic_launcher);
        builder.setContentTitle("Picture Download");
        builder.setContentText("Download in progress");
        builder.setAutoCancel(true);
        final PendingIntent pendingintent = PendingIntent.getActivity(this, 0, new Intent(), PendingIntent.FLAG_CANCEL_CURRENT);
        builder.setContentIntent(pendingintent);
        final NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        //通过一个子线程，动态增加进度条刻度
        new Thread(new Runnable() {
            public void run() {
                int incr;
                for (incr = 0; incr <= 100; incr += 5) {
                    builder.setProgress(100, incr, false);
                    manager.notify(0, builder.build());
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException e) { }
                }
                builder.setContentText("Download complete");
                builder.setProgress(0, 0, false);
                manager.notify(0, builder.build());
            }
        }).start();
    }
}
```
    语句解释：
    -  只有在Android4.0+以后的版本中通知才支持进度条，在更低的版本中通知里是不会包含进度条的。
    -  只要把setProgress方法的第三个参数改为true，就可以显示一个不确定的进度条。

## 自定义通知 ##
　　和`Toast`一样，通知也可以使用自定义的XML来自定义样式，但是对于通知而言，因为它的全局性，并不能简单`inflate`出一个View，因为可能触发通知的时候，响应的App已经关闭，无法获取当指定的XML布局文件。所以需要使用单独的一个`RemoteViews`类来操作。

　　`RemoteViews`描述了一个视图层次的结构，可以显示在另一个进程，这个类提供了一些基本的操作求改其`inflate`的内容。
　　`RemoteViews`提供了多个构造函数，一般使用`RemoteViews(String packageName, int layoutId)`。第一个参数为包的名称，第二个为layout资源的Id。当获取到`RemoteViews`对象之后，可以使用它的一系列`setXxx()`方法通过控件的Id设置控件的属性。
　　最后使用`NotificationCompat.Builder.setContent(RemoteViews)`方法设置它到一个`Notification`中。

<br>**创建XML文件**
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/layout"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    android:padding="10dp" >
    <ImageView android:id="@+id/image"
        android:layout_width="wrap_content"
        android:layout_height="fill_parent"
        android:layout_alignParentLeft="true"
        android:layout_marginRight="10dp" />
    <TextView android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_toRightOf="@id/image"
        style="@style/NotificationTitle" />
    <TextView android:id="@+id/text"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_toRightOf="@id/image"
        android:layout_below="@id/title"
        style="@style/NotificationText" />
</RelativeLayout>
```
　　注意那两个TextView的`style`属性。在自定义通知界面时，为文本使用`style`文件进行定义是很重要的，因为通知界面的背景色会因为不同的硬件，不同的`os`版本而改变。从`Android2.3(API 9)`开始，系统为默认的通知界面定义了文本的`style`属性。
　　因此，你应该使用`style`属性，以便于在`Android2.3`或更高的版本上可以清晰地显示你的文本，而不被背景色干扰。

<br>　　例如，在低于`Android2.3`的版本中使用标准文本颜色，应该使用如下的文件`res/values/styles.xml`:
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="NotificationText">
      <item name="android:textColor">?android:attr/textColorPrimary</item>
    </style>
    <style name="NotificationTitle">
      <item name="android:textColor">?android:attr/textColorPrimary</item>
      <item name="android:textStyle">bold</item>
    </style>
    <!-- If you want a slightly different color for some text, consider using ?android:attr/textColorSecondary -->
</resources>
```

<br>　　然后，在高于`Android2.3`的系统中使用系统默认的颜色。如`res/values-v9/styles.xml`：
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
   <style name="NotificationText" parent="android:TextAppearance.StatusBar.EventContent" />
   <style
    name="NotificationTitle" parent="android:TextAppearance.StatusBar.EventContent.Title" />
</resources>
```

<br>　　现在，当运行在`2.3`版本以上时，在你的界面中，文本都会是同一种颜色-系统为默认通知界面定义的颜色。这很重要，能保证你的文本颜色是高亮的，即使背景色是意料之外的颜色，你的文本页也会作出适当的改变。

<br>**代码实现**
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        RemoteViews contentViews = new RemoteViews(getPackageName(), R.layout.custom_notification);
        //通过控件的Id设置属性
        contentViews.setImageViewResource(R.id.image, R.drawable.ic_launcher);
        contentViews.setTextViewText(R.id.title, "Custom notification");
        contentViews.setTextViewText(R.id.text, "This is a custom layout");

        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,PendingIntent.FLAG_CANCEL_CURRENT);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle("My notification")
            .setTicker("new message");
        mBuilder.setAutoCancel(true);
        mBuilder.setContentIntent(pendingIntent);
        mBuilder.setContent(contentViews);
        mBuilder.setAutoCancel(true);
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(10, mBuilder.build());
    }
}
```

　　显示效果：

<center>
![](/img/android/android_3_34.png)
</center>

<br>　　之前也说了，带有进度条的通知只能运行在`Android4.0`系统以上，如果想在`Android4.0`以下使用，则就只能通过自定义通知的方式实现了，当想修改进度条的值时，只需要调用`RemoteViews.setProgressBar()`方法，然后再重新发送一遍通知即可。
``` android
contentViews.setProgressBar(R.id.progressbar, 100, curProgress, false);
contentViews.setTextViewText(R.id.percent, "已下载："+curProgress); 
mNotificationManager.notify(notifyId, mBuilder.build());
```

## 设定提示响应 ##
　　对于有些通知，需要调用一些设备的资源，使用户能更快的发现有新通知，一般可设定的响应有：铃声、闪光灯、震动。对于这三个属性，`NotificationCompat.Builder`提供了三个方法设定：

	-  setSound(Uri sound)：设定一个铃声，用于在通知的时候响应，传递一个Uri的参数。
	-  setLights(int argb, int onMs, int offMs)：设定前置LED灯的闪烁速率，持续毫秒数，停顿毫秒数。
	-  setVibrate(long[] pattern)：设定震动的模式，以一个long数组保存毫秒级间隔的震动。

<br>　　大多数时候，我们并不需要设定一个特定的响应效果，只需要遵照用户设备上系统通知的效果即可，那么可以使用`setDefaults(int)`方法设定默认响应参数，在`Notification`中，对它的参数使用常量定义了，我们只需使用即可：

	-  DEFAULT_ALL：铃声、闪光、震动均系统默认。
	-  DEFAULT_SOUND：系统默认铃声。
	-  DEFAULT_VIBRATE：系统默认震动。
	-  DEFAULT_LIGHTS：系统默认闪光。

<br>　　而在Android中，如果需要访问硬件设备的话，是需要对其进行授权的，所以需要在清单文件`AndroidManifest.xml`中增加两个授权，分别授予访问振动器与闪光灯的权限：
``` xml
<!-- 闪光灯权限 -->
<uses-permission android:name="android.permission.FLASHLIGHT"/>
<!-- 振动器权限 -->
<uses-permission android:name="android.permission.VIBRATE"/>
```

<br>**添加声音**
``` android
// 使用res/raw目录下的音乐文件。
mBuilder.setSound(Uri.parse("android.resource://"+getPackageName()+"/"+R.raw.system));

// 使用SD卡下的音乐文件。
mBuilder.setSound(Uri.parse("file://"+Environment.getExternalStorageDirectory()+"/notification/ringer.mp3"));

// 使用系统的默认声音。
mBuilder.setDefaults(Notification.DEFAULT_SOUND);
```

<br>**添加震动**
``` android
// 使用系统默认的震动
mBuilder.setDefaults(Notification.DEFAULT_VIBRATE);

// 自定义的方式，要是定义一个long型数组，赋值给vibrate属性。
mBuilder.setVibrate(new long[] { 100, 200, 300 });
```
    语句解释：
    -  long型的数组定义了交替振动的方式和振动的时间（毫秒）。第一个值是指振动前的准备（间歇）时间，第二个值是第一次振动的时间，第三个值又是间歇的时间，以此类推。振动的方式任你设定。但是不能够反复不停。

<br>**添加闪灯**
``` andriod
// 使用默认闪灯
mBuilder.setDefaults(Notification.DEFAULT_LIGHTS);
```

<br>
**本节参考阅读：**
- [Android--通知之Notification](http://www.cnblogs.com/plokmju/p/android_notification.html)
- [Notifications in Android 4.4 and Lower](http://developer.android.com/design/patterns/notifications_k.html)



<br><br>