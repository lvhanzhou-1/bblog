const Service = require('egg').Service;
const {
    saveFileSortSql,
    deleteFileSortByUidSql,
    updateFileSortByUidSql,
    queryFileSortPageSql,
    queryFileSortBySortNameSql,
    queryAllCountFileSortSql,
    queryFileSortBySortIdSql,
} = require('../sql/fileSort')
const dayjs = require('dayjs')
const generateUuid = require("../utils/generateUuid");


class FileSort extends Service {

    async queryFileSortBySortName(sortName) {
        let resultArr = await this.app.mysql.query(queryFileSortBySortNameSql, [sortName])
        return resultArr[0]
    }
    async queryFileSortByUid(Uid) {
        let resultArr = await this.app.mysql.query(queryFileSortBySortIdSql, [Uid])
        return resultArr[0]
    }


    async saveFileSort(uid, coverImg, sortName, order) {

        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        await this.app.mysql.query(saveFileSortSql, [uid, coverImg, sortName, order, createTime, updateTime])
        return true
    }

    async queryFileSortPage(currentPage, pageSize, sortName) {
        let _currentPage = (currentPage - 1) * pageSize
        return await this.app.mysql.query(queryFileSortPageSql, [`%${sortName}%`, _currentPage, pageSize])

    }

    async updateFileSortByUid(uid, coverImg, sortName, order) {
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        await this.app.mysql.query(updateFileSortByUidSql, [coverImg, sortName, order, updateTime, uid])

        return true
    }

    async deleteFileSortByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                async (uid) => {

                    let {sort_name} =await this.ctx.service.fileSort.queryFileSortByUid(uid)
                    /*=========*/
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,

                        method: 'delete',
                        database_name: 't_file_sort',
                        item_name: sort_name,

                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })


                    await this.app.mysql.query(deleteFileSortByUidSql, [uid])
                }
            )(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountFileSort() {
        let result = await this.app.mysql.query(queryAllCountFileSortSql, [])
        return result[0]
    }
}

module.exports = FileSort;
