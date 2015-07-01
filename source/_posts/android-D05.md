title: 实战篇　第五章 设计模式
date: 2015-6-29 17:15:30
categories: Android
---
　　设计模式，有非常多的定义，有人会举出`Gang of Four`那本`《Design Patterns》`来解释，而笔者认为：

	-  设计模式是软件开发领域中，是针对特定上下文的特定问题的解决方案。
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

	-  如果你的类不提维持任何状态，仅仅是提供全局的访问，这个时候就适合用静态类。
	   -  最基本的例子就是在Java中的java.lang.Math类的实现方式，Math类就是用过静态方法来实现的，而不是单例来实现的。
	-  如果你的类需要维持一些状态，或者需要从线程安全、兼容性上来考虑一些问题，那么选用单例为宜。

## 单例的各种写法 ##
　　上一个的范例的写法有个缺点，当`SingleClass`类被加载的时候就会立刻实例化单例对象。
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


<br>**本节参考阅读：**
- [程序设计之---单例模式VS静态方法](http://blog.csdn.net/johnny901114/article/details/11969015)



<br><br>
