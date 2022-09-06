import CommentMessageList from "@/components/CommentMessageList/CommentMessageList";
import CommentBox from "@/components/CommentBox/CommentBox";

import {indexMutation, messageBoardMutation} from '@/store/mutation-types'

import {commentApi} from '@/api/comment'
import {commentReactionApi} from '@/api/commentReaction'
import {commentInformApi} from '@/api/commentInform'

import {groupCommentList, flatCommentListToTree} from '@/lib/handleData'

export default {
    components: {
        CommentMessageList,
        CommentBox,
    },
    data() {
        return {
            /*====================  留言板 start  ============================*/
            form: {
                commentContent: null, // 评论内容
                commentSource: 1, // 评论来源：-1，关于我；1，留言板；2，专题；3，文章
                sourceId: 1, // 来源的id：存放对应来源的id，专题有专题uid，文章有文章uid，留言板uid给个默认值1，关于我默认值-1
                commentStatus: 2, // 评论状态：1，待审核；2，通过；3，违规评论
                commentPersonId: null, // 评论人：评论人的id
                commentLayer: 1, // 评论的层级，总共有五层，1，2，3，4，5
            },

            commentedPersonId: '', // 被评论人：被评论人的id，可以为空，第一条评论没有被评论人
            toCommentId: '', // 回复的哪条评论：存放评论的id，可以为空，为空说明这条评论没有回复任何人，是第一条评论
            rootCommentId: '', // 根评论：存放根评论的id，这条评论链是从哪条评论发散出来的，即评论的源头，可以为空，为空说明这条评论就是根


            searchParam: {
                commentSource: 1,
                sourceId: 1,
            },


            total: null, // 列表总条数

            flatComment: [], // 处理过的评论列表，符合gitee的分页显示，只需将这个列表截取相应的数据，转换为树形结构即可

            // 前端分页
            currentPage: 1,
            pageSize: 10,

            /*====================  留言板 end  ============================*/
        }
    },
    methods: {
        /*====================  留言板 start  ============================*/
        /*举报*/
        async reportCommentHandle(reportForm) {
            const params = {
                ...reportForm,
                informPersonId: this.loginUserInfo.uid,
                informCommentId: this.waitToReportCommentId,
                commentSource: this.searchParam.commentSource,
                sourceId: this.searchParam.sourceId,
            }

            let data = await commentInformApi.saveCommentInform(params)
            if (data.data.code === 1) {
                this.$message({
                    message: '举报成功，感谢您的反馈',
                    type: 'success',
                    duration: 1500,
                })
                await this.$refs['commentMessageList'].emptyReportCommentIdFromVuex()
            } else {
                this.$message({
                    message: data.data.extendInfo ? data.data.extendInfo : data.data.msg,
                    type: 'error',
                    duration: 1500,
                })
            }
        },


        async publishStandpointHandle(data) {
            let {
                emoji, // 表情内容
                uid, // 评论的uid
                isSelected, // 这个表情是否已经选过
                currentSelectEmojiUid, // 只有这个表情选过的时候，才有值，否则是undefined
            } = data

            let params = {
                commentId: uid,
                reactionPersonId: this.loginUserInfo.uid,
                reactionContent: emoji.id,
                commentSource: this.searchParam.commentSource,
                sourceId: this.searchParam.sourceId,
            }

            if (isSelected) { // 如果已经点过赞了，再次点击说明是取消操作，在数据库中把自己的这条记录删除
                let {data} = await commentReactionApi.deleteCommentReactionByUid([currentSelectEmojiUid.uid])
                if (data.code === 1) {
                    await this.getCommentList()
                } else {
                    this.$message({
                        message: data.extendInfo ? data.extendInfo : data.msg,
                        type: 'error',
                        duration: 1500,
                    })
                }
            } else { // 如果没有被选中，点击说明是正经点赞操作，找到数据库添加一条记录
                let {data} = await commentReactionApi.saveCommentReaction(params)
                if (data.code === 1) {
                    await this.getCommentList()
                } else {
                    this.$message({
                        message: data.extendInfo ? data.extendInfo : data.msg,
                        type: 'error',
                        duration: 1500,
                    })
                }
            }


        },

        /*删除评论*/
        deleteCommentsHandle() {
            this.$confirm('确认删除此条评论？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {

                let {data} = await commentApi.deleteCommentByUid(this.waitToDeleteCommentIds)
                if (data.code === 1) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                    })
                    await this.getCommentList()
                    // 清空待删除评论id
                    this.clearWaitToDeleteCommentsId()
                } else {
                    this.$message({
                        message: data.extendInfo ? data.extendInfo : data.msg,
                        type: 'error',
                        duration: 1500,
                    })
                }

            }).catch(() => {
                // 清空待删除评论id
                this.clearWaitToDeleteCommentsId()
            });
        },

        // 清空待删除评论id
        clearWaitToDeleteCommentsId() {
            this.$store.commit(messageBoardMutation.CHANGE_WAIT_DELETE_COMMENTS_IDS, [])
        },

        //刷新评论列表
        refreshCommentList() {
            this.getCommentList()
        },
        //加载更多
        loadMoreHandle() {
            this.currentPage++
        },
        /*插入表情*/
        insertEmoji(emoji) {
            if (!this.form.commentContent) {
                this.form.commentContent = emoji
            } else {
                this.form.commentContent += emoji
            }
        },
        /*取消评论*/
        cancelMessageHandle() {
            this.form.commentContent = ''
        },
        /*输入评论*/
        commentInputHandle(val) {
            this.form.commentContent = val
        },

        /*获取评论内容 根据指定来源和id*/
        async getCommentList() {
            let {data} = await commentApi.queryComment(this.searchParam)
            this.total = data.data.length
            this.flatComment = groupCommentList(data.data)
        },

        /*添加评论*/
        async sendMessageHandle() {
            this.form.commentPersonId = this.loginUserInfo.uid

            this.form.commentedPersonId = this.commentedPersonId
            this.form.toCommentId = this.toCommentId
            this.form.rootCommentId = this.rootCommentId



            //使用js原生提供的 window.btoa 和 window.atob 方法进行 Base64 转码。
            //
            // 表情是中文字符的还需配合 encodeURI 和 decodeURI 进行转码，再进行 Base64 转码。
            this.form.commentContent = window.btoa(encodeURI(this.form.commentContent));


            let {data} = await commentApi.saveComment(this.form)
            if (data.code === 1) {
                this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 1000,
                })

                // 留言成功后,初始化表单数据
                this.clearCommentData()

                await this.getCommentList()

            }
        },

        // 留言成功后,初始化表单数据
        clearCommentData() {
            this.form.commentContent = ''

            this.commentedPersonId = ''
            this.toCommentId = ''
            this.rootCommentId = ''
        },

        /*操作vuex变量，然后弹出登录框*/
        goToLogin() {
            this.$store.commit(indexMutation.SHOW_LOGIN_DIALOG)
        },

        /*====================  留言板 end  ============================*/
    },
    computed: {
        /*====================  留言板 start  ============================*/
        /*等待被举报id*/
        waitToReportCommentId() {
            return this.$store.state.messageBoard.waitReportedCommentId
        },
        /*等待被删除id*/
        waitToDeleteCommentIds() {
            return this.$store.state.messageBoard.waitDeleteCommentIds
        },
        /*用户信息*/
        loginUserInfo() {
            return this.$store.state.user.loginUserInfo
        },
        /*检查token，确定是否登录*/
        isLogin() {
            return !!this.$store.state.user.token
        },
        // 前端分页，从处理过的数组中拿出的条数
        takeNum() {
            return this.currentPage * this.pageSize
        },
        // 是否还有更多数据
        hasMore() {
            return this.total > this.takeNum
        },

        // 当前页的评论列表，将扁平化后的数组转换为树形结构
        commentList() {
            return flatCommentListToTree(this.flatComment.slice(0, this.takeNum))
        },

        /*====================  留言板 end  ============================*/
    },
}
