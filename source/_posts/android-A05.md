title: 入门篇　第五章 网络编程
date: 2015-3-9 10:38:36
categories: Android开发 - 青铜
---
　　本章来讲解一下`Android`开发中网络编程相关的知识。

# 第一节 HTTP协议 #
　　本节简单的介绍一些`http`协议的基础知识，如果你没有任何网络编程的经验，那么你不适合阅读本文。
## 基础知识 ##
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
　　浏览网页是`http`的主要应用，但是这并不代表`http`就只能应用于网页的浏览。 `http`是一种协议，只要通信的双方都遵守这个协议，`http`就能有用武之地。

<br>**URI和URL**
　　URL是URI的子集。

	-  URI 可以描述任意一个(本地系统、互联网等地方的)资源的路径。
	-  URL 是一种特殊类型的URI，包含了用于查找某个资源的足够的信息，主要用来描述互联网上的一个资源的路径。

　　比如：`“http://www.baidu.com/test/a.txt”`是一个URL，它也是一个URI 。

<br>　　URL 的一般形式是：`<URL的访问方式>://<主机>:[端口][路径]`，比如：`http://www.baidu.com:8080/test/a.txt`。其中：

	-  “http”表示要通过http协议来定位网络资源，常见的访问方式有：http、ftp、news等。
	-  “www.baidu.com”表示资源所在的地址，它是一个合法的Internet主机域名或者IP地址。
	-  “8080”表示端口号，若省写了端口则默认访问80端口。
	-  “/test/a.txt”表示资源在服务器端的存放路径。

<br>**协议版本号**
　　超文本传输协议已经演化出了很多版本，它们中的大部分都是向下兼容的。
　　目前有`0.9`(已过时)、`HTTP/1.0`、`HTTP/1.1`。
　　`HTTP/0.9`只接受`GET`一种请求方法，没有在通讯中指定版本号，且不支持请求头。由于该版本不支持`POST`方法，所以客户端无法向服务器传递太多信息。

　　`HTTP/1.0`这是第一个在通讯中指定版本号的HTTP协议版本，至今仍被广泛采用，特别是在代理服务器中。

　　`HTTP/1.1`是当前版本（现在是2015年），持久连接被默认采用，并能很好地配合代理服务器工作，还支持以管道方式在同时发送多个请求，以便降低线路负载，提高传输速度。

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
    -  响应头Location：告知客户端浏览器，需要将浏览器窗口重定位到其指向的页面中。只有响应码为302时，浏览器才会执行重定位。
    -  响应头Content-Encoding：告知客户端浏览器，数据(回应正文)的压缩格式。
    -  响应头Content-Type：告知浏览器，服务器返回给浏览器的数据，是什么格式的。即MIME类型。
    -  响应头Refresh：告知浏览器，定时刷新页面。
    -  响应头Expires、Cache-Control、Pragma：都是用来告知浏览器不要缓存资源数据。由于浏览器的种类繁多，所以有3种头信息。

# 第二节 HttpURLConnection #
<br>　　范例1：发送GET请求。
``` java
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
``` java
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

<br>　　扩展：断点下载。

	-  向服务器发送请求时，需要设定如下头字段：
	   -  conn.setRequestProperty("range", "bytes="+start+"-"+end);
	   -  其中start和end就是需要请求下载数据的范围。


# 第三节 HttpClient #

## 简介 ##
　　`java.net`包中已经提供了访问网络资源所需要使用的API（如`HttpURLConnection`等），但是对于一些应用程序来说，它的功能还不够丰富和灵活，实现稍微复杂点业务时比较难（比如文件上传）。

<br>**是什么?**
　　`HttpClient`是`Apache Jakarta Common`下的子项目，用来提供高效的、最新的、功能丰富的支持HTTP协议的客户端编程工具包，简单地说它就是用来接收和发送HTTP消息的。

　　下载地址为：http://hc.apache.org/downloads.cgi （本文基于`4.1.2`版本）。

　　`HttpClient`不是一个浏览器，它不会去缓存内容、执行嵌入在HTML页面中的`javascript`代码。

<br>**核心接口**
　　在`HttpClient`框架中最核心的一个接口就是`HttpClient`接口，使用它的实例可以向服务器端发送请求。

<br>　　范例1：`HttpClient`接口。
``` android
public interface HttpClient {
    // 使用当前HttpClient对象，发送一个HTTP请求，并将返回值封装成一个HttpResponse对象。
    public abstract HttpResponse execute(HttpUriRequest request)
}
```
    语句解释：
    -  前面说了，基于HTTP协议发送请求有多种不同的请求方式（如Get、Post等）。
    -  这些请求方式在HttpClient框架中也被封装成了具体的类。如：HttpGet类、HttpPost等类。

<br>　　`HttpClient`会将服务器返回的数据封装成一个`HttpResonse`对象，客户端通过该对象提供的方法查看响应的内容。

<br>　　范例2：`HttpResponse`接口。
``` android
public interface HttpResponse extends HttpMessage {
    // 返回服务器端返回的响应的正文数据。若没有响应则返回null。
    public abstract HttpEntity getEntity()

    // 返回服务器端返回的响应的响应行。
    public abstract StatusLine getStatusLine()
}
```

## 请求 ##
　　`DefaultHttpClient`类是`HttpClient`接口的具体实现类，我们用它来与服务器进行交互。

<br>　　范例1：发送Get请求。
``` android
public class HttpClientDemo{
    public static void main(String[] args) throws Exception{
        HttpClient client = new DefaultHttpClient();
        // 指定当前请求对象所要请求的位置，构造一个HttpGet对象。
        // uri的格式为：协议名、主机名、端口、资源的路径、请求参数，其中前两者是必须要提供的。
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
        // 依据指定参数创建一个URI对象。
        // 参数依次为：scheme 协议名、host主机名、port端口、path请求路径、query请求参数。
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
    -  URIUtils类会使用UTF-8编码来创建出一个URI对象，请求参数的值可以包含中文，在服务器端使用UTF-8进行解码即可，但是请求参数的值不可以包含空格。
       -  因为使用UTF-8编码时，空格会被转换为“+”号。
    -  使用HttpRequestBase类定义的getURI方法可以获取当前请求路径，HttpPost和HttpGet都是HttpRequestBase的子类。

<br>　　若想在请求参数的值中包含空格等字符，也可以使用如下两个类：

	-  NameValuePair：请求中的每个参数都被看作成一个名值对（key=value），使用一个NameValuePair实例来表示。
	-  URLEncodedUtils：将一个List<NameValuePair>按照指定的编码转换成字符串的形式。

<br>　　范例3：发送Get请求。
``` java
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

<br>　　范例4：设置请求头。
``` java
HttpGet get = new HttpGet(URI.create("http://192.168.0.110/Service/index.jsp"));
get.addHeader("Content-Length", "1011");
get.addHeader("cxy","tsx");
client1.execute(get);
```
    语句解释：
    -  在服务器端就可以获取此时设置的请求头。

<br>　　范例5：发送表单实体。
``` java
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

<br>　　范例6：字符串参数。
``` java
public viod text() {
    HttpClient client = new DefaultHttpClient();
    HttpPost httppost = new HttpPost("http://localhost/Server/index.jsp");
    // 在发送Post请求时，若请求正文中需要包含多媒体类型的数据，则可以使用MultipartEntity类。
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
    -  ContentBody常用的子类还有：FileBody、ByteArrayBody、InputStreamBody，如果决定这些子类提供的功能扔不够用，也可以自定义。

## 响应 ##
　　在`HttpClient`中使用`HttpResponse`类表示服务器对客户端的响应。

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

<br>　　范例3：迭代器遍历。
``` java
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
``` java
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
``` java
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

<br>　　范例2：设置缓冲区大小。
``` java
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
    -  HttpClient的默认缓冲区是8k ，当数据存满时HttpClient会自动将数据发送出去。

<br>　　默认情况下，HttpClient 会试图自动从 I/O 异常中恢复：
 
	-  HttpClient 不会从任意逻辑或 HTTP 协议错误（那些是从 HttpException 类中派生出的）中恢复的。 
	-  HttpClient 将会自动重新执行那些假设是幂等的方法。 
	-  HttpClient 将会自动重新执行那些由于运输异常失败，而 HTTP 请求仍然被传送到目标服务器（也就是请求没有完全被送到服务器）失败的方法。
	-  HttpClient 将会自动重新执行那些已经完全被送到服务器，但是服务器使用 HTTP 状态码（服务器仅仅丢掉连接而不会发回任何东西）响应时失败的方法。在这种情况下，假设请求没有被服务器处理，而应用程序的状态也没有改变。如果这个假设可能对于你应用程序的目标 Web 服务器来说不正确，那么就强烈建议提供一个自定义的异常处理器。

<br>　　范例3：请求重试。
``` java
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

	-  Webservice是基于HTTP协议和XML文件的，由于这二者是跨平台的，因此在任何语言中都可以使用Webservice技术。
	-  在客户端程序中只需要向Webservice所在的服务器发送一个http请求即可实现Webservice的调用。
	   -  调用Webservice有两种方式：通过HTTP协议和通过SOAP协议。
	   -  调用Webservice后，Webservice会将结果以XML文件的形式返回给用户。 

## HTTP协议 ##
　　下面将以`“电话号码归属地查询”`为例，讲述如何通过HTTP方式调用Webservice。

<br>　　范例1：准备工作。

	-  首先，打开http://www.webxml.com.cn/zh_cn/index.aspx页面。
	-  然后，找到“国内手机号码归属地查询WEB服务”。
	-  最后，点击“getMobileCodeInfo”，通过此接口可以获取国内手机号码归属地省份、地区和手机卡类型信息。

<br>　　范例2：阅读发送规范。
``` c
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
``` c
	http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo
```

<br>　　范例3：POST请求。
``` java
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
``` java
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
　　在传统的方式中，客户端与服务器端数据交换的格式为：`属性名1=属性值1&属性名2=属性值2`。

　　而在`Webservice`技术中，客户端和服务器端收发请求时都需要将数据封装成`SOAP消息`再传递。 

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
	-  SOAP协议有两个版本：SOAP1.1和SOAP1.2，本范例是SOAP1.2的规范。
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
　　通过发送SOAP消息的方式访问Webservice时，通信双方都需要对SOAP消息进行解析。
　　但有些Webservice返回的SOAP消息包含的数据很多，解析起来很麻烦，因此也会使用`WSDL方式`来发送SOAP消息，这样客户端开发人员就不需要编写解析SOAP消息的代码了。

<br>　　`WSDL(Web Service Description Language)`

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



<br><br>