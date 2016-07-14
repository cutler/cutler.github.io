title: 架构篇　第三章 高效Android编程
date: 2015-8-17 14:43:42
categories: Android开发 - 青铜
---
　　本章将介绍`Android`相关的一些高效编程方法，参考了`《Effective Java中文版（第2版）》`。

# 第一节 Builder模式 #

## 问题描述 ##
　　假设我们有一个`Person`类，类中有`id`、`age`、`sex`、`name`四个必须的属性，并且还会有若干个可选的属性（比如`address`、`phone`等）。

　　对于这样的类，它的构造方法通常我们会这么写：
``` java
public class Person {
    private int id;
    private int age;
    private String sex;
    private String name;
	
    public Person(int id, int age, String sex, String name) {
        this.id = id;
        this.age = age;
        this.sex = sex;
        this.name = name;
    }
}
```
    语句解释：
    -  如果你需要重载多个构造方法，那么Person类的代码将会变得很乱。

<br>　　猛地一看没有任何问题，但是当`Person`类不断的增加字段后，客户端的代码就会变得很难编写以及阅读。如果客户端不小心颠倒了其中两个参数的顺序，编译器也不会报错，但程序在运行的时候会出现错误的行为。
<br>　　遇到有许多构造器参数的时候，还有第二种替代方法，即`JavaBean`模式，在这种模式下，调用一个无参的构造器来创建对象，然后调用`setter`方法来设置每个必要的参数：
``` java
public class Person {
    private int id;
    private int age;
    private String sex;
    private String name;

    public Person() { }

    public void setId(int id) {
        this.id = id;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```
<br>　　这种模式可以很容易的创建实例，同时代码读起来也很舒服：
``` java
Person p = new Person();
p.setId(1);
p.setAge(30);
p.setName("Tome");
p.setSex("M");
```

<br>　　遗憾的是，`JavaBean`模式自身有着很严重的缺点。因为构造过程被分到几个调用过程中，在构造过程中`JavaBean`可能处于不一致状态（比如需要额外的工作来保证它的线程安全）、存在未初始化的参数等问题。

<br>　　幸运的是，还有第三种替代方法，既能保证构造方法那样的安全性，也能保证`JavaBean`模式的可读性。这就是`Builder`模式。

## 模式介绍 ##
　　`Builder`模式不允许外界直接实例化类对象（通过私有化构造器的方式来实现），而是由一个名为`Builder`的内部来来完成实例化的任务。

<br>　　范例1：`Person`类。
``` java
public class Person {

    private int id;
    private int age;
    private String sex;
    private String name;

    // 私有化构造方法。
    private Person(Builder builder) { 
        id = builder.id;
        age = builder.age;
        sex = builder.sex;
        name = builder.name;
    }

    public static class Builder {
        private int id;
        private int age;
        private String sex;
        private String name;
		
        public Builder setId(int id){
            this.id = id;
            return this;
        }
		
        public Builder setAge(int age){
            this.age = age;
            return this;
        }
		
        public Builder setSex(String sex){
            this.sex = sex;
            return this;
        }
		
        public Builder setName(String name){
            this.name = name;
            return this;
        }
		
        // 执行实例化操作。
        public Person build(){
            return new Person(this);
        }
    }
}
```
    语句解释：
    -  Builder类内的各个方法返回本身，以便可以连续调用。

<br>　　下面就是客户端代码：
``` java
Person p = new Person.Builder()
    .setId(1)
    .setAge(30)
    .setName("Tom")
    .setSex("M")
    .build(); // 执行构造
```
    语句解释：
    -  这样的代码容易编写，也易于阅读。

<br>　　**Builder模式好处和优点**

	-  使用Builder模式必然会导致写两遍相关属性的代码和SETTER方法，看起来有点吃力不讨好。然而需要看到的是，客户端代码的便用性和可读性得到了大大提高。与此同时，构造函数的参数数量明显减少调用起来非常直观。
	-  你可以在build方法里设计你想要的约束，一旦客户端没有满足，则可以抛出异常。

<br>　　**Builder模式的代价和缺点**

	-  为了实例化对象，我们需要为类添加一个Builder类，让代码变得稍显冗长。
	-  当类新添加属性时，容易忘记给Builder类也添加上该属性，因此通常推荐把Builder类作为静态内部类来写。

<br>　　简而言之，如果类的构造器中有多个参数，设计这种类时，`Builder`模式就是种不错的选择，特别的是当大多数参数都是可选的时候。
　　提示：`Android`中的`AlertDialog`、`NotificationCompat`等类都是使用了`Builder`模式。

<br>**本节参考阅读：**
- [Java方法参数太多怎么办—Part3—Builder模式](http://www.importnew.com/6605.html)



<br><br>
