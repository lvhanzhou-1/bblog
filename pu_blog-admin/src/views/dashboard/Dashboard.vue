<template>

    <div class="dashboard-editor-container">
        <!--累计文章数量 最新文章相隔天数 留言数 用户数-->
        <!--  顶部内容  -->
        <el-row class="panel-group" :gutter="40">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="panel-ico icon-ip">
                        <!--                        <svg-icon icon-class="eye" class-name="card-panel-icon"/>-->
                        <img src="../../assets/1.png" alt="">
                    </div>
                    <div class="panel-desc">
                        <div class="card-panel-text">累计文章数：</div>
                        <CountTo class="card-panel-num" :endVal="articleCount" :duration="3200"></CountTo>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="panel-ico icon-people">
                        <img src="../../assets/2.png" alt="">
                    </div>
                    <div class="panel-desc">
                        <div class="card-panel-text">最新文章天数：</div>
                        <CountTo class="card-panel-num" :endVal="days" :duration="3000"></CountTo>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="panel-ico icon-comment">
                        <img src="../../assets/3.png" alt="">
                    </div>
                    <div class="panel-desc">
                        <div class="card-panel-text">留言数：</div>
                        <CountTo class="card-panel-num" :endVal="commentCount" :duration="3200"></CountTo>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="panel-ico icon-article">
                        <img src="../../assets/4.png" alt="">
                    </div>
                    <div class="panel-desc">
                        <div class="card-panel-text">用户数：</div>
                        <CountTo class="card-panel-num" :endVal="webUserCount" :duration="3200"></CountTo>
                    </div>
                </div>
            </el-col>
        </el-row>


        <!--  分类饼图  -->
        <el-row :gutter="32" class="category-container">
            <el-col :xs="24" :sm="24" :lg="12">
                <div class="chart-wrapper">
                    <PieChart
                        :key="blogSortNameArray.toString()"
                        :value="blogCountByBlogSort"
                        :tagName="blogSortNameArray"
                    ></PieChart>
                </div>
            </el-col>

            <el-col :xs="24" :sm="24" :lg="12">
                <div class="chart-wrapper">
                    <PieChart
                        :key="tagNameArray.toString()"
                        :value="blogCountByTag"
                        :tagName="tagNameArray"
                    ></PieChart>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="32" class="category-container">
            <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                    <Dynamic :timeLines="timeLines"></Dynamic>
                </div>
            </el-col>
        </el-row>


    </div>
</template>

<script>
import CountTo from "vue-count-to";
import PieChart from "@/components/PieChart/PieChart";
import Dynamic from "@/components/Dynamic/Dynamic";
import {commentApi} from "@/api/comment";
import {blogApi} from "@/api/blog";
import {webUserApi} from "@/api/webUser";
import {blogSortApi} from "@/api/blogSort";
import {blogTagApi} from "@/api/blogTag";
import {timeLineApi} from "@/api/timeLine";


export default {
    name: "Dashboard",
    components: {
        CountTo,
        PieChart,
        Dynamic
    },
    data() {
        return {
            commentCount: 0,
            articleCount: 0,
            webUserCount: 0,
            days: 0,

            blogCountByBlogSort: [],
            blogSortNameArray: [],

            blogCountByTag: [],
            tagNameArray: [],
            timeLines: []
        }
    },
    methods: {
        async getCommentCount() {
            let response = await commentApi.queryCommentCount()
            this.commentCount = response.data.data
        },
        async getArticleCount() {
            let response = await blogApi.queryArticleCount()
            this.articleCount = response.data.data
        },
        async getWebUserCount() {
            let response = await webUserApi.queryWebUserCount()
            this.webUserCount = response.data.data
        },
        async getLatestArticleTime() {
            let response = await blogApi.queryLatestArticleTime()
            let time = response.data.data
            this.days = Math.floor((+new Date() - Date.parse(time)) / 1000 / 3600 / 24)
        },

        async getBlogCountByBlogSort() {
            let response = await blogSortApi.queryArticleSortAllwithBlogNum()

            let tempArr = response.data.data
            let resArr = []
            tempArr.forEach(item => {
                resArr.push({
                    blogSortUid: item.uid,
                    name: item.sort_name,
                    value: item.total_blog_num
                })
            })
            this.blogCountByBlogSort = resArr
            this.blogSortNameArray = resArr.map(item => item.name)
        },


        async getBlogCountByTag() {
            let response = await blogTagApi.queryBlogTagAllwithBlogNum()

            let tempArr = response.data.data
            let resArr = []
            tempArr.forEach(item => {
                resArr.push({
                    tagUid: item.uid,
                    name: item.tag_name,
                    value: item.total_blog_num
                })
            })
            this.blogCountByTag = resArr
            this.tagNameArray = resArr.map(item => item.name)
        },


        async getTimeLineAll() {
            let response = await timeLineApi.queryTimeLineAll()
            let tempArr = response.data.data
            let resArr = []
            let methods = {
                'update': '更新',
                'delete': '删除',
                'save': '新建'
            }

            let databases = {
                't_system_about_me': '关于我',
                't_admin_user': '管理员',
                't_blog': '文章',
                't_blog_sort': '文章分类',
                't_blog_tag': '文章标签',
                't_system_contact_way': '联系方式',
                't_file': '图片',
                't_file_sort': '图片分类',
                't_system_friend_link': '友链',
                't_special_sort': '专题分类',
                't_special': '专题',
                't_special_part': '专题部分',
                't_special_part_section': '专题部分章节',
                't_web_user': '用户',

            }
            tempArr.forEach(item => {
                let newMethod = methods[item.method]
                let newDataBase = databases[item.database_name]

                resArr.push({
                    time: item.create_time,
                    newMethod,
                    newDataBase,
                    itemName: item.item_name,
                    user: item.user_name
                })
                resArr.sort((a, b) => b.time.localeCompare(a.time))
            })
            this.timeLines = resArr
        }

    },
    created() {
        this.getCommentCount()
        this.getArticleCount()
        this.getWebUserCount()
        this.getLatestArticleTime()

        this.getBlogCountByBlogSort()
        this.getBlogCountByTag()
        this.getTimeLineAll()
    },
}
</script>

<style scoped lang="scss">
@import "Dashboard";
</style>
