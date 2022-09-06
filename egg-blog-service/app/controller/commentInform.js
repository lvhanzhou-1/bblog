'use strict';

const Controller = require('egg').Controller;

const {
    saveCommentInformValidator,
    deleteCommentInformByUidValidator,
    updateCommentInformByUidValidator,
    queryCommentInformPageValidator,
} = require('../validation/commentInform')

const resCode = require('../constant/resCode')
const {SYSTEM, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')


class CommentInformController extends Controller {

    async saveCommentInform() {
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
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        const {errorMsg, isValid} = saveCommentInformValidator(
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        informType = informType ? informType : 3
        informReason = informReason ? informReason : ''
        informPersonId = informPersonId ? informPersonId : ''
        informCommentId = informCommentId ? informCommentId : ''
        commentSource = commentSource ? commentSource : 1
        sourceId = sourceId ? sourceId : ''
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
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId, orderNum,
            createTime, updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let flag = await ctx.service.commentInform.saveCommentInform(params)
            if (flag) {
                ctx.success()
            }
        }
    }

    /**
     * 删除接口传入的参数是一个uid的数组
     * 数据库设计的时候，所有的主键规定都为uid，由服务端自行生成，
     * （除非中间表，不需要维护主键，选择id自增，由数据库自己维护）
     */
    async deleteCommentInformByUid() {
        const {ctx} = this

        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteCommentInformByUidValidator(ctx.request.body)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.commentInform.deleteCommentInformByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async queryCommentInformPage() {
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
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
        const {errorMsg, isValid} = queryCommentInformPageValidator(currentPage, pageSize)

        /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
        informType = informType ? informType : '%'
        informReason = informReason ? informReason : ''
        informPersonId = informPersonId ? informPersonId : ''
        informCommentId = informCommentId ? informCommentId : ''
        commentSource = commentSource ? commentSource : '%'
        sourceId = sourceId ? sourceId : ''
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
            informType, informReason, informPersonId, informCommentId,
            commentSource, sourceId, orderNum
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.commentInform.queryCommentInformPage(params)
            let {total} = await ctx.service.commentInform.queryAllCountCommentInform(params)
            let newResult = {
                result,
                total,
                currentPage,
                pageSize,
            }
            ctx.success(newResult)
        }
    }

    async updateCommentInformByUid() {
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
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
        const {errorMsg, isValid} = updateCommentInformByUidValidator(
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        informType = informType ? informType : 3
        informReason = informReason ? informReason : ''
        informPersonId = informPersonId ? informPersonId : ''
        informCommentId = informCommentId ? informCommentId : ''
        commentSource = commentSource ? commentSource : 1
        sourceId = sourceId ? sourceId : ''
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
            uid, informType, informReason, informPersonId,
            informCommentId, commentSource, sourceId, orderNum,
            updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            // 补充参数
            let {create_time} = await ctx.service.commentInform.queryCommentInformByUid(uid)
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.commentInform.updateCommentInformByUid(params)
            if (result) {
                ctx.success()
            }
        }

    }

    async queryCommentInformAll() {
        const {ctx} = this

        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.commentInform.queryCommentInformAll()
        ctx.success(result)
    }

}

module.exports = CommentInformController;
