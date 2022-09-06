<template>
    <div class="about-me-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="关于" name="aboutMe">
                <div class="about-me-box">
                    <article
                        class="html-box"
                        v-html="blogContent"
                        v-highlight
                        ref="articleNode"
                    />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {aboutMeApi} from "@/api/aboutMe";

export default {
    name: "AboutMe",
    data() {
        return {
            activeName: 'aboutMe',
            blogContent: ''
        }
    },
    methods: {
        async getAboutMeInfo() {
            let {data} = await aboutMeApi.queryAboutMeAll()
            this.blogContent = data.data[0].intro_detail
            console.info("🚀 ~ file:AboutMe method:mounted line:32 -----", data)

        }
    },

    mounted() {
        this.getAboutMeInfo()
    }
}
</script>

<style scoped lang="scss">
@import "AboutMe";
</style>
