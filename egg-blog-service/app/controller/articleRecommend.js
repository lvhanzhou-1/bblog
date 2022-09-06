'use strict';
const {
    updateArticleRecommendByUidValidator,
} = require('../validation/articleRecommend')
const resCode = require('../constant/resCode')

const {APP} = require('../constant/resCodeVariable')
const dayjs = require('dayjs')


const Controller = require('egg').Controller;

class ArticleRecommendController extends Controller {
    async updateArticleRecommendByUid() {
        const {ctx} = this
        let articleList = ctx.request.body

        const {errorMsg, isValid} = updateArticleRecommendByUidValidator(articleList)

        // 补充参数
        const updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

        articleList = articleList.map(item => {
            item.updateTime = updateTime
            return item
        })

        if (!isValid) { // 校验不通过
            ctx.fail(resCode.get(APP.PARAMETER_INVALID), errorMsg)
        } else {
            let result = await ctx.service.articleRecommend.updateArticleRecommendByUid(articleList)
            if (result) {
                ctx.success()
            }
        }

    }
}

module.exports = ArticleRecommendController;
