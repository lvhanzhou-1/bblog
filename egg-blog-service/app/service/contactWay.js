const Service = require('egg').Service;

const {
    saveContactWaySql,
    deleteContactWayByUidSql,
    updateContactWayByUidSql,
    queryContactWayPageSql,
    queryAllCountContactWaySql,
    queryContactWayByContactWaySql,
    queryContactWayByUidSql,
    queryContactWayAllSql,
} = require('../sql/contactWay')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");

class ContactWay extends Service {

    async queryContactWayByContactWay(contactWay) {
        const resultArr = await this.app.mysql.query(queryContactWayByContactWaySql, [contactWay])
        return resultArr[0]
    }

    async queryContactWayByUid(uid) {
        const resultArr = await this.app.mysql.query(queryContactWayByUidSql, [uid])
        return resultArr[0]
    }

    async saveContactWay(params) {
        let {
            uid, contactWay, wayNum, wayIconName, iconColor, linkAddress,
            isShow, orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveContactWaySql,
            [
                uid, contactWay, wayNum, wayIconName, iconColor, linkAddress,
                isShow, orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async queryContactWayPage(params) {
        let {
            currentPage, pageSize,
            contactWay, wayNum, wayIconName, iconColor, linkAddress, isShow,
            orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryContactWayPageSql,
            [
                `%${contactWay}%`,
                `%${wayNum}%`,
                `%${wayIconName}%`,
                `%${iconColor}%`,
                `%${linkAddress}%`,
                `${isShow}`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateContactWayByUid(params) {
        let {
            uid, contactWay, wayNum, wayIconName, iconColor, linkAddress,
            isShow, orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateContactWayByUidSql,
            [
                contactWay, wayNum, wayIconName, iconColor, linkAddress, isShow,
                orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteContactWayByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                async (uid) => {

                    let {contact_way} =await this.ctx.service.contactWay.queryContactWayByUid(uid)
                    /*=========*/
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,
                        method: 'delete',
                        database_name: 't_system_contact_way',
                        item_name: contact_way,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })


                    return await this.app.mysql.query(deleteContactWayByUidSql, [uid])
                }
            )(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountContactWay(params) {
        let {
            contactWay, wayNum, wayIconName, iconColor, linkAddress, isShow,
            orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountContactWaySql,
            [
                `%${contactWay}%`,
                `%${wayNum}%`,
                `%${wayIconName}%`,
                `%${iconColor}%`,
                `%${linkAddress}%`,
                `${isShow}`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryContactWayAll(params) {
        let {
            contactWay, wayNum, wayIconName, iconColor, linkAddress, isShow,
            orderNum
        } = params

        return await this.app.mysql.query(queryContactWayAllSql, [
            `%${contactWay}%`,
            `%${wayNum}%`,
            `%${wayIconName}%`,
            `%${iconColor}%`,
            `%${linkAddress}%`,
            `${isShow}`,
            `${orderNum}`,
        ])
    }


}

module.exports = ContactWay;
