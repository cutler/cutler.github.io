title: 第二章 应用程序组件 — Content Provider
date: 2014-11-23 15:16:35
categories: Android
tags:
- Android
---
　　在Android中应用程序的数据可以保存在 `SQLite` 数据库、网络或者应用程序可以访问到的任何本地的持久化的存储介质中。如果应用程序需要向外界（即其它应用程序）提供自己的数据，则可以通过`Content Provider`（内容提供者）来完成。通过Content Provider其他的应用程序能够查询或编辑（如果 Content Provider 允许）应用程序的数据。
　　例如，Android系统提供了一个管理用户通讯录的Content Provider，任何带有适当授权的应用程序都能够查询由Content Provider读/写的数据。

<br>**是什么?**
　　内容提供者(Content Providers)的作用：数据共享。
　　通过内容提供者可以：

	-  使当前应用程序产生的数据被其他应用程序访问。
	-  使当前应用程序访问其他应用程序的数据。

<br>**为什么要通过 Content Provider 来向外界来提供数据呢?**
　　数据对于每个应用程序来说都应该是私有的。应用程序A若想访问应用程序B的数据，则必须要经过B的同意。
　　退一步说，若是应用B允许应用A直接通过`IO`等方式操作应用B的数据，那么应用B的数据的安全性就大大降低了。若应用A是个恶意程序，此时它会利用这个特点胡乱修改应用B的数据，这是绝对不允许的。
　　因此若程序A需要访问程序B的数据，则就需要同时运行A和B，然后再访问。这样一来，A所进行的操作都会被B所`“看”`到，B也可以对A所进行的操作进行限制(B只提供有限的接口给外界)。
　　然而每个应用程序都是运行在自己的进程中，当应用A需要访问应用B的数据时，数据就需要在不同的虚拟机之间传递。这样操作起来可能就很困难。
　　此时可以使用 `Content Provider` （具体由Android系统来帮我们实现），它能在不同的应用程序之间方便的传递数据。

<br>　　问：内容提供者在哪创建?
　　答：内容提供者是Android的四大组件之一 ，因此在任何一个Android应用程序中都可以创建内容提供者。

　　问：内容提供者如何工作?
　　答：在用户程序A中通过访问应用程序B中所定义的内容提供者来获取应用程序B所产生的数据。返过来，也可以在应用程序A中定义一个内容提供者将应用程序A的数据提供给其他应用程序。

　　问：使应用程序A和B直接交互不就得了? 还要什么内容提供者?
　　答：

	-  首先，内容提供者可以以一种统一的方式，提供数据给其他应用。 A访问B的数据时，A只需要向B的内容提供者索要数据，而不需要关心B是以何种(xml、数据库等)方式存储数据的。即内容提供者提供了一套用于在应用程序间交换数据的标准的规范。 
	-  然后，为了保护应用程序数据的安全，防止其他应用程序恶意篡改数据。
	-  最后，若A想通过内容提供者访问B的数据时，B应用并没有启动，则系统会启动B应用程序，并开启一个进程。

<br>**何时使用?**
　　如果你不想跟其他应用程序共享数据，就不需要开发自己的提供者。但是，如果你要在自己的应用程序中提供定制化的搜索建议就需要自己的提供者，如果你想要把复杂的数据或文件从你的应用复制粘贴到另一个应用程序中，你也需要提供自己的提供者。
　　Android本身包含了管理诸如音频、视频、图片、以及个人通信录信息的内容提供者。你能够在android.provider包的参考文档中看到一些被列出的内容提供者。

<br>**如何使用？**
　　当你想要通过其他应用程序定义的内容提供者来访问该应用程序中的数据时，可以使用`ContentResolver`对象作为客户端跟提供者进行通信。
　　在另一端，跟`ContentResolver`对象进行通信的提供者对象是`ContentProvider`实现类的一个实例。这个提供者对象接收来自各个客户端的请求，执行请求动作，并返回结果。

　　应用程序A访问应用程序B中定义的内容提供者时，流程如下图所示：
<center>
![](/img/android/android_2_13.png)
</center>

　　访问内容提供者数据的操作是`跨进程`的，Android在应用程序A中使用Context类的`getContentResolver()`方法获取一个ContentResolver对象，你只需调用它提供的各个API接口即可，在其内部会转调用目标ContentProvider对应的方法，并且它已经替你完成了`跨进程通信`的操作。

# 第一节 基础知识 #
　　内容提供者管理着应用程序的数据，它是Android应用程序四大组件之一，通常为了跟数据协同工作，它会配合Activity来提供自己的UI。但是内容提供器的主要目的是为其他应用程序提供数据，其他应用程序通过使用内容提供者的客户端对象ContentResolver来访问提供者。提供者和提供者客户端一起给处理进程间通信的数据和安全数据访问提供了一个一致的、标准的接口。

<br>**概述**
　　内容提供者通过类似`关系数据库`中的`表`的形式，使用一个或多个表给外部应用程序呈现数据。表中的一行代表了一个实体，并且每行中每一列代表了该实体的某个属性。
　　例如，用户字典(user dictionary) 是Android平台中内置的提供器之一，它存储了用户想要保持的非标准单词的拼写。下图说明了在这个提供器的表中可能有的数据：
<center>
![](/img/android/android_2_14.png)
</center>

　　在表1中，每一行代表了一个在标准字典里不可能找到的单词的实例。每一列代表了那个单词的一些数据，如locale列，列头是保存在提供者中的列名。要引用一行的locale的值，就要指向这一行的locale列。对于这个提供者，`_ID`列是这个提供器自动维护的`主键`列。
　　注意：提供者不是必须得有一个主键，并且如果存在主键，也不必使用_ID作为列名。但是，如果你想要把来自提供者的数据绑定到一个`ListView`中，就得有一个列名是`_ID`的列。这个需求会在后面章节中进行更详细的的解释。

## 访问内容提供者 ##
　　应用程序使用ContentResolver客户端对象访问来自ContentProvider的数据。这个对象有一些与内容提供者中相同的命名的方法。
　　所有的内容提供者都是ContentProvider类的一个具体的子类的实例。
　　ContentResolver对象的方法提供了基本的`CRUD`（create，retrieve，update，delete）持久化保存的功能。
　　ContentProvider对象也以表的形式在数据资源库和数据的外部表现之间扮演着抽象层的角色。

　　下面通过创建一个简单的内容提供者来介绍ContentProvider类的常用方法。

<br>　　范例1：服务端的MyContentProvider类。
``` android
public class MyContentProvider extends ContentProvider{

    /**
     *  当ContentProvider被创建完成后调用此方法。用于完成一些初始化操作。
     */
    public boolean onCreate() {
        return false;
    }
	
    /**
     * 向内容提供者所在的应用程序中插入数据。
     * @param uri: 要操作的表。 
     * @param values: 要插入的数据。
     * @return 返回新插入的数据的Uri。
     */
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }
	
    /**
     * 从内容提供者所在的应用程序中删除数据。
     * @param uri: 要操作的表。 
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @return 返回受影响的行数。
     */
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }
	
    /**
     * 从内容提供者所在的应用程序中更新数据。
     * @param uri: 要操作的表。 
     * @param values: 要插入的数据。
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @return 返回受影响的行数。
     */
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }

    /**
     * 从内容提供者所在的应用程序中查询数据。
     * @param uri: 要操作的表。 
     * @param projection: 要查询的列。
     * @param selection: where子句。
     * @param selectionArgs: 用于替换where子句中的?号占位符。
     * @param sortOrder: 排序语句，如：“id desc”含义为：按照id列进行降序排列，升序排列则用“id asc”。
     * @return 返回查询出来的数据。
     */
    public Cursor query(Uri uri, String[] projection, String selection,
                  String[] selectionArgs, String sortOrder) {
        return null;
    }
	
    /**
     * 此方法的作用后面会进行介绍。
     */
    public String getType(Uri arg0) {
        return null;
    }

}
```
　　一般来说，内容提供者所提供的数据，都是存储在数据库中的，所以上面的四个方法所要的参数和数据库操作相似。 如果不了解数据库的操作，请参阅“数据库编程”一节。
　　在客户端应用程序中使用ContentResolver对象来访问提供者，ContentResolver同样提供了`insert`、`delete`、`update`、`query`方法，在这些方法的内部会调用ContentProvider的增删查改方法。除此之外还会进行一些其他操作（比如处理进程间通讯）。

　　例如，要从用户字典提供者中查询出数据，你要调用`ContentResolver.query()`方法。然后query()方法会调用由用户字典提供器定义的ContentProvider.query()方法。以下代码显示了ContentResolver.query()方法的使用方法：
``` android
mCursor = getContentResolver().
        query(UserDictionary.Words.CONTENT_URI,mProjection,mSelection, mSelectionArgs, mSortOrder);
```
　　下图显示了query(Uri, projection, selection, selectionArgs, sortOrder)方法的参数是如何跟SQL的Select语句进行匹配的：
<center>
![](/img/android/android_2_15.png)
</center>

### Content URIs ###
　　当你想调用一个ContentResolver类的`CRUD`方法，来操作提供者所提供的数据时，就需要传递该一个Content URI。 简单的说，Content URI表示一个`表`的名称，即告诉Android系统随后进行`CRUD`的操作是针对于该表中的数据进行的。
　　在前面的代码行中，常量UserDictionary.Words.CONTENT_URI就是用户字典`words`表的Content URI(统一资源标识)。

　　Content URI唯一标识某个内容提供者中的某张表，完整的Uri应该由三部分组成`scheme`、`authority`、`path`。如：
``` android
content://user_dictionary/words
```

    语句解释：
    -  scheme(约束)：内容提供者的约束固定为“content://”。
    -  authority(内容提供者的唯一标识)：Andriod系统通过authority来查找一个内容提供者。如：“user_dictionary”。
    -  path(路径)：当系统查找到内容提供者后，路径用于告诉内容提供者所要访问哪个表中的数据。如“words”，并且words后面还可以再有子路径。

<br>　　范例1：具体流程。

	当客户端通过调用ContentResolver类提供的增、删、查、改等方法时，需要同时为该方法传递一个Uri参数(即Content URI)，这个参数会在两个地方被使用到：
	-  1、Android操作系统：会从Uri中抽取出authority部分，然后从当前操作系统中定位(依次与每个注册到系统中的内容提供者的authorities属性值比较)用户所要访问的内容提供者。
	   -  若定位成功， Android系统则会调用那个ContentProvider所对应的方法，并将Uri和其他参数一起传递给该方法。
	   -  若定位失败， Android系统则会抛异常。
	   -  也就是说Android系统只关注Uri的约束和authority两部分。
	-  2、内容提供者：
	   -  当提供者接收到Android系统转发来的请求时，它会依据Uri中的path部分来决定操作哪一张表，并在操作完毕将结果返回给用户。

　　许多提供者允许你通过在URI的尾部添加一个ID值来访问表中的某个具体的行。例如，要从用户字典中获取_ID是4的那行数据，可以使用以下这样的内容URI：
``` android
Uri singleUri = ContentUris.withAppendedId(UserDictionary.Words.CONTENT_URI, 4);
```
　　当你从提供者中检索出多行数据后，若想更新或删除其中的某一行的数据时，就会需要在Uri的后面加上一个id。
　　注意：`Uri`和`Uri.Builder`类为通过字符串构造具有良好格式的Uri提供了便利方法。`ContentUris`类给URI添加一个ID值提供了便利的方法。上面的代码片段中就使用了`withAppendedId()`方法给用户字典的内容URI添加了一个ID值。

<br>　　ContentUris类可以解析出Uri末尾的数字，也可以向Uri末尾添加一个数字。
　　范例2：ContentUris类常用方法。

	public static Uri withAppendedId (Uri contentUri, long id)
	-  在给定的uri后面添加一个id。
	-  若参数uri为“content://www.cxy.cn/person”且id为5，则生成的uri为“content://www.cxy.cn/person/5” 。
	public static long parseId (Uri contentUri)
	-  从给定的uri后面解析出一个id。
	-  若uri为“content://www.cxy.cn/person/5”则返回5 。

### 从提供者中获取数据 ###
　　这一节使用用户字典提供者作为一个例子来描述了怎样从提供者中获取数据。
　　为了清晰起见，本节中的代码片段在UI线程上调用ContentResolver()方法，但是，在实际代码中，应该在一个独立的线程中执行异步查询。执行异步查询的方法之一是使用`CursorLoader`类，这个类在装载器（Loader）指南中进行过比较详细的描述。而且这里的代码也只是代码片段，它们不是一个完整应用程序的展示。

　　按照以下基本步骤从提供器中获取数据：

	1、给提供者申请读访问权限。
	2、定义发送给提供者的查询代码。

<br>**申请读访问权限**
　　如果你要从一个提供者中获取数据，但该提供者要求访问者需要具备某些权限时，那么你的应用程序需要向该提供者申请“读访问权限”。你不能在运行时申请这个权限，而是要在你的清单文件中使用`<uses-permission>`元素，并且需要使用提供者定义的确切的权限名来设置`<uses-permission>`元素`name`属性。当在清单文件中指定了这个元素时，你的应用程序就会受到你申请的这个权限的影响。当用户安装你的应用程序时，会接到提醒。
　　要找到你要使用的提供者的“读访问权限”的确切的名字，以及提供者使用的其他的访问权限的名字，请看对应的提供器的文档。

　　用户字典提供者在它的清单文件中定义了：
　　`android.permission.READ_USER_DICTIONARY`权限，因此如果其他应用程序想要从这个提供器中读取数据，就必须申请这个权限。

<br>**构建查询**
　　接下来是要构建一个获取提供者中数据的查询代码。首先为了访问用户字典提供者定义了一些变量：
``` android
// 使用字符串数组，来定义用户字典提供者，words表中的id、word、locale列的名称。
String[] mProjection = {
    UserDictionary.Words._ID,    
    UserDictionary.Words.WORD,   
    UserDictionary.Words.LOCALE  
};
// 定义where子句。
String mSelectionClause = null;
// 定义where子句所要使用到的参数集合。
String[] mSelectionArgs = {""};
```
　　下面的代码片段使用用户字典提供者作为例子来演示如何使用`ContentResolver.query()`方法。提供者的客户端查询跟一个SQL查询类似，它包含了要查询的`列的集合`、`选择条件的集合`和`排序标准`。
　　查询应该返回的列的集合被叫做`投影`（projection）(即上面的变量mProjection)。
　　指定要获取哪些行的表达式被分成了`选择子句`和`选择参数`两部分。 选择子句是一个逻辑和布尔表达式的组合（包含列名和值，即上面的变量mSelectionClause）。你可以在选择子句中使用占位符`?`，指定后，查询方法就会获取与选择参数数组（即上面的变量mSelectionArgs）中指定的值相匹配的数据。
　　在下面的代码片段中，如果用户没有在文本框中输入内容，那么选择子句被设置为null，查询就会返回提供者中的所有行。如果用户输入了一些内容，那么选择子句被设置为`UserDictionary.Words.word + " = ？"`，选择参数数组中的第一个元素被设置为用户输入的内容。
``` android
mSearchString = mSearchWord.getText().toString(); // 获取文本框的文字。
mSortOrder = UserDictionary.Words.WORD + " asc ";
if (TextUtils.isEmpty(mSearchString)) {
    mSelectionClause = null;
    mSelectionArgs[0] = "";
} else {
    mSelectionClause = UserDictionary.Words.WORD + " = ?";
    mSelectionArgs[0] = mSearchString;
}
mCursor = getContentResolver().query(
    UserDictionary.Words.CONTENT_URI,   // words表的uri
    mProjection,                        // 要查询的列的集合。
    mSelectionClause                    // where子句。
    mSelectionArgs,                     // where子句的参数。
    mSortOrder);                        // 排序规则
if (null == mCursor) {
    // 如果返回null，则意味着没有找到匹配的提供者。
} else if (mCursor.getCount() < 1) {
    //...
} else {
    //...
}
```
　　这个查询类似以下SQL语句：
``` android
SELECT _ID, word, frequency, locale FROM words WHERE word = <userinput> ORDER BY word ASC;
```

<br>**防止恶意输入**
　　如果内容提供者的数据是用一个SQL数据库来管理的，那么就可能把外部的非法数据包含到SQL语句中，从而导致SQL注入（一种把恶意代码插入到字符串中来攻击关系型数据库的方式）。
　　研究以下这个选择子句：
``` android
String mSelectionClause =  "var = " + mUserInput;
```
　　如果你写出类类似的代码，这就允许用户把恶意的SQL拼装到你的SQL语句中。比如，用户可以给变量mUserInput输入`nothing;DROP TABLE *`，这将导致`var = nothing; DROP TABLE *`出现在选择子句中。因此把选择子句作为一个SQL语句来处理，这可能导致提供者删除SQLite数据库中的所有的表（除非提供器进行捕获SQL注入的尝试）。

　　要避免这个问题可以使用占位符`？`。即向上例中那样将选择子句的参数分离出来，使用一个数组表示，这样做了后，用户的输入将被直接绑定到查询而不是做为SQL语句的一部分来解释。因为它不被看做是SQL，所以用户输入就不能注入恶意的SQL。
　　使用`？`做为可替换参数的选择子句是指定一个选择条件的首选方法。

<br>**显示查询结构**
　　`ContentResolver.query()`方法始终返回一个`Cursor`对象，这个对象包含了跟查询条件匹配的行和由查询投影指定的列。Cursor给它所包含的行和列提供了随机访问(通过下标)。使用Cursor对象的方法，你可以遍历结果中的所有行、判断每一列的数据类型、获取一列数据以及检查结果的其他属性。某些Cursor对象还实现了在提供者数据改变时自动更新对象，或者在Cursor对象改变时触发一个观察者对象中的方法，或者都是。

<br>　　范例1：Cursor接口。
　　此接口代表一个游标，即一个行的列表。类似于JDBC中的ResultSet接口。最初游标指向第一个实体之前的位置。
``` android
public interface Cursor implements Closeable {

    /**
     * 将游标移动到下一个实体所在的位置。
     * @return 
     *     若移动成功，则返回true 。
     *     若当前游标移动到最后一个实体的后面，则返回false 。
     *     若数据库已经被关闭，此方法会返回false。
     */
    public abstract boolean moveToNext();

    /**
     * 指定列号，查询出当前行中的指定列上的数据。
     * 除了getString()外还有对应的重载方法用来获取int、long、float、double、short 类型的值。
     * @param columnIndex: 列的编号，列号从0开始。
     * @return 以String类型返回查询结果。
     */
    public abstract String getString(int columnIndex);

    /**
     * 指定列名，查询出该列在本行中所对应的列号。
     * @param columnName: 列的名称。
     * @return 以int类型返回结果。
     */
    public abstract int getColumnIndex(String columnName);

    /**
     * 关闭游标，释放其所占的资源，并将其标记为无效。当不需要使用Cursor对象你应该调用此方法。
     */
    public abstract void close();
}
```

　　如果没有数据行跟选择条件匹配，那么调用提供者返回Cursor对象的`getCount()`方法，结果是0（空的Cursor对象）。
　　如果发生了内部错误，查询结果依赖与特定的提供者，它可以选择返回null，也可以抛出一个异常。
　　注意：基于构造查询对象的特性，提供者可以限制访问某些列。例如，通信录提供者对同步适配器(sync adapters)就限制其访问某些列，因此这些列不能返回给Activity或Service。

### 内容提供者权限 ###
　　一个提供者能够指定一些权限，其他应用程序要访问这个提供者的数据时必须申请它的权限。这些权限确保用户了解应用程序将试图访问什么样的数据。基于提供者的要求，其他应用程序为了访问这个提供者要申请它们所需要的权限。最后安装应用程序时，用户能够看到申请的权限。
　　跟前面的解释一样，为了从用户字典中获取数据，提供者要求客户端需要申请`android.permission.READ_USER_DICTIONARY`权限。为了插入、更新或删除数据，这个提供者还需要客户端申请`android.permission.WRITE_USER_DICTIONARY`权限。
　　应用程序需要在它的清单文件中使用`<uses-permission>`元素申请提供者要求客户端必须要有的权限。当Android包管理器安装了这个应用程序，用户必须批准应用程序申请的所有的权限。如果用户批准了这些权限，包管理器就会继续安装，如果用户没有批准这些权限，包管理器就会终止这个安装。
　　例如下面的`<uses-permissiion>`元素申请了对用户字典提供器的读访问权限：
``` android
<uses-permission android:name="android.permission.READ_USER_DICTIONARY">
```

　　关于权限的具体知识，在后续章节中会详细介绍。

### 插入、更新和删除数据 ###
　　用跟从提供者中获取数据同样的方式，你也可以修改提供者所提供的数据。你可以通过调用ContentResolver对象的插入、更新、删除等方法，并为其传递若干个参数，最终这些参数会传递给相应的ContentProvider对象的方法。提供者和提供者客户端自动处理安全和进程间通信。

<br>**插入数据**
　　要把数据插入到提供者中，就要调用`ContentResolver.insert()`方法。这个方法把一个新行插入到提供者中，并且返回这行的内容的URI。以下代码片段显示了怎样把一行新的数据插入到用户字典提供器：
``` android
ContentValues mNewValues = new ContentValues();
mNewValues.put(UserDictionary.Words.APP_ID, "example.user");
mNewValues.put(UserDictionary.Words.LOCALE, "en_US");
mNewValues.put(UserDictionary.Words.WORD, "insert");
mNewValues.put(UserDictionary.Words.FREQUENCY, "100");
mNewUri = getContentResolver().insert(UserDictionary.Word.CONTENT_URI, mNewValues);
```
　　一个ContentValues对象表示一行，在其内部使用HashMap来存取数据，使用表的列名作为元素的key，列的值作为元素value。
　　这个对象中的列不需要有相同的数据类型，并且如果你不想指定一个值，你能够使用`ContentValues.putNull()`方法给这列设置为null。
　　上面的代码片段没有向mNewValues中添加`_ID`列，因为这列(主键)是自动维护(自增)的。提供者会给添加到其内的每一行分配一个唯一的`_ID`值。提供者通常使用这个值来作为表的主键。

　　insert方法返回值mNewUri的格式为：
``` android
content://user_dictionary/words/<id_value>
```
　　其中`<id_value>`是这个新行的`_ID`的值。大多数提供器都能自动的识别Content URI的这种格式，然后在这个特定行上执行操作。调用`ContentUris.parseId()`方法，能够从mNewUri中获得_ID值。

<br>　　范例1：ContentValues类。
``` android
public final class ContentValues extends Object implements Parcelable {

    /**
     * 向ContentValues中添加一个数据。
     * 此方法有重载，可以添加除了character以外的七种基本数据类型。
     * 本类的特点是：key必须都是String类型的。
     */
    public void put(String key, String value);

    /**
     * 指定key从ContentValues中查找一个数据。
     */
    public Object get(String key);

}
```

<br>**更新数据**
　　要更新一行数据，就要像插入数据那样使用带有更新值的ContentValues对象，并且要像查询数据那样指定选择条件。然后使用`ContentResolver.update()`客户端方法。你仅需要给ContentValues对象添加需要更新列的值，如果要清除一列的值，把这个值设置为null即可。
　　下列代码片段把local列中所有语言为`en`的行改变为null。返回值是被更新的行数。
``` android
ContentValues mUpdateValues = new ContentValues();
String mSelectionClause = UserDictionary.Words.LOCALE +  "LIKE ?";
String[] mSelectionArgs = {"en_%"};
int mRowsUpdated = 0;
mUpdateValues.putNull(UserDictionary.Words.LOCALE);
mRowsUpdated = getContentResolver().
        update(UserDictionary.Words.CONTENT_URI, mUpdateValues, mSelectionClause, mSelectionArgs);
```
　　在调用ContentResolver.update()方法时你也要过滤用户的输入，防治恶意输入。

<br>**删除数据**
　　删除行跟获取行数据类似，你要指定想要删除的行的条件，客户端方法会返回被删除的行数。以下代码片段删除了appid列中与`user`匹配的行，并返回了被删除的行数。
``` android
String mSelectionClause = UserDictionary.Words.APP_ID + " LIKE ?";
String[] mSelectionArgs = {"user"};
int mRowsDeleted = 0;
mRowsDeleted = getContentResolver().
        delete(UserDictionary.Words.CONTENT_URI, mSelectionClause, mSelectionArgs);
```
　　在调用ContentResolver.delete()方法时，也应该过滤用户输入，以防止恶意输入。

## 提供者访问方式的替代形式 ##
　　在Android应用程序开发中，除了使用上述方法直接访问ContentProvider外，还有三种重要的提供者访问替代形式：

	1、批处理访问：你能够用ContentProviderOperation类中的方法创建一个批处理(由多个基本操作组成的集合)，然后把这个批处理应用于ContentResolver.applyBatch()方法。
	2、异步查询：你应该在一个独立的线程中做查询的动作，使用CursorLoader对象是异步方法之一。在“Loaders”指南中的例子演示怎样使用这个对象。
	3、通过Intent访问数据：虽然你不能直接给提供者发送一个Intent对象，但是你可以给提供者的应用程序发送一个Intent对象，这通常是修改提供者数据的最好方式。

　　批处理访问和通过Intent对象的修改会在以下章节中来描述。

### 批处理访问 ###
　　批处理访问方式，对于在向一个或多个表中插入大量的数据，或是执行一般的跨进程的原子化的事务性操作是很有益的。
　　要用批处理模式访问一个提供者，就需要创建一个ContentProviderOperation对象的数组，然后把这个数组分发给内容提供器的ContentResolver.applyBatch()方法。你要把这个内容提供者的authority传递给这个方法，而不是特定的Content URI，因为它允许数组中每个ContentProviderOperation对象针对不同的表来工作。一个ContentResolver.applyBatch()方法返回一个结果数组。

　　关于批处理的知识暂时缓一下，等有空闲了再专门研究。

### 通过Intent访问数据 ###
　　Intent对象能够提供给你的应用程序对内容提供者进行间接访问的能力。即使你的应用程序没有访问一个内容提供者的权限，你也拥有两种方式访问一个ContentProvider中的数据：

	-  通过激活有权限的应用程序，并获取其返回值Intent，来获得临时访问权限。
	-  通过激活有权限的应用程序，并且让用户在这个应用程序中工作，从而达到允许用户访问提供器中数据的要求。

<br>**获得临时访问权限**
　　即使你没有适当访问权限，你也能够通过给有访问权限的应用程序发送一个Intent对象来访问一个内容提供器中的数据。这需要有权限的应用程序返回给你一个包含的“URI”访问权限的Intent的对象。
　　这些针对特定的Content URI的权限会一直维持到接受它们的Activity被退出。有持久权限的应用程序通过在返回结果的Intent对象中设置以下flag来批准临时权限：

	1、读权限：FLAG_GRANT_READ_URI_PERMISSION
	2、写权限：FLAG_GRANT_WRITE_URI_PERMISSION
　　注意：这些标识只对Intent中包含的Content URI所指向的数据的授权，提供者的其他数据无效。
　　同时提供器还需要在它的清单文件中使用<provider>元素的`android:grantUriPermission`属性，以及可选的`<provider>`元素的`<grant-uri-permission>`子元素来给Content URIs定义权限。URI权限机制在“安全和权限”指南的“URI权限”一节中会更详细的进行解释。

<br>**使用另外的应用程序**
　　对于没有访问权限的应用程序要允许用户修改数据的一个简单方法时激活一个有访问权限的应用程序，并且让用户在这个应用程序中工作。
　　例如，Calendar应用程序接收`ACTION_INSERT`动作Intent对象，这个对象允许你激活这个应用程序的插入事件界面，你能够在这个Intent对象中传递附加的数据。因为周期性事件有复杂的语法，把事件插入日历提供器的首选方法是用ACTION_INSERT动作激活Calendar应用，然后让用户在那儿来插入事件。

### 合约类（Contract Class） ###
　　内容提供者的合约类用来定义一些常量，合约类里面没有任何方法。这些常量可能为内容资源标识(Content URI)、列名、Intent的Action、以及内容提供器的其他特征。合约类不会自动的跟提供器包含在一起，提供器的开发者必须定义它们，然后让它们对其他的开发者有效。Android平台包含许多提供器在`android.provider`包中都有对应的合约类。
　　例如，用户字典提供器有一个包含了内容资源标识（Content URI）和列名常量的合约类。针对`words`表的内容资源标识是常量`UserDictionary.WordsCONTENT_URI`中被定义。`UserDictionary.Words`类也包含了在这个指南的例子中使用的列名常量。如，查询投影可以像下面这样定义：
``` android
String[] mProjection = {
    UserDictionary.Words._ID,
    UserDictionary.Words.WORD,
    UserDictionary.Words.LOCALE
};
```
　　合约类是包含了针对URIs、列名、MIME类型、以及属于提供者的其他元数据的常量定义的`静态类`。这个类在提供者和其他应用程序之间建立一个契约，从而即使在实际的URI、列名等发生了改变，也能确保提供能够正确的被访问。
　　合约类对开发者也是有帮助的，因为对于它的常量都有助记的名字，因此针对列名或URIs开发者很少会使用错误的值。因为它是一个类，所以它能包含Javadoc的文档，集成开发环境（如Eclipse）能够自动完成来自合约类的常量命名并给对应常量显示Javadoc。

　　开发者不能访问来自你的应用程序的合约类的类文件，但是他们能够把来自你提供的一个`.jar`文件静态编译到他们的应用程序中。

# 第二节 创建提供者 #
　　内容提供者管理着对应用程序数据核心资源库的访问。在Android应用程序中你可以使用一个或多个类来实现一个提供者，然后将它配置到清单文件中。你要实现的类之一就ContentProvider子类，这个类是提供者跟其他应用程序之间的接口。尽管内容提供者意味着让数据对其他的应用程序有效，但是你应用程序的Activity也可以访问自己的提供者，比如允许用户查询、修改由提供者管理的数据。

## 准备工作 ##
　　在开始创建提供者之前，先做以下工作:

	1、决定是否需要一个内容提供者。如果你想要提供以下的一个或多个功能，就需要创建一个内容提供者：
	   A．你想要给其他的应用程序提供复杂的数据或文件；
	   B．你想要允许用户把复杂的数据从你的应用程序中复制到其他应用程序中；
	   C．你想要使用搜索框架提供自定义的搜索方案。
	2、认真阅读“基础知识”一节，以学习更多的有关提供器的知识。
　　如果只是在你自己的应用程序内部使用一个SQLite数据库，就不需要提供者。接下来，按照以下步骤来创建提供者：
　　1、给数据设计行存储方式。内容提供者内部用两种方式存储数据：
　　**文件数据：**
　　通常，每一个数据都被放进一个文件。比如照片、音频、或视频等。这些文件保存在你的应用程序的私有空间中。在来自另一个应用程序的对一个文件的请求响应中，你的提供者能够提供对文件的处理。
　　**结构化数据：**
　　通常，数据会被放入数据库、数组或类似结构中。使用与表（行和列的结构）兼容的格式来保存数据。一行代表一个实体，如一个人或清单中一项。一列代表行实体的某些数据，如人的名字或项目的价格。存储这种类型数据的通常方法是保存在一个SQLite数据库中，但是你能够使用任何其他持久化存储类型。有关Android系统中有效的存储类型，请看“设计数据存储”的章节。
　　2、定义一个具体的ContentProvider类的实现类和并实现对应的抽象方法。这个类是你的数据和Android系统的其他部分之间的接口。
　　3、定义提供者的authority字符串、content URIs、和列名。如果你想要这个提供者处理Intent对象，还要定义Intent动作、extras data和flags。同时还要给想要访问你的数据的应用程序定义必要的访问权限。你应该把所有的这些值作为常量定义在一个独立的合约类中，以便以后可以把这个类暴露给其他应用程序。有关content URIs的更多信息，请看“设计内容资源标识（URI）”。有关Intent对象的更多信息，请看“Intent和数据访问”。
　　4、添加其他的可选项，如示例数据或能够在提供者或基于云端数据之间同步数据的AbstractThreadedsyncAdapter的实现。

## 设计数据存储 ##
　　内容提供者是用结构化的格式来保存数据的接口。在你创建它之前，你必须决定如何存储数据。你可以使用任何你喜欢的形式存储数据，当然你也必须针对该形式设计如何对数据进行读和写操作。

　　以下是在Android平台中有效的数据存储技术：
　　1、Android系统包括了一个Android自己的用于保存面向表数据的SQLite数据库API。SQLiteOpenHelper类可以帮助您创建数据库，并且SQLiteDatabase类是访问数据库的基础类。 记住，你不必一定要使用数据库来实现的数据仓库。提供者用类似于关系性数据库的表的集合来做为外部表现，但是提供者的内部实现却不是必须的。
　　2、使用文件存储。对于此种方式，Android有各种面向文件的API。要学习更多的有关文件存储的内容，请阅读“数据存储”主题。如果你正在设计一个提供音乐或视频等多媒体相关数据的提供者，你能够把数据表和文件组合到一起。
　　3、对于基于网络数据的工作，使用java.net和android.net包中的类。你也能够把基于网络的数据同步到本地的存储中，如同步到本地一个数据库中，然后以表或文件的形式来提供数据。Sample Sync Adapter示例应用程序演示了这种同步的类型。

　　示例代码位置：http://developer.android.com/resources/samples/SampleSyncAdapter/index.html

<br>**数据设计考虑因素**
　　以下是针对设计提供者的数据结构的一些提示：

	1、表数据应该始终有一个“主键”列，提供者针对每一行维护一个唯一的数字值。你能使用这个值把本行的数据与其他表中相关行连接到一起（作为外键“foreign key”来使用）。虽然这列可以使用任意的名称，但是使用android.provider.BaseColumns._ID是最好的选择，因为它能够把提供者的查询结果跟ListView对象要求的名叫_ID的检索列关联到一起。
	2、如果你想要提供位图图片或其他的非常大的面向文件的数据，那么就要把这样的数据保存在一个文件中，然后在一个表中提供间接的而不是直接的存储（把文件的路径存储到表中）。如果你这样做了，就需要告诉用户，他们需要使用ContentResolver文件方法来访问数据。
	3、使用二进制大对象（BLOB）数据类型来保存不同尺寸或不同结构的数据。例如，你能够使用BLOB列来保存协议缓存或JSON结构。
　　你也能使用一个BLOB来实现一个独立模式的表。在这种表类型中，你定义一个主键列，一个MIME类型列，一个或多个一般的BLOB列。BLOB列中数据的累类型是通过MIME类型列中的值来指明的。这样就允许你在同一个表中每一行保存不同类型的数据。通信录的“data”表ContantsContract.Data就是一个独立模式表的例子。

## 实现ContentProvider类 ##
　　所有的内容提供者都必须派生自ContentProvider类。应用程序使用ContentResolver客户端对象访问来自ContentProvider的数据。最终调用ContentResolver对象的所有的访问形式，都会对应ContentProvider类的具体方法。
　　抽象类ContentProvider定义了六个抽象方法，你必须在你自己具体的子类中来实现这些方法。这些方法中除了onCreate()以外，都用于试图访问你的内容提供者的客户端应用程序调用。

<br>　　范例1：实现步骤。 

	-  首先，定义一个类，继承ContentProvider ，并重写抽象类中对应的方法。
	-  然后，在清单文件中，配置ContentProvider 。
	-  最后，使用ContentResolver类访问ContentProvider ，并获得ContentProvider返回的数据。 
　　创建ContentProvider的范例再前面已经写过了，这里直接配置ContentProvider。
``` android
 <provider
    android:name="com.example.androidtest.MyContentProvider"
    android:authorities="org.cxy.provider.test" />
```
　　在AndroidManifest.xml文件中的<application>标签内部配置一个<provider>标签即可。

	属性解释：
	- android:name：指出ContentProvider所对应的类。
	- android:authorities：ContentProvider的唯一标识，其他程序通过此属性的值来引用内容提供者。

　　实现ContentProvider中的抽象方法时应该考虑以下事情：

	1、所有的这些方法除了onCreate()以外，都能够同时被多线程调用，因此它们必须是线程安全的。即不论访问者是否与提供者处于同一进程中，若访问者在主线程中调用提供者的“CRUD”方法，则提供者的这些方法将会在主线程中运行，若在子线程调用则就在子线程中运行，onCreate()方法总是在主线程中调用。有关多线程的学习，请看“进程和线程”。
	2、避免在onCreate()方法中做长时操作。并且直到实际需要的时候才去执行初始化任务。有关原因会在“实现onCreate()方法”章节中进行更多的讨论。
	3、尽管你必须实现这些方法，但是你的代码除了返回预定的数据类型之外，不做任何事情。例如，你可能会想阻止其他应用程序把数据插入到某些表中，你能够通过这种方法忽略对insert()方法的调用，并且返回“0”。

<br>**实现各个方法时的注意事项**
<br>　　范例1：实现query()方法。
	-  ContentProvider.query()方法必须返回一个Cursor对象。
	-  若因为一些原因(如客户端提供的Content URI格式非法)导致查询失败时，通常你应该抛出一个异常来告诉客户端。
	-  若没有上述错误，则：
	-  若你正在使用一个SQLite数据库做为你的数据存储。
	   -  你能够通过调用SQLiteDatabase类的一个query()方法，就能简单的返回Cursor对象。 若在数据库中查询不到匹配的行，那么返回的Cursor对象的getCount()方法就会返回0。只有在查询过程期间发生了内部错误，你才应该返回null。
	-  若你不使用SQLite数据库做为数据存储，那么就要使用Cursor的一个具体子类。如，MatrixCursor类实现了每行是一个对象数组的游标，这个类用addRow()方法来添加新行。

　　记住，Android系统必须能够跨进程来传递异常。在处理的查询错误中，下列异常可用于进程间传递：

	-  IllegalArgumentException（如果提供器收到一个无效的Content URI，可以选择抛出这个异常）。
	-  NullPointerException。

<br>　　范例2：实现insert()方法。
	-  ContentProvider.insert()方法使用ContentValues参数中的值把一行新的数据添加到相应的表中。如果在ContentValues参数中没有列名，你可能是想要使用提供器代码或数据库模式来提供默认值。
	-  这个方法应该返回新插入行的Content URI。使用withAppendedId()方法给这个新行追加一个_ID(或其他主键)值。

<br>　　范例3：实现delete()方法。
	-  不要使用ContentProvider.delete()方法从你的数据存储中物理的删除行。因为如果你的提供器使用了同步适配器，你就应该使用“delete”标识来标记要删除的行，而不是把完全的删除行。同步适配器会在从提供器中删除它们之前检查要删除的行，并且从服务端删除它们。

<br>　　范例4：实现update()方法。
	-  ContentProvider.update()方法需要与insert()方法使用的相同的ContentValues参数，以及与delete()方法和query()方法相同的selection和selectionArgs参数。这种方法允许你在这些方法之间重用代码。

<br>　　范例5：实现onCreate()方法。
	-  Android系统会在提供器启动时调用ContentProvider.onCreate()方法。你只应该在这个方法中执行快速的初始任务，并且要把数据库的创建和数据的装载延迟到提供器接收到实际的数据请求之后。如果在你onCreate()方法中你执行了长时任务，会降低提供器的启动速度，从而降低提供器对其他应用程序的响应速度。
	-  SQLite数据库的SQLiteOpenHelper类就遵循了这种懒初始化的原则。

## 设计Content URIs ##
　　ContentProvider类的每个数据访问方法都要有一个Content URI做为参数，这样就允许你来决定要访问的表、行或文件，因此应该规范化的设计Content URIs。

<br>**设计权限(Designing an authority)**
　　通常，提供者会有一个单一的`authority`作为它在Android内部的名字。为了避免跟其他提供器的冲突，你应该使用倒写的域名作为你的提供者的authority。因为这个建议对Android包名也是适用的，因此你能使用包含提供者的包的名的扩展来定义你的提供者的authority。例如，如果你的Android包名是`com.example.<appname>`，那么应该给你的提供者authority是`com.example.<appname>.provider`。 

<br>**设计路径结构(Designing a path structure)**
　　通常，开发者通过把指向单个表的路径附加到authority尾部来创建内容资源标识（URI）。例如，如果你有两个表：table1和table2，你把这两个表跟前面的例子的authority组合，就会产生以下内容资源标识：
　　`com.example.<appname>.provider/table1`和`com.example.<appname>.provider/table2`。路径不限于单一表的部分，不是每个路径级别都要有一个表。

<br>　　范例1：访问ContentProvider。
``` android
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		
        // 调用Context类中的方法,获取一个ContentResolver对象。
        ContentResolver c =  this.getContentResolver();
        c.insert(Uri.parse("content://org.cxy.provider.test/tab1"), null);
    }
}
```

	语句解释：
	-  在Android操作系统内部中记录了各个应用程序定义的ContentProvider ，在程序中可以通过一个Uri来指出想要访问ContentProvider 。
	-  使用Uri类可以将一个字符串解析成一个Uri对象。
	   -  Uri的格式：“content://内容提供者的android:authorities属性值/路径”。
	-  注意：内容提供者的Uri必须以“content://”开头。
	-  本范例中ContentResolver会调用com.example.test.provider的insert方法。
	-  若在系统中注册了多个android:authorities属性具有相同值的ContentProvider ，则Android系统会调用第一个被找到的ContentProvider。

　　不论客户端调用提供者“CRUD”中的哪类操作，都需要提供一个Content URI，用来告知提供者其所要操作的表。 提供者为了确保客户端传递的URI格式的合法性，需要进行必要的验证。

<br>　　范例2：UriMatcher类。
``` android
public class UriMatcher extends Object {

    /**
     * UriMatcher类用于匹配某个Uri是否满足它的要求。
     * 内容提供者事先向UriMatcher类中添加若干个合法的Uri格式，然后提供者可以把insert、delete等方法中接到的Uri
     * 传递给UriMatcher类进行验证Uri的合法性。
     * @param code: 若用户指定Uri和UriMatcher内所有的Uri都失配时则返回此code 。
     * 
     */
    public UriMatcher(int code);

    /**
     * 向UriMatcher类中添加一个authority和path。
     * @param authority: 提供者的authority
     * @param path: 提供者所支持的path
     * @param code: 当进行匹配的时候，若该Uri和此项匹配成功则返回code
     */
    public void addURI(String authority, String path, int code);

    /**
     * 匹配指定的uri，待匹配uri必须是以“content://”开头。否则无法匹配成功。
     * 在UriMatcher中预先保存的Uri可以使用通配符：
     *     # ：任意数字。 注意 # 必须要在一个单独“/”后面使用。
     *     * ：任意字符。
     * 若Uri为“content://www.cxy.cn/person/5”且UriMatcher预先调用了addURI (“www.cxy.cn”, “person/#”, 1)，
     * 则当调用UriMatcher类的match方法pipei后，将返回1 。
     * @param uri: 要匹配的Uri
     * @return 匹配结果。
     */
    public int match(Uri uri);

}
```

<br>　　范例3：服务端的MyContentProvider类。
``` android
public class MyContentProvider extends ContentProvider {

    public static final int LOST = -1;
    public static final int OPER_ALL = 10;
    public static final int OPER_ONLY = 11;
    private UriMatcher matcher;
    // 创建一个SQLiteOpenHelper对象，用于操作数据库 。
    private SQLiteOpenHelper dbc = new SQLiteOpenHelper(this.getContext(), "data.db", null, 1) {
        public void onCreate(SQLiteDatabase db) {
            db.execSQL("CREATE TABLE person(id integer primary key,name)");
        }
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) { }
    };

    public boolean onCreate() {
        // 若匹配失败,则返回lost 。
        matcher = new UriMatcher(LOST);
        // 向matcher中添加模版uri。
        matcher.addURI("org.cxy.provider.test", "person", OPER_ALL);
        matcher.addURI("org.cxy.provider.test", "person/#", OPER_ONLY);
        return false;
    }
	
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        // 接到客户端的请求后，先验证客户端传递过来的Uri是否合法。
        int result = matcher.match(uri);
        SQLiteDatabase conn = null;
        switch(result){
            case OPER_ONLY:
                conn = this.dbc.getWritableDatabase();
                long id = ContentUris.parseId(uri);
                StringBuilder where = new StringBuilder();
                where.append(" id = ").append(id);
                if(selection != null && !selection.trim().equals("")){
                    where.append(" AND ").append(selection);
                }
                return conn.delete("person",where.toString() , selectionArgs);
            case OPER_ALL:
                conn = this.dbc.getWritableDatabase();
                return conn.delete("person", selection, selectionArgs);
            default:
                throw new IllegalArgumentException("Uri not Found!");
        }
    }

    public Uri insert(Uri uri, ContentValues values) {
        System.out.println("insert " + uri);
        return null;
    }

    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }

    public Cursor query(Uri uri, String[] projection, String selection, 
            String[] selectionArgs, String sortOrder) {
        return null;
    }

    public String getType(Uri arg0) {
        return null;
    }

}
```

	语句解释：
	-  数据库相关的知识将在后面章节详细讲解。
	-  在用户程序中访问其他程序的内容提供者时，若该内容提供者所在的程序当前在操作系统中没有运行，则操作系统会自动运行那个程序，以保证数据能顺利的提供给访问者。

<br>**内容资源标识模式(Content URI patterns)**
　　为帮助你对输入的ContentURI选择合适动作（Action），内容提供器API提供了UriMatcher类，它把内容资源标识(Content URI)模式映射成一个整数值。你能够在switch语句中使用这个整数值，给内容资源标识或跟特定模式匹配的资源标识选择需要的动作。
　　以下是资源标识（URI）中使用的通配符：

	1、* ：跟任意长度、任意有效的字符串匹配。
	2、# ：跟任意长度的数字字符串匹配。

　　下面列出一个设计和编码内容资源标识(URI)处理的一个例子，一个带有authority为com.example.app.provider的提供器，能够识别下列指向表的资源标识：

	1、content://com.example.app.provider/table1: 指向一个叫做table1的表；
	2、content://com.example.app.provider/table2/dataset1: 指向一个叫做dataset1的表.
	3、content://com.example.app.provider/table2/dataset2:指向一个叫做dataset2的表；
	4、content://com.example.app.provider/table3:指向一个叫做table3的表。

<br>　　范例1：匹配所有URI。
``` android
content://com.example.app.provider/*
```

	语句解释：
	-  若把此URI预先装入到UriMatcher对象中，则客户端传来的任何com.example.app.provider的Uri都将被成功匹配。

<br>　　范例2：部分匹配。
``` android
content://com.example.app.provider/table2/*
```

	语句解释：
	-  这个URI会和dataset1表和dataset2表匹配，但是不会和table1或table3匹配。

<br>　　范例3：匹配数字。
``` android
content://com.example.app.provider/table3/#
```
	语句解释：
	-  这个URI会和表table3中的某一行匹配。如
	-  如果客户端传来的Uri为：content://com.example.app.provider/table3/6 ，则会匹配成功。它指定了匹配数据是表table3的ID是6的行。

　　这个提供器也识别那些在URI尾部追加了行ID的资源标识，例如：content://com.example.app.provider/table3/1 指定了表table3中ID是1的行。

## 提供者权限 ##
　　在“安全和权限”的专题中全面详细的描述了有关Android系统的权限和访问。“数据存储”的专题也描述了安全和权限对各种存储类型的影响。因此以下简要介绍几个重点内容：

	1、默认情况下，保存在设备内部存储器上的数据文件是你的应用程序和提供器私有的；
	2、你创建的SQLiteDatabase数据库对你的应用程序和提供者是私有的；
	3、默认情况下，保存在外部存储器(如sd卡)中数据文件是公有的，你不能使用内容提供者来限制访问外部存储器中的文件，因为其他的应用程序能够使用其他的API调用来读/写它们；
	4、如果你使用一个内部文件或数据库作为你的提供者的资源库，并且给予它“world-readable”或“world-writeable”的访问权限，那么你在它清单文件中给提供者设置的权限将不会保护你的数据。对于内部存储器中的文件和数据库的默认访问时“私有的”，针对你的提供者的存储器，你不应该改变这种默认设置。

　　如果你想要使用内容提供者的权限来控制对你的数据的访问，那么你就应该把你的数据保存在内部文件、SQLite数据库或云端（如远程服务器）中，并且应该保持这些文件和数据库对你的应用程序私有。

### 实现权限 ###
　　即使底层数据是私有的，所有的应用程序也能够通过你的提供者进行读写操作，因为默认情况下，你的提供者没有权限设置。要改变这种情况，在你的清单文件中使用`<provider>`元素的属性或子元素给你的提供者设置权限。你能够设置应用于整个提供者的权限，或者针对某个表的权限，甚至是针对某个记录的，或者三者皆有。

　　你能够在清单文件中用一个或多个`<permission>`元素给你的提供者定义权限。要使权限对你的提供者唯一，就要对`android:name`属性使用Java风格的作用域。例如，设置读权限：com.example.app.provider.permission.READ_PROVIDER。

　　总体的步骤为：

	-  首先，在提供者所在的应用程序中，定义一个权限。
	-  然后，注册提供者时，设置<provider>标签permission的属性。
	-  最后，在访问者所在的应用程序中使用<uses-permission>标签申请权限。

<br>　　范例1：定义读权限。
``` android
<permission android:name="com.example.app.provider.permission.READ_PROVIDER"/>
```
	语句解释：
	-  当应用程序想自定义权限时，只需要在AndroidManifest.xml文件中，使用标签<permission>定义一个权限，这个权限将被注册到Android系统中。
	-  关于权限的更多知识将在后面章节详细介绍。

<br>　　范例2：限制访问者必须具备权限。
``` android
<provider
   android:name=".MyContentProvider"
   android:authorities="cxyzy"
   android:permission="com.example.app.provider.permission.READ_PROVIDER"/>
```
	语句解释：
	-  通过为<provider>标签permission的属性设定值来要求访问者所在的应用程序所必须具有的权限。 

<br>　　范例3：使用权限。
``` android
<uses-permission android:name="com.example.app.provider.permission.READ_PROVIDER" />
```
	语句解释：
	-  在访问者所在的应用程序中，需要使用<uses-permission>标签来告诉Android系统，其所想要使用的权限。
	-  由于只有被注册到Android系统的权限，其他用用程序才可以通过<uses-permission>标签去申请，因此，如果在提供者所在的应用程序中，并没有使用<permission>标签定义权限，仅仅是在<provider>标签的permission属性上指定了权限，则其他应用程序是无法访问此提供者的，即便该应用程序使用了<uses-permission>标签。
	-  若应用程序没有访问其他应用程序中的提供者的权限，且试图访问，则运行时会抛出异常。

### 权限的作用域 ###
　　下面描述了提供者权限的作用域，从应用于整个提供者的权限开始，逐步变的更细的权限。更细作用域的权限总是优先于比它作用域大的权限：

<br>　　**单一的提供者级别的读写权限：**
　　控制整个提供者读写访问的一个权限，这个权限在`<provider>`元素的`android:permission`属性中指定。拥有了其所要求的权限，就可以对提供者进行“读写”操作。前述的实现权限的方式就是此种。

<br>　　**分开的提供者级别的读写权限：**
　　针对整个提供者，有一个读权限和一个写权限。
　　你可以分别使用`<provider>`元素的`android:readPermission`和`android:writePermission`属性来指定。它们优先于通过android:permission属性权限要求。
　　若提供者仅设置了`android:readPermission`属性，则不会限制客户端进行“写”操作。
　　若提供者仅设置了`android:writePermission`属性，则不会限制客户端进行“读”操作。
　　若同时提供了`android:permission`和`android:writePermission`属性，并且户端仅拥有android:permission所指定的权限，但是没有android:writePermission属性指定的权限，那么客户端仅可以对提供者进行读操作。

<br>　　**路径级别的权限：**
　　针对你的提供者的一个Content URI的读、写或读写权限。
　　你用`<provider>`元素的`<path-permission>`子元素来指定你想要控制的每个URI。 对于你指定的每个Content URI，你能够指定读写权限、读权限、或写权限，或者所有三个权限。
　　读和写的权限要优先于读写权限。同时，路径级别的权限也优先于提供给器级别的权限。

<br>　　**临时权限：**
　　即使应用程序没有通常要求的权限，但是也可以给应用程序授予临时访问的权限级别。这种临时访问权限的特征减少了应用程序必须在清单文件中申请权限的数量。
　　当你打开临时权限时，应用程序只对那些持续访问的数据才需要提供器的“持久”权限。

　　如果你要实现一个电子邮件提供者和电子邮件应用程序，且想要允许一个外部的图片查看器不需要任何权限就能够进行必要的访问你的提供者中的图片附件就需要这样的设计：当在用户想要显示一张照片时，邮件应用程序能够发送一个包含照片的资源标识（URI）和权限标记的Intent对象给这个图片查看器。然后，这个图片查看器就能查询电子邮件提供器，获取照片，即使这个查看器没有通常的提供器的读权限。

　　整体的授权步骤：

	-  首先，在客户端应用程序中发送一个Intent对象，启动提供者所在的应用程序某个应用程序组件（如Activity）。
	-  然后，提供者所在应用程序对其内的提供者是有完全的读写权限的，它可以构建一个Intent对象，并在Intent中设置要授权的Uri，然后将Intent返回给客户端。
	-  最后，客户端接到Intent后，取出那个Uri，即可直接访问提供者的数据。

<br>　　范例1：客户端发送Intent。
``` android
public void onClick(View v) {
    // 打开提供者所在应用程序的某个Activity。
    Intent intent = new Intent(); 
    intent.setAction("cxy.content.activity"); 
    startActivityForResult(intent, 1);  
}

// 从返回值中取出Uri，并开始访问。
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if(resultCode == RESULT_OK && requestCode == 1){
        // 直接对返回来的Uri进行操作。
        getContentResolver().insert(data.getData(), new ContentValues());
    }
}
```
	语句解释：
	-  关于Intent的具体知识将在后面章节中详细讲解。

<br>　　范例2：服务端进行授权。
``` android
public class MyActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent data = new Intent();
        data.setData(Uri.parse("content://cxyzy"));
        data.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        setResult(RESULT_OK, data);
        finish();
    }
}

```
	语句解释：
	-  提供者所在的应用程序若想把临时访问权限委托给另一个应用程序，则Intent对象中必须包含：FLAG_GRANT_READ_URI_PERMISSION或FLAG_GRANT_WRITE_URI_PERMISSION或二者都有。
	-  使用Intent类的setFlags()或者addFlatgs()方法设置这些flag。
	-  另外，服务端还需要把Uri设置到Intent的data属性中。

<br>　　范例3：服务端的提供者。
``` android
<provider
    android:name=".MyContentProvider"
    android:authorities="cxyzy"
    android:grantUriPermissions="true"
    android:writePermission="sdfeggr.sdfw.sd"
    android:readPermission="sdsd.dfs"
    android:permission="com.example.app.provider.permission.READ_PROVIDER" />

```
	语句解释：
	-  进行临时授权有两种方式可以实现：
	   -  第一，上述这种通过Intent设置flag的方式，此种方式还要求设置<provider>元素的android:grantUriPermissions属性为true。临时权限的属性（android:grantUriPermissions）值决定了你的提供者有多少内容是可访问的。如果这个属性被设置为true，那么系统将给整个提供器授予临时权限，它会覆盖由提供器级别或路径级别所申请其他任何权限。
	   -  第二，给<provider>元素添加一个或多个<grant-uri-permission>子元素。
	-  如果属性android:grantUriPermissions被设置为false，那么你就必须给<provider>元素添加<grant-uri-permission>子元素。每个子元素指定要授予临时访问权限的一个或多个Content URI。 如果android:grantUriPermissions属性没有出现，那么就会假设它的值是false。
	-  删除提供者与临时权限关联的Content URI时，要调用Context.revokeUriPermission()方法。

## 数据类型 ##

### 提供者数据类型 ###
　　内容提供者能够提供很多不同的数据类型。用户字典提供者仅提供了文本类型，但是提供者还能够提供以下类型：

	1、integer
	2、long integer(long)
	3、floating point
	4、long floating point(double)
　　提供者经常使用的另一种数据类型是用64KB字节数组实现的二进制大对象（BLOB）。通过查看Cursor类的“get”方法能够看到其他有效的数据类型。

　　提供者中每列的数据类型通常被列在它的文档中。对于用户字典提供者的数据类型被列在它的合约类UserDictionary.Words的参考文档中（在“合约类”一节中介绍合约类的概念）。也可以通过调用`Cursor.getType()`方法来判断数据类型。

### MIME类型参考 ###
　　提供者也维护每个Content URI中定义的MIME数据类型信息。你能够使用MIME类型信息来判断应用程序是否能够处理提供者提供的数据，或者给予MIME类型来选择处理的类型。通常当你使用一个包含复杂的数据结构或文件的提供者来工作时，就需要使用MIME类型。例如，通信录提供器中的ContactsContract.Data表就使用MIME类型来标识每行中保存的通信录数据的类型。调用ContentResolver.getType()方法可以获得MIME类型对应的一个内容URI。
<br>　　内容提供器能够返回标准的MIME媒体类型，或自定义的MIME类型字符串，或者都能。MIME类型格式如下：
``` android
type/subtype
```
　　例如，现有一个已知的MIME类型`text/html`，它的type为`text`类型和subtype为`html`，如果提供器返回这种类型的资源标识（URI），就意味着使用这个URI查询，将返回 包含HTML标签的文本。
　　当然除了`text/html`这种全世界公认的MIME类型外，你也可以定义自己的MIME类型。
　　自定义的MIME类型字符串，也叫做`vendor-specific`MIME类型，它有更复杂的type和subtype值。例如：对于多行的MIME类型，type值始终是`vnd.android.cursor.dir`，对于单行MIME类型，type值始终是`vnd.android.cursor.item`。

　　通常Android内置的提供器有一个简单的子类型。如，当通讯录应用程序给电话号码创建一行时，它在这行中设置了如下MIME类型：
``` android
vnd.android.cursor.item/phone_v2
```
　　在这个MIME类型中，子类型值仅仅是简单的phone_v2。

　　其他的提供器开发者可以基于提供器的authority和表名创建它们自己的子类型。例如，一个包含列车时刻表的提供器，提供器的authority是com.example.trains，并且它包含了表Line1、Line2、和Line3。
　　针对表Line1的资源标识（URI）content://com.example.trains/Line1的响应中，提供器返回的MIME类型如下：
``` android
// 在下面的值中，左边表明这个Uri返回的是多行数据，右边表明每行数据的类型是Line1。
vnd.android.cursor.dir/vnd.example.line1
```
　　针对表Line2总第5行数据的URI：content://com.example.trains/Line2/5的响应中，提供器返回的MIME类型如下：
``` android
vnd.android.cursor.item/vnd.example.line2
```
　　大多数内容提供器都给它们使用的MIME类型定义了合约类常量。例如，通讯录提供器的合约类ContactsContract.RawContacts给一个单行的通讯录的MIME类型定义了常量CONTENT_ITEM_TYPE。

### 实现ContentProvider的MIME类型 ###
　　ContentProvider类有两个方法能够返回MIME类型：

	-  getType() 你必须给提供实现的必要的方法之一。
	-  getStreamTypes() 如果你的提供器提供了文件，那么就期望实现这个方法。

<br>**针对表的MIME类型**
　　getType()方法返回了由内容资源标识（URI）参数返回的描述数据类型的MIME格式中的一个字符串。这个URI是被模式化的而不是一个特定的URI；因此，你应该返回跟这个模式匹配的与内容资源标识相关联的数据类型。
　　对于普通的如text、HTML、JPEG等数据类型，getType()方法应该返回标准的MIME数据类型。
　　在 [IANA_MIME_Media_Types](http://www.iana.org/assignments/media-types/index.html) 上列出了这些标准的有效的MIME类型。
　　如果你的Content URI指向表数据的一行或多行，则getType()方法应该用以下Android的供应商特定的MIME格式返回一个MIME类型：

	1、类型部分：vnd
	2、子类型部分：
	|-  如果资源标识（URI）模式是针对单行数据的，使用：android.crusor.item/
	|-  如果资源标识（URI）模式是针对多行数据的，使用：android.cursor.dir/
	3、指定提供器部分：vnd.<name>.<type>
　　你要提供`<name>`和`<type>`这两部分内容。`<name>`的值应该是全局唯一的，并且`<type>`的值应该相对URI模式是唯一的。对于`<name>`使用你的公司名或你应用程序的Android包名是一个好的选择，对于`<type>`使用跟URI关联的标识表的字符串是一个好的选择。
　　例如，如果一个提供器的authority是com.example.app.provider,并且它要暴露的表被命名为table1，那么对于table1中多行的MIME类型是：
``` android
vnd.android.cursor.dir/vnd.com.example.provider.table1
```
　　对于table1的单行的MIME类型是：
``` android
vnd.android.cursor.item/vnd.com.example.provider.table1
```

<br>**针对文件的MIME类型**
　　如果你提供器提供了文件，那么就要实现getStreamTypes()方法。这个方法返回一个针对文件的MIME类型字符串数组，这个数组包含了你的提供器能够返回给内容资源标识的文件的文件类型。你应该通过MIME类型过滤器参数来过滤你提供的MIME类型，以便只返回那些客户端想要处理的MIME类型。
　　例如，一个提供`.jpg`、`.png`、`.gif`图片格式的提供器，如果一个应用程序调用带有`image/*`（任意格式的图片）过滤字符串的ContentResolver.getStreamTypes()方法，那么ContentProvider.getStreamTypes()方法就应该返回以下数组：
``` android
{ "image/jpeg", "image/png", "image/gif"}
```
　　如果应用程序只对.jpg文件感兴趣，那么调用调用带有过滤字符串的`*\/jpeg`的ContentResolver.getStreamTypes()方法，ContentProvider.getStreamTypes()方法就应该以下结果：
``` android
{"image/jpeg"}
```
　　如果你的提供不提供过滤字符串中请求的MIME类型，那么getStreamTypes()方法应该返回null。

## 其他相关 ##
### provider元素 ###
　　像Activity和Service组件一样，ContentProvider子类必须在它的应用程序的清单文件中使用`<provider>`元素来定义。Android系统要从这个元素中获取以下信息：

	1、授权（android:authorities）：在系统中标识整个提供器的符号名。
	2、提供器类名(android:name)：这个类实现了ContentProvider抽象类。
	3、权限：指定其他应用程序要访问这个提供器的数据所必须有的权限的属性：
	   -  android.grantUriPermssions：临时权限标识；
	   -  android.permission:单一的提供器范围的读写权限；
	   -  android.readPermission:提供器范围的读权限；
	   -  android.writePermission:提供器范围的写权限。
　　权限和它们相应的属性在“实现内容提供器权限”一节中进行了详细的描述。

<br>**开启和控制属性**
　　以下这些属性决定了Android系统以何种方式在什么时候启动提供者，以及提供者的处理特点和其他的一些运行时设置：

	1、android:enabled：是否允许系统启动提供器的标识。
	2、android:exported：是否允许其他的应用程序使用这个提供器的标识。
	3、android:initOrder：这个提供器相对与相同进程中的其他提供器的启动顺序。
	4、android:multiProcess：是否允许提供器跟调用它的客户端在同一进程中启动。
	5、android:process：提供器应该运行的进程的名字。
	6、android:syncable：指明提供器的数据是否要跟服务端的数据同步的标识。
　　在`<provider>`元素的开发指南专题中完整的介绍了这些属性。

<br>**信息属性**
　　针对提供器的一个可选的图标和标签：

	1、android:icon：包含了这个提供器的资源图标。这个图标显示在Setting > Apps > All的应用列表中提供器标签旁边。
	2、android:label：描述提供器或它的数据的一个信息标签。这个标签显示在Setting > Apps > All的应用列表中。
　　在`<provider>`元素的开发指南专题中完整的介绍了这些属性。

### Intent对象和数据访问 ###
　　应用程序能够使用Intent对象间接的访问一个内容提供者。应用程序不调用任何的ContentResolver或ContentProvicer方法，相反，它会给启动它的Activity发送一个Intent对象，这个Intent对象通常是提供自己应用程序的一部分。目标Activity负责获在它的UI中获取和显示数据。依赖Intent中的动作，目标Activity也可以提示用户来修改提供器的数据。Intent对象也可以包含目标Activity在UI中显示的附加数据，然后用户在使用它来修改提供器中的数据之前有改变这个数据的选项。
　　你可能想使用Intent对象的访问来帮助确保数据的完整性。你的提供器可能依赖于严格定义的商务逻辑来插入、更新、删除数据。如果是这样，那么允许其他应用程序直接修改数据可能会导致无效的数据。如果你想要开发者使用Intent对象进行访问，就一定要有详细的文档，向他们解释在自己的应用程序的UI中使用Intent对象访问为什么会比用代码来修改数据更好。

　　处理一个希望修改提供器数据的输入性Intent对象不同与处理其他的Intent对象，在“Intents和Intent过滤器”的专题中你能够学到更多的有关使用Intent对象的知识。

# 第三节 内容监听者 #
　　内容监听者（ContentObserver）：用于监听某个内容提供者中的数据。当内容提供者的数据被改变时，内容监听者会得到一个通知。

　　应用场景：用户程序中提供的“短信黑名单”功能。
　　用户程序需要监听系统内置的“短信程序”的内容提供者，当“短信程序”接收到新短信时，会调用内容提供者将短信插入到数据库文件中。由于内容提供者的数据被改变，所以用户程序中的内容监听者就可以接到通知，然后就可以通过内容提供者再将数据取出来，查看发信人是否在“短信黑名单”中。若是，则就通过“短信程序”的内容提供者，将新短信从数据库中删除。 

　　一个类若继承了`ContentObserver`类，则就成为了一个内容监听者。ContentObserver类仅仅提供了当内容提供者提供的数据被改变时，所应该调用的方法。至于如何去监听内容提供者，则由ContentResolver类完成。

<br>　　范例1：监听内容提供者。
``` android
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        // 获得内容解析器。
        ContentResolver resolver = this.getContentResolver();
        Uri uri = Uri.parse("content://org.cxy.provider/person/2");
        // 创建一个ContentObserver对象。
        ContentObserver observer = new ContentObserver(new Handler()){
            // 当内容提供者提供的数据被改变时，会调用此方法。
            public void onChange(boolean selfChange) {
                System.out.println("observer改变了!");
            }
        };
        // 使用observer对象监听uri所指向的数据。 当uri所指向的数据被改变时，observer就会接到通知，
        // 并调用其onChange方法。
        resolver.registerContentObserver(uri, true, observer);
    }
}
```
	语句解释：
	-  在构造ContentObserver对象时可以提供一个Handler对象。
	-  内容监听者何时被激活则由程序控制，如范例2。

<br>　　范例2：监听内容提供者。
``` android
public class MainActivity extends Activity {
    public void onClick(View v){
        Uri uri = Uri.parse("content://org.cxy.provider/person/#");
        ContentResolver resolver = this.getContentResolver();
        resolver.notifyChange(uri, null);
    }
}
```
	语句解释：
	-  ContentObserver与内容提供者之间是通过ContentResolver类建立联系的。
	-  在使用registerContentObserver方法注册监听器的时候，参数uri中不要包含通配符。而在使用notifyChange方法向所有监听者发送信息时，所使用的uri中可以包含通配符。
	-  本范例中的“content://org.cxy.provider/person/#”会将通知发送给监听了“/person”和“/person/#”上的所有ContentObserver 。
	-  假设在应用程序B中监听了应用程序A中的内容提供者。则当A发送出数据更新的通知时，若应用程序B当前并没有运行，则B将无法接到A的通知。

<br>　　范例3：监听发件箱。
``` android
public class MainActivity extends Activity {
    public void onClick(View v){
        // 获得内容解析器。
        ContentResolver resolver = this.getContentResolver();
        Uri uri = Uri.parse("content://sms");
        // 创建一个ContentObserver对象。
        ContentObserver observer = new ContentObserver(null){
	        public void onChange(boolean selfChange) {
                    Uri uri = Uri.parse("content://sms/outbox");
                    ContentResolver cr = getApplicationContext().getContentResolver();
                    Cursor c = cr.query(uri, null, null, null, " _id desc ");
                    if(c.moveToNext()){
                        StringBuilder sb = new StringBuilder();
                        sb.append("_id="+c.getLong(c.getColumnIndex("_id")));
                        sb.append(",address="+c.getString(c.getColumnIndex("address")));
                        sb.append(",body="+c.getString(c.getColumnIndex("body")));
                        sb.append(",time="+c.getLong(c.getColumnIndex("date")));
                    }
	        }
        };
        // 使用observer对象监听uri所指向的数据。
        resolver.registerContentObserver(uri, true, observer);
    }
}
```
	语句解释：
	-  监听短信的收发所需要使用的Uri为：content://sms 。
	-  查看发件箱中的短信：content://sms/outbox 。
	-  查看收件箱中的短信：content://sms/inbox 。 
	-  短信数据库中各个字段的含义：
	   -  _id ：当前短信在表中的编号。   address ：当前短信的发件人手机号。
	   -  body ：当前短信的正文。       date：当前短信的发送时间，long型的数字。
	   -  type ：标识短信的类型，1为发送出去的短信，2为接收到的短信。
	-  读取用户短信需要使用到一个权限：
	   -  <uses-permission android:name="android.permission.READ_SMS"/>
