const Service = require('egg').Service;

const {
    queryLatestArticleTimeSql,
    saveArticleSql,
    deleteArticleByUidSql,
    deleteArticleTagByArticleUidSql,
    updateArticleByUidSql,
    queryArticlePageSql,
    queryArticlePageSql2,
    queryAllCountArticleSql,
    saveArticleTagSql,
    queryArticleByBlogTitleSql,
    queryArticleByUidSql,
    queryArticleTagIdsByArticleUidSql,
    queryArticleByRecommendLevelSql,
    queryArticleAllSql,
    queryRecommendArticleByRecommendLevelSql,
    queryHotArticlePageSql,
    queryArticleAll2Sql,
    queryAllArticleCreateTimeListSql,
    queryAllArticleCreateTimeListSql2,
    queryArticleByUidSql2,
    updateArticleClicksByUidSql,
} = require('../sql/article')
const dayjs = require('dayjs')
const {dealTableData} = require('../utils/toolsFunction')
// html -> md
const TurndownService = require('turndown')
const JSZip = require("jszip");
const generateUuid = require("../utils/generateUuid");

class Article extends Service {
    /*补充，查询相隔天数*/
    async queryLatestArticleTime() {
        let resultArr = await this.app.mysql.query(queryLatestArticleTimeSql, [])
        return resultArr[0]
    }

    async queryArticleByBlogTitle(blogTitle) {
        let resultArr = await this.app.mysql.query(queryArticleByBlogTitleSql, [blogTitle])
        return resultArr[0]
    }

    async queryArticleByUid(uid) {
        let resultArr = await this.app.mysql.query(queryArticleByUidSql, [uid])
        return resultArr[0]
    }

    async updateArticleClicksByUid(uid) {
        return await this.app.mysql.query(updateArticleClicksByUidSql, [uid])
    }

    async queryArticleByUid2(uid) {
        const data = await this.app.mysql.query(
            queryArticleByUidSql2,
            [uid])
        return dealTableData(['blog_tag_id', 'tag_name'], data, 'blog_tags')
    }


    async queryArticleTagIdsByArticleUid(uid) {
        let resultArr = await this.app.mysql.query(queryArticleTagIdsByArticleUidSql, [uid])
        return resultArr
    }

    async saveArticle(params) {
        /**
         * 1、先插入文章
         * 2、再插入文章标签到数据库中
         */

        let {
            blogTagIds, uid, blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, order, isOpenComment, isPrivate, blogStatus,
            coverUrl, blogContent, createTime, updateTime
        } = params

        await this.app.mysql.query(
            saveArticleSql,
            [uid, blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
                recommendLevel, order, isOpenComment, isPrivate, blogStatus,
                coverUrl, blogContent, createTime, updateTime]
        )

        if (blogTagIds && blogTagIds.length > 0) {
            let promiseArr = []
            for (const blogTagId of blogTagIds) {
                promiseArr.push(
                    (async  (blogId, blogTagId, createTime)=> {
                        await this.app.mysql.query(saveArticleTagSql, [blogId, blogTagId, createTime, createTime])
                    })(uid, blogTagId, updateTime)
                )
            }
            await Promise.all(promiseArr)
        }
        return true
    }

    async queryAllCountArticle(params) {
        let {
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, createTime
        } = params

        const data = await this.app.mysql.query(
            queryAllCountArticleSql,
            [
                `%${blogTitle}%`,
                `${blogAuthorId}`,
                `${isOriginal}`,
                `${blogSortId}`,
                `${recommendLevel}`,
                `${isOpenComment}`,
                `${isPrivate}`,
                `${blogStatus}`,
                `%${createTime}%`,
            ])
        /**
         * 处理数据，tag有多个，拼接成数组
         */

        let result = dealTableData(['blog_tag_id', 'tag_name'], data, 'blog_tags')

        // 如果有tag 就再筛选一次
        const {blogTag} = params

        if (blogTag) {
            let result2 = []
            result.map(item => {
                item.blog_tags.map(tag => {
                    if (tag.blog_tag_id === blogTag) {
                        result2.push(item)
                    }
                })
            })

            return result2.length
        }

        return result.length

    }

    async queryArticlePage(params) {
        let {
            currentPage, pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus, createTime, blogTag
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        let data

        // 使用不同的sql
        if (blogTag) {
            // int类型的数据不带%，因为需要精准查
            // varchar类型的数据带%，因为需要模糊查
            // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
            data = await this.app.mysql.query(
                queryArticlePageSql2,
                [
                    `%${blogTitle}%`,
                    `${blogAuthorId}`,
                    `${isOriginal}`,
                    `${blogSortId}`,
                    `${recommendLevel}`,
                    `${isOpenComment}`,
                    `${isPrivate}`,
                    `${blogStatus}`,
                    `%${createTime}%`,
                    `${blogTag}`,
                    _currentPage,
                    pageSize,

                ])
        } else {
            // int类型的数据不带%，因为需要精准查
            // varchar类型的数据带%，因为需要模糊查
            // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
            data = await this.app.mysql.query(
                queryArticlePageSql,
                [
                    `%${blogTitle}%`,
                    `${blogAuthorId}`,
                    `${isOriginal}`,
                    `${blogSortId}`,
                    `${recommendLevel}`,
                    `${isOpenComment}`,
                    `${isPrivate}`,
                    `${blogStatus}`,
                    `%${createTime}%`,
                    _currentPage,
                    pageSize
                ])
        }
        // const data = await articleDao.queryArticlePage(params)
        /**
         * 处理数据，tag有多个，拼接成数组
         */

        let result = dealTableData(['blog_tag_id', 'tag_name'], data, 'blog_tags')

        // 如果有tag 就再筛选一次
        // const {blogTag} = params

        if (blogTag) {
            let result2 = []
            result.map(item => {
                item.blog_tags.map(tag => {
                    if (tag.blog_tag_id === blogTag) {
                        result2.push(item)
                    }
                })
            })

            return result2
        }

        return result
    }

    async queryArticleAll2(params) {

        let {
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus
        } = params

        let data

        // int类型的数据不带%，因为需要精准查
        // varchar类型的数据带%，因为需要模糊查
        // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
        data = await this.app.mysql.query(
            queryArticleAll2Sql,
            [
                `%${blogTitle}%`,
                `${blogAuthorId}`,
                `${isOriginal}`,
                `${blogSortId}`,
                `${recommendLevel}`,
                `${isOpenComment}`,
                `${isPrivate}`,
                `${blogStatus}`,
            ])

        // const data = await articleDao.queryArticleAll2(params)
        /**
         * 处理数据，tag有多个，拼接成数组
         */

        let result = dealTableData(['blog_tag_id', 'tag_name'], data, 'blog_tags')


        // 如果有tag 就再筛选一次
        const {blogTag} = params

        if (blogTag) {
            let result2 = []
            result.map(item => {
                item.blog_tags.map(tag => {
                    if (tag.blog_tag_id === blogTag) {
                        result2.push(item)
                    }
                })
            })

            return result2
        }

        return result
    }


    async queryHotArticlePage(params) {
        let {
            currentPage, pageSize,
            blogTitle, blogAuthorId, isOriginal, blogSortId,
            recommendLevel, isOpenComment, isPrivate, blogStatus
        } = params

        let _currentPage = (currentPage - 1) * pageSize

        // int类型的数据不带%，因为需要精准查
        // varchar类型的数据带%，因为需要模糊查
        // 在controller层赋值时，int类型没有值时，就赋值为%，有值时就取自己的值
        return await this.app.mysql.query(
            queryHotArticlePageSql,
            [
                `%${blogTitle}%`,
                `${blogAuthorId}`,
                `${isOriginal}`,
                `${blogSortId}`,
                `${recommendLevel}`,
                `${isOpenComment}`,
                `${isPrivate}`,
                `${blogStatus}`,
                _currentPage,
                pageSize
            ])
    }

    async updateArticleByUid(params) {
        /**
         * 1、根据博客uid更新数据
         * 2、比对博客标签，如果一样，不插入新标签，如果不同，删除之前标签，重新插入
         */
            //updateArticleByUid
        let {
                uid, blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
                recommendLevel, order, isOpenComment, isPrivate, blogStatus,
                coverUrl, blogContent, createTime, updateTime, blogTagIds
            } = params

        await this.app.mysql.query(
            updateArticleByUidSql,
            [blogTitle, blogSummary, originAddress, blogAuthorId, isOriginal, blogSortId,
                recommendLevel, order, isOpenComment, isPrivate, blogStatus,
                coverUrl, blogContent, createTime, updateTime, uid]
        )
        // await articleDao.updateArticleByUid(params)

        const findIds = await this.queryArticleTagIdsByArticleUid(uid)
        // 比较 标签是否一致，如果一致说明没有变更，就不更新了，如果不一致。就先删除原来的，再重新添加新的
        const flag = this.areTheTagsConsistent(findIds, blogTagIds)
        if (!flag) { // 如果不一致 删除原先的标签
            if (findIds.length > 0) {
                //deleteArticleTagByArticleUid
                await this.app.mysql.query(deleteArticleTagByArticleUidSql, [uid])
            }

            if (blogTagIds.length > 0) { // 如果此时有新添加的标签 新增进去
                for (const blogTagId of blogTagIds) {
                    await this.app.mysql.query(saveArticleTagSql, [uid, blogTagId, createTime, createTime])
                }
            }
        }
        return true
    }


    areTheTagsConsistent(findIds, blogTagIds) {

        const originalTagIds = findIds.reduce((prev, current) => {
            prev.push(current.blog_tag_id)
            return prev
        }, [])

        return originalTagIds.sort().toString() === blogTagIds.sort().toString()
    }


    async deleteArticleByUid(uids) {

        let promiseArr = []

        for (const uid of uids) {
            promiseArr.push((async (uid) => {

                    let {blog_title} = await this.ctx.service.article.queryArticleByUid(uid)
                    console.log('blog');
                    console.log(blog_title);
                    /*========*/
                    await this.ctx.service.timeLine.saveTimeLine({
                        uuid: generateUuid(),
                        user_name: this.ctx.request.header.username,
                        user_id: this.ctx.request.header.userid,
                        method: 'delete',
                        database_name: 't_blog',
                        item_name: blog_title,
                        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    })

                    return await this.app.mysql.query(deleteArticleByUidSql, [uid])
                })(uid)
            )
        }

        return await Promise.all(promiseArr)
    }

    async queryArticleByRecommendLevel(recommendLevel) {
        return await this.app.mysql.query(queryArticleByRecommendLevelSql, [recommendLevel])

    }

    async exportArticle(uids) {
        /**
         * 1、根据uid 查出所有文章的内容
         * 2、获取html->md对象
         * 3、获取jszip对象，待会好打成二进制的zip包，返回给前台
         * 4、将html文本转换为md文本，然后打包
         * 5、返回最终打包好的二进制zip文件
         */

        let promiseArr = []
        for (const uid of uids) {
            promiseArr.push((
                async  (uid) =>{
                    let resultArr = await this.app.mysql.query(queryArticleByUidSql, [uid])
                    return resultArr[0]
                }
            )(uid))
        }

        // 1、根据uid 查出所有文章的内容 mysql 不支持in查询，所以一个一个查，用promise.all获得最后的结果，保证所有数据都查寻完毕
        const findAllResult = await Promise.all(promiseArr)

        // 2、获取html->md对象
        const turndownService = new TurndownService({
            headingStyle: 'atx',
        })
        // 3、获取jszip对象，待会好打成二进制的zip包，返回给前台
        const zip = new JSZip()
        const folder = zip.folder(dayjs().format('YYYY-MM-DD HH-mm-ss')) // zip包里塞一个文件夹，不让文件裸奔

        // 4、将html文本转换为md文本，然后打包
        findAllResult.map(item => {
            const mdContent = turndownService.turndown(item.blog_content)
            folder.file(`${item.blog_title}.md`, mdContent) // 文件以 .md 结尾
        })

        // 5、返回最终打包好的二进制zip文件
        return await zip.generateAsync({type: 'nodebuffer'})

    }


    async queryArticleAll() {
        return await this.app.mysql.query(queryArticleAllSql, [])
    }

    async queryAllArticleCreateTimeList(isChenyOrXzz) {
        // 排除私密文章
        if (isChenyOrXzz) {
            return await this.app.mysql.query(queryAllArticleCreateTimeListSql, [])
        } else {
            return await this.app.mysql.query(queryAllArticleCreateTimeListSql2, [])
        }
    }


    async queryRecommendArticleByRecommendLevel(levelId) {
        return await this.app.mysql.query(queryRecommendArticleByRecommendLevelSql, [levelId])

        // return await articleDao.queryRecommendArticleByRecommendLevel(levelId)
    }

    convertTxtPictureLink(pictures, txt) {
        const reg = /\!\[(.*)\]\((.*)\)/g
        const picMap = this.picturesToMap(pictures)
        console.log(picMap, 'picMap')

        return txt.replace(reg, (_, a1, a2) => {
            if (picMap.has(a1)) {
                return `![${a1}](${picMap.get(a1)})`
            } else {
                return `![${a1}](${a2})`
            }
        })
    }

    picturesToMap(pictures) {
        let picMap = new Map()

        pictures.map(item => {
            picMap.set(item.fileName.replace(/\.\w+$/, ''), item.fileUrl)
        })

        return picMap
    }
}

module.exports = Article;
