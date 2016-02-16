title: 架构篇　第一章 通用项目架构
date: 2015-6-29 17:15:30
categories: android
---
　　我们都知道要写一款精品软件是有难度且很复杂的：不仅要满足特定要求，而且软件还必须具有稳健性，可维护、可测试性强，并且能够灵活适应各种发展与变化。
　　因此，我们需要掌握一些常见的架构知识，以便能编写出结构合理的项目。

　　本章将介绍如下两个内容：

	-  包结构的划分
	-  类结构的划分

# 第一节 包结构的划分 #
　　当我们在`IDE`中创建了一个全新的`Android`项目后，相信不少人接下来要做的就是，把老项目的代码`copy`过来、添加各种开源库等，避免重复造轮子。
　　这么做没有任何问题，但是笔者认为不应该把它排在第一步，第一步要做的是划分包结构。

　　假设我们的包名为`com.cutler.demo`，那么笔者使用下面的包结构：
``` c
com.cutler.demo
  -  common         // 存放当前项目中公用类。
     -  若干子包
     -  Congif.java          // 保存整个项目中所有的全局“常量”。
     -  SystemParams.java    // 保存整个项目中所有的全局“变量”，以及与那些变量相关的操作方法。
  -  model          // 存放当前项目model类。
  -  ui             // 存放当前项目的UI界面相关的类。
  -  util           // 存放与当前项目无关的工具类，即这些类可以轻松的拿到其他项目中直接使用。
  -  MainApplication.java
```

## common ##
<br>　　`com.cutler.demo.common`包用来存放与当前项目有关的公用类，它下面可以根据不同的模块划分出不同的子包。比如：

	-  common.receiver：存放广播接收者。
	-  common.view：存放自定义view。
	-  common.util：存放项目内部使用的工具类，即与当前项目的代码紧密耦合。

<br>　　`Congif.java`用来存放当前项目中的`全局常量`（它没有任何方法），它内部的代码通常是这样的：
``` android
public class Config {
    // 配置文件的名称。
    public static final String KEY_SHARE_PRE_FILE_NAME = "share_prefile";

    // 本机的经纬度。
    public static final String KEY_LONGITUDE = "longitude";
    public static final String KEY_LATITUDE = "latitude";

    // 媒体下载相关 
    public static final int DISK_CACHE_INDEX = 0;
    public static final int DISK_CACHE_SIZE = 50 * 1024 * 1024;
    public static final int IO_BUFFER_SIZE = 8 * 1024;
    public static final int HTTP_DOWNLOAD_THREAD_POOL_SIZE = 3;

    // 本地的缓存目录
    public static final String CACHE_MEDIA = "media";
    public static final String CACHE_DOWNLOAD = "download";
}
```

<br>　　`SystemParams.java`用来存放整个项目中所有的`全局变量`，以及与那些变量相关的操作方法，通常它是单例模式的。同时，你可以在全局变量的值被修改时，执行持久化操作。
　　既然`SystemParams`通常是单例的，那么我们接下来就正式的介绍一下单例模式（后续章节会陆续插入其它设计模式）。

<br>　　扩展阅读：

	-  设计模式，有非常多的定义，有人会举出Gang of Four那本《Design Patterns》来解释，而笔者认为：
	   -  设计模式是软件开发领域中针对特定上下文的特定问题的解决方案。
	   -  《Design Patterns》中举出了23种设计模式，它们分别用于不同的场景，当我们处在这23种场景下时，按照对应的设计模式所规定的思路去编程，可以写出结构合理、扩展性很强的代码。
<br>
### 何为单例？ ###
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
<br>
### 单例与静态 ###
　　我们在设计程序经常会有这种需求，某个类里的方法能够全局访问。在这种情况下有两种实现方案：

	-  单例模式(Singleton)
	-  静态方法

　　但是，我们应该如何选择使用哪种方式呢？

	-  如果你的类不维持任何状态，仅仅是提供全局的访问，这个时候就适合用静态类。
	   -  最基本的例子就是在Java中的java.lang.Math类的实现方式，Math类就是用过静态方法来实现的，而不是单例来实现的。
	-  如果你的类需要维持一些状态，或者需要从线程安全、兼容性上来考虑一些问题，那么选用单例为宜。
	   -  比如我们上面说的SystemParams类，它需要保存一些变量的值。
<br>
### 单例的各种写法 ###
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

<br>　　解决方案请自行搜索，不过笔者认为，开发的时候使用`“双重校验锁”`方式就够用的了，单例模式的这两个缺点了解即可。
　　另外，如果你担心别人通过反射的方式来调用你的私有构造器，那么可以在里面加上检测，一旦存在了单例对象，则直接抛出异常。

<br>**参考阅读：**
- [程序设计之---单例模式VS静态方法](http://blog.csdn.net/johnny901114/article/details/11969015)
- [单例模式的七种写法](http://cantellow.iteye.com/blog/838473)

## model ##
　　`com.cutler.demo.model`包用来存放`model`类，它下面可以根据不同的模块划分出不同的子包。比如：

	-  common.user：存放用户相关的类，如：User、Photo（照片）、UserDAO等。
	   -  其中UserDAO用来处理User对象的数据库相关的操作。
	-  common.message：存放消息相关的类，如：Message、Topic（会话）等。

## ui ##
　　`com.cutler.demo.ui`包用来存放界面相关（`Activity`、`Fragment`、`Adapter`等）的类，它下面可以根据不同的模块划分出不同的子包。比如：

	-  ui.welcome：存放登录相关的类，如：LoginActivity、RegisterActivity等。
	-  ui.message：存放消息相关的类，如：MessageActivity等。

## util ##
　　`com.cutler.demo.util`包用来存放与当前项目无关的工具类，即这些类可以轻松的拿到其他项目中直接使用。它下面可以根据不同的模块划分出不同的子包。比如：

	-  util.http：存放网络请求相关的类。
	-  util.log：存放日志相关的类。

## 整体的分包思路 ##
　　如果项目是这样的一个由行和列组成的表结构： 
``` c
                      model      ui      common      util 
   消息模块             xx        xx        xx         xx 
   用户模块             xx        xx        xx         xx 
   好友模块             xx        xx        xx         xx 
   商城模块             xx        xx        xx         xx 
```
　　那么笔者划分包的思路是： 先纵向划分出`model`、`ui`、`common`、`util`四个顶层包，然后在每个顶层包下面再横向的依据模块来划分子包。


# 第二节 类结构的划分 #
## 问题引入 ##
　　我们现在有个任务，从一个`JSON`串中解析出一个列表，列表一共三行数据，每一行对应一个学生的信息，并实现下图所示的界面：

<center>
![](/img/android/android_o05_01.png)
</center>

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
    -  因此虽然现在MainActivity中的代码只有1行，但是在Student等其他地方的代码却多了，不过这没关系，因为代码的可扩展性、可读性以及可重用性变强了。

### 重构View ###
　　接下来，我们重构一下`View`这块。

　　从`MainActivity`中我们可以看到，有一个`for`循环依次为每行创建一个`LinearLayout`对象，而`LinearLayout`中又包含`姓名`、`年龄`、`性别`三个子控件，这些控件都是通过代码来创建的，这也不利于代码的重用。
　　我们可以把这个`LinearLayout`给放到`xml`文件中，这样在项目的其它地方就可以直接通过导入`xml`来使用这三个子控件了。

<br>　　第一步，创建`inflate_student_item.xml`。
``` xml
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

## 模式介绍 ##
　　至此我们就完成了代码重构，整个代码结构变的十分简洁，唯一的遗憾可能就是多出了好几个类。不过从经验上来看，一个上千行代码的`Activity`是很难维护的，因此如果一定要选择的话，我们更能接受多添加几个类。

<br>　　开发时我们会将软件划分成多个功能模块，并遵循`“高内聚低耦合”`的原则：

	-  高内聚就是一个模块内各个元素彼此结合的紧密程度高，即一个软件模块是由相关性很强的代码组成，只负责一项任务，也就是常说的单一责任原则。
	-  对于低耦合，粗浅的理解是：一个完整的系统，模块与模块之间，尽可能的使其独立存在。也就是说，让每个模块，尽可能的独立完成某个特定的子功能。模块与模块之间的接口，尽量的少而简单。如果某两个模块间的关系比较复杂的话，最好首先考虑进一步的模块划分。

　　划分模块的好处就是，当某个模块出现问题时，我只需要修改、调试该模块即可，而不用牵扯到其他模块。 
　　若把所有代码都写在一个类里，则一旦出了问题，排查的难度就会很大，而且修改时还很容易导致其他问题（因为代码多、乱，容易扰乱程序员的思路）。

<br>　　其实我们现在的代码结构就已经遵循了`MVC`设计模式的规范了，接下来我们就开始具体介绍一下`MVC`模式。
　　在此之前，我们来回答了一个终极问题：
　　问：`“为什么要用MVC？”`
　　答：因为`MVC`是一个遵循了`“高内聚低耦合”`原则的模式，它提出了代码分层的思想，十分符合主流开发思路、社会主义核心价值观，因而我们使用它。

<br>**使用ListView、RecyclerView搞定一切**
　　本范例主旨是为了讲解代码的分层思路，实际开发中我们完全可以使用`ListView`来实现这个功能。
　　`ListView`比我们上面的代码抽象的更合理，它将它所要显示的数据以及每个数据的绘制工作都交给了一个`Adapter`对象，而我们则是默认的将每个数据的绘制工作写死在`MyStudentListView`的构造方法里了。

<br>**本节参考阅读：**
- [百度百科 - 高内聚低耦合](http://baike.baidu.com/view/3082578.htm)

## MVC ##
　　`MVC`全名是`Model View Controller`，百度百科上说它不应该称为`设计模式`，而应该称为`框架`，在此我们就不关心到底该称它是什么，只研究它的实现方法。

<br>　　`MVC`把代码分为`3`个核心的模块：模型(`model`)、视图(`view`)、控制器(`controller`)，这三个模块分别担当不同的任务。

	-  Model它负责与领域相关的逻辑处理代码，也可以说是逻辑层，或者领域层。
	-  View只负责界面显示。
	-  Controller负责把View和Model联系起来，它的主要职责就是处理用户输入。

<br>　　下图表示它们三者之间的依赖关系：

<center>
![MVC关系图](/img/android/android_o05_02.png)
</center>

<br>　　图释：

	-  通常Controller会是一个Activity，我们会在Controller里面来实例化Model和View，并持有它们的引用（上图中实线表示强引用）。
	   -  前面写的MainActivity类就属于Controller。
	-  View负责界面显示，它所显示的数据是从Model中获取到的，当用户操作View触发事件时，View会调用Controller进行处理。
	   -  前面写的MyStudentListView类、xml布局文件都属于View。
	-  Model负责管理数据，当Model的数据有改变，会通知View更新界面。
	   -  具体的来说，Model里维护了一个观察者列表，在View被初始化的同时，View将自己注册为Model的观察者，当Model的某个字段更新的时候，Model会通知所有侦听了该事件的View。
	   -  上面写的Student、StudentList类都属于Model，只不过咱们并没有让它们维护一个观察者列表。

<br>　　`MVC`的其中一个缺点便是没有明确的定义，所以不同的实现（比如`Struts`和`http://ASP.NET MVC`）细节上都是不一样的。


<br>**本节参考阅读：**
- [百度百科 - MVC框架](http://baike.baidu.com/view/5432454.htm?fromtitle=MVC%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&fromid=8160955&type=syn)

## MVP ##
　　咱们错开晦涩难懂的理论，直接通过实例来介绍`MVP`（`Model View Presenter`）模式，关于此模式，笔者认为了解即可。

<br>**问题是这样的：**
　　前面已经说了`Activity`是`Controller`，`布局文件`和`自定义View`则对应`View`。
　　但是仔细想想`View`其实能做的事情特别少，实际上关于布局文件中的数据绑定的操作，事件处理的代码都在`Activity`中，造成了`Activity`既像`View`又像`Controller`。
　　`Activity`既要去完成`Controller`的职责，又要去完成`View`的部分职责，这违反了咱们所提倡的`单一责任`原则。
　　因此，我们索性把`Activity`视为`View`的一部分，让它专注于`View`相关的职责，而把它的`Controller`职责放到另一个类中去。

<br>**登录界面**
　　我们要实现一个登录界面，界面中有用户名和密码两个文本框和一个登录按钮。
　　按照现在的思路，`Activity`将只负责界面显示、事件处理，用户名密码的校验和登录等操作都应该放到另一个类中，我们叫它`LoginPresenter`。

<br>　　范例1：`LoginPresenter`。
``` java
public class LoginPresenter {

    private LoginView mView;

    public LoginPresenter(LoginView view){
        mView = view;
    }

    public void doLogin(){
        // 获取用户名和密码。
        String username = mView.getUsername();
        String password = mView.getPassword();

        // 校验用户名和密码的格式。
        if(TextUtils.isEmpty(username) || TextUtils.isEmpty(password)){
            mView.showErrorMessage("请输入用户名和密码！");
            return;
        }

        // 此处应该发送网络请求，为了简便直接本地判断了。
        if("1".equals(username) && "1".equals(password)){
            // 此处应该依据服务端返回的json来构造一个User对象，为了简便直接本地构造了。
            User user = new User();
            user.setId(1);
            user.setNickname("Tom");
            // 通知View登录成功。
            mView.onLoginComplete(user);
        } else {
            mView.showErrorMessage("用户名或密码错误！");
        }
    }

    // 此接口中定义了View必须要提供的几个方法，将由LoginActivity实现此接口。
    public static interface LoginView {
        public String getUsername();

        public String getPassword();

        public void showErrorMessage(String error);

        public void onLoginComplete(User user);
    }
}
```

<br>　　范例2：`LoginActivity`。
``` java
public class LoginActivity extends Activity implements LoginPresenter.LoginView {

    private EditText usernameEt;
    private EditText passwordEt;
    private LoginPresenter mPresenter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 把Activity的引用传过去的话，就得注意是否存在内存泄露的问题，最好是在onDestroy方法里置空引用。
        mPresenter = new LoginPresenter(this);
        usernameEt = (EditText) findViewById(R.id.username);
        passwordEt = (EditText) findViewById(R.id.password);
        findViewById(R.id.loginBtn).setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // 登录按钮被点击时，调用LoginPresenter类去处理。
                mPresenter.doLogin();
            }
        });
    }

    @Override
    public String getUsername() {
        return usernameEt.getText().toString();
    }

    @Override
    public String getPassword() {
        return passwordEt.getText().toString();
    }

    @Override
    public void showErrorMessage(String error) {
        Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onLoginComplete(User user) {
        // 在这个方法中，可以启动一个新的Activity。
        Toast.makeText(this, "登录成功"+user.getNickname(), Toast.LENGTH_SHORT).show();
    }
}
```

<br>　　各位应该能发现了，在`MVP`模式的`P`（`LoginPresenter`）所做的工作和`MVC`中的`C`是一样的。
　　在上面的代码中，我们实现了`Controller`与`View`之间的解耦，并通过一个接口（`LoginView`）来限制`LoginActivity `必须要提供的方法，`LoginActivity `不会执行任何逻辑操作，它仅处理事件和`UI`相关的操作。

<br>**提示：**
　　许多时候并不是一种模式不好，而是因为人没办法执行，比如不容易理解，我们就会选择容易理解的方式。
　　因此笔者认为，在`MVP`中虽然代码看起来清晰了很多，但是写起来却很麻烦（已有不少人吐槽），所以不需要所有的界面都按照`MVP`模式这种风格来编写，灵活应变即可。

<br>**本节参考阅读：**
- [浅谈 MVP in Android](http://blog.csdn.net/lmj623565791/article/details/46596109)
- [你对MVC、MVP、MVVM 三种组合模式分别有什么样的理解？](http://www.zhihu.com/question/20148405)

## MVVM ##
　　`MVVM`是`Model-View-ViewModel`的简写。
　　`MV-X`本质都是一样的，重点还是在于`MV`的桥梁要靠`X`来牵线，`X`的不同对应着`M`与`V`的数据传递的流程不同。

<center>
![MVVM关系图](/img/android/android_e01_01.png)
</center>

　　`MVVM`模式使用的是`数据绑定`基础架构，即数据绑定是将一个用户界面元素（控件）的属性绑定到一个类型（对象）实例上的某个属性的方法。
　　例如，如果你有一个`User`对象，那么就可以把`User`的`“name”`属性绑定到一个`TextView`的`“text”`属性上，随后对`TextView`的`text`属性的更改将“传播”到`User`的`name`属性，而对`User`的`name`属性的更改同样会“传播”到`TextView`的`text`属性。

<br>　　`MVVM`早已被广泛应用了，现在`Google`为我们封装好了一个开源库，方便我们在`Android`中使用`MVVM`模式，[官方教程](https://developer.android.com/tools/data-binding/guide.html)。

　　笔者推荐阅读[《Android中的Data Binding初探 (一)》](http://aswifter.com/2015/07/04/android-data-binding-1/)和[《AndroidDataBinding-MVVM模式》](http://www.jianshu.com/p/92f0efd695e7)。

<br>**本节参考阅读：**
- [百度百科 - MVVM](http://baike.baidu.com/view/3507915.htm)
- [百度百科 - 数据绑定](http://baike.baidu.com/view/159779.htm)


<br><br>
