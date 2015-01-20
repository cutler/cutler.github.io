---
layout: post
title: "第五章 用户界面"
date: 2015-1-4 16:49:00
comments: true
categories: Cocos2dx-lua
---
　　在没有`GUI`系统框架之前，我们想要设计复杂的`UI`非常困难，更甚者手动写出来的效果并不是我们想要的，如果开发类似`MMORPG`游戏，那些丰富的`UI`更是让我们无从下手。只是因为没有一个统一的`UI`框架，当然我们可以自己实现，但是工作量却非常大，写好了`UI `库，还需要设计工具。 现在这一切官方都已经给出了完整的解决方案。
　　quick在`3.x`版本中会不断的完善自己的UI系统，让开发者可以更加方便的进行游戏开发了。

　　源码地址：`src/framework/cc/ui/*.lua`。


# 第一节 基本控件 #
　　本节将介绍一些常用的控件（文本标签、输入框、按钮、图片）等。

## UILabel ##
　　在游戏中，文字占有很重要的位置，游戏的介绍、游戏中的提示和对话等都需要用到文字。Cocos2d-x在文字渲染方面提供了非常灵活的机制，既可以直接使用系统文字，也可以直接渲染字体，文本渲染类的继承关系如下图所示：

<center>
![文本渲染类的继承关系](/img/quick-cocos2d-x/quick_5_1.png)
</center>

　　该图展示了引擎用于处理文字的三个类：`LabelAtlas`、`LabelBMFont`、`LabelTTF`。
　　这三个类都是通过不同的方式来显示文字的，从图中可以看出，它们都继承于`LabelProtocol`协议。
　　从类名中能够发现一个共同的单词“`Label`”，在Cocos2d-x中，`Label`表示了一个文本标签的概念，可以将其看作是专门用于显示文字的对象。
　　它们三个类都有一个共同的父类`Node`，在实际的游戏开发中，我们可以按照需要来选择一种或多种方式显示文字。

<br>**已经废弃**
　　在`Cocos2d-x 3.x`版本中，已经废弃了`2.x`里的`LabelTTF`、`LabelAtlas`、`LabelBMFont`三个字体类，取而代之的是全新的字体标签`Label`。
　　实际上`Label`是将三个字体类进行了融合，进行统一的管理与渲染，这使得创建字体标签`Label`的方式更加统一，更加方便。

　　本节就来学习一下`3.x`中新的标签类`Label`，但是刚才也说了，Label只是将上面三个类进行了融合，因此我们还是得需要了解这三个类的特点，不然开发的时候就不会知道何时该用哪个类了。

### TTF类型标签 ###
　　TTF（TrueTypeFont）是由美国苹果公司和微软公司共同开发的一种电脑轮廓字体类型标准。这种类型字体文件的扩展名是`.ttf`。随着windows的流行，已经变成最常用的一种字体文件表示方式。
　　`LabelTTF`就是Cocos2d-x引擎中使用`TTF`字体的文字标签。 下图展示了它的继承关系：

<center>
![](/img/quick-cocos2d-x/quick_5_2.png)
</center>

　　通过此图可以看到，此类的另一个父类就是`Node`，因而它可以执行`Node`所支持的各种动作以及变化效果。

　　TTF类型标签的优缺点有以下几点：
	-  大小任意。TTF字体可以随意调整字体的大小、颜色以及样式。
	-  普及广泛。因为TTF标准得到了普及，所以在很多的操作系统中已经内置提供了多种TTF字体，我们无需任何的编辑，就可以直接使用。
	-  创建和更新的过程将会比较缓慢。TTF文本实际上是以图片的形式存在于内存中的，因此在文本初始化、更新时需要依据文本的内容来创建一个新的纹理图片。


<br>　　范例1：创建TTF类型的文本标签。
``` lua
function MainScene:ctor()
    cc.ui.UILabel.new({
            UILabelType = 2, text = "Hello, World!", size = 64})
        :align(display.CENTER, display.cx, display.cy)
        :addTo(self)
end
```
    语句解释：
	-  使用cc.ui.UILabel类来创建一个TTF类型的文本标签，它可以接受若干参数，参数以一个表的形式传递。下面介绍本范例涉及到的属性：
	   -  UILabelType：文本标签的类型。目前有两个取值：
	      -  UILabel.LABEL_TYPE_BM   = 1
	      -  UILabel.LABEL_TYPE_TTF  = 2
	   -  text：要显示的文本。
	   -  size：字体的大小。因为是TTF字体，所以可以任意指定尺寸
	-  align()：用来设置当前Node对象的锚点和位置。  定义在：src\framework\cc\cocos2dx\NodeEx.lua中。
	-  addTo()：用来将当前Node对象添加到指定的Node对象中。 定义在：src\framework\shortcodes.lua中。

<br>　　范例2：多行文字。
``` lua
function MainScene:ctor()
    local label = cc.ui.UILabel.new({
        UILabelType = 2,
        text = "Hello, World\n您好，世界", -- 使用\n用来换行
        font = "Arial",
        size = 64,
        color = cc.c3b(255, 0, 0), -- 使用纯红色
        align = cc.TEXT_ALIGNMENT_LEFT,
        valign = cc.VERTICAL_TEXT_ALIGNMENT_TOP,
        dimensions = cc.size(400, 200)  -- 如果只想设置宽度，而不限制高度，则高度设置为0即可。
    })
    label:align(display.CENTER, display.cx, display.cy)
    label:addTo(self)
end
```
    语句解释：
	-  font：字体名（可选），如果是非系统自带的TTF字体，那么指定为字体文件名。
	-  color：文字颜色（可选），用cc.c3b()指定，默认为白色。
	-  align：文字的水平对齐方式（可选）。
	-  valign：文字的垂直对齐方式（可选），仅在指定了dimensions参数时有效。
	-  dimensions：文字显示对象的尺寸（可选），使用cc.size()指定。

　　align 和 valign 参数可用的值：

	-  cc.TEXT_ALIGNMENT_LEFT 左对齐
	-  cc.TEXT_ALIGNMENT_CENTER 水平居中对齐
	-  cc.TEXT_ALIGNMENT_RIGHT 右对齐
	-  cc.VERTICAL_TEXT_ALIGNMENT_TOP 垂直顶部对齐
	-  cc.VERTICAL_TEXT_ALIGNMENT_CENTER 垂直居中对齐
	-  cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM 垂直底部对齐

<br>　　效果图预览：

<center>
![](/img/quick-cocos2d-x/quick_5_3.png)
</center>

<br>　　在`cc.ui.UILabel`中提供了一个`setString()`函数，用来修改其显示的文本。
　　对于`TTF`类型的文本标签来说`setString()`函数会创建一个新的`OpenGL`纹理，这意味着`setString()`和创建一个新的标签一样慢。 
　　所以，当需要频繁的更新文本内容（比如1秒钟更新几十次，而且每次更新的文本都很长）的时候，尽可能的不用去使用`LabelTTF`对象，而应该使用`LabelAtlas`或者是`LabelBMFont`。如果不需要频繁更新文本的则使用`LabelTTF`是最好的选择。

### BMFont类型标签 ###
　　`BMFont(bitmapfont)`标签类是引擎当中最快速最自由的字体类。不过，这也意味着它是使用起来最麻烦的字体。想在游戏中使用`LabelBMFont`类来绘制文字，开发者至少要有一个编辑器。下图展示了此类的继承关系：

<center>
![](/img/quick-cocos2d-x/quick_5_4.png)
</center>

<br>**是什么**

　　`LabelBMFont`是Cocos2d-x支持的一种文本字体类型。

　　源文件预览图：

<center>
![](/img/quick-cocos2d-x/quick_5_5.png)
</center>

　　它由两个文件组成：
	-  一个png图片文件。里面包含一些用户自定义的字符（上图中的test.png）。
	-  一个纯文本的配置文件。配置文件以.fnt为后缀，用来对png图片的内容进行描述（上图中的test.fnt）。

<br>**作用与特点**
　　作用：我们在一些游戏中看到的各种漂亮的字体、符号等都是通过`LabelBMFont`来创建的。

　　`LabelBMFont`标签类的特点：

	-  需要一个图片编辑器，用于编辑字体的纹理图集。
	-  具备了很快的创建以及更新速度。
	-  自由度非常高，每一个字母或者符号都是单独的精灵。
	-  自制的字体方式，开发者可以自定义其中的字母以及符号，甚至可以包含阴影、外框以及花纹。

<br>　　使用BMFont标签的关键在于如何创建自定义的字体文件，而BMFont本身的使用则十分简单。比较推荐的创建字体文件的工具是`Hiero`，它是一个可执行`java`程序，因此`Hiero`需要计算机安装`JDK`。

　　[点击下载：http://www.n4te.com/hiero/hiero.jnlp](http://www.n4te.com/hiero/hiero.jnlp)

<br>**Hiero界面预览**

<center>
![](/img/quick-cocos2d-x/quick_5_6.jpg)
</center>

<br>　　整个Hiero软件分为`Font`、`SampleText`、`Effects`、`Padding`、`Rendering`五个模块，它们的作用分别为：

	-  Font：基准字体相关的设置。 
	   -  System：操作系统提供的字体。
	   -  File：自己的ttf文件。
	   -  Size：字体的大小。 Bold设置是否粗体，Italic设置是否斜体。
	-  SampleText：导出的png图片中所要包含的字符。
	-  Effects：设置字体的特效。如：Color(颜色)、Shadow(阴影)等。
	-  Padding：设置字体的padding属性。
	-  Rendering：字体展现相关的设置。
	   -  Sample text：预览效果。
	   -  Glyph cache：设置导出的png的尺寸等信息。

<br>**创建字体文件**
　　创建字体文件时遵循如下步骤：
	-  首先，在“Font”栏中选择你想要使用的字体。 
	   -  如果没有你需要的字体，使用“File”项可以将你自己的字体导入到Hiero软件中使用。
	   -  “Size”项用来设置字体的大小。 “Bold”和“Italic”设置是否粗体和斜体。
	-  然后，在“Sample Text”栏中输入你想导出的字符。 
	-  接着，在“Effects”中设置字体的效果。比如颜色、阴影等。
	   -  以设置Color为例，点击“Color”后，然后点击“Add”按钮，然后点击下面的颜色条就会弹出一个“颜色选择框”，选择后即可。
	-  接着，在“Padding”可以设置每个字符的padding属性。
	-  最后，一切设置完毕后，点击“File”菜单，选择“Save BMFont files(text)...”。

<br>**使用字体文件**

<br>　　范例1：创建BMFont字体。
``` lua
function MainScene:ctor()
    local label = cc.ui.UILabel.new({
        UILabelType = 1,
        text = "诗歌\n灵魂背后纹诗歌",
        font = "test.fnt",
    })
    label:align(display.CENTER, display.cx, display.cy)
    label:addTo(self)
end
```
    语句解释：
	-  UILabel会从res目录下查找字体文件。
	-  同样可以调用setString方法来修改内容。

<br>　　效果图：

<center>
![](/img/quick-cocos2d-x/quick_5_7.png)
</center>

<br>**本节参考阅读：**
- [cocos2dx——新字体标签Label](http://shahdza.blog.51cto.com/2410787/1560612)
- [渲染框架之文本类的使用](http://blog.csdn.net/yangyu20121224/article/details/9564983)
- [Cocos2d的字体生成软件Hiero v2.0](http://www.cnblogs.com/eagley/archive/2010/09/10/1823236.html)

## UIInput ##
　　`UIInput`表示一个文本框，在本节将会介绍`EditBox`和`TextFieldTTF`两种不同类型的文本框。与`UILabel`一样，在`3.x`版本中`UIInput`也是融合了它们二者。

### EditBox ###
　　`EditBox`用来构建一个文本框。当用户点击文本框时会弹出一个输入对话框，输入完毕后对话框会内容回填到文本框中去。
　　通常，在游戏中弹出输入对话框的用户体验并不好，因此对于那些经常需要用户输入文本的游戏来说，并不推荐使用`EditBox`来实现文本框。虽然如此，但它也有自己的优点。

<br>　　范例1：创建`EditBox`文本框。
``` lua
function MainScene:ctor()
    local function onEdit(event, editbox)
        if event == "began" then
            print("开始输入")
        elseif event == "changed" then
            print("输入框内容发生变化")
        elseif event == "ended" then
            print("输入结束")
        elseif event == "return" then
            print("从输入框返回")
        end
    end
    local editbox = cc.ui.UIInput.new({
        image = "edit.png",
        listener = onEdit,
        size = cc.size(200, 40),
        x = display.cx,
        y = display.cy,
    })
    editbox:addTo(self)
end
```
    语句解释：
	-  使用cc.ui.UIInput来创建一个文本框。下面列出它的常用属性：
	   -  image：输入框的背景图像，可以是图像名或是Sprite9Scale显示对象。用display.newScale9Sprite()创建Sprite9Scale显示对象。
	   -  imagePressed：输入状态时输入框显示的图像（可选）。
	   -  imageDisabled：禁止状态时输入框显示的图像（可选）。
	   -  listener：回调函数。
	   -  size：输入框的尺寸，用 cc.size(宽度, 高度) 创建。
	   -  x, y：坐标（可选）。
	-  另外cc.ui.UIInput还有一个属性：UIInputType，用来设置输入框的类型。取值有：
	   -  1 或 nil 表示创建EditBox输入框。
	   -  2 表示创建TextFieldTTF输入框。


<br>　　范例2：`EditBox`文本框的其他操作。
``` lua
function MainScene:ctor()
    local editbox = cc.ui.UIInput.new({
        image = "edit.png",
        size = cc.size(200, 40),
        x = display.cx,
        y = display.cy,
    })
    -- 设置hint文本
    editbox:setPlaceHolder("Password:")
    -- 密码框样式
    editbox:setInputFlag(0)
    -- 设置字体名称和大小
    editbox:setFont("Arial", 20)
    -- 设置字体的颜色
    editbox:setFontColor(cc.c3b(255, 0, 0))
    -- 设置默认显示的文本
    editbox:setText("Hello World!!")
    -- 读取文本框当前的内容
    print(editbox:getText())
    editbox:addTo(self)
end
```
    语句解释：
	-  hint文本就是文本框默认显示的文字，当其获得焦点时，文本即消失。
	-  相应的EditBox也提供了修改PlaceHolder所使用的字体的大小、颜色等函数。

### TextFieldTTF ###
　　此种文本框解决了`EditBox`的问题，它允许开发者通过代码来控制何时弹出(或关闭)输入法，同时用户输入的内容会被实时直接显示到`TextFieldTTF`上面。
　　缺点： 没有`EditBox`封装的完整，如果你要使用`TextFieldTTF`那么事件监听、设置文本框的背景、输入光标等工作都得自己实现。

<br>　　范例1：创建`TextFieldTTF`文本框。
``` lua
function MainScene:ctor()
    local function onEdit(textfield, eventType)
        if event == 0 then
            prnit("ATTACH_WITH_IME")
        elseif event == 1 then
            prnit("DETACH_WITH_IME")
        elseif event == 2 then
            prnit("INSERT_TEXT")
        elseif event == 3 then
            prnit("DELETE_BACKWARD")
        end
    end
    local editbox = cc.ui.UIInput.new({
        UIInputType = 2,
        size = cc.size(200, 40),
        x = display.cx,
        y = display.cy,
        placeHolder = "Password:",
        passwordEnable = true,
        passwordChar = "-",
        fontSize = 25,
        font = "Arial",
        maxLength = 10,
        listener = onEdit,
    })
    editbox:addTo(self)
end
```
    语句解释：
	-  创建一个TextFieldTTF类型的文本框需要将UIInputType设置为2。
	-  maxLength属性用来设置文本框最大能输入的字符数量。
	-  TextFieldTTF类型的文本框需要在真机上运行时才能触发回调方法，因为模拟器中是无法弹出软键盘的。

<br>　　范例2：`TextFieldTTF`文本框的其他操作。
``` lua
-- 设置字体的颜色
editbox:setColor(display.COLOR_BLUE)
-- 显示软键盘
editbox:attachWithIME()  
-- 隐藏软键盘
editbox:detachWithIME()  
-- 设置文本
editbox:setString("AAA张三")   
-- 获取文本
editbox:getString()
```
    语句解释：
	-   在模拟器上是调不出软键盘的，必须得在真机上。

<br>　　如果上述的这两种创建文本框的方式都不能满足需求的话，可以在它们基础上进行再次封装。

## UIButton ##
　　`UIButton`表示一个按钮，在本节将会介绍`UIPushButton`和`UICheckBoxButton`两种不同类型的按钮。

### UIPushButton ###
　　`UIPushButton`表示一个普通的按钮，可以依据不同的状态(按下、禁用等)来显示不同的图片。

<center>
![UIPushButton效果图](/img/quick-cocos2d-x/quick_5_8.png)
</center>

<br>　　范例1：创建`UIPushButton`。
``` lua
function MainScene:ctor()
    -- 背景图片。分别在按钮处于正常、按下、禁用状态下显示。
    local images = { 
        normal = "Button01.png",
        pressed = "Button01Pressed.png",
        disabled = "Button01Disabled.png",
    }
    -- 创建一个UIButton
    local newButton = cc.ui.UIPushButton.new(images, {scale9 = true})
    -- 按钮尺寸
    newButton:setButtonSize(200, 60)
    newButton:center()
    -- 点击事件
    newButton:onButtonClicked(function ()
        print("onClick")
    end)
    -- 设置显示的文字
    newButton:setButtonLabel("normal", cc.ui.UILabel.new({text = "normal", size = 22, color = cc.c3b(0, 0, 0),font="Marker Felt"}))
    newButton:setButtonLabel("pressed", cc.ui.UILabel.new({text = "pressed", size = 22, color = cc.c3b(0, 0, 0)}))
    newButton:addTo(self)
end
```
    语句解释：
	-  设置“scale9 = true”用于标志是否允许拉伸图片到按钮的尺寸。 这里的所说的.9图片和android中的做法完全一样，图片的后缀名不用带.9 。

### UICheckBoxButton ###
　　`UICheckBoxButton`表示一个可以被选中的按钮。具体来说，多选按钮和单选按钮都可以用它来实现。

<center>
![UICheckBoxButton效果图](/img/quick-cocos2d-x/quick_5_9.png)
</center>

<br>　　范例1：创建`UICheckBoxButton`。
``` lua
function MainScene:ctor()
    -- 背景图片。分别在按钮处于正常、按下、禁用状态下显示。
    local images = { 
        off = "CheckBoxButton2Off.png",
        on = "CheckBoxButton2On.png",
    }
    -- 创建一个UIButton
    local newButton = cc.ui.UICheckBoxButton.new(images, {scale9 = true})
    -- 按钮尺寸
    newButton:setButtonSize(48, 48)
    newButton:center()
    -- 点击事件
    newButton:onButtonClicked(function ()
        print("onClick")
    end)
    newButton:setButtonLabelOffset(40, -5)
    -- 设置显示的文字
    newButton:setButtonLabel("off", cc.ui.UILabel.new({text = "normal", size = 22}))
    newButton:setButtonLabel("on", cc.ui.UILabel.new({text = "pressed", size = 22}))
    newButton:addTo(self)
end
```
    语句解释：
	-  复选框的图片状态还可以有：off_pressed、off_disabled、on_pressed、on_disabled 。
	-  复选框按钮的标签同样可以设置字体名、字体颜色。
	-  使用setButtonLabelOffset()函数设置图片和文本之间的距离。

<br>　　范例2：状态改变事件。
``` lua
newButton:onButtonStateChanged(function (event)
    print(event.name .. "," .. event.state)
end)
```
    语句解释：
	-  可以同时给UICheckBoxButton设置点击事件和状态改变事件监听器，状态改变事件将先被触发。 参数event有三个常用属性：
	   -  state：表示当前按钮的选中状态，取值on或者off。
	   -  target：产生事件的按钮的引用。
	   -  name：事件的名称，如：STATE_CHANGED_EVENT 。

<br>　　范例3：单选按钮。
``` lua
-- 本函数用来创建一个按钮。
function MainScene:createCheckBoxButton()
    local images = { 
        off = "CheckBoxButton2Off.png",
        on = "CheckBoxButton2On.png",
    }
    local newButton = cc.ui.UICheckBoxButton.new(images)
    newButton:onButtonStateChanged(function (event)
        print("onButtonStateChanged")
    end)
    return newButton
end

-- MainScene的构造方法
function MainScene:ctor()
    local group = cc.ui.UICheckBoxButtonGroup.new(display.LEFT_TO_RIGHT)
    group:addButton(self:createCheckBoxButton())
    group:addButton(self:createCheckBoxButton())
    group:addButton(self:createCheckBoxButton())
    group:center()
    group:addTo(self)
end
```
    语句解释：
	-  使用UICheckBoxButtonGroup的addButton()函数来将各个复选按钮组织在一起，然后只需要把按钮组添加到Scene或Layer中即可。
	-  当用户选择了按钮组中的某个按钮时，会同时导致之前被选中的按钮以及新选中的按钮的回调方法被调用。
	-  按钮的排列常用的两种方式：从左到右(display.LEFT_TO_RIGHT)，从上到下(display.TOP_TO_BOTTOM)。
	-  调用按钮的setButtonSelected()方法可以修改当前选中状态。
	-  调用UICheckBoxButtonGroup的setButtonsLayoutMargin(top, right, bottom, left)方法设置按钮组中各个按钮间的距离。

## UIImage ##
　　`UIImage`表示一张图片。通过查看它的源码可以知道，`UIImage`本质上就是一个`Sprite`对象。

　　`UIImage`有三种显示图片的方式：

	-  按照普通图片显示，但不为UIImage控件指定大小，图片会保持原始尺寸。
	-  按照普通图片显示，但会为UIImage控件指定大小，为了让图片填充满控件，系统会对图片进行放大或缩小(这样通常会导致图片模糊)。
	-  按照NinePatch格式显示。

<br>　　范例1：按原始比例显示图片。
``` lua
local image = cc.ui.UIImage.new("checkbox_checked.png")
image:setAnchorPoint(cc.p(0.5, 0.5))
image:center()
image:addTo(self)
```
    语句解释：
	-  使用cc.ui.UIImage类来显示一张图片。

<br>　　范例2：设置UIImage的宽高。
``` lua
local image = cc.ui.UIImage.new("checkbox_checked.png",{scale9=true})
image:setAnchorPoint(cc.p(0.5, 0.5))
image:setContentSize(cc.size(300,300))
image:center()
image:addTo(self)
```
    语句解释：
	-  创建的同时可以指定“{scale9=true}”，用来告诉系统该图片支持拉伸。
	-  当同时满足如下三个条件时，显示出来的图片会被拉伸到模糊：
	   -  UIImage显示的图片并不是NinePatch格式的图片（即整张图片都充满了内容，没有可以拉伸的地方）。
	   -  UIImage创建的时候，为其指定了“{scale=true}”的参数。
	   -  为UIImage设置的宽高比它所要显示的图片的分辨率要大。
	-  以上的任何一个条件不满足都不会导致图片被拉伸。

# 第二节 高级控件 #
　　本节将介绍一些常用的高级控件（滑块、UIPageView、UIListView）等。

## UISlider ##
　　`UISlider`是一个可以拖动的进度条，和Android中的`SeekBar`类似。创建它的时候，需要提供两张图片：

	-  滑动条的图片(下图中绿色部分)
	-  滑动块(下图中的按钮)的图片
　　其中，滑动条的图片可以既是`NinePatch`格式的也可以是普通png格式的。

<center>
![UISlider效果图](/img/quick-cocos2d-x/quick_5_10.png)
</center>

<br>　　范例1：普通png格式。
``` lua
function MainScene:ctor()
    local slider = cc.ui.UISlider.new(display.LEFT_TO_RIGHT, { 
        bar = "SliderBarNo9.png",
        button = "SliderButton.png"
    })
    slider:setSliderValue(75)
    slider:center()
    slider:addTo(self)
end
```
    语句解释：
	-  使用cc.ui.UISlider类来创建一个滑动条。
	-  UISlider可以设置拖动条的方向为：从左到右、从右到左、从上到下、从下到上。 它们所对应的常量保存在display.lua文件中。
	-  使用setSliderValue()方法设置UISlider的当前值，默认的最大值为100 ，最小值为0。
	-  UISlider也可以依据不同的状态显示不同的图片。如：press、disable等，具体用法请参看源码。
	-  不为UISlider指定大小时，UISlider的尺寸就是滑动条图片的尺寸。

<br>　　范例2：NinePatch格式。
``` lua
function MainScene:ctor()
    local slider = cc.ui.UISlider.new(display.LEFT_TO_RIGHT, 
        {bar = "SliderBar.png", button = "SliderButton.png"},
        {scale9 = true}
    )
    slider:setSliderValue(75)
    slider:setSliderSize(200, 40)
    slider:center()
    slider:addTo(self)
end
```
    语句解释：
	-  只要在创建UISlider的时候没有设置“{scale9 = true}”，则调用setSliderSize()方法时就会直接抛出异常。
	-  UISlider与UIImage一样，必须同时满足三个条件时，滑动块的图片才会被拉伸的模糊：
	   -  UISlider显示的图片并不是NinePatch格式的图片。
	   -  UISlider创建的时候，为其指定了“{scale=true}”的参数。
	   -  为UISlider设置的宽高比它所要显示的图片的分辨率要大。

<br>　　范例3：事件监听。
``` lua
slider:onSliderValueChanged(function(event)
    print(string.format("value = %0.2f", event.value))
end)
```
    语句解释：
	-  当用户拖动滑块时会不断的回调此方法。
	-  调用slider的setSliderButtonRotation(120)方法可以设置滑动按钮的旋转角度。

## UIPageView ##
　　`UIPageView`与Android中的`ViewPager`控件是一样的。 

<br>　　范例1：创建UIPageView。

<center>
![效果图](/img/quick-cocos2d-x/quick_5_11.png)
</center>

　　代码为：
``` lua
function MainScene:ctor()
    self.pv = cc.ui.UIPageView.new({
        -- 设置每个Page中水平和垂直方向上包含的item的个数。默认都为1。
        column = 3, row = 3,
        -- 设置每个Page中各个item间水平和垂直方向上的间距。默认都为0。
        columnSpace = 10, rowSpace = 10,
        -- 设置UIPageView的位置与尺寸。
        viewRect = cc.rect(0, display.cy, 640, 480),
        -- 设置UIPageView四周的间隙。
        padding = {left = 20, right = 20, top = 20, bottom = 20},
    })
    self.pv:addTo(self)

    -- 为UIPageView添加18个子元素。
    for i=1,18 do
        -- 通过UIPageView来创建一个UIPageViewItem对象。
        local item = self.pv:newItem()
        -- 创建一个LayerColor对象。
        local content = cc.LayerColor:create(cc.c4b(math.random(250), math.random(250), math.random(250), 250))
        content:setContentSize(190, 140)
        content:setTouchEnabled(false)
        -- 将LayerColor添加到UIPageViewItem对象中。
        item:addChild(content)
        self.pv:addItem(item)
    end
    -- 让UIPageView重新绘制。 每次添加新UIPageViewItem时都应该调用它。
    self.pv:reload()
end
```
    语句解释：
	-  UIPageView除了本范例用的6个属性外，还有一个bCirc属性，用来页面是否循环，默认为false。


<br>　　范例2：事件监听。
``` lua
function MainScene:ctor()
    self.pv = cc.ui.UIPageView.new({
        viewRect = cc.rect(0, 0, display.width, display.height)
    })
    -- 为UIPageView设置回调函数，当它被Touch的时候会调用此回调函数。
    self.pv:onTouch(function (event)
        print(event.pageIdx)
    end)
    self.pv:addTo(self)

    for i=1,4 do
        local item = self.pv:newItem()
        local content = cc.LayerColor:create(cc.c4b(math.random(250), math.random(250), math.random(250), 250))
        content:setContentSize(190, 140)
        content:setPosition(display.width/2, display.height/2)
        content:ignoreAnchorPointForPosition(false)
        content:setTouchEnabled(false)
        item:addChild(content)
        self.pv:addItem(item)
    end
    self.pv:reload()
end
```
    语句解释：
	-  调用UIPageView的onTouch函数设置事件监听器。
	-  除了以上列出的方法外，UIPageView还提供了其他很多实用的方法，比如gotoPage、getPageCount等等。
	-  更多关于UIPageView的用法请参看它的源代码，源码路径为：src/framework/cc/ui/UIPageView.lua。


# 第三节 Cocos2d-x控件 #
　　在实际开发中，上面介绍的`quick`内置控件可能无法满足我们的需求，此时就可以使用一些`Cocos2d-x`所提供的`C++`控件，本节将介绍一些常用的控件。

## ControlSlider ##
　　`ControlSlider`是一个可以拖动的进度条，和`UISlider`类似。它们的不同点：

	-  显示效果不同：
	   -  UISlider由两张图片组成，滑动条的图片和滑动块(用于拖动进度)的图片。
	   -  ControlSlider由三张图片组成，它比UISlider多了一张进度图片（即下图所示的蓝色部分）。
	-  ControlSlider支持更多的操作。  

<center>
![ControlSlider效果图](/img/quick-cocos2d-x/quick_5_12.png)
</center>

<br>　　范例1：创建滑动块。
``` lua
function MainScene:ctor()
    -- 创建一个CCControlSlider对象，同时为它设置三张图片，它们依次对应：黑色凹槽、蓝色进度条、银色的原型拖动按钮。
    local pSlider = cc.ControlSlider:create("sliderTrack.png","sliderProgress.png" ,"sliderThumb.png")
    pSlider:setAnchorPoint(cc.p(0.5, 1.0))
    -- 设置最大和最小值
    pSlider:setMinimumValue(0.0)
    pSlider:setMaximumValue(5.0)
    -- 设置默认值
    pSlider:setValue(3.0)
    pSlider:setPosition(cc.p(display.width / 2, display.height / 2 + 16))
    self:addChild(pSlider)
end
```
    语句解释：
	-  注意调用create()方式时，用的是“:”号。
	-  默认情况下，ControlSlider的宽度就是进度条和凹槽图片的宽度。

<br>　　范例2：最大、最小可用值。
``` lua
pSlider:setMaximumAllowedValue(4.0)
pSlider:setMinimumAllowedValue(1.5)
```
    语句解释：
	-  当滑动到4和1.5时，就没法继续滑动了。

<br>　　范例3：事件监听器。
``` lua
function MainScene:ctor()
    -- 创建一个CCControlSlider对象，同时为它设置三张图片。
    local pSlider = cc.ControlSlider:create("sliderTrack.png","sliderProgress.png" ,"sliderThumb.png")
    pSlider:setAnchorPoint(cc.p(0.5, 1.0))
    pSlider:setMinimumValue(0.0)
    pSlider:setMaximumValue(5.0)
    -- 回调函数
    local function valueChanged(pSender)
        if nil == pSender then
            return
        end
        local pControl = tolua.cast(pSender,"cc.ControlSlider")
        if pControl:getTag() == 1 then
            print(pControl:getValue())
        end
    end
    pSlider:setPosition(cc.p(display.width / 2, display.height / 2 + 16))
    -- 与Android中View的setTag()函数类似，用于给控件设置一个附加信息，以便后面使用。	
    pSlider:setTag(1)
    -- 设置监听器
    pSlider:registerControlEventHandler(valueChanged, cc.CONTROL_EVENTTYPE_VALUE_CHANGED)
    self:addChild(pSlider)
end
```
    语句解释：
	-  值得注意的是，当滑动到了最小值(或最大)时，若不松手继续滑动，则仍然会不断调用回调函数。
	-  监听的事件名为：cc.CONTROL_EVENTTYPE_VALUE_CHANGED。
	-  回调函数为：valueChanged。

## ControlButton ##
　　`ControlButton`是一个按钮，也支持在按下和松开按钮时显示不同的图片，但与其他按钮最大的不同之处在于，当被按下时显示的图片会被放大。如下图所示：

<center>
![ControlButton效果图](/img/quick-cocos2d-x/quick_5_13.png)
</center>

　　数字1被按下，它的大小明显比没被按下的数字要大。 

<br>　　范例1：创建`ControlButton`。
``` lua
function MainScene:ctor()
    -- 创建两个图片，分别在按钮处于正常和高亮状态(即按下状态)下显示
    local normalImg = ccui.Scale9Sprite:create("button.png")
    local highlightedImg = ccui.Scale9Sprite:create("button.png")
    -- 设置按钮显示的文本
    local label = cc.LabelTTF:create("缩放", "Marker Felt", 30)
    label:setColor(cc.c3b(159, 168, 176))
    -- 使用ControlButton:create(标签对象，正常状态显示的图片)方法创建ControlButton对象。
    local pButton = cc.ControlButton:create(label, normalImg)
    -- 设置按钮在高亮状态下所要使用的背景图片、字体颜色、显示文本
    pButton:setBackgroundSpriteForState(highlightedImg, cc.CONTROL_STATE_HIGH_LIGHTED)
    pButton:setTitleColorForState(display.COLOR_RED, cc.CONTROL_STATE_HIGH_LIGHTED)
    pButton:setTitleForState("按下", cc.CONTROL_STATE_HIGH_LIGHTED)
    -- 设置按钮的尺寸
    pButton:setPreferredSize(cc.size(130,61))
    pButton:setPosition(display.cx,display.cy)
    self:addChild(pButton)
end
```
    语句解释：
	-  之前已经说过了，cc.LabelTTF被废弃（不推荐使用）了，但是我们依然可以使用它，本范例就为读者展示了如何直接使用LabelTTF。
	-  ControlState状态变量取值如下：
	   -  cc.CONTROL_STATE_DISABLED        禁用
	   -  cc.CONTROL_STATE_HIGH_LIGHTED    高亮
	   -  cc.CONTROL_STATE_NORMAL          正常
	   -  cc.CONTROL_STATE_SELECTED        选中

<br>　　范例2：事件监听。
``` lua
pButton:registerControlEventHandler(回调函数, 事件类型)
```
    语句解释：
	-  调用ControlButton的registerControlEventHandler方法设置事件监听器，共有8个可监听的事件类型：
	   -  cc.CONTROL_EVENTTYPE_TOUCH_DOWN         刚刚开始触摸按钮时
	   -  cc.CONTROL_EVENTTYPE_DRAG_INSIDE        在内部拖动时（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_DRAG_OUTSIDE       在外部拖动时（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_DRAG_ENTER         拖动刚进入内部时（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_DRAG_EXIT          拖动刚离开内部时（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_TOUCH_UP_INSIDE    在内部抬起手指（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_TOUCH_UP_OUTSIDE   在外部抬起手指（保持触摸状态下）
	   -  cc.CONTROL_EVENTTYPE_TOUCH_CANCEL       取消触点时


<br><br>