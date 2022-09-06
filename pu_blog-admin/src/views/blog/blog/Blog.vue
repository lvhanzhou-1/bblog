<template>
    <div class="blog-container">
        <!--  筛选框  -->
        <div
            class="filter-container"
            v-show="!isHideSearch"
            :style="{ height: `${filterContainerHeight}px` }"
        >
            <el-form :inline="true">
                <el-form-item>
                    <el-input
                        clearable
                        style="width: 150px"
                        v-model="searchParam.blogTitle"
                        placeholder="请输入博客名"
                        @keyup.enter.native="handleFind"
                    />
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.isPrivate"
                        style="width: 140px"
                        clearable
                        placeholder="是否私密文章"
                        @keyup.enter.native="handleFind"
                    >
                        <el-option
                            v-for="item in isPrivateList"
                            :key="item.uid"
                            :label="item.isPrivate"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.blogSort"
                        style="width: 140px"
                        clearable
                        placeholder="请输入分类名"
                        @keyup.enter.native="handleFind"
                    >
                        <el-option
                            v-for="item in blogSortList"
                            :key="item.uid"
                            :label="item.sort_name"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.blogTag"
                        clearable
                        placeholder="请输入标签名"
                        @keyup.enter.native="handleFind"
                        style="width: 140px"
                    >
                        <el-option
                            v-for="item in blogTagList"
                            :key="item.uid"
                            :label="item.tag_name"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.recommendLevel"
                        clearable
                        placeholder="推荐等级"
                        style="width: 110px"
                    >
                        <el-option
                            v-for="item in recommendLevelList"
                            :key="item.uid"
                            :label="item.recommendLevel"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.blogStatus"
                        clearable
                        placeholder="是否发布"
                        style="width: 110px"
                    >
                        <el-option
                            v-for="item in blogStatusList"
                            :key="item.uid"
                            :label="item.blogStatus"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select
                        v-model="searchParam.isOriginal"
                        clearable
                        placeholder="是否原创"
                        style="width: 110px"
                    >
                        <el-option
                            v-for="item in isOriginalList"
                            :key="item.uid"
                            :label="item.isOriginal"
                            :value="item.uid"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        style="margin-left: 10px"
                        type="primary"
                        icon="el-icon-search"
                        @click="handleFind"
                    >
                        查找
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--  功能按钮  -->
        <div class="feature-btns" :style="{ height: `${featureBtnsHeight}px` }">
            <el-row :gutter="10">
                <el-col :span="1.5">
                    <el-button
                        class="filter-item"
                        type="primary"
                        @click="showEditorHandle"
                        icon="el-icon-edit"
                    >添加博客
                    </el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-upload
                        :action="importAction"
                        accept=".md"
                        name="mdfile"
                        :multiple="true"
                        :show-file-list="false"
                        :data="fileExtraData"
                        :on-success="fileSuccess"
                        :on-error="fileError"
                        :before-upload="beforeUpload"
                        :headers="headers"
                    >
                        <el-button class="filter-item" type="warning" icon="el-icon-star-on"
                                   :disabled="isDemoVersion"
                        >本地上传
                        </el-button>
                    </el-upload>
                </el-col>

                <el-col :span="1.5">
                    <el-button
                        class="filter-item"
                        type="warning"
                        @click="handleDownload"
                        icon="el-icon-s-flag"
                        :disabled="isDemoVersion"
                    >导出选中
                    </el-button>
                </el-col>

                <el-col :span="1.5">
                    <el-button
                        class="filter-item"
                        type="danger"
                        @click="handleDeleteSelected"
                        icon="el-icon-delete"
                    >删除选中
                    </el-button>
                </el-col>

                <RightToggleBar
                    :hide-search="isHideSearch"
                    @refresh="resetTableList"
                    @toggleSearch="toggleSearchStatus"
                />
            </el-row>
        </div>

        <!-- 内容展示表格 -->
        <div
            class="table-container"
            :style="{ height: `calc(100% - ${calcTableHeight}px)` }"
        >
            <el-table
                :data="tableData"
                height="100%"
                :header-cell-style="{ background: '#f0efef', color: '#333' }"
                style="width: 100%"
                ref="table"
                @selection-change="selectHandle"
            >
                <el-table-column type="selection"></el-table-column>

                <el-table-column label="序号" width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="标题图" width="160" align="center">
                    <template slot-scope="scope">
                        <img
                            :src="scope.row.cover_url"
                            style="width: 130px; height: 70px"
                        />
                    </template>
                </el-table-column>

                <el-table-column label="标题" min-width="160" align="center">
                    <template slot-scope="scope">
						<span @click="onClick(scope.row)" style="cursor: pointer">{{
                                scope.row.blog_title
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="作者" min-width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.nick_name }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="是否原创" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="parseInt(scope.row.is_original) === 1" type="success"
                        >原创
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.is_original) === 2" type="info"
                        >转载
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.is_original) === 3" type="info"
                        >翻译
                        </el-tag
                        >
                    </template>
                </el-table-column>

                <el-table-column label="是否私密" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="parseInt(scope.row.is_private) === 1" type="success"
                        >私密
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.is_private) === 2" type="info"
                        >公开
                        </el-tag
                        >
                    </template>
                </el-table-column>

                <el-table-column label="分类" min-width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sort_name }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="标签" min-width="200" align="center">
                    <template slot-scope="scope">
                        <template>
                            <el-tag
                                style="margin-left: 3px"
                                type="warning"
                                v-for="item in scope.row.blog_tags"
                                :key="item.uid"
                            >{{ item.tag_name }}
                            </el-tag>
                        </template>
                    </template>
                </el-table-column>

                <el-table-column
                    label="推荐等级"
                    min-width="100"
                    align="center"
                    prop="level"
                >
                    <template slot-scope="scope">
                        <el-tag
                            v-if="parseInt(scope.row.recommend_level) === 1"
                            type="success"
                        >一级推荐
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.recommend_level) === 2" type="info"
                        >二级推荐
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.recommend_level) === 3" type="info"
                        >三级推荐
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.recommend_level) === 4" type="info"
                        >四级推荐
                        </el-tag
                        >
                        <el-tag
                            v-if="parseInt(scope.row.recommend_level) === -1"
                            type="info"
                        >不推荐
                        </el-tag
                        >
                    </template>
                </el-table-column>

                <el-table-column
                    label="点击数"
                    min-width="90"
                    align="center"
                    prop="clickCount"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.clicks }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="开启评论"
                    min-width="100"
                    align="center"
                    prop="openComment"
                >
                    <template slot-scope="scope">
                        <el-tag
                            v-if="parseInt(scope.row.is_open_comment) === 1"
                            type="success"
                        >开启
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.is_open_comment) === 2" type="info"
                        >关闭
                        </el-tag
                        >
                    </template>
                </el-table-column>

                <el-table-column label="发布状态" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="parseInt(scope.row.blog_status) === 1" type="success"
                        >发布
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.blog_status) === 2" type="info"
                        >下架
                        </el-tag
                        >
                        <el-tag v-if="parseInt(scope.row.blog_status) === 3" type="info"
                        >草稿
                        </el-tag
                        >
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" min-width="160" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="排序" min-width="160" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.order_num }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" min-width="150">
                    <template slot-scope="scope">
                        <el-button
                            @click="handleEdit(scope.row)"
                            type="primary"
                            size="small"
                        >编辑
                        </el-button>
                        <el-button
                            @click="handleSingleDelete(scope.row, scope.$index + 1)"
                            type="danger"
                            size="small"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--  分页  -->
        <div class="pagination-box" :style="{ height: `${paginationBoxHeight}px` }">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageChange"
                :current-page="this.searchParam.currentPage"
                :page-sizes="[20, 40, 60, 80, 100]"
                :page-size="this.searchParam.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>

        <!-- 批量删除对话框 -->
        <el-dialog
            title="批量删除"
            :visible.sync="batchDeleteDialogVisible"
            width="500px"
            :before-close="deleteBeforeClose"
        >
            <el-form>
                <el-form-item>
                    <h3 style="color: #ed4014">确定要删除以下数据吗</h3>
                </el-form-item>

                <el-form-item label="删除数据" label-width="80px">
                    <el-card
                        style="height: 300px; overflow-y: auto"
                        :body-style="{ padding: '5px 10px' }"
                    >
                        <div
                            v-for="item in selectIndex"
                            :key="item"
                            style="font-size: 14px"
                        >
                            <span style="color: #ed4014">*</span>
                            <span>{{ item }}</span>
                        </div>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteCancelHandle">取 消</el-button>
                <el-button
                    type="danger"
                    @click="deleteConfirmHandle"
                    :disabled="isDemoVersion"
                >确定删除
                </el-button
                >
            </div>
        </el-dialog>

        <!--  博客编辑器  -->
        <div v-if="isShowEditor">
            <BlogEditor
                ref="BlogEditor"
                @showBlogExtraDialogHandle="showBlogExtraDialogHandle"
                @saveBlogHandle="saveBlogHandle"
                @closeEditorHandle="closeEditorHandle"
                :uid="form.uid"
                :headers="headers"
                :blogTitle="form.blogTitle"
                @blogTitleInputHandle="blogTitleInputHandle"
                :blogContent="form.blogContent"
                @blogContentInputHandle="blogContentInputHandle"
                :orderNum="form.orderNum"
                @orderNumInputHandle="orderNumInputHandle"
                :originAddress="form.originAddress"
                @originAddressInputHandle="originAddressInputHandle"
                :currentCoverUrl="form.currentCoverUrl"
                :action="action"
                @handleAvatarSuccess="handleAvatarSuccess"
                @removeCoverHandle="removeCoverHandle"
                :blogSummary="form.blogSummary"
                @blogSummaryInputHandle="blogSummaryInputHandle"
                :blogSortList="blogSortList"
                :blogSort="form.blogSort"
                @blogSortChangeHandle="blogSortChangeHandle"
                :blogTagList="blogTagList"
                :blogTag="form.blogTag"
                @blogTagChangeHandle="blogTagChangeHandle"
                :blogStatusList="blogStatusList"
                :blogStatus="form.blogStatus"
                @blogStatusChangeHandle="blogStatusChangeHandle"
                :recommendLevelList="recommendLevelList"
                :recommendLevel="form.recommendLevel"
                @recommendLevelChangeHandle="recommendLevelChangeHandle"
                :isOpenCommentList="isOpenCommentList"
                :isOpenComment="form.isOpenComment"
                @isOpenCommentChangeHandle="isOpenCommentChangeHandle"
                :isPrivate="form.isPrivate"
                @isPrivateChangeHandle="isPrivateChangeHandle"
                :isOriginalList="isOriginalList"
                :isOriginal="form.isOriginal"
                @isOriginalChangeHandle="isOriginalChangeHandle"
            />
        </div>
    </div>
</template>

<script>
import {blogApi} from "@/api/blog";
import {blogSortApi} from "@/api/blogSort";
import {blogTagApi} from "@/api/blogTag";
/*
 * 获得一个全局引用过来的 dexie 对象 用来操作indexDB
 * 每次文章内容改变的时候，都将内容存再本地一份
 * 防止浏览器突然崩溃、电脑断电、断网等意外而导致写的文章丢失
 *
 * 每次文章保存到数据库时，就清空indexDB中的数据
 * 如果不保存数据，新建文章时，就先读取本地indexDB数据库中的数据，
 * 如果有，就说明上次时意外关闭的，提示是否加载上次内容
 *
 * */
import MyDB from "@/lib/db";
import {MessageBox} from "element-ui";
import dayjs from "dayjs";
import {downloadFile} from "@/api/downLoad";
import {appMutation} from "@/store/mutation-types";
import RightToggleBar from "@/components/RightToggleBar/RightToggleBar";
import BlogEditor from "@/components/BlogEditor/BlogEditor";
// import store from "@/store";
/*
 * 上传博客是一个一个上传的，每次上传完后，会调用getList方法，刷新当前文章列表
 * 如果一次上传多个文章，就会调用多次getList方法
 * 增加一个延迟timer，节流
 * */
let uploadBlogTimerForGetList = null;
const db = new MyDB();

export default {
    name: "Blog",
    components: {
        /*两个按钮：搜索和刷新*/
        RightToggleBar,
        /*博客编辑*/
        BlogEditor,
    },
    computed: {
        // 是否隐藏搜索框
        isHideSearch() {
            return this.$store.state.app.isHiddenSearch;
        },
        /*上传地址*/
        importAction() {
            let baseURL = process.env.VUE_APP_BASE_URL;
            return `${baseURL}/article/importArticle`;
            // if (process.env.NODE_ENV === 'development') { // 开发环境
            //     baseURL = myConfig.apiUrlDevelopment
            // } else { // 生产环境
            //     if (this.isDemoVersion) {
            //         baseURL = myConfig.apiUrlDemo
            //     } else {
            //         baseURL = myConfig.apiUrlProduction
            //     }
            // }
        },
        /*上传时的请求的额外头部*/
        headers() {
            return {
                Authorization: this.$store.state.user.token,
                userid: this.$store.state.user.loginUserInfo.uid,
                username: this.$store.state.user.loginUserInfo.user_name,
            };
        },
        /*文件上传地址*/
        action() {
            let baseURL = process.env.VUE_APP_BASE_URL;
            // if(process.env.NODE_ENV === 'development'){ // 开发环境
            //     baseURL = myConfig.apiUrlDevelopment
            // } else { // 生产环境
            //     if(this.isDemoVersion){
            //         baseURL = myConfig.apiUrlDemo
            //     } else {
            //         baseURL = myConfig.apiUrlProduction
            //     }
            // }
            return `${baseURL}/file/uploadFile`;
        },
        // 是否是演示版本
        isDemoVersion() {
            return this.$store.state.user.loginUserInfo.role_name === "testUser" // 加载到了全局，直接获取
        },
        /*下载时的路径*/
        exportUrl() {
            return "/article/exportArticle";
        },

        // 表格的默认减去的高度
        calcTableHeight() {
            if (this.$store.state.app.isHiddenSearch) {
                return this.featureBtnsHeight + this.paginationBoxHeight;
            } else {
                return (
                    this.filterContainerHeight +
                    this.featureBtnsHeight +
                    this.paginationBoxHeight
                );
            }
        },
    },
    data() {
        return {
            filterContainerHeight: 40, // 筛选框的高度
            featureBtnsHeight: 25,
            paginationBoxHeight: 60, // 分页栏的高度

            searchParam: {
                blogTitle: "",
                isPrivate: "", //是否私密
                blogSort: "",
                blogTag: "",
                recommendLevel: "", //推荐等级
                blogStatus: "", //发布，下架，草稿
                isOriginal: "", //是否原创

                isOpenComment: "", //是否开启评论
                currentPage: 1, // 当前页
                pageSize: 30, // 列表总条数
            },
            tableData: [],
            isShowEditor: false,
            total: null, // 列表总条数

            isPrivateList: [
                //是否私密
                {
                    uid: "1",
                    isPrivate: "私密",
                },
                {
                    uid: "2",
                    isPrivate: "公开",
                },
            ],
            blogSortList: [],
            blogTagList: [],
            recommendLevelList: [
                {
                    uid: "1",
                    recommendLevel: "一级推荐",
                },
                {
                    uid: "2",
                    recommendLevel: "二级推荐",
                },
                {
                    uid: "3",
                    recommendLevel: "三级推荐",
                },
                {
                    uid: "4",
                    recommendLevel: "四级推荐",
                },
                {
                    uid: "-1",
                    recommendLevel: "不推荐",
                },
            ],
            blogStatusList: [
                //发布，下架，草稿
                {
                    uid: "1",
                    blogStatus: "发布",
                },
                {
                    uid: "2",
                    blogStatus: "下架",
                },
                {
                    uid: "3",
                    blogStatus: "草稿",
                },
            ],
            isOriginalList: [
                {
                    uid: "1",
                    isOriginal: "原创",
                },
                {
                    uid: "2",
                    isOriginal: "转载",
                },
                {
                    uid: "3",
                    isOriginal: "翻译",
                },
            ],
            isOpenCommentList: [
                {
                    uid: "1",
                    isOpenComment: "开启",
                },
                {
                    uid: "2",
                    isOpenComment: "关闭",
                },
            ],
            /*上传时的额外参数*/
            fileExtraData: {
                blogTitle: "",
                blogContent: "",
                currentCoverUrl: "",
                blogSummary: "",

                blogSortId: "",
                blogTagIds: [],

                blogStatus: "3",
                isOriginal: "",
                recommendLevel: "",
                isOpenComment: "",
                isPrivate: "",
                coverUrl: "",

                order: "",
            },

            selectIds: [], // 等待删除数据的id
            selectIndex: [], // 等待删除数据的索引

            batchDeleteDialogVisible: false, //控制批量删除提示弹出框

            // 博客编辑器
            isContentChange: false, // 添加一个标识，表示内容变更了，关闭编辑框时，判断内容是否变更，变更了就弹出提示框，文本尚未保存，确认放弃编辑，如果没变更，就不弹提示框，默认状态是未变更
            isUpdateBlog: false, // 是否时编辑博客 默认是新增
            form: {
                uid: "",
                blogTitle: "",
                blogContent: "",
                currentCoverUrl: "",
                blogSummary: "",

                blogSort: "",
                blogTag: [],

                blogStatus: "",
                isOriginal: "",
                recommendLevel: "",
                isOpenComment: "",
                isPrivate: "",

                orderNum: "",
                originAddress: "",
            },
        };
    },
    methods: {
        /**
         * 条件搜索
         * */
        handleFind() {
            this.getList();
            // console.log('handleFind')
        },
        /**
         * 获取多篇文章
         * */
        async getList() {
            let params = {
                blogTitle: this.searchParam.blogTitle,

                blogSortId: this.searchParam.blogSort,
                blogTag: this.searchParam.blogTag,

                blogStatus: this.searchParam.blogStatus,
                isOriginal: this.searchParam.isOriginal,
                recommendLevel: this.searchParam.recommendLevel,
                isOpenComment: this.searchParam.isOpenComment,
                isPrivate: this.searchParam.isPrivate,
                currentPage: this.searchParam.currentPage, // 当前页
                pageSize: this.searchParam.pageSize, // 列表总条数
            };

            let {data} = await blogApi.queryArticlePage(params);
            if (data.code === 1) {
                this.tableData = data.data.result;
                this.total = data.data.total;
            } else {
                this.$message({
                    message: data.data.extendInfo ? data.data.extendInfo : data.data.msg,
                    type: "error",
                    duration: 1500,
                });
            }
        },
        /**
         * 获取所有文章分类
         * */
        async getBlogSortList() {
            let {data} = await blogSortApi.queryArticleSortAll();
            this.blogSortList = data.data;
        },
        /**
         * 获取所有文章标签
         * */
        async getBlogTagList() {
            let {data} = await blogTagApi.queryBlogTagAll();
            this.blogTagList = data.data;
        },
        /**
         * 展示编辑框
         * */
        async showEditorHandle() {
            // 显示编辑框之前 判断本地indexDB中是否有上次未保存的内容
            const findData = await db.query();
            console.log(findData, "findData");

            // 若果有，就说明上次编辑框异常关闭
            if (findData) {
                this.$confirm("检测到上次有未保存的内容，是否继续编辑？", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "放弃编辑",
                })
                    .then(() => {
                        this.form.blogContent = findData.content;
                        this.form.uid = findData.blogUid;
                        this.form.blogTitle = findData.title;
                        this.isContentChange = true;
                        this.isShowEditor = true;
                    })
                    .catch(async (action) => {
                        // console.log(action, 'action')
                        switch (action) {
                            // 点击了放弃编辑按钮
                            case "cancel":
                                // 清空本地indexDB内容
                                await db.delete();
                                this.isShowEditor = true;
                                break;
                            // 按了ESC 或者是点击了遮罩层，将弹出层直接关闭，未作响应
                            case "close":
                                // 什么也不干
                                break;
                        }
                    });
            } else {
                // 本地indexDB中没有内容，直接显示编辑框
                this.isShowEditor = true;
            }
        },
        emptyBlogFormData() {
            this.form = {
                uid: "",
                blogTitle: "",
                blogContent: "",
                currentCoverUrl: "",
                blogSummary: "",

                blogSort: "",
                blogTag: [],

                blogStatus: "",
                isOriginal: "",
                recommendLevel: "",
                isOpenComment: "",
                isPrivate: "",

                orderNum: "",
                originAddress: "",
            };
        },

        /*=================== 文件上传 start =====================*/
        beforeUpload(file) {
            console.info("🚀 ~ file:Blog method:beforeUpload line:846 -----file", file)
            this.fileExtraData.blogTitle = `${file.name}-${dayjs().format(
                "YYYY-MM-DD HH:mm:ss:SSS"
            )}`;
        },

        fileSuccess(res) {
            // 每次先清空上一次的timer
            clearTimeout(uploadBlogTimerForGetList);

            if (res.code === 1) {
                this.$message({
                    message: "上传成功",
                    type: "success",
                    duration: 1500,
                });

                uploadBlogTimerForGetList = setTimeout(() => {
                    this.getList();
                }, 100);
            } else {
                this.fileError(res);
            }
        },
        fileError(err) {
            console.dir(err);
            if (err.status === 401) {
                MessageBox.confirm(
                    "token已过期，可以取消继续留在该页面，或者重新登录",
                    "重新登录",
                    {
                        confirmButtonText: "重新登录",
                        cancelButtonText: "取消",
                        showClose: false,
                        closeOnClickModal: false,
                        type: "warning",
                    }
                ).then(async () => {
                    //1、清除已过期token
                    //2、跳转到登录页
                    await this.$store.dispatch("clearAll");
                    await this.$router.push("/login");
                });
            } else {
                this.$message({
                    message: err.extendInfo ? err.extendInfo : err.message,
                    type: "error",
                    duration: 1500,
                });
            }
        },
        /*=================== 文件上传 end =====================*/

        /*=================== 文件导出 start =====================*/
        // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        async handleDownload() {
            if (this.selectIds.length === 0) {
                this.$message({
                    message: "请至少选择一项",
                    type: "warning",
                    duration: 1500,
                });
            } else {
                await downloadFile({
                    url: this.exportUrl,
                    fileName: "测试",
                    fileSuffix: "zip",
                    blobType: "application/zip",
                    data: this.selectIds,
                });
            }
        },
        /*=================== 文件导出 end =====================*/

        /*=================== 删除 start =====================*/
        // 单个删除
        handleSingleDelete(row, index) {
            this.selectIndex.push(index);
            this.selectIds.push(row.uid);
            this.batchDeleteDialogVisible = true;
            console.log(row, index, "handleSingleDelete");
        },
        deleteBeforeClose(done) {
            console.log("关闭弹出层前，清空数据");
            this.selectIndex = [];
            this.selectIds = [];
            this.$refs.table.clearSelection();
            done();
        },
        deleteCancelHandle() {
            this.selectIndex = [];
            this.selectIds = [];
            this.$refs.table.clearSelection();
            this.batchDeleteDialogVisible = false;
        },
        // 删除选中
        handleDeleteSelected() {
            if (this.selectIds.length === 0) {
                this.$message({
                    type: "warning",
                    message: "至少选择一项",
                    duration: 1500,
                });
            } else {
                this.batchDeleteDialogVisible = true;
                console.log("handleDeleteSelected");
            }
        },
        // 确认删除
        async deleteConfirmHandle() {
            let {data} = await blogApi.deleteArticleByUid(this.selectIds);
            if (data.code === 1) {
                this.$message({
                    message: "删除成功",
                    type: "success",
                    duration: 1500,
                });
                this.selectIds = [];
                this.selectIndex = [];
                this.batchDeleteDialogVisible = false;
                await this.getList();
            } else {
                this.$message({
                    message: data.extendInfo ? data.extendInfo : data.msg,
                    type: "error",
                    duration: 1500,
                });
            }
        },

        /*当表格 选择项发生变化时会触发该事件*/
        selectHandle(rows) {
            this.selectIds = rows.map((item) => {
                return item.uid;
            });
            let tempIndex = [];
            this.tableData.map((item, index) => {
                if (this.selectIds.includes(item.uid)) {
                    tempIndex.push(index + 1);
                }
            });
            this.selectIndex = tempIndex;
        },
        /*=================== 删除 end =====================*/

        // 刷新表格数据
        resetTableList() {
            this.getList();
            console.log("resetTableList");
        },
        // 切换搜索框显示隐藏
        toggleSearchStatus() {
            this.$store.commit(appMutation.TOGGLE_SEARCHBAR);
        },

        onClick() {
            console.log("onClick");
        },

        // 编辑
        handleEdit(row) {
            console.log(row, "row");
            const tempArr = [];
            row.blog_tags.map((item) => {
                if (item) {
                    tempArr.push(item.blog_tag_id);
                }
            });

            this.form = {
                uid: "" + row.uid,
                blogTitle: "" + row.blog_title,
                blogContent: "" + row.blog_content,
                currentCoverUrl: "" + row.cover_url,
                blogSummary: "" + row.blog_summary,

                blogSort: "" + row.blog_sort_id,
                blogTag: tempArr,

                blogStatus: "" + row.blog_status,
                isOriginal: "" + row.is_original,
                recommendLevel: "" + row.recommend_level,
                isOpenComment: "" + row.is_open_comment,
                isPrivate: "" + row.is_private,

                orderNum: "" + row.order_num,
                originAddress: "" + row.origin_address,
            };
            this.showEditorHandle();
            console.log(row, "handleEdit");
        },

        // 分页 pageSize 改变时触发
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.searchParam.pageSize = val;
            this.searchParam.currentPage = 1;
            this.getList();
        },
        // 分页 currentPage 改变时触发
        handleCurrentPageChange(val) {
            console.log(`当前页 ${val}`);
            this.searchParam.currentPage = val;
            this.getList();
        },

        /*显示编辑博客的二级弹窗*/
        showBlogExtraDialogHandle() {
            this.$refs["BlogEditor"].showPublishEditor();
        },

        /*保存博客到数据库*/
        async saveBlogHandle(flag) {
            let params = {
                uid: this.form.uid,
                blogTitle: this.form.blogTitle,
                blogContent: this.form.blogContent,
                coverUrl: this.form.currentCoverUrl,
                blogSummary: this.form.blogSummary,

                blogSortId: this.form.blogSort,
                blogTagIds: this.form.blogTag,

                isOriginal: this.form.isOriginal,
                recommendLevel: this.form.recommendLevel,
                isOpenComment: this.form.isOpenComment,
                isPrivate: this.form.isPrivate,

                order: this.form.orderNum,
                originAddress:
                    +this.form.isOriginal === 1 ? "" : this.form.originAddress, //为原创时，来源地址置为空
            };

            if (flag === "draft") {
                params.blogStatus = "3"; // 草稿
            } else {
                params.blogStatus = this.form.blogStatus;
            }

            let data;

            if (params.uid) {
                // 如果有uid， 表示是修改
                data = await blogApi.updateArticleByUid(params);
            } else {
                // 如果没有uid，表示是新增
                data = await blogApi.saveArticle(params);
            }

            if (data.data.code === 1) {
                this.$message({
                    message: "保存成功",
                    type: "success",
                    duration: 1500,
                });

                this.isContentChange = false;
                await this.closeEditorHandle();
                await this.getList();

                // 在此处清空本地indexDB中的文章内容
                await db.delete();
            } else {
                this.$message({
                    message: data.data.extendInfo ? data.data.extendInfo : data.data.msg,
                    type: "error",
                    duration: 1500,
                });
            }
        },

        /*关闭编辑框时
        如有内容， 就询问是否保存草稿到indexDB
                    如果保存，就保存
                    否则，清空，关闭
         否则直接关闭*/
        closeEditorHandle() {
            if (this.isContentChange) {
                console.log("内容变更了，但是未保存");
                this.$confirm("博客尚未保存，是否保存为草稿？", "提示", {
                    distinguishCancelAndClose: true,
                    confirmButtonText: "保存为草稿",
                    cancelButtonText: "丢弃",
                })
                    .then(async () => {
                        // 保存为草稿
                        const findData = await db.query();
                        this.form.blogContent = findData.content;
                        this.form.uid = findData.blogUid;
                        this.form.blogTitle =
                            findData.title.trim() === ""
                                ? dayjs().format("YYYY-MM-DD HH:mm:ss")
                                : findData.title.trim();
                        await this.saveBlogHandle("draft");
                    })
                    .catch(async (action) => {
                        switch (action) {
                            // 点击了放弃编辑按钮
                            case "cancel":
                                // 清空本地indexDB内容
                                await db.delete();
                                this.isContentChange = false;
                                this.isShowEditor = false;
                                this.emptyBlogFormData();
                                break;
                            // 按了ESC 或者是点击了遮罩层，将弹出层直接关闭，未作响应
                            case "close":
                                // 什么也不干
                                break;
                        }
                    });
            } else {
                this.emptyBlogFormData();
                console.log("内容未变更");
                this.isShowEditor = false;
            }
        },
        /*处理 标题输入*/
        async blogTitleInputHandle(val) {
            // 添加一个标识，表示内容变更了，关闭编辑框时，判断内容是否变更，变更了就弹出提示框，文本尚未保存，确认放弃编辑，如果没变更，就不弹提示框，默认状态是未变更
            this.isContentChange = true;
            // 每次内容变更时，将内容存入本地的indexDB数据库中
            await db.update(this.form.blogContent, val, this.form.uid);
            this.form.blogTitle = val;
            console.log(val, "blogTitleInputHandle");
        },
        /*处理 内容输入*/
        async blogContentInputHandle(val) {
            // 添加一个标识，表示内容变更了，关闭编辑框时，判断内容是否变更，变更了就弹出提示框，文本尚未保存，确认放弃编辑，如果没变更，就不弹提示框，默认状态是未变更
            this.isContentChange = true;

            // 每次内容变更时，将内容存入本地的indexDB数据库中
            await db.update(val, this.form.blogTitle, this.form.uid);
            this.form.blogContent = val;

            console.info("🚀 ~ file:Blog method:blogContentInputHandle line:1198 ----- this.form.blogContent\n",  this.form.blogContent)
        },

        /*处理 排序输入*/
        orderNumInputHandle(val) {
            console.log(val, "orderNumInputHandle");
            this.form.orderNum = val;
        },
        /*处理 地址输入*/
        originAddressInputHandle(val) {
            console.log(val, "originAddressInputHandle");
            this.form.originAddress = val;
        },
        /*处理 封面输入*/
        removeCoverHandle() {
            this.form.currentCoverUrl = "";
        },
        handleAvatarSuccess(val) {
            this.form.currentCoverUrl = val;
        },
        /*处理 简介输入*/
        blogSummaryInputHandle(val) {
            console.log(val, "val");
            this.form.blogSummary = val;
        },
        /*处理 标签输入*/
        blogTagChangeHandle(val) {
            console.log(val, "blogTagChangeHandle");
            this.form.blogTag = val;
        },
        /*处理 分类输入*/
        blogSortChangeHandle(val) {
            console.log(val, "blogSortChangeHandle");
            this.form.blogSort = val;
        },
        /*处理 状态输入*/
        blogStatusChangeHandle(val) {
            console.log(val, "blogStatusChangeHandle");
            this.form.blogStatus = val;
        },

        /*处理 是否原创输入*/
        isOriginalChangeHandle(val) {
            console.log(val, "isOriginalChangeHandle");
            this.form.isOriginal = val;
        },

        /*处理 推荐等级输入*/
        recommendLevelChangeHandle(val) {
            console.log(val, "recommendLevelChangeHandle");
            this.form.recommendLevel = val;
        },

        /*处理 能否评论输入*/
        isOpenCommentChangeHandle(val) {
            console.log(val, "isOpenCommentChangeHandle");
            this.form.isOpenComment = val;
        },

        /*处理 是否公开输入*/
        isPrivateChangeHandle(val) {
            console.log(val, "isPrivateChangeHandle");
            this.form.isPrivate = val;
        },
    },

    mounted() {
        this.getBlogSortList();
        this.getBlogTagList();
        this.getList();

        // console.log({
        //     Authorization: this.$store.state.user.token,
        //     userid: this.$store.state.user.loginUserInfo.uid,
        //     username: this.$store.state.user.loginUserInfo.user_name,
        // });
        // console.log(
        //     this.$store.state.user.token,
        //     this.$store.state.user.loginUserInfo.uid,
        //     this.$store.state.user.loginUserInfo.user_name,
        // )
    },
};
</script>

<style scoped lang="scss">
@import "Blog";
</style>
