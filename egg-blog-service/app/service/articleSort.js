const Service = require('egg').Service;

const {
    queryArticleSortBySortNameSql,
    queryArticleSortByUidSql,
    saveArticleSortSql,
    deleteArticleSortByUidSql,
    updateArticleSortByUidSql,
    queryArticleSortPageSql,
    queryArticleSortAllSql,
    queryAllCountArticleSortSql,
    queryArticleSortAllSql2,
    queryArticleSortAllSql3,

} = require('../sql/articleSort')

const dayjs = require('dayjs')
const generateUuid = require("../utils/generateUuid");

class ArticleSort extends Service {


    async queryArticleSortBySortName(sortName) {
        let resultArr = await this.app.mysql.query(queryArticleSortBySortNameSql, [sortName])
        return resultArr[0]
    }

    async queryArticleSortByUid(uid) {
        let resultArr = await this.app.mysql.query(queryArticleSortByUidSql, [uid])
        return resultArr[0]
    }

    async saveArticleSort(uid, sortName, intro, order) {
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        await this.app.mysql.query(saveArticleSortSql, [uid, sortName, intro, order, createTime, updateTime])
        return true
    }

    async queryArticleSortPage(currentPage, pageSize, sortName) {
        let _currentPage = (currentPage - 1) * pageSize
        return await this.app.mysql.query(queryArticleSortPageSql, [`%${sortName}%`, _currentPage, pageSize])
    }

    async updateArticleSortByUid(uid, sortName, intro, order) {

        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        await this.app.mysql.query(updateArticleSortByUidSql, [sortName, intro, order, updateTime, uid])

        return true
    }

    async deleteArticleSortByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async  (uid) =>{


                        let {sort_name} = await  this.ctx.service.articleSort.queryArticleSortByUid(uid)
                        /*=========*/
                        await this.ctx.service.timeLine.saveTimeLine({
                            uuid: generateUuid(),
                            user_name: this.ctx.request.header.username,
                            user_id: this.ctx.request.header.userid,
                            method: 'delete',
                            database_name: 't_blog_sort',
                            item_name: sort_name,
                            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        })


                        await this.app.mysql.query(deleteArticleSortByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountArticleSort() {
        let result = await this.app.mysql.query(queryAllCountArticleSortSql, [])
        return result[0]
    }

    async queryArticleSortAll() {
        return await this.app.mysql.query(queryArticleSortAllSql, [])
    }

    async queryArticleSortAll2(isXzzOrCheny) {
        // 排除私密文章
        if (isXzzOrCheny) {
            return await this.app.mysql.query(queryArticleSortAllSql2, [])
        } else {
            return await this.app.mysql.query(queryArticleSortAllSql3, [])
        }
    }


}

module.exports = ArticleSort;
