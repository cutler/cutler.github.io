title: 第七章 网络编程
date: 2015-3-9 10:38:36
categories: Android
---
　　本章来讲解一下Android开发中网络编程相关的知识。

# 第一节 Http协议 #

## 基础知识 ##
　　超文本传送协议 (`HTTP-Hypertext transfer protocol`) 是一个基于请求与响应模式的、无状态的、应用层的通信协议，它工作在`TCP/IP`协议体系中的`TCP`协议上。 

　　如图所示：

<center>
![](/img/android/android_7_1.png)
</center>

　　`http`协议是万维网（`world wide web`）交换信息的基础。它允许将超文本标记语言(`HTML`)网页从服务器传送到`Web`浏览器(如`IE`等)。
　　`HTML`是一种用于创建网页文档的标记语言，使用HTML语言可以编写出`.html`类型的静态网页文件。您可以单击`.html`网页文件内的一个链接来访问其它文档、图像或多媒体对象，并获得关于链接项的附加信息。

<br>**特点**
　　`http`协议是无状态的。

	无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。 如：用户登录，若第一次登录密码输入错误，则在第二次登录时，同样需要再次提供账号和密码，而不是只提供密码。

　　基于请求/应答模式的。

	服务器端总是等待客户端发来的请求，服务器端响应完客户端的请求后，就断开二者之间的连接。服务器端不会主动的向客户端发送请求。

<br>**作用**
　　`http`能做什么?
　　浏览网页是`http`的主要应用，但是这并不代表`http`就只能应用于网页的浏览。 `http`是一种协议，只要通信的双方都遵守这个协议，`http`就能有用武之地。

<br>**工作方式**
　　`HTTP`协议是基于请求与响应模式的。
　　客户端发送一个请求(`request`)给服务器，服务器在接收到这个请求后执行相应的操作，并在操作完成后生成一个响应(`response`)返回给客户端。

　　用户在浏览器地址栏中输入一个网址(`URL`)，就是在向服务器端发送一个请求，请求查看网页的内容。 

<br>**URI和URL**
　　URL是URI的子集。

	-  URI 可以描述任意一个(本地系统、互联网等地方的)资源的路径。
	-  URL 是一种特殊类型的URI，包含了用于查找某个资源的足够的信息，主要用来描述互联网上的一个资源的路径。

　　比如：`“http://www.baidu.com/test/a.txt”`是一个URL，它也是一个URI 。

<br>　　URL 的一般形式是：`<URL的访问方式>://<主机>:[端口][路径]`，比如：`http://www.baidu.com/test/a.txt`。其中：

	-  “http://”表示要通过HTTP协议来定位网络资源。常见的访问方式有：http、ftp、news等。
	-  “www.baidu.com”表示资源所在的地址，它是一个合法的Internet主机域名或者IP地址。
	-  若省写了端口则默认访问80端口。此处就是省写了端口号。
	-  “/test/a.txt”表示资源在服务器端的存放路径。若URL中没有给出[路径]，那么当这个URL作为请求时，必须以“/”的形式给出，通常这个工作浏览器自动帮我们完成。如输入www.baidu.com，浏览器自动转换成：http://www.baidu.com/。

<br>　　关于请求和响应的具体细节，后面会详细描述。

<br>**协议版本号**
　　超文本传输协议已经演化出了很多版本，它们中的大部分都是向下兼容的。
　　目前有`0.9`(已过时)、`HTTP/1.0`、`HTTP/1.1`。
　　`HTTP/0.9`只接受`GET`一种请求方法，没有在通讯中指定版本号，且不支持请求头。由于该版本不支持`POST`方法，所以客户端无法向服务器传递太多信息。

　　`HTTP/1.0`这是第一个在通讯中指定版本号的HTTP协议版本，至今仍被广泛采用，特别是在代理服务器中。

　　`HTTP/1.1`是当前版本。持久连接被默认采用，并能很好地配合代理服务器工作。还支持以管道方式在同时发送多个请求，以便降低线路负载，提高传输速度。

<br>**HTTP/1.0与HTTP/1.1**
　　网站每天可能要接收到上百万的请求，为了提高系统效率，`HTTP1.0`规定浏览器与服务器只保持短暂的连接，浏览器的每次请求都需要与服务器建立一个`TCP`连接，服务器完成请求处理后立即断开`TCP`连接，服务器不跟踪每个客户也不记录过去的请求。但是，这也造成了一些性能上的缺陷。

　　首先浏览器去请求服务器端的一个网页文件，这个网页文件中又引用了多张图片。
　　当浏览器访问这个网页文件时，发现其中的`<img>`图像标签后，浏览器会再次向服务器发出下载图像数据的请求。
　　显然，访问一个包含有许多图像的网页文件的整个过程包含了多次请求和响应，`每次请求和响应都需要建立一个单独的连接`，每次连接只是传输一个文档和图像，上一次和下一次请求完全分离。
　　客户端和服务器端每次建立和关闭连接却是一个相对比较费时的过程，并且会严重影响客户机和服务器的性能。当一个网页文件中包含 `Applet`，`JavaScript`文件，`CSS`文件等内容时，也会出现类似上述的情况。

　　为了克服`HTTP 1.0`的这个缺陷，`HTTP 1.1`支持持久连接。
　　在一个`TCP`连接上可以传送多个`HTTP`请求和响应，减少了建立和关闭连接的消耗和延迟。一个包含有许多图像的网页文件的多个请求和应答可以在一个`TCP`连接中传输，但每个单独的网页文件的请求和应答仍然需要使用各自的连接。

<br>　　扩展：

	HTTP 1.1在继承了HTTP 1.0优点的基础上，也克服了HTTP 1.0的性能问题。
	HTTP 1.1 还通过增加更多的请求头和响应头来改进和扩充HTTP 1.0 的功能。例如，由于HTTP 1.0不支持Host请求头字段，WEB浏览器无法使用主机头名来明确表示要访问服务器上的哪个WEB站点，这样就无法使用WEB服务器在同一个IP地址和端口号上配置多个虚拟WEB站点。在HTTP 1.1中增加Host请求头字段后，WEB浏览器可以使用主机头名来明确表示要访问服务器上的哪个WEB站点，这才实现了在一台WEB服务器上可以在同一个IP地址和端口号上使用不同的主机名来创建多个虚拟WEB站点。HTTP 1.1 的持续连接，也需要增加新的请求头来帮助实现，例如，Connection 请求头的值为Keep-Alive 时，客户端通知服务器返回本次请求结果后保持连接；Connection 请求头的值为close 时，客户端通知服务器返回本次请求结果后关闭连接。 HTTP 1.1还提供了与身份认证、状态管理和Cache缓存等机制相关的请求头和响应头。

<br>**本节参考阅读：**
- [HTTP协议详解（真的很经典）](http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html) 
- [HTTP_互动百科](http://www.baike.com/wiki/HTTP)
- [超文本传输协议_维基百科](http://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE#.E5.8D.8F.E8.AE.AE.E7.89.88.E6.9C.AC.E5.8F.B7)  

## HTTP请求 ##
　　客户端连上服务器后，并请求访问服务器内的某个`web`资源，称之为客户端向服务器发送了一个HTTP请求(`request`)。一个完整的HTTP请求包括如下内容：

	-  一个请求行。
	-  若干请求报头。
	-  一个空白行(起到间隔作用)。
	-  请求正文(以post方式发送的请求才有此项)。

<br>**请求行**
　　请求行由三部分组成：`请求的方式`，`请求的资源名称`，`请求使用的协议以及版本`。
　　HTTP请求的方式有：`POST`、`GET`、`HEAD`、`OPTIONS`、`DELETE`、`TRACE`、`PUT`、`CONNECT`。其中`GET`和`POST`最常用。

<br>　　范例1：请求行。
``` 
GET / books/java.html  HTTP/1.1
```
　　以GET方式发送请求和POST方式发送请求的区别：向服务器传送的参数的方式不同。

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
    -  请求头Accept-Charset：告知服务器，浏览器可接受的字符集。
    -  请求头Accept-Encoding：告知服务器，客户端浏览器可接受的数据压缩编码。
    -  请求头Accept-Language：告知服务器，客户端浏览器当前语言环境(用于国际化程序设计)。
    -  请求头Host：告知服务器，客户端浏览器要访问的主机。必须要提供此请求头。
    -  请求头Referer：告知服务器，当前请求是由客户端浏览器的哪个页面发出的。
    -  请求头User-Agent：告知服务器，客户端操作系统、浏览器的类型、版本号等信息，此属性由浏览器来设置。
    -  请求头Cookie：告知服务器，客户端浏览器中的Cookie 。
    -  请求头Connection：取值有两个“Keep-Alive和close” 。
    -  请求头Date：告知服务器，客户端浏览器发送请求的时间。
    -  请求头Authorization 用于证明客户端有权查看某个资源。当浏览器访问一个页面时，如果收到服务器的响应代码为 401 （未授权），可以发送一个包含 Authorization 请求报头域的请求，要求服务器对其进行验证。
    -  请求头Content-Length：告知服务器，请求中的请求正文的长度。

## HTTP响应 ##
　　服务器接收到客户端的请求后，会将用户请求的数据，以一个回应(`response`)的方式返回给客户端。一个完整的HTTP回应包括如下内容：

	-  一个响应行。
	-  若干响应报头。
	-  一个空白行(起到间隔作用)。
	-  响应正文。

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
    -  响应头Location：告知客户端浏览器，需要将浏览器窗口 重定位 到其指向的页面中。只有响应码为302时,浏览器窗口才会重定位当前浏览器窗口 。
    -  响应头Content-Encoding：告知客户端浏览器，数据(回应正文)的压缩格式。
    -  响应头Content-Type：告知浏览器，服务器返回给浏览器的数据，是什么格式的。即MIME类型。
    -  响应头Refresh：告知浏览器，定时刷新页面。
    -  响应头Expires、Cache-Control、Pragma：都是用来告知浏览器不要缓存资源数据。由于浏览器的种类繁多，所以有3种头信息。

# 第二节 HttpURLConnection #
<br>　　范例1：发送GET请求。
``` android
public boolean sendGet() throws Exception{
    boolean mark = false;
    // 根据一个String来构造一个URL对象。
    // URLEncoder.encode()方法用来将给定字符串s按照指定编码enc的方式进行编码。
    URL url = new URL("http://192.168.1.108/Picture/PersonServlet?name="+URLEncoder.encode("张三","GBK"));
    // 返回一个 URLConnection 对象，它表示URL 所引用的远程对象的连接。通过这个连接，可以获取远程对象的IO流。
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    // 设置超时的时间。当程序请求访问当前URLConnection指向的资源时，若服务器端在timeout毫秒内没有响应程序的请求
    // 则程序会抛java.net.SocketTimeoutException异常。
    // 设置为0则意味着无限等待，即没有超时时限。默认值也为0 。
    // 设置为负数，则此方法将抛IllegalArgumentException异常。
    conn.setConnectTimeout(5000);
    // 设置当前HttpURLConnection对象向服务器端发送请求时，所使用的请求方式。默认为GET。注意：请求的方式要使用大写字母 。
    conn.setRequestMethod("GET");
    if( conn.getResponseCode() == 200){
        mark = true;
    }
    return mark;
}
```
    语句解释：
    -  使用GET方式提交数据时，若需要传递中文，则可以使用URLEcoder类对汉字进行编码。

<br>　　范例2：Post请求。
``` android
public void sendPost()throws Exception{
    StringBuilder sb = new StringBuilder();
    sb.append("name=").append("张三").append("&");
    sb.append("age=").append("30"); 
	
    URL url = new URL("http://192.168.0.101/Picture/2.jsp");
    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    conn.setConnectTimeout(5000);
    conn.setRequestMethod("POST");// 设置请求方式为post。
	
    // 设置数据。
    byte[] array = sb.toString().getBytes();
    conn.setRequestProperty("content-type", "application/x-www-form-urlencoded");
    conn.setRequestProperty("content-length", array.length+"");
    // 设置允许程序通过conn向服务器写数据。默认是不允许的。
    conn.setDoOutput(true);
    // 将数据写入内存。
    OutputStream out = conn.getOutputStream();
    out.write(array);
    // 发送数据，并获得服务器端的响应。
    if(conn.getResponseCode() == 200){
        // Do something
    }
    out.close();
}
```
    语句解释：
    -  默认情况下，当调用服务器端输出流的write方法写数据时，数据将被写入内存(HttpURLConnection对象)中，而不会发送到服务器端。 只有调用了HttpURLConnection类的getResponseCode、getResponseMessage等方法请求获取服务器端的响应时，数据才会被发送到服务器端。

　　使用`post`方式向服务器发送数据时，不同的数据，所设置的`content-type`头字段不相同：
```
发送的数据                    Content-type
请求参数                      application/x-www-form-urlencoded
xml文件                       text/xml;charset=UTF-8
请求参数+文件上传              multpart/form-data
```
　　使用第三种方式时，还需要为每一个实体指定一个`Content-Disposition`头字段。

	-  实体：请求参数和待上传文件都被称为实体。
	   -  请求参数的Content-Disposition头字段：form-data;name=”请求参数的名称”。
	   -  待上传文件的Content-Disposition头字段：
	      -  form-data;name=”请求参数的名称”;filename=”待上传文件的名称”。
	      -  对于上传文件，还应该再为其指定一个Content-Type属性，标识文件的类型。

<br>　　范例3：获取网页文件。
``` android
public String getHTML()throws Exception{
    String html = null;
    URL url = new URL("http://192.168.1.108/Web/index.jsp");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setConnectTimeout(5000);
    if(conn.getResponseCode() == 200){
        // 截取出content-type头字段中指定的charset属性。
        String content_type = conn.getContentType();
        content_type = content_type.substring(content_type.indexOf("charset=")+8);
        // 获取InputStream,然后读取文件的内容。具体代码和上面相同,此处省略。
        // ... ...  
        // 根据charset指定的编码,将array(byte类型的数组)转成字符串。
        html = new String(array,content_type);
    }
    return html;
}
```
    语句解释：
    -  对于JSP文件来说，它的content-type的值一般为：text/html;charset=UTF-8
    -  对于HTML文件来说，它的content-type的值一般为：text/html 。即HTML文件的content-type属性中不会包含charset属性，所以对于HTML文件来说，本范例的解码操作并不合适。

<br>**网络图片查看器**

<br>　　范例1：实现步骤。 

	-  首先，在网上找到一张图片，将图片的地址封装成一个URL对象。
	-  然后，通过图片的URL，打开一个URLConnection连接，并将URLConnection转换成HttpURLConnection对象，然后设置超时时间、请求方式(默认为GET方式)。
	-  接着，只有在状态码为200的时候，才处理请求。
	-  然后，获取数据的输入流，将数据写入到内存流中。
	-  使用BitmapFactory根据一个字节数组来构造一个Bitmap对象，Bitmap对象代表一张位图图片。
	-  将图片显示在<ImageView>组件中。

<br>　　范例2：下载图片。
``` android
public byte[] getBytes()throws Exception{
    URL url = new URL("http://192.168.0.108/Picture/1.jpg");
    HttpURLConnection conn = (HttpURLConnection)url.openConnection();
    conn.setConnectTimeout(5000);
    conn.setRequestMethod("GET");
    // 若服务器端返回的响应码等于200，则证明服务器已经处理完请求，并将请求数据返回。
    if(conn.getResponseCode() == 200){
        InputStream input = conn.getInputStream();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int len;
        byte[] array = new byte[1024];
        while((len = input.read(array)) != -1){
            out.write(array,0,len);
        }
        array = out.toByteArray();
        out.close();
        input.close();
        return array;
    }
    return null;
}

public void onClick(View view){
    try {
        this.imgView = (ImageView) this.findViewById(R.id.showImg);
        byte[] array = this.getBytes();
        Bitmap bit = BitmapFactory.decodeByteArray(array,0,array.length);
        this.imgView.setImageBitmap(bit);
    } catch (Exception e) { 
        e.printStackTrace();
    }
}
```
　　提示Android程序访问网络需要在清单文件中声明一个权限：
``` android
<uses-permission android:name="android.permission.INTERNET"/>
```

<br>　　扩展：多线程断点下载。

	-  向服务器发送请求时，需要设定如下头字段：
	   -  conn.setRequestProperty("range", "bytes="+start+"-"+end);
	   -  其中start和end就是需要请求下载数据的范围。


# 第三节 HttpClient #

## 简介 ##
　　`HTTP`协议是`Internet`上使用得最多、最重要的一个协议，越来越多的Java应用程序需要直接通过HTTP协议来访问网络资源。
　　在`JDK`的`java.net`包中已经提供了直接通过HTTP协议来访问网络资源所需要使用的API(如`HttpURLConnection`等)，但是对于大部分应用程序来说，JDK库本身提供的功能还不够丰富和灵活，对于稍微复杂一点的业务来说，使用JDK提供的API去实现是十分困难的，比如文件上传。

<br>**是什么?**
　　`HttpClient`是`Apache Jakarta Common`下的子项目，用来提供高效的、最新的、功能丰富的支持HTTP协议的客户端编程工具包，简单地说它就是用来接收和发送HTTP消息的。并且它支持HTTP协议最新的版本和建议。HttpClient已经应用在很多的项目中，比如`Apache Jakarta`上很著名的另外两个开源项目`Cactus`和`HTMLUnit`都使用了`HttpClient`。

　　`HttpClient`的下载地址：http://hc.apache.org/downloads.cgi (本文档基于`4.1.2`版本)。不过，在Android SDK中已经提供了`HttpClient`中所有的类，因此开发Android应用程序时不需要另外下载`HttpClient`了。

<br>**不是什么?**
　　HttpClient不是一个浏览器，它是一个客户端的HTTP通信实现库，主要用来`发送和接收HTTP报文`。它不会去缓存内容、执行嵌入在HTML页面中的`javascript`代码、猜测内容类型，或者其它和HTTP运输无关的功能。

　　在HttpClient中最核心的一个接口就是`HttpClient`接口，使用它的实例向服务器端发送请求，就`“相当于”`使用一个浏览器向服务器发送请求。

<br>　　范例1：`HttpClient`接口。
``` android
// 使用当前HttpClient对象，发送一个HTTP请求，并将返回值封装成一个HttpResponse对象。
public abstract HttpResponse execute(HttpUriRequest request)
```

　　基于HTTP协议发送请求有多种不同的请求方式(如`Get`、`Post`等)，这些请求方式在HttpClient框架中也被封装成了具体的类。如：`HttpGet`类、`HttpPost`等类。这些类拥有一个共同的父接口`HttpUriRequest`接口。

<br>　　范例2：`HttpUriRequest`接口。
``` android
// 返回当前HttpUriRequest对象所代表的请求方法。如：GET，PUT，POST等。
public abstract String getMethod()
```

<br>　　服务器端接收到客户端的请求后，会执行相应的操作，并将操作的结果以及客户端所需要的数据返回给客户端。HttpClient会将服务器返回的数据封装成一个`HttpResonse`对象，客户端通过该对象提供的方法查看响应的内容。

<br>　　范例3：`HttpResponse`接口。
``` android
// 返回服务器端返回的响应的正文数据。若没有响应则返回null。
public abstract HttpEntity getEntity()

// 返回服务器端返回的响应的响应行。
public abstract StatusLine getStatusLine()
```

## 请求 ##

　　`DefaultHttpClient`类是HttpClient接口的具体实现类，我们用它来与服务器进行交互。

<br>
### Get请求 ###
<br>　　范例1：发送Get请求。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        // 指定当前请求对象所要请求的位置，构造一个HttpGet对象。
        // uri的格式为：协议名、主机名、端口、资源的路径、请求参数。其中前两者是必须要提供的。协议名和主机名之间需要使用“://”间隔。
        HttpGet httpget = new HttpGet("http://www.baidu.com");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭HttpClient的连接管理器，并释放已经分配的资源。
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  默认情况下，若服务器端一直无响应，则HttpClient是会永远等待下去。

<br>　　范例2：拼接URI。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        // 依据指定参数创建一个URI对象。参数依次为：scheme 协议名、host主机名、port端口、path请求路径、query请求参数。
        URI uri = URIUtils.createURI("http","localhost",-1,"/Server", "name=cxy",null);
        HttpGet httpget = new HttpGet(uri);
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  使用HttpClient提供的URIUtils类可以动态的组装出一个URI。
       -  若端口号≤0 ，则默认访问服务器的80端口。
       -  在第一个请求参数前面一定不要加“?”号，请求参数之间使用“&”间隔。
    -  使用HttpRequestBase类定义的getURI()方法可以获取当前请求路径。HttpPost和HttpGet都是HttpRequestBase的子类。

<br>　　范例3：传递中文。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        URI uri = URIUtils.createURI("http", "localhost", -1, "/Server", "name=张三", null);
        HttpGet httpget = new HttpGet(uri);
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  URIUtils类会使用UTF-8编码来创建出一个URI对象。请求参数的值可以包含中文，在服务器端使用UTF-8进行解码即可。但是请求参数中不可以包含空格。

<br>　　范例4：中文包含空格。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        String name = URLEncoder.encode("1. 张  三 ", "UTF-8");
        HttpGet httpget = new HttpGet("http://localhost/Server?name="+name);
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  值得注意的是，使用uft-8编码时，空格会被转换为“+”号。

　　若想在请求参数的值中包含空格等字符，也可以使用如下几个类：

	-  NameValuePair：代表一个名值对。客户端发送请求时，每个请求参数都被看作成一个名值对(key=value)，使用一个NameValuePair实例来表示。
	-  URLEncodedUtils：将一个List< NameValuePair >集合中的数据按照指定的编码转换成字符串的形式。

<br>　　范例5：发送Get请求。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
        params.add(new BasicNameValuePair("name","张   三"));
        params.add(new BasicNameValuePair("age","29"));
        HttpGet httpget = new HttpGet("http://localhost/Server?"+URLEncodedUtils.format(params, "utf-8"));
        HttpClient client = new DefaultHttpClient();
        client.execute(httpget);
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  此时可以在请求参数的值中包含空格字符。

<br>　　范例6：设置请求头。
``` android
HttpGet get = new HttpGet(URI.create("http://192.168.0.110/Service/index.jsp"));
get.addHeader("Content-Length", "1011");
get.addHeader("cxy","tsx");
client1.execute(get);
```
    语句解释：
    -  在服务器端就可以获取此时设置的请求头。

<br>
### Post请求 ###
　　使用Post方式发送请求时，请求的参数是放在请求正文中的。在HttpClient中提供了多种类型的实体，用来封装请求参数。

<br>　　范例1：发送表单实体。
``` android
public void test() {
    HttpClient client = new DefaultHttpClient();
    HttpPost httppost = new HttpPost("http://localhost/Server/index.jsp");
    // 创建请求参数。
    List<NameValuePair> params = new ArrayList<NameValuePair>();
    params.add(new BasicNameValuePair("name", "张 三 啊"));
    params.add(new BasicNameValuePair("age", "422"));
    // 创建表单实体
    UrlEncodedFormEntity form = new UrlEncodedFormEntity(params,"utf-8");
    httppost.setEntity(form);
    // 发送请求。
    HttpResponse response = client.execute(httppost);
    client.getConnectionManager().shutdown();
}
```
    语句解释：
    -  若需要使用post方式发送一些字符串类型的请求参数，可以使用此种方式。

　　在发送Post请求时，若请求正文中需要包含多媒体类型的数据，则可以使用`MultipartEntity`类。

<br>　　范例2：字符串参数。
``` android
public viod text() {
    HttpClient client = new DefaultHttpClient();
    HttpPost httppost = new HttpPost("http://localhost/Server/index.jsp");
    // 创建表单实体
    MultipartEntity entity = new MultipartEntity();
    StringBody body = new StringBody("cxy");
    entity.addPart("name",body);
    httppost.setEntity(entity);
    // 发送请求。
    HttpResponse response = client.execute(httppost);
    client.getConnectionManager().shutdown();
}
```
    语句解释：
    -  MultipartEntity类代表一个多媒体表单，它会在请求中加上一个相当于HTML中的form的enctype="multipart/form-data"属性，在服务器端获取请求中的参数时，要注意一下。

　　`ContentBody`常用的子类还有：`FileBody`、`ByteArrayBody`、`InputStreamBody`。有时候这些子类提供的功能扔不够用，此时会自定义。

## 响应 ##
　　在HttpClient中使用`HttpResponse`类表示服务器对客户端的响应。

<br>　　范例1：获取响应中的数据。
``` android
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    System.out.println(response.getStatusLine().getStatusCode());// 响应码
    System.out.println(response.getStatusLine().getReasonPhrase());// 响应信息
    System.out.println(response.getStatusLine().getProtocolVersion());//协议版本号
}
```
    语句解释：
    -  程序输出：200 OK HTTP/1.1。

<br>　　范例2：响应头字段。
``` android
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    Header[] heads = response.getAllHeaders();
    for(Header head:heads){
        System.out.println(head.getName()+" = "+head.getValue());
    }
}
```

　　在HttpClient中还提供了另一种遍历头字段的方法，可以使用`HeaderIterator`接口来完成遍历。

<br>　　范例3：迭代器遍历。
``` android
public void test() {
    HttpGet get = new HttpGet(URI.create("http://www.google.com.tw"));
    HttpResponse response = client1.execute(get);
    HeaderIterator iterator = response.headerIterator();
    while(iterator.hasNext()){
        Header item = iterator.nextHeader();
        System.out.println(item.getName()+" = "+item.getValue());
    }
}
```
    语句解释：
    -  方法headerIterator是从其父接口HttpMessage中继承而来。
    -  在HttpResponse对象中可能返回多个具有相同name的头信息。此时可以使用HttpResponse类提供的getFirstHeader(name)和getLastHeader(name)来分别获取第一个和最后一个头信息。

<br>　　范例4：获取响应正文。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpGet get = new HttpGet(URI.create("http://www.baidu.com"));
        HttpResponse response = client.execute(get);
        HttpEntity entity = response.getEntity();
		
        System.out.println(entity.getContentEncoding());
        System.out.println(entity.getContentType());
        System.out.println(entity.getContentLength());
        System.out.println(EntityUtils.toString(entity,"UTF-8"));
        entity.consumeContent();
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  使用EntityUtils类中的toString()方法，可以将HttpEntity中的数据转换成指定编码格式的文本。
    -  当响应实体使用完毕后，应该立刻将其与服务器端的连接断开。使用HttpEntity类的consumeContent方法回收实体所占有的资源。
    -  注意：若HttpEntity中的数据量很多，则不要使用EntityUtils类。

## 其它 ##

<br>　　范例1：设置超时时间。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpParams params = client.getParams();
        // 设置连接超时时间。
        params.setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT,1000);
        // 设置连接成功后，读取数据超时时间。
        params.setIntParameter(CoreConnectionPNames.SO_TIMEOUT, 1000);
        HttpGet httpget = new HttpGet("http://www.apache.org");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭连接。
        client.getConnectionManager().shutdown();
    }
}
```
<br>　　在老版本的HttpClient中可以使用下面的代码设置超时，但新版本中已经不推荐使用了：
```
ConnManagerParams.setTimeout(client.getParams(),1000);
```

<br>　　范例2：设置缓冲区大小。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        HttpParams params = client.getParams();
        params.setIntParameter(CoreConnectionPNames.SOCKET_BUFFER_SIZE,1);
        HttpGet httpget = new HttpGet("http://www.apache.org");
        // 向服务器发送get请求。
        HttpResponse response = client.execute(httpget);
        System.out.println(response);
        // 关闭连接。
        client.getConnectionManager().shutdown();
    }
}
```
    语句解释：
    -  默认情况下，HttpClient的缓冲区是8k ，当数据存满时，HttpClient会自动将数据发送出去。

　　默认情况下，HttpClient 会试图自动从 I/O 异常中恢复。默认的自动恢复机制是受很少部分已知的异常是安全的这个限制。
 
	-  HttpClient 不会从任意逻辑或 HTTP 协议错误（那些是从 HttpException 类中派生出的）中恢复的。 
	-  HttpClient 将会自动重新执行那些假设是幂等的方法。 
	-  HttpClient 将会自动重新执行那些由于运输异常失败，而 HTTP 请求仍然被传送到目标服务器（也就是请求没有完全被送到服务器）失败的方法。
	-  HttpClient 将会自动重新执行那些已经完全被送到服务器，但是服务器使用 HTTP 状态码（服务器仅仅丢掉连接而不会发回任何东西）响应时失败的方法。在这种情况下，假设请求没有被服务器处理，而应用程序的状态也没有改变。如果这个假设可能对于你应用程序的目标 Web 服务器来说不正确，那么就强烈建议提供一个自定义的异常处理器。

<br>　　范例3：请求重试。
``` android
private void setRetryTimes(DefaultHttpClient httpclient) {
    HttpRequestRetryHandler myRetryHandler = new HttpRequestRetryHandler() {
        public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
            if (executionCount >= 5) {
                return false;
            }
            if (exception instanceof NoHttpResponseException) {
                return true;
            }
            if (exception instanceof SSLHandshakeException) {
                return false;
            }
            HttpRequest request = (HttpRequest) context.getAttribute(ExecutionContext.HTTP_REQUEST);
            boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);
            if (idempotent) {
                return true;
            }
            return false;
        }
    };
    httpclient.setHttpRequestRetryHandler(myRetryHandler);
}
```
    语句解释：
    -  若是没有设置请求重试处理器，且发生了上述之一的情形，则HttpClient会不断的自动重新请求。因此强烈建议提供一个自定义的异常处理器。

# 第四节 WebService #
　　`WebService`相当于一个部署在服务器上的公共接口，它接收用户的请求，并返回相应的数据。它主要为用户提供一些方便、实用的服务。 如：电话归属地查询、QQ在线状态查询等。
　　常用的Webservice站点有：[WebXml](http://www.webxml.com.cn/zh_cn/index.aspx) 。 

　　问题：如何调用Webservice呢?

	-  Webservice是基于HTTP协议和XML文件的，由于他们二者是跨平台的，因此在任何程序设计语言中都可以使用Webservice技术。
	-  在客户端程序中只需要向Webservice所在的服务器发送一个http请求即可实现Webservice的调用。
	   -  调用Webservice有两种方式：通过HTTP协议和通过SOAP协议。
	   -  调用Webservice后，Webservice会将结果以XML文件的形式返回给用户。 

## HTTP协议 ##
　　下面将以`“电话号码归属地查询”`为例，讲述如何通过HTTP方式调用Webservice。

<br>　　范例1：准备工作。

	-  首先，打开http://www.webxml.com.cn/zh_cn/index.aspx页面。
	-  然后，找到“国内手机号码归属地查询WEB服务”。
	-  最后，点击“getMobileCodeInfo”，通过此接口可以获取国内手机号码归属地省份、地区和手机卡类型信息。

　　通过查阅网页得知，使用`POST`方式发送请求时，需要按照如下代码列出的数据，向服务器发送数据。

<br>　　范例2：阅读发送规范。
```
POST /WebServices/MobileCodeWS.asmx/getMobileCodeInfo HTTP/1.1
Host: webservice.webxml.com.cn
Content-Type: application/x-www-form-urlencoded
Content-Length: length

mobileCode=string&userID=string
```
    语句解释：
	-  接收用户请求的地址为：/WebServices/MobileCodeWS.asmx/getMobileCodeInfo 。
	-  头字段Content-Type：指出客户所发送的数据的MIME类型 ，属性值固定。
	-  头字段Content-Length：指出客户所发送的数据长度，属性值由客户设置。  
	-  消息正文中的mobileCode属性：指出要查询的手机号 。
	-  消息正文中的userID属性：指出客户在webservice.webxml.com.cn网站上注册的ID 。
	   -  若为userID属性指定了值，则查询出来的数据会很详细，但是需要收费。否则仅会查询出基本的数据。通常不会为userID属性赋值。

　　通过阅读上述规范得知`“国内手机号码归属地查询WEB服务”`，客户端应该将请求发送到：
```
	http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo
```

<br>　　范例3：POST请求。
``` android
public static void sendXMLPOST()throws Exception{
    URL url = new URL("http://webservice.webxml.com.cn" + "/WebServices/MobileCodeWS.asmx/getMobileCodeInfo");	
    String xml = "mobileCode=13412345678&userID="; 
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
    conn.setRequestProperty("Content-Length", String.valueOf(xml.getBytes().length));
    conn.setDoOutput(true);
    // 获取连接的输出流。
    OutputStream out = conn.getOutputStream();
    out.write(xml.getBytes("UTF-8"));
    // 向服务器端发送请求。
    if(conn.getResponseCode() == 200){
        // 调用自定义的readSendXML方法将服务器端返回的xml文件中包含的信息解析出来。
        InputStream input = conn.getInputStream();
        System.out.println(this.readSendXML(input));
        input.close();
    }
    out.close();
    conn.disconnect();
}
```
    语句解释：
	-  若没有userID，则可以不为其指定值，但是在请求的时候必须要写上它。

<br>　　范例4：GET请求。
``` android
public static void sendXMLGET()throws Exception{
    URL url = new URL("http://webservice.webxml.com.cn" +"/WebServices/MobileCodeWS.asmx/getMobileCodeInfo?mobileCode=13412345678&userID="); 
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    if(conn.getResponseCode() == 200){
        InputStream input = conn.getInputStream();
        System.out.println(readSendXML(input));
        input.close();
    }
    conn.disconnect();
}
```
    语句解释：
	-  服务器端返回的数据是一个XML文件，使用dom、sax、pull等方式可以对其进行解析。

## SOAP协议 ##
　　在传统的方式中，客户端与服务器端的应用程序进行数据交换时，网络上传输的数据的格式必须遵守`http协议`的规定。格式为：`属性名1=属性值1&属性名2=属性值2`。
　　而在Webservice技术中，客户端与服务器端的Webservice进行数据交换时，数据的格式则由`SOAP协议`来规定。 

　　`SOAP(Simple Object Access Protocol)`，是一种通信协议(http是一种传输协议)，规定了通信双方所发送的数据的格式。
　　在一次规范的客户端与服务器端的Webservice交互过程中，客户端发送请求时所需要传递给Webservice的数据都需要封装成`SOAP消息`后再传递过去，从服务器端获取到的返回结果也同样是`SOAP消息`。 

<br>　　问题：SOAP消息是如何发送到服务器端的呢?

	-  SOAP协议可以和现存的许多因特网协议和格式结合使用，包括http(超文本传输协议)，smtp(简单邮件传输协议)。
	-  SOAP协议通常是通过http协议来发送到服务器端的。

<br>　　问题：怎么构建一个SOAP消息?

	-  使用xml文件来构建SOAP消息。

<br>
### XML调用 ###
　　使用SOAP协议发送请求时，需要按照如下代码列出的数据，向服务器发送数据。

<br>　　范例1：阅读发送规范。
``` xml
POST /WebServices/MobileCodeWS.asmx HTTP/1.1
Host: webservice.webxml.com.cn
Content-Type: application/soap+xml; charset=utf-8
Content-Length: length

<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <getMobileCodeInfo xmlns="http://WebXml.com.cn/">
      <mobileCode>string</mobileCode>
      <userID>string</userID>
    </getMobileCodeInfo>
  </soap12:Body>
</soap12:Envelope>
```
    语句解释：
	-  SOAP协议有两个版本：SOAP1.1和SOAP1.2 。本范例是SOAP1.2的规范。
	-  本范例中的xml文件就是一个SOAP消息，SOAP消息的语法规则：
	   -  SOAP 消息的根节点必须是Envelope 。
	   -  SOAP 消息中必须要存在一个节点Body 。Body节点内列出要当前消息要访问服务器端的webservice中的哪个方法以及传递给该方法的参数。 
	-  本范例中，将调用服务器端webservice的getMobileCodeInfo方法，该方法接收两个参数mobileCode和userID 。

<br>　　范例2：创建SOAP消息。
``` xml
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <getMobileCodeInfo xmlns="http://WebXml.com.cn/">
      <mobileCode>13412345678</mobileCode>
      <userID></userID>
    </getMobileCodeInfo>
  </soap12:Body>
</soap12:Envelope>
```
    语句解释：
	-  若不需要为<userID>传递值，则可以不写。但是标签<userID>必须要写上。

<br>　　范例3：发送消息。
``` android
public static void sendXML(String xml)throws Exception {
    // 核心代码如下。
    URL url = new URL("http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setConnectTimeout(4000);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/soap+xml; charset=utf-8");
    conn.setRequestProperty("Content-Length",xml.getBytes().length+"");
    conn.setDoOutput(true);

    OutputStream out = conn.getOutputStream();
    out.write(xml.getBytes("UTF-8"));
    // 其它代码省写 ... 
}
```
    语句解释：
	-  注意：“国内手机号码归属地查询WEB服务”中soap协议与http协议数据提交的目的地是不一样的。

<br>
### WSDL调用 ###
　　通过SOAP协议发送SOAP消息的方式访问Webservice时，通信双方都需要对SOAP消息进行解析。
　　因此通常也会使用`WSDL方式`来发送SOAP消息，这样客户端开发人员就不需要编写解析SOAP消息的代码了。因为有些Webservice返回的SOAP消息包含的数据很多，解析起来很麻烦。

　　`WSDL(Web Service Description Language)`

	-  它是一个用来描述Webservice的语言，这门语言使用的是xml语言的语法规则。
	   -  WSDL描述了Webservice内部提供的各个接口所用到的数据类型(如每个接口的形参的类型、返回值的类型)、以及接口的名称等信息，它更像一本关于Webservice的说明书。 
	-  通过阅读某个Webservice的WSDL文件，可以知道该Webservice提供了哪些接口。

<br>　　范例1：使用WSDL发送SOAP消息的具体流程。

	-  首先，客户端向服务器端发送请求，获取某个Webservice的WSDL文件。
	-  然后，客户端依据WSDL文件的内容，发送SOAP消息。
	-  最后，该Webservice接到SOAP消息后，会解析SOAP消息，根据消息中的信息做出相应的操作，并将操作的结果封装成SOAP消息，返回给客户端。 

　　下面将以`“2400多个城市天气预报Web服务”`为例，讲述如何通WSDL方式调用Webservice。

<br>　　范例2：下载WSDL文件。

	-  首先，打开http://webservice.webxml.com.cn页面。
	-  然后，找到“2400多个城市天气预报Web服务”。 
	-  接着，找到“服务说明”，然后点击去。然后将该xml文件另存为到本地，名为test.xml。
	-  然后，使用JDK提供的“wsimport”工具，生成此wsdl所描述的api的源代码。
	-  最后，使用生成的源代码调用Webservice即可。

<br>　　范例3：wsimport工具。
```
wsimport -s . test.xml
```
    语句解释：
	-  含义为：解析test.xml文件，并将生成的.java和.class文件放到当前目录下面。
	-  提示：若解析的时候报错，则将wsdl文件中导致报错的那行代码给删掉即可。
	-  wsimport.exe位于JAVA_HOME\bin目录下.
	-  常用参数为：
	   -  “-d  <目录>”            将生成.class文件，放于指定的目录下。默认参数。
	   -  “-s  <目录>”            将生成.java文件和.class文件，放于指定的目录下。
	   -  “-p  <生成的新包名>”     将生成的类，放于指定的包下。

<br>　　范例4：查询天气。
``` android
public class Test {
    public static void main(String[] args){
        WeatherWS service = new WeatherWS();
        WeatherWSSoap soap = service.getWeatherWSSoap();
        // 获取中国的所有省、直辖市、地区的编号。
        ArrayOfString provinceList = soap.getRegionProvince();
        // 依次遍历每一个城市。
        for(String province : provinceList.getString()){
            System.out.println(province);// 得出山东的代号为3119 。
        }
        // 查询出山东省下面的所有市、区。
        ArrayOfString cityList = soap.getSupportCityString("3119");
        for(String city : cityList.getString()){
            System.out.println(city); // 获取到台儿庄的编号为1869。 
        }
        // 查询出台儿庄的天气。
        ArrayOfString skyInfo = soap.getWeather("1869", null);
        for(String sky : skyInfo.getString()){
            System.out.println("☆☆☆☆ "+sky);
        }
    }
}
```
    语句解释：
	-  在webxml.com.cn中的“2400多个城市天气预报Web服务”中提供了各个类的API，可以在线观看。
	-  通常，在wsdl文件中的“<wsdl:service name="WeatherWS">”节点的name属性的值就是Webservice所对应的主类，通过主类就可以找出调用Webservice的具体方法。
	-  提示：这些API不需要记忆，用到某个新技术时，可以看着官方提供的Demo慢慢摸索。

# 第五节 Handler #

## 基本用法 ##
<br>**问题的起源：**
　　在Android网络编程中，用户的手机通常会需要从服务器下载、上传一些数据。由于上传(下载)操作所消耗的时间过长，所以都会使用进度条控件来告知用户当前上传(下载)进度。
　　对于任何一个线程来说，它同一时间只可以做一件事，主线程也不例外。并且`主线程的主要任务就是响应用户的操作`。在Android中若应用程序长时间(`5秒以上`)无法响应用户的请求，则Android系统会弹出`ANR`(应用程序无响应)对话框，询问用户是否强行关闭该应用。
　　因此若直接使用主线程完成上传、下载的任务，则在上传下载执行完毕之前，则主线程是无法响应用户的操作的。
　　于是，对于那些耗时的操作来说，只有开启子线程去执行了。
　　但是，这和`Handler`有什么关系? 


<br>　　在继续向下讲解之前需要知道，线程和控件的关系。

	-  Android中的控件通常只可以被创建其的线程所修改，否则将程序抛出CalledFromWrongThreadException异常。注意，此处说的是“通常”，原因在后面的章节会讲。
	-  父线程可以修改子线程中定义的控件。
	-  在子线程中仅可以简单的修改父线程中的少数几个控件。
	   -  如ProgressBar、SeekBar、ProgressDialog等。所谓的简单的修改，就是只能调用这些控件的某些方法(如setProgress()等)，若调用其他方法，则仍然会抛异常。
	   -  通常子线程中不可以修改父线程中的其他控件(如TextView、Button等)。
	-  由于主线程是程序中所有线程的父线程，因此它可以操作在任何子线程中创建的控件。

<br>　　问题来了，耗时操作通常是在子线程中执行，而Activity等所显示的View都是在主线程中创建的，那么子线程执行完耗时操作后，就不能直接修改主线程(也称`UI线程`)中的控件了。
　　此时唯一的解决方法就是，在子线程执行完毕耗时操作后，`想办法通知主线程一下`，然后借助主线程来修改View。  
　　而使用`Handler`就可以完成子线程和父线程之间的通信。
<br>　　既然知道了Handler的作用，那么就赶快 **搞起来啊!**

<br>**Handler的大致工作原理：**
　　Handler是基于消息机制的，消息机制类似于常说的`“回调”`，当子线程执行完毕后，就发送一个消息对象给父线程，父线程接到消息后再做出相应的操作。
　　消息被封装成一个`Message`类。 子线程要传递给父线程的数据可以保存在该对象中。

　　Handlel的使用方法：

	-  首先，在父线程中创建一个Handler对象。
	-  然后，开启一个子线程去执行耗时的任务，执行完毕后子线程就发送一个Message对象给其父线程中的那个Handler对象，Handler接收到Message对象后，再根据其内的信息，来执行相应的操作。

　　在上述流程中，最关键的步骤是，子线程如何将`Message`对象发送给父线程的`Handler`对象。 第二关键的问题是，`Handler`什么时间会处理以及怎么处理子线程发来的`Message`，是接到消息后立刻就处理该消息吗？

<br>　　范例1：`Handler`类。
``` android
// 默认情况下，当父线程的Handler接到子线程传递来的消息后，就会回调此方法。因此通常会重写此方法。
// @param msg ：当前要处理的消息。
public void handleMessage(Message msg);

// 在子线程中调用此方法可以向当前Handler对象的消息队列中添加一个消息。调用此方法后，默认会导致handleMessage方法被调用。
// @param msg ：要发送给Handler的消息对象。
public final boolean sendMessage(Message msg);
```

　　接下来先看看如何构造、发送、处理一个`Message`对象。至于`Handler`的整体工作流程、消息队列等，后面会详细描述。

<br>　　范例2：发送消息。
``` android
public class TestActivity extends Activity {
    public Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            // 获取Message对象中的数据。
            System.out.println(msg.arg1);
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        new Thread(){// 创建一个线程对象。
            public void run(){
                // 创建一个Message对象。
                Message msg = new Message();
                // 为Message对象设置数据。
                msg.arg1= 100;
                mHandler.sendMessage(msg); // 将消息对象发送到Handler对象中。
            }
        }.start();
    }
}
```
    语句解释：
	-  本范例中，使用Handler对象调用它自己的sendMessage方法，给它自己发送消息，虽然看起来很怪异，但是是有原因的，具体原因后述。现在先说说Message对象：
	-  Message类用来封装一个消息，在Message对象中可以保存一些数据，以供Handler使用。
	   -  若需要传递给Handler的数据是int类型的，则可以使用Message类提供的两个int类型的属性arg1、arg2，他们方便使用且会更节约系统资源。
	   -  若需要传递一个Object类型的数据，则可以使用Message类提供的obj属性。
	   -  若需要传递多个Object类型的数据，则可以使用Bundle对象。当然也可以仍然使用obj属性，万物皆对象嘛。

<br>　　范例3：Message对象。
``` android
// 发送数据：
public void sendMessage() {
    new Thread() {
        public void run() {
            Message msg = new Message();
            msg.arg1 = 100;
            msg.arg2 = 100;
            msg.obj = new Date();
            mHandler.sendMessage(msg);
        }
    }.start();
}

// 接收数据：
public void handleMessage(Message msg) {
    System.out.println(msg.arg1+","+msg.arg2+","+msg.obj);
}
```

<br>　　范例4：Message对象2.0。
``` android
// 发送数据：
public void sendMessage() {
    new Thread() {
        public void run() {
            Message msg = new Message();
            Bundle mData = new Bundle();
            mData.putString("name", "Cxy");
            mData.putInt("age", 35);
            msg.setData(mData);
            mHandler.sendMessage(msg);
        }
    }.start();
}

// 接收数据：
public void handleMessage(Message msg) {
    Bundle mData = msg.getData();
    System.out.println(mData.getString("name") + "," + mData.getInt("age") );
}
```

<br>　　范例5：处理消息。
``` android
// 发送数据：
public void sendMessage() {
    new Thread() {
        public void run() {
            //  发送消息1：
            Message msg = new Message();
            msg.obj = "已下载 80%";
            msg.what = 1;
            mHandler.sendMessage(msg);
 
            //  发送消息2：
            msg = new Message();
            msg.obj = "Hi";
            msg.what = 2;
            mHandler.sendMessage(msg); 
        }
    }.start();
}
// 接收数据：
public void handleMessage(Message msg) {
    switch(msg.what){
    case 1:
        System.out.println("更新进度条"+msg.obj);
        break;
    case 2:
        System.out.println("打印数据"+msg.obj);
        break;
    }
｝
```
    语句解释：
	-  父线程中创建的Handler对象可以接收来自其n个子线程中发送过来的消息。
	-  这些不同的子线程所要完成的任务是不尽相同的，因而他们发送的Message对象需要区别开来处理。
	-  Message的what属性类似于给消息增加一个“唯一标识”，以此来区分不同的Message 。

## 运行原理 ##
　　现在知道了在子线程中如何将数据封装成`Message`对象了，接下来咱们就需要研究一下`Message`对象到底是如何被发送给其他线程中创建的`Handler`的。
　　Handler机制中主要牵扯到了`Handler`、`Message`、`MessageQueue`、`Looper`四个类。

<br>　　它们四者的身份：

	-  Message表示一个消息对象，它封装了子线程想要做的事情。
	-  MessageQueue表示一个消息队列，队列中的每个元素都是一个Message对象。各个子线程发送给Handler的消息，都会先被放到消息队列中排队等待处理。
	-  Looper：表示一个循环器，它会不断的从MessageQueue的头部获取Message对象，然后将该Message对象交给Handler去处理。
	-  Handler：表示一个处理器，用于处理Message对象。

<br>　　它们四者的关系：

	-  Handler类用于处理消息对象，在Handler类中有一个Looper类型的属性。
	-  Looper类中定义了一个MessageQueue(消息队列)对象。
	-  MessageQueue是一个链队，链队中的每个节点都是一个Message对象，每个Message对象的next域指向下一个Message对象。

<br>　　在Handler中必须要存在一个`Looper`对象，不然整个Handler机制是无法运行的。因此在构造Handler对象的时候就需要同时为Handler对象指定一个Looper。
　　通过构造方法`public Handler(Looper looper)`可以为Handler设置Looper。若用户构造Handler对象时调用的是Handler的无参的构造器，则Handler的无参构造器会试图从当前线程中获取一个Looper对象，若获取不到，则程序将抛异常并终止。
　　总之，`Looper`是在Handler创建的同时被设置到Handler中的。
　　但是，在上面的例子中在实例化Handler对象时，并没有为其提供Looper对象，为什么没有报错呢？`在Main线程中默认存在了Looper对象`，因此主线程中的Handler对象在创建时不会有任何问题。

<br>**消息的发送流程**
　　假设现在Main线程中创建了一个Handler对象。子线程A要向Main线程中的Handler发送消息。发送的流程如下：

	-  首先，当Handler对象被创建后，其内的Looper对象也将被设置完成，然后Looper对象开始不断的从其内部的MessageQueue中读取Message 。若MessageQueue中没有任何消息，则Looper将不执行任何操作，然后继续执行下一轮循环。 
	-  构造完Handler对象后准备工作就算完毕了，接着线程A就可以向Handler发送消息了。(其实就是将消息发送到Handler的Looper对象内的MessageQueue对象中)。
	-  线程A发送Message对象的方式有两种：
	   -  第一种：通过Handler类中提供的sendMessage()等方法，间接的将Message对象发送到MessageQueue中。
	   -  第二种：先获取Looper对象中的MessageQueue对象，然后调用MessageQueue类提供的方法，将Message直接添加到消息队列中去。
	-  最常用、最方便的发送方式就是第一种，使用Handler类发送消息可以帮我们省去许多繁琐的操作。
	-  当消息被发送到MessageQueue中后，线程A就直接返回，它接着就去执行sendMessage()之后的代码。 这类似于咱们去邮局寄信，当咱们把信放入信箱后，咱们就可以回去了，至于信如何被发送到目的地，咱们不需要关心。
	-  事实上，每个Message对象都有一个Handler类型的target属性，它指出由哪个Handler对象来处理当前消息对象。
	-  当Main线程中的Looper从MessageQueue中获取到Message后，就将Message发送给其target属性指向的Handler对象的dispatchMessage()方法，由该Handler对象来决定如何处理此Message。
	-  Handler对象的dispatchMessage()方法被调用后，在其内部会将其接到的Message对象转交给相应的处理方法：
	   -  若Message对象的callback属性不为null，则调用callback属性的run()方法。
	   -  若当前Handler对象的callback属性不为null，则调用当前Handler对象的callback属性的handleMessage(Message)方法。
	   -  若上面两个条件都不满足，则调用当前Handler对象的handleMessage(Message)方法去处理。

<br>　　此时，就实现了线程A和主线程的通信。即线程A的工作是上述的整个过程的前半部分(发送消息)， Main线程的工作则是后半部分(处理消息)。这样一来，Message对象将在父线程中被处理。

　　为什么每个`Message`对象要存在一个`target`属性呢?  

	-  父线程A中创建的Handler对象可以接收从多个子线程发送来的消息。
	-  父线程A中可以创建多Handler对象，每个Handler对象中都必须要存在一个Looper对象。 默认的情况下，多个Handler对象都会从当前线程中获取Looper对象。
	-  这意味着，在父线程A中的Looper对象的MessageQueue属性中保存的消息对象，会可能来自于多个Handler。

　　提示：为了更好的理解上述过程，请您参看`Handler`、`MessageQueue`、`Looper`、`Message`类的源代码。

<br>**Looper对象**
　　接下来咱们再来谈谈`Looper`对象，随后将会给出一个更新进度条的范例，帮助您更好的理解Handler机制。

<br>　　范例1：Looper类。
``` android
// 创建一个Looper对象，并将该对象绑定到当前线程上(通过ThreadLocal)。
public static final void prepare()

// 启动looper对象，使之开始不断的从其内的MessageQueue中获取Message。
public static final void loop()
```

<br>　　范例2：您真的懂了吗?
``` android
public class TestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        new Thread() {
            public void run() {
                Looper.prepare();// 在当前线程中创建一个Looper。
                Handler mHandler = new Handler() {
                    public void handleMessage(Message msg) {
                        String currThdName = Thread.currentThread().getName();
                        System.out.println("当前线程 = " + currThdName);
                    }
                };
                Message msg = new Message();
                mHandler.sendMessage(msg);
                Looper.loop();
            }
        }.start();
    }
}
```
    语句解释：
	-  若想在子线程中创建Handler对象，则需要手工的调用Looper类的prepare方法在当前线程中创建一个Looper对象。 创建完Looper对象后，还需要调用Looper对象的loop方法来启动它本身。
	-  Handler内部的Looper对象就是从其所在的线程中获得的。

<br>　　范例3：这样会错吗?
``` android
public class TestActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
        new Thread() {
            Handler mHandler = new Handler() {
                public void handleMessage(Message msg) {
                    String currThdName = Thread.currentThread().getName();
                    System.out.println("当前线程 = " + currThdName);
                }
            };
            public void run() {
                Message msg = new Message();
                mHandler.sendMessage(msg);
            }
        }.start();
    }
}
```
    语句解释：
	-  请您仔细思考，程序执行的结果是什么。

<br>　　范例4：Handler的其他方法。 
``` android
// 向当前Handler的消息队列中添加一个Runnable 。
// 注意：Handler将直接调用r的run()方法，而不是通过Thread的start()方法启动r 。
// 在Handler内部会构建一个Message对象，并将该对象的callback属性设为r，然后再将这个Message对象加入到消息队列。
// 返回值：
// -  若r被成功加入到消息队列中则返回true。
public final boolean post(Runnable r);

// 向当前Handler的消息队列中添加一个Runnable 。Handler会等待delayMillis毫秒后，才调用Runnable的run()方法。
public final boolean postDelayed(Runnable r, long delayMillis);

// 从当前Handler的消息队列中删除一个Message对象，若找不到该Message则不删除。
public final void removeMessages(int what);
```

　　提示：当某个`Message`在主线程中被处理后，则`Looper`会调用该Message对象的`recycle()`方法。在`recycle()`方法中会将该Message对象的`what`、`obj`等属性的值置为默认值(`0`、`null`等)，然后将该Message对象加入到一个链栈中。
　　当Handler调用`obtainXxx()`方法获取`Message`对象时，就从栈顶弹出一个`Message`对象。
　　因此Handler的`obtainXxx()`方法的主要作用是为了重用已存在的`Message`对象。若链栈中没有任何`Message`对象，则会`new`一个Message对象返回，但该Message不会被入栈。

<br>　　范例5：完整的多线程下载。
``` android
public class TestActivity extends Activity {
    public static final int UPDATE_PROGRESS = 101; 
    public static final int PRINT_STRING = 102;
    private ProgressBar progress;
    private Handler handler = new Handler(){
        public void handleMessage(Message msg) {
            switch(msg.what){
            case UPDATE_PROGRESS://若当前msg用于更新进度条。
                progress.setProgress(msg.arg1);
                break;
            case PRINT_STRING: //若当前msg用于打印数据。
                System.out.println(msg.obj.toString());
                break;
            }
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        this.progress = (ProgressBar) this.findViewById(R.id.progress);
        new Thread(){
            public void run() {
                // 下载文件。
                try {
                    downloadJSP();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    private void downloadJSP()throws Exception {
        // 设置要下载的文件。
        URL url = new URL("http://192.168.1.11/Service/index.jsp");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(5000);
        if(conn.getResponseCode() == 200){
            // 获取服务器端返回的数据的总长度。
            int max = conn.getContentLength();
            progress.setMax(max);
            // 开始下载数据。
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            InputStream input = conn.getInputStream();
            byte[] array = new byte[1024];
            int len;
            while( (len = input.read(array)) != -1){
                output.write(array,0,len);
                Message msg = new Message();
                // 每下载一次数据都去更新进度条。
                Thread.sleep(100);
                msg.what = UPDATE_PROGRESS;
                msg.arg1 = progress.getProgress()+len;
                handler.sendMessage(msg);
            }
            input.close();
            // 下载完成后,在主线程中将下载的数据输出。
            Message msg = new Message();
            msg.what = PRINT_STRING;
            msg.obj = output.toString();
            handler.sendMessage(msg);
            // 关闭流。
            output.close();
        }
    }

}
```


<br><br>