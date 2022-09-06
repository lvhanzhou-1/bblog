const Service = require('egg').Service;

const {
    saveSpecialPartSql,
    deleteSpecialPartByUidSql,
    updateSpecialPartByUidSql,
    querySpecialPartPageSql,
    queryAllCountSpecialPartSql,
    querySpecialPartByPartNameSql,
    querySpecialPartByUidSql,
    querySpecialPartAllSql,
} = require('../sql/specialPart')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");


class SpecialPart extends Service {


    async querySpecialPartByPartName(partName, specialId) {
        const resultArr = await this.app.mysql.query(querySpecialPartByPartNameSql, [partName, specialId])
        return resultArr[0]
    }

    async querySpecialPartByUid(uid) {
        const resultArr = await this.app.mysql.query(querySpecialPartByUidSql, [uid])
        return resultArr[0]
    }

    async saveSpecialPart(params) {
        let {
            uid, partName, partTitle, partSummary,
            specialId, orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveSpecialPartSql,
            [
                uid, partName, partTitle, partSummary,
                specialId, orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async querySpecialPartPage(params) {
        let {
            currentPage, pageSize,
            partName, partTitle, partSummary, specialId,
            orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            querySpecialPartPageSql,
            [
                `%${partName}%`,
                `%${partTitle}%`,
                `%${partSummary}%`,
                `%${specialId}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateSpecialPartByUid(params) {
        let {
            uid, partName, partTitle, partSummary,
            specialId, orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateSpecialPartByUidSql,
            [
                partName, partTitle, partSummary, specialId,
                orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteSpecialPartByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                    async (uid) => {

                        let {part_name,part_title} =await this.ctx.service.specialPart.querySpecialPartByUid(uid)
                        /*=========*/
                        await this.ctx.service.timeLine.saveTimeLine({
                            uuid: generateUuid(),
                            user_name: this.ctx.request.header.username,
                            user_id: this.ctx.request.header.userid,

                            method: 'delete',
                            database_name: 't_special_part',
                            item_name: `${part_name}-${part_title}`,

                            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        })



                        return await this.app.mysql.query(deleteSpecialPartByUidSql, [uid])
                    }
                )(uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountSpecialPart(params) {
        let {
            partName, partTitle, partSummary, specialId,
            orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountSpecialPartSql,
            [
                `%${partName}%`,
                `%${partTitle}%`,
                `%${partSummary}%`,
                `%${specialId}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async querySpecialPartAll() {
        return await this.app.mysql.query(querySpecialPartAllSql, [])
    }
}

module.exports = SpecialPart;
