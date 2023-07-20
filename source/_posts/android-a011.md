---
title: 第十一章 老旧的技术
date: 2015-4-15 21:44:35
author: Cutler
categories: Android开发
---

# 第一节 Maven #

　　本节的目的是帮助你理解`Maven`的工作机制，因此教程主要关注`Maven`的核心概念，一旦你理解了这些核心概念，当你想了解更多的细节时，再去查看`Maven`文档，或者从网上搜索，就变得容易多了。
　　同时，在本节的末尾会有一个范例，使用`Maven`进行`Android`应用程序多渠道打包，以此来练习所学的知识。

　　本教程基于`Maven 3.2.3`，你可以从[Maven官网](http://maven.apache.org)上下载最新版的Maven，并关注项目的进展。另外，推荐您看一下`许晓斌`作者的[《Maven实战》](http://wenku.baidu.com/view/80e4c3136edb6f1aff001fdd.html)一书，其中前三章是十分适合新手入门Maven，本章也摘取了其中部分内容。

## 起源 ##
　　Maven是一个强大的`Java`项目构建工具，作为`Apache`组织中的一个颇为成功的开源项目，Maven主要服务于基于Java平台的项目构建、依赖管理和项目信息管理。无论是小型的开源类库项目，还是大型的企业级应用；无论是传统的瀑布式开发，还是流行的敏捷模式，Maven都能大显身手。当然你也可以使用其它工具来构建项目（比如`Ant`），但由于Maven是用Java开发的，因此Maven被更多的用于Java项目中。

### 什么是构建、构建工具 ###
　　我们每天对项目进行`编译`、`运行单元测试`、`生成文档`、`打包`和`部署`等烦琐且不起眼的工作，都可以说是在对项目进行`构建`。
　　构建工具是将软件项目构建相关的过程自动化的工具。简而言之构建工具就是使项目的创建、开发、测试、打包、生成文档、部署等一整套流程可以自动化执行的工具。构建一个软件项目通常包含以下一个或多个过程：

    -  生成源码（如果项目使用自动生成源码）；
    -  从源码生成项目文档；
    -  编译源码；
    -  将编译后的代码打包成JAR文件或者ZIP文件；
    -  将打包好的代码安装到服务器、仓库或者其它的地方；
　　有些项目可能需要更多的过程才能完成构建，这些过程一般也可以整合到构建工具中，因此它们也可以实现自动化。

### 为什么要使用构建工具 ###
　　项目一大管理起来就不太容易了，在项目发布之前必须配置好所有的逻辑关系，比如：

    -  Java源代码应该放在何处？
    -  单元测试的代码应该放在何处？
    -  依赖的100个jar包应该如何放置？ 更新某个jar包的版本如何递归更新其他jar包？
    -  如何编译项目，如何形成文档？
    -  如何分渠道打出200包？ 每个包之间仅仅是某些配置信息不同而已。 那1000个包呢，手工的打的话如何能保证不出错？
    -  成百上千个项目部署的任务靠人力得多久能完成？
　　这些`枯燥`、`易错`、`周而复始`的工作让无数程序员崩溃了一次又一次，我们不需要也不应该一遍又一遍地输入命令，一次又一次地点击鼠标，我们要做的是使用Maven配置好项目，然后输入简单的命令(如`mvn clean install`)，Maven会帮我们处理那些烦琐的任务。
　　自动化构建过程的好处是将手动构建过程中犯错的风险降到最低。而且，自动构建工具通常要比手动执行同样的构建过程要快。

### 为什么要用Maven ###
　　Maven不是Java领域唯一的构建管理的解决方案。本节将通过一些简单的例子解释Maven的必要性，并介绍其他构建解决方案，如`IDE`、`Make`和`Ant`，并将它们与Maven进行比较。

<br>**IDE不是万能的**
　　当然，我们无法否认优秀的`IDE`能大大提高开发效率。当前主流的`IDE`如`Eclipse`和`NetBeans`等都提供了强大的文本编辑、调试甚至重构功能。虽然使用简单的文本编辑器和命令行也能完成绝大部分开发工作，但很少有人愿意那样做。然而，`IDE`是有其天生缺陷的：

    -  IDE依赖大量的手工操作。编译、测试、代码生成等工作都是相互独立的，很难一键完成所有工作。手工劳动往往意味着低效，意味着容易出错。
    -  很难在项目中统一所有的IDE配置，每个人都有自己的喜好。也正是由于这个原因，一个在机器A上可以成功运行的任务，到了机器B的IDE中可能就会失败。
　　我们应该合理利用IDE，而不是过多地依赖它。对于构建这样的任务，在IDE中一次次地点击鼠标是愚蠢的行为。Maven是这方面的专家，而且主流IDE都集成了Maven插件，我们可以在IDE中方便地运行Maven执行构建。

<br>**Make**
　　Make也许是最早的构建工具，它由Stuart Feldman于1977年在Bell实验室创建。Stuart Feldman也因此于2003年获得了ACM国际计算机组织颁发的软件系统奖。目前Make有很多衍生实现，包括最流行的`GNU Make`和`BSD Make`，还有Windows平台的`Microsoft nmake`等。

　　Make由一个名为`Makefile`的脚本文件驱动，该文件使用Make自己定义的语法格式。其基本组成部分为一系列规则（`Rules`），而每一条规则又包括目标（`Target`）、依赖（`Prerequisite`）和命令（`Command`）。
　　Make通过一系列目标和依赖将整个构建过程串联起来，同时利用本地命令完成每个目标的实际行为。
　　Make的强大之处在于它可以利用所有系统的本地命令，尤其是`UNIX/Linux`系统，丰富的功能、强大的命令能够帮助Make快速高效地完成任务。

　　但是，Make将自己和操作系统绑定在一起了。也就是说，使用Make，就不能实现（至少很难）跨平台的构建，这对于Java来说是非常不友好的。此外，`Makefile`的语法也成问题，很多人抱怨Make构建失败的原因往往是一个难以发现的`空格`或`Tab`使用错误。

<br>**Ant**
　　Ant不是指蚂蚁，而是意指“另一个整洁的工具”（`Another Neat Tool`），它最早用来构建著名的`Tomcat`，其作者James Duncan Davidson创作它的动机就是因为受不了`Makefile`的语法格式。
　　我们可以将Ant看成是一个Java版本的Make，也正因为使用了Java，Ant是跨平台的。
　　此外，Ant使用XML定义构建脚本，相对于Makefile来说，这也更加友好。与Make类似，Ant有一个构建脚本`build.xml`，如下所示：
``` xml
<project name="Hello" default="compile"> 
    <target name="compile" description="compile the Java source code to class files"> 
        <mkdir dir="classes"/>  
        <javac srcdir="." destdir="classes"/> 
    </target>  
    <target name="jar" depends="compile" description="create a Jar file "> 
        <jar destfile="hello.jar"> 
            <fileset dir="classes" includes="**/*.class"/>  
            <manifest> 
                <attribute name="Main.Class" value="HelloProgram"/> 
            </manifest> 
        </jar> 
    </target> 
</project>
```
　　`build.xml`的基本结构也是目标（`target`）、依赖（`depends`），以及实现目标的任务。
　　比如在上面的脚本中`jar`目标用来创建应用程序jar文件，该目标依赖于`compile`目标，后者执行的任务是创建一个名为`classes`的文件夹，编译当前目录的`java`文件至`classes`目录。compile目标完成后，jar目标再执行自己的任务。

　　Ant有大量内置的用Java实现的任务，这保证了其跨平台的特质，同时，Ant也有特殊的任务`exec`来执行本地命令。

　　和Make一样，Ant也都是过程式的，开发者显式地指定每一个目标，以及完成该目标所需要执行的任务。针对每一个项目，开发者都需要重新编写这一过程，这里其实隐含着很大的重复。Maven是声明式的，项目构建过程和过程各个阶段所需的工作都由插件实现，并且大部分插件都是现成的，开发者只需要声明项目的基本元素，Maven就执行内置的、完整的构建过程。这在很大程度上消除了重复。

　　Ant是没有依赖管理的，所以很长一段时间Ant用户都不得不手工管理依赖（手工管理对第三方`jar`、`so`等库的依赖），这是一个令人头疼的问题。幸运的是，Ant用户现在可以借助`Ivy`管理依赖。而对于Maven用户来说，依赖管理是理所当然的，Maven不仅内置了依赖管理，更有一个可能拥有全世界最多Java开源软件包的中央仓库，Maven用户无须进行任何配置就可以直接享用。

<br>**Maven**
　　由于Maven是用Java写的，所以它是跨平台的，这意味着无论是在`Windows`上，还是在`Linux`或者`Mac`上，都可以使用同样的命令。
　　Maven还能帮助我们管理原本分散在项目中各个角落的项目信息，包括项目描述、开发者列表、版本控制系统地址、许可证、缺陷管理系统地址等。这些微小的变化看起来很琐碎，并不起眼，但却在不知不觉中为我们节省了大量寻找信息的时间。
　　除了直接的项目信息，还可以通过Maven自动生成的站点，以及一些已有的插件，我们还能够轻松获得项目文档、测试报告、静态分析报告、源码版本日志报告等非常具有价值的项目信息。

　　事实上，Maven开发者认为Maven不仅仅是一个构建工具。你可以去阅读他们的文档 [Maven哲学](http://maven.apache.org/background/philosophy-of-maven.html)，看看他们是怎么想的。但是现在，我们就把Maven当作一个构建工具，当你理解和开始使用Maven后，你就明白Maven到底是什么了。

## 环境搭建 ##

### Win7下安装配置 ###

<br>**安装JDK**
　　正如前面说的，Maven是用Java实现的，因此在安装Maven之前应该确保正确安装了[JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)。

<br>**安装Maven**
　　安装Maven，访问 [Maven下载页](http://maven.apache.org/download.cgi)，然后按照安装指南的步骤即可。

<br>**环境变量**

    1、下载并解压Maven；
    2、创建一个环境变量M2_HOME，路径设置为Maven解压后的目录；
    3、创建一个环境变量M2，路径为M2_HOME/bin（在Windows上是%M2_HOME%/bin，在Unix上是$M2_HOME/bin）；
    4、将M2添加到PATH环境变量中（Windows上是%M2%，Unix上是$M2）；
    5、创建一个环境变量JAVA_HOME，路径为JDK的安装目录；
    6、将JAVA_HOME/bin加入到path变量中（在Windows上是%JAVA_HOME%/bin，在Unix上是$JAVA_HOME/bin）。

　　最后在终端中输入`mvn -v`命令后，如果终端上显示出Maven的版本信息则证明Maven已经安装好了。

### 升级Maven ###
　　Maven还比较年轻，更新比较频繁，因此用户往往会需要更新Maven安装以获得更多更酷的新特性，以及避免一些旧的bug。

<br>**在Windows上更新**
　　在Windows上更新Maven非常简便，只需要下载新的Maven安装文件，解压至本地目录，然后更新`M2_HOME`环境变量便可。
　　例如，假设Maven推出了新版本`3.4`，我们将其下载然后解压至目录`D:\bin\apache-maven-3.4`，接着遵照前一节描述的步骤编辑环境变量`M2_HOME`，更改其值为`D:\bin\apache-maven-3.4`。至此，更新就完成了。
　　同理，如果你需要使用某一个旧版本的Maven，也只需要编辑`M2_HOME`环境变量指向旧版本的安装目录。

### 安装目录分析 ###
　　本章前面的内容讲述了如何安装和升级Maven，现在我们来仔细分析一下Maven的安装文件。

#### M2_HOME ####
　　前面我们讲到设置`M2_HOME`环境变量指向Maven的安装目录，本章之后所有使用`M2_HOME`的地方都指代了该安装目录，让我们看一下该目录的结构和内容：
``` xml
-  bin 
   -  mvn
   -  mvn.bat
   -  mvnDebug和mvnDebug.bat
   -  m2.conf
-  boot 
   -  plexus-classworlds-2.5.1.jar
-  conf 
   -  settings.xml
   -  logging
-  lib  
-  LICENSE.txt 
-  NOTICE.txt 
-  README.txt
```
<br>　　bin：该目录包含了mvn运行的脚本，这些脚本用来配置Java命令，准备好classpath和相关的Java系统属性，然后执行Java命令。

    -  mvn：基于UNIX平台的shell脚本。
    -  mvn.bat：基于Windows平台的脚本。在命令行输入任何一条mvn命令时，实际上就是在调用mvn或mvn.bat脚本。
    -  mvnDebug和mvnDebug.bat：前者是UNIX平台的shell脚本，后者是windows的bat脚本。
    -  mvn和mvnDebug两者的内容基本是一样的，只是mvnDebug多了一条MAVEN_DEBUG_OPTS配置，作用就是在运行Maven时开启debug，以便调试Maven本身。
    -  m2.conf：classworlds的配置文件，稍微会介绍classworlds。

<br>　　boot：该目录只包含一个文件，以`Maven 3.2.3`为例，该文件为`plexus-classworlds-2.5.1.jar`：

    -  plexus-classworlds是一个类加载器框架，相对于默认的java类加载器，它提供了更丰富的语法以方便配置，Maven使用该框架加载自己的类库。
    -  对于一般的Maven用户来说，不必关心这个文件。 
　　更多关于classworlds的信息请点击 [这里](http://classworlds.codehaus.org) 。
　　
<br>　　conf：该目录包含了一个非常重要的文件`settings.xml`，直接修改该文件，就能在机器上全局地定制Maven的行为。

    -  一般情况下，我们更偏向于复制该文件至~/.m2/目录下（这里~表示用户目录），然后修改该文件，在用户范围定制Maven的行为。

<br>　　lib：该目录包含了所有Maven运行时需要的Java类库。
<br>　　Maven本身是分模块开发的，因此用户能看到诸如`mavn-core-3.0.jar`、`maven-model-3.0.jar`之类的文件，此外这里还包含一些Maven用到的第三方依赖如`common-cli-1.2.jar`、`google-collection-1.0.jar`等等。
　　可以说，这个lib目录就是真正的Maven。
　　
<br>　　其他： 

    -  LICENSE.txt记录了Maven使用的软件许可证Apache License Version 2.0； 
    -  NOTICE.txt记录了Maven包含的第三方软件；
    -  README.txt则包含了Maven的简要介绍，包括安装需求及如何安装的简要指令等等。

#### ~/.m2 ####
　　现在我们先运行一条简单的命令：`mvn help:system`
　　该命令会打印出所有的Java系统属性和环境变量，这些信息对我们日常的编程工作很有帮助。
　　这里暂不解释`help:system`涉及的语法，运行这条命令的目的是为了让Maven执行一个真正的任务。
　　我们可以从命令行输出看到Maven会下载`maven-help-plugin`，包括`pom`文件和`jar`文件。这些文件都被下载到了Maven本地仓库中。

　　默认情况下，当首次执行`mvn`命令时Maven会在当前用户的目录下创建一个`.m2`的隐藏文件夹，其内有一个`repository`目录就是默认的本地仓库，（注意`mvn -v`命令则不会导致`.m2`创建）。
　　现在打开用户目录，比如当前的用户目录是`C:\Users\Juven Xu\`，你可以在`Vista`和`Windows7`中找到类似的用户目录。如果是更早版本的Windows，该目录应该类似于`C:\Document and Settings\Juven Xu\`。
　　在基于Unix的系统上，直接输入`cd`回车，就可以转到用户目录。
　　为了方便，本文统一使用符号`~`指代用户目录。

　　在用户目录下，我们可以发现`.m2`文件夹。默认情况下，该文件夹下放置了Maven本地仓库`.m2/repository`
　　所有的Maven构件（`artifact`）都被存储到该仓库中，以方便重用。
　　我们可以到`~/.m2/repository/org/apache/maven/plugins/maven-help-plugin/`目录下找到刚才下载的maven-help-plugin的pom文件和jar文件。
　　默认情况下，`~/.m2`目录下除了`repository`仓库之外就没有其他目录和文件了，不过大多数Maven用户需要复制`M2_HOME/conf/settings.xml`文件到`~/.m2/settings.xml`。

　　Maven用户可以选择配置`$M2_HOME/conf/settings.xml`或者`~/.m2/settings.xml`。前者是全局范围的，整台机器上的所有用户都会直接受到该配置的影响，而后者是用户范围的，只有当前用户才会受到该配置的影响。 我们推荐使用用户范围的`settings.xml`，主要原因是为了避免无意识地影响到系统中的其他用户。当然，如果你有切实的需求，需要统一系统中所有用户的`settings.xml`配置，当然应该使用全局范围的`settings.xml`。 
　　除了影响范围这一因素，配置用户范围`settings.xml`文件还便于Maven升级。直接修改`conf`目录下的`settings.xml`会导致Maven升级不便，每次升级到新版本的Maven，都需要复制`settings.xml`文件，如果使用`~/.m2`目录下的`settings.xml`，就不会影响到Maven安装文件，升级时就不需要触动`settings.xml`文件。
### 安装m2eclipse ###
　　Eclipse是一款非常优秀的IDE，除了基本的语法标亮、代码补齐、XML编辑等基本功能外，最新版的Eclipse还能很好地支持重构，并且集成了`JUnit`、`CVS`、`Mylyn`等各种流行工具。
　　可惜Eclipse默认没有集成对Maven的支持。幸运的是，由Maven之父Jason Van Zyl创立的Sonatype公司建立了m2eclipse项目，这是Eclipse下的一款十分强大的Maven插件，可以访问 http://m2eclipse.sonatype.org/ 了解更多该项目的信息。

　　在Eclipse中安装Maven插件的步骤本文就不介绍了，很容易在网上搜索到。

<br>　　**不要使用插件内嵌的Maven**
　　无论是Eclipse还是NetBeans，当我们集成Maven插件时，插件都会安装上一个内嵌的Maven，这个内嵌的Maven通常会比较新，但不一定很稳定，而且往往也会和我们在命令行使用的Maven不是同一个版本。
　　这里有会出现两个潜在的问题：

    -  首先，较新版本的Maven存在很多不稳定因素，容易造成一些难以理解的问题；
    -  其次，除了IDE，我们也经常还会使用命令行的Maven，如果版本不一致，容易造成构建行为的不一致，这是我们所不希望看到的。
　　因此，我们应该在IDE中配置Maven插件时使用与命令行一致的Maven。

## Hello World ##
　　现在我们通过创建一个最简单的hello-world项目，来一步步了解Maven。在此之前先看一下Maven项目的标准目录结构。

<br>　　范例1：hello-world项目目录结构。
``` xml
hello-world
- src
  - main
    - java
      - com.juvenxu.helloworld
        - HelloWorld.java
- target
- pom.xml
```
    语句解释：
    -  默认情况下，Maven假设src目录是源代码的根目录，在src目录下又分为test、main等子目录
       -  test用来存放测试用例的代码（我们暂时不管它）。
       -  main用来存放真正的程序代码。
    -  由于实际开发中一个项目可能存在多种语言，因此在test、main目录下又可以按照语言分出多个子目录，“main/java”就对应着java源代码目录。main和test下的java目录，分别用来存放应用的java源代码和java测试代码，如果一些项目存在c代码，则就应该放到c目录下。
    -  target目录是由Maven创建的，其中包含编译后的类文件、jar文件等。当执行maven clean命令后，target目录（如果该目录存在的话）的内容就会被清空。
    -  pom.xml核心配置文件，后面会详细介绍它。

　　知道了Maven的标准目录结构之后，我们开始按照这个结构来创建项目。

　　首先，创建一个名为`hello-world`的文件夹。

### 编写POM ###
　　就像Make的`Makefile`，Ant的`build.xml`一样，Maven项目的核心是`POM`（Project Object Model，项目对象模型）文件，即`pom.xml`。
　　任何一个被Maven管理的项目的根目录下都会有一个`pom.xml`文件，其内定义了项目的基本信息，用于描述项目如何构建，声明项目依赖，等等。
　　一个项目如果分为多个子项目，一般来讲，父项目有一个POM文件，每一个子项目都有一个POM文件。在这种结构下，既可以一步构建整个项目，也可以各个子项目分开构建。
　　
　　那么，接下来我们进入到`hello-world`文件夹中，并创建一个`pom.xml`（该文件的编码应该为`UTF-8`）。

<br>　　范例1：pom.xml。
``` xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.juvenxu.mvnbook</groupId>
    <artifactId>hello-world</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>Maven Hello World Project</name>
</project>
```
    语句解释：
    -  代码的第一行是XML头，指定了该xml文档的版本和编码方式。
    -  <project>是pom文件的根节点，它声明了一些POM相关的命名空间及xsd元素，虽然这些属性不是必须的，但使用这些属性能够让第三方工具（如IDE中的XML编辑器）帮助我们快速编辑POM。
    -  本范例中根结点的<modelVersion>、<groupId>、<artifactId>、<version>四个子结点是必需要有的，没有则会报错。
    -  <modelVersion>：指定了使用的POM模型的版本。选择和你正在使用的Maven版本一致的版本即可。对于Maven2及Maven3来说，它只能是4.0.0。
    -  <groupId>：项目组的唯一ID，具体后述。
    -  <artifactId>：当前项目在项目组中唯一的ID，具体后述。
    -  <version>：当前项目的版本号。通常格式为:主版本.次版本.增量版本-限定版本号。
    -  <name>：声明了一个对于用户更为友好的项目名称，虽然这不是必须的，但还是推荐为每个POM声明name，以方便信息交流。Maven产生文档时会用到，可选。

　　除了上述标签外，`<project>`里面还可以有如下两个标签：
    -  <url>：项目主页的URL，Maven产生文档时会用到，可选。
    -  <description>：项目的详细描述，Maven产生文档时会用到，可选。

<br>　　没有任何实际的Java代码，我们就能够定义一个Maven项目的POM，这体现了Maven的一大优点，它能让项目对象模型最大程度地与实际代码相独立，我们可以称之为解耦，或者正交性，这在很大程度上避免了Java代码和POM代码的相互影响。比如当项目需要升级版本时，只需要修改POM，而不需要更改Java代码；而在POM稳定之后，日常的Java代码开发工作基本不涉及POM的修改。

　　也许你对`<modelVersion>`、`<groupId>`、`<artifactId>`、`<version>`四个标签的作用很不理解，现在我们就来介绍一下它们的作用。

### 坐标 ###
　　关于坐标（Coordinate），大家最熟悉的定义应该是来自于平面几何。在一个平面坐标系中，任何一个坐标（x，y）都能够唯一标识该平面中的一点。在实际生活中，我们也可以将地址看成一种坐标。省、市、区、街道等一系列信息同样可以唯一标识城市中的任一居住地址和工作地址。邮局和快递公司正式基于这样一种坐标进行日常工作的。

　　Maven的世界中拥有数量非常巨大的构件（在Maven世界中，任何一个依赖、插件、或者项目构建的输出，都可以称为构件，比如平时用的一些jar、war等文件），为了能精确的从海量构件中定位出一个构件，Maven定义了`Maven坐标`。

　　Maven坐标的包括`groupId`、`artifactId`、`version`、`packaging`、`classifier`五个部分。

<br>　　范例1：Maven坐标。
``` xml
<groupId>com.juvenxu.mvnbook</groupId>
<artifactId>hello-world</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>jar</packaging>
```

<br>**groupId**
　　定义当前Maven项目实际隶属的项目组。
　　一个公司或组织下面可能会同时有多个项目，比如腾讯公司就会有腾讯QQ、腾讯微博、腾讯新闻等项目。因此需要为每个项目组定义一个唯一的ID。
　　以腾讯QQ为例，它的`groupId`应该定义为：`com.tencent.qq`，而腾讯新闻的`groupId`则应该为：`com.tencent.news`。

<br>**artifactId**
　　当前Maven项目和它实际隶属的项目组不一定是一对一的关系。比如腾讯QQ的Android端除了主项目外，还可以引用一些`lib`项目，这样一来一个完整的腾讯QQ项目最终是由一个主项目（由腾讯QQ团队开发）和多个小项目（则可能是其他第三方组织开发的开源项目）共同组成的。
　　因而`artifactId`标签是为项目中的某一个子项目定义了唯一标识。

　　比如实际项目组的名称（groupId）为`com.tencent.qq`，且该项目分成3个子项目，则这三个子项目的`artifactId`的值可能为：

    -  qq-main
    -  qq-subproject1
    -  qq-subproject2
　　推荐的做法是使用实际项目名称作为`artifactId`的前缀，如上面的`qq`。

<br>**version**
　　该元素定义当前Maven项目所处的版本。比如：`1.0-SNAPSHOT`。`SNAPSHOT`意为快照，说明该项目还处于开发中，是不稳定的版本。随着项目的发展，version会不断更新，如升级为`1.0`、`1.1-SNAPSHOT`、`1.1`、`2.0`等等。

<br>**packaging**
　　该元素指出当前项目打包时生成的文件。常见的格式有：`jar`、`war`、`ear`、`pom`、`apk`等，插件可以创建他们自己的构件类型，所以前面列的不是全部构件类型。如果不设置则Maven会使用默认值`jar`。

<br>**classifier**
　　该元素用来帮助定义构建输出一些附属构件。附属构件与主构件对应，如主构件是`nexus-indexer-2.0.0.jar`，该项目可能还会通过使用一些插件生成如`nexus-indexer-2.0.0-javadoc.jar`、`nexus-indexer-2.0.0-sources.jar`这样一些附属构件。

　　上述5个元素中，`groupId`、`artifactId`、`version`是必须定义的，`packaging`是可选的，而`classifier`是不能直接定义的，因为附属构件不是项目直接默认生成的，而是由附加的插件帮助生成的。

　　知道了`pom.xml`文件中各个标签的含义之后，我们开始编写项目的主代码。

### 编写主代码 ###
　　首先创建`hello-world/src/main/java`目录，然后再在该目录下创建文件`com/juvenxu/mvnbook/helloworld/HelloWorld.java`文件，其内容如下：
``` java
package com.juvenxu.mvnbook.helloworld;
public class HelloWorld {
    public static String getMessage(){
        return "Hello Maven";
    }
    public static void main(String[] args){
        System.out.print(getMessage());
    }
}
```
　　关于该Java代码有两点需要注意：
　　首先，在`95%`以上的情况下，我们应该把项目主代码放到`src/main/java/`目录下（遵循Maven的约定），而无须额外的配置，Maven会自动搜寻该目录找到项目主代码。
　　其次，该Java类的包名是`com.juvenxu.mvnbook.helloworld`，这与我们之前在POM中定义的`groupId`和`artifactId`相吻合。一般来说，项目中Java类的包都应该基于项目的`groupId`和`artifactId`，这样更加清晰，更加符合逻辑，也方便搜索构件或者Java类。

　　代码编写完毕后，我们使用Maven进行编译，`在项目根目录下`运行命令`mvn clean compile`，我们会得到类似如下输出：
``` android
[INFO] ------------------------------------------------------------------------
[INFO] Building Maven Hello World Project
[INFO]    task-segment: [clean, compile]
[INFO] ------------------------------------------------------------------------
[INFO] [clean:clean {execution: default-clean}]
[INFO] Deleting directory D:\code\hello-world\target
[INFO] [resources:resources {execution: default-resources}]
[INFO] skip non existing resourceDirectory D: \code\hello-world\src\main\resources
[INFO] [compiler:compile {execution: default-compile}]
[INFO] Compiling 1 source file to D: \code\hello-world\target\classes
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESSFUL
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1 second
[INFO] Finished at: Fri Oct 09 02:08:09 CST 2009   
[INFO] Final Memory: 9M/16M
[INFO] ------------------------------------------------------------------------  
```
　　`mvn clean compile`命令中的`clean`是告诉Maven清理输出目录`target`。
　　而且从输出的日志第`5`行我们也可以看到Maven首先执行了`clean:clean`任务，删除`target/`目录，默认情况下Maven构建的所有输出都在`target/`目录中。由于我们之前并没有创建它，所以maven不会执行任何操作。
　　接着执行第`7`行`resources:resources`任务（由于我们也未定义项目资源，所以跳过了这个步骤）。
　　`mvn clean compile`命令中的`compile`告诉Maven编译项目代码。
　　最后执行第`9`行`compiler:compile`任务，将项目主代码编译至`target/classes`目录。
　　编译好的类为`target/classes/com/juvenxu/mvnbook/helloworld/HelloWorld.Class` 

　　至此，Maven在没有任何额外的配置的情况下就执行了项目的清理和编译任务，接下来为例更好的理解`mvn clean compile`命令的含义，我们简单介绍一下mvn提出的几个抽象概念。

### 构建生命周期、阶段和目标 ###
　　Maven的构建项目的命令有三种，我们可以通过执行`mvn 构建生命周期`、`mvn 构建阶段`、`mvn 构建目标`来进行项目的构建操作。
　　构建生命周期、构建阶段、构建目标三者之间是包含关系，一个构建生命周期中分为多个构建阶段，而一个构建阶段中又分为多个构建目标。
　　当我们执行某个`mvn 构建生命周期`命令，那么实际上是执行该生命周期下的所有构件阶段和构建目标；相应的当我们执行某个`mvn 构建阶段`命令时，实际上是执行该构建阶段下的所有构件目标。

　　现在就详细介绍一下Maven中提供了哪些构建生命周期、构建阶段、构建目标。

<br>**构建生命周期**
　　Maven有三个内嵌的构建生命周期：`default`、`clean`、`site`，每一个构建生命期关注项目构建的不同方面。因此，它们是独立地执行的。

    -  default生命期关注的是项目的编译和打包。
    -  clean生命期关注的是从输出目录中删掉临时文件，包括自动生成的源文件、编译后的类文件，之前版本的jar文件等。
    -  site生命期关注的是为项目生成文档。实际上，site可以使用文档为项目生成一个完整的网站。

　　当你构建项目时，你会传入一条命令。这条命令就是`mvn 构建生命周期/构建阶段/构建目标的名字`，你可以执行：

    -  一个构建生命期，如mvn clean或mvn site。
    -  一个构建阶段，如mvn install。
    -  一个构建目标，如mvn dependency:copy-dependencies。
　　注意：你不能直接执行default生命期，你只能直接执行default生命期中的一个构建阶段（如上面的`mvn install`阶段）或者构建目标。

<br>**构建阶段**
　　`default`生命期更多的关注于构建代码，由于你不能直接执行`default`生命期，所以你只能执行其中一个构建阶段或者构建目标。
　　当你执行一个构建阶段时，所有在该构建阶段之前的构建阶段（根据标准构建顺序）都会被执行。因此，执行`default`生命期的`install`阶段，意味着所有位于`install`阶段前的构建阶段都会被执行，然后才执行`install`阶段。
　　`default`生命期包含了相当多的构建阶段和目标，这里不会所有都介绍。最常用的构建阶段有：
``` c
构建阶段           描述
validate          验证项目的正确性，以及所有必需的信息都是否都存在。同时也会确认项目的依赖是否都下载完毕。
compile           编译项目的源代码
test              选择合适的单元测试框架，对编译后的源码执行测试；这些测试不需要代码被打包或者部署。
package           将编译后的代码以可分配的形式打包，如Jar包。
install           将项目打包后安装到本地仓库，可以作为其它项目的本地依赖。
deploy            将最终的包复制到远程仓库，与其它开发者和项目共享。
```
　　将构建阶段的名称作为参数传给`mvn`命令，就是执行该构建阶段，如：
``` c
mvn package
```
　　该示例执行`package`构建阶段，因此在Maven的构建阶段序列中所有位于该阶段之前的阶段也都会被执行。

　　另外，Maven可以在一条Maven命令里执行多个生命期，但是它们是串行执行的，相互独立，就像你执行了多条独立的Maven命令。比如上面的`mvn clean compile`。

　　如果标准的Maven构建阶段和目标无法满足项目的需要，可以创建Maven插件增加你需要的构建功能。

<br>**构建目标**
　　构建目标是Maven构建过程中最细化的步骤。一个构建目标可以与一个或多个构建阶段绑定，也可以不绑定。如果一个构建目标没有与任何构建阶段绑定，你只能将该目标的名称作为参数传递给`mvn`命令来执行它。如果一个目标绑定到多个构建阶段，该目标在绑定的构建阶段执行的同时被执行。

　　Maven的构建周期、构建阶段和目标的更多细节请参考 [Maven构建周期介绍](http://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html) 。

### 编写测试代码 ###
　　接下来，我们编写一些单元测试代码并让Maven执行自动化测试。为了使项目结构保持清晰，主代码与测试代码应该分别位于独立的目录中。之前讲过Maven项目中默认的主代码目录是`hello-world/src/main/java`，对应地，Maven项目中默认的测试代码目录是`hello-world/src/test/java`。
　　因此，在编写测试用例之前，我们应该先去创建`hello-world/src/test/java`目录。 

　　在`Java`世界中，由Kent Beck和Erich Gamma建立的`JUnit`是使用最广泛的单元测试标准，我们也将使用`JUnit`来测试项目。不过既然我们现在是介绍如何在Maven项目上进行测试，那自然也就不能像以前那样直接将`JUnit`的`jar`包放入项目的`lib`目录下面了。
　　要在Maven项目上使用`JUnit`，我们首先需要修改项目的`POM`文件来为Hello World项目添加一个`JUnit`的`依赖`，所谓添加依赖就是添加引用，即通过`pom.xml`来告诉Maven当前项目需要使用到其他第三方开发的`jar`等库。

<br>　　范例1：pom.xml。
``` xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.juvenxu.mvnbook</groupId>
    <artifactId>hello-world</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>Maven Hello World Project</name>

    <dependencies>    
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.7</version>
            <scope>test</scope>
        </dependency>
    </dependencies>     
</project>
```
    语句解释：
    -  上面代码在pom.xml中添加了<dependencies>标签，该元素用来列举出当前项目所需要引用的外部构件。每个外部构件都使用<dependency>标签来表示。
    -  前面我们提到groupId、artifactId和version是任何一个Maven项目最基本的坐标，JUnit也不例外，有了这段声明，在执行mvn命令时，Maven就能够自动去下载junit-4.7.jar了。
    -  <scope>标签用来设置当前依赖的作用范围。若依赖范围为test则表示该依赖只对测试有效，换句话说，在src/test/java文件夹下的代码中可以import JUnit里的类，但是如果我们在src/main/java目录下的文件中用import JUnit代码，就会造成编译错误。如果不声明依赖范围，那么默认值就是compile，表示该依赖对主代码和测试代码都有效。 
　　
　　也许你会问，Maven从哪里下载这个`jar`呢？ `<scope>`标签除了`test`和`compile`以外还有哪些取值呢？ 那我们现在就一起简单的了解一下Maven中仓库和依赖的概念。

### 仓库 ###
　　Maven的其中一个功能就是集中管理项目所引用的第三方开发的`jar`包以及`jar`包的元数据，而这些`jar`包和元数据信息所存储的文件目录就称为Maven仓库。这里所说的元数据即`pom`文件，描述了该`jar`包的来历（哪个组织编写的这个项目，以及项目的名称等等）以及`jar`包所需的外部依赖（很可能我们引用的`jar`文件本身也引用了其他`jar`文件）。该元数据信息使得Maven可以递归地下载所有的依赖，直到整个依赖树都下载完毕并放到你的本地仓库中。

　　对于Maven来说，仓库只分为两类：`本地仓库`、`远程仓库`。
　　我们执行`mvn`命令时，Maven其中一个首要目标就是检查当前项目`pom.xml`中的依赖情况，当解析到一个`<dependency>`标签时Maven首先是从本地仓库中查找`jar`文件（也可以是`so`等文件，但默认是`jar`文件），如果没有找到或者需要查看是否有更新的版本，Maven就会去远程仓库查找，若找到了则会先把它下载到本地仓库后再使用，若本地和远程仓库中都没有找到则Maven将报错。

　　在这个基本分类的基础上，还有必要介绍一些特殊的远程仓库：
　　`中央仓库`是Maven核心自带的远程仓库，它包含了绝大部分开源构件。在默认配置下，当本地仓库没有Maven需要的构件的时候，它就会尝试从中央仓库下载。
　　`私服`是另一种特殊的远程仓库，为了节省带宽和时间，应该在局域网内架设一个私有的仓库服务器，用其代理所有外部的远程仓库。公司内部的项目也可以部署到私服上供其他项目使用。
　　除了中央仓库和私服外，还有很多其他公开的远程仓库，常见的有`Java.net Maven`库和`JBoss Maven`库等。

<br>**本地仓库**
　　一般来说，在Maven项目目录下，没有诸如`lib/`这样用来存放依赖文件的目录。当Maven在执行编译或测试时，如果需要使用依赖文件，它总是基于坐标来在本地仓库中查找依赖文件。

　　默认情况下，不论是`Windows`还是`Linux`，当首次执行`mvn`命令时Maven会在当前登录到操作系统的用户的目录下创建一个`.m2`的隐藏文件夹，其内有一个`repository`目录就是默认的本地仓库。
　　有时候，因为某些原因（例如C盘空间不够），用户会想要自定义本地仓库目录地址。这是可以通过修改`.m2/settings.xml`来更改本地仓库的路径。
``` xml
<settings>
    <localRepository>D:\java\repository\</localRepository>
</settings>
```
　　这样，该用户的本地仓库地址就被设置成了：`D:\java\repository\`。
　　需要注意的是，默认情况下`.m2/settings.xml`文件是不存在的，用户需要将`M2_HOME/conf/settings.xml`复制到`.m2`目录下后再进行编辑。

　　也可以直接修改`conf/settings.xml`文件，但是当需要升级Maven时，就需要先把之前的`settings.xml`文件复制出来，然后在升级之后再把它复制回去，比较麻烦。

　　一般来讲，一个本地仓库会为多个不同的项目服务。因此，Maven只需下载一次，即使有多个项目都依赖它（如多个项目都会用到`JUnit`）。

<br>**中央仓库**
　　由于最原始的本地仓库是空的，Maven必须知道至少一个可用的远程仓库，才能在执行Maven命令的时候下载到需要的构件。中央仓库就是这样一个默认的远程仓库，Maven文件自带了中央仓库的配置。
　　读者可以使用解压工具打开`M2_HOME/lib/maven-model-builder-3.2.3.jar`文件，然后访问路径`org/apache/maven/model/pom-4.0.0.xml`，打开后可以看到如下配置：
``` xml
  <repositories>
    <repository>
      <id>central</id>
      <name>Central Repository</name>
      <url>https://repo.maven.apache.org/maven2</url>
      <layout>default</layout>
      <snapshots>
        <enabled>false</enabled>
      </snapshots>
    </repository>
  </repositories>
```
　　这个`pom-4.0.0.xml`是所有Maven项目的父POM文件，即它们的`pom.xml`文件都继承自此`pom`文件。

　　Maven的 [中央仓库](http://search.maven.org/#browse) 由Maven社区提供。默认情况下，所有不在本地仓库中的依赖都会去这个中央仓库查找。然后Maven会将这些依赖下载到你的本地仓库。访问中央仓库不需要做额外的配置。

<br>**私服**
　　私服是一种特殊的远程仓库，它是架设在局域网内的仓库服务，私服代理广域网上的远程仓库，供局域网内的Maven用户使用。当Maven需要下载构件的时候，它从私服请求，如果私服上不存在该构件，则从外部的远程仓库下载，缓存在私服上之后，再为Maven的下载请求提供服务。
　　私服也用于放置组织内部的项目，该项目由多个项目共享。比如，由多个内部项目共用的安全项目。该安全项目不能被外部访问，因此不能放在公开的中央仓库下，而应该放到内部的私服中。

　　Maven仓库的详细介绍参考 [Maven仓库介绍](http://maven.apache.org/guides/introduction/introduction-to-repositories.html) 。

### 依赖 ###

<br>　　范例1：dependency的子标签。
``` xml
<dependencies>    
    <dependency>
        <groupId>...</groupId>
        <artifactId>...</artifactId>
        <version>...</version>
        <type>...</type>
        <scope>...</scope>
    </dependency>
</dependencies>   
```
    语句解释：
    -  <type>标签：
       -  表示依赖的类型，对应于项目坐标定义的packaging。大部分情况下，该元素不必声明，期默认值为jar。

<br>**依赖范围**
　　Maven在编译主代码（`src/main`）的时候需要使用一套`classpath`，在编译和执行测试的时候（`src/test`）会使用另一套`classpath`，实际运行项目的时候，又会使用一套`classpath`。

　　依赖范围就是用来控制依赖与这三种classpath(`编译classpath`、`测试classpath`、`运行classpath`)的关系，Maven有以下几种依赖范围：
　　**compile：**编译依赖范围。如果某个`<dependency>`没有指定`<scope>`，则Maven就会默认使用该依赖范围。使用此依赖范围的Maven依赖，对于编译、测试、运行三种classpath都有效。也就是说在项目编译、测试、打包运行的时候，在`src/main`目录下的源文件里都可以使用该依赖。
 
　　**test: **测试依赖范围。使用此依赖范围的Maven依赖，只对于测试classpath有效，在编译主代码或者运行项目的使用时将无法使用此类依赖。典型的例子就是`JUnit`，它只有在编译测试代码及运行测试的时候才需要。
 
　　**provided: **已提供依赖范围。使用此依赖范围的Maven依赖，对于编译和测试classpath有效，但在运行时无效。典型的例子是`android.jar`，编译和测试项目的时候需要该依赖，但在运行项目（即`apk`中不会包含`android.jar`）的时候，因为手机上已经提供，不需要Maven重复地引入一遍。
 
　　**runtime: **运行时依赖范围。使用此依赖范围的Maven依赖，对于测试和运行classpath有效，但在编译主代码时无效。典型的例子是JDBC驱动实现，项目主代码的编译只需要JDK提供的JDBC接口，只有在执行测试或者运行项目的时候才需要实现上述接口的具体JDBC驱动。

　　**system: **系统依赖范围。该依赖与三种classpath的关系，和provided依赖范围完全一致。但是，使用system范围依赖时必须通过systemPath元素显式地指定依赖文件的路径。由于此类依赖不是通过Maven仓库解析的，而且往往与本机系统绑定，可能造成构建的不可移植，因此应该谨慎使用。

### 开始测试项目 ###
　　接下来进入到`hello-world/src/test/java`目录中，创建`com.juvenxu.mvnbook.helloworld.HelloWorldTest.java`。

<br>　　范例1：HelloWorldTest.java。
``` java
package com.juvenxu.mvnbook.helloworld;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
public class HelloWorldTest {
    @Test
    public void testSayHello() {
        assertEquals("Hello Maven", HelloWorld.getMessage());
    }
} 
```
　　一个典型的单元测试包含三个步骤：

    一，准备测试类及数据；
    二，执行要测试的行为；
    三，检查结果。
　　上述样例中，我们首先初始化了一个要测试的HelloWorld实例，接着获取`HelloWorld.getMessage()`的返回值，最后使用JUnit框架的`Assert.assertEquals()`检查结果是否为我们期望的`Hello Maven`。
　　在`JUnit 3`中，约定所有需要执行测试的方法都以`test`开头，这里我们使用了`JUnit 4`，但我们仍然遵循这一约定，在`JUnit 4`中，需要执行的测试方法都应该以`@Test`进行标注。  
　　测试用例编写完毕之后就可以调用Maven执行测试，在项目根目录下运行`mvn clean test`，Maven会打印出类似如下信息：
``` c
…
[INFO] [compiler:testCompile {execution: default-testCompile}]
[INFO] Compiling 1 source file to D: \code\hello-world\target\test-classes    
[surefire:test {execution: default-test}]
[INFO] Surefire report directory: D:\code\hello-world\target\surefire-reports
-------------------------------------------------------
T E S T S
-------------------------------------------------------
Running com.juvenxu.mvnbook.helloworld.HelloWorldTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.055 sec    
Results :
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------    
[INFO] BUILD SUCCESSFUL
[INFO] ------------------------------------------------------------------------    
…  
```

### 打包和运行 ###
　　将项目进行编译、测试之后，下一个重要步骤就是打包（`package`）。Hello World的`pom.xml`中没有指定打包类型，使用默认打包类型`jar`，我们可以简单地执行命令`mvn clean package`进行打包，可以看到如下输出：
``` c
…
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] [jar:jar {execution: default-jar}]
[INFO] Building jar: D:\code\hello-world\target\hello-world-1.0-SNAPSHOT.jar    
[INFO]
-------------------------------------------------------------------- 
[INFO] BUILD SUCCESSFUL
…
```
　　类似地，Maven会在打包之前执行编译、测试等操作。这里我们看到第`4`行`jar:jar`任务负责打包，实际上就是jar插件的jar目标将项目主代码打包成一个名为`hello-world-1.0-SNAPSHOT.jar`的文件，该文件也位于`target/`输出目录中，它是根据`artifact-version.jar`规则进行命名的，如有需要，我们还可以使用`finalName`来自定义该文件的名称，这里暂且不展开，以后会详细解释。

<br>　　至此，我们得到了项目的输出，如果有需要的话，就可以复制这个jar文件到其他项目的`classpath`中从而使用HelloWorld类。但是，如何才能让其他的Maven项目直接引用这个`jar`呢？我们还需要一个安装的步骤，执行`mvn clean install`：
``` c
…
[INFO] [jar:jar {execution: default-jar}]
[INFO] Building jar: D: \code\hello-world\target\hello-world-1.0-SNAPSHOT.jar
[INFO] [install:install {execution: default-install}]
[INFO] Installing D:\code\hello-world\target\hello-world-1.0-SNAPSHOT.jar to C:\Users\juven\.m2\repository\com\juvenxu\mvnbook\hello-world\1.0-SNAPSHOT\hello-world-1.0-SNAPSHOT.jar
[INFO]
------------------------------------------------------------------------    
[INFO] BUILD SUCCESSFUL
… 
```
　　从上面的日志可以看出，在打包之后，我们又执行了安装任务`install:install`，且看到该任务将项目输出的`jar`安装到了Maven本地仓库中，我们可以打开相应的文件夹看到Hello World项目的`pom`和`jar`。之前讲述`JUnit`的`POM`及`jar`的下载的时候，我们说只有构件被下载到本地仓库后，才能由所有Maven项目使用，这里是同样的道理，只有将Hello World的构件安装到本地仓库之后，其他Maven项目才能使用它。


<br>　　我们已经将体验了Maven最主要的命令：
　　`mvn clean compile`、`mvn clean test`、`mvn clean package`、`mvn clean install`。
　　执行`test`之前是会先执行`compile`的，执行`package`之前是会先执行`test`的，而类似地，`install`之前会执行`package`。我们可以在任何一个Maven项目中执行这些命令，而且我们已经清楚它们是用来做什么的。

<br>　　最后还有一点要注意：项目主代码和测试代码不同，项目的主代码会被打包到最终的构件中（比如`jar`），而测试代码只在运行测试时用到，不会被打包，所以现在去打开已经部署到本地仓库中的jar文件就可以看到，里面并没有`src/test`目录。

### 使用Archetype生成项目骨架 ###
　　Hello World项目中有一些Maven的约定：

    -  在项目的根目录中放置pom.xml
    -  在src/main/java目录中放置项目的主代码
    -  在src/test/java中放置项目的测试代码。
　　刚才之所以一步一步地展示这些步骤，是为了能让可能是Maven初学者的你得到最实际的感受。我们将这些基本的目录结构称为`项目的骨架`。当你第一次创建项目骨架的时候，你还会饶有兴趣地去体会这些默认约定背后的思想，第二次，第三次，你也许还会满意自己的熟练程度，但第四、第五次做同样的事情，就会`让程序员恼火了`，为此Maven提供了`Archetype`插件以帮助我们快速勾勒出项目骨架。

　　还是以Hello World为例，我们使用`archetype`来创建该项目的骨架，离开当前的Maven项目目录，返回到上层目录，然后进去执行下面的范例。

<br>　　范例1：创建一个最简单的Maven项目。
``` java
mvn archetype:generate 
-DgroupId=com.juvenxu.mvnbook 
-DartifactId=hello-world2 
-DarchetypeArtifactId=maven-archetype-quickstart 
-DinteractiveMode=false
```
    语句解释：
    -  为了显示方便本范例将这条命令拆分成了多行，但执行之前一定要把它们搞成一行后再执行。
    -  使用mvn archetype:generate命令来创建一个项目。
    -  我们可以在执行命令的时候为它指定一些参数，每个参数名之前加上-D，参数之间用空格间隔。
    -  生成项目的时间会依据你的网络状态而变化，也许会久一些，耐心等待一下吧。
    -  参数解释：
       -  interactiveMode：在使用某些项目骨架创建项目的时候，中途项目骨架可能会询问用户如何继续向下进行的操作，此参数用来设置是否需要显示这些询问，默认值为true。
<br>　　`archetype`可以帮助我们迅速地构建起项目的骨架，在前面的例子中，我们完全可以在`archetype`生成的骨架的基础上开发Hello World项目以节省我们大量时间。

　　既然知道了`archetype`是插件，那么我们下面再简单的介绍一下Maven插件相关的概念。

### 插件 ###
<br>**基于插件**
　　Maven本身的源代码体积很小（也就3M左右），它只需要实现它提出的“`构建生命周期`、`构建阶段`、`构建目标`”等抽象概念相关的逻辑即可，而它所提供的其他功能，比如项目的创建、编译、测试、部署等都是通过插件（`Plugin`）来完成的。因此本质上可以说Maven是一个插件框架。
　　比如当我们在命令行中输入`mvn compile`去命令Maven执行`default`生命周期中的`compile`构建阶段时，真正去执行任务的其实是Maven内置的`maven-compiler-plugin`插件。
　　目前Maven社区中已经有了很多插件，每个插件都有是针对不同的需求设计的，有的插件用于编译源代码，有的则用于创建Maven项目。

　　在一个插件的内部可以提供多个接口，而每一个接口我们都称它为一个goal（即目标）。以`maven-compiler-plugin`插件为例，它内部就有如下2个goal：

    -  compile：用来编译位于src/main/java/目录下的主源码
    -  testCompile：用来编译位于src/test/java/目录下的测试源码

<br>**调用插件**
　　用户可以通过两种方式调用Maven插件目标：

　　第一种方式是将插件目标（goal）与生命周期阶段（lifecycle phase）绑定，这样用户在命令行中就可以只输入生命周期阶段了，例如Maven默认将`maven-compiler-plugin`的`compile`目标与`default`生命期的`compile`阶段绑定，因此命令`mvn compile`实际上是先定位到`compile`这一阶段，然后再根据绑定关系调用`maven-compiler-plugin`的`compile`目标。

　　第二种方式是直接在命令行指定要执行的插件目标，例如`mvn archetype:generate`就表示调用`maven-archetype-plugin`的`generate`目标，这种带冒号的调用方式与生命周期无关。

　　总结一下：

    -  一个构建生命周期对应多个构建阶段，一个构建阶段对应多个构建目标。
    -  一个插件可以提供多个goal，goal具备具体的功能，插件中的每个goal可以被绑定到多个构建阶段中。
    -  一个插件的goal就是一个构建目标，因此一个构建阶段中可以有多个goal，同时这些goal可以来自不同插件。

<br>**常用插件**
　　maven-archetype-plugin（http://maven.apache.org/archetype/maven-archetype-plugin/）
　　这个插件提供了一些项目的核心骨架，比如一个简单的项目是这样的目录结构：
``` android
frame-simple
|-src
  |-main
    |-java
    |-一些带有包结构的java文件
    |-resources
    |-一些配置文件，比如log4j.properties
  |-test
    |-java
    |-resources
|-pom.xml
```
　　但是对于一个web项目，目录结构就会稍有不同，maven会要求把`jsp`文件放在`src/main/webapp`下，当然，`WEB-INF`目录也是放在这里。 不同的项目，目录结构是不同的，我们称为项目骨架类型不同。
　　Maven初学者最开始执行的Maven命令可能就是`mvn archetype:generate`，这实际上就是让`maven-archetype-plugin`生成一个很简单的项目骨架，帮助开发者快速上手。
　　可能也有人看到一些文档写了`mvn archetype:create`，但实际上`create`目标已经被弃用了，取而代之的是`generate`目标，该目标使用交互式的方式提示用户输入必要的信息以创建项目，体验更好。
　　`maven-archetype-plugin`还有一些其他目标帮助用户自己定义项目原型，例如你由一个产品需要交付给很多客户进行二次开发，你就可以为他们提供一个Archtype，帮助他们快速上手。

<br>**其他提示**
　　如果Maven标准的构建阶段和目标无法满足项目构建的需求，你可以在`pom.xml`文件里增加插件。Maven有一些标准的插件供选用，如果需要你可以自己实现插件。
　　为了解耦插件的功能和工程阶段，实现高度的可配置性，Maven规定插件只是实现`goal`的功能，通过配置来决定在哪个阶段执行（Execution)哪些`goal`操作。 甚至可以把一个`goal`绑定到多个`Phase`，以实现复用。

## Android多渠道打包 ##
　　不论是一个既存的老项目，还是一个新的Maven项目，我们都可以很简单的为它们添加Maven支持，并完成多渠道打包的功能。 
　　本节将介绍如何在一个老项目的基础上使用Maven进行多渠道打包。
　　这里所说的老项目其实就是指不遵守Maven目录规范（`src/main/java`、`src/main/java`）的普通Android项目。

### 创建Android项目 ###
<br>　　第一步，用Eclipse创建一个名为`MavenBuild`的Android项目，并在它的`assets`目录下创建一个`common.properties`文件，用于配置渠道号。项目的本地路径为：`D:\makeApk\MavenBuild`。

　　范例1：`assets\common.properties`文件。
``` java
channel=default
```
<br>　　第二步，在`MainActivity.java`中读取渠道信息，并使用`Toast`把渠道显示到屏幕上。

　　范例2：MainActivity类。
``` java
package com.example.mavenbuild;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import android.app.Activity;
import android.os.Bundle;
import android.widget.Toast;
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Properties properties = new Properties();
        try {
            InputStream input = getAssets().open("common.properties");
            properties.load(input);
            Toast.makeText(this,properties.getProperty("channel"),Toast.LENGTH_LONG).show();;
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 添加pom.xml文件 ###
<br>　　第三步，将下面的`pom.xml`文件放到项目的根目录。

　　范例3：pom.xml。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example.mavenbuild</groupId>
    <artifactId>mavenbuild-test</artifactId>
    <version>1.0.0</version>
    <packaging>apk</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.android</groupId>
            <artifactId>android</artifactId>
            <version>4.1.1.4</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src</sourceDirectory>
        <finalName>${project.artifactId}</finalName>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>com.jayway.maven.plugins.android.generation2</groupId>
                    <artifactId>android-maven-plugin</artifactId>
                    <version>3.8.2</version>
                    <extensions>true</extensions>
                </plugin>
            </plugins>
        </pluginManagement>
        <plugins>
            <plugin>
                <groupId>com.jayway.maven.plugins.android.generation2</groupId>
                <artifactId>android-maven-plugin</artifactId>
                <configuration>
                    <sdk>
                        <!-- platform as api level (api level 16 = platform 4.1)-->
                        <platform>16</platform>
                    </sdk>
                    <sign>
                        <debug>false</debug>
                    </sign>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

　　接下来将按照标签出现的顺序依次介绍上面各个标签的含义。

<br>　　范例4：`<properties>`标签。
``` xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```
　　元素`properties`用来配置在当前`pom.xml`文档中所有使用到的常量，它的每一个子元素都是一个常量，这些常量在pom文件的整个运行过程中都可以被使用（通过`${}`来引用，比如`${project.build.sourceEncoding}`）。
　　设置`<project.build.sourceEncoding>`常量就是在告诉Maven：我们的项目的源代码是`UTF-8`编码的。这个设置是很重要的，如果你的项目是`UTF-8`编码，但是你却在中文版的Win7中执行Maven的编译操作，那么编译器将会报错：`编码 GBK 的不可映射字符`，因为默认情况下Maven会使用本地操作系统的编码（`GBK`）去编译项目。


<br>　　范例5：`<dependencies>`标签。
``` xml
<dependencies>
    <dependency>
        <groupId>com.google.android</groupId>
        <artifactId>android</artifactId>
        <version>4.1.1.4</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```
　　本范例通过Maven的依赖机制引用了`anroid4.1.1.4`的`jar`包，如果不依赖它的话，程序中的`Activity`、`Toast`等类都将无法使用。

<br>　　范例6：`<build>`标签。
``` xml
<sourceDirectory>src</sourceDirectory>
<finalName>${project.artifactId}</finalName>
```
　　元素`build`用来描述项目构建相关的配置。
　　默认情况下，Maven认为项目的源代码目录是`src/main/java`，但使用`<sourceDirectory>`标签可以更改源码的路径。有了这个标签后，就可以在不修改项目包结构的情况下，让项目支持Maven了。
　　元素`finalName`用来设置项目最终生成的apk的名称，从上面的代码可以看出，它引用了`project.artifactId`常量的值。 
　　事实上`project.artifactId`是Maven内置的一个常量，Maven会将检测到的项目的`artifactId`值赋值给它。

<br>　　范例7：编译插件。
``` xml
<!-- 此处省略了pluginManagement标签里的内容 -->
<plugins>
    <plugin>
        <groupId>com.jayway.maven.plugins.android.generation2</groupId>
        <artifactId>android-maven-plugin</artifactId>
        <configuration>
            <sdk>
            <!-- platform as api level (api level 16 = platform 4.1)-->
                <platform>16</platform>
            </sdk>
            <sign>
                <debug>false</debug>
            </sign>
        </configuration>
    </plugin>
</plugins>
```
　　元素`plugins`用来列出一组插件，它里面的每一个元素都是一个插件，即`<plugin>`标签。
　　每种不同的项目需要对应的插件才能进行正确的编译，Android应用程序就需要上面配置的那个插件。 我们可以使用`<configuration>`标签来为插件指定参数。
　　标签`<sdk>`用来指定执行编译任务的`Android SDK`版本。标签`<sign>`用来指定是否打出具有`debug`签名的`apk`包，如果设置`false`则打出将是一个没有任何签名的包，这意味着你无法把它安装到手机上。
　　你应该确保自己的电脑上安装了`Android SDK`，并且有`sdk\platforms\android-16`目录，否则是无法执行编译的。同时你还需要创建一个名为`ANDROID_HOME`的环境变量，把`Android SDK`的存放路径设置上去，这个环境变量是编译插件所必需的。


### 编写批处理文件 ###
　　搞完了pom文件后，接下来创建一个`D:\makeApk\channel.txt`文件，在里面写好渠道号，稍后我们会通过一个批处理文件循环读取这个文件，并为文件中所列的渠道打包。

<br>　　范例8：channel.txt。
``` android
tencent
360
baidu
```
　　为了方便读取，每个渠道单独写一行。

<br>　　批处理，顾名思义就是进行批量的处理。批处理文件是扩展名为`.bat`或`.cmd`的文本文件，包含一条或多条命令，由`DOS`或`Windows`系统内嵌的命令解释器来解释运行。

　　然后我们来创建一个名为`D:\makeApk\MavenBuild\build.bat`的批处理文件。

<br>　　范例9：build.bat。
``` android
@echo off
set mArtifactId=mavenbuild-test
set mOutputDir=D:\makeApk\output
set mChannelFile=D:\makeApk\channel.txt
set mKeystoreFile=D:\makeApk\mavenBuild.keystore
set mStorepass=dreamzone
set mAlias=dreamzone
call mvn clean package
cd target
for /f %%i in (%mChannelFile%) do (
    aapt rm %mArtifactId%.apk assets/common.properties
    mkdir assets
    echo channel=%%i>assets/common.properties
    aapt add %mArtifactId%.apk assets/common.properties
    jarsigner -keystore %mKeystoreFile% -storepass %mStorepass% -signedjar %mOutputDir%\%mArtifactId%-%%i.apk %mArtifactId%.apk %mAlias% -verbose -sigalg SHA1withRSA -digestalg SHA1
)
cd ..
```
    语句解释：
    -  第2-7行代码用来定义临时变量，当命令行窗口被关闭时，变量就会失效。
    -  第8行使用Maven打出一个未签名的包。由于mvn命令本身就是一个批处理文件所以需要在它前面加一个call关键字，否则执行完mvn命令后当前批处理文件就会停止向下执行了。
    -  第9行进入到Maven生成的target目录，之后的命令都将会在target目录下执行。
    -  第10行使用for循环从渠道配置文件中读取渠道号，并保存到变量i中，每次读取一行。
    -  第11行将生成的未签名的apk文件中的assets/common.properties文件给删除。
    -  第12行创建target/assets目录。
    -  第13行将一个字符串“channel=渠道号”写入到target/assets/common.properties文件中。
    -  第14行将target/assets/common.properties文件写入到刚才生成的未签名的apk文件的assets目录中。
    -  第15行对apk进行签名。
    -  第17行返回到上一级目录中。
    -  批处理相关的知识请参阅本人所写的《Windows批处理》，jarsigner.exe相关的知识请参阅本人所写的《应用程序破解》。

　　在执行这个`build.bat`文件之前，需要做的几件事：

    -  将Android SDK的platform-tools\aapt工具所在的路径配置到PATH变量中。
    -  确保mOutputDir、mChannelFile、mKeystoreFile所指向的文件或者文件夹已经存在。


　　接着我们打开`cmd`窗口，并通过`cd`命令进入到项目的根目录中：
``` android
D:
cd D:\makeApk\MavenBuild
```
　　最后我们把`build.bat`文件拖动到`cmd`窗口中，按下回车键即可。

<br>　　如果执行`build.bat`抛出了`MojoExecutionException android-040-001`异常，原因可能是Maven打包时在`platform-tools`下找不到`dx.jar`文件，在有的版本的Android SDK中该文件被放到`platform-tools\lib`目录下了，copy出来即可。

### 验证结果 ###
　　结果很好验证，按照如下步骤即可：

    -  首先，使用找一个Android项目，用Eclipse打出一个具有debug签名的apk，和一个非debug签名的apk。
    -  然后，从mOutputDir目录下找一个已签名的apk，从target下取出那个未签名的apk。
    -  接着：
       -  尝试用adb工具安装target下取出那个未签名的apk，结果应该是失败。
       -  先安装Eclipse打出的非debug签名的包到手机上，然后再安装从mOutputDir目录下找到的已签名的apk，如果能覆盖安装，则证明两者相同。
    -  最后，执行adb命令时，如果试图安装一个手机上已经安装了的app则adb会报错：Failure [INSTALL_FAILED_ALREADY_EXISTS]， 解决的方法是在adb install命令后面加一个-r的参数，强制覆盖安装即可。

### 添加项目依赖 ###
　　刚才已经介绍了如何在一个最简单的`Android`项目上使用Maven进行多渠道打包，但只掌握那点知识还远远不够，因为实际应用的过程中情况要复杂的多。
　　对于一个老项目来说，它可能已经引用了很多第三方`jar`文件（它们保存在项目的`lib`目录下），而使用Maven对这个项目打包时，Maven它只关注`pom.xml`文件里的`<dependency>`所依赖的`jar`包，因此如果在`pom.xml`文件里没有找到对`jar`包的依赖，则打包的时候就会报错。

<br>　　通常项目所引用的`jar`包可分为两类：

    -  在中央（或其他远程）仓库中可以找到的jar包。
    -  第三方提供的jar包。


#### 从中央仓库获取 ####
　　在Android项目中，除了`android.jar`外，最常用的一个`jar`包就是`android-support-v4.jar`了，因此我们不可避免的需要在`pom.xml`文件中添加对它的依赖。
　　当我们需要引用一个第三方的库时，首先应该尝试去中央仓库（[http://search.maven.org](http://search.maven.org)，可能需要翻墙）中搜索，如下图所示：

<center>
![搜索android-support-v4.jar](/img/maven/maven_1_1.png)
</center>

　　如果找到了自己想要的`jar`，则可以点击它的版本号（上图中红框圈住的部分），就可以找到它对应的依赖信息了，如下图所示：

<center>
![依赖信息](/img/maven/maven_1_2.png)
</center>

　　将上图中的依赖信息赋值到`pom.xml`文件中即可。

#### 手动添加到仓库 ####
　　当中央（或远程）仓库中不存在我们所需要的`jar`包时，我们就需要自己手工去下载`jar`，然后把它添加到本地仓库中。

　　比如，现在项目需要接入一个第三方的支付SDK，该SDK以`jar`包的形式提供给我们，并要求把这个`jar`添加到项目中。由于这个`jar`包肯定不可能被Maven中央仓库所收录，因此为了保证项目在使用Maven打包的时候不报错，我们应该将这个`jar`手动的放入到仓库（本地或者远程）中，当打包的时候Maven能从仓库中引用到它了。

　　首先，假设这个`jar`的名称为`srapp.jar`，它的存放路径为`D:\libs\srapp.jar`。
<br>　　然后，我们执行下面的命令将它安装到本地仓库中。
``` mvn
mvn install:install-file -Dfile=D:\libs\srapp.jar -DgroupId=com.srapp -DartifactId=srapp -Dversion=1.1 -Dpackaging=jar
```
    语句解释：
    -  使用mvn install:install-file命令来将一个jar文件安装到本地仓库中。该命令有五个参数：
       -  file：jar文件的本地路径。
       -  groupId：组id。通常可以用jar里面的顶层包的包名。当然也可以任意写，只需要保证它的唯一性即可。
       -  artifactId、version、packaging：你懂的。

<br>　　接着，执行完毕命令后，我们可以到本地仓库下找到这个文件：
``` mvn
C:\Users\cutler\.m2\repository\com\srapp\srapp\1.1
```

<br>　　最后，我们需要把它配置到`pom.xml`文件中：
``` xml
<dependency>
    <groupId>com.srapp</groupId>
    <artifactId>srapp</artifactId>
    <version>1.1</version>
</dependency>
```

#### apklib依赖 ####
　　实际开发中通常会引用第三方提供的`apklib`项目，而Maven也可以帮我们处理。

　　首先，在`apklib`项目中添加一个`pom.xml`文件，具体的添加流程和普通项目完全一样，唯一不同的是`packaging`属性的值：
``` xml
<groupId>com.srapp.coreres</groupId>
<artifactId>coreres</artifactId>
<version>1.0.0</version>
<packaging>apklib</packaging>
```

　　然后，在命令行中进入到`apklib`项目的根目录下，执行：
``` xml
mvn clean install
```

　　如果执行成功的话，我们就可以在本地仓库中找到它。然后在主项目的`pom.xml`中添加如下代码：
``` xml
<dependency>
    <groupId>com.srapp.coreres</groupId>
    <artifactId>coreres</artifactId>
    <version>1.0.0</version>
    <type>apklib</type>
</dependency>
```
　　注意，引用的时候使用`<type>`标签指明该依赖是`apklib`类型的。

　　最后，在命令行中进入到主项目的根目录下，执行打包即可。


<br>**相关链接：**
- [Maven入门指南](http://ifeve.com/maven-1/)
- [Maven Tutorial](http://tutorials.jenkov.com/maven/maven-tutorial.html)
- [Apache Maven 入门篇](http://www.oracle.com/technetwork/cn/community/java/apache-maven-getting-started-1-406235-zhs.html)
- [maven入门实战](http://my.oschina.net/morflameblog/blog/42493)
- [理解maven的核心概念](http://www.cnblogs.com/holbrook/archive/2012/12/24/2830519.html)
- [常用Maven插件介绍](http://www.infoq.com/cn/news/2011/04/xxb-maven-7-plugin)
- [Maven pom.xml 配置详解](http://blog.csdn.net/ithomer/article/details/9332071)
- [Maven 手动添加 JAR 包到本地仓库](http://www.blogjava.net/fancydeepin/archive/2012/06/12/380605.html)

# 第二节 Android Studio #
　　`Android Studio`是谷歌推出的一个Android开发环境，基于`IntelliJ IDEA`。

## 基础入门 ##

　　在`Google 2013`年`I/O`大会上，`Android Studio`这款开发工具被首次公布。

　　在`IntelliJ IDEA`的基础上，`Android Studio`提供：

    -  基于Gradle的构建支持
    -  Android专属的重构和快速修复
    -  提示工具以捕获性能、可用性、版本兼容性等问题
    -  支持ProGuard和应用签名
    -  基于模板的向导来生成常用的Android应用设计和组件
    -  功能强大的布局编辑器，可以让你拖拉UI控件并进行效果预览

　　以上介绍都是从百度百科中摘抄过来的，猛地一看，没看懂多少，说的太空泛了。
<br>　　**为何使用AndroidStudio？**

　　笔者也是被大势所趋，在`2015年4月14日 夜`，突然顿悟，看透天机，明白使用`Android Studio`开发才是正道，未来Android推出的新技术，势必会完全向`Android Studio`靠拢，而不会是`Eclipse`（开源社区越来越偏向`Android Studio`了）。
　　因而在`Android Studio`发布`1.1.0`版本时，笔者决定开始接触它。

　　`Android Studio`中文组在`2015年6月28日`发表了一篇文章，也表明了Google未来的态度：

    -  为了简化Android的开发力度，Google决定将重点建设Android Studio工具，并会在今年年底停止支持其他集成开发环境，比如Eclipse。

　　环境搭建的步骤很简单，网上很容易就可以搜到，笔者不再冗述。

### HelloWorld ###
　　环境搭建完毕后，我们接下来就开始创建一个名为`HelloWorld`的项目，然后运行它。
　　项目创建的具体过程，可以参阅：[《使用Android Studio开发Android APP》](http://blog.csdn.net/u014450015/article/details/46534567)，笔者就不再冗述了，主要是因为要截很多图，太占博客的空间了。

　　进入到`Android Studio`后，你会看到如下界面（可能和你的有点不同，但是不影响）：

<center>
![](/img/android/android_o04_01.jpg)
</center>

　　右面的那一个红框里的按钮，都是我们常用的功能键，比如第二个和第三个分别是`运行`和`Debug`，倒数第二个和倒数第一个分别是，`SDK Manager`和`Android Device Monitor`（即原来Eclipse中的`DDMS`视图）。
　　左面的那一个红框里的按钮，用来切换项目的展示方式，常用的一共有三种：`Project`、`Packages`、`Android`，它们的区别请自行查看，开发的时候都是用`Android`。

<br>**运行项目**
　　首先要做的是打开`Android Device Monitor`窗口，创建一个模拟器，或者连接真机。

　　假设项目的包名为`com.cutler.helloworld`，然后点击上面说的`运行按钮`（绿色的三角）后，你可能会遇到这个错误：
``` c
Installing com.cutler.helloworld
DEVICE SHELL COMMAND: pm install -r "/data/local/tmp/com.cutler.helloworld"
pkg: /data/local/tmp/com.cutler.helloworld
Failure [INSTALL_FAILED_OLDER_SDK]
```
　　这是因为项目的`minSdkVersion`属性设置的高于设备的`Api Level`版本号。
　　按照以前的思路，应该去`AndroidManifest.xml`文件里修改这个值，但是现在在清单文件中却找不到`<uses-sdk>`标签了。

    -  事实上，使用Android Studio创建的Android项目的目录结构已经和Eclipse创建的不一样了。
    -  现在我们需要进入到一个名为build.gradle的文件中修改。
    -  即下图中的build.gradle(Module:app)，把里面的minSdkVersion 21改为minSdkVersion 8即可。

<center>
![](/img/android/android_o04_02.png)
</center>

<br>**Poject 与 Module**
　　在 Android Studio 中，一个`Project`对应一个`Studio`窗口，如果想打开多个`Project`，那么就得打开多个`Studio`窗口。

　　通常，一个完整的`Project`是由一个主项目+若干`library`项目组成的：

    -  AS提出了Module的概念，上面说的主项目、library项目都被称为一个Module，即一个Project由多个Module组成。
    -  每一个Module需要有属于自己的build.gradle文件。
    -  build.gradle文件包含了一些很重要的内容，比如所支持的安卓版本和项目依赖的东西等。
　　此时应该就能明白，刚才为什么要修改上面的`build.gradle(Module:app)`文件了。

<br>**删除项目**
　　本文使用的是`Android Studio 1.2.2`版本，在该版本中没法很方便的删除一个项目，有位道友折腾了半天也没找到好的方法，他折腾的过程请参见[《Android studio删除工程项目》](http://www.cnblogs.com/smiler/p/3854816.html) 。 
　　笔者找到一个相对省事的方法：首先把 Android Studio 给关掉，然后去本地直接删掉项目的目录即可。

<br>**本节参考阅读：**
- [百度百科 - Android Studio](http://baike.baidu.com/view/10600831.htm)
- [Android Studio vs Eclipse：你需要知道的那些事](http://mobile.51cto.com/abased-434702.htm)

### API Level ###
　　考虑到有的读者可能不清楚项目的`编译版本`和`最低运行版本`之间的区别，特此增加这一节专门介绍一下`API Level`相关的知识。

　　Android平台提供了一套框架API，使得应用程序可以与系统底层进行交互。该框架API由以下模块组成：

    -  一组核心的包和类。
    -  清单(manifest)文件的XML元素和属性声明。
    -  资源文件的XML元素和属性声明及访问形式。
    -  各类意图(Intents)。
    -  应用程序可以请求的各类授权，以及系统中包含的授权执行。
　　每个版本的Android操作系统以及其提供的框架`API`，都被指定一个`整数`标识符，称为`API Level`。以`Android1.0`系统为例，它的`API`的版本号是`1`，这个数字被保存在操作系统内部，之后Android系统版本的`API Level`依次递增`1`。
``` c
操作系统             API等级          操作系统             API等级
Android1.0          1            Android1.1              2
Android1.5          3            Android1.6              4
Android2.0          5            Android2.0.1            6
Android2.1.x            7            Android2.2.x            8
Android2.3,2.3.x        9            Android2.3.x            10
Android3.0.x            11           Android3.1.x            12
Android3.2              13           Android4.0,4.0.x        14
Android4.0.3,4.0.4      15           Android4.1,4.1.x        16
Android4.2,4.2.2    17
```

<br>**minSdkVersion**
　　开发程序之前，为了保证程序正确的运行，需要设置App所支持最低`API Level`（`minSdkVersion`）。
　　当项目设置了`minSdkVersion`后，在用户准备安装这个项目生成的`apk`到手机等Android设备前，操作系统会检查该`apk`所支持的`minSdkVersion`是否和系统内部的`API Level`匹配，当且仅当小于或等于系统中保存的`API Level`时，才会继续安装此程序，否则将不允许安装。

　　警告：

    -  如果你不声明minSdkVersion属性，系统会假设一个默认值“1”，这意味着您的应用程序兼容所有版本的Android。
    -  如果您的应用程序不兼容所有版本(例如，它使用了API级别3中的接口)并且你没有设置minSdkVersion的值，那么当安装在一个API级别小于3的系统中时，应用程序在运行，并且执行到了调用Android1.5（API级别3级）的API的那句代码时，就会崩溃，即试图访问不可用API(但是程序的其他没有调用该API的地方可以正常运行)。出于这个原因，一定要申报相应的API级别在minSdkVersion属性。

<br>**targetSdkVersion**
　　标明应用程序目标`API Level`的一个整数。如果不设置，默认值和`minSdkVersion`相同。
　　这个属性通知系统，你已经针对这个指定的目标版本测试过你的程序，系统不必再使用兼容模式来让你的应用程序正常运行在这个目标版本。

　　比如：

    -  从Android 3.0开始，在绘制View的时候支持硬件加速，充分利用GPU的特性，使得绘制更加平滑（会多消耗一些内存）。
    -  若是将targetSdkVersion设置为11或以上，则系统会默认使用硬件加速来绘制，但Android3.0之前版本提供的某些绘图API，在硬件加速下进行绘制时，会抛异常。
    -  若是将targetSdkVersion设置为10或以下，则系统不会使用硬件加速。
    -  因此，除非你充分测试了，否则不要把targetSdkVersion设置的过高。

<br>**compileSdkVersion**
　　项目的编译版本（`compileSdkVersion`）和`android:minSdkVersion`属性的值：

    -  compileSdkVersion是指编译当前项目时所使用的SDK平台的版本。
    -  minSdkVersion属性则是限定了当前项目只能安装在大于等于其指定API等级的设备上。

    -  也就是说，我们可以将项目的compileSdkVersion设置为17，而minSdkVersion属性的值则仅为8 。 
    -  只要保证在项目中不去调用API等级8中所未提供的API，那么使用API等级17编译出来的项目依然会正常运行在Android2.2的设备上。

<br>　　问：为什么要把项目的编译版本提高呢?
　　答：它可以让我们的应用程序，既可以使用高版本Android系统中所提供的新功能，同时又能完美的运行在低版本的系统中。以`holo`主题为例，众所周知`holo`主题是`Android3.0`之后的系统中的一个非常大的亮点。如果可以实现“当应用程序运行在3.0之前的系统时使用一般的主题，而运行在3.0之后的系统时则使用holo主题”那可就太好了。

<br>　　范例1：使用`Holo`主题（`res\values-v11\styles.xml`）。
``` xml
<!-- For API level 11 or later, the Holo theme is available and we prefer that. -->
<style name="ThemeHolo" parent="android:Theme.Holo">
</style>
```
　　如果项目的当前编译版本低于`3.0`则`Android Studio`就会报错。
　　因为在编译`styles.xml`时，会依据项目的编译版本，去SDK的安装目录下查找其所依赖的资源，若未找到则就报错： 
``` java
SDK\platforms\android-8\data\res\values
```
　　其中`“android-8”`与项目的编译版本相对应。

　　提示：

    -  当程序运行的时候，系统会检测当前设备的API Level，若大于等于11则使用values-v11目录下的styles.xml，否则则使用values目录下的。
    -  高版本Andrdoid平台的框架API与早期版本兼容，即新版本的Android平台大多数都是新增功能，和引进新的或替代的功能。
    -  对于API的升级，会将老版本的标记为已过时，但不会从新版本中删除，因此现有的应用程序仍然可以使用它们。在极少数情况下，部分旧版本的API可能被修改或删除，通常这种变化是为了保障API的稳定性及应用程序或系统的安全。

## Gradle ##
　　新增的`Gradle`将会是你转到`Android Studio`上最大的障碍，和`Maven`一样，`Gradle`只是提供了构建项目的一个框架，真正起作用的是`Plugin`。

　　笔者将本节的内容，定位为`“了解”`，也就是说你不需要记住下面所有的知识，只要能看懂范例、理解思路即可。

### 概述 ###
　　`Gradle`是以`Groovy`语言为基础的，面向Java应用为主的`构建工具`，它同时继承了`Ant`和`Maven`二者的优点。

　　`Groovy`是Java平台上设计的面向对象编程语言，它的特点：

    -  这门动态语言拥有类似Python、Ruby和Smalltalk中的一些特性，可以作为Java平台的脚本语言使用。
    -  它的语法与Java非常相似，以至于多数的Java代码也是正确的Groovy代码。
    -  Groovy代码动态的被编译器转换成Java字节码。
    -  由于其运行在JVM上的特性，Groovy可以使用其他Java语言编写的库。

　　下面是来自于 http://Groovy.CodeHaus.org 的一个例子程序：
``` gradle
class Foo {
    doSomething() {
        data = ["name": "James", "location": "London"]
        for (e in data) {
            println("entry ${e.key} is ${e.value}")
        }
    }
 
    closureExample(collection) {
        collection.each { println("value ${it}") }
    }
 
    static void main(args) {
        values = [1, 2, 3, "abc"]
        foo = new Foo()
        foo.closureExample(values)
        foo.doSomething()
    }
}
```

<br>**JVM生态圈三大构建工具**

　　最初只有`Make`一种构建工具，后来其发展为`GNU Make`，当今JVM生态圈由三大构建工具所统治：

    -  Apache Ant带着Ivy
    -  Maven
    -  Gradle

　　软件行业新旧交替的速度之快往往令人咂舌，不用多少时间，你就会发现曾经大红大紫的技术已经成为了昨日黄花，当然，`Maven`也不会例外。虽然目前它仍然是`Java`构建的事实标准，但我们也能看到新兴的工具在涌现，比如`Gradle`。

<br>　　Ant

    -  介绍：Ant是第一个“现代”构建工具，在很多方面它有些像Make。发布于2000年，在很短时间内成为Java项目上最流行的构建工具。在最初的版本之后，逐渐具备了支持插件的功能。
    -  优点（但不限于）：主要优点在于对构建过程的控制上。随着通过网络进行依赖管理成为必备功能，Ant采用了Apache Ivy。
    -  缺点：用XML作为脚本编写格式。本质上是层次化的，并不能很好地贴合Ant过程化编程的初衷。除非是很小的项目，否则它的XML文件很快就大得无法管理。
    
<br>　　Maven

    -  介绍：Maven发布于2004年。目的是解决码农使用Ant所带来的一些问题。
    -  优点（但不限于）：
       -  天生具备从网络上自动下载依赖的能力（Ant后来通过Ivy也具备了这个功能）。
       -  由于Maven的缺省构建规则有较高的可重用性，所以常常用两三行Maven构建脚本就可以构建简单的项目，而使用Ant则需要十几行。
    -  缺点：
       -  仍然用XML作为脚本编写格式。在大型项目中，它经常什么“特别的”事还没干就有几百行代码。
       -  正是由于Maven的构建规则的可重用性，导致用Maven很难写出复杂、定制化的构建脚本，甚至不如Ant。

<br>　　Gradle

    -  Gradle结合了前两者的优点，在此基础之上做了很多改进，它既有Ant的强大和灵活，又有Maven的依赖管理。
    -  Gradle不用XML，它使用基于Groovy的专门的DSL，从而使Gradle构建脚本变得比用Ant和Maven写的要简洁清晰。Gradle样板文件的代码很少，这是因为它的DSL被设计用于解决特定的问题：贯穿软件的生命周期，从编译，到静态检查，到测试，直到打包和部署。
    -  Gradle的成就可以概括为：约定好，灵活性也高。 

　　推荐阅读：[《Java构建工具：Ant vs Maven vs Gradle》](http://blog.csdn.net/napolunyishi/article/details/39345995) 与 [《Gradle, 基于DSL的新一代Java构建工具》](http://www.blogjava.net/wldandan/archive/2012/06/26/381532.html)。

<br>　　当我们成功运行完`HelloWorld`项目后，为了更好的使用`Android Studio`进行开发工作，会不可避免的对`build.gradle`文件的语法产生好奇。 
　　接下来笔者将会介绍编写`Gradle`构建脚本的基础知识（虽然一般情况下几乎用不到它们）。
　　为了理论结合实践，接下来我们要安装一下`Gradle`，这样就能一边写代码一边测试了。

<br>**本节参考阅读：**
- [维基百科 - Gradle](http://zh.wikipedia.org/zh-cn/Gradle)
- [维基百科 - Groovy](http://zh.wikipedia.org/zh-cn/Groovy)
- [Android Studio 简介及导入 jar 包和第三方开源库方法](http://drakeet.me/android-studio)
- [Maven实战（六）——Gradle，构建工具的未来？](http://www.infoq.com/cn/news/2011/04/xxb-maven-6-gradle)


### 环境搭建 ###

　　首先，前往官方下载界面下载`Gradle`安装包，下载地址为：https://gradle.org/downloads/ ，本节将以`2.2.1`版本为例讲解`Gradle`的用法。

　　官方安装教程：http://gradle.org/docs/current/userguide/installation.html 。

<br>　　前提条件：

    -  Gradle需要安装1.6及以上版本的Java JDK或JRE。
    -  Gradle拥有自己的Groovy库，因此不需要另行安装Groovy。

<br>　　环境变量

    -  第一，下载完毕后解压缩，然后添加GRADLE_HOME/bin到你的PATH环境变量。比如：F:\apps\gradle-2.2.1\bin。
    -  第二，通过输入gradle -v检查Gradle是否安装正常。
       -  如果安装正确的话会输出Gradle版本和一些本地环境配置（Groovy，Java虚拟机版本，操作系统等等）。

### 构建脚本基础 ###
　　我们对项目进行编译、运行单元测试、生成文档、打包和部署等烦琐且不起眼的工作，都可以说是在对项目进行`构建`。

　　`Gradle`里的构建是基于`task`的：

    -  一个task代表一个具体的任务，它可能是编译一些classes，创建一个jar，生成javadoc等。

<br>**HelloWorld**
　　首先，我们先来创建一个名为`gradleTest`的空文件夹。
　　然后，要知道Gradle与Maven、Ant一样，有一个核心的构建文件，名为`build.gradle`，整个构建的过程都是从它开始的。

<br>　　范例1：将如下代码放入到`build.gradle`中。
``` gradle
task hello {
    doLast {
        println 'Hello world!'
    }
}
```
    语句解释：
    -  首先，我们在脚本中创建了一个名为hello的task。
    -  然后，每一个task中可以有多个代码块（使用{}括起来），这些代码块被称为action。
    -  接着，task使用一个队列来管理它所有的action。当task被执行的时候，按照先后顺序依次执行每个action。
    -  最后，代码块是没有名字的，我们使用doLast关键字来将一个action放到task的队列的队尾。

<br>　　接着，我们创建完毕`gradleTest/build.gradle`后，就可以使用`gradle task名称`命令来启动构建了。
``` gradle
gradle -q hello
```
    语句解释：
    -  这里需要注意两点：
       -  由于我们是在Windows命令行中执行这个脚本，因此build.gradle必须是ANSI编码，别用UTF-8编码，否则编译会出错。
       -  gradle命令后面跟着的是task的名称，而不是文件的名称。
    -  本节之后的绝大多数范例会在命令里加入-q，加上它之后就不会生成Gradle的日志信息，所以用户只能看到task的输出。当然也可以不加它。

<br>　　范例2：快捷的任务定义。
``` gradle
task hello << {
    println "Hello world!!"
}
```
    语句解释：
    -  与前面的例子比较，doLast 被替换成了 <<，它们有一样的功能，但看上去更加简洁了。
    -  字符串既可以用单引号也可以用双引号。

<br>　　上面把HelloWorld范例介绍完了，下面就介绍如果构建Java项目。

### 构建Java项目 ###
　　在正式讲解如何使用`Gradle`构建Java项目之前，先来介绍一下`“插件”`的概念。

<br>**插件**
　　`Gradle`与`Maven`类似，它的很多功能（编译、测试、部署）都是通过插件（`Plugin`）来完成的。简单的说，插件就是一组`task`的集合，我们所说的使用某个插件，实际上就是在使用插件中的`task`。`Gradle`装载了许多插件，针对不同类型的项目、不同的需求，你可以使用不同的插件，比如`java插件`、`android插件`等。你也可以编写自己的插件并和其他开发者分享它。

　　插件是`基于合约`的，这意味着插件给项目的许多方面定义了默认的值（如存放项目源文件的目录叫什么）。如果你在项目里遵从这些合约，你通常不需要在你的构建脚本里加入太多东西。如果你不想要或者是你不能遵循合约，`Gradle`允许你自己定制你的项目。

<br>**开始构建**
　　让我们来看一个简单的例子，先创建一个名为`HelloWorld`目录，然后创建`HelloWorld\build.gradle`，接着在`build.gradle`中加入下面的代码来使用Java插件：
``` gradle
// 我们可以使用“apply plugin: '插件名称'”的格式来引入一个插件。
apply plugin: 'java'
```
    语句解释：
    -  我们此时就可以直接运行“gradle -q build”命令了，其中build任务就是Java插件提供的。
    -  对于Java项目来说，它构建完成后最终会生成一个jar文件，里面包含了你创建的类。
    -  如果一切顺利，Java插件会在HellWorld目录创建一个名为“build”的目录，用来存放编译生成的文件。只不过由于我们目录下除了build.gradle外什么都没有，所以使用Java插件生成的jar里面不会有任何类文件。

<br>　　Java插件有如下几个默认的事情：

    -  从 src/main/java 搜索并编译你的Java源代码。
    -  从 src/test/java 搜索你的测试代码。
    -  任何在 src/main/resources 的文件都将被包含在 JAR 文件里。
    -  任何在 src/test/resources 的文件会被加入到 classpath 中以运行测试代码。
    -  所有的输出文件将会被创建在build里。如：JAR 文件 存放在 build/libs 文件夹里。

<br>　　我们接下来创建`HelloWorld\src\main\java\Demo1.java`，内容如下：
``` android
public class Demo1 {
    public static void main(String[] args) {
        System.out.println("Hello World from Java!");
    }
}
```
　　然后再执行`gradle -q build`，此时生成的jar里就会包含我们的`Demo1.class`了。 

　　在继续向下讲解之前，我们先插播个小的知识点。

<br>**Java插件有哪些构件任务？**
　　你可以使用`gradle tasks`来列出项目的所有任务（包括Java插件中的任务）。
　　虽然Java插件在你的项目里加入了许多任务，但通常你只会用到其中的一小部分任务。最常用的任务是`build`，它会构建你的项目，当你运行`gradle build`命令时，Gradle 将编译和测试你的代码, 并且创建一个包含类和资源的`JAR`文件。

　　其余一些有用的任务是：

    -  clean：删除build生成的目录和所有生成的文件。
    -  assemble：编译并打包你的代码，但是并不运行单元测试。
    -  check：编译并测试你的代码。

<br>**定制项目**
　　我们接着刚才的步骤，当我们生成出一个jar包之后，就可以执行它了，以此来验证这个包是否正确。 我们可以通过下面的代码来执行一个jar包：
``` gradle
java -jar ./build/libs/HelloWorld.jar
```
　　但是执行这条命令的时候，却得到一个错误：

    ./build/libs/HelloWorld.jar中没有主清单属性

　　问题出在，我们没有在`manifest`文件中配置`Jar`文件的`主类`。

　　Java插件给项目加入了一些属性，这些属性已经被定义了默认的值，已经足够来开始构建项目了。如果你认为不合适，改变它们的值也是很简单的。比如我们可以通过下面的代码来为`jar`设置主类：
``` gradle
apply plugin: 'java'

// 定义一个变量，保存主类的名称
def mainClassName = 'Demo1'

// 下面定义一个名为jar的方法，如果方法没有参数，则可以省写括号。
// jar方法里面包含要传给Java插件的参数，Java插件会自动来读取它们。
jar {
    manifest {
        attributes 'Main-Class': mainClassName , 'CustomAttributes': 'Hi Attributes'
    }
}
```
    语句解释：
    -  Main-Class属性就是用来指明主类的，由于我们的主类没有放到任何包里，所以本范例中直接写的类名。
    -  其中CustomAttributes是我们自定义的，对于manifest来说，任何自定义的属性都会被原样写到文件中。

<br>　　此时我们再执行一下`jar`包，就可以得到我们想要的结果了。

<br>
#### 外部的依赖 ####
　　在现实生活中，要创造一个没有任何`外部依赖`（使用外部`jar`）的应用程序并非不可能，但也是极具挑战的。这也是为什么依赖管理对于每个软件项目都是至关重要的一部分。

　　笔者推荐阅读：[《Gradle入门系列（3）：依赖管理》](http://blog.jobbole.com/72992/) ，本节中的大部分内容参考自该文章。

<br>**仓库**
　　本质上说，仓库是一种存放依赖的容器，每一个项目都具备一个或多个仓库。
　　类似于`Maven`的仓库，仓库可以被用来提取依赖，或者放入一个依赖，或者两者皆可。当`Gradle`需要引用依赖时就会自动去仓库中查找这个依赖（`jar`、`so`等都是依赖）。

　　Gradle支持以下仓库格式：

    -  Ivy仓库
    -  Maven仓库
    -  Flat directory仓库

<br>　　以`Maven`仓库为例，我们可以通过`URL`地址或本地文件系统地址，将`Maven`仓库加入到我们的构建中。如果想通过`URL`地址添加一个`Maven`仓库，我们可以将以下代码片段加入到`build.gradle`文件中：
``` gradle
repositories {
    maven {
        url "http://maven.petrikainulainen.net/repo"
    }
}
```

　　如果想通过本地文件系统地址添加一个`Maven`仓库，我们可以将以下代码片段加入到`build.gradle`文件中：
``` gradle
repositories {
    maven {       
        url "../maven-repo"
    }
}
```

<br>　　在加入`Maven`仓库时，`Gradle`提供了三种“别名”供我们使用，它们分别是：

    -  mavenCentral()别名，表示依赖是从Central Maven 2 仓库中获取的。
    -  jcenter()别名，表示依赖是从Bintary’s JCenter Maven 仓库中获取的。
    -  mavenLocal()别名，表示依赖是从本地的Maven仓库中获取的。

　　如果我们想要将`Central Maven 2`仓库加入到构建中，我们必须在`build.gradle`文件中加入以下代码片段：
``` gradle
repositories {
    mavenCentral()
}
```

<br>**配置中的依赖分类**
　　Gradle会对依赖进行分组，比如：编译Java时使用的是这组依赖，运行Java时又可以使用另一组依赖。我们把每一组依赖都称为一个`“DependencyGroup”`。

　　Java插件指定了若干依赖配置项，其描述如下：

    -  compile      配置项中包含的依赖在当前项目的源代码被编译时是必须的。
    -  runtime      配置项中包含的依赖在运行时是必须的。
    -  testCompile  配置项中包含的依赖在编译项目的测试代码时是必须的。
    -  testRuntime  配置项中包含的依赖在运行测试代码时是必须的。
    -  archives     配置项中包含项目生成的文件（如Jar文件）。
    -  default      配置项中包含运行时必须的依赖。

<br>**配置依赖**
　　一个外部依赖可以由以下属性指定：

    -  group属性指定依赖的分组（在Maven中，就是groupId）。
    -  name属性指定依赖的名称（在Maven中，就是artifactId）。
    -  version属性指定外部依赖的版本（在Maven中，就是version）。

　　我们假设我们需要指定以下依赖：

    -  依赖的分组是foo。
    -  依赖的名称是foo。
    -  依赖的版本是0.1。
    -  在项目编译时需要这些依赖。

　　我们可以将以下代码片段加入到`build.gradle`中，进行依赖声明：
``` gradle
dependencies {
    compile group: 'foo', name: 'foo', version: '0.1'
}
```
　　我们也可以采用一种快捷方式声明依赖：`[group]:[name]:[version]`。如果我们想用这种方式，我们可以将以下代码段加入到`build.gradle`中：
``` gradle
dependencies {
    compile 'foo:foo:0.1'
}
```

<br>
#### Pinyin4j ####
　　`Pinyin4j`是一个流行的Java库，支持中文字符和拼音之间的转换，拼音输出格式可以定制。

　　现在，继续完善我们之前的项目，在`build.gradle`文件中加入对`Pinyin4j`的依赖，在里面添加如下内容：
``` gradle
repositories {
    // Gradle会从Maven的中央仓库(http://search.maven.org/#browse)中查找依赖。
    mavenCentral()
}

dependencies {
    compile group: 'com.belerweb', name: 'pinyin4j', version: '2.5.0'
    testCompile group: 'junit', name: 'junit', version: '4.+'
}
```
　　然后，修改`Demo1`类的代码为：
``` java
import net.sourceforge.pinyin4j.*;
public class Demo1{
    public static void main(String[] args) {
        System.out.println("Hello World from Java!");

        // 由于汉字有不少多音字，因此返回值是一个String[]类型的。
        String[] pinyin = PinyinHelper.toHanyuPinyinStringArray('重');
        for(String item : pinyin){
            System.out.println(item);
        }
    }
}
```
　　然后编译并运行生成的`jar`文件，你可能会得到如下的一个异常：
``` java
Exception in thread "main" java.lang.NoClassDefFoundError: net/sourceforge/pinyi
n4j/PinyinHelper
        at Demo1.main(Demo1.java:6)
Caused by: java.lang.ClassNotFoundException: net.sourceforge.pinyin4j.PinyinHelp
er
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.misc.Launcher$AppClassLoader.loadClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        ... 1 more

```
　　抛出异常的原因是，当我们运行程序时，`Pinyin4j`的依赖在`classpath`中没有找到。
　　解决这个问题最简单的方式是创建一个所谓的`“胖”jar`文件，即把所有程序运行所需的依赖都打包到`jar`文件中去。
``` gradle
apply plugin: 'java'

// 定义一个变量，保存主类的名称
def mainClassName = 'Demo1'

// 下面是要传给Java插件的参数，Java插件会自动来读取它们。
jar {
    manifest {
        attributes 'Main-Class': mainClassName , 'CustomAttributes': 'Hi Attributes'
    }
    // 创建胖jar
    from { configurations.compile.collect { it.isDirectory() ? it : zipTree(it) } }
}

// 添加maven仓库。
repositories {
    mavenCentral()
}

// Gradle会对依赖进行分组，比如：编译Java时使用的是这组依赖，运行Java时又可以使用另一组依赖。
// 每一组依赖称为一个“DependencyGroup”。
dependencies {
    compile group: 'com.belerweb', name: 'pinyin4j', version: '2.5.0'
    testCompile group: 'junit', name: 'junit', version: '4.+'
}
```

### 构建多个项目 ###
　　在实际开发中，一个完整的项目可能是由一个根项目（root project）和若干个子项目（subject project）构成的。

　　要创建多`Project`的`Gradle`项目，我们首先需要在根中加入名为`settings.gradle`的配置文件，该文件应该包含各个子项目的名称。比如，我们有一个根项目名为`root-project`，它包含有两个子项目，名字分别为`sub-project1`和`sub-project2`，此时对应的文件目录结构如下：
``` c
root-project/
   sub-project1/
      build.gradle
   sub-project2/
      build.gradle
build.gradle
settings.gradle
```

　　根项目本身也有自己的`build.gradle`文件，同时它还拥有`settings.gradle`文件位于和`build.gradle`相同的目录下。此外，两个子项目也拥有它们自己的`build.gradle`文件。

<br>　　要将`sub-project1`和`sub-project2`加入到`root-project`中，我们需要在`settings.gradle`中加入：
``` gradle
include 'sub-project1', 'sub-project2'
```

<br>**通用配置**
　　在Gradle中，我们可以通过根项目的`allprojects()`方法将配置一次性地应用于所有的子项目，当然也包括定义Task。比如，在根项目的`build.gradle`中，我们可以做以下定义：
``` gradle
allprojects {
    repositories {
        jcenter()
    }
}
```

　　除了`allprojects()`之外，根项目还提供了`subprojects()`方法用于配置所有的子项目（不包含根项目）。


<br>**本节参考阅读：**
- [从零开始学习Gradle之一---初识Gradle](http://www.blogjava.net/wldandan/archive/2012/06/27/381605.html)
- [Gradle User Guide 中文版](http://dongchuan.gitbooks.io/gradle-user-guide-/content/index.html)
- [Gradle学习系列之八——构建多个Project](http://www.cnblogs.com/CloudTeng/p/3418425.html)


## Android应用 ##
　　从本节开始，我们将以Android项目为例，介绍`Gradle`相关的技术的用法。

　　经过前面章节的学习，我们再回过头去看网上那些教程，就能很好的理解了，其中写的比较好的（这个列表会不定期更新）有如下几个：

- [Android Studio系列教程四--Gradle基础](http://stormzhang.com/devtools/2014/12/18/android-studio-tutorial4/)
- [IDEA 及 Gradle 使用总结](http://www.jiechic.com/archives/the-idea-and-gradle-use-summary)

### build.gradle ###
　　本节介绍一下Android项目的`build.gradle`中的各种配置的含义。
``` gradle
// 使用android插件构建项目。
apply plugin: 'com.android.application'

// 创建一个名为android的方法，该方法由android插件调用。
android {
    // 项目的编译版本。
    compileSdkVersion 21
    buildToolsVersion "21.1.2"

    // 项目的基本信息，见名知意，也是不多说！
    defaultConfig {
        applicationId "com.cutler.helloworld"
        minSdkVersion 8
        targetSdkVersion 21
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            // 是否进行混淆
            minifyEnabled false
            // 混淆文件的位置。由这个文件来控制哪些代码需要混淆，哪些不需要。
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    // 设置module的libs目录为jar文件的查找目录。
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
```

### 从Eclipse迁移老项目 ###

　　既然是从Eclipse迁移老项目，那么我们首先要做的就是在`Android Studio`中配置`SVN`。

<br>**配置SVN**
　　`Android Studio`配`SVN`比普通IDE复杂点，它需要电脑里有独立的SVN客户端，我们可以到[ TortoiseSVN官网 ](http://tortoisesvn.net/downloads.html)上下载。
　　`Android Studio`会使用到`TortoiseSVN`的`“command line client tools”`，但是由于在安装`TortoiseSVN`时，默认是不安装这个工具的，因而即便是你已经安装了`TortoiseSVN`，仍然需要卸载了重新装。

<center>
![安装时，选择第一项即可](/img/android/android_o04_03.png)
</center>

　　安装完成后，执行如下步骤：

    -  首先，打开Android Studio，找到的 File > Settings > Version Control > Subversion。
    -  然后，在“Genneral”选项卡下，勾选“Use command line client”，并选择你svn的安装路径下的bin\svn.exe。
       -  比如：D:\workspace\programe\tortoiseSVN1.8.11\bin\svn.exe 。
    -  接着，点击ok即可。

　　如果你想从SVN上检出代码，可以这么做：点击`“VCS”`菜单，然后点击`“Checkout from Version Control > Subversion”`即可。

<br>**无痛将Eclipse项目导入Andriod Studio**
　　如果你导入的是一个Eclipse项目，那么`Android Studio`会自动将它转换成`Android Studio`项目。

　　具体会按照如下步骤执行：

    -  首先，点击“File > New > Import Project”。
    -  然后，选择转换后的项目，所要保存的路径。
    -  接着，保持默认设置，点击“Finish”。
    -  最后，等待Studio自己完成转换过程。

　　导入Eclipse格式的项目后，你可能会遇到`“Android Manifest doesn't exists or has incorrect root tag”`的错误，解决的方式是点击下图所示的按钮：

<center>
![Sync project with Gradle files](/img/android/android_o04_04.png)
</center>

　　如果你没有找到这个按钮，请参看 [Android Studio: Android Manifest doesn't exists or has incorrect root tag](http://stackoverflow.com/questions/17424135/android-studio-android-manifest-doesnt-exists-or-has-incorrect-root-tag) 。


　　如果你是通过向导来导入项目的，那么请选择下图所示的`Import project (Eclipse ADT, Gradle, etc.)`：

<center>
![](/img/android/android_o04_05.png)
</center>

<br>**快捷键设置**
　　在开发方面`Android Studio`确实是比`Eclipse`好用，但是之前使用`Eclipse`的时间还是比较长的，所以很多快捷键还是比较习惯`Eclipse`的，`Android Studio`的快捷键其实是可以设置成`Eclipse`的快捷键的，很方便。
　　更改的过程为：`File > Settings > Keymap`，然后将`Keymaps`的值设置为`Eclipse`即可。

　　如果你希望在`copy`一段代码到你的类中时，`Android Studio`能自动帮你导入对应的类，那么你可以参看下面这个网页：
　　[What is the shortcut to Auto import all in Android Studio?](http://stackoverflow.com/questions/16615038/what-is-the-shortcut-to-auto-import-all-in-android-studio)

<br>**修改Logcat字体颜色**
　　`Android Studio`的`Logcat`的字体颜色，默认全是黑色看着很不舒服，我们可以修改它：

    -  首先，File > Settings > Editor > Colors &Fonts > Android Logcat 。
    -  然后，就可以修改Verbose、Info、Debug、Warning、Error、Assert等选项了。
       -  第一，取消勾选 Inherit Attributes From 。
       -  第二，勾选Foreground前的复选框选上。
       -  第三，双击Foreground后面的框框去选择颜色了。

　　如果你对修改之后的`Logcat`的显示效果仍然不满意，那么可以使用我们前面一开始提到的`“Android Device Monitor”`窗口。

<br>**编译缓慢**
　　不出意外的话，我们在使用`Android Studio`时会感觉很卡，稍微干点什么事情就得等半天，导致卡的原因有如下两个：

    -  电脑软硬件问题。比如用的是32位的xp系统、内存容量不足、CPU型号老旧等。
    -  网络问题。Gradle在构建项目时会自动联网查找依赖，如果它访问的网站被墙或者你的网速缓慢，就会导致构建项目的时间变长。
    
　　在排除电脑操作系统、内存等问题之后，如果你使用`Android Studio`编译、运行一个`HelloWorld`程序仍然很慢（可能消耗几十秒），那么你可以按照下面的方法修改试试。

　　[点击阅读：Building and running app via Gradle and Android Studio is slower than via Eclipse](http://stackoverflow.com/questions/16775197/building-and-running-app-via-gradle-and-android-studio-is-slower-than-via-eclips)

　　笔者认为导致`Android Studio`卡的最主要原因就是网络问题，可以按照下图所示的操作，把`Offline work`勾上，即将`Gradle`切换到离线工作模式。

<center>
![](/img/android/android_o04_06.png)
</center>

　　当设置为离线模式后，在项目进行`build`时`Gradle`只会从本地查找依赖，若本地没有缓存过那个的库，则将会导致`build`失败。也就是说，之前`build`速度很慢，是因为`Gradle`去网上查找依赖了。

　　所以为了提高`build`的速度，有两个方法：

    -  配置一个靠谱的代理，让Gradle尽情的去网上查吧。
    -  每当build.gradle文件发生变化时，启用在线模式，把依赖下载到本地之后，再次启动离线模式。


<br>**本节参考阅读：**
- [Android Studio 关于SVN的相关配置简介](http://blog.csdn.net/zhouzme/article/details/22790395)
- [Android Studio 快捷键设置为Eclipse的快捷键](http://www.chenwg.com/android/android-studio%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%AE%BE%E7%BD%AE%E4%B8%BAeclipse%E7%9A%84%E5%BF%AB%E6%8D%B7%E9%94%AE.html)
- [Android Studio 如果修改LogCat的颜色，默认全是黑色看着挺不舒服的](http://blog.csdn.net/hotlinhao/article/details/9150519)

### 引入类库 ###
<br>　　前面也说了，实际开发中我们很难写出一个完全不引用第三方类库的项目，因此本节就介绍一下如何在`Android Studio`中引用各种第三方类库。

<br>**依赖本地jar文件**
　　首先，打开 [Chinese to Pinyin](http://sourceforge.net/projects/pinyin4j/files/) 将`Pinyin4j`的`jar`包下载到本地。
　　然后，把`jar`包放入到要使用这个`jar`的`Module`下的`libs`目录下。比如`MainProject\app\libs`。
　　接着，光把`pinyin4j-2.5.0.jar`添加到`libs`目录下还不够，还得再配置一下，即告诉`IDE`当前项目在编译的时候需要也同时编译这个`jar`包。 不过这个配置的过程我们可以省略屌，因为在`app`的`build.gradle`文件中默认就存在了下面的代码：
``` gradle
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
```
　　最后，必须得再点击下图所示的按钮，就可以正常使用它了：

<center>
![Sync project with Gradle files](/img/android/android_o04_04.png)
</center>

　　相当于让`Android Studio`重新更新一下项目。

<br>**依赖仓库中的jar文件**
　　就像前面说的那样，除了可以从本地添加依赖外，我们还可以直接从中央仓库中依赖一个`jar`包。
``` gradle
dependencies {
    compile 'com.belerweb:pinyin4j:2.5.0'
}
```
　　同样的，每次修改完毕`build.gradle`文件后，都要执行一下`Sync project with Gradle files`。

<br>**依赖项目的其他Moudle**
　　我们已经知道一个项目中包含若干个`Module`，可以通过修改项目根目录下的`settings.gradle`文件中的设置，来让编译时同时编译多个项目。但这只是编译过程，如果`ModuleA`想引用`ModuleB`中的类，那么还得需要在`ModuleA`的`build.gradle`文件中进行配置。

　　比如我们新建一个`Library Module`，步骤为：`File > New > New Module... > Android Library`，需要注意的是，此种方法创建出来的`Module`的`build.gradle`文件的内容有些不同：

    -  首先，编译的插件变成了com.android.library。
       -  普通Module的编译插件是com.android.application。
    -  然后，defaultConfig中没有applicationId属性。
       -  作为一个Library Module是不需要这个属性的，项目的包名应该由主Module设置。

　　创建完之后，还得在`主调Module`的`build.gradle`文件中引用`被调Module`，代码如下：
``` gradle
dependencies {
    // moduleb就是被调module的名字
    compile project(':moduleb')
}
```
　　配置完毕之后，就可以在`主调Module`中引用`moduleb`所提供的类了。
　　同样的，每次修改完毕`build.gradle`文件后，都要执行一下`Sync project with Gradle files`。


<br>**本节参考阅读：**
- [How to import android project as library and NOT compile it as apk (Android studio 1.0)](http://stackoverflow.com/questions/27536491/how-to-import-android-project-as-library-and-not-compile-it-as-apk-android-stud)

<br><br>