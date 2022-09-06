const Service = require('egg').Service;
const {

    updateArticleRecommendByUidSql,
} = require('../sql/articleRecommend')


class ArticleRecommend extends Service {
    async updateArticleRecommendByUid(articleList) {
        let promiseArr = []

        for (const article of articleList) {
            const {uid, recommendLevel, order, updateTime} = article
            const params = {uid, recommendLevel, order, updateTime}
            promiseArr.push(
                (
                    async (params) => {
                        let {
                            uid, recommendLevel, order, updateTime
                        } = params

                        return await this.app.mysql.query(
                            updateArticleRecommendByUidSql,
                            [
                                recommendLevel, order, updateTime, uid
                            ]
                        )
                    }
                )
                (params)
            )
        }

        return await Promise.all(promiseArr)

    }


}

module.exports = ArticleRecommend;
