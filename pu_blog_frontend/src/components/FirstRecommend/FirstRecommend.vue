<template>
   <div class="first-recommend-container">
       <el-carousel :autoplay="true" indicator-position="outside" >
           <el-carousel-item v-for="(item,index) in list" :key="index">
                <div style="width: 100%; height: 100%; cursor: pointer; "
                @click="toArticleDetailHandle(item.uid)">
                    <el-image
                        style="width: 100%; height: 100%;"
                        fit="cover"
                        :src="item.cover_url"
                        :alt="item.blog_title"
                        >

                    </el-image>


                    <div class="carousel-title">
                        <span>{{item.blog_title}}</span>
                    </div>

                </div>
           </el-carousel-item>
       </el-carousel>
   </div>
</template>

<script>
export default {
    name: "FirstRecommend",
    props: {
        list: {
            type: Array,
            default: () => []
        },
    },
    methods: {
        toArticleDetailHandle(uid) {
            this.$emit('toArticleDetailHandle', uid)
        },
    },
}
</script>

<style scoped lang="scss">
@import "FirstRecommend";
</style>
