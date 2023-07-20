---
title: 第四章 数据库
date: 2010-11-08 09:33:49
author: Cutler
categories: 计算机基础
---

# 概述 #

<br>　　**数据管理的三个阶段**

　　<font color='red'>人工管理阶段</font>：此阶段程序员的源代码都写在卡片上（程序处理的数据也完全与程序写在一起），执行程序时将卡片送进计算机，计算机运算完毕后，将结果返回给程序员。程序执行期间，程序员不能和计算机交互，也没有磁盘的概念，数据根本没法共享，依赖于程序存在。
>硬件：无磁盘，数据无法长期存储。
>软件：无操作系统和DBMS。
>数据处理方式：批处理，中途无交互。
>特点：数据不共享，不具有独立性

　　<font color='red'>文件系统阶段</font>：此阶段出现了OS（操作系统）、文件系统(文件系统是OS的一个子系统)出现。此时应用程序通过OS来访问磁盘中被文件系统中管理的文件，但是此阶段是<font color='red'>数据本身内有数据结构，整体无结构</font>，即数据只能以单个文件的形式存储，当程序要查找某一个数据时，从文件头到文件尾顺序查找，查找的速度十分慢，而且数据中重复多，数据只能进行简单的共享。
>硬件：有磁盘，数据可以长期存储，有了文件的概念。
>软件：有操作系统和专门的DBMS
>数据处理方式： 批处理、实时处理。
>特点：数据冗余大、共享性差。

　　另外，所谓的数据本身内有数据结构整体无结构是指：
>比如数据中有一个学生对象，这个学生对象包括：姓名、学号、性别等字段，这就叫数据内有结构。但是多个对象之间是顺序排放的，查找的时候需要从头到尾的查找速度很慢，这叫数据整体无结构。

　　<font color='red'>数据库系统阶段</font>：此阶段数据整体就有结构的了，这一时期是直接通过DBMS来管理数据，而不再是通过OS的文件系统来间接管理数据了，因此此时对数据的检索和更新是非常快的。
>硬件：磁盘容量增加，价格下降。
>软件：DBMS功能丰富，成本上涨。
>数据处理方式：实时处理、批处理、分布式处理(数据分布在多个物理位置上)。
>特点：数据共享性高、独立性强、数据结构化。

<br>　　**DBMS**

　　数据库管理系统(Database Management System)，我们常见的`Oracle`、`SQL Server2005`、`db2`、`My SQL`等软件都是DBMS。
　　以下是DBMS的功能：
>数据定义：建立表、视图、索引、定义数据库体系结构等。
>数据操作：检索(就是查找)和更新。
>DB的备份和恢复。
>数据库的维护功能： 数据载入、转存、转储以及DB的改组和性能的监控等。
>数据库的并发控制：在多个用户同时处理一个数据时，应避免破坏数据，通常使用挂起。比如在数据库中，用户A对数据进行修改后，可以选择“提交”或者“回滚”，但是在他未通过命令进行“提交”或“回滚”之前，B用户此时也请求修改这个数据，则B用户会被挂起，只有等A提交或者回滚后，B才能修改这个数据。说白了就是DBMS可以保证一个数据，在同一时间只能被一个用户操作。

　　常见DBMS的分类：
>小型数据库：  foxbase和 微软的 Access  
>中型数据库：  Mysql  和 微软的SQL Server2005 以及IBM的infomix
>大型数据库：  Sybase 、oracle和 IBM的db2

<br>　　**SQL**

　　`SQL（Structured  Query  Language 结构化查询语言）`常用于与数据库的通讯，它是非过程式(用户通过输入命令即可得到结果，命令的具体执行不用咱们关心)的程序设计语言，非过程式语言也被称为“<font color='red'>第四代语言</font>”。
>ANSI(美国国家标准协会) 声称：“SQL是关系数据库管理系统的标准语言”，也就是说使用SQL语言在各大关系型数据库中都可以进行基本的操作。
>SQL于1974年提出，它有三个标准：
>　　第一个 ：ANSI SQL 。
>　　第二个 ：1992年对SQL进行修改，得到SQL92(又称SQL2)。
>　　第三个 ：最近的SQL99标准也称为是“SQL3”。 
>每个数据库也都会扩展SQL语句，即在SQL标准的基础上增加一些只有其自身才能识别的SQL专用的命令。

# Oracle数据库 #

　　`Oracle`数据库由美国的`Oracle`公司生产的，`Oracle`原本的含义是“<font color='red'>神谕</font>”，指的是神说的话，在中国的商代，人们把一些刻在龟壳上的文字当成是上天的指示，所以在中国将`Oracle`也译成“<font color='red'>甲骨文</font>”，目前Oracle公司已经收购了SUN公司。

## 数据查询 ##
### 简单查询 ###

　　从本节开始，所有介绍的SQL语句都是基于如下两张表的。

<center>
![](/img/base/base003_01.png)
</center>

<br>　　范例1：基本查询语句。
``` sql
SELECT empno,ename,job,hiredate,mgr,sal,comm,deptno 
FROM  emp;
```
    语句解释：
    -  SELECT关键字指出您要选择表中的哪些列，如果要选择多个列，则列间用逗号间隔，若想选择表中的所有列，则使用“*”代替。 
    -  SQL语句执行过程：数据库先执行FROM找到emp表，因为上面没有限制选择表中的哪些行，所以默认选择所有行，接着执行SELECT，从被选择的行中抽出SELECT语句后面指定的那些列，然后输出。
    -  注意SQL语句必须以分号(;)结尾。

<br>　　范例2：四则运算。
``` sql
SELECT ename,sal*12
FROM emp;
```
    语句解释：
    -  字段是可以进行四则运算的，先乘除，后加减，内层括号最优先。

<br>　　范例3：别名。
``` sql
SELECT empno as "编·号",ename "姓名",job 工作
FROM emp;    
```
    语句解释：
    -  查询数据时，SELECT后面的列的列名称可以由用户自定义，自定义的名称被称为别名。别名有三种定义方式：
    -  第一种：empno as "编·号"
    -  第二种：empno "编·号"
    -  第三种：empno 编号
    -  当别名使用双引号包含时，可以在别名中包含空格或特殊的字符并区分大小写，若别名以数字开头，则必须使用双引号。若给表起了别名，则在当前SQL语句中，就不能再使用表的全名，而只能使用别名。

<br>　　范例4：消除重复。
``` sql
-- 使用distinct关键字可以消除job列的值重复的行
SELECT distinct job
FROM emp;

-- 若select查找多个列，则只有多个列同时相同时，distinct关键字才起作用。
-- 下面的语句此时只有在2个员工的姓名和工作两个列的值完全相同的情况下才会消除重复。
SELECT distinct ename,job    
FROM emp; 
```
    语句解释：
    -  在SQL中可以使用单行注释“--”和多行注释“/*  */”。

### 限定查询 ###

<br>　　范例1：限定查询(WHERE)。
``` sql
-- 查询出编号为7934的员工的姓名、工作、工资。
SELECT empno,ename,job,sal
FROM emp
-- 可以在WHERE子句中使用 is null、is not null 来判断当前列是否为空。
Where empno=7934;
```
    语句解释：
    -  Where关键字就是用来指定选择某些行。
    -  Where的工作原理：将表中的所有记录，依次拿到Where后的表达式中进行筛选，如果表达式返回true则选中这行，否则就不选。即先执行from，然后执行where，最后执行select。

<br>　　范例2：运算符。
``` sql
-- 查询出工资在2000-3000之间的员工的信息。
SELECT *
FROM emp
WHERE sal>=2000 and sal<=3000;

-- 查询出名为SCOTT的员工的信息。
SELECT *
FROM emp
WHERE ename = 'SCOTT';
```
    语句解释：
    -  逻辑运算符：not 、and、or。
    -  关系运算符：=、>、<、>= 、<= 、  !=和<>(这两个都是代表不等于) 。

<br>　　范例3：Between子句。
``` sql
-- 查询出工资 2000<=x<=3000 的所有员工。
SELECT *
FROM emp
WHERE sal between 2000 and 3000;

-- 用between限制字符串。
SELECT *
FROM emp
WHERE ename between 'D' and 'W';

-- 用between限制日期（关于使用between限制日期所用到的函数稍后叙述）。
SELECT *
FROM emp
WHERE hiredate between to_date('1985-1-1','yyyy-mm-dd') and
 to_date('1990-1-1','yyyy-mm-dd');
```
    语句解释：
    -  between子句一般用于限制数字的取值范围(当然限制字符串、日期也行)。

<br>　　范例4：In子句。
``` sql
-- 查询出工作为：Clerk和Manager的所有员工的信息。
SELECT *
FROM emp
WHERE job in(‘CLERK’,’MANAGER’) ;
```
    语句解释：
    -  in又称为列表运算符，在in里面列出了job的所有取值，如果job的值等于in里面的任何一个值，则返回true，而返回true就意味着会被where选中。

<br>　　范例5：Like子句。
``` sql
-- 查询出姓名中第二个字符是A的员工的信息。
SELECT *
FROM emp
WHERE ename like'_A%';
```
    语句解释：
    -  Like子句又称为模糊匹配运算符，有两个通配符：“_”代表一位任意字符，“%”代表零位或多位任意字符。如果要查询出姓名中包括字母A的员工，可用‘%A%’来进行匹配。
    -  在字符串中是区分大小写的，如果将’_A%’改成’_a%’则查询按a查而不是按A查。

<br>　　范例6：排序输出(Order By子句)。
``` sql
-- 将所有员工按工资从大到小排序
SELECT *
FROM emp
ORDER BY sal desc;

-- 按照列的别名排序
SELECT sal s
FROM emp
ORDER BY s desc;

-- 按列的下标排序
-- 由于选择了2列，所以取值范围是1~2 ，而2对应着sal字段。
SELECT ename e,sal s
FROM emp
ORDER BY 2 desc;

-- 当工资相同时，则使姓名按降序排列，如果工资不相同，则不考虑第二个排序字段。
SELECT ename e,sal s
FROM emp
ORDER BY 2 desc,1 desc;
```
    语句解释：
    -  使用Order by子句可以对查询出来的数据进行排序。
    -  排序策略：asc(升序)、desc(降序)，若不指定排序策略，则默认按照asc排序。
    -  Order by可以按照列名、别名、下标、表达式排序，而且Order by子句必需写在整个SQL语句的最后。     

### 单行函数 ###

<br>　　在数据库系统中，每个数据库之间最大区别就在与对函数的支持上，使用函数可以完成一系列的运算。函数分为：<font color='red'>单行函数</font>和<font color='red'>多行函数</font>。
>单行函数：接受一个参数，返回一个值。
>多行函数：接受多个参数，返回一个值。
>Oracle的单行函数主要分为：字符函数、数值函数、日期函数、转换函数、通用函数5种。

　　字符函数，顾名思义，处理字符串的函数。

<br>　　范例1：lower和upper函数。
``` sql
-- 将所有员工的姓名转成小写的形式。
SELECT ename 原名, lower(ename) 小写,upper(ename) 大写,initcap(ename) 首字母大写
FROM emp;

-- lower(str) 将给定参数的每一个字符，依次转成小写形式，若某个字符不是英文字母则不转。
-- upper(str) 将给定参数的每一个字符，依次转成大写形式，若某个字符不是英文字母则不转。
-- initcap(str) 将给定参数的每个单词的首字母大写，其它字符转成小写。
```

<br>　　范例2：其它字符函数。
``` sql
-- concat(str1,str2)函数用于字符串连接，它将str2连接到str1的后面。
SELECT concat('Hi,',' Tomcat!') 
FROM  dual;

-- strsub(str,index,len)函数用于字符串截取。
-- 从下标为的index位置开始的位置，截取出一个长度为len的子串，其中参数len可以不指定。
-- 若index的值为0或1，则从str的开头第一个字符开始截取。
-- 若index的值为-1，则从str最后一个字符开始，向右截取。
-- 若不指定参数len，则从当前index指定的位置开始，向右截取到str右端最后一个字符。 
SELECT substr('Hello',-5,4)
FROM dual;

-- length(str)  计算出字符串str中包含的字符的个数。
-- lengthb(str) 计算出字符串str中包含的字节的个数。
SELECT length('Hi 汤姆!'),lengthb('Hi 汤姆!')
FROM dual;

-- instr(str1,str2) 查找出str2在str1中首次出现的位置，若未出现则返回0。
SELECT instr('Hi Hi!','H')
FROM dual;

-- replace (str1,str2,str3)将str1中所有的str2替换成str3，若没有找到str2则不替换。 
SELECT replace('Hiiii Hiii','i','*') 
FROM dual;
```

<br>　　范例3：数值函数。
``` sql
-- 对64.234整数部分的十位进行四舍五入
-- Round()函数有三种用法：
-- round(14.5)进行简单的4舍5入，不保留小数。
-- round(14.234,2)保留两位小数，然后对小数点后第三位进行4舍5入。
-- round(14.234,-2)对整数部分四舍五入，但会先把操作位之后的数直接截断。
--      当为-1时，对整数部分的个位进行4舍5入，个位之后的数被抛弃，依次类推。
-- 结果为：100
SELECT round(64.234,-2)
FROM dual;

-- Trunc()函数同样有三种用法：
-- trunc(123.454)直接将小数部分丢到。
-- trunc(123.454,2)截取时保留2为小数，将第2位以后的小数都丢掉。
-- trunc(123.456,-1)将整数部分的个位和其后的位全部丢掉。
-- 结果为：120
SELECT trunc(123.456,-1)
FROM dual; 

-- 这个运算用行话就是“取模”或“模除运算”，反正都带“模”，用白话说那就是计算余数。
-- 计算12除以5的余数。
SELECT mod(12,5)
FROM dual;
```

<br>　　范例4：日期函数。
``` sql
-- 获取当前时刻的日期
SELECT sysdate FROM dual;

-- 昨天和明天
-- 此处的+1和-1是以天为单位的。
SELECT sysdate-1,sysdate,sysdate+1  FROM dual;

-- 日期 - 日期 = 相差的天数，日期不能直接使用“+”号与另一个日期相加。
SELECT round((sysdate-hiredate)/7)
FROM emp;

-- 计算所有员工至今加入公司的月数
-- Months_between()函数：返回给定日期之间相差的月份数，用第一个日期减去第二个日期。
SELECT round(MONTHS_BETWEEN(sysdate,hiredate))
FROM emp;

-- 查询出本月的最后一天是几号。
-- last_day()返回指定日期，当月的最后一天。
SELECT LAST_DAY(sysdate)  FROM dual;

-- 计算2个月后的日期。
-- ADD_MONTHS()函数，返回在指定日期上加上指定月份后的日期。
SELECT add_months(sysdate,2) FROM dual;

-- 计算出下个星期一是几号。
-- NEXT_DAY函数，返回在指定日期之后的下一个指定日期的日期号。
SELECT next_day(sysdate, ’星期一’) FROM dual;
```

<br>　　范例5：转换函数。
``` sql
-- 通过日期转换函数，将一个字符串转换成一个日期类型的数据。
SELECT *
FROM emp
WHERE Hiredate = to_date('1981-12-3','yyyy-mm-dd');

-- 将当前日期中的“月份”给截取出来。
-- to_char(date,format)将date转换成format格式的字符串。 
-- yyyy  年份           hh  小时(12小时制)
-- mm    月份           mi  分钟
-- dd    日期           ss  秒
-- hh24  小时(24小时制)  dy  周一 至 周日
SELECT To_Char(sysdate,’mm’) 
FROM dual;

-- 使用fm可以去掉“1981-01-01”中月份和日期中的0。
SELECT to_char(hiredate,'fmyyyy-mm-dd')
FROM emp;

-- 计算字符串 ’123’+’456’ 的结果
SELECT to_number(’123’)+to_number(’456’)
FROM dual;
```

### 组函数 ###

　　分组，就是按用户指定的字段进行分组，将值相同的记录放在一起。而所谓组函数，就是用来操作每个分组中的数据。
>如按照员工的部门编号，将员工分在不同的组中。

<br>　　范例1：组函数。
``` sql
-- Count() 计算出当前组中的所有指定列上的值为非空的记录的个数。
-- Max()   计算出当前组中的最大值。
-- Min()   计算出当前组中的最小值。
-- Sum()   计算当前组中所有的数的和。
-- Avg()   计算当前组中的平均数。

-- 统计组内所有员工的工资的总和、平均工资。
-- 由于下面SQL里没有明确指定分组的规则，所以默认表内的所有记录处在一个组中。
SELECT sum(sal),avg(sal)  FROM emp;

-- 找出最高工资、最低工资
SELECT max(sal) 最高工资,min(sal) 最低工资
FROM emp;
```

　　可以使用group by语句进行分组，一旦明确进行分组，则使用组函数就是分别对每一个组中的数据进行操作。

<br>　　范例2：计算出各部门的人数以及平均工资。
``` sql
-- 语句执行的过程： 
-- 首先在数据库中找到emp表，然后执行group by语句，进行分组。
-- 由于emp表里的数据总共有3个部门，所以分成3个组，分别为：(10部门,20部门,30部门)。
-- 最后分别为每个分组调用一次SELECT语句。
SELECT deptno,count(empno) ,avg(sal)
FROM emp
GROUP BY deptno;
```
    语句解释：
    -  程序中使用了GROUP BY分组，并指定按deptno(部门号)分组。
    -  因此上面用的count()函数和avg()函数，是对每一个分组中的数据进行计算。说白了系统会自动为每一个分组都调用一次SELECT语句。
    -  GROUP BY可以指定多个字段来进行分组，此时就与distinct一样，只有这些字段的值都相同的记录，才会别放到一组中。  

<br>　　需要注意的是：
>若SQL中没有group by语句，且SELECT后面使用了组函数，则在SELECT语句中就不能再查询其他普通列了，但可以有多个组函数。
>若脚本中使用了group by语句，则未出现在group by中的列，绝对不能出现在SELECT后面，但SELECT后面可以出现组函数。

<br>　　范例3：统计出不同部门中，不同工种的平均工资。
``` sql
-- 只有两个员工的deptno列和job列上的值同时相同时，他们才会别分到同一个组中。
select deptno,job,avg(sal)
from emp
group by deptno,job;
```

<br>　　范例4：查询出平均工资>2000的部门号，然后按降序排列。
``` sql
-- having关键字用来对所有组返回值的进行筛选。

-- 按部门分组，将平均工资大于2000的部门的信息输出，此时就是对所有组返回值的进行筛选。
-- 其实Having和SELECT类似，系统也会为每一个分组都调用一次，having语句对分组进行筛选。  
SELECT deptno,avg(sal) 
FROM emp
GROUP BY deptno
Having avg(sal)>2000
ORDER BY 2 desc;
```

<br>　　范例5：按部门分组,查询出平局工资最高的部门。
``` sql
-- 分组函数可以嵌套使用。
-- 内层函数计算每个组的平均工资，外层函数找出 所有组平均工资最大的那个工资。
-- 此时deptno不能出现在select后面。
SELECT max(avg(sal))
FROM emp
GROUP BY deptno;
```

　　各子句的执行顺序：
>首先执行FROM。
>然后是Where进行筛选行。
>接着是Group by进行分组。
>然后是Having对分组进行筛选。
>接着是select从筛选后剩下的组中提取数据。
>最后是Order By对查询结构进行排序。


### 多表查询 ###

　　从多张表中查询数据，称为多表查询。多表查询时会产生笛卡尔积，若不对数据加以筛选，则查询出的数据可能就是错误的。

　　范例1：笛卡尔积。
``` sql
-- 所谓笛卡尔积就是用emp的每一条记录依次和dept的表的每一条记录结合。
-- 所以最后查询出来的记录数量是：emp表的长度*dept表的长度。
SELECT *
FROM emp ,dept;

-- 从笛卡尔全集中，筛选出符合要求的记录，此种连接方式被称为“等值连接”。
SELECT e.empno,e.ename,d.dname
FROM emp e,dept d
WHERE e.deptno=d.deptno;
```

<br>　　范例2：自连接。
``` sql
-- 查询出每个员工的上司
SELECT e1.ename 员工,e2.ename 上司,e2.empno 上司的ID
FROM  emp e1,emp e2
WHERE e1.mgr=e2.empno;
```
    语句解释：
    -  您可以理解成从数据库中取了两次emp表，用e1代表员工表，用e2代表上司表。
    -  开始的时候用e1的第一条记录依次和e2的每条记录匹配，如果e1的mgr(上司的编号)字段与e2表的empno字段相同,则说明找到了e1的上司。
    -  然后继续使用e1的第二条记录依次和e2的每条记录匹配，然后重复执行下去。

　　提示：自连接的效率很低，只适合于表中数据很少的时候。

### 子查询 ###

　　子查询：在一个查询语句的内部，还包括另一个查询语句。特点：将内层查询的结果，作为外层查询的条件。
<br>　　范例1：查询出比员工7782工资高的所有员工的信息。
``` sql
SELECT empno,ename,sal
FROM emp
WHERE sal>(
     SELECT sal
     FROM emp
     WHERE empno=7782
);
```
    语句解释：
    -  要查询出比7782工资高的员工，首先得查出7782的工资是多少，然后再在外层查询中找出比7782工资高的员工的信息，就这么简单。
    -  所有子查询的代码必须写在()中，只有group by中不可以使用子查询，其他地方均可以使用子查询。
    -  当查询数据时，只有单独执行多条sql语句才可能完成某个任务时，就可以考虑使用子查询。 

<br>　　范例2：查询出部门名称、部门员工数、部门平均工资、部门的最低收入雇员的姓名。
``` sql
SELECT temp.deptno 部门号,temp.dname 部门名称,temp.msl 最低工资,e.ename 领取人,
    temp.c 部门人数,temp.a 部门平均工资
FROM  emp e, (
    SELECT  d.deptno,dname,count(empno) c,avg(sal) a,min(sal) msl
    FROM  emp e,dept d
    WHERE e.deptno=d.deptno
    GROUP BY d.deptno,dname 
) temp
WHERE e.deptno=temp.deptno and sal=msl;
```
    语句解释：
    -  复杂的SQL语句都不是一下就写出来的，而是一点一点堆起来的。 

<br>　　在子查询中存在三种操作符号： `In`、`All`、`Any`。

<br>　　范例3：使用范例。
``` sql
-- 查询出各部门的最低工资的员工的信息
-- 此处的In就是Where中的In子句，是列表选择符。
-- 下面代码含义为：如果sal的值是子查询中返回值的任何一个，则就返回true。
SELECT *
FROM emp
WHERE sal IN(
     SELECT min(sal)
     FROM emp
     GROUP BY deptno
);

-- 一般来说使用ALL操作符时，都会配合用<或者>号。
-- “>ALL”代表大于子查询返回的所有值才返回true。
-- “<ALL”代表小于子查询返回的所有值才返回true。
SELECT *
FROM emp
WHERE sal >ALL(
     SELECT min(sal)
     FROM emp
     GROUP BY deptno
);
```

### 集合运算 ###

　　所谓的集合运算，就是对具有相同列的集合，执行交、并、差三种运算。
　　需要注意的是：
>参与运算的各个集合，必须列数相同且列的类型一致。
>使用第一个集合的表头作为结果集中的各个列的列名。

<br>　　范例1：常用函数。
``` sql
-- 交运算，就是找出同时存在于这两个表中的所有元素。
-- 所以结果就是将20部门中的员工查出，即找出两个集合中都有的记录。
SELECT * FROM emp
INTERSECT
SELECT * FROM emp where deptno = 20;

-- 并运算。
-- 将两个集合的所有数据加在一起，如果有重复的行则自动消除重复。
SELECT * FROM emp
UNION
SELECT * FROM emp where deptno = 10;

-- 差运算。
-- 选择出存在于第一个表，但不存在于第二个表中的记录。
SELECT * FROM emp
MINUS
SELECT * FROM emp where deptno = 10;
```

　　集合运算一般只适合操作小表，否则效率很低。

## 数据增删改 ##

<br>　　范例1：插入数据。
``` sql
-- 插入语句分为两部分：字段列表和值列表，其中emp是表名，其后跟着的是字段列表。
-- 向emp表中插入一个员工
Insert into emp(empno,ename,job,mgr,hiredate,sal,comm,deptno) 
values (1005,’cxy’,’MANAGER’,7788,sysdate,5100,3000,40);

-- 若要为表中所有的列赋值，则可以在emp后面不写出字段列表，但值列表中必须为所有列提供值，并且顺序要和表中列的顺序相同。
-- 若暂时不想给某些列赋值,可不将该列放到字段列表中。也可以放进去,但赋值为null。
Insert into emp values(1005,’cxy’,’MANAGER’,null,sysdate,5100,3000,40);
```

<br>　　范例2：删除数据。
``` sql
-- 删除ID为7369的员工的信息
-- DELETE FROM语句 是删除行。如果不加上WHERE子句进行限制，则删除表中的所有数据。
DELETE FROM emp
WHERE empno=7369;

-- 删除ID为7369、1005、7698的员工的信息
DELETE FROM emp
WHERE empno in(7369,1005,7698);

-- 截断表
-- 所谓截断表说，就是删除表中的所有记录，同时将修改提交到数据库，使用rollback无效。
-- 使用截断表可以使指定表所占的资源立即释放。
TRUNCATE TABLE Student;
```

<br>　　范例3：更新数据。
``` sql
-- 修改ID为1005的员工的工资为8000，奖金为6000
-- 修改多个字段的值时使用逗号间隔
-- 使用 update set 语句来更新表中的数据，若不使用WHERE进行限制，则修改表中的所有记录。 
UPDATE emp
SET sal=8000,comm=6000
WHERE empno=1005;

-- 将ID为7369、7839、7698的员工的工资提高1000元
UPDATE emp
SET sal=sal+1000 
WHERE empno in (7369,7839,7698);
```

## 对象管理 ##

　　在Oracle中，存在有如下的数据库对象：
>表     基本的数据存储集合，由行和列组成。
>视图   从表中抽出的逻辑上相关的数据集合。
>序列   提供有规律的数值。
>索引   提高查询的效率。

### 表 ###

　　在Oracle中想要创建一个表，必须要知道Oracle的常用数据类型。

<center>
![](/img/base/base003_02.png)
</center>

<br>　　范例1：常见操作。
``` sql
--  student是表名，表中每个字段之间用逗号间隔，最后一个字段不需要用逗号。
--  default关键字可以为字段指定默认值，insert语句没有为sex列提供数据时，则使用默认值。 
CREATE TABLE student(
    sid    number(5) ,
    sname varchar(10),
    sex   varchar(2)  default '男',
    age   number (3) ,
    birthday date
);

-- 使用子查询的结果来创建一张表，表所具有的列，就是子查询返回的列。
-- 也可以在表名的后面为表中的列自定义列名。
CREATE TABLE emp20
AS
SELECT *
FROM emp
WHERE deptno=20;

-- 增加列
Alter table Student 
add(school varchar(20)  default  ’美国二中’ , height number(3) default 170);

-- 修改列
-- 修改列的长度但不改变列的类型，如将varchar(20)改成varchar(10)。若表中有一个记录的长度为15，此时新列的长度必须>=15。
-- 修改列的类型时，若新旧类型不兼容，则只有在该列中无数据的时候，列的类型才能被修改。
-- 修改列时，对默认值的修改只影响今后插入到表中的行。
Alter table Student
Modify(school varchar(10) default (’英国二中’));

-- 删除列
Alter table student drop column sex;

-- 重命名列
Alter table sstudent rename column sex to fuck;
```

### 视图 ###

　　一个视图实际上就是封装了一个复杂的查询语句。

<br>　　范例1： 建立一个视图，此视图包括工资大于2000的所有员工的信息。
``` sql
--  视图有2个大作用：
--  保证数据的安全性：比如员工表中包含了公司全体员工的信息，很显然对于某一个部门的领导来说，他只能看他所领导的员工的信息，其他员工的信息他不应该看到。因此可以在这个员工表的基础上，为每一个部门建立一个视图，然后根据这个领导的部门编号来决定这个领导有权利查询哪一个视图。
--  提高“查询速度”：如果这条查询语句很长、很复杂，那么我们每次都得要查询数据时，都要重新写一遍就太慢了。 
CREATE VIEW sal2000
AS
SELECT * 
FROM emp
WHERE sal>=2000;
```

<br>　　范例2： 查看视图。
``` sql
--  比如我们可以将下面的语句保存成一个视图 
SELECT temp.deptno 部门号,temp.dname 部门名称,temp.msl 最低工资,e.ename 领取人,temp.c 部门人数,temp.a 部门平均工资
FROM  emp e, (
        SELECT  d.deptno,dname,count(empno) c,avg(sal) a,min(sal) msl
        FROM  emp e,dept d
        WHERE e.deptno=d.deptno
        GROUP BY d.deptno,dname 
      ) temp
WHERE e.deptno=temp.deptno and sal=msl;

-- 然后通过最简单的查询语句就能得到结果，甚至可以使用WHERE语句
SELECT * 
FROM 视图名;
WHERE sal2000>4000;
```

<br>　　范例3： 其它操作。
``` sql
-- 删除视图
DROP VIEW sal2000;

-- 重建视图
-- 视图只是一个逻辑存在的表，它根本就是虚拟出来的。
CREATE OR REPLACE VIEW sal2000
AS
SELECT *
FROM emp
WHERE sal>3000;

-- 使用视图更新数据和使用基本表更新数据的操作是一样的。
-- 如果视图是由多张表中抽取的数据组成的，则不可以通过修改视图来修改原表。
-- 可以通过对视图的插入、删除、更新，来间接操作基本表。
UPDATE sal2000
SET sal=sal+10
WHERE empno=1005;
```

## 约束 ##
　　在一张表中约束是必不可少的，使用约束可以更好的保证数据库中的数据的完整性。 
>说白了约束就是限制，给某张表增加约束后，当用户向表中插入数据的时候，会对该数据进行检查，如果违反了我们事先定义好的约束，则DBMS就不允许此数据进表。
>
>在实际应用中，约束主要分为如下5类：
>主键约束
>唯一约束
>检查约束
>非空约束
>外键约束

　　**主键约束**
　　主键能唯一标识一个记录。比如咱们的身份证号，就可以做为唯一区分我们每一个人的标识。主键具有如下的特点： 
>1、被设为主键的列，在INSERT INTO中必须为主键列赋值。
>2、表中所有记录在此列上的值互不能相同，否则DBMS将拒绝新数据插入到表中。
>3、一般来说主键都用在ID上，如学号、教师号、学籍号等。
>4、使用Primary key关键字在创建表的时候定义主键。

<br>　　范例1： 定义主键。
``` sql
-- 列级主键，在列的类型的后面，跟着“Primary key”
CREATE TABLE Student(
     Sid  number (11) Primary key,
     Name varchar (8)  
);

-- 表级主键，在表的最后，使用“CONSTRAINT”关键字。
CREATE TABLE Student(
     Sid  number ( 11),
     Name varchar ( 8)  ,
     CONSTRAINT Student_sid_pk Primary Key(Sid)
);

-- 一个主键可以包含多个列，当主键包含多个列的时候，主键被称为是主键组。
-- 如果需要定义主键组，则可以这样写：
-- CONSTRAINT Student_sid_pk Primary Key(Sid,name)
```

　　**唯一约束**
　　主键有一个特点，就是各记录的主键值不能相同。
　　但是一个表中只能有一个主键，如果还有其他的列也不希望出现重复值，该怎么办？可以使用唯一键，它可以保证表中所有记录的，指定列上的值互不相同，同时一个表可以有多个唯一键。

　　范例1： 定义唯一键。
``` sql
-- 列级唯一键，在列的类型的后面，跟着“unique”
CREATE TABLE Student(
     Sid    number(20)  primary key,
     Name   varchar(20) unique
);

-- 表级唯一键，在表的最后，使用“UNIQUE”关键字。
CREATE TABLE Student(
     Sid    number(20)  primary key,
     Name   varchar(20) ,
     CONSTRAINT Student_name_uk UNIQUE(name)
);

-- 相应的也可以创建唯一键组。
-- 只有当新数据与已存在的数据在唯一键键组上的每一列的值都相同时，才判定新数据违反了唯一键约束。
```

　　**检查约束**

　　所谓检查约束，就是由咱们自己指定限制的条件。
>主键、唯一键约束都是自动检测数据是否合法，我们自己没有对它们说该怎么样检测。
>那么如果咱们有如下限制：
>1、限制学生的sex(性别)的取值为：男、女。
>2、限制学生的年龄在20到50岁之间
>此时不论用主键还是唯一键都不行，它们只能检测是否重复，此时就用到了检查约束。

　　范例1： 检查约束。
``` sql
-- 列级检查约束，在列的类型的后面，跟着“check”
CREATE TABLE Student(
     Sid    number(20)  primary key,
     Name   varchar(20) unique,
     Sex    varchar(2) default (’男’) check(sex in(’男’ ,’女’)) 
);
-- 需要注意的是default必须放在check约束之前写。

-- 同样可以限制年龄
ALTER TABLE Student ADD(age number(3) check(age between 20 and 130));

-- 定义表级检查约束
CONSTRAINT Student_age_ck CHECK( age  between 20 and 130)

-- 检查约束组
CONSTRAINT Student_age_sex_ck  
CHECK( age between 20 and 130) , CHECK (sex in(’男’,’女’))
```

　　**非空约束**

　　所谓非空约束，就是使用INSERT INTO插入数据时，必须给被设为非空的列指定值。

　　范例1： 非空约束。
``` sql
-- 非空约束，在列的类型的后面，跟着“not null”
CREATE TABLE Student(
     Sid    number(20)  primary key,
     Name   varchar(20) unique,
     age    number(3)   not null,
     Sex    varchar(2) default ('男') ,
CONSTRAINT Student_age_sex_ck  
CHECK( age between 20 and 130) , CHECK (sex in(’男’,’女’))
);
```

　　**外键约束**

　　所谓的外键约束，就是在向A表中插入数据时，会先去B表判断一些数据是否存在。如果存在，则DBMS才允许新数据插入到数据库中。

　　假设我们现在有3张表：Student(学生表)、Course(课程表)、grade(分数表)。
``` sql
-- 学生表
CREATE TABLE Student(
    Sid   number(6) primary key,
    Name varchar(8) not null
);
-- 课程表
CREATE TABLE Course(
    Cid    number(6)  primary key,
    Cname varchar(20) not null
);
-- 分数表
CREATE TABLE Grade(
    Sid     number(6) ,
    Cid    number(6),
    Score  number(3)  
);
```

　　一个学生选修一门课程，等到期末考试后，就会产生一个成绩。
　　正确的逻辑应该是，加入到Grade表中的记录的Sid、Cid必须得是已经存在于Student和Course表中，如果不存在，则就没必要加入了。

　　范例1： 外键约束。
``` sql
CREATE TABLE Grade(
    -- 列级外键约束，在列的类型的后面，跟着“REFERENCES”
    Sid     number(6)  REFERENCES Student(Sid),
    Cid    number(6),
    Score  number(3) ,
    -- 表级外键约束
    CONSTRAINT Course_Grade_cid_fk FOREIGN KEY(Cid)
             REFERENCES Course(Cid)
);

-- 此时我们称Grade表是子表，Student和Course表为父表。
-- 在子表中设置的外键在父表中必须是主键。 
-- 删除时应该先删除子表的数据，再删除父表的数据。
```
　　当父表的记录被子表引用的时候，删除主表记录时的三种情况：
>空值删除：就是允许用户删除主表中的记录，但是会将子表中引用了父表中记录的记录上的该字段的取值设置为null。
>级联删除：就是允许用户删除主表中的记录，但会将子表中引用此记录的所有记录一起删除。
>拒绝删除：就是不允许删除，在删除的时候会错误提示。

## 数据库编程 ##

　　使用常见的SQL语言无法完成复杂的业务，如循环、复杂判断等，因此在Oracle中提供了PL/SQL编程。

### PL/SQL基础 ###

　　PL/SQL(Procedure Language/SQL)是Oracle对SQL语言的过程化扩展，其在SQL命令语言中增加了过程处理语句(如分支、循环等)，使SQL语言具有过程处理能力。
>其实各种数据库都对SQL语言进行了过程化扩充，Oracle中的PL/SQL在SQLServer中叫做Transact-sql(简称T-SQL) 。

　　范例1： 程序结构。
``` sql
declare
  -- 变量声明部分。
begin
  -- 程序主体。
exception
  -- 异常处理语句
end;
/ -- 每一个pl/sql程序都是以一个“/”符结束。
```

　　范例2： 简单变量。
``` sql
-- 若程序中不定义变量，则可以不写declare关键字。
declare
  --  变量的定义格式：变量名 数据类型 := 默认值，可以不指定默认值。
  name varchar(10) := 'Oracle';
  age  number      :=  35;
  birthday date    := sysdate;
begin
  -- 使用此函数可以向控制台输出一行数据。
  -- 默认情况下，屏幕输出是被禁用的，可以通过set serveroutput on;命令来开启。
  dbms_output.put_line('姓名：'||name);
  -- 字符串连接需要使用‘||’符号
  dbms_output.put_line('年龄：'||age);
  dbms_output.put_line('生日：'||birthday);
end;
/
```

　　范例3： 变量赋值。
``` sql
declare
  name varchar(10);
  sal number;
begin
  -- 可以使用into关键字将SELECT查询语句返回的值赋给变量。
  SELECT ename,sal into name,sal from emp where empno=7788;
  dbms_output.put_line('姓名：'||name);
  dbms_output.put_line('工资：'||sal);
end;
/
```

　　范例4： 引用型变量。
``` sql
-- 所谓的引用型变量，变量的类型引用自其他表中的某一列的数据类型。
declare
  -- 类型是emp表中ename列的类型。
  name emp.ename%type;
  -- 类型是emp表中sal列的类型。
  sal emp.sal%type;
begin
  SELECT ename,sal into name,sal from emp where empno=7788;
  dbms_output.put_line('姓名：'||name);
  dbms_output.put_line('工资：'||sal);
end;
/
```

　　范例5： 记录型变量。
``` sql
-- 所谓的记录型变量，其实就是一个集合类型，它可以保存表的某一行数据。
declare
  ep emp%rowtype;
begin
  SELECT * into ep from emp where empno=7788;
  -- 通过ep来进一步访问行中的某一列的数据
  dbms_output.put_line('姓名：'||ep.ename);
  dbms_output.put_line('工资：'||ep.sal);
end;
/
```

　　范例6： 流程控制。
``` sql
-- IF语句
declare
  n varchar(10) := 1;
begin
  -- 在if和elsif之后，需要使用then关键字。
  if n=5 then dbms_output.put_line('优秀');
    elsif n=4 then dbms_output.put_line('良好');
    elsif n=3 then dbms_output.put_line('及格');
    else dbms_output.put_line('很差');
  -- IF语句的最后面必须要跟随下面的语句
  end if;
end;
/

-- 使用While语句可以进行循环操作，循环体放到loop与endloop之间。
declare
  i number:=1;
  len number :=10;
begin
  WHILE i<len 
  LOOP
     dbms_output.put_line(i);
     i:=i +1;
  END LOOP;
end;
/

-- for循环1
begin
  for i in 1..10
  loop
    dbms_output.put_line(i);
  end loop;
end;
/

-- for循环2
begin
  for i in (select * from emp)
  loop
    dbms_output.put_line('编号：'||i.empno||'姓名：'||i.ename);
  end loop;
end;
/

-- 另一种循环
declare 
  i number:=1;
begin
loop
  dbms_output.put_line('OK');
  -- 当i>5的时候结束循环 
  exit when i>5;
  i := i + 1;
  exit when i=5;
end loop;
end;
/
```

　　范例7： 游标。
``` sql
declare
  --  游标用来保存一组记录型变量。
  cursor cr is select ename,sal from emp;
  name  emp.ename%type;
  sal   emp.sal%type;
begin
    -- 打开游标。
    open cr;
      loop 
          -- 从光标中取出一行数据。 
          fetch cr into name,sal;
          -- 若没有娶到数据，则结束循环。
          exit when cr%notfound;
          -- 输出数据。
          dbms_output.put_line('姓名：'||name||' 工资：'||sal);
      end loop;
    -- 关闭游标。
    close cr;
end;
/

-- 带参数游标
-- 若游标包含参数，则参数可以在游标的名称后面书写，在子查询中可以直接使用游标的参数。
declare
   cursor c(empno number) is
     select ename,sal from emp where empno = empno;
   ename emp.ename%type;
   sal   emp.sal%type;
begin
  -- 打开游标并传递参数过去
  open c(7788);
    fetch c into ename,sal;
    dbms_output.put_line('姓名：'||ename||' 工资：'||sal);
  close c;
end;
/
```

　　范例8： 异常处理。
``` sql
-- Oracle 内置的系统异常：
-- No_data_found      没有找到数据。
-- Too_many_rows      select …into语句匹配多个行。
-- Zero_Divide        除数为零。
-- Value_error        算术或转换错误。
-- Timeout_on_resource   在等待资源时发生超时。

-- 在Oracle中若某行语句产生了异常，则程序流程会立刻放弃当前代码的执行。
-- 并跳转到exception块中匹配异常，因此本范例同一时间内只会抛出一种异常。
declare
 n number := 1;
begin
  dbms_output.put_line(to_number(sysdate));
  dbms_output.put_line(n/0);  
  exception 
    when zero_divide then   dbms_output.put_line('除数为0');  
    when value_error then   dbms_output.put_line('数据类型转换失败!');  
end;
/

-- 自定义异常
declare
  -- 定义一个exception类型的变量。
  excep exception;
  time date;
begin
  -- 通过raise关键字将异常抛出，然后在exception块中处理异常。
  if time is null then raise excep;
  end if;
  exception
     when excep then dbms_output.put_line('哼哼! NullPointException');
end;
/
```

### 触发器 ###

　　所谓的<font color='red'>触发器</font>，是一个与表相关联的`PL/SQL`程序。
　　即我们事先在一个表上添加一个触发器，当用户操作(`insert`、`update`、`delete`)这个表时，触发器就会做出相应的反应。触发器分为两类：<font color='red'>语句(表)级触发器</font>和<font color='red'>行级触发器</font>。
>语句级触发器：不论SQL语句影响了表中多少条记录，触发器只会被触发一次。
>行级触发器：Oracle会为每条受影响的记录触发一次触发器。

　　范例1： 触发器语法。
``` sql
-- 中括号内的内容是可以省写的。
create  [or replace] trigger  触发器名
-- 大括号内的内容是必写的。
-- 触发器根据触发的时间又可以分为：操作之前触发和操作之后触发，分别使用before和after关键字。
{before | after}
-- 使用delete、insert、update关键字来指定触发器在用户执行何种操作时触发。
{delete | insert | update [of 列名]} 
-- 使用on关键字指出触发器建立在哪张表中。
on  表名
[for each row [when(条件) ] ]
PLSQL 块
```

　　范例2： 插入数据。
``` sql
create or replace trigger test
-- 当用户向emp表中插入数据之时，会触发此触发器。
-- 若触发器被顺利执行完毕，则Oracle会将用户的数据插入到emp表中去。
-- 若触发器中抛出了异常，则Oracle不会将用户的数据插入到emp表中去。
before insert on emp
begin
  dbms_output.put_line('Oracle：爷,您来了! 您随便插入数据吧!');
  -- 使用raise_application_error来抛出一个异常，其内有两个参数：
  -- 第一个参数：错误码，取值在-20000 ~ -20999之间即可。
  -- 第二个参数：错误的信息。
  raise_application_error(-20000,'Oracle：哟，爷，您看，真不巧，没空间了！');
end;
/
```

# MySql数据库 #

　　MySQL是一个免费的中型的数据库，可以方便的建立数据库，很早以前MySQL 数据库就被Sun公司收购了，现在属于Oracle公司。

　　数据库结构图：

<center>
![](/img/base/base003_03.png)
</center>

　　MySQL就是一个DBMS，其内部存在有多个数据库，每个数据库中又存放多张表，用户的数据是存放在表中的，用户通过DBMS来获取数据。

## 数据库管理 ##

<br>　　范例1： 常用命令。
``` sql
-- 登录mysql。语法：mysql –u用户名 –p密码
mysql -uroot -pcxy

-- 创建一个名为Test的数据库
CREATE DATABASE Test;
-- 若Test不存在，则执行创建操作，否则不执行任何操作
CREATE DATABASE IF NOT EXISTS Test;
-- 指定数据库的编码
CREATE DATABASE Test CHARACTER SET utf8;

-- 列出服务器中所有数据库
show databases;
-- 删除数据库
drop database test;
```

## 数据类型 ##

<center>
![](/img/base/base003_04.png)
</center>

## 表管理 ##

<br>　　范例1： 常用命令。
``` sql
-- 创建表
create table  Person(
   id  int ,
   name  varchar (30),
   password varchar(30) 
);

-- 添加列
ALTER TABLE person ADD birthday date;

-- 查看表中所有列
DESC person;

-- 修改某一列
-- 修改时若表中已经存在数据，且新类型与原有类型不兼容，则无法修改成功。
-- 应该先将表中所有的数据删掉后，再修改列。
ALTER TABLE person MODIFY birthday int;

-- 删除列
ALTER TABLE person DROP birthday;

-- 修改表名
rename table person to student;

-- 查看当前数据库的所有表
show tables;

-- 插入一行数据，相应的更新、删除也都和Oracle一样
INSERT INTO Person(id,name) VALUES(1,'张三');
INSERT INTO Person(id,name) VALUES(1,'李四');
```

<br>　　范例2： 其它命令。
``` sql
-- 使用auto_increment来设置id的编号自动增长。
-- auto_increment需要使用在主键上。
create table  Person(
   id  int primary key auto_increment,
   name  varchar (30)
);

-- 限定查询
-- “limit 起点,个数”，起点的下标从0开始计算，起点可以省略，若省略则默认为0。
SELECT  *  FROM  Person  LIMIT 0,1
```


