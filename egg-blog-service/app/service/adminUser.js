const Service = require('egg').Service;

const {
    saveAdminUserSql,
    deleteAdminUserByUidSql,
    updateAdminUserByUidSql,
    queryAdminUserPageSql,
    queryAllCountAdminUserSql,
    queryAdminUserByUserNameSql,
    queryAdminUserByUidSql,
    queryAdminUserAllSql,
    queryUserByUsernameSql,
    adminResetPasswordByUidSql,
} = require('../sql/adminUser')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");


class AdminUser extends Service {

    async queryAdminUserByUserName(userName) {

        const resultArr = await this.app.mysql.query(queryAdminUserByUserNameSql, [userName])
        return resultArr[0]
    }

    async queryAdminUserByUid(uid) {


        const resultArr = await this.app.mysql.query(queryAdminUserByUidSql, [uid])
        console.log(resultArr);
        return resultArr[0]
    }

    async saveAdminUser(params) {

        /**
         * 模式：$保存接口，参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        let {
            uid, userName, userPassword, userProfile,
            nickName, userIntro, userProfession, roleId, gender, loginIpAddress,
            lastLoginTime, orderNum, createTime, updateTime, userEmail
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveAdminUserSql,
            [
                uid, userName, userPassword, userProfile,
                nickName, userIntro, userProfession, userEmail, roleId, gender, loginIpAddress,
                lastLoginTime, orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async queryAdminUserPage(params) {


        let {
            currentPage, pageSize,
            userName, userPassword, nickName, roleId,
            gender, loginIpAddress, lastLoginTime, orderNum, userEmail
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryAdminUserPageSql,
            [
                `%${userName}%`,
                `%${userPassword}%`,
                `%${nickName}%`,
                `%${userEmail}%`,
                `%${roleId}%`,
                `${gender}`,
                `%${loginIpAddress}%`,
                `%${lastLoginTime}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateAdminUserByUid(params) {


        /**
         * 模式：$更新接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        let {
            uid, userName, userProfile,
            nickName, userIntro, userProfession, roleId, gender, loginIpAddress,
            lastLoginTime, orderNum, createTime, updateTime, userEmail
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateAdminUserByUidSql,
            [
                userName, userProfile, nickName, userIntro, userProfession, userEmail,
                roleId, gender, loginIpAddress, lastLoginTime,
                orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteAdminUserByUid(uids) {

        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((async (uid) => {


                /*保存 timeLine */
                let {user_name} = await this.ctx.service.adminUser.queryAdminUserByUid(uid)

                await this.ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: this.ctx.request.header.username,
                    user_id: this.ctx.request.header.userid,
                    method: 'delete',
                    database_name: 't_admin_user',
                    item_name: user_name,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


                return await this.app.mysql.query(deleteAdminUserByUidSql, [uid])
            })(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountAdminUser(params) {

        let {
            userName, userPassword, nickName, roleId, userEmail,
            gender, loginIpAddress, lastLoginTime, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountAdminUserSql,
            [
                `%${userName}%`,
                `%${userPassword}%`,
                `%${nickName}%`,
                `%${userEmail}%`,
                `%${roleId}%`,
                `${gender}`,
                `%${loginIpAddress}%`,
                `%${lastLoginTime}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryAdminUserAll() {

        return await this.app.mysql.query(queryAdminUserAllSql, [])
    }

    async queryUserByUsername(username) {

        let resultArr = await this.app.mysql.query(queryUserByUsernameSql, [username])
        return resultArr[0]
    }

    /**
     * @description 生成 jwt token
     * @param {Object} data 数据库查到的用户信息
     * @param {Number} expires 单位时秒
     * @param {String} identity 区分后台管理员登录还是前台用户登录 'adminUser'|'webUser'
     * @return {String} 生成的token
     */
    async generateToken(data, expires, identity) {


        // identity:'adminUser'|'webUser'
        // 用来区分后台管理员登录还是前台用户登录
        // console.info("🚀 ~ file:adminUser method:generateToken line:201 -----",data)
        /*根据role——id查询一下角色*/
        let payload
        if(identity === 'adminUser'){
             payload = {
                uid: data.uid,

                user_name: data.user_name,

                user_email: data.user_email,
                user_profile: data.user_profile,
                role_name:data.role_name,
                identity
            }
        }else if(identity === 'webUser'){
            payload = {
                uid: data.uid,

                nick_name: data.nick_name,

                user_email: data.user_email,
                user_profile: data.user_profile,
                role_name:data.role_name,
                identity,
            }
        }



        // expiresIn 单位是 秒 3600s 就是1小时
        // let token = jwt.sign(payload, keys, {expiresIn: expires})
        let token = this.app.jwt.sign(
            payload,
            this.app.config.jwt.secret,
            {expiresIn: expires}
        )

        return `Bearer ${token}`
    }

    async adminResetPasswordByUid(password, uid) {

        return await this.app.mysql.query(adminResetPasswordByUidSql, [password, uid])

    }
}

module.exports = AdminUser;
