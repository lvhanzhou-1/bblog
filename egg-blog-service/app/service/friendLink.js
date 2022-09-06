const Service = require('egg').Service;


const {
    saveFriendLinkSql,
    deleteFriendLinkByUidSql,
    updateFriendLinkByUidSql,
    queryFriendLinkPageSql,
    queryAllCountFriendLinkSql,
    queryFriendLinkByLinkNameSql,
    queryFriendLinkByUidSql,
    queryFriendLinkAllSql,
} = require('../sql/friendLink')
const generateUuid = require("../utils/generateUuid");
const dayjs = require("dayjs");

class FriendLink extends Service {

    async queryFriendLinkByLinkName(linkName) {
        const resultArr = await this.app.mysql.query(queryFriendLinkByLinkNameSql, [linkName])
        return resultArr[0]
    }

    async queryFriendLinkByUid(uid) {
        const resultArr = await this.app.mysql.query(queryFriendLinkByUidSql, [uid])
        return resultArr[0]
    }

    async saveFriendLink(params) {
        let {
            uid, linkName, linkIntro, linkAddress,
            linkEmail, isPublish, orderNum, createTime,
            updateTime
        } = params

        await this.app.mysql.query(
            saveFriendLinkSql,
            [
                uid, linkName, linkIntro, linkAddress,
                linkEmail, isPublish, orderNum, createTime,
                updateTime
            ]
        )
        return true
    }

    async queryFriendLinkPage(params) {
        let {
            currentPage, pageSize,
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        /**
         * 模式：$分页查询接口，sql参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        return await this.app.mysql.query(
            queryFriendLinkPageSql,
            [
                `%${linkName}%`,
                `%${linkIntro}%`,
                `%${linkAddress}%`,
                `%${linkEmail}%`,
                `${isPublish}`,
                `${orderNum}`,
                _currentPage,
                pageSize
            ])
    }

    async updateFriendLinkByUid(params) {
        let {
            uid, linkName, linkIntro, linkAddress,
            linkEmail, isPublish, orderNum, createTime,
            updateTime
        } = params

        /**
         * 模式：$更新接口，sql参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid createTime,updateTime
         */
        await this.app.mysql.query(
            updateFriendLinkByUidSql,
            [
                linkName, linkIntro, linkAddress, linkEmail,
                isPublish, orderNum,
                createTime, updateTime, uid
            ]
        )
        return true
    }

    async deleteFriendLinkByUid(uids) {
        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push(
                (
                    async (uid) => {

                        let {link_name} =await this.ctx.service.friendLink.queryFriendLinkByUid(uid)
                        /*=========*/
                        await this.ctx.service.timeLine.saveTimeLine({
                            uuid: generateUuid(),
                            user_name: this.ctx.request.header.username,
                            user_id: this.ctx.request.header.userid,

                            method: 'delete',
                            database_name: 't_system_friend_link',
                            item_name: link_name,

                            create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        })


                        return await this.app.mysql.query(deleteFriendLinkByUidSql, [uid])
                    }
                )
                (uid)
            )
        }
        return await Promise.all(promiseArr)
    }

    async queryAllCountFriendLink(params) {
        let {
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = params

        /**
         * 模式：$查询接口，sql查询总条数参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid
         */
        const result = await this.app.mysql.query(
            queryAllCountFriendLinkSql,
            [
                `%${linkName}%`,
                `%${linkIntro}%`,
                `%${linkAddress}%`,
                `%${linkEmail}%`,
                `${isPublish}`,
                `${orderNum}`
            ])
        return result[0]
    }

    async queryFriendLinkAll(params) {
        let {
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = params

        return await this.app.mysql.query(queryFriendLinkAllSql, [
            `%${linkName}%`,
            `%${linkIntro}%`,
            `%${linkAddress}%`,
            `%${linkEmail}%`,
            `${isPublish}`,
            `${orderNum}`,
        ])
    }
}

module.exports = FriendLink;
