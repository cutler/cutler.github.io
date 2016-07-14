---
title: "Cocos2dx篇　第六章 多媒体"
date: 2015-1-7 15:21:49
comments: true
categories: 游戏开发
---
　　本章将介绍一下`Cocos2d-x`中的多媒体部分，包括：动画（Action、粒子动画、骨骼动画）、滤镜、音视频播放等等。


# 第一节 动画 #

## 动作 ##
　　游戏的世界是一个动态的世界，无论是主角精灵还是`NPC`精灵都处于不断的运动当中，甚至是背景中漂流的树叶，随风而动的小草。这些明显的或者不明显的运动构成了我们栩栩如生的游戏世界。
　　而精灵移动的动态效果（`缩放`、`闪烁`和`旋转`等），它们每一种效果都可以看成是精灵的一个`Action`(动作)。从技术上来说，`Action`的本质就是改变某个图形对象的位置，角度，大小等属性。

### Action ###
　　和之前介绍的`Node`等显示对象不同，`Cocos2d-x`的动作类`Action`并不是一个在屏幕中显示的对象，动作必须要依托于`Node`类及它的子类的实例才能发挥作用。

　　`Action`类的继承关系如下图所示：

<center>
![](/img/quick-cocos2d-x/quick_6_1.png)
</center>

<br>　　`Action`类是所有动作类的基类，我们后面将要学习到的所有动作类都是它的子类。而且`Cocos2d-x`提供的动作，并不是只有`Sprite`可以使用，只要是`Node`对象都是可以进行动作操作的。

　　从上图可以看出，`Action`类有四个子类：

	-  FiniteTimeAction：有限次动作执行类。即按时间顺序执行一系列动作，执行完后动作结束。
	-  Speed：调整实体(节点)的执行速度。
	-  Follow：可以使节点跟随指定的另一个节点移动。

　　其中`FiniteTimeAction`又有两个子类：延时动作和瞬时动作。

	-  ActionInterval(延时动作)：执行需要一定的时间（或者说一个过程，如5秒内移动到指定位置、3秒内旋转360度等）。
	-  ActionInstanse(瞬时动作)：跟ActionInterval主要区别是没有执行过程，动作瞬间就执行完成了（如让Node隐藏和显现等）。
	
<br>　　范例1：在显示对象上运行一个动作很简单。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    -- 用0.3秒的时间，将node从当前位置移动到100, 200
    node:runAction(cc.MoveTo:create(1.3, cc.p(100, 200)))
end
```
    语句解释：
	-  本范例中的runAction方法用来执行一个动作，它定义在Node类中，因此Node的各个子类都可以直接调用该方法。
	-  MoveTo的具体语法后面会介绍，现在只需要知道它代表一个移动动作，也就是说可以让执行它的Node对象移动到指定的位置上。

<br>　　范例2：如果连续调用多次`runAction()`，可以实现并列执行多个动作，例如，移动的同时旋转。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    node:runAction(cc.MoveTo:create(1.3, cc.p(100, 200)))
    -- 1.3秒内旋转360度
    node:runAction(cc.RotateBy:create(1.3, 360))
end
```
    语句解释：
	-  RotateBy的具体语法后面会介绍，现在只需要知道它代表一个旋转动作，也就是说可以让执行它的Node对象旋转指定的度数。

<br>　　范例3：查询显示对象上当前有多少个动作在执行。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    node:runAction(cc.MoveTo:create(1.3, cc.p(100, 200)))
    node:runAction(cc.RotateBy:create(1.3, 360))
    -- 输出2
    print(node:getNumberOfRunningActions())
end
```

<br>　　动作在执行时间结束后，会自动停止。但我们也可以在需要的时候停止正在执行的动作。

<br>　　范例4：停止Action。
``` lua
local action = cc.MoveTo:create(1.3, cc.p(100, 200))
node:runAction(action)
-- 在需要停止的时候
action:stop()
-- 或者写为
node:stopAction(action)

-- 通过 tag 停止指定的动作
local action = cc.MoveTo:create(1.3, cc.p(100, 200))
action:setTag(1)
node:runAction(action)
-- 在需要停止的时候
node:stopActionByTag(1)
-- 或者写为
local action = node:getActionByTag(1)
action:stop()

-- 停止所有正在执行的动作
local action1 = cc.MoveTo:create(1.3, cc.p(100, 200))
local action2 = cc.RotateBy:create(1.3, 360)
node:runAction(action1)
node:runAction(action2)
node:stopAllActions()
```

<br>**本节参考阅读：**
- [Cocos2d-x 重要概念之---动作（CCAction）](http://bbs.9ria.com/thread-246945-1-1.html)
- [Cocos2d-x 2.0 之 Actions “三板斧” 之一](http://blog.csdn.net/honghaier/article/details/8197892)
- [第12期：动作类CCAction的详细讲解](http://blog.csdn.net/yangyu20121224/article/details/9771645)

### ActionInterval ###
　　根据官网的类结构图可以看出，`ActionInterval`的子类有很多，本节将会详细介绍开发中常用的几种`Action`。

<br>　　范例1：MoveTo与MoveBy。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    node:runAction(cc.MoveBy:create(1.3, cc.p(100, 200)))
end
```
    语句解释：
	-  MoveTo表示“移动”，它会将Node在指定的时间内，从当前位置移动到指定的位置。
	-  MoveBy的用法与MoveTo完全一致，不同的是，MoveBy是将Node从当前位置开始，在x和y轴方向上偏移指定位置。

<br>　　范例2：ScaleTo与ScaleBy。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    -- 让Node在1.5秒内宽度和高度放大到2倍
    node:runAction(cc.ScaleTo:create(1.5, 2, 2))
end
```
    语句解释：
	-  与MoveTo、MoveBy的用法类似。 
	-  构造方法：create(持续时间, x轴放大倍数, y轴放大倍数)。

<br>　　范例3：RotateTo与RotateBy。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    -- 让Node在1.5秒内顺时针旋转180度
    node:runAction(cc.RotateTo:create(1.5, 180))
end
```
    语句解释：
	-  构造方法：create(持续时间, 旋转的度数)
	-  对于RotateTo来说：
	   -  度数为正数，则顺时针方向旋转，反之逆时针方向。
	   -  每跨度180度，则按照相反的方向旋转，如设置旋转190度，则最终看到的效果，只会逆时针旋转170度(即360-190)。
	-  对于RotateBy来说：
	   -  度数为正数，则顺时针方向旋转，反之逆时针方向。
	   -  设置的度数就是真正旋转的度数。 如设置360度，则节点就会顺时针旋转360度。

<br>　　范例4：JumpTo与JumpBy。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    -- 让Node在1.5秒内从当前位置跳向(300, 300)的位置，每次跳跃高度为50，一共跳跃5次。
    node:runAction(cc.JumpTo:create(1.5, cc.p(300, 300), 50, 5))

    -- 向x方向跳动300像素，跳跃高度为50，跳跃次数为4。
    -- node:runAction(cc.JumpBy:create(1.5, cc.p(300, 0), 50, 4))

    -- 原地跳动，高度80，次数为4。
    -- node:runAction(cc.JumpBy:create(1.5, cc.p(0, 0), 80, 4))
end
```
    语句解释：
	-  构造方法：create(持续时间, 目标位置, 跳跃高度, 跳跃次数)
	-  如果目标位置和节点当前所在的位置不一致，则节点会“跳跃的同时并移动”到目标位置。

<br>　　范例5：BezierTo与BezierBy。
``` lua
--  当游戏需要做抛物线效果时，会使用到贝塞尔曲线。 

--  参考阅读：
--  http://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A
--  http://bbs.9ria.com/thread-216954-1-1.html
--  http://bbs.csdn.net/topics/390358020
```

<br>　　范例6：Blink、FadeIn、FadeOut。
``` lua
-- 让Node在1秒内闪烁2次
node:runAction(cc.Blink:create(1, 2))

-- 先设置node为完全透明
node:setOpacity(0)
-- 然后再执行动作，让Node在1秒内变为完全不透明
node:runAction(cc.FadeIn:create(1))

-- 让Node在1秒内变为完全透明
node:runAction(cc.FadeOut:create(1))
```

<br>　　范例7：TintTo与TintBy。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    -- 让Node在2秒内与指定的颜色值进行混合，即对Node进行调色。后面三个参数分别表示要上色的rgb值
    node:runAction(cc.TintTo:create(2, 255, 0, 255))
end
```
    语句解释：
	-  构造方法：create(持续时间, r, g, b)

<br>　　范例8：Sequence与reverse。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    local action1 = cc.MoveBy:create(1, cc.p(80, 80))
    local action2 = action1:reverse()
    node:runAction(cc.Sequence:create(action1, action2))
end
```
    语句解释：
	-  使用Sequence用来创建一个sequence，在sequence中定义的Action会按照先后顺序依次被执行，即前一个没执行完之前，后一个不会被启动。
	-  reverse可以创建出一个反转的action，即该action会从原来action的终点状态向起点状态执行。
	-  Sequence也有reverse方法。

<br>　　范例9：Repeat与RepeatForever。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    local action1 = cc.MoveBy:create(1, cc.p(80, 80))
    local action2 = action1:reverse()
    node:runAction(cc.Repeat:create(cc.Sequence:create(action1, action2), 3))
end
```
    语句解释：
	-  Repeat用来重复执行一个Action(可以是普通的action也可以是sequence)。
	-  构造方法：Repeat:create(action, 重复次数)
	-  而RepeatForever可以用来无限执行一个action。构造方法：RepeatForever:create(action)

<br>　　范例10：运行多个动作。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    local actions = {}
    actions[1] = cc.MoveBy:create(1, cc.p(80, 80))
    actions[2] = actions[1]:reverse()
    actions[3] = cc.JumpBy:create(1, cc.p(0, 0), 50, 3)
    node:runAction(cc.RepeatForever:create(cc.Sequence:create(actions)))
end
```
    语句解释：
	-  使用Lua中的表来创建一个数组，然后将多个动作放入数组中，最后使用这个数组来创建一个Sequence对象。
	-  Sequence中的各个动作按照它们在数组中的顺序来执行。

<br>　　范例11：DelayTime。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    local actions = {}
    actions[1] = cc.MoveBy:create(1, cc.p(80, 80))
    actions[2] = actions[1]:reverse()
    -- 等待2秒
    actions[3] = cc.DelayTime:create(1)
    node:runAction(cc.RepeatForever:create(cc.Sequence:create(actions)))
end
```
    语句解释：
	-  构造方法：create(等待时间)。

<br>　　范例12：Spawn。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    local actions = {}
    actions[1] = cc.MoveBy:create(1, cc.p(40, 0))
    actions[2] = cc.MoveBy:create(1, cc.p(0, -60))
    actions[3] = cc.JumpBy:create(2, cc.p(0, 0), 50, 4)
    actions[4] = cc.RotateBy:create(2, 720)
    node:runAction(cc.RepeatForever:create(cc.Spawn:create(actions)))
end
```
    语句解释：
	-  Spawn和Sequence相反，它会同时执行其内的所有Action，而不是依次执行。

<br>　　范例13：OrbitCamera。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)

    node:runAction(cc.RepeatForever:create(cc.OrbitCamera:create(1, 1, 0, 0, 180, 0, 0)))
end
```
    语句解释：
	-  ActionCamera及其子类(OrbitCamera)封装了摄像机相关的动作。
	-  OrbitCamera使用球坐标系围绕节点中心旋转摄像机的视角。简单的说，它可以用3d的方式360度无死角的观察节点，以产生节点被旋转的效果，而Rotate只可以平面方式旋转节点。
	-  构造方法：create(旋转的时间、起始半径、半径差、起始z角、旋转z角差、起始x角、旋转x角差)
	-  OrbitCamera通常用来实现翻牌效果。

<br>　　范例14：创建副本。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png", display.cx+50,display.cy+50)
    local node2 = display.newSprite("icon.png", display.cx, display.cy)
    self:addChild(node)
    self:addChild(node2)

    local action1 = cc.RepeatForever:create(cc.OrbitCamera:create(1, 1, 0, 0, 180, 0, 0))
    local action2 = action1:clone()
    node:runAction(action1)
    node2:runAction(action2)
end
```
    语句解释：
	-  在Cocos2dx中，经常需要将一个action施加到多个Sprite上面，以达到相同的效果。
	-  但是一个action对应不能直接施加到多个Sprite上面去，只有通过调用action的clone()方法创建一个副本。

<br>　　范例15：TargetedAction。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png", display.cx+50,display.cy+50)
    local node2 = display.newSprite("icon.png", display.cx, display.cy)
    self:addChild(node)
    self:addChild(node2)

    local action1 = cc.JumpBy:create(1, cc.p(0,0), 50, 3)
    local actions = {}
    actions[1] = action1
    actions[2] = cc.TargetedAction:create(node, action1:clone())
    node2:runAction(cc.RepeatForever:create(cc.Sequence:create(actions)))
end
```
    语句解释：
	-  通常默认的动作执行对象是调用runAction的对象，而TargetedAction可以改变动作执行对象。
	-  在本范例中，node2跳跃完毕后，node会接着跳跃。

<br>**速度控制**
　　接下来介绍如何使用`ActionEase`类及其子类进行动画速度控制。
　　所谓的动画速度控制就是控制动画在什么时候播放的快一些，什么时候播放的慢一些。但这只是改变了`Action`在某一时刻的运动速度，并没有改变总体时间。如果整个动作会持续`5s`，那么最终整个`Action`播放完毕的时间仍然是`5s`。

　　`ActionEase`的子类按照速度控制的类型，可以分成三类：

	-  In动作：开始的时候加速。 比如：CCEaseIn、CCEaseSineIn等。
	-  Out动作：快结束的时候加速。 比如：CCEaseOut、CCEaseSineOut等。
	-  InOut动作：开始和快结束的时候加速。 比如：CCEaseInOut等。

<br>　　范例1：线性变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.EaseIn:create(cc.MoveBy:create(1, cc.p(300, 0)), 1.5)
    actions[2] = cc.EaseOut:create(cc.MoveBy:create(1, cc.p(-300, 0)), 1)
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  EaseIn：由慢至快（速度线性变化），在开始时慢。
	-  EaseOut：由快至慢，后来慢。
	-  EaseInOut：由慢至快再由快至慢，开始时和后来慢。
	-  创建动作时，第二个参数表示速率, 决定速度变化的快慢。设置为1则保持正常速度，值越大越慢振幅越小。

<br>　　范例2：指数变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.EaseExponentialIn:create(cc.MoveBy:create(1, cc.p(300, 0)))
    actions[2] = cc.EaseExponentialOut:create(cc.MoveBy:create(1, cc.p(-300, 0)))
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  EaseExponentialIn：由慢至极快（速度指数级变化）。
	-  EaseExponentialOut：由极快至慢。
	-  EaseExponentialInOut：由慢至极快再由极快至慢。
	-  构造指数变化的动作时，只需要指定一个参数即可。

<br>　　范例3：正弦变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.EaseSineIn:create(cc.MoveBy:create(1, cc.p(300, 0)))
    actions[2] = cc.EaseSineOut:create(cc.MoveBy:create(1, cc.p(-300, 0)))
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  EaseSineIn：由慢至快（速度正弦变化）。
	-  EaseSineOut：由快至慢。
	-  EaseSineInOut：由慢至快再由快至慢。

<br>　　范例4：弹性变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    node:runAction(cc.EaseElasticIn:create(cc.RotateBy:create(1.5, 180)))
end
```
    语句解释：
	-  EaseElasticIn：先左右弹动一下，然后再播放动作。
	-  EaseElasticOut：先播放动作，在结束的时候，弹动一下。
	-  EaseElasticInOut：开始和快结束的时候，都会弹动一下。
	-  动作的效果类似于弹了一下一根绷紧的橡皮筋。

<br>　　范例5：跳跃变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    node:runAction(cc.EaseBounceOut:create(cc.MoveBy:create(1, cc.p(300, 0))))
end
```
    语句解释：
	-  可以理解为一个乒乓球从空中落地之后在地上弹跳的情况。

<br>　　范例6：回退变化。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    node:runAction(cc.EaseBackIn:create(cc.MoveBy:create(1, cc.p(300, 0))))
end
```
    语句解释：
	-  EaseBackIn：先后撤一下，然后再播放动作。
	-  EaseElasticOut：先播放动作，动作会超过指定的值一点，然后再还原为指定值。
	-  EaseElasticInOut：开始和快结束的时候，都会后撤一下。

<br>**本节参考阅读：**
- [动画速度的控制](http://blog.csdn.net/zhy_cheng/article/details/8426332)
- [cocos2d-x action动画播放](http://blog.csdn.net/honghaier/article/details/8197892)

### ActionInstanse ###

<br>　　范例1：Place。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.DelayTime:create(2)
    actions[2] = cc.Place:create(cc.p(200,200))
    actions[3] = cc.MoveBy:create(1, cc.p(300, 0))
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  构造方法：create(位置)。
	-  Place用来将节点放置指定位置，它与修改节点的position属性相同。
	-  使用Place动作与直接设置结点的position属性的区别在于它可以作为Action被放入到一个Sequence中。

<br>　　范例2：Show、Hide。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.DelayTime:create(2)
    actions[2] = cc.Hide:create()
    actions[3] = cc.DelayTime:create(2)
    actions[4] = cc.Show:create()
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  Hide用来隐藏结点。Show用来显示节点。

<br>　　范例3：FlipX、FlipY。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.DelayTime:create(2)
    actions[2] = cc.FlipX:create(true)
    actions[3] = cc.DelayTime:create(2)
    actions[4] = cc.FlipY:create(true)
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  FlipX设置是否在水平方向上，反转节点。
	-  FlipY设置是否在垂直方向上，反转结点。

<br>　　范例4：CallFunc。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local function f(p1)
        print(p1 == node)
    end
    local actions = {}
    actions[1] = cc.DelayTime:create(2)
    actions[2] = cc.CallFunc:create(f)
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  CallFunc动作，用来调用一个函数，同时会将运行当前Action的Node作为参数传递过去。

<br>　　范例5：ToggleVisibility。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local actions = {}
    actions[1] = cc.MoveBy:create(1, cc.p(200, 0))
    actions[2] = cc.ToggleVisibility:create()
    actions[3] = cc.MoveBy:create(1, cc.p(0, 300))
    actions[4] = actions[2]
    actions[5] = cc.MoveBy:create(1, cc.p(-200, 0))
    node:runAction(cc.Sequence:create(actions))
end
```
    语句解释：
	-  ToggleVisibility用来反向设置节点是否可见，即如果当前节点可见，则执行此Action后，会变为不可见。

### Follow ###

　　Follow可以使节点跟随指定的另一个节点移动。

<br>　　范例1：Follow。
``` lua
function MainScene:ctor()
    local map = display.newSprite("background.png")
    local node = display.newSprite("icon.png")
    node:center()
    map:center()
    map:setScale(3)
    self:addChild(map)
    self:addChild(node)
    
    map:runAction(cc.Follow:create(node))
    node:runAction(cc.RepeatForever:create(cc.MoveBy:create(1, cc.p(100,0))))
end
```
    语句解释：
	-  Follow动作，可以让一个节点跟随另一个节点做位移，本范例中让map跟随node。
	-  它有两个静态方法，后者可以设置一个跟随范围，离开范围就不再跟随。 
	   -  Follow:create (Node pFollowedNode)
	   -  Follow:create (Node pFollowedNode, rect)
	   -  Follow经常用来设置layer跟随sprite，可以实现类似摄像机跟拍的效果。

### Speed ###
　　动画是游戏的必然要素之一，在整个游戏过程中，又有着加速、减速动画的需求。以塔防为例子，布塔的时候希望能够将游戏减速，布好塔后，则希望能将游戏加速；当某个怪被冰冻后，移动速度减缓，而其他怪的移动速度不变。

<br>　　范例1：Speed。
``` lua
function MainScene:ctor()
    local node = display.newSprite("icon.png")
    node:center()
    self:addChild(node)
    
    local speed = cc.Speed:create(cc.RotateBy:create(5, 360), 1)
    node:runAction(speed)
    self:performWithDelay(function ()
        speed:setSpeed(0.3)
    end, 1)
    self:performWithDelay(function ()
        speed:setSpeed(1)
    end, 3)
end
```
    语句解释：
	-  Speed用来设置动作的执行速度，构造方法：create(动作, 速率)。
	-  其中“速率”指执行的倍数，即如果一个动作需要5秒完成，设置Speed的第二个参数为2后，只需要2.5秒即可完成。
	-  你可以在Speed执行的中途，通过调用Speed的setSpeed方法来动态调节播放速度，以此来达到慢镜头的效果。当把speed设置为0时Action将会暂停执行。

## 粒子动画 ##

### 引言 ###
　　`Cocos2d-x`引擎提供了强大的粒子系统，它在模仿自然现象、物理现象及空间扭曲上具备得天独厚的优势，为我们实现一些真实自然而又带有随机性的特效（如爆炸、烟花、水流）提供了方便。
　　尽管如此，它众多的粒子属性还是着实让人头疼。
　　因为如果要想自己编码写出炫丽的粒子效果，这里有太多的属性需要手动设置和调节。不管是对新手还是资深的老油条程序员来说，都存在不同程度的不便性。

# 第二节 暂停更新 #
　　我们公司目前唯一的一款游戏基于`quick`的`2.2.5`的版本开发的，而截止至`2015.1.8`日，`quick`现在已经发展到了`quick3.3 final`版。
　　从现在的情况来看，我们公司短期内似乎并不打算再研发另一款游戏，所以为了不让自己所学的东西变得毫无用处，笔者决定在`2015`年农历春节来临之前，对自己今年所学到的知识做一个总结，把原来针对`quick2.2`所写的教程改为现在的针对`quick3.3 rc1`版本的，并将它放到博客中。

　　从实际开发的角度来看，只掌握这六篇文章所介绍的知识那是远远不够的，由于时间关系（也是因为自己没研究透，也不想去研究了）游戏开发中会涉及到的`滤镜`、`媒体播放`、`状态机`、`数据存储`、`网络请求`、`瓦片地图`、`粒子动画`、`骨骼动画`、`3D精灵`等等技术都没有写出来。
　　但掌握了这六篇文章所介绍的知识后，也算是在游戏开发上面入门了，之后所要学的虽然有很多，但是兵来将挡，没有学不会的技术。

　　笔者下一步的打算是，把精力暂时放回到`Android`开发上面，之后会陆续发布`Android`相关的博文，以后也许还会继续回来做游戏开发。
　　最后，在此特别感谢廖大、蓝大的`quick`团队，为我们游戏开发者做出无私奉献，也感谢那些无私奉献的博主们，前人为我们铺平了道路，我能做的就是让后来者能再少走点弯路。

<br><br>