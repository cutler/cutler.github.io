---
title: 第三章 海外中台SDK架构
date: 2026-1-8 17:39:35
author: Cutler
categories: 其它技术
---

# 第一节 概述 #

## 什么是「中台」？

　　在企业架构里：

    前台：具体业务系统（APP、Web、H5、后台管理等）
    中台：沉淀的通用业务能力（用户、订单、商品、支付、风控、权限等）
    后台：底层基础设施（数据库、消息、云资源）

　　也就是说，中台SDK把全球化、多渠道、合规、稳定性这些复杂问题，统一封装给前台直接用，在移动出海场景下，中台SDK通常会包含：

    账号登录
    变现
    支付内购
    数据统计与事件埋点
    Push消息
    远程配置与AB实验
    崩溃与性能监控
    隐私合规

## 整体架构图

<center>
![](/img/android/android_12_1.png)
</center>

　　我们假设这个中台SDK名为“Global SDK”，它也是我们代码仓库的名称，其内各个文件夹的作用为：

    Docs：存放SDK的全部文档，包含SDK现有功能/用法介绍、版本迭代进度等信息。
    Android、IOS、Unity、Web：存放各个前端平台依据Docs的文档实现的具体SDK的代码。

<br>　　**sdk-api**
　　是一个Android Module库，保存基于Docs的需求来给各个功能定义对应接口和基础数据类。
　　其内只提供定义，具体的实现由后面会介绍的各个Module库来实现，宿主App开发者通过阅读sdk-api库的接口，就可以知道提供了哪些功能，功能需要什么参数等信息。

<br>　　**sdk-common**
　　是一个Android Module库，存放通用的工具类（文件读写、网络请求、文本处理等）。

<br>　　**sdk-modules**
　　是一个普通文件夹，存放各个具体的Module库，之所以创建此文件夹是为了美观，让业务Module集中存放。

<br>　　**sdk-core**
　　是一个Android Module库，它是宿主 App 与 SDK 交互的唯一合法通道，在其内部负责隐私政策检测、业务Module加载与获取等操作，其需要依赖sdk-api库。


<br>　　**Module Layer**
　　包含了各个具体的业务Module库，每个库都需要依赖sdk-api库，每个库都会提供对应功能的接口实现。


<br>　　**为什么要拆分这么多库？**

　　代码架构的本质是通过“各司其职”，让项目在变大的时候，不至于变成一团乱麻。理论上可以把sdk-common、sdk-api的代码都融入到sdk-core中，若真这么做了，日后就难搞了。

    sdk-api： 就像商场门口的导购手册和店面的招牌。顾客（宿主 App）进店前，只需要看手册就知道有什么服务（比如有“登录”、有“支付”）。他不需要知道店里的空调怎么走线，也不需要知道厨师是谁。
    sdk-common： 是商场后台的工具间，里面放着扳手、螺丝刀和电钻。商场里不管是卖奶茶的还是卖衣服的，都要用到这些工具。如果不拆出来，每个店都要自己买一套扳手。
    sdk-core： 是商场的物业经理，负责开门、关门和安检，所有的店（业务模块）都得听经理的。经理不点头（用户没点同意隐私协议），任何店都不准开门营业，哪怕店就在那里（AAR 已经下载了）。


<br>　　**为什么要放到一个Git项目里？**

　　是否放到一个项目里取决于你的实际情况，如果团队认为Android SDK的研发人员不应该有权限阅读Unity SDK的代码，则就可以将他们拆分成多个项目。

<center>
![](/img/android/android_12_3.png)
</center>

　　一般情况下，多项目的优势主要体现在安全与行政隔离上，而单项目便于调试。

# 第二节 核心实现 #

## 代码交互图 ##

<center>
![](/img/android/android_12_2.png)
</center>

    宿主App直接依赖sdk-core和各种Module库，其主要与sdk-core内提供的方法进行交互。
    sdk-api库定义了所有Module库需要实现的接口，不同的Module库只需要实现sdk-api库里的对应接口即可。
    sdk-core也需要依赖sdk-api库，其内需要对各个库进行初始化操作。
    sdk-common库可以被任何库使用。

## sdk-api ##

　　其内除了各个Module所需要的接口外，还可以将整个SDK内的通用接口定义到本库中。

　　下面是一个示例：
``` kotlin
/**
 * 统一的异步回调接口
 */
interface SDKCallback<T> {
    fun onSuccess(result: T)
    fun onError(code: Int, message: String)
}

// 此处也可以定义整个SDK的错误码

/**
 * 模块初始化接口
 */
interface IModuleLifeCycle {
    /**
     * 模块初始化逻辑
     * @param context 全局上下文，避免内存泄漏
     */
    fun onModuleInit(context: Context)
}

/**
 * 模块类型定义
 * 放在 sdk-api 中，确保宿主 App 在配置时可见
 */
enum class ModuleType {
    AUTH,    // 登录
    PAY,     // 支付
    ADS,     // 广告
    PUSH,    // 推送
    COMPLIANCE // 隐私合规模块（如 UMP）
}

/**
 * 用户信息模型
 */
data class UserInfo(val uid: String, val userName: String, val token: String)

/**
 * 订单信息模型
 */
data class OrderInfo(val orderId: String, val amount: Long, val currency: String)

interface IAuthApi {
    /**
     * 调起登录界面
     */
    fun login(activity: Activity, callback: SDKCallback<UserInfo>)

    /**
     * 退出登录
     */
    fun logout(callback: SDKCallback<Unit>)

    /**
     * 获取当前用户信息（同步）
     */
    fun getCurrentUser(): UserInfo?
}

interface IPayApi {
    /**
     * 发起支付请求
     */
    fun purchase(activity: Activity, order: OrderInfo, callback: SDKCallback<String>)

    /**
     * 查询未完成的补单逻辑（内部自动处理常见，但也提供接口）
     */
    fun queryPurchases(callback: SDKCallback<List<String>>)
}
```
    语句解释：
    -  UserInfo 类在 Modules Layer 的 auth 库中被使用。
    -  OrderInfo 类在 Modules Layer 的 biling 库中被使用。


## sdk-core ##

　　宿主App只与sdk-core库交互，其内提供（不限于）如下功能：

    统一的隐私政策管理逻辑，用户未同意隐私政策之前，不执行任何SDK初始化
    拉取在线配置（如果你有的话），依据配置做出不同的反应
    依据宿主提供的参数，依次初始化各个Module SDK


　　下面是一个示例：
``` kotlin
/**
 * 宿主App能访问到的单例对象
 */
object GlobalSDK {

    /**
     * 由宿主App实例化这个对象，用于初始化的各个参数
     */
    private var currentConfig: SDKConfig? = null

    /**
     * 第一步：宿主在 Application.onCreate 调用，传入参数
     */
    fun init(context: Context, config: SDKConfig) {
        this.currentConfig = config
        
        // 尝试加载模块（如果隐私已经同意过，这里直接就全开了）
        ModuleLoader.load(context, config)
    }

    /**
     * 第二步：隐私弹窗确认后，调用此方法“激活”SDK
     */
    fun onPrivacyAccepted(context: Context) {
        PrivacyManager.updatePrivacyStatus(context, true)
        
        // 激活后，重新触发模块加载
        currentConfig?.let {
            ModuleLoader.load(context, it)
        }
    }

    /**
     * 第三步：获取业务接口
     */
    fun <T> getService(serviceClass: Class<T>): T? {
        return ModuleRegistry.get(serviceClass)
    }
}

/**
 * 位于 sdk-core（或 sdk-api），用于定义初始化行为。
 */
class SDKConfig private constructor(
    val appId: String,
    val debugMode: Boolean,
    val enabledModules: List<ModuleType>
) {
    class Builder {
        private var appId: String = ""
        private var modules = mutableListOf<ModuleType>()
        
        fun setAppId(id: String) = apply { this.appId = id }
        fun addModule(type: ModuleType) = apply { modules.add(type) }
        
        fun build() = SDKConfig(appId, false, modules)
    }
}

/**
 * 负责记录用户是否点过“同意”。
 */
internal object PrivacyManager {
    private const val PREF_NAME = "sdk_privacy_prefs"
    private const val KEY_AGREED = "is_privacy_agreed"

    // 只有用户在 UMP 弹窗点了同意，这里才会被设为 true
    fun updatePrivacyStatus(context: Context, agreed: Boolean) {
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(KEY_AGREED, agreed).apply()
    }

    fun isAgreed(context: Context): Boolean {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getBoolean(KEY_AGREED, false)
    }
}

/**
 * 负责“反射+参数过滤”逻辑。
 */
internal object ModuleLoader {

    // 映射表：将枚举与具体的实现类全路径关联
    // 这样 core 只需要知道 API 枚举，通过反射去寻找 implementation 里的类
    private val MODULE_MAP = mapOf(
        ModuleType.AUTH to "com.globalsdk.module.auth.AuthImpl",
        ModuleType.ADS  to "com.globalsdk.module.ads.AdsImpl",
        ModuleType.PAY  to "com.globalsdk.module.pay.PayImpl"
    )

    /**
     * 核心加载方法
     */
    fun loadEnabledModules(context: Context, config: SDKConfig) {
        // 1. 隐私政策一票否决权
        if (!PrivacyManager.isAgreed(context)) {
            Log.e("GlobalSDK", "Privacy not agreed! Modules loading aborted.")
            return
        }

        // 2. 遍历宿主 App 开启的模块
        config.enabledModules.forEach { type ->
            val className = MODULE_MAP[type]
            if (className == null) {
                Log.w("GlobalSDK", "No implementation found for module: $type")
                return@forEach
            }

            // 3. 执行反射加载
            performReflectiveLoad(context, type, className)
        }
    }

    private fun performReflectiveLoad(context: Context, type: ModuleType, className: String) {
        // 如果已经加载过了，就不再重复加载
        if (ModuleRegistry.isModuleLoaded(type)) return

        try {
            // 反射实例化
            val clazz = Class.forName(className)
            val instance = clazz.getDeclaredConstructor().newInstance()

            // 4. 自动处理生命周期初始化
            if (instance is IModuleLifeCycle) {
                instance.onModuleInit(context.applicationContext)
                Log.i("GlobalSDK", "Module [$type] initialized successfully.")
            }

            // 5. 存入仓库供 getService 使用
            ModuleRegistry.register(type, instance)

        } catch (e: ClassNotFoundException) {
            // 宿主可能在配置里写了该模块，但 Gradle 没依赖 AAR，这里静默处理
            Log.e("GlobalSDK", "Module [$type] AAR not found in project. Did you add the dependency?")
        } catch (e: Exception) {
            Log.e("GlobalSDK", "Critical error loading module [$type]", e)
        }
    }
}

/**
 * 模块注册表（仓库）
 * 职责：内部存储所有已初始化的业务模块实例。
 * 作用：确保单例模式，避免重复反射创建对象。
 */
internal object ModuleRegistry {

    // 使用 ConcurrentHashMap 保证在多线程环境下（如异步初始化）存取实例的安全
    // Key: 接口的 Class 对象 (例如 IAuthApi::class.java)
    // Value: 具体的实现类对象 (例如 AuthImpl 实例)
    private val instances = ConcurrentHashMap<Class<*>, Any>()

    /**
     * 存入实例
     * 由 ServiceFetcher 在反射创建成功后调用
     */
    fun <T : Any> register(serviceClass: Class<T>, instance: T) {
        if (!instances.containsKey(serviceClass)) {
            instances[serviceClass] = instance
        }
    }

    /**
     * 取出实例
     * 由 GlobalSDK.getService 调用并返回给宿主 App
     */
    @Suppress("UNCHECKED_CAST")
    fun <T> get(serviceClass: Class<T>): T? {
        return instances[serviceClass] as? T
    }

    /**
     * 判断某个模块是否已经加载
     */
    fun isModuleLoaded(serviceClass: Class<*>): Boolean {
        return instances.containsKey(serviceClass)
    }

    /**
     * 彻底清空仓库（通常用于 SDK 重置或注销逻辑）
     */
    fun clear() {
        instances.clear()
    }
}
```

## module-auth ##

　　需要注意的是 module-auth 必须依赖 sdk-api，但它不需要依赖 sdk-core 。

　　下面是示意代码：
``` kotlin
/**
 * 登录模块的真正实现
 * 注意：这个类通常被标记为 internal，防止外部直接 new 它
 */
internal class AuthImpl : IAuthApi, IModuleLifeCycle {

    override fun onModuleInit(context: Context) {
        // 在这里初始化真正的三方 SDK
        // 例如：GoogleSignIn.getClient(context, gso)
        Log.d("AuthModule", "三方登录 SDK 已在此处完成初始化")
    }

    override fun login(activity: android.app.Activity, callback: SDKCallback<UserInfo>) {
        Log.d("AuthModule", "Starting login process...")
        
        // 这里模拟调用三方 SDK (比如 Google 或 Facebook 登录)
        // 只有 onModuleInit 执行过，这里的逻辑才是安全的
        val isSuccess = true 

        if (isSuccess) {
            val mockUser = UserInfo(
                uid = "user_12345",
                userName = "Gemini Partner",
                token = "ey...token_data"
            )
            callback.onSuccess(mockUser)
        } else {
            callback.onError(1001, "User cancelled login")
        }
    }

    override fun logout(callback: SDKCallback<Unit>) {
        Log.d("AuthModule", "Logging out...")
        // 执行清除 Token、断开连接等逻辑
        callback.onSuccess(Unit)
    }

    override fun getCurrentUser(): UserInfo? {
        // 实际开发中可以从 SharedPreferences 或内存中读取
        return null 
    }
}
```

　　别忘了需要在 module-auth 的混淆规则里加上：
``` java
# 保护实现类不被重命名，否则核心库反射找不到它
-keep class com.globalsdk.module.auth.AuthImpl {
    public <init>();
}
```
　　在 module-auth 的 build.gradle 中的依赖大概这么写：
``` java
dependencies {
    // 1. 只依赖契约
    implementation project(':sdk-api')
    
    // 2. 只依赖通用工具 (如 LogUtil, Network)
    implementation project(':sdk-common')
    
    // 3. 这里引入真正的三方 SDK 依赖
    // implementation 'com.google.android.gms:play-services-auth:20.x.x'
}
```

# 通用接入文档

## Google UMP

<br>　　在 2026 年的海外 App 开发环境下，Google 对<font color='red'>隐私政策</font>的重视程度已经可以用“<font color='red'>生存底线</font>”来形容。如果说几年前隐私政策只是一个“法律声明文件”，那么现在它已经演变成了一套全自动的监控与准入体系。

　　在用户同意隐私政策之前，App不允许搜集任何<font color='red'>用户相关的信息</font>，尤其是各类第三方SDK的初始化要谨慎。

    宿主 App 的开发者请务必谨慎，据说有一个程序员在公司的项目中，接入了黑产团队放出来性能监控SDK，后来 Google 打击到黑产团队，顺藤摸瓜找到了程序员接入的公司项目，Google 直接将公司的项目批量下架，要不是公司有点关系，整个公司的账号都会被封，公司损失至少百万美金。

<br>　　**1. 什么是 Google UMP SDK？**

　　**Google UMP (User Messaging Platform) SDK** 是 Google 提供的官方同意管理平台 (CMP)，它是专门为移动开发者设计的工具，用于在 App 中收集、管理并传递用户的隐私同意信号（Consent）。

    核心功能：自动检测用户地理位置，并根据当地法律（如欧洲 GDPR、美国加州 CCPA）动态展示合规的隐私弹窗。
    行业标准：该 SDK 基于 IAB（交互式广告局）的 TCF v2.2 框架，确保隐私信号能被广告系统和第三方合作伙伴正确识别。

　　在当前的监管环境下，不接入 UMP SDK 意味着面临巨大的合规风险和收入损失：

    1、Google 明确规定，所有在 欧洲经济区 (EEA) 和英国 展示广告的 App，必须使用经过认证的 CMP，未接入将导致该地区的广告零填充。
    2、虽然理论上可以自己设计隐私弹窗，但自行设计弹窗若不符合“层级化展示”或“撤回权”要求，将面临下架及巨额罚款。
    3、Google UMP 能在合规框架下引导用户开启“个性化广告”，相比非个性化广告，个性化广告的 eCPM（千次展示收益）通常高出数倍。

<br>　　**2. “授权前零搜集”原则**

    时机要求：在用户点击隐私弹窗的“同意”按钮之前，App 严禁初始化任何涉及用户画像、设备特征、位置信息的 SDK。
    执行逻辑：开发者必须在 UMP SDK 回调并确认 `canRequestAds() == true` 之后，才能初始化 AdMob、Firebase Analytics、Adjust 或 Facebook 等第三方组件。

<br>　　**3. UMP 标准执行流程**

|  阶段 | 关键操作说明 |
|  :--- | :--- |
|  **后台配置** | 在 AdMob 控制台“隐私权和消息”菜单中创建 GDPR/CCPA 表单。 |
|  **状态探测** | App 启动时调用 `requestConsentInfoUpdate` 检查当前用户是否受限于隐私法。 |
|  **表单呈现** | 若 `isConsentFormAvailable` 为真且用户尚未授权，则调用 `loadAndShowConsentFormIfRequired`。 |
|  **业务激活** | 在授权成功的回调逻辑中，初始化广告引擎和统计插件。 |

　　上述四个步骤是大家自己接入UMP所需执行的，如果接入GlobalSDK则只需要执行第一步即可，后续步骤由SDK来完成。

<br>　　**4. 接入代码**

``` java
val privacyService = GlobalSDK.getService(IPrivacyApi::class.java)
// 4. 发起 UMP 授权请求
privacyService?.requestConsent(this, object : SDKCallback<Boolean> {
    override fun onSuccess(isAgreed: Boolean) {
        if (isAgreed) {
            // 用户同意了！
            // 告知 GlobalSDK 激活所有被拦截的业务模块
            GlobalSDK.onPrivacyAccepted(applicationContext)
            println("GlobalSDK____________________ : 同意！")
        } else {
            // 用户拒绝（或者是非监管地区未弹窗但逻辑返回 false）
            // 根据你的产品策略决定：是退出 App 还是限制功能运行
            println("GlobalSDK____________________ : 拒绝！")
        }
    }

    override fun onError(code: Int, message: String) {
        // 处理网络错误或 UMP 加载失败
        println("GlobalSDK____________________ : $message")
        // 建议兜底：如果请求失败，可以根据策略决定是否允许用户先进入游戏
    }
})
```



<br><br>