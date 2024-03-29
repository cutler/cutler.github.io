---
title: 第三章 操作系统
date: 2011-02-28 12:59:42
author: Cutler
categories: 计算机基础
---

　　我此时正在准备考程序员，所以关于操作系统的很多细节部分，没有时间仔细研
究，而且本书写的有点散乱，您多多包涵。

# 第一节 操作系统概述 #

## 计算机系统的组成 ##

<br>　　计算机系统资源由<font color='red'> 硬件资源 </font>和<font color='red'> 软件资源 </font>两部分组成。
>硬件资源：是咱们能看的到、摸得到的物理装备。如：显示器、鼠标、CPU等。
>软件资源：是计算机内部程序、数据、相关文档的集合。如：QQ、360杀毒等等。
>
>而软件资源又可以分为：
>
>系统软件：是最靠近硬件的一层，其他软件一般都是通过系统软件发挥作用。如：各种语言处理程序、操作系统、服务性程序等都是系统软件。 
>应用软件：应用软件是特定应用领域的专用软件。如：各种网游、聊天工具、媒体播放器等都是应用软件。

　　在系统软件中，<font color='red'>操作系统</font>（Operating System，简称OS）是计算机系统必不可少的系统软件，其他的软件都是建立在操作系统基础上的。

　　操作系统的作用，用一句话概括就是：<font color='red'>操作系统可以通过资源管理提高计算机系统的整体效率，以及改善人机界面方便用户操作</font>。
>第一，操作系统能有效的组织和管理计算机系统中的各种软、硬件资源。
>第二，用户可以通过操作系统的图形界面方便的访问和管理计算机中的软硬件资源。简单地说，以前没有图形界面的时候，咱们删除一个文件夹都需要一条命令，所以操作电脑很麻烦，不过现在好了，linux、windows中都有图形界面了。

## 操作系统的分类 ##

<br>　　最初，没有操作系统的时候，人们采用手工的方式来操作计算机。

　　手工操作计算机时期：
>计算机电子器件：电子管。
>控制：操作和编程完全由手工进行，且编程必须用机器语言(0、1代码)。
>用户：由于计算机结构复杂，所以想操作它就需要操作员和程序员两个工种。操作员负责操作计算机，程序员负责编写代码。此时的程序员多为数学家和工程师。(但也不是绝对的，也是有强人即会编程也会操作)。
>特点：上机用户独占计算机内的所有资源。


　　随着时间的推移，操作系统开始了从无到有进化过程，以现在的眼光来看，操作系统的分类同样有许多不同的方法，一般是按照使用环境和对程序执行的处理方式进行分类，有如下几种：
>批处理操作系统、分时操作系统、实时操作系统、并行操作系统、网络操作系统等等。

### 批处理操作系统 ###

　　第一个OS：<font color='red'>单道批处理系统</font>（严格的说不算是OS，但是比没有强太多了）。
>编程语言：汇编语言或FORTRAN。
>执行程序：
>程序员将代码写在纸上，然后使用穿孔机制成卡片(1则打洞，0则不动)，最后将卡片交给操作员。操作员再使用专用的IO计算机将卡片中的程序和数据读到磁带上保存起来，并将磁带送入批处理程序。批处理程序从磁带中读出第一个作业运算，运算结束后，将结果写入到另一个磁带中去。然后接着读入并执行第二个作业。当一批作业全部执行完毕后，取下输入和输出磁带。再次使用输入磁带录入下一批作业。将输出磁带送到专用的输出计算机，进行脱机打印。

　　单道批处理系统又称为批处理程序、监督程序、管理程序，它常驻于内存，管理<font color='red'>作业</font>的运行。

　　小提示：什么是作业？
>作业是一个比程序更为广泛的概念，它不仅包含了通常的程序和数据，而且还应配有一份作业说明书，系统根据该说明书来对程序的运行进行控制。在批处理系统中，是以作业为基本单位从外存调入内存的。
>
>作业的基本类型：
>脱机作业：无需人工干预，也无需CPU的控制，用户只需要使用作业控制语言(JCL)编写作业说明书，连同作业一起提交给一个外围计算机，就可以批量执行多个作业。
>联机作业：需要人工干预，用户通过键盘等设备向计算机内输入命令来控制计算机的执行。

　　其实批处理操作系统分为：<font color='red'>单道批处理</font>操作系统和<font color='red'>多道批处理</font>操作系统。

　　**单道批处理操作系统　　**
　　我们把多个作业打包在一起，组成一批进行统一处理（批处理），然后像流水线一样，从第一个作业开始，依次处理所有的作业。
>缺点：
>1、中途用户不能和OS交流，只能等待作业执行完成。
>2、同一时刻内，只能有一个作业被载入内存中。
>3、如果当前作业，因为需要使用IO设备，而暂时放弃使用CPU，则CPU会处于空闲状态，等当前作业回来后，CPU再开始工作，此时就会浪费CPU资源。
>
>优点：
>同一批内的作业自动更替，节省了作业的人工干预时间，提高了少量的资源利用率和系统吞吐量。如果是以前，程序员每执行完一个程序，需要再将其他程序装入计算机，如此反复，就浪费了很多时间。

　　**多道批处理操作系统　　**
　　它是对单道批处理操作系统的扩展。所谓多道，就是指允许多个程序同时存在于内存之中。由<font color='red'>作业调度程序</font>按照一定的算法从就绪队列中一次选择一个或多个作业，调入内存执行。

　　虽然，为提高资源利用率，操作系统允许同时有多个程序被加载到内存中执行，但是：
>从宏观上看，系统中多道程序在同时执行（并行）。
>从微观上看，在某一时刻依然仅能执行一道程序（串行）。

　　即当有一个作业正在使用IO设备，暂时不需要CPU时，就把CPU交给内存中的其他作业使用。这样就可以“两不误”。这样只要有一个作业可以执行，CPU就不会被空闲。从而将主机与外设间的工作方式从串行转为并行，进一步避免了因主机等待当前作业调用外设去完成任务而白白浪费的宝贵的CPU时间。


　　提示：
>1、上面说主机与外设间的工作方式是串行就是指，主机工作时，外设空闲；外设工作时，主机空闲。串行，就是一条“路线”。
>2、现在批处理系统一般都使用在大型系统中。即一个程序已经是固定执行模式，不需要进行改变。
>3、在多道批处理系统中，用户同样无法和OS进行交互。
>4、从外存到内存称为<font color='red'>作业调度</font>，从内存到CPU称为<font color='red'>进程调度</font>。

<br>**本节参考阅读：**
- [百度百科 - 作业控制语言](https://baike.baidu.com/item/%E4%BD%9C%E4%B8%9A%E6%8E%A7%E5%88%B6%E8%AF%AD%E8%A8%80?fromtitle=jcl&fromid=9157675&fromModule=lemma_search-box)

### 分时操作系统 ###

　　虽然多道批处理系统在一定程度上提高了资源利用率，但我们仍觉得不够：
>在计算机发展初期，计算机是一个比较稀有的物品，而需要使用计算机的人却有很多，多道批处理系统同一时间只能执行一个人的批处理作业，其他人想用只能排队。
>这对短作业不公平，它等待执行的时间可能比它执行的时间要长。

　　<font color='red'>分时操作系统</font>（英语：time-sharing）是计算机科学中对资源的一种共享方式，它允许在一台计算机上连接若干个终端机，每个用户通过终端机来给计算机安排自己的作业，它使一台计算机采用<font color='red'>时间片轮转</font>的方式同时为几个、几十个甚至几百个用户服务。

　　在分时系统中，所谓的时间片轮转就是指，将CPU的工作时间，划分成多个很短的时间片，操作系统给每个用户的作业分配一个时间片，当一个作业的时间片用完或者这个作业执行完毕时，操作系统将CPU的使用权，转交给其他作业。 

　　分时操作系统的特点：
>多路性： OS允许一台主机上连接多台终端机，OS按分时原则为每一个用户服务，各个作业的执行方式是，宏观上并行，微观上串行。
>独立性： 每个用户各占一个终端，彼此独立，操作互不干扰。
>交互性： 用户可以通过终端与系统进行交互。
>及时性： 用户的请求能在很短的时间内得到响应。

　　分时操作系统典型的例子就是 <font color='red'>Unix</font> 和 <font color='red'>Linux</font> 的操作系统，其可以同时连接多个终端并且每隔一段时间重新扫描进程，重新分配进程的优先级，动态分配系统资源。

<br>**本节参考阅读：**
- [百度百科 - 分时操作系统](https://baike.baidu.com/item/%E5%88%86%E6%97%B6%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F?fromModule=lemma_search-box)

### 实时操作系统 ###

　　多道批处理OS和分时OS难以满足实时控制和实时信息处理领域的需要。
　　实时操作系统是对外来时间能以足够快的速度进行处理，并在规定时间内，返回处理结果的OS。实时操作系统对交互能力要求不高，但要求<font color='red'>可靠性要有保障</font>。特别在<font color='red'>生产制造控制</font>和<font color='red'>军事领域</font>的计算机应用对实时性的要求，需要能够及时响应并处理的实时操作系统，其响应时间一般在<font color='red'>毫秒、微秒甚至更快</font>。
　　因此实时操作系统<font color='red'>是专用系统</font>，操作系统本身对资源的使用和控制都必须优化设计以满足系统要求，一般实时操作系统是单一用户和单一任务的。

　　提示1：
>批处理操作系统、分时操作系统、实时操作系统是操作系统的基本类型。如果一个系统兼有批处理、分时、实时OS的全部或2种功能，则该操作系统称为<font color='red'>通用操作系统</font>。

　　提示2：比较一下分时系统和实时系统。
>首先，两者的设计目标不同：
>　　分时系统是设计成一个多用户的通用系统。
>　　实时系统大都是专用系统。如：飞机自动驾驶、军事导弹、情报检测等。
>其次，交互性强弱不同：
>　　分时系统是多用户的通用系统，交互性强。
>　　实时系统仅允许操作并访问有限的专用程序，不能随便修改，且交互能力差。
>最后，响应时间的敏感度不同：
>　　分时系统响应用户的时间相对慢一些。
>　　实时系统响应时间的敏感度更强。


### 并行操作系统 ###

　　并行操作系统是针对计算机系统的<font color='red'>多处理器要求设计</font>的，说白了就是给那些有多个CPU的电脑设计的OS。它除了完成单一处理器系统同样的作业与进程控制任务外，还<font color='red'>必须能够协调系统中多个处理器同时执行不同作业和进程</font>，或者在一个作业中由不同处理器进行处理的系统协调。

　　并行系统比单一处理器系统要复杂得多：
>其中第一个问题就是“负载平衡”（Load Balancing）问题。因为处理器作为系统硬件的核心总是处于活动状态，动态地将任务（进程）分配给多个处理器以便所有处理器都能够被有效地使用。总不能让一个CPU拼命干活，让其他CPU闲着吧？
>另外一个问题是“缩放”（Scaling）问题。并行系统要将一个任务分解为系统中可用处理器相容的多个子任务以便能够被各个处理器同时所执行。

　　在多处理器计算机中，除了对处理器的控制需要由操作系统进行协调，其他资源如存储器也需要操作系统进行调度。特别是如果每个处理器是使用独立存储器结构，各个处理器处理存放的信息是存放在在不同存储器中的，因此需要进行调度以便为新的进程所使用。所以并行系统的研究，不但在体系结构上要充分发挥系统的效率，并行操作系统也是重点研究的内容。


### 分布式操作系统 ###

　　计算机系统按照组织形式可以划分为：
>集中式计算机系统：其处理和控制功能都高度集中在一台计算机上，所有任务都由它完成。
>分布式计算机系统：是指由多台分散的计算机，经互连网络连接而成的系统，每台计算机高度自治，又相互协同，能在系统范围内实现资源管理，任务分配、能并行地运行分布式程序，在分布式系统中没有主从关系。

　　通常，为分布式计算机系统配置的操作系统称为<font color='red'>分布式操作系统</font>。

### 微机操作系统 ###

　　微机操作系统，就是微机中使用的操作系统。最初的微机操作系统是配置在8位机上的CP/M，随着CPU字长的改变，相应的就产生了16、32、64位的操作系统。

　　常用的微机操作系统有：
>Windows 是美国Microsoft公司开发的图形用户界面、多任务、多线程操作系统。
>
>Linux是一套免费使用和自由传播的类UNIX系统，由世界各地成千上万的程序员设计和实现，其目的是建立不受任何商品化软件版权制约的、全世界都能自由使用的UNIX兼容品。Linux 有很多版本，几乎在任何类型机器中，都有Linux系统的身影。在微型机中，Linux常见的版本有：redhat、ubuntu、fedora 等。Linux是Unix系统的变种，具有许多Unix系统的功能和特点。 
>
>DOS(Disk Operating System) 磁盘操作系统。DOS 有 IBM 公司和 Microsoft 两个系列，包括：
>PC-DOS，又称IBM-DOS。是IBM委托微软为其生产的计算机开发的系统。随着IBM-PC 个人计算机在市场份额不断减少，PC-DOS逐渐成为DOS的一个支流。
>MS-DOS是微软推出的。DOS 采用汇编语言书写，系统开销小，运行效率高。

### 嵌入式操作系统 ###

　　嵌入式操作系统是一种用途广泛的系统软件，通常包括与硬件相关的底层驱动软件、系统内核、设备驱动接口、通信协议、图形界面、标准化浏览器等。嵌入式操作系统负责嵌入式系统的全部软、硬件资源的分配、任务调度，控制、协调并发活动。

　　主要特点：
>微型化：从性能和成本角度考虑，要求系统占用资源和系统代码量少，如内存少，字长短，运行速度有限、能源少(用微小型电池)。
>可定制：从减少成本和缩短研发周期考虑，要求嵌入式操作系统能运行在不同的微处理器平台上，能针对硬件变化进行结构与功能上的配置，以满足不同应用需要。
>实时性、可靠性、易移植性。

　　说白了，<font color='red'>在各类家电、手机中使用的操作系统（Android、iOS），都称为是嵌入式操作系统</font>。

<br>**本节参考阅读：**
- [百度百科 - 嵌入式操作系统](https://baike.baidu.com/item/%E5%B5%8C%E5%85%A5%E5%BC%8F%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/361747?fromModule=lemma-qiyi_sense-lemma)

## 操作系统基础 ##

### 操作系统的特征 ###

　　操作系统的特征：<font color='red'>并发性</font>、<font color='red'>共享性</font>、<font color='red'>虚拟性</font>、<font color='red'>异步性</font>。

　　**并发性**
　　OS应该具有处理和调度多个程序同时执行的能力。
>一个程序等待 I/O 时，就出让出CPU，让另一个程序占有 CPU ，并执行运行。采用了并发技术的系统又称为多任务系统。
>所谓的并发，就是1个CPU可以被多个程序共同使用，但是同一时间，CPU只服务一个程序。
>所谓的并行：指两个或两个以上事件或活动在同一时刻发生。说白了，就是一个计算机内有多个CPU，这样，在同一时间，就可能有多个任务在同时执行。

　　**共享性**
　　操作系统中的硬件资源和信息资源可被多个并发执行的进程共同使用。
>所谓进程，每一个应用程序运行的时候，OS都会为其开启一个进程。如，咱们登录QQ、打开一个记事本、玩游戏等OS都会为其对应开启一个进程。当程序运行结束的时候，进程就消失。此时就会产生问题，如果两个以上的进程同时要求访问一个数据，那怎么办？
>第一种是互斥访问。系统中的某些资源如打印机、磁带机等，虽然它们可提供给多个进程使用。但在同一时间内却只允许一个进程访问这些资源。其他进程必须等待该线程完全使用完这些资源并退出后，才可以使用。这种同一时间内只允许一个进程访问的资源称临界资源。
>第二种是同时访问。但是，在计算机系统中，如“硬盘”等资源是可以被多个进程同时访问的。

　　共享性和并发性是操作系统两个最基本的特性。

　　**虚拟性**
>简单的说，虚拟性，就是为了提高计算机的性能。单个CPU使用分时技术后，可以并发执行多个任务。好像一个CPU被“虚拟”为多个一样。虚拟机技术把物理上的一台计算机变成逻辑上的多台计算机。

　　**异步性**
>或称随机性。由于多道环境中，进程轮流占有CPU，所以程序的执行是“走走停停”的。“轮流占有CPU”意味着系统中的进程何时执行？何时暂停？以什么样的速度向前推进？进程总共要化多少时间执行才能完成？ 这些都是不可预知的、随机的。
>此时就说，程序是以异步的方式运行的。或者说：是并发性导致了异步性。

　　提示：什么是虚拟机技术。
>简单的说，就是在电脑中安装一个虚拟机软件，然后利用这个软件就可以，模拟出一个“计算机”来。这个计算机可谓是五脏俱全，由咱们从原来的系统中为它划分配硬盘、内存空间。并且为这个计算机装一个操作系统，这样咱们就可以通过这个虚拟机软件来使用多个OS了。
>
>被虚拟出来的计算机是在咱们原来的系统下运行的，它的地位就相当与一个应用软件。简单的说，咱们先打开原来的OS，然后再启动虚拟机软件，接着，再利用虚拟机软件来开启新建的这个系统。也就是说，如果不把原来的OS打开，那么就无法进入这个子OS。
>
>一台电脑，可以虚拟出多台计算机，在主系统中可以同时打开多个子系统。


### 操作系统的功能 ###

　　从资源管理的观点来看，OS的功能：<font color='red'>处理器(CPU)管理</font>、<font color='red'>存储器管理</font>、<font color='red'>文件管理</font>、<font color='red'>设备管理</font>。

　　**处理器(CPU)管理**
　　主要的功能是创建和撤销进程，对进程的运行进行调节。主要包括：
>进程控制：创建进程并为之分配资源、撤销进程、控制进程状态的转换。
>进程同步：主要任务是协调多个进程的运行。协调方式有两种：互斥方式和同步方式。
>进程通信：进程间的信息交换。
>进程调度：从进程就绪队列中，按照特定的方法选择一个进程，然后执行它。

　　**存储管理**
　　对主存储器进行管理。主要包括：
>存储分配与回收：静态分配/动态分配、连续分配和非连续分配。
>存储保护： 对系统内存空间、用户内存空间的保护。
>地址映射： 逻辑地址 -> 物理地址。
>主存扩充： 虚拟内存技术。

　　**文件管理**
　　顾名思义，管理用户文件和系统文件。主要包括：
>目录管理
>文件的逻辑组织与访问方式。
>文件存储空间管理
>文件的共享和安全。

　　**设备管理**
　　实质是对硬件设备管理。主要包括：
>缓冲管理：解决CPU速度与IO设备速度不协调的问题。
>设备分配。
>设备处理：启动设备、中断处理。
>虚拟设备功能。

　　上述功能是OS自身所具备的，这些功能不光是它自己运转时会调用，也向外界暴露了其中的某些功能的接口，以便计算机用户也可以使用这些接口，OS对外暴露接口通常有两种方式：
>程序员接口，通过<font color='red'>系统调用</font>来使用OS某些功能；说白了，就是咱们程序员在编程语言中调用的一组OS底层函数。如“建立、删除文件夹”的函数。
>操作员接口，通过操作控制命令提出控制要求。说白了，就是一组命令，操作员在操作系统中直接通过这些命令来控制操作系统。如，在cmd中可以使用cd(进入某个文件夹)、copy(复制文件)、md(建立文件夹)等命令来操作OS。

　　**系统调用**
　　操作系统编制了许多不同功能的子程序(函数)，供自己和用户程序执行中调用。这些由操作系统提供的子程序称为<font color='red'>系统功能调用程序</font>，简称系统调用。现在的Windows 和 OS 2 等，其系统调用干脆用 C 语言编写，并以库函数形式提供，故在用 C 语言编制的程序中，可直接使用系统调用。

　　系统调用从功能上大致可分成五类：
>进程和作业管理：终止或异常终止进程、装入和执行进程、创建和撤销进程、获取和设置进程属性。
>文件操作：建立文件、删除文件、打开文件、关闭文件、读写文件、获得和设置文件属性。
>设备管理：申请设备、释放设备、设备 I/O 和重定向、获得和设置设备属性、逻辑上连接和释放设备。
>内存管理：申请内存和释放内存。
>通信：建立和断开通信连接、发送和接收消息、传送状态信息、联接和断开远程设备。

### 操作系统的构件 ###

　　通常把组成操作系统程序的<font color='red'>基本单位</font>称作操作系统的构件。现代操作系统中的基本单位除<font color='red'>内核</font>之外，主要还有<font color='red'>进程</font>、<font color='red'>线程</font>、<font color='red'>类程</font>和<font color='red'>管程</font>。

　　**内核(kernel)**
　　上一节里提到的操作系统的各个功能，都是由内核提供的，它常驻于内存中。<font color='red'>内核是操作系统的最基本的部分</font>，但内核并不是计算机系统中的必要组成部分。因为在OS出现之前，程序员采用手工方式直接控制和使用计算机硬件。
>由于操作系统设计的目标和环境不同，内核的大小和功能有很大差别。
>微内核(microkernel)：内核做得尽量小仅具有极少的必须功能，其他功能都在核外实现。
>单内核(monolithic kernel)：具有较多的功能，其内部也可划分成层次或模块，模块间的联系可通过函数或过程调用实现。

　　操作系统内核的主要功能分为：
>支持功能：中断处理、统计、时钟管理、原语操作。
>资源管理功能： 
>　　进程管理：进程创建、终止、调度、状态转换、同步和通信、管理PCB。
>　　存储管理：为进程分配地址空间、对换、段/页管理。
>　　IO设备管理：缓存管理、为进程分配IO通道和设备。

　　**进程**
　　进程是程序的一次执行。程序本身只是一块死代码、指令的集合，程序需要被加载到内存中后，才可以执行，而程序被加载入内存，OS就会为其启动一个进程。
>在传统的操作系统中，进程是操作系统中资源分配以及系统调度的基本单位。每个进程拥有自己独立的存储空间和运行环境，进程间互不干扰。
>一个进程可以有父进程和子进程：父进程(创造当前进程的进程)，子进程（当前进程创建的进程）。建立子进程时，会重新申请内存资源，而不是在当前进程中划分。
>进程通信和切换的系统开销相当大。

　　引入进程的原因？
>在没有进程的系统中，程序的计算操作和IO操作必须顺序执行，即要么先执行IO操作，要么先执行计算操作，它们不能同时执行。
>引入进程后，可分别为计算程序和IO程序各建立一个进程，则这两个进程就可以并发执行，多个进程可以相互切换，当失去CPU的进程再次被调度的时候，会根据其PCB中的数据，还原程序现场。但是若没有进程，则就无法保存当前作业的执行情况，也就无法并发执行，也就回到了顺序执行的阶段了。

　　每运行一个应用程序，OS都会为这个程序开启一个对应的进程，Windows中可以通过ctrl+al+del 调出任务管理器，查看当前系统中，有多少个进程在执行。

　　**线程**
　　进程既是资源分配单位，又是调度和执行单位。而线程隶属于进程，是程序运行的基本单元，它有如下特点：
>一个标准的线程由：线程ID、当前指令指针(PC)、寄存器集合和堆栈组成，这意味着创建和切换线程的时间大大减少，因为除了必要的组成部分，线程几乎不拥有资源。
>一个进程中可以有多个线程，当一个进程消失了，那么进程中的所有线程都将死亡。
>一个进程中的所有线程，共享进程的内存空间。
>一个线程死亡了，进程却可能仍在运行着，线程不是程序，不能独立运行。
>多线程，简单的说就是可以使一个进程在同一个时间段内可以做多个工作。

　　引入线程的原因：
>在进程的创建、撤销、切换中，系统必须为之付出较大的时间开销。
>因此在系统中设置的进程数目不能过多，进程切换的频率不宜太高，这就限制了并发程度的提高。因此在现代操作系统中，引入了线程。此时进程仅仅是OS进行资源分配的基本单位，调度的基本单位变为了线程。

# 第二节 进程管理 #

## 进程基础 ##

　　进程实体通常由：程序、数据和进程控制块(PCB)组成。
>程序：就是代码，描述了进程需要完成的功能。
>数据：程序执行的所需要的数据及工作区。
>进程控制块：每一个被载入到内存中的进程，都具有一个PCB，它是进程存在的唯一标志。所谓的创建进程，其实就是创建进程的PCB，撤销进程，就是撤销进程的PCB。操作系统是根据PCB来对并发执行的进程进行控制和管理的。当OS要调度某一个进程时，要从该进程的PCB中查出现行状态及优先级。

　　**PCB中保存的信息**
>1、进程标识符：用于唯一地标识一个进程，一个进程通常有两种标识符。内部标识符：操作系统分配给进程的一个唯一的ID。就像是咱们的身份证号。内部标识符主要为了方便操作系统使用。外部标识符：咱们用户对进程的称呼。 就像是咱们的姓名。一般在其他进程调用本进程时使用。
>2、处理机状态（包含通用寄存器、指令寄存器、PSW等信息）。
>3、进程调度信息：进程状态、进程优先级、进程调度的其他信息。
>4、进程控制信息。

　　**PCB的组织形式**
>链队：每个进程都对应一个PCB，内存中的所有PCB通常使用链式指针，链接起来。使用链队链接的时候，不论进程处于何种状态，都将它们放到一个统一的链表中。此种方式适合于PCB不多的情况下。因为如果OS要调用一个就绪的进程，则需要从链表头开始寻找。浪费时间。
>
>表格结构：PCB在内存中按照原来的顺序排列，但是另建立一些表，不同的进程按照不同的状态被放到不同的表中。就绪进程表、阻塞进程表、执行进程表（保存当前正在执行的进程，在多CPU的系统中）。以此来提高效率。OS只需要分别记载每个PCB表的起始地址。当要调用一个就绪的进程时，可以节省查找时间。

　　**进程的状态**
　　即一个进程从产生至消亡的整个生命期间所处的各个状态。为了充分利用系统资源，将进程划分为若干状态，常见有如下两种划分方法。

　　三态模型：
>运行状态：进程正在占有CPU 。当某个进程获得CPU时，就进入了运行状态。
>就绪状态：进程具备运行条件，等待系统分配处理器以便运行。一个进程在创建后将处于就绪状态。该进程的CPU时间片结束，或在抢占式调度中有更高优先权进程请求占有CPU时，当前进程就从运行状态，转变为就绪状态。
>等待状态：又称为阻塞态或睡眠态，指进程不具备运行条件，正在等待某个事件的完成。此时，即使把CPU分给该进程，它也无法运行。当等待的事件已经完成时(如IO结束)，该进程就从等待状态进入就绪状态。

　　注意：就绪状态不能直接向阻塞状态转变，阻塞状态也不能直接向运行状态转变。

　　五态模型：
>新增了新建状态和终止状态。此时建立一个进程分为两个阶段：
>建立阶段：为一个新进程创建一个PCB，并填写必要的管理信息。
>提交阶段：将这个进程转为就绪状态，并放入就绪队列中。操作系统有时会限制推迟新建态进程的提交。新建状态对应于进程刚刚创建且没有提交状态。此时进程还没有进入内存。
>相应的进程的终止也分为两个阶段：
>　　第一个阶段：将进程从就绪队列中取出，并等待操作系统进行善后处理。
>　　第二个阶段：然后将PCB清空，并释放进程所占据的内存。
>当进程到达了自然结束点，或是出现无法克服的错误时，它将进入终止态。进入终止态的进程以后不再执行，但依然保留在操作系统中等待善后。一旦其他进程完成了对终止态进程的信息抽取之后，操作系统将删除该进程。

　　在一些系统中，进程除了具有上述状态外，还具有挂起状态。
>由于多任务系统中，内存中允许存在多个进程，且内存的空间是有限的，因此内存中进程的数量也是有限的，当内存的空间已经耗尽时，可以采用两种方式，继续运行新的进程：
>交换(swapping)技术：将内存中一些暂时不用的进程或暂时不用的程序和数据，暂时存放到外存中，然后腾出内存空间，接着让具备运行条件的进程 进入内存。这就是“交换”。当进程被换入外存时，它的状态被变为挂起状态。
>虚拟存储技术：每个进程只装入一部分程序和数据,然后就开始运行。其他部分，等需要的时候再装入。

　　小提示：
>1、在程序被运行后，系统首先要做的就是为该进程建立一个默认线程(即主线程)，然后程序可以根据需要自行添加或删除相关的线程。
>2、在某些系统中允许父进程在任何情况下终止子进程。且如果父进程终止了，则其所有的子进程也会被终止。 因此，在此种系统中进程的任何状态都可以转换成终止状态。

## CPU简介 ##

　　<font color='red'>中央处理器</font>（central processing unit，简称CPU）作为计算机系统的运算和控制核心，其功能主要是<font color='red'>解释计算机指令以及处理计算机软件中的数据</font>。根据冯诺依曼体系，CPU的工作分为以下 5 个阶段：取指令阶段、指令译码阶段、执行指令阶段、访存取数和结果写回。

　　中央处理器主要包括两个部分，即<font color='red'>控制器</font>、<font color='red'>运算器</font>，其中还包括高速缓冲存储器及实现它们之间联系的数据、控制的总线。
>控制器是指挥计算机的各个部件按照指令的功能要求协调工作的部件，是计算机的神经中枢和指挥中心，由指令寄存器IR（InstructionRegister）、程序计数器PC（ProgramCounter）和操作控制器OC（OperationController）三个部件组成，对协调整个电脑有序工作极为重要。
>
>运算器：arithmetic unit，计算机中执行各种算术和逻辑运算操作的部件。运算器的基本操作包括加、减、乘、除四则运算，与、或、非、异或等逻辑操作，以及移位、比较和传送等操作，亦称算术逻辑部件（ALU）。
>

　　**程序状态字**
　　程序状态字(PSW)是计算机系统的核心部件——运算器的一部分，每个正在执行的程序都有一个与其执行相关的PSW，一个程序占有CPU执行，它的PSW将被放到CPU的PSW中。
　　PSW包括三部分：
>1、程序基本状态：
>　　程序计数器：指明下一条执行的指令地址；
>　　条件码：表示指令执行的结果状态；
>　　处理器状态位：指明当前的处理器状态，如目态或管态、运行或等待。
>2、终端码。
>3、中断屏蔽位。

　　**机器指令和特权指令**
　　计算机的基本功能是执行程序。程序就是指令的集合。因此最终被执行的是存储在内存中的机器指令。处理器根据程序计数器（PC）从内存中取一条指令到指令寄存器（IR）并执行它。

　　CPU中指令系统中的机器指令分为两类：
>特权指令：顾名思义，一般的用户程序不能调用的指令。只能提供给操作系统或其他系统程序使用的指令。
>非特权指令：咱们的程序中可以执行的指令。

　　操作系统能执行全部指令(特权指令和非特权指令)，用户程序中不能执行特权指令。若执行了特权指令，会导致非法执行而产生中断。

　　**处理器的状态**
　　为避免用户程序中使用特权指令，CPU具有两种工作状态：目态和管态。
>管态：OS占用CPU时，CPU就处于管态。此时可以执行全部指令。
>目态：用户程序占用CPU时，CPU就处于目态。此时不允许执行特权指令。此时若CPU得到特权指令，CPU将拒绝执行该指令，并形成一个“程序中使用了非法指令”的信号。

　　现代操作系统都有一条“访管指令”。
>它是在目态下执行的指令，用户程序通过访管指令来向OS请求服务。执行到访管指令时，CPU从目态变为管态。然后由操作系统分析访管指令中的参数，然后让相应的“系统调用”子程序为用户服务。服务完了之后，管态变回目态。


<br>**本节参考阅读：**
- [百度百科 - CPU](https://baike.baidu.com/item/%E4%B8%AD%E5%A4%AE%E5%A4%84%E7%90%86%E5%99%A8/284033?fromModule=lemma_search-box&fromtitle=CPU&fromid=120556)
- [百度百科 - PSW](https://baike.baidu.com/item/PSW/1878339?fromModule=lemma_search-box)


## 进程的控制 ##

　　进程控制主要包括：创建进程、阻塞进程、唤醒进程、挂起进程、激活进程和撤销进程等。
　　进程的控制由OS内核(Kernel)中的<font color='red'>原语</font>实现。

　　原语(Primitive)
>是在管态下执行、由若干条机器指令组成的，用于完成特定功能的程序段。
>原语和机器指令类似，其特点是执行过程中不允许被中断，是一个不可分割的基本单位(要么都做，要么都不做)，原语的执行是顺序的也不可能是并发的。

>创建进程：使用创建原语。首先，申请一个空白的PCB。然后，为新进程分配内存等资源。接着，初始化进程控制块。最后，将进程放入到就绪队列中。
>阻塞进程：一个进程让出处理器，去等待一个事件。使用阻塞原语。如等待资源、等待 I/O完成等。引起阻塞的原因，通常都是进程自己调用阻塞原语阻塞自己。
>唤醒进程：当一个等待事件(如IO完成)结束会产生一个中断，从而，激活操作系统，在系统的控制之下将被阻塞的进程唤醒。使用唤醒原语。提示：操作系统这门课程是有前驱课程的，所以如果基础不牢，学起来就费劲。
挂起进程：系统在超过一定的时间没有任何动作等情况下，进程就会被挂起。引入挂起主要的目的是为了缓和内存紧张的状况，将进程放到磁盘对换区中。进程挂起需要使用挂起原语。挂起原语既可由进程自己也可由其他进程调用。正在运行的进程也可以直接挂起。
>激活进程：当系统资源尤其是内存资源充裕或一个进程请求激活指定进程时，系统或有关进程会调用激活原语把指定进程激活。激活原语却只能由其他进程调用。不能由待激活进程调用。
>撤销进程：一个进程完成了特定的工作或出现了严重的异常后，操作系统则收回它占有的内存地址空间和进程控制块，此时就说撤销了一个进程。使用撤销原语。 

　　原语与系统调用：
>相同点：原语和系统调用都使用访管指令实现，具有相同的调用形式。
>不同点：<font color='red'>原语由内核来实现，系统调用由系统进程或系统服务器实现。</font>原语不可中断。系统调用执行时允许被中断。通常情况下，原语提供给系统进程或系统服务器使用。系统进程或系统服务器提供系统调用给系统(和用户) 程序使用。 

　　**进程的切换**
　　进程切换的时机有：当某进程时间片结束、当某进程IO阻塞>内存出错等。
　　同时，系统进行进程切换(多个程序轮流占有CPU) 时，不是简简单单就可以完成的。需要分别保存和恢复相应进程现场，修改进程状态，调整和更新表格和队列。

## 进程同步 ##

　　在多道程序设计的系统中，由于多个进程可以并发执行，每个进程都以各自独立的、以不可预知的速度向前推进，进程间产生接触（资源共享和相互合作）是必然的，我们把异步环境下的一组并发进程<font color='red'>因直接制约而互相发送消息、进行互相合作、互相等待</font>，使得各进程按一定的速度执行的过程称为<font color='red'>进程间的同步</font>。

　　**资源共享**
>指的是多个进程要同时访问一个临界资源，比如打印机。
>正常的处理方式应该设定为：只有先来的可以访问，后来的进程必须等待其访问结束后。
>此时进程间是<font color='red'>竞争的关系</font>，也称为<font color='red'>互斥关系</font>，即多个进程需要互斥使用打印机。

　　**相互合作**
>假设有两个进程A和B，A需要对一个文件进行写入操作，B需要从文件中将A写入的数据读出来，如果B执行的比A快，则B就需要等待A将数据写入到文件后，才可以顺利读取。也就是说一个进程的继续执行，是以另一个进程的执行结束为前提。若进程A未结束，则即使进程B早到了，它也必须等待。此时进程间是<font color='red'>合作的关系</font>，也称为<font color='red'>同步关系</font>。

　　**临界区**
　　不论是硬件临界资源，还是软件临界资源，多个进程必须互斥地对它进行访问。每个进程中访问临界资源的那段代码称为<font color='red'>临界区(Critical Section)</font>。临界区是隶属于进程的。
　　临界区管理的原则：
>有空则进：当无进程处于临界区时，允许进程进入其自己的临界区，且只能运行有限时间。
>无空则等：当有一个进程在临界区时，其他需要进入(其自己的)临界区的进程也必须等待。
>有限等待：对要求访问临界资源的进程，应保证其等待时间是有限的。
>让权等待：当进程在临界区门口等待时，应立即释放CPU。使其他进程可以执行。

　　**信号量机制**

　　前面说进程间关系有：<font color='red'>互斥关系和同步关系</font>，接下来简单的介绍一下当两个进程处于这两种关系时，系统解决他们的大致思路。

　　首先我们来看一下<font color='red'>互斥关系</font>，假设现在系统中有个临界资源，以及A、B两个进程。
　　如下图所示：

<center>
![](/img/base/base001_01.png)
</center>

　　设一个整型变量S，用来保存当前系统中剩余的资源数量，P操作表示申请一个资源，V操作表示释放一个资源，对S进行P操作，记作P(S)，相应的也有V(S)，PV操作是由进程来控制完成的。

　　进行P操作时S减去1，执行完P操作后(也就是S-1之后)，进行如下判断：
>若S>=0，说明系统中本来就有资源，申请成功，当前进程进入临界区继续向下执行。
>若S<0，说明申请失败，则进程就要在此等待，什么时间有资源了什么时间再次申请。其中|S| = 当前正在等待的进程的个数。
>进程如果进入等待状态，则需要别的进程将其唤醒，进程等待时，不会被分配到CPU时间片。   

　　相应的进行V操作时S增加1，执行完V操作后(也就是S+1之后)，进行如下判断：
>S>0，说明系统中现在有空闲资源，进程直接向下执行。
>S<=0，说明S原来的值为负数，即系统中有进程正在等待，所以要从等待队列(队首)中取出一个进程，将这个资源交给它，即唤醒一个进程，然后执行V操作的进程，继续向下执行。

　　这里使用的变量S就被称为是<font color='red'>信号量</font>。


　　然后我们再来看一下<font color='red'>合作关系</font>，假设情况是这样的：
>有一张桌子，桌子上只能存放5盘菜。
>有一个厨师不断的做菜，然后将菜放到桌子上，如果桌子满5盘，则就停止做菜。
>有一个食客不断的吃菜,如果桌子空了，则就歇会。
>吃菜和放菜不能同时进行。

<center>
![](/img/base/base001_02.png)
</center>

　　若厨师先执行，则厨师一开始检测一下，桌子上的菜是否为5：
>若为5，证明已经满了，则厨师进入等待，CPU此时会转交给食客。否则，则厨师做一盘菜放到桌子上，并唤醒食客吃。

　　若食客先执行，则食客一开始检测一下，桌子上的菜是否为0：
>若为0，证明已经空了，则食客进入等待，CPU此时会转交给厨师。否则，则食客吃一盘菜，并唤醒厨师继续做。

　　在长期且广泛的应用中，信号量机制又得到了很大的发展，它从整型信号量经记录型信号量，进而发展为“信号量集”机制。现在，信号量机制已经被广泛地应用于单处理机和多处理机系统以及计算机网络中。

<br>**本节参考阅读：**
- [百度百科 - 信号量机制](https://baike.baidu.com/item/%E4%BF%A1%E5%8F%B7%E9%87%8F%E6%9C%BA%E5%88%B6?fromModule=lemma_search-box)
- [百度百科 - 进程同步](https://baike.baidu.com/item/%E8%BF%9B%E7%A8%8B%E5%90%8C%E6%AD%A5?fromModule=lemma_search-box)


## 进程调度 ##

　　无论是在批处理系统还是分时系统中，用户进程数一般都多于<font color='red'>处理机</font>数、这将导致它们互相争夺处理机。另外，系统进程也同样需要使用处理机。这就要求进程调度程序按一定的策略，动态地把处理机分配给处于就绪队列中的某一个进程，以使之执行。
>处理机包括中央处理器，主存储器，输入-输出接口，加接外围设备就构成完整的计算机系统。

　　**调度的方式**
>可剥夺式：当一个进程正在运行时，系统可以基于某种原则，剥夺已分配给它的处理机，将之分配给其它进程。剥夺原则有：优先权原则、短进程优先原则、时间片原则。
>
>不可剥夺式：分派程序一旦把处理机分配给某进程后便让它一直运行下去，直到进程完成或发生某事件而阻塞时，才把处理机分配给另一个进程。

　　常用的进程调度算法有如下几种：

　　**1、先进先出算法**
>算法总是把处理机分配给最先进入就绪队列的进程，一个进程一旦分得处理机，便一直执行下去，直到该进程完成或阻塞时，才释放处理机。
>例如，有三个进程P1、P2和P3先后进入就绪队列，它们的执行期分别是21、6和3个单位时间，
>执行情况如下：
>对于P1、P2、P3的周转时间为21、27、30，平均周转时间为26。
>可见，FIFO算法服务质量不佳，容易引起作业用户不满，<font color='red'>常作为一种辅助调度算法</font>。

　　**2、短进程优先**
>最短CPU运行期优先调度算法，该算法从就绪队列中选出下一个“CPU执行期最短”的进程，为之分配处理机。
>例如，在就绪队列中有四个进程P1、P2、P3和P4，它们的下一个执行期分别是16、12、4和3个单位时间，执行情况如下：
>P1、P2、P3和P4的周转时间分别为35、19、7、3，平均周转时间为16。
>该算法虽可获得较好的调度性能，但难以准确地知道下一个CPU执行期，而只能根据每一个进程的执行历史来预测。

　　前两种算法主要用于批处理系统中，不能作为分时系统中的主调度算法，<font color='red'>在分时系统中，都采用时间片轮转法</font>。

　　**3、时间片轮转法**

>系统将所有就绪进程按先进先出规则排队，每次调用时将处理机分派给队首进程，让其执行一个时间片，时间片一到，发生时钟中断，将该进程送到就绪队列末尾，并切换执行当前的队首进程。
>时间片的长度有两种：固定时间片（分给每个进程的时间片相等）和可变时间片（根据进程不同的要求对时间片的大小实时修改）。

　　**4、优先级调度**

>优先级调度：每一个进程都有一个优先级，进程调度的时候，总是选择优先级高(数值大)的进程。
>优先级调度分为：
>静态优先级：进程的优先级在创建的时候就确定了，直到进程终止都不会改变。
>动态优先级：创建进程时赋予一个优先级，在运行中还可以改变，以便获得更好的调度性能。

<br>**本节参考阅读：**
- [百度百科 - 进程调度](https://baike.baidu.com/item/%E8%BF%9B%E7%A8%8B%E8%B0%83%E5%BA%A6/10702294?fr=aladdin)

## 死锁 ##

　　关于死锁：说白了就是“You first，You first”问题，双方谁都不愿意先做，导致最终相互等待。
　　比如说：
>抢劫犯要求： 你们先给我钱，我放人。
>受害者家属要求： 你先放人，我们给你钱。

　　双方都手持着对方想要的东西不放，且还想得到对方的东西。
　　最终结果就是双方相互僵持着，这就是死锁。

# 第三节 存储器管理 #

## 基础入门 ##

　　存储器管理的对象是主存，也称内存。它的主要功能包括分配和回收主存空间、提高主存利用率、扩充主存、对主存信息实现有效保护。

　　**存储器的分类**
　　计算机系统的存储器可以分为：
>寄存器（register）位于CPU内部，是CPU用来存放数据（二进制代码）的一些小型（一般就存几位二进制）存储区域，用来暂时存放参与运算的数据和运算结果，是计算机系统中最快的存储器。
>
>缓冲存储器(Cache)是一种高速缓冲存储器，是为了解决CPU和主存之间速度不匹配而采用的一项重要技术。Cache是介于CPU和主存之间的小容量存储器，但存取速度比主存快，当CPU需要数据时，会先尝试从Cache中读取，如果Cache中仍然找不到，则才会去主存中取数据。主存容量配置几百MB的情况下，Cache的典型值是几百KB。Cache能高速地向CPU提供指令和数据，从而加快了程序的执行速度。
>
>主存：主存储器的存储容量较大，存取速度也很快。
>
>外存：又称辅存，辅助存储器的存储容量很大，可用来长期存储信息，处理器能直接访问寄存器、主存和缓存，但不能直接读写辅存上的信息。比如：硬盘、U盘等。

　　**系统区和用户区**

>系统区：操作系统自身必须占用内存的一部分存储空间，用来存放操作系统的程序、数据、管理信息以及操作系统与硬件接口信息等，我们把这部分空间称为系统区。
>用户区：除系统区外的其余主存空间可用来存放用户的程序和数据，称为用户区。存储管理主要是对主存储器中的用户区域进行管理。

　　**地址映射**
　　咱们通常用高级语言编写的程序，称为源程序。源程序是不能被计算机直接执行的，需要通过编译程序或汇编程序编译或汇编获得目标程序。目标程序中变量、函数等使用的地址不是内存的实际地址，而是<font color='red'>逻辑地址或称为相对地址</font>，程序运行的时候，OS会在内存中开辟一个进程，这里所说的相对地址，就是建立在进程所占的地址基础之上。

　　为了保证CPU执行指令时可正确访问存储单元，需将用户程序中的<font color='red'>逻辑地址</font>转换为运行时由机器直接寻址的<font color='red'>物理地址（主存中的实际存储单元称为物理地址，也称为绝对地址）</font>，这一过程称为<font color='red'>地址映射</font>。

　　地址映射通常有两种方式：静态映射和动态映射。

　　**静态映射**
　　在程序装入内存的过程中完成。即在程序开始运行前，程序中的各个地址有关的项均已完成映射，地址变换通常是在装入时一次完成的，以后不再改变，故称为静态映射。
>此时程序所占的内存空间大小及物理地址都是固定的，程序在内存中无法移动，且需要为程序分配连续的内存空间，在早期的OS中都使用此种方式。

　　**动态映射**
　　在程序运行过程中要访问数据时再进行地址变换（即在CPU每执行一条指令，就算出这条指令所在的内存空间，一般为了提高效率，此工作会由软件硬件结合完成）。
>此时不必给程序分配连续的主存空间，可以提高内存利用率。
>通过改变基址寄存器中的值，来使程序在内存中移动，即所谓“换入”“换出”内存空间。

　　**存储保护**
　　在内存中，同时存在OS程序和用户程序，OS要求它们各自在自己的空间中执行，相互不能干扰，为了实现这个目的，OS必须对主存中的程序和数据进行保护，以免其他程序<font color='red'>有意或无意</font>的破坏，这一工作称为存储保护。

　　**存储扩充**
　　存储扩充的原因：
>内存：速度快、容量小、价格贵。
>外存：容量大、速度慢、价格低。

　　因此，在多道程序设计时，采用软件的手段，在硬件的配合下，将部分外存空间虚拟为内存空间，得到一个容量相当于外存、速度接近于内存的虚拟存储空间，以便使更多的进程驻留内存中。
　　操作系统负责完成内存与外存之间的切换：可以将进程运行时需要的数据或代码放入内存，也可以将暂时不用的交换到外存。

<br>**本节参考阅读：**
- [百度百科 - 寄存器](https://baike.baidu.com/item/%E5%AF%84%E5%AD%98%E5%99%A8?fromModule=lemma_search-box)
- [百度百科 - 地址映射](https://baike.baidu.com/item/%E5%9C%B0%E5%9D%80%E6%98%A0%E5%B0%84?fromModule=lemma_search-box)

## 存储管理方案 ##

　　所谓的存储管理方案，就是说如何合理、高效的利用容量不大的内存为最多的进程提供资源。

　　常见的存储管理方案有：<font color='red'>单用户连续</font>存储管理、<font color='red'>分区</font>存储管理、<font color='red'>分页</font>存储管理、<font color='red'>分段</font>存储管理、<font color='red'>虚拟</font>存储管理。其中单用户连续存储管理是早期OS（单道批处理操作系统）所使用的存储方案，为用户程序分配一个连续的存储空间。

### 分区存储管理 ###

　　将内存的<font color='red'>用户区</font>划分成多个区域，每个区域分配给一个程序使用，并限制它们只能在自己的区域中运行。 按划分方式不同，又分为：<font color='red'>固定分区</font>、<font color='red'>可变分区</font>、<font color='red'>可重定位分区</font>。

　　**固定分区**
　　固定分区存储管理是预先把可分配的主存储器空间分割成若干个连续区域，每个区域的大小可以相同，也可以不同，但大小一旦确定则不可以更改。由于分区的大小是固定的，但进程的大小却是不固定的，为了保证进程的执行，往往会申请过大的内存空间，因此在每个分区中，可能存在未利用的空间。咱们称这些空间为：“内碎片”或“内零头”。

　　OS中还有一张“主存分配表”，用以记录主存被划分为多少个分区以及各分区的使用情况：

分区号| 起始地址 | 长度 | 占用标记 
:-:|:-:|:-:|:-:|:-:|:-:
1 | 8K | 8K | Job2 
2 | 16K | 16K | 0 
3 | 32K | 16K | Job1 
4 | 48K | 64K | 0 
5 | 64K | 32K | 0 
6 | 96K | 32K | 0 

>主存分配表指出各分区的起始地址和长度。
>表中的占用标志位用来指示该分区是否被占用了，标志位为“0”表示尚未被占用。
>进行主存分配时总是选择那些标志为“0”的分区，当某一分区分配给一个作业后，则在占用标志栏填上占用该分区的作业名。

　　**可变分区**
　　可变分区方式是按作业的大小来划分分区，分区可以不断的重建和回收。具体来说：
>操作系统事先并不将内存划分成若干个连续的分区，而是当要装入一个作业时，必须找一个足够大（超过作业需要的量）的空闲区A（连续空间）。
>　　若有，则将该空闲区A分割出一个连续的区域给该作业，作业装入后，原来的空闲区A剩余的部分则被视为一个较小的空闲区。
>　　若无，则挂起该作业，等待主存空间。
>当一作业结束撤离时，它归还的区域如果与其它空闲区相邻，则可合成一个较大的空闲区，以利大作业的装入。

　　随着作业的装入、撤离（主存的申请、释放、合并），会产生碎片，时间越久，碎片越多，当内存中剩余的空间，小到难以分配给任何一个进程的时候，我们称这些分区为“外零头”。有的时候，这些不连续的外零头加在一起的总大小，比一个作业所申请的空间要大。

　　**分区保护**
　　分区存储管理中每一个分区都必须占据一个连续的存储空间，对分区保护有两种方式：
>上界和下界寄存器：上界寄存器存放作业的装入地址，下界寄存器存放作业的结束地址。程序可用的地址范围：上界寄存器<= x <=下界寄存器 。
>
>基址寄存器和限长寄存器：限长寄存器保存作业的长度，程序可用的地址范围：基址寄存器(进程起始地址)<= x <基址寄存器+限长寄存器 。

　　只要超过了界限，则就认为是地址越界。

### 分页存储管理 ###

　　分页存储的特点：可以将一个进程存储在若干不连续的存储空间中。

　　**实现原理**
>先将进程的逻辑地址空间分成若干个大小相等的片，称为页，并为各页加以编号，从0开始。
>再将内存空间分成与页面相同大小的若干存储块，称为（物理）块或<font color='red'>页框</font>，同样从0开始编号。
>在为进程分配内存时，将进程中的若干个页分别装入到多个可以不相邻接的物理块中。


　　**页表**
　　系统将进程的每一页离散地分配到内存的多个页框中，应该保证能在内存中快速找到每个页面所对应的物理地址，页表的作用是实现从页号到物理块号的地址映射。

<center>
![](/img/base/base001_03.png)
</center>

　　每个进程都具有一个页表，在CPU中存在一个页表寄存器，在页表寄存器中存放页表在内存的始址和页表的长度。
>进程未被调度时，页表的始址和页表长度存放在本进程的PCB中。
>进程被调度时，页表的始址和页表长度存放在页表寄存器中。

　　提示：
>由于进程的最后一页经常装不满一块而形成了不可利用的碎片，称之为“页内碎片”。
>分页存储管理的每一页的大小都要小于分区管理每个区的大小，因此有效的减少了内零头的浪费。由于其不需要连续的存储空间，所以同时也解决了外零头的问题。

### 分段存储管理 ###

　　分段存储管理和分页存储管理高度类似：
>进程被划分为若干段，段会被从0开始编号，存在段表的概念。
>整个进程所占据的内存空间也不是连续的，每个段内的空间必须是连续的。

　　不同的是：
>段的体积比页大，所谓的段，说白了咱们C语言源程序中的，每一个函数都可以称为一个段。
>每段都有自己的名字(函数名)，段与段的长度可以不相等。

### 虚拟存储管理 ###

　　分区、分页、分段存储管理必须为每个进程分配足够的内存空间，以便装入全部信息，可是当程序的存储空间要求大于实际的内存空间时，进程就无法进入内存中。虚拟存储管理允许只将进程一部分内容装入内存便可以开始执行，其余部分在使用的时候再去外存中取。

　　虚拟存储也会把一个程序所需要的存储空间分成若干页或段。大致的工作流程为：
>若它想要访问的某个页(段)已调入主存，便可继续执行下去。
>若要访问的页(段)不存在内存中，即缺页(段)，则继续判断：
>　　若内存中有空闲空间：程序可以使用OS所提供的请求调页(段)功能，将它们调入主存，以使进程能继续执行下去。
>　　若内存中无空闲空间：程序还需要再利用OS提供的页(段)置换功能，将内存中暂时用不到的页(段)调出至磁盘上，腾出足够的主存空间后，再将所要访问的页(段)调入主存，使程序继续执行下去。

　　之所以能实现虚拟存储，是因为程序的执行具有局部性：
>比如你的软件有20个页面，但用户在同一个时间内，大概率只会与一个或者有限的几个页面进行交互，OS就可以先将其它页面放到外存中，等有需要的时候再将它们调入。


<br>**本节参考阅读：**
- [百度百科 - 存储管理](https://baike.baidu.com/item/%E5%AD%98%E5%82%A8%E7%AE%A1%E7%90%86?fromModule=lemma_search-box)

<br><br>