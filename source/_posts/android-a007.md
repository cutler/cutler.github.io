---
title: 第七章 安全篇
date: 2016-4-8 15:32:40
author: Cutler
categories: Android开发
---

# 第一节 数据加密 #

　　本节来介绍一下加密相关的知识。在这里要特别感谢`天朝狂飚-标哥`的无私分享，本文参考了他的教案，并作出不少扩展。

## 密码学的历史 ##
　　著名的密码学者`Ron Rivest`解释道：“密码学是关于如何在敌人存在的环境中通讯”，而事实也确实如此，古人脑洞大开的加密创造都是源于战争：

    公元前5世纪，希腊城邦为对抗奴役和侵略，与波斯发生多次冲突和战争。
    于西元前480年，波斯秘密结了强大的军队，准备对雅典和斯巴达发动一次突袭。
    希腊人狄马拉图斯在波斯的苏萨城里看到了这次集结，便利用了一层蜡把木板上的字遮盖住，送往并告知了希腊人波斯的图谋。
    最后，波斯海军覆没于雅典附近的沙拉米斯湾。
<!-- more -->
<br>　　古中国周朝兵书也记载了我们对密码学的运用。
　　其中的[《阴符》](http://so.gushiwen.org/guwen/bookv_4981.aspx)和[《阴书》](http://so.gushiwen.org/guwen/bookv_4982.aspx)便记载了周武王问姜子牙关于征战时与主将通讯的方式：

    点开上面的链接就可以查看《阴符》和《阴书》的原文，通过阅读其中的译文我们可以知道：
    -  阴符是以八等长度的符来表达不同的消息和指令，可算是密码学中的替代法。
    -  阴书则运用了移位法，把书一分为三，分三人传递，要把三份书重新拼合才能获得还原的信息。

<br>　　凯撒密码是最经典的替代法，据传由古罗马皇帝凯撒所发明，用在与远方将领的通讯上，每个字母被其后第三个字母替换。

<center>
![凯撒密码](/img/android/android_BY_b02_01.jpg)
</center>

　　对于在座的各位来说，要在Android中实现凯撒密码的加密和解密是非常轻松的，所以笔者就不介绍具体步骤了。

<br>　　有警察相应的就会有强盗，所以想破解凯撒密码的人也不少，并且最终确实也破解了：

    我们知道在一篇文章中，总会有某一个字符出现的次数是最多的。
    -  比如汉字文章中，"的"、"一"、"了"、"是"、"我"等字的出现频率非常高。
    -  而在英文文章中，"e"、"t"等字母出现的频率最高。
    基于这个原理，我们可以先统计出密文中出现最高的字符，比如得到的是'h'，然后计算字符'h'到'e'的偏移量，值为3，表示原文偏移了3个位置，最后把密文所有的字符偏移3个位置即可。

<br>　　但是盗高一尺警高一丈，这种破解方式也很容易被针对，比如：

    第一种方法，明文中尽量少用包含e这类大家都知道的、高频率出现的字母的单词。
    第二种方法，让明文中每个字母的偏移量不同。即让第一个字母偏移2个位置，第二个字母偏移9个位置等等。这样一来，即便别人破解了某个字母，但是依然看不到明文，除非他破解所有字母。

<br>　　本节只是为了告诉大家密码学的相关历史知识，并没有其他特殊意图，正经的东西从下一节开始介绍。另外在科技快速发展的当今，加密除了在军事上应用外在商业上也大规模应用，商场也如战场。

<br>**本节参考阅读：**
- [维基百科 - 密码学](https://zh.wikipedia.org/zh-cn/%E5%AF%86%E7%A0%81%E5%AD%A6) 
- [加密的前世今生](http://www.ip-guard.net/blog/?p=1679) 

## 对称加密 ##

<br>　　加密和解密都使用同一个密钥，这种加密方式称为对称加密，也称为单密钥加密。

    -  加密的时候，将明文和密钥混在一起，通过特定的加密算法，生成密文。
    -  解密的时候，将密文和密钥混在一起，通过特定的解密算法，生成原文。

<br>　　常见的对称加密算法有`DES`、`3DES`、`AES`、`Blowfish`、`IDEA`、`RC5`、`RC6`。


<br>　　**DES算法**

　　我们先来看一下DES算法的产生过程：

    -  1972年，美国国家标准与技术研究院（NIST）开始征集用于加密政府内非机密敏感信息的加密标准。
    -  1973年5月15日，在咨询了美国国家安全局（NSA）之后，NBS向公众征集可以满足严格设计标准的加密算法。
    -  然而，当时没有任何一个提案可以满足这些要求。因此在，1974年8月27日，NBS开始了第二次征集。
    -  这一次，IBM提交了一种在1973-1974年间发展的算法，这份提案被有限度的接受了。
    -  DES在1976年11月被确定为联邦标准，并在1977年1月15日作为FIPS PUB 46发布，被授权用于所有非机密资料。

<br>　　由于DES的加密原理比较复杂，网上资料也不少，所以我们就不去关注它的原理了，只需要知道它是一个加密算法即可。

　　DES算法的特点：

    -  首先，DES算法要求它的密钥长度是64位的，即8个字节。
    -  另外，在64位的密钥中，只有其中的56位被实际用于算法，其余8位可以被用于奇偶校验，并在算法中被丢弃。
    -  因此，DES的有效密钥长度为56位，通常称DES的密钥长度为56位。

<br>　　范例1：多说无益，直接开整。
``` java
// 加密算法
private final static String ALGORITHM = "DES";

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        String text = "Hello World";        // 明文文本
        String key = "12345678";            // 密钥
        // 创建出一个适用于DES算法的密钥对象，即SecretKey类的对象就表示密钥。
        SecretKey secretkey = new SecretKeySpec(key.getBytes(), ALGORITHM);
        // 创建一个适用于DES算法的密码机对象。
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        // 初始化密码机，即让它稍后执行加密操作，同时把密钥设置给它。
        cipher.init(Cipher.ENCRYPT_MODE, secretkey);
        // 调用doFinal来让密码机执行加密。
        byte[] bytes = cipher.doFinal(text.getBytes());
        System.out.println("密文：" + new String(bytes));  // 程序会输出：“密文：�Rd��ʩ]��h��w”
        // 解密。
        cipher.init(Cipher.DECRYPT_MODE, secretkey);
        bytes = cipher.doFinal(bytes);
        System.out.println("明文：" + new String(bytes));  // 程序会输出：“明文：Hello World”
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    }
}
```
    语句解释：
    -  使用Cipher类进行加密或者解密的时候，返回值都是byte数组类型的。
    -  在使用DES加密算法时，设置给Cipher类的密钥只能是8个字节（比如密钥为12345678），否则程序就会抛异常。
    -  第18行代码出现的乱码，是因为“new String(bytes)”会试图将加密后的byte[]中的数据按照UTF-8编码映射成字符。但是加密后返回的byte[]里面的数据是不确定的，是有可能是负数的。而我们试图将一个负数转换成UTF-8字符集里的字符，显然得到的只能是一个问号。

<br>　　在实际开发中，我们通常会将加密后的`byte[]`转成`String`进行传输，就像下面这样。

<br>　　范例2：转成字符串。
``` java
// 加密
cipher.init(Cipher.ENCRYPT_MODE, secretkey);
byte[] bytes = cipher.doFinal(text.getBytes());
// 将加密后的byte[]转为String对象。
String secretText = new String(bytes);
System.out.println("密文：" + secretText);   // 程序会输出：“密文：�Rd��ʩ]��h��w”

// 解密
cipher.init(Cipher.DECRYPT_MODE, secretkey);
// 将刚才加密时得到的String对象转成byte[]，然后再进行加密。
bytes = cipher.doFinal(secretText.getBytes());
System.out.println("明文：" + new String(bytes));
```
    语句解释：
    -  上面的代码乍一看是没问题的，但是在程序执行到第11行代码的时候就会抛异常。
    -  这是因为在解密的时候，我们是针对“secretText.getBytes()”的返回值进行解密的，这是相当于：
       -  首先，对“Hello World”.getBytes()进行加密，得到一个byte[]。
       -  然后，再将这个byte[]数组转换成String串。
          -  需要注意的是，在我们将byte[]转成String时，已经使原本的加密数据被破坏了。
          -  因为系统会自动将它解析不了的数字转成一个问号字符，而这个问号字符其实是有自己的编码的。
          -  换句话说，假设我们原本的数据是-100，但是问号的编码是-1，所以当将byte[]转成String时，-100就变成-1了。
       -  最后，对包含问号字符的String串进行解密，显然会报错。


<br>　　人们为了解决这个问题，就提出了`Base64`编码：

    Base64是一种基于64个可打印字符来表示二进制数据的表示方法。
    Base64支持包括字母A-Z、a-z、数字0-9，共有62个字符，还有2个符号在不同的系统中不同。
    Base64常用于处理文本数据的场合，表示、传输、存储一些二进制数据。


<br>　　范例3：使用`Base64`编码。
``` java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        String text = "Hello 虎爷";
        String key = "12345678";
        SecretKey secretkey = new SecretKeySpec(key.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        // 加密
        cipher.init(Cipher.ENCRYPT_MODE, secretkey);
        byte[] bytes = cipher.doFinal(text.getBytes());
        // 将加密后的字节数组编码成一个可读的字符串。
        // 然后我们就可以将这个字符串传递到任意地方了。
        String secretText = Base64.encodeToString(bytes, Base64.DEFAULT);
        System.out.println("密文：" + secretText);  // 密文：pM0eIV9y515OjSnPOPcNTg==
        // 解密
        cipher.init(Cipher.DECRYPT_MODE, secretkey);
        // 当我们接到使用Base64编码的字符串时，使用下面的方法可以将Base64字符串解码成一个byte[]。
        // 解码之后我们就可以对byte[]进行解密操作了。
        bytes = cipher.doFinal(Base64.decode(secretText, Base64.DEFAULT));
        System.out.println("明文：" + new String(bytes));  // 明文：Hello 虎爷
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```
    语句解释：
    -  如果仔细观察的话，就会发现有时候Base64编码出来的字符串的末尾会包含若干的“=”。
    -  这是因为当原数据长度不是3的整数倍时，会在末尾自动补齐“=”：
       -  如果最后剩下一个输入数据，在编码结果后加2个“=”。
       -  如果最后剩下两个输入数据，编码结果后加1个“=”。
       -  如果没有剩下任何数据，就什么都不加，这样才可以保证数据还原的正确性。

<br>　　需要知道的是，DES现在已经不是一种安全的加密方法，主要因为它使用的56位密钥过短。

    -  1999年1月，distributed.net与电子前哨基金会合作，在22小时15分钟内即公开破解了一个DES密钥。
    -  也有一些分析报告提出了该算法的理论上的弱点，虽然在实际中难以应用。
    -  为了提供实用所需的安全性，可以使用DES的派生算法3DES来进行加密，虽然3DES也存在理论上的攻击方法。

<br>　　而关于3DES，需要知道的是：

    -  3DES（Triple DES，三重数据加密算法），相当于是对每个数据块应用三次数据加密标准（DES）算法。
    -  由于计算机运算能力的增强，原版DES密码的密钥长度变得容易被暴力破解。
    -  3DES通过增加DES的密钥长度来大大延长了被暴力破解的时间，而不是设计一种全新的块密码算法。
    -  3DES使用3条64位的密钥对数据进行三次加密，每条密钥实际有效均为56位（除去奇偶校验位）。


<br>　　范例4：使用`3DES`加密。
``` java
// 加密算法的名称。
private final static String ALGORITHM = "DESede";

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    try {
        String text = "Hello 虎爷";
        String key = "12345678901234567890abcd";

        // 创建一个密钥。
        SecretKey secretkey = new SecretKeySpec(key.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);

        // 加密
        cipher.init(Cipher.ENCRYPT_MODE, secretkey);
        byte[] bytes = cipher.doFinal(text.getBytes());
        String secretText = Base64.encodeToString(bytes, Base64.DEFAULT);
        System.out.println("密文：" + secretText);  // 密文：ySdwoHvFH66uvgVQZIlFrA==

        // 解密
        cipher.init(Cipher.DECRYPT_MODE, secretkey);
        bytes = cipher.doFinal(Base64.decode(secretText, Base64.DEFAULT));
        System.out.println("明文：" + new String(bytes));  // 明文：Hello 虎爷
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    }
}
```
    语句解释：
    -  从本范例中可以发现，3DES加密与DES加密的代码完全一样，只不过把加密算法改为DESede了。
    -  对于3DES加密来说，密钥的长度只支持16和24字节两种：
       -  16字节的密钥，安全性稍低，拥有2 x 56 = 112个独立的密钥位。
       -  24字节的密钥，强度最高，拥有3 x 56 = 168个独立的密钥位。

<br>　　关于3DES，还有一些需要知道的是：

    -  我们都知道，在计算机的世界计算速度翻倍的时间非常快。3DES虽然已经不错了，但是依然可能被暴力破解，因此在计算机计算能力飞速发展的今天，它已经不再安全。
    -  因此，DES加密只推荐使用在加密等级不高的场景中。而对于安全性更高的场景，可以使用AES加密算法。

<br>　　关于AES，需要知道的是：

    这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院（NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。AES的区块长度固定为128比特，密钥长度则可以是128，192或256比特，对应的也就是16字节、24字节、32字节。

<br>　　范例5：使用`AES`加密。
``` java
private final static String ALGORITHM = "AES";

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        String text = "Hello 虎爷";
        String key = "12345678901234567890abcd";

        // 创建一个密钥。
        SecretKey secretkey = new SecretKeySpec(key.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);

        // 加密
        cipher.init(Cipher.ENCRYPT_MODE, secretkey);
        byte[] bytes = cipher.doFinal(text.getBytes());
        String secretText = Base64.encodeToString(bytes, Base64.DEFAULT);
        System.out.println("密文：" + secretText);  // 密文：5YU0h95+zkDGvrvcOhWKGA==

        // 解密
        cipher.init(Cipher.DECRYPT_MODE, secretkey);
        bytes = cipher.doFinal(Base64.decode(secretText, Base64.DEFAULT));
        System.out.println("明文：" + new String(bytes));  // 明文：Hello 虎爷
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    }
}
```
    语句解释：
    -  从本范例中可以发现，AES加密与DES加密的代码完全一样，只不过把加密算法改为AES了。
    -  就像上面说的那样，AES的密钥长度只能是16字节、24字节、32字节，三者之一。

<br>　　在使用DES、AES加密时，有一个问题需要注意：

    在开发时会发现Android使用DES/AES加密出来的数据，服务端没法解密，反过来服务端加密的Android端也不能解密。这是因为使用DES/AES算法加解密时，还可以为它设置另外两个附加选项，如果这两个附加选项的值Android端与服务端设置的不一致的话，就会导致相互无法解密。

<br>　　解决的方法就是，修改我们前面定义的那个常量`ALGORITHM`的值：
``` java
private final static String ALGORITHM = "AES/ECB/PKCS5Padding";
```
    语句解释：
    -  此时这个常量值表示：加密算法/工作模式/填充模式。
    -  至于“工作模式/填充模式”有哪些取值，以及它们分别表示什么，网上一大堆请自行搜索。

<br>**本节参考阅读：**
- [维基百科 - DES](https://zh.wikipedia.org/zh-cn/%E8%B3%87%E6%96%99%E5%8A%A0%E5%AF%86%E6%A8%99%E6%BA%96) 
- [维基百科 - Base64](https://zh.wikipedia.org/zh-cn/Base64) 


## 非对称加密 ##

<br>　　非对称加密算法需要两个密钥：公钥（publickey）、私钥（privatekey）。

    公钥和私钥是一对的，如果用公钥加密，那么只有私钥才能解密，反之用私钥加密，也只能用公钥才能解密。
    由于加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密。

　　至于为什么会出现非对称加密，后面会详细介绍，此处大家只需要理解其概念即可。
　　接下来我们来介绍一个比较常用的非对称加密算法：RSA加密算法。

    -  1977年，三位数学家Rivest、Shamir和Adleman设计了一种算法，可以实现非对称加密。
    -  这种算法用他们三个人的名字命名，叫做RSA算法。从那时直到现在，RSA算法一直是最广为使用的非对称加密算法。毫不夸张地说，只要有计算机网络的地方，就有RSA算法。
    -  这种算法非常可靠，密钥越长，它就越难破解。根据已经披露的文献，目前被破解的最长RSA密钥是768个二进制位。也就是说长度超过768位的密钥，还无法破解（至少没人公开宣布）。
    -  因此可以认为，1024位的RSA密钥基本安全，2048位的密钥极其安全。

　　要彻底理解RSA算法，则需要搞懂“质因数”、“欧拉函数”、“模反元素”等概念，这些在上面的博文里有介绍。

<br>　　下面通过一个例子来帮助大家理解RSA算法。
　　假设你要和A进行加密通信，该怎么生成公钥和私钥呢？

    -  第一步，随机选择两个不相等的质数p和q。
       -  你选择了61和53（实际应用中，这两个质数越大，就越难破解）。
    -  第二步，计算p和q的乘积n。
       -  把61和53相乘，得到3233。3233写成二进制是110010100001，一共有12位，所以这个密钥就是12位。
       -  实际应用中，RSA密钥一般是1024位，重要场合则为2048位。
    -  第三步，计算n的欧拉函数φ(n)。
       -  根据公式φ(n) = (p-1)(q-1)算出φ(3233)等于60×52，即3120。
    -  第四步，随机选择一个整数e，条件是1< e < φ(n)，且e与φ(n) 互质。
       -  你就在1到3120之间，随机选择了17（实际应用中，常常选择65537）。
    -  第五步，计算e对于φ(n)的模反元素d。
       -  所谓模反元素就是指有一个整数d，可以使得ed被φ(n)除的余数为1。
       -  最终你算出一组整数解为 (x,y)=(2753,-15)，即 d=2753。
    -  第六步，将n和e封装成公钥，n和d封装成私钥。
       -  在这个例子中，n=3233，e=17，d=2753，所以公钥就是(3233,17)，私钥就是(3233, 2753)。
       -  实际应用中，公钥和私钥的数据都采用ASN.1格式表达。

　　回顾上面的密钥生成步骤：

    -  上面一共出现六个数字：　p、q、n、φ(n)、e、d。
    -  这六个数字之中，公钥用到了两个（n和e），其余四个数字都是不公开的。
    -  其中最关键的是d，因为n和d组成了私钥，一旦d泄漏，就等于私钥泄漏。
    -  那么，有无可能在已知n和e的情况下，推导出d？
    -  结论：如果n可以被因数分解，d就可以算出，也就意味着私钥被破解。

　　可是，大整数的因数分解，是一件非常困难的事情。目前，除了暴力破解，还没有发现别的有效方法。举例来说，你可以对`3233`进行因数分解（`61×53`），但是你没法对下面这个整数进行因数分解：

``` c
12301866845301177551304949
58384962720772853569595334
79219732245215172640050726
36575187452021997864693899
56474942774063845925192557
32630345373154826850791702
61221429134616704292143116
02221240479274737794080665
351419597459856902143413

// 它等于这样两个质数的乘积：
33478071698956898786044169
84821269081770479498371376
85689124313889828837938780
02287614711652531743087737
814467999489
　　　　×
36746043666799590428244633
79962795263227915816434308
76426760322838157396665112
79233373417143396810270092
798736308917
```

　　事实上，这大概是人类已经分解的最大整数（`232`个十进制位，`768`个二进制位）。比它更大的因数分解，还没有被报道过，因此目前被破解的最长RSA密钥就是`768`位。

<br>　　范例1：使用`RSA`加密。
``` java
// 加密算法
private final static String ALGORITHM = "RSA";

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    try {
        StringBuilder sub = new StringBuilder();
        for (int i = 0; i < 100; i++) {
            sub.append("六");
        }

        // 获取一个密钥生成器。
        KeyPairGenerator generator = KeyPairGenerator.getInstance(ALGORITHM);
        // 设置密钥的长度为1024bit。
        generator.initialize(1024);
        // 生成一个密钥对。
        KeyPair secretkey = generator.generateKeyPair();
        // 获取公钥和私钥。
        PublicKey publicKey = secretkey.getPublic();
        PrivateKey privateKey = secretkey.getPrivate();
        // 获取一个密码机。
        Cipher cipher = Cipher.getInstance(ALGORITHM);

        // 加密
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        // 每次加密的字节数，不能超过密钥的长度值减去11。
        // 上面设置的1024位转换成字节就是128，所以此处需要设置为117。
        byte[] bytes = doFinal(cipher, sub.toString().getBytes(), 117);
        String secretText = Base64.encodeToString(bytes, Base64.DEFAULT);
        System.out.println("密文：" + secretText);

        // 解密
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        bytes = doFinal(cipher, Base64.decode(secretText, Base64.DEFAULT), 128);
        System.out.println("明文：" + new String(bytes));
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    }
}

private byte[] doFinal(Cipher cipher, byte[] data, int blockSize) {
    ByteArrayOutputStream bout = new ByteArrayOutputStream();
    try {
        byte[] bytesData = data;
        int n = 0;
        while (n < bytesData.length) {
            if (bytesData.length - n >= blockSize) {
                bout.write(cipher.doFinal(bytesData, n, blockSize));
            } else {
                bout.write(cipher.doFinal(bytesData, n, bytesData.length - n));
            }
            n = n + blockSize;
        }
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println(e.getMessage());
    } finally {
        try {
            bout.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    return bout.toByteArray();
}
```
    语句解释：
    -  本范例使用的是随机生成的公钥和私钥，如果你想自定义公钥和私钥，请自行去搜索代码。

<br>　　另外，开发时通常会用工具生成“2对”公钥和私钥，分别交给客户端和服务端持有，且客户端和服务端会交换公钥，具体步骤可参看[ 这里 ](http://blog.csdn.net/BBLD_/article/details/38777491)。

　　最后需要知道的是：

    到2016年为止，世界上还没有任何可靠的攻击RSA算法的方式。只要钥匙的长度足够长，用RSA加密的信息实际上是不能被解破的。由于进行的都是大数计算，使得RSA最快的情况也比DES慢上好几倍，无论是软件还是硬件实现。速度一直是RSA的缺陷。一般来说只用于少量数据加密。

<br>**本节参考阅读：**
- [百度百科 - RSA算法](http://baike.baidu.com/view/10613.htm)
- [维基百科 - 公钥加密算法](https://zh.wikipedia.org/zh-cn/%E5%85%AC%E5%BC%80%E5%AF%86%E9%92%A5%E5%8A%A0%E5%AF%86)
- [维基百科 - RSA加密算法](https://zh.wikipedia.org/zh-cn/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95)
- [RSA算法原理（一）](http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html) 
- [RSA算法原理（二）](http://www.ruanyifeng.com/blog/2013/07/rsa_algorithm_part_two.html) 

## 消息摘要 ##

　　除了上面介绍的加密方式外，还有一种名为“消息摘要”的加密方式。

    事实上消息摘要算法不应该被称为加密算法，因为它们只是对“明文”进行“加密”，但不能将“密文”解密出来，也就是说它们是单向的。为了方便交流，下面还是会以“加密”等字眼来介绍各个算法。

　　这种加密方式有如下特点：

    -  长度固定。无论输入的数据有多长，计算出来的消息摘要的长度总是固定的。比如，对一个1G文件进行消息摘要，和对一个4k的图片（或字符串等数据）进行消息摘要，得到的结果的长度是一样的。
    -  稳定性。对同一个数据进行消息摘要，得到的结果不会改变。
    -  易变性。一般情况下只要两次输入的消息不同（哪怕只相差一个空格），那摘要产生的结果也必不相同，甚至差距非常大。
    -  单向性。只能进行正向的信息摘要，而无法从摘要中恢复出任何的消息，甚至根本就找不到任何与原信息相关的信息。

<br>　　上面介绍只是理论知识，放到实践中来的话，我们最常用的消息摘要算法是：`MD5`、`SHA`。

<br>　　**MD5**

　　`MD5`算法具有如下特点：

    第一，具备消息摘要的四大特性：长度固定、稳定性、易变性、单向性。
    第二，MD5算法生成的数据摘要有128个比特位（16字节），我们可以将它转换为16或32个十六进制的字符。

<br>　　`MD5`常用于部分网上赌场以保证赌博的公平性：

    在玩家下注骰宝前，赌场便先决定该局结果，假设生成的随机结果为4、5、 6大，赌场便会先利用MD5加密“4, 5, 6”此字符串并于玩家下注前告诉玩家。
    由于赌场是无法预计玩家会下什么注，所以便能确保赌场不能作弊。
    当玩家下注完毕后，赌场便告诉玩家该原始字符串，即“4, 5, 6”。
    玩家便可利用MD5工具加密该字符串是否与下注前的加密字符串吻合。

　　当然赌场也会防止玩家作弊：

    为了防止玩家使用计算机穷举所有可能（毕竟就3个骰子，每个骰子就6个值），所以赌场不会只拿“4, 5, 6”进行MD5操作。
    而是会在“4, 5, 6”基础上再加上一组随机字符串，以防止玩家利用碰撞解密字符串。
    随机字符串的长度与碰撞的次数成正比关系，一般网上赌场使用的随机字符串是长于20字。
    有些网上赌场的随机字符串更长达500字，以增加解密难度。

<br>　　`MD5`更常用于保存用户的密码：

    用户注册帐号时，客户端会将明文密码进行MD5加密，然后传给服务端保存。
    当用户登录帐号时，也会将明文密码进行MD5加密，然后交给服务端比较，如果相等就视为登录成功。
    这样一来，即便服务端的数据库被黑客拿走了，用户的密码也不会丢失。

　　但是这里存在一个问题：

    由于MD5具有稳定性（对同一个数据进行消息摘要，得到的结果不会改变），所以就有黑客搜集常见密码的MD5值。
    然后当黑客得到我们服务器的数据库时，就让数据库中的密码和他自己搜集的MD5库进行对比。
    从而能得出某些用户的密码，因此我们总是告诉用户，不要设置过于简单的密码，比如123456等。

　　退一步说，即便我们设置了复杂的密码，`MD5`加密还是存在风险：

    虽然前面介绍了信息摘要具有易变性（稍微改变原串中的一个空格都会导致最终的结果大变）。
    但MD5等算法还是存在被破解的可能：即两个不同的输入串会产生相同的MD5值，虽然这个几率非常小。
    因为不论多大的数据，MD5最终都只会生成16字节，存在bug也是可以想象到的。
    所以解决问题的方法就是，不断的增加算法生成的数据所占的字节数。

<br>　　**SHA**

　　`1996`年后`MD5`被证实可以被破解，对于需要高度安全性的数据，专家一般建议改用其他算法，如`SHA-256`。

<br>　　`SHA`家族：

    安全散列算法（英语：Secure Hash Algorithm，缩写为SHA）是一个密码散列函数家族，是FIPS所认证的五种安全散列算法。
    SHA家族的五个算法，分别是SHA-1、SHA-224、SHA-256、SHA-384，和SHA-512。
    但SHA-1的安全性如今被密码学家严重质疑；虽然至今尚未出现对SHA-2有效的攻击，它的算法跟SHA-1基本上仍然相似。
    SHA-256生成的数据占256位（32字节），可以转换成64个字符，这是MD5的两倍。

<center>
![ ](/img/android/android_BY_b02_02.jpg)
</center>

<br>　　因此：

    如果你的App只是普通的应用，那么使用MD5是完全没问题的，没有人会花精力搞你的，没有刁民想害你。
    如果你是金融类等的App的话，就用SHA-256吧。

<br>　　最后，笔者用一个工具类来收尾：
``` java
public class CryptoUtil {

    // 将参数text，进行sha256加密，然后转换成16进制的表示形式。
    public static String getSha256Text(String text) {
        return digest(text, "SHA-256");
    }

    // 将参数text，进行MD5加密，然后转换成16进制的表示形式。
    public static String getMD5Text(String text) {
        return digest(text, "MD5");
    }

    private static String digest(String text, String method) {
        String retVal;
        try {
            MessageDigest mDigest = MessageDigest.getInstance(method);
            mDigest.update(text.getBytes());
            retVal = bytesToHexString(mDigest.digest());
        } catch (NoSuchAlgorithmException e) {
            retVal = String.valueOf(text.hashCode());
        }
        return retVal;
    }

    // 将字节数组转换成16进制的字符串。
    public static String bytesToHexString(byte[] bytes) {
        // http://stackoverflow.com/questions/332079
        System.out.println(bytes.length);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < bytes.length; i++) {
            String hex = Integer.toHexString(0xFF & bytes[i]);
            if (hex.length() == 1) {
                sb.append('0');
            }
            sb.append(hex);
        }
        return sb.toString();
    }
}
```
    语句解释：
    -  看代码就行了。


<br>**本节参考阅读：**
- [百度百科 - 消息摘要算法](http://baike.baidu.com/view/2313810.htm)
- [维基百科 - MD5](https://zh.wikipedia.org/zh-cn/MD5)

## 网络通信 ##

　　本节将介绍一下上述的各类加密算法在网络通信场景下的应用方法。

### HTTP ###
#### 基础知识 ####
　　超文本传送协议 (`HTTP-Hypertext transfer protocol`) 是一个基于请求与响应模式的、无状态的、应用层的通信协议，它工作在`TCP/IP`协议体系中的`TCP`协议上。 

　　如图所示：

<center>
![](/img/android/android_7_1.png)
</center>

　　`http`协议是万维网（`world wide web`）交换信息的基础，它允许将超文本标记语言(`HTML`)网页从服务器传送到`Web`浏览器(如`IE`等)。

<br>**特点**
　　`http`协议是无状态的。

    -  无状态是指协议对于事务处理没有记忆能力。
    -  也就是说如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。如：用户登录，若第一次登录密码输入错误，则在第二次登录时，同样需要再次提供账号和密码，而不是只提供密码。

　　基于请求/应答模式的。

    -  客户端发送一个请求(request)给服务器，服务器在接收到这个请求后执行相应的操作，并在操作完成后生成一个响应(response)返回给客户端。
    -  用户在浏览器地址栏中输入一个网址(URL)，就是在向服务器端发送一个请求，请求查看网页的内容。
    -  服务器端总是等待客户端发来的请求，而不会主动的向客户端发送请求。

<br>**作用**
　　`http`能做什么?
　　浏览网页是`http`的主要应用，但是这并不代表`http`就只能应用于网页的浏览，`http`是一种协议，只要通信的双方都遵守这个协议，`http`就能有用武之地。

<br>**URI和URL**
　　URL是URI的子集。

    URI 可以描述任意一个(本地系统、互联网等地方的)资源的路径。
    URL 是一种特殊类型的URI，包含了用于查找某个资源的足够的信息，主要用来描述互联网上的一个资源的路径。

　　比如：`“http://www.baidu.com/test/a.txt”`是一个URL，它也是一个URI 。
　　URL 的一般形式是：`<URL的访问方式>://<主机>:[端口][路径]`，比如：`http://www.baidu.com:8080/test/a.txt`，其中：

    “http”表示要通过http协议来定位网络资源，常见的访问方式有：http、ftp、news等。
    “www.baidu.com”表示资源所在的地址，它是一个合法的Internet主机域名或者IP地址。
    “8080”表示端口号，若省写了端口则默认访问80端口。
    “/test/a.txt”表示资源在服务器端的存放路径。

<br>**协议版本号**
　　超文本传输协议已经演化出了很多版本，它们中的大部分都是向下兼容的。
　　目前有`0.9`(已过时)、`HTTP/1.0`、`HTTP/1.1`。

    HTTP/0.9只接受GET一种请求方法，没有在通讯中指定版本号，且不支持请求头，由于该版本不支持POST方法，所以客户端无法向服务器传递太多信息。
    
    HTTP/1.0这是第一个在通讯中指定版本号的HTTP协议版本，至今仍被广泛采用，特别是在代理服务器中。
    
    HTTP/1.1是当前版本（现在是2015年），持久连接被默认采用，并能很好地配合代理服务器工作，还支持以管道方式在同时发送多个请求，以便降低线路负载，提高传输速度。

<br>**HTTP/1.0与HTTP/1.1**
　　在HTTP1.0中，浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个`TCP`连接，服务器完成请求处理后立即断开`TCP`连接。

    显然，访问一个包含有许多图像的网页文件的整个过程包含了多次请求和响应，每次请求和响应都需要建立一个单独的连接，每次连接只是传输一个文档和图像，上一次和下一次请求完全分离。
    同时，客户端和服务器端每次建立和关闭TCP连接却是一个相对比较费时的过程，并且会严重影响客户机和服务器的性能。当一个网页文件中包含JavaScript文件，CSS文件等内容时，也会出现类似上述的情况。

　　为了克服`HTTP 1.0`的这个缺陷，`HTTP 1.1`支持持久连接。

    在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，一个包含有许多图像的网页文件的多个请求和应答可以在一个TCP连接中传输，但每个单独的网页文件的请求和应答仍然需要使用各自的连接。

　　扩展：

    HTTP 1.1在继承了HTTP 1.0优点的基础上，也克服了HTTP 1.0的性能问题。
    HTTP 1.1 还通过增加更多的请求头和响应头来改进和扩充HTTP 1.0 的功能。例如，由于HTTP 1.0不支持Host请求头字段，WEB浏览器无法使用主机头名来明确表示要访问服务器上的哪个WEB站点，这样就无法使用WEB服务器在同一个IP地址和端口号上配置多个虚拟WEB站点。在HTTP 1.1中增加Host请求头字段后，WEB浏览器可以使用主机头名来明确表示要访问服务器上的哪个WEB站点，这才实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多个虚拟WEB站点。HTTP 1.1 的持续连接，也需要增加新的请求头来帮助实现，例如，Connection 请求头的值为Keep-Alive 时，客户端通知服务器返回本次请求结果后保持连接；Connection 请求头的值为close 时，客户端通知服务器返回本次请求结果后关闭连接。 HTTP 1.1还提供了与身份认证、状态管理和Cache缓存等机制相关的请求头和响应头。

<br>**本节参考阅读：**
- [HTTP协议详解（真的很经典）](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html) 
- [HTTP_互动百科](http://www.baike.com/wiki/HTTP)
- [超文本传输协议_维基百科](http://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE#.E5.8D.8F.E8.AE.AE.E7.89.88.E6.9C.AC.E5.8F.B7)  

#### HTTP通信流程 ####

<br>　　本节将会详细的介绍一下，从我们在浏览器中输入 “ www.163.com ” 直到网页展示出来，背后的通信流程。

    1、浏览器DNS解析域名，查找域名的IP地址
    2、建立TCP链接
    3、浏览器发送HTTP请求
    4、服务器返回HTTP响应
    5、浏览器显示HTML（包括加载网页中的图片等资源）
    6、服务器关闭TCP连接

##### 域名解析 #####

　　当我们输入完地址且敲击的键盘回车键后，浏览器首先要做的事情就是解析这个域名。

    在网络世界中，是通过IP地址来定位一台机器的，因此计算机需要先将我们输入的域名转换成一个IP地址，然后才能去访问。一般来说浏览器会首先查看本地硬盘的hosts文件，看看其中有没有和这个域名对应的规则，如果有的话就直接使用hosts文件里面的ip地址。

　　如果本地`hosts`中找到对应的`IP`地址，则浏览器会发出一个`DNS`请求到“本地DNS服务器”。

    本地DNS服务器一般都是你的网络接入服务器商提供，比如中国电信，中国移动。
    本地DNS服务器会首先查询它的缓存记录，如果缓存中有此条记录，就可以直接返回结果。
    如果没有，本地DNS服务器还要向DNS根服务器进行查询。

　　<font color='red'>“根DNS服务器”</font>没有记录具体的域名和IP地址的对应关系，它内部持有了很多个<font color='red'>“域服务器”</font>，它会依据本地DNS服务器传递过来的域名筛选出一个<font color='red'>“域服务器”</font>，并告诉本地DNS服务器，你可以到这个<font color='red'>“域服务器”</font>去继续查询。

　　在这个例子中，请求的对象是`.com域服务器`。

    .com域服务器收到请求之后，也不会直接返回域名和IP地址的对应关系，而是告诉本地DNS服务器一个“域名的解析服务器”的地址。

　　最后，本地DNS服务器向<font color='red'>“域名的解析服务器”</font>发出请求，这时就能收到一个域名和IP地址对应关系，本地DNS服务器不仅要把IP地址返回给用户电脑，还要把这个对应关系保存在缓存中，以备下次别的用户查询时，可以直接返回结果，加快网络访问。

　　整个过程如下图所示：

<center>
![ ](/img/android/android_a007_006.jpg)
</center>

##### 建立TCP链接 #####

　　浏览器拿到域名对应的IP地址之后，会以一个随机端口（1024<端口<65535）向服务器的WEB程序（常用的有httpd，nginx等）80端口发起TCP的连接请求。

    在HTTP工作开始之前，浏览器首先通过网络与Web服务器建立连接，该连接是通过TCP协议与IP协议共同构建。HTTP是比TCP更高层次的应用层协议，根据规则，只有低层协议建立之后才能进行更高层协议的连接，因此，首先要建立TCP连接，一般TCP连接的端口号是80。

　　TCP建立链接时，需要进行“三次握手”：

<center>
![ ](/img/android/android_a007_007.png)
</center>

    第一次握手：客户端向服务器发出连接请求报文，报文首部中的同部位SYN=1，同时选择一个初始序列号 seq=x ，此时，TCP客户端进程进入了 SYN-SENT（同步已发送状态）状态，等待服务器的确认。TCP规定，SYN报文段（SYN=1的报文段）不能携带数据，但需要消耗掉一个序号。
    
    第二次握手：服务器收到请求报文后，如果同意连接，则发出确认报文。确认报文中应该 ACK=1，SYN=1，确认号是ack=x+1，同时也要为自己初始化一个序列号 seq=y，此时，TCP服务器进程进入了SYN-RCVD（同步收到）状态。这个报文也不能携带数据，但是同样要消耗一个序号。
    
    第三次握手：TCP客户进程收到确认后，还要向服务器给出确认。确认报文的ACK=1，ack=y+1，自己的序列号seq=x+1，此时，TCP连接建立，客户端进入ESTABLISHED（已建立连接）状态。TCP规定，ACK报文段可以携带数据，但是如果不携带数据则不消耗序号。

　　用大白话简单的描述一下TCP三次握手的流程就是：

    第一次握手，“客户端：你能听到我说话吗？”
    -  发送完此信号后，客户端就会等待服务器反馈。
    -  若由于网络延迟，导致客户端等待了N秒没接到服务端的反馈，客户端就会触发超时重传机制，重传SYN报文，显然重传会有最大限制，超过了限制就会认为失败，最终客户端就离开了。
    
    第二次握手，“服务器：我能听到，但是不知道你何时发的这条消息，所以想问你还在线吗？”
    -  服务器接到第一次握手时，显然不能立刻开始数据传输，因为客户端可能已经离开了。
    -  如果服务器发送此条消息时，客户端已经离开了，服务器自然接不到反馈，同样也会触发重传机制，同样有最大重传次数限制。
    -  如果客户端还在，那么客户端就会触发第三次握手。
    
    第三次握手，“客户端：我在线，那我开始发送数据了”

　　完成三次握手后，客户端与服务器开始传送数据。

    需要知道的是，TCP连接并非是在通信设备两端之间建立信号隧道，而本质上就是双方各自维护所需的状态状态，以达到TCP连接的效果，所以TCP状态机是TCP的核心内容，学习TCP一定要搞懂这些状态机之间的转换。

<br>**本节参考阅读：**
- [从输入 URL 到页面展示到底发生了什么？看完吊打面试官！](https://zhuanlan.zhihu.com/p/133906695) 
- [淘宝二面，面试官居然把TCP三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)
- [两张动图-彻底明白TCP的三次握手与四次挥手](https://blog.csdn.net/qzcsu/article/details/72861891)
- [TCP如何处理三次握手和四次挥手期间的异常](https://blog.csdn.net/qq_23350817/article/details/125451291)

##### HTTP请求 #####
　　客户端连上服务器后，并请求访问服务器内的某个`web`资源，称之为客户端向服务器发送了一个HTTP请求(`request`)。一个完整的HTTP请求包括如下内容：

    一个请求行。
    若干请求报头。
    一个空白行(起到间隔作用)。
    请求正文(以post方式发送的请求才有此项)。

<br>**请求行**
　　请求行由三部分组成：请求的方式，请求的资源名称，请求使用的协议以及版本。
　　HTTP请求的方式有：`POST`、`GET`、`HEAD`、`OPTIONS`、`DELETE`、`TRACE`、`PUT`、`CONNECT`。其中`GET`和`POST`最常用。

<br>　　范例1：请求行。
``` 
GET / books/java.html  HTTP/1.1
```

<br>　　`GET`方式：将需要传递给服务器的数据直接写在URL后面。

<center>
![](/img/android/android_7_2.png)
</center>

　　如：`GET / cxy/a.html?name=tomcat&password=123 HTTP/1.1`
　　含义：请求查看`a.html`文件，并向服务器中传递两个参数，`name`和`password`，多个参数之间使用`&`间隔。 文件名与参数之间使用`?` 间隔。
　　缺点：由于浏览器地址栏的长度有限，因此若参数过多，则就不要使用此方式。

<br>　　`POST`方式：参数将通过“请求正文”发送给服务器，因此参数的数量、长度是无限制。

<center>
![](/img/android/android_7_3.png)
</center>

<br>**请求报头**
　　请求报头是客户端向服务器端发送请求时，请求中附加的信息以及客户端自身的信息。

<br>　　范例1：请求头中的常见信息。
```
Accept: image/gif, image/jpeg, image/pjpeg, image/pjpeg, application/x-shockwave-flash, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*
Referer: http://localhost/cxy/a.html?name=tomcat&password=123
Accept-Language: zh-CN,en-US;q=0.5
User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate
Host: localhost
Content-Length: 24
Connection: Keep-Alive
Cache-Control: no-cache
```
    语句解释：
    -  请求头Accept：告知服务器，客户端浏览器可接受的文件的类型。如：
       -  Accept:image/gif，表明客户端希望接受 gif 图象。
       -  Accept:text/html，表明客户端希望接受 html 文本。
    -  请求头Accept-Encoding：告知服务器，客户端浏览器可接受的数据压缩编码。
    -  请求头Accept-Language：告知服务器，客户端浏览器当前语言环境(用于国际化程序设计)。
    -  请求头Host：告知服务器，客户端浏览器要访问的主机。必须要提供此请求头。
    -  请求头Referer：告知服务器，当前请求是由客户端浏览器的哪个页面发出的。
    -  请求头User-Agent：告知服务器，客户端操作系统、浏览器的类型、版本号等信息，此属性由浏览器来设置。
    -  请求头Cookie：告知服务器，客户端浏览器中的Cookie 。
    -  请求头Connection：取值有两个“Keep-Alive和close” 。
    -  请求头Date：告知服务器，客户端浏览器发送请求的时间。
    -  请求头Content-Length：告知服务器，请求中的请求正文的长度。

##### HTTP响应 #####
　　服务器接收到客户端的请求后，会将用户请求的数据，以一个回应(`response`)的方式返回给客户端。一个完整的HTTP回应包括如下内容：

    一个响应行。
    若干响应报头。
    一个空白行(起到间隔作用)。
    响应正文。

<br>**响应行**
　　响应行由三部分组成：协议及版本号，响应码，响应信息。

<br>　　范例1：响应行。
```
HTTP/1.1  200  OK
```
　　响应码用于表示服务器对请求的处理结果。常见的HTTP响应码有：
```
状态码                                   表示的含义
100～199                        表示成功接收请求，要求客户端继续提交下一次请求才能完成整个处理过程。
200～299                        表示成功接收请求并已完成整个处理过程，常用200 。
300～399                        重定向，客户需进一步细化请求。例如，请求的资源已经移动一个新地址，常用302、304。
400～499                        客户机中出现的错误
                                403 服务器收到请求，但是拒绝提供服务
                                404 服务器找不到客户端请求的资源
500～599                        服务器中出现的错误
                                500 服务器内部错误 —— 因为意外情况，服务器不能完成请求。
```

　　提示：响应码为`200`，则意味着请求被处理完成，客户端请求的数据被完整的返回。关于响应码的详细描述，请参看：[HTTP状态码_百度百科](http://baike.baidu.com/view/1790469.htm)。

<br>**响应报头**
　　响应报头允许服务器传递不能放在响应行中的附加响应信息，以及关于服务器的信息和对`Request-URI`所标识的资源进行下一步访问的信息。

<br>　　范例1：响应头中的常见信息。
```
HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 10
Date: Sun, 21 Aug 2011 13:32:33 GMT
Location: http://www.baidu.com
Content-Encoding: gzip 
Content-Type: text/html;charset=gbk
Refresh: 1;url=http://www.qq.com
Content-Disposition: attachment; filename=aaa.zip
Expires: -1
Cache-Control: no-cache  
Pragma: no-cache   
Connection: close/Keep-Alive   

Hi Tomcat!
```
    语句解释：
    -  响应头Server：包含了服务器用来处理请求的软件信息。与 User-Agent 请求报头域是相对应的。
    -  响应头Content-Length：指出返回的“回应正文”的长度。
    -  响应头Date：服务器回应的时间，和咱们东八区有8个小时的时差。
    -  响应头Location：告知客户端浏览器，需要将浏览器窗口重定位到其指向的页面中。只有响应码为302时，浏览器才会执行重定位。
    -  响应头Content-Encoding：告知客户端浏览器，数据(回应正文)的压缩格式。
    -  响应头Content-Type：告知浏览器，服务器返回给浏览器的数据，是什么格式的。即MIME类型。
    -  响应头Refresh：告知浏览器，定时刷新页面。
    -  响应头Expires、Cache-Control、Pragma：都是用来告知浏览器不要缓存资源数据。由于浏览器的种类繁多，所以有3种头信息。

##### 断开TCP链接 #####

　　断开TCP链接时，需要进行“四次挥手”：

<center>
![ ](/img/android/android_a007_007.png)
</center>

    第一次挥手。客户端发起 FIN 包（FIN = 1）,客户端进入 FIN_WAIT_1 状态。TCP 规定，即使 FIN 包不携带数据，也要消耗一个序号。
    
    第二次挥手。服务器端收到 FIN 包，发出确认包 ACK（ack = u + 1），并带上自己的序号 seq=v，服务器端进入了 CLOSE_WAIT 状态。这个时候客户端已经没有数据要发送了，不过服务器端有数据发送的话，客户端依然需要接收。客户端接收到服务器端发送的 ACK 后，进入了 FIN_WAIT_2 状态。
    
    第三次挥手。服务器端数据发送完毕后，向客户端发送 FIN 包（seq=w ack=u+1），半连接状态下服务器可能又发送了一些数据，假设发送 seq 为 w。服务器此时进入了 LAST_ACK 状态。
    
    第四次挥手。客户端收到服务器的 FIN 包后，发出确认包（ACK=1，ack=w+1），此时客户端就进入了 TIME_WAIT 状态。注意此时 TCP 连接还没有释放，必须经过 2*MSL 后，才进入 CLOSED 状态。而服务器端收到客户端的确认包 ACK 后就进入了 CLOSED 状态，可以看出服务器端结束 TCP 连接的时间要比客户端早一些。



### 数字证书 ###

<br>　　在当今社会，数据加密主要应用在网络通信的场景下，因此本节将以HTTPS的交互流程来进一步介绍加密相关的知识。
<br>　　**问题是这样的：**

　　HTTP虽然使用极为广泛，但是却存在不小的安全缺陷，主要是其数据的明文传送和消息完整性检测的缺乏，而这两点恰好是网络支付，网络交易等新兴应用中安全方面最需要关注的。

    明文传送，意味着成为攻击者的门槛很低，使用网络发布的任意一款抓包工具，一个新手就有可能通过分析HTTP请求体，来获取到大型网站的用户信息（密码、身份证等）。
    
    同时，HTTP在传输客户端请求和服务端响应时，唯一的数据完整性检验就是在报文头部包含了本次传输数据的长度，而对内容是否被篡改不作确认。因此攻击者可以轻易的发动中间人攻击，修改客户端和服务端传输的数据，甚至在传输数据中插入恶意代码，导致客户端被引导至恶意网站被植入木马。

<br>　　**加密不就行了？**

　　既然HTTP是明文传输的，那我们给报文加密不就行了，就用前面说的对称加密算法。

<center>
![ ](/img/android/android_a007_001.webp)
</center>

    图释：
    左侧是客户端，右侧是服务器。
    客户端使用秘钥“U2FsdGV”来对数据“转账100”进行加密，服务器也使用该秘钥进行解密。

　　看起来似乎解决了问题，但是这里有一个关键问题：

    对称加密的通信双方要使用同一把密钥，这个密钥是如何创建并交给双方的？
    如果通过HTTP直接传输密钥，之后的通信其实还是在裸奔，因为这个密钥会被中间人截获甚至替换掉，这样中间人就可以用截获的密钥解密报文，甚至替换掉密钥以达到篡改报文的目的。
    
    也许你会说，我们可以用笨办法，服务端生成秘钥后，把秘钥放U盘里，然后服务端程序员打车把U盘给客户端程序员送过去，不就行了？这个方法确实很笨，如果只是两个人私下通信的话，是可以解决问题的。
    
    但实际的应用场景是：
    用户通过电脑浏览器或者手机浏览器向服务器发送请求，用户的数量是无限的，你难道要挨个上门给用户复制秘钥吗？显然不可能，我们只能通过服务器下发的方式，把秘钥下发给客户端，可是一旦直接下发秘钥，那和裸奔就没什么区别了。

<center>
![ ](/img/android/android_a007_002.webp)
</center>

　　不会真的有人说<font color='red'>“对这个密钥加密不就完了?”</font>吧，这样一来若要客户端顺利解密这个密钥，服务端还是要再多传一个密钥给客服端，依然还是会被中间人截获的，这么看来直接传输密钥无论怎样都无法摆脱<font color='red'>俄罗斯套娃</font>的难题，是不可行的。

<br>　　**非对称加密怎么样？**

　　我们来复习一下非对称加密的定义：

    非对称加密算法需要两个密钥：公钥（publickey）、私钥（privatekey）。
    公钥和私钥是一对的，如果用公钥加密，那么只有私钥才能解密，反之用私钥加密，也只能用公钥才能解密。
    由于加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密。

　　这样一来，在客户端和服务器传递正式数据之前，两者先交换各自的公钥，然后用对方的公钥对数据进行加密，当数据发送给对方后，对方再用各自的私钥解密，不就妥了？

　　其实并没有解决“秘钥被截获”问题：

    假设此时进行通信的有客户端、中间人、服务器三个角色，且它们手上都持有自己的公钥和私钥。
    当需要把客户端的公钥A和服务器的公钥B进行交换时，中间人可以拿到公钥B，并把自己的公钥C交给客户端，然后在中间对数据进行任意的解密、篡改。

<center>
![ ](/img/android/android_a007_003.jpg)
</center>

　　一切似乎又回到了原点，非对称加密也无法解决这个问题：“服务器怎么把秘钥（就是公钥）安全地传输给客户端？”，或者换个说法，“客户端无法确定自己手里的服务器公钥是不是真的”。

　　先来结论吧：数字证书就是解决公钥传输问题的。

<br>　　**什么是数字证书**

　　当沟通的双方无法确定对方的身份时，可以通过引入一个双方都信任的第三方来解决问题：

    比如在员工入职的过程中，企业会要求员工提供学历证明，显然企业不会轻信这个证明，而是会拿着员工的学历里的学号，去学信网查询。
    学信网就是这个第三方权威机构，我们称之为Certificate Authority，简称CA。
    学信网为什么能知道我们的学历信息？自然是从各个高校那拿到的，并录入到自己的数据库中。

　　换到互联网的场景下，客户端与服务器沟通时，也需要有一个CA。

    服务器程序员去CA网站将自己的信息交给CA，所提交的信息包括但不限于：
    1、服务器的公钥
    2、域名
    3、秘钥算法（如RSA等）
    CA会依据这些信息给你生成一个数字证书，用它就可以解决传输公钥的问题。

　　数字证书里包含但不限于如下信息：

    * 颁发机构(CA)的名字(DigiCert、Comodo等)
    * 证书持有者
    * 证书持有者的公钥和算法
    * 证书有效期
    * 证书内容本身的数字签名和算法
    * 证书唯一序列号

　　这样一来，在客户端和服务器通信之前，服务器先将自己从CA申请到的数字证书发给客户端，由客户端负责验证真伪：

    若证书为真，则从证书中解析出服务器的公钥，然后用服务器公钥对数据进行加密，接着就可以传输了。
    若证书为假，则就不用多说了。

<br>　　**如何保证数字证书不被掉包**

　　就像上面说的，任何网站都可以去CA那边申请数字证书，中间人也不例外，那么此时中间人是否可以在传输过程中将服务器发给客户端的证书替换成自己的证书呢？

　　答案是不行。CA机构为了防止中间人掉包，它会这么做：

    1、使用摘要算法（如MD5）将证书明文（如证书序列号、主机名、公钥等）生成摘要。
    2、用CA的私钥对生成的摘要进行加密，生成一个签名。

　　客户端拿到服务器发来的数字证书（包含两部分信息：证书明文和签名）后，会这么做：

    1、先用CA机构的公钥对签名进行解密，得到证书明文的摘要A。
    2、然后使用相同的摘要算法（如MD5）对证书明文进行摘要，得到摘要B。
    3、比较A和B，若相同则认为没有被篡改，否则则被篡改。

　　由于中间人的证书也是正规渠道取得的，所以若中间人掉包了数字证书，其实也会通过上面的检测，不过客户端还是会继续做验证：

    验证自己请求的服务器地址是否和手上的数字证书里的域名一致，若不一致则认为不通过。

　　同时中间人也没办法篡改数字证书的内容，因为数字证书的签名是被CA的私钥加密过的，其篡改证书明文后，还需要重新对证书明文进行加密，生成新的签名，由于其手上不可能有CA的私钥，所以中间人用自己的秘钥加密的新证书明文，在客户端随后用CA的公钥就会解密失败。

　　新问题出现了，以上逻辑成立的前提是“客户端手里持有CA的公钥”，但CA公钥从哪里来？

    CA公钥从CA的数字证书里来，CA的数字证书是其自己给自己颁发的。
    同时，不管你是Windows、linux、Android或者其它操作系统，在其内部都会内置很多CA证书。
    很显然，只有那些被大家普遍认可的CA，它的数字证书才会被内置到操作系统。

　　下面我们看一下客户端和服务器通信的完整流程：

    1、网站申请证书阶段
    网站向CA机构申请数字证书（需要提交一些材料，比如域名等）
    CA向证书中写入摘要算法，域名，网站的公钥等重要信息
    CA根据证书中写入的摘要算法，计算出证书的摘要
    CA用自己的私钥对摘要进行加密，计算出签名
    CA生成一张数字证书
    网站的管理员，把证书放在自己的服务器上
    
    2、浏览器验证证书阶段
    浏览器在地址栏中输入https://www.baidu.com，并回车。
    服务器将数字证书发送给浏览器。
    （笔者猜测）浏览器从数字证书中解析出证书颁发机构的信息，并从操作系统内置的CA的数字证书列表里匹配出对应的CA证书，拿到CA的公钥。
    用CA的公钥验证数字证书的合法性。
    
    3、数据传输阶段
    浏览器验证数字证书通过以后，拿到了https://www.baidu.com的公钥。
    浏览器用公钥对数据进行加密，并加密以后的密文以及浏览器自己的公钥都发个服务器。
    服务器收到密文后，用自己的私钥解密得到明文，然后用浏览器的公钥加密要回复的数据，返回给浏览器。
    这样一来，中间人即便手持浏览器和服务器的公钥也没用，因为双方都是用公钥加密，私钥解密。

<br>　　**Charles的实现原理**

　　如果想用Charles抓包HTTPS请求的话，需要事先在你的设备中安装Charles的CA证书，此时整个请求的流程为（其中第二步包含了笔者个人猜测）：

    1、客户端向服务器发起请求会被Chalars拦截，由Chalars代请求，最终Chalars会得到服务器的CA。
    
    2、Chalars会动态生成一张假证书，具体就是将真证书明文的所有内容复制下来，只是修改两个地方：
    -  将服务器公钥替换成自己的。
    -  将证书颁发机构换成Chalars。
    然后同样进行摘要和（用Chalars的私钥）签名，最后将假证书返回给客户端。
    此时Chalars也会将服务器的公钥保存下来。
    
    3、客户端会从数字证书中解析出证书颁发机构的信息，并从操作系统内置的CA的数字证书列表里匹配出对应的CA证书，拿到CA的公钥。由于我们事先将Charles的CA证书安装到系统中了，所以可以通过验证。
    
    4、客户端验证通过后，会使用Chalars的公钥对数据进行加密，同时发送自己的公钥给服务器（Chalars），而服务器（Chalars）则会把客户端的公钥收起来，然后把自己的公钥发给真服务器。
    
    目前为止，客户端和服务端发送的所有数据都是用Chalars的公钥加密的，这就不言而喻了吧。

<br>　　**Android平台证书分类**

　　Android系统把证书信任分为两大块：

    系统CA证书：基本拥有所有权限
    用户CA证书：用户自行安装，权限很低

　　我们自己安装的Charles证书都属于用户CA证书，除了证书的权限问题，Android的不同版本对权限的处理规则也不一样：

    Android 7.0以下，信任用户CA证书，可以简单的理解为我们安装的证书直接获得ROOT权限。
    Android 7.0以上，targetSdkVersion < 24：信任用户CA证书。
    Android 7.0以上，targetSdkVersion >= 24：不信任用户CA证书。

<br>　　**Android抓包HTTPS常见方法**

    1、Android7以下设备，直接抓包。
    2、Android7及以上设备，找个targetSdkVersion < 24的App安装包。
    3、Android7及以上设备，把手机给ROOT后，将Charles证书放到系统证书所在的目录下，直接洗白。

　　若你想在Android7及以上设备上抓包自己的App，则可以使用`res/xml/network_security_config.xml`，意如其名，这个配置文件是专门控制网络安全的。

``` xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- release 包只信任 system 级别的证书 -->
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates overridePins="true" src="system" />
        </trust-anchors>
    </base-config>
    <!-- debug 包同时信任 system 和 user 级别的证书 -->
    <debug-overrides>
        <trust-anchors>
            <certificates overridePins="true" src="system" />
            <certificates overridePins="true" src="user" />
        </trust-anchors>
    </debug-overrides>
</network-security-config>
```
　　当然安全配置肯定不止这一点内容，感兴趣的同学可以去[Android 开发者官网](https://developer.android.com/training/articles/security-config#CustomTrust)学习了解。

<br>**本节参考阅读：**
- [维基百科 - 数字签名](https://zh.wikipedia.org/zh-cn/%E6%95%B8%E4%BD%8D%E7%B0%BD%E7%AB%A0)
- [数字签名是什么？](http://www.ruanyifeng.com/blog/2011/08/what_is_a_digital_signature.html)
- [百度百科 - HTTPS](https://baike.baidu.com/item/HTTPS?fromModule=lemma_search-box)
- [charles的原理及使用](https://www.cnblogs.com/zjldeboke/p/14778685.html)
- [为什么你的 Charles 会抓包失败？](https://supercodepower.com/use-charles)
- [18 张图彻底弄懂 HTTPS 的原理！](https://baijiahao.baidu.com/s?id=1685474345600994715&wfr=spider&for=pc)
- [通俗大白话，彻底弄懂 https 原理本质](https://my.oschina.net/helloworldnet/blog/5587819)
- [Android 使用HTTPS与SSL](http://hukai.me/android-training-course-in-chinese/security/security-ssl.html)
- [HTTPS的七个误解（译文）](http://www.ruanyifeng.com/blog/2011/02/seven_myths_about_https.html)

### HTTPS ###

　　事实上互联网的通信安全，是建立在`SSL/TLS`协议之上的，而所谓的`HTTPS`本质上就是在<font color='red'>应用层“HTTP”协议</font>与<font color='red'>传输层“TCP”协议</font>之间增加了一层<font color='red'>网络传输安全协议层</font>（SSL/TLS协议），来保证数据传输的安全性，也就是说`HTTPS`本质上就是`HTTP + SSL/TLS`。

<center>
![ ](/img/android/android_a007_009.awebp)
</center>

    上一节介绍的“数字证书”可以解决服务器顺利下发公钥的问题，接下来将介绍HTTPS是如何配合“数字证书”来实现加密通信的。

#### SSL/TLS ####

　　传输层安全性协议（英语：Transport Layer Security，缩写：TLS）及其前身安全套接层（英语：Secure Sockets Layer，缩写：SSL）是一种安全协议，目的是为互联网通信提供安全及数据完整性保障。

    TLS协议的优势是与高层的应用层协议（如HTTP、FTP、Telnet等）无耦合。应用层协议能透明地运行在TLS协议之上，由TLS协议进行创建加密通道需要的协商和认证。应用层协议传送的数据在通过TLS协议时都会被加密，从而保证通信的私密性。

<br>　　**1、作用**
　　不使用SSL/TLS的HTTP通信，默认就是不加密的通信，所有信息明文传播，带来了三大风险：

    （1） 窃听风险（eavesdropping）：第三方可以获知通信内容。
    （2） 篡改风险（tampering）：第三方可以修改通信内容。
    （3） 冒充风险（pretending）：第三方可以冒充他人身份参与通信。

　　SSL/TLS协议是为了解决这三大风险而设计的，希望达到：

    （1） 所有信息都是加密传播，第三方无法窃听。
    （2） 具有校验机制，一旦被篡改，通信双方会立刻发现。
    （3） 配备身份证书，防止身份被冒充。

　　互联网是开放环境，通信双方都是未知身份，这为协议的设计带来了很大的难度。而且，协议还必须能够经受所有匪夷所思的攻击，这使得SSL/TLS协议变得异常复杂。

<br>　　**2、历史**
　　互联网加密通信协议的历史，几乎与互联网一样长。

    1994年，NetScape公司设计了SSL协议（Secure Sockets Layer）的1.0版，但是未发布。
    1995年，NetScape公司发布SSL2.0版，很快发现有严重漏洞。
    1996年，SSL3.0版问世，得到大规模应用。
    1999年，互联网标准化组织ISOC接替NetScape公司，发布了SSL的升级版TLS1.0版。
    2006年和2008年，TLS进行了两次升级，分别为TLS1.1版和TLS1.2版。
    2018年8月发布TLS1.3版本。

<br>　　**3、基本的运行过程**
　　SSL/TLS协议的基本思路是采用公钥加密法，也就是说，客户端先向服务器端索要公钥，然后用公钥加密信息，服务器收到密文后，用自己的私钥解密，但是这里有两个问题：

    1、如何保证服务器公钥不被篡改？
    将公钥放在数字证书中，只要证书是可信的，公钥就是可信的。
    
    2、非对称加密计算量太大，如何减少耗用的时间？
    每一次对话（session），客户端和服务器端都可能发生多次数据传递，而非对称加密比较耗时，所以二者会生成一个“对话密钥”（session key），用它来加密信息，而这个“对话密钥”是对称加密，所以运算速度非常快，而服务器公钥只用于加密“对话密钥”本身，这样就减少了加密运算的消耗时间。

　　因此，SSL/TLS协议的基本过程是这样的：

    （1） 客户端向服务器端索要并验证公钥。
    （2） 双方协商生成“对话密钥”。
    （3） 双方采用“对话密钥”进行加密通信。

　　上面过程的前两步，又称为“握手阶段”（handshake）。

#### 握手阶段 ####

　　开始加密通信之前，客户端和服务器首先必须建立连接和交换参数，这个过程叫做握手。

　　TLS握手通常会有四次：

    第一次，客户端（通常是浏览器）先向服务器发出加密通信的请求，这被叫做ClientHello请求。在这一步，客户端主要向服务器提供以下信息：
    1、支持的协议版本，比如TLS 1.0版。
    2、一个客户端生成的随机数，稍后用于生成“对话密钥”。
    3、支持的加密方法，比如RSA公钥加密。
    4、支持的压缩方法。
    
    第二次，服务器收到客户端请求后，向客户端发出回应，这叫做ServerHello。服务器的回应包含以下内容：
    1、确认使用的协议版本(如TLS1.0)，若浏览器与服务器支持的版本不一致，服务器关闭加密通信。
    2、一个服务器生成的随机数，稍后用于生成“对话密钥”。
    3、确认使用的加密方法，比如RSA公钥加密。
    4、服务器证书。
    
    第三次，客户端收到服务器回应以后，首先验证服务器证书。如果证书验证不通过，就会向访问者显示一个警告，由其选择是否还要继续通信。否则客户端就会从证书中取出服务器的公钥。然后向服务器发送下面三项信息：
    1、一个随机数（又称"pre-master key"）。该随机数用服务器公钥加密，防止被窃听。
    2、编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送。
    3、客户端握手结束通知，表示客户端的握手阶段已经结束。这一项同时也是前面发送的所有内容的hash值，用来供服务器校验。
    
    第四次，服务器收到客户端的第三个随机数pre-master key之后，计算生成本次会话所用的“会话密钥”。然后向客户端最后发送下面信息：
    1、编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送。
    2、服务器握手结束通知，表示服务器的握手阶段已经结束。这一项同时也是前面发送的所有内容的hash值，用来供客户端校验。
    
    至此，整个握手阶段全部结束。接下来，客户端与服务器进入加密通信，就完全是使用普通的HTTP协议，只不过用"会话密钥"加密内容。

　　问题：HTTPS握手和TCP握手谁先谁后？

    前面说过，HTTP是比TCP更高层次的应用层协议，根据规则，只有低层协议建立之后才能进行更高层协议的连接，因此首先要建立TCP连接，即先TCP握手，后HTTPS握手。

<center>
![ ](/img/android/android_a007_010.png)
</center>

　　提示：

    1、TLSv1.2握手过程基本都是需要四次，而TLSv1.3只需要两次就能完成TLS握手。
    2、握手之后的对话使用“对话密钥”加密（对称加密），服务器的公钥和私钥只用于加密和解密“对话密钥”（非对称加密），无其他作用。

<br>**本节参考阅读：**
- [维基百科 - 传输层安全性协议](https://zh.wikipedia.org/zh-cn/%E5%82%B3%E8%BC%B8%E5%B1%A4%E5%AE%89%E5%85%A8%E6%80%A7%E5%8D%94%E5%AE%9A)
- [阮一峰 - 图解SSL/TLS协议](https://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)
- [阮一峰 - SSL/TLS协议运行机制的概述](https://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)
- [HTTPS 中 TLS 和 TCP 能同时握手吗？](https://blog.csdn.net/qq_34827674/article/details/123458410)

# 第二节 应用破解 #

　　本章主要介绍如何使用`ApkTool`工具对`Android`应用程序（包含游戏）进行破解。
　　软件破解本就是违法行为，如果市场上充斥着破解软件，那么开发正版游戏、正版软件的公司将难以生存，为了中国软件事业的健康发展，请支持正版。
　　本章提到的破解技术仅供学习交流，尽可能多的了解软件破解的原理也能让我们写出更安全、优秀的软件。

　　这里特别感谢好哥们`张扬（大饼）`为本文指出不足之处，并为笔者指明了反编译思路。
<br>

## 破解工具 ##
　　软件破解，本质上就是先把软件给拆开了，然后修改一下软件的内容（比如去掉收费相关的软件代码），接着在把软件给组装起来的过程。 
　　因此，在进行软件破解时，第一步要做的就是把软件给拆开，而ApkTool就是用来将软件拆开的一个工具。在开始破解之前我们要先介绍一下ApkTool，以便后面顺利的开展破解工作。

<br>**ApkTool**
　　ApkTool是Google提供的apk编译工具，它不仅可以用来反编译apk，还可以用来将反编译的apk重新编译回apk。反编译时我们需要使用`decode`命令，重新编译时则需要使用`build`命令，这两个命令的具体用法后面会有详细介绍。

　　下载地址：http://ibotpeaches.github.io/Apktool/ ，本文档使用的是`2.0.0rc3`版本。

<br>**Apk文件**
　　在进行破解之前，为了减少我们之间的知识断层，这里先介绍一些apk相关的常识：

    -  Apk文件本质上是一个压缩文件，可以使用压缩软件打开它。
    -  Apk文件必须被签名之后才能被安装到设备（手机、平板等）上，否则无法安装。
    -  所谓的对Apk文件进行签名，就是使用JDK里自带的jarsigner.exe工具将一个签名文件和一个未签名的Apk文件绑定到一起。
    -  使用Eclipse开发时，Eclipse每次生成Apk时都会使用一个默认的签名文件（debug.keystore）对APK进行签名。
    -  debug.keystore被保存在当前操作系统用户目录下的.android目录下：
       -  在Vista和Windows7系统中，路径为：C:\Users\用户\.android\debug.keystore
       -  在更早版本的Windows（如XP）系统中，路径为：C:\Document and Settings\用户\.android\debug.keystore
    -  Apk文件里的xml是二进制格式的，如果直接使用压缩软件解压Apk，那么解压出来的xml文件是无法直接查看、编辑的，但是里面的图片是可以直接查看的。
    -  只有包名和签名完全一样的两个Apk之间才可以相互覆盖安装，否则无法覆盖安装。
    -  Dalvik与JVM的最大的区别之一就是Dalvik是基于寄存器的。

## HelloWorld ##
　　针对不同的需求破解Apk有不同方式，最简单的破解就是不修改程序的代码，而只是替换一下程序中所用到的图片、文本等数据。

　　接下来将介绍这种破解方式的具体实施步骤。

　　1、创建一个名为`Decode`的`Android`项目，项目的包名为`com.cutler.decode`，然后在`Eclipse`中进行编译、运行。
　　2、将下载来的`apltool`工具和刚生成的`apk`文件都复制到`D:\decode`目录下。
　　3、打开`cmd`窗口，进入到`D:\decode`目录，执行如下命令：
``` android
apktool.bat d -f Decode.apk
```
    语句解释：
    -  apktool.bat会在D:\decode目录下创建一个Decode目录，并将Decode.apk的内容解压到其中。
    -  通过apktool.bat解压apk时，解压出来的xml是可以查看和修改的。

<br>**decode命令**
　　既然上面用到apktool工具的`decode`命令，那么在继续向下进行之前，有必要先学习一下该命令的用法。
　　它的语法格式为：
``` lua
apktool d[ecode] [options] <file_apk>
```
    语句解释：
    -  在上面的语法遵守了“扩展巴科斯范式”的约定，中括号括起来的代表是可选的，尖括号括起来的是必选的。
    -  刚才我们执行的命令是“apktool.bat d -f Decode.apk”，其中d是decode的简写，它等价于：apktool decode。
    -  [options]是decode命令的附加选项，常用的取值有：
       -  -s：反编译时不反编译apk中的源代码。即不会把apk里的classes.dex文件反编译。
       -  -r：反编译时不反编译apk中的资源文件。即res目录下的xml文件等仍然保持二进制形式的，并且res/values将不会被反编译。
       -  -f：强制覆盖已经存在的文件。即执行反编译命令时，如果输出路径所已经存在了，则是无法进行反编译的，除非加上-f参数。
       -  -o：反编译的输出路径。如果不写则默认为当前目录，并且以apk的文件名作为输出目录名。
    -  <file.apk>：要反编译的文件的名称。

　　4、接着修改`Decode\res\values\strings.xml`文件中的“`Hello world!`”为“`世界，你好!`”。
　　5、接着删除`Decode\res\drawable-ldp`、`Decode\res\drawable-mdpi`、`Decode\res\drawable-xhdpi`三个目录。
　　6、然后找一个`72*72`尺寸的`png`图来替换调`Decode\res\drawable-hdpi`目录中的“`ic_launcher.png`”。
　　7、在`cmd`窗口中执行如下命令：
``` lua
apktool.bat b Decode -o newDecode.apk
```
　　另外，在打开、修改、保存`Decode\res\values\strings.xml`文件时，要始终保证文件编码是`UTF-8`，因为在“记事本”等文本编译软件中会自动使用系统的默认编码来操作文本文件，而中文操作系统的默认编码是`GBK`，这会导致打包失败。

<br>**build命令**
　　同样的，我们也来学习一下apktool工具的`build`命令的语法格式为：
``` lua
apktool b[uild] [options] <app_path>
```
    语句解释：
    -  [options]是build命令的附加选项，常用的取值有：
       -  -o：打包成功后生出的文件。如果不写则默认将apk放到<app_path>/dist目录下。
    -  <app_path>：要打包的目录。

　　值得注意的是，使用`apktool`的`build`命令生成的`apk`是一个未签名的文件，而未签名的文件是无法被安装的，因此接下来我们要对`apk`进行签名，并且为了能覆盖安装，我们将不再创建新的签名文件，而是使用`debug.keystore`进行签名。

　　说到这里，我们就可以发现一件事：如果我们能得到软件作者的签名文件，那么我们破解后的包将完全可以覆盖安装掉原作者的包！！！

　　我们需要使用下面的命令来对apk进行签名：
``` lua
jarsigner -verbose -keystore debug.keystore -signedjar signed.apk newDecode.apk androiddebugkey -storepass android -digestalg SHA1 -sigalg MD5withRSA
```
    语句解释：
    -  首先要保证JDK\bin目录已经被放到了PATH环境变量中，否则无法使用上面的命令进行打包。
    -  下面依次介绍一下jarsigner.exe的各个参数的取值：
       -  [-verbose[:suboptions]]：签名/验证时输出详细的过程信息。子选项可以是all, grouped或summary。
       -  [-keystore <url>]：签名文件的保存位置。
       -  [-signedjar <文件>]，这个参数分为三个部分：
          -  第一部分是即将生成的已签名的JAR文件所要使用的名称。
          -  第二部分是待签名的apk文件。
          -  第三部分是签名文件里设置的别名(alias)。
       -  [-storepass <口令>]：签名文件里设置的密码。
       -  [-digestalg <算法>]：摘要算法的名称。
       -  [-sigalg <算法>]：签名算法的名称。

　　然后就可以将生成的`signed.apk`安装到手机上查看运行效果了。

　　至此我们通过修改`apk`里的文字、图片资源，完成了一个最简单的破解。 但是真正的游戏、软件破解可不是这么简单的，万里长征，第一步吧。

## 破解App ##
　　本节将介绍如何破解一个纯Android开发的应用软件，至于游戏的破解将在下一节中介绍。

　　老规矩为了更好的理解破解过程，我们在此之前先介绍一下`JVM`、`Dalvik`、`Dex`三者的概念。

　　JVM、Dalvik与Dex：

    -  JVM是Java Virtual Machine（Java虚拟机）的缩写，简单的说它就是用来运行Java程序的。
       -  目前Android程序使用Java语言来开发，因而不可避免的会使用JVM来运行程序。但实际上JVM对移动设备的支持并没有想象中的那么完美，因而Google公司自己设计了一个用于Android平台的虚拟机，即Dalvik。
    -  Dalvik和JVM是一样的，用来解释执行Java字节码文件，但Dalvik解析的字节码文件的后缀名为.dex，而不是JVM的.class。
       -  这也就是说，Android系统中的应用程序是运行在Android自身的Dalvik虚拟机上的，而不是运行在Java VM之上。
    -  对于Android来说，通常情况下一个Apk文件内部只有一个classes.dex文件，而这个.dex文件内部其实保存着多个.class文件。

<br>　　然后再介绍一下`Smali`语言的概念：

    -  在使用Apktool工具反编译apk时，它会在输出目录里创建一个smali子目录，并将apk里面的classes.dex里的一个个类，按照它们的包结构反编译成一个个的smali文件，Smali文件里的代码都是用Smali语言写的。
    -  Smali代码是Android的Dalvik虚拟机的可执行文件DEX文件反汇编后的代码，Smali语言是Dalvik的反汇编语言。  

<br>　　到这里一切都明白了，由于我们手上不可能拥有`apk`的源代码， 所以为了达到破解的目的，我们只能通过修改反编译生成的`smali`文件的内容来完成修改游戏逻辑的需求了。既然我们目标已经明确了（需要去修改`smali`文件），那么下一步就应该动手去做了。但在动手之前，还得先学习一下`Smali`语言的基础语法，不然是无从下手的（看都看不懂，又怎能知道如何修改）。

### Smali语言入门 ###
　　为了由浅入深的介绍`Smali`语言，我们先在原来的`Decode`项目基础上创建一个普通的类：`HelloWorld`。

<br>　　范例1：com.cutler.decode.HelloWorld.java。
``` java
package com.cutler.decode;

public class HelloWorld {
    // 定义基本类型变量
    static short varShort;
    protected static int varInt;
    // 定义对象类型变量
    String objString = "ABC";
    Long objLong;
    
    public HelloWorld(int param1, boolean param2){
        int param3 = 2;
        long param4 = 3;
    }
}
```
    语句解释：
    -  在HelloWorld中定义了各种类型的变量和方法，稍后我们将看到这些代码的在Smali语言中是如何表示的。
    -  由于篇幅有限，笔者不会把所有Java支持的语法都列举出来，并将它们对应于Smali代码，因此本章中未讲到的语法知识，读者可以自行去测试。

<br>　　然后对项目执行编译、运行操作，并将生成的apk文件反编译，接着打开`smali/com/cutler/decode/HelloWorld.smali`文件。

<br>　　范例2：HelloWorld.smali代码解读（1）。
``` smali
# .class指明当前文件是一个类文件，后面跟随着该类的访问（和存在）修饰符、包名、类名
.class public Lcom/cutler/decode/HelloWorld;
# .super指明当前类的父类
.super Ljava/lang/Object;
# .source指明当前类所在的文件名
.source "HelloWorld.java"


# static fields
# .field 指明接下来定义的是一个字段。 格式为：[.field 修饰符 字段名:字段数据类型简写形式]
.field protected static varInt:I
.field static varShort:S


# instance fields
.field objLong:Ljava/lang/Long;
.field objString:Ljava/lang/String;


# direct methods
# .method 指明接下来定义的是一个方法。 constructor表名该方法是一个构造方法。
# 方法内部代码的含义，会在下面的几个范例中逐一讲解。
.method public constructor <init>(IZ)V
    .locals 4
    .param p1, "param1"    # I
    .param p2, "param2"    # Z

    .prologue
    .line 11
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 8
    const-string v3, "ABC"

    iput-object v3, p0, Lcom/cutler/decode/HelloWorld;->objString:Ljava/lang/String;

    .line 12
    const/4 v0, 0x2

    .line 13
    .local v0, param3:I
    const-wide/16 v1, 0x3

    .line 14
    .local v1, param4:J
    return-void
#.end method是方法结束的标志。
.end method
```
    语句解释：
    -  上面提到的字段的数据类型简写形式，可以通过JDK提供的javap工具获取，在NDK开发的时候也会用到javap工具。
    -  javap的命令为：javap -s 包名.类名
    -  数据类型的简写形式有：
       -  byte -> B    char -> C      short -> S      double -> D      long -> J
       -  int -> I     float -> F     boolean -> Z    int[]-> [I       Object -> L

<br>　　范例3：HelloWorld.smali代码解读（2）。
　　方法有直接方法和虚方法两种，直接方法的声明格式如下：
``` smali
.method <访问权限> [修饰关键字] <方法签名>  
    <.locals> 
    [.parameter] 
    [.prologue] 
    [.line] 
    <代码体>
.end method 
```
    语句解释：
    -  <访问权限>的取值有public、private等。
    -  [修饰关键字]的取值有static、constructor等。
    -  <方法签名>的格式为：（参数1的类型参数2的类型...）方法返回值的类型。也可以通过javap工具获取某个类的方法签名。
    -  <.locals>指定了方法中局部变量所占据的寄存器的总数（注意不包括方法的参数）。这里有三点需要注意的：
       -  1、如果局部变量没有被赋值，则是不会被计算到.locals里的。比如int a;不会被计算，而int a = 3;则就会被计算。
       -  2、特别说明一下：Long和Double类型是64位的，需要2个寄存器。
       -  3、在apktool的其他版本中，反编译出来的smali文件里可能使用的是.registers而不是.locals。
    -  [.parameter]指定了方法的参数。 每一个参数对应一个[.parameter]，格式为：.parameter 参数名。
    -  [.prologue]指明当前位置是代码的开始处。即在它之前出现的都是些方法的元数据，在它之后出现的才是真正的代码。
    -  [.line]指定了该处指令在源代码中的位置。
    -  <代码体>指明了代码的内容。一般情况下它总是跟随着[.line]一起出现。

<br>　　在继续学习之前，有些东西需要先说明一下。
　　前面说过，`Dalvik`与`JVM`的最大的区别之一就是`Dalvik`是基于寄存器的。这意味着在`Smali`里的所有操作都必须经过寄存器来进行，比如函数调用、变量赋值等等。
<br>　　寄存器分为两种：本地寄存器和参数寄存器。

    -  本地寄存器是用来保存方法内的局部变量的值所使用的寄存器。用v开头数字结尾的符号来表示，如v0、v1、v2、...。本地寄存器没有限制，理论上是可以任意使用的。
    -  参数寄存器是用来保存方法参数的值所使用的寄存器。以p开头以数字结尾的符号来表示，如p0、p1、p2、...。特别注意的是p0不一定是方法的第一个参数：
       -  在非static函数中，p0代指“this”，p1表示函数的第一个参数，依此类推...。
       -  在static函数中p0才对应第一个参数（因为Java的static方法中没有this）。   

　　之所以范例2的代码中`.locals`的值是4，是因为`smali`代码中包含了`v0-v3`共4个寄存器。

<br>　　范例4：HelloWorld.smali代码解读（3）。
``` smali
.line 11
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
```
    语句解释：
    -  invoke-direct指令用来调用一个实例方法，格式为：invoke-direct {参数列表}, 方法所在的类以及方法签名。
    -  本范例的含义为：在对象p0上调用其继承自父类Object类的无参构造方法。

<br>　　范例5：HelloWorld.smali代码解读（4）。
``` smali
const-string v3, "ABC"
const/4 v0, 0x2
const-wide/16 v1, 0x3
```
    语句解释：
    -  以const开头的指令都是在定义常量。
    -  const-string指令用来定义一个字符串常量。第一行代码的含义为：将字符串ABC的地址赋值给v3。
    -  const/4和const-wide/16分别对应int和long型的长量。
    
<br>　　范例6：HelloWorld.smali代码解读（5）。
``` smali
iput-object v3, p0, Lcom/cutler/decode/HelloWorld;->objString:Ljava/lang/String;
```
    语句解释：
    -  以iput开头的指令都是为一个成员变量赋值，以iget开头的指令都是用来获取成员变量的值。如：iget-boolean。
    -  以sput开头的指令都是为一个静态变量赋值，以sget开头的指令都是用来获取静态变量的值。如：sput-short。
    -  没有“-object”后缀的表示操作的成员变量对象是基本数据类型，带“-object”表示操作的成员变量是对象类型。
    -  本范例代码的含义是：将寄存器v3中保存的值，赋值到对象p0的objString属性上去。
       -  Lcom/cutler/decode/HelloWorld; 表示属性所隶属的类。
       -  ->表示从属关系。即箭头右端的字段隶属于箭头左端的类。
       -  objString表示属性的名称。
       -  Ljava/lang/String;表数属性的数据类型。

　　最后的那一条`return-void`指令，就是表示方法没有返回值。如果方法有返回值的话代码类似于：`return v0`。

<br>**本节参考阅读：**
- [Smali语法学习与DEX文件详解](http://wenku.baidu.com/link?url=B4NykyUlMMkK_zTAZSUT92mNVpCpX0NscXAGlDJGUGPVwZcTrlzJCDONz0x-KiKVNT1-hkACWSc-hbApUbVpWYTmKkXBYfqoJsJg1lv89Wq) 
- [APK反编译之一：基础知识](http://blog.csdn.net/lpohvbe/article/details/7981386)  

### MainActivity.smali ###
　　通过上一节我们了解了`Smali`语言的基础语法，但是仅仅了解那几个语法还是远远不够的，本节则通过分析`MainActivity.smali`文件来介绍`Smali`语言的其它语法。

<br>　　范例1：onCreate()方法分析。
``` smali
# virtual methods
.method public onCreate(Landroid/os/Bundle;)V
    .locals 1
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 11
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 12
    const/high16 v0, 0x7f030000

    invoke-virtual {p0, v0}, Lcom/cutler/decode/MainActivity;->setContentView(I)V

    .line 13
    return-void
.end method
```
    语句解释：
    -  以invoke开头的指令都是在进行方法调用。常用的几个指令有：
       -  invoke-static 调用静态方法。
       -  invoke-super 调用父类的方法。
       -  invoke-interface 调用接口的方法。
       -  invoke-direct

<br>　　现在我们想在`MainActivity.smali`的`onCreate()`方法里加个`Toast`，Android中对应的代码应该是这样的：
``` android
Toast.makeText(this, "世界，你好！", Toast.LENGTH_SHORT).show();
```
<br>　　那么问题来了，虽然我们之前讲解的东西都很容易懂，但是现在让我们真刀真枪的上去干，还是不会写啊，怎么办？ 
　　简单，那就自己建立一个Android项目，在Android中把这行代码给写出来，然后再反编译它，就得到了我们想要的代码了，这种方法对于那些比较复杂的情况也照样适用，最多在代码使用之前我们稍微改改而已。
　　`写代码不会写，尼玛改代码还不会么？？？？`

<br>　　范例2：添加Toast输出。
``` smali
# virtual methods
.method public onCreate(Landroid/os/Bundle;)V
    .locals 2
    .param p1, "savedInstanceState"    # Landroid/os/Bundle;

    .prologue
    .line 11
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 12
    const/high16 v0, 0x7f030000

    invoke-virtual {p0, v0}, Lcom/cutler/decode/MainActivity;->setContentView(I)V

    .line 13
    const-string v0, "\u4e16\u754c\uff0c\u4f60\u597d\uff01"

    const/4 v1, 0x0

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    .line 14
    return-void
.end method
```
    语句解释：
    -  将Demo项目为Toast而生成的smali代码放到待破解项目中时，有以下几点要注意：
       -  确保函数第一行上的那个“.locals 寄存器数量”的数值是正确的。 比如默认情况下onCreate的.locals值为1，但是由于我们添加了的Toast操作需要两个寄存器变量，所以需要把.locals修改为2。
       -  onCreate()函数里的代码的“.line 行号”就得相应后移了。如本范例把Toast的smali代码插入到onCreate()函数的13行上，相应的return-void就应该被定义为“.line 14了”。
    -  move-result-object指令用来将它上一条“方法调用”指令的返回值放到一个寄存器中。

　　关于Smali的其他语法在此就不一一介绍了，当遇到不认识的指令时Google搜索或自己推测一下，问题都不大。

## 破解游戏 ##
　　在破解之前，先来说一下游戏破解最常见的两个目的：

    -  修改游戏里的数值。 比如金钱、血量。
    -  修改游戏里的支付、分享等逻辑。 比如让玩家点击充值、分享时直接可以获取到奖励，而不用真正的去充值、分享。

　　市场中的游戏都是基于各种各样的游戏引擎开发的，而大多数游戏的源代码最终都被打入一个`so`库中，然后在程序中动态加载这个库文件。如果想修改游戏的数值必须得修改`so`库。
　　由于修改`so`库的技术含量比较高，因此本节只会讲解如何破解使用`Cocos2d-x`、`Unity3D`游戏引擎开发的单机游戏的支付、分享等逻辑。

<br>**思路是这样的**
　　以国内游戏为例，通常游戏会接入支付宝、银联等支付SDK，接入微信、新浪微博等分享SDK，而这些SDK的厂家都是通过`jar`包的形式对外提供SDK的，这就好办多了，我们通过前三节学习的知识完全可以完成破解工作（也许你还需要再学习一些指令，比如`if`指令）。
　　我们以分享为例，通常游戏需要进行分享时，开发人员的做法会是：

    -  当玩家在游戏中点击分享按钮时，游戏会调用Android中的某个类（假设它叫ShareUtil）的某个方法（假设它叫share）中执行分享操作。
    -  在ShareUtil.share()方法中会执行两个操作：
       -  首先，设置一些与分享相关的信息（比如要分享的文字、图片等）。
       -  然后，调用分享SDK进行分享。
    -  当分享SDK分享成功后会通过回调通知ShareUtil。
    -  最后，ShareUtil接到通知后会转过来去告诉游戏端发放奖励。

　　支付的流程与分享的流程是类似的，既然已经知道了它们的套路，那么接下来我们就开始吧。

### 《愚公移山》 ###
　　《愚公移山》是由厦门青瓷开发，上海黑桃互动代理发行的手机休闲游戏，运用Unity3D技术实现游戏的多平台均可运行的游戏。

　　[点击查看：《愚公移山1.1》](http://zhushou.360.cn/detail/index/soft_id/2037801)

　　将apk下载到本地后，为了避免中文文件名导致的各种问题，我们先把apk文件的名称为`“ygys.apk”`。

<br>　　范例1：先把它反编译。
```
apktool.bat d ygys.apk
```
    语句解释：
    -  你懂得！！！！

<br>　　破解游戏的第一步要干什么？ 当然是先确定目标啊，我们的破解任务有两个：

    -  进入游戏后，点击“商店”，找到“微信分享”，让玩家可以在点击“一键分享朋友圈”时，直接获得“5000儿孙”!!!
    -  在“商店”里，找到充值金币的按钮，让玩家可以在不花费人民币的情况下就获得金币。

　　确立了目标后，然后就该各个击破它们了。

#### 破解分享功能 ####
　　知己知彼百战不殆，破解之前先打开游戏玩一下，看看它们用的是哪家的分享SDK，这样我们就可以也下载那个SDK，然后参考SDK的接入流程来进行破解了。  

　　通过观察，从表面上只能看出愚公移山使用的是微信分享，但是没法确定具体是哪一家的（有些第三方分享SDK将各大平台的分享SDK封装到一起了），没办法只能进入到smali目录下，随便瞎看，结果没点几下就看到了`smali\cn\sharesdk`目录，看到这里我们就知道了，它使用的是[ ShareSDK ](http://sharesdk.mob.com/Download)。
　　然后，我们就可以去ShareSDK官网把Android端的分享SDK的接入Demo给下载下来，稍后会用到。

　　现在我们来看看ShareSDK的demo项目中是如何进行微信分享的，找到`cn.sharesdk.demo.WechatPage`类，发现有如下代码：
``` android
ShareSDK.setPlatformDevInfo("WechatMoments", map);
```
　　这行代码的作用看起来像是为SDK指定分享的方式的，那么就用它作为我们的入口，因为不论是`.java`文件还是`.smali`文件，虽然它们的语法差别很大，但是方法的名称是不会被改变的。

　　为了方便代码定位，我们将反编译出来的`ygys`文件夹放入到Eclipe中，因为Eclipse有全文搜索的功能，快捷键是“`ctrl+H`”，打开搜索窗口后，找到“`File Search`”选项卡，搜索`setPlatformDevInfo`关键字，如下图所示：

<center>
![Eclipse全文搜索](/img/android/android_26_1.png)
</center>

　　最终搜索出两个结果，通过观察发现，第一个结果是`setPlatformDevInfo`的定义，而第二个则是对`setPlatformDevInfo`的调用。
　　我们打开`smali\com\qcplay\www\wechat\wxapi\WXShare.smali`，找到`318`行，发现它是属于“`.method private _init()V`”函数的，以我们以往接入SDK的经验来看，一般SDK都会存在一个“初始化”的步骤，只有初始化完毕后，SDK才能正常工作，所以`_init`方法应该不是用户点击按钮的时候调用的，因为初始化通常是个耗时操作，放在点击按钮的时候调用明显不合适（用户等待的时间就变长了）。
　　当然最重要的一点是，仔细看了一下这个方法里的代码，并没有任何与分享有关的代码，所以综合这些信息，可以判定我们要找的不是这个方法。

　　那么既然已经找到了`setPlatformDevInfo`方法的调用位置了，那么真正执行分享的代码应该也在附近（除非那个狗日的程序员是个傻屌乱写代码），现在只有上下看看`WXShare.smali`里还有其他什么方法没有，结果看到了下面这八个方法：

    -  ShareImgBit、ShareImgPath、ShareText、ShareWebPage、_shareImgBit、_shareImgPath、_shareText、_shareWebPage

　　其中后四个是`private`修饰的，外界没法直接调用它们，因此先将它们排除。
　　现在只剩下四个方法了，但是当玩家在游戏中点击“`一键分享朋友圈`”按钮时，真正调用的是哪一个方法呢？ 没办法只有在这四个方法里都加入我们的代码，进行测试了，比如我们把`ShareText`方法的代码修改如下：
``` smali
.method public static ShareText(ZLjava/lang/String;)V
    .locals 2
    .param p0, "isTimelineCb"    # Z
    .param p1, "text"    # Ljava/lang/String;

    .prologue
    .line 96
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;

    const-string v1, "*********************************** Hi ShareText"

    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V

    .line 97
    return-void
.end method
```
    语句解释：
    -  实际上就是加了一个System.out.println("*********************************** Hi ShareText");
    -  注意还要修改一下 .locals 2，因为System.out语句使用到了2个寄存器。

　　相应的我们也在另外三个方法里加上不同的输出内容，然后重新打包、签名、安装、运行，当点击“一键分享朋友圈”时，发现输出的内容是我们在`ShareWebPage`方法里写的内容，至此我们就确定了，当用户点击分享按钮时Android端第一个被调用的方法了。

　　查看`ShareWebPage`方法的内部，发现它又调用了`_shareWebPage`方法，我们接着跟进去，第一眼看到的就是我们熟悉的`Handler`的定义：
``` smali
.prologue
.line 127
new-instance v6, Landroid/os/Handler;
```
　　通过连猜带蒙的方式，得知它调用了`Handler.post(Runnable)`方法执行一个任务，这个`Runnable`对象就是`WXShare$3.smali`。由于那一行代码看起来像是在调用分享SDK，所以我们只能硬着头皮继续看`WXShare$3.smali`了。
　　提示：在Java中，一个内部类的类名的格式为`外部类名$内部类名`，对于匿名内部类来说，内部类名用数字编号。

　　既然知道`WXShare$3`是`Runnable`的子类，那我们直接去找`run`方法，看看里面有什么。又是一阵连蒙带猜结束后，看到了如下代码：
``` smali
.line 141
.local v2, "wechat":Lcn/sharesdk/framework/Platform;
invoke-virtual {v2, v1}, Lcn/sharesdk/framework/Platform;->share(Lcn/sharesdk/framework/Platform$ShareParams;)V
```
　　终于找到了我们想要看到的“`share`”函数的调用了，虽然不确定是不是分享，但是从名字上看，`90%`是没错了。假设我们没找错，那也只是能证明“`点击一键分享朋友圈按钮时，程序会调用ShareWebPage函数，并由ShareWebPage函数执行分享操作`”，接下来我们该干什么?

　　我们没必要继续向下追踪了，那里面都是分享SDK相关的代码了，对我们没用。现在就需要回到ShareSDK官方提供的Demo项目中看看当分享成功后它是怎么接到通知的。
　　从`WechatPage.java`中找到了如下代码：
``` android
Platform plat = null;
ShareParams sp = getShareParams(v);
if (ctvPlats[0].isChecked()) {
    plat = ShareSDK.getPlatform("Wechat");
} else if (ctvPlats[1].isChecked()) {
    plat = ShareSDK.getPlatform("WechatMoments");
} else {
    plat = ShareSDK.getPlatform("WechatFavorite");
}
plat.setPlatformActionListener(this);
plat.share(sp);
```
　　发现它是在调用`share`方法进行分享之前，调用`setPlatformActionListener`方法设置了一个回调接口，`WechatPage`类实现了该接口。
　　那么我们再在`WechatPage`类找找`PlatformActionListener`接口定义了哪些方法，最终找到了它：
``` android
public void onComplete(Platform plat, int action, HashMap<String, Object> res)
```

　　终于又找到新的线索了，当分享成功后ShareSDK会调用`PlatformActionListener`接口的`onComplete`函数。那么还是按照刚才的结论(同一模块内部的一些相关的类所在的位置相距不会太远），在`smali\com\qcplay\www\wechat\wxapi`目录下找找，看看有没有实现`PlatformActionListener`接口的`smali`文件。
　　最终，我们定位到了`WXShare$2.smali`，在它的`onComplete`函数里找到了如下代码：
``` smali
.line 71
const-string v0, "3rd_sdk"

const-string v1, "OnWeChatResp"

const-string v2, "errcode=0"

invoke-static {v0, v1, v2}, Lcom/unity3d/player/UnityPlayer;->UnitySendMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
```
　　这就是当分享成功后，程序要执行的代码，`onComplete`函数里的其他代码就是用来打印`Log`的，不重要，我们不用管。
　　现在我们需要做的就是，把这段代码copy出来，然后放到`WXShare.smali`的`ShareWebPage`函数里。即当用户点击分享的时候，我们不调用分享，而是直接调用上面的代码，让用户可以立刻领取奖励，最终的代码如下：
``` smali
.method public static ShareWebPage(ZLjava/lang/String;Ljava/lang/String;Ljava/lang/String;[B)V
    .locals 6
    .param p0, "isTimelineCb"    # Z
    .param p1, "url"    # Ljava/lang/String;
    .param p2, "title"    # Ljava/lang/String;
    .param p3, "description"    # Ljava/lang/String;
    .param p4, "img"    # [B

    .prologue
    .line 122
    const-string v0, "3rd_sdk"
    const-string v1, "OnWeChatResp"
    const-string v2, "errcode=0"
    invoke-static {v0, v1, v2}, Lcom/unity3d/player/UnityPlayer;->UnitySendMessage(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 123
    return-void
.end method
```
　　然后保存、打包、签名、运行。

　　至此我们就完成了分享SDK的破解，看了这么多你可能会感觉，如果是自己搞的话思路不会有这么清晰，还是会感觉无从下手。 没关系，万事开头难，我搞这个SDK破解也是没头绪的晕了2天，然后才慢慢走出来的。


#### 破解短信支付功能 ####
　　还是老套路，先观察游戏使用的是什么支付方式再决定怎么破解。 但经过观察后，我们从游戏界面上只能看出来《愚公移山》使用的是短信支付，其他的却什么都看不出来，那么只能再去看看`smali`文件夹下面有什么线索没有了。

　　虽然现在没什么头绪，只能是胡乱翻找，但是按照“`相关代码不会离太远`”的原则，我们先去`sharesdk`所在的目录看看，结果发现了一个名为“`egame`”的支付SDK，然后果断去百度一下，看看`egame`是怎么个用法，结果搜索到了 http://180.96.63.69/Documents/SDK_Pay.html 。

　　接着将`egame`的SDK下载下来，打开`cn.play.egamesmsonline69.MainActivity`文件，发现有个名为`EgamePay`的类比较核心，我们也许可以从它入手。 
　　然后在Eclipse中全文搜索`EgamePay`类，查询出了2个目录：

    -  cn\egame\terminal\paysdk
    -  com\heitao\mp\channel
　　其中第一个目录不出意外的话应该是`egame`提供给游戏开发者的SDK中的`jar`包，所以对我们没什么用。
　　而第二个目录，看起来就像是游戏开发者自己写的充值代码了，所以我们打算先打开`HTMP_CHA.smali`文件看看，查看之后，结果里面就是支付相关的代码。

　　但是此时还有个问题，`com\heitao\mp\channel`目录下有`7`个类，其中`HTMPBaseChannel.smali`是一个父类，另外`6`个类中有三个是内部类，而剩下的三个类从名字来看的话，应该是代表三个充值渠道，那么可以肯定的是，这三个渠道不会同时被使用，所以需要知道我们从`360`市场下载过来的apk会走哪个充值渠道。
　　这个好判断，只要在这三个类中都加上我们万能的HelloWorld代码，然后重新打包，看看运行时输出的内容就可以了。

``` smali
.method public doPay(Lcom/heitao/mp/model/HTMPPayInfo;Lcom/heitao/mp/listener/HTMPPayListener;)V

#以上省略若干代码

    .line 150
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
    const-string v1, "*********************************** Hello World22"
    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V
    :goto_0
    return-void

#以下省略若干代码

.end method
```
<br>　　从运行结果看出来，我们从360上下载的apk所使用的渠道为`HTMP_CHL.smali`，那么接下来要做的就是：

    -  先把调用充值SDK的代码（假设为A）给删掉。
    -  然后找到充值成功后程序要执行的代码（假设为B）。
    -  将B放到原来A所在的地方。
　　
　　那么先来删除调用充值SDK的代码（`HTMP_CHL.smali`的第`74`行），即下面的这段：
``` smali
invoke-virtual/range {v0 .. v6}, Lmm/purchasesdk/Purchase;->order(Landroid/content/Context;Ljava/lang/String;ILjava/lang/String;ZLmm/purchasesdk/OnPurchaseListener;)Ljava/lang/String;
```
　　为什么知道是这个方法呢? 还是老样子，一半是猜的，一半是根据支付SDK分析的。 
　　事实上《愚公移山》的apk中包含了多个支付SDK（至少我就看到了2个），一个是`egame`，一个是中国移动的`purchasesdk`。
　　从360平台上下载的《愚公移山》实际上使用的是中国移动的`purchasesdk`，我们上面的分析过程的意义就是：通过搜索`egmae`中的`EgamePay`类来定位出《愚公移山》的支付模块所在的位置，进而确定了它使用的支付SDK实际为`purchasesdk`。

　　接下来我们需要找到充值后要执行的代码，目前唯一的线索就是`HTMP_CHL$1.smali`这个内部类，进入看看后，发下了如下可疑代码：
``` smali
.line 57
iget-object v1, p0, Lcom/heitao/mp/channel/HTMP_CHL$1;->this$0:Lcom/heitao/mp/channel/HTMP_CHL;

iget-object v1, v1, Lcom/heitao/mp/channel/HTMP_CHL;->mPayListener:Lcom/heitao/mp/listener/HTMPPayListener;

invoke-virtual {v1}, Lcom/heitao/mp/listener/HTMPPayListener;->onHTPayCompleted()V
```
　　然后把这三行代码中的后两行copy出来，放到`HTMP_CHL.smali`的`doPay`方法里即可，最终结果如下：
``` smali

#以上省略若干代码

    move v5, v3

    iget-object v1, p0, Lcom/heitao/mp/channel/HTMP_CHL;->mPayListener:Lcom/heitao/mp/listener/HTMPPayListener;

    invoke-virtual {v1}, Lcom/heitao/mp/listener/HTMPPayListener;->onHTPayCompleted()V

    .line 150
    :goto_0
    return-void

#以下省略若干代码

```
    语句解释：
    -  HTMP_CHL类的mPayListener字段继承自父类HTMPBaseChannel。
    -  注意：copy过来代码后，还要把“iget-object v1, v1”改成“iget-object v1, p0”。

<br>　　从上面的破解过程可以看出来，软件破解的成功与否，除了需要大量的代码分析外，还与运气有那么一点关系。

### 《消灭星星》 ###
　　《消灭星星》是一款经典的消除类益智休闲手游，由掌游天下从韩国引入后深受中国玩家们的喜爱。简单的游戏规则，轻松的趣味关卡，1分钟即可上手,，一旦开始根本停不下来！

　　[点击查看：《消灭星星4.0.1》](http://shouji.baidu.com/game/item?docid=7371485&from=web_alad_6)

**此次破解任务：**
　　将《消灭星星》里的支付SDK替换成我们自己的支付SDK，具体可以将任务分为两步来执行：

    -  首先，定位出游戏调用支付和处理支付结果的代码。
    -  然后，将我们的SDK插入到游戏中。

#### 定位支付代码 ####
　　游戏下载完毕后我们不着急破解，而是先将它安装到手机上观察一下整个游戏，比如看看它使用的是什么样的支付方式（手机话费、支付宝等）。

<br>**移动MM支付SDK？**
　　首次打开游戏，发现了`“MM伴我，移动生活”`的闪屏页，因而可以初步判断游戏应该是接入了中国移动的支付SDK，然后进入游戏，在商城中选择某个充值项后，游戏确实也打开了手机话费的充值界面，这样一来就有`90%`的把握确定游戏是接入的移动支付。
　　然后，在百度中搜索`“移动mm支付sdk”`可以搜索到[ 中国移动应用内计费SDK ](http://dev.10086.cn/cmdn/bbs/thread-80671-1-1.html)，从帖子中的截图来看，这和《消灭星星》中弹出的支付界面十分相似，那么现在我们有`98%`的把握确定游戏是接入的移动支付。
　　接着，我们下载这个移动支付的SDK，打开`Demo\src\com\aspire\demo\Demo.java`文件，找一下支付相关的代码，发现了支付时所执行的代码为`purchase.order(context, mPaycode, listener);`，我们从这行代码中提取出两个关键词`Purchase`和`order`。
　　接着，把《消灭星星》的`apk`给反编译了，并把`smali`文件夹放入到`Eclipse`中，全文搜索这两个关键字，虽然搜索出来的内容不少，但是能和`order(context, mPaycode, listener)`对上号的却没有。
　　但是，从已到的信息来看，游戏很大可能是使用了移动MM支付，但是我们却搜不到支付相关的代码，现在好像是没头绪了，然后笔者无意识的退出游戏，再次重新进入时发现闪屏页变化成了`百度移动游戏`。

<br>**百度移动游戏SDK！**
　　既然获取到了新线索，那现在就去搜索`百度移动游戏SDK`，然后就找到了[ Android单机SDK ](http://dev.mgame.baidu.com/yyjr/djsdk)。
　　下载完毕后打开`doc\百度移动游戏SDK（单机版）接入API参考手册_支付模块.doc`，我们找到了一个名为`invokePayCenterActivity`支付接口，然后全文搜索它，结果找到了我们想要的代码。
　　从搜索结果中我们可以确定，《消灭星星》接入了百度移动游戏SDK，而在百度SDK中又接入了移动支付的SDK，我们的任务就是搞掉百度的支付SDK就可以了。

　　经过一番比较，我们猜测`PopStarxiaomiexingxingguan_401\smali\com\brianbaek\popstar\popStarA$1.smali`第`245`行（由于`ApkTool`的版本不同，你反编译出来的代码行数可能和笔者不同，请以下面的代码为准）是支付代码。
``` smali
    invoke-virtual/range {v0 .. v6}, Lcom/duoku/platform/single/DKPlatform;->invokePayCenterActivity(Landroid/content/Context;Lcom/duoku/platform/single/item/GamePropsInfo;Lcom/duoku/platform/single/item/DKCMMdoData;Lcom/duoku/platform/single/item/DKCMMMData;Lcom/duoku/platform/single/item/DKCMGBData;Lcom/duoku/platform/single/callback/IDKSDKCallBack;)V
```
　　为了验证猜测，将那行代码替换为我们万能的`HelloWorld`：
``` smali
    sget-object v0, Ljava/lang/System;->out:Ljava/io/PrintStream;
    const-string v1, "*********************************** Hello World22"
    invoke-virtual {v0, v1}, Ljava/io/PrintStream;->println(Ljava/lang/String;)V
```
　　然后打包、签名、运行，从运行的结果可以看到，我们的猜测是正确的。

<br>**支付成功后的代码**
　　继续查看`百度移动游戏SDK`的文档，发现在调用支付接口时，第6个参数是一个名为`IDKSDKCallBack`回调接口，用来接收支付的结果。
　　然后，我们通过`popStarA$1.smali`第`239`行代码得知，支付函数的第六个参数（即`v6`）是`com/brianbaek/popstar/popStarA$1$4;`类型的，因此我们现在就去该文件中找一找线索。

　　整体查看一遍`popStarA$1$4;`后，猜测对我们有用的代码应该在`onResponse`方法中，然后再经历一些连蒙带猜，定位出第`66`和`107`行是支付完成后，通知游戏进行后续操作的代码，它们分别表示`支付失败`（值为0）和`支付成功`（值为1）。

　　为了验证猜测，我们把下面的代码替换到`popStarA$1.smali`第`245`行上：
``` smali
    const/4 v3, 0x1

    invoke-static {v3}, Lcom/zplay/iap/ZplayJNI;->sendMessage(I)V
```
　　然后打包、签名、运行，从运行的结果可以看到，每当我们点击支付时，会立刻增加幸运星的个数。

#### 替换支付SDK ####
　　上面已经找到了游戏的支付相关的代码，那么破解后的游戏的支付流程应为：

    -  首先，用户点击支付按钮。
    -  然后，游戏调用我们的支付SDK进行支付。
    -  接着，依据我们的SDK的支付结果来控制游戏是否发放游戏币。

<br>　　通常，各平台（支付宝、微信等）的支付SDK会以一个`lib`项目的形式提供给开发者，且`lib`项目中会包含一些`drawable`、`style`、`layout`等资源，因此如果我们想把它们的SDK插入到某个`apk`中，则必须得把SDK中的`drawable`等也同时插入进去。

　　这此时就有一个问题，任何存在于`res`目录里的资源都是有`资源id`的，因此在破解时，我们除了要把支付SDK`res`目录下的资源文件复制到待破解的apk里外，还需要为它们创建资源id，否则在程序中是无法引用的。

　　问：那既然要添加资源id，我们总不能手工修改项目的`R`文件，挨个的为每个资源添加资源id吧？
　　答：我们可以创建一个辅助项目，把游戏和我们SDK的资源都放到它里面去，让Eclipse帮我们生成资源id，然后再把这个辅助项目的apk给反编译出来，获取到其中的`R`文件即可。

　　接下来以《消灭星星》为例，来介绍如何向apk中添加自己的SDK。

<br>**创建辅助项目**

　　第一步，创建一个新的Android项目，名为`XmxxDecode`，项目的包名要与游戏的包名相同，此处我们设置为`com.wpd.game.popstar`。
　　第二步，删除`XmxxDecode`项目中的以下内容：

    -  MainActivity.java
    -  res下的所有文件
    -  libs下的所有文件(如android-support-v4.jar)

　　第三步，将反编译出来的《消灭星星》的`res`目录的所有文件复制到`XmxxDecode`的`res`目录下。
　　第四步，删除`XmxxDecode\res\values\public.xml`文件，该文件是反编译时生成的，具体用法请自行搜索。
　　第五步，假设我们要插入到游戏中的SDK项目叫做`PaySDK`，则让`XmxxDecode`去引用`PaySDK`项目。
　　第六步，如果`PaySDK`除了提供了`lib`项目外，还提供了`jar`包让开发者接入，那么就把`jar`包复制到`XmxxDecode\libs`目录下。

<br>**将辅助项目合并到游戏中**
　　第一步，运行`XmxxDecode`项目。虽然不会成功，但是会生成一个apk，接着将`bin\XmxxDecode.apk`复制出来，反编译。
　　第二步，把在`XmxxDecode\smali`下的所有文件覆盖到`PopStarxiaomiexingxingguan_401\smali`目录下。
　　第三步，把在`XmxxDecode\res`下的所有文件覆盖到`PopStarxiaomiexingxingguan_401\res`目录下。
　　第四步，把接入`PaySDK`时所需要的权限、组件等都复制到`PopStarxiaomiexingxingguan_401\AndroidManifest.xml`中。
　　第五步，将`PopStarxiaomiexingxingguan_401`文件夹打包、签名。

　　不出意外的话，程序运行将一切正常，但事实上我们已经把`PaySDK`的资源和代码都给插入到apk中了，剩下的就是调用它们了。

<br>**调用我们的支付SDK**
　　第一步，找到`popStarA$1.smali`第`245`行，把它删掉，然后改成调用我们的支付接口。如果不会写调用语句，可以按照前面那样先在Android中写一遍然后反编译。
　　第二步，当支付有结果时，调用游戏的代码，通知游戏是否增加游戏币。

　　这里有个小的技术难点：如果Android通知游戏发放游戏币的接口是静态的，那么在我们的支付SDK中可以直接调用它，但是如果是实例的，则在支付SDK中就得想办法获取该接口的一个对象了。不过这都问题不大，稍微想想就可以解决。

<br><br>

<br><br>