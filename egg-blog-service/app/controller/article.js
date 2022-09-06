'use strict';

const Controller = require('egg').Controller;

const {
    saveArticleValidator,
    deleteArticleByUidValidator,
    updateArticleByUidValidator,
    exportArticleValidator,
    queryArticleByRecommendLevelValidator,
} = require('../validation/article')

const resCode = require('../constant/resCode')
const {ARTICLE, APP} = require('../constant/resCodeVariable')
const generateUuid = require('../utils/generateUuid')
const dayjs = require('dayjs')
const fs = require('fs')
const marked = require('marked') // md -> html


class ArticleController extends Controller {


    async queryLatestArticleTime() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.article.queryLatestArticleTime()

        if (result) {
            result = result['max(create_time)']


        } else {
            result = ''
        }
        ctx.success(result)
    }

    async queryArticleCount() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.article.queryArticleAll()
        let res = 0
        if (result.length) {
            res = result.length
        } else {
            res = 0
        }
        ctx.success(res)
    }

    async updateArticleByUid() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let {
            uid, blogTitle, blogSummary, originAddress, isOriginal, blogSortId,
            recommendLevel, order, isOpenComment, isPrivate, blogStatus,
            coverUrl, blogContent, blogTagIds
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')

        const {
            errorMsg,
            isValid
        } = updateArticleByUidValidator(uid, blogTitle)
        // 为一些参数设置默认值，根据业务设置
        blogSummary = blogSummary ? blogSummary : ''
        originAddress = originAddress ? originAddress : ''
        blogSortId = blogSortId ? blogSortId : ''
        recommendLevel = recommendLevel ? recommendLevel : '-1'
        order = order ? order : '0'
        isOpenComment = isOpenComment ? isOpenComment : '2'
        isPrivate = isPrivate ? isPrivate : '2'
        blogStatus = blogStatus ? blogStatus : '2'
        blogContent = blogContent ? blogContent : ''
        isOriginal = isOriginal ? isOriginal : '1'
        blogTagIds = blogTagIds ? blogTagIds : []

        // 补充参数
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        // 封装好处理过的参数
        let params = {
            uid, blogTitle, blogSummary, originAddress, isOriginal, blogSortId,
            recommendLevel, order, isOpenComment, isPrivate, blogStatus,
            coverUrl, blogContent, blogTagIds, updateTime
        }

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {

            let {blog_author_id, create_time} = await ctx.service.article.queryArticleByUid(uid)
            // 补充参数
            params.blogAuthorId = blog_author_id
            params.createTime = create_time

            // 根据uid修改这条记录
            let result = await ctx.service.article.updateArticleByUid(params)
            if (result) {
                ctx.success()


                /*========*/
                await ctx.service.timeLine.saveTimeLine({
                    uuid: generateUuid(),
                    user_name: ctx.request.header.username,
                    user_id: ctx.request.header.userid,
                    method: 'update',
                    database_name: 't_blog',
                    item_name: blogTitle,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                })


            }
        }

    }

    async saveArticle() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */

        let {
            blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, order, isOpenComment, isPrivate, blogStatus,
            coverUrl, blogContent, blogTagIds
        } = ctx.request.body

        // 参数校验
        const {errorMsg, isValid} = saveArticleValidator(blogTitle)

        // 为一些参数设置默认值，根据业务设置
        blogSummary = blogSummary ? blogSummary : ''
        originAddress = originAddress ? originAddress : ''
        blogAuthorId = blogAuthorId ? blogAuthorId : ctx.state.user.uid
        blogSortId = blogSortId ? blogSortId : ''
        recommendLevel = recommendLevel ? recommendLevel : '-1'
        order = order ? order : '0'
        isOpenComment = isOpenComment ? isOpenComment : '2'
        isPrivate = isPrivate ? isPrivate : '2'
        blogStatus = blogStatus ? blogStatus : '2'
        blogContent = blogContent ? blogContent : ''
        isOriginal = isOriginal ? isOriginal : '1'
        blogTagIds = blogTagIds ? blogTagIds : []

        // 补充参数
        const uid = generateUuid()
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        // 封装好处理过的参数
        const params = {
            uid, blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, order, isOpenComment, isPrivate, blogStatus,
            coverUrl, blogContent, blogTagIds, createTime, updateTime
        }


        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.article.queryArticleByBlogTitle(blogTitle)
            if (result) { // 博客标题已存在，不保存
                ctx.fail(resCode.get(ARTICLE.ARTICLE_TITLE_ALREADY_EXISTS))
            } else {
                let flag = await ctx.service.article.saveArticle(params)
                if (flag) {
                    ctx.success()


                    await ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: ctx.request.header.username,
                        user_id: ctx.request.header.userid,
                        method: 'save',
                        database_name: 't_blog',
                        item_name: blogTitle,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })

                }
            }
        }
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

    async queryArticlePage() {
        const {ctx} = this
        let {
            currentPage, pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag,
            createTime
        } = ctx.request.body


        let isChenyOrXzz = await this.isXzzOrCheny(ctx) // 判断是否是管理员

        // 模糊查询，如果没有，就传入空字符串
        // int类型的数据不带%，因为需要精准查
        // varchar类型的数据带%，因为需要模糊查
        // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
        blogTitle = blogTitle ? blogTitle : ''
        blogAuthorId = blogAuthorId ? blogAuthorId : '%'
        isOriginal = isOriginal ? isOriginal : '%'
        blogSortId = blogSortId ? blogSortId : '%'
        recommendLevel = recommendLevel ? recommendLevel : '%'
        isOpenComment = isOpenComment ? isOpenComment : '%'

        if (isChenyOrXzz) { // 如果是管理员的话
            isPrivate = isPrivate ? isPrivate : '%'
        } else { // 如果不是管理员 或者 未登录的话，只能看公开的文章
            isPrivate = '2'
        }

        blogStatus = blogStatus ? blogStatus : '%'

        blogTag = blogTag ? blogTag : ''
        createTime = createTime ? createTime : ''


        // 封装好处理过的参数
        let params = {
            currentPage: +currentPage,
            pageSize: +pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag,
            createTime
        }

        let result = await ctx.service.article.queryArticlePage(params)
        let total = await ctx.service.article.queryAllCountArticle(params)
        let newResult = {
            result,
            total,
            currentPage,
            pageSize,
        }
        ctx.success(newResult)
    }

    async queryArticleAll2() {
        const {ctx} = this
        let {
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag
        } = ctx.request.body


        // 模糊查询，如果没有，就传入空字符串
        // int类型的数据不带%，因为需要精准查
        // varchar类型的数据带%，因为需要模糊查
        // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
        blogTitle = blogTitle ? blogTitle : ''
        blogAuthorId = blogAuthorId ? blogAuthorId : '%'
        isOriginal = isOriginal ? isOriginal : '%'
        blogSortId = blogSortId ? blogSortId : '%'
        recommendLevel = recommendLevel ? recommendLevel : '%'
        isOpenComment = isOpenComment ? isOpenComment : '%'
        isPrivate = isPrivate ? isPrivate : '%'
        blogStatus = blogStatus ? blogStatus : '%'

        blogTag = blogTag ? blogTag : ''


        // 封装好处理过的参数
        let params = {
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag
        }

        let result = await ctx.service.article.queryArticleAll2(params)

        ctx.success(result)
    }

    async queryArticleByUid() {
        const {ctx} = this
        let {uid} = ctx.params

        let result = await ctx.service.article.queryArticleByUid2(uid)

        await ctx.service.article.updateArticleClicksByUid(uid)

        ctx.success(result)

    }


    async queryHotArticlePage() {
        const {ctx} = this
        let {
            currentPage, pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag
        } = ctx.request.body

        console.log(ctx.request.body, 'ctx.request.body')


        // 模糊查询，如果没有，就传入空字符串
        // int类型的数据不带%，因为需要精准查
        // varchar类型的数据带%，因为需要模糊查
        // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
        blogTitle = blogTitle ? blogTitle : ''
        blogAuthorId = blogAuthorId ? blogAuthorId : '%'
        isOriginal = isOriginal ? isOriginal : '%'
        blogSortId = blogSortId ? blogSortId : '%'
        recommendLevel = recommendLevel ? recommendLevel : '%'
        isOpenComment = isOpenComment ? isOpenComment : '%'
        isPrivate = isPrivate ? isPrivate : '%'
        blogStatus = blogStatus ? blogStatus : '%'

        blogTag = blogTag ? blogTag : ''


        // 封装好处理过的参数
        let params = {
            currentPage: +currentPage,
            pageSize: +pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, blogTag
        }

        let result = await ctx.service.article.queryHotArticlePage(params)

        ctx.success(result)
    }

    async deleteArticleByUid() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：保存成功
         *    校验不通过：返回错误信息
         */
        let uids = ctx.request.body
        console.log(uids, 'uids')
        const {errorMsg, isValid} = deleteArticleByUidValidator(ctx.request.body)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.article.deleteArticleByUid(uids)
            if (result) {
                ctx.success()
            }
        }
    }

    async queryArticleByRecommendLevel() {
        const {ctx} = this
        /**
         * 1、接收参数
         * 2、校验参数
         *    校验通过：返回查询结果
         *    校验不通过：返回错误信息
         */
        let {recommendLevel} = ctx.query
        console.log(ctx.query, 'recommendLevel2')
        const {errorMsg, isValid} = queryArticleByRecommendLevelValidator(recommendLevel)

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.article.queryArticleByRecommendLevel(recommendLevel)
            ctx.success(result)
        }
    }

    /**
     * 导入文章
     */
    async importArticle() {
        const {ctx} = this
        let file = ctx.request.files[0]

        // 解析md文件
        let txt = fs.readFileSync(file.filepath, 'utf8')

        /*
        * 将读取到的txt中的图片链接替换为线上的链接
        * 1、获取到当天上传的图片名，和可访问的图片链接
        * 2、将名字相同的替换成线上链接
        * */
        // console.log(txt)

        const createTime = dayjs().format('YYYY-MM-DD')
        const todayPictures = await ctx.service.file.queryAllFile('', createTime)

        if (todayPictures.length > 0) {
            let pictures = todayPictures[0].files
            txt = ctx.service.article.convertTxtPictureLink(pictures, txt)
        }
        ctx.request.body.blogContent = marked(txt)
        await this.saveArticle(ctx)
    }

    /**
     * 导出文章
     * 参考：https://segmentfault.com/a/1190000023731567
     */
    async exportArticle() {
        const {ctx} = this
        let uids = ctx.request.body
        console.log(ctx.request.body, 'ctx.request.body')

        const {errorMsg, isValid} = exportArticleValidator(ctx.request.body)
        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.article.exportArticle(uids)
            if (result) {
                ctx.body = result
            }
        }
    }


    async queryArticleAll() {
        const {ctx} = this
        console.log(ctx.request.body, 'ctx.request.body')
        let result = await ctx.service.article.queryArticleAll()
        ctx.success(result)
    }

    async queryRecommendArticleByRecommendLevel() {
        const {ctx} = this
        let {levelId} = ctx.params
        console.log(ctx.params, 'ctx.params')
        let result = await ctx.service.article.queryRecommendArticleByRecommendLevel(levelId)
        ctx.success(result)
    }

    async queryAllArticleCreateTimeList() {
        const {ctx} = this
        // 判断是否是管理员，把私密文章排除掉
        let isChenyOrXzz = await this.isXzzOrCheny(ctx) // 判断是否是管理员

        let result = await ctx.service.article.queryAllArticleCreateTimeList(isChenyOrXzz)
        ctx.success(result)
    }
}

module.exports = ArticleController;
