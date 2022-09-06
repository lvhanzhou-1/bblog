const Service = require('egg').Service;

const {
    saveAdminRoleSql,
    deleteAdminRoleByUidSql,
    updateAdminRoleByUidSql,
    queryAdminRolePageSql,
    queryAllCountAdminRoleSql,
    queryAdminRoleByRoleNameSql,
    queryAdminRoleByUidSql,
    queryAdminRoleAllSql,
} = require('../sql/adminRole')

class AdminRole extends Service {

    async queryAdminRoleByRoleName(roleName) {
        const resultArr = await this.app.mysql.query(queryAdminRoleByRoleNameSql, [roleName])
        return resultArr[0]
    }

    async queryAdminRoleByUid(uid) {
        const resultArr = await this.app.mysql.query(queryAdminRoleByUidSql, [uid])
        return resultArr[0]
    }

    async saveAdminRole(params) {
        /**
         * 模式：$保存接口，参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        let {
            uid, roleName, roleIntro, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveAdminRoleSql,
            [
                uid, roleName, roleIntro, orderNum,
                createTime, updateTime
            ]
        )
        return true
    }

    async queryAdminRolePage(params) {
        /**
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        let {
            currentPage, pageSize,
            roleName, roleIntro, orderNum
        }  = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryAdminRolePageSql,
            [
                `%${roleName}%`,
                `%${roleIntro}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateAdminRoleByUid(params) {
        /**
         * 模式：$更新接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        let {
            uid, roleName, roleIntro, orderNum,
            createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateAdminRoleByUidSql,
            [
                roleName, roleIntro, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteAdminRoleByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (async (uid)=>{
                    return await this.app.mysql.query(deleteAdminRoleByUidSql, [uid])
                })(uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountAdminRole(params) {
        /**
         * 模式：$查询接口，查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        let {
            roleName, roleIntro, orderNum
        }  = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountAdminRoleSql,
            [
                `%${roleName}%`,
                `%${roleIntro}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryAdminRoleAll() {
        return await this.app.mysql.query(queryAdminRoleAllSql, [])
    }
}

module.exports = AdminRole;
