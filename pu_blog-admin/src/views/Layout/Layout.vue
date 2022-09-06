<template>
    <div class="app-wrapper">
        <!--  侧边导航栏  -->
        <!--三个参数：
        一是生成目录需要的路由信息：根据router直接生成
        二是是否折叠：从vuex读取
        三是跳转路由的函数：使用props传递，多个组件都可以使用
        -->
        <Sidebar
            :menu-list="menuList"
            :is-collapse="isCollapse"
            @navigatorTo="navigatorTo"
            class="sidebar-container"
        ></Sidebar>

        <div class="main-container">
            <!--  上方的导航栏  -->
            <!--一个参数：
            {breadList} 生成小面包屑的数据，从vuex读取，并且当路由切换时，此数据被改变
            -->
            <Navbar class="nav-box"
                    :breadList="breadList"></Navbar>
            <!--  缓存路由标签 -->
            <Tags class="tag-box"
                  :tagNavList="tagNavList"
                  @deleteTagByName="deleteTagByName"
                  @toPathHandle="navigatorTo"
                  @closeAllTags="closeAllTags"
                  @closeOtherTags="closeOtherTags"
            ></Tags>
            <!--  内容区域  -->
            <AppMain class="app-main-box"></AppMain>

        </div>
    </div>
</template>

<script>
import router from "@/router";
import Sidebar from "@/views/Layout/components/Sidebar/Sidebar";
import Navbar from "@/views/Layout/components/Navbar/Navbar";
import Tags from "./components/Tags/Tags";
import AppMain from "./components/AppMain/AppMain";
import {appMutation} from '@/store/mutation-types'

export default {
    name: "Layout",
    components: {
        Sidebar,
        Navbar,
        Tags,
        AppMain
    },
    data() {
        return {
            menuList: [] // 从router中解析侧边栏导航数据
        }
    },
    computed: {
        isCollapse() {
            return this.$store.state.app.sidebar.isCollapse
        },
        breadList() {
            return this.$store.state.app.breadList
        },
        tagNavList() {
            return this.$store.state.app.tagNavList
        },
    },
    methods: {
        //删除所有标签
        closeAllTags() {
            this.$store.commit(appMutation.CLOSE_ALL_TAGS)
            this.$router.push('/')
        },
        // 删除其它标签，同时删除缓存
        closeOtherTags() {
            this.$store.commit(appMutation.CLOSE_OTHER_TAGS, this.$route.name)
        },
        //初始化侧边栏数据
        initSideMenu() {
            /**
             * 1、找出 isSidebar: true, 为父级
             *   "name": meta.title,
             *   "icon": meta.icon,
             *   "url": path,
             *   "uid": name
             * 2、找出子集
             *   "name": meta.title,
             *   "icon": meta.icon,
             *   "parentUid": parent.uid,
             *   "url": path,
             *   "uid": name
             *
             */

            let resultArr = []

            router.options.routes.map(item => {
                if (item.isSidebar) { // 若果是侧边栏路由

                    let tempObj = {
                        parent: {
                            name: item.meta.title,
                            icon: item.meta.icon,
                            url: item.path,
                            uid: item.name,
                        },
                        sonItem: [],
                    }

                    item.children.map(child => {
                        tempObj.sonItem.push({
                            name: child.meta.title,
                            icon: child.meta.icon,
                            parentUid: item.name,
                            url: child.path,
                            uid: child.name,
                        })
                    })

                    resultArr.push(tempObj)
                }
            })
            this.menuList = resultArr
        },
        //路由跳转
        navigatorTo(item) {
            /*传给sidebar，切换路由*/
            this.$router.push({path: item.url})
        },
        // 更改vuex中的面包屑导航数据
        getBreadList() {

            console.info("🚀 ~ file:Layout method:getBreadList line:135 ----- this.$route.matched", this.$route.matched )
            let matched = this.$route.matched.filter(item => item.meta.title);

            console.info("🚀 ~ file:Layout method:getBreadList line:138 -----matched", matched)
            this.$store.commit(appMutation.CHANGE_BREAD_LIST, matched)
        },
        // 设置缓存路由标签
        setTagNavList(item) {
            this.$store.commit(appMutation.PUSH_TAG_NAV_LIST, item)
        },
        // 删除缓存路由标签，同时删除对应的路由缓存keep-alive
        async deleteTagByName(name) {
            const nextRouter = await this.$store.dispatch('deleteTagByName', name)
            this.$store.commit(appMutation.DELETE_KEEP_ALIVE_INCLUDES_BY_NAME, name)

            // 若果删除的是当前的tag，就更新当前页面到下一个tag上
            if (this.$route.name === name) {
                await this.$router.push(nextRouter)
            }
        },
    },
    watch: {
        // 导航每次更新时触发
        $route(newVal) {
            // 更新头部面包屑提示
            this.getBreadList()

            // 设置缓存路由标签
            this.setTagNavList(newVal)

            // 增加新的缓存路由keep-alive
            this.$store.commit(appMutation.PUSH_KEEP_ALIVE_INCLUDES, newVal.name)
        }
    },
    mounted() {
        this.initSideMenu()
        this.getBreadList()
        this.setTagNavList()
    },
    // updated() {
    //     console.log(this.$route);
    // }
}
</script>

<style scoped lang="scss">
@import "./Layout.scss";
</style>
