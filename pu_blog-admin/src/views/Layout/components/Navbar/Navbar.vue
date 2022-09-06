<template>
    <div class="navbar-container">
        <!--      侧边栏切换按钮 控制侧边栏显示、隐藏-->
        <!--     isCollapse:从vuex读取 -->
        <!--      toggleClick：修改vuex数据，和cookie数据-->
        <SideTrigger
            :is-collapse="isCollapse"
            @toggleClick="toggleClick"
            class="side-trigger-container"
        />
        <!--breadList：props-->
        <!--  面包屑导航，显示当前页面  -->
        <Breadcrumb class="breadcrumb-container" :breadList="breadList"/>

        <!--  右侧的功能菜单，门户网站、全屏显示、我的  -->
        <ul class="right-menu">
            <li @click="toFrontEnd">
                <el-tooltip content="门户页面" effect="dark" placement="bottom">
                    <i @click="toFrontEndPage" class="el-icon-s-platform"></i>
                </el-tooltip>
            </li>

            <li @click="fullScreenHandel">
                <el-tooltip content="全屏" effect="dark" placement="bottom">
                    <i class="el-icon-full-screen"></i>
                </el-tooltip>
            </li>
            <li>
                <el-dropdown
                    trigger="click"
                    class="profile-container"
                >
                    <!--右上角用户图片-->
                    <div class="profile-wrapper">
                        <img
                            style="width: 30px;height: 30px"
                            :src="loginUser.user_profile" alt="">
                        <i class="el-icon-arrow-down"></i>
                    </div>
                    <!--右上角用户下拉菜单-->
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="toPathHandle('/system/aboutMe')">关于我</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logoutHandle">退出</el-dropdown-item>
                    </el-dropdown-menu>

                </el-dropdown>

            </li>
        </ul>

    </div>
</template>

<script>
import SideTrigger from '@/components/SideTrigger/SideTrigger'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

import screenfull from 'screenfull'

import {mapMutations} from 'vuex'
import {appMutation, userMutation} from "@/store/mutation-types";


import {frontEndAddress} from "@/lib/config"
export default {
    name: "Navbar",
    props: {
        breadList: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        SideTrigger,
        Breadcrumb,
    },
    data() {
        return {}
    },
    methods: {
        ...mapMutations([
            appMutation.TOGGLE_SIDEBAR,
            userMutation.CLEAR_TOKEN,
            appMutation.REMOVE_ALL_TAGS,
        ]),


        toFrontEndPage(){
          window.open(frontEndAddress)
        },
        /**
         * @description 切换侧边导航显示或隐藏
         */
        toggleClick() {
            this[appMutation.TOGGLE_SIDEBAR]()
        },
        /**
         * @description 跳转前端
         */
        toFrontEnd() {
            window.open(process.env.FRONT_END_URL, '_blank')
        },


        /**
         * @description 全屏显示
         */
        fullScreenHandel() {
            // 先使用screenfull.enabled方法判断是否支持screenfull
            // 如果不允许进入全屏，发出不允许提示 浏览器不能全屏
            if (!screenfull.enabled) {
                this.$message({
                    message: '浏览器不能全屏',
                    type: 'warning'
                })
                return false
            }
            // 调用 screenfull.toggle() 可以双向切换全屏与非全屏
            screenfull.toggle()


        },

        /**
         * @description 跳转关于我
         */
        toPathHandle(url) {
            this.$router.push(url)
        },

        /**
         * @description 退出登录
         */
        async logoutHandle() {
            /**
             * 1、清除所有本地缓存中的信息 token、userInfo等等
             * 3、跳转到登录页
             */
            console.log('退出登录')
            await this.$store.dispatch('clearAll')
            await this.$router.push('/login')
        },


    },
    computed: {
        isCollapse() {
            return this.$store.state.app.sidebar.isCollapse
        },
        loginUser() {
            return this.$store.state.user.loginUserInfo
        },
    },
    watch: {},
    mounted() {
    }
}
</script>

<style scoped lang="scss">
@import "Navbar.scss";
</style>
