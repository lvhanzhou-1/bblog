<template>
    <div class="scrollbar-wrapper">

        <el-menu
            mode="vertical"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            :default-active="$route.path"
            :unique-opened="true"
        >

            <el-menu-item @click="toHome" class="home" style="background-color:  #304156FF !important;">
                <i class="el-icon-s-home"></i>
                <span>首页</span>
            </el-menu-item>


            <template v-for="(item, index) in menuList">
                <el-submenu :index="index+''" :key="index">
                    <!--    导航大类      -->
                    <template slot="title">
                        <i v-if="item.parent.icon" :class="item.parent.icon"></i>
                        <span>{{ item.parent.name }}</span>
                    </template>
                    <!--     导航大类对应的子类     -->
                    <template v-for="child in item.sonItem">
                        <el-menu-item :index="child.url" :key="child.name" @click="navigatorTo(child)">
                            <i v-if="child.icon" :class="child.icon"></i>
                            <span>{{ child.name }}</span>
                        </el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "Sidebar",
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        isCollapse: {
            type: Boolean,
            default: () => false
        },
    },
    methods: {
        toHome() {
            this.$router.push('/')
        },
        navigatorTo(item) {
            this.$emit('navigatorTo', item)
        }
    },
}
</script>

<style scoped lang="scss">
@import "Sidebar.scss";
</style>
