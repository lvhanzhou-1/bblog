<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">

        <el-breadcrumb-item
            v-for="(item, index) in breadList"
            :key="item.path"
        >
            <!--            给最后一个数据单独加一个样式-->
            <span v-if="index === breadList.length-1" class="current-page">{{ item.meta.title }}</span>
            <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: "Breadcrumb",
    props: {
        breadList: {
            type: Array,
            default: () => [],
        }
    },
    // updated() {
    //     console.log(this.breadList);
    // }
}
</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;

    .current-page {
        color: #97a8be;
        cursor: text;
    }
}
</style>
