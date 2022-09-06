<template>
    <div class="layout-container" >
        <!--  头部导航  -->
        <header>
            <HeaderNav :navList="navList">
                <div slot="logo" class="logo" @click="$router.push('/')">Lhz's Blog</div>
            </HeaderNav>
        </header>
        <div style="height: 60px"></div>
        <!--  内容展示  -->
        <main>

            <!-- <transition name="transitionRouter"> -->
                <router-view/>
            <!-- </transition> -->
        </main>
        <!--  网站底部  -->
        <footer>
            <FooterNav/>
        </footer>



<!--        <vue-particles-->
<!--            class="layout-bg"-->
<!--            color="#6495ED"-->
<!--            :particleOpacity="0.3"-->
<!--            :particlesNumber="50"-->
<!--            shapeType="circle"-->
<!--            :particleSize="8"-->
<!--            linesColor="#6495ED"-->
<!--            :linesWidth="1"-->
<!--            :lineLinked="true"-->
<!--            :lineOpacity="0.4"-->
<!--            :linesDistance="150"-->
<!--            :moveSpeed="3"-->
<!--            :hoverEffect="true"-->
<!--            hoverMode="grab"-->
<!--            :clickEffect="true"-->
<!--            clickMode="push"-->

<!--        />-->
    </div>
</template>

<script>

import HeaderNav from "@/views/layout/HeaderNav/HeaderNav";
import FooterNav from "@/views/layout/FooterNav/FooterNav";
import router from "@/router";

export default {
    name: "Layout",
    components: {
        HeaderNav,
        FooterNav,

    },
    data() {
        return {
            navList: [],
            // backImgUrl:require('@/assets/3333.jpeg')
        }
    },
    mounted() {
        this.initNavList()
    },
    methods: {
        initNavList() {
            /**
             * 1、找出 isNavigationBar: true
             * {
             *    path: '/home',
             *    name: 'Home',
             *    meta: {title: '首页'},
             *  },
             *
             */
            let res = []
            router.options.routes[0].children.map(item => {
                if (item.isNavigationBar) {
                    res.push({
                        path: item.path,
                        name: item.name,
                        meta: item.meta
                    })
                }
            })

            this.navList = res
        }
    }
}
</script>

<style scoped lang="scss">
@import "Layout.scss";
</style>
