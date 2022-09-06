const Service = require('egg').Service;

const {
    saveCommentSql,
    deleteCommentByUidSql,
    updateCommentByUidSql,
    queryCommentPageSql,
    queryCommentSql,
    queryAllCountCommentSql,
    queryCommentByCommentContentSql,
    queryCommentByUidSql,
    queryCommentAllSql,
    passOrRejectCommentByUidSql,
} = require('../sql/comment')

class Comment extends Service {
    async queryCommentByCommentContent(commentContent) {
        const resultArr = await this.app.mysql.query(queryCommentByCommentContentSql, [commentContent])
        return resultArr[0]
    }

    async queryCommentByUid(uid) {
        const resultArr = await this.app.mysql.query(queryCommentByUidSql, [uid])
        return resultArr[0]
    }

    async saveComment(params) {

        let {
            uid, commentContent, commentSource, sourceId,
            commentStatus, commentPersonId, commentedPersonId, toCommentId,
            rootCommentId, commentLayer, orderNum, createTime, updateTime
        } = params


        await this.app.mysql.query(
            saveCommentSql,
            [
                uid, commentContent, commentSource, sourceId,
                commentStatus, commentPersonId, commentedPersonId, toCommentId,
                rootCommentId, commentLayer, orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async queryCommentPage(params) {

        let {
            currentPage, pageSize,
            commentContent, commentSource, sourceId, commentStatus,
            commentPersonId, commentedPersonId, toCommentId, rootCommentId, commentLayer,
            orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize


        return await this.app.mysql.query(
            queryCommentPageSql,
            [
                `%${commentContent}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${commentStatus}`,
                `%${commentPersonId}%`,
                `%${commentedPersonId}%`,
                `%${toCommentId}%`,
                `%${rootCommentId}%`,
                `${commentLayer}`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async queryComment(params) {

        // 1、获取查到的所有评论
        let {
            commentContent, commentSource, sourceId, commentStatus,
            commentPersonId, commentedPersonId, toCommentId, rootCommentId, commentLayer,
            orderNum
        } = params

        let queryComments = await this.app.mysql.query(
            queryCommentSql,
            [
                `%${commentContent}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${commentStatus}`,
                `%${commentPersonId}%`,
                `%${commentedPersonId}%`,
                `%${toCommentId}%`,
                `%${rootCommentId}%`,
                `${commentLayer}`,
                `${orderNum}`,
            ])
        // 2、获取所有评论的点赞数
        let commentsReactionCount = await this.ctx.service.commentReaction.queryReactionEveryContentCount(params)
        // 3、获取点赞人
        let commentsReactionPerson = await this.ctx.service.commentReaction.queryReactionEveryContentPerson(params)
        // 4、将点赞数转换为map
        let reactionCountMap = this.convertReactionToMap(commentsReactionCount)
        // 5、将点赞数拼接到评论中
        let commentsWithReactionCount = this.handleCommentsAddReaction(queryComments, reactionCountMap, 'count')
        // 6、将点赞人转换为map
        let reactionPersonMap = this.convertReactionToMap(commentsReactionPerson)
        // 7、将点赞人拼接到评论中
        let commentsWithReactionCountAndPerson = this.handleCommentsAddReaction(commentsWithReactionCount, reactionPersonMap, 'person')

        return commentsWithReactionCountAndPerson

    }

    /**
     * @description 将查询出来的评论，与查询出来的点赞数，按照评论的id，拼接到一起，返回给前台
     * @param {Array} comments
     * @param {Map} reactionMap
     * @param {String} flag count|person 标识符，返回不一样的字段
     * @return {*[]}
     */
    handleCommentsAddReaction(comments, reactionMap, flag) {
        if (flag === 'count') {
            return comments.map(item => {
                item.reactions_count = reactionMap.get(item.uid) ? reactionMap.get(item.uid) : []
                return item
            })
        }

        return comments.map(item => {
            item.reactions_person = reactionMap.get(item.uid) ? reactionMap.get(item.uid) : []
            return item
        })

    }


    /**
     * @description 将查询过来的点赞数量，按照评论的uid转换为map结构，方便拼接到评论的数据集中
     * @param {Array} reactions 等待处理的从数据库直接查过来的点赞情况
     * @return {Map<any,any>} tempMap 处理后的map
     */
    convertReactionToMap(reactions) {
        const tempMap = new Map()

        reactions.map(item => {
            // 1、遇见第一个评论id时，将map的value设置为一个数组，将数据push到数组里
            //  再遇到相同的评论id时，直接取原先的值，继续往里push
            if (!tempMap.has(item.comment_id)) {
                tempMap.set(item.comment_id, [{...item}])
            } else {
                tempMap.get(item.comment_id).push({...item})
            }
        })

        return tempMap
    }


    async updateCommentByUid(params) {
        let {
            uid, commentContent, commentSource, sourceId,
            commentStatus, commentPersonId, commentedPersonId, toCommentId,
            rootCommentId, commentLayer, orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateCommentByUidSql,
            [
                commentContent, commentSource, sourceId, commentStatus,
                commentPersonId, commentedPersonId, toCommentId, rootCommentId, commentLayer,
                orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteCommentByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async (uid) => {
                        return await this.app.mysql.query(deleteCommentByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async passOrRejectCommentByUid(uids, commentStatus) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async (uid, commentStatus) => {
                        return await this.app.mysql.query(passOrRejectCommentByUidSql, [commentStatus, uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }


    async queryAllCountComment(params) {
        let {
            commentContent, commentSource, sourceId, commentStatus,
            commentPersonId, commentedPersonId, toCommentId, rootCommentId, commentLayer,
            orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountCommentSql,
            [
                `%${commentContent}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${commentStatus}`,
                `%${commentPersonId}%`,
                `%${commentedPersonId}%`,
                `%${toCommentId}%`,
                `%${rootCommentId}%`,
                `${commentLayer}`,
                `${orderNum}`
            ])
        return result[0]
    }


    async queryCommentAll() {
        return await this.app.mysql.query(queryCommentAllSql, [])
    }

    /**
     * @description 处理违规评论
     * @param {Array} comments
     * @return {Array} 处理后的评论列表
     */
    convertIllegalComment(comments) {
        return comments.map(item => {
            if (+(item.comment_status) === 3) {
                item.comment_content = '违规消息，已被系统自动屏蔽'
            }
            return item
        })
    }

    /**
     * @description 游客可以看到的评论列表
     * @param {Array} comments
     * @return {Array} 处理后的评论列表
     *
     * 只可以看到，审核通过的、和 处理后的违规评论
     */
    commentAboutVisitorsCanSee(comments) {
        return comments.filter(item => {
            let commentStatus = +(item.comment_status)

            if (commentStatus === 2 || commentStatus === 3) {
                return item
            }
        })
    }

    /**
     * @description 登录用户可以看到的评论列表
     * @param {Array} comments
     * @param {String} userId 登录人的uid
     * @return {Array} 处理后的评论列表
     *
     * 只可以看到，审核通过的、处理后的违规评论 和 自己待审核的
     */
    commentAboutUserCanSee(comments, userId) {
        return comments.filter(item => {
            let commentStatus = +(item.comment_status)

            if (commentStatus === 2 || commentStatus === 3 || (commentStatus === 1 && item.comment_person_id === userId)) {
                return item
            }
        })
    }

}

module.exports = Comment;
