title: 入门篇　第五章 数据存取
date: 2015-3-5 16:19:10
categories: android
---
　　Android设备中，存在着各种各样的文件（如`数据库文件`、`偏好配置文件`等），它们被保存在`手机内部存储`或`外部存储设备`（如SD卡）中。
　　通过`Eclipse`或`AndroidStudio`我们可以查看手机的文件系统的结构，打开`DDMS`视图找到`FileExplorer`（文件浏览器），我们可能会看到很多文件夹，其中`system`、`data`、`mnt`三个文件夹比较重要。

	-  system：用于保存系统文件。
	-  data ： 用于保存与应用程序有关的数据。
	-  mnt ：是一个影射目录，一些手机的外设(如sd卡)的存储数据的文件夹，都在其内部出现。

　　即`system`和`data`目录是放在`手机内部存储`里的，而sd卡等`外部存储设备`的根目录会出现在`mnt`目录下。
<br>　　本章将详细介绍`Android`中数据存取相关的知识。

# 第一节 数据存储 #
　　应用程序在运行的时候会产生各种数据文件，它们通常被保存在`/data/data/packagename/`目录下面，每种类型的文件占据一个子目录：

	-  普通文件：用于保存常见的文本、图片信息。如：txt、jpg等文件。
	   -  被保存在/data/data/packagename/files目录。
	-  配置文件：用于保存用户的个性化设置，配置文件是xml类型的。
	   -  被保存在/data/data/packagename/shared_prefs目录。
	-  数据库文件：用于保存结构化的数据。如：.db文件。
	   -  被保存在/data/data/packagename/databases目录。
	-  缓存文件：用于保存临时文件。当手机存储容量不足时，系统会删除一部分缓存文件。
	   -  被保存在/data/data/packagename/cache目录。

<br>　　下面就来介绍一下各种文件的读写方法。

## 普通文件 ##
　　在读写文件之前，我们需要先获取该文件的输入输出流，`Context`类就为我们提供了这样的方法。

<br>　　范例1：Context类。
```
// 指定文件名称，从/data/data/packagename/files目录下获取该文件的输入流，若文件不存在则抛异常。
public abstract FileInputStream openFileInput(String name) 

// 指定文件名称，从/data/data/packagename/files目录下获取该文件的输出流，若文件不存在则创建一个空文件。
// 参数mode：指定文件的打开方式，取值有四种，后面将进行具体介绍：
// -  Context.MODE_PRIVATE
// -  Context.MODE_APPEND
// -  Context.MODE_WORLD_READABLE
// -  Context.MODE_WORLD_WRITEABLE 
public abstract FileOutputStream openFileOutput(String name, int mode)

// 返回当前应用程序的/data/data/packagename/cache目录。
public abstract File getCacheDir()

// 返回当前应用程序的/data/data/packagename/files目录。如：/data/data/org.cxy.file/files。
public abstract File getFilesDir()
```

<br>　　范例2：文件打开方式。
```
打开方式                     当前应用程序对文件的权限              其他应用程序对文件的权限
MODE_PRIVATE                读/写                                无
MODE_APPEND                 读/写 写的时候采用追加方式             无
MODE_WORLD_READABLE         读/写                                只读
MODE_WORLD_WRITEABLE        读/写                                只写，不会追加。
```
　　提示：若想让其他程序对当前应用程序的文件既可以写，又可以读，则可以这么做：
``` android
Context.MODE_WORLD_READABLE + Context.MODE_WORLD_WRITEABLE
```
　　也就是说其他程序可以通过指定某个文件的绝对路径（`/data/data/...`），来访问某个应用程序的文件，具体如何访问，后面会有详细描述。

<br>　　范例3：创建文件。
``` android
public class MyActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        try {
            OutputStream out = openFileOutput("a.txt",Context.MODE_PRIVATE);
            out.write("Android 程序员".getBytes());
            out.close();
        } catch(Exception e) {}
    }
}
```
    语句解释：
    -  String类的getBytes方法将字符串转为byte[]时，会根据当前系统默认编码进行转换。
       -  Android手机系统默认的编码为UTF-8 。
       -  中文PC机的操作系统，系统的默认编码通常为GB2312和GBK。
	-  由于使用的是输出流，所以若文件不存在，则会自动创建。
	-  本范例中，a.txt会默认被创建在/data/data/packagename/files文件夹下。
	-  应用程序只能向自己的“数据目录或数据目录的子目录”中写文件，不可以向其他应用程序的数据目录中写数据。
	   -  数据目录就是：/data/data/packagename/。

<br>　　范例4：读入文件。
``` android
public class ViewTextActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        try {
            // 前往/data/data/packagename/files目录中查找a.txt
            InputStream input = this.openFileInput("a.txt");
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            int len;
            byte[] array = new byte[1024];
            while((len = input.read(array)) != -1){
                bos.write(array,0,len);
            }
            input.close();
            Toast.makeText(this, new String(bos.toByteArray()), 0).show();
            bos.close();
        } catch(Exception e) {}
    }
}
```
    语句解释：
    -  使用new String(byte[] data)创建字符串时，同样会调用系统的默认编码，将byte[]转换成一个String对象。

<br>　　范例5：Linux下文件操作权限。
```
在Linux中文件的操作权限由10位字符组成，如：-rw-rw-rw- 。
-  第一位字符表示文件的类型：
   -  若是一个文件，则使用‘-’表示。若是一个目录，则使用‘d’表示。
-  第2~4个字符表示文件所有者对文件的权限。
   -  r表示可读，w表示可写，x表示可执行。
-  第5~7个字符表示与文件所有者处于同一个用户组的其他用户，对该文件的访问权限。
   -  r表示可读，w表示可写，x表示可执行。
-  第8~10个字符表示，其他用户对文件的访问权限。
   -  r表示可读，w表示可写，x表示可执行。
```

<br>**扩展：**
　　`Android`有一套自己的安全模型，在`.apk`被安装时系统就会分配给该应用程序一个`userid`。当它要去访问某个资源(比如文件)的时候，就需要与文件的`userid`匹配。默认情况下，任何应用创建的文件、`sharedpreferences`、数据库都应该是私有的，其他程序无法直接访问。
　　除非在创建时指定了`MODE_WORLD_READABLE`和`MODE_WORLD_WRITEABLE`，只有这样其他程序才能正确访问。

## 存储卡文件 ##
　　一般来说，手机本身的存储容量是很小的，但是手机中往往都会存储一些容量较大的音乐、视频等文件，此时可以单独购买一个SD卡。 
　　所有兼容`Android`的设备都支持一个可共享的`“外部存储(external storage)”`，可用来保存文件。值得注意的是：

	-  不同的手机情况会有所不同：
	   -  有的手机提供了一个卡槽，你可以自己购买一个SD卡插进去。
	   -  有的手机直接就集成了一个SD卡在手机里，你没法把它拆下来，比如小米手机。
	-  但是不论是哪种，它们都算是外部存储。
　　注意：保存在外部存储的文件，没有强制的安全措施。所有的应用都可以读/写这些文件，用户也能够删除它们，因此重要的文件请不要保存在外部存储设备上。

<br>　　相应的，`Android`也为我们提供了操作外部存储设备上的文件的`API`。

<br>　　范例1：Environment类。
``` android
// 获取当前系统，外部存储器的根目录。
public static File getExternalStorageDirectory()

// 获取当前系统，data目录。
public static File getDataDirectory()

// 获取当前系统，system目录。
public static File getRootDirectory()

// 获取当前系统存储卡的状态。在Environment类中定义了如下几个String类型的状态：
// -  MEDIA_MOUNTED ：已经安装到手机中，并可以对其进行读写操作。
// -  MEDIA_MOUNTED_READ_ONLY ：已经安装到手机中，只可以对其进行读操作。
// -  MEDIA_UNMOUNTABLE ：存储卡在手机中，但是没有装载到操作系统上。
// -  MEDIA_REMOVED ：存储卡不在手机中。
public static String getExternalStorageState()
```

<br>　　范例2：向SDCard写文件。
``` android
// 若sdcard已经装载到手机中。
if(Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)){  
    File file = new File(Environment.getExternalStorageDirectory(),"a.txt");
    OutputStream out = new FileOutputStream(file);
    out.write("Android开发!".getBytes("UTF-8"));   
    out.close();
}
```
    语句解释：
    -  向存储卡写数据之前应该先判断一下，用户手机是否成功安装了存储卡。
    -  文件会自动被写到SDCard的根目录下面。

　　应用程序向存储卡写数据是需要权限的，因此需要在清单文件的根节点下面声明，如下权限：

``` xml
<!-- 往SDCard写入数据权限 -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

<br>　　范例3：在SD卡上创建目录。
``` android
File file = new File(Environment.getExternalStorageDirectory(),"lib/file/about.txt");
file.getParentFile().mkdirs();
FileOutputStream out = new FileOutputStream(file);
String content = "Hi 汤姆!";
out.write(content.getBytes());
out.close();
```

<br>　　范例4：从SD卡读文件。
``` android
if(Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)){
    File file = new File(Environment.getExternalStorageDirectory(),"a.txt");
    InputStream input = new FileInputStream(file);
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    int len ;
    byte[] array = new byte[1024];
    while( (len = input.read(array)) != -1){
        bos.write(array,0,len);
    }
    input.close();
    System.out.println(new String(bos.toByteArray(),"UTF-8"));
    bos.close();
}
```
    语句解释：
    -  用户应用程序从存储卡中读取数据，是不需要权限的。

<br>**在媒体扫描器下隐藏你的文件**
　　在你的外部文件目录中放置一个空的文件，命名为`.nomedia`，这会阻止Android的媒体扫描器读取你的媒体文件，如`Gallery`或者`Music`这样的应用。

## 偏好设置 ##
　　在`Android`中可以使用`SharedPreferences`类管理软件的偏好(`hào`)设置。所谓的偏好设置就是指用户对软件进行的一些个性化配置。如：软件使用的主题、皮肤等设置。
　　`SharedPreferences`类提供了一个通用的框架，可以保存和检索以持久化的键值对形式存储的原始数据类型。 你可以使用`SharedPreferences`保存任意类型的原始数据：布尔（`boolean`），浮点（`float`），整型（`int`），长整型（`long`）和字符串（`string`）。

　　`Andriod`偏好设置默认使用`xml`文件来保存用户数据，文件存储在`“/data/data/packagename/shared_prefs”`。

<br>　　范例1：`SharedPreferences`接口。
``` android
// 指定key从当前SharePreferences对象中，获取所对应的一个values 。
// -  若当前对象中没有指定的key，则返回defValue 。
// -  若当前对象中存在指定的key，但是value的值不是String类型的，则抛异常。
// -  除了此方法外，还有：getInt、getLong、getBoolean、getFloat四个方法，它们同样要求value的值与方法返回值的类型相同，否则就抛ClassCast Exception，并且终止程序执行。
public abstract String getString(String key, String defValue);

// 获取当前对象的SharedPreferences.Editor对象，该对象代表SharedPreferences对象的编辑器，可以向SharedPreferences文件中添加数据。
public abstract SharedPreferences.Editor edit();

// 返回当前对象中的所有的key-value。
public abstract Map<String, ?> getAll();

// 返回当前对象中是否包含指定的key。
public abstract boolean contains(String key);
```

<br>　　范例2：`SharedPreferences.Editor`接口。
``` android
// 向Editor对象中，添加一个Boolean类型的属性 。
// -  除了此方法外，还有：putInt、putLong、putString、putFloat四个方法。
// -  在Editor对象中key是唯一的，若重复添加多个相同的key，则会新值覆盖旧值。
public abstract SharedPreferences.Editor putBoolean(String key, boolean value);

// 你懂的。
public abstract SharedPreferences.Editor clear ();
public abstract SharedPreferences.Editor remove (String key);

// 将当前Editor对象中的数据，从手机内存持久化到SharedPreferences文件中。
public abstract boolean commit();
```

<br>　　范例3：Activity类。
``` android
// 指定文件名称name ，系统会默认从<当前应用>/shared_prefs文件夹下，查找xml文件。
// -  mode：指定文件的打开方式。
// -  若未找到指定的文件，则创建该文件并返回该文件的SharedPreferences对象。
public abstract SharedPreferences getSharedPreferences (String name, int mode)
```

<br>　　范例4：创建文件。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.main); 
        // 获取指定的xml文件，不用指定文件扩展名。
        SharedPreferences shared = this.getSharedPreferences("shp", Context.MODE_PRIVATE);
        // 调用edit()，取得一个SharedPreferences.Editor。
        Editor e = shared.edit();
        // 往SharedPreferences对象里添加值。
        e.putString("name", "jay_Cui");
        // 提交新值，更新本地文件。
        e.commit();
    }
}
```
    语句解释：
    -  使用commit方法将SharedPreferences对象持久化向xml文件中。注意：不论您是否为文件指定了后缀名，系统都会自动在文件名后面加上.xml。

<br>　　范例5：读取文件。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.main); // 在程序中直接添加控件。
        // 获取指定的xml文件,不用指定文件扩展名。
        SharedPreferences shared = this.getSharedPreferences("shp",Context.MODE_PRIVATE);
        System.out.println(shared.getString("name", "not find!"));
    }
}
```

## 数据库编程 ##
　　数据库编程：

	-  首先，在Android手机中使用的数据库是SQLite，使用android.database.sqlite.SQLiteDatabase类来操作数据库。
	-  然后，在操作数据库之前，需要先创建一个数据库。

<br>
### 创建数据库 ###
　　在`Android`中使用`SQLiteOpenHelper`类来创建/打开数据库。

<br>　　范例1：SQLiteOpenHelper类。
``` android
// context ：上下文对象。
// name ：数据库的名称。
// factory：游标工厂，若为null，则使用Android系统默认的游标工厂。通常都为null 。
// version ：数据库的版本号，具体作用后述。
public SQLiteOpenHelper(Context context, String name, SQLiteDatabase.CursorFactory factory, int version);

// 以只读的方式打开当前对象所指向的数据库。前程序可以对打开的数据库进行读写操作。若数据库不存在，则创建数据库。 
public synchronized SQLiteDatabase getReadableDatabase();

// 以读写的方式打开当前对象所指向的数据库。当前程序可以对打开的数据库进行读写操作。若数据库不存在，则创建数据库。
public synchronized SQLiteDatabase getWritableDatabase();

// 数据库被创建出来后Android系统会自动调用此方法。一般会在此方法中创建表。
public abstract void onCreate(SQLiteDatabase db);

// 数据库更新(当前对象指定的版本号和已存在的数据库文件中的版本号不相同)时调用此方法。一般会在此方法中修改表结构。
public abstract void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion);
```

<br>　　范例2：创建数据库。
``` android
SQLiteOpenHelper helper = new SQLiteOpenHelper(this,"data.db",null,1){
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE person(id int primary key,name varchar(20))");
    }
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {}
};
SQLiteDatabase db = helper.getReadableDatabase();
```
    语句解释：
    -  在Android中可以使用SQLiteDatabase类来执行SQL语句，该类具体用法，后述。
    -  只有在调用了SQLiteOpenHelper类的getReadableDatabase或getWritableDatabase方法时，虚拟机才会去执行打开数据库操作，若要打开的数据库不存在，则会创建数据库，并在创建完数据库之后调用SQLiteOpenHelper类的onCreate方法。
    -  数据库文件被保存在packagename/databases文件夹下面。

<br>　　范例3：它们的区别。

	若只需要对数据库执行读操作，那么就应该调用getReadableDatabase方法来打开数据库。否则，则调用getWritableDatabase方法来打开数据库。这是因为：
	-  若数据库文件的容量未满，则在程序中调用getReadableDatabase方法打开数据库时，该方法会转调用getWritableDatabase方法。
	-  若数据库文件的容量满了，则在程序中调用getReadableDatabase方法打开数据库时，会以只读的方式打开数据库。
	-  若数据库文件的容量满了，且程序通过调用getWritableDatabase打开数据库，则就会抛异常。因为系统认为您可能会执行写操作。 即便您的目只是想执行读操作。

<br>　　范例4：数据库版本号。

	-  构造SQLiteOpenHelper对象时，需要为其提供一个版本号(必须是大于0的正整数)，以供创建(若数据库不存在)或更新数据库时使用。
	-  系统最初创建数据库的时候，数据库的版本号为0，创建完成之后才会将数据库的版本号设置为SQLiteOpenHelper构造方法中指定的版本号。 
	-  若数据库文件在databases文件夹中已经存在了，但是数据库文件的版本号和构造方法给出的版本号不相同，则会调用SQLiteOpenHelper类的onUpgrade方法。因此可以在此方法中更新数据库的表结构。

<br>　　提示：

	-  在SQLite数据库中表的列可以不指定数据类型，即便指定了也不起作用。
	-  若表的主键列是integer类型，则主键列的值会自动增长，主键不能重复。

<br>
### 操作数据库 ###

<br>　　范例1：`SQLiteDatabase`类。
``` android
// 执行指定的sql语句。
public void execSQL(String sql)

// 执行指定的sql语句，在sql语句中可以使用占位符( ?号 )。bindArgs用于替换占位符。
// -  提示：SQLite可以解析大部分标准SQL语句，但并不是全部。
public void execSQL(String sql, Object[] bindArgs)

// 执行指定的sql语句查询数据，在sql语句中可以使用占位符。selectionArgs用于替换占位符。若不需要占位符，则可以将selectionArgs置为null。 
public Cursor rawQuery(String sql, String[] selectionArgs)

// 用来关闭数据库。
public void close()
```

<br>　　范例2：插入数据。
``` android
SQLiteOpenHelper helper = new SQLiteOpenHelper(this,"data.db",null,1){
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE person(id integer primary key,name)");
    }
    public void onUpgrade(SQLiteDatabase db, int oldVersion,int newVersion) {}
};
SQLiteDatabase db = helper.getReadableDatabase();
db.execSQL("INSERT INTO person(name) VALUES(?)",new Object[]{"李四"});
db.close();
```
    语句解释：
    -  数据库删除和更新的做法和本范例类似。

<br>　　范例3：数据库查询操作。
``` android
SQLiteOpenHelper helper = new SQLiteOpenHelper(this,"data.db",null,1){
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE person(id integer primary key,name)");
    }  
    public void onUpgrade(SQLiteDatabase db, int oldVersion,int newVersion){}
};
SQLiteDatabase db = helper.getReadableDatabase();

Cursor c = db.rawQuery("SELECT id,name FROM person", null);
while(c.moveToNext()){
    int id = c.getInt(c.getColumnIndex("id"));
    String name = c.getString(c.getColumnIndex("name"));
    System.out.println("id = "+id+",name = "+name);
}
c.close();
db.close();
```
    语句解释：
    -  调用Cursor的get方法时也可以直接使用列的下标，下标从0开始。如在本范例中id列的下标为0，name列的下标为1 。
    -  若需要限定查询范围，则可以使用limit子句。
    -  若需要排序，则order by子句必须出现在limit之后。

<br>　　范例5：`SQLiteDatabase`类。
``` android
// 执行指定的sql语句，在sql语句中可以使用占位符。
// -  table 要操作的表。 whereclause ：where子句的条件。 whereArgs子句的所用到的参数。
public int delete(String table, String whereClause, String[] whereArgs);

// 执行指定的sql语句，在sql语句中可以使用占位符。
// -  table 要操作的表。
// -  values：sql语句中的所用到的参数，参数名必须要和表中的列名一致。
// -  nullColumnHack ：后述。
// 返回值：
// -  返回行号。提示：每成功插入一条数据，行号+1。
// -  行号类似于Oracle的序列，若删除数据，也不会导致行号回退。
// -  若主键是integer类型的，则此方法返回，新插入的行的主键。
public long insert(String table, String nullColumnHack, ContentValues values)

// 执行指定的sql语句更新数据，在sql语句中可以使用占位符。
public int update(String table, ContentValues values, String whereClause, String[] whereArgs)

```

<br>**关于nullColumnHack**
　　在SQL中是不允许执行一个类似于`insert into emp() values()`的语句。但是，使用拼接的方式组织`sql`插入语句时若`values==null`或者`values.size<0`，则最终组织成的`sql`语句就是上面的语句。
　　因此，需要指定一个列，当`values`为`null`或`size=0`时，默认为其自动赋值为`null`。如`insert("person","id",null)`拼接后的SQL语句为：`insert into(id) values(null)`。
　　但是若`insert`方法的`values`的`size>0`，则参数`nullColumnHack`将不起作用。 

<br>　　范例6：更新操作。
``` android
SQLiteOpenHelper helper = new SQLiteOpenHelper(this,"data.db",null,1){
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE person(id integer primary key,name)");
    }  
    public void onUpgrade(SQLiteDatabase db, int oldVersion,int newVersion) {}
};
SQLiteDatabase db = helper.getReadableDatabase();
ContentValues values = new ContentValues();
values.put("name", "周杰伦");
db.insert("person", "name", values);
db.close();
```

<br>
### 事务管理 ###

<br>　　范例1：SQLiteDatabase类。
``` android
// 开启一个事务。
public void beginTransaction()

// 结束当前事务。
public void endTransaction()

// 将当前事务标识设为true。
public void setTransactionSuccessful()
```

<br>　　范例2：事务操作。
``` android
public void test() {
    SQLiteDatabase db = dbOpenHelper.getWritableDatabase();
    db.beginTransaction();//开启事务，默认情况下，事务标志为False 。
    try{
        db.execSQL("update person set amount=amount-10 where personid=2");
        db.execSQL("update person set amount=amount+10 where personid=3");
        db.setTransactionSuccessful();//将事务标志，设置为true 意味着，事务成功。
    } finally {
        //调用此方法结束事务，事务最终是提交还是回滚，是由事务标志决定的，若事务的标志为True，就会提交事务，否则回滚事务。
        db.endTransaction();
    }
}
```

<br>　　提示：SQLite数据库单列数据容量要小于`1M`。

## XML解析 ##
<br>　　范例1：解析XML涉及API。

	-  使用XMLPullParser接口来解析XML文档。
	-  使用Xml类来实例化XMLPullParser。
	-  XMLPullParser基于sax解析，它每读到一个东西时，会触发相应的事件，事件是int型的。XMLPullParser的解析方式被称为pull解析，pull解析比sax解析更灵活，因为它可以灵活的控制程序是否继续触发下一事件。
	-  常见的事件：
	   -  XmlPullParser.END_DOCUMENT 文档结束。
	   -  XmlPullParser.END_TAG  标签结束。
	   -  XmlPullParser.START_DOCUMENT 文档开始。
	   -  XmlPullParser.START_TAG标签结束。 

<br>　　范例2：XMLPullParser接口。
``` android
// 指定属性的下标，获取当前元素的某个属性的值，下标从0开始。
public abstract String getAttributeValue(int index);

// 返回当前元素的名称。 在开始标签和结束标签时调用此方法。
public abstract String getName();

// 若当前节点是开始节点，则返回开始节点之后的文本节点的内容。
public abstract String nextText();

// 返回当前事件的类型。
public abstract int getEventType();

// 继续触发下一个事件，并返回下一个事件的类型。
public abstract int next();
```

<br>　　范例3：Xml类。
```
// 创建一个XML解析器。
public static XmlPullParser newPullParser()
```

<br>　　范例4：读取文件。
``` android
public void xmlParse() throws Exception{
    XmlPullParser parser = Xml.newPullParser();
    InputStream input = getClassLoader().getResourceAsStream("person.xml");
    parser.setInput(input, "UTF-8");
	
    List<Person> list = null;
    Person p = null;
    // 开始读取数据。
    int event = parser.getEventType();
    while(event != XmlPullParser.END_DOCUMENT){
        if(event == XmlPullParser.START_DOCUMENT){
            list = new ArrayList<Person>();
        }else if(event == XmlPullParser.START_TAG){
            if("person".equals(parser.getName())){
                p = new Person();
                p.setId(parser.getAttributeValue(0));
            }else if("name".equals(parser.getName())){
                p.setName(parser.nextText());
            }else if("age".equals(parser.getName())){
                p.setAge(Integer.parseInt(parser.nextText()));
            }
        }else if(event == XmlPullParser.END_TAG){
            if("person".equals(parser.getName())){
                list.add(p);
                p = null;  
            }
        }
        event = parser.next();
    }
    for(Person temp : list)
        System.out.println(temp.toString());
}
```
    语句解释：
    -  调用setInput方法时，parser就处于了start_document状态。
    -  文件person.xml保存在src文件夹下面。

　　使用`XmlSerializer`接口来创建XML文档，使用`Xml`类来实例化`XmlSerializer`。

<br>　　范例6：XmlSerializer接口。
``` android
// 创建一个文档开始标记。
public abstract void startDocument(String encoding, Boolean standalone);

// 创建一个标签开始标记。
public abstract XmlSerializer startTag (String namespace, String name);

// 为当前标签，添加一个属性。
public abstract XmlSerializer attribute(String namespace, String name, String value);

// 为当前标签，添加一个文本节点。
public abstract XmlSerializer text(String text);

// 设置当前XmlSerializer接口中的数据，输出的目的地以及编码。
public abstract void setOutput(OutputStream os, String encoding);

// 将数据刷新到OutputStream中，再由OutputStream对象将数据写入到目的地。
public abstract void flush();
```

<br>　　范例7：Xml类。
```
// 创建一个XmlSerializer对象。
public static XmlSerializer newSerializer ()
```

<br>　　范例8：代码。
``` android
public void xmlWrite()throws Exception{
    XmlSerializer serializer = Xml.newSerializer();
    File file = new File(this.getContext().getFilesDir(),"cxy.xml");
    OutputStream out = new FileOutputStream(file);
    serializer.setOutput(out, "UTF-8");
		
    List<Person> list = new ArrayList<Person>();
    Person p = null;
    for(int i=0;i<3;i++){
        p = new Person();
        p.setId(i+"");
        p.setName("周杰伦");
        p.setAge(40+i);
        list.add(p);
    }
		
    serializer.startDocument("UTF-8", true);
    serializer.startTag("", "persons");
    for(Person p1 : list){
        serializer.startTag("", "person");
        serializer.attribute("", "id", p1.getId());
        serializer.startTag("", "name");
        serializer.text(p1.getName());
        serializer.endTag("", "name");
        serializer.startTag("", "age");
        serializer.text(p1.getAge()+"");
        serializer.endTag("", "age");
        serializer.endTag("", "person");
    }
    serializer.endTag("", "persons");
    serializer.endDocument();
		
    serializer.flush();
    out.close();
}
```
    语句解释：
    -  也可以直接StringBuilder一个字符串，通过输出流将输出写出去。

# 第二节 数据访问 #
　　`Android`项目中有三个比较重要的文件夹：`src`、`assets`、`res`，本节将依次介绍如何获取上述三个文件夹内的文件。

## ClassLoader ##
　　在JavaSE中通常都会使用`ClassLoader`(类加载器)来访问`src`文件夹下的某个文件。在Android中也是同样如此。

<br>　　范例1：ClassLoader类。
``` android
// 在当前类加载器的工作目录下，查找名为resName的文件，并获取其输入流。若未找到名为resName的文件，则返回null。
public InputStream getResourceAsStream(String resName)
```

<br>　　问：什么是类加载器?
　　答：虚拟机若想运行某一个类，则必须先将其加载入内存，而加载类到内存的工具，就是`类加载器`。换句话说，每一个存在于虚拟机(不论是`JVM`还是`Dalvik`)中的类，都是被类加载器载入内存的。

<br>　　再问：类加载器的功能还有什么?
　　再答：类加载器除了可以加载字节码文件，还可以加载其他文件，只要该文件存在于类加载器所在的`工作目录`下面即可。

<br>　　还问：类加载器的工作目录是哪个目录?
　　还答：类加载器有多种，每种加载器的所加载的类是不同的。如：`boot`类加载器加载Java核心类库中的类(`String`类等)。 `app`类加载器：加载用户自定义的类。它们两个类加载器的工作目录是不一样的。 

<br>**重要提示：**
　　观察Eclipse创建出来的项目，不论是`JavaSE`、`JavaEE`或是`Android`项目，项目的目录下面都会有一个名为`.classpath`的文件，以Android为例里面的内容大致如下：
``` xml
<?xml version="1.0" encoding="UTF-8"?>
<classpath>
    <classpathentry kind="src" path="src"/>
    <classpathentry kind="src" path="gen"/>
    <classpathentry kind="con" path="com.android.ide.eclipse.adt.ANDROID_FRAMEWORK"/>
    <classpathentry exported="true" kind="con" path="com.android.ide.eclipse.adt.LIBRARIES"/>
    <classpathentry exported="true" kind="con" path="com.android.ide.eclipse.adt.DEPENDENCIES"/>
    <classpathentry kind="output" path="bin/classes"/>
</classpath>
```
　　在`.classpath`文件中有多个`<classpathentry>`元素。我们可以通过Eclipse和命令行两种方式来运行一个项目，使用不同的运行方式，`app`类加载器加载类的路径也不同：

	-  使用Eclipse运行项目时，app类加载器就会去kind属性值为src的路径下面加载（即上面代码的前两项）。
	-  使用命令行运行项目时，app类加载器会获取操作系统的classpath变量。


　　当通过Eclipse发布项目的时候（将项目从Eclipse中导出并交给客户），Eclipse会将src目录下的非(`.java`)文件原样不动(`保持文件的目录结构`)的转移到`.classpath`文件的`<classpathentry kind="output" path="..."/>`所指向的路径中。
　　对于Android项目来说，最终会生成一个`apk`文件，此时`app`类加载器的起始工作目录为`apk`文件的根目录。
　　
<br>　　接着问：如何获取一个`ClassLoader`对象呢?
　　接着答：所有的类都是被类加载加载到内存的，在Java中使用`Class`类来代表字节码，通过某个类的`Class`对象就可以获取该类的加载器。

<br>　　范例2：`Class`类。
``` android
// 返回当前Class对象所代表的类的类加载器。若此对象表示一个基本类型或void，则返回 null。
public ClassLoader getClassLoader()
```

<br>　　范例3：获取`int`的类加载器。
``` android
System.out.println(int.class.getClassLoader());  // 输出null。
```

<br>　　范例4：加载文件。
``` android
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        // 获取AndroidTestActivity的类加载器,由于该类是自定义的类,因此其类加载器是app。
        InputStream input = getClassLoader().getResourceAsStream("a.txt");
        try{
            System.out.println("content="+this.readFile(input));
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    private String readFile(InputStream input)throws Exception{
        String resultStr = null;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int len;
        byte[] array = new byte[1024];
        while ((len = input.read(array)) != -1) {
            out.write(array,0,len);
        }
        resultStr = out.toString("UTF-8"); // 可以不写UTF-8,默认就为UTF-8。
        input.close();
        out.close();
        return resultStr;
    }
}
```
    语句解释：
    -  首先在src根目录下面建立一个a.txt ，内容为：Hi Android世界。
    -  若程序执行的时候出现了乱码，请检查您Android项目的编码是否使用的UTF-8。

<br>　　范例5：加载文件2.0 。
``` android
InputStream input=getClassLoader().getResourceAsStream("org/cxy/test/b.txt");
```
    语句解释：
    -  首先在src目录下面的org.cxy.test包下面建立一个b.txt。
    -  若需要访问某个包中的文件，则需要将包名中的“.”换成路径分隔符“/”。但是文件后缀名中的“.”不需要换。 
    -  Andoird是基于Linus内核的，因此不可使用“\\”作为路径分隔符，因为那是Windows中使用的。ClassLoader类可以在JavaSE和JavaWeb项目中使用，若该项目是运行在Windows系统中的，则就可以使用“\\”作为路径分隔符了。


<br>**类装载器缺点**

	-  首先，类装载器会将文件一次性全部读入内存后，再处理。因此，读取的文件不能太大。
	-  第二，类装载器，对于一个文件只会装载一次，若文件的内容在程序运行的时候被更新，则程序无法及时获得新的数据。

<br>　　范例6：思考题，下面`File`对象的相对路径相对于谁?。
``` android
package org.cxy.test;
import java.io.File;
import android.app.Activity;
import android.os.Bundle;
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
        File file = new File("a.txt");
        System.out.println(file.exists());
    }
}
```
    语句解释：
    -  答：相对于用户手机的根目录“/”，而不是apk包的根目录。
    -  前面已经说了，用户手机中存在有三个目录：system、data、mnt ，这三个目录就是存在于根目录“/”下面的。
    -  若File对象的构造方法中指定的路径是以“/”开头，则意味着该路径是绝对路径。若想访问data/a.txt文件，则可以使用“File("/data/a.txt")”构造File对象。
    -  因此，若在某个应用程序中想访问其他应用程序的文件(前提是该文件允许你访问他)，就可以使用绝对路径的方式：
       -  如：/data/data/org.cxy.file/files/a.txt 。

## AssetManager ##
　　在`Android`中可以使用`AssetManager`类来访问`assets`目录下的文件。`assets`目录的特点：

	-  首先，assets文件夹内单个文件的大小必须<=1MB 。
	-  然后，assets文件夹内的文件不会被注册到R文件中。
	-  接着，assets文件夹内可以任意自定义子文件夹。
	-  最后，assets文件夹主要用于保存一些“容量小且固定不变”的文件，如：游戏音乐等。所谓的“固定不变”指的是在程序运行的时候，该文件仅会被程序读取而不会去修改其内容。 

<br>　　范例1：`AssetManager`类。
``` android
// 从asset目录下获取指定文件的输入流。
public final InputStream open(String fileName)

// 将assets/path目录下的所有文件的名称列出来，不包含子目录的名称。
public final String[] list(String path)

// 关闭当前AssetManager对象。
public void close()
```

<br>　　范例2：`ContextWrapper`类。
``` android
// 获取当前应用程序的AssetManager实例。
public AssetManager getAssets()
```

<br>　　范例3：获取输入流。
``` android
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        try {
            AssetManager manager = getAssets();
            System.out.println(this.readFile(manager.open("a.txt")));
            manager.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
    语句解释：
    -  open方法会自动去assets文件夹下面查找文件。


<br>　　范例4：遍历所有文件。
``` android
public void test(){
    String folder="a";
    AssetManager manager = getAssets();
    for(String name:manager.list(folder)){
        System.out.println(name);
        System.out.println(readFile(manager.open(folder+File.separator+name)));
    }
    manager.close();
}
```
    语句解释：
    -  本范例中“manager.list(folder)”的含义为：将"assets/a"目录下面的所有文件的文件名称列出来。
    -  将文件的路径path与list方法返回的文件的名称组合在一起后，就可以调用open方法获取该文件的输入流了。

## Resources ##
　　在`Android`中可以使用`Resources`类来访问`res`目录下的文件。 `res`目录下常见的子目录为：
```
目录名称                       作用
drawable                      存放图片资源。
layout                        存放布局文件。
values                        存放数值文件。
anim                          存放动画文件。
xml                           存放xml文件。
menu                          存放菜单文件。
raw                           存放应用使用到的原始文件。
```
　　`res`目录的特点：其内的每个资源都会在`R`文件中注册。

<br>　　范例1：Resources类。
``` android
// 指定资源ID，然后从res/values文件中获取String类型的数据。
public String getString(int id)

// 指定资源ID，然后从res/xml文件中获取xml文件的XmlResourceParser对象，通过这个对象可以解析该xml文件。
public XmlResourceParser getXml(int id)

// 指定资源ID，然后从res/raw文件中获取文件的输入流。
public InputStream openRawResource(int id)
```

<br>　　范例2：定义各种类型的值。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">AndroidTest</string>
    <color name="white">#FFFFFF</color>
    <dimen name="width">20dp</dimen>
    <dimen name="height">20dp</dimen>
    <integer-array name="id">
        <item>1</item>
        <item>2</item>
        <item>3</item>
    </integer-array>
    <string-array name="name">
        <item>张三</item>
        <item>李四</item>
        <item>王五</item>
    </string-array>
</resources>
```
    语句解释：
    -  各种数值类型可以写在一个文件中，也可以单独定义到新的文件中。

<br>　　范例3：Context类。
``` android
// 获取当前应用程序的Resources对象。
public abstract Resources getResources()
```

<br>　　范例4：获取各种类型的值。
``` android
public class AndroidTestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        Resources res = getResources();
		
        System.out.println(res.getString(R.string.app_name));
        System.out.println(res.getColor(R.color.white));
        System.out.println(res.getDimension(R.dimen.width));
        System.out.println(res.getDimension(R.dimen.height));

        int[] ids = res.getIntArray(R.array.id);
        String[] names = res.getStringArray(R.array.name);
        for(int i=0;i<ids.length;i++){
            System.out.println("id="+ids[i]+",name="+names[i]);
        }
    }
}
```

<br>　　范例5：XmlResourceParser接口。
``` android
// XmlResourceParser是XmlPullParser的子接口，因此可以使用pull解析来解析xml文档。
// 关闭当前XmlResourceParser对象。
public abstract void close()
```

<br>
　　`res/raw`目录用于存放应用使用到的原始文件，如音效文件等。与`assets`目录比较：

	-  相同点：在编译项目时，这些数据不会被编译，它们被直接加入到程序安装包里。
	-  不同点：此目录下的文件都会在R文件中注册，若在其内自定义子目录，则子目录中的文件不会被注册到R文件中。自由度较assets目录略低。

# 第三节 App安装位置 #
　　从`API level 8`开始，用户可以将应用程序安装到外部存储设备中（如SD卡）。可以通过在`manifest`中声明`android:installLocation`属性。如果不声明该属性，应用程序将只会安装在内存中，而且不能移动到外部存储设备。
　　要将应用程序安装到外部存储设备中，只需修改`manifest`文件，在`manifest`元素中添加`android:installLocation`属性，属性值为`preferExternal`或`auto`。

<br>　　例如：
``` xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    android:installLocation="preferExternal"
    ... >
```
　　如果该属性值设为`preferExternal`，表明用户要求应用程序优先安装在外部存储设备中，但是系统并不保证应用程序真的安装在外部存储设备中。如果外部存储设备的空间已满，系统仍然会将应用程序安装在内存中。用户也可以在两个位置之间移动应用程序。
　　如果该属性值设为`auto`，表明应用程序可能安装在外部存储设备中，但是用户本身对安装位置没有特殊要求。系统会根据多种因素决定将应用程序安装在哪里。用户也可以在两个位置之间移动应用程序。

　　当应用程序安装在外部存储设备中时：

	-  只要外部存储设备装载在设备上，应用程序的性能就不会受到影响。
	-  .apk文件是保存在外部存储设备中的，但是所有的私有用户数据、数据库、优化的.dex文件和提取的本地代码都是保存在设备的内存中的。
	-  保存应用程序的唯一容器经过一个随机产生的密钥进行加密。该密钥只能由最初安装该程序的设备解密。因此，安装在SD卡上的应用程序只能在某一个固定的设备上运行。
	-  用户可以通过系统设置将应用程序移动到内存上。

　　注意：当用户使用`USB大容量存储器`与计算机共享文件时，或通过系统设置卸载SD卡时，外部存储设备将从本设备卸载，并且所有在该外部存储设备中安装的应用程序将立刻被关闭。

<br><br>