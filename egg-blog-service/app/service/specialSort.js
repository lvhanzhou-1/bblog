const Service = require('egg').Service;

const {
    saveSpecialSortSql,
    deleteSpecialSortByUidSql,
    updateSpecialSortByUidSql,
    querySpecialSortPageSql,
    queryAllCountSpecialSortSql,
    querySpecialSortBySpecialSortNameSql,
    querySpecialSortByUidSql,
    querySpecialSortAllSql,
} = require('../sql/specialSort')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");

class SpecialSort extends Service {


    async querySpecialSortBySpecialSortName(specialSortName) {
        const resultArr = await this.app.mysql.query(querySpecialSortBySpecialSortNameSql, [specialSortName])
        return resultArr[0]
    }

    async querySpecialSortByUid(uid) {
        const resultArr = await this.app.mysql.query(querySpecialSortByUidSql, [uid])
        return resultArr[0]
    }

    async saveSpecialSort(params) {
        /**
         * 模式：$保存接口，参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        let {
            uid, specialSortName, orderNum, createTime,
            updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveSpecialSortSql,
            [
                uid, specialSortName, orderNum, createTime,
                updateTime
            ]
        )
        return true
    }

    async querySpecialSortPage(params) {
        /**
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        let {
            currentPage, pageSize,
            specialSortName, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            querySpecialSortPageSql,
            [
                `%${specialSortName}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateSpecialSortByUid(params) {
        /**
         * 模式：$更新接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        let {
            uid, specialSortName, orderNum, createTime,
            updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateSpecialSortByUidSql,
            [
                specialSortName, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteSpecialSortByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((async (uid) => {

                    let {special_sort_name} =await this.ctx.service.specialSort.querySpecialSortByUid(uid)
                    /*=========*/
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,

                        method: 'delete',
                        database_name: 't_special_sort',
                        item_name: `${special_sort_name}`,

                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })

                    return await this.app.mysql.query(deleteSpecialSortByUidSql, [uid])
                }
            )(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountSpecialSort(params) {
        let {
            specialSortName, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountSpecialSortSql,
            [
                `%${specialSortName}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async querySpecialSortAll() {
        return await this.app.mysql.query(querySpecialSortAllSql, [])
    }

}

module.exports = SpecialSort;
