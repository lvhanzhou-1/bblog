const Service = require('egg').Service;
const {
    saveArticleTagSql,
    deleteArticleTagByUidSql,
    updateArticleTagByUidSql,
    queryArticleTagPageSql,
    queryArticleTagByTagNameSql,
    queryArticleTagByUidSql,
    queryAllCountArticleTagSql,
    queryArticleTagAllSql,
    queryHotArticleTagPageSql,
    queryArticleTagAllSql2,
    queryArticleTagAllSql3,
} = require('../sql/articleTag')
const dayjs = require('dayjs')
const generateUuid = require("../utils/generateUuid");


class ArticleTag extends Service {

    async saveArticleTag(uid, tagName, order) {
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        await this.app.mysql.query(saveArticleTagSql, [uid, tagName, order, createTime, updateTime])
        return true
    }

    async deleteArticleTagByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async  (uid)=> {


                        let {tag_name} = await  this.ctx.service.articleTag.queryArticleTagByUid(uid)
                        /*=========*/
                        await this.ctx.service.timeLine.saveTimeLine({
                            uuid: generateUuid(),
                            user_name: this.ctx.request.header.username,
                            user_id: this.ctx.request.header.userid,
                            method: 'delete',
                            database_name: 't_blog_tag',
                            item_name: tag_name,
                            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        })


                        await this.app.mysql.query(deleteArticleTagByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async updateArticleTagByUid(uid, tagName, order) {
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        await this.app.mysql.query(updateArticleTagByUidSql, [tagName, order, updateTime, uid])
        return true
    }

    async queryArticleTagByTagName(tagName) {
        let resultArr = await this.app.mysql.query(queryArticleTagByTagNameSql, [tagName])
        return resultArr[0]
    }

    async queryArticleTagByUid(uid) {
        let resultArr = await this.app.mysql.query(queryArticleTagByUidSql, [uid])
        return resultArr[0]
    }

    async queryArticleTagPage(currentPage, pageSize, tagName) {
        let _currentPage = (currentPage - 1) * pageSize
        return await this.app.mysql.query(queryArticleTagPageSql, [`%${tagName}%`, _currentPage, pageSize])

    }

    async queryHotArticleTagPage(params) {
        let {
            currentPage, pageSize,
            tagName,clicks,orderNum
        }  = params

        let _currentPage = (currentPage - 1) * pageSize

        return await this.app.mysql.query(queryHotArticleTagPageSql, [
            `%${tagName}%`,
            `${clicks}`,
            `${orderNum}`,
            _currentPage,
            pageSize
        ])
    }

    async queryAllCountArticleTag() {
        let result = await this.app.mysql.query(queryAllCountArticleTagSql, [])
        return result[0]
    }

    async queryArticleTagAll() {
        return await this.app.mysql.query(queryArticleTagAllSql, [])
    }

    async queryArticleTagAll2(isXzzOrCheny) {
        // 排除私密文章
        console.log(isXzzOrCheny, 'isXzzOrCheny')
        if(isXzzOrCheny){
            return await this.app.mysql.query(queryArticleTagAllSql2, [])
        } else {
            return await this.app.mysql.query(queryArticleTagAllSql3, [])
        }
    }

}

module.exports = ArticleTag;
