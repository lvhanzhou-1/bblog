<template>
    <div class="header-nav-container">
        <div class="logo-box">
            <slot name="logo"></slot>
        </div>
        <ul class="nav-list">
            <li v-for="(item) in navList" :key="item.path" @click="navigatorTo(item.path)">{{ item.meta.title }}</li>
            <li @click="toAdminAddress">后台管理<span class="iconfont icon-caozuo-wailian"></span></li>
        </ul>


        <!--  未登录时 默认显示一个未登录的小头像  -->
        <div v-if="!isLogin" class="user-unlogin" @click="showLoginDialogHandle">

            <el-tooltip content="点击登录/注册" placement="top">
                <!--                <IconFont :icon-class="{width:'35px',height:'35px'}" :icon-href="'icon-gerenzhongxin'"></IconFont>-->
                <i class="el-icon-user" style="color: #525252"></i>
            </el-tooltip>

        </div>

        <!--  登录后 显示用户的头像  -->
        <div v-else class="user-login">
            <el-dropdown
                trigger="click"
            >
                <el-image
                    :src="loginUserInfo.user_profile"
                ></el-image>
<!--                <div class="avator">-->
<!--                    <IconFont :icon-class="{width:'35px',height:'35px'}"-->
<!--                              :icon-href="`icon-${loginUserInfo.user_profile}`"></IconFont>-->
<!--                </div>-->


                <el-dropdown-menu slot="dropdown">

                    <!--                    <el-dropdown-item-->
                    <!--                        divided-->
                    <!--                        disabled-->
                    <!--                        icon="el-icon-setting"-->
                    <!--                        @click.native="navigatorTo('/user/settings')"-->
                    <!--                    >设置-->
                    <!--                    </el-dropdown-item>-->

                    <el-dropdown-item
                        divided
                        icon="el-icon-switch-button"
                        @click.native="logoutHandle"
                    >退出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </div>


        <!--  登录组件  -->
        <div class="login-component-box" v-if="isShowLoginBox">
            <LoginDialog2
                @giteeClickHandle="giteeClickHandle"
                @qqClickHandle="qqClickHandle"
                @closeLoginHandle="closeLoginHandle"
            />
        </div>


    </div>
</template>

<script>
/**
 * 用户登录注册
 *   登录：
 *       用户输入邮箱，密码，验证码（前端生成并在发送前校验），
 *       送给后端：
 *           如果没有查到信息，返回错误码，前端提示 是否转到注册板块
 *           如果有信息：
 *                   如果密码正确，登录成功，返回token
 *                   密码不正确，返回错误码，提示密码错误
 *    注册：
 *       用户输入昵称，邮箱，密码，重复密码，点击获取验证码
 *       点击获取验证码：
 *           后台收到以后先检查该邮箱是否被注册过，如果有，则返回错误代码
 *           调用nodemailer发送邮箱给指定邮箱，此外，后端需要将验证码返回给前台用来比较
 *           用户获取以后和其他信息一起发到后端，发送前，比较验证码是否一致
 *       收到用户信息后将数据保存起来，并自动生成token返回
 *
 *       数据库设计：直接使用已有的
 *       后端接口，发送验证码接口，登录接口，注册接口
 *       前端：登录和注册页面
 *           登录：邮箱，密码，
 *           注册：昵称，邮箱，密码，重复密码，点击获取验证码
 *
 * */


// import LoginDialog from "@/components/LoginDialog/LoginDialog";
import LoginDialog2 from "@/components/LoginDialog2/LoginDialog2";
import {indexMutation, userMutation} from '@/store/mutation-types'
import admin_address, {myGiteeLogin} from "@/config/config";

export default {
    name: "HeaderNav",
    props: {
        navList: {
            type: Array,
            default: () => []
        },
    },
    components: {
        // LoginDialog,
        LoginDialog2
    },
    data() {
        return {
            // isShowLoginBox: false, // 是否弹出登录框
            oAuthWindow: null, // 第三方登录框,

        }
    },
    methods: {

        giteeClickHandle() {
            this.oAuthWindow = open(
                `https://gitee.com/oauth/authorize?client_id=${this.gitee_client_id}&redirect_uri=${this.baseURL}/oauth/callback/gitee&response_type=code`,
                'giteeOauth',
                'width=900,height=700'
            )
            // gitee授权参考地址：https://www.eoway.cn/article/1603360705.html
            // window.open(
            //     `https://gitee.com/oauth/authorize?client_id=${this.gitee_client_id}&redirect_uri=${this.baseURL}/oauth/callback/gitee&response_type=code`,
            //
            // )

        },
        qqClickHandle() {
            // 参考：https://juejin.cn/post/6977399909532041247
            // 参考：https://wiki.connect.qq.com/%e4%bd%bf%e7%94%a8authorization_code%e8%8e%b7%e5%8f%96access_token
            // this.oAuthWindow = open(
            //     `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${this.qq_client_id}&redirect_uri=${this.baseURL}/oauth/callback/qq&state=cheny`,
            //     'qqOauth',
            //     'width=783,height=599'
            // )

            // window.open(
            //     `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${this.qq_client_id}&redirect_uri=${this.baseURL}/oauth/callback/qq&state=cheny`,
            //     'qqOauth',
            //     'width=783,height=599')
        },
        toAdminAddress() {
            console.info("🚀 ~ file:HeaderNav method:toAdminAddress line:116 -----", admin_address)
            window.open(admin_address)
        },
        // https://gitee.com/oauth/authorize?client_id=515c141d9ef70ab32319c93c7233c6f859d979d1bf99404961bb1168dcf8e050&redirect_uri=http://127.0.0.1:7001/oauth/callback/gitee&response_type=code
        async logoutHandle() {
            /**
             * 1、清除所有本地缓存中的信息 token、userInfo等等
             */
            await this.$store.dispatch('clearAll')
            await this.$router.push('/')
            // 刷新浏览器
            window.location.reload()

        },


        showLoginDialogHandle() {
            // this.isShowLoginBox = true
            this.$store.commit(indexMutation.SHOW_LOGIN_DIALOG)
        },
        closeLoginHandle() {
            // this.isShowLoginBox = false
            this.$store.commit(indexMutation.HIDDEN_LOGIN_DIALOG)
        },


        navigatorTo(path) {
            this.$router.push({
                path,
            })
        },

        handleSelect(index, path) {
            if (path[0] === 'outerLink') {
                window.open(index)
            }
        },

    },
    computed: {
        // 是否是演示版本
        // isDemoVersion() {
        //     return isDemoVersion // 加载到了全局，直接获取
        // },

        gitee_client_id() {
            /*
            * gitee申请第三方登录时，最自由
            * 服务器端的回调接口地址可以写成下面很多种形式
            * 1、http://localhost:20517/oauth/gitee  //可以是本地的带端口号的
            * 2、http://你的服务器ip:20517/oauth/gitee  //可以是本地的带端口号的
            * 3、http://你备案后的域名:20517/oauth/gitee  //域名带端口号的
            * 4、http://你备案后的域名/oauth/gitee  //不带端口号的
            * 因为几乎没有限制，所以本地登录的时候先学gitee入门，qq和微博就限制的比较多了，需要有备案的域名
            * */
            let client_id
            if (process.env.NODE_ENV === 'development') { // 开发环境
                client_id = myGiteeLogin.client_id_development
            } else { // 生产环境
                // if (this.isDemoVersion) {
                //     client_id = myGiteeLogin.client_id_production
                // } else {
                client_id = myGiteeLogin.client_id_production
                // }
            }
            return client_id
        },
        baseURL() {
            // let baseURL = process.env.VUE_APP_BASE_URL
            // if (process.env.NODE_ENV === 'development') { // 开发环境
            //     baseURL = myConfig.apiUrlDevelopment
            // } else { // 生产环境
            //     if (this.isDemoVersion) {
            //         baseURL = myConfig.apiUrlDemo
            //     } else {
            //         baseURL = myConfig.apiUrlProduction
            //     }
            // }
            return process.env.VUE_APP_BASE_URL
        },

        isLogin() {
            return !!this.$store.state.user.token
        },
        loginUserInfo() {
            return this.$store.state.user.loginUserInfo
        },
        // 是否弹出登录框
        isShowLoginBox() {
            return this.$store.state.isShowLoginBox
        },
    },
    watch: {},
    mounted() {

        // 接收弹出的第三方授权窗口返回的token
        // 跨窗口通信：https://segmentfault.com/a/1190000015127237
        // 弹窗：https://zh.javascript.info/popup-windows
        window.addEventListener('message', e => {
            console.info("🚀 ~ file:HeaderNav method: line:236 -----e", e)

            if (/Bearer/.test(e.data)) {
                let token = e.data

                // try {
                // this.oAuthWindow.close()
                // } catch (e) {

                // window.open("https://www.baidu.com")
                // console.info("🚀 ~ file:HeaderNav method: line:246 ----- await this.oAuthWindow.close()", '!!')
                // }
                this.closeLoginHandle()

                // 将token存到本地缓存中
                this.$store.commit(userMutation.SET_TOKEN, token)
                // 刷新浏览器
                window.location.reload()

            }
        }, false)


        // 接收弹出的第三方授权窗口返回的token
        // 跨窗口通信：https://segmentfault.com/a/1190000015127237
        // 弹窗：https://zh.javascript.info/popup-windows
        // window.addEventListener('message', e => {
        //     console.log('e');
        //     console.log(e);
        //
        //     if (/Bearer/.test(e.data)) {
        //
        //         let token = e.data
        //
        //         this.oAuthWindow.close()
        //         this.closeLoginHandle()
        //
        //         // 将token存到本地缓存中
        //         this.$store.commit(userMutation.SET_TOKEN, token)
        //         // 刷新浏览器
        //         window.location.reload()
        //
        //     }
        // }, false)
    }
}
</script>

<style lang="scss" scoped>
@import "HeaderNav";
</style>
