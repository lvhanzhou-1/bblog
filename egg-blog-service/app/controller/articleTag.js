'use strict';

const Controller = require('egg').Controller;
const {
    saveArticleTagValidator,
    deleteArticleTagByUidValidator,
} = require('../validation/articleTag')
const resCode = require('../constant/resCode')
const {ARTICLE, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require("dayjs");

class ArticleTagController extends Controller {
    async saveArticleTag() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let {tagName, order} = ctx.request.body
        if (!order) {
            order = 0
        }
        console.log(ctx.request.body, 'ctx.request.body')
        // 参数校验
        const {errorMsg, isValid} = saveArticleTagValidator(tagName)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let uid = generateUuid()
            let result = await ctx.service.articleTag.queryArticleTagByTagName(tagName)
            if (result) { // 标签名已存在，不保存
                ctx.fail(resCode.get(ARTICLE.ARTICLE_TAG_ALREADY_EXISTS))
            } else {
                let flag = await ctx.service.articleTag.saveArticleTag(uid, tagName, order)
                if (flag) {
                    ctx.success()

                    // console.log(ctx.request.header);
                    await ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: ctx.request.header.username,
                        user_id: ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_blog_tag',
                        item_name: tagName,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })
                }
            }
        }
    }

    async deleteArticleTagByUid() {
        const {ctx} = this

        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteArticleTagByUidValidator(uids)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.articleTag.deleteArticleTagByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async updateArticleTagByUid() {
        const {ctx} = this

        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let {uid, tagName, order} = ctx.request.body
        console.log(ctx.request.body, 'ctx.request.body')
        const {errorMsg, isValid} = saveArticleTagValidator(tagName)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            // 根据uid修改这条记录
            let result = await ctx.service.articleTag.updateArticleTagByUid(uid, tagName, order)
            if (result) {
                ctx.success()

                await ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: ctx.request.header.username,
                    user_id: ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_blog_tag',
                    item_name: tagName,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })
            }
        }
    }


    async queryArticleTagPage() {
        const {ctx} = this

        let {currentPage, pageSize, tagName} = ctx.request.body
        if (!tagName) { // 模糊查询，如果没有，就传个空字符串
            tagName = ''
        }
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleTag.queryArticleTagPage(+currentPage, +pageSize, tagName)
        let {total} = await ctx.service.articleTag.queryAllCountArticleTag()
        let newResult = {
            result,
            total,
            currentPage,
            pageSize,
        }
        ctx.success(newResult)
    }



    async queryHotArticleTagPage() {
        const {ctx} = this

        let {
            currentPage, pageSize,
            tagName, clicks, orderNum
        } = ctx.request.body

        tagName = tagName ? tagName : ''
        clicks = clicks ? clicks : '%'
        orderNum = orderNum ? orderNum : '%'

        let params = {
            currentPage: +currentPage,
            pageSize: +pageSize,
            tagName, clicks, orderNum
        }


        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleTag.queryHotArticleTagPage(params)


        ctx.success(result)
    }

    async queryArticleTagAll() {
        const {ctx} = this

        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleTag.queryArticleTagAll()

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

    async queryArticleTagAll2() {
        const {ctx} = this
        // 判断是否是管理员，为了排除私密文章
        let isXzzOrCheny = await this.isXzzOrCheny(ctx)
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleTag.queryArticleTagAll2(isXzzOrCheny)
        ctx.success(result)
    }

}

module.exports = ArticleTagController;
