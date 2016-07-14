title: 安全篇　第二章 数据加密
date: 2016-4-8 15:32:40
categories: Android开发 - 白银
---
　　本节来介绍一下加密相关的知识。在这里要特别感谢`天朝狂飚-标哥`的无私分享，本文参考了他的教案，并作出不少扩展。

# 第一节 密码学的历史 #
　　著名的密码学者`Ron Rivest`解释道：“密码学是关于如何在敌人存在的环境中通讯”。而事实也确实如此，古人脑洞大开的加密创造都是源于战争：

	-  公元前5世纪，希腊城邦为对抗奴役和侵略，与波斯发生多次冲突和战争。
	-  于西元前480年，波斯秘密结了强大的军队，准备对雅典和斯巴达发动一次突袭。
	-  希腊人狄马拉图斯在波斯的苏萨城里看到了这次集结，便利用了一层蜡把木板上的字遮盖住，送往并告知了希腊人波斯的图谋。
	-  最后，波斯海军覆没于雅典附近的沙拉米斯湾。
<!-- more -->
<br>　　古中国周朝兵书也记载了我们对密码学的运用。
　　其中的[《阴符》](http://so.gushiwen.org/guwen/bookv_4981.aspx)和[《阴书》](http://so.gushiwen.org/guwen/bookv_4982.aspx)便记载了周武王问姜子牙关于征战时与主将通讯的方式：

	-  点开上面的链接就可以查看《阴符》和《阴书》的原文，通过阅读其中的译文我们可以知道：
	   -  阴符是以八等长度的符来表达不同的消息和指令，可算是密码学中的替代法，把信息转变成敌人看不懂的符号。
	   -  阴书则运用了移位法，把书一分为三，分三人传递，要把三份书重新拼合才能获得还原的信息。


<br>　　由于古时多数人并不识字，最早的秘密书写的形式只用到纸笔或等同物品。
　　但随着识字率提高，就开始需要真正的密码学了，最古典的两个加密技巧是：

	-  转置密码：将字母顺序重新排列，例如 help me 变成 ehpl em 。
	-  替换式密码：有系统地将一组字母换成其他字母或符号，例如 fly at 变成 gmz bu （每个字母用下一个字母替换）。
　　这两种单纯的方式都不足以提供足够的机密性。

<br>　　凯撒密码是最经典的替代法，据传由古罗马皇帝凯撒所发明，用在与远方将领的通讯上，每个字母被其后第三个字母替换。

<center>
![凯撒密码](/img/android/android_BY_b02_01.jpg)
</center>

　　对于在座的各位来说，要在Android中实现凯撒密码的加密和解密是非常轻松的，所以笔者就不介绍具体步骤了。

<br>　　有警察相应的就会有强盗，所以想破解凯撒密码的人也不少，并且最终凯撒密码确实也被破解了：

	-  我们知道在一篇文章中，总会有某一个字符出现的次数是最多的。
	   -  比如汉字文章中，"的"、"一"、"了"、"是"、"我"等字的出现频率非常高。
	   -  而在英文文章中，"e"、"t"等字母出现的频率最高。
	-  基于这个原理，我们可以先统计出密文中出现最高的字符，比如得到的是'h'。
	-  然后计算字符'h'到'e'的偏移量，值为3，表示原文偏移了3个位置。
	-  最后把密文所有的字符偏移3个位置即可。

<br>　　但是盗高一尺警高一丈，这种破解方式也很容易被针对，比如：

	-  第一种方法，明文中尽量少用包含e这类大家都知道的、高频率出现的字母的单词。
	-  第二种方法，让明文中每个字母的偏移量不同。即让第一个字母偏移2个位置，第二个字母偏移9个位置等等。
	   -  这样一来，即便别人破解了某个字母，但是依然看不到明文，除非他破解所有字母。

<br>　　本节只是为了告诉大家密码学的相关历史知识，并没有其他特殊意图，正经的东西从下一节开始介绍。

　　另外，在科技快速发展的当今，加密除了在军事上应用外在商业上也大规模应用，商场也如战场。

<br>**本节参考阅读：**
- [维基百科 - 密码学](https://zh.wikipedia.org/zh-cn/%E5%AF%86%E7%A0%81%E5%AD%A6) 
- [加密的前世今生](http://www.ip-guard.net/blog/?p=1679) 


# 第二节 对称加密 #
　　需要注意的是，笔者并不打算去解释在本文中出现的一些可以见名知意的名词，比如`“密钥”`等。

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
    -  第18行代码出现的乱码，是因为“new String(bytes)”会试图将加密后的byte[]中的数据按照UTF-8编码映射成字符。
       -  但是你也知道，加密后返回的byte[]里面的数据是不确定的，是有可能是负数的。
       -  而我们试图将一个负数转换成UTF-8字符集里的字符，显然得到的只能是一个问号。
       -  再严谨一点的话就是，汉字在UTF-8编码中占据3字节，而且通常汉字的每个字节也都是一个负数。也就是说，当系统检测到当前字节是负数时，就会尝试让它和之后的字节组合，当它无法和其后的字节组成一个字符时，系统就会返回一个问号。

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
       -  首先，对“Hello World”进行加密，得到一个byte[]。
       -  然后，再将这个byte[]数组转换成String串。
          -  需要注意的是，在我们将byte[]转成String时，已经使原本的数据被破坏了。
          -  因为系统会自动将它解析不了的数字转成一个问号字符，而这个问号字符其实是有自己的编码的。
          -  换句话说，假设我们原本的数据是-100，但是问号的编码是-1，所以当将byte[]转成String时，-100就变成-1了。
       -  最后，对包含问号字符的String串进行解密，显然会报错。


<br>　　人们为了解决这个问题，就提出了`Base64`编码：

	-  Base64是一种基于64个可打印字符来表示二进制数据的表示方法。
	-  Base64中的可打印字符包括字母A-Z、a-z、数字0-9，这样共有62个字符，此外两个可打印符号在不同的系统中而不同。
	-  Base64常用于处理文本数据的场合，表示、传输、存储一些二进制数据。包括MIME的email、在XML中存储复杂数据。


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

	-  这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院（NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。
	-  AES的区块长度固定为128比特，密钥长度则可以是128，192或256比特，对应的也就是16字节、24字节、32字节。

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

	-  在开发时会发现Android使用DES/AES加密出来的数据，服务端没法解密，反过来服务端加密的Android端也不能解密。
	-  这是因为使用DES/AES算法加解密时，还可以为它设置另外两个附加选项，如果这两个附加选项的值Android端与服务端设置的不一致的话，就会导致相互无法解密。

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


# 第三节 非对称加密 #
## 概述 ##
<br>　　**问题是这样的：**
<br>　　上一节介绍的对称加密，对称加密的优点是速度快，但是安全性还是有点低：

	-  这是因为使用对称加密时，分享信息的各个个体之间都需要分享这个密钥。
	-  比如你有5个情妇，你肯定不想让她们知道彼此的存在（除非是傻吊），但总得和她们发短信调情吧。
	-  为了防止你老婆看到你与情妇A的短信内容，你会使用密钥A对内容进行加密。
	-  为了防止情妇A看到你与其他四个情妇的短信内容，你也会使用密钥BCDE分别将给情妇BCDE的短信加密。
	-  如果你给那五个情妇发短信使用的是同一个密钥的话，任何一个情妇都可以解密你与其他情妇的短信（那就炸锅了）。
	-  如果你觉得那还不算事的话，咱换一种场景：
	   -  你和商业伙伴交流时用的密钥，与和情妇ABCDE调情时用的密钥是同一个。
	   -  然后你的情妇A也养个小白脸，小白脸qwer一套技能把你情妇拿下后，情妇A就把你的密钥给小白脸了。
	   -  然后小白脸用你的密钥窃取你的商业机密，把钱搞走后带着他小姨子跑了，你咋办？
	-  呵呵，图森破！


<br>　　正是基于包养情妇的原因，我们才一定要增加密钥的数量，不能让所有情妇共用一个密钥。

　　因而，非对称加密就在此时诞生了：

	-  非对称加密算法需要两个密钥：公钥（publickey）、私钥（privatekey）。
	-  公钥和私钥是一对的，如果用公钥加密，那么只有私钥才能解密，反之用私钥加密，也只能用公钥才能解密。
	-  由于加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密。

<br>　　有了公钥和私钥之后，我们就可以愉快的和5个情妇调情了：

	-  首先，你自己有一个公钥和私钥，你的5个情妇也都各自有自己的公钥和私钥。
	-  然后，此时此刻你十分想和情妇A调情，而且是根本等不了的那种迫切，你会给情妇A发QQ消息：
	   -  你：王美丽，最近上面领导交代下来一个重要文件，你把你的公钥给我吧，我发给你。
	   -  王美丽：好的，虎爷！ 这是我的公钥：￥……&%HKJSDHF$&。
	-  此时你得到了王美丽的公钥，就开始发淫荡的短信了“今晚出来爬爬爬爬吗？晚上8点老地方见啊”，然后你用王美丽的公钥对这个信息加密，并发给王美丽。
	-  王美丽接到消息后就可以用她的私钥解密了，因为这个消息使用她的公钥加的密。
	-  退一步说，就算消息被你老婆雇佣的黑客拦截了也没用，黑客得到的只是一个密文和一个公钥，他没法解密。
	-  最终，你老婆只能相信你在给王美丽发公务文件，如法炮制，你把5个情妇的公钥拿到手后，就可以开始疯狂的调情了。

<br>　　不过这事还没完呢，道高一尺魔高一丈，咱们后面接着说，先来介绍一下`RSA`加密算法。
## RSA ##
　　关于`RSA`算法，笔者推荐大家去看下面两篇博文，在此万分感谢博主的无私奉献：

　　[RSA算法原理（一）](http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html) 
　　[RSA算法原理（二）](http://www.ruanyifeng.com/blog/2013/07/rsa_algorithm_part_two.html) 

　　为了防止这两篇博文丢失，笔者下面会简要的将它们的内容介绍一下。

<br>　　上面我们已经知道了对称加密的概念，接下来一起看看RSA算法：

	-  1977年，三位数学家Rivest、Shamir和Adleman设计了一种算法，可以实现非对称加密。
	-  这种算法用他们三个人的名字命名，叫做RSA算法。从那时直到现在，RSA算法一直是最广为使用的非对称加密算法。毫不夸张地说，只要有计算机网络的地方，就有RSA算法。
	-  这种算法非常可靠，密钥越长，它就越难破解。根据已经披露的文献，目前被破解的最长RSA密钥是768个二进制位。
	-  也就是说，长度超过768位的密钥，还无法破解（至少没人公开宣布）。
	-  因此可以认为，1024位的RSA密钥基本安全，2048位的密钥极其安全。

<br>　　要彻底理解RSA算法，则需要搞懂`质因数`、`欧拉函数`、`模反元素`等概念，这些在上面的博文里有介绍。

<br>　　下面通过一个例子来帮助大家理解RSA算法。

　　假设你要和情妇A进行加密通信，该怎么生成公钥和私钥呢？

	-  第一步，随机选择两个不相等的质数p和q。
	   -  你选择了61和53（实际应用中，这两个质数越大，就越难破解）。
	-  第二步，计算p和q的乘积n。
	   -  你就把61和53相乘，得到3233。3233写成二进制是110010100001，一共有12位，所以这个密钥就是12位。
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

<br>　　回顾上面的密钥生成步骤：

	-  上面一共出现六个数字：　p、q、n、φ(n)、e、d。
	-  这六个数字之中，公钥用到了两个（n和e），其余四个数字都是不公开的。
	-  其中最关键的是d，因为n和d组成了私钥，一旦d泄漏，就等于私钥泄漏。
	-  那么，有无可能在已知n和e的情况下，推导出d？
	-  结论：如果n可以被因数分解，d就可以算出，也就意味着私钥被破解。

<br>　　可是，大整数的因数分解，是一件非常困难的事情。目前，除了暴力破解，还没有发现别的有效方法。

　　举例来说，你可以对`3233`进行因数分解（`61×53`），但是你没法对下面这个整数进行因数分解：

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

<br>　　更多关于RSA加密解密的分析请去阅读上面两篇博文，总之我们使用`1024`位密钥进行RSA加密是不用担心被破解的。

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

<br>　　另外，开发时通常会用工具生成`2对`公钥和私钥，且客户端和服务端交换公钥，具体步骤可参看[ 这里 ](http://blog.csdn.net/BBLD_/article/details/38777491)。

<br>　　最后需要知道的是：

	-  到2016年为止，世界上还没有任何可靠的攻击RSA算法的方式。
	-  只要钥匙的长度足够长，用RSA加密的信息实际上是不能被解破的。
	-  由于进行的都是大数计算，使得RSA最快的情况也比DES慢上好几倍，无论是软件还是硬件实现。速度一直是RSA的缺陷。一般来说只用于少量数据加密。

<br>**本节参考阅读：**
- [百度百科 - RSA算法](http://baike.baidu.com/view/10613.htm)
- [维基百科 - 公钥加密算法](https://zh.wikipedia.org/zh-cn/%E5%85%AC%E5%BC%80%E5%AF%86%E9%92%A5%E5%8A%A0%E5%AF%86)
- [维基百科 - RSA加密算法](https://zh.wikipedia.org/zh-cn/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95)

# 第四节 消息摘要 #
　　事实上，除了上面介绍的加密方式外，还有一种名为`“消息摘要”`的加密方式。

<br>　　这种加密方式有如下特点：

	-  长度固定。
	   -  无论输入的数据有多长，计算出来的消息摘要的长度总是固定的。
	   -  比如，对一个1G文件进行消息摘要，和对一个4k的图片（或字符串等数据）进行消息摘要，得到的结果的长度是一样的。
	-  稳定性。对同一个数据进行消息摘要，得到的结果不会改变。
	-  易变性。一般情况下，只要两次输入的消息不同（哪怕只相差一个空格），那摘要产生的结果也必不相同，甚至差距非常大。
	-  单向性。只能进行正向的信息摘要，而无法从摘要中恢复出任何的消息，甚至根本就找不到任何与原信息相关的信息。

<br>　　上面介绍只是理论知识，放到实践中来的话，我们最常用的消息摘要算法是：`MD5`、`SHA`。

<br>　　**MD5**

　　`MD5`加密算法具有如下特点：

	-  第一，具备消息摘要的四大特性：长度固定、稳定性、易变性、单向性。
	-  第二，MD5算法生成的数据摘要有128个比特位（16字节），我们可以将它转换为16或32个十六进制的字符。

<br>　　`MD5`常用于部分网上赌场以保证赌博的公平性：

	-  在玩家下注骰宝前，赌场便先决定该局结果，假设生成的随机结果为4、5、 6大，赌场便会先利用MD5加密“4, 5, 6”此字符串并于玩家下注前告诉玩家。
	-  由于赌场是无法预计玩家会下什么注，所以便能确保赌场不能作弊。
	-  当玩家下注完毕后，赌场便告诉玩家该原始字符串，即“4, 5, 6”。
	-  玩家便可利用MD5工具加密该字符串是否与下注前的加密字符串吻合。

　　当然赌场也会防止玩家作弊：

	-  为了防止玩家使用计算机穷举所有可能（毕竟就3个骰子，每个骰子就6个值），所以赌场不会只拿“4, 5, 6”进行MD5操作。
	-  而是会在“4, 5, 6”基础上再加上一组随机字符串，以防止玩家利用碰撞解密字符串。
	-  随机字符串的长度与碰撞的次数成正比关系，一般网上赌场使用的随机字符串是长于20字。
	-  有些网上赌场的随机字符串更长达500字，以增加解密难度。

<br>　　`MD5`更常用于保存用户的密码：

	-  用户注册帐号时，客户端会将明文密码进行MD5加密，然后传给服务端保存。
	-  当用户登录帐号时，也会将明文密码进行MD5加密，然后交给服务端比较，如果相等就视为登录成功。
	-  这样一来，即便服务端的数据库被黑客拿走了，用户的密码也不会丢失。

　　但是这里存在一个问题：

	-  由于MD5具有稳定性（对同一个数据进行消息摘要，得到的结果不会改变），所以就有黑客搜集常见密码的MD5值。
	-  然后当黑客得到我们服务器的数据库时，就让数据库中的密码和他自己搜集的MD5库进行对比。
	-  从而能得出某些用户的密码，因此我们总是告诉用户，不要设置过于简单的密码，比如123456等。

　　退一步说，即便我们设置了复杂的密码，`MD5`加密还是存在风险：

	-  虽然前面介绍了信息摘要具有易变性（稍微改变原串中的一个空格都会导致最终的结果大变）。
	-  但MD5等算法还是存在被破解的可能：即两个不同的输入串会产生相同的MD5值，虽然这个几率非常小。
	-  因为不论多大的数据，MD5最终都只会生成16字节，存在bug也是可以想象到的。
	-  所以解决问题的方法就是，不断的增加算法生成的数据所占的字节数。

<br>　　**SHA**

　　`1996`年后`MD5`被证实可以被破解，对于需要高度安全性的数据，专家一般建议改用其他算法，如`SHA-256`。

<br>　　`SHA`家族：

	-  安全散列算法（英语：Secure Hash Algorithm，缩写为SHA）是一个密码散列函数家族，是FIPS所认证的五种安全散列算法。
	-  SHA家族的五个算法，分别是SHA-1、SHA-224、SHA-256、SHA-384，和SHA-512。
	-  但SHA-1的安全性如今被密码学家严重质疑；虽然至今尚未出现对SHA-2有效的攻击，它的算法跟SHA-1基本上仍然相似。
	-  SHA-256生成的数据占256位（32字节），可以转换成64个字符，这是MD5的两倍。

<center>
![ ](/img/android/android_BY_b02_02.jpg)
</center>

<br>　　因此：

	-  如果你的App只是普通的应用，那么使用MD5是完全没问题的，没有人会花精力搞你的，没有刁民想害你。
	-  如果你是金融类等的App的话，就用SHA-256吧。

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



# 第五节 数字签名和数字证书 #
　　**数字签名**

　　现在我们回到第三节说的故事上来，有一个问题被我们忽略了：

	-  我们使用情妇A的公钥对消息进行加密，并将密文发送给情妇A，她接到消息后用自己的密钥解密。
	-  这一切看起来没有任何问题。但是，我们知道公钥是公开的，说不定情妇A随便把自己的公钥发到什么单身狗论坛上了。
	-  如果隔壁屌丝小赵得到情妇A的公钥后，模仿你的语气跟情妇A发消息，试图套出你俩的奸情，实施敲诈。
	-  这可怎么办？ 
	-  因为任何人都可以模仿你去调戏情妇A，今天是屌丝小赵、明天是跨比小刘，后天是low逼小马？这还了得？

<br>　　为了解决这个问题，我们提出了`数字签名`的概念，于是整个通信的流程就变成了：

	-  第一，你使用信息摘要算法（比如MD5），对要传递的数据（text）进行信息摘要，生成digest。
	-  第二，你再用自己的私钥对digest进行加密，得到sDigest。
	-  第三，你将text和sDigest一起发送给情妇A。
	-  第四，情妇A接到消息后，用你的公钥对sDigest解密：
	   -  如果解密失败，则说明sDigest不是用你的私钥加密的。这意味着数据在传输的过程中被篡改，或者有人冒名顶替你，情妇A此时就会把这个消息丢弃。
	   -  如果解密成功，则可以得到digest。
	-  第五，情妇A再对text进行MD5操作，得到一个digest2，接着她用digest和digest2进行比较：
	   -  如果二者相等，则意味着数据在传输的过程中没被篡改。
	   -  否则，则表示被篡改或丢包了。

<br>　　需要注意的是，上面为了方便描述，`text`其实是一个明文，正式使用的时候完全可以先对它加密，在传递。

<br>　　通过上面的步骤我们可以知道，数字签名解决了如下两个问题：

	-  第一，证明消息是我发出的。
	   -  只要屌丝小赵等人得不到我的密钥，那么他们就没法伪造数字签名，因为情妇A会使用我的公钥解密数字签名。
	-  第二，证明消息是完整的。

<br>　　**数字证书**

　　事实上，即便我们使用了数字签名，数据传输时依然存在问题：

	-  当屌丝小赵发现他无法假装你时，就索性一不做二不休，去黑掉情妇A的电脑。
	-  也就是说，屌丝小赵把情妇A电脑中保存的你的公钥，替换成屌丝小赵的。
	-  这样一来，你发给情妇A的消息由于数字签名无法被屌丝小赵的公钥解密，而被情妇A丢弃。
	-  反而屌丝小赵发给情妇A的消息就能解密了。

<br>　　也就是说，现在的问题变成了`“情妇A没法知道自己手里的公钥到底是不是你的”`，因此我们又提出了`“数字证书”`的概念。

	-  数字证书一般由数字证书认证机构（Certificate Authority，简称CA）制作颁发，根据各种不同情况。
	-  解决上面问题的方法就是：
	   -  首先，你去找CA为你的公钥做认证。CA用自己的私钥，对你的公钥和一些相关信息一起加密，生成数字证书。
	   -  然后，你以后再给情妇A写信，需要发送三个东西：正文、数字签名、数字证书。
	   -  接着，当情妇A收到信后，她用CA的公钥解开数字证书，就可以拿到你真实的公钥了。
	   -  最后，这就能证明信中的数字签名是否真的是你签的。

<br>　　数字证书之所以能解决问题，是因为`CA`的公钥是无法被伪造的。


<br>**本节参考阅读：**
- [维基百科 - 数字签名](https://zh.wikipedia.org/zh-cn/%E6%95%B8%E4%BD%8D%E7%B0%BD%E7%AB%A0)
- [数字签名是什么？](http://www.ruanyifeng.com/blog/2011/08/what_is_a_digital_signature.html)

# 第六节 HTTPS #

　　暂时空缺，大家可以先看看如下几篇文章：

　　[Android 使用HTTPS与SSL](http://hukai.me/android-training-course-in-chinese/security/security-ssl.html)
　　[HTTPS的七个误解（译文）](http://www.ruanyifeng.com/blog/2011/02/seven_myths_about_https.html)

<br><br>
　　







