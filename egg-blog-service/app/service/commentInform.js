const Service = require('egg').Service;
const {
    saveCommentInformSql,
    deleteCommentInformByUidSql,
    updateCommentInformByUidSql,
    queryCommentInformPageSql,
    queryAllCountCommentInformSql,
    queryCommentInformByInformTypeSql,
    queryCommentInformByUidSql,
    queryCommentInformAllSql,
} = require('../sql/commentInform')

class CommentInform extends Service {

    async queryCommentInformByInformType(informType) {
        const resultArr = await this.app.mysql.query(queryCommentInformByInformTypeSql, [informType])
        return resultArr[0]
    }

    async queryCommentInformByUid(uid) {
        const resultArr = await this.app.mysql.query(queryCommentInformByUidSql, [uid])
        return resultArr[0]
    }

    async saveCommentInform(params) {
        let {
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveCommentInformSql,
            [
                uid, informType, informReason, informPersonId,
                informCommentId, commentSource, sourceId, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }

    async queryCommentInformPage(params) {
        let {
            currentPage, pageSize,
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryCommentInformPageSql,
            [
                `${informType}`,
                `%${informReason}%`,
                `%${informPersonId}%`,
                `%${informCommentId}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateCommentInformByUid(params) {
        let {
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateCommentInformByUidSql,
            [
                informType, informReason, informPersonId, informCommentId,
                commentSource, sourceId, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteCommentInformByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                async (uid) => {
                    return await this.app.mysql.query(deleteCommentInformByUidSql, [uid])
                }
            )(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountCommentInform(params) {
        let {
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountCommentInformSql,
            [
                `${informType}`,
                `%${informReason}%`,
                `%${informPersonId}%`,
                `%${informCommentId}%`,
                `${commentSource}`,
                `%${sourceId}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryCommentInformAll() {
        return await this.app.mysql.query(queryCommentInformAllSql, [])
    }

}

module.exports = CommentInform;
