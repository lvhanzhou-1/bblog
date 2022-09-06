'use strict';

const Controller = require('egg').Controller;

const {
    saveSpecialPartSectionValidator,
    deleteSpecialPartSectionByUidValidator,
    updateSpecialPartSectionByUidValidator,
    querySpecialPartSectionPageValidator,
} = require('../validation/specialPartSection')
const resCode = require('../constant/resCode')
// const articleController = require('../controller/article')

const {SPECIAL ,APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')


class SpecialPartSectionController extends Controller {

    async saveSpecialPartSection() {
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
            sectionTitle, specialPartId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        const {errorMsg, isValid} = saveSpecialPartSectionValidator(
            sectionTitle, specialPartId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        sectionTitle = sectionTitle ? sectionTitle : ''
        specialPartId = specialPartId ? specialPartId : ''
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
            uid, sectionTitle, specialPartId, orderNum,
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
            let result = await ctx.service.specialPartSection.querySpecialPartSectionBySectionTitle(sectionTitle, specialPartId)

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
                ctx.fail(resCode.get(SPECIAL.SPECIAL_SECTION_TITLE_ALREADY_EXISTS))

            } else {
                let flag = await ctx.service.specialPartSection.saveSpecialPartSection(params)
                if (flag) {
                    ctx.success()

                    /*保存 timeLine */
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_special_part_section',
                        item_name:`${sectionTitle}`,
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
    async deleteSpecialPartSectionByUid() {
        const {ctx} = this
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteSpecialPartSectionByUidValidator(ctx.request.body)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.specialPartSection.deleteSpecialPartSectionByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async querySpecialPartSectionPage() {
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
            sectionTitle, specialPartId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
        const {errorMsg, isValid} = querySpecialPartSectionPageValidator(currentPage, pageSize)

        /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
        sectionTitle = sectionTitle ? sectionTitle : ''
        specialPartId = specialPartId ? specialPartId : ''
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
            sectionTitle, specialPartId, orderNum
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.specialPartSection.querySpecialPartSectionPage(params)
            let {total} = await ctx.service.specialPartSection.queryAllCountSpecialPartSection(params)
            let newResult = {
                result,
                total,
                currentPage,
                pageSize,
            }
            ctx.success(newResult)
        }
    }

    async updateSpecialPartSectionByUid() {
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
            uid, sectionTitle, specialPartId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
        const {errorMsg, isValid} = updateSpecialPartSectionByUidValidator(
            uid, sectionTitle, specialPartId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        sectionTitle = sectionTitle ? sectionTitle : ''
        specialPartId = specialPartId ? specialPartId : ''
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
            uid, sectionTitle, specialPartId, orderNum,
            updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            // 补充参数
            let {create_time} = await ctx.service.specialPartSection.querySpecialPartSectionByUid(uid)
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.specialPartSection.updateSpecialPartSectionByUid(params)
            if (result) {
                ctx.success()

                /*保存 timeLine */
                await this.ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: this.ctx.request.header.username,
                    user_id: this.ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_special_part_section',
                    item_name:`${sectionTitle}`,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


            }
        }

    }

    async querySpecialPartSectionAll() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.specialPartSection.querySpecialPartSectionAll()
        ctx.success(result)
    }

    async querySpecialPartSectionTree() {
        const {ctx} = this
        // 判断是否是管理员，为了排除私密文章
        let isXzzOrCheny = await this.isXzzOrCheny(ctx)
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.specialPartSection.querySpecialPartSectionTree(isXzzOrCheny)
        ctx.success(result)
    }

    async querySpecialPartSectionBlogTreeBySpecialUid() {
        const {ctx} = this
        // 判断是否是管理员，为了排除私密文章
        let isXzzOrCheny = await this.isXzzOrCheny(ctx)
        console.log(ctx.params, 'ctx.params')
        let {uid} = ctx.params
        let result = await ctx.service.specialPartSection.querySpecialPartSectionBlogTreeBySpecialUid(uid, isXzzOrCheny)
        ctx.success(result)
    }

    async querySpecialPartSectionTree2() {
        const {ctx} = this
        // 判断是否是管理员，为了排除私密文章
        let isXzzOrCheny = await this.isXzzOrCheny(ctx)
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.specialPartSection.querySpecialPartSectionTree2(isXzzOrCheny)
        ctx.success(result)
    }
// 判断是否是管理员
    async isXzzOrCheny() {
        const {ctx} = this
        let {client, userid} = ctx.request.header

        let isChenyOrXzz = false // 判断是否是管理员

        if (userid) { // 如果有userid，说明是登录过的，获取这个用户的身份，看是否是管理员
            switch (client) {
                case 'web':
                    let {user_identity} = await ctx.service.webUser.queryWebUserByUid(userid)
                    // -1是小陈 -2是小夏
                    // if (user_identity === -1 || user_identity === -2) {
                    if (user_identity === -1) {
                        isChenyOrXzz = true
                    }
                    break
                case 'admin':
                    isChenyOrXzz = true
                    break
            }
        }

        return isChenyOrXzz
    }

}

module.exports = SpecialPartSectionController;
