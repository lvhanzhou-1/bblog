'use strict';

const Controller = require('egg').Controller;
const {
    saveFriendLinkValidator,
    deleteFriendLinkByUidValidator,
    updateFriendLinkByUidValidator,
    queryFriendLinkPageValidator,
} = require('../validation/friendLink')
const resCode = require('../constant/resCode')
const {SYSTEM, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')

class FriendLinkController extends Controller {

    async saveFriendLink() {
        const {ctx} = this
        /**
         * 这里把数据库表里的字段都声明出来
         * 除了 uid create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$保存接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         */
        let {
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        const {errorMsg, isValid} = saveFriendLinkValidator(
            linkName, linkAddress
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        linkName = linkName ? linkName : ''
        linkIntro = linkIntro ? linkIntro : ''
        linkAddress = linkAddress ? linkAddress : ''
        linkEmail = linkEmail ? linkEmail : ''
        isPublish = isPublish ? isPublish : 1
        orderNum = orderNum ? orderNum : 0


        // 补充参数
        const uid = generateUuid()
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        /**
         * 封装好处理过的参数
         *
         * 模式：$保存接口，封装处理过的参数$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰变量
         *
         */
        const params = {
            uid, linkName, linkIntro, linkAddress,
            linkEmail, isPublish, orderNum, createTime,
            updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            /**
             * 保存的时候需要校验 是否已经保存过
             * 定义默认根据数据库表中的第二个字段查询（第一个字段是Uid）
             *
             * 模式：$保存接口，根据第二个字段查询是否已经保存过$
             * 模式解析方式：提取出所有解析过的数据表字段，数组第二项的字段值，替换为为大驼峰格式字符串
             *
             */
            let result = await ctx.service.friendLink.queryFriendLinkByLinkName(linkName)

            if (result) { // 已存在，不保存
                /**
                 * 获取错误码所属的模块
                 *
                 * 模式：$保存接口，获取已存在错误码模块$
                 * 模式解析方式：从控制台中获得---通过正则解析出原文件resCodeVariable.js中的错误码模块名
                 *  （每次创建新模块时候，如果需要，提前创建好所需的错误码），
                 *    然后运行npm run add 执行创建代码脚本时，从控制台选择所涉及到的模块错误码，
                 *  替换为常量格式字符串
                 */
                ctx.fail(resCode.get(SYSTEM.SYSTEM_LINK_NAME_ALREADY_EXISTS))

            } else {
                let flag = await ctx.service.friendLink.saveFriendLink(params)
                if (flag) {
                    ctx.success()

                    /*保存 timeLine */
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_system_friend_link',
                        item_name:linkName,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })


                }
            }
        }
    }

    /**
     * 删除接口传入的参数是一个uid的数组
     * 数据库设计的时候，所有的主键规定都为uid，由服务端自行生成，
     * （除非中间表，不需要维护主键，选择id自增，由数据库自己维护）
     */
    async deleteFriendLinkByUid() {
        const {ctx} = this

        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteFriendLinkByUidValidator(ctx.request.body)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.friendLink.deleteFriendLinkByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async queryFriendLinkPage() {
        const {ctx} = this

        /**
         * 这里把数据库表里的字段都声明出来
         * 除了 uid create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$分页查询接口，参数接收$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，排除 uid，新增 currentPage, pageSize
         */
        let {
            currentPage, pageSize,
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
        const {errorMsg, isValid} = queryFriendLinkPageValidator(currentPage, pageSize)

        /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
        linkName = linkName ? linkName : ''
        linkIntro = linkIntro ? linkIntro : ''
        linkAddress = linkAddress ? linkAddress : ''
        linkEmail = linkEmail ? linkEmail : ''
        isPublish = isPublish ? isPublish : '%'
        orderNum = orderNum ? orderNum : '%'


        /**
         * 封装好处理过的参数
         *
         * 模式：$分页查询接口，封装处理过的参数$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，
         *
         */
        let params = {
            currentPage: +currentPage,
            pageSize: +pageSize,
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.friendLink.queryFriendLinkPage(params)
            let {total} = await ctx.service.friendLink.queryAllCountFriendLink(params)
            let newResult = {
                result,
                total,
                currentPage,
                pageSize,
            }
            ctx.success(newResult)
        }
    }

    async updateFriendLinkByUid() {
        const {ctx} = this

        /**
         * 这里把数据库表里的字段都声明出来
         * 除了 create_time update_time
         *
         * 这些都是可以从前台接收来的参数
         *
         * 模式：$更新接口，参数接收$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰格式字符串，排除 createTime,updateTime
         */

        let {
            uid, linkName, linkIntro, linkAddress,
            linkEmail, isPublish, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
        const {errorMsg, isValid} = updateFriendLinkByUidValidator(
            uid, linkName, linkAddress
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        linkName = linkName ? linkName : ''
        linkIntro = linkIntro ? linkIntro : ''
        linkAddress = linkAddress ? linkAddress : ''
        linkEmail = linkEmail ? linkEmail : ''
        isPublish = isPublish ? isPublish : 1
        orderNum = orderNum ? orderNum : 0


        // 补充参数
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        /**
         * 封装好处理过的参数
         *
         * 模式：$保存接口，封装处理过的参数$
         * 模式解析方式：提取出所有解析过的数据表字段，将连字符变量，替换为为小驼峰变量
         *
         */
        let params = {
            uid, linkName, linkIntro, linkAddress,
            linkEmail, isPublish, orderNum, updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            // 补充参数
            let {create_time} = await ctx.service.friendLink.queryFriendLinkByUid(uid)
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.friendLink.updateFriendLinkByUid(params)
            if (result) {
                ctx.success()

                /*保存 timeLine */
                await this.ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: this.ctx.request.header.username,
                    user_id: this.ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_system_friend_link',
                    item_name:linkName,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })

            }
        }

    }

    async queryFriendLinkAll() {
        const {ctx} = this

        let {
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        linkName = linkName ? linkName : ''
        linkIntro = linkIntro ? linkIntro : ''
        linkAddress = linkAddress ? linkAddress : ''
        linkEmail = linkEmail ? linkEmail : ''
        isPublish = isPublish ? isPublish : '%'
        orderNum = orderNum ? orderNum : '%'

        let params = {
            linkName, linkIntro, linkAddress, linkEmail,
            isPublish, orderNum
        }

        let result = await ctx.service.friendLink.queryFriendLinkAll(params)
        ctx.success(result)
    }


}

module.exports = FriendLinkController;
