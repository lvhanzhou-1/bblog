<template>
    <div class="articles-container">
        <article v-for="item in blogList " :key="item.uid" class="article-box">

            <div class="box-image">
                <el-image
                    v-show="item.cover_url"
                    :alt="item.blog_title"
                    :src="item.cover_url"
                    fit="cover"
                    style="width: 192px;height: 120px;"
                    @click="toArticleDetailHandle(item.uid)"
                ></el-image>
            </div>

            <div class="box-text">
                <div class="box-text-title">
                    <h3 @click="toArticleDetailHandle(item.uid)">{{ item.blog_title }}</h3>
                </div>
                <div class="box-text-summary">
                    <p>{{ item.blog_summary }}</p>
                </div>

                <div class="box-text-info">
                    <ul>
                        <!--    作者        -->
                        <li class="author">
                            <i class="iconfont icon-wode"
                               style="position: relative; top: 1px "></i>
                            <span>{{ item.nick_name }}</span>
                        </li>
                        <!--    文章类别        -->
                        <li class="type">
                            <!--                            <i class="el-icon-menu"></i>-->
                            <!--                            <IconFont  :icon-class="{width:'13px',height:'13px'}" :icon-href="'icon-leimupinleifenleileibie'"></IconFont>-->
                            <i class="iconfont icon-gengduo1"
                                  style="position: relative; top: 1px" ></i>
                            <span
                                @click="toArticleListHandle(item.blog_sort_id,'blogSort')"
                            >{{ item.sort_name }}</span>
                        </li>
                        <!--    点击量        -->
                        <li class="visited">
                            <i class="iconfont icon-yanjing"
                               style="position: relative; top:1px "></i>
                            <span>{{ item.clicks }}</span>
                        </li>
                        <!--    点赞数量        -->
                        <li class="liked">
                            <i class="iconfont icon-zan" style="position: relative; top: 0"></i>
                            <span>{{ item.like_count ? item.like_count : 0 }}</span>
                        </li>
                        <!--    创建时间        -->
                        <li class="createTime">
                            <i class="iconfont icon-shijian2" style="position: relative; top: 1px "></i>
                            <span>{{ item.create_time }}</span>
                        </li>
                    </ul>
                </div>
            </div>

        </article>

        <div v-if="hasMore" class="load-more-container">
            <span @click="loadMoreHandle">查看更多</span>
        </div>

        <div v-else class="no-more-container">
            <span>没有更多了</span>
        </div>


    </div>
</template>

<script>

export default {
    name: "Articles",
    props: {
        total: {
            type: Number,
            default: () => 0,
        },
        blogList: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        loadMoreHandle() {
            this.$emit('loadMoreHandle')
        },
        toArticleDetailHandle(uid) {
            this.$emit('toArticleDetailHandle', uid)
        },
        toArticleListHandle(uid, type) {
            this.$emit('toArticleListHandle', {uid, type})
        },


    },
    computed: {
        hasMore() {
            return this.blogList.length < this.total
        },
    },
}
</script>

<style scoped lang="scss">
@import "Articles";
</style>
