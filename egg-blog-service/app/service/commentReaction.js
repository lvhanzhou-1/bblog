const Service = require('egg').Service;

const {
    saveCommentReactionSql,
    deleteCommentReactionByUidSql,
    updateCommentReactionByUidSql,
    queryCommentReactionPageSql,
    queryAllCountCommentReactionSql,
    queryCommentReactionByCommentIdSql,
    queryCommentReactionByUidSql,
    queryCommentReactionAllSql,
    queryReactionEveryContentCountSql,
    queryReactionEveryContentPersonSql,
} = require('../sql/commentReaction')


class CommentReaction extends Service {

    async queryCommentReactionByCommentId(commentId) {
        const resultArr = await this.app.mysql.query(queryCommentReactionByCommentIdSql, [commentId])
        return resultArr[0]
    }

    async queryCommentReactionByUid(uid) {
        const resultArr = await this.app.mysql.query(queryCommentReactionByUidSql, [uid])
        return resultArr[0]
    }

    async saveCommentReaction(params) {
        let {
            uid, commentId, reactionPersonId, reactionContent, commentSource, sourceId,
            orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveCommentReactionSql,
            [
                uid, commentId, reactionPersonId, reactionContent, commentSource, sourceId,
                orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async queryCommentReactionPage(params) {
        /**
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        let {
            currentPage, pageSize,
            commentId, reactionPersonId, reactionContent, commentSource, sourceId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryCommentReactionPageSql,
            [
                `%${commentId}%`,
                `%${reactionPersonId}%`,
                `%${reactionContent}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateCommentReactionByUid(params) {
        let {
            uid, commentId, reactionPersonId, reactionContent, commentSource, sourceId,
            orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateCommentReactionByUidSql,
            [
                commentId, reactionPersonId, reactionContent, commentSource, sourceId, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteCommentReactionByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async (uid) => {
                        return await this.app.mysql.query(deleteCommentReactionByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountCommentReaction(params) {
        let {
            commentId, reactionPersonId, reactionContent, commentSource, sourceId, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountCommentReactionSql,
            [
                `%${commentId}%`,
                `%${reactionPersonId}%`,
                `%${reactionContent}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryCommentReactionAll() {
        return await this.app.mysql.query(queryCommentReactionAllSql, [])
    }


    /*
    获取每个评论，每种态度的点赞数量

    comment_id                          reaction_content       total
    e6821fe0-1a0c-11ec-baf3-f949af174dec	1	                2
    e6821fe0-1a0c-11ec-baf3-f949af174dec	2	                2
    e6821fe0-1a0c-11ec-baf3-f949af174dec	3	                2
    e6821fe0-1a0c-11ec-baf3-f949af174dec	4	                2
    e6821fe0-1a0c-11ec-baf3-f949af174dec	5	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	1	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	2	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	3	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	4	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	5	                2
    ee0c18f0-1a0d-11ec-baf3-f949af174dec	6	                1
    * */
    async queryReactionEveryContentCount(params) {
        let {
            commentSource, sourceId
        } = params

        return await this.app.mysql.query(queryReactionEveryContentCountSql, [
            `${commentSource}`,
            `%${sourceId}%`,
        ])
    }

    async queryReactionEveryContentPerson(params) {
        let {
            commentSource, sourceId
        } = params

        return await this.app.mysql.query(queryReactionEveryContentPersonSql, [
            `${commentSource}`,
            `%${sourceId}%`,
        ])
    }

}

module.exports = CommentReaction;
