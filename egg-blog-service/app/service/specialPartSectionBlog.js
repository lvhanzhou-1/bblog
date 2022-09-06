const Service = require('egg').Service;

const {
    saveSpecialPartSectionBlogSql,
    deleteSpecialPartSectionBlogByUidSql,
    updateSpecialPartSectionBlogByUidSql,
    querySpecialPartSectionBlogPageSql,
    queryAllCountSpecialPartSectionBlogSql,
    querySpecialPartSectionBlogByPartSectionIdSql,
    querySpecialPartSectionBlogByUidSql,
    querySpecialPartSectionBlogAllSql,
    querySpecialPartSectionBlogAllSql2,
} = require('../sql/specialPartSectionBlog')

class SpecialPartSectionBlog extends Service {


    /**
     * 根据第一个参数查询
     *
     * 模式：$查询接口 根据第二个参数查询$
     * 替换方式：获取第二个参数，转换为大驼峰的格式
     */
    async querySpecialPartSectionBlogByPartSectionId(partSectionId, blogId) {
        const resultArr = await this.app.mysql.query(querySpecialPartSectionBlogByPartSectionIdSql, [partSectionId, blogId])
        return resultArr[0]
    }

    async querySpecialPartSectionBlogByUid(uid) {
        const resultArr = await this.app.mysql.query(querySpecialPartSectionBlogByUidSql, [uid])
        return resultArr[0]
    }

    async saveSpecialPartSectionBlog(params) {
        let {
            uid, partSectionId, blogId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveSpecialPartSectionBlogSql,
            [
                uid, partSectionId, blogId, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }

    async querySpecialPartSectionBlogPage(params) {
        let {
            currentPage, pageSize,
            partSectionId, blogId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            querySpecialPartSectionBlogPageSql,
            [
                `%${partSectionId}%`,
                `%${blogId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateSpecialPartSectionBlogByUid(params) {
        let {
            uid, partSectionId, blogId, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateSpecialPartSectionBlogByUidSql,
            [
                partSectionId, blogId, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteSpecialPartSectionBlogByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((async (uid) => {
                return await this.app.mysql.query(deleteSpecialPartSectionBlogByUidSql, [uid])
            })(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountSpecialPartSectionBlog(params) {
        let {
            partSectionId, blogId, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountSpecialPartSectionBlogSql,
            [
                `%${partSectionId}%`,
                `%${blogId}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async querySpecialPartSectionBlogAll(isXzzOrCheny) {
        // 排除私密文章
        if (isXzzOrCheny) {
            return await this.app.mysql.query(querySpecialPartSectionBlogAllSql, [])
        } else {
            return await this.app.mysql.query(querySpecialPartSectionBlogAllSql2, [])
        }
    }
}

module.exports = SpecialPartSectionBlog;
