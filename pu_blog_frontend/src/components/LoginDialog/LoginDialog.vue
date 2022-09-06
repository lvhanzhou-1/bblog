<template>
    <div class="">
        <el-dialog

            :append-to-body="true"
            :visible.sync="isShow"
            width="500px"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
            :before-close="beforeCloseHandle"
            custom-class="login-dialog-custom"
        >
            <div v-if="isLogin">
                <el-form class="login-form" :rules="rules" :model="loginForm">

                    <el-form-item prop="username_email">
                        <el-input
                            type="text"
                            placeholder="请输入邮箱"
                            v-model="loginForm.username_email"
                            clearable>
                            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="loginForm.password"
                            clearable
                            @keyup.enter.native="handleLogin"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                    </el-form-item>

                    <el-checkbox v-model="loginForm.isRememberMe" style="margin: 0 0 25px 0">
                        <span style="color: #3f3f3f">七天免登录</span>
                    </el-checkbox>

                    <el-form-item>
                        <el-button
                            type="primary"
                            style="width:100%;"
                            @click.native.prevent="handleWebUserLogin"
                        > 登录
                        </el-button>
                    </el-form-item>

                </el-form>

                <div class="icon-btns-box">
                    <p style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:right;"
                       @click="changeIsLogin()">注册</p>
                </div>
            </div>

            <div v-if="!isLogin">
                <el-form class="login-form" :rules="rules" :model="registerForm">

                    <el-form-item prop="nickName">


                        <IconFont style="cursor: pointer" :icon-class="{width:'50px',height:'50px'}"
                                  :icon-href="`icon-${registerForm.user_profile}`"></IconFont>


                        <el-popover
                            placement="bottom"
                            width="770"
                            trigger="click">

                            <div>
                            <span @click="chooseIcon(item.font_class)" v-for="(item) in glyphsArr" :key="item.icon_id"
                                  style="padding: 2px;display: inline-block;cursor: pointer">
                                <IconFont :icon-class="{width:'50px',height:'50px'}"
                                          :icon-href="`icon-${item.font_class}`"></IconFont>
                            </span>
                            </div>

                            <el-button
                                slot="reference"
                                type="primary"
                                style="width:40%;margin-left: 10%;"
                            > 点击选择头像
                            </el-button>

                        </el-popover>


                    </el-form-item>


                    <el-form-item prop="nickName">
                        <el-input
                            type="text"
                            placeholder="请输入昵称"
                            v-model="registerForm.nickName"
                            clearable>
                            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="username_email">
                        <el-input
                            type="text"
                            placeholder="请输入邮箱"
                            v-model="registerForm.username_email"
                            clearable>
                            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="registerForm.password"
                            clearable
                            @keyup.enter.native="handleLogin"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password_second">
                        <el-input
                            type="password"
                            placeholder="请再次输入密码"
                            v-model="registerForm.password_second"
                            clearable
                            @keyup.enter.native="handleLogin"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="code">
                        <el-input
                            type="text"
                            style="width: 50%"
                            placeholder="请输入验证码"
                            v-model="registerForm.code"
                            clearable
                            @keyup.enter.native="handleLogin"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                        </el-input>
                        <el-button
                            type="primary"
                            style="width:40%;margin-left: 10%;"
                            @click.native.prevent="getCode"
                            :disabled="!isCanBeClicked"
                        >{{ btnContent }}
                        </el-button>

                    </el-form-item>


                    <el-form-item>
                        <el-button
                            type="primary"
                            style="width:100%;"
                            @click.native.prevent="handleWebUserRegister"
                        > 确认注册
                        </el-button>
                    </el-form-item>

                </el-form>

                <div class="icon-btns-box">
                    <p style="font-size:14px;line-height:30px;color:#999;cursor: pointer;float:right;"
                       @click="changeIsLogin()">登录</p>
                </div>
            </div>


        </el-dialog>
    </div>
</template>

<script>
import {userMutation} from "../../../../pu_blog-admin/src/store/mutation-types";
import {webUserApi} from "@/api/webUser";

import IconJson from '@/assets/iconfont/iconfont.json'


export default {
    name: "LoginDialog",
    data() {
        return {
            isLogin: true,

            isShow: true,
            identifyCodes: "1234567890",
            identifyCode: "",
            errorInfo: false,
            loginForm: {
                username_email: '',
                password: '',
                isRememberMe: false
            },

            // isShowIconList: false,
            registerForm: {
                user_profile: '20',
                username_email: '',
                password: '',
                nickName: '',
                password_second: '',
                code: ''
            },

            genCode: '',
            expires: '',


            rules: {
                nickName: [
                    {required: true, message: '请输入昵称', trigger: 'blur'}
                ],
                username_email: [
                    {required: true, message: '请输入邮箱名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],

                password_second: [
                    {required: true, message: '请确认密码', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: '请输入验证码', trigger: 'blur'}
                ],

            },

            isCanBeClicked: true,
            totalTime: 60,
            btnContent: '获取验证码',
        }
    },
    methods: {

        // showIconProfile() {
        //     this.isShowIconList = !this.isShowIconList
        //
        // },
        chooseIcon(font_class) {
            this.registerForm.user_profile = font_class
        },
        async getCode() {
            /*
            * 如果有邮箱信息，就发送给验证码
            *   后台校验邮箱是否被注册
            *   没有注册过，就提示信息，进入倒计时
            * 没有邮箱，提示
            * */
            if (this.registerForm.username_email) {
                let {data} = await webUserApi.sendCodeEmail({username_email: this.registerForm.username_email})
                if (data.code) {
                    this.$message({
                        message: '成功发送验证码',
                        type: 'success'
                    })
                    this.genCode = data.data.code
                    this.expires = data.data.expires

                    if (this.isCanBeClicked) {
                        this.isCanBeClicked = false;
                        let timer = setInterval(() => {
                            this.totalTime -= 1
                            this.btnContent = `${this.totalTime}s`

                            if (this.totalTime < 0) {
                                clearInterval(timer)
                                this.isCanBeClicked = true
                                this.totalTime = 60
                                this.btnContent = '获取验证码'
                            }
                        }, 1000)
                    }
                }
            } else {
                this.$message({
                    message: '请输入邮箱',
                    type: "info"
                })
            }
        },
        async handleWebUserRegister() {
            /**
             * 发送前确认各个参数是否齐全
             * 注册完后转到登录页
             * */
            if (this.registerForm.nickName && this.registerForm.username_email && this.registerForm.password && this.registerForm.code && this.registerForm.password_second) {
                if (this.registerForm.password_second !== this.registerForm.password) {
                    this.$message({
                        message: '确认密码和第一次输入密码不一致'
                    })
                } else if (this.registerForm.code !== this.genCode) {
                    this.$message({
                        message: '验证码不正确'
                    })
                } else {
                    await webUserApi.webUserRegister({
                        user_profile: this.registerForm.user_profile,
                        userName: this.registerForm.nickName,
                        username_email: this.registerForm.username_email,
                        password: this.registerForm.password
                    })

                    this.$message({
                        message: '注册成功，请登录',
                        type: "success"
                    })
                    /*注册成功后，转到登录界面*/
                    this.isLogin = !this.isLogin
                }
            }

        },
        changeIsLogin() {
            this.isLogin = !this.isLogin
        },
        async handleWebUserLogin() {
            /*登录前判断参数是否齐全*/

            let {data} = await webUserApi.webUserLogin(this.loginForm)

            if (data.code === 1) {

                // 将token存到本地缓存中
                await this.$store.commit(userMutation.SET_TOKEN, data.data)

                //获取用户信息
                await this.$store.dispatch('setLoginUserInfo', this.loginForm.username_email)

                // 刷新浏览器
                window.location.reload()


            } else {
                this.$message({
                    message: data.extendInfo ? data.extendInfo : data.msg,
                    type: 'error',
                    duration: 1500,
                })
            }
        },


        beforeCloseHandle(done) {
            this.$emit('closeLoginHandle')
            done()
        },

        giteeClickHandle() {
            this.$emit('giteeClickHandle')
        },

        qqClickHandle() {
            this.$emit('qqClickHandle')
        },
    },
    computed: {
        glyphsArr() {
            let obj = IconJson
            let glyphsArr = obj.glyphs
            return glyphsArr.filter(item => {
                if (item.name.includes('头像') || item.name.includes('avatar')) {
                    return item
                }
            })

        }
    },
    // mounted() {
    //     console.log(this.glyphsArr);
    // }
}
</script>

<style scoped lang="scss">
//@import "LoginDialog";
.login-form {
    margin-left: 50px;
    margin-right: 50px;

}

.icon-btns-box {
    padding-bottom: 10px;
}

</style>
