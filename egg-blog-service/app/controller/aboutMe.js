'use strict';

const Controller = require('egg').Controller;

const {
    saveAboutMeValidator,
    deleteAboutMeByUidValidator,
    updateAboutMeByUidValidator,
    queryAboutMePageValidator,
} = require('../validation/aboutMe')

const resCode = require('../constant/resCode')
const {SYSTEM, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')


class AboutMeController extends Controller {

    async saveAboutMe() {
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
            adminUserId, introDetail, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        const {errorMsg, isValid} = saveAboutMeValidator(
            adminUserId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        adminUserId = adminUserId ? adminUserId : ''
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
            uid, adminUserId, introDetail, orderNum,
            createTime, updateTime
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
            let result = await ctx.service.aboutMe.queryAboutMeByAdminUserId(adminUserId)

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
                ctx.fail(resCode.get(SYSTEM.SYSTEM_ADMIN_USER_ID_ALREADY_EXISTS))

            } else {
                let flag = await ctx.service.aboutMe.saveAboutMe(params)
                if (flag) {
                    ctx.success()

                    await ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: ctx.request.header.username,
                        user_id: ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_system_about_me',
                        item_name: 'nothing',
                        create_time: createTime,
                        update_time: updateTime,
                    })

                }
            }
        }
    }

    async queryAboutMeByAdminUserId() {
        const {ctx} = this
        let {adminUserId} = ctx.request.body
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.aboutMe.queryAboutMeByAdminUserId(adminUserId)
        if (result) {
            ctx.success([result])
        } else {
            ctx.success([])
        }
    }

    /**
     * 删除接口传入的参数是一个uid的数组
     * 数据库设计的时候，所有的主键规定都为uid，由服务端自行生成，
     * （除非中间表，不需要维护主键，选择id自增，由数据库自己维护）
     */
    async deleteAboutMeByUid() {
        const {ctx} = this
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteAboutMeByUidValidator(uids)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.aboutMe.deleteAboutMeByUid(uids)
            if (result) {
                ctx.success()


            }
        }
    }

    async queryAboutMePage() {
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
            adminUserId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
        const {errorMsg, isValid} = queryAboutMePageValidator(currentPage, pageSize)

        /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
        adminUserId = adminUserId ? adminUserId : ''
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
            adminUserId, orderNum
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.aboutMe.queryAboutMePage(params)
            let {total} = await ctx.service.aboutMe.queryAllCountAboutMe(params)
            let newResult = {
                result,
                total,
                currentPage,
                pageSize,
            }
            ctx.success(newResult)
        }
    }

    async updateAboutMeByUid() {
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
            uid, adminUserId, introDetail, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
        const {errorMsg, isValid} = updateAboutMeByUidValidator(
            uid, adminUserId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        adminUserId = adminUserId ? adminUserId : ''
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
            uid, adminUserId, introDetail, orderNum,
            updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            // 补充参数
            let {create_time} = await ctx.service.aboutMe.queryAboutMeByUid(uid)
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.aboutMe.updateAboutMeByUid(params)
            if (result) {
                ctx.success()

                /*保存 timeLine */
                await ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: ctx.request.header.username,
                    user_id: ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_system_about_me',
                    item_name: 'nothing',
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


            }
        }

    }

    async queryAboutMeAll() {

        const {ctx} = this
        const result = await ctx.service.aboutMe.queryAboutMeAll()

        ctx.success(result)

    }
}

module.exports = AboutMeController;
