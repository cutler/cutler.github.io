---
title: "Cocos2dx篇　第四章 基础入门"
date: 2014-12-16 22:15:42
comments: true
categories: 游戏开发
---
　　所谓工欲善其事必先利其器，深刻的了解并大范围的覆盖了官方的`API`的使用方法，对于开发、调试来说无疑是有很大益处的。 笔者可以毫不负责任的说，开发其实就是`逻辑+API`。API掌握的越多、逻辑思维越厉害，开发也就越轻松。

　　注意：

	-  在下面的章节中所列出的API是没有前后顺序的，可以相互交叉着来看。
	-  本章仅仅将quick中常用的API列出，以便可以正常进行游戏开发工作，而更详细的API文档请参阅quick的安装目录下的/docs/api/index.html文件。

　　再次声明，quick-cocos2d-x是对Cocos2d-x + lua的增强版，因此其提供的大部分API的名称和Cocos2d-x的是相同的。

# 第一节 面向对象程序设计 #
　　本节将介绍如何在quick中创建、导入类，因为`类是游戏开发的基本单元`，熟练掌握了类相关的基本语法是进一步学习的前提。而当创建完quick类后，我们就可以开始在类的内部写游戏相关的代码了。

## 创建Lua类 ##
　　在`quick`中为我们提供了一个工具方法“`class`”，可以帮助我们方便的创建自己的类。
　　源码地址：`你的项目的本地路径/src/framework/functions.lua`

<br>　　范例1：class()。
``` lua
-- 定义名为 Shape 的基础类
local Shape = class("Shape")
-- ctor() 是类的构造函数，在调用 Shape.new() 创建 Shape 对象实例时会自动执行此方法
function Shape:ctor(shapeName)
    self.shapeName = shapeName
    -- printf函数是quick对lua中的print函数进行的封装，让它可以支持%s等C语言的占位符。
    printf("Shape:ctor(%s)", self.shapeName)
end
-- 为 Shape 定义个名为 draw() 的方法
function Shape:draw()
    printf("draw %s", self.shapeName)
end
```
    语句解释：
	-  使用class()函数来创建一个类。
	   -  具体的格式为： class(类名, [父类])。
	-  创建类时，class()函数会做以下操作：
	   -  为该类创建一个super属性，并使其指向父类(如果有的话)。
	   -  为该类创建一个new()函数，以便可以通过该方法实例化该类的一个实例。
	   -  为该类创建一个ctor()函数，它相当于一个构造方法，当调用new()函数时，new()函数会将它的所有参数传递给ctor()。

<br>　　范例2：创建有父类的类。
``` lua
-- Circle 是 Shape 的子类
local Circle = class("Circle", Shape)
function Circle:ctor()
    -- 如果继承类覆盖了 ctor() 构造函数，那么必须手动调用父类构造函数
    -- 类名.super 可以访问指定类的父类
    Circle.super.ctor(self, "circle")
    self.radius = 100
end
function Circle:setRadius(radius)
    self.radius = radius
end
-- 覆盖父类的同名方法
function Circle:draw()
    printf("draw %s, radius = %0.2f", self.shapeName, self.radius)
end
```
    语句解释：
	-  lua是自上至下的执行lua文件中的每行代码，因此范例1、2、3的代码要保存在同一个文件中，这样范例2、3才可以顺利的引用到它前面所定义的类。

<br>　　范例3：矩形类。
``` lua
local Rectangle = class("Rectangle", Shape)
function Rectangle:ctor()
    Rectangle.super.ctor(self, "rectangle")
end
```
　　测试代码：
``` lua
local circle = Circle.new()            -- 输出: Shape:ctor(circle)
circle:setRadius(200)
circle:draw()                          -- 输出: draw circle radius = 200.00
local rectangle = Rectangle.new()      -- 输出: Shape:ctor(rectangle)
rectangle:draw()                       -- 输出: draw rectangle
```
    语句解释：
	-  对于子类来说，在ctor()函数中必须要调用“子类.super.ctor()”预先初始化父类。

<br>　　范例4：函数作为父类。
``` lua
-- 创建一个CCScene类的子类
local MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)
-- 构造方法
function MainScene:ctor()
end
return MainScene                      -- 输出: draw rectangle
```
    语句解释：
	-  此种写法在以后也会经常见到，class()函数的第二个参数可以是一个函数，即将函数的返回值视为父类。

## 导入Lua类 ##
　　通常一个lua文件中只会定义一个类，这就涉及到如何在一个类中引用其他类。quick也提供了一个工具方法。

<br>　　范例1：import()函数。
　　描述：import() 与 require() 功能相同，但具有一定程度的自动化特性。假设我们有如下的目录结构：
``` lua
-  src
   -  app
      -  a.lua
      -  scenes
         -  b.lua
   -  app2/
-- 并且程序已经执行过了package.path = package.path .. ";src/"
```

　　require的缺点在于：

	-  加载模块时会将其参数与package.path变量的每一个路径相结合，然后去该路径中去查找，一旦成功则立刻返回。
	-  因此在“a.lua”中加载“b.lua”文件可以写为：require("app.scenes.b") ，即用“.”来表示目录层级。
	-  假如我们将a.lua及其相关文件(scenes目录、b.lua文件)换到“app2”中存放，那么就必须修改a.lua中的 require() 命令为require("app2.scenes.b")，否则将找不到模块文件。
　　但使用 import()，我们只需要在a.lua中如下写：
``` lua
require(".scenes.b")
```
　　语句解释：

	-  当在模块名前面有一个“.”时，import() 会从当前模块所在目录中查找其他模块。
	-  因此a.lua及其相关文件不管存放到什么目录里，只要它们之间的相对位置是不变的，我们都不需要修改import() 命令。这在开发一些重复使用的功能组件时，会非常方便。
	-  当模块前面有两个“.”时，从当前模块所在父目录那一层中查找其他模块。

　　不过 import() 只有在模块级别调用（也就是没有将 import() 写在任何函数中）时，才能够自动得到当前模块名。如果需要在函数中调用 import()，那么就需要指定当前模块名：
``` lua
-- a.lua
 
-- 这里的 ... 是隐藏参数，包含了当前模块的名字，所以最好将这行代码写在模块的第一行
local CURRENT_MODULE_NAME = ...
 
local function testLoad()
    local MyClassBase = import(".MyClassBase", CURRENT_MODULE_NAME)
    -- 更多代码
end
```

<br>　　范例2：文件加载。

	-  值得注意的是，import与require一样，都会判断是否文件已经加载，从而避免重复加载同一文件。这意味着，如果先在文件B中import文件A，导致文件A被加载入内存后，若在文件C中再次import文件A，则会直接使用已存在的文件A。
	-  因此，不要误认为每import一次文件就会创建出一个该文件的实例，创建对象的正确方式是用过class函数来实现。
	-  另外一个注意的地方是，当再次import文件时，该文件内定义的局部变量的值并不会清空。

<br>　　范例3：动态更新。
　　游戏开发完成后，下个任务就是如何实现游戏的动态更新了。 即让玩家在不下载安装包(apk等)的情况下更新游戏的内容。  
　　本质上游戏更新只涉及到两个方面，而这两方面的更新在quick中都是十分容易实现的：

	-  lua脚本的更新。
	   -  脚本的更新就是利用import和require只会加载一次lua文件的特性。
	-  图片资源的更新。

　　更新的大致流程是：

	-  首先，在游戏中定时（如每5分钟一次）调用某个服务器接口，将本地的版本信息传递给服务端，服务端进行比较，然后将新的脚本或图片返回给客户端。
	-  客户端下载完脚本后，执行如下代码，将已存在于内存中的文件清除，然后在加载最新的文件。

　　具体的代码回来补上，因为笔者还没有在quick3.x版本中进行版本更新，之前的游戏都是在quick2.2.5版本上进行的。

## 创建Model类 ##
　　在quick中，任何一个model类都应该继承`cc.mvc.ModelBase`类，它是`quick`为我们封装好的，遵循`mvc`结构的公共基类。这里所说的`Model`类等价于`Java`中的`JavaBean`，本节将从`ModelBase`的用法开始讲起。

<br>　　范例1：最简单的Model类。
``` lua
local User =  class("User", cc.mvc.ModelBase)
-- 定义属性
User.schema = clone(cc.mvc.ModelBase.schema)
User.schema["nickname"] = {"string"} -- 字符串类型，没有默认值
User.schema["age"] = {"number", 1} -- 数值类型，默认值 1
User.schema["isBoy"] = {"boolean", true}

function User:ctor(properties)
    -- 此处不能把super.ctor写成super:ctor
    User.super.ctor(self,properties)
end
return User
```
    语句解释：
	-  本范例定义了一个User类，它继承cc.mvc.ModelBase。
	-  “schema”属性是ModelBase定义的，它用来保存类的属性。schema内的每一个元素都是一个表，表内包含两个元素：属性的名称和数据类型。 本范例定义了三个属性：
	   -  nickname：string类型，没有默认值。
	   -  age：number类型，默认值为1。
	   -  isBoy：boolean类型，默认值为true。

<br>　　范例2：创建User对象。
``` lua
local User = import(".User")
-- 构造方法
function MainScene:ctor()
    local u = User.new({nickname="Tom",age=20})
    print(u.nickname_)
end
```
    语句解释：
	-  在调用new方法时，传递一个表即可。 
	-  在Lua中有一个编码习惯，类的成员的名称后面通常会加一个下划线(“_”)，而quick也遵循了这个规范，自动给每个属性的后面都加上了下划线，因此访问变量值的时候，需要在名称后面加下划线。
	-  通常，会为每一个属性创建getter、setter方法，以对外界隐藏“名称中包含下划线”的存在。

<br>　　在MVC设计模式中，当model中的数据发生改变时（比如玩家的血量减少），应该通过观察者的方式来通知view更新界面，ModelBase类中也提供了对其的封装。
　　提示：MVC设计模式相关知识在后面会详细介绍。

<br>　　范例3-1：事件通知——User类。
``` lua
local User =  class("User", cc.mvc.ModelBase)
-- 定义事件
User.CHANGE_NICKNAME_EVENT = "CHANGE_NICKNAME_EVENT"
-- 定义属性
User.schema = clone(cc.mvc.ModelBase.schema)
User.schema["nickname"] = {"string"} 
function User:setName(name)
    self.nickname_ = name
    -- 通知所有观察者，昵称已经改变。
    self:dispatchEvent({
        name = User.CHANGE_NICKNAME_EVENT,
        newNickname = self.nickname_
    })
end
return User
```
    语句解释：
	-  由于User类的ctor函数中只有一行调用父类ctor的语句，因此就省写了User类的ctor函数。
	-  ModelBase类的ctor函数的第一行代码给ModelBase增加了管理组件的能力。 
	   -  组件就是指的src/framework/cc.components.Component类。
	   -  User类的dispatchEvent方法是从cc.components.behavior.EventProtocol.lua中获取而来的，注意不是继承。 该方法用来发送事件，它接收一个表作为参数，表中必须要有一个name字段，表示事件的名称。在本范例中，newNickname是附加的，可有可无的字段。

<br>　　范例3-2：事件通知——MainScene类。
``` lua
local User = import(".User")
-- 构造方法
function MainScene:ctor()
    local user = User.new({nickname="Tom"})
    -- 注册观察者。
    cc.EventProxy.new(user, self)
        :addEventListener(User.CHANGE_NICKNAME_EVENT, handler(self, self.onNicknameChange_))
    user:setName("Jay")
end
-- 当昵称被修改时，回调此函数。
function MainScene:onNicknameChange_(event)
    print("name changed: ",event.newNickname)
end
```
    语句解释：
	-  本范例中使用cc.EventProxy类将User和MainScene绑定在一起。这意味着此时MainScene对象已经是User对象的一个观察者了，当User对象调用dispatchEvent方法时，MainScene对象的onNicknameChange_方法就会被调用。
	-  当MainScene被从屏幕上删除时，会自动清理它与User相关联的事件，同时不影响User对象上注册的其他事件。
	-  EventProxy.new()第一个参数是要注册事件的Model对象，第二个参数是绑定的View。
	-  本范例中使用到了handler()函数，它的作用在下一节将会详细介绍。

# 第二节 函数库 #
　　除了上一节提到的各个方法外，`src/framework`目录下还提供了众多函数库，各个库中都有工具方法，在开发中会经常使用到它们，本节将依次介绍各个函数库。

## functions ##
　　源码地址：`src/framework/functions.lua`

<br>**常用函数**

<br>　　范例1：checknumber()函数。
``` lua
print(checknumber("-4.3") + 2)
```
    语句解释：
	-  功能：检查并尝试转换参数为数值（小数或整数），如果无法转换则返回 0。
	-  该函数内部是调用的tonumber函数，tonumber原本是Lua内置函数，但内置版本在无法转换时会返回nil，这样还是需要进行后续判断。quick使用checknumber()替换了内置版本。

<br>　　范例2：checkint()、checkbool()、checktable()函数。
``` lua
-- 转换参数为整数，如果无法转换则返回 0
function checkint(value)
    return math.round(checknumber(value))
end

-- 把一个任意类型的值，转换为布尔值
function checkbool(value)
    return (value ~= nil and value ~= false)
end

-- 把一个任意类型的值，转换为表格，如果传入的值不是表格，则返回一个空表格。
function checktable(value)
    if type(value) ~= "table" then value = {} end
    return value
end
```
    语句解释：
	-  上面列出了这三个函数的源码，看源码更直观。

<br>　　范例3：clone()。
``` lua
-- 下面的代码，t2 是 t1 的引用，修改 t2 的属性时，t1 的内容也会发生变化
local t1 = {a = 1, b = 2}
local t2 = t1
t2.b = 3          -- t1 = {a = 1, b = 3} <-- t1.b 发生变化
print(t1.b)

-- clone() 返回 t1 的副本，修改 t2 不会影响 t1
local t1 = {a = 1, b = 2}
local t2 = clone(t1)
t2.b = 3          -- t1 = {a = 1, b = 2} <-- t1.b 不受影响
print(t1.b)
```
    语句解释：
	-  clone函数用来深度克隆一个值。

<br>　　范例4：添加静态字段。
``` lua
self.class.haveInstance_
```
　　self代表当前类的某一个对象，对象的`class`属性指向类本身，在`functions.lua`中的class函数有如下代码：
``` lua
function cls.new(...)
    local instance = setmetatable({}, cls)
    instance.class = cls
    instance:ctor(...)
    return instance
end
```
　　从代码上可以看出来，每次调用`new`方法时，都是创建一个空表，并将`cls`设置为空表的父表，之前也说了，同一个文件不会被加载多次，因此我们通过某个类的任何一个对象的`class`属性添加的字段，实际上都是再向该类中添加字段，即相当于Java中的静态字段。

<br>　　范例5：handler()函数。
　　功能：将 Lua 对象及其方法包装为一个匿名函数。
　　格式：`handler(对象, 对象.方法)`
　　应用场景：在 quick-cocos2d-x 中，许多功能需要传入一个 Lua 函数做参数，然后在特定事件发生时，quick就会调用传入的函数。例如触摸事件、帧事件等等（关于事件后面会具体介绍）。
``` lua
local MyScene = class("MyScene", function()
    return display.newScene("MyScene")
end)

function MyScene:ctor()
    self.frameTimeCount = 0
    -- 注册帧事件
    self:addNodeEventListener(cc.NODE_ENTER_FRAME_EVENT, self.onEnterFrame)
    self:scheduleUpdate()
end

function MyScene:onEnterFrame(dt)
    self.frameTimeCount = self.frameTimeCount + dt
end
```
　　上述代码执行时将出错，报告“`Invalid self`”，这就是因为`C++`无法识别`Lua`对象方法。因此在调用我们传入的`self.onEnterFrame`方法时没有提供正确的参数。

　　要让上述的代码正常工作，就需要使用`handler()`进行一下包装：
``` lua
function MyScene:ctor()
    self.frameTimeCount = 0
    -- 注册帧事件
    self:addNodeEventListener(cc.ENTER_FRAME_EVENT, handler(self, self.onEnterFrame))
    self:scheduleUpdate()
end
```
　　实际上，除了`C++`回调Lua函数之外，在其他所有需要回调的地方都可以使用`handler()`。

<br>　　范例6：math.round()函数。
``` lua
print(math.round(5.362)) -- 输出5
```

<br>**IO相关**

<br>　　范例1：io.readfile()函数。
``` lua
print(io.readfile("src/app/MyApp.lua"))
print(io.readfile("F:/a.txt"))
```
    语句解释：
	-  io.readfile()会一次性读取整个文件的内容，并返回一个字符串，因此该函数不适宜读取太大的文件。
	-  该函数既可以读取绝对路径，也可以读取相对路径。
	   -  相对路径总是从项目根目录下检索文件，目录的层级结构需要使用“/”来表示。以Android为例，当游戏被编译后所有的lua文件都会被放到assets目录下，因此该函数的起始目录为assets。
	-  若文件中包含中文，则你可能需要处理一下乱码问题（说白了就是只要保证文件是UTF-8编码即可）。

<br>　　范例2：io.writefile()函数。
　　功能：将内容写入文件，成功返回 true。
　　格式：`io.writefile(路径, 内容, 写入模式)`
　　“写入模式”参数决定 io.writefile() 如何写入内容，可用的值如下：

	-  “w+”: 覆盖文件已有内容，如果文件不存在则创建新文件
	-  “a+”: 追加内容到文件尾部，如果文件不存在则创建文件
　　此外，还可以在“写入模式”参数最后追加字符“`b`”，表示以二进制方式写入数据，这样在某些平台上可以避免内容写入不完整。
``` lua
print(io.writefile("src/book.txt","ABC 中国", "w+"))
print(io.writefile("F:/a.txt","ABC 中国", "w+"))
```
    语句解释：
	-  io.writefile() 默认的“写入参数”是“w+b”。
	-  本函数与io.readfile函数一样，可以接收绝对路径和相对路径。
	-  若是在Android真机上运行，可以配合device.writablePath属性，将文件写入到“/dada/dada/包名/files”目录下。如：
	   -  io.writefile(device.writablePath.."/book.txt","ABC 中国", "w+")
	-  生成的文件格式默认为UTF-8编码。

<br>　　范例3：io.pathinfo()函数。
　　功能：拆分一个路径字符串，返回组成路径的各个部分。
　　格式：`io.pathinfo(路径)`
``` lua
for p,v in pairs(io.pathinfo("C:/Programe Fils/Java/bin/javac.exe")) do
    print(p,v)
end
```
    语句解释：
	-  pathinfo()函数会返回一个map，其元素如下：
       - pathinfo.dirname  = "C:/Programe Fils/Java/bin/"
       - pathinfo.filename = " javac.exe "
       - pathinfo.basename = " javac"
       - pathinfo.extname  = ".exe"
	-  注意此函数并不会去验证这个路径所对应的文件是否存在。

<br>　　范例4：io.filesize()函数。
``` lua
print(io.filesize("src/app/MyApp.lua"))
print(io.filesize("F:/a.txt"))
```
    语句解释：
	-  返回指定文件的大小，如果失败（比如文件不存在）返回false。

<br>　　范例5：io.exists()函数。
``` lua
print(io.exists("src"))                -- false
print(io.exists("src/app/MyApp.lua"))  -- true
print(io.exists("F:/a.txt"))           -- true
```
    语句解释：
	-  测试文件是否存在，如果存在返回 true。
	-  此方法是通过只读的方式打开目标，但由于文件夹不可以被打开，因此此方法不可以验证某个文件夹是否存在。

<br>**table相关**

<br>　　范例1：table.nums()函数。
``` lua
local t = {1, 2, 3, key="123"}
print(#t)		      -- 3
print(table.nums(t))  -- 4
```
    语句解释：
	-  Lua中table的"#"操作只对依次排序的数值下标数组有效。
	-  table.nums()则计算table中所有不为nil的值的个数。

<br>　　范例2：table.keys()函数。
``` lua
local t = {"A","B",cxy="zy","C"}
print(unpack(table.keys(t))) -- 1 2 3 cxy
```
    语句解释：
	-  table.keys()函数返回指定表格中的所有键。

<br>　　范例3：table.values()函数。
``` lua
local t = {"A","B",cxy="zy","C"}
print(unpack(table.values(t))) -- A B C zy
```
    语句解释：
	-  table.values()函数返回指定表格中的所有值。

<br>　　范例4：table.merge()函数。
``` lua
local t1 = {"A", key="value1"}
local t2 = {"B", key="value2"}
table.merge(t1, t2)
for i,v in pairs(t1) do
    print(i,v)
end
```
    语句解释：
	-  将第二个参数表中的内容合并到第一个参数表中，如果存在同名键，则覆盖其值。
	-  程序运行将输出：
	   -  1   B
       -  key value2

<br>**string相关**

<br>　　范例1：string.htmlspecialchars()函数。
``` lua
print(string.htmlspecialchars("<html><H1>Hello World</H1></html>"))
```
    语句解释：
	-  htmlspecialchars()函数会把如下字符进行编码：
	   -  & 转换为 &amp;
	   -  " 转换为 &quot;
	   -  ' 转换为 &#039;
	   -  < 转换为 &lt;
	   -  >  转换为  &gt;
	-  程序输出：&lt;html&gt;&lt;H1&gt;Hello World&lt;/H1&gt;&lt;/html&gt;

<br>　　范例2：string.nl2br()函数。
``` lua
print(string.nl2br("Hi!\nWorld."))
```
    语句解释：
	-  将字符串中的换行符转换为 HTML 换行标记。

<br>　　范例3：string.text2html()函数。
``` lua
print(string.text2html("<Hello>\nWorld"))
```
    语句解释：
	-  此方法除了转换特殊字符和换行符外，还会将制表符“\t”替换为空格，再将空格替换为“&nbsp;”，具体请参阅源码。
	-  程序输出：&lt;Hello&gt;<br />World

<br>　　范例4：string.split()函数。
``` lua
print(unpack(string.split("1,2,3",",")))
```
    语句解释：
	-  分割字符串。 string.split(要分割的字符串, 分隔符)

<br>　　范例5：string.ltrim()、string.rtrim()、string.trim()函数。
``` lua
s = " Lua "
print("'"..string.ltrim(s).."'")    -- 'Lua '
print("'"..string.rtrim(s).."'")    -- ' Lua'
print("'"..string.trim(s).."'")     -- 'Lua'
```
    语句解释：
	-  删除字符串前部、尾部、两端的空白字符。

<br>　　范例6：string.ucfirst()函数
``` lua
print(string.ucfirst("1abc")) -- 1abc
print(string.ucfirst("abc"))  -- Abc
```
    语句解释：
	-  将字符串的首字母大写，若第一个字符不是字母则原样返回。


<br>　　范例7：string.utf8len()函数
``` lua
print(string.utf8len("abc张d三"))
```
    语句解释：
	-  计算 UTF8 字符串的长度，每一个中文算一个字符
	-  程序输出：6

<br>　　范例8：string.formatnumberthousands()函数
``` lua
print(string.formatnumberthousands(556156651))
```
    语句解释：
	-  将数字格式化为千分位格式。
	-  程序输出：556,156,651

<br>　　除了上面列出的函数外，`functions.lua`文件中还定义了其他有用的方法，比如`string.urlencode`、`string.urldecode`等等，具体请自行参阅源码。

## device ##
　　提供设备相关属性的查询，以及设备功能的访问，当框架初始完成后，device 模块提供的属性如下表所示。
　　源码地址：`src/framework/device.lua`

<br>　　范例1：设备的属性。
``` lua
属性名称                          描述                                       取值
device.platform             返回当前运行平台的名字                 ios、android、mac、windows
device.model	            返回设备型号                          unknown、iphone、ipad
device.language             返回设备当前使用的语言                 cn、 fr、it、gr、sp、ru、jp、en
device.writablePath         返回设备上可以写入数据的首选路径	 Android为：/dada/dada/包名/files
device.cachePath	    返回设备上可以写入数据的缓存目录	 Android为：/dada/dada/包名/files
device.directorySeparator   目录分隔符                            Android为：“/”
device.pathSeparator	    路径分隔符                            Android为：“:”
```

## shortcodes ##
　　本库中的所有函数都是对`Node`、`Sprite`、`Layer`等类提供的函数进行的二次封装。 意图是简化代码的书写。
　　源码地址：`src/framework/shortcodes.lua`

<br>　　范例1：pos()函数。
``` lua
function Node:pos(x, y)
    self:setPosition(x, y)
    return self
end
```
    语句解释：
	-  quick利用lua可以动态的向对象中添加属性和字段的特点，为它们添加了这些简化操作的方法。

## scheduler ##
　　在游戏中，经常会周期执行一些检测、操作或更新一些数据等，我们称之为`调度`。
　　在Cocos2d-x中将调度封装为类`Scheduler`(调度器)，负责以一定时间间隔触发一个给定的回调方法（`callback`），调度器的继承树如下图所示：

<center>
![Scheduler的继承树](/img/quick-cocos2d-x/quick_4_1.png)
</center>


　　与Node提供的定时器有所不同，使用Scheduler设置了定时任务后，不论游戏随后又切换了多少场景，任务最终都会被执行，因此可以在整个应用程序范围内实现较为精确的全局计时器。
　　本节要讲的`scheduler.lua`库就中的所有函数都是对`Scheduler`类的封装。
　　源码地址：`src/framework/scheduler.lua`

<br>　　范例1：延迟执行。
``` lua
local scheduler = require(cc.PACKAGE_NAME .. ".scheduler") -- 加载库
function MainScene:ctor()
    scheduler.performWithDelayGlobal(function ( ... )
        print("exec")
    end, 2)
end
```
    语句解释：
	-  默认情况下framework初始化的时候，并没有加载scheduler.lua库，因此在用之前需要手动加载它。
	-  调用scheduler.performWithDelayGlobal来安排一个任务，延迟指定秒后执行回调方法。

<br>　　范例2：定期执行与取消定时。
``` lua
local scheduler = require(cc.PACKAGE_NAME .. ".scheduler") -- 加载库
function MainScene:ctor()
    local times = 0
    local handle 
    -- 计划一个以指定时间间隔执行的全局事件回调，并返回该计划的句柄。本范例每秒会调用触发一次事件。
    handle = scheduler.scheduleGlobal(function ()
        times = times + 1
        print("times = ", times)
        if times == 3 then
            -- 取消一个全局计划。 
            scheduler.unscheduleGlobal(handle)
        end
    end, 1)
end
```
    语句解释：
	-  函数unscheduleGlobal(handle)的参数handle就是scheduleUpdateGlobal()和scheduleGlobal()的返回值。

<br>　　范例3：全局帧事件。
``` lua
local scheduler = require(cc.PACKAGE_NAME .. ".scheduler") -- 加载库
function MainScene:ctor()
    local start = os.time()
    local times = 0;
    scheduler.scheduleUpdateGlobal(function (tap)
        if os.time() == start then
            times = times + 1
            print("callback " .. times)
        end
    end)
end
```
    语句解释：
	-  帧事件就是系统在每一次渲染界面时调用指定的函数。通常一次渲染的时间很短，一秒种可能会渲染40-60次左右。
	-  帧事件也分为两种，一种是Node级别的，另一种是全局帧事件，前者在Node从屏幕上移除时就会停止执行，而后者在任何场景中都会执行，因此可以在整个应用程序范围内实现较为精确的全局计时器。
	-  该函数返回的句柄用作scheduler.unscheduleGlobal()的参数，可以取消指定的计划。

<br>　　其实上面介绍的scheduler库的方法，内部都是通过`Scheduler.scheduleScriptFunc`函数来实现的。

<br>　　范例4：`sharedScheduler:scheduleScriptFunc(listener, interval, bPaused)`函数。

	-  计划一个全局的事件回调，每间隔interval秒回调一次listener，如果interval值为0则程序在渲染每一帧的时候都会调用一次listener。
	-  如果bPaused设置为true，那么在定时器resumed之前将不会调用listener。
	-  本函数将返回定时器的id，调用unscheduleScriptFunc停止定时器时需要提供该id。

## luaj ##
　　游戏开发时有些需求是没法通过quick来实现的，比如调用手机摄像头拍照等，这时就需要让quick调用`Android`或`iOS`端的代码。 为此quick提供了两个工具：`luaj.lua`和`luaoc.lua`。

　　本库中只有一个全局函数：`callStaticMethod()`，用来在Lua端调用Java端的静态方法。
　　源码地址：`src/framework/luaj.lua`

<br>　　范例1：获取SD卡路径。
``` lua
-- callStaticMethod(类名, 方法名, 传递给方法的参数, 方法的签名)
luaj.callStaticMethod("com/cutler/helloworld/CommonUtil", "getSDCardPath", nil, "()Ljava/lang/String;")
```
    语句解释：
	-  通过luaj.callStaticMethod函数只能调用指定类的静态方法。
	-  如果方法不接收参数，则第三个参数就写“nil”，否则传递一个表。
	-  luaj需要在真机上才能正确运行，在模拟器上则会抛出luaj为nil的异常，运行时请确保项目中已经存在了com.cutler.helloworld.CommonUtil.getSDCardPath()方法。

<br>　　本质上`luaj`就是通过`NDK`来实现`lua`代码与`java`代码通信的，因此和`NDK`开发时候一样，被调用的方法的签名可以通过`javap`工具获取：

	-  在cmd中，进入到helloworld/frameworks/runtime-src/proj.android/bin/classes目录下。
	-  执行“javap -s 包名.类名”，就可以获得该类中所有函数的签名。
	-  如签名为“(i,i)V”的含义是：方法接收两个int类型的参数，返回值为void类型。
	-  而“()V”则代表方法不接受参数，V代表方法的返回值类型为void。 

<br>　　常见的对应关系如下：
``` lua
数据类型          对应值
byte               B
int                I
short              S
long               J
char               C
boolean            Z
float              F
double             D
long[]             [J
int[]              [I
Object             L
```

　　上面范例中，`getSDCardPath`方法返回`String`类型的值，因此为“`()Ljava/lang/String;`”，其中最后的分号不可以删除。

## lfs ##
　　`lfs`全称`LuaFileSystem`，它是对标准Lua库中文件读写功能的补充，它提供了统一的接口来访问不同操作系统(Windows、Linux等)的目录结构和文件属性。
　　Github地址：https://github.com/keplerproject/luafilesystem

<br>　　范例1：递归创建文件夹。
``` lua
require("lfs")
function MainScene:mkDirp(path, pathIsFile)
    local items = string.split(path,"/")
    local parentDir = ""
    for i,v in ipairs(items) do
        if pathIsFile and i == #items then
            return
        end
        parentDir = parentDir .. v .. "/"
        if not io.exists(parentDir) then
            lfs.mkdir(parentDir)
        end
    end
end

function MainScene:ctor()
	-- 在device.writablePath目录下创建文件夹
    self:mkDirp("a/b/c/a.txt", true)
end
```
    语句解释：
	-  使用lfs.mkdir()函数来创建一个文件夹。
	-  使用lfs.rmdir()函数来删除一个空文件夹。
	-  MainScene:mkDirp()的第二个参数指明当前路径是否指向一个文件，如果是则将不会创建最后一级文件夹。
	-  在Windows中device.writablePath默认就是指项目的根目录。

<br>　　范例2：文件类型。
``` lua
lfs.attributes(path, "mode")
```
    语句解释：
	-  若path指向的路径不存在，则返回nil。
	-  若path存在，且是一个文件，则返回file。
	-  若path存在，且是一个文件夹，则返回directory。

# 第三节 数据结构 #
　　本节将介绍Cocos2d-x中经常会用到的一些数据结构。

<br>　　范例1：Point。
``` lua
-- 创建Point对象
local point = cc.p(150, 200)

-- 访问Point对象的值
print(point.x, point.y) -- 输出 150, 200
```
    语句解释：
	-  cc.p()函数用来创建一个Point对象，由x, y 两个坐标值组成。

<br>　　范例2：Size。
``` lua
-- 创建Size对象
local s = cc.size(150, 100)

-- 访问Size对象的值
print(s.width, s.height) -- 输出 150, 100
```
    语句解释：
	-  cc.size()函数用来创建一个Size对象，由width, height 两个值组成。

<br>　　范例3：Rect。
``` lua
-- 创建Rect对象
local r = cc.rect(10, 10, 150, 100)

-- 访问Rect对象的值
print(r.x, r.y, r.width, r.height)
```
    语句解释：
	-  cc.rect()函数用来创建一个Rect对象，由x, y, width, height 四个值组成。

<br>　　quick 中表示颜色有三种对象：

	-  cc.c3b 用三个 0-255 的整数描述颜色，不带透明度
	-  cc.c4b 用四个 0-255 的整数描述颜色，带透明度
	-  cc.c4f 用四个 0.0 - 1.0 的浮点数描述颜色，带透明度

<br>　　范例4：三种颜色对象的创建方式。
``` lua
local color1 = cc.c3b(255, 0, 0)      -- 纯红色，三个参数分别是 Red（红）、Green（绿）、Blue（蓝）
local color2 = cc.c4b(0, 255, 0, 128) -- 50% 透明度的绿色，最后一个参数是透明度
local color3 = cc.c4f(0, 0, 1.0, 0.3) -- 30% 透明度的蓝色
```

# 第四节 显示对象 #

## Director ##
　　本节来介绍`Cocos2d-x`中非常重要的一个类，它管理整个游戏的开始、结束、暂停等，可以说它就是我们游戏的总指挥，那么它就是我们的导演类`Director`。下面让我们一起来学习一下导演类`Director`。

　　Director类是Cocos2d-x游戏引擎的核心，它用来创建并且控制着主屏幕的显示，同时控制场景的显示时间和显示方式。在整个游戏里一般只有一个导演。游戏的开始、结束、暂停都会调用Director类的方法。Director类具有如下功能：

	-  初始化OpenGL会话。
	-  设置OpenGL的一些参数和方式。
	-  访问和改变创景以及访问Cocos2d-x的配置细节。
	-  访问视图。
	-  设置投影和朝向。

　　需要说明的是：Director是单例模式，调用Director的方法的标准方式如下：

<br>　　范例1：获取单例对象。
``` lua
cc.Director:getInstance()
```

　　在Cocos2d-x里面，在游戏的任何时间，只有一个场景对象实例处于运行状态，而导演就是流程的总指挥，它负责游戏全过程的场景切换，也是典型的面向对象和分层的设计原则。下面将分别介绍Director类的成员数据和方法。

<br>　　范例2：设置显示属性。
``` lua
-- 禁止在屏幕的左下角显示FPS。
cc.Director:getInstance():setDisplayStats(false)
-- 手动指定FPS的帧率。
cc.Director:getInstance():setAnimationInterval(1.0/100)
```
    语句解释：
	-  FPS表示每秒钟屏幕刷新的次数。30FPS是一般录像的常用帧数，60是一般游戏的常用帧数。30FPS在快速动作的时候会感觉不流畅，但是60FPS对显卡的要求要高一些。如果硬件不达标的话，看60FPS反而会卡。

<br>　　范例3：游戏控制。
``` lua
-- 暂停当前场景，保存当前FPS，并暂时将FPS设为1.0f / 4.0f。
cc.Director:getInstance():pause()
-- 恢复当前暂停的场景，还原FPS到上次保存的值。
cc.Director:getInstance():resume()
```
    语句解释：
	-  在src/framework/display.lua中提供了两个方法：display.pause()、display.resume()，它们的内部实现就是用的这两行代码。
	-  我们比较常用的则是display.pause()、display.resume()。

<br>　　范例4：获取尺寸信息。
``` lua
-- 获取显示尺寸，返回一个cc.size对象。
local size = cc.Director:getInstance():getWinSize()
print(size.width .. "，" .. size.height)
```
    语句解释：
	-  返回的值就是屏幕当前显示尺寸，横竖屏切换时，这个方法的返回值也会随之改变。

<br>**屏幕左下角三行文字的含义**
　　在游戏的运行过程中，图形的绘制是非常大的开销。对于良莠不齐的Android手机市场，绘制优化较好的游戏，可以在更多的手机上运行，因此也是优化的重中之重。图形方面的优化主要体现在减少`GPU`的绘制次数上。
　　简单的说，每提交一条绘制指令到显卡都会产生消耗，因此尽量少的提交指令就可以优化性能。更具体的说，当整个场景绘制都放在同一条指令中时，是最佳的状态。

　　第一行是GL verts，它表示给显卡绘制的顶点数。
　　第二行是GL calls，它表示代表每一帧中OpenGL指令的调用次数。这个数字越小，程序的绘制性能就越好。
　　第三行就是大家熟悉的FPS：

	-  FPS (Frames Per Second) 更确切的解释是“每秒中填充图像的帧数（帧/秒）”。FPS是测量用于保存、显示动态视频的信息数量。通俗来讲就是指动画或视频的画面数。例如在电影视频及数字视频上，每一帧都是静止的图象；快速连续地显示帧便形成了运动的假象。每秒钟帧数 （FPS） 愈多，所显示的动作就会愈流畅。通常，要避免动作不流畅的最低FPS是30。某些计算机视频格式，例如 AVI，每秒只能提供15帧。
	-  这里的“FPS”也可以理解为我们常说的“刷新率（单位为Hz）”，例如我们常在CS游戏里说的“FPS值”。我们在装机选购显卡和显示器的时候，都会注意到“刷新率”。一般我们设置缺省刷新率都在75Hz（即75帧/秒）以上（XP锁定在60Hz）。例如：75Hz的刷新率刷也就是指屏幕一秒内只扫描75次，即75帧/秒。而当刷新率太低时我们肉眼都能感觉到屏幕的闪烁，不连贯，对图像显示效果和视觉感观产生不好的影响

<br>**本节参考阅读：**
- [Cocos2d-x 学习笔记（四）之 导演类CCDirector](http://www.cnblogs.com/atong/p/3269929.html) 
- [Cocos2d-x 3.x 开发（十八）10行代码看自动Batch，10行代码看自动剔除](http://blog.csdn.net/fansongy/article/details/26968473)
 
## Node ##
　　`Node`对象是所有显示对象的基础类，前面说到的场景(`Scene`)、层`(Layer`)、精灵(`Sprite`)等类都是此类的子类。
　　主要功能：提供所有类型显示对象的公用属性，例如位置、尺寸、角度、显示层级等作为其他显示对象的容器可以执行各种动作。

### 基础应用 ###

<br>**内容尺寸**
　　如果是`Sprite`这样的显示对象，其内容尺寸就是图片的尺寸。而其他类型的内容尺寸默认都是`(0,0)`，并且不包含子对象。

<br>　　范例1：getContentSize()函数。
``` lua
-- 创建一个Sprite对象，并获取它的内容尺寸。
function MainScene:ctor()
    local size = display.newSprite("1128845.png"):getContentSize()
    print(size.width .. "，" .. size.height)
end
```
    语句解释：
	-  这里的display就是指的src/frameworkd/display.lua。
	-  由于display.lua里面提供的接口涉及比较广，因此我们用到哪个接口就介绍哪个，而不再单独为它列出一节了。
	-  而display.newSprite()就是用来创建一个Sprite，它将从res目录下查找用来创建精灵的图片。
	   -  比如本范例使用的1128845.png就是放在res目录下。
	-  由于Sprite继承自Node类，所以自然也就继承了getContentSize()方法。


<br>　　范例2：setContentSize()函数。
``` lua
function MainScene:ctor()
    -- 创建并返回一个 Node 对象
    -- Node 对象并不会直接显示到屏幕上，但可以作为其他显示对象的容器（起到群组的作用）。
    local node = display.newNode()
    local size = node:getContentSize()
    print(size.width .. "," .. size.height)    -- 输出：0，0
    node:setContentSize(100, 100)
    size = node:getContentSize()
    print(size.width .. "," .. size.height)    -- 输出：100，100
end
```
    语句解释：
	-  内容尺寸不考虑对象的位置、缩放、旋转等属性。

<br>**坐标和锚点**
　　每一个显示对象的位置信息由`坐标`和`锚点`两部分组成。

<br>　　范例1：setPosition()、getPosition()函数。
``` lua
-- 设置坐标。
local node = display.newNode()

-- 读取坐标
local x, y = node:getPosition()
x = node:getPositionX()       -- 仅读取 x
y = node:getPositionY()       -- 仅读取 y

-- 设置坐标
node:setPosition(x, y)
node:setPosition(cc.p(x, y))
node:setPositionX(x)          -- 单独改变 x
node:setPositionY(y)          -- 单独改变 y
```
    语句解释：
	-  它们分别用来设置和获取当前显示对象在其父控件内的位置。

<br>　　范例2：setAnchorPoint ()、getAnchorPoint()、getAnchorPointInPoints()函数。
``` lua
local node = display.newNode()

-- 设置锚点
node:setAnchorPoint(cc.p(0, 1))
 
-- 读取锚点
local anchorPoint = node:getAnchorPoint()
print(anchorPoint.x, anchorPoint.y)
 
-- 读取锚点对应的坐标
local anchorPointInPoints = node:getAnchorPointInPoints()
print(anchorPointInPoints.x, anchorPointInPoints.y)
```
    语句解释：
	-  锚点的坐标是相对于当前显示对象的尺寸来说的，比如：若显示对象的宽高为(500,60) ，锚点为(0,1)，则锚点的坐标为(0,60)。
	-  默认情况下，显示对象的锚点是(0.5,0.5)。

<br>　　范例3：getBoundingBox()函数。
``` lua
local node = display.newNode()
node:setPosition(100, 100)
node:setContentSize(200, 200)
local rect = node:getBoundingBox()
-- 输出：100 100 200 200
print(rect.x .. " " .. rect.y .. " " .. rect.width .. " " .. rect.height)
```
    语句解释：
	-  用于取得一个显示对象在其父显示对象内的位置和尺寸信息。
	-  通常当需要判断某个点是否落在一个显示对象上时会用到此方法。

<br>**坐标变换**
　　每一个显示对象都具有一个自己的“`本地`”坐标系。Node 提供了一组方法用于转换“`本地`”坐标系和“`世界`”坐标系。
<br>　　范例1：坐标系的转换。
``` lua
local node = display.newNode()

-- 将“世界”坐标转换为“本地”坐标
local worldPoint = cc.p(100, 200)
local nodePoint = node:convertToNodeSpace(worldPoint)
local nodePointAR = node:convertToNodeSpaceAR(worldPoint)  -- 计算锚点对坐标的影响
 
-- 将“本地”坐标转换为“世界”坐标
local nodePoint = cc.p(10, 10)
local worldPoint = node:convertToWorldSpace(nodePoint)
local worldPointAR = node:convertToWorldSpaceAR(nodePoint) -- 计算锚点对坐标的影响
```
    语句解释：
	-  将“世界”坐标转换为某个显示对象的“本地”坐标，其实就是：该世界坐标-显示对象的左下角的世界坐标， 因此得到的值可能是负数。
	-  将某个显示对象的“本地”坐标转换为“世界”坐标，其实就是：该显示对象的左下角世界坐标(注意它可能是负数)+本地坐标。

<br>**显示层级**
　　当多个显示对象属于同一个父对象时，它们之间的显示层级决定了画面上的互相遮盖关系。例如一个人物角色的显示层级如果比一棵树的层级更高，那么画面上人物角色就会挡住树的一部分，反之亦然。
　　在Coco2dx-lua中，显示对象构成的树状结构天然就是层次关系，而`ZOrder`用于调整同级显示对象的前后遮挡关系。

<br>　　范例1：setLocalZOrder()函数。
``` lua
function MainScene:ctor()
    local hero = display.newSprite("hero.png") -- 创建一个人物角色图像
    hero:setLocalZOrder(1000) -- 设置人物角色的 ZOrder 为 1000
    local tree = display.newSprite("tree.png") -- 创建树的图像
    -- 将两者添加到场景中
    self:addChild(hero)
    self:addChild(tree)
end
```
    语句解释：
	-  如果不明确为显示对象设置ZOrder，则其值默认为0。因此hero的ZOrder大于tree的ZOrder，hero就会遮盖住tree。也就是说ZOrder越大，显示层级越高。
	-  如果两个显示对象的ZOrder值相等，那后添加到场景上的显示对象将盖住先添加的。
	-  本范例中的addChild()函数用来将一个显示对象添加到另一显示对象中，它还有一个重载方法addChild(node, zorder)。

<br>**变形**
　　在Coco2dx-lua中，可以指定一个显示对象的变形属性，例如缩放、倾斜等。改变一个对象的变形属性后，这个对象中所有的子对象都会受到影响。

<br>　　范例1：缩放。
``` lua
function MainScene:ctor()
    local hero = display.newSprite("hero.png")
    hero:setScale(2.0) -- 放大为 2 倍显示
    hero:setScaleX(1.5) -- 水平方向拉伸为 1.5 倍
    hero:setScaleY(1.5) -- 垂直方向拉伸为 3.0 倍
 
    print(hero:getScale())
    print(hero:getScaleX())
    print(hero:getScaleY())

    self:addChild(hero)
end
```
    语句解释：
	-  它是真正意义上的放大，如果hero的尺寸为(500,60)，则放大2倍之后的尺寸为(1000,120) ，即只会改变显示对象的尺寸而不会去改变它的position。
	-  如果scaleX和scaleY使用了不同的值，那么调用对象的getScale()方法会报告错误（因为它不知道该返回scaleX还是scaleY的值）。

<br>　　范例2：倾斜。
``` lua
function MainScene:ctor()
    local hero = display.newSprite("hero.png")

    hero:setSkewX(10) -- 水平倾斜 10 度
    hero:setSkewY(20) -- 垂直倾斜 20 度
 
    print(hero:getSkewX())
    print(hero:getSkewY())

    self:addChild(hero)
end
```

<br>　　范例3：旋转。
``` lua
node:setRotation(90) -- 设置旋转角度
node:getRotation()
```

<br>**是否可见**
　　不可见的对象不会渲染，也不会接受触摸事件，除此之外与可见对象没有任何区别，帧事件、延迟调用、动作等都会正常工作。

<br>　　范例1：可见性。
``` lua
node:setVisible(false) -- 设置对象不可见
node:isVisible()
```

<br>　　范例2：通过透明度来设置可见性。
``` lua
node:setOpacity(0)  -- 0为完全不可见，255为完全可见
```
    语句解释：
	-  虽然修改透明度同样可以使node在屏幕上看不见，但透明度为0的对象依然会被渲染到屏幕上。

<br>**添加和管理子对象**
　　Node最强大的功能之一是可以作为其他显示对象的容器。例如我们要制作一个对话框，可以将对话框的所有内容都添加到一个Node对象里。对这个Node设定位置、改变大小等操作，就会作用到整个对话框上。

<br>　　范例1：添加子对象。
``` lua
node:addChild(childNode) -- 添加子对象
node:addChild(childNode, z) -- 同时指定子对象的 ZOrder
node:addChild(childNode, z, tag) -- 同时指定子对象的 tag
```

<br>　　范例2：访问子对象。
``` lua
-- 查询指定 tag 的子对象，如果有多个返回第一个，否则返回 nil
local childNode = node:getChildByTag(tag)
 
-- 返回子对象的总数（不含子对象的子对象）
print(node:getChildrenCount())
 	
-- 获得一个包含所有子对象的table对象，然后遍历其中所有子对象
local array = node:getChildren()
for k,v in pairs(array) do
    local childNode = tolua.cast(v, "cc.Node")
    print(childNode:getParent()) -- 输出子对象的父对象，应该与 node 的值相同
end
```
    语句解释：
	-  cc.Node是Node的完整名称。
	-  这里用到了 tolua.cast() 函数，请参考 tolua 。

<br>　　范例3：删除子对象。
``` lua
childNode:removeSelf() -- 从父对象中删除自己
node:removeChild(childNode) -- 删除一个子对象
node:removeChild(childNode,cleanup) -- 如果cleanup为true则清除该节点(包括子结点)的所有动作

-- 删除指定 tag 的子对象，如果有多个 tag 相同的子对象，删除第一个
childNode:setTag(1) -- 设置子对象的 tag 为 1
node:removeChildByTag(1)

-- 删除所有子对象
node:removeAllChildren()
```
    语句解释：
	-  这里用到了 tolua.cast() 函数，请参考 tolua 。

<br>　　范例4：显示多张图片。 
``` lua
function MainScene:ctor()
    local hero = display.newSprite("1128845.png")
    local hero2 = display.newSprite("1128845.png")
    hero:addChild(hero2,1,2)
    print(hero:getChildrenCount())
    hero:removeAllChildren()
    print(hero:getChildrenCount())
end
```
    语句解释：
	-  要始终记住：所有控件都是cc.Node的子类。
	-  这意味着，以后会提到的UICheckBoxButton等控件，如果需要同时显示多张图片，可以通过调用addChild()方法直接添加一个精灵到其内部即可。

<br>**颜色和透明度**
　　改变显示对象的颜色值和透明度时，可以设置是否传递到子对象。这样在实现一组对象的淡入淡出等操作时很方便。

<br>　　范例1：改变透明度。
``` lua
local node = display.newNode()
local childNode = display.newSprite("1128845.png")
node:addChild(childNode)
node:setCascadeOpacityEnabled(true) -- 改变透明度时，影响所有的子对象
node:setOpacity(128) -- 透明度可用值为 0 - 255， 128 相当于 50% 透明度
 
print(node:getOpacity()) -- 返回显示对象的透明度
print(childNode:getOpacity()) -- 输出 255，因为我们没有直接改变 childNode 的透明度
print(childNode:getDisplayedOpacity()) -- 输出 128，这个透明度是自身透明度和父对象透明度的综合
print(node:isCascadeOpacityEnabled()) -- 检查是否允许传递透明度设置
```

　　改变一个显示对象的颜色，会在渲染时将指定的颜色值和图像的像素颜色值做运算。也就是说设置颜色值可以导致图像显示时的颜色发生变化。

<br>　　范例2：改变颜色。
``` lua
local node = display.newNode()
local childNode = display.newSprite("1128845.png")
node:addChild(childNode)
node:setCascadeColorEnabled(true) -- 改变颜色值时，影响所有的子对象
node:setColor(cc.c3b(64, 64, 64)) -- 设置一个灰色，这会让图像看上去变得更黯淡

local color = node:getColor() -- 返回显示对象的颜色值
print(color.r, color.g, color.b)

local displayedColor = childNode:getDisplayedColor() -- 返回实际的显示颜色
print(displayedColor.r, displayedColor.g, displayedColor.b)
print(node:isCascadeColorEnabled()) -- 检查是否允许传递颜色值设置
```

### 事件处理 ###
　　Cocos2dx-lua中的事件按照功能和用途分为：

	-  节点事件
	-  帧事件
	-  触摸事件
	-  键盘事件
	-  重力感应事件
	-  应用程序事件

<br>**节点事件**
　　节点事件在一个`Node`对象进入、退出场景时触发。

<br>　　范例1：启用节点事件。
``` lua
function MainScene:ctor()
    local node = display.newNode()
    node:addNodeEventListener(cc.NODE_EVENT, function(event)
        print(event.name)
    end)
    self:addChild(node)
end
```
    语句解释：
	-  调用Node类的addNodeEventListener方法来为当前Node对象添加事件监听器。本范例中，为node添加了“cc.NODE_EVENT”事件监听器。

<br>　　提示一下，quick为了方便我们开发，为Node类添加了很多辅助方法，比如上面提到的`addNodeEventListener`方法，这些方法可以在`src/frameworkd/cocos2dx/NodeEx.lua`文件中找到。

<br>　　回调函数的event参数目前只有一个`name`属性，它的取值为：
``` lua
	取值					描述
	enter				Node加入了正在运行的场景
	exit				Node退出了正在运行的场景
	enterTransitionFinish		进入一个新场景时的特效结束
	exitTransitionStart		退出一个现有场景时的特效开始
	cleanup				Node被完全清理并从内存删除时
```

<br>　　下面的示例代码演示了这5种事件类型的出现时机，可以将它们放到`src/main.lua`的末尾，然后直接运行项目：
``` lua
-- 首先使用display.newScene()函数创建一个空白场景，参数sceneInit是场景的名称。
local sceneInit = display.newScene("sceneInit")
-- 进入该场景
display.replaceScene(sceneInit)
 
local function createTestScene(name)
    local scene = display.newScene(name)
    local node = display.newNode()
    node:addNodeEventListener(cc.NODE_EVENT, function(event)
        printf("node in scene [%s] NODE_EVENT: %s", name, event.name)
    end)
    scene:addChild(node)
    return scene
end
 
-- 等待 1.0 秒创建第一个测试场景
sceneInit:performWithDelay(function()
    local scene1 = createTestScene("scene1")
    display.replaceScene(scene1)
 
    -- 等待 1.0 秒创建第二个测试场景
    scene1:performWithDelay(function()
        print("--------")
        local scene2 = createTestScene("scene2")
        display.replaceScene(scene2)
    end, 1.0)
end, 1.0)
```
　　输出结果：
``` lua
node in scene [scene1] NODE_EVENT: enter
node in scene [scene1] NODE_EVENT: enterTransitionFinish
--------
node in scene [scene1] NODE_EVENT: exitTransitionStart
node in scene [scene1] NODE_EVENT: exit
node in scene [scene1] NODE_EVENT: cleanup
node in scene [scene2] NODE_EVENT: enter
node in scene [scene2] NODE_EVENT: enterTransitionFinish
```
　　在切换场景时如果没有使用特效，那么事件出现的顺序如上。
　　但如果将测试代码`display.replaceScene(scene2)`修改为`display.replaceScene(scene2, "random", 1.0)`，事件出现顺序会变成：
``` lua
node in scene [scene1] NODE_EVENT: enter
node in scene [scene1] NODE_EVENT: enterTransitionFinish
--------
node in scene [scene1] NODE_EVENT: exitTransitionStart
node in scene [scene2] NODE_EVENT: enter
node in scene [scene1] NODE_EVENT: exit
node in scene [scene2] NODE_EVENT: enterTransitionFinish
node in scene [scene1] NODE_EVENT: cleanup
```
　　造成这种区别的原因就是场景切换特效播放期间，会同时渲染两个场景，所以从事件上看，可以看到第二个场景的`enter`事件出现后，第一个场景的`exit`事件才出现。

<br>　　因此，我们在使用节点事件时，不应该假定事件出现的顺序，而是根据特定事件采取特定的处理措施。通常建议如下：

	-  enter，这里可以做一些场景初始化工作
	-  exit，如果场景切换使用了特效，可以在这里停止场景中的一些动画，避免切换场景的特效导致帧率下降
	-  cleanup，适合做清理工作

<br>　　为了简化使用，quick为`cc.Node`封装了几个现成的方法，开发者如果从`Node`（或继承类）创建自己的`Lua`类，那么可以直接覆盖这几个方法：

	onEnter、onExit、onEnterTransitionFinish、onExitTransitionStart、onCleanup

<br>　　范例2：再看MainScene。
``` lua
local MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)

function MainScene:ctor()
end

function MainScene:onEnter()
    print("onEnter")
end

function MainScene:onExit()
    print("onEnter")
end

return MainScene
```
    语句解释：
	-  若想让Node子类的onEnter等5个方法被调用，需要先调用node的setNodeEventEnabled(true)来开启Node的节点事件。
	-  事实上，当我们display.newScene()函数创建一个Scene时，在它内部就已经为我们开启了节点事件了。

<br>**节点帧事件**
　　注册该事件后，每一次刷新屏幕前（也就是前一帧和下一帧之间）都会触发事件。

<br>　　范例1：节点帧事件。
``` lua
function MainScene:ctor()
    local node = display.newNode()
    -- 注册事件
    node:addNodeEventListener(cc.NODE_ENTER_FRAME_EVENT, function(dt)
        print(dt)
    end)
    -- 启用帧事件
    node:scheduleUpdate()
    -- 0.5 秒后，停止帧事件
    node:performWithDelay(function()
    	-- 禁用帧事件
    	node:unscheduleUpdate()
        print("STOP")
        -- 再等 0.5 秒，重新启用帧事件
        node:performWithDelay(function()
            -- 再次启用帧事件
            node:scheduleUpdate()
        end, 0.5)
    end, 0.5)
    self:addChild(node)
end
```
    语句解释：
	-  运行时，屏幕上会不断输出上一帧和下一帧之间的时间间隔（通常为 1/60 秒），并在 0.5 时短暂暂停一下。
	-  注意：一定要调用scheduleUpdate后并且Node被添加到屏幕上后，帧事件才会触发。

<br>**触摸事件**
　　由于触摸事件的内容较多，所以请参考下一节“触摸事件”。

<br>**键盘事件**
　　键盘事件当前仅在`Android`设备上有效，可以得到用户按下`Menu`和`Back`键时的消息：
``` lua
local node = display.newNode()
node:addNodeEventListener(cc.KEYPAD_EVENT, function(event)
    print(event.name)
end)
scene:addChild(node)
```
    语句解释：
	-  event.name: 指示用户按下的键，具有menu和back两个值。

<br>**重力感应事件**
　　通过重力感应事件，可以得到设备当前的姿态：
``` lua
local node = display.newNode()
node:addNodeEventListener(cc.ACCELERATE_EVENT, function(event)
    print(event.x, event.y, event.z, event.timestamp)
end)
scene:addChild(node)
```
    语句解释：
	-  event 属性: 
	   -  event.x, event.y, event.z: 设备在 xyz 轴上的角度。
	   -  event.timestamp: 测量值更新时间

<br>**应用程序事件**
　　在quick应用中，存在一个全局的`app`对象。该对象会提供一些应用程序级别的事件：

	-  APP_ENTER_BACKGROUND_EVENT 应用进入后台
	-  APP_ENTER_FOREGROUND_EVENT 应用从后台恢复运行

　　可以在`MyApp:ctor()`中加入下面的代码：
``` lua
app:addEventListener("APP_ENTER_BACKGROUND_EVENT", function(event)
    -- ...
end)
 
app:addEventListener("APP_ENTER_FOREGROUND_EVENT", function(event)
    --  ...
end)
```

<br>**本节参考阅读：**
- [Quick 中的事件](http://cn.cocos2d-x.org/article/index?type=quick_doc&url=/doc/cocos-docs-master/manual/framework/quick/V3/events/zh.md) 

### 触摸事件 ###
　　Cocos2dx原本的触摸机制存在一些限制，在使用中需要开发者做不少额外的处理。所以quick提出了自己的一套触摸机制。本文详细介绍了这套新机制的用法。

<br>**显示层级**
　　在Cocos2d-x里，整个游戏的画面是由一系列的`Scene`,`Node`,`Sprite`,`Layer`等对象构成的。而所有这些对象都是从`Node`这个类继承而来。我们可以将`Node`称为显示节点。
　　一个游戏画面就是许多显示节点构成的一棵树：
``` lua
/|\
 | 显示层级
 |
 |         [Node]  [Node]  [Node]
 |           |       |       |
 |           +---+---+       |
 |               |           |
 |             [Node]      [Node]
 |               |           |
 |               +-----+-----+
 |                     |
 |                   [Node]
```

　　在这棵树里，Node所处的垂直位置就是它们的显示层级。越往上的Node，其显示层级就越高。从画面表现上来说，下面的Node是背景，上面的Node是建筑，那么建筑就会挡住一部分背景。

<br>**触摸区域**
　　在Cocos2d-x里，只有`Layer`对象才能接受触摸事件。而`Layer`总是响应整个屏幕范围内的触摸，这就要求开发者在拿到触摸事件后，再做进一步的处理。

　　例如有一个需求是在玩家触摸屏幕上的方块时，人物角色做一个动作。那么使用`Layer`接受到触摸事件后，开发者需要自行判断触摸位置是否在方块之内。当屏幕上有很多东西需要响应玩家交互时，程序结构就开始变得复杂了。
　　所以Cocos2dx-lua允许开发者将任何一个`Node`设置为接受触摸事件。并且触摸事件一开始只会出现在这个`Node`的触摸区域内。

　　所谓触摸区域，就是一个`Node`及其所有子`Node`显示内容占据的屏幕空间。要注意的是这个屏幕空间包含了图片的透明部分。下图中，`节点A`是一个`Sprite`对象，它的触摸区域就是图片大小；而`节点B`是一个Node对象，其中包含了三个`Sprite`对象，那么`节点B` 的触摸区域就是三个`Sprite`对象触摸区域的合集。

<center>
![](/img/quick-cocos2d-x/quick_4_2.png)
</center>

　　为了简化实现，触摸区域都是一个矩形，所以`节点B`的触摸区域实际上是一个“包含三个 Sprite 对象触摸区域合集的矩形”，可以参考上图中的红色边框线。

<br>**用法示例**
　　下面列出触摸事件的用法示例，更详细的示例请参考`quick-3.3rc1/quick/samples/touch`示例。

<br>　　范例1：单点触摸事件。
``` lua
function MainScene:ctor()
    local node = display.newSprite("1128845.png")
    -- 允许 node 接受触摸事件
    node:setTouchEnabled(true)
    -- 将node的位置设置到屏幕正中央。display.cx, display.cy就表示屏幕的中心点的x和y轴坐标。
    node:setPosition(display.cx, display.cy)
 
    -- 注册触摸事件
    node:addNodeEventListener(cc.NODE_TOUCH_EVENT, function(event)
        -- event.name 是触摸事件的状态：began, moved, ended, cancelled
        -- event.x, event.y 是触摸点当前位置
        -- event.prevX, event.prevY 是触摸点上一次所处的位置
        printf("sprite: %s x,y: %0.2f, %0.2f", event.name, event.x, event.y)
 
        -- 在 began 状态时，如果要让 Node 继续接收该触摸事件的状态变化
        -- 则必须返回 true
        if event.name == "began" then
            return true
        end
    end)
    self:addChild(node)
end
```
    语句解释：
	-  本范例通过创建一个Sprite对象来介绍Node对象的触摸事件，事实上Node以及其所有子类的触摸事件的处理方法都是一样的。
	-  触摸事件的 event.name 指示了事件的状态：
	   -  began: 手指开始触摸屏幕。在 began 状态时，如果要继续接收该触摸事件的状态变化，事件处理函数必须返回 true。
	   -  moved: 手指在屏幕上移动。
	   -  ended: 手指离开屏幕。
	   -  cancelled: 因为其他原因取消触摸操作。

<br>　　范例2：多点触摸。
``` lua
function MainScene:ctor()
    local node = display.newSprite("1128845.png")
    -- 允许 node 接受触摸事件
    node:setTouchEnabled(true)
    -- 将node的位置设置到屏幕正中央。display.cx, display.cy就表示屏幕的中心点的x和y轴坐标。
    node:setPosition(display.cx, display.cy)
 
    -- 设置触摸模式
    node:setTouchMode(cc.TOUCH_MODE_ALL_AT_ONCE) -- 多点
    -- node:setTouchMode(cc.TOUCH_MODE_ONE_BY_ONE) -- 单点（默认模式）
 
    -- 注册触摸事件
    node:addNodeEventListener(cc.NODE_TOUCH_EVENT, function(event)
        -- event.name 是触摸事件的状态：began, moved, ended, cancelled
        -- 多点触摸增加了 added 和 removed 状态
        -- event.points 包含所有触摸点
        -- 按照 events.point[id] = {x = ?, y = ?} 的结构组织
        for id, point in pairs(event.points) do
            printf("event [%s] %s = %0.2f, %0.2f", event.name, id, point.x, point.y)
        end
 
        if event.name == "began" then
            return true
        end
    end)
    self:addChild(node)
end
```
    语句解释：
	-  在多点触摸时，事件状态的含义有所区别：
	   -  began: 手指开始触摸屏幕。用户可能同时用多个手指接触屏幕，但因为硬件响应速度极快的原因，began 状态时，event.points 中可能仍然只有一个触摸点的数据，其他触摸点数据会通过 added 状态提供。
	   -  added: 开始触摸后，如果有更多触摸点出现，则出现 added 状态。此时 event.points 中包含新加入的触摸点数据。
	   -  removed: 如果触摸结束前有触摸点消失（接触屏幕的部分手指离开了屏幕），则出现 removed 状态。此时 event.points 中包含删除的触摸点数据。
	   -  ended: 如果所有触摸点都消失（所有手指都离开了屏幕），则出现 ended 状态。此时 event.points 中包含删除的触摸点数据。
	   -  moved: 由于多点触摸时，可能只有部分触摸点移动。所以此时 event.points 中只包含有变化的触摸点数据。

<br>**触摸事件吞噬**
　　默认情况下，Node在响应触摸后（在began状态返回true表示要响应触摸），就会阻止事件继续传递给Node的父对象（更下层的Node），这称为触摸事件吞噬。
　　如果要改变这个行为，可以让Node调用下面两个方法：

	-  setTouchSwallowEnabled() 
	   -  是否允许Node吞噬触摸，默认为true。若设置为false，则Node响应触摸事件后，仍然会将事件继续传递给父对象。
	-  isTouchSwallowEnabled()
	   -  检查Node是否允许吞噬触摸。

<br>**禁用触摸**
　　对于一个Node，随时可以启用或禁用其触摸事件：

	-  setTouchEnabled() 是否允许Node响应触摸，默认为false。
	-  isTouchEnabled() 检查Node是否允许触摸。
　　但即便禁用了Node的触摸事件，也只能阻止这个Node响应触摸，而不能阻止这个Node的子Node响应触摸。

<br>　　假设有一个对话框（Node），我们需要禁止对话框中的所有Node响应触摸。那么需要禁止对话框Node捕获事件：
``` lua
dialogNode:setTouchCaptureEnabled(false)
```
　　相应的也有两个方法：
	-  setTouchCaptureEnabled() 是否允许Node捕获触摸，默认为true。当设置为false时，该Node及其所有子Node都无法得到触摸事件。
	-  isTouchCaptureEnabled() 检查Node是否允许捕获触摸。

　　总结而言，`setTouchEnabled()`只针对当前Node，而`setTouchCaptureEnabled()`同时影响当前Node及其所有子Node。

<br>**触摸事件的三个阶段**
　　Cocos2dx-lua中触摸事件分为三个阶段：`capturing`（捕获）、`targeting`（触发）、`bubbling`（冒泡）。
<br>　　当用户的一根手指触摸到屏幕时，将产生一个触摸事件：

	1、遍历所有响应触摸的Node，找出显示层级最高，并且其触摸区域包含触摸位置的那个Node。这个Node被称为TargetNode（目标Node）。
	2、检查TargetNode的isTouchCaptureEnabled()结果，如果返回false，则重复1。
	   -  从TargetNode的根Node（通常是Scene）开始，检查cc.NODE_TOUCH_CAPTURE_EVENT事件的返回结果。任何一个Node返回false都会阻止事件在TargetNode上触发。并从步骤1开始查找其他符合条件的Node。
	   -  这个阶段被称为capturing。
	3、在TargetNode上触发事件。这个阶段被称为targeting。
	4、如果事件返回结果为false，表示TargetNode不响应该事件，并从步骤1开始查找其他符合条件的Node。
	5、在TargetNode完成事件响应后，检查TargetNode:isTouchSwallowEnabled()的返回值。若是true，则取消bubbling阶段。
	6、从TargetNode开始往其所有父Node触发事件，直到某个Node返回false或者事件被吞噬。这个阶段称为bubbling。

<br>　　利用事件的三个阶段，我们可以注册capturing阶段的触摸事件处理函数：
``` lua
-- 在 capturing 阶段就捕获事件
node:addNodeEventListener(cc.NODE_TOUCH_CAPTURE_EVENT, function(event)
    if event.name == "began" then
        -- 在 began 状态返回 false，将阻止事件
        return false
    end
end)
```
<br>　　关于触摸机制的灵活运用，可以参考`src/framework/cc.ui`中的各个UI控件，以及`samples/touch`示例。

<br>**本节参考阅读：**
- [Quick 中的触摸事件](http://cn.cocos2d-x.org/article/index?type=quick_doc&url=/doc/cocos-docs-master/manual/framework/quick/V3/touch-events/zh.md) 

### 内存管理 ###
　　`C++`和`Java`不一样，`Java`有一套很方便的垃圾回收机制，当我们不需要使用某个对象时，给它赋予`null`值即可。 而`C++`中new了一个对象之后，不使用的时候通常需要手动的删掉，因此`Cocos2d-x`就发明了自己的一套内存管理机制。

<br>　　范例1：一个错误的demo。
``` lua
function MainScene:ctor()
    local node = cc.Node:create()
    -- 0.1秒后将node加入到当前场景中
    self:performWithDelay(function ( ... )
        print(node, tolua.isnull(node))
        self:addChild(node)
    end, 0.1)
end
```
    语句解释：
	-  程序将在执行self:addChild(node)时报错，原因是node的内存已经被回收掉了。
	-  需要注意的是，若需要判断一个node是否被释放，应该使用“tolua.isnull(node)”函数，而不是直接判断node是否为nil。 tolua.isnull()函数检查的是对象的C++内存。

<br>　　`Ref`是Cocos2dx里绝大部分`C++`对象(`cc.Action`、`cc.Node`、`cc.Director`等等)的父类。  它主要功能是引用计数的内存管理、自动释放，该类提供了如下三个内存相关的方法：

	-  Ref * autorelease(void)        -- 标识当前对象为自动释放内存
	-  void 	retain (void)   	  -- 保持当前对象的引用，使其不被自动释放。
	-  void 	release (void)   	 -- 释放当前对象的引用，使其可以被自动释放。

<br>　　通常在Cocos2dx中有两种创建对象的方式：

	-  通过new()方法： 使用C++支持的原生方式创建。
	-  通过create()方法： 在其内部会通过new()方法创建对象，然后还会调用该对象的autorelease()方法将其标识为自动释放内存。 
　　在此强烈推荐使用`create`方法来创建对象，否则随着程序运行时间的增加，就会造成大量的内存泄漏。事实上在我们之前一直使用的`display.newNode()`函数的内部，就只有一行代码：`cc.Node:create()`。

<br>　　屏幕每秒钟会刷新几十次，每次刷新的时候Cocos2d-x都会将那些调用了`autorelease()`方法，但却没有人持有它引用的对象给释放掉，若释放之后我们再去用这个对象，就可能会出现崩溃等问题。 

<br>　　范例2：解决问题。
``` lua
function MainScene:ctor()
    local node = cc.Node:create()
    node:retain()
    self:performWithDelay(function ( ... )
        self:addChild(node)
        node:release()
    end, 1)
end
```
    语句解释：
	-  调用retain可以持有对象的引用，确保对象不被回收，release则是释放对象的引用。
	-  retain和应该配对使用，若只是调用retain了，则对象将不会被回收。
	-  如果对象没有调用autorelease过方法，则retain和release是无效的。
	-  当使用addChild方法把对象添加到Layer、Node等时，addChild函数会调用对象的retain函数。

## Scene ##
　　`Scene`对象在Cocos2dx中作为一个场景中所有其他显示对象的容器。在Cocos2dx里可以创建多个场景，并从一个场景切换到另一个场景。
　　对象继承关系： `Ref` -> `Node` -> `Scene`。

<br>　　范例1：创建一个场景类。
``` lua
local MainScene = class("MainScene", function()
    return display.newScene("MainScene")
end)
```
    语句解释：
	-  调用display.newScene()可以创建一个Scene对象，将它做为class函数的参数即可定义一个自己的Scene对象。

## Sprite ##
　　从技术上讲，精灵是一个可以不断变化的图片，这些变化包括：位置移动、旋转、缩放、换帧（就是像动画片一样播放几张连续的图片，每帧换一张，形成一个动画效果）。
　　简单的说，Sprite是Cocos2dx中的精灵类，它在Node基础上添加了图像渲染能力。
　　对象继承关系： `Ref` -> `Node` -> `Sprite`

### 创建精灵 ###

<br>　　范例1：创建一个场景类。
``` lua
function MainScene:ctor()
    local sprite = cc.Sprite:create("1128845.png")
    sprite:setPosition(cc.p(200, 200))
    self:addChild(sprite)
end
```
    语句解释：
	-  调用Sprite类的create方法，传递图片的名称。

<br>　　范例2：截取出要显示的区域。
``` lua
function MainScene:ctor()
    local sprite = cc.Sprite:create("1128845.png", cc.rect(0, 0, 120, 120))
    sprite:setPosition(display.cx, display.cy)
    self:addChild(sprite)
end
```
    语句解释：
	-  create方法有重载，第二个参数设置图片的显示区域，原点是图片左上角。
	-  本范例的结果是：在1128845.png上截取出一个矩形作为Sprite要显示的图片，矩形的范围是从1128845.png左上角开始，到x和y轴偏移120像素的位置结束。
	-  也可以在创建完毕Sprite后，调用setTextureRect(rect)方法来设置显示区域。

　　除了上面那种方法，在Cocos2dx-lua中还有三种创建Sprite对象的方法，下面将依次来介绍。

<br>**通过纹理**
　　当一张图片被加载到内存后，它是以`纹理`的形式存在的。
　　纹理是什么东西呢？ 纹理就是保存在内存中的图片的二进制数据，这些数据是按照指定的像素格式填充的图片像素信息。

<br>　　纹理格式：

	-  所谓纹理格式，即每个纹理中的像素单位分别是怎么为颜色值进行实际内存分配的。
	-  这个非常重要，我们在进行游戏开发的过程中，会常常与各种图片类型打交道。每种图片往往也有各自的像素格式。但当它们一旦加载到游戏中后，就会根据我们的要求变成某种类型的纹理。不同的纹理格式所占据的内存大小可能不同，我们要根据实际情况和需求来选择相应的纹理格式。
	-  比如我们用RGBA8888纹理格式来创建纹理，它占据的内存容量很大，但若我们要显示的纹理中没有ALPHA值，那就不应该使用带ALPHA通道的纹理格式，而可以改成RGB565像素格式。 

<br>　　与纹理相关的三个类：
	-  Texture2D：纹理，即图片加载入内存后供CPU和GPU操作的贴图对象。
	-  TextureCache：纹理管理器，负责加载图片并对生成的纹理进行管理。通过“字典”来进行快速的查询。
	-  TextureAtlas：纹理块管理器，如果图片是由多个小图块组成的，则纹理块管理器用来存储这些小图块的相关信息，以方便绘制相应图块。

<br>　　有些经常被用到或者需要频繁加载移除的一些资源，如果每次都从文件中加载，程序的效率会变得非常低，通常的做法是将这些文件先读到缓存中，然后再从缓存中加载。

<br>　　范例1：通过纹理创建精灵。
``` lua
function MainScene:ctor()
    -- 将一个图片加入缓存并返回一个CCTexture2D的对象
    local pTexture = cc.Director:getInstance():getTextureCache():addImage("1128845.png")
    -- 创建Sprite对象
    local sp = cc.Sprite:createWithTexture(pTexture)
    sp:setPosition(display.cx, display.cy)
    self:addChild(sp)
end
```
    语句解释：
	-  如果一个资源已经被加入到了缓存，addImage是不会再加一遍的。
	-  我们一般不会使用此种方式来创建Sprite，因为在Sprite:create()函数的内部就是这么做的。

<br>**通过Sprite Sheets**
　　Sprite Sheets主要是由N个图像组合成的一个大的图像，使用一个大图片的好处就是减少读取次数，在一定数量的情况下，Sprite Sheets有更快的打开速度。

　　SpriteFrame（精灵帧）是把一个Sprite Sheets划分掉，每一个矩形区域就是一个精灵帧。
　　SpriteFrame给我们提供了一种快捷，简便的方式，就是将它对应的矩形区域信息保存到`plist`文件中，并通过一个名称作为索引。

<center>
![SpriteFrame图示](/img/quick-cocos2d-x/quick_4_3.png)
</center>

　　生成这种大图也有很多工具，常用的两种工具：

	-  `Zwoptex`是一个在线的免费工具。
	-  `TexturePacker`是一个收费软件，不过免费版也能满足基本的需要。
　　这两种工具可以将多张图片合并，并生成一个`.plist`文件和一个图片文件。存放的时候将这两个关联的文件放在同一个目录下。在需要使用的时候，我们可以将它加载到缓存中。

<br>　　范例1：通过精灵帧创建精灵。
``` lua
function MainScene:ctor()
    -- 将图片和plist文件加载到内存中，并缓存到SpriteFrameCache中。
    display.addSpriteFrames("AnimBear.plist", "AnimBear.png")
    -- 从SpriteFrameCache的缓存中查找的图片，若成功则返回SpriteFrame。
    local frame = display.newSpriteFrame("bear1.png")
    -- 使用SpriteFrame创建一个精灵。
    local sprite = display.newSprite(frame)
    sprite:center()
    self:addChild(sprite)
end
```
    语句解释：
	-  使用display库中提供的函数可以方便的加载精灵帧到内存中。
	-  若内存中，当前存在两个以上名为“bear1.png”的图片，则会加载最先查找到的那张。
	-  当不需要再使用到某个精灵表单时，应该及时将它从内存中删除：
	   -  display.removeSpriteFramesWithFile("AnimBear.plist", "AnimBear.png")

<br>　　范例2：精灵与精灵帧。
``` lua
function MainScene:ctor()
    -- 用 1128845.png 做显示内容
    local sprite = display.newSprite("1128845.png")
    sprite:setPosition(display.cx, display.cy)
    -- display.addSpriteFrames("AnimBear.plist", "AnimBear.png")
    local spriteFrame = display.newSpriteFrame("bear1.png")
    -- 换成 bear1.png
    sprite:setSpriteFrame(spriteFrame)
    -- 检查当前的显示内容是不是指定的 SpriteFrame 对象
    print(sprite:isFrameDisplayed(spriteFrame)) -- 输出 true。
    self:addChild(sprite)
end
```
    语句解释：
	-  运行本范例时会出异常。因为display.newSpriteFrame()只会从缓存中加载图片，如果缓存中没有则抛异常。
	-  解决的方法是把第5行代码给取消注释。

<br>**使用display库**

<br>　　范例1：使用src/framework/display.lua中的函数。
``` lua
self:addChild(display.newSprite("1128845.png", 400,400))
```
    语句解释：
	-  函数有三个参数：newSprite(文件名, x坐标, y坐标)
	-  此语句会使用1128845.png创建一个Sprite对象，并设置其position为(400,400)。
	-  使用newSprite()函数创建精灵是最常见的。它内部会依据不同的情况来去转调用Sprite:create()和Sprite:createWithSpriteFrame()函数创建精灵。
<br>
### Scale9Sprite ###
　　`Android`中提供的`NinePatch`图片在`Cocos2d-x`中也有对应的实现，即`Scale9Sprite`类。值得注意的是`Scale9Sprite`类显示的图并不需要画线，画线也没用。

<br>　　范例1：创建`Scale9Sprite`。
``` lua
function MainScene:ctor()
    local sprite = ccui.Scale9Sprite:create("button.png")
    -- 设置精灵的大小
    sprite:setPreferredSize(cc.size(300,300))
    sprite:center()
    self:addChild(sprite)
end
```
    语句解释：
	-  若没有调用setPreferredSize()或setContentSize()函数来设置Scale9Sprite的尺寸，则默认使用图片的尺寸作为Scale9Sprite的尺寸。
	-  若调用了，则会在水平和垂直方向上，拉伸图片到设置的尺寸。

<br>　　范例2：其他函数。
``` lua
-- 获取sprite所显示的图片的原始尺寸。
sprite:getOriginalSize().width, s:getOriginalSize().height

-- 设置拉伸的区域
sprite:setCapInsets(cc.rect(120, 120, 10, 10))
```
<br>
### GraySprite ###
　　在实际项目中，经常需要用到灰色图像。比如按钮变灰，一般情况下，我们需要准备三张图，一张正常颜色图，一张按钮按下图，一张按钮变灰图。若此种类似情况过多，就会导致资源包过大，这显然不是我们愿意看到的结果。此种情况下，我们就可以考虑修改程序的方法，实现正常颜色图变灰，就可以减少资源图。

<br>　　范例1：创建灰度精灵。
``` lua
function MainScene:ctor()
    local sprite = display.newGraySprite("CheckBoxButton2On.png")
    sprite:center()
    self:addChild(sprite)
end
```



<br>**本节参考阅读：**
- [深入分析Cocos2d-x 2.0中的“纹理”](http://blog.csdn.net/honghaier/article/details/8068895) 
- [cocos2d-x动画（子龙山人译）](http://blog.sina.com.cn/s/blog_5f366d7d010166fb.html) 
- [Starling学习笔记之Sprite sheet、Texture](http://bbs.9ria.com/thread-103181-1-1.html)

## Layer ##
　　Layer对象是一种特殊的显示对象，主要功能是响应触摸事件、重力感应事件，以及 Android 按键事件。
　　对象继承关系： `Ref` -> `Node` -> `Layer`

### LayerColor ###
　　颜色布景层类LayerColor是Layer类的子类，包含Layer类的特性，并且有两个拓展功能：可以为布景层增添颜色，以及设置不透明度。

<br>　　范例1：创建颜色层。
``` lua
function MainScene:ctor()
    local layer1 = cc.LayerColor:create(cc.c4b(192, 0, 0, 255), 200, 200)
    layer1:setPosition(display.cx, display.cy)
    self:addChild(layer1)
end
```
    语句解释：
	-  LayerColor:create(颜色, 宽度, 高度) ，其中后两个参数可以省写。
	-  默认情况下对LayerColor设置锚点是不起作用的，使用如下语句即可：
	-  colorLaye:ignoreAnchorPointForPosition(false)

<br><br>