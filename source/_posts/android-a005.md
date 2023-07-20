---
title:  第五章 多媒体篇
date: 2015-3-2 19:03:10
author: Cutler
categories: Android开发
---
# 第一节 音频 #

　　对于一部嵌入式设备来说，除了基础功能（通话、短信）外，最重要的可能就是多媒体了。那么一个最简单的问题，什么是多媒体呢？ 从字面上来看，这个术语对应的英文单词是`“Multi-Media”`，直译过来就是多媒体。

    简单的说，多媒体是各种形式的媒体（比如文本、音频、视频、图片、动画等等）的组合。

　　媒体篇将讲解如何在你的应用中增加视频，音频以及图片处理的相关技术。

## 基础概念 ##
　　在讲解如何使用Android提供的API进行录音之前，先介绍一些音频相关的基本概念。

　　声音（`sound`)是由物体振动产生的“声波”。
　　声音通过介质（空气或固体、液体）传播，然后被人或动物听觉器官所感知，最初发出振动（震动）的物体叫“声源”。

　　在计算机领域有两个常用的术语：模拟音频信号和数字音频信号。

    -  模拟音频信号(Analog Signal)：指自然界中的各种声音，我们通常又把模拟信号称为连续信号，它在一定的时间范围内可以有无限多个不同的取值。
    -  数字音频信号(Digital Signal)：指保存在计算机中的声音，由于模拟音频信号在一个时间范围内有无限多个取值，所以我们无法把自然界声音无损的保存到计算机中（计算机硬盘的存储容量有限），只能对声音进行采样处理，采样出来的声音只需要达到人耳分辨不出来的水平就可以了。
　　在电脑上录音的本质就是把自然界中的“模拟声音信号”转换成计算机所能表示的“数字音频信号”。反之，在播放时则是把“数字信号”还原成“模拟音频信号”输出。

<br>　　**音频的录制、存储与回放**

　　早期的音频信息是存储在录音带中的（以模拟信号的形式存储），而到了计算机时代这些音频数据必须通过一定的处理手段才可能存储到设备中，下面这个图很好地描述了音频从录制到播放的一系列操作流程：

<center>
![图片引用自维基百科](/img/android/android_5_1.png)
</center>

　　首先，音频采集设备（比如`Microphone`麦克风）捕获声音信息，初始数据是模拟信号。
　　然后，使用模-数转换器（`Analog to Digital Converter`）将模拟信号处理成计算机能接受的二进制数据，即数字信号。
　　此时数据可以根据需求进行必要的渲染处理（如音效调整、过滤等），处理后的音频数据理论上已经可以存储到计算机设备中了，比如硬盘、USB设备等等。不过由于这时的音频数据体积相对庞大，不利于保存和传输，通常还会对其进行压缩处理。比如我们常见的`mp3`音乐，实际上就是对原始数据采用相应的压缩算法后得到的。
　　另外，音视频的编解码既可以由纯软件完成，也同样可以借助于专门的硬件芯片来完成。

　　回放过程总体上是录制过程的逆向操作。
　　首先，从存储设备中取出相关文件，并根据录制过程采用的编码方式进行相应的解码，即将压缩后的数据还原成未压缩之前的状态。
　　然后，音频系统为这一播放实例选定最终匹配的音频回放设备。
　　接着，解码后的数据经过音频系统设计的路径传输。
　　接着，音频数据信号通过数模转换器(`Digital to Analog Converter`)变换成模拟信号。
　　最后，模拟信号经过回放设备，还原出原始声音。

## 音频采集 ##
　　声音信号是一种模拟信号，计算机要对它进行处理，必须将它转换为数字声音信号，即用二进制数字的编码形式来表示声音，这个转换的过程称为数字音频采集。

　　将模拟音频信号转换为数字音频信号通常要经过：`抽样`、`量化`，`编码`三个步骤。
<br>　　**抽样**
　　抽样也称为“采样”，由于声音其实是一种能量波，波是无限光滑的，波的弦线可以看成由无数点组成，由于存储空间是相对有限的，数字编码过程中，必须对弦线的点进行采样。
　　通俗的讲，采样频率是指计算机每秒钟采集多少个声音样本，是描述声音文件的音质、音调，衡量声卡、声音文件的质量标准，它用赫兹（`Hz`）来表示。
　　采样频率必须至少是信号中最大频率的两倍，否则就不能从信号采样中恢复原始信号。如果信号的频率是`100Hz`，那么为了避免混叠现象采样频率必须大于`200Hz`。人耳能够感觉到的最高频率为`20kHz(1kHz = 1000Hz)`，太高的频率就分辨不出好坏来，因此要满足人耳的听觉要求，则需要至少每秒进行`40k`次采样，用`40kHz`表达，这个`40kHz`就是采样率。

　　扩展问题：既然`20kHz`已经分辨不清楚，为什么还有`48kHz`的采样率?

<br>　　**量化**
　　量化就是把采样得到的样本（模拟量）转换为离散值（数字量）表示，因此量化的过程有时也被称为`A/D`转换（模数转换）。量化后的样本是用二进制数表示的，二进制数位的多少反映了度量声音波形幅度的精度，称为量化精度。例如若每个声音样本用`16`位表示，则声音样本的取值范围是`0~65535`，精度是`1/65536`。若每个声音样本用`8`位表示，则声音样本的取值范围是`0~255`，精度是`1/256`。
　　量化精度越高，声音的质量越好，需要的存储空间也越多。CD标准的量化精度是`16Bit`，DVD标准的量化精度是`24Bit`。

<br>　　**编码**
　　根据采样率和量化精度可以得知，相对自然界的信号，音频编码最多只能做到无限接近，至少目前的技术只能这样了，相对自然界的信号，任何数字音频编码方案都是有损的，因为无法完全还原。在计算机应用中，能够达到最高保真水平的就是`PCM`编码，被广泛用于素材保存及音乐欣赏，`CD`、`DVD`以及我们常见的`WAV`文件中均有应用。因此，`PCM`约定俗成了无损编码，因为`PCM`代表了数字音频中最佳的保真水准，并不意味着`PCM`就能够确保信号绝对保真，`PCM`也只能做到最大程度的无限接近。我们而习惯性的把`MP3`列入有损音频编码范畴，是相对`PCM`编码的。强调编码的相对性的有损和无损，是为了告诉大家，要做到真正的无损是困难的，就像用数字去表达圆周率，不管精度多高，也只是无限接近，而不是真正等于圆周率的值。
　　经过采样和量化后的声音信号已经是数字形式了，但是为了便于计算机的存储、处理、传输，还必须按照一定的要求进行数据压缩和编码。

　　为了更形象的解释为什么要对量化后的音乐进行压缩和编码，先介绍两个有关音频编码很重要的术语：“比特率”和“声道”。

<br>　　**比特率**
　　比特率是音频文件每秒占据的字节数（比特数），比特率规定使用“比特每秒”（`bit/s`或`bps`）为单位，`ps`指的是`/s`，即每秒。经常和国际单位制词头关联在一起，如“千”（`kbit/s`或`kbps`），“兆”（`Mbit/s`或`Mbps`），“吉”（`Gbit/s`或`Gbps`) 和“太”（`Tbit/s`或`Tbps`）。CD中的数字音乐比特率为`1411.2kbps`（也就是记录1秒钟的cd音乐，需要`1411.2×1000`比特的存储空间）。

<br>　　**声道**
　　一个声道(`AudioChannel`)，简单来讲就代表了一种独立的音频信号，所以双声道理论上就是两种独立音频信号的混合。具体而言，如果我们在录制声音时在不同空间位置放置两套采集设备（或者一套设备多个采集头），就可以录制两个声道的音频数据了。后期对采集到的声音进行回放时，通过与录制时相同数量的外放扬声器来分别播放各声道的音频，就可以尽可能还原出录制现场的真实声音了。

　　Monaural（单声道）：早期的音频录制是单声道的，它只记录一种音源，所以在处理上相对简单。播放时理论上也只要一个扬声器就可以了，即便有多个扬声器它们的信号源也是一样的，起不到很好的效果

　　Stereophonic（立体声）：之所以称为立体声，是因为人们可以感受到声音所产生的空间感，即大自然中的声音就是立体的。
　　为什么这么说呢？ 
　　我们知道，当音源发声后（比如你右前方有人在讲话），音频信号将分别先后到达人类的双耳。在这个场景中，是先传递到右耳然后左耳，并且右边的声音比左边稍强。这种细微的差别通过大脑处理后，我们就可以判断出声源的方位了。

　　这个原理现在被应用到了多种场合。在音乐会的录制现场，如果我们只使用单声道采集，那么后期回放时所有的音乐器材都会从一个点出来；反之，如果能把现场各方位的声音单独记录下来，并在播放时模拟当时的场景，那么就可以营造出音乐会的逼真氛围。
　　最基本的立体声是两声道：“左声道”、“右声道”，还有更多声道的“立体声”，也即环绕声，其中包括主要的左右声道，还有环绕的副声道左右，中置，单独低音等5-7个声道。

<br>**为什么要压缩?**
　　要算一个PCM音频流的码率是一件很轻松的事情，公式为：采样率×量化精度×声道数。如一个采样率为`44.1KHz`，采样大小为`16bit`，双声道的`PCM`编码的`WAV`文件，它的数据速率则为：
``` c
    44.1K × 16 × 2 = 1411.2Kbps
```
　　然后再将码率除以`8`，就可以得到这个`WAV`的数据速率，即`176.4KB/s`。
　　这表示存储一秒钟采样率为`44.1KHz`，采样大小为`16bit`，双声道的`PCM`编码的音频信号，需要`176.4KB`的空间，`1`分钟则约为`10.34M`。
　　显然，这对大部分用户是不可接受的，尤其是喜欢在电脑上听音乐的朋友，要降低磁盘占用，只有两种方法：

    -  降低采样指标。
    -  压缩。

　　降低指标是不可取的，因此专家们研发了各种压缩方案。
　　由于用途和针对的目标市场不一样，各种音频压缩编码所达到的音质和压缩比都不一样，有一点是可以肯定的，它们都压缩过。

## 开始录音 ##
　　在Android中有两种方法可以实现录音功能，使用`MediaRecorder`类和`AudioRecorder`类：

    -  MediaRecorder类十分简单好用，但是灵活性不足。
    -  AudioRecorder提供了更多的自由度，但是使用稍微会有点复杂，它们各自有对应的应用场景。

<br>**具体区别：**

　　首先，录音时输出的数据不同。

    -  MediaRecorder录制出来的是一个音频文件。该文件是经过压缩后的，即在录音之前需要为其设置编码方式等一系列参数，设置完毕后MediaRecorder类会依据参数值自动完成声音的收集、编码、压缩等步骤。
    -  AudioRecorder直接捕获到的是未经过任何处理的原始音频流，开发者可以实时随意处理音频流。

　　然后，对声音操作的自由度不同。
    -  MediaRecorder将录音的所有步骤都封装起来，只会输出一个声音文件。
    -  AudioRecorder可以实现边录边播（实现即时聊天功能）以及对音频的实时处理，如降噪，合成（如“会说话的汤姆猫”）。
       -  优点：语音的实时处理，可以用代码实现各种音频的封装。
       -  缺点：输出是PCM语音数据，如果保存成音频文件，是不能够直接播放的，必须另写代码对PCM数据编码和压缩。

### MediaRecorder ###
　　使用`MediaRecorder`类从设备捕捉音频的大体步骤： 

    1、创建一个新实例android.media.MediaRecorder。
    2、使用MediaRecorder.setAudioSource()设置音频源。
    3、使用MediaRecorder.setOutputFormat()设置输出文件格式。
    4、使用MediaRecorder.setOutputFile()设置输出文件名。
    5、使用MediaRecorder.setAudioEncoder()设置音频编码器。
    6、在MediaRecorder实例上调用MediaRecorder.prepare()。
    7、调用MediaRecorder.start()开始音频捕捉。
    8、调用MediaRecorder.stop()停止音频捕捉。
    9、录音完毕后调用MediaRecorder.release()方法释放资源。

<br>**音频源：**
　　音频源指从何处录制声音，通常会选择电话的“麦克风”，使用`MediaRecorder.AudioSource`类来表示可选的所有音频源。

　　范例1：`MediaRecorder.AudioSource`类。
```
MediaRecorder.AudioSource.MIC                    麦克风，即手机话筒
MediaRecorder.AudioSource.DEFAULT                默认情况下通常代表MIC
MediaRecorder.AudioSource.VOICE_CALL             Voice call uplink and downlink source
MediaRecorder.AudioSource.VOICE_DOWNLINK         Voice call downlink source
MediaRecorder.AudioSource.VOICE_UPLINK           Voice call uplink source
MediaRecorder.AudioSource.VOICE_RECOGNITION      Usually DEFAULT source 
```

<br>**文件格式：**
　　首先我们要知道的是，每个音频文件都有两部分：`文件格式`（也叫音频容器），`数据格式`（也叫音频编码）。`文件格式`描述了这个文件它自己的格式，而它里面的实际音频数据能使用很多不同的方式编码。例如，一个后缀为`caf`的文件是一种文件格式，它能够包含用`MP3`、`线性pcm`等其他许多格式编码的音频数据。
　　换句话说，文件格式就像是桶一样，里面可以装很多水，那些水就是那些`音频数据`。桶有很多种外形，也就是有很多种文件格式，而且不一样的桶，也需要装不同的水（石油桶用来装石油）。`caf`这种桶就可以装各种各样的水，不过有些桶就只能装几种类型的水。

　　使用`MediaRecorder`类的`setOutputFormat()`方法可以设置录音时，输出的音频文件的格式。
　　使用`MediaRecorder.OutputFormat`类来表示可选的音频文件格式。
<br>　　范例2：`MediaRecorder.OutputFormat`类。
```
MediaRecorder.OutputFormat.AMR_NB               API Level 10
MediaRecorder.OutputFormat.AMR_WB               API Level 10
MediaRecorder.OutputFormat.DEFAULT              API Level 1
MediaRecorder.OutputFormat.MPEG_4               API Level 1
MediaRecorder.OutputFormat.RAW_AMR              API Level 3 
MediaRecorder.OutputFormat.THREE_GPP            API Level 1
MediaRecorder.OutputFormat.AAC_ADTS             API Level 16
```

<br>　　**AMR**
　　`AMR`(`Adaptive multi-Rate`简称自适应多速率音频编码) 它即是一种音频编码格式也是一种文件格式。
　　`AMR`编码压缩比非常高，但是音质比较差，主要用于语音类的音频压缩，效果还是很不错的，不适合对音质要求较高的音乐、歌曲类音频的压缩。
　　现在很多智能手机都支持多媒体功能，特别是音频和视频播放功能，而`AMR`文件格式是手机端普遍支持的音频文件格式。 
　　`AMR`文件就是存储`AMR`语音编码的音频文件。
　　很多手机允许你存储短时间的`AMR`格式录音，在开源和商业软件有和其他格式转换的程序，例如`MP3`，但是要记住`AMR`并不是理想的记录声音的方式。`AMR`文件扩展名是`.amr`。
　　`AMR`被标准语音编码`3GPP`在`1998年10月`选用，现在广泛在`GSM`和`UMTS`中使用。它使用`1-8`个不同的位速编码。
　　`AMR`又称为`AMR-NB`，即窄带自适应多速率，还有另一种`AMR-WB`宽带自适应多速率。

<br>　　**RAW_AMR**
　　此常量与`AMR_NB`等价，在`API Level 16`中已经不推荐使用，改用`AMR_NB`代替。

<br>　　**THREE_GPP**
　　即`.3gp`格式的文件，通常是以视频文件的形式展现。
　　`3GP`是一种多媒体储存格式，由`Third Generation Partnership Project（3GPP）`定义的，`MPEG-4 Part 14（MP4）`的一种简化版本，减少了储存空间和较低的带宽需求，主要用于`3G`手机上，让手机上有限的储存空间可以使用。 
　　`3GP`档案影像的部份可以用`MPEG-4 Part 2、H.263`或`MPEG-4 Part 10 (AVC/H.264)`等格式来储存，声音的部份则支援`AMR-NB`、`AMR-WB`、`AMR-WB+`、`AAC-LC`或`HE-AAC`来当作声音的编码。目前`3GP`档案有两种不同的标准：

    -  3GPP（针对GSM手机，副档名为.3gp）
    -  3GPP2（针对CDMA手机，副档名为.3g2）
　　这两种格式影像方面都采用`MPEG-4`及`H.263`，而声音则采用`AAC`或`AMR`标准。

　　3GP格式视频有两种分辨率：

    1、分辨率176×144，适合市面上所有支持3GP格式的手机。
    2、分辨率320×240，清晰，适合高档手机、MP4播放器、PSP以及苹果iPod.

<br>　　**AAC**
　　`AAC(Advanced Audio Coding简称高级音频编码)`基于`MPEG-2`的音频编码技术。目的是取代`MP3`格式。
　　`2000`年，`MPEG-4`标准出现后，`AAC`重新集成了其特性，加入了`SBR`技术和`PS`技术，为了区别于传统的`MPEG-2 AAC`又称为`MPEG-4 AAC`。
　　作为一种高压缩比的音频压缩算法，AAC压缩比通常为`18：1`，也有数据说为`20：1`，远胜`mp3`；在音质方面，由于采用多声道，和使用低复杂性的描述方式，使其比几乎所有的传统编码方式在同规格的情况下更胜一筹。
　　但是`AAC`在Android的`API Level 16`以后才支持的。
　　注：视频文件也同样区分文件格式和编码格式

<br>**数据格式（音频编码格式）：**
<br>　　使用`MediaRecorder`类的`setAudioEncoder()`方法可以设置录音时所要使用的音频编码格式。
<br>　　范例3：`MediaRecorder.AudioEncoder`类。
```
MediaRecorder.AudioEncoder.AAC                   API Level 10
MediaRecorder.AudioEncoder.AAC_ELD               API Level 16
MediaRecorder.AudioEncoder.AMR_NB                API Level 1
MediaRecorder.AudioEncoder.AMR_WB                API Level 10
MediaRecorder.AudioEncoder.DEFAULT               API Level 1
MediaRecorder.AudioEncoder.HE_ACC                API Level 16
```

<br>　　范例1：MediaRecorder简单应用。
``` java
// 录音时需要注册如下权限：
// <uses-permission android:name="android.permission.RECORD_AUDIO" />
// 此权限是一项“危险”的权限，因为它可能会对用户的隐私构成威胁。
// 从 Android 6.0（API 级别 23）开始，使用危险权限的应用在运行时必须请求用户的批准。

// 注意：在搭载 Android 9（API 级别 28）或更高版本的设备上，
// 在后台运行的应用将无法访问麦克风。因此，您的应用只在以下两种情况下才应录制音频：
// 当其位于前台时或者您在前台服务中添加了 MediaRecorder 实例时。
import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import java.io.IOException;

public class AudioRecordTest extends AppCompatActivity {

    private static final String LOG_TAG = "AudioRecordTest";
    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
    private static String fileName = null;

    private RecordButton recordButton = null;
    private MediaRecorder recorder = null;

    private PlayButton   playButton = null;
    private MediaPlayer   player = null;

    // Requesting permission to RECORD_AUDIO
    private boolean permissionToRecordAccepted = false;
    private String [] permissions = {Manifest.permission.RECORD_AUDIO};

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode){
            case REQUEST_RECORD_AUDIO_PERMISSION:
                permissionToRecordAccepted  = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                break;
        }
        if (!permissionToRecordAccepted ) finish();

    }

    private void onRecord(boolean start) {
        if (start) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    private void onPlay(boolean start) {
        if (start) {
            startPlaying();
        } else {
            stopPlaying();
        }
    }

    private void startPlaying() {
        player = new MediaPlayer();
        try {
            player.setDataSource(fileName);
            player.prepare();
            player.start();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        }
    }

    private void stopPlaying() {
        player.release();
        player = null;
    }

    private void startRecording() {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setOutputFile(fileName);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        try {
            recorder.prepare();
        } catch (IOException e) {
            Log.e(LOG_TAG, "prepare() failed");
        }

        recorder.start();
    }

    private void stopRecording() {
        recorder.stop();
        recorder.release();
        recorder = null;
    }

    class RecordButton extends Button {
        boolean mStartRecording = true;

        OnClickListener clicker = new OnClickListener() {
            public void onClick(View v) {
                onRecord(mStartRecording);
                if (mStartRecording) {
                    setText("Stop recording");
                } else {
                    setText("Start recording");
                }
                mStartRecording = !mStartRecording;
            }
        };

        public RecordButton(Context ctx) {
            super(ctx);
            setText("Start recording");
            setOnClickListener(clicker);
        }
    }

    class PlayButton extends Button {
        boolean mStartPlaying = true;

        OnClickListener clicker = new OnClickListener() {
            public void onClick(View v) {
                onPlay(mStartPlaying);
                if (mStartPlaying) {
                    setText("Stop playing");
                } else {
                    setText("Start playing");
                }
                mStartPlaying = !mStartPlaying;
            }
        };

        public PlayButton(Context ctx) {
            super(ctx);
            setText("Start playing");
            setOnClickListener(clicker);
        }
    }

    @Override
    public void onCreate(Bundle icicle) {
        super.onCreate(icicle);

        // Record to the external cache directory for visibility
        fileName = getExternalCacheDir().getAbsolutePath();
        fileName += "/audiorecordtest.3gp";

        ActivityCompat.requestPermissions(this, permissions, REQUEST_RECORD_AUDIO_PERMISSION);

        LinearLayout ll = new LinearLayout(this);
        recordButton = new RecordButton(this);
        ll.addView(recordButton,
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        0));
        playButton = new PlayButton(this);
        ll.addView(playButton,
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        0));
        setContentView(ll);
    }

    @Override
    public void onStop() {
        super.onStop();
        if (recorder != null) {
            recorder.release();
            recorder = null;
        }

        if (player != null) {
            player.release();
            player = null;
        }
    }
}

```

### AudioRecord ###
　　刚刚介绍了如何使用`MediaRecorder`类来进行录音，该类十分容易使用并且可以简单快速的进行录音，同时也可以将音频压缩存储为`mpeg4`或者`3gpp`格式的。但是如果你需要原始数据，做一些音频处理，则就无法使用`MediaRecorder`类来完成了。`AudioRecord`类则可以输出未压缩的原始音频流，你可以将音频流写入到一个文件，保存为`wav`格式等。

<br>　　使用`AudioRecord`类记录音频的步骤如下： 

    1、创建一个android.media.AudioRecord类的实例。
    2、使用AudioRecord.startRecording()方法开始录音。
    3、使用AudioRecord.read()方法读取录到的原始音频流。
    4、使用AudioRecord.stop()方法停止录音。

<br>　　范例1：`AudioRecord`类构造方法。
```
//  第一个参数：指定音频源，取值可以是MediaRecorder.AudioSource类定义的常量。
//  第二个参数：设置采样率，单位Hz，44100Hz是唯一可以在所有设备上正常工作的。
//             但是也有其他采样率如22050，16000和11025可以在某些设备上工作。
//  第三个参数：设置声道数。取值为：AudioFormat.CHANNEL_IN_MONO 和 AudioFormat.CHANNEL_IN_STEREO。
//             前者通常可以在所有设备上正常工作。
//  第四个参数：设置音频的编码格式。取值为：AudioFormat.ENCODING_PCM_16BIT 和 AudioFormat.ENCODING_PCM_8BIT。
//  第五个参数：设置录音时，用于保存录出来的音频数据的buffer大小。
//             如果你不知道如何设置缓冲区大小，则可以调用getMinBufferSize(int, int, int)方法来计算。
//             该方法中的三个参数的含义和此构造方法的参数完全相同。
public AudioRecord(int audioSource,int sampleRateInHz,int channelConfig,int audioFormat,int bufferSizeInBytes)
```

<br>**本节参考阅读：**
- [www.androiddevblog.net（链接已失效）](http://www.androiddevblog.net/android/android-audio-recording-part-2) 
- [http://developer.android.com/intl/zh-CN/reference/android/media/AudioRecord.html](http://developer.android.com/intl/zh-CN/reference/android/media/AudioRecord.html) 

# 第二节 图片 #
## 基础常识 ##

　　在日常开发中，我们经常接触到的图像一般分为“位图”和“矢量图”两大类。

　　不过在开始介绍它们之前，我们先来思考一个问题：现实中的图像是如何被存储到电脑中的？

### 图像的数字化 ###

　　我们都知道在计算机的世界里只有0和1，因此如果要在计算机中处理图像，必须先把现实世界里的东西（照片、图纸等）转变成计算机能够接受格式，然后才能进行处理。

　　转化图像主要有三个步骤：采样、量化与压缩编码。

<br>　　**采样**

>采样阶段，主要是把一副现实世界的图像，在水平和垂直方向上等间距地分割成矩形网格，每个网格记录不同的颜色，最终一副现实中图像就被采样成有限个网格构成的集合。

　　如下图所示，左图是要采样的物体，右图是采样后的图像。

<center>
![最小内存示意图](/img/android/android_media_002_001.jpg)
</center>

　　从上图可以看出来，网格的数量越多，图片的还原度就越高，看起来也就越真实。

<br>　　**量化**

>量化阶段，主要是确定图像里的每个网格，应该占多少字节。

　　具体来说，计算机会为图像选择合适的<font color='red'> “色彩模型” </font>和<font color='red'> “色彩空间” </font>，确定了这两者也就确定了每个网格该占多少字节。

　　色彩模型（Color Model）是一种抽象数学模型，通过一组数值来描述颜色。常见的模型有：

    -  RGB模型：规定红、绿、蓝 3 个分量描述一个颜色。
    -  CMYK模型（主要在印刷行业使用）：规定青色（Cyan）、品红色（Magenta）、黄色（Yellow）、黑色（Black）4个分量描述一个颜色。

　　色彩空间（Color Space）是色彩模型的具体实现:

    色彩模型和色彩空间之间的关系，就和Java中的接口与实现类的关系一样，前者通过抽象方法来定义各类规范，后者负责具体的实现。
    
    比如你知道(255,0,0)是红色，但是并不知道这个红用的色值是多少，更不知道从0-255每一级红色差了多少。
    比如使用RGB色彩模型的sRGB色彩空间最大红色的定义就是CIE XYZ: 0.4360657, 0.2224884, 0.013916。

　　也就是说，RGB色彩模型下面会有多个色彩空间，它们对颜色有各自的定义。

　　常见的色彩空间有：AdobeRGB、sRGB等，其中sRGB能表示的颜色数量要比AdobeRGB少。

<br>　　**压缩**

　　图像量化完毕之后，我们就得到了一个数字化的图像了，但是图像的体积会非常大，不利于存储和传输，所以还需要对图像进行编码压缩。

　　图像数据之所以能被压缩，就是因为数据中存在着冗余。像数据的冗余主要表现为：

>图像中相邻像素间的相关性引起的空间冗余；
图像序列中不同帧之间存在相关性引起的时间冗余；
不同彩色平面或频谱带的相关性引起的频谱冗余。

　　图像压缩分为 <font color='red'>有损数据压缩</font> 和 <font color='red'>无损数据压缩</font> 两种，后者不会让图片失真。

　　**无损图像压缩**

>比如说，如果一张图像里只有蓝天，那么我们只需要记录蓝天的起始点和终结点就可以了，但是事实不会这么简单，因为蓝色可能还会有不同的深浅，天空有时也可能被树木、山峰等对象掩盖，这些就需要另外记录。
>
>从本质上看，无损压缩就是通过删除一些重复数据，来减少图像在磁盘上的体积。因而他可以完全恢复原始数据而不引起任何失真，但压缩率比较低。

　　**有损图像压缩**

>有损压缩图像的特点是保持颜色的逐渐变化，删除图像中颜色的突然变化。
>生物学中的大量实验证明，人类大脑会使用最接近的颜色来填补所丢失的颜色，简称脑补。例如，对于蓝色天空背景上的一朵白云，有损压缩的方法就是删除图像中景物边缘的某些颜色部分。当在屏幕上看这幅图时，人类的大脑会利用在景物上看到的颜色填补所丢失的颜色部分。
>
>从本质上看，有损压缩是利用了人眼对图像中某些成分不敏感的特性来实现的。允许压缩过程中损失一定的信息；虽然展示的时候不能完全恢复原始数据，但是所损失的部分对理解原始图像的影响缩小，却换来了大得多的压缩比。

### 位图 ###

<br>　　位图图像（bitmap），亦称为<font color='red'>点阵图像</font>或<font color='red'>栅格图像</font>，是一个M行N列的点组成的一个矩阵，矩阵每个元素都是一个网格，每个网格都用来表示一个颜色，这个网格被称为像素点。

　　对于位图来说，它常见的颜色模型有：RGB、CMYK。

　　特点：一张位图中的每个像素点所能表示的颜色越多，整张位图的色彩就越丰富。像素点所能显示的颜色的数量被称为位深。

>根据位深度，可将位图分为1、4、8、16、24及32位图像等规格。
比如位深为1的位图，它里面的每个像素点只能表示2^1个颜色，即只能表示黑白两色，其它以此类推。

    -  我们知道任何颜色可以由R、G、B三基色混合而成，因此如果一个位图的位深是16的话，那么通常会让R占5位、G占6位、B占5位，因为效果好。Android中位图每个像素点的RGB占多少位是有规定的，常见的取值有：ALPHA_8、ARGB_4444（A表示透明度）、ARGB_8888、RGB_565。
    -  位图的尺寸（分辨率）越大，其所包含的像素点就越多，图就越细腻、清晰，相应的图片的体积就越大。

<br>　　**位图常见文件格式**

| 文件类型 | 后缀名 | 透明通道 | 特点 |
| -------- | -------- | -------- | -------- |
| JPEG  | .jpg 或 .jpeg | 不支持 | 有损压缩，体积小，应用广泛 |
| PNG-8  | .png | 索引透明：完全透明或全不透明<br>Alpha透明：带过渡的透明 | 无损压缩。<br>像素点保存的不是颜色信息，而是从图像中挑选出来的具有代表性的颜色编号，每一编号对应一种颜色。<br>一张图最多支持256个编号。 |
| PNG-24  | .png | 不支持 | 无损压缩，体积比png8大 |
| PNG-32  | .png | 支持0~255级透明度 | 无损压缩，体积比png24大 |

### 矢量图 ###

　　矢量图形是用点、直线或者多边形等几何图元表示的图像。矢量图形与使用像素表示图像的位图不同，<font color='red'>它只会保存图形的相关信息</font>。

　　假设现在有一张图像，它里面只有一个圆形，如果用位图存储的话，就需要记录圆形的尺寸以及图像里每个像素点的信息。

　　如果要用矢量图的话，我们就只保存圆的半径r、圆心坐标、轮廓样式与颜色、填充样式与颜色等几个信息在图片文件中就好了，当需要显示图片时，就用程序把文件加载到内存，然后解析各个参数，最后执行绘制操作。

<br>　　**矢量图的特点**

>1、矢量图文件的体积与分辨率和图像大小无关，只与图像的复杂程度有关。
>2、矢量图可以无限缩放，对它进行缩放，旋转或变形操作时，图形不会产生锯齿效果，边缘会非常顺滑。
>3、矢量图难以表现色彩层次丰富的逼真图像效果，因为颜色丰富的图可能每个点的颜色都不一样，这种场景下位图比矢量图更适合。
>4、矢量图只能靠软件生成。

<br>　　**SVG图片**

　　SVG全称是Scalable Vector Graphics（可缩放矢量图形），它是一种被广泛应用的矢量图，我们Android研发也经常能接触到，下面来创建一个SVG图片体验一下。

　　范例1：画一个红色的矩形。
``` xml
<svg width="48" height="48" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="48" height="48" fill="#FF0000"/>
</svg>
```
    语句解释：
    -  SVG图片的内容使用XML文件来记录，且必须用svg标签做为根节点。
    -  目前各大浏览器都支持svg文件，所以直接拖当浏览器中就可以查看效果。

　　提示：大家可以去 [W3C](http://www.w3school.com.cn/svg/) 和 [mozilla](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial) 中学习SVG的基础语法，笔者就不冗述了。

<br>**本节参考阅读：**
- [维基百科 - 色彩空间](https://zh.wikipedia.org/wiki/%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%96%93)
- [百度百科 - CMYK](https://baike.baidu.com/item/CMYK)
- [百度百科 - 图像数字化](https://baike.baidu.com/item/%E5%9B%BE%E5%83%8F%E6%95%B0%E5%AD%97%E5%8C%96)
- [知乎 - 色彩空间与色彩模型的本质区别是什么？](https://www.zhihu.com/question/38303244/answer/77581900)
- [百度百科 - PNG](https://baike.baidu.com/item/png)
- [维基百科 - 矢量图](https://zh.wikipedia.org/zh-cn/%E7%9F%A2%E9%87%8F%E5%9B%BE%E5%BD%A2)
- [维基百科 - 位图](https://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE)
- [百度百科 - 矢量图](http://baike.baidu.com/view/138039.htm)

## Android中的图片处理 ##

### 进程的内存限制 ###

　　移动设备通常都只有有限的系统资源，Android设备是允许多个同时进程存在的，为了保证手机内存不被某个进程独占，系统会为每个进程设置“最小内存”和“最大内存”。

　　**最小内存限制** 

　　不同的Android版本，虚拟机所分配的内存大小是不同的，在各个版本的[《Android兼容性定义文档》](https://source.android.google.cn/compatibility/cdd)的3.7章节中，给出了不同尺寸和密度的手机屏幕下应用程序所需的最小内存。如：

>Android2.2中，对于中等或者低密度的屏幕尺寸，虚拟机必须为每个应用程序分配至少16MB的内存。
>Android8.1中，内存分配的情况如下图所示。


<center>
![最小内存示意图](/img/android/android_e02_1.png)
</center>

　　注意：上述的内存值被认为是最小值，在很多设备中可能会为每个应用程序分配更多的内存。

　　**最大内存限制** 

　　如果你想知道设备的单个进程最大内存的限制是多少，并根据这个值来估算自己应用的缓存大小应该限制在什么样一个水平，你可以使用`ActivityManager#getMemoryClass()`来获得一个单位为MB的整数值，一般来说最低不少于16MB，对于现在的设备而言这个值会越来越大，32MB，128MB甚至更大。

    -  需要知道的是，就算设备的单进程最大允许是128M，操作系统也不会在进程刚启动就给它128M，而是随着进程不断的有需求是才不断的分配，直到进程达到阀值（128M），系统就会抛出OOM。


### 图片的加载 ###

　　图像会有各种各样的尺寸，在很多情况下，图片的实际尺寸往往会比UI界面的显示尺寸更大。例如，使用Android设备的摄像头拍摄的照片，照片的分辨率往往要远高于设备的屏幕分辨率。

　　考虑到手机内存有限，在需要显示图片时理想的做法是，程序会先将大分辨率的图片缩小到与UI组件相同的尺寸后，再将它加载到内存中来。因为一张比UI组件尺寸大的高分辨率的图片并不能带给你任何可见的好处，却要占据着宝贵的内存，以及间接导致由于动态缩放引起额外的性能开销。

<br>　　范例1：使用`BitmapFactory`所提供的如下几个方法，可以将图片加载到内存中。
``` java
public static Bitmap decodeFile(String pathName, BitmapFactory.Options ops);
public static Bitmap decodeResource(Resources res, int id, BitmapFactory.Options ops);
public static Bitmap decodeByteArray(byte[] data, int offset, int length, BitmapFactory.Options ops);
```
    语句解释：
    -  使用这些方法加载图片的时候，若设置BitmapFactory.Options类的inJustDecodeBounds属性为true，则BitmapFactory不会加载图片的真正数据，即这些方法的返回值对象为null。
    -  但是却会将图片的实际宽度、高度、类型设置到outWidth，outHeight和outMimeType属性中。
    -  这项技术允许你在创建Bitmap（并分配内存）之前读取图片的尺寸和类型。

<br>　　范例2：加载图片尺寸。
``` java
public void loadSize(){
    BitmapFactory.Options options = new BitmapFactory.Options();
    // options.inJustDecodeBounds标识是否仅获取图片的尺寸信息。
    // 若值为true则BitmapFactory不会加载图片，只是获取图片的尺寸信息。
    options.inJustDecodeBounds = true;
    BitmapFactory.decodeResource(getResources(), R.id.myimage, options);

    // 当inJustDecodeBounds为true且图片的尺寸加载完毕后，图片的高度会保存在options.outHeight中。
    int imageHeight = options.outHeight;

    // 图片的宽度会保存在options.outWidth中。
    int imageWidth = options.outWidth;
}
```

<br>　　现在图片的尺寸已经知道了，为了告诉解码器如何对图像进行采样，加载更小版本的图片，需要为`BitmapFactory.Options`对象中的`inSampleSize`属性设置值。

    -  inSampleSize表示图片的缩放倍数。
       -  若inSampleSize > 1则执行缩小操作，返回的图片是原来 1/inSampleSize 。
       -  若inSampleSize <= 1则结果与1相同。

　　例如一张分辨率为`2048*1536px`的图像，假设`Bitmap`配置为`ARGB_8888`，整张图片加载的话需要`12M`。

    -  2024*1536个像素点 * 每个像素点使用4字节表示 /1024/1024 = 12MB
    -  ARGB4_8888，即每个像素中A、R、G、B的色值各使用1字节(0~255)来表示。
　　若使用`inSampleSize`值为`4`的设置来解码，产生的`Bitmap`大小约为`512*384px`，相较于完整图片占用`12M`的内存，这种方式只需`0.75M`内存。

<br>　　范例3：完整范例。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ImageView img = (ImageView) findViewById(R.id.img);
        Bitmap bm = decodeSampledBitmapFromResource(getResources(),R.drawable. img,200,200);
        img.setImageBitmap(bm);
    }

    public static Bitmap decodeSampledBitmapFromResource(Resources res, int resId, int reqWidth, int reqHeight){
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeResource(res, resId, options);
        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
        options.inJustDecodeBounds = false;
        return BitmapFactory.decodeResource(res, resId, options);
    }

    public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;
        if (height > reqHeight || width > reqWidth) {
            if (width > height) {
                inSampleSize = Math.round((float) height / (float) reqHeight);
            } else {
                inSampleSize = Math.round((float) width / (float) reqWidth);
            }
        }
        return inSampleSize;
    }
}
```
    语句解释：
    -  值得注意的是，ImageView在默认情况下会自动帮助我们缩放图片，从而使该图片的内容可以全部显示在ImageView中。 
    -  但是它仅仅是将显示的内容缩放了，却并不会将图片的容量也给缩小。
    -  换句话说ImageView的缩放是在图片加载入内存之后进行的，而本范例则是在图片加载之前执行的。
    -  使用2的次幂来设置inSampleSize值可以使解码器执行地更加迅速、更加高效。

<br>**本节参考阅读：**
- [【Google官方教程】第一课：高效地加载大Bitmap(位图)](http://my.oschina.net/ryanhoo/blog/88242) 

### 图片的缓存 ###
　　不论是Android还是iOS设备，流量对用户来说都是一种宝贵的资源，所以开发时都尽可能的少消耗用户的流量，为此就需要对网络上的图片进行缓存。

　　目前比较常见的图片缓存策略是三级缓存：

    -  首先，由于将图片从磁盘读到内存也是需要时间的，所以我们会把一些频繁被使用到的图片缓存再内存中，这样能进一步减少图片加载的时间。
       -  此乃第一级缓存，使用LruCache类实现。
    -  然后，由于内存的大小是有限制的，所以不能在内存中缓存太多图片，当内存缓存达到一定值时，就需要将一些图片从一级缓存中删除。并把这些被删除的图片放入到软引用中，这样既能缓存又不阻止内存回收。
       -  此乃第二级缓存，使用LinkedHashMap类实现。
    -  最后，当需要显示一张图片时，我们会从服务其端下载它，完成后将它保存到本地，以后就不用重新下载了。
       -  此乃第三级缓存，使用DiskLruCache类实现。

　　当需要加载图片时，会执行如下步骤：

    -  首先，从一级缓存中查看，若找到了则直接显示，若没找到则查看二级缓存。
    -  然后，若在二级缓存中找到了，则直接显示，并将该图片从二级缓存移动到一级缓存中。
    -  接着，若在二级缓存中也没找到，则去三级缓存中找（本地磁盘），若没找到则去服务器端下载，下载完后缓存到本地。
    -  最后，若在三级缓存中找到了，则将图片读取内存显示，并放入到一级缓存中。

#### LruCache ####
　　我们来看一下，实现第一级缓存所需要使用的`LruCache`类。

　　`LruCache`是Android3.1中所提供的一个工具类，通过support-v4兼容包也可以使用它。
　　`LruCache`的特点有：

    -  第一，实现原理基于LRU算法，这种算法的核心思想为：当缓存快满时，会将近期最少使用的数据从缓存中删除。
    -  第二，它内部采用LinkedHashMap以强引用的方式存储数据。

<br>　　`LruCache`的使用也很简单，这里给出一个范例：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 下面这个LruCache中保存的数据，key是String类型的，value是Integer类型的。
        // 构造方法里的数字3，表示当前LruCache的缓存容量是3。
        LruCache<String, Integer> lruCache = new LruCache<String, Integer>(3) {
            // 当需要计算某个数据所占据的大小时，此方法被调用。
            protected int sizeOf(String key, Integer value) {
                // 这里总是返回1，也就意味着当前LruCache中最多只能保存3个数字。
                return 1;
            }
        };
        // 向缓存中添加数据。
        lruCache.put("1", 100);
        lruCache.put("2", 200);
        lruCache.put("3", 300);
        // 调用get方法从lruCache中读取数据，由于没存储过4，所以会输出：null。
        System.out.println(lruCache.get("4"));

        // System.out.println(lruCache.get("1"));

        // 由于咱们这个lruCache只能保存3个数据，所以当保存第四个数的时候，就会把数字1给踢出。
        lruCache.put("4", 400);

        // 由于数字1被踢出了，所以此处会输出：null。
        System.out.println(lruCache.get("1"));

    }
}
```
    语句解释：
    -  上面之所以会踢出1，是因为在1、2、3三个数字中，1最久没被使用过。
    -  如果把上面第23行代码给解除注释，则当4被加入到缓存中时，被踢出的将是2。
    -  LruCache类还有一些有用的方法：evictAll（清空数据）、size（当前容量）、remove（删除）等等。

<br>　　`LruCache`虽然简单，但是我们不能满足于只会用它，还应该知道它的内部原理。
　　`LruCache`内部是通过`LinkedHashMap`类来实现的，既然说到了`LinkedHashMap`，下面就来介绍一下`HashMap`类。

<br>**HashMap**
　　在`Map`接口的众多子类中，比较常用的是`HashMap`类，在它的内部是使用数组来存储每一个元素的，虽然是基于数组实现，但它却可以高速存取元素。

    -  原因就是HashMap的内部在查找元素的时候，并不是从数组头部依次遍历匹配。
    -  而是依据key的hashCode值来计算出一个下标，查找时会从这个下标开始依次查找。

<br>　　范例1：`HashMap`的`get`方法。
``` java
public V put(K key, V value) {
    if (key == null) {
        return putValueForNullKey(value);
    }

    int hash = Collections.secondaryHash(key);
    HashMapEntry<K, V>[] tab = table;
    int index = hash & (tab.length - 1);
    for (HashMapEntry<K, V> e = tab[index]; e != null; e = e.next) {
        if (e.hash == hash && key.equals(e.key)) {
            preModify(e);
            V oldValue = e.value;
            e.value = value;
            return oldValue;
        }
    }

    // No entry for (non-null) key is present; create one
    modCount++;
    if (size++ > threshold) {
        tab = doubleCapacity();
        index = hash & (tab.length - 1);
    }
    addNewEntry(key, value, hash, index);
    return null;
}
```
    语句解释：
    -  在此方法中若参数key不为null，则会先计算key的hashCode码，然后从对应的位置开始依次遍历余下的元素。

<br>　　问：对象的`hashCode`码不是唯一的吗？ 为什么在得到`hashCode`码还会存在`“依次遍历余下的元素”`这个操作呢？
　　答：`hashCode`码并不是唯一的，比如下面的代码：
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        HashMap<A, Integer> hashMap = new HashMap<A, Integer>();
        hashMap.put(new A(), 5);
        hashMap.put(new A(), 6);
        System.out.println(hashMap.size());   // 输出2。
    }

    class A {
        public int hashCode() {
            return 1;
        }
    }
}

```
    语句解释：
    -  也就是说，两个完全不同的对象，它们的hashCode码却可能相同。

<br>**查找算法**
　　笔者在此简单的普及一下数据结构中的`“查找”`算法的基本概念（没错，纯粹是为了装逼！）。

　　有n条记录的集合`T`是实施查找的数据基础，`T`称为“查找表”（`Search Table`）。

    -  比如在集合{1,2,3}中查找出数字2，则“集合{1,2,3}”被称为查找表。

　　常见的查找算法有`顺序查找`、`折半查找`、`索引表查找`、`二叉查找树查找`等：

    -  所谓的顺序查找，即从查找表的第一个元素开始，依次使用待查找的数字和查找表中的每一个元素进行比较，若匹配则视为查找成功。
    -  但不论是顺序查找还是折半、索引表等查找算法，它们的查找效率都与查找表的长度紧密相关，查找表的长度越短，查找的速度也就越快。查找的理想做法是不去或很少进行匹配，因此就出现了另一种高速查找的算法，哈希（也称散列）查找。
    -  哈希查找算法就是通过一个公式（被称为散列函数）来计算元素的位置，从而尽可能的减少匹配次数。
    -  HashMap、HashSet等类都是基于哈希算法的，它们之所以可以高速的定位元素的位置，就是因为它们是通过即散列函数来计算出元素的位置的。
　　散列函数通常是接受一个参数，然后依据这个参数进行计算，并产生一个输出值。如：
``` java
int fun(n){
  return 4*n;
}
```
　　但是在哈希查找中，不论散列函数设计的多么好，也难免会有冲突出现，也就是说会存在散列函数的输入参数不相同，但是散列函数依据该参数所计算出来的值却是相同的：
 
    这就像 3*4=12 与 2*6=12 是一个道理。

　　查找的时候会存在冲突，那么存储的时候必然也会存在冲突，解决冲突的方案有多种，笔者就不展开介绍了。

<br>　　说这些是为了告诉大家两个事情：

    -  第一，HashMap中的元素位置是通过计算得来的。
    -  第二，在HashMap中，可以同时存在两个Key不同（equals()返回false），但Key的hashCode相同的元素。
    -  第三，当想把A存入HashMap时，会先使用A的hashCode来计算它将要存储到的位置，若该位置已经有B了，但A和B的key不相同（equals方法返回false），则A会被放到HashMap的其他位置。

<br>　　事实上`HashMap`就是基于哈希表结构的。

    -  哈希表通常由数组和链表组合而成。
    -  当存取元素时，会进行如下操作：
       -  首先，使用元素来计算出一个值index。
       -  然后，将元素存到存到数组的第index位置上去。
       -  接着，若数组的index位置上已经有元素了，则会把该元素放到已有元素的后面。

　　哈希表大体的样子如下图所示：

<center>
![左侧的是数组，数组的每一个元素都是一个链表](/img/android/android_BY_a01_10.jpg)
</center>

<br>　　更多关于`HashMap`的源码分析将在《优化篇》进行，此处点到为止。

<br>**回到正题**
　　既然知道了`HashMap`是通过哈希算法来计算元素的存储位置，那么这意味着元素在`HashMap`中的排列顺序和插入的顺序可能不同。而当咱们需要遍历`HashMap`的时候，输出的元素的顺序就不是咱们插入的顺序了。

　　范例1：输出元素。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Map<String, String> map = new HashMap<String, String>();
        map.put("apple", "1");
        map.put("orange", "2");
        map.put("pear", "3");
        System.out.println(map.toString());   // 输出：{orange=2, apple=1, pear=3}
    }
}
```
    语句解释：
    -  本范例依次将apple、orange和pear加入到HashMap中，但是程序输出的顺序却是orange、apple和pear。
    -  正是由于Hash的这种特点会带来很多不便，于是LinkedHashMap便应运而生。

<br>**LinkedHashMap**

　　`LinkedHashMap`是`HashMap`的子类，它解决了遍历`HashMap`的无序的问题。
<br>　　范例1：顺序一致。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Map<String, String> map = new LinkedHashMap<String, String>();
        map.put("apple", "1");
        map.put("orange", "2");
        map.put("pear", "3");
        System.out.println(map.toString());  // 输出：{apple=1, orange=2, pear=3}
    }
}
```

<br>　　`LinkedHashMap`内部的链表提供了两种元素的排列方式：

    -  按照元素插入的顺序（默认）。
    -  按访元素访问的顺序。每当元素被访问（通过get、put等方法）的时候，就将元素移至链表尾部。 

<br>　　范例2：删除元素。
``` java
public class MainActivity extends ActionBarActivity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 参数依次为：LinkedHashMap的初始容量、加载因子、是否启用“按访元素访问的顺序”排序。
        Map<String, String> map = new LinkedHashMap<String, String>(0, 0.75f, true) {
            protected boolean removeEldestEntry(Entry<String, String> eldest) {
                // 若当前已经有4个元素了，则删除eldest。
                return size() > 3;
            }
        };
        map.put("1", "100");
        map.put("2", "200");
        map.put("3", "300");
        map.put("4", "400");
        map.put("5", "500");
        System.out.println(map.toString());  // 输出：{3=300, 4=400, 5=500}
    }
}
```
    语句解释：
    -  加载因子采用小数表示，0.75表示当Map中的数据量达到总容量的75%时，其容量空间自动扩张。
    -  每当往LinkedHashMap中添加数据时，都会导致它的removeEldestEntry方法被调用。该方法用来决定是否将参数eldest从removeEldestEntry中删除。

<br>**LruCache**
　　虽然`LinkedHashMap`已经实现`LRU`算法，但是它只能在对象的数量上做限制，而不可以在对象的大小上进行限制。

    -  如现在需要做一个Bitmap对象的缓存，限制缓存区的大小是15MB。
    -  只要所有Bitmap的容量加起来不超过15MB即可，至于Map中保存多少个Bitmap对象则不做限制。

　　而`LruCache`类则可以在对象的大小上进行限制。

<br>　　范例1：两级缓存同时使用。
``` java
public class MemoryCache {

    // 一级缓存。
    private LruCache<String, Bitmap> mL1Cache = new LruCache<String, Bitmap>(1024 * 300) {
        protected int sizeOf(String key, Bitmap value) {
            int size = 1;
            if (value != null) {
                size = value.getRowBytes() * value.getHeight();
            }
            return size;
        }
        // 每当LruCache类的put等方法被调用后，LruCache都会检查一下当前容量是否超过的最大容量。
        // 若是则entryRemoved()方法将被调用。
        protected void entryRemoved(boolean evicted, String key, Bitmap oldValue, Bitmap newValue) {
            // 当Bitmap的强引用被删除的时候，将其放入二级缓存中。
            mL2Cache.put(key, new SoftReference<Bitmap>(oldValue));
        }
    };

    // 二级缓存。
    Map<String, SoftReference<Bitmap>> 
            mL2Cache = new LinkedHashMap<String, SoftReference<Bitmap>>(0, 0.75f, true) {
        protected boolean removeEldestEntry(Map.Entry<String, SoftReference<Bitmap>> eldest) {
            // 当软引用的个数超过了5则删除表头元素。
            return size() > 5;
        }
    };

    public void put(String key, Bitmap bitmap) {
        mL1Cache.put(key, bitmap);
    }

    public Bitmap get(String key) {
        // 从一级缓存中读取数据。
        Bitmap bitmap = mL1Cache.get(key);
        if (bitmap == null) {
            // 从二级缓存中读取数据。
            bitmap = mL2Cache.get(key).get();
            if (bitmap != null) {
                // 再次将数据放入到一级缓存中。
                mL1Cache.put(key, bitmap);
            }
        }
        return bitmap;
    }
}
```
    语句解释：
    -  MemoryCache类使用两级缓存来缓存Bitmap对象。
    -  其中mL1Cache使用强引用缓存，当mL1Cache空间不足时，会将数据移到mL2Cache中。
    -  另外mL2Cache不会阻止系统回收Bitmap对象，只要Bitmap对象在外界有强引用被持有，mL2Cache中的值就不会被回收。


<br>**本节参考阅读：**
- [百度百科 - LRU](http://baike.baidu.com/view/70151.htm) 
- [LRU算法的实现](http://blog.csdn.net/Ackarlix/article/details/1759793) 

#### DiskLruCache ####
　　[DiskLruCache ](https://github.com/JakeWharton/DiskLruCache)用于实现存磁盘缓存，它通过将缓存对象写入文件系统从而实现缓存的效果。网上有很多关于`DiskLruCache`教程，笔者也不打算重复造轮子，本节只给出几个简单范例。

　　推荐阅读：[《Android DiskLruCache缓存完全解析》](http://blog.csdn.net/guolin_blog/article/details/28863651)

<br>　　范例1：创建`DiskLruCache`。
``` java
public class MainActivity extends Activity {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        DiskLruCache mDiskLruCache = null;
        try {
            File cacheDir = getDiskCacheDir(this, "bitmap");
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }
            // 第一个参数：表示缓存文件存放的目录。
            // 第二个参数：表示应用的版本号，一般设置为1，当版本号发生改变时，DiskLruCache会清空之前的所有缓存。
            // 第三个参数：表示单个节点所对应的数据的个数，一般设置为1。
            // 第四个参数：表示缓存的总大小，单位是字节，下面设置的是10M。
            mDiskLruCache = DiskLruCache.open(cacheDir, 1, 1, 10 * 1024 * 1024);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 获取本地缓存目录。
    public static File getDiskCacheDir(Context context, String uniqueName) {
        String cachePath = null;
        // 若SD卡已就绪，或者SD卡不可移除。
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())
                || !Environment.isExternalStorageRemovable()) {
            // 缓存路径为：/Android/data/packageName/cache
            cachePath = context.getExternalCacheDir().getPath();
        } else {
            // 缓存路径为：/data/data/packageName/cache
            cachePath = context.getCacheDir().getPath();
        }
        return new File(cachePath, uniqueName);
    }

}
```
    语句解释：
    -  SD卡上的/Android/data/packageName目录是Android推荐的App数据目录，当App被卸载时系统会自动删除该目录。
    -  当本地缓存大于指定的大小时，DiskLruCache会清除一些缓存文件，从而保证总大小不大于这个设定值。
    -  在缓存目录下会有一个名为journal文件，它是DiskLruCache的日志文件，程序对每张图片的操作记录都存放在这个文件中。

<br>　　范例2：写入缓存。
``` java
new Thread(new Runnable() {
    public void run() {
        try {
            String imageUrl = "http://img.my.csdn.net/uploads/201309/01/1378037235_7476.jpg";
            // 由于图片的url中可能存在特殊字符，所以先将url转成一个MD5字符串，作为唯一标识。
            String key = hashKeyForDisk(imageUrl);
            // DiskLruCache的缓存添加的操作需要通过Editor完成。
            // Editor表示一个缓存对象的编辑对象，如果这个缓存正在被编辑，那么edit方法会返回null。
            // 若如果当前本地不存在缓存对象，则edit方法就会返回一个新的Editor对象。
            DiskLruCache.Editor editor = mDiskLruCache.edit(key);
            if (editor != null) {
                // 由于DiskLruCache.open的第三个参数我们设置为1，因此下面的newOutputStream方法传递0。
                OutputStream outputStream = editor.newOutputStream(0);
                // 执行图片的下载。
                if (downloadUrlToStream(imageUrl, outputStream)) {
                    // 下载成功则提交。
                    editor.commit();
                } else {
                    // 下载失败则回退。
                    editor.abort();
                }
            }
            // 将数据写入到本地。
            mDiskLruCache.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}).start();
```
    语句解释：
    -  关于hashKeyForDisk和downloadUrlToStream的具体代码，请参阅上面给出的博文。


<br>　　范例3：读取缓存。
``` java
try {
    String imageUrl = "http://img.my.csdn.net/uploads/201309/01/1378037235_7476.jpg";
    // 获取url的MD5串。
    String key = hashKeyForDisk(imageUrl);
    // Snapshot表示本地缓存文件的一个快照，通过它我们可以获取缓存文件的输入流。
    DiskLruCache.Snapshot snapShot = mDiskLruCache.get(key);
    if (snapShot != null) {
        InputStream is = snapShot.getInputStream(0);
        Bitmap bitmap = BitmapFactory.decodeStream(is);
        mImage.setImageBitmap(bitmap);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```
    语句解释：
    -  如果图片的尺寸很大，则上面第9行代码，直接将它加载到内存是很危险的。
    -  此时就可以结合LruCache一节的知识，加载缩略图并将图片放到MemoryCache中，至此就实现了三级缓存的功能。

### 图片的处理 ###
　　本节将详细的讲解一些图片处理相关的知识。

#### 处理Bitmap本身 ####

　　在`Android`中使用`Bitmap`类来表示位图。在前面我们已经介绍了如何加载一个`Bitmap`到内存中，本节将继续深入讲解`Bitmap`的其它操作。
<br>　　范例1：将`Bitmap`保存到本地。
``` java
private boolean writeBitmap(Bitmap bitmap,String name){
    // 获取一个Bitmap对象。
    try{
        FileOutputStream output = new FileOutputStream(this.getFilesDir()+"/"+name);
        // 将当前Bitmap对象写入到指定的输出流中。若写入成功则返回true 。
        if(bitmap.compress(CompressFormat.JPEG, 100, output)){
            System.out.println("OK");;
            // 释放与当前Bitmap对象所关联的系统资源。
            bitmap.recycle();
            return true;
        }
    }catch(Exception e){
        e.printStackTrace();
    }
    return false;
}
```
    语句解释：
    -  关于compress方法的两个参数：
       -  format：Bitmap对象的压缩格式。常见取值：
          -  CompressFormat.PNG 
          -  CompressFormat.JPEG
       -  quality：生成的图片的质量，最高质量为100，若本方法生成的是不会失真的PNG格式的图片，则此参数将不起作用。
    -  提示：使用此方法可以将一个Bitmap对象保存到手机中，也可以将一个JPEG格式的图片转换为PNG格式的图片，反之也可以。
    -  在使用完毕Bitmap对象后，应该调用recycle方法将其所占据的系统资源回收掉。

<br>　　范例2：获取`View`的快照。
``` java
public void camera(){
    this.linearLayout = (LinearLayout) findViewById(R.id.layout);
    // 此方法继承自View类，用来设置当前View的缓存图像功能是否启用。
    this.linearLayout.setDrawingCacheEnabled(true);
    // 当调用getDrawingCache方法获取当前View的缓存图片时，获取到的图片的背景色默认是透明的，可以使用此方法设置缓存图片的背景色。
    this.linearLayout.setDrawingCacheBackgroundColor(Color.BLACK);
    // 将View的当前外观，截图，然后以Bitmap的形式返回。 此方法相当于为当前View照相。相片内会包含当前控件和其内部的所有子控件。
    // 提示：调用此方法前需要先调用setDrawingCacheEnabled方法，开启缓存图像的功能。
    this.writeBitmap(linearLayout.getDrawingCache(), "linear.png")
}
```
    语句解释：
    -  本范例中调用的writeBitmap方法是一个用来将Bitmap保存到磁盘上的工具方法。
    -  getDrawingCache方法不可以在Activity的onCreate方法中调用，因为那时View并没有被显示到屏幕中。

<br>　　除了上面的操作外，还可以通过Bitmap类的`getPixels`方法获取它的像素数据，修改内容后，再通过`setPixel`方法设置到Bitmap中。

#### 矩阵 ####

　　在实际开发中，我们可能并不满足于仅仅使用`ImageView`显示一张图片，可能还会想对图片进行缩放、平移、旋转、倾斜，本节将介绍如何通过`android.graphics.Matrix`（矩阵）类来实现这四种基本操作。

<br>　　矩阵就是一个`m*n`（`m行n列`）的二维数组，而`Matrix`类用来描述一个`3*3`矩阵。
<br>　　此时你可能会问，`Matrix`和图片的操作（缩放、旋转、移动、倾斜）有什么关系呢？

>主要是为了提高性能。开发者将缩放、旋转、移动、倾斜这四种操作综合在一起设置到矩阵中，然后一次性交给系统，再统一将修改后的Matrix对象作用到ImageView、Bitmap等对象上，以此来提高效率。

　　在正式介绍`Matrix`之前，先介绍几个与矩阵相关的知识点，以减少我们之间的知识断层。

##### 基础知识 #####
<br>**方阵与主对角线**
　　方阵：<font color='red'>行数和列数相等</font>的矩阵称为方阵。如 3 x 3、4 x 4 的矩阵都称为方阵。
　　主对角线：一个 N 阶方阵的<font color='red'>主对角线</font>就是方阵从左上到右下的一条斜线。如下图所示：

<center>
![主对角线示意图，主对角线上的元素就是：1，5，9三个。](/img/android/android_e02_2.png)
</center>

<br>**矩阵加减法**
　　在数学中，矩阵加法一般是指两个矩阵把其相对应元素加在一起的运算。通常的矩阵加法被定义在两个相同大小的矩阵。 如：

<center>
![](/img/android/android_e02_3.png)
</center>

　　也可以做矩阵的减法，只要其大小相同的话。`A-B`内的各元素为其相对应元素相减后的值，且此矩阵会和`A`、`B`有相同大小。例如：

<center>
![](/img/android/android_e02_4.png)
</center>

<br>**矩阵乘法**
　　矩阵相乘就是指两个矩阵进行乘法运算。矩阵相乘有两个特点：

>1、只有当矩阵A的列数与矩阵B的行数相等时A×B才有意义，否则就无法相乘。
>2、一个3×2的矩阵乘以一个2×3的矩阵，会得到一个3x3的矩阵。即a(m,n)与b(n,p)相乘结果为c(m,p)。

　　假设有下面A、B两个矩阵要相乘：

          1  2              5  6  7
    A =   3  4         B =  8  9  10
          5  6 

　　具体过程：

    -  首先，用A的第一行依次乘以B的每一列。
       -  C[0][0] = 1*5 + 2*8   也就是用A[0][0]*B[0][0]+A[0][1]*B[1][0]。
       -  C[0][1] = 1*6 + 2*9   也就是用A[0][0]*B[0][1]+A[0][1]*B[1][1]。
       -  C[0][2] = 1*7 + 2*10  也就是用A[0][0]*B[0][2]+A[0][1]*B[1][2]。
    -  然后，用A的第二行依次乘以B的每一列。
       -  C[1][0] = 3*5 + 4*8
       -  C[1][1] = 3*6 + 4*9
       -  C[1][2] = 3*7 + 4*10
    -  最后，用A的第三行依次乘以B的每一列。
       -  C[2][0] = 5*5 + 6*8
       -  C[2][1] = 5*6 + 6*9
       -  C[2][2] = 5*7 + 6*10

　　矩阵乘法的两个重要性质：
    -  矩阵乘法不满足交换律。
       -  假设A*B可以相乘，但是交换过来后B*A两个矩阵有可能根本不能相乘。如：A(3,2)*B(2,4)是可以的，但是B(2,4)*A(3,2)就无法相乘。
    -  矩阵乘法满足结合律。
       -  假设有三个矩阵A、B、C，那么(AB)C和A(BC)的结果的第i行第j列上的数都等于所有A(ik)*B(kl)*C(lj)的和（枚举所有的k和l）。


<br>**单位矩阵**
　　在矩阵的乘法中，有一种矩阵起着特殊的作用，如同数的乘法中的1，我们称这种矩阵为<font color='red'>单位矩阵</font>。它是个方阵，除主对角线上的元素均为1以外全都为0。 如下图所示：

<center>
![](/img/android/android_e02_5.png)
</center>

　　通常用字母`E`来表示单位矩阵，对于单位矩阵，有`A*E=E*A=A`。

##### 进入正题 #####
　　接下来我们开始介绍`Matrix`类的用法。

　　前面已经说了，`Matrix`类支持`4`种操作：平移(translate)、缩放(rotate)、旋转(scale)、倾斜(skew)。
　　同时它也是一个`3*3`的矩阵，由`9`个`float`值构成，事实上这`9`个值目前只使用了`前6个`，它们各自用来记录不同的数据，如下图：

<center>
![](/img/android/android_e02_7.png)
</center>

　　图释：

    -  平移位置： 由transX和transY来记录，它表示矩阵当前所在的位置，距离原点的偏移量。 
    -  缩放大小： 由scaleX和scaleY记录，表示当前矩阵在水平方向(X轴)和垂直方向(Y轴)上放大的比例。
    -  倾斜信息： 由skewX和skewY记录，表示当前矩阵在水平方向(X轴)和垂直方向(Y轴)上倾斜的大小。
    -  旋转角度： 由scaleX和scaleY、skewX和skewY记录，即通过缩放+倾斜，我们可以实现旋转效果。

　　提示：一个刚创建的`Matrix`对象其实就是一个单位矩阵。
<br>　　值得注意的是，针对每种操作，`Matrix`类各自提供了`pre`、`set`和`post`三种操作方式。其中：

    -  set：  用于覆盖Matrix中的值。
    -  pre：  参与运算的两个矩阵，当前矩阵做为第一个操作数，即在参数矩阵之前。
    -  post： 参与运算的两个矩阵，当前矩阵做为第二个操作数，即在参数矩阵之后。

　　因为矩阵的乘法不满足交换律，因此先乘、后乘必须要严格区分，但是矩阵的加法则是满足交换律的。

<br>　　范例1：平移操作。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        // 创建一个新的矩阵对象，其实就是创建一个单位矩阵。
        Matrix m = new Matrix();
        // 将图片的左上角移动到ImageView内部的(100,100)点。
        m.setTranslate(100, 100);
        // 更新ImageView的矩阵。 必须保证ImageView的android:scaleType="matrix"，否则即使修改矩阵也没效果。
        img.setImageMatrix(m);
    }
}
```
    语句解释：
    -  在控制台中输出m就会看到，m[0][2]和m[1][2]的值都变成100了。

<br>　　范例2：缩放操作。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        // 获取ImageView的矩阵。
        Matrix m = img.getImageMatrix();
        // 让图像的宽度放大2倍，高度缩小到0.5倍
        m.setScale(2, 0.5f);
        // 更新ImageView的矩阵。
        img.setImageMatrix(m);
    }
}
```
    语句解释：
    -  在控制台中输出m就会看到，m[0][0]的值变成了2，m[1][1]的值变成了0.5。

<br>　　范例3：旋转操作。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = img.getImageMatrix();
        // 顺时针旋转45度。
        m.setRotate(45);
        img.setImageMatrix(m);
    }
}
```
    语句解释：
    -  让图像顺时针旋转45度，如果想逆时针旋转，则可以设为负数。

<br>**倾斜**

　　我们这里所说的倾斜，其实更专业的说法是错切变换(skew)，在数学上又称为`Shear mapping`。它是一种比较特殊的线性变换，错切变换的效果就是让所有点的x坐标(或者y坐标)保持不变，而对应的y坐标(或者x坐标)则按比例发生平移。错切变换，属于<font color='red'>等面积变换</font>，即一个形状在错切变换的前后，其面积是相等的。

　　如下图（左）中，各点的`y`坐标保持不变，但其`x`坐标则按比例发生了平移，这种情况叫水平错切。
　　如下图（右）中，各点的`x`坐标保持不变，但其`y`坐标则按比例发生了平移，这种情况叫垂直错切。

<center>
![](/img/android/android_e02_8.png)
</center>

<br>　　范例1：倾斜操作。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = img.getImageMatrix();
        // 让图像的x轴保持不变，y轴倾斜0.4 。
        m.setSkew(0, 0.4f);
        img.setImageMatrix(m);
    }
}
```

　　下图（左）是原图，（右）是图片在`y`轴上倾斜`0.4`之后的效果，倾斜的数值可以是负数，负数则往逆方向上倾斜。

<center>
![](/img/android/android_e02_9.png)
</center>

<br>**围绕一个中心点**
<br>　　除平移外，旋转、缩放和倾斜都可以围绕一个中心点来进行，如果不指定，在默认情况下是围绕`(0, 0)`来进行相应的变换的。 也就是说，`setRotate(45)`与`setRotate(45, 0, 0)`是等价的。

<br>　　范例1：指定旋转的中心点。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView imageView = (ImageView) findViewById(R.id.img);
        Bitmap bitmap = ((BitmapDrawable)imageView.getDrawable()).getBitmap();
        Matrix m = imageView.getImageMatrix();
        // 以图片的中心点为原点，顺时针旋转180度。
        m.setRotate(180, bitmap.getWidth()/2, bitmap.getHeight()/2);
        // 更新ImageView的矩阵。
        imageView.setImageMatrix(m);
    }
}
```
    语句解释：
    -  围绕某一点进行旋转，被分成3个步骤：首先将坐标原点移至该点，然后围绕新的坐标原点进行旋转变换，再然后将坐标原点移回到原先的坐标原点。被围绕的点可以是任意取值，它不受控件大小的限制。比如我们可以围绕(1000, 1000)这个点来旋转。
    -  简单的说，可以把用来绘制图像的区域，想象成一个无限大小的画布，当执行旋转时，默认情况下是旋转画布的左上角(0, 0)，而若我们指定了一个相对的点，比如(300, 300)，那么此时将以画布的(300, 300)为中心了。

<br>**前乘与后乘** 

　　我们已经知道了，只有当矩阵`A`的列数与矩阵`B`的行数相等时`A*B`才有意义，所以用矩阵`A`乘以矩阵`B`，需要考虑是左乘（`A*B`），还是右乘（`B*A`）。
　　左乘：又称前乘，比如说，矩阵`A(m,n)`左乘矩阵`B(n,p)`，会得到一个`m*p`的矩阵`C(m,p)`，写作`A*B=C`。

　　还有一点值得注意的是，假设`A`和`B`都是一个`3*3`的矩阵，那么`A*B`与`B*A`的结果也可能是不一样的。 如下图所示：

<center>
![](/img/android/android_e02_10.png)
</center>

<br>　　由于矩阵乘法不满足交换律，`Matrix`类为我们提供了类似的方法，以平移操作为例，`Matrix`类的源代码为：
``` java
    /**
     * Preconcats the matrix with the specified translation.
     * M' = M * T(dx, dy)
     */
    public boolean preTranslate(float dx, float dy) {
        return native_preTranslate(native_instance, dx, dy);
    }

    /**
     * Postconcats the matrix with the specified translation.
     * M' = T(dx, dy) * M
     */
    public boolean postTranslate(float dx, float dy) {
        return native_postTranslate(native_instance, dx, dy);
    }
```
　　从注释中可以看出，`pre`其实执行的就是让当前矩阵左乘参数矩阵，而`post`则是让当前矩阵右乘参数矩阵。

<br>**单次运算** 
<br>　　范例1：单次运算——旋转45度。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        // 此处也可以调用postRotate()方法，它们的效果相同。
        m.preRotate(45);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
    语句解释：
    -  一个新创建的Matrix对象就是一个单位矩阵。对于平移、缩放、旋转、倾斜四个操作来说，当它们与一个单位矩阵进行运算时，不论调用的是pre还是post方法，最终的效果是一样的。
    -  一旦单位矩阵执行了某种操作，那么它就不再是单位矩阵了，此时就需要区分pre和post方法的调用。

<br>　　范例2：`setXxx`方法。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        Matrix m = new Matrix();
        m.preRotate(45);
        m.preTranslate(100, 100);
        m.postSkew(0.2f, 0.2f);
        // 不论矩阵之前执行了什么操作，只要它调用了setXxx方法，那么就会先将矩阵重置为单位矩阵，然后再做相应的操作。
        m.setScale(2, 2);
        img.setImageMatrix(m);
        img.setImageBitmap(BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher));
    }
}
```
    语句解释：
    -  在本范例中，最终图片只会被放大到2倍，除此之外，其他什么操作都不会执行。

<br>**混合连乘** 
　　接下来我们通过一个范例来讲解如何进行混合连乘。

<br>　　范例1：请证明下面两段代码是等价的。
``` java
// 需求是：让图片沿着点(a,b)顺时针旋转30度。
int a = 100, b = 100;

// 第一种实现方式
Matrix m = new Matrix();
m.setRotate(30, a, b);

// 第二种实现方式
Matrix m = new Matrix();
m.setTranslate(a, b);
m.preRotate(30);
m.preTranslate(-a, -b);
```

<br>　　第一种实现方式很容易理解，也是不多说，直接说第二种方式。

　　首先我们得知道，矩阵先乘(`preXxx`)和后乘(`postXX`)的区别在于：当前矩阵对象，是先执行参数矩阵的变换，还是后执行参数矩阵的变换。
　　比如，我们可以根据第二种实现方式写出下面的公式：
``` java
// T  表示translate。
// R  表示rotate。
// M1 表示最终的结果矩阵。
M1 = T(a, b) * R(30) * T(-a, -b)
```
　　这个公式的推导过程为：
``` java
// 第一步，由于先调用的是m.setTranslate(a, b)，所以会先把矩阵重置为单位矩阵，然后再把T放入，得到：
M1 = T(a, b)
// 第二步，由于m.preRotate(30)是前乘，所以直接把参数矩阵放到现有公式的末尾，得到：
M1 = T(a, b) * R(30)
// 第三步，同理，最终得到：
M1 = T(a, b) * R(30) * T(-a, -b)
```
　　需要注意的是，在计算的时候，图片会按照<font color='red'>“从右向左”</font>的顺序，依次被每个矩阵变换。
　　也就是说，公式`M1 = T(a, b) * R(30) * T(-a, -b)`的语义为：
    -  首先，把图片移动到(-a, -b)。
    -  然后，让图片以(0, 0)为中心旋转30度。
    -  最后，把图片移动到(a, b)。

　　按照上面的步骤，我们可以直观想一下：

    -  第一步，先进行preTranslate(-a, -b)操作，即把原图的左上角平移(-a, -b)个位置，也就相当于把原图的(100, 100)这个位置放到了(0, 0)上。
    -  第二步，以(0, 0)为中心旋转30度，就相当于以原图的(100, 100)为中心旋转30度。
    -  第三步，旋转完后再平移(a, b)，这样原图(100, 100)这个位置的点又回到了它原来的位置。
    -  最后，就相当于整个图做了一个以(100, 100)为中心的30度旋转，所以说第一种方式与第二种方式是等价的。


<br>　　最后，我们再看如果把第二种方式中的`m.preRotate(30)`变成`m.postRotate(30)`后，为什么效果就完全不一样了：
``` java
// Matrix m = new Matrix();
// m.setTranslate(a, b);
// m.postRotate(30);
// m.preTranslate(-a, -b);

// 最终得到的公式为：
M1 = R(30) * T(a, b) * T(-a, -b)
```
　　在上面的公式中，两个平移变换相互抵消了，公式的语义是：以`(0,0)`为中心旋转`30`度，这显然和以`(100, 100)`为中心旋转`30`度是不同的。

<br>　　因此，我们可以总结一下：

    -  m.preTranslate(a, b)  ：先执行平移(a, b)的变换，再执行matrix中已经定义的其它变换。
    -  m.postTranslate(a, b) ：先执行matrix中已经定义的其它变换，再执行平移(a, b)的变换。
    -  m.setTranslate(a, b)  ：清空matrix中所有变换，调用这个函数后，matrix就会只包含平移(a, b)这一个变换。

<br>　　范例1：移动图片。
``` java
private final class MyOnTouchListener implements OnTouchListener{
    private Matrix matrix = new Matrix();
    private float preX;
    private float preY;
    public boolean onTouch(View v, MotionEvent event) {
        switch(event.getAction()){
        case MotionEvent.ACTION_DOWN:
            preX = event.getX();  // 记录用户按下手指时的x坐标。
            preY = event.getY();  // 记录用户按下手指时的y坐标。
            break;
        case MotionEvent.ACTION_MOVE:
            float currX = event.getX();// 用户移动手指时,记录当前x坐标。
            float currY = event.getY();// 用户移动手指时,记录当前y坐标。
            float dx = currX - preX; // 用当前x坐标减去上一次的x坐标。
            float dy = currY - preY; // 用当前y坐标减去上一次的y坐标。
            // 让matrix在当前位置上,平移dx和dy个位置。
            matrix.postTranslate(dx, dy); 
            preX = currX; // 记录下当前x坐标。
            preY = currY; // 记录下当前y坐标。
            break;
        }
        //更新ImageView控件的矩阵。
        img.setImageMatrix(matrix); 
        return true;
    }
}
```
    语句解释：
    -  把这个类的对象设置到ImageView中即可。

<br>**本节参考阅读：**
- [百度文库 - Android Matrix基础+详解](http://wenku.baidu.com/view/96590cd076a20029bd642ddf.html) 
- [Android中图像变换Matrix的原理、代码验证和应用(一)](http://blog.csdn.net/pathuang68/article/details/6991867)
- [Android中关于矩阵（Matrix）前乘后乘的一些认识](http://blog.csdn.net/linmiansheng/article/details/18820599) 
- [百度百科 - 剪切变换](http://baike.baidu.com/view/2424073.htm) 
- [Android之Matrix用法](http://blog.csdn.net/yuzhiboyi/article/details/7619238)
- [Android学习记录（9）—Android之Matrix的用法](http://blog.csdn.net/loongggdroid/article/details/18706999)  
- [云算子 - 在线矩阵相乘计算器](http://www.yunsuanzi.com/matrixcomputations/solvematrixmultiplication.html)   
- [百度百科 - 矩阵乘法](http://baike.baidu.com/view/2455255.htm)  

#### 颜色矩阵 ####
　　在实际应用中，我们除了会对图片进行缩放、平移、旋转、倾斜操作外，也会对图片的显示效果做出修改。
　　比如，我们常见的对图像进行颜色方面的处理有：黑白老照片、泛黄旧照片、低饱和度等效果，这些效果都可以通过使用颜色矩阵（`ColorMatrix`）来实现。

<br>**ColorMatrix**
　　颜色矩阵是一个`4*5`的矩阵，用来对图片颜色值进行处理。在Android中，颜色矩阵是以一维数组的方式进行存储的（参见`ColorMatrix`类的源码）。

<center>
![颜色矩阵M的示意图，其中第二个括号里的值是颜色矩阵的初始值](/img/android/android_e02_11.png)
</center>

　　通过颜色矩阵，修改原图像的`RGBA`值的步骤为：

    -  首先，系统会遍历图像中的所有像素点。
    -  然后，让每个像素点的颜色值与颜色矩阵进行矩阵乘法运算。
    -  接着，将计算出来的新颜色值设置到那个像素点上。
    -  最后，当所有像素点都运算完毕后，整张图的颜色就变化完成了。

　　为了能让像素点的色值和颜色矩阵进行乘法运算，系统会先将像素点的`RGBA`值存储在一个`5*1`的分量矩阵中，然后再和颜色矩阵（`4*5`）相乘，得到一个（`4*1`）的矩阵。这意味着，我们可以通过修改颜色矩阵的值，来控制图像最终的颜色效果。如下图所示：

<center>
![颜色矩阵与分量矩阵相乘示意图](/img/android/android_e02_12.png)
</center>

　　通过阅读`ColorMatrix`类的源码，得知在上面说的`4*5`的颜色矩阵中：

    -  第一行参数abcde决定了图像的红色成分。即结果矩阵(4*1)的R成分的值=aR+bG+cB+dA+e，如果还不懂那请自行切腹。
    -  第二行参数fghij决定了图像的绿色成分。
    -  第三行参数klmno决定了图像的蓝色成分。
    -  第四行参数pqrst决定了图像的透明度。
　　并且，从上图可知，颜色矩阵的第五列参数`ejot`是颜色的偏移量，即如果只是想在像素点现有的颜色上进行微调的话，我们只需要修改`ejot`即可。

<br>　　接下来我们通过两个范例来实现下图所示的效果：

<center>
![原图（左）、变黄（中）、灰度化（右）](/img/android/android_e02_13.png)
</center>

<br>　　范例1：让图片变黄。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        // 创建一个新的颜色矩阵。
        ColorMatrix cm = new ColorMatrix();
        // 重新设置颜色矩阵中的值。 此处只是将R和G的偏移量设置为100。
        cm.set(new float[]{
            1, 0, 0, 0, 100,
            0, 1, 0, 0, 100,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
        });
        // 创建一个ColorMatrixColorFilter对象，用它来包装一下颜色矩阵，并将它设置到ImageView中。
        img.setColorFilter(new ColorMatrixColorFilter(cm));
    }
}
```
    语句解释：
    -  通过计算后可以得知该颜色矩阵的作用是使图像的红色分量和绿色分量均增加100，这样的效果就使图片泛黄（因为红色与绿色混合后得到黄色）。

<br>　　范例2：让图片灰度化。
``` java
public class MainActivity extends Activity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        ImageView img = (ImageView) findViewById(R.id.img);
        ColorMatrix cm = new ColorMatrix();
        // 饱和度设置为0 。
        cm.setSaturation(0);
        img.setColorFilter(new ColorMatrixColorFilter(cm));
    }
}
```
    语句解释：
    -  饱和度是指色彩的鲜艳程度，也称色彩的纯度，0代表灰，100代表饱和。
    -  这样一来，对于被禁用的按钮所显示的图片，如果美工不给，我们也可以自己做出来了。

<br>　　范例3：修改色调。
``` java
ImageView imageView = (ImageView) findViewById(R.id.img);
ColorMatrix colorMatrix = new ColorMatrix();
// 系统分别用0、1、2来代表Red、Green、Blue三种颜色，第二个参数表示色调值。
colorMatrix.setRotate(0, 100);
imageView.setColorFilter(new ColorMatrixColorFilter(colorMatrix));
```
    语句解释：
    -  色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
    -  生活中经常见到这样一种现象：不同颜色的物体或被笼罩在一片金色的阳光之中，或被统一在冬季银白色的世界之中。这种在不同颜色的物体上，笼罩着某一种色彩，使不同颜色的物体都带有同一色彩倾向，这样的色彩现象就是色调。

<br>　　范例4：混合修改。
``` java
ImageView imageView = (ImageView) findViewById(R.id.img);
// 色调
ColorMatrix hueMatrix = new ColorMatrix();
hueMatrix.setRotate(0, 30);
hueMatrix.setRotate(1, 40);
hueMatrix.setRotate(2, 50);
// 饱和度
ColorMatrix saturationMatrix = new ColorMatrix();
saturationMatrix.setSaturation(5);
// 亮度
ColorMatrix lumMatrix = new ColorMatrix();
lumMatrix.setScale(50, 150, 250, 10);

// 将它们三个混在一起。
ColorMatrix matrix = new ColorMatrix();
matrix.postConcat(hueMatrix);
matrix.postConcat(lumMatrix);
matrix.postConcat(saturationMatrix);
imageView.setColorFilter(new ColorMatrixColorFilter(matrix));
```

<br>**本节参考阅读：**
- [Android学习笔记22：图像颜色处理（ColorMatrix）](http://www.cnblogs.com/menlsh/archive/2013/02/03/2890888.html)
- [Android图片处理：颜色矩阵和坐标变换矩阵](http://ju.outofmemory.cn/entry/26741)
- [维基百科 - 位图](http://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE)
- [百度百科 - 位图图像](http://baike.baidu.com/view/80262.htm)

### 其它 ###

#### SVG ####
　　在Android 5.0（API level 21）中Google提供了对SVG的图片支持。
　　但需要注意的是，Android是不能直接显示原生的SVG文件的，需要在[ svg2android ](http://inloop.github.io/svg2android/)转换一下。
<br>　　范例1：转换之后的test.xml。
``` xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="48dp"
    android:height="48dp"
    android:viewportWidth="48"
    android:viewportHeight="48">

    <path
        android:fillColor="#FF0000"
        android:pathData="M 0 0 H 48 V 48 H 0 V 0 Z" />
</vector>
```
    语句解释：
    -  将这个XML文件放到res/drawable目录都就可以，引用的方法和普通的drawable一样。
    -  另外，SVG图片加载到内存时，使用VectorDrawable类来表示。

<br>　　如果你以为SVG只能绘制很简单的矩形、圆的话，那就错了，比如我们可以用SVG实现下图的效果：
<center>
![原图（左）、变黄（中）、灰度化（右）](/img/android/android_d02_01.png)
</center>

    源码地址：
    https://github.com/SpikeKing/TestSVG/blob/master/app/src/main/res/drawable/v_homer_simpson_online.xml

<br>**注意事项**
<br>　　关于SVG在Android中的应用，还有如下几点要知道：

>1、SVG是在5.0中提出的，如果你想在5.0之前使用，则需要导入官方支持库。
>2、SVG主要用来降低APK打包大小的，矢量图加载可能会比相应的位图花费CPU运行周期更长，不过在内存使用和性能方面，两者相似。
>3、矢量图主要用来制作小的、简单的图片，建议矢量图像最大为200×200dp。
>4、Android只支持标准SVG文件的某一些功能，并不是全部，比如不支持gradients和patterns。

<br>　　上面说到，在Android中SVG和普通位图，在内存使用和性能方面差别不大，有两点可以证明：

>1、从VectorDrawable类的draw方法中可以看到，SVG绘制的本质就是解析xml文件，并将里面的各种Path绘制到一个Bitmpa中，然后再将Bitmpa显示。
>2、从hprof文件中也可以看到，VectorDrawable最终会持有Bitmap的引用。

<br>　　在制作SVG时以“mdpi”为标准来设计图片尺寸就可以，简单介绍下各屏幕密度间的关系：

    -  Google官方推荐，不同屏幕密度的设备，使用的图片尺寸要遵循3（low）:4（medium）:6（high）:8（xhigh）:12（xxhigh）:16（xxxhigh）。
    -  举个例子来说：
       -  如果medium下面存放一个48x48尺寸的图片，那么low就应该存放36x36尺寸的图片。
       -  相应的就是：high下存放72x72、xhigh下存放96x96、xxhigh下存放144x144、xxxhigh下存放192x192。
    -  事实上，Google将存放到medium下面的图片视为基准值，当设备是low密度但是图却是从mdpi中加载的时候，系统就会让图片缩小到原来的75%。
    -  对应的比率其实是：low（0.75x）、medium（1.0x）、high（1.5x）、xhigh（2.0x）、xxhigh（3.0x）、xxxhigh（4.0x）。


<br>**本节参考阅读：**
- [维基百科 - 矢量图](https://zh.wikipedia.org/zh-cn/%E7%9F%A2%E9%87%8F%E5%9B%BE%E5%BD%A2)
- [维基百科 - 位图](https://zh.wikipedia.org/wiki/%E4%BD%8D%E5%9B%BE)
- [百度百科 - 矢量图](http://baike.baidu.com/view/138039.htm)
- [AndroidStudio中使用SVG](https://developer.android.com/studio/write/vector-asset-studio.html)
- [VectorDrawable的工作原理](http://www.jianshu.com/p/c37e119faa55#)
- [Supporting Multiple Screens](https://developer.android.com/guide/practices/screens_support.html)
- [Add Multi-Density Vector Graphics](https://developer.android.com/studio/write/vector-asset-studio.html#about)

#### EXIF ####

<br>**简介**
　　`EXIF`( `Exchangeable image file format`，可交换图像文件) 是专门为数码相机的照片设定的，可以记录数码照片的属性信息和拍摄数据。
　　`EXIF`最初由小日本电子工业发展协会在`1996`年制定版本为`1.0`。`1998`年升级到`2.1`，增加了对音频文件的支持。`2002`年`3`月发表了`2.2`版。
　　`EXIF`数据可以附加于`JPEG`、`TIFF`、`RIFF`等文件之中，为其增加有关数码相机拍摄信息的内容和索引图或图像处理软件的版本信息。以`Windows 7`操作系统为例，最简单的查看`EXIF`信息的方法是右键点击图片打开菜单，点击属性并切换到详细信息标签下即可。

<br>　　以下列出了几项EXIF会提供的讯息：
```
项目                                   资讯
制造厂商                               Canon                             
影像方向                               正常（upper-left）              
影像分辨率Y                            300 分辨率单位 dpi
相机型号                               Canon EOS-1Ds Mark III
影像分辨率 X                           300
Software                              Adobe Photoshop CS Macintosh
最后异动时间                           2005:10:06 12:53:19
YCbCrPositioning                      2
闪光灯                                 关闭
影像拍摄时间                           2005:09:25 15:00:18    
影像色域空间                           sRGB
影像尺寸 X                            5616 pixel    
影像尺寸 Y                            3744 pixel
```

<br>　　`EXIF`信息是`可以被任意编辑`的，因此只有参考的功能，不能完全相信。
　　`EXIF`信息以`0xFFE1`作为开头标记，后两个字节表示`EXIF`信息的长度。所以`EXIF`信息最大为`64 kB`，而内部采用`TIFF`格式。

<br>**Android支持**
　　从`Android 2.0`开始新增了`ExifInterface`类。
　　此类主要描述多媒体文件比如`JPG`格式图片的`EXIF`信息，比如拍照的设备厂商，当时的日期时间，曝光时间等。该类需要调用`API Level`至少为`5`即`Android 2.0`。

<br>　　范例1：`ExifInterface`类 。
``` java
// 获取和设置一个String类型的EXIF信息。 本类还提供了支持设置int、double类型。
public String getAttribute(String tag);
public void setAttribute(String tag, String value);

// 保存标记数据到JPEG文件，此方法很消耗性能。
// 因为它会将当前所有的属性与图片的具体内容组合起来创造一个新图片，然后再删除旧图片，并重命名新图片。
// 因此最好设置完所有属性后，只调用一次本方法，而不是为每个属性都调用。
public void saveAttributes();

// 获取缩略图。
public byte[] getThumbnail();
```

<br>　　范例2：常用的`Exif`信息。
``` java
ExifInterface.TAG_DATETIME     // 拍照日期。
ExifInterface.TAG_IMAGE_LENGTH  // 图片长度。
ExifInterface.TAG_IMAGE_WIDTH   // 图片宽度。
```
    语句解释：
    -  若需要其他信息，请自行查阅API文档。

<br>**本节参考阅读：**
- [维基百科，EXIF](http://zh.wikipedia.org/wiki/EXIF) 

#### WebP ####

<br>　　暂缓。
# 第三节 视频 #

## 概述 ##

　　与音频一样，视频技术也经历了`模拟视频`和`数字视频`两个阶段，接下来就简单的介绍一下它们。

<br>**模拟视频**

    模拟视频是指由连续的模拟信号组合而成的视频图像，以前所接触的电影、电视都是模拟信号。

    摄像机是获取视频信号的来源，早期的摄像机以电子管作为光电转换器件，把外界的光信号转换为电信号。摄像机前的被拍摄物体的不同亮度对应于不同的亮度值，摄像机电子管中的电流会发生相应的变化。
    模拟信号就是利用这种电流的变化来表示或者模拟所拍摄的图像，记录下它们的光学特征（在录像带等介质上），然后通过调制和解调，将信号传输给接收机，通过电子枪显示在荧光屏上，还原成原来的光学图像。

　　模拟视频的特点：

    -  技术成熟、价格低、系统可靠性较高。
    -  不适宜长期存放，不适宜进行多次复制。随着时间的推移，录像带上的图像信号强度会逐渐衰减，造成图像质量下降、色彩失真等现象。

<br>**数字视频**

    数字视频是对模拟视频信号进行数字化后的产物，它是基于数字技术记录视频信息的。

    我们需要通过模拟/数字（A/D）转换器来将模拟视频转变为数字的“0”或“1”，这个转换过程就是视频捕捉（或采集过程），然后再将转换后的信号采用数字压缩技术存入计算机磁盘中就成为数字视频。

　　数字视频的特点：

    -  数字视频可以无失真地进行无限次拷贝，而模拟视频信号每转录一次，就会有一次误差积累，会产生信号失真。
    -  即便是拷贝的次数不多，模拟视频在长时间存放后视频质量也会降低，而数字视频便于长时间的存放。
    -  可以对数字视频进行非线性编辑，并可增加特技效果等。
    -  原始的数字视频数据量大，在存储与传输的过程中必须进行压缩编码。

<br>**数字视频的压缩**

　　虽然数字视频有诸多优点，但是它的数据量非常大，原始的`1分钟`的满屏的真彩色数字视频需要`1.5GB`的存储空间，这显然是无法接受的。因此和音频一样，我们需要对原始的数字视频进行压缩。

　　`问`：那么我们应该压缩视频里的哪些东西呢？
　　`答`：压缩视频中的那些人的视觉不能感受到的部分。

　　例如，世界上有成千上万种颜色，但是我们眼睛只能辨别大约`1024`种，因为我们觉察不到一种颜色与其邻近颜色的细微差别，所以也就没必要将每一种颜色都保留下来。
　　而且，视频信息的原始数据存在`帧内“空间相关”`和`相邻帧间“时间相关”`，使原始数据存在大量的数据冗余。

    -  同一帧内有大量区域所显示的内容是一样的，比如蓝天中只有少部分是云，其他都是天。
    -  对于相邻的两帧来说，一般情况下它们的相似度是很高的，只有少部分不同。
       -  比如在一个60秒的视频作品中每帧图像中都有位于同一位置的同一把椅子，我们完全没必要在每帧图像中都保存这把椅子的数据。

<br>　　视频编码（压缩）标准主要是由`ITU-T`与`ISO／IEC`两大组织制定而成，其发展如下图所示：

<center>
![视频编码标准发展](/img/android/android_d04_01.png)
</center>

　　当然视频编码（压缩）标准不止上图所列的那些，还有诸如`WMV-HD`、`RealVideo`等。
<br>**视频格式**

　　常见的视频格式有`mp4`，`rmvb`，`mkv`，`avi`等，表示视频文件的封装格式，即容器。
　　所谓`容器`，就是把编码器生成的多媒体内容（视频，音频，字幕，章节信息等）混合封装在一起的标准，容器使得不同多媒体内容同步播放变得很简单。
　　容器的一个作用就是为多媒体内容提供索引，也就是说如果没有容器存在的话一部影片你只能从一开始看到最后，不能拖动进度条（当然这种情况下有的播放器会花比较长的时间临时创建索引），而且如果你不自己去手动另外载入音频的话，就没有声音。
<br>　　很显然，不同的容器会有不同的特性，比如`AVI`格式：

    -  优点：微软公司发表的视频格式，图像质量好，应用广泛。
    -  缺点：体积过于庞大，而且压缩标准不统一，比如高版本Windows媒体播放器播放不了采用早期编码编辑的AVI格式视频，反之也一样。所以经常会遇到视频没法播放，或者可以播放但只有声音没有图像的问题。

<br>**H.264/MPEG-4 AVC**

　　`H.264/MPEG-4 AVC`（`Advanced Video Coding`，高级视频编码）是一种`视频编码标准`。
　　`H.264`因其是蓝光盘的一种编解码标准而著名，所有蓝光盘播放器都必须能解码`H.264`。它也被广泛用于网络流媒体数据如`Vimeo`、`YouTube`以及`iTunes Store`，网络软件如`Adobe Flash Player`和`Microsoft Silverlight`，以及各种高清晰度电视陆地广播，线缆以及卫星。
<br>　　视频之间的质量差距不是由视频格式来决定的，而是由`视频编码`和`音频编码`决定的，视频格式仅仅是一个容器而已。
　　比如说，两个后缀名都为`“.avi”`的视频，它们质量就可能不一样，因为`“.avi”`的视频本身既可以使用`H.264`编码也可以使用`WMV7`编码。下面列出了一个视频的简要参数信息：
``` c
视频编码：H.263
视频分辨率：720x480
视频帧率：60fps
音频编码：MP2，MP3，AC-3，AAC，AMR-NB
容器：MP4，FLV，3GP，MOV，MP4
```

<br>**本节参考阅读：**
- [MBA智库百科 - 模拟视频](http://wiki.mbalib.com/wiki/%E6%A8%A1%E6%8B%9F%E8%A7%86%E9%A2%91)
- [MBA智库百科 - 数字视频](http://wiki.mbalib.com/wiki/%E6%95%B0%E5%AD%97%E8%A7%86%E9%A2%91)
- [百度百科 - 数字视频](http://baike.baidu.com/view/257435.htm)
- [维基百科 - 视频压缩](https://zh.wikipedia.org/wiki/%E8%A6%96%E8%A8%8A%E5%A3%93%E7%B8%AE)
- [维基百科 - H.264/MPEG-4 AVC](https://zh.wikipedia.org/wiki/H.264/MPEG-4_AVC)
- [视频格式与编码压缩标准 mpeg4，H.264.H.265 等有什么关系？](http://www.zhihu.com/question/20997688)

## 流媒体技术 ##

　　在多媒体发展的初期，音视频文件一般都较大，如果我们想要查看这些文件，就需要先把它们下载到电脑中，根据文件的大小以及网络的带宽，可能往往需要几分钟甚至几小时。
　　这种方式不但浪费下载时间、硬盘空间，重要的是使用起来非常不方便。
　　`流媒体技术`出现后，人们能够`“即点即看”`了，多媒体文件一边被下载一边被播放，极大地减少了用户在线等待的时间，而且也提升了互动性。

　　流媒体技术涉及的范围非常广，在线播放视频、现场直播等都是对它的应用，本章暂时只介绍如何播放在线视频。

　　另外，采用流媒体技术的音视频文件主要有三大“流派”：

    -  微软的ASF，这类文件的后缀是.asf和.wmv，与它对应的播放器是微软公司的 “Media Player”。
    -  RealNetworks公司的RealMedia，这类文件的后缀是.rm，文件对应的播放器是“RealPlayer”。
    -  苹果公司的QuickTime，这类文件扩展名通常是.mov，它所对应的播放器是“QuickTime”。

　　此外，`MPEG`、`AVI`、`DVI`、`SWF`等都是适用于流媒体技术的文件格式。

<br>**本节参考阅读：**
- [百度百科 - 流媒体技术](http://baike.baidu.com/link?url=0Z7BN9dkYwvm69UhTeBqRdt39P3eL3Ux2ZZIydX3YIn3JWYcluurnct_c3WT0F59)

## 播放在线视频 ##

　　上一节中介绍了视频相关的理论知识，本节我们将实现`Android`平台的流媒体播放功能。

## 选择框架 ##
　　总的来说，在目前版本的`Android`系统中，我们有两种方式来播放流媒体视频：

    -  第一种，使用系统自带的API。
    -  第二种，使用Github等地方的开源库。

　　两种方式各有优点，并不是说开源库就一定比系统内置的`API`要好，我们得依据自己的需求来做出决定。笔者接下来详细介绍这两种方式的优缺点，并为您做出明智的选择提出睿智的建议。

<br>**系统自带的API**
　　使用系统自带的API来播放视频，又可以分为两种方式：

    -  第一种：MediaPlayer + SurfaceView(或TextureView)。
       -  优点：功能强大、可以更灵活的对其进行自定义。
       -  缺点：使用的难度比较大，需要做很多的操作才能顺利播放出视频。
    -  第二种：VideoView。
       -  它继承自SurfaceView类，且其内部包含了一个MediaPlayer属性，简单的说就是对上面的方法进行进一步封装。
       -  优点：方便使用。
       -  缺点：封装就意味着规矩多，所以它的灵活性就降低了，不过对于大多数场景来说，使用VideoView是最优的选择。

　　不过上面两种有一个共有的缺点，就是它们支持的流媒体协议、格式比较少，如果你需要播放的流媒体比较特殊，那么就选择使用开源库吧，系统内置的API并不适合。

　　如果你想查看`Android`支持哪些媒体的格式，请阅读：[《Supported Media Formats》](https://developer.android.com/intl/zh-cn/guide/appendix/media-formats.html)。

<br>**mp4格式**

　　由于`Android`默认支持`mp4`编码和解码，所以通常我们会采用`mp4`格式作为视频的存储格式。

　　下面这两段文字摘抄自[《Android视频播放之边缓存边播放》](http://blog.zhourunsheng.com/2012/05/android%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B9%8B%E8%BE%B9%E7%BC%93%E5%AD%98%E8%BE%B9%E6%92%AD%E6%94%BE/)：

    -  其实最真实的流媒体协议传输格式并不是普通的http方式，而是rtsp，那样的话得搭建专门的流媒体服务器，成本比较高，采用普通的http方式，实现的是一种伪流媒体传输，但是对于常用的视频缓存播放也足够了。

    -  要想实现视频的边缓存边播放，原则上就要求视频的存储格式是分段的，而mp4正好满足这个要求。只要将mp4的整体视频信息放在mp4文件的开头，这样只要加载了mp4文件的头部之后，就能解析出该mp4文件的时长，比特率等等，为后续的视频缓存做初始化设置，然后每加载一段mp4文件的数据流，通过解析头部来或得当前视频流的帧信息，并在播放器中播放，这样就能先加载一段进行播放，同时缓存后续的一段，依此原理就能实现。

<br>**ijkPlayer**

　　`Android`内置的`API`不能多路播放，而且实时流媒体延迟过高，因此如果你对流媒体的要求过高，则就无法使用它们了。

　　当今，业内一般都使用`bilibili`开源出来的[ IJKPlayer ](https://github.com/Bilibili/ijkplayer)，像斗鱼TV之类的都是自己基于`IJKPlayer`改造的，技术方案比较成熟，稳定性方面比较可靠，使用起来也很简单，项目的编译脚本做的比较简单、灵活。

    -  优点：
       -  支持多种流媒体协议、文件压缩编码，功能强大的同时也可以依据自己的需求定制，灵活性高。
       -  在Github上开源已久，项目成熟，各路大牛一起维护，为你采坑！
       -  免费。
    -  缺点：
       -  生成的安装包略大。笔者运行官方的Demo，在一切保持默认的情况下，打出来的apk有6M多。

<br>　　稍后笔者会介绍一下自己在编译`ijkPlayer`时候所遇到的坑，节省您的时间。
　　
<br>**本节参考阅读：**
- [HLS直播技术方案及踩过的坑](http://www.koulianbing.com/?p=97)

## ijkplayer ##
　　刚才说到了`ijkPlayer`，本节就来简单的说一下`Mac`上编译的流程，由于`ijkPlayer`的版本会不断更新，因此请以[ 官方教程 ](https://github.com/Bilibili/ijkplayer)为准。　
<br>　　第一步，安装`git`，如果你没有安装过，请自行搜索，很简单。
　　第二步，配置`git`，即让`git`和你的`Github`帐号关联起来，[《Mac下的配置教程》](https://help.github.com/articles/generating-ssh-keys/#platform-mac)。
　　第三步，安装[ NDK r10e ](http://developer.android.com/intl/zh-cn/tools/sdk/ndk/index.html)、[Android SDK and Android Studio](https://developer.android.com/intl/zh-cn/sdk/index.html)，如果你有的话就跳过。
　　　　　　如果你没法翻墙可以去[ Android Studio 中文组 ](http://android-studio.org/index.php)。
　　　　　　由于红杏近期被封了，如果你想访问`Google`的话，可以使用[ huhamhire-hosts ](https://github.com/huhamhire/huhamhire-hosts/releases)。
<br>　　第四步，解压`NDK`。先把文件移动到你的工作目录，然后使用如下代码解压：
``` c
ndk$ chmod a+x android-ndk-r10c-darwin-x86_64.bin
ndk$ ./android-ndk-r10c-darwin-x86_64.bin
```
<br>　　第五步，配置`NDK`和`SDK`的路径，即创建下面两个环境变量：
``` c
cd ~
open .bash_profile
```
　　然后在窗口中加上类似如下的代码：
``` c
export ANDROID_NDK=/Users/cutler/Programer/ProgramFiles/android/android-ndk-r10e
export ANDROID_SDK=/Users/cutler/Programer/ProgramFiles/android/android-sdk-macosx
```
　　需要注意的是，修改完`.bash_profile`文件之后，我们需要重启终端窗口才能生效。

<br>　　第六步，使用下面的代码来下载最新版的代码：
``` c
git clone https://github.com/Bilibili/ijkplayer.git ijkplayer-android
cd ijkplayer-android
git checkout -B latest k0.3.2.2
```
　　笔者此时能看到的最新版就是`k0.3.2.2`，您在执行之前请去官网查看一下最新版的版本号。

<br>　　第七步，依次使用如下代码来初始化、编译`ijkPlayer`，要一条条执行，别一口气都执行了：
``` sh
cd ijkplayer-android
#下面这条语句会自动下载 ffmpeg 和 android-libyuv 依赖包。
#其中由于 ffmpeg 仓库在国外，故需要等待较长时间，本人以 15KB/s 的速度下载了两个多小时。
./init-android.sh

cd android/contrib
./compile-ffmpeg.sh clean
./compile-ffmpeg.sh all

cd ..
./compile-ijk.sh all
```

<br>　　第八步，将`android/ijkplayer`导入到`Android Studio`中，并在项目的根`build.gradle`文件中添加如下代码：
``` c
ext {
    compileSdkVersion = 22       // depending on your sdk version
    buildToolsVersion = "22.0.1" // depending on your build tools version
}
```
　　注意：`compileSdkVersion`和`22`之间是用`=`号相连的，而不是空格，笔者在这卡了很久。
<br>　　最后，就是编译运行项目了，如果你本地没有`platform-22`，那么可以使用`SDK Manager`下载，如果你没法翻墙，那么可以给`SDK Manager`配置如下代理：
``` c
代理服务器：mirrors.neusoft.edu.cn
端口：80
```
## 视频分辨率问题 ##

　　不出意外的话，在播放视频时你会遇到黑屏问题，导致黑屏的原因有很多，笔者要分享一个外行人不易发现的场景：低分辨率手机播放高分辨率视频会黑屏，或者只有声音没有画面。

    比如，你手上有一个1080*1920（宽*高）的视频，那么它在屏幕宽度>=1080的设备上大概率可以顺利播放，而在屏幕宽度<=720的设备上，大概率会黑屏或者只有声音没有画面。

    如果你拿一个720宽度的手机安装爱奇艺等App就会发现，它切换电影清晰度时是没有1080P这个选项的。但这不是绝对的，也存在有部分手机即便720宽度能播放1080的视频，以及1080的手机无法播放1080的视频，得看手机内部的视频编解码设置才行。

　　解决的方法很简单，在服务器提供多个尺寸的视频即可，即同时提供720和1080尺寸的视频，然后依据客户端屏幕的分辨率，来决定播放哪个尺寸的视频。
　　而各个视频门户网站提供切换清晰度的功能，既是用来通过节省流量来提高播放速度，也是用来针对不同的终端设备提供不同版本的视频。

# 第四节 动画 #

　　动画是多媒体中的一个重要组成部分，常见的各种炫酷的特效大部分都是通过动画来实现的。
<br>　　在`Android3.0`之前，我们有两种实现动画效果的方式：帧动画 和 视图动画。

    -  帧动画(Frame Animation)通过短时间内连续播放多张图片来实现动画效果，和电影类似。
    -  视图动画(View Animation)通过让View对象执行平移、缩放、旋转、透明四种操作，来达到动画效果。
　　从`Android 3.0`开始，系统推出了属性动画(`property animation`)，它的功能非常强大，弥补了之前视图动画的一些缺陷，几乎是可以完全替代掉视图动画了。

<br>**视图动画的缺点**

    -  第一，视图动画提供的功能只能作用在View对象上，所以如果你想动画非View对象，你要自己来实现。 
    -  第二，视图动画系统只能动画View对象几个方面，如缩放、平移等。它没法把View的背景颜色、字体颜色、margin、padding等属性进行动态变化。
    -  第三，视图动画不是会修改View本身。虽然你的动画在屏幕上移动一个按钮后，从屏幕上来看按钮确实被移动到了新的位置，但按钮实际的位置不会改变，所以你要实现自己的逻辑来处理这个问题。

<br>　　视图动画的缺点在属性动画中完全被消除了，你可以动画任何对象的任何属性（视图和非视图），并且对象本身实际（尺寸、位置等）也是会被修改。属性动画的缺点是：在`Android3.0`中才被提出。 
　　即便如此，现在也算是到了学习属性动画的时候了，截止至`2015/05/25`，配置`Android3.0`以下版本系统的设备已经不足`6%`了，换句话说我们现在完全可以把项目的`minSdkVersion`设置为`11`了。

## 视图动画 ##
　　虽然视图动画已经不常用了，但是我们仍然要介绍一下它们的用法。

　　在Android中实现视图动画的方式有两种：
    -  通过XML文件：在res/anim文件夹下面建立动画文件，每个动画文件对应一个xml文件。
    -  通过编写代码：直接在代码中new出一个动画对象。

　　Android提供了四种视图动画：`透明`、`平移`、`旋转`、`缩放`。

<br>**透明**

　　透明(`alpha`)动画 ，可以将一个`View`从某个透明度转变为另一个透明度。
<br>　　范例1：透明动画(`alpha.xml`)。
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <alpha 
        android:fromAlpha="1.0"
        android:toAlpha="0"
        android:duration="5000" />
</set>
```
    语句解释：
    -  本范例通过XML文件来定义一个透明动画，必须要将动画文件放到res/anim文件夹下。
    -  使用<alpha>标签来定义一个透明动画。

    属性解释：
    -  android:fromAlpha     控件的初始透明度。取值在0.0~1.0之间。1.0为完全不透明。
    -  android:toAlpha       动画结束时，控件的透明度。
    -  android:duration   播放动画时持续的时间。 

<br>　　范例2：播放动画。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img;
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        // 指定动画文件的资源ID ，将其从res/anim目录导入到程序中，并将其转换为一个Animation对象。
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.alpha);
        this.img.startAnimation(animation);
    } 
}
```
    语句解释：
    -  本范例是在ImageView上面播放刚才我们创建的透明动画。
 
<br>　　范例3：通过代码实现动画。
``` java
public class AndroidTestActivity extends Activity {
    private ImageView img; 
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        this.img = (ImageView) this.findViewById(R.id.img);
        // 直接实例化一个AlphaAnimation对象，构造方法为：AlphaAnimation (float fromAlpha,float toAlpha)。
        Animation animation = new AlphaAnimation(1.0f,0.1f);
        // 设置动画的播放时间，单位(毫秒)。
        animation.setDuration(4000);
        // 设置控件是否定格在动画播放完成后的状态。
        animation.setFillAfter(true);
        this.img.startAnimation(animation);
    } 
}
```
    语句解释：
    -  本范例是在ImageView上面播放刚才我们创建的透明动画。

<br>**平移**

　　平移(`translate`)动画，可以将指定的View从某一个位置移动到另一个位置。某个View的平移动画的播放范围是其父控件所占的空间。如下图所示： 

<center>
![](/img/android/android_4_6.png)
</center>

　　上图中`灰色部分`是一个线性布局，布局内有`TextView`和`Button`两个控件，若此时`按钮B`播放一个平移动画，那么`按钮B`的平移动画的`可视范围`则是线性布局所占据的区域，即上图中的灰色部分。 

<br>　　范例1：平移动画(`alpha.xml`)。
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate 
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="100"
        android:toYDelta="150"
        android:duration="3000" />
</set>
```
    属性解释：
    -  android:fromXDelta   设置动画移动时的起始X坐标。
    -  android:fromYDelta   设置动画移动时的起始Y坐标。
    -  android:toXDelta   设置动画移动时的结束X坐标。
    -  android:toYDelta   设置动画移动时的结束Y坐标。 

<br>　　对于平移动画的四个属性来说，其值可以使用百分比或具体数字来表示：

    -  若取值为百分比：则表示当前控件内部的某个位置。如“50%”。
    -  若取值为百分比p：则表示当前控件的父控件内部的某个位置。如“50%p”。
    -  若取值为具体常量：常量就是相对于当前控件的在未播放动画时的左上角坐标的偏移量。

　　因此，在范例1中，动画的起点就是按钮B的左上角，动画的终点就是左上角坐标沿着`x`轴偏移`100`像素，沿着`y`轴偏移`150`像素。 

<br>**旋转**

　　旋转(`rotate`)动画，可以将指定的View沿着某一个点从某一个角度旋转到另一个角度。旋转动画的可视范围同样是待播放动画的View的父控件所占据的空间。
<br>　　范例1：旋转动画。
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <rotate
        android:fromDegrees="0"
        android:toDegrees="-90"
        android:pivotX="50%"
        android:pivotY="50%"
        android:duration="3000" />
</set>
```
    属性解释：
    -  fromDegrees：设置控件(相对于0度)最初旋转角度，若值为0则控件不旋转。
    -  toDegrees：设置控件(相对于0度)最终旋转角度，若值与fromDegrees相等则控件不旋转。
    -  pivotX和pivotY：设置控件旋转时所用的参照点的X和Y轴坐标。
    -  若将fromDegrees或toDegrees属性的值设置为负数，则动画会按照逆时针旋转。

<br>　　范例2：`RotateAnimation`类。
``` java
// 根据指定的参数构造一个RotateAnimation对象。 
// 此构造方法默认是相对于屏幕上的某个点进行旋转。若想相对于控件本身或父元素旋转，则需要调用另一个构造方法。
public RotateAnimation(float fromDegrees, float toDegrees, float pivotX, float pivotY)

// 根据指定的参数构造一个RotateAnimation对象。
// 其中pivotXType和pivotYType指出当前动画旋转的参照点的类型，有三个取值：
// -  相对的(RELATIVE)：
//    -  Animation.RELATIVE_TO_SELF ：控件围绕自己内部的某点旋转。
//    -  Animation.RELATIVE_TO_PARENT ：控件围绕其父组件内部某点旋转。
// -  绝对的(ABSOLUTE)：
//    -  Animation.ABSOLUTE：控件围绕屏幕中的某个具体的点旋转。
// -  其中pivotXValue和pivotYValue的取值范围为：
// -  若Type设置为相对的(RELATIVE)，则取值范围是0.0~1.0之间。1.0就是100%。
// -  若Type设置为绝对的(ABSOLUTE) ，则取值可以是一个具体的数字。
public RotateAnimation(float fromDegrees, float toDegrees, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

<br>**缩放**

　　缩放(`scale`)动画，可以将指定的View沿着某一个点从某一个尺寸缩放到另一个尺寸。缩放动画的可视范围同样是待播放动画的View的父控件所占据的空间。
<br>　　范例1：缩放动画。
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <scale 
        android:fromXScale="1.0" 
        android:fromYScale="5.0"
        android:toXScale="3.0" 
        android:toYScale="1.0" 
        android:pivotX="50%"
        android:pivotY="50%" 
        android:duration="5000" />
</set>
```
    属性解释：
    -  android:fromXScale   设置控件最初在水平方向上被缩放的倍数，若为1.0则不缩放。
    -  android:fromYScale   设置控件最初在垂直方向上被缩放的倍数，若为1.0则不缩放。
    -  android:toXScale   设置控件最终在水平方向上被缩放的倍数。
    -  android:toYScale   设置控件最终在垂直方向上被缩放的倍数。
    -  android:pivotX       设置控件以某个中心点进行缩放时，中心点的X坐标。 
    -  android:pivotY       设置控件以某个中心点进行缩放时，中心点的Y坐标。

<br>　　范例2：反向。
``` xml
<scale
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXScale="1"
    android:fromYScale="1"
    android:toXScale="-1"
    android:toYScale="-1"
    android:pivotX="50%"
    android:pivotY="50%"
    android:duration="3000" />
```
    语句解释：
    -  若fromXScale、fromYScale、toXScale、toYScale四个属性的取值为负数，则：
       -  X轴会以中心点X轴坐标为准从右到左的反向。
       -  Y轴会以中心点Y轴坐标为准从上到下的反向。

<br>**AnimationSet**

　　使用`<set>`标签来定义动画集合，其内部可以嵌套其他动画，甚至是另一个`<set>`，`<set>`使用`AnimationSet`类来表示。
<br>　　范例1：一组动画。
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android" >
    <alpha
        android:duration="1000"
        android:fromAlpha="0.5"
        android:toAlpha="1.0" />
    <scale
        android:duration="1000"
        android:fromXScale="1"
        android:fromYScale="1"
        android:toXScale="0.5"
        android:toYScale="0.5" />
    <translate
        android:duration="1000"
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="150"
        android:startOffset="3000"
        android:toYDelta="150"/>
</set>
```
    语句解释：
    -  使用动画的android:startOffset属性可以设置其播放的开始时间，单位是毫秒。
    -  本范例中，当动画集合开始时会先播放前两个动画，等动画集已经播放三秒时，第三个平移动画才开始播放。

　　`<set>`标签支持如下两个属性：

    -  interpolator：表示AnimationSet所采用的插值器，插值器影响动画的速度。
      -  默认取值为@android:anim/accelerate_decelerate_interpolator。 
    -  shareInterpolator：表示AnimationSet中的动画是否和集合共享一个插值器。

<br>**Interpolators**

　　`Interpolators`是动画插值器，它可以影响动画的播放速度，可以对动画进行`加速`、`减速`、`重复`、`反弹`等。
　　所有的插值器都是`Interpolators`类的子类，现有的插值器如下表所示：
``` java
加速器类名               资源id
AccelerateDecelerateInterpolator    @android:anim/accelerate_decelerate_interpolator
AccelerateInterpolator          @android:anim/accelerate_interpolator
AnticipateInterpolator          @android:anim/anticipate_interpolator
AnticipateOvershootInterpolator     @android:anim/anticipate_overshoot_interpolator
BounceInterpolator          @android:anim/bounce_interpolator
CycleInterpolator           @android:anim/cycle_interpolator
DecelerateInterpolator          @android:anim/decelerate_interpolator
LinearInterpolator          @android:anim/linear_interpolator
OvershootInterpolator           @android:anim/overshoot_interpolator
```
　　使用的方法：
``` xml
<set android:interpolator="@android:anim/accelerate_interpolator">
    <!-- ... -->
</set>
```
    语句解释：
    -  interpolator属性的值必须指向加速器的资源Id，而不是类名。
    -  <set>标签的子标签也可以使用interpolator属性来指定自己的插值器。

　　插值器一个常见的应用场景是：

    播放旋转动画时，如果不为其指定插值器，则系统会默认使用AccelerateDecelerateInterpolator，此插值器的特点是，在动画开始时候加速，在动画结束的时候减速。
    如果我们想循环播放这个旋转动画的话，就会给人一种不连贯的感觉，此时就可以使用LinearInterpolator了，它会线性匀速的播放动画。

　　关于插值器，在属性动画一节会有详细的介绍，不明白的兄弟可以暂时存疑。

<br>**事件监听**

　　通过`Animation`的`setAnimationListener`方法可以给视图动画添加监听器，接口如下所示：
``` java
public static interface AnimationListener {
    // 动画开始播放时调用
    void onAnimationStart(Animation animation);
    // 动画播放结束时调用
    void onAnimationEnd(Animation animation);
    // 动画重复播放时调用
    void onAnimationRepeat(Animation animation);
}
```

<br>**出场动画**

　　在`ViewGroup`类中定义了`android:layoutAnimation`属性，用于给其子元素设置出场动画。

　　首先要创建一个布局动画文件：
<br>　　范例1：`res/anim/anim_layout.xml`。
``` xml
<layoutAnimation xmlns:android="http://schemas.android.com/apk/res/android"
    android:delay="5"
    android:animationOrder="normal"
    android:animation="@anim/fade_in">

</layoutAnimation>
```
    语句解释：
    -  delay属性：表示子元素开始动画的时间延迟。比如动画的持续时间是1秒，那么delay=5就表示除了第一个子元素之外的每一个子元素都要依次延迟5秒才开始播放。也就是说第一个子元素会立刻显示出来，第二个延迟5秒，第三个会延迟10秒，依次类推。delay的值也可以是小数，比如0.5就表示延迟时间为动画播放时间的一半。
    -  animationOrder属性：表示子元素播放动画的顺序。取值有三个：
       -  normal：顺序显示，即从第一个子元素开始播放入场动画。
       -  reverse：倒叙显示，即从最后一个子元素开始播放入场动画。
       -  random：随机播放入场动画。
    -  animation属性：每个子元素所要播放的动画。

<br>　　范例2：创建每个子元素所要播放的动画：`res/anim/fade_in.xml`。
``` xml
<alpha xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="1000"
    android:fromAlpha="0.0"
    android:interpolator="@android:anim/decelerate_interpolator"
    android:toAlpha="1.0" />
```
    语句解释：
    -  渐入动画，在1秒内让View从完全看不见到完全看的见。

<br>　　范例3：为控件设置动画。
``` xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:layoutAnimation="@anim/anim_layout"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="AAAAAAAAAAAAAAA"
        android:textSize="20sp" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="BBBBBBBBBBBBBBB"
        android:textSize="20sp" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="CCCCCCCCCCCCCCC"
        android:textSize="20sp" />

</LinearLayout>
```
    语句解释：
    -  任何ViewGroup的子类都可以使用android:layoutAnimation属性，通常用在ListView上。

　　提示：`android:layoutAnimation`属性是`API Level 1`中提供的，可以放心使用。

## 帧动画 ##

　　帧动画通过在短时间内连续播放多张图片来达到动画的效果。
<br>　　范例1：建立动画文件`res/drawable/look.xml`。
``` xml
<animation-list xmlns:android="http://schemas.android.com/apk/res/android" android:oneshot="false">
    <item android:drawable="@drawable/girl_1" android:duration="120" />
    <item android:drawable="@drawable/girl_2" android:duration="120" />
    <item android:drawable="@drawable/girl_3" android:duration="120" />
    <item android:drawable="@drawable/girl_4" android:duration="120" />
</animation-list>
```
    语句解释：
    -  帧动画的根标签为<animation-list>，帧动画的xml文件必须要放在res/drawable文件夹中。
    -  <item>标签描述帧动画中的每一帧所要显示的图片。

    属性解释
    -  android:oneshot   设置动画是否只播放一次。若值为false，则动画会循环播放。
    -  <item>标签的 android:drawable 当前帧所显示的图片。
    -  <item>标签的 android:duration 当前帧的持续时间（毫秒）。

<br>　　范例2：使用动画。
``` xml
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/look"
    android:onClick="onClick"
    android:id="@+id/img" />
```
    语句解释：
    -  使用<ImageView>的android:src属性来指向新建立好的动画文件look.xml。

<br>　　范例3：播放动画。
``` java
AnimationDrawable drawable = (AnimationDrawable) this.img.getDrawable();
drawable.start();
```
    语句解释：
    -  调用ImageView的getDrawable方法获取动画后，就可以启动动画了。
    -  提示：帧动画不可以通过AnimationUtils工具类获取，该类仅能获取视图动画。

<br>　　在`Activity`的`onCreate()`中调用`AnimationDrawable`的`start()`方法动画并不会被播放。
　　这是因为`AnimationDrawable`不能在不完全的窗口上运行，解决方法是在`onCreate()`方法之后的`onWindowFocusChanged()`方法中启动动画。


<br>　　范例4：在`onWindowFocusChanged`中。
``` java
public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if(hasFocus){ // 若当前Activity获得焦点。
        TextView text = (TextView) findViewById(R.id.text);
        AnimationDrawable drawable =(AnimationDrawable) text.getBackground();
        drawable.start();           
    }
}
```
    语句解释：
    -  onWindowFocusChanged方法将在Activity的onResume方法之后且用户可操作之前被调用。

## 属性动画 ##

　　在介绍属性动画之前，笔者要先统一下“动画”的概念：

    -  如果笔者说“让一个Button在3秒内放大两倍，其实就是在让它播放一个动画”，相信大家都不会有什么异议。
    -  那么仔细想一下，动画的本质其实就是，“让一个物体在指定时间内，从一个状态转变为另一个状态”。
    -  进而可以得出：“让一个int变量的值在3秒内从0过度到100，其实也就是让int变量播放一个动画”。

　　前面介绍的视图动画只支持四种（`缩放`、`平移`、`选择`、`透明`）操作，而且只能动画`View`对象。而接下来要介绍的属性动画可以对任何对象做动画，就像上面说的动画一个`int`变量。

　　此时你可能会有疑问，何时会需要动画一个`int`值呢？

    -  我们知道View类提供了scrollTo和scrollBy两个方法，用来滚动View的内容。如果屏幕高800，但是View的高度为1400，那它的内容就没法一屏显示出来，只能通过滚动才能看到后面的内容。
    -  但是scrollTo和scrollBy两个方有个缺点，它们被调用时会立刻将View的内容滚动到目标位置，也就是说没有滑翔过程，会给人很生硬的感觉。
    -  此时如果我们把滚动条的当前位置定义为i，那么就可以使用属性动画来动画这个i了，即让i在1秒内从当前位置变为目标位置。
    -  然后我们只需要在动画的过程中（可以给动画设置回调）不断的调用scrollTo或scrollBy即可。
　　如果不理解上面举的这个例子也没关系，你只需要知道：“动画一个`int`变量是很常见的一个操作”就行了。事实上，视图动画可以实现的功能，属性动画都可以实现。

<br>　　笔者在此声明，本节主要参考阅读下面三篇文章（有修改）：
- [Android属性动画完全解析(上)，初识属性动画的基本用法](http://blog.csdn.net/guolin_blog/article/details/43536355#)
- [Android属性动画完全解析(中)，ValueAnimator和ObjectAnimator的高级用法](http://blog.csdn.net/guolin_blog/article/details/43816093)
- [Android开发艺术探索 —— 第七章 Android动画深入分析](http://item.jd.com/1710650057.html)

### 基础入门 ###

　　属性动画有两个常用的类：`ValueAnimator`和`ObjectAnimator`，接下来依次介绍它们。

#### ValueAnimator ####
<br>　　范例1：`ValueAnimator`的用法很简单，比如说想要将一个值从`0`平滑过渡到`1`，时长`300`毫秒，就可以这样写：
``` java
// 使用ofFloat()方法来创建一个ValueAnimator对象，其中参数0和1就表示将值从0平滑过渡到1。
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
// setDuration()方法来设置动画运行的时长。
anim.setDuration(300);
// 启动动画。
anim.start();
```
    语句解释：
    -  本范例使用的是android.animation.ValueAnimator类。
    -  我们只需要将初始值和结束值提供给ValueAnimator，并且告诉它动画所需运行的时长，那么ValueAnimator就会自动帮我们完成从初始值平滑地过渡到结束值这样的效果。

<br>　　范例2：运行上面的代码时无法看到任何效果，需要借助监听器才能知道这个动画是否已经真正运行了，如下所示：
``` java
ValueAnimator anim = ValueAnimator.ofFloat(0f, 1f);
anim.setDuration(300);
anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    public void onAnimationUpdate(ValueAnimator valueAnimator) {
        System.out.println("cuurent value is " + valueAnimator.getAnimatedValue());
    }
});
anim.start();
```
    语句解释：
    -  在动画执行的过程中系统会不断地回调onAnimationUpdate()方法，我们只需要在回调方法当中将当前的值取出并打印出来。
    -  回调onAnimationUpdate()方法的时间间隔是ValueAnimator类根据你设置的初始值、结束值、动画时间三个参数来计算出来的，不需要我们设置，它会尽可能的让动画平滑的播放出来（即在使用最少的回调次数的基础上，保证动画流畅）。

<br>　　范例3：`ofFloat()`方法可以传入任意多个参数。
``` java
// 在3秒内从0过渡到5，再过渡到3，再过渡到10。
ValueAnimator anim = ValueAnimator.ofFloat(0f, 5f, 3f, 10f);
anim.setDuration(3000);
anim.start();
```
    语句解释：
    -  如果只是希望将一个整数值从0平滑地过渡到100，那么也很简单，只需要调用ValueAnimator.ofInt(0, 100)就可以了。
    -  调用anim.setRepeatCount()设置循环播放的次数，默认为1次，ValueAnimator.INFINITE为无限循环。
    -  调用anim.setRepeatMode()设置循环播放的模式：
       -  RESTART（默认），动画播放到结尾时，直接从开头再播放。
       -  REVERSE，动画播放到结尾时，再从结尾再往开头播放。
    -  除此之外，我们还可以调用anim.setStartDelay()方法来设置动画延迟播放的时间。

#### ObjectAnimator ####

　　`ObjectAnimator`是`ValueAnimator`的子类。
　　`ObjectAnimator`除了具有其父类的所有特性之外，还在父类的基础上增加了对对象属性进行动画功能，如动画`View`的`alpha`属性的值。
<br>　　范例1：修改透明度。
``` java
Button btn = (Button) findViewById(R.id.btn);
// 第一个参数是想动画的对象，第二个参数是该对象的属性。
ObjectAnimator animator = ObjectAnimator.ofFloat(btn, "alpha", 1f, 0f, 1f);
animator.setDuration(5000);
animator.start();
```
    语句解释：
    -  本范例用来将Button在5秒内从不透明变换成全透明，再从全透明变换成不透明。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "rotation", 0, 360)”则按钮就会被旋转。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "scaleY", 1f, 3f, 1f)”则按钮就会在垂直方向上进行缩放，然后还原。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "rotation", 0, 360)”则按钮就会被旋转。
    -  把代码改成“ObjectAnimator.ofFloat(btn, "translationX", curTranslationX, -500f)”则按钮就会从curTranslationX移动到-500。

<br>　　此时也许你会有一个疑问，就是`ObjectAnimator`的`ofFloat()`方法的第二个参数到底可以传哪些值呢？

    -  答案是，我们可以传入任意的值，系统在执行动画时会通过反射机制调用对象的get和set方法。
       -  比如，若我们给第二个参数传递abc，那么系统就是调用Button的setAbc和getAbc两个方法。
    -  只要在get和set方法中执行相应的操作即可。
　　相应的，`rotation`对应的就是`setRotation()`和`getRotation()`方法，这两个方法在`View`类中定义了。

<br>**引入一个问题**

　　我们现在有个需求，给`Button`加一个动画，让这个`Button`的`paddingLeft`从当前值增加到`500px`。按照上面的思路，我们可以这么写代码：
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void onClick(View button) {
        // 当Button被点击时，我们启动一个属性动画，修改Button的paddingLeft属性的值到500 。
        ObjectAnimator.ofInt(button, "paddingLeft", 500).setDuration(5000).start();
    }
}
```
　　上述代码运行后发现没效果，这是因为属性动画如果想成功运行，需要两个条件：

    -  object必须要提供set方法，如果动画的时候没有传递初始值，那么还要提供get方法，因为系统要去拿属性的初始值。
    -  object的set对属性所做的改变必须能够通过某种方法反映出来，比如会带来UI的改变之类的（如果这条不满足，动画就不会有效果）。
　　上面范例之所以不成功是因为`View`类没有`setPaddingLeft`方法，而只有`setPadding()`方法，为了实现这个需求，我们可以用一个类来包装原始的`Button`对象，代码为：
``` java
public class MainActivity extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void onClick(View button) {
        // 将按钮放到一个ViewWrapper中。
        ObjectAnimator.ofInt(new ViewWrapper(button), "paddingLeft", 500).setDuration(5000).start();
    }
    // 一个普通的包装类。
    public class ViewWrapper {
        private View mTarget;

        public ViewWrapper(View view) {
            this.mTarget = view;
        }

        public void setPaddingLeft(int paddingLeft) {
            mTarget.setPadding(paddingLeft, mTarget.getPaddingTop(),
                    mTarget.getPaddingRight(), mTarget.getPaddingBottom());
        }
    }
}
```
    语句解释：
    -  这样一来程序运行时就可以看到动画效果了。
    -  如果你修改完属性后View没有自动更新，那么你可以调用requestlayout()或invalidate()方法手动更新。


<br>**本节参考阅读：**
- [Android属性动画深入分析：让你成为动画牛人](http://blog.csdn.net/singwhatiwanna/article/details/17841165)

#### 组合动画 ####

　　我们可以通过`AnimatorSet`类来将多个动画组合到一起播放，这个类提供了一个`play()`方法，如果我们向这个方法中传入一个`Animator`对象（`ValueAnimator`的父类）将会返回一个`AnimatorSet.Builder`的实例。
　　`AnimatorSet.Builder`中包括以下四个方法：

    -  after(Animator anim)    将现有动画插入到传入的动画之后执行
    -  after(long delay)       将现有动画延迟指定毫秒后执行
    -  before(Animator anim)   将现有动画插入到传入的动画之前执行
    -  with(Animator anim)     将现有动画和传入的动画同时执行

<br>　　比如说我们想要让`Button`先从屏幕外移动进屏幕，然后开始旋转`360`度，旋转的同时进行淡入淡出操作，就可以这样写：
``` java
Button btn = (Button) findViewById(R.id.btn);
ObjectAnimator moveIn = ObjectAnimator.ofFloat(btn, "translationX", -500f, 0f);
ObjectAnimator rotate = ObjectAnimator.ofFloat(btn, "rotation", 0f, 360f);
ObjectAnimator fadeInOut = ObjectAnimator.ofFloat(btn, "alpha", 1f, 0f, 1f);
AnimatorSet animSet = new AnimatorSet();
animSet.play(rotate).with(fadeInOut).after(moveIn);
animSet.setDuration(5000);
animSet.start();
```
    语句解释：
    -  除了上面说的4个方法外，AnimatorSet类也提供了不少方法，比如playTogether、playSequentially等。

#### Animator监听器 ####
　　在`Animator`类当中提供了一个`addListener()`方法，这个方法接收一个`AnimatorListener`用于监听动画的各种事件了。

``` java
ValueAnimator anim = ValueAnimator.ofInt(0, 10);
anim.setDuration(1000);
// 动画播放的过程中，会回调此接口中的方法。
anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    public void onAnimationUpdate(ValueAnimator valueAnimator) {
        System.out.println(valueAnimator.getAnimatedValue());
    }
});
// 动画播放的状态改变时，会回调此接口中的方法。
anim.addListener(new Animator.AnimatorListener() {
    // 动画开始的时候调用
    public void onAnimationStart(Animator animation) { }
    // 动画重复执行的时候调用
    public void onAnimationRepeat(Animator animation) { }
    // 动画结束的时候调用
    public void onAnimationEnd(Animator animation) { }
    // 动画被取消的时候调用
    public void onAnimationCancel(Animator animation) { }
});
anim.start();
```

<br>　　为了方便使用，可以继承`AnimatorListenerAdapter`类，这样我们就可以只重写自己需要的方法了，如下所示：
``` java
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
    }
});
```
<br>
#### 使用XML编写动画 ####

　　通过`XML`来编写动画会比通过代码来编写动画要慢一些，但是在重用方面将会变得非常轻松。

　　如果想要使用`XML`来编写动画，首先要在`res`目录下面新建一个`animator`文件夹，所有属性动画的`XML`文件都应该存放在这个文件夹当中。然后在`XML`文件中我们一共可以使用如下三种标签：

    -  <animator>        对应代码中的 ValueAnimator
    -  <objectAnimator>  对应代码中的 ObjectAnimator
    -  <set>             对应代码中的 AnimatorSet

<br>　　比如说我们想要实现一个从`0`到`100`平滑过渡的动画，在`XML`当中就可以这样写：
``` xml
<animator xmlns:android="http://schemas.android.com/apk/res/android"
    android:valueFrom="0"
    android:valueTo="100"
    android:valueType="intType"/>
```
　　而如果我们想将一个视图的`alpha`属性从`1`变成`0`，就可以这样写：
``` xml
<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
    android:valueFrom="1"
    android:valueTo="0"
    android:valueType="floatType"
    android:propertyName="alpha"/>
```
　　其实`XML`编写动画在可读性方面还是挺高的，上面的内容不用解释也都能看得懂。

<br>　　另外，我们也可以使用`XML`来完成复杂的组合动画操作，比如将一个视图先从屏幕外移动进屏幕，然后开始旋转`360`度，旋转的同时进行淡入淡出操作，就可以这样写：
``` xml
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:ordering="sequentially" >
    <objectAnimator
        android:duration="2000"
        android:propertyName="translationX"
        android:valueFrom="-500"
        android:valueTo="0"
        android:valueType="floatType" >
    </objectAnimator>

    <set android:ordering="together" >
        <objectAnimator
            android:duration="3000"
            android:propertyName="rotation"
            android:valueFrom="0"
            android:valueTo="360"
            android:valueType="floatType" >
        </objectAnimator>

        <set android:ordering="sequentially" >
            <objectAnimator
                android:duration="1500"
                android:propertyName="alpha"
                android:valueFrom="1"
                android:valueTo="0"
                android:valueType="floatType" >
            </objectAnimator>
            <objectAnimator
                android:duration="1500"
                android:propertyName="alpha"
                android:valueFrom="0"
                android:valueTo="1"
                android:valueType="floatType" >
            </objectAnimator>
        </set>
    </set>
</set>
```
    语句解释：
    -  这段XML实现的效果和刚才代码实现的效果是一模一样的，每个参数的含义都非常清楚，相信一看就懂。
    -  另外，objectAnimator和animator标签除了上面的属性外，都还包含如下三个属性：
       -  startOffset、repeatCount、repeatMode
    -  实际上，objectAnimator标签只是比animator标签多了一个propertyName属性。

<br>　　`XML`文件是编写好了，可以使用如下代码进行播放：
``` java
// 加载动画。
Animator animator = AnimatorInflater.loadAnimator(context, R.animator.anim_file);
// 设置要播放此动画的View。
animator.setTarget(view);
// 开始播放。
animator.start();
```

### 高级用法 ###
#### 工作原理 ####
　　为了能深入理解属性动画的两个重要的概念：`TimeInterpolator`和`TypeEvaluator`，我们得需要先知道属性动画的工作流程。

　　假设我们现在需要动画`Button`的`translationX`属性，让它在`4`秒内从`0`变为`100`。
　　当我们调用它的`start`方法启动动画时，系统会执行如下过程：
    -  第一，会开启一个定时器，这个定时器每隔一段时间就会出发一次绘制动画的任务。
    -  第二，当绘制任务被触发时，会调用当前ObjectAnimator的TimeInterpolator字段来计算出一个跟时间有关系的比例值。
    -  第三，把计算出来的比例值交给当前ObjectAnimator的TypeEvaluator字段，由其来计算出动画当前的播放位置。
    -  第四，会通过反射的方式把第三步计算出的播放位置传递给目标方法，执行更新操作。

<br>　　此时你可能会有疑问，为什么要用到`TimeInterpolator`类呢？

    -  按照我们熟悉的逻辑，动画的播放进度是需要和时间相关的，也就是说当动画播放到1秒的时候，translationX的值应该是25，执行到2秒的时候值应该是50。这个逻辑其实是一个线性的变化，即动画的播放进度随着时间的推移，均匀的改变。
    -  但是在很多时候我们有更高的要求，比如希望动画以加速度或者减速度的形式播放，又或者希望动画在开始的部分加速播放，在结束的部分减速播放，这时候就需要用到TimeInterpolator类了。
    -  当绘制任务被触发时，系统会调用TimeInterpolator的getInterpolation方法，并传递过去一个数值input，这个数值表示动画当前已经播放的比率，TimeInterpolator会依据这个比率计算出最终的比率。
    -  最后，系统会把getInterpolation方法返回的结果当作动画最终的播放比例，进行后续的计算。

<br>　　事实上，`TimeInterpolator`类有很多现有的子类，比如`LinearInterpolator`类：
``` java
public class LinearInterpolator extends BaseInterpolator implements NativeInterpolatorFactory {

    public LinearInterpolator() { }
    public LinearInterpolator(Context context, AttributeSet attrs) { }

    public float getInterpolation(float input) {
        return input;
    }
}
```
    语句解释：
    -  由于系统默认就是线性变化，所以LinearInterpolator的getInterpolation方法直接将参数给返回了。

<br>　　再比如，`ValueAnimator`类默认使用的是`AccelerateDecelerateInterpolator`，它的源码为：
``` java
public class AccelerateDecelerateInterpolator extends BaseInterpolator
        implements NativeInterpolatorFactory {
    public AccelerateDecelerateInterpolator() { }
    public AccelerateDecelerateInterpolator(Context context, AttributeSet attrs) { }

    public float getInterpolation(float input) {
        return (float)(Math.cos((input + 1) * Math.PI) / 2.0f) + 0.5f;
    }
}
```
    语句解释：
    -  这个加速器的作用前面也已经说了，就是在动画开始的时候加速，在动画结束的时候减速。

<br>　　下图是笔者从网上找的一张图，简单的介绍了各个系统内置插值器的特点，但笔者没去验证它的真伪：

<center>
![](/img/android/android_d03_01.png)
</center>

<br>　　此时你可能还会有疑问，那`TypeEvaluator`类又是干什么的呢？

    -  我们已经知道，通过TimeInterpolator类计算出来的其实是动画已经播放的比率。也就是说，如果是线性插值器的话，当动画播放到第2秒时，比率的值就是0.5。
    -  但是比率毕竟是比率，我们还需要依据这个比率来计算出动画真正的位置。
    -  只有知道了的动画的当前位置，我们才能修改translationX的值，这时候就用到TypeEvaluator类了。

<br>　　事实上，`TypeEvaluator`类也有两个现成的子类，比如`IntEvaluator`类：
``` java
public class IntEvaluator implements TypeEvaluator<Integer> {

    public Integer evaluate(float fraction, Integer startValue, Integer endValue) {
        int startInt = startValue;
        return (int)(startInt + fraction * (endValue - startInt));
    }
}
```
    语句解释：
    -  在上面的代码中，如果把fraction替换成0.5的话，就可以很容易的计算出结果是什么。
    -  大声的告诉我，结果是什么？ 没错！就是它！

　　`TypeEvaluator`的另一个子类`FloatEvaluator`的代码和`IntEvaluator`相仿，不再冗述。

#### 源码阅读 ####

　　上面简单介绍了动画播放过程，接下来再从源码的角度来看一下。如现在需要执行如下代码：
``` java
ObjectAnimator moveIn = ObjectAnimator.ofFloat(button, "translationX", -500, 500);
moveIn.setDuration(1000);
moveIn.start();
```
    语句解释：
    -  注意：View类定义的setTranslationX方法接收的是float类型的参数，所以调用ObjectAnimator.ofInt方法是无效的。


<br>　　首先来看看`ObjectAnimator`类的`ofFloat`方法里面执行了哪些操作：
``` java
public static ObjectAnimator ofFloat(Object target, String propertyName, float... values) {
    ObjectAnimator anim = new ObjectAnimator(target, propertyName);
    anim.setFloatValues(values);
    return anim;
}
public void setFloatValues(float... values) {
    if (mValues == null || mValues.length == 0) {
        if (mProperty != null) {
            setValues(PropertyValuesHolder.ofFloat(mProperty, values));
        } else {
            // 由于是首次调用，所以会执行这个分支，即创建一个PropertyValuesHolder对象。
            setValues(PropertyValuesHolder.ofFloat(mPropertyName, values));
        }
    } else {
        super.setFloatValues(values);
    }
}
public void setValues(PropertyValuesHolder... values) {
    // 此处省略若干代码...
    mValues = values;
    // 此处省略若干代码...
}
```
    语句解释：
    -  在上面的代码中，只需要记住两个地方即可，因为后面会用到它们：
       -  第一，ObjectAnimator类有一个mValues属性后面会用到。
       -  第二，mValues属性是PropertyValuesHolder[]类型的。


<br>　　接着来看看`ObjectAnimator`类的`start`方法，它是动画执行时最先调用的方法：
``` java
public void start() {

    // 此处省略若干代码...

    super.start();
}
```
    语句解释：
    -  为了减少篇幅，就不把start方法里的代码贴出来，因为贴出来并没有什么屌用。
    -  省略掉的代码做的事情很简单，首先会判断如果正在播放的动画、等待的动画和延迟的动画中有和当前动画相同的动画，那么就把相同的动画给取消掉。
    -  最后调用父类的start方法。

<br>　　由于`ObjectAnimator`类继承了`ValueAnimator`类，所以接着看一下`ValueAnimator`类的`start`方法：
``` java
private void start(boolean playBackwards) {
    if (Looper.myLooper() == null) {
        throw new AndroidRuntimeException("Animators may only be run on Looper threads");
    }

    // 此处省略若干代码...

    AnimationHandler animationHandler = getOrCreateAnimationHandler();
    animationHandler.mPendingAnimations.add(this);
    if (mStartDelay == 0) {
        // This sets the initial value of the animation, prior to actually starting it running
        if (prevPlayingState != SEEKED) {
            setCurrentPlayTime(0);
        }
        mPlayingState = STOPPED;
        mRunning = true;
        notifyStartListeners();
    }
    animationHandler.start();
}
```
    语句解释：
    -  从上面的代码可以看出如下两点：
       -  属性动画需要运行在有Looper的线程中。
       -  动画被放到了一个AnimationHandler对象中，并调用AnimationHandler对象的start方法执行播放。

<br>　　接着继续跟进`AnimationHandler`类的`start`方法：
``` java
public void start() {
    scheduleAnimation();
}
private void scheduleAnimation() {
    if (!mAnimationScheduled) {
        mChoreographer.postCallback(Choreographer.CALLBACK_ANIMATION, mAnimate, null);
        mAnimationScheduled = true;
    }
}
final Runnable mAnimate = new Runnable() {
    public void run() {
        mAnimationScheduled = false;
        doAnimationFrame(mChoreographer.getFrameTime());
    }
};
void doAnimationFrame(long frameTime) {
    // 此处省略若干代码...
    for (int i = 0; i < numAnims; ++i) {
        ValueAnimator anim = mTmpAnimations.get(i);
        // 调用ValueAnimator的doAnimationFrame方法进行绘制
        if (mAnimations.contains(anim) && anim.doAnimationFrame(frameTime)) {
            mEndingAnims.add(anim);
        }
    }
    // 此处省略若干代码...
    if (!mAnimations.isEmpty() || !mDelayedAnims.isEmpty()) {
        // 检测是否还有未绘制的帧，如果有则再次安排下一帧的事件到Choreographer中。
        scheduleAnimation();
    }
}
```
    语句解释：
    -  在start方法内部会转调用scheduleAnimation方法，scheduleAnimation方法会将mAnimate安排到Choreographer中。
    -  Choreographer内部的代码我们不再继续深入了，因为它最终会回调mAnimate的run方法。

<br>　　在`ValueAnimator`的`doAnimationFrame`方法中又会依次调用`animationFrame`和`animateValue`方法。

``` java
void animateValue(float fraction) {
    // 调用当前动画的插值器，计算出动画播放的比率fraction。
    fraction = mInterpolator.getInterpolation(fraction);
    mCurrentFraction = fraction;
    int numValues = mValues.length;
    for (int i = 0; i < numValues; ++i) {
        // 将播放比率传递过去，计算出动画当前的播放位置。
        mValues[i].calculateValue(fraction);
    }
    if (mUpdateListeners != null) {
        int numListeners = mUpdateListeners.size();
        for (int i = 0; i < numListeners; ++i) {
            mUpdateListeners.get(i).onAnimationUpdate(this);
        }
    }
}
```
    语句解释：
    -  前面已经说了，mValues是PropertyValuesHolder[]类型的，而calculateValue方法是属于PropertyValuesHolder类的。

<br>　　接着查看`PropertyValuesHolder`类`calculateValue`方法：
``` java
void calculateValue(float fraction) {
    Object value = mKeyframes.getValue(fraction);
    mAnimatedValue = mConverter == null ? value : mConverter.convert(value);
}
```
    语句解释：
    -  前面也已经说了，当调用ObjectAnimator.ofFloat时会创建一个FloatPropertyValuesHolder对象。
    -  但是当时没有进一步查看FloatPropertyValuesHolder里的代码。
    -  现在回过头去就可以发现mKeyframes初始化代码为：KeyframeSet.ofFloat(values)。

<br>　　因此我们接下来要去查看`KeyframeSet`类的`getValue`方法：
``` java
public Object getValue(float fraction) {
    // 此处省略若干代码...

    return mEvaluator.evaluate(fraction, mFirstKeyframe.getValue(),
            mLastKeyframe.getValue());

    // 此处省略若干代码...
}
```
    语句解释：
    -  从上面的代码片段可以看出，在此方法中会调用动画的TypeEvaluator来计算出动画的实际位置，并将位置返回。

<br>　　至此，我们就完成了一开始说的，系统播放动画时所要执行的四步操作中的前三步的源码解读了，还剩最后一步：

    -  第四，会通过反射的方式把第三步计算出的播放位置传递给目标方法，执行更新操作。

　　但是目前来看，线索好像断了，我们无从追踪了。

　　不过不要慌！这里有个坑，那就是`ObjectAnimator`类重写了`animateValue`方法，我们来看一下重写后的代码：
``` java
void animateValue(float fraction) {

    // 此处省略若干代码...

    // 调用父类的方法计算当前动画播放的位置。
    super.animateValue(fraction);
    int numValues = mValues.length;
    for (int i = 0; i < numValues; ++i) {
        // 使用计算出来的播放位置，去绘制。
        mValues[i].setAnimatedValue(target);
    }
}
```
    语句解释：
    -  正如我们看到的那样，在调用父类的animateValue方法计算播放位置之后，它还有后续操作。
    -  由于知道了mValues里存放的是FloatPropertyValuesHolder类型的，所以直接去查看它的setAnimatedValue方法即可。

<br>　　阅读`setAnimatedValue`方法的源码：
``` java
void setAnimatedValue(Object target) {

    // 此处省略若干代码...

    if (mSetter != null) {
        try {
            mTmpValueArray[0] = mFloatAnimatedValue;
            mSetter.invoke(target, mTmpValueArray);
        } catch (InvocationTargetException e) {
            Log.e("PropertyValuesHolder", e.toString());
        } catch (IllegalAccessException e) {
            Log.e("PropertyValuesHolder", e.toString());
        }
    }
}
```
    语句解释：
    -  到这里就算圆满了，我们看到了反射相关的代码了。


#### 动画对象 ####

　　通过前面的学习，我们已经可以实现如下两种属性动画了：

    -  动画一个int或float值。
    -  动画一个对象的某个属性值。

　　本节就来介绍一下，如何动画一个对象。
<br>　　首先来定义一个`Point`类，如下所示：
``` java
public class Point {
    private float x;

    private float y;

    public Point(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }
}
```
    语句解释：
    -  Point类非常简单，只有x和y两个变量用于记录坐标的位置，并提供了构造方法来设置坐标。

<br>　　接下来定义`PointEvaluator`，如下所示：
``` java
public class PointEvaluator implements TypeEvaluator{
    @Override
    public Object evaluate(float fraction, Object startValue, Object endValue) {
        Point startPoint = (Point) startValue;
        Point endPoint = (Point) endValue;
        float x = startPoint.getX() + fraction * (endPoint.getX() - startPoint.getX());
        float y = startPoint.getY() + fraction * (endPoint.getY() - startPoint.getY());
        Point point = new Point(x, y);
        return point;
    }
}
```
    语句解释：
    -  这样我们就将PointEvaluator编写完成了，接下来我们就可以非常轻松地对Point对象进行动画操作了。

<br>　　比如说我们有两个`Point`对象，现在需要将`Point1`通过动画平滑过度到`Point2`，就可以这样写：
``` java
Point point1 = new Point(0, 0);
Point point2 = new Point(300, 300);
ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), point1, point2);
anim.setDuration(5000);
anim.start();
```
    语句解释：
    -  ValueAnimator.ofObject专门用来动画一个对象。

<br>　　接下来新建一个`MyAnimView`，在其内部播放动画，代码如下所示：
``` java
public class MyAnimView extends View {
    public static final float RADIUS = 50f;
    private Point currentPoint;
    private Paint mPaint;

    public MyAnimView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setColor(Color.BLUE);
    }

    protected void onDraw(Canvas canvas) {
        if (currentPoint == null) {
            startAnimation();
        } else {
            canvas.drawCircle(currentPoint.getX(), currentPoint.getY(), RADIUS, mPaint);
        }
    }

    private void startAnimation() {
        Point startPoint = new Point(RADIUS, RADIUS);
        Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);
        ValueAnimator anim = ValueAnimator.ofObject(new PointEvaluator(), startPoint, endPoint);
        anim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            public void onAnimationUpdate(ValueAnimator animation) {
                currentPoint = (Point) animation.getAnimatedValue();
                invalidate();
            }
        });
        anim.setDuration(5000);
        anim.start();
    }
}
```
    语句解释：
    -  自定义控件相关的知识在前面章节已经介绍了。

<br>　　然后我们只需要在布局文件当中引入这个自定义控件：
``` xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.example.cutler.androidtest.MyAnimView
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```
<br>　　我们可以再扩展一下，让圆形在移动的同时变色，代码如下：
``` java
private void startAnimation() {
    // 移动动画
    Point startPoint = new Point(RADIUS, RADIUS);
    Point endPoint = new Point(getWidth() - RADIUS, getHeight() - RADIUS);
    ValueAnimator moveAnim = ValueAnimator.ofObject(new PointEvaluator(), startPoint, endPoint);
    moveAnim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
        public void onAnimationUpdate(ValueAnimator animation) {
            currentPoint = (Point) animation.getAnimatedValue();
            invalidate();
        }
    });
    // 颜色变化的动画。 8位数字表示ARGB，每个颜色占2位。
    ValueAnimator colorAnim = ValueAnimator.ofInt(0xFF0000FF, 0xFFFF0000);
    colorAnim.setEvaluator(new ArgbEvaluator());
    colorAnim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
        public void onAnimationUpdate(ValueAnimator animation) {
            // 获取动画的当前值，并将它转为16进制的形式。
            String color = Integer.toHexString((Integer) animation.getAnimatedValue());
            // 设置画笔的颜色。
            mPaint.setColor(Color.parseColor("#" + color));
        }
    });
    // 同时播放这两个动画
    AnimatorSet animSet = new AnimatorSet();
    animSet.play(colorAnim).with(moveAnim);
    animSet.setDuration(5000);
    animSet.start();
}
```
    语句解释：
    -  动画的效果是什么，运行代码就知道了。

<br><br>