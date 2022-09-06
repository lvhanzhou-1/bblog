'use strict';

const Controller = require('egg').Controller;

const {
    saveBlogLikeValidator,
    deleteBlogLikeByUidValidator,
    updateBlogLikeByUidValidator,
    queryBlogLikePageValidator,
} = require('../validation/blogLike')

const resCode = require('../constant/resCode')
const {ARTICLE, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')


class BlogLikeController extends Controller {
    async saveBlogLike() {
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
            blogId, likePersonId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$保存接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        const {errorMsg, isValid} = saveBlogLikeValidator(
            blogId, likePersonId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$新增接口，未传递参数设置默认值$
         * 模式解析方式：提取出解析过的数据表中，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        blogId = blogId ? blogId : ''
        likePersonId = likePersonId ? likePersonId : ''
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
            uid, blogId, likePersonId, orderNum,
            createTime, updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let flag = await ctx.service.blogLike.saveBlogLike(params)
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
    async deleteBlogLikeByUid() {
        const {ctx} = this
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteBlogLikeByUidValidator(ctx.request.body)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.blogLike.deleteBlogLikeByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async queryBlogLikePage() {
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
            blogId, likePersonId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')
        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$分页查询接口，参数校验参数接收$
         * 模式解析方式：只需校验 currentPage, pageSize
         *
         */
        const {errorMsg, isValid} = queryBlogLikePageValidator(currentPage, pageSize)

        /**
         * 模糊查询，如果前台没有传入，就设置为空字符串
         *
         * 模式：$分页查询接口，未传递参数设置空字符串$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值，且默认值不为null的字段，替换为小驼峰格式字符串
         *
         */
        blogId = blogId ? blogId : ''
        likePersonId = likePersonId ? likePersonId : ''
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
            blogId, likePersonId, orderNum
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.blogLike.queryBlogLikePage(params)
            let {total} = await ctx.service.blogLike.queryAllCountBlogLike(params)
            let newResult = {
                result,
                total,
                currentPage,
                pageSize,
            }
            ctx.success(newResult)
        }
    }

    async queryBlogLikeAll2() {
        const {ctx} = this
        let {
            blogId, likePersonId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        blogId = blogId ? blogId : ''
        likePersonId = likePersonId ? likePersonId : ''
        orderNum = orderNum ? orderNum : '%'


        /**
         * 封装好处理过的参数
         *
         * 模式：$分页查询接口，封装处理过的参数$
         * 模式解析方式：提取解析过的数据表，默认值不为null的字段，将连字符变量，替换为为小驼峰格式字符串，
         *
         */
        let params = {
            blogId, likePersonId, orderNum
        }

        let result = await ctx.service.blogLike.queryBlogLikeAll2(params)
        ctx.success(result)
    }


    async updateBlogLikeByUid() {
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
            uid, blogId, likePersonId, orderNum
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        /**
         * 这里把需要校验的参数传递进去
         *
         * 模式：$更新接口，参数校验参数接收$
         * 模式解析方式：提取出解析过的数据表，属性为必填的字段，替换为为小驼峰格式字符串，排除 createTime,updateTime
         *
         */
        const {errorMsg, isValid} = updateBlogLikeByUidValidator(
            uid, blogId, likePersonId
        )

        /**
         * 为一些参数设置默认值，根据数据表中的默认值设置
         *
         * 模式：$更新接口，未传递参数设置默认值$
         * 模式解析方式：提取出所有解析过的数据表字段，有默认值的字段，替换为小驼峰格式字符串，排除 uid,createTime,updateTime
         *
         */
        blogId = blogId ? blogId : ''
        likePersonId = likePersonId ? likePersonId : ''
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
            uid, blogId, likePersonId, orderNum,
            updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            // 补充参数
            let {create_time} = await ctx.service.blogLike.queryBlogLikeByUid(uid)
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.blogLike.updateBlogLikeByUid(params)
            if (result) {
                ctx.success()
            }
        }

    }

    async queryBlogLikeAll() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.blogLike.queryBlogLikeAll()
        ctx.success(result)
    }

}

module.exports = BlogLikeController
