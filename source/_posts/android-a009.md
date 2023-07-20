---
title: 第九章 Framework篇
date: 2016-7-15 18:06:20
author: Cutler
categories: Android开发
---

# 第一节 Linux #
　　本章来介绍一下Linux系统基础知识，主旨是为大家日后深入学习Linux做铺垫。

## 基础入门 ##
### 为什么要学习Linux ###
　　Linux应用广泛，从嵌入式设备、服务器领域到超级电脑，它都发挥着相当重要的作用。

    -  在嵌入式领域，流行的TiVo数字视频录像机还采用了定制的Linux，思科在网络防火墙和路由器也使用了定制的Linux。Linux也用于舞台灯光控制系统，如WholeHogIII控制台。在智能手机、平板电脑等移动设备方面，基于Linux内核的Android操作系统已经成为当今全球最流行的智能手机操作系统。
    -  在服务器领域，根据2006年9月Netcraft的报告显示，十个最大型的网络托管公司有八个公司在其Web服务器运行Linux发行版。Linux发行版是构成LAMP（Linux操作系统，Apache，MySQL，Perl / PHP / Python）的重要部分，LAMP是一个常见的网站托管平台，在开发者中已经得到普及。

　　因此笔者可以毫不负责任的说，一个程序员如果对Linux一窍不通的话，是说不过去的，更何况我们还是Android程序员。

### Linux常识 ###
　　如果你想了解Linux历史的话，可以去看看[《Linux入门很简单》](http://download.csdn.net/detail/baokx/8435171)一书，同时给大家推荐一个Linux学习网站： [实验楼](https://www.shiyanlou.com/)。
<br>**发行版与内核**
　　刚开始接触Linux时你一定会看到`Linux发型版`和`Linux内核`这两个概念：

    1、操作系统内核，通俗地说就是操作系统最核心最关键的部件，它负责一些最基本的工作，比如：管理硬件驱动、管理内存、管理文件系统、管理进程等等；这些工作只要少了任何一样，整个操作系统都没法运转。
    2、操作系统都有"内核"的概念，即Linux 和 Windows 都有其内核。
    3、但如果你使用 Windows，通常感觉不到"内核"的存在。为啥捏？原因在于：微软是把 Windows 当作一个整体来发布的。对于普通用户而言，你拿到的是一个完整的操作系统，所以你感觉不到"内核"的存在。而 Linux 不同于其它操作系统的地方在于：Linus 领导的开源社区只负责开发内核，不开发其它的东西（比如：运行库、图形界面、应用软件等）。
    4、这就引出一个问题——光有一个赤裸裸的内核，用户是没法用的（就好比你光拿到一个汽车引擎，你是没法开车的）。为此，就有一大帮开源社区或商业公司，在这个裸露的内核外面，再包上一些东西（比如：运行库、应用软件）。经过这样包装之后，就成为"发行版"。为啥 Linux 的发行版如此之多捏？前面俺说了，Linux 内核是彻底开放的，随便什么阿猫阿狗都可以去 Linux 的官网下载到内核。于是，发行版自然就很多啦。

<br>**通用发行版 VS 专用发行版**

    1、所谓的"通用发行版"，顾名思义就是：这个发行版可以派上各种用场；反之，"专用发行版"是为特定用途设计，只能用于某些特定场合。
    2、通用发行版名气比较大的有：Debian（非常强调"自由"的开源理念，它有很多衍生的发行版，形成一个大家族。）、Fedora、Slackware等。
    3、面向客户端（桌面）的专用发行版名气比较大的有：Ubuntu Desktop（衍生自Debian）、Mageia等。Ubuntu Desktop以发布时间做版本号（比如13.10 就是2013年10月发布）。每半年发布一个版本。它的版本分两种：普通版本和长期支持版本（LTS）。LTS 会持续提供支持（补丁更新）长达几年（桌面版 3年，服务器版 5年），普通版本只支持9个月。
    4、面向服务端的专用发行版名气比较大的有：Red Hat Enterprise Linux（简称 RHEL）、CentOS（从 RHEL 衍生）、Ubuntu Server（从 Debian 衍生）等等。

<br>**Shell**

    Shell是一个用C语言编写的应用程序，它提供了一个用户界面，用户通过在这个界面输入命令来访问操作系统内核的服务。Linux下，很多工作都是通过命令完成的，学好Linux，首先要掌握常用Shell命令。
    为了防止重复编写代码，我们将一组Shell命令写在文件中，每次需要的时候就执行一下文件即可，这个文件就被称为Shell脚本。
    在UNIX/Linux中比较流行的Shell工具有bash，zsh，ksh，csh等等，Ubuntu终端默认使用的是bash。

<br>**内核版本**

    内核版本指的是在Linus领导下的开发小组开发出的系统内核的版本号，Linux的每个内核版本使用形式为x.y.zz-www的一组数字来表示。其中：
    -  x.y：为linux的主版本号。通常y若为奇数，表示此版本为测试版，系统会有较多bug，主要用途是提供给用户测试。
    -  zz：为次版本号。
    -  www：代表发行号（注意，它与发行版本号无关）。
    当内核功能有一个飞跃时，主版本号升级，如 Kernel2.2、2.6等。而内核增加了少量补丁时，常常会升级次版本号，如Kernel2.6.15等。

<br>**体系结构**

    Linux从内到外依次分为四个层次：
    -  Hardware层：各类硬件，如硬盘、CPU等。
    -  Kernel层：内核直接与硬件交互，并处理大部分较低层的任务，如内存管理、进程调度、文件管理等。
    -  Shell层：Shell是一个处理用户请求的工具，它负责解释用户输入的命令，调用Kernel层提供的功能。如cp、mv、cat和grep等。
    -  Application层：各类应用程序，如：DBMS、Mail、FTP。


<br>
**本节参考阅读：**
- [维基百科 - Linux](https://zh.wikipedia.org/wiki/Linux)
- [扫盲 Linux：如何选择发行版](https://program-think.blogspot.com/2013/10/linux-distributions-guide.html)
- [Linux入门教程](http://c.biancheng.net/cpp/linux/)

### 文件系统 ###
#### 分区与挂载 ####
　　与Windows一样，Linux中同样存在分区的概念，那么硬盘为什么要有分区呢？

    -  有利于管理，系统一般单独放一个区，这样由于系统区只放系统，其他区不会受到系统盘出现磁盘碎片的性能影响。
    -  如果一个分区出现逻辑损坏，仅损坏的分区而不是整个硬盘受影响。
    -  避免过大的日志或者其他文件占满导致整个计算机故障，将它们放在独立的分区，这样可能只有那一个分区出现空间耗尽。
    -  大硬盘搜索范围大，效率低。
    -  在运行Unix的多用户系统上，有可能需要防止用户的硬连结攻击。为了达到这个目的，/home和/tmp路径必须与如/var和/etc下的系统文件分开。

　　与Windows中每个分区对应一个盘（“C盘”、“D盘”）的情况不同，在Linux系统中普通用户是感觉不到分区的，Linux将整个文件系统看做一棵树，这棵树的树根叫做根文件系统，用“/”表示。
　　各个分区通过“挂载”（Mount）以文件夹的形式被放入到“/”下面。

    -  挂载是指将一个硬件设备（例如硬盘、U盘、光盘等）对应到一个已存在的目录上。 若要访问设备中的文件，必须将设备挂载到一个已存在的目录上， 然后通过访问这个目录来访问存储设备。


　　也就是说整个系统的所有文件，对于普通用户来说，都是放在“/”下的，“/”主要的目录有如下几个：

    /bin：存放操作系统运行所需要的可执行文件，所有用户都有权访问，例如：cat、ls、cp等命令。
    /boot：存放启动Linux时使用的一些核心文件，例如：kernal（系统内核）、initrd等。
    /dev：存放系统中的设备，从此目录可以访问各种系统设备，如磁盘驱动器，调制解调器，CPU，USB等。
    /etc：存放系统和应用软件的配置文件。
    /home：存放普通用户的个人文件。每个用户的主目录均在/home下以自己的用户名命名。
    /lib：存放/bin和/sbin中二进制文件所需要的库文件。
    /media：可移动设备的挂载点(如CD-ROM)。
    /mnt：临时挂载的文件系统。
    /opt：多数第三方软件默认安装到此位置，但并不是每个系统都会创建这个目录。
    /proc：虚拟文件系统，里面保存了内核和进程的状态信息，多为文本文件，可以直接查看。如/proc/cpuinfo保存了有关CPU的信息。
    /root：这是根用户的主目录。与保留给个人用户的/home下的目录很相似，该目录中还包含仅与根用户有关的条目。
    /sbin：root用户才能使用的系统二进制文件，例如： init、 ip、 mount等。
    /tmp：该目录用来保存临时文件，在系统重启时目录中文件不会被保留。
    /usr：用于存储只读用户数据的第二层次； 包含绝大多数的(多)用户工具和应用程序。
    /var：变量文件——在正常运行的系统中其内容不断变化的文件，如日志，脱机文件和临时电子邮件文件。有时是一个单独的分区。

<br>　　范例1：查看当前系统中的分区情况。
``` sh
# 使用df命令查看分区情况，-h参数表示以更容易阅读的方式显示结果，你可以去掉-h然后对比一下。
df -h

文件系统        容量  已用  可用 已用% 挂载点
udev           7.8G  4.0K  7.8G    1% /dev
tmpfs           1.6G  1.4M  1.6G    1% /run
/dev/sda3       883G  220G  619G   27% /
none            4.0K     0  4.0K    0% /sys/fs/cgroup
none            5.0M     0  5.0M    0% /run/lock
none            7.8G  108M  7.7G    2% /run/shm
none            100M   44K  100M    1% /run/user
/dev/sda1       496M   26M  471M    6% /boot/efi
```
    语句解释：
    -  分区（如U盘等）必须挂载到一个目录下才能使用。
    -  上面的第一列是分区的名称，对于不同的硬盘，分区的名称不一样：
       -  对于IDE硬盘，名称以hd为前缀，后面跟着盘号（a、b、c、d），还有分区号（1、2、3、4）。
       -  对于SCSI硬盘，名称以sd为前缀，其它与IDE相同。
<br>
**本节参考阅读：**
- [维基百科 - 硬盘分区](https://zh.wikipedia.org/wiki/%E7%A1%AC%E7%9B%98%E5%88%86%E5%8C%BA)
- [维基百科 - FHS](https://zh.wikipedia.org/wiki/%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E5%B1%82%E6%AC%A1%E7%BB%93%E6%9E%84%E6%A0%87%E5%87%86)

#### 文件与目录 ####
　　Linux中的所有数据都被保存在文件中，而且所有的文件被分配到不同的目录。
　　Linux有三种基本的文件类型：

    -  普通文件。普通文件是以字节为单位的数据流，包括文本文件、源码文件、可执行文件等。
    -  目录。相当于Windows和Mac OS中的文件夹。
    -  设备文件。Linux 与外部设备（例如光驱，打印机，终端，modern等）是通过一种被称为设备文件的文件来进行通信。Linux 和一个外部设备通讯之前，这个设备必须首先要有一个设备文件存在。
       -  设备文件和普通文件不一样，设备文件中并不包含任何数据，即0字节。
       -  设备文件有两种类型：字符设备文件和块设备文件。
       -  字符设备文件的类型是"c"（具体后述），字符设备文件向设备传送数据时，一次传送一个字符。典型的通过字符传送数据的设备有终端、打印机等。
       -  块设备文件的类型是"b"，块设备文件向设备传送数据时，先从内存中的buffer中读或写数据，而不是直接传送数据到物理磁盘。
       -  磁盘和CD-ROMS既可以使用字符设备文件也可以使用块设备文件。

<br>　　接下来介绍几个文件相关的常用Shell命令。

　　范例1：文件操作。
``` sh
# 使用mkdir命令，在当前目录下创建一个名为myDir的文件夹。
# 在mkdir命令后面跟随“-p”可以连父目录一起创建（如果不存在的话）。
mkdir myDir

# 使用cd命令，进入到myDir文件夹中。
cd myDir

# 使用touch命令创建文件，如果想同时创建多个，那多个文件名之间使用空格间隔。
touch b.txt c.txt

# 使用ls命令，列出当前文件夹下的所有文件。在ls命令后面跟随“-l”参数可以同时把文件的详细信息列出来。
ls

# 使用rm命令，删除文件。其中*是通配符，表示删除所有文件，但不能删文件夹。
rm *

# 使用pwd命令查看当前所处的目录。
pwd
```
    语句解释：
    -  上面只是简单的介绍了各个命令，一般情况下每个命令都可以接受若干个参数。
    -  比如若你想使用rm命令删除一个文件夹，可以使用“rm -r myDir”，其中-r会删除myDir以及其内的所有文件。
    -  各命令的语法就不细说了，网上很容易搜索到。

<br>　　范例2：查找命令。
``` sh
# 使用find命令查找文件，下面命令的含义：从当前目录下的test目录中查找后缀名为txt的文件。
# 其中-name参数用来告诉find命令按照文件名去查找，言外之意就是find命令还可以按照其它方式查找，比如文件权限等。
# 如果不指定查找的目录，则默认使用当前目录。
find test -name *.txt

# 使用grep命令查找文件里的内容，下面命令的含义：
# 从test目录下的所有txt文件中搜索Hello关键字。
grep Hello test/*.txt
```
    语句解释：
    -  find和grep命令有很多附加参数，这里没法一一介绍，各位请自行搜索。
    -  在grep命令后面加上-n参数可以把行号给列出来。

<br>　　范例3：复制、移动、重命名。
``` sh
# 使用cp命令复制文件，下面命令的含义：将当前目录下的b.txt复制到上一级目录中，并将复制过去的文件改名为bb.txt。
# 如果你想复制文件夹，可以在后面加一个-r参数。
cp b.txt ../bb.txt

# 使用mv命令移动文件。
mv b.txt ../
```
    语句解释：
    -  也可以用mv命令给文件和文件夹重命名，比如mv b.txt newb.txt。
    -  批量重命名可以使用rename命令，具体请自行搜索。

<br>　　范例4：查看与编辑。
``` sh
# 使用cat命令，可以把文件的全部内容给拿出来，使用-n参数可以加上行号。
cat -n result.txt

# 使用nl命令，也可以把文件全部内容给拿出来，但它在打印行号的功能上，比cat更专业。
# 这个命令有-b（设置是否给空行编号）和-n（设置行号的显示位置以及是否补0）两个参数，具体请自行搜索。
nl -n rz result.txt

# 使用more和less命令分页查看文件。
# 其中more命令打开文件后默认只显示一屏内容，可以使用Enter键向下滚动一行，使用Space键向下滚动一屏，按下h显示帮助，q退出。
more result.txt

# 使用head和tail命令，它们一个是只查看的头几行（默认为10行，不足10行则显示全部），另一个是只查看尾几行。
# 加上-n参数可以设置查看多少行。
# 关于tail命令，它有一个很牛的参数-f，这个参数可以实现不停地读取某个文件的内容并显示，这可让我们动态查看日志起到实时监视的作用。
head result.txt

# 使用file命令查看文件的类型。
file result.txt
```
    语句解释：
    -  cat不适合打开大文件（比如有成百上千行的文件），大文件推荐使用vim。

#### 用户及文件权限管理 ####
　　Linux 是一个可以实现多用户登陆的操作系统，比如“李雷”和“韩梅梅”都可以同时登陆同一台主机，他们共享一些主机的资源，但是由于 Linux 的 用户管理 和 权限机制 ，不同用户不可以轻易地查看、修改彼此的文件。
　　下面我们就来学习一下 Linux 下的账户管理的基础知识。

　　首先，来看看“用户”和“用户组”的概念：

    -  在Linux中，系统中默认就存在了很多用户（主要是系统用户），而且每个用户都有一个归属（用户组）。
    -  用户组简单地理解就是一组用户的集合，它们共享一些资源和权限，同时拥有私有资源。
    -  用户组就跟家的形式差不多，你的兄弟姐妹（不同的用户）属于同一个家（用户组），你们可以共同拥有这个家（共享资源），爸妈对待你们都一样（共享权限）。
    -  你偶尔写写日记，其他人未经允许不能查看（私有资源和权限）。
    -  当然一个用户是可以属于多个用户组的，正如你既属于家庭，又属于学校或公司。

<br>　　范例1：查看所有用户以及所有用户组。
``` sh
# cut是一个选取命令，主要用来截取字符串。下面代码的含义为：
# 依次检查/etc/passwd文件中的每一行，将行内的数据按照“:”字符拆分成若干组，然后把第1组给显示出来。
cut -d : -f 1 /etc/passwd

# 相应的如果想知道系统中当前有多少个用户组，则可以执行：
cut -d : -f 1 /etc/group
```

<br>　　范例2：查看当前用户。
``` sh
who am i

输出：
cutler   pts/0       2016-07-19 15:24 (:0)
```
    语句解释：
    -  输出的第一列表示打开当前伪终端的用户的用户名（要查看当前登录用户的用户名，去掉空格直接使用 whoami 即可）。
    -  第二列的 pts/0 中 pts 表示伪终端，你每打开一个终端就会产生一个伪终端， pts/0后面那个数字就表示打开的伪终端序号，你可以尝试再打开一个终端，然后在里面输入 who am i ，看第二列是不是就变成 pts/1 了。
    -  第三列则表示当前伪终端的启动时间。

<br>　　范例3：查看指定用户所在的用户组。
``` sh
groups cutler

输出：
cutler : cutler adm cdrom sudo dip plugdev lpadmin sambashare
```
    语句解释：
    -  其中冒号之前表示用户，后面表示该用户所属的用户组，可以看到cutler拥有8个用户组。
    -  每次新建用户如果不指定用户组的话，默认会自动创建一个与用户名相同的用户组。

<br>　　然后，来看看“root”用户的概念：

    -  在Linux系统里， root用户拥有整个系统至高无上的权利，比如添加/删除用户。所有对象它都可以操作，所以很多黑客在入侵系统的时候，都要把权限提升到root权限。
    -  另外在Android中获得root权限之后就意味着已经获得了手机的最高权限，这时候你可以对手机中的任何文件（包括系统文件）执行任意操作。
    -  我们一般登录系统时都是以普通账户的身份登录的，当需要执行root用户才能执行的操作时（比如创建用户），就要用到sudo这个命令了。
    -  不过使用这个命令有两个大前提，一是你要知道当前登录用户的密码，二是当前用户必须在sudo用户组。

<br>　　范例4：创建新用户。
``` sh
sudo adduser huye
```
    语句解释：
    -  使用adduser命令可以创建一个新用户。笔者当前登陆的用户是cutler，它并不是root用户，为了让cutler可以创建用户，就在adduser命令之前加上了sudo命令。
    -  接着按照提示给新用户设置密码，后面的选项的一些内容你可以选择直接回车使用默认值。
    -  adduser命令不但可以添加用户到系统，同时也会默认为新用户创建home目录。
       -  执行“ls /home”命令就可以看到。
    -  使用“su 用户名”可以切换用户，切换完之后就可以使用“whoami”命令来验证，还可以去测试新用户是否可以执行sudo命令。
    -  退出当前用户跟退出终端一样可以使用exit命令。

<br>　　范例5：给新用户添加sudo用户组。
``` sh
sudo usermod -G sudo huye

# 使用下面的命令可以删除用户。
# sudo deluser huye --remove-home
```
    语句解释：
    -  使用usermod命令可以为用户添加用户组，同样使用该命令你必需有root权限。
    -  你可以直接使用root用户为其它用户添加用户组，或者用其它已经在sudo用户组的用户使用sudo命令获取权限来执行该命令。
    -  然后再登陆到huye上后，就可以使用sudo命令了，而且通过“groups huye”命令也可以看到它已经被添加到sudo组里了。

<br>　　最后，我们来看看Linux文件权限相关的知识。

<br>　　范例6：查看文件的权限。
``` sh
# -l表示查看详细信息
ls -l

总用量 192
drwxrwxr-x 12 cutler cutler   4096  7月 14 11:35 a
-rw-rw-r--  1 cutler cutler   1562  6月 20 09:00 a.py
-rw-rw-r--  1 cutler cutler  33850  6月 15 19:19 cuihu_1.xlsx
-rw-rw-r--  1 cutler cutler 141824  6月 17 11:21 cuihu_2.xls
drwxrwxr-x  4 cutler cutler   4096  7月 14 11:39 jira384229
drwxrwxr-x  5 cutler cutler   4096  7月 14 14:15 monkeytest
```
    语句解释：
    -  命令输出了7部分内容，从左到右依次为：文件的类型和权限，链接数，所有者，所属用户组，文件大小，最后修改日期，文件名。

　　文件的类型和权限由10个字符组成，第一个字符表示文件的类型，’d‘表示目录，’-‘表示文件，具体如下图所示：

<center>
![](/img/android/android_base04_01.png)
</center>

　　图释：

    -  关于文件类型，这里有一点你必需时刻牢记Linux里面一切皆文件，正因为这一点才有了设备文件（ /dev 目录下有各种设备文件，大都跟具体的硬件设备相关）这一说。
    -  读权限，表示你可以使用 cat 之类的命令来读取某个文件的内容。
    -  写权限，表示你可以编辑和修改某个文件。
    -  执行权限，通常指可以运行的二进制程序文件或者脚本文件，如同 Windows 上的 'exe' 后缀的文件。
    -  你需要注意的一点是，一个目录要同时具有读权限和执行权限才可以打开，而一个目录要有写权限才允许在其中创建其它文件。


　　明白了文件权限的一些概念，我们顺带补充一下关于`ls`命令的一些其它常用的用法。

<br>　　范例7：`ls`命令。
``` sh
# 显示所有隐藏文件（Linux 下以 '.' 开头的文件为隐藏文件，Linux程序（包括Shell）通常使用隐藏文件来保存配置信息）。
ls -A

# 你也可以同时使用A和l参数。
ls -Al

# 显示文件的大小，单位kb。
ls -s

#显示所有文件的大小，并以普通人能看懂的方式呈现。
ls -AsSh
```
    语句解释：
    -  大S为按文件大小排序，h用来在文件大小后面加上单位。

<br>　　如果你有一个自己的文件不想被其他用户读、写、执行，那么就需要对文件的权限做修改，这里有两种方式。
　　范例8：修改文件的访问权限。
``` sh
# 方式一：二进制数字表示。

# 每个文件都有的三组权限（拥有者，所属用户组，其他用户，记住这个顺序是固定的）。
# 我们用3位二进制数字表示，对于"rwx"可以得到111，也就是一个十进制的'7'。
# 因此“rwx------”对应的数字权限就应该是700。
chmod 700 a.txt


# 方式二：加减赋值操作，自己查去。
```
    语句解释：
    -  使用chmod命令来修改文件的权限。
    -  你也可以使用chown命令修改文件的拥有者、使用chgrp命令修改所属用户组。

### 环境变量 ###
　　Linux中同样存在环境变量的概念，在介绍环境变量之前，我们先来看看自定义变量。

<br>　　范例1：自定义变量。
``` sh
# 打开Shell窗口，输入如下命令来定义一个变量，其中declare关键字可以省写。
declare cutler="huye"

# 打印出变量的值，echo用来执行打印操作，在变量名前面加个$符号就可以访问变量值。
echo $cutler
```
    语句解释：
    -  自定义变量的作用于仅限于当前Shell窗口，窗口关闭后或者在另一个窗口中，是访问不到cutler变量的。

<br>　　自定义变量属于Shell编程的范畴，想了解更多内容的话，请自行搜索。
　　Linux的环境变量配置网上也有很多教程（包括PATH变量的配置），笔者就不再冗述了，请自行搜索。

### 管道 ###
　　有时候，我们可以把两个命令连起来使用，一个命令的输出作为另一个命令的输入，这就叫做管道。为了建立管道，需要在两个命令之间使用竖线“|”连接。
　　管道是Linux进程之间一种重要的通信机制；除了管道，还有共享内存、消息队列、信号、套接字(socket) 等进程通信机制。

<br>　　范例1：使用管道。
``` sh
# 列出当前目录下包含“cutler”关键字的文件的信息。
ls -l | grep 'cutler'

# grep支持使用正则去匹配，下面的命令只会匹配最后一个o，因为$表示结尾。
echo "oh, Hello" | grep ".*o$"
```
    语句解释：
    -  管道使用竖线(|)将两个命令隔开，竖线左边命令的输出就会作为竖线右边命令的输入。连续使用竖线表示第一个命令的输出会作为第二个命令的输入，第二个命令的输出又会作为第三个命令的输入，依此类推。
    -  grep命令有很多选项：
       -  -v 反转查询，输出不匹配的行。
       -  -n 输出匹配的行以及行号。
       -  等等。

<br>　　范例2：awk和sort命令。
``` sh
# 首先获取出/etc/passwd文件的内容，然后把结果传给awk命令。
# 接着awk会依次对每一行进行处理，即以‘:’符为分隔符，拆分每一行字符串，并且将该行的第一个值给输出。
# 最后使用sort命令对awk的输出进行排序。
cat /etc/passwd | awk -F ':' '{print $1}' | sort
```
    语句解释：
    -  awk和sort命令还支持很多附加参数（比如sort可以按数字的大小排序等），详细情况请自行搜索。

<br>
**本节参考阅读：**
- [Linux管道和过滤器](http://c.biancheng.net/cpp/html/2732.html)


## Linux内核 ##
　　Linux内核主要的功能有：进程管理、内存管理、虚拟文件系统、设备控制、网络，每一个功能都涉及到大量的知识，本节只会介绍相关的理论，更深层的原理就需要靠各位自己了。

### 进程管理 ###

<br>**进程**

　　为什么要引入进程？

    -  在没有进程的系统中，程序的计算操作和IO操作必须顺序执行，即要么先执行IO操作，要么先执行计算操作，它们不能同时执行。
    -  引入进程后，可分别为计算程序和IO程序各建立一个进程，则这两个进程就可以并发执行。多个进程可以相互切换，当失去CPU的进程再次被调度的时候，会根据其PCB中的数据，还原程序现场。


　　进程通常由：程序、数据和进程控制块(PCB)组成。

    -  程序：就是代码，描述了进程需要完成的功能。
    -  数据：程序执行的所需要的数据及工作区。
    -  进程控制块：是进程存在的唯一标志。每一个进程均有一个PCB，在创建进程时，建立PCB，伴随进程运行的全过程，直到进程撤消而撤消。

　　进程PCB中保存的信息：

    -  进程标识符：用于唯一地标识一个进程，一个进程通常有两种标识符。
       -  内部标识符：操作系统分配给进程的唯一的数字ID，即PID（Process ID）。
       -  外部标识符：一个字符串，因为数字不便于记忆，所以每个进程除了数字外，还有一个字符串唯一标识。
    -  进程状态：可以是new、ready、running、waiting或 blocked等。
    -  进程调度信息：进程状态、进程优先级、进程调度的其他信息。
　　其中某些信息是会动态变化的，如进程的运行状态。

<br>**父进程 & 子进程**

    -  在Linux里，每个进程都有一个唯一标识自己的ID，即PID。
    -  除了进程0（即PID=0的进程）以外的所有进程都是由其他进程使用系统调用fork创建的。
    -  调用fork创建新进程的进程即为父进程，而相对应的，被创建出的进程则为子进程。
    -  因而除了进程0以外的进程都只有一个父进程，但一个进程可以有多个子进程。
    -  进程0是系统引导时创建的一个特殊进程，在其调用fork创建出一个子进程（即PID=1的进程1，又称init）后，进程0就转为交换进程（有时也被称为空闲进程），而进程1（init进程）就是系统里其他所有进程的祖先。

　　范例1：查看进程树。
``` shell
# 以树形结构来显示各个进程的继承关系。
pstree
```
    语句解释：
    -  从命令的输出结果可以看出，init是最顶层的进程。


<br>**进程的创建**

　　前面说过，Linux中的所有进程（除了0号进程）都是其父进程调用fork函数创建的。

　　除此之外，还有一些知识需要知道：

    -  子进程被创建时，除了执行必要的初始化外，系统还需要为它创建PCB以及分配PID。
    -  通常情况下，子进程的PID会在父进程的PID上+1，且PID的最大值是32767，当超过了这个上限后，PID就开始循环使用已闲置的小PID号。
    -  所谓的创建子进程，其实就是创建一个父进程的副本，把这个副本当做新进程来用，副本会复制父进程内存的内容、线程以及线程执行到的位置等。
    -  子进程创建完毕后，子进程和父进程就会各自独立的运行了，父进程会继续执行fork函数的下一条语句，由于子进程是完整复制父进程，所以子进程也会从fork函数的下一句执行。
    -  不同的是，父进程调用fork函数后，得到的返回值是子进程的PID，而子进程从fork函数中得到的返回值却是0。

<br>　　范例1：查看进程ID的取值范围。
``` shell
cat /proc/sys/kernel/pid_max
```

<br>**查看进程信息**

　　在Linux中最常用的进程管理命令莫过于ps和top了，它们二者都是用来查看进程信息的，但不同的是前者是静态的，后者会定时更新显示。

<center>
![](/img/android/android_base04_02.png)
</center>

    图释：
    -  上图显示的内容是top命令输出的。
    -  这两个命令的具体用法网上有很多，这里就不再冗述了，简单的说一下各列的含义为：
       -  第一列是进程id，第二列是进程的所有者，PR是进程优先级，NI是进程NICE值。
       -  S是进程的状态，%CPU是上次更新到现在的CPU时间占用百分比，COMMAND是进程的名称。

　　接下来会详细介绍上图中各列的含义。

<br>**进程的优先级**

　　Linux与其他系统一样，需要在多个进程之间共享CPU等资源，若某个进程占用了100%的CPU，那么其他进程将无法响应。

    -  如果运行的进程数大于CPU的数量，那么就得保证每个进程都能使用到CPU。
    -  通常的做法是，选择一个要执行的进程，并让它在短时间内运行（这个时间称为时间片），或者一直运行到它等待的事件（如IO）完成。
    -  选择哪个进程是有策略的，为了确保重要的进程能够得到CPU，这种选择是基于进程的优先级的。

<br>　　在Linux中，进程总共有140个优先级，按照等级可将进程划分为：实时进程和普通进程。

<center>
![](/img/android/android_base04_03.png)
</center>

    图释：
    -  数字越小，优先级越大，即0是最高优先级。
    -  实时进程默认使用0~99之间的优先级，普通进程则默认使用100~139之间的优先级。
    -  实时进程专门执行一些非常重要的任务，它要求系统必须尽快安排CPU等资源响应请求，特别在生产制造控制和军事领域。
    -  PR（priority）表示进程的优先级，它会受到Nice值（范围是-20~19）的影响，即PRI(new)=PRI(old)+NI。
    -  “Nice值”这个名称来自英文单词nice，意思为友好；Nice值越高，这个进程优先级也就越低，且越“友好、谦让”，就会让给其他进程越多的时间。
    -  在通常情况下，子进程会继承父进程的nice值，由于init进程会被赋予0，所以其子进程也是0。

<br>**时间片**

　　现代操作系统（如：Windows、Linux、Mac OS X等）允许同时运行多个进程（在听音乐的同时浏览网页）。

    -  通常系统中会同时运行好几十个进程，但PC是不可能同时装几十个CPU的。
    -  所以系统中的所有进程需要排队，依次去请求使用CPU，系统依据一定的策略，选中某个进程，然后让它使用一段时间CPU，这段时间就是时间片。
    -  这些进程“看起来像”同时运行的，实则是轮番穿插地运行，由于时间片通常很短（在Linux上为5ms－800ms），用户不会感觉到。


　　通常状况下，一个系统中所有的进程被分配到的时间片长短并不是相等的。

    -  系统通过测量进程处于“睡眠”和“正在运行”状态的时间长短来计算每个进程的交互性。
    -  交互性和每个进程预设的静态优先级（Nice值）的叠加即是动态优先级。
    -  动态优先级按比例缩放就是要分配给那个进程时间片的长短。
    -  一般地，为了获得较快的响应速度，交互性强的进程（即趋向于IO消耗型）被分配到的时间片要长于交互性弱的（趋向于处理器消耗型）进程。


<br>**进程的状态**

　　进程常见有如下几个状态：

    -  R：正在运行或者处于就绪状态（已经被加入到运行队列等待CPU中），同一时刻可能有多个进程处于此状态。
    -  S：可中断的睡眠状态（interruptible sleep），处于这个状态的进程因为等待某个事件的发生（比如等待socket连接、等待信号量）而被挂起。一般情况下，绝大多数进程都处于这个状态。
    -  D：不可中断的睡眠状态（uninterruptible sleep ），通常是在IO操作中（磁盘IO，网络IO等）。
    -  Z：僵尸进程。

<br>　　僵尸进程 & 孤儿进程：

    当一个子进程结束运行（一般是调用exit、运行时发生致命错误或收到终止信号所导致）时，子进程的退出状态（返回值）会回报给操作系统，系统则以SIGCHLD信号将子进程被结束的事件告知父进程，此时子进程的进程控制块（PCB）仍驻留在内存中。一般来说，收到SIGCHLD后，父进程会使用wait系统调用以获取子进程的退出状态，然后内核就可以从内存中释放已结束的子进程的PCB；而如若父进程没有这么做的话，子进程的PCB就会一直驻留在内存中，也即成为僵尸进程。
    孤儿进程则是指父进程结束后仍在运行的子进程。在类UNIX系统中，孤儿进程一般会被init进程所“收养”，成为init的子进程。因此解决僵尸进程的问题，可以通过杀死父进程来让僵尸成为孤儿，然后被init收养，最后被超度，极乐世界。


<br>
**本节参考阅读：**
- [百度百科 - PCB](http://baike.baidu.com/item/PCB/146397)
- [维基百科 - 父进程](https://zh.wikipedia.org/wiki/%E7%88%B6%E8%BF%9B%E7%A8%8B)
- [维基百科 - Nice值](https://zh.wikipedia.org/wiki/Nice%E5%80%BC)
- [维基百科 - 时间片](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%97%B4%E7%89%87)
- [进程优先级](http://gityuan.com/2015/10/01/process-priority/)
- [Linux内核学习笔记 - 进程的创建过程](http://blog.csdn.net/ddna/article/details/4958058)
- [Linux下进程的创建过程分析(_do_fork/do_fork详解)--Linux进程的管理与调度（八）](http://www.tqcto.com/article/framework/3286.html)
- [Linux process states](https://idea.popcount.org/2012-12-11-linux-process-states/)
- [Linux进程状态解析之R、S、D](http://os.51cto.com/art/201003/185722.htm)
- [Linux基础：进程管理](http://wuchong.me/blog/2014/07/24/linux-process-manage/)


### 内存管理 ###

<br>**问题起源**

　　特此声明：本小节主要参考自[《深入理解Linux中内存管理》](http://kb.cnblogs.com/page/180830/)，为了防止遗失，所以将其转载过来，有改动。


　　我们先来回顾一下历史：

    在早期的计算机中，程序是直接运行在物理内存上的，即程序在运行的过程中访问的都是物理地址。
    若系统同一时间只能运行一个程序，那么只要这个程序所需的内存不超过该机器的物理内存就不会出现问题，也就不需要考虑内存管理的事了。
    然而现在的系统都是支持多任务，多进程的，因为这样CPU以及其他硬件的利用率会更高，这个时候我们就要考虑到将系统内有限的物理内存如何及时有效的分配给多个程序了，这个事情本身我们就称之为内存管理。

　　这里举一个早期的计算机系统中，内存分配管理的例子，以便于大家理解：

    假如我们有A，B，C三个程序，它们运行时分别需要10M、100M、20M内存，而系统的内存只有128M。
    如果此时系统需要同时运行程序A和B，那么早期的内存管理过程会先将物理内存的前10M分配给A，接下来的10M-110M分配给B，这种内存管理的方法比较直接。
    显然按照现有的内存分配方法，程序C由于内存不够是不能够运行的。解决方法也有，就是交换，即当内存空间不够的时，可以将现有暂时不被执行的程序交换到磁盘空间上去，以给新程序腾出空间。


　　虽然找到了解决方案，但这种内存管理方案还是存在的三个比较明显的问题：
<br>　　**1、地址空间不能隔离**

    由于程序直接访问的是物理内存，这个时候程序所使用的内存空间不是隔离的。
    举个例子，就像上面说的A的地址空间是0-10M这个范围内，但是如果A中有一段代码是操作10M-128M这段地址空间内的数据，那么程序B和程序C就很可能会崩溃（每个程序都可以访问系统的整个地址空间）。
    这样很多恶意程序或者是木马程序可以轻而易举地破快其他的程序，系统的安全性也就得不到保障了，这对用户来说也是不能容忍的。


<br>　　**2、内存使用的效率低**

    上面说过，如果想让程序A、B、C同时运行，就得使用交换技术将程序暂时不用的数据写到磁盘上，在需要的时再读回内存。
    很显然当程序C要运行时，不能将A交换到磁盘上去，因为程序是需要连续的地址空间的，程序C需要20M的内存，而A只有10M的空间，那只有将B换出去了，因为B有100M空间。
    也就是说为了运行C，就需要将100M的数据从内存写到磁盘，然后在程序B需要运行时再从读回内存，
    我们知道IO操作比较耗时，所以这个过程效率将会十分低下。


<br>　　**3、程序运行的地址不能确定**

    程序每次需要运行时，都需要在内存中分配一块足够大的空闲区域，而问题是这个空闲的位置是不能确定的。
    假设有A、B、C三个任务，A和C都是10M，B是110M，且总内存为128M。
    先运行A和C，当B需要执行时，就会把C给拿出来，稍后当C需要执行时，系统就会把A拿出来，把C放到A的位置。
    由于在这种模式下，程序操作的都是物理地址（即绝对地址），那么当C被放到A的位置上时，就会有问题了，就需要执行地址重定向的操作。

<br>　　内存管理无非就是想办法解决上面三个问题。

　　这里引用一句不客观的名言：“计算机系统里的任何问题都可以靠引入一个中间层来解决”。

<br>**分页虚拟内存**

    为了解决上面的问题，最初是在程序和物理内存之间引入了进程和虚拟内存的概念。
    虚拟内存位于程序和物理内存之间，程序只能看见虚拟内存，再也不能直接访问物理内存。
    每个程序都有自己独立的进程地址空间，这样就做到了进程隔离。

<br>　　下图是虚拟内存的示例：

<center>
![](/img/android/android_base04_04.jpg)
</center>

    图释：
    每个程序都有其独立的虚拟的进程地址空间，上图程序A和B的虚拟地址空间都是从0x00000000开始的，即每个进程只需要记住自己的起始地址即可。地址映射的时候，由进程内的相对地址加上起始地址就可以得到物理地址，这个映射过程由硬件来完成。

　　根据程序的局部性运行原理：“一个程序在运行的过程当中，在某个时间段内，只有一小部分数据会被经常用到”，分页机制应运而生了：

    OS先将进程的虚拟内存空间分成若干个大小相等的片，每个片称为一页，每页都有个编号，从0开始。
    OS再将物理内存空间分成与页面相同大小的若干存储块，称为（物理）块或页框，同样从0开始编号。
    当OS在为进程分配内存时，将进程中的若干个页分别装入到多个可以不相邻接的物理块中即可，也就说分页机制可以将一个进程存储在若干不连续的存储空间中。
    
    同时每一页的大小不应该太大，若设置每页为1M的话，且进程的最后一页只用1k，那就浪费了999k，Linux中一般页的大小是4KB。

　　另外，系统将进程的每一页离散地分配到内存的多个页框中，应该保证能在内存中快速找到每个页面所对应的物理地址，页表的作用是实现从页号到物理块号的地址映射。

<center>
![](/img/base/base001_03.png)
</center>

　　这样一来，当需要将进程B载入内存且内存不足时，我们可以将进程A的某些页（不再是整个进程A了）交换到磁盘上，以此来为进程B腾出空间，当CPU交给进程A且进程A需要这些被交换出去的页的时候，Linux内核会产生一个缺页异常，然后异常管理程序会将其读到内存中。
<br>　　分页机制解决了“内存使用的效率低”的问题，但是在整个过程中，还有几个知识点要说一下。
<br>　　**MMU**

　　MMU是 Memory Management Unit 的缩写，负责虚拟地址映射为物理地址。

    当程序访问一个由虚拟地址表示的内存空间时，需要先经过若干次的内存访问，得到每一级页表中用于转换的页表项（页表是存放在内存里面的），才能完成映射。
    也就是说，要实现一次内存访问，实际上内存被访问了N+1次（N=页表级数），并且还需要做N次加法运算。
    所以，地址映射必须要有硬件支持，MMU（内存管理单元）就是这个硬件。
    并且需要有cache来保存页表，这个cache就是TLB（Translation lookaside buffer），尽管如此，地址映射还是有着不小的开销。
    假设cache的访存速度是内存的10倍，命中率是40%，页表有三级，那么平均一次虚拟地址访问大概就消耗了两次物理内存访问的时间。

<br>　　**交换技术**

　　将进程的内存换入换出到磁盘上的技术，就是swap技术：

    当物理内存不够用了，而又有新的程序请求分配内存，系统就会将其他程序暂时不用的数据交换到物理磁盘上(swap out)，等需要再读入(swap in)。
    这样做的坏处显而易见，换入换出的代价比较大，相比数据一直放在内存里面，多了读磁盘的操作，而磁盘IO代价。
    硬盘中的用作交换的部分被称为交换空间(Swap Space)，通常情况下，Swap空间应大于或等于物理内存的大小，是物理内存的2-2.5倍。
    如果是小的桌面系统，则只需要较小的Swap空间，而大的服务器系统则视情况不同需要不同大小。

<br>　　**OOM Killer**

　　Linux内存管理模块有一个 OverCommit 机制，意思是说，进程申请的内存可以大于当前系统free的内存。

    这是因为进程申请的内存不会马上就用到，且在进程的整个生命周期内，大概率是不会用完它申请的所有内存。
    进程申请的内存可以大于当前系统free的内存是可以在有限的物理内存上，为更多的进程服务。
    用小区宽带的例子来讲可能更容易懂一些，商家自己只有100M的带宽，正常情况下每人买10M，他只能卖给10个人，但是由于每个人并不会24小时都用满自己的10M带宽，所以商家把100M的带宽卖给了13个人也不会有问题。

　　但是与此同时也带来了一个风险：

    假设进程A最初申请了100M内存，但只用了20M，由于overcommit机制的存在，它剩余的80M被系统暂借给别的进程了。
    当它需要使用自己剩余的80M内存时，却因为系统中开满了进程，而导致系统也没有内存还给进程A了。
    在这种情况下，进程A甚至连一个page的内存都无法申请，于是oom killer就出现了。
    它会识别出来可以为整个系统作出牺牲的进程，然后杀掉它，释放出来一些内存。

　　提示：

    在Linux的内存分配机制中，进程被关闭后，其所占用的内存不会被立刻回收。
    而是用来做缓存使用，这样当该进程再次被开启时速度会变快。但当系统内存不足时，OOM Killer肯定是优先杀死缓存进程的。


<br>　　**kswapd0**

　　在Linux中有一个名为kswapd0的进程：

    它是虚拟内存管理中负责换页的，OS每过一定时间就会唤醒kswapd，看看内存是否紧张，如果不紧张则睡眠。
    在kswapd中有2个阀值，pages_hige和pages_low，当空闲内存页的数量低于pages_low的时候，kswapd进程就会扫描内存并且每次释放出32个free pages，直到free page的数量到达pages_high。
    也就是说，当kswapd进程占据大量cpu资源时，就意味着当前系统的内存开始不足了。

<br>
**本节参考阅读：**
- [深入理解Linux中内存管理](http://kb.cnblogs.com/page/180830/)
- [深入理解计算机系统-之-内存寻址（四）--linux中分段机制的实现方式](http://blog.csdn.net/gatieme/article/details/50651227)
- [调整linux内核尽量用内存，而不用swap](http://www.myjishu.com/?p=80)

# 第二节 Binder机制 #
　　本节开始我们将学习`Android Framework`中的东西，而首当其冲的就是`Binder`。

    正如其名“粘合剂”所喻，它是系统间各个组件的桥梁。
    理解Binder对于理解整个Android系统有着非常重要的作用，Android系统的四大组件，AMS，PMS等系统服务无一不与Binder挂钩。如果对Binder不甚了解，那么就很难了解这些系统机制，从而仅仅浮游于表面，要深入Android那么Binder是必须迈出的一步。
<!-- more -->
## 背景知识 ##
　　由于`Android`系统基于`Linux`内核，因此在正式介绍`Binder`机制之前，有必要了解相关知识。

<br>　　**进程隔离**

    在早期的计算机中，程序是直接运行在物理内存上的，程序访问的也都是物理地址，这个时候程序所使用的内存空间不是隔离的，这意味着程序A中代码可以操作程序B的内存，且每个程序都可以访问系统的整个地址空间，为了安全，就提出了进程隔离技术（不允许程序A读写程序B的内存）。

　　既然出现了进程隔离机制，那么当两个进程需要通信时，就需要另想办法了。

<br>　　**内核中转**

    在Linux中，虽然用户进程之间是相互独立的，但它们却是共享一份内核空间。
    系统的核心软件会运行在较高的特权级别上，它们驻留在被保护的内存空间上，拥有访问硬件设备的所有权限，Linux将此块内存称为内核空间。普通应用程序则运行在用户空间上，它们不能使用某些特定的系统功能，不能直接访问硬件，不能直接访问内核空间等。
    很显然，当一个用户进程想与另外一个用户进程进行通信时，就可以通过内核空间来完成了，即进程A发起请求给内核里的程序，内核里的程序再将请求转发给进程B，从而实现进程间通信。

<br>　　Binder就是这个负责转发消息的模块。
　　不过Binder机制并不是Linux内核的一部分，那它是怎么做到访问内核空间的呢？
 
    操作系统内核拥有最高的权限，它只负责最核心的功能，但实际应用中不可避免的有众多功能也需要运行在内核空间中，虽然这些功能本质上和内核的主要职责没有太大关系，但确实也是不可缺少的东西。
    按照以往的逻辑来看，操作系统将不得不将所有可能的预期功能直接编译到基本内核中，大部分功能将驻留在内存中而不被使用，从而浪费内存，并且需要用户在每次需要新功能时重建并重新启动基本内核。
    
    于是大多数当前的类Unix系统和Windows都支持不同名称的可加载内核模块（Loadable Kernel Module，LKM）。简单的说，我们把这些扩展功能封装成一个模块，可以在OS运行的时候动态加载到内核空间，模块同样享有最高权限，相应的也可以动态卸载这些模块。
    
    模块的特点有：
    -  模块是具有独立功能的程序，可以被单独编译，但不能独立运行。
    -  它在运行时被链接到内核作为内核的一部分在内核空间运行。
    
    很显然基于Linux的Android系统也支持LKM机制：
    这样一来Android系统就可以通过添加一个内核模块运行在内核空间，用户进程之间的通过这个模块作为桥梁来完成通信了。这个运行在内核空间的、负责各个用户进程通信的内核模块，就是我们要介绍的：Binder驱动。

　　既然`Linux`已经存在了很多通信机制，为什么还会有`Binder`机制？

    因为在移动设备上，Binder的传输效率和可操作性很好。
    -  Binder机制能够很好地实现Client-Server架构。
    -  Binder机制的安全性高。
       -  传统方式对于通信双方的身份并没有做出严格的验证，只有在上层协议上进行架设；
       -  比如Socket通信ip地址是客户端手动填入的，都可以进行伪造，而Binder机制从协议本身就支持对通信双方做身份校检，因而大大提升了安全性。

<br>**本节参考阅读：**
- [Android Binder机制(1):Binder架构分析](http://blog.imallen.wang/blog/2016/02/24/android-binderji-zhi-1-binderjia-gou-fen-xi/)
- [linux内核空间与用户空间信息交互方法](http://www.kerneltravel.net/jiaoliu/005.htm)
- [用户空间与内核空间，进程上下文与中断上下文总结](http://www.cnblogs.com/Anker/p/3269106.html)
- [Binder学习指南](http://weishu.me/2016/01/12/binder-index-for-newer/)

## Binder通信过程 ##
　　通信，无论是在两个进程之间，还是在人与人之间，一定会有一个“发起方”和一个“接收方”。

　　回想一下日常生活中我们通信的过程，A给B打电话时的流程为：

    首先，A和B要去营业厅办理手机卡，申请自己的电话号码。
    然后，两者互换电话号码。
    接着，A拨通B的号码，此时实际上电话先会打给通话中心，由通话中心进行转接。
    最后，通话中心接到A的请求时会先检测A提供的号码是否存在，只有存在才会帮忙转接。

　　我们看到，一次电话通信的过程除了通信的双方还有两个隐藏角色：“通话中心”和“通话中心的数据库”，Binder机制也是一样：

    两个运行在用户空间的进程要完成通信，必须借助内核的帮助，这个程序叫做Binder驱动，它的功能类似于通话中心，负责转接任务。而通话中心的数据库对应的就是一个叫做ServiceManager的东西（简称SM），用来记录当前系统中已经存在哪些服务，以便进行转接。

　　下图是Binder通信过程的示意图：
<center>
![](/img/android/android_BY_c01_01.jpg)
</center>

　　图释：

    首先，手机启动时SystemServer进程告诉Binder驱动程序它是Binder上下文管理者，即申请为SM。
    然后，驱动同意之后，SystemServer就开始负责管理整个系统的所有服务了，不过这时候系统中还没有任何服务，于是SystemServer就会依次启动各大服务。
       -  常见的有服务有TelephonyManager、ActivityManager、PackageManager、LocationManager等。除了系统服务外，我们也可以自定义自己的服务，然后将它注册到SM中，以此来实现进程间通信。
    接着，每个服务启动之后，都会向SystemServer进程中的SM报告，比如：
       -  我是zhangsan，如果有人要找我请返回0x1234。
       -  这样SM就建立了一张表，对应着各个Server的名字和地址。
    然后，当某个Client想与某个服务通信时，会首先询问SM，SM收到请求后会返回对应的联系方式。
    一般情况下Server、Client、SM是分别属于三个不同的进程，因此Client与SM以及Client与Server的通信，都会经过Binder驱动，驱动是整个通信过程的核心，但是做着最重要的工作。

<br>**本节参考阅读：**
- [Binder学习指南](http://weishu.me/2016/01/12/binder-index-for-newer/)

## Binder机制跨进程原理 ##

　　从上面我们知道了如下三点：

    -  通信过程的四个角色：Client、Server、Binder驱动、SM。
    -  Client在与Server通信之前，需要先和SM通信，来获取Server的通信地址。
    -  不论是Client与Server，还是Client与SM之间的通信，都需要经过Binder驱动来中转。

　　但是我们仍然不清楚当`Client`得到`Server`的地址之后，它到底是如何与`Server`完成通信的。

    -  答案就是：Binder驱动为我们做了一切。

　　接下来通过一个AIDL的实例来讲解Binder的通讯过程。

### 建立链接 ###

<br>　　首先新建一个项目，并在其内创建一个`IDAO.aidl`，内容如下：
``` java
// IDAO.aidl
package org.cutler.aidl;

interface IDAO {
    int add(int i,int j);
}
```

    语句解释：
    -  aidl的文件名必须和接口名一致。
    -  接口和方法前不能加访问权限修饰符和存在修饰符。如：public、static都不可以。
    -  如果你使用Eclipse开发，那么ADT会自动编译这个aidl文件，并为你生成一个IDAO.java文件。
    -  如果你使用的Android Studio开发，那么在创建文件的时候，选择File -> New -> AIDL即可。

<br>　　创建完毕后，SDK工具会依照`IDAO.aidl`来生成一个`IDAO.java`文件，它的内容如下所示：
``` java
public interface IDAO extends android.os.IInterface {

    public static abstract class Stub extends android.os.Binder 
            implements org.cutler.aidl.IDAO {
        // 省略若干代码。
        private static class Proxy implements org.cutler.aidl.IDAO {
            // 省略若干代码。
        }
    }

    public int add(int i, int j) throws android.os.RemoteException;
}
```
    语句解释：
    -  从上面代码可以看到，除了IDAO接口外还多出了3个新类：IInterface、IDAO.Stub、IDAO.Stub.Proxy，它们的作用稍后会介绍，此处暂且略过。

<br>　　接着，创建一个服务，并在它的`onBind()`方法被调用时，将返回一个`Binder`对象。
``` java
public class MyService extends Service {
    // 注意，此处继承的是IDAO.Stub类。
    private IBinder mBinder = new IDAO.Stub() {
        @Override
        public int add(int i, int j) throws RemoteException {
            return i + j;
        }
    };
    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }
}
```
    语句解释：
    -  在Android中，如果想让Service中的方法被其他进程调用，就必须在onBind方法中返回一个IBinder对象。
    -  IBinder是一个接口，其内定义了进程间通信所必需的共用方法，只有实现这些方法才能进行进程间通信。
    -  很显然，我们不知道如何实现IBinder接口里的方法，好在Android提供了现成的实现类，即Binder。
    -  也就是说，理论上只要返回一个Binder类的对象，那么我们的Service中的方法就可以被跨进程访问了。
    -  而IDAO.Stub类就继承了Binder类，除此之外它还实现了IDAO接口，所以本范例创建了一个该类对象并返回。

<br>　　然后，配置服务：
``` xml
<service
    android:name="com.cutler.myapplication.MyService"
    android:process=":remote" />
```
    语句解释：
    -  注意此处将MyService类配置到了“:remote”进程中运行。 

<br>　　客户端代码为：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        accessService();
    }

    IDAO dao ;
    public void accessService(){
        Intent  intent = new Intent(this, MyService.class);
        this.bindService(intent, new ServiceConnection(){
            public void onServiceConnected(ComponentName name, IBinder service) {
                dao = IDAO.Stub.asInterface(service);
                try {
                    System.out.println(dao.add(100, 200));
                } catch (RemoteException e) {
                    e.printStackTrace();
                }
            }
            public void onServiceDisconnected(ComponentName name) { }
        }, Context.BIND_AUTO_CREATE  );
    }
}
```
    语句解释：
    -  IDAO.Stub类里面定义了少量的辅助方法，其中asInterface方法可以将IBinder对象转型为IDAO对象。

<br>　　接着来看一下`IDAO.Stub`类的`asInterface`方法的源码：
``` java
public static org.cutler.aidl.IDAO asInterface(android.os.IBinder obj) {
    if ((obj == null)) {
        return null;
    }
    // 尝试获取IBinder的本地对象。
    android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
    if (((iin != null) && (iin instanceof org.cutler.aidl.IDAO))) {
        // 如果本地对象获取成功，则意味着客户端和服务端处在同一个进程，则直接返回本地对象。
        return ((org.cutler.aidl.IDAO) iin);
    }
    // 否则创建一个代理对象。
    // 因为既然是跨进程通信，那么在方法调用的时候，方法参数是不能直接传递到另一个进程的。
    // 所以我们在obj外面加一层Proxy类，由Proxy类对方法的参数和返回值进行处理。
    return new org.cutler.aidl.IDAO.Stub.Proxy(obj);
}
```
    语句解释：
    -  简单的说，这个方法就是检测MainActivity和MyService是否处在不同的进程中。
    -  如果两者在同一个进程中，则不涉及到IPC操作，此时的obj其实就是onBind方法的返回值，客户端可以直接用它来进行方法调用。
    -  若两者不再同一个进程，则此时的obj是BinderProxy类型的，系统为了让客户端能统一调用obj，所以在其外层封装一下，返回一个IDAO.Stub.Proxy对象。

### 分析实例 ###

<br>　　假设我们此时执行`dao.add(100, 200)`，整个程序的调用流程如下图所示：

<center>
![](/img/android/android_BY_c01_02.png)
</center>

<br>　　由于在我们上面的范例中，客户端和服务端在不同进程，所以当执行`dao.add(100, 200)`时，会先用`IDAO.Stub.Proxy`类的`add`方法：
``` java
private static class Proxy implements org.cutler.aidl.IDAO {
    private android.os.IBinder mRemote;

    Proxy(android.os.IBinder remote) {
        mRemote = remote;
    }

    @Override
    public android.os.IBinder asBinder() {
        return mRemote;
    }

    public java.lang.String getInterfaceDescriptor() {
        return DESCRIPTOR;
    }

    @Override
    public int add(int i, int j) throws android.os.RemoteException {
        android.os.Parcel _data = android.os.Parcel.obtain();
        android.os.Parcel _reply = android.os.Parcel.obtain();
        int _result;
        try {
            // 首先将参数i、j放到Parcel中，最终会传递给服务端的Service。
            _data.writeInterfaceToken(DESCRIPTOR);
            _data.writeInt(i);
            _data.writeInt(j);
            // 调用远程Service的add方法。
            mRemote.transact(Stub.TRANSACTION_add, _data, _reply, 0);
            // 读取返回值。
            _reply.readException();
            _result = _reply.readInt();
        } finally {
            _reply.recycle();
            _data.recycle();
        }
        return _result;
    }
}
```
    语句解释：
    -  从它的add代码可以看出来，IDAO.Stub.Proxy类的职责是将方法参数给封装起来，以便后续进行IPC。
    -  通过上面的分析，我们已经知道Proxy类的mRemote属性是由Stub的asInterface方法传递过来的。
    -  也就是说，上面第28行代码最终调用的其实是BinderProxy类的transact方法。

<br>　　于是整个调用过程变成了：

    -  首先，Client端通过IDAO.Stub.asInterface(service)获取到一个IDAO对象，并调用它的add方法。
    -  然后，真正被调用的其实是IDAO.Stub.Proxy类的add方法。
    -  接着，IDAO.Stub.Proxy类的add方法又调用了BinderProxy类的transact方法。
    -  最后，在BinderProxy类的transact方法中，会通过JNI去通知Binder驱动调用远程对象的add方法。

<br>　　我们来看一下`BinderProxy`的`transact`方法：
``` java
public boolean transact(int code, Parcel data, Parcel reply, int flags) throws RemoteException {
    Binder.checkParcel(this, code, data, "Unreasonably large binder buffer");
    return transactNative(code, data, reply, flags);
}
public native boolean transactNative(int code, Parcel data, Parcel reply,
        int flags) throws RemoteException;
```


<br>　　经过Binder驱动的中转之后，接下来的程序的流程就进入到Server端了：

    -  首先，程序流程从JNI层回到Java层时，服务端的Binder类的transact方法会被调用。
    -  然后，通过查看源码可知，在它的内部又会转调用它自己的onTransact方法。
    -  最后，由于Server端的本地对象是Stub，且它重写了Binder类的onTransact方法，所以接下来看它的源码。

<br>　　`Stub`类的`onTransact`的源码：
``` java
public boolean onTransact(int code, android.os.Parcel data, 
    android.os.Parcel reply, int flags) throws android.os.RemoteException {
    switch (code) {
        case INTERFACE_TRANSACTION: {
            reply.writeString(DESCRIPTOR);
            return true;
        }
        case TRANSACTION_add: {
            // 从Parcel中读取数据
            data.enforceInterface(DESCRIPTOR);
            int _arg0;
            _arg0 = data.readInt();
            int _arg1;
            _arg1 = data.readInt();
            // 调用自己的add方法
            int _result = this.add(_arg0, _arg1);
            // 将计算结果写到reply中，并返回。
            reply.writeNoException();
            reply.writeInt(_result);
            return true;
        }
    }
    return super.onTransact(code, data, reply, flags);
}
```
    语句解释：
    -  最后就是通过Binder类的onTransact方法来将计算结果返回到Client进程中了。

## ServiceManager ##
　　在上面提到了一个“通话中心的数据库”的概念，Android中是确实存在这样的一个类的：`ServiceManager`。

    -  需要注意的是，ServiceManager其实有两个实现：
       -  管理Java系统服务的ServiceManager
       -  管理本地系统服务的ServiceManager
    -  Java系统服务通过Java层的ServiceManager注册服务，本地系统服务通过C/C++层的ServiceManager注册服务，二者通过JNI连接在一起。

<br>　　如果你对`SM`的启动感兴趣，可以看看老罗的[ 这篇文章 ](http://blog.csdn.net/luoshengyang/article/details/6621566)。

<br>　　范例1：`android.os.ServiceManager`类。
``` java
/** @hide */
public final class ServiceManager {
    private static final String TAG = "ServiceManager";

    private static IServiceManager sServiceManager;
    private static HashMap<String, IBinder> sCache = new HashMap<String, IBinder>();

    private static IServiceManager getIServiceManager() {
        if (sServiceManager != null) {
            return sServiceManager;
        }

        // ServiceManagerNative类就相当于我们上面的IDAO.Stub类。
        // 这行代码的作用不用多说了吧？ 就是从IBinder中获取一个IServiceManager对象。
        // 由于可以肯定的是在进行跨进程，所以BinderInternal.getContextObject()的返回值就是BinderProxy类型的。
        sServiceManager = ServiceManagerNative.asInterface(BinderInternal.getContextObject());
        return sServiceManager;
    }

    public static IBinder getService(String name) {
        try {
            // 这段逻辑也很直白：先从缓存中查询远程服务的IBinder对象，如果没有则去跨进程查找。
            IBinder service = sCache.get(name);
            if (service != null) {
                return service;
            } else {
                return getIServiceManager().getService(name);
            }
        } catch (RemoteException e) {
            Log.e(TAG, "error in getService", e);
        }
        return null;
    }

    public static void addService(String name, IBinder service) {
        try {
            // 如你所见
            getIServiceManager().addService(name, service, false);
        } catch (RemoteException e) {
            Log.e(TAG, "error in addService", e);
        }
    }

    // 此处省略若干代码

}
```
    语句解释：
    -  大家可以打开ServiceManagerNative类看看，它的执行流程和我们之前说的是一致的。

<br>　　至于`ServiceManager`是何时被初始化的，大家可以自行寻找答案。

<br>**本节参考阅读：**
- [Android Binder机制(1):Binder架构分析](http://blog.imallen.wang/blog/2016/02/24/android-binderji-zhi-1-binderjia-gou-fen-xi/)


# 第三节 系统、进程、四大组件启动过程#

　　本节将从源码的角度来介绍一下操作系统、进程和四大组件的启动过程。本节第`3~6`小节主要参考[《Android开发艺术探索》](http://item.jd.com/1710650057.html)。

　　在开始讲解知识之前，笔者有下面四点要说：

    -  第一，本文只分析Java层的代码，不包含C++层的代码。
    -  第二，请各位一定要跟随笔者描述的步骤去看一遍源码，否则阅读本文时会朦胧。
    -  第三，由于篇幅有限以及阅读方便，本文中列出的源码都是笔者简化后的，请自行查看完整源码。
    -  第四，如果您之前没接触过Framework层的话，那么本文您至少需要读两遍。

<!-- more -->
## 系统的启动 ##
　　`Android`是基于`Linux`的开源操作系统，它的启动过程与`Linux`有很多相似的地方。

　　本节就来介绍一下它的启动过程。
### 基础入门 ###
　　当你按下电源开关后，Android设备执行了如下图所示的几个步骤：

<center>
![](/img/android/android_BY_c02_02.jpg)
</center>

<br>　　我们按照上图的顺序，看一下前四个操作：

    首先，Android设备上电后，会先启动ROM，并寻找Bootloader代码，将它加载到内存。
    然后，执行Bootloader，然后再找到Linux内核代码，并将它加载到内存。
    接着，启动Linux内核，即初始化各种软硬件环境，加载驱动程序，挂载根文件系统。
    最后，由内核启动init进程，它是整个系统第一个启动的进程，也是所有进程的父进程。
    -  需要知道的是，init进程是Android启动过程中最核心的程序。
    -  Android系统以及各大Linux的发行版，内核部分启动过程都是差不多的，区别就在于init进程的不同。
    -  因为init进程决定了系统在启动过程中，究竟会启动哪些守护进程和服务，以及呈现出怎样的UI界面。

<br>　　其实前三步没什么好说的，我们只关注第四步中提到的`init`进程，它主要做了如下三件事：

    第一，是挂载目录，比如挂载/sys、/dev等目录。
    第二，运行init.rc脚本，一系列的Android服务在这时被启动起来。
    -  这一步是最重要的，因为系统所有的功能都是依赖这些服务来完成的。比如拨打电话，使用WIFI等等。
    -  只要这些服务都能正常地启动起来并且正常工作，整个Android系统也就完成了自己的启动。
    第三，在设备的屏幕上显示出“Android”logo了。

<br>　　事实上`init`进程启动的服务，可以划分为两类：一类是`本地服务`，另一类是`Android服务`。

<br>　　**本地服务**

    本地服务是指运行在C++层的系统守护进程，它又分为两部分：
    -  一部分是init进程直接启动的，如ueventd、servicemanager、debuggerd、rild、mediaserver等。
    -  另一部分是由本地服务进一步创建的，如mediaserver服务会启动AudioFlinger等本地服务。
    注意，每一个由init直接启动的本地服务都是一个独立的Linux进程，我们通过adb shell命令查看本地进程。

<br>　　**Android服务**

    Android服务是指运行在Dalvik虚拟机进程中的服务。init进程会创建Zygote进程，它是第一个Android进程，所有后续的Android应用程序都是由它fork出来的。

### Zygote进程 ###

　　我们都知道，每一个App其实都是：

    一个单独的dalvik虚拟机、一个单独的进程
　　为了实现资源共用和更快的启动速度，系统使用如下方式来开启新进程：

    每当要为App启动新进程时，都会fork（拷贝）一下zygote进程，并把fork出来的新进程做为App进程。也就是说其他应用所在的进程都是Zygote的子进程。这就是将Zygote进程称为“受精卵”的原因，因为它确实和受精卵一样，能快速的分裂，并且产生遗传物质一样的细胞！

<br>　　既然`Zygote`进程这么重要，那么我们就来看看它是如何被系统启动的。

<br>　　我们忽略`C++`层的代码，系统最开始调用的`Java`层代码是`ZygoteInit.main()`方法：
``` java
public static void main(String argv[]) {
    try {
        // 此处省略若干代码。

        // 在加载首个zygote的时候，会传入初始化参数，使得startSystemServer = true
        boolean startSystemServer = false;
        String socketName = "zygote";
        String abiList = null;
        for (int i = 1; i < argv.length; i++) {
            if ("start-system-server".equals(argv[i])) {
                startSystemServer = true;
            } else if (argv[i].startsWith(ABI_LIST_ARG)) {
                abiList = argv[i].substring(ABI_LIST_ARG.length());
            } else if (argv[i].startsWith(SOCKET_NAME_ARG)) {
                socketName = argv[i].substring(SOCKET_NAME_ARG.length());
            } else {
                throw new RuntimeException("Unknown command line argument: " + argv[i]);
            }
        }

        // 此处省略若干代码。

        // 创建一个Socket的服务端，以便外界可以通过Socket技术来给当前Zygote进程发送数据。
        registerZygoteSocket(socketName);

        // 此处省略若干代码。

        // 启动一些系统服务。
        if (startSystemServer) {
            // 在操作系统中通常会提供一些公共的功能，让系统中的所有App共同访问，比如：
            // ActivityManagerService（简称AMS）、PackageManagerService、WindowManagerService等。
            // 如果你没见过它们也没关系，暂时只需要知道它们都是公有的类就可以了，它们的功能稍后会介绍。
            // 既然是共用的，那么它们就应该存在一个单独的进程中，这样每个APP进程就可以通过IPC方式访问它们了。
            // 这个单独的进程是确实存在的，名字就叫SystemServer，上面的三个类都是运行在SystemServer进程中的。

            // 下面这行代码就是用来启动SystemServer进程的。
            startSystemServer(abiList, socketName);
        }

        // 此处省略若干代码。

        // 执行一个死循环，不断的监听是否有人给自己发数据。
        runSelectLoop(abiList);
        // 关闭Socket。
        closeServerSocket();
    } catch (MethodAndArgsCaller caller) {
        caller.run();
    } catch (RuntimeException ex) {
        Log.e(TAG, "Zygote died with exception", ex);
        closeServerSocket();
        throw ex;
    }
}
```
    语句解释：
    -  从上面的代码可以看到，当Zygote进程启动的时候，会先执行一些初始化操作，并调用startSystemServer方法创建服务。
    -  然后，它就开始进行无限的循环中了，循环监听Socket。

<br>　　我们接着来看看`Zygote`进程在`startSystemServer`方法中是如何启动`SystemServer`进程的：
``` java
private static boolean startSystemServer(String abiList, String socketName)
        throws MethodAndArgsCaller, RuntimeException {

    // 此处省略若干代码。

    String args[] = {
        "--setuid=1000",
        "--setgid=1000",
    "--setgroups=1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1018,1021,1032,3001,3002,3003,3006,3007",
        "--capabilities=" + capabilities + "," + capabilities,
        "--nice-name=system_server",
        "--runtime-args",
        "com.android.server.SystemServer",
    };
    ZygoteConnection.Arguments parsedArgs = null;
    int pid;

    try {
        parsedArgs = new ZygoteConnection.Arguments(args);
        ZygoteConnection.applyDebuggerSystemProperty(parsedArgs);
        ZygoteConnection.applyInvokeWithSystemProperty(parsedArgs);

        // 在forkSystemServer方法内部会调用本地方法，执行fork进程的操作。
        pid = Zygote.forkSystemServer(
                parsedArgs.uid, parsedArgs.gid,
                parsedArgs.gids,
                parsedArgs.debugFlags,
                null,
                parsedArgs.permittedCapabilities,
                parsedArgs.effectiveCapabilities);
    } catch (IllegalArgumentException ex) {
        throw new RuntimeException(ex);
    }

    // 笔者猜测，系统在fork Zygote进程时，是完完整整的拷贝。
    // 也就是说，fork进程不光会拷贝进程的空间，还会拷贝进程的当前方法调用栈。
    // 换句话说，下面这个if代码，在Zygote进程以及Zygote的子进程都会执行。
    // 但是只有Zygote的子进程中，变量pid的值才是0，即只有子进程会执行下面的if里的代码。
    // 而Zygote进程会直接返回true，然后进入到我们前面说的那个无限循环里去，继续监听Socket了。
    if (pid == 0) {
        if (hasSecondZygote(abiList)) {
            waitForSecondaryZygote(socketName);
        }

        // 子进程会接着执行下面的方法，注意它的参数parsedArgs，其实是对args的封装。
        // 而args的最后一个元素的值是：com.android.server.SystemServer，我们稍后会用到它。
        handleSystemServerProcess(parsedArgs);
    }

    return true;
}
```
    语句解释：
    -  虽然从上面代码中可以看到fork了SystemServer进程，但是并没有看到AMS等类被初始化。
    -  那么它们是在何时初始化的呢？ 别着急，马上就告诉你。


<br>　　接着来看`handleSystemServerProcess`方法的源码：
``` java
private static void handleSystemServerProcess(
        ZygoteConnection.Arguments parsedArgs)
        throws ZygoteInit.MethodAndArgsCaller {

    // 还记得Zygote进程一开始打开的那个Socket服务端吗？
    // 由于SystemServer进程并不需要那个功能，所以下面的代码就是用来把Socket给关掉的。
    closeServerSocket();

    // 此处省略若干代码。

    // 继续调用其他方法，执行初始化操作。
    RuntimeInit.zygoteInit(parsedArgs.targetSdkVersion, parsedArgs.remainingArgs, cl);

    // 此处省略若干代码。

    /* should never reach here */
}
```
    语句解释：
    -  第7行代码的出现，能从侧面证明，笔者在上面的猜测应该是对的。

<br>　　那么我们来看一下`RuntimeInit`的`zygoteInit`的方法：
``` java
public static final void zygoteInit(int targetSdkVersion, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {
    if (DEBUG) Slog.d(TAG, "RuntimeInit: Starting application from zygote");

    Trace.traceBegin(Trace.TRACE_TAG_ACTIVITY_MANAGER, "RuntimeInit");
    redirectLogStreams();

    // 执行Java层的初始化操作，比如设置异常捕获器Thread.setDefaultUncaughtExceptionHandler等。
    commonInit();
    // 执行C++层的初始化操作，比如初始化Binder对象，便于以后进行IPC操作。
    nativeZygoteInit();
    // 应用程序相关的初始化，比如虚拟机相关、Target SDK版本等等。
    applicationInit(targetSdkVersion, argv, classLoader);
}

private static void applicationInit(int targetSdkVersion, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码

    VMRuntime.getRuntime().setTargetHeapUtilization(0.75f);
    VMRuntime.getRuntime().setTargetSdkVersion(targetSdkVersion);

    // 此处省略若干代码

    // 执行进程的入口函数，其实就是调用SystemServer的main方法。
    invokeStaticMain(args.startClass, args.startArgs, classLoader);
}
```
    语句解释：
    -  上面第27行代码中的args.startClass其实就是之前我们提到的com.android.server.SystemServer。

<br>　　接着来看一下`invokeStaticMain`方法，其实在该方法中使用了一个小技巧：
``` java
private static void invokeStaticMain(String className, String[] argv, ClassLoader classLoader)
        throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码
    Class<?> cl = Class.forName(className, true, classLoader);

    // 此处省略若干代码
    Method m = cl.getMethod("main", new Class[] { String[].class });

    // 此处省略若干代码

    /*
     * This throw gets caught in ZygoteInit.main(), which responds
     * by invoking the exception's run() method. This arrangement
     * clears up all the stack frames that were required in setting
     * up the process.
     */
    throw new ZygoteInit.MethodAndArgsCaller(m, argv);
}
```
    语句解释：
    -  在方法的最后抛出一个异常，并把m放到了异常中。
    -  这个异常最终会被ZygoteInit.main方法捕获，然后再去调用SystemServer类的main函数。
    -  为什么要这样做呢？注释里面已经讲得很清楚了，它是为了清理堆栈的，这样就会让SystemServer类的main函数觉得自己是进程的入口函数，而事实上，在执行它之前已经做了大量的工作了。

<br>　　我们看看`ZygoteInit.main`函数在捕获到这个异常的时候做了什么事：
``` java
// 此处省略若干代码

try {
    // 此处省略若干代码
} catch (MethodAndArgsCaller caller) {
    caller.run();
} catch (RuntimeException ex) {
    Log.e(TAG, "Zygote died with exception", ex);
    closeServerSocket();
    throw ex;
}

// 此处省略若干代码
```
    语句解释：
    -  直接调用了MethodAndArgsCaller的run方法，而run方法里的内容也就不言而喻了。
    -  至此应该可以彻底证实笔者的猜测了：系统在fork Zygote进程时，是完完整整的拷贝，不光会拷贝进程的空间，还会拷贝进程的当前方法调用栈。

<br>　　既然程序的流程走到了`SystemServer.main`方法中，那么我就来看看它的源码：
``` java
public static void main(String[] args) {
    new SystemServer().run();
}
private void run() {
    // 此处省略若干代码。

    // Create the system service manager.
    mSystemServiceManager = new SystemServiceManager(mSystemContext);
    LocalServices.addService(SystemServiceManager.class, mSystemServiceManager);

    // Start services.
    try {
        // 初始化AMS、PMS等类。
        startBootstrapServices();
        startCoreServices();
        // 初始化WMS等类。
        startOtherServices();
    } catch (Throwable ex) {
        Slog.e("System", "******************************************");
        Slog.e("System", "************ Failure starting system services", ex);
        throw ex;
    }

    // 此处省略若干代码。

    // 开启轮询。
    Looper.loop();
    throw new RuntimeException("Main thread loop unexpectedly exited");
}
```
    语句解释：
    -  可以看到，SystemServer初始化完各类服务之后，自己也通过Looper进入无限循环了。

<br>　　至此，整个开机流程算是简单的过了一遍了。

<br>**本节参考阅读：**
- [【凯子哥带你学Framework】Activity启动过程全解析](http://blog.csdn.net/zhaokaiqiang1992/article/details/49428287)
- [Android内核开发：图解Android系统的启动过程](http://ticktick.blog.51cto.com/823160/1659473)


## 进程的启动 ##

<br>**初识AMS**

　　当手机开机时，操作系统会分别在`C/C++`和`java`层中启动很多服务。

　　其中就有一个`Java`层的组件，它运行在`SystemServer`进程里的，名为`ActivityManagerService`（简称`AMS`）。

    AMS有很多功能，后面我们会一一介绍，此处会涉及到它其中一个功能，就是为Android应用程序创建新的进程。即当用户请求启动四大组件时，系统会先检测该组件所在的进程是否已经启动。如果没有启动，则就会调用AMS去创建一个新的进程，然后在这个新的进程中启动该组件。


<br>　　当`AMS`需要启动新的进程时，会调用自己的`startProcessLocked`方法（至于该方法是被谁调用的，后面再说）：
``` java
private final void startProcessLocked(ProcessRecord app, String hostingType,
        String hostingNameStr, String abiOverride, String entryPoint, String[] entryPointArgs) {

    // 此处省略若干代码。

    int uid = app.uid;
    int[] gids = null;

    // 此处省略若干代码。

    if (entryPoint == null) entryPoint = "android.app.ActivityThread";

    // 此处省略若干代码。

    Process.ProcessStartResult startResult = Process.start(entryPoint,
        app.processName, uid, uid, gids, debugFlags, mountExternal,
        app.info.targetSdkVersion, app.info.seinfo, requiredAbi, instructionSet,
        app.info.dataDir, entryPointArgs);

    // 此处省略若干代码。
}
```
    语句解释：
    -  首先，startProcessLocked方法执行了一些操作之后，转调用了Process.start函数去创建进程。
    -  需要注意的是，此时传递给Process.start方法的第一个参数的值是android.app.ActivityThread。
       -  ActivityThread是用户进程初始化时要加载的入口Java类，而且它就是我们常说的主线程，具体后述。

<br>　　在`Process`的`start`方法内部，又经历了如下几个调用：

    调用了Process的startViaZygote方法。
    调用了Process的openZygoteSocketIfNeeded方法，并在该方法中打开一个连接到Zygote进程的Socket。
    调用了Process的zygoteSendArgsAndGetResult方法，并将一些参数写入到刚才打开的那个Socket中。

<br>　　这样一来，程序的流程就从`SystemServer`进程中的`AMS`中转到了`Zygote`进程中了。

　　前面已经说了，这个`Socket`由`ZygoteInit`类的`runSelectLoopMode`函数侦听：
``` java
private static void runSelectLoop(String abiList) throws MethodAndArgsCaller {
    ArrayList<FileDescriptor> fds = new ArrayList<FileDescriptor>();
    ArrayList<ZygoteConnection> peers = new ArrayList<ZygoteConnection>();

    fds.add(sServerSocket.getFileDescriptor());
    peers.add(null);

    while (true) {
        // 此处省略若干代码。

        for (int i = pollFds.length - 1; i >= 0; --i) {
            if ((pollFds[i].revents & POLLIN) == 0) {
                continue;
            }
            if (i == 0) {
                ZygoteConnection newPeer = acceptCommandPeer(abiList);
                peers.add(newPeer);
                fds.add(newPeer.getFileDesciptor());
            } else {
                // 使用peers.get(i)得到的是一个ZygoteConnection对象，表示一个Socket连接。
                // 接着调用它的runOnce方法，从Socket中读取数据。
                boolean done = peers.get(i).runOnce();

                // 此处省略若干代码。
            }
        }

        // 此处省略若干代码。
    }
}
```
    语句解释：
    -  因此，接下来就是调用ZygoteConnection.runOnce方法进一步处理了。

<br>　　接着看一下`runOnce`方法的代码：
``` java
boolean runOnce() throws ZygoteInit.MethodAndArgsCaller {

    // 此处省略若干代码

    // 执行创建进程的操作
    pid = Zygote.forkAndSpecialize(parsedArgs.uid, parsedArgs.gid, parsedArgs.gids,
            parsedArgs.debugFlags, rlimits, parsedArgs.mountExternal, parsedArgs.seInfo,
            parsedArgs.niceName, fdsToClose, parsedArgs.instructionSet,
            parsedArgs.appDataDir);

    // 此处省略若干代码

    try {
        if (pid == 0) {
            // in child
            IoUtils.closeQuietly(serverPipeFd);
            serverPipeFd = null;
            handleChildProc(parsedArgs, descriptors, childPipeFd, newStderr);

            // should never get here, the child is expected to either
            // throw ZygoteInit.MethodAndArgsCaller or exec().
            return true;
        } else {
            // in parent...pid of < 0 means failure
            IoUtils.closeQuietly(childPipeFd);
            childPipeFd = null;
            return handleParentProc(pid, descriptors, serverPipeFd, parsedArgs);
        }
    } finally {
        IoUtils.closeQuietly(childPipeFd);
        IoUtils.closeQuietly(serverPipeFd);
    }
}
```
    语句解释：
    -  有Linux开发经验的读者从forkAndSpecialize方法的名字就能看出它会创建一个进程。
    -  这个方法有两个返回值，一个是在当前进程中返回的，一个是在新创建的子进程中返回。
    -  在当前进程中的返回值就是新创建的子进程的pid值，而在子进程中的返回值是0，就跟之前一样，此时Zygote进程会继续监听Socket，而子进程则继续往下执行。
    -  我们沿着子进程的执行路径继续看下去，看到了在handleChildProc方法中又调用了RuntimeInit.zygoteInit方法。

<br>　　在第一节中，我们已经分析过`RuntimeInit`的`zygoteInit`方法了，它会抛出异常并被`main`方法捕获，此处就不再冗述。

　　经历了一番干柴烈火，程序流程终于走到了我们的主线程`ActivityThread`类中了：
``` java
public static void main(String[] args) {
    // 此处省略若干代码

    // 在当前线程中创建Looper对象。
    Looper.prepareMainLooper();

    ActivityThread thread = new ActivityThread();
    thread.attach(false);

    if (sMainThreadHandler == null) {
        sMainThreadHandler = thread.getHandler();
    }

    // 此处省略若干代码

    // 启动Looper，此后主线程只在消息队列里处理消息了。
    Looper.loop();

    // 此处省略若干代码
}
```
    语句解释：
    -  需要知道的是，ActivityThread本身并不是一个线程，在它内部有一个Handler类型的mH属性，用来接收外界传来的消息。
    -  这个mH属性就是使用的上面第5行代码所创建的Looper对象。
    -  通过观察可以发现，mH属性是实例的，这意味着只有在程序执行上面第7行代码时，mH才会被创建，而Looper对象是在第5行代码就创建，所以不会有问题。

<br>　　进程启动过程的源代码，我们就先分析到这里，更多的步骤咱们以后再慢慢谈。

　　最后请记住：

    -  我们的App、AMS以及zygote进程分属于三个独立的进程。
    -  App与AMS通过Binder进行IPC通信，AMS(在SystemServer进程中)与zygote通过Socket进行IPC通信。

<br>**本节参考阅读：**
- [Android应用程序进程启动过程的源代码分析](http://blog.csdn.net/luoshengyang/article/details/6747696)

## Activity的启动 ##

　　既然要介绍Activity的启动流程，那么肯定要从`startActivity`方法开始了。

　　在开始之前需要知道两点：

    第一，startActivity方法最初是在Context类定义的，但在Activity类中对它进行了重写。
    第二，在Activity中提供了好几个startActivity方法重载，不过它们最终都会调用startActivityForResult方法。

<br>　　因此，我们就直接来看看`startActivityForResult`的源码：
``` java
public void startActivityForResult(Intent intent, int requestCode, @Nullable Bundle options) {
    // 如果当前Activity不是ActivityGroup的子Activity的话，则执行if里的代码。
    // 我们以前常用ActivityGroup来实现Tab切换界面，它在API level 13中被废弃了，具体请自行搜索。
    // 所以我们接下来只关心if里面的代码。
    if (mParent == null) {
        // 下面的代码会调用Instrumentation的execStartActivity方法执行启动任务。
        // 至于Instrumentation是什么，稍后介绍。
        Instrumentation.ActivityResult ar = mInstrumentation.execStartActivity(
                this, mMainThread.getApplicationThread(), mToken, this,
                intent, requestCode, options);

        // 此处省略若干代码。
    } else {
        if (options != null) {
            mParent.startActivityFromChild(this, intent, requestCode, options);
        } else {
            mParent.startActivityFromChild(this, intent, requestCode);
        }
    }
}
```
    语句解释：
    -  需要注意的是第9行中的“mMainThread.getApplicationThread()”：
       -  其中mMainThread就是我们的主线程ActivityThread，进程中的每个Activity对象都会持有它的引用。
       -  它的getApplicationThread方法返回的是一个IBinder对象。
    -  你可能会疑惑，我们为何要注意这个参数呢？这是因为在startActivity这个操作中，会经历一系列方法调用，并且最终会跑到AMS的进程中去执行（因为启动Activity并不是简单的创建个对象就行的，它还涉及到很多事物要处理，但遵循“单一职责”的原则每个类都只管一件事，所以只能跳来跳去）。
       -  但是无论如何，实例化Activity对象的任务最终还是由我们的进程完成的，这一些列的方法调用只是为了通知系统各个地方，我们要启动Activity了，最终执行启动还是我们自己。
       -  就像刚才说的，在这个过程中程序会跨进程进入到AMS中执行，那么“有去就得有回”才行。
       -  所以，这个IBinder对象就是我们抛给AMS的一个IPC回调接口。
       -  当AMS处理完毕所有的事情后，就通过这个IBinder对象来给我们发通知，我们去执行后续操作。

### Instrumentation ###

　　上面的代码提到了`Instrumentation`，在`Framework`层混的好汉们，谁人不知道这个类？因此必须得介绍一下它。

    Instrumentation翻译为仪器、仪表，用于在应用程序中进行“测量”和“管理”工作。
    Instrumentation将在进程启动的最开始时执行初始化（稍后详述），可以通过它监测Activity里的所有交互。

　　总之它有很多用途，而这里我们只介绍它与Activity相关的功能：

    一个Activity的创建、暂停、恢复操作，最终都会调用Instrumentation的方法来实现，如：
    -  创建时，会调用callActivityOnCreate 
    -  暂停时，会调用callActivityOnPause
    -  恢复时，会调用callActivityOnResume
    而且一个进程中只有一个Instrumentation实例对象，就保存在ActivityThread中，且每个Activity都持有此对象的引用。

<br>　　接着来看一下`Instrumentation`的`execStartActivity`方法：
``` java
public ActivityResult execStartActivity(
        Context who, IBinder contextThread, IBinder token, Activity target,
        Intent intent, int requestCode, Bundle options) {

    // 此处省略若干代码。

    // 此时将IBinder类型转换为IApplicationThread类型的了。
    // 其实这个IBinder对象就是ActivityThread的内部类ApplicationThread的对象。
    // 而该类就实现了IApplicationThread接口，所以可以顺利转换。
    // 看不懂这段描述也没关系，我稍后会详细介绍ApplicationThread。
    IApplicationThread whoThread = (IApplicationThread) contextThread;

    // 此处省略若干代码。

    // 调用ActivityManagerNative去执行启动Activity，并将其返回值保存到result中。
    int result = ActivityManagerNative.getDefault()
        .startActivity(whoThread, who.getBasePackageName(), intent,
                intent.resolveTypeIfNeeded(who.getContentResolver()),
                token, target != null ? target.mEmbeddedID : null,
                requestCode, 0, null, options);

    // 检测result的值。
    checkStartActivityResult(result, intent);

    return null;
}

public static void checkStartActivityResult(int res, Object intent) {
    // 如果启动成功，则直接返回。
    if (res >= ActivityManager.START_SUCCESS) {
        return;
    }
    
    switch (res) {
        // 如果无法从Intent中解析出要启动的Activity，或者找不到该Activity，则就报错。
        case ActivityManager.START_INTENT_NOT_RESOLVED:
        case ActivityManager.START_CLASS_NOT_FOUND:
            if (intent instanceof Intent && ((Intent)intent).getComponent() != null)
                throw new ActivityNotFoundException(
                        "Unable to find explicit activity class "
                        + ((Intent)intent).getComponent().toShortString()
                        + "; have you declared this activity in your AndroidManifest.xml?");
            throw new ActivityNotFoundException(
                    "No Activity found to handle " + intent);

        // 此处省略若干代码。
    }
}
```
    语句解释：
    -  在checkStartActivityResult方法中我们看见了这个久违的异常。

### ActivityManager ###

　　先来看一下`ActivityManagerNative.java`的源码：
``` java
// ActivityManagerNative是一个抽象类。
public abstract class ActivityManagerNative 
    extends Binder implements IActivityManager{
}

// 代理类
class ActivityManagerProxy implements IActivityManager{}
```
    语句解释：
    -  通过面的学习，我们可以得到如下对应关系：
       -  IActivityManager与IDAO对应。
       -  ActivityManagerNative与IDAO.Stub对应。
       -  ActivityManagerProxy与IDAO.Stub.Proxy对应。
    -  另外，在IActivityManager里面定义各种操作三大组件（不包括内容提供者）的方法，同时AMS、AMN、AMP都实现这个接口。

<br>　　接着上文，此时程序调用`ActivityManagerNative.getDefault`获取单例对象，源码如下：
``` java
static public IActivityManager getDefault() {
    return gDefault.get();
}

// Singleton类用来定义一个单例对象。
private static final Singleton<IActivityManager> gDefault = new Singleton<IActivityManager>() {
    protected IActivityManager create() {

        // 从SM中查询出AMS的IBinder对象。
        IBinder b = ServiceManager.getService("activity");

        // 此处省略若干代码。

        // 使用IBinder对象创建一个IActivityManager的实现类
        IActivityManager am = asInterface(b);
 
        // 此处省略若干代码。

        return am;
    }
};

static public IActivityManager asInterface(IBinder obj) {
    if (obj == null) {
        return null;
    }

    // 在Binder机制中，若client和server在同一进程中，那么Binder驱动会将server端的Binder对象直接传给client。
    // 但如果二者不在同一个进程中，那么Binder驱动就会为server端的Binder对象创建一个影子对象。
    // 这个影子对象就是BinderProxy类型的。

    // 下面的代码通过调用IBinder接口的queryLocalInterface方法，尝试获取IActivityManager对象。
    // 如果obj对象是BinderProxy类型的话，in的值将为null。
    IActivityManager in =
        (IActivityManager)obj.queryLocalInterface(descriptor);
    if (in != null) {
        return in;
    }

    // 也就是说，如果obj对象是BinderProxy类型的话，就会使用obj去创建一个代理对象。
    return new ActivityManagerProxy(obj);
}
```
    语句解释：
    -  很显然，由于AMS是在SystemServer进程中的，所以最终获得到的对象是ActivityManagerProxy类型的。
    -  这意味着“ActivityManagerNative.getDefault().startActivity”调用的将是ActivityManagerProxy的方法。


<br>　　然后，来看看调用`ActivityManagerProxy.startActivity`方法的代码：
``` java
// 注意第一个参数的类型变成了IApplicationThread
public int startActivity(IApplicationThread caller, String callingPackage, Intent intent,
        String resolvedType, IBinder resultTo, String resultWho, int requestCode,
        int startFlags, ProfilerInfo profilerInfo, Bundle options) throws RemoteException {

    // 第一步，把参数放到Parcel中，准备发给远程进程。
    Parcel data = Parcel.obtain();
    Parcel reply = Parcel.obtain();
    // 将我们的Binder对象传递给AMS，当AMS处理完一切后，就使用它通知我们。
    data.writeStrongBinder(caller != null ? caller.asBinder() : null);

    // 此处省略若干代码。

    // 第二步，调用mRemote的transact方法，将参数传递到AMS进程中，并获取其返回值。
    // 其中ActivityManagerProxy类的mRemote属性是由刚才说的那个asInterface方法传递过来的。
    // 也就是说，最终将会调用BinderProxy的transact，执行跨进程通信的操作。
    mRemote.transact(START_ACTIVITY_TRANSACTION, data, reply, 0);
    reply.readException();

    // 第三步，将返回值返回，并回收Parcel所占用的资源。
    int result = reply.readInt();
    reply.recycle();
    data.recycle();
    return result;
}
```
    语句解释：
    -  在上面我们看过了类似的代码，这里不再重复解释。


<br>　　然后又经历了下面一番调用：

    首先，经过Binder驱动的中转，在client端对BinderProxy.transact方法的调用会转给AMS的transact方法。
    然后，由于AMS并没有重写transact方法，所以调用了它的父类ActivityManagerNative的transact方法。
    但是，由于ActivityManagerNative也没有重写，所以最终调用了Binder类的transact方法。

<br>　　那我们来看看`Binder`类的`transact`方法：
``` java
public final boolean transact(int code, Parcel data, Parcel reply,
        int flags) throws RemoteException {
    if (false) Log.v("Binder", "Transact: " + code + " to " + this);
    if (data != null) {
        data.setDataPosition(0);
    }
    boolean r = onTransact(code, data, reply, flags);
    if (reply != null) {
        reply.setDataPosition(0);
    }
    return r;
}
```
    语句解释：
    -  显而易见，程序会调用onTransact方法。
    -  这次AMS重写了这个方法，它做了一些操作后，又调用了父类ActivityManagerNative的onTransact方法。

<br>　　好吧，再去看看`ActivityManagerNative`的`onTransact`方法：
``` java
public boolean onTransact(int code, Parcel data, Parcel reply, int flags)
        throws RemoteException {
    switch (code) {
    case START_ACTIVITY_TRANSACTION:
    {
        data.enforceInterface(IActivityManager.descriptor);

        // 将我们的Binder接口读取出来。
        IBinder b = data.readStrongBinder();
        IApplicationThread app = ApplicationThreadNative.asInterface(b);
        String callingPackage = data.readString();
        Intent intent = Intent.CREATOR.createFromParcel(data);
        String resolvedType = data.readString();
        IBinder resultTo = data.readStrongBinder();
        String resultWho = data.readString();
        int requestCode = data.readInt();
        int startFlags = data.readInt();
        ProfilerInfo profilerInfo = data.readInt() != 0
                ? ProfilerInfo.CREATOR.createFromParcel(data) : null;
        Bundle options = data.readInt() != 0
                ? Bundle.CREATOR.createFromParcel(data) : null;

        // 调用当前对象的startActivity方法，并把我们的Binder对象传递过去。
        int result = startActivity(app, callingPackage, intent, resolvedType,
                resultTo, resultWho, requestCode, startFlags, profilerInfo, options);
        reply.writeNoException();
        reply.writeInt(result);
        return true;
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  由于当前对象其实就是AMS，所以最终会调用AMS的startActivity方法。

<br>　　然后在`AMS`的`startActivity`中又经历了如下调用：

    -  接着调用了ActivityManagerService的startActivityAsUser方法。
    -  接着调用了ActivityStackSupervisor的startActivityMayWait方法。
    -  接着调用了ActivityStackSupervisor的startActivityLocked方法。
    -  接着调用了ActivityStackSupervisor的startActivityUncheckedLocked方法。
    -  接着调用了ActivityStack的resumeTopActivityLocked方法。
    -  接着调用了ActivityStack的resumeTopActivityInnerLocked方法。
    -  接着调用了ActivityStackSupervisor的startSpecificActivityLocked方法。
    -  接着调用了ActivityStackSupervisor的realStartActivityLocked方法。

<br>　　我们来看一下`realStartActivityLocked`方法的源码：
``` java
final boolean realStartActivityLocked(ActivityRecord r,
        ProcessRecord app, boolean andResume, boolean checkConfig)
        throws RemoteException {

    // 此处省略若干代码。

    app.thread.scheduleLaunchActivity(new Intent(r.intent), r.appToken,
            System.identityHashCode(r), r.info, new Configuration(mService.mConfiguration),
            new Configuration(stack.mOverrideConfig), r.compat, r.launchedFromPackage,
            task.voiceInteractor, app.repProcState, r.icicle, r.persistentState, results,
            newIntents, !andResume, mService.isNextTransitionForward(), profilerInfo);

    // 此处省略若干代码。

    return true;
}
```
    语句解释：
    -  其中app.thread是类型的IApplicationThread，它就是我们从自己的进程中传递过来的回调。
    -  从上面可以看出，当AMS处理完所有事情后，就会调用app.thread来将程序的执行流程交回给我们。

<br>　　接下来打开`ApplicationThread`类的`scheduleLaunchActivity`方法，它又进行了如下调用：

    -  接着调用ActivityThread类的sendMessage方法，给ActivityThread的mH发送消息，消息的类型为H.LAUNCH_ACTIVITY。
    -  接着调用ActivityThread类的handleLaunchActivity方法。
    -  接着调用ActivityThread类的performLaunchActivity方法。

<br>　　咱们来看看这个`performLaunchActivity`方法：
``` java
private Activity performLaunchActivity(ActivityClientRecord r, Intent customIntent) {

    // 此处省略若干代码。

    // 首先从ActivityClientRecord中获取待启动的Activity的组件信息。
    ComponentName component = r.intent.getComponent();

    // 此处省略若干代码。

    // 然后调用Instrumentation类的newActivity方法，创建Activity类的对象。
    java.lang.ClassLoader cl = r.packageInfo.getClassLoader();
    activity = mInstrumentation.newActivity(
            cl, component.getClassName(), r.intent);

    // 此处省略若干代码。

    // 接着调用了LoadedApk类的makeApplication方法创建Application对象（如果需要的话）。
    Application app = r.packageInfo.makeApplication(false, mInstrumentation);

    // 此处省略若干代码。

    // 接着调用Activity的attach方法，执行初始化操作。
    // 注意，此时ActivityThread会把自己的引用、自己的Instrumentation属性的引用传递给新Activity对象。
    // 这也就解释了，之前笔者说的整个进程中所有Activity共用一个Instrumentation对象的说法。
    // 同时也说明了，Activity的mMainThread属性就是指向的ActivityThread对象。
    activity.attach(appContext, this, getInstrumentation(), r.token,
            r.ident, app, r.intent, r.activityInfo, title, r.parent,
            r.embeddedID, r.lastNonConfigurationInstances, config,
            r.referrer, r.voiceInteractor);

    // 此处省略若干代码。

    return activity;
}
```
    语句解释：
    -  注释写的很清楚了，也是不多说。
    -  至于Activity的attach方法里面什么写什么代码，可以自己去看看。

<br>**本节参考阅读：**
- [Android Activity.startActivity流程简介](http://www.kancloud.cn/digest/androidframeworks/127785)


## Service ##
　　我们知道`Service`有两种启动方式，接下来就分别介绍它们的具体执行流程。

### 普通启动 ###
　　当在`Activity`中调用`startService`方法时，程序执行的其实是`ContextWrapper`类的方法。

　　该方法的源码为：
``` java
public ComponentName startService(Intent service) {
    return mBase.startService(service);
}
```

<br>　　在继续向下讲解之前，需要先了解一下`Context`类的继承关系，如下图所示：

<center>
![](/img/android/android_BY_c02_01.jpg)
</center>

　　图释：

    首先要知道的是，Context是一个抽象类没法实例化对象，所以我们开发时用到的Context对象都是它子类的对象。
    然后从图上可以看出，Context有很多子类，其中比较常见的是ContextImpl和ContextWrapper。
    -  创建Activity时，需要传递给它一个Context对象，而这个对象就是ContextImpl类型的。
    -  而ContextWrapper之所以常见，就是因为它是Application、Service以及Activity的父类。
    -  提示：Activity的直接父类是ContextThemeWrapper。

<br>　　既然上面说`Activity`所持有的`Context`其实是`ContextImpl`类的对象，那么就用源码来证明：

    -  就像我们知道的那样，当启动Activity时，最终会调用ActivityThread的performLaunchActivity方法执行创建。在该方法中会依次做如下三件事：
       -  第一，创建Activity对象。
       -  第二，创建Application对象（如果需要的话）。
       -  第三，调用Activity的attach方法。
    -  而事实上，在第二步和第三步之间，还有一步操作：创建Context对象。
       -  此时会调用ActivityThread的createBaseContextForActivity方法。

<br>　　来看一下`createBaseContextForActivity`源码：
``` java
private Context createBaseContextForActivity(ActivityClientRecord r, final Activity activity) {

    // 此处省略若干代码。

    ContextImpl appContext = ContextImpl.createActivityContext(
            this, r.packageInfo, displayId, r.overrideConfig);
    appContext.setOuterContext(activity);
    Context baseContext = appContext;

    // 此处省略若干代码。

    return baseContext;
}
```
    语句解释：
    -  从代码中可以看出来，实例化的就是ContextImpl类的对象。

<br>　　我们接着来看一下`Activity`的`attach`方法的源码，看它是如何使用这个`ContextImpl`对象的：
```java
final void attach(Context context, ActivityThread aThread,
        Instrumentation instr, IBinder token, int ident,
        Application application, Intent intent, ActivityInfo info,
        CharSequence title, Activity parent, String id,
        NonConfigurationInstances lastNonConfigurationInstances,
        Configuration config, String referrer, IVoiceInteractor voiceInteractor) {
    // 保存Context的引用
    attachBaseContext(context);

    // 此处省略若干代码。

    // 创建Window对象，这个对象在研究Touch机制时会涉及到（Touch机制属于青铜选手的知识范围，已讲解）。
    mWindow = new PhoneWindow(this);
    mWindow.setCallback(this);

    // 此处省略若干代码。

    // 保存各类变量。
    mMainThread = aThread;
    mInstrumentation = instr;
    mToken = token;
    mIdent = ident;
    mApplication = application;
    mIntent = intent;

    // 此处省略若干代码。

    // 初始化WindowManager对象，这个对象在研究Touch机制时会涉及到（Touch机制属于青铜选手的知识范围，已讲解）。
    mWindow.setWindowManager(
            (WindowManager)context.getSystemService(Context.WINDOW_SERVICE),
            mToken, mComponent.flattenToString(),
            (info.flags & ActivityInfo.FLAG_HARDWARE_ACCELERATED) != 0);
    if (mParent != null) {
        mWindow.setContainer(mParent.getWindow());
    }
    mWindowManager = mWindow.getWindowManager();

    // 此处省略若干代码。
}
```
    语句解释：
    -  Activity并没有简单的将Context保存到一个变量中，而是调用了attachBaseContext方法进行保存。

<br>　　跟进去之后，就会发现最终会调用`ContextWrapper`类的`attachBaseContext`方法：
``` java
protected void attachBaseContext(Context base) {
    if (mBase != null) {
        throw new IllegalStateException("Base context already set");
    }
    mBase = base;
}
```
    语句解释：
    -  至此我们就知道了，当我们在Activity中调用startService方法时，最终调用的是ContextImpl的方法。

<br>　　然后把话题拉回来，接着从的`ContextImpl.startService`方法开始看：
``` java
public ComponentName startService(Intent service) {
    warnIfCallingFromSystemProcess();
    return startServiceCommon(service, mUser);
}
private ComponentName startServiceCommon(Intent service, UserHandle user) {
    // 此处省略若干代码。

    ComponentName cn = ActivityManagerNative.getDefault().startService(
        mMainThread.getApplicationThread(), service, service.resolveTypeIfNeeded(
                    getContentResolver()), getOpPackageName(), user.getIdentifier());

    // 此处省略若干代码。
}
```
    语句解释：
    -  从上面的代码可以知道，程序最终会执行到AMS所在的进程中，并调用AMS的startService方法。


<br>　　然后在`AMS`的`startService`中又经历了如下调用：

    -  首先调用了ActiveServices的startServiceLocked方法。
       -  ActiveServices是一个辅助AMS进行Service管理的类，包括启动、绑定、停止服务等。
    -  接着调用了ActiveServices的startServiceInnerLocked方法。
    -  接着调用了ActiveServices的bringUpServiceLocked方法。

<br>　　我们来看看`bringUpServiceLocked`方法的源码：
``` java
private final String bringUpServiceLocked(ServiceRecord r, int intentFlags, boolean execInFg,
        boolean whileRestarting) throws TransactionTooLargeException {

    // 此处省略若干代码。

    // 如果该服务已经被启动了，则调用它的生命周期方法（比如onStartCommand），然后直接返回。
    if (r.app != null && r.app.thread != null) {
        sendServiceArgsLocked(r, execInFg, false);
        return null;
    }

    // 此处省略若干代码。

    if (!isolated) {
        app = mAm.getProcessRecordLocked(procName, r.appInfo.uid, false);
        if (app != null && app.thread != null) {
            try {
                app.addPackage(r.appInfo.packageName, r.appInfo.versionCode, mAm.mProcessStats);

                // 执行启动Service的工作
                realStartServiceLocked(r, app, execInFg);
                return null;
            } catch (TransactionTooLargeException e) {
                throw e;
            } catch (RemoteException e) {
                Slog.w(TAG, "Exception when starting service " + r.shortName, e);
            }
        }
    } 

    // 此处省略若干代码。

    return null;
}

private final void realStartServiceLocked(ServiceRecord r,
        ProcessRecord app, boolean execInFg) throws RemoteException {
    
    // 此处省略若干代码。

    // 调用服务所在进程中的ActivityThread，通知它启动服务。
    app.thread.scheduleCreateService(r, r.serviceInfo,
            mAm.compatibilityInfoForPackageLocked(r.serviceInfo.applicationInfo),
            app.repProcState);

    // 此处省略若干代码。

    // 接着调用服务的生命周期方法（比如onStartCommand）。
    sendServiceArgsLocked(r, execInFg, true);

    // 此处省略若干代码。
}
```
    语句解释：
    -  上面注释写的很清楚了，此后程序流程将回到服务所在的进程中。

<br>　　与之前介绍的套路一样，最终会调用到`ActivityThread.handleCreateService`方法：
``` java
private void handleCreateService(CreateServiceData data) {

    // 此处省略若干代码。

    // 实例化服务对象
    java.lang.ClassLoader cl = packageInfo.getClassLoader();
    service = (Service) cl.loadClass(data.info.name).newInstance();

    // 此处省略若干代码。

    // 创建Context对象。
    ContextImpl context = ContextImpl.createAppContext(this, packageInfo);
    context.setOuterContext(service);

    // 创建Application对象。
    Application app = packageInfo.makeApplication(false, mInstrumentation);

    // 调用attach和onCreate方法。
    service.attach(context, this, data.info.name, data.token, app,
            ActivityManagerNative.getDefault());
    service.onCreate();
    // 将服务对象保存起来。
    mServices.put(data.token, service);

    // 此处省略若干代码。
}
```
    语句解释：
    -  对于服务的其它生命周期方法，最终也会调用到ActivityThread.handleServiceArgs方法，它的内容请自行去查看。

### 绑定启动 ###

　　绑定启动与普通启动的过程很相似。

　　经历了几次简单的调用，就调到了`ContextImpl.bindServiceCommon`方法：
``` java
private boolean bindServiceCommon(Intent service, ServiceConnection conn, int flags,
        UserHandle user) {
    IServiceConnection sd;
    if (conn == null) {
        throw new IllegalArgumentException("connection is null");
    }
    if (mPackageInfo != null) {

        // 首先获取一个IServiceConnection对象。
        sd = mPackageInfo.getServiceDispatcher(conn, getOuterContext(),
                mMainThread.getHandler(), flags);
    } else {
        throw new RuntimeException("Not supported in system context");
    }
    validateServiceIntent(service);
    try {
        IBinder token = getActivityToken();
        if (token == null && (flags&BIND_AUTO_CREATE) == 0 && mPackageInfo != null
                && mPackageInfo.getApplicationInfo().targetSdkVersion
                < android.os.Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
            flags |= BIND_WAIVE_PRIORITY;
        }
        service.prepareToLeaveProcess();

        // 然后调用AMS的方法绑定服务，并将sd传递过去。
        int res = ActivityManagerNative.getDefault().bindService(
            mMainThread.getApplicationThread(), getActivityToken(), service,
            service.resolveTypeIfNeeded(getContentResolver()),
            sd, flags, getOpPackageName(), user.getIdentifier());
        if (res < 0) {
            throw new SecurityException(
                    "Not allowed to bind to service " + service);
        }
        return res != 0;
    } catch (RemoteException e) {
        throw new RuntimeException("Failure from system", e);
    }
}
```
    语句解释：
    -  在上面的代码中，涉及到一个IServiceConnection类的对象sd，简单的说它是对ServiceConnection的封装。
    -  因为绑定服务是可能跨进程的，所以就要求客户端与服务之间的这个ServiceConnection对象得基于Binder机制。
    -  如果跟进第10行代码的话，就会知道这个sd变量指向的对象本质上是ServiceDispatcher.InnerConnection类型的。并且它实现了IServiceConnection.Stub接口。


<br>　　接着流程就走到了`AMS`的`bindService`方法，并在其中又经历了如下调用：

    -  接着调用了ActiveServices的bindServiceLocked方法。
    -  接着调用了ActiveServices的bringUpServiceLocked方法。
    -  接着调用了ActiveServices的realStartServiceLocked方法。

　　细心的读者可以发现，后两步和普通启动`Service`执行的流程是一样的，过程就不冗述了。

<br>　　但是与普通启动方式不同的是，绑定启动服务在调用完服务的`onCreate`方法之后，还会接着调用`onBinder`方法。
　　我们来细化一下`realStartServiceLocked`方法的执行步骤：
``` java
private final void realStartServiceLocked(ServiceRecord r,
        ProcessRecord app, boolean execInFg) throws RemoteException {
    
    // 此处省略若干代码。

    // 调用服务所在进程中的ActivityThread，通知它启动服务。
    app.thread.scheduleCreateService(r, r.serviceInfo,
            mAm.compatibilityInfoForPackageLocked(r.serviceInfo.applicationInfo),
            app.repProcState);

    // 此处省略若干代码。

    // 尝试调用服务的onBinder方法。
    requestServiceBindingsLocked(r, execInFg);

    // 此处省略若干代码。

    // 接着调用服务的生命周期方法（比如onStartCommand）。
    sendServiceArgsLocked(r, execInFg, true);

    // 此处省略若干代码。
}
```

<br>　　为了锻炼大家的阅读源码的能力，就不带大家看源码了，只简单的说一下步骤：

    -  在requestServiceBindingsLocked中最终会调用服务所在进程的ActivityThread的scheduleBindService方法。
    -  然后就是调用handleBindService方法。

<br>　　来看一下`handleBindService`方法的源码：
``` java
private void handleBindService(BindServiceData data) {
    Service s = mServices.get(data.token);
    if (DEBUG_SERVICE)
        Slog.v(TAG, "handleBindService s=" + s + " rebind=" + data.rebind);
    if (s != null) {
        try {
            data.intent.setExtrasClassLoader(s.getClassLoader());
            data.intent.prepareToEnterProcess();
            try {
                if (!data.rebind) {
                    // 1、onBind方法只会在第一个访问者和服务建立连接时会调用。
                    // 2、onBind方法的返回值IBinder代表服务的一个通信管道，访问者通过该对象来访问服务中的方法。
                    // 3、onBind方法返回的IBinder对象会被传送给ServiceConnection接口的onServiceConnected方法。
                    IBinder binder = s.onBind(data.intent);
                    // 将服务的IBinder对象传递给客户端进程。
                    ActivityManagerNative.getDefault().publishService(
                            data.token, data.intent, binder);
                } else {
                    s.onRebind(data.intent);
                    ActivityManagerNative.getDefault().serviceDoneExecuting(
                            data.token, SERVICE_DONE_EXECUTING_ANON, 0, 0);
                }
                ensureJitEnabled();
            } catch (RemoteException ex) {
            }
        } catch (Exception e) {
            if (!mInstrumentation.onException(s, e)) {
                throw new RuntimeException(
                        "Unable to bind to service " + s
                        + " with " + data.intent + ": " + e.toString(), e);
            }
        }
    }
}
```


<br>　　接着流程就走到了`AMS`的`publishService`方法，并调用了`ActiveServices`的`publishServiceLocked`方法。

<br>　　在`publishServiceLocked`方法中，有如下代码：
``` java
void publishServiceLocked(ServiceRecord r, Intent intent, IBinder service) {

    // 此处省略若干代码。

    try {
        // 调用客户端传递过来的LoadedApk.ServiceDispatcher.InnerConnection对象的connected方法。
        c.conn.connected(r.name, service);
    } catch (Exception e) {
        Slog.w(TAG, "Failure sending service " + r.name +
              " to connection " + c.conn.asBinder() +
              " (in " + c.binding.client.processName + ")", e);
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  在InnerConnection的connected方法中，会转调用它外部类ServiceDispatcher的connected方法。


<br>　　接着就来看一下`ServiceDispatcher.connected`方法的源码：
``` java
public void connected(ComponentName name, IBinder service) {
    if (mActivityThread != null) {
        // 向主线程中发送消息。
        mActivityThread.post(new RunConnection(name, service, 0));
    } else {
        doConnected(name, service);
    }
}
```
    语句解释：
    -  其实如果你去追踪源码的话，就会发现mActivityThread其实就是主线程中的那个mH。

<br>　　后面的代码就不带大家看了，只简单的说一下步骤：

    -  首先，主线程会调用RunConnection的run方法。
    -  然后，会转调用doConnected方法。
    -  最后，在doConnected方法中就可以看到onServiceConnected的调用了。

## BroadcastReceiver ##

　　广播接收者的工作过程，主要包含两方面：广播的注册、广播的发送和接收；本节来简单介绍一下这两个过程。

<br>**动态注册**

　　广播的注册分为静态注册和动态注册，其中静态注册的广播是在应用安装时由系统自动完成注册，具体来说是由`PMS`来完成整个注册过程的。

    -  PMS就是PackageManagerService。
    -  除了广播注册的过程外，其它三大组件只能在应用安装时由PMS解析并注册。

<br>　　这里只分析广播的动态注册的过程，最先调用的同样是`ContextWrapper`类的`registerReceiver`方法。经过几次跳转之后，程序就执行到了`ContextImpl`类的`registerReceiverInternal`方法：
``` java
private Intent registerReceiverInternal(BroadcastReceiver receiver, int userId,
        IntentFilter filter, String broadcastPermission,
        Handler scheduler, Context context) {
    IIntentReceiver rd = null;
    if (receiver != null) {
        if (mPackageInfo != null && context != null) {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            rd = mPackageInfo.getReceiverDispatcher(
                receiver, context, scheduler,
                mMainThread.getInstrumentation(), true);
        } else {
            if (scheduler == null) {
                scheduler = mMainThread.getHandler();
            }
            rd = new LoadedApk.ReceiverDispatcher(
                    receiver, context, scheduler, null, true).getIIntentReceiver();
        }
    }
    try {
        return ActivityManagerNative.getDefault().registerReceiver(
                mMainThread.getApplicationThread(), mBasePackageName,
                rd, filter, broadcastPermission, userId);
    } catch (RemoteException e) {
        return null;
    }
}
```
    语句解释：
    -  从上面的代码可以发现，广播的注册和服务的绑定的步骤很类似，这是因为它们本质上都是在进行IPC。
    -  在上面的代码中，涉及到一个IIntentReceiver类的对象rd，简单的说它是对BroadcastReceiver的封装。
    -  如果跟进第10行代码的话，就会知道这个rd变量指向的对象本质上是ReceiverDispatcher.InnerReceiver类型的。并且它实现了IIntentReceiver.Stub接口。


<br>　　接着流程就走到了`AMS`的`registerReceiver`方法：
``` java
public Intent registerReceiver(IApplicationThread caller, String callerPackage,
        IIntentReceiver receiver, IntentFilter filter, String permission, int userId) {

    // 此处省略若干代码。

    // 将Binder对象保存起来，当广播来临时用它进行回调。
    mRegisteredReceivers.put(receiver.asBinder(), rl);

    // 创建一个意图过滤器，用来让系统匹配广播。
    BroadcastFilter bf = new BroadcastFilter(filter, rl, callerPackage,
            permission, callingUid, userId);
    rl.add(bf);
    if (!bf.debugCheck()) {
        Slog.w(TAG, "==> For Dynamic broadcast");
    }
    // 将意图过滤器保存起来。
    mReceiverResolver.addFilter(bf);

    // 此处省略若干代码。
}
```
    语句解释：
    -  正如大家看到的那样，所谓的广播注册，本质上就是在AMS中添加一些记录。

<br>**发送广播**

　　当我们通过`sendXxx`方法发送广播时，`AMS`会查找出匹配的广播接收者并将广播发送给它们处理。

    -  广播有普通广播和有序广播之分。
    -  虽然二者有不同的特性，但是它们发送和接收的过程是类似的，因此这里只分析普通广播的实现。

<br>　　我们依然是从`ContextImpl`类的`sendBroadcast`方法开始说，然后会调用`AMS`的`broadcastIntent`方法。

　　然后会接着调用`AMS`的`broadcastIntentLocked`方法：

``` java
private final int broadcastIntentLocked(ProcessRecord callerApp,
            String callerPackage, Intent intent, String resolvedType,
            IIntentReceiver resultTo, int resultCode, String resultData,
            Bundle resultExtras, String[] requiredPermissions, int appOp, Bundle options,
            boolean ordered, boolean sticky, int callingPid, int callingUid, int userId) {

    intent = new Intent(intent);

    // 从Android 3.1开始的Android加入了一种保护机制，这个机制导致程序接收不到某些系统广播，其中就包含了开机启动广播。
    // 系统为Intent添加了两个flag，FLAG_INCLUDE_STOPPED_PACKAGES和FLAG_EXCLUDE_STOPPED_PACKAGES。
    // 用来控制Intent是否要对处于stopped状态的App起作用，如果一个App安装后未启动过或者被用户在管理应用中手动
    // 停止（强行停止）的话，那么该App就处于stopped状态了。
    // FLAG_INCLUDE_STOPPED_PACKAGES：表示包含stopped的App
    // FLAG_EXCLUDE_STOPPED_PACKAGES：表示不包含stopped的App

    // 从Android3.1开始，系统会为所有广播默认添加FLAG_EXCLUDE_STOPPED_PACKAGES标识。
    // 当FLAG_INCLUDE_STOPPED_PACKAGES和FLAG_EXCLUDE_STOPPED_PACKAGES共存时，以前者为准。
    intent.addFlags(Intent.FLAG_EXCLUDE_STOPPED_PACKAGES);

    // 此处省略若干代码。

    if ((receivers != null && receivers.size() > 0)
            || resultTo != null) {
        BroadcastQueue queue = broadcastQueueForIntent(intent);
        BroadcastRecord r = new BroadcastRecord(queue, intent, callerApp,
                callerPackage, callingPid, callingUid, resolvedType,
                requiredPermissions, appOp, brOptions, receivers, resultTo, resultCode,
                resultData, resultExtras, ordered, sticky, false, userId);

        if (DEBUG_BROADCAST) Slog.v(TAG_BROADCAST, "Enqueueing ordered broadcast " + r
                + ": prev had " + queue.mOrderedBroadcasts.size());
        if (DEBUG_BROADCAST) Slog.i(TAG_BROADCAST,
                "Enqueueing broadcast " + r.intent.getAction());

        boolean replaced = replacePending && queue.replaceOrderedBroadcastLocked(r);
        if (!replaced) {
            // 将所有满足条件的广播接收者放到BroadcastQueue中。
            queue.enqueueOrderedBroadcastLocked(r);
            // 发送广播。
            queue.scheduleBroadcastsLocked();
        }
    }

    return ActivityManager.BROADCAST_SUCCESS;
}
```
    语句解释：
    -  无。


<br>　　接着流程就走到了`BroadcastQueue`的`scheduleBroadcastsLocked`方法，并在其中又经历了如下调用：

    -  接着在其内部通过Handler发送一个消息。
    -  接着调用了BroadcastQueue的processNextBroadcast方法。
    -  接着调用了BroadcastQueue的deliverToRegisteredReceiverLocked方法。
    -  接着调用了BroadcastQueue的performReceiveLocked方法。

<br>　　我们来看看`performReceiveLocked`方法的源码：
``` java
private static void performReceiveLocked(ProcessRecord app, IIntentReceiver receiver,
        Intent intent, int resultCode, String data, Bundle extras,
        boolean ordered, boolean sticky, int sendingUser) throws RemoteException {
    // Send the intent to the receiver asynchronously using one-way binder calls.
    if (app != null) {
        if (app.thread != null) {
            // If we have an app thread, do the call through that so it is
            // correctly ordered with other one-way calls.
            app.thread.scheduleRegisteredReceiver(receiver, intent, resultCode,
                    data, extras, ordered, sticky, sendingUser, app.repProcState);
        } else {
            // Application has died. Receiver doesn't exist.
            throw new RemoteException("app.thread must not be null");
        }
    } else {
        receiver.performReceive(intent, resultCode, data, extras, ordered,
                sticky, sendingUser);
    }
}
```
    语句解释：
    -  显而易见，此时程序的流程会回到广播接收者所在的进程中的ApplicationThread类。

<br>　　那接着就来看看`ApplicationThread.scheduleRegisteredReceiver`方法：
``` java
public void scheduleRegisteredReceiver(IIntentReceiver receiver, Intent intent,
        int resultCode, String dataStr, Bundle extras, boolean ordered,
        boolean sticky, int sendingUser, int processState) throws RemoteException {
    updateProcessState(processState, false);

    // 调用之前创建的ReceiverDispatcher.InnerReceiver对象的方法。
    receiver.performReceive(intent, resultCode, dataStr, extras, ordered,
            sticky, sendingUser);
}
```
    语句解释：
    -  接着在ReceiverDispatcher.InnerReceiver中又会调用在ReceiverDispatcher的performReceive方法。
    -  接着会创建一个Args对象，并把它放到主线程中执行，Args是Runnable的子类。
    -  接着在Args类的run方法里就可以看到对广播接收者onReceive的调用。


## ContentProvider ##
　　内容提供者也是通过`Binder`机制向其他组件提供数据的：

    -  当ContentProvider所在的进程被启动时，ContentProvider会同时启动并被发布到AMS中。
    -  另外，ContentProvider的onCreate方法比Application的onCreate方法更早被调用。
    -  这意味着，如果我们想知道ContentProvider的启动过程的话，那就势必得得看进程启动相关的代码了。

<br>　　在前面我们分析了进程的启动流程的前半部分，接下来就接着一起来看看后半部分。

　　那咱们就从`ActivityThread`的`attach`方法开始：
``` java
private void attach(boolean system) {

    // 此处省略若干代码。

    final IActivityManager mgr = ActivityManagerNative.getDefault();
    try {
        mgr.attachApplication(mAppThread);
    } catch (RemoteException ex) {
        // Ignore
    }

    // 此处省略若干代码。
}
```
    语句解释：
    -  在attach方法中会进行一系列的初始化操作。
    -  其中比较重要的一步就是，会将ActivityThread通过AMS的attachApplication方法跨进程传递到AMS中。

<br>　　在`AMS`的`attachApplication`方法中又调用了`attachApplicationLocked`方法：
``` java
private final boolean attachApplicationLocked(IApplicationThread thread,
        int pid) {

    // 此处省略若干代码。

    // 调用用户进程的bindApplication方法，通知其注册完毕。
    thread.bindApplication(processName, appInfo, providers, app.instrumentationClass,
            profilerInfo, app.instrumentationArguments, app.instrumentationWatcher,
            app.instrumentationUiAutomationConnection, testMode, enableOpenGlTrace,
            isRestrictedBackupMode || !normalMode, app.persistent,
            new Configuration(mConfiguration), app.compat,
            getCommonServicesLocked(app.isolated),
            mCoreSettingsObserver.getCoreSettingsLocked());

    // 此处省略若干代码。

    // 我们来缕一下流程：
    // 首先，当我面启动一个Activity时，系统会判断：
    //      若该Activity所在的进程已经存在，则直接启动，并返回。
    //      若该Activity所在的进程不存在，则AMS会先去开启一个进程。
    // 接着，当新进程启动完毕后，新进程会按照上面说的那样，调用AMS的方法把它自己的ActivityThread注册到AMS中。
    // 接着，当AMS给新进程发送“注册完毕”的通知后，它就会检测：
    //      是否有需要启动的Activity、Service、BroadcastReceiver? 如果有，则就启动它们。
    //      而下面的这个代码，就是检测是否需要启动Activity的，相应的还有启动服务和广播接收者的代码，
    //      不过被我给省略了。之所以没有ContentProvider，是因为他是在进程启动的时候，就同时被启动了。
    if (normalMode) {
        try {
            if (mStackSupervisor.attachApplicationLocked(app)) {
                didSomething = true;
            }
        } catch (Exception e) {
            Slog.wtf(TAG, "Exception thrown launching activities in " + app, e);
            badApp = true;
        }
    }

    // 此处省略若干代码，其中就包括对Service、BroadcastReceiver的启动相关的代码。

    return true;
}
```
    语句解释：
    -  各位可以去mStackSupervisor.attachApplicationLocked中看看，是否有启动Activity相关的代码。

<br>　　当程序流程回到用户进程的时候，会在主线程中调用`handleBindApplication`方法：
``` java
private void handleBindApplication(AppBindData data) {

    // 此处省略若干代码。

    // 第一，创建Instrumentation对象。
    java.lang.ClassLoader cl = instrContext.getClassLoader();
    mInstrumentation = (Instrumentation)
        cl.loadClass(data.instrumentationName.getClassName()).newInstance();

    // 此处省略若干代码。

    // 第二，创建Application对象。
    Application app = data.info.makeApplication(data.restrictedBackupMode, null);
    mInitialApplication = app;

    // 此处省略若干代码。

    // 第三，启动当前进程的ContentProvider并调用onCreate方法
    if (!data.restrictedBackupMode) {
        List<ProviderInfo> providers = data.providers;
        if (providers != null) {
            installContentProviders(app, providers);
            // For process that contains content providers, we want to
            // ensure that the JIT is enabled "at some point".
            mH.sendEmptyMessageDelayed(H.ENABLE_JIT, 10*1000);
        }
    }

    // 第四，调用Application对象的onCreate方法。
        
    mInstrumentation.callApplicationOnCreate(app);
}
```
    语句解释：
    -  在handleBindApplication方法中做了很多事，我们主要就关注上面四件事。

<br>　　接着深入`installContentProviders`方法去看看：
``` java
private void installContentProviders(
        Context context, List<ProviderInfo> providers) {
    final ArrayList<IActivityManager.ContentProviderHolder> results =
        new ArrayList<IActivityManager.ContentProviderHolder>();

    // 遍历所有内容提供者
    for (ProviderInfo cpi : providers) {
        if (DEBUG_PROVIDER) {
            StringBuilder buf = new StringBuilder(128);
            buf.append("Pub ");
            buf.append(cpi.authority);
            buf.append(": ");
            buf.append(cpi.name);
            Log.i(TAG, buf.toString());
        }
        
        // 在下面的installProvider方法中执行了实例化ContentProvider的操作。
        // 然后通过ContentProvider的attachInfo方法来调用其onCreate方法。
        // 接着将ContentProvider封装成一个cph对象，并把它放入到results中。
        IActivityManager.ContentProviderHolder cph = installProvider(context, null, cpi,
                false /*noisy*/, true /*noReleaseNeeded*/, true /*stable*/);
        if (cph != null) {
            cph.noReleaseNeeded = true;
            results.add(cph);
        }
    }

    try {
        // 将这些内容提供者发布到AMS中。
        ActivityManagerNative.getDefault().publishContentProviders(
            getApplicationThread(), results);
    } catch (RemoteException ex) {
    }
}
```
    语句解释：
    -  和服务、广播接收者一样，做为组件是不能直接跨进程的，所以要将他封装成一个ContentProviderHolder对象。
    -  在AMS的publishContentProviders方法中，会将这些观察者保存到一个名为mProviderMap的属性里。

<br>　　接着深入`installProvider`方法去看看：
``` java
private IActivityManager.ContentProviderHolder installProvider(Context context,
    IActivityManager.ContentProviderHolder holder, ProviderInfo info,
    boolean noisy, boolean noReleaseNeeded, boolean stable) {

    // 此处省略若干代码。

    final java.lang.ClassLoader cl = c.getClassLoader();
    localProvider = (ContentProvider)cl.
        loadClass(info.name).newInstance();
    // 获取ContentProvider的IContentProvider对象。
    provider = localProvider.getIContentProvider();

    // 此处省略若干代码。

    localProvider.attachInfo(c, info);

    // 此处省略若干代码。
}
```
    语句解释：
    -  之所以要将ContentProviderHolder传给AMS，是为了当AMS接到请求时，好把请求转给内容提供者处理。
    -  因此这是一个跨进程的操作，也就是说ContentProviderHolder内部都应该是支持跨进程的。
    -  但是做为组件的ContentProvider是不能跨进程的。
    -  所以被封装到ContentProviderHolder中的其实是IContentProvider对象，它是一个Binder接口。
    -  可以进入到内容提供者的getIContentProvider方法里看看，它返回的是一个Transport对象。
    -  当AMS转发的请求最后就会交给这个Transport处理。

<br>　　现在我们回过头来看看，当客户端访问`ContentProvider`的`query`方法时，程序的执行流程。

    -  首先调用的依然是ContextWrapper类的getContentResolver方法。
    -  接着通过追踪源码可以发现，会转调用ApplicationContentResolver的query方法。
    -  接着由于ApplicationContentResolver没有重写query方法，所以会调用ContentResolver的。
    -  接着会调用acquireUnstableProvider方法。
    -  接着经历一些跳转，会调用到ActivityThread的acquireProvider方法。
    -  接着会调用AMS的getContentProvider方法，然后进行一些列的调用，最终返回一个IContentProvider对象。
    -  接着再用这个IContentProvider对象调用query方法，也就是调用到Transport对象中了。

## 结尾 ##
　　至此，本章就算完结了，以后有时间再来进一步完善细节部分。

<br><br>