title: 实战篇　第五章 设计模式
date: 2015-6-29 17:15:30
categories: Android
---
　　设计模式，有非常多的定义，有人会举出`Gang of Four`那本`《Design Patterns》`来解释，而笔者认为：

	-  设计模式是软件开发领域中针对特定上下文的特定问题的解决方案。
	-  《Design Patterns》中举出了23种设计模式，它们分别用于不同的场景，当我们处在这23种场景下时，按照对应的设计模式所规定的思路去编程，可以写出结构合理、扩展性很强的代码。

　　本章只会介绍一些常见的设计模式，并且使用的编程语言为`Java`。

# 第一节 单例模式 #
## 何为单例？ ##
　　所谓的单例(`Singleton`)设计模式，就是指一个类只允许有一个对象。如果我们的某个类不需要存在多个对象，那么就可以考虑把这个类写成单例模式的。

　　单例设计模式的实施步骤：

	1、使用private修饰构造方法。这样外界就不可以通过new关键字来创建该类的对象了，但本类中的代码仍然可以创建。
	2、在本类中建立一个静态的本类的对象。
	3、建立一个静态方法用来返回此对象的引用。

<br>　　范例1：最简单的单例模式。
``` java
public class SingleClass {
    private static SingleClass instance = new SingleClass();

    private SingleClass() {
        // 默认提供的构造方法是public的，因此在此需要自定义一个无参的构造，并将访问权限该为private的。
    }

    public static SingleClass getInstance() {
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```


<br>　　上面就是一个最简单的单例模式的写法，不过它并不是最优的写法，后面我们会继续完善它。

<br>　　当程序运行的时候，我们可以通过下面的代码来调用`SingleClass`类的`getInfo`方法：
``` java
// 不需要创建任何SingleClass类的对象，就可以在程序的任何地方调用getInfo()方法。
SingleClass.getInstance().getInfo();
```

## 单例与静态 ##
　　我们在设计程序经常会有这种需求，某个类里的方法能够全局访问。在这种情况下有两种实现方案：

	-  单例模式(Singleton)
	-  静态方法

　　但是，我们应该如何选择使用哪种方式呢？

	-  如果你的类不维持任何状态，仅仅是提供全局的访问，这个时候就适合用静态类。
	   -  最基本的例子就是在Java中的java.lang.Math类的实现方式，Math类就是用过静态方法来实现的，而不是单例来实现的。
	-  如果你的类需要维持一些状态，或者需要从线程安全、兼容性上来考虑一些问题，那么选用单例为宜。

## 单例的各种写法 ##
　　上面的范例的写法有个缺点，当`SingleClass`类被加载的时候就会立刻实例化单例对象。
　　这意味着如果单例对象里包含了很多属性，那这个对象就会占有很多内存空间，而这块空间我们一时半会可能用不到。因此可以改造一下代码，只有在我们需要使用单例对象的时候才去创建这个单例对象。

<br>　　范例1：懒汉式。
``` java
public class SingleClass {
    private static SingleClass instance;

    private SingleClass() { }

    public static SingleClass getInstance() {
        if(instance == null){
            instance = new SingleClass();
        }
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```

<br>　　不过懒汉式的写法依然存在问题，当多个线程同时访问`getInstance`方法时，会导致创建多个`SingleClass`类的对象。 

<br>　　范例2：懒汉式（线程安全）。
``` java
public class SingleClass {
    private static SingleClass instance;

    private SingleClass() { }

    public static SingleClass getInstance() {
        if(instance == null){
            // 此处加个线程同步。
            synchronized (SingleClass.class) {
                if(instance == null){
                    instance = new SingleClass();
                }
            }
        }
        return instance;
    }

    // 定义一个实例方法，以供外界调用。
    public void getInfo() {
        System.out.println("single");
    }
}
```
    语句解释：
    -  此种方式也被称为双重校验锁。
    -  也有人将synchronized关键字直接修饰在getInstance()方法上，缺点是每次调用getInstance()方法都需要进行线程同步操作。

<br>　　范例3：静态内部类。
``` java
public class SingleClass {
    private static class SingletonHolder {
        private static final SingleClass INSTANCE = new SingleClass ();
    }
    private SingleClass(){}
    public static final SingleClass  getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```
    语句解释：
    -  此种方式利用了静态内部类的特点，即实现了懒加载又不用担心多线程问题。
    -  但是由于双重校验锁更直观容易理解，因而比此种方式常见。

<br>**有两个问题需要注意：**
　　1、如果单例由不同的类装载器装入，那便有可能存在多个单例类的实例。
　　2、如果`Singleton`实现了`java.io.Serializable`接口，那么这个类的实例就可能被序列化和复原。不管怎样，如果你序列化一个单例类的对象，接下来复原多个那个对象，那你就会有多个单例类的实例。

<br>　　范例4：通过反序列化来创建多个对象。
``` java
import java.io.*;
public class Main {

    public static void main(String[] args) throws Exception {
        // 先输出两遍单例对象，结果它们输出的内存地址是一样的。
        System.out.println(SingleClass.getInstance());
        System.out.println(SingleClass.getInstance());	
		
        File file = new File("a.txt");
        // 将单例对象序列化到a.txt文件中。
        write(file);
        // 反序列化4次，程序每次输出的内存地址都是不一样的。
        System.out.println(read(file));
        System.out.println(read(file));
        System.out.println(read(file));
        System.out.println(read(file));
    }
	
    private static void write(File file) throws Exception {
        ObjectOutputStream output = new ObjectOutputStream(new FileOutputStream(file));
        output.writeObject(SingleClass.getInstance());
        output.close();
    }
	
    private static SingleClass read(File file) throws Exception{
        ObjectInputStream input = new ObjectInputStream(new FileInputStream(file));
        SingleClass inst = (SingleClass)input.readObject();
        input.close();
        return inst;
    }

}
```
    语句解释：
    -  在执行本范例之前，请先让SingleClass实现Serializable接口。

<br>　　解决方案请自行搜索，不过笔者认为，开发的时候使用“双重校验锁”方式就够用的了，单例模式的这两个缺点了解即可。

<br>**本节参考阅读：**
- [程序设计之---单例模式VS静态方法](http://blog.csdn.net/johnny901114/article/details/11969015)
- [单例模式的七种写法](http://cantellow.iteye.com/blog/838473)

# 第二节 MVC模式 #

## 问题引入 ##
　　我们现在有个任务，实现下图所示的界面：

<center>
![](/img/android/android_o05_01.png)
</center>

　　也就是说，我们要从一个`JSON`串中解析出一个列表，列表一共三行数据，每一行对应一个学生的信息。

<br>　　需求很简单，我们现在就列一下执行步骤：

	-  第一步，解析JSON串，然后将JSON串里的数据封装成一组Student对象。
	-  第二步，依次使用每个Student对象来创建表的一行。
	-  第三步，将创建出来的行添加到界面上。

<br>　　有了执行步骤后就可以动手写代码了，下面的`activity_main.xml`用来作为`Activity`的布局文件。

<br>　　范例1：`activity_main.xml`。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/rootView"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
</LinearLayout>
```
    语句解释：
    -  使用LinearLayout作为根节点，垂直方向上排列布局。

<br>　　范例2：`Student`类。
``` android
public class Student {
    private String name;
    private int age;
    private String sex;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

<br>　　范例3：`MainActivity`。
``` android
public class MainActivity extends Activity {

    String json = "[{\"name\":\"张三\",\"age\":24,\"sex\":\"boy\"},{\"name\":\"李四\",\"age\":25,\"sex\":\"girl\"},{\"name\":\"王五\",\"age\":26,\"sex\":\"boy\"}]";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 获取根控件的引用。
        LinearLayout rootView = (LinearLayout) findViewById(R.id.rootView);

        // 将json数据解析成一个Student数组
        List<Student> studentList = new ArrayList<Student>();
        try {
            JSONArray jsonArr = new JSONArray(json);
            for (int i = 0; i < jsonArr.length(); i++) {
                JSONObject jsonObject = jsonArr.getJSONObject(i);
                Student student = new Student();
                student.setName(jsonObject.getString("name"));
                student.setAge(jsonObject.getInt("age"));
                student.setSex(jsonObject.getString("sex"));
                studentList.add(student);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // 手动创建每一个学生的控件，然后将他们添加到界面中去。
        LinearLayout.LayoutParams params;
        for (Student student : studentList) {
            LinearLayout layout = new LinearLayout(this);
            layout.setOrientation(LinearLayout.HORIZONTAL);
            // 姓名
            TextView nameTV = new TextView(this);
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            nameTV.setText(student.getName());
            layout.addView(nameTV,params);
            // 年龄
            TextView ageTV = new TextView(this);
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            ageTV.setText(String.valueOf(student.getAge()));
            layout.addView(ageTV,params);
            // 性别
            TextView sexTV = new TextView(this);
            sexTV.setText(student.getSex());
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            layout.addView(sexTV,params);
            // 将它们三个控件添加到主布局中
            rootView.addView(layout, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
        }

    }
}
```

<br>　　虽然`onCreate()`方法中的代码有点多，但至少我们已经实现需求了。

　　不过如果你是一个有经验的开发人员，可能就会发现这段代码不利于重用，也就是说如果在其它界面也需要显示这个列表，我们就得把这一整段代码给`copy`过去，这是不能忍的。
　　因此，我们接下来要对这段代码进行重构。

## 代码重构 ##

### 重构Model ###
　　首先，我们从解析`JSON`这块入手。 

　　问题是这样的：如果在项目的多个地方都需要将一个`JSON`转换成`Student`对象，那我们就得把上面的解析代码（`15~27`行）`copy`多份，如果某一天服务端同事告诉我们说`Student`的某个字段名要修改，同时项目中有`11`个地方都存在这段代码，那么我们就得依次将每个地方的代码都修改一遍，有任何一个遗漏的都会导致程序出`bug`。

<br>　　第一步，修改`Student`类，代码如下：
``` android
public class Student {
    private String name;
    private int age;
    private String sex;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    // 此方法用来从一个JSONObject对象中解析出一个Student对象。
    public static Student parseJSON(JSONObject jsonObject) {
        Student student = new Student();
        try {
            student.name = jsonObject.getString("name");
            student.age = jsonObject.getInt("age");
            student.sex = jsonObject.getString("sex");
        } catch (Exception e) {
            // 如果解析失败则打印出日志，并将对象置null。
            e.printStackTrace();
            student = null;
        }
        return student;
    }
}
```
    语句解释：
    -  以后我们就可以在项目的任何地方都调用这个静态方法，就算服务端返回的字段名改变了我们也可以很方便的适配。
    -  请注意举一反三，本范例这个方法接收的是JSONObject的类型的参数，你可以通过方法重载等其它方式来达到你的需求。

<br>　　第二步，增加一个`StudentList`类。它用来表示一组`Student`对象，代码如下：
``` android
public class StudentList {
    private int maxCount;   // 用来分页。 咱们暂时不使用它。

    private List<Student> studentList;

    public List<Student> getStudentList() {
        return studentList;
    }

    public static StudentList parseJSON(String json){
        StudentList inst = new StudentList();
        try {
            inst.studentList = new ArrayList<Student>();
            JSONArray jsonArr = new JSONArray(json);
            for (int i = 0; i < jsonArr.length(); i++) {
                Student student = Student.parseJSON(jsonArr.getJSONObject(i));
                if(student != null){
                    inst.studentList.add(student);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return inst;
    }
}
```
    语句解释：
    -  在Student类中有一个maxCount属性暂时没用到，当需要分页显示学生信息时会用到它，这里之所以加它是为了向读者展示StudentList类可以扩展很多属性。


<br>　　第三步，更新`MainActivity`。
``` android
public class MainActivity extends Activity {

    String json = "[{\"name\":\"张三\",\"age\":24,\"sex\":\"boy\"},{\"name\":\"李四\",\"age\":25,\"sex\":\"girl\"},{\"name\":\"王五\",\"age\":26,\"sex\":\"boy\"}]";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LinearLayout rootView = (LinearLayout) findViewById(R.id.rootView);

        // 从json中解析出一个StudentList对象。
        StudentList sList = StudentList.parseJSON(json);

        // 手动创建每一个学生的控件，然后将他们添加到界面中去。
        LinearLayout.LayoutParams params;
        for (Student student : sList.getStudentList()) {
            LinearLayout layout = new LinearLayout(this);
            layout.setOrientation(LinearLayout.HORIZONTAL);
            // 姓名
            TextView nameTV = new TextView(this);
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            nameTV.setText(student.getName());
            layout.addView(nameTV,params);
            // 年龄
            TextView ageTV = new TextView(this);
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            ageTV.setText(String.valueOf(student.getAge()));
            layout.addView(ageTV,params);
            // 性别
            TextView sexTV = new TextView(this);
            sexTV.setText(student.getSex());
            params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.weight = 1;
            layout.addView(sexTV,params);
            // 将它们三个控件添加到主布局中
            rootView.addView(layout, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
        }

    }
}
```
    语句解释：
    -  此时MainActivity中从JSON串里解析出Student对象只需要一行代码了。
    -  代码重构目的不只是想让原来需要3行完成的功能改成1行，更主要的是要让代码的结构变得更加合理，方便扩展、重用。
       -  因此虽然现在MainActivity中的代码只有1行，但是在Student等其他地方的代码却多了，不过这没关系，因为代码的可扩展和可重用性变强了。

### 重构View ###
　　接下来，我们重构一下`View`这块。

　　从`MainActivity`中我们可以看到，有一个`for`循环依次为每行创建一个`LinearLayout`对象，而`LinearLayout`中又包含`姓名`、`年龄`、`性别`三个子控件，这些控件都是通过代码来创建的，这也不利于代码的重用。
　　我们可以把这个`LinearLayout`给放到`xml`文件中，这样在项目的其它地方就可以直接通过导入`xml`来使用这三个子控件了。

<br>　　第一步，创建`inflate_student_item.xml`。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal">

    <TextView
        android:id="@+id/nameTV"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1" />

    <TextView
        android:id="@+id/ageTV"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1" />

    <TextView
        android:id="@+id/sexTV"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1" />
</LinearLayout>
```
    语句解释：
    -  Android程序的设计讲究逻辑和视图分离，因而我们应该尽可能的将控件放到xml文件中来写。

<br>　　第二步，更新`MainActivity`。
``` java
public class MainActivity extends Activity {

    String json = "[{\"name\":\"张三\",\"age\":24,\"sex\":\"boy\"},{\"name\":\"李四\",\"age\":25,\"sex\":\"girl\"},{\"name\":\"王五\",\"age\":26,\"sex\":\"boy\"}]";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LinearLayout rootView = (LinearLayout) findViewById(R.id.rootView);

        // 从json中解析出一个StudentList对象。
        StudentList sList = StudentList.parseJSON(json);

        // 手动创建每一个学生的控件，然后将他们添加到界面中去。
        for (Student student : sList.getStudentList()) {
            LinearLayout layout = (LinearLayout) LayoutInflater.from(this).inflate(R.layout.inflate_student_item, null);

            // 姓名
            TextView nameTV = (TextView) layout.findViewById(R.id.nameTV);
            nameTV.setText(student.getName());
            // 年龄
            TextView ageTV = (TextView) layout.findViewById(R.id.ageTV);
            ageTV.setText(String.valueOf(student.getAge()));
            // 性别
            TextView sexTV = (TextView) layout.findViewById(R.id.sexTV);
            sexTV.setText(student.getSex());
            // 将布局添加到主布局中
            rootView.addView(layout, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
        }

    }
}
```
    语句解释：
    -  此时MainActivity中的代码就进一步减少了，不过事情还没完，还可以再进一步优化。

<br>　　虽然我们把控件移动到`xml`中了，但是当其它界面也需要显示这个列表时，我们还是需要将上面的`for`循环中的代码给`copy`过去，还是会有不少的重复代码。 
　　解决的方法就是：进一步把这个列表给封装成一个控件。

<br>　　第三步，添加`MyStudentListView`类。
``` android
public class MyStudentListView extends LinearLayout {

    private StudentList list;

    public MyStudentListView(Context context, StudentList list) {
        super(context);
        // 垂直方式排列子元素
        setOrientation(VERTICAL);

        for (Student student : list.getStudentList()) {
            LinearLayout layout = (LinearLayout) LayoutInflater.from(context).inflate(R.layout.inflate_student_item, null);
            // 姓名
            TextView nameTV = (TextView) layout.findViewById(R.id.nameTV);
            nameTV.setText(student.getName());
            // 年龄
            TextView ageTV = (TextView) layout.findViewById(R.id.ageTV);
            ageTV.setText(String.valueOf(student.getAge()));
            // 性别
            TextView sexTV = (TextView) layout.findViewById(R.id.sexTV);
            sexTV.setText(student.getSex());
            // 将它们三个控件添加到主布局中
            addView(layout, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT));
        }
    }
}
```
    语句解释：
    -  我们把这个Student列表封装成一个View类，这样一来项目的其它地方如果也需要使用这个控件，只需要传递过来一个StudentList对象就可以了。

<br>　　第四步，更新`MainActivity`类。
``` java
public class MainActivity extends Activity {

    String json = "[{\"name\":\"张三\",\"age\":24,\"sex\":\"boy\"},{\"name\":\"李四\",\"age\":28,\"sex\":\"girl\"},{\"name\":\"王五\",\"age\":26,\"sex\":\"boy\"}]";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        LinearLayout rootView = (LinearLayout) findViewById(R.id.rootView);

        // 从json中解析出一个StudentList对象。
        StudentList sList = StudentList.parseJSON(json);

        // 手动创建每一个学生的控件，然后将他们添加到界面中去。
        rootView.addView(new MyStudentListView(this, sList));
    }
}
```
    语句解释：
    -  此时MainActivity的代码就少很多了，也清晰很多。

<br>　　其实我们现在的代码结构就已经遵循了`MVC`设计模式的规范了，接下来我们就开始具体介绍一下`MVC`模式。

### 模式介绍 ###
　　`MVC`全名是`Model View Controller`，百度百科上说它不应该称为`设计模式`，而应该称为`框架`，在此我们就不关心到底该称它是什么，只研究它的实现方法。

<br>　　`MVC`把代码分为`3`个核心的模块：模型(`model`)、视图(`view`)、控制器(`controller`)，这三个模块分别担当不同的任务。

	-  Model它负责与领域相关的逻辑处理代码，也可以说是逻辑层，或者领域层。
	-  View只负责界面显示。
	-  Controller负责把View和Model联系起来，它的主要职责就是处理用户输入。

<br>　　下图表示它们三者之间的依赖关系：

<center>
![MVC关系图](/img/android/android_o05_02.png)
</center>

<br>　　它们的运作流程：

	-  通常Controller会是一个Activity，我们会在Controller里面来实例化Model和View，并持有它们的引用（上图中实线表示强引用）。
	   -  前面写的MainActivity类就属于Controller。
	-  View负责界面显示，它所显示的数据是从Model中获取到的，当View里面产生事件时，可以调用Controller进行处理。
	   -  前面写的MyStudentListView类就属于View。
	-  Model负责管理数据，当Model的数据有改变，会通知View更新界面。
	   -  具体的来说，Model里维护了一个观察者列表，在View被初始化的同时，View将自己注册为Model的观察者，当Model的某个字段更新的时候，Model会通知所有侦听了该事件的View。
	   -  上面写的Student、StudentList类都属于Model，只不过咱们并没有让它们维护一个观察者列表。

<br>**不是所有代码都需要使用MVC**
　　当我们需要在界面上来显示一个`Model`（比如`Student`）的完整信息时，最好是封装出一个`View`来专门负责显示，这样以利于代码重用和扩展。
　　但在实际开发中，很多界面只是一个表单界面，它只包含简单的按钮、文本框，不需要在其它地方重用，我们没必要将它们封装成一个`View`，此时整个代码的结构只包含`M`和`C`没有`V`，也不需要有`V`。


<br>**使用ListView搞定一切**
　　本范例主旨是为了讲解代码的分层思路，实际开发中我们完全可以使用`ListView`来实现这个功能。
　　`ListView`比我们上面的代码抽象的更合理，它将它所要显示的数据以及每个数据的绘制工作都交给了一个`Adapter`对象，而我们则是默认的将每个数据的绘制工作写死在`MyStudentListView`的构造方法里了。

<br>**本节参考阅读：**
- [百度百科 - MVC框架](http://baike.baidu.com/view/5432454.htm?fromtitle=MVC%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&fromid=8160955&type=syn)


<br><br>
