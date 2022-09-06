const Service = require('egg').Service;

const {
    saveWebUserSql,
    deleteWebUserByUidSql,
    updateWebUserByUidSql,
    queryWebUserPageSql,
    queryWebUserSql,
    queryAllCountWebUserSql,
    queryWebUserByUserTelSql,
    queryWebUserByUidSql,
    queryWebUserAllSql,
    queryUserByEmailSql,
    saveWebUserSql2
} = require('../sql/webUser')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");


class WebUser extends Service {
    async webUserRegister(params) {
        let {
            uid, userName, password, userProfile,
            nickName, userIntro, userProfession, roleId, gender, loginIpAddress,
            lastLoginTime, orderNum, createTime, updateTime, userEmail
        } = params
        await this.app.mysql.query(
            saveWebUserSql2,
            [
                uid, userName, password, userProfile,
                nickName, userIntro, userProfession, userEmail, roleId, gender, loginIpAddress,
                lastLoginTime, orderNum, createTime, updateTime
            ]
        )
        return true
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

    async queryUserByEmail(username_email) {

        let resultArr = await this.app.mysql.query(queryUserByEmailSql, [username_email])
        return resultArr[0]
    }

    /**
     * 根据第一个参数查询
     *
     * 模式：$查询接口 根据第二个参数查询$
     * 替换方式：获取第二个参数，转换为大驼峰的格式
     */
    async queryWebUserByUserTel(userTel) {
        const resultArr = await this.app.mysql.query(queryWebUserByUserTelSql, [userTel])
        return resultArr[0]
    }

    async queryWebUserByUid(uid) {
        const resultArr = await this.app.mysql.query(queryWebUserByUidSql, [uid])
        return resultArr[0]
    }

    async saveWebUser(params) {
        let {
            uid, userTel, userProfile, userWechat, userMicroblog,
            userGitee, userGithub, userQq, userEmail,
            userPassword, nickName, userPosition, userCompany,
            userWebsite, userIntro, gender, userIdentity, loginIpAddress,
            lastLoginTime, accountStatus, dataAuditStatus, accountSource,
            orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$保存接口，sql参数接收$
         * 替换方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串
         */
        await this.app.mysql.query(
            saveWebUserSql,
            [
                uid, userTel, userProfile, userWechat, userMicroblog,
                userGitee, userGithub, userQq, userEmail,
                userPassword, nickName, userPosition, userCompany,
                userWebsite, userIntro, gender, userIdentity, loginIpAddress,
                lastLoginTime, accountStatus, dataAuditStatus, accountSource,
                orderNum, createTime, updateTime
            ]
        )
        return true
    }

    async queryWebUserPage(params) {
        let {
            currentPage, pageSize,
            userTel, userProfile, userWechat, userMicroblog, userGitee,
            userGithub, userQq, userEmail, userPassword,
            nickName, userPosition, userCompany, userWebsite,
            userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
            accountStatus, dataAuditStatus, accountSource, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryWebUserPageSql,
            [
                `%${userTel}%`,
                `%${userProfile}%`,
                `%${userWechat}%`,
                `%${userMicroblog}%`,
                `%${userGitee}%`,
                `%${userGithub}%`,
                `%${userQq}%`,
                `%${userEmail}%`,
                `%${userPassword}%`,
                `%${nickName}%`,
                `%${userPosition}%`,
                `%${userCompany}%`,
                `%${userWebsite}%`,
                `%${userIntro}%`,
                `${gender}`,
                `${userIdentity}`,
                `%${loginIpAddress}%`,
                `%${lastLoginTime}%`,
                `${accountStatus}`,
                `${dataAuditStatus}`,
                `%${accountSource}%`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async queryWebUser(params) {
        let {
            userTel, userProfile, userWechat, userMicroblog, userGitee,
            userGithub, userQq, userEmail, userPassword,
            nickName, userPosition, userCompany, userWebsite,
            userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
            accountStatus, dataAuditStatus, accountSource, orderNum
        } = params


        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryWebUserSql,
            [
                `%${userTel}%`,
                `%${userProfile}%`,
                `%${userWechat}%`,
                `%${userMicroblog}%`,
                `%${userGitee}%`,
                `%${userGithub}%`,
                `%${userQq}%`,
                `%${userEmail}%`,
                `%${userPassword}%`,
                `%${nickName}%`,
                `%${userPosition}%`,
                `%${userCompany}%`,
                `%${userWebsite}%`,
                `%${userIntro}%`,
                `${gender}`,
                `${userIdentity}`,
                `%${loginIpAddress}%`,
                `%${lastLoginTime}%`,
                `${accountStatus}`,
                `${dataAuditStatus}`,
                `%${accountSource}%`,
                `${orderNum}`,
            ])
    }


    async updateWebUserByUid(params) {
        let {
            uid, userTel, userProfile, userWechat, userMicroblog,
            userGitee, userGithub, userQq, userEmail,
            userPassword, nickName, userPosition, userCompany,
            userWebsite, userIntro, gender, userIdentity, loginIpAddress,
            lastLoginTime, accountStatus, dataAuditStatus, accountSource,
            orderNum, createTime, updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateWebUserByUidSql,
            [
                userTel, userProfile, userWechat, userMicroblog, userGitee,
                userGithub, userQq, userEmail, userPassword,
                nickName, userPosition, userCompany, userWebsite,
                userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
                accountStatus, dataAuditStatus, accountSource, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteWebUserByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((async (uid) => {

                let {nick_name} = await this.ctx.service.webUser.queryWebUserByUid(uid)
                /*=========*/
                await this.ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: this.ctx.request.header.username,
                    user_id: this.ctx.request.header.userid,

                    method: 'delete',
                    database_name: 't_web_user',
                    item_name: `${nick_name}`,

                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


                return await this.app.mysql.query(deleteWebUserByUidSql, [uid])
            })(uid))
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountWebUser(params) {
        let {
            userTel, userWechat, userMicroblog, userGitee,
            userGithub, userQq, userEmail, userPassword,
            nickName, userPosition, userCompany, userWebsite,
            userIntro, gender, userIdentity, loginIpAddress, lastLoginTime,
            accountStatus, dataAuditStatus, accountSource, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountWebUserSql,
            [
                `%${userTel}%`,
                `%${userWechat}%`,
                `%${userMicroblog}%`,
                `%${userGitee}%`,
                `%${userGithub}%`,
                `%${userQq}%`,
                `%${userEmail}%`,
                `%${userPassword}%`,
                `%${nickName}%`,
                `%${userPosition}%`,
                `%${userCompany}%`,
                `%${userWebsite}%`,
                `%${userIntro}%`,
                `${gender}`,
                `${userIdentity}`,
                `%${loginIpAddress}%`,
                `%${lastLoginTime}%`,
                `${accountStatus}`,
                `${dataAuditStatus}`,
                `%${accountSource}%`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryWebUserAll() {
        return await this.app.mysql.query(queryWebUserAllSql, [])
    }

}

module.exports = WebUser;
