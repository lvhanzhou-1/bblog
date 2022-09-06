const Service = require('egg').Service;

const {
    saveAboutMeSql,
    deleteAboutMeByUidSql,
    updateAboutMeByUidSql,
    queryAboutMePageSql,
    queryAllCountAboutMeSql,
    queryAboutMeByAdminUserIdSql,
    queryAboutMeByUidSql,
    queryAboutMeAllSql,
} = require('../sql/aboutMe')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");

class AboutMe extends Service {

    async queryAboutMeByAdminUserId(adminUserId) {
        const resultArr = await this.app.mysql.query(queryAboutMeByAdminUserIdSql, [adminUserId])
        return resultArr[0]
    }

    async queryAboutMeByUid(uid) {
        const resultArr = await this.app.mysql.query(queryAboutMeByUidSql, [uid])
        return resultArr[0]
    }


    async saveAboutMe(params) {
        let {
            uid, adminUserId, introDetail, orderNum,
            createTime, updateTime
        } = params

        await this.app.mysql.query(
            saveAboutMeSql,
            [
                uid, adminUserId, introDetail, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }


    async queryAboutMePage(params) {
        let {
            currentPage, pageSize,
            adminUserId, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize


        return await this.app.mysql.query(
            queryAboutMePageSql,
            [
                `%${adminUserId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }


    async updateAboutMeByUid(params) {

        let {
            uid, adminUserId, introDetail, orderNum,
            createTime, updateTime
        } = params


        await this.app.mysql.query(
            updateAboutMeByUidSql,
            [
                adminUserId, introDetail, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }


    async deleteAboutMeByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (async (uid) => {

                    /*保存 timeLine */
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,
                        method: 'delete',
                        database_name: 't_system_about_me',
                        item_name: 'nothing',
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })


                    return await this.app.mysql.query(deleteAboutMeByUidSql, [uid])
                })(uid)
            )
        }
        return await Promise.all(promiseArr)
    }


    async queryAllCountAboutMe(params) {

        let {
            adminUserId, orderNum
        } = params

        const result = await this.app.mysql.query(
            queryAllCountAboutMeSql,
            [
                `%${adminUserId}%`,
                `${orderNum}`
            ])
        return result[0]
    }


    async queryAboutMeAll() {
        return await this.app.mysql.query(queryAboutMeAllSql, [])
    }
}

module.exports = AboutMe;
