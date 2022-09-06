const Service = require('egg').Service;

const {
    saveBlogLikeSql,
    deleteBlogLikeByUidSql,
    updateBlogLikeByUidSql,
    queryBlogLikePageSql,
    queryAllCountBlogLikeSql,
    queryBlogLikeByBlogIdSql,
    queryBlogLikeByUidSql,
    queryBlogLikeAllSql,
    queryBlogLikeAll2Sql,
} = require('../sql/blogLike')

class BlogLike extends Service {
    async queryBlogLikeByBlogId(blogId) {
        const resultArr = await this.app.mysql.query(queryBlogLikeByBlogIdSql, [blogId])
        return resultArr[0]
    }

    async queryBlogLikeByUid(uid) {
        const resultArr = await this.app.mysql.query(queryBlogLikeByUidSql, [uid])
        return resultArr[0]
    }

    async saveBlogLike(params) {
        let {
            uid, blogId, likePersonId, orderNum,
            createTime, updateTime
        } = params
        await this.app.mysql.query(
            saveBlogLikeSql,
            [
                uid, blogId, likePersonId, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }

    async queryBlogLikePage(params) {

        let {
            currentPage, pageSize,
            blogId, likePersonId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize


        return await this.app.mysql.query(
            queryBlogLikePageSql,
            [
                `%${blogId}%`,
                `%${likePersonId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])

    }

    async queryBlogLikeAll2(params) {

        let {
            blogId, likePersonId, orderNum
        } = params

        return await this.app.mysql.query(
            queryBlogLikeAll2Sql,
            [
                `%${blogId}%`,
                `%${likePersonId}%`,
                `${orderNum}`,
            ])
    }


    async updateBlogLikeByUid(params) {

        let {
            uid, blogId, likePersonId, orderNum,
            createTime, updateTime
        } = params


        await this.app.mysql.query(
            updateBlogLikeByUidSql,
            [
                blogId, likePersonId, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteBlogLikeByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                    async  (uid)=> {
                        return await this.app.mysql.query(deleteBlogLikeByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountBlogLike(params) {
        /**
         * 模式：$查询接口，查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        let {
            blogId, likePersonId, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountBlogLikeSql,
            [
                `%${blogId}%`,
                `%${likePersonId}%`,
                `${orderNum}`
            ])
        return result[0]

    }

    async queryBlogLikeAll() {
        return await this.app.mysql.query(queryBlogLikeAllSql, [])
    }

}

module.exports = BlogLike;
