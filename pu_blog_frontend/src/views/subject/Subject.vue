<template>
    <div class="subject-container">
<!--        <p class="motto">座右铭</p>-->
        <el-tabs v-model="activeName"  @tab-click="handleClick" :before-leave="beforeLeaveHandle">
            <!-- <el-tab-pane label="网站首页" name="home" class="home-btn"/> -->
            <el-tab-pane label="专题" name="subject">
                <div class="subject-box">
                    <div class="subject-type" v-for="(item,index) in list" :key="item.id">
                        <h3>
                            <span>{{ index + 1 }}</span>
                            {{ item.label }}
                        </h3>

                        <ul>
                            <fragment
                                v-for="subject in item.children"
                                :key="subject.id"
                            >
                                <li
                                @click="navigatorTo(subject.id)">
                                    <div class="img-box">
                                        <span>{{subject.label}}</span>
                                        <el-image fit="cover" :src="subject.cover_url" :alt="subject.label" style="width: 100%; height: 100%"></el-image>
                                    </div>
                                    <h3>{{subject.special_summary}}</h3>
                                </li>
                            </fragment>
                        </ul>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {specialPartSectionApi} from "@/api/specialPartSection";

export default {
    name: "Subject",
    data() {
        return {
            activeName: 'subject',
            list: [],
        }
    },
    methods: {
        //获取五级树
        async getList() {
            let {data} = await specialPartSectionApi.querySpecialPartSectionTree2()
            this.list = data.data
        },

        handleClick(e) {
            console.log(e.name, 'e.name')
        },
        beforeLeaveHandle(activeName) {
            if (activeName === 'home') {
                this.$router.push('/')
                return false
            }
        },
        navigatorTo(id) {
            this.$router.push(`/subjectInfo/${id}`)
        },
    },


    mounted() {
        this.getList()
    }
}
</script>

<style scoped lang="scss">
@import "Subject.scss";
</style>
