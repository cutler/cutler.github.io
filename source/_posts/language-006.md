---
title: 第六章 Kotlin
date: 2023-1-11 11:38:15
author: Cutler
categories: 编程语言
---

# 第一节 起源概述 #

## 面向JVM的语言 ##
<br>　　我们知道在Java语言中，会将源代码编译成字节码，再依赖各种不同平台上的虚拟机（JVM）来解释执行字节码，从而具有“一次编写，到处运行”的跨平台特性。同时，官方从很早以前就将JVM规范和Java规范分离开了，这意味着只要其他语言在编译过程中生成了字节码，那么照样可以通过JVM在不同平台上运行，这样一来这个语言就借着JVM拥有了跨平台能力。

    由于是运行在JVM上的，因此也可以使用Java语言开发的各类API

　　也就是说虽然Java语言已经足够强大、应用的场景足够广泛，但其还是会在某些特殊场景下力有不逮，于是一些有能力的组织、公司就专门针对那些场景开发了一套基于JVM的新语言，以此来解决各自的需求，同时可以借助JVM来实现跨平台。

　　目前除了Java外，运行在JVM之上的语言主要还有如下几种：

　　**1、Kotlin**

    目前已正式成为Android官方支持开发语言。

　　**2、Groovy**

    Apache组织的Groovy 1.0于2007年1月2日发布。
    这门动态语言拥有类似Python、Ruby和Smalltalk中的一些特性，可以作为Java平台的脚本语言使用。
    由于其运行在JVM上的特性，Groovy可以使用其他Java语言编写的库。
    Groovy的语法与Java非常相似，大多数Java代码也符合Groovy的语法规则，尽管可能语义不同。

　　**3、其它**

    Jython：是一种完整的语言，它是一个Python语言在Java中的完全实现，Jython不仅给你提供了Python的库，同时也提供了所有的Java类，这使其有一个巨大的资源库。
    JRuby：是一个纯Java实现的Ruby解释器。通过JRuby你可以在JVM上直接运行Ruby程序，调用Java的类库。

    除此之外还有：Scala、Fantom、Clojure、Rhino、Ceylon。

<br>**本节参考阅读：**
- [知乎 - 为什么很多语言选择在JVM上实现？](https://www.zhihu.com/question/20003582)
- [不来了解下JVM支持的语言有哪些？](https://segmentfault.com/a/1190000021901060)

## Kotlin ##
<br>　　Kotlin（科特林）是一个用于现代多平台应用的静态编程语言，由 JetBrains 开发。

    JetBrains成立于2000年，是一家捷克的软件开发公司，该公司最为人所熟知的产品是Java编程语言开发撰写时所用的集成开发环境：IntelliJ IDEA。
    2011年7月，JetBrains推出Kotlin项目，这是一个面向JVM的新语言，它已被开发一年之久。
    2012年2月，JetBrains以Apache 2许可证开源此项目。
    2016年2月15日，Kotlin v1.0发布，这被认为是第一个官方稳定版本。
    2017年在Google I/O大会上，Google宣布在Android上为Kotlin提供一等支持。
    2019年在Google I/O大会上，Google宣布今后将优先采用 Kotlin 进行 Android 开发。

<br>　　谷歌为什么要选择Kotlin？主要是两个原因：

    1、谷歌和Oracle的诉讼官司。
    2、Kotlin本身做的越来越好。


<br>　　谷歌与Oracle的官司简述：

    1995年5月23日，Sun公司发布了Java，Java语言正式诞生。
    1996年1月，第一个JDK1.0诞生。
    2009年4月15日，Sun公司被收购前夕，正式发布OpenJDK(OracleJDK的开源版本，完全自由，开放源码)。
    2009年4月20日，Oracle以74亿美元的价格收购了Sun。
    由于此时期OpenJDK并不是很成熟，因此Google的Android系统是基于OracleJDK来开发的。
    
    2010年9月，Oracle就Google侵权一事向法院提起了诉讼，要求谷歌赔偿88亿美元。
    
    理由很简单，虽然根据协议Android使用的OracleJDK后自身也开源了，但它违反了Java“一次编译，到处运行”的核心理念，在Android修改了很多地方之后，除了源码兼容以外，编译之后的产物APK，是不能在其它的java环境下执行的，而此时Android还称自己的api是java，但其实这已经不符合java的规范了。
    
    另外，安卓上的GUI部分是自己做的，跟java默认的api（也就是swing那些）完全不同，那其实这个就彻底分裂了java，java其实有两个部分，一个是安卓上的java，还有一个是其它的java，那这个就是oracle所不能容忍的，于是就希望Google不要继续只用java的api，或者干脆重新做一个语言，不要再用java了。
    
    2018年3月，美国联邦巡回上诉法院裁决，Google侵犯了Oracle的版权。
    2018年8月，Google提出上诉，但美国联邦上诉法院宣布拒绝重新审理此案。

<br>　　谷歌官方介绍为什么要优先支持Kotlin：

    富有表现力且简洁：您可以使用更少的代码实现更多的功能。表达自己的想法，少编写样板代码。在使用Kotlin的专业开发者中，有67%的人反映其工作效率有所提高。
    
    更安全的代码：Kotlin有许多语言功能，可帮助您避免null指针异常等常见编程错误，包含Kotlin代码的Android应用发生崩溃的可能性降低了20%。
    
    可互操作：您可以在Kotlin代码中调用Java代码，或者在Java代码中调用Kotlin代码，Kotlin可完全与Java编程语言互操作，因此您可以根据需要在项目中添加任意数量的Kotlin代码。
    
    结构化并发：Kotlin协程让异步代码像阻塞代码一样易于使用，协程可大幅简化后台任务管理，例如网络调用、本地数据访问等任务的管理。

<br>　　正如上面介绍的，Kotlin确实存在很多语法糖与高级特性，好是真的好，但笔者认为对于刚入门的新手来说，记忆和理解这些语法糖和特性也是一个不小的挑战，请大家做好心理准备。

　　另外，我们需要了解的是，Kotlin能用于哪些开发？

    用于服务器开发，Kotlin非常适合开发服务器端应用程序，它可以让你编写简明且表现力强的代码，同时保持与现有基于Java的技术栈的完全兼容性以及平滑的学习曲线。
    
    用于Android开发。
    
    用于JavaScript开发，Kotlin/JS提供了转换Kotlin代码、Kotlin标准库的能力，并且兼容JavaScript的任何依赖项，Kotlin/JS的当前实现以ES5为目标。
    
    用于原生开发，Kotlin/Native是一种将Kotlin代码编译为无需虚拟机就可运行的原生二进制文件的技术，Kotlin/Native 支持以下平台：iOS、tvOS、watchOS、Windows（MinGW）、安卓NDK。
    
    用于数据科学、竞技程序设计。

<center>
![](/img/language/language_kotlin_001.png)
</center>

<br>　　最后，在百度百科上有这么一句“Jetbrains希望这个新语言能够推动IntelliJ IDEA的销售。”
    
    结合笔者学习完Kotlin语言后，得出一个猜测：
    1、由于Kotlin是面向虚拟机的语言，且已经迭代多年，所以其和Java语言的相比，在性能上不会差太多。
    2、Kotlin提供了非常多的语法糖和新特性，且其完全支持现有的Java类库，旨在讨好程序员。
    3、Kotlin可以直接在IntelliJ上通过插件使用，程序员爱上了Kotlin，自然就有可能购买IntelliJ。


<br>**本节参考阅读：**
- [百度百科 - Kotlin](https://baike.baidu.com/item/Kotlin/1133714?fr=aladdin)
- [怎么看待谷歌（Google）赢得了跟甲骨文（Oracle）关于安卓使用 Java api 的官司？](https://www.zhihu.com/question/453123507)
- [Android 的 Kotlin 优先方法](https://developer.android.google.cn/kotlin/first)
- [Kotlin 官方文档 中文版](https://book.kotlincn.net/)

## 环境搭建 ##

<br>　　从上文可知Kotlin不止可以用来开发Android，显然Kotlin开发的方式也不会只有一种：

    使用IntelliJ IDEA
    
    使用Android Studio，开发Android应用程序的官方IDE，它是基于Intellij IDEA开发的IDE，因而其UI和功能都与后者高度相似。
    
    使用Eclipse，需要手动安装Kotlin插件。
    
    使用命令行（就像我们刚学Java时使用的“java”和“javac”来编译源代码一样，Kotlin也提供了两个类似的工具“kotlin”和“kotlinc”）。

<br>　　由于我们是做Android开发，本文就以Android Studio为开发工具，介绍Kotlin的各类语法。
　　首当其冲的任务就是，让现有的老Android项目支持Kotlin语言：

    1、确保自己手上的AS是比较新的版本。
    2、依次点击AS的菜单“Tool -> Kotlin -> Configure Kotlin in Project”。
    3、然后按照弹出的对话框一步一步选择就可以了。

　　上面的操作，本质上就做了三件事：
``` gradle
// 在项目根build.gradle里添加kotlin插件 
buildscript {
    ext.kotlin_version = '1.5.30'
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

// 在app的build.gradle最上方apply插件
apply plugin: 'kotlin-android'

// 在app的build.gradle里引入kotlin的标准库
implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
```

<br>　　接着随便找一个包，右键创建一个Kotlin文件（注意不是Kotlin类），写入如下代码：
``` kotlin
package com.kotlintest

// 使用fun关键字定义一个名为main的函数
fun main() {
    // 控制台输出字符串
    // kotlin中语句的末尾不需要加“;”号
    print("Hello World")
}
```

<center>
![](/img/language/language_kotlin_002.png)
</center>

    语句解释：
    -  如果你的函数名字叫“main”，那么在其左侧就会出现一个绿色三角号，点击可以直接执行该函数。
    -  Kotlin的源文件以“kt”为后缀名。

# 第二节 Kotlin入门 #

## 基础语法 ##

<br>　　范例1：你叫什么啊。
``` kotlin
package com.kotlintest

fun main() {
    // 输出字符串，并换行。
    println("你好，你叫什么？")
    // 从标准输入流System.in中读取一行用户输入。
    println("啊，你叫" + readLine() + "啊")
}

/*
上面用到的print、println、readLine都是kotlin内置的函数，它们被放到“kotlin.io”包中。
以下多个包会默认导入到每个Kotlin文件中：
kotlin.*
kotlin.annotation.*
kotlin.collections.*
kotlin.comparisons.*
kotlin.io.*
kotlin.ranges.*
kotlin.sequences.*
kotlin.text.*
根据目标平台还会导入额外的包：
JVM：
    java.lang.*
    kotlin.jvm.*
JS：
    kotlin.js.*
*/
```

### 数据类型 ###

<br>　　Kotlin中提供如下几种基本数据类型：

``` kotlin
/*
数字：
    整数类型：Byte、Short、Int、Long
    浮点类型：Float、Double
    无符号整型：UByte、UShort、UInt、ULong

布尔：使用Boolean类来表示，取值true、false。

字符：使用Char类来表示，字符字面值用单引号括起来，特殊字符可以以转义反斜杠“\”开始，如“\n”。

字符串：
使用String类来表示，字符串值用双引号括起来，字符串是不可变的，一旦初始化了一个字符串，
就不能改变它的值或者给它赋新值，所有转换字符串的操作都以一个新的String对象来返回结果。

数组：使用Array类来表示。
*/
```

<br>　　范例1：定义变量。
``` kotlin
package com.kotlintest

fun main() {
    // Kotlin中有两种变量：可变变量和不可变变量
    // 前者使用var定义，此类变量可以任意修改其值
    // 后者使用val定义，此类变量只可以赋值1次，若赋值成功后再次尝试修改，则编译报错

    // 定义变量的语法格式为：
    // var/val <变量名> : <类型> = <初始化值>

    var a: Byte = 1
    var b: Short = 2
    var c: Int = 3
    var d: Long = 4
    var s: String = "Hello"
    println(s)

    val f: Byte = 1
    // 下面语句会编译报错，因为f是不可变量
    f = 2
}

// var全称为：variable
// val全称为：value，使用val定义的局部变量相当于Java中的final关键词。
```

<br>　　范例2：自动推算类型。

``` kotlin
package com.kotlintest

fun main() {
    // 定义变量的时候，通常编译器可以依据等号右侧的数据来推测出变量的类型。
    // 因此我们学到的第一个语法糖就是，定义变量时可以省写变量的类型。
    var a = 1              // Int类型
    var s = "Hello"        // String类型
    println(a)
    println(s)
}
```

<br>　　范例3：整型数据。

<center>
![](/img/language/language_kotlin_003.png)
</center>

``` kotlin
package com.kotlintest

fun main() {
    // 当初始化一个没有显式指定类型的变量时，编译器会自动推断为足以表示该值的最小类型。 
    // 如果不超过Int的表示范围，那么类型是Int。 
    // 如果超过了，那么类型是Long。 
    // 如需显式指定Long值，请给该值追加后缀L。
    // 显式指定类型会触发编译器检测该值是否超出指定类型的表示范围。
    val one = 1                     // Int
    val threeBillion = 3000000000   // Long
    val oneLong = 1L                // Long
    val oneByte: Byte = 1           // 明确指出变量是Byte类型
    
    // Int等类被放到了kotlin包下，因而我们可以直接使用到。
    // Int类内部定义了几个实用常量，MAX_VALUE见名知意了吧？
    var a = Int.MAX_VALUE
    var b = Int.MAX_VALUE + 1
    // 输出：2147483647
    println(a)
    // 输出：-2147483648，发生数据溢出，阴极必反。
    println(b)
}

// 如果你想查看某个变量当前是什么类型，把鼠标划到变量名上方，稍等一会AS就会弹框告知你
```

<br>　　范例4：浮点数据。

<center>
![](/img/language/language_kotlin_004.png)
</center>

``` kotlin
package com.kotlintest

fun main() {
    val d1 = 3.14       // Double
    val f1 = 1.0f       // Float
    val n1 = 8

    // 与一些其他语言不同，Kotlin中的数字没有隐式拓宽转换。
    // 例如，Double类型的变量只能接受Double值，而不能将Float、Int或者其他数字赋值。
    // 错误：类型不匹配，因为1.2默认为Double
    val f2: Float = 1.2
    // 错误：类型不匹配，因为1f是Float
    val d2: Double = 1f
    // 错误：类型不匹配，因为1默认为Int
    val d3: Double = 1
    // 错误：类型不匹配，因为n1为Int
    val n2: Long = n1

    // 上面定义的变量（n1、f1、d1），分别各自对应着一个Int、Float、Double等类的对象。
    // 以整型为例，在Kotlin中整型不再分为int和Integer了，统一用Int表示。
    // 这些类不是java.lang包的，而是Kotlin自有的类，它们被放在kotlin包下。
    // 这些类有一个共同父类kotlin.Number类，其内提供了若干实用函数。
    val f3 = 1.2f
    val d4: Double = f3.toDouble()
    
}
```

<br>　　范例5：数字字面常量。

``` kotlin
package com.kotlintest

fun main() {
    // 二进制常量，以“0b”开头，下面会输出3
    println(0b11)
    // 十六进制常量，以“0x”开头，下面会输出10
    println(0xA)
    // kotlin目前不支持八进制

    // 小数默认为Double类型，“e2”表示10的2次方，下面会输出12330.0
    println(123.3e2)

    val oneMillion = 1_000_000
    val creditCardNumber = 1234_5678_9012_3456L
    val socialSecurityNumber = 999_99_9999L
    val hexBytes = 0xFF_EC_DE_5E
    val bytes = 0b11010010_01101001_10010100_10010010
    // 数字可以使用“_”间隔，下面代码将输出1000000
    println(oneMillion)
}
```

<br>　　范例6：无符号整型。

``` kotlin
package com.kotlintest

fun main() {
    // 数字后面带u则表示为无符号常量
    var a: UByte = 1u
    var b: UInt = 2u
    var c: UShort = 3u
    var d: ULong = 4u

    // 输出：1
    println(a)
    // 输出：4294967295
    println(UInt.MAX_VALUE)
    // 输出：0
    println(UInt.MAX_VALUE + 1u)

    // 不指定类型，默认为UInt
    var e = 1u;
    // 不指定类型，默认为UInt，若常量超过了UInt的范围，则变量升级为ULong
    val f = 0xFFFF_FFFF_FFFFu
    // UL表示ULong类型
    val g = 1UL
}
```

<br>　　范例7：自动类型晋升。

``` kotlin
package com.kotlintest

fun main() {
    // 与Java一样，进行数学运算时，运算结果的类型为参与运算的两个数中范围最大的类型
    // 若参与运算的两个数，最高为Int，则结果必定为Int
    var a: Byte = 1
    var b: Int = 2
    var c: Short = 3
    var d: Long = 4
    var f: Float = 1f
    var g: Double = 1.0

    // a1为Int类型
    var a1 = a + a
    // c1为Int类型
    var c1 = c + c
    // d1为Long类型
    var d1 = a + d
    // g1为Double类型
    var g1 = a + c + f + g
}
```

<br>　　范例8：字符与布尔。

``` kotlin
package com.kotlintest

fun main() {
    var a = false
    var b = !a  // 取反
    // 可以直接调用Java的API进行打印
    System.out.println(a)
    // 需要注意的是：
    // 若您写的Kotlin代码最终也会运行在JS环境下，则就需要适配了
    // 若您很确定你的Kotlin代码最终运行在JVM环境下，则就没什么问题了

    // 如果你去看“println()”内部的源码就会发现，
    // 在JVM环境下，其内部就是调用System.out.println()方法来执行输出的
    println(b)

    // 输出 true
    println(a || b)
    // 输出 false
    println(a && b)

    var c = 'a'
    println(c)
    // 按照之前的介绍，下面我们应该调用c.toInt()方法，但该方法已经被Deprecated了
    // 目前Kotlin推荐我们使用字符对象的code属性来将某个字符转为Int对象
    var d : Int = c.code
    // 输出97，即字符a的ASCII码
    println(d)
    // 输出2，即Char类型的变量占2个字节
    println(Char.SIZE_BYTES)
    // 与Java一样，下面的语句无法编译通过，因为这个汉字不在char数据类型的收藏范围内。
    var ch = '𠮷'
}
```

<br>　　范例9-1：字符串。

``` kotlin
package com.kotlintest

fun main() {
    // 定义两个String类型的变量
    // 需要注意的是，这里说的String类和Java中的String类不是一个东西
    // 它是Kotlin中特有的String类，被放在kotlin包下，该类内提供了很多实用函数
    var str1 = "aBcD"
    var str2 = "aBcD"
    // 全部转成大写，返回的是一个新的字符串常量
    println(str1.uppercase())
    // 全部转成小写，返回的是一个新的字符串常量
    println(str1.lowercase())
    // 输出4
    println(str1.length)

    // 比较两个字符串变量的内容是否相等，输出true
    println(str1 == str2)
    // 比较两个字符串变量所指向的引用，是否相等。
    // 与Java一样，相同的字符串常量会被放到字符串常量池中重用，因此下面输出true
    println(str1 === str2)

    // 使用字符串常量创建一个新的String对象，关于创建对象的知识后面会详细介绍
    var str3 = String("aBcD".toCharArray())
    // 此时输出true
    println(str1 == str3)
    // 此时输出false
    println(str1 === str3)
}
```

<br>　　范例9-2：字符串。

``` kotlin
package com.kotlintest

fun main() {
    // 首尾分别被3个双引号包括的字符串，我们称之为“原始字符串”
    // 原始字符串可以包含换行以及任意文本。
    var html = """
        <!DOCTYPE html>
        <html>
            <head>
                <title>页面标题(w3cschool.cn)</title>
            </head>
            <body>
                <p>Hello  world </p>
            </body>
        </html>
    """.trimIndent()
    // trimIndent方法用来去掉字符串中每行公用的前缀，在此范例中就是空格
    println(html)

    val name1 = "张三"
    val name2 = "李四"
    // 下面这种字符串连接的方法可以执行，但不推荐
    println("我的名字叫：" + name1 + ",你的名字叫：" + name2)

    // Kotlin中，字符串连接可以使用模板(一些小段代码，以$符号开头)，运行时会执行字符串替换。
    // 输出“我的名字叫：张三,你的名字叫：李四”
    println("我的名字叫：$name1,你的名字叫：$name2")

    // 如果模板是一个表达式，则需要用中括号将整个模板包围起来
    // 输出“我的名字叫：张三,长度是：2”
    println("我的名字叫：$name1,长度是：${name1.length}")

    // 在普通字符串常量中，使用“\$”可以转义“$”
    // 下面会输出“我身上有：$1.99美元”
    var money = "1.99"
    println("我身上有：\$${money}美元")
}
```

<br>　　范例10：原生数组。

``` kotlin
package com.kotlintest

fun main() {
    // 创建int类型的数组，“intArrayOf”来自于kotlin包中
    // 相应的还提供了byte、short、long、float、double、char、boolean的数组创建方法
    // 括号里面的是数组中的元素
    var intArray: IntArray = intArrayOf(1, 2, 3, 4)
    // 将数组的内容转成格式化的字符串，方便阅读
    // 输出：[1, 2, 3, 4]
    println(intArray.contentToString())
    println(intArray[0])
    println(intArray[2])

    // 直接调用LongArray类创建一个新对象，4表示数组中有4个元素
    // 后面的大括号是一个lambda表达式，LongArray会依次为每个元素执行一次大括号里的表达式
    // 表达式的结果就是该元素的值，it是一个内置的变量，表示当前元素的下标，从0开始
    var longArray: LongArray = LongArray(4) {
        it + 3L
    }
    // 输出：[3, 4, 5, 6]
    println(longArray.contentToString())
    // 获取数组的长度，下面会输出4
    println(longArray.size)
}

// 通过阅读源码可知，使用intArrayOf等方法创建数组时，其内部就是用的第二种方法。
public fun Array<out Long>.toLongArray(): LongArray {
    return LongArray(size) { index -> this[index] }
}
// 查看源码：
// 若你直接在AS查看intArrayOf方法，则会打开Library.kt文件
// 但这个文件里只定义了方法的头部，并没有具体的实现，
// 此时可以顺便打开方法返回值IntArray类的代码，对着它的构造方法执行“Find Usages”
// 就可以发现具体的实现放到_Arrays.kt文件中了
```

### 控制流程 ###

<br>　　范例1：If表达式。

``` kotlin
package com.kotlintest

fun main() {
    var a = 5
    var b = 10
    if (a > b) {
        println("a大")
    } else {
        println("b大")
    }

    // 在Kotlin中if-else是一个表达式，是可以将表达式的结果赋值给一个变量的
    // 表达式的结果就是代码块最后一行语句的结果
    var c = if (a > b) {
        println("a大")
        a
    } else {
        println("b大")
        b
    }
    // 输出：c = 10
    println("c = $c")

    // 因此在Kotlin中是没有“?:”运算符的，直接用if-else就可以了
    var d = if (a > b) a else b
    // 输出：d = 10
    println("d = $d")
}
```

<br>　　范例2：when表达式。

``` kotlin
package com.kotlintest

fun main() {
    // when语句就和Java中的switch一样
    // when语句括号里的表达式可以是数字、枚举、字符串等（可以是任意表达式，不一定是常量）
    // 每一个case使用“常量 ->”的形式定义
    when ("-") {
        // 这个分支只包含一条语句，可以不加大括号
        "+" -> println(3 + 4)
        // 包含多个语句，则需要大括号
        "-" -> {
            var a = 5
            var b = 5
            println(a - b)
        }
        // 可以多个case使用相同的代码，用逗号间隔
        "*", "/" ->
            println("暂不支持此操作")
        // else分支必须写在最后，相当于switch中的default关键字
        else -> {
            var a = 15
            var b = 15
            println(a + b)
        }
    }
}
// when 既可以作为表达式使用也可以作为语句使用。
// 如果它被当做表达式，第一个符合条件的分支的值就是整个表达式的值。
```

<br>　　范例3：for循环。

``` kotlin
package com.kotlintest

fun main() {
    var array = intArrayOf(1, 2, 3, 4, 5)
    // for 循环可以对任何提供迭代器（iterator）的对象进行遍历
    // 变量array是IntArray类型的，该类内部就提供了iterator()方法
    // 运行时，会依次将数组里的每个元素赋值给item
    for (item:Int in array) {
        println(item)
    }

    // 通过数组对象的indices属性来获取一个下标数组
    // 很显然index的数据类型是可以省写的
    for (index in array.indices) {
        println("下标为：$index，元素值为：${array[index]}")
    }
}
```

<br>　　范例3：while循环。

``` kotlin
package com.kotlintest

fun main() {
    // while和do……while的语法没有变
    var a = 1
    while (a < 10) {
        println(a++)
    }
}
```

<br>　　范例4：区间。

``` kotlin
package com.kotlintest

fun main() {
    // 创建一个区间，区间内包含10个数字，从1到10。
    // 变量的类型是IntRange，该类被放到androidx.annotation包中了。
    var intRange = 1..10
    // joinToString方法会将区间内的所有元素拼接一起，生成一个字符串返回
    // 输出：1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    println(intRange.joinToString())

    // 很显然除了IntRange外，还有其它几种基本类型的区间，比如Char类型的
    var charRange = 'a'..'f'
    // 输出：a, b, c, d, e, f
    println(charRange.joinToString())

    // 半开半闭区间，从1开始到9结束，即不包含10
    var intOpenRange = 1 until 10
    // 输出：1, 2, 3, 4, 5, 6, 7, 8, 9
    println(intOpenRange.joinToString())

    // 设置步长
    var intStepRange = 1..10 step 2
    // 输出：1, 3, 5, 7, 9
    println(intStepRange.joinToString())

    // 倒序区间，downTo也是支持步长的
    var intDownRange = 10 downTo 1
    // 输出：10, 9, 8, 7, 6, 5, 4, 3, 2, 1
    println(intDownRange.joinToString())

    // 无符号类型也有相关的区间类，UIntRange、ULongRange等

    // 另外float和double的区间比较特殊，无法通过joinToString方法输出其内容
    // 因为两个小数之间其实可以存在无数多个数字
    // 同时小数区间也无法使用step设置步长，无法进行遍历
    var floatRange = 1f..2f
    var doubleRange = 3.0..4.0
    println(floatRange.toString())
    println(doubleRange.toString())
}
```

<br>　　范例5：in关键字的其它用法。

``` kotlin
package com.kotlintest

fun main() {
    var array = intArrayOf(1, 2, 3, 4, 5)
    // 当在if表达式中使用in关键字时，会判断指定元素是否在array中。
    // 相应的也可以使用“!in”来进行判断。
    if (5 in array) {
        println("找到了")
    } else {
        println("没找到了")
    }

    // 当在for循环中使用in关键字时，就是循环。
    // 当我们手上没有数组，就单纯的想循环指定的次数时，可以用区间来实现。
    for (i in 1..10) {
        // 输出：1 2 3 4 5 6 7 8 9 10 
        print("$i ")
    }

    // 我们通常用float和double区间来判断数字是否在某个范围内
    if (Math.PI in 1f..4f) println("在区间内") else println("不在区间内")
}
```

<br>　　范例6：break和continue。

``` kotlin
package com.kotlintest

fun main() {
    // break和continue的作用和Java一样，只会对最内层的循环生效
    // 输出：1*1 1*3 2*1 2*3 3*1 3*3
    for (i in 1..3) {
        for (j in 1..3) {
            if (j == 2) {
                continue
            }
            print("$i*$j ")
        }
    }
    println()
    // 使用“标识符@”来定义一个标签，后续可以使用break或者continue来跳到这个标签
    // 输出：1*1 2*1 3*1
    mark1@
    for (i in 1..3) {
        for (j in 1..3) {
            if (j == 2) {
                continue@mark1
            }
            print("$i*$j ")
        }
    }
    println()
    // 输出：1*1
    mark2@
    for (i in 1..3) {
        for (j in 1..3) {
            if (j == 2) {
                break@mark2
            }
            print("$i*$j ")
        }
    }
}
```

## 面向对象 ##

### 类和对象 ###

<br>　　范例1：类和对象。

``` kotlin
package com.kotlintest

class Person1 {
    // 没有定义任何构造方法，Kotlin会默认提供一个无参构造方法
}

class Person2 {
    // 类的属性
    var name: String
    // 使用constructor关键词来定义构造方法
    // 此时就没有无参构造方法了，实例化对象必须调用此方法
    constructor(name: String) {
        this.name = name
    }
}

class Person3 {
    // 本类中定义了两个属性，定义属性的同时必须赋默认值，
    // 除非编译器推导出后续有代码会对该属性进行赋值，否则直接编译报错
    var age: Int = 0
    var name: String

    // 下面是只有一个参数的构造方法
    constructor(name: String) {
        this.name = name
    }

    // 两个参数的构造方法，后面的“: this(name)”表示调用一个参数的构造方法
    constructor(name: String, age: Int) : this(name) {
        this.age = age
    }
}

fun main() {
    // 实例化一个Person对象，在Kotlin中没有new关键词
    var p1 = Person1()
    var p2 = Person2("张三")
    var p3 = Person3("张三", 18)
}
```

<br>　　范例2：主构造方法。

``` kotlin
package com.kotlintest

// 你可以将类的某个构造方法写在类名后面，这样的构造方法我们称之为“主构造方法”。
// 相应的，那些写在类体里面的构造方法，被称为“次构造方法”。
class Person constructor(name: String) {
    var age: Int
    // 主构造方法后面那个括号里的参数，可以直接在类体中访问到
    var name: String = name

    init {
        // 类体中可以定义一个“init代码块”，用来对类的属性进行初始化
        // 若编译器检测到了这个代码块内，有对某个属性的初始化操作，
        // 那么在其定义的时候，就可以不马上赋值
        // init代码块和Java中的实例块一样，类中可以存在多个init代码块，
        // JVM按照扫描到的先后顺序执行init代码块，
        // 所有代码快都执行完毕后，才会调用构造方法
        // init块中可以访问到主构造方法的普通参数，即本范例中的“name”
        age = 10
    }

    // 所有次构造方法都必须直接或间接调用主构造方法
    constructor(name: String, age: Int) : this(name) {
        this.age = age
    }

    fun sayHello() {
        // this的概念和Java一样，表示当前对象
        println("姓名：${this.name}，年龄：${this.age}")
    }
}

fun main() {
    // 姓名：李四，年龄：6
    Person("李四").sayHello()
    // 姓名：张三，年龄：18
    Person("张三", 18).sayHello()
}

// 如果主构造函数没有任何注解或者可见性修饰符，可以省略这个constructor关键字。
// 本范例中的constructor是可以省写的，而下面的情况则不可以省写：
// class Customer public @Inject constructor(name: String) { /*……*/ }
```

### 属性 ###

<br>　　范例1：Getter和Setter。

``` kotlin
package com.kotlintest

class Person {

    //  属性创建的完整语法：
    //    var/val <propertyName>[: <PropertyType>] [= <initializer>]
    //      [<getter>]
    //      [<setter>]
    //  其中初始器(initializer)、getter 和 setter 都是可选的。
    //  若属性类型可以从初始器，或其getter的返回值中推断出来，也可以省略。

    // 对于可变属性来说，其必须得有初始化值，否则编译报错，给其赋初始化值有三种方法：
    // 1、定义的同时直接赋值
    // 2、定义不赋值，但在构造函数中赋值
    // 3、定义不赋值，但在初始化块赋值
    // 4、延迟初始化（后述）
    var name1 = "张三"

    // 只读属性。
    val name2: String
        // 由于name2提供了get()方法，外界需要取值时会直接调用get()方法，因此不用给它默认值
        // 只读属性不能提供set()方法
        get() {
            return "王五"
        }

    var name3 = "李四"
        // 从上面的默认值中可以推导出name3是String类型的，所以不用指定类型
        // 需要注意的是，不要在get、set方法中出现“this.name3”的代码，否则会导致递归调用
        // 下面这个“field”关键词是Kotlin内置的，只能在get、set方法内部使用，它表示当前属性
        get() = field
        set(value) {
            println("有人请求将“李四”为“$value”")
            field = value
        }
}

fun main() {
    var p = Person()
    // 当我们通过“对象.属性名”的方式访问属性时，Kotlin会判断该属性是否提供了get方法
    // 若提供了，则调用其get方法，并将get方法返回值交给调用者
    // 若没有提供，则直接获取该属性的值，并返回给调用者
    println("${p.name1} , ${p.name2} , ${p.name3}")
    // 相应的，当我们通过“对象.属性名”修改某个属性时，会触发set方法的检测
    // 若提供了，则直接调用，若没提供则直接修改
    p.name1 = "张三三"
    p.name3 = "赵六"
    println("${p.name1} , ${p.name2} , ${p.name3}")

    // 本范例的输出为：
    // 张三 , 王五 , 李四
    // 有人请求将“李四”为“赵六”
    // 张三三 , 王五 , 赵六
}
```

<br>　　范例2：编译期常量。

``` kotlin
package com.kotlintest

// 使用const关键字修饰的val变量在Kotlin中被视为编译期常量
// 这种属性需要满足以下要求：
// 1、必须位于顶层（即不再某个类的内部）或者是object声明或伴生对象的一个成员
// 2、必须以 String 或原生类型值初始化
// 3、不能有自定义 getter
const val KEY_USER_ID = "key_user_id"

fun main() {
    println(KEY_USER_ID)
}
```

### 函数 ###

<br>　　范例1：函数的定义。

``` kotlin
package com.kotlintest

// 不属于任何类的函数，最后面的“:Int”为函数的返回值类型
// “()”里的每个参数必须明确写出类型，不能省写
fun sum(a: Int, b: Int): Int {
    return a + b
}

class Person {
    // 类内的函数
    fun sayHello(): String {
        return "Hello World!"
    }

    // “Unit”相当于Java中的“void”表示无法返回值，这个“Unit”是可以省写的
    fun printMessage(msg: String): Unit {
        println(msg)
    }
}

fun main() {
    // 直接调用
    println(sum(3, 4))
    // 需要对象才可以调用
    var p = Person()
    println(p.sayHello())
    p.printMessage("你好啊!")
}
```

<br>　　范例2：可变参数。

``` kotlin
package com.kotlintest

// 使用“vararg”关键词定义一个可变参数
// 在函数内部，可以将可变参数当做一个普通数组来使用
fun sum(vararg numbers: Int): Int {
    var result = 0
    for (item in numbers) {
        result += item
    }
    return result
}

fun main() {
    // 调用可变参数函数时，直接传参数值即可，参数值数量是任意的
    println(sum(1, 2, 3, 4, 5))
}
```

<br>　　范例3：单表达式函数。

``` kotlin
package com.kotlintest

// 当函数返回单个表达式时，可以省略花括号并且在“=”之后指定代码体即可。
// 注意看，这个函数有返回值，但却没有写返回值类型，这是因为编辑器可以推断出来返回类型
// 但Kotlin不推断具有块代码体的函数的返回类型，因为这样的函数在代码体中可能有复杂的控制流。
fun sum(a: Int, b: Int) = a + b

fun main() {
    println(sum(4, 5))
}
```

<br>　　范例4：函数作为参数。

``` kotlin
package com.kotlintest

// 在Kotlin中，函数也可以作为参数传递
// 函数的类型写法为“(参数A的类型,参数B的类型，……) -> 函数返回值的类型”
fun login(id: String, password: String, callback: (Boolean) -> Unit) {
    // 调用回调函数
    callback(true)
}

fun onLoginFinished(isFinish: Boolean) {
    print("是否登录成功？$isFinish")
}

fun main() {
    // 使用两个冒号“::”加上函数名称，就可以获取到这个函数的引用
    // 下面代码将函数的引用赋值给一个变量
    var callback1 = ::onLoginFinished
    // 将函数的引用传递过去
    login("123456", "654321", callback1)
}
```

<br>　　范例5：类内函数作为参数。

``` kotlin
package com.kotlintest

class Person {
    // Any相当于Java中的“Object”表示任意类型
    fun onLoginFinished(isFinish: Boolean): Any {
        return true
    }
}
// 在函数的类型前面，加上“类名.”
fun login1(p: Person, callback: Person.(Boolean) -> Any) {
    // 通过对象调用函数
    p.callback(true)
}
// 或者直接把类名写到参数列表中，当做函数的第一个参数
fun login2(p: Person, callback: (Person, Boolean) -> Any) {
    // 注意此处调用函数时，也需要将对象当做参数进行传递
    callback(p, true)
}
fun login3(callback: (Boolean) -> Any) {
    callback(true)
}
fun main() {
    var p = Person()
    // 通过“类名::函数名”来获取函数的引用
    var callback = Person::onLoginFinished
    // 调用函数时，需要同时传递一个对象过去
    login1(p, callback)
    login2(p, callback)

    // 通过“对象::函数名”来获取函数的引用
    var callback2 = p::onLoginFinished
    // 调用函数时，直接传函数引用即可
    login3(callback2)
}
```

<br>　　范例6：参数默认值与具名参数。

``` kotlin
package com.kotlintest

// “score: Long = 33”用来给参数score设置默认值
// 若函数的调用者只传递了两个参数，则score默认取值33
fun sayHello1(age: Int, name: String, score: Long = 33) {
    println("我叫${name}，今年${age}岁，这次计算机考了${score}分")
}

// 带有默认值的参数最好都放到参数列表后面
// 下面这个方法的age参数放到了前面，我们在调用就需要一些变化
fun sayHello2(age: Int = 20, name: String, score: Long = 33) {
    println("我叫${name}，今年${age}岁，这次计算机考了${score}分")
}

fun main() {
    // 三个参数都传了
    sayHello1(18, "张三", 99)
    // 第三参数使用默认值
    sayHello1(18, "李四")

    // 下面这行代码会有编译错误，因为编译器默认会认为你想将“王五”传递给参数age
    // sayHello2("王五")
    // 为了防止编译器误会，我们可以在传递参数时，为参数指定其接受者的名称（形参的名称）
    sayHello2(name = "王五")
}
```

### 继承 ###

<br>　　范例1：定义父类。

``` kotlin
package com.kotlintest

// 在Kotlin中所有类都有一个共同的父类Any，对于没有声明父类的类它是默认父类。
// Any有三个方法：equals()、hashCode()与toString()，因此所有Kotlin类都定义了这些方法。
// 默认情况下，Kotlin类是最终（final）的，即它们不能被继承。 
// 要使一个类可继承，请用open关键字标记它。
open class Person {

}

// 当父类没有任何构造方法时，继承关系的写法为：
class Student1 : Person {
    // 定义一个无参构造方法
    constructor() {

    }
}

// 也可以简写为：
class Student2 : Person() {
}

fun main() {
    var stu = Student1()
    println(stu)
}
```

<br>　　范例2：调用父类构造函数。

``` kotlin
package com.kotlintest

// 在Kotlin中，我们可以在主构造函数中使用“var”或者“val”定义属性
// 比如下面直接在Person类的主构造函数里定义两个属性。
open class Person(var name: String, var age: Int) {

}

class Student1 : Person {
    var score: Int = 0

    // 次构造器的参数列表里是不可以使用“var”或者“val”关键词的。
    // 在子类的次构造函数后面需要使用“super”显式的调用父类的构造方法
    constructor(name: String, age: Int, score: Int) : super(name, age) {
        this.score = score
    }
}

// 在子类的主构造函数中，可以这么调用父类构造方法
class Student2(name: String, age: Int, var score: Int) : Person(name, age) {
    // 如果Student2类只有新增属性，没有任何新增函数，则可以把类体（大括号）给删掉
}

fun main() {
    var stu1 = Student1("张三", 18, 90)
    println("${stu1.name},${stu1.age},${stu1.score}")

    var stu2 = Student2("李四", 10, 80)
    println("${stu2.name},${stu2.age},${stu2.score}")
}
```

<br>　　范例3：函数重写。

``` kotlin
package com.kotlintest

open class Shape {
    // 若你想让某个函数可以被子类重写，则需要使用“open”关键字
    // 若你给一个非“open”类的某个函数加了“open”关键字，则不会其任何作用
    // 因为非“open”类连被别人继承都做不到，更别说让子类重写了
    open fun draw() {
        println("父类的draw方法")
    }

    // 当父类函数中没有加“open”，且子类中定义了一个和父类同名的函数时，
    // 不论子类的同名函数否使用override关键字，都会编译报错
    fun fill() {
        println("父类的fill方法")
    }
}

open class Circle : Shape() {
    // 如果你想重写父类的“open”方法，则需要使用“override”关键字，否则编译报错
    // 一个函数是否可以重写有三种情况：
    // 1、函数最初定义的时候，没有使用“open”关键字修饰，那么就永远不可以重写
    // 2、函数最初定义的时候，使用了“open”关键字修饰，则其所有儿子、孙子、重孙子类都可以重写
    // 3、基于第二条，若某一个子类重写后，不想让其儿子、孙子类继续重写，可以使用“final”关键词
    final override fun draw() {
        // 如果你想调用父类的同名方法，可以使用“super”关键字
        super.draw()
        println("子类的draw方法")
    }
    // 小提示：final和open这俩关键字是互斥的
}

fun main() {
    // 输出：
    // 父类的fill方法
    // 父类的draw方法
    // 子类的draw方法
    var circle = Circle()
    circle.fill()
    circle.draw()
}
```

<br>　　范例3：属性重写。

``` kotlin
package com.kotlintest

open class Shape {
    // 同样使用“open”关键字
    open val vertexCount: Int = 0
}

open class Rectangle : Shape() {
    // 同样可以使用“override”、“final”关键字，且属性必须同名
    // 子类覆盖父类属性时，必须保证它们二者具有兼容的类型
    // 比如父类是Int，子类不可以是Long
    final override val vertexCount = 4

    // 你可以用一个var属性覆盖一个val属性，但反之则不行。
    // 因为val属性本质上声明了一个get方法，而将其覆盖为var只是在子类中额外声明一个set方法。
}

// 当然，我们也可以这么写
open class Rectangle2(final override val vertexCount: Int = 4) : Shape() {
}
```

<br>　　范例4：抽象类。

``` kotlin
package com.kotlintest

// 抽象类必须使用“abstract”关键词
abstract class AbsClass {
    // 使用“open”修饰的普通函数，能被子类重写
    open fun test1() {
        println("抽象类中的test1")
    }

    // 使用“abstract”修饰的抽象函数，不能有函数体，且必须被子类重写
    abstract fun sayHello()

    // 若想此字段被子类覆盖，同样需要使用“open”关键字
    open val size: Int = 100
}

class Person : AbsClass() {
    override fun sayHello() {
        println("Person类中的sayHello")
    }

    override fun test1() {
        // 调用父类实现
        super.test1()
        println("Person类中的test1")
    }

    override val size: Int = 110
}

fun main() {
    var p = Person()
    p.sayHello()
    p.test1()
    println(p.size)
    
    // 程序输出：
    // Person类中的sayHello
    // 抽象类中的test1
    // Person类中的test1
    // 110
}
```


<br>　　范例5：接口。

``` kotlin
package com.kotlintest

// 接口必须使用“interface”关键词
interface Inter1 {

    // 接口内的所有函数，不需要用“open”修饰，它一定可以被子类重写，因此也不能使用“final”
    // 接口内的所有函数，可以有函数体，也可以没有，当没有时，其默认被“abstract”修饰
    // 很显然，你不能先给函数加上“abstract”关键字，然后为其提供方法体，编译会报错
    fun test1() {
        println("Inter1中的test1")
    }

    // 接口的属性同样不需要使用“open”关键字，其实现类可以直接进行覆盖
    // 接口的属性不能在定义的同时，为其赋初始化值
    // 接口的属性可以使用“val”或“var”修饰，val只可以为其提供get方法
    // 若接口内的属性没有提供get函数，且实现类也没有覆盖此属性，则实现类需要为其提供get函数
    val size: Int
}

class Person(override val size: Int) : Inter1 {
    override fun test1() {
        super.test1()
        println("Person类中的test1")
    }
}

fun main() {
    var p = Person(666)
    p.test1()
    println(p.size)

    // 程序输出：
    // Inter1中的test1
    // Person类中的test1
    // 666
}
// 小提示：接口也是可以继承接口的
```

<br>　　范例6：接口和抽象类同时出现。

``` kotlin
package com.kotlintest

abstract class AbsClass {
    open fun test1() {
        println("AbsClass中的test1")
    }
    abstract fun sayHello()
    open val size: Int = 100
}

interface Inter1 {
    fun test1() {
        println("Inter1中的test1")
    }
    val size: Int
        get() = 2
}

interface Inter2 {
    fun test1() {
        println("Inter2中的test1")
    }
    val size: Int
        get() = 3
}

// 与Java一样，一个类只能有一个直接父类，可以实现多个接口
class Person() : AbsClass(), Inter1, Inter2 {
    // 这个test1函数在三个父类里都有定义，且都有各自的实现
    // 为了避免歧义，编译器要求实现类，必须重写test1函数，以消除歧义
    // 也就是说，只要你从多个父类继承了同名函数，就必须重写它以消除歧义，不论其是否是抽象函数
    override fun test1() {
        // 明确指出要调用哪个父类的test1函数
        super<AbsClass>.test1()
        super<Inter1>.test1()
        super<Inter2>.test1()
        println("Person类中的test1")
    }
    // 很显然，属性也有一样的要求
    override val size: Int
        get() = 666

    override fun sayHello() {
        println("Person类中的test1")
    }
}

fun main() {
    var p = Person()
    p.test1()
    println(p.size)

    // 程序输出：
    // AbsClass中的test1
    // Inter1中的test1
    // Inter2中的test1
    // Person类中的test1
    // 666
}
```

### 空类型安全 ###

<br>　　范例1：不能赋值null。

``` kotlin
package com.kotlintest

// 许多编程语言（包括 Java）中最常见的陷阱之一，就是访问空引用的成员会导致空引用异常。
// 在Java中，这等同于NullPointerException或简称NPE。

class Person {

}

fun main() {
    // 很普通的一个变量定义代码
    var str1: String = "你好"
    // 下面几行代码会编译报错，因为默认情况下编译器是不允许变量值为null的
    var str2: String = null
    var int : Int = null
    var float : Float = null
    var boolean : Boolean = null
    var person : Person = null
    var obj : Any = null
}
```

<br>　　范例2：“`?`”操作符。

``` kotlin
package com.kotlintest

fun main() {
    var str1: String = "你好"
    println(str1.length)

    // 我们可以在类型的后面加一个“?”来告知编译器，允许这个变量的值为null
    var str2: String? = "世界"
    // 虽然上面我们明确给str2赋值了
    // 但下面这行代码依然会编译报错，因为str2的数据类型就是可能为null的，编译器只看数据的类型
    // println(str2.length)

    // 为了保证编译顺利通过，一般可以这么做:
    if (str2 != null) {
        println(str2.length)
    }
}
```

<br>　　范例3：“`?.`”操作符。

``` kotlin
package com.kotlintest

fun main() {
    var str1: String = "你好"
    println(str1.length)

    // “?.”被称为安全调用操作符
    // 若str2为null，则整个表达式就为null，否则则获取str2.length的值
    var str2: String? = "世界"
    println(str2?.length)

    var str3: String? = null
    // 下面这行代码运行时不会抛空指针
    // 输出：null
    println(str3?.length)

    // 安全调用也可以出现在赋值的左侧。
    // 这样，如果调用链中的任何一个接收者为 null 都会跳过赋值，而右侧的表达式根本不会求值。
    // 比如：
    // person?.department?.head = managersPool.getManager()
    // 如果 `person` 或者 `person.department` 其中之一为空，都不会调用该函数。
}
```

<br>　　范例4：“`?:`”操作符。

``` kotlin
package com.kotlintest

fun main() {
    var b: String? = "世界，你好"
    // 如果表达式“b?.length”的值是null，则整个表达式最终结果为-1，
    // 否则“b?.length”的值就是整个表达式的值
    val l: Int = b?.length ?: -1
    println(l)

    // “?:”操作符，也被称为“Elvis 操作符”
}
```

<br>　　范例5：“`!!`”操作符。

``` kotlin
package com.kotlintest

fun main() {
    var str1: String? = "你好"
    var str2: String? = null

    // “!!”是非空断言运算符，它可以将任何值转换为非空类型，若值为null，则直接抛空指针

    // 由于str1是非null，因此表达式的值为“String”类型的变量
    println(str1!!)
    // 由于str1是非null，因此可以顺利输出2
    println(str1!!.length)

    // 由于str2是null，所以运行时直接抛出空指针
    println(str2!!)
}
```

<br>　　范例6：“`as`”和“`as?`”操作符。

``` kotlin
package com.kotlintest

fun main() {
    // 定义一个Number类型的变量，并同时赋值一个Int型的常量过去
    // Number类是Int等基本数字类型的共有父类，因此是可以成功赋值的
    var number: Number = 6
    // 使用“as”关键字，可以将number向下转型为Int
    println(number as Int)

    // 下面这行代码运行是会抛“java.lang.NullPointerException”异常
    // println(null as String)

    // 下面的代码不会抛异常，能顺利输出“null”
    println(null as String?)

    // 下面这行代码运行是会抛“java.lang.ClassCastException”异常
    // println("你好" as Int)

    // “as?”被称为安全转换操作符
    // 在进行转换操作中只要抛出异常，整个表达式的值就是null，而不会真的把异常抛出
    println("安全转换1：${null as? Double}")
    println("安全转换2：${"你好" as? Double}")
}
```

<br>　　范例7：“`is`”操作符。

``` java
package com.kotlintest

fun main() {
    // 使用“is”操作符或其否定形式“!is”，可以在运行时检测对象是否符合给定类型。
    var obj = "hello"
    if (obj is String) {
        // 大多数场景都不需要在 Kotlin 中使用转换操作符（as操作符）。
        // 因为编译器会自动跟踪以及转换，比如下面可以直接调用String类的方法。
        println(obj.lowercase())
    }

    // `&&` 右侧的 obj 自动转换为 String
    if (obj is String && obj.isNotEmpty()) {
        print(obj.uppercase())
    }
}
// 请注意，当编译器能保证变量在检测和使用之间没变改变时，智能转换才有效。
// 比如val的局部变量，由于不可变，所以总是可以完成智能转换。
// 而var的局部变量，若在检测和使用之间，对其进行修改，则就无法智能转换了。
// 需要注意的，一些全局的var变量是无法进行智能转换的，
// 因为即便加了判断，其也可能因为多线程访问而被改变。
```

### 扩展 ###

<br>　　范例1：扩展函数。

``` kotlin
package com.kotlintest

// Kotlin能够对一个类或接口扩展新功能而无需继承该类或者使用像装饰者这样的设计模式。
// 例如，你可以为一个你不能修改的、来自第三方库中的类或接口编写一个新的函数。 
// 这个新增的函数就像那个原始类本来就有的函数一样，可以用寻常方式调用。 
// 这种机制称为扩展函数。此外，也有扩展属性，允许你为一个已经存在的类添加新的属性。

/**
 * 往String类中添加一个名为“wrapChar”的函数
 * 随后我们就可以直接使用字符串对象调用这个函数
 * 本函数用来往字符串的开头和结尾添加指定个数的char
 */
fun String.wrapChar(char: String, count: Int): String {
    // 首先定义一个区间，取值从0~count，共count+1个数字
    // 区间对象的joinToString函数用来将区间转换成一个字符串，由于函数的参数是一个空串，
    // 所以输出的字符串中，所有元素紧挨着排列，不需要间隔，如果参数是“,”则就是“,”间隔
    var str = (0..count).joinToString("") { char }
    // 下面这个this就是表示调用此方法的当前字符串对象
    return "$str$this$str"
}

fun main() {
    // 如果上面没有“{ char }”这个代码块，输出的字符串应该是“01234Hello World01234”
    // 如果有，则输出的字符串的每个字符都是表达式的值，即“*****Hello World*****”
    print("Hello World".wrapChar("*", 4))
}

// 扩展不能真正的修改他们所扩展的类。
// 通过定义一个扩展，并没有在一个类中插入新成员，
// 只不过是可以通过该类型的变量用点表达式去调用这个新函数。
```

<br>　　范例2：扩展是静态解析的。

``` kotlin
package com.kotlintest

open class Shape
class Rectangle : Shape()

fun Shape.getName() = "Shape"
fun Rectangle.getName() = "Rectangle"

fun main() {
    // 当父类和子类有重名的扩展函数时，最终调用谁的函数，
    // 是由函数调用所在的表达式的类型来决定的，而不是由表达式运行时求值结果决定的。

    // 表达式的类型是Rectangle，所以输出：Rectangle
    var s1 = Rectangle()
    println(s1.getName())

    // 表达式的类型是Shape，所以输出：Shape
    var s2: Shape = Rectangle()
    println(s2.getName())
}
```

<br>　　范例3：函数重名。

``` kotlin
package com.kotlintest

class Example {
    fun printFunctionType() { println("Class method") }
}

fun Example.printFunctionType() { println("Extension function") }

fun main() {
    // 如果一个类定义有一个成员函数与一个扩展函数，
    // 而这两个函数又有相同的接收者类型、 相同的名字，并且都适用给定的参数，
    // 这种情况总是取成员函数。
    // 输出：Class method
    Example().printFunctionType()

    // 当然，扩展函数重载了，与其同样名字但不同签名成员函数，是不会有问题的。
}
```

<br>　　范例4：扩展Any类。

``` kotlin
package com.kotlintest

// 这样一来，所有的类都具有了sayHello方法，包括“null”
fun Any?.sayHello() {
    println("Hello World")
}

class Person {

}

fun main() {
    var p = Person()
    p.sayHello()
    null.sayHello()
}
```

<br>　　范例5：中缀表示法。

``` kotlin
package com.kotlintest

// 标有 infix 关键字的函数也可以使用中缀表示法（忽略该调用的点与圆括号）调用。
// 中缀函数必须满足以下要求：
// 1、它们必须是成员函数或扩展函数。
// 2、它们必须只有一个参数。
// 3、其参数不得接受可变数量的参数且不能有默认值。

// 定义一个支持中缀表示法的扩展函数，用作字符串拼接
infix fun String.append(str: String) = "$this$str"

fun main() {
    // 可以向之前那样（通过.和圆括号）调用这个函数
    println("你好 ".append("张三"))
    // 也可以直接使用方法名来调用
    println("Hello " append "World")
}
```

### 操作符重载 ###

<br>　　范例1：重载入门。

``` kotlin
package com.kotlintest

fun main() {
    // 众所周知Kotlin中内置了很多操作符，比如：+、-、*、/、++、--等等
    // 当我们对一个变量使用这些操作符时，其实就是调用了该变量所属类的某个特定函数。
    var n = 3
    // 下面的代码其实就是调用了Int类的的inc()函数：
    n++
    println(n)

    // 这就意味着，我们完全可以自己定义一个Person类，让它也支持“++”运算符
    var p = Person("张三", 18)
    println("${p.name},${p.age}")
    p++
    println("${p.name},${p.age}")
}

class Person(var name: String, var age: Int) {
    // 使用“operator”关键字来定义一个操作符函数
    // 对于“++”操作符来说，编译器会自动调用名为inc的函数，若无则编译报错
    operator fun inc(): Person {
        this.age++
        return this
    }
}
```

<br>　　范例2：Int与Person的运算。

``` kotlin
package com.kotlintest

// 给Int类扩展一个操作符重载函数
operator fun Int.plus(p: Person): Int {
    return this + p.age
}

class Person(var name: String, var age: Int)

fun main() {
    var a = 100
    var p = Person("张三", 29)
    // “+”对应的就是“plus”函数
    // 当执行下面的操作时，虚拟机就会调用“+”运算符左侧对象的plus(Person)函数
    // 程序输出：129
    println(a + p)
}

```

<br>　　范例3：equals方法。

``` kotlin
package com.kotlintest

fun main() {
    var p1 = Person("张三", 18)
    var p2 = Person("张三", 20)
    // equals函数被定义在Any类中，由于Any类是所有类的父类，所以所有类都继承了这个函数
    // 该函数的签名为：
    // public open operator fun equals(other: Any?): Boolean
    // 当我们对着两个对象使用“==”时，就会调用“==”左侧那个对象的equals方法
    println(p1 == p2)
}

class Person(var name: String, var age: Int) {

    override fun equals(other: Any?): Boolean {
        println("Person equals 被调用")
        if (other is Person) {
            // 接着会触发String类的equals方法的调用
            return this.name == other.name
        }
        return false
    }
}
```

<br>　　范例4：其它方法。

``` kotlin
// 在Kotlin中我们可以重载的操作符包括但不限于以下操作符：
// 具体详见：https://book.kotlincn.net/text/operator-overloading.html

// +a       a.unaryPlus()
// -a       a.unaryMinus()
// !a       a.not()
// a++      a.inc()
// a--      a.dec()
// a + b    a.plus(b)
// a - b    a.minus(b)
// a * b    a.times(b)
// a / b    a.div(b)
// a % b    a.rem(b)
// a..b     a.rangeTo(b)
// a in b   b.contains(a)
// a !in b  !b.contains(a)
// a += b   a.plusAssign(b)
// a -= b   a.minusAssign(b)
// a *= b   a.timesAssign(b)
// a /= b   a.divAssign(b)
// a %= b   a.remAssign(b)
// a > b    a.compareTo(b) > 0
// a < b    a.compareTo(b) < 0
// a >= b   a.compareTo(b) >= 0
// a <= b   a.compareTo(b) <= 0
```

### lambda表达式 ###

<br>　　范例1：匿名函数与lambda表达式。

``` kotlin
package com.kotlintest

// 定义一个普通函数
fun test1() {
    println("张三，你好")
}

// 定义一个匿名函数，它没有参数也没有返回值，并将它赋值给名为“test2”的变量
// 这个变量的类型为“() → Unit”
var test2 = fun() {
    println("李四，你好")
}

// 我们可以更进一步，将“fun()”也省写掉
// 这种写法其实就是Kotlin中的lambda表达式，因此所谓的lambda其实就是匿名函数的特殊写法
var test3 = {
    println("王五，你好")
}

// 当然如果你想让匿名函数有参数、有返回值可以这么写：
var test4 = { number: Int ->   // 此处的“number: Int”就是参数列表
    println("王五，你好 $number")
    // 不需要在lambda表达式里写return语句，lambda主体中的最后一个表达式会视为返回值
    3   // 此处的“3”就是返回值
}
var test5 = { a: Int, b: Int ->
    a + b
}

// 若编译器无法推断出匿名函数的类型时，则函数的类型需要直接在变量后面明确指出
// 下面的匿名函数：接收一个Int参数，返回值为Int类型
var test6: (Int) -> Int = {
    // it是内置的关键词，如果你的lambda只有1个参数，则可以直接使用it表示那个参数
    it + 111
}

fun main() {
    test1()
    test2()
    test3()
    println(test4(666))
    println(test5(555, 111))
    println(test6(555))
}
```

<br>　　范例2：传递末尾的lambda表达式。

``` kotlin
package com.kotlintest

fun main() {
    // 我们在创建数组的时候，其实就是用到了lambda表达式
    var array = IntArray(5) {
        it + 1
    }

    // 其实IntArray的构造函数的签名是这样的：
    // public inline constructor(size: Int, init: (Int) -> Int)
    // 它接受两个参数，第二个参数是一个函数，
    // 按照 Kotlin 惯例，如果函数的最后一个参数是函数，
    // 那么作为相应参数传入的 lambda 表达式可以放在圆括号之外

    println(array.contentToString())
}
```

<br>　　范例3：指定返回值。

``` kotlin
package com.kotlintest

// lambda表达式默认是以最后一行为其返回值
// 但我们也可以像break、continue那样，事先定义一个标记
// 然后通过“return@标记名”的方式来明确指定返回值
var test1 = mark@{ isFinish: Boolean ->
    if (isFinish) {
        return@mark 666
    } else {
        return@mark 777
    }
}

fun main() {
    // 输出：666
    println(test1(true))
    // 输出：777
    println(test1(false))
}
```

<br>　　范例4：真正的匿名函数。

``` kotlin
package com.kotlintest

// 范例1中的代码，虽然我嘴上说定义的是匿名函数，但其实还是用变量持有了函数的引用
// 因此严格意义来说，那些函数不能算是匿名的
// 本函数用来创建一个真正的匿名函数，匿名函数的类型为“(Int, Int) -> Int”
fun createFunction(): (Int, Int) -> Int = { a: Int, b: Int ->
    // 直接用一对大括号就可以定义一个匿名函数了
    // “a: Int, b: Int”是匿名函数的参数列表
    // 匿名函数的返回值编译器能推算出来，就是“a+b”的值，也就是Int类型的
    a + b
}

fun main() {
    // 先调用createFunction，取得返回值后，紧接着通过“(5, 5)”调用匿名函数
    // 匿名函数被调用后，就无效了，因为外界没有任何地方持有该函数的引用
    println(createFunction()(5, 5))
    // 下面这种写法其实也是操作符重载，调用函数时可以用“函数名()”也可以用“函数名.invoke()”
    // a()              a.invoke()
    // a(i)             a.invoke(i)
    // a(i, j)          a.invoke(i, j)
    // a(i_1, ……, i_n)  a.invoke(i_1, ……, i_n)
    println(createFunction().invoke(5, 5))
}
```

### 内部类 ###

<br>　　范例1：实例内部类和静态内部类。

``` kotlin
package com.kotlintest

class Outer(var name: String, var age: Int) {

    // 实例内部类，其会持有外部类的引用，可以访问外部类的成员
    // 创建实例内部类对象前，需要先创建外部类的引用
    inner class Inner {
        fun sayHello() {
            println("$name,$age")
        }
    }

    // 静态内部类
    // 直接通过外部类名访问，不持有外部类引用，不可访问外部类成员
    class StaticInner {
        fun sayHello() {
            println("无法读取外部类成员")
        }
    }
}

fun main() {
    Outer("张三", 18).Inner().sayHello()
    Outer.StaticInner().sayHello()
}
```

<br>　　范例2：匿名内部类。

``` kotlin
package com.kotlintest

import android.view.View

// 在Java中有匿名内部类的概念，以Android为例，通常我们会这么写代码：
// Button btn = findViewById(R.id.btn);
// btn.setOnClickListener(new View.OnClickListener(){
//
// });

// 上面代码的语义是：
// 创建一个View.OnClickListener的实现类，这个类是匿名的（没有名字），
// 同时会为这个匿名类实例化一个对象，以便后续使用。
// 也就是说，创建匿名类时必须同时产生一个对象，
// 若只是创建一个单独匿名类，则是无意义的，因为没法使用它。

// 在Kotlin中，也支持这个操作（创建匿名类的同时创建一个对象），这个操作通过“对象表达式”来实现
fun main() {
    // 使用“object”关键字定义一个对象表达式，表达式会定义匿名类并实例化出一个该类的对象
    // “:”表示继承/实现关系，当前匿名类继承了Person类，
    // 同时实现了View.OnClickListener和Runnable两个接口
    // 匿名对象可以继承/实现0~n个类/接口，其内部需要重写所有继承而来的抽象方法
    var a = object : View.OnClickListener, Runnable, Person("张三", 20) {
        override fun onClick(v: View?) {
            // 由于是继承了Person类，所以其内部可以访问Person类的对象
            println("我叫${name}，今年${age}岁了，onClick被调用了")
        }

        override fun run() {
            println("我叫${name}，今年${age}岁了，run被调用了")
        }
    }
    a.onClick(null)
    a.run()
}

open class Person(var name: String, var age: Int) {

}
```

<br>　　范例3：没有任何父类。

``` kotlin
package com.kotlintest

fun main() {
    // 若匿名内部类没有任何父类，则就可以省写为下面这样
    var b = object {
        fun run() {
            println("我没有任何父类")
        }
    }
    b.run()
}
```

<br>　　范例4：单例模式。

``` kotlin
package com.kotlintest

// 上面两个范例是将对象表达式写在某个函数内部，以此来实现匿名内部类。
// 事实上，我们可以将对象表达式定义在顶层

// 当对象表达式被定义在顶层时，我们需要为那个匿名对象指定一个名字
// 下面就定义了一个名为“SingleInstance”的对象
// 这个对象是匿名类的唯一一个对象，即我们可以用这个特性来实现单例设计模式
object SingleInstance {
    var name = ""
    var age = 0

    fun sayHello() {
        println("我叫${name}，今年${age}岁了")
    }
}

fun main() {
    // 对象的初始化过程是线程安全的并且在首次访问时进行
    SingleInstance.name = "张三"
    SingleInstance.sayHello()
}
```

<br>　　范例5：伴生对象与静态函数。

``` kotlin
package com.kotlintest

// 由于Kotlin需要支持跨平台，所以在Kotlin中没有Java语言中的静态函数的概念，
// 但实际开发中我们不可避免的会有一些静态工具类，总不能每次使用工具类都先创建一个对象吧
// 于是Kotlin就提供了一个“伴生对象”的概念

class TextUtil {
    // 在类的内部使用“companion object”关键字来定义一个伴生对象
    // 这个对象可以有名字，也可以没有名字，如果没名字，则默认叫“Companion”
    // 下面这个伴生对象的名字叫“Instance”
    // 我们先将自己的“静态函数”定义到伴生对象的内部，外界就可以直接通过类名来调用这个函数了
    companion object Instance {
        // 定义一个常量
        const val FORMAT_TIME = "%02d:%02d:%02d"
        // 定义一个变量
        var number = 666
        
        fun formatDuring(mss: Long): String? {
            val hours = mss % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)
            val minutes = mss % (1000 * 60 * 60) / (1000 * 60)
            val seconds = mss % (1000 * 60) / 1000
            return String.format(FORMAT_TIME, hours, minutes, seconds)
        }
    }
}

fun main() {
    // 将20分钟格式化显示
    // 通过“类名.方法名”直接调用
    println(TextUtil.formatDuring(1000 * 60 * 20))
    // 通过“类名.伴生对象名.方法名”调用
    println(TextUtil.Instance.formatDuring(1000 * 60 * 20))
    
    // 定义了伴生对象的类，依然可以被实例化
    var util = TextUtil()
    // 普通对象无法访问伴生对象内定义的函数和方法，反之也一样（伴生对象无法访问外部类的成员）
    // 下面两个代码会编译报错
    // util.formatDuring(1000 * 60 * 20)
    // util.number
}
```

### 数据类 ###

<br>　　范例1：数据类入门。

``` kotlin
package com.kotlintest

// 在Java中有JavaBean的概念，JavaBean用来保存数据，并为每个属性提供get、set方法
// 在Kotlin中提供了类似的概念，就是“数据类”，使用“data”关键词来定义
// 下面的“News”类表示一条新闻，“id”表示新闻的ID，“comment”表示新闻的用户评论数量
data class News(var id: String, var comment: Int) {
}

fun main() {
    var news1 = News("100001", 100)
    var news2 = News("100002", 120)

    // 编译器会为数据类自动生成如下几个函数：
    // 1、equals()/hashCode()
    // 2、toString()
    // 3、componentN()函数，按声明顺序对应于所有属性。
    // 4、copy()函数
    // 5、类内每个属性的get、set方法

    // 通过AS菜单栏的“Tool”->“Kotlin”->“Show Kotlin Bytecode” ->“Decompile”功能
    // 来观察生成的字节码里是否有上面说的函数

    // 输出：News(id=100001, comment=100)
    println(news1)
    // 输出：News(id=100002, comment=120)
    println(news2)
    // 输出：false
    println(news1 == news2)
}
```

<br>　　范例2：自己重写函数。

``` kotlin
package com.kotlintest

// 上个范例生成的News.class类里没有无参构造方法，因此实例化对象的同时必须指定参数
// 但实际开发中，我们的JavaBean都是由JSON解析出来的，而JSON是需要无参构造方法的
// 我们可以给主构造器里的参数赋默认值来解决这个问题，此时就会生成无参构造方法了
data class News1(var id: String? = null, var comment: Int = 0)
// 小提示：如果类体中没有东西，可以省写类体（那对大括号）


// 此时还有一个问题：
// 编译器自动帮我们生成的equals、hashCode等函数，是基于主构造函数里列出的属性的。
// 也就是说，若主构造器里有10个参数，那么equals等函数内部就让这10个参数参与计算，
// 但两个“News”对象是否相等，应该只判断其id属性值是否相等就可以，
// 没必要吧comment也算上，一旦算上了，若对象的comment属性值变了，就会认为不相等，显然不科学

data class News2(var id: String? = null, var comment: Int = 0) {
    // 如果在数据类体中有显式实现 equals()、 hashCode() 或者 toString()，
    // 或者这些函数在父类中有 final 实现，那么不会生成这些函数，而会使用现有函数。
    override fun equals(other: Any?): Boolean {
        return when (other) {
            !is News2 -> false
            else -> this === other ||
                    id == other.id
        }
    }
    // 需要注意的是，不允许为 componentN() 以及 copy() 函数提供显式实现。
}

fun main() {
    // 输出：false
    println(News2("1001") == News2("1002"))
}
```

<br>　　范例3：屏蔽某个属性。

``` kotlin
package com.kotlintest

// 请注意，对于那些自动生成的函数，编译器只使用在主构造函数内部定义的属性。
// 如需在生成的实现中排除一个属性，请将其声明在类体中：
data class News2(var id: String? = null) {
    // 此时那些生成的函数里，就不会考虑这个属性了
    var comment: Int = 0
}

// 另外，为了确保生成的代码的一致性以及有意义的行为，数据类必须满足以下要求：
// 主构造函数需要至少有一个参数。
// 主构造函数的所有参数需要标记为 val 或 var。
// 数据类不能是抽象、开放、密封或者内部的。
```

<br>　　范例4：解构。

``` kotlin
package com.kotlintest

// 事实上，数据类型主构造函数内列出的属性，也被称为“组件”
// 它们按照出现的顺序，被依次编号，从1开始
data class News(var id: String? = null, var comment: Int = 0)

fun main() {
    var news = News("1001", 666)
    // 组件1就表示对象的id属性，组件2就表示对象的comment属性
    println("${news.component1()},${news.component2()}")

    // 下面这种语法称为解构声明，一个解构声明同时创建多个变量。
    // 声明了两个新变量： id 和 comment，并且可以独立使用它们。
    var (id, comment) = news
    println("$id,$comment")

    // 一个解构声明会被编译成以下代码：
    // val id = news.component1()
    // val comment = news.component2()
}
```

<br>　　范例5：多返回值函数。

``` kotlin
package com.kotlintest

// 如果你的函数需要返回2个值，可以使用Kotlin内置的Pair类来实现
// 下面“Pair<Int, String>”中的Int、String是泛型，可以改为你想要的类型
fun create2Result(): Pair<Int, String> {
    return Pair(10086, "Hello")
}
// 如果你的函数需要返回3个值，可以使用Kotlin内置的Triple类来实现
fun create3Result(): Triple<Int, String, Boolean> {
    return Triple(10086, "World", false)
}

fun main() {
    var towResult = create2Result()
    // 可以通过Pair类的两个属性来访问
    println("${towResult.first}, ${towResult.second}")

    // 也可以使用解构表达式来解构返回值
    // 下面就是将Triple类的三个数据，解构到了a、b、c三个变量中了
    var (a, b, c) = create3Result()
    println("${a}, ${b},${c}")
}
```

### 枚举类 ###

<br>　　范例1：枚举的定义。

``` kotlin
package com.kotlintest

// 使用“enum”定义一个枚举类
enum class Color1 {
    // 下面定义四个枚举常量，每个枚举常量都是一个对象，枚举常量以逗号分隔。
    RED, GREEN, YELLOW, BLUE
}

// 为枚举类指定主构造函数，同时实现了“Runnable”接口
enum class Color2(var colorName: String, var colorValue: Int) : Runnable {
    // 枚举常量在创建的同时，需要为主构造器提供参数
    RED("红色", 100),
    GREEN("绿色", 200) {
        // 每个枚举常量也可以单独重写自己的方法
        override fun toString(): String {
            return "我是${colorName},你好啊！"
        }
    },
    YELLOW("黄色", 300) {
        override fun run() {
            println("黄色的run")
        }
    },
    BLUE("蓝色", 400); // 枚举常量和其它成员之间需要用“;”间隔

    // 直接在枚举类内部重写toString、run方法，
    // 若枚举常量自己没有重写它们，则会调用枚举类重写的函数
    override fun toString(): String {
        return colorName
    }

    override fun run() {
        println("通用的run")
    }
}

fun main() {
    // 输出：RED,GREEN
    println("${Color1.RED},${Color1.GREEN}")
    // 输出：红色,我是绿色,你好啊！
    println("${Color2.RED},${Color2.GREEN}")
    Color2.RED.run()
    Color2.YELLOW.run()
}
```

<br>　　范例2：枚举的应用。

``` kotlin
package com.kotlintest

enum class Color {
    RED, GREEN, YELLOW, BLUE
}

// 给Color类扩展一个函数，获取当前枚举对象的下一个枚举对象
fun Color.next(): Color {
    // 所有枚举常量按照其定义的顺序来定，都一个“ordinal”属性，表示其编号，从0开始。
    return Color.values()[(ordinal + 1) % Color.values().size]
}

fun main() {
    println(Color.RED.next())
    println(Color.GREEN.next())
    println(Color.YELLOW.next())
    println(Color.BLUE.next())

    // 在when表达式中使用
    var color = Color.RED
    var colorName = when (color) {
        Color.RED -> "红色"
        Color.GREEN -> "绿色"
        Color.YELLOW -> "黄色"
        Color.BLUE -> "蓝色"
    }
    println(colorName)

    // 对两个枚举常量比较大小时，比较的就是枚举的ordinal
    // 输出：true
    println(Color.BLUE > Color.GREEN)
    // 枚举也可以定义区间
    var colorRange = Color.GREEN..Color.BLUE
}
```

### 集合框架 ###

<br>　　范例1：List。

``` kotlin
package com.kotlintest

fun main() {
    // 创建一个不可变的List集合，所谓不可变，就是该List对象没有提供add、remove、set等方法。
    var list1 = listOf(1, 2, 3, 4, 5)
    // 可以通过get函数获取数据，也可以通过中括号方式获取
    println("第1个元素为：${list1.get(0)}，最后一个元素为：${list1[list1.size - 1]}")

    // 注意，list1的类型是“List<Int>”，而这个List是Kotlin里定义接口，不是Java的List。
    // 虽然如此，但是在JVM环境下，最终编译出来的接口还是会指向Java的List。
    // 原因也很简单，Kotlin除了支持JVM平台，还支持JS、Native平台，
    // 因此Kotlin需要定义自己的集合接口，作为统一的抽象，而具体的实现，可以由各个平台来做。

    // 创建一个可变的List集合，MutableList也是Kotlin里定义接口。
    var list2 = mutableListOf(6, 7, 8, 9, 10)
    list2.set(0, 666)
    list2[1] = 777
    // MutableList会自动扩容
    for (i in 1..3) {
        list2.add(100)
    }
    // 运算符重载，“+=”表示添加元素，“-=”表示删除元素。
    list2 += 5
    // 输出：[666, 777, 8, 9, 10, 100, 100, 100, 5]
    println(list2)

    // 下面的ArrayList是Kotlin中定义，它本质上是使用“typealias”关键字定义一个类型别名
    // 这个别名在JVM环境下，指向的是Java的java.util.ArrayList类
    // 因此java.util.ArrayList类的所有方法，在Kotlin中的ArrayList类中都可以用
    var list3 = ArrayList<Int>()
    list3.add(0, 100)
    println(list3)
}
```

<br>　　范例2：Map。

``` kotlin
package com.kotlintest

import java.util.*

fun main() {
    // 不可变的Map
    var map1 = mapOf(Pair("姓名", "张三"), Pair("姓名", "李四"))
    println("集合长度：${map1.size}，${map1.get("姓名")}")

    // 可变的Map
    // 关键词“to”其实就是前面介绍的中缀表达式
    var map2 = mutableMapOf("姓名" to "张三", "年龄" to "20")
    // 访问Map的元素也可以用中括号的形式
    println("${map2["姓名"]} ，${map2["年龄"]}")
    println(map2)

    var map3 = TreeMap<String, String>()
    map3.put("姓名","李四")
    map3.put("年龄","18")
    println(map3)
}
// 如果你要使用TreeMap，则就会直接导入java.util包中的类
```

<br>　　范例3：集合的遍历。

``` kotlin
package com.kotlintest

import java.util.*

data class Person(var id: String="", var name: String="", var age: Int=0) {
    override fun equals(other: Any?): Boolean {
        if (other is Person) {
            return this.id == other.id
        }
        return false
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}

fun main() {
    var map = TreeMap<String, Person>()
    map.put("1003", Person("1003", "王五", 20))
    map.put("1001", Person("1001", "张三", 18))
    map.put("1004", Person("1004", "赵六", 21))
    map.put("1002", Person("1002", "李四", 19))
    // 普通遍历
    for (entry in map) {
        println("${entry.key} -> ${entry.value}")
    }
    // forEach遍历
    // forEach函数接收一个“(Map.Entry<K, V>) -> Unit”的参数
    // 于是按照lambda表达式的规则，我们可以直接简写成下面这样，it表示当前元素
    map.forEach {
        // 如果当前元素的key为“1003”，则跳过当前元素
        if (it.key == "1003") {
            // forEach是一个已经定义好的标签，我们可以直接用
            return@forEach
        }
        println(it)
    }
}
```

<br>　　范例4：集合的过滤/筛选。

``` kotlin
package com.kotlintest

fun main() {
    // 定义一个不可变集合
    var list = listOf(1, 2, 3, 4, 5, 6, 7, 8)

    // 调用Iterable接口的“filter”扩展函数筛选集合里的元素
    // “filter”扩展函数接收一个“(T) -> Boolean”的参数函数
    // 运行时，“filter”函数会依次为集合的每个元素调用参数函数，若返回true，则认为符合条件
    // 整个集合遍历完毕后，“filter”函数就把所有返回true的元素组合成一个新的集合，返回给调用者
    // 也就是说，我们只需要把筛选条件写在参数函数里即可
    list = list.filter { it % 2 == 0 }
    
    // 输出：2, 4, 6, 8
    println(list.joinToString())
}
```

<br>　　范例5：集合的转换。

``` kotlin
package com.kotlintest

fun main() {
    // 定义一个不可变集合
    var list1 = listOf(1, 2, 3, 4, 5, 6, 7, 8)

    // map函数用来执行转换。
    // map函数会依次为集合里的每一个元素，调用一下参数函数，并将其返回值记录
    // 当整个集合遍历完毕后，就将参数函数的返回值组成一个新的集合，并返回
    // 下面的代码用来将列表里的每个数字*100，然后转成String。
    var list2 = list1.map { "串${it * 100}" }

    // 输出：串100, 串200, 串300, 串400, 串500, 串600, 串700, 串800
    println(list2.joinToString())
}
```

<br>　　范例6：混合运算。

``` kotlin
package com.kotlintest

fun main() {
    var list1 = listOf(1, 2, 3, 4, 5, 6, 7, 8)
    list1
        .filter {
            it % 2 == 0
        }.map {
            "串${it * 100}"
        }
        .forEach {
            println(it)
        }
}
```

<br>　　范例7：flatMap。

``` kotlin
package com.kotlintest

fun main() {
    var list1 = listOf(1, 2, 3)
    // 依次为集合里的每一个元素调用参数函数
    // 参数函数会要求返回一个集合，flatMap会记下来
    // 当整个集合遍历完毕后，floatMap会将记下来的所有集合中的所有数据，合并到一个新集合中

    // 下面代码会产生3个集合：
    // [1]、[1,2]、[1,2,3]
    // flatMap最终会将3个集合内的所有元素合并到一个新集合中
    var list2 = list1.flatMap { 1..it }
    // 输出：6
    println(list2.size)
}
```

### 可见性修饰符 ###

<br>　　在 Kotlin 中有这四个可见性修饰符：`private`、 `protected`、 `internal`和`public`，默认可见性是`public`。类、对象、接口、构造函数、方法与属性及其`setter`都可以有可见性修饰符，`getter`总是与属性有着相同的可见性。

<br>　　范例1：包与顶层声明。

``` kotlin
package com.kotlintest

// 文件名：example.kt
// 函数、属性和类、对象和接口可以直接在包内的顶层声明。

// 如果你不使用任何可见性修饰符，默认为 public，这意味着你的声明将随处可见。
class Bar { …… }

// 如果你声明为 private，它只会在声明它的文件内可见。
// 在 example.kt 内可见
private fun foo() { …… } 

public var bar: Int = 5 // 该属性随处可见
    private set         // setter只在 example.kt 内可见
                        // getter的可见性必须和属性可见性一致

// 如果你声明为 internal，它会在相同模块内随处可见（什么是相同模块，后述）。
internal val baz = 6 

// protected 修饰符不适用于顶层声明。

// 要使用另一包中可见的顶层声明，需要将其导入进来。
```

<br>　　范例2：类成员。

``` kotlin
package com.kotlintest

// 对于类内部声明的成员：
// private 意味着该成员在这个类内部（包含其所有成员）可见；
// protected 意味着该成员具有与 private 一样的可见性，但也在子类中可见。
// internal 意味着能见到类声明的本模块内的任何客户端都可见其 internal 成员。
// public 意味着能见到类声明的任何客户端都可见其 public 成员。

// 如果你覆盖一个 protected 或 internal 成员并且没有显式指定其可见性，
// 该成员还会具有与原始成员相同的可见性。

open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // 默认 public

    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a 不可见
    // b、c、d 可见
    // Nested 和 e 可见

    override val b = 5   // “b”为 protected
    override val c = 7   // 'c' is internal
}

class Unrelated(o: Outer) {
    // o.a、o.b 不可见
    // o.c 和 o.d 可见（相同模块）
    // Outer.Nested 不可见，Nested::e 也不可见
}
```

<br>　　范例3：主构造函数。

``` kotlin
package com.kotlintest

// 您需要添加一个显式constructor关键字。
// 默认情况下，所有构造函数都是 public，下面的构造函数是私有的。
class C private constructor(a: Int) { …… }

// 另外，局部变量、函数和类不能有可见性修饰符。
```

<br>　　范例4：模块。

``` kotlin

// 可见性修饰符 internal 意味着该成员只在相同模块内可见。

// 所谓的模块就是：
// 一个 IntelliJ IDEA 模块
// 一个 Maven 项目
// 一个 Gradle 源代码集（例外是 test 源代码集可以访问 main 的 internal 声明）
// 一次 <kotlinc> Ant 任务执行所编译的一套文件


// 其中第四条是本质，即同批次编译出来的文件属于相同的模块。
// 直观的讲，大致可以认为模块就是一个jar包、一个aar包。
// internal关键字一般由SDK开发者用于隐藏模块内部细节实现，一些特殊的类、函数不想给外界使用。


// 需要知道的是，internal是Kotlin提出的概念。
// 如果你在Java语言中调用Kotlin的internal成员，默认情况下也是可以调的。
// 可以用“@JvmName”注解来解决
class Person {
    // 这个注解用来修改“sayHello”函数被编译后生成的函数名称
    // 若我们把名称搞成“%”开头，那么在Java端就无法调用了，因为违反Java标识符命名规定。
    @JvmName("%ksjfhks")
    internal fun sayHello() {
        println("Hello World!")
    }
}
```

## 进阶特性 ##
### 代理 ###

<br>　　范例1：代理是干什么用的。

``` kotlin
package com.kotlintest

// 定义一个飞翔接口，其内有四个函数，每个函数对应一种飞行姿势
interface Fly {
    fun fly1()
    fun fly2()
    fun fly3()
    fun fly4()
}

// 定义一个鸟类，实现了这四种飞行姿势
class Bird() : Fly {
    override fun fly1() = println("飞行姿势-1！")
    override fun fly2() = println("飞行姿势-2！")
    override fun fly3() = println("飞行姿势-3！")
    override fun fly4() = println("飞行姿势-4！")
}

// 此时产品有个需求：在Fly实现类执行fly1的时候，记录一些信息，以便后续统计分析
// 需求分析：
// 1、记录信息的操作显然不能在Fly的某个子类（比如Bird）中写，因为任何子类都可能有这个需求
// 2、现在是fly1需要记录，说不定以后Fly类还会提供一个fly5函数，且fly5也需要记录
// 为了实现这个需求，我们打算定义一个新类，由其执行记录任务，同时它需要实现Fly接口
class BirdRecord1(var bird: Fly) : Fly {
    override fun fly1() {
        bird.fly1()
        println("记录数据啦")
    }

    override fun fly2() {
        bird.fly2()
    }

    override fun fly3() {
        bird.fly3()
    }

    override fun fly4() {
        bird.fly4()
    }
}
// 上面的代码有个问题：目前只有fly1需要记录数据，但我们却重写了另外三个函数
// 对于此类情况，Kotlin提供了代理功能，可以让我们只重写fly1就可以了
// 写法很简单，只需要在类主构造器的后面加上“by bird”就可以了
class BirdRecord2(var bird: Fly) : Fly by bird {
    // 上面这行代码的语义就是：
    // 1、定义一个名为BirdRecord2的类，接收一个名为bird的Fly实现类
    // 2、BirdRecord2类也实现了Fly接口，只不过接口中的方法默认由bird对象去实现
    // 3、但若BirdRecord2类明确提供了方法实现，则优先调用重写后的方法
    override fun fly1() {
        bird.fly1()
        println("记录数据啦")
    }
}

fun main() {
    var bird = Bird()
    // 输出：
    // 飞行姿势-1！
    // 记录数据啦
    BirdRecord1(bird).fly1()
    // 输出：
    // 飞行姿势-1！
    // 记录数据啦
    BirdRecord2(bird).fly1()
    // 输出：飞行姿势-4！
    BirdRecord2(bird).fly4()
}
```

<br>　　范例2：代理-属性隐藏。

``` kotlin
package com.kotlintest
interface Base {
    val message: String
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // 在 b 的 `print` 实现中不会访问到这个属性
    override val message = "Message of Derived"
}

fun main() {
    val derived = Derived(BaseImpl(10))
    // 程序输出：
    // BaseImpl: x = 10
    // Message of Derived
    derived.print()
    println(derived.message)
}
```

<br>　　范例3：代理 - 属性值。

``` kotlin
package com.kotlintest

import kotlin.reflect.KProperty

class Person() {
    // 定义一个name属性，类型是String，其默认值是一个PersonProxy对象。
    // 当JVM需要读写name的值时，不再直接读写，而是通过代理类来读写。
    var name: String by PersonProxy()
}

class PersonProxy {
    private var value = "张三"

    // 当需要获取属性值时（应该就是那个by关键字，待测试），调用此方法
    operator fun getValue(person: Person, property: KProperty<*>): String {
        println("前端访问${property.name}")
        // 统一返回一个默认值
        return value
    }

    // 当需要修改属性值时，调用此方法，执行修改，若你在方法里不做任何操作，则不会修改
    operator fun setValue(person: Person, property: KProperty<*>, s: String) {
        println("前端请求修改 ${property.name} 属性的值从“${this.value}”到“$s”")
        this.value = s
    }

}

fun main() {
    var p = Person()
    println(p.name)
    p.name = "李四"
    println(p.name)
}
```

<br>　　范例4：属性代理 - 延迟初始化。

``` kotlin
package com.kotlintest

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

// 在Android开发时，下面的代码是比较常见的：
//class MainActivity : Activity() {
//    var textView: TextView;
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        textView = findViewById(R.id.textView)
//    }
//}
// 但是由于Kotlin的var属性要求定义的同时必须立即初始化，所以上面的代码是无法编译通过的。

// 解决方法1：为其赋值null
class MainActivity1 : Activity() {
    var textView: TextView? = null;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        textView = findViewById(R.id.textView)

        // 使用TextView的时候，需要用“?.”，防止空指针
        textView?.setText("Hello World")
    }
}

// 解决方法2：使用“lateinit”关键字，将属性标记为稍后初始化
class MainActivity2 : Activity() {
    lateinit var textView: TextView;
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 为了防止textView被重复初始化，Kotlin提供了"isInitialized"函数
        // 用来帮我们查看View是否已经初始化了
        // 很显然，这个解法也很差劲，也不推荐大家使用
        if(::textView.isInitialized){
            textView = findViewById(R.id.textView)
        }
        textView.setText("Hello World")
    }
}

// 解决方法3：使用“lazy”
class MainActivity3 : Activity() {
    // 这里必须使用“val”关键词定义属性
    // 下面代码的语义是：
    // 这个变量目前不需要初始化，当外界首次使用此变量时，
    // 就执行后面的lambda表达式里的语句进行初始化
    val textView by lazy {
        findViewById<TextView>(R.id.textView)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        textView.setText("Hello World")
    }
}
// 事实上“lazy”是一个函数，我们进一步去查看其源码就会发现
// 它返回了一个名为“SynchronizedLazyImpl”的实现类，并将其赋值给textView
// 当textView每次访问值时，都会找SynchronizedLazyImpl类，而在其内部就会判断
// 若当前“SynchronizedLazyImpl”内部的属性未初始化，则调用lambda表达式初始化
// 若初始化过了，则直接返回对应的值。
// 说白了“SynchronizedLazyImpl”就是一个代理，一个中间商。
```

<br>　　范例5：属性代理 - 监听值变化。

``` kotlin
package com.kotlintest

import kotlin.properties.Delegates

class Person() {
    // 给属性添加观察者，当属性值改变时，会回调这个lambda表达式
    // “匿名用户”是这个属性的默认值
    var personName: String by Delegates.observable("匿名用户") { 
        property, oldValue, newValue ->
        println("${property.name} {${oldValue} -> ${newValue}} ")
    }
}

fun main() {
    var p = Person()
    // 输出：匿名用户
    println(p.personName)
    // 输出：personName {匿名用户 -> 张三}
    p.personName = "张三"
    // 输出：张三
    println(p.personName)
}
```

### 泛型 ###

<br>　　范例1：泛型基础。

``` kotlin
package com.kotlintest

// 关于泛型是干什么用的，本文不再重复介绍，请参阅笔者写的《Java语言》一文

// 泛型类的定义：
// 在类名后面加上“<泛型>”即可
class Point<T>(var x: T, var y: T)

// 泛型函数的定义：
// 在函数名称之前添加“<泛型>”即可
fun <T> getPoint(x: T, y: T) {
}

// 在泛型的后面使用“:”可以限制泛型的上界
// 也就是说，泛型T只能是Number或者Number的子类
// 若没有使用“:”指明上界，则默认上界为“Any?”
class Point2<T : Number>(var x: T, var y: T)

fun main() {
    Point<Int>(1, 2)
    Point<String>("331", "2332")
    // 由于编译器可以通过我们传递给主构造器的值推算出泛型的类型，
    // 因此上面的<Int>和<String>可以省写
    Point("331", "2332")

    // 下面语句会编译报错
    // Point2("331", "2332")
    Point2(1.2, 5.4)
}
```

<br>　　范例2：where子句。

``` kotlin
package com.kotlintest

// 泛型T必须是“Comparable<T>”的子类，返回值也需要是T类型的
fun <T : Comparable<T>> max1(x: T, y: T): T {
    return if (x > y) x else y
}

// 当泛型需要满足多个条件时，可以使用“where”来列举所有条件
// 下面的泛型T需要满足两个条件：
// 1、T必须是Comparable<T>的子类
// 2、T必须是Number的子类
fun <T> max2(x: T, y: T): T
        where T : Comparable<T>,
              T : Number {
    return if (x > y) x else y
}

fun main() {
    println(max1(19, 332))
    println(max1("ABC", "abc"))
    // 此时若传递字符串给max2函数，则会编译报错
    println(max2(4.4, 5.3))
}
```

<br>　　范例3：不型变。

``` kotlin
package com.kotlintest

class Point<T>(var x: T, var y: T) {

}

fun main() {
    // 先来重申一下两个概念：
    // “类”和“类型”，List是一个类也是一个类型，“List<String>”和“List<Int>”只是一个类型。
    // “子类”和“子类型”，
    //     Int是Number的“子类”
    //     Int是Int?的“子类型”，虽然两者都对应Int类，但二者之间没有“继承”关系。

    var p1: Point<Long> = Point(1L, 2L)
    // 下面代码会编译出错，因为默认情况下Point<Number>并不是Point<Long>的父类型
    // 像这种Number是Long的父类，但Point<Number>并不是Point<Long>的父类型，
    // 我们称之为不型变。
    var p2: Point<Number> = p1

    // 为什么要有这个设定呢？
    // 假设“p2 = p1”可以编译通过，
    // 由于p2是Point<Number>类型的，那么你的同事就可能写出如下代码：
    p2.x = 1.2
    p2.y = 2.4
    // 当你试图通过p1使用x和y值时，就可能出现类转换异常ClassCastException
    val x: Long = p1.x
}
```

<br>　　范例4：协变。

``` kotlin
package com.kotlintest

// 如果你想让“Point<Long>”顺利赋值给“Point<Number>”，
// 可以在泛型T的前面添加一个关键字“out”。
class Point<out T>(val x: T, val y: T) {

}

fun main() {
    // 这种通过“out”关键字来实现“p2=p1”的操作，称之为协变
    var p1: Point<Long> = Point(1, 2)
    var p2: Point<Number> = p1
    println("${p2.x}，${p2.y}")

    // Kotlin默认不支持协变是为了保证数据安全，防止外界恶意修改。
    // 通过“out”关键字实现协变之后，类要付出的代价自然就是，禁止泛型T被外界修改。
    // 1、主构造器或者类内的属性，若是泛型T类型，则：
    //    a、若属性是private修饰的，则编译没有任何问题，因为外界无法访问，也就无法修改。
    //    b、若不是private修饰的，则不能使用var声明，可以用val声明，以此来禁止修改。
    // 2、类内的函数不能接收泛型T类型的参数（因为你可能在函数内部执行写操作），
    // 但类内函数可以返回泛型T类型的参数。

    // 事实上，我们之前介绍的“listOf”函数就是使用了“out关键字”，列表不支持修改操作
    // public interface List<out E> : Collection<E>
    var a1 = listOf<Long>(1,2,3,4)
    var a2: List<Number> = a1
    println(a2.joinToString())
    
    // 而MutableList则没有使用“out”关键字，因此它可以修改，但不可以协变
    var m1 = mutableListOf<Long>(5,6,7,8)
    m1[0] = 666
    m1.add(777)
    // 下面的代码会编译报错
    var m2: MutableList<Number> = m1
    
    // 总结一句话：类的泛型被标为协变后，意味着它可读不可写
}
```

<br>　　范例5：逆变。

``` kotlin
package com.kotlintest

// 如果你想让“Point<Number>”顺利赋值给“Point<Long>”，
// 可以在泛型T的前面添加一个关键字“in”
class Point<in T>(private var x: T, private val y: T) {
    fun sayHello(n: T) {
        this.x = n
        println("$x，$y")
    }
}

fun main() {
    // 这种通过“in”关键字来实现“p2=p1”的操作，称之为逆变
    var p1: Point<Number> = Point(1.3, 2.3)
    var p2: Point<Long> = p1

    // 很显然，若x和y没用private修饰，当外界执行如下代码时，就会出现类异常
    // var l : Long = p2.x

    // Kotlin默认不支持逆变为了防止读取数据时，发生ClassCastException异常。
    // 通过“in”关键字实现逆变之后，类要付出的代价自然就是，禁止泛型T被外界读取。
    // 1、主构造器或者类内的属性，若是泛型T类型，则：
    //    a、若属性是private修饰的，则编译没有任何问题，因为外界无法读取。
    //    b、否则编译报错。
    // 2、类内的函数能接收泛型T类型的参数，但不可以返回泛型T类型的参数。

    // 事实上，Comparable接口就是使用了“in关键字”
    // public interface Comparable<in T> {
    //     public operator fun compareTo(other: T): Int
    // }

    // 总结一句话：类被标为逆变后，意味着它可写不可读
}
```

<br>　　范例6：我自己负责安全问题，请放行。

``` kotlin
package com.kotlintest

// 我们知道协变是只读不写，但实际开发中往往有需求希望在协变状态下，函数也能支持泛型参数
// 此时我们就可以在泛型之前添加一个注解，来让编译器放行
// 也就是说，我们明确告知编译器，由我们自己来负责安全问题
class Point<out T>(var x: @UnsafeVariance T, var y: @UnsafeVariance T) {
    fun setValue(x1: @UnsafeVariance T, y1: @UnsafeVariance T) {
        // 这样我们就可以同时实现协变与写操作了
        // 但是不建议这么做，你看看本范例的输出就明白了，数据就会不一致
        x = x1
        y = y1
    }
}

fun main() {
    var p1: Point<Long> = Point(1, 2)
    var p2: Point<Number> = p1
    // 输出：1，2
    println("${p2.x}，${p2.y}")

    p2.setValue(6.6, 7.7)

    // 输出：6，7
    println("${p1.x}，${p1.y}")
    // 输出：6.6，7.7
    println("${p2.x}，${p2.y}")
}
// 相应的，逆变也支持这个注解
```

<br>　　范例7：使用处型变。

``` kotlin
package com.kotlintest

// 泛型的协变和逆变，是可以直接写在使用处的
// from只读不写，to只写不读
// 本函数可以复制任意泛型的列表
fun <T> copy(from: MutableList<out T>, to: MutableList<in T>) {
    for (i in from.indices) {
        to[i] = from[i]
    }
}

fun main() {
    var s1 = mutableListOf<String>("a", "b", "c", "d")
    var s2 = mutableListOf<String>("A", "B", "C", "D")
    copy(s1, s2)
    // 输出：a, b, c, d
    println(s2.joinToString())

    var i1 = mutableListOf<Int>(1, 2, 3, 4)
    var i2 = mutableListOf<Int>(5, 6, 7, 8)
    copy(i1, i2)
    // 输出：1, 2, 3, 4
    println(i2.joinToString())
}
```

### 反射 ###

<br>　　范例1：反射的简介。

``` kotlin
// 在Kotlin支持两套反射API：
// 1、Java的反射API，可以直接用，但不支持Kotlin的各类特性
// 2、Kotlin自有的API，支持Kotlin各种特性，但需要额外移入一个库“kotlin-reflect”。
// 之所以要拆出来一个库，是为了减少不使用反射功能的应用程序所需的运行时库大小。
// 另外Kotlin自有的反射库首次反射的时候速度会比Java反射库要慢，后面就会好了。

// 我们可以通过下面代码添加依赖：
// 这个依赖也可以不加，但只能进行很少的、基础反射操作。
// 测试发现，引入下面这个版本的反射库后，再打正式包时，会增加包体积几百K。
// 另外，引入的反射库版本号要和你的Kotlin版本一致，我的Kotlin版本是1.5.30，所以才引入这个。
implementation "org.jetbrains.kotlin:kotlin-reflect:1.5.30"
```

<br>　　范例2：反射类。

``` kotlin
package com.kotlintest

data class Person(var id: String) {
    var name: String = ""
    var age: Int = 18
}

fun main() {
    // 获取类的的字节码，字节码统一使用“KClass”类表示，和Java使用“Class”类一样
    var pClass: KClass<Person> = Person::class
    // 输出：Person
    println(pClass.simpleName)
    // 输出：com.kotlintest.Person
    println(pClass.qualifiedName)
    // 以下字段，若没有引入反射库，则运行时会抛异常
    // 若类被“data”修饰，则 isData = true
    // 若类被“open”修饰，则 isOpen = true
    // 若类被“inner”修饰，则 isInner = true
    // 若类“不可以被继承”修饰，则 isFinal = true
    // 若类是“抽象类”或者“接口”，则 isAbstract = true
    // 输出：是抽象类：false
    println("是抽象类：${pClass.isAbstract}")

    // 通过类的对象也可以获取到字节码
    var pClass2 = Person("10001")::class
    // 输出：true
    println("${pClass === pClass2}")
}
```

<br>　　范例3：Kotlin和Java字节码。

``` kotlin
package com.kotlintest

fun main() {
    // 获取Kotlin的String的字节码
    var clazz = String::class
    println(clazz)
    // 通过Kotlin的字节码，也可以获取Java的String的字节码
    println(clazz.java)
    // 可以继续获取
    println(clazz.java.kotlin)
}
```

<br>　　范例4：函数、属性、内部类、父类等。

``` kotlin
package com.kotlintest

import kotlin.reflect.full.*
open class Person(var id: String) {
    fun sayHello1() {
        println("Hello World!")
    }
    class InnerClassA {
    }
}

class Student(id: String) : Person(id), Runnable {
    private var name: String = ""
    var age: Int = 18
    fun sayHello2() {
        println("Hello World!")
    }
    inner class InnerClassB {
    }
    override fun run() {
    }
}

fun main() {
    var pClass = Student::class
    // 获取当前类内的“属性”和“函数”，不包含当前类内的“构造器”和“内部类”，
    // 也不包含父类的“属性”和“函数”
    for (item in pClass.declaredMembers) {
        println(item)
    }
    // 相应的还有如下字段，具体的介绍也看官方文档：
    // 获取函数列表（全部）：declaredFunctions
    // 获取函数列表(非扩展、非静态函数)：declaredMemberFunctions
    // 获取属性列表：declaredMemberProperties

    println()

    // 获取内部类，同样不会包含父类里面定义的
    for (item in pClass.nestedClasses) {
        println(item)
    }

    // 若当前类是通过“对象表达式”定义的匿名类，则可以使用这个属性获取该对象
    // pClass.objectInstance

    println()

    // 获取父类以及接口
    for (item in pClass.superclasses) {
        println(item)
    }
}

// KClass类内部还有很多属性，大家可以自行研究。
```

### 注解 ###

<br>　　注解实际上就是一种代码标签，它作用的对象是代码。对于我们来说，使用注解的方式有两种：

    1、使用Kotlin或者其他开发者定义好的注解
    2、自定义注解
       2.1、以Kotlin内置的各类注解作为基础，定义出自己的注解
       2.2、使用反射技术在特定的时机下，解析代码上的注解，并依据注解内的各个属性值来决定执行哪些操作。

　　很显然，日常开发中，我们很少会去自定义注解，且网上自定义注解的资料也一大堆，因此本文只会去介绍一些常用的注解的使用方法。

<br>　　范例1：@Transient注解。

``` kotlin
data class Student(
    var id: Int,
) {
    // 使用此注解，该属性将不会被序列化（比如Gson就不会解析它）
    @Transient
    var isGood = false
}
```

<br>　　范例2：@Synchronized注解。

``` kotlin
// 如果你想创建同步函数，可以使用这个注解
@Synchronized
fun test() {
    println("Hello World")
}
// 编译后的字节码如下所示：
// public final static synchronized test()V
```

<br>　　范例3：@JvmStatic注解。

``` kotlin
// 对于老项目来说，打算使用Kotlin后，一开始不可能将所有代码都改为Kotlin
// 必然会存在一部分Java代码，而在Java中调用Kotlin的类、函数是有一些特殊写法的
// 比如你有一个单例类：
object CommonUtils {
    @JvmStatic
    fun printHello() {
        println("Hello world!")
    }
}
// 如果不在printHello函数上面加上JvmStatic注解，那么在Java代码中就只能这么调用
// CommonUtils.INSTANCE.printHello();
// 加了之后，就可以这么写：
// CommonUtils.printHello();
```

### 协程 ###

　　协程可以让异步代码同步化，可以降低异步程序的设计复杂度，由于笔者事务繁忙，且日常开发暂时没有设置到这块，所以暂时搁浅。

# 第三节 Android中的Kotlin #

<br>　　范例1：Application的单例对象。

``` kotlin
class App : Application() {

    // 定义一个伴生对象，其内部持有一个App的引用
    companion object Instance {
        private var instance: App? = null
        fun getInstance() = instance
    }

    // 在onCreate对象中，可以访问到伴生对象的属性
    override fun onCreate() {
        super.onCreate()
        instance = this
    }
}
```

<br>　　范例2：let、run、also、apply函数。

``` kotlin
class MainActivity : BaseActivity() {
    private var mViewPager: ViewPager? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        mViewPager = findViewById(R.id.viewPager)
        // 由于mViewPager是可空类型，因此每次调用该对象的函数时都需要使用“?.”符号
        // 为了省事，我们可以通过let函数只调用一次“?.”
        mViewPager?.let {
            // 这里的it就是表示“mViewPager”。
            it.offscreenPageLimit = 4
            it.adapter = MainPagerAdapter(supportFragmentManager)
            it.currentItem = 0
        }
    }
}
// 相应的，还有一个run函数，它的特点是：
// 在大括号里面，使用“this”关键词（而不是it）来表示“ViewPager”,
// 不太推荐使用此函数，当层级嵌套比较多时，理解上容易混乱。

// 另外，还有一个also函数，它特点是：
// 使用“it”关键字，同时整个表达式会返回该对象，比如
var viewPager = mViewPager?.also{}

// 另外，还有一个also函数，它特点是：
// 使用“this”关键字，同时整个表达式会返回该对象。
```

<br>**本文参考阅读：**
- [Kotlin 官方文档 中文版](https://book.kotlincn.net/)
- [Kotlin注解(2)自定义注解](https://www.jianshu.com/p/1821eb89bdfd)
- [教你如何完全解析Kotlin中的注解](https://juejin.cn/post/6844903829868134407)

<br><br>