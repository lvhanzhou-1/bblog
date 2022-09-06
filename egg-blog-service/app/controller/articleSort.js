'use strict';

const Controller = require('egg').Controller;

const {
    saveArticleSortValidator,
    deleteArticleSortByUidValidator,
} = require('../validation/articleSort')
const resCode = require('../constant/resCode')
const {ARTICLE, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require("dayjs");


class ArticleSortController extends Controller {
    async saveArticleSort() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let {sortName, intro, order} = ctx.request.body
        if (!order) {
            order = 0
        }
        console.log(ctx.request.body, 'ctx.request.body')
        // 参数校验
        const {errorMsg, isValid} = saveArticleSortValidator(sortName)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let uid = generateUuid()
            let result = await ctx.service.articleSort.queryArticleSortBySortName(sortName)
            if (result) { // 分类名已存在，不保存
                ctx.fail(resCode.get(ARTICLE.ARTICLE_SORT_ALREADY_EXISTS))
            } else {
                let flag = await ctx.service.articleSort.saveArticleSort(uid, sortName, intro, order)
                if (flag) {
                    ctx.success()

                    /*=========*/
                    await ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: ctx.request.header.username,
                        user_id: ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_blog_sort',
                        item_name: sortName,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })


                }
            }
        }
    }

    async deleteArticleSortByUid() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteArticleSortByUidValidator(uids)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.articleSort.deleteArticleSortByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async updateArticleSortByUid() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let {uid, sortName, intro, order} = ctx.request.body
        console.log(ctx.request.body, 'ctx.request.body')
        const {errorMsg, isValid} = saveArticleSortValidator(sortName)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            // 根据uid修改这条记录
            let result = await ctx.service.articleSort.updateArticleSortByUid(uid, sortName, intro, order)
            if (result) {
                ctx.success()

                /*=========*/
                await ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: ctx.request.header.username,
                    user_id: ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_blog_sort',
                    item_name: sortName,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })
            }
        }

    }

    async queryArticleSortPage() {
        const {ctx} = this
        let {currentPage, pageSize, sortName} = ctx.request.body
        if (!sortName) { // 模糊查询，如果没有，就传个空字符串
            sortName = ''
        }
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleSort.queryArticleSortPage(+currentPage, +pageSize, sortName)
        let {total} = await ctx.service.articleSort.queryAllCountArticleSort()
        let newResult = {
            result,
            total,
            currentPage,
            pageSize,
        }
        ctx.success(newResult)
    }

    async queryArticleSortAll() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleSort.queryArticleSortAll()
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
    async queryArticleSortAll2() {
        const {ctx} = this
        // 判断是否是管理员，为了排除私密文章
        console.log('!');
        let isXzzOrCheny = await this.isXzzOrCheny(ctx)
        console.log(isXzzOrCheny);
        console.log('!');
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.articleSort.queryArticleSortAll2(isXzzOrCheny)
        ctx.success(result)
    }
}

module.exports = ArticleSortController;
