const Service = require('egg').Service;

const dayjs = require('dayjs')
const {
    saveSpecialSql,
    deleteSpecialByUidSql,
    updateSpecialByUidSql,
    querySpecialPageSql,
    queryAllCountSpecialSql,
    querySpecialBySpecialNameSql,
    querySpecialByUidSql,
    querySpecialAllSql,
    querySpecialAllSql2,
} = require('../sql/special')
const generateUuid = require("../utils/generateUuid");


class Special extends Service {


    async querySpecialBySpecialName(specialName) {
        const resultArr = await this.app.mysql.query(querySpecialBySpecialNameSql, [specialName])
        return resultArr[0]
    }

    async querySpecialByUid(uid) {
        const resultArr = await this.app.mysql.query(querySpecialByUidSql, [uid])
        return resultArr[0]
    }

    async saveSpecial(params) {
        let {
            uid, specialName, specialSummary, coverUrl,
            specialSortId, clicks, isPrivate, orderNum, createTime,
            updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveSpecialSql,
            [
                uid, specialName, specialSummary, coverUrl,
                specialSortId, clicks, isPrivate, orderNum, createTime,
                updateTime
            ]
        )
        return true
    }

    async querySpecialPage(params) {
        let {
            currentPage, pageSize,
            specialName, specialSummary, specialSortId, clicks, isPrivate,
            orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            querySpecialPageSql,
            [
                `%${specialName}%`,
                `%${specialSummary}%`,
                `%${specialSortId}%`,
                `${clicks}`,
                `${isPrivate}`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateSpecialByUid(params) {
        let {
            uid, specialName, specialSummary, coverUrl,
            specialSortId, clicks, isPrivate, orderNum, createTime,
            updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateSpecialByUidSql,
            [
                specialName, specialSummary, coverUrl, specialSortId,
                clicks, isPrivate, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteSpecialByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                    async (uid) => {
                        let {special_name} =await this.ctx.service.special.querySpecialByUid(uid)
                        /*=========*/
                        await this.ctx.service.timeLine.saveTimeLine({
                            uuid: generateUuid(),
                            user_name: this.ctx.request.header.username,
                            user_id: this.ctx.request.header.userid,

                            method: 'delete',
                            database_name: 't_special',
                            item_name: special_name,

                            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        })


                        return await this.app.mysql.query(deleteSpecialByUidSql, [uid])
                    }
                )(uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountSpecial(params) {
        let {
            specialName, specialSummary, specialSortId, clicks, isPrivate,
            orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountSpecialSql,
            [
                `%${specialName}%`,
                `%${specialSummary}%`,
                `%${specialSortId}%`,
                `${clicks}`,
                `${isPrivate}`,
                `${orderNum}`
            ])
        return result[0]
    }

    async querySpecialAll(isXzzOrCheny) {
        // 排除私密专题
        if (isXzzOrCheny) {
            return await this.app.mysql.query(querySpecialAllSql, [])
        } else {
            return await this.app.mysql.query(querySpecialAllSql2, [])
        }
    }

}

module.exports = Special;
