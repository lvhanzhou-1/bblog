<template>
    <div class="recommend-container">
        <aside>
            首先在博客管理中，设置推荐等级。然后通过拖动列表，调节推荐博客的显示的优先级<br/>
            一级推荐：轮播图<br/>
            二级推荐：轮播图右侧<br/>
            三级推荐：特别推荐<br/>
            四级推荐：推荐文章
        </aside>

        <el-row type="flex" justify="space-around" class="content-box">
            <el-col :span="5">
                <div class="board-column-header one">一级推荐</div>

                <draggable
                    v-model="recommendLevel1List"
                    group="people"
                    class="list-group"
                    @change="log($event,1)"
                >
                    <transition-group>
                        <div
                            class="list-group-item"
                            v-for="element in recommendLevel1List"
                            :key="element.uid"
                        >
                            {{ element.blog_title }}
                        </div>
                    </transition-group>
                </draggable>

            </el-col>

            <el-col :span="5">
                <div class="board-column-header two">二级推荐</div>

                <draggable
                    v-model="recommendLevel2List"
                    group="people"
                    class="list-group"
                    @change="log($event,2)"
                >
                    <transition-group>
                        <div
                            class="list-group-item"
                            v-for="element in recommendLevel2List"
                            :key="element.uid"
                        >
                            {{ element.blog_title }}
                        </div>
                    </transition-group>
                </draggable>

            </el-col>

            <el-col :span="5">
                <div class="board-column-header three">三级推荐</div>

                <draggable
                    v-model="recommendLevel3List"
                    group="people"
                    class="list-group"
                    @change="log($event,3)"
                >
                    <transition-group>
                        <div
                            class="list-group-item"
                            v-for="element in recommendLevel3List"
                            :key="element.uid"
                        >
                            {{ element.blog_title }}
                        </div>
                    </transition-group>
                </draggable>

            </el-col>

            <el-col :span="5">
                <div class="board-column-header four">四级推荐</div>

                <draggable
                    v-model="recommendLevel4List"
                    group="people"
                    class="list-group"
                    @change="log($event,4)"
                >
                    <transition-group>
                        <div
                            class="list-group-item"
                            v-for="element in recommendLevel4List"
                            :key="element.uid"
                        >
                            {{ element.blog_title }}
                        </div>
                    </transition-group>
                </draggable>

            </el-col>

        </el-row>
    </div>
</template>

<script>
// https://github.com/SortableJS/Vue.Draggable
// https://github.com/David-Desmaisons/draggable-example
import draggable from 'vuedraggable'
import {blogApi} from "@/api/blog";
import {blogRecommendLevelApi} from "@/api/blogRecommendLevel";

export default {
    name: "BlogRecommend",
    components: {
        draggable,

    },
    data() {
        return {
            recommendLevel1List: [],
            recommendLevel2List: [],
            recommendLevel3List: [],
            recommendLevel4List: []
        }
    },
    methods: {

        /**
         * 会触发三种状态
         * 1、moved 上下移动时触发
         * 2、added 新增时触发
         * 3、removed 移除时触发
         *
         * 根据三种状态触发的时机，可以判断出两种动作
         * 1、该文章在当前推荐等级框内 上下移动 会触发 moved
         * 2、该文章 的推荐等级升级或降级 会触发 removed、added
         *
         * 根据传过来的label，可以判断操作的是哪一个list
         * 如果只触发了moved，只需要将这个list的数据更新一下order_number
         * 如果触发了added和removed，就可以知道这个数据的推荐等级修改之后的字段，和新list的顺序
         */
        log(evt, label) {

            console.info("🚀 ~ file:BlogRecommend method:log line:143 -----evt", evt)

            let list
            switch (label) {
                case 1:
                    list = this.recommendLevel1List;
                    break;
                case 2:
                    list = this.recommendLevel2List;
                    break;
                case 3:
                    list = this.recommendLevel3List;
                    break;
                case 4:
                    list = this.recommendLevel4List;
                    break;
            }

            let params = []

            list.forEach((item, index) => {
                params.push({
                    uid: item.uid,
                    recommendLevel: label,
                    order: index + 1
                })
            })

            if (evt.moved) {
                console.log('moved')
                this.updateRecommendLevel(params)
            }
            if (evt.added) {
                console.log('added')
                this.updateRecommendLevel(params)
            }
            if (evt.removed) { // 不用管removed
                console.log('removed')
            }

        },

        async updateRecommendLevel(params) {
            let {data} = await blogRecommendLevelApi.updateArticleRecommendLevelByUid(params)
            if (data.code === 1) {
                this.$message({
                    message: '更换成功',
                    type: 'success',
                    duration: 1500
                })
            } else {
                this.$message({
                    message: data.extendInfo ? data.extendInfo : data.msg,
                    type: 'error',
                    duration: 1500,
                })
            }
        },


        async getRecommendArticle(id) {
            const {data} = await blogApi.queryArticleByRecommendLevel(id)
            switch (id) {
                case 1:
                    this.recommendLevel1List = data.data
                    break;
                case 2:
                    this.recommendLevel2List = data.data
                    break;
                case 3:
                    this.recommendLevel3List = data.data
                    break;
                case 4:
                    this.recommendLevel4List = data.data
                    break;
            }
        },
        getList() {
            this.getRecommendArticle(1)
            this.getRecommendArticle(2)
            this.getRecommendArticle(3)
            this.getRecommendArticle(4)
        },
    },
    mounted() {
        this.getList()
    }
}
</script>

<style scoped lang="scss">
@import "BlogRecommend";
</style>
