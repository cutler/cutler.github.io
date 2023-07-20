---
title: 第七章 TypeScript
date: 2023-3-11 22:07:15
author: Cutler
categories: 编程语言
---

# 第一节 起源概述 #

<br>　　TypeScript是微软开发的一个开源的编程语言：

>1、由于JavaScript本身局限性，难以胜任大型项目的开发和维护，因此微软推出了TypeScript。
>2、TS是JS的超集，它本质上向JS语言添加了可选的静态类型和基于类的面向对象编程。
>3、任何现有的JavaScript程序可以运行在TypeScript环境中。
>4、TS通过TypeScript编译器或Babel转译为JavaScript代码，可运行在任何浏览器、操作系统。

<br>　　时间线：

    2012年10月，微软发布了首个公开版本的TypeScript。
    2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript。
    2023年1月26日，TypeScript 5.0的测试版发布！

<br>　　为什么要学它？

    因为开发抖音、微信小游戏需要用到CocosCreator
    而CocosCreator开发时，脚本语言就是TypeScript。

<br>　　开发IDE是什么？

    微软官方推荐的编辑器是Visual Studio，但是若你只是为了学习和测试，可以直接使用在线网站：
    https://www.typescriptlang.org/play


<br>**本节参考阅读：**
- [百度百科 - typescript](https://baike.baidu.com/item/typescript?fromModule=lemma_search-box)

# 第二节 TypeScript入门 #

## 基础语法 ##

<br>　　范例1：Hello World。
``` typescript
// TS的注释与Java语言一样，使用“//”表示单行注释，使用“/**/”表示多行注释
// 使用“let”关键字定义一个变量str，语句末尾可以不用写“;”
let str1 = "Hello World"
/*
    往控制台输出log
 */
console.log(str1)

// 定义一个常量
const str2 = "你好"
// 常量一旦赋值后，不可以修改，因此下面的代码会报错
// str2 = "你好2"
```

<br>　　范例2：未定义。
``` typescript
let str1 
// 输出：undefined
console.log(str1)
let str2 = null
// 输出：null
console.log(str2)
```

<br>　　范例1：定义变量。
``` typescript
// 数字类型
let n1:number = 1
let n2:number = -1.4
// 与Java一样，使用“+”号进行字符串连接，最终输出：n1 = 1, n2 = -1.4
console.log("n1 = "+n1+", n2 = "+n2)

// 字符串类型
let userName:string = "张三"
// 布尔类型
let isBoy:boolean = true
// 使用“`”符号也可以引用字符串，在此种情况下，可以使用“${表达式}”的方式来进行字符串连接
// 输出：你好，我的名字叫张三，我是男孩：true
console.log(`你好，我的名字叫${userName}，我是男孩：${isBoy}`)

// 数组类型
let names : string[] = ["1","2","3"]
// 输出：数组第一个元素：1
console.log(`数组第一个元素：${names[0]}`)
```

<br>　　范例2：任意类型与联合类型。
``` typescript
// 任意类型
let n1 : any = 1
console.log(n1)
n1 = "张三"
console.log(n1)

// 变量n2的类型是一个联合类型
let n2 : number | boolean = 2
console.log(n2)
// 下面的代码会编译报错
// n2 = "李四"
console.log(n2)
```

<br>　　范例3：自动类型推算和类型省写。
``` typescript
// 定义的时候省写了类型，但编译器会自动推断出str1的类型为string
let str1 = "张三"
console.log(str1)
// 下面代码编译报错，因为类型不匹配
// str1 = 3

// 单纯的定义变量，不为其赋值，那么这个变量就是any类型的，后续可以给它赋任何值
let str2 
str2 = 1
console.log(str2)
str2 = "李四"
console.log(str2)
```

<br>　　范例4：枚举类型。
``` typescript
// 定义一个枚举类型，语法与Java高度类似
enum Color{
    // 定义三个枚举常量，逗号间隔
    // 枚举常量都有一个序号，默认从0开始，依次加一，因而后面输出RED时，会输出0。
    // 如果给某个常量明确指定序号，那么其后的枚举常量也会跟着变
    RED, BLUE = 19, GREEN
}

// 定义一个枚举变量
let c1 : Color = Color.RED
let c2 : Color = Color.BLUE
let c3 : Color = Color.GREEN
// 输出：0
console.log(c1)
// 输出：19
console.log(c2)
// 输出：20
console.log(c3)
```

<br>　　范例5：类型别名。
``` typescript
enum Color{
    RED, BLUE = 19, GREEN
}

// 定义一个枚举变量
let c1 : Color = Color.RED
// 使用“typeof”关键词可以获取变量的真实类型
// 输出：number
console.log(typeof c1)

// 使用“type”关键字，给“Color”类型定义一个别名，后续就可以使用别名来创建对象了
type NewColor = Color
let c2 : NewColor  = Color.BLUE
console.log(c2)
```

<br>　　范例6：运算符。
``` typescript
/*
    与其它高级语言一样，也支持各类操作符：
    + - * / %
    ++ --
    > < >= <= == !=
    && || !
    += -= *= /= %=
    ?:
*/
let n1 = 2
let n2 = "2"
// 输出：true。因为“==”只会比较值，不会比较类型
console.log(n1 == n2)
// 输出：false。“===”既会比较值，也会比较类型
console.log(n1 === n2)

```

<br>　　范例7：条件控制语句。
``` typescript
// 和Java一样
let age = 5
if(age > 10) {
    console.log("大于10")
} else if(age > 5) {
    console.log("大于5")
} else {
    console.log("小于等于5")
}

// 相应的也有switch语句，和Java中的一致，也有“case”、“default”和“break”的概念
```

<br>　　范例8：循环控制语句。
``` typescript
// 和Java一样
for(let i = 0; i < 10; i++){
    console.log(i)
}

// 相应的也有while语句，也和Java中的一致
// for循环也支持foreach写法，关键词是“of”，for(let i of arrays)
// 循环体内同样可以使用break和continue
```

<br>　　范例9：函数。
``` typescript
function sayHello(name :string) {
    console.log(`你好啊，${name}`)
}
// 输出：你好啊，张三
sayHello("张三")

function sum(a : number, b : number) : number {
    return a + b
}
console.log(sum(5, 10))

// 函数的另一种写法，sum2的调用方法和sum一样
let sum2 = function(a : number, b : number): number {
    return a + b
}
// 函数的第三种写法，sum3的调用方法和sum一样
let sum3 = (a : number, b : number): number => {
    return a + b
}
// 使用function关键词来定义一个函数，函数可以独立存在（不在任何类中）
// 函数的返回值需要写在参数列表后面
// 无返回值函数可以写“void”，也可以不写
```

## 面向对象 ##

<br>　　范例1：类和对象。
``` typescript
class Student{
    // 属性不需要使用“let”修饰，但需要提供默认值
    name : string = "";
    age : number = 0;
    // 使用constructor关键字来创建构造方法
    constructor(name : string, age : number) {
        this.name = name
        this.age = age
    }
    // 下面这个是实例方法，不用使用“function”修饰
    say(){
        // 使用this来引用成员属性
        console.log(`你好，我叫${this.name}，今年${this.age}岁了`)
    }
    // 使用static来修饰静态属性和静态方法
    static desc : string = "我是静态属性"
    static printDesc(){
        console.log(`你好，${Student.desc}`)
    }
}
// 使用new关键字创建对象
let stu = new Student("张三", 18)
// 输出：你好，我叫张三，今年18岁了
stu.say()
// 输出：你好，我是静态属性
Student.printDesc()
```

<br>　　范例2：继承和重写。
``` typescript
class Person{
    name : string = "";
    age : number = 0;
    constructor(name : string, age : number) {
        this.name = name
        this.age = age
    }
    say(){
        console.log(`你好，我是Person类的say方法`)
    }
}
// 使用extends关键字进行继承
class Student extends Person{
    constructor(name : string, age : number) {
        // 调用父类构造方法
        super(name, age)
    }
    // 方法重写
    say(){
        console.log(`你好，我是Student类的say方法`)
    }
}
// 使用new关键字创建对象
let stu = new Student("张三", 18)
// 输出：你好，我是Student类的say方法
stu.say()
```

<br>　　范例3：抽象类。
``` typescript
// 定义抽象类
abstract class Person{
    name : string = "";
    age : number = 0;
    constructor(name : string, age : number) {
        this.name = name
        this.age = age
    }
    // 定义抽象方法
    abstract say() : void 
}

class Student extends Person{
    constructor(name : string, age : number) {
        super(name, age)
    }
    say(){
        console.log(`你好，我是Student类的say方法`)
    }
}
let stu = new Student("张三", 18)
// 输出：你好，我是Student类的say方法
stu.say()
```

<br>　　范例4：接口。
``` typescript
interface Fly {
    doFly() : void
}
interface Jump {
    doJump() : void
}

class Bird implements Fly, Jump {

    doJump() {
        console.log(`我要起跳了`)
    }

    doFly(){
        console.log(`我要起飞了`)
    }
}

let bird = new Bird()
bird.doFly()
bird.doJump()
```

<br>　　范例5：命名空间。
``` typescript
// 使用namespace关键字来定义命名空间，这Java中的package概念类似
// 我们可以将类写到命名空间里
namespace aa{
    // 若想让你的类在命名空间外面被访问，则需要使用“export”关键字
    export class Person {
        sayHello(){
            console.log("aa.Person")
        }
    }
}

namespace bb{
    class Person {
         sayHello(){
            console.log("bb.Person")
        }
    }
}
// 使用“命名空间.类名”的方式来引用类
let p = new aa.Person()
p.sayHello()
```

<br>　　范例6：元组。
``` typescript
// 定义一个元组，其内包含两个值
let person:[string,number] = ["张三", 18]
// 通过下标的方式访问元组里的值
console.log(person[0])
// 也可以修改
person[1] = 22
console.log(person[1])
```

<br>　　范例7：数组。
``` typescript
// 定义一个数组
let person:string[] = ["张三", "李四", "王五"]
// length属性表示数组的长度
for(let i=0; i<person.length; i++){
    console.log(person[i])
}
// 往数组的末尾添加一个元素
person.push("赵六")
// 删除最前面的元素
person.shift()
for(let i=0; i<person.length; i++){
    console.log(person[i])
}
// 查找元素
let index = person.indexOf("李四")
console.log(index)

// 也可以使用Array<string>来定义一个变长数组，和Java中的ArrayList类似。
```

<br>　　范例8：字典。
``` typescript
// 字典相当于Java中的map
let person:{[key:string]:string} = {
    "person1" : "张三",
    "person2" : "李四",
    "person3" : "王五",
}
console.log(person["person1"])
// 输出：undefined
console.log(person["person4"])
person["person4"] = "赵六"
// 输出：赵六
console.log(person["person4"])
```

<br>　　范例9：回调函数。
``` typescript
// 定义一个按钮类
class Button {
    // 定义一个name属性
    name : string = "我是一个按钮"
    // 定义一个回调属性，属性的类型是联合类型，Function表示函数类型
    // 定义为联合类型后，就可以不给callback立刻赋值了
    callback : Function|undefined 
    // 当按钮被点击时，调用此方法
    click(){
        // 若外界设置了回调，则调用回调
        if(this.callback != undefined) {
           this.callback(this)
        } else {
            console.log("未设置监听器")
        }
    }
    // 设置回调函数
    setOnClickListener(callback:Function){
        this.callback = callback
    }
}

let btn = new Button()
btn.setOnClickListener(function(button:Button){
    console.log("按钮被点击 " + button.name)
})
btn.click()
```

<br>　　范例10：访问修饰符。
``` typescript
// 对于类中的属性、方法，支持三种修饰符private、protected、public。
// 它们的作用和Java一样。
// 测试发现，这些访问修饰符不可以修饰class
```

<br>　　范例11：单例模式。
``` typescript
class LoginUserManager {
    private static INSTANCE : LoginUserManager
    private constructor() {

    }
    public static getInstance() : LoginUserManager {
        // 若单例对象未创建，则执行创建
        // 若INSTANCE没有值，则表达式为false
        if(!LoginUserManager.INSTANCE) {
            LoginUserManager.INSTANCE = new LoginUserManager()
        }
        return LoginUserManager.INSTANCE
    }
}
console.log("单例对象 " + LoginUserManager.getInstance())
```

<br><br>