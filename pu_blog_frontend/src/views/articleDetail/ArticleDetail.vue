<template>
    <div class="root-container">

        <div class="article-detail-container">

            <ArticleFeatureBtn
                :commentTotal="total"
                :likeCountList="likeCountList"
                :loginUserInfo="loginUserInfo"
                :isLogin="isLogin"
                @toComment="toComment"
                @likeArticleHandle="likeArticleHandle"
            ></ArticleFeatureBtn>

            <main>
                <div class="isOriginal status-1" v-if="articleInfo.is_original === 1">原创</div>
                <div class="isOriginal status-2" v-if="articleInfo.is_original === 2"><a
                    :href="articleInfo.origin_address">转载</a></div>
                <div class="isOriginal status-3" v-if="articleInfo.is_original === 3"><a
                    :href="articleInfo.origin_address">翻译</a></div>
                <header>
                    <!--     文章标题       -->
                    <h2>{{ articleInfo.blog_title }}</h2>

                    <!--      文章作者信息、点击量、分类、点赞数、时间    -->
                    <ul>

                        <!--    作者        -->
                        <li class="author">
                            <span class="iconfont icon-wode"></span>
                            <span>  {{ articleInfo.nick_name }}</span>
                        </li>

                        <!--    文章类别        -->
                        <li class="type">

                            <span class="iconfont icon-gengduo1"></span>

                            <span @click="toArticleListHandle(articleInfo.blog_sort_id,'blogSort')">  {{
                                    articleInfo.sort_name
                                }}</span>
                        </li>

                        <!--    点击量        -->
                        <li class="visited">

                            <span class="iconfont icon-yanjing"></span>

                            <span>  {{ articleInfo.clicks }}</span>
                        </li>

                        <!--    点赞数量        -->
                        <li class="liked">

                            <span class="iconfont icon-zan"></span>

                            <span>  {{ likeCountList.length }}</span>
                        </li>

                        <!--    创建时间        -->
                        <li class="createTime">

                            <span class="iconfont icon-shijian2"></span>

                            <span>  {{ articleInfo.create_time }}</span>
                        </li>

                    </ul>

                    <!--      标签      -->
                    <div class="tags-box">
                        <el-tag
                            v-for="tag in articleInfo.blog_tags"
                            type="warning"
                            :key="tag.blog_tag_id"
                            @click="toArticleListHandle(tag.blog_tag_id,'blogTag')"
                        >
                            {{ tag.tag_name }}
                        </el-tag>
                    </div>


                    <div class="cover-img">
                        <img :src="articleInfo.cover_url" alt="">
                    </div>
                </header>
                <div>

                </div>


                <!--                <article-->
                <!--                    class="html-box"-->
                <!--                    v-html="blogContent"-->
                <!--                    v-highlight-->
                <!--                    @click="showBigPic"-->
                <!--                    ref="articleNode"-->
                <!--                />-->

                <!--                <div>================================================================================================</div>-->

                <!-- 富文本编辑器 -->
                <mavon-editor class="title_titlem shadow" :value="blogContent"
                              :toolbarsFlag="false"
                              :ishljs="true"
                              :subfield="false"
                              defaultOpen="preview"
                              :boxShadow="false"
                              ref="markdown"
                              previewBackground="white"
                >
                </mavon-editor>


                <footer style="max-width: 920px;margin: 0 auto;padding-bottom: 230px;">
                    <!-- 关注我、打赏 -->


                    <hr>
                    <h3 ref="comment" style="margin-bottom: 20px;">留言（{{ total }}）</h3>
                    <div style="padding-bottom: 20px">
                        <CommentMessageList
                            ref="commentMessageList"
                            :comments="commentList"

                            :loginUserInfo="loginUserInfo"
                            :isLogin="isLogin"

                            :commentSource="form.commentSource"
                            :sourceId="form.sourceId"

                            :hasMore="hasMore"
                            @loadMoreHandle="loadMoreHandle"
                            @refreshCommentList="refreshCommentList"
                            @deleteCommentsHandle="deleteCommentsHandle"
                            @publishStandpointHandle="publishStandpointHandle"
                            @reportCommentHandle="reportCommentHandle"

                        />
                    </div>
                    <CommentBox
                        :loginUserInfo="loginUserInfo"
                        :isLogin="isLogin"
                        :content="form.commentContent"

                        :commentSource="form.commentSource"
                        :sourceId="form.sourceId"


                        @goToLogin="goToLogin"
                        @commentInputHandle="commentInputHandle"
                        @sendMessageHandle="sendMessageHandle"
                        @cancelMessageHandle="cancelMessageHandle"
                        @insertEmoji="insertEmoji"

                    />
                </footer>
            </main>


            <aside v-if="this.menus.length" id="menus" class="menusTree" @click="clickToHightLight">
                <MenusTree  class="topMenus" :menus="menus"
                           child-label="child"></MenusTree>
            </aside>
        </div>

    </div>
</template>

<script>
import ArticleFeatureBtn from "@/components/ArticleFeatureBtn/ArticleFeatureBtn";
import MenusTree from "@/components/MenusTree/MenusTree";
import {throttle} from '@/lib/utilFn'

import {indexMutation} from "@/store/mutation-types";

import {blogLikeApi} from "@/api/blogLike";
import {blogApi} from "@/api/blog";

import mixin from "@/views/messageBoard/mixin";

export default {
    name: "ArticleDetail",
    components: {
        ArticleFeatureBtn,
        MenusTree
    },
    mixins: [mixin],
    data() {
        return {
            activeName: 'article',

            articleInfo: {},
            blogContent: '',

            catalogProps: {
                // 内容容器selector(必需)
                container: '.html-box',
                levelList: ["h2", "h3", "h4"],
                watch: true,
            },
            total: null,

            /*====================  留言板 start  ============================*/
            form: {
                commentContent: null,
                commentSource: 3, // 评论来源：-1，关于我；1，留言板；2，专题；3，文章
                sourceId: '', // 来源的id：存放对应来源的id，专题有专题uid，文章有文章uid，留言板uid给个默认值1，关于我默认值-1
                commentStatus: 2, // 评论状态：1，待审核；2，通过；3，违规评论
                commentPersonId: null, // 评论人：评论人的id
                commentLayer: 1, // 评论的层级，总共有五层，1，2，3，4，5
            },

            searchParam: {
                commentSource: 3,
                sourceId: '',
            },

            /*====================  留言板 end  ============================*/

            likeCountList: [], // 所有的点赞记录

            isShowRewardDialog: false, // 是否展示打赏框

            menus: [],

        }
    },
    methods: {
        clickToHightLight(e) {
            console.info("🚀 ~ file:ArticleDetail method:clickToHightLight line:231 -----e.target", e.target)
            console.info("🚀 ~ file:ArticleDetail method:clickToHightLight line:231 -----e", e)
            //获取所有子孙dom

            //排他操作
            let dom = document.querySelectorAll('#menus')


            console.info("🚀 ~ file:ArticleDetail method:clickToHightLight line:234 -----dom", dom)

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
        toComment() {
            const commentBox = this.$refs['comment']
            commentBox.scrollIntoView(true)//原生方法
        },
        async likeArticleHandle(isAlreadyLike) {
            // 判断是否登录，未登录的话先登录
            if (!this.isLogin) {
                this.goToLogin()
            } else {
                if (isAlreadyLike) {
                    // 删除自己的记录
                    let findItem = this.likeCountList.find((item) => {
                        if (item.like_person_id === this.loginUserInfo.uid) {
                            return item
                        }
                    })
                    await blogLikeApi.deleteBlogLikeByUid([findItem.uid])

                } else {
                    // 新增一条自己的记录
                    await blogLikeApi.saveBlogLike({
                        blogId: this.searchParam.sourceId,
                        likePersonId: this.loginUserInfo.uid,
                    })
                }
                /*重新获取所有 文章喜欢 列表*/
                await this.getAllArticleLike()

            }
        },
        goToLogin() {
            /*触发全局状态*/
            this.$store.commit(indexMutation.SHOW_LOGIN_DIALOG)
        },

        async getAllArticleLike() {
            let {data} = await blogLikeApi.queryBlogLikeAll2({
                blogId: this.searchParam.sourceId
            })
            this.likeCountList = data.data
        },

        toArticleListHandle(uid, type) {
            const routerData = this.$router.resolve({
                path: `/articleList?${type}=${uid}`
            })
            window.open(routerData.href, '_blank')
        },

        /*?????*/
        showBigPic(e) {
            if (e.target.tagName === 'IMG') {
                window.open(e.target.src, '_blank')
            }
        },


        // // 需要智能吸附在顶部的div，站在这不要动
        // standHereAndDoNotMove() {
        //     let offset = 150;
        //     let scrollTop = document.documentElement.scrollTop; //当前的的位置
        //     let stickBox = this.$refs['stick-box2']
        //     if (stickBox) {
        //         if (scrollTop > offset) {
        //             stickBox.$el.classList.add('stand-here2')
        //         } else {
        //             stickBox.$el.classList.remove('stand-here2')
        //         }
        //     }
        //
        // },
        async queryArticle(uid) {
            let {data} = await blogApi.queryArticleByUid(uid)
            this.articleInfo = data.data[0]
            this.blogContent = this.articleInfo.blog_content

            console.info("🚀 ~ file:ArticleDetail method:queryArticle line:315 -----this.blogContent", this.blogContent)
        },


        // getChild(arr, left, right) {
        //     let child = []
        //     if (right) {
        //         child = arr.filter(item => item.offsetTop > left && item.offsetTop < right)
        //     } else {
        //         child = arr.filter(item => item.offsetTop > left)
        //     }
        //
        //     return child
        // },
        // createMenus() {
        //     let arr = []
        //     let allchildnodes = this.$refs.markdown.$refs.vShowContent.children
        //     allchildnodes = Array.from(allchildnodes)
        //     console.log(allchildnodes);
        //     for (let i = 6; i > 0; i--) {
        //         let temp = [];
        //         let elements = []
        //         allchildnodes.forEach(item => {
        //             if (item['nodeName'] === `H${i}`) {
        //                 elements.push(item)
        //             }
        //         })
        //
        //         for (let j = 0; j < elements.length; j++) {
        //             let child = this.getChild(arr, elements[j].offsetTop, ((j + 1) === elements.length) ? undefined : elements[j + 1].offsetTop)
        //
        //             temp.push({
        //                 h_level: i,
        //                 h_title: elements[j].innerText,
        //                 h_id: elements[j].querySelector('a').id,
        //                 offsetTop: elements[j].offsetTop,
        //                 child: child,
        //             })
        //         }
        //         if (temp.length) {
        //             arr = temp
        //         }
        //     }
        //     this.menus = arr
        // },
        getChild(arr, left, right) {
            let child = []
            if (right) {
                child = arr.filter(item => item.offsetTop > left && item.offsetTop < right)
            } else {
                child = arr.filter(item => item.offsetTop > left)
            }

            return child
        },
        getElementToPageTop(el) {
            if (el.parentElement) {
                return this.getElementToPageTop(el.parentElement) + el.offsetTop
            }
            return el.offsetTop
        },
        addArticleDomOffsetTop(arr, articleDomOffsetTop) {
            if (arr.length === 0) {
                return []
            }
            arr.forEach(item => {
                item.offsetTop += articleDomOffsetTop

                item.child = this.addArticleDomOffsetTop(item.child, articleDomOffsetTop)
            })

            return arr

        },
        createMenus() {
            /**
             * 构建侧边目录
             * */
            let arr = []
            // let allchildnodes = this.$refs.articleNode.children //先获取所有子节点
            let allchildnodes = this.$refs.markdown.$refs.vShowContent.children
            allchildnodes = Array.from(allchildnodes)
            // console.log(allchildnodes);
            for (let i = 6; i > 0; i--) { //然后从H6开始处理，处理完H6，再处理H5。。。
                let temp = [];  //初始化temp，保存中间结果
                let elements = [] //保存当前层级的节点
                allchildnodes.forEach(item => {
                    if (item['nodeName'] === `H${i}`) {
                        elements.push(item)
                    }
                })

                //开始处理当前层级的节点
                for (let j = 0; j < elements.length; j++) {
                    //根据arr中的每一个节点，构建当前节点的子节点数组
                    let child = this.getChild(arr, elements[j].offsetTop, ((j + 1) === elements.length) ? undefined : elements[j + 1].offsetTop)

                    temp.push({
                        h_level: i,
                        h_title: elements[j].innerText,
                        h_id: elements[j].id,
                        offsetTop: elements[j].offsetTop,
                        child: child,
                    })
                }
                if (temp.length) {
                    arr = temp
                }
            }

            // let articleDomOffsetTop = this.getElementToPageTop(this.$refs.articleNode)
            // arr = this.addArticleDomOffsetTop(arr, articleDomOffsetTop)

            this.menus = arr
            // this.menus = []


        }
    },
    computed: {
        loginUserInfo() {
            return this.$store.state.user.loginUserInfo
        },
        isLogin() {
            return !!this.$store.state.user.token;
        },
        baseUrl() {
            // let articleLinkBaseUrl
            // if (process.env.NODE_ENV === 'development') { // 开发环境
            //     articleLinkBaseUrl = articleDetailBaseUrl.articleBaseUrlDevelopment
            // } else { // 生产环境
            //     if (this.isDemoVersion) {
            //         articleLinkBaseUrl = articleDetailBaseUrl.articleBaseUrlDemo
            //     } else {
            //         articleLinkBaseUrl = articleDetailBaseUrl.articleBaseUrlProduction
            //     }
            // }
            // return articleLinkBaseUrl

            return process.env.VUE_APP_ARTICLE_BASE_URL
        },
    },
    mounted() {
        // window.addEventListener("scroll", throttle(() => {
        //     this.standHereAndDoNotMove()
        // }, 50, 100))

        // console.log(this.$refs.articleNode.childNodes);
        // console.log(this.$refs.articleNode.children);
        this.$nextTick(() => {
            setTimeout(() => {
                this.createMenus()
                // console.log(this.menus);
            }, 400)
        })
        // console.log(this.menus);

    },
    created() {
        let {id} = this.$route.params
        this.queryArticle(id)

        /*====================  留言板 start  ============================*/
        this.form.sourceId = id
        this.searchParam.sourceId = id
        this.getCommentList()
        /*====================  留言板 end  ============================*/

        this.getAllArticleLike()


    }

}
</script>

<style scoped lang="scss">
@import "ArticleDetail.scss";
</style>
